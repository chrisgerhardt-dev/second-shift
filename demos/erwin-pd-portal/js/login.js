(function () {
  var auth = window.EPDAuth;
  if (!auth) return;

  if (auth.isAuthed()) {
    location.replace(auth.portalHref());
    return;
  }

  var form = document.querySelector("[data-login]");
  var emailStep = document.querySelector("[data-step=email]");
  var codeStep = document.querySelector("[data-step=code]");
  var emailInput = document.querySelector("#email");
  var codeInput = document.querySelector("#code");
  var sentTo = document.querySelector("[data-sent-to]");
  var error = document.querySelector("[data-error]");
  var pendingEmail = "";

  function showError(msg) {
    if (!error) return;
    error.hidden = !msg;
    error.textContent = msg || "";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showError("");

    if (!emailStep.hidden) {
      pendingEmail = (emailInput.value || "").trim();
      if (!pendingEmail || pendingEmail.indexOf("@") === -1) {
        showError("Enter a work email to continue. Nothing is sent in this demo.");
        return;
      }
      if (auth.hasCloudflareAccess()) {
        auth.signIn(pendingEmail, "cloudflare-access");
        location.replace(auth.portalHref());
        return;
      }
      emailStep.hidden = true;
      codeStep.hidden = false;
      if (sentTo) sentTo.textContent = pendingEmail;
      codeInput.focus();
      return;
    }

    if (!auth.checkCode(codeInput.value)) {
      showError("That code is not valid. This demo accepts 000000 only.");
      return;
    }
    auth.signIn(pendingEmail, "demo-code");
    location.replace(auth.portalHref());
  });

  document.querySelector("[data-back-email]").addEventListener("click", function () {
    showError("");
    codeStep.hidden = true;
    emailStep.hidden = false;
    emailInput.focus();
  });
})();
