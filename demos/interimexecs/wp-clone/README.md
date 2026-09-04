# InterimExecs asset clone

High-fidelity static mirror of the public WordPress site for Second Shift
demos and asset reuse. Served on GitHub Pages at:

https://secondshift.care/demos/interimexecs/wp-clone/

**Preview Clone** on the market-test hub still opens the live site
(`https://interimexecs.com`). This folder is the customize / asset-reuse
mirror (`choices.clone.internalPreview` / `choices.clone.assetMirror`).

## What is mirrored

Starter-scope public pages (same filenames the hub and checks already use):

| File | Live URL |
| --- | --- |
| `index.html` | https://interimexecs.com/ |
| `contact.html` | https://interimexecs.com/contactus/ |
| `services.html` | https://interimexecs.com/problems-we-solve/ |
| `how-it-works.html` | https://interimexecs.com/our-approach/ |
| `case-studies.html` | https://interimexecs.com/case-studies/ |
| `blog.html` | https://interimexecs.com/blog/ |
| `about.html` | https://interimexecs.com/about/ |
| `apply.html` | https://interimexecs.com/membership/ |

Images (hero, logo, headshots, company-mark strip), theme CSS, and JS needed
for nav / carousels are stored with **relative** paths so project Pages works.

Uncloned deep links (individual posts, login, legal) stay on
`https://interimexecs.com/...`.

## Dummy forms

Every `<form>` is neutralized. Nothing posts to InterimExecs or WP Engine.
`js/site.js` intercepts submit and shows a staging notice.

## Staging mark

A 26px corner **SS** badge (`css/style.css`) — not a full-width bar — so a
side-by-side with the live site still proves color, type, spacing, and imagery.

## Refresh from live

From the repo root:

```bash
python3 scripts/refresh-ie-asset-clone.py
node scripts/check-market-test.js
```

The script overwrites this directory and rebuilds `../assets/brand/`
(logo SVG/PNG, favicon, `COLORS.md` / `brand.json` / `FONTS.md`). Refresh
**and Reimagine** take the logo, navy/gold/teal palette, and Open Sans /
Raleway from `demos/interimexecs/assets/brand/`.

Crawled: 2026-09-04. Public pages only. No emails, no Stripe,
no Webflow Designer edits.
