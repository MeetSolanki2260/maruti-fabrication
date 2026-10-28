// Gallery image registry — source files live in assets/photos/<category>/
// optimize-images.mjs automatically scans subdirectories and builds public/img/ at multiple sizes.

export type GalleryCat = {
  key: string;
  label: string;
  description: string;
  images: { name: string; alt: string }[];
};

export const GALLERY: GalleryCat[] = [
  {
    key: "gates",
    label: "Gates",
    description: "Entrance and driveway gates crafted in metal, steel and stainless steel.",
    images: [
      { name: "gate-01", alt: "Contemporary black steel driveway gate with vertical slats" },
      { name: "gate-02", alt: "Ornate wrought-iron entrance gate with scroll detail" },
      { name: "gate-03", alt: "Sliding steel gate with horizontal bar pattern" },
      { name: "gate-04", alt: "Double-leaf garden gate in powder-coated mild steel" },
      { name: "gate-05", alt: "Modern minimalist pedestrian gate in stainless steel" },
    ],
  },
  {
    key: "grills",
    label: "Grills",
    description: "Window and balcony grills that combine security with decorative style.",
    images: [
      { name: "grill-01", alt: "Black steel window grill with diamond pattern" },
      { name: "grill-02", alt: "Stainless steel balcony railing with glass infill" },
      { name: "grill-03", alt: "Ornamental wrought-iron window grill with floral motif" },
      { name: "grill-04", alt: "Simple square-grid mild-steel security grill" },
      { name: "grill-05", alt: "Contemporary balcony grill with horizontal tube rails" },
    ],
  },
  {
    key: "shades",
    label: "Shades & Sheds",
    description: "Made-to-fit metal shade structures for parking, terraces and outdoor work areas.",
    images: [
      { name: "shade-01", alt: "Steel car-parking canopy shade structure" },
      { name: "shade-02", alt: "Polycarbonate-roof terrace shade with black steel frame" },
      { name: "shade-03", alt: "Industrial metal shed with corrugated roof for workshop" },
      { name: "shade-04", alt: "Curved metal pergola shade over an outdoor seating area" },
      { name: "shade-05", alt: "Two-car garage shed with roll-up steel shutter" },
    ],
  },
  {
    key: "domes",
    label: "Domes",
    description: "Distinctive metal dome structures shaped around your architectural requirements.",
    images: [
      { name: "dome-01", alt: "Steel-framed geodesic dome canopy over a building entrance" },
      { name: "dome-02", alt: "Ornate metal dome roof on a residential terrace" },
      { name: "dome-03", alt: "Contemporary semi-dome shade structure in powder-coated steel" },
      { name: "dome-04", alt: "Large structural metal dome for commercial space" },
      { name: "dome-05", alt: "Decorative cupola dome in stainless steel finish" },
    ],
  },
  {
    key: "interiors",
    label: "Custom Interiors",
    description: "Purpose-made metal pieces — partitions, frames, railings and details for your interiors.",
    images: [
      { name: "interior-01", alt: "Black steel partition dividing a living and dining space" },
      { name: "interior-02", alt: "Metal staircase railing with vertical rod balusters" },
      { name: "interior-03", alt: "Custom steel-framed glass partition for a home office" },
      { name: "interior-04", alt: "Decorative laser-cut metal screen as a room divider" },
      { name: "interior-05", alt: "Steel ceiling frame with integrated pendant lighting" },
      { name: "interior-06", alt: "Wrought-iron console table with a marble top" },
    ],
  },
];

export function getCat(key: string): GalleryCat | undefined {
  return GALLERY.find(c => c.key === key);
}
