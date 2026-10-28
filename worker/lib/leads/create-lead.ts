import type { QuoteInput } from "../../../shared/types";
import { CONSENT_VERSION } from "../../../shared/constants";
import type { Env } from "../../env";
import { getDb } from "../db/client";
import { insertLead } from "../db/queries/leads";
import { log } from "../../logger";
/** input.phone must already be normalised. Returns degraded when D1 is unavailable. */
export async function createLead(input: QuoteInput, ctx: { ipHash: string; env: Env }): Promise<{ id: string; duplicate?: boolean } | { degraded: true }> {
  try {
    const id = crypto.randomUUID(), now = Date.now();
    const rows = await insertLead(getDb(ctx.env.DB), {
      id, createdAt: now, name: input.name, phoneE164: input.phone, service: input.service, details: input.details,
      locale: input.locale, sourcePage: input.sourcePage ?? null, utmSource: null, consentAt: now,
      consentVersion: CONSENT_VERSION, idempotencyKey: input.idempotencyKey, ipHash: ctx.ipHash
    });
    return rows.length ? { id } : { id: "", duplicate: true };
  } catch (e) {
    log("lead_insert_failed", { error: e instanceof Error ? e.name : "unknown" });
    return { degraded: true };
  }
}
