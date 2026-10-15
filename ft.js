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
    id: "064f7a19-c495-4ba0-a5e5-a6c4bb764ddb",
    title: "Donald Trump cancels Pete Hegseth’s plan to livestream execution after backlash",
    date: "2026-10-15",
    time: "17:07",
    url: "https://www.ft.com/content/064f7a19-c495-4ba0-a5e5-a6c4bb764ddb"
  },
  {
    id: "086b7a80-acdd-48d2-bd5c-a04bad812264",
    title: "In AI-dominated markets, LatAm debt is a diversifier",
    date: "2026-10-15",
    time: "16:51",
    url: "https://www.ft.com/content/086b7a80-acdd-48d2-bd5c-a04bad812264"
  },
  {
    id: "37d24217-acd8-4f84-a298-4f1ccc359a27",
    title: "Mercuria adds first copper to US Project Vault stockpile",
    date: "2026-10-15",
    time: "16:43",
    url: "https://www.ft.com/content/37d24217-acd8-4f84-a298-4f1ccc359a27"
  },
  {
    id: "0a436452-c1a1-492a-b5be-92848ed5e6e7",
    title: "Former Everton bidder Josh Wander to plead guilty in US fraud case",
    date: "2026-10-15",
    time: "16:33",
    url: "https://www.ft.com/content/0a436452-c1a1-492a-b5be-92848ed5e6e7"
  },
  {
    id: "678bcd31-6c2a-447b-a68c-ce6dec220bbc",
    title: "Investors dump data centre bonds as AI borrowers face ‘Darwin moment’",
    date: "2026-10-15",
    time: "16:25",
    url: "https://www.ft.com/content/678bcd31-6c2a-447b-a68c-ce6dec220bbc"
  },
  {
    id: "0be97035-3854-4b6c-8191-98f486862b02",
    title: "Saudi events delayed after Houthi attacks",
    date: "2026-10-15",
    time: "16:04",
    url: "https://www.ft.com/content/0be97035-3854-4b6c-8191-98f486862b02"
  },
  {
    id: "cf5f1209-da29-4ce1-b425-0e83818bf9ec",
    title: "Treasuries rally as investors seek shelter from AI turbulence",
    date: "2026-10-15",
    time: "15:56",
    url: "https://www.ft.com/content/cf5f1209-da29-4ce1-b425-0e83818bf9ec"
  },
  {
    id: "33aca8da-f22c-41e5-8255-289ae7d58ee7",
    title: "Monte dei Paschi should try the ‘just say maybe’ bid defence",
    date: "2026-10-15",
    time: "15:23",
    url: "https://www.ft.com/content/33aca8da-f22c-41e5-8255-289ae7d58ee7"
  },
  {
    id: "15d18ed4-543d-4004-ae38-f429a118daab",
    title: "Anglo American chief says tech giants show ‘deep interest’ in mining stakes",
    date: "2026-10-15",
    time: "15:19",
    url: "https://www.ft.com/content/15d18ed4-543d-4004-ae38-f429a118daab"
  },
  {
    id: "cbfd494d-cc11-4162-8618-77cc2caa806b",
    title: "Thames Water’s senior creditors near deal with rivals to avoid court challenge",
    date: "2026-10-15",
    time: "15:16",
    url: "https://www.ft.com/content/cbfd494d-cc11-4162-8618-77cc2caa806b"
  },
  {
    id: "f8e99974-9f18-4141-ac4a-1f072b7ebb24",
    title: "France and Germany to allow UK to join EU car policy if it aligns on China tariffs",
    date: "2026-10-15",
    time: "15:10",
    url: "https://www.ft.com/content/f8e99974-9f18-4141-ac4a-1f072b7ebb24"
  },
  {
    id: "d3a07d72-0f99-40b6-a1ad-97ecc91af81f",
    title: "The future energy mix",
    date: "2026-10-15",
    time: "14:31",
    url: "https://www.ft.com/content/d3a07d72-0f99-40b6-a1ad-97ecc91af81f"
  },
  {
    id: "1ca17b0c-24f3-4c54-94b9-0b0526941efe",
    title: "Private equity interest endangers London float of former DS Smith business",
    date: "2026-10-15",
    time: "14:13",
    url: "https://www.ft.com/content/1ca17b0c-24f3-4c54-94b9-0b0526941efe"
  },
  {
    id: "43c9d38a-652a-45df-b3be-c3dead3390f1",
    title: "Credit Suisse secured $800mn from insurers in Greensill settlement",
    date: "2026-10-15",
    time: "14:00",
    url: "https://www.ft.com/content/43c9d38a-652a-45df-b3be-c3dead3390f1"
  },
  {
    id: "f344bdb0-7bc9-43ab-804e-88990d59091e",
    title: "Rising inflation piles pressure on US voters ahead of midterm elections",
    date: "2026-10-15",
    time: "14:00",
    url: "https://www.ft.com/content/f344bdb0-7bc9-43ab-804e-88990d59091e"
  },
  {
    id: "c8721dd3-6744-4849-960f-6654cef1e80b",
    title: "Labour to end power-sharing with Green councils that back ‘Zionism is Racism’",
    date: "2026-10-15",
    time: "13:43",
    url: "https://www.ft.com/content/c8721dd3-6744-4849-960f-6654cef1e80b"
  },
  {
    id: "246e950b-e1e5-4f12-af78-4a13433f3977",
    title: "John Healey promises to ‘stay the path’ on reducing UK deficit",
    date: "2026-10-15",
    time: "13:42",
    url: "https://www.ft.com/content/246e950b-e1e5-4f12-af78-4a13433f3977"
  },
  {
    id: "f0975e34-5d18-4840-ae09-b998dd35d09e",
    title: "Russia suspected of striking two tankers in Nato waters",
    date: "2026-10-15",
    time: "13:41",
    url: "https://www.ft.com/content/f0975e34-5d18-4840-ae09-b998dd35d09e"
  },
  {
    id: "7604138c-a7c0-485c-b5ac-d86b16590276",
    title: "Calls to scrap employer national insurance for under-25s rejected",
    date: "2026-10-15",
    time: "13:20",
    url: "https://www.ft.com/content/7604138c-a7c0-485c-b5ac-d86b16590276"
  },
  {
    id: "0a39fcdb-860c-4739-8454-21fb429f6336",
    title: "Who’s winning the trade war with China? You asked, we answered",
    date: "2026-10-15",
    time: "13:00",
    url: "https://www.ft.com/content/0a39fcdb-860c-4739-8454-21fb429f6336"
  },
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
  }
];
