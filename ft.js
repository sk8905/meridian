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
  },
  {
    "id": "753fa2ed-1763-462b-a4c0-ded9b53baf3c",
    "title": "Indonesia stocks plunge after MSCI says market could be cut from indices",
    "date": "2026-10-16",
    "time": "11:06",
    "url": "https://www.ft.com/content/753fa2ed-1763-462b-a4c0-ded9b53baf3c"
  },
  {
    "id": "b739fd97-d839-4287-ab91-45fcedaec76a",
    "title": "‘We’re potty for vintage Polo Ralph Lauren’",
    "date": "2026-10-16",
    "time": "11:00",
    "url": "https://www.ft.com/content/b739fd97-d839-4287-ab91-45fcedaec76a"
  },
  {
    "id": "e2acd655-0a6a-4de6-9404-c838f6e7b8cb",
    "title": "Republicans turn on Donald Trump’s tariffs in battle for ‘political survival’",
    "date": "2026-10-16",
    "time": "11:00",
    "url": "https://www.ft.com/content/e2acd655-0a6a-4de6-9404-c838f6e7b8cb"
  },
  {
    "id": "c62481a2-eb6c-4ab8-b226-47efd50affcd",
    "title": "Should I be stockpiling for an emergency?",
    "date": "2026-10-16",
    "time": "11:00",
    "url": "https://www.ft.com/content/c62481a2-eb6c-4ab8-b226-47efd50affcd"
  },
  {
    "id": "ee6dfd48-fa31-4bde-9962-2f9f09c36798",
    "title": "EU vows to maintain Russia sanctions after US pivot",
    "date": "2026-10-16",
    "time": "10:26",
    "url": "https://www.ft.com/content/ee6dfd48-fa31-4bde-9962-2f9f09c36798"
  },
  {
    "id": "42eb2851-ddc2-4f13-a55b-8f50cf43443b",
    "title": "No, Sally Rooney’s books are not ‘banned’ from the UK",
    "date": "2026-10-16",
    "time": "09:30",
    "url": "https://www.ft.com/content/42eb2851-ddc2-4f13-a55b-8f50cf43443b"
  },
  {
    "id": "be1019ac-1023-45b0-835f-d111f2b2b741",
    "title": "Inside this Hudson Valley home, every room is a time capsule",
    "date": "2026-10-16",
    "time": "09:30",
    "url": "https://www.ft.com/content/be1019ac-1023-45b0-835f-d111f2b2b741"
  },
  {
    "id": "76265c1d-3a38-4d11-8e4a-2a4c1ecfae1c",
    "title": "From fashion to finca: the McQueen PR who escaped to Ibiza",
    "date": "2026-10-16",
    "time": "09:30",
    "url": "https://www.ft.com/content/76265c1d-3a38-4d11-8e4a-2a4c1ecfae1c"
  },
  {
    "id": "650f6b11-67fb-40cf-baea-cd6c321e51de",
    "title": "Tim Smit on the glories of the Eden Project – 25 years later",
    "date": "2026-10-16",
    "time": "09:30",
    "url": "https://www.ft.com/content/650f6b11-67fb-40cf-baea-cd6c321e51de"
  },
  {
    "id": "06d33c3b-d06c-47da-837b-a6b1c81f621d",
    "title": "ELV Denim is bringing a couture touch to Sanderson offcuts",
    "date": "2026-10-16",
    "time": "09:30",
    "url": "https://www.ft.com/content/06d33c3b-d06c-47da-837b-a6b1c81f621d"
  },
  {
    "id": "83a8155d-a4f5-4ef8-96af-502ca8f4a279",
    "title": "Antoine Billore – the cheekiest boy in antiques",
    "date": "2026-10-16",
    "time": "09:30",
    "url": "https://www.ft.com/content/83a8155d-a4f5-4ef8-96af-502ca8f4a279"
  },
  {
    "id": "fca7f5ff-94c8-4c78-90cb-d458fd27724a",
    "title": "FTAV’s further reading",
    "date": "2026-10-16",
    "time": "06:30",
    "url": "https://www.ft.com/content/fca7f5ff-94c8-4c78-90cb-d458fd27724a"
  },
  {
    "id": "6533c873-29df-453b-9ac4-7b17e5a3576f",
    "title": "Hiding from the everything trade",
    "date": "2026-10-16",
    "time": "06:30",
    "url": "https://www.ft.com/content/6533c873-29df-453b-9ac4-7b17e5a3576f"
  },
  {
    "id": "95a8e05d-fc20-441d-b271-64e87fe41f76",
    "title": "Dollar weakens as Fed chair Kevin Warsh declines to hint at October rate rise",
    "date": "2026-10-16",
    "time": "06:25",
    "url": "https://www.ft.com/content/95a8e05d-fc20-441d-b271-64e87fe41f76"
  },
  {
    "id": "1cda1563-9f99-4993-9373-5d1b4dfe8c98",
    "title": "EU resists bid to weaken emissions rules as leaders spar over energy costs",
    "date": "2026-10-16",
    "time": "06:00",
    "url": "https://www.ft.com/content/1cda1563-9f99-4993-9373-5d1b4dfe8c98"
  },
  {
    "id": "d36787c1-f0b0-4445-8237-90eb4d521081",
    "title": "So. About next year’s earnings . . .",
    "date": "2026-10-16",
    "time": "06:00",
    "url": "https://www.ft.com/content/d36787c1-f0b0-4445-8237-90eb4d521081"
  }
];
