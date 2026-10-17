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
  },
  {
    "id": "3b431be8-e758-42ef-b957-bdf8ef702529",
    "title": "Stockpickers: Bytes Technology, YouGov, Softcat",
    "date": "2026-10-16",
    "time": "18:00",
    "url": "https://www.ft.com/content/3b431be8-e758-42ef-b957-bdf8ef702529"
  },
  {
    "id": "2b0e3eae-8eae-449e-9492-ac036b0fe143",
    "title": "Looming UK tax rise puts bankers on edge",
    "date": "2026-10-16",
    "time": "17:14",
    "url": "https://www.ft.com/content/2b0e3eae-8eae-449e-9492-ac036b0fe143"
  },
  {
    "id": "ff9756a6-6339-47ca-ae9b-efd00e019fe3",
    "title": "Can consultants reinvent themselves once again?",
    "date": "2026-10-16",
    "time": "17:11",
    "url": "https://www.ft.com/content/ff9756a6-6339-47ca-ae9b-efd00e019fe3"
  },
  {
    "id": "155bc83f-655d-4891-a431-aa5e1e1ce96a",
    "title": "Has London’s £5bn ‘super sewer’ improved water quality in the Thames?",
    "date": "2026-10-16",
    "time": "16:28",
    "url": "https://www.ft.com/content/155bc83f-655d-4891-a431-aa5e1e1ce96a"
  },
  {
    "id": "86038629-9b53-4859-bc59-a67fb0059c37",
    "title": "Welfare reform is possible: we did it before, we can do it again",
    "date": "2026-10-16",
    "time": "16:53",
    "url": "https://www.ft.com/content/86038629-9b53-4859-bc59-a67fb0059c37"
  },
  {
    "id": "d05f87bf-225b-43f9-86e6-2f9537cd75c6",
    "title": "Apple set for UK legal fight over iPhone tap-to-pay rules",
    "date": "2026-10-16",
    "time": "16:21",
    "url": "https://www.ft.com/content/d05f87bf-225b-43f9-86e6-2f9537cd75c6"
  },
  {
    "id": "cc22b728-dee4-4a3f-a52f-fb3f09aa30e0",
    "title": "Andy Burnham urges SNP’s John Swinney to team up on devolving jobs support",
    "date": "2026-10-16",
    "time": "16:00",
    "url": "https://www.ft.com/content/cc22b728-dee4-4a3f-a52f-fb3f09aa30e0"
  },
  {
    "id": "f49c8e39-f07f-4177-9948-aabe55e5ed91",
    "title": "Citi becomes latest US bank to restrict AI agents from accessing accounts",
    "date": "2026-10-16",
    "time": "15:58",
    "url": "https://www.ft.com/content/f49c8e39-f07f-4177-9948-aabe55e5ed91"
  },
  {
    "id": "a0a143ac-6a48-410a-b121-92f293b0ad6d",
    "title": "Trump has failed to listen to voters on inflation",
    "date": "2026-10-16",
    "time": "15:58",
    "url": "https://www.ft.com/content/a0a143ac-6a48-410a-b121-92f293b0ad6d"
  },
  {
    "id": "5b36d8a4-49f1-4877-8719-2db984c13081",
    "title": "The hunt for Fed October",
    "date": "2026-10-16",
    "time": "15:39",
    "url": "https://www.ft.com/content/5b36d8a4-49f1-4877-8719-2db984c13081"
  },
  {
    "id": "15922d6d-421a-4b33-a329-45443491e1be",
    "title": "India police detain ‘Cockroach’ leader again to head off new protests",
    "date": "2026-10-16",
    "time": "15:39",
    "url": "https://www.ft.com/content/15922d6d-421a-4b33-a329-45443491e1be"
  },
  {
    "id": "0c7188db-2ab2-4b41-a7ea-a4e8b795e173",
    "title": "How to value anything with one simple question",
    "date": "2026-10-16",
    "time": "14:57",
    "url": "https://www.ft.com/content/0c7188db-2ab2-4b41-a7ea-a4e8b795e173"
  },
  {
    "id": "800db28a-9176-4ca3-9334-69ede9a2b3ef",
    "title": "Lufthansa exploring sale of software assets in €1bn deal",
    "date": "2026-10-16",
    "time": "14:56",
    "url": "https://www.ft.com/content/800db28a-9176-4ca3-9334-69ede9a2b3ef"
  },
  {
    "id": "44934b4f-f01b-45c1-9c51-ec4566e662a9",
    "title": "UAE had ‘clear incentives’ to influence Telegraph coverage, Ofcom finds",
    "date": "2026-10-16",
    "time": "14:44",
    "url": "https://www.ft.com/content/44934b4f-f01b-45c1-9c51-ec4566e662a9"
  },
  {
    "id": "c36f858f-73e2-478b-9fdb-92b9167ce37f",
    "title": "France and Germany seal EU car deal",
    "date": "2026-10-16",
    "time": "14:42",
    "url": "https://www.ft.com/content/c36f858f-73e2-478b-9fdb-92b9167ce37f"
  },
  {
    "id": "6fc92bd5-e79f-42a9-833c-74b8fffcf1a7",
    "title": "Carmakers face smaller cut in UK EV sales targets",
    "date": "2026-10-16",
    "time": "14:27",
    "url": "https://www.ft.com/content/6fc92bd5-e79f-42a9-833c-74b8fffcf1a7"
  },
  {
    "id": "4ad90130-8f3f-4770-8567-f5cb51497386",
    "title": "FTAV’s Friday charts quiz",
    "date": "2026-10-16",
    "time": "14:02",
    "url": "https://www.ft.com/content/4ad90130-8f3f-4770-8567-f5cb51497386"
  },
  {
    "id": "e3a17496-0dc2-42d8-ba7d-16a013016249",
    "title": "The new unequivocal Zelenskyy",
    "date": "2026-10-16",
    "time": "14:00",
    "url": "https://www.ft.com/content/e3a17496-0dc2-42d8-ba7d-16a013016249"
  },
  {
    "id": "24ea259d-da7a-4f5e-bb86-86b33e629a48",
    "title": "Albania PM refuses to resign as student protesters attack government buildings",
    "date": "2026-10-16",
    "time": "13:57",
    "url": "https://www.ft.com/content/24ea259d-da7a-4f5e-bb86-86b33e629a48"
  },
  {
    "id": "b3979904-2252-4934-9cff-729a815cb4b0",
    "title": "Starlink spectrum deal piles Elon Musk’s plate ever higher",
    "date": "2026-10-16",
    "time": "13:15",
    "url": "https://www.ft.com/content/b3979904-2252-4934-9cff-729a815cb4b0"
  },
  {
    "id": "4dffb678-9d90-46fa-b98e-40f988057984",
    "title": "World’s oldest gunmaker expands American foothold after boardroom tussle",
    "date": "2026-10-16",
    "time": "13:10",
    "url": "https://www.ft.com/content/4dffb678-9d90-46fa-b98e-40f988057984"
  },
  {
    "id": "247ab744-c56a-41cd-b391-502958c052f7",
    "title": "Burnham: straight-talker or loose cannon?",
    "date": "2026-10-16",
    "time": "12:47",
    "url": "https://www.ft.com/content/247ab744-c56a-41cd-b391-502958c052f7"
  },
  {
    "id": "d3ebfda8-4580-465a-bfb0-c1f5fe050ff7",
    "title": "NHS boss Penny Dash: ‘We can’t just blame the politicians’",
    "date": "2026-10-16",
    "time": "12:30",
    "url": "https://www.ft.com/content/d3ebfda8-4580-465a-bfb0-c1f5fe050ff7"
  },
  {
    "id": "8540ec79-705b-4ee0-b7d3-ce041d757ecd",
    "title": "Shareholders should have a say on making AI safe",
    "date": "2026-10-16",
    "time": "12:05",
    "url": "https://www.ft.com/content/8540ec79-705b-4ee0-b7d3-ce041d757ecd"
  },
  {
    "id": "bc221890-6718-4792-967c-9828e96f38af",
    "title": "The once-obscure tech at the heart of the green energy trade war",
    "date": "2026-10-16",
    "time": "12:01",
    "url": "https://www.ft.com/content/bc221890-6718-4792-967c-9828e96f38af"
  },
  {
    "id": "4c83ec2c-cd77-4f9b-94e6-fdf70af706ef",
    "title": "In Bangkok, central bankers push back on market rate-tightening bets",
    "date": "2026-10-16",
    "time": "11:51",
    "url": "https://www.ft.com/content/4c83ec2c-cd77-4f9b-94e6-fdf70af706ef"
  },
  {
    "id": "6b9b0cb6-2d47-46e4-bc00-febb182a5af7",
    "title": "Sizing that ‘unlimited’ insurance capital",
    "date": "2026-10-16",
    "time": "11:24",
    "url": "https://www.ft.com/content/6b9b0cb6-2d47-46e4-bc00-febb182a5af7"
  },
  {
    "id": "4c4f03f4-f878-4bd6-8128-5be7e3bb8ca1",
    "title": "Treasuries head for best week since February as AI jitters halt bond rout",
    "date": "2026-10-16",
    "time": "11:08",
    "url": "https://www.ft.com/content/4c4f03f4-f878-4bd6-8128-5be7e3bb8ca1"
  }
];
