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
    "id": "d7345d46-f000-49b1-99f6-57edfbd5f0af",
    "title": "Russia releases US citizen as Trump’s envoy visits",
    "date": "2026-10-21",
    "time": "15:50",
    "url": "https://www.ft.com/content/d7345d46-f000-49b1-99f6-57edfbd5f0af"
  },
  {
    "id": "509c0ecf-625e-4473-96cf-e249edb7c86e",
    "title": "Middle East oil exports climb back to prewar levels",
    "date": "2026-10-21",
    "time": "15:44",
    "url": "https://www.ft.com/content/509c0ecf-625e-4473-96cf-e249edb7c86e"
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
    "id": "57e14c61-a1ac-46ef-8bf2-c40e5286546e",
    "title": "Macron hits out at ‘stupid’ Trump remarks about riots in France",
    "date": "2026-10-21",
    "time": "14:17",
    "url": "https://www.ft.com/content/57e14c61-a1ac-46ef-8bf2-c40e5286546e"
  },
  {
    "id": "576c025a-b4e2-47d8-88e8-3ac0fcf8e16d",
    "title": "Hungary detains Orbán’s former central bank chief",
    "date": "2026-10-21",
    "time": "13:39",
    "url": "https://www.ft.com/content/576c025a-b4e2-47d8-88e8-3ac0fcf8e16d"
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
    "id": "e598bbc7-8211-436f-a57e-46c3ae21ac0f",
    "title": "Rockets, robots and risk: Elon Musk’s $3.6tn gamble to merge Tesla and SpaceX",
    "date": "2026-10-21",
    "time": "10:50",
    "url": "https://www.ft.com/content/e598bbc7-8211-436f-a57e-46c3ae21ac0f"
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
    "id": "76f076e4-9db2-4971-8ac9-73d9f39e4876",
    "title": "France’s borrowing costs hit 5% for first time since 2002",
    "date": "2026-10-21",
    "time": "10:07",
    "url": "https://www.ft.com/content/76f076e4-9db2-4971-8ac9-73d9f39e4876"
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
  },
  {
    "id": "443ce2f3-ba36-4dc7-aa0b-a2bc593fa563",
    "title": "UK inflation and borrowing top forecasts in blow to John Healey",
    "date": "2026-10-21",
    "time": "08:18",
    "url": "https://www.ft.com/content/443ce2f3-ba36-4dc7-aa0b-a2bc593fa563"
  },
  {
    "id": "70f1da13-3c33-4881-aaa8-3458c1ba7eaf",
    "title": "UK September inflation fuels expectations of imminent BoE rate rise",
    "date": "2026-10-21",
    "time": "08:03",
    "url": "https://www.ft.com/content/70f1da13-3c33-4881-aaa8-3458c1ba7eaf"
  },
  {
    "id": "0a892b95-0216-40d9-89a4-e1654b9a3fa2",
    "title": "Are index providers overstepping the mark?",
    "date": "2026-10-21",
    "time": "07:27",
    "url": "https://www.ft.com/content/0a892b95-0216-40d9-89a4-e1654b9a3fa2"
  },
  {
    "id": "89322cfb-54cd-4fcd-9ba7-cd7e74382215",
    "title": "UK government borrowing rises to £24.5bn ahead of Budget",
    "date": "2026-10-21",
    "time": "07:10",
    "url": "https://www.ft.com/content/89322cfb-54cd-4fcd-9ba7-cd7e74382215"
  },
  {
    "id": "e316142e-c315-47d4-89c9-971bad5a6380",
    "title": "The Indian mega-refinery drawing Marco Rubio’s interest",
    "date": "2026-10-21",
    "time": "07:09",
    "url": "https://www.ft.com/content/e316142e-c315-47d4-89c9-971bad5a6380"
  },
  {
    "id": "9bc15db9-08b4-40f1-b814-24a52eed8ebc",
    "title": "Nscale boss seeks to reassure staff amid AI market fears",
    "date": "2026-10-21",
    "time": "06:47",
    "url": "https://www.ft.com/content/9bc15db9-08b4-40f1-b814-24a52eed8ebc"
  },
  {
    "id": "b7e5fa98-0cb5-4eba-b921-26e3a9393199",
    "title": "Small caps: not a great AI hedge",
    "date": "2026-10-21",
    "time": "06:30",
    "url": "https://www.ft.com/content/b7e5fa98-0cb5-4eba-b921-26e3a9393199"
  },
  {
    "id": "b136cc73-cf87-447d-bd9e-4a890273ec0c",
    "title": "Foreign diplomats queue for handshake with EU leaders",
    "date": "2026-10-21",
    "time": "06:00",
    "url": "https://www.ft.com/content/b136cc73-cf87-447d-bd9e-4a890273ec0c"
  },
  {
    "id": "be6fa6df-cea1-4e99-8b8d-5ad5a17a3474",
    "title": "Who’s merging with Weil?",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/be6fa6df-cea1-4e99-8b8d-5ad5a17a3474"
  },
  {
    "id": "4e402323-c3f8-4aa6-9eba-0c8c9e478b4a",
    "title": "Milan riots test Giorgia Meloni’s law and order credentials",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/4e402323-c3f8-4aa6-9eba-0c8c9e478b4a"
  },
  {
    "id": "f06bdefd-bbc6-4a33-9884-09daa15752a9",
    "title": "UK’s top banking regulator to set targets with five-year strategy",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/f06bdefd-bbc6-4a33-9884-09daa15752a9"
  },
  {
    "id": "600ae6ad-ea09-4deb-ad55-10513e78a44e",
    "title": "Netflix’s $300bn problem: lack of hits piles pressure on streaming giant",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/600ae6ad-ea09-4deb-ad55-10513e78a44e"
  },
  {
    "id": "52e341e0-b29c-420a-9427-cf08e9982cc5",
    "title": "Climate plans found to lower companies’ borrowing costs",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/52e341e0-b29c-420a-9427-cf08e9982cc5"
  },
  {
    "id": "f4f711aa-ca65-4441-b311-73eadb3ccc40",
    "title": "Andy Burnham cools on new towns project",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/f4f711aa-ca65-4441-b311-73eadb3ccc40"
  },
  {
    "id": "480d1fa9-706d-4366-a76c-f39b1b7398a2",
    "title": "Stratford moves closer to international rail upgrade with Budget boost",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/480d1fa9-706d-4366-a76c-f39b1b7398a2"
  },
  {
    "id": "a744bc1c-98d8-4763-ad23-78e483bbf85f",
    "title": "The people shaping the Budget",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/a744bc1c-98d8-4763-ad23-78e483bbf85f"
  },
  {
    "id": "ef12fcab-5139-4750-b0d5-1f4b6c72086c",
    "title": "John Healey squashes hopes of visa for wealthy in UK Budget",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/ef12fcab-5139-4750-b0d5-1f4b6c72086c"
  },
  {
    "id": "d95609cd-1bb9-4995-937b-875277de3a42",
    "title": "EU probes pro-Kremlin disinformation around French riots",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/d95609cd-1bb9-4995-937b-875277de3a42"
  }
];
