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
  { id: "7c487af9-53a2-4088-bf14-1f2deb4247e9", title: "How 60,000 people swam to Spanish territory", date: "2026-07-31", time: "21:02", url: "https://www.ft.com/content/7c487af9-53a2-4088-bf14-1f2deb4247e9" },
  { id: "664f7b45-d92a-44c4-9824-9008001e887e", title: "KKR nears deal to buy medical device maker Integer for more than $4bn", date: "2026-07-31", time: "20:12", url: "https://www.ft.com/content/664f7b45-d92a-44c4-9824-9008001e887e" },
  { id: "15de7725-ff09-4b17-bd88-42117a3404d1", title: "Is Kevin Warsh the Lionel Messi of monetary policy?", date: "2026-07-31", time: "18:22", url: "https://www.ft.com/content/15de7725-ff09-4b17-bd88-42117a3404d1" },
  { id: "97fd8d2a-3959-4dd6-8fbf-1e443ab793d3", title: "Warsh goes blank", date: "2026-07-31", time: "18:01", url: "https://www.ft.com/content/97fd8d2a-3959-4dd6-8fbf-1e443ab793d3" },
  { id: "5a74e0e6-fa68-4298-884a-4b738185911b", title: "Directors’ Deals: M&S directors cash out as shares climb", date: "2026-07-31", time: "18:00", url: "https://www.ft.com/content/5a74e0e6-fa68-4298-884a-4b738185911b" },
  { id: "fbc0d4bd-d754-4590-984d-ba21c0f1325b", title: "Stockpickers: Restore, Rio Tinto, Unite Group", date: "2026-07-31", time: "18:00", url: "https://www.ft.com/content/fbc0d4bd-d754-4590-984d-ba21c0f1325b" },
  { id: "c5d2f736-d640-4ae6-99e2-c4d2cae1e2ab", title: "Europe’s long hot summer", date: "2026-07-31", time: "17:35", url: "https://www.ft.com/content/c5d2f736-d640-4ae6-99e2-c4d2cae1e2ab" },
  { id: "f02ce02b-fa33-49ad-b8c7-81ab5cec3de0", title: "NXP in talks to buy $3.3bn designer of camera chips for self-driving cars", date: "2026-07-31", time: "17:32", url: "https://www.ft.com/content/f02ce02b-fa33-49ad-b8c7-81ab5cec3de0" },
  { id: "0b7081c3-2654-471c-b1b9-87c6f6369fb0", title: "The week that shook football", date: "2026-07-31", time: "17:30", url: "https://www.ft.com/content/0b7081c3-2654-471c-b1b9-87c6f6369fb0" },
  { id: "f54e632e-f8b4-4554-9f2e-c8a2ded0555b", title: "Eurozone inflation rises to 2.9% in July", date: "2026-07-31", time: "17:24", url: "https://www.ft.com/content/f54e632e-f8b4-4554-9f2e-c8a2ded0555b" },
  { id: "beb88252-6fb2-45b3-9388-eda0d3ef5551", title: "Sadiq Khan accuses Met of trying to fix contract for Palantir", date: "2026-07-31", time: "17:21", url: "https://www.ft.com/content/beb88252-6fb2-45b3-9388-eda0d3ef5551" },
  { id: "d81b5086-df43-4c91-ac23-fa9076ef0304", title: "Abu Dhabi abandons bid to build global oil benchmark", date: "2026-07-31", time: "17:03", url: "https://www.ft.com/content/d81b5086-df43-4c91-ac23-fa9076ef0304" },
  { id: "06b7545b-94a0-4a5d-9c21-0c7852771b41", title: "Google Earth AI tool raises fears over spread of fake satellite images", date: "2026-07-31", time: "17:00", url: "https://www.ft.com/content/06b7545b-94a0-4a5d-9c21-0c7852771b41" },
  { id: "a1c7a1ed-3687-492c-9170-48ae07d7ead3", title: "I helped bring in US bank stress tests. Now it is time to drop them", date: "2026-07-31", time: "17:00", url: "https://www.ft.com/content/a1c7a1ed-3687-492c-9170-48ae07d7ead3" },
  { id: "71f9031c-71a4-4e1b-ab25-216ff34dc87d", title: "John Healey to deliver Budget on October 28", date: "2026-07-31", time: "16:28", url: "https://www.ft.com/content/71f9031c-71a4-4e1b-ab25-216ff34dc87d" },
  { id: "0f9b2fe7-bde4-4f5f-b49e-93ccb5da9ea8", title: "US Treasury warns banks it may intervene in yen", date: "2026-07-31", time: "15:50", url: "https://www.ft.com/content/0f9b2fe7-bde4-4f5f-b49e-93ccb5da9ea8" },
  { id: "9171610d-395b-4e58-9257-7fa08d459c28", title: "Brazilian police launch graft probe into President Lula’s son", date: "2026-07-31", time: "15:40", url: "https://www.ft.com/content/9171610d-395b-4e58-9257-7fa08d459c28" },
  { id: "0d40281a-9525-4326-95d5-1920c6742688", title: "The Bank of England gets with the programme on QT", date: "2026-07-31", time: "15:35", url: "https://www.ft.com/content/0d40281a-9525-4326-95d5-1920c6742688" },
  { id: "e5cb0cce-c2f5-4dae-8126-a2d3e9063dde", title: "Rhine drought strands ships and forces German production shutdowns", date: "2026-07-31", time: "15:26", url: "https://www.ft.com/content/e5cb0cce-c2f5-4dae-8126-a2d3e9063dde" },
  { id: "34917d6f-c8ec-4e13-890a-4d8475806bb7", title: "Spanish prime minister condemns influx of 60,000 migrants", date: "2026-07-31", time: "15:21", url: "https://www.ft.com/content/34917d6f-c8ec-4e13-890a-4d8475806bb7" },
  { id: "c03baa4b-e279-4201-acda-80361632334a", title: "Fifa stake sale could work — but not at this price", date: "2026-07-31", time: "15:16", url: "https://www.ft.com/content/c03baa4b-e279-4201-acda-80361632334a" },
  { id: "23eb1fd4-8301-4c0e-89b3-2647389e6226", title: "South Korean stock market soars 18% as investors pile back into AI", date: "2026-07-31", time: "15:12", url: "https://www.ft.com/content/23eb1fd4-8301-4c0e-89b3-2647389e6226" },
  { id: "762a504e-fca8-49d0-9f2e-b2f142fd749a", title: "Apple shares tumble as AI build-out hits supply chains and growth", date: "2026-07-31", time: "15:07", url: "https://www.ft.com/content/762a504e-fca8-49d0-9f2e-b2f142fd749a" },
  { id: "395afe31-3c86-4911-af05-54ca5aa2d41b", title: "Federal Reserve rate dissenters warn of challenges in taming inflation", date: "2026-07-31", time: "15:01", url: "https://www.ft.com/content/395afe31-3c86-4911-af05-54ca5aa2d41b" },
  { id: "fddc42a9-4c57-4689-abde-75bbe79622e9", title: "Amazon increases AI infrastructure spending to $220bn this year", date: "2026-07-31", time: "14:47", url: "https://www.ft.com/content/fddc42a9-4c57-4689-abde-75bbe79622e9" },
  { id: "0f47fc94-d039-4561-936e-55b5fc34541d", title: "US nuclear reactor company Westinghouse files for IPO", date: "2026-07-31", time: "14:34", url: "https://www.ft.com/content/0f47fc94-d039-4561-936e-55b5fc34541d" },
  { id: "570ecb5c-68de-4844-9e73-cf32463dbcac", title: "The twilight of Dr Fauci", date: "2026-07-31", time: "14:00", url: "https://www.ft.com/content/570ecb5c-68de-4844-9e73-cf32463dbcac" },
  { id: "c167fb1b-69c3-4df0-9126-1e0af678f924", title: "Markets are getting AI right", date: "2026-07-31", time: "14:00", url: "https://www.ft.com/content/c167fb1b-69c3-4df0-9126-1e0af678f924" },
  { id: "b7e53513-27fa-4b50-af17-b1308c587f11", title: "London residents lose legal challenge against Chinese ‘mega’ embassy", date: "2026-07-31", time: "13:54", url: "https://www.ft.com/content/b7e53513-27fa-4b50-af17-b1308c587f11" },
  { id: "a0a5e3a7-c4e6-42a6-9a7b-a780422bcd76", title: "Leopold Aschenbrenner vows to ‘fight another day’ after fund plunges 67% in July", date: "2026-07-31", time: "13:21", url: "https://www.ft.com/content/a0a5e3a7-c4e6-42a6-9a7b-a780422bcd76" },
  { id: "1023c8a4-fbb9-45ee-84ef-71b5fd48a1dd", title: "How Wall Street’s litigators finally became superstar lawyers", date: "2026-07-31", time: "13:17", url: "https://www.ft.com/content/1023c8a4-fbb9-45ee-84ef-71b5fd48a1dd" },
  { id: "613cd8b0-e8c5-45d2-a7f3-184e63d82e08", title: "Andy Burnham says Gianni Infantino is ‘wrong man’ to lead Fifa after stake-sale plan", date: "2026-07-31", time: "13:08", url: "https://www.ft.com/content/613cd8b0-e8c5-45d2-a7f3-184e63d82e08" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-07-31", time: "12:55", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
  { id: "75ba3055-625c-4cb5-894b-0696a38f5e79", title: "Latest Isa rates", date: "2026-07-31", time: "12:52", url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79" },
  { id: "a500489e-8185-4605-a3ab-010b3ec85a7b", title: "‘Total devastation’: Suffolk confronts aftermath of unprecedented wildfire", date: "2026-07-31", time: "12:45", url: "https://www.ft.com/content/a500489e-8185-4605-a3ab-010b3ec85a7b" },
  { id: "3a386a01-1276-4868-85e9-17d9dacf6986", title: "Israel’s far right urges Netanyahu to reject Trump’s Gaza plan", date: "2026-07-31", time: "12:38", url: "https://www.ft.com/content/3a386a01-1276-4868-85e9-17d9dacf6986" },
  { id: "8ed6b98d-b5d7-41e6-a210-5b75dc0bc4f2", title: "Bridgerton author Julia Quinn: ‘Sex scenes have to serve a purpose’", date: "2026-07-31", time: "12:30", url: "https://www.ft.com/content/8ed6b98d-b5d7-41e6-a210-5b75dc0bc4f2" },
  { id: "32951d1d-5402-406b-bfaf-a490bf1bff84", title: "Burnham’s policy bonanza", date: "2026-07-31", time: "12:19", url: "https://www.ft.com/content/32951d1d-5402-406b-bfaf-a490bf1bff84" },
  { id: "67db9b64-ec26-442e-8356-6c4411eba66e", title: "Data centres vs housing: how London became a central battleground", date: "2026-07-31", time: "12:00", url: "https://www.ft.com/content/67db9b64-ec26-442e-8356-6c4411eba66e" },
  { id: "67e045bb-76cc-404f-a04c-073411eedfc5", title: "FirstFT: The fight for football's future", date: "2026-07-31", time: "11:50", url: "https://www.ft.com/content/67e045bb-76cc-404f-a04c-073411eedfc5" },
  { id: "7e0e8281-4f14-4d6f-98c1-ea21b8c0543e", title: "Universal Music shares plunge by a quarter on streaming growth fears", date: "2026-07-31", time: "11:40", url: "https://www.ft.com/content/7e0e8281-4f14-4d6f-98c1-ea21b8c0543e" },
];
