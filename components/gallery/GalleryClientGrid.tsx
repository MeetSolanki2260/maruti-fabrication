"use client";
import { useState, useEffect } from "react";
import { fetchDesigns } from "@/lib/api";

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  name: string;
};

export default function GalleryClientGrid({
  images: initialImages,
  label,
  category
}: {
  images: GalleryImage[];
  label: string;
  category?: string;
}) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Fetch real-time cloud designs uploaded by the admin from phone/browser
  useEffect(() => {
    if (category) {
      fetchDesigns(category).then(cloudList => {
        if (cloudList && cloudList.length > 0) {
          const dynamicallyAdded = cloudList.map(item => ({
            src: item.imageUrl,
            alt: item.title + (item.description ? ` - ${item.description}` : ""),
            width: 800,
            height: 600,
            name: item.id
          }));
          // Prepend newly uploaded designs to the front of the gallery
          setImages([...dynamicallyAdded, ...initialImages]);
        }
      });
    }
  }, [category, initialImages]);

  const close = () => setLightbox(null);
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox(i => (i != null ? (i - 1 + images.length) % images.length : null));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox(i => (i != null ? (i + 1) % images.length : null));
  };

  return (
    <>
      <p className="gal-count mono eyebrow">{images.length} {label}</p>
      <div className="gal-grid">
        {images.map((img, k) => (
          <button
            key={img.name}
            className="gal-thumb"
            onClick={() => setLightbox(k)}
            aria-label={`View: ${img.alt}`}
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              loading={k < 6 ? "eager" : "lazy"}
              decoding="async"
            />
            <span className="gal-thumb-overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                <path d="M11 8v6M8 11h6"/>
              </svg>
            </span>
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="lb-overlay"
          onClick={close}
          role="dialog"
          aria-modal
          aria-label={images[lightbox].alt}
        >
          <button className="lb-close" onClick={close} type="button" aria-label="Close">✕</button>
          <button className="lb-arrow lb-prev" onClick={prev} type="button" aria-label="Previous">‹</button>
          <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              width={images[lightbox].width}
              height={images[lightbox].height}
              style={{ objectFit: "contain", width: "100%", height: "100%", display: "block" }}
            />
            <p className="lb-caption mono">{images[lightbox].alt}</p>
            <p className="lb-counter mono">{lightbox + 1} / {images.length}</p>
          </div>
          <button className="lb-arrow lb-next" onClick={next} type="button" aria-label="Next">›</button>
        </div>
      )}
    </>
  );
}
