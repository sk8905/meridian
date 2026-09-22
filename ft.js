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
  { id: "f2f37449-f9c7-4556-9f97-4cca735980e4", title: "Top UK graft prosecutors joined Trump’s Venezuela oil baron during Swiss probe", date: "2026-09-22", time: "21:00", url: "https://www.ft.com/content/f2f37449-f9c7-4556-9f97-4cca735980e4" },
  { id: "152aa77b-977f-4607-8a09-77291f85d2a0", title: "US government and Gulf billionaires back Todd Boehly bid for Lukoil assets", date: "2026-09-22", time: "21:00", url: "https://www.ft.com/content/152aa77b-977f-4607-8a09-77291f85d2a0" },
  { id: "1ca67e27-b6b6-454a-8d37-b957835201d7", title: "Labour MPs call for end to loophole that trimmed billionaire’s tax bill by £18mn", date: "2026-09-22", time: "20:51", url: "https://www.ft.com/content/1ca67e27-b6b6-454a-8d37-b957835201d7" },
  { id: "22d1154b-8bea-4f8d-bfc4-5db7761d3612", title: "Donald Trump says he would back US diesel export ban", date: "2026-09-22", time: "20:15", url: "https://www.ft.com/content/22d1154b-8bea-4f8d-bfc4-5db7761d3612" },
  { id: "be468cf8-e450-46d8-891f-67bc79ffd7b3", title: "Royal Caribbean nears deal for Sandals valuing resorts at more than $6bn", date: "2026-09-22", time: "20:01", url: "https://www.ft.com/content/be468cf8-e450-46d8-891f-67bc79ffd7b3" },
  { id: "0e03521f-c4f1-4242-8fff-0e34a27a26db", title: "Donald Trump rejects ‘globalist scheme’ to control AI in blow to Andy Burnham", date: "2026-09-22", time: "19:20", url: "https://www.ft.com/content/0e03521f-c4f1-4242-8fff-0e34a27a26db" },
  { id: "99ba134a-6252-45f3-b312-07b8752a5a98", title: "US proposes $10bn fund with Arab allies to bypass Hormuz", date: "2026-09-22", time: "18:32", url: "https://www.ft.com/content/99ba134a-6252-45f3-b312-07b8752a5a98" },
  { id: "62a6939f-7e24-492e-bdf6-b9ab9e1d3578", title: "Airtel Money poised to launch one of London’s biggest IPOs in recent years", date: "2026-09-22", time: "18:24", url: "https://www.ft.com/content/62a6939f-7e24-492e-bdf6-b9ab9e1d3578" },
  { id: "1434496d-0eaf-4270-8ad3-87724cd3721e", title: "Donald Trump threatens to ‘annihilate’ Iran in combative UN speech", date: "2026-09-22", time: "18:06", url: "https://www.ft.com/content/1434496d-0eaf-4270-8ad3-87724cd3721e" },
  { id: "848b9daf-6fc0-436d-8d9e-45e7bcab9676", title: "The next generation of American scientists is fading away", date: "2026-09-22", time: "17:03", url: "https://www.ft.com/content/848b9daf-6fc0-436d-8d9e-45e7bcab9676" },
  { id: "15d68d49-5a31-4e2a-a108-f35baa391295", title: "US fighter jet crashes in Germany", date: "2026-09-22", time: "16:46", url: "https://www.ft.com/content/15d68d49-5a31-4e2a-a108-f35baa391295" },
  { id: "760091dd-20be-4152-aa0d-561475a99ee8", title: "EU to lift sanctions on two Russian oligarchs", date: "2026-09-22", time: "16:38", url: "https://www.ft.com/content/760091dd-20be-4152-aa0d-561475a99ee8" },
  { id: "dc2f9def-a889-472e-9403-dbd1991c2360", title: "The UK Budget: what does it mean for growth and security?", date: "2026-09-22", time: "15:20", url: "https://www.ft.com/content/dc2f9def-a889-472e-9403-dbd1991c2360" },
  { id: "a2d22720-60bc-45aa-8fdc-98863df5261e", title: "Paramount wins over US states — but can it win over the bond market?", date: "2026-09-22", time: "15:12", url: "https://www.ft.com/content/a2d22720-60bc-45aa-8fdc-98863df5261e" },
  { id: "4ed1f34e-d0a5-48f2-b508-9e8ee445213f", title: "Audio Gold: the shop that really listens to London’s audiophiles", date: "2026-09-22", time: "11:00", url: "https://www.ft.com/content/4ed1f34e-d0a5-48f2-b508-9e8ee445213f" },
  { id: "460dbb45-03b8-466e-98ef-80063b07189a", title: "Ed Davey promises tax cuts as he warns Lib Dems are in ‘fight of our lives’", date: "2026-09-22", time: "15:02", url: "https://www.ft.com/content/460dbb45-03b8-466e-98ef-80063b07189a" },
  { id: "60870960-f433-48ca-bc2c-708686a69ae7", title: "AI staff complain of mental toll over fears of threat to society", date: "2026-09-22", time: "12:27", url: "https://www.ft.com/content/60870960-f433-48ca-bc2c-708686a69ae7" },
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
];
