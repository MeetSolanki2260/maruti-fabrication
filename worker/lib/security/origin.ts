export function isAllowedOrigin(origin: string | null, allowed: string): boolean {
  if (!origin || !allowed.trim()) return false;           // fail closed
  return allowed.split(",").map(s => s.trim()).filter(Boolean).includes(origin);
}
