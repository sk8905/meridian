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
    id: "79bcc1f3-954a-4c62-96c6-989b1384b9f3",
    title: "Pedro Sánchez loses vote on Spanish housing reform",
    date: "2026-10-02",
    time: "15:57",
    url: "https://www.ft.com/content/79bcc1f3-954a-4c62-96c6-989b1384b9f3",
  },
  {
    id: "d2f01dd2-2fde-4d3b-aff0-f82aa9e05296",
    title: "Italy and Greece seek leeway on EU fiscal rules",
    date: "2026-10-02",
    time: "15:07",
    url: "https://www.ft.com/content/d2f01dd2-2fde-4d3b-aff0-f82aa9e05296",
  },
  {
    id: "906051fc-c116-4803-b395-2d56d1bcbf28",
    title: "Weak US payrolls  likely to keep rate setters on the sidelines in October",
    date: "2026-10-02",
    time: "15:01",
    url: "https://www.ft.com/content/906051fc-c116-4803-b395-2d56d1bcbf28",
  },
  {
    id: "78ed6ae8-1948-4259-be3e-0b3fe4af3663",
    title: "Tesla deliveries fall 2% as US consumers buy fewer electric vehicles",
    date: "2026-10-02",
    time: "14:23",
    url: "https://www.ft.com/content/78ed6ae8-1948-4259-be3e-0b3fe4af3663",
  },
  {
    id: "db7af59f-d434-498c-a460-4f7ed2fa6abd",
    title: "Obama’s red herring",
    date: "2026-10-02",
    time: "14:00",
    url: "https://www.ft.com/content/db7af59f-d434-498c-a460-4f7ed2fa6abd",
  },
  {
    id: "4d0293d8-2f50-4f33-8fa3-702e48df0386",
    title: "I’m even more bullish about stocks than a year ago",
    date: "2026-10-02",
    time: "13:52",
    url: "https://www.ft.com/content/4d0293d8-2f50-4f33-8fa3-702e48df0386",
  },
  {
    id: "7fc80097-1926-4306-81e0-83d90a3d8a1d",
    title: "US economy adds just 29,000 jobs in September as hiring slows sharply",
    date: "2026-10-02",
    time: "13:47",
    url: "https://www.ft.com/content/7fc80097-1926-4306-81e0-83d90a3d8a1d",
  },
  {
    id: "29e2d078-4476-41f2-a180-faf0b2001068",
    title: "US sanctions Kremlin-backed fintech A7 for allegedly assisting Iran",
    date: "2026-10-02",
    time: "13:19",
    url: "https://www.ft.com/content/29e2d078-4476-41f2-a180-faf0b2001068",
  },
  {
    id: "64d54c96-0124-45d0-842c-587ab0641ee2",
    title: "Gold miner M&A is finally producing something that glitters",
    date: "2026-10-02",
    time: "13:01",
    url: "https://www.ft.com/content/64d54c96-0124-45d0-842c-587ab0641ee2",
  },
  {
    id: "10d99379-b576-46c0-afe6-70c6e2059456",
    title: "Partners Group splits flagship private equity fund as clients demand cash",
    date: "2026-10-02",
    time: "13:00",
    url: "https://www.ft.com/content/10d99379-b576-46c0-afe6-70c6e2059456",
  },
  {
    id: "929714e8-4ac1-436a-96d0-f81c09864d14",
    title: "Stand-off over Protestant march pushes Northern Ireland politics to the brink",
    date: "2026-10-02",
    time: "12:48",
    url: "https://www.ft.com/content/929714e8-4ac1-436a-96d0-f81c09864d14",
  },
  {
    id: "93028839-5f0e-43c4-8ee7-44990115ea57",
    title: "Investors seek refuge from bond rout in haven German debt",
    date: "2026-10-02",
    time: "12:35",
    url: "https://www.ft.com/content/93028839-5f0e-43c4-8ee7-44990115ea57",
  },
  {
    id: "267c7c7e-6596-4ee9-85eb-a0dce1c26f5e",
    title: "Kemi Badenoch: ‘I refuse to play by Westminster rules’",
    date: "2026-10-02",
    time: "12:30",
    url: "https://www.ft.com/content/267c7c7e-6596-4ee9-85eb-a0dce1c26f5e",
  },
  {
    id: "9f960533-9cd7-4475-aed0-17f09fdc28fd",
    title: "My mortgage is a problem for the Fed, and for America",
    date: "2026-10-02",
    time: "12:09",
    url: "https://www.ft.com/content/9f960533-9cd7-4475-aed0-17f09fdc28fd",
  },
  {
    id: "c77b86cb-a915-412e-89d9-52cfc32cdc80",
    title: "Australia’s ‘postcard from the future’ of big batteries",
    date: "2026-10-02",
    time: "12:00",
    url: "https://www.ft.com/content/c77b86cb-a915-412e-89d9-52cfc32cdc80",
  },
  {
    id: "97200b07-755c-40ce-a50b-b51666bd4b7e",
    title: "Diesel falls sharply as EU considers releasing 50mn barrels under pressure from Trump",
    date: "2026-10-02",
    time: "11:59",
    url: "https://www.ft.com/content/97200b07-755c-40ce-a50b-b51666bd4b7e",
  },
  {
    id: "7f6ccd9a-5846-415d-9967-e1501fb7a6d6",
    title: "Gunvor rebrands in new attempt to distance itself from past Russia links",
    date: "2026-10-02",
    time: "11:13",
    url: "https://www.ft.com/content/7f6ccd9a-5846-415d-9967-e1501fb7a6d6",
  },
  {
    id: "e637cd4c-415d-431c-a857-95d6adc33157",
    title: "Higher Eurozone inflation adds pressure on ECB to tighten again",
    date: "2026-10-02",
    time: "11:11",
    url: "https://www.ft.com/content/e637cd4c-415d-431c-a857-95d6adc33157",
  },
  {
    id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2",
    title: "Inflation and interest rates tracker: see how your country compares",
    date: "2026-10-02",
    time: "10:49",
    url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2",
  },
  {
    id: "6394fdc7-5fa5-4ec3-8bde-52633acd2b57",
    title: "Eurozone inflation hits three-year high of 3.8%",
    date: "2026-10-02",
    time: "10:01",
    url: "https://www.ft.com/content/6394fdc7-5fa5-4ec3-8bde-52633acd2b57",
  },
  {
    id: "3f5483d1-31d7-4756-95a0-ce4a2c600519",
    title: "Goldman Sachs bought Shein shares worth $220mn after dismal IPO",
    date: "2026-10-02",
    time: "09:32",
    url: "https://www.ft.com/content/3f5483d1-31d7-4756-95a0-ce4a2c600519",
  },
  {
    id: "62f754e7-aeee-4ab4-9a6f-d3def374b593",
    title: "The Burnham tell",
    date: "2026-10-02",
    time: "09:30",
    url: "https://www.ft.com/content/62f754e7-aeee-4ab4-9a6f-d3def374b593",
  },
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
];
