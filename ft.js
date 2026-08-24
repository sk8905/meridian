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
  { id: "21190130-bb8e-460e-b64c-ef1532f6c673", title: "Reform UK’s ‘Farage Fest’ went ahead without permission from council", date: "2026-08-24", time: "14:02", url: "https://www.ft.com/content/21190130-bb8e-460e-b64c-ef1532f6c673" },
  { id: "f16e4ad3-d61f-4b98-b427-c5bcb1df1972", title: "Class wars and the midterms", date: "2026-08-24", time: "14:00", url: "https://www.ft.com/content/f16e4ad3-d61f-4b98-b427-c5bcb1df1972" },
  { id: "94d78bef-d118-420b-85a0-b1e5bcaf2405", title: "FT Financial Literacy and Inclusion Campaign", date: "2026-08-24", time: "13:06", url: "https://www.ft.com/content/94d78bef-d118-420b-85a0-b1e5bcaf2405" },
  { id: "7a9f5756-bf18-4a42-80d1-653c955447aa", title: "High asset prices, not low interest rates, are driving inflation", date: "2026-08-24", time: "13:00", url: "https://www.ft.com/content/7a9f5756-bf18-4a42-80d1-653c955447aa" },
  { id: "91b3e407-daca-40b3-8572-47cf3de9dd1a", title: "French finance minister warns tax on big businesses may be extended", date: "2026-08-24", time: "12:49", url: "https://www.ft.com/content/91b3e407-daca-40b3-8572-47cf3de9dd1a" },
  { id: "02c73478-c32b-44e5-baab-f81b9db98f04", title: "Harry Potter and the risk of geopolitics", date: "2026-08-24", time: "11:33", url: "https://www.ft.com/content/02c73478-c32b-44e5-baab-f81b9db98f04" },
  { id: "c806d2ce-efed-47a0-9abb-508e218b62b5", title: "An offer Canada could only refuse", date: "2026-08-24", time: "11:31", url: "https://www.ft.com/content/c806d2ce-efed-47a0-9abb-508e218b62b5" },
  { id: "353032d0-4031-40fe-83ab-958d473401f0", title: "Ukraine hits Russia’s second-largest online retailer", date: "2026-08-24", time: "11:27", url: "https://www.ft.com/content/353032d0-4031-40fe-83ab-958d473401f0" },
  { id: "ec7c91bb-358b-44ad-bced-8c901f7339e2", title: "South American trade bloc mounts dealmaking push to hedge geopolitical risks", date: "2026-08-24", time: "11:00", url: "https://www.ft.com/content/ec7c91bb-358b-44ad-bced-8c901f7339e2" },
  { id: "2e51b70d-fc3c-4bd5-be08-9c4dd46dca32", title: "The new world order? Every man for himself", date: "2026-08-24", time: "11:00", url: "https://www.ft.com/content/2e51b70d-fc3c-4bd5-be08-9c4dd46dca32" },
  { id: "9ebcd1d7-9959-468b-af96-987ef5bf83a8", title: "Iran threatens 46 ships in Strait of Hormuz transit crackdown", date: "2026-08-24", time: "10:48", url: "https://www.ft.com/content/9ebcd1d7-9959-468b-af96-987ef5bf83a8" },
  { id: "9425f056-89c0-4a6b-80c7-0de6c527d916", title: "Hedge fund Saba takes on Baillie Gifford in new board battle", date: "2026-08-24", time: "10:24", url: "https://www.ft.com/content/9425f056-89c0-4a6b-80c7-0de6c527d916" },
  { id: "7fbcf7e0-7a44-4b07-9ea1-f16b5f4946e7", title: "Policing needs independence — but politicians must still set priorities", date: "2026-08-24", time: "09:34", url: "https://www.ft.com/content/7fbcf7e0-7a44-4b07-9ea1-f16b5f4946e7" },
  { id: "38d95298-8b9b-486a-96d3-0c6616972abb", title: "Bitcoin is great (for systemic theft of aid money)", date: "2026-08-24", time: "09:04", url: "https://www.ft.com/content/38d95298-8b9b-486a-96d3-0c6616972abb" },
  { id: "edeb19be-e89c-4f86-8a9f-8875dfa4817e", title: "FTAV’s further reading", date: "2026-08-24", time: "07:37", url: "https://www.ft.com/content/edeb19be-e89c-4f86-8a9f-8875dfa4817e" },
  { id: "f160c7b8-d322-4b5f-b5c9-f6861c62e3db", title: "Thames Water creditors plan board shake-up if utility avoids nationalisation", date: "2026-08-24", time: "07:35", url: "https://www.ft.com/content/f160c7b8-d322-4b5f-b5c9-f6861c62e3db" },
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
  { id: "50c666af-1979-4411-9d62-34e18cc0ecc9", title: "Yahoo, the internet’s ‘OG’, wants to win over Gen Z", date: "2026-08-23", time: "19:00", url: "https://www.ft.com/content/50c666af-1979-4411-9d62-34e18cc0ecc9" },
  { id: "252df40a-48c0-47b8-850d-698a3d7a6dfd", title: "Why every French politician is now a Gaullist", date: "2026-08-23", time: "18:58", url: "https://www.ft.com/content/252df40a-48c0-47b8-850d-698a3d7a6dfd" },
  { id: "39baf33e-3238-4923-9fe9-f1db48bb54e4", title: "Trump accused of risking more pain for Americans with Canada trade war", date: "2026-08-23", time: "18:28", url: "https://www.ft.com/content/39baf33e-3238-4923-9fe9-f1db48bb54e4" },
  { id: "6aa04f24-c216-467e-834a-7b4af3ef660e", title: "A week of keynote speeches", date: "2026-08-23", time: "18:15", url: "https://www.ft.com/content/6aa04f24-c216-467e-834a-7b4af3ef660e" },
  { id: "552b8fca-6dad-4b41-a0be-54d2cd70e3cb", title: "Keir Starmer considered letting 100,000 young Europeans come to UK every year", date: "2026-08-23", time: "15:24", url: "https://www.ft.com/content/552b8fca-6dad-4b41-a0be-54d2cd70e3cb" },
];
