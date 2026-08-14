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
  { id: "68873521-58fa-435d-b46f-6309612964b2", title: "Luigi Mangione pleads guilty over death of UnitedHealth chief executive", date: "2026-08-14", time: "16:51", url: "https://www.ft.com/content/68873521-58fa-435d-b46f-6309612964b2" },
  { id: "71f95452-4493-4795-bfe2-26d0c89b2a93", title: "Activists are giving British M&A targets a helpful shove", date: "2026-08-14", time: "16:42", url: "https://www.ft.com/content/71f95452-4493-4795-bfe2-26d0c89b2a93" },
  { id: "e288709a-36f2-459e-9d59-f9a59a3891c2", title: "Farage wins… and donation probe resumes", date: "2026-08-14", time: "16:25", url: "https://www.ft.com/content/e288709a-36f2-459e-9d59-f9a59a3891c2" },
  { id: "7cd266e7-8278-4e26-945d-d7412afa9152", title: "Top French court blocks social media ban for children", date: "2026-08-14", time: "16:24", url: "https://www.ft.com/content/7cd266e7-8278-4e26-945d-d7412afa9152" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-08-14", time: "16:23", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
  { id: "75ba3055-625c-4cb5-894b-0696a38f5e79", title: "Latest Isa rates", date: "2026-08-14", time: "16:20", url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79" },
  { id: "e95e8b45-474b-4305-b3b5-83036fa3a06c", title: "Warsh and wait", date: "2026-08-14", time: "16:19", url: "https://www.ft.com/content/e95e8b45-474b-4305-b3b5-83036fa3a06c" },
  { id: "68b36b6d-71e7-4f44-bbfb-a202e36603a4", title: "Latest National Savings & Investments rates", date: "2026-08-14", time: "16:16", url: "https://www.ft.com/content/68b36b6d-71e7-4f44-bbfb-a202e36603a4" },
  { id: "d4897d94-0d69-445a-9466-5150840c801e", title: "Investors pile back into US stocks as bullishness returns to Wall Street", date: "2026-08-14", time: "15:35", url: "https://www.ft.com/content/d4897d94-0d69-445a-9466-5150840c801e" },
  { id: "236f9d28-f89d-4991-b066-8d2ea47a0def", title: "Reader callout: Do you earn more than your siblings?", date: "2026-08-14", time: "15:20", url: "https://www.ft.com/content/236f9d28-f89d-4991-b066-8d2ea47a0def" },
  { id: "0095afa5-5945-49cf-b21e-cd502abd1d87", title: "Daniel Kinahan, Ireland’s most wanted man, faces his day in court", date: "2026-08-14", time: "13:45", url: "https://www.ft.com/content/0095afa5-5945-49cf-b21e-cd502abd1d87" },
  { id: "e5137402-162a-4b21-a175-d86af03c378b", title: "Financier fined and banned over false claims in bids for bank and football club", date: "2026-08-14", time: "13:41", url: "https://www.ft.com/content/e5137402-162a-4b21-a175-d86af03c378b" },
  { id: "28a51284-98cc-4767-a306-0540d265687f", title: "Jane Street has paid up large to avoid its numbers leaking out", date: "2026-08-14", time: "13:20", url: "https://www.ft.com/content/28a51284-98cc-4767-a306-0540d265687f" },
  { id: "2a2a8eed-3986-42b5-acde-230dcdffaf25", title: "Why Homer will outlast us all", date: "2026-08-14", time: "13:19", url: "https://www.ft.com/content/2a2a8eed-3986-42b5-acde-230dcdffaf25" },
  { id: "45f65d72-b90a-4dd9-a7b7-43bdf511c194", title: "Safety inspection of track carried out day before train crash south of London", date: "2026-08-14", time: "12:36", url: "https://www.ft.com/content/45f65d72-b90a-4dd9-a7b7-43bdf511c194" },
  { id: "c2aac8e1-62a7-4738-84c1-031266f0dc69", title: "US nuclear negotiator Ernest Moniz: ‘Iran has the home-court advantage’", date: "2026-08-14", time: "12:30", url: "https://www.ft.com/content/c2aac8e1-62a7-4738-84c1-031266f0dc69" },
  { id: "37855917-cf5b-42a9-ad73-f8428a50c0b4", title: "All aboard the wind power rollercoaster", date: "2026-08-14", time: "12:00", url: "https://www.ft.com/content/37855917-cf5b-42a9-ad73-f8428a50c0b4" },
  { id: "2ff9ed49-89fa-4b10-b754-ecf1bc396aad", title: "A-level results are in. But are next-step university digs out?", date: "2026-08-14", time: "12:00", url: "https://www.ft.com/content/2ff9ed49-89fa-4b10-b754-ecf1bc396aad" },
  { id: "63ac111b-c841-4134-9751-f7cc419ae5c5", title: "Everyone but me is getting excited about European equities", date: "2026-08-14", time: "11:59", url: "https://www.ft.com/content/63ac111b-c841-4134-9751-f7cc419ae5c5" },
  { id: "7f886b9c-c2f4-4561-96a3-9fe2736122c5", title: "FTAV’s Friday charts quiz", date: "2026-08-14", time: "11:52", url: "https://www.ft.com/content/7f886b9c-c2f4-4561-96a3-9fe2736122c5" },
  { id: "d32e8159-7460-44d1-8ed1-f1c3d27d40c8", title: "Israel moves to give police powers in occupied West Bank", date: "2026-08-14", time: "11:21", url: "https://www.ft.com/content/d32e8159-7460-44d1-8ed1-f1c3d27d40c8" },
  { id: "a61433b2-902e-4299-b546-bc0efd9aa53a", title: "Farage won in Clacton. But there are bigger tests to come", date: "2026-08-14", time: "11:10", url: "https://www.ft.com/content/a61433b2-902e-4299-b546-bc0efd9aa53a" },
  { id: "74ab7668-719b-439a-b6c8-c215e520eb2c", title: "Is Andy Burnham the new Money Saving Expert?", date: "2026-08-14", time: "11:00", url: "https://www.ft.com/content/74ab7668-719b-439a-b6c8-c215e520eb2c" },
  { id: "b8c7e538-22cc-4d2f-a974-66e45a11a425", title: "Why nationalise the railways if nothing really changes?", date: "2026-08-14", time: "09:33", url: "https://www.ft.com/content/b8c7e538-22cc-4d2f-a974-66e45a11a425" },
  { id: "bb62cffe-8985-4407-b555-bdbcd2d18ec5", title: "Swiss economy grows at fastest rate since 2021 despite trade turmoil", date: "2026-08-14", time: "09:31", url: "https://www.ft.com/content/bb62cffe-8985-4407-b555-bdbcd2d18ec5" },
  { id: "c061415a-791d-42e5-9907-736563c7f938", title: "Indonesia’s Prabowo Subianto retreats on commodities reform amid market pressure", date: "2026-08-14", time: "09:05", url: "https://www.ft.com/content/c061415a-791d-42e5-9907-736563c7f938" },
  { id: "8278a799-8289-47c3-8d53-72de93ededdc", title: "Karthik Sankaran on the case for yen intervention", date: "2026-08-14", time: "06:30", url: "https://www.ft.com/content/8278a799-8289-47c3-8d53-72de93ededdc" },
  { id: "7b1117a2-ffea-4754-9da8-342db07fe963", title: "FTAV’s further reading", date: "2026-08-14", time: "06:30", url: "https://www.ft.com/content/7b1117a2-ffea-4754-9da8-342db07fe963" },
  { id: "1bc8c77b-f3e2-4ad4-aefc-94b3f48426c6", title: "Nigel Farage wins Clacton by-election", date: "2026-08-14", time: "06:08", url: "https://www.ft.com/content/1bc8c77b-f3e2-4ad4-aefc-94b3f48426c6" },
  { id: "a650dbf4-1028-428f-a4cd-e4ee91f3498a", title: "FirstFT: Cheaper Chinese models push OpenAI and Anthropic into price war", date: "2026-08-14", time: "05:30", url: "https://www.ft.com/content/a650dbf4-1028-428f-a4cd-e4ee91f3498a" },
  { id: "5d2003dc-3e04-40ac-8339-805cbd9763c8", title: "The trillion-dollar IPO vibes continue", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/5d2003dc-3e04-40ac-8339-805cbd9763c8" },
  { id: "9c0fe32f-056e-4bdc-84b4-9d72d9da9d1c", title: "New Forest blaze points to challenge for under-pressure fire services", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/9c0fe32f-056e-4bdc-84b4-9d72d9da9d1c" },
  { id: "319d874b-6d71-4802-ad4b-e2aac04fdf40", title: "Mortgage costs pushed higher by US stand-off with Iran", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/319d874b-6d71-4802-ad4b-e2aac04fdf40" },
  { id: "4e3774b6-52e5-4b8a-be76-0bb87495e1f0", title: "JPMorgan debanked Polymarket over regulatory concerns", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/4e3774b6-52e5-4b8a-be76-0bb87495e1f0" },
  { id: "5eb087c6-7a53-4f94-9588-d12f30d221df", title: "Venezuela and its opposition want gold back from Bank of England vaults", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/5eb087c6-7a53-4f94-9588-d12f30d221df" },
  { id: "ef45786a-aa0c-478f-b1bb-741e6abd8aaf", title: "Fragile states in Africa and Middle East hit by more than 40% cut in UK direct aid", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/ef45786a-aa0c-478f-b1bb-741e6abd8aaf" },
  { id: "df8ee1b1-f1bc-4c8a-a17e-f8f92a746989", title: "Owner of collapsed lender MFS to pay £3mn to his lawyers at Mishcon de Reya", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/df8ee1b1-f1bc-4c8a-a17e-f8f92a746989" },
  { id: "d4dbc028-08ac-4e49-a04d-79396f872758", title: "Banks’ private credit disclosures highlight value of sunlight", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/d4dbc028-08ac-4e49-a04d-79396f872758" },
  { id: "22f91f8b-c331-4512-a208-2b8b1a472ab4", title: "Activist Cevian calls for higher pay for UK board members", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/22f91f8b-c331-4512-a208-2b8b1a472ab4" },
  { id: "4fccf8b5-5e32-4322-9435-d996a0273dff", title: "Farage aide Cottrell had secret Polymarket account that placed bets on Trump victory", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/4fccf8b5-5e32-4322-9435-d996a0273dff" },
];
