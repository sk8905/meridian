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
    id: "9b30ee59-b542-48b8-85f6-d60dce897342",
    title: "India’s ‘Cockroach’ leaders released as movement calls for more protests",
    date: "2026-10-11",
    time: "08:03",
    url: "https://www.ft.com/content/9b30ee59-b542-48b8-85f6-d60dce897342",
  },
  {
    id: "3004a030-d64e-4ff7-a70d-ea379b4784af",
    title: "US justice department probes TV networks over Trump pool coverage",
    date: "2026-10-11",
    time: "05:28",
    url: "https://www.ft.com/content/3004a030-d64e-4ff7-a70d-ea379b4784af",
  },
  {
    id: "3aa9641e-55a6-45fd-bd08-1806306716e9",
    title: "UK could be fast-tracked back into EU, pro-Brussels group argues",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/3aa9641e-55a6-45fd-bd08-1806306716e9",
  },
  {
    id: "b42bb760-3eda-430d-adfd-69c359425c1d",
    title: "Private equity can cut ‘best’ deals in current climate, says Permira boss",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/b42bb760-3eda-430d-adfd-69c359425c1d",
  },
  {
    id: "cfb7a7a9-90c2-4ed9-8b3b-e8477430d77f",
    title: "Energy secretary pushes Healey for more Budget support on rising bills",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/cfb7a7a9-90c2-4ed9-8b3b-e8477430d77f",
  },
  {
    id: "bad44d91-2324-444c-9070-ea5beb406593",
    title: "JPMorgan bets on European asset management growth",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/bad44d91-2324-444c-9070-ea5beb406593",
  },
  {
    id: "cdf8f2d0-dcde-42ab-9ec3-fc840b2b5c55",
    title: "The fall of Germany’s ex-spymaster",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/cdf8f2d0-dcde-42ab-9ec3-fc840b2b5c55",
  },
  {
    id: "5da2dd05-9583-4a75-b018-2c5024383ec4",
    title: "Russia steps up bid to kill European defence chiefs, spy agencies warn",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/5da2dd05-9583-4a75-b018-2c5024383ec4",
  },
  {
    id: "a0ffc43a-231a-40aa-b5f9-521757830087",
    title: "China’s growing debt burden limits space for economic stimulus",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/a0ffc43a-231a-40aa-b5f9-521757830087",
  },
  {
    id: "b9822f5d-260a-4db0-8ab1-7551c5907a49",
    title: "Heart disease patients treated at home under new NHS scheme",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/b9822f5d-260a-4db0-8ab1-7551c5907a49",
  },
  {
    id: "1ef0813e-843a-477b-bca8-457afba61ed4",
    title: "Why are our children not flourishing at school?",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/1ef0813e-843a-477b-bca8-457afba61ed4",
  },
  {
    id: "eee10b3e-5a61-4e75-bc7e-c815dab30dd6",
    title: "Inside KKR’s €22bn bet on Italy’s telecoms network",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/eee10b3e-5a61-4e75-bc7e-c815dab30dd6",
  },
  {
    id: "f6d29414-412d-4422-a5f4-cb3338f73d3a",
    title: "Trump is failing to arrest decline in popularity, FT poll shows",
    date: "2026-10-11",
    time: "05:00",
    url: "https://www.ft.com/content/f6d29414-412d-4422-a5f4-cb3338f73d3a",
  },
  {
    id: "09cde3c2-26d3-4390-8fc0-f6292561a5bf",
    title: "Global private equity fuels Indian healthcare’s push into smaller cities",
    date: "2026-10-11",
    time: "04:02",
    url: "https://www.ft.com/content/09cde3c2-26d3-4390-8fc0-f6292561a5bf",
  },
  {
    id: "f9b9f937-97b0-4a03-90f6-05d7c7344ab9",
    title: "US hits commercial tanker in Gulf of Oman as tensions flare",
    date: "2026-10-11",
    time: "03:45",
    url: "https://www.ft.com/content/f9b9f937-97b0-4a03-90f6-05d7c7344ab9",
  },
  {
    id: "ff4ec1b7-1ccf-4aa2-8ca0-8faa3bfa0c6e",
    title: "The prisoners of war at the heart of Korean-Ukrainian tensions",
    date: "2026-10-11",
    time: "03:01",
    url: "https://www.ft.com/content/ff4ec1b7-1ccf-4aa2-8ca0-8faa3bfa0c6e",
  },
  {
    id: "f7d90625-0d78-44b2-927f-d63f4dbc5e8d",
    title: "Hurricane Isaias kills at least two and disrupts US oil and gas production",
    date: "2026-10-10",
    time: "21:26",
    url: "https://www.ft.com/content/f7d90625-0d78-44b2-927f-d63f4dbc5e8d",
  },
  {
    id: "391ddf3f-b233-41fd-819b-fcdbfb0ed010",
    title: "Riyadh airport suspends operations after missile strike injures dozens",
    date: "2026-10-10",
    time: "19:28",
    url: "https://www.ft.com/content/391ddf3f-b233-41fd-819b-fcdbfb0ed010",
  },
  {
    id: "052610c5-22b4-4dd4-932e-b7f9f0628b6a",
    title: "Nvidia in talks to acquire US ‘open’ model start-up Reflection AI",
    date: "2026-10-10",
    time: "19:14",
    url: "https://www.ft.com/content/052610c5-22b4-4dd4-932e-b7f9f0628b6a",
  },
  {
    id: "0923247c-298b-4536-8bef-e7e0cfd5f0d4",
    title: "Taxpayer-funded Trump TV ads continue despite pledge to use private money",
    date: "2026-10-10",
    time: "13:00",
    url: "https://www.ft.com/content/0923247c-298b-4536-8bef-e7e0cfd5f0d4",
  },
  {
    id: "b373cf00-9a94-4dc7-bdda-bc7006da1148",
    title: "India’s central bank tries to shore up rupee as it nears record lows",
    date: "2026-10-10",
    time: "12:57",
    url: "https://www.ft.com/content/b373cf00-9a94-4dc7-bdda-bc7006da1148",
  },
  {
    id: "7fd4dffc-8adf-4ad8-9fba-333e1ced991d",
    title: "US warns Kyiv that strikes on Russia jeopardise intelligence-sharing",
    date: "2026-10-10",
    time: "12:29",
    url: "https://www.ft.com/content/7fd4dffc-8adf-4ad8-9fba-333e1ced991d",
  },
  {
    id: "9c13d40e-d2b2-45d5-921c-a68cd4b308f9",
    title: "AI borrowing slows as investors grow wary of debt binge",
    date: "2026-10-10",
    time: "12:00",
    url: "https://www.ft.com/content/9c13d40e-d2b2-45d5-921c-a68cd4b308f9",
  },
  {
    id: "e3945b16-13f0-4640-882d-fafaca9d25e9",
    title: "Nixonmaxxing: the strange revival of America’s disgraced president",
    date: "2026-10-10",
    time: "11:00",
    url: "https://www.ft.com/content/e3945b16-13f0-4640-882d-fafaca9d25e9",
  },
  {
    id: "abaab361-8714-422f-b2eb-9eb447e4d8c3",
    title: "Chart of the Week: The US productivity-pay gap",
    date: "2026-10-10",
    time: "10:30",
    url: "https://www.ft.com/content/abaab361-8714-422f-b2eb-9eb447e4d8c3",
  },
  {
    id: "a96adda5-89fb-4f8b-96c4-96c171489a40",
    title: "EU joint budget proposal slashed in race to find end-year agreement",
    date: "2026-10-10",
    time: "10:28",
    url: "https://www.ft.com/content/a96adda5-89fb-4f8b-96c4-96c171489a40",
  },
  {
    id: "407fa757-cc77-49c0-871a-5140dd3a9a80",
    title: "Police arrest leader of India’s ‘Cockroach’ movement before mass protest",
    date: "2026-10-10",
    time: "09:35",
    url: "https://www.ft.com/content/407fa757-cc77-49c0-871a-5140dd3a9a80",
  },
  {
    id: "d6c7a14d-c05e-43b6-9eab-5fcdb067c2c8",
    title: "Reality bites for the Gulf and sport",
    date: "2026-10-10",
    time: "09:00",
    url: "https://www.ft.com/content/d6c7a14d-c05e-43b6-9eab-5fcdb067c2c8",
  },
  {
    id: "3f54c442-c2b7-4876-a960-5229951c9a46",
    title: "The world of one trade — AI",
    date: "2026-10-10",
    time: "07:36",
    url: "https://www.ft.com/content/3f54c442-c2b7-4876-a960-5229951c9a46",
  },
  {
    id: "767e9e15-1afd-447e-9e37-ed9390e0890f",
    title: "Pink Snow 2026: a winter sports special",
    date: "2026-10-10",
    time: "05:02",
    url: "https://www.ft.com/content/767e9e15-1afd-447e-9e37-ed9390e0890f",
  },
  {
    id: "910fc2b8-5b6a-425b-856c-589a3fdf1c0e",
    title: "The tax pitfalls of moving abroad",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/910fc2b8-5b6a-425b-856c-589a3fdf1c0e",
  },
  {
    id: "1babfbe0-f50e-4be8-8f2b-d93fdd472f8f",
    title: "UK universities withdraw offers from international students to avoid blanket ban",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/1babfbe0-f50e-4be8-8f2b-d93fdd472f8f",
  },
  {
    id: "59ce3c26-55d2-4b54-bf00-34104ed67be7",
    title: "The narrow Tory path to power",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/59ce3c26-55d2-4b54-bf00-34104ed67be7",
  },
  {
    id: "4e4ea744-6603-499b-baf7-83c74e4dc53e",
    title: "Russia targets Ukraine’s bridges as Vladimir Putin expands air war",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/4e4ea744-6603-499b-baf7-83c74e4dc53e",
  },
  {
    id: "3e0c76d3-885b-4945-b374-1477f141418c",
    title: "Caribbean cruises are going cheap, and so are operators’ shares",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/3e0c76d3-885b-4945-b374-1477f141418c",
  },
  {
    id: "a7532546-d9b2-4889-b2a6-ff68658a1782",
    title: "Slowing deals are another flashing red sign for equity markets",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/a7532546-d9b2-4889-b2a6-ff68658a1782",
  },
  {
    id: "08e41a4a-425b-4fcd-98e6-e2283faed94b",
    title: "Demand for tracker mortgages jumps as rates on fixed deals rise",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/08e41a4a-425b-4fcd-98e6-e2283faed94b",
  },
  {
    id: "c518cc4c-a9cb-4b5a-b038-165f3ad92765",
    title: "Our 1990s nostalgia is far too rose-tinted",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/c518cc4c-a9cb-4b5a-b038-165f3ad92765",
  },
  {
    id: "2b2b4eef-b4b8-4ab0-a997-ee2bf6b96a24",
    title: "The 79-year-old ski bum",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/2b2b4eef-b4b8-4ab0-a997-ee2bf6b96a24",
  },
  {
    id: "84583bb0-dbd7-4623-851c-1f9381dfe280",
    title: "Northern Ireland’s Drumcree parade banned",
    date: "2026-10-10",
    time: "00:05",
    url: "https://www.ft.com/content/84583bb0-dbd7-4623-851c-1f9381dfe280",
  },
];
