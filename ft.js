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
  { id: "237bfa1a-e1af-493c-a6a6-ef2f36b519f8", title: "P&G seals $3.8bn deal for supplements company Thorne", date: "2026-08-04", time: "19:32", url: "https://www.ft.com/content/237bfa1a-e1af-493c-a6a6-ef2f36b519f8" },
  { id: "4bfbce82-52ae-425f-8c11-57b2b30f2de7", title: "Donald Trump’s ex-lawyer poised to become attorney-general after ‘slush fund’ U-turn", date: "2026-08-04", time: "19:05", url: "https://www.ft.com/content/4bfbce82-52ae-425f-8c11-57b2b30f2de7" },
  { id: "8d421d44-862d-4942-99ae-568bad4900c2", title: "US diesel prices overtake Biden-era average in blow to Trump", date: "2026-08-04", time: "18:51", url: "https://www.ft.com/content/8d421d44-862d-4942-99ae-568bad4900c2" },
  { id: "e8f58a9c-0166-4a81-b970-b070d3dbc122", title: "An overdue show of EU solidarity with Spain", date: "2026-08-04", time: "18:45", url: "https://www.ft.com/content/e8f58a9c-0166-4a81-b970-b070d3dbc122" },
  { id: "1ed68c71-e1e8-4ae5-a965-5380cbdeaa22", title: "US stocks jump after Bessent says deal to reopen Hormuz is imminent", date: "2026-08-04", time: "18:37", url: "https://www.ft.com/content/1ed68c71-e1e8-4ae5-a965-5380cbdeaa22" },
  { id: "6183a03c-4766-43e7-9392-cacd9a6545f8", title: "Palantir rides high on greed and fear — but mostly fear", date: "2026-08-04", time: "18:23", url: "https://www.ft.com/content/6183a03c-4766-43e7-9392-cacd9a6545f8" },
  { id: "8054a402-18a1-497d-ba0a-1ea338756e1f", title: "UK early release scheme may not avert future prison crisis, say experts", date: "2026-08-04", time: "18:04", url: "https://www.ft.com/content/8054a402-18a1-497d-ba0a-1ea338756e1f" },
  { id: "affbeefd-b94b-4707-b9af-3e12db6665d0", title: "US labour market stable in June", date: "2026-08-04", time: "17:28", url: "https://www.ft.com/content/affbeefd-b94b-4707-b9af-3e12db6665d0" },
  { id: "ac4b294d-36db-4e6d-aafe-663ce20cb658", title: "Wall Street’s insurance takeover presents circular risks and rewards", date: "2026-08-04", time: "16:53", url: "https://www.ft.com/content/ac4b294d-36db-4e6d-aafe-663ce20cb658" },
  { id: "f7fb388d-5826-409a-8dd6-43e828da6ba1", title: "MFS administrators sue Barclays after accounts access frozen", date: "2026-08-04", time: "16:53", url: "https://www.ft.com/content/f7fb388d-5826-409a-8dd6-43e828da6ba1" },
  { id: "7ff5dd5c-dc45-4db3-ab75-8ab1c844f7be", title: "Japan LLC trading update", date: "2026-08-04", time: "16:39", url: "https://www.ft.com/content/7ff5dd5c-dc45-4db3-ab75-8ab1c844f7be" },
  { id: "63b79c58-a497-4359-a3c7-03a36fead622", title: "Water companies feel squeeze of abstraction limits as drought deepens", date: "2026-08-04", time: "16:10", url: "https://www.ft.com/content/63b79c58-a497-4359-a3c7-03a36fead622" },
  { id: "c56d21b4-1738-4b53-ad78-79f29b5de798", title: "Saudi-Israel tensions could frustrate India’s IMEC dreams", date: "2026-08-04", time: "16:09", url: "https://www.ft.com/content/c56d21b4-1738-4b53-ad78-79f29b5de798" },
  { id: "c1e80ff0-4566-4a15-9e7b-397abe6e5b5c", title: "In Venezuela, legitimacy matters more than continuity", date: "2026-08-04", time: "15:37", url: "https://www.ft.com/content/c1e80ff0-4566-4a15-9e7b-397abe6e5b5c" },
  { id: "07ba66d4-ceaf-497d-8bb2-19df27853a26", title: "Todd Blanche secures key Republican support to clear way for A-G confirmation", date: "2026-08-04", time: "14:00", url: "https://www.ft.com/content/07ba66d4-ceaf-497d-8bb2-19df27853a26" },
  { id: "33c20c4e-6a25-42da-9f1e-6664c8388957", title: "Developing countries have ‘less to fear’ from AI than rich nations", date: "2026-08-04", time: "14:00", url: "https://www.ft.com/content/33c20c4e-6a25-42da-9f1e-6664c8388957" },
  { id: "30d55ac8-d363-42e6-a711-016aa83ced80", title: "South African court hears challenge to land seizure law opposed by US", date: "2026-08-04", time: "13:54", url: "https://www.ft.com/content/30d55ac8-d363-42e6-a711-016aa83ced80" },
  { id: "cbc7297a-647f-44be-9124-4fba662b15e5", title: "The Federal Reserve goes Wacko", date: "2026-08-04", time: "12:30", url: "https://www.ft.com/content/cbc7297a-647f-44be-9124-4fba662b15e5" },
  { id: "d0fc4477-21b9-4cc4-9033-52f995350627", title: "Fifa executive criticises Gianni Infantino’s ‘reproachable’ stake sale plan", date: "2026-08-04", time: "12:28", url: "https://www.ft.com/content/d0fc4477-21b9-4cc4-9033-52f995350627" },
  { id: "981becc2-8d7d-428a-93d3-405fc44e3ca5", title: "Japan’s fusion industry seeks state backing amid Middle East energy strain", date: "2026-08-04", time: "12:00", url: "https://www.ft.com/content/981becc2-8d7d-428a-93d3-405fc44e3ca5" },
  { id: "1be83506-b897-4c26-97cc-445d7354ee6f", title: "Scott Bessent’s yen intervention signals new era of US ‘currency activism’", date: "2026-08-04", time: "11:37", url: "https://www.ft.com/content/1be83506-b897-4c26-97cc-445d7354ee6f" },
  { id: "b1f9689d-a31e-4b6e-8a13-38e7caf7d92d", title: "Apollo misses out on big asset sales that have boosted rivals", date: "2026-08-04", time: "11:33", url: "https://www.ft.com/content/b1f9689d-a31e-4b6e-8a13-38e7caf7d92d" },
  { id: "7da4af42-178d-431a-91db-7e82eecc98dd", title: "OpenAI hits back at Apple over ‘oddly personal’ trade secrets fight", date: "2026-08-04", time: "11:31", url: "https://www.ft.com/content/7da4af42-178d-431a-91db-7e82eecc98dd" },
  { id: "07aed955-d8c7-4ba4-b7b0-14e996bb9bc8", title: "The Democrats’ civil war over Israel is getting worse", date: "2026-08-04", time: "11:30", url: "https://www.ft.com/content/07aed955-d8c7-4ba4-b7b0-14e996bb9bc8" },
  { id: "78756a27-817e-450d-9bab-33214efbd804", title: "Tax consumption, not income or AI", date: "2026-08-04", time: "11:00", url: "https://www.ft.com/content/78756a27-817e-450d-9bab-33214efbd804" },
  { id: "2906dfd6-ff5b-4f80-b575-661930ea9695", title: "India seeks to widen tax exemptions to woo investors such as Apple", date: "2026-08-04", time: "10:41", url: "https://www.ft.com/content/2906dfd6-ff5b-4f80-b575-661930ea9695" },
  { id: "4d9d5f1a-df3e-490e-9567-f7f7f968f3a4", title: "Ukrainian drones hit Wildberries warehouses in overnight strikes", date: "2026-08-04", time: "09:57", url: "https://www.ft.com/content/4d9d5f1a-df3e-490e-9567-f7f7f968f3a4" },
  { id: "96f5e56c-a8bf-44ca-8750-0448b19e0903", title: "Andy Burnham bars serious sex offenders from early prison release scheme", date: "2026-08-04", time: "09:36", url: "https://www.ft.com/content/96f5e56c-a8bf-44ca-8750-0448b19e0903" },
  { id: "1d8ac0ff-8ff0-44fd-bd92-5fd18983f31e", title: "Segro recommends £14bn takeover bid from US bidder", date: "2026-08-04", time: "08:03", url: "https://www.ft.com/content/1d8ac0ff-8ff0-44fd-bd92-5fd18983f31e" },
  { id: "fa298199-b824-4ca9-a3a0-440eb320ac61", title: "BP to sell US biogas business as profits soar", date: "2026-08-04", time: "07:23", url: "https://www.ft.com/content/fa298199-b824-4ca9-a3a0-440eb320ac61" },
  { id: "8a703d1e-99d4-4a04-a08a-761489d33da3", title: "Toyota plans $6.3bn buyback as weak yen boosts outlook", date: "2026-08-04", time: "07:17", url: "https://www.ft.com/content/8a703d1e-99d4-4a04-a08a-761489d33da3" },
  { id: "41ecd9e9-26d3-49a4-8c88-39a187ea697d", title: "FTAV’s further reading", date: "2026-08-04", time: "07:09", url: "https://www.ft.com/content/41ecd9e9-26d3-49a4-8c88-39a187ea697d" },
  { id: "04b34467-dab0-4646-97dc-8c3d3e44e5e2", title: "Yen intervention = US self-preservation", date: "2026-08-04", time: "06:30", url: "https://www.ft.com/content/04b34467-dab0-4646-97dc-8c3d3e44e5e2" },
  { id: "bbcf5c49-0ca3-4af4-a408-e0a723227042", title: "FirstFT: Russia expands shadow LNG fleet", date: "2026-08-04", time: "05:32", url: "https://www.ft.com/content/bbcf5c49-0ca3-4af4-a408-e0a723227042" },
  { id: "0da95788-cde6-4e1a-af89-1faced91178e", title: "HSBC quarterly profit soars to $10.1bn", date: "2026-08-04", time: "05:11", url: "https://www.ft.com/content/0da95788-cde6-4e1a-af89-1faced91178e" },
  { id: "b2440aa5-be3e-40ae-ad2d-ad5893de79d3", title: "The king who outfoxed Pedro Sánchez", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/b2440aa5-be3e-40ae-ad2d-ad5893de79d3" },
  { id: "450555e6-f4b6-4c4d-b9fa-c4f48c833c57", title: "The $400bn megadeal brewing in big pharma", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/450555e6-f4b6-4c4d-b9fa-c4f48c833c57" },
  { id: "90a0828c-1074-4609-b378-bfd410b7ec19", title: "Spanish stocks offer a sunny escape for tech-weary investors", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/90a0828c-1074-4609-b378-bfd410b7ec19" },
  { id: "7dd21b1e-3b3d-48a6-a3fe-6a0e4a14944b", title: "Revolut chief Nik Storonsky sued by broker over €350mn superyacht", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/7dd21b1e-3b3d-48a6-a3fe-6a0e4a14944b" },
  { id: "76d27b15-f73c-4408-9455-a85831eb2fec", title: "Infantino is not the problem", date: "2026-08-04", time: "05:00", url: "https://www.ft.com/content/76d27b15-f73c-4408-9455-a85831eb2fec" },
];
