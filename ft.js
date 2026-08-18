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
  { id: "8cafeb3f-f11b-41ba-a67c-61072823eeb4", title: "FirstFT: Asian doubts over US resolve", date: "2026-08-18", time: "07:01", url: "https://www.ft.com/content/8cafeb3f-f11b-41ba-a67c-61072823eeb4" },
  { id: "c3223b7c-6683-42df-9e60-9dbd2dbdfe07", title: "China’s 10-year bond yield falls to 13-month low", date: "2026-08-18", time: "06:45", url: "https://www.ft.com/content/c3223b7c-6683-42df-9e60-9dbd2dbdfe07" },
  { id: "b2cbbab2-a51a-48f2-a9da-86d858cd4e86", title: "AI: like a debt machine", date: "2026-08-18", time: "06:30", url: "https://www.ft.com/content/b2cbbab2-a51a-48f2-a9da-86d858cd4e86" },
  { id: "b2c808ec-a67f-4a72-b5b7-a05a5a3036c3", title: "FTAV’s further reading", date: "2026-08-18", time: "06:00", url: "https://www.ft.com/content/b2c808ec-a67f-4a72-b5b7-a05a5a3036c3" },
  { id: "ba3782d6-709b-472c-aa02-e0ffb1c89d87", title: "Mark Walter’s empire of assets and liabilities", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/ba3782d6-709b-472c-aa02-e0ffb1c89d87" },
  { id: "1d713822-e68f-4476-be94-ffab3418bfe4", title: "Donald Trump’s cuts to military drills stir doubts about US resolve in Asia", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/1d713822-e68f-4476-be94-ffab3418bfe4" },
  { id: "418e0159-d2d1-4432-a7b3-de0cc446ef08", title: "UK examines economic hit from loss of access to frontier AI models", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/418e0159-d2d1-4432-a7b3-de0cc446ef08" },
  { id: "748b1e8c-63f4-4eca-8103-d9d148cac00c", title: "Andy Burnham faces EU clash over youth scheme as summit looms", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/748b1e8c-63f4-4eca-8103-d9d148cac00c" },
  { id: "6913fe7f-3ad8-47e6-8310-7caba5f5d58c", title: "Top UK civil servant received record £500,000 payout after Starmer sacking", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/6913fe7f-3ad8-47e6-8310-7caba5f5d58c" },
  { id: "5f927594-03a1-4652-8189-2aa7a19dcec4", title: "The difficult truth about Jason Arday", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/5f927594-03a1-4652-8189-2aa7a19dcec4" },
  { id: "03c8edc6-92ee-4eb9-a83a-441e839a6317", title: "Burger King is taking a bite out of McDonald’s lunch", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/03c8edc6-92ee-4eb9-a83a-441e839a6317" },
  { id: "4fcd8647-e3ba-4cd8-8dc0-4b0ff473cf39", title: "Why eyewear stores are taking over London’s high streets", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/4fcd8647-e3ba-4cd8-8dc0-4b0ff473cf39" },
  { id: "d88a8878-425d-4225-bda4-576c6c42734e", title: "Trump ballroom official held quiet Kremlin talks", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/d88a8878-425d-4225-bda4-576c6c42734e" },
  { id: "cf29e18e-c4d8-4a27-b7c7-3cf56d6eccf2", title: "Can canned cocktails revive the booze business?", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/cf29e18e-c4d8-4a27-b7c7-3cf56d6eccf2" },
  { id: "a9947be4-5c0c-47ee-acae-a2aeaf01a0a0", title: "AI hasn’t gone rogue. It’s worse than that", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/a9947be4-5c0c-47ee-acae-a2aeaf01a0a0" },
  { id: "770c003e-17bc-4bf5-8f5a-3f45a4f15c36", title: "Europe still needs forward guidance — but not as a straitjacket", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/770c003e-17bc-4bf5-8f5a-3f45a4f15c36" },
  { id: "351cf8e1-cdef-46a9-ac32-b2e76c72ed1a", title: "Chris Hohn’s hedge fund TCI bets on Italian luxury hotels", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/351cf8e1-cdef-46a9-ac32-b2e76c72ed1a" },
  { id: "71541304-d965-415d-82a3-387775cdb773", title: "Libya seeks up to $40bn to develop oil resources", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/71541304-d965-415d-82a3-387775cdb773" },
  { id: "3ed7fb42-2402-4439-a76d-081d9c084c64", title: "EU defence executives are no longer as safe as they were", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/3ed7fb42-2402-4439-a76d-081d9c084c64" },
  { id: "9d8f4215-4d19-43df-ab81-b9f8adb057c8", title: "Airlines in ‘stand-off’ over price cuts as jet fuel costs ease", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/9d8f4215-4d19-43df-ab81-b9f8adb057c8" },
  { id: "f12c330e-bed7-4f9d-9b37-c301ffd78b03", title: "The German far right’s difficult dance with Maga", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/f12c330e-bed7-4f9d-9b37-c301ffd78b03" },
  { id: "8891d59f-f4e0-4f81-bfae-b686cd1c4d98", title: "Big pharma warns Germany’s attempts to curb drug prices will backfire", date: "2026-08-18", time: "05:00", url: "https://www.ft.com/content/8891d59f-f4e0-4f81-bfae-b686cd1c4d98" },
  { id: "e15d3b98-47d0-4a26-9dae-f3147815981e", title: "Mark Carney in last-ditch effort to avoid Donald Trump's latest tariffs", date: "2026-08-17", time: "20:42", url: "https://www.ft.com/content/e15d3b98-47d0-4a26-9dae-f3147815981e" },
  { id: "b3ad4338-21a1-42ab-86ce-4912c7df2f96", title: "Labour MP suspended amid investigation into Covid loans", date: "2026-08-17", time: "19:39", url: "https://www.ft.com/content/b3ad4338-21a1-42ab-86ce-4912c7df2f96" },
  { id: "fc94e1f6-3f22-4fb9-b4a5-682c425e4d49", title: "The UK is going the wrong way about protecting pubs", date: "2026-08-17", time: "19:03", url: "https://www.ft.com/content/fc94e1f6-3f22-4fb9-b4a5-682c425e4d49" },
  { id: "61b8162e-6c50-4775-8bb5-fff1259a9cf3", title: "ExxonMobil advances Mozambique gas project despite terrorist threat", date: "2026-08-17", time: "18:24", url: "https://www.ft.com/content/61b8162e-6c50-4775-8bb5-fff1259a9cf3" },
  { id: "71a498fa-4ce7-4c0b-ab14-7b7f46b2b9c6", title: "Chelsea shareholders Mark Walter and Todd Boehly in talks to sell their stakes to Clearlake", date: "2026-08-17", time: "18:06", url: "https://www.ft.com/content/71a498fa-4ce7-4c0b-ab14-7b7f46b2b9c6" },
  { id: "a1b720e3-e1e6-4a13-bdb0-9cc27399ceb4", title: "Russia fires economist over Ukraine war warning", date: "2026-08-17", time: "17:32", url: "https://www.ft.com/content/a1b720e3-e1e6-4a13-bdb0-9cc27399ceb4" },
  { id: "01b0ac67-3e80-42eb-b0f6-3128f484101a", title: "Monzo chair Gary Hoffman to step down months after shareholder revolt", date: "2026-08-17", time: "16:29", url: "https://www.ft.com/content/01b0ac67-3e80-42eb-b0f6-3128f484101a" },
  { id: "377d4c1c-1cbc-46b2-8c34-f2d578c6d595", title: "Seoul rattled by threat to drills at heart of US-Korean alliance", date: "2026-08-17", time: "16:25", url: "https://www.ft.com/content/377d4c1c-1cbc-46b2-8c34-f2d578c6d595" },
  { id: "cb4b22ab-4183-4d19-be60-6d2fab86d86d", title: "US tech stock correction likely, warn ECB economists", date: "2026-08-17", time: "15:40", url: "https://www.ft.com/content/cb4b22ab-4183-4d19-be60-6d2fab86d86d" },
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
];
