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
  { id: "2c473393-35fb-479d-8bba-236a1a98087c", title: "Trump tariff tracker: US trade, markets and the economy", date: "2026-07-24", time: "11:36", url: "https://www.ft.com/content/2c473393-35fb-479d-8bba-236a1a98087c" },
  { id: "fe25333d-9b0f-4b8b-8f04-96778f63482f", title: "FTAV’s Friday charts quiz", date: "2026-07-24", time: "11:13", url: "https://www.ft.com/content/fe25333d-9b0f-4b8b-8f04-96778f63482f" },
  { id: "c91339fb-4f42-4cbe-910b-d2d42612afd1", title: "Top UK law firm partners take home record pay", date: "2026-07-24", time: "10:52", url: "https://www.ft.com/content/c91339fb-4f42-4cbe-910b-d2d42612afd1" },
  { id: "6e1d4a14-b7ad-4a36-86d9-3990497272a3", title: "Wildfires force evacuation of Cap Ferret resort on Atlantic coast", date: "2026-07-24", time: "10:39", url: "https://www.ft.com/content/6e1d4a14-b7ad-4a36-86d9-3990497272a3" },
  { id: "886d5a1b-f195-4966-9cc3-364ee09a1343", title: "Hong Kong stock exchange relaxes listing rules to compete with US rivals", date: "2026-07-24", time: "10:31", url: "https://www.ft.com/content/886d5a1b-f195-4966-9cc3-364ee09a1343" },
  { id: "5399b5d6-b9e8-4dfc-9a30-323135b02713", title: "Japan’s June inflation figure poses no obstacle to BoJ tightening this year", date: "2026-07-24", time: "10:23", url: "https://www.ft.com/content/5399b5d6-b9e8-4dfc-9a30-323135b02713" },
  { id: "7514fe92-2dab-4548-b758-a034babd0442", title: "What Manchester can’t tell you about Burnhamism", date: "2026-07-24", time: "09:30", url: "https://www.ft.com/content/7514fe92-2dab-4548-b758-a034babd0442" },
  { id: "34171e34-2122-461a-8fd1-88897854062b", title: "Reckitt to take £175mn hit from sale of Russian hygiene business", date: "2026-07-24", time: "09:27", url: "https://www.ft.com/content/34171e34-2122-461a-8fd1-88897854062b" },
  { id: "fe213675-b988-4121-9723-96d433d524d8", title: "Wise’s US bank licence bid rejected over compliance ‘deficiencies’", date: "2026-07-24", time: "08:51", url: "https://www.ft.com/content/fe213675-b988-4121-9723-96d433d524d8" },
  { id: "856296a6-abab-4dba-ac39-9b74f9b137f1", title: "Sun, football and Andy Burnham push UK consumer confidence and retail sales higher", date: "2026-07-24", time: "07:41", url: "https://www.ft.com/content/856296a6-abab-4dba-ac39-9b74f9b137f1" },
  { id: "061970ae-6e01-43cd-aaf7-1a728d04d09b", title: "In the rates drama, oil is a minor character", date: "2026-07-24", time: "06:30", url: "https://www.ft.com/content/061970ae-6e01-43cd-aaf7-1a728d04d09b" },
  { id: "6023ca1b-8a8c-488f-b604-71341c3de803", title: "FTAV’s further reading", date: "2026-07-24", time: "06:30", url: "https://www.ft.com/content/6023ca1b-8a8c-488f-b604-71341c3de803" },
  { id: "9d98ddb1-edfc-4df9-a6e8-e0b12845dd29", title: "Ireland pushes for breakthrough on EU capital markets reform", date: "2026-07-24", time: "06:04", url: "https://www.ft.com/content/9d98ddb1-edfc-4df9-a6e8-e0b12845dd29" },
  { id: "3914d25d-b509-4859-9040-6539cea6da7b", title: "How much does Wetherspoons make from its gambling machines?", date: "2026-07-24", time: "06:00", url: "https://www.ft.com/content/3914d25d-b509-4859-9040-6539cea6da7b" },
  { id: "1e18ad77-8ef1-4ed8-891d-a43a901febf7", title: "FirstFT: US hits 60 countries with new tariffs", date: "2026-07-24", time: "05:30", url: "https://www.ft.com/content/1e18ad77-8ef1-4ed8-891d-a43a901febf7" },
  { id: "70fcf3e8-1fec-4af8-8fe2-5bc2cd604b21", title: "Monetary Policy Radar preview: Federal Reserve’s July meeting", date: "2026-07-24", time: "05:30", url: "https://www.ft.com/content/70fcf3e8-1fec-4af8-8fe2-5bc2cd604b21" },
  { id: "8bf64e52-3e00-4305-8c1d-afd7e5591055", title: "Blackstone’s Stephen Schwarzman: ‘Our stock is on sale’", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/8bf64e52-3e00-4305-8c1d-afd7e5591055" },
  { id: "4ecdab5f-d85d-41df-8fa6-861f650f8bd4", title: "The fight to be the next Andy Burnham", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/4ecdab5f-d85d-41df-8fa6-861f650f8bd4" },
  { id: "9048c284-e516-42af-bd1c-b636fb2a3462", title: "Can the ‘Johnny Cash of the Allagash’ win the US Senate for the Democrats?", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/9048c284-e516-42af-bd1c-b636fb2a3462" },
  { id: "c92e3acf-f8e9-40cd-b328-3b230bbab734", title: "BNP Paribas shows there is life beyond Mars", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/c92e3acf-f8e9-40cd-b328-3b230bbab734" },
  { id: "f0f7793b-fbf6-45fe-b6cb-2abe409b359a", title: "Senior City of London Police officer urges Burnham to be ‘loud’ on fraud", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/f0f7793b-fbf6-45fe-b6cb-2abe409b359a" },
  { id: "52961fa7-6d9d-46b8-a627-9335964bf7ac", title: "Burnham the builder: can British housebuilders deliver his ambition?", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/52961fa7-6d9d-46b8-a627-9335964bf7ac" },
  { id: "5c9ae967-8e85-470f-974b-43667cc6f1c1", title: "Russia’s biggest online retailer becomes target in Ukraine drone war", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/5c9ae967-8e85-470f-974b-43667cc6f1c1" },
  { id: "39100ba0-e9d5-4fb8-bd94-ec07860b52f8", title: "When will Andy Burnham tackle the ‘cost of working’ crisis?", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/39100ba0-e9d5-4fb8-bd94-ec07860b52f8" },
  { id: "7bcf8215-fd76-4620-bdc3-8c1b0ea13bba", title: "Welcome to the era of financial candyfloss", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/7bcf8215-fd76-4620-bdc3-8c1b0ea13bba" },
  { id: "901761c9-78bd-455b-9f50-1870db95b3c4", title: "Demand for ‘impact’ funds holds up despite ESG backlash", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/901761c9-78bd-455b-9f50-1870db95b3c4" },
  { id: "efec9ae0-09e4-4546-8a31-07ba84c1db1a", title: "Fund firms deploy ETF ‘spaghetti cannon’ in hunt for next hot trade", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/efec9ae0-09e4-4546-8a31-07ba84c1db1a" },
  { id: "40bca32f-d715-48f9-9a8f-fb4bd3f199b8", title: "The rapid rise of English councils funding private online school places", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/40bca32f-d715-48f9-9a8f-fb4bd3f199b8" },
  { id: "4b680401-648e-48ea-a52b-ad7a76370872", title: "The strongman of Pakistan", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/4b680401-648e-48ea-a52b-ad7a76370872" },
  { id: "ea107717-6d9a-4b21-b5b4-c94b6c2be5e9", title: "Modi offers Indian students fresh concessions to head off protests", date: "2026-07-24", time: "04:52", url: "https://www.ft.com/content/ea107717-6d9a-4b21-b5b4-c94b6c2be5e9" },
  { id: "078269b4-5518-4289-b90a-dd722fd7e703", title: "US hits 60 countries with new duties as Donald Trump rebuilds tariff wall", date: "2026-07-24", time: "04:08", url: "https://www.ft.com/content/078269b4-5518-4289-b90a-dd722fd7e703" },
  { id: "8ebab4c1-f36a-455e-a3d1-b36247296669", title: "South Korea’s cash-rich winners of AI boom go on US buying spree", date: "2026-07-24", time: "04:06", url: "https://www.ft.com/content/8ebab4c1-f36a-455e-a3d1-b36247296669" },
  { id: "48f0a410-daae-420b-93fc-216c3a2f1184", title: "Intel posts fastest growth in 15 years as AI fuels chip sales", date: "2026-07-23", time: "21:02", url: "https://www.ft.com/content/48f0a410-daae-420b-93fc-216c3a2f1184" },
  { id: "f46bb42d-b61d-4932-a07b-09172b15509f", title: "How Andy Burnham’s rise to PM was helped by those axed by Starmer", date: "2026-07-23", time: "19:35", url: "https://www.ft.com/content/f46bb42d-b61d-4932-a07b-09172b15509f" },
  { id: "55b3b434-9965-4046-b239-43443db3e54a", title: "Trump’s dubious nuclear deal with Saudi Arabia", date: "2026-07-23", time: "18:56", url: "https://www.ft.com/content/55b3b434-9965-4046-b239-43443db3e54a" },
  { id: "a5c66044-8999-48a5-b9cc-51341f177930", title: "US Department of Justice to streamline company merger reviews", date: "2026-07-23", time: "18:56", url: "https://www.ft.com/content/a5c66044-8999-48a5-b9cc-51341f177930" },
  { id: "58a7b441-938c-4c05-9615-40ceaf17882b", title: "North Sea oil and gas industry looks for answers from new energy secretary", date: "2026-07-23", time: "18:49", url: "https://www.ft.com/content/58a7b441-938c-4c05-9615-40ceaf17882b" },
  { id: "b150cd9c-d31e-498d-ac31-ff5d93cb674f", title: "UK employers should keep access to skilled trades visas, government advisers say", date: "2026-07-23", time: "18:06", url: "https://www.ft.com/content/b150cd9c-d31e-498d-ac31-ff5d93cb674f" },
  { id: "afeeafb7-2a0c-4aba-a798-cecd2d8c8685", title: "The Nestlé supertanker’s turnaround is in train — under the surface", date: "2026-07-23", time: "18:00", url: "https://www.ft.com/content/afeeafb7-2a0c-4aba-a798-cecd2d8c8685" },
  { id: "bd7626de-c367-4e64-ab94-e84c2d10d87f", title: "US weapons makers’ sales soar as Iran war boosts order backlog", date: "2026-07-23", time: "17:47", url: "https://www.ft.com/content/bd7626de-c367-4e64-ab94-e84c2d10d87f" }
];
