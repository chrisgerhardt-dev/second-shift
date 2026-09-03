/**
 * Customize demo: real on-page mutations, then a human handoff.
 * Not a live agent. Caps at destinations.customizeTurns (2–3).
 */
(function (root) {
  var MAX_DEFAULT = 3;

  function extractQuoted(text) {
    var m = text.match(/[“"]([^”"]+)[”"]/) || text.match(/'([^']+)'/);
    return m ? m[1].trim() : "";
  }

  function afterCue(text, cues) {
    var lower = text.toLowerCase();
    for (var i = 0; i < cues.length; i++) {
      var idx = lower.indexOf(cues[i]);
      if (idx === -1) continue;
      var rest = text.slice(idx + cues[i].length).replace(/^[\s:–—-]+/, "").trim();
      if (rest) return rest;
    }
    return "";
  }

  function sectionFrom(text) {
    if (/quote|testimonial/.test(text)) return "quotes";
    if (/benefit|card|fit|right place/.test(text)) return "benefits";
    if (/approach|how it works/.test(text)) return "approach";
    return "";
  }

  function blockedReason(text) {
    var raw = String(text || "");
    var lower = raw.toLowerCase();
    if (/\bpassword\b/.test(lower)) return "Do not send passwords. This demo will not apply that.";
    if (/\blogin\b/.test(lower)) return "Login details are out of scope for this demo.";
    if (/\bwp-admin\b/.test(lower)) return "wp-admin access is out of scope for this demo.";
    if (/\bapi[\s-]?keys?\b/.test(lower) || /\bapikey\b/.test(lower)) return "API keys are out of scope for this demo.";
    if (/\bssh\b/.test(lower)) return "SSH access is out of scope for this demo.";
    if (/\bguarantee\b/.test(lower)) return "This demo will not add guarantees.";
    if (/\bfire\s+tiny\s+frog\b/.test(lower)) return "We do not tell you to fire Tiny Frog. Keep them until you accept the new site.";
    if (/\breplace\s+tiny\s+frog\b/.test(lower)) return "We do not tell you to replace Tiny Frog immediately. Keep them until you accept the new site.";
    if (/\$\s*\d/.test(raw) || /\b\d[\d,]*(?:\.\d+)?\s*(?:k|dollars?|usd)\b/i.test(raw)) {
      return "This demo will not invent or change prices. Talk to Second Shift for real pricing.";
    }
    return "";
  }

  function ensureWatermark(stage) {
    if (!stage) return;
    var mark = stage.querySelector("[data-demo-watermark]");
    if (mark) {
      mark.textContent = "DEMO EDIT";
      mark.hidden = false;
      return;
    }
    mark = document.createElement("p");
    mark.className = "demo-watermark";
    mark.setAttribute("data-demo-watermark", "");
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "DEMO EDIT";
    stage.insertBefore(mark, stage.firstChild);
  }

  function parseCustomize(text) {
    var raw = String(text || "").trim();
    if (!raw) return null;
    var lower = raw.toLowerCase();
    var quoted = extractQuoted(raw);

    if (/\b(hide|remove|drop)\b/.test(lower)) {
      var hideSec = sectionFrom(lower) || "quotes";
      return { type: "visibility", section: hideSec, visible: false };
    }
    if (/\b(show|restore|unhide)\b/.test(lower)) {
      var showSec = sectionFrom(lower) || "quotes";
      return { type: "visibility", section: showSec, visible: true };
    }
    if (/\b(move|swap|reorder|first|above|below)\b/.test(lower)) {
      var moveSec = sectionFrom(lower) || "benefits";
      var place = /\b(last|below|end)\b/.test(lower) ? "last" : "first";
      return { type: "reorder", section: moveSec, place: place };
    }
    if (/\b(cta|button|label)\b/.test(lower) || /call to action/.test(lower)) {
      return { type: "cta", value: quoted || afterCue(raw, ["cta", "button", "label", "call to action"]) || "Talk to the RED Team" };
    }
    if (/\b(hero|headline|title|h1)\b/.test(lower)) {
      return { type: "hero", value: quoted || afterCue(raw, ["headline", "hero", "title", "h1"]) || raw };
    }
    if (/\b(deck|subhead|copy|paragraph|intro)\b/.test(lower)) {
      return { type: "deck", value: quoted || afterCue(raw, ["deck", "subhead", "copy", "paragraph", "intro"]) || raw };
    }
    if (quoted) return { type: "hero", value: quoted };
    if (raw.length <= 72 && raw.indexOf("?") !== -1) return { type: "hero", value: raw };
    if (raw.length <= 48) return { type: "cta", value: raw };
    return { type: "deck", value: raw };
  }

  function describe(edit) {
    if (edit.type === "hero") return "Headline is now “" + edit.value + "”.";
    if (edit.type === "deck") return "Intro copy is now updated on the page.";
    if (edit.type === "cta") return "The button now reads “" + edit.value + "”.";
    if (edit.type === "visibility") {
      return (edit.visible ? "Showing" : "Hiding") + " the " + edit.section + " section.";
    }
    if (edit.type === "reorder") {
      return "Moved " + edit.section + " to the " + edit.place + " of the page.";
    }
    return "The page changed.";
  }

  function highlight(el) {
    if (!el) return;
    el.classList.remove("just-changed");
    void el.offsetWidth;
    el.classList.add("just-changed");
  }

  function applyEdit(edit, stage) {
    if (!edit || !stage) return null;
    if (edit.type === "hero") {
      var hero = stage.querySelector('[data-edit="hero"]');
      if (hero) { hero.textContent = edit.value; highlight(hero); }
      return hero;
    }
    if (edit.type === "deck") {
      var deck = stage.querySelector('[data-edit="deck"]');
      if (deck) { deck.textContent = edit.value; highlight(deck); }
      return deck;
    }
    if (edit.type === "cta") {
      var cta = stage.querySelector('[data-edit="cta"]');
      if (cta) { cta.textContent = edit.value; highlight(cta); }
      return cta;
    }
    if (edit.type === "visibility") {
      var band = stage.querySelector('[data-section="' + edit.section + '"]');
      if (band) {
        band.hidden = !edit.visible;
        highlight(band);
      }
      return band;
    }
    if (edit.type === "reorder") {
      var stack = stage.querySelector('[data-edit="sections"]');
      var item = stage.querySelector('[data-section="' + edit.section + '"]');
      if (stack && item) {
        item.hidden = false;
        if (edit.place === "last") stack.appendChild(item);
        else stack.insertBefore(item, stack.firstElementChild);
        highlight(item);
      }
      return item;
    }
    return null;
  }

  var STORAGE_KEY = "ss-ie-customize-state";

  function parseState(raw) {
    if (!raw) return null;
    try {
      var parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!parsed || typeof parsed.used !== "number") return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function loadState() {
    var fromStore = null;
    try { fromStore = parseState(localStorage.getItem(STORAGE_KEY)); } catch (err) { /* ignore */ }
    if (fromStore) return fromStore;
    try { fromStore = parseState(sessionStorage.getItem(STORAGE_KEY)); } catch (err) { /* ignore */ }
    if (fromStore) return fromStore;
    try {
      var cookie = document.cookie.split("; ").find(function (row) { return row.indexOf(STORAGE_KEY + "=") === 0; });
      if (cookie) fromStore = parseState(decodeURIComponent(cookie.slice(STORAGE_KEY.length + 1)));
    } catch (err) { /* ignore */ }
    if (fromStore) return fromStore;
    try {
      var usedParam = new URL(location.href).searchParams.get("demoUsed");
      if (usedParam) {
        var n = parseInt(usedParam, 10);
        if (n > 0) return { used: n, history: [], tier: "clone", fromQuery: true };
      }
    } catch (err) { /* ignore */ }
    return null;
  }

  function saveState(state) {
    var json = JSON.stringify(state);
    try { localStorage.setItem(STORAGE_KEY, json); } catch (err) { /* ignore */ }
    try { sessionStorage.setItem(STORAGE_KEY, json); } catch (err) { /* ignore */ }
    try {
      document.cookie = STORAGE_KEY + "=" + encodeURIComponent(json) + ";path=/;max-age=86400;SameSite=Lax";
    } catch (err) { /* ignore */ }
    try {
      var url = new URL(location.href);
      url.searchParams.set("demoUsed", String(state.used));
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (err) { /* ignore */ }
  }

  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
    try { document.cookie = STORAGE_KEY + "=;path=/;max-age=0"; } catch (err) { /* ignore */ }
    try {
      var url = new URL(location.href);
      url.searchParams.delete("demoUsed");
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (err) { /* ignore */ }
  }

  var api = {
    parseCustomize: parseCustomize,
    describe: describe,
    applyEdit: applyEdit,
    MAX_DEFAULT: MAX_DEFAULT,
    STORAGE_KEY: STORAGE_KEY,
    blockedReason: blockedReason,
    ensureWatermark: ensureWatermark
  };

  function $(sel, rootEl) {
    return (rootEl || document).querySelector(sel);
  }

  function addBubble(transcript, who, text) {
    var div = document.createElement("div");
    div.className = "bubble " + who;
    div.textContent = text;
    transcript.appendChild(div);
    transcript.scrollTop = transcript.scrollHeight;
  }

  function selectedTier(rootEl) {
    var pressed = rootEl.querySelector('.tier-switch button[aria-pressed="true"]');
    return (pressed && pressed.getAttribute("data-tier")) || "clone";
  }

  function setTier(rootEl, key) {
    var cfg = root.SECOND_SHIFT_IE_DESTINATIONS;
    var choice = cfg && cfg.choices && cfg.choices[key];
    rootEl.querySelectorAll(".tier-switch button").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-tier") === key ? "true" : "false");
    });
    var stage = $(".site-stage", rootEl);
    if (stage) stage.setAttribute("data-theme", key);
    var label = $("[data-tier-label]", rootEl);
    if (label) label.textContent = (choice && choice.label) || key;
    var note = $("[data-editor-note]", rootEl);
    if (note && choice) note.textContent = choice.editorNote || "";
    var tierField = document.querySelector('[name="tier"]');
    if (tierField) tierField.value = (choice && choice.label) || key;
  }

  function init() {
    var rootEl = document.querySelector("[data-customize]");
    if (!rootEl) return;
    var cfg = root.SECOND_SHIFT_IE_DESTINATIONS || {};
    var max = Number(cfg.customizeTurns) || MAX_DEFAULT;
    if (max < 2) max = 2;
    if (max > 3) max = 3;
    var used = 0;
    var history = [];
    var saved = loadState();
    var transcript = $(".transcript", rootEl);
    var chips = $(".chips", rootEl);
    var form = $("form", rootEl);
    var input = $("[data-chat-input]", rootEl);
    var send = $("[data-chat-send]", rootEl);
    var turns = $("[data-turns]", rootEl);
    var handoff = document.querySelector("[data-handoff]");
    var stage = $(".site-stage", rootEl);

    function remaining() {
      return Math.max(0, max - used);
    }

    function refreshTurns() {
      rootEl.setAttribute("data-used", String(used));
      if (!turns) return;
      if (used >= max) turns.textContent = "Demo edits used. A person takes it from here.";
      else turns.textContent = remaining() + " of " + max + " demo edits left.";
    }

    function lockChat() {
      if (input) input.disabled = true;
      if (send) send.disabled = true;
      rootEl.querySelectorAll(".chips button").forEach(function (b) { b.disabled = true; });
      if (handoff) {
        handoff.hidden = false;
        var req = handoff.querySelector('[name="request"]');
        if (req && !req.value) req.focus();
      }
    }

    function escalate(extra) {
      addBubble(transcript, "bot", extra || "That is the idea of owner edits. Refresh and Reimagine use the Webflow Editor; Clone is supported changes we make with you. This chat cannot do more free edits — a person at Second Shift finishes the rest.");
      lockChat();
      refreshTurns();
    }

    function run(text) {
      if (used >= max) {
        escalate();
        return;
      }
      var blocked = blockedReason(text);
      if (blocked) {
        addBubble(transcript, "user", text);
        addBubble(transcript, "bot", blocked + " Demo only — not a live person. Do not send passwords.");
        return;
      }
      var edit = parseCustomize(text);
      if (!edit) return;
      addBubble(transcript, "user", text);
      var changed = applyEdit(edit, stage);
      if (!changed) {
        addBubble(transcript, "bot", "I could not find that part of the page. Try the headline, the button, or hide a section.");
        return;
      }
      used += 1;
      history.push({ text: text, edit: edit });
      saveState({ used: used, history: history, tier: selectedTier(rootEl) });
      addBubble(transcript, "bot", describe(edit) + " Watch the site on the left. Demo only — not a live person.");
      refreshTurns();
      if (used >= max) escalate();
    }

    rootEl.querySelectorAll(".tier-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTier(rootEl, btn.getAttribute("data-tier"));
        if (used > 0) saveState({ used: used, history: history, tier: btn.getAttribute("data-tier") });
      });
    });

    if (chips) {
      chips.addEventListener("click", function (event) {
        var btn = event.target.closest("button[data-demo]");
        if (!btn || btn.disabled) return;
        run(btn.getAttribute("data-demo"));
      });
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (used >= max) return;
        var value = input && input.value.trim();
        if (!value) return;
        input.value = "";
        run(value);
      });
    }

    var handoffForm = document.querySelector("[data-handoff-form]");
    if (handoffForm) {
      if (cfg.formSubmit) handoffForm.setAttribute("action", cfg.formSubmit);
      var next = handoffForm.querySelector('[name="_next"]');
      if (next) {
        try {
          next.value = new URL("customize-thanks.html", window.location.href).href;
        } catch (err) {
          next.value = "customize-thanks.html";
        }
      }
      var mailto = document.querySelector("[data-mailto]");
      function syncMailto() {
        if (!mailto) return;
        var fd = new FormData(handoffForm);
        var body = [
          "Name: " + (fd.get("name") || ""),
          "Email: " + (fd.get("email") || ""),
          "Tier: " + (fd.get("tier") || selectedTier(rootEl)),
          "",
          fd.get("request") || ""
        ].join("\n");
        var email = cfg.contactEmail || "chris@gograybeard.com";
        mailto.setAttribute("href", "mailto:" + email + "?subject=" + encodeURIComponent("Second Shift IE customize request") + "&body=" + encodeURIComponent(body));
      }
      handoffForm.addEventListener("input", syncMailto);
      syncMailto();
    }

    var resetBtn = $("[data-demo-reset]", rootEl);
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        clearState();
        location.reload();
      });
    }

    var startTier = (saved && saved.tier) || "clone";
    setTier(rootEl, startTier);
    ensureWatermark(stage);
    if (saved && saved.used > 0) {
      if (Array.isArray(saved.history)) {
        saved.history.forEach(function (item) {
          if (!item || !item.edit) return;
          addBubble(transcript, "user", item.text || describe(item.edit));
          applyEdit(item.edit, stage);
          addBubble(transcript, "bot", describe(item.edit) + " Restored after reload. Demo only — not a live person.");
          used += 1;
          history.push(item);
        });
      }
      if (used < saved.used) used = saved.used;
      if (used > max) used = max;
      addBubble(transcript, "bot", used >= max
        ? "These demo edits were already used in this browser. Reload does not add free turns. Use “Reset demo edits” only if you want to practice again."
        : "Pick Clone, Refresh, or Reimagine. Remaining demo edits stay counted after reload.");
      if (used >= max) {
        lockChat();
        refreshTurns();
      } else {
        refreshTurns();
      }
    } else {
      refreshTurns();
      addBubble(transcript, "bot", "Pick Clone, Refresh, or Reimagine, then change the site. Two or three eligible edits. After that, a person takes the remaining request. Do not send passwords. This is not a live or unlimited AI agent.");
    }
  }

  api.init = init;
  root.SecondShiftCustomize = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})(typeof window !== "undefined" ? window : globalThis);
