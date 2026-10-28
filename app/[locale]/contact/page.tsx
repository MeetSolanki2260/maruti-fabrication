import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo/metadata";
import CtaBand from "@/components/sections/CtaBand";
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P) {
  const { locale } = await params, t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "contact/", title: t("contactTitle"), description: t("contactDesc") });
}
export default async function Contact({ params }: P) {
  const { locale } = await params; setRequestLocale(locale);
  return <CtaBand h1 />;
}
