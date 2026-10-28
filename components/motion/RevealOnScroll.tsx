"use client";
import { useEffect } from "react";
/** Fades sections in as they scroll into view. Only touches elements that start below the screen. */
export default function RevealOnScroll() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
    document.querySelectorAll<HTMLElement>(".head,.card,.fit,.pc,.custom>*,.why>div,.step,.faq-grid>*,.acc,.contact>*").forEach((el, i) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add("rv"); el.style.transitionDelay = `${(i % 5) * 70}ms`; io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
