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
  { id: "12d6fd02-c2de-4774-8bea-4d9ddbae643d", title: "EU mulls compromise options on Usmanov sanctions to end French stand-off", date: "2026-09-18", time: "06:00", url: "https://www.ft.com/content/12d6fd02-c2de-4774-8bea-4d9ddbae643d" },
  { id: "8475dc9b-b2d4-4e10-a6b6-12796b11758a", title: "Joining the dots between big AI", date: "2026-09-18", time: "06:00", url: "https://www.ft.com/content/8475dc9b-b2d4-4e10-a6b6-12796b11758a" },
  { id: "f89ed081-c025-4d69-bc41-9f5564c8b441", title: "FirstFT: Merz fights for survival", date: "2026-09-18", time: "05:31", url: "https://www.ft.com/content/f89ed081-c025-4d69-bc41-9f5564c8b441" },
  { id: "63bfdeb2-efb1-4e3a-8c89-a884eb5bd618", title: "NHS executive lobbied data watchdog to rewrite criticism before Palantir deal", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/63bfdeb2-efb1-4e3a-8c89-a884eb5bd618" },
  { id: "7cf54faa-90d7-4f2b-a626-a57fb402be61", title: "Red lipstick and expropriation: anti-capitalist seeks power in Berlin", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/7cf54faa-90d7-4f2b-a626-a57fb402be61" },
  { id: "a2f2ba6b-dc26-40d5-87ff-839d864c909b", title: "Lib Dems hope EU single market campaign will reignite political fortunes", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/a2f2ba6b-dc26-40d5-87ff-839d864c909b" },
  { id: "8f1f3047-372d-425f-bcd6-cfe9d5d4890c", title: "Venezuela nears deal to move $4bn gold reserve to New York", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/8f1f3047-372d-425f-bcd6-cfe9d5d4890c" },
  { id: "a117a105-545e-45a9-b4a1-7d03f7b4082b", title: "The new credit debacle gripping Wall Street", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/a117a105-545e-45a9-b4a1-7d03f7b4082b" },
  { id: "0e64746c-d531-4ceb-a700-e5e47289bfb3", title: "Democrats vow to pursue ‘Trump crime family’ after midterm elections", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/0e64746c-d531-4ceb-a700-e5e47289bfb3" },
  { id: "fa36c637-05fd-4669-8784-0ada6f671f39", title: "Europe can attract more stock trading with fewer, better markets", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/fa36c637-05fd-4669-8784-0ada6f671f39" },
  { id: "19309369-2741-4caf-91f9-a45505f82148", title: "Will El Niño be the saviour of Europe’s energy market?", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/19309369-2741-4caf-91f9-a45505f82148" },
  { id: "350df9ff-fa41-4984-a1ee-248d8335b213", title: "How Glencore became entangled in $2bn battle with iron ore trader Radiant", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/350df9ff-fa41-4984-a1ee-248d8335b213" },
  { id: "f69943f7-b173-444c-a79e-c9396a0380bd", title: "Iran switches from ships to trucks to evade US blockade", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/f69943f7-b173-444c-a79e-c9396a0380bd" },
  { id: "b420f86e-4266-432a-b2a1-cf1cde516463", title: "The real risk of private credit’s involvement in the annuity business", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/b420f86e-4266-432a-b2a1-cf1cde516463" },
  { id: "aca1e562-9a12-4140-a8a2-0f21ff827f49", title: "The people who enabled Trump", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/aca1e562-9a12-4140-a8a2-0f21ff827f49" },
  { id: "5b08fae3-51b5-465b-acb5-e842c30ebd0c", title: "The west must hurry to catch up with Ukraine on AI combat", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/5b08fae3-51b5-465b-acb5-e842c30ebd0c" },
  { id: "6fd9f78e-f822-4e48-b8e2-968a3e4d2181", title: "Liechtenstein royals threaten lawsuit over dynasty reforms", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/6fd9f78e-f822-4e48-b8e2-968a3e4d2181" },
  { id: "97999668-dd71-41b8-b0e5-f540902abc45", title: "How money moved across Mark Walter’s empire", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/97999668-dd71-41b8-b0e5-f540902abc45" },
  { id: "34319b00-f874-4119-aa28-8376d81e7190", title: "Medical AI has a proof problem", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/34319b00-f874-4119-aa28-8376d81e7190" },
  { id: "9c6fac10-9f3f-4503-9765-b9e29e18c68d", title: "Private equity turns to financial engineering to lure insurance billions", date: "2026-09-18", time: "05:00", url: "https://www.ft.com/content/9c6fac10-9f3f-4503-9765-b9e29e18c68d" },
  { id: "c4aa118e-a258-48bc-b50e-28e453a95db8", title: "OpenAI breached by researchers using Anthropic models", date: "2026-09-18", time: "04:31", url: "https://www.ft.com/content/c4aa118e-a258-48bc-b50e-28e453a95db8" },
  { id: "9934acc6-6b06-4f2e-a37a-6cf0869092cb", title: "Trump administration approves $24bn sale of F-35 jets to Saudi Arabia", date: "2026-09-17", time: "19:58", url: "https://www.ft.com/content/9934acc6-6b06-4f2e-a37a-6cf0869092cb" },
  { id: "b528698e-9b04-4497-9d22-67e401be21d3", title: "US regulator opens markets to tokenised stock trading", date: "2026-09-17", time: "19:29", url: "https://www.ft.com/content/b528698e-9b04-4497-9d22-67e401be21d3" },
  { id: "3df8edae-ae3b-4f56-83a3-40602edc17a3", title: "OpenAI staff knew the ‘existential threat’ AI posed to publishers, New York Times claims", date: "2026-09-17", time: "19:09", url: "https://www.ft.com/content/3df8edae-ae3b-4f56-83a3-40602edc17a3" },
  { id: "46e25252-9e1e-4ead-aa56-293a0f09a393", title: "Bank of England follows FTAV advice", date: "2026-09-17", time: "18:53", url: "https://www.ft.com/content/46e25252-9e1e-4ead-aa56-293a0f09a393" },
  { id: "21aa563b-2cd1-4f09-b505-fcf579248fe6", title: "Reform UK’s mega-donor backed a friend’s libel claim. Now he controls her home", date: "2026-09-17", time: "18:24", url: "https://www.ft.com/content/21aa563b-2cd1-4f09-b505-fcf579248fe6" },
  { id: "0b3d10cb-a321-429f-879d-86e1bee82efe", title: "Hispanics feel ‘betrayed’ by Trump, top Republican says", date: "2026-09-17", time: "18:10", url: "https://www.ft.com/content/0b3d10cb-a321-429f-879d-86e1bee82efe" },
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
];
