import Link from "next/link";
import { useTranslations } from "next-intl";
export default function NotFound() {
  const t = useTranslations("notfound");
  return <div className="container" style={{ padding: "96px var(--pad)" }}><h1 style={{ fontSize: 64 }}>{t("title")}</h1><p style={{ margin: "16px 0" }}>{t("body")}</p><Link className="btn" href="/en/">Home</Link></div>;
}
