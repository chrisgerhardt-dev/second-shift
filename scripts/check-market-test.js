#!/usr/bin/env node
/**
 * Static checks for the Interim Execs market-test path.
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

function loadDestinations() {
  const src = read("demos/interimexecs/destinations.js");
  if (!src) return null;
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  return sandbox.window.SECOND_SHIFT_IE_DESTINATIONS || null;
}

const cfg = loadDestinations();
if (!cfg) {
  fail("destinations.js did not set window.SECOND_SHIFT_IE_DESTINATIONS");
} else {
  ok("loaded destinations.js");
  if (cfg.customDomainReady !== true) {
    fail("customDomainReady should be true now that secondshift.care serves this repo");
  } else {
    ok("customDomainReady is true (secondshift.care HTTPS)");
  }
  if (cfg.customizeTurns < 2 || cfg.customizeTurns > 3) {
    fail("customizeTurns must be 2 or 3");
  } else {
    ok("customizeTurns capped at " + cfg.customizeTurns);
  }
  if (!/migration and testing/i.test(cfg.migrationPromise || "") || !/Tiny Frog/i.test(cfg.migrationPromise || "")) {
    fail("migration/testing promise must mention Tiny Frog staying active");
  } else {
    ok("migration/testing promise present");
  }
  if (cfg.contactEmail !== "chris@gograybeard.com") {
    fail("contact email must be chris@gograybeard.com until hello@ exists");
  }
  if (cfg.formSubmitProven !== false) {
    fail("formSubmitProven must stay false until mailbox delivery is proven");
  } else {
    ok("formSubmitProven is false (three-tier email still blocked)");
  }

  const stripe = cfg.stripe || {};
  if (stripe.growthDesk !== "https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01") {
    fail("growth desk Payment Link mismatch");
  }
  if (stripe.refreshDeposit !== "https://buy.stripe.com/3cI8wQ4Wc0gH4fhgRU6Vq00") {
    fail("Refresh $4k Payment Link mismatch");
  }
  if (stripe.reimagineDeposit !== "https://buy.stripe.com/28E5kEbkAd3t2796dg6Vq02") {
    fail("Reimagine must use the $6k Payment Link …q02");
  } else {
    ok("Stripe buy links: desk, $4k Refresh, $6k Reimagine");
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
    if (!/^https?:\/\//i.test(clone.href)) fail("clone preview must be an absolute live-site URL");
    if (!clone.benefits || clone.benefits.length < 4) fail("clone benefits missing");
    if (!clone.buy || clone.buy.href !== stripe.growthDesk) fail("clone buy must be the $750/mo desk");
    else ok("clone $750/mo desk buy may stay");
  }

  const refresh = cfg.choices && cfg.choices.refresh;
  if (!refresh) fail("refresh choice missing");
  else {
    if (refresh.href !== "https://interimexecs-refresh.webflow.io") fail("refresh.href must be the live Webflow URL");
    else ok("refresh points at interimexecs-refresh.webflow.io");
    if (refresh.ready !== true) fail("refresh.ready must be true after live IE verify");
    else ok("refresh is flagged IE-ready");
    if (refresh.cta !== "Preview Refresh") fail("refresh.cta must be Preview Refresh");
    if (refresh.shellWarning) fail("refresh shellWarning must be cleared");
    if (!refresh.buy || refresh.buy.href !== stripe.refreshDeposit) fail("refresh buy must be the $4k Payment Link");
    else ok("refresh buy is the $4k deposit");
    if (!refresh.desk || refresh.desk.href !== stripe.growthDesk) fail("refresh desk must be the $750/mo desk");
  }

  const reimagine = cfg.choices && cfg.choices.reimagine;
  if (!reimagine) fail("reimagine choice missing");
  else {
    if (reimagine.href !== "https://interimexecs-reimagine.webflow.io") fail("reimagine.href must be the live Webflow URL");
    else ok("reimagine points at interimexecs-reimagine.webflow.io");
    if (reimagine.ready !== true) fail("reimagine.ready must be true after live IE verify");
    else ok("reimagine is flagged IE-ready");
    if (reimagine.cta !== "Preview Reimagine") fail("reimagine.cta must be Preview Reimagine");
    if (reimagine.shellWarning) fail("reimagine shellWarning must be cleared");
    if (!reimagine.buy || reimagine.buy.href !== stripe.reimagineDeposit) fail("reimagine buy must be the $6k Payment Link");
    else ok("reimagine buy is the $6k deposit");
    if (!reimagine.desk || reimagine.desk.href !== stripe.growthDesk) fail("reimagine desk must be the $750/mo desk");
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
    if (!new RegExp(">" + label + "<").test(hub)) fail("hub missing visible label: " + label);
    else ok("hub labels " + label);
  });
  if (!hub.includes('data-choice="clone"') || !hub.includes('data-choice="refresh"') || !hub.includes('data-choice="reimagine"')) {
    fail("hub must have data-choice hooks for all three options");
  }
  if (!hub.includes("Do not email Interim Execs yet")) fail("hub must warn not to email yet");
  else ok("hub send-gate copy present");
  if (!/migration and testing/i.test(hub)) fail("hub missing migration/testing promise");
  else ok("hub states we handle migration and testing");
  function cardHtml(key) {
    const re = new RegExp('<article[^>]*data-choice="' + key + '"[\\s\\S]*?</article>');
    const match = hub.match(re);
    return match ? match[0] : "";
  }
  const cloneCard = cardHtml("clone");
  const refreshCard = cardHtml("refresh");
  const reimagineCard = cardHtml("reimagine");
  if (!cloneCard.includes("buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01")) fail("clone card may keep the $750/mo desk buy");
  else ok("clone card keeps $750/mo desk buy");
  if (!refreshCard.includes("buy.stripe.com/3cI8wQ4Wc0gH4fhgRU6Vq00") || !refreshCard.includes("Buy Refresh — $4,000 deposit")) {
    fail("refresh card must restore the $4k deposit buy CTA");
  }
  if (!reimagineCard.includes("buy.stripe.com/28E5kEbkAd3t2796dg6Vq02") || !reimagineCard.includes("Buy Reimagine — $6,000 deposit")) {
    fail("reimagine card must restore the $6k deposit buy CTA");
  }
  if (!refreshCard.includes("buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01") || !reimagineCard.includes("buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01")) {
    fail("ready Refresh/Reimagine cards must restore the $750/mo desk CTA");
  }
  if (/Talk first/.test(refreshCard) || /Talk first/.test(reimagineCard)) {
    fail("ready Refresh/Reimagine cards must not use Talk first");
  }
  ok("ready tiers restore $4k / $6k deposit buy buttons and $750 desk");
  if (!hub.includes("js-buy")) fail("hub missing buy/talk CTA hooks");
  if (!hub.includes("Buy Refresh — $4,000 deposit") || !hub.includes("Buy Reimagine — $6,000 deposit")) {
    fail("hub must show live $4k/$6k deposit buy labels now that shells are IE-ready");
  }
  if (!/FormSubmit/.test(hub) || !/still blocked/i.test(hub)) {
    fail("hub send-gate must keep three-tier email blocked until FormSubmit is proven");
  } else {
    ok("hub send-gate stays closed pending FormSubmit");
  }
  if (!hub.includes('data-tier="clone"') || !hub.includes('data-tier="refresh"') || !hub.includes('data-tier="reimagine"')) {
    fail("customize tier selector must include all three options");
  } else {
    ok("customize applies to Clone, Refresh, and Reimagine");
  }
  if (!hub.includes("data-edit=\"hero\"") || !hub.includes("data-chat-input") || !hub.includes("data-handoff")) {
    fail("customize demo / handoff markup missing");
  }
  ["name", "email", "tier", "request"].forEach((field) => {
    if (!hub.includes('name="' + field + '"')) fail("handoff form missing " + field);
  });
  ok("handoff form has name, email, tier, remaining request");
  if (!hub.includes("chris@gograybeard.com")) fail("handoff must route to chris@gograybeard.com");
  if (!hub.includes('src="destinations.js"') || !hub.includes('src="customize.js"')) {
    fail("hub must load destinations.js and customize.js");
  }
  if (!hub.includes('href="../../styles.css"') || !hub.includes('href="market-test.css"')) {
    fail("hub stylesheets must be relative for GitHub Pages project paths");
  } else {
    ok("hub uses relative stylesheets");
  }
  if (!hub.includes('href="https://interimexecs.com"')) fail("hub fallback Clone link must be the live InterimExecs site");
  if (hub.includes('href="wp-clone/index.html"')) fail("hub Preview Clone CTA must not use the local wp-clone snapshot");
  if (!/Clone preview is the live InterimExecs site/i.test(hub)) {
    fail("hub public destinations note must say Clone preview is the live InterimExecs site");
  } else {
    ok("hub destinations note: Clone preview is the live site");
  }
  if (!hub.includes("https://interimexecs-refresh.webflow.io")) fail("hub fallback Refresh URL missing");
  if (!hub.includes("https://interimexecs-reimagine.webflow.io")) fail("hub fallback Reimagine URL missing");
  if (!hub.includes("https://buy.stripe.com/28E5kEbkAd3t2796dg6Vq02")) {
    fail("hub HTML must expose the Reimagine $6k Payment Link now that it is IE-ready");
  }
  if (!hub.includes("data-demo-reset") || !/Reload does not add free turns/i.test(hub)) {
    fail("hub must persist demo turns and only reset when labeled");
  }
  if (!/DEMO EDIT/.test(hub) || !hub.includes("data-demo-watermark")) {
    fail("customize canvas must have a persistent DEMO EDIT watermark");
  } else {
    ok("customize canvas has DEMO EDIT watermark");
  }
  if (!/Not a live agent/i.test(hub) || !/Do not send passwords/i.test(hub)) {
    fail("hub must keep the not-a-live-agent / no-passwords banner");
  } else {
    ok("hub keeps not-a-live-agent / no-passwords banner");
  }
  if (/parked/i.test(hub)) fail("hub still claims the domain is parked");
  if (!/We do not claim unlimited support/i.test(hub)) {
    fail("hub should explicitly refuse unlimited-support / zero-downtime overclaims");
  }
  if (hub.includes('href="/') || hub.includes('src="/')) fail("hub has root-absolute href/src (breaks GitHub Pages project paths)");
  else ok("hub has no root-absolute asset paths");
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
  ["2026-09-03", "secondshift.care", "interimexecs-refresh.webflow.io", "interimexecs-reimagine.webflow.io", "Verify", "chris@gograybeard.com", "IE-ready", "FormSubmit", "Clone-only", "Talk first", "three-tier email is blocked"].forEach((needle) => {
    if (!handoff.toLowerCase().includes(needle.toLowerCase())) fail("HANDOFF.md missing required note: " + needle);
  });
  if (/still Blurr/i.test(handoff) || /still Notable/i.test(handoff)) {
    fail("HANDOFF.md must not still claim Blurr / Notable shells");
  }
  ok("HANDOFF.md documents IE-ready shells, FormSubmit blocker, and Clone-only email");
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
    fail("authorized email must not link the three-tier hub");
  }
  if (!/Tiny Frog/.test(email) || !/\$750\/month/.test(email)) fail("authorized email must mention Clone pricing and Tiny Frog");
  if (/\$4,000/.test(email) || /\$6,000/.test(email)) fail("authorized Clone-only email must not pitch Refresh/Reimagine prices");
  [
    "No redesign fee",
    "$4,000 once + $750 / month",
    "$6,000 once + $750 / month",
    "begins after cutover/acceptance",
    "standard security baseline",
    "Included scope is confirmed in writing",
    "one consolidated feedback set",
    "not a live or unlimited AI agent",
    "We do not claim unlimited support"
  ].forEach(function (needle) {
    if (hub && hub.indexOf(needle) === -1) fail("hub missing required conversion copy: " + needle);
  });
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
  if (!/form submission request/i.test(thanks) || !/one business day/i.test(thanks) || !/chris@gograybeard\.com/.test(thanks)) {
    fail("thanks page must soften to a form-submission request plus one-business-day mailto");
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
