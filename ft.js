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
  { id: "92a1f269-2832-4bcd-aad6-629fd86dda0f", title: "Burnham urged not to snub Commonwealth summit amid reparations demands", date: "2026-09-10", time: "18:47", url: "https://www.ft.com/content/92a1f269-2832-4bcd-aad6-629fd86dda0f" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-09-10", time: "18:31", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
  { id: "75ba3055-625c-4cb5-894b-0696a38f5e79", title: "Latest Isa rates", date: "2026-09-10", time: "18:28", url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79" },
  { id: "68b36b6d-71e7-4f44-bbfb-a202e36603a4", title: "Latest National Savings & Investments rates", date: "2026-09-10", time: "18:24", url: "https://www.ft.com/content/68b36b6d-71e7-4f44-bbfb-a202e36603a4" },
  { id: "7410c56e-5350-48f8-a5e6-24f37c1581e9", title: "Stanley Druckenmiller says US borrowing costs still ‘a little low’ despite surge in yields", date: "2026-09-10", time: "18:21", url: "https://www.ft.com/content/7410c56e-5350-48f8-a5e6-24f37c1581e9" },
  { id: "cc99c301-8c5d-4014-889e-8eb374d993f9", title: "Apple’s big goal after foldable iPhone", date: "2026-09-10", time: "18:12", url: "https://www.ft.com/content/cc99c301-8c5d-4014-889e-8eb374d993f9" },
  { id: "f1542280-1e6e-40ea-ac7f-83a5866a19f2", title: "Shabana Mahmood demands ‘effective police action’ ahead of UK anti-immigration protests", date: "2026-09-10", time: "18:02", url: "https://www.ft.com/content/f1542280-1e6e-40ea-ac7f-83a5866a19f2" },
  { id: "d3fe6f10-d03e-4580-b033-1fd39f9f8f97", title: "British man admits inventing fake takeover bid for Canadian oil explorer", date: "2026-09-10", time: "17:51", url: "https://www.ft.com/content/d3fe6f10-d03e-4580-b033-1fd39f9f8f97" },
  { id: "6508d169-35b1-4e56-a29a-57911d9123d8", title: "Say goodbye to the SaaSpocalypse and hello to the RenaiSaaS", date: "2026-09-10", time: "17:35", url: "https://www.ft.com/content/6508d169-35b1-4e56-a29a-57911d9123d8" },
  { id: "f9969f50-b2bb-4a8b-933b-1e39932d6e27", title: "Reform candidate for London mayor said Tories ‘should have borrowed and borrowed’", date: "2026-09-10", time: "17:23", url: "https://www.ft.com/content/f9969f50-b2bb-4a8b-933b-1e39932d6e27" },
  { id: "e7a8a9fa-0dc2-41df-890c-9628efac54fd", title: "Vantage Data Centers seeks $2bn in loans from Pimco and PGIM", date: "2026-09-10", time: "17:04", url: "https://www.ft.com/content/e7a8a9fa-0dc2-41df-890c-9628efac54fd" },
  { id: "a3cb053b-08eb-43c5-8cc4-9c4c22fbf529", title: "Ourselves Alone: a partial glimpse inside Ireland’s Sinn Féin", date: "2026-09-10", time: "17:00", url: "https://www.ft.com/content/a3cb053b-08eb-43c5-8cc4-9c4c22fbf529" },
  { id: "aa78428b-747f-4486-bac5-e3500386abaf", title: "Spain’s new citizenship law to spark fresh tensions with Morocco", date: "2026-09-10", time: "16:57", url: "https://www.ft.com/content/aa78428b-747f-4486-bac5-e3500386abaf" },
  { id: "7816ad68-58ed-494c-a66f-091a9cca2cbc", title: "ECB prepares for ‘longer-lasting’ inflation as it lifts interest rates to 2.5%", date: "2026-09-10", time: "16:18", url: "https://www.ft.com/content/7816ad68-58ed-494c-a66f-091a9cca2cbc" },
  { id: "a441ea66-329a-4f42-8e50-3ff140958e53", title: "America is losing its captive creditors", date: "2026-09-10", time: "16:08", url: "https://www.ft.com/content/a441ea66-329a-4f42-8e50-3ff140958e53" },
  { id: "30e384f2-7aee-4dca-a97f-cb2ebf3c29b4", title: "Why young Africans are nostalgic for the past", date: "2026-09-10", time: "16:00", url: "https://www.ft.com/content/30e384f2-7aee-4dca-a97f-cb2ebf3c29b4" },
  { id: "7072bdc1-49d0-47c3-875b-4b1508e24481", title: "Burnham’s devolution project needs strong local media too", date: "2026-09-10", time: "15:33", url: "https://www.ft.com/content/7072bdc1-49d0-47c3-875b-4b1508e24481" },
  { id: "c090f503-1299-4f33-8539-79bbfb50c21b", title: "British man charged with volunteering to sabotage UK drone factory for Russia", date: "2026-09-10", time: "15:04", url: "https://www.ft.com/content/c090f503-1299-4f33-8539-79bbfb50c21b" },
  { id: "49e8c693-0064-4ef9-917f-5f2be97458fc", title: "Global bond sell-off reignites as oil jumps above $105", date: "2026-09-10", time: "14:44", url: "https://www.ft.com/content/49e8c693-0064-4ef9-917f-5f2be97458fc" },
  { id: "cd652b20-1fa3-4a51-bea7-4d7e33b1eaa2", title: "Houthis capture Red Sea port in blow to Saudis", date: "2026-09-10", time: "14:36", url: "https://www.ft.com/content/cd652b20-1fa3-4a51-bea7-4d7e33b1eaa2" },
  { id: "11f0fe2f-bf72-4760-a2df-1a3b5405173f", title: "Scott Bessent continues crusade against rising US government bond yields", date: "2026-09-10", time: "14:00", url: "https://www.ft.com/content/11f0fe2f-bf72-4760-a2df-1a3b5405173f" },
  { id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2", title: "Inflation and interest rates tracker: see how your country compares", date: "2026-09-10", time: "13:57", url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2" },
  { id: "a98cb11f-e665-46ee-9ac5-0f85ec73e3b2", title: "European Central Bank raises interest rates with hawkish guidance", date: "2026-09-10", time: "13:45", url: "https://www.ft.com/content/a98cb11f-e665-46ee-9ac5-0f85ec73e3b2" },
  { id: "683a6973-ad54-42e1-8b53-f0e294d15022", title: "Saudi Arabia cuts oil output to lowest this year on Houthi threats", date: "2026-09-10", time: "13:06", url: "https://www.ft.com/content/683a6973-ad54-42e1-8b53-f0e294d15022" },
  { id: "bb42e8fa-aa7e-4410-9f7b-42cd6115d8fb", title: "How to teach the next generation in the era of AI", date: "2026-09-10", time: "13:00", url: "https://www.ft.com/content/bb42e8fa-aa7e-4410-9f7b-42cd6115d8fb" },
  { id: "bfb9323d-2555-41b6-ba2c-a26335f94f95", title: "Exit Party by Emily St John Mandel — all-too-plausible visions of dystopia", date: "2026-09-10", time: "12:15", url: "https://www.ft.com/content/bfb9323d-2555-41b6-ba2c-a26335f94f95" },
  { id: "b1141d4b-e2f6-409e-8a74-1ce8d38f7d6a", title: "Israel’s hapless British defenders", date: "2026-09-10", time: "12:05", url: "https://www.ft.com/content/b1141d4b-e2f6-409e-8a74-1ce8d38f7d6a" },
  { id: "b05629bb-0c2d-419c-a3a2-910a811ac0a9", title: "Big Tech has replaced Big Oil as Public Enemy No 1, says US shale boss", date: "2026-09-10", time: "12:00", url: "https://www.ft.com/content/b05629bb-0c2d-419c-a3a2-910a811ac0a9" },
  { id: "796f0045-d300-4e22-be82-fa9a111fb634", title: "Is now really the time to worry about a new China shock?", date: "2026-09-10", time: "12:00", url: "https://www.ft.com/content/796f0045-d300-4e22-be82-fa9a111fb634" },
  { id: "360dfa5f-1ed8-441e-b926-486af101be17", title: "Foreign Office to appoint first female head after Mandelson turmoil", date: "2026-09-10", time: "11:58", url: "https://www.ft.com/content/360dfa5f-1ed8-441e-b926-486af101be17" },
  { id: "718a525e-d6d8-4944-b149-95c57212c168", title: "UK banks don’t have a windfall to tax", date: "2026-09-10", time: "11:37", url: "https://www.ft.com/content/718a525e-d6d8-4944-b149-95c57212c168" },
  { id: "a4b8c8ac-56cf-4f6e-9050-4292f37252ad", title: "Ryanair investors revolt over Michael O’Leary’s €150mn pay deal", date: "2026-09-10", time: "11:19", url: "https://www.ft.com/content/a4b8c8ac-56cf-4f6e-9050-4292f37252ad" },
  { id: "25e31948-c429-4c46-8465-72220b7e2e53", title: "New AI health tools need ‘L-plates’, says UK review", date: "2026-09-10", time: "11:15", url: "https://www.ft.com/content/25e31948-c429-4c46-8465-72220b7e2e53" },
  { id: "63e733d1-2c0f-46c5-ae6b-de1a72d4e9df", title: "HSBC finance chief Pam Kaur to step down by 2027", date: "2026-09-10", time: "11:04", url: "https://www.ft.com/content/63e733d1-2c0f-46c5-ae6b-de1a72d4e9df" },
  { id: "f5f7fde0-9623-4aca-b5df-31c6cab830bb", title: "Rose Chalalai Singh’s dinner with the dervishes", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/f5f7fde0-9623-4aca-b5df-31c6cab830bb" },
  { id: "a2aaa848-92c3-4f7a-b758-5858bfb29e70", title: "Latham & Watkins buys Nvidia servers to set up in-house AI systems", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/a2aaa848-92c3-4f7a-b758-5858bfb29e70" },
  { id: "362b3139-b0de-42f1-83db-67d4572a66ce", title: "On Europe’s economy, let’s ditch the lazy stereotypes", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/362b3139-b0de-42f1-83db-67d4572a66ce" },
  { id: "735fbed6-850f-4bd3-a0f6-ae762c2680be", title: "The capital wars are coming", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/735fbed6-850f-4bd3-a0f6-ae762c2680be" },
  { id: "8a0bc64f-44c7-4811-8e68-fb17c0a6ae28", title: "Donald Trump’s US coal revival push fails to reverse fuel’s long decline", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/8a0bc64f-44c7-4811-8e68-fb17c0a6ae28" },
  { id: "3382efba-83fe-41b2-aaab-c3c50d5f7df4", title: "Franklin Templeton turns the tide as Western Asset crisis recedes", date: "2026-09-10", time: "11:00", url: "https://www.ft.com/content/3382efba-83fe-41b2-aaab-c3c50d5f7df4" },
];
