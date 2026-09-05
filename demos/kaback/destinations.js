/**
 * Kaback Enterprises market-ladder destinations — edit this file only.
 *
 * Hub and scripts/check-candidates.js read this object.
 * Clone preview is the live site. Asset clone is wp-clone/.
 * Refresh / Reimagine stay ready:false until Webflow publishes.
 *
 * Refresh the mirror later:
 *   python3 scripts/refresh-asset-clone.py kaback
 */
window.SECOND_SHIFT_DESTINATIONS = {
  slug: "kaback",
  name: "Kaback Enterprises",
  liveOrigin: "https://kaback.com",
  customDomainReady: true,
  formSubmitProven: false,
  contactEmail: "chris@gograybeard.com",
  talkFirstLabel: "Talk first",
  migrationPromise: "If you purchase Clone, Refresh, or Reimagine, we handle migration and testing before cutover.",

  choices: {
    clone: {
      label: "Clone",
      href: "https://kaback.com",
      ready: true,
      cta: "Preview Clone",
      price: "$750 / month",
      priceNote: "No redesign fee. Growth desk begins after cutover/acceptance unless otherwise agreed.",
      summary: "Same WordPress site, lower bill. Contact lives on the homepage.",
      internalPreview: "wp-clone/index.html",
      assetMirror: "wp-clone/index.html"
    },
    refresh: {
      label: "Refresh",
      href: "https://kaback-refresh.webflow.io",
      ready: false,
      cta: "Preview Refresh",
      price: "$4,000 once + $750 / month",
      priceNote: "Webflow URL TBD. Not ready to show until Webflow publishes.",
      summary: "Webflow restyle. Familiar pages, cleaner look.",
      shellWarning: "Refresh is not ready to show. Webflow staging URL is a placeholder until the site publishes.",
      internalPreview: "",
      talk: {
        href: "mailto:chris@gograybeard.com?subject=Second%20Shift%20Refresh%20%E2%80%94%20talk%20first",
        label: "Talk first"
      }
    },
    reimagine: {
      label: "Reimagine",
      href: "https://kaback-reimagine.webflow.io",
      ready: false,
      cta: "Preview Reimagine",
      price: "$6,000 once + $750 / month",
      priceNote: "Webflow URL TBD. Not ready to show until Webflow publishes.",
      summary: "Modern redesign without a full rebrand.",
      shellWarning: "Reimagine is not ready to show. Webflow staging URL is a placeholder until the site publishes.",
      internalPreview: "",
      talk: {
        href: "mailto:chris@gograybeard.com?subject=Second%20Shift%20Reimagine%20%E2%80%94%20talk%20first",
        label: "Talk first"
      }
    }
  }
};
