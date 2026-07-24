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
  { id: "95cad892-7933-441a-bc82-c39b1a225835", title: "Paramount agrees extensive delay in Warner Bros deal after state lawsuit", date: "2026-07-24", time: "21:17", url: "https://www.ft.com/content/95cad892-7933-441a-bc82-c39b1a225835" },
  { id: "6e1d4a14-b7ad-4a36-86d9-3990497272a3", title: "France and Spain evacuate 150,000 as ‘unprecedented’ wildfires spread", date: "2026-07-24", time: "21:07", url: "https://www.ft.com/content/6e1d4a14-b7ad-4a36-86d9-3990497272a3" },
  { id: "96a33881-27fd-42cf-8cff-4cbc87fc835f", title: "US tech groups cut 140,000 jobs despite AI spending boom", date: "2026-07-24", time: "21:00", url: "https://www.ft.com/content/96a33881-27fd-42cf-8cff-4cbc87fc835f" },
  { id: "9dcb5d72-13aa-4f9c-ac6d-e022860df5ea", title: "Waymo explores split with Uber as robotaxi tensions deepen", date: "2026-07-24", time: "20:15", url: "https://www.ft.com/content/9dcb5d72-13aa-4f9c-ac6d-e022860df5ea" },
  { id: "4d8139b2-8ea2-468b-a674-5f6a90a84182", title: "China investigates former securities regulator Fang Xinghai", date: "2026-07-24", time: "19:25", url: "https://www.ft.com/content/4d8139b2-8ea2-468b-a674-5f6a90a84182" },
  { id: "9b819dfc-8248-4aa5-b670-3a14d05f252e", title: "Donald Trump threatens new EU tariffs in retaliation for fines on US tech groups", date: "2026-07-24", time: "19:21", url: "https://www.ft.com/content/9b819dfc-8248-4aa5-b670-3a14d05f252e" },
  { id: "cdb327b6-394b-4da1-943e-65d40e4f4345", title: "Number 10 North is no ‘gimmick’, says Andy Burnham", date: "2026-07-24", time: "19:14", url: "https://www.ft.com/content/cdb327b6-394b-4da1-943e-65d40e4f4345" },
  { id: "a08167d0-232d-4ab0-9437-da47fcdcf5df", title: "Tory party ‘bans’ candidates who don’t back its human rights and net zero pledges", date: "2026-07-24", time: "18:52", url: "https://www.ft.com/content/a08167d0-232d-4ab0-9437-da47fcdcf5df" },
  { id: "002120c3-a62d-4da8-8ba6-bc1290c89be6", title: "John Healey under pressure to raise taxes or cut UK spending as fiscal headroom shrinks", date: "2026-07-24", time: "18:50", url: "https://www.ft.com/content/002120c3-a62d-4da8-8ba6-bc1290c89be6" },
  { id: "b0c496af-bb5b-44c5-84e5-9c09431b8903", title: "Narendra Modi struggles to calm Indian students’ anger over exam leaks", date: "2026-07-24", time: "18:22", url: "https://www.ft.com/content/b0c496af-bb5b-44c5-84e5-9c09431b8903" },
  { id: "a08c02e1-8d20-4001-ab9b-1dbfea7acedc", title: "Police seize sophisticated bomb near Northern Irish border", date: "2026-07-24", time: "18:06", url: "https://www.ft.com/content/a08c02e1-8d20-4001-ab9b-1dbfea7acedc" },
  { id: "6633c407-46dc-4c33-9c66-f912b9f9f5dc", title: "The return of monetarism", date: "2026-07-24", time: "18:00", url: "https://www.ft.com/content/6633c407-46dc-4c33-9c66-f912b9f9f5dc" },
  { id: "f8d2dc0d-3599-4c98-9ed3-b4812a188b85", title: "Directors’ Deals: Fevara non-executive chair beefs up stake", date: "2026-07-24", time: "18:00", url: "https://www.ft.com/content/f8d2dc0d-3599-4c98-9ed3-b4812a188b85" },
  { id: "cf1caa35-51d6-45fc-9503-3f19e161f006", title: "Stockpickers: Greencore, Kier, Gateley", date: "2026-07-24", time: "18:00", url: "https://www.ft.com/content/cf1caa35-51d6-45fc-9503-3f19e161f006" },
  { id: "6c4aff69-197d-4d0d-9afa-83960d143f10", title: "Future hawks", date: "2026-07-24", time: "17:56", url: "https://www.ft.com/content/6c4aff69-197d-4d0d-9afa-83960d143f10" },
  { id: "52aa89e9-f014-498e-8415-2c435a1c858d", title: "Ship insurers restrict war coverage for Saudi Arabian cargoes in Red Sea", date: "2026-07-24", time: "17:38", url: "https://www.ft.com/content/52aa89e9-f014-498e-8415-2c435a1c858d" },
  { id: "3a62abc2-995b-4901-9ea3-832581295f45", title: "What is driving the sharp decline in UK small boat crossings?", date: "2026-07-24", time: "17:35", url: "https://www.ft.com/content/3a62abc2-995b-4901-9ea3-832581295f45" },
  { id: "3203fc9a-2321-44f8-8093-b7e16c8fc6d7", title: "Nvidia and Palantir urge US not to ban ‘open’ AI models after China scare", date: "2026-07-24", time: "16:20", url: "https://www.ft.com/content/3203fc9a-2321-44f8-8093-b7e16c8fc6d7" },
  { id: "822628c5-4f9c-47db-bd27-f3ad7f841700", title: "Meta faces higher borrowing costs in latest $12bn data centre financing", date: "2026-07-24", time: "16:08", url: "https://www.ft.com/content/822628c5-4f9c-47db-bd27-f3ad7f841700" },
  { id: "aba1b4be-68d6-4f74-a511-24fbad030024", title: "The Victorians have some lessons for Burnham on radical devolution", date: "2026-07-24", time: "16:04", url: "https://www.ft.com/content/aba1b4be-68d6-4f74-a511-24fbad030024" },
  { id: "2c473393-35fb-479d-8bba-236a1a98087c", title: "Trump tariff tracker: US trade, markets and the economy", date: "2026-07-24", time: "11:36", url: "https://www.ft.com/content/2c473393-35fb-479d-8bba-236a1a98087c" },
  { id: "fe25333d-9b0f-4b8b-8f04-96778f63482f", title: "FTAV’s Friday charts quiz", date: "2026-07-24", time: "11:13", url: "https://www.ft.com/content/fe25333d-9b0f-4b8b-8f04-96778f63482f" },
  { id: "c91339fb-4f42-4cbe-910b-d2d42612afd1", title: "Top UK law firm partners take home record pay", date: "2026-07-24", time: "10:52", url: "https://www.ft.com/content/c91339fb-4f42-4cbe-910b-d2d42612afd1" },
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
  { id: "f0f7793b-fbf6-45fe-b6cb-2abe409b359a", title: "Senior City of London Police officer urges Burnham to be ‘loud’ on fraud", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/f0f7793b-fbf6-45fe-b6cb-2abe409b359a" }
];
