const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dir = path.join(root, "demos/erwin-pd-portal");
let failed = 0;

function fail(msg) {
  failed += 1;
  console.error("FAIL:", msg);
}

function read(rel) {
  const full = path.join(dir, rel);
  if (!fs.existsSync(full)) {
    fail("missing " + rel);
    return "";
  }
  return fs.readFileSync(full, "utf8");
}

[
  "index.html",
  "login.html",
  "portal/index.html",
  "portal/tips.html",
  "portal/directory.html",
  "css/site.css",
  "js/data.js",
  "js/auth.js",
  "js/login.js",
  "js/portal.js",
  "README.md",
  "_headers",
  "_redirects"
].forEach(read);

const home = read("index.html");
const login = read("login.html");
const readme = read("README.md");
const data = read("js/data.js");
const auth = read("js/auth.js");

if (!home.includes("423-743-1870")) fail("homepage must show non-emergency number");
if (!home.includes("911")) fail("homepage must show 911");
if (!home.includes("211 N Main")) fail("homepage must show address");
if (!home.includes("Tony Buchanan")) fail("homepage must name Chief Buchanan");
if (!home.includes("Officer portal")) fail("homepage must link Officer portal");
if (!home.includes("login.html")) fail("homepage Officer portal must go to login.html");
if (!home.includes("DEMO")) fail("homepage must show DEMO");
if (!home.includes("not affiliated") && !home.includes("Not affiliated")) {
  fail("homepage must disclaim affiliation");
}

if (!login.includes("Send login code")) fail("login must use Access-style send-code CTA");
if (!login.includes("000000")) fail("login must document demo code 000000");
if (!auth.includes("CF_Authorization")) fail("auth must recognize Cloudflare Access cookie");
if (!auth.includes("000000")) fail("auth demo code must be 000000");

if (!data.includes("Tony Buchanan")) fail("seed data must name Chief Buchanan");
["Regan Tilson", "Patrick Bennett", "Joey Ennis"].forEach((name) => {
  if (data.includes(name)) fail("do not name " + name + " in seed data");
});

if (!readme.includes("erwin-pd-portal.pages.dev")) fail("README must explain CF hostname");
if (!readme.includes("demos/erwin-pd-portal")) fail("README must set CF root directory");
if (!readme.includes("TAS Portal Demo")) fail("README must mention renaming TAS Access title");

const lander = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (lander.includes("erwin-pd-portal")) {
  fail("do not put the portal on the marketing lander");
}

if (failed) {
  console.error(failed + " check(s) failed");
  process.exit(1);
}
console.log("erwin-pd-portal checks passed");
