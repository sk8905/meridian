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
  { id: "65181a27-bea2-4ac0-96df-2d0d8dfe0b58", title: "As Europe’s memory fades, radicalism is returning", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/65181a27-bea2-4ac0-96df-2d0d8dfe0b58" },
  { id: "681a9df8-ab39-4b9f-bc86-7dcf6f68a8c0", title: "Paris and Beirut push to extend UN peacekeepers’ mission in Lebanon", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/681a9df8-ab39-4b9f-bc86-7dcf6f68a8c0" },
  { id: "a4a22443-2082-409b-96e1-650c44a40f44", title: "CVC faces shareholder revolt over €10.7bn Recordati take-private", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/a4a22443-2082-409b-96e1-650c44a40f44" },
  { id: "f3ecfe7f-25df-434f-a61d-a9ce0ac1e611", title: "Why Britain’s super-rich are looking for the exit", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/f3ecfe7f-25df-434f-a61d-a9ce0ac1e611" },
  { id: "c765f312-e698-4d31-bf71-f64a656ad6f4", title: "Elon Musk’s secretive backer builds $40bn SpaceX stake", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/c765f312-e698-4d31-bf71-f64a656ad6f4" },
  { id: "7752631b-6064-4f90-b292-5425064dbaa8", title: "German military start-up seeks carmakers’ help to re-arm Europe", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/7752631b-6064-4f90-b292-5425064dbaa8" },
  { id: "5d15de64-49cc-4b6a-a2ea-51061f1cddc7", title: "GP data quietly added to Palantir’s NHS data platform", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/5d15de64-49cc-4b6a-a2ea-51061f1cddc7" },
  { id: "7181577b-345d-46f4-908d-294a23fe488e", title: "US pressure on development banks to scrap climate finance goals", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/7181577b-345d-46f4-908d-294a23fe488e" },
  { id: "3efbd9a2-ccd0-4c98-8e97-8ab3358fd2f3", title: "The OBR needs to give us more clarity on migration", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/3efbd9a2-ccd0-4c98-8e97-8ab3358fd2f3" },
  { id: "2f3d996e-b320-48c5-b4a7-967ddffeb360", title: "US-listed Equinix faces challenge over South African hyperscale data centre", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/2f3d996e-b320-48c5-b4a7-967ddffeb360" },
  { id: "fa47c0db-18a6-45d6-b35d-75942a0daae8", title: "Benchmarking and bonuses: why Singapore pays its politicians like bankers", date: "2026-09-13", time: "04:39", url: "https://www.ft.com/content/fa47c0db-18a6-45d6-b35d-75942a0daae8" },
  { id: "4dbba9b1-26ab-448c-acb3-215ecd9609ca", title: "Private equity plans to put the swing back into Japan’s golf tour", date: "2026-09-13", time: "03:50", url: "https://www.ft.com/content/4dbba9b1-26ab-448c-acb3-215ecd9609ca" },
  { id: "8d8b5195-e16f-457e-ae77-f6e843934058", title: "Burnham resists calls to reform student loans in Budget", date: "2026-09-13", time: "00:01", url: "https://www.ft.com/content/8d8b5195-e16f-457e-ae77-f6e843934058" },
  { id: "05e61eb8-9273-4b9a-a356-47f525b7d506", title: "Larry Ellison cancels $7.5bn Oracle share sale", date: "2026-09-12", time: "18:18", url: "https://www.ft.com/content/05e61eb8-9273-4b9a-a356-47f525b7d506" },
  { id: "b7fe0fe0-0463-4f55-9590-0a7d08d8fe66", title: "Why the AI race has its creators fearing human extinction", date: "2026-09-12", time: "17:38", url: "https://www.ft.com/content/b7fe0fe0-0463-4f55-9590-0a7d08d8fe66" },
  { id: "6a173e7c-cfe8-4ab8-8c8f-b90871cc907e", title: "India’s central bank tells Tata Sons to take conglomerate public", date: "2026-09-12", time: "17:20", url: "https://www.ft.com/content/6a173e7c-cfe8-4ab8-8c8f-b90871cc907e" },
  { id: "f32bef26-d2b8-47a6-b938-3dcd5e870685", title: "Brics push for Gulf peace as war worries mount", date: "2026-09-12", time: "15:34", url: "https://www.ft.com/content/f32bef26-d2b8-47a6-b938-3dcd5e870685" },
  { id: "70bd4f6c-a5f4-4e59-b773-614f0a5efd58", title: "Trump says united Ireland ‘inevitable’ and ‘a very cool thing’", date: "2026-09-12", time: "13:56", url: "https://www.ft.com/content/70bd4f6c-a5f4-4e59-b773-614f0a5efd58" },
  { id: "936ac952-43a6-44d5-be69-afa344e042f5", title: "Reform UK receives two record £36mn donations", date: "2026-09-12", time: "13:25", url: "https://www.ft.com/content/936ac952-43a6-44d5-be69-afa344e042f5" },
  { id: "4dc6710b-7911-44c6-b57a-2fb47b6b04ed", title: "Canada seeks $1tn from investors looking for a haven from Donald Trump", date: "2026-09-12", time: "11:00", url: "https://www.ft.com/content/4dc6710b-7911-44c6-b57a-2fb47b6b04ed" },
];
