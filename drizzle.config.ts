import { defineConfig } from "drizzle-kit";
export default defineConfig({ dialect: "sqlite", schema: "./worker/lib/db/schema.ts", out: "./drizzle" });
