# InterimExecs brand tokens (scraped 2026-09-04)

Source: live theme CSS on https://interimexecs.com (`style.css`, compiled `master-preset1.css`, plus on-page inline colors).
For **Refresh and Reimagine** Webflow reuse — not a rebrand. Logo + this palette + [FONTS.md](FONTS.md).

The public site is **navy + gold + teal**, not a flat Coca-Cola red. “RED Team” is the product name; buttons and chrome use gold (`#e7bf8f`) on dark photography, with navy (`#3c5370`) and teal (`#377d95`) bands. Deep reds appear on a few emphasis bands.

## Logo

- SVG: `ie-logo.svg` (live header wordmark)
- PNG: `ie-logo.png` (same raster extracted from the SVG)
- Favicon: `favicon.png` (theme favicon)
- Clone copy: `../../wp-clone/assets/logo.svg`

Both Refresh and Reimagine take the logo from this folder. Do not redraw it.

## Colors

| Token | Hex | Where it shows on the live site |
| --- | --- | --- |
| Gold / button fill | `#e7bf8f` | `.gold`, `.btn-yellow`, primary buttons / hovers |
| Navy / band fill | `#3c5370` | Section bands, cards, footer-adjacent chrome |
| Teal / link | `#377d95` | Links / secondary type / active nav |
| Bright teal | `#008cba` | Compiled preset / Foundation default link |
| Orange CTA | `#d97732` | Strong CTAs (`#db651b` burnt / hover) |
| Brand red | `#a61f22` | Deep red bands (`#8f1b1e` hover, `#a62428` muted) |
| Ink / text | `#272727` | Near-black headings (`#222222` body) |
| Paper / background | `#ffffff` | Page ground |
| Mist / background | `#f5f5f5` | Alternate bands |
| Line / border | `#c1c1c1` | Rules and card edges |
| Hero overlay | `#1b2d42` | Dark navy wash on photography (approx.) |

## Type

See [FONTS.md](FONTS.md). Body **Open Sans**. Headings / nav **Raleway**. Occasional **Poppins**.

## Refresh later

```bash
python3 scripts/refresh-ie-asset-clone.py
node scripts/check-market-test.js
```
