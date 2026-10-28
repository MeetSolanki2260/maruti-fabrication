try { process.loadEnvFile(".env.local"); } catch {}
const need = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_TURNSTILE_SITEKEY"];
const miss = need.filter(k => !process.env[k]);
if (miss.length) { console.error("Missing build values: " + miss.join(", ") + ". Copy .env.example to .env.local and fill them in."); process.exit(1); }
