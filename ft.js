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
  { id: "41017d78-2d1c-4a41-9dee-c9237179d616", title: "Blackstone stands firm with cap on private credit outflows", date: "2026-09-03", time: "14:47", url: "https://www.ft.com/content/41017d78-2d1c-4a41-9dee-c9237179d616" },
  { id: "8f699fbc-cb01-4846-837c-0d1528a620d0", title: "Struggling Republicans urge Trump to open Maga Inc’s $400mn war chest", date: "2026-09-03", time: "14:19", url: "https://www.ft.com/content/8f699fbc-cb01-4846-837c-0d1528a620d0" },
  { id: "2e08ef04-b75f-4511-9587-0fbe9b991e37", title: "Milei dials up Argentina’s claim to Falklands", date: "2026-09-03", time: "14:10", url: "https://www.ft.com/content/2e08ef04-b75f-4511-9587-0fbe9b991e37" },
  { id: "3342fb0a-ff7c-4d57-bf74-9e0bc6dc8de3", title: "Vulnerable Republicans urge Trump to unleash Maga Inc’s $400mn cash pile", date: "2026-09-03", time: "14:06", url: "https://www.ft.com/content/3342fb0a-ff7c-4d57-bf74-9e0bc6dc8de3" },
  { id: "f3a578e4-5509-4d4e-9981-7127c40b2e31", title: "Oman FM: In an age of impunity, diplomats are more important than ever", date: "2026-09-03", time: "14:00", url: "https://www.ft.com/content/f3a578e4-5509-4d4e-9981-7127c40b2e31" },
  { id: "8fad4a81-ae66-4248-9669-81138b0d0f2a", title: "Monetary Policy Radar preview: ECB’s September meeting", date: "2026-09-03", time: "13:51", url: "https://www.ft.com/content/8fad4a81-ae66-4248-9669-81138b0d0f2a" },
  { id: "0a332e3c-e596-4f64-976a-d7746f91a9a9", title: "Federal Reserve’s Chris Waller ‘inclined’ to keep interest rates on hold", date: "2026-09-03", time: "13:30", url: "https://www.ft.com/content/0a332e3c-e596-4f64-976a-d7746f91a9a9" },
  { id: "f058481a-270a-42f1-8032-f4e4b112f36f", title: "Harvey Nichols sale set to cost luxury brands millions", date: "2026-09-03", time: "13:01", url: "https://www.ft.com/content/f058481a-270a-42f1-8032-f4e4b112f36f" },
  { id: "776dcb01-75cd-44df-bc52-63ca76d5718d", title: "Nvidia to buy open-source AI platform Hugging Face for $13bn", date: "2026-09-03", time: "13:00", url: "https://www.ft.com/content/776dcb01-75cd-44df-bc52-63ca76d5718d" },
  { id: "22abbb77-1344-4871-9692-97a779b1ba77", title: "Yen jumps as traders bet on Japan interest rate rises", date: "2026-09-03", time: "12:49", url: "https://www.ft.com/content/22abbb77-1344-4871-9692-97a779b1ba77" },
  { id: "093fd039-d71e-424c-ab56-c37b2a5afdc7", title: "Britain tests the unproven ‘politics of trying’", date: "2026-09-03", time: "12:42", url: "https://www.ft.com/content/093fd039-d71e-424c-ab56-c37b2a5afdc7" },
  { id: "eb7058a5-133e-4fef-b484-4cd965c0022e", title: "Entain exits the FTSE 100 in surprisingly good shape", date: "2026-09-03", time: "12:28", url: "https://www.ft.com/content/eb7058a5-133e-4fef-b484-4cd965c0022e" },
  { id: "28676485-9dd8-4c17-8c7b-e062bf50ff7b", title: "Crest Nicholson shares tumble as housebuilder warns of loss", date: "2026-09-03", time: "12:02", url: "https://www.ft.com/content/28676485-9dd8-4c17-8c7b-e062bf50ff7b" },
  { id: "59b1a168-7636-4a23-84e5-b31439b6018d", title: "How US oil companies are expanding as Trump reshapes global energy", date: "2026-09-03", time: "12:00", url: "https://www.ft.com/content/59b1a168-7636-4a23-84e5-b31439b6018d" },
  { id: "1a4e9dc2-bd0b-40d7-bf56-c113def697c2", title: "Trade World — despite Trump’s tariffs, global commerce just keeps on growing", date: "2026-09-03", time: "12:00", url: "https://www.ft.com/content/1a4e9dc2-bd0b-40d7-bf56-c113def697c2" },
  { id: "f117f347-e1e0-457c-83fc-ba4745581bb2", title: "Diesel premium in Europe jumps to record high", date: "2026-09-03", time: "11:50", url: "https://www.ft.com/content/f117f347-e1e0-457c-83fc-ba4745581bb2" },
  { id: "bbb04f65-7cdd-4ba2-8f82-96158ff40d63", title: "Volodymyr Zelenskyy rebukes spy agencies after Kyiv shootout", date: "2026-09-03", time: "11:25", url: "https://www.ft.com/content/bbb04f65-7cdd-4ba2-8f82-96158ff40d63" },
  { id: "a0d34842-a49c-47ae-b1cc-3fadd8af9d43", title: "Hargreaves Lansdown offers crypto ETNs nearly a year after ban was lifted", date: "2026-09-03", time: "11:24", url: "https://www.ft.com/content/a0d34842-a49c-47ae-b1cc-3fadd8af9d43" },
  { id: "b2d099c5-696c-4c00-87cc-3848e552763a", title: "Shein shares sink almost 9% on third day of trading", date: "2026-09-03", time: "11:04", url: "https://www.ft.com/content/b2d099c5-696c-4c00-87cc-3848e552763a" },
  { id: "68feb37d-1ec3-4c00-8726-4aac0231cf4c", title: "Luxury gym Equinox in refinancing talks to shred debt and bulk up cash", date: "2026-09-03", time: "11:00", url: "https://www.ft.com/content/68feb37d-1ec3-4c00-8726-4aac0231cf4c" },
  { id: "96e8d67a-6f8c-4389-9ab8-d9309f51634e", title: "How AI forces us to rethink the economy", date: "2026-09-03", time: "11:00", url: "https://www.ft.com/content/96e8d67a-6f8c-4389-9ab8-d9309f51634e" },
  { id: "8252d574-ae2a-4403-9cf9-031295ba67f5", title: "‘People are going to get screwed’: Pennsylvania voters unite against data centres", date: "2026-09-03", time: "11:00", url: "https://www.ft.com/content/8252d574-ae2a-4403-9cf9-031295ba67f5" },
  { id: "51afa87f-7452-4c5c-8beb-7eed624f6f22", title: "Friedrich Merz sidelined as party fights far right in regional poll", date: "2026-09-03", time: "11:00", url: "https://www.ft.com/content/51afa87f-7452-4c5c-8beb-7eed624f6f22" },
  { id: "bb80d928-c9c3-493e-8b7f-fb5208fd90b3", title: "How free trade can shield us from El Niño", date: "2026-09-03", time: "11:00", url: "https://www.ft.com/content/bb80d928-c9c3-493e-8b7f-fb5208fd90b3" },
  { id: "7d416a4e-e9ee-4b9a-a447-fdb1ba29f257", title: "Norway seizes Russian state-owned ship over Ukrainian lawsuit", date: "2026-09-03", time: "10:35", url: "https://www.ft.com/content/7d416a4e-e9ee-4b9a-a447-fdb1ba29f257" },
  { id: "24ab2170-3db3-4898-ad30-55c0898ab666", title: "Missed flight connections double under EU smart border system", date: "2026-09-03", time: "10:24", url: "https://www.ft.com/content/24ab2170-3db3-4898-ad30-55c0898ab666" },
  { id: "1b749103-a006-4fc4-91e2-222d99dc1280", title: "PMQs cannot change Andy Burnham’s political reality", date: "2026-09-03", time: "09:59", url: "https://www.ft.com/content/1b749103-a006-4fc4-91e2-222d99dc1280" },
  { id: "65c80957-5b37-4ec5-863d-386865796092", title: "Greens leader Zack Polanski to stand in seat vacated by Starmer", date: "2026-09-03", time: "09:48", url: "https://www.ft.com/content/65c80957-5b37-4ec5-863d-386865796092" },
  { id: "0b1794c0-cba0-4762-90fa-24c7a53f8928", title: "Nobody likes data centres and chips, chips, chips", date: "2026-09-03", time: "09:45", url: "https://www.ft.com/content/0b1794c0-cba0-4762-90fa-24c7a53f8928" },
  { id: "c8fb5709-cb84-42f6-89db-53e234412f21", title: "Reform UK receives more than £5mn in donations in second quarter", date: "2026-09-03", time: "09:41", url: "https://www.ft.com/content/c8fb5709-cb84-42f6-89db-53e234412f21" },
  { id: "0c72fee3-a5b8-4b18-9c63-6919618d45b9", title: "Everton FC owners look for investors after football’s summer deal rush", date: "2026-09-03", time: "09:34", url: "https://www.ft.com/content/0c72fee3-a5b8-4b18-9c63-6919618d45b9" },
  { id: "b2bc5b54-8a8a-4004-a584-91eba3b9d6d8", title: "Vintage Gallet watch brand reboot makes a play for middle market", date: "2026-09-03", time: "09:30", url: "https://www.ft.com/content/b2bc5b54-8a8a-4004-a584-91eba3b9d6d8" },
  { id: "2d69802f-cdea-4884-ac53-e20001495ada", title: "Why does it even matter if SoftBank’s an investment holding company?", date: "2026-09-03", time: "08:52", url: "https://www.ft.com/content/2d69802f-cdea-4884-ac53-e20001495ada" },
  { id: "16034441-608c-42de-90ff-1a2b7607fc79", title: "Elliott builds stake in Deutsche Telekom and opposes T-Mobile US merger", date: "2026-09-03", time: "08:24", url: "https://www.ft.com/content/16034441-608c-42de-90ff-1a2b7607fc79" },
  { id: "e9f359ba-1822-4d39-8722-e2073dafd4af", title: "Alexia Genta: ‘You cannot kill ambition to protect the past’", date: "2026-09-03", time: "07:58", url: "https://www.ft.com/content/e9f359ba-1822-4d39-8722-e2073dafd4af" },
  { id: "f2f05059-8fbe-47b9-8976-c85bb119bbd0", title: "More on the 60/40 portfolio", date: "2026-09-03", time: "06:30", url: "https://www.ft.com/content/f2f05059-8fbe-47b9-8976-c85bb119bbd0" },
  { id: "70ca0dbc-e9b4-487b-be08-ab7a01c43696", title: "Ireland strives for EU budget breakthrough as December deadline looms", date: "2026-09-03", time: "06:00", url: "https://www.ft.com/content/70ca0dbc-e9b4-487b-be08-ab7a01c43696" },
  { id: "d30b278a-4f73-4d37-932f-43821cb10b82", title: "FTAV’s further reading", date: "2026-09-03", time: "06:00", url: "https://www.ft.com/content/d30b278a-4f73-4d37-932f-43821cb10b82" },
  { id: "9d4cffdc-4d8b-4a8b-98be-42e17200b122", title: "FirstFT: KPMG warned Guggenheim unit over weak controls", date: "2026-09-03", time: "05:36", url: "https://www.ft.com/content/9d4cffdc-4d8b-4a8b-98be-42e17200b122" },
  { id: "bad69b88-da02-4859-8190-37c55039be75", title: "American sailors roll into Thailand’s Pattaya resort after nine months at sea", date: "2026-09-03", time: "05:04", url: "https://www.ft.com/content/bad69b88-da02-4859-8190-37c55039be75" },
];
