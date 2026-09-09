/**
 * Current | Webflow Clone tabs (mobile). Desktop shows both panes.
 * Never fetch the Webflow host. Never iframe webflow.io — CSP
 * frame-ancestors only allows webflow.com / webflow.io. Ready
 * means outbound still + new-tab CTA, not Staging soon.
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
  var live = cfg.liveOrigin || "https://interimexecs.com";
  var stageHref = wf.href || "https://interimexecs-refresh-4d5162.webflow.io/";
  var ready = !!wf.ready;

  var currentCta = root.querySelector('[data-pane="current"] .js-dest');
  if (currentCta) {
    currentCta.setAttribute("href", "https://www.interimexecs.com/");
    currentCta.setAttribute("target", "_blank");
    currentCta.setAttribute("rel", "noopener noreferrer");
  }

  function wireOutbound(el) {
    if (!el) return;
    el.setAttribute("href", stageHref);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  }

  var wfCta = root.querySelector('[data-pane="webflow"] .js-webflow');
  wireOutbound(wfCta);
  if (wfCta && wf.cta) wfCta.textContent = wf.cta;
  wireOutbound(root.querySelector('[data-pane="webflow"] .js-webflow-still'));

  var stage = root.querySelector("[data-webflow-stage]");
  if (!stage) return;
  stage.hidden = false;
  stage.classList.toggle("is-pending", !ready);
  var note = stage.querySelector(".frame-fallback");
  var still = stage.querySelector(".still-card");
  if (!ready) {
    if (still) still.hidden = true;
    if (note) {
      note.hidden = false;
      note.innerHTML = "<strong>Staging soon.</strong> Webflow Clone is wired but not READY yet. The Current pane still opens " + live.replace(/^https:\/\//, "") + ".";
    }
  } else {
    if (still) still.hidden = false;
    if (note) {
      note.hidden = false;
      note.textContent = "Webflow Clone staging is live (DEMO). This hub does not embed it — open the Clone in a new tab.";
    }
  }
})();
