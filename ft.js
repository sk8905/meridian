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
  { id: "cd52173f-5863-4996-93b2-c4adb81ad210", title: "Moderna pins hopes on mRNA ‘game-changer’ for cancer vaccines", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/cd52173f-5863-4996-93b2-c4adb81ad210" },
  { id: "e1d82f18-0555-445b-b595-72c54d1dc940", title: "The growing cost to the UK of the nuclear deterrent", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/e1d82f18-0555-445b-b595-72c54d1dc940" },
  { id: "f1d8ba1d-d3eb-453b-b2b7-45e1c299291f", title: "Nearly nine in 10 leasehold flats still on the market after six months", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/f1d8ba1d-d3eb-453b-b2b7-45e1c299291f" },
  { id: "77a035d2-0e83-4dad-8c88-a0256f91fdce", title: "I’m a garden designer. Here’s why I hired a gardener", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/77a035d2-0e83-4dad-8c88-a0256f91fdce" },
  { id: "565f7434-f648-45a8-b0d4-b04a529c39cd", title: "War comes to Vladimir Putin’s favourite Black Sea resort", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/565f7434-f648-45a8-b0d4-b04a529c39cd" },
  { id: "41e4528d-0d87-4be3-9c59-46f37cec8136", title: "Meloni and Maga: a cautionary tale", date: "2026-08-20", time: "05:00", url: "https://www.ft.com/content/41e4528d-0d87-4be3-9c59-46f37cec8136" },
  { id: "b88c3466-4525-4e16-b3fe-e10e713a2025", title: "The box that built globalisation", date: "2026-08-20", time: "04:00", url: "https://www.ft.com/content/b88c3466-4525-4e16-b3fe-e10e713a2025" },
  { id: "5799e5fa-c836-443b-935d-eb9fb58681b6", title: "Volodymyr Zelenskyy fires top aide as corruption allegations pile up", date: "2026-08-19", time: "20:06", url: "https://www.ft.com/content/5799e5fa-c836-443b-935d-eb9fb58681b6" },
  { id: "6e83ce44-1bff-4a07-86ad-5355c0d240ff", title: "Stripe to buy start-up OpenRouter in $8bn deal", date: "2026-08-19", time: "20:02", url: "https://www.ft.com/content/6e83ce44-1bff-4a07-86ad-5355c0d240ff" },
  { id: "89d82561-089a-4723-9111-2fdd30552412", title: "Meet Gregory Fenelon, the (self-declared) $14bn man", date: "2026-08-19", time: "19:34", url: "https://www.ft.com/content/89d82561-089a-4723-9111-2fdd30552412" },
  { id: "aad0fdbb-f3bf-4b99-b826-7bde552b9d81", title: "Federal Reserve officials express rising concern over persistently high US inflation", date: "2026-08-19", time: "19:31", url: "https://www.ft.com/content/aad0fdbb-f3bf-4b99-b826-7bde552b9d81" },
  { id: "777c9014-2f12-45cf-8224-6bbe808c62cb", title: "US Treasury to boost long-term bond purchases in bid to steady market", date: "2026-08-19", time: "19:02", url: "https://www.ft.com/content/777c9014-2f12-45cf-8224-6bbe808c62cb" },
  { id: "739b7e0a-01e0-4798-966d-f1d60e62647b", title: "BlackRock and Oaktree take keys of top supplier to Hollywood studios", date: "2026-08-19", time: "18:58", url: "https://www.ft.com/content/739b7e0a-01e0-4798-966d-f1d60e62647b" },
  { id: "b58c7ea1-1b97-4f1f-b19d-2544041ec0a8", title: "Private credit risks remain at large", date: "2026-08-19", time: "18:17", url: "https://www.ft.com/content/b58c7ea1-1b97-4f1f-b19d-2544041ec0a8" },
  { id: "d30247d9-6e9e-4c2b-a6fc-9e751a9f7110", title: "Don’t mess up London’s knowledge economy", date: "2026-08-19", time: "18:07", url: "https://www.ft.com/content/d30247d9-6e9e-4c2b-a6fc-9e751a9f7110" },
  { id: "a98a77e2-5156-4189-b971-974a7e60130f", title: "Moderna shares double on skin cancer vaccine success", date: "2026-08-19", time: "17:58", url: "https://www.ft.com/content/a98a77e2-5156-4189-b971-974a7e60130f" },
  { id: "91f17b0f-9c31-483e-b828-d90dad931a2f", title: "Grain prices surge as Ukraine war chokes off Black Sea ports", date: "2026-08-19", time: "17:55", url: "https://www.ft.com/content/91f17b0f-9c31-483e-b828-d90dad931a2f" },
  { id: "d7c1c90d-8b85-4044-a6b0-2a085f96714e", title: "The US munitions crisis goes back further than Iran", date: "2026-08-19", time: "17:51", url: "https://www.ft.com/content/d7c1c90d-8b85-4044-a6b0-2a085f96714e" },
  { id: "8fc1f72a-c3e5-4f40-a28b-c0cb59e39256", title: "Israel-Turkey rivalry bursts into the open over Syria strikes", date: "2026-08-19", time: "17:10", url: "https://www.ft.com/content/8fc1f72a-c3e5-4f40-a28b-c0cb59e39256" },
  { id: "0fdb094c-fc03-4d3c-8da6-bd11af88ff63", title: "Google strikes $12bn AI chip deal with Marvell", date: "2026-08-19", time: "17:05", url: "https://www.ft.com/content/0fdb094c-fc03-4d3c-8da6-bd11af88ff63" },
  { id: "e7fdcb9f-7560-4b6f-9524-8766f752dfcf", title: "Charlesbank nears law firm deal as private equity pushes deeper into US legal sector", date: "2026-08-19", time: "17:05", url: "https://www.ft.com/content/e7fdcb9f-7560-4b6f-9524-8766f752dfcf" },
  { id: "bed337a0-8917-4026-a406-b5ed832f36e6", title: "Putin pledges help for Wildberries warehouses hit by Ukraine", date: "2026-08-19", time: "16:45", url: "https://www.ft.com/content/bed337a0-8917-4026-a406-b5ed832f36e6" },
  { id: "ec9afdc4-5fc8-4333-83a7-80b25e1009bb", title: "Investigators discover track ‘irregularity’ near site of UK train derailment", date: "2026-08-19", time: "16:32", url: "https://www.ft.com/content/ec9afdc4-5fc8-4333-83a7-80b25e1009bb" },
  { id: "d8ff1233-01ff-496d-aa18-91233c1db051", title: "Moderna’s cancer shot: exciting for investors, inconclusive for patients", date: "2026-08-19", time: "15:33", url: "https://www.ft.com/content/d8ff1233-01ff-496d-aa18-91233c1db051" },
  { id: "c5551f25-74d5-441f-8eb0-ef7ef20c7ec4", title: "Target profits double after $1bn tariff refund", date: "2026-08-19", time: "15:21", url: "https://www.ft.com/content/c5551f25-74d5-441f-8eb0-ef7ef20c7ec4" },
  { id: "7a9c6019-bd0b-44b4-9a2d-db02ee881266", title: "Price of olive oil doubles in five years: how UK inflation has hit shoppers", date: "2026-08-19", time: "15:19", url: "https://www.ft.com/content/7a9c6019-bd0b-44b4-9a2d-db02ee881266" },
  { id: "41c9e4c9-4d02-4ad5-b31f-afef9cd0346e", title: "Portuguese men o’ war plague Europe’s warming beaches", date: "2026-08-19", time: "15:16", url: "https://www.ft.com/content/41c9e4c9-4d02-4ad5-b31f-afef9cd0346e" },
];
