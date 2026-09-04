# InterimExecs brand tokens (scraped 2026-09-04)

Source: live theme CSS on https://interimexecs.com (`style.css`, compiled `master-preset1.css`, plus on-page inline colors).
For Webflow Refresh / Reimagine reuse — not a rebrand.

The public site is **navy + gold + teal**, not a flat Coca-Cola red. “RED Team” is the product name; buttons and chrome on the live homepage use gold (`#e7bf8f`) on dark photography, with navy (`#3c5370`) and teal (`#377d95`) bands. Deep reds appear on a few alert / emphasis bands.

## Logo

- SVG: `ie-logo.svg` (live header wordmark)
- PNG: `ie-logo.png` (same raster extracted from the SVG)
- Favicon: `favicon.png` (theme favicon)
- Clone copy: `../../wp-clone/assets/logo.svg`

Refresh can take the logo from this folder. Do not redraw it.

## Colors

| Token | Hex | Where it shows on the live site |
| --- | --- | --- |
| Gold | `#e7bf8f` | `.gold`, `.btn-yellow`, primary buttons / hovers |
| Navy | `#3c5370` | Section bands, cards, footer-adjacent chrome |
| Teal | `#377d95` | Links / secondary type |
| Bright teal | `#008cba` | Compiled preset / Foundation default link |
| Orange | `#d97732` / `#db651b` | Strong CTAs |
| Brand red | `#a61f22` | Deep red bands (`#8f1b1e` hover, `#a62428` muted) |
| Ink | `#272727` | Near-black bars and headings (`#222222` soft) |
| Neutrals | `#f5f5f5` mist, `#c1c1c1` lines, `#ffffff` paper | |

## Type

- Body: **Open Sans**
- Headings / nav: **Raleway**
- Occasional bands: **Poppins**

## Refresh later

Re-run from the repo root after a live-site visual change:

```bash
python3 scripts/refresh-ie-asset-clone.py
node scripts/check-market-test.js
```

That overwrites `demos/interimexecs/wp-clone/` and this folder.
