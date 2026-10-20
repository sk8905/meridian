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
  },
  {
    "id": "4bc3dcfd-bf93-4809-b6b3-f2e8742a396f",
    "title": "Divisions are growing under Trump. For 14 Americans, will it change their vote?",
    "date": "2026-10-20",
    "time": "14:00",
    "url": "https://www.ft.com/content/4bc3dcfd-bf93-4809-b6b3-f2e8742a396f"
  },
  {
    "id": "0f5d14f1-6486-4d98-9340-3b8c8e79187d",
    "title": "Flutter to cut more than 1,000 jobs after UK gambling tax raid",
    "date": "2026-10-20",
    "time": "13:52",
    "url": "https://www.ft.com/content/0f5d14f1-6486-4d98-9340-3b8c8e79187d"
  },
  {
    "id": "d8603ad4-e9a4-43e4-9419-a0eb53e298f3",
    "title": "Why globetrotting retail banks are back in fashion",
    "date": "2026-10-20",
    "time": "13:28",
    "url": "https://www.ft.com/content/d8603ad4-e9a4-43e4-9419-a0eb53e298f3"
  },
  {
    "id": "c88b07df-d30e-401a-aca9-4b054d6dfd7b",
    "title": "UK banks hit by Google Cloud outage",
    "date": "2026-10-20",
    "time": "13:03",
    "url": "https://www.ft.com/content/c88b07df-d30e-401a-aca9-4b054d6dfd7b"
  },
  {
    "id": "4fb42dd7-a72c-4e20-9e7c-cdc9d3215159",
    "title": "Is CoreWeave the Silicon Valley Bank of 2026?",
    "date": "2026-10-20",
    "time": "12:50",
    "url": "https://www.ft.com/content/4fb42dd7-a72c-4e20-9e7c-cdc9d3215159"
  },
  {
    "id": "e0b2e8f1-6d3e-4647-9370-e7b7b7e7fd42",
    "title": "Insurers face losses as riots in France become ‘like natural catastrophes’",
    "date": "2026-10-20",
    "time": "12:34",
    "url": "https://www.ft.com/content/e0b2e8f1-6d3e-4647-9370-e7b7b7e7fd42"
  },
  {
    "id": "31df1d21-159c-4c24-be0a-566c00c2d100",
    "title": "Do not worry too much about European gas prices",
    "date": "2026-10-20",
    "time": "12:30",
    "url": "https://www.ft.com/content/31df1d21-159c-4c24-be0a-566c00c2d100"
  },
  {
    "id": "52fab4c1-0561-43ce-bc3c-0d43f6e217c5",
    "title": "How the Hormuz crisis could trigger a global ‘food shock’",
    "date": "2026-10-20",
    "time": "12:00",
    "url": "https://www.ft.com/content/52fab4c1-0561-43ce-bc3c-0d43f6e217c5"
  },
  {
    "id": "f4bd0c67-5d11-44f4-8b70-4042a9be1cf2",
    "title": "‘Protect the NHS’ slogan hurt care home residents in pandemic, Covid inquiry finds",
    "date": "2026-10-20",
    "time": "12:00",
    "url": "https://www.ft.com/content/f4bd0c67-5d11-44f4-8b70-4042a9be1cf2"
  },
  {
    "id": "f3d80441-2ab4-4ccb-bf8c-e2b6c040f238",
    "title": "HSBC reviews Palantir holding in $9bn Islamic fund",
    "date": "2026-10-20",
    "time": "11:48",
    "url": "https://www.ft.com/content/f3d80441-2ab4-4ccb-bf8c-e2b6c040f238"
  },
  {
    "id": "59a3252c-3ea6-4e1e-bcc7-fef15cce16da",
    "title": "UK to deploy jets to defend Saudi Arabia against Houthi attacks",
    "date": "2026-10-20",
    "time": "11:45",
    "url": "https://www.ft.com/content/59a3252c-3ea6-4e1e-bcc7-fef15cce16da"
  },
  {
    "id": "f2261796-20d1-4c90-ab3e-246d4aff504f",
    "title": "Putin’s American friends",
    "date": "2026-10-20",
    "time": "11:26",
    "url": "https://www.ft.com/content/f2261796-20d1-4c90-ab3e-246d4aff504f"
  },
  {
    "id": "b101071b-0b47-4cf2-a35f-9ebb04539df2",
    "title": "Older Americans brace for higher healthcare costs",
    "date": "2026-10-20",
    "time": "11:10",
    "url": "https://www.ft.com/content/b101071b-0b47-4cf2-a35f-9ebb04539df2"
  },
  {
    "id": "92a2e2a4-356a-4aa3-9d1e-8b4fbaf1c365",
    "title": "FirstFT: AI debt fears spark default insurance trading surge",
    "date": "2026-10-20",
    "time": "11:07",
    "url": "https://www.ft.com/content/92a2e2a4-356a-4aa3-9d1e-8b4fbaf1c365"
  }
];
