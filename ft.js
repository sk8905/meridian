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
    id: "d51a78a8-67d8-45bd-b32c-1eafe39a0794",
    title: "Submit a question: What is driving the global bond sell-off?",
    date: "2026-10-06",
    time: "12:57",
    url: "https://www.ft.com/content/d51a78a8-67d8-45bd-b32c-1eafe39a0794",
  },
  {
    id: "0bc54eaf-d545-4591-bb7c-ec3cbc1cb89a",
    title: "McKesson and CD&R strike $5.8bn deal to buy infusion services provider",
    date: "2026-10-06",
    time: "14:10",
    url: "https://www.ft.com/content/0bc54eaf-d545-4591-bb7c-ec3cbc1cb89a",
  },
  {
    id: "98f99e65-47ce-4c78-9b1d-583252f638c7",
    title: "Donald Trump fumes over disloyal Supreme Court judges",
    date: "2026-10-06",
    time: "14:00",
    url: "https://www.ft.com/content/98f99e65-47ce-4c78-9b1d-583252f638c7",
  },
  {
    id: "93756433-eb78-422d-8ac3-30e8cc243a00",
    title: "Debt in the spotlight as Paramount closes $111bn deal for Warner Bros",
    date: "2026-10-06",
    time: "13:52",
    url: "https://www.ft.com/content/93756433-eb78-422d-8ac3-30e8cc243a00",
  },
  {
    id: "cf0b1e96-0005-4ce0-8720-22247b01c3fd",
    title: "We should call time on the ‘end times’",
    date: "2026-10-06",
    time: "13:44",
    url: "https://www.ft.com/content/cf0b1e96-0005-4ce0-8720-22247b01c3fd",
  },
  {
    id: "4d322475-2996-4b1f-8347-891c588d09df",
    title: "Forvis Mazars named top UK financial advice firm",
    date: "2026-10-06",
    time: "12:51",
    url: "https://www.ft.com/content/4d322475-2996-4b1f-8347-891c588d09df",
  },
  {
    id: "2761e1ea-3cdc-43e0-b825-e82fff828f58",
    title: "Fortune favours the brave at Paris Fashion Week — some of them anyway",
    date: "2026-10-06",
    time: "12:45",
    url: "https://www.ft.com/content/2761e1ea-3cdc-43e0-b825-e82fff828f58",
  },
  {
    id: "a6161dfd-bfb9-4bf5-866f-1ca0a0c8e6aa",
    title: "Why are bond yields so high?",
    date: "2026-10-06",
    time: "12:30",
    url: "https://www.ft.com/content/a6161dfd-bfb9-4bf5-866f-1ca0a0c8e6aa",
  },
  {
    id: "3cd5097b-b5ca-4b9f-83fd-f008bb2b72d3",
    title: "Healey warns banks that UK faces ‘challenging’ fiscal picture but stays tight-lipped on tax",
    date: "2026-10-06",
    time: "12:23",
    url: "https://www.ft.com/content/3cd5097b-b5ca-4b9f-83fd-f008bb2b72d3",
  },
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
];
