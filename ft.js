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
  { id: "c2eb9800-b8df-41f6-aad9-e25c2ebe43d6", title: "Russian bombardment kills 15 in Kyiv", date: "2026-08-05", time: "07:52", url: "https://www.ft.com/content/c2eb9800-b8df-41f6-aad9-e25c2ebe43d6" },
  { id: "f447bd94-8541-4176-acdf-f16e2be4289a", title: "Glencore explores secondary listing in Australia", date: "2026-08-05", time: "07:22", url: "https://www.ft.com/content/f447bd94-8541-4176-acdf-f16e2be4289a" },
  { id: "8bbcfe7e-d3a8-4ea8-ad43-a88f0a48b69e", title: "Bank of England: QT bye?", date: "2026-08-05", time: "06:30", url: "https://www.ft.com/content/8bbcfe7e-d3a8-4ea8-ad43-a88f0a48b69e" },
  { id: "4a4b442c-7ae4-4553-bcab-d744d8d46c79", title: "Time travellers are using LinkedIn to teach us about artificial intelligence", date: "2026-08-05", time: "06:00", url: "https://www.ft.com/content/4a4b442c-7ae4-4553-bcab-d744d8d46c79" },
  { id: "17750174-a864-4f84-ada8-e509387f8558", title: "FTAV’s further reading", date: "2026-08-05", time: "06:00", url: "https://www.ft.com/content/17750174-a864-4f84-ada8-e509387f8558" },
  { id: "30e02828-a59e-4121-8956-8cb1c29742d6", title: "FirstFT: SpaceX’s AI spending plans rattle investors", date: "2026-08-05", time: "05:30", url: "https://www.ft.com/content/30e02828-a59e-4121-8956-8cb1c29742d6" },
  { id: "ae77f88d-7cde-43aa-ac03-204eae25edc2", title: "The Story of Money", date: "2026-08-05", time: "05:03", url: "https://www.ft.com/content/ae77f88d-7cde-43aa-ac03-204eae25edc2" },
  { id: "15f69a0c-30d5-4d6f-b53f-3f20a8fc8c49", title: "The big power of small annoyances", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/15f69a0c-30d5-4d6f-b53f-3f20a8fc8c49" },
  { id: "4d42a5ec-7f71-46e4-8ca9-b5bed789c83b", title: "Can I keep our dog when we get divorced?", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/4d42a5ec-7f71-46e4-8ca9-b5bed789c83b" },
  { id: "24bddb7e-9064-4d1b-80b1-d2dc59eed574", title: "Shares in Chinese AI darlings slide on US ban fears", date: "2026-08-05", time: "05:15", url: "https://www.ft.com/content/24bddb7e-9064-4d1b-80b1-d2dc59eed574" },
  { id: "d1f10ede-f73f-4bdf-9aa6-b6ac028f63ce", title: "The earthquake at Wachtell", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/d1f10ede-f73f-4bdf-9aa6-b6ac028f63ce" },
  { id: "6b91e575-9d43-4339-9ad5-eea81aef67e0", title: "SpaceX bolsters the case against quarterly earnings", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/6b91e575-9d43-4339-9ad5-eea81aef67e0" },
  { id: "8cd8ba50-cd90-4ce6-ba06-e0ce98b10511", title: "UK’s ability to make medicines and missiles hit by decline of chemicals industry", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/8cd8ba50-cd90-4ce6-ba06-e0ce98b10511" },
  { id: "db1f029b-c7e2-4b11-b0b7-ebf96cd37dcf", title: "Paradise Papers law firm explores private equity sale", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/db1f029b-c7e2-4b11-b0b7-ebf96cd37dcf" },
  { id: "0b1675a0-72e3-47ff-9ab2-de1ca64a6b6a", title: "Pressure on UK bank earnings peeks out from behind the hedge", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/0b1675a0-72e3-47ff-9ab2-de1ca64a6b6a" },
  { id: "c492ce6b-483b-4196-8f2a-9bd1afda92d3", title: "Banks to offload $15bn of debt for Anthropic data centre backed by Google", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/c492ce6b-483b-4196-8f2a-9bd1afda92d3" },
  { id: "7a284485-f648-45da-9f0b-a8b19bbdb99b", title: "Nik Storonsky in talks over new share award if Revolut hits $500bn valuation", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/7a284485-f648-45da-9f0b-a8b19bbdb99b" },
  { id: "86dbf0c1-d127-4255-85af-602afc30228e", title: "The real message in the yen intervention", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/86dbf0c1-d127-4255-85af-602afc30228e" },
  { id: "b067244f-744d-49ae-89e7-eb47ba61ee87", title: "Greece turns to space in fight against wildfires", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/b067244f-744d-49ae-89e7-eb47ba61ee87" },
  { id: "e17912c0-7691-42f7-8920-b43268930e41", title: "China launches global tax hunt going back decades", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/e17912c0-7691-42f7-8920-b43268930e41" },
  { id: "789fcd07-50d0-4db2-8185-a8c8f1461d84", title: "From ‘Top Gun’ to Ghost Bats: the future of aerial combat", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/789fcd07-50d0-4db2-8185-a8c8f1461d84" },
  { id: "683d1d19-985c-49c5-9813-78d27bca0350", title: "Can the UK’s newest rail station escape the problems of HS2?", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/683d1d19-985c-49c5-9813-78d27bca0350" },
  { id: "1aec6153-a264-4d04-8a8a-c2500c7a952d", title: "The global green transition won’t be driven by self-interest alone", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/1aec6153-a264-4d04-8a8a-c2500c7a952d" },
  { id: "9a59bb55-d060-4002-bc4f-4563aa598b02", title: "European carmakers turn to Chinese rivals to fill factory floors", date: "2026-08-05", time: "05:00", url: "https://www.ft.com/content/9a59bb55-d060-4002-bc4f-4563aa598b02" },
  { id: "41f7963b-dd50-4f27-a085-771ddec4a8ca", title: "SpaceX posts 92% rise in revenue in debut earnings report", date: "2026-08-04", time: "21:14", url: "https://www.ft.com/content/41f7963b-dd50-4f27-a085-771ddec4a8ca" },
  { id: "4bc98c31-d430-4e84-9353-6b9a6154d4d6", title: "US cannot ‘stay isolated’ from Chinese EV competition, warns Lucid CEO", date: "2026-08-04", time: "21:10", url: "https://www.ft.com/content/4bc98c31-d430-4e84-9353-6b9a6154d4d6" },
  { id: "9878a2e4-3ac5-43b0-b2c9-b1fe1a4b65e7", title: "UK to strip back procurement rules to focus on job creation, says Louise Haigh", date: "2026-08-04", time: "21:00", url: "https://www.ft.com/content/9878a2e4-3ac5-43b0-b2c9-b1fe1a4b65e7" },
  { id: "237bfa1a-e1af-493c-a6a6-ef2f36b519f8", title: "P&G seals $3.8bn deal for supplements company Thorne", date: "2026-08-04", time: "19:32", url: "https://www.ft.com/content/237bfa1a-e1af-493c-a6a6-ef2f36b519f8" },
  { id: "4bfbce82-52ae-425f-8c11-57b2b30f2de7", title: "Donald Trump’s ex-lawyer poised to become attorney-general after ‘slush fund’ U-turn", date: "2026-08-04", time: "19:05", url: "https://www.ft.com/content/4bfbce82-52ae-425f-8c11-57b2b30f2de7" },
  { id: "8d421d44-862d-4942-99ae-568bad4900c2", title: "US diesel prices overtake Biden-era average in blow to Trump", date: "2026-08-04", time: "18:51", url: "https://www.ft.com/content/8d421d44-862d-4942-99ae-568bad4900c2" },
  { id: "e8f58a9c-0166-4a81-b970-b070d3dbc122", title: "An overdue show of EU solidarity with Spain", date: "2026-08-04", time: "18:45", url: "https://www.ft.com/content/e8f58a9c-0166-4a81-b970-b070d3dbc122" },
  { id: "1ed68c71-e1e8-4ae5-a965-5380cbdeaa22", title: "US stocks jump after Bessent says deal to reopen Hormuz is imminent", date: "2026-08-04", time: "18:37", url: "https://www.ft.com/content/1ed68c71-e1e8-4ae5-a965-5380cbdeaa22" },
  { id: "6183a03c-4766-43e7-9392-cacd9a6545f8", title: "Palantir rides high on greed and fear — but mostly fear", date: "2026-08-04", time: "18:23", url: "https://www.ft.com/content/6183a03c-4766-43e7-9392-cacd9a6545f8" },
  { id: "8054a402-18a1-497d-ba0a-1ea338756e1f", title: "UK early release scheme may not avert future prison crisis, say experts", date: "2026-08-04", time: "18:04", url: "https://www.ft.com/content/8054a402-18a1-497d-ba0a-1ea338756e1f" },
  { id: "affbeefd-b94b-4707-b9af-3e12db6665d0", title: "US labour market stable in June", date: "2026-08-04", time: "17:28", url: "https://www.ft.com/content/affbeefd-b94b-4707-b9af-3e12db6665d0" },
  { id: "ac4b294d-36db-4e6d-aafe-663ce20cb658", title: "Wall Street’s insurance takeover presents circular risks and rewards", date: "2026-08-04", time: "16:53", url: "https://www.ft.com/content/ac4b294d-36db-4e6d-aafe-663ce20cb658" },
  { id: "f7fb388d-5826-409a-8dd6-43e828da6ba1", title: "MFS administrators sue Barclays after accounts access frozen", date: "2026-08-04", time: "16:53", url: "https://www.ft.com/content/f7fb388d-5826-409a-8dd6-43e828da6ba1" },
  { id: "7ff5dd5c-dc45-4db3-ab75-8ab1c844f7be", title: "Japan LLC trading update", date: "2026-08-04", time: "16:39", url: "https://www.ft.com/content/7ff5dd5c-dc45-4db3-ab75-8ab1c844f7be" },
  { id: "63b79c58-a497-4359-a3c7-03a36fead622", title: "Water companies feel squeeze of abstraction limits as drought deepens", date: "2026-08-04", time: "16:10", url: "https://www.ft.com/content/63b79c58-a497-4359-a3c7-03a36fead622" },
  { id: "c56d21b4-1738-4b53-ad78-79f29b5de798", title: "Saudi-Israel tensions could frustrate India’s IMEC dreams", date: "2026-08-04", time: "16:09", url: "https://www.ft.com/content/c56d21b4-1738-4b53-ad78-79f29b5de798" },
  { id: "c1e80ff0-4566-4a15-9e7b-397abe6e5b5c", title: "In Venezuela, legitimacy matters more than continuity", date: "2026-08-04", time: "15:37", url: "https://www.ft.com/content/c1e80ff0-4566-4a15-9e7b-397abe6e5b5c" },
];
