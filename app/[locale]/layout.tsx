import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { head, body, mono, gu, hi } from "../fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sprite from "@/components/layout/Sprite";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import StickyCallBar from "@/components/layout/StickyCallBar";
import JsonLd from "@/components/seo/JsonLd";
import { localBusiness } from "@/lib/seo/jsonld";

export const dynamicParams = false;
export const generateStaticParams = () => routing.locales.map(locale => ({ locale }));

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const m = (await getMessages()) as Record<string, unknown>;
  const client = { form: m.form, common: m.common, nav: m.nav };   // only what client components need
  return (
    <html lang={locale} className={[head, body, mono, gu, hi].map(f => f.variable).join(" ")}>
      <body>
        <NextIntlClientProvider locale={locale} messages={client}>
          <Sprite /><a className="skip" href="#main">{(m.common as { skip: string }).skip}</a>
          <Header locale={locale} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <StickyCallBar />
          <RevealOnScroll />
        </NextIntlClientProvider>
        <JsonLd data={localBusiness(locale)} />
      </body>
    </html>
  );
}
