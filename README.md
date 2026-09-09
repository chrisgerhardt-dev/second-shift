# Second Shift

GrayBeard LLC DBA Second Shift. Tennessee. Public site: `https://secondshift.care` (GitHub Pages, HTTPS).

Public lander: `index.html`, `care.html`, `work.html`, `contact.html` — Message A retainer honesty (“You’re paying a retainer. Nothing ships.”) in `site.css`. Shared tokens in `styles.css` (the Interim Execs hub still depends on those variable names). Contact is form-only on `contact.html`.

## Interim Execs market test — ANA migration play (2026-09-09)

Client hub is a **Current | Webflow Clone** comparison (`demos/interimexecs/`), same locked pitch as ANA. Pure WordPress → no-code Webflow — same website, same look, not a redesign. WordPress developers are the bottleneck. Plus the **$750/mo SEO desk**. Do not lead with Refresh $4k / Reimagine $6k. DEMO / review-only. Talk first only — no Stripe. This hub does not send outreach.

- Current preview: https://www.interimexecs.com/ (canonical https://interimexecs.com)
- Asset clone: [`demos/interimexecs/wp-clone/`](demos/interimexecs/wp-clone/) (Pages: https://secondshift.care/demos/interimexecs/wp-clone/)
- Brand pack: [`demos/interimexecs/assets/brand/`](demos/interimexecs/assets/brand/)
- Refresh the asset clone from live: `python3 scripts/refresh-ie-asset-clone.py`
- Hub: [`demos/interimexecs/index.html`](demos/interimexecs/index.html) — Pages: https://secondshift.care/demos/interimexecs/
- Destinations: [`demos/interimexecs/destinations.js`](demos/interimexecs/destinations.js) — keep `choices.clone.webflowPreview.ready` **false** (Staging soon) until `interimexecs-refresh.webflow.io` serves Interim Execs content. Do not iframe webflow.io.
- Status: [`demos/interimexecs/HANDOFF.md`](demos/interimexecs/HANDOFF.md)
- Authorized Clone-only email draft (still gated): [`market-test/interimexecs-email.md`](market-test/interimexecs-email.md)

## Market ladders for review (2026-09-05)

Internal review only. No outreach. Clone preview is the live site. All four market-ladder Refresh and Reimagine destinations are published (`ready: true`). Talk first only — no Stripe on these ladders.

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
node scripts/check-erwin-pd-portal.js
```

Static HTML. No build tooling. GitHub Pages serves the repo root from `main`.

## Erwin PD portal experiment

Unofficial homepage + officer portal prototype. Not affiliated with the Town of Erwin or EPD. Do not email the town. Not on the marketing lander.

- Folder: [`demos/erwin-pd-portal/`](demos/erwin-pd-portal/)
- GitHub Pages (after merge): https://secondshift.care/demos/erwin-pd-portal/
- Cloudflare Pages project: `erwin-pd-portal` → https://erwin-pd-portal.pages.dev/ (set root directory to `demos/erwin-pd-portal`; that hostname still has a Cloudflare Access wall titled “TAS Portal Demo” — the demo itself is open; see the folder README)
