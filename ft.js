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
  { id: "4d9d5f1a-df3e-490e-9567-f7f7f968f3a4", title: "Ukrainian drones hit Wildberries warehouses in overnight strikes", date: "2026-08-04", time: "09:57", url: "https://www.ft.com/content/4d9d5f1a-df3e-490e-9567-f7f7f968f3a4" },
  { id: "96f5e56c-a8bf-44ca-8750-0448b19e0903", title: "Andy Burnham bars serious sex offenders from early prison release scheme", date: "2026-08-04", time: "09:36", url: "https://www.ft.com/content/96f5e56c-a8bf-44ca-8750-0448b19e0903" },
  { id: "1d8ac0ff-8ff0-44fd-bd92-5fd18983f31e", title: "Segro recommends £14bn takeover bid from US bidder", date: "2026-08-04", time: "08:03", url: "https://www.ft.com/content/1d8ac0ff-8ff0-44fd-bd92-5fd18983f31e" },
  { id: "fa298199-b824-4ca9-a3a0-440eb320ac61", title: "BP to sell US biogas business as profits soar", date: "2026-08-04", time: "07:23", url: "https://www.ft.com/content/fa298199-b824-4ca9-a3a0-440eb320ac61" },
  { id: "8a703d1e-99d4-4a04-a08a-761489d33da3", title: "Toyota plans $6.3bn buyback as weak yen boosts outlook", date: "2026-08-04", time: "07:17", url: "https://www.ft.com/content/8a703d1e-99d4-4a04-a08a-761489d33da3" },
  { id: "41ecd9e9-26d3-49a4-8c88-39a187ea697d", title: "FTAV’s further reading", date: "2026-08-04", time: "07:09", url: "https://www.ft.com/content/41ecd9e9-26d3-49a4-8c88-39a187ea697d" },
  { id: "04b34467-dab0-4646-97dc-8c3d3e44e5e2", title: "Yen intervention = US self-preservation", date: "2026-08-04", time: "06:30", url: "https://www.ft.com/content/04b34467-dab0-4646-97dc-8c3d3e44e5e2" },
  { id: "bbcf5c49-0ca3-4af4-a408-e0a723227042", title: "FirstFT: Russia expands shadow LNG fleet", date: "2026-08-04", time: "05:32", url: "https://www.ft.com/content/bbcf5c49-0ca3-4af4-a408-e0a723227042" },
  { id: "0da95788-cde6-4e1a-af89-1faced91178e", title: "HSBC quarterly profit soars to $10.1bn", date: "2026-08-04", time: "05:11", url: "https://www.ft.com/content/0da95788-cde6-4e1a-af89-1faced91178e" },
  { id: "b2440aa5-be3e-40ae-ad2d-ad5893de79d3", title: "The king who outfoxed Pedro Sánchez", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/b2440aa5-be3e-40ae-ad2d-ad5893de79d3" },
  { id: "450555e6-f4b6-4c4d-b9fa-c4f48c833c57", title: "The $400bn megadeal brewing in big pharma", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/450555e6-f4b6-4c4d-b9fa-c4f48c833c57" },
  { id: "90a0828c-1074-4609-b378-bfd410b7ec19", title: "Spanish stocks offer a sunny escape for tech-weary investors", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/90a0828c-1074-4609-b378-bfd410b7ec19" },
  { id: "7dd21b1e-3b3d-48a6-a3fe-6a0e4a14944b", title: "Revolut chief Nik Storonsky sued by broker over €350mn superyacht", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/7dd21b1e-3b3d-48a6-a3fe-6a0e4a14944b" },
  { id: "76d27b15-f73c-4408-9455-a85831eb2fec", title: "Infantino is not the problem", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/76d27b15-f73c-4408-9455-a85831eb2fec" },
  { id: "d640ec5d-16c9-44e2-875e-30db7714ada9", title: "Italy and Germany’s censure of Spain’s migrant amnesty is ‘hypocritical’", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/d640ec5d-16c9-44e2-875e-30db7714ada9" },
  { id: "549f2e23-5aa2-49c7-9ea6-a9784ab7087c", title: "Inside Google’s $200bn Wall Street finance machine for Anthropic", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/549f2e23-5aa2-49c7-9ea6-a9784ab7087c" },
  { id: "61790126-edc2-432e-b20e-713c845a713b", title: "Tory party rebuilds relations with UK business after rocky two years", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/61790126-edc2-432e-b20e-713c845a713b" },
  { id: "ea8c000e-5a79-4ef1-882e-fbf6678e5eaf", title: "Companies linked to top health official and husband received £2bn in public contracts", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/ea8c000e-5a79-4ef1-882e-fbf6678e5eaf" },
  { id: "98458d3a-8cba-47db-a178-e5319813f4f8", title: "Offshore firm Mourant sells stake in  private equity rush for legal deals", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/98458d3a-8cba-47db-a178-e5319813f4f8" },
  { id: "b3a35855-9430-4761-8a45-114b33e12e4a", title: "‘Cursed island’: the $100bn luxury development hosting tech nomads and scammers", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/b3a35855-9430-4761-8a45-114b33e12e4a" },
  { id: "d44d9139-c6ac-41de-851d-ab30b6085ce2", title: "‘Arrogance kills’: Novo chief injects risk-taking into Ozempic maker", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/d44d9139-c6ac-41de-851d-ab30b6085ce2" },
  { id: "a4c6e5da-dc9f-43b0-a794-c3f6bb9bca7d", title: "The UAE’s imperial push into Africa", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/a4c6e5da-dc9f-43b0-a794-c3f6bb9bca7d" },
  { id: "29f1af13-ecc3-4f26-a479-e6088c67231b", title: "US midterm elections 2026: The FT’s guide", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/29f1af13-ecc3-4f26-a479-e6088c67231b" },
  { id: "cebc2dfc-1b9e-4119-b1e0-b9b514550d23", title: "Russia expands shadow LNG fleet ahead of EU ban", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/cebc2dfc-1b9e-4119-b1e0-b9b514550d23" },
  { id: "6691c87d-707a-4b8e-8c9c-56d0621f83aa", title: "UK wildfires spark calls for guaranteed access to aerial support", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/6691c87d-707a-4b8e-8c9c-56d0621f83aa" },
  { id: "498713a3-dbef-46f7-978e-c2d3b748f0ac", title: "How to end the cycle of mistrust between the Treasury and everybody else", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/498713a3-dbef-46f7-978e-c2d3b748f0ac" },
  { id: "2b3b51c5-57ca-4456-aeb0-057df95c51a3", title: "Inside the Aldeburgh renovation that marries accessibility and aesthetics", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/2b3b51c5-57ca-4456-aeb0-057df95c51a3" },
  { id: "1dc7cd77-5fd6-4b72-a99c-46100904871f", title: "In Hungary, a wetland paradise lost", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/1dc7cd77-5fd6-4b72-a99c-46100904871f" },
  { id: "e279135e-cd6e-46d4-b80b-2e6b0c0901a9", title: "How big was the American JPY intervention?", date: "2026-08-03", time: "18:14", url: "https://www.ft.com/content/e279135e-cd6e-46d4-b80b-2e6b0c0901a9" },
  { id: "c300b4dd-984a-4845-86a1-d1332dafe8bc", title: "Texas law firm agrees $15mn settlement over judicial scandal", date: "2026-08-03", time: "17:34", url: "https://www.ft.com/content/c300b4dd-984a-4845-86a1-d1332dafe8bc" },
  { id: "6282b88a-6f49-40cc-b1d8-5e147e7e37f1", title: "AstraZeneca and Bristol-Myers: when Big Pharma isn't big enough", date: "2026-08-03", time: "17:33", url: "https://www.ft.com/content/6282b88a-6f49-40cc-b1d8-5e147e7e37f1" },
  { id: "6d40c74b-ac40-42f1-9387-957925f48daa", title: "AstraZeneca investors raise concerns over mega-merger talks", date: "2026-08-03", time: "17:24", url: "https://www.ft.com/content/6d40c74b-ac40-42f1-9387-957925f48daa" },
  { id: "016ad17d-0cab-48f1-8d7f-d3eb1634be63", title: "Six teenagers, a brutal murder and the story they couldn't take back", date: "2026-08-03", time: "17:11", url: "https://www.ft.com/content/016ad17d-0cab-48f1-8d7f-d3eb1634be63" },
  { id: "03c413f2-6ad5-45d1-b5ac-fdb6ed8b4cff", title: "UBS fined $125mn over lax money laundering controls", date: "2026-08-03", time: "16:53", url: "https://www.ft.com/content/03c413f2-6ad5-45d1-b5ac-fdb6ed8b4cff" },
  { id: "06f8f1a1-50a1-43d0-a236-c2d65ff38e87", title: "Iranian tanker tolls: totally legit after all?", date: "2026-08-03", time: "15:30", url: "https://www.ft.com/content/06f8f1a1-50a1-43d0-a236-c2d65ff38e87" },
  { id: "2cc9c96a-0e5b-4c33-a95a-3d11072a145c", title: "Apple launches legal challenge to UK attempt to access encrypted user data", date: "2026-08-03", time: "15:11", url: "https://www.ft.com/content/2cc9c96a-0e5b-4c33-a95a-3d11072a145c" },
  { id: "f1d1214e-59e8-4024-92f3-5a0a32dd0bc6", title: "And the FTAV charts quiz winner isn’t…", date: "2026-08-03", time: "15:01", url: "https://www.ft.com/content/f1d1214e-59e8-4024-92f3-5a0a32dd0bc6" },
  { id: "1419a5f5-1bd7-4b89-b667-45c2789769ef", title: "Time for Andy Burnham to smile on UK science", date: "2026-08-03", time: "14:50", url: "https://www.ft.com/content/1419a5f5-1bd7-4b89-b667-45c2789769ef" },
  { id: "eddbdc29-5206-4c79-9ea7-f1a06ff040f1", title: "Struggling to make sense of AstraZeneca-BMS", date: "2026-08-03", time: "14:21", url: "https://www.ft.com/content/eddbdc29-5206-4c79-9ea7-f1a06ff040f1" },
  { id: "0eec21be-80c4-4fca-991a-32fbd58cc653", title: "Can Democrats win over the working class?", date: "2026-08-03", time: "14:00", url: "https://www.ft.com/content/0eec21be-80c4-4fca-991a-32fbd58cc653" },
  { id: "547bc3c3-6778-42d3-9bed-fcc3d0c28068", title: "Why Burnham is wrong about education and opportunity", date: "2026-08-03", time: "14:00", url: "https://www.ft.com/content/547bc3c3-6778-42d3-9bed-fcc3d0c28068" },
];
