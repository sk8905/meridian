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
  { id: "aa8a1be7-abe0-44b7-bcd3-31fd0a44de08", title: "Global AI stocks slip on concerns over risks", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/aa8a1be7-abe0-44b7-bcd3-31fd0a44de08" },
  { id: "904c6d93-a6b3-47f4-8b12-3d418cc74fa2", title: "Warsh and Trump on collision course as investors expect Fed to raise rates", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/904c6d93-a6b3-47f4-8b12-3d418cc74fa2" },
  { id: "130f45b6-ee45-4fa0-83eb-5ea8f9bc4680", title: "Essar strikes deal to buy 118 UK petrol stations", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/130f45b6-ee45-4fa0-83eb-5ea8f9bc4680" },
  { id: "0008bdb5-ac6c-4d72-b71f-e53a94a10f77", title: "A ‘lucky’ chancellor must also be a resolute one", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/0008bdb5-ac6c-4d72-b71f-e53a94a10f77" },
  { id: "a45a2f1f-03d9-46aa-8307-fe89edd7e589", title: "Tokenised gold could be exempt from fund regulations under FCA proposal", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/a45a2f1f-03d9-46aa-8307-fe89edd7e589" },
  { id: "639b4d2a-30c7-473c-a3ec-1fe96a7a7ac7", title: "How high might natural gas prices go?", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/639b4d2a-30c7-473c-a3ec-1fe96a7a7ac7" },
  { id: "203bc43f-8189-4156-b60d-28614e07245f", title: "Expanded ad ban on ‘less healthy’ foods could hit £1bn in UK media spending", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/203bc43f-8189-4156-b60d-28614e07245f" },
  { id: "898836da-322a-4bb8-9e62-f3c3d36b23b2", title: "European capitals barter over Christine Lagarde’s successor at ECB", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/898836da-322a-4bb8-9e62-f3c3d36b23b2" },
  { id: "cfcc5bc1-56cc-4e9f-8f0e-ef45932b76ab", title: "UK faces £258bn infrastructure spending gap, warns report", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/cfcc5bc1-56cc-4e9f-8f0e-ef45932b76ab" },
  { id: "050b2863-a164-431f-bd04-2e416adf9a38", title: "Oil price surge revives prospect of Bank of England rate rise this year", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/050b2863-a164-431f-bd04-2e416adf9a38" },
  { id: "d545bae1-d770-46f3-9913-07e85d4ae34c", title: "Cyber criminals use AI to supercharge scams, watchdog warns", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/d545bae1-d770-46f3-9913-07e85d4ae34c" },
  { id: "cf0ee7e3-8634-4c1d-8a44-3b71acee1417", title: "Euronext open to ‘big bang’ deal with rival Deutsche Börse", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/cf0ee7e3-8634-4c1d-8a44-3b71acee1417" },
  { id: "d805fcf8-e0ff-463f-bc1c-974f878fae43", title: "Start-up opens factory a mile from Tower Bridge amid defence surge", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/d805fcf8-e0ff-463f-bc1c-974f878fae43" },
  { id: "b15d9839-1d2e-4a38-9a5c-5424aeff2b3c", title: "Defence sales test Europe’s appetite for US investment", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/b15d9839-1d2e-4a38-9a5c-5424aeff2b3c" },
  { id: "8b704ae0-1fa2-4303-925f-170fa5d935b3", title: "‘Offensively cheap’: solar power is looking up", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/8b704ae0-1fa2-4303-925f-170fa5d935b3" },
  { id: "0688caee-f24f-4fa7-b04a-d1e8f9c0c03d", title: "Schroders considers acquisitions to grow wealth division", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/0688caee-f24f-4fa7-b04a-d1e8f9c0c03d" },
  { id: "76a24fc8-b521-47d6-aec9-1bf6666afd60", title: "Fed and BoJ expect rate hikes as US bond market flails", date: "2026-09-14", time: "05:00", url: "https://www.ft.com/content/76a24fc8-b521-47d6-aec9-1bf6666afd60" },
  { id: "00e3c084-06e3-47b4-8230-185760216e60", title: "Sweden’s left on course to retake power", date: "2026-09-13", time: "20:26", url: "https://www.ft.com/content/00e3c084-06e3-47b4-8230-185760216e60" },
  { id: "e3ba3f9a-9312-4d0b-99fd-2c80728f2dcd", title: "Trump calls on Ukraine to stop striking Russian diesel refineries", date: "2026-09-13", time: "20:08", url: "https://www.ft.com/content/e3ba3f9a-9312-4d0b-99fd-2c80728f2dcd" },
  { id: "9cd8cc79-e98a-449f-a903-609b034a56e3", title: "Canada seeks Ukraine loan role to deepen EU ties", date: "2026-09-13", time: "19:57", url: "https://www.ft.com/content/9cd8cc79-e98a-449f-a903-609b034a56e3" },
  { id: "7de7cc10-e7a5-414b-a40f-3296eaf49ce7", title: "Russians to vote, but the outcome is already decided", date: "2026-09-13", time: "18:15", url: "https://www.ft.com/content/7de7cc10-e7a5-414b-a40f-3296eaf49ce7" },
  { id: "d25e4152-afc5-4ff9-bfd9-3317413800ff", title: "Marine Le Pen vows to put French citizens first in campaign launch", date: "2026-09-13", time: "16:49", url: "https://www.ft.com/content/d25e4152-afc5-4ff9-bfd9-3317413800ff" },
  { id: "cae60732-f929-4735-a627-db8c14e7c7ed", title: "Donald Trump rejects calls from tech bosses for an AI slowdown", date: "2026-09-13", time: "16:42", url: "https://www.ft.com/content/cae60732-f929-4735-a627-db8c14e7c7ed" },
  { id: "182365c4-a0ac-4670-97e0-22e88d3bc02d", title: "EU-UK reset talks delayed again amid tension over ‘Made in Europe’ rules", date: "2026-09-13", time: "16:00", url: "https://www.ft.com/content/182365c4-a0ac-4670-97e0-22e88d3bc02d" },
  { id: "e56e5e77-f131-46ea-a756-9431f1908b7d", title: "Angela Rayner suggests political donations cap on table after Reform’s £72mn boost", date: "2026-09-13", time: "14:42", url: "https://www.ft.com/content/e56e5e77-f131-46ea-a756-9431f1908b7d" },
  { id: "b60624fb-0a09-45e6-b148-b7a5ca38f83e", title: "Iraq’s militias grow bolder in Iran war", date: "2026-09-13", time: "13:39", url: "https://www.ft.com/content/b60624fb-0a09-45e6-b148-b7a5ca38f83e" },
  { id: "d4604abb-d357-4ebd-b709-23902d1e1868", title: "The calculated desperation of Trump-a-palooza", date: "2026-09-13", time: "13:00", url: "https://www.ft.com/content/d4604abb-d357-4ebd-b709-23902d1e1868" },
  { id: "cdce9cd6-4857-4332-af34-ffc9ce45eadf", title: "Russia hits evacuated Kyiv-Warsaw train on line used by foreign leaders", date: "2026-09-13", time: "12:47", url: "https://www.ft.com/content/cdce9cd6-4857-4332-af34-ffc9ce45eadf" },
  { id: "dc5012ed-cb82-469e-9be8-e65ac7f6745c", title: "Why teenagers are doing worse at school", date: "2026-09-13", time: "12:00", url: "https://www.ft.com/content/dc5012ed-cb82-469e-9be8-e65ac7f6745c" },
  { id: "1fd5bbf6-9bb6-4848-a01b-7c94b3e59b6e", title: "Will the Fed defy Trump and raise rates?", date: "2026-09-13", time: "12:00", url: "https://www.ft.com/content/1fd5bbf6-9bb6-4848-a01b-7c94b3e59b6e" },
  { id: "d17cda71-1c35-4abd-b4d5-773550b109cc", title: "‘Trumpism’ spawns rare unity at Brics summit", date: "2026-09-13", time: "11:50", url: "https://www.ft.com/content/d17cda71-1c35-4abd-b4d5-773550b109cc" },
  { id: "c49c583f-940c-4592-ad7e-7c206b6c3c75", title: "Brazil banking scandal engulfs Supreme Court", date: "2026-09-13", time: "11:00", url: "https://www.ft.com/content/c49c583f-940c-4592-ad7e-7c206b6c3c75" },
  { id: "21b663e4-60ee-4937-a561-5b0f505676a2", title: "GE HealthCare in talks over $1bn deal for maker of cancer scan chemicals", date: "2026-09-13", time: "11:00", url: "https://www.ft.com/content/21b663e4-60ee-4937-a561-5b0f505676a2" },
  { id: "3204d65e-ae34-4ab3-a73f-a55d354f40ab", title: "Texas puts a brake on its data centre boom", date: "2026-09-13", time: "11:00", url: "https://www.ft.com/content/3204d65e-ae34-4ab3-a73f-a55d354f40ab" },
  { id: "2404d7db-002e-42d6-a746-183bb23c1234", title: "The coming robotaxi revolution", date: "2026-09-13", time: "11:00", url: "https://www.ft.com/content/2404d7db-002e-42d6-a746-183bb23c1234" },
  { id: "b11887d2-d40d-473d-ba5e-2f9fb8a73beb", title: "Trump’s vision of Alaska as LNG superpower confronts an $80bn test", date: "2026-09-13", time: "11:00", url: "https://www.ft.com/content/b11887d2-d40d-473d-ba5e-2f9fb8a73beb" },
  { id: "a491245d-6f6a-4218-9289-3fa8e43632ad", title: "Submit a question: What do British businesses need from the Budget?", date: "2026-09-13", time: "08:50", url: "https://www.ft.com/content/a491245d-6f6a-4218-9289-3fa8e43632ad" },
  { id: "183569b4-8102-4b38-8a20-a3597a442f26", title: "Boom-era PE funds will fall short on promises, executives warn", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/183569b4-8102-4b38-8a20-a3597a442f26" },
  { id: "b081fc93-3eb8-4adc-84cc-b5c5cf719003", title: "Sunderland football club looks to US post-industrial peers in bid to lift revenue", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/b081fc93-3eb8-4adc-84cc-b5c5cf719003" },
  { id: "7f01b434-0209-4783-b8eb-5a095ca5bd4f", title: "How Russia’s new drones are changing the air war", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/7f01b434-0209-4783-b8eb-5a095ca5bd4f" },
];
