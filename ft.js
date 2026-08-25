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
  { id: "1b066355-4412-43bd-b832-74956d3c0a52", title: "Foot Locker owner plunges after warning nervous consumers are cutting spending", date: "2026-08-25", time: "16:29", url: "https://www.ft.com/content/1b066355-4412-43bd-b832-74956d3c0a52" },
  { id: "7588a11f-ff57-4c1a-b4cf-2a55a6d8c6b2", title: "The drip-drip US debt crisis", date: "2026-08-25", time: "16:20", url: "https://www.ft.com/content/7588a11f-ff57-4c1a-b4cf-2a55a6d8c6b2" },
  { id: "7a83b577-8d67-4435-9798-1e53d7fad4e9", title: "Sizewell C access roads project delayed after contractor dropped", date: "2026-08-25", time: "16:03", url: "https://www.ft.com/content/7a83b577-8d67-4435-9798-1e53d7fad4e9" },
  { id: "7ced71c2-03b8-4569-a68d-14624a7e83f2", title: "Canada announces $20bn retaliatory tariffs as US trade war escalates", date: "2026-08-25", time: "16:03", url: "https://www.ft.com/content/7ced71c2-03b8-4569-a68d-14624a7e83f2" },
  { id: "3b7ac1fe-4761-4b4a-8fff-95c8c28566b9", title: "'Embarrassing': Republicans and ex-military leaders recoil at Trump officials' Canada attacks", date: "2026-08-25", time: "15:55", url: "https://www.ft.com/content/3b7ac1fe-4761-4b4a-8fff-95c8c28566b9" },
  { id: "7a889a33-1af5-4704-a57f-7890d169d94e", title: "Boss of Trump Jr-backed start-up donated to Republicans after winning US contract", date: "2026-08-25", time: "15:25", url: "https://www.ft.com/content/7a889a33-1af5-4704-a57f-7890d169d94e" },
  { id: "21ef2743-2cc2-41ef-8329-84adce69d975", title: "Waymo picks Munich for first EU robotaxi launch", date: "2026-08-25", time: "15:00", url: "https://www.ft.com/content/21ef2743-2cc2-41ef-8329-84adce69d975" },
  { id: "b6009dd2-7e97-4bbc-941d-cd0b8fc046b6", title: "Can Trump’s ‘economic D-day’ force Iran to capitulate?", date: "2026-08-25", time: "14:58", url: "https://www.ft.com/content/b6009dd2-7e97-4bbc-941d-cd0b8fc046b6" },
  { id: "b7a62337-c0f8-41f2-b4d4-7afbe6d63af1", title: "Scott Bessent fires warning shot at Iran’s economic partners", date: "2026-08-25", time: "14:00", url: "https://www.ft.com/content/b7a62337-c0f8-41f2-b4d4-7afbe6d63af1" },
  { id: "2a5ddf7f-ca14-4073-af2b-eaf79ffbabe8", title: "Jackson Hole could further formalise emerging Fed-Treasury accord", date: "2026-08-25", time: "12:30", url: "https://www.ft.com/content/2a5ddf7f-ca14-4073-af2b-eaf79ffbabe8" },
  { id: "5811d9e6-f48d-43ac-bc05-c273287a27d0", title: "Store water and tinned food to prepare for emergencies, UK citizens to be told", date: "2026-08-25", time: "12:20", url: "https://www.ft.com/content/5811d9e6-f48d-43ac-bc05-c273287a27d0" },
  { id: "6b396499-d71d-4e8f-b2a4-66318b1d9426", title: "Germany on track for strongest GDP growth since 2022", date: "2026-08-25", time: "12:06", url: "https://www.ft.com/content/6b396499-d71d-4e8f-b2a4-66318b1d9426" },
  { id: "3e54336f-cffc-44b7-947d-59f6e4999de1", title: "How extreme weather threatens energy security — from jellyfish swarms to ‘Super El Niño’", date: "2026-08-25", time: "12:00", url: "https://www.ft.com/content/3e54336f-cffc-44b7-947d-59f6e4999de1" },
  { id: "42323310-3dba-4703-9aa4-77ae40d6c3d0", title: "Deutsche banker charged with embezzling €600,000 from wealthy clients", date: "2026-08-25", time: "11:48", url: "https://www.ft.com/content/42323310-3dba-4703-9aa4-77ae40d6c3d0" },
  { id: "c63adc81-43ca-4f2d-9593-95fda8813a16", title: "Aston Martin creditors file for information ahead of UK suit against carmaker", date: "2026-08-25", time: "11:42", url: "https://www.ft.com/content/c63adc81-43ca-4f2d-9593-95fda8813a16" },
  { id: "875bc9d9-4bcf-4494-94b2-993dfe44d8e1", title: "Tokio Marine plots multibillion-dollar deal after Berkshire takes stake", date: "2026-08-25", time: "11:41", url: "https://www.ft.com/content/875bc9d9-4bcf-4494-94b2-993dfe44d8e1" },
  { id: "18c7de31-a049-4533-bbeb-6ba6e2a096b2", title: "Andy Burnham set for first meeting with Trump in September", date: "2026-08-25", time: "11:36", url: "https://www.ft.com/content/18c7de31-a049-4533-bbeb-6ba6e2a096b2" },
  { id: "d926671a-4f27-44f3-a2bf-4a0743c67534", title: "Another drone found at Leipzig airport as Germany warns of ‘unscrupulous’ attacks", date: "2026-08-25", time: "11:16", url: "https://www.ft.com/content/d926671a-4f27-44f3-a2bf-4a0743c67534" },
  { id: "58142179-593e-4525-bc4e-4c3f766a1a3a", title: "Embattled housebuilder Vistry boosted by £350mn UK government contract", date: "2026-08-25", time: "10:54", url: "https://www.ft.com/content/58142179-593e-4525-bc4e-4c3f766a1a3a" },
  { id: "b532ed0f-af32-4b56-8a5a-f13d4b6eb8c4", title: "And the FTAV Friday charts quiz winner is . . . ", date: "2026-08-25", time: "10:46", url: "https://www.ft.com/content/b532ed0f-af32-4b56-8a5a-f13d4b6eb8c4" },
  { id: "d8162910-af1e-4a8a-93e5-a3309252337d", title: "UK backs Devon tungsten mine in effort to secure critical mineral supplies", date: "2026-08-25", time: "10:35", url: "https://www.ft.com/content/d8162910-af1e-4a8a-93e5-a3309252337d" },
  { id: "aa7ba671-8175-4b53-b6a5-28803a851493", title: "China warns US it could retaliate over Iran sanctions", date: "2026-08-25", time: "10:27", url: "https://www.ft.com/content/aa7ba671-8175-4b53-b6a5-28803a851493" },
  { id: "9d61ca14-6939-4efa-a6fe-0ec1b283d77a", title: "Bessent gets Drucked", date: "2026-08-25", time: "10:17", url: "https://www.ft.com/content/9d61ca14-6939-4efa-a6fe-0ec1b283d77a" },
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
];
