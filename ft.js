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
  { id: "6df8a0ef-447f-43de-81a0-48db79498d93", title: "Macquarie names banking head to succeed Shemara Wikramanayake as CEO", date: "2026-07-23", time: "09:03", url: "https://www.ft.com/content/6df8a0ef-447f-43de-81a0-48db79498d93" },
  { id: "1ddfbe42-b8e8-487c-a156-505879469926", title: "Oil jumps to $98 after Houthis attack two Saudi Arabian tankers", date: "2026-07-23", time: "08:50", url: "https://www.ft.com/content/1ddfbe42-b8e8-487c-a156-505879469926" },
  { id: "e9bbefc8-a749-4351-a89b-461de2ec63e3", title: "Andy Burnham announces cut to business rates for pubs and clubs", date: "2026-07-23", time: "08:50", url: "https://www.ft.com/content/e9bbefc8-a749-4351-a89b-461de2ec63e3" },
  { id: "851290c9-b788-4987-a6da-c084d83a6313", title: "Modi vows ‘swift’ justice for India exam leaks", date: "2026-07-23", time: "06:47", url: "https://www.ft.com/content/851290c9-b788-4987-a6da-c084d83a6313" },
  { id: "b3e67789-9470-47c1-b984-a3e9c8d731a1", title: "How to be a bull on the S&P 500", date: "2026-07-23", time: "06:30", url: "https://www.ft.com/content/b3e67789-9470-47c1-b984-a3e9c8d731a1" },
  { id: "d5a8bc4b-d212-4d19-807d-43037587c5a9", title: "FTAV’s further reading", date: "2026-07-23", time: "06:30", url: "https://www.ft.com/content/d5a8bc4b-d212-4d19-807d-43037587c5a9" },
  { id: "97055c78-cee8-448f-8c49-db91c1e80763", title: "BASF warns EU carbon plans risk accelerating industrial decline", date: "2026-07-23", time: "06:00", url: "https://www.ft.com/content/97055c78-cee8-448f-8c49-db91c1e80763" },
  { id: "0912c49b-13f1-4421-b52f-e82953cc94ae", title: "A practical problem with Andy Burnham’s postcode power-up plan", date: "2026-07-23", time: "06:00", url: "https://www.ft.com/content/0912c49b-13f1-4421-b52f-e82953cc94ae" },
  { id: "1e980bc1-0e2f-424b-abc9-4ed219522613", title: "BNP Paribas profits surge by a third after trading boom", date: "2026-07-23", time: "06:00", url: "https://www.ft.com/content/1e980bc1-0e2f-424b-abc9-4ed219522613" },
  { id: "874d9482-dedd-4c53-a6c1-af6f9148bd06", title: "FirstFT: Google burns through $6bn in cash amid AI infrastructure splurge", date: "2026-07-23", time: "05:31", url: "https://www.ft.com/content/874d9482-dedd-4c53-a6c1-af6f9148bd06" },
  { id: "5f4a3a71-5e4b-4b30-9c91-1bf1be58592e", title: "Household inflation expectations in the US are worryingly high", date: "2026-07-23", time: "05:30", url: "https://www.ft.com/content/5f4a3a71-5e4b-4b30-9c91-1bf1be58592e" },
  { id: "39224d70-632e-4cac-ae1c-59f7efbbccaf", title: "FT Wealth: July", date: "2026-07-23", time: "05:07", url: "https://www.ft.com/content/39224d70-632e-4cac-ae1c-59f7efbbccaf" },
  { id: "67928c74-bab1-4406-ac26-7e450b5d7c49", title: "Jes Staley to testify on Capitol Hill over ties to Jeffrey Epstein", date: "2026-07-23", time: "05:01", url: "https://www.ft.com/content/67928c74-bab1-4406-ac26-7e450b5d7c49" },
  { id: "e5dd1766-71b0-4127-996b-7f5fb2d72531", title: "English football is for sale", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/e5dd1766-71b0-4127-996b-7f5fb2d72531" },
  { id: "d331c1f5-27c0-4d5a-a4ab-7a52e1119cc5", title: "Buyout groups hunt for software bargains after ‘SaaS-pocalypse’", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/d331c1f5-27c0-4d5a-a4ab-7a52e1119cc5" },
  { id: "c3141534-9cbb-4126-b36e-621fd6a9c312", title: "Why is England unable to fix social care?", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/c3141534-9cbb-4126-b36e-621fd6a9c312" },
  { id: "019ce313-00c5-4d7d-a26c-acd7250de84a", title: "Trump Media fast feed for president’s posts sparks Wall Street backlash", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/019ce313-00c5-4d7d-a26c-acd7250de84a" },
  { id: "397c04d8-db0f-4902-9ea0-269584f43697", title: "Japan awakes", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/397c04d8-db0f-4902-9ea0-269584f43697" },
  { id: "1cbe4fd0-6b81-42c5-bc30-070fec3cd9dd", title: "Military briefing: can the US reopen the Strait of Hormuz by force?", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/1cbe4fd0-6b81-42c5-bc30-070fec3cd9dd" },
  { id: "39aa90bd-1869-4188-9280-188ccf69ef56", title: "Inflation data gives Andy Burnham’s cost of living pledge a boost", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/39aa90bd-1869-4188-9280-188ccf69ef56" },
  { id: "ecf9967d-de7f-405f-b746-f09a26f3a86a", title: "US oil refineries run at breakneck speeds as wars choke fuel supplies", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/ecf9967d-de7f-405f-b746-f09a26f3a86a" },
  { id: "fda9e7c8-87cd-49f8-bdf1-01adf293670f", title: "Russia forced to import fuel from India as Ukrainian strikes damage refineries", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/fda9e7c8-87cd-49f8-bdf1-01adf293670f" },
  { id: "36c412b6-ed17-4784-97ef-87b98dbd73e8", title: "EU urged to use more ‘clout’ against Beijing", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/36c412b6-ed17-4784-97ef-87b98dbd73e8" },
  { id: "7b53032e-894d-43ac-9dd1-2b94572b8489", title: "Is Trump winning the tariff wars?", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/7b53032e-894d-43ac-9dd1-2b94572b8489" },
  { id: "de2f1e69-791e-49d3-98f0-925b2697a5c5", title: "Why China’s assault on Europe’s car market has barely begun", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/de2f1e69-791e-49d3-98f0-925b2697a5c5" },
  { id: "b74cbc54-c6ae-4f4a-9350-3dab1f2758d0", title: "Betting account in George Cottrell’s name received $9mn in crypto from unidentified sources", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/b74cbc54-c6ae-4f4a-9350-3dab1f2758d0" },
  { id: "e9d88dc0-eb5b-4758-a993-33e4285b65f7", title: "Stressed private credit funds are an opportunity for secondary investors", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/e9d88dc0-eb5b-4758-a993-33e4285b65f7" },
  { id: "5822885a-5eae-4c0c-8f88-21163299a119", title: "US oil refineries race against dwindling supply", date: "2026-07-23", time: "05:00", url: "https://www.ft.com/content/5822885a-5eae-4c0c-8f88-21163299a119" },
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
];
