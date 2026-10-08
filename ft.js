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
    id: "67a64928-6278-4a83-8f9c-4ec9dcf26039",
    title: "Is France too blasé about borrowing costs?",
    date: "2026-10-08",
    time: "21:00",
    url: "https://www.ft.com/content/67a64928-6278-4a83-8f9c-4ec9dcf26039",
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
  {
    id: "9884d785-8ddc-43a6-ac8d-b9c7f9a99df3",
    title: "Big Tech sets out its pitches on AI agents",
    date: "2026-10-08",
    time: "17:44",
    url: "https://www.ft.com/content/9884d785-8ddc-43a6-ac8d-b9c7f9a99df3",
  },
  {
    id: "b66a9858-f8fb-46cb-b506-44bfe26fca2a",
    title: "OpenAI annualised revenues $20bn less than previously signalled",
    date: "2026-10-08",
    time: "17:42",
    url: "https://www.ft.com/content/b66a9858-f8fb-46cb-b506-44bfe26fca2a",
  },
  {
    id: "04d6ae65-5d5f-4ed6-9c15-16aa0f4d0713",
    title: "US mortgage rates rise for seventh straight week to hit highest since 2023",
    date: "2026-10-08",
    time: "17:38",
    url: "https://www.ft.com/content/04d6ae65-5d5f-4ed6-9c15-16aa0f4d0713",
  },
  {
    id: "5cfecbba-69ed-42d0-98fd-3ae019144692",
    title: "Trump bans Microsoft from sponsoring foreign workers for US residency",
    date: "2026-10-08",
    time: "17:29",
    url: "https://www.ft.com/content/5cfecbba-69ed-42d0-98fd-3ae019144692",
  },
  {
    id: "9cf103ed-548e-4b06-baed-71632abca961",
    title: "Big investors ‘bottom fish’ in Eurozone bond markets after France sell-off",
    date: "2026-10-08",
    time: "17:06",
    url: "https://www.ft.com/content/9cf103ed-548e-4b06-baed-71632abca961",
  },
  {
    id: "05f80d05-c80f-48ff-a65d-f379d77ed8af",
    title: "EY challenges Deloitte in outsourcing as revenue growth accelerates",
    date: "2026-10-08",
    time: "17:00",
    url: "https://www.ft.com/content/05f80d05-c80f-48ff-a65d-f379d77ed8af",
  },
  {
    id: "b2325cbe-44b6-4941-a60d-97fd9cff47ce",
    title: "Two Latvian nationals arrested on suspicion of trespass at RAF base",
    date: "2026-10-08",
    time: "16:37",
    url: "https://www.ft.com/content/b2325cbe-44b6-4941-a60d-97fd9cff47ce",
  },
  {
    id: "efdc00f5-2e70-40ba-803b-538e9e63462e",
    title: "UK pension ‘triple lock’ was first costed at just £50mn, says ex-government adviser",
    date: "2026-10-08",
    time: "16:21",
    url: "https://www.ft.com/content/efdc00f5-2e70-40ba-803b-538e9e63462e",
  },
  {
    id: "c163a470-e73f-4fdb-91fb-426004b21f22",
    title: "Daughter of Trump’s chief of staff works at firm that lobbies for Republika Srpska",
    date: "2026-10-08",
    time: "16:17",
    url: "https://www.ft.com/content/c163a470-e73f-4fdb-91fb-426004b21f22",
  },
  {
    id: "eec1e15d-78b9-4706-a518-2a9db4f37128",
    title: "Repeated US Treasury interventions risk an erosion of credibility",
    date: "2026-10-08",
    time: "15:30",
    url: "https://www.ft.com/content/eec1e15d-78b9-4706-a518-2a9db4f37128",
  },
  {
    id: "212f15c8-a897-4db0-bacf-d1556a11b9ed",
    title: "Goldman Sachs to pay top executives $500mn in special bonuses",
    date: "2026-10-08",
    time: "15:14",
    url: "https://www.ft.com/content/212f15c8-a897-4db0-bacf-d1556a11b9ed",
  },
  {
    id: "79cef26a-e5e9-41d0-9af2-876dc23a9a7d",
    title: "Starbucks has explored takeover of Chipotle in restaurant megadeal",
    date: "2026-10-08",
    time: "15:06",
    url: "https://www.ft.com/content/79cef26a-e5e9-41d0-9af2-876dc23a9a7d",
  },
  {
    id: "96474d3e-7d61-4327-b6c2-ed37eecad3f8",
    title: "UK investors face three-month wait to recoup money from property funds",
    date: "2026-10-08",
    time: "15:03",
    url: "https://www.ft.com/content/96474d3e-7d61-4327-b6c2-ed37eecad3f8",
  },
  {
    id: "3f0d45e0-18a5-420d-8db4-d8224d87b8e6",
    title: "Avocado giant Mission Produce banks on orchards outside Mexico to help meet US demand",
    date: "2026-10-08",
    time: "15:00",
    url: "https://www.ft.com/content/3f0d45e0-18a5-420d-8db4-d8224d87b8e6",
  },
  {
    id: "38ad9d42-2244-46ae-a27a-be0f5031598d",
    title: "Former prince Andrew wins legal challenge over search warrants",
    date: "2026-10-08",
    time: "14:42",
    url: "https://www.ft.com/content/38ad9d42-2244-46ae-a27a-be0f5031598d",
  },
  {
    id: "1addf0e7-c13b-45ff-b29f-5b9f78667cee",
    title: "ECB minutes reflect cooler appetite for additional rate rises in September",
    date: "2026-10-08",
    time: "14:20",
    url: "https://www.ft.com/content/1addf0e7-c13b-45ff-b29f-5b9f78667cee",
  },
  {
    id: "467d5151-91bb-4463-8cda-3fd72b5b2627",
    title: "Ohio Senate race puts Donald Trump’s record with blue-collar voters to the test",
    date: "2026-10-08",
    time: "14:00",
    url: "https://www.ft.com/content/467d5151-91bb-4463-8cda-3fd72b5b2627",
  },
  {
    id: "fb4d6b18-3b72-473c-90a5-3864c1dad27e",
    title: "Russian bomb attack kills dozens at Ukraine bus stop",
    date: "2026-10-08",
    time: "13:38",
    url: "https://www.ft.com/content/fb4d6b18-3b72-473c-90a5-3864c1dad27e",
  },
  {
    id: "e069daa0-7d33-409f-9e52-1bd7b1cafdb6",
    title: "Cyber war won’t be the same in the age of AI",
    date: "2026-10-08",
    time: "13:14",
    url: "https://www.ft.com/content/e069daa0-7d33-409f-9e52-1bd7b1cafdb6",
  },
  {
    id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7",
    title: "Latest savings rates",
    date: "2026-10-08",
    time: "13:02",
    url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7",
  },
  {
    id: "75ba3055-625c-4cb5-894b-0696a38f5e79",
    title: "Latest Isa rates",
    date: "2026-10-08",
    time: "12:56",
    url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79",
  },
  {
    id: "795ffd25-1b11-4531-b4bc-2974d798389c",
    title: "On the LLMternet, nobody cares you’re a plant",
    date: "2026-10-08",
    time: "12:32",
    url: "https://www.ft.com/content/795ffd25-1b11-4531-b4bc-2974d798389c",
  },
  {
    id: "ec860f96-5a2b-461a-a897-a957860c3dba",
    title: "Oil prices jump on tanker attack and slowing flows through Strait of Hormuz",
    date: "2026-10-08",
    time: "12:14",
    url: "https://www.ft.com/content/ec860f96-5a2b-461a-a897-a957860c3dba",
  },
  {
    id: "c4ef549c-0451-4884-b922-23cd24cf35a6",
    title: "Houston start-up aims to loosen China’s grip on critical metal",
    date: "2026-10-08",
    time: "12:00",
    url: "https://www.ft.com/content/c4ef549c-0451-4884-b922-23cd24cf35a6",
  },
  {
    id: "2cb13aed-f6bf-4f45-b906-fa1194405a0c",
    title: "Iran war blows near-£12bn hole in Britain’s public finances",
    date: "2026-10-08",
    time: "11:38",
    url: "https://www.ft.com/content/2cb13aed-f6bf-4f45-b906-fa1194405a0c",
  },
  {
    id: "30ea577a-d2e0-4366-9489-223cd38dca82",
    title: "Badenoch’s punchy plan to reunite the right",
    date: "2026-10-08",
    time: "11:27",
    url: "https://www.ft.com/content/30ea577a-d2e0-4366-9489-223cd38dca82",
  },
  {
    id: "e160b16c-6c39-47fd-9e6c-98a8d6b81eed",
    title: "Germany heads for fastest growth since 2022",
    date: "2026-10-08",
    time: "11:15",
    url: "https://www.ft.com/content/e160b16c-6c39-47fd-9e6c-98a8d6b81eed",
  },
];
