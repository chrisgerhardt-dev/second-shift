# InterimExecs fonts (scraped 2026-09-04)

Source: live `<link>` on https://interimexecs.com (Google Fonts). For **Refresh and Reimagine** Webflow staging — match these when they reinforce the brand. Do not invent a display face.

## Worth keeping (brand)

| Role | Family | Weights on the live site | Webflow |
| --- | --- | --- | --- |
| Body / UI | **Open Sans** | 300, 400, 500, 600, 700, 800 + italics | Built-in Google Font |
| Headings / nav | **Raleway** | 400, 500, 600, 700, 800, 900 | Built-in Google Font |
| Occasional bands | **Poppins** | 400, 700 | Built-in Google Font |

These are the live stacks (theme CSS):

- `'Raleway','Open Sans',sans-serif`
- `"Open Sans", Helvetica, Arial, sans-serif`
- `Poppins, "Open Sans", sans-serif`

## Skip / do not treat as brand

Helvetica, Arial, `sans-serif`, Font Awesome / ionicons. Those are fallbacks and icon fonts.

## CDN (easiest Webflow match)

Same request the live site makes:

```
https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700,800|Raleway:400,500,600,700,800,900|Poppins:400,700&subset=latin&display=swap
```

Or in the Webflow Designer: add **Open Sans**, **Raleway**, and **Poppins** from the Google Fonts panel. Body = Open Sans 400. Headings = Raleway 500–700. Buttons / gold labels can stay Raleway or Open Sans 600.

## Self-hosted latin files

`fonts/` is a latin-only subset for offline / Webflow custom-font upload:

| File | Family | Weight |
| --- | --- | --- |
| `open-sans-400.woff2` | Open Sans | 400 |
| `open-sans-600.woff2` | Open Sans | 600 |
| `open-sans-700.woff2` | Open Sans | 700 |
| `raleway-500.woff2` | Raleway | 500 |
| `raleway-600.woff2` | Raleway | 600 |
| `raleway-700.woff2` | Raleway | 700 |
| `poppins-400.woff2` | Poppins | 400 |
| `poppins-700.woff2` | Poppins | 700 |

`fonts/ie-fonts.css` maps those files. Open Sans / Raleway from this Google CSS version are variable fonts (same file bytes across listed weights).

## Refresh later

`python3 scripts/refresh-ie-asset-clone.py` rebuilds the clone and re-scrapes color tokens. Re-download fonts only if the live `<link>` families change.
