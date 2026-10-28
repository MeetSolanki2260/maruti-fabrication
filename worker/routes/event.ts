import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../env";
import { EVENT_NAMES, LIMITS, WINDOW_MS } from "../../shared/constants";
import { isAllowedOrigin } from "../lib/security/origin";
import { getIp, hashValue } from "../lib/security/ip";
import { hitRateLimit } from "../lib/security/ratelimit";
import { getDb } from "../lib/db/client";
import { incrementEvent } from "../lib/db/queries/stats";
export const event = new Hono<{ Bindings: Env }>();
const schema = z.strictObject({ name: z.enum(EVENT_NAMES) });
event.post("/", async c => {
  if (!isAllowedOrigin(c.req.header("origin") ?? null, c.env.ALLOWED_ORIGINS)) return c.json({ error: "Forbidden" }, 403);
  if (!c.req.header("content-type")?.includes("application/json")) return c.json({ error: "Bad request" }, 415);
  const text = await c.req.text();
  if (text.length > 200) return c.json({ error: "Bad request" }, 413);
  let p; try { p = schema.safeParse(JSON.parse(text)); } catch { return c.json({ error: "Bad request" }, 400); }
  if (!p.success) return c.json({ error: "Bad request" }, 400);
  try {
    const key = "e:" + await hashValue(getIp(c.req.raw), c.env.IP_HASH_SALT);
    if (await hitRateLimit(c.env.DB, key, LIMITS.event, WINDOW_MS)) return c.json({ error: "Too many requests" }, 429);
    await incrementEvent(getDb(c.env.DB), p.data.name);
    return c.body(null, 204);
  } catch { return c.json({ error: "Service unavailable" }, 503); }
});
event.all("/", c => c.json({ error: "Method not allowed" }, 405));
