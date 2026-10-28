"use client";
import { useState } from "react";
import Image from "next/image";

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function GalleryGrid({ images, label }: { images: GalleryImage[]; label: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox(i => (i != null ? (i - 1 + images.length) % images.length : null));
  const next = () => setLightbox(i => (i != null ? (i + 1) % images.length : null));

  return (
    <>
      <p className="gal-count mono eyebrow">{images.length} {label}</p>
      <div className="gal-grid">
        {images.map((img, k) => (
          <button
            key={img.src}
            className="gal-thumb"
            onClick={() => setLightbox(k)}
            aria-label={img.alt}
            type="button"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(max-width:600px) 100vw, (max-width:1000px) 50vw, 33vw"
              loading={k < 6 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div className="lb-overlay" onClick={() => setLightbox(null)} role="dialog" aria-modal aria-label={images[lightbox].alt}>
          <button className="lb-close" onClick={() => setLightbox(null)} type="button" aria-label="Close">✕</button>
          <button className="lb-arrow lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} type="button" aria-label="Previous">‹</button>
          <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
            <Image
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              width={images[lightbox].width}
              height={images[lightbox].height}
              sizes="90vw"
              priority
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
            <p className="lb-caption mono">{images[lightbox].alt}</p>
          </div>
          <button className="lb-arrow lb-next" onClick={(e) => { e.stopPropagation(); next(); }} type="button" aria-label="Next">›</button>
        </div>
      )}
    </>
  );
}
