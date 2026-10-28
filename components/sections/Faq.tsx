import { getTranslations } from "next-intl/server";
import { TrackLink } from "@/components/ui/Button";
import Lines from "@/components/ui/Lines";
import Sym from "@/components/ui/Sym";
import { site } from "@/lib/config/site";
export default async function Faq() {
  const t = await getTranslations("faq");
  return (<section className="alt" id="faq"><div className="wrap faq-grid">
    <div style={{ minWidth: 0 }}>
      <span className="mono eyebrow">{t("eyebrow")}</span><h2><Lines text={t("title")} /></h2><p className="intro">{t("lead")}</p>
      <TrackLink className="phone" href={`tel:${site.phoneE164}`} event="call_click"><Sym id="phone" /><span>{site.phone}</span></TrackLink>
    </div>
    <div className="acc" style={{ minWidth: 0 }}>{(t.raw("items") as { q: string; a: string }[]).map((it, k) => (
      <details key={it.q} open={k === 0}><summary>{it.q}<span className="pm" /></summary><p className="ans">{it.a}</p></details>))}</div>
  </div></section>);
}
