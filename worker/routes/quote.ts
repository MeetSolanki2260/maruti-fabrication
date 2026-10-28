import { Hono } from "hono";
import type { Env } from "../env";
import { missingEnv } from "../env";
import { quoteSchema } from "../../shared/quote-schema";
import { MAX_BODY_BYTES, LIMITS, WINDOW_MS, PHONE_DISPLAY } from "../../shared/constants";
import { isAllowedOrigin } from "../lib/security/origin";
import { getIp, hashValue } from "../lib/security/ip";
import { verifyTurnstile } from "../lib/security/turnstile";
import { hitRateLimit } from "../lib/security/ratelimit";
import { normalisePhone } from "../lib/leads/phone";
import { createLead } from "../lib/leads/create-lead";
import { notifyLead, formatLead } from "../lib/notify";
import { sendTelegram } from "../lib/notify/telegram";
import { log } from "../logger";

export const quote = new Hono<{ Bindings: Env }>();
const BAD = { error: "Bad request" };

quote.post("/", async c => {
  const env = c.env, call = `Please call ${PHONE_DISPLAY}.`;
  if (Number(c.req.header("content-length") ?? 0) > MAX_BODY_BYTES) return c.json(BAD, 413);              // 1 size (header)
  if (!isAllowedOrigin(c.req.header("origin") ?? null, env.ALLOWED_ORIGINS)) {                              // 2 origin, fail closed
    log("origin_denied"); return c.json({ error: "Forbidden" }, 403);
  }
  const missing = missingEnv(env);
  if (missing.length) { log("env_missing", { missing }); return c.json({ error: `Service unavailable. ${call}` }, 503); }
  if (!c.req.header("content-type")?.includes("application/json")) return c.json(BAD, 415);                // 3 type
  const buf = await c.req.arrayBuffer();
  if (buf.byteLength > MAX_BODY_BYTES) return c.json(BAD, 413);                                             // 1 size (bytes)
  let data: unknown; try { data = JSON.parse(new TextDecoder().decode(buf)); } catch { return c.json(BAD, 400); }
  const p = quoteSchema.safeParse(data);                                                                    // 4 schema
  if (!p.success) return c.json({ error: "Please check your details and try again." }, 400);
  const q = p.data;
  if (q.website) return c.json({ ok: true });                                                               // 5 honeypot: fake success
  const ip = getIp(c.req.raw);
  const ts = await verifyTurnstile(q.turnstileToken, ip, env.TURNSTILE_SECRET);                             // 6 captcha
  if (ts === "fail") return c.json({ error: "Please check your details and try again." }, 400);
  const phone = normalisePhone(q.phone);                                                                    // 8 (needed for the phone limit)
  if (!phone) return c.json({ error: "Please check your details and try again." }, 400);
  const ipHash = await hashValue(ip, env.IP_HASH_SALT), strict = ts === "unreachable";
  try {                                                                                                     // 7 rate limits
    const blocked = (await hitRateLimit(env.DB, "q:ip:" + ipHash, strict ? LIMITS.ipStrict : LIMITS.ip, WINDOW_MS))
      || (await hitRateLimit(env.DB, "q:ph:" + await hashValue(phone, env.IP_HASH_SALT), strict ? LIMITS.phoneStrict : LIMITS.phone, WINDOW_MS));
    if (blocked) return c.json({ error: `Too many requests. ${call}` }, 429);
  } catch { log("ratelimit_db_error"); }
  const lead = { ...q, phone };
  const r = await createLead(lead, { ipHash, env });                                                        // 9, 10 idempotent save
  if ("degraded" in r) {                                                                                    // 14 degraded mode
    return (await sendTelegram(env, formatLead(lead))) ? c.json({ ok: true }) : c.json({ error: `Service unavailable. ${call}` }, 503);
  }
  if (!r.duplicate) c.executionCtx.waitUntil(notifyLead(env, r.id));                                        // 11, 12 respond, then alert
  return c.json({ ok: true });
});
quote.all("/", c => c.json({ error: "Method not allowed" }, 405));
