import type { Env } from "../worker/env";
import type { D1Migration } from "cloudflare:test";
declare global { namespace Cloudflare { interface Env extends Omit<import("../worker/env").Env, never> { TEST_MIGRATIONS: D1Migration[] } } }
export type { Env };
