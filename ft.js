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
  { id: "3cf6c88e-bd65-4d81-a93b-437e00f9ce3f", title: "How France and Luxembourg fatally wounded the EU’s Russia sanctions regime", date: "2026-09-22", time: "06:00", url: "https://www.ft.com/content/3cf6c88e-bd65-4d81-a93b-437e00f9ce3f" },
  { id: "a0d1351f-0f16-4994-a71e-c9b134d70d71", title: "The USS lesson plan", date: "2026-09-22", time: "06:00", url: "https://www.ft.com/content/a0d1351f-0f16-4994-a71e-c9b134d70d71" },
  { id: "51c49052-0799-4920-9189-8399f15c1f51", title: "China’s share of global container exports soars to 40%", date: "2026-09-22", time: "05:56", url: "https://www.ft.com/content/51c49052-0799-4920-9189-8399f15c1f51" },
  { id: "b77f3320-6ff0-4be6-a480-a755c754f7d8", title: "FirstFT: Kremlin-backed forgery scheme fooled global banks", date: "2026-09-22", time: "05:31", url: "https://www.ft.com/content/b77f3320-6ff0-4be6-a480-a755c754f7d8" },
  { id: "17a26bbd-ef8c-4f97-8485-5b1407bb0b41", title: "Bank of Japan set to maintain new quarterly pace of rate rises", date: "2026-09-22", time: "05:30", url: "https://www.ft.com/content/17a26bbd-ef8c-4f97-8485-5b1407bb0b41" },
  { id: "cfb43c8b-04d4-4c22-b03c-8ba210a7870a", title: "David Ellison slays foes of his $110bn goliath", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/cfb43c8b-04d4-4c22-b03c-8ba210a7870a" },
  { id: "db043fc4-c810-4834-bd6b-878d5960c630", title: "Putin’s ‘war heroes’ form new political elite in Russian parliament", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/db043fc4-c810-4834-bd6b-878d5960c630" },
  { id: "9bea08f4-c9e8-450a-9d0f-0af0bf47b64e", title: "What Xi Jinping wants from his summit with Donald Trump", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/9bea08f4-c9e8-450a-9d0f-0af0bf47b64e" },
  { id: "d773c1d5-b515-48d7-9713-14c253972e3a", title: "Deutsche Bank’s asset manager explores curbs on German property funds", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/d773c1d5-b515-48d7-9713-14c253972e3a" },
  { id: "d96c37bb-0b9b-4b2f-a6f7-4dbfce047d81", title: "Rate rises should not be ‘the only game in town’", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/d96c37bb-0b9b-4b2f-a6f7-4dbfce047d81" },
  { id: "7405f173-a962-464e-8889-6b68a6fae71e", title: "Equal pay law cannot ignore the labour market", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/7405f173-a962-464e-8889-6b68a6fae71e" },
  { id: "b891fa54-b901-45fe-a78d-1161424c0da9", title: "Germany’s economic recovery is under way if politics doesn’t spoil it", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/b891fa54-b901-45fe-a78d-1161424c0da9" },
  { id: "3c494ae7-67b3-4ca1-a9e2-f3a8356bc0a4", title: "Merz’s woes cast doubt over EU’s €2tn budget deal", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/3c494ae7-67b3-4ca1-a9e2-f3a8356bc0a4" },
  { id: "f11485ba-39fb-422c-b0ff-5e71e1fe4f44", title: "Betting on the yen: the risks of the carry trade", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/f11485ba-39fb-422c-b0ff-5e71e1fe4f44" },
  { id: "5b019594-5b20-479a-8549-7b564127eb3f", title: "London’s schools are running out of children", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/5b019594-5b20-479a-8549-7b564127eb3f" },
  { id: "60870960-f433-48ca-bc2c-708686a69ae7", title: "AI staff complain of mental toll over fears of threat to society", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/60870960-f433-48ca-bc2c-708686a69ae7" },
  { id: "57662705-13e3-4aaa-b8a6-951b954a46b1", title: "Sorry Carney, the world does need a great power with better manners", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/57662705-13e3-4aaa-b8a6-951b954a46b1" },
  { id: "bbfb7316-a660-4428-9918-8f275338a4d4", title: "Why Andy Burnham’s ‘Buy British’ push could backfire", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/bbfb7316-a660-4428-9918-8f275338a4d4" },
  { id: "ec52d0ab-3f68-476f-b308-b8e682d9c75b", title: "Polymarket starts European lobbying blitz to win over financial watchdogs", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/ec52d0ab-3f68-476f-b308-b8e682d9c75b" },
  { id: "8576e3d2-6fe3-4bfe-af16-10edb76ac8bf", title: "Why Blackstone’s latest plans at Lloyd’s of London have sparked a firestorm", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/8576e3d2-6fe3-4bfe-af16-10edb76ac8bf" },
  { id: "a7aa2544-c328-40ef-87e2-488975a79f57", title: "US officials move to rein in utility profits as power bills rise", date: "2026-09-22", time: "05:00", url: "https://www.ft.com/content/a7aa2544-c328-40ef-87e2-488975a79f57" },
  { id: "3848a4ad-1426-4352-ba86-ef1279c4ffd1", title: "Kremlin-backed forgery scheme moved $6.9bn through global banks", date: "2026-09-21", time: "21:00", url: "https://www.ft.com/content/3848a4ad-1426-4352-ba86-ef1279c4ffd1" },
  { id: "789c2d18-d6ce-4556-bbfb-877233b12aee", title: "UK homeowners take £840-a-year mortgage hit from Iran war", date: "2026-09-21", time: "21:00", url: "https://www.ft.com/content/789c2d18-d6ce-4556-bbfb-877233b12aee" },
  { id: "a1e0707a-326a-4c7c-a608-d73abab32d82", title: "Five UK police forces end Palantir project after two years", date: "2026-09-21", time: "19:25", url: "https://www.ft.com/content/a1e0707a-326a-4c7c-a608-d73abab32d82" },
  { id: "319c7b67-b585-407e-a0da-6e23b1612180", title: "Top Republicans tell Donald Trump to ban US diesel exports ahead of midterms", date: "2026-09-21", time: "19:15", url: "https://www.ft.com/content/319c7b67-b585-407e-a0da-6e23b1612180" },
  { id: "f0b37ddf-3a4f-4631-b664-887b0cdd281c", title: "Merz’s last chance to reform Germany", date: "2026-09-21", time: "18:33", url: "https://www.ft.com/content/f0b37ddf-3a4f-4631-b664-887b0cdd281c" },
  { id: "4e502288-b611-4193-acdb-46ef34b1e3b0", title: "OpenAI joins call for US-led global AI standards", date: "2026-09-21", time: "18:24", url: "https://www.ft.com/content/4e502288-b611-4193-acdb-46ef34b1e3b0" },
  { id: "29f1af13-ecc3-4f26-a479-e6088c67231b", title: "US midterm elections 2026: The FT’s guide", date: "2026-09-21", time: "17:39", url: "https://www.ft.com/content/29f1af13-ecc3-4f26-a479-e6088c67231b" },
  { id: "f29de45a-3d32-4d9f-90cd-615f7466c1de", title: "US data centres ‘are short six NYCs of electricity’", date: "2026-09-21", time: "17:01", url: "https://www.ft.com/content/f29de45a-3d32-4d9f-90cd-615f7466c1de" },
  { id: "f3092492-9e70-4987-a359-22e31f93b77b", title: "Changing leader is not the panacea many Lib Dems think it is", date: "2026-09-21", time: "16:28", url: "https://www.ft.com/content/f3092492-9e70-4987-a359-22e31f93b77b" },
  { id: "0bfc882f-fe1b-40cb-a356-162e833f2008", title: "Paramount reaches settlement to clear path for $110bn Warner Bros deal", date: "2026-09-21", time: "16:15", url: "https://www.ft.com/content/0bfc882f-fe1b-40cb-a356-162e833f2008" },
  { id: "e173bec6-352b-4b51-b3a4-382a9229bc86", title: "Federal Reserve will need to be ‘aggressive’ on inflation, says top official", date: "2026-09-21", time: "16:10", url: "https://www.ft.com/content/e173bec6-352b-4b51-b3a4-382a9229bc86" },
  { id: "2f8ea519-9e2e-4ab2-9061-18729503ff24", title: "Spanish PM’s wife to stand trial over corruption charges", date: "2026-09-21", time: "16:04", url: "https://www.ft.com/content/2f8ea519-9e2e-4ab2-9061-18729503ff24" },
  { id: "378926f5-0494-4f5e-8bd1-e1775980ab82", title: "China accuses ousted top generals of ‘disloyalty’", date: "2026-09-21", time: "15:54", url: "https://www.ft.com/content/378926f5-0494-4f5e-8bd1-e1775980ab82" },
  { id: "e40691e8-e96e-444a-baf7-ae3dfef99bce", title: "Germany’s Merz hits out at ‘destructive’ forces as he fights for survival", date: "2026-09-21", time: "15:41", url: "https://www.ft.com/content/e40691e8-e96e-444a-baf7-ae3dfef99bce" },
  { id: "79976fed-30c3-46e7-ba90-59e0633575d5", title: "Submit your questions: Where are the biggest market risks?", date: "2026-09-21", time: "14:57", url: "https://www.ft.com/content/79976fed-30c3-46e7-ba90-59e0633575d5" },
  { id: "be0ac16e-2357-45f8-8f4f-42c009e70a6f", title: "Trump vs the US Supreme Court", date: "2026-09-21", time: "14:00", url: "https://www.ft.com/content/be0ac16e-2357-45f8-8f4f-42c009e70a6f" },
  { id: "36175b45-b177-448c-95d0-3221d539ab89", title: "And the charts quiz winner is . . . ", date: "2026-09-21", time: "13:58", url: "https://www.ft.com/content/36175b45-b177-448c-95d0-3221d539ab89" },
  { id: "2a0d724d-b2be-4539-a4ab-30ba919cd253", title: "Gulf states urge reset with Iran as conflict drags on", date: "2026-09-21", time: "13:44", url: "https://www.ft.com/content/2a0d724d-b2be-4539-a4ab-30ba919cd253" },
  { id: "ba07e411-1d76-4289-83b0-96d694f95d08", title: "The food safety sheriff on a hygiene crusade in Mumbai", date: "2026-09-21", time: "13:08", url: "https://www.ft.com/content/ba07e411-1d76-4289-83b0-96d694f95d08" },
];
