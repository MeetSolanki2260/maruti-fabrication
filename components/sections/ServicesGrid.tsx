import { getTranslations } from "next-intl/server";
import Lines from "@/components/ui/Lines";
import Sym from "@/components/ui/Sym";

const ICONS = ["i-gate", "i-grill", "i-shed", "i-dome", "i-int"];
const GALLERY_SLUGS = ["gates", "grills", "shades", "domes", "interiors"];

export default async function ServicesGrid({ locale }: { locale: string }) {
  const t = await getTranslations("services"), q = `/${locale}/#contact`;
  return (<section id="services"><div className="wrap">
    <div className="head"><div><span className="mono eyebrow">{t("eyebrow")}</span><h2><Lines text={t("title")} /></h2></div><p className="side">{t("lead")}</p></div>
    <div className="svc">{(t.raw("items") as { t: string; d: string; u: string }[]).map((it, k) => (
      <div className="card-wrap" key={it.t}>
        <a className="card" href={`/${locale}/gallery/${GALLERY_SLUGS[k]}`}>
          <div className="top"><Sym id={ICONS[k]} /><span className="mono">0{k + 1}</span></div>
          <h3>{it.t}</h3><p>{it.d}</p>
          <div className="foot">{locale === "gu" ? "ડિઝાઇન જુઓ" : locale === "hi" ? "डिजाइन देखें" : "View designs"} <Sym id="arrow" /></div>
        </a>
        <a className="card-quote mono" href={q}>{it.u} — {locale === "gu" ? "ભાવ મેળવો" : locale === "hi" ? "कोटेशन प्राप्त करें" : "Request a quote"} <Sym id="arrow" /></a>
      </div>))}</div>
    <div className="under"><span className="mono eyebrow">{t("materials")}</span><a href={q}>{t("help")} <Sym id="arrow" /></a></div>
  </div></section>);
}
