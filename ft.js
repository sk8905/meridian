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
  { id: "8310cf56-ce60-4e6e-8254-5bb470e9a880", title: "Yemeni militants used Anthropic AI to try to build ballistic missiles", date: "2026-09-11", time: "10:02", url: "https://www.ft.com/content/8310cf56-ce60-4e6e-8254-5bb470e9a880" },
  { id: "ab6f6433-1f23-4153-a02b-7984d14734c6", title: "IEA warns of ‘lost period’ in global oil demand", date: "2026-09-11", time: "09:37", url: "https://www.ft.com/content/ab6f6433-1f23-4153-a02b-7984d14734c6" },
  { id: "91a15b04-e7f5-4a44-8a2d-4bf1dfeffb20", title: "Andy Burnham’s blind spot", date: "2026-09-11", time: "09:30", url: "https://www.ft.com/content/91a15b04-e7f5-4a44-8a2d-4bf1dfeffb20" },
  { id: "95717e6f-2cc0-4d25-856d-2817008806ac", title: "The perfect impracticality of the ‘wow’ shoe", date: "2026-09-11", time: "09:30", url: "https://www.ft.com/content/95717e6f-2cc0-4d25-856d-2817008806ac" },
  { id: "f1333f1c-a459-4992-8681-996c7727a981", title: "Celia Birtwell on Hockney, Carmen rollers and the feathers of Moulin Rouge", date: "2026-09-11", time: "09:30", url: "https://www.ft.com/content/f1333f1c-a459-4992-8681-996c7727a981" },
  { id: "41fb2ff1-fb84-4ae4-8668-59d46842dcdb", title: "Citadel hands international equities leadership to Elliott veteran Nabeel Bhanji", date: "2026-09-11", time: "09:04", url: "https://www.ft.com/content/41fb2ff1-fb84-4ae4-8668-59d46842dcdb" },
  { id: "ebfa69a3-323b-450d-8bfd-0b12e01d2a5b", title: "US diesel hits record $6 a gallon on Iran supply shock", date: "2026-09-11", time: "08:56", url: "https://www.ft.com/content/ebfa69a3-323b-450d-8bfd-0b12e01d2a5b" },
  { id: "e1aacb1c-45d1-4d21-b5e9-0166c12c54cd", title: "UK economy unexpectedly grew 0.4 per cent in July", date: "2026-09-11", time: "07:02", url: "https://www.ft.com/content/e1aacb1c-45d1-4d21-b5e9-0166c12c54cd" },
  { id: "f7ca7904-b0d8-428b-9bf7-883740ba9922", title: "Scott Bessent’s intervention risks damaging BoJ’s credibility, bankers warn", date: "2026-09-11", time: "06:51", url: "https://www.ft.com/content/f7ca7904-b0d8-428b-9bf7-883740ba9922" },
  { id: "a525a00f-231f-4376-9ca6-645ed956ea69", title: "Oil is scary again", date: "2026-09-11", time: "06:30", url: "https://www.ft.com/content/a525a00f-231f-4376-9ca6-645ed956ea69" },
  { id: "d8848ef1-e707-4b92-b46e-e3c289a6df19", title: "FTAV’s further reading", date: "2026-09-11", time: "06:30", url: "https://www.ft.com/content/d8848ef1-e707-4b92-b46e-e3c289a6df19" },
  { id: "819e34f5-7ba7-4cb3-942f-012d5fc501ce", title: "Macron shoots for the moon with pitch to Europe’s struggling space sector", date: "2026-09-11", time: "06:00", url: "https://www.ft.com/content/819e34f5-7ba7-4cb3-942f-012d5fc501ce" },
  { id: "48588acb-8026-4c8e-aac7-8b5588294dbf", title: "How big is the open-model threat to AI hyperscalers?", date: "2026-09-11", time: "06:00", url: "https://www.ft.com/content/48588acb-8026-4c8e-aac7-8b5588294dbf" },
];
