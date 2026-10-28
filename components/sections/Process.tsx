import { getTranslations } from "next-intl/server";
import Sym from "@/components/ui/Sym";
export default async function Process() {
  const t = await getTranslations("process"), items = t.raw("items") as { t: string; d: string }[];
  return (<section id="process"><div className="wrap">
    <div className="head"><div><span className="mono eyebrow">{t("eyebrow")}</span><h2>{t("title")}</h2></div><p className="side">{t("lead")}</p></div>
    <div className="steps">{items.map((it, k) => (
      <div className="step" key={it.t}><div className="n mono"><span>0{k + 1}</span><Sym id={k === items.length - 1 ? "check" : "arrow-r"} /></div><h3>{it.t}</h3><p>{it.d}</p></div>))}</div>
  </div></section>);
}
