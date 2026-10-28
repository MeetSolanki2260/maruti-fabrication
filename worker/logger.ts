const BLOCKED = new Set(["name", "phone", "details", "ip", "email", "text", "body"]);
/** Logs a code and safe metadata only. Personal fields are dropped. */
export function log(code: string, meta: Record<string, unknown> = {}): void {
  const safe = Object.fromEntries(Object.entries(meta).filter(([k]) => !BLOCKED.has(k.toLowerCase())));
  console.log(JSON.stringify({ code, ...safe }));
}
