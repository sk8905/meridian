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
  { id: "7622bdcb-6106-4d98-a802-addcd49243fa", title: "Linklaters partners handed record £2.5mn payday as Asia business booms", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/7622bdcb-6106-4d98-a802-addcd49243fa" },
  { id: "35bc9320-0232-4d9e-95f4-d81d2e36d6fd", title: "Tom Hayes says UBS’s ‘Project Chocolate’ probe shows he was targeted from outset", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/35bc9320-0232-4d9e-95f4-d81d2e36d6fd" },
  { id: "a8a14c7e-2b7f-4ded-a48d-efa3338ff4ba", title: "US authorities probe Mark Walter’s insurance empire", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/a8a14c7e-2b7f-4ded-a48d-efa3338ff4ba" },
  { id: "dd268ceb-e664-4e37-b304-e16dd5142946", title: "Psychedelic drugs are going mainstream", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/dd268ceb-e664-4e37-b304-e16dd5142946" },
  { id: "98cc3d6e-fc41-4bf1-b3fa-ca4fac8dad31", title: "The wealthy Londoners betting on a luxury retirement", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/98cc3d6e-fc41-4bf1-b3fa-ca4fac8dad31" },
  { id: "a7e0e18a-fb97-424d-a18c-bf2e1b60beb3", title: "The cult shoes of summer 2026", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/a7e0e18a-fb97-424d-a18c-bf2e1b60beb3" },
  { id: "c84bb208-127f-4d29-9f1a-a137ec3ba8d2", title: "The five fiscal challenges facing John Healey", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/c84bb208-127f-4d29-9f1a-a137ec3ba8d2" },
  { id: "c2b74307-569b-448b-a1e6-c73b64d7c90b", title: "Pointers for Burnham on what Britain really wants", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/c2b74307-569b-448b-a1e6-c73b64d7c90b" },
  { id: "6049a031-9e9b-464c-97bb-414da04d5a6a", title: "China weighs tighter export controls on AI models and chips", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/6049a031-9e9b-464c-97bb-414da04d5a6a" },
  { id: "341d3e1b-f619-486d-9fd3-79d1906d9283", title: "The Gulf nation that became Iran’s softest target", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/341d3e1b-f619-486d-9fd3-79d1906d9283" },
  { id: "8aa89209-dc0b-4678-9b6a-01029398b304", title: "Midwest sunset: Trump’s tariffs hit America’s agricultural powerhouse", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/8aa89209-dc0b-4678-9b6a-01029398b304" },
  { id: "5c48b680-daf6-40d2-9522-ad997eb07b63", title: "Gary Stevenson may have been Citi’s most profitable trader… in developed market foreign exchange", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/5c48b680-daf6-40d2-9522-ad997eb07b63" },
  { id: "dcc76c2a-b463-4c9d-830b-58044b9967ea", title: "The factory on the front line of Europe’s economic battle with China", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/dcc76c2a-b463-4c9d-830b-58044b9967ea" },
  { id: "ccaf6c42-f94b-4afc-a063-7243b4fb78ed", title: "AI is becoming a geopolitical weapon, warns EU digital chief", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/ccaf6c42-f94b-4afc-a063-7243b4fb78ed" },
  { id: "fe63e973-b720-4c9c-bbee-8a91290f1872", title: "Injectables ‘wild west’: Galderma’s race to tame the botox boom", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/fe63e973-b720-4c9c-bbee-8a91290f1872" },
  { id: "716d0651-6f1f-4215-9d98-96a5047539cd", title: "What do we do when the household appliances start chatting among themselves?", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/716d0651-6f1f-4215-9d98-96a5047539cd" },
  { id: "3778ec84-778f-4983-8ad9-85e7dbb5698d", title: "Biotech deals surge to record as fear of missing out grips Big Pharma", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/3778ec84-778f-4983-8ad9-85e7dbb5698d" },
  { id: "30250901-234b-4b48-9402-ed03cf1ff6c8", title: "Czech central bank chief warns against joining Eurozone too early", date: "2026-07-21", time: "05:00", url: "https://www.ft.com/content/30250901-234b-4b48-9402-ed03cf1ff6c8" },
  { id: "05b20ea3-425b-49da-886e-fd0ac9270fe7", title: "Who is in Andy Burnham’s new cabinet?", date: "2026-07-20", time: "20:40", url: "https://www.ft.com/content/05b20ea3-425b-49da-886e-fd0ac9270fe7" },
  { id: "9f36df1b-cc5b-4391-ae91-562cf85a58a3", title: "Man charged with Ann Widdecombe murder", date: "2026-07-20", time: "19:40", url: "https://www.ft.com/content/9f36df1b-cc5b-4391-ae91-562cf85a58a3" },
  { id: "b7cc3ea9-c89c-4f94-8ce0-3786034a6ddc", title: "Gilts under pressure as investors brace for higher spending under new PM", date: "2026-07-20", time: "19:37", url: "https://www.ft.com/content/b7cc3ea9-c89c-4f94-8ce0-3786034a6ddc" },
  { id: "740f0449-f367-46e0-92a6-43251f56f974", title: "Burnham stuns Labour MPs by choosing Healey as new chancellor", date: "2026-07-20", time: "19:35", url: "https://www.ft.com/content/740f0449-f367-46e0-92a6-43251f56f974" },
  { id: "e9563a0f-0a93-4a38-87e1-32b7898522d8", title: "Big Tech’s AI backstops risk ignominy", date: "2026-07-20", time: "18:55", url: "https://www.ft.com/content/e9563a0f-0a93-4a38-87e1-32b7898522d8" },
  { id: "948861e2-3064-47b7-848b-0bdd633a6c00", title: "Andy Burnham’s tenure begins with troubling signals", date: "2026-07-20", time: "18:47", url: "https://www.ft.com/content/948861e2-3064-47b7-848b-0bdd633a6c00" },
  { id: "ce24c3cb-4643-43f1-8cfd-688056a434ec", title: "US judge pauses Paramount’s $110bn Warner Bros acquisition", date: "2026-07-20", time: "18:37", url: "https://www.ft.com/content/ce24c3cb-4643-43f1-8cfd-688056a434ec" },
  { id: "13092f23-4b2f-4e62-8aa9-76ab465a667c", title: "Donald Trump to meet Lebanon’s president as US pushes ahead with peace deal", date: "2026-07-20", time: "18:27", url: "https://www.ft.com/content/13092f23-4b2f-4e62-8aa9-76ab465a667c" },
  { id: "ffbf8a50-e497-4ab6-a2d3-d94277f4a087", title: "Andy Burnham becomes UK prime minister promising ‘unity and positivity’", date: "2026-07-20", time: "18:21", url: "https://www.ft.com/content/ffbf8a50-e497-4ab6-a2d3-d94277f4a087" },
  { id: "5e79b5d1-6b2a-4d9d-8b46-6980e861856d", title: "US probes insurers owned by billionaire Mark Walter over asset disclosures", date: "2026-07-20", time: "18:04", url: "https://www.ft.com/content/5e79b5d1-6b2a-4d9d-8b46-6980e861856d" },
  { id: "c28acecc-7fa1-44ce-b343-c282cb23fe47", title: "Labour has handed Burnham a blank cheque", date: "2026-07-20", time: "17:23", url: "https://www.ft.com/content/c28acecc-7fa1-44ce-b343-c282cb23fe47" },
  { id: "2f0a9be3-cbeb-4bbe-b05a-3d61ddf81065", title: "David Austin’s empire of rose", date: "2026-07-20", time: "17:15", url: "https://www.ft.com/content/2f0a9be3-cbeb-4bbe-b05a-3d61ddf81065" },
  { id: "5ae43650-a99e-4175-a1e6-e0d63f3027d3", title: "Don’t blame colonialism for Africa’s trade woes", date: "2026-07-20", time: "17:10", url: "https://www.ft.com/content/5ae43650-a99e-4175-a1e6-e0d63f3027d3" },
  { id: "51089f41-6f8b-4381-aab5-a83bbe4048c4", title: "Keep fit French-style, quit smoking, eat Dua Lipa’s favourite crisps – and catch up with HTSI’s most popular reads", date: "2026-07-20", time: "17:03", url: "https://www.ft.com/content/51089f41-6f8b-4381-aab5-a83bbe4048c4" },
  { id: "522fc69e-77df-40fd-8ab4-6726b866d289", title: "US petrol prices climb back above $4 as Iran war intensifies", date: "2026-07-20", time: "16:22", url: "https://www.ft.com/content/522fc69e-77df-40fd-8ab4-6726b866d289" },
  { id: "348530f8-994f-49ce-ae77-3e5d520c7794", title: "The Middle East needs its own Helsinki Act", date: "2026-07-20", time: "15:43", url: "https://www.ft.com/content/348530f8-994f-49ce-ae77-3e5d520c7794" },
  { id: "db8130fc-e5b9-4da7-ad15-31d75376a856", title: "Andy Burnham’s first speech as PM: what he said and what he meant", date: "2026-07-20", time: "14:51", url: "https://www.ft.com/content/db8130fc-e5b9-4da7-ad15-31d75376a856" },
  { id: "97389cc7-7c83-496e-a2d2-72a1eb574281", title: "Yemen’s Houthi rebels threaten blockade against Saudi Arabia", date: "2026-07-20", time: "14:50", url: "https://www.ft.com/content/97389cc7-7c83-496e-a2d2-72a1eb574281" },
  { id: "c45ba698-6b6a-4880-8b36-d81fa61c3cee", title: "Why Mullin is struggling to keep ICE out of the headlines", date: "2026-07-20", time: "14:00", url: "https://www.ft.com/content/c45ba698-6b6a-4880-8b36-d81fa61c3cee" },
  { id: "1ab00e18-995a-4cda-b76b-00ba6c043863", title: "UK businesses are not deepening their use of AI, suggests ONS data", date: "2026-07-20", time: "13:51", url: "https://www.ft.com/content/1ab00e18-995a-4cda-b76b-00ba6c043863" },
  { id: "c31a7fec-d757-481a-a6d8-3d414803db4b", title: "How I got into Berghain, Berlin’s notoriously selective club", date: "2026-07-20", time: "13:44", url: "https://www.ft.com/content/c31a7fec-d757-481a-a6d8-3d414803db4b" },
  { id: "51dad580-487a-43d4-8427-cdd764cbe8f5", title: "Zelenskyy’s crisis deepens as ex-defence minister rejects offer to return", date: "2026-07-20", time: "13:37", url: "https://www.ft.com/content/51dad580-487a-43d4-8427-cdd764cbe8f5" },
];
