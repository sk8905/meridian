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
  { id: "1b3f09b5-897e-4b7a-9949-2c4d9a32929e", title: "Sánchez hits out at EU leaders over criticism of Spain’s migrant crisis", date: "2026-08-01", time: "11:46", url: "https://www.ft.com/content/1b3f09b5-897e-4b7a-9949-2c4d9a32929e" },
  { id: "42257873-e801-49b8-967f-a15ea1129541", title: "Chart of the Week: Warsh spooks long bonds", date: "2026-08-01", time: "10:30", url: "https://www.ft.com/content/42257873-e801-49b8-967f-a15ea1129541" },
  { id: "58400cf0-20df-46ef-975b-7414806e09de", title: "Fifa abandons $20bn investment plan after global backlash", date: "2026-08-01", time: "09:44", url: "https://www.ft.com/content/58400cf0-20df-46ef-975b-7414806e09de" },
  { id: "f0581480-8129-413c-823f-4b5c85b1419e", title: "Gianni Infantino’s gamble fails", date: "2026-08-01", time: "09:00", url: "https://www.ft.com/content/f0581480-8129-413c-823f-4b5c85b1419e" },
  { id: "016ad17d-0cab-48f1-8d7f-d3eb1634be63", title: "Six teenagers, a brutal murder and the story they couldn’t take back", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/016ad17d-0cab-48f1-8d7f-d3eb1634be63" },
  { id: "0c4fe0ea-0892-488f-8981-29e200e3f51b", title: "Sorry you were late. Here’s my invoice", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/0c4fe0ea-0892-488f-8981-29e200e3f51b" },
  { id: "b76acfdd-787d-4eb9-bb4d-597af3e3d2c1", title: "Beating Berlin’s Sunday blues", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/b76acfdd-787d-4eb9-bb4d-597af3e3d2c1" },
  { id: "a6ddd9b6-d461-4c04-b804-5524538c084b", title: "Get your fix of 1066", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/a6ddd9b6-d461-4c04-b804-5524538c084b" },
  { id: "65f46ae0-8a3a-4f43-bc85-5eb9938d2d09", title: "Special edition: Wall Street’s wild week", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/65f46ae0-8a3a-4f43-bc85-5eb9938d2d09" },
  { id: "75fb1035-542b-43f3-88d4-ba8d4053d919", title: "Andy Burnham grabs the narrative in first fortnight of power", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/75fb1035-542b-43f3-88d4-ba8d4053d919" },
  { id: "92c4d77e-7a32-48e9-af5a-88243945b2a5", title: "Surging UK stocks prompt flurry of trades on investment platforms", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/92c4d77e-7a32-48e9-af5a-88243945b2a5" },
  { id: "ca97d754-a509-43eb-b7ce-df91e4e1edb8", title: "Greece’s island fires expose risks of tourism boom", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/ca97d754-a509-43eb-b7ce-df91e4e1edb8" },
  { id: "e14d11b4-d4c9-41f1-b5c6-1b2e349fa9ed", title: "Labour has harmed universities as much as Trump, London School of Economics head says", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/e14d11b4-d4c9-41f1-b5c6-1b2e349fa9ed" },
  { id: "dabd9888-b7ed-4c06-9986-e6705835ef31", title: "Abhijeet Dipke, the face of India’s victorious ‘cockroach’ protests", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/dabd9888-b7ed-4c06-9986-e6705835ef31" },
  { id: "f7b1e230-72a4-49b7-8339-2f693d7ebef5", title: "Higher earners warned over taper tax trap on pensions", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/f7b1e230-72a4-49b7-8339-2f693d7ebef5" },
  { id: "44d14a83-45b2-4d2e-94f0-8eb86dceab86", title: "Is Lloyds Bank’s techie boss a secret AI contrarian?", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/44d14a83-45b2-4d2e-94f0-8eb86dceab86" },
  { id: "a7c97a31-0d4b-4578-acb6-3406d04003ba", title: "Venezuela divided over US-brokered election talks", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/a7c97a31-0d4b-4578-acb6-3406d04003ba" },
  { id: "e41dadef-c473-48ff-9fa5-30b56d40af34", title: "Humbling times for markets", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/e41dadef-c473-48ff-9fa5-30b56d40af34" },
  { id: "1d75978f-7813-46dc-86aa-67d08204c0ba", title: "The second funeral of Serhiy Kulyk", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/1d75978f-7813-46dc-86aa-67d08204c0ba" },
  { id: "2ac61eb8-8d28-42f8-8a60-6159f3b3913e", title: "The end of ‘The Magnificent 7’: the problem with stock nicknames", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/2ac61eb8-8d28-42f8-8a60-6159f3b3913e" },
  { id: "818bb542-3777-4c9f-9f25-535199563fb3", title: "How the West End’s landlords are preparing London for Saudi summers", date: "2026-08-01", time: "05:00", url: "https://www.ft.com/content/818bb542-3777-4c9f-9f25-535199563fb3" },
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
];
