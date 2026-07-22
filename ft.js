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
  { id: "0c03cd07-ab33-4dff-9970-8cbc21baef45", title: "Burnham can be the failure that Britain needs", date: "2026-07-22", time: "11:59", url: "https://www.ft.com/content/0c03cd07-ab33-4dff-9970-8cbc21baef45" },
  { id: "e3dd8c16-6b12-4e7a-8772-c970b7b026d2", title: "Citadel Securities opens Amsterdam options trading office", date: "2026-07-22", time: "11:30", url: "https://www.ft.com/content/e3dd8c16-6b12-4e7a-8772-c970b7b026d2" },
  { id: "ee030fed-d006-48d3-bc71-da452ce4069e", title: "Prologis lifts Segro offer to £14bn as takeover battle intensifies", date: "2026-07-22", time: "11:20", url: "https://www.ft.com/content/ee030fed-d006-48d3-bc71-da452ce4069e" },
  { id: "8497ab71-cfa3-4651-bf9e-40c63e23cf15", title: "US food illnesses climb as authorities struggle to identify source", date: "2026-07-22", time: "11:00", url: "https://www.ft.com/content/8497ab71-cfa3-4651-bf9e-40c63e23cf15" },
  { id: "a789fa81-6c39-48a1-9df3-33d67ce7a5ac", title: "US start-up wins EU approval for sight-restoring bionic eye", date: "2026-07-22", time: "11:00", url: "https://www.ft.com/content/a789fa81-6c39-48a1-9df3-33d67ce7a5ac" },
  { id: "31f4f7f3-8c35-42af-8898-1dd988e74fc6", title: "Cutting VAT from energy bills is a painkiller, not a cure", date: "2026-07-22", time: "09:44", url: "https://www.ft.com/content/31f4f7f3-8c35-42af-8898-1dd988e74fc6" },
  { id: "5894ac4c-4480-4ab5-a8ea-8d3c7e244cb9", title: "June's encouraging inflation will be discounted by Bank of England", date: "2026-07-22", time: "08:06", url: "https://www.ft.com/content/5894ac4c-4480-4ab5-a8ea-8d3c7e244cb9" },
  { id: "90facd68-4df7-40c2-9383-e989a02fbe51", title: "Oil rises to highest level in six weeks as Middle East war escalates", date: "2026-07-22", time: "09:08", url: "https://www.ft.com/content/90facd68-4df7-40c2-9383-e989a02fbe51" },
  { id: "62c39102-c288-4041-911f-8f2ba74fc451", title: "UK inflation falls more than expected to 2.6% in June", date: "2026-07-22", time: "08:38", url: "https://www.ft.com/content/62c39102-c288-4041-911f-8f2ba74fc451" },
  { id: "9ffbd5c5-e5b2-431c-aadd-fa3d1c45898f", title: "Wetherspoons issues fourth profit warning this year", date: "2026-07-22", time: "08:29", url: "https://www.ft.com/content/9ffbd5c5-e5b2-431c-aadd-fa3d1c45898f" },
  { id: "d8c377d5-630c-46de-8348-b08affa7d013", title: "Andy Burnham launches £2 cap on bus fares in latest cost of living intervention", date: "2026-07-22", time: "08:18", url: "https://www.ft.com/content/d8c377d5-630c-46de-8348-b08affa7d013" },
  { id: "259d8ce9-c56f-40b6-9ab7-9da9a3d1d502", title: "Santander profits curbed by TSB restructuring costs", date: "2026-07-22", time: "07:49", url: "https://www.ft.com/content/259d8ce9-c56f-40b6-9ab7-9da9a3d1d502" },
  { id: "592162dc-66ab-475d-973f-64738f7a3f2e", title: "India’s Gen Z takes on Modi", date: "2026-07-22", time: "07:17", url: "https://www.ft.com/content/592162dc-66ab-475d-973f-64738f7a3f2e" },
  { id: "ee2a0a8e-3698-4fdf-9616-807dcdc8ae12", title: "Warsh’s balance sheet consultants", date: "2026-07-22", time: "06:30", url: "https://www.ft.com/content/ee2a0a8e-3698-4fdf-9616-807dcdc8ae12" },
  { id: "a571086a-04cc-4dc6-a595-13af67af2ea7", title: "FTAV’s further reading", date: "2026-07-22", time: "06:30", url: "https://www.ft.com/content/a571086a-04cc-4dc6-a595-13af67af2ea7" },
  { id: "05f08fff-f325-4310-91ac-d64ab12eca3d", title: "Why the EU faces a Russian oil vs LNG sanctions stand-off", date: "2026-07-22", time: "06:00", url: "https://www.ft.com/content/05f08fff-f325-4310-91ac-d64ab12eca3d" },
  { id: "3fcda833-80d2-4e13-86f4-29b479b79adf", title: "Is AI productivity growth in the room with us right now?", date: "2026-07-22", time: "06:00", url: "https://www.ft.com/content/3fcda833-80d2-4e13-86f4-29b479b79adf" },
  { id: "181b5cb9-1d9d-42e8-8036-67c98bf3cd80", title: "FirstFT: French AI start-up Mistral in fundraising talks with Samsung", date: "2026-07-22", time: "05:32", url: "https://www.ft.com/content/181b5cb9-1d9d-42e8-8036-67c98bf3cd80" },
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
  { id: "477664e9-6b39-4f1e-89ce-5cfaa1268866", title: "Andy Burnham’s ‘Number 10 North’ is already up and running", date: "2026-07-21", time: "18:33", url: "https://www.ft.com/content/477664e9-6b39-4f1e-89ce-5cfaa1268866" },
  { id: "6e28eae4-cd7b-48e8-ae5e-d555de88f428", title: "Saudi tankers reverse course after Houthi threats", date: "2026-07-21", time: "18:33", url: "https://www.ft.com/content/6e28eae4-cd7b-48e8-ae5e-d555de88f428" },
  { id: "3015bf23-c554-4de2-89f8-bf897990378e", title: "The EU needs to hold together on Russia sanctions", date: "2026-07-21", time: "18:20", url: "https://www.ft.com/content/3015bf23-c554-4de2-89f8-bf897990378e" },
  { id: "4b3ad003-07dd-4b82-a9ac-4bf6e7028844", title: "Kazakhstan stops sending oil to key Russian terminal after Ukrainian tanker attacks", date: "2026-07-21", time: "17:53", url: "https://www.ft.com/content/4b3ad003-07dd-4b82-a9ac-4bf6e7028844" },
  { id: "445a4bb8-1fcb-4bba-8c57-24fc7b4cd27b", title: "Rolls-Royce expects Airbus decision on new A350 version within a year", date: "2026-07-21", time: "17:50", url: "https://www.ft.com/content/445a4bb8-1fcb-4bba-8c57-24fc7b4cd27b" },
  { id: "226026f6-108e-45d5-a04b-eeb13be3ed3a", title: "Shares in UK defence groups rise on hopes John Healey will boost military spending", date: "2026-07-21", time: "17:44", url: "https://www.ft.com/content/226026f6-108e-45d5-a04b-eeb13be3ed3a" },
];
