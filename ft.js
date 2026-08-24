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
  { id: "67c74e64-5c37-4a5d-ae6c-d3c002f99628", title: "Scott Bessent threatens wider US sanctions on Iran’s economic partners", date: "2026-08-24", time: "18:30", url: "https://www.ft.com/content/67c74e64-5c37-4a5d-ae6c-d3c002f99628" },
  { id: "b0b233bd-882b-43a9-b55f-e2cf33ec09b7", title: "Andy Burnham rules out early election as he admits UK faces ‘challenging’ financial outlook", date: "2026-08-24", time: "18:24", url: "https://www.ft.com/content/b0b233bd-882b-43a9-b55f-e2cf33ec09b7" },
  { id: "d6c9e705-ef30-4896-880b-8e88941e0f58", title: "Treasury market interventions are only a band-aid", date: "2026-08-24", time: "18:16", url: "https://www.ft.com/content/d6c9e705-ef30-4896-880b-8e88941e0f58" },
  { id: "3d46e4cb-4dee-4f49-adc1-0bb0f63d4c49", title: "UK seeks to tighten security of supply chains after Iran-linked cyber attack", date: "2026-08-24", time: "18:13", url: "https://www.ft.com/content/3d46e4cb-4dee-4f49-adc1-0bb0f63d4c49" },
  { id: "063dbdd2-fb5a-4ece-9152-74e791e4835c", title: "Britain gains access to Ukraine battlefield data", date: "2026-08-24", time: "18:00", url: "https://www.ft.com/content/063dbdd2-fb5a-4ece-9152-74e791e4835c" },
  { id: "dcf20385-21a5-4328-9bc6-98a666caaaf6", title: "Meloni wants a snap election to hide her economic failures", date: "2026-08-24", time: "18:00", url: "https://www.ft.com/content/dcf20385-21a5-4328-9bc6-98a666caaaf6" },
  { id: "29f1af13-ecc3-4f26-a479-e6088c67231b", title: "US midterm elections 2026: The FT’s guide", date: "2026-08-24", time: "16:15", url: "https://www.ft.com/content/29f1af13-ecc3-4f26-a479-e6088c67231b" },
  { id: "7522bdde-49f8-4bf0-a930-6591b40eb5e4", title: "Canadian businesses fear ‘vortex of downward pressures’ from Donald Trump’s tariffs", date: "2026-08-24", time: "16:05", url: "https://www.ft.com/content/7522bdde-49f8-4bf0-a930-6591b40eb5e4" },
  { id: "5c8aaa6d-5170-4688-beeb-f1319e5ff29e", title: "How Shein’s IPO lost its shine", date: "2026-08-24", time: "16:00", url: "https://www.ft.com/content/5c8aaa6d-5170-4688-beeb-f1319e5ff29e" },
  { id: "552b8fca-6dad-4b41-a0be-54d2cd70e3cb", title: "Keir Starmer considered letting 100,000 young Europeans come to UK every year", date: "2026-08-24", time: "15:14", url: "https://www.ft.com/content/552b8fca-6dad-4b41-a0be-54d2cd70e3cb" },
  { id: "52978bad-2b91-41e3-be94-7fb6776fbb91", title: "Trump says US to increase tariffs on Canadian cars to 50%", date: "2026-08-24", time: "14:55", url: "https://www.ft.com/content/52978bad-2b91-41e3-be94-7fb6776fbb91" },
  { id: "34c145b1-651a-4725-a65f-ea594a49ea06", title: "As dieters slim down, protein prices bulk up", date: "2026-08-24", time: "14:39", url: "https://www.ft.com/content/34c145b1-651a-4725-a65f-ea594a49ea06" },
  { id: "21190130-bb8e-460e-b64c-ef1532f6c673", title: "Reform UK’s ‘Farage Fest’ went ahead without permission from council", date: "2026-08-24", time: "14:02", url: "https://www.ft.com/content/21190130-bb8e-460e-b64c-ef1532f6c673" },
  { id: "f16e4ad3-d61f-4b98-b427-c5bcb1df1972", title: "Class wars and the midterms", date: "2026-08-24", time: "14:00", url: "https://www.ft.com/content/f16e4ad3-d61f-4b98-b427-c5bcb1df1972" },
  { id: "94d78bef-d118-420b-85a0-b1e5bcaf2405", title: "FT Financial Literacy and Inclusion Campaign", date: "2026-08-24", time: "13:06", url: "https://www.ft.com/content/94d78bef-d118-420b-85a0-b1e5bcaf2405" },
  { id: "7a9f5756-bf18-4a42-80d1-653c955447aa", title: "High asset prices, not low interest rates, are driving inflation", date: "2026-08-24", time: "13:00", url: "https://www.ft.com/content/7a9f5756-bf18-4a42-80d1-653c955447aa" },
  { id: "91b3e407-daca-40b3-8572-47cf3de9dd1a", title: "French finance minister warns tax on big businesses may be extended", date: "2026-08-24", time: "12:49", url: "https://www.ft.com/content/91b3e407-daca-40b3-8572-47cf3de9dd1a" },
  { id: "f1727461-4923-4893-a625-8c63a0714d2a", title: "Cold Sunset — the entertaining return of William Boyd’s reluctant spy", date: "2026-08-24", time: "12:00", url: "https://www.ft.com/content/f1727461-4923-4893-a625-8c63a0714d2a" },
  { id: "02c73478-c32b-44e5-baab-f81b9db98f04", title: "Harry Potter and the risk of geopolitics", date: "2026-08-24", time: "11:33", url: "https://www.ft.com/content/02c73478-c32b-44e5-baab-f81b9db98f04" },
  { id: "c806d2ce-efed-47a0-9abb-508e218b62b5", title: "An offer Canada could only refuse", date: "2026-08-24", time: "11:31", url: "https://www.ft.com/content/c806d2ce-efed-47a0-9abb-508e218b62b5" },
  { id: "353032d0-4031-40fe-83ab-958d473401f0", title: "Ukraine hits Russia’s second-largest online retailer", date: "2026-08-24", time: "11:27", url: "https://www.ft.com/content/353032d0-4031-40fe-83ab-958d473401f0" },
  { id: "4e3c99fe-1a8d-4fb2-b99a-da1c1da4db8e", title: "Andy Burnham condemns Russia’s ‘outrageous threats’ to UK during Kyiv visit", date: "2026-08-24", time: "11:01", url: "https://www.ft.com/content/4e3c99fe-1a8d-4fb2-b99a-da1c1da4db8e" },
  { id: "ec7c91bb-358b-44ad-bced-8c901f7339e2", title: "South American trade bloc mounts dealmaking push to hedge geopolitical risks", date: "2026-08-24", time: "11:00", url: "https://www.ft.com/content/ec7c91bb-358b-44ad-bced-8c901f7339e2" },
  { id: "2e51b70d-fc3c-4bd5-be08-9c4dd46dca32", title: "The new world order? Every man for himself", date: "2026-08-24", time: "11:00", url: "https://www.ft.com/content/2e51b70d-fc3c-4bd5-be08-9c4dd46dca32" },
  { id: "9ebcd1d7-9959-468b-af96-987ef5bf83a8", title: "Iran threatens 46 ships in Strait of Hormuz transit crackdown", date: "2026-08-24", time: "10:48", url: "https://www.ft.com/content/9ebcd1d7-9959-468b-af96-987ef5bf83a8" },
  { id: "63e11e59-1f21-488a-b89b-de4abbdd7396", title: "FirstFT: An economic D-Day is coming for Iran", date: "2026-08-24", time: "10:33", url: "https://www.ft.com/content/63e11e59-1f21-488a-b89b-de4abbdd7396" },
  { id: "9425f056-89c0-4a6b-80c7-0de6c527d916", title: "Hedge fund Saba takes on Baillie Gifford in new board battle", date: "2026-08-24", time: "10:24", url: "https://www.ft.com/content/9425f056-89c0-4a6b-80c7-0de6c527d916" },
  { id: "7fbcf7e0-7a44-4b07-9ea1-f16b5f4946e7", title: "Policing needs independence — but politicians must still set priorities", date: "2026-08-24", time: "09:34", url: "https://www.ft.com/content/7fbcf7e0-7a44-4b07-9ea1-f16b5f4946e7" },
  { id: "38d95298-8b9b-486a-96d3-0c6616972abb", title: "Bitcoin is great (for systemic theft of aid money)", date: "2026-08-24", time: "09:04", url: "https://www.ft.com/content/38d95298-8b9b-486a-96d3-0c6616972abb" },
  { id: "edeb19be-e89c-4f86-8a9f-8875dfa4817e", title: "FTAV’s further reading", date: "2026-08-24", time: "07:37", url: "https://www.ft.com/content/edeb19be-e89c-4f86-8a9f-8875dfa4817e" },
  { id: "f160c7b8-d322-4b5f-b5c9-f6861c62e3db", title: "Thames Water creditors plan board shake-up if utility avoids nationalisation", date: "2026-08-24", time: "07:35", url: "https://www.ft.com/content/f160c7b8-d322-4b5f-b5c9-f6861c62e3db" },
  { id: "40ae9cd3-fbc8-4a55-adaa-c24bc80481c9", title: "Kevin Warsh seeks to soothe investors’ nerves as signs of economic strain mount", date: "2026-08-24", time: "07:07", url: "https://www.ft.com/content/40ae9cd3-fbc8-4a55-adaa-c24bc80481c9" },
  { id: "7f8574f5-f909-4226-b96f-5d5d9a5f0798", title: "The great re-equitisation and the dollar", date: "2026-08-24", time: "06:30", url: "https://www.ft.com/content/7f8574f5-f909-4226-b96f-5d5d9a5f0798" },
  { id: "680b2d66-5f69-497f-9cb8-9d010ae64f69", title: "European allies flock to Kyiv to pledge more defences against Russian bombardment", date: "2026-08-24", time: "06:00", url: "https://www.ft.com/content/680b2d66-5f69-497f-9cb8-9d010ae64f69" },
  { id: "35c2bdcf-110e-456a-a3c1-ba973837b9b9", title: "Analysts’ views: forecasters continue to see Fed and Bank of England on hold this year", date: "2026-08-24", time: "05:29", url: "https://www.ft.com/content/35c2bdcf-110e-456a-a3c1-ba973837b9b9" },
  { id: "b153db68-a361-4217-9cc5-b766a15c1922", title: "UK statistics agency turns to AI to cut costs and improve data", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/b153db68-a361-4217-9cc5-b766a15c1922" },
  { id: "3f25f892-2de2-40e6-9592-a7ac18682c6c", title: "AI is coming for your glasses", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/3f25f892-2de2-40e6-9592-a7ac18682c6c" },
  { id: "d6f1eb66-1684-4b4f-8e4f-cc429d5dd4b0", title: "Shell draws Exxon interest in $8bn US chemical assets sale", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/d6f1eb66-1684-4b4f-8e4f-cc429d5dd4b0" },
  { id: "f3f51071-3c6e-49ee-a984-92d8d7af99b2", title: "A ‘democratised’ financial crisis is still a crisis", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/f3f51071-3c6e-49ee-a984-92d8d7af99b2" },
  { id: "4a26bc38-1634-4804-81f7-11124c1e3008", title: "How climate is driving new geostrategy", date: "2026-08-24", time: "05:00", url: "https://www.ft.com/content/4a26bc38-1634-4804-81f7-11124c1e3008" },
];
