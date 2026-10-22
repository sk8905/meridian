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
    "id": "5a5f8d2c-94d0-4e90-b9f4-27e398e4e108",
    "title": "Rapid UK pay growth raises pressure on John Healey over minimum wage",
    "date": "2026-10-22",
    "time": "12:33",
    "url": "https://www.ft.com/content/5a5f8d2c-94d0-4e90-b9f4-27e398e4e108"
  },
  {
    "id": "a5432bf6-44fc-494c-94c0-f3ab66419d4a",
    "title": "How are AI agents changing work inside Anthropic?",
    "date": "2026-10-22",
    "time": "12:30",
    "url": "https://www.ft.com/content/a5432bf6-44fc-494c-94c0-f3ab66419d4a"
  },
  {
    "id": "1ca7e612-9a1a-4f26-a31a-651675ee67bb",
    "title": "The tentative return of the old politics",
    "date": "2026-10-22",
    "time": "12:14",
    "url": "https://www.ft.com/content/1ca7e612-9a1a-4f26-a31a-651675ee67bb"
  },
  {
    "id": "df7c95d7-72d1-4cec-87f6-9f7968ac3e5e",
    "title": "Blackstone cuts property valuations as higher rates hit returns",
    "date": "2026-10-22",
    "time": "12:03",
    "url": "https://www.ft.com/content/df7c95d7-72d1-4cec-87f6-9f7968ac3e5e"
  },
  {
    "id": "e6185f87-0f7a-4e95-80db-94462133c266",
    "title": "Why climate could soon move back up the global agenda",
    "date": "2026-10-22",
    "time": "12:00",
    "url": "https://www.ft.com/content/e6185f87-0f7a-4e95-80db-94462133c266"
  },
  {
    "id": "057670d7-c917-41b8-97c2-f45ac3b3241e",
    "title": "Hot property: five homes for sale in Boston",
    "date": "2026-10-22",
    "time": "12:00",
    "url": "https://www.ft.com/content/057670d7-c917-41b8-97c2-f45ac3b3241e"
  },
  {
    "id": "6e318b81-a771-4842-9754-e265fef2852f",
    "title": "Global stocks tumble as oil prices rise",
    "date": "2026-10-22",
    "time": "11:39",
    "url": "https://www.ft.com/content/6e318b81-a771-4842-9754-e265fef2852f"
  },
  {
    "id": "b739c6e8-5b77-46e3-91a5-382fd52389bc",
    "title": "FirstFT: Global equities hit by rise in oil prices",
    "date": "2026-10-22",
    "time": "11:14",
    "url": "https://www.ft.com/content/b739c6e8-5b77-46e3-91a5-382fd52389bc"
  },
  {
    "id": "d438af1e-a48c-4aeb-8c84-00cdb5e741e3",
    "title": "Websites taken offline in race to patch PHP security flaw",
    "date": "2026-10-22",
    "time": "11:13",
    "url": "https://www.ft.com/content/d438af1e-a48c-4aeb-8c84-00cdb5e741e3"
  },
  {
    "id": "92e1700d-7990-4c6a-bd3f-63685df2fdf6",
    "title": "Europe’s bracing reality on US bond yields",
    "date": "2026-10-22",
    "time": "11:07",
    "url": "https://www.ft.com/content/92e1700d-7990-4c6a-bd3f-63685df2fdf6"
  },
  {
    "id": "2925257d-3d78-49f9-96d0-e9ee9aeb3610",
    "title": "Objects With Narratives begins a new chapter in Antwerp",
    "date": "2026-10-22",
    "time": "11:00",
    "url": "https://www.ft.com/content/2925257d-3d78-49f9-96d0-e9ee9aeb3610"
  },
  {
    "id": "09d62b14-3541-48de-9a8c-f198cbe0220b",
    "title": "‘I don’t lose’: Rahm Emanuel makes an early pitch for the White House",
    "date": "2026-10-22",
    "time": "11:00",
    "url": "https://www.ft.com/content/09d62b14-3541-48de-9a8c-f198cbe0220b"
  },
  {
    "id": "120fad19-1279-4e3c-8f60-2319acc21d11",
    "title": "Europe’s underrated digital trailblazing",
    "date": "2026-10-22",
    "time": "11:00",
    "url": "https://www.ft.com/content/120fad19-1279-4e3c-8f60-2319acc21d11"
  },
  {
    "id": "8cdf338e-d472-460c-8642-a8f033b99462",
    "title": "Submit a question: Could Anthropic’s IPO be a turning point for AI?",
    "date": "2026-10-22",
    "time": "10:11",
    "url": "https://www.ft.com/content/8cdf338e-d472-460c-8642-a8f033b99462"
  },
  {
    "id": "5ae90cc4-a20d-4b65-9000-10421a663f89",
    "title": "Fixing Britain’s welfare state and the limits of AI policymaking",
    "date": "2026-10-22",
    "time": "09:35",
    "url": "https://www.ft.com/content/5ae90cc4-a20d-4b65-9000-10421a663f89"
  },
  {
    "id": "d8e3ca1c-ef96-4148-9ca2-49d48f1604b8",
    "title": "London credit hedge fund Arini’s losses mount",
    "date": "2026-10-22",
    "time": "09:24",
    "url": "https://www.ft.com/content/d8e3ca1c-ef96-4148-9ca2-49d48f1604b8"
  },
  {
    "id": "cc456111-4c0b-4eaa-8910-53d8933271a3",
    "title": "Nestlé removes Russian business from accounts after Kremlin takeover",
    "date": "2026-10-22",
    "time": "08:55",
    "url": "https://www.ft.com/content/cc456111-4c0b-4eaa-8910-53d8933271a3"
  },
  {
    "id": "39224d70-632e-4cac-ae1c-59f7efbbccaf",
    "title": "FT Wealth: October",
    "date": "2026-10-22",
    "time": "08:52",
    "url": "https://www.ft.com/content/39224d70-632e-4cac-ae1c-59f7efbbccaf"
  },
  {
    "id": "991ac37c-289b-40e5-b2e6-220ee2aebe5d",
    "title": "Ukraine to buy military supplies via Nato agency",
    "date": "2026-10-22",
    "time": "08:49",
    "url": "https://www.ft.com/content/991ac37c-289b-40e5-b2e6-220ee2aebe5d"
  },
  {
    "id": "cbf8759b-ec19-4728-ab65-5706bc3343af",
    "title": "Liquidators of Chinese property giant pursue Harvard to recoup donation",
    "date": "2026-10-22",
    "time": "08:45",
    "url": "https://www.ft.com/content/cbf8759b-ec19-4728-ab65-5706bc3343af"
  },
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
  }
];
