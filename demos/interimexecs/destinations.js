/**
 * Interim Execs market-test destinations — edit this file only.
 *
 * Hub, customize demo, and scripts/check-market-test.js read this object.
 * No build step. Works on GitHub Pages project paths.
 *
 * Flip choice.ready when that public URL is actually Interim Execs content.
 * Ready choices restore stored Stripe buy/desk CTAs. Unready choices stay Talk first.
 * Flip formSubmitProven only after mailbox delivery is proven.
 * Flip customDomainReady only after secondshift.care serves this repo.
 */
window.SECOND_SHIFT_IE_DESTINATIONS = {
  customDomainReady: true,
  formSubmitProven: false,
  intendedPublicOrigin: "https://secondshift.care",
  githubPagesOrigin: "https://chrisgerhardt-dev.github.io",
  githubPagesPath: "/second-shift/",
  contactEmail: "chris@gograybeard.com",
  formSubmit: "https://formsubmit.co/chris@gograybeard.com",
  customizeTurns: 3,
  talkFirstLabel: "Talk first",
  migrationPromise: "If you purchase Clone, Refresh, or Reimagine, we handle migration and testing before cutover. Keep Tiny Frog active until you accept the new site. Their contract and fees stay theirs.",

  stripe: {
    growthDesk: "https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01",
    refreshDeposit: "https://buy.stripe.com/3cI8wQ4Wc0gH4fhgRU6Vq00",
    reimagineDeposit: "https://buy.stripe.com/28E5kEbkAd3t2796dg6Vq02"
  },

  choices: {
    clone: {
      label: "Clone",
      href: "wp-clone/index.html",
      ready: true,
      cta: "Preview Clone",
      price: "$750 / month",
      priceNote: "No redesign fee. Growth desk begins after cutover/acceptance unless otherwise agreed.",
      summary: "Same WordPress site, lower bill versus the current incumbent (Tiny Frog). Pure cost-savings.",
      security: "WP Engine, least-privilege access, managed updates, backups, uptime and security monitoring, and tested restore as part of care.",
      benefits: [
        "Keep the current WordPress site and public copy",
        "Lower monthly bill — cost-savings, not a redesign",
        "Secure-by-default care on WP Engine",
        "Monthly SEO pass as part of the desk",
        "We handle takeover, migration, and testing"
      ],
      buy: {
        href: "https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01",
        label: "Buy Clone — $750/mo desk"
      },
      editorNote: "After purchase, normal changes are supported updates we make with you.",
      canvas: {
        hero: "Who is in your corner?",
        deck: "The RED Team means action and results. Same site you already have — cared for, not rebuilt.",
        cta: "Contact Us"
      }
    },
    refresh: {
      label: "Refresh",
      href: "https://interimexecs-refresh.webflow.io",
      ready: true,
      cta: "Preview Refresh",
      price: "$4,000 once + $750 / month",
      priceNote: "$4,000 once. $750/month growth desk begins after cutover/acceptance unless otherwise agreed.",
      summary: "Webflow restyle. Modernized but familiar, and owner-editable.",
      security: "Managed Webflow hosting, SSL, CDN/DDoS protection, platform updates, and far fewer plugins to patch.",
      shellName: "",
      shellWarning: "",
      internalPreview: "webflow-refresh/index.html",
      benefits: [
        "Same familiar pages and copy, cleaner type and navigation",
        "Owner-editable in the Webflow Editor — no tech staff for normal changes",
        "Better look without a full rebrand",
        "Secure-by-default Webflow hosting",
        "We handle migration and testing before cutover"
      ],
      buy: {
        href: "https://buy.stripe.com/3cI8wQ4Wc0gH4fhgRU6Vq00",
        label: "Buy Refresh — $4,000 deposit"
      },
      talk: {
        href: "mailto:chris@gograybeard.com?subject=Second%20Shift%20Refresh%20%E2%80%94%20talk%20first",
        label: "Talk first"
      },
      desk: {
        href: "https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01",
        label: "$750/mo desk, ongoing after cutover"
      },
      editorNote: "After purchase, you edit in the Webflow Editor. This demo shows how that feels.",
      canvas: {
        hero: "Who is in your corner?",
        deck: "Familiar InterimExecs pages, easier to change, and a cleaner look.",
        cta: "See How it Works"
      }
    },
    reimagine: {
      label: "Reimagine",
      href: "https://interimexecs-reimagine.webflow.io",
      ready: true,
      cta: "Preview Reimagine",
      // Fresh cache-bust check: homepage byline is Interim Execs; /team-members/reta-torphy 404.
      price: "$6,000 once + $750 / month",
      priceNote: "$6,000 once. One tuning round means one consolidated feedback set. $750/month begins after cutover/acceptance unless otherwise agreed. Not a full rebrand (separate, $10,000+).",
      summary: "Premium modern redesign without a full rebrand. One collaborative tuning round.",
      security: "Managed Webflow hosting, SSL, CDN/DDoS protection, platform updates, and far fewer plugins to patch.",
      shellName: "",
      shellWarning: "",
      internalPreview: "webflow-demo/index.html",
      benefits: [
        "Modern navigation, imagery, scroll, forms, and conversion patterns",
        "One taste-tuning round — modern standard, not awards",
        "Owner-editable in the Webflow Editor after launch",
        "Secure-by-default Webflow hosting",
        "We handle migration and testing before cutover"
      ],
      buy: {
        href: "https://buy.stripe.com/28E5kEbkAd3t2796dg6Vq02",
        label: "Buy Reimagine — $6,000 deposit"
      },
      talk: {
        href: "mailto:chris@gograybeard.com?subject=Second%20Shift%20Reimagine%20%E2%80%94%20talk%20first",
        label: "Talk first"
      },
      desk: {
        href: "https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01",
        label: "$750/mo desk, ongoing after cutover"
      },
      editorNote: "After purchase, you edit in the Webflow Editor. This demo shows how that feels.",
      canvas: {
        hero: "Who is in your corner?",
        deck: "The RED Team means action and results. A modern standard, tuned to taste.",
        cta: "Engage an Executive"
      }
    }
  }
};
