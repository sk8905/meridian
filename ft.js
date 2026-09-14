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
  { id: "4845a503-3ddd-4bb7-a469-c51f275bc873", title: "Oil hits $109 after Saudi Arabia closes vital export pipeline", date: "2026-09-14", time: "17:31", url: "https://www.ft.com/content/4845a503-3ddd-4bb7-a469-c51f275bc873" },
  { id: "7beb54c6-ed34-40d8-baa8-f1c0a2e8f0c3", title: "We won’t solve young people’s worklessness without listening to them", date: "2026-09-14", time: "17:29", url: "https://www.ft.com/content/7beb54c6-ed34-40d8-baa8-f1c0a2e8f0c3" },
  { id: "b01682ae-1d49-46bb-b23a-d6212574214d", title: "France in ‘astonishing’ push to lift EU sanctions on Russian oligarch", date: "2026-09-14", time: "17:19", url: "https://www.ft.com/content/b01682ae-1d49-46bb-b23a-d6212574214d" },
  { id: "2b8c8997-0a76-4c48-9384-aac94904b7fb", title: "UK government to take over insolvent steelmaker", date: "2026-09-14", time: "17:17", url: "https://www.ft.com/content/2b8c8997-0a76-4c48-9384-aac94904b7fb" },
  { id: "68599310-58ae-4a11-b885-3e34ebaa8af9", title: "Britain’s assisted dying debate was hobbled by a lack of candour", date: "2026-09-14", time: "17:04", url: "https://www.ft.com/content/68599310-58ae-4a11-b885-3e34ebaa8af9" },
  { id: "b78370c8-dc35-47ea-a254-a75421a46a85", title: "Syrians take to the streets over fuel price rise", date: "2026-09-14", time: "17:01", url: "https://www.ft.com/content/b78370c8-dc35-47ea-a254-a75421a46a85" },
  { id: "aa8a1be7-abe0-44b7-bcd3-31fd0a44de08", title: "US tech stocks fall after big AI groups call for slowdown", date: "2026-09-14", time: "16:51", url: "https://www.ft.com/content/aa8a1be7-abe0-44b7-bcd3-31fd0a44de08" },
  { id: "4205babe-1db0-4507-be8f-70b1e8954c7f", title: "America’s superheroes moved to Britain, but will they stay?", date: "2026-09-14", time: "15:53", url: "https://www.ft.com/content/4205babe-1db0-4507-be8f-70b1e8954c7f" },
  { id: "06cb850d-089a-4318-88d7-a410e9766b89", title: "Ten-year Treasury yield hits 5% for first time since 2023", date: "2026-09-14", time: "15:51", url: "https://www.ft.com/content/06cb850d-089a-4318-88d7-a410e9766b89" },
  { id: "24eda5dc-3a2c-489c-a304-1c1451f7c2a7", title: "Stoltenberg reneges on Munich Security Conference top job plan", date: "2026-09-14", time: "15:42", url: "https://www.ft.com/content/24eda5dc-3a2c-489c-a304-1c1451f7c2a7" },
  { id: "ba38df40-9898-48a0-bc9e-39d8a3da4305", title: "How much should lenders charge hyperscalers?", date: "2026-09-14", time: "15:23", url: "https://www.ft.com/content/ba38df40-9898-48a0-bc9e-39d8a3da4305" },
  { id: "5495d88b-b457-498a-bedd-64a954b538cd", title: "Michael Dell’s family office leads $7.7bn deal to take insurance broker private", date: "2026-09-14", time: "14:17", url: "https://www.ft.com/content/5495d88b-b457-498a-bedd-64a954b538cd" },
  { id: "2c143d02-7fbd-4aa2-922c-f9afc8044dbe", title: "Monetary Policy Radar preview: Fed September meeting", date: "2026-09-14", time: "14:03", url: "https://www.ft.com/content/2c143d02-7fbd-4aa2-922c-f9afc8044dbe" },
  { id: "296b56d1-a30e-43cf-ac15-8a42de5cd59a", title: "The politics of AI, part two", date: "2026-09-14", time: "14:00", url: "https://www.ft.com/content/296b56d1-a30e-43cf-ac15-8a42de5cd59a" },
  { id: "dd6af02e-9328-48f6-9054-4623cf65b8b1", title: "Keir Starmer approved £860,000 pay-off for sacked civil service chief", date: "2026-09-14", time: "14:00", url: "https://www.ft.com/content/dd6af02e-9328-48f6-9054-4623cf65b8b1" },
  { id: "bd8a8a3f-220c-4f52-9a54-1eca0a4e0423", title: "Crispin Odey loses appeal against industry ban", date: "2026-09-14", time: "13:42", url: "https://www.ft.com/content/bd8a8a3f-220c-4f52-9a54-1eca0a4e0423" },
  { id: "bab5c4c5-5377-4dd0-8b46-d8c4ce9a36d5", title: "Steve Bannon and Bernie Sanders unite in AI safety call", date: "2026-09-14", time: "13:40", url: "https://www.ft.com/content/bab5c4c5-5377-4dd0-8b46-d8c4ce9a36d5" },
  { id: "d591b5ce-69b4-4bf7-ac05-95341076ac59", title: "Monetary Policy Radar preview: BoJ’s September meeting", date: "2026-09-14", time: "13:39", url: "https://www.ft.com/content/d591b5ce-69b4-4bf7-ac05-95341076ac59" },
  { id: "f395dab5-29cd-401b-bbaa-a546da9908e3", title: "Zelenskyy imposes sanctions on former aide turned critic", date: "2026-09-14", time: "13:26", url: "https://www.ft.com/content/f395dab5-29cd-401b-bbaa-a546da9908e3" },
  { id: "f2a472e6-352a-4067-b9e5-56596a8ba215", title: "A spreading war threatens Trump and MBS", date: "2026-09-14", time: "12:48", url: "https://www.ft.com/content/f2a472e6-352a-4067-b9e5-56596a8ba215" },
  { id: "bdc77254-e491-4d9f-8537-6f04317d037f", title: "The Saudi relief valve is being closed", date: "2026-09-14", time: "12:31", url: "https://www.ft.com/content/bdc77254-e491-4d9f-8537-6f04317d037f" },
  { id: "ed47f038-a049-4987-b2d7-845ee7ee01d7", title: "A design quirk of Victorian pubs is back on the menu", date: "2026-09-14", time: "12:00", url: "https://www.ft.com/content/ed47f038-a049-4987-b2d7-845ee7ee01d7" },
  { id: "5114d032-164b-4a7b-b71a-0b1f4c994af6", title: "Indonesia’s Prabowo Subianto fires finance minister after just a year", date: "2026-09-14", time: "11:06", url: "https://www.ft.com/content/5114d032-164b-4a7b-b71a-0b1f4c994af6" },
  { id: "3df6d934-1ddf-4d56-b82d-bdd8807fc610", title: "Menswear has gone mad for mustard. Are you ready to dab?", date: "2026-09-14", time: "11:00", url: "https://www.ft.com/content/3df6d934-1ddf-4d56-b82d-bdd8807fc610" },
  { id: "f2b75c8a-1060-4995-9c8d-00355aaffffc", title: "Europe’s disclosure push has gone ‘too far’, says Liechtenstein", date: "2026-09-14", time: "11:00", url: "https://www.ft.com/content/f2b75c8a-1060-4995-9c8d-00355aaffffc" },
  { id: "a491245d-6f6a-4218-9289-3fa8e43632ad", title: "Submit a question: What do British businesses need from the Budget?", date: "2026-09-14", time: "10:40", url: "https://www.ft.com/content/a491245d-6f6a-4218-9289-3fa8e43632ad" },
  { id: "00455942-ad2f-4c57-8ba4-341d42e8cfce", title: "And the FTAV charts quiz winner isn’t…", date: "2026-09-14", time: "10:01", url: "https://www.ft.com/content/00455942-ad2f-4c57-8ba4-341d42e8cfce" },
  { id: "8ec31da9-9922-44e2-98c2-3225c9eb0e21", title: "Beijing launches drone buyback in crackdown after Citic Tower crash", date: "2026-09-14", time: "09:52", url: "https://www.ft.com/content/8ec31da9-9922-44e2-98c2-3225c9eb0e21" },
  { id: "3e39baca-6450-47b5-ab61-a49741aa25f7", title: "Reform’s windfall changes the mood music", date: "2026-09-14", time: "09:34", url: "https://www.ft.com/content/3e39baca-6450-47b5-ab61-a49741aa25f7" },
  { id: "8a92c5f1-a597-48f7-957a-9555d1654f0e", title: "An ode to North America’s longest saltwater pool", date: "2026-09-14", time: "09:31", url: "https://www.ft.com/content/8a92c5f1-a597-48f7-957a-9555d1654f0e" },
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
];
