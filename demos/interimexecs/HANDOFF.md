# Interim Execs market test — do not email yet

**QA ship gate on production is FAIL for a known reason:** https://secondshift.care/demos/interimexecs/ is still the older three-card hub on `main`. This PR is not merged. The agent will not merge it. Until a human merges, production will keep showing: no Stripe CTAs, no customize chat, `destinations.js` 404, `/ie/` 404.

## Preview

| URL | After human merge | Today on production |
| --- | --- | --- |
| https://secondshift.care/ie/ | New hub | 404 |
| https://secondshift.care/demos/interimexecs/ | New hub | Old three-card demo |
| https://secondshift.care/demos/interimexecs/wp-clone/ | Clone | Clone (already live) |
| https://chrisgerhardt-dev.github.io/second-shift/ | 301 to apex via Pages CNAME + `pages-redirect.js` | Old tree |

Prospect email draft (do not send): [`../../market-test/interimexecs-email.md`](../../market-test/interimexecs-email.md)

## Destinations (one file)

Edit only [`destinations.js`](destinations.js). Flip `ready` to `true` on Refresh/Reimagine after each Webflow site is actually Interim Execs content.

QA Stripe URLs in that file:

| Option | Buy path |
| --- | --- |
| Clone / desk | https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01 |
| Refresh $4,000 | https://buy.stripe.com/3cI8wQ4Wc0gH4fhgRU6Vq00 |
| Reimagine $6,000 | https://buy.stripe.com/28E5kEbkAd3t2796dg6Vq02 |

## QA must-haves on this branch (not yet on production)

1. Hub: Clone / Refresh / Reimagine + preview + buy + customize studio
2. Chat mutates the page 2–3 times, then human form (name, email, tier, remaining request) to `chris@gograybeard.com`. Not a live agent.
3. Webflow dests still Blurr / Notable — honest shell warnings; in-repo IE drafts as internal previews
4. Relative assets; `/ie/` and `/demos/interimexecs/` both work; `CNAME` + `pages-redirect.js` send github.io to `secondshift.care`
5. Reload does not silently refill turns; only labeled **Reset demo edits**
6. Migration/testing; Tiny Frog stays until acceptance; secure-by-default without overclaims
7. No merge from the agent

## Remaining send-blockers

1. **Human merge of this PR** so production is no longer the old hub.
2. **Replace the two Webflow template shells** with Interim Execs content.
   - https://interimexecs-refresh.webflow.io (Blurr)
   - https://interimexecs-reimagine.webflow.io (Notable/NOICELAND)
3. **Verify all three destination links** after that.
4. **Mailbox:** confirm FormSubmit on `chris@gograybeard.com` (`hello@secondshift.care` does not exist yet).

## Cleared

- `secondshift.care` HTTPS serves this GitHub Pages repo.

## Out of scope here

No email send. No DNS change. No paid spend. No merge of this PR from the agent.
