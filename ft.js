// =============================================================================
// myFT — headlines from the reader's personalised Financial Times feed
// (followed topics), surfaced in the Home news feed under an "FT" label.
//
// Source: the reader's myFT RSS feed —
//   https://www.ft.com/myft/following/601965b2-62d0-47e1-88cf-576ebc8a8a2e.rss
// It is fetched by the scheduled refresh routine (see docs/refresh-routines.md,
// the "Email sweep → myFT" section), parsed, and written here.
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
    "id": "865b3d6b-cb2b-44c2-893d-8b5bf5846b80",
    "title": "Do your jewels tell a story?",
    "date": "2026-10-19",
    "time": "11:00",
    "url": "https://www.ft.com/content/865b3d6b-cb2b-44c2-893d-8b5bf5846b80"
  },
  {
    "id": "086e66dd-1e1b-4279-ae6b-2ac88757998f",
    "title": "US grocery giants head to court in $9bn battle over failed merger",
    "date": "2026-10-19",
    "time": "11:00",
    "url": "https://www.ft.com/content/086e66dd-1e1b-4279-ae6b-2ac88757998f"
  },
  {
    "id": "1f23e859-5e70-4d99-8f9b-56de3d0ae43e",
    "title": "Iranian hardliners say the time for nuclear weapons has come",
    "date": "2026-10-19",
    "time": "10:55",
    "url": "https://www.ft.com/content/1f23e859-5e70-4d99-8f9b-56de3d0ae43e"
  },
  {
    "id": "cc7e577a-db7a-4e12-9a42-443696b98ec5",
    "title": "Emmanuel Macron rejects interior minister’s resignation after French riots",
    "date": "2026-10-19",
    "time": "10:48",
    "url": "https://www.ft.com/content/cc7e577a-db7a-4e12-9a42-443696b98ec5"
  },
  {
    "id": "eaa86af0-5183-4c3c-a697-c55fc04e4147",
    "title": "And the FTAV charts quiz winner is . . .",
    "date": "2026-10-19",
    "time": "10:43",
    "url": "https://www.ft.com/content/eaa86af0-5183-4c3c-a697-c55fc04e4147"
  },
  {
    "id": "77b859ab-e380-413d-894b-2fe3cf6417c5",
    "title": "Flight from Israel diverted after ‘threat’ reported",
    "date": "2026-10-19",
    "time": "10:08",
    "url": "https://www.ft.com/content/77b859ab-e380-413d-894b-2fe3cf6417c5"
  },
  {
    "id": "d98a97e4-5ba4-481e-af20-35dcb2fc3a14",
    "title": "John Swinney tests limits of Andy Burnham’s devolution pitch to Scotland",
    "date": "2026-10-19",
    "time": "09:30",
    "url": "https://www.ft.com/content/d98a97e4-5ba4-481e-af20-35dcb2fc3a14"
  },
  {
    "id": "f5ee9924-0509-4a34-a347-c22278f023c6",
    "title": "FTAV’s further reading",
    "date": "2026-10-19",
    "time": "08:13",
    "url": "https://www.ft.com/content/f5ee9924-0509-4a34-a347-c22278f023c6"
  },
  {
    "id": "915ea7ca-1f35-4847-810a-fb29e8344496",
    "title": "US stocks set for rebound after AI sell-off",
    "date": "2026-10-19",
    "time": "06:34",
    "url": "https://www.ft.com/content/915ea7ca-1f35-4847-810a-fb29e8344496"
  },
  {
    "id": "cce1d9b5-5f36-4c42-ab7b-1b74fc788773",
    "title": "FTSE as Hedge",
    "date": "2026-10-19",
    "time": "06:30",
    "url": "https://www.ft.com/content/cce1d9b5-5f36-4c42-ab7b-1b74fc788773"
  },
  {
    "id": "c5bbb2a7-e00e-4e20-9db3-f4d00504857a",
    "title": "‘Frenzy’ in Australian deals as investors swoop on cheap assets",
    "date": "2026-10-19",
    "time": "06:28",
    "url": "https://www.ft.com/content/c5bbb2a7-e00e-4e20-9db3-f4d00504857a"
  },
  {
    "id": "280637e2-72f7-46c0-8fc4-3532032287da",
    "title": "US envoy hopes for ‘prosperous’ Europe",
    "date": "2026-10-19",
    "time": "06:00",
    "url": "https://www.ft.com/content/280637e2-72f7-46c0-8fc4-3532032287da"
  },
  {
    "id": "5970614a-b1f7-4b4e-b1e5-6038e1dde654",
    "title": "Investors turn on data centres",
    "date": "2026-10-19",
    "time": "06:00",
    "url": "https://www.ft.com/content/5970614a-b1f7-4b4e-b1e5-6038e1dde654"
  },
  {
    "id": "ba3b9244-bf94-4c3f-a89b-b761488fd71d",
    "title": "Has America’s wave of anti-globalisation populism peaked?",
    "date": "2026-10-19",
    "time": "06:00",
    "url": "https://www.ft.com/content/ba3b9244-bf94-4c3f-a89b-b761488fd71d"
  },
  {
    "id": "76117a3b-2cd6-481b-b485-4b743627589d",
    "title": "FirstFT: Bank of England scrutinises Barclays",
    "date": "2026-10-19",
    "time": "05:32",
    "url": "https://www.ft.com/content/76117a3b-2cd6-481b-b485-4b743627589d"
  },
  {
    "id": "e09b009c-7ba1-4bf6-a329-937d38110ab4",
    "title": "The sushi restaurant Tokyoites travel three hours to for lunch",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/e09b009c-7ba1-4bf6-a329-937d38110ab4"
  },
  {
    "id": "441501cc-e88b-45aa-81d2-864d76971dec",
    "title": "A mother’s quest to find out how her daughter was poisoned by lead",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/441501cc-e88b-45aa-81d2-864d76971dec"
  },
  {
    "id": "3dae6c98-afeb-4b4c-9996-4279d4e2e3b2",
    "title": "Luxury ‘dupe’ retailer Quince enters UK market",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/3dae6c98-afeb-4b4c-9996-4279d4e2e3b2"
  },
  {
    "id": "5483aa1b-7380-45d6-be0f-1a4b2098c903",
    "title": "Hollywood recasts tech tycoons as bad billionaires",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/5483aa1b-7380-45d6-be0f-1a4b2098c903"
  },
  {
    "id": "ffb638bf-6b1d-4b16-bdd2-ddfb89103d1b",
    "title": "How to downsize your kitchen",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/ffb638bf-6b1d-4b16-bdd2-ddfb89103d1b"
  },
  {
    "id": "2f5e68e3-240d-4b77-87fe-2875932c0788",
    "title": "Which is worse for the planet, your kitchen extension or your 4x4?",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/2f5e68e3-240d-4b77-87fe-2875932c0788"
  },
  {
    "id": "c2018783-5a7a-4caf-99a8-69ea90ddc16d",
    "title": "Order in disorder: the meaning of stripes",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/c2018783-5a7a-4caf-99a8-69ea90ddc16d"
  },
  {
    "id": "85545be4-6f36-4ac6-9185-e715ccd5fab3",
    "title": "Degree apprenticeships plateau as employers confront increased hiring costs",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/85545be4-6f36-4ac6-9185-e715ccd5fab3"
  },
  {
    "id": "f7b5695c-d326-427c-91a5-18b5a9e4567f",
    "title": "Private equity group Charlesbank closes one of the biggest law firm deals",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/f7b5695c-d326-427c-91a5-18b5a9e4567f"
  },
  {
    "id": "f3127b4f-d33a-4431-acff-021829f3aa72",
    "title": "BoE scrutinises Barclays over claim traders misrepresented private credit exposure",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/f3127b4f-d33a-4431-acff-021829f3aa72"
  },
  {
    "id": "af6f84d7-b134-4181-84f3-7811c369f306",
    "title": "Five things business wants from the Budget",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/af6f84d7-b134-4181-84f3-7811c369f306"
  },
  {
    "id": "d375cde1-ec37-4c5e-87ab-a3a655e879d8",
    "title": "Americans are unhappy. How will they vote?",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/d375cde1-ec37-4c5e-87ab-a3a655e879d8"
  },
  {
    "id": "997a975e-dd70-4935-b2b8-2ba5bafa62d5",
    "title": "Rise of crypto vaults channels billions of dollars into risky lending",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/997a975e-dd70-4935-b2b8-2ba5bafa62d5"
  },
  {
    "id": "aef890f1-e3f5-4add-b1fc-6187e2658106",
    "title": "Rising interest rates derail property recovery as buyers recut deals",
    "date": "2026-10-19",
    "time": "05:00",
    "url": "https://www.ft.com/content/aef890f1-e3f5-4add-b1fc-6187e2658106"
  },
  {
    "id": "cf113314-1077-4ab4-b667-9912656684f1",
    "title": "China’s economy expands 4.5% in third quarter",
    "date": "2026-10-19",
    "time": "04:05",
    "url": "https://www.ft.com/content/cf113314-1077-4ab4-b667-9912656684f1"
  },
  {
    "id": "3beab58d-4269-4722-b299-8fa5a93f5a52",
    "title": "Anthropic commits 5% of shares to ‘public benefit’ fund",
    "date": "2026-10-19",
    "time": "02:31",
    "url": "https://www.ft.com/content/3beab58d-4269-4722-b299-8fa5a93f5a52"
  },
  {
    "id": "0f857d6a-646d-4d19-bcdd-a0f0b4e8585c",
    "title": "Private equity looks to South Korea as next Asian frontier",
    "date": "2026-10-19",
    "time": "02:30",
    "url": "https://www.ft.com/content/0f857d6a-646d-4d19-bcdd-a0f0b4e8585c"
  },
  {
    "id": "5700f8fb-32b9-4324-972c-9578904ac6e2",
    "title": "Evercore appoints co-presidents as it sets up CEO succession contest",
    "date": "2026-10-18",
    "time": "21:01",
    "url": "https://www.ft.com/content/5700f8fb-32b9-4324-972c-9578904ac6e2"
  },
  {
    "id": "19495e50-0f55-44b1-8d19-19244163a4e8",
    "title": "Macron faces political firestorm after riots",
    "date": "2026-10-18",
    "time": "20:55",
    "url": "https://www.ft.com/content/19495e50-0f55-44b1-8d19-19244163a4e8"
  },
  {
    "id": "369eba8b-246d-405f-b0d8-6c676b0b6dab",
    "title": "France reels after ‘unprecedented’ violent riots",
    "date": "2026-10-18",
    "time": "20:52",
    "url": "https://www.ft.com/content/369eba8b-246d-405f-b0d8-6c676b0b6dab"
  },
  {
    "id": "39a1f29b-1248-4785-8aa3-0e7c29b5bf35",
    "title": "Trump to begin transforming historic golf course despite court order",
    "date": "2026-10-18",
    "time": "20:28",
    "url": "https://www.ft.com/content/39a1f29b-1248-4785-8aa3-0e7c29b5bf35"
  },
  {
    "id": "4ed89331-df18-4f2d-817b-9a7b304fd4e4",
    "title": "US army chief in Indo-Pacific calls for display of enhanced military muscle",
    "date": "2026-10-18",
    "time": "20:00",
    "url": "https://www.ft.com/content/4ed89331-df18-4f2d-817b-9a7b304fd4e4"
  },
  {
    "id": "734dad42-2eef-4a70-8947-c73997e49fd1",
    "title": "St Petersburg endures biggest Ukrainian drone attack",
    "date": "2026-10-18",
    "time": "19:30",
    "url": "https://www.ft.com/content/734dad42-2eef-4a70-8947-c73997e49fd1"
  },
  {
    "id": "37fbe995-df90-429a-bddb-34d14151bf79",
    "title": "Trump endorses Netanyahu ahead of Israeli elections",
    "date": "2026-10-18",
    "time": "19:11",
    "url": "https://www.ft.com/content/37fbe995-df90-429a-bddb-34d14151bf79"
  },
  {
    "id": "873e7ef2-d3d6-4c30-b8f8-ee3e69d60138",
    "title": "City of London weighs tax rises and service cuts to plug £70mn budget hole",
    "date": "2026-10-18",
    "time": "19:00",
    "url": "https://www.ft.com/content/873e7ef2-d3d6-4c30-b8f8-ee3e69d60138"
  }
];
