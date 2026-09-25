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
  },
  {
    id: "5453be91-7bd9-4097-9e83-870354d3a248",
    title: "EU urges UK to raise tariffs on Chinese cars to avoid ‘made in Europe’ barriers",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/5453be91-7bd9-4097-9e83-870354d3a248"
  },
  {
    id: "e8a815e6-a105-42ea-938e-352b8c8d5c3b",
    title: "Maga base recoils as Donald Trump goes all-in on AI",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/e8a815e6-a105-42ea-938e-352b8c8d5c3b"
  },
  {
    id: "456884ea-2558-4648-8036-a77b73733430",
    title: "The cheap new AI model taking aim at OpenAI and Anthropic",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/456884ea-2558-4648-8036-a77b73733430"
  },
  {
    id: "684d54f5-5f31-4f77-9e52-ba4f71aa0510",
    title: "What Burnham means for business",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/684d54f5-5f31-4f77-9e52-ba4f71aa0510"
  },
  {
    id: "8b1b398d-da7d-4dda-aa64-b7a42c59fd7e",
    title: "Wall Street boutiques balk at Saudi Arabia’s HQ rules",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/8b1b398d-da7d-4dda-aa64-b7a42c59fd7e"
  },
  {
    id: "18100905-9c67-4395-adca-373fd254d652",
    title: "Practice of law: case studies",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/18100905-9c67-4395-adca-373fd254d652"
  },
  {
    id: "7bf86647-32f0-4f0c-b46b-2f4d690fa51e",
    title: "AI shakes up in-house legal teams’ work practices",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/7bf86647-32f0-4f0c-b46b-2f4d690fa51e"
  },
  {
    id: "ed84121f-37e4-4c33-827b-4440be52aec0",
    title: "Business of law: case studies",
    date: "2026-09-25",
    time: "05:00",
    url: "https://www.ft.com/content/ed84121f-37e4-4c33-827b-4440be52aec0"
  },
  {
    id: "82b3b8ab-4bc5-4f56-b337-77cf5601e02c",
    title: "Brexit and Donald Trump’s tariffs push UK’s food and drink trade deficit to £21bn",
    date: "2026-09-25",
    time: "00:01",
    url: "https://www.ft.com/content/82b3b8ab-4bc5-4f56-b337-77cf5601e02c"
  },
  {
    id: "2b863510-9d56-4bf2-a270-52a0ab25a2b7",
    title: "US intervenes in Elon Musk’s legal challenge to EU fine against X",
    date: "2026-09-24",
    time: "23:48",
    url: "https://www.ft.com/content/2b863510-9d56-4bf2-a270-52a0ab25a2b7"
  },
  {
    id: "3ab22092-5d60-457e-a88c-cf9062887ed1",
    title: "Police charge anti-migrant protest leader over damage to dinghy in Channel",
    date: "2026-09-24",
    time: "23:15",
    url: "https://www.ft.com/content/3ab22092-5d60-457e-a88c-cf9062887ed1"
  },
  {
    id: "91f6e99d-b953-4056-ae72-30464b87ab5c",
    title: "FirstFT: Xi Jinping says US and China must ‘coexist in peace’ at White House summit",
    date: "2026-09-24",
    time: "22:33",
    url: "https://www.ft.com/content/91f6e99d-b953-4056-ae72-30464b87ab5c"
  },
  {
    id: "2a77e2f7-3c22-4082-8bb3-492675f46c77",
    title: "OpenAI breach of Australian government linked to wider AI hacking campaign",
    date: "2026-09-24",
    time: "22:06",
    url: "https://www.ft.com/content/2a77e2f7-3c22-4082-8bb3-492675f46c77"
  },
  {
    id: "19b54cea-1fdc-40ba-b09b-d289b7f39295",
    title: "Australia’s rival football giants kick off global growth push",
    date: "2026-09-24",
    time: "22:00",
    url: "https://www.ft.com/content/19b54cea-1fdc-40ba-b09b-d289b7f39295"
  },
  {
    id: "17b09993-8fed-47d1-9c04-e2d29ca75615",
    title: "SoftBank pays steep price for record bond sale to fund OpenAI bet",
    date: "2026-09-24",
    time: "20:39",
    url: "https://www.ft.com/content/17b09993-8fed-47d1-9c04-e2d29ca75615"
  },
  {
    id: "ad6d56fa-6a6e-43bd-8f12-205a3f94ac0e",
    title: "Pioneer founder Scott Sheffield says Exxon ‘set him up’ after $60bn takeover",
    date: "2026-09-24",
    time: "20:27",
    url: "https://www.ft.com/content/ad6d56fa-6a6e-43bd-8f12-205a3f94ac0e"
  }
];
