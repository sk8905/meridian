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
    id: "27fb5d30-1fb6-4f30-937c-ff5c598eaaa5",
    title: "Brussels’ protectionist turn spooks bloc’s free-market stalwarts",
    date: "2026-09-29",
    time: "06:00",
    url: "https://www.ft.com/content/27fb5d30-1fb6-4f30-937c-ff5c598eaaa5"
  },
  {
    id: "796167ab-ba0b-4476-b505-516b7d896e40",
    title: "Rolex was for crypto, Ferrari is for AI",
    date: "2026-09-29",
    time: "06:00",
    url: "https://www.ft.com/content/796167ab-ba0b-4476-b505-516b7d896e40"
  },
  {
    id: "d6a9f5df-08d0-4f80-ad2d-5d8a17e2cc82",
    title: "Nvidia turns to insurers to spread the risk of AI build-out",
    date: "2026-09-29",
    time: "05:04",
    url: "https://www.ft.com/content/d6a9f5df-08d0-4f80-ad2d-5d8a17e2cc82"
  },
  {
    id: "e4231435-4d6d-438d-9632-ab215784b2d5",
    title: "Big money, bigger problems in Big Law",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/e4231435-4d6d-438d-9632-ab215784b2d5"
  },
  {
    id: "8415255e-3828-4b0b-941b-6415cffbcf28",
    title: "Private equity wrestles with its own generational wealth gap",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/8415255e-3828-4b0b-941b-6415cffbcf28"
  },
  {
    id: "f8a5e2b8-33f7-4c83-8ef3-ca91c7fa1df7",
    title: "Why a £10bn Monzo takeover could be good for the UK",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/f8a5e2b8-33f7-4c83-8ef3-ca91c7fa1df7"
  },
  {
    id: "1f92357c-374d-4f24-a6f4-373fdeb3ffe3",
    title: "What ‘Choosin’ Texas’ tells us about Burnham’s social care obstacles",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/1f92357c-374d-4f24-a6f4-373fdeb3ffe3"
  },
  {
    id: "3b829a46-3eae-4c20-94db-a79c38d0be4c",
    title: "Germany issues EU budget ultimatum",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/3b829a46-3eae-4c20-94db-a79c38d0be4c"
  },
  {
    id: "2b6db828-897d-46cf-ba64-e3e8560b5f4e",
    title: "Unicredit’s Andrea Orcel moves to seize control of Commerzbank within months",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/2b6db828-897d-46cf-ba64-e3e8560b5f4e"
  },
  {
    id: "4370a241-50e7-4305-b533-44adad41498a",
    title: "Trade union chief criticises Burnham’s delay to social care reforms",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/4370a241-50e7-4305-b533-44adad41498a"
  },
  {
    id: "7af7b31e-5006-467a-96d9-672905f7b45b",
    title: "Donald Trump’s ambassador to Greece causes stir in Romania",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/7af7b31e-5006-467a-96d9-672905f7b45b"
  },
  {
    id: "f537987f-e88e-4f60-93bf-74e838235b2d",
    title: "Starbucks retreats from green goals amid $2bn cost drive",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/f537987f-e88e-4f60-93bf-74e838235b2d"
  },
  {
    id: "6586deaa-d2e3-4e5f-83ef-c64eb57b7832",
    title: "Harry Potter and the British business of international schools",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/6586deaa-d2e3-4e5f-83ef-c64eb57b7832"
  },
  {
    id: "5ad7c42c-b95d-47b8-8dfd-896c1deda1df",
    title: "The booming business of insuring against US gun violence",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/5ad7c42c-b95d-47b8-8dfd-896c1deda1df"
  },
  {
    id: "930465de-0cf3-4a2b-99a4-f632852df5f9",
    title: "UK tech founders urge Burnham to curb non-competes to match US rivals",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/930465de-0cf3-4a2b-99a4-f632852df5f9"
  },
  {
    id: "f894f69a-9e2b-4c3f-bf5d-c5c4dc0e6197",
    title: "Oil price and US Treasury yields in tightest relationship since 1990",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/f894f69a-9e2b-4c3f-bf5d-c5c4dc0e6197"
  },
  {
    id: "40892ee2-70ed-4a15-b290-5ffc2d7d2a40",
    title: "Can Italy’s opposition unite against Giorgia Meloni?",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/40892ee2-70ed-4a15-b290-5ffc2d7d2a40"
  },
  {
    id: "729662bd-0f6e-42a7-a54a-55c306c1f37e",
    title: "Falkland Islanders grapple with Argentina’s ‘economic warfare’",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/729662bd-0f6e-42a7-a54a-55c306c1f37e"
  },
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
  }
];
