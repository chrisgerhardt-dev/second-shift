# Interim Execs market test — do not email yet

Christopher: review only. Do not email Interim Execs, change DNS, spend money, or merge until the blockers below are cleared and you have verified all three links.

## Preview now

- Hub: https://chrisgerhardt-dev.github.io/second-shift/demos/interimexecs/
- Short alias: https://chrisgerhardt-dev.github.io/second-shift/ie/
- Clone (in repo): https://chrisgerhardt-dev.github.io/second-shift/demos/interimexecs/wp-clone/

After merge, those GitHub Pages URLs update from `main`. `secondshift.care` is **not** this site today.

Prospect email draft (do not send): [`../../market-test/interimexecs-email.md`](../../market-test/interimexecs-email.md)

## Destinations (one file)

Edit only [`destinations.js`](destinations.js). Flip `ready` to `true` on Refresh/Reimagine after each Webflow site is actually Interim Execs content. Flip `customDomainReady` to `true` only after `secondshift.care` serves this repo.

Live Stripe Payment Links already in that file:

| Option | Buy path |
| --- | --- |
| Clone | $750/mo growth desk `…q01` |
| Refresh | $4,000 conversion `…q00` + optional desk |
| Reimagine | $6,000 authority `…q02` + optional desk |

## Blockers before any email

1. **Move `secondshift.care` DNS off parking.** It is a GoDaddy parked page, not this repo. Point the domain at GitHub Pages for `chrisgerhardt-dev/second-shift`. Do not add a CNAME in-repo until DNS is yours to change.
2. **Replace the two Webflow template shells with Interim Execs content.**
   - Refresh (`https://interimexecs-refresh.webflow.io`) is still the free **Blurr** launch-page template.
   - Reimagine (`https://interimexecs-reimagine.webflow.io`) is still the free **Notable/NOICELAND** blog template.
   - In-repo IE-specific drafts live at `webflow-refresh/` and `webflow-demo/` (internal preview only).
3. **Verify all three links** from the hub: Clone (repo), Refresh (Webflow), Reimagine (Webflow). Confirm each shows Interim Execs — not parking, not a stock template.
4. **Mailbox.** `hello@secondshift.care` does not exist yet. Customize handoff uses FormSubmit + mailto to `chris@gograybeard.com`. FormSubmit must be confirmed once on that inbox before the form delivers.

The hub shows **Do not email Interim Execs yet** until every `ready` flag and `customDomainReady` is true.

## Out of scope here

No email send. No DNS change. No new paid Stripe/Webflow/domain spend. No merge of this PR from the agent.
