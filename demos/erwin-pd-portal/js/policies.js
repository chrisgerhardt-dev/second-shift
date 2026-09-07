(function () {
  var catalog = window.EPDPolicies;
  var auth = window.EPDAuth;
  if (!catalog) return;

  var ACK_KEY = "epd-demo-policy-acks";
  var DUE_KEY = "epd-demo-policy-due";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getAcks() {
    var acks = readJson(ACK_KEY, {});
    return acks && typeof acks === "object" ? acks : {};
  }

  function getDue() {
    if (!localStorage.getItem(DUE_KEY)) {
      writeJson(DUE_KEY, catalog.dueSeed.slice());
    }
    var due = readJson(DUE_KEY, catalog.dueSeed.slice());
    return Array.isArray(due) ? due : catalog.dueSeed.slice();
  }

  function isAcked(id) {
    return Boolean(getAcks()[id]);
  }

  function acknowledge(id) {
    var acks = getAcks();
    acks[id] = Date.now();
    writeJson(ACK_KEY, acks);
    writeJson(
      DUE_KEY,
      getDue().filter(function (itemId) {
        return itemId !== id;
      })
    );
  }

  function resetDemoAcks() {
    localStorage.removeItem(ACK_KEY);
    writeJson(DUE_KEY, catalog.dueSeed.slice());
  }

  function param(name) {
    try {
      return new URLSearchParams(location.search).get(name) || "";
    } catch (err) {
      return "";
    }
  }

  function displayTitle(item) {
    return item.number ? item.number + " " + item.title : item.title;
  }

  function canAcknowledge(item) {
    return item.section === "general-orders";
  }

  function statusClass(status) {
    if (status === "Current") return "status-pill";
    if (status === "Under review") return "status-pill review";
    if (status.indexOf("Form") === 0) return "status-pill form";
    return "status-pill town";
  }

  function fillWho() {
    if (!auth) return;
    var who = $("[data-who]");
    if (!who) return;
    var user = auth.currentUser();
    who.textContent =
      user.via === "open-demo"
        ? "Open demo — no login required"
        : "Demo session · " + user.name;
  }

  if (auth) {
    fillWho();
    document.querySelectorAll("[data-sign-out]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        auth.signOut();
      });
    });
  }

  function renderCounts() {
    document.querySelectorAll("[data-count]").forEach(function (node) {
      node.textContent = String(catalog.count(node.getAttribute("data-count")));
    });
  }

  function bindAckButton(button, item, onChange) {
    if (!button || !item || !canAcknowledge(item)) return;

    function paint() {
      var acked = isAcked(item.id);
      button.disabled = acked;
      button.textContent = acked ? "Acknowledged (demo)" : "Acknowledge (demo)";
      button.setAttribute("aria-pressed", acked ? "true" : "false");
    }

    paint();
    button.addEventListener("click", function () {
      if (isAcked(item.id)) return;
      acknowledge(item.id);
      paint();
      if (onChange) onChange();
    });
  }

  function policyRow(item, opts) {
    opts = opts || {};
    var row = el("article", "policy-row");
    var main = el("div", "policy-row-main");
    if (item.number) {
      main.appendChild(el("p", "meta", item.number));
    }
    var heading = document.createElement(opts.heading || "h3");
    heading.textContent = item.title;
    main.appendChild(heading);

    var facts = el("p", "policy-facts");
    var status = el("span", statusClass(item.status), item.status);
    facts.appendChild(status);
    facts.appendChild(document.createTextNode(" · Updated " + item.updated));
    if (isAcked(item.id) && canAcknowledge(item)) {
      facts.appendChild(document.createTextNode(" · Acknowledged (demo)"));
    }
    main.appendChild(facts);
    row.appendChild(main);

    var actions = el("div", "policy-row-actions");
    var open = el("a", "cta ghost", opts.openLabel || "Open stub");
    open.href = "item.html?id=" + encodeURIComponent(item.id);
    actions.appendChild(open);

    if (opts.ack && canAcknowledge(item)) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "cta";
      bindAckButton(button, item, opts.onAck);
      actions.appendChild(button);
    }

    row.appendChild(actions);
    return row;
  }

  function renderDueQueue(root) {
    if (!root) return;
    root.innerHTML = "";
    var due = getDue()
      .map(function (id) {
        return catalog.itemById(id);
      })
      .filter(Boolean);

    if (!due.length) {
      root.appendChild(
        el(
          "p",
          "empty-note",
          "No titles are due for acknowledgement in this browser. Reset the demo queue to seed the sample set again."
        )
      );
      return;
    }

    due.forEach(function (item) {
      root.appendChild(
        policyRow(item, {
          ack: true,
          onAck: function () {
            renderDueQueue(root);
          }
        })
      );
    });
  }

  function matchesQuery(item, query) {
    if (!query) return true;
    var hay = (item.number + " " + item.title + " " + item.status).toLowerCase();
    return hay.indexOf(query) !== -1;
  }

  var page = document.body.getAttribute("data-page");

  if (page === "policies-home") {
    renderCounts();
    renderDueQueue($("[data-due-queue]"));
    var reset = $("[data-reset-acks]");
    if (reset) {
      reset.addEventListener("click", function (event) {
        event.preventDefault();
        resetDemoAcks();
        renderDueQueue($("[data-due-queue]"));
      });
    }
  }

  if (page === "policies-list") {
    var section = catalog.sectionById(param("s"));
    var list = $("[data-policy-list]");
    var empty = $("[data-empty]");
    var search = $("[data-policy-search]");

    if (!section) {
      document.title = "Section not found — Erwin PD policies (demo)";
      var missing = $("[data-section-missing]");
      if (missing) missing.hidden = false;
      document.querySelectorAll("[data-section-found]").forEach(function (node) {
        node.hidden = true;
      });
      return;
    }

    document.title = section.title + " — Erwin PD policies (demo)";
    var titleNode = $("[data-section-title]");
    if (titleNode) titleNode.textContent = section.title;
    var countNode = $("[data-section-count]");
    if (countNode) countNode.textContent = String(catalog.count(section.id));
    var instruction = $("[data-section-instruction]");
    if (instruction) instruction.textContent = section.instruction;

    var rows = catalog.itemsIn(section.id);

    function paintList() {
      if (!list) return;
      list.innerHTML = "";
      var query = search ? String(search.value || "").trim().toLowerCase() : "";
      var shown = rows.filter(function (item) {
        return matchesQuery(item, query);
      });
      if (empty) {
        empty.hidden = shown.length > 0;
      }
      shown.forEach(function (item) {
        list.appendChild(
          policyRow(item, {
            heading: "h2",
            ack: item.section === "general-orders",
            onAck: paintList
          })
        );
      });
    }

    paintList();
    if (search) {
      search.addEventListener("input", paintList);
    }
  }

  if (page === "policies-detail") {
    var item = catalog.itemById(param("id"));
    var foundBlock = $("[data-item-found]");
    var missingBlock = $("[data-item-missing]");

    if (!item) {
      document.title = "Title not found — Erwin PD policies (demo)";
      if (foundBlock) foundBlock.hidden = true;
      if (missingBlock) missingBlock.hidden = false;
      return;
    }

    document.title = displayTitle(item) + " — Erwin PD policies (demo)";
    if (missingBlock) missingBlock.hidden = true;

    var number = $("[data-item-number]");
    if (number) {
      number.textContent = item.number || "Catalog title";
    }
    var heading = $("[data-item-title]");
    if (heading) heading.textContent = item.title;
    var status = $("[data-item-status]");
    if (status) {
      status.textContent = item.status;
      status.className = statusClass(item.status);
    }
    var updated = $("[data-item-updated]");
    if (updated) updated.textContent = item.updated;
    var issued = $("[data-item-issued]");
    if (issued) issued.textContent = item.issued || "—";
    var effective = $("[data-item-effective]");
    if (effective) effective.textContent = item.effective || "—";
    var purpose = $("[data-item-purpose]");
    if (purpose) purpose.textContent = item.purpose;
    var back = $("[data-back-section]");
    if (back) {
      back.href = "section.html?s=" + encodeURIComponent(item.section);
      var parent = catalog.sectionById(item.section);
      back.textContent = parent ? "← Back to " + parent.title : "← Back to section";
    }

    var ackWrap = $("[data-ack-wrap]");
    var ackButton = $("[data-ack]");
    if (canAcknowledge(item)) {
      if (ackWrap) ackWrap.hidden = false;
      bindAckButton(ackButton, item);
    } else if (ackWrap) {
      ackWrap.hidden = true;
    }

    var draftNote = $("[data-draft-note]");
    if (draftNote) {
      draftNote.hidden = item.section !== "draft-general-orders";
    }
  }
})();
