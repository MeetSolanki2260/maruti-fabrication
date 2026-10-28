import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
type P = { params: Promise<{ locale: string }> };
/** /gallery → redirect to /gallery/gates */
export default async function GalleryIndex({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/${locale}/gallery/gates`);
}
