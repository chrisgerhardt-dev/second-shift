# Alliance North America brand tokens (scraped 2026-09-07)

Source: live CSS and homepage chrome on https://anacorp.com.
For **Webflow Clone** reuse — not a rebrand. Logo + this palette + [FONTS.md](FONTS.md).

## Logo

- File: `anacorp-logo.svg`
- Mark: `anacorp-mark.png` (favicon / logonotext)
- Clone copy: `../../wp-clone/assets/`

Do not redraw the metal wordmark.

## Colors

| Token | Hex | Notes |
| --- | --- | --- |
| red | `#ef3f36` | Primary ANA red (most frequent brand hex on homepage CSS) |
| redHot | `#f04135` | Adjacent live red |
| blue | `#388ac7` | Supporting product / link accent |
| green | `#81bd47` | Journey to Zero / hybrid |
| teal | `#47bed3` | Supporting |
| steel | `#939598` | Metal / UI |
| slate | `#58656a` | Secondary UI |
| gold | `#bc9e5a` | Supporting |
| ink | `#000000` | Body |
| paper | `#ffffff` | Ground |

## Type

See [FONTS.md](FONTS.md). Keep: **Russo One, Roboto, Roboto Slab**.

## Refresh later

```bash
python3 scripts/refresh-asset-clone.py anacorp
node scripts/check-candidates.js
```
