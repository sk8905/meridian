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
  { id: "4c849c74-887f-4393-80b4-b6a1118feeeb", title: "FTAV’s further reading", date: "2026-08-06", time: "07:35", url: "https://www.ft.com/content/4c849c74-887f-4393-80b4-b6a1118feeeb" },
  { id: "d9e9cbbe-8443-4c10-821a-1834e4965236", title: "OpenAI says Apple’s trade secrets lawsuit aims to stop employees leaving", date: "2026-08-06", time: "07:09", url: "https://www.ft.com/content/d9e9cbbe-8443-4c10-821a-1834e4965236" },
  { id: "b3a21bd2-e92f-428f-a81e-8299f5502dea", title: "Is the AI trade back?", date: "2026-08-06", time: "06:30", url: "https://www.ft.com/content/b3a21bd2-e92f-428f-a81e-8299f5502dea" },
  { id: "7252ef68-a886-4cd0-a450-b5a6cff3a526", title: "Insurance and bank stocks slide amid China tax crackdown fears", date: "2026-08-06", time: "06:07", url: "https://www.ft.com/content/7252ef68-a886-4cd0-a450-b5a6cff3a526" },
  { id: "95c0b20c-0f9e-492b-9c0d-64b451654415", title: "More moaning about UK monthly GDP", date: "2026-08-06", time: "06:00", url: "https://www.ft.com/content/95c0b20c-0f9e-492b-9c0d-64b451654415" },
  { id: "4709fbd3-5a10-46b0-84cf-9fed6c9a10b0", title: "FirstFT: US law firms weigh stake sale to private equity", date: "2026-08-06", time: "05:31", url: "https://www.ft.com/content/4709fbd3-5a10-46b0-84cf-9fed6c9a10b0" },
  { id: "2a348cff-9946-40c4-8268-d0ff8d970447", title: "The trends in central bank research papers", date: "2026-08-06", time: "05:30", url: "https://www.ft.com/content/2a348cff-9946-40c4-8268-d0ff8d970447" },
  { id: "1e041e56-e2b6-4320-9dd7-1db8fdd7bc9c", title: "BP North Sea exit presents wake-up call on Scottish energy", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/1e041e56-e2b6-4320-9dd7-1db8fdd7bc9c" },
  { id: "2c94a7a2-abaf-45f9-9e1c-c7e469287ee7", title: "Citadel ‘makes a killing’", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/2c94a7a2-abaf-45f9-9e1c-c7e469287ee7" },
  { id: "2c741c41-403a-4157-b118-d6ccb9ce9aa8", title: "At least half a dozen senior NHS leaders linked to Palantir", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/2c741c41-403a-4157-b118-d6ccb9ce9aa8" },
  { id: "46508023-900e-4f46-a2eb-dae928d55e55", title: "Get ready to endure an act of penance at Salzburg’s Saint François d’Assise", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/46508023-900e-4f46-a2eb-dae928d55e55" },
  { id: "938851c7-2fa9-4e2c-912a-ca4971f796c2", title: "Iceland demands fisheries control in any EU membership deal", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/938851c7-2fa9-4e2c-912a-ca4971f796c2" },
  { id: "ba3f0141-93f0-4c47-88bf-14aadf0c21a8", title: "‘They have to focus on delivering’: Abigail Spanberger urges Democrats to unite on affordability", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/ba3f0141-93f0-4c47-88bf-14aadf0c21a8" },
  { id: "aa3b6f86-38b7-459d-9c21-a1ea1a23dd7c", title: "Despot or conquering hero? Revisiting the rule of India’s last great Mughal emperor", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/aa3b6f86-38b7-459d-9c21-a1ea1a23dd7c" },
  { id: "0d600619-6521-4de2-963e-c6f44f6e5468", title: "Who needs consultants in the age of AI?", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/0d600619-6521-4de2-963e-c6f44f6e5468" },
  { id: "b0b7db1d-5c9e-42d7-8aed-176e0acd00a9", title: "Scammers pose as watchdogs to prey on EU crypto rule changes", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/b0b7db1d-5c9e-42d7-8aed-176e0acd00a9" },
  { id: "76646dc7-c24b-45fb-8667-9617714a122b", title: "Ares scales back blockbuster private credit vehicle after valuation pushback", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/76646dc7-c24b-45fb-8667-9617714a122b" },
  { id: "77ece212-2768-4abe-9af1-b40a0db27c8f", title: "Inside Intel: how America’s chip champion came back from the brink", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/77ece212-2768-4abe-9af1-b40a0db27c8f" },
  { id: "0b86e59e-6386-4e04-b581-a9486ecc2ead", title: "EU is finally changing on banks: this is how it needs to deliver", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/0b86e59e-6386-4e04-b581-a9486ecc2ead" },
  { id: "33303552-64c0-444f-8d43-e853cfd09a41", title: "Kevin McGurn, the executive turning Trump’s posts into a media empire", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/33303552-64c0-444f-8d43-e853cfd09a41" },
  { id: "5c9b566a-b0b1-473c-86d4-16aff1627953", title: "Jim Ratcliffe’s Ineos doubles down on European chemical sector shares", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/5c9b566a-b0b1-473c-86d4-16aff1627953" },
  { id: "475d573a-886d-4b75-b07c-f74c38b093f2", title: "Biggest US law firms explore selling stakes to private equity", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/475d573a-886d-4b75-b07c-f74c38b093f2" },
  { id: "6fe70fa1-1173-4f7b-9eb9-d8ad9b2f5694", title: "The one climate issue uniting Greens and Reform in Kent", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/6fe70fa1-1173-4f7b-9eb9-d8ad9b2f5694" },
  { id: "285bf286-07c3-49b1-9b6d-7df9664e73c0", title: "Stop assuming GDP is an indicator of prosperity", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/285bf286-07c3-49b1-9b6d-7df9664e73c0" },
  { id: "dee0188b-54b5-4bfe-b9cf-9c4893d9c7f2", title: "‘People are going to kill me’: Haitians fear deportation as US revokes protected status", date: "2026-08-06", time: "05:00", url: "https://www.ft.com/content/dee0188b-54b5-4bfe-b9cf-9c4893d9c7f2" },
  { id: "1fcca000-d9ac-4b3b-9d31-2fef0d1f55f3", title: "Big US hedge funds hit by wave of cyber attacks", date: "2026-08-05", time: "20:47", url: "https://www.ft.com/content/1fcca000-d9ac-4b3b-9d31-2fef0d1f55f3" },
  { id: "3cf185ad-3aea-4d15-8fae-36940da57219", title: "Bikemaker Accell files for insolvency four years after €1.8bn KKR-led buyout", date: "2026-08-05", time: "20:11", url: "https://www.ft.com/content/3cf185ad-3aea-4d15-8fae-36940da57219" },
  { id: "62b70b3a-88c9-4d6c-bc0c-b840586af91a", title: "JPMorgan poaches M&A banker Amy Lissauer from Bank of America", date: "2026-08-05", time: "20:10", url: "https://www.ft.com/content/62b70b3a-88c9-4d6c-bc0c-b840586af91a" },
  { id: "61d41764-f2f7-4906-a112-ff3073972c51", title: "Google DeepMind CEO Demis Hassabis steps down in shake-up of AI lab", date: "2026-08-05", time: "19:24", url: "https://www.ft.com/content/61d41764-f2f7-4906-a112-ff3073972c51" },
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
];
