import localFont from "next/font/local";
export const head = localFont({ src: [{ path: "./fonts/BarlowCondensed-500.woff2", weight: "500" }, { path: "./fonts/BarlowCondensed-600.woff2", weight: "600" }, { path: "./fonts/BarlowCondensed-700.woff2", weight: "700" }], variable: "--f-head", display: "swap" });
export const body = localFont({ src: "./fonts/Inter-var.woff2", weight: "100 900", variable: "--f-body", display: "swap" });
export const mono = localFont({ src: [{ path: "./fonts/JetBrainsMono-400.woff2", weight: "400" }, { path: "./fonts/JetBrainsMono-500.woff2", weight: "500" }], variable: "--f-mono", display: "swap" });
export const gu = localFont({ src: "./fonts/NotoSansGujarati-var.woff2", weight: "100 900", variable: "--f-gu", display: "swap", preload: false });
export const hi = localFont({ src: "./fonts/NotoSansDevanagari-var.woff2", weight: "100 900", variable: "--f-hi", display: "swap", preload: false });
