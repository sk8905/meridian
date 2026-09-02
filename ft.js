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
  { id: "5eda86fe-1d2c-4a4e-9563-24a50aa734a4", title: "Uber to cut 10% of its global workforce", date: "2026-09-02", time: "13:25", url: "https://www.ft.com/content/5eda86fe-1d2c-4a4e-9563-24a50aa734a4" },
  { id: "f73d918c-efc4-4cc0-b6d7-be97a2ef3288", title: "Spain demands answers as police blame Morocco for migrant crisis", date: "2026-09-02", time: "13:12", url: "https://www.ft.com/content/f73d918c-efc4-4cc0-b6d7-be97a2ef3288" },
  { id: "f394d4ca-d035-4753-b7a0-f21eefa08252", title: "Japan’s borrowing costs hit 30-year high: what does it mean for global markets?", date: "2026-09-02", time: "13:03", url: "https://www.ft.com/content/f394d4ca-d035-4753-b7a0-f21eefa08252" },
  { id: "31885e65-bc12-4d05-9059-aa69c2a225e0", title: "Andy Burnham and Emmanuel Macron to meet as Bayeux Tapestry unveiled", date: "2026-09-02", time: "12:31", url: "https://www.ft.com/content/31885e65-bc12-4d05-9059-aa69c2a225e0" },
  { id: "978fbb75-14b1-4cb7-96b7-c761b4b9a8a6", title: "Growth is a life-and-death matter for Europe", date: "2026-09-02", time: "12:30", url: "https://www.ft.com/content/978fbb75-14b1-4cb7-96b7-c761b4b9a8a6" },
  { id: "3cd95c0c-4d62-4a74-8c66-34523bc2567d", title: "Indonesia’s lessons for the global energy transition", date: "2026-09-02", time: "12:00", url: "https://www.ft.com/content/3cd95c0c-4d62-4a74-8c66-34523bc2567d" },
  { id: "a76721db-36e1-4198-aad8-8c90137aace9", title: "Chevron pledges $7bn to double its Venezuela oil production", date: "2026-09-02", time: "11:56", url: "https://www.ft.com/content/a76721db-36e1-4198-aad8-8c90137aace9" },
  { id: "6436ce90-dd01-44dd-8f7c-b466cd813694", title: "Ford aims for Nato defence deals as it bids to build UK’s new military vehicle", date: "2026-09-02", time: "11:00", url: "https://www.ft.com/content/6436ce90-dd01-44dd-8f7c-b466cd813694" },
  { id: "9877ee0d-8c13-41b4-b102-9f2b280787ea", title: "The best, worst and strangest ways AI is really being used at work", date: "2026-09-02", time: "11:00", url: "https://www.ft.com/content/9877ee0d-8c13-41b4-b102-9f2b280787ea" },
  { id: "806ed56b-f5b2-4ae4-8164-231ccaebdd21", title: "Ukraine tells airlines to stop using Russian airspace", date: "2026-09-02", time: "09:57", url: "https://www.ft.com/content/806ed56b-f5b2-4ae4-8164-231ccaebdd21" },
  { id: "980bd114-fb96-479c-ac30-41435a9f78d0", title: "How worried should Labour be about holding Keir Starmer’s seat?", date: "2026-09-02", time: "09:30", url: "https://www.ft.com/content/980bd114-fb96-479c-ac30-41435a9f78d0" },
  { id: "69671716-02bb-496c-88ad-10befe4a9d63", title: "Xi Jinping visits Egypt in rare foreign travel flurry ahead of Donald Trump summit", date: "2026-09-02", time: "09:20", url: "https://www.ft.com/content/69671716-02bb-496c-88ad-10befe4a9d63" },
  { id: "f73c2c95-5c73-4b2f-9f00-9fa8c12c10c9", title: "European gas prices hit three-year high", date: "2026-09-02", time: "08:39", url: "https://www.ft.com/content/f73c2c95-5c73-4b2f-9f00-9fa8c12c10c9" },
  { id: "ca507448-a79f-4086-a402-5e8b79ebeebc", title: "Bvlgari’s Laura Burdese: ‘We don’t have this anxiety to keep on launching things’", date: "2026-09-02", time: "08:02", url: "https://www.ft.com/content/ca507448-a79f-4086-a402-5e8b79ebeebc" },
  { id: "d7e8d76b-d67b-46af-9d95-a384cb90b5d2", title: "BP names Ian Tyler as chair", date: "2026-09-02", time: "07:09", url: "https://www.ft.com/content/d7e8d76b-d67b-46af-9d95-a384cb90b5d2" },
  { id: "16081c0e-5471-4c00-8b12-29cac20a69d2", title: "France’s debt crisis-in-waiting", date: "2026-09-02", time: "06:30", url: "https://www.ft.com/content/16081c0e-5471-4c00-8b12-29cac20a69d2" },
  { id: "a8df319d-5733-4adb-ab46-c5f52451e4e3", title: "Germany loses its shine in the EU’s quest for green investment", date: "2026-09-02", time: "06:00", url: "https://www.ft.com/content/a8df319d-5733-4adb-ab46-c5f52451e4e3" },
  { id: "8ffc1886-f06f-4ac6-bb19-b9993d657712", title: "FTAV’s further reading", date: "2026-09-02", time: "06:00", url: "https://www.ft.com/content/8ffc1886-f06f-4ac6-bb19-b9993d657712" },
  { id: "bc2e4206-a702-4a66-8b94-2538fa249862", title: "FirstFT: US-Iran hostilities reignite", date: "2026-09-02", time: "05:31", url: "https://www.ft.com/content/bc2e4206-a702-4a66-8b94-2538fa249862" },
  { id: "958aa5ab-78e0-40cb-9a18-25e9fd5de233", title: "So how big *was* Bessent’s yentervention?", date: "2026-09-02", time: "05:30", url: "https://www.ft.com/content/958aa5ab-78e0-40cb-9a18-25e9fd5de233" },
  { id: "2a2d9bab-7441-446b-8e2e-7463583738c2", title: "Back to school: meet PE’s new headmasters", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/2a2d9bab-7441-446b-8e2e-7463583738c2" },
  { id: "638974ef-2f93-4d64-a118-980e9edb56b6", title: "Ukraine considers relaxing curfew rules despite Russian attacks", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/638974ef-2f93-4d64-a118-980e9edb56b6" },
  { id: "2a41f6a2-468b-44ae-bee7-a6159186c83c", title: "ECB must be prepared to lift interest rates further, says top policymaker", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/2a41f6a2-468b-44ae-bee7-a6159186c83c" },
  { id: "80d02797-9a54-47e0-8bc3-a7144354da93", title: "AI sounds the death knell for audit fee inflation", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/80d02797-9a54-47e0-8bc3-a7144354da93" },
  { id: "c51dec0b-977e-463e-9590-daff0d91a8a6", title: "The wheels are coming off the US world order", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/c51dec0b-977e-463e-9590-daff0d91a8a6" },
  { id: "1101d3c3-8355-4fbf-86b9-1761a56c19c2", title: "Notes on campy clothing (and Dolly Parton)", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/1101d3c3-8355-4fbf-86b9-1761a56c19c2" },
  { id: "7cce7c38-bce2-4718-b6e7-d0f4ae4c8751", title: "Protecting Tower of London views would make skyscrapers unviable, City warns", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/7cce7c38-bce2-4718-b6e7-d0f4ae4c8751" },
  { id: "1e55d948-98e5-4c1a-8a09-51e1311fcf63", title: "EU accelerates plans to break up diplomatic service", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/1e55d948-98e5-4c1a-8a09-51e1311fcf63" },
  { id: "8160b331-35c3-4735-a684-f1f2d95fddde", title: "‘Plan 2’ graduates earning less than £45,000 are unlikely to clear debts", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/8160b331-35c3-4735-a684-f1f2d95fddde" },
  { id: "c4cc661e-cb38-4d40-9d34-950c22e02301", title: "Kylian Mbappé-backed health start-up expands to west Africa", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/c4cc661e-cb38-4d40-9d34-950c22e02301" },
  { id: "2cedfbc4-0519-4373-8de0-63b9e62f1137", title: "I was wrong about Bad Girl Books", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/2cedfbc4-0519-4373-8de0-63b9e62f1137" },
  { id: "b0ea5b66-73f4-4e82-bacc-855072c0bffa", title: "How UK-Israel relations reached their worst point in decades", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/b0ea5b66-73f4-4e82-bacc-855072c0bffa" },
  { id: "5a3c1a4f-f6d1-49ef-badc-9a21c4111c93", title: "Want to eat like a real Chicagoan? Go to these three neighbourhoods", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/5a3c1a4f-f6d1-49ef-badc-9a21c4111c93" },
  { id: "76a9c61b-021f-482d-8978-6480e9ba23e8", title: "German industry pushes to increase work week to 40 hours", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/76a9c61b-021f-482d-8978-6480e9ba23e8" },
  { id: "e99bf461-e2e1-44bf-9b18-c5d20e9b5f7c", title: "Poet Arch Hades: ‘I don’t have to share a space with another human being’", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/e99bf461-e2e1-44bf-9b18-c5d20e9b5f7c" },
  { id: "b5e0d1b3-6f17-4250-a73f-ffcbe54709a6", title: "The modern face of the debutante ball", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/b5e0d1b3-6f17-4250-a73f-ffcbe54709a6" },
  { id: "1188b86e-b279-4cc7-a890-b4e2ce02cdc2", title: "Russia’s ‘Trojan horse’ in Italy tests Giorgia Meloni", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/1188b86e-b279-4cc7-a890-b4e2ce02cdc2" },
  { id: "0a019cc6-3ce3-4034-b88f-302a56888095", title: "Advisory firm Interpath looking for its own US deal", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/0a019cc6-3ce3-4034-b88f-302a56888095" },
  { id: "732c05fe-ca63-4048-8784-aebe80b8b1f4", title: "National data centre projects are consolidating America’s AI lead", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/732c05fe-ca63-4048-8784-aebe80b8b1f4" },
  { id: "6cf367bc-95b0-4f1f-b149-a25684adefc3", title: "Russia secretly helping Iran develop supersonic cruise missiles", date: "2026-09-01", time: "21:00", url: "https://www.ft.com/content/6cf367bc-95b0-4f1f-b149-a25684adefc3" },
  { id: "9334212a-3cc4-426c-9cbe-57cb48033603", title: "AI hits college graduates in the heart of America’s data centre boom", date: "2026-09-01", time: "19:28", url: "https://www.ft.com/content/9334212a-3cc4-426c-9cbe-57cb48033603" },
  { id: "c557ccc2-9fe7-4725-8a1c-c40a0948e8d3", title: "US launches further strikes on Iran as conflict flares up", date: "2026-09-01", time: "17:55", url: "https://www.ft.com/content/c557ccc2-9fe7-4725-8a1c-c40a0948e8d3" },
  { id: "239063eb-90c2-4086-8db3-a9f11a029209", title: "Andy Burnham promises to ‘bring back hope’ in first Commons appearance as PM", date: "2026-09-01", time: "17:49", url: "https://www.ft.com/content/239063eb-90c2-4086-8db3-a9f11a029209" },
  { id: "2ca5dfbf-f48b-4ffb-9ce9-9ff3e787a75e", title: "Germany blames Russia for Leipzig drone attack", date: "2026-09-01", time: "17:33", url: "https://www.ft.com/content/2ca5dfbf-f48b-4ffb-9ce9-9ff3e787a75e" },
];
