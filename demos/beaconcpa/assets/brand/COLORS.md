# Beacon CPA brand tokens (scraped 2026-09-05)

Source: live CSS and homepage chrome on https://beaconcpa.com.
For **Refresh and Reimagine** Webflow reuse — not a rebrand. Logo + this palette + [FONTS.md](FONTS.md).

## Logo

- File: `beaconcpa-logo.svg`
- Clone copy: `../../wp-clone/assets/`

Refresh and Reimagine take the logo from this folder. Do not redraw it.

## Colors

| Token | Hex | Notes |
| --- | --- | --- |
| purpleDeep | `#1b0047` | Scraped from live CSS / on-page styles |
| purple | `#460683` | Scraped from live CSS / on-page styles |
| purpleSoft | `#6f5e8b` | Scraped from live CSS / on-page styles |
| ink | `#0e0b19` | Scraped from live CSS / on-page styles |
| paper | `#ffffff` | Scraped from live CSS / on-page styles |
| mist | `#f1f0f2` | Scraped from live CSS / on-page styles |
| lilac | `#eff3fd` | Scraped from live CSS / on-page styles |
| accent | `#ffbc7d` | Scraped from live CSS / on-page styles |

## Type

See [FONTS.md](FONTS.md). Keep: **Inter, DM Sans, Open Sans**.

## Refresh later

```bash
python3 scripts/refresh-asset-clone.py beaconcpa
node scripts/check-candidates.js
```
