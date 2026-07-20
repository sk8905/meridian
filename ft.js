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
  { id: "7e8f44cb-946f-448d-96d5-4b7d6e193403", title: "The ‘decayed’ impact of Trump’s Truth Social bombs", date: "2026-07-20", time: "13:01", url: "https://www.ft.com/content/7e8f44cb-946f-448d-96d5-4b7d6e193403" },
  { id: "cf5268f5-6329-4570-bad0-8e697899997b", title: "Donald Trump orders the ceremonial changing of the tariff guard", date: "2026-07-20", time: "12:31", url: "https://www.ft.com/content/cf5268f5-6329-4570-bad0-8e697899997b" },
  { id: "cc727d6a-7f82-4359-a27f-f54c3bee8039", title: "Anduril launches helicopter strike drone", date: "2026-07-20", time: "12:30", url: "https://www.ft.com/content/cc727d6a-7f82-4359-a27f-f54c3bee8039" },
  { id: "59f83b04-3c5a-41f3-b0b6-9238dd4186b8", title: "Trump is slipping into an Iran quagmire", date: "2026-07-20", time: "12:17", url: "https://www.ft.com/content/59f83b04-3c5a-41f3-b0b6-9238dd4186b8" },
  { id: "1197682a-c72d-4ae2-a8f2-f0fd3f867439", title: "The Federal Reserve’s independence is still under threat, warns Rebecca Slaughter", date: "2026-07-20", time: "12:00", url: "https://www.ft.com/content/1197682a-c72d-4ae2-a8f2-f0fd3f867439" },
  { id: "c35c272c-cc64-4834-bb01-bcaa93ca7214", title: "Andy Burnham opens door to using ‘flexibility’ within fiscal rules", date: "2026-07-20", time: "11:25", url: "https://www.ft.com/content/c35c272c-cc64-4834-bb01-bcaa93ca7214" },
  { id: "18389d8a-340d-432d-9e5f-1fe7f5c54e56", title: "The World Cup half-time show — a Fifa fever dream that united the world in bafflement", date: "2026-07-20", time: "11:15", url: "https://www.ft.com/content/18389d8a-340d-432d-9e5f-1fe7f5c54e56" },
  { id: "13c385e7-600f-471a-858e-6f1970802a10", title: "EU fines AliExpress €550mn for failing to prevent sale of illegal goods", date: "2026-07-20", time: "11:00", url: "https://www.ft.com/content/13c385e7-600f-471a-858e-6f1970802a10" },
  { id: "dadcd609-1f27-405b-a7b6-348456abbcab", title: "Bad cabinet appointments will steal Andy Burnham's precious hours", date: "2026-07-20", time: "10:43", url: "https://www.ft.com/content/dadcd609-1f27-405b-a7b6-348456abbcab" },
  { id: "7b19969f-3c3c-4e45-9eb4-aac02519ad46", title: "India's 'Cockroach' protests mount on streets of Delhi", date: "2026-07-20", time: "09:49", url: "https://www.ft.com/content/7b19969f-3c3c-4e45-9eb4-aac02519ad46" },
  { id: "f1b94dc3-112a-424d-93ea-569f4869c259", title: "How the UK can be cleverer about stamp duty", date: "2026-07-20", time: "09:46", url: "https://www.ft.com/content/f1b94dc3-112a-424d-93ea-569f4869c259" },
  { id: "f567af77-801a-48b2-ba59-cf033f599701", title: "Lockheed to build cheaper Patriot missile to counter drone threat", date: "2026-07-20", time: "08:54", url: "https://www.ft.com/content/f567af77-801a-48b2-ba59-cf033f599701" },
  { id: "fc5b45df-9d69-400b-8ca2-949f827fad49", title: "Segro rejects £13.5bn bid by US rival Prologis in latest takeover twist", date: "2026-07-20", time: "08:36", url: "https://www.ft.com/content/fc5b45df-9d69-400b-8ca2-949f827fad49" },
  { id: "52e98fc4-32e3-4ed9-90fd-dcbba6188df5", title: "Oil back above $90 as Iran hits tankers", date: "2026-07-20", time: "08:11", url: "https://www.ft.com/content/52e98fc4-32e3-4ed9-90fd-dcbba6188df5" },
  { id: "e6e3acd7-81a2-471c-9be1-a7f7558d639b", title: "China’s ‘national team’ buys shares worth $9bn to prop up market", date: "2026-07-20", time: "07:54", url: "https://www.ft.com/content/e6e3acd7-81a2-471c-9be1-a7f7558d639b" },
  { id: "715da6d5-bd8a-4419-b45c-8cfb02d847be", title: "Samsung Biologics buys Swiss peptide maker for $1.8bn", date: "2026-07-20", time: "07:53", url: "https://www.ft.com/content/715da6d5-bd8a-4419-b45c-8cfb02d847be" },
  { id: "9523ead6-6599-4ed0-9b14-dfa70fd1b180", title: "Portfolio construction in the shadow of the AI bubble", date: "2026-07-20", time: "06:30", url: "https://www.ft.com/content/9523ead6-6599-4ed0-9b14-dfa70fd1b180" },
  { id: "7a1a9e9b-7919-4f3a-b84b-0cab584a04bb", title: "Paris and Berlin set year-end deadline for options to reform EU’s diplomatic arm", date: "2026-07-20", time: "06:00", url: "https://www.ft.com/content/7a1a9e9b-7919-4f3a-b84b-0cab584a04bb" },
];
