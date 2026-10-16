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
  },
  {
    "id": "b6255adb-3ce5-4463-92cd-de2f8e9a1f74",
    "title": "‘Early days’ to see full effect of energy prices on inflation, BoE’s Bailey says",
    "date": "2026-10-16",
    "time": "04:12",
    "url": "https://www.ft.com/content/b6255adb-3ce5-4463-92cd-de2f8e9a1f74"
  },
  {
    "id": "50c694da-c485-4176-853b-daf643eabb5c",
    "title": "Harvard’s endowment returns surge on back of AI and SpaceX investments",
    "date": "2026-10-15",
    "time": "21:06",
    "url": "https://www.ft.com/content/50c694da-c485-4176-853b-daf643eabb5c"
  },
  {
    "id": "3568dbda-ac85-45b3-815a-3a8ec853a78d",
    "title": "Meta and Apple team up on AI model tailored for Mac computers",
    "date": "2026-10-15",
    "time": "21:00",
    "url": "https://www.ft.com/content/3568dbda-ac85-45b3-815a-3a8ec853a78d"
  },
  {
    "id": "9f269231-7c1a-4cb0-a4d3-0603f6cd73b6",
    "title": "Fifa president Gianni Infantino apologises for failed investment plan",
    "date": "2026-10-15",
    "time": "20:23",
    "url": "https://www.ft.com/content/9f269231-7c1a-4cb0-a4d3-0603f6cd73b6"
  },
  {
    "id": "a3a389d2-7796-4f40-98d3-8986f26f6513",
    "title": "Anthropic grants non-profit METR ‘employee-like’ access to monitor AI risks",
    "date": "2026-10-15",
    "time": "20:12",
    "url": "https://www.ft.com/content/a3a389d2-7796-4f40-98d3-8986f26f6513"
  },
  {
    "id": "09e07278-8479-49bb-a145-51e5d93828a2",
    "title": "Healey signals bank tax raid in UK Budget",
    "date": "2026-10-15",
    "time": "18:53",
    "url": "https://www.ft.com/content/09e07278-8479-49bb-a145-51e5d93828a2"
  },
  {
    "id": "66c9bbf1-f25c-4e84-b8ae-c9272fbc49c2",
    "title": "Bankers and advisers set for £334mn easyJet payout",
    "date": "2026-10-15",
    "time": "18:41",
    "url": "https://www.ft.com/content/66c9bbf1-f25c-4e84-b8ae-c9272fbc49c2"
  },
  {
    "id": "70f69253-6017-4259-95c9-48bf0e088b40",
    "title": "Criminals stole $90mn of crypto by hiding password readers in USB-like devices",
    "date": "2026-10-15",
    "time": "18:23",
    "url": "https://www.ft.com/content/70f69253-6017-4259-95c9-48bf0e088b40"
  },
  {
    "id": "5dd8b17e-b0a3-4b14-9d83-aba2627e635d",
    "title": "Risk of an AI crunch for stock markets is rising",
    "date": "2026-10-15",
    "time": "17:53",
    "url": "https://www.ft.com/content/5dd8b17e-b0a3-4b14-9d83-aba2627e635d"
  },
  {
    "id": "8890bf3f-f243-4bd0-8e2f-f80c78e363f8",
    "title": "Europe cannot rely on trade barriers to counter China",
    "date": "2026-10-15",
    "time": "17:35",
    "url": "https://www.ft.com/content/8890bf3f-f243-4bd0-8e2f-f80c78e363f8"
  },
  {
    "id": "064f7a19-c495-4ba0-a5e5-a6c4bb764ddb",
    "title": "Donald Trump cancels Pete Hegseth’s plan to livestream execution after backlash",
    "date": "2026-10-15",
    "time": "17:07",
    "url": "https://www.ft.com/content/064f7a19-c495-4ba0-a5e5-a6c4bb764ddb"
  },
  {
    "id": "086b7a80-acdd-48d2-bd5c-a04bad812264",
    "title": "In AI-dominated markets, LatAm debt is a diversifier",
    "date": "2026-10-15",
    "time": "16:51",
    "url": "https://www.ft.com/content/086b7a80-acdd-48d2-bd5c-a04bad812264"
  },
  {
    "id": "37d24217-acd8-4f84-a298-4f1ccc359a27",
    "title": "Mercuria adds first copper to US Project Vault stockpile",
    "date": "2026-10-15",
    "time": "16:43",
    "url": "https://www.ft.com/content/37d24217-acd8-4f84-a298-4f1ccc359a27"
  },
  {
    "id": "0a436452-c1a1-492a-b5be-92848ed5e6e7",
    "title": "Former Everton bidder Josh Wander to plead guilty in US fraud case",
    "date": "2026-10-15",
    "time": "16:33",
    "url": "https://www.ft.com/content/0a436452-c1a1-492a-b5be-92848ed5e6e7"
  },
  {
    "id": "678bcd31-6c2a-447b-a68c-ce6dec220bbc",
    "title": "Investors dump data centre bonds as AI borrowers face ‘Darwin moment’",
    "date": "2026-10-15",
    "time": "16:25",
    "url": "https://www.ft.com/content/678bcd31-6c2a-447b-a68c-ce6dec220bbc"
  },
  {
    "id": "0be97035-3854-4b6c-8191-98f486862b02",
    "title": "Saudi events delayed after Houthi attacks",
    "date": "2026-10-15",
    "time": "16:04",
    "url": "https://www.ft.com/content/0be97035-3854-4b6c-8191-98f486862b02"
  },
  {
    "id": "cf5f1209-da29-4ce1-b425-0e83818bf9ec",
    "title": "Treasuries rally as investors seek shelter from AI turbulence",
    "date": "2026-10-15",
    "time": "15:56",
    "url": "https://www.ft.com/content/cf5f1209-da29-4ce1-b425-0e83818bf9ec"
  },
  {
    "id": "33aca8da-f22c-41e5-8255-289ae7d58ee7",
    "title": "Monte dei Paschi should try the ‘just say maybe’ bid defence",
    "date": "2026-10-15",
    "time": "15:23",
    "url": "https://www.ft.com/content/33aca8da-f22c-41e5-8255-289ae7d58ee7"
  },
  {
    "id": "15d18ed4-543d-4004-ae38-f429a118daab",
    "title": "Anglo American chief says tech giants show ‘deep interest’ in mining stakes",
    "date": "2026-10-15",
    "time": "15:19",
    "url": "https://www.ft.com/content/15d18ed4-543d-4004-ae38-f429a118daab"
  }
];
