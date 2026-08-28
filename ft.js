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
  { id: "40d1e3df-f220-4740-8c57-cf5e78890bb3", title: "US Treasury imposes limits on Egyptian bank for doing business with Iran", date: "2026-08-28", time: "15:00", url: "https://www.ft.com/content/40d1e3df-f220-4740-8c57-cf5e78890bb3" },
  { id: "0f256a6d-4706-4703-87db-eb0d1a96010b", title: "Asda hopes fresh tech push can reverse fortunes", date: "2026-08-28", time: "14:57", url: "https://www.ft.com/content/0f256a6d-4706-4703-87db-eb0d1a96010b" },
  { id: "d2d6b13d-b141-499e-9c7a-a7a0caf6cad2", title: "Gatwick airport water supply hit by burst pipe", date: "2026-08-28", time: "14:43", url: "https://www.ft.com/content/d2d6b13d-b141-499e-9c7a-a7a0caf6cad2" },
  { id: "9be1c027-0c94-4cf6-a84f-3193a347858c", title: "Trump has put himself on the midterm ballot — should Republicans be worried?", date: "2026-08-28", time: "14:00", url: "https://www.ft.com/content/9be1c027-0c94-4cf6-a84f-3193a347858c" },
  { id: "9ef0db10-548d-44a3-a739-432a9c211bbb", title: "What Burnham told the FT", date: "2026-08-28", time: "12:56", url: "https://www.ft.com/content/9ef0db10-548d-44a3-a739-432a9c211bbb" },
  { id: "ffd31938-b94c-448a-a493-950b99d992a3", title: "Why banks find it so hard to manage reputational risk", date: "2026-08-28", time: "12:41", url: "https://www.ft.com/content/ffd31938-b94c-448a-a493-950b99d992a3" },
  { id: "dece2ef6-88cb-497d-a919-0e9e3c2e3b10", title: "Violence rocks Ceuta as migrant crisis smoulders", date: "2026-08-28", time: "12:41", url: "https://www.ft.com/content/dece2ef6-88cb-497d-a919-0e9e3c2e3b10" },
  { id: "f983d0be-e58b-4e61-bd67-59e487dad9fe", title: "Former IMF deputy Gita Gopinath: ‘It’s straight-out protectionism’", date: "2026-08-28", time: "12:30", url: "https://www.ft.com/content/f983d0be-e58b-4e61-bd67-59e487dad9fe" },
  { id: "abbc3601-9ebc-4f3a-a317-0b1eee96e5a8", title: "Can Netflix remake Jersey Shore — and its property market?", date: "2026-08-28", time: "12:00", url: "https://www.ft.com/content/abbc3601-9ebc-4f3a-a317-0b1eee96e5a8" },
  { id: "0cdeb545-f6fe-4d97-aa1a-5933e58773c6", title: "The first Aman in Mexico is $6,000 a night. Is it worth it?", date: "2026-08-28", time: "11:00", url: "https://www.ft.com/content/0cdeb545-f6fe-4d97-aa1a-5933e58773c6" },
  { id: "3f170d25-190f-4deb-9906-431916b1eb1d", title: "How batteries are reshaping the solar power business model", date: "2026-08-28", time: "12:01", url: "https://www.ft.com/content/3f170d25-190f-4deb-9906-431916b1eb1d" },
  { id: "0d573fd7-ec74-4cb0-a8c2-a86ce6eab5bd", title: "Alleged vandalism on Trump golf course linked to terrorism, Scottish prosecutors say", date: "2026-08-28", time: "11:58", url: "https://www.ft.com/content/0d573fd7-ec74-4cb0-a8c2-a86ce6eab5bd" },
  { id: "a5c1460d-631a-4c4e-8c51-32536de09b80", title: "SpaceX considered as a leasing company", date: "2026-08-28", time: "11:13", url: "https://www.ft.com/content/a5c1460d-631a-4c4e-8c51-32536de09b80" },
  { id: "693d9b24-b4d1-42db-a978-3264a27bc83c", title: "‘I am still extremely angry’: the Woodford collapse continues to confound investors", date: "2026-08-28", time: "10:53", url: "https://www.ft.com/content/693d9b24-b4d1-42db-a978-3264a27bc83c" },
  { id: "670b2b1d-7e4c-480e-9ed4-9f7f095d7860", title: "Ministers embraced the ‘world’s safest phone’. Then it unravelled", date: "2026-08-28", time: "09:30", url: "https://www.ft.com/content/670b2b1d-7e4c-480e-9ed4-9f7f095d7860" },
  { id: "d15d2086-49bd-4a44-9508-b4c6e27971da", title: "South Korea to review 310,000 closed missing people cases", date: "2026-08-28", time: "08:32", url: "https://www.ft.com/content/d15d2086-49bd-4a44-9508-b4c6e27971da" },
  { id: "b0c90571-6619-4ac4-8d6e-f0dd295eaf15", title: "Bank of England likely to respond to high energy prices by end of the year", date: "2026-08-28", time: "07:41", url: "https://www.ft.com/content/b0c90571-6619-4ac4-8d6e-f0dd295eaf15" },
  { id: "caf9084f-8166-48c3-abab-0e801dd7a456", title: "FTAV’s further reading", date: "2026-08-28", time: "07:14", url: "https://www.ft.com/content/caf9084f-8166-48c3-abab-0e801dd7a456" },
  { id: "fc925436-4bcb-444c-b929-83014f6da44d", title: "Healey to shelve his own defence spending target of 3% of GDP by 2030", date: "2026-08-28", time: "07:13", url: "https://www.ft.com/content/fc925436-4bcb-444c-b929-83014f6da44d" },
  { id: "c377139e-b53c-4043-86b2-36b9d73cde9a", title: "The US consumer is showing some strain", date: "2026-08-28", time: "06:30", url: "https://www.ft.com/content/c377139e-b53c-4043-86b2-36b9d73cde9a" },
  { id: "5e6db1ad-6ea5-44db-80fd-fd7073d9e676", title: "FirstFT: US corporate profits surge as wages lag", date: "2026-08-28", time: "06:15", url: "https://www.ft.com/content/5e6db1ad-6ea5-44db-80fd-fd7073d9e676" },
  { id: "75d1b474-7885-42ee-a08b-d221c5e96d1c", title: "US assesses European allies’ allegiance in pointed Nato questionnaire", date: "2026-08-28", time: "06:00", url: "https://www.ft.com/content/75d1b474-7885-42ee-a08b-d221c5e96d1c" },
];
