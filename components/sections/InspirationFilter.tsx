"use client";
import { useState, type ReactNode } from "react";
const KEYS = ["all", "gates", "shades", "interior"] as const;
/** Filter buttons and the grid. Cards arrive as server-rendered children; CSS hides the ones that don't match. */
export default function InspirationFilter({ tabs, label, children }: { tabs: string[]; label: string; children: ReactNode }) {
  const [f, setF] = useState<(typeof KEYS)[number]>("all");
  return (<>
    <div className="filters" role="group" aria-label={label}>
      {tabs.map((tb, k) => <button key={tb} type="button" aria-pressed={f === KEYS[k]} onClick={() => setF(KEYS[k])}>{tb}</button>)}
    </div>
    <div className="insp" id="insp" data-f={f} data-n={f === "all" ? 3 : 1}>{children}</div>
  </>);
}
