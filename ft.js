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
  { id: "e164e244-f6de-4e3b-8a67-6bebee1b7bf4", title: "Greg Abel finally puts Buffett’s cash pile to work", date: "2026-08-08", time: "13:57", url: "https://www.ft.com/content/e164e244-f6de-4e3b-8a67-6bebee1b7bf4" },
  { id: "352a15ac-53c4-46eb-b75e-957f0388dc79", title: "Landmark crypto bill stalls in US Senate despite $225mn spending push", date: "2026-08-08", time: "11:00", url: "https://www.ft.com/content/352a15ac-53c4-46eb-b75e-957f0388dc79" },
  { id: "e1f2e2b9-6f52-44fc-a659-e981d2fc923e", title: "First Brands urges court to approve bankruptcy settlement", date: "2026-08-08", time: "11:00", url: "https://www.ft.com/content/e1f2e2b9-6f52-44fc-a659-e981d2fc923e" },
  { id: "a371dc43-0584-4fcc-b064-80596727d5b5", title: "Pfizer grapples with ‘a world of hurt’ after Covid triumph", date: "2026-08-08", time: "11:00", url: "https://www.ft.com/content/a371dc43-0584-4fcc-b064-80596727d5b5" },
  { id: "f3050d94-6b78-4cf2-8b07-cf8903aacc7f", title: "Spain reinstates border controls on Italy as tensions rise over migrants", date: "2026-08-08", time: "10:45", url: "https://www.ft.com/content/f3050d94-6b78-4cf2-8b07-cf8903aacc7f" },
  { id: "d2248ee9-edb5-445c-b89b-425e033a19fa", title: "Chart of the Week: Currency interventions have a mixed record", date: "2026-08-08", time: "10:30", url: "https://www.ft.com/content/d2248ee9-edb5-445c-b89b-425e033a19fa" },
  { id: "4f1f4150-3e5b-4015-ad44-5f596e0287a5", title: "US Senate narrowly confirms Todd Blanche as US attorney-general", date: "2026-08-08", time: "10:16", url: "https://www.ft.com/content/4f1f4150-3e5b-4015-ad44-5f596e0287a5" },
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
  { id: "822f8902-1808-469f-97e0-634c552a7aa4", title: "Taming AI’s wild frontier", date: "2026-08-07", time: "17:54", url: "https://www.ft.com/content/822f8902-1808-469f-97e0-634c552a7aa4" },
  { id: "2b9f249a-53f1-4755-88ec-3e316d3c965d", title: "FTAV Friday chart quiz", date: "2026-08-07", time: "15:19", url: "https://www.ft.com/content/2b9f249a-53f1-4755-88ec-3e316d3c965d" },
  { id: "0fd301d9-7e47-46ff-89b9-b666a8a1c148", title: "Cambridge university to review appointments process after Jason Arday affair", date: "2026-08-07", time: "14:47", url: "https://www.ft.com/content/0fd301d9-7e47-46ff-89b9-b666a8a1c148" },
  { id: "54adfc90-f555-44d3-8a81-4f39a07b5473", title: "US economy unexpectedly shed 23,000 jobs in July", date: "2026-08-07", time: "13:39", url: "https://www.ft.com/content/54adfc90-f555-44d3-8a81-4f39a07b5473" },
  { id: "dba784cb-a197-4576-b533-597d5eb12a51", title: "Mixed July payrolls report takes pressure off the Fed to tighten", date: "2026-08-07", time: "14:37", url: "https://www.ft.com/content/dba784cb-a197-4576-b533-597d5eb12a51" },
  { id: "d981326d-3d4c-4248-aed2-c5c1c0e8cab5", title: "The meaning of Michigan", date: "2026-08-07", time: "14:00", url: "https://www.ft.com/content/d981326d-3d4c-4248-aed2-c5c1c0e8cab5" },
  { id: "81aff420-0ce3-4e69-9608-31b81d406be9", title: "Will Farage’s gamble pay off?", date: "2026-08-07", time: "13:36", url: "https://www.ft.com/content/81aff420-0ce3-4e69-9608-31b81d406be9" },
  { id: "2434fbcc-b8b5-4bda-a82d-1b08c6a015f8", title: "UK housing market in ‘suspended animation’", date: "2026-08-07", time: "13:33", url: "https://www.ft.com/content/2434fbcc-b8b5-4bda-a82d-1b08c6a015f8" },
  { id: "6bc9c93d-1b75-4512-8bc2-ba33cc3c4a53", title: "Iran’s oil exports stall and Kharg Island idles under US blockade", date: "2026-08-07", time: "13:29", url: "https://www.ft.com/content/6bc9c93d-1b75-4512-8bc2-ba33cc3c4a53" },
  { id: "acc1df39-eccc-4f04-affd-f3aca4839669", title: "Apollo’s upmarket plans for easyJet after £5.7bn takeover", date: "2026-08-07", time: "13:18", url: "https://www.ft.com/content/acc1df39-eccc-4f04-affd-f3aca4839669" },
  { id: "6d258069-e935-446c-b112-753c6c2bdfb2", title: "UK manages record share of assets on behalf of overseas clients", date: "2026-08-07", time: "13:09", url: "https://www.ft.com/content/6d258069-e935-446c-b112-753c6c2bdfb2" },
  { id: "67412944-136f-401c-9fd7-2d68552832f1", title: "Explosive drone at German airport raises ‘hybrid threat’ alarm", date: "2026-08-07", time: "13:02", url: "https://www.ft.com/content/67412944-136f-401c-9fd7-2d68552832f1" },
  { id: "a988ae61-a218-4872-a4d7-a3061c6ca7ab", title: "Saudi Arabia, Turkey and Pakistan sign defence pact in Mecca", date: "2026-08-07", time: "12:18", url: "https://www.ft.com/content/a988ae61-a218-4872-a4d7-a3061c6ca7ab" },
];
