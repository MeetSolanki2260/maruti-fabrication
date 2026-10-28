import type { MetadataRoute } from "next";
import { LOCALES } from "@/shared/constants";
import { SITE } from "@/lib/seo/metadata";
export const dynamic = "force-static";
const PAGES = ["", "contact/"];
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap(l => PAGES.map(p => ({ url: `${SITE}/${l}/${p}`,
    alternates: { languages: Object.fromEntries(LOCALES.map(x => [x, `${SITE}/${x}/${p}`])) } })));
}
