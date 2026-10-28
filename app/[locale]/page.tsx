import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo/metadata";
import Hero from "@/components/sections/Hero";
import WhereItFits from "@/components/sections/WhereItFits";
import CustomWork from "@/components/sections/CustomWork";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProjectsPreview from "@/components/sections/ProjectsPreview";
import WhyUs from "@/components/sections/WhyUs";
import Process from "@/components/sections/Process";
import Faq from "@/components/sections/Faq";
import CtaBand from "@/components/sections/CtaBand";
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P) {
  const { locale } = await params, t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "", title: t("homeTitle"), description: t("homeDesc") });
}
export default async function Home({ params }: P) {
  const { locale } = await params; setRequestLocale(locale);
  return <><Hero locale={locale} /><ServicesGrid locale={locale} /><WhereItFits /><ProjectsPreview /><CustomWork locale={locale} /><WhyUs /><Process /><Faq /><CtaBand /></>;
}
