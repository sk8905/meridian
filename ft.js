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
  { id: "31c64f1b-2ae9-427b-b350-c7aad028920c", title: "Germany’s nostalgia problem", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/31c64f1b-2ae9-427b-b350-c7aad028920c" },
  { id: "d4b4105e-d91f-48bb-820e-64290e916f5e", title: "US limits air defence time slots for tankers sailing through Hormuz", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/d4b4105e-d91f-48bb-820e-64290e916f5e" },
  { id: "50f38214-3a0a-4d6f-9838-c93611d21a0c", title: "The Ritz-Carlton purge, a $1.3bn demand and nine years trapped in Saudi Arabia", date: "2026-09-12", time: "05:00", url: "https://www.ft.com/content/50f38214-3a0a-4d6f-9838-c93611d21a0c" },
  { id: "3bafb3ae-ba94-44f0-984c-ec7c9f54a5e0", title: "Saudi Arabia shuts East-West pipeline that bypasses Hormuz after attacks", date: "2026-09-11", time: "20:20", url: "https://www.ft.com/content/3bafb3ae-ba94-44f0-984c-ec7c9f54a5e0" },
  { id: "645b8e7d-39d6-4500-b761-c9a2edbc1a37", title: "Trump’s $5,000 dividend is bad corporate finance", date: "2026-09-11", time: "18:21", url: "https://www.ft.com/content/645b8e7d-39d6-4500-b761-c9a2edbc1a37" },
  { id: "916eea1b-d483-49e1-9a70-53b4df8f9870", title: "Situational Awareness builds relationships with new brokers as it attempts rebound", date: "2026-09-11", time: "18:15", url: "https://www.ft.com/content/916eea1b-d483-49e1-9a70-53b4df8f9870" },
  { id: "fbcfcd21-f34f-41ca-b6b9-76b415f8d54e", title: "Stockpickers: Rosebank Industries, SigmaRoc, Ashmore", date: "2026-09-11", time: "18:00", url: "https://www.ft.com/content/fbcfcd21-f34f-41ca-b6b9-76b415f8d54e" },
  { id: "c3740cd0-3c4c-44d0-b3e8-4ccb1bac65b0", title: "Is Scott Bessent winning the wrong battle in markets?", date: "2026-09-11", time: "18:00", url: "https://www.ft.com/content/c3740cd0-3c4c-44d0-b3e8-4ccb1bac65b0" },
  { id: "cde3c168-5522-4d38-a6c3-454ef36aa0d4", title: "Directors’ Deals: Shell’s upstream boss takes advantage of valuation uplift", date: "2026-09-11", time: "18:00", url: "https://www.ft.com/content/cde3c168-5522-4d38-a6c3-454ef36aa0d4" },
  { id: "dd4cc4a0-844e-486a-b99c-b379d457019b", title: "Scott Bessent fails to break ‘fever’ in US bond market", date: "2026-09-11", time: "17:56", url: "https://www.ft.com/content/dd4cc4a0-844e-486a-b99c-b379d457019b" },
  { id: "3ad0a45f-ae93-4854-8b61-b933a93ee159", title: "FTAV’s Friday charts quiz", date: "2026-09-11", time: "17:54", url: "https://www.ft.com/content/3ad0a45f-ae93-4854-8b61-b933a93ee159" },
  { id: "b087d8e6-db04-4db6-8308-7275a40df5fb", title: "UK delays Jackdaw gasfield decision until after by-election in Starmer seat", date: "2026-09-11", time: "17:50", url: "https://www.ft.com/content/b087d8e6-db04-4db6-8308-7275a40df5fb" },
  { id: "e1aacb1c-45d1-4d21-b5e9-0166c12c54cd", title: "UK economy unexpectedly grew 0.4% in July boosted by AI surge", date: "2026-09-11", time: "17:40", url: "https://www.ft.com/content/e1aacb1c-45d1-4d21-b5e9-0166c12c54cd" },
  { id: "e070149c-70a4-41ee-a829-0630abb2ce35", title: "Military jet triggered UK’s latest air traffic meltdown", date: "2026-09-11", time: "17:26", url: "https://www.ft.com/content/e070149c-70a4-41ee-a829-0630abb2ce35" },
  { id: "bbdad57e-bd57-4c75-98b8-12fca7cbd268", title: "America remembers: twenty-five years after 9/11", date: "2026-09-11", time: "17:19", url: "https://www.ft.com/content/bbdad57e-bd57-4c75-98b8-12fca7cbd268" },
  { id: "b7fe0fe0-0463-4f55-9590-0a7d08d8fe66", title: "Why the AI race has its creators fearing human extinction", date: "2026-09-11", time: "17:11", url: "https://www.ft.com/content/b7fe0fe0-0463-4f55-9590-0a7d08d8fe66" },
  { id: "df2d9bcc-59f9-4122-aa4d-2020bef77e0e", title: "Iran and Gulf states to meet in push for Hormuz deal", date: "2026-09-11", time: "17:03", url: "https://www.ft.com/content/df2d9bcc-59f9-4122-aa4d-2020bef77e0e" },
  { id: "cf77ca45-6e16-4232-836b-714293619822", title: "Monetary Policy Radar preview: BoE’s September meeting", date: "2026-09-11", time: "16:34", url: "https://www.ft.com/content/cf77ca45-6e16-4232-836b-714293619822" },
  { id: "d7f197dd-a39a-43dc-a2f9-6204c5876e76", title: "How both sides lost after 9/11", date: "2026-09-11", time: "16:34", url: "https://www.ft.com/content/d7f197dd-a39a-43dc-a2f9-6204c5876e76" },
];
