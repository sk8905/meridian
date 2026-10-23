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
    "id": "f75c25c2-4164-4dfc-9d56-fc6a86704c47",
    "title": "KKR founders back Valencia in deal valuing football club at €1.25bn",
    "date": "2026-10-23",
    "time": "13:02",
    "url": "https://www.ft.com/content/f75c25c2-4164-4dfc-9d56-fc6a86704c47"
  },
  {
    "id": "0db7d1cd-be3b-4034-b813-51fc8be88f11",
    "title": "EU capitals moderate plans to help companies operate bloc-wide",
    "date": "2026-10-23",
    "time": "12:55",
    "url": "https://www.ft.com/content/0db7d1cd-be3b-4034-b813-51fc8be88f11"
  },
  {
    "id": "9743b853-1a19-4693-a353-78e014cf1833",
    "title": "Author Hanif Kureishi: ‘The urge to write came back strongly’",
    "date": "2026-10-23",
    "time": "12:30",
    "url": "https://www.ft.com/content/9743b853-1a19-4693-a353-78e014cf1833"
  },
  {
    "id": "4e3f67c8-70d0-44aa-950e-62190717c2db",
    "title": "London Underground blames rising delays on repair backlog",
    "date": "2026-10-23",
    "time": "12:30",
    "url": "https://www.ft.com/content/4e3f67c8-70d0-44aa-950e-62190717c2db"
  },
  {
    "id": "8f0b71c3-b097-4126-b0ff-ad7b66676107",
    "title": "100 days of Burnham",
    "date": "2026-10-23",
    "time": "12:09",
    "url": "https://www.ft.com/content/8f0b71c3-b097-4126-b0ff-ad7b66676107"
  },
  {
    "id": "2fae96bf-4328-4aa6-b68f-af416a9cb4bf",
    "title": "National Crime Agency wins freezing order over £15mn London flat",
    "date": "2026-10-23",
    "time": "12:08",
    "url": "https://www.ft.com/content/2fae96bf-4328-4aa6-b68f-af416a9cb4bf"
  },
  {
    "id": "e67a3d0e-5893-45a5-b098-64a68a4ef032",
    "title": "Ukraine says Starlink speeds still throttled",
    "date": "2026-10-23",
    "time": "12:05",
    "url": "https://www.ft.com/content/e67a3d0e-5893-45a5-b098-64a68a4ef032"
  },
  {
    "id": "06209f51-de7c-4de0-8e66-5c621a960b87",
    "title": "What the coming copper crunch means for the global economy",
    "date": "2026-10-23",
    "time": "12:01",
    "url": "https://www.ft.com/content/06209f51-de7c-4de0-8e66-5c621a960b87"
  },
  {
    "id": "bb1f2a5e-6a87-404a-a89e-4e0c88113827",
    "title": "Confessions of a middle-class prepper",
    "date": "2026-10-23",
    "time": "12:00",
    "url": "https://www.ft.com/content/bb1f2a5e-6a87-404a-a89e-4e0c88113827"
  },
  {
    "id": "df94aaca-71f2-4788-9835-898b1cc79a05",
    "title": "Austria expels Russian diplomats suspected of espionage",
    "date": "2026-10-23",
    "time": "11:53",
    "url": "https://www.ft.com/content/df94aaca-71f2-4788-9835-898b1cc79a05"
  },
  {
    "id": "4fa0c5ef-abfe-4a63-95c0-2ba69329abd0",
    "title": "Citi wins long-awaited approval for China securities business",
    "date": "2026-10-23",
    "time": "11:40",
    "url": "https://www.ft.com/content/4fa0c5ef-abfe-4a63-95c0-2ba69329abd0"
  },
  {
    "id": "ebd9b327-a689-4872-b9d8-b8b494427a01",
    "title": "20 à la mod buys",
    "date": "2026-10-23",
    "time": "11:00",
    "url": "https://www.ft.com/content/ebd9b327-a689-4872-b9d8-b8b494427a01"
  },
  {
    "id": "3eab64ae-1a0b-4ac8-8341-847c1b6bf2d8",
    "title": "How smart does my fridge need to be?",
    "date": "2026-10-23",
    "time": "11:00",
    "url": "https://www.ft.com/content/3eab64ae-1a0b-4ac8-8341-847c1b6bf2d8"
  },
  {
    "id": "bcc464cc-9d12-4b15-866d-64642de66ca8",
    "title": "US nuclear revival faces scrutiny after incidents at flagship plant",
    "date": "2026-10-23",
    "time": "11:00",
    "url": "https://www.ft.com/content/bcc464cc-9d12-4b15-866d-64642de66ca8"
  },
  {
    "id": "df70bf20-e809-48d0-8485-f8f514a7fbc4",
    "title": "Anthropic strikes deal to launch European consultancy",
    "date": "2026-10-23",
    "time": "10:04",
    "url": "https://www.ft.com/content/df70bf20-e809-48d0-8485-f8f514a7fbc4"
  },
  {
    "id": "34946f6f-ccd9-4de5-9f57-136e1a0e2064",
    "title": "Why the UK should greenlight both Jackdaw and Rosebank",
    "date": "2026-10-23",
    "time": "10:00",
    "url": "https://www.ft.com/content/34946f6f-ccd9-4de5-9f57-136e1a0e2064"
  },
  {
    "id": "f968f40c-ecc8-4981-ba60-a826f808505b",
    "title": "September inflation keeps BoJ on tightening course",
    "date": "2026-10-23",
    "time": "09:48",
    "url": "https://www.ft.com/content/f968f40c-ecc8-4981-ba60-a826f808505b"
  },
  {
    "id": "ddd17044-0b38-446b-a973-d0ab80d5738c",
    "title": "FTAV’s further reading",
    "date": "2026-10-23",
    "time": "08:17",
    "url": "https://www.ft.com/content/ddd17044-0b38-446b-a973-d0ab80d5738c"
  },
  {
    "id": "74bb3555-6f29-4ff9-bcaf-6cd20a9a3b1b",
    "title": "‘Relentless’ cost of living pressures behind collapse in UK consumer confidence",
    "date": "2026-10-23",
    "time": "08:08",
    "url": "https://www.ft.com/content/74bb3555-6f29-4ff9-bcaf-6cd20a9a3b1b"
  },
  {
    "id": "ce0e9d68-c63f-4666-9909-512b929e6284",
    "title": "Winter arrives in markets",
    "date": "2026-10-23",
    "time": "06:30",
    "url": "https://www.ft.com/content/ce0e9d68-c63f-4666-9909-512b929e6284"
  },
  {
    "id": "575c54b3-b194-4338-930b-3f446da5044f",
    "title": "Serbia’s Vučić faces tough election as fraud fears mount",
    "date": "2026-10-23",
    "time": "06:00",
    "url": "https://www.ft.com/content/575c54b3-b194-4338-930b-3f446da5044f"
  },
  {
    "id": "9193784c-9b3b-4626-bd69-15806b0221ed",
    "title": "Healey to promise end of ‘pointless paperwork’ for small UK companies",
    "date": "2026-10-23",
    "time": "06:00",
    "url": "https://www.ft.com/content/9193784c-9b3b-4626-bd69-15806b0221ed"
  },
  {
    "id": "9aa4549e-26f4-4963-94eb-50cf0fc0b8f9",
    "title": "How nervous are bond markets about France?",
    "date": "2026-10-23",
    "time": "06:00",
    "url": "https://www.ft.com/content/9aa4549e-26f4-4963-94eb-50cf0fc0b8f9"
  },
  {
    "id": "8948193b-438b-4d71-a0b1-31dff56fc308",
    "title": "Global tech sell-off sparks flight to safety",
    "date": "2026-10-23",
    "time": "05:42",
    "url": "https://www.ft.com/content/8948193b-438b-4d71-a0b1-31dff56fc308"
  },
  {
    "id": "5587abab-d5c8-480d-923d-b7b68afcb3f0",
    "title": "FirstFT: OpenAI trims valuation target to $1.25tn",
    "date": "2026-10-23",
    "time": "05:30",
    "url": "https://www.ft.com/content/5587abab-d5c8-480d-923d-b7b68afcb3f0"
  },
  {
    "id": "cea71497-6fdb-4e97-8661-6336bd77b347",
    "title": "Investing in Argentina",
    "date": "2026-10-23",
    "time": "05:03",
    "url": "https://www.ft.com/content/cea71497-6fdb-4e97-8661-6336bd77b347"
  },
  {
    "id": "51df7b68-927a-49a5-b596-3b867695b102",
    "title": "The dispute that blew up a $34bn deal",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/51df7b68-927a-49a5-b596-3b867695b102"
  },
  {
    "id": "ab922590-7f73-4a84-a3bd-a42cf80c92f7",
    "title": "Ukraine seeks to move customs checks inside EU to avoid Russian drones",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/ab922590-7f73-4a84-a3bd-a42cf80c92f7"
  },
  {
    "id": "70379a26-c20e-4501-aec9-a9a0089cdd3d",
    "title": "US is prepared for long stand-off with Iran, says Trump envoy",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/70379a26-c20e-4501-aec9-a9a0089cdd3d"
  },
  {
    "id": "00471cd9-c579-4205-a573-b38a0237ddb8",
    "title": "Summer heatwave linked to 50,000 deaths in Europe",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/00471cd9-c579-4205-a573-b38a0237ddb8"
  },
  {
    "id": "e114059c-308d-4d8e-8127-f88b0faca879",
    "title": "How a transatlantic mega-merger fell apart over a leadership tug of war",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/e114059c-308d-4d8e-8127-f88b0faca879"
  },
  {
    "id": "6b7b5f61-3550-46ac-a032-4163164c0af0",
    "title": "Credit insurers cut cover on struggling UK housebuilder Crest Nicholson",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/6b7b5f61-3550-46ac-a032-4163164c0af0"
  },
  {
    "id": "b0d490eb-d136-4114-87d4-d7b013d9cb11",
    "title": "Rolls-Royce nears taxpayer subsidy deal to develop new engine in UK",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/b0d490eb-d136-4114-87d4-d7b013d9cb11"
  },
  {
    "id": "d66ab794-72e9-447b-b6f4-a633dd9fda91",
    "title": "Should UK banks be taxed more?",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/d66ab794-72e9-447b-b6f4-a633dd9fda91"
  },
  {
    "id": "bf959a1a-1cd8-41e2-8767-03aa1ac3ed48",
    "title": "Beware Bessent’s tilt towards short-term debt",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/bf959a1a-1cd8-41e2-8767-03aa1ac3ed48"
  },
  {
    "id": "ee40daa9-48a7-4157-b6a1-d2ea3c90dbd0",
    "title": "Government accused of ‘fudging’ consultancy spending to meet pledge",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/ee40daa9-48a7-4157-b6a1-d2ea3c90dbd0"
  },
  {
    "id": "57e5b584-78b8-49a5-be2b-c02bba63886a",
    "title": "Europe’s largest landlord exposed to €8bn hit from Berlin apartment plans",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/57e5b584-78b8-49a5-be2b-c02bba63886a"
  },
  {
    "id": "7f8e36d6-b044-4610-bdd5-db56c77a0c4f",
    "title": "Interior designer Beata Heuman talks taste",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/7f8e36d6-b044-4610-bdd5-db56c77a0c4f"
  },
  {
    "id": "26f97311-f72c-40a8-bc89-c46740f9cdc0",
    "title": "Students seek to oust Serbia’s strongman in Sunday vote",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/26f97311-f72c-40a8-bc89-c46740f9cdc0"
  },
  {
    "id": "e842173f-6f9f-4115-9e5f-a0f06f0df18d",
    "title": "US pension giant Calpers retreats from Big Tech as AI rally falters",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/e842173f-6f9f-4115-9e5f-a0f06f0df18d"
  },
  {
    "id": "f98be079-49af-45c8-9954-ea3bd774c585",
    "title": "AI oversight needs a different model to banking",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/f98be079-49af-45c8-9954-ea3bd774c585"
  },
  {
    "id": "0ce7d049-b264-47da-9aaa-08b33941585a",
    "title": "Caught between the US and China",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/0ce7d049-b264-47da-9aaa-08b33941585a"
  },
  {
    "id": "90bd7c83-f219-4d2c-be27-c31f77daa662",
    "title": "A cure for ‘plant blindness’? Try London’s Royal Parks",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/90bd7c83-f219-4d2c-be27-c31f77daa662"
  },
  {
    "id": "f1e6e30a-7f2b-49c9-bc8d-ef3821c9695a",
    "title": "Argentina in global trading sweet spot",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/f1e6e30a-7f2b-49c9-bc8d-ef3821c9695a"
  },
  {
    "id": "ecfefa34-a0c3-43c5-b892-21c715a355a4",
    "title": "Could Peronism return as Milei’s popularity falters?",
    "date": "2026-10-23",
    "time": "05:00",
    "url": "https://www.ft.com/content/ecfefa34-a0c3-43c5-b892-21c715a355a4"
  },
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
  }
];
