# Erwin PD portal experiment

Unofficial Second Shift prototype for **Erwin Police Department, Erwin, Tennessee**.

Not affiliated with the Town of Erwin or EPD. Every page carries a **DEMO** badge. Do not email the town.

Public Webflow (if Christopher stands one up later) stays separate. This folder is the static homepage + staff portal that GitHub Pages and Cloudflare Pages can both serve.

## Live paths

| Host | What it is |
| --- | --- |
| `https://secondshift.care/demos/erwin-pd-portal/` | GitHub Pages after merge to `main` — this is the open demo |
| `https://erwin-pd-portal.pages.dev/` | Existing Cloudflare Pages project Christopher already named |

**`erwin-pd-portal.pages.dev` currently has Cloudflare Access in front** (login title: **TAS Portal Demo**). That wall is on the hostname, not in this app. The demo itself is open: no real auth, no Access check, no magic code. Until Access is turned off or bypassed on that project, the Pages hostname will keep asking for an email code and will not show this site.

## What is here

```
index.html            Citizen homepage (911, 423-743-1870, 211 N Main Ave, Chief Tony Buchanan)
login.html            Officer door — Enter demo portal, or any username/password
portal/index.html     Staff desk: shift card, tips queue, bulletin, links (open, no gate)
portal/tips.html      Sample tip inbox (open)
portal/directory.html Roles. Only named person: Chief Tony Buchanan
```

Facts used (and only these):

- Erwin Police Department, Erwin TN
- 211 N Main Ave, 37650
- Non-emergency 423-743-1870
- Emergency 911
- Chief Tony Buchanan (February 2026)

Bulletin cards (fleet, body cams, radios, policies) are **demo copy** from public remarks. Refresh them when screenshots of the live TAS Portal Demo arrive.

## How the demo login works

`homepage → Officer portal → login.html`

- Big **Enter demo portal** button goes straight to the desk (plain link, works without JavaScript)
- The form accepts **any** username and password, including blanks
- Portal routes are also open if you hit them directly
- Client-side only. Nothing is emailed or checked against a server

## Local preview

```bash
cd demos/erwin-pd-portal
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Connect Cloudflare Pages to `erwin-pd-portal.pages.dev`

The Pages project already exists. Do not create a second project.

1. Cloudflare Dashboard → **Workers & Pages** → project **`erwin-pd-portal`**.
2. **Settings → Builds & deployments**
   - Connect this GitHub repo: `chrisgerhardt-dev/second-shift`
   - Production branch: `main`
   - **Root directory:** `demos/erwin-pd-portal`
   - Build command: leave empty
   - Build output directory: leave empty / `/`
3. Save and retry the latest deployment.
4. **Zero Trust → Access:** the hostname is still branded **TAS Portal Demo**. Disable that Access application, or add a Bypass policy for everyone, so the open demo is actually reachable. Do not leave Access as the only way in — this prototype is not built to sit behind it.

After Access is off:

`https://erwin-pd-portal.pages.dev/` → citizen homepage → Officer portal → desk.

## Do not

- Email the Town of Erwin or EPD
- Invent officer names
- Treat sample tips as real reports
- Put this card on the Second Shift marketing lander (there is no demos index)

## Refresh later

When TAS Portal Demo screenshots or notes arrive, update `js/data.js` (shift, tips, bulletin) and the desk copy. Keep the disclaimer and DEMO bar.
