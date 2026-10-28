import Link from "next/link";
import Sym from "@/components/ui/Sym";

const CATEGORIES = [
  { key: "gates",     labelEn: "Gates",            labelGu: "ગેટ્સ",            labelHi: "गेट्स",           slug: "gates",     icon: "i-gate" },
  { key: "grills",    labelEn: "Grills",           labelGu: "ગ્રીલ્સ",           labelHi: "ग्रिल्स",          slug: "grills",    icon: "i-grill" },
  { key: "shades",    labelEn: "Shades & Sheds",   labelGu: "શેડ્સ અને છત",     labelHi: "शेड्स और छत",      slug: "shades",    icon: "i-shed" },
  { key: "domes",     labelEn: "Domes",            labelGu: "ડોમ",              labelHi: "डोम",             slug: "domes",     icon: "i-dome" },
  { key: "interiors", labelEn: "Custom Interiors", labelGu: "કસ્ટમ ઇન્ટિરિયર",  labelHi: "कस्टम इंटीरियर",  slug: "interiors", icon: "i-int" },
];

export default function GalleryNav({ locale, active }: { locale: string; active: string }) {
  return (
    <nav className="gal-nav" aria-label="Gallery categories">
      {CATEGORIES.map(cat => {
        const label = locale === "gu" ? cat.labelGu : locale === "hi" ? cat.labelHi : cat.labelEn;
        return (
          <Link
            key={cat.key}
            href={`/${locale}/gallery/${cat.slug}`}
            className={`gal-nav-item${active === cat.key ? " active" : ""}`}
            aria-current={active === cat.key ? "page" : undefined}
          >
            <Sym id={cat.icon} />
            <span>{label}</span>
            <Sym id="arrow" />
          </Link>
        );
      })}
    </nav>
  );
}
