import { env, createExecutionContext, waitOnExecutionContext, createScheduledController } from "cloudflare:test";
import { vi } from "vitest";
import worker from "../../worker/index";
import type { Env } from "../../worker/env";

export const mode = { ts: "ok" as "ok" | "fail" | "down", tg: true };
export const calls = { telegram: 0 };
export function mockNetwork() {
  mode.ts = "ok"; mode.tg = true; calls.telegram = 0;
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.includes("turnstile")) { if (mode.ts === "down") throw new Error("down"); return Response.json({ success: mode.ts === "ok" }); }
    if (url.includes("telegram")) { calls.telegram++; return Response.json({ ok: mode.tg }, { status: mode.tg ? 200 : 500 }); }
    throw new Error("unexpected outbound " + url);
  });
}
const E = env as unknown as Env;
let n = 0;
export const good = (over: Record<string, unknown> = {}) => ({
  name: "Ravi Patel", phone: "+91 94282 80683", service: "Gates", details: "Main gate", consent: true, website: "",
  turnstileToken: "tok", idempotencyKey: "key" + crypto.randomUUID().replaceAll("-", ""), locale: "en", ...over
});
export const phone = () => "9" + String(100000000 + ++n);
type Opt = { method?: string; ip?: string; headers?: Record<string, string>; raw?: string; env?: Partial<Env>; path?: string };
export async function call(body: unknown, o: Opt = {}) {
  const ctx = createExecutionContext();
  const req = new Request("https://x.test" + (o.path ?? "/api/quote"), {
    method: o.method ?? "POST",
    headers: { "content-type": "application/json", origin: "http://localhost:3000", "cf-connecting-ip": o.ip ?? "1.1.1.1", ...o.headers },
    body: o.method === "GET" ? undefined : (o.raw ?? JSON.stringify(body))
  });
  const res = await worker.fetch!(req as never, { ...E, ...o.env }, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}
export async function runScheduled(cron: string) {
  const ctx = createExecutionContext();
  await worker.scheduled!(createScheduledController({ cron }), E, ctx);
  await waitOnExecutionContext(ctx);
}
export const row = () => E.DB.prepare("SELECT COUNT(*) n, MAX(notified_at) notified FROM leads").first<{ n: number; notified: number | null }>();
export const brokenDb = { prepare() { throw new Error("D1 down"); } } as unknown as D1Database;
export async function resetDb() {
  await E.DB.batch(["leads", "rate_limits", "events"].map(t => E.DB.prepare(`DELETE FROM ${t}`)));
}
