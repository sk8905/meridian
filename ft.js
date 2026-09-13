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
  { id: "183569b4-8102-4b38-8a20-a3597a442f26", title: "Boom-era PE funds will fall short on promises, executives warn", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/183569b4-8102-4b38-8a20-a3597a442f26" },
  { id: "b081fc93-3eb8-4adc-84cc-b5c5cf719003", title: "Sunderland football club looks to US post-industrial peers in bid to lift revenue", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/b081fc93-3eb8-4adc-84cc-b5c5cf719003" },
  { id: "7f01b434-0209-4783-b8eb-5a095ca5bd4f", title: "How Russia’s new drones are changing the air war", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/7f01b434-0209-4783-b8eb-5a095ca5bd4f" },
  { id: "65181a27-bea2-4ac0-96df-2d0d8dfe0b58", title: "As Europe’s memory fades, radicalism is returning", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/65181a27-bea2-4ac0-96df-2d0d8dfe0b58" },
  { id: "681a9df8-ab39-4b9f-bc86-7dcf6f68a8c0", title: "Paris and Beirut push to extend UN peacekeepers’ mission in Lebanon", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/681a9df8-ab39-4b9f-bc86-7dcf6f68a8c0" },
  { id: "a4a22443-2082-409b-96e1-650c44a40f44", title: "CVC faces shareholder revolt over €10.7bn Recordati take-private", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/a4a22443-2082-409b-96e1-650c44a40f44" },
  { id: "f3ecfe7f-25df-434f-a61d-a9ce0ac1e611", title: "Why Britain’s super-rich are looking for the exit", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/f3ecfe7f-25df-434f-a61d-a9ce0ac1e611" },
  { id: "c765f312-e698-4d31-bf71-f64a656ad6f4", title: "Elon Musk’s secretive backer builds $40bn SpaceX stake", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/c765f312-e698-4d31-bf71-f64a656ad6f4" },
  { id: "7752631b-6064-4f90-b292-5425064dbaa8", title: "German military start-up seeks carmakers’ help to re-arm Europe", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/7752631b-6064-4f90-b292-5425064dbaa8" },
  { id: "5d15de64-49cc-4b6a-a2ea-51061f1cddc7", title: "GP data quietly added to Palantir’s NHS data platform", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/5d15de64-49cc-4b6a-a2ea-51061f1cddc7" },
  { id: "7181577b-345d-46f4-908d-294a23fe488e", title: "US pressure on development banks to scrap climate finance goals", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/7181577b-345d-46f4-908d-294a23fe488e" },
  { id: "3efbd9a2-ccd0-4c98-8e97-8ab3358fd2f3", title: "The OBR needs to give us more clarity on migration", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/3efbd9a2-ccd0-4c98-8e97-8ab3358fd2f3" },
  { id: "2f3d996e-b320-48c5-b4a7-967ddffeb360", title: "US-listed Equinix faces challenge over South African hyperscale data centre", date: "2026-09-13", time: "05:00", url: "https://www.ft.com/content/2f3d996e-b320-48c5-b4a7-967ddffeb360" },
  { id: "fa47c0db-18a6-45d6-b35d-75942a0daae8", title: "Benchmarking and bonuses: why Singapore pays its politicians like bankers", date: "2026-09-13", time: "04:39", url: "https://www.ft.com/content/fa47c0db-18a6-45d6-b35d-75942a0daae8" },
  { id: "4dbba9b1-26ab-448c-acb3-215ecd9609ca", title: "Private equity plans to put the swing back into Japan’s golf tour", date: "2026-09-13", time: "03:50", url: "https://www.ft.com/content/4dbba9b1-26ab-448c-acb3-215ecd9609ca" },
  { id: "8d8b5195-e16f-457e-ae77-f6e843934058", title: "Burnham resists calls to reform student loans in Budget", date: "2026-09-13", time: "00:01", url: "https://www.ft.com/content/8d8b5195-e16f-457e-ae77-f6e843934058" },
  { id: "05e61eb8-9273-4b9a-a356-47f525b7d506", title: "Larry Ellison cancels $7.5bn Oracle share sale", date: "2026-09-12", time: "18:18", url: "https://www.ft.com/content/05e61eb8-9273-4b9a-a356-47f525b7d506" },
  { id: "b7fe0fe0-0463-4f55-9590-0a7d08d8fe66", title: "Why the AI race has its creators fearing human extinction", date: "2026-09-12", time: "17:38", url: "https://www.ft.com/content/b7fe0fe0-0463-4f55-9590-0a7d08d8fe66" },
  { id: "6a173e7c-cfe8-4ab8-8c8f-b90871cc907e", title: "India’s central bank tells Tata Sons to take conglomerate public", date: "2026-09-12", time: "17:20", url: "https://www.ft.com/content/6a173e7c-cfe8-4ab8-8c8f-b90871cc907e" },
  { id: "f32bef26-d2b8-47a6-b938-3dcd5e870685", title: "Brics push for Gulf peace as war worries mount", date: "2026-09-12", time: "15:34", url: "https://www.ft.com/content/f32bef26-d2b8-47a6-b938-3dcd5e870685" },
  { id: "70bd4f6c-a5f4-4e59-b773-614f0a5efd58", title: "Trump says united Ireland ‘inevitable’ and ‘a very cool thing’", date: "2026-09-12", time: "13:56", url: "https://www.ft.com/content/70bd4f6c-a5f4-4e59-b773-614f0a5efd58" },
  { id: "936ac952-43a6-44d5-be69-afa344e042f5", title: "Reform UK receives two record £36mn donations", date: "2026-09-12", time: "13:25", url: "https://www.ft.com/content/936ac952-43a6-44d5-be69-afa344e042f5" },
  { id: "4dc6710b-7911-44c6-b57a-2fb47b6b04ed", title: "Canada seeks $1tn from investors looking for a haven from Donald Trump", date: "2026-09-12", time: "11:00", url: "https://www.ft.com/content/4dc6710b-7911-44c6-b57a-2fb47b6b04ed" },
  { id: "be8d08d3-e3c1-413c-ab6e-5a38b19ce4b6", title: "Chart of the Week: the long shadow of quantitative easing", date: "2026-09-12", time: "10:30", url: "https://www.ft.com/content/be8d08d3-e3c1-413c-ab6e-5a38b19ce4b6" },
  { id: "d5584fd7-cc24-4d3e-813f-c65f041e2d0e", title: "LIV Golf’s bleak future shifts to the courtroom", date: "2026-09-12", time: "09:00", url: "https://www.ft.com/content/d5584fd7-cc24-4d3e-813f-c65f041e2d0e" },
  { id: "724f8ecb-1e2b-4c7f-bbb6-14239abd50dd", title: "We are setting up a generation to fail at school", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/724f8ecb-1e2b-4c7f-bbb6-14239abd50dd" },
  { id: "df60c0df-cd78-4dca-893b-1add0023e7e2", title: "Sweden’s election frontrunner faces tightening race", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/df60c0df-cd78-4dca-893b-1add0023e7e2" },
  { id: "b7a64635-2dcd-4d07-be75-47cd682b59e1", title: "Why I, a non-billionaire, am not leaving the UK", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/b7a64635-2dcd-4d07-be75-47cd682b59e1" },
  { id: "0e25f645-4e80-4299-a6b6-c09c7d459871", title: "Windshield megadeal could fix Europe’s broken IPO window", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/0e25f645-4e80-4299-a6b6-c09c7d459871" },
  { id: "36dbe7cd-baa9-4474-9d31-14af67278a14", title: "Nick Train’s trust offers buyback in bid to boost weak share price", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/36dbe7cd-baa9-4474-9d31-14af67278a14" },
  { id: "a83e620a-bb72-478a-ac77-10635ec653bd", title: "High oil prices could force ECB to raise rates further, warns top policymaker", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/a83e620a-bb72-478a-ac77-10635ec653bd" },
  { id: "4ee10e45-072d-40bc-a773-bcaa5539c7af", title: "Why the British glass industry could be Number 10 North’s first major test", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/4ee10e45-072d-40bc-a773-bcaa5539c7af" },
  { id: "6fa49d3c-e7b9-4bcd-9eb1-b737ff0c552e", title: "South Korea arms itself to protect chip secrets from foreign spies", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/6fa49d3c-e7b9-4bcd-9eb1-b737ff0c552e" },
  { id: "9040a3b5-c2a9-40ce-b7f2-c192453a7fd0", title: "St James’s Place looks to reassure advisers following departures", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/9040a3b5-c2a9-40ce-b7f2-c192453a7fd0" },
  { id: "ac02d67e-4576-48d9-b50f-69b38294ae67", title: "Exorbitant tennis tickets are the price of the sport’s success", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/ac02d67e-4576-48d9-b50f-69b38294ae67" },
  { id: "14f69775-f842-450c-ba18-e16812348499", title: "It’s time to scrap the triple lock", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/14f69775-f842-450c-ba18-e16812348499" },
  { id: "6a5f7e88-d778-41d7-b53d-d9ac49f52f99", title: "European investment in LatAm stocks hits 15-year peak", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/6a5f7e88-d778-41d7-b53d-d9ac49f52f99" },
  { id: "dcfe97fe-8935-497f-abfb-c51973614458", title: "Chinese crypto investor was seller of £190mn London mansion", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/dcfe97fe-8935-497f-abfb-c51973614458" },
  { id: "294b1de0-b055-4703-b3f6-975f179aad54", title: "Booming Brics payments systems seek more cross-border links", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/294b1de0-b055-4703-b3f6-975f179aad54" },
  { id: "34a0b3fa-1cd4-4743-8e28-3996836610ca", title: "The perils of prediction markets", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/34a0b3fa-1cd4-4743-8e28-3996836610ca" },
  { id: "4ac10680-bc93-4ab2-b010-d9844e7b8bdd", title: "MFS administrator steps down amid creditor pressure", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/4ac10680-bc93-4ab2-b010-d9844e7b8bdd" },
];
