(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll("form.ie-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var trap = form.querySelector("[name='website']");
      if (trap && trap.value) return;
      var box = form.parentElement.querySelector(".form-success");
      if (box) box.classList.add("show");
      form.reset();
    });
  });
})();
