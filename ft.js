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
  { id: "69c573e0-9c24-451d-bb13-ae7a7c3104c0", title: "Impatient yacht owners make for a hot new asset class", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/69c573e0-9c24-451d-bb13-ae7a7c3104c0" },
  { id: "7dc75493-84e1-4b84-af2a-ef5375fd9736", title: "Career satisfaction in an uncertain world? Dream on", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/7dc75493-84e1-4b84-af2a-ef5375fd9736" },
  { id: "d45a8e1b-1d45-4a3d-a3d2-5a3ce15b0e9d", title: "The Bayeux Tapestry loan is a model for the Parthenon Marbles", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/d45a8e1b-1d45-4a3d-a3d2-5a3ce15b0e9d" },
  { id: "7aafc76c-c381-4381-a89c-e92c9db60671", title: "Andy Burnham failed to end rough sleeping as a mayor — can he succeed as prime minister?", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/7aafc76c-c381-4381-a89c-e92c9db60671" },
  { id: "560ff425-c1ac-4eef-b8da-e6cdb0a412a3", title: "UK state subsidies soar as post-Brexit grants boost energy projects", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/560ff425-c1ac-4eef-b8da-e6cdb0a412a3" },
  { id: "0a6249a2-e28b-4e58-ab2d-2b8615b832dc", title: "Turkey’s cyber law shifts sweeping powers to presidency", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/0a6249a2-e28b-4e58-ab2d-2b8615b832dc" },
  { id: "590e468a-1eb7-4d1b-a7a5-80541c3ff35a", title: "Hargreaves Lansdown orders staff back to office", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/590e468a-1eb7-4d1b-a7a5-80541c3ff35a" },
  { id: "0ac50644-398f-49ec-895d-a2494254dabd", title: "France faces budget showdown as presidential election looms", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/0ac50644-398f-49ec-895d-a2494254dabd" },
  { id: "297a8bf7-ce8b-44fe-bc51-3e2ec2e47699", title: "Investors return to European stocks as strong earnings lift Iran war gloom", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/297a8bf7-ce8b-44fe-bc51-3e2ec2e47699" },
  { id: "15c56de6-c884-4c7f-a91c-6d1aa59ce1c6", title: "China’s monthly inflation cools as impact from Iran war eases", date: "2026-08-09", time: "04:05", url: "https://www.ft.com/content/15c56de6-c884-4c7f-a91c-6d1aa59ce1c6" },
  { id: "ff321dc1-41d6-473d-b7e7-2a58224a18e7", title: "One of the world’s biggest coal producers battles to keep lights on", date: "2026-08-09", time: "03:05", url: "https://www.ft.com/content/ff321dc1-41d6-473d-b7e7-2a58224a18e7" },
  { id: "2be78a9f-1431-4519-b5c4-c4dd5026dd3c", title: "Deadly protests in Kashmir test Pakistan’s military rulers", date: "2026-08-09", time: "02:50", url: "https://www.ft.com/content/2be78a9f-1431-4519-b5c4-c4dd5026dd3c" },
  { id: "657249de-f5bd-4648-9a1c-77315cd5a1c9", title: "The bank behind China’s AI listings bonanza", date: "2026-08-09", time: "02:22", url: "https://www.ft.com/content/657249de-f5bd-4648-9a1c-77315cd5a1c9" },
  { id: "9a1ab09b-82d7-43c2-b44a-ebb41d352dab", title: "Tehran says US must ‘rectify its behaviour’ before Iran reopens strait", date: "2026-08-08", time: "17:20", url: "https://www.ft.com/content/9a1ab09b-82d7-43c2-b44a-ebb41d352dab" },
  { id: "e164e244-f6de-4e3b-8a67-6bebee1b7bf4", title: "Greg Abel finally puts Buffett’s cash pile to work", date: "2026-08-08", time: "16:36", url: "https://www.ft.com/content/e164e244-f6de-4e3b-8a67-6bebee1b7bf4" },
  { id: "4f1f4150-3e5b-4015-ad44-5f596e0287a5", title: "US Senate narrowly confirms Todd Blanche as US attorney-general", date: "2026-08-08", time: "15:24", url: "https://www.ft.com/content/4f1f4150-3e5b-4015-ad44-5f596e0287a5" },
  { id: "e1f2e2b9-6f52-44fc-a659-e981d2fc923e", title: "First Brands urges court to approve bankruptcy settlement", date: "2026-08-08", time: "12:21", url: "https://www.ft.com/content/e1f2e2b9-6f52-44fc-a659-e981d2fc923e" },
  { id: "352a15ac-53c4-46eb-b75e-957f0388dc79", title: "Landmark crypto bill stalls in US Senate despite $225mn spending push", date: "2026-08-08", time: "12:00", url: "https://www.ft.com/content/352a15ac-53c4-46eb-b75e-957f0388dc79" },
  { id: "a371dc43-0584-4fcc-b064-80596727d5b5", title: "Pfizer grapples with ‘a world of hurt’ after Covid triumph", date: "2026-08-08", time: "11:00", url: "https://www.ft.com/content/a371dc43-0584-4fcc-b064-80596727d5b5" },
  { id: "f3050d94-6b78-4cf2-8b07-cf8903aacc7f", title: "Spain reinstates border controls on Italy as tensions rise over migrants", date: "2026-08-08", time: "10:45", url: "https://www.ft.com/content/f3050d94-6b78-4cf2-8b07-cf8903aacc7f" },
  { id: "d2248ee9-edb5-445c-b89b-425e033a19fa", title: "Chart of the Week: Currency interventions have a mixed record", date: "2026-08-08", time: "10:30", url: "https://www.ft.com/content/d2248ee9-edb5-445c-b89b-425e033a19fa" },
  { id: "d92204d1-e13b-4e90-96b5-8fd2db7436f0", title: "Gianni Infantino’s fight for survival", date: "2026-08-08", time: "09:00", url: "https://www.ft.com/content/d92204d1-e13b-4e90-96b5-8fd2db7436f0" },
  { id: "798623be-8da1-490d-9494-11b3d5f58ac8", title: "Widdecombe murder probe reopens inquiry into attempted burglary at Farage’s house", date: "2026-08-08", time: "08:27", url: "https://www.ft.com/content/798623be-8da1-490d-9494-11b3d5f58ac8" },
  { id: "c2b7e004-3097-4d64-8b68-c48a360a1878", title: "An American farewell to China", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/c2b7e004-3097-4d64-8b68-c48a360a1878" },
  { id: "5c74c644-1491-4514-93b5-0a203c3b8a95", title: "Parents of UK students dig deep to fund university costs", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/5c74c644-1491-4514-93b5-0a203c3b8a95" },
  { id: "45730a94-cb43-42cb-ae8f-da0f39f37d67", title: "Venezuelans take to the streets as country hit by daily blackouts", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/45730a94-cb43-42cb-ae8f-da0f39f37d67" },
  { id: "0a843a71-8418-4c18-a19d-de47688818e8", title: "Sainsbury’s needs a dose of Big Tech’s boldness", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/0a843a71-8418-4c18-a19d-de47688818e8" },
  { id: "d9e0c81c-9160-48e7-9309-01f21de5fe5d", title: "Kids, flats and student loans: Why UK first-time buyers are getting older", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/d9e0c81c-9160-48e7-9309-01f21de5fe5d" },
  { id: "10f9922c-4667-4fb9-b2a0-6f3264ef0b09", title: "The exciting boring decade", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/10f9922c-4667-4fb9-b2a0-6f3264ef0b09" },
  { id: "779cbfdc-e259-4008-8dea-80b23878d6c7", title: "London’s dejected housebuilders finally catch a break", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/779cbfdc-e259-4008-8dea-80b23878d6c7" },
  { id: "5da56bdb-07d5-4ab7-be03-4bf303400a90", title: "Burnham urged to rule out changes to pension lump sums in next Budget", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/5da56bdb-07d5-4ab7-be03-4bf303400a90" },
  { id: "fb49381a-3e09-4666-85b0-7a171e01394e", title: "The US bares its financial weak spot", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/fb49381a-3e09-4666-85b0-7a171e01394e" },
  { id: "43af0b33-4c2d-4c10-8948-c77082f70935", title: "How to fix Britain’s housing crisis", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/43af0b33-4c2d-4c10-8948-c77082f70935" },
  { id: "5ef8cb99-deae-4c9a-be1f-be791ae6b1cd", title: "A short history of valuing stocks", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/5ef8cb99-deae-4c9a-be1f-be791ae6b1cd" },
  { id: "79f4255d-7f61-48d8-8209-c9560a35021b", title: "Can British bike makers get back on track?", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/79f4255d-7f61-48d8-8209-c9560a35021b" },
  { id: "2472ef5a-798d-4e7b-b4be-020855cf387e", title: "America’s new oligarchy", date: "2026-08-08", time: "05:00", url: "https://www.ft.com/content/2472ef5a-798d-4e7b-b4be-020855cf387e" },
  { id: "d14cac62-bd68-44e5-8fb5-0637b412fdf7", title: "Mike Ashley says Harvey Nichols is in a 'death spiral'", date: "2026-08-07", time: "21:05", url: "https://www.ft.com/content/d14cac62-bd68-44e5-8fb5-0637b412fdf7" },
  { id: "cf508e70-5bc2-495e-8b9b-21f15e60ad58", title: "Burnham's UK tour to focus on cutting cost of living and helping high streets", date: "2026-08-07", time: "19:01", url: "https://www.ft.com/content/cf508e70-5bc2-495e-8b9b-21f15e60ad58" },
  { id: "0012c7c9-fb31-4c90-a2e7-e65bd4629b22", title: "Donald Trump revives threat to sack Fed governor Lisa Cook", date: "2026-08-07", time: "18:29", url: "https://www.ft.com/content/0012c7c9-fb31-4c90-a2e7-e65bd4629b22" },
  { id: "8b61001e-6d7c-4ca9-8c4b-853b4555f318", title: "Passing the Clarity Act on digital assets is a matter of national security", date: "2026-08-07", time: "18:00", url: "https://www.ft.com/content/8b61001e-6d7c-4ca9-8c4b-853b4555f318" },
  { id: "145df661-bee4-4242-8671-75e1268b3676", title: "Directors’ Deals: Man Group’s finance chief divests even as assets swell", date: "2026-08-07", time: "18:00", url: "https://www.ft.com/content/145df661-bee4-4242-8671-75e1268b3676" },
  { id: "daa12453-278d-4353-8db5-e9a56fec35f8", title: "Stockpickers: XP Power, Intertek, Clarkson", date: "2026-08-07", time: "18:00", url: "https://www.ft.com/content/daa12453-278d-4353-8db5-e9a56fec35f8" },
];
