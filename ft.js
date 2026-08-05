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
  { id: "124950d0-1d2f-4da5-8dbc-33912e939298", title: "Kemi Badenoch ‘sad’ over withdrawal of former antisemite as Tory council candidate", date: "2026-08-05", time: "19:03", url: "https://www.ft.com/content/124950d0-1d2f-4da5-8dbc-33912e939298" },
  { id: "2f32de35-697e-4f56-ac57-e44006a09d0f", title: "How to solve Britain’s prisons crisis", date: "2026-08-05", time: "18:52", url: "https://www.ft.com/content/2f32de35-697e-4f56-ac57-e44006a09d0f" },
  { id: "e0b10cad-3e46-4a6d-9227-eba6fe11c676", title: "Iran says it has reached agreement with Oman on Hormuz shipping route", date: "2026-08-05", time: "18:24", url: "https://www.ft.com/content/e0b10cad-3e46-4a6d-9227-eba6fe11c676" },
  { id: "65576911-f6ee-46b3-b5a8-f423df723879", title: "Europe must do more to harness its AI ambitions", date: "2026-08-05", time: "18:01", url: "https://www.ft.com/content/65576911-f6ee-46b3-b5a8-f423df723879" },
  { id: "45df9a1f-7400-4ef8-85e5-aa519a627e66", title: "Israel launches strikes on Lebanon in new flare-up", date: "2026-08-05", time: "17:58", url: "https://www.ft.com/content/45df9a1f-7400-4ef8-85e5-aa519a627e66" },
  { id: "258c5cba-e65a-4990-82b1-3c5e7fc2bb10", title: "Bodycote gets twin private equity bids as buyers feast on London market", date: "2026-08-05", time: "17:11", url: "https://www.ft.com/content/258c5cba-e65a-4990-82b1-3c5e7fc2bb10" },
  { id: "235a98f8-7833-450f-a9aa-f5049d361d30", title: "Partners Group nears €2bn deal for beauty group Aroma-Zone", date: "2026-08-05", time: "17:01", url: "https://www.ft.com/content/235a98f8-7833-450f-a9aa-f5049d361d30" },
  { id: "4abf8011-5570-4ad7-9170-fa655295070a", title: "Reform repaid Tice loan on same day £1mn donated by mother of Farage aide Cottrell", date: "2026-08-05", time: "16:30", url: "https://www.ft.com/content/4abf8011-5570-4ad7-9170-fa655295070a" },
  { id: "bc02657f-4cd7-49a7-a498-9bcef286b1b7", title: "Drone carrying explosives found at Leipzig airport, say German police", date: "2026-08-05", time: "15:59", url: "https://www.ft.com/content/bc02657f-4cd7-49a7-a498-9bcef286b1b7" },
  { id: "41f7963b-dd50-4f27-a085-771ddec4a8ca", title: "Elon Musk’s SpaceX unnerves investors with lavish AI spending plans", date: "2026-08-05", time: "15:36", url: "https://www.ft.com/content/41f7963b-dd50-4f27-a085-771ddec4a8ca" },
  { id: "535dba4e-4e05-4792-940f-47969fbd4702", title: "Zack Polanski calls for higher taxes on oil and gas profits to fund wildfire prevention", date: "2026-08-05", time: "15:17", url: "https://www.ft.com/content/535dba4e-4e05-4792-940f-47969fbd4702" },
  { id: "38e11309-9cb6-4cd4-a5b6-fc9a239ad6b3", title: "China hits back at US with sanctions and tighter drone export rules", date: "2026-08-05", time: "14:23", url: "https://www.ft.com/content/38e11309-9cb6-4cd4-a5b6-fc9a239ad6b3" },
  { id: "eee4bbbf-1d94-4910-9a61-2faefef61d55", title: "Russia drone company chief injured in car bombing", date: "2026-08-05", time: "13:59", url: "https://www.ft.com/content/eee4bbbf-1d94-4910-9a61-2faefef61d55" },
  { id: "33d4b478-b608-490f-9b15-534089d51499", title: "Flutter chief steps down as gambling group cuts guidance", date: "2026-08-05", time: "13:44", url: "https://www.ft.com/content/33d4b478-b608-490f-9b15-534089d51499" },
  { id: "fc7f75f9-73b5-4ce6-8a27-f819aa7f361b", title: "Eli Lilly and Novo Nordisk raise profit outlook as weight-loss drug demand soars", date: "2026-08-05", time: "13:40", url: "https://www.ft.com/content/fc7f75f9-73b5-4ce6-8a27-f819aa7f361b" },
  { id: "2b5e1ab6-9c41-4df8-8391-29d428fa5d2a", title: "Strong box office for ‘Toy Story 5’ boosts Disney as US theme parks rebound", date: "2026-08-05", time: "13:22", url: "https://www.ft.com/content/2b5e1ab6-9c41-4df8-8391-29d428fa5d2a" },
  { id: "51606605-c861-475d-82f6-c9495f5d32d0", title: "The bureaucratic misery of India’s voter revision", date: "2026-08-05", time: "13:20", url: "https://www.ft.com/content/51606605-c861-475d-82f6-c9495f5d32d0" },
  { id: "a47aa815-ba40-4ab6-8631-d0c6c11011ed", title: "Europe and the eternal north-south rift", date: "2026-08-05", time: "12:46", url: "https://www.ft.com/content/a47aa815-ba40-4ab6-8631-d0c6c11011ed" },
  { id: "5506dcd6-4333-4c4a-a471-80d865bd0038", title: "Remember when the US Treasury caused that major yen rally in ‘98?", date: "2026-08-05", time: "12:39", url: "https://www.ft.com/content/5506dcd6-4333-4c4a-a471-80d865bd0038" },
  { id: "e17912c0-7691-42f7-8920-b43268930e41", title: "China launches global tax hunt going back decades", date: "2026-08-05", time: "12:35", url: "https://www.ft.com/content/e17912c0-7691-42f7-8920-b43268930e41" },
  { id: "dcb0fd01-43c1-45a6-aeac-5951dd0c027b", title: "As airlines struggle, their suppliers are flying high", date: "2026-08-05", time: "12:19", url: "https://www.ft.com/content/dcb0fd01-43c1-45a6-aeac-5951dd0c027b" },
  { id: "ae7acfa8-32d6-496a-a1df-28206fa1661d", title: "Citadel surges 6% after swoop on Situational Awareness", date: "2026-08-05", time: "12:05", url: "https://www.ft.com/content/ae7acfa8-32d6-496a-a1df-28206fa1661d" },
  { id: "65633475-0a89-4522-9c2c-5cbd22fd9aac", title: "High-stakes Michigan Democratic Senate primary too close to call", date: "2026-08-05", time: "11:59", url: "https://www.ft.com/content/65633475-0a89-4522-9c2c-5cbd22fd9aac" },
  { id: "04d6fcb4-03e4-4ee5-9017-ccaa7808c934", title: "Uber pledges $10bn to win robotaxi race", date: "2026-08-05", time: "11:55", url: "https://www.ft.com/content/04d6fcb4-03e4-4ee5-9017-ccaa7808c934" },
  { id: "71e1a474-4e57-4cbf-a35e-d612476f5aaa", title: "Where are they now? The ex-Trump lawyers in plum US government posts", date: "2026-08-05", time: "11:00", url: "https://www.ft.com/content/71e1a474-4e57-4cbf-a35e-d612476f5aaa" },
  { id: "3a1ef902-8926-46a7-98f6-a75acd0511fc", title: "US bans exports of various used critical minerals", date: "2026-08-05", time: "10:10", url: "https://www.ft.com/content/3a1ef902-8926-46a7-98f6-a75acd0511fc" },
  { id: "65b5e1b7-c90c-4c85-bc12-17c00ef4bdd3", title: "Andy Burnham rewires the ‘unaccountable’ state", date: "2026-08-05", time: "09:40", url: "https://www.ft.com/content/65b5e1b7-c90c-4c85-bc12-17c00ef4bdd3" },
  { id: "36b7f8a7-5062-4211-90e0-d89b6c32ca15", title: "Solid wage growth keeps BoJ on course for tightening", date: "2026-08-05", time: "08:30", url: "https://www.ft.com/content/36b7f8a7-5062-4211-90e0-d89b6c32ca15" },
  { id: "7dc728e5-74d3-45e9-bae8-c2cd6284e136", title: "India raises $40bn from diaspora to support sagging rupee", date: "2026-08-05", time: "08:24", url: "https://www.ft.com/content/7dc728e5-74d3-45e9-bae8-c2cd6284e136" },
  { id: "c2eb9800-b8df-41f6-aad9-e25c2ebe43d6", title: "Russian bombardment kills 15 in Kyiv", date: "2026-08-05", time: "07:52", url: "https://www.ft.com/content/c2eb9800-b8df-41f6-aad9-e25c2ebe43d6" },
  { id: "f447bd94-8541-4176-acdf-f16e2be4289a", title: "Glencore explores secondary listing in Australia", date: "2026-08-05", time: "07:22", url: "https://www.ft.com/content/f447bd94-8541-4176-acdf-f16e2be4289a" },
  { id: "8bbcfe7e-d3a8-4ea8-ad43-a88f0a48b69e", title: "Bank of England: QT bye?", date: "2026-08-05", time: "06:30", url: "https://www.ft.com/content/8bbcfe7e-d3a8-4ea8-ad43-a88f0a48b69e" },
  { id: "4a4b442c-7ae4-4553-bcab-d744d8d46c79", title: "Time travellers are using LinkedIn to teach us about artificial intelligence", date: "2026-08-05", time: "06:00", url: "https://www.ft.com/content/4a4b442c-7ae4-4553-bcab-d744d8d46c79" },
  { id: "17750174-a864-4f84-ada8-e509387f8558", title: "FTAV’s further reading", date: "2026-08-05", time: "06:00", url: "https://www.ft.com/content/17750174-a864-4f84-ada8-e509387f8558" },
  { id: "30e02828-a59e-4121-8956-8cb1c29742d6", title: "FirstFT: SpaceX’s AI spending plans rattle investors", date: "2026-08-05", time: "05:30", url: "https://www.ft.com/content/30e02828-a59e-4121-8956-8cb1c29742d6" },
  { id: "24bddb7e-9064-4d1b-80b1-d2dc59eed574", title: "Shares in Chinese AI darlings slide on US ban fears", date: "2026-08-05", time: "05:15", url: "https://www.ft.com/content/24bddb7e-9064-4d1b-80b1-d2dc59eed574" },
  { id: "ae77f88d-7cde-43aa-ac03-204eae25edc2", title: "The Story of Money", date: "2026-08-05", time: "05:03", url: "https://www.ft.com/content/ae77f88d-7cde-43aa-ac03-204eae25edc2" },
  { id: "15f69a0c-30d5-4d6f-b53f-3f20a8fc8c49", title: "The big power of small annoyances", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/15f69a0c-30d5-4d6f-b53f-3f20a8fc8c49" },
  { id: "4d42a5ec-7f71-46e4-8ca9-b5bed789c83b", title: "Can I keep our dog when we get divorced?", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/4d42a5ec-7f71-46e4-8ca9-b5bed789c83b" },
  { id: "d1f10ede-f73f-4bdf-9aa6-b6ac028f63ce", title: "The earthquake at Wachtell", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/d1f10ede-f73f-4bdf-9aa6-b6ac028f63ce" },
];
