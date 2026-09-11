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
  { id: "fbcfcd21-f34f-41ca-b6b9-76b415f8d54e", title: "Stockpickers: Rosebank Industries, SigmaRoc, Ashmore", date: "2026-09-11", time: "18:00", url: "https://www.ft.com/content/fbcfcd21-f34f-41ca-b6b9-76b415f8d54e" },
  { id: "c3740cd0-3c4c-44d0-b3e8-4ccb1bac65b0", title: "Is Scott Bessent winning the wrong battle in markets?", date: "2026-09-11", time: "18:00", url: "https://www.ft.com/content/c3740cd0-3c4c-44d0-b3e8-4ccb1bac65b0" },
  { id: "cde3c168-5522-4d38-a6c3-454ef36aa0d4", title: "Directors’ Deals: Shell’s upstream boss takes advantage of valuation uplift", date: "2026-09-11", time: "18:00", url: "https://www.ft.com/content/cde3c168-5522-4d38-a6c3-454ef36aa0d4" },
  { id: "dd4cc4a0-844e-486a-b99c-b379d457019b", title: "Scott Bessent fails to break ‘fever’ in US bond market", date: "2026-09-11", time: "17:56", url: "https://www.ft.com/content/dd4cc4a0-844e-486a-b99c-b379d457019b" },
  { id: "3ad0a45f-ae93-4854-8b61-b933a93ee159", title: "FTAV’s Friday charts quiz", date: "2026-09-11", time: "17:54", url: "https://www.ft.com/content/3ad0a45f-ae93-4854-8b61-b933a93ee159" },
  { id: "b087d8e6-db04-4db6-8308-7275a40df5fb", title: "UK delays Jackdaw gasfield decision until after by-election in Starmer seat", date: "2026-09-11", time: "17:50", url: "https://www.ft.com/content/b087d8e6-db04-4db6-8308-7275a40df5fb" },
  { id: "e070149c-70a4-41ee-a829-0630abb2ce35", title: "Military jet triggered UK’s latest air traffic meltdown", date: "2026-09-11", time: "17:26", url: "https://www.ft.com/content/e070149c-70a4-41ee-a829-0630abb2ce35" },
  { id: "bbdad57e-bd57-4c75-98b8-12fca7cbd268", title: "America remembers: twenty-five years after 9/11", date: "2026-09-11", time: "17:19", url: "https://www.ft.com/content/bbdad57e-bd57-4c75-98b8-12fca7cbd268" },
  { id: "b7fe0fe0-0463-4f55-9590-0a7d08d8fe66", title: "Why the AI race has its creators fearing human extinction", date: "2026-09-11", time: "17:11", url: "https://www.ft.com/content/b7fe0fe0-0463-4f55-9590-0a7d08d8fe66" },
  { id: "df2d9bcc-59f9-4122-aa4d-2020bef77e0e", title: "Iran and Gulf states to meet in push for Hormuz deal", date: "2026-09-11", time: "17:03", url: "https://www.ft.com/content/df2d9bcc-59f9-4122-aa4d-2020bef77e0e" },
  { id: "cf77ca45-6e16-4232-836b-714293619822", title: "Monetary Policy Radar preview: BoE’s September meeting", date: "2026-09-11", time: "16:34", url: "https://www.ft.com/content/cf77ca45-6e16-4232-836b-714293619822" },
  { id: "d7f197dd-a39a-43dc-a2f9-6204c5876e76", title: "How both sides lost after 9/11", date: "2026-09-11", time: "16:34", url: "https://www.ft.com/content/d7f197dd-a39a-43dc-a2f9-6204c5876e76" },
  { id: "ce0606e7-3b6c-4475-a5c4-71d70e54383c", title: "Bond trouble", date: "2026-09-11", time: "16:30", url: "https://www.ft.com/content/ce0606e7-3b6c-4475-a5c4-71d70e54383c" },
  { id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2", title: "Inflation and interest rates tracker: see how your country compares", date: "2026-09-11", time: "15:45", url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2" },
  { id: "25102821-d86d-4ef0-a858-903e270df3f9", title: "Higher than expected core CPI gives Fed enough to tighten", date: "2026-09-11", time: "14:53", url: "https://www.ft.com/content/25102821-d86d-4ef0-a858-903e270df3f9" },
  { id: "2c9ce5b0-32ae-4460-aa89-9c80eb05ee41", title: "Bond markets stabilise after global sell-off", date: "2026-09-11", time: "14:22", url: "https://www.ft.com/content/2c9ce5b0-32ae-4460-aa89-9c80eb05ee41" },
  { id: "686b06a7-a041-49dc-88b1-2607a3ba8e11", title: "What we still haven’t learnt from 9/11", date: "2026-09-11", time: "14:00", url: "https://www.ft.com/content/686b06a7-a041-49dc-88b1-2607a3ba8e11" },
  { id: "4e1c7760-b716-47a9-bc08-064d13b936df", title: "The AfD won’t stop with Saxony-Anhalt", date: "2026-09-11", time: "14:00", url: "https://www.ft.com/content/4e1c7760-b716-47a9-bc08-064d13b936df" },
  { id: "780d08a9-1ae9-4d36-94e6-a7e2e38b1314", title: "Will Burnham grasp the urgent need to defend the UK?", date: "2026-09-11", time: "14:00", url: "https://www.ft.com/content/780d08a9-1ae9-4d36-94e6-a7e2e38b1314" },
  { id: "24646e74-9506-4718-b1be-789208db86d9", title: "US inflation held steady at 3.4% in August as high fuel prices persist", date: "2026-09-11", time: "13:55", url: "https://www.ft.com/content/24646e74-9506-4718-b1be-789208db86d9" },
  { id: "f08d9848-ca55-4e39-af14-91e770d39a5d", title: "Reader callout: What is the outlook for buy-to-let investors?", date: "2026-09-11", time: "13:42", url: "https://www.ft.com/content/f08d9848-ca55-4e39-af14-91e770d39a5d" },
  { id: "970b007d-3ce9-452a-bba7-f0163be0522f", title: "Claude thinks I’m an investment dunce", date: "2026-09-11", time: "13:33", url: "https://www.ft.com/content/970b007d-3ce9-452a-bba7-f0163be0522f" },
  { id: "976fa0d6-ed09-4a6f-be02-ff4317b45f40", title: "Houthis seize Red Sea islands in lightning offensive", date: "2026-09-11", time: "13:26", url: "https://www.ft.com/content/976fa0d6-ed09-4a6f-be02-ff4317b45f40" },
  { id: "d8127be2-633e-415d-8e5f-82981ad551d4", title: "Vladimir Putin given friendly reception at India Brics summit", date: "2026-09-11", time: "13:05", url: "https://www.ft.com/content/d8127be2-633e-415d-8e5f-82981ad551d4" },
  { id: "d470e9dd-760c-46ae-93ec-014b59160b37", title: "France’s debt interest bill to jump 25% this year", date: "2026-09-11", time: "12:35", url: "https://www.ft.com/content/d470e9dd-760c-46ae-93ec-014b59160b37" },
  { id: "03686827-1e80-4796-90ad-8e2d5318c0a5", title: "The day Warren Buffett saved Salomon Brothers", date: "2026-09-11", time: "12:31", url: "https://www.ft.com/content/03686827-1e80-4796-90ad-8e2d5318c0a5" },
  { id: "fb4dec4d-8c25-4ba6-bdc9-d993739ca986", title: "Soho House founder Nick Jones: ‘We were never trying to be exclusive’", date: "2026-09-11", time: "12:30", url: "https://www.ft.com/content/fb4dec4d-8c25-4ba6-bdc9-d993739ca986" },
  { id: "4fccbee7-49a3-4d4f-887a-db8b44c6e0c3", title: "AI: Is Britain prepared?", date: "2026-09-11", time: "12:29", url: "https://www.ft.com/content/4fccbee7-49a3-4d4f-887a-db8b44c6e0c3" },
  { id: "43122dc1-0340-4ec0-a7f4-4d198901317f", title: "Zack Polanski faces uphill battle in Keir Starmer’s former seat", date: "2026-09-11", time: "12:13", url: "https://www.ft.com/content/43122dc1-0340-4ec0-a7f4-4d198901317f" },
  { id: "bcffd7aa-d9fc-4ae3-bf3e-c121d50a7d6d", title: "Time to start taking AI risks seriously", date: "2026-09-11", time: "12:01", url: "https://www.ft.com/content/bcffd7aa-d9fc-4ae3-bf3e-c121d50a7d6d" },
  { id: "e396d7c6-9301-49e3-9e5d-6348650a1a98", title: "‘Manchester is an opportunity’: but for whom?", date: "2026-09-11", time: "12:00", url: "https://www.ft.com/content/e396d7c6-9301-49e3-9e5d-6348650a1a98" },
  { id: "7274da64-f1ad-47aa-811f-680f76d3b18c", title: "Ex-Goodwin lawyer pleads not guilty to insider trading in London", date: "2026-09-11", time: "11:34", url: "https://www.ft.com/content/7274da64-f1ad-47aa-811f-680f76d3b18c" },
  { id: "41fcad5f-054c-4b8b-8796-bcccaf9ae489", title: "FirstFT: Remembering the victims of 9/11", date: "2026-09-11", time: "11:23", url: "https://www.ft.com/content/41fcad5f-054c-4b8b-8796-bcccaf9ae489" },
  { id: "45ba5468-87fa-4afb-8c35-ff27579109d3", title: "Hong Kong sentences Tiananmen vigil organisers to prison", date: "2026-09-11", time: "11:10", url: "https://www.ft.com/content/45ba5468-87fa-4afb-8c35-ff27579109d3" },
  { id: "7aa19beb-db39-46dd-8979-0c32c51ed53b", title: "KPMG under investigation over audits for Prax’s State Oil arm", date: "2026-09-11", time: "11:00", url: "https://www.ft.com/content/7aa19beb-db39-46dd-8979-0c32c51ed53b" },
  { id: "db6974e5-0088-4dde-b455-2275033d9438", title: "Ukrainian Lessons by Charlotte Higgins — culture war", date: "2026-09-11", time: "11:00", url: "https://www.ft.com/content/db6974e5-0088-4dde-b455-2275033d9438" },
  { id: "fe5cd1b4-5131-4dca-a728-4bc7df90d6df", title: "Tiny snail stalls Donald Trump’s Irish golf ambitions", date: "2026-09-11", time: "11:00", url: "https://www.ft.com/content/fe5cd1b4-5131-4dca-a728-4bc7df90d6df" },
  { id: "b9a48a1b-5896-46fb-91a1-d7beb18a64b7", title: "The day that blew America and the world off course", date: "2026-09-11", time: "11:00", url: "https://www.ft.com/content/b9a48a1b-5896-46fb-91a1-d7beb18a64b7" },
  { id: "1dbb63ef-359b-410e-8e86-5cd2df59fc3d", title: "Anglo nickel deal tests EU resolve over Chinese control of resources", date: "2026-09-11", time: "10:59", url: "https://www.ft.com/content/1dbb63ef-359b-410e-8e86-5cd2df59fc3d" },
  { id: "495e1b57-9b1a-483d-b776-3ac4aa05764c", title: "Desperately seeking UK data centre data", date: "2026-09-11", time: "10:17", url: "https://www.ft.com/content/495e1b57-9b1a-483d-b776-3ac4aa05764c" },
];
