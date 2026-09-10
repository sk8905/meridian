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
  { id: "b1141d4b-e2f6-409e-8a74-1ce8d38f7d6a", title: "Israel’s hapless British defenders", date: "2026-09-10", time: "12:05", url: "https://www.ft.com/content/b1141d4b-e2f6-409e-8a74-1ce8d38f7d6a" },
  { id: "b05629bb-0c2d-419c-a3a2-910a811ac0a9", title: "Big Tech has replaced Big Oil as Public Enemy No 1, says US shale boss", date: "2026-09-10", time: "12:00", url: "https://www.ft.com/content/b05629bb-0c2d-419c-a3a2-910a811ac0a9" },
  { id: "796f0045-d300-4e22-be82-fa9a111fb634", title: "Is now really the time to worry about a new China shock?", date: "2026-09-10", time: "12:00", url: "https://www.ft.com/content/796f0045-d300-4e22-be82-fa9a111fb634" },
  { id: "360dfa5f-1ed8-441e-b926-486af101be17", title: "Foreign Office to appoint first female head after Mandelson turmoil", date: "2026-09-10", time: "11:58", url: "https://www.ft.com/content/360dfa5f-1ed8-441e-b926-486af101be17" },
  { id: "718a525e-d6d8-4944-b149-95c57212c168", title: "UK banks don’t have a windfall to tax", date: "2026-09-10", time: "11:37", url: "https://www.ft.com/content/718a525e-d6d8-4944-b149-95c57212c168" },
  { id: "a4b8c8ac-56cf-4f6e-9050-4292f37252ad", title: "Ryanair investors revolt over Michael O’Leary’s €150mn pay deal", date: "2026-09-10", time: "11:19", url: "https://www.ft.com/content/a4b8c8ac-56cf-4f6e-9050-4292f37252ad" },
  { id: "25e31948-c429-4c46-8465-72220b7e2e53", title: "New AI health tools need ‘L-plates’, says UK review", date: "2026-09-10", time: "11:15", url: "https://www.ft.com/content/25e31948-c429-4c46-8465-72220b7e2e53" },
  { id: "63e733d1-2c0f-46c5-ae6b-de1a72d4e9df", title: "HSBC finance chief Pam Kaur to step down by 2027", date: "2026-09-10", time: "11:04", url: "https://www.ft.com/content/63e733d1-2c0f-46c5-ae6b-de1a72d4e9df" },
  { id: "a2aaa848-92c3-4f7a-b758-5858bfb29e70", title: "Latham & Watkins buys Nvidia servers to set up in-house AI systems", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/a2aaa848-92c3-4f7a-b758-5858bfb29e70" },
  { id: "362b3139-b0de-42f1-83db-67d4572a66ce", title: "On Europe’s economy, let’s ditch the lazy stereotypes", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/362b3139-b0de-42f1-83db-67d4572a66ce" },
  { id: "735fbed6-850f-4bd3-a0f6-ae762c2680be", title: "The capital wars are coming", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/735fbed6-850f-4bd3-a0f6-ae762c2680be" },
  { id: "8a0bc64f-44c7-4811-8e68-fb17c0a6ae28", title: "Donald Trump’s US coal revival push fails to reverse fuel’s long decline", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/8a0bc64f-44c7-4811-8e68-fb17c0a6ae28" },
  { id: "3382efba-83fe-41b2-aaab-c3c50d5f7df4", title: "Franklin Templeton turns the tide as Western Asset crisis recedes", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/3382efba-83fe-41b2-aaab-c3c50d5f7df4" },
  { id: "890dc1c8-f5f1-46d2-a4fa-1a9df3667f37", title: "Hard left holds key to Germany’s first far-right state premiership", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/890dc1c8-f5f1-46d2-a4fa-1a9df3667f37" },
  { id: "083a9c4b-3913-496d-be13-22c96053624b", title: "ECB rate decision live: central bank expected to raise borrowing costs to fight inflation shock", date: "2026-09-10", time: "10:58", url: "https://www.ft.com/content/083a9c4b-3913-496d-be13-22c96053624b" },
  { id: "58e9a70f-29c2-4f44-8531-00fc399ebbe0", title: "Prediction markets ‘rife with insider trading’, warns EU watchdog", date: "2026-09-10", time: "10:00", url: "https://www.ft.com/content/58e9a70f-29c2-4f44-8531-00fc399ebbe0" },
  { id: "59baaebd-ba30-4e75-bbf9-a9a46459816f", title: "England’s mayors to be allowed to introduce unlimited tourism tax", date: "2026-09-10", time: "09:54", url: "https://www.ft.com/content/59baaebd-ba30-4e75-bbf9-a9a46459816f" },
  { id: "6b9afdfb-26f5-4746-8ff9-027a8d04cb1f", title: "Submit your questions: is Trump losing his touch?", date: "2026-09-10", time: "09:47", url: "https://www.ft.com/content/6b9afdfb-26f5-4746-8ff9-027a8d04cb1f" },
  { id: "95ad3625-a3af-4bc0-b673-238020844d7b", title: "Doubts about Reform and Labour benefit Kemi Badenoch", date: "2026-09-10", time: "09:30", url: "https://www.ft.com/content/95ad3625-a3af-4bc0-b673-238020844d7b" },
  { id: "7f9a5140-e3f5-45a9-9620-08b8e819ba41", title: "Abu Dhabi buys into China’s Luckin Coffee with $1bn deal", date: "2026-09-10", time: "07:43", url: "https://www.ft.com/content/7f9a5140-e3f5-45a9-9620-08b8e819ba41" },
  { id: "2476992f-c9fe-4992-887d-f34c81c100ab", title: "Treasury yields jump as Bessent’s $6bn buyback plan disappoints investors", date: "2026-09-10", time: "06:44", url: "https://www.ft.com/content/2476992f-c9fe-4992-887d-f34c81c100ab" },
  { id: "ca7bee53-270c-4b80-9297-b4fe7af50222", title: "FT Alphaville’s Art of the Chart show returns 15 October. Tickets are £5, get them here", date: "2026-09-10", time: "06:35", url: "https://www.ft.com/content/ca7bee53-270c-4b80-9297-b4fe7af50222" },
  { id: "bdde7148-eab2-4e13-abc8-9652c52257f4", title: "Must high bond yields crack stocks?", date: "2026-09-10", time: "06:30", url: "https://www.ft.com/content/bdde7148-eab2-4e13-abc8-9652c52257f4" },
  { id: "d9886b71-4ada-4007-bcf4-bcc0991846e7", title: "FTAV’s further reading", date: "2026-09-10", time: "06:30", url: "https://www.ft.com/content/d9886b71-4ada-4007-bcf4-bcc0991846e7" },
  { id: "17d9e59e-b934-4bca-a81e-2d211a067205", title: "Germany holds the line against a larger EU budget", date: "2026-09-10", time: "06:03", url: "https://www.ft.com/content/17d9e59e-b934-4bca-a81e-2d211a067205" },
  { id: "abbb4a43-4e0b-4178-951b-1924a9af305d", title: "FirstFT: Trump tariff remarks cost lead candidate IMF job", date: "2026-09-10", time: "05:31", url: "https://www.ft.com/content/abbb4a43-4e0b-4178-951b-1924a9af305d" },
  { id: "acfc3ed7-9e2d-4d86-a915-a68c9a55db1f", title: "Trump promises $5,000 ‘dividend’ for US voters if Republicans win midterms", date: "2026-09-10", time: "05:21", url: "https://www.ft.com/content/acfc3ed7-9e2d-4d86-a915-a68c9a55db1f" },
  { id: "8313accc-1de6-48a8-b184-e5e3b20c5b19", title: "Bank of Japan must raise rates further, board member says", date: "2026-09-10", time: "05:07", url: "https://www.ft.com/content/8313accc-1de6-48a8-b184-e5e3b20c5b19" },
  { id: "e6307a83-3671-4b13-a2c7-d3a626248014", title: "Sports Exchange", date: "2026-09-10", time: "05:04", url: "https://www.ft.com/content/e6307a83-3671-4b13-a2c7-d3a626248014" },
  { id: "b77c5dd4-f9b9-451a-b184-2061288a4894", title: "The new rainmakers of European private equity", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/b77c5dd4-f9b9-451a-b184-2061288a4894" },
  { id: "6c0bdcb1-e4dc-453e-b51d-9a8ae2509203", title: "Lessons drawn from Charles Goodhart", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/6c0bdcb1-e4dc-453e-b51d-9a8ae2509203" },
  { id: "be6a9dce-2cda-447a-b78a-83486e46e8bb", title: "Debate over Swedish school model rages ahead of elections", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/be6a9dce-2cda-447a-b78a-83486e46e8bb" },
  { id: "8fe10fa2-e061-4ebe-9853-f5b7136f6e56", title: "The end of the ‘win-win’ era", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/8fe10fa2-e061-4ebe-9853-f5b7136f6e56" },
  { id: "a62199d1-9388-4735-a4f0-db519c84eb79", title: "London credit investor Arini hit by Europe’s thorniest credit trades", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/a62199d1-9388-4735-a4f0-db519c84eb79" },
  { id: "98329c45-f5b7-4885-9911-e0c8a9c83c0a", title: "IMF ditched top candidate for chief economist job over Trump tariff remarks", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/98329c45-f5b7-4885-9911-e0c8a9c83c0a" },
  { id: "bc8781ba-f785-481f-b84d-966067d1b98f", title: "Linklaters poaches top lawyer in latest Wachtell raid", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/bc8781ba-f785-481f-b84d-966067d1b98f" },
  { id: "4c61ab58-e410-4f7f-b314-83b66deb3c84", title: "Oil shock revives interest in clean hydrogen", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/4c61ab58-e410-4f7f-b314-83b66deb3c84" },
  { id: "4ba62ec5-8f81-4c39-a2f7-be9408844079", title: "Numbers returned to prison after release at ‘crisis’ levels, UK probation watchdog warns", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/4ba62ec5-8f81-4c39-a2f7-be9408844079" },
];
