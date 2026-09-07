(function () {
  var auth = window.EPDAuth;
  if (!auth) return;

  var form = document.querySelector("[data-login]");
  var userInput = document.querySelector("#username");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    auth.signIn(userInput && userInput.value, "form");
    location.assign(auth.portalHref());
  });
})();
