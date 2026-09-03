# Second Shift

GrayBeard LLC DBA Second Shift. Tennessee. Public site: `https://secondshift.care` (GitHub Pages, HTTPS).

Public lander: `index.html`, `care.html`, `work.html`, `contact.html` — Message A retainer honesty (“You’re paying a retainer. Nothing ships.”) in `site.css`. Shared tokens in `styles.css` (the Interim Execs hub still depends on those variable names). Contact is form-only on `contact.html`.

## Interim Execs market test — HOLD (2026-09-03)

Clone, Refresh, and Reimagine shells are IE-ready. The three-tier comparison email is **still blocked** until FormSubmit is proven. Hub flip is for Christopher’s review of the ladder links only.

- Public Clone preview: https://secondshift.care/demos/interimexecs/wp-clone/
- Hub (internal / not for prospect email): [`demos/interimexecs/index.html`](demos/interimexecs/index.html)
- Destinations and Stripe paths: [`demos/interimexecs/destinations.js`](demos/interimexecs/destinations.js)
- Status and blockers: [`demos/interimexecs/HANDOFF.md`](demos/interimexecs/HANDOFF.md)
- Authorized Clone-only email draft: [`market-test/interimexecs-email.md`](market-test/interimexecs-email.md)

Ready hub cards restore Buy CTAs (Refresh $4k, Reimagine $6k, desk $750). Talk first stays only if a tier is later marked unready.

## Checks

```bash
node scripts/check-market-test.js
```

Static HTML. No build tooling. GitHub Pages serves the repo root from `main`.
