import { readFileSync } from "node:fs";
const flat = (o, p = "") => Object.entries(o).flatMap(([k, v]) => typeof v === "object" ? flat(v, p + k + ".") : [[p + k, v]]);
const load = l => new Map(flat(JSON.parse(readFileSync(`messages/${l}.json`, "utf8"))));
const en = load("en"); let bad = false;
for (const l of ["gu", "hi"]) {
  const m = load(l), missing = [...en.keys()].filter(k => !m.has(k));
  const todo = [...m.values()].filter(v => String(v).startsWith("TODO_TRANSLATE")).length;
  if (missing.length) { bad = true; console.error(`${l}: missing keys: ${missing.join(", ")}`); }
  console.log(`i18n ${l}: ${todo} of ${m.size} strings still marked TODO_TRANSLATE`);
}
if (bad) process.exit(1);
