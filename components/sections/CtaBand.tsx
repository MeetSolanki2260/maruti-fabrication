import { getTranslations } from "next-intl/server";
import { TrackLink } from "@/components/ui/Button";
import Lines from "@/components/ui/Lines";
import Sym from "@/components/ui/Sym";
import QuoteForm from "@/components/forms/QuoteForm";
import { site } from "@/lib/config/site";
/** "Let's make it happen": pitch on the left, quote form on the right. */
export default async function CtaBand({ h1 }: { h1?: boolean }) {
  const t = await getTranslations("cta"), H = h1 ? "h1" : "h2";
  return (<section className="dark" id="contact"><div className="wrap contact">
    <div style={{ minWidth: 0 }}>
      <span className="mono eyebrow">{t("eyebrow")}</span><H><Lines text={t("title")} /></H><p className="lede">{t("lead")}</p>
      <div className="call mono">{t("callLabel")}</div>
      <TrackLink className="bignum" href={`tel:${site.phoneE164}`} event="call_click">{site.phone}</TrackLink>
      <div className="loc"><Sym id="pin" /><span>{t("area")}</span></div><p className="ready">{t("helpful")}</p>
    </div>
    <QuoteForm />
  </div></section>);
}
