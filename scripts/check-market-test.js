#!/usr/bin/env node
/**
 * Static checks for the Interim Execs market-test path.
 * Hub follows the ANA Current | Webflow Clone play (locked 2026-09-09).
 * No npm install. No Pages build step. Run: node scripts/check-market-test.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const failures = [];
const notes = [];

function fail(msg) {
  failures.push(msg);
}
function ok(msg) {
  notes.push("ok  " + msg);
}
function read(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    fail("missing file: " + rel);
    return null;
  }
  return fs.readFileSync(abs, "utf8");
}
function sameHref(a, b) {
  return String(a || "").replace(/\/+$/, "") === String(b || "").replace(/\/+$/, "");
}

function loadDestinations() {
  const src = read("demos/interimexecs/destinations.js");
  if (!src) return null;
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  return sandbox.window.SECOND_SHIFT_DESTINATIONS || sandbox.window.SECOND_SHIFT_IE_DESTINATIONS || null;
}

const destSrc = read("demos/interimexecs/destinations.js") || "";
const cfg = loadDestinations();
if (!cfg) {
  fail("destinations.js did not set window.SECOND_SHIFT_DESTINATIONS");
} else {
  ok("loaded destinations.js");
  if (cfg.slug !== "interimexecs") fail("destinations.slug must be interimexecs");
  if (cfg.liveOrigin !== "https://interimexecs.com") fail("liveOrigin must be https://interimexecs.com");
  if (cfg.contactEmail !== "hello@secondshift.care") {
    fail("contact email must be hello@secondshift.care (no personal mailbox on this hub)");
  } else {
    ok("Talk first routes to hello@secondshift.care");
  }
  if (cfg.formSubmitProven !== false) {
    fail("formSubmitProven must stay false — this hub does not send outreach");
  } else {
    ok("formSubmitProven is false (no outreach send)");
  }
  if (/gograybeard|christopher/i.test(destSrc)) {
    fail("destinations must not include Christopher name or gograybeard emails");
  }
  if (/buy\.stripe\.com/.test(destSrc)) fail("destinations must not add Stripe links");
  else ok("destinations have no Stripe links");

  const promise = cfg.migrationPromise || "";
  if (/obvious improvements/i.test(promise)) {
    fail("destinations must not pitch obvious improvements in the migration");
  }
  if (!/no-code Webflow/i.test(promise) || !/bottleneck/i.test(promise) || !/platform swap/i.test(promise)) {
    fail("migrationPromise must lock the ANA why-migrate copy");
  } else {
    ok("migrationPromise locks WordPress → no-code Webflow");
  }

  const order = ["clone", "refresh", "reimagine"];
  const keys = cfg.choices ? Object.keys(cfg.choices) : [];
  if (keys.length !== 3 || order.some((k) => !cfg.choices[k])) {
    fail("destinations.choices must be exactly clone, refresh, reimagine");
  } else {
    ok("exactly three choices: Clone, Refresh, Reimagine");
  }

  const clone = cfg.choices && cfg.choices.clone;
  if (!clone) fail("clone choice missing");
  else {
    if (clone.ready !== true) fail("clone.ready should be true");
    if (clone.href !== "https://interimexecs.com") fail("clone.href must be the live InterimExecs site");
    else ok("clone points at https://interimexecs.com");
    if (clone.internalPreview !== "wp-clone/index.html") fail("clone.internalPreview must be the local asset mirror");
    if (clone.assetMirror !== "wp-clone/index.html") fail("clone.assetMirror must be the local asset mirror");
    else ok("clone assetMirror / internalPreview point at wp-clone/");
    const wf = clone.webflowPreview || {};
    if (!sameHref(wf.href, "https://interimexecs-refresh.webflow.io/")) {
      fail("clone.webflowPreview must use interimexecs-refresh.webflow.io as close-Clone stand-in");
    } else {
      ok("Webflow Clone staging stand-in is wired");
    }
    if (wf.ready !== false) {
      fail("webflowPreview.ready must be false until the host serves Interim Execs content");
    } else {
      ok("webflowPreview.ready is false (Staging soon)");
    }
    if (/obvious improvements/i.test(clone.summary || "")) {
      fail("clone summary must not pitch obvious improvements in the migration");
    }
  }

  const refresh = cfg.choices && cfg.choices.refresh;
  if (!refresh) fail("refresh choice missing");
  else {
    if (!sameHref(refresh.href, "https://interimexecs-refresh.webflow.io/")) {
      fail("refresh.href must be the live Webflow URL");
    } else {
      ok("refresh points at interimexecs-refresh.webflow.io");
    }
    if (refresh.ready !== false) fail("refresh.ready must stay false (muted step-up)");
    else ok("refresh is flagged not ready (muted redesign rung)");
    if (!refresh.shellWarning || !/not READY yet/i.test(refresh.shellWarning)) {
      fail("refresh shellWarning must say the host is not READY yet");
    }
    if (/blurr|noiceland|notable/i.test(refresh.shellWarning || "")) {
      fail("refresh shellWarning must not mention Blurr / Notable / NOICELAND leftovers");
    }
    if (!refresh.talk || !/mailto:hello@secondshift\.care/.test(refresh.talk.href || "")) {
      fail("refresh must have a Talk first mailto to hello@secondshift.care");
    }
  }

  const reimagine = cfg.choices && cfg.choices.reimagine;
  if (!reimagine) fail("reimagine choice missing");
  else {
    if (!sameHref(reimagine.href, "https://interimexecs-reimagine.webflow.io/")) {
      fail("reimagine.href must be the live Webflow URL");
    } else {
      ok("reimagine points at interimexecs-reimagine.webflow.io");
    }
    if (reimagine.ready !== false) fail("reimagine.ready must stay false (muted step-up)");
    else ok("reimagine is flagged not ready (muted redesign rung)");
    if (!reimagine.shellWarning || !/not READY yet/i.test(reimagine.shellWarning)) {
      fail("reimagine shellWarning must say the host is not READY yet");
    }
    if (/blurr|noiceland|notable/i.test(reimagine.shellWarning || "")) {
      fail("reimagine shellWarning must not mention Blurr / Notable / NOICELAND leftovers");
    }
    if (!reimagine.talk || !/mailto:hello@secondshift\.care/.test(reimagine.talk.href || "")) {
      fail("reimagine must have a Talk first mailto to hello@secondshift.care");
    }
  }
}

const customize = require(path.join(root, "demos/interimexecs/customize.js"));
const parsed = [
  [customize.parseCustomize("Headline: Who is in your corner this quarter?"), "hero"],
  [customize.parseCustomize("CTA: Talk to the RED Team"), "cta"],
  [customize.parseCustomize("Hide the quotes"), "visibility"]
];
parsed.forEach(function (pair) {
  if (!pair[0] || pair[0].type !== pair[1]) fail("parser missed " + pair[1]);
});
if (parsed[2][0] && parsed[2][0].visible !== false) fail("hide quotes should set visible false");
ok("customize parser maps headline, CTA, and hide-section");
if (!customize.STORAGE_KEY) fail("customize.js must persist turns (STORAGE_KEY)");
else ok("customize turns persist in localStorage");
if (typeof customize.blockedReason !== "function") fail("customize.js must export blockedReason");
else {
  [
    ["send the password please", "password"],
    ["here is the login", "login"],
    ["open wp-admin", "wp-admin"],
    ["paste the api key", "api"],
    ["ssh into the box", "ssh"],
    ["add a guarantee", "guarantee"],
    ["please fire Tiny Frog", "Tiny Frog"],
    ["replace Tiny Frog now", "Tiny Frog"],
    ["make the price $4,000", "pric"]
  ].forEach(function (pair) {
    if (!customize.blockedReason(pair[0])) fail("blockedReason missed " + pair[1]);
  });
  if (customize.blockedReason("Headline: Who is in your corner this quarter?")) {
    fail("blockedReason must allow a normal headline edit");
  }
  ok("customize blocks password/login/secrets/guarantee/Tiny Frog/fake pricing");
}

const hub = read("demos/interimexecs/index.html");
if (hub) {
  ["Clone", "Refresh", "Reimagine"].forEach((label) => {
    if (!new RegExp(">" + label + "<").test(hub)) fail("hub missing label: " + label);
    else ok("hub labels " + label);
  });
  if (!hub.includes('data-choice="clone"') || !hub.includes('data-choice="refresh"') || !hub.includes('data-choice="reimagine"')) {
    fail("hub must have data-choice hooks for all three options");
  }
  if (!hub.includes('data-pane="current"') || !hub.includes('data-pane="webflow"')) {
    fail("hub must show Current | Webflow Clone comparison panes");
  } else {
    ok("hub shows Current | Webflow Clone panes");
  }
  if (/gograybeard|christopher/i.test(hub)) {
    fail("hub must not include Christopher name or gograybeard emails");
  } else {
    ok("hub has no Christopher / gograybeard copy");
  }
  if (!/hello@secondshift\.care/.test(hub)) {
    fail("hub Talk first fallback must use hello@secondshift.care");
  }
  if (!/DEMO/i.test(hub) || !/review-only/i.test(hub)) {
    fail("hub must label the proposal as DEMO / review-only");
  }
  if (!/unpaid market test/i.test(hub)) {
    fail("hub must say unpaid market test");
  }
  if (!/proposal review/i.test(hub) || !/not affiliated/i.test(hub)) {
    fail("hub must say proposal review and not affiliated as official Interim Execs production");
  }
  if (!/Do not email/i.test(hub) || !/does not send outreach/i.test(hub)) {
    fail("hub send-gate must say do not email and this page does not send outreach");
  } else {
    ok("hub send-gate is review-only (no outreach implied)");
  }
  if (/Send-gate open/i.test(hub) || /email sent/i.test(hub) || /we emailed/i.test(hub)) {
    fail("hub must not imply outreach was sent");
  }
  if (!/Webflow (Clone|migration)/i.test(hub)) {
    fail("hub must lead with Webflow migration/Clone");
  }
  if (/obvious improvements/i.test(hub)) {
    fail("hub must not pitch obvious improvements in the migration");
  }
  if (!/WordPress/i.test(hub) || !/same (site|look|website)/i.test(hub) || !/no-code/i.test(hub)) {
    fail("hub must lock lead copy to same-site WordPress → no-code Webflow");
  }
  if (!/bottleneck/i.test(hub) || !/platform swap/i.test(hub) || !/owner-editable/i.test(hub)) {
    fail("hub must say why migrate: WP bottleneck, same look, owner-editable platform swap");
  }
  if (!/Webflow Editor/i.test(hub) || !/after cutover/i.test(hub) || !/client/i.test(hub)) {
    fail("hub must say later changes are the client's after cutover in the Webflow Editor");
  }
  if (!/\$750\/mo SEO desk/i.test(hub) || !/SEO/i.test(hub)) {
    fail("hub must lock the desk as $750/mo SEO desk");
  }
  if (!/not a (visual )?redesign/i.test(hub)) {
    fail("hub must say the migration is not a redesign");
  }
  if (!hub.includes("www.interimexecs.com") || !hub.includes("https://interimexecs.com")) {
    fail("hub must link the current live site");
  } else {
    ok("hub links the live Interim Execs site");
  }
  if (!hub.includes("interimexecs-refresh.webflow.io")) {
    fail("hub must wire the close-Clone Webflow staging URL");
  } else {
    ok("hub wires interimexecs-refresh.webflow.io");
  }
  if (/<iframe\b/i.test(hub) || /frame-embed/i.test(hub)) {
    fail("hub must not iframe webflow.io (CSP frame-ancestors would show a blank box)");
  } else {
    ok("hub does not iframe Webflow");
  }
  if (!hub.includes("Open Webflow Clone") || !/new tab/i.test(hub)) {
    fail("hub must open the Webflow Clone in a new tab");
  }
  if (!hub.includes("does not embed")) {
    fail("hub must say it does not embed Webflow staging");
  }
  if (!hub.includes("current-still.webp")) {
    fail("hub must use a still card for Current");
  } else {
    ok("hub uses a Current still card");
  }
  const stillPath = path.join(root, "demos/interimexecs/assets/brand/current-still.webp");
  if (!fs.existsSync(stillPath)) fail("brand pack missing current-still.webp");
  else ok("current-still.webp is present");
  if (!/Staging soon/i.test(hub)) {
    fail("hub must say Staging soon while webflowPreview.ready is false");
  } else {
    ok("hub shows Staging soon for the Webflow Clone");
  }
  const clonePane = (hub.match(/data-pane="webflow"[\s\S]*?<\/section>/) || [""])[0];
  if (/current-still\.webp/.test(clonePane)) {
    fail("Webflow Clone pane must not reuse the Current still while staging is pending");
  }
  if (!/still-card\[hidden\]/.test(read("demos/interimexecs/compare.css") || "")) {
    fail("compare.css must hide [hidden] still cards (display:block would otherwise leak the still)");
  } else {
    ok("pending Webflow still stays hidden");
  }
  if (!/legal pages/i.test(hub) || !/trademarks/i.test(hub) || !/accurate contact/i.test(hub)) {
    fail("hub must say the Webflow Clone preserves legal pages, trademarks, and accurate contact");
  }
  if (!/does not invent claims/i.test(hub)) {
    fail("hub must say the SEO desk does not invent claims");
  }
  if (!/Privacy Policy/i.test(hub) || !/not legal advice/i.test(hub)) {
    fail("hub must name published privacy pages and say the note is not legal advice");
  }
  if (hub.includes("buy.stripe.com")) fail("hub must not expose Stripe");
  else ok("hub has no Stripe");
  if (!hub.includes('src="destinations.js"')) fail("hub must load destinations.js");
  if (!hub.includes("../candidate-hub.js")) fail("hub must load shared candidate-hub.js");
  if (!hub.includes("compare.js")) fail("hub must load compare.js");
  if (!hub.includes('href="../../styles.css"') || !hub.includes("../candidate-hub.css") || !hub.includes("compare.css")) {
    fail("hub stylesheets must be relative for GitHub Pages project paths");
  } else {
    ok("hub uses relative stylesheets");
  }
  if (hub.includes('href="/') || hub.includes('src="/')) fail("hub has root-absolute href/src (breaks GitHub Pages project paths)");
  else ok("hub has no root-absolute asset paths");
  if (/parked/i.test(hub)) fail("hub still claims the domain is parked");
  if (/Three choices: Clone, Refresh, Reimagine/i.test(hub)) {
    fail("hub must not lead with the Refresh $4k / Reimagine $6k ladder");
  }
  if (hub.includes("Buy Refresh — $4,000 deposit") || hub.includes("Buy Reimagine — $6,000 deposit")) {
    fail("hub must not show live $4k/$6k deposit buy labels");
  }
  if (/<div class="trio">/.test(hub)) {
    fail("hub must mute the redesign trio as the lead (ANA comparison, not three-tier cards)");
  }

  const compareJs = read("demos/interimexecs/compare.js") || "";
  if (/fetch\s*\(/.test(compareJs)) {
    fail("compare.js must not fetch the Webflow host (404 must not break the hub)");
  } else {
    ok("compare.js does not probe Webflow");
  }
  if (/frame-embed|createElement\s*\(\s*['"]iframe|querySelector[^;]*iframe/i.test(compareJs)) {
    fail("compare.js must not set an iframe src for Webflow");
  } else {
    ok("compare.js does not iframe Webflow");
  }
  if (!/Staging soon/.test(compareJs)) {
    fail("compare.js must render Staging soon when webflowPreview.ready is false");
  }
}

const clonePages = [
  "index.html",
  "about.html",
  "services.html",
  "how-it-works.html",
  "case-studies.html",
  "blog.html",
  "contact.html",
  "apply.html"
];
clonePages.forEach((page) => {
  const rel = "demos/interimexecs/wp-clone/" + page;
  const html = read(rel);
  if (!html) return;
  if (!/InterimExecs|interim executive|RED Team/i.test(html)) fail(rel + " does not look like Interim Execs content");
  if (html.includes('href="/') || html.includes('src="/')) fail(rel + " has root-absolute href/src (breaks project Pages)");
  if (html.includes('href="../index.html"') || html.includes("/ie/") || /webflow\.io/.test(html)) {
    fail(rel + " must not link the three-tier hub, /ie/, or webflow.io");
  }
  const internals = html.match(/href="([^"]+\.html)"/g) || [];
  internals.forEach((raw) => {
    const href = raw.slice(6, -1);
    if (/^https?:/i.test(href) || href.startsWith("../")) return;
    const target = path.join(root, "demos/interimexecs/wp-clone", href);
    if (!fs.existsSync(target)) fail(rel + " broken link " + href);
  });
});
ok("clone pages exist and use relative links");

["css/style.css", "js/site.js", "assets/logo.svg"].forEach((asset) => {
  if (!fs.existsSync(path.join(root, "demos/interimexecs/wp-clone", asset))) {
    fail("clone missing asset " + asset);
  }
});

const cloneHome = read("demos/interimexecs/wp-clone/index.html");
if (cloneHome) {
  if (!cloneHome.includes("ie-logo.svg")) fail("clone homepage missing the live InterimExecs logo file");
  if (!/front-page-feature-image/i.test(cloneHome)) fail("clone homepage missing the live hero image");
  if (!/microsoft-logo|pepsi-logo|estee-lauder-logo/i.test(cloneHome)) {
    fail("clone homepage missing the live company-mark logo strip");
  }
  if (/class="demo-banner"/.test(cloneHome)) {
    fail("clone homepage must not use a full-width demo banner (corner badge only)");
  }
  if (!cloneHome.includes("ss-clone-badge")) fail("clone homepage missing the discrete SS staging badge");
  else ok("clone homepage is an asset mirror with live imagery and a corner badge");
}

const contactHtml = read("demos/interimexecs/wp-clone/contact.html");
if (contactHtml) {
  if (/id=['"]gform_wrapper_1['"][^>]*display\s*:\s*none/i.test(contactHtml)) {
    fail("contact Gravity Form wrapper must not stay display:none (dummy form should be visible)");
  }
  if (!/data-ss-dummy-form/.test(contactHtml)) fail("contact form must be marked dummy");
  else ok("contact form is a visible dummy (does not post to InterimExecs)");
}
const overlayJs = read("demos/interimexecs/wp-clone/js/site.js");
if (overlayJs && !/gform_wrapper/.test(overlayJs)) {
  fail("js/site.js must unhide Gravity Form wrappers after we strip GF JS");
}

const brandDir = path.join(root, "demos/interimexecs/assets/brand");
["ie-logo.svg", "ie-logo.png", "COLORS.md", "FONTS.md", "brand.json", "current-still.webp"].forEach((name) => {
  if (!fs.existsSync(path.join(brandDir, name))) fail("brand pack missing " + name);
});
if (!fs.existsSync(path.join(brandDir, "fonts/ie-fonts.css"))) {
  fail("brand pack missing fonts/ie-fonts.css (self-host or CDN fallback)");
}
const brandJson = read("demos/interimexecs/assets/brand/brand.json");
if (brandJson) {
  let parsedBrand = null;
  try { parsedBrand = JSON.parse(brandJson); } catch (err) { fail("brand.json is not valid JSON"); }
  if (parsedBrand) {
    const colors = parsedBrand.colors || {};
    if (!colors.gold && !colors.buttonFill) fail("brand.json must include scraped color tokens (gold / button fills)");
    if (!colors.navy || !colors.ink) fail("brand.json must include navy and ink/text tokens");
    if (!parsedBrand.logo) fail("brand.json must point at the live logo");
    const fonts = parsedBrand.fonts || {};
    const keep = (fonts.keep || []).map((f) => (f.family || "").toLowerCase());
    if (!keep.some((f) => f.includes("open sans")) || !keep.some((f) => f.includes("raleway"))) {
      fail("brand.json must list Open Sans and Raleway as keep fonts");
    }
    if (!fonts.cdn && !(fonts.files && fonts.files.length)) {
      fail("brand.json must give a Google Fonts CDN and/or self-hosted font files");
    }
    else ok("brand pack has logo + color tokens + fonts");
  }
}
const colorsMd = read("demos/interimexecs/assets/brand/COLORS.md");
if (colorsMd && !/ie-logo\.svg/i.test(colorsMd)) fail("COLORS.md must mention the logo file for Webflow reuse");
else if (colorsMd && !/Reimagine/i.test(colorsMd)) fail("COLORS.md must say Refresh and Reimagine reuse this pack");
else if (colorsMd) ok("COLORS.md documents logo reuse for Refresh and Reimagine");
const fontsMd = read("demos/interimexecs/assets/brand/FONTS.md");
if (fontsMd && (!/Open Sans/i.test(fontsMd) || !/Raleway/i.test(fontsMd))) {
  fail("FONTS.md must document the live Open Sans / Raleway families");
} else if (fontsMd) ok("FONTS.md documents live families and CDN / self-host files");

const alias = read("ie/index.html");
if (alias) {
  if (!alias.includes("../demos/interimexecs/index.html")) fail("ie/ alias must use a relative path to the hub");
  else ok("short /ie/ alias is relative");
}

if (!fs.existsSync(path.join(root, ".nojekyll"))) fail("missing .nojekyll (GitHub Pages should not run Jekyll)");
else ok(".nojekyll present");
const redirect = read("pages-redirect.js");
if (redirect && /secondshift\.care/.test(redirect) && /chrisgerhardt-dev\.github\.io/.test(redirect)) {
  ok("github.io traffic is sent to secondshift.care");
} else {
  fail("pages-redirect.js must send github.io to the apex");
}

const handoff = read("demos/interimexecs/HANDOFF.md");
if (handoff) {
  ["2026-09-09", "secondshift.care", "interimexecs-refresh.webflow.io", "Staging soon", "webflowPreview.ready", "DEMO / review-only", "Talk first", "does not send outreach"].forEach((needle) => {
    if (!handoff.toLowerCase().includes(needle.toLowerCase())) fail("HANDOFF.md missing required note: " + needle);
  });
  if (/still Blurr/i.test(handoff) || /still Notable/i.test(handoff) || /NOICELAND/i.test(handoff)) {
    fail("HANDOFF.md must not still claim Blurr / Notable / NOICELAND shells");
  }
  if (!/WordPress/i.test(handoff) || !/no-code/i.test(handoff) || !/\$750\/mo/i.test(handoff)) {
    fail("HANDOFF.md must document the locked WordPress → Webflow + $750/mo SEO desk play");
  }
  ok("HANDOFF.md documents the ANA-style migration hub and Staging soon");
}

const email = read("market-test/interimexecs-email.md");
if (email) {
  if (!/blocked/i.test(email) && !/confirm before send/i.test(email)) fail("authorized email must stay gated");
  if (!email.includes("https://secondshift.care/demos/interimexecs/wp-clone/")) {
    fail("authorized email must link only the public Clone URL");
  }
  if (/secondshift\.care\/ie\//.test(email)) fail("authorized email must not link /ie/");
  if (/https?:\/\/\S*webflow\.io/i.test(email)) fail("authorized email must not link webflow.io");
  if (/secondshift\.care\/demos\/interimexecs\/(?!wp-clone\/)/.test(email)) {
    fail("authorized email must not link the comparison hub");
  }
  if (!/Tiny Frog/.test(email) || !/\$750\/month/.test(email)) fail("authorized email must mention Clone pricing and Tiny Frog");
  if (/\$4,000/.test(email) || /\$6,000/.test(email)) fail("authorized Clone-only email must not pitch Refresh/Reimagine prices");
  ok("authorized email is Clone-only and avoids hub /ie/ webflow.io links");
}

const blockedEmail = read("market-test/interimexecs-email-three-tier-blocked.md");
if (blockedEmail) {
  if (!/BLOCKED/i.test(blockedEmail) || !/do not send/i.test(blockedEmail)) {
    fail("three-tier email file must stay marked blocked");
  } else {
    ok("three-tier email draft is buried and blocked");
  }
} else {
  fail("missing buried three-tier email file");
}

const thanks = read("demos/interimexecs/customize-thanks.html");
if (thanks) {
  if (/Received by Second Shift/i.test(thanks)) fail("thanks page must not claim a proven receipt");
  if (/gograybeard|christopher/i.test(thanks)) {
    fail("thanks page must not include Christopher name or gograybeard emails");
  }
  if (!/form submission request/i.test(thanks) || !/one business day/i.test(thanks) || !/hello@secondshift\.care/.test(thanks)) {
    fail("thanks page must soften to a form-submission request plus one-business-day mailto to hello@secondshift.care");
  } else {
    ok("thanks page does not claim an unproven receipt");
  }
}

const home = read("index.html");
if (home) {
  if (/demos\/interimexecs\/index\.html/.test(home) || /Clone, Refresh, Reimagine/.test(home)) {
    fail("homepage must not advertise the unfinished three-tier comparison");
  } else {
    ok("homepage does not push the unfinished three-tier hub");
  }
}

["index.html", "care.html", "work.html", "contact.html", "styles.css"].forEach((f) => {
  if (!fs.existsSync(path.join(root, f))) fail("missing Second Shift lander file " + f);
});
ok("Second Shift lander files preserved");

const cname = read("CNAME");
if (!cname || cname.trim() !== "secondshift.care") fail("CNAME must be secondshift.care so github.io can 301 to apex");
else ok("CNAME is secondshift.care");

["demos/interimexecs/webflow-refresh/index.html", "demos/interimexecs/webflow-demo/index.html"].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) fail("missing preserved internal preview " + rel);
});
ok("internal Refresh/Reimagine drafts preserved");

console.log(notes.join("\n"));
if (failures.length) {
  console.error("\nFAILED");
  failures.forEach((f) => console.error("not ok  " + f));
  process.exit(1);
}
console.log("\n" + notes.length + " checks passed");
