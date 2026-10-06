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
    id: "9a46af48-9c69-48bd-a648-2e496486c504",
    title: "California’s oligarch tax would change America",
    date: "2026-10-06",
    time: "12:01",
    url: "https://www.ft.com/content/9a46af48-9c69-48bd-a648-2e496486c504",
  },
  {
    id: "6843c0fe-b1cf-46f9-85d6-d1d4a7da6601",
    title: "Is your nanny annexe luxe enough?",
    date: "2026-10-06",
    time: "12:00",
    url: "https://www.ft.com/content/6843c0fe-b1cf-46f9-85d6-d1d4a7da6601",
  },
  {
    id: "664a215a-86e4-4e13-ad7c-50119d7ebdb1",
    title: "Big Oil’s day in court",
    date: "2026-10-06",
    time: "12:00",
    url: "https://www.ft.com/content/664a215a-86e4-4e13-ad7c-50119d7ebdb1",
  },
  {
    id: "5b233375-b686-4dc1-ab59-47930f1583ad",
    title: "Healey warns banks that UK faces ‘challenging’ fiscal picture but stays tight-lipped on tax",
    date: "2026-10-06",
    time: "11:36",
    url: "https://www.ft.com/content/5b233375-b686-4dc1-ab59-47930f1583ad",
  },
  {
    id: "f30a1afc-2aa8-4cdd-a6e8-b18523298456",
    title: "Tories pledge ‘Britannia Shield’ to protect UK from drone attacks",
    date: "2026-10-06",
    time: "09:36",
    url: "https://www.ft.com/content/f30a1afc-2aa8-4cdd-a6e8-b18523298456",
  },
  {
    id: "d510c91d-3039-42f7-af4a-63814f0df86f",
    title: "UK risks ‘uninvestable’ reputation if North Sea projects are blocked, says energy boss",
    date: "2026-10-06",
    time: "11:07",
    url: "https://www.ft.com/content/d510c91d-3039-42f7-af4a-63814f0df86f",
  },
  {
    id: "bf5f9eec-8f31-4ecd-8f0b-d27340d10767",
    title: "Indian protesters demand electoral chief resign over alleged voter roll fraud",
    date: "2026-10-06",
    time: "11:03",
    url: "https://www.ft.com/content/bf5f9eec-8f31-4ecd-8f0b-d27340d10767",
  },
  {
    id: "f94db6c5-1ad2-4bbf-9fec-4a4ef1e99dba",
    title: "Saudi Arabia, Pakistan and Turkey trigger mutual defence pact over Houthis",
    date: "2026-10-06",
    time: "11:02",
    url: "https://www.ft.com/content/f94db6c5-1ad2-4bbf-9fec-4a4ef1e99dba",
  },
  {
    id: "42b6fa88-f730-4f8a-a194-8f53d0759aaf",
    title: "Palmer Luckey’s Erebor surges to more than $7bn in deposits since launch",
    date: "2026-10-06",
    time: "11:00",
    url: "https://www.ft.com/content/42b6fa88-f730-4f8a-a194-8f53d0759aaf",
  },
  {
    id: "4b4aa8c8-3711-41cf-8702-c4a9650bbecb",
    title: "What is Black design now?",
    date: "2026-10-06",
    time: "11:00",
    url: "https://www.ft.com/content/4b4aa8c8-3711-41cf-8702-c4a9650bbecb",
  },
  {
    id: "249d277e-86ee-4ea9-affc-12f61e1105ea",
    title: "Billionaire Newhouse family rules out Condé Nast sale",
    date: "2026-10-06",
    time: "11:00",
    url: "https://www.ft.com/content/249d277e-86ee-4ea9-affc-12f61e1105ea",
  },
  {
    id: "b53870b9-aa82-499a-9898-b5f7475939f8",
    title: "How Sainsbury’s rediscovered its appetite for supermarket megadeals",
    date: "2026-10-06",
    time: "10:41",
    url: "https://www.ft.com/content/b53870b9-aa82-499a-9898-b5f7475939f8",
  },
  {
    id: "1573393d-f711-41f2-be36-92a5527a7714",
    title: "FT Innovative Lawyers Asia-Pacific 2027 open for submissions",
    date: "2026-10-06",
    time: "10:38",
    url: "https://www.ft.com/content/1573393d-f711-41f2-be36-92a5527a7714",
  },
  {
    id: "4c565931-6ac7-4b4c-be72-d86e8e3a8aec",
    title: "Former German spy chief arrested for treason",
    date: "2026-10-06",
    time: "10:11",
    url: "https://www.ft.com/content/4c565931-6ac7-4b4c-be72-d86e8e3a8aec",
  },
  {
    id: "4e1a4297-62f4-4b42-a41a-2ad23b64cbe9",
    title: "France’s Marine Le Pen pledges to rein in public spending",
    date: "2026-10-06",
    time: "10:04",
    url: "https://www.ft.com/content/4e1a4297-62f4-4b42-a41a-2ad23b64cbe9",
  },
  {
    id: "9f1c65fe-3670-40bd-9223-18cd5c84df3c",
    title: "A plausible theory for reviving the Conservatives",
    date: "2026-10-06",
    time: "09:30",
    url: "https://www.ft.com/content/9f1c65fe-3670-40bd-9223-18cd5c84df3c",
  },
  {
    id: "c37419cd-5325-409e-9eac-ea509c8ace51",
    title: "Warnings of possible Iranian drone attack led US to pull bombers from RAF Fairford",
    date: "2026-10-06",
    time: "09:09",
    url: "https://www.ft.com/content/c37419cd-5325-409e-9eac-ea509c8ace51",
  },
  {
    id: "0c8c0122-cc24-4ea5-bc7f-09bfc95d3dd1",
    title: "Informa to buy rival events business Clarion from Blackstone for £2.2b",
    date: "2026-10-06",
    time: "08:05",
    url: "https://www.ft.com/content/0c8c0122-cc24-4ea5-bc7f-09bfc95d3dd1",
  },
  {
    id: "aba4589e-070a-493b-8c16-512070c20b60",
    title: "France’s BPCE buys ‘friendly’ stake in Spain’s Sabadell",
    date: "2026-10-06",
    time: "07:59",
    url: "https://www.ft.com/content/aba4589e-070a-493b-8c16-512070c20b60",
  },
  {
    id: "fb32e9f8-4bf7-44ad-983d-1a03f50f66f5",
    title: "AI models used in bank cyber attacks, warns South Korea’s president",
    date: "2026-10-06",
    time: "07:19",
    url: "https://www.ft.com/content/fb32e9f8-4bf7-44ad-983d-1a03f50f66f5",
  },
  {
    id: "47061507-f20e-4ff6-961d-e1f1b919cb89",
    title: "How AI could scupper the dollar",
    date: "2026-10-06",
    time: "06:30",
    url: "https://www.ft.com/content/47061507-f20e-4ff6-961d-e1f1b919cb89",
  },
  {
    id: "ce3027d8-3990-4a74-942c-9a0fbdfbbe13",
    title: "FTAV’s further reading",
    date: "2026-10-06",
    time: "06:30",
    url: "https://www.ft.com/content/ce3027d8-3990-4a74-942c-9a0fbdfbbe13",
  },
  {
    id: "792366b3-e010-4e0e-a1c4-692ffae3f5aa",
    title: "China fuels tensions with partners over scaled-back summit plans",
    date: "2026-10-06",
    time: "06:00",
    url: "https://www.ft.com/content/792366b3-e010-4e0e-a1c4-692ffae3f5aa",
  },
  {
    id: "8a6b5b97-5fed-4013-804b-c631863010db",
    title: "Germany’s pivot on China trade is a long time coming for other EU capitals",
    date: "2026-10-06",
    time: "06:00",
    url: "https://www.ft.com/content/8a6b5b97-5fed-4013-804b-c631863010db",
  },
  {
    id: "372d018c-df75-4bf8-9699-7f87b8511c37",
    title: "The not very secret life of A7’s front companies",
    date: "2026-10-06",
    time: "06:00",
    url: "https://www.ft.com/content/372d018c-df75-4bf8-9699-7f87b8511c37",
  },
  {
    id: "1d152b5b-decb-41c3-a197-8de1d1ca26fc",
    title: "FirstFT: French central bank chief warns on rising rates",
    date: "2026-10-06",
    time: "05:32",
    url: "https://www.ft.com/content/1d152b5b-decb-41c3-a197-8de1d1ca26fc",
  },
  {
    id: "0b4511be-37a8-4de1-bf7d-1718c1f01351",
    title: "The politics of losing sleep",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/0b4511be-37a8-4de1-bf7d-1718c1f01351",
  },
  {
    id: "0e4afbdc-c018-4ee4-86b3-4248ae3e97ab",
    title: "The creditor bloodbath in UK telecoms",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/0e4afbdc-c018-4ee4-86b3-4248ae3e97ab",
  },
  {
    id: "309a7685-e488-44f4-ad76-4247b7f8bb5b",
    title: "BT’s swoop on TalkTalk has regulators over a barrel",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/309a7685-e488-44f4-ad76-4247b7f8bb5b",
  },
  {
    id: "3410674b-581f-468d-93d3-01fed6411806",
    title: "Labour mayor of West Midlands urges chancellor to relax electric car targets",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/3410674b-581f-468d-93d3-01fed6411806",
  },
  {
    id: "76db879a-2c53-4aee-8354-b30185f1d3a4",
    title: "German far-right set to secure its first ever regional parliament president",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/76db879a-2c53-4aee-8354-b30185f1d3a4",
  },
  {
    id: "ed28bf56-70b6-4e05-b48e-6a016699a675",
    title: "Brazil’s rightwing surge boosts Flávio Bolsonaro’s push to free his father",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/ed28bf56-70b6-4e05-b48e-6a016699a675",
  },
  {
    id: "ffc5d121-9143-4760-86d7-d1a0fc885af4",
    title: "Andy Burnham’s Manchester City problem",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/ffc5d121-9143-4760-86d7-d1a0fc885af4",
  },
  {
    id: "efec7d66-f205-4df4-81e3-6652ec0ddc85",
    title: "Why accountancy firm listings don’t add up",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/efec7d66-f205-4df4-81e3-6652ec0ddc85",
  },
  {
    id: "a896cda0-cd0c-4aae-bc51-daec26157e56",
    title: "Intercontinental Exchange launches trading in gold futures in London",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/a896cda0-cd0c-4aae-bc51-daec26157e56",
  },
  {
    id: "70308419-20a2-4236-a03e-346b4626997b",
    title: "NextEra’s $67bn Dominion takeover faces political backlash in Virginia",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/70308419-20a2-4236-a03e-346b4626997b",
  },
  {
    id: "b3034c7f-e660-412b-87a4-a212539edba2",
    title: "Britain has turned digital ID into a growth industry",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/b3034c7f-e660-412b-87a4-a212539edba2",
  },
  {
    id: "55b65eed-89ba-4a7c-b137-b8c5284f7401",
    title: "Can Kemi Badenoch return the Tories to power?",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/55b65eed-89ba-4a7c-b137-b8c5284f7401",
  },
  {
    id: "7c7ccb82-2973-47af-ad9b-b469c6ea0048",
    title: "Surge in borrowing costs hits corporate America",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/7c7ccb82-2973-47af-ad9b-b469c6ea0048",
  },
  {
    id: "9b252b46-a87c-45e7-a09a-45a39ce077b8",
    title: "France: between the bond market and the barricades",
    date: "2026-10-06",
    time: "05:00",
    url: "https://www.ft.com/content/9b252b46-a87c-45e7-a09a-45a39ce077b8",
  },
];
