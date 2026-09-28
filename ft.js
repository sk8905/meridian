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
    id: "1bc39466-bd7c-4c42-a89b-fd81646705e2",
    title: "Can the EU help to build a ‘hybrid defence’ against Russia?",
    date: "2026-09-28",
    time: "06:00",
    url: "https://www.ft.com/content/1bc39466-bd7c-4c42-a89b-fd81646705e2"
  },
  {
    id: "e2f33efb-f884-4ca9-bf4f-833964e7bf37",
    title: "Goldman’s hedge fund fee bonanza",
    date: "2026-09-28",
    time: "06:00",
    url: "https://www.ft.com/content/e2f33efb-f884-4ca9-bf4f-833964e7bf37"
  },
  {
    id: "1a442c17-ef23-478b-8aed-1bca65cbb45f",
    title: "The Bank of England’s balance sheet has already stopped shrinking",
    date: "2026-09-28",
    time: "06:00",
    url: "https://www.ft.com/content/1a442c17-ef23-478b-8aed-1bca65cbb45f"
  },
  {
    id: "47019489-f00e-4c96-bb79-5c628c89b3a1",
    title: "FirstFT: EU weighs response to Russian hybrid attacks",
    date: "2026-09-28",
    time: "05:32",
    url: "https://www.ft.com/content/47019489-f00e-4c96-bb79-5c628c89b3a1"
  },
  {
    id: "d751ad99-531d-4990-9a4c-ee89a9fc1b2d",
    title: "Oil price rise puts more pressure on government bonds",
    date: "2026-09-28",
    time: "05:31",
    url: "https://www.ft.com/content/d751ad99-531d-4990-9a4c-ee89a9fc1b2d"
  },
  {
    id: "c3cebf7d-43fd-4962-b4ec-b55bcbce4c2a",
    title: "Analysts’ views: forecasters see further insurance increases in 2026",
    date: "2026-09-28",
    time: "05:30",
    url: "https://www.ft.com/content/c3cebf7d-43fd-4962-b4ec-b55bcbce4c2a"
  },
  {
    id: "b1ba7dd2-3e3a-4944-b637-ff7db3b636e1",
    title: "US and China agree $60bn low tariff regime spanning foie gras to camels",
    date: "2026-09-28",
    time: "05:04",
    url: "https://www.ft.com/content/b1ba7dd2-3e3a-4944-b637-ff7db3b636e1"
  },
  {
    id: "5513b441-a575-4c73-8532-cb09216c4406",
    title: "EU countries consider Nato-style joint responses to Russian hybrid attacks",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/5513b441-a575-4c73-8532-cb09216c4406"
  },
  {
    id: "aa0a3458-b69d-423d-9654-9ad45c8432d9",
    title: "A message for the chancellor: the time is now ripe for tax reform",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/aa0a3458-b69d-423d-9654-9ad45c8432d9"
  },
  {
    id: "1fdf6289-bc99-4263-af79-da1060a09394",
    title: "UK biodiesel industry attacks decision to reject duties on cheaper US imports",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/1fdf6289-bc99-4263-af79-da1060a09394"
  },
  {
    id: "b4dde6f6-f91f-4d3e-8ce1-ab8be69dab47",
    title: "GM warns on US market as carmakers seek ‘safe haven’ from Chinese rivals",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/b4dde6f6-f91f-4d3e-8ce1-ab8be69dab47"
  },
  {
    id: "6fe783e2-6472-4b66-b126-7f85c8ffef99",
    title: "The Pope lends his voice to Europe’s fight against the far right",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/6fe783e2-6472-4b66-b126-7f85c8ffef99"
  },
  {
    id: "957f68f9-9f74-4857-9773-d3be3ef3f305",
    title: "Kremlin pressures Russian businesses to pay for drone defences",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/957f68f9-9f74-4857-9773-d3be3ef3f305"
  },
  {
    id: "8b7f5c50-7ab5-46e1-96c7-e48c010f615b",
    title: "The bargain between shareholders and companies is being eroded",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/8b7f5c50-7ab5-46e1-96c7-e48c010f615b"
  },
  {
    id: "4339e9f0-ff48-4873-be6a-36cbac2631c4",
    title: "For once, the Fed has put Main Street before Wall Street",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/4339e9f0-ff48-4873-be6a-36cbac2631c4"
  },
  {
    id: "1d7d2bc0-7721-4c4e-a8a6-e859bad9c13a",
    title: "Glencore says HMRC was 18 months late with £264mn tax bill",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/1d7d2bc0-7721-4c4e-a8a6-e859bad9c13a"
  },
  {
    id: "b782f295-c8d7-4e72-9987-a24ede2b1fd4",
    title: "Foreign investors bet Panama can shrug off social unrest and Trump threats",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/b782f295-c8d7-4e72-9987-a24ede2b1fd4"
  },
  {
    id: "00f94018-e658-4545-b16e-1bc00e19b754",
    title: "AI hyperscalers are transforming debt",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/00f94018-e658-4545-b16e-1bc00e19b754"
  },
  {
    id: "2ef0c2fa-9626-4785-94cd-65fbf5be5741",
    title: "The post-Enron auditor reforms are being rolled back",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/2ef0c2fa-9626-4785-94cd-65fbf5be5741"
  },
  {
    id: "ba19ec85-c736-4cfd-9a85-4e1ddf1938e5",
    title: "The crisis at Big Law powerhouse Weil",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/ba19ec85-c736-4cfd-9a85-4e1ddf1938e5"
  },
  {
    id: "f9c197e8-e163-4ffe-8563-3fe4e9c76f89",
    title: "How London became the property market’s black sheep",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/f9c197e8-e163-4ffe-8563-3fe4e9c76f89"
  },
  {
    id: "4838f5d1-44e4-414e-a092-c738db47d7b9",
    title: "Rich turn to borrowing against private equity holdings as payouts slow",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/4838f5d1-44e4-414e-a092-c738db47d7b9"
  },
  {
    id: "ca02d69d-a519-4436-b758-3612fd657edc",
    title: "Andy Burnham’s first Labour conference as prime minister",
    date: "2026-09-28",
    time: "05:00",
    url: "https://www.ft.com/content/ca02d69d-a519-4436-b758-3612fd657edc"
  },
  {
    id: "fb3aa961-fa28-4dd0-a2ea-cdb03ac8258d",
    title: "Donald Trump hosts Anthropic CEO Dario Amodei at White House",
    date: "2026-09-28",
    time: "04:25",
    url: "https://www.ft.com/content/fb3aa961-fa28-4dd0-a2ea-cdb03ac8258d"
  },
  {
    id: "57765bee-3ee6-4fa9-bea5-feaaf277a647",
    title: "JCB’s Anthony Bamford names youngest child George as co-chair",
    date: "2026-09-28",
    time: "00:01",
    url: "https://www.ft.com/content/57765bee-3ee6-4fa9-bea5-feaaf277a647"
  },
  {
    id: "46c33655-91ec-4120-8d0f-f0062835aa1b",
    title: "Healey to promise ‘new age of industrialisation’ with £6bn Royal Navy plan",
    date: "2026-09-28",
    time: "00:01",
    url: "https://www.ft.com/content/46c33655-91ec-4120-8d0f-f0062835aa1b"
  },
  {
    id: "878402a7-eeac-453e-b9db-92156107c5ce",
    title: "UK to restart resettlement scheme, Shabana Mahmood to tell Labour conference",
    date: "2026-09-27",
    time: "22:43",
    url: "https://www.ft.com/content/878402a7-eeac-453e-b9db-92156107c5ce"
  },
  {
    id: "04923b0e-a955-4cfa-bd05-cd828807f61d",
    title: "World’s worst-performing market slashes minimum price for stocks",
    date: "2026-09-27",
    time: "22:00",
    url: "https://www.ft.com/content/04923b0e-a955-4cfa-bd05-cd828807f61d"
  },
  {
    id: "8b4690d4-7c02-48af-b117-56faf21c389d",
    title: "Trump asked Xi if China wanted to buy American weapons, US envoy says",
    date: "2026-09-27",
    time: "21:31",
    url: "https://www.ft.com/content/8b4690d4-7c02-48af-b117-56faf21c389d"
  },
  {
    id: "48b8a95c-ef76-48a5-8449-0c56865c7e01",
    title: "Burnham’s high-stakes speech unlikely to produce a Clause IV moment",
    date: "2026-09-27",
    time: "18:15",
    url: "https://www.ft.com/content/48b8a95c-ef76-48a5-8449-0c56865c7e01"
  },
  {
    id: "d9de4776-1fc9-4f2b-aaaf-9961c35d8acd",
    title: "Corporate America embraces cheaper ‘open’ AI models",
    date: "2026-09-27",
    time: "18:00",
    url: "https://www.ft.com/content/d9de4776-1fc9-4f2b-aaaf-9961c35d8acd"
  },
  {
    id: "b15849ac-fa14-43cc-af96-fb9980158693",
    title: "The real lesson from the Man City affair",
    date: "2026-09-27",
    time: "17:58",
    url: "https://www.ft.com/content/b15849ac-fa14-43cc-af96-fb9980158693"
  },
  {
    id: "875027a3-db29-40a6-b17c-fa97c30fd07b",
    title: "Terrorism arrests made in ‘major incident’ near RAF Fairford",
    date: "2026-09-27",
    time: "17:47",
    url: "https://www.ft.com/content/875027a3-db29-40a6-b17c-fa97c30fd07b"
  },
  {
    id: "6c9db7fb-e213-43ca-b4d9-1e809dcfd39a",
    title: "‘Hope again’: Burnham returns to Labour conference to sell his vision",
    date: "2026-09-27",
    time: "17:40",
    url: "https://www.ft.com/content/6c9db7fb-e213-43ca-b4d9-1e809dcfd39a"
  },
  {
    id: "c9957c9f-8622-4351-9380-9b725b70b1e7",
    title: "Northern Ireland in tense stand-off as protests block Orange Order parade",
    date: "2026-09-27",
    time: "17:35",
    url: "https://www.ft.com/content/c9957c9f-8622-4351-9380-9b725b70b1e7"
  },
  {
    id: "c3bd247b-646f-4333-9250-da3d2c6e6c2c",
    title: "Spain erupts in fury over housing after eviction of 87-year-old woman",
    date: "2026-09-27",
    time: "17:27",
    url: "https://www.ft.com/content/c3bd247b-646f-4333-9250-da3d2c6e6c2c"
  },
  {
    id: "267379ff-8491-478b-a10f-ad19a67df37c",
    title: "Pay to play in the age of corporate migration",
    date: "2026-09-27",
    time: "16:00",
    url: "https://www.ft.com/content/267379ff-8491-478b-a10f-ad19a67df37c"
  },
  {
    id: "1276c358-4b3b-453d-b774-27aae2ecc486",
    title: "Milan Fashion Week seeks the fizz",
    date: "2026-09-27",
    time: "14:24",
    url: "https://www.ft.com/content/1276c358-4b3b-453d-b774-27aae2ecc486"
  },
  {
    id: "23cd91df-80c5-45c0-9175-d61b74404f12",
    title: "Andy Burnham signals he will fight election on tax rises to fund social care reform",
    date: "2026-09-27",
    time: "14:02",
    url: "https://www.ft.com/content/23cd91df-80c5-45c0-9175-d61b74404f12"
  },
  {
    id: "aaf4c7d7-b4bc-4b5c-83b7-7f761d315b63",
    title: "Swiss voters reject proposal to strengthen neutrality",
    date: "2026-09-27",
    time: "13:42",
    url: "https://www.ft.com/content/aaf4c7d7-b4bc-4b5c-83b7-7f761d315b63"
  },
  {
    id: "afb910e4-5425-4d3e-b0ef-c1d260f29945",
    title: "The India shock: exporting workers to the world",
    date: "2026-09-27",
    time: "12:00",
    url: "https://www.ft.com/content/afb910e4-5425-4d3e-b0ef-c1d260f29945"
  },
  {
    id: "08fe7323-5a2f-4d46-ad64-132ce469b381",
    title: "Will US jobs data add to pressure on Fed policymakers?",
    date: "2026-09-27",
    time: "12:00",
    url: "https://www.ft.com/content/08fe7323-5a2f-4d46-ad64-132ce469b381"
  },
];
