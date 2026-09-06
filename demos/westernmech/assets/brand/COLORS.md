# Western Mechanical Contractors brand tokens (scraped 2026-09-05)

Source: live CSS and homepage chrome on https://www.westernmech.com.
For **Refresh and Reimagine** Webflow reuse — not a rebrand. Logo + this palette + [FONTS.md](FONTS.md).

## Logo

- File: `westernmech-logo.jpg`
- Clone copy: `../../wp-clone/assets/`

Refresh and Reimagine take the logo from this folder. Do not redraw it.

## Colors

| Token | Hex | Notes |
| --- | --- | --- |
| navy | `#00254f` | Scraped from live CSS / on-page styles |
| burgundy | `#8e1325` | Scraped from live CSS / on-page styles |
| red | `#d3222a` | Scraped from live CSS / on-page styles |
| ink | `#333333` | Scraped from live CSS / on-page styles |
| paper | `#ffffff` | Scraped from live CSS / on-page styles |
| mist | `#f2f2f2` | Scraped from live CSS / on-page styles |
| steel | `#b7c5d0` | Scraped from live CSS / on-page styles |

## Type

See [FONTS.md](FONTS.md). Keep: **Verdana, Palatino Linotype**.

## Refresh later

```bash
python3 scripts/refresh-asset-clone.py westernmech
node scripts/check-candidates.js
```
