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
    id: "31c97a5c-b312-46dd-b6fa-b507e9f18a63",
    title: "Andy Burnham reverses much of plan to scrap jury trials",
    date: "2026-10-04",
    time: "00:01",
    url: "https://www.ft.com/content/31c97a5c-b312-46dd-b6fa-b507e9f18a63",
  },
  {
    id: "82ceae35-e3ef-4b68-8cfa-553b205a4bb0",
    title: "Tories vow to scrap £100,000 ‘tax trap’ for UK’s higher earners",
    date: "2026-10-03",
    time: "22:00",
    url: "https://www.ft.com/content/82ceae35-e3ef-4b68-8cfa-553b205a4bb0",
  },
  {
    id: "b119a81f-2347-4ba8-8b5f-13b380cf45fa",
    title: "Temu’s UK sales more than double to $171mn",
    date: "2026-10-03",
    time: "14:54",
    url: "https://www.ft.com/content/b119a81f-2347-4ba8-8b5f-13b380cf45fa",
  },
  {
    id: "05fd286f-6fac-4479-b560-848970f32af5",
    title: "Two Iranian small-boat migrants charged with plotting attack on Jewish targets in Manchester",
    date: "2026-10-03",
    time: "13:24",
    url: "https://www.ft.com/content/05fd286f-6fac-4479-b560-848970f32af5",
  },
  {
    id: "e884e8f3-ad16-48a9-af41-29d3122f7d76",
    title: "The town where 94% voted for Lula — and some now waver",
    date: "2026-10-03",
    time: "12:00",
    url: "https://www.ft.com/content/e884e8f3-ad16-48a9-af41-29d3122f7d76",
  },
  {
    id: "bae0af94-f42d-47d1-a1a8-fab608e75a72",
    title: "China launches anti-dumping probe into European chemical exports",
    date: "2026-10-03",
    time: "11:16",
    url: "https://www.ft.com/content/bae0af94-f42d-47d1-a1a8-fab608e75a72",
  },
  {
    id: "dbe6ccee-e8db-442e-ac0e-210ca74eb5c4",
    title: "Europe Express: Lies and statistics",
    date: "2026-10-03",
    time: "11:00",
    url: "https://www.ft.com/content/dbe6ccee-e8db-442e-ac0e-210ca74eb5c4",
  },
  {
    id: "f212d7b9-95e0-4aa0-84bf-4df7b43bc80a",
    title: "Chart of the Week: What’s driving the global bond sell-off?",
    date: "2026-10-03",
    time: "10:30",
    url: "https://www.ft.com/content/f212d7b9-95e0-4aa0-84bf-4df7b43bc80a",
  },
  {
    id: "5703d3c2-26f5-4472-91be-bf8cfdc11a75",
    title: "Manchester City’s fightback begins",
    date: "2026-10-03",
    time: "09:00",
    url: "https://www.ft.com/content/5703d3c2-26f5-4472-91be-bf8cfdc11a75",
  },
  {
    id: "678d61ea-d3f6-467f-a2b0-ffc78f1ed922",
    title: "Capital gains tax rise would deter equity investors, wealth bosses warn",
    date: "2026-10-03",
    time: "05:23",
    url: "https://www.ft.com/content/678d61ea-d3f6-467f-a2b0-ffc78f1ed922",
  },
  {
    id: "437ca3f0-9db4-4511-a441-ab7763d8f65c",
    title: "The right and wrong lessons to learn from Spain’s housing crisis",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/437ca3f0-9db4-4511-a441-ab7763d8f65c",
  },
  {
    id: "17a502a2-f8cb-4d79-996e-f2c7018585de",
    title: "Rising gilt yields attract retail investors hunting for tax-efficient assets",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/17a502a2-f8cb-4d79-996e-f2c7018585de",
  },
  {
    id: "3d4354d0-7273-49c3-89ce-38dcabd6bd7b",
    title: "Does the EU want Britain back?",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/3d4354d0-7273-49c3-89ce-38dcabd6bd7b",
  },
  {
    id: "156ecdf6-9379-48d6-b30f-becfb6b235ff",
    title: "Struggle to handle Fairford plot shows need for reform, local police chief says",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/156ecdf6-9379-48d6-b30f-becfb6b235ff",
  },
  {
    id: "5501a0c6-7d1e-4c1f-acc7-3b928e1f664a",
    title: "Volodymyr Zelenskyy asked Donald Trump to block Russia and China’s Starlink rival",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/5501a0c6-7d1e-4c1f-acc7-3b928e1f664a",
  },
  {
    id: "864aeb96-e36a-4cea-b914-7996b763dbe4",
    title: "The ever-shrinking case for expanding Heathrow",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/864aeb96-e36a-4cea-b914-7996b763dbe4",
  },
  {
    id: "a1815bc5-b5d5-47ff-bbbc-e1a689929321",
    title: "The coming futures market in AI compute",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/a1815bc5-b5d5-47ff-bbbc-e1a689929321",
  },
  {
    id: "65860150-c590-425a-822d-c1d015a4d44e",
    title: "Record 12,000 complaints made against Lasting Powers of Attorney",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/65860150-c590-425a-822d-c1d015a4d44e",
  },
  {
    id: "4e6a9004-fa0d-4b2e-a0a1-d4bc82411754",
    title: "A senate race runs through the Maine woods",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/4e6a9004-fa0d-4b2e-a0a1-d4bc82411754",
  },
  {
    id: "8869caf9-3cd1-4300-aeb3-828a4d9da4f9",
    title: "China, America and the new Great Game",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/8869caf9-3cd1-4300-aeb3-828a4d9da4f9",
  },
  {
    id: "a752a765-8b64-41a5-b051-5237957e13c1",
    title: "Dethroning FICO won’t much help US homeowners",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/a752a765-8b64-41a5-b051-5237957e13c1",
  },
  {
    id: "782f81e4-7eac-4791-b478-c142119a7ebb",
    title: "Who let the dogs out? Please put them back",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/782f81e4-7eac-4791-b478-c142119a7ebb",
  },
  {
    id: "b50f39c6-4484-4c06-89cb-2884f9e58bd7",
    title: "Protests from the City about bank tax ring hollow",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/b50f39c6-4484-4c06-89cb-2884f9e58bd7",
  },
  {
    id: "cc8ac63c-9b03-4efc-b9e5-b90f513ba565",
    title: "SkyNet satellite battle tests UK pledge to ‘buy British’",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/cc8ac63c-9b03-4efc-b9e5-b90f513ba565",
  },
  {
    id: "ac1f4db2-54fe-4a36-b3db-bb96675231f5",
    title: "Polymarket’s Alpha traders",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/ac1f4db2-54fe-4a36-b3db-bb96675231f5",
  },
  {
    id: "887e90a5-8456-4eba-9ed0-205c873d4846",
    title: "US justice department will not reopen criminal probe of Fed’s Jay Powell",
    date: "2026-10-02",
    time: "22:03",
    url: "https://www.ft.com/content/887e90a5-8456-4eba-9ed0-205c873d4846",
  },
  {
    id: "9df55c2e-e9c8-4a5a-a025-99fb459721d3",
    title: "Healey set to delay difficult choices with ‘breathing space’ UK Budget",
    date: "2026-10-02",
    time: "21:41",
    url: "https://www.ft.com/content/9df55c2e-e9c8-4a5a-a025-99fb459721d3",
  },
  {
    id: "2e0eb698-d4d3-4bcc-927a-2997df7709be",
    title: "Arctic sea routes boom as Gulf war and global warming divert shipping",
    date: "2026-10-02",
    time: "21:00",
    url: "https://www.ft.com/content/2e0eb698-d4d3-4bcc-927a-2997df7709be",
  },
  {
    id: "538ea132-4021-4095-8da3-9db41d42b19d",
    title: "Ann Widdecombe murder suspect charged with preparing terror acts against Nigel Farage",
    date: "2026-10-02",
    time: "20:47",
    url: "https://www.ft.com/content/538ea132-4021-4095-8da3-9db41d42b19d",
  },
  {
    id: "c89a552e-4720-47ae-9f0d-e9ff85b36dd9",
    title: "October fall",
    date: "2026-10-02",
    time: "20:07",
    url: "https://www.ft.com/content/c89a552e-4720-47ae-9f0d-e9ff85b36dd9",
  },
  {
    id: "7a91fa6b-e908-4a28-b04f-02d5a10a6bb1",
    title: "‘Amateurism and organisation’: Iran’s potential role in RAF Fairford incident",
    date: "2026-10-02",
    time: "19:44",
    url: "https://www.ft.com/content/7a91fa6b-e908-4a28-b04f-02d5a10a6bb1",
  },
  {
    id: "17762862-bdb7-44d0-a0d0-d2285bedbd2d",
    title: "Low-profile hedge fund smashes record for New York office rent",
    date: "2026-10-02",
    time: "19:31",
    url: "https://www.ft.com/content/17762862-bdb7-44d0-a0d0-d2285bedbd2d",
  },
  {
    id: "f4d387cb-f6a6-40b2-b9ac-52991872e21b",
    title: "Stockpickers: AG Barr, Redcentric, Saga",
    date: "2026-10-02",
    time: "18:00",
    url: "https://www.ft.com/content/f4d387cb-f6a6-40b2-b9ac-52991872e21b",
  },
  {
    id: "7128ce19-5ea0-4d5d-9d47-1270404831a7",
    title: "Treasuries are losing their moneyness",
    date: "2026-10-02",
    time: "18:00",
    url: "https://www.ft.com/content/7128ce19-5ea0-4d5d-9d47-1270404831a7",
  },
  {
    id: "4f2ad4c1-22b0-497b-88c8-197d7f301f79",
    title: "Global bond market steadies after sharp sell-off",
    date: "2026-10-02",
    time: "17:45",
    url: "https://www.ft.com/content/4f2ad4c1-22b0-497b-88c8-197d7f301f79",
  },
  {
    id: "bab346fd-7839-4812-ab27-19309e317938",
    title: "EU pushes Ukraine for further reforms to unlock funding",
    date: "2026-10-02",
    time: "17:31",
    url: "https://www.ft.com/content/bab346fd-7839-4812-ab27-19309e317938",
  },
  {
    id: "0889f36e-cbd6-4df5-a917-9fbb89071a7e",
    title: "How to meet Burnham’s ambitions on social care",
    date: "2026-10-02",
    time: "17:23",
    url: "https://www.ft.com/content/0889f36e-cbd6-4df5-a917-9fbb89071a7e",
  },
  {
    id: "38176237-e89f-410c-979c-c8c5d68d041a",
    title: "French schools burn as student unrest spreads",
    date: "2026-10-02",
    time: "17:21",
    url: "https://www.ft.com/content/38176237-e89f-410c-979c-c8c5d68d041a",
  },
  {
    id: "2c56ac58-87b2-4159-aa83-55567368149a",
    title: "The Ellison credit complex gets a bit more complex",
    date: "2026-10-02",
    time: "16:44",
    url: "https://www.ft.com/content/2c56ac58-87b2-4159-aa83-55567368149a",
  },
  {
    id: "68d4b1f2-5b77-4604-add3-2c4915b4b267",
    title: "Green leader Zack Polanski takes credit for UK sanctions on Israel but skirts anti-Zionism motion",
    date: "2026-10-02",
    time: "16:29",
    url: "https://www.ft.com/content/68d4b1f2-5b77-4604-add3-2c4915b4b267",
  },
];
