# Western Mechanical Contractors fonts (scraped 2026-09-05)

Source: live theme / builder CSS on https://www.westernmech.com. For **Refresh and Reimagine** — match these when they reinforce the brand.

## Worth keeping (brand)

| Role | Family | Weights | Notes |
| --- | --- | --- | --- |
| body | **Verdana** | 400, 700 | Live body stack on the Market Hardware brochure. |
| display | **Palatino Linotype** | 400, 700 | Heading / quote face in layout.css. |

Live stacks:

- `Verdana, sans-serif`
- `"Palatino Linotype", "Book Antiqua", Palatino, serif`
- `Arial, Helvetica, sans-serif`

No public Google Fonts CDN on the live site. Use the keep families or the stand-ins noted above.

## Skip / do not treat as brand

Arial, Helvetica, sans-serif, serif.

## Refresh later

`python3 scripts/refresh-asset-clone.py westernmech` rebuilds the clone and re-scrapes color tokens.
