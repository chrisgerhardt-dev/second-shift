/**
 * Current | Webflow Clone tabs (mobile). Desktop shows both panes.
 * Never fetch the Webflow host — a 404 must not break this hub.
 * Staging-soon stays until destinations.js marks webflowPreview.ready.
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

  var cfg = window.SECOND_SHIFT_DESTINATIONS || {};
  var clone = (cfg.choices && cfg.choices.clone) || {};
  var wf = clone.webflowPreview || {};
  var live = cfg.liveOrigin || "https://anacorp.com";
  var stageHref = wf.href || "https://anacorp-refresh.webflow.io/";

  var currentCta = root.querySelector('[data-pane="current"] .js-dest');
  if (currentCta) {
    currentCta.setAttribute("href", "https://www.anacorp.com/");
    currentCta.setAttribute("target", "_blank");
    currentCta.setAttribute("rel", "noopener noreferrer");
  }

  var wfCta = root.querySelector('[data-pane="webflow"] .js-webflow');
  if (wfCta) {
    wfCta.setAttribute("href", stageHref);
    wfCta.setAttribute("target", "_blank");
    wfCta.setAttribute("rel", "noopener noreferrer");
    if (wf.cta) wfCta.textContent = wf.cta;
  }

  var stage = root.querySelector("[data-webflow-stage]");
  if (stage) {
    var ready = !!wf.ready;
    stage.classList.toggle("is-pending", !ready);
    stage.hidden = false;
    if (!ready) {
      var note = stage.querySelector(".frame-fallback");
      if (note && !/staging soon/i.test(note.textContent || "")) {
        note.innerHTML = "<strong>Staging soon.</strong> Webflow Clone is wired but not READY yet. The Current pane still opens " + live.replace(/^https:\/\//, "") + ".";
      }
    }
  }
})();
