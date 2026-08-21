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
  { id: "3c085ab6-7128-4073-bc65-5482a47fb016", title: "The new age of Big Law recruiting", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/3c085ab6-7128-4073-bc65-5482a47fb016" },
  { id: "2d7e64e8-386a-4987-ae4d-04b6bf2a5e6a", title: "John Healey warned to limit Budget borrowing amid bond sell-off", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/2d7e64e8-386a-4987-ae4d-04b6bf2a5e6a" },
  { id: "4b7b8d3f-5625-4dba-ad90-66192c101956", title: "Feminism didn’t kill the male breadwinner model, the economy did", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/4b7b8d3f-5625-4dba-ad90-66192c101956" },
  { id: "f01ff762-3e68-4bac-bb73-6f35a6bf2771", title: "Scott Bessent takes on bond vigilantes in $32tn Treasury market", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/f01ff762-3e68-4bac-bb73-6f35a6bf2771" },
  { id: "61a06f4b-f661-4a05-9b73-bc43f22f86db", title: "Burnham should beware the perils of cost of living policy", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/61a06f4b-f661-4a05-9b73-bc43f22f86db" },
  { id: "17583c3f-f8f4-44f8-bb2e-277a8304f252", title: "The historic coffee port in the Houthis’ crosshairs", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/17583c3f-f8f4-44f8-bb2e-277a8304f252" },
  { id: "7353d4b4-23f5-4886-83b3-717f8e70bb4f", title: "Poland’s former PM accuses Kaczyński of radicalising PiS", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/7353d4b4-23f5-4886-83b3-717f8e70bb4f" },
  { id: "d286cb7f-c63e-42a6-86db-d0a9ad0f296a", title: "The battle over golf’s future", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/d286cb7f-c63e-42a6-86db-d0a9ad0f296a" },
  { id: "7f2d4be3-5879-439e-8060-339bac53ab40", title: "London’s cabbies prepare to battle the robotaxis", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/7f2d4be3-5879-439e-8060-339bac53ab40" },
  { id: "ff536e6e-dc56-45e3-b5e0-2dfb28148cb6", title: "Ukraine seeks Musk’s help to hit Russian missile launchers", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/ff536e6e-dc56-45e3-b5e0-2dfb28148cb6" },
  { id: "496b8f06-ffcd-4a14-a3d1-ecd398ce89ba", title: "‘Nobody has automated the kitchen’: the tech billionaire disrupting restaurants", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/496b8f06-ffcd-4a14-a3d1-ecd398ce89ba" },
  { id: "2a791f9d-1036-4ef9-a232-5993b91c554d", title: "Art market money laundering rules catch interior designers and toy-soldier sellers", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/2a791f9d-1036-4ef9-a232-5993b91c554d" },
  { id: "d8bc75ee-77c6-4810-967c-0c2cff69bf7a", title: "HSBC spends $68mn on biggest cull of senior bankers since financial crisis", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/d8bc75ee-77c6-4810-967c-0c2cff69bf7a" },
  { id: "e5512d10-6ade-4e40-97df-9f7d24a01d04", title: "Why the energy crisis won’t save western oil refineries", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/e5512d10-6ade-4e40-97df-9f7d24a01d04" },
  { id: "182f8161-b1a8-43f7-8918-f78f34e03cab", title: "North Korea’s economy enjoys rare ‘dash for flash’", date: "2026-08-21", time: "04:21", url: "https://www.ft.com/content/182f8161-b1a8-43f7-8918-f78f34e03cab" },
  { id: "83500ff8-31df-4031-9edd-8b3de5aff3e3", title: "Shanghai’s answer to Nasdaq outstrips Hong Kong amid Chinese tech frenzy", date: "2026-08-21", time: "03:16", url: "https://www.ft.com/content/83500ff8-31df-4031-9edd-8b3de5aff3e3" },
  { id: "684e18ff-aecf-4d0e-af66-cb17fd80c231", title: "‘The government’s chart is misleading by a factor of more than 23 million percent’", date: "2026-08-21", time: "02:34", url: "https://www.ft.com/content/684e18ff-aecf-4d0e-af66-cb17fd80c231" },
  { id: "402d716a-0cf1-46e6-b09b-e37d6ea428a5", title: "Tory peer’s free speech group urged Vance to lobby UK government", date: "2026-08-20", time: "19:59", url: "https://www.ft.com/content/402d716a-0cf1-46e6-b09b-e37d6ea428a5" },
  { id: "7069ffff-9534-489d-bf25-9965a1bc48bc", title: "Guggenheim loan trades in distressed territory after investor call", date: "2026-08-20", time: "19:43", url: "https://www.ft.com/content/7069ffff-9534-489d-bf25-9965a1bc48bc" },
  { id: "d3fbfcb7-ce89-4b46-8267-c2fed9c67134", title: "Quant hedge funds suffer worst day in 2 years as Treasury boosts buyback and Moderna shares leap", date: "2026-08-20", time: "19:00", url: "https://www.ft.com/content/d3fbfcb7-ce89-4b46-8267-c2fed9c67134" },
  { id: "8bce59a1-d0e7-4f66-b2bd-da45de5a3c4e", title: "Brazilian municipalities join BHP and Vale dam collapse payout scheme", date: "2026-08-20", time: "18:52", url: "https://www.ft.com/content/8bce59a1-d0e7-4f66-b2bd-da45de5a3c4e" },
  { id: "47c8bc3b-c1b6-4fae-add9-e55898778936", title: "Today’s China could learn from Jiang and Zhu", date: "2026-08-20", time: "18:46", url: "https://www.ft.com/content/47c8bc3b-c1b6-4fae-add9-e55898778936" },
  { id: "150aa8bf-54d1-448f-bdc9-14152ce3d76c", title: "The US Treasury is buying long bonds, but not very many", date: "2026-08-20", time: "18:37", url: "https://www.ft.com/content/150aa8bf-54d1-448f-bdc9-14152ce3d76c" },
  { id: "b388be2e-67bd-4056-abd2-234e17819a98", title: "Nvidia looks well placed to benefit from the next stage of the AI boom", date: "2026-08-20", time: "18:17", url: "https://www.ft.com/content/b388be2e-67bd-4056-abd2-234e17819a98" },
  { id: "b536b114-8a82-41ef-8e44-42df0716dd03", title: "Stripe bets that an AI world still needs middlemen", date: "2026-08-20", time: "18:07", url: "https://www.ft.com/content/b536b114-8a82-41ef-8e44-42df0716dd03" },
  { id: "ecafb9a8-b9a6-48a4-8d3c-a626b26fe82b", title: "Monte dei Paschi readies twin takeover bids for Banca Generali and Banco BPM", date: "2026-08-20", time: "18:06", url: "https://www.ft.com/content/ecafb9a8-b9a6-48a4-8d3c-a626b26fe82b" },
  { id: "89d82561-089a-4723-9111-2fdd30552412", title: "Meet Gregory Fenelon, the (self-declared) $14bn man", date: "2026-08-20", time: "17:03", url: "https://www.ft.com/content/89d82561-089a-4723-9111-2fdd30552412" },
  { id: "785aafd1-705a-47da-b016-032d66e449c0", title: "Donald Trump announces fresh ‘economic warfare’ on Iran", date: "2026-08-20", time: "16:29", url: "https://www.ft.com/content/785aafd1-705a-47da-b016-032d66e449c0" },
  { id: "fe17490c-084c-4e25-beae-225a0b6c3ad2", title: "Trump’s South Korea defence flip reminds Japan that it has no Plan B", date: "2026-08-20", time: "16:28", url: "https://www.ft.com/content/fe17490c-084c-4e25-beae-225a0b6c3ad2" },
  { id: "79f1f638-1fd5-40e1-845b-b4a787a12883", title: "Walmart shares tumble as sales growth slows to six-year low", date: "2026-08-20", time: "16:19", url: "https://www.ft.com/content/79f1f638-1fd5-40e1-845b-b4a787a12883" },
  { id: "a355db7d-19f6-469a-a528-8376ca4db5ce", title: "Moderna breakthrough brings back memories of pandemic mania", date: "2026-08-20", time: "16:13", url: "https://www.ft.com/content/a355db7d-19f6-469a-a528-8376ca4db5ce" },
  { id: "0c01cdd9-93e8-469c-8f09-a6d68c91fbc3", title: "US long-term bonds slide as Bessent intervention fails to soothe investors", date: "2026-08-20", time: "16:09", url: "https://www.ft.com/content/0c01cdd9-93e8-469c-8f09-a6d68c91fbc3" },
  { id: "eae8bbc5-7946-4fdc-8e0a-3215f7e56dd2", title: "Western oil refinery closures set to continue despite war shock", date: "2026-08-20", time: "15:29", url: "https://www.ft.com/content/eae8bbc5-7946-4fdc-8e0a-3215f7e56dd2" },
  { id: "6aea64b8-9e9b-401a-9582-7753cbef17c5", title: "America’s national debt hits record $40tn", date: "2026-08-20", time: "14:00", url: "https://www.ft.com/content/6aea64b8-9e9b-401a-9582-7753cbef17c5" },
  { id: "93992d7a-e20d-4f35-a958-c7a9f3b84c02", title: "Investors cut bets on US and UK interest rate rises", date: "2026-08-20", time: "13:55", url: "https://www.ft.com/content/93992d7a-e20d-4f35-a958-c7a9f3b84c02" },
  { id: "40fdc4d1-53d8-4def-b1a1-3fda6c4f8553", title: "Djokovic vs Jordan: getting into the minds of sporting GOATs", date: "2026-08-20", time: "13:08", url: "https://www.ft.com/content/40fdc4d1-53d8-4def-b1a1-3fda6c4f8553" },
  { id: "90bd90e5-5161-4f56-8dfb-e737479fbb99", title: "Europe, the secret outperformer", date: "2026-08-20", time: "13:00", url: "https://www.ft.com/content/90bd90e5-5161-4f56-8dfb-e737479fbb99" },
  { id: "832a6431-5af9-4dd5-aa72-1d4f570527cf", title: "FirstFT: Backlash over law firms’ ‘crazy’ early hiring", date: "2026-08-20", time: "11:49", url: "https://www.ft.com/content/832a6431-5af9-4dd5-aa72-1d4f570527cf" },
  { id: "d15d68d5-291b-44d2-8fdf-3afc95308e9e", title: "North Korea launches missile barrage after dismissing Donald Trump’s overture", date: "2026-08-20", time: "11:43", url: "https://www.ft.com/content/d15d68d5-291b-44d2-8fdf-3afc95308e9e" },
];
