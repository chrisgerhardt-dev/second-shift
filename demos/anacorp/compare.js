/**
 * Current | Webflow Clone tabs (mobile). Desktop shows both panes.
 * If the Webflow stand-in returns 200, drop the "staging soon" copy.
 * Destinations stay in destinations.js.
 */
(function () {
  var root = document.querySelector("[data-compare]");
  if (!root) return;

  var tabs = root.querySelectorAll("[data-tab]");
  var panes = {
    current: root.querySelector('[data-pane="current"]'),
    webflow: root.querySelector('[data-pane="webflow"]')
  };

  function show(name) {
    Object.keys(panes).forEach(function (key) {
      if (panes[key]) panes[key].classList.toggle("is-active", key === name);
    });
    tabs.forEach(function (tab) {
      tab.setAttribute("aria-selected", tab.getAttribute("data-tab") === name ? "true" : "false");
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      show(tab.getAttribute("data-tab"));
    });
  });

  var cfg = window.SECOND_SHIFT_DESTINATIONS;
  var href = cfg && cfg.choices && cfg.choices.clone && cfg.choices.clone.webflowPreview
    ? cfg.choices.clone.webflowPreview.href
    : "https://anacorp-refresh.webflow.io/";
  var stage = root.querySelector("[data-webflow-stage]");
  if (!stage) return;

  fetch(href, { mode: "no-cors" }).catch(function () { /* placeholder stays */ });
})();
