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
  { id: "9110ffe1-0737-4bb6-8e95-c7603b0e2fba", title: "Castlelake walks away from easyJet takeover battle", date: "2026-08-06", time: "14:20", url: "https://www.ft.com/content/9110ffe1-0737-4bb6-8e95-c7603b0e2fba" },
  { id: "510ed26f-165b-4961-8a46-b9064775ab67", title: "Abdul El-Sayed defeats establishment candidate in Michigan's Senate primary", date: "2026-08-06", time: "14:00", url: "https://www.ft.com/content/510ed26f-165b-4961-8a46-b9064775ab67" },
  { id: "15663487-0501-405f-9c2a-d87368a2fffa", title: "Paramount agrees safeguards for UK approval of $110bn WBD deal", date: "2026-08-06", time: "13:39", url: "https://www.ft.com/content/15663487-0501-405f-9c2a-d87368a2fffa" },
  { id: "0e960930-db68-48dc-ba74-af2c253f78d7", title: "Referrals to Prevent anti-radicalisation scheme jump after Southport attacks", date: "2026-08-06", time: "13:34", url: "https://www.ft.com/content/0e960930-db68-48dc-ba74-af2c253f78d7" },
  { id: "00cc32f2-f392-40af-9484-decc85b7e9fe", title: "The confounding 'compounding' of 'compounding'", date: "2026-08-06", time: "13:30", url: "https://www.ft.com/content/00cc32f2-f392-40af-9484-decc85b7e9fe" },
  { id: "15857866-5274-41cc-90a6-b4f696c60a13", title: "ConocoPhillips chief Ryan Lance to step down after 14 years", date: "2026-08-06", time: "13:25", url: "https://www.ft.com/content/15857866-5274-41cc-90a6-b4f696c60a13" },
  { id: "4b3f2499-6f1a-46df-81c0-fbcb651b2c60", title: "The good, the bad and the green of Badenoch", date: "2026-08-06", time: "12:37", url: "https://www.ft.com/content/4b3f2499-6f1a-46df-81c0-fbcb651b2c60" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-08-06", time: "12:32", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
  { id: "75ba3055-625c-4cb5-894b-0696a38f5e79", title: "Latest Isa rates", date: "2026-08-06", time: "12:28", url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79" },
  { id: "5a6340ac-0850-4fc0-a3eb-261a1f7e78d4", title: "Russia targets Maga influencers ahead of German state vote", date: "2026-08-06", time: "12:25", url: "https://www.ft.com/content/5a6340ac-0850-4fc0-a3eb-261a1f7e78d4" },
  { id: "5fb71aeb-f4a3-484b-b958-89842252c59b", title: "Could over-investment in natural gas drive up US electricity bills?", date: "2026-08-06", time: "12:00", url: "https://www.ft.com/content/5fb71aeb-f4a3-484b-b958-89842252c59b" },
  { id: "debe096f-ec89-424f-a8ca-d3843ef53549", title: "Kevin Warsh to stick with lean Fed messaging despite market backlash", date: "2026-08-06", time: "12:00", url: "https://www.ft.com/content/debe096f-ec89-424f-a8ca-d3843ef53549" },
  { id: "9d38db74-98a5-46ee-b9ed-4e553ff41025", title: "US public pension funds and business groups clash on SEC climate risk disclosure shift", date: "2026-08-06", time: "11:40", url: "https://www.ft.com/content/9d38db74-98a5-46ee-b9ed-4e553ff41025" },
  { id: "53920df1-f6b4-4214-9936-b9eed83d3548", title: "Both Trump and young Americans are warming to China", date: "2026-08-06", time: "11:31", url: "https://www.ft.com/content/53920df1-f6b4-4214-9936-b9eed83d3548" },
  { id: "b721e75e-cd6c-4cab-816a-3def97dd79db", title: "30 years of Orla Kiely", date: "2026-08-06", time: "11:00", url: "https://www.ft.com/content/b721e75e-cd6c-4cab-816a-3def97dd79db" },
  { id: "91fd7e49-6fdb-4f49-bd2a-c72e2f380911", title: "Only 1 in 7 of England’s rivers, lakes and estuaries meet ecological standards", date: "2026-08-06", time: "11:00", url: "https://www.ft.com/content/91fd7e49-6fdb-4f49-bd2a-c72e2f380911" },
  { id: "4822d451-d850-48c2-b30d-35bf6667a005", title: "How not to do an M&A league table", date: "2026-08-06", time: "10:42", url: "https://www.ft.com/content/4822d451-d850-48c2-b30d-35bf6667a005" },
  { id: "2d1ae55c-f83a-4b3a-b447-667323456900", title: "Why can’t a bathroom be curtained, carpeted and cushioned?", date: "2026-08-06", time: "10:29", url: "https://www.ft.com/content/2d1ae55c-f83a-4b3a-b447-667323456900" },
  { id: "235a98f8-7833-450f-a9aa-f5049d361d30", title: "Partners Group nears €2bn deal for beauty group Aroma-Zone", date: "2026-08-06", time: "08:11", url: "https://www.ft.com/content/235a98f8-7833-450f-a9aa-f5049d361d30" },
  { id: "b214e9c8-615b-400e-8c53-97f16d0ddcec", title: "SoftBank’s stakes in Intel and ByteDance help it beat expectations", date: "2026-08-06", time: "08:39", url: "https://www.ft.com/content/b214e9c8-615b-400e-8c53-97f16d0ddcec" },
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
];
