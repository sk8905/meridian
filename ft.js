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
  { id: "41fb2ff1-fb84-4ae4-8668-59d46842dcdb", title: "Citadel hands international equities leadership to Elliott veteran Nabeel Bhanji", date: "2026-09-11", time: "09:04", url: "https://www.ft.com/content/41fb2ff1-fb84-4ae4-8668-59d46842dcdb" },
  { id: "ebfa69a3-323b-450d-8bfd-0b12e01d2a5b", title: "US diesel hits record $6 a gallon on Iran supply shock", date: "2026-09-11", time: "08:56", url: "https://www.ft.com/content/ebfa69a3-323b-450d-8bfd-0b12e01d2a5b" },
  { id: "e1aacb1c-45d1-4d21-b5e9-0166c12c54cd", title: "UK economy unexpectedly grew 0.4 per cent in July", date: "2026-09-11", time: "07:02", url: "https://www.ft.com/content/e1aacb1c-45d1-4d21-b5e9-0166c12c54cd" },
  { id: "f7ca7904-b0d8-428b-9bf7-883740ba9922", title: "Scott Bessent’s intervention risks damaging BoJ’s credibility, bankers warn", date: "2026-09-11", time: "06:51", url: "https://www.ft.com/content/f7ca7904-b0d8-428b-9bf7-883740ba9922" },
  { id: "a525a00f-231f-4376-9ca6-645ed956ea69", title: "Oil is scary again", date: "2026-09-11", time: "06:30", url: "https://www.ft.com/content/a525a00f-231f-4376-9ca6-645ed956ea69" },
  { id: "d8848ef1-e707-4b92-b46e-e3c289a6df19", title: "FTAV’s further reading", date: "2026-09-11", time: "06:30", url: "https://www.ft.com/content/d8848ef1-e707-4b92-b46e-e3c289a6df19" },
  { id: "819e34f5-7ba7-4cb3-942f-012d5fc501ce", title: "Macron shoots for the moon with pitch to Europe’s struggling space sector", date: "2026-09-11", time: "06:00", url: "https://www.ft.com/content/819e34f5-7ba7-4cb3-942f-012d5fc501ce" },
  { id: "48588acb-8026-4c8e-aac7-8b5588294dbf", title: "How big is the open-model threat to AI hyperscalers?", date: "2026-09-11", time: "06:00", url: "https://www.ft.com/content/48588acb-8026-4c8e-aac7-8b5588294dbf" },
  { id: "41fcad5f-054c-4b8b-8796-bcccaf9ae489", title: "FirstFT: Bessent fails to break bond market ‘fever’", date: "2026-09-11", time: "05:31", url: "https://www.ft.com/content/41fcad5f-054c-4b8b-8796-bcccaf9ae489" },
  { id: "b1b44515-1825-4164-ac83-659a74c9f553", title: "Trump-Vance’s US midterm pitch: vote Republican or live with the ‘lunatics’", date: "2026-09-11", time: "05:27", url: "https://www.ft.com/content/b1b44515-1825-4164-ac83-659a74c9f553" },
  { id: "2c9ce5b0-32ae-4460-aa89-9c80eb05ee41", title: "US rate rise fears ripple through global bond markets", date: "2026-09-11", time: "05:06", url: "https://www.ft.com/content/2c9ce5b0-32ae-4460-aa89-9c80eb05ee41" },
  { id: "4c4f948d-dedf-4eb1-addb-73581cc455e7", title: "Private equity’s ‘Waiting for Godot’ era continues", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/4c4f948d-dedf-4eb1-addb-73581cc455e7" },
  { id: "df2d9bcc-59f9-4122-aa4d-2020bef77e0e", title: "Iran and Gulf states to meet in push for Hormuz deal", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/df2d9bcc-59f9-4122-aa4d-2020bef77e0e" },
  { id: "38e0e6c6-0775-4f05-89e4-c02bbcf7008a", title: "Elon Musk’s gas turbines could shake up the backlogged sector", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/38e0e6c6-0775-4f05-89e4-c02bbcf7008a" },
  { id: "dd4cc4a0-844e-486a-b99c-b379d457019b", title: "Scott Bessent fails to break ‘fever’ in US bond market", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/dd4cc4a0-844e-486a-b99c-b379d457019b" },
  { id: "56a0085d-460d-45a1-a5a9-7dc862e826c0", title: "Virgin Media O2 owners target £600mn in cost cuts", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/56a0085d-460d-45a1-a5a9-7dc862e826c0" },
  { id: "de71f35d-37b2-4d4b-ae4a-489d454b74bf", title: "EU looks for new path to tap Russian assets for Ukraine", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/de71f35d-37b2-4d4b-ae4a-489d454b74bf" },
  { id: "3c6c225c-10d5-45b4-ad38-baacadcacad9", title: "First-time buyers load up on mortgage debt after change in lending rules", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/3c6c225c-10d5-45b4-ad38-baacadcacad9" },
  { id: "ad97a760-6ce9-4f96-bfd0-1d6921fdcbd0", title: "UK youth unemployment plan will not produce savings for years, warns Milburn", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/ad97a760-6ce9-4f96-bfd0-1d6921fdcbd0" },
  { id: "595b3b7e-1b6d-4fc2-99fa-8383c313b1eb", title: "Insurers Zurich and Allianz have exposure linked to Radiant World", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/595b3b7e-1b6d-4fc2-99fa-8383c313b1eb" },
  { id: "98bfd632-8778-4c48-97a0-ef78b11299cc", title: "Why Warsh is starting to bite back", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/98bfd632-8778-4c48-97a0-ef78b11299cc" },
  { id: "303ff813-fa48-417d-a44e-387c9e649ddf", title: "Time for the Brics", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/303ff813-fa48-417d-a44e-387c9e649ddf" },
  { id: "403933ff-4c4b-4809-b863-d61d0e061729", title: "Sanctions loophole lets UK insurer cover tankers carrying Russian gas", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/403933ff-4c4b-4809-b863-d61d0e061729" },
  { id: "bbdad57e-bd57-4c75-98b8-12fca7cbd268", title: "America remembers: twenty-five years after 9/11", date: "2026-09-11", time: "05:00", url: "https://www.ft.com/content/bbdad57e-bd57-4c75-98b8-12fca7cbd268" },
  { id: "083a9c4b-3913-496d-be13-22c96053624b", title: "Markets live: US Treasury yields rise to session highs after Scott Bessent’s buyback operation undershoots target", date: "2026-09-10", time: "19:49", url: "https://www.ft.com/content/083a9c4b-3913-496d-be13-22c96053624b" },
  { id: "a79892a3-c6c2-4c0b-8c3a-a37e9a32cf4f", title: "How would Donald Trump’s $5,000 voting payout work?", date: "2026-09-10", time: "19:26", url: "https://www.ft.com/content/a79892a3-c6c2-4c0b-8c3a-a37e9a32cf4f" },
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
];
