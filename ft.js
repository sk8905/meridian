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
  { id: "1785c976-109d-47b4-9aa3-1c4d839086c6", title: "Business and unions clash over how to fix UK’s youth jobs shortage", date: "2026-09-18", time: "14:32", url: "https://www.ft.com/content/1785c976-109d-47b4-9aa3-1c4d839086c6" },
  { id: "0649f3dd-e473-4174-ad1d-b01a93923bd3", title: "Come on Latin America, you owe me one", date: "2026-09-18", time: "14:29", url: "https://www.ft.com/content/0649f3dd-e473-4174-ad1d-b01a93923bd3" },
  { id: "fc7438b6-2d58-4a4f-b296-86d75ecaaf2d", title: "UK air traffic outage caused by ‘legacy’ software bug, says review", date: "2026-09-18", time: "14:21", url: "https://www.ft.com/content/fc7438b6-2d58-4a4f-b296-86d75ecaaf2d" },
  { id: "28af636d-7551-4250-a89b-01c068534356", title: "Budget blues", date: "2026-09-18", time: "14:09", url: "https://www.ft.com/content/28af636d-7551-4250-a89b-01c068534356" },
  { id: "a528adc7-3a8c-4a00-826f-1fdde748efb5", title: "Xi’s edge over Trump on AI", date: "2026-09-18", time: "14:00", url: "https://www.ft.com/content/a528adc7-3a8c-4a00-826f-1fdde748efb5" },
  { id: "3943277e-eaf8-4faf-9f9c-1c05cb2ba992", title: "Turkey moves to liquidate funds at centre of ‘Ponzi-like scheme’", date: "2026-09-18", time: "13:38", url: "https://www.ft.com/content/3943277e-eaf8-4faf-9f9c-1c05cb2ba992" },
  { id: "3e72dc10-5733-4623-9c4d-1beaab3dd5cf", title: "Sports brand On signs Kylian Mbappé from Nike to lead new football push", date: "2026-09-18", time: "13:00", url: "https://www.ft.com/content/3e72dc10-5733-4623-9c4d-1beaab3dd5cf" },
  { id: "6584e52f-5a8c-4427-ba39-b401a808850d", title: "Britons say they’re taking less annual leave. The ONS doesn’t believe them", date: "2026-09-18", time: "12:14", url: "https://www.ft.com/content/6584e52f-5a8c-4427-ba39-b401a808850d" },
  { id: "c70c275b-cd6d-47ef-a23f-cb374b98d001", title: "On the EU, let Canada and Odysseus inspire Burnham", date: "2026-09-18", time: "12:11", url: "https://www.ft.com/content/c70c275b-cd6d-47ef-a23f-cb374b98d001" },
  { id: "ff7ca130-d25c-4294-b654-0aa8a79268ab", title: "Why Al Gore welcomes China’s ‘unilateral leadership’ on climate", date: "2026-09-18", time: "12:00", url: "https://www.ft.com/content/ff7ca130-d25c-4294-b654-0aa8a79268ab" },
  { id: "3d1234ea-081e-41b3-a2e5-bbd7a81cdb0d", title: "FTAV’s Friday charts quiz", date: "2026-09-18", time: "11:48", url: "https://www.ft.com/content/3d1234ea-081e-41b3-a2e5-bbd7a81cdb0d" },
  { id: "e26d8335-426a-4405-ae4c-433bd2696994", title: "Howard Buffett to succeed father Warren as Berkshire Hathaway chair", date: "2026-09-18", time: "11:16", url: "https://www.ft.com/content/e26d8335-426a-4405-ae4c-433bd2696994" },
  { id: "07acddb2-9a2f-4646-b7dd-2cb4ebe0257d", title: "Raspberry Pi founder Eben Upton: ‘I’m an omni-geek’", date: "2026-09-18", time: "12:30", url: "https://www.ft.com/content/07acddb2-9a2f-4646-b7dd-2cb4ebe0257d" },
  { id: "92835f21-2d6c-412d-a9b3-cbbfc44fa333", title: "Can Scottish Labour be revived by new leader?", date: "2026-09-18", time: "11:15", url: "https://www.ft.com/content/92835f21-2d6c-412d-a9b3-cbbfc44fa333" },
  { id: "35f6bcf0-ba88-4a82-9575-9dae232d1b54", title: "Russia seizes control of Nestlé and Auchan operations", date: "2026-09-18", time: "11:09", url: "https://www.ft.com/content/35f6bcf0-ba88-4a82-9575-9dae232d1b54" },
  { id: "91b94aa4-d432-4401-9a60-572d518a4972", title: "Is the Antichrist really walking among us?", date: "2026-09-18", time: "11:00", url: "https://www.ft.com/content/91b94aa4-d432-4401-9a60-572d518a4972" },
  { id: "f89ed081-c025-4d69-bc41-9f5564c8b441", title: "FirstFT: Venezuela nears deal to transfer $4bn gold reserve to New York", date: "2026-09-18", time: "10:57", url: "https://www.ft.com/content/f89ed081-c025-4d69-bc41-9f5564c8b441" },
  { id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2", title: "Inflation and interest rates tracker: see how your country compares", date: "2026-09-18", time: "10:57", url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2" },
  { id: "97a0bed5-0580-4ccc-bd3c-fe9a714259e2", title: "Yen sinks after Bank of Japan raises rates to highest level since 1995", date: "2026-09-18", time: "10:46", url: "https://www.ft.com/content/97a0bed5-0580-4ccc-bd3c-fe9a714259e2" },
  { id: "b1bf57db-c66f-4086-a0be-531e7a5dcd31", title: "Fuel queues and conscription fears unsettle Russian voters", date: "2026-09-18", time: "10:38", url: "https://www.ft.com/content/b1bf57db-c66f-4086-a0be-531e7a5dcd31" },
  { id: "14f9df6a-5a70-42d9-86ee-37e6242aae6e", title: "Bank of Japan raises rates and accelerates tightening", date: "2026-09-18", time: "10:32", url: "https://www.ft.com/content/14f9df6a-5a70-42d9-86ee-37e6242aae6e" },
  { id: "7a285c59-2a2f-4e8b-9456-d4b92334fec7", title: "‘Greek finance minister encourages Germany to implement reforms’", date: "2026-09-18", time: "10:00", url: "https://www.ft.com/content/7a285c59-2a2f-4e8b-9456-d4b92334fec7" },
  { id: "c403656f-9237-4d16-b6c2-685cfb1e989e", title: "Number 10 North is still a ‘jigsaw’ with a tricky growth agenda", date: "2026-09-18", time: "09:30", url: "https://www.ft.com/content/c403656f-9237-4d16-b6c2-685cfb1e989e" },
  { id: "9937d230-9ce7-4847-814b-cc99fe8ded37", title: "FTAV’s further reading", date: "2026-09-18", time: "09:08", url: "https://www.ft.com/content/9937d230-9ce7-4847-814b-cc99fe8ded37" },
  { id: "cfc2c898-da5a-4387-92f4-6ae1274705b6", title: "South Korea’s Lee suffering ‘sleepless nights’ as US pressure grows", date: "2026-09-18", time: "09:05", url: "https://www.ft.com/content/cfc2c898-da5a-4387-92f4-6ae1274705b6" },
  { id: "5aef2e95-4a0f-4bc7-bb79-66e8f8c0247a", title: "UK retail sales rose more than forecast in August", date: "2026-09-18", time: "08:14", url: "https://www.ft.com/content/5aef2e95-4a0f-4bc7-bb79-66e8f8c0247a" },
];
