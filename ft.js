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
    id: "c7f6d036-abd4-4d8c-a6c8-6dad96cf9fae",
    title: "Shares in spreadbetter IG Group plunge 26%",
    date: "2026-10-02",
    time: "08:34",
    url: "https://www.ft.com/content/c7f6d036-abd4-4d8c-a6c8-6dad96cf9fae",
  },
  {
    id: "e46df108-025d-4326-9774-010ab84f2c9b",
    title: "UK watchdog signals it may block major broadband deal",
    date: "2026-10-02",
    time: "08:16",
    url: "https://www.ft.com/content/e46df108-025d-4326-9774-010ab84f2c9b",
  },
  {
    id: "fcbd4c0f-41cf-440a-b386-5e6c61395b71",
    title: "Donald Quintin: ‘We’re entering a different market now’",
    date: "2026-10-02",
    time: "06:30",
    url: "https://www.ft.com/content/fcbd4c0f-41cf-440a-b386-5e6c61395b71",
  },
  {
    id: "13fa2121-bca2-4c0b-957d-b12b806fdf08",
    title: "FTAV’s further reading",
    date: "2026-10-02",
    time: "06:30",
    url: "https://www.ft.com/content/13fa2121-bca2-4c0b-957d-b12b806fdf08",
  },
  {
    id: "4f2ad4c1-22b0-497b-88c8-197d7f301f79",
    title: "Global bond market steadies after sharp sell-off",
    date: "2026-10-02",
    time: "06:09",
    url: "https://www.ft.com/content/4f2ad4c1-22b0-497b-88c8-197d7f301f79",
  },
  {
    id: "71a2ec5f-3f28-4462-af96-bab58c86a777",
    title: "Pro-Russian parties jostle with Kyiv supporters in crowded Latvian election",
    date: "2026-10-02",
    time: "06:00",
    url: "https://www.ft.com/content/71a2ec5f-3f28-4462-af96-bab58c86a777",
  },
  {
    id: "56b239fb-3c85-4b8e-a274-d028d3b153a0",
    title: "FirstFT: Putin has told military to abandon rules of war, Zelenskyy says",
    date: "2026-10-02",
    time: "05:31",
    url: "https://www.ft.com/content/56b239fb-3c85-4b8e-a274-d028d3b153a0",
  },
  {
    id: "83e9a7cb-95b4-48a8-9cdc-88d3fa8f03c0",
    title: "Black voters rally against new electoral maps in the US South",
    date: "2026-10-02",
    time: "05:15",
    url: "https://www.ft.com/content/83e9a7cb-95b4-48a8-9cdc-88d3fa8f03c0",
  },
  {
    id: "f776933e-3566-4171-a1e1-a8486dc88c83",
    title: "Meet Man City’s powerbroker",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/f776933e-3566-4171-a1e1-a8486dc88c83",
  },
  {
    id: "b33a6f40-71fe-430d-a130-25f5f841aeb9",
    title: "UK universities comb records for China links after MI5 warning",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/b33a6f40-71fe-430d-a130-25f5f841aeb9",
  },
  {
    id: "57de6604-70a9-413a-a381-9ba82ec202ec",
    title: "Monzo courts private equity after Nubank walks away",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/57de6604-70a9-413a-a381-9ba82ec202ec",
  },
  {
    id: "b72dc264-c1ce-4752-ab99-3c2dab6bfb15",
    title: "IPO hopeful Zilch needs to prove it’s one of a kind",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/b72dc264-c1ce-4752-ab99-3c2dab6bfb15",
  },
  {
    id: "97d8d346-519e-48fb-8df8-66cf5f12ef62",
    title: "Amazon seeks to offload $8bn of Nvidia chips to investors",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/97d8d346-519e-48fb-8df8-66cf5f12ef62",
  },
  {
    id: "c2ad4cd1-a08a-4f55-8d57-fa83dbfa98af",
    title: "Putin has told military leaders to abandon rules of war, Zelenskyy says",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/c2ad4cd1-a08a-4f55-8d57-fa83dbfa98af",
  },
  {
    id: "38176237-e89f-410c-979c-c8c5d68d041a",
    title: "French high schools burn as student unrest spreads",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/38176237-e89f-410c-979c-c8c5d68d041a",
  },
  {
    id: "1b5ddda2-ac55-4d66-8bf4-bce62b80450d",
    title: "Paramount picked a bad time to fund a $110bn leveraged buyout",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/1b5ddda2-ac55-4d66-8bf4-bce62b80450d",
  },
  {
    id: "249abfea-3275-40d0-ab98-306b225cbc02",
    title: "Zack Polanski faces defining week as UK’s Green surge falters",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/249abfea-3275-40d0-ab98-306b225cbc02",
  },
  {
    id: "75b0ab84-a252-4ea1-9058-c9ee7ca07f4f",
    title: "Quant hedge funds reap big gains from global bond sell-off",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/75b0ab84-a252-4ea1-9058-c9ee7ca07f4f",
  },
  {
    id: "800a3c22-836f-4cb1-a4d1-f922d2d7e23a",
    title: "Hungary’s new government goes after Viktor Orbán",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/800a3c22-836f-4cb1-a4d1-f922d2d7e23a",
  },
  {
    id: "232eac57-80af-4b06-ac48-7346c3df669d",
    title: "UK ministers resist union demands to rescue Scottish steelmaker",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/232eac57-80af-4b06-ac48-7346c3df669d",
  },
  {
    id: "3ae16f02-bb00-46a4-abba-6bfea7f2b1ac",
    title: "Trump’s diesel threats could go very wrong — just look at the soyabean",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/3ae16f02-bb00-46a4-abba-6bfea7f2b1ac",
  },
  {
    id: "cf4ee5e7-3690-489e-9879-599fa43d8dec",
    title: "Directors’ Deals: Entain’s new finance chief builds stake",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/cf4ee5e7-3690-489e-9879-599fa43d8dec",
  },
  {
    id: "118785e7-8637-46ad-a60c-286e51370848",
    title: "US refiners reap windfall profits as wars push up fuel prices for consumers",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/118785e7-8637-46ad-a60c-286e51370848",
  },
  {
    id: "14e6933e-20ce-40be-80fd-c2f0b11450e9",
    title: "What can Burnham learn from Scotland’s social care system?",
    date: "2026-10-02",
    time: "05:00",
    url: "https://www.ft.com/content/14e6933e-20ce-40be-80fd-c2f0b11450e9",
  },
  {
    id: "29e2d078-4476-41f2-a180-faf0b2001068",
    title: "US sanctions Kremlin-backed fintech A7 for allegedly assisting Iran",
    date: "2026-10-01",
    time: "22:20",
    url: "https://www.ft.com/content/29e2d078-4476-41f2-a180-faf0b2001068",
  },
  {
    id: "08eeee4a-903b-4889-92ef-61ebaeea682a",
    title: "Nike to cut jobs as it forecasts revenue decline in the coming year",
    date: "2026-10-01",
    time: "22:11",
    url: "https://www.ft.com/content/08eeee4a-903b-4889-92ef-61ebaeea682a",
  },
  {
    id: "352e14c5-267d-4c8f-981d-6ae8bea531f9",
    title: "US deploys thousands of troops to Middle East as Donald Trump weighs strikes on Iran",
    date: "2026-10-01",
    time: "22:05",
    url: "https://www.ft.com/content/352e14c5-267d-4c8f-981d-6ae8bea531f9",
  },
  {
    id: "e567ed25-d871-44ac-ad39-aee135eeb6d6",
    title: "Investigative outlet deepens antisemitism claims against French far right’s Jordan Bardella",
    date: "2026-10-01",
    time: "21:46",
    url: "https://www.ft.com/content/e567ed25-d871-44ac-ad39-aee135eeb6d6",
  },
  {
    id: "9a6e17fe-55e4-4a6d-8761-8346ec765ba9",
    title: "Andy Burnham searches for UK alternative to Palantir",
    date: "2026-10-01",
    time: "21:00",
    url: "https://www.ft.com/content/9a6e17fe-55e4-4a6d-8761-8346ec765ba9",
  },
  {
    id: "22779c05-8bda-423e-b5bf-6839d597f499",
    title: "US mortgage rates jump the most in four years as bond sell-off hits Main Street",
    date: "2026-10-01",
    time: "19:29",
    url: "https://www.ft.com/content/22779c05-8bda-423e-b5bf-6839d597f499",
  },
  {
    id: "21f0822e-eb0b-4056-bcf2-2b6e2a14c221",
    title: "Bolivia arrests attorney-general after US accuses him of protecting drug traffickers",
    date: "2026-10-01",
    time: "19:28",
    url: "https://www.ft.com/content/21f0822e-eb0b-4056-bcf2-2b6e2a14c221",
  },
  {
    id: "04992c30-21da-46f3-8b95-ca82b2791521",
    title: "Europe braces for ‘severe hybrid attacks’ from Russia, says Merz",
    date: "2026-10-01",
    time: "18:54",
    url: "https://www.ft.com/content/04992c30-21da-46f3-8b95-ca82b2791521",
  },
  {
    id: "e3a53272-385d-40a8-ac77-408f4c136f6f",
    title: "Top Fed official signals central bank will keep rates on hold in October",
    date: "2026-10-01",
    time: "18:52",
    url: "https://www.ft.com/content/e3a53272-385d-40a8-ac77-408f4c136f6f",
  },
  {
    id: "a85c5d06-5f8d-4163-8cd6-e42df9f137cb",
    title: "British-Iranian man arrested under terror laws over RAF Fairford incident",
    date: "2026-10-01",
    time: "18:49",
    url: "https://www.ft.com/content/a85c5d06-5f8d-4163-8cd6-e42df9f137cb",
  },
  {
    id: "ed5aae75-e06b-49bc-8e96-6c596f88f2c7",
    title: "Ex-HSBC banker banned for dodging £5,900 in train fares",
    date: "2026-10-01",
    time: "18:31",
    url: "https://www.ft.com/content/ed5aae75-e06b-49bc-8e96-6c596f88f2c7",
  },
  {
    id: "a357ac2d-fead-4df2-a5cf-cf1aa94cf7a9",
    title: "Europe should take Trump’s diesel ban seriously, if not literally",
    date: "2026-10-01",
    time: "18:25",
    url: "https://www.ft.com/content/a357ac2d-fead-4df2-a5cf-cf1aa94cf7a9",
  },
  {
    id: "e7c1da68-aed3-471d-911f-0b6086a327ec",
    title: "France meets fiscal reality with a crunch",
    date: "2026-10-01",
    time: "18:05",
    url: "https://www.ft.com/content/e7c1da68-aed3-471d-911f-0b6086a327ec",
  },
  {
    id: "1206b356-e62b-4e18-9925-e8dd0a283fc4",
    title: "Tories criticise Burnham over support for Manchester City owners",
    date: "2026-10-01",
    time: "16:40",
    url: "https://www.ft.com/content/1206b356-e62b-4e18-9925-e8dd0a283fc4",
  },
  {
    id: "4b87328c-17da-484d-a92a-0f3582f76f02",
    title: "BT seeks government nod for potential TalkTalk takeover",
    date: "2026-10-01",
    time: "16:02",
    url: "https://www.ft.com/content/4b87328c-17da-484d-a92a-0f3582f76f02",
  },
  {
    id: "122e55bb-b0f9-4106-823d-ac2a435d96d9",
    title: "Dealmakers line up to test EU’s appetite to create European champions",
    date: "2026-10-01",
    time: "15:49",
    url: "https://www.ft.com/content/122e55bb-b0f9-4106-823d-ac2a435d96d9",
  },
];
