import { getImage } from "@/lib/images";
export default function Picture({ name, alt, sizes, priority }: { name: string; alt: string; sizes: string; priority?: boolean }) {
  const i = getImage(name), set = (v: { w: number; file: string }[]) => v.map(x => `/img/${x.file} ${x.w}w`).join(", ");
  const mid = i.webp.find(x => x.w >= 768) ?? i.webp[i.webp.length - 1];
  return (<>
    {priority && <link rel="preload" as="image" type="image/avif" imageSrcSet={set(i.avif)} imageSizes={sizes} fetchPriority="high" />}
    <picture>
      <source type="image/avif" srcSet={set(i.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={set(i.webp)} sizes={sizes} />
      <img src={`/img/${mid.file}`} width={i.width} height={i.height} alt={alt} sizes={sizes} decoding="async" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
    </picture>
  </>);
}
