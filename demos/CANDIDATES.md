# Market ladders (review only)

Five Clone / Refresh / Reimagine hubs for internal review. No outreach. Do not email prospects. Do not edit `demos/interimexecs/`.

| Slug | Live | Stack | Clone pages |
| --- | --- | --- | --- |
| westernmech | https://www.westernmech.com | Dated Market Hardware HTML | Home + Contact |
| kaback | https://kaback.com | WordPress / Jupiter | Home (Contact is `#contact`) |
| mcihvac | https://www.mcihvac.com | Wix Thunderbolt | Home + Contact |
| beaconcpa | https://beaconcpa.com | WordPress / Elementor | Home + Contact |
| anacorp | https://anacorp.com | WordPress / Hello Elementor | Home + Contact |

Clone `ready: true` points at the live URL. Western Mechanical, Kaback, MCI, and Beacon CPA have Refresh and Reimagine published (`ready: true` on `*-refresh.webflow.io` and `*-reimagine.webflow.io`).

ANA client hub is a **Current | Webflow Clone** comparison (`demos/anacorp/`). Lead package is **Webflow migration** — clone of their site with obvious improvements (not a redesign) — plus the **$750/mo desk including SEO** (monthly on-page/content SEO pass) on the hub sell side only, not on the ANA shell. One named obvious improvement: California **Privacy Choices / Do Not Sell-Share opt-out** wired properly on the Clone (hygiene, not legal advice). Current opens `https://www.anacorp.com/`. Webflow Clone uses `anacorp-refresh.webflow.io` (placeholder “staging soon” while that host 404s). Redesign ladder is hidden from the comparison. DEMO / Second Shift proposal review — not affiliated as official ANA production. Talk first only — no Stripe.

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
