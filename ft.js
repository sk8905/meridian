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
  { id: "1119df7d-8994-4077-99fb-817400416d2d", title: "Ken Griffin’s Situational Awareness", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/1119df7d-8994-4077-99fb-817400416d2d" },
  { id: "e5cb0cce-c2f5-4dae-8126-a2d3e9063dde", title: "Rhine drought strands ships and forces German production shutdowns", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/e5cb0cce-c2f5-4dae-8126-a2d3e9063dde" },
  { id: "6a35508c-c0bd-4000-81b3-7c7383fb24fd", title: "We’ve moved from income world to wealth world", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/6a35508c-c0bd-4000-81b3-7c7383fb24fd" },
  { id: "7a5c560a-862b-47e4-9896-196ee9494739", title: "How investors should brace portfolios for tech volatility", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/7a5c560a-862b-47e4-9896-196ee9494739" },
  { id: "7b2dd2b2-36f5-469b-a13e-19e936c22bea", title: "FCA launches new push to revive London share trading", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/7b2dd2b2-36f5-469b-a13e-19e936c22bea" },
  { id: "c81dd7e8-9f4b-415f-aa08-eb2b3b1f3680", title: "How JPMorgan walked into another football firestorm", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/c81dd7e8-9f4b-415f-aa08-eb2b3b1f3680" },
  { id: "4de8bfa8-9eb3-4d70-bd17-273a6834dd41", title: "US regulators cite ‘circular’ risk in investments used by KKR and Apollo", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/4de8bfa8-9eb3-4d70-bd17-273a6834dd41" },
  { id: "49321caa-61ce-4e25-9c2e-e354b285c92b", title: "Britain’s climate divide widens amid fires and heat deaths", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/49321caa-61ce-4e25-9c2e-e354b285c92b" },
  { id: "066066cf-d45b-436c-9170-b42097a4b141", title: "Russia targets hundreds of Ukrainian petrol stations", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/066066cf-d45b-436c-9170-b42097a4b141" },
  { id: "871976c7-8c4f-405e-803e-d86cf22bcf0f", title: "China is smarter about subsidies than everybody else", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/871976c7-8c4f-405e-803e-d86cf22bcf0f" },
  { id: "229f215f-9be0-4afe-a4d7-378aadbf87c5", title: "The return of Boeing", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/229f215f-9be0-4afe-a4d7-378aadbf87c5" },
  { id: "18a12375-2370-4ccd-8e81-528fcb9ac33b", title: "Is Wetherspoons too cheap to thrive in high-cost UK?", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/18a12375-2370-4ccd-8e81-528fcb9ac33b" },
  { id: "e9512442-7374-42dd-9979-d625131b84da", title: "JPMorgan walks into another football firestorm", date: "2026-07-31", time: "05:00", url: "https://www.ft.com/content/e9512442-7374-42dd-9979-d625131b84da" },
  { id: "181a7596-a891-4b88-9a22-8f447a9e8b91", title: "China’s factory activity falls for first time in five months", date: "2026-07-31", time: "04:47", url: "https://www.ft.com/content/181a7596-a891-4b88-9a22-8f447a9e8b91" },
  { id: "4adacb3e-cf24-4474-bfa1-c62a99676e21", title: "Potato chips and the silicon kind are surprisingly similar", date: "2026-07-31", time: "04:00", url: "https://www.ft.com/content/4adacb3e-cf24-4474-bfa1-c62a99676e21" },
  { id: "aa292d6f-3b12-4b7a-b558-7306e8d03b9e", title: "Sandwich maker Jersey Mike’s and retailer Reformation fail to excite IPO investors", date: "2026-07-30", time: "20:20", url: "https://www.ft.com/content/aa292d6f-3b12-4b7a-b558-7306e8d03b9e" },
  { id: "6d206b85-bc50-4c89-973b-f18cd84e2a15", title: "Mark Zuckerberg is becoming the king of the ‘side quest’", date: "2026-07-30", time: "19:16", url: "https://www.ft.com/content/6d206b85-bc50-4c89-973b-f18cd84e2a15" },
  { id: "3cbee183-fd1f-4afc-8376-2115e66dda6c", title: "Kevin Warsh’s concerning communication style", date: "2026-07-30", time: "18:35", url: "https://www.ft.com/content/3cbee183-fd1f-4afc-8376-2115e66dda6c" },
  { id: "d6df67d4-b8be-4e14-b856-29852e249577", title: "China is not the solution to the US chipflation problem", date: "2026-07-30", time: "18:24", url: "https://www.ft.com/content/d6df67d4-b8be-4e14-b856-29852e249577" },
  { id: "00d91e68-9508-42bd-b1e3-124bf7dd390b", title: "Are investors really getting cold feet about the AI boom?", date: "2026-07-30", time: "18:15", url: "https://www.ft.com/content/00d91e68-9508-42bd-b1e3-124bf7dd390b" },
  { id: "5546b044-0582-4ed9-8e61-bd1732f3063e", title: "Thousands of Moroccans swim to Spanish enclave", date: "2026-07-30", time: "17:51", url: "https://www.ft.com/content/5546b044-0582-4ed9-8e61-bd1732f3063e" },
  { id: "655a05ff-ec45-492d-a70e-4f8ba8dc141f", title: "Data suggests fears of UK ‘non-dom’ exodus overblown", date: "2026-07-30", time: "17:31", url: "https://www.ft.com/content/655a05ff-ec45-492d-a70e-4f8ba8dc141f" },
  { id: "928f3d86-32ff-4410-99a9-7a41e49624bd", title: "Donald Trump says he could withdraw Todd Blanche’s nomination for attorney-general", date: "2026-07-30", time: "17:21", url: "https://www.ft.com/content/928f3d86-32ff-4410-99a9-7a41e49624bd" },
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
];
