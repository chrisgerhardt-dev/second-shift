# Interim Execs market test — do not email yet

Production now serves the new package (PR #5). The live hub has Stripe buy CTAs and the customize chat.

## Live URLs

- Hub: https://secondshift.care/demos/interimexecs/
- Short alias: https://secondshift.care/ie/
- Clone: https://secondshift.care/demos/interimexecs/wp-clone/

Live QA: chat mutations and the 2–3 turn cap work. Clone is ready. The $750/mo desk and $4,000 Refresh Payment Links were verified in the browser.

Prospect email draft (do not send): [`../../market-test/interimexecs-email.md`](../../market-test/interimexecs-email.md)

## Destinations (one file)

Edit only [`destinations.js`](destinations.js). Keep `ready: false` on Refresh and Reimagine until each public Webflow URL is actually Interim Execs content. The hub keeps honest shell warnings until those flags flip.

| Option | Buy path |
| --- | --- |
| Clone / desk | https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01 |
| Refresh $4,000 | https://buy.stripe.com/3cI8wQ4Wc0gH4fhgRU6Vq00 |
| Reimagine $6,000 | https://buy.stripe.com/28E5kEbkAd3t2796dg6Vq02 |

## Remaining send-blockers

1. **Replace the two Webflow template shells** with Interim Execs content.
   - https://interimexecs-refresh.webflow.io (still Blurr)
   - https://interimexecs-reimagine.webflow.io (still Notable/NOICELAND)
2. **Verify all three destination links** after that (Clone, Refresh, Reimagine).
3. **Mailbox:** FormSubmit to `chris@gograybeard.com` is still unconfirmed. `hello@secondshift.care` does not exist yet.

Do not email Interim Execs until the Webflow shells are replaced and those three links are verified.

## Cleared

- `secondshift.care` HTTPS serves this repo.
- The new hub, `/ie/`, Stripe CTAs, and customize studio are live on production.

## Out of scope here

No email send. No DNS change. No paid spend. No merge from the agent.
