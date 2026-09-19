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
  { id: "3d23b523-e4ae-4917-99bd-9bb5cddf42c2", title: "Michael Marra wins Scottish Labour leadership election", date: "2026-09-19", time: "13:55", url: "https://www.ft.com/content/3d23b523-e4ae-4917-99bd-9bb5cddf42c2" },
  { id: "07fd42b5-0610-470c-8fb8-4840b5401271", title: "Saudi Arabia sounds air-raid alerts as missile and drone assault intensifies", date: "2026-09-19", time: "13:42", url: "https://www.ft.com/content/07fd42b5-0610-470c-8fb8-4840b5401271" },
  { id: "94ec0fee-53ab-4d7e-9b17-6b05608ad974", title: "Nobel economists throw support behind California billionaire tax", date: "2026-09-19", time: "12:00", url: "https://www.ft.com/content/94ec0fee-53ab-4d7e-9b17-6b05608ad974" },
  { id: "0f972258-ee7d-4742-816a-b1dd7fa29d0e", title: "Forget ‘associate member’, Canada can forge collective resilience with the EU", date: "2026-09-19", time: "11:00", url: "https://www.ft.com/content/0f972258-ee7d-4742-816a-b1dd7fa29d0e" },
  { id: "4e7be0a6-a1fd-4161-9656-faff899e938f", title: "Mark Carney takes his investment pitch from ‘Maple Davos’ to Strasbourg", date: "2026-09-19", time: "11:00", url: "https://www.ft.com/content/4e7be0a6-a1fd-4161-9656-faff899e938f" },
  { id: "4d6a552e-67de-4c62-a928-c3e7b48827fc", title: "Chart of the Week: Higher rates, meet indebted consumers", date: "2026-09-19", time: "10:30", url: "https://www.ft.com/content/4d6a552e-67de-4c62-a928-c3e7b48827fc" },
  { id: "40222e79-3ee7-4388-8362-7d06c7f71f69", title: "On takes aim at ailing Nike with Mbappé transfer coup", date: "2026-09-19", time: "09:00", url: "https://www.ft.com/content/40222e79-3ee7-4388-8362-7d06c7f71f69" },
  { id: "12ea81a9-d806-4997-b0da-ddec093bbe20", title: "Over-80s turn to annuities as rates climb", date: "2026-09-19", time: "06:13", url: "https://www.ft.com/content/12ea81a9-d806-4997-b0da-ddec093bbe20" },
  { id: "d6f2132e-bc98-44cb-add0-aa306909ce6b", title: "Admit it — is this your worst financial habit?", date: "2026-09-19", time: "05:54", url: "https://www.ft.com/content/d6f2132e-bc98-44cb-add0-aa306909ce6b" },
  { id: "c0cd359d-df84-4208-a789-ffa864b43666", title: "AI chatbots give wrong answers to financial queries ‘most of the time’", date: "2026-09-19", time: "05:49", url: "https://www.ft.com/content/c0cd359d-df84-4208-a789-ffa864b43666" },
  { id: "77f042f0-80c2-40ad-a4d1-9da0367827ee", title: "Thirty years of buy-to-let: does it have a future?", date: "2026-09-19", time: "05:24", url: "https://www.ft.com/content/77f042f0-80c2-40ad-a4d1-9da0367827ee" },
  { id: "124c1cf0-4885-495c-a907-a5217d589f9d", title: "Unpacking the real fiscal costs of immigration", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/124c1cf0-4885-495c-a907-a5217d589f9d" },
  { id: "b6c4501e-76fe-4559-a3c3-6ad7aa07eaa5", title: "The Anglo-French moment", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/b6c4501e-76fe-4559-a3c3-6ad7aa07eaa5" },
  { id: "a82a42a4-8f80-4569-a706-e7278c088d4d", title: "South Africa’s ANC fails to register 181 local election candidates", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/a82a42a4-8f80-4569-a706-e7278c088d4d" },
  { id: "527bad1f-53a2-482c-b06b-ae3484993144", title: "Dry British summers raise hopes of homegrown chickpeas", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/527bad1f-53a2-482c-b06b-ae3484993144" },
  { id: "129a5052-ac31-4975-8a88-91ce09740a0b", title: "How should investors position for the robot apocalypse?", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/129a5052-ac31-4975-8a88-91ce09740a0b" },
  { id: "81064dde-d1eb-49db-ba38-b6e28f334798", title: "Passport to Piddington: a short history of micronations", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/81064dde-d1eb-49db-ba38-b6e28f334798" },
  { id: "64ee1dec-7b98-40b1-8f50-5fa6bb760cfd", title: "Housebuilders aren’t the only ones who benefit from ‘Help to Buy’", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/64ee1dec-7b98-40b1-8f50-5fa6bb760cfd" },
  { id: "09c2e11c-1632-42e3-8fc6-809468b7f87e", title: "Five ways the Iran energy shock is wrongfooting the world", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/09c2e11c-1632-42e3-8fc6-809468b7f87e" },
  { id: "96d0a206-a37b-4166-b78d-b27ed24f7d57", title: "Investors weigh whether Anthropic can sustain surging revenues post-IPO", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/96d0a206-a37b-4166-b78d-b27ed24f7d57" },
  { id: "05887f92-c777-48ab-8efa-9a39e7e18a9f", title: "US state department under pressure to disclose Venezuelan oil takings", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/05887f92-c777-48ab-8efa-9a39e7e18a9f" },
  { id: "e5a76494-71df-4ee0-a85f-b28f2c94ded6", title: "Brussels rebuffs calls for EU-wide digital services tax", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/e5a76494-71df-4ee0-a85f-b28f2c94ded6" },
  { id: "85bb8ebe-4363-4a2c-920c-93fee2d128a7", title: "UK’s top taxpayer says he would ‘not wish to be reborn’ in Britain", date: "2026-09-18", time: "21:00", url: "https://www.ft.com/content/85bb8ebe-4363-4a2c-920c-93fee2d128a7" },
  { id: "4cd82226-3d4a-474d-bc3e-de2ed0b1e6f8", title: "Donald Trump bans major US news outlets from White House", date: "2026-09-18", time: "20:20", url: "https://www.ft.com/content/4cd82226-3d4a-474d-bc3e-de2ed0b1e6f8" },
  { id: "2c59513f-e323-4b29-a3b1-d9e083946978", title: "Keir Starmer looked at softening £100,000 ‘tax trap’ for higher earners", date: "2026-09-18", time: "18:39", url: "https://www.ft.com/content/2c59513f-e323-4b29-a3b1-d9e083946978" },
  { id: "99b7000e-d977-457b-baf3-64f2931b044c", title: "PizzaExpress cooks up sale at up to £500mn valuation", date: "2026-09-18", time: "18:24", url: "https://www.ft.com/content/99b7000e-d977-457b-baf3-64f2931b044c" },
  { id: "cd4e4514-944b-4919-a245-d8013734b8a0", title: "Gavin Newsom advances AI ‘kill switch’ in response to safety fears", date: "2026-09-18", time: "18:12", url: "https://www.ft.com/content/cd4e4514-944b-4919-a245-d8013734b8a0" },
  { id: "f21f5ebd-b84c-476d-9975-f9f317ca8afa", title: "Stockpickers: Glenveagh, Wickes, Big Technologies", date: "2026-09-18", time: "18:00", url: "https://www.ft.com/content/f21f5ebd-b84c-476d-9975-f9f317ca8afa" },
  { id: "c57e73d1-547d-4f69-addb-6516845fbe6d", title: "Ex-Apollo executive admits to improperly using company documents", date: "2026-09-18", time: "17:41", url: "https://www.ft.com/content/c57e73d1-547d-4f69-addb-6516845fbe6d" },
  { id: "67500397-ec06-4027-a4de-fc004b06e642", title: "The relentless creep of Britain’s compliance state", date: "2026-09-18", time: "17:20", url: "https://www.ft.com/content/67500397-ec06-4027-a4de-fc004b06e642" },
  { id: "31c53c3c-5cc1-4248-98dc-68fc8956e8cc", title: "France calls G7 summit on releasing more oil reserves", date: "2026-09-18", time: "16:51", url: "https://www.ft.com/content/31c53c3c-5cc1-4248-98dc-68fc8956e8cc" },
  { id: "e2d2b86f-4f22-477f-9578-75c72683f1e9", title: "Anthropic and the golden rules of business", date: "2026-09-18", time: "16:40", url: "https://www.ft.com/content/e2d2b86f-4f22-477f-9578-75c72683f1e9" },
  { id: "24dc8ce0-5331-4280-ad85-c2dddcef429d", title: "Court shines a further light on who was at fault in SVB implosion", date: "2026-09-18", time: "16:34", url: "https://www.ft.com/content/24dc8ce0-5331-4280-ad85-c2dddcef429d" },
  { id: "993a41e7-8bc6-47dd-87c4-88b2ff5afcec", title: "The merits of friction-maxxing", date: "2026-09-18", time: "16:33", url: "https://www.ft.com/content/993a41e7-8bc6-47dd-87c4-88b2ff5afcec" },
  { id: "5bf1b218-bd69-430e-8544-93e0ef87d10f", title: "Ministers explore limiting political party spending outside UK elections", date: "2026-09-18", time: "16:31", url: "https://www.ft.com/content/5bf1b218-bd69-430e-8544-93e0ef87d10f" },
  { id: "7832ff53-1607-471c-bc9d-9f62c193b641", title: "Warshing the walk", date: "2026-09-18", time: "16:30", url: "https://www.ft.com/content/7832ff53-1607-471c-bc9d-9f62c193b641" },
  { id: "72957f1d-5e28-4303-9bb9-e72781ce245f", title: "Canada plays down EU ‘associate member’ label", date: "2026-09-18", time: "16:26", url: "https://www.ft.com/content/72957f1d-5e28-4303-9bb9-e72781ce245f" },
  { id: "98c6db91-44c7-487e-a733-331a58766ba1", title: "Fed report finds it was ‘too timid’ in tackling risks at Silicon Valley Bank", date: "2026-09-18", time: "16:03", url: "https://www.ft.com/content/98c6db91-44c7-487e-a733-331a58766ba1" },
  { id: "1270032d-25e9-4be0-aa2f-5205b9bedd08", title: "Former Wells Fargo asset manager Allspring explores $4bn sale", date: "2026-09-18", time: "15:12", url: "https://www.ft.com/content/1270032d-25e9-4be0-aa2f-5205b9bedd08" },
  { id: "2660e844-6aaa-49a4-ab7a-aafdf6a3d805", title: "Labour conference set to vote on new AI regulator as cabinet concerns grow", date: "2026-09-18", time: "15:01", url: "https://www.ft.com/content/2660e844-6aaa-49a4-ab7a-aafdf6a3d805" },
  { id: "d6adb7bb-72b4-47d1-b3bd-11e908d06b60", title: "Why Scott Bessent should pay attention to Turkey’s market scandal", date: "2026-09-18", time: "14:45", url: "https://www.ft.com/content/d6adb7bb-72b4-47d1-b3bd-11e908d06b60" },
];
