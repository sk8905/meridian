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
  { id: "f2a472e6-352a-4067-b9e5-56596a8ba215", title: "A spreading war threatens Trump and MBS", date: "2026-09-14", time: "12:48", url: "https://www.ft.com/content/f2a472e6-352a-4067-b9e5-56596a8ba215" },
  { id: "bdc77254-e491-4d9f-8537-6f04317d037f", title: "The Saudi relief valve is being closed", date: "2026-09-14", time: "12:31", url: "https://www.ft.com/content/bdc77254-e491-4d9f-8537-6f04317d037f" },
  { id: "ed47f038-a049-4987-b2d7-845ee7ee01d7", title: "A design quirk of Victorian pubs is back on the menu", date: "2026-09-14", time: "12:00", url: "https://www.ft.com/content/ed47f038-a049-4987-b2d7-845ee7ee01d7" },
  { id: "3df6d934-1ddf-4d56-b82d-bdd8807fc610", title: "Menswear has gone mad for mustard. Are you ready to dab?", date: "2026-09-14", time: "11:00", url: "https://www.ft.com/content/3df6d934-1ddf-4d56-b82d-bdd8807fc610" },
  { id: "8a92c5f1-a597-48f7-957a-9555d1654f0e", title: "An ode to North America’s longest saltwater pool", date: "2026-09-14", time: "09:31", url: "https://www.ft.com/content/8a92c5f1-a597-48f7-957a-9555d1654f0e" },
  { id: "5114d032-164b-4a7b-b71a-0b1f4c994af6", title: "Indonesia’s Prabowo Subianto fires finance minister after just a year", date: "2026-09-14", time: "11:06", url: "https://www.ft.com/content/5114d032-164b-4a7b-b71a-0b1f4c994af6" },
  { id: "f2b75c8a-1060-4995-9c8d-00355aaffffc", title: "Europe’s disclosure push has gone ‘too far’, says Liechtenstein", date: "2026-09-14", time: "11:00", url: "https://www.ft.com/content/f2b75c8a-1060-4995-9c8d-00355aaffffc" },
  { id: "a491245d-6f6a-4218-9289-3fa8e43632ad", title: "Submit a question: What do British businesses need from the Budget?", date: "2026-09-14", time: "10:40", url: "https://www.ft.com/content/a491245d-6f6a-4218-9289-3fa8e43632ad" },
  { id: "00455942-ad2f-4c57-8ba4-341d42e8cfce", title: "And the FTAV charts quiz winner isn’t…", date: "2026-09-14", time: "10:01", url: "https://www.ft.com/content/00455942-ad2f-4c57-8ba4-341d42e8cfce" },
  { id: "8ec31da9-9922-44e2-98c2-3225c9eb0e21", title: "Beijing launches drone buyback in crackdown after Citic Tower crash", date: "2026-09-14", time: "09:52", url: "https://www.ft.com/content/8ec31da9-9922-44e2-98c2-3225c9eb0e21" },
  { id: "3e39baca-6450-47b5-ab61-a49741aa25f7", title: "Reform’s windfall changes the mood music", date: "2026-09-14", time: "09:34", url: "https://www.ft.com/content/3e39baca-6450-47b5-ab61-a49741aa25f7" },
  { id: "aa8a1be7-abe0-44b7-bcd3-31fd0a44de08", title: "Global AI stocks under pressure as safety fears erupt", date: "2026-09-14", time: "08:39", url: "https://www.ft.com/content/aa8a1be7-abe0-44b7-bcd3-31fd0a44de08" },
  { id: "4845a503-3ddd-4bb7-a469-c51f275bc873", title: "Oil hits $108 as Gulf states postpone talks with Iran over Hormuz", date: "2026-09-14", time: "08:31", url: "https://www.ft.com/content/4845a503-3ddd-4bb7-a469-c51f275bc873" },
  { id: "b3d01493-f0f5-491b-bcf8-2d414539fbe7", title: "Can AI’s leaders really put aside rivalry for the common good?", date: "2026-09-14", time: "07:12", url: "https://www.ft.com/content/b3d01493-f0f5-491b-bcf8-2d414539fbe7" },
  { id: "e1383b40-554a-445d-a431-a7068c68aa76", title: "Pressure over Japan nuclear restart led to data manipulation, report finds", date: "2026-09-14", time: "07:05", url: "https://www.ft.com/content/e1383b40-554a-445d-a431-a7068c68aa76" },
  { id: "b8f897e4-cb25-45a8-869d-ed5aa0919d08", title: "High inflation or low credibility?", date: "2026-09-14", time: "06:30", url: "https://www.ft.com/content/b8f897e4-cb25-45a8-869d-ed5aa0919d08" },
  { id: "8715d1c6-054d-4eab-bcad-147acebfd2a9", title: "China’s spy agency warns of AI risk to national security", date: "2026-09-14", time: "06:15", url: "https://www.ft.com/content/8715d1c6-054d-4eab-bcad-147acebfd2a9" },
  { id: "b9a2d02a-d240-4512-a7fa-a8fa6f0429c8", title: "EU and Canada to toast to closer bonds in bid to rally multilateral world order", date: "2026-09-14", time: "06:00", url: "https://www.ft.com/content/b9a2d02a-d240-4512-a7fa-a8fa6f0429c8" },
  { id: "8e434151-b6ca-492f-9aba-6775529f9545", title: "Druckenmiller: no US rate cuts needed", date: "2026-09-14", time: "06:00", url: "https://www.ft.com/content/8e434151-b6ca-492f-9aba-6775529f9545" },
  { id: "988e8cb5-da27-49a6-a9f5-377b515c02ba", title: "FTAV’s further reading", date: "2026-09-14", time: "06:00", url: "https://www.ft.com/content/988e8cb5-da27-49a6-a9f5-377b515c02ba" },
  { id: "00e3c084-06e3-47b4-8230-185760216e60", title: "Swedish election on a knife-edge", date: "2026-09-14", time: "05:47", url: "https://www.ft.com/content/00e3c084-06e3-47b4-8230-185760216e60" },
  { id: "e9d90dd1-0f3c-4771-8cc7-341b3c050d8f", title: "FirstFT: Oil surge stirs UK rate rise debate", date: "2026-09-14", time: "05:38", url: "https://www.ft.com/content/e9d90dd1-0f3c-4771-8cc7-341b3c050d8f" },
  { id: "4f6a427f-3975-470f-83bf-b21423df59c8", title: "Japan’s central bank set for pivotal moment on rates", date: "2026-09-14", time: "05:15", url: "https://www.ft.com/content/4f6a427f-3975-470f-83bf-b21423df59c8" },
  { id: "904c6d93-a6b3-47f4-8b12-3d418cc74fa2", title: "Warsh and Trump on collision course as investors expect Fed to raise rates", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/904c6d93-a6b3-47f4-8b12-3d418cc74fa2" },
  { id: "130f45b6-ee45-4fa0-83eb-5ea8f9bc4680", title: "Essar strikes deal to buy 118 UK petrol stations", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/130f45b6-ee45-4fa0-83eb-5ea8f9bc4680" },
  { id: "0008bdb5-ac6c-4d72-b71f-e53a94a10f77", title: "A ‘lucky’ chancellor must also be a resolute one", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/0008bdb5-ac6c-4d72-b71f-e53a94a10f77" },
  { id: "a45a2f1f-03d9-46aa-8307-fe89edd7e589", title: "Tokenised gold could be exempt from fund regulations under FCA proposal", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/a45a2f1f-03d9-46aa-8307-fe89edd7e589" },
  { id: "639b4d2a-30c7-473c-a3ec-1fe96a7a7ac7", title: "How high might natural gas prices go?", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/639b4d2a-30c7-473c-a3ec-1fe96a7a7ac7" },
  { id: "203bc43f-8189-4156-b60d-28614e07245f", title: "Expanded ad ban on ‘less healthy’ foods could hit £1bn in UK media spending", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/203bc43f-8189-4156-b60d-28614e07245f" },
  { id: "898836da-322a-4bb8-9e62-f3c3d36b23b2", title: "European capitals barter over Christine Lagarde’s successor at ECB", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/898836da-322a-4bb8-9e62-f3c3d36b23b2" },
  { id: "cfcc5bc1-56cc-4e9f-8f0e-ef45932b76ab", title: "UK faces £258bn infrastructure spending gap, warns report", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/cfcc5bc1-56cc-4e9f-8f0e-ef45932b76ab" },
  { id: "050b2863-a164-431f-bd04-2e416adf9a38", title: "Oil price surge revives prospect of Bank of England rate rise this year", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/050b2863-a164-431f-bd04-2e416adf9a38" },
  { id: "d545bae1-d770-46f3-9913-07e85d4ae34c", title: "Cyber criminals use AI to supercharge scams, watchdog warns", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/d545bae1-d770-46f3-9913-07e85d4ae34c" },
  { id: "cf0ee7e3-8634-4c1d-8a44-3b71acee1417", title: "Euronext open to ‘big bang’ deal with rival Deutsche Börse", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/cf0ee7e3-8634-4c1d-8a44-3b71acee1417" },
  { id: "d805fcf8-e0ff-463f-bc1c-974f878fae43", title: "Start-up opens factory a mile from Tower Bridge amid defence surge", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/d805fcf8-e0ff-463f-bc1c-974f878fae43" },
  { id: "b15d9839-1d2e-4a38-9a5c-5424aeff2b3c", title: "Defence sales test Europe’s appetite for US investment", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/b15d9839-1d2e-4a38-9a5c-5424aeff2b3c" },
  { id: "8b704ae0-1fa2-4303-925f-170fa5d935b3", title: "‘Offensively cheap’: solar power is looking up", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/8b704ae0-1fa2-4303-925f-170fa5d935b3" },
  { id: "0688caee-f24f-4fa7-b04a-d1e8f9c0c03d", title: "Schroders considers acquisitions to grow wealth division", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/0688caee-f24f-4fa7-b04a-d1e8f9c0c03d" },
  { id: "76a24fc8-b521-47d6-aec9-1bf6666afd60", title: "Fed and BoJ expect rate hikes as US bond market flails", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/76a24fc8-b521-47d6-aec9-1bf6666afd60" },
  { id: "e3ba3f9a-9312-4d0b-99fd-2c80728f2dcd", title: "Trump calls on Ukraine to stop striking Russian diesel refineries", date: "2026-09-13", time: "20:08", url: "https://www.ft.com/content/e3ba3f9a-9312-4d0b-99fd-2c80728f2dcd" },
];
