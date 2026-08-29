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
  { id: "4319c6b7-5a25-41a7-836f-ca068ac4fe60", title: "Warsh charts a forward-looking path for the Fed at Jackson Hole", date: "2026-08-29", time: "17:28", url: "https://www.ft.com/content/4319c6b7-5a25-41a7-836f-ca068ac4fe60" },
  { id: "2f88581f-4fbc-46a2-8127-830bb630c2f2", title: "Trump says US to take control of 65bn barrels of Venezuelan oil", date: "2026-08-29", time: "15:20", url: "https://www.ft.com/content/2f88581f-4fbc-46a2-8127-830bb630c2f2" },
  { id: "69452aea-cee0-47de-be8a-dc790fed3db1", title: "Warsh puts Fed on collision course with Trump ahead of midterms", date: "2026-08-29", time: "13:57", url: "https://www.ft.com/content/69452aea-cee0-47de-be8a-dc790fed3db1" },
  { id: "4822389d-5bb2-4e31-a627-bcda849630c8", title: "Swiss wealth managers urge delay to ownership register after Liechtenstein hack", date: "2026-08-29", time: "12:00", url: "https://www.ft.com/content/4822389d-5bb2-4e31-a627-bcda849630c8" },
  { id: "c1c79d47-31c0-4e4e-85b6-57527e31d78f", title: "Alex Gerko earned a record £895mn from trading firm XTX in 2025", date: "2026-08-29", time: "11:12", url: "https://www.ft.com/content/c1c79d47-31c0-4e4e-85b6-57527e31d78f" },
  { id: "0d24c0e8-eb65-4009-a236-f2dbf1eaa416", title: "Trump deportations take a bite out of an unexpected industry: US fast food", date: "2026-08-29", time: "10:00", url: "https://www.ft.com/content/0d24c0e8-eb65-4009-a236-f2dbf1eaa416" },
  { id: "40eaeba7-9514-4e6b-9bd3-4a9381618c84", title: "Dozens killed in Russian strike on ammunition depot near Kyiv", date: "2026-08-29", time: "09:54", url: "https://www.ft.com/content/40eaeba7-9514-4e6b-9bd3-4a9381618c84" },
  { id: "59955452-1de0-40f0-a8d1-62139d502484", title: "Chart of the Week: Is the 60-40 portfolio dead?", date: "2026-08-29", time: "09:30", url: "https://www.ft.com/content/59955452-1de0-40f0-a8d1-62139d502484" },
  { id: "4f9bd1ed-f783-45c9-8542-addd8b57ee9f", title: "What the Indiana state fair reveals about Trump's America", date: "2026-08-29", time: "08:37", url: "https://www.ft.com/content/4f9bd1ed-f783-45c9-8542-addd8b57ee9f" },
  { id: "33fa2e4a-2c35-42e2-9e32-494f9505f0ff", title: "American Scoundrel — Roy Cohn’s long shadow over the White House", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/33fa2e4a-2c35-42e2-9e32-494f9505f0ff" },
  { id: "359d4ea5-59b6-425f-ac66-c9836cec04f9", title: "Glencore threatened with $1.4bn lawsuit from embattled trader Radiant", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/359d4ea5-59b6-425f-ac66-c9836cec04f9" },
  { id: "ba4b940e-4a44-473b-9846-eaba9434b65f", title: "Risk of a new age of financial repression is rising", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/ba4b940e-4a44-473b-9846-eaba9434b65f" },
  { id: "6249139a-6ca6-4888-86e2-f2f381e9b8a8", title: "Football clubs' race for data creates bright spot in Britain labour market", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/6249139a-6ca6-4888-86e2-f2f381e9b8a8" },
  { id: "c2609ef8-1592-4c04-a3b6-37437627ff8e", title: "The end of cheap food has costs far beyond the grocery store", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/c2609ef8-1592-4c04-a3b6-37437627ff8e" },
  { id: "95379ab9-8483-4e0a-a71e-e22b68dacc46", title: "Raphaël Glucksmann, the French left's new hope", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/95379ab9-8483-4e0a-a71e-e22b68dacc46" },
  { id: "492134e9-49eb-4f13-b70a-b2b595ed0e2a", title: "Zero-sum thinking will fuel resentment and scarcity", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/492134e9-49eb-4f13-b70a-b2b595ed0e2a" },
  { id: "63981a46-5849-4c1b-b5df-bfacd85c9d93", title: "How finance redeemed itself", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/63981a46-5849-4c1b-b5df-bfacd85c9d93" },
  { id: "cf608abf-fb69-4f0b-a579-028cac78a8c9", title: "The Cumbrian shepherds racing sunrise to beat the heat", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/cf608abf-fb69-4f0b-a579-028cac78a8c9" },
  { id: "930386eb-b5d4-4a62-a258-f7ab46401655", title: "US campaign to isolate Iran closes in on Dubai", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/930386eb-b5d4-4a62-a258-f7ab46401655" },
  { id: "5516fa6b-1cbf-4b50-944b-57b42cbcac93", title: "Fancy lattes whip up their own mini investment boom", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/5516fa6b-1cbf-4b50-944b-57b42cbcac93" },
  { id: "f100c90b-c138-4125-aaa7-853b77690db9", title: "Did AI write this? It's getting harder to tell", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/f100c90b-c138-4125-aaa7-853b77690db9" },
  { id: "38a05881-ebfc-47ac-b326-96142edd1bb7", title: "FT stock picking game results: the unexpected triumph of fundamentals", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/38a05881-ebfc-47ac-b326-96142edd1bb7" },
  { id: "7af605e0-b528-46f6-b86e-b90b46f03c4c", title: "Neoclouds show how to amplify risks in AI ecosystems", date: "2026-08-28", time: "19:09", url: "https://www.ft.com/content/7af605e0-b528-46f6-b86e-b90b46f03c4c" },
  { id: "aa929cd9-b4b4-4858-9160-4d6f885ebc5f", title: "Middlesbrough crisis highlights challenges for small police forces", date: "2026-08-28", time: "18:57", url: "https://www.ft.com/content/aa929cd9-b4b4-4858-9160-4d6f885ebc5f" },
  { id: "14564843-5960-44c6-8683-944422c042a4", title: "Donald Trump loses bid to challenge hush-money conviction in federal court", date: "2026-08-28", time: "18:54", url: "https://www.ft.com/content/14564843-5960-44c6-8683-944422c042a4" },
  { id: "0d135ccd-f8cf-4178-a7d8-0a0dfbb705e8", title: "Warsh the line", date: "2026-08-28", time: "18:30", url: "https://www.ft.com/content/0d135ccd-f8cf-4178-a7d8-0a0dfbb705e8" },
  { id: "6b9afdfb-26f5-4746-8ff9-027a8d04cb1f", title: "Submit your questions: is Trump losing his touch?", date: "2026-08-28", time: "18:00", url: "https://www.ft.com/content/6b9afdfb-26f5-4746-8ff9-027a8d04cb1f" },
  { id: "68652016-adb7-48c3-a7ad-5e0303575717", title: "Stockpickers: Chesnara, Hays, Macfarlane", date: "2026-08-28", time: "18:00", url: "https://www.ft.com/content/68652016-adb7-48c3-a7ad-5e0303575717" },
  { id: "b625e314-ecf9-4385-a687-7a8f8c1bec23", title: "US manufacturing is booming — but it’s no thanks to Trump’s tariffs", date: "2026-08-28", time: "18:00", url: "https://www.ft.com/content/b625e314-ecf9-4385-a687-7a8f8c1bec23" },
  { id: "f2c511ff-4505-4f4e-83d4-055fa0b9c56f", title: "Directors’ Deals: IWG boss buys in as debt concerns hit shares", date: "2026-08-28", time: "18:00", url: "https://www.ft.com/content/f2c511ff-4505-4f4e-83d4-055fa0b9c56f" },
  { id: "5f0af00c-7f75-48fc-b89e-1a31978273c3", title: "FTAV’s Friday chart quiz", date: "2026-08-28", time: "17:51", url: "https://www.ft.com/content/5f0af00c-7f75-48fc-b89e-1a31978273c3" },
  { id: "646b812e-c9de-49ba-90f3-f9d12205f876", title: "Warsh settles some nerves at Jackson Hole", date: "2026-08-28", time: "17:38", url: "https://www.ft.com/content/646b812e-c9de-49ba-90f3-f9d12205f876" },
  { id: "69b00e4b-e558-4534-8c78-ed145413cec2", title: "Warsh’s mildly hawkish speech helped fill in the blanks", date: "2026-08-28", time: "16:52", url: "https://www.ft.com/content/69b00e4b-e558-4534-8c78-ed145413cec2" },
  { id: "4791413a-bf31-407f-9ef6-3fbaa153085f", title: "The age of the e-bike", date: "2026-08-28", time: "16:01", url: "https://www.ft.com/content/4791413a-bf31-407f-9ef6-3fbaa153085f" },
  { id: "d0a485ea-af87-4834-aa9a-3611028a7b6e", title: "Walmart settles lawsuit over painkiller prescriptions", date: "2026-08-28", time: "15:59", url: "https://www.ft.com/content/d0a485ea-af87-4834-aa9a-3611028a7b6e" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-08-28", time: "15:56", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
  { id: "75ba3055-625c-4cb5-894b-0696a38f5e79", title: "Latest Isa rates", date: "2026-08-28", time: "15:51", url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79" },
  { id: "68b36b6d-71e7-4f44-bbfb-a202e36603a4", title: "Latest National Savings & Investments rates", date: "2026-08-28", time: "15:47", url: "https://www.ft.com/content/68b36b6d-71e7-4f44-bbfb-a202e36603a4" },
  { id: "d3eead8b-7b38-45bd-8fba-489d02a3e440", title: "Aberdeen fund takes £200mn hit on failure of UK broadband provider", date: "2026-08-28", time: "15:09", url: "https://www.ft.com/content/d3eead8b-7b38-45bd-8fba-489d02a3e440" },
  { id: "d15851dc-9177-4bfe-9039-8d9994a2e4b3", title: "Kevin Warsh says Fed will have ‘work to do’ if inflation does not fall soon", date: "2026-08-28", time: "15:00", url: "https://www.ft.com/content/d15851dc-9177-4bfe-9039-8d9994a2e4b3" },
];
