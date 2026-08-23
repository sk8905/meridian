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
  { id: "dd605c6f-8a6e-4664-970b-f4c07ea7a4d2", title: "US buyers snap up Europe’s asset managers at fastest rate in decades", date: "2026-08-23", time: "05:30", url: "https://www.ft.com/content/dd605c6f-8a6e-4664-970b-f4c07ea7a4d2" },
  { id: "c202d7aa-481a-466b-b34f-2c4451f787a5", title: "Coffee chain Blank Street raises funds from General Atlantic to fuel expansion and ice cream push", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/c202d7aa-481a-466b-b34f-2c4451f787a5" },
  { id: "ef65c99c-b58c-430c-b6be-8036f042cc1e", title: "Why is the far right so obsessed with knights?", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/ef65c99c-b58c-430c-b6be-8036f042cc1e" },
  { id: "6f664a31-ca24-4a16-a6e9-5978fdf2512c", title: "Are America’s vast Gulf bases worth rebuilding?", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/6f664a31-ca24-4a16-a6e9-5978fdf2512c" },
  { id: "be3c0c6c-0a65-4add-b675-7a5876f625be", title: "India’s reliance on Russian oil hits all-time high", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/be3c0c6c-0a65-4add-b675-7a5876f625be" },
  { id: "6fc8d072-5a2c-4431-895a-e3d4eb03329d", title: "Railway enthusiasts split over plan to restore train services in rural areas", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/6fc8d072-5a2c-4431-895a-e3d4eb03329d" },
  { id: "72783ac2-d6d4-4507-b50f-88861506ad76", title: "‘I don’t have any close friends in business’: Euronext CEO on a decade shaping Europe’s markets", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/72783ac2-d6d4-4507-b50f-88861506ad76" },
  { id: "5e8072a7-cb99-47a6-9478-e46e7de3b4a2", title: "Investors try to catch ‘falling knife’ with bets on risky funds during chip rout", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/5e8072a7-cb99-47a6-9478-e46e7de3b4a2" },
  { id: "434ff8df-d436-4001-b781-3cf0c8ad0b64", title: "‘Juggernaut’ BT’s decade-long turnaround hits crunch time", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/434ff8df-d436-4001-b781-3cf0c8ad0b64" },
  { id: "d8279eab-023e-4403-8f0f-b0b64393dcbb", title: "Data centres drive Ireland to reopen nuclear power debate", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/d8279eab-023e-4403-8f0f-b0b64393dcbb" },
  { id: "d770cdbf-46b1-4928-9ec7-e1155db679d2", title: "Israel’s Syria strike may have been bid to provoke Turkey conflict, US envoy says", date: "2026-08-22", time: "19:17", url: "https://www.ft.com/content/d770cdbf-46b1-4928-9ec7-e1155db679d2" },
  { id: "e3b5c236-bd5f-45c2-8ddf-5279a7375d3f", title: "Mark Carney says Canada is now ‘at war’ with US over trade", date: "2026-08-22", time: "18:22", url: "https://www.ft.com/content/e3b5c236-bd5f-45c2-8ddf-5279a7375d3f" },
  { id: "ccd02363-0e4d-4fca-8bd1-46a153d19aee", title: "‘Appeasement is not a strategy’: how media is fighting back against Trump’s legal threats", date: "2026-08-22", time: "14:45", url: "https://www.ft.com/content/ccd02363-0e4d-4fca-8bd1-46a153d19aee" },
  { id: "da43f854-8083-4ec1-86da-76b47c84e64a", title: "Lula turns to Donald Trump as unlikely ally in Brazil's clash with Marco Rubio", date: "2026-08-22", time: "12:00", url: "https://www.ft.com/content/da43f854-8083-4ec1-86da-76b47c84e64a" },
  { id: "b48dd083-0cdb-4f48-8be3-c73c000e3cdf", title: "Chart of the Week: Who owns government bonds?", date: "2026-08-22", time: "10:30", url: "https://www.ft.com/content/b48dd083-0cdb-4f48-8be3-c73c000e3cdf" },
  { id: "a7837e1c-6865-42bd-9902-3d4c4b7f37ef", title: "Russian ‘double-tap’ attack on Ukrainian shopping mall kills at least 16", date: "2026-08-22", time: "09:44", url: "https://www.ft.com/content/a7837e1c-6865-42bd-9902-3d4c4b7f37ef" },
  { id: "ad87fbc6-831a-4a8e-84d8-bd62cf373ac0", title: "Is sport safe from AI?", date: "2026-08-22", time: "09:00", url: "https://www.ft.com/content/ad87fbc6-831a-4a8e-84d8-bd62cf373ac0" },
  { id: "24f9c08e-e23f-434e-b0f4-fc1eb55a7b04", title: "Canada vows to match US tariffs as trade talks collapse", date: "2026-08-22", time: "05:51", url: "https://www.ft.com/content/24f9c08e-e23f-434e-b0f4-fc1eb55a7b04" },
  { id: "b9e7a620-1018-4004-a3b0-3c85d494d21d", title: "Bossing the bond market around never works", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/b9e7a620-1018-4004-a3b0-3c85d494d21d" },
  { id: "2099aab6-2492-4b86-b028-38e103d9104d", title: "The man selling the Lakers: Mark Walter’s unravelling empire", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/2099aab6-2492-4b86-b028-38e103d9104d" },
  { id: "6cb399fa-9fba-4806-98a3-9572fe319622", title: "The Trump economy: $40tn debt, 6.7% mortgages and $5 diesel", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/6cb399fa-9fba-4806-98a3-9572fe319622" },
  { id: "48ec5bfd-c0ca-4cf8-8b97-3d73225b8258", title: "Big running shoe brands are regaining their lead", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/48ec5bfd-c0ca-4cf8-8b97-3d73225b8258" },
  { id: "ff65daca-59bb-48f2-a6d1-e177a6409459", title: "Europe’s fatal beauty", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/ff65daca-59bb-48f2-a6d1-e177a6409459" },
  { id: "73755e41-8a6d-4fb4-9f4e-5d768450fc54", title: "Klarna’s stock crash shows the price of being a small fish in a big pond", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/73755e41-8a6d-4fb4-9f4e-5d768450fc54" },
  { id: "acfe49a7-3b6d-4930-a37a-5f1b91ed6dc8", title: "Burnham must reveal his hand on immigration", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/acfe49a7-3b6d-4930-a37a-5f1b91ed6dc8" },
  { id: "ecf78c16-4b85-4cfe-9b34-dc9cf9f699bc", title: "Edinburgh festivals demand more money from Scotland’s first tourist tax", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/ecf78c16-4b85-4cfe-9b34-dc9cf9f699bc" },
  { id: "cb586cff-57dd-4ec3-bd93-2b93b11e4789", title: "The financial question most couples cannot answer", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/cb586cff-57dd-4ec3-bd93-2b93b11e4789" },
  { id: "7c9cd212-58c6-44e1-b515-022271e4390d", title: "Who counts in Trump’s America?", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/7c9cd212-58c6-44e1-b515-022271e4390d" },
  { id: "efe10069-cbe3-4071-a091-26afa74fb4b3", title: "Qatar cuts state spending at home and abroad as war shrinks economy", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/efe10069-cbe3-4071-a091-26afa74fb4b3" },
  { id: "c6220205-ee40-4b71-95c0-d53399a17cd1", title: "EU slips further behind US in race for critical minerals", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/c6220205-ee40-4b71-95c0-d53399a17cd1" },
  { id: "9399b276-d8b7-401f-a615-d46a32235b3e", title: "The fight to save England’s rivers", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/9399b276-d8b7-401f-a615-d46a32235b3e" },
  { id: "4709af27-5da9-4b12-bacc-32cc1a65a602", title: "From Dagenham Motors to Monzo: the changing face of football shirt sponsorship", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/4709af27-5da9-4b12-bacc-32cc1a65a602" },
  { id: "bacf81cc-3340-417b-bb6d-c1dc89fb3a34", title: "The age of the populist financial scam", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/bacf81cc-3340-417b-bb6d-c1dc89fb3a34" },
  { id: "00342102-98ee-47a7-b2cf-7878b9131afd", title: "How Germany’s doctors, lawyers and dentists got burnt by private markets bets", date: "2026-08-22", time: "05:00", url: "https://www.ft.com/content/00342102-98ee-47a7-b2cf-7878b9131afd" },
  { id: "ff536e6e-dc56-45e3-b5e0-2dfb28148cb6", title: "Ukraine seeks Elon Musk’s help to hit Russian missile launchers", date: "2026-08-21", time: "19:57", url: "https://www.ft.com/content/ff536e6e-dc56-45e3-b5e0-2dfb28148cb6" },
  { id: "9a094571-604d-4f1e-b5ff-c0b5dc032dc1", title: "Iran’s president calls to end war with US from ‘position of strength’", date: "2026-08-21", time: "19:51", url: "https://www.ft.com/content/9a094571-604d-4f1e-b5ff-c0b5dc032dc1" },
  { id: "ead7f466-1d6e-42e3-bedf-0ce5135372c9", title: "Directors’ Deals: Pearson executive cashes in as digital growth boosts shares", date: "2026-08-21", time: "18:00", url: "https://www.ft.com/content/ead7f466-1d6e-42e3-bedf-0ce5135372c9" },
  { id: "fc1fc5b9-e73e-4e24-9495-4f9b16853be5", title: "Stockpickers: Costain, Oxford Nanopore Technologies, BHP", date: "2026-08-21", time: "18:00", url: "https://www.ft.com/content/fc1fc5b9-e73e-4e24-9495-4f9b16853be5" },
  { id: "ef7a32c6-c999-407a-9970-979bf1f3b103", title: "Italy’s MPS thinks three takeovers are better than one", date: "2026-08-21", time: "17:24", url: "https://www.ft.com/content/ef7a32c6-c999-407a-9970-979bf1f3b103" },
  { id: "7aabb591-ca73-4d87-96ad-dac9a210e1d0", title: "Donald Trump claims deal to cut beef import tariffs in push to curb high prices", date: "2026-08-21", time: "17:18", url: "https://www.ft.com/content/7aabb591-ca73-4d87-96ad-dac9a210e1d0" },
  { id: "7b162fb4-8889-4f9c-9d5b-878850d6e8af", title: "Jim O’Neill declines job in Andy Burnham’s government", date: "2026-08-21", time: "17:05", url: "https://www.ft.com/content/7b162fb4-8889-4f9c-9d5b-878850d6e8af" },
];
