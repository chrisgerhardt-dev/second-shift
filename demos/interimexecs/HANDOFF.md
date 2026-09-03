# Interim Execs market test — do not email yet

Christopher: review only. Do not email Interim Execs, spend money, or merge until the remaining blockers are cleared and you have verified all three links.

## Preview

- Intended after this PR is on `main`: https://secondshift.care/ie/
- Also: https://secondshift.care/demos/interimexecs/
- GitHub Pages: https://chrisgerhardt-dev.github.io/second-shift/demos/interimexecs/
- Clone (already on `main`): https://secondshift.care/demos/interimexecs/wp-clone/

`secondshift.care` HTTPS is live and serving this repo. Production still has the **older** three-card hub until a human merges this PR. `/ie/` 404s and `destinations.js` 404s on production until then.

Prospect email draft (do not send): [`../../market-test/interimexecs-email.md`](../../market-test/interimexecs-email.md)

## Destinations (one file)

Edit only [`destinations.js`](destinations.js). Flip `ready` to `true` on Refresh/Reimagine after each Webflow site is actually Interim Execs content.

Live Stripe Payment Links in that file:

| Option | Buy path |
| --- | --- |
| Clone | $750/mo growth desk `…q01` |
| Refresh | $4,000 once `…q00` (desk is ongoing after cutover) |
| Reimagine | $6,000 once `…q03` (dedicated Reimagine Payment Link) |

## Remaining blockers before any email

1. **Replace the two Webflow template shells with Interim Execs content.**
   - Refresh (`https://interimexecs-refresh.webflow.io`) is still the free **Blurr** launch-page template.
   - Reimagine (`https://interimexecs-reimagine.webflow.io`) is still the free **Notable/NOICELAND** blog template.
   - In-repo IE-specific drafts live at `webflow-refresh/` and `webflow-demo/` (internal preview only).
2. **Verify all three links** from the hub after the work above: Clone (repo), Refresh (Webflow), Reimagine (Webflow). Confirm each shows Interim Execs — not a stock template.
3. **Mailbox.** `hello@secondshift.care` does not exist yet. Customize handoff uses FormSubmit + mailto to `chris@gograybeard.com`. FormSubmit must be confirmed once on that inbox before the form delivers.
4. **Merge this PR** (human decision) so `https://secondshift.care/ie/` exists. Do not merge from the agent.

The hub shows **Do not email Interim Execs yet** until Refresh and Reimagine are marked ready.

## Cleared

- `secondshift.care` DNS is off parking and serves this GitHub Pages site over HTTPS.

## Out of scope here

No email send. No further DNS change. No new paid Stripe/Webflow/domain spend. No merge of this PR from the agent.
