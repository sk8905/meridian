// =============================================================================
// myFT — headlines from the reader's personalised Financial Times feed
// (followed topics), surfaced in the Home news feed under an "FT" label.
//
// Source: the reader's myFT RSS feed —
//   https://www.ft.com/myft/following/601965b2-62d0-47e1-88cf-576ebc8a8a2e.rss
// It is fetched by the scheduled refresh routine (see docs/refresh-routines.md,
// the "Email sweep → myFT" section), parsed, and written here.
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
    id: "bd1f3385-1985-4a8a-a781-22cbe1292d2d",
    title: "Wall Street plays down investor fears of faltering trading boom",
    date: "2026-10-13",
    time: "17:10",
    url: "https://www.ft.com/content/bd1f3385-1985-4a8a-a781-22cbe1292d2d"
  },
  {
    id: "591cf3da-e7c1-4b04-9511-fea8785f983d",
    title: "English football on ‘edge of financial disaster’, warns game’s new regulator",
    date: "2026-10-13",
    time: "17:01",
    url: "https://www.ft.com/content/591cf3da-e7c1-4b04-9511-fea8785f983d"
  },
  {
    id: "87a1a5a1-4942-47dd-856a-d9a694f7d2fd",
    title: "White House asks US envoy to Greece Kimberly Guilfoyle to resign",
    date: "2026-10-13",
    time: "16:32",
    url: "https://www.ft.com/content/87a1a5a1-4942-47dd-856a-d9a694f7d2fd"
  },
  {
    id: "b31aaac7-69c1-40da-9c2f-d4f025104d24",
    title: "Creditors sue Patrick Drahi’s Altice International over asset shifts",
    date: "2026-10-13",
    time: "16:27",
    url: "https://www.ft.com/content/b31aaac7-69c1-40da-9c2f-d4f025104d24"
  },
  {
    id: "52a1bbdd-2171-4fcb-9efe-99ed4283def5",
    title: "How not to revive Europe’s auto industry",
    date: "2026-10-13",
    time: "16:03",
    url: "https://www.ft.com/content/52a1bbdd-2171-4fcb-9efe-99ed4283def5"
  },
  {
    id: "0a39fcdb-860c-4739-8454-21fb429f6336",
    title: "Submit your questions: Who’s winning the trade war with China — the EU or US?",
    date: "2026-10-13",
    time: "15:16",
    url: "https://www.ft.com/content/0a39fcdb-860c-4739-8454-21fb429f6336"
  },
  {
    id: "e16f0422-cf75-4cc9-962d-4605e421dc63",
    title: "Chip stocks slide in wake of ‘casino’ comment by Broadcom boss",
    date: "2026-10-13",
    time: "14:53",
    url: "https://www.ft.com/content/e16f0422-cf75-4cc9-962d-4605e421dc63"
  },
  {
    id: "fbaeca48-5f50-40ca-b45e-5de62ad52b83",
    title: "London Stock Exchange owner in talks to buy credit specialist Octus",
    date: "2026-10-13",
    time: "14:41",
    url: "https://www.ft.com/content/fbaeca48-5f50-40ca-b45e-5de62ad52b83"
  },
  {
    id: "900ff462-3cbb-41af-9a29-1e4aa3d0ab4e",
    title: "Why we need a proper conversation about death",
    date: "2026-10-13",
    time: "14:34",
    url: "https://www.ft.com/content/900ff462-3cbb-41af-9a29-1e4aa3d0ab4e"
  },
  {
    id: "787acc7e-f0d3-4552-a369-4b4c967e4ca5",
    title: "European gas hits Iran wartime high",
    date: "2026-10-13",
    time: "14:32",
    url: "https://www.ft.com/content/787acc7e-f0d3-4552-a369-4b4c967e4ca5"
  },
  {
    id: "f7e3debb-613a-4b33-8f57-341a493693de",
    title: "Elon Musk becomes Republicans’ biggest donor for US midterm elections",
    date: "2026-10-13",
    time: "14:21",
    url: "https://www.ft.com/content/f7e3debb-613a-4b33-8f57-341a493693de"
  },
  {
    id: "93c7f91d-7daa-44bb-8a45-62b214106e73",
    title: "Pope Leo admitted to hospital for lung surgery",
    date: "2026-10-13",
    time: "14:01",
    url: "https://www.ft.com/content/93c7f91d-7daa-44bb-8a45-62b214106e73"
  },
  {
    id: "e4c33601-88e9-43fc-b920-1cecc2709dbd",
    title: "Gulf oil production rebounds ahead of increase in Iran war hostilities",
    date: "2026-10-13",
    time: "13:53",
    url: "https://www.ft.com/content/e4c33601-88e9-43fc-b920-1cecc2709dbd"
  },
  {
    id: "d63348fb-901d-4ff3-9cdc-0d023778dbc2",
    title: "Healey rejects calls to equalise capital gains and income tax rates",
    date: "2026-10-13",
    time: "13:43",
    url: "https://www.ft.com/content/d63348fb-901d-4ff3-9cdc-0d023778dbc2"
  },
  {
    id: "c6bd25b8-ef9e-41a3-90d2-29c132e10ec2",
    title: "Bulgaria suggests Russia behind ship attack that left 11 sailors missing",
    date: "2026-10-13",
    time: "13:21",
    url: "https://www.ft.com/content/c6bd25b8-ef9e-41a3-90d2-29c132e10ec2"
  },
  {
    id: "da00e3ff-4392-46d8-bab5-13b4ccc49995",
    title: "Zelenskyy says Kyiv’s partners failed to warn of ballistic missile attack",
    date: "2026-10-13",
    time: "13:06",
    url: "https://www.ft.com/content/da00e3ff-4392-46d8-bab5-13b4ccc49995"
  },
  {
    id: "a4ab83d4-81b5-4336-9569-a0708b41e894",
    title: "Ships in Hormuz strait hit by worst spate of attacks since start of war",
    date: "2026-10-13",
    time: "13:04",
    url: "https://www.ft.com/content/a4ab83d4-81b5-4336-9569-a0708b41e894"
  },
  {
    id: "a0921eb6-637e-4fac-b15d-ea7aef441e6a",
    title: "Iran has made ‘major shift’ to target UK military sites, says MI5 chief",
    date: "2026-10-13",
    time: "13:00",
    url: "https://www.ft.com/content/a0921eb6-637e-4fac-b15d-ea7aef441e6a"
  },
  {
    id: "183ace53-2a89-43a9-88c1-9ea1e1b4437d",
    title: "The world economy is running hotter than expected",
    date: "2026-10-13",
    time: "12:30",
    url: "https://www.ft.com/content/183ace53-2a89-43a9-88c1-9ea1e1b4437d"
  },
  {
    id: "73257952-844b-4f5f-a1cb-112ae9cb0249",
    title: "Can energy help Mexico in trade talks with Trump?",
    date: "2026-10-13",
    time: "12:00",
    url: "https://www.ft.com/content/73257952-844b-4f5f-a1cb-112ae9cb0249"
  },
  {
    id: "46bd62aa-73e1-4944-a242-f883d05191f1",
    title: "Can a Hollywood star persuade you to become an art collector?",
    date: "2026-10-13",
    time: "12:00",
    url: "https://www.ft.com/content/46bd62aa-73e1-4944-a242-f883d05191f1"
  },
  {
    id: "763bf1f5-9b5d-4f7e-b865-b16d7a9a313a",
    title: "JPMorgan fixed income miss: a signal the boom is fading?",
    date: "2026-10-13",
    time: "11:59",
    url: "https://www.ft.com/content/763bf1f5-9b5d-4f7e-b865-b16d7a9a313a"
  },
  {
    id: "c6a28cf5-cd3c-447b-ad79-dcc247fc6fdf",
    title: "How governments spend money",
    date: "2026-10-13",
    time: "11:49",
    url: "https://www.ft.com/content/c6a28cf5-cd3c-447b-ad79-dcc247fc6fdf"
  },
  {
    id: "25ddd4fb-0075-4642-8f76-fa4ac912a172",
    title: "Dimon ‘prepared for a wide range of outcomes’ in US economy",
    date: "2026-10-13",
    time: "11:45",
    url: "https://www.ft.com/content/25ddd4fb-0075-4642-8f76-fa4ac912a172"
  },
  {
    id: "5d92ea15-6211-43c4-9e41-d1b7f085dd4c",
    title: "BP to set out new strategy after windfall year",
    date: "2026-10-13",
    time: "08:38",
    url: "https://www.ft.com/content/5d92ea15-6211-43c4-9e41-d1b7f085dd4c"
  },
  {
    id: "1cf8da1d-8abd-40a6-bcd2-055ee49c7fcb",
    title: "Premier Inn owner urges investors to resist pressure from activist hedge fund",
    date: "2026-10-13",
    time: "08:09",
    url: "https://www.ft.com/content/1cf8da1d-8abd-40a6-bcd2-055ee49c7fcb"
  },
  {
    id: "27be530d-2faf-43ce-874f-0e6e0802bee2",
    title: "China gets spiky on currencies",
    date: "2026-10-13",
    time: "06:30",
    url: "https://www.ft.com/content/27be530d-2faf-43ce-874f-0e6e0802bee2"
  },
  {
    id: "d0d8cfb8-ca9e-4d0d-a9cf-e3e4989a4694",
    title: "FTAV’s further reading",
    date: "2026-10-13",
    time: "06:30",
    url: "https://www.ft.com/content/d0d8cfb8-ca9e-4d0d-a9cf-e3e4989a4694"
  },
  {
    id: "73c8d82e-68ea-4846-b28c-a0bc4069be36",
    title: "Trump-Zelenskyy diesel spat reignites Europe’s White House angst",
    date: "2026-10-13",
    time: "06:00",
    url: "https://www.ft.com/content/73c8d82e-68ea-4846-b28c-a0bc4069be36"
  },
  {
    id: "0c821d3e-241f-46a9-a54b-e0d0cf8ee4cf",
    title: "How Michael Woodford made modern macro relevant to central bankers",
    date: "2026-10-13",
    time: "06:00",
    url: "https://www.ft.com/content/0c821d3e-241f-46a9-a54b-e0d0cf8ee4cf"
  },
  {
    id: "e03b74a1-6f7f-4f2c-ad39-c70b8e63ae39",
    title: "FirstFT: IMF sounds alarm on dire public finances",
    date: "2026-10-13",
    time: "05:40",
    url: "https://www.ft.com/content/e03b74a1-6f7f-4f2c-ad39-c70b8e63ae39"
  },
  {
    id: "f5ca22c7-8340-4189-8c40-224a1e16c5ef",
    title: "Rising Treasury bill issuance puts pressure on short-term rates",
    date: "2026-10-13",
    time: "05:30",
    url: "https://www.ft.com/content/f5ca22c7-8340-4189-8c40-224a1e16c5ef"
  },
  {
    id: "15eac7b8-df53-41f4-bf51-bc28225eec51",
    title: "‘A game of snakes and ladders’",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/15eac7b8-df53-41f4-bf51-bc28225eec51"
  },
  {
    id: "c913d391-f4e2-439c-82d6-8f6205b31b0f",
    title: "EU hybrid curbs to offer only ‘temporary’ respite against Chinese carmakers",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/c913d391-f4e2-439c-82d6-8f6205b31b0f"
  },
  {
    id: "6fa735a2-a590-4461-b092-920ba489e7a8",
    title: "Investors brave US Treasury rout to lock in highest yields in decades",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/6fa735a2-a590-4461-b092-920ba489e7a8"
  },
  {
    id: "ec433e1f-bdb4-4a1c-868e-e1c7c4121f45",
    title: "The election supercycle set to drag Europe right",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/ec433e1f-bdb4-4a1c-868e-e1c7c4121f45"
  },
  {
    id: "6219e3f2-e9c1-48d4-ae47-1337e636ce0a",
    title: "Informa’s trade show bet has a vulnerability — geopolitics",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/6219e3f2-e9c1-48d4-ae47-1337e636ce0a"
  },
  {
    id: "39da2672-e57a-41aa-8f03-970ae37d88a6",
    title: "How BT’s TalkTalk swoop left broadband rivals fuming",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/39da2672-e57a-41aa-8f03-970ae37d88a6"
  },
  {
    id: "e3b31db9-5fe2-4ce8-a1f4-0327c69900a8",
    title: "Trump’s loan to a US defence start-up adds to Apollo’s war chest too",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/e3b31db9-5fe2-4ce8-a1f4-0327c69900a8"
  },
  {
    id: "1724a30e-cf50-4a4e-ade8-bca72ea4b9a1",
    title: "Why Trump is going for Zelenskyy’s jugular",
    date: "2026-10-13",
    time: "05:00",
    url: "https://www.ft.com/content/1724a30e-cf50-4a4e-ade8-bca72ea4b9a1"
  }
];
