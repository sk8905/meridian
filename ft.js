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
  { id: "3e72dc10-5733-4623-9c4d-1beaab3dd5cf", title: "Sports brand On signs Kylian Mbappé from Nike to lead new football push", date: "2026-09-18", time: "13:00", url: "https://www.ft.com/content/3e72dc10-5733-4623-9c4d-1beaab3dd5cf" },
  { id: "6584e52f-5a8c-4427-ba39-b401a808850d", title: "Britons say they’re taking less annual leave. The ONS doesn’t believe them", date: "2026-09-18", time: "12:14", url: "https://www.ft.com/content/6584e52f-5a8c-4427-ba39-b401a808850d" },
  { id: "c70c275b-cd6d-47ef-a23f-cb374b98d001", title: "On the EU, let Canada and Odysseus inspire Burnham", date: "2026-09-18", time: "12:11", url: "https://www.ft.com/content/c70c275b-cd6d-47ef-a23f-cb374b98d001" },
  { id: "ff7ca130-d25c-4294-b654-0aa8a79268ab", title: "Why Al Gore welcomes China’s ‘unilateral leadership’ on climate", date: "2026-09-18", time: "12:00", url: "https://www.ft.com/content/ff7ca130-d25c-4294-b654-0aa8a79268ab" },
  { id: "3d1234ea-081e-41b3-a2e5-bbd7a81cdb0d", title: "FTAV’s Friday charts quiz", date: "2026-09-18", time: "11:48", url: "https://www.ft.com/content/3d1234ea-081e-41b3-a2e5-bbd7a81cdb0d" },
  { id: "e26d8335-426a-4405-ae4c-433bd2696994", title: "Howard Buffett to succeed father Warren as Berkshire Hathaway chair", date: "2026-09-18", time: "11:16", url: "https://www.ft.com/content/e26d8335-426a-4405-ae4c-433bd2696994" },
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
  { id: "76616441-6419-4792-9d27-31c5fa436dc4", title: "Thames Water should be temporarily placed under public ownership, MPs warn", date: "2026-09-18", time: "08:11", url: "https://www.ft.com/content/76616441-6419-4792-9d27-31c5fa436dc4" },
  { id: "901d5aca-e0ab-4728-8a24-6b0e616c5139", title: "The QT endgame at the BoE", date: "2026-09-18", time: "06:30", url: "https://www.ft.com/content/901d5aca-e0ab-4728-8a24-6b0e616c5139" },
  { id: "12d6fd02-c2de-4774-8bea-4d9ddbae643d", title: "EU mulls compromise options on Usmanov sanctions to end French stand-off", date: "2026-09-18", time: "06:00", url: "https://www.ft.com/content/12d6fd02-c2de-4774-8bea-4d9ddbae643d" },
  { id: "8475dc9b-b2d4-4e10-a6b6-12796b11758a", title: "Joining the dots between big AI", date: "2026-09-18", time: "06:00", url: "https://www.ft.com/content/8475dc9b-b2d4-4e10-a6b6-12796b11758a" },
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
];
