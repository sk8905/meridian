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
  { id: "908794d7-2c91-44e0-b0b8-d259396a9796", title: "How a darling of the clean energy transition stumbled", date: "2026-08-11", time: "12:00", url: "https://www.ft.com/content/908794d7-2c91-44e0-b0b8-d259396a9796" },
  { id: "d4750e01-78a9-46eb-8f84-16b80f853dfa", title: "SpaceX’s ‘very achievable’ $100bn revenue run rate target", date: "2026-08-11", time: "12:00", url: "https://www.ft.com/content/d4750e01-78a9-46eb-8f84-16b80f853dfa" },
  { id: "f789a20e-967d-4a58-bad0-52ccdd2a79da", title: "Sky City by Jacqueline Crooks — tuning into trauma", date: "2026-08-11", time: "12:00", url: "https://www.ft.com/content/f789a20e-967d-4a58-bad0-52ccdd2a79da" },
  { id: "21acee15-501b-45b6-9fc2-4202d9a66c76", title: "Andy Burnham vows to stop early release of PC Harper’s killers", date: "2026-08-11", time: "10:33", url: "https://www.ft.com/content/21acee15-501b-45b6-9fc2-4202d9a66c76" },
  { id: "d891285a-e581-45b7-8cb0-80411669c1eb", title: "Deutsche becomes first European clearing bank for renminbi", date: "2026-08-11", time: "10:00", url: "https://www.ft.com/content/d891285a-e581-45b7-8cb0-80411669c1eb" },
  { id: "a2dadec1-173f-40a9-89c0-2cf83f78de2a", title: "Donald Trump warns ditching Gianni Infantino would be ‘terrible mistake’", date: "2026-08-11", time: "09:21", url: "https://www.ft.com/content/a2dadec1-173f-40a9-89c0-2cf83f78de2a" },
  { id: "248cdbf4-b047-45d3-b543-a343135132b0", title: "Goldman Sachs staff named as suspects in Brazil investigation", date: "2026-08-11", time: "08:47", url: "https://www.ft.com/content/248cdbf4-b047-45d3-b543-a343135132b0" },
  { id: "99824437-8173-4320-b84b-242c726ab437", title: "Chinese robot maker’s IPO 5,500 times oversubscribed by retail investors", date: "2026-08-11", time: "08:12", url: "https://www.ft.com/content/99824437-8173-4320-b84b-242c726ab437" },
  { id: "ebaae3f1-2d2c-4703-8bf7-5c40684c3eee", title: "José Mourinho dishes the dirt and quotes Nietzsche in new Netflix doc", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/ebaae3f1-2d2c-4703-8bf7-5c40684c3eee" },
  { id: "ae51df74-5be1-48d3-8efc-e61f12dc9edd", title: "The American factory, a romance", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/ae51df74-5be1-48d3-8efc-e61f12dc9edd" },
  { id: "6f50d572-5c14-4085-b7cc-cb81544fb4ae", title: "Setting sail from Copenhagen . . . on a 1906 schooner", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/6f50d572-5c14-4085-b7cc-cb81544fb4ae" },
  { id: "c27150f4-24e7-4def-9461-0a4849a0ea81", title: "Investing in the forgotten lands", date: "2026-08-11", time: "06:30", url: "https://www.ft.com/content/c27150f4-24e7-4def-9461-0a4849a0ea81" },
  { id: "5e9812a7-ee70-46c2-9aa3-1a74b33a25de", title: "FTAV’s further reading", date: "2026-08-11", time: "06:30", url: "https://www.ft.com/content/5e9812a7-ee70-46c2-9aa3-1a74b33a25de" },
  { id: "a5d5239c-9206-418c-822a-ace82d47f05c", title: "Confessions of a former star M&A reporter", date: "2026-08-11", time: "06:00", url: "https://www.ft.com/content/a5d5239c-9206-418c-822a-ace82d47f05c" },
  { id: "b957441e-ac7d-4dbd-a024-3af989ef7a44", title: "FirstFT: EU border checks double waiting times", date: "2026-08-11", time: "05:31", url: "https://www.ft.com/content/b957441e-ac7d-4dbd-a024-3af989ef7a44" },
  { id: "45af4235-1bd1-4734-966a-1f513d25361c", title: "What will Warsh do to favour Main Street over Wall Street?", date: "2026-08-11", time: "05:30", url: "https://www.ft.com/content/45af4235-1bd1-4734-966a-1f513d25361c" },
  { id: "42137dd8-8fdc-4d66-b193-ca52d51bd929", title: "EU border checks double queues at major airports", date: "2026-08-11", time: "05:01", url: "https://www.ft.com/content/42137dd8-8fdc-4d66-b193-ca52d51bd929" },
  { id: "4c93c894-04b8-49dc-be41-98ae79f540f8", title: "Nvidia becomes the bank of AI", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/4c93c894-04b8-49dc-be41-98ae79f540f8" },
  { id: "2eb0a79c-f5cd-415c-9f72-3c8d576329c1", title: "How AstraZeneca’s $400bn tie-up with US rival Bristol Myers unravelled", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/2eb0a79c-f5cd-415c-9f72-3c8d576329c1" },
  { id: "884d643c-15e6-474d-99ca-6bab23811c7f", title: "German states suspend Sunday lorry ban as low Rhine levels disrupt supply chains", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/884d643c-15e6-474d-99ca-6bab23811c7f" },
  { id: "763128ff-8287-49f7-8369-039822f3bbfb", title: "Carbon tax will hit EU’s budget airlines where it hurts", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/763128ff-8287-49f7-8369-039822f3bbfb" },
];
