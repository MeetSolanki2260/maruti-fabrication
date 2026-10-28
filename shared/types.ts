import type { z } from "zod";
import type { quoteSchema } from "./quote-schema";
export type QuoteInput = z.infer<typeof quoteSchema>;
