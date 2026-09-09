# Second Shift

GrayBeard LLC DBA Second Shift. Tennessee. Public site: `https://secondshift.care` (GitHub Pages, HTTPS).

Public lander: `index.html`, `care.html`, `work.html`, `contact.html` — Message A retainer honesty (“You’re paying a retainer. Nothing ships.”) in `site.css`. Shared tokens in `styles.css` (the Interim Execs hub still depends on those variable names). Contact is form-only on `contact.html`.

## Interim Execs market test — ANA migration play (2026-09-09)

Same locked package as ANA: pure WordPress → Webflow — same website, now no-code Webflow. WordPress developers are the bottleneck. Client edits in the Editor after cutover. Plus the **$750/mo SEO desk**. Not a redesign. Do not lead with Refresh $4k / Reimagine $6k.

- Current preview: https://www.interimexecs.com/ (canonical `https://interimexecs.com`)
- Asset clone: [`demos/interimexecs/wp-clone/`](demos/interimexecs/wp-clone/) (Pages: https://secondshift.care/demos/interimexecs/wp-clone/)
- Brand pack: [`demos/interimexecs/assets/brand/`](demos/interimexecs/assets/brand/)
- Refresh the asset clone from live: `python3 scripts/refresh-ie-asset-clone.py`
- Hub (Current | Webflow Clone, DEMO / review-only): [`demos/interimexecs/index.html`](demos/interimexecs/index.html) — https://secondshift.care/demos/interimexecs/
- Destinations: [`demos/interimexecs/destinations.js`](demos/interimexecs/destinations.js) — Clone / `webflowPreview` is `https://interimexecs-refresh-4d5162.webflow.io/` (`siteId` `6aa172cba67941dfcc29e970`). `webflowPreview.ready` stays **false** while Home is eye-checked. Hub shows Staging soon. Do not iframe webflow.io.
- Status: [`demos/interimexecs/HANDOFF.md`](demos/interimexecs/HANDOFF.md)
- Authorized Clone-only email draft (confirm before send): [`market-test/interimexecs-email.md`](market-test/interimexecs-email.md)

Public hub: no Christopher name / gograybeard. Talk first to `hello@secondshift.care`. No Stripe. This page does not send outreach. Do not email Interim Execs.

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

Beacon homepage fetched without a Cloudflare challenge in the 2026-09-05 crawl. Recrawl if a bot wall appears. Dummy forms only. Do not email prospects. Interim Execs uses the ANA Current | Webflow Clone comparison, not the three-tier lead.

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
