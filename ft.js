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
  },
  {
    "id": "537c9a68-7b6f-41a7-80ff-acac5c52e80d",
    "title": "The data centre IPO debacle that sparked a market meltdown",
    "date": "2026-10-16",
    "time": "05:54",
    "url": "https://www.ft.com/content/537c9a68-7b6f-41a7-80ff-acac5c52e80d"
  },
  {
    "id": "246f1614-cd9a-4747-bc58-97e9cb10fb4b",
    "title": "FirstFT: Healey signals tax raid on banks in UK Budget",
    "date": "2026-10-16",
    "time": "05:33",
    "url": "https://www.ft.com/content/246f1614-cd9a-4747-bc58-97e9cb10fb4b"
  },
  {
    "id": "155bc83f-655d-4891-a431-aa5e1e1ce96a",
    "title": "Has London’s £5bn ‘super sewer’ improved water quality in the Thames?",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/155bc83f-655d-4891-a431-aa5e1e1ce96a"
  },
  {
    "id": "dcab1c7f-00aa-4194-bdb1-0a0c6712e4e8",
    "title": "Canary Wharf developer George Iacobescu overseeing new London skyscraper",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/dcab1c7f-00aa-4194-bdb1-0a0c6712e4e8"
  },
  {
    "id": "56d14d34-955a-41e9-90da-5eda7d179509",
    "title": "How Trump’s America fell in love with UFC",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/56d14d34-955a-41e9-90da-5eda7d179509"
  },
  {
    "id": "efe55232-3a97-4b3e-825b-64af4e7edb90",
    "title": "Postcard from Chester: high spirits and loud voices at the World Town Crier Tournament",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/efe55232-3a97-4b3e-825b-64af4e7edb90"
  },
  {
    "id": "6a1ecb1a-a998-4cbb-be54-22df550a66ee",
    "title": "Wall Street’s AI wobbles",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/6a1ecb1a-a998-4cbb-be54-22df550a66ee"
  },
  {
    "id": "c6e911dd-440b-4852-925c-448faeb52d98",
    "title": "Young people to get less cash but more job support under Milburn welfare plan",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/c6e911dd-440b-4852-925c-448faeb52d98"
  },
  {
    "id": "0ce2a031-5c81-4b48-a4b1-d19585fd3a66",
    "title": "Why law firms should resist the lure of the AI spin-off",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/0ce2a031-5c81-4b48-a4b1-d19585fd3a66"
  },
  {
    "id": "5a310aee-f555-4266-874c-b1b4db20186d",
    "title": "Anthropic secured highest junk credit rating in June",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/5a310aee-f555-4266-874c-b1b4db20186d"
  },
  {
    "id": "1bd1cdc2-9dc1-4538-8820-129e9bd9117b",
    "title": "UK government courted UBS over London HQ move",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/1bd1cdc2-9dc1-4538-8820-129e9bd9117b"
  },
  {
    "id": "9585ba4d-5036-4f5d-9656-0dc4f6bdee4e",
    "title": "The secret fight around financial flows",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/9585ba4d-5036-4f5d-9656-0dc4f6bdee4e"
  },
  {
    "id": "586218d3-6943-4690-8dd8-63dd329c781d",
    "title": "US business leaders are waking up to the perils of plutopopulism",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/586218d3-6943-4690-8dd8-63dd329c781d"
  },
  {
    "id": "7a260d99-c761-4ab1-8185-d7e0225a8472",
    "title": "What do the Houthis want?",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/7a260d99-c761-4ab1-8185-d7e0225a8472"
  },
  {
    "id": "2839679e-f329-41f0-a252-93444e81252c",
    "title": "Airlines should give up their fuel-hedging dogfight",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/2839679e-f329-41f0-a252-93444e81252c"
  },
  {
    "id": "4dfcf1ba-0b8e-4198-b0a4-e975ebde9066",
    "title": "Why is the fintech boom failing to improve fin-lit?",
    "date": "2026-10-16",
    "time": "05:00",
    "url": "https://www.ft.com/content/4dfcf1ba-0b8e-4198-b0a4-e975ebde9066"
  }
];
