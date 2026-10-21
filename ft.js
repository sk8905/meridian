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
  },
  {
    "id": "8c0ea73d-dc44-455a-b319-148c09f68e0a",
    "title": "Britain cannot build its future by returning to the 1970s",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/8c0ea73d-dc44-455a-b319-148c09f68e0a"
  },
  {
    "id": "2b772a7f-a4ef-412c-a96f-100dd9425684",
    "title": "A pre-Budget day guide to Britain’s bad taxes",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/2b772a7f-a4ef-412c-a96f-100dd9425684"
  },
  {
    "id": "eb4d1101-45ed-4d03-9beb-42f7c87a58ea",
    "title": "Benjamin Netanyahu pushes to resume strikes against Iran",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/eb4d1101-45ed-4d03-9beb-42f7c87a58ea"
  },
  {
    "id": "a7e3153d-ac45-4756-9961-75b892f337da",
    "title": "Crypto exchanges race to offer prediction markets to US customers",
    "date": "2026-10-21",
    "time": "05:00",
    "url": "https://www.ft.com/content/a7e3153d-ac45-4756-9961-75b892f337da"
  },
  {
    "id": "f2a2a578-5a2e-42ff-b4c9-8bafff271b37",
    "title": "SpaceX and Tesla boards are exploring potential merger",
    "date": "2026-10-20",
    "time": "22:56",
    "url": "https://www.ft.com/content/f2a2a578-5a2e-42ff-b4c9-8bafff271b37"
  },
  {
    "id": "850f15c9-5833-4acb-a65c-c17ca88a5fde",
    "title": "Joel Kaplan to step down as Meta global affairs chief",
    "date": "2026-10-20",
    "time": "22:30",
    "url": "https://www.ft.com/content/850f15c9-5833-4acb-a65c-c17ca88a5fde"
  },
  {
    "id": "e2bce5a9-0cb2-4166-8a14-3adeb5af6545",
    "title": "Lula fast-tracks Brazil welfare payments days before run-off vote",
    "date": "2026-10-20",
    "time": "22:23",
    "url": "https://www.ft.com/content/e2bce5a9-0cb2-4166-8a14-3adeb5af6545"
  },
  {
    "id": "9cfa52b2-77cb-4b53-ad74-badd53f24fc6",
    "title": "UK to approve development of Jackdaw gasfield in North Sea",
    "date": "2026-10-20",
    "time": "22:20",
    "url": "https://www.ft.com/content/9cfa52b2-77cb-4b53-ad74-badd53f24fc6"
  },
  {
    "id": "8cdf338e-d472-460c-8642-a8f033b99462",
    "title": "Submit a question: Could Anthropic’s IPO be a turning point for AI?",
    "date": "2026-10-20",
    "time": "21:57",
    "url": "https://www.ft.com/content/8cdf338e-d472-460c-8642-a8f033b99462"
  },
  {
    "id": "0e99c2bc-873c-4d2d-b5c9-a0876faeb9ed",
    "title": "Boeing wins approval for Max 10 jet in boost for turnaround efforts",
    "date": "2026-10-20",
    "time": "21:43",
    "url": "https://www.ft.com/content/0e99c2bc-873c-4d2d-b5c9-a0876faeb9ed"
  },
  {
    "id": "1b5d97dc-535a-42d9-ac0e-2c00e91c0aed",
    "title": "Netflix gives downbeat outlook as streaming hits dry up",
    "date": "2026-10-20",
    "time": "21:32",
    "url": "https://www.ft.com/content/1b5d97dc-535a-42d9-ac0e-2c00e91c0aed"
  },
  {
    "id": "50be6960-c609-4849-94bc-7084afc89255",
    "title": "UK bets on a boring budget",
    "date": "2026-10-20",
    "time": "21:00",
    "url": "https://www.ft.com/content/50be6960-c609-4849-94bc-7084afc89255"
  },
  {
    "id": "c335e978-1ceb-4254-8c71-793a41e6d0b3",
    "title": "Donald Trump pledges to spend $400mn on Republican Party midterm campaigns",
    "date": "2026-10-20",
    "time": "20:02",
    "url": "https://www.ft.com/content/c335e978-1ceb-4254-8c71-793a41e6d0b3"
  },
  {
    "id": "765cb887-05da-4971-9f28-bcf5430f09ac",
    "title": "UAE official emerges as late contender to lead UN",
    "date": "2026-10-20",
    "time": "19:32",
    "url": "https://www.ft.com/content/765cb887-05da-4971-9f28-bcf5430f09ac"
  }
];
