import { getTranslations } from "next-intl/server";
import Picture from "@/components/ui/Picture";
import Sym from "@/components/ui/Sym";
const SET = [["where-home", "home", "home", "fit"], ["where-business", "business", "shop", "fit biz"]] as const;
export default async function WhereItFits() {
  const t = await getTranslations("where"), i = await getTranslations("img");
  return (<section className="alt"><div className="wrap">
    <div className="head"><div><span className="mono eyebrow">{t("eyebrow")}</span><h2>{t("title")}</h2></div><p className="side">{t("lead")}</p></div>
    <div className="fits">{(t.raw("items") as { t: string; d: string; u: string }[]).map((it, k) => (
      <article className={SET[k][3]} key={it.t}><div className="ph"><Picture name={SET[k][0]} alt={i(SET[k][1])} sizes="(max-width:800px) 100vw, 50vw" /></div>
        <div className="body"><div className="t"><h3>{it.t}</h3><Sym id={SET[k][2]} /></div><p>{it.d}</p><span className="mono">{it.u}</span></div></article>))}</div>
    <p className="note mono">{t("note")}</p>
  </div></section>);
}
