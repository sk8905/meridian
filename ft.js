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
  { id: "4b39365f-841d-45d3-81ae-31db7f9d8f8f", title: "NYSE owner to buy bond platform MarketAxess in $5.7bn deal", date: "2026-07-30", time: "13:02", url: "https://www.ft.com/content/4b39365f-841d-45d3-81ae-31db7f9d8f8f" },
  { id: "5e74c47f-b029-4b94-8c66-d88df40a150f", title: "Albanians don’t want their islands sold off to Trump and Kushner", date: "2026-07-30", time: "13:00", url: "https://www.ft.com/content/5e74c47f-b029-4b94-8c66-d88df40a150f" },
  { id: "68274800-2971-4d50-922f-ff2b6780dc31", title: "Bank of England holds rates amid volatile energy prices", date: "2026-07-30", time: "12:44", url: "https://www.ft.com/content/68274800-2971-4d50-922f-ff2b6780dc31" },
  { id: "c8e8502f-91c2-4dcd-b39c-e99c67b93826", title: "Blue Owl’s private credit fundraising falls to slowest pace in three years", date: "2026-07-30", time: "12:26", url: "https://www.ft.com/content/c8e8502f-91c2-4dcd-b39c-e99c67b93826" },
  { id: "354bfe84-eb98-4607-ace7-c8231beafe7b", title: "France allows some wildfire evacuees to return as blazes stabilise", date: "2026-07-30", time: "12:05", url: "https://www.ft.com/content/354bfe84-eb98-4607-ace7-c8231beafe7b" },
  { id: "3936b8c9-8ce2-41f8-8687-90a2aa385e41", title: "KKR profits soar as it cashes in record amount of private equity bets", date: "2026-07-30", time: "12:01", url: "https://www.ft.com/content/3936b8c9-8ce2-41f8-8687-90a2aa385e41" },
  { id: "06d941ed-8136-46a4-a2ec-44bea1b35c3b", title: "Meta shares tumble as Mark Zuckerberg tries to sell his vision for AI ‘agents’", date: "2026-07-30", time: "11:48", url: "https://www.ft.com/content/06d941ed-8136-46a4-a2ec-44bea1b35c3b" },
  { id: "abc19970-1230-4dcc-a888-4877162db342", title: "Aston Martin investors kept in dark over details of asset shift", date: "2026-07-30", time: "11:45", url: "https://www.ft.com/content/abc19970-1230-4dcc-a888-4877162db342" },
  { id: "5fa10fcb-25fb-49e0-b77a-046b6b8b7f75", title: "There is no modern-day Maggie to save Britain from Burnhamism", date: "2026-07-30", time: "11:45", url: "https://www.ft.com/content/5fa10fcb-25fb-49e0-b77a-046b6b8b7f75" },
  { id: "57aac838-baee-406d-b4ac-c0ffda351aee", title: "Kevin Warsh’s stripped-back Fed communication ‘already backfiring’, say investors", date: "2026-07-30", time: "11:24", url: "https://www.ft.com/content/57aac838-baee-406d-b4ac-c0ffda351aee" },
  { id: "c4eedbe8-6345-48b6-8d44-5cc5b0bea2c7", title: "US borrowing costs hit 19-year high as Federal Reserve defies inflation fears", date: "2026-07-30", time: "10:03", url: "https://www.ft.com/content/c4eedbe8-6345-48b6-8d44-5cc5b0bea2c7" },
  { id: "d4236295-ce9d-45c8-b9eb-702fd45bde13", title: "Bordeaux wineries at risk from ‘zombie fires’", date: "2026-07-30", time: "11:00", url: "https://www.ft.com/content/d4236295-ce9d-45c8-b9eb-702fd45bde13" },
  { id: "77baac40-d803-4084-94f3-a133653072cf", title: "Amazon finds cases of AI causing runaway spending on tech projects", date: "2026-07-30", time: "11:00", url: "https://www.ft.com/content/77baac40-d803-4084-94f3-a133653072cf" },
  { id: "d41656fe-16c4-48aa-9f45-2a276fe0a267", title: "Foxtons cuts costs after buyer caution slashes profits", date: "2026-07-30", time: "10:47", url: "https://www.ft.com/content/d41656fe-16c4-48aa-9f45-2a276fe0a267" },
  { id: "ea820de1-9113-47cc-8888-a1d307ca6f2e", title: "Beijing pledges faster spending to support China’s economy", date: "2026-07-30", time: "10:36", url: "https://www.ft.com/content/ea820de1-9113-47cc-8888-a1d307ca6f2e" },
  { id: "23f388eb-e8ab-4fb1-b1ca-8e04eb4561a1", title: "‘My life’s screwed’: Korean investors stress out after AI bubble bursts", date: "2026-07-30", time: "10:08", url: "https://www.ft.com/content/23f388eb-e8ab-4fb1-b1ca-8e04eb4561a1" },
  { id: "9c33426e-d413-4d9b-b429-34dea508195e", title: "UK interest rates: Bank of England predicted to hold rates", date: "2026-07-30", time: "10:06", url: "https://www.ft.com/content/9c33426e-d413-4d9b-b429-34dea508195e" },
  { id: "6710a395-0141-4c3f-9620-ccf249e18091", title: "Eurozone grew by 0.4% in second quarter despite Middle East energy shock", date: "2026-07-30", time: "10:01", url: "https://www.ft.com/content/6710a395-0141-4c3f-9620-ccf249e18091" },
  { id: "77815def-6f50-4adf-8ba3-3643de7bf8ab", title: "DR Congo’s cobalt boom carries an unwanted cargo: uranium", date: "2026-07-30", time: "10:00", url: "https://www.ft.com/content/77815def-6f50-4adf-8ba3-3643de7bf8ab" },
  { id: "09e9be6a-9480-476f-8b3c-0b0f64e86f87", title: "Ukraine’s ex-defence minister blames procurement reforms for dismissal", date: "2026-07-30", time: "09:47", url: "https://www.ft.com/content/09e9be6a-9480-476f-8b3c-0b0f64e86f87" },
  { id: "7fa37140-7b45-4b19-910b-67038d532d65", title: "The Burnham bounce shouldn’t come as a surprise", date: "2026-07-30", time: "09:30", url: "https://www.ft.com/content/7fa37140-7b45-4b19-910b-67038d532d65" },
  { id: "42e83b67-cfb8-46af-b50e-3ac77748ce38", title: "US launches strikes on Iran after Donald Trump vows to deliver ‘beating’", date: "2026-07-30", time: "09:24", url: "https://www.ft.com/content/42e83b67-cfb8-46af-b50e-3ac77748ce38" },
  { id: "07e7e839-6d7c-4da3-a207-de5bbfb67746", title: "Submit your questions: Has the market lost its mind over AI?", date: "2026-07-30", time: "09:03", url: "https://www.ft.com/content/07e7e839-6d7c-4da3-a207-de5bbfb67746" },
  { id: "9c7721e8-06c7-4504-9bcd-b266cda2b33e", title: "Adidas shares tumble after profits hit by World Cup marketing spend", date: "2026-07-30", time: "08:31", url: "https://www.ft.com/content/9c7721e8-06c7-4504-9bcd-b266cda2b33e" },
  { id: "80274c4f-5a86-4ab6-b787-ed62e312971e", title: "BAE lifts profit and sales guidance following surge in orders", date: "2026-07-30", time: "08:29", url: "https://www.ft.com/content/80274c4f-5a86-4ab6-b787-ed62e312971e" },
  { id: "8691854b-eab8-42e3-b81e-0c412bc23e6b", title: "FTAV’s further reading", date: "2026-07-30", time: "08:21", url: "https://www.ft.com/content/8691854b-eab8-42e3-b81e-0c412bc23e6b" },
  { id: "f0750cf6-fa77-4dbe-b8f5-5515e42cf906", title: "SpaceX’s supply chain clampdown and China’s product power", date: "2026-07-30", time: "08:02", url: "https://www.ft.com/content/f0750cf6-fa77-4dbe-b8f5-5515e42cf906" },
  { id: "38330777-9cb4-4c4e-a0f1-bdbe72ac94a6", title: "Lloyds targets £2bn in cost cuts as it unveils four-year strategy", date: "2026-07-30", time: "07:50", url: "https://www.ft.com/content/38330777-9cb4-4c4e-a0f1-bdbe72ac94a6" },
  { id: "ed09fae4-4f30-412c-97c0-ebfb5408644d", title: "Rolls-Royce raises 2026 targets after profits beat expectations", date: "2026-07-30", time: "07:47", url: "https://www.ft.com/content/ed09fae4-4f30-412c-97c0-ebfb5408644d" },
  { id: "28a1c0fa-3ed4-4e64-b24d-227e7d13c5c7", title: "Japan’s Sanae Takaichi sticks to plan to cut food sales tax", date: "2026-07-30", time: "07:28", url: "https://www.ft.com/content/28a1c0fa-3ed4-4e64-b24d-227e7d13c5c7" },
  { id: "dacf0dba-702a-400f-b534-f73011052b1d", title: "Shell reports highest profits since 2022", date: "2026-07-30", time: "07:18", url: "https://www.ft.com/content/dacf0dba-702a-400f-b534-f73011052b1d" },
  { id: "ce198d5a-4a3b-46e8-aec3-77e5ab53ffb7", title: "Central banks slashed their gold purchases in early 2026", date: "2026-07-30", time: "07:00", url: "https://www.ft.com/content/ce198d5a-4a3b-46e8-aec3-77e5ab53ffb7" },
  { id: "a943e743-501b-4b7d-aecd-85ef60a90c20", title: "SocGen profit jumps as banking boom offsets weak trading", date: "2026-07-30", time: "06:59", url: "https://www.ft.com/content/a943e743-501b-4b7d-aecd-85ef60a90c20" },
  { id: "fe3fe258-62ab-4a71-8c8b-747f9559fd05", title: "Kevin Warsh is confusing markets", date: "2026-07-30", time: "06:30", url: "https://www.ft.com/content/fe3fe258-62ab-4a71-8c8b-747f9559fd05" },
  { id: "5052b22e-aeca-4043-88af-dd7da3661a49", title: "Chinese stocks on track for worst month in decade", date: "2026-07-30", time: "06:28", url: "https://www.ft.com/content/5052b22e-aeca-4043-88af-dd7da3661a49" },
  { id: "cc7d24ec-abfe-440b-9e85-4d725567f278", title: "Winner of US-China AI rivalry falls 10% in Hong Kong debut", date: "2026-07-30", time: "06:08", url: "https://www.ft.com/content/cc7d24ec-abfe-440b-9e85-4d725567f278" },
  { id: "480de423-de70-4bac-be56-f54502e29182", title: "Russia exploits Spain’s grounded firefighting helicopters as wildfires rage", date: "2026-07-30", time: "06:00", url: "https://www.ft.com/content/480de423-de70-4bac-be56-f54502e29182" },
  { id: "e3ed0f3d-52c0-45f5-b1f2-9b0e406026c7", title: "The corgi-inspired ETF provider that wants to disrupt BlackRock", date: "2026-07-30", time: "06:00", url: "https://www.ft.com/content/e3ed0f3d-52c0-45f5-b1f2-9b0e406026c7" },
  { id: "5035f634-7d47-483a-b8e9-722ded88a672", title: "FirstFT: Meta and Microsoft kick off turbulent tech results", date: "2026-07-30", time: "05:30", url: "https://www.ft.com/content/5035f634-7d47-483a-b8e9-722ded88a672" },
  { id: "3249b384-2a27-402b-be12-e3b3bea37440", title: "Accelerating Business", date: "2026-07-30", time: "05:17", url: "https://www.ft.com/content/3249b384-2a27-402b-be12-e3b3bea37440" },
];
