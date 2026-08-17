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
  { id: "895ca028-33c7-4295-bf8c-13a3121b80ac", title: "The realignment of the Middle East", date: "2026-08-17", time: "15:12", url: "https://www.ft.com/content/895ca028-33c7-4295-bf8c-13a3121b80ac" },
  { id: "49eac9fc-1b9c-4e80-8ed0-c52afc3aa376", title: "Reform UK’s deputy leader tells Britons to ‘enjoy’ heat amid record drought", date: "2026-08-17", time: "15:00", url: "https://www.ft.com/content/49eac9fc-1b9c-4e80-8ed0-c52afc3aa376" },
  { id: "a33467c0-ef18-4ff8-9f56-b5c7a79dbc85", title: "Manchester’s towering ambition shows in its new skyline", date: "2026-08-17", time: "14:58", url: "https://www.ft.com/content/a33467c0-ef18-4ff8-9f56-b5c7a79dbc85" },
  { id: "82a4b183-7201-4789-95b7-e39e81c827bc", title: "Nvidia to invest $100bn for OpenAI data centre in Ohio", date: "2026-08-17", time: "14:57", url: "https://www.ft.com/content/82a4b183-7201-4789-95b7-e39e81c827bc" },
  { id: "e34c097f-0f5d-49b8-8142-967842ba6c42", title: "Reform UK vows to block foreign nationals from claiming benefits if it wins power", date: "2026-08-17", time: "12:15", url: "https://www.ft.com/content/e34c097f-0f5d-49b8-8142-967842ba6c42" },
  { id: "b9b1c9d7-a7a1-4b6f-bcb0-910ceb025f2b", title: "UK government to pay KPMG and EY up to £456mn to train civil servants", date: "2026-08-17", time: "13:42", url: "https://www.ft.com/content/b9b1c9d7-a7a1-4b6f-bcb0-910ceb025f2b" },
  { id: "35be5ef3-4ea3-444d-b509-2fb00a9940c9", title: "Barclays shakes up investment bank less than 3 years since last overhaul", date: "2026-08-17", time: "13:40", url: "https://www.ft.com/content/35be5ef3-4ea3-444d-b509-2fb00a9940c9" },
  { id: "29f1af13-ecc3-4f26-a479-e6088c67231b", title: "US midterm elections 2026: The FT’s guide", date: "2026-08-17", time: "12:44", url: "https://www.ft.com/content/29f1af13-ecc3-4f26-a479-e6088c67231b" },
  { id: "83d287ed-43e2-466d-9490-06879efb04fc", title: "Donald Trump’s war on customs fraud will be costly and difficult", date: "2026-08-17", time: "12:31", url: "https://www.ft.com/content/83d287ed-43e2-466d-9490-06879efb04fc" },
  { id: "d4d07198-498d-48d1-9e54-85f1febcd070", title: "Trump threatens to bomb Oman if it ‘gets in the way’ of US-Iran negotiations", date: "2026-08-17", time: "12:25", url: "https://www.ft.com/content/d4d07198-498d-48d1-9e54-85f1febcd070" },
  { id: "51089f41-6f8b-4381-aab5-a83bbe4048c4", title: "Smoking is back, brilliant new road bikes and the rise of the one-carat ring – don’t miss HTSI’s most popular reads", date: "2026-08-17", time: "10:55", url: "https://www.ft.com/content/51089f41-6f8b-4381-aab5-a83bbe4048c4" },
  { id: "6529c240-13a6-4923-bb76-17d2baf2c733", title: "And the FTAV chart quiz winner is . . .", date: "2026-08-17", time: "10:24", url: "https://www.ft.com/content/6529c240-13a6-4923-bb76-17d2baf2c733" },
  { id: "3bfdcb4f-3342-4fec-bdcf-ca92e13474da", title: "Japanese second-quarter growth weaker than expected", date: "2026-08-17", time: "10:19", url: "https://www.ft.com/content/3bfdcb4f-3342-4fec-bdcf-ca92e13474da" },
  { id: "e04f286c-f5ed-46d1-8e3f-0bbe4cce4d3e", title: "People are worried about America’s solvency", date: "2026-08-17", time: "10:15", url: "https://www.ft.com/content/e04f286c-f5ed-46d1-8e3f-0bbe4cce4d3e" },
  { id: "eea1da3e-1c1c-4957-ad9d-f0372b2694f0", title: "Jared Kushner holds talks with Benjamin Netanyahu after meeting Hamas leader", date: "2026-08-17", time: "09:26", url: "https://www.ft.com/content/eea1da3e-1c1c-4957-ad9d-f0372b2694f0" },
  { id: "a1079593-c334-444e-84a1-2ef65839f1a7", title: "Andy Burnham exchanged text messages with White House spoofer", date: "2026-08-17", time: "09:11", url: "https://www.ft.com/content/a1079593-c334-444e-84a1-2ef65839f1a7" },
  { id: "8889375a-bcaa-4539-a000-c89b73dbcf4c", title: "Donald Trump orders Pentagon to scale back military drills with South Korea", date: "2026-08-17", time: "08:39", url: "https://www.ft.com/content/8889375a-bcaa-4539-a000-c89b73dbcf4c" },
  { id: "340bf9e7-0e67-4d19-b671-3dc8186efb99", title: "A leaderboard of the biggest trading losses of all time*", date: "2026-08-17", time: "08:28", url: "https://www.ft.com/content/340bf9e7-0e67-4d19-b671-3dc8186efb99" },
  { id: "09a8a200-e572-486e-9bff-1f57933aebfc", title: "China’s economy shows signs of weakness in July", date: "2026-08-17", time: "08:23", url: "https://www.ft.com/content/09a8a200-e572-486e-9bff-1f57933aebfc" },
  { id: "d794e389-2122-481d-8fa3-328e33480ee5", title: "FirstFT: Dimon warns UK against higher bank taxes", date: "2026-08-17", time: "07:00", url: "https://www.ft.com/content/d794e389-2122-481d-8fa3-328e33480ee5" },
  { id: "1b767cbb-a71c-47ca-b5ed-a8942cd94e39", title: "Broken FIMA", date: "2026-08-17", time: "06:30", url: "https://www.ft.com/content/1b767cbb-a71c-47ca-b5ed-a8942cd94e39" },
  { id: "49e5c44c-fa4b-4534-809a-dc91969ba86f", title: "FTAV’s further reading", date: "2026-08-17", time: "06:00", url: "https://www.ft.com/content/49e5c44c-fa4b-4534-809a-dc91969ba86f" },
  { id: "1d319839-1c40-4035-b058-5ca2389cafd0", title: "Japan’s 10-year bond yield hits three-decade high", date: "2026-08-17", time: "05:35", url: "https://www.ft.com/content/1d319839-1c40-4035-b058-5ca2389cafd0" },
  { id: "719c8108-f4ae-466b-80f4-96f26558d642", title: "Higgsfield valued at $5.4bn as Goldman and Intel back AI video start-up", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/719c8108-f4ae-466b-80f4-96f26558d642" },
  { id: "67acde0d-4154-4332-b33b-2d03d3a86007", title: "Private credit under strain as troubled loans swell", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/67acde0d-4154-4332-b33b-2d03d3a86007" },
  { id: "2fb7f9b7-58dc-4909-94fa-8e753b7be47d", title: "War and climate change drive surge in cost of shipping through global chokepoints", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/2fb7f9b7-58dc-4909-94fa-8e753b7be47d" },
  { id: "cc394cdf-ef78-4ec4-ab49-775e1a292751", title: "Andy Burnham faces climate test over North Sea oil decision", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/cc394cdf-ef78-4ec4-ab49-775e1a292751" },
  { id: "982229c8-a116-4679-8b4b-627df069ce66", title: "The cost of drought", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/982229c8-a116-4679-8b4b-627df069ce66" },
  { id: "ec594b62-1453-4044-9a0b-129ecdf86150", title: "Air conditioning becomes ‘must-have’ for overheated London office workers", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/ec594b62-1453-4044-9a0b-129ecdf86150" },
  { id: "5f6cdb7a-3b05-487f-a02e-3b9fb0b42e00", title: "America and the politics of respect", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/5f6cdb7a-3b05-487f-a02e-3b9fb0b42e00" },
  { id: "ff2186b0-be40-4b8e-8b5c-80ece92a30b2", title: "The wrong lessons are being drawn over worries on public equities", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/ff2186b0-be40-4b8e-8b5c-80ece92a30b2" },
  { id: "c5e27ffb-cfb1-421b-8121-a402cf2d84ac", title: "How Maga came for Europe", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/c5e27ffb-cfb1-421b-8121-a402cf2d84ac" },
  { id: "e2f72d88-28b5-461c-b0b5-0448b6209362", title: "The Ritz-Carlton, Melbourne: luxury with altitude", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/e2f72d88-28b5-461c-b0b5-0448b6209362" },
  { id: "37734db7-93d6-4302-934b-41430f808c10", title: "Author Helena Attlee: ‘We British live with dogs and cats and junk on every surface’", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/37734db7-93d6-4302-934b-41430f808c10" },
  { id: "3163af73-e7d0-4e21-81af-963d6c2fce45", title: "Portugal and Spain struggle as EU housing black spots", date: "2026-08-17", time: "05:00", url: "https://www.ft.com/content/3163af73-e7d0-4e21-81af-963d6c2fce45" },
  { id: "3ffa645f-9e28-40ee-a9d7-cea7148544d1", title: "The art of the goodbye message", date: "2026-08-17", time: "04:00", url: "https://www.ft.com/content/3ffa645f-9e28-40ee-a9d7-cea7148544d1" },
  { id: "db29304b-6a28-4e12-8125-3f9658efb89e", title: "Olympus boss tries to beat buyout firms at their own game", date: "2026-08-17", time: "02:21", url: "https://www.ft.com/content/db29304b-6a28-4e12-8125-3f9658efb89e" },
  { id: "2f705a5a-2c4e-4bca-b08a-ed9372ef3b2e", title: "The next China shock will come from open-source AI", date: "2026-08-17", time: "02:00", url: "https://www.ft.com/content/2f705a5a-2c4e-4bca-b08a-ed9372ef3b2e" },
  { id: "44c08ae9-f209-4992-8744-cfff430eca07", title: "Jamie Dimon warns UK chancellor against higher bank taxes", date: "2026-08-16", time: "20:00", url: "https://www.ft.com/content/44c08ae9-f209-4992-8744-cfff430eca07" },
  { id: "f6b953fc-a6ad-48cd-bed1-d42619b57d94", title: "Far-right Israeli minister advocates killing ‘30 to 40’ Gazans each night", date: "2026-08-16", time: "19:43", url: "https://www.ft.com/content/f6b953fc-a6ad-48cd-bed1-d42619b57d94" },
];
