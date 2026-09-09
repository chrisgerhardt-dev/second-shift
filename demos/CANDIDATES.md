# Market ladders (review only)

Five Clone / Refresh / Reimagine hubs for internal review, plus the Interim Execs client hub (same ANA migration play). No outreach. Do not email prospects.

| Slug | Live | Stack | Clone pages |
| --- | --- | --- | --- |
| westernmech | https://www.westernmech.com | Dated Market Hardware HTML | Home + Contact |
| kaback | https://kaback.com | WordPress / Jupiter | Home (Contact is `#contact`) |
| mcihvac | https://www.mcihvac.com | Wix Thunderbolt | Home + Contact |
| beaconcpa | https://beaconcpa.com | WordPress / Elementor | Home + Contact |
| anacorp | https://anacorp.com | WordPress / Hello Elementor | Home + Contact |

Clone `ready: true` points at the live URL. Western Mechanical, Kaback, MCI, and Beacon CPA have Refresh and Reimagine published (`ready: true` on `*-refresh.webflow.io` and `*-reimagine.webflow.io`).

ANA client hub is a **Current | Webflow Clone** comparison (`demos/anacorp/`). Why migrate: same website, now **no-code Webflow** — WordPress developers are the bottleneck. They keep the look and stop waiting on WP for routine changes. Plus the **$750/mo desk including SEO** on the hub sell side only, not on the ANA shell. Pure platform swap to owner-editable Webflow. Not a redesign. Not “improvements” in the migration; later edits are the client's after cutover in the Webflow Editor. Under-the-hood hygiene only: California **Privacy Choices / Do Not Sell-Share opt-out** (not legal advice). Current opens `https://www.anacorp.com/`. Webflow Clone is live at `anacorp-refresh.webflow.io` (`choices.clone.webflowPreview.ready: true`). Hub uses still cards + new-tab CTAs (do not iframe webflow.io). Redesign ladder is hidden from the comparison. DEMO / Second Shift proposal review — not affiliated as official ANA production. Talk first only — no Stripe.

Interim Execs client hub is the same play (`demos/interimexecs/`). Current opens `https://www.interimexecs.com/`. Webflow Clone stand-in is `interimexecs-refresh.webflow.io` (`choices.clone.webflowPreview.ready: false` — host was a 404 on 2026-09-09; hub shows Staging soon). Flip `ready` when that host serves IE content (or if a teammate renames it to `interimexecs-clone.webflow.io`). Do not iframe webflow.io. Do not lead with Refresh $4k / Reimagine $6k. Public pages: no Christopher name / gograybeard. Talk first to `hello@secondshift.care`. This page does not send outreach.

## Refresh a mirror

```bash
python3 scripts/refresh-asset-clone.py --all
node scripts/check-candidates.js
```

## Scrape notes (2026-09-05)

- **Western Mechanical:** Tiny static brochure. Logo and header images live under `/design/`. No bot wall.
- **Kaback:** Gravity Form on the homepage. Dummy-submit only. Fonts: Montserrat. Palette: navy `#222c61` + gold `#edcd1f`.
- **MCI:** Wix runtime JS is stripped so the static mirror can render the SSR tree. Overlay CSS unhides `opacity: 0` containers. Thunderbolt JSON module URLs return HTTP 400 (runtime only; not required for the static pages). Paid Wix faces (Lulo Clean, Brandon Grotesque) documented with Webflow stand-ins. Brand pack includes the certification lockup plus the header wordmark.
- **Beacon CPA:** Homepage returned 200 without a Cloudflare challenge in this crawl (nginx, no `cf-mitigated`). Logo SVG wraps a PNG (extracted into the brand pack). If a later recrawl hits a bot wall, use a real browser and re-run `python3 scripts/refresh-asset-clone.py beaconcpa`.

## Scrape notes (2026-09-07)

- **Alliance North America (ANA):** WordPress + Hello Elementor on Cloudflare. `www.anacorp.com` 301s to `https://anacorp.com/`. Homepage 200 without a bot wall in this crawl. Live logo is `ANA-METAL-LOGO-SITE.svg` (metal wordmark; SVG wraps a raster). Display face is Russo One; body is Roboto. Brand red `#ef3f36`. Live site sends `X-Frame-Options: SAMEORIGIN`, so the hub links out instead of iframing. Contact is `/contact/`. Refresh and Reimagine Webflow hosts returned HTTP 404 on 2026-09-07 — keep `ready: false` until craft is published.
