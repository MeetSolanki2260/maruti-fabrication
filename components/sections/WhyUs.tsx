import { getTranslations } from "next-intl/server";
import Sym from "@/components/ui/Sym";
const ICONS = [
  <svg key="a" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M4 22L22 4l6 6L10 28zM9 17l3 3M13 13l3 3M17 9l3 3" /></svg>,
  <svg key="b" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 11V6a2 2 0 012-2h5M21 4h5a2 2 0 012 2v5M28 21v5a2 2 0 01-2 2h-5M11 28H6a2 2 0 01-2-2v-5M10 16h12" /></svg>,
  <svg key="c" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="9" r="3" /><path d="M12 9h16M4 9h2" /><circle cx="23" cy="22" r="3" /><path d="M4 22h16M26 22h2" /></svg>,
  <Sym key="d" id="pin" />
];
export default async function WhyUs() {
  const t = await getTranslations("why");
  return (<section className="alt why-sec"><div className="wrap">
    <span className="mono eyebrow">{t("eyebrow")}</span><h2 className="solo">{t("title")}</h2>
    <div className="why">{(t.raw("items") as { t: string; d: string }[]).map((it, k) => <div key={it.t}>{ICONS[k]}<h3>{it.t}</h3><p>{it.d}</p></div>)}</div>
  </div></section>);
}
