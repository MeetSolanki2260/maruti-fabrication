"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SERVICES } from "@/shared/constants";
import { postQuote } from "@/lib/api";
import { track } from "@/lib/analytics";

declare global { interface Window { turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void } } }
type State = "idle" | "sending" | "done" | "error" | "tooMany" | "unavailable";
const ARROW = <svg aria-hidden="true"><use href="#arrow" /></svg>;

export default function QuoteForm() {
  const t = useTranslations("form"), locale = useLocale();
  const [state, setState] = useState<State>("idle"), [token, setToken] = useState(""), [picked, setPicked] = useState(false);
  const box = useRef<HTMLDivElement>(null), wid = useRef<string>(undefined), key = useRef(crypto.randomUUID().replaceAll("-", ""));
  useEffect(() => {
    const render = () => { if (box.current && window.turnstile && !wid.current) wid.current = window.turnstile.render(box.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY, appearance: "interaction-only", callback: setToken, "expired-callback": () => setToken(""), "error-callback": () => setToken("") }); };
    const load = () => {   // load the captcha only when the form is near the screen
      if (window.turnstile) return render();
      const s = document.createElement("script"); s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; s.async = true; s.onload = render;
      document.head.appendChild(s);
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: "400px" });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("sending");
    const f = new FormData(e.currentTarget);
    const status = await postQuote({ name: f.get("name"), phone: f.get("phone"), service: f.get("service"), details: f.get("details"),
      consent: f.get("consent") === "on", website: f.get("website") ?? "", turnstileToken: token, idempotencyKey: key.current, locale, sourcePage: location.pathname });
    if (status === 200) { track("quote_submit"); return setState("done"); }
    window.turnstile?.reset(wid.current); setToken("");
    setState(status === 429 ? "tooMany" : status === 503 || status === 0 ? "unavailable" : "error");
  }
  const names = t.raw("serviceNames") as string[];
  return (
    <form className="form" id="quote" onSubmit={submit}>
      <h3>{t("title")}</h3>
      <div className="two">
        <div className="field"><label htmlFor="q-name">{t("name")}</label><input id="q-name" name="name" placeholder={t("namePh")} autoComplete="name" required minLength={2} maxLength={80} /></div>
        <div className="field"><label htmlFor="q-phone">{t("phone")}</label><input id="q-phone" name="phone" type="tel" placeholder={t("phonePh")} autoComplete="tel" required minLength={5} maxLength={30} /></div>
      </div>
      <div className="field"><label htmlFor="q-svc">{t("service")}</label>
        <select id="q-svc" name="service" required defaultValue="" className={picked ? "picked" : ""} onChange={e => setPicked(!!e.target.value)}>
          <option value="">{t("choose")}</option>{SERVICES.map((s, i) => <option key={s} value={s}>{names[i]}</option>)}</select></div>
      <div className="field"><label htmlFor="q-details">{t("details")}</label><textarea id="q-details" name="details" placeholder={t("detailsPh")} maxLength={1000} /></div>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="consent"><input type="checkbox" name="consent" required />{t("consent")}</label>
      <div ref={box} />
      <button className="btn" type="submit" disabled={state === "sending" || !token}>{state === "sending" ? t("sending") : t("submit")} {ARROW}</button>
      <p className="msg" role="status">{state === "done" ? t("thanks") : state !== "idle" && state !== "sending" ? t(state) : ""}</p>
      <p className="foot">{t("direct")}</p>
    </form>
  );
}
