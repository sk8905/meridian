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
    id: "d36aa5b9-d770-4800-ba76-70bfbb62f4a7",
    title: "Trump’s coal drive plays into Beijing’s hands",
    date: "2026-09-30",
    time: "12:00",
    url: "https://www.ft.com/content/d36aa5b9-d770-4800-ba76-70bfbb62f4a7",
  },
  {
    id: "3b926f6b-d9a4-4252-90da-5a336a5276e7",
    title: "At least Burnham doesn’t pretend to care about growth",
    date: "2026-09-30",
    time: "11:35",
    url: "https://www.ft.com/content/3b926f6b-d9a4-4252-90da-5a336a5276e7",
  },
  {
    id: "5bb621fa-2c18-4384-80ab-4a72e51b139a",
    title: "Aliko Dangote’s $16bn oil refinery project paused by Kenyan court",
    date: "2026-09-30",
    time: "10:35",
    url: "https://www.ft.com/content/5bb621fa-2c18-4384-80ab-4a72e51b139a",
  },
  {
    id: "1c7bafaf-e7cd-47a8-9c69-150f4c04d4d2",
    title: "Andy Burnham’s courageous speech had one striking omission",
    date: "2026-09-30",
    time: "09:40",
    url: "https://www.ft.com/content/1c7bafaf-e7cd-47a8-9c69-150f4c04d4d2",
  },
  {
    id: "3b5b46d7-2dcf-40f0-82f3-65ab6e4be76b",
    title: "Ken Griffin donates $3bn to Carnegie Mellon as university plots Miami campus",
    date: "2026-09-30",
    time: "09:30",
    url: "https://www.ft.com/content/3b5b46d7-2dcf-40f0-82f3-65ab6e4be76b",
  },
  {
    id: "2a62022e-219b-4eb2-b5d7-c2bb01688acc",
    title: "Singapore’s Temasek to open first Middle East outposts",
    date: "2026-09-30",
    time: "09:00",
    url: "https://www.ft.com/content/2a62022e-219b-4eb2-b5d7-c2bb01688acc",
  },
  {
    id: "a07f7faf-7b49-4988-910f-5768f3214f71",
    title: "‘Big names in AI like Kyndryl’",
    date: "2026-09-30",
    time: "08:38",
    url: "https://www.ft.com/content/a07f7faf-7b49-4988-910f-5768f3214f71",
  },
  {
    id: "d740f13d-38bc-4460-bcd5-2922472fc209",
    title: "Andy Burnham says rejoining EU an option for the UK",
    date: "2026-09-30",
    time: "07:58",
    url: "https://www.ft.com/content/d740f13d-38bc-4460-bcd5-2922472fc209",
  },
  {
    id: "3c98053f-2a54-4352-8220-0d0269a00d14",
    title: "UK energy price cap forecast to rise to nearly £2,000 as Iran war drives up prices",
    date: "2026-09-30",
    time: "07:44",
    url: "https://www.ft.com/content/3c98053f-2a54-4352-8220-0d0269a00d14",
  },
  {
    id: "00d798b3-1579-4bc6-88bf-a1f99ba85a63",
    title: "UK economy grows faster than first estimated in second quarter",
    date: "2026-09-30",
    time: "07:18",
    url: "https://www.ft.com/content/00d798b3-1579-4bc6-88bf-a1f99ba85a63",
  },
  {
    id: "cd22d20a-3b65-4534-ac04-f5008810e10a",
    title: "Bond markets steady after sell-off",
    date: "2026-09-30",
    time: "06:43",
    url: "https://www.ft.com/content/cd22d20a-3b65-4534-ac04-f5008810e10a",
  },
  {
    id: "b17c3f84-518c-4838-a3ae-8474d23157b7",
    title: "Midterms and the market",
    date: "2026-09-30",
    time: "06:30",
    url: "https://www.ft.com/content/b17c3f84-518c-4838-a3ae-8474d23157b7",
  },
  {
    id: "77c71290-89c4-4ed5-8b05-2c1b22eff911",
    title: "FTAV’s further reading",
    date: "2026-09-30",
    time: "06:30",
    url: "https://www.ft.com/content/77c71290-89c4-4ed5-8b05-2c1b22eff911",
  },
  {
    id: "f7e67172-080e-4c03-9ab1-1b1f79719d63",
    title: "EU decarbonisation incentives do not add up, says US chemicals giant",
    date: "2026-09-30",
    time: "06:00",
    url: "https://www.ft.com/content/f7e67172-080e-4c03-9ab1-1b1f79719d63",
  },
  {
    id: "80c78c90-97b2-48db-84e0-26975f47305e",
    title: "Bank runs are almost always justified",
    date: "2026-09-30",
    time: "06:00",
    url: "https://www.ft.com/content/80c78c90-97b2-48db-84e0-26975f47305e",
  },
  {
    id: "59cdbba3-55b2-4853-90ab-ce94b36cebb0",
    title: "Political Fix from the Labour Party conference: Hope again?",
    date: "2026-09-30",
    time: "05:43",
    url: "https://www.ft.com/content/59cdbba3-55b2-4853-90ab-ce94b36cebb0",
  },
  {
    id: "49472d62-8f94-4bb9-9a3a-24017a3156ac",
    title: "Political Fix from the Labour Party conference: Hope again?",
    date: "2026-09-30",
    time: "05:40",
    url: "https://www.ft.com/content/49472d62-8f94-4bb9-9a3a-24017a3156ac",
  },
  {
    id: "f4d105d9-992a-44f9-89d8-d9a4648e30f1",
    title: "Night owls more likely to claim disability benefits",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/f4d105d9-992a-44f9-89d8-d9a4648e30f1",
  },
  {
    id: "9705f5bf-bc06-481d-b2a3-1299463074b8",
    title: "AI industry moves to thwart data centre backlash ahead of US midterms",
    date: "2026-09-30",
    time: "05:01",
    url: "https://www.ft.com/content/9705f5bf-bc06-481d-b2a3-1299463074b8",
  },
  {
    id: "ef6c9b07-0a02-4cb2-aa91-e486846e6ce0",
    title: "The crucial things Anthropic’s jumbo ‘risk factors’ won’t tell you",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/ef6c9b07-0a02-4cb2-aa91-e486846e6ce0",
  },
  {
    id: "a1202ae1-0324-4383-a082-4cc522a8fdbc",
    title: "Is the world really drowning in debt?",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/a1202ae1-0324-4383-a082-4cc522a8fdbc",
  },
  {
    id: "562f2988-0c04-4669-b0b7-2c16d3821926",
    title: "White House holds crunch talks on diesel export ban as midterms near",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/562f2988-0c04-4669-b0b7-2c16d3821926",
  },
  {
    id: "e9f2345f-6d7b-4fbb-831a-5fe576317701",
    title: "Social care shake-up without tax rises will force houses to be sold, Burnham warned",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/e9f2345f-6d7b-4fbb-831a-5fe576317701",
  },
  {
    id: "9dd08562-20f9-4646-b7e8-7c824edec2ec",
    title: "Is Anthropic losing its Oura?",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/9dd08562-20f9-4646-b7e8-7c824edec2ec",
  },
  {
    id: "52e59358-9ae5-4d13-a666-c5a9b1b184c9",
    title: "UK banks stick with coal financing, campaign report finds",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/52e59358-9ae5-4d13-a666-c5a9b1b184c9",
  },
  {
    id: "7f0d7725-b010-4af1-8fc5-56c88fe5ffc4",
    title: "Fintech Zilch taps banks for IPO next year",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/7f0d7725-b010-4af1-8fc5-56c88fe5ffc4",
  },
  {
    id: "9e374fbf-5bed-4452-8fa1-5f91ff4bd7bc",
    title: "EU can’t integrate markets if it dilutes supervision, watchdog warns",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/9e374fbf-5bed-4452-8fa1-5f91ff4bd7bc",
  },
  {
    id: "8c0d8f2a-5f81-4dac-b8f0-6b91328ba768",
    title: "Liberated by technology (again)",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/8c0d8f2a-5f81-4dac-b8f0-6b91328ba768",
  },
  {
    id: "f72004ae-3a17-459f-a14e-01840c90c6da",
    title: "Battery groups push to stick with post-Brexit rules on electric cars",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/f72004ae-3a17-459f-a14e-01840c90c6da",
  },
  {
    id: "7820a84f-338e-4b91-a9b6-241a9bf81539",
    title: "Vanguard warns France is ‘degrading credit’ as borrowing costs surge",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/7820a84f-338e-4b91-a9b6-241a9bf81539",
  },
  {
    id: "bba7bdf5-8a91-4587-85ef-5cc9911259d7",
    title: "Time for some DIY LDI",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/bba7bdf5-8a91-4587-85ef-5cc9911259d7",
  },
  {
    id: "bd049e24-ac4e-4315-b67c-7e3d18d541c2",
    title: "The risks of HSBC’s return to its roots",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/bd049e24-ac4e-4315-b67c-7e3d18d541c2",
  },
  {
    id: "873ed533-d6b0-4276-94c2-624eb69d306b",
    title: "How Nike fell off the pace in China",
    date: "2026-09-30",
    time: "05:00",
    url: "https://www.ft.com/content/873ed533-d6b0-4276-94c2-624eb69d306b",
  },
  {
    id: "cf59cc58-a757-496b-b6ce-8a061c978382",
    title: "The Lady Gaga moment for corporate Japan",
    date: "2026-09-30",
    time: "00:01",
    url: "https://www.ft.com/content/cf59cc58-a757-496b-b6ce-8a061c978382",
  },
  {
    id: "38edf5d4-31df-4250-a6b7-691b844b22e0",
    title: "FirstFT: Trump says AI bosses agreed to ‘self-regulation’ amid safety fears",
    date: "2026-09-29",
    time: "22:34",
    url: "https://www.ft.com/content/38edf5d4-31df-4250-a6b7-691b844b22e0",
  },
  {
    id: "364d5454-876d-42ef-8f30-759e1ebdb026",
    title: "Shell-led consortium backs $23bn expansion of LNG Canada project",
    date: "2026-09-29",
    time: "21:42",
    url: "https://www.ft.com/content/364d5454-876d-42ef-8f30-759e1ebdb026",
  },
  {
    id: "d2916f8b-c53b-4c64-a9f8-37807bf5383f",
    title: "Australia battles black market for cigarettes after decade of tax rises",
    date: "2026-09-29",
    time: "22:00",
    url: "https://www.ft.com/content/d2916f8b-c53b-4c64-a9f8-37807bf5383f",
  },
  {
    id: "1199468e-dbe5-4581-b039-3d57985291ac",
    title: "Pete Hegseth to slash top US officer roles by 20%",
    date: "2026-09-29",
    time: "21:56",
    url: "https://www.ft.com/content/1199468e-dbe5-4581-b039-3d57985291ac",
  },
  {
    id: "bd830daa-e4fe-4cd6-a145-40502652c0b2",
    title: "UK bosses left in dark by Burnham and Healey’s emphasis on ‘cost of business’",
    date: "2026-09-29",
    time: "21:38",
    url: "https://www.ft.com/content/bd830daa-e4fe-4cd6-a145-40502652c0b2",
  },
  {
    id: "264c7d6f-9f84-43b9-89de-f8e9523a41a5",
    title: "Trump administration can deport non-citizens to third countries for now",
    date: "2026-09-29",
    time: "21:06",
    url: "https://www.ft.com/content/264c7d6f-9f84-43b9-89de-f8e9523a41a5",
  },
];
