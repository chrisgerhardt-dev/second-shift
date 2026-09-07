/**
 * Unofficial catalog titles inventoried from the TAS Policy Portal tree.
 * Titles + demo stubs only. Not official orders, not legal text, not accreditation.
 */
(function (global) {
  function stub(kind, title) {
    var lead =
      "Demo placeholder for “" +
      title +
      "”. Catalog listing only — not an official order, form, or legal standard.";
    if (kind === "go") {
      return lead + " Effective and issued dates are demo values.";
    }
    if (kind === "draft") {
      return lead + " Marked Under review. No issued body and no approval are implied.";
    }
    if (kind === "form") {
      return lead + " Form title only. No downloadable official form is provided.";
    }
    return lead + " Ordinance title listed for the catalog tree. Not the Town code.";
  }

  function go(number, title) {
    return {
      id: "go-" + number.replace(/\./g, "-"),
      section: "general-orders",
      number: number,
      title: title,
      status: "Current",
      effective: "09/02/2026",
      issued: "08/19/2026",
      updated: "09/02/2026",
      purpose: stub("go", title)
    };
  }

  function draft(number, title) {
    return {
      id: "draft-" + number.replace(/\./g, "-"),
      section: "draft-general-orders",
      number: number,
      title: title,
      status: "Under review",
      effective: "",
      issued: "",
      updated: "Under review",
      purpose: stub("draft", title)
    };
  }

  function form(title) {
    var slug = title
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return {
      id: "form-" + slug,
      section: "forms",
      number: "",
      title: title,
      status: "Form (demo)",
      effective: "",
      issued: "08/19/2026",
      updated: "08/19/2026",
      purpose: stub("form", title)
    };
  }

  var generalOrders = [
    go("100.10", "Law Enforcement Role & Authority"),
    go("100.20", "Jurisdiction & Mutual Aid"),
    go("100.30", "Department Goals & Objectives"),
    go("1000.13", "K9 Operations"),
    go("1000.90", "Motor Vehicle Apprehension"),
    go("200.10", "Oath of Office"),
    go("200.13", "Internal Affairs"),
    go("200.40", "Use of Force"),
    go("200.60", "Civil Incidents"),
    go("200.80", "Strip & Body Cavity Searches"),
    go("211.00", "Off Duty Authority"),
    go("212.00", "Bias Based Profiling"),
    go("270.50", "Seizure and Forfeiture of Assets"),
    go("400.00", "Administrative Reporting"),
    go("700.10", "Code of Conduct"),
    go("900.10", "Training")
  ];

  var draftGeneralOrders = [
    draft("1000.10", "Traffic Enforcement"),
    draft("1000.15", "Audio-Visual Recordings"),
    draft("1000.20", "Patrol Administration and Operation"),
    draft("1000.40", "Attendance, Roll Calls, and Schedule Changes"),
    draft("1005.00", "Fleet System"),
    draft("1010.00", "Response to Calls for Service"),
    draft("1012.00", "Body Armor"),
    draft("1200.00", "Traffic Crash Investigations"),
    draft("1300.10", "Traffic Direction and Control"),
    draft("1400.00", "Abandoned Vehicles / Towing Procedures"),
    draft("1400.30", "Hazardous Materials"),
    draft("1500.00", "Criminal Investigations"),
    draft("1500.50", "Organized and Vice Crimes"),
    draft("1500.60", "Confidential Informants"),
    draft("1500.70", "Confidential Informant Funds"),
    draft("1500.80", "Crimes Against Children"),
    draft("1600.00", "Juvenile Operations"),
    draft("1600.10", "School Resource Officer"),
    draft("170.10", "Unusual Occurrences"),
    draft("1800.00", "Media Relations & Social Media"),
    draft("200.30", "Arrest With & Without a Warrant"),
    draft("200.47", "Weapons"),
    draft("2000.30", "Missing Persons"),
    draft("2000.40", "Records Management (TIES-NCIC-TIBRS)"),
    draft("210.00", "Domestic Violence"),
    draft("210.10", "Collection and Preservation of Evidence"),
    draft("270.00", "Search and Seizure"),
    draft("300.10", "Organizational Structure"),
    draft("300.70", "Personnel Responsibilities & Job Descriptions"),
    draft("400.30", "Administrative Deadlines & Recurring Requirements"),
    draft("420.20", "Written Directive System"),
    draft("500.00", "Fiscal Management"),
    draft("600.30", "Uniforms, Attire, and Grooming"),
    draft("600.40", "Leave Requests"),
    draft("600.50", "Promotional Procedures & Specialized Assignments"),
    draft("600.90", "Performance Evaluations"),
    draft("800.10", "Recruitment and Selection"),
    draft("900.20", "Field Training Program")
  ];

  var forms = [
    form("Bomb Threat Checklist"),
    form("Citizen Complaint Form"),
    form("DHS Bomb Threat Stand-Off Card"),
    form("Oath of Office Form"),
    form("Policy Change Request"),
    form("AMBER Alert Checklist"),
    form("Authorization For The Release of Investigative Funds"),
    form("Body Armor (Safety Device) Acknowledgment"),
    form("Confidential Informant Packet"),
    form("Daily Observation Report"),
    form("Domestic Notification of Release"),
    form("Domestic Violence Rights"),
    form("Escalation Trauma Chart"),
    form("Form 200 - Use of Force"),
    form("Form 210 - Subject Compliance"),
    form("Garrity Warning"),
    form("Juvenile Pickup Affidavit"),
    form("Juvenile Waiver- Confidential Informant"),
    form("Letter of Counseling"),
    form("Notice of Property Seizure and Forfeiture"),
    form("Patrol Shift Exchange"),
    form("Payment Voucher"),
    form("Pursuit Report Form"),
    form("Radar Log"),
    form("Silver Alert Checklist"),
    form("TN District Attorney General Child Protective Investigative Team Protocol 2023"),
    form("Victim-Witness-Pamphlet"),
    form("Waivers and Affidavits"),
    form("Written Reprimand")
  ];

  var townPolicy = [
    {
      id: "town-ord-740-23",
      section: "town-policy",
      number: "Ord. 740-23",
      title: "Erwin Personnel Policy",
      status: "Town policy (demo)",
      effective: "09/02/2026",
      issued: "08/19/2026",
      updated: "09/02/2026",
      purpose: stub("town", "Erwin Personnel Policy")
    }
  ];

  var items = generalOrders.concat(draftGeneralOrders, forms, townPolicy);

  var sections = [
    {
      id: "general-orders",
      title: "General Orders",
      kicker: "Current titles",
      blurb: "Current General Order titles. Open a stub, then Acknowledge (demo). Not official orders.",
      instruction: "Current General Orders. Open the stub, then Acknowledge (demo).",
      icon: "shield"
    },
    {
      id: "draft-general-orders",
      title: "Draft General Orders",
      kicker: "Under review",
      blurb: "Draft titles marked Under review. No issued body and no supervisor workflow is connected.",
      instruction: "Draft General Orders. Under review in this demo — not issued and not approved.",
      icon: "draft"
    },
    {
      id: "forms",
      title: "Forms",
      kicker: "Title list",
      blurb: "Form titles only. No official blanks, packets, or downloads.",
      instruction: "Forms catalog. Titles and purpose stubs only — not official forms.",
      icon: "form"
    },
    {
      id: "town-policy",
      title: "Town Policy",
      kicker: "Ordinance title",
      blurb: "One town ordinance title listed for the catalog tree. Not the municipal code.",
      instruction: "Town Policy. Ordinance title only — not the official Town code.",
      icon: "town"
    }
  ];

  global.EPDPolicies = {
    dueSeed: ["go-100-10", "go-200-10", "go-200-40", "go-212-00", "go-700-10"],
    sections: sections,
    items: items,
    sectionById: function (id) {
      return sections.filter(function (s) {
        return s.id === id;
      })[0] || null;
    },
    itemById: function (id) {
      return items.filter(function (item) {
        return item.id === id;
      })[0] || null;
    },
    itemsIn: function (sectionId) {
      return items.filter(function (item) {
        return item.section === sectionId;
      });
    },
    count: function (sectionId) {
      return this.itemsIn(sectionId).length;
    }
  };
})(window);
