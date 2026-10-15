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
    id: "fb2110b4-50d2-4ff9-9886-f7b42c5b4579",
    title: "EU leaders to urge Zelenskyy to rein in criticism of Trump",
    date: "2026-10-15",
    time: "11:05",
    url: "https://www.ft.com/content/fb2110b4-50d2-4ff9-9886-f7b42c5b4579"
  },
  {
    id: "317796f3-af18-4acb-a482-ec0bdd0edf45",
    title: "Reform UK councillors and candidates filmed making racist remarks",
    date: "2026-10-15",
    time: "11:02",
    url: "https://www.ft.com/content/317796f3-af18-4acb-a482-ec0bdd0edf45"
  },
  {
    id: "825b0ed4-060e-49dd-8199-b6accc393ff1",
    title: "Macroeconomic policy must now do many things at once",
    date: "2026-10-15",
    time: "11:00",
    url: "https://www.ft.com/content/825b0ed4-060e-49dd-8199-b6accc393ff1"
  },
  {
    id: "481f7865-b6bb-40b8-9ee2-7554f6914007",
    title: "Republicans fund midterms ad blitz as Democrats gain in polls",
    date: "2026-10-15",
    time: "11:00",
    url: "https://www.ft.com/content/481f7865-b6bb-40b8-9ee2-7554f6914007"
  },
  {
    id: "c8511d8c-4889-4b38-bcce-f31044ef5b30",
    title: "FirstFT: Ukraine to resume strikes on Russian refineries, Zelenskyy says",
    date: "2026-10-15",
    time: "10:57",
    url: "https://www.ft.com/content/c8511d8c-4889-4b38-bcce-f31044ef5b30"
  },
  {
    id: "0a39fcdb-860c-4739-8454-21fb429f6336",
    title: "Submit your questions: Who’s winning the trade war with China — the EU or US?",
    date: "2026-10-15",
    time: "10:37",
    url: "https://www.ft.com/content/0a39fcdb-860c-4739-8454-21fb429f6336"
  },
  {
    id: "246e950b-e1e5-4f12-af78-4a13433f3977",
    title: "John Healey promises to ‘stay the path’ on reducing UK deficit",
    date: "2026-10-15",
    time: "10:36",
    url: "https://www.ft.com/content/246e950b-e1e5-4f12-af78-4a13433f3977"
  },
  {
    id: "72506712-3b5d-4a46-986e-6b06beb06b04",
    title: "Norway’s $2.3tn oil fund urged to relax nuclear weapons ban",
    date: "2026-10-15",
    time: "10:30",
    url: "https://www.ft.com/content/72506712-3b5d-4a46-986e-6b06beb06b04"
  },
  {
    id: "54353d3a-afed-4fec-985a-50f3dfb9be8e",
    title: "US floats unfreezing some Russian assets to restart Ukraine peace talks",
    date: "2026-10-15",
    time: "10:19",
    url: "https://www.ft.com/content/54353d3a-afed-4fec-985a-50f3dfb9be8e"
  },
  {
    id: "8171ef4a-b291-4375-bc85-87bee0f8bf7b",
    title: "CoreWeave better hurry up figuring out how to tap insurers for cash",
    date: "2026-10-15",
    time: "10:17",
    url: "https://www.ft.com/content/8171ef4a-b291-4375-bc85-87bee0f8bf7b"
  },
  {
    id: "46708b2a-0392-43f9-b378-de7117febd16",
    title: "UK economy defies contraction fears to grow 0.1% in August",
    date: "2026-10-15",
    time: "09:34",
    url: "https://www.ft.com/content/46708b2a-0392-43f9-b378-de7117febd16"
  },
  {
    id: "179f6911-cf9b-4fea-98e4-f635e8e8c563",
    title: "EQT to acquire US real estate group Stockbridge",
    date: "2026-10-15",
    time: "08:27",
    url: "https://www.ft.com/content/179f6911-cf9b-4fea-98e4-f635e8e8c563"
  },
  {
    id: "bbffeec4-c491-45a3-8df9-7339ddb020e3",
    title: "India approves biggest foreign takeover of domestic bank",
    date: "2026-10-15",
    time: "08:19",
    url: "https://www.ft.com/content/bbffeec4-c491-45a3-8df9-7339ddb020e3"
  },
  {
    id: "c9ddcef8-a149-4273-a883-d6b33ef53bfa",
    title: "FTAV’s further reading",
    date: "2026-10-15",
    time: "07:30",
    url: "https://www.ft.com/content/c9ddcef8-a149-4273-a883-d6b33ef53bfa"
  },
  {
    id: "789307ae-5109-465c-9b79-7ce71308f0d2",
    title: "CPI comes in hot, AI goes cold",
    date: "2026-10-15",
    time: "06:30",
    url: "https://www.ft.com/content/789307ae-5109-465c-9b79-7ce71308f0d2"
  },
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
  }
];
