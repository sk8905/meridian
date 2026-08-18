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
  { id: "90c16b57-5ea6-4cce-b4d5-5f537a79da47", title: "Israeli strikes on Syrian air base criticised by US and Turkey", date: "2026-08-18", time: "17:20", url: "https://www.ft.com/content/90c16b57-5ea6-4cce-b4d5-5f537a79da47" },
  { id: "a5b733dd-b369-489e-877d-6b16f6d5aa27", title: "Andy Burnham hails shake-up of bus services in West Midlands", date: "2026-08-18", time: "16:49", url: "https://www.ft.com/content/a5b733dd-b369-489e-877d-6b16f6d5aa27" },
  { id: "f30010b5-a702-4fdd-914e-44c69d37814a", title: "Signature Group founder banned as company director for five years", date: "2026-08-18", time: "14:19", url: "https://www.ft.com/content/f30010b5-a702-4fdd-914e-44c69d37814a" },
  { id: "c61e12bb-2ff1-4862-9217-38bdada90ecc", title: "Disney sues Trump administration over ‘retaliatory’ ABC licence review", date: "2026-08-18", time: "14:13", url: "https://www.ft.com/content/c61e12bb-2ff1-4862-9217-38bdada90ecc" },
  { id: "09e23587-1b06-45b3-ad19-1e5d1ec9d7de", title: "Canada makes final attempt to avoid US tariffs on $20bn of goods", date: "2026-08-18", time: "14:00", url: "https://www.ft.com/content/09e23587-1b06-45b3-ad19-1e5d1ec9d7de" },
  { id: "01165fdb-4957-45de-b612-85fac4836220", title: "Here’s Apollo’s big First Brands short presentation", date: "2026-08-18", time: "13:55", url: "https://www.ft.com/content/01165fdb-4957-45de-b612-85fac4836220" },
  { id: "811850d2-01c9-4ea5-8af8-86b22c41a284", title: "Klarna overhauls leadership as it targets US banking licence", date: "2026-08-18", time: "13:54", url: "https://www.ft.com/content/811850d2-01c9-4ea5-8af8-86b22c41a284" },
  { id: "e57f1e66-578e-42c9-8e59-37fe05067032", title: "Fund managers are in party mode", date: "2026-08-18", time: "13:04", url: "https://www.ft.com/content/e57f1e66-578e-42c9-8e59-37fe05067032" },
  { id: "4e58775a-4c71-4945-895a-5dc31306ddd6", title: "Reform UK suspends Tory defector Tim Montgomerie after criticism of Nigel Farage", date: "2026-08-18", time: "13:02", url: "https://www.ft.com/content/4e58775a-4c71-4945-895a-5dc31306ddd6" },
  { id: "be40ad57-a847-43a3-8ade-9282914b965e", title: "The UK Treasury can’t avoid the Bank of England’s losses", date: "2026-08-18", time: "12:30", url: "https://www.ft.com/content/be40ad57-a847-43a3-8ade-9282914b965e" },
  { id: "9eccad94-56f5-4adf-aa61-c39e2e542226", title: "OpenAI limits teens to dedicated version of ChatGPT promising more safeguards", date: "2026-08-18", time: "12:00", url: "https://www.ft.com/content/9eccad94-56f5-4adf-aa61-c39e2e542226" },
  { id: "7d5f7e30-88de-4dcb-9fd5-f41a4ff03804", title: "AI phobia is America’s new consensus", date: "2026-08-18", time: "11:57", url: "https://www.ft.com/content/7d5f7e30-88de-4dcb-9fd5-f41a4ff03804" },
  { id: "3a96c015-2c9f-4897-97ea-d3f13571aa71", title: "Russia warns UK of ‘consequences’ over Ukraine’s use of British-made drones", date: "2026-08-18", time: "11:40", url: "https://www.ft.com/content/3a96c015-2c9f-4897-97ea-d3f13571aa71" },
  { id: "61354e68-c4ba-4716-b849-b332608c8c65", title: "Global bond sell-off deepens amid fears over inflation and AI issuance", date: "2026-08-18", time: "10:13", url: "https://www.ft.com/content/61354e68-c4ba-4716-b849-b332608c8c65" },
  { id: "bfc3fbe6-7bd8-41d5-b185-0865cf22ae95", title: "Labour has no good options on prisons", date: "2026-08-18", time: "09:30", url: "https://www.ft.com/content/bfc3fbe6-7bd8-41d5-b185-0865cf22ae95" },
  { id: "3b211986-f6ea-47f9-8b7c-b58f261ad483", title: "UK pay weakness allays fears of second-round inflation effects", date: "2026-08-18", time: "08:51", url: "https://www.ft.com/content/3b211986-f6ea-47f9-8b7c-b58f261ad483" },
  { id: "13b9ac91-e7f2-4d70-b302-93f6b7b4c26a", title: "Mike Ashley's Frasers grows stake in Hugo Boss to 48%", date: "2026-08-18", time: "08:06", url: "https://www.ft.com/content/13b9ac91-e7f2-4d70-b302-93f6b7b4c26a" },
  { id: "1e9a7365-ee1f-489c-9dea-39a6fc33837b", title: "UK employers shed jobs as labour market weakens further", date: "2026-08-18", time: "08:01", url: "https://www.ft.com/content/1e9a7365-ee1f-489c-9dea-39a6fc33837b" },
  { id: "4cfc3208-b7cb-415c-8648-0f97d92e8527", title: "You have ONE more chance to win our charts quiz champion T-shirt because the prize will soon be this hat", date: "2026-08-18", time: "07:20", url: "https://www.ft.com/content/4cfc3208-b7cb-415c-8648-0f97d92e8527" },
  { id: "8cafeb3f-f11b-41ba-a67c-61072823eeb4", title: "FirstFT: Asian doubts over US resolve", date: "2026-08-18", time: "07:01", url: "https://www.ft.com/content/8cafeb3f-f11b-41ba-a67c-61072823eeb4" },
  { id: "c3223b7c-6683-42df-9e60-9dbd2dbdfe07", title: "China’s 10-year bond yield falls to 13-month low", date: "2026-08-18", time: "06:45", url: "https://www.ft.com/content/c3223b7c-6683-42df-9e60-9dbd2dbdfe07" },
  { id: "b2cbbab2-a51a-48f2-a9da-86d858cd4e86", title: "AI: like a debt machine", date: "2026-08-18", time: "06:30", url: "https://www.ft.com/content/b2cbbab2-a51a-48f2-a9da-86d858cd4e86" },
  { id: "b2c808ec-a67f-4a72-b5b7-a05a5a3036c3", title: "FTAV’s further reading", date: "2026-08-18", time: "06:00", url: "https://www.ft.com/content/b2c808ec-a67f-4a72-b5b7-a05a5a3036c3" },
  { id: "ba3782d6-709b-472c-aa02-e0ffb1c89d87", title: "Mark Walter’s empire of assets and liabilities", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/ba3782d6-709b-472c-aa02-e0ffb1c89d87" },
  { id: "1d713822-e68f-4476-be94-ffab3418bfe4", title: "Donald Trump’s cuts to military drills stir doubts about US resolve in Asia", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/1d713822-e68f-4476-be94-ffab3418bfe4" },
  { id: "418e0159-d2d1-4432-a7b3-de0cc446ef08", title: "UK examines economic hit from loss of access to frontier AI models", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/418e0159-d2d1-4432-a7b3-de0cc446ef08" },
  { id: "748b1e8c-63f4-4eca-8103-d9d148cac00c", title: "Andy Burnham faces EU clash over youth scheme as summit looms", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/748b1e8c-63f4-4eca-8103-d9d148cac00c" },
  { id: "6913fe7f-3ad8-47e6-8310-7caba5f5d58c", title: "Top UK civil servant received record £500,000 payout after Starmer sacking", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/6913fe7f-3ad8-47e6-8310-7caba5f5d58c" },
  { id: "5f927594-03a1-4652-8189-2aa7a19dcec4", title: "The difficult truth about Jason Arday", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/5f927594-03a1-4652-8189-2aa7a19dcec4" },
  { id: "03c8edc6-92ee-4eb9-a83a-441e839a6317", title: "Burger King is taking a bite out of McDonald’s lunch", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/03c8edc6-92ee-4eb9-a83a-441e839a6317" },
  { id: "4fcd8647-e3ba-4cd8-8dc0-4b0ff473cf39", title: "Why eyewear stores are taking over London’s high streets", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/4fcd8647-e3ba-4cd8-8dc0-4b0ff473cf39" },
  { id: "d88a8878-425d-4225-bda4-576c6c42734e", title: "Trump ballroom official held quiet Kremlin talks", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/d88a8878-425d-4225-bda4-576c6c42734e" },
  { id: "cf29e18e-c4d8-4a27-b7c7-3cf56d6eccf2", title: "Can canned cocktails revive the booze business?", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/cf29e18e-c4d8-4a27-b7c7-3cf56d6eccf2" },
  { id: "a9947be4-5c0c-47ee-acae-a2aeaf01a0a0", title: "AI hasn’t gone rogue. It’s worse than that", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/a9947be4-5c0c-47ee-acae-a2aeaf01a0a0" },
  { id: "770c003e-17bc-4bf5-8f5a-3f45a4f15c36", title: "Europe still needs forward guidance — but not as a straitjacket", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/770c003e-17bc-4bf5-8f5a-3f45a4f15c36" },
  { id: "351cf8e1-cdef-46a9-ac32-b2e76c72ed1a", title: "Chris Hohn’s hedge fund TCI bets on Italian luxury hotels", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/351cf8e1-cdef-46a9-ac32-b2e76c72ed1a" },
  { id: "71541304-d965-415d-82a3-387775cdb773", title: "Libya seeks up to $40bn to develop oil resources", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/71541304-d965-415d-82a3-387775cdb773" },
  { id: "3ed7fb42-2402-4439-a76d-081d9c084c64", title: "EU defence executives are no longer as safe as they were", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/3ed7fb42-2402-4439-a76d-081d9c084c64" },
  { id: "9d8f4215-4d19-43df-ab81-b9f8adb057c8", title: "Airlines in ‘stand-off’ over price cuts as jet fuel costs ease", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/9d8f4215-4d19-43df-ab81-b9f8adb057c8" },
  { id: "f12c330e-bed7-4f9d-9b37-c301ffd78b03", title: "The German far right’s difficult dance with Maga", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/f12c330e-bed7-4f9d-9b37-c301ffd78b03" },
  { id: "8891d59f-f4e0-4f81-bfae-b686cd1c4d98", title: "Big pharma warns Germany’s attempts to curb drug prices will backfire", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/8891d59f-f4e0-4f81-bfae-b686cd1c4d98" },
];
