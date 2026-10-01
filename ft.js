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
    id: "639e1943-a5fc-4869-bac8-95cf3c9fe4e8",
    title: "Boodles in the pink with Argyle diamond haul",
    date: "2026-10-01",
    time: "07:00",
    url: "https://www.ft.com/content/639e1943-a5fc-4869-bac8-95cf3c9fe4e8",
  },
  {
    id: "4ab6df98-f14d-49d1-a170-8087dc517b08",
    title: "An optimist’s guide to the bond market",
    date: "2026-10-01",
    time: "06:30",
    url: "https://www.ft.com/content/4ab6df98-f14d-49d1-a170-8087dc517b08",
  },
  {
    id: "9af7e02c-3b08-4c95-b61f-714a65d7316d",
    title: "FTAV’s further reading",
    date: "2026-10-01",
    time: "06:30",
    url: "https://www.ft.com/content/9af7e02c-3b08-4c95-b61f-714a65d7316d",
  },
  {
    id: "1e6d2a9b-dc37-4b19-91e3-0a76fd01b673",
    title: "Indian Flydubai pilot hailed as hero after averting disaster",
    date: "2026-10-01",
    time: "06:01",
    url: "https://www.ft.com/content/1e6d2a9b-dc37-4b19-91e3-0a76fd01b673",
  },
  {
    id: "ff64e3ef-0a37-489c-a79d-b02c29502a75",
    title: "France and Germany inch towards grand bargain on EU car regulation",
    date: "2026-10-01",
    time: "06:00",
    url: "https://www.ft.com/content/ff64e3ef-0a37-489c-a79d-b02c29502a75",
  },
  {
    id: "594f10d8-aebd-48d5-af47-5e7232487a35",
    title: "FirstFT: Big Tech’s heavy Brussels lobbying",
    date: "2026-10-01",
    time: "05:31",
    url: "https://www.ft.com/content/594f10d8-aebd-48d5-af47-5e7232487a35",
  },
  {
    id: "e485a228-1efe-426b-addc-26069ba48bf3",
    title: "Global bond sell-off deepens as Asian yields jump",
    date: "2026-10-01",
    time: "05:17",
    url: "https://www.ft.com/content/e485a228-1efe-426b-addc-26069ba48bf3",
  },
  {
    id: "8be64ab7-81eb-48dd-8baa-e1c413a838e8",
    title: "Louvre boss promises ‘culture of security’ after heist",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/8be64ab7-81eb-48dd-8baa-e1c413a838e8",
  },
  {
    id: "bc38ab9d-d8b1-4f48-a804-f7c186e98b9b",
    title: "Boots set to get carved out of private equity",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/bc38ab9d-d8b1-4f48-a804-f7c186e98b9b",
  },
  {
    id: "11502a49-5319-4df5-95ea-2d76669c31a6",
    title: "OpenAI’s agents obscured hacking activity in government site breaches",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/11502a49-5319-4df5-95ea-2d76669c31a6",
  },
  {
    id: "125675ee-0d2c-4ffc-b7c5-814dd6b82612",
    title: "Manchester City chair shielded by diplomatic immunity",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/125675ee-0d2c-4ffc-b7c5-814dd6b82612",
  },
  {
    id: "719fb157-9d73-44c7-be1f-863c2b106e7d",
    title: "EU steel exports hit by high energy costs, tariffs and China oversupply",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/719fb157-9d73-44c7-be1f-863c2b106e7d",
  },
  {
    id: "dba1f631-2804-43eb-8bf9-858e0fc5c09d",
    title: "King’s bank Coutts hit with new lawsuit after ‘debanking’",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/dba1f631-2804-43eb-8bf9-858e0fc5c09d",
  },
  {
    id: "8bece01e-0284-402c-9cc6-db4adfdd02ad",
    title: "UBS should make the positive case for staying Swiss",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/8bece01e-0284-402c-9cc6-db4adfdd02ad",
  },
  {
    id: "534b6887-63ac-49c7-a816-a81edd2e8de1",
    title: "EU questions Binance over continued operations despite wind-down order",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/534b6887-63ac-49c7-a816-a81edd2e8de1",
  },
  {
    id: "cd2e89d3-2606-4116-b523-309450462d2b",
    title: "How Europe can stall Russia’s hybrid war",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/cd2e89d3-2606-4116-b523-309450462d2b",
  },
  {
    id: "3a3334fb-981d-4cd3-9f35-e3289578b0fa",
    title: "Auditor RSM explores IPO to ward off private equity-backed rivals",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/3a3334fb-981d-4cd3-9f35-e3289578b0fa",
  },
  {
    id: "e41b609a-8762-43c2-bcfc-eaa61ec0cebf",
    title: "Lab-grown meat: moral mission meets market realities",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/e41b609a-8762-43c2-bcfc-eaa61ec0cebf",
  },
  {
    id: "b84778e5-ce8b-4baa-9ca7-402cdf277b4d",
    title: "The trouble with China’s bigger, better batteries",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/b84778e5-ce8b-4baa-9ca7-402cdf277b4d",
  },
  {
    id: "817f40f7-d4ac-43ee-beaf-12cfac08c621",
    title: "Big Tech out-lobbies European companies in Brussels",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/817f40f7-d4ac-43ee-beaf-12cfac08c621",
  },
  {
    id: "b77a34af-a12f-445c-8707-8f6b8223ad39",
    title: "Australia’s housing slump could have a silver lining for its banks",
    date: "2026-10-01",
    time: "00:01",
    url: "https://www.ft.com/content/b77a34af-a12f-445c-8707-8f6b8223ad39",
  },
  {
    id: "f0cdc5bc-c07a-47cf-9602-064006176aef",
    title: "Donald Trump says South Korea will invest $200bn in US energy projects",
    date: "2026-09-30",
    time: "23:41",
    url: "https://www.ft.com/content/f0cdc5bc-c07a-47cf-9602-064006176aef",
  },
  {
    id: "b5b79e91-37d6-45c1-9907-cd3ea957cb5d",
    title: "Pete Hegseth extols overhaul of US military in ‘state of the force’ speech",
    date: "2026-09-30",
    time: "23:28",
    url: "https://www.ft.com/content/b5b79e91-37d6-45c1-9907-cd3ea957cb5d",
  },
  {
    id: "188ab0ab-e39d-4221-9730-0610fbc22ee9",
    title: "Paramount stumps up high borrowing costs to fund Warner Bros deal",
    date: "2026-09-30",
    time: "22:37",
    url: "https://www.ft.com/content/188ab0ab-e39d-4221-9730-0610fbc22ee9",
  },
  {
    id: "188752a3-c43c-4bad-a59b-19d76074b1e0",
    title: "Top Man City sponsor threatens legal action against Premier League",
    date: "2026-09-30",
    time: "22:36",
    url: "https://www.ft.com/content/188752a3-c43c-4bad-a59b-19d76074b1e0",
  },
  {
    id: "39de7709-7b5b-42f6-ad90-df50f1308ea2",
    title: "US government debt rout triggers ‘vicious loop’ of selling",
    date: "2026-09-30",
    time: "22:09",
    url: "https://www.ft.com/content/39de7709-7b5b-42f6-ad90-df50f1308ea2",
  },
  {
    id: "baa261b7-681d-41b7-b41a-d704858cd0b2",
    title: "Paramount names Mattel boss co-CEO as it looks to close Warner Bros deal",
    date: "2026-09-30",
    time: "22:03",
    url: "https://www.ft.com/content/baa261b7-681d-41b7-b41a-d704858cd0b2",
  },
  {
    id: "46194a0b-a0e4-42cc-ad40-0df753492768",
    title: "Google releases most advanced Gemini AI model",
    date: "2026-09-30",
    time: "21:09",
    url: "https://www.ft.com/content/46194a0b-a0e4-42cc-ad40-0df753492768",
  },
  {
    id: "ef10b301-6264-4ac8-8d23-bd3dddf9b8a2",
    title: "Burnham clears path to EU summit with post-Brexit breakthrough",
    date: "2026-09-30",
    time: "21:00",
    url: "https://www.ft.com/content/ef10b301-6264-4ac8-8d23-bd3dddf9b8a2",
  },
  {
    id: "c3a6e3b7-e998-43f0-82b2-f197e5d1730b",
    title: "Boots owner nearing $9bn sale of chemist to Canada’s Weston family",
    date: "2026-09-30",
    time: "19:59",
    url: "https://www.ft.com/content/c3a6e3b7-e998-43f0-82b2-f197e5d1730b",
  },
  {
    id: "ecc95946-92ed-426c-bcf9-e6575e1cf6c6",
    title: "18,000 feet in 90 seconds: Inside Flydubai’s near-catastrophe",
    date: "2026-09-30",
    time: "19:31",
    url: "https://www.ft.com/content/ecc95946-92ed-426c-bcf9-e6575e1cf6c6",
  },
  {
    id: "08109881-f33c-43e0-9dc6-fc3a00d4e35b",
    title: "How the UAE became a destination for Israelis",
    date: "2026-09-30",
    time: "19:30",
    url: "https://www.ft.com/content/08109881-f33c-43e0-9dc6-fc3a00d4e35b",
  },
  {
    id: "81a5e13f-0a9c-4de2-b02d-f291fccae797",
    title: "UK retreats on climate reporting rules for listed companies",
    date: "2026-09-30",
    time: "19:10",
    url: "https://www.ft.com/content/81a5e13f-0a9c-4de2-b02d-f291fccae797",
  },
  {
    id: "cd22d20a-3b65-4534-ac04-f5008810e10a",
    title: "Bond markets resume sell-off after strong US data",
    date: "2026-09-30",
    time: "18:25",
    url: "https://www.ft.com/content/cd22d20a-3b65-4534-ac04-f5008810e10a",
  },
  {
    id: "a3075bf9-5b6c-40c8-bb6b-aca4422d1cbb",
    title: "US competition watchdog expands investigation of Anthropic and OpenAI",
    date: "2026-09-30",
    time: "18:07",
    url: "https://www.ft.com/content/a3075bf9-5b6c-40c8-bb6b-aca4422d1cbb",
  },
  {
    id: "78431eef-50ee-4ec9-9ca6-af801da1e617",
    title: "Fed watchdog finds ‘deficiencies’ but no criminal wrongdoing in $2.5bn renovation project",
    date: "2026-09-30",
    time: "18:00",
    url: "https://www.ft.com/content/78431eef-50ee-4ec9-9ca6-af801da1e617",
  },
  {
    id: "f5e98843-7625-4999-9b99-c03f2ec26c4c",
    title: "To fix housing affordability, build more homes",
    date: "2026-09-30",
    time: "17:44",
    url: "https://www.ft.com/content/f5e98843-7625-4999-9b99-c03f2ec26c4c",
  },
  {
    id: "0d74d66a-a9ee-4c22-83ab-9df6452117de",
    title: "US oil industry warns diesel prices will not return to normal for a year",
    date: "2026-09-30",
    time: "17:20",
    url: "https://www.ft.com/content/0d74d66a-a9ee-4c22-83ab-9df6452117de",
  },
  {
    id: "e9f2345f-6d7b-4fbb-831a-5fe576317701",
    title: "National care service may not launch until late 2030s, suggests Burnham",
    date: "2026-09-30",
    time: "17:11",
    url: "https://www.ft.com/content/e9f2345f-6d7b-4fbb-831a-5fe576317701",
  },
  {
    id: "bb557b06-6880-4bae-a719-fbd733c63787",
    title: "‘Strong indications’ Iran was involved in RAF Fairford incident, says Andy Burnham",
    date: "2026-09-30",
    time: "17:00",
    url: "https://www.ft.com/content/bb557b06-6880-4bae-a719-fbd733c63787",
  },
  {
    id: "c05f3ba5-e24e-4c88-86ed-04f4b229cd15",
    title: "Don’t own bonds and be cautious with stocks",
    date: "2026-09-30",
    time: "16:53",
    url: "https://www.ft.com/content/c05f3ba5-e24e-4c88-86ed-04f4b229cd15",
  },
  {
    id: "3e84fbcb-d064-46f8-be79-44060a722447",
    title: "Andy Burnham tightens his hold on Labour",
    date: "2026-09-30",
    time: "16:35",
    url: "https://www.ft.com/content/3e84fbcb-d064-46f8-be79-44060a722447",
  },
  {
    id: "f52f7b0e-be7d-414c-b19d-d78a3a5f4882",
    title: "How will Donald Trump ‘accord’ for AI to ‘self-regulate’ work?",
    date: "2026-09-30",
    time: "16:31",
    url: "https://www.ft.com/content/f52f7b0e-be7d-414c-b19d-d78a3a5f4882",
  },
];
