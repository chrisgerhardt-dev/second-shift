# Second Shift

GrayBeard LLC DBA Second Shift. Tennessee. Public site: `https://secondshift.care` (GitHub Pages, HTTPS).

Public lander: `index.html`, `care.html`, `work.html`, `contact.html` — story and craft in `site.css` / `site.js`. Shared tokens in `styles.css` (the Interim Execs hub still depends on those variable names). Contact: `chris@gograybeard.com`.

## Interim Execs market test

Public hub: [`demos/interimexecs/index.html`](demos/interimexecs/index.html)

- After this branch is on `main`: https://secondshift.care/ie/
- GitHub Pages: https://chrisgerhardt-dev.github.io/second-shift/ie/

Three labeled choices: **Clone**, **Refresh**, **Reimagine** — benefits, preview, buy CTAs, and a customize demo that actually changes the page (2–3 edits, then a human form).

Destinations, Stripe links, and the send-gate live in one file: [`demos/interimexecs/destinations.js`](demos/interimexecs/destinations.js).

Prospect email draft (do not send): [`market-test/interimexecs-email.md`](market-test/interimexecs-email.md)

**Do not email Interim Execs yet.** Remaining blockers: [`demos/interimexecs/HANDOFF.md`](demos/interimexecs/HANDOFF.md).

## Checks

```bash
node scripts/check-market-test.js
```

Static HTML. No build tooling. GitHub Pages serves the repo root from `main`.
