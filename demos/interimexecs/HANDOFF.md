# Interim Execs market test — ANA migration play (2026-09-09)

**Status (2026-09-09):** Hub retuned to the same locked package as ANA. Lead is a pure WordPress → Webflow migration — same website, now no-code Webflow. WordPress developers are the bottleneck. Client edits in the Webflow Editor after cutover. Plus the **$750/mo SEO desk** (monthly on-page/content SEO pass). Not a redesign. Do not lead with Refresh $4k / Reimagine $6k.

**Public hub:** Current | Webflow Clone comparison at [`index.html`](index.html) / https://secondshift.care/demos/interimexecs/. DEMO / review-only. No Christopher name or `gograybeard` on public pages. Talk first goes to `hello@secondshift.care`. No Stripe. This page does not send outreach. Do not email Interim Execs.

**Webflow Clone:** `choices.clone.webflowPreview.ready` is **false**. Close-Clone stand-in is https://interimexecs-refresh.webflow.io/ (teammate may rename to `interimexecs-clone.webflow.io`). Host returned HTTP 404 on 2026-09-09. Hub shows **Staging soon**. Flip `ready` to true when that host serves Interim Execs content. Do not iframe `webflow.io` (CSP).

**Muted step-ups:** `choices.refresh.ready` and `choices.reimagine.ready` stay **false**. Hidden redesign ladder only. Not the lead.

**Current pane:** live https://www.interimexecs.com/ (canonical `https://interimexecs.com`) plus local [`wp-clone/`](wp-clone/) asset still / mirror.

**FormSubmit / three-tier email:** still blocked. `formSubmitProven` stays **false**. Authorized Clone-only draft remains [`../../market-test/interimexecs-email.md`](../../market-test/interimexecs-email.md) — confirm before send. Buried three-tier draft stays blocked: [`../../market-test/interimexecs-email-three-tier-blocked.md`](../../market-test/interimexecs-email-three-tier-blocked.md).

## Safety

- Public pages do not use `chris@gograybeard.com` or a personal name.
- No live Stripe $4k / $6k deposit buttons. Talk first only.
- Send Gate: hub copy must not imply an email was sent. Do not email Interim Execs.
- Clone preview is the live site. Asset clone is `wp-clone/` for stills / logo reuse.

## Live URLs (do not put hub or /ie/ in authorized email)

- Current (hub Open current site): https://www.interimexecs.com/ — live WordPress. **Ready.**
- Clone asset mirror (hub “Local asset clone” / `choices.clone.internalPreview` + `assetMirror`): https://secondshift.care/demos/interimexecs/wp-clone/ — local high-fidelity snapshot. Refresh with `python3 scripts/refresh-ie-asset-clone.py`.
- Brand pack (logo + hex tokens + fonts): [`assets/brand/`](assets/brand/)
- Hub (client-sendable comparison / not a live cutover): https://secondshift.care/demos/interimexecs/
- Short alias: https://secondshift.care/ie/
- Webflow Clone stand-in (not READY — Staging soon; 404 on 2026-09-09): https://interimexecs-refresh.webflow.io/
- Reimagine (muted step-up; not READY): https://interimexecs-reimagine.webflow.io/

## Destinations (one file)

Edit only [`destinations.js`](destinations.js). Keep `choices.clone.webflowPreview.ready` **false** until the Webflow host shows Interim Execs content. Keep Refresh / Reimagine `ready: false`. Keep `formSubmitProven: false` until mailbox delivery is proven. Verify before any prospect email.

## Remaining send-blockers

1. **Webflow Clone host:** interimexecs-refresh.webflow.io was a 404 on 2026-09-09. Do not flip `webflowPreview.ready` until it serves IE content.
2. **Mailbox:** FormSubmit delivery is still unconfirmed. **Verify** before any authorized email.

## Cleared

- `secondshift.care` HTTPS serves this repo.
- Current / live site preview is ready.
- Public hub matches the ANA migration pitch (same look, no-code Webflow, $750/mo SEO desk).

## Out of scope here

No email send except the authorized Clone-only draft after a human confirms. No DNS change. No paid spend.
