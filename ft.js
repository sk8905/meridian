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
    id: "15eac7b8-df53-41f4-bf51-bc28225eec51",
    title: "‘A game of snakes and ladders’",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/15eac7b8-df53-41f4-bf51-bc28225eec51"
  },
  {
    id: "c913d391-f4e2-439c-82d6-8f6205b31b0f",
    title: "EU hybrid curbs to offer only ‘temporary’ respite against Chinese carmakers",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/c913d391-f4e2-439c-82d6-8f6205b31b0f"
  },
  {
    id: "93c7f91d-7daa-44bb-8a45-62b214106e73",
    title: "Pope Leo prepares to undergo lung surgery",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/93c7f91d-7daa-44bb-8a45-62b214106e73"
  },
  {
    id: "6fa735a2-a590-4461-b092-920ba489e7a8",
    title: "Investors brave US Treasury rout to lock in highest yields in decades",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/6fa735a2-a590-4461-b092-920ba489e7a8"
  },
  {
    id: "ec433e1f-bdb4-4a1c-868e-e1c7c4121f45",
    title: "The election supercycle set to drag Europe right",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/ec433e1f-bdb4-4a1c-868e-e1c7c4121f45"
  },
  {
    id: "6219e3f2-e9c1-48d4-ae47-1337e636ce0a",
    title: "Informa’s trade show bet has a vulnerability — geopolitics",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/6219e3f2-e9c1-48d4-ae47-1337e636ce0a"
  },
  {
    id: "39da2672-e57a-41aa-8f03-970ae37d88a6",
    title: "How BT’s TalkTalk swoop left broadband rivals fuming",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/39da2672-e57a-41aa-8f03-970ae37d88a6"
  },
  {
    id: "e3b31db9-5fe2-4ce8-a1f4-0327c69900a8",
    title: "Trump’s loan to a US defence start-up adds to Apollo’s war chest too",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/e3b31db9-5fe2-4ce8-a1f4-0327c69900a8"
  },
  {
    id: "1724a30e-cf50-4a4e-ade8-bca72ea4b9a1",
    title: "Why Trump is going for Zelenskyy’s jugular",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/1724a30e-cf50-4a4e-ade8-bca72ea4b9a1"
  },
  {
    id: "bbe24952-d66f-480e-b0a8-94339d75bc48",
    title: "UK chances of keeping £3.8bn bitcoin haul rise after High Court ruling",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/bbe24952-d66f-480e-b0a8-94339d75bc48"
  },
  {
    id: "c16b5a2d-f653-494f-9c18-587685f34bc2",
    title: "Companies face rising number of UK complaints over conduct",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/c16b5a2d-f653-494f-9c18-587685f34bc2"
  },
  {
    id: "16e1d29b-3680-4712-b8e7-ed4a4125041a",
    title: "Who’s really hiring you — HR or cyber security?",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/16e1d29b-3680-4712-b8e7-ed4a4125041a"
  },
  {
    id: "2caa52e1-637a-4934-802e-418b649b4c12",
    title: "Criminals could walk free without controls on AI use, police watchdog warns",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/2caa52e1-637a-4934-802e-418b649b4c12"
  },
  {
    id: "f01b8a11-559f-4a65-a642-246b78bbdd93",
    title: "The best gilets for finance bros",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/f01b8a11-559f-4a65-a642-246b78bbdd93"
  },
  {
    id: "83d2fb38-4b98-40c4-b700-39190b605e38",
    title: "Daisy Lafarge wants to dress her disability differently",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/83d2fb38-4b98-40c4-b700-39190b605e38"
  },
  {
    id: "f304f929-62b7-4c15-8da4-5dcfb78b8117",
    title: "Landowners should look to regenerative agriculture for their future",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/f304f929-62b7-4c15-8da4-5dcfb78b8117"
  },
  {
    id: "15ae6a2e-6010-4d78-a752-2eeeca1e1c55",
    title: "Will Accenture survive or thrive in the age of AI?",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/15ae6a2e-6010-4d78-a752-2eeeca1e1c55"
  },
  {
    id: "6cfc1469-df2d-4f56-953a-77a15ed26e1f",
    title: "Unreliable Boyfriend — Chrystia Freeland’s roadmap for dealing with a chaotic superpower",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/6cfc1469-df2d-4f56-953a-77a15ed26e1f"
  },
  {
    id: "987c9d16-f77c-4307-a9a8-66d67da5f658",
    title: "Biotech start-ups turn to reverse mergers to fast-track listings",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/987c9d16-f77c-4307-a9a8-66d67da5f658"
  },
  {
    id: "080dfd83-3d5b-4256-a002-3e61e4c0a1c8",
    title: "Selling a home? Think documents before decor",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/080dfd83-3d5b-4256-a002-3e61e4c0a1c8"
  },
  {
    id: "09f24d32-9bc5-4011-85f8-410625e7717f",
    title: "Can a financier really revive LIV Golf?",
    date: "2026-10-12",
    time: "14:59",
    url: "https://www.ft.com/content/09f24d32-9bc5-4011-85f8-410625e7717f"
  },
  {
    id: "da71c823-ca31-4eaa-8e6e-6baacea986a4",
    title: "Nato’s supreme commander warns Moscow against attacks in Europe",
    date: "2026-10-12",
    time: "14:34",
    url: "https://www.ft.com/content/da71c823-ca31-4eaa-8e6e-6baacea986a4"
  },
  {
    id: "a663781e-2709-41f2-99df-4fb5a6162e6b",
    title: "Diesel prices slip after Trump claims ‘energy ceasefire’ in Ukraine war",
    date: "2026-10-12",
    time: "14:23",
    url: "https://www.ft.com/content/a663781e-2709-41f2-99df-4fb5a6162e6b"
  },
  {
    id: "af0a5da6-abc7-41ab-85cf-da806fc7a6e5",
    title: "Franco-German deal on EU car policy is ‘imminent’, says Emmanuel Macron",
    date: "2026-10-12",
    time: "14:10",
    url: "https://www.ft.com/content/af0a5da6-abc7-41ab-85cf-da806fc7a6e5"
  },
  {
    id: "e374bc1a-bd56-40b4-98c9-d1b502ef9d47",
    title: "Europe is finally confronting China",
    date: "2026-10-12",
    time: "14:00",
    url: "https://www.ft.com/content/e374bc1a-bd56-40b4-98c9-d1b502ef9d47"
  },
  {
    id: "e67a9120-4dec-4796-8414-3f4990b01f11",
    title: "Labour plan to cut funds from heat pump scheme sparks industry backlash",
    date: "2026-10-12",
    time: "13:26",
    url: "https://www.ft.com/content/e67a9120-4dec-4796-8414-3f4990b01f11"
  },
  {
    id: "463be44f-5477-46e6-b4d2-460fa2551064",
    title: "India’s Narendra Modi faces ‘bitter pill’ as Cockroach protests mount",
    date: "2026-10-12",
    time: "13:08",
    url: "https://www.ft.com/content/463be44f-5477-46e6-b4d2-460fa2551064"
  },
  {
    id: "ba28b7cd-293e-4eee-a073-ad81aaefced3",
    title: "AI regulation must mimic Industrial Revolution laws, UK minister says",
    date: "2026-10-12",
    time: "13:01",
    url: "https://www.ft.com/content/ba28b7cd-293e-4eee-a073-ad81aaefced3"
  },
  {
    id: "90d5003e-dbec-4db3-88d2-d30d9c2a119d",
    title: "The EU has more bark but lacks bite towards China",
    date: "2026-10-12",
    time: "12:31",
    url: "https://www.ft.com/content/90d5003e-dbec-4db3-88d2-d30d9c2a119d"
  },
  {
    id: "863619b6-c4a7-4b1a-8a53-6950d47d1833",
    title: "Putin is breaching Trump’s ‘energy ceasefire’, Zelenskyy says",
    date: "2026-10-12",
    time: "12:22",
    url: "https://www.ft.com/content/863619b6-c4a7-4b1a-8a53-6950d47d1833"
  },
  {
    id: "c5ff7ed6-a42d-4ff3-8efa-485b1046102d",
    title: "Prune Nourry: how I resurrected Paris’s forgotten female artists",
    date: "2026-10-12",
    time: "12:00",
    url: "https://www.ft.com/content/c5ff7ed6-a42d-4ff3-8efa-485b1046102d"
  },
  {
    id: "910e014c-4716-49e2-86cc-53eae31c9607",
    title: "Redwood — Ben Macintyre decodes the murky ethics of the cold war",
    date: "2026-10-12",
    time: "12:00",
    url: "https://www.ft.com/content/910e014c-4716-49e2-86cc-53eae31c9607"
  },
  {
    id: "48b8c4ce-b2bf-44e2-badf-8159a9d664e4",
    title: "Private equity puts string of UK high street names up for sale",
    date: "2026-10-12",
    time: "12:00",
    url: "https://www.ft.com/content/48b8c4ce-b2bf-44e2-badf-8159a9d664e4"
  },
  {
    id: "0a66d390-149d-4cdc-83b6-88015da1e835",
    title: "Britain, Brexit and the cat-flap option",
    date: "2026-10-12",
    time: "11:59",
    url: "https://www.ft.com/content/0a66d390-149d-4cdc-83b6-88015da1e835"
  },
  {
    id: "51089f41-6f8b-4381-aab5-a83bbe4048c4",
    title: "Whisky highballs, fantastic fairies and a very White House indeed – don’t miss HTSI’s top reads",
    date: "2026-10-12",
    time: "11:44",
    url: "https://www.ft.com/content/51089f41-6f8b-4381-aab5-a83bbe4048c4"
  },
  {
    id: "011a7926-402e-4baa-90ba-bab4a44a74de",
    title: "Rejecting closer ties with EU would be ‘dereliction of duty’, Burnham says",
    date: "2026-10-12",
    time: "11:30",
    url: "https://www.ft.com/content/011a7926-402e-4baa-90ba-bab4a44a74de"
  },
  {
    id: "7dc561ba-a386-479d-9633-9209b76b1812",
    title: "FirstFT: Diesel prices slip after Trump announces ‘energy ceasefire’",
    date: "2026-10-12",
    time: "11:24",
    url: "https://www.ft.com/content/7dc561ba-a386-479d-9633-9209b76b1812"
  },
  {
    id: "d154e42d-5243-44f3-a837-a67681e20311",
    title: "To the manor reborn",
    date: "2026-10-12",
    time: "11:00",
    url: "https://www.ft.com/content/d154e42d-5243-44f3-a837-a67681e20311"
  },
  {
    id: "46b33d0d-274d-496e-9c42-1d4cf18b65cb",
    title: "German labour minister resigns as Merz coalition strains deepen",
    date: "2026-10-12",
    time: "10:27",
    url: "https://www.ft.com/content/46b33d0d-274d-496e-9c42-1d4cf18b65cb"
  },
  {
    id: "f4463a28-832d-4a2d-acc5-d83e258610cb",
    title: "Nobel Prize for economics awarded to Robert E Hall and Michael Woodford",
    date: "2026-10-12",
    time: "10:09",
    url: "https://www.ft.com/content/f4463a28-832d-4a2d-acc5-d83e258610cb"
  }
];
