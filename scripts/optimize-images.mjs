// assets/photos/**/*.{jpg,png,webp} -> public/img/<name>-<width>-<hash>.avif|webp + manifest.json
import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, rmSync, writeFileSync, statSync } from "node:fs";
import { join, parse } from "node:path";

const IN = "assets/photos", OUT = "public/img", WIDTHS = [480, 768, 1200, 1920];

// Collect all image files recursively from assets/photos
function getFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (/\.(jpe?g|png|webp)$/i.test(file)) {
      results.push(fullPath);
    }
  }
  return results;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const manifest = {};
const allImages = getFiles(IN);

for (const filePath of allImages) {
  const { name } = parse(filePath);
  const meta = await sharp(filePath).metadata();
  const widths = [...new Set(WIDTHS.map(w => Math.min(w, meta.width || 1200)))];
  const entry = {
    width: meta.width,
    height: meta.height,
    avif: [],
    webp: []
  };

  for (const w of widths) {
    for (const fmt of ["avif", "webp"]) {
      const buf = await sharp(filePath)
        .rotate()
        .resize({ width: w })
        [fmt]({ quality: fmt === "avif" ? 50 : 72 })
        .toBuffer();
      const out = `${name}-${w}-${createHash("sha1").update(buf).digest("hex").slice(0, 8)}.${fmt}`;
      writeFileSync(`${OUT}/${out}`, buf);
      entry[fmt].push({ w, file: out });
    }
  }
  manifest[name] = entry;
}

writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log(`images: ${Object.keys(manifest).length} optimised`);
