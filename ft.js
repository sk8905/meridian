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
    id: "cf5f1209-da29-4ce1-b425-0e83818bf9ec",
    title: "Global AI sell-off deepens as Asian markets tumble",
    date: "2026-10-15",
    time: "05:04",
    url: "https://www.ft.com/content/cf5f1209-da29-4ce1-b425-0e83818bf9ec"
  },
  {
    id: "9632f1f7-713f-43ab-ad42-d9e876b975e9",
    title: "The UK’s Fastest-Growing Companies",
    date: "2026-10-15",
    time: "05:02",
    url: "https://www.ft.com/content/9632f1f7-713f-43ab-ad42-d9e876b975e9"
  },
  {
    id: "d9353431-e9ba-4b34-a277-ab1510120ef8",
    title: "General Atlantic’s IPO ambitions",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/d9353431-e9ba-4b34-a277-ab1510120ef8"
  },
  {
    id: "bbb1d399-e91c-4600-9882-ea93e1f96ac9",
    title: "London’s gold market enjoys the Trump effect",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/bbb1d399-e91c-4600-9882-ea93e1f96ac9"
  },
  {
    id: "43c9d38a-652a-45df-b3be-c3dead3390f1",
    title: "Marsh to shoulder biggest chunk of Greensill settlement with Credit Suisse",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/43c9d38a-652a-45df-b3be-c3dead3390f1"
  },
  {
    id: "7761de04-7fac-4f7b-bddb-8457e425b642",
    title: "Investors predict new record price for gold within two years",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/7761de04-7fac-4f7b-bddb-8457e425b642"
  },
  {
    id: "c84ce6a3-5724-4b98-a93a-c035d607d90f",
    title: "Minister promises UK private pension proposals by spring",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/c84ce6a3-5724-4b98-a93a-c035d607d90f"
  },
  {
    id: "3a9364ec-6930-4877-a1a2-c053dd689760",
    title: "FCA plans to embrace AI to automate financial regulation",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/3a9364ec-6930-4877-a1a2-c053dd689760"
  },
  {
    id: "4d79b52f-1f0d-4739-82ab-7ecfb4251326",
    title: "Ukraine to resume strikes on Russian refineries, Zelenskyy says",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/4d79b52f-1f0d-4739-82ab-7ecfb4251326"
  },
  {
    id: "26db5bb2-9d81-4c62-aeac-c0dfef4c79e6",
    title: "How AI mega-rounds make life harder for VC firms",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/26db5bb2-9d81-4c62-aeac-c0dfef4c79e6"
  },
  {
    id: "ed713df4-92b3-45bc-9cf4-bb5c9ea72673",
    title: "Inheritance tax toll is mounting on UK family companies",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/ed713df4-92b3-45bc-9cf4-bb5c9ea72673"
  },
  {
    id: "9d70cd3f-abd3-4e40-b644-156444cec446",
    title: "Oil majors face $32bn dilemma over Iran war windfall",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/9d70cd3f-abd3-4e40-b644-156444cec446"
  },
  {
    id: "69bfdf93-cbba-477c-9fb0-5978d1d4f506",
    title: "French debt worries spill into stocks, driving biggest underperformance since 2010",
    date: "2026-10-15",
    time: "05:00",
    url: "https://www.ft.com/content/69bfdf93-cbba-477c-9fb0-5978d1d4f506"
  },
  {
    id: "18b65495-9e2a-45d6-be85-7641442ab61a",
    title: "OpenAI claims employee sent secret device information to Apple",
    date: "2026-10-14",
    time: "21:07",
    url: "https://www.ft.com/content/18b65495-9e2a-45d6-be85-7641442ab61a"
  },
  {
    id: "c1e4c8b1-8fe0-414d-b52f-c74a6d927b3d",
    title: "US inflation jumps to 3.7% as Iran war drives up prices",
    date: "2026-10-14",
    time: "21:06",
    url: "https://www.ft.com/content/c1e4c8b1-8fe0-414d-b52f-c74a6d927b3d"
  },
  {
    id: "fb258413-e88d-47fe-98c8-f645adaea1e1",
    title: "US chip stocks slide as inflation and AI debt fears unsettle investors",
    date: "2026-10-14",
    time: "21:01",
    url: "https://www.ft.com/content/fb258413-e88d-47fe-98c8-f645adaea1e1"
  },
  {
    id: "dadac221-a4dd-4935-897e-7f7faebe8f17",
    title: "Perella Weinberg and Piper Sandler abandon merger talks",
    date: "2026-10-14",
    time: "20:35",
    url: "https://www.ft.com/content/dadac221-a4dd-4935-897e-7f7faebe8f17"
  },
  {
    id: "a3621421-bee4-4e96-a5f2-28fa545e6397",
    title: "Ministers to launch probe of English mayoral authority led by Ben Houchen",
    date: "2026-10-14",
    time: "20:35",
    url: "https://www.ft.com/content/a3621421-bee4-4e96-a5f2-28fa545e6397"
  },
  {
    id: "9209fd59-386b-4399-a870-0a3451548251",
    title: "Sally Rooney withdraws books from UK sale over support for Palestine Action",
    date: "2026-10-14",
    time: "19:37",
    url: "https://www.ft.com/content/9209fd59-386b-4399-a870-0a3451548251"
  },
  {
    id: "3f821be4-f137-4cc9-b0b0-b2014f2607c2",
    title: "Berkshire Hathaway adds $330mn to stake in tech group Bending Spoons",
    date: "2026-10-14",
    time: "18:58",
    url: "https://www.ft.com/content/3f821be4-f137-4cc9-b0b0-b2014f2607c2"
  },
  {
    id: "16ceb1fb-662c-4379-8187-0a51a7f4106f",
    title: "Burnham wants to ‘repair bridges’ between Trump and Zelenskyy",
    date: "2026-10-14",
    time: "18:23",
    url: "https://www.ft.com/content/16ceb1fb-662c-4379-8187-0a51a7f4106f"
  },
  {
    id: "badcd536-6e53-4968-8fea-914ffc3d8d0c",
    title: "Palantir drops legal case against Sadiq Khan over cancelled £50mn contract",
    date: "2026-10-14",
    time: "17:35",
    url: "https://www.ft.com/content/badcd536-6e53-4968-8fea-914ffc3d8d0c"
  },
  {
    id: "9f3713fb-6b0a-41f8-8ccc-b23f2395740e",
    title: "Healey’s Budget is a moment he must not miss",
    date: "2026-10-14",
    time: "17:31",
    url: "https://www.ft.com/content/9f3713fb-6b0a-41f8-8ccc-b23f2395740e"
  },
  {
    id: "64f058ff-c8c2-4e63-bf7f-57c08ce685cb",
    title: "Freshfields partners explore carve-out of AI unit worth ‘billions’, leaked emails reveal",
    date: "2026-10-14",
    time: "16:48",
    url: "https://www.ft.com/content/64f058ff-c8c2-4e63-bf7f-57c08ce685cb"
  },
  {
    id: "9acc4f6f-2faa-4ac1-aa7b-42166d677316",
    title: "Transcription: Marine Le Pen en entretien avec le Financial Times",
    date: "2026-10-14",
    time: "16:35",
    url: "https://www.ft.com/content/9acc4f6f-2faa-4ac1-aa7b-42166d677316"
  },
  {
    id: "5f1b2f31-2067-4c3a-8093-54210a7c0e72",
    title: "Netflix to cut 1,000 jobs as growth concerns mount",
    date: "2026-10-14",
    time: "15:57",
    url: "https://www.ft.com/content/5f1b2f31-2067-4c3a-8093-54210a7c0e72"
  },
  {
    id: "b71e0dc4-b190-49ec-b000-bd585054ddc8",
    title: "He linked Saudi Arabia to Silicon Valley. Then OpenAI found a bug wrapped in toilet paper",
    date: "2026-10-14",
    time: "15:40",
    url: "https://www.ft.com/content/b71e0dc4-b190-49ec-b000-bd585054ddc8"
  },
  {
    id: "d9aaf82c-1975-4f07-99b1-f3b858b4dc7c",
    title: "Burnham rules out coalition with Greens while ‘Zionism is Racism’ policy remains",
    date: "2026-10-14",
    time: "15:39",
    url: "https://www.ft.com/content/d9aaf82c-1975-4f07-99b1-f3b858b4dc7c"
  },
  {
    id: "13929c26-1c01-41b2-b81a-d337fa5c9d27",
    title: "US grocery prices poised to climb as soaring fuel costs drive inflation",
    date: "2026-10-14",
    time: "15:14",
    url: "https://www.ft.com/content/13929c26-1c01-41b2-b81a-d337fa5c9d27"
  },
  {
    id: "3c23e59b-f4c9-4837-b534-ec19fb77a0c8",
    title: "Unshackle workers from non-compete clauses",
    date: "2026-10-14",
    time: "15:04",
    url: "https://www.ft.com/content/3c23e59b-f4c9-4837-b534-ec19fb77a0c8"
  },
  {
    id: "9af2b0d0-e31f-46e8-9041-36b37a9cd3ba",
    title: "This is an era of Davids, not Goliaths",
    date: "2026-10-14",
    time: "14:52",
    url: "https://www.ft.com/content/9af2b0d0-e31f-46e8-9041-36b37a9cd3ba"
  },
  {
    id: "a82b4275-6519-4142-b1df-e74c66ead877",
    title: "Bank of America profits drop 17% after $1.2bn money laundering fine",
    date: "2026-10-14",
    time: "14:39",
    url: "https://www.ft.com/content/a82b4275-6519-4142-b1df-e74c66ead877"
  },
  {
    id: "8c3c631c-e37f-4209-aefd-112c4c58020c",
    title: "German prosecutors accuse Ukraine of Nord Stream sabotage",
    date: "2026-10-14",
    time: "14:39",
    url: "https://www.ft.com/content/8c3c631c-e37f-4209-aefd-112c4c58020c"
  },
  {
    id: "a25417b3-d4e4-4b89-b14d-6370a85ce3c4",
    title: "Houthis attack Saudi Aramco headquarters",
    date: "2026-10-14",
    time: "14:25",
    url: "https://www.ft.com/content/a25417b3-d4e4-4b89-b14d-6370a85ce3c4"
  },
  {
    id: "6934f481-b61c-4ab0-8064-a79493702f2c",
    title: "Hot September CPI inflation keeps Fed on course for further tightening",
    date: "2026-10-14",
    time: "14:21",
    url: "https://www.ft.com/content/6934f481-b61c-4ab0-8064-a79493702f2c"
  },
  {
    id: "60a8f4e6-5da4-4f59-b009-baed53215497",
    title: "Lufthansa wins battle to buy stake in Portugal’s TAP airline",
    date: "2026-10-14",
    time: "14:16",
    url: "https://www.ft.com/content/60a8f4e6-5da4-4f59-b009-baed53215497"
  },
  {
    id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2",
    title: "Inflation and interest rates tracker: see how your country compares",
    date: "2026-10-14",
    time: "14:15",
    url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2"
  },
  {
    id: "b06d00da-9df7-405b-9410-b5485c267397",
    title: "Global diesel prices set to rise again, warns IEA",
    date: "2026-10-14",
    time: "13:25",
    url: "https://www.ft.com/content/b06d00da-9df7-405b-9410-b5485c267397"
  },
  {
    id: "7addd5d0-11d6-4706-bf0b-995084ef7bb6",
    title: "It’s been a bad year for turning lawsuits into earnings",
    date: "2026-10-14",
    time: "13:00",
    url: "https://www.ft.com/content/7addd5d0-11d6-4706-bf0b-995084ef7bb6"
  },
  {
    id: "c5fb2ea9-9a41-416a-90b8-337936ec4971",
    title: "Europe’s defence stocks send a geopolitical distress signal",
    date: "2026-10-14",
    time: "12:59",
    url: "https://www.ft.com/content/c5fb2ea9-9a41-416a-90b8-337936ec4971"
  }
];
