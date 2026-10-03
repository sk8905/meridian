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
    id: "5703d3c2-26f5-4472-91be-bf8cfdc11a75",
    title: "Manchester City’s fightback begins",
    date: "2026-10-03",
    time: "09:00",
    url: "https://www.ft.com/content/5703d3c2-26f5-4472-91be-bf8cfdc11a75",
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
    id: "678d61ea-d3f6-467f-a2b0-ffc78f1ed922",
    title: "CGT rise would deter equity investors, wealth bosses warn",
    date: "2026-10-03",
    time: "05:00",
    url: "https://www.ft.com/content/678d61ea-d3f6-467f-a2b0-ffc78f1ed922",
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
    id: "05fd286f-6fac-4479-b560-848970f32af5",
    title: "Two Iranian small-boat migrants charged with plotting attack on Jewish targets in Manchester",
    date: "2026-10-02",
    time: "22:56",
    url: "https://www.ft.com/content/05fd286f-6fac-4479-b560-848970f32af5",
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
  {
    id: "75b0ab84-a252-4ea1-9058-c9ee7ca07f4f",
    title: "Quant hedge funds reap big gains from global bond sell-off",
    date: "2026-10-02",
    time: "16:13",
    url: "https://www.ft.com/content/75b0ab84-a252-4ea1-9058-c9ee7ca07f4f",
  },
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
    id: "8b81e04b-917f-4dda-ac05-83067f7687b1",
    title: "Paris Fashion Week confronts luxury’s crisis of desire",
    date: "2026-10-02",
    time: "13:42",
    url: "https://www.ft.com/content/8b81e04b-917f-4dda-ac05-83067f7687b1",
  },
];
