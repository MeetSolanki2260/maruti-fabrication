import { Hono } from "hono";
import type { Env } from "../env";
export const health = new Hono<{ Bindings: Env }>();
health.get("/", async c => {
  try { await c.env.DB.prepare("SELECT 1").first(); return c.json({ ok: true, db: true }); }
  catch { return c.json({ ok: false, db: false }, 503); }
});
health.all("/", c => c.json({ error: "Method not allowed" }, 405));
