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
  { id: "fe0981ed-dcb2-4799-ab87-4d487c0754e6", title: "We need an OBR for infrastructure", date: "2026-07-28", time: "15:59", url: "https://www.ft.com/content/fe0981ed-dcb2-4799-ab87-4d487c0754e6" },
  { id: "024fb6a1-fb39-4b2d-be3e-2393ed62482a", title: "Apple tops $5tn valuation for first time", date: "2026-07-28", time: "15:54", url: "https://www.ft.com/content/024fb6a1-fb39-4b2d-be3e-2393ed62482a" },
  { id: "0f1e293c-f58c-4849-b576-00b9e4a53d97", title: "Billionaire Dodgers-owner's insurer acknowledges loans to linked entities including 'Dodger Tickets'", date: "2026-07-28", time: "15:47", url: "https://www.ft.com/content/0f1e293c-f58c-4849-b576-00b9e4a53d97" },
  { id: "819cc297-4e1e-493b-91b3-e6b12519214b", title: "Fifa plans stake sale in new $20bn commercial vehicle", date: "2026-07-28", time: "15:01", url: "https://www.ft.com/content/819cc297-4e1e-493b-91b3-e6b12519214b" },
  { id: "d5b45659-ecd5-4bb5-93d0-56b99c798b9d", title: "Maybe the chips are down because memory’s too expensive", date: "2026-07-28", time: "14:43", url: "https://www.ft.com/content/d5b45659-ecd5-4bb5-93d0-56b99c798b9d" },
  { id: "ba86f426-0386-4afb-acb8-cdd56371a5a8", title: "Trump sets stage for Netanyahu meeting amid tensions with Israeli PM", date: "2026-07-28", time: "14:15", url: "https://www.ft.com/content/ba86f426-0386-4afb-acb8-cdd56371a5a8" },
  { id: "e8a4b77a-f420-409a-938f-17521c5ba7bf", title: "Air Force One refurbishment costs weigh on Boeing results", date: "2026-07-28", time: "14:04", url: "https://www.ft.com/content/e8a4b77a-f420-409a-938f-17521c5ba7bf" },
  { id: "6cb23b3e-42bb-488b-bdf9-ecd1eee5495b", title: "Coca-Cola and Unilever sales surge after World Cup marketing blitz", date: "2026-07-28", time: "13:41", url: "https://www.ft.com/content/6cb23b3e-42bb-488b-bdf9-ecd1eee5495b" },
  { id: "3c62f28e-d7bc-409e-af17-61002472f3f7", title: "A truly progressive VAT would solve a lot of UK tax problems", date: "2026-07-28", time: "13:01", url: "https://www.ft.com/content/3c62f28e-d7bc-409e-af17-61002472f3f7" },
  { id: "b0dfd771-a6d6-476e-a435-7a5aedf2f820", title: "Tourists evacuated from wildfire threat as France and Spain brace for new heatwaves", date: "2026-07-28", time: "12:48", url: "https://www.ft.com/content/b0dfd771-a6d6-476e-a435-7a5aedf2f820" },
  { id: "3441b5aa-9d58-4829-bd2e-b2c0ce0198f1", title: "Trump’s waning sway over the world", date: "2026-07-28", time: "12:35", url: "https://www.ft.com/content/3441b5aa-9d58-4829-bd2e-b2c0ce0198f1" },
  { id: "c1b2cd1a-d5b5-4bf6-ba51-264c2401d75e", title: "What is the state of play with the energy shock?", date: "2026-07-28", time: "12:30", url: "https://www.ft.com/content/c1b2cd1a-d5b5-4bf6-ba51-264c2401d75e" },
  { id: "895d9928-4b9f-4401-91c0-760752dcb4d1", title: "Sorry, but Spanish olive oil is far superior to Italian", date: "2026-07-28", time: "11:00", url: "https://www.ft.com/content/895d9928-4b9f-4401-91c0-760752dcb4d1" },
  { id: "bf03d7a8-bfe7-41b6-ba43-74364de8d96f", title: "How China's grip on electrification metals could affect inflation", date: "2026-07-28", time: "12:00", url: "https://www.ft.com/content/bf03d7a8-bfe7-41b6-ba43-74364de8d96f" },
  { id: "c73bed01-2386-41a8-8db8-88069b558797", title: "AI boom raises risks of monetary policy mistakes, warn BIS economists", date: "2026-07-28", time: "11:53", url: "https://www.ft.com/content/c73bed01-2386-41a8-8db8-88069b558797" },
  { id: "a71b77dc-35db-49ef-9f60-103fc6c6d98e", title: "Singapore warns of economic risks if global AI boom falters", date: "2026-07-28", time: "10:30", url: "https://www.ft.com/content/a71b77dc-35db-49ef-9f60-103fc6c6d98e" },
  { id: "a51314c3-36d0-4653-992c-42b62495c5fe", title: "World's largest listed hedge fund reverses outflows in key unit", date: "2026-07-28", time: "10:24", url: "https://www.ft.com/content/a51314c3-36d0-4653-992c-42b62495c5fe" },
  { id: "5dca4c81-be8a-4555-971f-181eebf53e62", title: "Zelenskyy returns to Oval Office as Trump shifts towards Ukraine", date: "2026-07-28", time: "10:13", url: "https://www.ft.com/content/5dca4c81-be8a-4555-971f-181eebf53e62" },
  { id: "cc78fbc5-66dc-4a60-8ef5-e040b8aa7a11", title: "Education is not to blame for England's Neet crisis", date: "2026-07-28", time: "09:43", url: "https://www.ft.com/content/cc78fbc5-66dc-4a60-8ef5-e040b8aa7a11" },
  { id: "29d6edcc-4499-4655-bfec-0060bea95a66", title: "EY fined £1.2mn for breaching standards on Made.com audit", date: "2026-07-28", time: "09:18", url: "https://www.ft.com/content/29d6edcc-4499-4655-bfec-0060bea95a66" },
  { id: "6b2c9eb1-24f0-4117-a390-cfcdfdaad3a9", title: "Barclays profits boosted by market volatility gains", date: "2026-07-28", time: "07:30", url: "https://www.ft.com/content/6b2c9eb1-24f0-4117-a390-cfcdfdaad3a9" },
  { id: "d6439cb3-5a9e-4f6e-b5d6-b0e5621567c4", title: "The unexpected winners from China’s blockbuster chip IPO", date: "2026-07-28", time: "06:35", url: "https://www.ft.com/content/d6439cb3-5a9e-4f6e-b5d6-b0e5621567c4" },
  { id: "f917cd45-785a-45dd-9826-e8efed7003c0", title: "Tariffs and Treasury yields", date: "2026-07-28", time: "06:30", url: "https://www.ft.com/content/f917cd45-785a-45dd-9826-e8efed7003c0" },
  { id: "37ad8ef8-eaa0-4f01-adf5-fc7bf5b20cb9", title: "FTAV’s further reading", date: "2026-07-28", time: "06:30", url: "https://www.ft.com/content/37ad8ef8-eaa0-4f01-adf5-fc7bf5b20cb9" },
  { id: "f8c03b5b-e194-4236-82c3-389b6f5dd7ae", title: "AI stock sell-off deepens as investors dump chipmakers", date: "2026-07-28", time: "06:16", url: "https://www.ft.com/content/f8c03b5b-e194-4236-82c3-389b6f5dd7ae" },
  { id: "39c96379-0797-43f0-ae01-6711dd8986dc", title: "EU keeps firefighting planes on standby as France and Spain battle blazes", date: "2026-07-28", time: "06:00", url: "https://www.ft.com/content/39c96379-0797-43f0-ae01-6711dd8986dc" },
  { id: "8ed46f5f-0d52-46a8-a38d-642f5a828491", title: "Quant trading ≠ software company", date: "2026-07-28", time: "06:00", url: "https://www.ft.com/content/8ed46f5f-0d52-46a8-a38d-642f5a828491" },
  { id: "487d9a9f-5709-4fcb-9d75-45c16d6d1cfa", title: "FirstFT: TotalEnergies to benefit from Russian sanctions U-turn", date: "2026-07-28", time: "05:31", url: "https://www.ft.com/content/487d9a9f-5709-4fcb-9d75-45c16d6d1cfa" },
  { id: "b11cae2f-e210-48ad-8665-3243c7b86e13", title: "Bank of England to raise rates this year if energy prices stay high", date: "2026-07-28", time: "05:30", url: "https://www.ft.com/content/b11cae2f-e210-48ad-8665-3243c7b86e13" },
  { id: "c6e66af7-5ffe-46ff-8936-78d742c1cdfd", title: "BYD takes on Japan’s ‘kei’ car market with tiny EV", date: "2026-07-28", time: "05:16", url: "https://www.ft.com/content/c6e66af7-5ffe-46ff-8936-78d742c1cdfd" },
  { id: "0c734fbf-73f1-473d-a2fa-a59880bac4d6", title: "DCC board grapples with an M&A ‘laggard’s dilemma’", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/0c734fbf-73f1-473d-a2fa-a59880bac4d6" },
  { id: "0ee947e4-0b2a-48e4-93de-2c7985662f14", title: "TotalEnergies benefits from EU sanctions reprieve on Russian gas", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/0ee947e4-0b2a-48e4-93de-2c7985662f14" },
  { id: "cc27661a-9a6f-4e55-bfa3-64afd7107655", title: "Polish opposition split hands Donald Tusk pre-election boost", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/cc27661a-9a6f-4e55-bfa3-64afd7107655" },
  { id: "d471f2f4-e720-4684-86fd-21713daa4119", title: "Is a private equity megadeal brewing?", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/d471f2f4-e720-4684-86fd-21713daa4119" },
  { id: "976c453c-ae12-4318-be50-e8347b385637", title: "Don’t underestimate the economic power of a UK vibe shift", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/976c453c-ae12-4318-be50-e8347b385637" },
  { id: "ef7ff634-b738-4975-91b5-2edffc51da68", title: "EU hesitates to target Irish plant accused of supplying Russia’s war industry", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/ef7ff634-b738-4975-91b5-2edffc51da68" },
  { id: "bdfafe1e-8f31-437d-8bc3-93df255ca487", title: "‘Unpredictable and extremely dangerous’: France hit by rare fire thunderstorms", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/bdfafe1e-8f31-437d-8bc3-93df255ca487" },
  { id: "063eecdd-125f-44a7-86c0-78f202817d7e", title: "Trump’s ability to talk down oil prices is being tested", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/063eecdd-125f-44a7-86c0-78f202817d7e" },
  { id: "685014e7-47dd-471b-a585-1b9b73ce5d6f", title: "Nvidia behind $50bn lease on Texas data centre that will use its chips", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/685014e7-47dd-471b-a585-1b9b73ce5d6f" },
  { id: "a6801e59-3a71-4752-8456-86691e3e163f", title: "China needs a new growth model", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/a6801e59-3a71-4752-8456-86691e3e163f" },
];
