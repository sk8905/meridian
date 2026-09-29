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
    id: "26c54c8c-931c-4d84-9cf3-fd3e9b5e215d",
    title: "Middle Eastern oil exports rise to highest level since Iran war began",
    date: "2026-09-29",
    time: "17:46",
    url: "https://www.ft.com/content/26c54c8c-931c-4d84-9cf3-fd3e9b5e215d"
  },
  {
    id: "8d7f90d6-8d3a-4b11-8b51-090265278a31",
    title: "Manchester City artificially boosted finances by more than £900mn, says panel",
    date: "2026-09-29",
    time: "17:37",
    url: "https://www.ft.com/content/8d7f90d6-8d3a-4b11-8b51-090265278a31"
  },
  {
    id: "5e819183-5362-479b-a340-a1f38f7bed23",
    title: "Six takeaways from Andy Burnham’s conference speech",
    date: "2026-09-29",
    time: "17:27",
    url: "https://www.ft.com/content/5e819183-5362-479b-a340-a1f38f7bed23"
  },
  {
    id: "fd7a84a4-fb33-499c-8f8d-d8b6002db3f0",
    title: "Spain seeks to ban ‘vulture funds’ from housing market",
    date: "2026-09-29",
    time: "17:25",
    url: "https://www.ft.com/content/fd7a84a4-fb33-499c-8f8d-d8b6002db3f0"
  },
  {
    id: "2cb65c90-e8ee-43fa-84a1-16a6834e168e",
    title: "Andy Burnham sets up battle lines on social care and Europe",
    date: "2026-09-29",
    time: "17:19",
    url: "https://www.ft.com/content/2cb65c90-e8ee-43fa-84a1-16a6834e168e"
  },
  {
    id: "5132d554-baec-415e-aa64-430ade0e06a1",
    title: "Comment: Burnham’s brave new world — just one more election away",
    date: "2026-09-29",
    time: "17:12",
    url: "https://www.ft.com/content/5132d554-baec-415e-aa64-430ade0e06a1"
  },
  {
    id: "122a29d3-da08-4ffc-8add-aed427781659",
    title: "Burnham’s brave new world — just one more election away",
    date: "2026-09-29",
    time: "17:04",
    url: "https://www.ft.com/content/122a29d3-da08-4ffc-8add-aed427781659"
  },
  {
    id: "525c4aa1-2d36-47e4-b3ec-2d8f6ebf9060",
    title: "Low-hire, low-fire US labour market is no worry for Fed rate-setters",
    date: "2026-09-29",
    time: "16:25",
    url: "https://www.ft.com/content/525c4aa1-2d36-47e4-b3ec-2d8f6ebf9060"
  },
  {
    id: "c8693313-7750-40c7-892a-101ab16dec70",
    title: "US 30-year Treasury yield hits highest since 2002",
    date: "2026-09-29",
    time: "16:25",
    url: "https://www.ft.com/content/c8693313-7750-40c7-892a-101ab16dec70"
  },
  {
    id: "5a1da44f-27c8-485c-a1ed-169a361d2b38",
    title: "Barclays waters down return-to-office mandate after staff backlash",
    date: "2026-09-29",
    time: "15:12",
    url: "https://www.ft.com/content/5a1da44f-27c8-485c-a1ed-169a361d2b38"
  },
  {
    id: "fa48c931-bafd-487a-b5a5-eff93fdcf53f",
    title: "China unveils mortgage subsidies to boost economy",
    date: "2026-09-29",
    time: "15:08",
    url: "https://www.ft.com/content/fa48c931-bafd-487a-b5a5-eff93fdcf53f"
  },
  {
    id: "a9c20616-cef2-453a-9fa4-1d96f9f859d9",
    title: "Watchdog warns about Fed’s ‘deficiencies’",
    date: "2026-09-29",
    time: "14:00",
    url: "https://www.ft.com/content/a9c20616-cef2-453a-9fa4-1d96f9f859d9"
  },
  {
    id: "a8c1d14d-97aa-4b09-8162-adbcac1d0029",
    title: "Trump to meet AI chiefs over safety outcry",
    date: "2026-09-29",
    time: "13:35",
    url: "https://www.ft.com/content/a8c1d14d-97aa-4b09-8162-adbcac1d0029"
  },
  {
    id: "807daf90-94e6-40a3-b446-20a4395b42d4",
    title: "Average UK diesel price set to reach £2 per litre within days",
    date: "2026-09-29",
    time: "13:34",
    url: "https://www.ft.com/content/807daf90-94e6-40a3-b446-20a4395b42d4"
  },
  {
    id: "0e851fbb-f148-46e4-906f-390b38b62a15",
    title: "FirstFT: Anthropic IPO filing warns of ‘existential risks’",
    date: "2026-09-29",
    time: "11:14",
    url: "https://www.ft.com/content/0e851fbb-f148-46e4-906f-390b38b62a15"
  },
  {
    id: "5bb621fa-2c18-4384-80ab-4a72e51b139a",
    title: "Dangote’s $16bn oil refinery blocked by Kenyan court",
    date: "2026-09-29",
    time: "13:14",
    url: "https://www.ft.com/content/5bb621fa-2c18-4384-80ab-4a72e51b139a"
  },
  {
    id: "11a29b88-5293-4574-8660-e9ec3107c819",
    title: "Le Pen deputy engulfed by antisemitism scandal",
    date: "2026-09-29",
    time: "12:59",
    url: "https://www.ft.com/content/11a29b88-5293-4574-8660-e9ec3107c819"
  },
  {
    id: "85de7143-a93b-4dbb-b2f3-856d407ba08f",
    title: "Apollo and Oaktree sue Patrick Drahi over US telco restructuring",
    date: "2026-09-29",
    time: "12:42",
    url: "https://www.ft.com/content/85de7143-a93b-4dbb-b2f3-856d407ba08f"
  },
  {
    id: "a060e1f6-e669-4657-af63-701053709c2d",
    title: "Breaking a central banking taboo",
    date: "2026-09-29",
    time: "12:30",
    url: "https://www.ft.com/content/a060e1f6-e669-4657-af63-701053709c2d"
  },
  {
    id: "7b9df85a-59ed-4863-9682-1c5b868fd3af",
    title: "A Republican midterm defeat will not be an earthquake",
    date: "2026-09-29",
    time: "12:16",
    url: "https://www.ft.com/content/7b9df85a-59ed-4863-9682-1c5b868fd3af"
  },
  {
    id: "3850893c-9db6-40c5-8e19-e89ec4160663",
    title: "Shabana Mahmood looks to soften migration policies amid Labour pressure",
    date: "2026-09-29",
    time: "12:12",
    url: "https://www.ft.com/content/3850893c-9db6-40c5-8e19-e89ec4160663"
  },
  {
    id: "7ffd0cd4-716f-40f3-976a-62a2e737bb3d",
    title: "Smart ring start-up Oura delays IPO",
    date: "2026-09-29",
    time: "12:09",
    url: "https://www.ft.com/content/7ffd0cd4-716f-40f3-976a-62a2e737bb3d"
  },
  {
    id: "b0e3a26e-5beb-45af-a7a8-bf134a6086a5",
    title: "K-craft’s slow seduction goes against type",
    date: "2026-09-29",
    time: "12:00",
    url: "https://www.ft.com/content/b0e3a26e-5beb-45af-a7a8-bf134a6086a5"
  },
  {
    id: "0cd95b53-4b99-42c9-9b3e-b1074ed88e12",
    title: "Why a UK-backed tungsten mine is supplying the US defence stockpile",
    date: "2026-09-29",
    time: "12:00",
    url: "https://www.ft.com/content/0cd95b53-4b99-42c9-9b3e-b1074ed88e12"
  },
  {
    id: "df11786e-4b07-45d6-b8ef-8e74f0d189ad",
    title: "Who is driving the massive surge in repo borrowing?",
    date: "2026-09-29",
    time: "12:00",
    url: "https://www.ft.com/content/df11786e-4b07-45d6-b8ef-8e74f0d189ad"
  },
  {
    id: "f16439a7-5554-412a-ae34-b46459ce28a9",
    title: "US-Iran war adds €100bn to EU’s fuel bill",
    date: "2026-09-29",
    time: "11:55",
    url: "https://www.ft.com/content/f16439a7-5554-412a-ae34-b46459ce28a9"
  },
  {
    id: "1ae07fc9-dfce-4cb3-a216-a8e8bfeb74b9",
    title: "Le Monde Béryl is pumping up New York",
    date: "2026-09-29",
    time: "11:00",
    url: "https://www.ft.com/content/1ae07fc9-dfce-4cb3-a216-a8e8bfeb74b9"
  },
  {
    id: "57b7bde7-099d-4cba-9275-01a3bc088d95",
    title: "‘Translation and connection are different things’: why languages remain useful at work",
    date: "2026-09-29",
    time: "11:00",
    url: "https://www.ft.com/content/57b7bde7-099d-4cba-9275-01a3bc088d95"
  },
  {
    id: "c269b475-b37a-4fe8-b138-849d8525ff59",
    title: "Russia behind arson attack on defence company, says Estonia",
    date: "2026-09-29",
    time: "10:12",
    url: "https://www.ft.com/content/c269b475-b37a-4fe8-b138-849d8525ff59"
  },
  {
    id: "55c804cd-80a7-4195-92a2-e743d08e84bc",
    title: "John Healey failed to truthfully articulate causes of Britain’s problems",
    date: "2026-09-29",
    time: "10:01",
    url: "https://www.ft.com/content/55c804cd-80a7-4195-92a2-e743d08e84bc"
  },
  {
    id: "dfcb291a-d8e7-441d-9d1f-28106a9749e6",
    title: "Julius Baer shares hit record high after Swiss regulator ends probe",
    date: "2026-09-29",
    time: "09:52",
    url: "https://www.ft.com/content/dfcb291a-d8e7-441d-9d1f-28106a9749e6"
  },
  {
    id: "64816c78-a707-42e4-bb3f-2f199e29eac3",
    title: "Labour conference: Burnham warned ditching triple lock would be ‘electoral insanity’ ahead of speech",
    date: "2026-09-29",
    time: "09:37",
    url: "https://www.ft.com/content/64816c78-a707-42e4-bb3f-2f199e29eac3"
  },
  {
    id: "364d5454-876d-42ef-8f30-759e1ebdb026",
    title: "Shell-led consortium backs $23bn expansion of LNG Canada project",
    date: "2026-09-29",
    time: "09:34",
    url: "https://www.ft.com/content/364d5454-876d-42ef-8f30-759e1ebdb026"
  },
  {
    id: "5c1dc583-5c88-4e91-a6b8-b62a6b33f74c",
    title: "Australia raises interest rate to highest level in 15 years",
    date: "2026-09-29",
    time: "06:54",
    url: "https://www.ft.com/content/5c1dc583-5c88-4e91-a6b8-b62a6b33f74c"
  },
  {
    id: "3976a165-960a-4f04-98e4-6c39386ef785",
    title: "Rethinking the dollar",
    date: "2026-09-29",
    time: "06:30",
    url: "https://www.ft.com/content/3976a165-960a-4f04-98e4-6c39386ef785"
  },
  {
    id: "6dc0716f-9a9c-4c3e-903a-2b497eb5190c",
    title: "FTAV’s further reading",
    date: "2026-09-29",
    time: "06:30",
    url: "https://www.ft.com/content/6dc0716f-9a9c-4c3e-903a-2b497eb5190c"
  },
  {
    id: "27fb5d30-1fb6-4f30-937c-ff5c598eaaa5",
    title: "Brussels’ protectionist turn spooks bloc’s free-market stalwarts",
    date: "2026-09-29",
    time: "06:00",
    url: "https://www.ft.com/content/27fb5d30-1fb6-4f30-937c-ff5c598eaaa5"
  },
  {
    id: "796167ab-ba0b-4476-b505-516b7d896e40",
    title: "Rolex was for crypto, Ferrari is for AI",
    date: "2026-09-29",
    time: "06:00",
    url: "https://www.ft.com/content/796167ab-ba0b-4476-b505-516b7d896e40"
  },
  {
    id: "d6a9f5df-08d0-4f80-ad2d-5d8a17e2cc82",
    title: "Nvidia turns to insurers to spread the risk of AI build-out",
    date: "2026-09-29",
    time: "05:04",
    url: "https://www.ft.com/content/d6a9f5df-08d0-4f80-ad2d-5d8a17e2cc82"
  },
  {
    id: "e4231435-4d6d-438d-9632-ab215784b2d5",
    title: "Big money, bigger problems in Big Law",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/e4231435-4d6d-438d-9632-ab215784b2d5"
  }
];
