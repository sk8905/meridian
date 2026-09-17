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
  { id: "ef54585a-4d2f-4538-b185-9bff75ef2f5e", title: "Turkish authorities rush to stem fallout from stock-market scandal", date: "2026-09-17", time: "12:59", url: "https://www.ft.com/content/ef54585a-4d2f-4538-b185-9bff75ef2f5e" },
  { id: "f270a99f-3abc-4a78-a2b3-8083609c5ef1", title: "Mega-donors obscure the wider threats to British democracy", date: "2026-09-17", time: "12:55", url: "https://www.ft.com/content/f270a99f-3abc-4a78-a2b3-8083609c5ef1" },
  { id: "07f8c0d7-c134-4f83-a910-029756616ee4", title: "Is Britain’s migration debate asking the wrong question?", date: "2026-09-17", time: "12:54", url: "https://www.ft.com/content/07f8c0d7-c134-4f83-a910-029756616ee4" },
  { id: "ee1b5a66-24f2-49b8-b26f-895644ebe3f1", title: "Revolut planning dual listing in New York and London, says Storonsky", date: "2026-09-17", time: "12:34", url: "https://www.ft.com/content/ee1b5a66-24f2-49b8-b26f-895644ebe3f1" },
  { id: "72e4a91f-5d56-4971-8083-f7ea919c2a29", title: "UK lenders raise mortgage rates as inflation fears intensify", date: "2026-09-17", time: "12:33", url: "https://www.ft.com/content/72e4a91f-5d56-4971-8083-f7ea919c2a29" },
  { id: "a9e7a625-9dab-4064-bf12-0498f2256792", title: "European carmakers warn EU-UK tariffs could be ‘catastrophic’", date: "2026-09-17", time: "12:33", url: "https://www.ft.com/content/a9e7a625-9dab-4064-bf12-0498f2256792" },
  { id: "c947c940-b703-4a91-9397-bdb2347d7922", title: "What a maths fracas tells us about AI and innovation", date: "2026-09-17", time: "12:30", url: "https://www.ft.com/content/c947c940-b703-4a91-9397-bdb2347d7922" },
  { id: "cc14705c-22a9-431c-a98d-b9577be8aab5", title: "Bank of England holds rates steady but hints at tightening ahead", date: "2026-09-17", time: "12:29", url: "https://www.ft.com/content/cc14705c-22a9-431c-a98d-b9577be8aab5" },
  { id: "f6a3f875-ddfa-4fd7-8232-cb5a3699a5df", title: "EU alliance to make Canada ‘better partner for the US’, says Mark Carney", date: "2026-09-17", time: "12:02", url: "https://www.ft.com/content/f6a3f875-ddfa-4fd7-8232-cb5a3699a5df" },
  { id: "44bc4245-f235-4c1d-af93-deb5810f635a", title: "Bank of England holds interest rates at 3.75%", date: "2026-09-17", time: "12:00", url: "https://www.ft.com/content/44bc4245-f235-4c1d-af93-deb5810f635a" },
  { id: "24d417c5-4bd4-4611-a04f-489a09450006", title: "Lax Deutsche Bank controls enabled banker to embezzle €600,000, court finds", date: "2026-09-17", time: "12:00", url: "https://www.ft.com/content/24d417c5-4bd4-4611-a04f-489a09450006" },
  { id: "44702d5a-b4b9-4aa8-88cf-5436f3d24311", title: "There is no ‘one size fits all’ solution for the energy transition", date: "2026-09-17", time: "12:00", url: "https://www.ft.com/content/44702d5a-b4b9-4aa8-88cf-5436f3d24311" },
  { id: "b4d3b969-76e8-49f2-8528-4d34a810e7a4", title: "Chattering central bankers are good, actually", date: "2026-09-17", time: "11:35", url: "https://www.ft.com/content/b4d3b969-76e8-49f2-8528-4d34a810e7a4" },
  { id: "d719d59e-cb2a-4488-a4cf-2f291a85e9ca", title: "FirstFT: Warsh defies Trump", date: "2026-09-17", time: "11:13", url: "https://www.ft.com/content/d719d59e-cb2a-4488-a4cf-2f291a85e9ca" },
  { id: "b1696209-2080-4714-9d5e-e5724200ac4d", title: "No country for independent central bankers", date: "2026-09-17", time: "11:00", url: "https://www.ft.com/content/b1696209-2080-4714-9d5e-e5724200ac4d" },
  { id: "3bb7e0e8-6aef-4b6b-a5f0-f472a2655c1f", title: "Wall Street warns trading boom is losing steam", date: "2026-09-17", time: "11:00", url: "https://www.ft.com/content/3bb7e0e8-6aef-4b6b-a5f0-f472a2655c1f" },
  { id: "61f61355-5b21-4a48-b324-9bd4b5b6777b", title: "AI boom obscuring global trade disruptions, warns WTO chief", date: "2026-09-17", time: "11:00", url: "https://www.ft.com/content/61f61355-5b21-4a48-b324-9bd4b5b6777b" },
  { id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2", title: "Inflation and interest rates tracker: see how your country compares", date: "2026-09-17", time: "09:57", url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2" },
  { id: "a491245d-6f6a-4218-9289-3fa8e43632ad", title: "What do British businesses need from the Budget? Submit a question", date: "2026-09-17", time: "09:41", url: "https://www.ft.com/content/a491245d-6f6a-4218-9289-3fa8e43632ad" },
  { id: "c5843a3d-51a3-4508-915c-6206351aeb97", title: "Thanks to Rishi Sunak, the UK is helping put the brakes on AI", date: "2026-09-17", time: "09:30", url: "https://www.ft.com/content/c5843a3d-51a3-4508-915c-6206351aeb97" },
  { id: "5226dcb7-d89d-4b68-981f-b2736d7e4dca", title: "US rate rise jolts yen ahead of Bank of Japan meeting", date: "2026-09-17", time: "09:26", url: "https://www.ft.com/content/5226dcb7-d89d-4b68-981f-b2736d7e4dca" },
  { id: "42ab32f0-8c22-4912-a928-c73552305b7e", title: "US passes bill targeting importers of Russian oil", date: "2026-09-17", time: "09:04", url: "https://www.ft.com/content/42ab32f0-8c22-4912-a928-c73552305b7e" },
  { id: "69f02abc-e0dc-46e5-aa6c-61d209e095d9", title: "China’s US Treasury holdings fall to lowest level since 2008", date: "2026-09-17", time: "08:43", url: "https://www.ft.com/content/69f02abc-e0dc-46e5-aa6c-61d209e095d9" },
  { id: "2c34414a-5381-4083-ac34-00bbe67ef8db", title: "OpenAI discloses new ‘concerning’ model behaviour", date: "2026-09-17", time: "08:42", url: "https://www.ft.com/content/2c34414a-5381-4083-ac34-00bbe67ef8db" },
  { id: "7b0f8f90-b3ad-4640-916a-f8b5495920a3", title: "Donald Trump suggests EU-Canada associate member deal would be ‘hostile act’", date: "2026-09-17", time: "08:20", url: "https://www.ft.com/content/7b0f8f90-b3ad-4640-916a-f8b5495920a3" },
  { id: "3ab370c5-2ea2-43c8-835c-977d8f0b51f4", title: "Japan’s Sanae Takaichi reshuffles cabinet in signal of confidence to markets", date: "2026-09-17", time: "07:43", url: "https://www.ft.com/content/3ab370c5-2ea2-43c8-835c-977d8f0b51f4" },
  { id: "be4a0acf-f4e8-41da-ba04-2ed6d44b7fc2", title: "Getting to know Mr Warsh", date: "2026-09-17", time: "06:30", url: "https://www.ft.com/content/be4a0acf-f4e8-41da-ba04-2ed6d44b7fc2" },
  { id: "094d8a79-e0d0-47b7-8b0d-d4e72e079dbe", title: "FTAV’s further reading", date: "2026-09-17", time: "06:30", url: "https://www.ft.com/content/094d8a79-e0d0-47b7-8b0d-d4e72e079dbe" },
  { id: "5d1dba1a-db81-464d-b2d0-9e0741010560", title: "Von der Leyen advances EU defence pitch with army of new ideas", date: "2026-09-17", time: "06:00", url: "https://www.ft.com/content/5d1dba1a-db81-464d-b2d0-9e0741010560" },
  { id: "2739954a-816a-465a-ae21-7d846bb70365", title: "Either Meta Glasses are selling extremely well or this Citi survey might have some issues", date: "2026-09-17", time: "06:00", url: "https://www.ft.com/content/2739954a-816a-465a-ae21-7d846bb70365" },
  { id: "5b2a7780-270b-4679-9229-3ad88395de95", title: "Business of Sailing", date: "2026-09-17", time: "05:09", url: "https://www.ft.com/content/5b2a7780-270b-4679-9229-3ad88395de95" },
  { id: "fb8e1037-8c48-49d2-809e-950472bcbae5", title: "Donald Trump fails to bend the Federal Reserve to his will", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/fb8e1037-8c48-49d2-809e-950472bcbae5" },
  { id: "8767b80b-3fd8-4747-b538-98ed8a4afe11", title: "Vue explores London IPO as cinemas emerge from ‘six years of hell’", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/8767b80b-3fd8-4747-b538-98ed8a4afe11" },
  { id: "6e418231-33f5-4fda-83a0-28ceb0a64d6a", title: "The private equity hand rolling up the Algarve", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/6e418231-33f5-4fda-83a0-28ceb0a64d6a" },
  { id: "7b1a00f1-6842-4f5e-ace4-d6a57e98b21e", title: "Why Mark Carney’s romance with Europe can only go so far ", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/7b1a00f1-6842-4f5e-ace4-d6a57e98b21e" },
  { id: "0b45cb01-7f62-41c5-8c48-10c47f2e1ae6", title: "EU asks China to voluntarily limit car exports ", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/0b45cb01-7f62-41c5-8c48-10c47f2e1ae6" },
  { id: "8eda412f-caed-4b31-bdee-b76fc9f3ba82", title: "Heatwave triggers potato shortage in Europe", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/8eda412f-caed-4b31-bdee-b76fc9f3ba82" },
  { id: "f5325951-7049-4d3a-97e4-cbe34f9058d8", title: "The Apple trust premium in the age of AI", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/f5325951-7049-4d3a-97e4-cbe34f9058d8" },
  { id: "73b7c439-8905-4509-bc09-1a8965146da2", title: "St James’s Place looks smartly attired for the AI wealth party", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/73b7c439-8905-4509-bc09-1a8965146da2" },
  { id: "23d35821-2d3f-4e55-8ada-99bcbacdc066", title: "Do inflation expectations matter in a social-media echo chamber?", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/23d35821-2d3f-4e55-8ada-99bcbacdc066" },
];
