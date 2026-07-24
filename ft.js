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
  { id: "3203fc9a-2321-44f8-8093-b7e16c8fc6d7", title: "Nvidia and Palantir urge US not to ban 'open' AI models after China scare", date: "2026-07-24", time: "16:20", url: "https://www.ft.com/content/3203fc9a-2321-44f8-8093-b7e16c8fc6d7" },
  { id: "822628c5-4f9c-47db-bd27-f3ad7f841700", title: "Meta faces higher borrowing costs in latest $12bn data centre financing", date: "2026-07-24", time: "16:08", url: "https://www.ft.com/content/822628c5-4f9c-47db-bd27-f3ad7f841700" },
  { id: "aba1b4be-68d6-4f74-a511-24fbad030024", title: "The Victorians have some lessons for Burnham on radical devolution", date: "2026-07-24", time: "16:04", url: "https://www.ft.com/content/aba1b4be-68d6-4f74-a511-24fbad030024" },
  { id: "d4dc32c5-7a96-4582-b17b-ab6a4569f474", title: "Commerzbank chair calls for talks with UniCredit after takeover battle", date: "2026-07-24", time: "15:53", url: "https://www.ft.com/content/d4dc32c5-7a96-4582-b17b-ab6a4569f474" },
  { id: "a08c02e1-8d20-4001-ab9b-1dbfea7acedc", title: "Police seize sophisticated bomb near Northern Irish border", date: "2026-07-24", time: "15:47", url: "https://www.ft.com/content/a08c02e1-8d20-4001-ab9b-1dbfea7acedc" },
  { id: "35538b17-1492-42e5-a4b6-8a9e5750c2bf", title: "Airbus and Boeing push to boost production to tackle record order backlogs", date: "2026-07-24", time: "15:45", url: "https://www.ft.com/content/35538b17-1492-42e5-a4b6-8a9e5750c2bf" },
  { id: "a39adcc1-44fb-40e0-92b9-30d769f8e4ca", title: "Carmakers are the rare example of tariffs as the least bad option", date: "2026-07-24", time: "14:57", url: "https://www.ft.com/content/a39adcc1-44fb-40e0-92b9-30d769f8e4ca" },
  { id: "3db2e890-a9e9-42f4-9c9c-0f5ecf7ac621", title: "Zooming in on UK growth", date: "2026-07-24", time: "14:50", url: "https://www.ft.com/content/3db2e890-a9e9-42f4-9c9c-0f5ecf7ac621" },
  { id: "1dcd935a-45ce-42ba-a6b0-6994eae1cb86", title: "In praise of the free flow of human ingenuity", date: "2026-07-24", time: "14:48", url: "https://www.ft.com/content/1dcd935a-45ce-42ba-a6b0-6994eae1cb86" },
  { id: "07e7e839-6d7c-4da3-a207-de5bbfb67746", title: "Submit your questions: Has the market lost its mind over AI?", date: "2026-07-24", time: "14:42", url: "https://www.ft.com/content/07e7e839-6d7c-4da3-a207-de5bbfb67746" },
  { id: "1a98a3e5-34f3-4bb6-936a-241ab72aaeed", title: "When a president's thoughts are for sale", date: "2026-07-24", time: "14:00", url: "https://www.ft.com/content/1a98a3e5-34f3-4bb6-936a-241ab72aaeed" },
  { id: "38341bcb-0c45-432a-bd04-fa0b9f2b790a", title: "Trump's trade war shifts from shakedown to lock-in", date: "2026-07-24", time: "13:53", url: "https://www.ft.com/content/38341bcb-0c45-432a-bd04-fa0b9f2b790a" },
  { id: "07e6299e-816a-4d0f-a4be-a572723f9e52", title: "Ukraine opens probe into defence event after deadly Russian strike", date: "2026-07-24", time: "13:52", url: "https://www.ft.com/content/07e6299e-816a-4d0f-a4be-a572723f9e52" },
  { id: "29f1b750-9c2a-4bf6-bb0b-ef521f6409a8", title: "Burnham's economic vision", date: "2026-07-24", time: "13:41", url: "https://www.ft.com/content/29f1b750-9c2a-4bf6-bb0b-ef521f6409a8" },
  { id: "2ba28daf-2ceb-44bb-9330-7ec070fb2a80", title: "Europe wins and Brazil loses in Trump tariff overhaul", date: "2026-07-24", time: "13:38", url: "https://www.ft.com/content/2ba28daf-2ceb-44bb-9330-7ec070fb2a80" },
  { id: "b49cffde-6610-4b20-b1fa-da1cdbca9d5c", title: "BP nears deal to sell solar business Lightsource to Kuwait-backed group", date: "2026-07-24", time: "13:32", url: "https://www.ft.com/content/b49cffde-6610-4b20-b1fa-da1cdbca9d5c" },
  { id: "21d95258-2734-4a8a-91f7-6bbd02d21385", title: "South East Water secures £200mn liquidity boost", date: "2026-07-24", time: "12:36", url: "https://www.ft.com/content/21d95258-2734-4a8a-91f7-6bbd02d21385" },
  { id: "718ec1f0-5e05-48b7-9c99-ab28b6f9b055", title: "Renewable jet fuel producer Neste swings to profit after Iran war sends prices soaring", date: "2026-07-24", time: "12:31", url: "https://www.ft.com/content/718ec1f0-5e05-48b7-9c99-ab28b6f9b055" },
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
  { id: "5c9ae967-8e85-470f-974b-43667cc6f1c1", title: "Russia’s biggest online retailer becomes target in Ukraine drone war", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/5c9ae967-8e85-470f-974b-43667cc6f1c1" }
];
