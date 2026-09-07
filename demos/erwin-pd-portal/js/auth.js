/**
 * Optional demo session only. Portal pages stay open with no login.
 * Any username/password is accepted. Nothing is sent anywhere.
 */
(function (global) {
  var KEY = "epd-portal-session";

  function inPortal() {
    return /\/portal(\/|$)/.test(location.pathname);
  }

  function loginHref() {
    return inPortal() ? "../login.html" : "login.html";
  }

  function homeHref() {
    return inPortal() ? "../index.html" : "index.html";
  }

  function portalHref() {
    return inPortal() ? "index.html" : "portal/index.html";
  }

  function readSession() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) || "null");
    } catch (err) {
      return null;
    }
  }

  function currentUser() {
    return readSession() || { name: "Demo officer", via: "open-demo" };
  }

  function signIn(name, via) {
    var session = {
      name: String(name || "").trim() || "Demo officer",
      at: Date.now(),
      via: via || "demo"
    };
    sessionStorage.setItem(KEY, JSON.stringify(session));
    return session;
  }

  function signOut() {
    sessionStorage.removeItem(KEY);
    location.replace(homeHref());
  }

  global.EPDAuth = {
    loginHref: loginHref,
    homeHref: homeHref,
    portalHref: portalHref,
    currentUser: currentUser,
    signIn: signIn,
    signOut: signOut
  };
})(window);
