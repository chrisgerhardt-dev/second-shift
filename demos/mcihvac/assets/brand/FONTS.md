# MCI Mechanical fonts (scraped 2026-09-05)

Source: live theme / builder CSS on https://www.mcihvac.com. For **Refresh and Reimagine** — match these when they reinforce the brand.

## Worth keeping (brand)

| Role | Family | Weights | Notes |
| --- | --- | --- | --- |
| display | **Lulo Clean W01 One Bold** | 700 | Wix paid display. Webflow stand-in: Anton or Barlow Condensed Bold. |
| body | **Brandon Grotesque Light** | 300, 400 | Wix paid body. Webflow stand-in: Montserrat 300/400. |
| accent | **DIN Next W01 Light** | 300 | Occasional UI. Webflow stand-in: DIN or Barlow. |

Live stacks:

- `lulo-clean-w01-one-bold, sans-serif`
- `brandon-grot-w01-light, sans-serif`
- `din-next-w01-light, sans-serif`

No public Google Fonts CDN on the live site. Use the keep families or the stand-ins noted above.

## Skip / do not treat as brand

Helvetica, Arial, Madefor, sans-serif.

## Refresh later

`python3 scripts/refresh-asset-clone.py mcihvac` rebuilds the clone and re-scrapes color tokens.
