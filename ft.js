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
    id: "2915c093-4735-4043-97c9-157a2a2586d1",
    title: "Burnham’s Budget must not be overshadowed by the OBR",
    date: "2026-10-05",
    time: "16:00",
    url: "https://www.ft.com/content/2915c093-4735-4043-97c9-157a2a2586d1",
  },
  {
    id: "17ca0b3c-604e-4690-b58a-f65dfce15b5d",
    title: "David Ellison sticks with Mark Thompson as CNN boss amid Trump attacks",
    date: "2026-10-05",
    time: "15:31",
    url: "https://www.ft.com/content/17ca0b3c-604e-4690-b58a-f65dfce15b5d",
  },
  {
    id: "0a45595f-4889-4436-847f-1bddce813009",
    title: "US ‘monitoring’ situation around suspected case of plague in Russia",
    date: "2026-10-05",
    time: "14:37",
    url: "https://www.ft.com/content/0a45595f-4889-4436-847f-1bddce813009",
  },
  {
    id: "4416101f-5072-4ee0-aa12-5b1daf25b31b",
    title: "Germany and France agree on last-resort tool against trade threats",
    date: "2026-10-05",
    time: "14:32",
    url: "https://www.ft.com/content/4416101f-5072-4ee0-aa12-5b1daf25b31b",
  },
  {
    id: "47965ed4-5c40-4c91-ab1e-418aa75bb42a",
    title: "Brazil’s markets rally as investors bet on Flávio Bolsonaro election win",
    date: "2026-10-05",
    time: "14:20",
    url: "https://www.ft.com/content/47965ed4-5c40-4c91-ab1e-418aa75bb42a",
  },
  {
    id: "c8cf8739-837e-4bb3-9fd9-bb54c02b7289",
    title: "What people in AI really think about regulation",
    date: "2026-10-05",
    time: "14:00",
    url: "https://www.ft.com/content/c8cf8739-837e-4bb3-9fd9-bb54c02b7289",
  },
  {
    id: "5f235c48-9a4e-4bb6-a454-0915abc2d5df",
    title: "Sainsbury’s held merger talks with smaller rival Morrisons",
    date: "2026-10-05",
    time: "13:58",
    url: "https://www.ft.com/content/5f235c48-9a4e-4bb6-a454-0915abc2d5df",
  },
  {
    id: "6a28fe07-f7bd-4f65-9269-d1409756ef34",
    title: "Latino Americans are the real swing voters",
    date: "2026-10-05",
    time: "12:50",
    url: "https://www.ft.com/content/6a28fe07-f7bd-4f65-9269-d1409756ef34",
  },
  {
    id: "d51a78a8-67d8-45bd-b32c-1eafe39a0794",
    title: "Submit a question: What is driving the global bond sell-off?",
    date: "2026-10-05",
    time: "12:41",
    url: "https://www.ft.com/content/d51a78a8-67d8-45bd-b32c-1eafe39a0794",
  },
  {
    id: "44788116-0ff7-4fef-abfb-e121fcb5797c",
    title: "Russia’s ‘shadow war’ with Europe enters new phase, Germany warns",
    date: "2026-10-05",
    time: "12:40",
    url: "https://www.ft.com/content/44788116-0ff7-4fef-abfb-e121fcb5797c",
  },
  {
    id: "b49f5459-92fc-4b91-92c4-d8f2a6f87893",
    title: "Putin’s nuclear threats no longer work",
    date: "2026-10-05",
    time: "12:38",
    url: "https://www.ft.com/content/b49f5459-92fc-4b91-92c4-d8f2a6f87893",
  },
  {
    id: "94e56abb-83ed-4eb5-b0cf-db9252b4cf62",
    title: "Donald Trump’s diesel export coercion will not strengthen the US",
    date: "2026-10-05",
    time: "12:35",
    url: "https://www.ft.com/content/94e56abb-83ed-4eb5-b0cf-db9252b4cf62",
  },
  {
    id: "3120782c-1ea0-4fdc-9462-0a4b4658f70f",
    title: "One person is now a quorum at the SEC",
    date: "2026-10-05",
    time: "12:30",
    url: "https://www.ft.com/content/3120782c-1ea0-4fdc-9462-0a4b4658f70f",
  },
  {
    id: "4ab13290-5208-4f20-9a34-f368b7484304",
    title: "Pro-Russia strongman claims victory in Bosnia elections",
    date: "2026-10-05",
    time: "12:21",
    url: "https://www.ft.com/content/4ab13290-5208-4f20-9a34-f368b7484304",
  },
  {
    id: "a48af44e-84fb-4ce9-b7ce-d1895d0a0f05",
    title: "Yemen launches push to retake territory captured by Houthis",
    date: "2026-10-05",
    time: "10:09",
    url: "https://www.ft.com/content/a48af44e-84fb-4ce9-b7ce-d1895d0a0f05",
  },
  {
    id: "4d2078c4-4773-4d4c-8544-c17169362579",
    title: "Big Oil goes to US Supreme Court over pivotal climate damages claim",
    date: "2026-10-05",
    time: "12:00",
    url: "https://www.ft.com/content/4d2078c4-4773-4d4c-8544-c17169362579",
  },
  {
    id: "2084f349-0829-4130-a5e6-b98929a6e633",
    title: "Schneider Electric to buy industrial software group PTC for $23.7bn",
    date: "2026-10-05",
    time: "11:54",
    url: "https://www.ft.com/content/2084f349-0829-4130-a5e6-b98929a6e633",
  },
  {
    id: "7feba19e-b498-4453-a744-214638044f0a",
    title: "FirstFT: Flávio Bolsonaro secures early lead in Brazil’s election",
    date: "2026-10-05",
    time: "11:33",
    url: "https://www.ft.com/content/7feba19e-b498-4453-a744-214638044f0a",
  },
  {
    id: "e0dfef01-4933-4ab9-8927-d08115f4822c",
    title: "Bond turbulence means it’s time for the ECB to put QT on hold",
    date: "2026-10-05",
    time: "11:22",
    url: "https://www.ft.com/content/e0dfef01-4933-4ab9-8927-d08115f4822c",
  },
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
];
