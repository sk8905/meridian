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
  { id: "d891285a-e581-45b7-8cb0-80411669c1eb", title: "Deutsche becomes first European clearing bank for renminbi", date: "2026-08-11", time: "10:00", url: "https://www.ft.com/content/d891285a-e581-45b7-8cb0-80411669c1eb" },
  { id: "a2dadec1-173f-40a9-89c0-2cf83f78de2a", title: "Donald Trump warns ditching Gianni Infantino would be ‘terrible mistake’", date: "2026-08-11", time: "09:21", url: "https://www.ft.com/content/a2dadec1-173f-40a9-89c0-2cf83f78de2a" },
  { id: "248cdbf4-b047-45d3-b543-a343135132b0", title: "Goldman Sachs staff named as suspects in Brazil investigation", date: "2026-08-11", time: "08:47", url: "https://www.ft.com/content/248cdbf4-b047-45d3-b543-a343135132b0" },
  { id: "99824437-8173-4320-b84b-242c726ab437", title: "Chinese robot maker’s IPO 5,500 times oversubscribed by retail investors", date: "2026-08-11", time: "08:12", url: "https://www.ft.com/content/99824437-8173-4320-b84b-242c726ab437" },
  { id: "ebaae3f1-2d2c-4703-8bf7-5c40684c3eee", title: "José Mourinho dishes the dirt and quotes Nietzsche in new Netflix doc", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/ebaae3f1-2d2c-4703-8bf7-5c40684c3eee" },
  { id: "ae51df74-5be1-48d3-8efc-e61f12dc9edd", title: "The American factory, a romance", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/ae51df74-5be1-48d3-8efc-e61f12dc9edd" },
  { id: "6f50d572-5c14-4085-b7cc-cb81544fb4ae", title: "Setting sail from Copenhagen . . . on a 1906 schooner", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/6f50d572-5c14-4085-b7cc-cb81544fb4ae" },
  { id: "c27150f4-24e7-4def-9461-0a4849a0ea81", title: "Investing in the forgotten lands", date: "2026-08-11", time: "06:30", url: "https://www.ft.com/content/c27150f4-24e7-4def-9461-0a4849a0ea81" },
  { id: "5e9812a7-ee70-46c2-9aa3-1a74b33a25de", title: "FTAV’s further reading", date: "2026-08-11", time: "06:30", url: "https://www.ft.com/content/5e9812a7-ee70-46c2-9aa3-1a74b33a25de" },
  { id: "a5d5239c-9206-418c-822a-ace82d47f05c", title: "Confessions of a former star M&A reporter", date: "2026-08-11", time: "06:00", url: "https://www.ft.com/content/a5d5239c-9206-418c-822a-ace82d47f05c" },
  { id: "b957441e-ac7d-4dbd-a024-3af989ef7a44", title: "FirstFT: EU border checks double waiting times", date: "2026-08-11", time: "05:31", url: "https://www.ft.com/content/b957441e-ac7d-4dbd-a024-3af989ef7a44" },
  { id: "45af4235-1bd1-4734-966a-1f513d25361c", title: "What will Warsh do to favour Main Street over Wall Street?", date: "2026-08-11", time: "05:30", url: "https://www.ft.com/content/45af4235-1bd1-4734-966a-1f513d25361c" },
  { id: "42137dd8-8fdc-4d66-b193-ca52d51bd929", title: "EU border checks double queues at major airports", date: "2026-08-11", time: "05:01", url: "https://www.ft.com/content/42137dd8-8fdc-4d66-b193-ca52d51bd929" },
  { id: "4c93c894-04b8-49dc-be41-98ae79f540f8", title: "Nvidia becomes the bank of AI", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/4c93c894-04b8-49dc-be41-98ae79f540f8" },
  { id: "2eb0a79c-f5cd-415c-9f72-3c8d576329c1", title: "How AstraZeneca’s $400bn tie-up with US rival Bristol Myers unravelled", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/2eb0a79c-f5cd-415c-9f72-3c8d576329c1" },
  { id: "884d643c-15e6-474d-99ca-6bab23811c7f", title: "German states suspend Sunday lorry ban as low Rhine levels disrupt supply chains", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/884d643c-15e6-474d-99ca-6bab23811c7f" },
  { id: "763128ff-8287-49f7-8369-039822f3bbfb", title: "Carbon tax will hit EU’s budget airlines where it hurts", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/763128ff-8287-49f7-8369-039822f3bbfb" },
  { id: "291635b9-b401-47ed-a1aa-c9879147b883", title: "Banks’ refusal to take on crypto firms risks stunting UK industry’s growth, lawmakers say", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/291635b9-b401-47ed-a1aa-c9879147b883" },
  { id: "b6680b19-183d-4758-8e2c-8f7ec0be79a4", title: "Morocco’s two-speed economy leaves young workers behind", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/b6680b19-183d-4758-8e2c-8f7ec0be79a4" },
  { id: "7c13bb4b-9f9f-40fe-b77b-b874a8285b92", title: "Spain’s migrant amnesty a ‘very bad idea’, says Swedish PM", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/7c13bb4b-9f9f-40fe-b77b-b874a8285b92" },
  { id: "45241ea6-b01e-4077-938c-a47a14d8fcdc", title: "The activists battling solar panel cowboy installers", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/45241ea6-b01e-4077-938c-a47a14d8fcdc" },
  { id: "9254c73f-ac4f-47c0-ba0e-bece705036df", title: "Canary Wharf boom fuels row over council’s unspent developer funds", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/9254c73f-ac4f-47c0-ba0e-bece705036df" },
  { id: "02e29d7f-9e3e-4977-a5d3-ea3f2d9efd10", title: "Can a 30-person start-up build Britain’s answer to OpenAI?", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/02e29d7f-9e3e-4977-a5d3-ea3f2d9efd10" },
  { id: "dee4bd2c-fbad-4713-9b14-22d441967ce4", title: "The AI threat to India’s IT jobs machine", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/dee4bd2c-fbad-4713-9b14-22d441967ce4" },
  { id: "76be8ae0-ecad-4e47-a168-2f2ceaf64eb2", title: "Why the BoE needs more parliamentary attention", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/76be8ae0-ecad-4e47-a168-2f2ceaf64eb2" },
  { id: "6069de36-4e15-4b5f-b9e1-dd85c2b29673", title: "Does Africa have too few people?", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/6069de36-4e15-4b5f-b9e1-dd85c2b29673" },
  { id: "d5abcd42-b3b4-4241-8fd1-1c53217ea81e", title: "Maga ignores the many meanings of Mount Rushmore", date: "2026-08-11", time: "05:00", url: "https://www.ft.com/content/d5abcd42-b3b4-4241-8fd1-1c53217ea81e" },
  { id: "8f16a902-3e80-462c-add8-b841494d1808", title: "AI will boost oil and gas production more than green energy, report finds", date: "2026-08-10", time: "18:38", url: "https://www.ft.com/content/8f16a902-3e80-462c-add8-b841494d1808" },
  { id: "63718844-91f6-46c9-beae-fc3906f4dbb4", title: "Ukraine needs more help in the battle of the sky", date: "2026-08-10", time: "18:32", url: "https://www.ft.com/content/63718844-91f6-46c9-beae-fc3906f4dbb4" },
  { id: "ba95957a-e4fa-4caf-8ddb-ad0e203eef29", title: "Glencore-backed group looks to rescue cobalt refiner Sherritt", date: "2026-08-10", time: "18:12", url: "https://www.ft.com/content/ba95957a-e4fa-4caf-8ddb-ad0e203eef29" },
  { id: "689c0487-af77-4e18-8b63-fa26ed373ce8", title: "FanDuel and DraftKings hedge their bets with a predictions pivot", date: "2026-08-10", time: "17:48", url: "https://www.ft.com/content/689c0487-af77-4e18-8b63-fa26ed373ce8" },
  { id: "98a8fd17-15b6-4f67-9cb4-825722b11348", title: "Wall Street giants partner with Nvidia on $500bn AI financing deal", date: "2026-08-10", time: "17:41", url: "https://www.ft.com/content/98a8fd17-15b6-4f67-9cb4-825722b11348" },
  { id: "49103d68-85be-4af6-9dfd-90d66dc78f38", title: "Jeff Bezos investor group closing in on Liverpool FC stake", date: "2026-08-10", time: "15:29", url: "https://www.ft.com/content/49103d68-85be-4af6-9dfd-90d66dc78f38" },
  { id: "d7eb9cd2-7eb9-4c31-8f8d-59446f0f1743", title: "The ICC is all the women of Afghanistan have left", date: "2026-08-10", time: "15:23", url: "https://www.ft.com/content/d7eb9cd2-7eb9-4c31-8f8d-59446f0f1743" },
  { id: "62d3a32d-8a38-4136-b32c-36f25099b91f", title: "Shein IPO pitched to investors at sub-$30bn valuation", date: "2026-08-10", time: "15:15", url: "https://www.ft.com/content/62d3a32d-8a38-4136-b32c-36f25099b91f" },
  { id: "061a0cf8-f40d-4c9d-b173-a9ef78ff9daa", title: "Comms trouble", date: "2026-08-10", time: "14:30", url: "https://www.ft.com/content/061a0cf8-f40d-4c9d-b173-a9ef78ff9daa" },
  { id: "c1715272-ed0b-4494-b45b-9c94289beadd", title: "Wildfire smoke threatens to cloud the ‘Pure Michigan’ brand", date: "2026-08-10", time: "14:19", url: "https://www.ft.com/content/c1715272-ed0b-4494-b45b-9c94289beadd" },
  { id: "a0a07cce-6d19-4b1e-a73b-9855a06ba7b3", title: "Just how big is the hidden leverage of AI hyperscalers?", date: "2026-08-10", time: "13:27", url: "https://www.ft.com/content/a0a07cce-6d19-4b1e-a73b-9855a06ba7b3" },
  { id: "eeeb2fbe-990f-4a9c-bd61-62613b6e0e52", title: "Arrival of 230 people in single boat shows smuggling gangs’ ‘reckless’ tactics, says UK’s Home Office", date: "2026-08-10", time: "13:23", url: "https://www.ft.com/content/eeeb2fbe-990f-4a9c-bd61-62613b6e0e52" },
  { id: "47d2ab3c-0423-49ed-89ca-68683761ed98", title: "Yen sinks as effect of US-Japan intervention fades", date: "2026-08-10", time: "13:13", url: "https://www.ft.com/content/47d2ab3c-0423-49ed-89ca-68683761ed98" },
  { id: "1a7a6919-b056-4155-9520-1088564f7119", title: "Trump and the failure of the Fafo doctrine", date: "2026-08-10", time: "12:51", url: "https://www.ft.com/content/1a7a6919-b056-4155-9520-1088564f7119" },
];
