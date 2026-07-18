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
  { id: "047f943b-e46b-455e-8f8e-bef1b9c97708", title: "Britain’s system for avoiding electricity blackouts faces scrutiny", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/047f943b-e46b-455e-8f8e-bef1b9c97708" },
  { id: "0ac9aa5c-2807-49fc-9d7d-679b27cf3337", title: "The London IPO market isn’t as bad as it looks", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/0ac9aa5c-2807-49fc-9d7d-679b27cf3337" },
  { id: "2dc8d54c-89b7-4e57-bd43-084d9edf01a4", title: "Asia AI bets power record equities run for Wall Street banks", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/2dc8d54c-89b7-4e57-bd43-084d9edf01a4" },
  { id: "93db3195-9a17-4798-810a-0509f3ab35a3", title: "Superdrug owner considers delay to planned London IPO", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/93db3195-9a17-4798-810a-0509f3ab35a3" },
  { id: "e34cbb4d-1c40-4e71-9ef2-31b44331d642", title: "Data errors mar UK regulator’s new short selling disclosure rules", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/e34cbb4d-1c40-4e71-9ef2-31b44331d642" },
  { id: "fcbd9074-8870-4f04-b0a6-0c22a2aca70e", title: "How long until there is a US markets reckoning over Trump’s damage?", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/fcbd9074-8870-4f04-b0a6-0c22a2aca70e" },
  { id: "b4bc3868-7684-4b36-a0e0-a5bf2b606162", title: "Ageism: the silent but deadly threat to your retirement", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/b4bc3868-7684-4b36-a0e0-a5bf2b606162" },
  { id: "8c910a8f-2b8b-4234-918a-2022bdc01889", title: "How to fix the housing crisis", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/8c910a8f-2b8b-4234-918a-2022bdc01889" },
  { id: "580f2b36-1d00-40b8-a12a-cc7d7067a046", title: "Washington pushes EU to announce import rules rollback", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/580f2b36-1d00-40b8-a12a-cc7d7067a046" },
  { id: "de2978b0-481c-4af5-9e77-9e34650fb20f", title: "The next crash: why this time might not be different", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/de2978b0-481c-4af5-9e77-9e34650fb20f" },
  { id: "fa4e24db-9324-47e2-8512-a581ca9c1aba", title: "Donald Trump threatens Canada with tariffs over ‘invasion’ of wildfire smoke", date: "2026-07-17", time: "21:56", url: "https://www.ft.com/content/fa4e24db-9324-47e2-8512-a581ca9c1aba" },
  { id: "e466df85-fa3b-4a7f-a4a1-ae04d66db99f", title: "Trump Media pitched $100,000 monthly fee for fast feed of president’s posts", date: "2026-07-17", time: "21:24", url: "https://www.ft.com/content/e466df85-fa3b-4a7f-a4a1-ae04d66db99f" },
  { id: "79a15abd-5892-4f1c-b038-b09a1ceecabb", title: "US chip stocks notch up worst week in more than a year", date: "2026-07-17", time: "21:22", url: "https://www.ft.com/content/79a15abd-5892-4f1c-b038-b09a1ceecabb" },
  { id: "9586223a-8339-4a57-9e2f-251899ebd211", title: "Apple briefly leapfrogs Nvidia as world’s most valuable company", date: "2026-07-17", time: "21:17", url: "https://www.ft.com/content/9586223a-8339-4a57-9e2f-251899ebd211" },
  { id: "1a3e03b0-bd7a-41de-bf3f-92ed5c723773", title: "The Burnham era begins: Mahmood set for chancellor", date: "2026-07-17", time: "20:03", url: "https://www.ft.com/content/1a3e03b0-bd7a-41de-bf3f-92ed5c723773" },
  { id: "9d2b5d8f-fbf8-454d-8603-2f1313c2b29c", title: "Moneysupermarket to launch investment platform", date: "2026-07-17", time: "20:01", url: "https://www.ft.com/content/9d2b5d8f-fbf8-454d-8603-2f1313c2b29c" },
  { id: "0ae58f76-3386-464a-9248-090cc68e9864", title: "Meta and Anthropic in talks for up to $10bn data centre deal", date: "2026-07-17", time: "19:32", url: "https://www.ft.com/content/0ae58f76-3386-464a-9248-090cc68e9864" },
  { id: "55f5860b-6ef0-42ed-a87f-c49af6ef9d29", title: "How long can oil markets absorb the Hormuz shock?", date: "2026-07-17", time: "18:52", url: "https://www.ft.com/content/55f5860b-6ef0-42ed-a87f-c49af6ef9d29" },
  { id: "e8f185db-9b5c-4d0c-8e5e-e130483f151d", title: "Paris and Berlin vow to align on tougher trade measures against China", date: "2026-07-17", time: "18:14", url: "https://www.ft.com/content/e8f185db-9b5c-4d0c-8e5e-e130483f151d" },
  { id: "662e7dd6-5fda-4fad-a6e8-cf69ee97cd96", title: "Directors’ Deals: Middle East conflict casts shadow over Energean", date: "2026-07-17", time: "18:00", url: "https://www.ft.com/content/662e7dd6-5fda-4fad-a6e8-cf69ee97cd96" },
  { id: "ce345155-d897-4f49-b7c8-13680e3b5434", title: "SpaceX and the myth of independent Wall St research", date: "2026-07-17", time: "18:00", url: "https://www.ft.com/content/ce345155-d897-4f49-b7c8-13680e3b5434" },
  { id: "8440f76e-2e20-4102-895f-c9387f20d22d", title: "Stockpickers: Celebrus Technologies, Cohort, ME Group", date: "2026-07-17", time: "18:00", url: "https://www.ft.com/content/8440f76e-2e20-4102-895f-c9387f20d22d" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-07-17", time: "17:01", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
];
