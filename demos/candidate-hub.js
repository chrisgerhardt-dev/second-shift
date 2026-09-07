/**
 * Applies destinations.js on a candidate market-ladder hub.
 * Absolute preview hrefs open in a new tab. Relative asset-clone hrefs stay
 * relative so GitHub Pages project paths work.
 */
(function () {
  var cfg = window.SECOND_SHIFT_DESTINATIONS;
  if (!cfg || !cfg.choices) return;

  var order = ["clone", "refresh", "reimagine"];
  var promise = document.querySelector("[data-migration]");
  if (promise && cfg.migrationPromise) promise.textContent = cfg.migrationPromise;

  order.forEach(function (key) {
    var choice = cfg.choices[key];
    var card = document.querySelector('[data-choice="' + key + '"]');
    if (!choice || !card) return;

    card.classList.toggle("is-ready", !!choice.ready);
    card.classList.toggle("is-shell", !choice.ready);

    var dest = card.querySelector(".js-dest");
    if (dest && choice.href) {
      dest.setAttribute("href", choice.href);
      dest.textContent = choice.cta || dest.textContent;
      if (/^https?:\/\//i.test(choice.href)) {
        dest.setAttribute("target", "_blank");
        dest.setAttribute("rel", "noopener noreferrer");
      } else {
        dest.removeAttribute("target");
        dest.removeAttribute("rel");
      }
    }

    var buy = card.querySelector(".js-buy");
    if (buy) {
      var talkHref = (choice.talk && choice.talk.href) ||
        ("mailto:" + (cfg.contactEmail || "chris@gograybeard.com") +
          "?subject=" + encodeURIComponent("Second Shift " + (choice.label || key) + " — talk first"));
      buy.setAttribute("href", talkHref);
      buy.removeAttribute("target");
      buy.removeAttribute("rel");
      buy.classList.add("ghost");
      buy.textContent = (choice.talk && choice.talk.label) || cfg.talkFirstLabel || "Talk first";
    }

    var status = card.querySelector(".js-status");
    if (status) status.textContent = choice.ready ? "Ready to show" : "Not ready to show";

    var warn = card.querySelector(".js-shell-warn");
    if (warn) {
      if (choice.ready) warn.hidden = true;
      else {
        warn.hidden = false;
        if (choice.shellWarning) warn.textContent = choice.shellWarning;
      }
    }

    var internal = card.querySelector(".js-internal");
    if (internal) {
      if (choice.internalPreview) {
        internal.hidden = false;
        internal.setAttribute("href", choice.internalPreview);
      } else {
        internal.hidden = true;
      }
    }

    var webflow = card.querySelector(".js-webflow");
    if (webflow) {
      var wf = choice.webflowPreview;
      if (wf && wf.href) {
        webflow.hidden = false;
        webflow.setAttribute("href", wf.href);
        if (wf.cta) webflow.textContent = wf.cta;
        if (/^https?:\/\//i.test(wf.href)) {
          webflow.setAttribute("target", "_blank");
          webflow.setAttribute("rel", "noopener noreferrer");
        }
      } else {
        webflow.hidden = true;
      }
    }
  });
})();
