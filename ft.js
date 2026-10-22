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
    "id": "0a5c7582-133c-4e24-8e3d-daa30f5dad56",
    "title": "UK waters down ‘fit and proper’ rules set up to hold bankers to account",
    "date": "2026-10-22",
    "time": "21:00",
    "url": "https://www.ft.com/content/0a5c7582-133c-4e24-8e3d-daa30f5dad56"
  },
  {
    "id": "8ada683f-9534-461d-9a3a-fc541550df16",
    "title": "Donald Trump ordered to face BBC questioning in $10bn defamation lawsuit",
    "date": "2026-10-22",
    "time": "19:36",
    "url": "https://www.ft.com/content/8ada683f-9534-461d-9a3a-fc541550df16"
  },
  {
    "id": "9a072c7a-b0ee-4a43-ae73-b19bbde9261b",
    "title": "Ecuador opposition leader arrested in money laundering investigation",
    "date": "2026-10-22",
    "time": "18:47",
    "url": "https://www.ft.com/content/9a072c7a-b0ee-4a43-ae73-b19bbde9261b"
  },
  {
    "id": "d774c15e-22e4-4873-9a1d-92d6561290f9",
    "title": "US to fund speculative nuclear fusion venture backed by investors with ties to Trump",
    "date": "2026-10-22",
    "time": "18:20",
    "url": "https://www.ft.com/content/d774c15e-22e4-4873-9a1d-92d6561290f9"
  },
  {
    "id": "73986a48-b513-458b-b8ea-f9e11ed3e941",
    "title": "Starlink saga shows why Europe must catch up in space",
    "date": "2026-10-22",
    "time": "17:39",
    "url": "https://www.ft.com/content/73986a48-b513-458b-b8ea-f9e11ed3e941"
  },
  {
    "id": "52b728a2-3075-4310-bffb-4f17b587724d",
    "title": "Number of UK founders choosing to sell not scale hits eight-year high",
    "date": "2026-10-22",
    "time": "17:25",
    "url": "https://www.ft.com/content/52b728a2-3075-4310-bffb-4f17b587724d"
  },
  {
    "id": "c514f3c5-b174-4a92-ab45-aa19ddc63fc1",
    "title": "Steve Cohen takes Hertz for a defensive spin",
    "date": "2026-10-22",
    "time": "16:48",
    "url": "https://www.ft.com/content/c514f3c5-b174-4a92-ab45-aa19ddc63fc1"
  },
  {
    "id": "63ed58ac-f9ef-41b7-a172-dc540337b698",
    "title": "Creditors to Sanjeev Gupta’s first UK steel plant appoint liquidators",
    "date": "2026-10-22",
    "time": "16:44",
    "url": "https://www.ft.com/content/63ed58ac-f9ef-41b7-a172-dc540337b698"
  },
  {
    "id": "42176f60-b2fd-431c-9f2c-e7e015b07315",
    "title": "Would you take out a mortgage backed by bitcoin?",
    "date": "2026-10-22",
    "time": "16:00",
    "url": "https://www.ft.com/content/42176f60-b2fd-431c-9f2c-e7e015b07315"
  },
  {
    "id": "a88ac504-4d86-4f27-a1e9-cf63db032ab5",
    "title": "Britain secures gas supply from Belgium before winter crunch",
    "date": "2026-10-22",
    "time": "15:26",
    "url": "https://www.ft.com/content/a88ac504-4d86-4f27-a1e9-cf63db032ab5"
  },
  {
    "id": "6517874d-25b5-446f-9c9a-9326ab30dfa9",
    "title": "Germany’s Friedrich Merz warns of ‘intense’ Russian espionage after arrest",
    "date": "2026-10-22",
    "time": "15:24",
    "url": "https://www.ft.com/content/6517874d-25b5-446f-9c9a-9326ab30dfa9"
  },
  {
    "id": "9ddd1583-9296-4264-8ddd-dbf11469def9",
    "title": "Donald Trump’s tourism push fails to lure visitors",
    "date": "2026-10-22",
    "time": "14:54",
    "url": "https://www.ft.com/content/9ddd1583-9296-4264-8ddd-dbf11469def9"
  },
  {
    "id": "a7957ed9-0124-451d-ba34-5e015c58e351",
    "title": "Barclays stands out from the crowd for the wrong reasons",
    "date": "2026-10-22",
    "time": "14:48",
    "url": "https://www.ft.com/content/a7957ed9-0124-451d-ba34-5e015c58e351"
  },
  {
    "id": "b34502b6-38dc-4a46-a8e7-d9131726cd31",
    "title": "Meta agrees deal to keep Mark Zuckerberg in California despite wealth tax proposal",
    "date": "2026-10-22",
    "time": "14:40",
    "url": "https://www.ft.com/content/b34502b6-38dc-4a46-a8e7-d9131726cd31"
  },
  {
    "id": "2d4876ae-c707-4df5-a3ae-ae3268343ef2",
    "title": "Shell and Exxon’s $8bn UK chemicals unit put up for sale",
    "date": "2026-10-22",
    "time": "14:36",
    "url": "https://www.ft.com/content/2d4876ae-c707-4df5-a3ae-ae3268343ef2"
  },
  {
    "id": "6e318b81-a771-4842-9754-e265fef2852f",
    "title": "Global stocks tumble as oil price tops $112",
    "date": "2026-10-22",
    "time": "14:31",
    "url": "https://www.ft.com/content/6e318b81-a771-4842-9754-e265fef2852f"
  },
  {
    "id": "93852564-cae6-41f6-aa79-8db53e2b7774",
    "title": "ECB on course for another rate rise in 2026",
    "date": "2026-10-22",
    "time": "14:30",
    "url": "https://www.ft.com/content/93852564-cae6-41f6-aa79-8db53e2b7774"
  },
  {
    "id": "9f0c58d3-1833-40de-b805-f5ac53f05ff0",
    "title": "Russia drops cluster warheads on Kyiv after Witkoff-Putin peace talks",
    "date": "2026-10-22",
    "time": "14:18",
    "url": "https://www.ft.com/content/9f0c58d3-1833-40de-b805-f5ac53f05ff0"
  },
  {
    "id": "c6c68f72-4d00-4475-b7ec-847fd2c4d2fa",
    "title": "Turkey cuts interest rates despite $18bn investment funds scandal",
    "date": "2026-10-22",
    "time": "14:06",
    "url": "https://www.ft.com/content/c6c68f72-4d00-4475-b7ec-847fd2c4d2fa"
  },
  {
    "id": "43f3144f-7aa8-4821-b5c6-0da470b9af34",
    "title": "Macron warns some protests will be banned",
    "date": "2026-10-22",
    "time": "13:36",
    "url": "https://www.ft.com/content/43f3144f-7aa8-4821-b5c6-0da470b9af34"
  },
  {
    "id": "43f5c6af-5b1f-4995-9263-b7882013cb99",
    "title": "Serbia’s students should take a leaf out of Magyar’s book",
    "date": "2026-10-22",
    "time": "13:30",
    "url": "https://www.ft.com/content/43f5c6af-5b1f-4995-9263-b7882013cb99"
  },
  {
    "id": "b97d2ce4-43b0-4551-8ad8-059abb9d3f3e",
    "title": "Europe’s moderates must stop treating politics as a spectator sport",
    "date": "2026-10-22",
    "time": "13:22",
    "url": "https://www.ft.com/content/b97d2ce4-43b0-4551-8ad8-059abb9d3f3e"
  },
  {
    "id": "587f1f89-3bff-4aae-9130-41f142f1cc5f",
    "title": "China steps up ‘grey zone’ tactics to isolate Taiwan and punish its allies",
    "date": "2026-10-22",
    "time": "13:16",
    "url": "https://www.ft.com/content/587f1f89-3bff-4aae-9130-41f142f1cc5f"
  },
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
  }
];
