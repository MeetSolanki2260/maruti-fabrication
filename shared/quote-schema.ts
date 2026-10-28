import { z } from "zod";
import { SERVICES, LOCALES } from "./constants";
export const quoteSchema = z.strictObject({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(5).max(30),
  service: z.enum(SERVICES),
  details: z.string().trim().max(1000).default(""),
  consent: z.literal(true),
  website: z.string().max(200),            // honeypot: humans leave it empty
  turnstileToken: z.string().min(1).max(2048),
  idempotencyKey: z.string().min(16).max(64),
  locale: z.enum(LOCALES),
  sourcePage: z.string().max(200).optional()
});
