import { getTranslations } from "next-intl/server";
import Picture from "@/components/ui/Picture";
import Lines from "@/components/ui/Lines";
import Sym from "@/components/ui/Sym";
import InspirationFilter from "./InspirationFilter";
const IMGS = [["insp-gate", "gate", "gates"], ["insp-dome", "dome", "shades"], ["insp-interior", "interior", "interior"]] as const;
export default async function ProjectsPreview() {
  const t = await getTranslations("inspiration"), i = await getTranslations("img");
  return (<section className="dark" id="inspiration"><div className="wrap">
    <div className="head"><div><span className="mono eyebrow">{t("eyebrow")}</span><h2><Lines text={t("title")} /></h2></div><p className="side">{t("lead")}</p></div>
    <InspirationFilter tabs={t.raw("tabs") as string[]} label={t("filterLabel")}>
      {(t.raw("items") as { t: string; d: string }[]).map((it, k) => (
        <article className={k === 0 ? "pc first" : "pc"} data-c={IMGS[k][2]} key={it.t}>
          <div className="ph"><Picture name={IMGS[k][0]} alt={i(IMGS[k][1])} sizes="(max-width:900px) 100vw, 40vw" /></div>
          <div className="row"><h3>{it.t}</h3><Sym id="arrow" /></div><p>{it.d}</p><span className="mono">{t("tag")}</span></article>))}
    </InspirationFilter>
  </div></section>);
}
