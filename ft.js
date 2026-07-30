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
  { id: "da7c4472-cb30-4b82-b321-d82c1859419e", title: "Microsoft surges 15% as results and data centre leases cheer investors", date: "2026-07-30", time: "16:50", url: "https://www.ft.com/content/da7c4472-cb30-4b82-b321-d82c1859419e" },
  { id: "44589e41-8880-4c6b-89c5-a02d34cf46ab", title: "Bank of England holds rates at 3.75% as it waits to see impact of Iran war", date: "2026-07-30", time: "16:41", url: "https://www.ft.com/content/44589e41-8880-4c6b-89c5-a02d34cf46ab" },
  { id: "b12a08f4-442c-4f10-9688-0f93553a292f", title: "European nations to boycott World Cup in protest at Fifa’s plans", date: "2026-07-30", time: "16:17", url: "https://www.ft.com/content/b12a08f4-442c-4f10-9688-0f93553a292f" },
  { id: "8455ec94-0182-46a6-b5dd-2bb5b0a75a6c", title: "Japan’s yen jumps 3% as speculation over intervention swirls", date: "2026-07-30", time: "16:07", url: "https://www.ft.com/content/8455ec94-0182-46a6-b5dd-2bb5b0a75a6c" },
  { id: "fd75ca61-c9db-41c8-97d3-80069c25beb6", title: "Declining PCE inflation in June likely to be reversed in July", date: "2026-07-30", time: "15:58", url: "https://www.ft.com/content/fd75ca61-c9db-41c8-97d3-80069c25beb6" },
  { id: "5fb44089-ecdf-4b48-bc14-1e8b4682b142", title: "Situational Awareness offloads large portion of public equity holdings", date: "2026-07-30", time: "15:31", url: "https://www.ft.com/content/5fb44089-ecdf-4b48-bc14-1e8b4682b142" },
  { id: "cc3a80fc-128b-4b46-a9a6-1a6a6988f31f", title: "Reform UK stands by Farage aide George Cottrell amid financial scrutiny", date: "2026-07-30", time: "14:52", url: "https://www.ft.com/content/cc3a80fc-128b-4b46-a9a6-1a6a6988f31f" },
  { id: "39d00795-a6b7-4950-884a-38e2ef269f22", title: "BP to cut 700 jobs as it warns on oil ‘oversupply’", date: "2026-07-30", time: "14:51", url: "https://www.ft.com/content/39d00795-a6b7-4950-884a-38e2ef269f22" },
  { id: "67238e48-57dd-4701-8294-0a11036c8742", title: "Can Vance square his Catholicism with Trump’s Republican Party?", date: "2026-07-30", time: "14:32", url: "https://www.ft.com/content/67238e48-57dd-4701-8294-0a11036c8742" },
  { id: "783dfe9a-4643-4b2b-b69c-a46e5229d707", title: "US economy grew less than expected at 1.5% rate in second quarter", date: "2026-07-30", time: "14:05", url: "https://www.ft.com/content/783dfe9a-4643-4b2b-b69c-a46e5229d707" },
  { id: "aca5b974-1447-4cd2-9d94-f4150c3d4d7e", title: "Antwerp cocaine gangs sentenced in ‘exceptionally large’ case", date: "2026-07-30", time: "13:48", url: "https://www.ft.com/content/aca5b974-1447-4cd2-9d94-f4150c3d4d7e" },
  { id: "d2807eaf-8310-4099-bb4d-b9b2d2889f2a", title: "Fifa not ‘selling the World Cup’ in $20bn commercial plan, says adviser", date: "2026-07-30", time: "13:36", url: "https://www.ft.com/content/d2807eaf-8310-4099-bb4d-b9b2d2889f2a" },
  { id: "6620ab3c-c46a-4d96-aede-0fce80a2b588", title: "Saudi economy shrinks as Middle East conflict takes heavy toll", date: "2026-07-30", time: "13:20", url: "https://www.ft.com/content/6620ab3c-c46a-4d96-aede-0fce80a2b588" },
  { id: "17bcdc30-a59f-4a1f-afa7-f2c759fe588b", title: "Trying to make sense of Warsh", date: "2026-07-30", time: "13:18", url: "https://www.ft.com/content/17bcdc30-a59f-4a1f-afa7-f2c759fe588b" },
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
];
