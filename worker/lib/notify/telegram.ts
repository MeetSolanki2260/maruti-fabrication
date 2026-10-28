import type { Env } from "../../env";
/** Plain text only (no parse mode), so customer text cannot inject formatting. */
export async function sendTelegram(env: Env, text: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(4000),
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text })
    });
    return res.ok;
  } catch { return false; }
}
