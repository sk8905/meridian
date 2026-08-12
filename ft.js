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
  { id: "dfa69996-4427-4eef-8c60-a97a562debf5", title: "Colombian earthquake disrupts key coffee export road", date: "2026-08-12", time: "10:53", url: "https://www.ft.com/content/dfa69996-4427-4eef-8c60-a97a562debf5" },
  { id: "14430047-c8b9-4e7b-89db-aed36244ad71", title: "Cambridge to carry out independent probe into Jason Arday appointment", date: "2026-08-12", time: "10:51", url: "https://www.ft.com/content/14430047-c8b9-4e7b-89db-aed36244ad71" },
  { id: "99c86e8e-02d5-4c7c-9eef-27ad9bb5b7c6", title: "Bank of America commits $250bn to support Donald Trump’s ‘America First’ agenda", date: "2026-08-12", time: "10:00", url: "https://www.ft.com/content/99c86e8e-02d5-4c7c-9eef-27ad9bb5b7c6" },
  { id: "c4c5cbb1-4b7c-4d29-b382-b38c494dcecc", title: "Andy Burnham has more to lose from an early election, but we should not rule it out", date: "2026-08-12", time: "09:30", url: "https://www.ft.com/content/c4c5cbb1-4b7c-4d29-b382-b38c494dcecc" },
  { id: "68dcb0e8-a15b-436a-9a57-c4c2abfba2d3", title: "UK power supplies likely to be stretched during solar eclipse", date: "2026-08-12", time: "09:20", url: "https://www.ft.com/content/68dcb0e8-a15b-436a-9a57-c4c2abfba2d3" },
  { id: "c9d5c256-0e93-4978-b312-354cb7bd7487", title: "Andy Burnham to hold emergency Cobra meeting in response to heatwaves", date: "2026-08-12", time: "08:54", url: "https://www.ft.com/content/c9d5c256-0e93-4978-b312-354cb7bd7487" },
  { id: "007b5ff6-e8fe-47f6-ba34-40cd6520e9fd", title: "World prepares for one of nature’s greatest spectacles: a total solar eclipse", date: "2026-08-12", time: "08:17", url: "https://www.ft.com/content/007b5ff6-e8fe-47f6-ba34-40cd6520e9fd" },
  { id: "565bd314-0803-40a2-88b3-9070f574d933", title: "Democratic socialist locked in unexpectedly tight Wisconsin primary race", date: "2026-08-12", time: "07:17", url: "https://www.ft.com/content/565bd314-0803-40a2-88b3-9070f574d933" },
  { id: "57e3a478-f9d5-444f-91ae-12838b1f1929", title: "HSBC’s global head of insurance steps down", date: "2026-08-12", time: "07:13", url: "https://www.ft.com/content/57e3a478-f9d5-444f-91ae-12838b1f1929" },
  { id: "d3c55471-0e3d-4798-8355-2b661880d8b9", title: "Kevin Warsh’s monetary hall of mirrors", date: "2026-08-12", time: "06:30", url: "https://www.ft.com/content/d3c55471-0e3d-4798-8355-2b661880d8b9" },
  { id: "08ef25cc-c51d-457f-84c5-33303c6ed118", title: "FTAV’s further reading", date: "2026-08-12", time: "06:30", url: "https://www.ft.com/content/08ef25cc-c51d-457f-84c5-33303c6ed118" },
  { id: "e0ca4cab-c8ba-47d6-9465-13e2d73285fc", title: "Taiwan hits out at China over naval drill with Indonesia", date: "2026-08-12", time: "06:14", url: "https://www.ft.com/content/e0ca4cab-c8ba-47d6-9465-13e2d73285fc" },
  { id: "acd38b11-0cd7-40c2-a779-e26c95b59048", title: "Business development companies are paying more to borrow. But why?", date: "2026-08-12", time: "06:00", url: "https://www.ft.com/content/acd38b11-0cd7-40c2-a779-e26c95b59048" },
  { id: "7cd5f1c5-1097-4bd4-bd00-8006759da28d", title: "FirstFT: Vance asked Ukraine to halt strikes on tankers", date: "2026-08-12", time: "05:31", url: "https://www.ft.com/content/7cd5f1c5-1097-4bd4-bd00-8006759da28d" },
  { id: "a96c07f8-0b61-4322-b5ef-1ae5b445706f", title: "How AstraZeneca’s $400bn deal unravelled", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/a96c07f8-0b61-4322-b5ef-1ae5b445706f" },
  { id: "56c300d3-3632-476e-96d6-da84d4558bda", title: "Poorer Americans are struggling to make ‘ends meet’, top Fed official says", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/56c300d3-3632-476e-96d6-da84d4558bda" },
  { id: "14b245d4-281a-4a9f-b1a8-a2cb252f4335", title: "Britain needs more investors, not higher taxes on investment", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/14b245d4-281a-4a9f-b1a8-a2cb252f4335" },
  { id: "e16ec916-08ad-4f87-9b62-e42e9f28a59c", title: "How to stop global warming", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/e16ec916-08ad-4f87-9b62-e42e9f28a59c" },
  { id: "13ca1246-faa7-4a0e-8117-439aee14d3d7", title: "Revolut cuts back WeWork access for premium customers after price rises", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/13ca1246-faa7-4a0e-8117-439aee14d3d7" },
  { id: "725b4d15-bd8d-4083-a04e-db016338af2e", title: "JD Vance asked Ukraine to halt strikes on tankers using Russian port", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/725b4d15-bd8d-4083-a04e-db016338af2e" },
  { id: "add47783-31f8-486f-b073-d547aafe6de0", title: "Private equity can score top marks with education deals", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/add47783-31f8-486f-b073-d547aafe6de0" },
  { id: "81275343-db07-430d-9cc3-26fdee31f150", title: "‘Time billionaires’ are hungry for risk — will it be their undoing?", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/81275343-db07-430d-9cc3-26fdee31f150" },
  { id: "a541a8dc-89df-464a-9b9f-fbffcfe7cca1", title: "Reform UK figure previously accompanied the BNP on the campaign trail", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/a541a8dc-89df-464a-9b9f-fbffcfe7cca1" },
  { id: "b3cbe615-5e60-43cf-9685-e64afabcfb30", title: "Why everyone wants a one-carat ring", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/b3cbe615-5e60-43cf-9685-e64afabcfb30" },
  { id: "ff77bb63-b1a3-4c9f-81ba-09eced8700e3", title: "Is it too late to save liberal democracy?", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/ff77bb63-b1a3-4c9f-81ba-09eced8700e3" },
  { id: "92b5d535-73e4-48f6-a60a-475c32aa7e79", title: "Nudge or tax? At last, some data", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/92b5d535-73e4-48f6-a60a-475c32aa7e79" },
  { id: "a3803e70-cb4d-444f-a31e-05be2f2c44f6", title: "China’s great jobs squeeze", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/a3803e70-cb4d-444f-a31e-05be2f2c44f6" },
  { id: "25bc2df2-7ab8-4b1a-a30f-2fe4d47806ce", title: "How Israel is making southern Lebanon ‘unliveable’", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/25bc2df2-7ab8-4b1a-a30f-2fe4d47806ce" },
  { id: "2f9ffe4c-b307-4f32-a8f8-c1c8759bbf5b", title: "Is my architect liable for extra costs?", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/2f9ffe4c-b307-4f32-a8f8-c1c8759bbf5b" },
  { id: "d36e4a0a-88b2-4707-b447-5eb7e0d5da8f", title: "What to plant to light up summer evenings", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/d36e4a0a-88b2-4707-b447-5eb7e0d5da8f" },
  { id: "20f44f32-6566-4373-b6d8-9551be58d762", title: "How a bad trade pushed a US mortgage giant into a $2bn lifeline", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/20f44f32-6566-4373-b6d8-9551be58d762" },
  { id: "7bbfc48c-74fd-48e4-bdad-d6b1c9cf0914", title: "The mother of all professional wardrobes", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/7bbfc48c-74fd-48e4-bdad-d6b1c9cf0914" },
  { id: "99bbb4e9-32de-40cb-aa15-537937d70889", title: "Europe’s carbon mechanism is a tariff by another name", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/99bbb4e9-32de-40cb-aa15-537937d70889" },
  { id: "618a3ed2-caab-4c58-9685-39cbba874e3b", title: "Europe’s farmers move to the night shift to beat the heat", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/618a3ed2-caab-4c58-9685-39cbba874e3b" },
  { id: "386903c4-9b22-4c30-9b92-e173946898f9", title: "Climate change an ‘existential threat’ to England’s green spaces, study finds", date: "2026-08-11", time: "19:22", url: "https://www.ft.com/content/386903c4-9b22-4c30-9b92-e173946898f9" },
  { id: "9bc922b6-47b3-47f5-9793-209731717d60", title: "Andy Burnham faces first real test over his handling of prisons crisis", date: "2026-08-11", time: "19:19", url: "https://www.ft.com/content/9bc922b6-47b3-47f5-9793-209731717d60" },
  { id: "c1296b77-a8a4-4cfc-aebc-a2f0d62af25f", title: "Moscow releases former US Marine Robert Gilman after four-year stint in Russian prison", date: "2026-08-11", time: "18:51", url: "https://www.ft.com/content/c1296b77-a8a4-4cfc-aebc-a2f0d62af25f" },
  { id: "5010fd54-5982-47c7-801a-e0a354a71c31", title: "US judge cites ‘concerning’ irregularities in Adani fraud case", date: "2026-08-11", time: "18:29", url: "https://www.ft.com/content/5010fd54-5982-47c7-801a-e0a354a71c31" },
  { id: "b7ee9a48-8d99-4d47-8234-68218072fa3b", title: "Arday case poses awkward questions for Cambridge", date: "2026-08-11", time: "18:17", url: "https://www.ft.com/content/b7ee9a48-8d99-4d47-8234-68218072fa3b" },
  { id: "3e3de835-0a9e-43cc-bd7a-1043a5cf4266", title: "Deputy PM Matteo Salvini proposes windfall tax on Italian bank profits", date: "2026-08-11", time: "17:59", url: "https://www.ft.com/content/3e3de835-0a9e-43cc-bd7a-1043a5cf4266" },
];
