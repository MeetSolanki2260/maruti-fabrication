import { getTranslations } from "next-intl/server";
import { TrackLink } from "@/components/ui/Button";
import Picture from "@/components/ui/Picture";
import Lines from "@/components/ui/Lines";
import Sym from "@/components/ui/Sym";
import { site } from "@/lib/config/site";
export default async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations("hero"), i = await getTranslations("img"), n = await getTranslations("nav"), c = await getTranslations("common");
  return (<>
    <div className="hero">
      <div className="hero-copy">
        <div className="tag mono">{t("eyebrow")}</div>
        <h1><Lines text={t("title")} /></h1>
        <p className="lede">{t("lead")}</p>
        <div className="cta-row">
          <TrackLink className="btn" href={`/${locale}/#contact`}>{n("quote")} <Sym id="arrow" /></TrackLink>
          <TrackLink className="btn ghost" href={`tel:${site.phoneE164}`} event="call_click">{c("call")} <Sym id="phone" size={22} /></TrackLink>
        </div>
        <p className="mono eyebrow" style={{ color: "var(--muted-dark)", fontSize: 11 }}>{t("tag")}</p>
      </div>
      <div className="hero-img">
        <Picture name="hero-gate" alt={i("hero")} sizes="(max-width:900px) 100vw, 50vw" priority />
        <a className="hero-cap" href="#inspiration"><div><p>{t("caption")}</p><span className="mono">{t("captionNote")}</span></div><Sym id="arrow-dr" /></a>
      </div>
    </div>
    <div className="ticker"><div className="wrap">
      <span className="mono eyebrow">{t("stripLabel")}</span>
      <ul>{(t.raw("strip") as string[]).map(s => <li key={s}>{s}</li>)}</ul>
    </div></div>
  </>);
}
