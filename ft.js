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
    id: "873b1b9c-5e5c-4f34-9b96-6250ffd26783",
    title: "Stockpickers: Avingtrans, Tesco, JD Wetherspoon",
    date: "2026-10-09",
    time: "18:00",
    url: "https://www.ft.com/content/873b1b9c-5e5c-4f34-9b96-6250ffd26783",
  },
  {
    id: "543a0c0d-f893-407e-b9bc-55e2d91dca40",
    title: "Directors’ Deals: CMC directors buy in as choppy markets boost trading",
    date: "2026-10-09",
    time: "18:00",
    url: "https://www.ft.com/content/543a0c0d-f893-407e-b9bc-55e2d91dca40",
  },
  {
    id: "88485f17-cb90-46cc-a302-6c87b29622c1",
    title: "The wisdom of prediction markets",
    date: "2026-10-09",
    time: "18:00",
    url: "https://www.ft.com/content/88485f17-cb90-46cc-a302-6c87b29622c1",
  },
  {
    id: "f2d13ed9-1b80-4e76-a4c7-de29cbbe858c",
    title: "Has Polanski blown it for the Greens?",
    date: "2026-10-09",
    time: "17:56",
    url: "https://www.ft.com/content/f2d13ed9-1b80-4e76-a4c7-de29cbbe858c",
  },
  {
    id: "b35a575d-ff53-4580-8946-9054d7aeb388",
    title: "Get used to multi-party politics, it’s here to stay",
    date: "2026-10-09",
    time: "17:50",
    url: "https://www.ft.com/content/b35a575d-ff53-4580-8946-9054d7aeb388",
  },
  {
    id: "39f9b46f-b7ee-43b6-b377-6e47aa1af9a1",
    title: "EU leads fight against fossil-fuel nations’ push to delay climate science reports",
    date: "2026-10-09",
    time: "17:32",
    url: "https://www.ft.com/content/39f9b46f-b7ee-43b6-b377-6e47aa1af9a1",
  },
  {
    id: "39764d10-6b87-4103-8e7d-290a72a5ea5a",
    title: "Trump and Hegseth’s execution-type deal",
    date: "2026-10-09",
    time: "17:18",
    url: "https://www.ft.com/content/39764d10-6b87-4103-8e7d-290a72a5ea5a",
  },
  {
    id: "b6e6542f-045b-4a38-9fb9-6857b7d1fee3",
    title: "Battle for the soul of the Green Party",
    date: "2026-10-09",
    time: "17:14",
    url: "https://www.ft.com/content/b6e6542f-045b-4a38-9fb9-6857b7d1fee3",
  },
  {
    id: "ffb13044-216b-4b31-885c-cda9c78cbfdb",
    title: "EU to explore windfall tax on energy companies",
    date: "2026-10-09",
    time: "17:05",
    url: "https://www.ft.com/content/ffb13044-216b-4b31-885c-cda9c78cbfdb",
  },
  {
    id: "d57c427a-2625-4297-bd29-01aac0d69e2f",
    title: "Flávio Bolsonaro, scion of a Brazilian political dynasty now eyeing victory",
    date: "2026-10-09",
    time: "17:00",
    url: "https://www.ft.com/content/d57c427a-2625-4297-bd29-01aac0d69e2f",
  },
  {
    id: "4d5757e9-78b5-42f6-b26b-d9556321c0c8",
    title: "US announces sanctions campaign to ‘end’ ICC",
    date: "2026-10-09",
    time: "16:50",
    url: "https://www.ft.com/content/4d5757e9-78b5-42f6-b26b-d9556321c0c8",
  },
  {
    id: "9ce4df82-5ba4-42a5-9935-f21b6d6d5ce4",
    title: "A very German spy scandal",
    date: "2026-10-09",
    time: "16:19",
    url: "https://www.ft.com/content/9ce4df82-5ba4-42a5-9935-f21b6d6d5ce4",
  },
  {
    id: "83b817d5-df71-41a6-bef5-3db55a3a89cf",
    title: "Iran attacks tankers beyond Strait of Hormuz",
    date: "2026-10-09",
    time: "16:10",
    url: "https://www.ft.com/content/83b817d5-df71-41a6-bef5-3db55a3a89cf",
  },
  {
    id: "d0c81cd2-f944-46b9-a859-abc3f0bd3516",
    title: "Donald Trump launches committee to investigate Fed governor Lisa Cook",
    date: "2026-10-09",
    time: "16:08",
    url: "https://www.ft.com/content/d0c81cd2-f944-46b9-a859-abc3f0bd3516",
  },
  {
    id: "8354b63b-44ae-4aef-9c6b-5cef1f9bb001",
    title: "Germany pivots away from ECB presidency push",
    date: "2026-10-09",
    time: "16:07",
    url: "https://www.ft.com/content/8354b63b-44ae-4aef-9c6b-5cef1f9bb001",
  },
  {
    id: "8c3f95ec-2428-4102-9f67-b707f1264c69",
    title: "US telcos shed $45bn in value after SpaceX announces spectrum purchase",
    date: "2026-10-09",
    time: "15:37",
    url: "https://www.ft.com/content/8c3f95ec-2428-4102-9f67-b707f1264c69",
  },
  {
    id: "523fa1fa-0764-47d6-907b-4f72bd4a6cc0",
    title: "Lib Dem MP launches attempt to topple leader Ed Davey",
    date: "2026-10-09",
    time: "14:25",
    url: "https://www.ft.com/content/523fa1fa-0764-47d6-907b-4f72bd4a6cc0",
  },
  {
    id: "2823ef6f-b3d7-494b-b131-414c02d6a59f",
    title: "China and EU reach ‘understanding’ on hybrid cars, Beijing says",
    date: "2026-10-09",
    time: "14:11",
    url: "https://www.ft.com/content/2823ef6f-b3d7-494b-b131-414c02d6a59f",
  },
  {
    id: "0a39fcdb-860c-4739-8454-21fb429f6336",
    title: "Submit your questions: who’s doing better in their trade battles with China — the EU or the US?",
    date: "2026-10-09",
    time: "14:04",
    url: "https://www.ft.com/content/0a39fcdb-860c-4739-8454-21fb429f6336",
  },
  {
    id: "ee329e29-aec9-4876-829e-022683f425f8",
    title: "How to shield your portfolio if AI goes ka-boom",
    date: "2026-10-09",
    time: "14:00",
    url: "https://www.ft.com/content/ee329e29-aec9-4876-829e-022683f425f8",
  },
  {
    id: "3c8d6ab0-595f-4121-9901-a784be75bb09",
    title: "Rubio and the will to power",
    date: "2026-10-09",
    time: "14:00",
    url: "https://www.ft.com/content/3c8d6ab0-595f-4121-9901-a784be75bb09",
  },
  {
    id: "eab7e6ea-7391-48cb-a1d8-e34821b9bde5",
    title: "No peace, no quiet",
    date: "2026-10-09",
    time: "13:52",
    url: "https://www.ft.com/content/eab7e6ea-7391-48cb-a1d8-e34821b9bde5",
  },
  {
    id: "084bf164-ee7b-4744-a869-4dea488459f8",
    title: "The ECB will sit on the sidelines during France’s debt sell-off",
    date: "2026-10-09",
    time: "13:39",
    url: "https://www.ft.com/content/084bf164-ee7b-4744-a869-4dea488459f8",
  },
  {
    id: "76cbf6b8-55a4-48b6-b309-c0d7b8e75990",
    title: "High earners are right to wail about childcare costs",
    date: "2026-10-09",
    time: "13:09",
    url: "https://www.ft.com/content/76cbf6b8-55a4-48b6-b309-c0d7b8e75990",
  },
  {
    id: "c84a0307-714c-4279-9073-caad985cce63",
    title: "Death-spiral finance: altcoin edition",
    date: "2026-10-09",
    time: "13:00",
    url: "https://www.ft.com/content/c84a0307-714c-4279-9073-caad985cce63",
  },
  {
    id: "b90417e7-4d32-48cc-a508-5d405e7cd2ee",
    title: "Ukraine strikes Russian tech giant’s data centres",
    date: "2026-10-09",
    time: "12:55",
    url: "https://www.ft.com/content/b90417e7-4d32-48cc-a508-5d405e7cd2ee",
  },
  {
    id: "63c058b6-77e9-453f-bb87-6763336fe6b4",
    title: "Former prince Andrew makes £1.5mn payment after early surrender of Royal Lodge lease",
    date: "2026-10-09",
    time: "12:51",
    url: "https://www.ft.com/content/63c058b6-77e9-453f-bb87-6763336fe6b4",
  },
  {
    id: "462c303b-b96c-4262-a7ca-e9ae7e440828",
    title: "Computer scientist David Silver: ‘Where are we going without AI?’",
    date: "2026-10-09",
    time: "12:30",
    url: "https://www.ft.com/content/462c303b-b96c-4262-a7ca-e9ae7e440828",
  },
  {
    id: "d16e8abb-ce63-4ed4-b2f2-3a0805e9cab1",
    title: "Former Deutsche Bank star trader has rate-rigging conviction quashed",
    date: "2026-10-09",
    time: "12:23",
    url: "https://www.ft.com/content/d16e8abb-ce63-4ed4-b2f2-3a0805e9cab1",
  },
  {
    id: "7c0e4294-0b7c-488c-8b76-ab2d411b8f66",
    title: "Student revolt tests France’s shrinking fiscal room",
    date: "2026-10-09",
    time: "12:18",
    url: "https://www.ft.com/content/7c0e4294-0b7c-488c-8b76-ab2d411b8f66",
  },
  {
    id: "f242bf0c-89bb-4263-b781-27438bad5088",
    title: "This Cursed Beautiful Land — Evan Gershkovich on being Putin’s human bargaining chip",
    date: "2026-10-09",
    time: "12:00",
    url: "https://www.ft.com/content/f242bf0c-89bb-4263-b781-27438bad5088",
  },
  {
    id: "21b41e8f-3df3-4c77-8bdc-b71b7b3c8df5",
    title: "Germany Rearmed — a historic shift back to military power raises alarm",
    date: "2026-10-09",
    time: "12:00",
    url: "https://www.ft.com/content/21b41e8f-3df3-4c77-8bdc-b71b7b3c8df5",
  },
  {
    id: "78cfa32b-b117-4c49-b061-72519878cd54",
    title: "The struggle to fix Africa’s debt crisis",
    date: "2026-10-09",
    time: "12:00",
    url: "https://www.ft.com/content/78cfa32b-b117-4c49-b061-72519878cd54",
  },
  {
    id: "297ca864-737c-4112-b368-f21a20cc78d2",
    title: "Burnham pledges to end use of non-compete clauses",
    date: "2026-10-09",
    time: "11:44",
    url: "https://www.ft.com/content/297ca864-737c-4112-b368-f21a20cc78d2",
  },
  {
    id: "77d73223-3cfc-4892-a3c5-5502595f42d4",
    title: "Delta slashes profit outlook as higher fuel prices bite",
    date: "2026-10-09",
    time: "11:44",
    url: "https://www.ft.com/content/77d73223-3cfc-4892-a3c5-5502595f42d4",
  },
  {
    id: "2d4333d1-8119-44a4-a5a5-2ee9ef2544fa",
    title: "Japan declares cyber space emergency as attacks soar",
    date: "2026-10-09",
    time: "11:40",
    url: "https://www.ft.com/content/2d4333d1-8119-44a4-a5a5-2ee9ef2544fa",
  },
  {
    id: "c49f7d52-4b43-4dc9-b21b-a61e8756152f",
    title: "FirstFT: SoftBank turns to Gulf for $100bn in AI financing",
    date: "2026-10-09",
    time: "11:02",
    url: "https://www.ft.com/content/c49f7d52-4b43-4dc9-b21b-a61e8756152f",
  },
  {
    id: "ec5cf1f8-e4cf-4b87-ae89-276ab9532856",
    title: "The rightwing rapper taking on Pedro Sánchez in Spain",
    date: "2026-10-09",
    time: "11:00",
    url: "https://www.ft.com/content/ec5cf1f8-e4cf-4b87-ae89-276ab9532856",
  },
  {
    id: "baa39f13-36d8-4fb5-8bbc-a67249c900d4",
    title: "Number of people caught in UK’s £100,000 tax trap doubles in four years",
    date: "2026-10-09",
    time: "11:00",
    url: "https://www.ft.com/content/baa39f13-36d8-4fb5-8bbc-a67249c900d4",
  },
  {
    id: "77b79f83-9dd1-49b1-be59-b5ca3c2ad5fd",
    title: "EU countries to overhaul financial market supervision",
    date: "2026-10-09",
    time: "10:54",
    url: "https://www.ft.com/content/77b79f83-9dd1-49b1-be59-b5ca3c2ad5fd",
  },
];
