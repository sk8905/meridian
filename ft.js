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
    id: "a5bd820e-fc7c-4414-ad90-f77bd7aa3a44",
    title: "Deadly Russian strikes cut power in several Kyiv districts",
    date: "2026-10-07",
    time: "10:46",
    url: "https://www.ft.com/content/a5bd820e-fc7c-4414-ad90-f77bd7aa3a44",
  },
  {
    id: "a21ec190-edcd-454e-886a-302b0a16ea82",
    title: "AI agents could cost banks $500bn — by winning savers better rates",
    date: "2026-10-07",
    time: "09:51",
    url: "https://www.ft.com/content/a21ec190-edcd-454e-886a-302b0a16ea82",
  },
  {
    id: "8b0ad0c9-88a1-412e-8658-7f93f510d008",
    title: "Five things Kemi Badenoch must do to win",
    date: "2026-10-07",
    time: "09:38",
    url: "https://www.ft.com/content/8b0ad0c9-88a1-412e-8658-7f93f510d008",
  },
  {
    id: "9e1cf8ac-68b7-44bf-8e99-0bc1c75e2c21",
    title: "Tory conference live: Kemi Badenoch to address Conservative Party",
    date: "2026-10-07",
    time: "09:37",
    url: "https://www.ft.com/content/9e1cf8ac-68b7-44bf-8e99-0bc1c75e2c21",
  },
  {
    id: "87155c48-b8fc-4a24-bace-5d20b3f40162",
    title: "Mike Ashley’s Frasers Group snaps up stake in Under Armour",
    date: "2026-10-07",
    time: "09:19",
    url: "https://www.ft.com/content/87155c48-b8fc-4a24-bace-5d20b3f40162",
  },
  {
    id: "84d9a203-7231-452d-846b-8e502ca2e2a5",
    title: "Japan to slash hundreds of stocks from Topix index in record revamp",
    date: "2026-10-07",
    time: "09:15",
    url: "https://www.ft.com/content/84d9a203-7231-452d-846b-8e502ca2e2a5",
  },
  {
    id: "2895a744-9538-4bc9-ac9b-686677f5cdb2",
    title: "August wage growth poses no obstacle to more BoJ tightening",
    date: "2026-10-07",
    time: "09:01",
    url: "https://www.ft.com/content/2895a744-9538-4bc9-ac9b-686677f5cdb2",
  },
  {
    id: "713ccee6-855f-48d8-acf1-161265041ad8",
    title: "India raises interest rates for first time in 3 years",
    date: "2026-10-07",
    time: "08:04",
    url: "https://www.ft.com/content/713ccee6-855f-48d8-acf1-161265041ad8",
  },
  {
    id: "7eb5da58-d909-4cec-9a30-1c6ec8ffb0a6",
    title: "IMF’s Kristalina Georgieva urges governments to rein in spending",
    date: "2026-10-07",
    time: "07:00",
    url: "https://www.ft.com/content/7eb5da58-d909-4cec-9a30-1c6ec8ffb0a6",
  },
  {
    id: "dcf35eaf-e1d3-4289-bc7a-e0c91725ad59",
    title: "Donald Trump says he will speak with Vladimir Putin about pneumonic plague",
    date: "2026-10-07",
    time: "06:33",
    url: "https://www.ft.com/content/dcf35eaf-e1d3-4289-bc7a-e0c91725ad59",
  },
  {
    id: "16df642e-dc1a-4d17-8f18-b97f32efc5db",
    title: "Neat tricks to help French bonds",
    date: "2026-10-07",
    time: "06:30",
    url: "https://www.ft.com/content/16df642e-dc1a-4d17-8f18-b97f32efc5db",
  },
  {
    id: "2a7ccefb-416c-4aa7-91a0-b1a2ac56dea5",
    title: "FTAV’s further reading",
    date: "2026-10-07",
    time: "06:30",
    url: "https://www.ft.com/content/2a7ccefb-416c-4aa7-91a0-b1a2ac56dea5",
  },
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
    id: "29d249eb-ed06-4ab1-8f17-c11c5589cf74",
    title: "FirstFT: Brussels explores broad levy targeting revenue from US tech",
    date: "2026-10-07",
    time: "05:31",
    url: "https://www.ft.com/content/29d249eb-ed06-4ab1-8f17-c11c5589cf74",
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
    id: "3fb9f6ee-4ce2-412a-ab0c-c542d76cb9ec",
    title: "Can I appoint a guardian to look after my children if I die?",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/3fb9f6ee-4ce2-412a-ab0c-c542d76cb9ec",
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
];
