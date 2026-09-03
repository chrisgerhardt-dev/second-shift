(function () {
  var btn = document.querySelector(".menu-btn");
  var nav = document.querySelector("header nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var params = new URLSearchParams(window.location.search);
  var preset = params.get("need");
  var select = document.querySelector("select[name='need']");
  if (preset && select) {
    select.value = preset;
  }

  document.querySelectorAll("form.ie-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var trap = form.querySelector("[name='website']");
      if (trap && trap.value) return;
      var box = form.parentElement.querySelector(".ok");
      if (box) box.classList.add("show");
      form.reset();
    });
  });
})();
