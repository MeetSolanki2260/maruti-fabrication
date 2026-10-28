CREATE TABLE leads (
  id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, name TEXT NOT NULL, phone_e164 TEXT NOT NULL,
  service TEXT NOT NULL, details TEXT NOT NULL DEFAULT '', locale TEXT NOT NULL, source_page TEXT, utm_source TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','quoted','won','lost')),
  consent_at INTEGER NOT NULL, consent_version TEXT NOT NULL, idempotency_key TEXT NOT NULL UNIQUE,
  ip_hash TEXT NOT NULL, notified_at INTEGER, notify_attempts INTEGER NOT NULL DEFAULT 0, deleted_at INTEGER
);
CREATE INDEX leads_status_created ON leads(status, created_at);
CREATE INDEX leads_notified ON leads(notified_at);
CREATE TABLE lead_notes (id TEXT PRIMARY KEY, lead_id TEXT NOT NULL, admin_email TEXT NOT NULL, body TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE INDEX lead_notes_lead ON lead_notes(lead_id);
CREATE TABLE admin_audit (id TEXT PRIMARY KEY, admin_email TEXT NOT NULL, action TEXT NOT NULL, target TEXT, created_at INTEGER NOT NULL);
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, window_start INTEGER NOT NULL, count INTEGER NOT NULL);
CREATE TABLE events (day TEXT NOT NULL, name TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, name));
