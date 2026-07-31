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
  { id: "fddc42a9-4c57-4689-abde-75bbe79622e9", title: "Amazon increases AI infrastructure spending to $220bn this year", date: "2026-07-31", time: "14:47", url: "https://www.ft.com/content/fddc42a9-4c57-4689-abde-75bbe79622e9" },
  { id: "570ecb5c-68de-4844-9e73-cf32463dbcac", title: "The twilight of Dr Fauci", date: "2026-07-31", time: "14:00", url: "https://www.ft.com/content/570ecb5c-68de-4844-9e73-cf32463dbcac" },
  { id: "c167fb1b-69c3-4df0-9126-1e0af678f924", title: "Markets are getting AI right", date: "2026-07-31", time: "14:00", url: "https://www.ft.com/content/c167fb1b-69c3-4df0-9126-1e0af678f924" },
  { id: "b7e53513-27fa-4b50-af17-b1308c587f11", title: "London residents lose legal challenge against Chinese ‘mega’ embassy", date: "2026-07-31", time: "13:54", url: "https://www.ft.com/content/b7e53513-27fa-4b50-af17-b1308c587f11" },
  { id: "0f47fc94-d039-4561-936e-55b5fc34541d", title: "US nuclear reactor company Westinghouse files for IPO", date: "2026-07-31", time: "13:27", url: "https://www.ft.com/content/0f47fc94-d039-4561-936e-55b5fc34541d" },
  { id: "a0a5e3a7-c4e6-42a6-9a7b-a780422bcd76", title: "Leopold Aschenbrenner vows to ‘fight another day’ after fund plunges 67% in July", date: "2026-07-31", time: "13:21", url: "https://www.ft.com/content/a0a5e3a7-c4e6-42a6-9a7b-a780422bcd76" },
  { id: "1023c8a4-fbb9-45ee-84ef-71b5fd48a1dd", title: "How Wall Street’s litigators finally became superstar lawyers", date: "2026-07-31", time: "13:17", url: "https://www.ft.com/content/1023c8a4-fbb9-45ee-84ef-71b5fd48a1dd" },
  { id: "395afe31-3c86-4911-af05-54ca5aa2d41b", title: "Fed dissenters warn of challenges in taming inflation", date: "2026-07-31", time: "13:00", url: "https://www.ft.com/content/395afe31-3c86-4911-af05-54ca5aa2d41b" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-07-31", time: "12:55", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
  { id: "75ba3055-625c-4cb5-894b-0696a38f5e79", title: "Latest Isa rates", date: "2026-07-31", time: "12:52", url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79" },
  { id: "a500489e-8185-4605-a3ab-010b3ec85a7b", title: "‘Total devastation’: Suffolk confronts aftermath of unprecedented wildfire", date: "2026-07-31", time: "12:45", url: "https://www.ft.com/content/a500489e-8185-4605-a3ab-010b3ec85a7b" },
  { id: "3a386a01-1276-4868-85e9-17d9dacf6986", title: "Israel’s far right urges Netanyahu to reject Trump’s Gaza plan", date: "2026-07-31", time: "12:38", url: "https://www.ft.com/content/3a386a01-1276-4868-85e9-17d9dacf6986" },
  { id: "8ed6b98d-b5d7-41e6-a210-5b75dc0bc4f2", title: "Bridgerton author Julia Quinn: ‘Sex scenes have to serve a purpose’", date: "2026-07-31", time: "12:30", url: "https://www.ft.com/content/8ed6b98d-b5d7-41e6-a210-5b75dc0bc4f2" },
  { id: "32951d1d-5402-406b-bfaf-a490bf1bff84", title: "Burnham’s policy bonanza", date: "2026-07-31", time: "12:19", url: "https://www.ft.com/content/32951d1d-5402-406b-bfaf-a490bf1bff84" },
  { id: "8dc8b79a-7cd1-489f-b5fd-77c317fc19a2", title: "The hottest pop-ups for summer 2026", date: "2026-07-31", time: "11:00", url: "https://www.ft.com/content/8dc8b79a-7cd1-489f-b5fd-77c317fc19a2" },
  { id: "57eca11a-5485-448d-b237-7aa8dd0d5769", title: "How can I TikTok like Andy Burnham?", date: "2026-07-31", time: "11:00", url: "https://www.ft.com/content/57eca11a-5485-448d-b237-7aa8dd0d5769" },
  { id: "67db9b64-ec26-442e-8356-6c4411eba66e", title: "Data centres vs housing: how London became a central battleground", date: "2026-07-31", time: "12:00", url: "https://www.ft.com/content/67db9b64-ec26-442e-8356-6c4411eba66e" },
  { id: "67e045bb-76cc-404f-a04c-073411eedfc5", title: "FirstFT: The fight for football's future", date: "2026-07-31", time: "11:50", url: "https://www.ft.com/content/67e045bb-76cc-404f-a04c-073411eedfc5" },
  { id: "0f9b2fe7-bde4-4f5f-b49e-93ccb5da9ea8", title: "Bank of Japan governor vows not to ‘fall behind the curve’", date: "2026-07-31", time: "11:47", url: "https://www.ft.com/content/0f9b2fe7-bde4-4f5f-b49e-93ccb5da9ea8" },
  { id: "7e0e8281-4f14-4d6f-98c1-ea21b8c0543e", title: "Universal Music shares plunge by a quarter on streaming growth fears", date: "2026-07-31", time: "11:40", url: "https://www.ft.com/content/7e0e8281-4f14-4d6f-98c1-ea21b8c0543e" },
  { id: "a417eb44-bffe-4584-b14e-570e76d3fb23", title: "Chevron and Exxon earnings soar as Trump threatens price interventions", date: "2026-07-31", time: "11:30", url: "https://www.ft.com/content/a417eb44-bffe-4584-b14e-570e76d3fb23" },
  { id: "4ee1e8b0-3d48-44b6-8d9a-e71ce5b458bf", title: "Rising Eurozone inflation keeps rate rise on the table", date: "2026-07-31", time: "11:13", url: "https://www.ft.com/content/4ee1e8b0-3d48-44b6-8d9a-e71ce5b458bf" },
  { id: "4b90b384-47d7-40ff-8b0d-7a33420ea29f", title: "Ares secures biggest flagship credit fund commitments in three years", date: "2026-07-31", time: "11:03", url: "https://www.ft.com/content/4b90b384-47d7-40ff-8b0d-7a33420ea29f" },
  { id: "babf4c89-1a6f-447f-a17e-7e3e48f359b8", title: "Coal back in favour as US plant bidding war highlights rising demand to power AI", date: "2026-07-31", time: "11:00", url: "https://www.ft.com/content/babf4c89-1a6f-447f-a17e-7e3e48f359b8" },
  { id: "34917d6f-c8ec-4e13-890a-4d8475806bb7", title: "Spain says 49,000 migrants entered Ceuta enclave in one day", date: "2026-07-31", time: "10:59", url: "https://www.ft.com/content/34917d6f-c8ec-4e13-890a-4d8475806bb7" },
  { id: "3fa19368-0cb3-4802-8651-aca61c3f9fba", title: "FTAV’s Friday charts quiz", date: "2026-07-31", time: "10:30", url: "https://www.ft.com/content/3fa19368-0cb3-4802-8651-aca61c3f9fba" },
  { id: "cb149846-6032-4883-8695-685e4e8dd886", title: "Bank of Japan holds rates with hawkish guidance", date: "2026-07-31", time: "10:28", url: "https://www.ft.com/content/cb149846-6032-4883-8695-685e4e8dd886" },
  { id: "f1fecefc-7de6-40e3-9bc9-a58d5b653386", title: "Taylor Wimpey cuts shareholder returns as weak housing market squeezes builders", date: "2026-07-31", time: "10:13", url: "https://www.ft.com/content/f1fecefc-7de6-40e3-9bc9-a58d5b653386" },
  { id: "f54e632e-f8b4-4554-9f2e-c8a2ded0555b", title: "Eurozone inflation rises to 2.9% in July", date: "2026-07-31", time: "10:01", url: "https://www.ft.com/content/f54e632e-f8b4-4554-9f2e-c8a2ded0555b" },
  { id: "26da67f5-e630-4552-b327-f01d45b6c7c5", title: "Mayoral scrutiny is a pressing issue", date: "2026-07-31", time: "09:30", url: "https://www.ft.com/content/26da67f5-e630-4552-b327-f01d45b6c7c5" },
  { id: "160a686b-6573-4192-9281-7cf28912f1ed", title: "Andy Burnham to give English mayors share of income tax from 2028", date: "2026-07-31", time: "08:44", url: "https://www.ft.com/content/160a686b-6573-4192-9281-7cf28912f1ed" },
  { id: "613cd8b0-e8c5-45d2-a7f3-184e63d82e08", title: "Fifa opens door to amending controversial stake sale plan", date: "2026-07-31", time: "08:21", url: "https://www.ft.com/content/613cd8b0-e8c5-45d2-a7f3-184e63d82e08" },
  { id: "23eb1fd4-8301-4c0e-89b3-2647389e6226", title: "South Korean stock market soars 18% as investors pile back into AI", date: "2026-07-31", time: "08:10", url: "https://www.ft.com/content/23eb1fd4-8301-4c0e-89b3-2647389e6226" },
  { id: "5f3930b9-e7ce-4b87-878f-74cf7f16f642", title: "The dark arts of securitisation", date: "2026-07-31", time: "08:09", url: "https://www.ft.com/content/5f3930b9-e7ce-4b87-878f-74cf7f16f642" },
  { id: "77847a1c-de27-4bab-b7dc-3dd57e3d3e4d", title: "NatWest profits buoyed by retail and wealth units", date: "2026-07-31", time: "08:05", url: "https://www.ft.com/content/77847a1c-de27-4bab-b7dc-3dd57e3d3e4d" },
  { id: "e874feaf-38de-479d-937b-05daa5a021a9", title: "Sainsbury’s strikes deal to sell Argos for £120mn to Swift Partners", date: "2026-07-31", time: "07:47", url: "https://www.ft.com/content/e874feaf-38de-479d-937b-05daa5a021a9" },
  { id: "c14b255c-cdda-4ba8-8139-f10e862a4235", title: "British Airways owner IAG ditches growth plans amid Iran conflict", date: "2026-07-31", time: "07:36", url: "https://www.ft.com/content/c14b255c-cdda-4ba8-8139-f10e862a4235" },
  { id: "e4cec5e1-a4e9-449b-a411-da1c025af2e8", title: "Donald Trump says Hamas has agreed to disarm over time", date: "2026-07-31", time: "07:13", url: "https://www.ft.com/content/e4cec5e1-a4e9-449b-a411-da1c025af2e8" },
  { id: "420ea1bc-6f85-4065-ad76-61e685aa1de2", title: "BP puts its UK North Sea business up for sale", date: "2026-07-31", time: "07:11", url: "https://www.ft.com/content/420ea1bc-6f85-4065-ad76-61e685aa1de2" },
  { id: "b1267def-3590-4482-9833-d09f0b1230b8", title: "What Warsh is (probably) up to", date: "2026-07-31", time: "06:30", url: "https://www.ft.com/content/b1267def-3590-4482-9833-d09f0b1230b8" },
];
