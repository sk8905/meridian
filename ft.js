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
  { id: "40ae9cd3-fbc8-4a55-adaa-c24bc80481c9", title: "Kevin Warsh seeks to soothe investors’ nerves as signs of economic strain mount", date: "2026-08-24", time: "07:07", url: "https://www.ft.com/content/40ae9cd3-fbc8-4a55-adaa-c24bc80481c9" },
  { id: "7f8574f5-f909-4226-b96f-5d5d9a5f0798", title: "The great re-equitisation and the dollar", date: "2026-08-24", time: "06:30", url: "https://www.ft.com/content/7f8574f5-f909-4226-b96f-5d5d9a5f0798" },
  { id: "63e11e59-1f21-488a-b89b-de4abbdd7396", title: "FirstFT: Europe trails as AI drives US investment", date: "2026-08-24", time: "06:15", url: "https://www.ft.com/content/63e11e59-1f21-488a-b89b-de4abbdd7396" },
  { id: "680b2d66-5f69-497f-9cb8-9d010ae64f69", title: "European allies flock to Kyiv to pledge more defences against Russian bombardment", date: "2026-08-24", time: "06:00", url: "https://www.ft.com/content/680b2d66-5f69-497f-9cb8-9d010ae64f69" },
  { id: "35c2bdcf-110e-456a-a3c1-ba973837b9b9", title: "Analysts’ views: forecasters continue to see Fed and Bank of England on hold this year", date: "2026-08-24", time: "05:29", url: "https://www.ft.com/content/35c2bdcf-110e-456a-a3c1-ba973837b9b9" },
  { id: "b153db68-a361-4217-9cc5-b766a15c1922", title: "UK statistics agency turns to AI to cut costs and improve data", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/b153db68-a361-4217-9cc5-b766a15c1922" },
  { id: "3f25f892-2de2-40e6-9592-a7ac18682c6c", title: "AI is coming for your glasses", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/3f25f892-2de2-40e6-9592-a7ac18682c6c" },
  { id: "d6f1eb66-1684-4b4f-8e4f-cc429d5dd4b0", title: "Shell draws Exxon interest in $8bn US chemical assets sale", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/d6f1eb66-1684-4b4f-8e4f-cc429d5dd4b0" },
  { id: "f3f51071-3c6e-49ee-a984-92d8d7af99b2", title: "A ‘democratised’ financial crisis is still a crisis", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/f3f51071-3c6e-49ee-a984-92d8d7af99b2" },
  { id: "4a26bc38-1634-4804-81f7-11124c1e3008", title: "How climate is driving new geostrategy", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/4a26bc38-1634-4804-81f7-11124c1e3008" },
  { id: "d6e40d1a-8d0c-44da-befb-9ed35de38f8a", title: "UBS concern over private markets push by manager of $1bn sustainable finance fund", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/d6e40d1a-8d0c-44da-befb-9ed35de38f8a" },
  { id: "48539819-9e46-4a98-9ef6-5db5255379c0", title: "Top UK university graduates owe the most in student loans", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/48539819-9e46-4a98-9ef6-5db5255379c0" },
  { id: "77b94c4a-4b4b-4983-9138-7db6926150f4", title: "US widens AI-driven investment gap with Europe", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/77b94c4a-4b4b-4983-9138-7db6926150f4" },
  { id: "fb2e6718-161c-4f40-8a98-983dc61d1ab2", title: "African nations join the space race", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/fb2e6718-161c-4f40-8a98-983dc61d1ab2" },
  { id: "7c88554e-8e08-4d9e-a696-daeb82817876", title: "Germany must ditch doubts over private capital, says investment tsar", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/7c88554e-8e08-4d9e-a696-daeb82817876" },
  { id: "1d310566-94ee-48e2-acfa-25de646fc41a", title: "Shein seeks $27bn valuation from Hong Kong IPO", date: "2026-08-24", time: "03:55", url: "https://www.ft.com/content/1d310566-94ee-48e2-acfa-25de646fc41a" },
  { id: "a70fda49-a76a-45bc-add7-221f7fc307db", title: "Treasury brings in expert to review business rates for UK pubs and hotels", date: "2026-08-24", time: "00:01", url: "https://www.ft.com/content/a70fda49-a76a-45bc-add7-221f7fc307db" },
  { id: "4e3c99fe-1a8d-4fb2-b99a-da1c1da4db8e", title: "Burnham to pledge support for long-range missile construction in Ukraine", date: "2026-08-24", time: "00:01", url: "https://www.ft.com/content/4e3c99fe-1a8d-4fb2-b99a-da1c1da4db8e" },
  { id: "9f72dc1b-bb4b-4672-8197-73b899a2bc5d", title: "Scottish state bank records £138mn loss on back of failed investments", date: "2026-08-24", time: "00:01", url: "https://www.ft.com/content/9f72dc1b-bb4b-4672-8197-73b899a2bc5d" },
  { id: "cb865200-1a06-40be-86a3-10ee2bb05804", title: "Scott Bessent: an economic D-Day is coming for Iran", date: "2026-08-23", time: "22:30", url: "https://www.ft.com/content/cb865200-1a06-40be-86a3-10ee2bb05804" },
  { id: "63e11e59-1f21-488a-b89b-de4abbdd7396", title: "FirstFT: Kevin Warsh seeks to calm investors’ nerves as signs of economic strain grow", date: "2026-08-23", time: "22:27", url: "https://www.ft.com/content/63e11e59-1f21-488a-b89b-de4abbdd7396" },
  { id: "40ae9cd3-fbc8-4a55-adaa-c24bc80481c9", title: "Kevin Warsh seeks to soothe investors’ nerves as signs of economic strain mount", date: "2026-08-23", time: "19:00", url: "https://www.ft.com/content/40ae9cd3-fbc8-4a55-adaa-c24bc80481c9" },
  { id: "50c666af-1979-4411-9d62-34e18cc0ecc9", title: "Yahoo, the internet’s ‘OG’, wants to win over Gen Z", date: "2026-08-23", time: "19:00", url: "https://www.ft.com/content/50c666af-1979-4411-9d62-34e18cc0ecc9" },
  { id: "252df40a-48c0-47b8-850d-698a3d7a6dfd", title: "Why every French politician is now a Gaullist", date: "2026-08-23", time: "18:58", url: "https://www.ft.com/content/252df40a-48c0-47b8-850d-698a3d7a6dfd" },
  { id: "39baf33e-3238-4923-9fe9-f1db48bb54e4", title: "Trump accused of risking more pain for Americans with Canada trade war", date: "2026-08-23", time: "18:28", url: "https://www.ft.com/content/39baf33e-3238-4923-9fe9-f1db48bb54e4" },
  { id: "6aa04f24-c216-467e-834a-7b4af3ef660e", title: "A week of keynote speeches", date: "2026-08-23", time: "18:15", url: "https://www.ft.com/content/6aa04f24-c216-467e-834a-7b4af3ef660e" },
  { id: "552b8fca-6dad-4b41-a0be-54d2cd70e3cb", title: "Keir Starmer considered letting 100,000 young Europeans come to UK every year", date: "2026-08-23", time: "15:24", url: "https://www.ft.com/content/552b8fca-6dad-4b41-a0be-54d2cd70e3cb" },
  { id: "e05718e3-fa3b-4a0f-8d85-0c7f0f826c96", title: "How worried should the bond market be about US inflation?", date: "2026-08-23", time: "15:09", url: "https://www.ft.com/content/e05718e3-fa3b-4a0f-8d85-0c7f0f826c96" },
  { id: "524004a3-d0b4-4ffd-a00d-9aa74cd734c2", title: "Healey’s first Budget is a chance for radical change", date: "2026-08-23", time: "13:00", url: "https://www.ft.com/content/524004a3-d0b4-4ffd-a00d-9aa74cd734c2" },
  { id: "14eeeead-647f-486a-a8dc-7ca2610f3d35", title: "Zelenskyy rejects election call from fired defence minister", date: "2026-08-23", time: "12:26", url: "https://www.ft.com/content/14eeeead-647f-486a-a8dc-7ca2610f3d35" },
  { id: "a4147c6b-5634-4035-b1a8-ac7bf1eb497d", title: "Government can bring robotics to life", date: "2026-08-23", time: "12:15", url: "https://www.ft.com/content/a4147c6b-5634-4035-b1a8-ac7bf1eb497d" },
  { id: "22530c4a-65b7-49f7-890d-1c8900f63853", title: "Trump’s South Korea snub raises questions in the Asia-Pacific", date: "2026-08-23", time: "12:00", url: "https://www.ft.com/content/22530c4a-65b7-49f7-890d-1c8900f63853" },
  { id: "65e41dc2-aeb6-4a2b-976a-cc3f5f990dd5", title: "Occidental tries to free itself from the messy legacy of Anadarko deal", date: "2026-08-23", time: "11:00", url: "https://www.ft.com/content/65e41dc2-aeb6-4a2b-976a-cc3f5f990dd5" },
  { id: "8ac695be-2803-4e91-84b3-9cffe2e6d0e3", title: "Burnham to allow English mayors to ‘call in’ big local planning decisions", date: "2026-08-23", time: "10:29", url: "https://www.ft.com/content/8ac695be-2803-4e91-84b3-9cffe2e6d0e3" },
  { id: "dd605c6f-8a6e-4664-970b-f4c07ea7a4d2", title: "US buyers snap up Europe’s asset managers at fastest rate in decades", date: "2026-08-23", time: "05:30", url: "https://www.ft.com/content/dd605c6f-8a6e-4664-970b-f4c07ea7a4d2" },
  { id: "c202d7aa-481a-466b-b34f-2c4451f787a5", title: "Coffee chain Blank Street raises funds from General Atlantic to fuel expansion and ice cream push", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/c202d7aa-481a-466b-b34f-2c4451f787a5" },
  { id: "ef65c99c-b58c-430c-b6be-8036f042cc1e", title: "Why is the far right so obsessed with knights?", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/ef65c99c-b58c-430c-b6be-8036f042cc1e" },
  { id: "6f664a31-ca24-4a16-a6e9-5978fdf2512c", title: "Are America’s vast Gulf bases worth rebuilding?", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/6f664a31-ca24-4a16-a6e9-5978fdf2512c" },
  { id: "be3c0c6c-0a65-4add-b675-7a5876f625be", title: "India’s reliance on Russian oil hits all-time high", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/be3c0c6c-0a65-4add-b675-7a5876f625be" },
  { id: "6fc8d072-5a2c-4431-895a-e3d4eb03329d", title: "Railway enthusiasts split over plan to restore train services in rural areas", date: "2026-08-23", time: "05:00", url: "https://www.ft.com/content/6fc8d072-5a2c-4431-895a-e3d4eb03329d" },
];
