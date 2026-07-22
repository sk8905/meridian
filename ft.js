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
  { id: "62d340a5-0806-40c4-ab30-a13823a00983", title: "Tokyo vows to take ‘bold’ action as yen keeps sliding", date: "2026-07-22", time: "05:04", url: "https://www.ft.com/content/62d340a5-0806-40c4-ab30-a13823a00983" },
  { id: "ae77f88d-7cde-43aa-ac03-204eae25edc2", title: "The Story of Money", date: "2026-07-22", time: "05:03", url: "https://www.ft.com/content/ae77f88d-7cde-43aa-ac03-204eae25edc2" },
  { id: "c87290b6-011d-4007-8984-b3049d388f0b", title: "The train that derailed a private equity titan", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/c87290b6-011d-4007-8984-b3049d388f0b" },
  { id: "23e1a4f0-61d5-4b0c-b355-7e9e9e8d8c34", title: "New UK energy secretary previously called for net zero target to be accelerated", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/23e1a4f0-61d5-4b0c-b355-7e9e9e8d8c34" },
  { id: "a1a12a62-1a86-44dc-9078-edfcc606e9a6", title: "Private capital misses out as IPO and deal boom lifts Wall Street banks", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/a1a12a62-1a86-44dc-9078-edfcc606e9a6" },
  { id: "a5e9dfe7-6b4d-476d-93a0-193a753b885a", title: "Who will win the war of neo-mercantilists?", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/a5e9dfe7-6b4d-476d-93a0-193a753b885a" },
  { id: "5ddb06cc-fb79-46ea-8ab1-3214d9905164", title: "Investors could do with their own ‘Number 10 North’", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/5ddb06cc-fb79-46ea-8ab1-3214d9905164" },
  { id: "3380135e-ed58-4694-94b2-1361a4472c18", title: "How shifts in capital flows could change the dollar’s role", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/3380135e-ed58-4694-94b2-1361a4472c18" },
  { id: "c528e40c-4ea4-44ca-ae1c-3738de5cb6d8", title: "European heatwave wiped €2bn from value of grain crop, analysis estimates", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/c528e40c-4ea4-44ca-ae1c-3738de5cb6d8" },
  { id: "0e562e03-106e-4729-83d7-675c27eb8c4d", title: "The US has collected about $13bn of Venezuela’s oil money. Where is it?", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/0e562e03-106e-4729-83d7-675c27eb8c4d" },
  { id: "e75154d2-7ab9-4c3e-bcb4-42efe1f2b89a", title: "Insurers cut prices in hunt for new oil and gas business", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/e75154d2-7ab9-4c3e-bcb4-42efe1f2b89a" },
  { id: "155c520f-cecc-4de2-8816-0728e66e2054", title: "The high price of insider information", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/155c520f-cecc-4de2-8816-0728e66e2054" },
  { id: "a361c87c-a782-4eb4-a5d7-dbcf4af766cd", title: "UK ethical fintech boss tried to set up arms deals with Wirecard’s Marsalek", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/a361c87c-a782-4eb4-a5d7-dbcf4af766cd" },
  { id: "6c54f212-7491-4d41-ae57-bd67b4ea0f43", title: "The UK’s biggest university is a private company", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/6c54f212-7491-4d41-ae57-bd67b4ea0f43" },
  { id: "ec61e2fb-a437-4ad8-aa93-8832c3ee871c", title: "Grant Thornton seeks tougher regulation as it tries to win top-tier audits", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/ec61e2fb-a437-4ad8-aa93-8832c3ee871c" },
  { id: "1e412996-10ef-403d-a210-3170d85ac342", title: "Fights over wills are growing as the population ages", date: "2026-07-22", time: "05:00", url: "https://www.ft.com/content/1e412996-10ef-403d-a210-3170d85ac342" },
  { id: "500286b4-335b-43a7-bff5-30336d852e96", title: "Zelenskyy replaces top Ukraine general in biggest military shake-up since 2024", date: "2026-07-21", time: "20:42", url: "https://www.ft.com/content/500286b4-335b-43a7-bff5-30336d852e96" },
  { id: "90facd68-4df7-40c2-9383-e989a02fbe51", title: "Donald Trump vows to attack Iranian nuclear facility as Middle East war escalates", date: "2026-07-21", time: "18:36", url: "https://www.ft.com/content/90facd68-4df7-40c2-9383-e989a02fbe51" },
  { id: "477664e9-6b39-4f1e-89ce-5cfaa1268866", title: "Andy Burnham’s ‘Number 10 North’ is already up and running", date: "2026-07-21", time: "18:33", url: "https://www.ft.com/content/477664e9-6b39-4f1e-89ce-5cfaa1268866" },
  { id: "6e28eae4-cd7b-48e8-ae5e-d555de88f428", title: "Saudi tankers reverse course after Houthi threats", date: "2026-07-21", time: "18:33", url: "https://www.ft.com/content/6e28eae4-cd7b-48e8-ae5e-d555de88f428" },
  { id: "3015bf23-c554-4de2-89f8-bf897990378e", title: "The EU needs to hold together on Russia sanctions", date: "2026-07-21", time: "18:20", url: "https://www.ft.com/content/3015bf23-c554-4de2-89f8-bf897990378e" },
  { id: "4b3ad003-07dd-4b82-a9ac-4bf6e7028844", title: "Kazakhstan stops sending oil to key Russian terminal after Ukrainian tanker attacks", date: "2026-07-21", time: "17:53", url: "https://www.ft.com/content/4b3ad003-07dd-4b82-a9ac-4bf6e7028844" },
  { id: "445a4bb8-1fcb-4bba-8c57-24fc7b4cd27b", title: "Rolls-Royce expects Airbus decision on new A350 version within a year", date: "2026-07-21", time: "17:50", url: "https://www.ft.com/content/445a4bb8-1fcb-4bba-8c57-24fc7b4cd27b" },
  { id: "226026f6-108e-45d5-a04b-eeb13be3ed3a", title: "Shares in UK defence groups rise on hopes John Healey will boost military spending", date: "2026-07-21", time: "17:44", url: "https://www.ft.com/content/226026f6-108e-45d5-a04b-eeb13be3ed3a" },
  { id: "68c5ee8a-7b24-4402-ae21-05a18382ad74", title: "India police detain opposition leader Rahul Gandhi as tensions rise", date: "2026-07-21", time: "17:33", url: "https://www.ft.com/content/68c5ee8a-7b24-4402-ae21-05a18382ad74" },
  { id: "6cb57cc5-d5e0-4264-a620-5982c2fcaf08", title: "The bear hug is an increasingly sensible way to play UK M&A", date: "2026-07-21", time: "17:14", url: "https://www.ft.com/content/6cb57cc5-d5e0-4264-a620-5982c2fcaf08" },
  { id: "053077e1-ad9d-4d81-ac58-56c0dc6b7335", title: "Kalshi seeks approval for perpetual precious metal contracts", date: "2026-07-21", time: "17:13", url: "https://www.ft.com/content/053077e1-ad9d-4d81-ac58-56c0dc6b7335" },
  { id: "0915cb0d-7d8a-4499-a900-0ede1a0bfa3d", title: "Monetary Policy Radar preview: ECB’s July meeting", date: "2026-07-21", time: "17:10", url: "https://www.ft.com/content/0915cb0d-7d8a-4499-a900-0ede1a0bfa3d" },
  { id: "8d98a654-3ccb-4efc-b0f5-50301ac35a18", title: "IEA warns of risk to energy supplies from escalation of Iran conflict", date: "2026-07-21", time: "17:05", url: "https://www.ft.com/content/8d98a654-3ccb-4efc-b0f5-50301ac35a18" },
  { id: "0616bdd3-bc3b-45a3-a034-4548e57c190d", title: "Andy Burnham’s cabinet: who’s in, who’s out?", date: "2026-07-21", time: "17:03", url: "https://www.ft.com/content/0616bdd3-bc3b-45a3-a034-4548e57c190d" },
  { id: "b8b8ba5f-8991-4c21-abb4-2f6cf25a0cfb", title: "Turkish opposition leader to create breakaway party to take on Erdoğan", date: "2026-07-21", time: "16:56", url: "https://www.ft.com/content/b8b8ba5f-8991-4c21-abb4-2f6cf25a0cfb" },
  { id: "c98495e5-ad15-498a-ab3f-9d3d72341975", title: "Liverpool FC owner in talks to sell stake to Mittal family-backed consortium", date: "2026-07-21", time: "16:36", url: "https://www.ft.com/content/c98495e5-ad15-498a-ab3f-9d3d72341975" },
  { id: "bfb81988-c973-48cf-babc-a0c65e2814c5", title: "Andy Burnham backs away from costly increase to income tax allowance", date: "2026-07-21", time: "16:25", url: "https://www.ft.com/content/bfb81988-c973-48cf-babc-a0c65e2814c5" },
  { id: "195c21cf-6a8c-4fd8-810c-66d18bc16842", title: "Bidder accuses Segro of ‘aspirational’ projections to justify rejecting £13.5bn offer", date: "2026-07-21", time: "16:20", url: "https://www.ft.com/content/195c21cf-6a8c-4fd8-810c-66d18bc16842" },
  { id: "61ff0520-ca83-4304-a078-865e15634e9c", title: "‘Major’ antitrust demands would destroy Europe space deal, warns Leonardo chief", date: "2026-07-21", time: "15:22", url: "https://www.ft.com/content/61ff0520-ca83-4304-a078-865e15634e9c" },
  { id: "e0aaea6b-a8b2-4482-a48c-ef802861b350", title: "How will UK foreign policy change under Ed Miliband?", date: "2026-07-21", time: "15:22", url: "https://www.ft.com/content/e0aaea6b-a8b2-4482-a48c-ef802861b350" },
  { id: "08779c55-de8a-4a91-8200-7e47d71f961c", title: "Axing UK science department risks slower policymaking, say tech leaders", date: "2026-07-21", time: "14:56", url: "https://www.ft.com/content/08779c55-de8a-4a91-8200-7e47d71f961c" },
  { id: "2b150649-6e35-48da-bac8-9fabdd8964cf", title: "Ann Widdecombe died after being ‘struck 21 times with hammer’", date: "2026-07-21", time: "14:37", url: "https://www.ft.com/content/2b150649-6e35-48da-bac8-9fabdd8964cf" },
  { id: "13092f23-4b2f-4e62-8aa9-76ab465a667c", title: "Donald Trump to meet Lebanon’s president as US pushes ahead with peace deal", date: "2026-07-21", time: "14:01", url: "https://www.ft.com/content/13092f23-4b2f-4e62-8aa9-76ab465a667c" },
  { id: "c346e82e-4d2c-4a2a-b4c3-64a4aa47d4e4", title: "Donald Trump threatens to reignite trade war with fresh 50% tariffs on Canada", date: "2026-07-21", time: "14:00", url: "https://www.ft.com/content/c346e82e-4d2c-4a2a-b4c3-64a4aa47d4e4" },
];
