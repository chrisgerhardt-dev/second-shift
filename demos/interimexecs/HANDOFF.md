# Interim Execs market test — ANA migration play (2026-09-09)

**Status (2026-09-09):** Hub retuned to the locked ANA play. Lead package is WordPress → no-code Webflow — same website, same look, not a redesign — plus the **$750/mo SEO desk**. Do not lead with Refresh $4k / Reimagine $6k. Public hub is DEMO / review-only. Talk first goes to `hello@secondshift.care`. This page does not send outreach.

**Webflow Clone:** `choices.clone.webflowPreview.ready` is **false**. Hub shows **Staging soon** until `https://interimexecs-refresh.webflow.io/` (or `interimexecs-clone.webflow.io` if a teammate renames) serves Interim Execs content. Both hosts returned HTTP 404 on 2026-09-09. Flip `webflowPreview.ready` to true when live. Do not iframe webflow.io (CSP).

**Muted step-ups:** `refresh.ready` and `reimagine.ready` stay false. Those cards stay hidden. Optional only.

**Send gate:** Review only. The hub must not imply email was sent. Authorized Clone-only draft remains gated in [`../../market-test/interimexecs-email.md`](../../market-test/interimexecs-email.md). Three-tier draft stays blocked: [`../../market-test/interimexecs-email-three-tier-blocked.md`](../../market-test/interimexecs-email-three-tier-blocked.md).

## Live URLs

- Current (hub Current pane): https://www.interimexecs.com/ — canonical https://interimexecs.com
- Asset clone: https://secondshift.care/demos/interimexecs/wp-clone/
- Hub (DEMO / review-only): https://secondshift.care/demos/interimexecs/
- Short alias: https://secondshift.care/ie/
- Webflow Clone stand-in (Staging soon): https://interimexecs-refresh.webflow.io/
- Reimagine (muted): https://interimexecs-reimagine.webflow.io/

## Destinations (one file)

Edit only [`destinations.js`](destinations.js). Keep `webflowPreview.ready` false until the host shows Interim Execs content. No Stripe on this ladder. Talk first only.

## Safety

- Public hub has no personal mailbox and no name on the page.
- Customize canvas is off the public hub (migration-only, like ANA).
- Dummy forms never email Interim Execs.
- Thanks page does not claim a receipt we cannot prove.

## Out of scope here

No outreach. No DNS change. No paid spend.
