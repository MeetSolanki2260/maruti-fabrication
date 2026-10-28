import { defineConfig } from "vitest/config";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { mkdirSync } from "node:fs";
mkdirSync("out", { recursive: true });   // wrangler needs the assets folder to exist
export default defineConfig(async () => ({
  plugins: [cloudflareTest({
    wrangler: { configPath: "./wrangler.jsonc" },
    miniflare: { bindings: {
      TEST_MIGRATIONS: await readD1Migrations("./drizzle"),
      ALLOWED_ORIGINS: "http://localhost:3000", TURNSTILE_SECRET: "x", TELEGRAM_BOT_TOKEN: "tok",
      TELEGRAM_CHAT_ID: "1", IP_HASH_SALT: "salt"
    } }
  })],
  test: { setupFiles: ["./tests/worker/setup.ts"], include: ["tests/**/*.spec.ts"] }
}));
