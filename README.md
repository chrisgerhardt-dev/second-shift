# Second Shift

GrayBeard LLC DBA Second Shift. Tennessee. Public site: `https://secondshift.care` (GitHub Pages, HTTPS).

Public lander: `index.html`, `care.html`, `work.html`, `contact.html` — story and craft in `site.css` / `site.js`. Shared tokens in `styles.css` (the Interim Execs hub still depends on those variable names). Contact: `chris@gograybeard.com`.

## Interim Execs market test — HOLD (2026-09-03)

Clone, Refresh, and Reimagine shells are IE-ready, not fully polished. The three-tier comparison email is **still blocked** until FormSubmit is proven.

- Public Clone preview: https://secondshift.care/demos/interimexecs/wp-clone/
- Hub (internal / not for prospect email): [`demos/interimexecs/index.html`](demos/interimexecs/index.html)
- Destinations and Stripe paths: [`demos/interimexecs/destinations.js`](demos/interimexecs/destinations.js)
- Status and blockers: [`demos/interimexecs/HANDOFF.md`](demos/interimexecs/HANDOFF.md)
- Authorized Clone-only email draft: [`market-test/interimexecs-email.md`](market-test/interimexecs-email.md)

Ready hub cards restore Buy CTAs (Refresh $4k, Reimagine $6k, desk $750). Talk first stays only if a tier is later marked unready. Refresh `polishNote` is only the Made in Webflow badge (Starter OK) and optional placeholder favicon.

## Checks

```bash
node scripts/check-market-test.js
```

Static HTML. No build tooling. GitHub Pages serves the repo root from `main`.
