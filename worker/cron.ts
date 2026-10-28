import type { Env } from "./env";
import { getDb } from "./lib/db/client";
import { cleanRateLimits } from "./lib/db/queries/stats";
import { retryUnnotified } from "./lib/leads/retry";
import { log } from "./logger";
export async function runCron(cron: string, env: Env): Promise<void> {
  try {
    if (cron === "0 21 * * *") await cleanRateLimits(getDb(env.DB), Date.now() - 86_400_000);
    else log("cron_retry", { sent: await retryUnnotified(env) });
  } catch (e) { log("cron_failed", { error: e instanceof Error ? e.name : "unknown" }); }
}
