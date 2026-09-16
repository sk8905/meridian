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
  { id: "d29a4116-0511-4a85-b005-b1b4b110cdcd", title: "The British right’s patriotism problem", date: "2026-09-16", time: "13:18", url: "https://www.ft.com/content/d29a4116-0511-4a85-b005-b1b4b110cdcd" },
  { id: "d085adc5-977b-4c7e-9641-9824d1d345d3", title: "AI bosses’ safety push sparks rift inside OpenAI and Anthropic", date: "2026-09-16", time: "13:00", url: "https://www.ft.com/content/d085adc5-977b-4c7e-9641-9824d1d345d3" },
  { id: "31f41c2e-084b-4bdf-a548-bf3d1139dbbe", title: "Hormuz crisis threatens to undermine long-term LNG demand", date: "2026-09-16", time: "12:00", url: "https://www.ft.com/content/31f41c2e-084b-4bdf-a548-bf3d1139dbbe" },
  { id: "7727d99d-dce5-48e9-aebd-7d09ab3aa608", title: "The Extended Farageverse is coming together", date: "2026-09-16", time: "11:31", url: "https://www.ft.com/content/7727d99d-dce5-48e9-aebd-7d09ab3aa608" },
  { id: "96ea6daf-086f-49ff-bbe3-c42cf63561ec", title: "FirstFT: US mega-donors overwhelmingly back Republicans, FT analysis shows", date: "2026-09-16", time: "11:28", url: "https://www.ft.com/content/96ea6daf-086f-49ff-bbe3-c42cf63561ec" },
  { id: "1655b0eb-5f54-4ad0-afbb-cf9ffb09bc32", title: "Andy Burnham considers plan to give mayors greater oversight of water companies", date: "2026-09-16", time: "11:24", url: "https://www.ft.com/content/1655b0eb-5f54-4ad0-afbb-cf9ffb09bc32" },
  { id: "bad109a9-1a34-4663-9dd8-e757b3f38c62", title: "Scientists test new (and old) navigation systems to end GPS dependence", date: "2026-09-16", time: "11:00", url: "https://www.ft.com/content/bad109a9-1a34-4663-9dd8-e757b3f38c62" },
  { id: "c9f54d41-6617-480b-82ca-d5ffcb11669d", title: "What are the risks of using AI to draft my will?", date: "2026-09-16", time: "10:49", url: "https://www.ft.com/content/c9f54d41-6617-480b-82ca-d5ffcb11669d" },
  { id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2", title: "Inflation and interest rates tracker: see how your country compares", date: "2026-09-16", time: "10:26", url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2" },
  { id: "2262cdb5-aaab-4a24-8017-a16f154dc3d7", title: "Scrapping triple lock on pensions need not wreak political damage", date: "2026-09-16", time: "09:30", url: "https://www.ft.com/content/2262cdb5-aaab-4a24-8017-a16f154dc3d7" },
  { id: "410db291-f133-4d72-b883-b2d5a32abbf8", title: "EU to restrict social media and chatbots for children under 15", date: "2026-09-16", time: "09:27", url: "https://www.ft.com/content/410db291-f133-4d72-b883-b2d5a32abbf8" },
  { id: "bb2c178f-08e8-4de2-af49-6c184217cfb3", title: "PwC revenues fall for first time in more than a decade", date: "2026-09-16", time: "09:01", url: "https://www.ft.com/content/bb2c178f-08e8-4de2-af49-6c184217cfb3" },
  { id: "26f03609-1d41-4556-aaa3-d32a880ce1bd", title: "McLaren to compete against Lamborghini and Ferrari with hybrid SUVs", date: "2026-09-16", time: "09:00", url: "https://www.ft.com/content/26f03609-1d41-4556-aaa3-d32a880ce1bd" },
  { id: "8fed428e-7bcc-435c-9487-cb4e6a795328", title: "Ursula von der Leyen backs Canada’s ‘associate membership’ bid", date: "2026-09-16", time: "08:55", url: "https://www.ft.com/content/8fed428e-7bcc-435c-9487-cb4e6a795328" },
  { id: "97496b98-c749-4fde-88be-4ac95030a8c8", title: "Road fuels push UK inflation higher in August", date: "2026-09-16", time: "08:19", url: "https://www.ft.com/content/97496b98-c749-4fde-88be-4ac95030a8c8" },
  { id: "a491245d-6f6a-4218-9289-3fa8e43632ad", title: "Submit a question: What do British businesses need from the Budget?", date: "2026-09-16", time: "07:29", url: "https://www.ft.com/content/a491245d-6f6a-4218-9289-3fa8e43632ad" },
  { id: "f082ea1d-112a-4278-aa4a-8783a9077755", title: "Freewheeling Hong Kong takes cue from China with first five-year plan", date: "2026-09-16", time: "07:13", url: "https://www.ft.com/content/f082ea1d-112a-4278-aa4a-8783a9077755" },
  { id: "57c085c9-741e-4202-8be7-812ea7bd6d19", title: "UK inflation rose to 3.1% in August", date: "2026-09-16", time: "07:01", url: "https://www.ft.com/content/57c085c9-741e-4202-8be7-812ea7bd6d19" },
  { id: "033b21e7-b5d5-4511-ae01-53edaa4e051e", title: "AI debt vs Treasuries", date: "2026-09-16", time: "06:30", url: "https://www.ft.com/content/033b21e7-b5d5-4511-ae01-53edaa4e051e" },
  { id: "85f684e6-15df-4015-a626-73a5e2f2b438", title: "FTAV’s further reading", date: "2026-09-16", time: "06:30", url: "https://www.ft.com/content/85f684e6-15df-4015-a626-73a5e2f2b438" },
  { id: "1f78b692-4389-49a1-bd48-903252cc282f", title: "Von der Leyen to paint EU as the only port in a global geopolitical storm", date: "2026-09-16", time: "06:00", url: "https://www.ft.com/content/1f78b692-4389-49a1-bd48-903252cc282f" },
  { id: "3401a104-598d-4145-a03b-8bb08b2d7165", title: "The BoE’s three balance sheet problem", date: "2026-09-16", time: "06:00", url: "https://www.ft.com/content/3401a104-598d-4145-a03b-8bb08b2d7165" },
  { id: "6b6a27bd-2725-4591-be8a-fda643c2ac5c", title: "World’s best-performing sovereign wealth fund expects equities pullback", date: "2026-09-16", time: "05:55", url: "https://www.ft.com/content/6b6a27bd-2725-4591-be8a-fda643c2ac5c" },
  { id: "96ea6daf-086f-49ff-bbe3-c42cf63561ec", title: "FirstFT: EU rebuffs ‘unique alliance’ with Canada", date: "2026-09-16", time: "05:30", url: "https://www.ft.com/content/96ea6daf-086f-49ff-bbe3-c42cf63561ec" },
  { id: "ef511d46-a689-4868-9654-15b96a71586d", title: "The precarious fusion boom", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/ef511d46-a689-4868-9654-15b96a71586d" },
  { id: "69a2a7a0-ecd2-4d05-915c-55a6352889ff", title: "Sullivan & Cromwell discovers private equity", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/69a2a7a0-ecd2-4d05-915c-55a6352889ff" },
  { id: "9dd894cd-dddd-4388-ac00-dbd14d40dc52", title: "With AI, ‘I told you so’ will be too late", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/9dd894cd-dddd-4388-ac00-dbd14d40dc52" },
  { id: "2e2e0c1e-51d6-49e2-9f4a-6ef793908b85", title: "EU rebuffs Mark Carney’s ‘unique alliance’ with Canada", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/2e2e0c1e-51d6-49e2-9f4a-6ef793908b85" },
  { id: "f62e467a-bcb6-423d-96f2-b2b1e08faaa8", title: "Fed should defy Donald Trump with rate rise, top economists say", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/f62e467a-bcb6-423d-96f2-b2b1e08faaa8" },
  { id: "3c38362f-70c3-4275-bcfd-bea41a2bf473", title: "UK looks to ‘land drones’ to transform beleaguered Ajax fighting vehicles", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/3c38362f-70c3-4275-bcfd-bea41a2bf473" },
  { id: "90fd247a-69a0-4066-aa9d-f51a3e659434", title: "Crispin Odey judgment is lesson for firms with ‘slapdash’ ethics, warns FCA", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/90fd247a-69a0-4066-aa9d-f51a3e659434" },
  { id: "786b8ce5-3a11-4e34-b811-41ec165f5916", title: "Ørsted boss says Europe must act on ‘unfair’ Chinese wind turbine makers", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/786b8ce5-3a11-4e34-b811-41ec165f5916" },
  { id: "05dc65e9-0a60-4914-a39f-cf3cc2139513", title: "UK chancellor considering Budget tax raid on higher stake slot machines", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/05dc65e9-0a60-4914-a39f-cf3cc2139513" },
  { id: "4d69377c-a2b6-4c20-a485-3dbbafc6daa3", title: "AI can forecast the future. Should we let it?", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/4d69377c-a2b6-4c20-a485-3dbbafc6daa3" },
  { id: "3a216d29-6ed0-46a2-9835-2d9b427b7e88", title: "‘Buy British’ military procurement is a poor way to defend the realm", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/3a216d29-6ed0-46a2-9835-2d9b427b7e88" },
  { id: "9e7aa9ce-6c02-49fc-9224-62fb5767f1b1", title: "A hotter planet meets dearer money", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/9e7aa9ce-6c02-49fc-9224-62fb5767f1b1" },
  { id: "0aa2e6af-195d-40cc-a813-3e130cbb5553", title: "In Germany’s east, old ties to Moscow fuel AfD rise", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/0aa2e6af-195d-40cc-a813-3e130cbb5553" },
  { id: "2285c111-b103-4b04-96c7-fe26a3c04c3e", title: "US billionaires line up to bankroll Republicans’ election push", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/2285c111-b103-4b04-96c7-fe26a3c04c3e" },
  { id: "a4d98da2-12e2-4c6a-a60c-46aaeb69ff2a", title: "A top London lawyer wants to create ‘the California of Europe’ in the Algarve", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/a4d98da2-12e2-4c6a-a60c-46aaeb69ff2a" },
  { id: "c11fd1dd-8783-4894-9f53-109d7edf376f", title: "How Switzerland turned tax competition into a national sport", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/c11fd1dd-8783-4894-9f53-109d7edf376f" },
  { id: "2e3ad452-cd81-4df0-8eec-09112033ea37", title: "The unravelling of Missoni", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/2e3ad452-cd81-4df0-8eec-09112033ea37" },
  { id: "6ec74be5-9e4c-49c0-a9dc-d3a0ae324a17", title: "Hedge fund warned ousted lawyer to settle £36bn BHP dam collapse claim", date: "2026-09-16", time: "05:00", url: "https://www.ft.com/content/6ec74be5-9e4c-49c0-a9dc-d3a0ae324a17" },
];
