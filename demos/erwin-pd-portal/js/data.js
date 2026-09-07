/**
 * Seeded demo data only. No backend.
 * Named person: Chief Tony Buchanan. Other roles are titles only.
 * Bulletin themes follow public remarks (fleet, body cams, radios, policies)
 * and are placeholders until live TAS Portal Demo screenshots land.
 */
window.EPD = {
  agency: {
    name: "Erwin Police Department",
    town: "Erwin, Tennessee",
    address: "211 N Main Ave",
    city: "Erwin",
    state: "TN",
    zip: "37650",
    emergency: "911",
    nonEmergency: "423-743-1870",
    chief: "Tony Buchanan",
    chiefSince: "February 2026",
    townSite: "https://erwintn.org/"
  },
  shift: {
    name: "Evening — demo card",
    window: "18:00–06:00",
    status: "On duty (sample)",
    supervisor: "Shift supervisor — name withheld in this demo",
    units: "3 marked units listed (sample)",
    notes: "Sample roster. Not a live CAD feed."
  },
  tips: [
    {
      id: "TIP-1042",
      received: "2026-09-06 21:14",
      status: "New",
      area: "N Main Ave",
      summary: "Abandoned vehicle reported near the municipal building. Sample tip — not a real report."
    },
    {
      id: "TIP-1038",
      received: "2026-09-06 16:02",
      status: "In review",
      area: "Love Street",
      summary: "After-hours noise complaint. Sample tip — not a real report."
    },
    {
      id: "TIP-1031",
      received: "2026-09-05 09:40",
      status: "Closed (demo)",
      area: "Town park",
      summary: "Suspicious person walking the park loop after close. Sample tip — not a real report."
    }
  ],
  bulletin: [
    {
      tag: "Fleet",
      title: "Keep the cars running",
      body: "Demo copy. Public remarks from Chief Buchanan: fleet upkeep is a first-order job. Replace this card from the live TAS portal when screenshots arrive."
    },
    {
      tag: "Body cams",
      title: "New cameras on the department",
      body: "Demo copy. Public remarks: new body cams for the department. This is not a policy, inventory, or evidence system."
    },
    {
      tag: "Radios",
      title: "New radios in service",
      body: "Demo copy. Public remarks: new radios. No talkgroups, keys, or live radio traffic are in this prototype."
    },
    {
      tag: "Policies",
      title: "Policies and procedures in work",
      body: "Demo copy. Public remarks: policies and procedures are being updated. No official orders are published here."
    }
  ],
  directory: [
    {
      role: "Chief of Police",
      name: "Tony Buchanan",
      note: "Appointed February 2026. Only named person in this demo."
    },
    {
      role: "Patrol",
      name: "Name withheld in this demo",
      note: "Role only. Do not invent officer names."
    },
    {
      role: "Investigations",
      name: "Name withheld in this demo",
      note: "Role only."
    },
    {
      role: "Records",
      name: "Name withheld in this demo",
      note: "Role only."
    },
    {
      role: "Communications",
      name: "Name withheld in this demo",
      note: "Role only. Emergency remains 911."
    }
  ],
  disclaimer:
    "Unofficial Second Shift prototype. Not affiliated with the Town of Erwin or the Erwin Police Department. Demo data only. Do not treat this as an official site, and do not email the town about it."
};
