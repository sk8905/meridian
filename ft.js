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
  { id: "792e9e30-7a96-402c-a472-d7304f5bc1ef", title: "Iceland summons US ambassador over Trump’s Stars and Stripes map", date: "2026-09-08", time: "14:09", url: "https://www.ft.com/content/792e9e30-7a96-402c-a472-d7304f5bc1ef" },
  { id: "6b9afdfb-26f5-4746-8ff9-027a8d04cb1f", title: "Submit your questions: is Trump losing his touch?", date: "2026-09-08", time: "13:50", url: "https://www.ft.com/content/6b9afdfb-26f5-4746-8ff9-027a8d04cb1f" },
  { id: "990e71e5-bfa3-4ebb-963d-f8693c5ac7b1", title: "UK announces import ban on goods linked to Israeli settlements in West Bank", date: "2026-09-08", time: "13:43", url: "https://www.ft.com/content/990e71e5-bfa3-4ebb-963d-f8693c5ac7b1" },
  { id: "769abc3f-5e34-41b4-946a-16cab58010a7", title: "Is it time for Eurozone GDP ex-Ireland?", date: "2026-09-08", time: "13:15", url: "https://www.ft.com/content/769abc3f-5e34-41b4-946a-16cab58010a7" },
  { id: "a386c753-9f55-4429-b2c9-251d3bff8f58", title: "Ceuta demands EU help over migrant ‘pressure cooker’", date: "2026-09-08", time: "13:08", url: "https://www.ft.com/content/a386c753-9f55-4429-b2c9-251d3bff8f58" },
  { id: "dda770b2-79b4-48bb-b141-0e1291d08115", title: "The new fiscal threats to monetary policy", date: "2026-09-08", time: "12:30", url: "https://www.ft.com/content/dda770b2-79b4-48bb-b141-0e1291d08115" },
  { id: "4320e779-73ab-4e56-ad13-9d5e9aa48b3c", title: "The yawning gap between ambition and action on nuclear energy", date: "2026-09-08", time: "12:00", url: "https://www.ft.com/content/4320e779-73ab-4e56-ad13-9d5e9aa48b3c" },
  { id: "53d6b648-ea21-43a9-ba89-f1102462ff9b", title: "Innovation is the answer to Britain’s elusive growth problem", date: "2026-09-08", time: "11:41", url: "https://www.ft.com/content/53d6b648-ea21-43a9-ba89-f1102462ff9b" },
  { id: "359e9dac-cc19-4a93-8155-3d087adf4103", title: "John Healey faces MPs as pressure on UK public finances mounts", date: "2026-09-08", time: "11:24", url: "https://www.ft.com/content/359e9dac-cc19-4a93-8155-3d087adf4103" },
  { id: "e8273e59-36e9-42a0-a7f0-8df556480c75", title: "Europe battles to catch US and China in space race", date: "2026-09-08", time: "11:21", url: "https://www.ft.com/content/e8273e59-36e9-42a0-a7f0-8df556480c75" },
  { id: "a5092cb2-1625-47b8-b0b2-7bafefdd05da", title: "Sales of ‘Made in EU’ counterfeit cigarettes surge in Europe", date: "2026-09-08", time: "11:00", url: "https://www.ft.com/content/a5092cb2-1625-47b8-b0b2-7bafefdd05da" },
  { id: "3892b29e-f905-4082-9a2c-4969970d3d35", title: "Liberty Global agrees €670mn towers sale ahead of Ziggo spinoff", date: "2026-09-08", time: "10:55", url: "https://www.ft.com/content/3892b29e-f905-4082-9a2c-4969970d3d35" },
  { id: "b23151c3-b4c1-4f96-a801-f3507d907cc7", title: "UK pays highest borrowing cost since 1998 at gilt sale", date: "2026-09-08", time: "10:50", url: "https://www.ft.com/content/b23151c3-b4c1-4f96-a801-f3507d907cc7" },
  { id: "dc6c9fe1-c400-490a-a4fe-8b3d5cf3334a", title: "FirstFT: Top credit rating sought for Anthropic and OpenAI", date: "2026-09-08", time: "10:48", url: "https://www.ft.com/content/dc6c9fe1-c400-490a-a4fe-8b3d5cf3334a" },
  { id: "d9bc67e2-97f4-47ef-8de5-1ae48d841018", title: "Wave of Houthi strikes halts work at energy facilities in four Saudi cities", date: "2026-09-08", time: "09:48", url: "https://www.ft.com/content/d9bc67e2-97f4-47ef-8de5-1ae48d841018" },
  { id: "10717d24-c247-4522-b6d6-6e4ea0947cc3", title: "The political challenge of Britain’s mounting debt costs", date: "2026-09-08", time: "09:38", url: "https://www.ft.com/content/10717d24-c247-4522-b6d6-6e4ea0947cc3" },
  { id: "1f71d2d0-d2e2-46da-a96f-99d20936223e", title: "UK set to announce trade ban on Israeli settlements in West Bank", date: "2026-09-08", time: "09:35", url: "https://www.ft.com/content/1f71d2d0-d2e2-46da-a96f-99d20936223e" },
  { id: "98d06e87-83f0-45dc-b69b-418fc789ac96", title: "The complicated implications of the spectacular ‘Apollo premium’", date: "2026-09-08", time: "09:22", url: "https://www.ft.com/content/98d06e87-83f0-45dc-b69b-418fc789ac96" },
  { id: "b5cb6500-89be-42a4-a417-e0d252e5e0e8", title: "DWS embraces Deutsche Bank name eight years after distancing itself", date: "2026-09-08", time: "09:21", url: "https://www.ft.com/content/b5cb6500-89be-42a4-a417-e0d252e5e0e8" },
  { id: "be7c3d20-4e4f-4a73-8927-cc5a4d6cccca", title: "July wage data bolsters case for BoJ tightening this month", date: "2026-09-08", time: "09:18", url: "https://www.ft.com/content/be7c3d20-4e4f-4a73-8927-cc5a4d6cccca" },
  { id: "f06ee0ea-adcf-44ec-80c9-bb616885d8de", title: "Singapore raises PM Lawrence Wong’s pay by $1mn", date: "2026-09-08", time: "08:29", url: "https://www.ft.com/content/f06ee0ea-adcf-44ec-80c9-bb616885d8de" },
  { id: "0815cd34-bf4c-4771-8bf5-710eff286763", title: "Russia launches missile strikes against Kyiv as pause in raids ends", date: "2026-09-08", time: "07:46", url: "https://www.ft.com/content/0815cd34-bf4c-4771-8bf5-710eff286763" },
  { id: "5cc2d577-0418-4728-8657-aa6b2efb6597", title: "The strangely disappointing EM inflows", date: "2026-09-08", time: "06:30", url: "https://www.ft.com/content/5cc2d577-0418-4728-8657-aa6b2efb6597" },
  { id: "e7f51e7c-d272-436f-b918-3de002bf85d9", title: "FTAV’s further reading", date: "2026-09-08", time: "06:30", url: "https://www.ft.com/content/e7f51e7c-d272-436f-b918-3de002bf85d9" },
  { id: "56bcc2fb-99eb-4ad9-af67-101c8d0382cb", title: "China’s 25% export surge sets stage for record annual trade surplus", date: "2026-09-08", time: "06:15", url: "https://www.ft.com/content/56bcc2fb-99eb-4ad9-af67-101c8d0382cb" },
  { id: "e38fbc18-f0aa-4d0b-84ca-4b8a2dcf419a", title: "Antitrust not the enemy of industrial policy, says EU competition enforcer", date: "2026-09-08", time: "06:00", url: "https://www.ft.com/content/e38fbc18-f0aa-4d0b-84ca-4b8a2dcf419a" },
  { id: "adbf5262-c4d5-4312-a9b8-4d3cf30c9e00", title: "Mistral raises record €3bn as Europe strains to keep pace in AI race", date: "2026-09-08", time: "06:00", url: "https://www.ft.com/content/adbf5262-c4d5-4312-a9b8-4d3cf30c9e00" },
  { id: "22792fd1-e089-4e56-9ece-171c56ffe422", title: "Labour’s muddled migration policy won’t stop thuggery", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/22792fd1-e089-4e56-9ece-171c56ffe422" },
  { id: "ed214778-2a6d-4862-99b5-abc256daff92", title: "AI is ushering in an era of mass toe-treading at work", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/ed214778-2a6d-4862-99b5-abc256daff92" },
  { id: "c6517e52-b855-487c-8408-7071936cf3b0", title: "Global shipping rules are collapsing, say maritime nations", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/c6517e52-b855-487c-8408-7071936cf3b0" },
  { id: "2f0b8e53-60dc-4d31-b31f-9534908c10ae", title: "The cost of being Apollo", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/2f0b8e53-60dc-4d31-b31f-9534908c10ae" },
  { id: "462fddd0-850d-46e0-b2e7-5804d483ab52", title: "Why Japan Inc can brush off interest-rate hikes — and America can’t", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/462fddd0-850d-46e0-b2e7-5804d483ab52" },
  { id: "7c53cee9-3066-4722-acf6-17daa2f54631", title: "EU opens door to bigger corporate mergers", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/7c53cee9-3066-4722-acf6-17daa2f54631" },
  { id: "4f28ef6c-f727-4d36-88a3-bbdbd13ddfbf", title: "The world’s $2tn interest bill", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/4f28ef6c-f727-4d36-88a3-bbdbd13ddfbf" },
  { id: "f6a26a17-985f-4283-99c4-ba5d54e94e7f", title: "Britain’s grid operator gave Palantir contract without inviting rival bids", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/f6a26a17-985f-4283-99c4-ba5d54e94e7f" },
  { id: "aa304856-cade-4ad8-a2bf-2dd34fa75b1b", title: "Anthropic and OpenAI bankers push for top-tier credit ratings post-IPO", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/aa304856-cade-4ad8-a2bf-2dd34fa75b1b" },
  { id: "1de12ab6-0343-4113-a832-b0f11c3a9b7a", title: "Offshore borrowing in renminbi hits record high", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/1de12ab6-0343-4113-a832-b0f11c3a9b7a" },
  { id: "e4853480-b6a6-4ae7-81d5-aa2cf819093e", title: "The world’s approach to sovereign debt needs to change", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/e4853480-b6a6-4ae7-81d5-aa2cf819093e" },
  { id: "410ee6b6-177b-46fb-9e9c-d388322725c5", title: "Who is Britain’s best CEO? You decide", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/410ee6b6-177b-46fb-9e9c-d388322725c5" },
  { id: "ab6233dc-bfdb-48d8-b71c-864ec040e78d", title: "The battle to prove who owns Gaza’s ruins", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/ab6233dc-bfdb-48d8-b71c-864ec040e78d" },
];
