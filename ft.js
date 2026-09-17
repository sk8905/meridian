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
  { id: "fc324c65-11d6-473d-b15b-deef27cbadc2", title: "Sun, stats and suspicious productivity", date: "2026-09-17", time: "17:55", url: "https://www.ft.com/content/fc324c65-11d6-473d-b15b-deef27cbadc2" },
  { id: "49b61634-7a5d-46c4-8c43-c20ed2196ca9", title: "Addison Lee founder loses £20mn tax battle over ‘non-dom’ status", date: "2026-09-17", time: "17:54", url: "https://www.ft.com/content/49b61634-7a5d-46c4-8c43-c20ed2196ca9" },
  { id: "8c4143c7-f846-43a0-807a-b460fff7cd75", title: "Has AI broken the old VC model?", date: "2026-09-17", time: "17:46", url: "https://www.ft.com/content/8c4143c7-f846-43a0-807a-b460fff7cd75" },
  { id: "755798b8-c16a-4d3f-b01f-47c3e334839a", title: "Glencore suspends senior executive in review of ties to iron ore trader", date: "2026-09-17", time: "17:44", url: "https://www.ft.com/content/755798b8-c16a-4d3f-b01f-47c3e334839a" },
  { id: "d458070f-fbe4-477d-8574-60a3dddce149", title: "Carney is playing a bad hand well", date: "2026-09-17", time: "17:41", url: "https://www.ft.com/content/d458070f-fbe4-477d-8574-60a3dddce149" },
  { id: "0480bd32-41e7-465d-b828-156edae94ecb", title: "Rising rates throw a spanner in investment bankers’ spreadsheets", date: "2026-09-17", time: "17:39", url: "https://www.ft.com/content/0480bd32-41e7-465d-b828-156edae94ecb" },
  { id: "cd58a4c3-3a62-41f2-a7b9-a0da73d6e5f4", title: "Bank of England’s bond plan brings finality to quantitative tightening", date: "2026-09-17", time: "17:27", url: "https://www.ft.com/content/cd58a4c3-3a62-41f2-a7b9-a0da73d6e5f4" },
  { id: "b97ac029-271b-44d2-8641-bd8eb1dc7ab1", title: "Accelerationism will only slow AI’s progress", date: "2026-09-17", time: "17:27", url: "https://www.ft.com/content/b97ac029-271b-44d2-8641-bd8eb1dc7ab1" },
  { id: "44bc4245-f235-4c1d-af93-deb5810f635a", title: "Bank of England says rates likely to rise as it overhauls gilt sales", date: "2026-09-17", time: "17:12", url: "https://www.ft.com/content/44bc4245-f235-4c1d-af93-deb5810f635a" },
  { id: "1f51ef4d-fe4d-484c-ba4c-9b0048f03ce2", title: "Workers at Diageo’s largest distillery to go on strike as demand slumps", date: "2026-09-17", time: "16:07", url: "https://www.ft.com/content/1f51ef4d-fe4d-484c-ba4c-9b0048f03ce2" },
  { id: "f2c2e267-1e2e-457c-b08b-8a6a933ec285", title: "King Charles raises alarm over AI advances ahead of Burnham’s first meeting with Trump", date: "2026-09-17", time: "15:52", url: "https://www.ft.com/content/f2c2e267-1e2e-457c-b08b-8a6a933ec285" },
  { id: "8907649b-4096-4b0b-b92e-86c755217126", title: "Ed Sheeran asks billionaire Robert Kraft to donate $2mn after tour debacle", date: "2026-09-17", time: "15:36", url: "https://www.ft.com/content/8907649b-4096-4b0b-b92e-86c755217126" },
  { id: "3aa5dd8a-90a6-48e2-bf7e-bc6557731a3b", title: "Sweden’s leftwing opposition parties narrowly win election", date: "2026-09-17", time: "14:54", url: "https://www.ft.com/content/3aa5dd8a-90a6-48e2-bf7e-bc6557731a3b" },
  { id: "dfdea19d-588e-4938-87cb-be14d14a54f4", title: "After Warsh’s strong start, how high will rates need to go?", date: "2026-09-17", time: "14:43", url: "https://www.ft.com/content/dfdea19d-588e-4938-87cb-be14d14a54f4" },
  { id: "560fc2ad-5c7e-4878-ae9b-a3183004c394", title: "UK productivity rose faster than thought after 2008 financial crisis", date: "2026-09-17", time: "14:14", url: "https://www.ft.com/content/560fc2ad-5c7e-4878-ae9b-a3183004c394" },
  { id: "4660a6cc-008b-4a3e-947e-18545371eda7", title: "Kevin Warsh defies Donald Trump’s calls for lower borrowing costs", date: "2026-09-17", time: "14:00", url: "https://www.ft.com/content/4660a6cc-008b-4a3e-947e-18545371eda7" },
  { id: "3c73f212-b26d-410c-b944-e75627a735df", title: "Merz battles party revolt ahead of German regional elections", date: "2026-09-17", time: "13:52", url: "https://www.ft.com/content/3c73f212-b26d-410c-b944-e75627a735df" },
  { id: "a65f3f5d-e8ec-44b1-8529-24651e6254c3", title: "Leading Iranian airline cuts flights as US sanctions hit", date: "2026-09-17", time: "13:46", url: "https://www.ft.com/content/a65f3f5d-e8ec-44b1-8529-24651e6254c3" },
  { id: "ef54585a-4d2f-4538-b185-9bff75ef2f5e", title: "Turkish authorities rush to stem fallout from stock-market scandal", date: "2026-09-17", time: "12:59", url: "https://www.ft.com/content/ef54585a-4d2f-4538-b185-9bff75ef2f5e" },
  { id: "f270a99f-3abc-4a78-a2b3-8083609c5ef1", title: "Mega-donors obscure the wider threats to British democracy", date: "2026-09-17", time: "12:55", url: "https://www.ft.com/content/f270a99f-3abc-4a78-a2b3-8083609c5ef1" },
  { id: "07f8c0d7-c134-4f83-a910-029756616ee4", title: "Is Britain’s migration debate asking the wrong question?", date: "2026-09-17", time: "12:54", url: "https://www.ft.com/content/07f8c0d7-c134-4f83-a910-029756616ee4" },
  { id: "ee1b5a66-24f2-49b8-b26f-895644ebe3f1", title: "Revolut planning dual listing in New York and London, says Storonsky", date: "2026-09-17", time: "12:34", url: "https://www.ft.com/content/ee1b5a66-24f2-49b8-b26f-895644ebe3f1" },
  { id: "72e4a91f-5d56-4971-8083-f7ea919c2a29", title: "UK lenders raise mortgage rates as inflation fears intensify", date: "2026-09-17", time: "12:33", url: "https://www.ft.com/content/72e4a91f-5d56-4971-8083-f7ea919c2a29" },
  { id: "a9e7a625-9dab-4064-bf12-0498f2256792", title: "European carmakers warn EU-UK tariffs could be ‘catastrophic’", date: "2026-09-17", time: "12:33", url: "https://www.ft.com/content/a9e7a625-9dab-4064-bf12-0498f2256792" },
  { id: "c947c940-b703-4a91-9397-bdb2347d7922", title: "What a maths fracas tells us about AI and innovation", date: "2026-09-17", time: "12:30", url: "https://www.ft.com/content/c947c940-b703-4a91-9397-bdb2347d7922" },
  { id: "cc14705c-22a9-431c-a98d-b9577be8aab5", title: "Bank of England holds rates steady but hints at tightening ahead", date: "2026-09-17", time: "12:29", url: "https://www.ft.com/content/cc14705c-22a9-431c-a98d-b9577be8aab5" },
  { id: "f6a3f875-ddfa-4fd7-8232-cb5a3699a5df", title: "EU alliance to make Canada ‘better partner for the US’, says Mark Carney", date: "2026-09-17", time: "12:02", url: "https://www.ft.com/content/f6a3f875-ddfa-4fd7-8232-cb5a3699a5df" },
  { id: "6c42f15a-54cf-457c-b2f5-7004000e08c9", title: "Bricks are no longer just for walls", date: "2026-09-17", time: "12:00", url: "https://www.ft.com/content/6c42f15a-54cf-457c-b2f5-7004000e08c9" },
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
];
