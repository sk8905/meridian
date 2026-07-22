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
  { id: "c087714d-7d46-449b-9684-eba1975d313a", title: "Aston Martin strikes £550mn debt deal despite creditor objections", date: "2026-07-22", time: "19:22", url: "https://www.ft.com/content/c087714d-7d46-449b-9684-eba1975d313a" },
  { id: "8e33fb1d-cce3-4b56-9546-260f3f918c2d", title: "The real barrier to Africa’s solar energy boom", date: "2026-07-22", time: "18:52", url: "https://www.ft.com/content/8e33fb1d-cce3-4b56-9546-260f3f918c2d" },
  { id: "0c0b1e83-8e5e-4c86-b9c6-179dba51fc69", title: "Greek tycoon’s tanker towed into Iranian waters", date: "2026-07-22", time: "18:38", url: "https://www.ft.com/content/0c0b1e83-8e5e-4c86-b9c6-179dba51fc69" },
  { id: "aa6809e5-8963-433a-8458-61abe1526087", title: "UK education secretary accused of misleading claim about Oxford entry", date: "2026-07-22", time: "18:23", url: "https://www.ft.com/content/aa6809e5-8963-433a-8458-61abe1526087" },
  { id: "f51afc65-1569-446c-a23e-5afa583a67c2", title: "India should listen to its frustrated youth", date: "2026-07-22", time: "17:31", url: "https://www.ft.com/content/f51afc65-1569-446c-a23e-5afa583a67c2" },
  { id: "f0115d12-35b8-4dc2-9bf1-748203ac4331", title: "Pakistan seeks $10bn US facility to shore up reserves", date: "2026-07-22", time: "17:13", url: "https://www.ft.com/content/f0115d12-35b8-4dc2-9bf1-748203ac4331" },
  { id: "8f076be9-bf29-4df5-878b-835537ba2585", title: "European gas prices approach Iran war highs as traders fret over winter supplies", date: "2026-07-22", time: "17:03", url: "https://www.ft.com/content/8f076be9-bf29-4df5-878b-835537ba2585" },
  { id: "8c3a155b-03c0-4034-9403-839674a3df9e", title: "EU review of airline ownership rules clouds Apollo’s £5.7bn easyJet bid", date: "2026-07-22", time: "16:48", url: "https://www.ft.com/content/8c3a155b-03c0-4034-9403-839674a3df9e" },
  { id: "88da2738-6fce-497b-b8d5-1ed35196b3e0", title: "The battle over America’s War Powers Act", date: "2026-07-22", time: "16:47", url: "https://www.ft.com/content/88da2738-6fce-497b-b8d5-1ed35196b3e0" },
  { id: "07b3ea10-e15e-4863-8bf5-634e8fbde7d5", title: "The Lucid dream can continue on a bed of Saudi money", date: "2026-07-22", time: "16:26", url: "https://www.ft.com/content/07b3ea10-e15e-4863-8bf5-634e8fbde7d5" },
  { id: "19f7b0d3-f44c-422c-9e65-6b345ce55e39", title: "The deed thieves targeting New York brownstones", date: "2026-07-22", time: "16:20", url: "https://www.ft.com/content/19f7b0d3-f44c-422c-9e65-6b345ce55e39" },
  { id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2", title: "Inflation and interest rates tracker: see how your country compares", date: "2026-07-22", time: "16:18", url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2" },
  { id: "7ee4dffb-3393-45f4-ab7a-2c86a3ba2eea", title: "Clifford Chance partners paid record £2.3mn despite US slowdown", date: "2026-07-22", time: "16:15", url: "https://www.ft.com/content/7ee4dffb-3393-45f4-ab7a-2c86a3ba2eea" },
  { id: "5d12c0eb-1c98-4b60-a5da-1cd855bed137", title: "Southern Water and ex-CEO face criminal charges over wastewater tests", date: "2026-07-22", time: "16:05", url: "https://www.ft.com/content/5d12c0eb-1c98-4b60-a5da-1cd855bed137" },
  { id: "8b9d00aa-7e7a-46f4-bb98-b1635710bd59", title: "Wes Streeting refuses to commit to 3% defence spending ambition", date: "2026-07-22", time: "15:38", url: "https://www.ft.com/content/8b9d00aa-7e7a-46f4-bb98-b1635710bd59" },
  { id: "9db74b25-45ad-4187-b4d7-0e4d414fe41c", title: "OpenAI admits AI ‘agent’ caused major cyber breach by itself", date: "2026-07-22", time: "15:23", url: "https://www.ft.com/content/9db74b25-45ad-4187-b4d7-0e4d414fe41c" },
  { id: "755c218f-40db-4a8a-8e0b-acd2ccee3d3d", title: "Trump threatens tit-for-tat strikes on Iranian infrastructure", date: "2026-07-22", time: "15:23", url: "https://www.ft.com/content/755c218f-40db-4a8a-8e0b-acd2ccee3d3d" },
  { id: "1fbc6768-8d86-44c5-b673-db11587ba5ed", title: "Can ‘Brand Burnham’ survive the move to Number 10?", date: "2026-07-22", time: "15:08", url: "https://www.ft.com/content/1fbc6768-8d86-44c5-b673-db11587ba5ed" },
  { id: "5aa0363c-63ff-4afe-96c8-2f3fc5bd14bd", title: "NHS England adds caveat to pro-Palantir data after watchdog probe", date: "2026-07-22", time: "15:07", url: "https://www.ft.com/content/5aa0363c-63ff-4afe-96c8-2f3fc5bd14bd" },
  { id: "b7e572e2-ac26-4842-82ee-1c355ac7c848", title: "Mercedes risks US sales ban under Senate China bill", date: "2026-07-22", time: "15:00", url: "https://www.ft.com/content/b7e572e2-ac26-4842-82ee-1c355ac7c848" },
  { id: "080107ca-1be0-447c-8222-e0e7328d5129", title: "Germany to buy stakes in defence start-ups", date: "2026-07-22", time: "14:41", url: "https://www.ft.com/content/080107ca-1be0-447c-8222-e0e7328d5129" },
  { id: "905dd8ab-2b51-4b22-9e11-8ec2e6e7784a", title: "Nestlé nears deal to sell stake in €5bn Perrier unit", date: "2026-07-22", time: "14:30", url: "https://www.ft.com/content/905dd8ab-2b51-4b22-9e11-8ec2e6e7784a" },
  { id: "9c74bb34-0705-4be1-b622-a334ce79db1d", title: "AMD to invest up to $5bn in Anthropic in chip deal", date: "2026-07-22", time: "14:16", url: "https://www.ft.com/content/9c74bb34-0705-4be1-b622-a334ce79db1d" },
  { id: "b60dd8ee-368d-41ef-a259-a3297b3f25f9", title: "Andy Burnham signals review of early-release scheme for prisoners", date: "2026-07-22", time: "13:33", url: "https://www.ft.com/content/b60dd8ee-368d-41ef-a259-a3297b3f25f9" },
  { id: "89e70057-17b1-41b5-bced-9a0cd3f0e9bb", title: "How the West Country became the UK’s most dysfunctional property market", date: "2026-07-22", time: "13:14", url: "https://www.ft.com/content/89e70057-17b1-41b5-bced-9a0cd3f0e9bb" },
  { id: "ffe4cbfd-e997-480f-a220-cf5bbf999d09", title: "Deutsche Bank headquarters raided for third time this year", date: "2026-07-22", time: "12:34", url: "https://www.ft.com/content/ffe4cbfd-e997-480f-a220-cf5bbf999d09" },
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
];
