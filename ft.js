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
  { id: "a9573d72-7bb2-462f-83d7-c0fe36f8c98d", title: "Pakistan and the new great game of Risk", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/a9573d72-7bb2-462f-83d7-c0fe36f8c98d" },
  { id: "2f06eb04-beaf-40e6-b2cc-9eedd0df1748", title: "Mike Ashley promises ‘Dunkirk spirit’ as he barrels into the luxury industry", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/2f06eb04-beaf-40e6-b2cc-9eedd0df1748" },
  { id: "7a833951-9700-46e1-bc08-d47716504138", title: "The exodus from Israel", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/7a833951-9700-46e1-bc08-d47716504138" },
  { id: "e3cd352e-5202-4748-952f-ed623ccdc774", title: "The Treasury market’s toxic codependency", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/e3cd352e-5202-4748-952f-ed623ccdc774" },
  { id: "d0cf28db-bc8d-4fc1-85b6-7b59ab67a451", title: "US investment giant T Rowe says it will take years to stem outflows", date: "2026-08-14", time: "05:00", url: "https://www.ft.com/content/d0cf28db-bc8d-4fc1-85b6-7b59ab67a451" },
  { id: "c92400d8-15d8-44fb-a069-37c29141c5ae", title: "FBI seized phone of Guggenheim executive in probe of Mark Walter’s business empire", date: "2026-08-13", time: "21:04", url: "https://www.ft.com/content/c92400d8-15d8-44fb-a069-37c29141c5ae" },
  { id: "b293b66c-8719-4956-9e76-9468dfeaa890", title: "UK houses caught up in wildfires during hottest day of the year", date: "2026-08-13", time: "20:54", url: "https://www.ft.com/content/b293b66c-8719-4956-9e76-9468dfeaa890" },
  { id: "9c9c948f-dc8b-4385-a9b9-4b98dc1eadd9", title: "US sells 30-year bonds at highest borrowing costs since 2001", date: "2026-08-13", time: "20:51", url: "https://www.ft.com/content/9c9c948f-dc8b-4385-a9b9-4b98dc1eadd9" },
  { id: "2f713878-37c6-4224-9b60-0082bb79290f", title: "EY vaults from bottom to top of Big Four US audit quality league table", date: "2026-08-13", time: "20:26", url: "https://www.ft.com/content/2f713878-37c6-4224-9b60-0082bb79290f" },
  { id: "9eca25f2-85ca-4654-a02e-ccbc638ff9eb", title: "Billionaires are taking over sports teams — and that’s a risk for fans", date: "2026-08-13", time: "19:18", url: "https://www.ft.com/content/9eca25f2-85ca-4654-a02e-ccbc638ff9eb" },
  { id: "9f299fc0-b3ed-4a60-b228-9b2cc097f222", title: "Buyers should beware the dangers of new ETFs", date: "2026-08-13", time: "18:29", url: "https://www.ft.com/content/9f299fc0-b3ed-4a60-b228-9b2cc097f222" },
  { id: "a91356ef-67bd-4bd9-947b-b272423f1318", title: "Nearly 14,000 crypto holders face security risk after data breach", date: "2026-08-13", time: "18:11", url: "https://www.ft.com/content/a91356ef-67bd-4bd9-947b-b272423f1318" },
  { id: "f3f3c945-6a75-4663-b8ec-d5251438c1c5", title: "Seoul soars past Dubai as world’s busiest international airport", date: "2026-08-13", time: "17:46", url: "https://www.ft.com/content/f3f3c945-6a75-4663-b8ec-d5251438c1c5" },
  { id: "3b67ce5d-3f1a-41a8-8d87-7356876ede14", title: "Passenger train derails near Lewes in East Sussex", date: "2026-08-13", time: "17:34", url: "https://www.ft.com/content/3b67ce5d-3f1a-41a8-8d87-7356876ede14" },
  { id: "a468c20b-cf1d-4a36-87b8-4eb15666e6c4", title: "Donald Trump enlists corporate America in fight against cyber crime", date: "2026-08-13", time: "17:28", url: "https://www.ft.com/content/a468c20b-cf1d-4a36-87b8-4eb15666e6c4" },
  { id: "5d5ed2dd-8326-4cad-aac3-5816448ceccf", title: "US accuses more than 40 countries of helping China avoid Trump’s tariffs", date: "2026-08-13", time: "16:55", url: "https://www.ft.com/content/5d5ed2dd-8326-4cad-aac3-5816448ceccf" },
  { id: "09c1ed51-8e69-4e39-bab3-392e1e9f9f6b", title: "UK government considers aid for drought-hit farmers", date: "2026-08-13", time: "16:54", url: "https://www.ft.com/content/09c1ed51-8e69-4e39-bab3-392e1e9f9f6b" },
  { id: "36ec3c60-43b4-4c94-9a7b-8b5dba798ee8", title: "Retail parks are the real threat to the British high street", date: "2026-08-13", time: "16:37", url: "https://www.ft.com/content/36ec3c60-43b4-4c94-9a7b-8b5dba798ee8" },
  { id: "e7aee58f-a068-468d-b584-49807b413016", title: "Israeli settlers besiege Palestinian homes", date: "2026-08-13", time: "16:28", url: "https://www.ft.com/content/e7aee58f-a068-468d-b584-49807b413016" },
  { id: "a547d965-eb3b-412a-9896-7d5cc37eb054", title: "Axes of Evil: office space edition", date: "2026-08-13", time: "16:17", url: "https://www.ft.com/content/a547d965-eb3b-412a-9896-7d5cc37eb054" },
  { id: "01c3117d-1c8b-4b57-b271-aea0ed607adc", title: "Andy Burnham warns water companies against treating customers like ‘blank cheque’", date: "2026-08-13", time: "15:53", url: "https://www.ft.com/content/01c3117d-1c8b-4b57-b271-aea0ed607adc" },
];
