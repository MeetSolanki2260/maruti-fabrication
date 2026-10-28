import { and, asc, eq, isNull, lt } from "drizzle-orm";
import { leads } from "../schema";
import type { Db } from "../client";
import { MAX_NOTIFY_ATTEMPTS } from "../../../../shared/constants";
export type NewLead = typeof leads.$inferInsert;
/** Returns [] when the idempotency key already exists (duplicate tap). */
export const insertLead = (db: Db, row: NewLead) =>
  db.insert(leads).values(row).onConflictDoNothing({ target: leads.idempotencyKey }).returning({ id: leads.id });
export const getLead = (db: Db, id: string) => db.select().from(leads).where(eq(leads.id, id)).get();
export const markNotified = (db: Db, id: string) => db.update(leads).set({ notifiedAt: Date.now() }).where(eq(leads.id, id));
export const bumpAttempts = async (db: Db, id: string) => {
  const l = await getLead(db, id);
  if (l) await db.update(leads).set({ notifyAttempts: l.notifyAttempts + 1 }).where(eq(leads.id, id));
};
export const listUnnotified = (db: Db, limit = 20) =>
  db.select({ id: leads.id }).from(leads)
    .where(and(isNull(leads.notifiedAt), isNull(leads.deletedAt), lt(leads.notifyAttempts, MAX_NOTIFY_ATTEMPTS)))
    .orderBy(asc(leads.createdAt)).limit(limit);
