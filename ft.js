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
    id: "0f48c61b-a490-4bdc-8473-bab6705e5b61",
    title: "UK business secretary weighs up tariffs on Chinese EVs",
    date: "2026-10-05",
    time: "11:03",
    url: "https://www.ft.com/content/0f48c61b-a490-4bdc-8473-bab6705e5b61",
  },
  {
    id: "91741bbc-9626-41fc-8320-9ab9adbd8631",
    title: "A Chinese billionaire reckons with the limits of building AI across borders",
    date: "2026-10-05",
    time: "11:00",
    url: "https://www.ft.com/content/91741bbc-9626-41fc-8320-9ab9adbd8631",
  },
  {
    id: "7dea96bb-12ca-44fd-81c1-395fb8060395",
    title: "How the booming US healthcare economy is penalising patients",
    date: "2026-10-05",
    time: "11:00",
    url: "https://www.ft.com/content/7dea96bb-12ca-44fd-81c1-395fb8060395",
  },
  {
    id: "a3528806-c774-4dea-aec8-5415516a1365",
    title: "Norway is first to propose temporary ban on AI glasses in public places",
    date: "2026-10-05",
    time: "10:50",
    url: "https://www.ft.com/content/a3528806-c774-4dea-aec8-5415516a1365",
  },
  {
    id: "93ee425d-9ac7-4543-8cc9-fef2e0670787",
    title: "Nvidia’s $20bn licensing deal with Groq faces lawsuit from jilted engineers",
    date: "2026-10-05",
    time: "10:00",
    url: "https://www.ft.com/content/93ee425d-9ac7-4543-8cc9-fef2e0670787",
  },
  {
    id: "31a03cac-da1e-47ff-b261-e91f6d0b5e77",
    title: "Greens’ anti-Zionism motion narrows potential base of support",
    date: "2026-10-05",
    time: "09:51",
    url: "https://www.ft.com/content/31a03cac-da1e-47ff-b261-e91f6d0b5e77",
  },
  {
    id: "1ab64d24-0f32-4dc8-86b5-20d06e3b3588",
    title: "Brazil’s Bolsonaro dynasty closes in on stunning comeback",
    date: "2026-10-05",
    time: "09:49",
    url: "https://www.ft.com/content/1ab64d24-0f32-4dc8-86b5-20d06e3b3588",
  },
  {
    id: "7a00c5b9-62b5-4101-a5f0-ebf828dc6a90",
    title: "Former prince Andrew seeks judicial review of police searches",
    date: "2026-10-05",
    time: "09:38",
    url: "https://www.ft.com/content/7a00c5b9-62b5-4101-a5f0-ebf828dc6a90",
  },
  {
    id: "53e88a8d-65b5-445e-82ee-aee253a32094",
    title: "Saudi Aramco chief warns world’s oil stockpiles are ‘scarily thin’",
    date: "2026-10-05",
    time: "09:21",
    url: "https://www.ft.com/content/53e88a8d-65b5-445e-82ee-aee253a32094",
  },
  {
    id: "0d3884be-a2c4-4914-a0a2-f22af8ef3857",
    title: "Top Monte dei Paschi investor backs Intesa’s sweetened €34.5bn takeover bid",
    date: "2026-10-05",
    time: "09:11",
    url: "https://www.ft.com/content/0d3884be-a2c4-4914-a0a2-f22af8ef3857",
  },
  {
    id: "028da85c-0e1f-4f1b-ad04-eac78c4f18c0",
    title: "Flávio Bolsonaro takes commanding lead in Brazil election",
    date: "2026-10-05",
    time: "09:05",
    url: "https://www.ft.com/content/028da85c-0e1f-4f1b-ad04-eac78c4f18c0",
  },
  {
    id: "49526246-46ac-4154-942f-3d4d705f1652",
    title: "Sanae Takaichi tells markets to ‘rest assured’ over Japan’s spending plans",
    date: "2026-10-05",
    time: "08:24",
    url: "https://www.ft.com/content/49526246-46ac-4154-942f-3d4d705f1652",
  },
  {
    id: "866dea03-4cee-4009-b130-6f7a191336c4",
    title: "Spanish prime minister Pedro Sánchez calls snap election",
    date: "2026-10-05",
    time: "08:09",
    url: "https://www.ft.com/content/866dea03-4cee-4009-b130-6f7a191336c4",
  },
  {
    id: "8b19b9f7-9237-47bf-bc50-d8b78aa7fe24",
    title: "Euro tumbles to 17-month low against dollar",
    date: "2026-10-05",
    time: "06:30",
    url: "https://www.ft.com/content/8b19b9f7-9237-47bf-bc50-d8b78aa7fe24",
  },
  {
    id: "b26c324e-0384-4c6a-9ccd-56b1cf0939b8",
    title: "The jobs market is still fine",
    date: "2026-10-05",
    time: "06:30",
    url: "https://www.ft.com/content/b26c324e-0384-4c6a-9ccd-56b1cf0939b8",
  },
  {
    id: "98a0463f-f670-4c12-bd11-48121d670b28",
    title: "FTAV’s further reading",
    date: "2026-10-05",
    time: "06:30",
    url: "https://www.ft.com/content/98a0463f-f670-4c12-bd11-48121d670b28",
  },
  {
    id: "27d5abde-c1cd-4dc1-932f-4812a41a66c4",
    title: "BT closes in on deal for embattled TalkTalk",
    date: "2026-10-05",
    time: "06:11",
    url: "https://www.ft.com/content/27d5abde-c1cd-4dc1-932f-4812a41a66c4",
  },
  {
    id: "b6f7aa99-9672-479d-8e7c-c3d103204cc6",
    title: "Hungary set to drop veto on Ukraine and Moldova EU bid progress",
    date: "2026-10-05",
    time: "06:00",
    url: "https://www.ft.com/content/b6f7aa99-9672-479d-8e7c-c3d103204cc6",
  },
  {
    id: "61e4b54a-53f7-43a9-a5dc-d5a6359ba4b0",
    title: "Quant hedge funds win big from bond sell-off",
    date: "2026-10-05",
    time: "06:00",
    url: "https://www.ft.com/content/61e4b54a-53f7-43a9-a5dc-d5a6359ba4b0",
  },
  {
    id: "96184ef4-05be-467c-9d9c-745e21dad31a",
    title: "What’s really going on with AI token price deflation?",
    date: "2026-10-05",
    time: "06:00",
    url: "https://www.ft.com/content/96184ef4-05be-467c-9d9c-745e21dad31a",
  },
  {
    id: "6296da53-a9e3-4441-ae6d-f579b3c1b414",
    title: "Banks will lobby Healey for capital rules cut, says senior MP",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/6296da53-a9e3-4441-ae6d-f579b3c1b414",
  },
  {
    id: "c1efbefc-ad2d-4068-aaaa-87d908f1da71",
    title: "La Caisse tightens control over fintech FNZ after Blythe Masters’ exit",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/c1efbefc-ad2d-4068-aaaa-87d908f1da71",
  },
  {
    id: "5008b743-8af5-460f-a950-54aa80989f23",
    title: "UK urged to embrace cheaper AI models",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/5008b743-8af5-460f-a950-54aa80989f23",
  },
  {
    id: "9e7ba6a7-f15a-49e4-8f91-b283d2b14cbf",
    title: "Kemi Badenoch casts aside ‘red wall’ focus as she returns Tories to their roots",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/9e7ba6a7-f15a-49e4-8f91-b283d2b14cbf",
  },
  {
    id: "8463aa5f-d9c0-46f4-bd58-a7f1ee5a83ca",
    title: "EU to limit Ukraine’s access to farming subsidies if it joins bloc",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/8463aa5f-d9c0-46f4-bd58-a7f1ee5a83ca",
  },
  {
    id: "c2c6a470-b1c9-4f98-af3a-65983371e6b8",
    title: "The FT’s stock picking game starts today",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/c2c6a470-b1c9-4f98-af3a-65983371e6b8",
  },
  {
    id: "38a54e10-d1ba-48c8-8b4c-e9775eedd957",
    title: "Reform UK’s Robert Jenrick faces fresh accusation from campaign donor",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/38a54e10-d1ba-48c8-8b4c-e9775eedd957",
  },
  {
    id: "01b55406-0d07-4e88-ba6e-5b478b32b1f1",
    title: "Audit watchdog reviews rules to guard against private equity conflicts",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/01b55406-0d07-4e88-ba6e-5b478b32b1f1",
  },
  {
    id: "18e475be-1012-43e9-a0ff-ef0181b772ad",
    title: "Global pension funds cut US equities over AI concentration risk",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/18e475be-1012-43e9-a0ff-ef0181b772ad",
  },
  {
    id: "cc96ac01-7929-4954-97a3-7b30e00ef324",
    title: "Russia’s new drive to crush Ukraine",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/cc96ac01-7929-4954-97a3-7b30e00ef324",
  },
  {
    id: "8f4525eb-ce7c-4323-9dda-698aa1e8521a",
    title: "Why a booming economy is not helping Trump",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/8f4525eb-ce7c-4323-9dda-698aa1e8521a",
  },
  {
    id: "151f2423-b5a9-4541-9397-d85d1a2c8c1b",
    title: "New offices in London are full of empty bike racks, complain developers",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/151f2423-b5a9-4541-9397-d85d1a2c8c1b",
  },
  {
    id: "b3c46770-f6c2-437a-acee-bd1cee447c95",
    title: "UK businessman given senior role at group linked to Kremlin money-laundering operation",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/b3c46770-f6c2-437a-acee-bd1cee447c95",
  },
  {
    id: "0293497e-e4b5-473e-be49-67d1fc005fae",
    title: "Estonia shifts troops closer to Russia in ‘active defence’ push",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/0293497e-e4b5-473e-be49-67d1fc005fae",
  },
  {
    id: "858173c2-1869-4d77-9ecf-2b3b37a0d74d",
    title: "Donald Trump rages as Supreme Court appointees fail to do his bidding",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/858173c2-1869-4d77-9ecf-2b3b37a0d74d",
  },
  {
    id: "5cbc4708-c11b-4be7-88f4-9c23a2066dd7",
    title: "Gulf developers bet on the next Mediterranean destination",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/5cbc4708-c11b-4be7-88f4-9c23a2066dd7",
  },
  {
    id: "2fa693e7-4ad4-4d6e-bd3c-5561db889a1f",
    title: "Russia's new bombing campaign strangles Ukrainian economy",
    date: "2026-10-05",
    time: "05:00",
    url: "https://www.ft.com/content/2fa693e7-4ad4-4d6e-bd3c-5561db889a1f",
  },
  {
    id: "66897ef7-936b-43d0-a067-576be636f876",
    title: "US recalls B-1 bombers from UK air base following alleged terror plot",
    date: "2026-10-04",
    time: "23:24",
    url: "https://www.ft.com/content/66897ef7-936b-43d0-a067-576be636f876",
  },
  {
    id: "7feba19e-b498-4453-a744-214638044f0a",
    title: "FirstFT: Legal risks pile up for OpenAI",
    date: "2026-10-04",
    time: "22:45",
    url: "https://www.ft.com/content/7feba19e-b498-4453-a744-214638044f0a",
  },
  {
    id: "1fdb8380-2fac-474a-a184-616c0a29feb6",
    title: "Bull run for Japan stocks at risk, warns boss of biggest trading house",
    date: "2026-10-04",
    time: "22:00",
    url: "https://www.ft.com/content/1fdb8380-2fac-474a-a184-616c0a29feb6",
  },
];
