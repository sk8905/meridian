// =============================================================================
// myFT — headlines from the reader's personalised Financial Times feed
// (followed topics), surfaced in the Home news feed under an "FT" label.
//
// Source: the reader's myFT RSS feed —
//   https://www.ft.com/myft/following/601965b2-62d0-47e1-88cf-576ebc8a8a2e.rss
// It is fetched by the scheduled refresh routine (see docs/refresh-routines.md,
// the "Email sweep → myFT" section), parsed, and written here.
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
    "id": "5700f8fb-32b9-4324-972c-9578904ac6e2",
    "title": "Evercore appoints co-presidents as it sets up CEO succession contest",
    "date": "2026-10-18",
    "time": "21:01",
    "url": "https://www.ft.com/content/5700f8fb-32b9-4324-972c-9578904ac6e2"
  },
  {
    "id": "19495e50-0f55-44b1-8d19-19244163a4e8",
    "title": "Macron faces political firestorm after riots",
    "date": "2026-10-18",
    "time": "20:55",
    "url": "https://www.ft.com/content/19495e50-0f55-44b1-8d19-19244163a4e8"
  },
  {
    "id": "369eba8b-246d-405f-b0d8-6c676b0b6dab",
    "title": "France reels after ‘unprecedented’ violent riots",
    "date": "2026-10-18",
    "time": "20:52",
    "url": "https://www.ft.com/content/369eba8b-246d-405f-b0d8-6c676b0b6dab"
  },
  {
    "id": "39a1f29b-1248-4785-8aa3-0e7c29b5bf35",
    "title": "Trump to begin transforming historic golf course despite court order",
    "date": "2026-10-18",
    "time": "20:28",
    "url": "https://www.ft.com/content/39a1f29b-1248-4785-8aa3-0e7c29b5bf35"
  },
  {
    "id": "4ed89331-df18-4f2d-817b-9a7b304fd4e4",
    "title": "US army chief in Indo-Pacific calls for display of enhanced military muscle",
    "date": "2026-10-18",
    "time": "20:00",
    "url": "https://www.ft.com/content/4ed89331-df18-4f2d-817b-9a7b304fd4e4"
  },
  {
    "id": "734dad42-2eef-4a70-8947-c73997e49fd1",
    "title": "St Petersburg endures biggest Ukrainian drone attack",
    "date": "2026-10-18",
    "time": "19:30",
    "url": "https://www.ft.com/content/734dad42-2eef-4a70-8947-c73997e49fd1"
  },
  {
    "id": "37fbe995-df90-429a-bddb-34d14151bf79",
    "title": "Trump endorses Netanyahu ahead of Israeli elections",
    "date": "2026-10-18",
    "time": "19:11",
    "url": "https://www.ft.com/content/37fbe995-df90-429a-bddb-34d14151bf79"
  },
  {
    "id": "873e7ef2-d3d6-4c30-b8f8-ee3e69d60138",
    "title": "City of London weighs tax rises and service cuts to plug £70mn budget hole",
    "date": "2026-10-18",
    "time": "19:00",
    "url": "https://www.ft.com/content/873e7ef2-d3d6-4c30-b8f8-ee3e69d60138"
  },
  {
    "id": "783dbcdc-fe1e-4539-a740-3d2e4b3d5fc1",
    "title": "Crunch time for Brazilian politics",
    "date": "2026-10-18",
    "time": "18:15",
    "url": "https://www.ft.com/content/783dbcdc-fe1e-4539-a740-3d2e4b3d5fc1"
  },
  {
    "id": "d1e28d93-8574-4a46-946a-b261c401d6fa",
    "title": "US threatens Europe over Starlink restrictions",
    "date": "2026-10-18",
    "time": "17:00",
    "url": "https://www.ft.com/content/d1e28d93-8574-4a46-946a-b261c401d6fa"
  },
  {
    "id": "52a5e9df-cd9a-4951-99b5-2364e575bb44",
    "title": "Trump’s bid to make America cheap again has failed",
    "date": "2026-10-18",
    "time": "16:00",
    "url": "https://www.ft.com/content/52a5e9df-cd9a-4951-99b5-2364e575bb44"
  },
  {
    "id": "6748e45a-0b1a-43be-b65f-645849af4a57",
    "title": "Treasury introduces new security measures in bid to stop UK Budget leaks",
    "date": "2026-10-18",
    "time": "14:48",
    "url": "https://www.ft.com/content/6748e45a-0b1a-43be-b65f-645849af4a57"
  },
  {
    "id": "d48c545b-6b41-41e9-a71c-cb2126c76082",
    "title": "‘The Switzerland of North America’: Albertans vote on leaving Canada",
    "date": "2026-10-18",
    "time": "13:00",
    "url": "https://www.ft.com/content/d48c545b-6b41-41e9-a71c-cb2126c76082"
  },
  {
    "id": "da1dbd0b-4101-4ba8-aa2d-da6fedcb9f23",
    "title": "Saudi helicopter crash kills two troops near Yemen border",
    "date": "2026-10-18",
    "time": "12:38",
    "url": "https://www.ft.com/content/da1dbd0b-4101-4ba8-aa2d-da6fedcb9f23"
  },
  {
    "id": "2c8c610b-83f3-4cab-b409-bab69f4c2207",
    "title": "Not every billionaire is a policy failure",
    "date": "2026-10-18",
    "time": "12:00",
    "url": "https://www.ft.com/content/2c8c610b-83f3-4cab-b409-bab69f4c2207"
  },
  {
    "id": "7c2e889e-2eb5-4c62-821b-1a7f88c13d05",
    "title": "Will Meta’s earnings restore confidence in the AI boom?",
    "date": "2026-10-18",
    "time": "12:00",
    "url": "https://www.ft.com/content/7c2e889e-2eb5-4c62-821b-1a7f88c13d05"
  },
  {
    "id": "b2299174-fb78-4edf-a358-8cae837f8d7b",
    "title": "Could Republicans prove the pollsters wrong in the midterms?",
    "date": "2026-10-18",
    "time": "11:00",
    "url": "https://www.ft.com/content/b2299174-fb78-4edf-a358-8cae837f8d7b"
  },
  {
    "id": "b263bbe1-cd0c-4508-9ec8-07cb8a9c2a02",
    "title": "Trump’s losing battle with green energy",
    "date": "2026-10-18",
    "time": "11:00",
    "url": "https://www.ft.com/content/b263bbe1-cd0c-4508-9ec8-07cb8a9c2a02"
  },
  {
    "id": "2dfdd513-26a6-4a10-9cae-5242eb4ee3ed",
    "title": "Accenture looks to sell Chinese operations for up to $1.5bn",
    "date": "2026-10-18",
    "time": "11:00",
    "url": "https://www.ft.com/content/2dfdd513-26a6-4a10-9cae-5242eb4ee3ed"
  },
  {
    "id": "886006f8-284c-4a20-9411-3cfd9deead3f",
    "title": "‘Cash is making a comeback’ as India raises fees on digital payments",
    "date": "2026-10-18",
    "time": "05:11",
    "url": "https://www.ft.com/content/886006f8-284c-4a20-9411-3cfd9deead3f"
  },
  {
    "id": "3d964bed-ed6e-4b15-ade0-f190d2723cac",
    "title": "Europe Express Weekend: Where are Zelenskyy’s friends (when he needs them)?",
    "date": "2026-10-17",
    "time": "11:00",
    "url": "https://www.ft.com/content/3d964bed-ed6e-4b15-ade0-f190d2723cac"
  },
  {
    "id": "f1ea9968-4f26-4f1c-a3c2-66ec090e3dcd",
    "title": "Corporate donations flood US attorneys-general election races",
    "date": "2026-10-17",
    "time": "11:00",
    "url": "https://www.ft.com/content/f1ea9968-4f26-4f1c-a3c2-66ec090e3dcd"
  },
  {
    "id": "836eddd7-3adc-4cbb-8527-7a0a7a277e50",
    "title": "Donald Trump exempts Russia from further sanctions mandated by new law",
    "date": "2026-10-17",
    "time": "10:53",
    "url": "https://www.ft.com/content/836eddd7-3adc-4cbb-8527-7a0a7a277e50"
  },
  {
    "id": "c5ed09fe-dc65-4f05-8c12-8f74f5dc7ccd",
    "title": "Chart of the Week: The chip stock split",
    "date": "2026-10-17",
    "time": "10:30",
    "url": "https://www.ft.com/content/c5ed09fe-dc65-4f05-8c12-8f74f5dc7ccd"
  },
  {
    "id": "19de89f6-c7b5-4dd7-b4d0-7ae29c6120a5",
    "title": "Formula 1 bets on Rwanda",
    "date": "2026-10-17",
    "time": "09:00",
    "url": "https://www.ft.com/content/19de89f6-c7b5-4dd7-b4d0-7ae29c6120a5"
  },
  {
    "id": "3a56575e-ecfb-4fa9-af70-01aebd869729",
    "title": "Are we sleepwalking into World War III?",
    "date": "2026-10-17",
    "time": "05:00",
    "url": "https://www.ft.com/content/3a56575e-ecfb-4fa9-af70-01aebd869729"
  },
  {
    "id": "993940f2-c9a3-4e20-8c0a-f73d448f090d",
    "title": "‘Inflation will make people poor’: Airlines brace for years of pain",
    "date": "2026-10-17",
    "time": "05:00",
    "url": "https://www.ft.com/content/993940f2-c9a3-4e20-8c0a-f73d448f090d"
  },
  {
    "id": "838428eb-9618-4590-841a-2fccf86fe71f",
    "title": "The summer that remade the Middle East",
    "date": "2026-10-17",
    "time": "05:00",
    "url": "https://www.ft.com/content/838428eb-9618-4590-841a-2fccf86fe71f"
  },
  {
    "id": "aef6d0ed-1019-452a-b3f0-3e3dfc9eac05",
    "title": "What is behind the surprising resilience of the UK economy?",
    "date": "2026-10-17",
    "time": "05:00",
    "url": "https://www.ft.com/content/aef6d0ed-1019-452a-b3f0-3e3dfc9eac05"
  },
  {
    "id": "f5388310-ea4b-47b5-ae9c-7aff01198422",
    "title": "This earnings season, what CEOs say matters more than what they’ve done",
    "date": "2026-10-17",
    "time": "05:00",
    "url": "https://www.ft.com/content/f5388310-ea4b-47b5-ae9c-7aff01198422"
  },
  {
    "id": "b4996387-0a4a-4f75-b16d-830fbc8c40c3",
    "title": "HMRC claws back nearly £500mn in underpaid capital gains",
    "date": "2026-10-17",
    "time": "05:00",
    "url": "https://www.ft.com/content/b4996387-0a4a-4f75-b16d-830fbc8c40c3"
  },
  {
    "id": "169bbf6e-d0af-4c8d-afd0-2c561a58c855",
    "title": "UK dividend payments jump 14% in a year",
    "date": "2026-10-17",
    "time": "05:00",
    "url": "https://www.ft.com/content/169bbf6e-d0af-4c8d-afd0-2c561a58c855"
  },
  {
    "id": "3f982af9-3eec-476f-9d29-39145ac485c4",
    "title": "The dress rehearsal for an AI reckoning",
    "date": "2026-10-17",
    "time": "05:00",
    "url": "https://www.ft.com/content/3f982af9-3eec-476f-9d29-39145ac485c4"
  },
  {
    "id": "766f613b-7d0d-4f04-ae44-a8c827864932",
    "title": "Activists highlight a Big Yellow warning sign for the London market",
    "date": "2026-10-17",
    "time": "05:00",
    "url": "https://www.ft.com/content/766f613b-7d0d-4f04-ae44-a8c827864932"
  },
  {
    "id": "60bffbe3-f7aa-4813-b657-a31087e7b116",
    "title": "The AI El Niño",
    "date": "2026-10-17",
    "time": "05:00",
    "url": "https://www.ft.com/content/60bffbe3-f7aa-4813-b657-a31087e7b116"
  },
  {
    "id": "5b9c0cfa-849d-40a2-92bf-0bd2e2b58871",
    "title": "Olly Robbins wins payout over Mandelson scandal sacking",
    "date": "2026-10-16",
    "time": "18:44",
    "url": "https://www.ft.com/content/5b9c0cfa-849d-40a2-92bf-0bd2e2b58871"
  },
  {
    "id": "ae21e5e0-6696-4cd2-877c-7d269b3bcf48",
    "title": "Trump urges his new press secretary to ‘reconsider’ the role",
    "date": "2026-10-16",
    "time": "18:41",
    "url": "https://www.ft.com/content/ae21e5e0-6696-4cd2-877c-7d269b3bcf48"
  },
  {
    "id": "30f95850-4ff1-4669-acf8-06edc79c9457",
    "title": "Fuel-price surge turbocharges global EV sales and spells end for diesel in Europe",
    "date": "2026-10-16",
    "time": "18:33",
    "url": "https://www.ft.com/content/30f95850-4ff1-4669-acf8-06edc79c9457"
  },
  {
    "id": "d2928f6b-b8f2-4651-ac9a-9fc4d8653608",
    "title": "Italy secures EU deal to lower its electricity prices",
    "date": "2026-10-16",
    "time": "18:14",
    "url": "https://www.ft.com/content/d2928f6b-b8f2-4651-ac9a-9fc4d8653608"
  },
  {
    "id": "2ce007c9-72c4-46bc-88be-fad2dee8986b",
    "title": "Directors’ Deals: IG Design Group finance boss backs revamp",
    "date": "2026-10-16",
    "time": "18:00",
    "url": "https://www.ft.com/content/2ce007c9-72c4-46bc-88be-fad2dee8986b"
  }
];
