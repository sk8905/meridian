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
  { id: "8d98a654-3ccb-4efc-b0f5-50301ac35a18", title: "IEA warns of risk to energy supplies from escalation of Iran conflict", date: "2026-07-21", time: "17:05", url: "https://www.ft.com/content/8d98a654-3ccb-4efc-b0f5-50301ac35a18" },
  { id: "0616bdd3-bc3b-45a3-a034-4548e57c190d", title: "Andy Burnham’s cabinet: who’s in, who’s out?", date: "2026-07-21", time: "17:03", url: "https://www.ft.com/content/0616bdd3-bc3b-45a3-a034-4548e57c190d" },
  { id: "b8b8ba5f-8991-4c21-abb4-2f6cf25a0cfb", title: "Turkish opposition leader to create breakaway party to take on Erdoğan", date: "2026-07-21", time: "16:56", url: "https://www.ft.com/content/b8b8ba5f-8991-4c21-abb4-2f6cf25a0cfb" },
  { id: "c98495e5-ad15-498a-ab3f-9d3d72341975", title: "Liverpool FC owner in talks to sell stake to Mittal family-backed consortium", date: "2026-07-21", time: "16:36", url: "https://www.ft.com/content/c98495e5-ad15-498a-ab3f-9d3d72341975" },
  { id: "bfb81988-c973-48cf-babc-a0c65e2814c5", title: "Andy Burnham backs away from costly increase to income tax allowance", date: "2026-07-21", time: "16:25", url: "https://www.ft.com/content/bfb81988-c973-48cf-babc-a0c65e2814c5" },
  { id: "195c21cf-6a8c-4fd8-810c-66d18bc16842", title: "Bidder accuses Segro of ‘aspirational’ projections to justify rejecting £13.5bn offer", date: "2026-07-21", time: "16:20", url: "https://www.ft.com/content/195c21cf-6a8c-4fd8-810c-66d18bc16842" },
  { id: "61ff0520-ca83-4304-a078-865e15634e9c", title: "‘Major’ antitrust demands would destroy Europe space deal, warns Leonardo chief", date: "2026-07-21", time: "15:22", url: "https://www.ft.com/content/61ff0520-ca83-4304-a078-865e15634e9c" },
  { id: "e0aaea6b-a8b2-4482-a48c-ef802861b350", title: "How will UK foreign policy change under Ed Miliband?", date: "2026-07-21", time: "15:22", url: "https://www.ft.com/content/e0aaea6b-a8b2-4482-a48c-ef802861b350" },
  { id: "08779c55-de8a-4a91-8200-7e47d71f961c", title: "Axing UK science department risks slower policymaking, say tech leaders", date: "2026-07-21", time: "14:56", url: "https://www.ft.com/content/08779c55-de8a-4a91-8200-7e47d71f961c" },
  { id: "2b150649-6e35-48da-bac8-9fabdd8964cf", title: "Ann Widdecombe died after being ‘struck 21 times with hammer’", date: "2026-07-21", time: "14:37", url: "https://www.ft.com/content/2b150649-6e35-48da-bac8-9fabdd8964cf" },
  { id: "13092f23-4b2f-4e62-8aa9-76ab465a667c", title: "Donald Trump to meet Lebanon’s president as US pushes ahead with peace deal", date: "2026-07-21", time: "14:01", url: "https://www.ft.com/content/13092f23-4b2f-4e62-8aa9-76ab465a667c" },
  { id: "c346e82e-4d2c-4a2a-b4c3-64a4aa47d4e4", title: "Donald Trump threatens to reignite trade war with fresh 50% tariffs on Canada", date: "2026-07-21", time: "14:00", url: "https://www.ft.com/content/c346e82e-4d2c-4a2a-b4c3-64a4aa47d4e4" },
  { id: "9df22dc2-069a-42d1-90ca-5f660e52260e", title: "Six foolish mistakes for the UK’s new chancellor to avoid", date: "2026-07-21", time: "13:09", url: "https://www.ft.com/content/9df22dc2-069a-42d1-90ca-5f660e52260e" },
  { id: "05b20ea3-425b-49da-886e-fd0ac9270fe7", title: "Who is in Andy Burnham’s new cabinet?", date: "2026-07-21", time: "12:53", url: "https://www.ft.com/content/05b20ea3-425b-49da-886e-fd0ac9270fe7" },
  { id: "da400e66-8dbe-4e97-ab89-ab55a90d98cf", title: "Japan is flirting with its own Liz Truss moment", date: "2026-07-21", time: "12:30", url: "https://www.ft.com/content/da400e66-8dbe-4e97-ab89-ab55a90d98cf" },
  { id: "f3ad032f-3c06-4ed4-82e2-7c2e5e68af26", title: "Why the world trusts China more than America", date: "2026-07-21", time: "12:28", url: "https://www.ft.com/content/f3ad032f-3c06-4ed4-82e2-7c2e5e68af26" },
  { id: "5874d7d9-7684-4732-b415-dae96c0ad73e", title: "Six things we learnt from Andy Burnham’s choices for his top team", date: "2026-07-21", time: "12:08", url: "https://www.ft.com/content/5874d7d9-7684-4732-b415-dae96c0ad73e" },
  { id: "39f4842b-7389-485c-9d28-1a199607e56b", title: "National Grid taps into US AI power boom", date: "2026-07-21", time: "12:00", url: "https://www.ft.com/content/39f4842b-7389-485c-9d28-1a199607e56b" },
  { id: "56f4d21f-42b8-45c0-be1a-c168709c8413", title: "Pension funds may regret benchmarking their PE portfolios to stonks", date: "2026-07-21", time: "11:51", url: "https://www.ft.com/content/56f4d21f-42b8-45c0-be1a-c168709c8413" },
  { id: "7875b77a-fede-4472-93d2-a5f2c3f630eb", title: "FirstFT: Trump prepares to meet Lebanon’s leader", date: "2026-07-21", time: "11:03", url: "https://www.ft.com/content/7875b77a-fede-4472-93d2-a5f2c3f630eb" },
  { id: "c31cdab6-b2cf-4754-9c84-73c3c848bcb3", title: "Donald Trump prepares fresh tariff barrage with 10% levies set to expire", date: "2026-07-21", time: "11:00", url: "https://www.ft.com/content/c31cdab6-b2cf-4754-9c84-73c3c848bcb3" },
  { id: "2e017e40-216c-437d-af7a-ad68ef4fdd29", title: "Lack of UK jobs growth highlights challenges for Andy Burnham", date: "2026-07-21", time: "10:55", url: "https://www.ft.com/content/2e017e40-216c-437d-af7a-ad68ef4fdd29" },
  { id: "a4fff814-a4f9-4eb5-a774-e52dfe4d7bea", title: "Berenberg discovers accounting manipulation designed to flatter profits", date: "2026-07-21", time: "10:53", url: "https://www.ft.com/content/a4fff814-a4f9-4eb5-a774-e52dfe4d7bea" },
  { id: "0423e995-9bfc-4d5f-95fe-c4961c737a52", title: "UK wage growth continues to cool while unemployment rate steady", date: "2026-07-21", time: "09:53", url: "https://www.ft.com/content/0423e995-9bfc-4d5f-95fe-c4961c737a52" },
  { id: "da46f288-a9a4-443f-81e2-7b08a054b7b3", title: "Thames Water lenders to offer ‘golden share’ to UK government", date: "2026-07-21", time: "09:12", url: "https://www.ft.com/content/da46f288-a9a4-443f-81e2-7b08a054b7b3" },
  { id: "35e0aa44-e908-43a4-ad31-f4988f18bc9f", title: "Continuity and change in Andy Burnham’s new cabinet", date: "2026-07-21", time: "08:55", url: "https://www.ft.com/content/35e0aa44-e908-43a4-ad31-f4988f18bc9f" },
  { id: "aaee5340-68c3-40a3-840c-3bcbb88edd42", title: "Mitie agrees £3.1bn takeover by rival outsourcer OCS", date: "2026-07-21", time: "08:31", url: "https://www.ft.com/content/aaee5340-68c3-40a3-840c-3bcbb88edd42" },
  { id: "da7084af-5ea5-4472-a1d4-98ffde38a061", title: "Julius Baer earnings rebound on early turnaround signs", date: "2026-07-21", time: "08:15", url: "https://www.ft.com/content/da7084af-5ea5-4472-a1d4-98ffde38a061" },
  { id: "6320b91d-9eda-41ff-ae76-bb68a52886f9", title: "Indian asset manager’s debut revives hopes for local IPO market", date: "2026-07-21", time: "07:47", url: "https://www.ft.com/content/6320b91d-9eda-41ff-ae76-bb68a52886f9" },
  { id: "d47f9b39-9e78-4034-97a2-1ca8e07e27e8", title: "Brazil faces unforgiving economics after election", date: "2026-07-21", time: "07:08", url: "https://www.ft.com/content/d47f9b39-9e78-4034-97a2-1ca8e07e27e8" },
  { id: "7700d94a-d204-439a-92c8-027f67320b73", title: "Andy Burnham latest: Move to remove VAT on electricity bills sparks funding row as Cabinet meets", date: "2026-07-21", time: "06:43", url: "https://www.ft.com/content/7700d94a-d204-439a-92c8-027f67320b73" },
  { id: "2e137205-df69-47a2-9674-2f4a9deec0d9", title: "Nearly 100 US troops injured in 2 weeks since Iran war resumed", date: "2026-07-21", time: "06:33", url: "https://www.ft.com/content/2e137205-df69-47a2-9674-2f4a9deec0d9" },
  { id: "552e32c1-a75a-40fe-a5af-2eba0bebff31", title: "Broken valuation metrics?", date: "2026-07-21", time: "06:30", url: "https://www.ft.com/content/552e32c1-a75a-40fe-a5af-2eba0bebff31" },
  { id: "9384bfba-55d3-4280-b8a0-85f7cdbeeb5c", title: "Adnoc to invest in $6.2bn natural gas schemes as UAE bids for self-sufficiency", date: "2026-07-21", time: "06:30", url: "https://www.ft.com/content/9384bfba-55d3-4280-b8a0-85f7cdbeeb5c" },
  { id: "7ab44cbc-95cd-4c4e-835c-bf5a58c82b53", title: "EU tech tsar spars with justice chief over new online rule book", date: "2026-07-21", time: "06:00", url: "https://www.ft.com/content/7ab44cbc-95cd-4c4e-835c-bf5a58c82b53" },
  { id: "c86cb049-5fc1-4ed0-a9c3-2fce8d6a44a7", title: "FTAV’s further reading", date: "2026-07-21", time: "06:00", url: "https://www.ft.com/content/c86cb049-5fc1-4ed0-a9c3-2fce8d6a44a7" },
  { id: "45ef8443-e5ab-4c61-aed2-e646cb8dc285", title: "UK chancellor John Healey inherits tricky finances", date: "2026-07-21", time: "05:19", url: "https://www.ft.com/content/45ef8443-e5ab-4c61-aed2-e646cb8dc285" },
  { id: "7622bdcb-6106-4d98-a802-addcd49243fa", title: "Linklaters partners handed record £2.5mn payday as Asia business booms", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/7622bdcb-6106-4d98-a802-addcd49243fa" },
  { id: "35bc9320-0232-4d9e-95f4-d81d2e36d6fd", title: "Tom Hayes says UBS’s ‘Project Chocolate’ probe shows he was targeted from outset", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/35bc9320-0232-4d9e-95f4-d81d2e36d6fd" },
  { id: "a8a14c7e-2b7f-4ded-a48d-efa3338ff4ba", title: "US authorities probe Mark Walter’s insurance empire", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/a8a14c7e-2b7f-4ded-a48d-efa3338ff4ba" },
];
