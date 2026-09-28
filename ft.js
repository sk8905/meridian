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
    id: "9d0437c4-e5ee-465d-92bc-9491c1baff93",
    title: "Lord Mayor of London favourite pulls out over ‘criminal proceedings’ at former firm",
    date: "2026-09-28",
    time: "12:12",
    url: "https://www.ft.com/content/9d0437c4-e5ee-465d-92bc-9491c1baff93"
  },
  {
    id: "7783e1fd-5787-461f-be5d-63dad6eb0150",
    title: "Why Europe’s centre will hold",
    date: "2026-09-28",
    time: "12:01",
    url: "https://www.ft.com/content/7783e1fd-5787-461f-be5d-63dad6eb0150"
  },
  {
    id: "f83b44e9-406b-4004-9fdb-83357c3ac977",
    title: "What is the AI capex breakeven rate?",
    date: "2026-09-28",
    time: "12:00",
    url: "https://www.ft.com/content/f83b44e9-406b-4004-9fdb-83357c3ac977"
  },
  {
    id: "4cf7fc4e-0fc3-4a44-8710-4299c719cc6a",
    title: "How much? The realities of rising home renovation costs",
    date: "2026-09-28",
    time: "12:00",
    url: "https://www.ft.com/content/4cf7fc4e-0fc3-4a44-8710-4299c719cc6a"
  },
  {
    id: "51089f41-6f8b-4381-aab5-a83bbe4048c4",
    title: "A-list lunches, Oxbridge dinners – and the £400 toothbrush. Don’t miss HTSI’s top reads",
    date: "2026-09-28",
    time: "11:22",
    url: "https://www.ft.com/content/51089f41-6f8b-4381-aab5-a83bbe4048c4"
  },
  {
    id: "db266f36-c6d3-4368-8633-290e2c35e54d",
    title: "Submit a question: What’s next for the global economy?",
    date: "2026-09-28",
    time: "11:18",
    url: "https://www.ft.com/content/db266f36-c6d3-4368-8633-290e2c35e54d"
  },
  {
    id: "77d453cb-f399-4c8e-b59f-bda9116db757",
    title: "Pick any colour watch – so long as it’s gold",
    date: "2026-09-28",
    time: "11:00",
    url: "https://www.ft.com/content/77d453cb-f399-4c8e-b59f-bda9116db757"
  },
  {
    id: "b43739dc-eb98-4bf4-ae4e-a966139ce6f0",
    title: "And the FTAV chart quiz winner is . . .",
    date: "2026-09-28",
    time: "10:52",
    url: "https://www.ft.com/content/b43739dc-eb98-4bf4-ae4e-a966139ce6f0"
  },
  {
    id: "13051aaf-3e1e-41ff-9e0d-b48ff9a0249e",
    title: "Apple patent defeat could hand $1.4bn to Burford Capital",
    date: "2026-09-28",
    time: "11:08",
    url: "https://www.ft.com/content/13051aaf-3e1e-41ff-9e0d-b48ff9a0249e"
  },
  {
    id: "b6be8bb9-a0df-4e3d-ab93-57b1aa65aa95",
    title: "Ukraine airlifts aid to Russian-occupied city",
    date: "2026-09-28",
    time: "11:04",
    url: "https://www.ft.com/content/b6be8bb9-a0df-4e3d-ab93-57b1aa65aa95"
  },
  {
    id: "7761f1ee-0310-4f8d-bac1-f3e5f2354d45",
    title: "Labour conference live: John Healey to give first party speech as UK chancellor",
    date: "2026-09-28",
    time: "11:04",
    url: "https://www.ft.com/content/7761f1ee-0310-4f8d-bac1-f3e5f2354d45"
  },
  {
    id: "d751ad99-531d-4990-9a4c-ee89a9fc1b2d",
    title: "Bond sell-off deepens as oil rises above $108",
    date: "2026-09-28",
    time: "10:56",
    url: "https://www.ft.com/content/d751ad99-531d-4990-9a4c-ee89a9fc1b2d"
  },
  {
    id: "1cd3310e-da01-49da-9a3c-8029d59f5761",
    title: "TotalEnergies boosts buybacks and dividends as oil prices surge",
    date: "2026-09-28",
    time: "10:27",
    url: "https://www.ft.com/content/1cd3310e-da01-49da-9a3c-8029d59f5761"
  },
  {
    id: "f4e078f7-4aab-43f5-8eb5-2dbd7142a752",
    title: "Northern Ireland’s political parties agree on one thing: £1.5bn is not enough",
    date: "2026-09-28",
    time: "10:00",
    url: "https://www.ft.com/content/f4e078f7-4aab-43f5-8eb5-2dbd7142a752"
  },
  {
    id: "571a3103-ec01-464b-ab39-0c0da58d9524",
    title: "Air base witness who alerted police only had ‘partial picture’, says Streeting",
    date: "2026-09-28",
    time: "09:42",
    url: "https://www.ft.com/content/571a3103-ec01-464b-ab39-0c0da58d9524"
  },
  {
    id: "6ad5a550-adb6-4c56-85ec-2f2bacff059b",
    title: "A faintly hopeful mood at Labour conference",
    date: "2026-09-28",
    time: "09:30",
    url: "https://www.ft.com/content/6ad5a550-adb6-4c56-85ec-2f2bacff059b"
  },
  {
    id: "8a45576f-ff89-449c-82e5-6c9976e91537",
    title: "Seoul accuses Ukraine of violating secrecy pact on North Korean soldiers",
    date: "2026-09-28",
    time: "09:18",
    url: "https://www.ft.com/content/8a45576f-ff89-449c-82e5-6c9976e91537"
  },
  {
    id: "964a6d85-a6d9-4017-90ef-30ffcd8d7f8d",
    title: "Shares in UK housebuilders surge on new Help to Buy scheme",
    date: "2026-09-28",
    time: "08:11",
    url: "https://www.ft.com/content/964a6d85-a6d9-4017-90ef-30ffcd8d7f8d"
  },
  {
    id: "bce81a18-05cf-43a6-9c86-b3238b732230",
    title: "Australia’s biggest gold miner rejects $27bn takeover bid",
    date: "2026-09-28",
    time: "07:53",
    url: "https://www.ft.com/content/bce81a18-05cf-43a6-9c86-b3238b732230"
  },
  {
    id: "8ac777fc-882e-4781-826b-272d72d468a0",
    title: "‘Xi got face’: China relishes equal treatment from Trump",
    date: "2026-09-28",
    time: "06:55",
    url: "https://www.ft.com/content/8ac777fc-882e-4781-826b-272d72d468a0"
  },
  {
    id: "5ae5d8d0-f387-46ac-b07b-45cd5b4b6c70",
    title: "Helen Thompson: “I don’t think we’re ever going back.”",
    date: "2026-09-28",
    time: "06:30",
    url: "https://www.ft.com/content/5ae5d8d0-f387-46ac-b07b-45cd5b4b6c70"
  },
  {
    id: "0903a8bc-69f1-4abd-a18b-94e20f5efa12",
    title: "FTAV’s further reading",
    date: "2026-09-28",
    time: "06:30",
    url: "https://www.ft.com/content/0903a8bc-69f1-4abd-a18b-94e20f5efa12"
  },
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
];
