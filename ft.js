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
  { id: "bb4182ee-1fb9-4374-a557-c3d36d66ace0", title: "South Korea jails Unification Church leader over luxury bag bribery scandal", date: "2026-08-31", time: "08:21", url: "https://www.ft.com/content/bb4182ee-1fb9-4374-a557-c3d36d66ace0" },
  { id: "ed723a59-a889-40e0-b601-0c1f16c92f65", title: "Andrew Bailey warns G20 of danger AI poses to financial system", date: "2026-08-31", time: "07:02", url: "https://www.ft.com/content/ed723a59-a889-40e0-b601-0c1f16c92f65" },
  { id: "b7d182b3-837f-4161-bd3c-ec9b78b41c45", title: "Iceland tarnishes EU’s dreams of being a defence and security hegemon", date: "2026-08-31", time: "06:00", url: "https://www.ft.com/content/b7d182b3-837f-4161-bd3c-ec9b78b41c45" },
  { id: "bddb9558-a00f-4407-8e77-dbf5549fbd0b", title: "Jane Street’s AI bets go sour", date: "2026-08-31", time: "06:00", url: "https://www.ft.com/content/bddb9558-a00f-4407-8e77-dbf5549fbd0b" },
  { id: "ff42d33c-9cb9-4707-8250-677af16fb0b6", title: "FTAV’s further reading", date: "2026-08-31", time: "06:00", url: "https://www.ft.com/content/ff42d33c-9cb9-4707-8250-677af16fb0b6" },
  { id: "51c907e1-1177-4489-b4b8-fb044f5b257d", title: "FirstFT: Ukraine’s ex-defence minister pitches tech fund", date: "2026-08-31", time: "05:31", url: "https://www.ft.com/content/51c907e1-1177-4489-b4b8-fb044f5b257d" },
  { id: "f270814f-e836-44e8-80c2-ec1034f80519", title: "US and Iran exchange fire for the first time in more than a month", date: "2026-08-31", time: "05:15", url: "https://www.ft.com/content/f270814f-e836-44e8-80c2-ec1034f80519" },
  { id: "5051e92f-371f-4a46-bdee-e8877b68caf8", title: "LIV Golf prepares for bankruptcy filing in September", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/5051e92f-371f-4a46-bdee-e8877b68caf8" },
  { id: "c07c2073-5003-4edf-b274-1aafd446730b", title: "Scramble for gas assets pushes dealmaking to decade high", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/c07c2073-5003-4edf-b274-1aafd446730b" },
  { id: "febfe4ef-95d4-4bf7-8c48-0fca02671661", title: "UK investment trusts struggle to keep up the liquidity illusion", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/febfe4ef-95d4-4bf7-8c48-0fca02671661" },
  { id: "9914f45e-4e5c-4f6e-990b-043a65fb7ebf", title: "Romania to lose €770mn in EU funds due to government crisis", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/9914f45e-4e5c-4f6e-990b-043a65fb7ebf" },
  { id: "2ca855a9-be0d-4915-b4f0-b48355c6aa4a", title: "The face of America’s socialist insurgency", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/2ca855a9-be0d-4915-b4f0-b48355c6aa4a" },
  { id: "1481e787-77dc-4d54-8871-8ffb369e5dd3", title: "Will financial innovation dethrone the dollar?", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/1481e787-77dc-4d54-8871-8ffb369e5dd3" },
  { id: "de28524f-0085-4d2a-90f3-4d555e93c7bc", title: "Labour shelves plan to restrict foreigners buying new flats", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/de28524f-0085-4d2a-90f3-4d555e93c7bc" },
  { id: "e89c9f04-b574-4a09-b123-02dac8335ba4", title: "UK fintech Allica looks to Sweden to kick-start European expansion", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/e89c9f04-b574-4a09-b123-02dac8335ba4" },
  { id: "886acdbf-7a9d-4af3-a2e7-3c4a2e446370", title: "Tim Cook’s legacy by the numbers", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/886acdbf-7a9d-4af3-a2e7-3c4a2e446370" },
  { id: "fc8f86f2-96ad-4bfb-bba4-75326115aa24", title: "The rise of physical AI: can robots save US manufacturing?", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/fc8f86f2-96ad-4bfb-bba4-75326115aa24" },
  { id: "18f9f4ce-e437-435e-ad8e-a043ea181161", title: "Argentina battles flood of contraband goods as Milei opens economy", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/18f9f4ce-e437-435e-ad8e-a043ea181161" },
  { id: "b3e84c50-c761-4179-beac-68641e61207e", title: "Crypto groups spend record $640mn buying back their own tokens", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/b3e84c50-c761-4179-beac-68641e61207e" },
  { id: "fc3fce3b-18d2-4340-ac0f-aa2964aa6147", title: "Trump’s threats against Canada are self-defeating", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/fc3fce3b-18d2-4340-ac0f-aa2964aa6147" },
  { id: "94b17d45-0a07-41e0-9597-57ca8918b8bd", title: "After years of losses, Victoria Beckham marks her brand’s turnaround", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/94b17d45-0a07-41e0-9597-57ca8918b8bd" },
  { id: "53d35170-2b41-4c21-8b41-345158ef0be1", title: "German gunmaker with loaded history sets sights on British army’s next rifle", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/53d35170-2b41-4c21-8b41-345158ef0be1" },
  { id: "55a5df36-4f1a-4ff3-8986-3a06db58a39a", title: "London’s Aim market faces existential crisis", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/55a5df36-4f1a-4ff3-8986-3a06db58a39a" },
  { id: "114a2f47-11b8-4b96-ba6a-ac0d8e4d1393", title: "Long-term investors turn to shipping as Middle East conflict boosts returns", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/114a2f47-11b8-4b96-ba6a-ac0d8e4d1393" },
  { id: "9f8a9a56-8fa9-456a-9b05-561320a9863c", title: "Mainland Europe seizes edge in global student race", date: "2026-08-31", time: "05:00", url: "https://www.ft.com/content/9f8a9a56-8fa9-456a-9b05-561320a9863c" },
  { id: "a5a0081f-e998-4c80-b967-cc535cbc4933", title: "Big Tech profits get $160bn boost from gains on stakes in other AI companies", date: "2026-08-30", time: "20:00", url: "https://www.ft.com/content/a5a0081f-e998-4c80-b967-cc535cbc4933" },
  { id: "c9d10aeb-163e-46a3-b7ca-376ce6be9f8e", title: "Ukraine’s ex-defence minister touts ‘new history’ in war against Russia with planned tech fund", date: "2026-08-30", time: "18:57", url: "https://www.ft.com/content/c9d10aeb-163e-46a3-b7ca-376ce6be9f8e" },
  { id: "da5d96c1-c491-41a2-9db5-48bd952da4b4", title: "Return of the politicians", date: "2026-08-30", time: "18:15", url: "https://www.ft.com/content/da5d96c1-c491-41a2-9db5-48bd952da4b4" },
  { id: "63e8a4f3-7c18-4ddc-b3b7-e472159a7adf", title: "Americans feel they have lost their agency", date: "2026-08-30", time: "16:00", url: "https://www.ft.com/content/63e8a4f3-7c18-4ddc-b3b7-e472159a7adf" },
  { id: "4eb02822-d691-48a4-966f-45c6501bccb2", title: "Niger regains control of military base after coup attempt", date: "2026-08-30", time: "15:43", url: "https://www.ft.com/content/4eb02822-d691-48a4-966f-45c6501bccb2" },
  { id: "458940e7-0754-42e3-aa33-f1f9e3e710b7", title: "Controversial Venezuelan executive courts investors after Trump oil deal", date: "2026-08-30", time: "13:12", url: "https://www.ft.com/content/458940e7-0754-42e3-aa33-f1f9e3e710b7" },
  { id: "5729b32c-8b7a-42b1-b1e2-b8b0106739cb", title: "Meta’s settlement is a starting point", date: "2026-08-30", time: "13:00", url: "https://www.ft.com/content/5729b32c-8b7a-42b1-b1e2-b8b0106739cb" },
  { id: "ce3139ac-e88e-4c0d-ab92-b36e79052836", title: "Friends with fiscal benefits", date: "2026-08-30", time: "12:00", url: "https://www.ft.com/content/ce3139ac-e88e-4c0d-ab92-b36e79052836" },
  { id: "c2682d2b-c5a4-4f98-8f04-cf93883fb9b6", title: "Will the Fed’s hawkish stance survive contact with jobs data?", date: "2026-08-30", time: "12:00", url: "https://www.ft.com/content/c2682d2b-c5a4-4f98-8f04-cf93883fb9b6" },
  { id: "3dd189e1-1af6-45a5-8993-0973af74f8e4", title: "Andy Burnham tightens prisoner release scheme and insists he is ‘tough on crime’", date: "2026-08-30", time: "11:01", url: "https://www.ft.com/content/3dd189e1-1af6-45a5-8993-0973af74f8e4" },
  { id: "25f48fea-ada2-41e1-ba33-07a864a8674a", title: "‘New York loves Canada’: US cities want their Canadian tourists back", date: "2026-08-30", time: "11:00", url: "https://www.ft.com/content/25f48fea-ada2-41e1-ba33-07a864a8674a" },
  { id: "2c65a745-8169-4192-971a-022bdfc0e7ad", title: "Pharma stocks soar as investors seek AI alternatives", date: "2026-08-30", time: "11:00", url: "https://www.ft.com/content/2c65a745-8169-4192-971a-022bdfc0e7ad" },
  { id: "53b5abd8-2919-4dc6-8dd6-81fc054e8b6f", title: "Iceland rejects reopening talks on EU entry", date: "2026-08-30", time: "09:02", url: "https://www.ft.com/content/53b5abd8-2919-4dc6-8dd6-81fc054e8b6f" },
  { id: "5579f0e8-c19c-46ad-8272-f7678bf3a6b9", title: "CEO of India’s largest private bank to step down", date: "2026-08-30", time: "07:10", url: "https://www.ft.com/content/5579f0e8-c19c-46ad-8272-f7678bf3a6b9" },
  { id: "63311687-676b-4548-9bd8-3d7ad96d7ce5", title: "What’s the fiscal hit from higher yields?", date: "2026-08-30", time: "05:12", url: "https://www.ft.com/content/63311687-676b-4548-9bd8-3d7ad96d7ce5" },
];
