#!/usr/bin/env node
/**
 * Static checks for Western Mechanical, Kaback, MCI, and Beacon CPA ladders.
 * Does not touch Interim Execs. Run: node scripts/check-candidates.js
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

const CANDIDATES = [
  {
    slug: "westernmech",
    name: "Western Mechanical",
    live: "https://www.westernmech.com",
    refresh: "https://westernmech-refresh.webflow.io/",
    reimagine: "https://westernmech-reimagine.webflow.io/",
    refreshReady: true,
    reimagineReady: true,
    clonePages: ["index.html", "contact.html"],
    needles: /Western Mechanical|Clinton Township/i
  },
  {
    slug: "kaback",
    name: "Kaback",
    live: "https://kaback.com",
    refresh: "https://kaback-refresh.webflow.io/",
    reimagine: "https://kaback-reimagine.webflow.io",
    refreshReady: true,
    reimagineReady: false,
    clonePages: ["index.html"],
    needles: /Kaback|HVAC/i
  },
  {
    slug: "mcihvac",
    name: "MCI",
    live: "https://www.mcihvac.com",
    refresh: "https://mcihvac-refresh.webflow.io",
    reimagine: "https://mcihvac-reimagine.webflow.io",
    refreshReady: false,
    reimagineReady: false,
    clonePages: ["index.html", "contact.html"],
    needles: /Mechanical Contractors|MCI/i
  },
  {
    slug: "beaconcpa",
    name: "Beacon CPA",
    live: "https://beaconcpa.com",
    refresh: "https://beaconcpa-refresh.webflow.io",
    reimagine: "https://beaconcpa-reimagine.webflow.io",
    refreshReady: false,
    reimagineReady: false,
    clonePages: ["index.html", "contact.html"],
    needles: /Beacon|CPA/i
  }
];

if (fs.existsSync(path.join(root, "demos/aceair")) ||
    fs.existsSync(path.join(root, "demos/abec")) ||
    fs.existsSync(path.join(root, "demos/blankenship"))) {
  fail("dropped Ace/ABEC/Blankenship folders must not ship");
} else {
  ok("no Ace/ABEC/Blankenship leftover folders");
}

CANDIDATES.forEach(function (c) {
  const destSrc = read("demos/" + c.slug + "/destinations.js");
  if (!destSrc) return;
  const sandbox = { window: {} };
  try {
    vm.runInNewContext(destSrc, sandbox);
  } catch (err) {
    fail(c.slug + " destinations.js failed to evaluate: " + err.message);
    return;
  }
  const cfg = sandbox.window.SECOND_SHIFT_DESTINATIONS;
  if (!cfg || !cfg.choices) {
    fail(c.slug + " destinations.js did not set window.SECOND_SHIFT_DESTINATIONS");
    return;
  }
  ok(c.slug + " loaded destinations.js");
  if (cfg.slug !== c.slug) fail(c.slug + " destinations.slug mismatch");
  if (cfg.liveOrigin !== c.live) fail(c.slug + " liveOrigin must be " + c.live);
  const clone = cfg.choices.clone;
  const refresh = cfg.choices.refresh;
  const reimagine = cfg.choices.reimagine;
  if (!clone || !refresh || !reimagine) {
    fail(c.slug + " must have clone, refresh, reimagine");
    return;
  }
  if (clone.ready !== true) fail(c.slug + " clone.ready must be true");
  else ok(c.slug + " clone.ready is true");
  if (clone.href !== c.live) fail(c.slug + " clone.href must be the live site");
  else ok(c.slug + " clone points at " + c.live);
  if (clone.internalPreview !== "wp-clone/index.html" || clone.assetMirror !== "wp-clone/index.html") {
    fail(c.slug + " clone assetMirror / internalPreview must be wp-clone/");
  }
  if (refresh.ready !== !!c.refreshReady) {
    fail(c.slug + " refresh.ready must be " + !!c.refreshReady);
  } else {
    ok(c.slug + " refresh.ready is " + !!c.refreshReady);
  }
  if (reimagine.ready !== !!c.reimagineReady) {
    fail(c.slug + " reimagine.ready must be " + !!c.reimagineReady);
  } else {
    ok(c.slug + " reimagine.ready is " + !!c.reimagineReady);
  }
  if (!sameHref(refresh.href, c.refresh)) fail(c.slug + " refresh.href mismatch");
  if (!sameHref(reimagine.href, c.reimagine)) fail(c.slug + " reimagine.href mismatch");
  if (/buy\.stripe\.com/.test(destSrc)) fail(c.slug + " destinations must not add Stripe links");

  const hub = read("demos/" + c.slug + "/index.html");
  if (!hub) return;
  ["Clone", "Refresh", "Reimagine"].forEach(function (label) {
    if (!new RegExp(">" + label + "<").test(hub)) fail(c.slug + " hub missing label " + label);
  });
  if (!hub.includes('data-choice="clone"') || !hub.includes('data-choice="refresh"') || !hub.includes('data-choice="reimagine"')) {
    fail(c.slug + " hub missing data-choice hooks");
  }
  if (hub.includes('href="/') || hub.includes('src="/')) fail(c.slug + " hub has root-absolute href/src");
  else ok(c.slug + " hub uses relative assets");
  if (!hub.includes(c.live)) fail(c.slug + " hub fallback Clone link must be the live site");
  if (hub.includes("buy.stripe.com")) fail(c.slug + " hub must not expose Stripe");
  if (!/Do not email/i.test(hub)) fail(c.slug + " hub must say do not email the prospect");
  if (!hub.includes('src="destinations.js"')) fail(c.slug + " hub must load destinations.js");
  if (!hub.includes("../candidate-hub.js")) fail(c.slug + " hub must load shared candidate-hub.js");
  if (/demos\/interimexecs/.test(hub) || /\/ie\//.test(hub)) fail(c.slug + " hub must not link the IE demo");

  c.clonePages.forEach(function (page) {
    const rel = "demos/" + c.slug + "/wp-clone/" + page;
    const html = read(rel);
    if (!html) return;
    if (!c.needles.test(html)) fail(rel + " does not look like " + c.name + " content");
    if (html.includes('href="/') || html.includes('src="/')) fail(rel + " has root-absolute href/src");
    if (html.includes("/ie/") || /interimexecs/i.test(html) && !/secondshift/i.test(html)) {
      fail(rel + " must not leak IE demo paths");
    }
    if (!html.includes("ss-clone-badge")) fail(rel + " missing discrete SS staging badge");
    if (/class="demo-banner"/.test(html)) fail(rel + " must not use a full-width demo banner");
    const internals = html.match(/href="([^"]+\.html)"/g) || [];
    internals.forEach(function (raw) {
      const href = raw.slice(6, -1);
      if (/^https?:/i.test(href) || href.startsWith("../")) return;
      const target = path.join(root, "demos/" + c.slug + "/wp-clone", href.split("#")[0]);
      if (!fs.existsSync(target)) fail(rel + " broken link " + href);
    });
  });
  ok(c.slug + " clone pages exist with relative links");

  ["css/style.css", "js/site.js"].forEach(function (asset) {
    if (!fs.existsSync(path.join(root, "demos/" + c.slug + "/wp-clone", asset))) {
      fail(c.slug + " clone missing " + asset);
    }
  });
  const assetsDir = path.join(root, "demos/" + c.slug + "/wp-clone/assets");
  if (!fs.existsSync(assetsDir) || !fs.readdirSync(assetsDir).some(function (n) { return n.indexOf("logo") === 0; })) {
    fail(c.slug + " clone missing assets/logo.*");
  }

  const brandDir = path.join(root, "demos/" + c.slug + "/assets/brand");
  ["COLORS.md", "FONTS.md", "brand.json"].forEach(function (name) {
    if (!fs.existsSync(path.join(brandDir, name))) fail(c.slug + " brand pack missing " + name);
  });
  const logos = fs.existsSync(brandDir)
    ? fs.readdirSync(brandDir).filter(function (n) { return /logo/i.test(n); })
    : [];
  if (!logos.length) fail(c.slug + " brand pack missing a logo file");
  else ok(c.slug + " brand pack has logo + docs");
  const brandJson = read("demos/" + c.slug + "/assets/brand/brand.json");
  if (brandJson) {
    let parsed = null;
    try { parsed = JSON.parse(brandJson); } catch (err) { fail(c.slug + " brand.json is not valid JSON"); }
    if (parsed) {
      if (!parsed.colors || !Object.keys(parsed.colors).length) fail(c.slug + " brand.json missing colors");
      if (!parsed.fonts) fail(c.slug + " brand.json missing fonts");
      if (!parsed.logo) fail(c.slug + " brand.json missing logo");
    }
  }

  const cloneIndex = read("demos/" + c.slug + "/wp-clone/index.html") || "";
  if (/<form\b/i.test(cloneIndex) && !/data-ss-dummy-form/.test(cloneIndex)) {
    fail(c.slug + " homepage forms must be marked dummy");
  }
});

if (!fs.existsSync(path.join(root, "demos/candidate-hub.css")) ||
    !fs.existsSync(path.join(root, "demos/candidate-hub.js"))) {
  fail("missing shared candidate hub css/js");
} else {
  ok("shared candidate hub assets present");
}

const ieHub = read("demos/interimexecs/destinations.js");
if (ieHub && /westernmech|kaback|mcihvac|beaconcpa/i.test(ieHub)) {
  fail("IE destinations.js must not be edited for these candidates");
} else {
  ok("IE destinations.js left alone");
}

console.log(notes.join("\n"));
if (failures.length) {
  console.error("\nFAILED");
  failures.forEach(function (f) { console.error("not ok  " + f); });
  process.exit(1);
}
console.log("\n" + notes.length + " checks passed");
