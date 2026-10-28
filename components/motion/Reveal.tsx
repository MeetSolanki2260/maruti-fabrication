"use client";
import { useEffect, useRef, type ReactNode } from "react";
/** Fades content up when it scrolls into view. Visible without JavaScript. */
export default function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className="rv" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
