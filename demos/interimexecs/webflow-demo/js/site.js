(function () {
  var btn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".primary-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var params = new URLSearchParams(window.location.search);
  var need = params.get("need");
  var role = params.get("role");
  var select = document.querySelector("select[name='need']");
  if (need && select) select.value = need;
  var roleField = document.querySelector("select[name='role']");
  if (role && roleField) roleField.value = role;

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
