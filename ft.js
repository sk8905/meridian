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
  { id: "75d1b474-7885-42ee-a08b-d221c5e96d1c", title: "US assesses European allies’ allegiance in pointed Nato questionnaire", date: "2026-08-28", time: "06:00", url: "https://www.ft.com/content/75d1b474-7885-42ee-a08b-d221c5e96d1c" },
  { id: "a95aebcf-6cfe-418c-8c11-ddf05f3aef4d", title: "Harvard and the Cloudflare governance fight", date: "2026-08-28", time: "06:00", url: "https://www.ft.com/content/a95aebcf-6cfe-418c-8c11-ddf05f3aef4d" },
  { id: "4f5a0247-7f56-48e7-b97e-87fbe8945e49", title: "The great junior consultant reskilling", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/4f5a0247-7f56-48e7-b97e-87fbe8945e49" },
  { id: "6f3ada65-c56c-499c-8eb6-008fac58949d", title: "US corporate profits surge to record as worker payouts wilt", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/6f3ada65-c56c-499c-8eb6-008fac58949d" },
  { id: "dedd5e48-2825-4218-a8bd-16df80fe761d", title: "Sanjeev Gupta’s family takes out £24mn mortgage on Belgravia mansion", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/dedd5e48-2825-4218-a8bd-16df80fe761d" },
  { id: "7783b779-7ed5-4816-a7e3-38eba4a8987e", title: "Andy Burnham retreats from backing return of Parthenon sculptures to Greece", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/7783b779-7ed5-4816-a7e3-38eba4a8987e" },
  { id: "8faac5d4-af01-4c36-949f-bb059acee910", title: "Healey could suffer £4bn headroom hit because of lower immigration forecasts", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/8faac5d4-af01-4c36-949f-bb059acee910" },
  { id: "9a60246e-30de-4c12-911a-c57cf31f4ced", title: "Burnham’s devolution push delays police merger plans", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/9a60246e-30de-4c12-911a-c57cf31f4ced" },
  { id: "8e93c159-2c02-444a-9f22-dcda14bc451f", title: "Zero-interest convertible bonds set for record year", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/8e93c159-2c02-444a-9f22-dcda14bc451f" },
  { id: "ef0e436b-5a9f-4284-8df5-1f6bbddf6167", title: "Meta’s $18bn settlement shows the wrong way to keep kids safe", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/ef0e436b-5a9f-4284-8df5-1f6bbddf6167" },
  { id: "25121087-b57c-4a50-ae83-f09399e2e84d", title: "UK venture capital investment rebounds as software and biotech attract funding", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/25121087-b57c-4a50-ae83-f09399e2e84d" },
  { id: "42009512-6b88-4808-adbb-1418995429e1", title: "Letting tax cheats off the hook is costing America", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/42009512-6b88-4808-adbb-1418995429e1" },
  { id: "42935d28-2998-4c1b-a2f3-82ec0e462ec4", title: "Is China’s ‘wise camel’ the winner from the US-Iran war?", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/42935d28-2998-4c1b-a2f3-82ec0e462ec4" },
  { id: "c25c1bdf-8acf-4ccc-bc67-c31bc9fb83bc", title: "Liechtenstein prince tightens grip in succession shake-up", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/c25c1bdf-8acf-4ccc-bc67-c31bc9fb83bc" },
  { id: "257f7067-c3d6-435d-87a8-3f7252182975", title: "Sunak at 10 by Anthony Seldon — the reluctant prime minister", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/257f7067-c3d6-435d-87a8-3f7252182975" },
  { id: "71745a1a-fc83-43f5-a29e-18d9a5725b5d", title: "Watchdog probes law firm over work linked to collapsed lender MFS", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/71745a1a-fc83-43f5-a29e-18d9a5725b5d" },
  { id: "b4868658-52e2-48a4-b065-d77c82a2d6d1", title: "US bank regulators to narrow enforcement focus to financial risks", date: "2026-08-27", time: "20:50", url: "https://www.ft.com/content/b4868658-52e2-48a4-b065-d77c82a2d6d1" },
  { id: "1d990ab8-bb28-43b6-b9bc-daeb8a32c58f", title: "Alphabet agrees to pay £260mn to settle UK class action lawsuit", date: "2026-08-27", time: "20:42", url: "https://www.ft.com/content/1d990ab8-bb28-43b6-b9bc-daeb8a32c58f" },
  { id: "dd069af7-a2a2-4984-8d9a-5edeaf54f2f8", title: "Anthropic launches tool that can manipulate laboratory tools", date: "2026-08-27", time: "20:20", url: "https://www.ft.com/content/dd069af7-a2a2-4984-8d9a-5edeaf54f2f8" },
  { id: "6f0cdf31-de96-4058-92a9-f6684b5e1ef6", title: "Donald Trump orders Lake Ontario to be renamed 'Lake America' in new slight to Canada", date: "2026-08-27", time: "19:12", url: "https://www.ft.com/content/6f0cdf31-de96-4058-92a9-f6684b5e1ef6" },
  { id: "4f76326d-3d29-4b3c-b7cf-b339ee4134ae", title: "Warsh goes to Jackson Hole", date: "2026-08-27", time: "18:24", url: "https://www.ft.com/content/4f76326d-3d29-4b3c-b7cf-b339ee4134ae" },
  { id: "a7a5fadb-8e81-4047-9dc7-40feda9bacd0", title: "In asset management, the race for scale is becoming urgent", date: "2026-08-27", time: "18:07", url: "https://www.ft.com/content/a7a5fadb-8e81-4047-9dc7-40feda9bacd0" },
  { id: "febba6ee-9abd-47d4-bac4-3bbe8b64be7f", title: "'Headless software' signals further AI-led shake-up", date: "2026-08-27", time: "18:01", url: "https://www.ft.com/content/febba6ee-9abd-47d4-bac4-3bbe8b64be7f" },
  { id: "05408fe6-e7f4-44b2-ac5d-2fd2a7d04a0f", title: "US rebukes Europeans over 'sea of red' military gaps", date: "2026-08-27", time: "17:56", url: "https://www.ft.com/content/05408fe6-e7f4-44b2-ac5d-2fd2a7d04a0f" },
  { id: "f87d893e-24db-4ccd-af90-1f7f0abeb57e", title: "Polish Olympic chief arrested in spreading crypto scandal", date: "2026-08-27", time: "17:50", url: "https://www.ft.com/content/f87d893e-24db-4ccd-af90-1f7f0abeb57e" },
  { id: "8cc488a5-54c2-41f9-8b87-327ff591be6a", title: "Canada poaches 48 US-based top academics", date: "2026-08-27", time: "17:11", url: "https://www.ft.com/content/8cc488a5-54c2-41f9-8b87-327ff591be6a" },
  { id: "fb082509-a00b-44b0-9d55-a7f34b6f7b41", title: "Why 5% Treasuries aren't crushing emerging markets", date: "2026-08-27", time: "16:56", url: "https://www.ft.com/content/fb082509-a00b-44b0-9d55-a7f34b6f7b41" },
  { id: "a919761d-dab1-4a6e-93fe-f69910192c1c", title: "Don't draw the wrong conclusion from Treasury yields", date: "2026-08-27", time: "15:45", url: "https://www.ft.com/content/a919761d-dab1-4a6e-93fe-f69910192c1c" },
  { id: "6d272811-8d26-46f0-ae24-abed61aa1bf3", title: "EU states revive plan to use frozen Russian assets for Ukraine", date: "2026-08-27", time: "15:45", url: "https://www.ft.com/content/6d272811-8d26-46f0-ae24-abed61aa1bf3" },
  { id: "7db89ce2-ca7c-43e2-b06b-07c0d3c269ca", title: "Cyber attack on UK's largest airport group exposes data of 8.7mn customers", date: "2026-08-27", time: "15:42", url: "https://www.ft.com/content/7db89ce2-ca7c-43e2-b06b-07c0d3c269ca" },
  { id: "dc3607ab-741a-4878-9a9e-ba88e4b5143d", title: "Ratko Mladić dies in prison aged 84", date: "2026-08-27", time: "15:30", url: "https://www.ft.com/content/dc3607ab-741a-4878-9a9e-ba88e4b5143d" },
  { id: "7729314c-4928-485e-bfe8-5d6749d65cd2", title: "Uefa prepares criminal complaint against Fifa's Infantino", date: "2026-08-27", time: "15:29", url: "https://www.ft.com/content/7729314c-4928-485e-bfe8-5d6749d65cd2" },
  { id: "1123d1a4-bdb7-425f-b27c-73f1b5249939", title: "Andy Burnham's high street plan is 'delusional', says Mike Ashley", date: "2026-08-27", time: "15:22", url: "https://www.ft.com/content/1123d1a4-bdb7-425f-b27c-73f1b5249939" },
  { id: "88395752-1301-44a2-961c-124f5270209c", title: "Minutes from ECB's July meeting more positive on inflation outlook", date: "2026-08-27", time: "14:44", url: "https://www.ft.com/content/88395752-1301-44a2-961c-124f5270209c" },
  { id: "52e03e5d-12f7-41e2-a62e-3822200ea7b7", title: "Humanoid robots will be useful, just not as we imagined", date: "2026-08-27", time: "14:36", url: "https://www.ft.com/content/52e03e5d-12f7-41e2-a62e-3822200ea7b7" },
  { id: "a41bf5b0-2cf1-4a0e-98dc-200e8a9e8ebf", title: "Flat owners win 'right to manage' case at UK Supreme Court", date: "2026-08-27", time: "14:35", url: "https://www.ft.com/content/a41bf5b0-2cf1-4a0e-98dc-200e8a9e8ebf" },
  { id: "fbf566f0-eb3a-484e-9f3d-5189c4730180", title: "Kevin Warsh's peculiar challenge", date: "2026-08-27", time: "14:00", url: "https://www.ft.com/content/fbf566f0-eb3a-484e-9f3d-5189c4730180" },
  { id: "1f3c2038-0087-4335-bc8f-d9c75e3a6963", title: "ECB will return to data dependence after a September rate rise", date: "2026-08-27", time: "14:00", url: "https://www.ft.com/content/1f3c2038-0087-4335-bc8f-d9c75e3a6963" },
  { id: "80fd2ed5-fb7f-4494-b7fe-a2a7d9253a49", title: "US corporate intelligence firm drops legal claim against sanctioned oil trader", date: "2026-08-27", time: "13:55", url: "https://www.ft.com/content/80fd2ed5-fb7f-4494-b7fe-a2a7d9253a49" },
  { id: "a81a4556-0c22-4d94-a105-31e3acb6912e", title: "Autumn can't come soon enough for home sellers", date: "2026-08-27", time: "13:00", url: "https://www.ft.com/content/a81a4556-0c22-4d94-a105-31e3acb6912e" },
];
