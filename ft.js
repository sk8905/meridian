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
  { id: "1053717b-be89-4044-bf43-59603247dd3f", title: "How a murder trial became a booming business for online creators", date: "2026-09-21", time: "11:00", url: "https://www.ft.com/content/1053717b-be89-4044-bf43-59603247dd3f" },
  { id: "9f57e612-1068-43ab-889a-febad1602c4a", title: "Digital euro makes debut in wholesale financial markets", date: "2026-09-21", time: "11:00", url: "https://www.ft.com/content/9f57e612-1068-43ab-889a-febad1602c4a" },
  { id: "18f9e0ac-b7d9-4648-803f-3e894990c626", title: "Slide in oil prices drives rebound in battered government bonds", date: "2026-09-21", time: "10:54", url: "https://www.ft.com/content/18f9e0ac-b7d9-4648-803f-3e894990c626" },
  { id: "63140a82-8af6-4af8-90bd-0325c5724e74", title: "News outlets to sue Trump administration over White House ban", date: "2026-09-21", time: "10:50", url: "https://www.ft.com/content/63140a82-8af6-4af8-90bd-0325c5724e74" },
  { id: "4e7004b7-d262-40c8-b979-fdf7f237adda", title: "SoftBank launches one of biggest junk bond deals to fund OpenAI bet", date: "2026-09-21", time: "10:32", url: "https://www.ft.com/content/4e7004b7-d262-40c8-b979-fdf7f237adda" },
  { id: "adb80fa3-b54a-4b3d-8ed2-0ebe55a5e05e", title: "Donald Trump presses Volodymyr Zelenskyy to stop hitting Russian refineries", date: "2026-09-21", time: "10:20", url: "https://www.ft.com/content/adb80fa3-b54a-4b3d-8ed2-0ebe55a5e05e" },
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
  { id: "2f2c4fa1-974f-46dd-9b99-beeee991969b", title: "FirstFT: Merz vows to stay on despite German election ‘disaster’", date: "2026-09-21", time: "05:32", url: "https://www.ft.com/content/2f2c4fa1-974f-46dd-9b99-beeee991969b" },
  { id: "d29d769e-039c-4d11-9152-e63ccd397b32", title: "US and China agree to AI dialogue ahead of Trump-Xi meeting", date: "2026-09-21", time: "05:11", url: "https://www.ft.com/content/d29d769e-039c-4d11-9152-e63ccd397b32" },
  { id: "188611f3-2536-4bed-a2c0-bbc074e6f783", title: "Volkswagen ejected from European blue-chip index in blow to crisis-hit carmaker", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/188611f3-2536-4bed-a2c0-bbc074e6f783" },
  { id: "708699ba-442b-46a2-9de7-805fb3ddaf24", title: "Carlyle’s stalled Lukoil deal leaves refineries idle in tight market", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/708699ba-442b-46a2-9de7-805fb3ddaf24" },
  { id: "960f930b-1f1f-4161-ae6c-fc8ed5ec4ed9", title: "Private ADHD clinics are misdiagnosing children, report will say", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/960f930b-1f1f-4161-ae6c-fc8ed5ec4ed9" },
  { id: "fdb3a153-4b10-4ac0-987a-c4e0b02a5b3a", title: "AI in finance must be policed differently", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/fdb3a153-4b10-4ac0-987a-c4e0b02a5b3a" },
  { id: "f88b1f1b-d00b-4aae-8ad6-de1302755333", title: "Europe must not cut US arms ties, warns defence boss", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/f88b1f1b-d00b-4aae-8ad6-de1302755333" },
  { id: "2cf96368-8f17-4b5d-88e0-9c5e4058ffe4", title: "Fuel subsidies weigh on public finances as energy crisis deepens", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/2cf96368-8f17-4b5d-88e0-9c5e4058ffe4" },
  { id: "6f0ceb7d-597d-4c83-ac8b-0fe7c8bd74f9", title: "Why the world’s hottest stock market is a national liability", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/6f0ceb7d-597d-4c83-ac8b-0fe7c8bd74f9" },
  { id: "f2dca0b0-6387-4022-8dba-dc8015823dfe", title: "The cartel civil war tearing apart a Mexican state", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/f2dca0b0-6387-4022-8dba-dc8015823dfe" },
  { id: "01a7b883-452c-4902-b40e-e3957de5d89e", title: "Lex in depth: Anthropic at $2tn isn’t far-fetched", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/01a7b883-452c-4902-b40e-e3957de5d89e" },
  { id: "5997a562-f343-4699-abd4-b86d4493d259", title: "Lobbyists move to Manchester for closer access to Number 10 North", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/5997a562-f343-4699-abd4-b86d4493d259" },
  { id: "f1d9d398-0666-44cf-96f4-390e6c3f5173", title: "Fed and BoE step up scrutiny of bank exposure to trading firms after Jane Street loss", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/f1d9d398-0666-44cf-96f4-390e6c3f5173" },
  { id: "3ce6132f-d2c0-4bdd-b995-628aa2da25d2", title: "Grant Thornton boss defends private equity ownership", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/3ce6132f-d2c0-4bdd-b995-628aa2da25d2" },
  { id: "ac00f93b-4554-419b-bd30-9ca2316d8c2c", title: "Germany’s Merz vows to stay despite ‘disaster’", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/ac00f93b-4554-419b-bd30-9ca2316d8c2c" },
  { id: "df52a49a-ab6a-4997-a609-169e830a26fa", title: "Nik Storonsky’s plan for Revolut: a global bank with ‘effectively zero risk’", date: "2026-09-21", time: "04:00", url: "https://www.ft.com/content/df52a49a-ab6a-4997-a609-169e830a26fa" },
  { id: "a4901983-10a2-488d-8725-66177d6f9ea2", title: "Germany’s Merz stands his ground but for how long?", date: "2026-09-21", time: "03:05", url: "https://www.ft.com/content/a4901983-10a2-488d-8725-66177d6f9ea2" },
  { id: "0e4ab05c-93f9-400f-bf42-22074c184ee7", title: "Is this Indonesia’s next president?", date: "2026-09-21", time: "02:54", url: "https://www.ft.com/content/0e4ab05c-93f9-400f-bf42-22074c184ee7" },
  { id: "66623b14-f679-48ad-85a5-5d75f1cc8c17", title: "A UN gathering notable for its absences", date: "2026-09-20", time: "18:15", url: "https://www.ft.com/content/66623b14-f679-48ad-85a5-5d75f1cc8c17" },
  { id: "d9e6c07e-7d84-4e41-a9a2-0d0ac2319dd2", title: "Multilateralism is not idealism, it is a necessity", date: "2026-09-20", time: "18:00", url: "https://www.ft.com/content/d9e6c07e-7d84-4e41-a9a2-0d0ac2319dd2" },
  { id: "d74ce82a-2a15-404a-ae3a-3921e887bab3", title: "German chancellor Merz vows to stay on despite ‘disaster’ in regional elections", date: "2026-09-20", time: "18:49", url: "https://www.ft.com/content/d74ce82a-2a15-404a-ae3a-3921e887bab3" },
  { id: "33b317b4-cd7b-486a-8707-4d65db837c6d", title: "Trump says 250ft arch will be ‘military complex’ with drones and snipers", date: "2026-09-20", time: "16:43", url: "https://www.ft.com/content/33b317b4-cd7b-486a-8707-4d65db837c6d" },
  { id: "f4535bd7-7c23-4eb7-b306-43dab2772dd3", title: "Andy Burnham hopes to build bridges with Donald Trump at first meeting", date: "2026-09-20", time: "16:37", url: "https://www.ft.com/content/f4535bd7-7c23-4eb7-b306-43dab2772dd3" },
  { id: "f37d9712-009a-4573-b268-a438b4c7502b", title: "Labour MPs warn against mansion tax change in Budget", date: "2026-09-20", time: "16:27", url: "https://www.ft.com/content/f37d9712-009a-4573-b268-a438b4c7502b" },
];
