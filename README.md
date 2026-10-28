# Maruti Fabrication (Phase 2: Multilingual + Gallery + Cloud Admin)

Built for Maruti Fabrication in Jamnagar, Gujarat. Includes secure enquiry pipeline, full Gujarati/Hindi/English translations, interactive category gallery, and mobile-friendly zero-code owner admin panel.

## Run it
    npm install
    cp .env.example .env.local        # Windows: copy .env.example .env.local
    cp .dev.vars.example .dev.vars    # Windows: copy .dev.vars.example .dev.vars
    npm run db:migrate:local
    npm run dev:worker                # API on http://localhost:8787
    npm run dev                       # pages on http://localhost:3000
    npm run check                     # typecheck + lint + tests + build

## Before the first deploy (owner steps, Phase 0)
1. Cloudflare account, `wrangler d1 create maruti-prod`, put the id into `wrangler.jsonc`.
2. Secrets: `wrangler secret put TURNSTILE_SECRET | TELEGRAM_BOT_TOKEN | TELEGRAM_CHAT_ID | IP_HASH_SALT`.
3. GitHub secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID. GitHub variable: SITE_URL.
4. Set `ALLOWED_ORIGINS` and `SITE_URL` in `wrangler.jsonc` to the real address.

## Phase 2 (Design port) added
Home and Contact pages in English, Gujarati and Hindi. Values come from the Figma file (`styles/tokens.css`).
- Photos: put originals in `assets/photos/` (the 4 files there are placeholders). `npm run build` makes the AVIF/WebP versions.
- Words: edit `messages/*.json`. Strings starting `TODO_TRANSLATE` still need a Gujarati or Hindi translator.
- Test the form locally: run `npm run dev:worker` and `npm run dev`, then open http://localhost:3000/en/contact/

### Photos to replace (export each from Figma as JPG, keep these exact names, put in assets/photos/)
hero-gate, where-home, where-business, insp-gate, insp-dome, insp-interior, custom-craft

## Design check (every phase)
The approved design is `design/reference/reference-index.html` (with its photos in `design/reference/img/`).
The site must look exactly like it. After `npm run build`, run `python3 scripts/compare-with-reference.py`
(needs Python with Playwright). It draws both pages with the same fonts and compares all 13 sections' heights at 390, 768, 1440 and 1920 px.
Known, intended differences: language links in the top bar (footer on phones), the form's consent box,
the phone-only Call/WhatsApp bar (`showCallBar` in `lib/config/site.ts`), and a fix so the hero no longer overflows on phones.
