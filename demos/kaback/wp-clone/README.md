# Kaback Enterprises asset clone

High-fidelity static mirror of the public site for Second Shift
demos and asset reuse. Served on GitHub Pages at:

https://secondshift.care/demos/kaback/wp-clone/

**Preview Clone** on the market-test hub still opens the live site
(`https://kaback.com`). This folder is the customize / asset-reuse
mirror (`choices.clone.internalPreview` / `choices.clone.assetMirror`).

## What is mirrored

| File | Live URL |
| --- | --- |
| `index.html` | https://kaback.com/ |

Images, theme CSS, and JS needed for the mirrored pages use **relative**
paths so project Pages works.

Uncloned deep links stay on `https://kaback.com/...`.

## Dummy forms

Every `<form>` is neutralized. Nothing posts to Kaback.
`js/site.js` intercepts submit and shows a staging notice.

## Staging mark

A 26px corner **SS** badge (`css/style.css`) — not a full-width bar — so a
side-by-side with the live site still proves color, type, spacing, and imagery.

## Refresh from live

From the repo root:

```bash
python3 scripts/refresh-asset-clone.py kaback
node scripts/check-candidates.js
```

The script overwrites this directory and rebuilds `../assets/brand/`.

Crawled: 2026-09-05. Public pages only. No emails, no Stripe,
no Webflow Designer edits.
