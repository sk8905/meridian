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
  { id: "4b90b384-47d7-40ff-8b0d-7a33420ea29f", title: "Ares secures biggest flagship credit fund commitments in three years", date: "2026-07-31", time: "11:03", url: "https://www.ft.com/content/4b90b384-47d7-40ff-8b0d-7a33420ea29f" },
  { id: "babf4c89-1a6f-447f-a17e-7e3e48f359b8", title: "Coal back in favour as US plant bidding war highlights rising demand to power AI", date: "2026-07-31", time: "11:00", url: "https://www.ft.com/content/babf4c89-1a6f-447f-a17e-7e3e48f359b8" },
  { id: "34917d6f-c8ec-4e13-890a-4d8475806bb7", title: "Spain says 49,000 migrants entered Ceuta enclave in one day", date: "2026-07-31", time: "10:59", url: "https://www.ft.com/content/34917d6f-c8ec-4e13-890a-4d8475806bb7" },
  { id: "3fa19368-0cb3-4802-8651-aca61c3f9fba", title: "FTAV’s Friday charts quiz", date: "2026-07-31", time: "10:30", url: "https://www.ft.com/content/3fa19368-0cb3-4802-8651-aca61c3f9fba" },
  { id: "cb149846-6032-4883-8695-685e4e8dd886", title: "Bank of Japan holds rates with hawkish guidance", date: "2026-07-31", time: "10:28", url: "https://www.ft.com/content/cb149846-6032-4883-8695-685e4e8dd886" },
  { id: "f1fecefc-7de6-40e3-9bc9-a58d5b653386", title: "Taylor Wimpey cuts shareholder returns as weak housing market squeezes builders", date: "2026-07-31", time: "10:13", url: "https://www.ft.com/content/f1fecefc-7de6-40e3-9bc9-a58d5b653386" },
  { id: "f54e632e-f8b4-4554-9f2e-c8a2ded0555b", title: "Eurozone inflation rises to 2.9% in July", date: "2026-07-31", time: "10:01", url: "https://www.ft.com/content/f54e632e-f8b4-4554-9f2e-c8a2ded0555b" },
  { id: "26da67f5-e630-4552-b327-f01d45b6c7c5", title: "Mayoral scrutiny is a pressing issue", date: "2026-07-31", time: "09:30", url: "https://www.ft.com/content/26da67f5-e630-4552-b327-f01d45b6c7c5" },
  { id: "160a686b-6573-4192-9281-7cf28912f1ed", title: "Andy Burnham to give English mayors share of income tax from 2028", date: "2026-07-31", time: "08:44", url: "https://www.ft.com/content/160a686b-6573-4192-9281-7cf28912f1ed" },
  { id: "613cd8b0-e8c5-45d2-a7f3-184e63d82e08", title: "Fifa opens door to amending controversial stake sale plan", date: "2026-07-31", time: "08:21", url: "https://www.ft.com/content/613cd8b0-e8c5-45d2-a7f3-184e63d82e08" },
  { id: "23eb1fd4-8301-4c0e-89b3-2647389e6226", title: "South Korean stock market soars 18% as investors pile back into AI", date: "2026-07-31", time: "08:10", url: "https://www.ft.com/content/23eb1fd4-8301-4c0e-89b3-2647389e6226" },
  { id: "5f3930b9-e7ce-4b87-878f-74cf7f16f642", title: "The dark arts of securitisation", date: "2026-07-31", time: "08:09", url: "https://www.ft.com/content/5f3930b9-e7ce-4b87-878f-74cf7f16f642" },
  { id: "77847a1c-de27-4bab-b7dc-3dd57e3d3e4d", title: "NatWest profits buoyed by retail and wealth units", date: "2026-07-31", time: "08:05", url: "https://www.ft.com/content/77847a1c-de27-4bab-b7dc-3dd57e3d3e4d" },
  { id: "e874feaf-38de-479d-937b-05daa5a021a9", title: "Sainsbury’s strikes deal to sell Argos for £120mn to Swift Partners", date: "2026-07-31", time: "07:47", url: "https://www.ft.com/content/e874feaf-38de-479d-937b-05daa5a021a9" },
  { id: "c14b255c-cdda-4ba8-8139-f10e862a4235", title: "British Airways owner IAG ditches growth plans amid Iran conflict", date: "2026-07-31", time: "07:36", url: "https://www.ft.com/content/c14b255c-cdda-4ba8-8139-f10e862a4235" },
  { id: "e4cec5e1-a4e9-449b-a411-da1c025af2e8", title: "Donald Trump says Hamas has agreed to disarm over time", date: "2026-07-31", time: "07:13", url: "https://www.ft.com/content/e4cec5e1-a4e9-449b-a411-da1c025af2e8" },
  { id: "420ea1bc-6f85-4065-ad76-61e685aa1de2", title: "BP puts its UK North Sea business up for sale", date: "2026-07-31", time: "07:11", url: "https://www.ft.com/content/420ea1bc-6f85-4065-ad76-61e685aa1de2" },
  { id: "b1267def-3590-4482-9833-d09f0b1230b8", title: "What Warsh is (probably) up to", date: "2026-07-31", time: "06:30", url: "https://www.ft.com/content/b1267def-3590-4482-9833-d09f0b1230b8" },
  { id: "e7a03462-3d77-464a-b268-386d75f8ff47", title: "FTAV’s further reading", date: "2026-07-31", time: "06:30", url: "https://www.ft.com/content/e7a03462-3d77-464a-b268-386d75f8ff47" },
  { id: "d4f3134b-1e04-4c0b-a1be-7bdaa6a44c64", title: "Iceland’s EU referendum on knife-edge as bloc braces for enlargement litmus test", date: "2026-07-31", time: "06:00", url: "https://www.ft.com/content/d4f3134b-1e04-4c0b-a1be-7bdaa6a44c64" },
  { id: "67e045bb-76cc-404f-a04c-073411eedfc5", title: "FirstFT: Europe vows World Cup boycott in Fifa protest", date: "2026-07-31", time: "05:44", url: "https://www.ft.com/content/67e045bb-76cc-404f-a04c-073411eedfc5" },
  { id: "51ed81fb-0361-4a5f-8d48-a2352be7e543", title: "The Fed will face a pivotal meeting in September unless there is a durable ceasefire", date: "2026-07-31", time: "05:30", url: "https://www.ft.com/content/51ed81fb-0361-4a5f-8d48-a2352be7e543" },
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
];
