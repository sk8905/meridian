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
  { id: "1f78b692-4389-49a1-bd48-903252cc282f", title: "Von der Leyen to paint EU as the only port in a global geopolitical storm", date: "2026-09-16", time: "06:00", url: "https://www.ft.com/content/1f78b692-4389-49a1-bd48-903252cc282f" },
  { id: "3401a104-598d-4145-a03b-8bb08b2d7165", title: "The BoE’s three balance sheet problem", date: "2026-09-16", time: "06:00", url: "https://www.ft.com/content/3401a104-598d-4145-a03b-8bb08b2d7165" },
  { id: "6b6a27bd-2725-4591-be8a-fda643c2ac5c", title: "World’s best-performing sovereign wealth fund expects equities pullback", date: "2026-09-16", time: "05:55", url: "https://www.ft.com/content/6b6a27bd-2725-4591-be8a-fda643c2ac5c" },
  { id: "96ea6daf-086f-49ff-bbe3-c42cf63561ec", title: "FirstFT: EU rebuffs ‘unique alliance’ with Canada", date: "2026-09-16", time: "05:30", url: "https://www.ft.com/content/96ea6daf-086f-49ff-bbe3-c42cf63561ec" },
  { id: "ef511d46-a689-4868-9654-15b96a71586d", title: "The precarious fusion boom", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/ef511d46-a689-4868-9654-15b96a71586d" },
  { id: "69a2a7a0-ecd2-4d05-915c-55a6352889ff", title: "Sullivan & Cromwell discovers private equity", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/69a2a7a0-ecd2-4d05-915c-55a6352889ff" },
  { id: "9dd894cd-dddd-4388-ac00-dbd14d40dc52", title: "With AI, ‘I told you so’ will be too late", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/9dd894cd-dddd-4388-ac00-dbd14d40dc52" },
  { id: "2e2e0c1e-51d6-49e2-9f4a-6ef793908b85", title: "EU rebuffs Mark Carney’s ‘unique alliance’ with Canada", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/2e2e0c1e-51d6-49e2-9f4a-6ef793908b85" },
  { id: "f62e467a-bcb6-423d-96f2-b2b1e08faaa8", title: "Fed should defy Donald Trump with rate rise, top economists say", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/f62e467a-bcb6-423d-96f2-b2b1e08faaa8" },
  { id: "3c38362f-70c3-4275-bcfd-bea41a2bf473", title: "UK looks to ‘land drones’ to transform beleaguered Ajax fighting vehicles", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/3c38362f-70c3-4275-bcfd-bea41a2bf473" },
  { id: "90fd247a-69a0-4066-aa9d-f51a3e659434", title: "Crispin Odey judgment is lesson for firms with ‘slapdash’ ethics, warns FCA", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/90fd247a-69a0-4066-aa9d-f51a3e659434" },
  { id: "786b8ce5-3a11-4e34-b811-41ec165f5916", title: "Ørsted boss says Europe must act on ‘unfair’ Chinese wind turbine makers", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/786b8ce5-3a11-4e34-b811-41ec165f5916" },
  { id: "05dc65e9-0a60-4914-a39f-cf3cc2139513", title: "UK chancellor considering Budget tax raid on higher stake slot machines", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/05dc65e9-0a60-4914-a39f-cf3cc2139513" },
  { id: "4d69377c-a2b6-4c20-a485-3dbbafc6daa3", title: "AI can forecast the future. Should we let it?", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/4d69377c-a2b6-4c20-a485-3dbbafc6daa3" },
  { id: "3a216d29-6ed0-46a2-9835-2d9b427b7e88", title: "‘Buy British’ military procurement is a poor way to defend the realm", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/3a216d29-6ed0-46a2-9835-2d9b427b7e88" },
  { id: "9e7aa9ce-6c02-49fc-9224-62fb5767f1b1", title: "A hotter planet meets dearer money", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/9e7aa9ce-6c02-49fc-9224-62fb5767f1b1" },
  { id: "0aa2e6af-195d-40cc-a813-3e130cbb5553", title: "In Germany’s east, old ties to Moscow fuel AfD rise", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/0aa2e6af-195d-40cc-a813-3e130cbb5553" },
  { id: "2285c111-b103-4b04-96c7-fe26a3c04c3e", title: "US billionaires line up to bankroll Republicans’ election push", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/2285c111-b103-4b04-96c7-fe26a3c04c3e" },
  { id: "a4d98da2-12e2-4c6a-a60c-46aaeb69ff2a", title: "A top London lawyer wants to create ‘the California of Europe’ in the Algarve", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/a4d98da2-12e2-4c6a-a60c-46aaeb69ff2a" },
  { id: "c11fd1dd-8783-4894-9f53-109d7edf376f", title: "How Switzerland turned tax competition into a national sport", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/c11fd1dd-8783-4894-9f53-109d7edf376f" },
  { id: "2e3ad452-cd81-4df0-8eec-09112033ea37", title: "The unravelling of Missoni", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/2e3ad452-cd81-4df0-8eec-09112033ea37" },
  { id: "6ec74be5-9e4c-49c0-a9dc-d3a0ae324a17", title: "Hedge fund warned ousted lawyer to settle £36bn BHP dam collapse claim", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/6ec74be5-9e4c-49c0-a9dc-d3a0ae324a17" },
  { id: "ffe402ca-564a-457f-a861-18083a361e50", title: "Iran’s hidden leader stirs unease at home", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/ffe402ca-564a-457f-a861-18083a361e50" },
  { id: "4e14f546-332e-4723-b75c-8f6744329733", title: "UK ‘actively’ exploring joining Canada-led global defence bank", date: "2026-09-15", time: "20:13", url: "https://www.ft.com/content/4e14f546-332e-4723-b75c-8f6744329733" },
  { id: "8c8e7688-fae5-41d5-93d1-7be39dd2639f", title: "Iran uses spyware disguised as MRI scan results to hack critics, say western officials", date: "2026-09-15", time: "19:57", url: "https://www.ft.com/content/8c8e7688-fae5-41d5-93d1-7be39dd2639f" },
  { id: "b8b0e43d-3b5c-4531-9f7a-da65d516ea17", title: "UK bosses must ‘sit down’ with staff if they block WFH requests", date: "2026-09-15", time: "19:18", url: "https://www.ft.com/content/b8b0e43d-3b5c-4531-9f7a-da65d516ea17" },
  { id: "752e9694-9e47-4da1-a90a-ec1965665b08", title: "Colombian president fires statistics chief after three weeks", date: "2026-09-15", time: "19:17", url: "https://www.ft.com/content/752e9694-9e47-4da1-a90a-ec1965665b08" },
  { id: "5e2327aa-dbd0-4a79-8c99-622a893876d7", title: "Ten-year Treasury yield hits highest level since 2007", date: "2026-09-15", time: "19:13", url: "https://www.ft.com/content/5e2327aa-dbd0-4a79-8c99-622a893876d7" },
  { id: "4b9952d5-3cc8-48ef-8619-daa15a0a6af1", title: "Exxon wins Texas approval for $5bn carbon capture project", date: "2026-09-15", time: "18:43", url: "https://www.ft.com/content/4b9952d5-3cc8-48ef-8619-daa15a0a6af1" },
  { id: "97f3d2b7-0282-42a7-bbb7-538624441a8a", title: "Hackers say they breached Italian state email to target Revolut ‘crypto whales’", date: "2026-09-15", time: "18:27", url: "https://www.ft.com/content/97f3d2b7-0282-42a7-bbb7-538624441a8a" },
  { id: "6bbec28d-7ccf-455b-932a-0edad91a6d0e", title: "Larry Ellison shows even billionaires struggle with liquidity", date: "2026-09-15", time: "18:24", url: "https://www.ft.com/content/6bbec28d-7ccf-455b-932a-0edad91a6d0e" },
  { id: "69b514eb-d627-4d46-9218-0842706c7115", title: "Iron ore trader Radiant alleges Glencore hid their ties from audited records", date: "2026-09-15", time: "18:17", url: "https://www.ft.com/content/69b514eb-d627-4d46-9218-0842706c7115" },
  { id: "e14542d9-2bc5-49c8-8e7e-c9656b0a2d36", title: "US manufacturers hit by fresh burst of supply chain cost inflation", date: "2026-09-15", time: "16:26", url: "https://www.ft.com/content/e14542d9-2bc5-49c8-8e7e-c9656b0a2d36" },
  { id: "cacaf167-5d13-420c-8624-4e5f9b227028", title: "Scotch producers fume over legal protection for English whisky", date: "2026-09-15", time: "17:59", url: "https://www.ft.com/content/cacaf167-5d13-420c-8624-4e5f9b227028" },
  { id: "a3830162-2f40-46b7-8259-0db45fe2acef", title: "US prosecutors say Chinese groups used Binance to launder $61mn from Iranian oil deals", date: "2026-09-15", time: "17:52", url: "https://www.ft.com/content/a3830162-2f40-46b7-8259-0db45fe2acef" },
  { id: "e89bfb29-2aef-40ec-9c9d-b9c1afa783a8", title: "Iran war has left US with munitions ‘shortfall’, Pentagon watchdog says", date: "2026-09-15", time: "17:10", url: "https://www.ft.com/content/e89bfb29-2aef-40ec-9c9d-b9c1afa783a8" },
  { id: "7e2ae9c8-4c94-4550-bdfb-bb003e4780d8", title: "Reform UK’s leader in Wales steps down after being ‘reported to the police’", date: "2026-09-15", time: "17:01", url: "https://www.ft.com/content/7e2ae9c8-4c94-4550-bdfb-bb003e4780d8" },
  { id: "08ddd08c-97b2-46a0-a4ed-b3b4ff5ebfd9", title: "Saudi leader visits Egypt for security talks as war with Houthis intensifies", date: "2026-09-15", time: "16:27", url: "https://www.ft.com/content/08ddd08c-97b2-46a0-a4ed-b3b4ff5ebfd9" },
  { id: "b3674c9d-9db2-448d-bd57-f1c040de2d54", title: "Supreme Court rejects Donald Trump’s restrictions on mail-in ballots for midterms", date: "2026-09-15", time: "14:55", url: "https://www.ft.com/content/b3674c9d-9db2-448d-bd57-f1c040de2d54" },
  { id: "86078ee7-0c8a-4d2b-8ce7-4fc47d965985", title: "The main Trump-Xi summit achievement will be it happening at all", date: "2026-09-15", time: "14:00", url: "https://www.ft.com/content/86078ee7-0c8a-4d2b-8ce7-4fc47d965985" },
  { id: "4420bf7d-320f-431c-8ca9-5e554b356890", title: "AI fears spook Washington as more Republicans call for greater regulation", date: "2026-09-15", time: "14:00", url: "https://www.ft.com/content/4420bf7d-320f-431c-8ca9-5e554b356890" },
  { id: "2c206da5-63c9-405d-ae14-abe772ea32e0", title: "Santander wins £677mn legal appeal over PPI mis-selling bill", date: "2026-09-15", time: "13:10", url: "https://www.ft.com/content/2c206da5-63c9-405d-ae14-abe772ea32e0" },
];
