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
  { id: "80e7dfea-1dae-4ab7-ad56-5ba8dee2e5fd", title: "Andy Burnham is right to rule out an early election", date: "2026-08-25", time: "09:38", url: "https://www.ft.com/content/80e7dfea-1dae-4ab7-ad56-5ba8dee2e5fd" },
  { id: "d66a71ea-e181-4579-85c7-00760d4a3166", title: "FTAV’s further reading", date: "2026-08-25", time: "07:48", url: "https://www.ft.com/content/d66a71ea-e181-4579-85c7-00760d4a3166" },
  { id: "af815e45-b132-4db4-96bc-428f8e0b76f3", title: "Nvidia employee charged with smuggling advanced chips into China", date: "2026-08-25", time: "06:31", url: "https://www.ft.com/content/af815e45-b132-4db4-96bc-428f8e0b76f3" },
  { id: "121a5db7-f9b9-42c4-b216-542cc4114fe5", title: "The problem with buying the dip in bonds", date: "2026-08-25", time: "06:30", url: "https://www.ft.com/content/121a5db7-f9b9-42c4-b216-542cc4114fe5" },
  { id: "c8f9886c-8b23-472a-aa43-58907668bb1f", title: "Is Northampton an emerging market?", date: "2026-08-25", time: "06:30", url: "https://www.ft.com/content/c8f9886c-8b23-472a-aa43-58907668bb1f" },
  { id: "5162b0a3-e7b1-460d-95a0-9a8e27eddb5a", title: "FirstFT: Iran war punishes US farmers", date: "2026-08-25", time: "06:17", url: "https://www.ft.com/content/5162b0a3-e7b1-460d-95a0-9a8e27eddb5a" },
  { id: "705bb093-f491-4a2c-90bb-1804be8c1426", title: "EU leaders begin heart-to-heart budget talks as year-end deadline looms large", date: "2026-08-25", time: "06:00", url: "https://www.ft.com/content/705bb093-f491-4a2c-90bb-1804be8c1426" },
  { id: "6f01973c-3e9f-41d0-9140-709bfea3cb22", title: "The unravelling of Mark Walter", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/6f01973c-3e9f-41d0-9140-709bfea3cb22" },
  { id: "d18b330f-1cc2-4f83-9720-5ab5b13981e4", title: "JPMorgan eases approach on lending against shares to court AI’s new wealth", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/d18b330f-1cc2-4f83-9720-5ab5b13981e4" },
  { id: "e08d7f0e-f9fb-45a4-a1ef-025a75a5b776", title: "Iranians queue for petrol as US blockade bites", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/e08d7f0e-f9fb-45a4-a1ef-025a75a5b776" },
  { id: "910288e8-5ad1-4f09-90fb-36c3efe275e0", title: "Austerity denial and the mystery of Britain’s shrunken state", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/910288e8-5ad1-4f09-90fb-36c3efe275e0" },
  { id: "02e197fb-e6dc-426b-a952-72cc906a2733", title: "Socialists and Maga are both wrong about economic liberalism", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/02e197fb-e6dc-426b-a952-72cc906a2733" },
  { id: "7b7d407c-98b8-450f-a8d4-3776608ae67b", title: "China could rescue the oil market again — if it wanted to", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/7b7d407c-98b8-450f-a8d4-3776608ae67b" },
  { id: "5d54c148-861e-45f3-b867-821705c212a7", title: "Superpowers are discovering their limits, says UN chief", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/5d54c148-861e-45f3-b867-821705c212a7" },
  { id: "3bcae42c-b784-400e-9f2d-3bb00c4b0d85", title: "Skipton tries to show that building societies still matter", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/3bcae42c-b784-400e-9f2d-3bb00c4b0d85" },
  { id: "940339db-b5b5-4b53-95e6-cfbc42eb6c06", title: "NatWest plots push into US market", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/940339db-b5b5-4b53-95e6-cfbc42eb6c06" },
  { id: "acb64e29-a3ce-4282-82b0-6b7b5dd4f63e", title: "US grain farmers face worst crisis in decades as Iran war sends costs spiralling", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/acb64e29-a3ce-4282-82b0-6b7b5dd4f63e" },
  { id: "a56403b3-aff2-4f33-a4e1-a01ff03275f2", title: "10 hot new haircare products to buy now", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/a56403b3-aff2-4f33-a4e1-a01ff03275f2" },
  { id: "e9b9f2d5-79c0-4c61-ae71-d70208068a2c", title: "The seven stages of a facelift", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/e9b9f2d5-79c0-4c61-ae71-d70208068a2c" },
  { id: "db7494b8-c590-4a50-8644-211d154a8f7b", title: "The threats to ‘Swiss Made’", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/db7494b8-c590-4a50-8644-211d154a8f7b" },
  { id: "801163f1-901f-4955-8537-47fd9373f4f4", title: "Would you put rendered cow fat on your face?", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/801163f1-901f-4955-8537-47fd9373f4f4" },
  { id: "35a82994-31cf-4aaa-b0ee-03002a53fe0b", title: "Private equity growth funds attract record first-half inflows as sector rebounds", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/35a82994-31cf-4aaa-b0ee-03002a53fe0b" },
  { id: "cc2b3ce8-3953-408b-a25d-705049a7eff9", title: "Want shiny, manageable hair? Maybe you need a mask", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/cc2b3ce8-3953-408b-a25d-705049a7eff9" },
  { id: "126eeb20-a403-46cf-8ec0-680c10dd84ad", title: "Swimming in the shadow of Scottish castles ", date: "2026-08-25", time: "05:00", url: "https://www.ft.com/content/126eeb20-a403-46cf-8ec0-680c10dd84ad" },
  { id: "67c74e64-5c37-4a5d-ae6c-d3c002f99628", title: "Scott Bessent threatens wider US sanctions on Iran’s economic partners", date: "2026-08-24", time: "18:30", url: "https://www.ft.com/content/67c74e64-5c37-4a5d-ae6c-d3c002f99628" },
  { id: "b0b233bd-882b-43a9-b55f-e2cf33ec09b7", title: "Andy Burnham rules out early election as he admits UK faces ‘challenging’ financial outlook", date: "2026-08-24", time: "18:24", url: "https://www.ft.com/content/b0b233bd-882b-43a9-b55f-e2cf33ec09b7" },
  { id: "d6c9e705-ef30-4896-880b-8e88941e0f58", title: "Treasury market interventions are only a band-aid", date: "2026-08-24", time: "18:16", url: "https://www.ft.com/content/d6c9e705-ef30-4896-880b-8e88941e0f58" },
  { id: "3d46e4cb-4dee-4f49-adc1-0bb0f63d4c49", title: "UK seeks to tighten security of supply chains after Iran-linked cyber attack", date: "2026-08-24", time: "18:13", url: "https://www.ft.com/content/3d46e4cb-4dee-4f49-adc1-0bb0f63d4c49" },
  { id: "063dbdd2-fb5a-4ece-9152-74e791e4835c", title: "Britain gains access to Ukraine battlefield data", date: "2026-08-24", time: "18:00", url: "https://www.ft.com/content/063dbdd2-fb5a-4ece-9152-74e791e4835c" },
  { id: "dcf20385-21a5-4328-9bc6-98a666caaaf6", title: "Meloni wants a snap election to hide her economic failures", date: "2026-08-24", time: "18:00", url: "https://www.ft.com/content/dcf20385-21a5-4328-9bc6-98a666caaaf6" },
  { id: "29f1af13-ecc3-4f26-a479-e6088c67231b", title: "US midterm elections 2026: The FT’s guide", date: "2026-08-24", time: "16:15", url: "https://www.ft.com/content/29f1af13-ecc3-4f26-a479-e6088c67231b" },
  { id: "7522bdde-49f8-4bf0-a930-6591b40eb5e4", title: "Canadian businesses fear ‘vortex of downward pressures’ from Donald Trump’s tariffs", date: "2026-08-24", time: "16:05", url: "https://www.ft.com/content/7522bdde-49f8-4bf0-a930-6591b40eb5e4" },
  { id: "5c8aaa6d-5170-4688-beeb-f1319e5ff29e", title: "How Shein’s IPO lost its shine", date: "2026-08-24", time: "16:00", url: "https://www.ft.com/content/5c8aaa6d-5170-4688-beeb-f1319e5ff29e" },
  { id: "552b8fca-6dad-4b41-a0be-54d2cd70e3cb", title: "Keir Starmer considered letting 100,000 young Europeans come to UK every year", date: "2026-08-24", time: "15:14", url: "https://www.ft.com/content/552b8fca-6dad-4b41-a0be-54d2cd70e3cb" },
  { id: "52978bad-2b91-41e3-be94-7fb6776fbb91", title: "Trump says US to increase tariffs on Canadian cars to 50%", date: "2026-08-24", time: "14:55", url: "https://www.ft.com/content/52978bad-2b91-41e3-be94-7fb6776fbb91" },
  { id: "34c145b1-651a-4725-a65f-ea594a49ea06", title: "As dieters slim down, protein prices bulk up", date: "2026-08-24", time: "14:39", url: "https://www.ft.com/content/34c145b1-651a-4725-a65f-ea594a49ea06" },
  { id: "21190130-bb8e-460e-b64c-ef1532f6c673", title: "Reform UK’s ‘Farage Fest’ went ahead without permission from council", date: "2026-08-24", time: "14:02", url: "https://www.ft.com/content/21190130-bb8e-460e-b64c-ef1532f6c673" },
  { id: "f16e4ad3-d61f-4b98-b427-c5bcb1df1972", title: "Class wars and the midterms", date: "2026-08-24", time: "14:00", url: "https://www.ft.com/content/f16e4ad3-d61f-4b98-b427-c5bcb1df1972" },
  { id: "94d78bef-d118-420b-85a0-b1e5bcaf2405", title: "FT Financial Literacy and Inclusion Campaign", date: "2026-08-24", time: "13:06", url: "https://www.ft.com/content/94d78bef-d118-420b-85a0-b1e5bcaf2405" },
  { id: "7a9f5756-bf18-4a42-80d1-653c955447aa", title: "High asset prices, not low interest rates, are driving inflation", date: "2026-08-24", time: "13:00", url: "https://www.ft.com/content/7a9f5756-bf18-4a42-80d1-653c955447aa" },
];
