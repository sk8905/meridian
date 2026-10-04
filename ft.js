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
    id: "9737146d-fda7-440f-a77d-ab954de7a1a5",
    title: "AkzoNobel nears deal to sell its SE Asia decorative paint unit to Nippon Paint",
    date: "2026-10-04",
    time: "19:55",
    url: "https://www.ft.com/content/9737146d-fda7-440f-a77d-ab954de7a1a5",
  },
  {
    id: "d3b09a81-626c-406a-a568-40966ffad074",
    title: "Election season starts with possibly the most contentious result",
    date: "2026-10-04",
    time: "18:15",
    url: "https://www.ft.com/content/d3b09a81-626c-406a-a568-40966ffad074",
  },
  {
    id: "c608d956-22b7-4f23-a6fe-63f39c52c275",
    title: "Jewish groups attack Greens after anti-Zionism motion passes",
    date: "2026-10-04",
    time: "16:31",
    url: "https://www.ft.com/content/c608d956-22b7-4f23-a6fe-63f39c52c275",
  },
  {
    id: "1fd3b9f8-ac07-4a7c-b968-93fba8b3a978",
    title: "Burnham could learn a thing or two from Thatcher",
    date: "2026-10-04",
    time: "16:00",
    url: "https://www.ft.com/content/1fd3b9f8-ac07-4a7c-b968-93fba8b3a978",
  },
  {
    id: "3302fd5c-8b92-425b-9523-673b2565bb10",
    title: "Investors look to shelter portfolios from rising AI concentration risks",
    date: "2026-10-04",
    time: "13:00",
    url: "https://www.ft.com/content/3302fd5c-8b92-425b-9523-673b2565bb10",
  },
  {
    id: "a2711e64-145b-4df6-baf7-56a3da7ed0b0",
    title: "The US is looking more like Italy",
    date: "2026-10-04",
    time: "13:00",
    url: "https://www.ft.com/content/a2711e64-145b-4df6-baf7-56a3da7ed0b0",
  },
  {
    id: "d2d5a5a5-758f-472f-a2c7-1684955b0087",
    title: "BT weighs improved TalkTalk offer after initial approach rejected",
    date: "2026-10-04",
    time: "12:03",
    url: "https://www.ft.com/content/d2d5a5a5-758f-472f-a2c7-1684955b0087",
  },
  {
    id: "a984ca27-786a-47be-a8b9-9d48201a9e7c",
    title: "In defence of big business",
    date: "2026-10-04",
    time: "12:00",
    url: "https://www.ft.com/content/a984ca27-786a-47be-a8b9-9d48201a9e7c",
  },
  {
    id: "9e9f0cbd-ef77-4e19-8f6e-97063e9fe9fc",
    title: "EU countries shoot themselves in the foot when they veto sanctions",
    date: "2026-10-04",
    time: "12:00",
    url: "https://www.ft.com/content/9e9f0cbd-ef77-4e19-8f6e-97063e9fe9fc",
  },
  {
    id: "2c24ece3-ac99-43a8-b0e6-4a3867e37ebf",
    title: "Legal risks pile up for Altman as OpenAI uncovers dozens of hacks",
    date: "2026-10-04",
    time: "12:00",
    url: "https://www.ft.com/content/2c24ece3-ac99-43a8-b0e6-4a3867e37ebf",
  },
  {
    id: "1a94931f-421e-4d0e-888a-7727f15c3d5f",
    title: "What can revive the battered government bond market?",
    date: "2026-10-04",
    time: "12:00",
    url: "https://www.ft.com/content/1a94931f-421e-4d0e-888a-7727f15c3d5f",
  },
  {
    id: "dfa07e3f-5557-46ba-8128-72f43aa6558d",
    title: "Britain’s Budget needs to tame spending and boost growth",
    date: "2026-10-04",
    time: "11:00",
    url: "https://www.ft.com/content/dfa07e3f-5557-46ba-8128-72f43aa6558d",
  },
  {
    id: "8b7e2800-3e36-4d0c-9016-32deaae67b62",
    title: "Why the IPO market is booming and busting",
    date: "2026-10-04",
    time: "10:29",
    url: "https://www.ft.com/content/8b7e2800-3e36-4d0c-9016-32deaae67b62",
  },
  {
    id: "259b49a1-8eda-4e8d-84c7-45323988b07b",
    title: "Sahel juntas launch TV channel with Russian backing",
    date: "2026-10-04",
    time: "10:24",
    url: "https://www.ft.com/content/259b49a1-8eda-4e8d-84c7-45323988b07b",
  },
  {
    id: "9cbc0aea-259a-41eb-bbf4-ad8a674ca8b7",
    title: "US to receive potash shipment from Belarus as relations thaw",
    date: "2026-10-04",
    time: "10:00",
    url: "https://www.ft.com/content/9cbc0aea-259a-41eb-bbf4-ad8a674ca8b7",
  },
  {
    id: "9972c7fa-ebed-4c0c-8ff6-17e66a547394",
    title: "Lula and Flávio Bolsonaro neck-and-neck as Brazilians head to polls",
    date: "2026-10-04",
    time: "10:00",
    url: "https://www.ft.com/content/9972c7fa-ebed-4c0c-8ff6-17e66a547394",
  },
  {
    id: "b7bd5c45-1c32-4984-af37-21746a02c4ef",
    title: "Germany’s Merz arrives in Kyiv to show support for Ukraine",
    date: "2026-10-04",
    time: "07:12",
    url: "https://www.ft.com/content/b7bd5c45-1c32-4984-af37-21746a02c4ef",
  },
  {
    id: "b8924d77-364b-46c1-b783-5db73a91f351",
    title: "Wall Street’s IPO fervour cools on tepid demand and valuation worries",
    date: "2026-10-04",
    time: "05:01",
    url: "https://www.ft.com/content/b8924d77-364b-46c1-b783-5db73a91f351",
  },
  {
    id: "ac73c2aa-4998-4da4-bab0-d511f79d7559",
    title: "Andy Burnham and the art of corporate pitch-rolling",
    date: "2026-10-04",
    time: "05:00",
    url: "https://www.ft.com/content/ac73c2aa-4998-4da4-bab0-d511f79d7559",
  },
  {
    id: "3401e229-1728-4a33-82d5-e52a4cd993c1",
    title: "Bosnia elections pit EU hopes against Russian influence",
    date: "2026-10-04",
    time: "05:00",
    url: "https://www.ft.com/content/3401e229-1728-4a33-82d5-e52a4cd993c1",
  },
  {
    id: "9b3a355e-5975-445f-9004-b95513e3856a",
    title: "Masayoshi Son’s AI ambitions outgrow SoftBank’s balance sheet",
    date: "2026-10-04",
    time: "05:00",
    url: "https://www.ft.com/content/9b3a355e-5975-445f-9004-b95513e3856a",
  },
  {
    id: "74e70f0c-3788-4343-93d7-9c8740ee28b6",
    title: "How 60,000 Polish number plates exposed Italy’s tax allergy",
    date: "2026-10-04",
    time: "05:00",
    url: "https://www.ft.com/content/74e70f0c-3788-4343-93d7-9c8740ee28b6",
  },
  {
    id: "dc69b53e-80f1-46ff-826c-f4b2f5d75873",
    title: "Are Deliveroo riders really self-employed? Labour wants to change the test",
    date: "2026-10-04",
    time: "05:00",
    url: "https://www.ft.com/content/dc69b53e-80f1-46ff-826c-f4b2f5d75873",
  },
  {
    id: "25272ffd-fd7e-4a69-97b3-cfcb3f98e646",
    title: "Google set to defend £1.2bn UK lawsuit over ‘excessive’ app download charges",
    date: "2026-10-04",
    time: "05:00",
    url: "https://www.ft.com/content/25272ffd-fd7e-4a69-97b3-cfcb3f98e646",
  },
  {
    id: "8a8f5c97-f1d3-4d3d-a3bc-d5a2e5539177",
    title: "China closes hundreds of banks to bolster financial system",
    date: "2026-10-04",
    time: "03:00",
    url: "https://www.ft.com/content/8a8f5c97-f1d3-4d3d-a3bc-d5a2e5539177",
  },
  {
    id: "ea32c53d-4de7-4b34-af44-cc148b23433f",
    title: "Japanese and Korean shipbuilders deploy robots to take on China",
    date: "2026-10-04",
    time: "02:00",
    url: "https://www.ft.com/content/ea32c53d-4de7-4b34-af44-cc148b23433f",
  },
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
];
