export const getIp = (req: Request): string => req.headers.get("cf-connecting-ip") ?? "unknown";
/** Salted SHA-256 so raw IPs and phones are never stored in rate-limit keys or leads. */
export async function hashValue(value: string, salt: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + value));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
