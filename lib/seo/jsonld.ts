import { SITE } from "./metadata";
import { site } from "../config/site";
/** Only facts the owner has confirmed: name, phone, city, services. */
export const localBusiness = (locale: string) => ({
  "@context": "https://schema.org", "@type": "LocalBusiness", name: site.name, url: `${SITE}/${locale}/`,
  telephone: site.phoneE164, image: `${SITE}/og-default.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Jamnagar", addressRegion: "Gujarat", addressCountry: "IN" },
  areaServed: "Jamnagar",
  makesOffer: ["Gates", "Grills", "Shades and sheds", "Domes", "Custom interior metalwork"].map(n => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } }))
});
