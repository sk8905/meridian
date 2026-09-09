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
  { id: "464142c6-7ba6-4bdb-83ca-6a4f18da4d96", title: "How to make your retirement less of a (fiscal) drag", date: "2026-09-09", time: "11:00", url: "https://www.ft.com/content/464142c6-7ba6-4bdb-83ca-6a4f18da4d96" },
  { id: "6495f82b-f6ce-4ecf-b568-cd925357c8e9", title: "The hot curls of Eunnam Hong", date: "2026-09-09", time: "11:00", url: "https://www.ft.com/content/6495f82b-f6ce-4ecf-b568-cd925357c8e9" },
  { id: "b66ff736-528b-4e3e-a43a-f06749d01991", title: "Thiel-backed start-up to mass-produce ‘deep strike’ missiles in Europe and US", date: "2026-09-09", time: "10:53", url: "https://www.ft.com/content/b66ff736-528b-4e3e-a43a-f06749d01991" },
  { id: "d7418474-5d7d-4b4f-a496-72fa5ee20046", title: "Lessons from England’s school success story", date: "2026-09-09", time: "09:30", url: "https://www.ft.com/content/d7418474-5d7d-4b4f-a496-72fa5ee20046" },
  { id: "38d718f6-110b-4822-9403-f7d12a48cfa8", title: "'I am the house now': Bessent warns currency traders not to bet against yen", date: "2026-09-09", time: "09:26", url: "https://www.ft.com/content/38d718f6-110b-4822-9403-f7d12a48cfa8" },
  { id: "88614cc3-6769-47c2-8fcb-76784cef5fca", title: "UK airports warn of further travel disruption", date: "2026-09-09", time: "08:43", url: "https://www.ft.com/content/88614cc3-6769-47c2-8fcb-76784cef5fca" },
  { id: "c8921e49-1d06-4d27-ab38-7a1d8e3d43fe", title: "Oil hits $100 for first time since July", date: "2026-09-09", time: "08:19", url: "https://www.ft.com/content/c8921e49-1d06-4d27-ab38-7a1d8e3d43fe" },
  { id: "b460b828-6183-4914-9140-5dfb6d61312c", title: "Oil nears $100 as US launches new strikes on Iranian tankers", date: "2026-09-09", time: "08:13", url: "https://www.ft.com/content/b460b828-6183-4914-9140-5dfb6d61312c" },
  { id: "fe0cbcfc-b351-4dac-889f-7b8f11f79102", title: "Norway’s oil fund says what everyone is thinking", date: "2026-09-09", time: "06:30", url: "https://www.ft.com/content/fe0cbcfc-b351-4dac-889f-7b8f11f79102" },
  { id: "8e950485-7962-4de6-a5b8-a14612e37f7a", title: "FTAV’s further reading", date: "2026-09-09", time: "06:30", url: "https://www.ft.com/content/8e950485-7962-4de6-a5b8-a14612e37f7a" },
  { id: "33d4674f-31db-4551-9ad3-c43d5c94c94c", title: "The clock is ticking on Senegal’s ‘total return swaps’", date: "2026-09-09", time: "06:00", url: "https://www.ft.com/content/33d4674f-31db-4551-9ad3-c43d5c94c94c" },
  { id: "560e1c8b-f163-4fd6-b604-e905550ac870", title: "Anthropic withheld latest AI model from UK testing agency", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/560e1c8b-f163-4fd6-b604-e905550ac870" },
  { id: "e58008a5-d757-4570-af08-d2396f46f03f", title: "Warsh might yet be a good Fed chair", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/e58008a5-d757-4570-af08-d2396f46f03f" },
  { id: "fe1cbd53-eeb8-4916-a4e0-4325b5bea425", title: "BP and Shell’s strategy counterpoint", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/fe1cbd53-eeb8-4916-a4e0-4325b5bea425" },
  { id: "6f71552b-0a1a-46d2-93d0-dc676aeed75b", title: "McLaren to create 1,000 UK jobs in product overhaul", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/6f71552b-0a1a-46d2-93d0-dc676aeed75b" },
  { id: "6525cf15-0cf0-4fff-a3a4-298a41569d97", title: "World’s biggest relationship? Xi and Modi look to rebuild ties for 2.8bn people", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/6525cf15-0cf0-4fff-a3a4-298a41569d97" },
  { id: "ef6d5693-a5b0-445a-8f30-d514d50651e1", title: "Who is voting for the far-right Alternative for Germany?", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/ef6d5693-a5b0-445a-8f30-d514d50651e1" },
  { id: "a60fe9fe-3905-44c0-ad32-07762cf44786", title: "How Greece is wooing hedge funds", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/a60fe9fe-3905-44c0-ad32-07762cf44786" },
  { id: "fb189d81-e5ce-4aba-8707-53c88dae6e60", title: "AI borrowing boom shakes up Swiss credit market", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/fb189d81-e5ce-4aba-8707-53c88dae6e60" },
  { id: "bc814c67-2371-4d0b-b44d-1539328e5f90", title: "Is the modern economy a bit too . . . samey?", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/bc814c67-2371-4d0b-b44d-1539328e5f90" },
  { id: "e7a86df3-cf29-48d1-9ae9-c65effccdbd8", title: "What will the new cohabitation proposals mean for me?", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/e7a86df3-cf29-48d1-9ae9-c65effccdbd8" },
];
