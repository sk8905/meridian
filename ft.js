// =============================================================================
// myFT — headlines from the reader's personalised Financial Times feed
// (followed topics), surfaced in the Home news feed under an "FT" label.
//
// Source: the reader's myFT RSS feed —
//   https://www.ft.com/myft/following/601965b2-62d0-47e1-88cf-576ebc8a8a2e.rss
// It is fetched by the scheduled refresh routines (see
// docs/newsletter-refresh.md, "myFT pull" section), parsed, and written here.
// This list is regenerated on each refresh: dedupe by id (the RSS guid/link),
// keep the ~40 most recent, newest first.
//
// We keep only the headline, date/time (Europe/London) and the article URL —
// never article body text. Rows open out to ft.com in a new tab; the articles
// sit behind FT's paywall, which the reader's own FT login unlocks.
//
// Item shape:
//   id      unique key — the RSS <guid>, else the canonical article URL
//   title   headline exactly as published
//   date    "YYYY-MM-DD" (Europe/London)
//   time    "HH:MM" 24h (Europe/London) — from the RSS <pubDate>
//   url     canonical article link (strip tracking query params)
export const FT_ITEMS = [
  {
    id: "f065a2f6-6109-46d8-b11b-37ce2a81017c",
    title: "Brussels pleads with EU capitals not to slash the bloc’s next shared budget",
    date: "2026-10-07",
    time: "06:00",
    url: "https://www.ft.com/content/f065a2f6-6109-46d8-b11b-37ce2a81017c",
  },
  {
    id: "0c188b13-a8e5-4447-8e54-2d50ce4ab082",
    title: "Who’d be betting against Webuild, the builder that built Italy?",
    date: "2026-10-07",
    time: "06:00",
    url: "https://www.ft.com/content/0c188b13-a8e5-4447-8e54-2d50ce4ab082",
  },
  {
    id: "3fb9f6ee-4ce2-412a-ab0c-c542d76cb9ec",
    title: "Can I appoint a guardian to look after my children if I die?",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/3fb9f6ee-4ce2-412a-ab0c-c542d76cb9ec",
  },
  {
    id: "0a64ce3b-d56a-4829-948c-4abc4978b1c9",
    title: "Germany’s beleaguered spies face a fresh scandal",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/0a64ce3b-d56a-4829-948c-4abc4978b1c9",
  },
  {
    id: "99968044-a1f7-4722-b407-2a7310b27ca9",
    title: "Private equity’s future after the boom and bust",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/99968044-a1f7-4722-b407-2a7310b27ca9",
  },
  {
    id: "86bcbc9c-bc46-47fe-871c-20e6369231b9",
    title: "If supermarket M&A is back, Sainsbury’s is in a sweet spot",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/86bcbc9c-bc46-47fe-871c-20e6369231b9",
  },
  {
    id: "796e3264-b277-4fdd-8c23-4ce8ba6a7775",
    title: "HMRC opened probe into Man City’s tax affairs in 2018",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/796e3264-b277-4fdd-8c23-4ce8ba6a7775",
  },
  {
    id: "7c38e8e3-8035-4036-8bc0-5fba2fbf77cb",
    title: "Robust AI spending sets investors up for another bumper US earnings season",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/7c38e8e3-8035-4036-8bc0-5fba2fbf77cb",
  },
  {
    id: "8178bed1-ef14-4ebc-b291-921cef8866e7",
    title: "Bank mergers arrive in Europe with a whimper rather than a bang",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/8178bed1-ef14-4ebc-b291-921cef8866e7",
  },
  {
    id: "16dc05f9-f7d2-455b-a91e-4c8570bd846a",
    title: "Greens braced for loss in Keir Starmer’s old seat in London",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/16dc05f9-f7d2-455b-a91e-4c8570bd846a",
  },
  {
    id: "dd553fc2-532c-4afc-a773-47cd7f786260",
    title: "HSBC plans sweeping job cuts across UK wealth business in AI push",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/dd553fc2-532c-4afc-a773-47cd7f786260",
  },
  {
    id: "47c82e53-aa63-4b0d-95fd-ecc04d81e6ab",
    title: "Blue Owl to launch ‘big push’ into insurance",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/47c82e53-aa63-4b0d-95fd-ecc04d81e6ab",
  },
  {
    id: "3c86343d-e280-4263-940e-e09b1d75d32a",
    title: "Chemical groups succeed in watering down EU pesticide rules",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/3c86343d-e280-4263-940e-e09b1d75d32a",
  },
  {
    id: "f5d01c83-6133-4a01-a9c7-f8a2067b7c32",
    title: "How AI tempts the lazy mind",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/f5d01c83-6133-4a01-a9c7-f8a2067b7c32",
  },
  {
    id: "ad06ed89-f600-4694-8c95-7d53b6d3315b",
    title: "Brussels looks to capture Big Tech through tax on large corporations",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/ad06ed89-f600-4694-8c95-7d53b6d3315b",
  },
  {
    id: "bd20289f-2d51-4b3d-9eb9-68945f9ae309",
    title: "Russian hostile activity costs UK up to £2.5bn a year, report warns",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/bd20289f-2d51-4b3d-9eb9-68945f9ae309",
  },
  {
    id: "7811d98a-7693-4596-a0f8-7329ed293116",
    title: "African governments launch rating agency to challenge global ‘big three’",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/7811d98a-7693-4596-a0f8-7329ed293116",
  },
  {
    id: "37e12a42-d473-4b1b-8fc5-4ea5f06d3bfb",
    title: "What comes next with the energy shock?",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/37e12a42-d473-4b1b-8fc5-4ea5f06d3bfb",
  },
  {
    id: "5cd71c54-af31-496f-b661-eb408f03e7ec",
    title: "Tens of thousands of active UK companies may have fraudulent directors",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/5cd71c54-af31-496f-b661-eb408f03e7ec",
  },
  {
    id: "10ce1086-a9ae-4851-92e4-3b6efc8a030f",
    title: "The tide of bank branch closures is starting to reverse",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/10ce1086-a9ae-4851-92e4-3b6efc8a030f",
  },
  {
    id: "d3f5928d-f38c-4666-8f7a-8737f9c45f51",
    title: "SpaceX looks to raise $40bn to buy Nvidia chips in financing led by Apollo",
    date: "2026-10-06",
    time: "23:28",
    url: "https://www.ft.com/content/d3f5928d-f38c-4666-8f7a-8737f9c45f51",
  },
  {
    id: "29d249eb-ed06-4ab1-8f17-c11c5589cf74",
    title: "FirstFT: Crypto company known for risky ‘perps’ vexes Singapore",
    date: "2026-10-06",
    time: "22:35",
    url: "https://www.ft.com/content/29d249eb-ed06-4ab1-8f17-c11c5589cf74",
  },
  {
    id: "3fd43fc5-4973-4a26-9d9c-47b6361e6217",
    title: "Donald Trump says he is considering suspending federal petrol tax",
    date: "2026-10-06",
    time: "22:09",
    url: "https://www.ft.com/content/3fd43fc5-4973-4a26-9d9c-47b6361e6217",
  },
  {
    id: "cd851d45-596b-4745-8c28-ce7ace1d3e43",
    title: "‘Most dangerous product in crypto’ vexes Singapore",
    date: "2026-10-06",
    time: "22:00",
    url: "https://www.ft.com/content/cd851d45-596b-4745-8c28-ce7ace1d3e43",
  },
  {
    id: "6d06a6b2-ea2f-4384-959d-682ce78a1693",
    title: "There is only one trade",
    date: "2026-10-06",
    time: "21:00",
    url: "https://www.ft.com/content/6d06a6b2-ea2f-4384-959d-682ce78a1693",
  },
  {
    id: "0d665e5b-d8c8-4f1e-acf5-bba7193b4e6e",
    title: "Ships’ captains paid $100,000 a month to transit Strait of Hormuz",
    date: "2026-10-06",
    time: "21:00",
    url: "https://www.ft.com/content/0d665e5b-d8c8-4f1e-acf5-bba7193b4e6e",
  },
  {
    id: "793d9121-1dae-498b-bae1-db8c69e67e2d",
    title: "Democratic powerbroker Clyburn urges party to woo Black voters with affordability pitch",
    date: "2026-10-06",
    time: "20:26",
    url: "https://www.ft.com/content/793d9121-1dae-498b-bae1-db8c69e67e2d",
  },
  {
    id: "2ad1ff25-f08e-4e78-83c9-90e7ea3844ee",
    title: "Goldman Sachs and Man Group exposed in EY data breach",
    date: "2026-10-06",
    time: "20:24",
    url: "https://www.ft.com/content/2ad1ff25-f08e-4e78-83c9-90e7ea3844ee",
  },
  {
    id: "211b69e4-ae2f-4323-bc31-e07fc1560581",
    title: "ExxonMobil looks to offshore projects in Trinidad and Tobago for next boom",
    date: "2026-10-06",
    time: "18:36",
    url: "https://www.ft.com/content/211b69e4-ae2f-4323-bc31-e07fc1560581",
  },
  {
    id: "a7a19bb1-a1ba-4317-a191-c387bbc9f4b9",
    title: "Pedro Sánchez’s big electoral gamble",
    date: "2026-10-06",
    time: "17:47",
    url: "https://www.ft.com/content/a7a19bb1-a1ba-4317-a191-c387bbc9f4b9",
  },
  {
    id: "a6339e0c-4114-413a-a23c-916ed4392ce0",
    title: "Anduril plans shipyard to manufacture parts for US Navy’s top submarines",
    date: "2026-10-06",
    time: "17:21",
    url: "https://www.ft.com/content/a6339e0c-4114-413a-a23c-916ed4392ce0",
  },
  {
    id: "f923e23b-423a-446c-bf84-a68f7b1d169c",
    title: "Tory plan to rip up UK-EU food deal risks ‘huge uncertainty’, producers warn",
    date: "2026-10-06",
    time: "17:00",
    url: "https://www.ft.com/content/f923e23b-423a-446c-bf84-a68f7b1d169c",
  },
  {
    id: "aae1fc0b-2c24-4e44-a2b7-886ad2cc5ffe",
    title: "Badenoch pledges to halve employers’ NI contributions for younger workers",
    date: "2026-10-06",
    time: "17:00",
    url: "https://www.ft.com/content/aae1fc0b-2c24-4e44-a2b7-886ad2cc5ffe",
  },
  {
    id: "4aabf94b-2c5c-4ea6-9e5a-660c17ca84db",
    title: "Silicon Valley’s acqui-hire ruse may have passed its prime",
    date: "2026-10-06",
    time: "16:59",
    url: "https://www.ft.com/content/4aabf94b-2c5c-4ea6-9e5a-660c17ca84db",
  },
  {
    id: "7d3a362b-1bbc-4022-8f44-19544716f331",
    title: "UK threatens to expel Israeli diplomats if Jerusalem consulate is closed",
    date: "2026-10-06",
    time: "16:54",
    url: "https://www.ft.com/content/7d3a362b-1bbc-4022-8f44-19544716f331",
  },
  {
    id: "4e1a4297-62f4-4b42-a41a-2ad23b64cbe9",
    title: "France’s Marine Le Pen pledges to rein in public spending",
    date: "2026-10-06",
    time: "16:50",
    url: "https://www.ft.com/content/4e1a4297-62f4-4b42-a41a-2ad23b64cbe9",
  },
  {
    id: "fba91434-70d3-40e6-adb1-8d0c5d6f4fe6",
    title: "Ion tells creditors it won’t play hardball on $11bn debt pile",
    date: "2026-10-06",
    time: "16:48",
    url: "https://www.ft.com/content/fba91434-70d3-40e6-adb1-8d0c5d6f4fe6",
  },
  {
    id: "42b6fa88-f730-4f8a-a194-8f53d0759aaf",
    title: "Palmer Luckey’s Erebor surges to more than $7bn in deposits since launch",
    date: "2026-10-06",
    time: "16:32",
    url: "https://www.ft.com/content/42b6fa88-f730-4f8a-a194-8f53d0759aaf",
  },
  {
    id: "97d14ed8-d6b7-4f4f-8e22-e87435b8ac0d",
    title: "Taking stock of public trust in the Kevin Warsh Fed era",
    date: "2026-10-06",
    time: "16:30",
    url: "https://www.ft.com/content/97d14ed8-d6b7-4f4f-8e22-e87435b8ac0d",
  },
  {
    id: "5235f78e-5c94-4015-8559-b6d0ec3fea95",
    title: "Jeffrey Archer, author and politician, 1940-2026",
    date: "2026-10-06",
    time: "16:08",
    url: "https://www.ft.com/content/5235f78e-5c94-4015-8559-b6d0ec3fea95",
  },
];
