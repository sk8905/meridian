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
  { id: "89d82561-089a-4723-9111-2fdd30552412", title: "Meet Gregory Fenelon, the (self-declared) $14bn man", date: "2026-08-20", time: "17:03", url: "https://www.ft.com/content/89d82561-089a-4723-9111-2fdd30552412" },
  { id: "fe17490c-084c-4e25-beae-225a0b6c3ad2", title: "Trump’s South Korea defence flip reminds Japan that it has no Plan B", date: "2026-08-20", time: "16:28", url: "https://www.ft.com/content/fe17490c-084c-4e25-beae-225a0b6c3ad2" },
  { id: "a355db7d-19f6-469a-a528-8376ca4db5ce", title: "Moderna breakthrough brings back memories of pandemic mania", date: "2026-08-20", time: "16:13", url: "https://www.ft.com/content/a355db7d-19f6-469a-a528-8376ca4db5ce" },
  { id: "eae8bbc5-7946-4fdc-8e0a-3215f7e56dd2", title: "Western oil refinery closures set to continue despite war shock", date: "2026-08-20", time: "15:29", url: "https://www.ft.com/content/eae8bbc5-7946-4fdc-8e0a-3215f7e56dd2" },
  { id: "6aea64b8-9e9b-401a-9582-7753cbef17c5", title: "America’s national debt hits record $40tn", date: "2026-08-20", time: "13:00", url: "https://www.ft.com/content/6aea64b8-9e9b-401a-9582-7753cbef17c5" },
  { id: "93992d7a-e20d-4f35-a958-c7a9f3b84c02", title: "Investors cut bets on US and UK interest rate rises", date: "2026-08-20", time: "12:55", url: "https://www.ft.com/content/93992d7a-e20d-4f35-a958-c7a9f3b84c02" },
  { id: "0c01cdd9-93e8-469c-8f09-a6d68c91fbc3", title: "US long-term bonds slide as Bessent intervention fails to soothe investors", date: "2026-08-20", time: "12:52", url: "https://www.ft.com/content/0c01cdd9-93e8-469c-8f09-a6d68c91fbc3" },
  { id: "40fdc4d1-53d8-4def-b1a1-3fda6c4f8553", title: "Djokovic vs Jordan: getting into the minds of sporting GOATs", date: "2026-08-20", time: "13:08", url: "https://www.ft.com/content/40fdc4d1-53d8-4def-b1a1-3fda6c4f8553" },
  { id: "90bd90e5-5161-4f56-8dfb-e737479fbb99", title: "Europe, the secret outperformer", date: "2026-08-20", time: "13:00", url: "https://www.ft.com/content/90bd90e5-5161-4f56-8dfb-e737479fbb99" },
  { id: "79f1f638-1fd5-40e1-845b-b4a787a12883", title: "Walmart pledges to use US tariff refund to cut grocery prices", date: "2026-08-20", time: "12:03", url: "https://www.ft.com/content/79f1f638-1fd5-40e1-845b-b4a787a12883" },
  { id: "d15d68d5-291b-44d2-8fdf-3afc95308e9e", title: "North Korea launches missile barrage after dismissing Donald Trump’s overture", date: "2026-08-20", time: "11:43", url: "https://www.ft.com/content/d15d68d5-291b-44d2-8fdf-3afc95308e9e" },
  { id: "f72df19f-29f2-4330-8e27-c69919d56972", title: "‘Treasury demand has become materially more valuation-sensitive’", date: "2026-08-20", time: "11:18", url: "https://www.ft.com/content/f72df19f-29f2-4330-8e27-c69919d56972" },
  { id: "2e59ab7f-ed8f-4cbe-9faf-b2cb408768d5", title: "Harold Hamm launches multibillion-dollar plan to drill Argentine shale", date: "2026-08-20", time: "11:00", url: "https://www.ft.com/content/2e59ab7f-ed8f-4cbe-9faf-b2cb408768d5" },
  { id: "a26812af-663c-486a-9955-bb392763403c", title: "Trump-aligned oil group touts ‘sealskin diplomacy’ to win over Greenland", date: "2026-08-20", time: "11:00", url: "https://www.ft.com/content/a26812af-663c-486a-9955-bb392763403c" },
  { id: "201a86a6-3597-4efb-b575-39172c729fe1", title: "Trump is losing his war of independence on rare earths", date: "2026-08-20", time: "11:00", url: "https://www.ft.com/content/201a86a6-3597-4efb-b575-39172c729fe1" },
  { id: "f72bb58c-d0a9-43a5-adaf-a68338a1db1e", title: "GCSE results show worsening pass rates among students who resit", date: "2026-08-20", time: "10:13", url: "https://www.ft.com/content/f72bb58c-d0a9-43a5-adaf-a68338a1db1e" },
  { id: "c000ba8f-2642-4099-80b6-5b7e227adf72", title: "Zack Polanski remade the Greens — but at the risk of a backlash", date: "2026-08-20", time: "10:01", url: "https://www.ft.com/content/c000ba8f-2642-4099-80b6-5b7e227adf72" },
  { id: "785aafd1-705a-47da-b016-032d66e449c0", title: "Donald Trump announces new drive to isolate and crush Iranian economy", date: "2026-08-20", time: "10:01", url: "https://www.ft.com/content/785aafd1-705a-47da-b016-032d66e449c0" },
  { id: "07573ffc-5c7b-448e-867e-c3b8840b11ce", title: "Taiwan proposes record defence budget to resist China pressure", date: "2026-08-20", time: "09:21", url: "https://www.ft.com/content/07573ffc-5c7b-448e-867e-c3b8840b11ce" },
  { id: "736418a3-6d0d-4425-91df-9671db4c9b7d", title: "Russian missile attack kills at least 13 in Kyiv", date: "2026-08-20", time: "07:57", url: "https://www.ft.com/content/736418a3-6d0d-4425-91df-9671db4c9b7d" },
  { id: "63781160-8d91-4e88-802c-6c8aac41d32a", title: "Google’s China shift and the battle over AI models", date: "2026-08-20", time: "07:50", url: "https://www.ft.com/content/63781160-8d91-4e88-802c-6c8aac41d32a" },
  { id: "832a6431-5af9-4dd5-aa72-1d4f570527cf", title: "FirstFT: Backlash over law firms’ ‘crazy’ early hiring", date: "2026-08-20", time: "07:07", url: "https://www.ft.com/content/832a6431-5af9-4dd5-aa72-1d4f570527cf" },
  { id: "b1e9ad81-7600-4ee3-8651-7891796d767e", title: "Starmer lacked ‘vision’ and needed ‘bigger people’ around him, says Sue Gray", date: "2026-08-20", time: "07:00", url: "https://www.ft.com/content/b1e9ad81-7600-4ee3-8651-7891796d767e" },
  { id: "895d78fc-ce60-4cb6-a8d5-db3ab01d1ebf", title: "Founder of collapsed Chinese property giant given life sentence", date: "2026-08-20", time: "06:49", url: "https://www.ft.com/content/895d78fc-ce60-4cb6-a8d5-db3ab01d1ebf" },
  { id: "f8880b82-7283-4a3c-b000-06e5d0c87993", title: "Big Brother Bessent is watching you", date: "2026-08-20", time: "06:30", url: "https://www.ft.com/content/f8880b82-7283-4a3c-b000-06e5d0c87993" },
  { id: "32f71c02-9abd-4c5b-8f74-9b31303bf386", title: "FTAV’s further reading", date: "2026-08-20", time: "06:30", url: "https://www.ft.com/content/32f71c02-9abd-4c5b-8f74-9b31303bf386" },
  { id: "bcc9a461-b131-4676-8c55-f822152e1189", title: "140 years of banking crises and bailouts", date: "2026-08-20", time: "06:00", url: "https://www.ft.com/content/bcc9a461-b131-4676-8c55-f822152e1189" },
  { id: "91e95fcd-00ac-45d0-a4cf-a28a941f8a2c", title: "Singapore police look into iron ore trader Radiant World", date: "2026-08-20", time: "05:39", url: "https://www.ft.com/content/91e95fcd-00ac-45d0-a4cf-a28a941f8a2c" },
  { id: "f366abee-4017-49a0-899c-cd93609ff5da", title: "Federal Reserve policymakers are becoming more hawkish", date: "2026-08-20", time: "05:30", url: "https://www.ft.com/content/f366abee-4017-49a0-899c-cd93609ff5da" },
  { id: "073612bf-ba7c-4642-ad64-38fe17a55489", title: "China hits out at EU probe into JD.com bid for German retailer", date: "2026-08-20", time: "05:06", url: "https://www.ft.com/content/073612bf-ba7c-4642-ad64-38fe17a55489" },
  { id: "65d1e0f3-f056-49dc-907a-b76a7f2794c8", title: "Private equity’s escapades in the legal market", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/65d1e0f3-f056-49dc-907a-b76a7f2794c8" },
  { id: "a8056598-14dd-4a9e-a21d-ad68e9891cc1", title: "Demand for tankers soars as Gulf oil producers search for ways to export cargoes", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/a8056598-14dd-4a9e-a21d-ad68e9891cc1" },
  { id: "295c2eba-da29-434d-84e0-e9de3b0b1cc2", title: "Internet age checks have boosted rogue adult sites, says Pornhub", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/295c2eba-da29-434d-84e0-e9de3b0b1cc2" },
  { id: "6c358cee-d7ec-4542-9c1b-f922b13d48ae", title: "UK finally showing signs of productivity boost, say economists", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/6c358cee-d7ec-4542-9c1b-f922b13d48ae" },
  { id: "30ff2e38-38a2-4e4b-8c63-af84a8d1ece4", title: "Premier League summer transfer spending set to break record", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/30ff2e38-38a2-4e4b-8c63-af84a8d1ece4" },
  { id: "4bf0e154-b028-4ddf-b1c7-5269a8c58ebe", title: "Two-thirds of UK students run out of money before the end of term", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/4bf0e154-b028-4ddf-b1c7-5269a8c58ebe" },
  { id: "5ca20d4b-1ec1-4e6d-8994-ba906c7cfd33", title: "Will Barclays’ latest Wall Street reset finally work?", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/5ca20d4b-1ec1-4e6d-8994-ba906c7cfd33" },
  { id: "d70655c1-63b8-4142-aae8-82db916bc045", title: "Top US law firms hit by backlash over ‘crazy’ hiring of first-year students", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/d70655c1-63b8-4142-aae8-82db916bc045" },
  { id: "6181c22c-731a-4044-9720-fc4e0d500403", title: "The slow sucking sound of AI", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/6181c22c-731a-4044-9720-fc4e0d500403" },
  { id: "57a4cf95-e510-4349-804e-81e7679ccac7", title: "The UK power system is stuck between a rock and a hard place", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/57a4cf95-e510-4349-804e-81e7679ccac7" },
];
