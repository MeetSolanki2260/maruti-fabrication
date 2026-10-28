/** One atomic upsert. Returns true when the caller is over the limit (blocked). */
export async function hitRateLimit(db: D1Database, key: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now();
  const row = await db.prepare(
    `INSERT INTO rate_limits(key, window_start, count) VALUES(?1, ?2, 1)
     ON CONFLICT(key) DO UPDATE SET
       count = CASE WHEN window_start <= ?3 THEN 1 ELSE count + 1 END,
       window_start = CASE WHEN window_start <= ?3 THEN ?2 ELSE window_start END
     RETURNING count`
  ).bind(key, now, now - windowMs).first<{ count: number }>();
  return (row?.count ?? 0) > limit;
}
