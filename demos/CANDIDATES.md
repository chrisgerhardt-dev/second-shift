# Market ladders (review only)

Four Clone / Refresh / Reimagine hubs for Christopher. No outreach. Do not email prospects. Do not edit `demos/interimexecs/`.

| Slug | Live | Stack | Clone pages |
| --- | --- | --- | --- |
| westernmech | https://www.westernmech.com | Dated Market Hardware HTML | Home + Contact |
| kaback | https://kaback.com | WordPress / Jupiter | Home (Contact is `#contact`) |
| mcihvac | https://www.mcihvac.com | Wix Thunderbolt | Home + Contact |
| beaconcpa | https://beaconcpa.com | WordPress / Elementor | Home + Contact |

Clone `ready: true` points at the live URL. Western Mechanical Refresh is published (`https://westernmech-refresh.webflow.io/`, `ready: true`). Other Refresh / Reimagine stay `ready: false` until Webflow publishes (`*-refresh.webflow.io` / `*-reimagine.webflow.io` are placeholders).

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
