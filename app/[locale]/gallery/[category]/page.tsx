import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCat, GALLERY } from "@/content/gallery";
import GalleryNav from "@/components/gallery/GalleryNav";
import GalleryClientGrid from "@/components/gallery/GalleryClientGrid";
import { buildMetadata } from "@/lib/seo/metadata";
import Sym from "@/components/ui/Sym";

type P = { params: Promise<{ locale: string; category: string }> };

export function generateStaticParams() {
  return GALLERY.map(c => ({ category: c.key }));
}

export async function generateMetadata({ params }: P) {
  const { locale, category } = await params;
  const cat = getCat(category);
  if (!cat) return {};
  return buildMetadata({
    locale,
    path: `gallery/${category}/`,
    title: `${cat.label} – Design Inspiration · Maruti Fabrication`,
    description: cat.description,
  });
}

export default async function GalleryCategory({ params }: P) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const cat = getCat(category);
  if (!cat) notFound();

  // Resolve which images exist in the manifest
  let manifest: Record<string, { width: number; height: number; webp: { w: number; file: string }[] }> = {};
  try {
    const { readFileSync } = await import("node:fs");
    manifest = JSON.parse(readFileSync("public/img/manifest.json", "utf8"));
  } catch {
    // manifest not yet built — will show placeholders
  }

  const resolvedImages = cat.images.map(img => {
    const entry = manifest[img.name];
    if (entry) {
      const mid = entry.webp.find(x => x.w >= 768) ?? entry.webp[entry.webp.length - 1];
      return { src: `/img/${mid.file}`, alt: img.alt, width: entry.width, height: entry.height, name: img.name };
    }
    // placeholder until images are downloaded & optimised
    return { src: `https://placehold.co/800x600/1f2522/f3f2ed?text=${encodeURIComponent(img.name)}`, alt: img.alt, width: 800, height: 600, name: img.name };
  });

  const breadHome = locale === "gu" ? "હોમ" : locale === "hi" ? "होम" : "Home";
  const breadGallery = locale === "gu" ? "ગેલેરી" : locale === "hi" ? "गैलरी" : "Gallery";
  const ctaQuote = locale === "gu" ? "ભાવ મેળવો" : locale === "hi" ? "कोटेशन प्राप्त करें" : "Request a quote";
  const designInspiration = locale === "gu" ? "ડિઝાઇન પ્રેરણા" : locale === "hi" ? "डिजाइन प्रेरणा" : "Design inspiration";
  const noteText = locale === "gu" ? "ડિઝાઇન પ્રેરણાના ઉદાહરણો — પૂર્ણ થયેલ કામો નહીં." : locale === "hi" ? "डिजाइन प्रेरणा के सांकेतिक चित्र — पूरे किए गए कार्य नहीं।" : "Illustrative design inspiration — not completed projects.";
  const designsCount = locale === "gu" ? "ડિઝાઇન" : locale === "hi" ? "डिजाइन" : "designs";

  const catNames: Record<string, { gu: { label: string; desc: string }; hi: { label: string; desc: string } }> = {
    gates: {
      gu: { label: "ગેટ્સ", desc: "મેટલ, સ્ટીલ અને સ્ટેનલેસ સ્ટીલમાં બનાવેલ પ્રવેશદ્વાર અને ડ્રાઇવવે ગેટ્સ." },
      hi: { label: "गेट्स", desc: "मेटल, स्टील और स्टेनलेस स्टील में निर्मित मुख्य और ड्राइववे गेट्स।" }
    },
    grills: {
      gu: { label: "ગ્રીલ્સ", desc: "સુરક્ષા અને સુંદર ડિઝાઇન ધરાવતી વિન્ડો અને બાલ્કની ગ્રીલ્સ." },
      hi: { label: "ग्रिल्स", desc: "सुरक्षा और सुंदर डिजाइन से युक्त विंडो और बालकनी ग्रिल्स।" }
    },
    shades: {
      gu: { label: "શેડ્સ અને છત", desc: "પાર્કિંગ, ટેરેસ અને ખુલ્લી જગ્યાઓ માટે મજબૂત મેટલ શેડ્સ." },
      hi: { label: "शेड्स और छत", desc: "पार्किंग, छत और बाहरी कार्य क्षेत्रों के लिए उपयुक्त मजबूत मेटल शेड्स।" }
    },
    domes: {
      gu: { label: "ડોમ", desc: "તમારા આર્કિટેક્ચર અનુસાર ખાસ આકાર આપેલા વિશિષ્ટ મેટલ ડોમ સ્ટ્રક્ચર્સ." },
      hi: { label: "डोम", desc: "वास्तुकला और विशिष्ट डिजाइन के अनुरूप विशेष निर्मित मेटल डोम।" }
    },
    interiors: {
      gu: { label: "કસ્ટમ ઇન્ટિરિયર", desc: "પાર્ટિશન, ફ્રેમ્સ અને ઇન્ટિરિયરને આકર્ષક બનાવતી મેટલ આઇટમ્સ." },
      hi: { label: "कस्टम इंटीरियर", desc: "पार्टीशन, फ्रेम और इंटीरियर को सुंदर व आधुनिक बनाने वाली मेटल वस्तुएं।" }
    }
  };

  const label = catNames[category]?.[locale as "gu" | "hi"]?.label ?? cat.label;
  const description = catNames[category]?.[locale as "gu" | "hi"]?.desc ?? cat.description;

  return (
    <div className="gal-page">
      {/* Breadcrumb */}
      <div className="gal-bread wrap">
        <Link href={`/${locale}`}>{breadHome}</Link>
        <Sym id="arrow" />
        <span>{breadGallery}</span>
        <Sym id="arrow" />
        <span aria-current="page">{label}</span>
      </div>

      <div className="wrap gal-layout">
        {/* Sidebar nav */}
        <aside className="gal-aside">
          <GalleryNav locale={locale} active={category} />
          <Link href={`/${locale}/#contact`} className="btn gal-cta">
            {ctaQuote} <Sym id="arrow" />
          </Link>
        </aside>

        {/* Main content */}
        <section className="gal-main">
          <header className="gal-header">
            <span className="mono eyebrow">{designInspiration}</span>
            <h1 className="gal-title">{label}</h1>
            <p className="gal-desc">{description}</p>
            <p className="mono gal-note">{noteText}</p>
          </header>

          <GalleryClientGrid images={resolvedImages} label={designsCount} category={category} />
        </section>
      </div>
    </div>
  );
}
