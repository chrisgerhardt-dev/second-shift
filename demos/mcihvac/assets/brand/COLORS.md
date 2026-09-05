# MCI Mechanical brand tokens (scraped 2026-09-05)

Source: live CSS and homepage chrome on https://www.mcihvac.com.
For **Refresh and Reimagine** Webflow reuse — not a rebrand. Logo + this palette + [FONTS.md](FONTS.md).

## Logo

- File: `mcihvac-logo.png` (certification lockup)
- Header wordmark: `mcihvac-header-logo.png`
- Clone copy: `../../wp-clone/assets/`

Refresh and Reimagine take the logo from this folder. Do not redraw it.

## Colors

| Token | Hex | Notes |
| --- | --- | --- |
| navy | `#002f5e` | Scraped from live CSS / on-page styles |
| blue | `#589be3` | Scraped from live CSS / on-page styles |
| link | `#116dff` | Scraped from live CSS / on-page styles |
| mist | `#e4ebfc` | Scraped from live CSS / on-page styles |
| ink | `#2f2e2e` | Scraped from live CSS / on-page styles |
| paper | `#ffffff` | Scraped from live CSS / on-page styles |
| green | `#439410` | Scraped from live CSS / on-page styles |

## Type

See [FONTS.md](FONTS.md). Keep: **Lulo Clean W01 One Bold, Brandon Grotesque Light, DIN Next W01 Light**.

## Refresh later

```bash
python3 scripts/refresh-asset-clone.py mcihvac
node scripts/check-candidates.js
```
