"use client";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALES } from "@/shared/constants";
const LABEL = { en: "EN", gu: "ગુ", hi: "हि" } as const;
export default function LanguageSwitcher({ locale, className = "lang" }: { locale: string; className?: string }) {
  const path = usePathname() ?? `/${locale}/`, t = useTranslations("nav");
  const rest = path.split("/").slice(2).join("/");
  return <div className={className} role="group" aria-label={t("language")}>{LOCALES.map(l => (
    <a key={l} href={`/${l}/${rest}`} lang={l} hrefLang={l} aria-current={l === locale}>{LABEL[l]}</a>))}</div>;
}
