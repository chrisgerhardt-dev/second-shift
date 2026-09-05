(function () {
  document.querySelectorAll(".gform_wrapper").forEach(function (el) {
    if (el.style && el.style.display === "none") el.style.display = "block";
    var st = el.getAttribute("style") || "";
    if (/display\\s*:\\s*none/i.test(st)) {
      el.setAttribute("style", st.replace(/display\\s*:\\s*none\\s*;?/gi, ""));
    }
  });
  document.querySelectorAll("[onclick*='gform']").forEach(function (el) {
    el.removeAttribute("onclick");
  });

  function showDummyNotice(form) {
    var note = form.getAttribute("data-ss-notice");
    if (note) return;
    var box = document.createElement("p");
    box.setAttribute("data-ss-notice", "1");
    box.setAttribute("role", "status");
    box.style.cssText = "margin:1rem 0 0;padding:0.75rem 1rem;background:#111;color:#fff;font:14px/1.4 Verdana,Arial,sans-serif;";
    box.textContent = "Staging clone only. This form does not email Beacon CPA or post to the live site.";
    form.appendChild(box);
    form.setAttribute("data-ss-notice", "1");
  }

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.tagName || form.tagName.toLowerCase() !== "form") return;
    event.preventDefault();
    event.stopPropagation();
    showDummyNotice(form);
    return false;
  }, true);

  document.addEventListener("click", function (event) {
    var el = event.target && event.target.closest && event.target.closest("button, input[type=submit], input[type=button]");
    if (!el) return;
    var form = el.form || (el.closest && el.closest("form"));
    if (!form) return;
    var type = (el.getAttribute("type") || el.type || "").toLowerCase();
    if (el.tagName.toLowerCase() === "button" && type && type !== "submit") return;
    if (type === "button" || type === "reset") return;
    if (form.getAttribute("data-ss-dummy-form") || form.querySelector("[name=gform_submit], .gform_button, .wpcf7-submit")) {
      event.preventDefault();
      event.stopPropagation();
      showDummyNotice(form);
    }
  }, true);

  document.querySelectorAll("img[data-lazy-src], img[data-src]").forEach(function (img) {
    var real = img.getAttribute("data-lazy-src") || img.getAttribute("data-src");
    if (real && (!img.getAttribute("src") || /^data:/.test(img.getAttribute("src") || ""))) {
      img.setAttribute("src", real);
    }
  });
})();
