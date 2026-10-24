// =============================================================================
// myFT — headlines from the reader's personalised Financial Times feed
// (followed topics), surfaced in the Home news feed under an "FT" label.
//
// Source: the reader's myFT RSS feed —
//   https://www.ft.com/myft/following/601965b2-62d0-47e1-88cf-576ebc8a8a2e.rss
// It is fetched by the scheduled refresh routine (see docs/refresh-routines.md,
// the "Email sweep → myFT" section), parsed, and written here.
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
    "id": "ba33fb18-1dea-4214-9221-228c155a6ac1",
    "title": "Russia and Ukraine agree to temporary ceasefire around occupied town of Oleshky",
    "date": "2026-10-23",
    "time": "22:11",
    "url": "https://www.ft.com/content/ba33fb18-1dea-4214-9221-228c155a6ac1"
  },
  {
    "id": "d11b743a-cd2c-4f0d-a464-8750aa8f4170",
    "title": "Xi Jinping gathers China’s top communist cadres with focus on discipline",
    "date": "2026-10-23",
    "time": "22:00",
    "url": "https://www.ft.com/content/d11b743a-cd2c-4f0d-a464-8750aa8f4170"
  },
  {
    "id": "d3d12f54-fcf0-400c-96f1-484aea980be5",
    "title": "Donald Trump to cut Canadian tariffs after pressure from Republicans",
    "date": "2026-10-23",
    "time": "21:21",
    "url": "https://www.ft.com/content/d3d12f54-fcf0-400c-96f1-484aea980be5"
  },
  {
    "id": "b68b8544-4ce9-45d4-b522-cd2f8150e4cc",
    "title": "Donald Trump moves to block certification of Alaska Senate result if Republican loses",
    "date": "2026-10-23",
    "time": "21:16",
    "url": "https://www.ft.com/content/b68b8544-4ce9-45d4-b522-cd2f8150e4cc"
  },
  {
    "id": "bc13b5f1-387e-4fae-927e-d96ac24ea645",
    "title": "Lunch break under threat as Hong Kong looks at longer trading day",
    "date": "2026-10-23",
    "time": "21:00",
    "url": "https://www.ft.com/content/bc13b5f1-387e-4fae-927e-d96ac24ea645"
  },
  {
    "id": "859676ae-5fa4-489a-99af-560771dd44a1",
    "title": "Mark Zuckerberg’s deal to stay in California cheered by wealth tax campaign",
    "date": "2026-10-23",
    "time": "19:49",
    "url": "https://www.ft.com/content/859676ae-5fa4-489a-99af-560771dd44a1"
  },
  {
    "id": "510f7213-e196-4af3-8ba8-fc51cd741228",
    "title": "Directors’ Deals: Safestore directors raise stakes as shares struggle",
    "date": "2026-10-23",
    "time": "18:00",
    "url": "https://www.ft.com/content/510f7213-e196-4af3-8ba8-fc51cd741228"
  },
  {
    "id": "9f46db72-0a1e-42b0-8efe-974a04fa0fc7",
    "title": "Latest savings rates",
    "date": "2026-10-23",
    "time": "17:40",
    "url": "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7"
  },
  {
    "id": "75ba3055-625c-4cb5-894b-0696a38f5e79",
    "title": "Latest Isa rates",
    "date": "2026-10-23",
    "time": "17:32",
    "url": "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79"
  },
  {
    "id": "68b36b6d-71e7-4f44-bbfb-a202e36603a4",
    "title": "Latest National Savings & Investments rates",
    "date": "2026-10-23",
    "time": "17:28",
    "url": "https://www.ft.com/content/68b36b6d-71e7-4f44-bbfb-a202e36603a4"
  },
  {
    "id": "e669f0f9-5042-4554-9cd6-39d2d9fd27df",
    "title": "Burnham should not rush on giving tax powers to English mayors, experts warn",
    "date": "2026-10-23",
    "time": "17:27",
    "url": "https://www.ft.com/content/e669f0f9-5042-4554-9cd6-39d2d9fd27df"
  },
  {
    "id": "f75c25c2-4164-4dfc-9d56-fc6a86704c47",
    "title": "KKR founders back Valencia in deal valuing football club at €1.25bn",
    "date": "2026-10-23",
    "time": "13:02",
    "url": "https://www.ft.com/content/f75c25c2-4164-4dfc-9d56-fc6a86704c47"
  },
  {
    "id": "e67a3d0e-5893-45a5-b098-64a68a4ef032",
    "title": "Ukraine says Starlink speeds still throttled",
    "date": "2026-10-23",
    "time": "12:05",
    "url": "https://www.ft.com/content/e67a3d0e-5893-45a5-b098-64a68a4ef032"
  },
  {
    "id": "06209f51-de7c-4de0-8e66-5c621a960b87",
    "title": "What the coming copper crunch means for the global economy",
    "date": "2026-10-23",
    "time": "12:01",
    "url": "https://www.ft.com/content/06209f51-de7c-4de0-8e66-5c621a960b87"
  },
  {
    "id": "4fa0c5ef-abfe-4a63-95c0-2ba69329abd0",
    "title": "Citi wins long-awaited approval for China securities business",
    "date": "2026-10-23",
    "time": "11:40",
    "url": "https://www.ft.com/content/4fa0c5ef-abfe-4a63-95c0-2ba69329abd0"
  },
  {
    "id": "df70bf20-e809-48d0-8485-f8f514a7fbc4",
    "title": "Anthropic strikes deal to launch European consultancy",
    "date": "2026-10-23",
    "time": "10:04",
    "url": "https://www.ft.com/content/df70bf20-e809-48d0-8485-f8f514a7fbc4"
  },
  {
    "id": "f968f40c-ecc8-4981-ba60-a826f808505b",
    "title": "September inflation keeps BoJ on tightening course",
    "date": "2026-10-23",
    "time": "09:48",
    "url": "https://www.ft.com/content/f968f40c-ecc8-4981-ba60-a826f808505b"
  },
  {
    "id": "74bb3555-6f29-4ff9-bcaf-6cd20a9a3b1b",
    "title": "‘Relentless’ cost of living pressures behind collapse in UK consumer confidence",
    "date": "2026-10-23",
    "time": "08:08",
    "url": "https://www.ft.com/content/74bb3555-6f29-4ff9-bcaf-6cd20a9a3b1b"
  },
  {
    "id": "ce0e9d68-c63f-4666-9909-512b929e6284",
    "title": "Winter arrives in markets",
    "date": "2026-10-23",
    "time": "06:30",
    "url": "https://www.ft.com/content/ce0e9d68-c63f-4666-9909-512b929e6284"
  },
  {
    "id": "575c54b3-b194-4338-930b-3f446da5044f",
    "title": "Serbia’s Vučić faces tough election as fraud fears mount",
    "date": "2026-10-23",
    "time": "06:00",
    "url": "https://www.ft.com/content/575c54b3-b194-4338-930b-3f446da5044f"
  },
  {
    "id": "9aa4549e-26f4-4963-94eb-50cf0fc0b8f9",
    "title": "How nervous are bond markets about France?",
    "date": "2026-10-23",
    "time": "06:00",
    "url": "https://www.ft.com/content/9aa4549e-26f4-4963-94eb-50cf0fc0b8f9"
  },
  {
    "id": "8948193b-438b-4d71-a0b1-31dff56fc308",
    "title": "Global tech sell-off sparks flight to safety",
    "date": "2026-10-23",
    "time": "05:42",
    "url": "https://www.ft.com/content/8948193b-438b-4d71-a0b1-31dff56fc308"
  },
  {
    "id": "5587abab-d5c8-480d-923d-b7b68afcb3f0",
    "title": "FirstFT: OpenAI trims valuation target to $1.25tn",
    "date": "2026-10-23",
    "time": "05:30",
    "url": "https://www.ft.com/content/5587abab-d5c8-480d-923d-b7b68afcb3f0"
  },
  {
    "id": "cea71497-6fdb-4e97-8661-6336bd77b347",
    "title": "Investing in Argentina",
    "date": "2026-10-23",
    "time": "05:03",
    "url": "https://www.ft.com/content/cea71497-6fdb-4e97-8661-6336bd77b347"
  },
  {
    "id": "51df7b68-927a-49a5-b596-3b867695b102",
    "title": "The dispute that blew up a $34bn deal",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/51df7b68-927a-49a5-b596-3b867695b102"
  },
  {
    "id": "ab922590-7f73-4a84-a3bd-a42cf80c92f7",
    "title": "Ukraine seeks to move customs checks inside EU to avoid Russian drones",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/ab922590-7f73-4a84-a3bd-a42cf80c92f7"
  },
  {
    "id": "70379a26-c20e-4501-aec9-a9a0089cdd3d",
    "title": "US is prepared for long stand-off with Iran, says Trump envoy",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/70379a26-c20e-4501-aec9-a9a0089cdd3d"
  },
  {
    "id": "e114059c-308d-4d8e-8127-f88b0faca879",
    "title": "How a transatlantic mega-merger fell apart over a leadership tug of war",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/e114059c-308d-4d8e-8127-f88b0faca879"
  },
  {
    "id": "6b7b5f61-3550-46ac-a032-4163164c0af0",
    "title": "Credit insurers cut cover on struggling UK housebuilder Crest Nicholson",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/6b7b5f61-3550-46ac-a032-4163164c0af0"
  },
  {
    "id": "b0d490eb-d136-4114-87d4-d7b013d9cb11",
    "title": "Rolls-Royce nears taxpayer subsidy deal to develop new engine in UK",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/b0d490eb-d136-4114-87d4-d7b013d9cb11"
  },
  {
    "id": "d66ab794-72e9-447b-b6f4-a633dd9fda91",
    "title": "Should UK banks be taxed more?",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/d66ab794-72e9-447b-b6f4-a633dd9fda91"
  },
  {
    "id": "bf959a1a-1cd8-41e2-8767-03aa1ac3ed48",
    "title": "Beware Bessent’s tilt towards short-term debt",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/bf959a1a-1cd8-41e2-8767-03aa1ac3ed48"
  },
  {
    "id": "57e5b584-78b8-49a5-be2b-c02bba63886a",
    "title": "Europe’s largest landlord exposed to €8bn hit from Berlin apartment plans",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/57e5b584-78b8-49a5-be2b-c02bba63886a"
  },
  {
    "id": "e842173f-6f9f-4115-9e5f-a0f06f0df18d",
    "title": "US pension giant Calpers retreats from Big Tech as AI rally falters",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/e842173f-6f9f-4115-9e5f-a0f06f0df18d"
  },
  {
    "id": "f98be079-49af-45c8-9954-ea3bd774c585",
    "title": "AI oversight needs a different model to banking",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/f98be079-49af-45c8-9954-ea3bd774c585"
  },
  {
    "id": "0ce7d049-b264-47da-9aaa-08b33941585a",
    "title": "Caught between the US and China",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/0ce7d049-b264-47da-9aaa-08b33941585a"
  }
];
