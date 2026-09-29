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
    id: "cf59cc58-a757-496b-b6ce-8a061c978382",
    title: "The Lady Gaga moment for corporate Japan",
    date: "2026-09-30",
    time: "00:01",
    url: "https://www.ft.com/content/cf59cc58-a757-496b-b6ce-8a061c978382",
  },
  {
    id: "38edf5d4-31df-4250-a6b7-691b844b22e0",
    title: "FirstFT: Trump says AI bosses agreed to ‘self-regulation’ amid safety fears",
    date: "2026-09-29",
    time: "22:34",
    url: "https://www.ft.com/content/38edf5d4-31df-4250-a6b7-691b844b22e0",
  },
  {
    id: "364d5454-876d-42ef-8f30-759e1ebdb026",
    title: "Shell-led consortium backs $23bn expansion of LNG Canada project",
    date: "2026-09-29",
    time: "21:42",
    url: "https://www.ft.com/content/364d5454-876d-42ef-8f30-759e1ebdb026",
  },
  {
    id: "d2916f8b-c53b-4c64-a9f8-37807bf5383f",
    title: "Australia battles black market for cigarettes after decade of tax rises",
    date: "2026-09-29",
    time: "22:00",
    url: "https://www.ft.com/content/d2916f8b-c53b-4c64-a9f8-37807bf5383f",
  },
  {
    id: "1199468e-dbe5-4581-b039-3d57985291ac",
    title: "Pete Hegseth to slash top US officer roles by 20%",
    date: "2026-09-29",
    time: "21:56",
    url: "https://www.ft.com/content/1199468e-dbe5-4581-b039-3d57985291ac",
  },
  {
    id: "bd830daa-e4fe-4cd6-a145-40502652c0b2",
    title: "UK bosses left in dark by Burnham and Healey’s emphasis on ‘cost of business’",
    date: "2026-09-29",
    time: "21:38",
    url: "https://www.ft.com/content/bd830daa-e4fe-4cd6-a145-40502652c0b2",
  },
  {
    id: "264c7d6f-9f84-43b9-89de-f8e9523a41a5",
    title: "Trump administration can deport non-citizens to third countries for now",
    date: "2026-09-29",
    time: "21:06",
    url: "https://www.ft.com/content/264c7d6f-9f84-43b9-89de-f8e9523a41a5",
  },
  {
    id: "97d0b8b3-86b8-4b2b-b603-f322da9343b4",
    title: "An ode to stock picking",
    date: "2026-09-29",
    time: "21:00",
    url: "https://www.ft.com/content/97d0b8b3-86b8-4b2b-b603-f322da9343b4",
  },
  {
    id: "2e2c868b-9510-4f0c-bbeb-ca17e7a18cc1",
    title: "Mediators push to break US-Iran deadlock",
    date: "2026-09-29",
    time: "19:30",
    url: "https://www.ft.com/content/2e2c868b-9510-4f0c-bbeb-ca17e7a18cc1",
  },
  {
    id: "e9b18367-5144-4775-8ddd-d1d133672db0",
    title: "Counterterror police found petrol, not explosives, in vans near RAF Fairford",
    date: "2026-09-29",
    time: "19:21",
    url: "https://www.ft.com/content/e9b18367-5144-4775-8ddd-d1d133672db0",
  },
  {
    id: "95854630-e639-4240-9598-564b996f30c5",
    title: "Andy Burnham’s ‘jam tomorrow’ vision",
    date: "2026-09-29",
    time: "18:42",
    url: "https://www.ft.com/content/95854630-e639-4240-9598-564b996f30c5",
  },
  {
    id: "fd9bb414-838d-48e5-bcdf-39c8a6bd41ca",
    title: "How would Andy Burnham’s social care shake-up work?",
    date: "2026-09-29",
    time: "18:15",
    url: "https://www.ft.com/content/fd9bb414-838d-48e5-bcdf-39c8a6bd41ca",
  },
  {
    id: "211d10ae-cf9e-481d-99ed-0321d2eb0676",
    title: "OpenAI launches new AI personal assistant",
    date: "2026-09-29",
    time: "18:15",
    url: "https://www.ft.com/content/211d10ae-cf9e-481d-99ed-0321d2eb0676",
  },
  {
    id: "26c54c8c-931c-4d84-9cf3-fd3e9b5e215d",
    title: "Middle Eastern oil exports rise to highest level since Iran war began",
    date: "2026-09-29",
    time: "17:46",
    url: "https://www.ft.com/content/26c54c8c-931c-4d84-9cf3-fd3e9b5e215d",
  },
  {
    id: "8d7f90d6-8d3a-4b11-8b51-090265278a31",
    title: "Manchester City artificially boosted finances by more than £900mn, says panel",
    date: "2026-09-29",
    time: "17:37",
    url: "https://www.ft.com/content/8d7f90d6-8d3a-4b11-8b51-090265278a31",
  },
  {
    id: "5e819183-5362-479b-a340-a1f38f7bed23",
    title: "Six takeaways from Andy Burnham’s conference speech",
    date: "2026-09-29",
    time: "17:27",
    url: "https://www.ft.com/content/5e819183-5362-479b-a340-a1f38f7bed23",
  },
  {
    id: "fd7a84a4-fb33-499c-8f8d-d8b6002db3f0",
    title: "Spain seeks to ban ‘vulture funds’ from housing market",
    date: "2026-09-29",
    time: "17:25",
    url: "https://www.ft.com/content/fd7a84a4-fb33-499c-8f8d-d8b6002db3f0",
  },
  {
    id: "2cb65c90-e8ee-43fa-84a1-16a6834e168e",
    title: "Andy Burnham sets up battle lines on social care and Europe",
    date: "2026-09-29",
    time: "17:19",
    url: "https://www.ft.com/content/2cb65c90-e8ee-43fa-84a1-16a6834e168e",
  },
  {
    id: "5132d554-baec-415e-aa64-430ade0e06a1",
    title: "Comment: Burnham’s brave new world — just one more election away",
    date: "2026-09-29",
    time: "17:12",
    url: "https://www.ft.com/content/5132d554-baec-415e-aa64-430ade0e06a1",
  },
  {
    id: "befb8435-1418-43ed-8efe-19fd218e468e",
    title: "15 outstanding ways to spend it in October",
    date: "2026-09-29",
    time: "17:09",
    url: "https://www.ft.com/content/befb8435-1418-43ed-8efe-19fd218e468e",
  },
  {
    id: "122a29d3-da08-4ffc-8add-aed427781659",
    title: "Burnham’s brave new world — just one more election away",
    date: "2026-09-29",
    time: "17:04",
    url: "https://www.ft.com/content/122a29d3-da08-4ffc-8add-aed427781659",
  },
  {
    id: "525c4aa1-2d36-47e4-b3ec-2d8f6ebf9060",
    title: "Low-hire, low-fire US labour market is no worry for Fed rate-setters",
    date: "2026-09-29",
    time: "16:25",
    url: "https://www.ft.com/content/525c4aa1-2d36-47e4-b3ec-2d8f6ebf9060",
  },
  {
    id: "c8693313-7750-40c7-892a-101ab16dec70",
    title: "US 30-year Treasury yield hits highest since 2002",
    date: "2026-09-29",
    time: "16:25",
    url: "https://www.ft.com/content/c8693313-7750-40c7-892a-101ab16dec70",
  },
  {
    id: "5a1da44f-27c8-485c-a1ed-169a361d2b38",
    title: "Barclays waters down return-to-office mandate after staff backlash",
    date: "2026-09-29",
    time: "15:12",
    url: "https://www.ft.com/content/5a1da44f-27c8-485c-a1ed-169a361d2b38",
  },
  {
    id: "fa48c931-bafd-487a-b5a5-eff93fdcf53f",
    title: "China unveils mortgage subsidies to boost economy",
    date: "2026-09-29",
    time: "15:08",
    url: "https://www.ft.com/content/fa48c931-bafd-487a-b5a5-eff93fdcf53f",
  },
  {
    id: "a9c20616-cef2-453a-9fa4-1d96f9f859d9",
    title: "Watchdog warns about Fed’s ‘deficiencies’",
    date: "2026-09-29",
    time: "14:00",
    url: "https://www.ft.com/content/a9c20616-cef2-453a-9fa4-1d96f9f859d9",
  },
  {
    id: "a8c1d14d-97aa-4b09-8162-adbcac1d0029",
    title: "Trump to meet AI chiefs over safety outcry",
    date: "2026-09-29",
    time: "13:35",
    url: "https://www.ft.com/content/a8c1d14d-97aa-4b09-8162-adbcac1d0029",
  },
  {
    id: "807daf90-94e6-40a3-b446-20a4395b42d4",
    title: "Average UK diesel price set to reach £2 per litre within days",
    date: "2026-09-29",
    time: "13:34",
    url: "https://www.ft.com/content/807daf90-94e6-40a3-b446-20a4395b42d4",
  },
  {
    id: "5bb621fa-2c18-4384-80ab-4a72e51b139a",
    title: "Dangote’s $16bn oil refinery blocked by Kenyan court",
    date: "2026-09-29",
    time: "13:14",
    url: "https://www.ft.com/content/5bb621fa-2c18-4384-80ab-4a72e51b139a",
  },
  {
    id: "11a29b88-5293-4574-8660-e9ec3107c819",
    title: "Le Pen deputy engulfed by antisemitism scandal",
    date: "2026-09-29",
    time: "12:59",
    url: "https://www.ft.com/content/11a29b88-5293-4574-8660-e9ec3107c819",
  },
  {
    id: "85de7143-a93b-4dbb-b2f3-856d407ba08f",
    title: "Apollo and Oaktree sue Patrick Drahi over US telco restructuring",
    date: "2026-09-29",
    time: "12:42",
    url: "https://www.ft.com/content/85de7143-a93b-4dbb-b2f3-856d407ba08f",
  },
  {
    id: "a060e1f6-e669-4657-af63-701053709c2d",
    title: "Breaking a central banking taboo",
    date: "2026-09-29",
    time: "12:30",
    url: "https://www.ft.com/content/a060e1f6-e669-4657-af63-701053709c2d",
  },
  {
    id: "7b9df85a-59ed-4863-9682-1c5b868fd3af",
    title: "A Republican midterm defeat will not be an earthquake",
    date: "2026-09-29",
    time: "12:16",
    url: "https://www.ft.com/content/7b9df85a-59ed-4863-9682-1c5b868fd3af",
  },
  {
    id: "3850893c-9db6-40c5-8e19-e89ec4160663",
    title: "Shabana Mahmood looks to soften migration policies amid Labour pressure",
    date: "2026-09-29",
    time: "12:12",
    url: "https://www.ft.com/content/3850893c-9db6-40c5-8e19-e89ec4160663",
  },
  {
    id: "7ffd0cd4-716f-40f3-976a-62a2e737bb3d",
    title: "Smart ring start-up Oura delays IPO",
    date: "2026-09-29",
    time: "12:09",
    url: "https://www.ft.com/content/7ffd0cd4-716f-40f3-976a-62a2e737bb3d",
  },
  {
    id: "b0e3a26e-5beb-45af-a7a8-bf134a6086a5",
    title: "K-craft’s slow seduction goes against type",
    date: "2026-09-29",
    time: "12:00",
    url: "https://www.ft.com/content/b0e3a26e-5beb-45af-a7a8-bf134a6086a5",
  },
  {
    id: "0cd95b53-4b99-42c9-9b3e-b1074ed88e12",
    title: "Why a UK-backed tungsten mine is supplying the US defence stockpile",
    date: "2026-09-29",
    time: "12:00",
    url: "https://www.ft.com/content/0cd95b53-4b99-42c9-9b3e-b1074ed88e12",
  },
  {
    id: "df11786e-4b07-45d6-b8ef-8e74f0d189ad",
    title: "Who is driving the massive surge in repo borrowing?",
    date: "2026-09-29",
    time: "12:00",
    url: "https://www.ft.com/content/df11786e-4b07-45d6-b8ef-8e74f0d189ad",
  },
  {
    id: "f16439a7-5554-412a-ae34-b46459ce28a9",
    title: "US-Iran war adds €100bn to EU’s fuel bill",
    date: "2026-09-29",
    time: "11:55",
    url: "https://www.ft.com/content/f16439a7-5554-412a-ae34-b46459ce28a9",
  },
  {
    id: "0e851fbb-f148-46e4-906f-390b38b62a15",
    title: "FirstFT: Anthropic IPO filing warns of ‘existential risks’",
    date: "2026-09-29",
    time: "11:14",
    url: "https://www.ft.com/content/0e851fbb-f148-46e4-906f-390b38b62a15",
  },
];
