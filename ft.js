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
  { id: "a988ae61-a218-4872-a4d7-a3061c6ca7ab", title: "Saudi Arabia, Turkey and Pakistan sign defence pact in Mecca", date: "2026-08-07", time: "12:18", url: "https://www.ft.com/content/a988ae61-a218-4872-a4d7-a3061c6ca7ab" },
  { id: "6afa0d5c-d252-4644-822f-44514576148e", title: "Exxon nears peak impunity on climate obligations", date: "2026-08-07", time: "12:07", url: "https://www.ft.com/content/6afa0d5c-d252-4644-822f-44514576148e" },
  { id: "dabdeae3-9855-484b-9369-e74176352107", title: "UK shares: hotter than below decks in a heatwave", date: "2026-08-07", time: "12:00", url: "https://www.ft.com/content/dabdeae3-9855-484b-9369-e74176352107" },
  { id: "122c7788-8f8b-4f42-bc42-119a49396f91", title: "Britain curbs power exports to Europe to preserve supplies", date: "2026-08-07", time: "11:03", url: "https://www.ft.com/content/122c7788-8f8b-4f42-bc42-119a49396f91" },
  { id: "0edbd013-dc35-494b-b7e7-9a745af01c9d", title: "MFS collapse prompts UK watchdog to crack down on financial crime", date: "2026-08-07", time: "10:56", url: "https://www.ft.com/content/0edbd013-dc35-494b-b7e7-9a745af01c9d" },
  { id: "2e00d86e-27bf-4c16-9f5a-64acf8967763", title: "Rare earth access: still a thing", date: "2026-08-07", time: "10:30", url: "https://www.ft.com/content/2e00d86e-27bf-4c16-9f5a-64acf8967763" },
  { id: "9d9e8f82-1626-429c-9434-a8540ca2ed64", title: "CMA moves to stop Aldi and Lidl blocking rival UK store openings", date: "2026-08-07", time: "10:21", url: "https://www.ft.com/content/9d9e8f82-1626-429c-9434-a8540ca2ed64" },
  { id: "c01d3ee6-9755-43e5-94e8-b1221a39558e", title: "The Manchester roots of Andy Burnham's skills revolution", date: "2026-08-07", time: "10:00", url: "https://www.ft.com/content/c01d3ee6-9755-43e5-94e8-b1221a39558e" },
  { id: "7c028aa0-cb64-4f71-9605-f63b83df7af4", title: "DR Congo launches probe into uranium-contaminated cobalt exports", date: "2026-08-07", time: "09:48", url: "https://www.ft.com/content/7c028aa0-cb64-4f71-9605-f63b83df7af4" },
  { id: "538b3457-4bef-4012-89b9-3c068b900e6e", title: "Submit your questions: Wildfires, droughts and heat — is this summer our new normal?", date: "2026-08-07", time: "09:34", url: "https://www.ft.com/content/538b3457-4bef-4012-89b9-3c068b900e6e" },
  { id: "857508f3-028b-4b10-b7c1-e56aa07b5b2b", title: "Tories vow to ban foreign nationals from accessing UK social housing", date: "2026-08-07", time: "09:32", url: "https://www.ft.com/content/857508f3-028b-4b10-b7c1-e56aa07b5b2b" },
  { id: "d9922d0b-51a0-48be-811b-42e08f90985a", title: "US euro sale to prop up yen blindsided ECB", date: "2026-08-07", time: "09:08", url: "https://www.ft.com/content/d9922d0b-51a0-48be-811b-42e08f90985a" },
  { id: "4c756bd3-a7b8-45ef-aaee-1bfd48fc1439", title: "After the great deleveraging", date: "2026-08-07", time: "06:30", url: "https://www.ft.com/content/4c756bd3-a7b8-45ef-aaee-1bfd48fc1439" },
  { id: "22a6bce7-ccec-4e7d-a31b-ca8d67b1bcb6", title: "The curious case of the Japanese government bond yields", date: "2026-08-07", time: "06:00", url: "https://www.ft.com/content/22a6bce7-ccec-4e7d-a31b-ca8d67b1bcb6" },
  { id: "ade0df5d-c341-4d3a-b1d0-a4bee09dd2fc", title: "FTAV's further reading", date: "2026-08-07", time: "06:00", url: "https://www.ft.com/content/ade0df5d-c341-4d3a-b1d0-a4bee09dd2fc" },
  { id: "9c99a309-e133-4882-8cea-f21aa1eea0e1", title: "FirstFT: Google shakes up AI leadership", date: "2026-08-07", time: "05:40", url: "https://www.ft.com/content/9c99a309-e133-4882-8cea-f21aa1eea0e1" },
  { id: "6bbddd45-5f39-4140-8218-66b66b7d08a6", title: "Revisiting our estimates for Japan's neutral rate", date: "2026-08-07", time: "05:30", url: "https://www.ft.com/content/6bbddd45-5f39-4140-8218-66b66b7d08a6" },
  { id: "9387ed2c-837a-4ea1-8d5f-180513292c9a", title: "Big Law's new private equity era", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/9387ed2c-837a-4ea1-8d5f-180513292c9a" },
  { id: "8e481c49-b95b-442b-a88a-f0cc402b1bf9", title: "'I'll support him all the way': Clacton voters rally to Nigel Farage despite heightened scrutiny", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/8e481c49-b95b-442b-a88a-f0cc402b1bf9" },
  { id: "4a99c7bd-6da4-4a07-915b-e0e889e8c73d", title: "Britain's incoming CEOs enjoy the 'new boss bounce'", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/4a99c7bd-6da4-4a07-915b-e0e889e8c73d" },
  { id: "f8fc56ba-7088-4f73-87c1-13b11eee80ec", title: "'It's now or never.' Is the EU serious about letting in new members?", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/f8fc56ba-7088-4f73-87c1-13b11eee80ec" },
  { id: "daec1a03-d1a2-4f17-8dda-ede4140a88c2", title: "Yen intervention illustrates the dangers of monetary experiments", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/daec1a03-d1a2-4f17-8dda-ede4140a88c2" },
  { id: "aea25d0e-f7f8-484c-b186-57775e635aa7", title: "Warsh is being misread", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/aea25d0e-f7f8-484c-b186-57775e635aa7" },
  { id: "1e749b77-db33-4281-91f3-13e8bf6bf433", title: "Glenn Youngkin's swing-state school campaign fuels White House speculation", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/1e749b77-db33-4281-91f3-13e8bf6bf433" },
  { id: "e7585052-7fd6-419a-9c6e-3c6984da0f3d", title: "Refining crunch keeps fuel prices high as crude retreats", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/e7585052-7fd6-419a-9c6e-3c6984da0f3d" },
  { id: "83f594d8-5878-4ecf-a274-4a4ae9eeb30c", title: "Naval parts supplier Goodwin explores sale of defence business", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/83f594d8-5878-4ecf-a274-4a4ae9eeb30c" },
  { id: "30fe8c0a-5022-46d4-be53-101c4af0185e", title: "Parents haggle with private schools over fees as VAT pushes up costs", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/30fe8c0a-5022-46d4-be53-101c4af0185e" },
  { id: "1c4a641c-42f4-429e-94c2-7d16cac96d49", title: "To fix education, fix the economy first", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/1c4a641c-42f4-429e-94c2-7d16cac96d49" },
  { id: "cef4e506-00c1-4892-bedd-9bf1489a7014", title: "Billionaire's financial data group Ion chased by landlords for overdue rent", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/cef4e506-00c1-4892-bedd-9bf1489a7014" },
  { id: "1cc700ca-730a-4138-a1a3-f69defa62945", title: "How leaving Opec unleashed Adnoc's global ambitions", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/1cc700ca-730a-4138-a1a3-f69defa62945" },
  { id: "5d6b7dcf-fe0e-4cb1-ad1d-0157407296cc", title: "Starlink mobile threat has been exaggerated, says T-Mobile CEO", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/5d6b7dcf-fe0e-4cb1-ad1d-0157407296cc" },
  { id: "e9d4cabe-b95f-41da-9159-322e4ccbd6db", title: "UK's 'staycation' summer fails to lift hotel profits as costs climb", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/e9d4cabe-b95f-41da-9159-322e4ccbd6db" },
  { id: "7c35f5dd-7c40-4748-a103-f47ab44c858d", title: "El Nino threatens to disrupt the world's most-traded commodities", date: "2026-08-07", time: "05:00", url: "https://www.ft.com/content/7c35f5dd-7c40-4748-a103-f47ab44c858d" },
  { id: "80f5fede-a34a-4069-a751-f9523e3c6e00", title: "Jane Street in talks to shift its $11bn in debt to investors including Pimco", date: "2026-08-06", time: "21:10", url: "https://www.ft.com/content/80f5fede-a34a-4069-a751-f9523e3c6e00" },
  { id: "051e6fbf-e796-4b92-9c6e-7b85c74e8edc", title: "Argentine company accuses US of meddling in Huawei data centre project", date: "2026-08-06", time: "20:44", url: "https://www.ft.com/content/051e6fbf-e796-4b92-9c6e-7b85c74e8edc" },
  { id: "f6f53b98-9661-4d50-bf25-b32738643cac", title: "US halts imports of Mexico avocados over security concerns", date: "2026-08-06", time: "20:43", url: "https://www.ft.com/content/f6f53b98-9661-4d50-bf25-b32738643cac" },
  { id: "77f00cf3-f2e6-4dcb-bf0d-1631ca45dd9c", title: "California sues DuPont over alleged effort to avoid 'forever chemicals' liabilities", date: "2026-08-06", time: "19:09", url: "https://www.ft.com/content/77f00cf3-f2e6-4dcb-bf0d-1631ca45dd9c" },
  { id: "8b2d8925-7fb9-44c8-8093-48442455ebe0", title: "Airtable's cut-price sale is just the start for software also-rans", date: "2026-08-06", time: "18:13", url: "https://www.ft.com/content/8b2d8925-7fb9-44c8-8093-48442455ebe0" },
  { id: "0aee7523-09d7-4831-bc20-711d7191822e", title: "The shrinking space for democracy in Africa", date: "2026-08-06", time: "18:12", url: "https://www.ft.com/content/0aee7523-09d7-4831-bc20-711d7191822e" },
  { id: "3989b6a0-ba02-412b-8f35-b6817c3e42f6", title: "Honeywell Aerospace shares plunge on failure to overcome supply constraints", date: "2026-08-06", time: "18:07", url: "https://www.ft.com/content/3989b6a0-ba02-412b-8f35-b6817c3e42f6" },
];
