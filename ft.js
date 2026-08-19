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
  { id: "8fc1f72a-c3e5-4f40-a28b-c0cb59e39256", title: "Israel-Turkey rivalry bursts into open over Syria strikes", date: "2026-08-19", time: "17:10", url: "https://www.ft.com/content/8fc1f72a-c3e5-4f40-a28b-c0cb59e39256" },
  { id: "0fdb094c-fc03-4d3c-8da6-bd11af88ff63", title: "Google strikes $12bn AI chip deal with Marvell", date: "2026-08-19", time: "17:05", url: "https://www.ft.com/content/0fdb094c-fc03-4d3c-8da6-bd11af88ff63" },
  { id: "e7fdcb9f-7560-4b6f-9524-8766f752dfcf", title: "Charlesbank nears law firm deal as private equity pushes deeper into US legal sector", date: "2026-08-19", time: "17:05", url: "https://www.ft.com/content/e7fdcb9f-7560-4b6f-9524-8766f752dfcf" },
  { id: "bed337a0-8917-4026-a406-b5ed832f36e6", title: "Putin pledges help for Wildberries warehouses hit by Ukraine", date: "2026-08-19", time: "16:45", url: "https://www.ft.com/content/bed337a0-8917-4026-a406-b5ed832f36e6" },
  { id: "d8ff1233-01ff-496d-aa18-91233c1db051", title: "Moderna’s cancer shot: exciting for investors, inconclusive for patients", date: "2026-08-19", time: "15:33", url: "https://www.ft.com/content/d8ff1233-01ff-496d-aa18-91233c1db051" },
  { id: "7a9c6019-bd0b-44b4-9a2d-db02ee881266", title: "Price of olive oil doubles in five years: how UK inflation has hit shoppers", date: "2026-08-19", time: "15:19", url: "https://www.ft.com/content/7a9c6019-bd0b-44b4-9a2d-db02ee881266" },
  { id: "14787634-6345-4446-aab6-1a3f1f519ba5", title: "Mike Ashley’s luxury retail empire is going cheap", date: "2026-08-19", time: "14:34", url: "https://www.ft.com/content/14787634-6345-4446-aab6-1a3f1f519ba5" },
  { id: "34a99573-0fa1-422b-9263-147f9ed7be6c", title: "Mass expulsion was once a taboo idea in Europe. Then came Maga", date: "2026-08-19", time: "13:27", url: "https://www.ft.com/content/34a99573-0fa1-422b-9263-147f9ed7be6c" },
  { id: "777c9014-2f12-45cf-8224-6bbe808c62cb", title: "US Treasury to double buybacks of long-term government debt", date: "2026-08-19", time: "13:59", url: "https://www.ft.com/content/777c9014-2f12-45cf-8224-6bbe808c62cb" },
  { id: "ec9afdc4-5fc8-4333-83a7-80b25e1009bb", title: "Investigators discover track 'irregularity' near site of UK train derailment", date: "2026-08-19", time: "13:17", url: "https://www.ft.com/content/ec9afdc4-5fc8-4333-83a7-80b25e1009bb" },
  { id: "a98a77e2-5156-4189-b971-974a7e60130f", title: "Moderna share price doubles on melanoma vaccine trial success", date: "2026-08-19", time: "13:08", url: "https://www.ft.com/content/a98a77e2-5156-4189-b971-974a7e60130f" },
  { id: "c5551f25-74d5-441f-8eb0-ef7ef20c7ec4", title: "Target profits double after $1bn tariff refund", date: "2026-08-19", time: "12:59", url: "https://www.ft.com/content/c5551f25-74d5-441f-8eb0-ef7ef20c7ec4" },
  { id: "9d9d4388-2b90-48c7-8294-9c2183ba6ba6", title: "France to expel two Iranian officials in diplomatic row", date: "2026-08-19", time: "12:49", url: "https://www.ft.com/content/9d9d4388-2b90-48c7-8294-9c2183ba6ba6" },
  { id: "c15ce62d-fc69-4c2f-ae3b-0dc4dac8a49a", title: "British free speech group hit by unease over Maga links", date: "2026-08-19", time: "12:35", url: "https://www.ft.com/content/c15ce62d-fc69-4c2f-ae3b-0dc4dac8a49a" },
  { id: "763bf6a1-31de-4c6a-9591-963440f0562b", title: "Europe should wish Marco Rubio a bright future", date: "2026-08-19", time: "12:20", url: "https://www.ft.com/content/763bf6a1-31de-4c6a-9591-963440f0562b" },
  { id: "5799e5fa-c836-443b-935d-eb9fb58681b6", title: "Ukraine anti-corruption team raids home of top Zelenskyy aide", date: "2026-08-19", time: "12:16", url: "https://www.ft.com/content/5799e5fa-c836-443b-935d-eb9fb58681b6" },
  { id: "8b4a32a0-f14b-4069-a2e5-5e4d55b0906d", title: "We need to rethink how we pay for water", date: "2026-08-19", time: "12:00", url: "https://www.ft.com/content/8b4a32a0-f14b-4069-a2e5-5e4d55b0906d" },
  { id: "0632931b-1c3b-4ef8-aa18-038afe5d7761", title: "The US economy is running hot", date: "2026-08-19", time: "12:00", url: "https://www.ft.com/content/0632931b-1c3b-4ef8-aa18-038afe5d7761" },
  { id: "b36d4655-b05f-46a9-87b2-145437dbdc3b", title: "UK software group Pinewood agrees £545mn PE takeover by Ridgeview", date: "2026-08-19", time: "11:55", url: "https://www.ft.com/content/b36d4655-b05f-46a9-87b2-145437dbdc3b" },
  { id: "0ff3c190-725a-47a5-afcc-e369135c0a60", title: "Death stalks the Irish pub", date: "2026-08-19", time: "11:30", url: "https://www.ft.com/content/0ff3c190-725a-47a5-afcc-e369135c0a60" },
  { id: "4112da7f-3809-450b-900d-4934bb7c2bab", title: "Feuding Reform fuels Tory party’s faith in a comeback", date: "2026-08-19", time: "09:30", url: "https://www.ft.com/content/4112da7f-3809-450b-900d-4934bb7c2bab" },
  { id: "115fc315-66f3-4eee-b717-4105f13f4d9a", title: "Democratic socialist unexpectedly wins Florida primary", date: "2026-08-19", time: "09:28", url: "https://www.ft.com/content/115fc315-66f3-4eee-b717-4105f13f4d9a" },
  { id: "032f5586-b958-41b3-a21e-6799269bd589", title: "Sweden’s EQT buys Australian rugby league club in first sports foray", date: "2026-08-19", time: "09:00", url: "https://www.ft.com/content/032f5586-b958-41b3-a21e-6799269bd589" },
  { id: "a888e3d8-e0c3-40ea-96fb-cd3e22e9e6d1", title: "July inflation keeps BoE on course to hold rates in September", date: "2026-08-19", time: "08:20", url: "https://www.ft.com/content/a888e3d8-e0c3-40ea-96fb-cd3e22e9e6d1" },
  { id: "bba9ad75-bc9c-4ca3-af41-77e6714fdce1", title: "Chinese automaker Chery to open UK R&D centre", date: "2026-08-19", time: "07:00", url: "https://www.ft.com/content/bba9ad75-bc9c-4ca3-af41-77e6714fdce1" },
  { id: "5a606279-3473-4c5b-a16e-ad9db6debafb", title: "UK inflation accelerated to 2.9% in July amid Middle East energy shock", date: "2026-08-19", time: "07:02", url: "https://www.ft.com/content/5a606279-3473-4c5b-a16e-ad9db6debafb" },
  { id: "b2d9e5a2-22ce-4267-98b0-62ab78906509", title: "FirstFT: Iran weighs Europe strikes if US restarts war", date: "2026-08-19", time: "07:01", url: "https://www.ft.com/content/b2d9e5a2-22ce-4267-98b0-62ab78906509" },
  { id: "14cd8246-7fb1-4f8f-81b4-8de11ced79e5", title: "Chinese humanoid robot maker surges 600% in trading debut", date: "2026-08-19", time: "06:37", url: "https://www.ft.com/content/14cd8246-7fb1-4f8f-81b4-8de11ced79e5" },
  { id: "8f896be1-dd04-4476-ae70-8d67a6627ccd", title: "The defence stocks aren’t defensive", date: "2026-08-19", time: "06:30", url: "https://www.ft.com/content/8f896be1-dd04-4476-ae70-8d67a6627ccd" },
  { id: "7775e64c-10aa-41bc-b670-c895e0bd3a41", title: "FTAV’s further reading", date: "2026-08-19", time: "06:30", url: "https://www.ft.com/content/7775e64c-10aa-41bc-b670-c895e0bd3a41" },
  { id: "6b62e9fb-d2e4-4739-9b71-8771d7e36a2d", title: "Singapore unveils tax cuts for asset managers amid global talent tussle", date: "2026-08-19", time: "06:07", url: "https://www.ft.com/content/6b62e9fb-d2e4-4739-9b71-8771d7e36a2d" },
  { id: "fe3a8ce6-e348-4588-aba0-bb88650f87b9", title: "Craig Wright, academic publishing phenomenon", date: "2026-08-19", time: "06:00", url: "https://www.ft.com/content/fe3a8ce6-e348-4588-aba0-bb88650f87b9" },
  { id: "41c9e4c9-4d02-4ad5-b31f-afef9cd0346e", title: "Venomous sea creatures plague Europe’s warming beaches", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/41c9e4c9-4d02-4ad5-b31f-afef9cd0346e" },
  { id: "de2449f0-c6be-42df-9650-b61a42547651", title: "What high streets can learn from the success of retail parks", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/de2449f0-c6be-42df-9650-b61a42547651" },
  { id: "ade8f80e-a5aa-4696-a6ca-40865c77229f", title: "Private credit’s mounting strains", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/ade8f80e-a5aa-4696-a6ca-40865c77229f" },
  { id: "9ea0cde8-129e-4d88-976f-e367b7dd4d2c", title: "Iran eyes military targets in Europe if Donald Trump escalates war, insiders say", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/9ea0cde8-129e-4d88-976f-e367b7dd4d2c" },
  { id: "117e3a76-0b5c-4e99-a6da-3421cb8d5da7", title: "Why Britain needs a Messi budget", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/117e3a76-0b5c-4e99-a6da-3421cb8d5da7" },
  { id: "82bf560f-7803-41e7-9391-95c42b42e3b4", title: "Why the story of the Vegetable Lamb was believed", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/82bf560f-7803-41e7-9391-95c42b42e3b4" },
  { id: "6af7701e-a9ab-4a9f-bb67-ca7ab8f78fff", title: "Can Mexicans be weaned off an addiction to cash?", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/6af7701e-a9ab-4a9f-bb67-ca7ab8f78fff" },
  { id: "a1e7a6e3-f7b9-4ed4-a823-b5e6274aab9b", title: "Revolut to let Nik Storonsky borrow up to $250mn against his stake", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/a1e7a6e3-f7b9-4ed4-a823-b5e6274aab9b" },
];
