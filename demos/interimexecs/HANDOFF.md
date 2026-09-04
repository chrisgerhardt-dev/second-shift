# Interim Execs market test — HOLD (2026-09-03)

**Status (2026-09-04):** `wp-clone/` is now a high-fidelity asset mirror of the live public site (real logo, hero, headshots, company-mark strip, theme CSS). Preview Clone on the hub still opens https://interimexecs.com. Use `wp-clone/` / `assets/brand/` for customize-canvas reuse and the Refresh logo. FormSubmit to `chris@gograybeard.com` is still **unconfirmed**. Three-tier email is blocked.

**Status (2026-09-03 evening):** Production serves this repo (PR #5, PR #7). Clone, Refresh, and Reimagine shells are **IE-ready** (craft-READY Webflow staging, 2026-09-03 evening). This hub flip is for Christopher’s review of the ladder links only — not a prospect email send. FormSubmit to `chris@gograybeard.com` is **unconfirmed**.

**Three-tier email is blocked** until FormSubmit delivery is proven. Do not send the three-option comparison until that mailbox check passes.

**Authorized now:** Clone-only draft in [`../../market-test/interimexecs-email.md`](../../market-test/interimexecs-email.md). That draft links **only** `https://secondshift.care/demos/interimexecs/wp-clone/`. It must not link the hub, `/ie/`, or any `webflow.io` URL. The buried three-tier draft stays blocked: [`../../market-test/interimexecs-email-three-tier-blocked.md`](../../market-test/interimexecs-email-three-tier-blocked.md).

## Safety

- Ready tiers restore stored Stripe buy/desk CTAs (Refresh $4k, Reimagine $6k, desk $750). Stripe Payment Links were not changed.
- Talk first remains the fallback if a tier is later marked unready.
- Customize canvas has a persistent **DEMO EDIT** watermark. Chat stays not-a-live-agent / no-passwords. Mutation text with password, login, wp-admin, api key, ssh, guarantee, fire Tiny Frog, replace Tiny Frog, or fake dollar pricing is blocked. 2–3 turn cap; labeled **Reset demo edits** only.
- Thanks page does not claim a receipt we cannot prove.

## Live URLs (do not put hub or /ie/ in authorized email)

- Clone (hub Preview Clone CTA): https://interimexecs.com — live site, same site / lower bill proof.
- Clone asset mirror (hub “Asset clone” / `choices.clone.internalPreview` + `assetMirror`): https://secondshift.care/demos/interimexecs/wp-clone/ — local high-fidelity snapshot for customize / logo reuse. Refresh the mirror later with `python3 scripts/refresh-ie-asset-clone.py`.
- Brand pack for Refresh / Reimagine (logo + hex tokens): [`assets/brand/`](assets/brand/) — take `ie-logo.svg` / `ie-logo.png`. Webflow Designer inject is a follow-up; this PR is the asset pack only.
- Hub (internal / not for prospect email): https://secondshift.care/demos/interimexecs/
- Short alias (not for prospect email): https://secondshift.care/ie/
- Refresh (IE-ready, not for authorized email): https://interimexecs-refresh.webflow.io
- Reimagine (IE-ready, not for authorized email): https://interimexecs-reimagine.webflow.io

## Destinations (one file)

Edit only [`destinations.js`](destinations.js). Refresh and Reimagine are `ready: true` after live verify. Keep `formSubmitProven: false` until mailbox delivery is proven. The hub send-gate stays closed until that flag flips.

| Option | Stripe path |
| --- | --- |
| Clone / desk | https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01 |
| Refresh $4,000 | https://buy.stripe.com/3cI8wQ4Wc0gH4fhgRU6Vq00 |
| Reimagine $6,000 | https://buy.stripe.com/28E5kEbkAd3t2796dg6Vq02 |

## Remaining send-blockers (three-tier)

1. **Mailbox:** FormSubmit to `chris@gograybeard.com` is still unconfirmed. `hello@secondshift.care` does not exist yet. **Verify** delivery before any three-tier email.

## Cleared

- `secondshift.care` HTTPS serves this repo.
- Clone preview is live and IE-specific.
- Refresh and Reimagine Webflow shells are IE-ready.

## Out of scope here

No email send except the authorized Clone-only draft after a human confirms. No DNS change. No paid spend.
