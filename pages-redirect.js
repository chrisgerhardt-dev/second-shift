/**
 * Send GitHub project Pages traffic to the apex host.
 * Localhost and secondshift.care are left alone.
 */
(function () {
  if (location.hostname !== "chrisgerhardt-dev.github.io") return;
  var path = location.pathname.replace(/^\/second-shift\/?/, "/");
  if (path.charAt(0) !== "/") path = "/" + path;
  location.replace("https://secondshift.care" + path + location.search + location.hash);
})();
