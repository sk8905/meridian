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
  { id: "3f170d25-190f-4deb-9906-431916b1eb1d", title: "How batteries are reshaping the solar power business model", date: "2026-08-28", time: "12:01", url: "https://www.ft.com/content/3f170d25-190f-4deb-9906-431916b1eb1d" },
  { id: "abbc3601-9ebc-4f3a-a317-0b1eee96e5a8", title: "Can Netflix remake Jersey Shore — and its property market?", date: "2026-08-28", time: "12:00", url: "https://www.ft.com/content/abbc3601-9ebc-4f3a-a317-0b1eee96e5a8" },
  { id: "0d573fd7-ec74-4cb0-a8c2-a86ce6eab5bd", title: "Alleged vandalism on Trump golf course linked to terrorism, Scottish prosecutors say", date: "2026-08-28", time: "11:58", url: "https://www.ft.com/content/0d573fd7-ec74-4cb0-a8c2-a86ce6eab5bd" },
  { id: "d3eead8b-7b38-45bd-8fba-489d02a3e440", title: "Aberdeen fund takes £200mn hit on failure of UK broadband provider", date: "2026-08-28", time: "11:28", url: "https://www.ft.com/content/d3eead8b-7b38-45bd-8fba-489d02a3e440" },
  { id: "a5c1460d-631a-4c4e-8c51-32536de09b80", title: "SpaceX considered as a leasing company", date: "2026-08-28", time: "11:13", url: "https://www.ft.com/content/a5c1460d-631a-4c4e-8c51-32536de09b80" },
  { id: "0cdeb545-f6fe-4d97-aa1a-5933e58773c6", title: "The first Aman in Mexico is $6,000 a night. Is it worth it?", date: "2026-08-28", time: "11:00", url: "https://www.ft.com/content/0cdeb545-f6fe-4d97-aa1a-5933e58773c6" },
  { id: "693d9b24-b4d1-42db-a978-3264a27bc83c", title: "‘I am still extremely angry’: the Woodford collapse continues to confound investors", date: "2026-08-28", time: "10:53", url: "https://www.ft.com/content/693d9b24-b4d1-42db-a978-3264a27bc83c" },
  { id: "670b2b1d-7e4c-480e-9ed4-9f7f095d7860", title: "Ministers embraced the ‘world’s safest phone’. Then it unravelled", date: "2026-08-28", time: "09:30", url: "https://www.ft.com/content/670b2b1d-7e4c-480e-9ed4-9f7f095d7860" },
  { id: "d15d2086-49bd-4a44-9508-b4c6e27971da", title: "South Korea to review 310,000 closed missing people cases", date: "2026-08-28", time: "08:32", url: "https://www.ft.com/content/d15d2086-49bd-4a44-9508-b4c6e27971da" },
  { id: "b0c90571-6619-4ac4-8d6e-f0dd295eaf15", title: "Bank of England likely to respond to high energy prices by end of the year", date: "2026-08-28", time: "07:41", url: "https://www.ft.com/content/b0c90571-6619-4ac4-8d6e-f0dd295eaf15" },
  { id: "caf9084f-8166-48c3-abab-0e801dd7a456", title: "FTAV’s further reading", date: "2026-08-28", time: "07:14", url: "https://www.ft.com/content/caf9084f-8166-48c3-abab-0e801dd7a456" },
  { id: "fc925436-4bcb-444c-b929-83014f6da44d", title: "Healey to shelve his own defence spending target of 3% of GDP by 2030", date: "2026-08-28", time: "07:13", url: "https://www.ft.com/content/fc925436-4bcb-444c-b929-83014f6da44d" },
  { id: "c377139e-b53c-4043-86b2-36b9d73cde9a", title: "The US consumer is showing some strain", date: "2026-08-28", time: "06:30", url: "https://www.ft.com/content/c377139e-b53c-4043-86b2-36b9d73cde9a" },
  { id: "5e6db1ad-6ea5-44db-80fd-fd7073d9e676", title: "FirstFT: US corporate profits surge as wages lag", date: "2026-08-28", time: "06:15", url: "https://www.ft.com/content/5e6db1ad-6ea5-44db-80fd-fd7073d9e676" },
  { id: "bfdaff1c-07a3-4b53-9b47-7e69e6c197b6", title: "Puig’s José Manuel Albesa talks taste", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/bfdaff1c-07a3-4b53-9b47-7e69e6c197b6" },
  { id: "007e0862-ffe7-4b8f-a540-05a19d1a45dc", title: "The cowboy clinics selling unproven longevity treatments", date: "2026-08-28", time: "05:00", url: "https://www.ft.com/content/007e0862-ffe7-4b8f-a540-05a19d1a45dc" },
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
];
