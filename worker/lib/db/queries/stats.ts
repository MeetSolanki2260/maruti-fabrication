import { sql } from "drizzle-orm";
import { events, rateLimits } from "../schema";
import { lt } from "drizzle-orm";
import type { Db } from "../client";
export const indiaDay = () => new Date(Date.now() + 19_800_000).toISOString().slice(0, 10);
export const incrementEvent = (db: Db, name: string) =>
  db.insert(events).values({ day: indiaDay(), name, count: 1 })
    .onConflictDoUpdate({ target: [events.day, events.name], set: { count: sql`${events.count} + 1` } });
export const cleanRateLimits = (db: Db, before: number) => db.delete(rateLimits).where(lt(rateLimits.windowStart, before));
