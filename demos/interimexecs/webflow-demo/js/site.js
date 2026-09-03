(function () {
  var btn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".primary-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var bar = document.querySelector(".progress");
  if (bar) {
    window.addEventListener("scroll", function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    }, { passive: true });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("in");
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal-on").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal-on").forEach(function (el) { el.classList.add("in"); });
  }

  var params = new URLSearchParams(window.location.search);
  var need = params.get("need");
  var role = params.get("role");
  var select = document.querySelector("select[name='need']");
  if (need && select) select.value = need;
  var roleField = document.querySelector("select[name='role']");
  if (role && roleField) roleField.value = role;

  var wizard = document.querySelector("[data-wizard]");
  if (wizard) {
    var step = 0;
    var steps = wizard.querySelectorAll(".wiz-step");
    var pips = wizard.querySelectorAll(".wizard-bar span");
    function show(i) {
      step = i;
      steps.forEach(function (el, idx) { el.classList.toggle("on", idx === i); });
      pips.forEach(function (el, idx) { el.classList.toggle("on", idx <= i); });
    }
    wizard.querySelectorAll("[data-next]").forEach(function (el) {
      el.addEventListener("click", function () { if (step < steps.length - 1) show(step + 1); });
    });
    wizard.querySelectorAll("[data-back]").forEach(function (el) {
      el.addEventListener("click", function () { if (step > 0) show(step - 1); });
    });
    wizard.querySelectorAll("[data-set]").forEach(function (el) {
      el.addEventListener("click", function () {
        var field = el.getAttribute("data-set");
        var value = el.getAttribute("data-value");
        var input = wizard.querySelector("[name='" + field + "']");
        if (input) input.value = value;
        wizard.querySelectorAll("[data-set='" + field + "']").forEach(function (b) { b.classList.remove("picked"); });
        el.classList.add("picked");
      });
    });
    if (need) {
      var needBtn = wizard.querySelector("[data-set='need'][data-value='" + need + "']");
      if (needBtn) needBtn.classList.add("picked");
    }
    if (role) {
      var roleBtn = wizard.querySelector("[data-set='role'][data-value='" + role + "']");
      if (roleBtn) roleBtn.classList.add("picked");
    }
    show(need || role ? 1 : 0);
  }

  document.querySelectorAll("form.ie-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var trap = form.querySelector("[name='website']");
      if (trap && trap.value) return;
      var box = form.parentElement.querySelector(".ok");
      if (box) box.classList.add("show");
      form.reset();
      if (need && select) select.value = need;
      if (role && roleField) roleField.value = role;
    });
  });
})();
