/**
 * Soft demo gate that matches Cloudflare Access: email → send code → 6-digit PIN.
 * If a CF_Authorization cookie is present (Access already passed), skip the PIN.
 * Demo PIN is always 000000. Nothing is emailed.
 */
(function (global) {
  var KEY = "epd-portal-session";
  var DEMO_CODE = "000000";

  function inPortal() {
    return /\/portal(\/|$)/.test(location.pathname);
  }

  function loginHref() {
    return inPortal() ? "../login.html" : "login.html";
  }

  function portalHref() {
    return inPortal() ? "index.html" : "portal/index.html";
  }

  function hasCloudflareAccess() {
    return document.cookie.split(";").some(function (part) {
      return part.trim().indexOf("CF_Authorization=") === 0;
    });
  }

  function readSession() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) || "null");
    } catch (err) {
      return null;
    }
  }

  function currentUser() {
    if (hasCloudflareAccess()) {
      var existing = readSession();
      return existing || { email: "cloudflare-access", via: "cloudflare-access" };
    }
    return readSession();
  }

  function isAuthed() {
    return !!currentUser();
  }

  function signIn(email, via) {
    var session = {
      email: String(email || "").trim().toLowerCase(),
      at: Date.now(),
      via: via || "demo-code"
    };
    sessionStorage.setItem(KEY, JSON.stringify(session));
    return session;
  }

  function signOut() {
    sessionStorage.removeItem(KEY);
    location.replace(loginHref());
  }

  function requireAuth() {
    var user = currentUser();
    if (user) return user;
    location.replace(loginHref());
    return null;
  }

  function checkCode(code) {
    return String(code || "").replace(/\s+/g, "") === DEMO_CODE;
  }

  global.EPDAuth = {
    DEMO_CODE: DEMO_CODE,
    loginHref: loginHref,
    portalHref: portalHref,
    hasCloudflareAccess: hasCloudflareAccess,
    currentUser: currentUser,
    isAuthed: isAuthed,
    signIn: signIn,
    signOut: signOut,
    requireAuth: requireAuth,
    checkCode: checkCode
  };
})(window);
