# Beacon CPA fonts (scraped 2026-09-05)

Source: live theme / builder CSS on https://beaconcpa.com. For **Refresh and Reimagine** — match these when they reinforce the brand.

## Worth keeping (brand)

| Role | Family | Weights | Notes |
| --- | --- | --- | --- |
| display | **Inter** | 400, 500, 600, 700 | Elementor primary / headings. |
| body | **DM Sans** | 400, 500, 700 | Elementor body / UI. |
| accent | **Open Sans** | 400, 600 | Secondary Elementor face. |

Live stacks:

- `"Inter", Sans-serif`
- `"DM Sans", Sans-serif`
- `"Open Sans", Sans-serif`

CDN (easiest Webflow match):

```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&family=Open+Sans:wght@400;600&display=swap
```

## Skip / do not treat as brand

Roboto, Helvetica, Arial, sans-serif, Font Awesome.

## Refresh later

`python3 scripts/refresh-asset-clone.py beaconcpa` rebuilds the clone and re-scrapes color tokens.
