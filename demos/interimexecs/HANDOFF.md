# Interim Execs market test — HOLD (2026-09-03)

**Status (2026-09-03):** Production serves this repo (PR #5). Clone is the only IE-ready public preview. Refresh and Reimagine live Webflow URLs are still unmodified templates (Blurr / Notable). FormSubmit to `chris@gograybeard.com` is **unconfirmed**. Do not flip `ready: true` until those shells are actually Interim Execs content.

**Three-tier email is blocked** until **both** are true:

1. Refresh and Reimagine shells are IE-ready (`ready: true` only after that), **and**
2. FormSubmit delivery is proven.

**Authorized now:** Clone-only draft in [`../../market-test/interimexecs-email.md`](../../market-test/interimexecs-email.md). That draft links **only** `https://secondshift.care/demos/interimexecs/wp-clone/`. It must not link the hub, `/ie/`, or any `webflow.io` URL. The buried three-tier draft stays blocked: [`../../market-test/interimexecs-email-three-tier-blocked.md`](../../market-test/interimexecs-email-three-tier-blocked.md).

## Safety after Grok Heavy HOLD

- Unready tiers (`ready: false`) do **not** expose live Stripe $4k Refresh or $6k Reimagine deposit buy buttons. Hub shows **Talk first** (`mailto:chris@gograybeard.com`) or a non-buy CTA. Desk add-ons on unready tiers are talk-first, not the primary Stripe path.
- Clone `$750/mo` desk buy may stay.
- Customize canvas has a persistent **DEMO EDIT** watermark. Chat stays not-a-live-agent / no-passwords. Mutation text with password, login, wp-admin, api key, ssh, guarantee, fire Tiny Frog, replace Tiny Frog, or fake dollar pricing is blocked. 2–3 turn cap; labeled **Reset demo edits** only.
- Thanks page does not claim a receipt we cannot prove.

## Live URLs (do not put hub or /ie/ in authorized email)

- Clone (authorized public preview): https://secondshift.care/demos/interimexecs/wp-clone/
- Hub (internal / not for prospect email): https://secondshift.care/demos/interimexecs/
- Short alias (not for prospect email): https://secondshift.care/ie/

## Destinations (one file)

Edit only [`destinations.js`](destinations.js). Keep `ready: false` on Refresh and Reimagine until each public Webflow URL is actually Interim Execs content. Stored Stripe URLs stay in that file for later; the hub must not expose deposit buy buttons while `ready` is false.

| Option | Stored Stripe path (do not surface on unready cards) |
| --- | --- |
| Clone / desk | https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01 |
| Refresh $4,000 | https://buy.stripe.com/3cI8wQ4Wc0gH4fhgRU6Vq00 |
| Reimagine $6,000 | https://buy.stripe.com/28E5kEbkAd3t2796dg6Vq02 |

## Remaining send-blockers (three-tier)

1. **Replace the two Webflow template shells** with Interim Execs content.
   - https://interimexecs-refresh.webflow.io (still Blurr)
   - https://interimexecs-reimagine.webflow.io (still Notable/NOICELAND)
2. **Verify** all three destination links after that (Clone, Refresh, Reimagine).
3. **Mailbox:** FormSubmit to `chris@gograybeard.com` is still unconfirmed. `hello@secondshift.care` does not exist yet.

## Cleared

- `secondshift.care` HTTPS serves this repo.
- Clone preview is live and IE-specific.

## Out of scope here

No email send except the authorized Clone-only draft after a human confirms. No DNS change. No paid spend. No merge from the agent. Do not flip `ready: true`.
