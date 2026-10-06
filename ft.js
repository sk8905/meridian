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
    id: "0e4afbdc-c018-4ee4-86b3-4248ae3e97ab",
    title: "The creditor bloodbath in UK telecoms",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/0e4afbdc-c018-4ee4-86b3-4248ae3e97ab",
  },
  {
    id: "309a7685-e488-44f4-ad76-4247b7f8bb5b",
    title: "BT’s swoop on TalkTalk has regulators over a barrel",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/309a7685-e488-44f4-ad76-4247b7f8bb5b",
  },
  {
    id: "3410674b-581f-468d-93d3-01fed6411806",
    title: "Labour mayor of West Midlands urges chancellor to relax electric car targets",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/3410674b-581f-468d-93d3-01fed6411806",
  },
  {
    id: "76db879a-2c53-4aee-8354-b30185f1d3a4",
    title: "German far-right set to secure its first ever regional parliament president",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/76db879a-2c53-4aee-8354-b30185f1d3a4",
  },
  {
    id: "ed28bf56-70b6-4e05-b48e-6a016699a675",
    title: "Brazil’s rightwing surge boosts Flávio Bolsonaro’s push to free his father",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/ed28bf56-70b6-4e05-b48e-6a016699a675",
  },
  {
    id: "ffc5d121-9143-4760-86d7-d1a0fc885af4",
    title: "Andy Burnham’s Manchester City problem",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/ffc5d121-9143-4760-86d7-d1a0fc885af4",
  },
  {
    id: "efec7d66-f205-4df4-81e3-6652ec0ddc85",
    title: "Why accountancy firm listings don’t add up",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/efec7d66-f205-4df4-81e3-6652ec0ddc85",
  },
  {
    id: "a896cda0-cd0c-4aae-bc51-daec26157e56",
    title: "Intercontinental Exchange launches trading in gold futures in London",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/a896cda0-cd0c-4aae-bc51-daec26157e56",
  },
  {
    id: "70308419-20a2-4236-a03e-346b4626997b",
    title: "NextEra’s $67bn Dominion takeover faces political backlash in Virginia",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/70308419-20a2-4236-a03e-346b4626997b",
  },
  {
    id: "b3034c7f-e660-412b-87a4-a212539edba2",
    title: "Britain has turned digital ID into a growth industry",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/b3034c7f-e660-412b-87a4-a212539edba2",
  },
  {
    id: "55b65eed-89ba-4a7c-b137-b8c5284f7401",
    title: "Can Kemi Badenoch return the Tories to power?",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/55b65eed-89ba-4a7c-b137-b8c5284f7401",
  },
  {
    id: "7c7ccb82-2973-47af-ad9b-b469c6ea0048",
    title: "Surge in borrowing costs hits corporate America",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/7c7ccb82-2973-47af-ad9b-b469c6ea0048",
  },
  {
    id: "9b252b46-a87c-45e7-a09a-45a39ce077b8",
    title: "France: between the bond market and the barricades",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/9b252b46-a87c-45e7-a09a-45a39ce077b8",
  },
  {
    id: "8f783c04-5fc5-43d4-bab2-495ac31806c6",
    title: "Silicon Valley expects AI will kill jobs but economists are not convinced",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/8f783c04-5fc5-43d4-bab2-495ac31806c6",
  },
  {
    id: "d1478058-6309-459f-875c-0a5409d715b4",
    title: "Algeria projects its power in the Sahara",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/d1478058-6309-459f-875c-0a5409d715b4",
  },
  {
    id: "aa851d11-33dc-4f1f-9e95-95907ff7dde5",
    title: "UK workers expect to retire five years later than they would like",
    date: "2026-10-06",
    time: "00:01",
    url: "https://www.ft.com/content/aa851d11-33dc-4f1f-9e95-95907ff7dde5",
  },
  {
    id: "4087c789-a7ed-4365-bd35-9127bc58c3ae",
    title: "FCA to examine how it treated whistleblower who died by suicide",
    date: "2026-10-06",
    time: "00:01",
    url: "https://www.ft.com/content/4087c789-a7ed-4365-bd35-9127bc58c3ae",
  },
  {
    id: "71dccbca-4a1f-485a-9790-28cc527cdb82",
    title: "US affordability tracker: the data that could decide the 2026 midterm elections",
    date: "2026-10-05",
    time: "22:56",
    url: "https://www.ft.com/content/71dccbca-4a1f-485a-9790-28cc527cdb82",
  },
  {
    id: "6e57c480-39d9-4b4d-946a-092387cee493",
    title: "Donald Trump says US pulled bombers from UK after ‘threats’",
    date: "2026-10-05",
    time: "22:01",
    url: "https://www.ft.com/content/6e57c480-39d9-4b4d-946a-092387cee493",
  },
  {
    id: "f30a1afc-2aa8-4cdd-a6e8-b18523298456",
    title: "Tories pledge ‘Britannia Shield’ to protect UK from drone attacks",
    date: "2026-10-05",
    time: "22:00",
    url: "https://www.ft.com/content/f30a1afc-2aa8-4cdd-a6e8-b18523298456",
  },
  {
    id: "5b9c8ce3-d07c-46f9-8cea-cbc4e7f8ccca",
    title: "Wall Street banks launch record $60bn chip deal for Broadcom and Anthropic",
    date: "2026-10-05",
    time: "21:58",
    url: "https://www.ft.com/content/5b9c8ce3-d07c-46f9-8cea-cbc4e7f8ccca",
  },
  {
    id: "0bc54eaf-d545-4591-bb7c-ec3cbc1cb89a",
    title: "McKesson and CD&R near $5bn-plus deal to buy infusion services provider",
    date: "2026-10-05",
    time: "21:01",
    url: "https://www.ft.com/content/0bc54eaf-d545-4591-bb7c-ec3cbc1cb89a",
  },
  {
    id: "ddcb3e51-4bff-4419-ac2e-01cc632b6f03",
    title: "When a label costs you $4bn in market cap",
    date: "2026-10-05",
    time: "20:30",
    url: "https://www.ft.com/content/ddcb3e51-4bff-4419-ac2e-01cc632b6f03",
  },
  {
    id: "353be303-3271-43f0-aefb-69b6ed7a0a6f",
    title: "Reflection AI boosts US ambition to compete with Chinese ‘open’ models",
    date: "2026-10-05",
    time: "20:00",
    url: "https://www.ft.com/content/353be303-3271-43f0-aefb-69b6ed7a0a6f",
  },
  {
    id: "7a00c5b9-62b5-4101-a5f0-ebf828dc6a90",
    title: "Former prince Andrew seeks judicial review of police searches",
    date: "2026-10-05",
    time: "19:34",
    url: "https://www.ft.com/content/7a00c5b9-62b5-4101-a5f0-ebf828dc6a90",
  },
  {
    id: "b8307200-0c5e-440f-94ee-f0d2cc55584e",
    title: "Tories pledge big tax cuts in push to win over wealthy voters",
    date: "2026-10-05",
    time: "19:28",
    url: "https://www.ft.com/content/b8307200-0c5e-440f-94ee-f0d2cc55584e",
  },
  {
    id: "6a66982e-7c57-4081-9fe4-800fa2cd3501",
    title: "Brazil’s Bolsonaro comeback exposes Lula’s weakness",
    date: "2026-10-05",
    time: "18:45",
    url: "https://www.ft.com/content/6a66982e-7c57-4081-9fe4-800fa2cd3501",
  },
  {
    id: "8a733f73-d506-49ae-9030-2bbf0987bc8d",
    title: "Donald Trump poised to ease red diesel limits in attempt to quell fuel inflation",
    date: "2026-10-05",
    time: "18:41",
    url: "https://www.ft.com/content/8a733f73-d506-49ae-9030-2bbf0987bc8d",
  },
  {
    id: "ae67bb6f-f227-4679-949f-2e79e2dc33e2",
    title: "TotalEnergies boss hails ‘opportunities’ created by global market turmoil",
    date: "2026-10-05",
    time: "18:33",
    url: "https://www.ft.com/content/ae67bb6f-f227-4679-949f-2e79e2dc33e2",
  },
  {
    id: "74c3cc77-1593-4c49-90f9-0d92fa3a2418",
    title: "French central bank head warns country at risk of being ‘strangled by interest rates’",
    date: "2026-10-05",
    time: "17:56",
    url: "https://www.ft.com/content/74c3cc77-1593-4c49-90f9-0d92fa3a2418",
  },
  {
    id: "126e56d2-c4a6-477f-a1d4-dadbe1013fb4",
    title: "And the charts quiz winner is…",
    date: "2026-10-05",
    time: "17:46",
    url: "https://www.ft.com/content/126e56d2-c4a6-477f-a1d4-dadbe1013fb4",
  },
  {
    id: "711333ba-67a9-480c-bf65-a3e484a6406b",
    title: "Badenoch’s pitch goes some way to assuaging British business concerns",
    date: "2026-10-05",
    time: "17:16",
    url: "https://www.ft.com/content/711333ba-67a9-480c-bf65-a3e484a6406b",
  },
  {
    id: "41b567dc-50e9-4c41-95bb-e295caaf2340",
    title: "Citi to speed up promotion path for junior bankers as hiring war heats up",
    date: "2026-10-05",
    time: "16:49",
    url: "https://www.ft.com/content/41b567dc-50e9-4c41-95bb-e295caaf2340",
  },
  {
    id: "8b19b9f7-9237-47bf-bc50-d8b78aa7fe24",
    title: "Euro slides to 17-month low against dollar",
    date: "2026-10-05",
    time: "16:44",
    url: "https://www.ft.com/content/8b19b9f7-9237-47bf-bc50-d8b78aa7fe24",
  },
  {
    id: "8b19b9f7-9237-47bf-bc50-d8b78aa7fe24",
    title: "Euro slides to 17-month low against dollar",
    date: "2026-10-05",
    time: "16:44",
    url: "https://www.ft.com/content/8b19b9f7-9237-47bf-bc50-d8b78aa7fe24",
  },
  {
    id: "f77c61bd-ed39-4e20-b8d3-7c62dba74001",
    title: "Ethiopian government seizes Tigray capital in blow to rebels",
    date: "2026-10-05",
    time: "16:36",
    url: "https://www.ft.com/content/f77c61bd-ed39-4e20-b8d3-7c62dba74001",
  },
  {
    id: "7c6bfe8f-eae2-47f7-98e5-19e714195c58",
    title: "Spanish PM Pedro Sánchez looks for political lifeline in snap election",
    date: "2026-10-05",
    time: "16:33",
    url: "https://www.ft.com/content/7c6bfe8f-eae2-47f7-98e5-19e714195c58",
  },
  {
    id: "f30f83da-96d0-45bf-8fb6-36550d2b9f7d",
    title: "Giorgia Meloni seeks to trademark her voice to counter AI deepfakes",
    date: "2026-10-05",
    time: "16:31",
    url: "https://www.ft.com/content/f30f83da-96d0-45bf-8fb6-36550d2b9f7d",
  },
  {
    id: "2915c093-4735-4043-97c9-157a2a2586d1",
    title: "Burnham’s Budget must not be overshadowed by the OBR",
    date: "2026-10-05",
    time: "16:00",
    url: "https://www.ft.com/content/2915c093-4735-4043-97c9-157a2a2586d1",
  },
  {
    id: "17ca0b3c-604e-4690-b58a-f65dfce15b5d",
    title: "David Ellison sticks with Mark Thompson as CNN boss amid Trump attacks",
    date: "2026-10-05",
    time: "15:31",
    url: "https://www.ft.com/content/17ca0b3c-604e-4690-b58a-f65dfce15b5d",
  },
];
