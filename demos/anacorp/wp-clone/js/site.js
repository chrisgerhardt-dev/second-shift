(function () {
  function showDummyNotice(form) {
    if (form.getAttribute("data-ss-notice")) return;
    var box = document.createElement("p");
    box.setAttribute("data-ss-notice", "1");
    box.setAttribute("role", "status");
    box.style.cssText = "margin:1rem 0 0;padding:0.75rem 1rem;background:#111;color:#fff;font:14px/1.4 Verdana,Arial,sans-serif;";
    box.textContent = "Staging clone only. This form does not email Alliance North America or post to the live site.";
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
})();
