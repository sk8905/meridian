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
    "id": "472ad6cf-438f-4d62-a41c-8725cbf53383",
    "title": "Indonesia expels tightly held companies from Jakarta index in bid to avoid MSCI downgrade",
    "date": "2026-10-19",
    "time": "16:59",
    "url": "https://www.ft.com/content/472ad6cf-438f-4d62-a41c-8725cbf53383"
  },
  {
    "id": "8b1990d1-b4b2-4147-ba4b-76d1869ee2db",
    "title": "EU drops push for global ban on Arctic drilling",
    "date": "2026-10-19",
    "time": "16:36",
    "url": "https://www.ft.com/content/8b1990d1-b4b2-4147-ba4b-76d1869ee2db"
  },
  {
    "id": "1faf0ed7-53ce-46a4-99c8-216e8e28b9ea",
    "title": "Former chair of Monte dei Paschi accused of role in executive’s death",
    "date": "2026-10-19",
    "time": "16:10",
    "url": "https://www.ft.com/content/1faf0ed7-53ce-46a4-99c8-216e8e28b9ea"
  },
  {
    "id": "8848d06c-c0fa-49ff-af08-880ef4f3ff21",
    "title": "India’s democracy once went looking for voters. Not any more",
    "date": "2026-10-19",
    "time": "15:46",
    "url": "https://www.ft.com/content/8848d06c-c0fa-49ff-af08-880ef4f3ff21"
  },
  {
    "id": "15a049f3-b62e-40ed-b304-8a2452713338",
    "title": "Data centres need protection from drone warfare",
    "date": "2026-10-19",
    "time": "15:31",
    "url": "https://www.ft.com/content/15a049f3-b62e-40ed-b304-8a2452713338"
  },
  {
    "id": "8cdf338e-d472-460c-8642-a8f033b99462",
    "title": "Submit a question: Could Anthropic’s IPO be a turning point for AI?",
    "date": "2026-10-19",
    "time": "15:10",
    "url": "https://www.ft.com/content/8cdf338e-d472-460c-8642-a8f033b99462"
  },
  {
    "id": "ef0f6d42-4759-4ce8-8e40-acd83f0c64f1",
    "title": "The best art exhibitions to see in London right now",
    "date": "2026-10-19",
    "time": "14:48",
    "url": "https://www.ft.com/content/ef0f6d42-4759-4ce8-8e40-acd83f0c64f1"
  },
  {
    "id": "f3127b4f-d33a-4431-acff-021829f3aa72",
    "title": "BoE scrutinises Barclays over claim traders misrepresented private credit exposure",
    "date": "2026-10-19",
    "time": "14:54",
    "url": "https://www.ft.com/content/f3127b4f-d33a-4431-acff-021829f3aa72"
  },
  {
    "id": "5f595355-caca-4951-8170-91bb513f7aa9",
    "title": "Australian MP struck by car in alleged attack",
    "date": "2026-10-19",
    "time": "14:52",
    "url": "https://www.ft.com/content/5f595355-caca-4951-8170-91bb513f7aa9"
  },
  {
    "id": "d8df36c2-7e8c-4cfb-ad9e-e6e954fea4b9",
    "title": "Violent protests spread from France to Italy and Belgium",
    "date": "2026-10-19",
    "time": "14:50",
    "url": "https://www.ft.com/content/d8df36c2-7e8c-4cfb-ad9e-e6e954fea4b9"
  },
  {
    "id": "2ad6e5dd-b8c2-4186-a6e2-ba27f222e1f0",
    "title": "FTSE 100 newcomer Ithaca warns of halt to investment if Rosebank blocked",
    "date": "2026-10-19",
    "time": "14:37",
    "url": "https://www.ft.com/content/2ad6e5dd-b8c2-4186-a6e2-ba27f222e1f0"
  },
  {
    "id": "915ea7ca-1f35-4847-810a-fb29e8344496",
    "title": "US stocks rebound after AI sell-off",
    "date": "2026-10-19",
    "time": "14:37",
    "url": "https://www.ft.com/content/915ea7ca-1f35-4847-810a-fb29e8344496"
  },
  {
    "id": "22290706-ab59-4766-b604-ddff94a71bcf",
    "title": "Uber defeats High Court lawsuit brought by London’s black-cab drivers",
    "date": "2026-10-19",
    "time": "14:19",
    "url": "https://www.ft.com/content/22290706-ab59-4766-b604-ddff94a71bcf"
  },
  {
    "id": "e73d0106-486b-4382-8ecc-5c96ac44fdff",
    "title": "US defence stocks tumble as investors bet on Democratic election sweep",
    "date": "2026-10-19",
    "time": "14:04",
    "url": "https://www.ft.com/content/e73d0106-486b-4382-8ecc-5c96ac44fdff"
  },
  {
    "id": "6b460256-2f85-485f-ba99-45f270fe3cad",
    "title": "Indonesia’s market is dysfunctional, not uninvestable",
    "date": "2026-10-19",
    "time": "13:55",
    "url": "https://www.ft.com/content/6b460256-2f85-485f-ba99-45f270fe3cad"
  },
  {
    "id": "3beab58d-4269-4722-b299-8fa5a93f5a52",
    "title": "Anthropic commits 5% of shares to ‘public benefit’ fund",
    "date": "2026-10-19",
    "time": "13:17",
    "url": "https://www.ft.com/content/3beab58d-4269-4722-b299-8fa5a93f5a52"
  },
  {
    "id": "aeb432cd-5d95-4062-b7a8-f494592adb34",
    "title": "Is smart farming really smart business?",
    "date": "2026-10-19",
    "time": "13:02",
    "url": "https://www.ft.com/content/aeb432cd-5d95-4062-b7a8-f494592adb34"
  },
  {
    "id": "9da32f56-9024-4940-b7f0-ebfb200a7c15",
    "title": "Angel’s Bone review — a brilliant, bruising season opener for the beleaguered ENO",
    "date": "2026-10-19",
    "time": "13:00",
    "url": "https://www.ft.com/content/9da32f56-9024-4940-b7f0-ebfb200a7c15"
  },
  {
    "id": "b9d270a8-738b-41cb-9c3c-5fa5ac0c2325",
    "title": "KKR accused by EU of misleading regulators over €22bn telecoms deal",
    "date": "2026-10-19",
    "time": "12:32",
    "url": "https://www.ft.com/content/b9d270a8-738b-41cb-9c3c-5fa5ac0c2325"
  },
  {
    "id": "7dbe983c-fcd2-41dd-bbe4-9f38a489e6c2",
    "title": "The self-destructive wishful thinking about European autos and trade",
    "date": "2026-10-19",
    "time": "12:31",
    "url": "https://www.ft.com/content/7dbe983c-fcd2-41dd-bbe4-9f38a489e6c2"
  },
  {
    "id": "cc7e577a-db7a-4e12-9a42-443696b98ec5",
    "title": "Emmanuel Macron rejects interior minister’s resignation after French riots",
    "date": "2026-10-19",
    "time": "12:29",
    "url": "https://www.ft.com/content/cc7e577a-db7a-4e12-9a42-443696b98ec5"
  },
  {
    "id": "92f271fd-f96c-4723-91f2-48363b98127f",
    "title": "Zelenskyy, Europe and the end of Trump whispering",
    "date": "2026-10-19",
    "time": "12:21",
    "url": "https://www.ft.com/content/92f271fd-f96c-4723-91f2-48363b98127f"
  },
  {
    "id": "6075e0ec-9116-4de4-84e6-d50b5ed1d47a",
    "title": "Freshfields apologises ‘unreservedly’ over Middle East comments in email leak",
    "date": "2026-10-19",
    "time": "12:09",
    "url": "https://www.ft.com/content/6075e0ec-9116-4de4-84e6-d50b5ed1d47a"
  },
  {
    "id": "19495e50-0f55-44b1-8d19-19244163a4e8",
    "title": "Emmanuel Macron faces political firestorm after riots",
    "date": "2026-10-19",
    "time": "11:42",
    "url": "https://www.ft.com/content/19495e50-0f55-44b1-8d19-19244163a4e8"
  },
  {
    "id": "a381df3f-a1bf-4889-aa5d-e4e594a3ea33",
    "title": "Ukraine receives partial intelligence on Russian ballistic missile strikes",
    "date": "2026-10-19",
    "time": "11:40",
    "url": "https://www.ft.com/content/a381df3f-a1bf-4889-aa5d-e4e594a3ea33"
  },
  {
    "id": "96d88d61-002d-4b5c-8e0b-4f50577518c5",
    "title": "CME plans tungsten futures as demand for weapons rises",
    "date": "2026-10-19",
    "time": "11:30",
    "url": "https://www.ft.com/content/96d88d61-002d-4b5c-8e0b-4f50577518c5"
  },
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
  }
];
