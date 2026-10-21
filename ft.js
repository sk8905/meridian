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
  },
  {
    "id": "33573324-6eb8-447c-934d-5a992872509a",
    "title": "Two rearrested over RAF Fairford incident on suspicion of helping Iranian intelligence",
    "date": "2026-10-20",
    "time": "19:19",
    "url": "https://www.ft.com/content/33573324-6eb8-447c-934d-5a992872509a"
  },
  {
    "id": "f97755f2-8b07-47bf-9c14-7963a701c9c3",
    "title": "Who are the Black Bloc?",
    "date": "2026-10-20",
    "time": "19:15",
    "url": "https://www.ft.com/content/f97755f2-8b07-47bf-9c14-7963a701c9c3"
  },
  {
    "id": "7bd4ac59-61e6-4604-a96a-26e7096bf768",
    "title": "France extends curfews in some cities as restrictions quell unrest",
    "date": "2026-10-20",
    "time": "18:58",
    "url": "https://www.ft.com/content/7bd4ac59-61e6-4604-a96a-26e7096bf768"
  },
  {
    "id": "eb8c6c38-3362-49cb-bfd6-4e164d82966d",
    "title": "Audit regulator takes control of inquiry into Man City accounts",
    "date": "2026-10-20",
    "time": "18:21",
    "url": "https://www.ft.com/content/eb8c6c38-3362-49cb-bfd6-4e164d82966d"
  },
  {
    "id": "82f99b04-144d-4f2a-b23e-d5a3c0674f3b",
    "title": "Merz warns over Berlin plans to seize landlords’ property",
    "date": "2026-10-20",
    "time": "17:49",
    "url": "https://www.ft.com/content/82f99b04-144d-4f2a-b23e-d5a3c0674f3b"
  },
  {
    "id": "8be29348-e112-462f-96eb-44a699ca61a6",
    "title": "Britain’s budget should build on its economic resilience",
    "date": "2026-10-20",
    "time": "17:15",
    "url": "https://www.ft.com/content/8be29348-e112-462f-96eb-44a699ca61a6"
  },
  {
    "id": "31f86452-c16a-4fbf-b393-bb5282c1cb59",
    "title": "Gilt market catches up with peers as investor worries over Budget ease",
    "date": "2026-10-20",
    "time": "17:10",
    "url": "https://www.ft.com/content/31f86452-c16a-4fbf-b393-bb5282c1cb59"
  },
  {
    "id": "2d20b09b-6565-4253-a809-8a0542e6770a",
    "title": "UK jobs market stabilises before Budget",
    "date": "2026-10-20",
    "time": "16:59",
    "url": "https://www.ft.com/content/2d20b09b-6565-4253-a809-8a0542e6770a"
  },
  {
    "id": "179172c2-7f3a-49f1-90fb-1551c35768d7",
    "title": "Romania forms a government after six months of crisis",
    "date": "2026-10-20",
    "time": "16:56",
    "url": "https://www.ft.com/content/179172c2-7f3a-49f1-90fb-1551c35768d7"
  },
  {
    "id": "42ed6778-d350-48a6-ba3d-99efca3cd276",
    "title": "US pending home sales fall to record low as mortgage rates surge",
    "date": "2026-10-20",
    "time": "16:47",
    "url": "https://www.ft.com/content/42ed6778-d350-48a6-ba3d-99efca3cd276"
  },
  {
    "id": "29f1af13-ecc3-4f26-a479-e6088c67231b",
    "title": "US midterm elections 2026: The FT’s guide",
    "date": "2026-10-20",
    "time": "16:33",
    "url": "https://www.ft.com/content/29f1af13-ecc3-4f26-a479-e6088c67231b"
  },
  {
    "id": "616c796b-a288-4013-a363-70e94429b60e",
    "title": "Is France spinning out of control?",
    "date": "2026-10-20",
    "time": "16:22",
    "url": "https://www.ft.com/content/616c796b-a288-4013-a363-70e94429b60e"
  },
  {
    "id": "a068036c-a752-4267-9a2f-a95190ef619f",
    "title": "Finnish president hails progress in talks about ending Russia’s war in Ukraine",
    "date": "2026-10-20",
    "time": "16:11",
    "url": "https://www.ft.com/content/a068036c-a752-4267-9a2f-a95190ef619f"
  },
  {
    "id": "f2020597-aec5-4de4-a169-c89ecb7246ca",
    "title": "Sullivan & Cromwell to double London office space as US firms shake up UK legal market",
    "date": "2026-10-20",
    "time": "16:06",
    "url": "https://www.ft.com/content/f2020597-aec5-4de4-a169-c89ecb7246ca"
  },
  {
    "id": "85fb6c79-d1fd-493b-9ef5-597400919252",
    "title": "NatWest tells 30,000 staff to spend more time in office",
    "date": "2026-10-20",
    "time": "15:21",
    "url": "https://www.ft.com/content/85fb6c79-d1fd-493b-9ef5-597400919252"
  },
  {
    "id": "f8ea12f4-a55d-4f46-a409-5cffd093ab6a",
    "title": "Activist Starboard targets Honeywell spin-off Solstice after failed megadeal",
    "date": "2026-10-20",
    "time": "15:04",
    "url": "https://www.ft.com/content/f8ea12f4-a55d-4f46-a409-5cffd093ab6a"
  }
];
