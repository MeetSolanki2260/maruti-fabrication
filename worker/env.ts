export interface Env {
  DB: D1Database; ASSETS: Fetcher;
  ALLOWED_ORIGINS: string; SITE_URL: string; ADMIN_EMAILS: string; ACCESS_TEAM_DOMAIN: string; ACCESS_AUD: string;
  TURNSTILE_SECRET: string; TELEGRAM_BOT_TOKEN: string; TELEGRAM_CHAT_ID: string; IP_HASH_SALT: string;
  ADMIN_PASSWORD?: string;
  MEDIA_BUCKET?: R2Bucket;
}
const REQUIRED = ["ALLOWED_ORIGINS", "TURNSTILE_SECRET", "TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID", "IP_HASH_SALT"] as const;
/** Names of required settings that are empty. Never returns values. */
export function missingEnv(env: Env): string[] { return REQUIRED.filter(k => !env[k]); }
