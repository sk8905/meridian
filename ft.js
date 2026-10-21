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
    "id": "abe0ee90-b0ad-45c2-95db-93f0663af34b",
    "title": "LSEG nears $3.5bn deal to buy credit  data specialist Octus",
    "date": "2026-10-21",
    "time": "22:55",
    "url": "https://www.ft.com/content/abe0ee90-b0ad-45c2-95db-93f0663af34b"
  },
  {
    "id": "b34502b6-38dc-4a46-a8e7-d9131726cd31",
    "title": "Meta agrees deal to keep Mark Zuckerberg in California despite wealth tax proposal",
    "date": "2026-10-21",
    "time": "22:43",
    "url": "https://www.ft.com/content/b34502b6-38dc-4a46-a8e7-d9131726cd31"
  },
  {
    "id": "b739c6e8-5b77-46e3-91a5-382fd52389bc",
    "title": "FirstFT: Scott Bessent shrugs off ‘systemic’ AI risks at private event with investors",
    "date": "2026-10-21",
    "time": "22:42",
    "url": "https://www.ft.com/content/b739c6e8-5b77-46e3-91a5-382fd52389bc"
  },
  {
    "id": "f39aa4d2-e290-451f-ae91-b19138b6172f",
    "title": "US orders some personnel to leave Saudi Arabia after Houthi attacks",
    "date": "2026-10-21",
    "time": "21:58",
    "url": "https://www.ft.com/content/f39aa4d2-e290-451f-ae91-b19138b6172f"
  },
  {
    "id": "16bdf332-2a75-4e57-81ea-a37caf50ec0f",
    "title": "Tesla’s profits slip on weaker vehicle sales",
    "date": "2026-10-21",
    "time": "21:44",
    "url": "https://www.ft.com/content/16bdf332-2a75-4e57-81ea-a37caf50ec0f"
  },
  {
    "id": "637bb10e-b5b4-4db2-ac7c-b42348595c4c",
    "title": "Republicans head into midterms with huge spending advantage",
    "date": "2026-10-21",
    "time": "21:26",
    "url": "https://www.ft.com/content/637bb10e-b5b4-4db2-ac7c-b42348595c4c"
  },
  {
    "id": "5eb997eb-6031-40c4-b2f3-e2a09f4d64f1",
    "title": "GM aims to leapfrog rivals with new generation of autonomous cars",
    "date": "2026-10-21",
    "time": "21:10",
    "url": "https://www.ft.com/content/5eb997eb-6031-40c4-b2f3-e2a09f4d64f1"
  },
  {
    "id": "47777033-6a91-42c3-bc9e-249d4bf7a961",
    "title": "EU set to delay push for cheaper UK university fees for bloc’s students",
    "date": "2026-10-21",
    "time": "19:58",
    "url": "https://www.ft.com/content/47777033-6a91-42c3-bc9e-249d4bf7a961"
  },
  {
    "id": "5b7c2fdf-2300-4208-860e-6389ceb18886",
    "title": "Scott Bessent shrugs off ‘systemic’ AI risks at closed-door investor conference",
    "date": "2026-10-21",
    "time": "19:46",
    "url": "https://www.ft.com/content/5b7c2fdf-2300-4208-860e-6389ceb18886"
  },
  {
    "id": "245778d9-597b-492d-b5b6-a2967c77e853",
    "title": "NSA warns on ‘critical’ cyber vulnerabilities detected using AI",
    "date": "2026-10-21",
    "time": "19:46",
    "url": "https://www.ft.com/content/245778d9-597b-492d-b5b6-a2967c77e853"
  },
  {
    "id": "d7345d46-f000-49b1-99f6-57edfbd5f0af",
    "title": "Trump envoy floats Ukraine talks and summit with Putin and Xi",
    "date": "2026-10-21",
    "time": "18:53",
    "url": "https://www.ft.com/content/d7345d46-f000-49b1-99f6-57edfbd5f0af"
  },
  {
    "id": "7c0fb51a-2c17-414e-96a7-ac33f40af3de",
    "title": "CVC explores bid for Verisure just 1 year after IPO",
    "date": "2026-10-21",
    "time": "18:43",
    "url": "https://www.ft.com/content/7c0fb51a-2c17-414e-96a7-ac33f40af3de"
  },
  {
    "id": "68e28f90-cbc3-4fa6-950b-451cf7c49c87",
    "title": "Ghana in talks with European nations for reparations, president says",
    "date": "2026-10-21",
    "time": "18:43",
    "url": "https://www.ft.com/content/68e28f90-cbc3-4fa6-950b-451cf7c49c87"
  },
  {
    "id": "bef7e107-3922-4312-acd9-3c96af60c309",
    "title": "Italy’s buffalo mozzarella production grinds to a halt in truckers’ strike",
    "date": "2026-10-21",
    "time": "18:37",
    "url": "https://www.ft.com/content/bef7e107-3922-4312-acd9-3c96af60c309"
  },
  {
    "id": "8c443652-5c29-4711-81d1-dd985f2e4578",
    "title": "Indonesia should heed MSCI’s warning",
    "date": "2026-10-21",
    "time": "18:36",
    "url": "https://www.ft.com/content/8c443652-5c29-4711-81d1-dd985f2e4578"
  },
  {
    "id": "7f8e97b4-bd2e-4414-858a-bc746cb515f6",
    "title": "Tesla-SpaceX: a huge corporate constellation with Musk at its centre",
    "date": "2026-10-21",
    "time": "18:25",
    "url": "https://www.ft.com/content/7f8e97b4-bd2e-4414-858a-bc746cb515f6"
  },
  {
    "id": "93ba5184-e21c-4af2-8121-c92df82a95f3",
    "title": "Ohio governor’s campaign engulfed in controversy over attack ad",
    "date": "2026-10-21",
    "time": "18:09",
    "url": "https://www.ft.com/content/93ba5184-e21c-4af2-8121-c92df82a95f3"
  },
  {
    "id": "576c025a-b4e2-47d8-88e8-3ac0fcf8e16d",
    "title": "Hungary detains Orbán’s former central bank chief",
    "date": "2026-10-21",
    "time": "18:07",
    "url": "https://www.ft.com/content/576c025a-b4e2-47d8-88e8-3ac0fcf8e16d"
  },
  {
    "id": "9cfa52b2-77cb-4b53-ad74-badd53f24fc6",
    "title": "UK approves development of Jackdaw gasfield in North Sea",
    "date": "2026-10-21",
    "time": "17:49",
    "url": "https://www.ft.com/content/9cfa52b2-77cb-4b53-ad74-badd53f24fc6"
  },
  {
    "id": "76f076e4-9db2-4971-8ac9-73d9f39e4876",
    "title": "France’s borrowing costs hit 5% for first time since 2002",
    "date": "2026-10-21",
    "time": "17:33",
    "url": "https://www.ft.com/content/76f076e4-9db2-4971-8ac9-73d9f39e4876"
  },
  {
    "id": "443ce2f3-ba36-4dc7-aa0b-a2bc593fa563",
    "title": "UK inflation and borrowing top forecasts in blow to John Healey",
    "date": "2026-10-21",
    "time": "17:31",
    "url": "https://www.ft.com/content/443ce2f3-ba36-4dc7-aa0b-a2bc593fa563"
  },
  {
    "id": "509c0ecf-625e-4473-96cf-e249edb7c86e",
    "title": "Middle East oil exports climb back to prewar levels",
    "date": "2026-10-21",
    "time": "17:24",
    "url": "https://www.ft.com/content/509c0ecf-625e-4473-96cf-e249edb7c86e"
  },
  {
    "id": "57e14c61-a1ac-46ef-8bf2-c40e5286546e",
    "title": "Macron hits out at ‘stupid’ Trump remarks about riots in France",
    "date": "2026-10-21",
    "time": "17:12",
    "url": "https://www.ft.com/content/57e14c61-a1ac-46ef-8bf2-c40e5286546e"
  },
  {
    "id": "7f407bde-ef26-4914-bcbe-baf858bc81d7",
    "title": "Abbott Laboratories to spin off nutrition unit at centre of baby formula lawsuits",
    "date": "2026-10-21",
    "time": "16:54",
    "url": "https://www.ft.com/content/7f407bde-ef26-4914-bcbe-baf858bc81d7"
  },
  {
    "id": "a6972433-c303-4ace-affd-cc3ab54a3cf3",
    "title": "Could Michigan elect America’s first Muslim senator?",
    "date": "2026-10-21",
    "time": "16:52",
    "url": "https://www.ft.com/content/a6972433-c303-4ace-affd-cc3ab54a3cf3"
  },
  {
    "id": "89a3b7e8-beee-464b-b398-2709be815982",
    "title": "Fridge hackers exploited ‘basic security flaws’ at French retailers",
    "date": "2026-10-21",
    "time": "16:38",
    "url": "https://www.ft.com/content/89a3b7e8-beee-464b-b398-2709be815982"
  },
  {
    "id": "3d67dfc3-e17c-4580-9797-a6bfa7256be0",
    "title": "Reform reports ITV to police over  undercover documentary",
    "date": "2026-10-21",
    "time": "16:12",
    "url": "https://www.ft.com/content/3d67dfc3-e17c-4580-9797-a6bfa7256be0"
  },
  {
    "id": "09f56730-4702-446d-9986-f7c93ffe6bf0",
    "title": "Who’s paying for the AI build-out? Probably you",
    "date": "2026-10-21",
    "time": "16:00",
    "url": "https://www.ft.com/content/09f56730-4702-446d-9986-f7c93ffe6bf0"
  },
  {
    "id": "e598bbc7-8211-436f-a57e-46c3ae21ac0f",
    "title": "Rockets, robots and risk: Elon Musk’s $3.6tn gamble to merge Tesla and SpaceX",
    "date": "2026-10-21",
    "time": "14:38",
    "url": "https://www.ft.com/content/e598bbc7-8211-436f-a57e-46c3ae21ac0f"
  },
  {
    "id": "8eda2888-0b63-43c9-80b9-b4b7557374ca",
    "title": "Andy Burnham plans to cut standing charges from household gas bills",
    "date": "2026-10-21",
    "time": "14:34",
    "url": "https://www.ft.com/content/8eda2888-0b63-43c9-80b9-b4b7557374ca"
  },
  {
    "id": "e3282291-be9a-4c97-8fc8-d43f9297e167",
    "title": "Dangote takes stake in Kenyan pipeline and pledges more ‘aggressive’ energy investment",
    "date": "2026-10-21",
    "time": "14:23",
    "url": "https://www.ft.com/content/e3282291-be9a-4c97-8fc8-d43f9297e167"
  },
  {
    "id": "2773c5ab-1bb6-4110-b6a7-c467b7b89717",
    "title": "The ‘adults in the room’ won’t save you",
    "date": "2026-10-21",
    "time": "12:32",
    "url": "https://www.ft.com/content/2773c5ab-1bb6-4110-b6a7-c467b7b89717"
  },
  {
    "id": "7713a613-7b31-4e31-9aeb-0fb2bd03391e",
    "title": "Can Britain’s grid make the grade?",
    "date": "2026-10-21",
    "time": "12:01",
    "url": "https://www.ft.com/content/7713a613-7b31-4e31-9aeb-0fb2bd03391e"
  },
  {
    "id": "f9e4ddf8-5fd4-43e6-bca2-62d1067c4c48",
    "title": "Musk’s SpaceX ambitions may be ‘dangerous’ for Europe, warns EU lawmaker",
    "date": "2026-10-21",
    "time": "11:45",
    "url": "https://www.ft.com/content/f9e4ddf8-5fd4-43e6-bca2-62d1067c4c48"
  },
  {
    "id": "162c6dd8-5501-46f4-8f7c-b456a4e29539",
    "title": "Iran war sparks heating crisis in US north-east as winter approaches",
    "date": "2026-10-21",
    "time": "11:00",
    "url": "https://www.ft.com/content/162c6dd8-5501-46f4-8f7c-b456a4e29539"
  },
  {
    "id": "a2c32972-da84-44ff-82cf-d66ae8bc1446",
    "title": "National Express owner in talks over £282mn take-private deal",
    "date": "2026-10-21",
    "time": "10:46",
    "url": "https://www.ft.com/content/a2c32972-da84-44ff-82cf-d66ae8bc1446"
  },
  {
    "id": "ae820b11-e085-44b4-a8ca-8e5fa2eeb571",
    "title": "FirstFT: SpaceX and Tesla explore merger",
    "date": "2026-10-21",
    "time": "10:40",
    "url": "https://www.ft.com/content/ae820b11-e085-44b4-a8ca-8e5fa2eeb571"
  },
  {
    "id": "36a14179-9c1f-4591-ac3b-970054a19d92",
    "title": "Andy Burnham’s North Sea ‘pragmatism’ is no big shift from Keir Starmer’s",
    "date": "2026-10-21",
    "time": "09:30",
    "url": "https://www.ft.com/content/36a14179-9c1f-4591-ac3b-970054a19d92"
  },
  {
    "id": "21d3b4e1-941b-4ad8-8e41-f8fc1864e758",
    "title": "UK’s biggest port operator valued at over £10bn in Australian fund purchase",
    "date": "2026-10-21",
    "time": "09:19",
    "url": "https://www.ft.com/content/21d3b4e1-941b-4ad8-8e41-f8fc1864e758"
  },
  {
    "id": "67a2f314-730b-477b-b52f-f7495394ceec",
    "title": "Don’t underestimate Netflix’s power to flip the script",
    "date": "2026-10-21",
    "time": "09:01",
    "url": "https://www.ft.com/content/67a2f314-730b-477b-b52f-f7495394ceec"
  }
];
