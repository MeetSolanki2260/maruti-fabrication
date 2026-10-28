import { getTranslations } from "next-intl/server";
import Sym from "@/components/ui/Sym";
import LanguageSwitcher from "./LanguageSwitcher";
import { site } from "@/lib/config/site";
export default async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("footer"), n = await getTranslations("nav"), h = await getTranslations("hero");
  const home = `/${locale}/`;
  return (<footer><div className="wrap">
    <div className="fgrid">
      <div><div className="fbrand">Maruti Fabrication</div><p className="about">{t("tag")}</p><LanguageSwitcher locale={locale} className="lang-foot" /></div>
      <div><h4 className="mono">{t("make")}</h4><ul>{(h.raw("strip") as string[]).map(s => <li key={s}><a href={`${home}#services`}>{s}</a></li>)}</ul></div>
      <div><h4 className="mono">{t("explore")}</h4><ul>
        <li><a href={`/${locale}/gallery/gates`}>{locale === "gu" ? "ગેલેરી – ગેટ્સ" : locale === "hi" ? "गैलरी – गेट्स" : "Gallery – Gates"}</a></li>
        <li><a href={`/${locale}/gallery/grills`}>{locale === "gu" ? "ગેલેરી – ગ્રીલ્સ" : locale === "hi" ? "गैलरी – ग्रिल्स" : "Gallery – Grills"}</a></li>
        <li><a href={`/${locale}/gallery/shades`}>{locale === "gu" ? "ગેલેરી – શેડ્સ" : locale === "hi" ? "गैलरी – शेड्स" : "Gallery – Shades"}</a></li>
        <li><a href={`/${locale}/gallery/domes`}>{locale === "gu" ? "ગેલેરી – ડોમ" : locale === "hi" ? "गैलरी – डोम" : "Gallery – Domes"}</a></li>
        <li><a href={`/${locale}/gallery/interiors`}>{locale === "gu" ? "ગેલેરી – ઇન્ટિરિયર" : locale === "hi" ? "गैलरी – इंटीरियर" : "Gallery – Interiors"}</a></li>
        <li><a href={`${home}#inspiration`}>{n("inspiration")}</a></li><li><a href={`${home}#custom`}>{t("custom")}</a></li>
        <li><a href={`${home}#process`}>{n("process")}</a></li><li><a href={`${home}#faq`}>{t("faqs")}</a></li></ul></div>
      <div><h4 className="mono">{t("start")}</h4><div className="fnum">{site.phone}</div><p className="city">Jamnagar, India</p>
        <a className="rq" href={`${home}#contact`}>{n("quote")} <Sym id="arrow" /></a></div>
    </div>
    <div className="fbar"><span className="mono">{t("base")}</span><span className="mid">{t("images")}</span><a href="#top">{t("top")} <Sym id="arrow-u" /></a></div>
  </div></footer>);
}
