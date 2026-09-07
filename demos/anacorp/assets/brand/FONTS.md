# Alliance North America fonts (scraped 2026-09-07)

Source: live theme / builder CSS on https://anacorp.com. For **Webflow Clone** — match these.

## Worth keeping (brand)

| Role | Family | Weights | Notes |
| --- | --- | --- | --- |
| display | **Russo One** | 400 | Live Elementor display / headings. Condensed industrial sans. |
| body | **Roboto** | 400, 500, 700 | Live Elementor body / UI. Also on fonts.googleapis.com. |
| accent | **Roboto Slab** | 400, 700 | Local Elementor Google Font (robotoslab.css). Use sparingly. |

Live stacks:

- `'Russo One', sans-serif`
- `'Russo One', Arial, serif`
- `'Roboto', sans-serif`

CDN (easiest Webflow match):

```
https://fonts.googleapis.com/css2?family=Russo+One&family=Roboto:wght@400;500;700&family=Roboto+Slab:wght@400;700&display=swap
```

## Skip / do not treat as brand

Arial, Helvetica, sans-serif, serif, Font Awesome.

## Refresh later

`python3 scripts/refresh-asset-clone.py anacorp` rebuilds the clone and re-scrapes color tokens.
