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
  { id: "b71bfe10-29a0-4213-92a2-22765c44c190", title: "BP gets the chair it wants rather than the one it needed", date: "2026-09-02", time: "17:49", url: "https://www.ft.com/content/b71bfe10-29a0-4213-92a2-22765c44c190" },
  { id: "5040d26d-520c-455f-a1e8-111d011acdb6", title: "California opines on who profits from wildfires but not on who pays", date: "2026-09-02", time: "17:45", url: "https://www.ft.com/content/5040d26d-520c-455f-a1e8-111d011acdb6" },
  { id: "3d2590e0-b166-494e-ab6b-e6c20c75c59e", title: "The Restore Britain backer who once gave money to the Lib Dems", date: "2026-09-02", time: "17:30", url: "https://www.ft.com/content/3d2590e0-b166-494e-ab6b-e6c20c75c59e" },
  { id: "c4f84da3-bfc6-49a0-90bd-9a1611864ac4", title: "AI spots cyber gaps faster than financial firms can fix them", date: "2026-09-02", time: "17:25", url: "https://www.ft.com/content/c4f84da3-bfc6-49a0-90bd-9a1611864ac4" },
  { id: "c9c3a0ef-98d5-4aeb-9d20-e6250d6fcf99", title: "Students and opposition activists targeted with spyware in Serbia", date: "2026-09-02", time: "16:48", url: "https://www.ft.com/content/c9c3a0ef-98d5-4aeb-9d20-e6250d6fcf99" },
  { id: "9fa4fcb7-14f0-4461-87aa-4fbdf1fe64f4", title: "UK mortgage borrowers urged to lock in deals before rates rise", date: "2026-09-02", time: "16:42", url: "https://www.ft.com/content/9fa4fcb7-14f0-4461-87aa-4fbdf1fe64f4" },
  { id: "5b8f840e-f47c-452a-a99b-a79044ddf7c7", title: "Tory attempts to repeal the UK Climate Act are tin-eared", date: "2026-09-02", time: "16:27", url: "https://www.ft.com/content/5b8f840e-f47c-452a-a99b-a79044ddf7c7" },
  { id: "c04aa126-0764-42e9-b39c-b25997eb2afa", title: "ENRC settles with UK prosecutors and former lawyers over abandoned probe", date: "2026-09-02", time: "16:22", url: "https://www.ft.com/content/c04aa126-0764-42e9-b39c-b25997eb2afa" },
  { id: "bbb04f65-7cdd-4ba2-8f82-96158ff40d63", title: "Rival Ukrainian intelligence agencies reportedly in street shootout in Kyiv", date: "2026-09-02", time: "16:12", url: "https://www.ft.com/content/bbb04f65-7cdd-4ba2-8f82-96158ff40d63" },
  { id: "55ea0ee5-d067-4fc0-81cb-82293e9285de", title: "Andy Burnham seeks to reassure bond markets amid public spending fears", date: "2026-09-02", time: "16:10", url: "https://www.ft.com/content/55ea0ee5-d067-4fc0-81cb-82293e9285de" },
  { id: "38d5c39f-901f-4306-9412-f7e1d7553174", title: "A key tenet of US equity markets is under threat", date: "2026-09-02", time: "15:45", url: "https://www.ft.com/content/38d5c39f-901f-4306-9412-f7e1d7553174" },
  { id: "5eda86fe-1d2c-4a4e-9563-24a50aa734a4", title: "Uber to axe 10% of its workforce in biggest cuts since pandemic", date: "2026-09-02", time: "15:25", url: "https://www.ft.com/content/5eda86fe-1d2c-4a4e-9563-24a50aa734a4" },
  { id: "806ed56b-f5b2-4ae4-8164-231ccaebdd21", title: "Ukraine tells airlines to stop using Russian airspace", date: "2026-09-02", time: "14:56", url: "https://www.ft.com/content/806ed56b-f5b2-4ae4-8164-231ccaebdd21" },
  { id: "f73c2c95-5c73-4b2f-9f00-9fa8c12c10c9", title: "Energy price surge hits bond markets as European gas reaches three-year high", date: "2026-09-02", time: "14:36", url: "https://www.ft.com/content/f73c2c95-5c73-4b2f-9f00-9fa8c12c10c9" },
  { id: "c557ccc2-9fe7-4725-8a1c-c40a0948e8d3", title: "US launches further strikes on Iran as conflict flares up", date: "2026-09-02", time: "14:30", url: "https://www.ft.com/content/c557ccc2-9fe7-4725-8a1c-c40a0948e8d3" },
  { id: "39224d70-632e-4cac-ae1c-59f7efbbccaf", title: "FT Wealth: September", date: "2026-09-02", time: "13:54", url: "https://www.ft.com/content/39224d70-632e-4cac-ae1c-59f7efbbccaf" },
  { id: "f73d918c-efc4-4cc0-b6d7-be97a2ef3288", title: "Spain demands answers as police blame Morocco for migrant crisis", date: "2026-09-02", time: "13:12", url: "https://www.ft.com/content/f73d918c-efc4-4cc0-b6d7-be97a2ef3288" },
  { id: "f394d4ca-d035-4753-b7a0-f21eefa08252", title: "Japan’s borrowing costs hit 30-year high: what does it mean for global markets?", date: "2026-09-02", time: "13:03", url: "https://www.ft.com/content/f394d4ca-d035-4753-b7a0-f21eefa08252" },
  { id: "2ca5dfbf-f48b-4ffb-9ce9-9ff3e787a75e", title: "Germany blames Russia for Leipzig drone attack", date: "2026-09-02", time: "13:00", url: "https://www.ft.com/content/2ca5dfbf-f48b-4ffb-9ce9-9ff3e787a75e" },
  { id: "31885e65-bc12-4d05-9059-aa69c2a225e0", title: "Andy Burnham and Emmanuel Macron to meet as Bayeux Tapestry unveiled", date: "2026-09-02", time: "12:31", url: "https://www.ft.com/content/31885e65-bc12-4d05-9059-aa69c2a225e0" },
  { id: "978fbb75-14b1-4cb7-96b7-c761b4b9a8a6", title: "Growth is a life-and-death matter for Europe", date: "2026-09-02", time: "12:30", url: "https://www.ft.com/content/978fbb75-14b1-4cb7-96b7-c761b4b9a8a6" },
  { id: "3cd95c0c-4d62-4a74-8c66-34523bc2567d", title: "Indonesia’s lessons for the global energy transition", date: "2026-09-02", time: "12:00", url: "https://www.ft.com/content/3cd95c0c-4d62-4a74-8c66-34523bc2567d" },
  { id: "a76721db-36e1-4198-aad8-8c90137aace9", title: "Chevron to double Venezuela oil production with $7bn pledge", date: "2026-09-02", time: "11:56", url: "https://www.ft.com/content/a76721db-36e1-4198-aad8-8c90137aace9" },
  { id: "bc2e4206-a702-4a66-8b94-2538fa249862", title: "FirstFT: US-Iran hostilities reignite surge in energy prices", date: "2026-09-02", time: "11:05", url: "https://www.ft.com/content/bc2e4206-a702-4a66-8b94-2538fa249862" },
  { id: "6436ce90-dd01-44dd-8f7c-b466cd813694", title: "Ford aims for Nato defence deals as it bids to build UK’s new military vehicle", date: "2026-09-02", time: "11:00", url: "https://www.ft.com/content/6436ce90-dd01-44dd-8f7c-b466cd813694" },
  { id: "9877ee0d-8c13-41b4-b102-9f2b280787ea", title: "The best, worst and strangest ways AI is really being used at work", date: "2026-09-02", time: "11:00", url: "https://www.ft.com/content/9877ee0d-8c13-41b4-b102-9f2b280787ea" },
  { id: "5395d772-5c4b-4218-8190-e0997411e061", title: "What happened when Grima went to the diamond house of Hancocks?", date: "2026-09-02", time: "11:00", url: "https://www.ft.com/content/5395d772-5c4b-4218-8190-e0997411e061" },
  { id: "980bd114-fb96-479c-ac30-41435a9f78d0", title: "How worried should Labour be about holding Keir Starmer’s seat?", date: "2026-09-02", time: "09:30", url: "https://www.ft.com/content/980bd114-fb96-479c-ac30-41435a9f78d0" },
  { id: "69671716-02bb-496c-88ad-10befe4a9d63", title: "Xi Jinping visits Egypt in rare foreign travel flurry ahead of Donald Trump summit", date: "2026-09-02", time: "09:20", url: "https://www.ft.com/content/69671716-02bb-496c-88ad-10befe4a9d63" },
  { id: "ca507448-a79f-4086-a402-5e8b79ebeebc", title: "Bvlgari’s Laura Burdese: ‘We don’t have this anxiety to keep on launching things’", date: "2026-09-02", time: "08:02", url: "https://www.ft.com/content/ca507448-a79f-4086-a402-5e8b79ebeebc" },
  { id: "d7e8d76b-d67b-46af-9d95-a384cb90b5d2", title: "BP names Ian Tyler as chair", date: "2026-09-02", time: "07:09", url: "https://www.ft.com/content/d7e8d76b-d67b-46af-9d95-a384cb90b5d2" },
  { id: "16081c0e-5471-4c00-8b12-29cac20a69d2", title: "France’s debt crisis-in-waiting", date: "2026-09-02", time: "06:30", url: "https://www.ft.com/content/16081c0e-5471-4c00-8b12-29cac20a69d2" },
  { id: "a8df319d-5733-4adb-ab46-c5f52451e4e3", title: "Germany loses its shine in the EU’s quest for green investment", date: "2026-09-02", time: "06:00", url: "https://www.ft.com/content/a8df319d-5733-4adb-ab46-c5f52451e4e3" },
  { id: "8ffc1886-f06f-4ac6-bb19-b9993d657712", title: "FTAV’s further reading", date: "2026-09-02", time: "06:00", url: "https://www.ft.com/content/8ffc1886-f06f-4ac6-bb19-b9993d657712" },
  { id: "958aa5ab-78e0-40cb-9a18-25e9fd5de233", title: "So how big *was* Bessent’s yentervention?", date: "2026-09-02", time: "05:30", url: "https://www.ft.com/content/958aa5ab-78e0-40cb-9a18-25e9fd5de233" },
  { id: "2a2d9bab-7441-446b-8e2e-7463583738c2", title: "Back to school: meet PE’s new headmasters", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/2a2d9bab-7441-446b-8e2e-7463583738c2" },
  { id: "638974ef-2f93-4d64-a118-980e9edb56b6", title: "Ukraine considers relaxing curfew rules despite Russian attacks", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/638974ef-2f93-4d64-a118-980e9edb56b6" },
  { id: "2a41f6a2-468b-44ae-bee7-a6159186c83c", title: "ECB must be prepared to lift interest rates further, says top policymaker", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/2a41f6a2-468b-44ae-bee7-a6159186c83c" },
  { id: "80d02797-9a54-47e0-8bc3-a7144354da93", title: "AI sounds the death knell for audit fee inflation", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/80d02797-9a54-47e0-8bc3-a7144354da93" },
  { id: "c51dec0b-977e-463e-9590-daff0d91a8a6", title: "The wheels are coming off the US world order", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/c51dec0b-977e-463e-9590-daff0d91a8a6" },
  { id: "1101d3c3-8355-4fbf-86b9-1761a56c19c2", title: "Notes on campy clothing (and Dolly Parton)", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/1101d3c3-8355-4fbf-86b9-1761a56c19c2" },
];
