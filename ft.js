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
    id: "1cc67221-b54e-4ff9-a499-01209c7999d8",
    title: "Pope makes rare address at France’s Élysée Palace",
    date: "2026-09-25",
    time: "15:53",
    url: "https://www.ft.com/content/1cc67221-b54e-4ff9-a499-01209c7999d8"
  },
  {
    id: "c0cffdfc-ad4b-48dc-9894-c1e8492962c7",
    title: "The challenge for Burnham: words are no longer enough",
    date: "2026-09-25",
    time: "15:28",
    url: "https://www.ft.com/content/c0cffdfc-ad4b-48dc-9894-c1e8492962c7"
  },
  {
    id: "82933f2b-84ec-467f-9bd0-b36b41a849cd",
    title: "UK graduates paying 50% more of university costs since 2012",
    date: "2026-09-25",
    time: "15:20",
    url: "https://www.ft.com/content/82933f2b-84ec-467f-9bd0-b36b41a849cd"
  },
  {
    id: "ad2f9563-7853-4a6a-b46c-fe6afeccbbc0",
    title: "Private equity-backed Florida railway company Brightline files for bankruptcy",
    date: "2026-09-25",
    time: "14:55",
    url: "https://www.ft.com/content/ad2f9563-7853-4a6a-b46c-fe6afeccbbc0"
  },
  {
    id: "07a246f8-d81d-4b43-9aa3-16153fc0fac9",
    title: "Lawyers join microchips on the list of data centre must-haves",
    date: "2026-09-25",
    time: "14:46",
    url: "https://www.ft.com/content/07a246f8-d81d-4b43-9aa3-16153fc0fac9"
  },
  {
    id: "7c43f989-6902-4979-b36b-a6211930f4ce",
    title: "Trump is not going to drop Canada",
    date: "2026-09-25",
    time: "14:00",
    url: "https://www.ft.com/content/7c43f989-6902-4979-b36b-a6211930f4ce"
  },
  {
    id: "a255d9e6-ae6f-4b30-9ca6-b694663f547c",
    title: "Houthis promise not to target European ships",
    date: "2026-09-25",
    time: "13:47",
    url: "https://www.ft.com/content/a255d9e6-ae6f-4b30-9ca6-b694663f547c"
  },
  {
    id: "14aed3cb-492e-45c1-b217-869790b6130d",
    title: "Bitget crypto exchange hit by $350mn hack",
    date: "2026-09-25",
    time: "13:46",
    url: "https://www.ft.com/content/14aed3cb-492e-45c1-b217-869790b6130d"
  },
  {
    id: "8f1030c3-9ad0-45b2-86bf-71d8dec27be4",
    title: "Former US intelligence chief Avril Haines: ‘Trump trusts his gut more than the expertise’",
    date: "2026-09-25",
    time: "13:00",
    url: "https://www.ft.com/content/8f1030c3-9ad0-45b2-86bf-71d8dec27be4"
  },
  {
    id: "d0541f2b-f15c-4975-9c44-14f1dbd32b73",
    title: "Will Burnham call a snap election?",
    date: "2026-09-25",
    time: "12:55",
    url: "https://www.ft.com/content/d0541f2b-f15c-4975-9c44-14f1dbd32b73"
  },
  {
    id: "702d053a-0100-4160-9996-0b5d8502d512",
    title: "International Criminal Court is insulated against US sanctions, says deputy prosecutor",
    date: "2026-09-25",
    time: "12:17",
    url: "https://www.ft.com/content/702d053a-0100-4160-9996-0b5d8502d512"
  },
  {
    id: "35a3a327-bb57-4070-942f-5988be564072",
    title: "BASF makes takeover approach for chemicals rival Evonik",
    date: "2026-09-25",
    time: "12:07",
    url: "https://www.ft.com/content/35a3a327-bb57-4070-942f-5988be564072"
  },
  {
    id: "7fbecb15-c396-49d2-8cab-1518809a7b2b",
    title: "Russia targets Ukraine’s data centres",
    date: "2026-09-25",
    time: "12:00",
    url: "https://www.ft.com/content/7fbecb15-c396-49d2-8cab-1518809a7b2b"
  },
  {
    id: "91f6e99d-b953-4056-ae72-30464b87ab5c",
    title: "FirstFT: The Xi-Trump finale",
    date: "2026-09-25",
    time: "11:01",
    url: "https://www.ft.com/content/91f6e99d-b953-4056-ae72-30464b87ab5c"
  },
  {
    id: "1477567d-64b0-431a-b707-e2a4f5a9f8dc",
    title: "US seizes bank accounts of payments group working for Tether’s and Bitfinex’s bank",
    date: "2026-09-25",
    time: "10:58",
    url: "https://www.ft.com/content/1477567d-64b0-431a-b707-e2a4f5a9f8dc"
  },
  {
    id: "6f6c698a-e1eb-4ce0-b4b0-6c54cdd67850",
    title: "Airbus offers divestments to secure Brussels backing for space merger",
    date: "2026-09-25",
    time: "10:25",
    url: "https://www.ft.com/content/6f6c698a-e1eb-4ce0-b4b0-6c54cdd67850"
  },
  {
    id: "bec22e6b-1267-4d9f-a192-60763a0797c3",
    title: "Donald Trump’s US no longer a reliable ally, warns Belgium in leaked document",
    date: "2026-09-25",
    time: "10:10",
    url: "https://www.ft.com/content/bec22e6b-1267-4d9f-a192-60763a0797c3"
  },
  {
    id: "218f8e15-8c1e-4ed4-9d51-7879faca8e73",
    title: "ArcelorMittal to shutter Ukraine plant after Russian strikes kill workers",
    date: "2026-09-25",
    time: "10:03",
    url: "https://www.ft.com/content/218f8e15-8c1e-4ed4-9d51-7879faca8e73"
  },
  {
    id: "067a98e2-4a72-49b2-ac7f-3897305650bd",
    title: "The dangers of devolution dogma",
    date: "2026-09-25",
    time: "09:45",
    url: "https://www.ft.com/content/067a98e2-4a72-49b2-ac7f-3897305650bd"
  },
  {
    id: "8c61f284-46d0-401c-bf05-ca5aeeae2e6d",
    title: "Poundland owner demands £30mn for chain it bought for less than £1",
    date: "2026-09-25",
    time: "09:36",
    url: "https://www.ft.com/content/8c61f284-46d0-401c-bf05-ca5aeeae2e6d"
  },
  {
    id: "fad8bcc7-6963-4d81-8aa4-f88869297cdb",
    title: "Fitzcarraldo – inside the chicest publisher on earth",
    date: "2026-09-25",
    time: "09:30",
    url: "https://www.ft.com/content/fad8bcc7-6963-4d81-8aa4-f88869297cdb"
  },
  {
    id: "0c5da9f2-f6aa-4514-910d-5337207e1233",
    title: "UAE halts Iranian flights over US sanctions",
    date: "2026-09-25",
    time: "09:11",
    url: "https://www.ft.com/content/0c5da9f2-f6aa-4514-910d-5337207e1233"
  },
  {
    id: "4d9a6492-bd8c-43ca-bca8-309aa8f43ab6",
    title: "FTAV’s further reading",
    date: "2026-09-25",
    time: "08:38",
    url: "https://www.ft.com/content/4d9a6492-bd8c-43ca-bca8-309aa8f43ab6"
  },
  {
    id: "c5af4151-2c14-481b-8145-f5ec1f43a3f4",
    title: "Japanese government bond yields hit new high as global sell-off continues",
    date: "2026-09-25",
    time: "06:41",
    url: "https://www.ft.com/content/c5af4151-2c14-481b-8145-f5ec1f43a3f4"
  },
  {
    id: "b8817c5a-fc54-4add-bd5c-d1247729b95d",
    title: "Bonds can keep falling",
    date: "2026-09-25",
    time: "06:30",
    url: "https://www.ft.com/content/b8817c5a-fc54-4add-bd5c-d1247729b95d"
  },
  {
    id: "5ccabdf1-3b10-430b-b1a4-b3acddccfbf9",
    title: "Brussels warns capitals to tackle energy crisis or see far right take power",
    date: "2026-09-25",
    time: "06:00",
    url: "https://www.ft.com/content/5ccabdf1-3b10-430b-b1a4-b3acddccfbf9"
  },
  {
    id: "0fd15797-ac89-4222-a4bb-03a6a1330f48",
    title: "SpaceX pivots away from space",
    date: "2026-09-25",
    time: "06:00",
    url: "https://www.ft.com/content/0fd15797-ac89-4222-a4bb-03a6a1330f48"
  },
  {
    id: "901ccfbc-6ddb-4fb3-b74d-1f337efca9ff",
    title: "Donald Trump raised weak yen with Sanae Takaichi, Japan finance minister says",
    date: "2026-09-25",
    time: "05:58",
    url: "https://www.ft.com/content/901ccfbc-6ddb-4fb3-b74d-1f337efca9ff"
  },
  {
    id: "eb8cd27d-cffc-4d43-bf4e-7a46943a0f68",
    title: "Bank of England to raise rates in November if energy prices remain high",
    date: "2026-09-25",
    time: "05:30",
    url: "https://www.ft.com/content/eb8cd27d-cffc-4d43-bf4e-7a46943a0f68"
  },
  {
    id: "e67c93cc-9841-4720-b7c0-efa2d21990c8",
    title: "Innovative Lawyers: Europe",
    date: "2026-09-25",
    time: "05:04",
    url: "https://www.ft.com/content/e67c93cc-9841-4720-b7c0-efa2d21990c8"
  },
  {
    id: "24c13fd3-5de5-4916-8300-ec3073027ff6",
    title: "Xi Jinping says US and China must ‘coexist in peace’ at White House visit",
    date: "2026-09-25",
    time: "05:02",
    url: "https://www.ft.com/content/24c13fd3-5de5-4916-8300-ec3073027ff6"
  },
  {
    id: "43bc246e-67c6-491a-992f-dc8791e5dcf0",
    title: "The man who has been walking home since 1998",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/43bc246e-67c6-491a-992f-dc8791e5dcf0"
  },
  {
    id: "e2658a67-32f7-4444-b0f1-e0e8eddd2d59",
    title: "The shale wildcatter lambasting Exxon",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/e2658a67-32f7-4444-b0f1-e0e8eddd2d59"
  },
  {
    id: "88526316-f378-4e59-ae52-75dbffdbe049",
    title: "Peter Hargreaves: Britain cannot afford to lose more ‘big taxpayers’",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/88526316-f378-4e59-ae52-75dbffdbe049"
  },
  {
    id: "91684f96-6c7b-4b25-8486-d810d2088f9e",
    title: "Brussels pushes Donald Trump to maintain ‘free flow’ of diesel",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/91684f96-6c7b-4b25-8486-d810d2088f9e"
  },
  {
    id: "5308cce5-ba65-45e8-b9f4-59ea8b3cd900",
    title: "No product, no problem: investors place big bets on AI neolabs",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/5308cce5-ba65-45e8-b9f4-59ea8b3cd900"
  },
  {
    id: "fe377a54-88d7-4d6c-a763-fd56bc608827",
    title: "Russia expands fleet as crackdown on stateless vessels intensifies",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/fe377a54-88d7-4d6c-a763-fd56bc608827"
  },
  {
    id: "7273f2f9-e630-479d-a1b7-ba29cbb96b5e",
    title: "David Beckham takes $51mn dividend as World Cup deals lift earnings",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/7273f2f9-e630-479d-a1b7-ba29cbb96b5e"
  },
  {
    id: "53370e68-5702-486a-8c4b-a78d941c5ea6",
    title: "Britain in ‘good position’, Pat McFadden tells business fearful of tax hikes",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/53370e68-5702-486a-8c4b-a78d941c5ea6"
  },
  {
    id: "0206443e-a4ca-4316-a583-267aa74b0298",
    title: "Burnham’s opposition to Heathrow expansion puts third runway in doubt",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/0206443e-a4ca-4316-a583-267aa74b0298"
  },
  {
    id: "ff849846-8b3f-4d1f-8bbe-9d25be83225d",
    title: "Blackstone’s insurance plans will help London, if not its old guard",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/ff849846-8b3f-4d1f-8bbe-9d25be83225d"
  }
];
