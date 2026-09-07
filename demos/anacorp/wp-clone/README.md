# Alliance North America asset clone

High-fidelity static snapshot of the public site for Second Shift
demos and asset reuse. Served on GitHub Pages at:

https://secondshift.care/demos/anacorp/wp-clone/

The comparison hub Current pane opens the live site
(`https://www.anacorp.com/`). This folder is the customize / asset-reuse
mirror (`choices.clone.internalPreview` / `choices.clone.assetMirror`).

## What is mirrored

| File | Live URL |
| --- | --- |
| `index.html` | https://anacorp.com/ |
| `contact.html` | https://anacorp.com/contact/ |

Uncloned deep links stay on `https://anacorp.com/...`.

## Dummy forms

Every `<form>` is neutralized. Nothing posts to Alliance North America.

## Staging mark

A 26px corner **SS** badge (`css/style.css`) — not a full-width bar.

## Refresh from live

```bash
python3 scripts/refresh-asset-clone.py anacorp
node scripts/check-candidates.js
```

Crawled: 2026-09-07. Public pages only. No emails, no Stripe,
no Webflow Designer edits.
