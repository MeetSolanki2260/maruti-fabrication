const P: Record<string, string> = {
  gate: "M4 20V8l2-3 2 3v12zM10 20V8l2-3 2 3v12zM16 20V8l2-3 2 3v12zM2 11h20M2 16h20",
  grill: "M4 4h16v16H4zM4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16",
  shade: "M4 20V9l8-5 8 5v11M7 20v-8h10v8M7 14.7h10M7 17.3h10",
  dome: "M3 9l9-5 9 5zM5 12v6M9 12v6M15 12v6M19 12v6M3 20h18",
  interior: "M4 4h16v16H4zM4 9h16M9 9v11",
  home: "M4 11 12 4l8 7v9H4zM10 20v-6h4v6",
  shop: "M4 9l1-5h14l1 5M4 9v11h16V9M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9M10 20v-5h4v5",
  fit: "M3 15 15 3l6 6L9 21zM7 11l2 2M10 8l2 2M13 5l2 2",
  look: "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 12h6",
  purpose: "M3 8h8M17 8h4M14 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 17h4M13 17h8M10 14.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  pin: "M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z",
  right: "M4 12h16M14 6l6 6-6 6",
  check: "M5 12l5 5 9-10",
  ur: "M7 17 17 7M8 7h9v9",
  dr: "M7 7l10 10M17 8v9H8"
};
export type IconName = keyof typeof P;
export default function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[name]} /></svg>;
}
