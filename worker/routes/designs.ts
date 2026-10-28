import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import { getDb } from "../lib/db/client";
import { designs } from "../lib/db/schema";
import type { Env } from "../env";

export const designsRoute = new Hono<{ Bindings: Env }>();

// In-memory fallback store for local dev when D1/R2 are running standalone
const memoryDesigns: Array<{
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
}> = [];

// GET /api/designs?category=gates
designsRoute.get("/", async c => {
  const category = c.req.query("category");
  try {
    if (c.env.DB) {
      const db = getDb(c.env.DB);
      const rows = category
        ? await db.select().from(designs).where(eq(designs.category, category)).orderBy(desc(designs.createdAt))
        : await db.select().from(designs).orderBy(desc(designs.createdAt));
      return c.json({ designs: rows });
    }
  } catch {
    // fallback to memory
  }

  const filtered = category
    ? memoryDesigns.filter(d => d.category === category)
    : memoryDesigns;
  return c.json({ designs: filtered });
});

// POST /api/designs/auth - Verify admin password / PIN
designsRoute.post("/auth", async c => {
  const { password } = await c.req.json<{ password?: string }>();
  const correct = c.env.ADMIN_PASSWORD || "maruti123";
  if (password === correct) {
    // Generate a simple auth token
    const token = btoa(`admin:${Date.now()}:${correct}`);
    return c.json({ success: true, token });
  }
  return c.json({ error: "Invalid password" }, 401);
});

// POST /api/designs - Upload a new design (supports base64 image or multipart file)
designsRoute.post("/", async c => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.includes(btoa(`admin:`).slice(0, 6))) {
    // Basic auth check
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const body = await c.req.json<{
      category: string;
      title: string;
      description?: string;
      imageBase64?: string;
    }>();

    if (!body.category || !body.title || !body.imageBase64) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const id = "des_" + crypto.randomUUID().slice(0, 8);
    const createdAt = Date.now();
    let imageUrl = body.imageBase64; // Default to direct Base64 Data URL (works without any external cloud setup)

    // If R2 storage bucket is bound, store binary image in R2
    if (c.env.MEDIA_BUCKET && body.imageBase64.startsWith("data:")) {
      const [header, base64Data] = body.imageBase64.split(",");
      const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
      const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
      const binary = Uint8Array.from(atob(base64Data), ch => ch.charCodeAt(0));
      const key = `uploads/${id}.${ext}`;
      await c.env.MEDIA_BUCKET.put(key, binary, { httpMetadata: { contentType: mime } });
      imageUrl = `/api/designs/media/${key}`;
    }

    const newDesign = {
      id,
      category: body.category,
      title: body.title,
      description: body.description || "",
      imageUrl,
      createdAt
    };

    try {
      if (c.env.DB) {
        const db = getDb(c.env.DB);
        await db.insert(designs).values(newDesign);
      }
    } catch {
      // D1 not active in local standalone, keep in memory
    }

    memoryDesigns.unshift(newDesign);
    return c.json({ success: true, design: newDesign });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return c.json({ error: message }, 500);
  }
});

// DELETE /api/designs/:id
designsRoute.delete("/:id", async c => {
  const id = c.req.param("id");
  try {
    if (c.env.DB) {
      const db = getDb(c.env.DB);
      await db.delete(designs).where(eq(designs.id, id));
    }
  } catch {
    // fallback
  }

  const idx = memoryDesigns.findIndex(d => d.id === id);
  if (idx !== -1) memoryDesigns.splice(idx, 1);

  return c.json({ success: true });
});
