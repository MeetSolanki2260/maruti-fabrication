import { getTranslations } from "next-intl/server";
import { TrackLink } from "@/components/ui/Button";
import Picture from "@/components/ui/Picture";
import Lines from "@/components/ui/Lines";
import Sym from "@/components/ui/Sym";
export default async function CustomWork({ locale }: { locale: string }) {
  const t = await getTranslations("custom"), i = await getTranslations("img");
  return (<section id="custom"><div className="wrap custom">
    <figure style={{ margin: 0, minWidth: 0 }}><div className="ph"><Picture name="custom-craft" alt={i("craft")} sizes="(max-width:900px) 100vw, 45vw" /></div><figcaption className="cap mono">{t("caption")}</figcaption></figure>
    <div style={{ minWidth: 0 }}>
      <span className="mono eyebrow">{t("eyebrow")}</span><h2><Lines text={t("title")} /></h2><p className="intro">{t("lead")}</p>
      <dl className="spec">{(t.raw("rows") as { t: string; d: string }[]).map(r => <div key={r.t}><dt>{r.t}</dt><dd>{r.d}</dd></div>)}</dl>
      <TrackLink className="btn" href={`/${locale}/#contact`}>{t("cta")} <Sym id="arrow" /></TrackLink>
    </div>
  </div></section>);
}
