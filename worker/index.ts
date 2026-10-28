import { Hono } from "hono";
import { cors } from "hono/cors";
import { isAllowedOrigin } from "./lib/security/origin";
import type { Env } from "./env";
import { quote } from "./routes/quote";
import { event } from "./routes/event";
import { health } from "./routes/health";
import { designsRoute } from "./routes/designs";
import { apiHeaders } from "./lib/security/headers";
import { runCron } from "./cron";
import { log } from "./logger";

const app = new Hono<{ Bindings: Env }>();
app.use("/api/*", cors({ origin: (o, c) => (isAllowedOrigin(o, c.env.ALLOWED_ORIGINS) ? o : ""), allowMethods: ["GET", "POST", "DELETE", "OPTIONS"], allowHeaders: ["Content-Type", "Authorization"] }));
app.use("/api/*", async (c, next) => { await next(); apiHeaders(c.res.headers); });
app.route("/api/quote", quote);
app.route("/api/event", event);
app.route("/api/health", health);
app.route("/api/designs", designsRoute);
app.notFound(c => c.json({ error: "Not found" }, 404));
app.onError((e, c) => { log("server_error", { error: e.name }); return c.json({ error: "Server error" }, 500); });

export default {
  fetch: app.fetch,
  scheduled: (ev, env, ctx) => { ctx.waitUntil(runCron(ev.cron, env)); }
} satisfies ExportedHandler<Env>;
