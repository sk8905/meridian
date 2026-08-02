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
  { id: "c9bd508c-2915-4b34-a5a5-553bff9548a5", title: "Iran says deal with Oman to manage shipping through Hormuz is close", date: "2026-08-02", time: "20:00", url: "https://www.ft.com/content/c9bd508c-2915-4b34-a5a5-553bff9548a5" },
  { id: "e9027253-e13c-460a-a4b1-f9047e5a6ca7", title: "AstraZeneca holds talks with Bristol Myers Squibb on $400bn megadeal", date: "2026-08-02", time: "19:30", url: "https://www.ft.com/content/e9027253-e13c-460a-a4b1-f9047e5a6ca7" },
  { id: "4ce36d22-571d-4532-8a8f-078e8fba34ff", title: "Monte dei Paschi explores Banco BPM takeover after ‘merger of equals’ talks collapse", date: "2026-08-02", time: "18:32", url: "https://www.ft.com/content/4ce36d22-571d-4532-8a8f-078e8fba34ff" },
  { id: "21896669-cce4-43cb-8e7b-e40520e9ac91", title: "Earnings season reaches a peak", date: "2026-08-02", time: "18:15", url: "https://www.ft.com/content/21896669-cce4-43cb-8e7b-e40520e9ac91" },
  { id: "162287ce-0267-47e9-aeee-16f93d3fc309", title: "A red card for the boss of world football", date: "2026-08-02", time: "17:17", url: "https://www.ft.com/content/162287ce-0267-47e9-aeee-16f93d3fc309" },
  { id: "b4f150ea-9ea3-4bb4-b1e0-014cf1f0df26", title: "America’s biggest companies report ‘rock solid’ profits as consumers face higher costs", date: "2026-08-02", time: "17:00", url: "https://www.ft.com/content/b4f150ea-9ea3-4bb4-b1e0-014cf1f0df26" },
  { id: "8faf28df-bb76-49e6-a916-55faa8a5d4a8", title: "Europe’s weak reaction to Spain’s migrant crisis", date: "2026-08-02", time: "16:53", url: "https://www.ft.com/content/8faf28df-bb76-49e6-a916-55faa8a5d4a8" },
  { id: "a01171e8-f8a1-4e2c-b3f7-f79f9cd11651", title: "Morocco counts its dead and missing after mass swim to Ceuta", date: "2026-08-02", time: "16:21", url: "https://www.ft.com/content/a01171e8-f8a1-4e2c-b3f7-f79f9cd11651" },
  { id: "f438f3c0-d309-4687-b265-ba775b24044d", title: "How to save the British high street", date: "2026-08-02", time: "16:00", url: "https://www.ft.com/content/f438f3c0-d309-4687-b265-ba775b24044d" },
  { id: "a4539dc2-dcb0-4b57-9a78-c32cb1f9eda1", title: "Hungary braced for power cuts amid extreme drought", date: "2026-08-02", time: "15:18", url: "https://www.ft.com/content/a4539dc2-dcb0-4b57-9a78-c32cb1f9eda1" },
  { id: "9dea3dc5-2045-430b-81fb-02b9c3126e90", title: "Rupert Lowe offers to find ‘common way forward’ with Reform UK", date: "2026-08-02", time: "13:24", url: "https://www.ft.com/content/9dea3dc5-2045-430b-81fb-02b9c3126e90" },
  { id: "06ec1b03-d4af-40cf-b12a-4ba5a410f6d2", title: "‘Crush this lady’: how eBay harassment campaign led to $56mn payout", date: "2026-08-02", time: "13:00", url: "https://www.ft.com/content/06ec1b03-d4af-40cf-b12a-4ba5a410f6d2" },
  { id: "18ccb15a-f8ed-41ba-a948-7c62cd757274", title: "Walter insurers paid millions of dollars to credit rating provider Egan-Jones", date: "2026-08-02", time: "13:00", url: "https://www.ft.com/content/18ccb15a-f8ed-41ba-a948-7c62cd757274" },
  { id: "b3042c38-c38c-48f9-aa8c-99901ed440a9", title: "Will July’s US employment data prompt a rethink on rates?", date: "2026-08-02", time: "12:00", url: "https://www.ft.com/content/b3042c38-c38c-48f9-aa8c-99901ed440a9" },
  { id: "9f81d98b-ac0f-4650-8d3b-6b596c50bae2", title: "What percentage of UK households are net contributors?", date: "2026-08-02", time: "12:00", url: "https://www.ft.com/content/9f81d98b-ac0f-4650-8d3b-6b596c50bae2" },
  { id: "889c551a-88ab-451a-87f5-cdec65467a64", title: "‘Voters have had it’: influence of pro-Israel lobby group sparks backlash in the US", date: "2026-08-02", time: "11:00", url: "https://www.ft.com/content/889c551a-88ab-451a-87f5-cdec65467a64" },
  { id: "3f651fa0-3362-4a16-9ac1-992291c5f68a", title: "Morgan Stanley’s IPO after-party: a wealth management bonanza", date: "2026-08-02", time: "11:00", url: "https://www.ft.com/content/3f651fa0-3362-4a16-9ac1-992291c5f68a" },
  { id: "a29819ef-ffb9-4d2a-9925-e3d6e6e6e797", title: "Iran sets the pace in war with Trump", date: "2026-08-02", time: "06:37", url: "https://www.ft.com/content/a29819ef-ffb9-4d2a-9925-e3d6e6e6e797" },
  { id: "fbc26742-c2a8-4509-ad13-8ad61139f41f", title: "Who needs junior markets like Aim anyway?", date: "2026-08-02", time: "05:00", url: "https://www.ft.com/content/fbc26742-c2a8-4509-ad13-8ad61139f41f" },
  { id: "43ecc4d5-202b-42f5-beb9-9aecca919f6d", title: "Air France-KLM targets easyJet passengers during takeover turmoil", date: "2026-08-02", time: "05:00", url: "https://www.ft.com/content/43ecc4d5-202b-42f5-beb9-9aecca919f6d" },
  { id: "6a987490-f3f8-45f7-8b1c-fd09d9fa874d", title: "Italy’s Giorgia Meloni bets big on nuclear power revival", date: "2026-08-02", time: "05:00", url: "https://www.ft.com/content/6a987490-f3f8-45f7-8b1c-fd09d9fa874d" },
  { id: "b15dbbf8-d479-4be6-ba3c-c7e6831fbcca", title: "MPs call for routine lead testing for children near abandoned mines", date: "2026-08-02", time: "05:00", url: "https://www.ft.com/content/b15dbbf8-d479-4be6-ba3c-c7e6831fbcca" },
  { id: "edf72126-a478-4d2d-9825-761a9562fd47", title: "Freemasons seek a new generation of members", date: "2026-08-02", time: "05:00", url: "https://www.ft.com/content/edf72126-a478-4d2d-9825-761a9562fd47" },
  { id: "cf204cc3-fe8e-4950-a84d-6884f54b7248", title: "Foreign bidders woo UK companies with ‘bear hug’ takeover offers", date: "2026-08-02", time: "05:00", url: "https://www.ft.com/content/cf204cc3-fe8e-4950-a84d-6884f54b7248" },
  { id: "4532122d-90f2-4433-9df6-ca99d8a141d2", title: "Apple struggles to keep pace with AI ‘bug’ hunters", date: "2026-08-02", time: "05:00", url: "https://www.ft.com/content/4532122d-90f2-4433-9df6-ca99d8a141d2" },
  { id: "e345d51f-11f7-4d4d-8f09-86dd3a225597", title: "German carmakers flood jobs market with managers after wielding axe", date: "2026-08-02", time: "05:00", url: "https://www.ft.com/content/e345d51f-11f7-4d4d-8f09-86dd3a225597" },
  { id: "6a3abcca-1477-4daa-9481-1a63492601a9", title: "Don’t pretend jokes can’t lead to political violence", date: "2026-08-02", time: "05:00", url: "https://www.ft.com/content/6a3abcca-1477-4daa-9481-1a63492601a9" },
  { id: "9cb84920-075e-4fa4-b1cb-dfc55d5845f4", title: "Donald Trump cancels new strikes on Iran after Middle East allies’ request", date: "2026-08-02", time: "04:01", url: "https://www.ft.com/content/9cb84920-075e-4fa4-b1cb-dfc55d5845f4" },
  { id: "89450629-32d9-495e-b287-42156e1aa68a", title: "Australian farmers in trade dispute over pineapple import plan", date: "2026-08-02", time: "03:25", url: "https://www.ft.com/content/89450629-32d9-495e-b287-42156e1aa68a" },
  { id: "e6e4d553-2474-43e4-bc25-0f1cb952f66d", title: "Chinese VC firms rush to raise funds after 3-year drought", date: "2026-08-02", time: "03:00", url: "https://www.ft.com/content/e6e4d553-2474-43e4-bc25-0f1cb952f66d" },
  { id: "a551d1be-80a1-4d3c-8498-b1f82fdb0e41", title: "Spain pushes migrants home as Ceuta vents over ‘invasion’", date: "2026-08-01", time: "23:43", url: "https://www.ft.com/content/a551d1be-80a1-4d3c-8498-b1f82fdb0e41" },
  { id: "72e4bd53-2e4f-420a-aa44-4de486a0ab19", title: "Burnham says devolution plan paves the way for a written UK constitution", date: "2026-08-01", time: "19:14", url: "https://www.ft.com/content/72e4bd53-2e4f-420a-aa44-4de486a0ab19" },
  { id: "0f9b2fe7-bde4-4f5f-b49e-93ccb5da9ea8", title: "US Treasury undertakes historic intervention in yen market", date: "2026-08-01", time: "16:26", url: "https://www.ft.com/content/0f9b2fe7-bde4-4f5f-b49e-93ccb5da9ea8" },
  { id: "c0d97297-98ed-452f-bdfd-1f16d53d4eb3", title: "Gianni Infantino’s U-turn fuels doubts about his future at Fifa", date: "2026-08-01", time: "14:00", url: "https://www.ft.com/content/c0d97297-98ed-452f-bdfd-1f16d53d4eb3" },
  { id: "6abf82dc-6b66-4fc7-8bf7-aa196dbd8e97", title: "Massive US tungsten discovery could run into Nasa roadblock", date: "2026-08-01", time: "13:00", url: "https://www.ft.com/content/6abf82dc-6b66-4fc7-8bf7-aa196dbd8e97" },
  { id: "1b3f09b5-897e-4b7a-9949-2c4d9a32929e", title: "Sánchez hits out at EU leaders over criticism of Spain’s migrant crisis", date: "2026-08-01", time: "11:46", url: "https://www.ft.com/content/1b3f09b5-897e-4b7a-9949-2c4d9a32929e" },
  { id: "42257873-e801-49b8-967f-a15ea1129541", title: "Chart of the Week: Warsh spooks long bonds", date: "2026-08-01", time: "10:30", url: "https://www.ft.com/content/42257873-e801-49b8-967f-a15ea1129541" },
  { id: "58400cf0-20df-46ef-975b-7414806e09de", title: "Fifa abandons $20bn investment plan after global backlash", date: "2026-08-01", time: "09:44", url: "https://www.ft.com/content/58400cf0-20df-46ef-975b-7414806e09de" },
  { id: "f0581480-8129-413c-823f-4b5c85b1419e", title: "Gianni Infantino’s gamble fails", date: "2026-08-01", time: "09:00", url: "https://www.ft.com/content/f0581480-8129-413c-823f-4b5c85b1419e" },
  { id: "016ad17d-0cab-48f1-8d7f-d3eb1634be63", title: "Six teenagers, a brutal murder and the story they couldn’t take back", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/016ad17d-0cab-48f1-8d7f-d3eb1634be63" },
];
