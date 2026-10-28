"use client";
import { useTranslations } from "next-intl";
import { TrackLink } from "@/components/ui/Button";
import { site } from "@/lib/config/site";
export default function StickyCallBar() {
  const t = useTranslations("common");
  if (!site.showCallBar) return null;
  return <div className="callbar"><TrackLink href={`tel:${site.phoneE164}`} event="call_click">{t("call")}</TrackLink><TrackLink href={site.whatsapp} event="whatsapp_click" external>{t("whatsapp")}</TrackLink></div>;
}
