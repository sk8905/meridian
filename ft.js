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
  {
    id: "3ae8dc9c-ee3a-4fe5-9749-b88390b5930b",
    title: "Nobel Peace Prize awarded to human rights lawyer Navi Pillay",
    date: "2026-10-09",
    time: "10:09",
    url: "https://www.ft.com/content/3ae8dc9c-ee3a-4fe5-9749-b88390b5930b",
  },
  {
    id: "4597f34b-f376-4c45-9379-24e79a724053",
    title: "FTAV’s Friday charts quiz",
    date: "2026-10-09",
    time: "10:03",
    url: "https://www.ft.com/content/4597f34b-f376-4c45-9379-24e79a724053",
  },
  {
    id: "5272dfe2-a1b4-4628-a8f1-9959bc954441",
    title: "Labour holds off Greens’ Polanski to win London by-election",
    date: "2026-10-09",
    time: "09:48",
    url: "https://www.ft.com/content/5272dfe2-a1b4-4628-a8f1-9959bc954441",
  },
  {
    id: "f9391cdf-cd10-4895-8192-3d4e91a31d89",
    title: "Left-of-Labour vote stagnates in Holborn and St Pancras",
    date: "2026-10-09",
    time: "09:38",
    url: "https://www.ft.com/content/f9391cdf-cd10-4895-8192-3d4e91a31d89",
  },
  {
    id: "ca31d01f-d5a0-4bd4-bcc2-4aaa68f4ca22",
    title: "Most countries unprepared for bank failures, watchdog warns",
    date: "2026-10-09",
    time: "07:00",
    url: "https://www.ft.com/content/ca31d01f-d5a0-4bd4-bcc2-4aaa68f4ca22",
  },
  {
    id: "c1a8b8f4-7508-49bc-990b-3ecc5a4f20ee",
    title: "Hedge funds as systemic risks",
    date: "2026-10-09",
    time: "06:30",
    url: "https://www.ft.com/content/c1a8b8f4-7508-49bc-990b-3ecc5a4f20ee",
  },
  {
    id: "b2efb147-5380-4d78-b648-cc5e442d1ce1",
    title: "FTAV’s further reading",
    date: "2026-10-09",
    time: "06:30",
    url: "https://www.ft.com/content/b2efb147-5380-4d78-b648-cc5e442d1ce1",
  },
  {
    id: "782c8c63-0db5-499e-8a0b-b7e263bc1f97",
    title: "EU capitals caught between markets and metrics as debt fears rise",
    date: "2026-10-09",
    time: "06:00",
    url: "https://www.ft.com/content/782c8c63-0db5-499e-8a0b-b7e263bc1f97",
  },
  {
    id: "42a5c77c-d09c-40b3-8ad2-4a01633dd6a0",
    title: "Is Warhammer still winning?",
    date: "2026-10-09",
    time: "06:00",
    url: "https://www.ft.com/content/42a5c77c-d09c-40b3-8ad2-4a01633dd6a0",
  },
  {
    id: "3bc0eaa5-a8d4-47e8-903c-7dd762d947dd",
    title: "SoftBank seeks $100bn from Gulf investors to expand AI bet",
    date: "2026-10-09",
    time: "05:30",
    url: "https://www.ft.com/content/3bc0eaa5-a8d4-47e8-903c-7dd762d947dd",
  },
  {
    id: "0d411bea-ee6a-4300-9b1e-cc5a6bba4b7c",
    title: "Venezuela opposition leader María Corina Machado calls for elections next year",
    date: "2026-10-09",
    time: "05:23",
    url: "https://www.ft.com/content/0d411bea-ee6a-4300-9b1e-cc5a6bba4b7c",
  },
  {
    id: "cbebae69-3986-46af-90a7-4cf702a6593d",
    title: "The Business of Formula 1",
    date: "2026-10-09",
    time: "05:09",
    url: "https://www.ft.com/content/cbebae69-3986-46af-90a7-4cf702a6593d",
  },
  {
    id: "4dabb3fd-70fd-46f1-9773-f38411ecb162",
    title: "A Starbucks-Chipotle merger offers the wrong kind of synergy",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/4dabb3fd-70fd-46f1-9773-f38411ecb162",
  },
  {
    id: "6cc1fe34-7235-424c-a80a-407fe9c13612",
    title: "Drop in fiscal headroom better option than Budget tax rises, says Jim O’Neill",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/6cc1fe34-7235-424c-a80a-407fe9c13612",
  },
  {
    id: "7acb5862-cde5-49b4-a5f1-5f6e6977a9c7",
    title: "Five ways to tell if market trouble lies ahead",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/7acb5862-cde5-49b4-a5f1-5f6e6977a9c7",
  },
  {
    id: "7b354a5d-9702-407a-a4bc-8703c6ba7b72",
    title: "The energy crisis is changing what investors want from oil majors",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/7b354a5d-9702-407a-a4bc-8703c6ba7b72",
  },
  {
    id: "e7b87569-f660-4c96-8313-5af5b2bcb86a",
    title: "University students will have to meet minimum entry standards to access loans",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/e7b87569-f660-4c96-8313-5af5b2bcb86a",
  },
  {
    id: "c0bec605-c948-4249-be2d-a76e0e60203b",
    title: "Some much-needed American optimism on Europe",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/c0bec605-c948-4249-be2d-a76e0e60203b",
  },
  {
    id: "e8b65126-4bb3-4a54-9027-8f121892b8c1",
    title: "Starbucks’ new era of financial engineering?",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/e8b65126-4bb3-4a54-9027-8f121892b8c1",
  },
  {
    id: "a752a86c-cf05-4152-b842-2ae6b6bf3fe0",
    title: "US 10-year Treasury yields risk hitting 6% for first time since 2000, Pimco says",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/a752a86c-cf05-4152-b842-2ae6b6bf3fe0",
  },
  {
    id: "83993bb2-35dd-4ae1-a4b2-8b6c3762a84b",
    title: "Why bank stocks are falling despite surging interest rates",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/83993bb2-35dd-4ae1-a4b2-8b6c3762a84b",
  },
  {
    id: "1273931a-238d-45a9-85b3-5c847e79b5ea",
    title: "Kremlin-backed money launderer used London fintech to make payments",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/1273931a-238d-45a9-85b3-5c847e79b5ea",
  },
  {
    id: "fca64ddb-d787-4369-9b81-95199f1510a5",
    title: "Israel’s ‘scorched-earth’ ceasefire in Gaza",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/fca64ddb-d787-4369-9b81-95199f1510a5",
  },
  {
    id: "bae7f43f-8954-45eb-a470-2cd7fb21a94b",
    title: "Manchester City, Abu Dhabi and the future of football",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/bae7f43f-8954-45eb-a470-2cd7fb21a94b",
  },
  {
    id: "2f320dca-b1a0-4451-ab8f-73640edd06c0",
    title: "Institutional investors challenge PE fund model with direct deals",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/2f320dca-b1a0-4451-ab8f-73640edd06c0",
  },
  {
    id: "2adb9508-6874-400e-adc3-231a7daebfd6",
    title: "‘Switzerland has spoken’: will UBS leave?",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/2adb9508-6874-400e-adc3-231a7daebfd6",
  },
  {
    id: "fb16d97c-b8ce-4a4a-b300-14f38a95278b",
    title: "Could The Celebrity Traitors tempt workers back to the office?",
    date: "2026-10-09",
    time: "05:00",
    url: "https://www.ft.com/content/fb16d97c-b8ce-4a4a-b300-14f38a95278b",
  },
  {
    id: "fa7d4016-a914-4f68-97bd-82081cbde886",
    title: "Mental health and ADHD diagnosis can cause harm, says official review",
    date: "2026-10-09",
    time: "00:01",
    url: "https://www.ft.com/content/fa7d4016-a914-4f68-97bd-82081cbde886",
  },
  {
    id: "8c3f95ec-2428-4102-9f67-b707f1264c69",
    title: "US telcos stocks tumble after SpaceX announces spectrum acquisition",
    date: "2026-10-08",
    time: "23:50",
    url: "https://www.ft.com/content/8c3f95ec-2428-4102-9f67-b707f1264c69",
  },
  {
    id: "0c390d03-427f-40a8-b5cb-d12c8d925d9d",
    title: "US to publicly execute former soldier by firing squad",
    date: "2026-10-08",
    time: "23:28",
    url: "https://www.ft.com/content/0c390d03-427f-40a8-b5cb-d12c8d925d9d",
  },
  {
    id: "6777c34c-876f-4f72-9eec-d3cddb2f1f45",
    title: "Amex fined $350mn for failing to flag suspected money laundering",
    date: "2026-10-08",
    time: "23:03",
    url: "https://www.ft.com/content/6777c34c-876f-4f72-9eec-d3cddb2f1f45",
  },
  {
    id: "297ca864-737c-4112-b368-f21a20cc78d2",
    title: "Burnham set to launch crackdown on non-compete clauses",
    date: "2026-10-08",
    time: "23:02",
    url: "https://www.ft.com/content/297ca864-737c-4112-b368-f21a20cc78d2",
  },
  {
    id: "c49f7d52-4b43-4dc9-b21b-a61e8756152f",
    title: "FirstFT: OpenAI’s $20bn annualised revenue gap",
    date: "2026-10-08",
    time: "22:48",
    url: "https://www.ft.com/content/c49f7d52-4b43-4dc9-b21b-a61e8756152f",
  },
  {
    id: "fbe78f9b-e71d-49dc-b03b-e762e073b658",
    title: "Singapore gears up for smog-choked Grand Prix",
    date: "2026-10-08",
    time: "22:00",
    url: "https://www.ft.com/content/fbe78f9b-e71d-49dc-b03b-e762e073b658",
  },
  {
    id: "dbcc35ba-db23-4be3-b2c0-4a0d8ecb7375",
    title: "US justice department orders playbook refresh for frauds on government",
    date: "2026-10-08",
    time: "21:35",
    url: "https://www.ft.com/content/dbcc35ba-db23-4be3-b2c0-4a0d8ecb7375",
  },
  {
    id: "67a64928-6278-4a83-8f9c-4ec9dcf26039",
    title: "Is France too blasé about borrowing costs?",
    date: "2026-10-08",
    time: "21:00",
    url: "https://www.ft.com/content/67a64928-6278-4a83-8f9c-4ec9dcf26039",
  },
  {
    id: "19a73ec7-a014-4776-bef7-4aa34e5b543a",
    title: "US adds torture charges to case against former Venezuelan president",
    date: "2026-10-08",
    time: "20:03",
    url: "https://www.ft.com/content/19a73ec7-a014-4776-bef7-4aa34e5b543a",
  },
  {
    id: "30034598-7ca3-4379-b91c-dc7ef419ad40",
    title: "Setting up an African rating agency is the easy part",
    date: "2026-10-08",
    time: "18:24",
    url: "https://www.ft.com/content/30034598-7ca3-4379-b91c-dc7ef419ad40",
  },
  {
    id: "e0cc2789-0e71-401d-8096-d58303970a37",
    title: "Donald Trump says US ‘will not be attacking Iran’ before midterm elections",
    date: "2026-10-08",
    time: "18:05",
    url: "https://www.ft.com/content/e0cc2789-0e71-401d-8096-d58303970a37",
  },
  {
    id: "3d482d55-dc7d-44d9-9ad3-a374e6d5e97d",
    title: "UK open to Germany joining fighter jet programme as Andy Burnham bids for deeper ties",
    date: "2026-10-08",
    time: "17:49",
    url: "https://www.ft.com/content/3d482d55-dc7d-44d9-9ad3-a374e6d5e97d",
  },

];
