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
  {
    id: "46194a0b-a0e4-42cc-ad40-0df753492768",
    title: "Google releases most advanced Gemini AI model",
    date: "2026-09-30",
    time: "21:09",
    url: "https://www.ft.com/content/46194a0b-a0e4-42cc-ad40-0df753492768",
  },
  {
    id: "ef10b301-6264-4ac8-8d23-bd3dddf9b8a2",
    title: "Burnham clears path to EU summit with post-Brexit breakthrough",
    date: "2026-09-30",
    time: "21:00",
    url: "https://www.ft.com/content/ef10b301-6264-4ac8-8d23-bd3dddf9b8a2",
  },
  {
    id: "c3a6e3b7-e998-43f0-82b2-f197e5d1730b",
    title: "Boots owner nearing $9bn sale of chemist to Canada’s Weston family",
    date: "2026-09-30",
    time: "19:59",
    url: "https://www.ft.com/content/c3a6e3b7-e998-43f0-82b2-f197e5d1730b",
  },
  {
    id: "ecc95946-92ed-426c-bcf9-e6575e1cf6c6",
    title: "18,000 feet in 90 seconds: Inside Flydubai’s near-catastrophe",
    date: "2026-09-30",
    time: "19:31",
    url: "https://www.ft.com/content/ecc95946-92ed-426c-bcf9-e6575e1cf6c6",
  },
  {
    id: "08109881-f33c-43e0-9dc6-fc3a00d4e35b",
    title: "How the UAE became a destination for Israelis",
    date: "2026-09-30",
    time: "19:30",
    url: "https://www.ft.com/content/08109881-f33c-43e0-9dc6-fc3a00d4e35b",
  },
  {
    id: "81a5e13f-0a9c-4de2-b02d-f291fccae797",
    title: "UK retreats on climate reporting rules for listed companies",
    date: "2026-09-30",
    time: "19:10",
    url: "https://www.ft.com/content/81a5e13f-0a9c-4de2-b02d-f291fccae797",
  },
  {
    id: "cd22d20a-3b65-4534-ac04-f5008810e10a",
    title: "Bond markets resume sell-off after strong US data",
    date: "2026-09-30",
    time: "18:25",
    url: "https://www.ft.com/content/cd22d20a-3b65-4534-ac04-f5008810e10a",
  },
  {
    id: "a3075bf9-5b6c-40c8-bb6b-aca4422d1cbb",
    title: "US competition watchdog expands investigation of Anthropic and OpenAI",
    date: "2026-09-30",
    time: "18:07",
    url: "https://www.ft.com/content/a3075bf9-5b6c-40c8-bb6b-aca4422d1cbb",
  },
  {
    id: "78431eef-50ee-4ec9-9ca6-af801da1e617",
    title: "Fed watchdog finds ‘deficiencies’ but no criminal wrongdoing in $2.5bn renovation project",
    date: "2026-09-30",
    time: "18:00",
    url: "https://www.ft.com/content/78431eef-50ee-4ec9-9ca6-af801da1e617",
  },
  {
    id: "f5e98843-7625-4999-9b99-c03f2ec26c4c",
    title: "To fix housing affordability, build more homes",
    date: "2026-09-30",
    time: "17:44",
    url: "https://www.ft.com/content/f5e98843-7625-4999-9b99-c03f2ec26c4c",
  },
  {
    id: "0d74d66a-a9ee-4c22-83ab-9df6452117de",
    title: "US oil industry warns diesel prices will not return to normal for a year",
    date: "2026-09-30",
    time: "17:20",
    url: "https://www.ft.com/content/0d74d66a-a9ee-4c22-83ab-9df6452117de",
  },
  {
    id: "e9f2345f-6d7b-4fbb-831a-5fe576317701",
    title: "National care service may not launch until late 2030s, suggests Burnham",
    date: "2026-09-30",
    time: "17:11",
    url: "https://www.ft.com/content/e9f2345f-6d7b-4fbb-831a-5fe576317701",
  },
  {
    id: "bb557b06-6880-4bae-a719-fbd733c63787",
    title: "‘Strong indications’ Iran was involved in RAF Fairford incident, says Andy Burnham",
    date: "2026-09-30",
    time: "17:00",
    url: "https://www.ft.com/content/bb557b06-6880-4bae-a719-fbd733c63787",
  },
  {
    id: "c05f3ba5-e24e-4c88-86ed-04f4b229cd15",
    title: "Don’t own bonds and be cautious with stocks",
    date: "2026-09-30",
    time: "16:53",
    url: "https://www.ft.com/content/c05f3ba5-e24e-4c88-86ed-04f4b229cd15",
  },
  {
    id: "3e84fbcb-d064-46f8-be79-44060a722447",
    title: "Andy Burnham tightens his hold on Labour",
    date: "2026-09-30",
    time: "16:35",
    url: "https://www.ft.com/content/3e84fbcb-d064-46f8-be79-44060a722447",
  },
  {
    id: "f52f7b0e-be7d-414c-b19d-d78a3a5f4882",
    title: "How will Donald Trump ‘accord’ for AI to ‘self-regulate’ work?",
    date: "2026-09-30",
    time: "16:31",
    url: "https://www.ft.com/content/f52f7b0e-be7d-414c-b19d-d78a3a5f4882",
  },
  {
    id: "16b9d519-faf6-4dbe-863a-5821e54021cc",
    title: "What are Andy Burnham’s options on Europe?",
    date: "2026-09-30",
    time: "16:12",
    url: "https://www.ft.com/content/16b9d519-faf6-4dbe-863a-5821e54021cc",
  },
  {
    id: "5e39d12d-c088-458f-9b03-0594292f772e",
    title: "SEC proposes performance fees for retail funds in private markets push",
    date: "2026-09-30",
    time: "16:10",
    url: "https://www.ft.com/content/5e39d12d-c088-458f-9b03-0594292f772e",
  },
  {
    id: "08a71b38-d98c-472a-9576-e40ae2cfdf19",
    title: "AI voice start-up ElevenLabs doubles valuation to $22bn",
    date: "2026-09-30",
    time: "16:00",
    url: "https://www.ft.com/content/08a71b38-d98c-472a-9576-e40ae2cfdf19",
  },
  {
    id: "cf14f353-f833-4e38-b868-39918923f8b1",
    title: "Morocco’s first female prime minister launches coalition talks",
    date: "2026-09-30",
    time: "15:54",
    url: "https://www.ft.com/content/cf14f353-f833-4e38-b868-39918923f8b1",
  },
  {
    id: "97043be8-28f7-40c8-936f-617ebeec5d2b",
    title: "Weak PCE inflation eases pressure for Fed rate increases",
    date: "2026-09-30",
    time: "15:24",
    url: "https://www.ft.com/content/97043be8-28f7-40c8-936f-617ebeec5d2b",
  },
  {
    id: "196d62b5-f180-4311-99df-99472bab1a2b",
    title: "The UK needs to do more to support its own AI companies",
    date: "2026-09-30",
    time: "15:23",
    url: "https://www.ft.com/content/196d62b5-f180-4311-99df-99472bab1a2b",
  },
  {
    id: "5c1ccafc-c3e6-49c1-8cdc-b9ed73627749",
    title: "AI debt surge raises risk of sharp market correction, warns Bank of England",
    date: "2026-09-30",
    time: "15:02",
    url: "https://www.ft.com/content/5c1ccafc-c3e6-49c1-8cdc-b9ed73627749",
  },
  {
    id: "33449ea5-428b-4080-bdf6-ff5843bbd3cd",
    title: "KKR warns of growing credit market risks from AI borrowing spree",
    date: "2026-09-30",
    time: "14:03",
    url: "https://www.ft.com/content/33449ea5-428b-4080-bdf6-ff5843bbd3cd",
  },
  {
    id: "f71120fb-266f-42fb-8042-dbeccfd9cf0c",
    title: "MI5 warns universities to cut ties with Chinese institute",
    date: "2026-09-30",
    time: "14:00",
    url: "https://www.ft.com/content/f71120fb-266f-42fb-8042-dbeccfd9cf0c",
  },
  {
    id: "a19a0885-baf9-4063-9c7b-fd364c9d81e0",
    title: "Netherlands retreats from taxing paper profits on investments",
    date: "2026-09-30",
    time: "13:57",
    url: "https://www.ft.com/content/a19a0885-baf9-4063-9c7b-fd364c9d81e0",
  },
  {
    id: "ec98b9b5-6677-4b26-b892-82aaac034143",
    title: "Inflation accelerates in Eurozone’s biggest economies",
    date: "2026-09-30",
    time: "13:44",
    url: "https://www.ft.com/content/ec98b9b5-6677-4b26-b892-82aaac034143",
  },
  {
    id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2",
    title: "Inflation and interest rates tracker: see how your country compares",
    date: "2026-09-30",
    time: "13:30",
    url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2",
  },
  {
    id: "e7c044f0-5448-4d90-9b86-9786ffafbc7b",
    title: "Bond investors 💔 OATs",
    date: "2026-09-30",
    time: "13:08",
    url: "https://www.ft.com/content/e7c044f0-5448-4d90-9b86-9786ffafbc7b",
  },
  {
    id: "9ed39214-1735-4e55-91dc-42dba21c4fba",
    title: "How to escape the low-pay, low-productivity jobs trap",
    date: "2026-09-30",
    time: "13:06",
    url: "https://www.ft.com/content/9ed39214-1735-4e55-91dc-42dba21c4fba",
  },
  {
    id: "1bb7ec8d-7252-4fa3-8c4a-81fa5b6906a2",
    title: "Russia threatens nuclear strikes on Nato countries over Kaliningrad",
    date: "2026-09-30",
    time: "12:35",
    url: "https://www.ft.com/content/1bb7ec8d-7252-4fa3-8c4a-81fa5b6906a2",
  },
  {
    id: "bc1dd9d4-39ed-4aa2-a11d-89be1b6f3844",
    title: "Brazil election roiled by row over Flávio Bolsonaro and patron saint",
    date: "2026-09-30",
    time: "12:34",
    url: "https://www.ft.com/content/bc1dd9d4-39ed-4aa2-a11d-89be1b6f3844",
  },
  {
    id: "043221b2-d06c-4171-aa50-eeaebaf7674a",
    title: "US withdraws remaining troops from Iraq",
    date: "2026-09-30",
    time: "12:28",
    url: "https://www.ft.com/content/043221b2-d06c-4171-aa50-eeaebaf7674a",
  },
  {
    id: "fc705366-9a91-4e99-9c07-e962dca6354b",
    title: "Russia extends diesel export ban",
    date: "2026-09-30",
    time: "12:24",
    url: "https://www.ft.com/content/fc705366-9a91-4e99-9c07-e962dca6354b",
  },
  {
    id: "d36aa5b9-d770-4800-ba76-70bfbb62f4a7",
    title: "Trump’s coal drive plays into Beijing’s hands",
    date: "2026-09-30",
    time: "12:00",
    url: "https://www.ft.com/content/d36aa5b9-d770-4800-ba76-70bfbb62f4a7",
  },
  {
    id: "3b926f6b-d9a4-4252-90da-5a336a5276e7",
    title: "At least Burnham doesn’t pretend to care about growth",
    date: "2026-09-30",
    time: "11:35",
    url: "https://www.ft.com/content/3b926f6b-d9a4-4252-90da-5a336a5276e7",
  },
  {
    id: "db266f36-c6d3-4368-8633-290e2c35e54d",
    title: "Submit a question: What’s next for the global economy?",
    date: "2026-09-30",
    time: "11:20",
    url: "https://www.ft.com/content/db266f36-c6d3-4368-8633-290e2c35e54d",
  },
  {
    id: "5bb621fa-2c18-4384-80ab-4a72e51b139a",
    title: "Aliko Dangote’s $16bn oil refinery project paused by Kenyan court",
    date: "2026-09-30",
    time: "10:35",
    url: "https://www.ft.com/content/5bb621fa-2c18-4384-80ab-4a72e51b139a",
  },
  {
    id: "1c7bafaf-e7cd-47a8-9c69-150f4c04d4d2",
    title: "Andy Burnham’s courageous speech had one striking omission",
    date: "2026-09-30",
    time: "09:40",
    url: "https://www.ft.com/content/1c7bafaf-e7cd-47a8-9c69-150f4c04d4d2",
  },
  {
    id: "3b5b46d7-2dcf-40f0-82f3-65ab6e4be76b",
    title: "Ken Griffin donates $3bn to Carnegie Mellon as university plots Miami campus",
    date: "2026-09-30",
    time: "09:30",
    url: "https://www.ft.com/content/3b5b46d7-2dcf-40f0-82f3-65ab6e4be76b",
  },
];
