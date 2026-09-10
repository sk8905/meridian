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
  { id: "8313accc-1de6-48a8-b184-e5e3b20c5b19", title: "Bank of Japan must raise rates further, board member says", date: "2026-09-10", time: "05:07", url: "https://www.ft.com/content/8313accc-1de6-48a8-b184-e5e3b20c5b19" },
  { id: "e6307a83-3671-4b13-a2c7-d3a626248014", title: "Sports Exchange", date: "2026-09-10", time: "05:04", url: "https://www.ft.com/content/e6307a83-3671-4b13-a2c7-d3a626248014" },
  { id: "b77c5dd4-f9b9-451a-b184-2061288a4894", title: "The new rainmakers of European private equity", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/b77c5dd4-f9b9-451a-b184-2061288a4894" },
  { id: "6c0bdcb1-e4dc-453e-b51d-9a8ae2509203", title: "Lessons drawn from Charles Goodhart", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/6c0bdcb1-e4dc-453e-b51d-9a8ae2509203" },
  { id: "be6a9dce-2cda-447a-b78a-83486e46e8bb", title: "Debate over Swedish school model rages ahead of elections", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/be6a9dce-2cda-447a-b78a-83486e46e8bb" },
  { id: "8fe10fa2-e061-4ebe-9853-f5b7136f6e56", title: "The end of the ‘win-win’ era", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/8fe10fa2-e061-4ebe-9853-f5b7136f6e56" },
  { id: "a62199d1-9388-4735-a4f0-db519c84eb79", title: "London credit investor Arini hit by Europe’s thorniest credit trades", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/a62199d1-9388-4735-a4f0-db519c84eb79" },
  { id: "98329c45-f5b7-4885-9911-e0c8a9c83c0a", title: "IMF ditched top candidate for chief economist job over Trump tariff remarks", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/98329c45-f5b7-4885-9911-e0c8a9c83c0a" },
  { id: "bc8781ba-f785-481f-b84d-966067d1b98f", title: "Linklaters poaches top lawyer in latest Wachtell raid", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/bc8781ba-f785-481f-b84d-966067d1b98f" },
  { id: "4c61ab58-e410-4f7f-b314-83b66deb3c84", title: "Oil shock revives interest in clean hydrogen", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/4c61ab58-e410-4f7f-b314-83b66deb3c84" },
  { id: "4ba62ec5-8f81-4c39-a2f7-be9408844079", title: "Numbers returned to prison after release at ‘crisis’ levels, UK probation watchdog warns", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/4ba62ec5-8f81-4c39-a2f7-be9408844079" },
  { id: "da5e731b-3f93-45f2-a566-1d9db0e1aa5f", title: "How Ukraine’s anti-graft bureau became a ‘Sword of Damocles’", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/da5e731b-3f93-45f2-a566-1d9db0e1aa5f" },
  { id: "8acfb405-b58c-40db-b879-7dc03efe0595", title: "Fans, franchises and the big four: how private capital is targeting elite sport", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/8acfb405-b58c-40db-b879-7dc03efe0595" },
  { id: "75b94026-82a1-449a-acf2-f04dcec55d81", title: "Milei’s great free trade experiment", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/75b94026-82a1-449a-acf2-f04dcec55d81" },
  { id: "efa63c8b-bd31-4c32-afab-00096281e692", title: "EU social media ban to test fragile truce with Donald Trump", date: "2026-09-10", time: "05:00", url: "https://www.ft.com/content/efa63c8b-bd31-4c32-afab-00096281e692" },
{ id: "5f8a49b5-cded-4c6c-ba26-e33213b40ee2", title: "Hunter Biden’s $LAPTOP memecoin crashes shortly after launch", date: "2026-09-09", time: "21:06", url: "https://www.ft.com/content/5f8a49b5-cded-4c6c-ba26-e33213b40ee2" },
{ id: "6842ca4b-1a16-4a76-89b5-098cd288ffc7", title: "AI labs test the rigour of credit rating agencies", date: "2026-09-09", time: "19:02", url: "https://www.ft.com/content/6842ca4b-1a16-4a76-89b5-098cd288ffc7" },
{ id: "6b71127f-2ca3-4a6b-a268-91177b6cc981", title: "JPMorgan chief Jamie Dimon meets Andy Burnham amid Budget windfall tax fears", date: "2026-09-09", time: "18:25", url: "https://www.ft.com/content/6b71127f-2ca3-4a6b-a268-91177b6cc981" },
{ id: "e93416e8-c630-4483-8552-6efd7a54ffed", title: "The lessons of LIV Golf's failure", date: "2026-09-09", time: "18:16", url: "https://www.ft.com/content/e93416e8-c630-4483-8552-6efd7a54ffed" },
{ id: "e00e1d73-c0cb-49e5-99c5-8ca4ce219d93", title: "Windscreen giant Belron explores mega-IPO", date: "2026-09-09", time: "17:19", url: "https://www.ft.com/content/e00e1d73-c0cb-49e5-99c5-8ca4ce219d93" },
{ id: "b9e0b9b5-3b6e-420e-83da-381b75534635", title: "Tether launches private credit fund in effort to boost stablecoin use", date: "2026-09-09", time: "17:09", url: "https://www.ft.com/content/b9e0b9b5-3b6e-420e-83da-381b75534635" },
{ id: "dea481e8-d30b-4cbb-b535-5ff219c4e546", title: "New Apple CEO to unveil $2,000 folding iPhone", date: "2026-09-09", time: "16:43", url: "https://www.ft.com/content/dea481e8-d30b-4cbb-b535-5ff219c4e546" },
{ id: "2476992f-c9fe-4992-887d-f34c81c100ab", title: "US Treasury to buy back up to $6bn in long-term bonds", date: "2026-09-09", time: "16:16", url: "https://www.ft.com/content/2476992f-c9fe-4992-887d-f34c81c100ab" },
{ id: "ad209e95-c5f2-4031-b207-7abaafe75d43", title: "The curse of Jets fandom", date: "2026-09-09", time: "16:09", url: "https://www.ft.com/content/ad209e95-c5f2-4031-b207-7abaafe75d43" },
{ id: "8be9ce96-3307-43db-b755-c67f3c50be29", title: "France’s Marine Le Pen stays silent on far-right victory in German election", date: "2026-09-09", time: "16:01", url: "https://www.ft.com/content/8be9ce96-3307-43db-b755-c67f3c50be29" },
{ id: "d0557d25-78b5-45d8-bb33-d655e859d803", title: "US spy chief prepares for greater role in Russia-Ukraine talks", date: "2026-09-09", time: "15:50", url: "https://www.ft.com/content/d0557d25-78b5-45d8-bb33-d655e859d803" },
{ id: "06c80195-c7b7-4423-a4ef-90056d1864f9", title: "Serbian leader Aleksandar Vučić calls snap elections", date: "2026-09-09", time: "15:41", url: "https://www.ft.com/content/06c80195-c7b7-4423-a4ef-90056d1864f9" },
{ id: "73c6c2f1-349a-4aeb-9d90-0268e3dcdc65", title: "Police investigate Reform UK over donor sting", date: "2026-09-09", time: "15:10", url: "https://www.ft.com/content/73c6c2f1-349a-4aeb-9d90-0268e3dcdc65" },
{ id: "71dccbca-4a1f-485a-9790-28cc527cdb82", title: "US affordability tracker: the data that could decide the 2026 midterm elections", date: "2026-09-09", time: "14:05", url: "https://www.ft.com/content/71dccbca-4a1f-485a-9790-28cc527cdb82" },
{ id: "55a506e8-8cba-4d8e-bf1a-e5d3e6682677", title: "How to fix the brittleness caused by Treasury basis trades", date: "2026-09-09", time: "12:35", url: "https://www.ft.com/content/55a506e8-8cba-4d8e-bf1a-e5d3e6682677" },
{ id: "bc02e99c-c6e0-4b1e-825c-330b4646ee9e", title: "Kushner and Witkoff’s blind amateurism", date: "2026-09-09", time: "12:35", url: "https://www.ft.com/content/bc02e99c-c6e0-4b1e-825c-330b4646ee9e" },
{ id: "07e5851c-5e3b-43a8-ad23-527c0f191089", title: "Saudi Arabia’s other war enters dangerous new chapter", date: "2026-09-09", time: "12:09", url: "https://www.ft.com/content/07e5851c-5e3b-43a8-ad23-527c0f191089" },
{ id: "864ba0cd-a746-4c6b-99c3-ece80ac8be90", title: "Mariana Mazzucato: ‘I’m not talking about utopias’", date: "2026-09-09", time: "12:00", url: "https://www.ft.com/content/864ba0cd-a746-4c6b-99c3-ece80ac8be90" },
{ id: "b6f7e0f4-ab56-4c7a-9238-44d83c244298", title: "Watch live: Andy Burnham faces MPs at PMQs", date: "2026-09-09", time: "12:00", url: "https://www.ft.com/content/b6f7e0f4-ab56-4c7a-9238-44d83c244298" },
{ id: "d24c2645-cc17-4dc9-924f-e114a4e22a8d", title: "Mirrors are reaching new depths", date: "2026-09-09", time: "12:00", url: "https://www.ft.com/content/d24c2645-cc17-4dc9-924f-e114a4e22a8d" },
{ id: "bce40838-6b08-4a04-9937-627bdf64a1a9", title: "Millennium to open office in Greece after investor charm offensive", date: "2026-09-09", time: "11:58", url: "https://www.ft.com/content/bce40838-6b08-4a04-9937-627bdf64a1a9" },
{ id: "0715a142-311f-422f-a9dd-9e31bc3d7d61", title: "FirstFT: Oil hits $100 as fears rise over global supplies", date: "2026-09-09", time: "11:28", url: "https://www.ft.com/content/0715a142-311f-422f-a9dd-9e31bc3d7d61" },
{ id: "2cc88608-04b2-4dcb-8c89-698f251de170", title: "Silver Lake to merge French software groups Cegid and Silae in €10bn deal", date: "2026-09-09", time: "11:00", url: "https://www.ft.com/content/2cc88608-04b2-4dcb-8c89-698f251de170" },
{ id: "b397ced1-b9bc-4fe6-8dc7-20f0752e2591", title: "China’s giant trade surplus has an increasingly geopolitical twist", date: "2026-09-09", time: "11:00", url: "https://www.ft.com/content/b397ced1-b9bc-4fe6-8dc7-20f0752e2591" },
{ id: "81786612-93e4-4af3-8cc9-f69434872740", title: "Swedish anti-immigrant party nears government role for first time", date: "2026-09-09", time: "11:00", url: "https://www.ft.com/content/81786612-93e4-4af3-8cc9-f69434872740" },

];
