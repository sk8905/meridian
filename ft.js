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
    id: "7c6d87b1-d7d9-49c3-b842-2600928fba38",
    title: "US Treasury threatens crackdown on Wall Street tax-avoidance strategies",
    date: "2026-09-28",
    time: "23:00",
    url: "https://www.ft.com/content/7c6d87b1-d7d9-49c3-b842-2600928fba38"
  },
  {
    id: "51c0928d-019b-4a1f-9c3a-1c9a2174f760",
    title: "Burnham vows to break with ‘politics as usual’ by tackling UK’s biggest issues",
    date: "2026-09-28",
    time: "22:30",
    url: "https://www.ft.com/content/51c0928d-019b-4a1f-9c3a-1c9a2174f760"
  },
  {
    id: "0e851fbb-f148-46e4-906f-390b38b62a15",
    title: "FirstFT: Seoul accuses Ukraine of violating secrecy agreement on North Korean soldiers",
    date: "2026-09-28",
    time: "22:26",
    url: "https://www.ft.com/content/0e851fbb-f148-46e4-906f-390b38b62a15"
  },
  {
    id: "ffa65213-3178-454c-9d7d-c8ae8d64124f",
    title: "HSBC moves to bolster Hang Seng by cleaning up balance sheet",
    date: "2026-09-28",
    time: "22:00",
    url: "https://www.ft.com/content/ffa65213-3178-454c-9d7d-c8ae8d64124f"
  },
  {
    id: "c72a016b-ad45-4cde-8020-dc1da7ab0839",
    title: "Erdoğan bids to contain fallout from Turkey’s $18bn stock market scandal",
    date: "2026-09-28",
    time: "21:57",
    url: "https://www.ft.com/content/c72a016b-ad45-4cde-8020-dc1da7ab0839"
  },
  {
    id: "387f15e0-6c42-478e-9da1-e9bfe5ad7127",
    title: "Software glitch will delay US approval of newest Boeing 737",
    date: "2026-09-28",
    time: "21:54",
    url: "https://www.ft.com/content/387f15e0-6c42-478e-9da1-e9bfe5ad7127"
  },
  {
    id: "33344fa5-6a25-4d72-8934-528526dd89bd",
    title: "AMD to buy Fei-Fei Li’s AI start-up for $8bn",
    date: "2026-09-28",
    time: "21:45",
    url: "https://www.ft.com/content/33344fa5-6a25-4d72-8934-528526dd89bd"
  },
  {
    id: "29f1af13-ecc3-4f26-a479-e6088c67231b",
    title: "US midterm elections 2026: The FT’s guide",
    date: "2026-09-28",
    time: "20:29",
    url: "https://www.ft.com/content/29f1af13-ecc3-4f26-a479-e6088c67231b"
  },
  {
    id: "229f0173-ae1c-4eaa-8edb-8a4268572e28",
    title: "Ministers abandon plan to make overseas visitors pay for England’s top museums",
    date: "2026-09-28",
    time: "20:04",
    url: "https://www.ft.com/content/229f0173-ae1c-4eaa-8edb-8a4268572e28"
  },
  {
    id: "f261c9cd-7169-4d16-97fc-9859099ce0f8",
    title: "Netanyahu under pressure over reports he was warned about October 7",
    date: "2026-09-28",
    time: "19:28",
    url: "https://www.ft.com/content/f261c9cd-7169-4d16-97fc-9859099ce0f8"
  },
  {
    id: "571a3103-ec01-464b-ab39-0c0da58d9524",
    title: "Five men arrested over alleged RAF Fairford terror plot released on bail",
    date: "2026-09-28",
    time: "18:59",
    url: "https://www.ft.com/content/571a3103-ec01-464b-ab39-0c0da58d9524"
  },
  {
    id: "964a6d85-a6d9-4017-90ef-30ffcd8d7f8d",
    title: "Shares in UK housebuilders surge on new Help to Buy scheme",
    date: "2026-09-28",
    time: "18:47",
    url: "https://www.ft.com/content/964a6d85-a6d9-4017-90ef-30ffcd8d7f8d"
  },
  {
    id: "074a2198-cb97-4c92-8520-f99ad8dce754",
    title: "BASF should take another crack at chemicals M&A",
    date: "2026-09-28",
    time: "18:44",
    url: "https://www.ft.com/content/074a2198-cb97-4c92-8520-f99ad8dce754"
  },
  {
    id: "22c4fa19-1751-44e9-928d-5203a6af8900",
    title: "Federal Reserve’s watchdog warns of security ‘deficiencies’ at central bank",
    date: "2026-09-28",
    time: "18:31",
    url: "https://www.ft.com/content/22c4fa19-1751-44e9-928d-5203a6af8900"
  },
  {
    id: "533fc709-72f8-44bb-bd0d-c52bb2fb8886",
    title: "Russia’s escalating hybrid campaign against Europe",
    date: "2026-09-28",
    time: "18:04",
    url: "https://www.ft.com/content/533fc709-72f8-44bb-bd0d-c52bb2fb8886"
  },
  {
    id: "2194d34f-a57e-4ace-b2b3-d78a7ddd1281",
    title: "David Zervos, Scott Bessent’s new adviser, has opinions",
    date: "2026-09-28",
    time: "17:56",
    url: "https://www.ft.com/content/2194d34f-a57e-4ace-b2b3-d78a7ddd1281"
  },
  {
    id: "878402a7-eeac-453e-b9db-92156107c5ce",
    title: "UK to restart resettlement scheme, Shabana Mahmood tells Labour conference",
    date: "2026-09-28",
    time: "17:46",
    url: "https://www.ft.com/content/878402a7-eeac-453e-b9db-92156107c5ce"
  },
  {
    id: "49bff877-ae51-481d-8223-5c0d04f4ba87",
    title: "Erdoğan holds rare meeting with Germany’s potential next leader",
    date: "2026-09-28",
    time: "17:14",
    url: "https://www.ft.com/content/49bff877-ae51-481d-8223-5c0d04f4ba87"
  },
  {
    id: "8840071d-3867-45e2-bf25-ce24655e69ba",
    title: "Blair-era money is ‘not there now’, Healey warns Labour",
    date: "2026-09-28",
    time: "17:06",
    url: "https://www.ft.com/content/8840071d-3867-45e2-bf25-ce24655e69ba"
  },
  {
    id: "00d2cfea-362f-4260-8d7f-1e5a20a3a1ea",
    title: "La Vestale should be a revelation. The Berlin Staatsoper’s season-opener fails to convince",
    date: "2026-09-28",
    time: "17:00",
    url: "https://www.ft.com/content/00d2cfea-362f-4260-8d7f-1e5a20a3a1ea"
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
    id: "13051aaf-3e1e-41ff-9e0d-b48ff9a0249e",
    title: "Apple patent defeat could hand $1.4bn to Burford Capital",
    date: "2026-09-28",
    time: "11:08",
    url: "https://www.ft.com/content/13051aaf-3e1e-41ff-9e0d-b48ff9a0249e"
  }
];
