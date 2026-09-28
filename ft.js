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
    id: "8840071d-3867-45e2-bf25-ce24655e69ba",
    title: "Blair-era money is ‘not there now’, Healey warns Labour",
    date: "2026-09-28",
    time: "17:06",
    url: "https://www.ft.com/content/8840071d-3867-45e2-bf25-ce24655e69ba"
  },
  {
    id: "fbe0a48f-4d33-42eb-8d2c-79f662c88678",
    title: "Meta launches enterprise AI business seeking to cash in on vast spending",
    date: "2026-09-28",
    time: "16:54",
    url: "https://www.ft.com/content/fbe0a48f-4d33-42eb-8d2c-79f662c88678"
  },
  {
    id: "d751ad99-531d-4990-9a4c-ee89a9fc1b2d",
    title: "Bond sell-off deepens as oil prices rise",
    date: "2026-09-28",
    time: "16:54",
    url: "https://www.ft.com/content/d751ad99-531d-4990-9a4c-ee89a9fc1b2d"
  },
  {
    id: "4aa021c0-7ffc-4570-b4ba-2f90c2d24653",
    title: "Without a resilient economy, central banks have limited choices",
    date: "2026-09-28",
    time: "16:30",
    url: "https://www.ft.com/content/4aa021c0-7ffc-4570-b4ba-2f90c2d24653"
  },
  {
    id: "571a3103-ec01-464b-ab39-0c0da58d9524",
    title: "Five men arrested over alleged RAF Fairford terror plot released on bail",
    date: "2026-09-28",
    time: "16:29",
    url: "https://www.ft.com/content/571a3103-ec01-464b-ab39-0c0da58d9524"
  },
  {
    id: "e423eb7f-ec97-43ed-9b75-cad8e81ac86b",
    title: "Russian drones hit Kyiv science academy and hospital",
    date: "2026-09-28",
    time: "16:03",
    url: "https://www.ft.com/content/e423eb7f-ec97-43ed-9b75-cad8e81ac86b"
  },
  {
    id: "78ec0e04-d6db-41a9-a2eb-a794c80d270c",
    title: "Post-Covid economic inactivity was much lower than thought, ONS says",
    date: "2026-09-28",
    time: "15:53",
    url: "https://www.ft.com/content/78ec0e04-d6db-41a9-a2eb-a794c80d270c"
  },
  {
    id: "65da4f68-2699-4491-a38d-bcc18cde14ac",
    title: "A TV series shows Britain is woefully unprepared for war",
    date: "2026-09-28",
    time: "15:51",
    url: "https://www.ft.com/content/65da4f68-2699-4491-a38d-bcc18cde14ac"
  },
  {
    id: "6729bceb-2480-42b4-9308-51ef7728c181",
    title: "SpaceX’s Starship rocket reaches orbit for the first time",
    date: "2026-09-28",
    time: "14:54",
    url: "https://www.ft.com/content/6729bceb-2480-42b4-9308-51ef7728c181"
  },
  {
    id: "f7f9d03c-cb01-45d3-8148-1c9f3fcc4501",
    title: "Evonik rejects €10.3bn BASF bid to consolidate chemicals industry",
    date: "2026-09-28",
    time: "14:32",
    url: "https://www.ft.com/content/f7f9d03c-cb01-45d3-8148-1c9f3fcc4501"
  },
  {
    id: "2fbf264c-20c1-408e-b5a7-eb8b99dfccfb",
    title: "MFS owner blames Barclays for collapse amid fraud allegations",
    date: "2026-09-28",
    time: "14:16",
    url: "https://www.ft.com/content/2fbf264c-20c1-408e-b5a7-eb8b99dfccfb"
  },
  {
    id: "a2bbb03f-d628-4ea4-8e1d-f5f3b677d536",
    title: "The money vs message election",
    date: "2026-09-28",
    time: "14:00",
    url: "https://www.ft.com/content/a2bbb03f-d628-4ea4-8e1d-f5f3b677d536"
  },
  {
    id: "6b216fc2-b2f4-42df-9102-c18476eb74de",
    title: "Why the EU fears Britain becoming a back door for Chinese cars",
    date: "2026-09-28",
    time: "12:31",
    url: "https://www.ft.com/content/6b216fc2-b2f4-42df-9102-c18476eb74de"
  },
  {
    id: "88e87863-4cf6-4c4e-8858-f0099db350d4",
    title: "Nvidia launches record $150bn share buyback",
    date: "2026-09-28",
    time: "12:23",
    url: "https://www.ft.com/content/88e87863-4cf6-4c4e-8858-f0099db350d4"
  },
  {
    id: "9d0437c4-e5ee-465d-92bc-9491c1baff93",
    title: "Lord Mayor of London favourite pulls out over ‘criminal proceedings’ at former firm",
    date: "2026-09-28",
    time: "12:12",
    url: "https://www.ft.com/content/9d0437c4-e5ee-465d-92bc-9491c1baff93"
  },
  {
    id: "7783e1fd-5787-461f-be5d-63dad6eb0150",
    title: "Why Europe’s centre will hold",
    date: "2026-09-28",
    time: "12:01",
    url: "https://www.ft.com/content/7783e1fd-5787-461f-be5d-63dad6eb0150"
  },
  {
    id: "f83b44e9-406b-4004-9fdb-83357c3ac977",
    title: "What is the AI capex breakeven rate?",
    date: "2026-09-28",
    time: "12:00",
    url: "https://www.ft.com/content/f83b44e9-406b-4004-9fdb-83357c3ac977"
  },
  {
    id: "4cf7fc4e-0fc3-4a44-8710-4299c719cc6a",
    title: "How much? The realities of rising home renovation costs",
    date: "2026-09-28",
    time: "12:00",
    url: "https://www.ft.com/content/4cf7fc4e-0fc3-4a44-8710-4299c719cc6a"
  },
  {
    id: "51089f41-6f8b-4381-aab5-a83bbe4048c4",
    title: "A-list lunches, Oxbridge dinners – and the £400 toothbrush. Don’t miss HTSI’s top reads",
    date: "2026-09-28",
    time: "11:22",
    url: "https://www.ft.com/content/51089f41-6f8b-4381-aab5-a83bbe4048c4"
  },
  {
    id: "db266f36-c6d3-4368-8633-290e2c35e54d",
    title: "Submit a question: What’s next for the global economy?",
    date: "2026-09-28",
    time: "11:18",
    url: "https://www.ft.com/content/db266f36-c6d3-4368-8633-290e2c35e54d"
  },
  {
    id: "77d453cb-f399-4c8e-b59f-bda9116db757",
    title: "Pick any colour watch – so long as it’s gold",
    date: "2026-09-28",
    time: "11:00",
    url: "https://www.ft.com/content/77d453cb-f399-4c8e-b59f-bda9116db757"
  },
  {
    id: "b43739dc-eb98-4bf4-ae4e-a966139ce6f0",
    title: "And the FTAV chart quiz winner is . . .",
    date: "2026-09-28",
    time: "10:52",
    url: "https://www.ft.com/content/b43739dc-eb98-4bf4-ae4e-a966139ce6f0"
  },
  {
    id: "13051aaf-3e1e-41ff-9e0d-b48ff9a0249e",
    title: "Apple patent defeat could hand $1.4bn to Burford Capital",
    date: "2026-09-28",
    time: "11:08",
    url: "https://www.ft.com/content/13051aaf-3e1e-41ff-9e0d-b48ff9a0249e"
  },
  {
    id: "b6be8bb9-a0df-4e3d-ab93-57b1aa65aa95",
    title: "Ukraine airlifts aid to Russian-occupied city",
    date: "2026-09-28",
    time: "11:04",
    url: "https://www.ft.com/content/b6be8bb9-a0df-4e3d-ab93-57b1aa65aa95"
  },
  {
    id: "7761f1ee-0310-4f8d-bac1-f3e5f2354d45",
    title: "Labour conference live: John Healey to give first party speech as UK chancellor",
    date: "2026-09-28",
    time: "11:04",
    url: "https://www.ft.com/content/7761f1ee-0310-4f8d-bac1-f3e5f2354d45"
  },
  {
    id: "1cd3310e-da01-49da-9a3c-8029d59f5761",
    title: "TotalEnergies boosts buybacks and dividends as oil prices surge",
    date: "2026-09-28",
    time: "10:27",
    url: "https://www.ft.com/content/1cd3310e-da01-49da-9a3c-8029d59f5761"
  },
  {
    id: "f4e078f7-4aab-43f5-8eb5-2dbd7142a752",
    title: "Northern Ireland’s political parties agree on one thing: £1.5bn is not enough",
    date: "2026-09-28",
    time: "10:00",
    url: "https://www.ft.com/content/f4e078f7-4aab-43f5-8eb5-2dbd7142a752"
  },
  {
    id: "6ad5a550-adb6-4c56-85ec-2f2bacff059b",
    title: "A faintly hopeful mood at Labour conference",
    date: "2026-09-28",
    time: "09:30",
    url: "https://www.ft.com/content/6ad5a550-adb6-4c56-85ec-2f2bacff059b"
  },
  {
    id: "8a45576f-ff89-449c-82e5-6c9976e91537",
    title: "Seoul accuses Ukraine of violating secrecy pact on North Korean soldiers",
    date: "2026-09-28",
    time: "09:18",
    url: "https://www.ft.com/content/8a45576f-ff89-449c-82e5-6c9976e91537"
  },
  {
    id: "964a6d85-a6d9-4017-90ef-30ffcd8d7f8d",
    title: "Shares in UK housebuilders surge on new Help to Buy scheme",
    date: "2026-09-28",
    time: "08:11",
    url: "https://www.ft.com/content/964a6d85-a6d9-4017-90ef-30ffcd8d7f8d"
  },
  {
    id: "bce81a18-05cf-43a6-9c86-b3238b732230",
    title: "Australia’s biggest gold miner rejects $27bn takeover bid",
    date: "2026-09-28",
    time: "07:53",
    url: "https://www.ft.com/content/bce81a18-05cf-43a6-9c86-b3238b732230"
  },
  {
    id: "8ac777fc-882e-4781-826b-272d72d468a0",
    title: "‘Xi got face’: China relishes equal treatment from Trump",
    date: "2026-09-28",
    time: "06:55",
    url: "https://www.ft.com/content/8ac777fc-882e-4781-826b-272d72d468a0"
  },
  {
    id: "5ae5d8d0-f387-46ac-b07b-45cd5b4b6c70",
    title: "Helen Thompson: “I don’t think we’re ever going back.”",
    date: "2026-09-28",
    time: "06:30",
    url: "https://www.ft.com/content/5ae5d8d0-f387-46ac-b07b-45cd5b4b6c70"
  },
  {
    id: "0903a8bc-69f1-4abd-a18b-94e20f5efa12",
    title: "FTAV’s further reading",
    date: "2026-09-28",
    time: "06:30",
    url: "https://www.ft.com/content/0903a8bc-69f1-4abd-a18b-94e20f5efa12"
  },
  {
    id: "1bc39466-bd7c-4c42-a89b-fd81646705e2",
    title: "Can the EU help to build a ‘hybrid defence’ against Russia?",
    date: "2026-09-28",
    time: "06:00",
    url: "https://www.ft.com/content/1bc39466-bd7c-4c42-a89b-fd81646705e2"
  },
  {
    id: "e2f33efb-f884-4ca9-bf4f-833964e7bf37",
    title: "Goldman’s hedge fund fee bonanza",
    date: "2026-09-28",
    time: "06:00",
    url: "https://www.ft.com/content/e2f33efb-f884-4ca9-bf4f-833964e7bf37"
  },
  {
    id: "1a442c17-ef23-478b-8aed-1bca65cbb45f",
    title: "The Bank of England’s balance sheet has already stopped shrinking",
    date: "2026-09-28",
    time: "06:00",
    url: "https://www.ft.com/content/1a442c17-ef23-478b-8aed-1bca65cbb45f"
  },
];
