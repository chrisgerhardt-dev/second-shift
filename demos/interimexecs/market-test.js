/**
 * Applies destinations.js to the public market-test hub.
 * Vanilla JS only. Relative Clone hrefs stay relative to this page so
 * GitHub Pages project paths (/second-shift/demos/interimexecs/) work.
 */
(function () {
  var cfg = window.SECOND_SHIFT_IE_DESTINATIONS;
  if (!cfg || !cfg.choices) return;

  var order = ["clone", "refresh", "reimagine"];
  var sendReady = !!cfg.customDomainReady;

  var promise = document.querySelector("[data-migration]");
  if (promise && cfg.migrationPromise) promise.textContent = cfg.migrationPromise;

  order.forEach(function (key) {
    var choice = cfg.choices[key];
    var card = document.querySelector('[data-choice="' + key + '"]');
    if (!choice) {
      sendReady = false;
      return;
    }
    if (!choice.ready) sendReady = false;
    if (!card) return;

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
    if (buy && choice.buy && choice.buy.href) {
      buy.setAttribute("href", choice.buy.href);
      buy.setAttribute("target", "_blank");
      buy.setAttribute("rel", "noopener noreferrer");
      if (choice.buy.label) buy.textContent = choice.buy.label;
    }

    var desk = card.querySelector(".js-desk");
    if (desk) {
      if (choice.desk && choice.desk.href) {
        desk.hidden = false;
        desk.setAttribute("href", choice.desk.href);
        desk.setAttribute("target", "_blank");
        desk.setAttribute("rel", "noopener noreferrer");
        if (choice.desk.label) desk.textContent = choice.desk.label;
      } else {
        desk.hidden = true;
      }
    }

    var status = card.querySelector(".js-status");
    if (status) status.textContent = choice.ready ? "Ready to show" : "Not IE-ready";

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
  });

  var gate = document.querySelector("[data-send-gate]");
  if (gate) gate.hidden = sendReady;
  var ok = document.querySelector("[data-send-ok]");
  if (ok) ok.hidden = !sendReady;
  document.documentElement.classList.toggle("market-test-send-ready", sendReady);
})();
