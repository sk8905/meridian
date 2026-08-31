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
  { id: "eddde22c-aa99-468d-9fb0-36f3edd6e04f", title: "Prediction platform Kalshi bans ex-US Congress member for manipulation", date: "2026-08-31", time: "17:14", url: "https://www.ft.com/content/eddde22c-aa99-468d-9fb0-36f3edd6e04f" },
  { id: "96691b37-1360-4f32-b267-ec8fc3a05370", title: "Israel’s de facto annexation of the West Bank", date: "2026-08-31", time: "16:57", url: "https://www.ft.com/content/96691b37-1360-4f32-b267-ec8fc3a05370" },
  { id: "369558d0-357c-41e7-aa1e-dc1c1c07457d", title: "Don’t write off Russia’s defence industry yet", date: "2026-08-31", time: "16:53", url: "https://www.ft.com/content/369558d0-357c-41e7-aa1e-dc1c1c07457d" },
  { id: "46bf442d-175b-4347-8ef6-e3d80ae6ea63", title: "Trump’s tariff fix leaves US trade policy in permanent flux", date: "2026-08-31", time: "16:07", url: "https://www.ft.com/content/46bf442d-175b-4347-8ef6-e3d80ae6ea63" },
  { id: "0f74b589-3fdf-447d-aa44-9570496bf7c7", title: "Whose fiscal problems would you prefer?", date: "2026-08-31", time: "15:17", url: "https://www.ft.com/content/0f74b589-3fdf-447d-aa44-9570496bf7c7" },
  { id: "8b09b3fc-bb61-4d9f-aac6-bcef9883fa16", title: "Donald Trump says US will hit Iran ‘hard’ as conflict reignites", date: "2026-08-31", time: "14:22", url: "https://www.ft.com/content/8b09b3fc-bb61-4d9f-aac6-bcef9883fa16" },
  { id: "88447c72-5510-4847-9908-cf630acfcc1f", title: "India’s GDP beats growth forecast at 7.8%", date: "2026-08-31", time: "14:21", url: "https://www.ft.com/content/88447c72-5510-4847-9908-cf630acfcc1f" },
  { id: "f16c178f-b07c-4b79-a8fc-2bf4c70d43e2", title: "Mel Stride sacked as shadow chancellor", date: "2026-08-31", time: "13:30", url: "https://www.ft.com/content/f16c178f-b07c-4b79-a8fc-2bf4c70d43e2" },
  { id: "306358c2-3597-40dd-b2cd-534073c35fde", title: "Spain’s Sánchez accuses Russia and Israel of inflaming migrant crisis", date: "2026-08-31", time: "13:28", url: "https://www.ft.com/content/306358c2-3597-40dd-b2cd-534073c35fde" },
  { id: "c0341d15-482e-41a6-abe1-ef3e5e9a0d0b", title: "Happy birthday to the First Index Investment Trust", date: "2026-08-31", time: "13:23", url: "https://www.ft.com/content/c0341d15-482e-41a6-abe1-ef3e5e9a0d0b" },
  { id: "6af706a3-6e63-46c2-926b-85461a355e9b", title: "ChatGPT faces tougher rules under EU online safety regime", date: "2026-08-31", time: "12:06", url: "https://www.ft.com/content/6af706a3-6e63-46c2-926b-85461a355e9b" },
  { id: "485a3d1c-d282-4921-9dee-c644c5856030", title: "Software companies pay steep price to buy time against AI threat", date: "2026-08-31", time: "12:00", url: "https://www.ft.com/content/485a3d1c-d282-4921-9dee-c644c5856030" },
  { id: "23125dd8-2d09-4c6a-8e55-3245741fba45", title: "KKR to net giant windfall from $17bn sale of USI to Aon", date: "2026-08-31", time: "11:31", url: "https://www.ft.com/content/23125dd8-2d09-4c6a-8e55-3245741fba45" },
  { id: "5a10fc78-9a3e-4f12-81e3-dc843b529948", title: "UK offers homegrown AI start-ups £100mn to improve public services", date: "2026-08-31", time: "11:24", url: "https://www.ft.com/content/5a10fc78-9a3e-4f12-81e3-dc843b529948" },
  { id: "35921f10-fdbd-4ca6-b616-694bdaab50a6", title: "And the FTAV chart quiz winner is . . .", date: "2026-08-31", time: "11:11", url: "https://www.ft.com/content/35921f10-fdbd-4ca6-b616-694bdaab50a6" },
  { id: "f060d145-3c1f-4a91-9ed8-ccc364df9c63", title: "The missing piece in the US oil and gas boom: jobs", date: "2026-08-31", time: "11:00", url: "https://www.ft.com/content/f060d145-3c1f-4a91-9ed8-ccc364df9c63" },
  { id: "5bb22de2-f4ca-4f04-b8c0-85cda99d8576", title: "It’s not insider trading, it’s offshore gambling!", date: "2026-08-31", time: "09:09", url: "https://www.ft.com/content/5bb22de2-f4ca-4f04-b8c0-85cda99d8576" },
  { id: "1c4f488f-32bc-4b49-a0c8-c55d95f5422b", title: "Japanese bonds and yen come under pressure after Jackson Hole meeting", date: "2026-08-31", time: "08:32", url: "https://www.ft.com/content/1c4f488f-32bc-4b49-a0c8-c55d95f5422b" },
  { id: "bb4182ee-1fb9-4374-a557-c3d36d66ace0", title: "South Korea jails Unification Church leader over luxury bag bribery scandal", date: "2026-08-31", time: "08:21", url: "https://www.ft.com/content/bb4182ee-1fb9-4374-a557-c3d36d66ace0" },
  { id: "ed723a59-a889-40e0-b601-0c1f16c92f65", title: "Andrew Bailey warns G20 of danger AI poses to financial system", date: "2026-08-31", time: "07:02", url: "https://www.ft.com/content/ed723a59-a889-40e0-b601-0c1f16c92f65" },
  { id: "b7d182b3-837f-4161-bd3c-ec9b78b41c45", title: "Iceland tarnishes EU’s dreams of being a defence and security hegemon", date: "2026-08-31", time: "06:00", url: "https://www.ft.com/content/b7d182b3-837f-4161-bd3c-ec9b78b41c45" },
  { id: "bddb9558-a00f-4407-8e77-dbf5549fbd0b", title: "Jane Street’s AI bets go sour", date: "2026-08-31", time: "06:00", url: "https://www.ft.com/content/bddb9558-a00f-4407-8e77-dbf5549fbd0b" },
  { id: "ff42d33c-9cb9-4707-8250-677af16fb0b6", title: "FTAV’s further reading", date: "2026-08-31", time: "06:00", url: "https://www.ft.com/content/ff42d33c-9cb9-4707-8250-677af16fb0b6" },
  { id: "51c907e1-1177-4489-b4b8-fb044f5b257d", title: "FirstFT: Ukraine’s ex-defence minister pitches tech fund", date: "2026-08-31", time: "05:31", url: "https://www.ft.com/content/51c907e1-1177-4489-b4b8-fb044f5b257d" },
  { id: "f270814f-e836-44e8-80c2-ec1034f80519", title: "US and Iran exchange fire for the first time in more than a month", date: "2026-08-31", time: "05:15", url: "https://www.ft.com/content/f270814f-e836-44e8-80c2-ec1034f80519" },
  { id: "5051e92f-371f-4a46-bdee-e8877b68caf8", title: "LIV Golf prepares for bankruptcy filing in September", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/5051e92f-371f-4a46-bdee-e8877b68caf8" },
  { id: "c07c2073-5003-4edf-b274-1aafd446730b", title: "Scramble for gas assets pushes dealmaking to decade high", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/c07c2073-5003-4edf-b274-1aafd446730b" },
  { id: "febfe4ef-95d4-4bf7-8c48-0fca02671661", title: "UK investment trusts struggle to keep up the liquidity illusion", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/febfe4ef-95d4-4bf7-8c48-0fca02671661" },
  { id: "9914f45e-4e5c-4f6e-990b-043a65fb7ebf", title: "Romania to lose €770mn in EU funds due to government crisis", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/9914f45e-4e5c-4f6e-990b-043a65fb7ebf" },
  { id: "2ca855a9-be0d-4915-b4f0-b48355c6aa4a", title: "The face of America’s socialist insurgency", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/2ca855a9-be0d-4915-b4f0-b48355c6aa4a" },
  { id: "1481e787-77dc-4d54-8871-8ffb369e5dd3", title: "Will financial innovation dethrone the dollar?", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/1481e787-77dc-4d54-8871-8ffb369e5dd3" },
  { id: "de28524f-0085-4d2a-90f3-4d555e93c7bc", title: "Labour shelves plan to restrict foreigners buying new flats", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/de28524f-0085-4d2a-90f3-4d555e93c7bc" },
  { id: "e89c9f04-b574-4a09-b123-02dac8335ba4", title: "UK fintech Allica looks to Sweden to kick-start European expansion", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/e89c9f04-b574-4a09-b123-02dac8335ba4" },
  { id: "886acdbf-7a9d-4af3-a2e7-3c4a2e446370", title: "Tim Cook’s legacy by the numbers", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/886acdbf-7a9d-4af3-a2e7-3c4a2e446370" },
  { id: "fc8f86f2-96ad-4bfb-bba4-75326115aa24", title: "The rise of physical AI: can robots save US manufacturing?", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/fc8f86f2-96ad-4bfb-bba4-75326115aa24" },
  { id: "18f9f4ce-e437-435e-ad8e-a043ea181161", title: "Argentina battles flood of contraband goods as Milei opens economy", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/18f9f4ce-e437-435e-ad8e-a043ea181161" },
  { id: "b3e84c50-c761-4179-beac-68641e61207e", title: "Crypto groups spend record $640mn buying back their own tokens", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/b3e84c50-c761-4179-beac-68641e61207e" },
  { id: "fc3fce3b-18d2-4340-ac0f-aa2964aa6147", title: "Trump’s threats against Canada are self-defeating", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/fc3fce3b-18d2-4340-ac0f-aa2964aa6147" },
  { id: "94b17d45-0a07-41e0-9597-57ca8918b8bd", title: "After years of losses, Victoria Beckham marks her brand’s turnaround", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/94b17d45-0a07-41e0-9597-57ca8918b8bd" },
  { id: "53d35170-2b41-4c21-8b41-345158ef0be1", title: "German gunmaker with loaded history sets sights on British army’s next rifle", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/53d35170-2b41-4c21-8b41-345158ef0be1" },
  { id: "55a5df36-4f1a-4ff3-8986-3a06db58a39a", title: "London’s Aim market faces existential crisis", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/55a5df36-4f1a-4ff3-8986-3a06db58a39a" },
];
