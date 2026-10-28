import { readFileSync } from "node:fs";
type V = { w: number; file: string };
export type Img = { width: number; height: number; avif: V[]; webp: V[] };
let cache: Record<string, Img> | undefined;
/** Reads public/img/manifest.json written by scripts/optimize-images.mjs (build time only). */
export function getImage(name: string): Img {
  cache ??= JSON.parse(readFileSync("public/img/manifest.json", "utf8"));
  const img = cache![name];
  if (!img) throw new Error("Unknown image: " + name);
  return img;
}
