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
  { id: "16d676c9-94c4-4df1-8fa6-56966b2c9aa7", title: "UN General Assembly live: Donald Trump to address world leaders at the UN", date: "2026-09-22", time: "14:05", url: "https://www.ft.com/content/16d676c9-94c4-4df1-8fa6-56966b2c9aa7" },
  { id: "cf151ce7-b284-4f8a-94e9-e27c4228a174", title: "Republican lawmakers pressure Donald Trump to ban diesel exports", date: "2026-09-22", time: "14:00", url: "https://www.ft.com/content/cf151ce7-b284-4f8a-94e9-e27c4228a174" },
  { id: "193a14eb-5650-48a8-8ead-eb8184fc50f5", title: "Pick a stock, just not any stock", date: "2026-09-22", time: "13:08", url: "https://www.ft.com/content/193a14eb-5650-48a8-8ead-eb8184fc50f5" },
  { id: "ac089dea-a121-454e-815e-0d9a380acf79", title: "Comment: Trump is checking out of his presidency", date: "2026-09-22", time: "12:54", url: "https://www.ft.com/content/ac089dea-a121-454e-815e-0d9a380acf79" },
  { id: "2715d69d-15d1-42af-a5e5-cb2a251a1ff6", title: "Warburg Pincus and CD&R near deal to buy Canaccord’s UK wealth division", date: "2026-09-22", time: "12:36", url: "https://www.ft.com/content/2715d69d-15d1-42af-a5e5-cb2a251a1ff6" },
  { id: "ba73ddd6-9fc0-49ba-909e-7305a23844dc", title: "The dying days of the Federal Reserve’s dot plot", date: "2026-09-22", time: "12:30", url: "https://www.ft.com/content/ba73ddd6-9fc0-49ba-909e-7305a23844dc" },
  { id: "5b4f8738-3b93-40c8-88d6-08c8ea684e83", title: "Oil price falls below $98 as Saudi Arabia signals reopening of East-West pipeline", date: "2026-09-22", time: "12:19", url: "https://www.ft.com/content/5b4f8738-3b93-40c8-88d6-08c8ea684e83" },
  { id: "31b63337-0531-47a6-a0ce-83f0dd7f395b", title: "European fusion start-up pushes for local supply chain as US dominates funding", date: "2026-09-22", time: "12:00", url: "https://www.ft.com/content/31b63337-0531-47a6-a0ce-83f0dd7f395b" },
  { id: "99457bcb-d98f-4719-a203-688daefcc3f7", title: "‘MBS will not forget’: Donald Trump’s reluctance to fight Houthis rattles Saudi Arabia", date: "2026-09-22", time: "12:00", url: "https://www.ft.com/content/99457bcb-d98f-4719-a203-688daefcc3f7" },
  { id: "c01af46f-378a-468e-bc54-f54e8bad22fa", title: "Venezuela’s Delcy Rodríguez cashes in on bargain with Trump", date: "2026-09-22", time: "11:56", url: "https://www.ft.com/content/c01af46f-378a-468e-bc54-f54e8bad22fa" },
  { id: "571df338-895b-4c9b-9be3-c1d2b755221b", title: "Trump is checking out of his presidency", date: "2026-09-22", time: "11:35", url: "https://www.ft.com/content/571df338-895b-4c9b-9be3-c1d2b755221b" },
  { id: "7c176006-9ec9-4083-933f-3d5cf2752e6b", title: "Ineos idles three UK chemical plants as gas prices soar", date: "2026-09-22", time: "11:27", url: "https://www.ft.com/content/7c176006-9ec9-4083-933f-3d5cf2752e6b" },
  { id: "41222e38-26db-4fd6-a7c4-4b5e5133124f", title: "Racism backlash turns obscure Texas race into Republican flashpoint", date: "2026-09-22", time: "11:00", url: "https://www.ft.com/content/41222e38-26db-4fd6-a7c4-4b5e5133124f" },
  { id: "81390c71-f365-4903-b2ad-ee5b1a763e9c", title: "Banks and fintechs gear up for fight over funding of high street hubs", date: "2026-09-22", time: "09:58", url: "https://www.ft.com/content/81390c71-f365-4903-b2ad-ee5b1a763e9c" },
  { id: "a79883c2-09f7-4079-bfae-6ab4ff4e0c34", title: "The divide that defines the Liberal Democrats", date: "2026-09-22", time: "09:49", url: "https://www.ft.com/content/a79883c2-09f7-4079-bfae-6ab4ff4e0c34" },
  { id: "8748e39c-fa8e-415b-95b4-97cca371e85f", title: "Burnham to press EU chief to let UK participate in ‘Made in Europe’ policy", date: "2026-09-22", time: "09:00", url: "https://www.ft.com/content/8748e39c-fa8e-415b-95b4-97cca371e85f" },
  { id: "ed38995e-c7be-4703-9775-eb384a037ce3", title: "China spends record amount importing over 1,000 tonnes of gold this year", date: "2026-09-22", time: "08:45", url: "https://www.ft.com/content/ed38995e-c7be-4703-9775-eb384a037ce3" },
  { id: "29ddb5e0-9313-4b18-8e67-536db187f146", title: "North Korea tests new hypersonic weapon as Kim Jong Un rebuffs talks", date: "2026-09-22", time: "08:25", url: "https://www.ft.com/content/29ddb5e0-9313-4b18-8e67-536db187f146" },
  { id: "2c60812b-77b4-4de5-a276-5e3eb2ceb5c3", title: "AI optimism lifts Asian stocks after Nasdaq ends at record high", date: "2026-09-22", time: "07:45", url: "https://www.ft.com/content/2c60812b-77b4-4de5-a276-5e3eb2ceb5c3" },
  { id: "9d97d6db-3706-4842-bcdc-3f7c58aa58c1", title: "FTAV's further reading", date: "2026-09-22", time: "07:24", url: "https://www.ft.com/content/9d97d6db-3706-4842-bcdc-3f7c58aa58c1" },
  { id: "a17b2217-e49f-432c-8fdb-31e9bc3a4361", title: "UK government borrowing surged to £18bn in August", date: "2026-09-22", time: "07:09", url: "https://www.ft.com/content/a17b2217-e49f-432c-8fdb-31e9bc3a4361" },
  { id: "89ea4c20-b9e2-4875-9439-721ca9ba9fdb", title: "Quiet please, the currencies are sleeping", date: "2026-09-22", time: "06:30", url: "https://www.ft.com/content/89ea4c20-b9e2-4875-9439-721ca9ba9fdb" },
  { id: "b30eb538-b5a3-4fb2-bae2-785273bfda1c", title: "Are we developing a distaste for effort?", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/b30eb538-b5a3-4fb2-bae2-785273bfda1c" },
  { id: "7fa1a178-7cc7-4178-a9f1-797f77e13e5b", title: "The Wargame TV review — Michael Gove plays prime minister in chilling drama-documentary", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/7fa1a178-7cc7-4178-a9f1-797f77e13e5b" },
  { id: "2a37a33b-0f9b-4763-9971-67ddfd402920", title: "Architect William Smalley’s Zen home renovation ‘stretches time’", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/2a37a33b-0f9b-4763-9971-67ddfd402920" },
  { id: "3cf6c88e-bd65-4d81-a93b-437e00f9ce3f", title: "How France and Luxembourg fatally wounded the EU’s Russia sanctions regime", date: "2026-09-22", time: "06:00", url: "https://www.ft.com/content/3cf6c88e-bd65-4d81-a93b-437e00f9ce3f" },
  { id: "a0d1351f-0f16-4994-a71e-c9b134d70d71", title: "The USS lesson plan", date: "2026-09-22", time: "06:00", url: "https://www.ft.com/content/a0d1351f-0f16-4994-a71e-c9b134d70d71" },
  { id: "51c49052-0799-4920-9189-8399f15c1f51", title: "China’s share of global container exports soars to 40%", date: "2026-09-22", time: "05:56", url: "https://www.ft.com/content/51c49052-0799-4920-9189-8399f15c1f51" },
  { id: "b77f3320-6ff0-4be6-a480-a755c754f7d8", title: "FirstFT: Kremlin-backed forgery scheme fooled global banks", date: "2026-09-22", time: "05:31", url: "https://www.ft.com/content/b77f3320-6ff0-4be6-a480-a755c754f7d8" },
  { id: "17a26bbd-ef8c-4f97-8485-5b1407bb0b41", title: "Bank of Japan set to maintain new quarterly pace of rate rises", date: "2026-09-22", time: "05:30", url: "https://www.ft.com/content/17a26bbd-ef8c-4f97-8485-5b1407bb0b41" },
  { id: "cfb43c8b-04d4-4c22-b03c-8ba210a7870a", title: "David Ellison slays foes of his $110bn goliath", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/cfb43c8b-04d4-4c22-b03c-8ba210a7870a" },
  { id: "db043fc4-c810-4834-bd6b-878d5960c630", title: "Putin’s ‘war heroes’ form new political elite in Russian parliament", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/db043fc4-c810-4834-bd6b-878d5960c630" },
  { id: "9bea08f4-c9e8-450a-9d0f-0af0bf47b64e", title: "What Xi Jinping wants from his summit with Donald Trump", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/9bea08f4-c9e8-450a-9d0f-0af0bf47b64e" },
  { id: "d773c1d5-b515-48d7-9713-14c253972e3a", title: "Deutsche Bank’s asset manager explores curbs on German property funds", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/d773c1d5-b515-48d7-9713-14c253972e3a" },
  { id: "d96c37bb-0b9b-4b2f-a6f7-4dbfce047d81", title: "Rate rises should not be ‘the only game in town’", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/d96c37bb-0b9b-4b2f-a6f7-4dbfce047d81" },
  { id: "7405f173-a962-464e-8889-6b68a6fae71e", title: "Equal pay law cannot ignore the labour market", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/7405f173-a962-464e-8889-6b68a6fae71e" },
  { id: "b891fa54-b901-45fe-a78d-1161424c0da9", title: "Germany’s economic recovery is under way if politics doesn’t spoil it", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/b891fa54-b901-45fe-a78d-1161424c0da9" },
  { id: "3c494ae7-67b3-4ca1-a9e2-f3a8356bc0a4", title: "Merz’s woes cast doubt over EU’s €2tn budget deal", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/3c494ae7-67b3-4ca1-a9e2-f3a8356bc0a4" },
  { id: "f11485ba-39fb-422c-b0ff-5e71e1fe4f44", title: "Betting on the yen: the risks of the carry trade", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/f11485ba-39fb-422c-b0ff-5e71e1fe4f44" },
  { id: "5b019594-5b20-479a-8549-7b564127eb3f", title: "London’s schools are running out of children", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/5b019594-5b20-479a-8549-7b564127eb3f" },
];
