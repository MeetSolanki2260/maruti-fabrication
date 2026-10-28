import { defineRouting } from "next-intl/routing";
import { LOCALES } from "../shared/constants";
export const routing = defineRouting({ locales: LOCALES, defaultLocale: "en", localePrefix: "always" });
