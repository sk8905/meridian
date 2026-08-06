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
  { id: "80f5fede-a34a-4069-a751-f9523e3c6e00", title: "Jane Street in talks to shift its $11bn in debt to investors including Pimco", date: "2026-08-06", time: "21:10", url: "https://www.ft.com/content/80f5fede-a34a-4069-a751-f9523e3c6e00" },
  { id: "051e6fbf-e796-4b92-9c6e-7b85c74e8edc", title: "Argentine company accuses US of meddling in Huawei data centre project", date: "2026-08-06", time: "20:44", url: "https://www.ft.com/content/051e6fbf-e796-4b92-9c6e-7b85c74e8edc" },
  { id: "f6f53b98-9661-4d50-bf25-b32738643cac", title: "US halts imports of Mexico avocados over security concerns", date: "2026-08-06", time: "20:43", url: "https://www.ft.com/content/f6f53b98-9661-4d50-bf25-b32738643cac" },
  { id: "77f00cf3-f2e6-4dcb-bf0d-1631ca45dd9c", title: "California sues DuPont over alleged effort to avoid 'forever chemicals' liabilities", date: "2026-08-06", time: "19:09", url: "https://www.ft.com/content/77f00cf3-f2e6-4dcb-bf0d-1631ca45dd9c" },
  { id: "8b2d8925-7fb9-44c8-8093-48442455ebe0", title: "Airtable's cut-price sale is just the start for software also-rans", date: "2026-08-06", time: "18:13", url: "https://www.ft.com/content/8b2d8925-7fb9-44c8-8093-48442455ebe0" },
  { id: "0aee7523-09d7-4831-bc20-711d7191822e", title: "The shrinking space for democracy in Africa", date: "2026-08-06", time: "18:12", url: "https://www.ft.com/content/0aee7523-09d7-4831-bc20-711d7191822e" },
  { id: "3989b6a0-ba02-412b-8f35-b6817c3e42f6", title: "Honeywell Aerospace shares plunge on failure to overcome supply constraints", date: "2026-08-06", time: "18:07", url: "https://www.ft.com/content/3989b6a0-ba02-412b-8f35-b6817c3e42f6" },
  { id: "f860d189-7def-4c7a-8ce3-4e96b3371d1f", title: "Google seeks a sharper focus in AI after Hassabis move", date: "2026-08-06", time: "17:55", url: "https://www.ft.com/content/f860d189-7def-4c7a-8ce3-4e96b3371d1f" },
  { id: "b7a47cff-29e3-45a7-a0c0-5f41ab72f49e", title: "Donald Trump allowed to delay release of financial details in $10bn BBC defamation case", date: "2026-08-06", time: "17:21", url: "https://www.ft.com/content/b7a47cff-29e3-45a7-a0c0-5f41ab72f49e" },
  { id: "a71ca216-2e96-4c43-b269-11c8210e9a31", title: "Uefa doubles down on World Cup boycott in effort to oust Gianni Infantino", date: "2026-08-06", time: "17:19", url: "https://www.ft.com/content/a71ca216-2e96-4c43-b269-11c8210e9a31" },
  { id: "030898ed-4fa2-4669-9970-c587c669ee4f", title: "Manchester power failure causes severe train disruption in northern England", date: "2026-08-06", time: "17:05", url: "https://www.ft.com/content/030898ed-4fa2-4669-9970-c587c669ee4f" },
  { id: "2be98761-ca44-49ad-af3e-5204af338a64", title: "Congress should hold Trump’s feet to the fire on chips", date: "2026-08-06", time: "17:00", url: "https://www.ft.com/content/2be98761-ca44-49ad-af3e-5204af338a64" },
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
];
