import { getTranslations } from "next-intl/server";
import { TrackLink } from "@/components/ui/Button";
import Sym from "@/components/ui/Sym";
import { site } from "@/lib/config/site";
import LanguageSwitcher from "./LanguageSwitcher";
export default async function Header({ locale }: { locale: string }) {
  const t = await getTranslations("nav"), top = await getTranslations("top");
  const home = `/${locale}/`;
  return (<>
    <div className="strip mono"><div className="wrap">
      <span>{top("left")}</span>
      <span className="right">{top("right")} &nbsp;/&nbsp; <b>{site.phone}</b></span>
      <LanguageSwitcher locale={locale} />
    </div></div>
    <header className="nav" id="top"><div className="wrap">
      <a className="logo" href={home} aria-label="Maruti Fabrication home">
        <svg viewBox="0 0 46 46" fill="none" stroke="#ee6a33" strokeWidth="2.4" strokeLinejoin="miter"><path d="M2 44V2h6l15 23L38 2h6v42h-6V15L23 38 8 15v29z" /></svg>
        Maruti Fabrication
      </a>
      <nav className="links">
        <a href={`${home}#services`}>{t("services")}</a><a href={`/${locale}/gallery/gates`}>{t("gallery")}</a><a href={`${home}#inspiration`}>{t("inspiration")}</a><a href={`${home}#process`}>{t("process")}</a>
        <TrackLink className="btn" href={`${home}#contact`}>{t("quote")} <Sym id="arrow" /></TrackLink>
      </nav>
    </div></header>
  </>);
}
