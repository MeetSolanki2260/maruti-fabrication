import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  name: text("name").notNull(),
  phoneE164: text("phone_e164").notNull(),
  service: text("service").notNull(),
  details: text("details").notNull().default(""),
  locale: text("locale").notNull(),
  sourcePage: text("source_page"),
  utmSource: text("utm_source"),
  status: text("status").notNull().default("new"),
  consentAt: integer("consent_at").notNull(),
  consentVersion: text("consent_version").notNull(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  ipHash: text("ip_hash").notNull(),
  notifiedAt: integer("notified_at"),
  notifyAttempts: integer("notify_attempts").notNull().default(0),
  deletedAt: integer("deleted_at")
});
export const leadNotes = sqliteTable("lead_notes", {
  id: text("id").primaryKey(), leadId: text("lead_id").notNull(), adminEmail: text("admin_email").notNull(),
  body: text("body").notNull(), createdAt: integer("created_at").notNull()
});
export const adminAudit = sqliteTable("admin_audit", {
  id: text("id").primaryKey(), adminEmail: text("admin_email").notNull(), action: text("action").notNull(),
  target: text("target"), createdAt: integer("created_at").notNull()
});
export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(), windowStart: integer("window_start").notNull(), count: integer("count").notNull()
});
export const events = sqliteTable("events", {
  day: text("day").notNull(), name: text("name").notNull(), count: integer("count").notNull().default(0)
}, t => [primaryKey({ columns: [t.day, t.name] })]);

export const designs = sqliteTable("designs", {
  id: text("id").primaryKey(),
  category: text("category").notNull(), // gates, grills, shades, domes, interiors
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull(),
  createdAt: integer("created_at").notNull()
});
