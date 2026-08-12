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
  { id: "df4d2721-d84b-475a-8139-d58d7418a881", title: "Ari Emanuel buys West End and Broadway theatre group ATG for £4.5bn", date: "2026-08-11", time: "14:00", url: "https://www.ft.com/content/df4d2721-d84b-475a-8139-d58d7418a881" },
  { id: "3e3de835-0a9e-43cc-bd7a-1043a5cf4266", title: "Deputy PM Matteo Salvini proposes windfall tax on Italian bank profits", date: "2026-08-11", time: "17:59", url: "https://www.ft.com/content/3e3de835-0a9e-43cc-bd7a-1043a5cf4266" },
  { id: "a87d7d98-92b8-48cc-8b8d-868bb1f79034", title: "UK letting agents under pressure from AI-assisted tenant complaints", date: "2026-08-11", time: "17:54", url: "https://www.ft.com/content/a87d7d98-92b8-48cc-8b8d-868bb1f79034" },
  { id: "42194267-cda2-4dcc-9487-02c5f239e034", title: "Heatwaves push European gas prices close to Iran war highs", date: "2026-08-11", time: "17:53", url: "https://www.ft.com/content/42194267-cda2-4dcc-9487-02c5f239e034" },
  { id: "29f1af13-ecc3-4f26-a479-e6088c67231b", title: "US midterm elections 2026: The FT’s guide", date: "2026-08-11", time: "17:24", url: "https://www.ft.com/content/29f1af13-ecc3-4f26-a479-e6088c67231b" },
  { id: "5bdb67a5-5c53-46aa-8a04-d0480e700ee4", title: "Will failure in Iran reshape how the US fights?", date: "2026-08-11", time: "17:23", url: "https://www.ft.com/content/5bdb67a5-5c53-46aa-8a04-d0480e700ee4" },
  { id: "a061e46e-705c-44f6-a036-20e6cb56d19a", title: "Rooftop panels in cities cannot replace solar farms", date: "2026-08-11", time: "16:37", url: "https://www.ft.com/content/a061e46e-705c-44f6-a036-20e6cb56d19a" },
  { id: "eae42796-43f5-408b-a735-1873e1fcbbe5", title: "When trouble strikes, who shadow-banks the shadow bankers?", date: "2026-08-11", time: "16:21", url: "https://www.ft.com/content/eae42796-43f5-408b-a735-1873e1fcbbe5" },
  { id: "16906e35-f031-4bb7-9aa3-b16da4d78b87", title: "Long-term sickness may be smaller problem for UK than thought, says ONS", date: "2026-08-11", time: "14:54", url: "https://www.ft.com/content/16906e35-f031-4bb7-9aa3-b16da4d78b87" },
  { id: "de50af68-1d2d-4d03-aa4b-c0f7cdcc61d2", title: "Why Washington views Abu Dhabi as one of its most capable Middle East allies", date: "2026-08-11", time: "14:00", url: "https://www.ft.com/content/de50af68-1d2d-4d03-aa4b-c0f7cdcc61d2" },
  { id: "565bd314-0803-40a2-88b3-9070f574d933", title: "Democratic socialist leads Wisconsin governor’s race as progressives gain ground", date: "2026-08-11", time: "14:00", url: "https://www.ft.com/content/565bd314-0803-40a2-88b3-9070f574d933" },
  { id: "9f700b37-ac05-434c-9b70-3a7fe065c87e", title: "China tightens grip on Europe’s car supply chain", date: "2026-08-11", time: "13:44", url: "https://www.ft.com/content/9f700b37-ac05-434c-9b70-3a7fe065c87e" },
  { id: "39fde44e-9a63-401e-8f8e-ddf5d7f512e4", title: "Volatility tumbles as markets shrug off Middle East risks", date: "2026-08-11", time: "13:20", url: "https://www.ft.com/content/39fde44e-9a63-401e-8f8e-ddf5d7f512e4" },
  { id: "e4b66f65-ae0d-45cd-aede-8662de3495b1", title: "How to stop Kevin Warsh becoming a lame duck", date: "2026-08-11", time: "12:30", url: "https://www.ft.com/content/e4b66f65-ae0d-45cd-aede-8662de3495b1" },
  { id: "aa5ea665-2c80-490f-b410-ea48cbdaf9cd", title: "For prisons to work, we need to look at what is happening inside them", date: "2026-08-11", time: "12:09", url: "https://www.ft.com/content/aa5ea665-2c80-490f-b410-ea48cbdaf9cd" },
  { id: "97812a6a-b8ae-4b53-9b67-397250bc5c80", title: "Intel investors are banking on a comeback — and then some", date: "2026-08-11", time: "12:00", url: "https://www.ft.com/content/97812a6a-b8ae-4b53-9b67-397250bc5c80" },
];
