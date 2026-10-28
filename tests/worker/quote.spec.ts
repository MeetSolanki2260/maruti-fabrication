import { beforeEach, describe, expect, it } from "vitest";
import { call, good, phone, mode, calls, mockNetwork, row, runScheduled, brokenDb, resetDb } from "./helpers";

beforeEach(async () => { mockNetwork(); await resetDb(); });
const code = async (body: unknown, o = {}) => (await call(body, o)).status;

describe("attack cases", () => {
  it("valid request saves the lead and alerts the owner", async () => {
    expect(await code(good())).toBe(200);
    const r = await row(); expect(r?.n).toBe(1); expect(r?.notified).toBeTruthy(); expect(calls.telegram).toBe(1);
  });
  it("rejects a bad phone", async () => expect(await code(good({ phone: "123" }))).toBe(400));
  it("honeypot gets a fake 200 and nothing is saved", async () => {
    expect(await code(good({ website: "spam" }))).toBe(200); expect((await row())?.n).toBe(0);
  });
  it("rejects missing consent", async () => expect(await code(good({ consent: false }))).toBe(400));
  it("rejects injected extra fields", async () => expect(await code(good({ admin: true }))).toBe(400));
  it("rejects a script in service", async () => expect(await code(good({ service: "<script>" }))).toBe(400));
  it("rejects a wrong content type", async () => expect((await call(null, { headers: { "content-type": "text/plain" }, raw: "x" })).status).toBe(415));
  it("rejects an oversized body", async () => expect((await call(null, { raw: JSON.stringify({ a: "x".repeat(5000) }) })).status).toBe(413));
  it("counts bytes, not characters (Gujarati)", async () => expect(await code(good({ details: "ક".repeat(1000) }))).toBe(200));
  it("rejects other methods", async () => expect((await call(null, { method: "GET" })).status).toBe(405));
});

describe("pipeline", () => {
  it("wrong origin is refused", async () => expect((await call(good(), { headers: { origin: "https://evil.test" } })).status).toBe(403));
  it("empty allowlist refuses everything", async () => expect((await call(good(), { env: { ALLOWED_ORIGINS: "" } })).status).toBe(403));
  it("failed captcha is refused", async () => { mode.ts = "fail"; expect(await code(good())).toBe(400); });
  it("rate limit blocks the 6th request from one IP", async () => {
    const s: number[] = [];
    for (let i = 0; i < 6; i++) s.push(await code(good({ phone: phone() }), { ip: "2.2.2.2" }));
    expect(s).toEqual([200, 200, 200, 200, 200, 429]);
  });
  it("captcha unreachable means a stricter limit", async () => {
    mode.ts = "down"; const s: number[] = [];
    for (let i = 0; i < 3; i++) s.push(await code(good({ phone: phone() }), { ip: "3.3.3.3" }));
    expect(s).toEqual([200, 200, 429]);
  });
  it("same phone is limited to 3 per window", async () => {
    const p = phone(), s: number[] = [];
    for (let i = 0; i < 4; i++) s.push(await code(good({ phone: p }), { ip: "4.4.4." + i }));
    expect(s).toEqual([200, 200, 200, 429]);
  });
  it("double tap creates one lead and one alert", async () => {
    const b = good({ phone: phone() });
    expect(await code(b)).toBe(200); expect(await code(b)).toBe(200);
    expect((await row())?.n).toBe(1); expect(calls.telegram).toBe(1);
  });
});

describe("failure modes", () => {
  it("lead survives Telegram being off and cron retries it", async () => {
    mode.tg = false; expect(await code(good())).toBe(200);
    expect((await row())?.notified).toBeNull();
    mode.tg = true; await runScheduled("*/15 * * * *");
    expect((await row())?.notified).toBeTruthy();
  });
  it("D1 down: lead goes straight to Telegram", async () => {
    expect(await code(good(), { env: { DB: brokenDb } })).toBe(200); expect(calls.telegram).toBe(1);
  });
  it("D1 and Telegram both down: 503 with the phone number", async () => {
    mode.tg = false; const res = await call(good(), { env: { DB: brokenDb } });
    expect(res.status).toBe(503); expect(await res.text()).toContain("9428280683");
  });
  it("API responses are never cached", async () => expect((await call(good())).headers.get("cache-control")).toBe("no-store"));
});

describe("other endpoints", () => {
  it("health works", async () => expect((await call(null, { method: "GET", path: "/api/health" })).status).toBe(200));
  it("events count and reject unknown names", async () => {
    expect((await call({ name: "call_click" }, { path: "/api/event" })).status).toBe(204);
    expect((await call({ name: "hack" }, { path: "/api/event" })).status).toBe(400);
  });
});
