import type { Env } from "../../env";
import { getDb } from "../db/client";
import { listUnnotified } from "../db/queries/leads";
import { notifyLead } from "../notify";
export async function retryUnnotified(env: Env): Promise<number> {
  const rows = await listUnnotified(getDb(env.DB));
  let sent = 0;
  for (const r of rows) if (await notifyLead(env, r.id)) sent++;
  return sent;
}
