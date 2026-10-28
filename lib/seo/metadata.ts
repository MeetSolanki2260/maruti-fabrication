import type { Metadata } from "next";
import { LOCALES } from "../../shared/constants";
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
const url = (l: string, p: string) => `${SITE}/${l}/${p}`;
export function buildMetadata(o: { locale: string; path: string; title: string; description: string }): Metadata {
  return {
    metadataBase: new URL(SITE), title: o.title, description: o.description,
    alternates: { canonical: url(o.locale, o.path), languages: { ...Object.fromEntries(LOCALES.map(l => [l, url(l, o.path)])), "x-default": url("en", o.path) } },
    openGraph: { title: o.title, description: o.description, url: url(o.locale, o.path), siteName: "Maruti Fabrication", type: "website", locale: o.locale, images: ["/og-default.jpg"] },
    twitter: { card: "summary_large_image" }
  };
}
