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
  { id: "dc61c278-c3eb-48b5-8f79-f949eae7a601", title: "China’s Jingye demands payout over British Steel nationalisation", date: "2026-07-19", time: "11:50", url: "https://www.ft.com/content/dc61c278-c3eb-48b5-8f79-f949eae7a601" },
  { id: "8da4243f-820c-428c-bcfb-ba63dac48c1c", title: "US day traders flock to ‘the most dangerous product in crypto’", date: "2026-07-19", time: "11:10", url: "https://www.ft.com/content/8da4243f-820c-428c-bcfb-ba63dac48c1c" },
  { id: "e8e8adc5-7c56-45a8-99fc-bb5acfda263e", title: "US strikes Iran after two American troops killed in Jordan", date: "2026-07-19", time: "10:13", url: "https://www.ft.com/content/e8e8adc5-7c56-45a8-99fc-bb5acfda263e" },
  { id: "e4f7727f-b1c1-4325-b76d-366b6449cbe3", title: "GameStop extends pursuit of eBay despite Wall Street scepticism", date: "2026-07-19", time: "10:00", url: "https://www.ft.com/content/e4f7727f-b1c1-4325-b76d-366b6449cbe3" },
  { id: "99279482-ffdb-44db-bab0-e13790b3b525", title: "Is Fifa’s hyper-commercialised World Cup here to stay?", date: "2026-07-19", time: "09:05", url: "https://www.ft.com/content/99279482-ffdb-44db-bab0-e13790b3b525" },
  { id: "fde736b3-6999-4b9e-979e-2b4b06dbbd5c", title: "No longer grim up north for UK banks as Burnham comes to power", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/fde736b3-6999-4b9e-979e-2b4b06dbbd5c" },
  { id: "c5045a09-29c1-4a9b-8f5b-f8dead22b09c", title: "How Maga fell hard for the gender binary", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/c5045a09-29c1-4a9b-8f5b-f8dead22b09c" },
  { id: "9cf9b393-3ac7-4cfc-9dd1-4fc23831e6a0", title: "Chinese leaders zero in on need for stimulus for economy", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/9cf9b393-3ac7-4cfc-9dd1-4fc23831e6a0" },
  { id: "8005bed0-afab-4240-91f8-7567212f2b91", title: "Heroes, villains and clowns: Simon Kuper’s World Cup awards", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/8005bed0-afab-4240-91f8-7567212f2b91" },
  { id: "6f004c47-3be1-4245-bb8e-768268341934", title: "Can an ‘unelected’ prime minister succeed?", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/6f004c47-3be1-4245-bb8e-768268341934" },
  { id: "658e1eb4-2c33-4755-8f44-0261d24dd1b7", title: "Why ‘rightwing’ is no longer such a dirty word in Britain", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/658e1eb4-2c33-4755-8f44-0261d24dd1b7" },
  { id: "905e18e6-f054-4995-b5a7-0ff52a65ae57", title: "AI should have senior lawyers sharpening their hunting spears", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/905e18e6-f054-4995-b5a7-0ff52a65ae57" },
  { id: "3e1393cf-a256-40fc-b2e3-35544444474b", title: "The art of knowing when to step down", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/3e1393cf-a256-40fc-b2e3-35544444474b" },
  { id: "2578648c-967f-4d9d-8ec0-b22a205ece7f", title: "Luxury groups face inventory squeeze under EU destruction ban", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/2578648c-967f-4d9d-8ec0-b22a205ece7f" },
  { id: "6d817238-b2c2-475b-ae03-d71f42635f7e", title: "Friedrich Merz pitches Germany as ‘Europe’s bedrock of stability’ to investors", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/6d817238-b2c2-475b-ae03-d71f42635f7e" },
  { id: "5051d52f-00b6-408b-b322-a15c607bbf10", title: "Job crisis leaves newly qualified nurses struggling to secure roles", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/5051d52f-00b6-408b-b322-a15c607bbf10" },
  { id: "d3221c90-c2a4-4bdd-8e0d-6e069bf0ca25", title: "Singapore weighs hedge fund tax cuts to rival Hong Kong", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/d3221c90-c2a4-4bdd-8e0d-6e069bf0ca25" },
  { id: "fee3f969-f592-4735-8d99-e7ab3049d194", title: "UK seeks extradition of Andrew and Tristan Tate after arrest in Miami", date: "2026-07-19", time: "02:38", url: "https://www.ft.com/content/fee3f969-f592-4735-8d99-e7ab3049d194" },
  { id: "8f5445ab-dacb-4908-909f-277853ad0f50", title: "Burnham scraps new digital ID scheme", date: "2026-07-18", time: "21:00", url: "https://www.ft.com/content/8f5445ab-dacb-4908-909f-277853ad0f50" },
  { id: "1cb986a4-2428-4e64-a559-7867cfa1a3e3", title: "Trump to fund Maga-aligned projects in Europe as he reorders US aid", date: "2026-07-18", time: "18:22", url: "https://www.ft.com/content/1cb986a4-2428-4e64-a559-7867cfa1a3e3" },
  { id: "784a7d34-e005-4266-8bd4-82f26298b3e4", title: "Surrogacy controversy sparks resignation of Merz’s parliamentary leader", date: "2026-07-18", time: "16:29", url: "https://www.ft.com/content/784a7d34-e005-4266-8bd4-82f26298b3e4" },
  { id: "b93e063a-aba7-4dcd-9e3e-f57cab54d0f6", title: "Telecom Italia backs Poste Italiane takeover bid", date: "2026-07-18", time: "15:48", url: "https://www.ft.com/content/b93e063a-aba7-4dcd-9e3e-f57cab54d0f6" },
  { id: "44a3698f-6481-4e83-a50d-7db109768ea1", title: "Big Law braces for second fight with Donald Trump over capitulation deals", date: "2026-07-18", time: "13:00", url: "https://www.ft.com/content/44a3698f-6481-4e83-a50d-7db109768ea1" },
  { id: "2b96703d-440b-46db-8d86-9fff9ecc59d5", title: "Traders are increasingly betting against SpaceX just weeks after IPO", date: "2026-07-18", time: "12:00", url: "https://www.ft.com/content/2b96703d-440b-46db-8d86-9fff9ecc59d5" },
  { id: "1b34caa6-d909-4df8-a90f-b928f2199261", title: "Zelenskyy considers sacking commander-in-chief as protests swell", date: "2026-07-18", time: "11:10", url: "https://www.ft.com/content/1b34caa6-d909-4df8-a90f-b928f2199261" },
  { id: "bcb38f82-d552-4d8d-af1f-87a8f06ec861", title: "Chart of the Week: Chips are nearly five times as volatile as the broader market", date: "2026-07-18", time: "10:30", url: "https://www.ft.com/content/bcb38f82-d552-4d8d-af1f-87a8f06ec861" },
  { id: "047f943b-e46b-455e-8f8e-bef1b9c97708", title: "Britain’s system for avoiding electricity blackouts faces scrutiny", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/047f943b-e46b-455e-8f8e-bef1b9c97708" },
  { id: "0ac9aa5c-2807-49fc-9d7d-679b27cf3337", title: "The London IPO market isn’t as bad as it looks", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/0ac9aa5c-2807-49fc-9d7d-679b27cf3337" },
  { id: "2dc8d54c-89b7-4e57-bd43-084d9edf01a4", title: "Asia AI bets power record equities run for Wall Street banks", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/2dc8d54c-89b7-4e57-bd43-084d9edf01a4" },
  { id: "93db3195-9a17-4798-810a-0509f3ab35a3", title: "Superdrug owner considers delay to planned London IPO", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/93db3195-9a17-4798-810a-0509f3ab35a3" },
  { id: "e34cbb4d-1c40-4e71-9ef2-31b44331d642", title: "Data errors mar UK regulator’s new short selling disclosure rules", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/e34cbb4d-1c40-4e71-9ef2-31b44331d642" },
  { id: "fcbd9074-8870-4f04-b0a6-0c22a2aca70e", title: "How long until there is a US markets reckoning over Trump’s damage?", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/fcbd9074-8870-4f04-b0a6-0c22a2aca70e" },
  { id: "b4bc3868-7684-4b36-a0e0-a5bf2b606162", title: "Ageism: the silent but deadly threat to your retirement", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/b4bc3868-7684-4b36-a0e0-a5bf2b606162" },
  { id: "8c910a8f-2b8b-4234-918a-2022bdc01889", title: "How to fix the housing crisis", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/8c910a8f-2b8b-4234-918a-2022bdc01889" },
  { id: "580f2b36-1d00-40b8-a12a-cc7d7067a046", title: "Washington pushes EU to announce import rules rollback", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/580f2b36-1d00-40b8-a12a-cc7d7067a046" },
  { id: "de2978b0-481c-4af5-9e77-9e34650fb20f", title: "The next crash: why this time might not be different", date: "2026-07-18", time: "05:00", url: "https://www.ft.com/content/de2978b0-481c-4af5-9e77-9e34650fb20f" },
  { id: "fa4e24db-9324-47e2-8512-a581ca9c1aba", title: "Donald Trump threatens Canada with tariffs over ‘invasion’ of wildfire smoke", date: "2026-07-17", time: "21:56", url: "https://www.ft.com/content/fa4e24db-9324-47e2-8512-a581ca9c1aba" },
  { id: "e466df85-fa3b-4a7f-a4a1-ae04d66db99f", title: "Trump Media pitched $100,000 monthly fee for fast feed of president’s posts", date: "2026-07-17", time: "21:24", url: "https://www.ft.com/content/e466df85-fa3b-4a7f-a4a1-ae04d66db99f" },
  { id: "79a15abd-5892-4f1c-b038-b09a1ceecabb", title: "US chip stocks notch up worst week in more than a year", date: "2026-07-17", time: "21:22", url: "https://www.ft.com/content/79a15abd-5892-4f1c-b038-b09a1ceecabb" },
  { id: "9586223a-8339-4a57-9e2f-251899ebd211", title: "Apple briefly leapfrogs Nvidia as world’s most valuable company", date: "2026-07-17", time: "21:17", url: "https://www.ft.com/content/9586223a-8339-4a57-9e2f-251899ebd211" },
];
