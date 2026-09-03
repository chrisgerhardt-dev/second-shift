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

  const stripe = cfg.stripe || {};
  if (stripe.growthDesk !== "https://buy.stripe.com/fZu9AUgEU8Nd3bdatw6Vq01") {
    fail("growth desk Payment Link mismatch");
  }
  if (stripe.refreshDeposit !== "https://buy.stripe.com/3cI8wQ4Wc0gH4fhgRU6Vq00") {
    fail("Refresh $4k Payment Link mismatch");
  }
  if (stripe.reimagineDeposit !== "https://buy.stripe.com/28EbJ20FWd3taDFgRU6Vq03") {
    fail("Reimagine must use the $6k Payment Link …q03");
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
    if (clone.href !== "wp-clone/index.html") fail("clone.href must be the in-repo wp-clone page");
    else ok("clone points at in-repo wp-clone");
    if (/^https?:\/\//i.test(clone.href)) fail("clone must not be an external URL");
    if (!clone.benefits || clone.benefits.length < 4) fail("clone benefits missing");
    if (!clone.buy || clone.buy.href !== stripe.growthDesk) fail("clone buy must be the $750/mo desk");
  }

  const refresh = cfg.choices && cfg.choices.refresh;
  if (!refresh) fail("refresh choice missing");
  else {
    if (refresh.href !== "https://interimexecs-refresh.webflow.io") fail("refresh.href must be the live Webflow URL");
    else ok("refresh points at interimexecs-refresh.webflow.io");
    if (refresh.ready !== false) fail("refresh.ready must be false while Blurr is still live");
    else ok("refresh is flagged not IE-ready");
  }

  const reimagine = cfg.choices && cfg.choices.reimagine;
  if (!reimagine) fail("reimagine choice missing");
  else {
    if (reimagine.href !== "https://interimexecs-reimagine.webflow.io") fail("reimagine.href must be the live Webflow URL");
    else ok("reimagine points at interimexecs-reimagine.webflow.io");
    if (reimagine.ready !== false) fail("reimagine.ready must be false while Notable/NOICELAND is still live");
    else ok("reimagine is flagged not IE-ready");
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
  if (!hub.includes("js-buy") || !hub.includes("buy.stripe.com")) fail("hub missing buy CTAs");
  else ok("hub has Stripe buy CTAs");
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
  if (!hub.includes('href="wp-clone/index.html"')) fail("hub fallback Clone link missing");
  if (!hub.includes("https://interimexecs-refresh.webflow.io")) fail("hub fallback Refresh URL missing");
  if (!hub.includes("https://interimexecs-reimagine.webflow.io")) fail("hub fallback Reimagine URL missing");
  if (!hub.includes("https://buy.stripe.com/28EbJ20FWd3taDFgRU6Vq03")) fail("hub must use Reimagine Payment Link …q03");
  if (!hub.includes("data-demo-reset") || !/Reload does not add free turns/i.test(hub)) {
    fail("hub must persist demo turns and only reset when labeled");
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
  ["secondshift.care", "interimexecs-refresh.webflow.io", "interimexecs-reimagine.webflow.io", "Verify", "chris@gograybeard.com"].forEach((needle) => {
    if (!handoff.toLowerCase().includes(needle.toLowerCase())) fail("HANDOFF.md missing required note: " + needle);
  });
  ok("HANDOFF.md documents DNS, Webflow shells, verify-links, and mailbox");
}

const email = read("market-test/interimexecs-email.md");
if (email) {
  if (!/do not send/i.test(email)) fail("email draft must say do not send");
  if (!/Clone/.test(email) || !/Refresh/.test(email) || !/Reimagine/.test(email)) fail("email draft must name all three options");
  if (!/Tiny Frog/.test(email) || !/secondshift\.care\/ie/.test(email)) fail("email draft must mention Tiny Frog and the public /ie/ URL");
  [
    ["$750/month", email],
    ["$4,000 once", email],
    ["$6,000 once", email],
    ["cutover/acceptance", email],
    ["standard security baseline", email],
    ["consolidated feedback set", email],
    ["not a live or unlimited AI agent", email]
  ].forEach(function (pair) {
    if (pair[1].indexOf(pair[0]) === -1) fail("email draft missing required copy: " + pair[0]);
  });
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
  ok("prospect email draft present and marked do-not-send");
}

["index.html", "care.html", "work.html", "contact.html", "styles.css"].forEach((f) => {
  if (!fs.existsSync(path.join(root, f))) fail("missing Second Shift lander file " + f);
});
ok("Second Shift lander files preserved");

if (fs.existsSync(path.join(root, "CNAME"))) fail("CNAME present — do not point a parked domain from the repo");

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
