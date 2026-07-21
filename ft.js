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
  { id: "dd268ceb-e664-4e37-b304-e16dd5142946", title: "Psychedelic drugs are going mainstream", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/dd268ceb-e664-4e37-b304-e16dd5142946" },
  { id: "98cc3d6e-fc41-4bf1-b3fa-ca4fac8dad31", title: "The wealthy Londoners betting on a luxury retirement", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/98cc3d6e-fc41-4bf1-b3fa-ca4fac8dad31" },
  { id: "a7e0e18a-fb97-424d-a18c-bf2e1b60beb3", title: "The cult shoes of summer 2026", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/a7e0e18a-fb97-424d-a18c-bf2e1b60beb3" },
  { id: "c84bb208-127f-4d29-9f1a-a137ec3ba8d2", title: "The five fiscal challenges facing John Healey", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/c84bb208-127f-4d29-9f1a-a137ec3ba8d2" },
  { id: "c2b74307-569b-448b-a1e6-c73b64d7c90b", title: "Pointers for Burnham on what Britain really wants", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/c2b74307-569b-448b-a1e6-c73b64d7c90b" },
  { id: "6049a031-9e9b-464c-97bb-414da04d5a6a", title: "China weighs tighter export controls on AI models and chips", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/6049a031-9e9b-464c-97bb-414da04d5a6a" },
  { id: "341d3e1b-f619-486d-9fd3-79d1906d9283", title: "The Gulf nation that became Iran’s softest target", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/341d3e1b-f619-486d-9fd3-79d1906d9283" },
  { id: "8aa89209-dc0b-4678-9b6a-01029398b304", title: "Midwest sunset: Trump’s tariffs hit America’s agricultural powerhouse", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/8aa89209-dc0b-4678-9b6a-01029398b304" },
  { id: "5c48b680-daf6-40d2-9522-ad997eb07b63", title: "Gary Stevenson may have been Citi’s most profitable trader… in developed market foreign exchange", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/5c48b680-daf6-40d2-9522-ad997eb07b63" },
  { id: "dcc76c2a-b463-4c9d-830b-58044b9967ea", title: "The factory on the front line of Europe’s economic battle with China", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/dcc76c2a-b463-4c9d-830b-58044b9967ea" },
  { id: "ccaf6c42-f94b-4afc-a063-7243b4fb78ed", title: "AI is becoming a geopolitical weapon, warns EU digital chief", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/ccaf6c42-f94b-4afc-a063-7243b4fb78ed" },
  { id: "fe63e973-b720-4c9c-bbee-8a91290f1872", title: "Injectables ‘wild west’: Galderma’s race to tame the botox boom", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/fe63e973-b720-4c9c-bbee-8a91290f1872" },
  { id: "716d0651-6f1f-4215-9d98-96a5047539cd", title: "What do we do when the household appliances start chatting among themselves?", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/716d0651-6f1f-4215-9d98-96a5047539cd" },
  { id: "3778ec84-778f-4983-8ad9-85e7dbb5698d", title: "Biotech deals surge to record as fear of missing out grips Big Pharma", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/3778ec84-778f-4983-8ad9-85e7dbb5698d" },
  { id: "30250901-234b-4b48-9402-ed03cf1ff6c8", title: "Czech central bank chief warns against joining Eurozone too early", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/30250901-234b-4b48-9402-ed03cf1ff6c8" },
  { id: "05b20ea3-425b-49da-886e-fd0ac9270fe7", title: "Who is in Andy Burnham’s new cabinet?", date: "2026-07-20", time: "20:40", url: "https://www.ft.com/content/05b20ea3-425b-49da-886e-fd0ac9270fe7" },
  { id: "9f36df1b-cc5b-4391-ae91-562cf85a58a3", title: "Man charged with Ann Widdecombe murder", date: "2026-07-20", time: "19:40", url: "https://www.ft.com/content/9f36df1b-cc5b-4391-ae91-562cf85a58a3" },
];
