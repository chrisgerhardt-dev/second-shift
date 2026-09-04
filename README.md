# Second Shift

GrayBeard LLC DBA Second Shift. Tennessee. Public site: `https://secondshift.care` (GitHub Pages, HTTPS).

Public lander: `index.html`, `care.html`, `work.html`, `contact.html` — Message A retainer honesty (“You’re paying a retainer. Nothing ships.”) in `site.css`. Shared tokens in `styles.css` (the Interim Execs hub still depends on those variable names). Contact is form-only on `contact.html`.

## Interim Execs market test — HOLD (2026-09-03)

Clone is the only IE-ready public preview: https://interimexecs.com. Refresh and Reimagine are **not IE-ready** while Webflow rebuilds them from the true InterimExecs clone. The three-tier comparison email is **still blocked** until those shells are IE-ready again **and** FormSubmit is proven.

- Public Clone preview: https://interimexecs.com (live site; same site, lower bill proof)
- Asset clone / customize canvas: [`demos/interimexecs/wp-clone/`](demos/interimexecs/wp-clone/) (Pages: https://secondshift.care/demos/interimexecs/wp-clone/)
- Brand pack (logo + colors + fonts for Refresh and Reimagine): [`demos/interimexecs/assets/brand/`](demos/interimexecs/assets/brand/)
- Refresh the asset clone from live: `python3 scripts/refresh-ie-asset-clone.py`
- Hub (internal / not for prospect email): [`demos/interimexecs/index.html`](demos/interimexecs/index.html)
- Destinations and Stripe paths: [`demos/interimexecs/destinations.js`](demos/interimexecs/destinations.js) — keep `ready: false` on Refresh/Reimagine until the rebuild is done.
- Status and blockers: [`demos/interimexecs/HANDOFF.md`](demos/interimexecs/HANDOFF.md)
- Authorized Clone-only email draft: [`market-test/interimexecs-email.md`](market-test/interimexecs-email.md)

Unready hub cards use Talk first, not live $4k / $6k deposit buttons. Clone $750/mo desk buy may stay.

## Checks

```bash
node scripts/check-market-test.js
```

Static HTML. No build tooling. GitHub Pages serves the repo root from `main`.
