# Erwin PD portal experiment

Unofficial Second Shift prototype for **Erwin Police Department, Erwin, Tennessee**.

Not affiliated with the Town of Erwin or EPD. Every page carries a **DEMO** badge. Do not email the town.

Public Webflow (if Christopher stands one up later) stays separate. This folder is the static homepage + staff portal that GitHub Pages and Cloudflare Pages can both serve.

## Live paths

| Host | What it is |
| --- | --- |
| `https://secondshift.care/demos/erwin-pd-portal/` | GitHub Pages after merge to `main` |
| `https://erwin-pd-portal.pages.dev/` | Existing Cloudflare Pages project Christopher already named |

The Cloudflare hostname is currently an Access wall titled **TAS Portal Demo**. Point that project at this folder, then leave homepage public and put Access on the staff routes.

## What is here

```
index.html            Citizen homepage (911, 423-743-1870, 211 N Main Ave, Chief Tony Buchanan)
login.html            Officer entry — email, then a one-time code (Cloudflare Access pattern)
portal/index.html     Staff desk: shift card, tips queue, bulletin, links
portal/tips.html      Sample tip inbox
portal/directory.html Roles. Only named person: Chief Tony Buchanan
```

Facts used (and only these):

- Erwin Police Department, Erwin TN
- 211 N Main Ave, 37650
- Non-emergency 423-743-1870
- Emergency 911
- Chief Tony Buchanan (February 2026)

Bulletin cards (fleet, body cams, radios, policies) are **demo copy** from public remarks. Refresh them when screenshots of the live TAS Portal Demo arrive.

## Local preview

```bash
cd demos/erwin-pd-portal
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`. Citizen homepage is `/`. Officer portal is `/login.html`.

Demo login (no Access in front):

1. Any email with an `@`
2. Code `000000`
3. Nothing is emailed

If a `CF_Authorization` cookie is already present (Cloudflare Access passed), the PIN step is skipped.

## Connect Cloudflare Pages to `erwin-pd-portal.pages.dev`

The Pages project already exists. Do not create a second project.

1. Cloudflare Dashboard → **Workers & Pages** → project **`erwin-pd-portal`** (hostname `erwin-pd-portal.pages.dev`).
2. **Settings → Builds & deployments**
   - Connect this GitHub repo: `chrisgerhardt-dev/second-shift`
   - Production branch: `main`
   - **Root directory:** `demos/erwin-pd-portal`
   - Build command: leave empty
   - Build output directory: leave empty / `/` (this folder is already static)
3. Save and retry the latest deployment.
4. **Zero Trust → Access → Applications**
   - Rename the application from **TAS Portal Demo** to **Erwin PD Officer Portal** (or keep the old name; only the login title changes).
   - Protect staff paths only. Leave the citizen homepage public:

   | Path | Policy |
   | --- | --- |
   | `/` and `/index.html` | Bypass / public |
   | `/css/*`, `/js/*`, `/favicon.svg`, `/robots.txt` | Bypass / public |
   | `/login*` | Allow (email one-time code) |
   | `/portal*` | Allow (email one-time code) |

5. Include `chris@gograybeard.com` on the allow policy.

Resulting UX on the Pages hostname:

`homepage → Officer portal → Cloudflare Access email code → staff desk`

GitHub Pages has no Access. There the same Officer portal link uses the in-page soft gate (`000000`).

## Do not

- Email the Town of Erwin or EPD
- Invent officer names
- Treat sample tips as real reports
- Put this card on the Second Shift marketing lander (there is no demos index)

## Refresh later

When TAS Portal Demo screenshots or notes arrive, update `js/data.js` (shift, tips, bulletin) and the desk copy. Keep the disclaimer and DEMO bar.
