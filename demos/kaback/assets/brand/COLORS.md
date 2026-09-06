# Kaback Enterprises brand tokens (scraped 2026-09-05)

Source: live CSS and homepage chrome on https://kaback.com.
For **Refresh and Reimagine** Webflow reuse — not a rebrand. Logo + this palette + [FONTS.md](FONTS.md).

## Logo

- File: `kaback-logo.png`
- Clone copy: `../../wp-clone/assets/`

Refresh and Reimagine take the logo from this folder. Do not redraw it.

## Colors

| Token | Hex | Notes |
| --- | --- | --- |
| navy | `#222c61` | Scraped from live CSS / on-page styles |
| navyDeep | `#222c5e` | Scraped from live CSS / on-page styles |
| gold | `#edcd1f` | Scraped from live CSS / on-page styles |
| ink | `#222222` | Scraped from live CSS / on-page styles |
| paper | `#ffffff` | Scraped from live CSS / on-page styles |
| mist | `#ededed` | Scraped from live CSS / on-page styles |

## Type

See [FONTS.md](FONTS.md). Keep: **Montserrat**.

## Refresh later

```bash
python3 scripts/refresh-asset-clone.py kaback
node scripts/check-candidates.js
```
