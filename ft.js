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
    id: "281a2cd1-2094-4f33-af04-387b75fe9db1",
    title: "Can Warsh tighten financial conditions without engineering a stock market fall?",
    date: "2026-09-23",
    time: "18:03",
    url: "https://www.ft.com/content/281a2cd1-2094-4f33-af04-387b75fe9db1"
  },
  {
    id: "2848247e-0def-4f8d-ac8b-c4b71e52340f",
    title: "Britain’s union reforms are a risk to business dynamism",
    date: "2026-09-23",
    time: "18:00",
    url: "https://www.ft.com/content/2848247e-0def-4f8d-ac8b-c4b71e52340f"
  },
  {
    id: "db8d6db8-4aae-4afc-9ec7-7244c07b7ff7",
    title: "Fixing Britain’s paralysed state means hard choices",
    date: "2026-09-23",
    time: "16:50",
    url: "https://www.ft.com/content/db8d6db8-4aae-4afc-9ec7-7244c07b7ff7"
  },
  {
    id: "8dfae006-c1ac-4713-8497-0e0e59e419f6",
    title: "Trump lays a new trap for Takaichi",
    date: "2026-09-23",
    time: "16:39",
    url: "https://www.ft.com/content/8dfae006-c1ac-4713-8497-0e0e59e419f6"
  },
  {
    id: "3e480031-4ee7-4ded-9893-75c060aeef1a",
    title: "Trump’s diesel ban would hurt America and help China",
    date: "2026-09-23",
    time: "16:37",
    url: "https://www.ft.com/content/3e480031-4ee7-4ded-9893-75c060aeef1a"
  },
  {
    id: "5b11b598-7c77-4bdf-82bf-a763adf71a72",
    title: "US Treasury yields soar after strong data fuels bets on further rate rises",
    date: "2026-09-23",
    time: "16:33",
    url: "https://www.ft.com/content/5b11b598-7c77-4bdf-82bf-a763adf71a72"
  },
  {
    id: "c5215e50-446c-45e5-a2ec-36e3e30d0310",
    title: "Italy clears path for nuclear power revival",
    date: "2026-09-23",
    time: "16:17",
    url: "https://www.ft.com/content/c5215e50-446c-45e5-a2ec-36e3e30d0310"
  },
  {
    id: "a241848e-f78c-4435-abfd-3980160345c2",
    title: "UK reviews Chagos deal after fresh opposition from Trump",
    date: "2026-09-23",
    time: "15:46",
    url: "https://www.ft.com/content/a241848e-f78c-4435-abfd-3980160345c2"
  },
  {
    id: "65d0e5d1-c4cc-4849-ad50-b260ccfde7b9",
    title: "Turkey arrests founder of brokerage at centre of $18bn alleged Ponzi scheme",
    date: "2026-09-23",
    time: "15:21",
    url: "https://www.ft.com/content/65d0e5d1-c4cc-4849-ad50-b260ccfde7b9"
  },
  {
    id: "a8614065-b38b-426d-b176-192c6cd75f56",
    title: "European diesel prices climb over prospect of US export ban",
    date: "2026-09-23",
    time: "14:55",
    url: "https://www.ft.com/content/a8614065-b38b-426d-b176-192c6cd75f56"
  },
  {
    id: "d13b1982-450f-45d2-b79b-431f30b048b2",
    title: "The argument for Kalshi taking bets on its own legality",
    date: "2026-09-23",
    time: "14:15",
    url: "https://www.ft.com/content/d13b1982-450f-45d2-b79b-431f30b048b2"
  },
  {
    id: "31a27312-8032-4957-be69-ba32561e8db3",
    title: "UN General Assembly live: Iran’s president to address leaders after Trump threatens ‘annihilation’",
    date: "2026-09-23",
    time: "14:13",
    url: "https://www.ft.com/content/31a27312-8032-4957-be69-ba32561e8db3"
  },
  {
    id: "de215c81-a480-4944-aba7-9dcd3fc90dcb",
    title: "Green Party activists urged to skip conference to campaign for Polanski",
    date: "2026-09-23",
    time: "13:26",
    url: "https://www.ft.com/content/de215c81-a480-4944-aba7-9dcd3fc90dcb"
  },
  {
    id: "7a98e756-92a3-45e4-9630-187d20685e79",
    title: "Countries cancel Iran flights after US threatens to 'shut down' airlines",
    date: "2026-09-23",
    time: "13:08",
    url: "https://www.ft.com/content/7a98e756-92a3-45e4-9630-187d20685e79"
  },
  {
    id: "1d7daa8f-e8bb-436c-ad8b-b6d097e4107f",
    title: "McDonald's bets on chicken to win back diners as beef prices soar",
    date: "2026-09-23",
    time: "13:00",
    url: "https://www.ft.com/content/1d7daa8f-e8bb-436c-ad8b-b6d097e4107f"
  },
  {
    id: "e90bbf67-7c4e-4c0e-a15d-07462f3e3b1a",
    title: "Blow for drought-hit England as opening of new reservoir delayed by 5 years",
    date: "2026-09-23",
    time: "12:46",
    url: "https://www.ft.com/content/e90bbf67-7c4e-4c0e-a15d-07462f3e3b1a"
  },
  {
    id: "e569a9de-cade-4dcd-9571-ff7ad0f453e4",
    title: "Germany urges US to allow Patriot missile production in Europe",
    date: "2026-09-23",
    time: "12:13",
    url: "https://www.ft.com/content/e569a9de-cade-4dcd-9571-ff7ad0f453e4"
  },
  {
    id: "850dde98-834f-4cfe-9ffc-3e41980a4e9d",
    title: "UK on course to miss climate targets, energy secretary admits",
    date: "2026-09-23",
    time: "12:01",
    url: "https://www.ft.com/content/850dde98-834f-4cfe-9ffc-3e41980a4e9d"
  },
  {
    id: "7854c3ba-57f8-4a50-8591-00ffceda8157",
    title: "Should we rent or sell a property that we've inherited?",
    date: "2026-09-23",
    time: "11:42",
    url: "https://www.ft.com/content/7854c3ba-57f8-4a50-8591-00ffceda8157"
  },
  {
    id: "67f10dca-63f3-4cf8-951b-22d0c87f6be2",
    title: "The west does not have a leadership problem",
    date: "2026-09-23",
    time: "11:33",
    url: "https://www.ft.com/content/67f10dca-63f3-4cf8-951b-22d0c87f6be2"
  },
  {
    id: "2f652ff5-b707-4d96-abb4-31b90a77908c",
    title: "L&G to cut a tenth of its workforce",
    date: "2026-09-23",
    time: "11:33",
    url: "https://www.ft.com/content/2f652ff5-b707-4d96-abb4-31b90a77908c"
  },
  {
    id: "be88d1eb-8de1-4261-ad52-9be25924a5ed",
    title: "Lidl owner among suitors circling Tesco's European business",
    date: "2026-09-23",
    time: "11:13",
    url: "https://www.ft.com/content/be88d1eb-8de1-4261-ad52-9be25924a5ed"
  },
  {
    id: "0da4ac2d-6d23-4cda-b9df-f73e16b609d9",
    title: "The model making vegan shoes sexy",
    date: "2026-09-23",
    time: "11:00",
    url: "https://www.ft.com/content/0da4ac2d-6d23-4cda-b9df-f73e16b609d9"
  },
  {
    id: "7c1a2718-b0a4-4dda-8c3a-c36ff6792e2b",
    title: "Why Germany’s ‘chancellor-in-waiting’ bides his time",
    date: "2026-09-23",
    time: "11:00",
    url: "https://www.ft.com/content/7c1a2718-b0a4-4dda-8c3a-c36ff6792e2b"
  },
  {
    id: "b05367af-5236-4aca-99e7-ec1e8968f08a",
    title: "Azerbaijan pardons French national as part of secret prisoner release deal",
    date: "2026-09-23",
    time: "10:40",
    url: "https://www.ft.com/content/b05367af-5236-4aca-99e7-ec1e8968f08a"
  },
  {
    id: "7d0f525e-f99d-4175-b37c-78d4dd4adf2b",
    title: "Enter slopfiling",
    date: "2026-09-23",
    time: "10:30",
    url: "https://www.ft.com/content/7d0f525e-f99d-4175-b37c-78d4dd4adf2b"
  },
  {
    id: "9fbc4577-068b-45ad-b7fe-f524b9731d4e",
    title: "Pornhub's age checks probed by UK watchdog",
    date: "2026-09-23",
    time: "09:57",
    url: "https://www.ft.com/content/9fbc4577-068b-45ad-b7fe-f524b9731d4e"
  },
  {
    id: "7d59acf7-7bac-42e0-a5b2-196391d0480d",
    title: "The Liberal Democrats' unserious tax cut pledge",
    date: "2026-09-23",
    time: "09:30",
    url: "https://www.ft.com/content/7d59acf7-7bac-42e0-a5b2-196391d0480d"
  },
  {
    id: "9bc23f86-f977-408e-b32f-2917fd4a2267",
    title: "Swiss lawmakers vote to back tighter UBS capital rules",
    date: "2026-09-23",
    time: "09:22",
    url: "https://www.ft.com/content/9bc23f86-f977-408e-b32f-2917fd4a2267"
  },
  {
    id: "8cefcdba-2d5b-421b-969e-1a302b660fe5",
    title: "Bank of England can avoid raising interest rates, says OECD",
    date: "2026-09-23",
    time: "09:00",
    url: "https://www.ft.com/content/8cefcdba-2d5b-421b-969e-1a302b660fe5"
  },
  {
    id: "6c13ada9-f325-428b-b91e-bffcf92eddad",
    title: "OECD sounds alarm on surging government bond yields",
    date: "2026-09-23",
    time: "09:00",
    url: "https://www.ft.com/content/6c13ada9-f325-428b-b91e-bffcf92eddad"
  },
  {
    id: "344e7af4-42ce-4cf0-b608-aa25eaa1e7ee",
    title: "FTAV's further reading",
    date: "2026-09-23",
    time: "08:18",
    url: "https://www.ft.com/content/344e7af4-42ce-4cf0-b608-aa25eaa1e7ee"
  },
  {
    id: "be468cf8-e450-46d8-891f-67bc79ffd7b3",
    title: "Royal Caribbean buys 50% stake in Sandals valuing resorts at $6bn",
    date: "2026-09-23",
    time: "08:17",
    url: "https://www.ft.com/content/be468cf8-e450-46d8-891f-67bc79ffd7b3"
  },
  {
    id: "62a6939f-7e24-492e-bdf6-b9ab9e1d3578",
    title: "Airtel Money launches one of London’s biggest IPOs in recent years",
    date: "2026-09-23",
    time: "07:56",
    url: "https://www.ft.com/content/62a6939f-7e24-492e-bdf6-b9ab9e1d3578"
  },
  {
    id: "a0c1434a-4f27-445b-ac37-23181424cd33",
    title: "Confessions of an accidental bonus basher",
    date: "2026-09-23",
    time: "07:00",
    url: "https://www.ft.com/content/a0c1434a-4f27-445b-ac37-23181424cd33"
  },
  {
    id: "04c5abf0-d7c4-47ca-9391-4a154c14e178",
    title: "Private credit's \"soft\" defaults",
    date: "2026-09-23",
    time: "06:30",
    url: "https://www.ft.com/content/04c5abf0-d7c4-47ca-9391-4a154c14e178"
  },
  {
    id: "61f49a3d-ffac-4f09-b946-bfc1f9194e89",
    title: "Meloni at spending crossroads after failing to get off EU's fiscal naughty step",
    date: "2026-09-23",
    time: "06:00",
    url: "https://www.ft.com/content/61f49a3d-ffac-4f09-b946-bfc1f9194e89"
  },
  {
    id: "0a5a5b70-adea-40af-9933-1f7679f9f359",
    title: "Oil price on track for longest losing streak in more than 12 months",
    date: "2026-09-23",
    time: "05:42",
    url: "https://www.ft.com/content/0a5a5b70-adea-40af-9933-1f7679f9f359"
  },
  {
    id: "d85c9ab3-9b77-4b96-9321-c548bbbfd07a",
    title: "FirstFT: Boehly gets US and Gulf backing for Lukoil assets bid",
    date: "2026-09-23",
    time: "05:31",
    url: "https://www.ft.com/content/d85c9ab3-9b77-4b96-9321-c548bbbfd07a"
  },
  {
    id: "c557b92a-48bc-4d82-8fdb-f45cdc96ed77",
    title: "A more hawkish ECB will respond to prolonged high energy prices",
    date: "2026-09-23",
    time: "05:30",
    url: "https://www.ft.com/content/c557b92a-48bc-4d82-8fdb-f45cdc96ed77"
  },
  {
    id: "7a977d6f-fdbc-425a-8881-7c43716c77f5",
    title: "South Korea bets on Texas gas plant to satisfy Donald Trump",
    date: "2026-09-23",
    time: "05:28",
    url: "https://www.ft.com/content/7a977d6f-fdbc-425a-8881-7c43716c77f5"
  }
];
