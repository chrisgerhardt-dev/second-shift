# Second Shift

GrayBeard LLC DBA Second Shift. Tennessee. Public site: `https://secondshift.care` (GitHub Pages, HTTPS).

Public lander: `index.html`, `care.html`, `work.html`, `contact.html` — Message A retainer honesty (“You’re paying a retainer. Nothing ships.”) in `site.css`. Shared tokens in `styles.css` (the Interim Execs hub still depends on those variable names). Contact is form-only on `contact.html`.

## Interim Execs market test — HOLD (2026-09-03)

Clone is the only IE-ready public preview: https://interimexecs.com. Refresh and Reimagine are **not IE-ready** — craft review is in progress and neither is ready to show. Hold Reimagine until the Grok Heavy redesign brief lands. The three-tier comparison email is **still blocked** until those shells are IE-ready again **and** FormSubmit is proven.

- Public Clone preview: https://interimexecs.com (live site; same site, lower bill proof)
- Asset clone / customize canvas: [`demos/interimexecs/wp-clone/`](demos/interimexecs/wp-clone/) (Pages: https://secondshift.care/demos/interimexecs/wp-clone/)
- Brand pack (logo + colors + fonts for Refresh and Reimagine): [`demos/interimexecs/assets/brand/`](demos/interimexecs/assets/brand/)
- Refresh the asset clone from live: `python3 scripts/refresh-ie-asset-clone.py`
- Hub (internal / not for prospect email): [`demos/interimexecs/index.html`](demos/interimexecs/index.html)
- Destinations and Stripe paths: [`demos/interimexecs/destinations.js`](demos/interimexecs/destinations.js) — keep `ready: false` on Refresh/Reimagine until craft review passes.
- Status and blockers: [`demos/interimexecs/HANDOFF.md`](demos/interimexecs/HANDOFF.md)
- Authorized Clone-only email draft: [`market-test/interimexecs-email.md`](market-test/interimexecs-email.md)

Unready hub cards use Talk first, not live $4k / $6k deposit buttons. Clone $750/mo desk buy may stay.

## Market ladders for review (2026-09-05)

Internal review only. No outreach. Clone preview is the live site; Refresh / Reimagine stay `ready: false` until Webflow publishes.

| Slug | Live | Hub | Asset clone | Brand pack |
| --- | --- | --- | --- | --- |
| `westernmech` | https://www.westernmech.com | [`demos/westernmech/`](demos/westernmech/) | [`wp-clone/`](demos/westernmech/wp-clone/) | [`assets/brand/`](demos/westernmech/assets/brand/) |
| `kaback` | https://kaback.com | [`demos/kaback/`](demos/kaback/) | [`wp-clone/`](demos/kaback/wp-clone/) | [`assets/brand/`](demos/kaback/assets/brand/) |
| `mcihvac` | https://www.mcihvac.com | [`demos/mcihvac/`](demos/mcihvac/) | [`wp-clone/`](demos/mcihvac/wp-clone/) | [`assets/brand/`](demos/mcihvac/assets/brand/) |
| `beaconcpa` | https://beaconcpa.com | [`demos/beaconcpa/`](demos/beaconcpa/) | [`wp-clone/`](demos/beaconcpa/wp-clone/) | [`assets/brand/`](demos/beaconcpa/assets/brand/) |

Refresh a mirror later:

```bash
python3 scripts/refresh-asset-clone.py westernmech
python3 scripts/refresh-asset-clone.py kaback
python3 scripts/refresh-asset-clone.py mcihvac
python3 scripts/refresh-asset-clone.py beaconcpa
node scripts/check-candidates.js
```

Beacon homepage fetched without a Cloudflare challenge in the 2026-09-05 crawl. Recrawl if a bot wall appears. Dummy forms only. Do not email prospects. Do not edit the Interim Execs hub.

## Checks

```bash
node scripts/check-market-test.js
node scripts/check-candidates.js
```

Static HTML. No build tooling. GitHub Pages serves the repo root from `main`.
