import { describe, expect, it, vi } from "vitest";
import { normalisePhone } from "../../worker/lib/leads/phone";
import { isAllowedOrigin } from "../../worker/lib/security/origin";
import { csvCell } from "../../worker/lib/security/csv";
import { log } from "../../worker/logger";

describe("phone", () => {
  it.each([["+91 94282 80683", "+919428280683"], ["094282 80683", "+919428280683"], ["94282-80683", "+919428280683"],
    ["919428280683", "+919428280683"], ["+1 415 555 2671", "+14155552671"]])("%s", (i, o) => expect(normalisePhone(i)).toBe(o));
  it.each(["12345", "+91 12345 67890", "abc", "", "+0123456789"])("rejects %s", i => expect(normalisePhone(i)).toBeNull());
});
describe("origin", () => {
  it("matches the list", () => expect(isAllowedOrigin("https://a.in", "https://a.in, https://b.in")).toBe(true));
  it("fails closed", () => { expect(isAllowedOrigin("https://a.in", "")).toBe(false); expect(isAllowedOrigin(null, "https://a.in")).toBe(false); });
});
describe("csv", () => {
  it("defuses formulas", () => { expect(csvCell("=1+1")).toBe(`"'=1+1"`); expect(csvCell("@x")).toBe(`"'@x"`); expect(csvCell("-5")).toBe(`"'-5"`); });
  it("quotes safely", () => expect(csvCell('a"b')).toBe('"a""b"'));
});
describe("logger", () => {
  it("drops personal fields", () => {
    const s = vi.spyOn(console, "log").mockImplementation(() => {});
    log("x", { leadId: "1", name: "Ravi", phone: "9", details: "d" });
    expect(s.mock.calls[0][0]).toBe('{"code":"x","leadId":"1"}');
  });
});
