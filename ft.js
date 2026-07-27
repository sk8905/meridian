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
  { id: "403625cc-8371-43ee-997a-f6908a97f52e", title: "Oil tumbles as Iran and US pause strikes over Strait of Hormuz", date: "2026-07-27", time: "18:24", url: "https://www.ft.com/content/403625cc-8371-43ee-997a-f6908a97f52e" },
  { id: "9f446812-5dc9-4d25-9a4b-ac5162e62d81", title: "Ares Management has held talks to buy Leonard Green & Partners", date: "2026-07-27", time: "18:23", url: "https://www.ft.com/content/9f446812-5dc9-4d25-9a4b-ac5162e62d81" },
  { id: "5c78dec1-b6d6-415e-9456-f1ab5eed6146", title: "Nvidia bets $5bn on Ilya Sutskever’s AI breakthrough", date: "2026-07-27", time: "18:20", url: "https://www.ft.com/content/5c78dec1-b6d6-415e-9456-f1ab5eed6146" },
  { id: "426d49ae-1d07-45f4-b784-e65756a4f5ac", title: "Donald Trump rebuilds his tariff wall", date: "2026-07-27", time: "17:57", url: "https://www.ft.com/content/426d49ae-1d07-45f4-b784-e65756a4f5ac" },
  { id: "858c912e-1ea6-4c06-8929-dce7fe805622", title: "Canary Wharf holds lessons for Andy Burnham", date: "2026-07-27", time: "17:14", url: "https://www.ft.com/content/858c912e-1ea6-4c06-8929-dce7fe805622" },
  { id: "45867580-65a2-4a7d-ba4c-8143e86f4e36", title: "France and Spain brace for more extreme heat as wildfires rage", date: "2026-07-27", time: "17:11", url: "https://www.ft.com/content/45867580-65a2-4a7d-ba4c-8143e86f4e36" },
  { id: "47ef8550-034e-464f-8e49-64c3e4de827f", title: "Jodrell Bank observatory set to lose scientific funding", date: "2026-07-27", time: "17:09", url: "https://www.ft.com/content/47ef8550-034e-464f-8e49-64c3e4de827f" },
  { id: "83e93ce0-1ebd-4b04-a70c-82ff7b64a5f4", title: "Amazon targets Musk’s Starlink with satellite constellation for mobile services", date: "2026-07-27", time: "16:57", url: "https://www.ft.com/content/83e93ce0-1ebd-4b04-a70c-82ff7b64a5f4" },
  { id: "8829bb6c-e4e4-4064-960a-8f789da10a41", title: "Andy Burnham rejects northern Labour MPs’ call to abolish council tax", date: "2026-07-27", time: "16:40", url: "https://www.ft.com/content/8829bb6c-e4e4-4064-960a-8f789da10a41" },
  { id: "9f9662cb-06ba-42a4-b2f2-800a60818de1", title: "Burnham and the problem of politics by social media", date: "2026-07-27", time: "16:28", url: "https://www.ft.com/content/9f9662cb-06ba-42a4-b2f2-800a60818de1" },
  { id: "46627195-3b21-4e29-8026-9a8b30365815", title: "Andrew Tate’s extradition challenge could last almost a year, lawyers say", date: "2026-07-27", time: "15:47", url: "https://www.ft.com/content/46627195-3b21-4e29-8026-9a8b30365815" },
  { id: "eef867f1-f03e-460a-a29f-7dd76c7c5d0b", title: "What doughnuts can tell us about the AI boom", date: "2026-07-27", time: "15:00", url: "https://www.ft.com/content/eef867f1-f03e-460a-a29f-7dd76c7c5d0b" },
  { id: "b302894c-ee9f-4081-96ff-735e5836d5d1", title: "Germany’s Friedrich Merz sacks transport minister in turbulent cabinet shake-up", date: "2026-07-27", time: "14:44", url: "https://www.ft.com/content/b302894c-ee9f-4081-96ff-735e5836d5d1" },
  { id: "06c0ded7-8a5c-4429-955d-50df7e0c2438", title: "Size matters when it comes to tariff threats", date: "2026-07-27", time: "14:00", url: "https://www.ft.com/content/06c0ded7-8a5c-4429-955d-50df7e0c2438" },
  { id: "5fafe208-c728-42d1-99f5-2e0ff188e170", title: "US courts diverge on latest front in debt brawls", date: "2026-07-27", time: "13:58", url: "https://www.ft.com/content/5fafe208-c728-42d1-99f5-2e0ff188e170" },
  { id: "5374bf31-0d6d-4ebd-a4ae-28b399f39cc3", title: "Andy Burnham looks to cut welfare bill by linking up schools and employers", date: "2026-07-27", time: "13:10", url: "https://www.ft.com/content/5374bf31-0d6d-4ebd-a4ae-28b399f39cc3" },
  { id: "7c534c2f-07f0-4148-ab59-69f84e1dbfcb", title: "Italy’s search for national football coach stumbles over Russia links", date: "2026-07-27", time: "12:59", url: "https://www.ft.com/content/7c534c2f-07f0-4148-ab59-69f84e1dbfcb" },
  { id: "7c4d9335-6ead-4231-8e74-a55c82a7734c", title: "Fifa’s Gianni Infantino lashes out at World Cup critics ‘consumed by hate’", date: "2026-07-27", time: "12:47", url: "https://www.ft.com/content/7c4d9335-6ead-4231-8e74-a55c82a7734c" },
  { id: "0e84911a-f4a1-4a9d-9bd2-b4bc07e72921", title: "Brexit ‘reset’ could constrain UK’s freedom of movement on trade", date: "2026-07-27", time: "12:31", url: "https://www.ft.com/content/0e84911a-f4a1-4a9d-9bd2-b4bc07e72921" },
  { id: "c6c745fc-58d6-4a31-9410-ce4e8f5bcfcf", title: "Gatwick airport apologises after water shortage hits toilets", date: "2026-07-26", time: "20:29", url: "https://www.ft.com/content/c6c745fc-58d6-4a31-9410-ce4e8f5bcfcf" },
  { id: "f91661b4-5d1d-4da0-b00d-88c1bc4fe5b0", title: "The Exploration Company with SpaceX ambitions aiming for a $2bn valuation", date: "2026-07-26", time: "17:50", url: "https://www.ft.com/content/f91661b4-5d1d-4da0-b00d-88c1bc4fe5b0" },
  { id: "b2b45aca-6298-4c39-a763-bd42081cc98b", title: "Reform UK’s bank account was frozen during 2024 election", date: "2026-07-26", time: "13:28", url: "https://www.ft.com/content/b2b45aca-6298-4c39-a763-bd42081cc98b" },
  { id: "4f88ed2b-41de-4d8e-930f-92b8261f49c2", title: "Gibraltar should show Burnham a softer Brexit is the only option", date: "2026-07-26", time: "13:00", url: "https://www.ft.com/content/4f88ed2b-41de-4d8e-930f-92b8261f49c2" },
  { id: "9741206d-b53f-4149-8cab-5203dd4b70fb", title: "Why wages and productivity look set to diverge further", date: "2026-07-26", time: "12:00", url: "https://www.ft.com/content/9741206d-b53f-4149-8cab-5203dd4b70fb" },
  { id: "4b67aefb-f61a-4d0e-941c-bf93d625f5ca", title: "Will the Fed raise interest rates at Kevin Warsh’s second meeting?", date: "2026-07-26", time: "12:00", url: "https://www.ft.com/content/4b67aefb-f61a-4d0e-941c-bf93d625f5ca" },
  { id: "ffdeacf0-91b8-48fd-9ff8-d8d134ef5f11", title: "US pauses Iran strikes as Oman pursues Hormuz transit deal", date: "2026-07-26", time: "11:58", url: "https://www.ft.com/content/ffdeacf0-91b8-48fd-9ff8-d8d134ef5f11" },
  { id: "722d308d-d2d6-4390-976e-0a2e6f124d80", title: "Trump’s systematic assault on science", date: "2026-07-26", time: "11:51", url: "https://www.ft.com/content/722d308d-d2d6-4390-976e-0a2e6f124d80" },
  { id: "71bbe9fd-e1cb-4e28-8edb-f319032139c4", title: "India’s Gen Z protesters puncture Narendra Modi’s aura of invincibility", date: "2026-07-26", time: "11:43", url: "https://www.ft.com/content/71bbe9fd-e1cb-4e28-8edb-f319032139c4" },
  { id: "81bf2169-46e9-42a5-bd8b-462891343fd2", title: "Saint-Gobain pushes ahead with US expansion despite slow housing market", date: "2026-07-26", time: "11:00", url: "https://www.ft.com/content/81bf2169-46e9-42a5-bd8b-462891343fd2" },
  { id: "1215a488-9ef6-4538-a190-5c5bfbf10c0d", title: "US economic anxieties on display in battle over digital store labels", date: "2026-07-26", time: "11:00", url: "https://www.ft.com/content/1215a488-9ef6-4538-a190-5c5bfbf10c0d" },
  { id: "083aa3f4-04c8-48d1-905f-11ccee299ca4", title: "Carlyle and Bain Capital battle to buy wealth manager in potential $7bn deal", date: "2026-07-26", time: "11:00", url: "https://www.ft.com/content/083aa3f4-04c8-48d1-905f-11ccee299ca4" },
  { id: "cb14773b-8c05-4434-983f-a10292db8967", title: "Andy Burnham ‘rules out’ early election", date: "2026-07-26", time: "10:44", url: "https://www.ft.com/content/cb14773b-8c05-4434-983f-a10292db8967" },
  { id: "6bd2290f-209d-4b30-9fac-dcfcd32bfb5d", title: "One dead and 16 injured after van drives into Berlin Pride crowd", date: "2026-07-26", time: "08:05", url: "https://www.ft.com/content/6bd2290f-209d-4b30-9fac-dcfcd32bfb5d" },
  { id: "af333b9c-d59d-4e7c-b814-12cef578895d", title: "Investors use crypto exchanges to avoid Beijing’s controls on AI stocks", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/af333b9c-d59d-4e7c-b814-12cef578895d" },
  { id: "cd0b6148-a9a7-4763-b6d3-bb33e10b9899", title: "Deadly storm in Chile disrupts copper mines and raises AI supply concerns", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/cd0b6148-a9a7-4763-b6d3-bb33e10b9899" },
  { id: "fcb2bd34-b13f-4f4f-950d-92367d43d1f3", title: "Defence giants provide record backing for military start-ups", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/fcb2bd34-b13f-4f4f-950d-92367d43d1f3" },
  { id: "5b789a38-c9ca-4b23-8e61-8f9e2e589396", title: "Chips and drones to be at heart of Andy Burnham’s push to ‘reindustrialise’, AI minister says", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/5b789a38-c9ca-4b23-8e61-8f9e2e589396" },
  { id: "fc7ac23f-5a0b-4114-9f6c-8089fb20ce9f", title: "The British state school that is the first to open an overseas branch", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/fc7ac23f-5a0b-4114-9f6c-8089fb20ce9f" },
  { id: "ad635fef-8785-47be-b264-e74582413ed6", title: "Maga’s creepy baby obsession won’t solve the fertility crisis", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/ad635fef-8785-47be-b264-e74582413ed6" },
  { id: "2ddef625-df80-4690-9475-f3ce86171593", title: "Why workers are nostalgic for life before AI", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/2ddef625-df80-4690-9475-f3ce86171593" },

];
