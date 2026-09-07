(function () {
  var auth = window.EPDAuth;
  var data = window.EPD;
  if (!auth || !data) return;

  var user = auth.currentUser();

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function fill(sel, text) {
    var node = $(sel);
    if (node) node.textContent = text;
  }

  var who = $(".who");
  if (who) {
    who.textContent = user.via === "open-demo"
      ? "Open demo — no login required"
      : ("Demo session · " + user.name);
  }

  document.querySelectorAll("[data-sign-out]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      auth.signOut();
    });
  });

  var page = document.body.getAttribute("data-page");

  if (page === "dashboard") {
    fill("[data-shift-name]", data.shift.name);
    fill("[data-shift-window]", data.shift.window);
    fill("[data-shift-status]", data.shift.status);
    fill("[data-shift-supervisor]", data.shift.supervisor);
    fill("[data-shift-units]", data.shift.units);
    fill("[data-shift-notes]", data.shift.notes);

    var queue = $("[data-tips-queue]");
    if (queue) {
      data.tips.slice(0, 3).forEach(function (tip) {
        var row = el("article", "row");
        row.appendChild(el("p", "meta", tip.id + " · " + tip.status));
        row.appendChild(el("h3", "", tip.area));
        row.appendChild(el("p", "", tip.summary));
        queue.appendChild(row);
      });
    }

    var board = $("[data-bulletin]");
    if (board) {
      data.bulletin.forEach(function (item) {
        var card = el("article", "card");
        card.appendChild(el("p", "meta", item.tag));
        card.appendChild(el("h3", "", item.title));
        card.appendChild(el("p", "", item.body));
        if (item.href) {
          var row = el("p", "btn-row");
          var link = el("a", "cta ghost", item.linkLabel || "Open");
          link.href = item.href;
          row.appendChild(link);
          card.appendChild(row);
        }
        board.appendChild(card);
      });
    }
  }

  if (page === "tips") {
    var list = $("[data-tips-list]");
    if (list) {
      data.tips.forEach(function (tip) {
        var card = el("article", "card");
        card.appendChild(el("p", "meta", tip.id + " · " + tip.received + " · " + tip.status));
        card.appendChild(el("h2", "", tip.area));
        card.appendChild(el("p", "", tip.summary));
        list.appendChild(card);
      });
    }
  }

  if (page === "directory") {
    var dir = $("[data-directory]");
    if (dir) {
      data.directory.forEach(function (person) {
        var card = el("article", "card");
        card.appendChild(el("p", "meta", person.role));
        card.appendChild(el("h2", "", person.name));
        card.appendChild(el("p", "", person.note));
        dir.appendChild(card);
      });
    }
  }
})();
