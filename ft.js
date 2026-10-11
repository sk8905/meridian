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
    id: "68fd8c4f-6f34-4f6e-a52c-76f635164031",
    title: "US threatens to block arms for Ukraine over attacks on Russian refineries",
    date: "2026-10-11",
    time: "18:59",
    url: "https://www.ft.com/content/68fd8c4f-6f34-4f6e-a52c-76f635164031",
  },
  {
    id: "5b90cdd3-b78b-44ee-8045-8a0602ac0ef4",
    title: "IMF and World Bank to warn central bankers of a gathering storm",
    date: "2026-10-11",
    time: "18:15",
    url: "https://www.ft.com/content/5b90cdd3-b78b-44ee-8045-8a0602ac0ef4",
  },
  {
    id: "445b2856-a276-4d4c-bdea-44799d771c21",
    title: "Can Russia meet Trump’s diesel demands?",
    date: "2026-10-11",
    time: "18:13",
    url: "https://www.ft.com/content/445b2856-a276-4d4c-bdea-44799d771c21",
  },
  {
    id: "a01776ea-4a12-4195-8820-e43a885ba5fe",
    title: "Oil chiefs pull out of Riyadh energy congress after airport missile strike",
    date: "2026-10-11",
    time: "17:05",
    url: "https://www.ft.com/content/a01776ea-4a12-4195-8820-e43a885ba5fe",
  },
  {
    id: "dddba87c-3ed9-4cb5-8fe2-1b1dcc71da6f",
    title: "Democrats need a foreign policy",
    date: "2026-10-11",
    time: "16:13",
    url: "https://www.ft.com/content/dddba87c-3ed9-4cb5-8fe2-1b1dcc71da6f",
  },
  {
    id: "4fcbf57e-c73e-4ced-be4a-5ecc6f4874de",
    title: "Russia ‘interfered’ in 2016 Brexit vote, says Andy Burnham",
    date: "2026-10-11",
    time: "15:50",
    url: "https://www.ft.com/content/4fcbf57e-c73e-4ced-be4a-5ecc6f4874de",
  },
  {
    id: "71dccbca-4a1f-485a-9790-28cc527cdb82",
    title: "US affordability tracker: the data that could decide the 2026 midterm elections",
    date: "2026-10-11",
    time: "14:39",
    url: "https://www.ft.com/content/71dccbca-4a1f-485a-9790-28cc527cdb82",
  },
  {
    id: "bd2c7385-184e-425e-997f-0f5a8c54184e",
    title: "Houthis show military reach with deadly missile strikes on Riyadh",
    date: "2026-10-11",
    time: "14:04",
    url: "https://www.ft.com/content/bd2c7385-184e-425e-997f-0f5a8c54184e",
  },
  {
    id: "724ef0e2-4d50-49fd-aef8-abc0534f2f84",
    title: "Ukraine’s allies vow to pressure Moscow after Trump-Putin diesel deal",
    date: "2026-10-11",
    time: "13:45",
    url: "https://www.ft.com/content/724ef0e2-4d50-49fd-aef8-abc0534f2f84",
  },
  {
    id: "eaaf7c65-fc11-41ab-8b83-9a163337fa6b",
    title: "Europe can fight the ‘China shock’",
    date: "2026-10-11",
    time: "12:00",
    url: "https://www.ft.com/content/eaaf7c65-fc11-41ab-8b83-9a163337fa6b",
  },
  {
    id: "eae9d22f-3722-427f-a33b-aebc58fba2c4",
    title: "Will September inflation cement US interest rate policy for the rest of the year?",
    date: "2026-10-11",
    time: "12:00",
    url: "https://www.ft.com/content/eae9d22f-3722-427f-a33b-aebc58fba2c4",
  },
  {
    id: "ae389f53-ebd4-4188-9b44-266770595158",
    title: "The collective global duty to safeguard time",
    date: "2026-10-11",
    time: "12:00",
    url: "https://www.ft.com/content/ae389f53-ebd4-4188-9b44-266770595158",
  },
  {
    id: "b1ff2ac0-843d-4b2a-b848-c840a2decfb8",
    title: "John Healey rules out cutting ‘mansion tax’ threshold to £1.5mn in UK Budget",
    date: "2026-10-11",
    time: "11:38",
    url: "https://www.ft.com/content/b1ff2ac0-843d-4b2a-b848-c840a2decfb8",
  },
  {
    id: "7553fae9-f65a-4101-be93-cdac921d4c2f",
    title: "Smelly seaweed and strong peso hurt tourism at Mexico’s beach resorts",
    date: "2026-10-11",
    time: "11:00",
    url: "https://www.ft.com/content/7553fae9-f65a-4101-be93-cdac921d4c2f",
  },
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
];
