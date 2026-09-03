# Second Shift

GrayBeard LLC DBA Second Shift. Tennessee. Public site: `https://secondshift.care` (GitHub Pages, HTTPS).

Public lander: `index.html`, `care.html`, `work.html`, `contact.html` — Message A retainer honesty (“You’re paying a retainer. Nothing ships.”) in `site.css`. Shared tokens in `styles.css` (the Interim Execs hub still depends on those variable names). Contact is form-only on `contact.html`.

## Interim Execs market test — HOLD (2026-09-03)

Clone is the only authorized public preview: https://secondshift.care/demos/interimexecs/wp-clone/

The three-tier hub exists for internal review (`demos/interimexecs/index.html`) but is **not** for prospect email until Refresh/Reimagine shells are IE-ready **and** FormSubmit is proven.

- Destinations and Stripe paths: [`demos/interimexecs/destinations.js`](demos/interimexecs/destinations.js) — do not flip `ready: true` on Refresh/Reimagine yet.
- Status and blockers: [`demos/interimexecs/HANDOFF.md`](demos/interimexecs/HANDOFF.md)
- Authorized Clone-only email draft: [`market-test/interimexecs-email.md`](market-test/interimexecs-email.md)

Unready hub cards use Talk first, not live $4k / $6k deposit buttons. Clone $750/mo buy may stay.

## Checks

```bash
node scripts/check-market-test.js
```

Static HTML. No build tooling. GitHub Pages serves the repo root from `main`.
