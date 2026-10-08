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
    id: "eba99693-2abc-4b08-9133-98452bc01290",
    title: "Kirkland’s money machine goes dark",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/eba99693-2abc-4b08-9133-98452bc01290",
  },
  {
    id: "5371b147-4984-43ed-95d4-b009cf060446",
    title: "Andy Burnham’s government to press ahead with Oxford-Cambridge corridor",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/5371b147-4984-43ed-95d4-b009cf060446",
  },
  {
    id: "e3e45a40-41da-4062-8c47-f51ab710bf02",
    title: "Former prince Andrew could face witness summons in £40mn London fraud trial",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/e3e45a40-41da-4062-8c47-f51ab710bf02",
  },
  {
    id: "681bea76-370b-4cbe-b1aa-239946ae6e4d",
    title: "Wise to pay customers’ tax bills after errors",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/681bea76-370b-4cbe-b1aa-239946ae6e4d",
  },
  {
    id: "9cf103ed-548e-4b06-baed-71632abca961",
    title: "Big investors ‘bottom fish’ in Eurozone bond markets after France sell-off",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/9cf103ed-548e-4b06-baed-71632abca961",
  },
  {
    id: "177f9fba-841a-4448-ad54-ac621dc58f2a",
    title: "Norway lays down a line for EU on AI glasses",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/177f9fba-841a-4448-ad54-ac621dc58f2a",
  },
  {
    id: "ba171091-839a-4d78-86af-8e93a7013d6c",
    title: "Giorgia Meloni faces critical test in controversial electoral reform vote",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/ba171091-839a-4d78-86af-8e93a7013d6c",
  },
  {
    id: "3534cf93-be7b-49ec-bf58-cea84e73cb28",
    title: "Oil majors look beyond Middle East war in pursuit of region’s vast reserves",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/3534cf93-be7b-49ec-bf58-cea84e73cb28",
  },
  {
    id: "54a4c412-f3af-4ba5-b0b1-53bd86b9d172",
    title: "Japan was never normal — and it’s not going to be now",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/54a4c412-f3af-4ba5-b0b1-53bd86b9d172",
  },
  {
    id: "cf568d51-cd06-4071-bbc0-d0e5126e1396",
    title: "The race for Britain’s car market is wide open — for now",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/cf568d51-cd06-4071-bbc0-d0e5126e1396",
  },
  {
    id: "5cad1f95-b06d-4ee1-b1c7-0244999337d4",
    title: "What is the real price of oil any more?",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/5cad1f95-b06d-4ee1-b1c7-0244999337d4",
  },
  {
    id: "bd564613-8ef4-4a71-8ff1-b95d1bd5e1be",
    title: "Retirement flats have been a miserable investment",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/bd564613-8ef4-4a71-8ff1-b95d1bd5e1be",
  },
  {
    id: "9f5a1496-fe71-484d-b5cc-cc6f27f595a1",
    title: "Palantir’s Homes for Ukraine contract cost UK £5mn for one-year extension",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/9f5a1496-fe71-484d-b5cc-cc6f27f595a1",
  },
  {
    id: "70b7333c-f746-462f-a973-30a999403b15",
    title: "Japan’s small-cap cull is an opportunity for AI funds",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/70b7333c-f746-462f-a973-30a999403b15",
  },
  {
    id: "572b899b-0e36-4a90-aadc-776818e339c3",
    title: "Azerbaijan denies buying German state secrets from former spy chief",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/572b899b-0e36-4a90-aadc-776818e339c3",
  },
  {
    id: "d313d0ce-d552-463e-9e84-6fa8c3efeeec",
    title: "How a trillion-dollar hedge fund borrowing spree became Wall Street’s cash cow",
    date: "2026-10-08",
    time: "05:00",
    url: "https://www.ft.com/content/d313d0ce-d552-463e-9e84-6fa8c3efeeec",
  },
  {
    id: "8d1cb8e2-ed48-4d7c-ac19-2693973894b4",
    title: "Higher mortgage rates inflict ‘pain’ on UK housing market",
    date: "2026-10-08",
    time: "00:01",
    url: "https://www.ft.com/content/8d1cb8e2-ed48-4d7c-ac19-2693973894b4",
  },
  {
    id: "5539d473-604b-42b3-ba6d-0dbb3353957b",
    title: "FirstFT: China rejects EU request for voluntary curbs on hybrid car exports",
    date: "2026-10-07",
    time: "22:34",
    url: "https://www.ft.com/content/5539d473-604b-42b3-ba6d-0dbb3353957b",
  },
  {
    id: "ea58254a-947e-4e87-86d2-95ffbd8a1c9d",
    title: "Trump considers ‘terminating’ campaign advisers over Balkans trip",
    date: "2026-10-07",
    time: "22:24",
    url: "https://www.ft.com/content/ea58254a-947e-4e87-86d2-95ffbd8a1c9d",
  },
  {
    id: "ec8b74b6-0cf7-4ded-abd4-85bde8a80df4",
    title: "AI upends Singapore’s ‘quant Olympics’",
    date: "2026-10-07",
    time: "22:00",
    url: "https://www.ft.com/content/ec8b74b6-0cf7-4ded-abd4-85bde8a80df4",
  },
  {
    id: "acca8690-c230-4abc-b2c5-4a1d2f082753",
    title: "Fed minutes indicate broad agreement for another rate rise this year",
    date: "2026-10-07",
    time: "21:18",
    url: "https://www.ft.com/content/acca8690-c230-4abc-b2c5-4a1d2f082753",
  },
  {
    id: "2cb13aed-f6bf-4f45-b906-fa1194405a0c",
    title: "Iran war blows near-£12bn hole in Britain’s public finances",
    date: "2026-10-07",
    time: "21:00",
    url: "https://www.ft.com/content/2cb13aed-f6bf-4f45-b906-fa1194405a0c",
  },
  {
    id: "2761b6af-df11-49e8-a348-792a9597c9af",
    title: "Diesel price jumps after IEA says no additional fuel will be released",
    date: "2026-10-07",
    time: "20:02",
    url: "https://www.ft.com/content/2761b6af-df11-49e8-a348-792a9597c9af",
  },
  {
    id: "2761b6af-df11-49e8-a348-792a9597c9af",
    title: "Diesel price jumps after IEA says no additional fuel will be released",
    date: "2026-10-07",
    time: "20:02",
    url: "https://www.ft.com/content/2761b6af-df11-49e8-a348-792a9597c9af",
  },
  {
    id: "404bfe74-3778-4acc-8a01-329a6744b078",
    title: "Marco Rubio urges western countries to uphold traditional values",
    date: "2026-10-07",
    time: "19:55",
    url: "https://www.ft.com/content/404bfe74-3778-4acc-8a01-329a6744b078",
  },
  {
    id: "404bfe74-3778-4acc-8a01-329a6744b078",
    title: "Marco Rubio urges western countries to uphold traditional values",
    date: "2026-10-07",
    time: "19:55",
    url: "https://www.ft.com/content/404bfe74-3778-4acc-8a01-329a6744b078",
  },
  {
    id: "4f2417d3-3de6-4f62-bd3a-8c8f740a4b29",
    title: "SpaceX credit risk jumps on worries over its borrowing spree",
    date: "2026-10-07",
    time: "19:05",
    url: "https://www.ft.com/content/4f2417d3-3de6-4f62-bd3a-8c8f740a4b29",
  },
  {
    id: "1aa5c0f1-962d-4164-a375-74ac4bdd9d25",
    title: "Tory inheritance tax pledge: do the sums add up?",
    date: "2026-10-07",
    time: "18:58",
    url: "https://www.ft.com/content/1aa5c0f1-962d-4164-a375-74ac4bdd9d25",
  },
  {
    id: "b52c8acc-7ea5-4bd0-b26a-b9956e19867b",
    title: "London hedge fund Arini falls 16 per cent on soured credit bets",
    date: "2026-10-07",
    time: "18:33",
    url: "https://www.ft.com/content/b52c8acc-7ea5-4bd0-b26a-b9956e19867b",
  },
  {
    id: "7380c978-9b65-4a07-8ce3-bdf88f2484d1",
    title: "Kirkland & Ellis to stop disclosing financial performance",
    date: "2026-10-07",
    time: "18:30",
    url: "https://www.ft.com/content/7380c978-9b65-4a07-8ce3-bdf88f2484d1",
  },
  {
    id: "d72a1a53-4989-4e48-88e7-5ca467708823",
    title: "Chrysler Building taken over as New York luxury office market booms",
    date: "2026-10-07",
    time: "18:20",
    url: "https://www.ft.com/content/d72a1a53-4989-4e48-88e7-5ca467708823",
  },
  {
    id: "20557850-9cd1-4685-8238-f292023afc1f",
    title: "SEC warns asset managers against collaborating on activist campaigns",
    date: "2026-10-07",
    time: "18:07",
    url: "https://www.ft.com/content/20557850-9cd1-4685-8238-f292023afc1f",
  },
  {
    id: "21d4101f-ba5e-49e9-8c38-6b38ed5f1ca3",
    title: "Badenoch’s UK Conservatives are a work in progress",
    date: "2026-10-07",
    time: "18:00",
    url: "https://www.ft.com/content/21d4101f-ba5e-49e9-8c38-6b38ed5f1ca3",
  },
  {
    id: "32e1c801-fe7d-4389-b3fc-ab687cbb087b",
    title: "China slaps down EU request for voluntary curbs on hybrid car exports",
    date: "2026-10-07",
    time: "17:56",
    url: "https://www.ft.com/content/32e1c801-fe7d-4389-b3fc-ab687cbb087b",
  },
  {
    id: "8b9709f4-fc67-488d-ace6-8a5e2bcb775b",
    title: "London gold market body accused of causing deaths of two miners",
    date: "2026-10-07",
    time: "17:53",
    url: "https://www.ft.com/content/8b9709f4-fc67-488d-ace6-8a5e2bcb775b",
  },
  {
    id: "1f101722-bfb7-4872-b7d9-70039c981615",
    title: "Merz’s conservatives in new crisis over alleged support for AfD",
    date: "2026-10-07",
    time: "17:24",
    url: "https://www.ft.com/content/1f101722-bfb7-4872-b7d9-70039c981615",
  },
  {
    id: "870ed142-0418-4685-9347-d8c0caacdc58",
    title: "Australian court ruling on climate impact of coal mining a ‘blow’, says industry",
    date: "2026-10-07",
    time: "16:59",
    url: "https://www.ft.com/content/870ed142-0418-4685-9347-d8c0caacdc58",
  },
  {
    id: "5465abcc-4c04-4cee-a0bc-455a63533480",
    title: "Israelis commemorate October 7 attack as election looms",
    date: "2026-10-07",
    time: "16:56",
    url: "https://www.ft.com/content/5465abcc-4c04-4cee-a0bc-455a63533480",
  },
  {
    id: "b07bd481-a492-4b95-af55-914176f8d2b6",
    title: "The important judgments for Healey in the coming Budget",
    date: "2026-10-07",
    time: "16:06",
    url: "https://www.ft.com/content/b07bd481-a492-4b95-af55-914176f8d2b6",
  },
  {
    id: "742f1f44-1b5f-4905-8a09-1c14bce54b4d",
    title: "Kemi Badenoch promises to scrap inheritance tax on family homes",
    date: "2026-10-07",
    time: "16:03",
    url: "https://www.ft.com/content/742f1f44-1b5f-4905-8a09-1c14bce54b4d",
  },
];
