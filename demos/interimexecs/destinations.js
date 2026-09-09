/**
 * Interim Execs market-ladder destinations — edit this file only.
 *
 * Hub and scripts/check-market-test.js read this object.
 *
 * IE play (locked 2026-09-09, same as ANA): lead package is
 * WordPress → Webflow — same site, platform only, same look — plus
 * the $750/mo desk including SEO (monthly on-page/content SEO pass).
 * Not a redesign. Do not pitch “obvious improvements” or any
 * improvements in the migration. Later changes are the client's,
 * after cutover, in the Webflow Editor (no-code). WordPress
 * developers are the bottleneck; they keep the look and stop
 * waiting on WP.
 * Do not lead with Refresh $4k / Reimagine $6k. Those stay muted step-ups.
 *
 * Clone preview (js-dest) is the live site. Asset clone is wp-clone/.
 * Primary buy-path preview is Webflow Clone staging (choices.clone.webflowPreview).
 * Close-Clone stand-in is interimexecs-refresh-4d5162.webflow.io
 * (siteId 6aa172cba67941dfcc29e970). Published staging host as of
 * 2026-09-09. choices.clone.webflowPreview.ready stays false until
 * Home is eye-checked. Hub shows Staging soon. Do not iframe
 * webflow.io (CSP). Keep choices.refresh.ready false so the hidden
 * redesign rung stays muted.
 *
 * Staging URLs (DEMO / review-only, not a live cutover):
 *   https://interimexecs-refresh-4d5162.webflow.io/   (close-Clone stand-in)
 *   https://interimexecs-refresh.webflow.io/          (muted Refresh step-up)
 *   https://interimexecs-reimagine.webflow.io/
 *
 * Compliance (hub sell side): Webflow Clone preserves legal pages,
 * trademarks, and accurate contact. The SEO desk does not invent claims.
 *
 * No Stripe on this ladder — ready choices still use Talk first.
 * Talk first goes to hello@secondshift.care (no personal mailbox on this hub).
 *
 * Refresh the mirror later:
 *   python3 scripts/refresh-ie-asset-clone.py
 */
window.SECOND_SHIFT_DESTINATIONS = {
  slug: "interimexecs",
  name: "Interim Execs",
  liveOrigin: "https://interimexecs.com",
  customDomainReady: true,
  formSubmitProven: false,
  contactEmail: "hello@secondshift.care",
  talkFirstLabel: "Talk first",
  customizeTurns: 3,
  migrationPromise: "Webflow migration is the lead package: same website, now no-code Webflow. WordPress developers are the bottleneck. Same look. Owner-editable after cutover. Then the $750/mo desk including a monthly SEO pass. Pure platform swap — not a visual redesign.",

  choices: {
    clone: {
      label: "Clone",
      href: "https://interimexecs.com",
      ready: true,
      cta: "Preview live site",
      price: "$750 / month",
      priceNote: "$750/mo desk after cutover, including SEO optimization — a monthly on-page/content SEO pass. No redesign fee.",
      summary: "Same website, now no-code Webflow. Pure platform swap. Same look. $750/mo desk includes SEO. Not a redesign.",
      internalPreview: "wp-clone/index.html",
      assetMirror: "wp-clone/index.html",
      webflowPreview: {
        href: "https://interimexecs-refresh-4d5162.webflow.io/",
        siteId: "6aa172cba67941dfcc29e970",
        cta: "Open Webflow Clone (DEMO)",
        ready: false,
        standIn: true,
        note: "Close-Clone stand-in is wired to interimexecs-refresh-4d5162.webflow.io (siteId 6aa172cba67941dfcc29e970). Published staging host. Not READY yet — Home is still being eye-checked. Hub shows Staging soon. Flip choices.clone.webflowPreview.ready to true after that review, when the hub has a live still from this host."
      }
    },
    refresh: {
      label: "Refresh",
      href: "https://interimexecs-refresh.webflow.io/",
      ready: false,
      cta: "Preview Refresh (DEMO)",
      price: "$4,000 once + $750 / month",
      priceNote: "$4,000 once. $750/month growth desk begins after cutover/acceptance unless otherwise agreed.",
      summary: "Optional step-up. Webflow restyle. Familiar pages, cleaner look.",
      shellWarning: "Optional step-up. DEMO / review-only. URL is wired to interimexecs-refresh.webflow.io. Not READY yet — pending teammate craft (staging was a 404 on 2026-09-09). Flip choices.refresh.ready to true when that host shows Interim Execs content.",
      internalPreview: "webflow-refresh/index.html",
      talk: {
        href: "mailto:hello@secondshift.care?subject=Second%20Shift%20Refresh%20%E2%80%94%20talk%20first",
        label: "Talk first"
      }
    },
    reimagine: {
      label: "Reimagine",
      href: "https://interimexecs-reimagine.webflow.io/",
      ready: false,
      cta: "Preview Reimagine (DEMO)",
      price: "$6,000 once + $750 / month",
      priceNote: "$6,000 once. One tuning round means one consolidated feedback set. $750/month begins after cutover/acceptance unless otherwise agreed. Not a full rebrand (separate, $10,000+).",
      summary: "Optional step-up. Modern redesign without a full rebrand.",
      shellWarning: "Optional step-up. DEMO / review-only. URL is wired to interimexecs-reimagine.webflow.io. Not READY yet — pending teammate craft (staging was a 404 on 2026-09-09). Flip choices.reimagine.ready to true when that host shows Interim Execs content.",
      internalPreview: "webflow-demo/index.html",
      talk: {
        href: "mailto:hello@secondshift.care?subject=Second%20Shift%20Reimagine%20%E2%80%94%20talk%20first",
        label: "Talk first"
      }
    }
  }
};

window.SECOND_SHIFT_IE_DESTINATIONS = window.SECOND_SHIFT_DESTINATIONS;
