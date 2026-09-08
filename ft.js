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
  { id: "d9bc67e2-97f4-47ef-8de5-1ae48d841018", title: "Wave of Houthi strikes halts work at energy facilities in four Saudi cities", date: "2026-09-08", time: "09:48", url: "https://www.ft.com/content/d9bc67e2-97f4-47ef-8de5-1ae48d841018" },
  { id: "10717d24-c247-4522-b6d6-6e4ea0947cc3", title: "The political challenge of Britain’s mounting debt costs", date: "2026-09-08", time: "09:38", url: "https://www.ft.com/content/10717d24-c247-4522-b6d6-6e4ea0947cc3" },
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
  { id: "22eacb3c-6cab-490d-a117-75ba90a2d35c", title: "Merz’s CDU in crisis after far-right victory in Saxony-Anhalt", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/22eacb3c-6cab-490d-a117-75ba90a2d35c" },
  { id: "0facf3c4-147e-4696-9849-d68a4b744bd6", title: "‘Apollo premium’ drives up debt costs for private equity giant’s portfolio companies", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/0facf3c4-147e-4696-9849-d68a4b744bd6" },
  { id: "200221ed-8712-4e43-8160-23b7b9c40a04", title: "Hedge fund Millennium seeks tax deal to boost Geneva presence", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/200221ed-8712-4e43-8160-23b7b9c40a04" },
  { id: "7c53cee9-3066-4722-acf6-17daa2f54631", title: "EU opens door to bigger corporate mergers", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/7c53cee9-3066-4722-acf6-17daa2f54631" },
  { id: "4f28ef6c-f727-4d36-88a3-bbdbd13ddfbf", title: "The world’s $2tn interest bill", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/4f28ef6c-f727-4d36-88a3-bbdbd13ddfbf" },
  { id: "f6a26a17-985f-4283-99c4-ba5d54e94e7f", title: "Britain’s grid operator gave Palantir contract without inviting rival bids", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/f6a26a17-985f-4283-99c4-ba5d54e94e7f" },
  { id: "aa304856-cade-4ad8-a2bf-2dd34fa75b1b", title: "Anthropic and OpenAI bankers push for top-tier credit ratings post-IPO", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/aa304856-cade-4ad8-a2bf-2dd34fa75b1b" },
  { id: "1de12ab6-0343-4113-a832-b0f11c3a9b7a", title: "Offshore borrowing in renminbi hits record high", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/1de12ab6-0343-4113-a832-b0f11c3a9b7a" },
  { id: "e4853480-b6a6-4ae7-81d5-aa2cf819093e", title: "The world’s approach to sovereign debt needs to change", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/e4853480-b6a6-4ae7-81d5-aa2cf819093e" },
  { id: "410ee6b6-177b-46fb-9e9c-d388322725c5", title: "Who is Britain’s best CEO? You decide", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/410ee6b6-177b-46fb-9e9c-d388322725c5" },
  { id: "ab6233dc-bfdb-48d8-b71c-864ec040e78d", title: "The battle to prove who owns Gaza’s ruins", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/ab6233dc-bfdb-48d8-b71c-864ec040e78d" },
  { id: "8c7369b7-a803-4978-99bf-8b13a2550563", title: "European ‘wealth’ threatened by decline of region’s carmakers", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/8c7369b7-a803-4978-99bf-8b13a2550563" },
  { id: "4d088758-d853-484a-8e5d-0413a39212a3", title: "Grenfell’s £1.2bn legal legacy", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/4d088758-d853-484a-8e5d-0413a39212a3" },
  { id: "3ba7440d-c4f9-4f13-8e60-98719059d1a7", title: "South Korea’s AI property boom puts pressure on president", date: "2026-09-08", time: "01:35", url: "https://www.ft.com/content/3ba7440d-c4f9-4f13-8e60-98719059d1a7" },
  { id: "1a0d5293-d764-4e2f-82c4-10fdb15e0a70", title: "British voters oppose welfare cuts for disabled people, survey finds", date: "2026-09-08", time: "00:01", url: "https://www.ft.com/content/1a0d5293-d764-4e2f-82c4-10fdb15e0a70" },
  { id: "3b554034-a3e8-43f7-a3f8-27828cf2ed17", title: "UK competition watchdog seeks to work with MoD to curb bid-rigging", date: "2026-09-08", time: "00:01", url: "https://www.ft.com/content/3b554034-a3e8-43f7-a3f8-27828cf2ed17" },
  { id: "1f71d2d0-d2e2-46da-a96f-99d20936223e", title: "UK set to announce trade ban on Israeli settlements in the West Bank", date: "2026-09-07", time: "23:19", url: "https://www.ft.com/content/1f71d2d0-d2e2-46da-a96f-99d20936223e" },
  { id: "dc6c9fe1-c400-490a-a4fe-8b3d5cf3334a", title: "FirstFT: Oil prices near $100 as renewed supply crunch looms", date: "2026-09-07", time: "22:45", url: "https://www.ft.com/content/dc6c9fe1-c400-490a-a4fe-8b3d5cf3334a" },
  { id: "84296a52-8730-456a-b062-f3b8ef847edc", title: "India’s biggest private sector bank grapples with leadership vacuum", date: "2026-09-07", time: "22:00", url: "https://www.ft.com/content/84296a52-8730-456a-b062-f3b8ef847edc" },
  { id: "a7011878-b0b7-4e7f-8f5a-e7d9d662fd47", title: "Donald Trump calls for US boycott of Canada’s Bombardier jets", date: "2026-09-07", time: "21:06", url: "https://www.ft.com/content/a7011878-b0b7-4e7f-8f5a-e7d9d662fd47" },
  { id: "ec1396b9-185e-4a55-86d6-36a560b549fb", title: "Friedrich Merz in ‘shock’ as far-right AfD celebrates ‘dream result’", date: "2026-09-07", time: "20:47", url: "https://www.ft.com/content/ec1396b9-185e-4a55-86d6-36a560b549fb" },
  { id: "97477741-5227-4783-ab30-2b94090b4d43", title: "UK ministers to be encouraged to take more legal risks to push through policies", date: "2026-09-07", time: "19:30", url: "https://www.ft.com/content/97477741-5227-4783-ab30-2b94090b4d43" },
  { id: "4d8d12a0-ed3c-4955-be63-d15225b105b6", title: "John Healey seeks to reassure bond markets as fiscal problems grow", date: "2026-09-07", time: "18:35", url: "https://www.ft.com/content/4d8d12a0-ed3c-4955-be63-d15225b105b6" },
];
