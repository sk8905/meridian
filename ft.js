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
  { id: "f29de45a-3d32-4d9f-90cd-615f7466c1de", title: "US data centres ‘are short six NYCs of electricity’", date: "2026-09-21", time: "17:01", url: "https://www.ft.com/content/f29de45a-3d32-4d9f-90cd-615f7466c1de" },
  { id: "f3092492-9e70-4987-a359-22e31f93b77b", title: "Changing leader is not the panacea many Lib Dems think it is", date: "2026-09-21", time: "16:28", url: "https://www.ft.com/content/f3092492-9e70-4987-a359-22e31f93b77b" },
  { id: "0bfc882f-fe1b-40cb-a356-162e833f2008", title: "Paramount reaches settlement to clear path for $110bn Warner Bros deal", date: "2026-09-21", time: "16:15", url: "https://www.ft.com/content/0bfc882f-fe1b-40cb-a356-162e833f2008" },
  { id: "e173bec6-352b-4b51-b3a4-382a9229bc86", title: "Federal Reserve will need to be ‘aggressive’ on inflation, says top official", date: "2026-09-21", time: "16:10", url: "https://www.ft.com/content/e173bec6-352b-4b51-b3a4-382a9229bc86" },
  { id: "2f8ea519-9e2e-4ab2-9061-18729503ff24", title: "Spanish PM’s wife to stand trial over corruption charges", date: "2026-09-21", time: "16:04", url: "https://www.ft.com/content/2f8ea519-9e2e-4ab2-9061-18729503ff24" },
  { id: "378926f5-0494-4f5e-8bd1-e1775980ab82", title: "China accuses ousted top generals of ‘disloyalty’", date: "2026-09-21", time: "15:54", url: "https://www.ft.com/content/378926f5-0494-4f5e-8bd1-e1775980ab82" },
  { id: "e40691e8-e96e-444a-baf7-ae3dfef99bce", title: "Germany’s Merz hits out at ‘destructive’ forces as he fights for survival", date: "2026-09-21", time: "15:41", url: "https://www.ft.com/content/e40691e8-e96e-444a-baf7-ae3dfef99bce" },
  { id: "79976fed-30c3-46e7-ba90-59e0633575d5", title: "Submit your questions: Where are the biggest market risks?", date: "2026-09-21", time: "14:57", url: "https://www.ft.com/content/79976fed-30c3-46e7-ba90-59e0633575d5" },
  { id: "be0ac16e-2357-45f8-8f4f-42c009e70a6f", title: "Trump vs the US Supreme Court", date: "2026-09-21", time: "14:00", url: "https://www.ft.com/content/be0ac16e-2357-45f8-8f4f-42c009e70a6f" },
  { id: "36175b45-b177-448c-95d0-3221d539ab89", title: "And the charts quiz winner is . . . ", date: "2026-09-21", time: "13:58", url: "https://www.ft.com/content/36175b45-b177-448c-95d0-3221d539ab89" },
  { id: "2a0d724d-b2be-4539-a4ab-30ba919cd253", title: "Gulf states urge reset with Iran as conflict drags on", date: "2026-09-21", time: "13:44", url: "https://www.ft.com/content/2a0d724d-b2be-4539-a4ab-30ba919cd253" },
  { id: "ba07e411-1d76-4289-83b0-96d694f95d08", title: "The food safety sheriff on a hygiene crusade in Mumbai", date: "2026-09-21", time: "13:08", url: "https://www.ft.com/content/ba07e411-1d76-4289-83b0-96d694f95d08" },
  { id: "aa1dbf18-eaa3-411a-9bf0-52c99adcb7a8", title: "Trump and Xi are the wrong men at the wrong time", date: "2026-09-21", time: "12:59", url: "https://www.ft.com/content/aa1dbf18-eaa3-411a-9bf0-52c99adcb7a8" },
  { id: "b0125efa-396b-4650-be90-a8a5a7fc51e6", title: "Saudi wealth fund presses LIV Golf’s saviour to prove its commitment to tour", date: "2026-09-21", time: "12:41", url: "https://www.ft.com/content/b0125efa-396b-4650-be90-a8a5a7fc51e6" },
  { id: "f9ddd64e-1656-4a15-a67a-f68087cefa79", title: "Meta gives union access to recruit UK staff for first time", date: "2026-09-21", time: "12:34", url: "https://www.ft.com/content/f9ddd64e-1656-4a15-a67a-f68087cefa79" },
  { id: "71016c06-d9bb-49ab-8584-6989d974d2f7", title: "Donald Trump’s crusade against tariff cheats may tangle up trade in red tape", date: "2026-09-21", time: "12:31", url: "https://www.ft.com/content/71016c06-d9bb-49ab-8584-6989d974d2f7" },
  { id: "18f9e0ac-b7d9-4648-803f-3e894990c626", title: "Slide in oil prices drives rebound in battered government bonds", date: "2026-09-21", time: "11:55", url: "https://www.ft.com/content/18f9e0ac-b7d9-4648-803f-3e894990c626" },
  { id: "63140a82-8af6-4af8-90bd-0325c5724e74", title: "News outlets to sue Trump administration over White House ban", date: "2026-09-21", time: "11:50", url: "https://www.ft.com/content/63140a82-8af6-4af8-90bd-0325c5724e74" },
  { id: "2f2c4fa1-974f-46dd-9b99-beeee991969b", title: "FirstFT: Bank exposure to trading firms scrutinised", date: "2026-09-21", time: "11:20", url: "https://www.ft.com/content/2f2c4fa1-974f-46dd-9b99-beeee991969b" },
  { id: "adb80fa3-b54a-4b3d-8ed2-0ebe55a5e05e", title: "Donald Trump presses Volodymyr Zelenskyy to stop hitting Russian refineries", date: "2026-09-21", time: "11:20", url: "https://www.ft.com/content/adb80fa3-b54a-4b3d-8ed2-0ebe55a5e05e" },
  { id: "1053717b-be89-4044-bf43-59603247dd3f", title: "How a murder trial became a booming business for online creators", date: "2026-09-21", time: "11:00", url: "https://www.ft.com/content/1053717b-be89-4044-bf43-59603247dd3f" },
  { id: "9f57e612-1068-43ab-889a-febad1602c4a", title: "Digital euro makes debut in wholesale financial markets", date: "2026-09-21", time: "11:00", url: "https://www.ft.com/content/9f57e612-1068-43ab-889a-febad1602c4a" },
  { id: "4e7004b7-d262-40c8-b979-fdf7f237adda", title: "SoftBank launches one of biggest junk bond deals to fund OpenAI bet", date: "2026-09-21", time: "10:32", url: "https://www.ft.com/content/4e7004b7-d262-40c8-b979-fdf7f237adda" },
  { id: "946b1b1e-292d-40ec-9cd8-dbf0475f4141", title: "UK flights disrupted by latest air traffic control problem", date: "2026-09-21", time: "10:14", url: "https://www.ft.com/content/946b1b1e-292d-40ec-9cd8-dbf0475f4141" },
  { id: "23398237-6cfb-436a-bb68-b991dc415088", title: "Banks face regulatory barriers to rapid AI reform, says SocGen chief", date: "2026-09-21", time: "10:00", url: "https://www.ft.com/content/23398237-6cfb-436a-bb68-b991dc415088" },
  { id: "984d32cd-184a-4334-8b40-93608c8c0fbc", title: "Rising bond yields should prompt central banks to tighten further", date: "2026-09-21", time: "09:47", url: "https://www.ft.com/content/984d32cd-184a-4334-8b40-93608c8c0fbc" },
  { id: "59da7ce1-d933-4c8c-a35d-14800b175411", title: "Ed Davey leads Liberal Democrats with firm hand", date: "2026-09-21", time: "09:30", url: "https://www.ft.com/content/59da7ce1-d933-4c8c-a35d-14800b175411" },
  { id: "eeef7db4-b26d-426f-896b-f7b95bb84223", title: "Chinese rare earth shipments to US drop ahead of Trump-Xi summit", date: "2026-09-21", time: "08:45", url: "https://www.ft.com/content/eeef7db4-b26d-426f-896b-f7b95bb84223" },
  { id: "a1c9d298-8af9-4cf4-9c47-e2eb50cd03d9", title: "Trafigura to float supertanker arm in first IPO of a business", date: "2026-09-21", time: "07:30", url: "https://www.ft.com/content/a1c9d298-8af9-4cf4-9c47-e2eb50cd03d9" },
  { id: "3b646756-12bc-442f-b77b-6583cee6de46", title: "FTAV’s further reading", date: "2026-09-21", time: "07:10", url: "https://www.ft.com/content/3b646756-12bc-442f-b77b-6583cee6de46" },
  { id: "9f3fd7bc-ca51-4401-8f63-b6b25e88621f", title: "Nepotism at Berkshire", date: "2026-09-21", time: "06:30", url: "https://www.ft.com/content/9f3fd7bc-ca51-4401-8f63-b6b25e88621f" },
  { id: "9bb5f4e4-0dc5-4e89-98d5-14e9a4c4dd91", title: "Vienna and Rome spearhead red tape bonfire to boost EU competitiveness", date: "2026-09-21", time: "06:00", url: "https://www.ft.com/content/9bb5f4e4-0dc5-4e89-98d5-14e9a4c4dd91" },
  { id: "6303730d-5889-413f-8fdb-3e3b8e7657b2", title: "How money moved across Mark Walter’s empire", date: "2026-09-21", time: "06:00", url: "https://www.ft.com/content/6303730d-5889-413f-8fdb-3e3b8e7657b2" },
  { id: "13cb8980-e8fa-4848-953f-8aa6e98ca219", title: "Octopus still won’t give investors their money back", date: "2026-09-21", time: "06:00", url: "https://www.ft.com/content/13cb8980-e8fa-4848-953f-8aa6e98ca219" },
  { id: "d29d769e-039c-4d11-9152-e63ccd397b32", title: "Scott Bessent hails US-China AI dialogue ahead of Trump-Xi meeting", date: "2026-09-21", time: "05:11", url: "https://www.ft.com/content/d29d769e-039c-4d11-9152-e63ccd397b32" },
  { id: "188611f3-2536-4bed-a2c0-bbc074e6f783", title: "Volkswagen ejected from European blue-chip index in blow to crisis-hit carmaker", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/188611f3-2536-4bed-a2c0-bbc074e6f783" },
  { id: "708699ba-442b-46a2-9de7-805fb3ddaf24", title: "Carlyle’s stalled Lukoil deal leaves refineries idle in tight market", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/708699ba-442b-46a2-9de7-805fb3ddaf24" },
  { id: "960f930b-1f1f-4161-ae6c-fc8ed5ec4ed9", title: "Private ADHD clinics are misdiagnosing children, report will say", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/960f930b-1f1f-4161-ae6c-fc8ed5ec4ed9" },
  { id: "fdb3a153-4b10-4ac0-987a-c4e0b02a5b3a", title: "AI in finance must be policed differently", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/fdb3a153-4b10-4ac0-987a-c4e0b02a5b3a" },
  { id: "f88b1f1b-d00b-4aae-8ad6-de1302755333", title: "Europe must not cut US arms ties, warns defence boss", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/f88b1f1b-d00b-4aae-8ad6-de1302755333" },
];
