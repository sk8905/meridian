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
    "id": "31f86452-c16a-4fbf-b393-bb5282c1cb59",
    "title": "Gilt market catches up with peers as investor worries over Budget ease",
    "date": "2026-10-20",
    "time": "12:54",
    "url": "https://www.ft.com/content/31f86452-c16a-4fbf-b393-bb5282c1cb59"
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
  },
  {
    "id": "ff5859fb-dfa6-4fe5-a5cf-824a98ad32d4",
    "title": "The hidden water crisis beneath the American west",
    "date": "2026-10-20",
    "time": "11:00",
    "url": "https://www.ft.com/content/ff5859fb-dfa6-4fe5-a5cf-824a98ad32d4"
  },
  {
    "id": "5131563e-8fa6-4383-aee4-6cdd6daf25bc",
    "title": "Five gadgets to keep your home safe",
    "date": "2026-10-20",
    "time": "11:00",
    "url": "https://www.ft.com/content/5131563e-8fa6-4383-aee4-6cdd6daf25bc"
  },
  {
    "id": "581d8a59-b128-4f68-9f34-6c066b36ca5b",
    "title": "Trump envoys to hold fresh Ukraine talks in Norway",
    "date": "2026-10-20",
    "time": "10:31",
    "url": "https://www.ft.com/content/581d8a59-b128-4f68-9f34-6c066b36ca5b"
  },
  {
    "id": "7bd4ac59-61e6-4604-a96a-26e7096bf768",
    "title": "France considers new curfews as restrictions quell unrest",
    "date": "2026-10-20",
    "time": "09:40",
    "url": "https://www.ft.com/content/7bd4ac59-61e6-4604-a96a-26e7096bf768"
  },
  {
    "id": "472ad6cf-438f-4d62-a41c-8725cbf53383",
    "title": "Indonesia expels tightly held companies from Jakarta index in bid to avoid MSCI downgrade",
    "date": "2026-10-20",
    "time": "09:34",
    "url": "https://www.ft.com/content/472ad6cf-438f-4d62-a41c-8725cbf53383"
  },
  {
    "id": "8b1990d1-b4b2-4147-ba4b-76d1869ee2db",
    "title": "EU drops push for global ban on Arctic drilling",
    "date": "2026-10-19",
    "time": "16:36",
    "url": "https://www.ft.com/content/8b1990d1-b4b2-4147-ba4b-76d1869ee2db"
  },
  {
    "id": "1faf0ed7-53ce-46a4-99c8-216e8e28b9ea",
    "title": "Former chair of Monte dei Paschi accused of role in executive’s death",
    "date": "2026-10-19",
    "time": "16:10",
    "url": "https://www.ft.com/content/1faf0ed7-53ce-46a4-99c8-216e8e28b9ea"
  },
  {
    "id": "8848d06c-c0fa-49ff-af08-880ef4f3ff21",
    "title": "India’s democracy once went looking for voters. Not any more",
    "date": "2026-10-19",
    "time": "15:46",
    "url": "https://www.ft.com/content/8848d06c-c0fa-49ff-af08-880ef4f3ff21"
  },
  {
    "id": "15a049f3-b62e-40ed-b304-8a2452713338",
    "title": "Data centres need protection from drone warfare",
    "date": "2026-10-19",
    "time": "15:31",
    "url": "https://www.ft.com/content/15a049f3-b62e-40ed-b304-8a2452713338"
  },
  {
    "id": "8cdf338e-d472-460c-8642-a8f033b99462",
    "title": "Submit a question: Could Anthropic’s IPO be a turning point for AI?",
    "date": "2026-10-19",
    "time": "15:10",
    "url": "https://www.ft.com/content/8cdf338e-d472-460c-8642-a8f033b99462"
  },
  {
    "id": "f3127b4f-d33a-4431-acff-021829f3aa72",
    "title": "BoE scrutinises Barclays over claim traders misrepresented private credit exposure",
    "date": "2026-10-19",
    "time": "14:54",
    "url": "https://www.ft.com/content/f3127b4f-d33a-4431-acff-021829f3aa72"
  },
  {
    "id": "5f595355-caca-4951-8170-91bb513f7aa9",
    "title": "Australian MP struck by car in alleged attack",
    "date": "2026-10-19",
    "time": "14:52",
    "url": "https://www.ft.com/content/5f595355-caca-4951-8170-91bb513f7aa9"
  },
  {
    "id": "d8df36c2-7e8c-4cfb-ad9e-e6e954fea4b9",
    "title": "Violent protests spread from France to Italy and Belgium",
    "date": "2026-10-19",
    "time": "14:50",
    "url": "https://www.ft.com/content/d8df36c2-7e8c-4cfb-ad9e-e6e954fea4b9"
  },
  {
    "id": "ef0f6d42-4759-4ce8-8e40-acd83f0c64f1",
    "title": "The best art exhibitions to see in London right now",
    "date": "2026-10-19",
    "time": "14:48",
    "url": "https://www.ft.com/content/ef0f6d42-4759-4ce8-8e40-acd83f0c64f1"
  },
  {
    "id": "2ad6e5dd-b8c2-4186-a6e2-ba27f222e1f0",
    "title": "FTSE 100 newcomer Ithaca warns of halt to investment if Rosebank blocked",
    "date": "2026-10-19",
    "time": "14:37",
    "url": "https://www.ft.com/content/2ad6e5dd-b8c2-4186-a6e2-ba27f222e1f0"
  },
  {
    "id": "915ea7ca-1f35-4847-810a-fb29e8344496",
    "title": "US stocks rebound after AI sell-off",
    "date": "2026-10-19",
    "time": "14:37",
    "url": "https://www.ft.com/content/915ea7ca-1f35-4847-810a-fb29e8344496"
  },
  {
    "id": "22290706-ab59-4766-b604-ddff94a71bcf",
    "title": "Uber defeats High Court lawsuit brought by London’s black-cab drivers",
    "date": "2026-10-19",
    "time": "14:19",
    "url": "https://www.ft.com/content/22290706-ab59-4766-b604-ddff94a71bcf"
  },
  {
    "id": "e73d0106-486b-4382-8ecc-5c96ac44fdff",
    "title": "US defence stocks tumble as investors bet on Democratic election sweep",
    "date": "2026-10-19",
    "time": "14:04",
    "url": "https://www.ft.com/content/e73d0106-486b-4382-8ecc-5c96ac44fdff"
  },
  {
    "id": "6b460256-2f85-485f-ba99-45f270fe3cad",
    "title": "Indonesia’s market is dysfunctional, not uninvestable",
    "date": "2026-10-19",
    "time": "13:55",
    "url": "https://www.ft.com/content/6b460256-2f85-485f-ba99-45f270fe3cad"
  },
  {
    "id": "3beab58d-4269-4722-b299-8fa5a93f5a52",
    "title": "Anthropic commits 5% of shares to ‘public benefit’ fund",
    "date": "2026-10-19",
    "time": "13:17",
    "url": "https://www.ft.com/content/3beab58d-4269-4722-b299-8fa5a93f5a52"
  },
  {
    "id": "aeb432cd-5d95-4062-b7a8-f494592adb34",
    "title": "Is smart farming really smart business?",
    "date": "2026-10-19",
    "time": "13:02",
    "url": "https://www.ft.com/content/aeb432cd-5d95-4062-b7a8-f494592adb34"
  },
  {
    "id": "9da32f56-9024-4940-b7f0-ebfb200a7c15",
    "title": "Angel’s Bone review — a brilliant, bruising season opener for the beleaguered ENO",
    "date": "2026-10-19",
    "time": "13:00",
    "url": "https://www.ft.com/content/9da32f56-9024-4940-b7f0-ebfb200a7c15"
  },
  {
    "id": "b9d270a8-738b-41cb-9c3c-5fa5ac0c2325",
    "title": "KKR accused by EU of misleading regulators over €22bn telecoms deal",
    "date": "2026-10-19",
    "time": "12:32",
    "url": "https://www.ft.com/content/b9d270a8-738b-41cb-9c3c-5fa5ac0c2325"
  },
  {
    "id": "7dbe983c-fcd2-41dd-bbe4-9f38a489e6c2",
    "title": "The self-destructive wishful thinking about European autos and trade",
    "date": "2026-10-19",
    "time": "12:31",
    "url": "https://www.ft.com/content/7dbe983c-fcd2-41dd-bbe4-9f38a489e6c2"
  },
  {
    "id": "cc7e577a-db7a-4e12-9a42-443696b98ec5",
    "title": "Emmanuel Macron rejects interior minister’s resignation after French riots",
    "date": "2026-10-19",
    "time": "12:29",
    "url": "https://www.ft.com/content/cc7e577a-db7a-4e12-9a42-443696b98ec5"
  }
];
