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
    id: "f4463a28-832d-4a2d-acc5-d83e258610cb",
    title: "Alphaville’s Nobel Prize for Economics live blog",
    date: "2026-10-12",
    time: "10:09",
    url: "https://www.ft.com/content/f4463a28-832d-4a2d-acc5-d83e258610cb"
  },
  {
    id: "ad0b6e93-708c-46c6-a1f2-e6248c934faf",
    title: "Riyadh defiant as Houthis launch new  missile strikes on Saudi Arabia",
    date: "2026-10-12",
    time: "09:45",
    url: "https://www.ft.com/content/ad0b6e93-708c-46c6-a1f2-e6248c934faf"
  },
  {
    id: "c9eea573-6d36-467e-b7f4-90c1d957cb33",
    title: "Andy Burnham’s own goal",
    date: "2026-10-12",
    time: "09:30",
    url: "https://www.ft.com/content/c9eea573-6d36-467e-b7f4-90c1d957cb33"
  },
  {
    id: "3e94e815-95b9-4e8d-9219-c9066cec08f6",
    title: "And the FTAV charts quiz winner is . . .",
    date: "2026-10-12",
    time: "09:01",
    url: "https://www.ft.com/content/3e94e815-95b9-4e8d-9219-c9066cec08f6"
  },
  {
    id: "011a7926-402e-4baa-90ba-bab4a44a74de",
    title: "Andy Burnham to tell MPs that refusing closer EU ties a ‘dereliction of duty’",
    date: "2026-10-12",
    time: "08:52",
    url: "https://www.ft.com/content/011a7926-402e-4baa-90ba-bab4a44a74de"
  },
  {
    id: "7e48dd50-957c-4f45-ad24-ce628ca7e06a",
    title: "EU ‘safeguards’ hybrid car sector from Chinese imports under new deal",
    date: "2026-10-12",
    time: "08:20",
    url: "https://www.ft.com/content/7e48dd50-957c-4f45-ad24-ce628ca7e06a"
  },
  {
    id: "a663781e-2709-41f2-99df-4fb5a6162e6b",
    title: "Oil prices volatile after Trump claims ‘energy ceasefire’ in Ukraine war",
    date: "2026-10-12",
    time: "07:47",
    url: "https://www.ft.com/content/a663781e-2709-41f2-99df-4fb5a6162e6b"
  },
  {
    id: "68fd8c4f-6f34-4f6e-a52c-76f635164031",
    title: "US threatens to block arms for Ukraine over attacks on Russian refineries",
    date: "2026-10-12",
    time: "07:42",
    url: "https://www.ft.com/content/68fd8c4f-6f34-4f6e-a52c-76f635164031"
  },
  {
    id: "2aa849df-5670-4577-87dd-2c40f2bac2aa",
    title: "Is the US economy as narrow as its stock market?",
    date: "2026-10-12",
    time: "06:30",
    url: "https://www.ft.com/content/2aa849df-5670-4577-87dd-2c40f2bac2aa"
  },
  {
    id: "b01366df-466d-44ee-91c6-1c71932da89e",
    title: "FTAV’s further read",
    date: "2026-10-12",
    time: "06:30",
    url: "https://www.ft.com/content/b01366df-466d-44ee-91c6-1c71932da89e"
  },
  {
    id: "b5faacca-4561-4e9d-bec5-c8ef843b0419",
    title: "EU budget battle intensifies ahead of leaders’ summit",
    date: "2026-10-12",
    time: "06:00",
    url: "https://www.ft.com/content/b5faacca-4561-4e9d-bec5-c8ef843b0419"
  },
  {
    id: "97a2c4ae-79df-4e67-a408-91a07bfc2546",
    title: "Misery, thy name is pulled IPO",
    date: "2026-10-12",
    time: "06:00",
    url: "https://www.ft.com/content/97a2c4ae-79df-4e67-a408-91a07bfc2546"
  },
  {
    id: "d3a342a9-0b64-4dd3-8f12-54c6750509de",
    title: "Wall Street’s great money spinner",
    date: "2026-10-12",
    time: "06:00",
    url: "https://www.ft.com/content/d3a342a9-0b64-4dd3-8f12-54c6750509de"
  },
  {
    id: "7dc561ba-a386-479d-9633-9209b76b1812",
    title: "FirstFT: US threatens to cut arms support for Ukraine over Russian refinery strikes",
    date: "2026-10-12",
    time: "05:33",
    url: "https://www.ft.com/content/7dc561ba-a386-479d-9633-9209b76b1812"
  },
  {
    id: "62bab2c8-d4e2-4ec2-a911-80439f61f238",
    title: "Trump battles to save the Senate",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/62bab2c8-d4e2-4ec2-a911-80439f61f238"
  },
  {
    id: "b0acd823-ca55-481c-93de-0e292a401b37",
    title: "Heathrow needs Burnham green light for runway by end of year, warns boss",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/b0acd823-ca55-481c-93de-0e292a401b37"
  },
  {
    id: "ba28b7cd-293e-4eee-a073-ad81aaefced3",
    title: "UK ministers explore compulsory AI safety reporting",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/ba28b7cd-293e-4eee-a073-ad81aaefced3"
  },
  {
    id: "50bb9758-abf7-43a4-bd8b-0c1e5895b4c2",
    title: "Wall Street’s record-breaking trading streak set to cool",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/50bb9758-abf7-43a4-bd8b-0c1e5895b4c2"
  },
  {
    id: "0c5a10f4-5aca-456e-9c3a-4c4dc8132a63",
    title: "Nato should prepare for deadly Russian ‘hybrid’ attack, says Poland",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/0c5a10f4-5aca-456e-9c3a-4c4dc8132a63"
  },
  {
    id: "e0457dd5-8e75-4803-8ce8-6651157d2229",
    title: "‘Worrying omens’ stalk global economy despite resilient growth",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/e0457dd5-8e75-4803-8ce8-6651157d2229"
  },
  {
    id: "e6c9d380-7108-405a-8393-5240771809fe",
    title: "There is a smarter way to tax the rich",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/e6c9d380-7108-405a-8393-5240771809fe"
  },
  {
    id: "1d85912b-7a70-4ba1-87df-3b683adee91e",
    title: "Houthis attack Riyadh airport",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/1d85912b-7a70-4ba1-87df-3b683adee91e"
  },
  {
    id: "4886bddc-0554-450c-9459-d67200c57cc4",
    title: "How the Man City cheating scandal laid a geopolitical minefield",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/4886bddc-0554-450c-9459-d67200c57cc4"
  },
  {
    id: "17a207f4-1563-48af-91e3-14bac89ab4b8",
    title: "The huge lurking leverage of AI hyperscalers",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/17a207f4-1563-48af-91e3-14bac89ab4b8"
  },
  {
    id: "6235bf20-80da-42c0-b9cc-e4d996d6c135",
    title: "CVC planned to hush Israel defence deal to avoid controversy",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/6235bf20-80da-42c0-b9cc-e4d996d6c135"
  },
  {
    id: "b00db29e-4334-4e04-8f09-a140aafd4b05",
    title: "Andy Burnham to step up UK business outreach amid fears of Budget tax rises",
    date: "2026-10-12",
    time: "00:01",
    url: "https://www.ft.com/content/b00db29e-4334-4e04-8f09-a140aafd4b05"
  },
  {
    id: "47b02f06-cbfc-49cb-afb8-1ae015399c4e",
    title: "City of London hits out at Andy Burnham’s plan to scrap non-compete clauses",
    date: "2026-10-12",
    time: "00:01",
    url: "https://www.ft.com/content/47b02f06-cbfc-49cb-afb8-1ae015399c4e"
  },
  {
    id: "dcdc4427-2104-4b6f-91e5-af9d13bb49a1",
    title: "How to pay for social care",
    date: "2026-10-12",
    time: "00:01",
    url: "https://www.ft.com/content/dcdc4427-2104-4b6f-91e5-af9d13bb49a1"
  },
  {
    id: "619800ae-b2f2-46e3-b34e-23f0525637da",
    title: "Healey’s Budget will be ‘fiction’ without plan for £35bn hole in spending, IFS warns",
    date: "2026-10-12",
    time: "00:01",
    url: "https://www.ft.com/content/619800ae-b2f2-46e3-b34e-23f0525637da"
  },
  {
    id: "debf0be6-d5aa-4ba7-bb66-7daf770d99ff",
    title: "Trump faces Republican opposition to his diesel deal with Russia’s Putin",
    date: "2026-10-11",
    time: "22:17",
    url: "https://www.ft.com/content/debf0be6-d5aa-4ba7-bb66-7daf770d99ff"
  },
  {
    id: "655af6f3-552f-4f51-aa52-02168cdae4fa",
    title: "Raphaël Glucksmann wins nomination for France’s centre-left",
    date: "2026-10-11",
    time: "21:50",
    url: "https://www.ft.com/content/655af6f3-552f-4f51-aa52-02168cdae4fa"
  },
  {
    id: "f9b9f937-97b0-4a03-90f6-05d7c7344ab9",
    title: "US hits commercial tanker in Gulf of Oman as tensions flare",
    date: "2026-10-11",
    time: "20:53",
    url: "https://www.ft.com/content/f9b9f937-97b0-4a03-90f6-05d7c7344ab9"
  },
  {
    id: "258611cc-d4ec-40f7-9d3e-930991725837",
    title: "VW chief calls for France and Germany to co-operate on China car fightback",
    date: "2026-10-11",
    time: "19:09",
    url: "https://www.ft.com/content/258611cc-d4ec-40f7-9d3e-930991725837"
  },
  {
    id: "4fcbf57e-c73e-4ced-be4a-5ecc6f4874de",
    title: "Russia ‘interfered’ in 2016 Brexit vote, says Andy Burnham",
    date: "2026-10-11",
    time: "19:01",
    url: "https://www.ft.com/content/4fcbf57e-c73e-4ced-be4a-5ecc6f4874de"
  },
  {
    id: "5b90cdd3-b78b-44ee-8045-8a0602ac0ef4",
    title: "IMF and World Bank to warn central bankers of a gathering storm",
    date: "2026-10-11",
    time: "18:15",
    url: "https://www.ft.com/content/5b90cdd3-b78b-44ee-8045-8a0602ac0ef4"
  },
  {
    id: "445b2856-a276-4d4c-bdea-44799d771c21",
    title: "Can Russia meet Trump’s diesel demands?",
    date: "2026-10-11",
    time: "18:13",
    url: "https://www.ft.com/content/445b2856-a276-4d4c-bdea-44799d771c21"
  },
  {
    id: "a01776ea-4a12-4195-8820-e43a885ba5fe",
    title: "Oil chiefs pull out of Riyadh energy congress after airport missile strike",
    date: "2026-10-11",
    time: "17:56",
    url: "https://www.ft.com/content/a01776ea-4a12-4195-8820-e43a885ba5fe"
  },
  {
    id: "724ef0e2-4d50-49fd-aef8-abc0534f2f84",
    title: "Ukraine’s allies vow to pressure Moscow as Trump claims ‘energy ceasefire’ in place",
    date: "2026-10-11",
    time: "16:46",
    url: "https://www.ft.com/content/724ef0e2-4d50-49fd-aef8-abc0534f2f84"
  },
  {
    id: "dddba87c-3ed9-4cb5-8fe2-1b1dcc71da6f",
    title: "Democrats need a foreign policy",
    date: "2026-10-11",
    time: "16:13",
    url: "https://www.ft.com/content/dddba87c-3ed9-4cb5-8fe2-1b1dcc71da6f"
  },
  {
    id: "71dccbca-4a1f-485a-9790-28cc527cdb82",
    title: "US affordability tracker: the data that could decide the 2026 midterm elections",
    date: "2026-10-11",
    time: "14:39",
    url: "https://www.ft.com/content/71dccbca-4a1f-485a-9790-28cc527cdb82"
  }
];
