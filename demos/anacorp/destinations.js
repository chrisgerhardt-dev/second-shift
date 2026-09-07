/**
 * Alliance North America (ANA) market-ladder destinations — edit this file only.
 *
 * Hub and scripts/check-candidates.js read this object.
 *
 * ANA play (locked): lead package is Webflow migration — clone of their site
 * with obvious improvements (not a redesign) — plus the $750/mo desk including
 * SEO optimization (monthly on-page/content SEO pass).
 * Do not lead with Refresh $4k / Reimagine $6k. Those stay muted step-ups.
 *
 * Clone preview (js-dest) is the live site. Asset clone is wp-clone/.
 * Primary buy-path preview is Webflow Clone staging (choices.clone.webflowPreview).
 * Until a dedicated clone subdomain exists, anacorp-refresh.webflow.io is the
 * close-Clone stand-in. Swap webflowPreview.href when a clone host is ready.
 *
 * Destination flips:
 *   Refresh and Reimagine hrefs are wired to the Webflow staging hosts.
 *   Keep ready: false (pending / placeholder UI) until that public URL is
 *   actually Alliance North America content — not a 404 or empty shell.
 *   Then flip choices.refresh.ready / choices.reimagine.ready to true.
 *
 * Staging URLs (DEMO / review-only, not a live cutover):
 *   https://anacorp-refresh.webflow.io/   (close-Clone stand-in + Refresh)
 *   https://anacorp-reimagine.webflow.io/
 *
 * Compliance (hub sell side): Webflow Clone preserves legal pages, trademarks,
 * and accurate contact. The SEO desk does not invent claims.
 * Obvious improvement: California Privacy Choices / Do Not Sell-Share opt-out
 * wired properly on the Clone. Site hygiene — not legal advice.
 *
 * No Stripe on this ladder — ready choices still use Talk first.
 * Talk first goes to hello@secondshift.care (no personal mailbox on this hub).
 *
 * Refresh the mirror later:
 *   python3 scripts/refresh-asset-clone.py anacorp
 */
window.SECOND_SHIFT_DESTINATIONS = {
  slug: "anacorp",
  name: "Alliance North America",
  liveOrigin: "https://anacorp.com",
  customDomainReady: true,
  formSubmitProven: false,
  contactEmail: "hello@secondshift.care",
  talkFirstLabel: "Talk first",
  migrationPromise: "Webflow migration is the lead package: clone of the current site with obvious improvements, then the $750/mo desk including a monthly SEO pass.",

  choices: {
    clone: {
      label: "Clone",
      href: "https://anacorp.com",
      ready: true,
      cta: "Preview live site",
      price: "$750 / month",
      priceNote: "$750/mo desk after cutover, including SEO optimization — a monthly on-page/content SEO pass. No redesign fee.",
      summary: "Webflow migration. Clone of their site with obvious improvements. Not a redesign. $750/mo desk includes SEO.",
      internalPreview: "wp-clone/index.html",
      assetMirror: "wp-clone/index.html",
      webflowPreview: {
        href: "https://anacorp-refresh.webflow.io/",
        cta: "Webflow Clone staging (DEMO)",
        standIn: true,
        note: "Close-Clone stand-in until a dedicated clone subdomain exists. DEMO / review-only."
      }
    },
    refresh: {
      label: "Refresh",
      href: "https://anacorp-refresh.webflow.io/",
      ready: false,
      cta: "Preview Refresh (DEMO)",
      price: "$4,000 once + $750 / month",
      priceNote: "$4,000 once. $750/month growth desk begins after cutover/acceptance unless otherwise agreed.",
      summary: "Optional step-up. Webflow restyle. Familiar pages, cleaner look.",
      shellWarning: "Optional step-up. DEMO / review-only. URL is wired to anacorp-refresh.webflow.io. Not READY yet — pending teammate craft (staging was a 404 on 2026-09-07). Flip choices.refresh.ready to true when that host shows Alliance North America content.",
      internalPreview: "",
      talk: {
        href: "mailto:hello@secondshift.care?subject=Second%20Shift%20Refresh%20%E2%80%94%20talk%20first",
        label: "Talk first"
      }
    },
    reimagine: {
      label: "Reimagine",
      href: "https://anacorp-reimagine.webflow.io/",
      ready: false,
      cta: "Preview Reimagine (DEMO)",
      price: "$6,000 once + $750 / month",
      priceNote: "$6,000 once. One tuning round means one consolidated feedback set. $750/month begins after cutover/acceptance unless otherwise agreed. Not a full rebrand (separate, $10,000+).",
      summary: "Optional step-up. Modern redesign without a full rebrand.",
      shellWarning: "Optional step-up. DEMO / review-only. URL is wired to anacorp-reimagine.webflow.io. Not READY yet — pending teammate craft (staging was a 404 on 2026-09-07). Flip choices.reimagine.ready to true when that host shows Alliance North America content.",
      internalPreview: "",
      talk: {
        href: "mailto:hello@secondshift.care?subject=Second%20Shift%20Reimagine%20%E2%80%94%20talk%20first",
        label: "Talk first"
      }
    }
  }
};
