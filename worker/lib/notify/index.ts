import type { Env } from "../../env";
import { getDb } from "../db/client";
import { getLead, markNotified, bumpAttempts } from "../db/queries/leads";
import { sendTelegram } from "./telegram";
export const formatLead = (l: { name: string; phone: string; service: string; details: string }) =>
  `New enquiry: ${l.service}\n${l.name}\n${l.phone}\n${l.details || "-"}`;
export async function notifyLead(env: Env, leadId: string): Promise<boolean> {
  const db = getDb(env.DB), lead = await getLead(db, leadId);
  if (!lead || lead.notifiedAt) return true;
  const ok = await sendTelegram(env, formatLead({ ...lead, phone: lead.phoneE164 }));
  if (ok) await markNotified(db, leadId); else await bumpAttempts(db, leadId);
  return ok;
}
