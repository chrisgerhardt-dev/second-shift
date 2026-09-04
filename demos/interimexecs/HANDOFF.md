# Interim Execs market test — HOLD (2026-09-03)

**Status (2026-09-04 afternoon):** Christopher ordered Refresh and Reimagine rebuilt in Webflow from the **true InterimExecs clone**. Hub flags are `refresh.ready = false` and `reimagine.ready = false` so the public hub does not show mid-rebuild shells as Ready. Clone stays `ready: true` at https://interimexecs.com. Live Webflow hrefs are unchanged. `formSubmitProven` stays **false**. Three-tier email is blocked.

**Status (2026-09-04):** `wp-clone/` is now a high-fidelity asset mirror of the live public site (real logo, hero, headshots, company-mark strip, theme CSS). Preview Clone on the hub still opens https://interimexecs.com. Use `wp-clone/` / `assets/brand/` for customize-canvas reuse and the **Refresh and Reimagine** logo / palette / fonts. FormSubmit to `chris@gograybeard.com` is still **unconfirmed**. Three-tier email is blocked.

**Status (2026-09-03 evening):** Production serves this repo (PR #5, PR #7). Clone remains **IE-ready**. Refresh and Reimagine were briefly marked IE-ready for ladder review, then parked again for the true-clone rebuild. This hub is for Christopher’s review — not a prospect email send. FormSubmit to `chris@gograybeard.com` is **unconfirmed**.

**Three-tier email is blocked** until Refresh and Reimagine are IE-ready again **and** FormSubmit delivery is proven. Do not send the three-option comparison until both pass.

**Authorized now:** Clone-only draft in [`../../market-test/interimexecs-email.md`](../../market-test/interimexecs-email.md). That draft links **only** `https://secondshift.care/demos/interimexecs/wp-clone/`. It must not link the hub, `/ie/`, or any `webflow.io` URL. The buried three-tier draft stays blocked: [`../../market-test/interimexecs-email-three-tier-blocked.md`](../../market-test/interimexecs-email-three-tier-blocked.md).

## Safety

- Unready Refresh and Reimagine do **not** expose live Stripe $4k / $6k deposit buy buttons. Hub shows **Talk first** (`mailto:chris@gograybeard.com`) and Ask about the desk. Stored Stripe URLs stay in `destinations.js` for later.
- Clone `$750/mo` desk buy may stay. Clone remains the only Ready public preview.
- Customize canvas has a persistent **DEMO EDIT** watermark. Chat stays not-a-live-agent / no-passwords. Mutation text with password, login, wp-admin, api key, ssh, guarantee, fire Tiny Frog, replace Tiny Frog, or fake dollar pricing is blocked. 2–3 turn cap; labeled **Reset demo edits** only.
- Thanks page does not claim a receipt we cannot prove.

## Live URLs (do not put hub or /ie/ in authorized email)

- Clone (hub Preview Clone CTA): https://interimexecs.com — live site, same site / lower bill proof. **IE-ready.**
- Clone asset mirror (hub “Asset clone” / `choices.clone.internalPreview` + `assetMirror`): https://secondshift.care/demos/interimexecs/wp-clone/ — local high-fidelity snapshot for customize / logo reuse. Refresh the mirror later with `python3 scripts/refresh-ie-asset-clone.py`.
- Brand pack for **Refresh and Reimagine** (logo + hex tokens + fonts): [`assets/brand/`](assets/brand/) — take `ie-logo.svg` / `ie-logo.png`, `COLORS.md` / `brand.json`, and `FONTS.md` (Open Sans / Raleway / Poppins). Webflow Designer inject is a follow-up.
- Hub (internal / not for prospect email): https://secondshift.care/demos/interimexecs/
- Short alias (not for prospect email): https://secondshift.care/ie/
- Refresh (not IE-ready — rebuild from true clone; not for authorized email): https://interimexecs-refresh.webflow.io
- Reimagine (not IE-ready — rebuild from true clone; not for authorized email): https://interimexecs-reimagine.webflow.io

## Destinations (one file)

Edit only [`destinations.js`](destinations.js). Keep `ready: false` on Refresh and Reimagine until each public Webflow URL is actually Interim Execs content again after the true-clone rebuild. Keep `formSubmitProven: false` until mailbox delivery is proven. The hub send-gate stays closed until that flag flips **and** both shells are IE-ready.

| Option | Stripe path (do not surface on unready cards) |
| --- | --- |
| Clone / desk | https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01 |
| Refresh $4,000 | https://buy.stripe.com/3cI8wQ4Wc0gH4fhgRU6Vq00 |
| Reimagine $6,000 | https://buy.stripe.com/28E5kEbkAd3t2796dg6Vq02 |

## Remaining send-blockers (three-tier)

1. **Finish the Webflow rebuild** of Refresh and Reimagine from the true InterimExecs clone. Do not flip `ready: true` while those live URLs are mid-rebuild.
   - https://interimexecs-refresh.webflow.io
   - https://interimexecs-reimagine.webflow.io
2. **Verify** all three destination links after that (Clone, Refresh, Reimagine).
3. **Mailbox:** FormSubmit to `chris@gograybeard.com` is still unconfirmed. `hello@secondshift.care` does not exist yet. **Verify** delivery before any three-tier email.

## Cleared

- `secondshift.care` HTTPS serves this repo.
- Clone preview is live and IE-ready.

## Brand (Refresh and Reimagine)

**Refresh and Reimagine staging must Empathize on the IE audience** (owners, boards, PE who need on-demand senior operators) **and match this brand palette** (navy / gold / teal, not an invented Coca-Cola red) **plus the live fonts when they reinforce the brand**. Logo reuse for both shells. Do not redraw the wordmark. See [`assets/brand/`](assets/brand/).

## Out of scope here

No email send except the authorized Clone-only draft after a human confirms. No DNS change. No paid spend.
