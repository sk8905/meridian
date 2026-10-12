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
    id: "da71c823-ca31-4eaa-8e6e-6baacea986a4",
    title: "Nato’s supreme commander warns Moscow against attacks in Europe",
    date: "2026-10-12",
    time: "14:34",
    url: "https://www.ft.com/content/da71c823-ca31-4eaa-8e6e-6baacea986a4"
  },
  {
    id: "a663781e-2709-41f2-99df-4fb5a6162e6b",
    title: "Diesel prices slip after Trump claims ‘energy ceasefire’ in Ukraine war",
    date: "2026-10-12",
    time: "14:23",
    url: "https://www.ft.com/content/a663781e-2709-41f2-99df-4fb5a6162e6b"
  },
  {
    id: "af0a5da6-abc7-41ab-85cf-da806fc7a6e5",
    title: "Franco-German deal on EU car policy is ‘imminent’, says Emmanuel Macron",
    date: "2026-10-12",
    time: "14:10",
    url: "https://www.ft.com/content/af0a5da6-abc7-41ab-85cf-da806fc7a6e5"
  },
  {
    id: "e374bc1a-bd56-40b4-98c9-d1b502ef9d47",
    title: "Europe is finally confronting China",
    date: "2026-10-12",
    time: "14:00",
    url: "https://www.ft.com/content/e374bc1a-bd56-40b4-98c9-d1b502ef9d47"
  },
  {
    id: "e67a9120-4dec-4796-8414-3f4990b01f11",
    title: "Labour plan to cut funds from heat pump scheme sparks industry backlash",
    date: "2026-10-12",
    time: "13:26",
    url: "https://www.ft.com/content/e67a9120-4dec-4796-8414-3f4990b01f11"
  },
  {
    id: "463be44f-5477-46e6-b4d2-460fa2551064",
    title: "India’s Narendra Modi faces ‘bitter pill’ as Cockroach protests mount",
    date: "2026-10-12",
    time: "13:08",
    url: "https://www.ft.com/content/463be44f-5477-46e6-b4d2-460fa2551064"
  },
  {
    id: "ba28b7cd-293e-4eee-a073-ad81aaefced3",
    title: "AI regulation must mimic Industrial Revolution laws, UK minister says",
    date: "2026-10-12",
    time: "13:01",
    url: "https://www.ft.com/content/ba28b7cd-293e-4eee-a073-ad81aaefced3"
  },
  {
    id: "90d5003e-dbec-4db3-88d2-d30d9c2a119d",
    title: "The EU has more bark but lacks bite towards China",
    date: "2026-10-12",
    time: "12:31",
    url: "https://www.ft.com/content/90d5003e-dbec-4db3-88d2-d30d9c2a119d"
  },
  {
    id: "863619b6-c4a7-4b1a-8a53-6950d47d1833",
    title: "Putin is breaching Trump’s ‘energy ceasefire’, Zelenskyy says",
    date: "2026-10-12",
    time: "12:22",
    url: "https://www.ft.com/content/863619b6-c4a7-4b1a-8a53-6950d47d1833"
  },
  {
    id: "c5ff7ed6-a42d-4ff3-8efa-485b1046102d",
    title: "Prune Nourry: how I resurrected Paris’s forgotten female artists",
    date: "2026-10-12",
    time: "12:00",
    url: "https://www.ft.com/content/c5ff7ed6-a42d-4ff3-8efa-485b1046102d"
  },
  {
    id: "910e014c-4716-49e2-86cc-53eae31c9607",
    title: "Redwood — Ben Macintyre decodes the murky ethics of the cold war",
    date: "2026-10-12",
    time: "12:00",
    url: "https://www.ft.com/content/910e014c-4716-49e2-86cc-53eae31c9607"
  },
  {
    id: "48b8c4ce-b2bf-44e2-badf-8159a9d664e4",
    title: "Private equity puts string of UK high street names up for sale",
    date: "2026-10-12",
    time: "12:00",
    url: "https://www.ft.com/content/48b8c4ce-b2bf-44e2-badf-8159a9d664e4"
  },
  {
    id: "0a66d390-149d-4cdc-83b6-88015da1e835",
    title: "Britain, Brexit and the cat-flap option",
    date: "2026-10-12",
    time: "11:59",
    url: "https://www.ft.com/content/0a66d390-149d-4cdc-83b6-88015da1e835"
  },
  {
    id: "51089f41-6f8b-4381-aab5-a83bbe4048c4",
    title: "Whisky highballs, fantastic fairies and a very White House indeed – don’t miss HTSI’s top reads",
    date: "2026-10-12",
    time: "11:44",
    url: "https://www.ft.com/content/51089f41-6f8b-4381-aab5-a83bbe4048c4"
  },
  {
    id: "011a7926-402e-4baa-90ba-bab4a44a74de",
    title: "Rejecting closer ties with EU would be ‘dereliction of duty’, Burnham says",
    date: "2026-10-12",
    time: "11:30",
    url: "https://www.ft.com/content/011a7926-402e-4baa-90ba-bab4a44a74de"
  },
  {
    id: "7dc561ba-a386-479d-9633-9209b76b1812",
    title: "FirstFT: Diesel prices slip after Trump announces ‘energy ceasefire’",
    date: "2026-10-12",
    time: "11:24",
    url: "https://www.ft.com/content/7dc561ba-a386-479d-9633-9209b76b1812"
  },
  {
    id: "d154e42d-5243-44f3-a837-a67681e20311",
    title: "To the manor reborn",
    date: "2026-10-12",
    time: "11:00",
    url: "https://www.ft.com/content/d154e42d-5243-44f3-a837-a67681e20311"
  },
  {
    id: "46b33d0d-274d-496e-9c42-1d4cf18b65cb",
    title: "German labour minister resigns as Merz coalition strains deepen",
    date: "2026-10-12",
    time: "10:27",
    url: "https://www.ft.com/content/46b33d0d-274d-496e-9c42-1d4cf18b65cb"
  },
  {
    id: "f4463a28-832d-4a2d-acc5-d83e258610cb",
    title: "Nobel Prize for economics awarded to Robert E Hall and Michael Woodford",
    date: "2026-10-12",
    time: "10:09",
    url: "https://www.ft.com/content/f4463a28-832d-4a2d-acc5-d83e258610cb"
  },
  {
    id: "ad0b6e93-708c-46c6-a1f2-e6248c934faf",
    title: "Riyadh defiant as Houthis launch new missile strikes on Saudi Arabia",
    date: "2026-10-12",
    time: "09:45",
    url: "https://www.ft.com/content/ad0b6e93-708c-46c6-a1f2-e6248c934faf"
  },
  {
    id: "c9eea573-6d36-467e-b7f4-90c1d957cb33",
    title: "Andy Burnham’s own goal",
    date: "2026-10-12",
    time: "09:30",
    url: "https://www.ft.com/content/c9eea573-6d36-467e-b7f4-90c1d957cb33"
  },
  {
    id: "3e94e815-95b9-4e8d-9219-c9066cec08f6",
    title: "And the FTAV charts quiz winner is . . .",
    date: "2026-10-12",
    time: "09:01",
    url: "https://www.ft.com/content/3e94e815-95b9-4e8d-9219-c9066cec08f6"
  },
  {
    id: "7e48dd50-957c-4f45-ad24-ce628ca7e06a",
    title: "EU ‘safeguards’ hybrid car sector from Chinese imports under new deal",
    date: "2026-10-12",
    time: "08:20",
    url: "https://www.ft.com/content/7e48dd50-957c-4f45-ad24-ce628ca7e06a"
  },
  {
    id: "68fd8c4f-6f34-4f6e-a52c-76f635164031",
    title: "US threatens to block arms for Ukraine over attacks on Russian refineries",
    date: "2026-10-12",
    time: "07:42",
    url: "https://www.ft.com/content/68fd8c4f-6f34-4f6e-a52c-76f635164031"
  },
  {
    id: "2aa849df-5670-4577-87dd-2c40f2bac2aa",
    title: "Is the US economy as narrow as its stock market?",
    date: "2026-10-12",
    time: "06:30",
    url: "https://www.ft.com/content/2aa849df-5670-4577-87dd-2c40f2bac2aa"
  },
  {
    id: "b01366df-466d-44ee-91c6-1c71932da89e",
    title: "FTAV’s further read",
    date: "2026-10-12",
    time: "06:30",
    url: "https://www.ft.com/content/b01366df-466d-44ee-91c6-1c71932da89e"
  },
  {
    id: "b5faacca-4561-4e9d-bec5-c8ef843b0419",
    title: "EU budget battle intensifies ahead of leaders’ summit",
    date: "2026-10-12",
    time: "06:00",
    url: "https://www.ft.com/content/b5faacca-4561-4e9d-bec5-c8ef843b0419"
  },
  {
    id: "97a2c4ae-79df-4e67-a408-91a07bfc2546",
    title: "Misery, thy name is pulled IPO",
    date: "2026-10-12",
    time: "06:00",
    url: "https://www.ft.com/content/97a2c4ae-79df-4e67-a408-91a07bfc2546"
  },
  {
    id: "d3a342a9-0b64-4dd3-8f12-54c6750509de",
    title: "Wall Street’s great money spinner",
    date: "2026-10-12",
    time: "06:00",
    url: "https://www.ft.com/content/d3a342a9-0b64-4dd3-8f12-54c6750509de"
  },
  {
    id: "62bab2c8-d4e2-4ec2-a911-80439f61f238",
    title: "Trump battles to save the Senate",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/62bab2c8-d4e2-4ec2-a911-80439f61f238"
  },
  {
    id: "b0acd823-ca55-481c-93de-0e292a401b37",
    title: "Heathrow needs Burnham green light for runway by end of year, warns boss",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/b0acd823-ca55-481c-93de-0e292a401b37"
  },
  {
    id: "50bb9758-abf7-43a4-bd8b-0c1e5895b4c2",
    title: "Wall Street’s record-breaking trading streak set to cool",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/50bb9758-abf7-43a4-bd8b-0c1e5895b4c2"
  },
  {
    id: "0c5a10f4-5aca-456e-9c3a-4c4dc8132a63",
    title: "Nato should prepare for deadly Russian ‘hybrid’ attack, says Poland",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/0c5a10f4-5aca-456e-9c3a-4c4dc8132a63"
  },
  {
    id: "e0457dd5-8e75-4803-8ce8-6651157d2229",
    title: "‘Worrying omens’ stalk global economy despite resilient growth",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/e0457dd5-8e75-4803-8ce8-6651157d2229"
  },
  {
    id: "e6c9d380-7108-405a-8393-5240771809fe",
    title: "There is a smarter way to tax the rich",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/e6c9d380-7108-405a-8393-5240771809fe"
  },
  {
    id: "1d85912b-7a70-4ba1-87df-3b683adee91e",
    title: "Houthis attack Riyadh airport",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/1d85912b-7a70-4ba1-87df-3b683adee91e"
  },
  {
    id: "4886bddc-0554-450c-9459-d67200c57cc4",
    title: "How the Man City cheating scandal laid a geopolitical minefield",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/4886bddc-0554-450c-9459-d67200c57cc4"
  },
  {
    id: "17a207f4-1563-48af-91e3-14bac89ab4b8",
    title: "The huge lurking leverage of AI hyperscalers",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/17a207f4-1563-48af-91e3-14bac89ab4b8"
  },
  {
    id: "6235bf20-80da-42c0-b9cc-e4d996d6c135",
    title: "CVC planned to hush Israel defence deal to avoid controversy",
    date: "2026-10-12",
    time: "05:00",
    url: "https://www.ft.com/content/6235bf20-80da-42c0-b9cc-e4d996d6c135"
  },
  {
    id: "b00db29e-4334-4e04-8f09-a140aafd4b05",
    title: "Andy Burnham to step up UK business outreach amid fears of Budget tax rises",
    date: "2026-10-12",
    time: "00:01",
    url: "https://www.ft.com/content/b00db29e-4334-4e04-8f09-a140aafd4b05"
  }
];
