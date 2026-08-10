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
  { id: "8ca25b96-f8eb-49b1-a259-b7314ef4741a", title: "Your move, BoJ", date: "2026-08-10", time: "06:30", url: "https://www.ft.com/content/8ca25b96-f8eb-49b1-a259-b7314ef4741a" },
  { id: "95ae557f-5c22-4512-a595-d957ca0e0005", title: "FTAV’s further reading", date: "2026-08-10", time: "06:30", url: "https://www.ft.com/content/95ae557f-5c22-4512-a595-d957ca0e0005" },
  { id: "a36fa9a6-5676-4401-9359-890916424cbd", title: "Lessons in letter writing for the Bank of England", date: "2026-08-10", time: "06:00", url: "https://www.ft.com/content/a36fa9a6-5676-4401-9359-890916424cbd" },
  { id: "d88b7e46-6806-4286-94d7-3bb16facee41", title: "US backs Australian rare earth miner to cut out China", date: "2026-08-10", time: "05:37", url: "https://www.ft.com/content/d88b7e46-6806-4286-94d7-3bb16facee41" },
  { id: "581a7c18-5deb-4cd4-b014-f4d275ba73d2", title: "German economy minister warns AfD’s rise could deter investors", date: "2026-08-10", time: "05:00", url: "https://www.ft.com/content/581a7c18-5deb-4cd4-b014-f4d275ba73d2" },
  { id: "28b389f5-5f74-4993-a9b3-edd0c500d49a", title: "Senior UK detective under investigation for alleged misuse of AI", date: "2026-08-10", time: "05:00", url: "https://www.ft.com/content/28b389f5-5f74-4993-a9b3-edd0c500d49a" },
  { id: "da888f06-b9bc-4d83-8020-e82f5d5fa609", title: "UK government increases cost projections for Palantir’s NHS data platform", date: "2026-08-10", time: "05:00", url: "https://www.ft.com/content/da888f06-b9bc-4d83-8020-e82f5d5fa609" },
  { id: "6a46592b-2eef-4830-9db5-4fbbfaee5576", title: "How finance groups could help solve Burnham’s social care conundrum", date: "2026-08-10", time: "05:00", url: "https://www.ft.com/content/6a46592b-2eef-4830-9db5-4fbbfaee5576" },
  { id: "9973f186-5834-4b66-8faa-e8b2e8711466", title: "UK regulator prepares framework for tokenised gold", date: "2026-08-10", time: "05:00", url: "https://www.ft.com/content/9973f186-5834-4b66-8faa-e8b2e8711466" },
  { id: "1b3493a5-2b0b-4a3e-86e0-76b7f2de373a", title: "Boehly’s investment group rolls out AI across portfolio after taking stake in start-up", date: "2026-08-10", time: "05:00", url: "https://www.ft.com/content/1b3493a5-2b0b-4a3e-86e0-76b7f2de373a" },
  { id: "45289802-848f-4fa6-9769-6971b4b69bcc", title: "Putin’s war machine scours the home front for recruits", date: "2026-08-10", time: "05:00", url: "https://www.ft.com/content/45289802-848f-4fa6-9769-6971b4b69bcc" },
  { id: "ec5f7351-7aec-4fe1-80dc-b02c62045109", title: "How the UAE won over Washington", date: "2026-08-10", time: "05:00", url: "https://www.ft.com/content/ec5f7351-7aec-4fe1-80dc-b02c62045109" },
  { id: "f09485bd-c5ae-466c-a148-586e94d12967", title: "European education group eyes takeovers of UK universities", date: "2026-08-10", time: "05:00", url: "https://www.ft.com/content/f09485bd-c5ae-466c-a148-586e94d12967" },
  { id: "61a23058-730d-4b13-bbbe-d491770d2a76", title: "Hong Kong builds its next chapter — and closer ties with China", date: "2026-08-10", time: "04:26", url: "https://www.ft.com/content/61a23058-730d-4b13-bbbe-d491770d2a76" },
  { id: "e7493801-7973-4915-90d4-ad4f9ff93048", title: "Have you considered awarding yourself the Fifa Peace Prize, Gianni?", date: "2026-08-10", time: "04:00", url: "https://www.ft.com/content/e7493801-7973-4915-90d4-ad4f9ff93048" },
  { id: "ce343513-5514-4519-95c8-19832ed46d16", title: "Iran replaces top security official at crucial moment in talks over Strait of Hormuz", date: "2026-08-09", time: "23:23", url: "https://www.ft.com/content/ce343513-5514-4519-95c8-19832ed46d16" },
  { id: "82922307-311d-499b-9798-0292d5f6b7ed", title: "Andy Burnham promises to tackle false discounts in latest cost-of-living pledge", date: "2026-08-09", time: "22:30", url: "https://www.ft.com/content/82922307-311d-499b-9798-0292d5f6b7ed" },
  { id: "6e943917-2eeb-4654-b4ad-a4af76b4b946", title: "FirstFT: Ex-CIA officials warn Donald Trump is dismantling US guardrails", date: "2026-08-09", time: "22:16", url: "https://www.ft.com/content/6e943917-2eeb-4654-b4ad-a4af76b4b946" },
  { id: "af06cfa1-0ea8-40a6-ad2c-81fe47a63e7b", title: "A very British by-election reaches its finale", date: "2026-08-09", time: "18:15", url: "https://www.ft.com/content/af06cfa1-0ea8-40a6-ad2c-81fe47a63e7b" },
  { id: "df62a69e-aa53-4cde-8a02-4d2cd465a370", title: "Syria makes deal to take control of Russian bases", date: "2026-08-09", time: "17:26", url: "https://www.ft.com/content/df62a69e-aa53-4cde-8a02-4d2cd465a370" },
  { id: "4fc0fdda-0919-4584-9bdd-855e2aaa5c09", title: "Donald Trump is dismantling US guardrails, warn former security officials", date: "2026-08-09", time: "17:00", url: "https://www.ft.com/content/4fc0fdda-0919-4584-9bdd-855e2aaa5c09" },
  { id: "03736b77-347b-4e07-bcb2-ced2d36737dc", title: "Britain needs to redefine what it considers cutting-edge", date: "2026-08-09", time: "17:00", url: "https://www.ft.com/content/03736b77-347b-4e07-bcb2-ced2d36737dc" },
  { id: "e4650e97-be1f-479d-8959-c892785abf49", title: "Netanyahu rejects Trump’s Gaza disarmament plan", date: "2026-08-09", time: "16:17", url: "https://www.ft.com/content/e4650e97-be1f-479d-8959-c892785abf49" },
  { id: "3dd0cbcb-26e0-4eef-af1f-b16812cae6ac", title: "America’s hidden M&A boom", date: "2026-08-09", time: "16:00", url: "https://www.ft.com/content/3dd0cbcb-26e0-4eef-af1f-b16812cae6ac" },
  { id: "ddf44cf7-0ab5-4e7e-9b1f-e5e8e34181e6", title: "Could AI create a ‘permanent underclass’?", date: "2026-08-09", time: "12:30", url: "https://www.ft.com/content/ddf44cf7-0ab5-4e7e-9b1f-e5e8e34181e6" },
  { id: "e7f0c7af-b170-4cb5-a16e-671efa62e605", title: "Will US inflation be cool enough to trim bets on a September rate rise?", date: "2026-08-09", time: "12:00", url: "https://www.ft.com/content/e7f0c7af-b170-4cb5-a16e-671efa62e605" },
  { id: "b25139e3-e748-407f-bc49-7389b3434455", title: "US social security could soon be insolvent", date: "2026-08-09", time: "12:00", url: "https://www.ft.com/content/b25139e3-e748-407f-bc49-7389b3434455" },
  { id: "29d6cef0-72db-4348-aa85-b7c3dcf94e60", title: "Enforcing the duty of candour is harder than it seems", date: "2026-08-09", time: "12:00", url: "https://www.ft.com/content/29d6cef0-72db-4348-aa85-b7c3dcf94e60" },
  { id: "c15abecc-5f9a-4f7b-92e2-8c99f9ea3ae5", title: "Asian carmakers cash in as high petrol prices lift US demand for hybrids", date: "2026-08-09", time: "11:00", url: "https://www.ft.com/content/c15abecc-5f9a-4f7b-92e2-8c99f9ea3ae5" },
  { id: "69c573e0-9c24-451d-bb13-ae7a7c3104c0", title: "Impatient yacht owners make for a hot new asset class", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/69c573e0-9c24-451d-bb13-ae7a7c3104c0" },
  { id: "7dc75493-84e1-4b84-af2a-ef5375fd9736", title: "Career satisfaction in an uncertain world? Dream on", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/7dc75493-84e1-4b84-af2a-ef5375fd9736" },
  { id: "d45a8e1b-1d45-4a3d-a3d2-5a3ce15b0e9d", title: "The Bayeux Tapestry loan is a model for the Parthenon Marbles", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/d45a8e1b-1d45-4a3d-a3d2-5a3ce15b0e9d" },
  { id: "7aafc76c-c381-4381-a89c-e92c9db60671", title: "Andy Burnham failed to end rough sleeping as a mayor — can he succeed as prime minister?", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/7aafc76c-c381-4381-a89c-e92c9db60671" },
  { id: "560ff425-c1ac-4eef-b8da-e6cdb0a412a3", title: "UK state subsidies soar as post-Brexit grants boost energy projects", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/560ff425-c1ac-4eef-b8da-e6cdb0a412a3" },
  { id: "0a6249a2-e28b-4e58-ab2d-2b8615b832dc", title: "Turkey’s cyber law shifts sweeping powers to presidency", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/0a6249a2-e28b-4e58-ab2d-2b8615b832dc" },
  { id: "590e468a-1eb7-4d1b-a7a5-80541c3ff35a", title: "Hargreaves Lansdown orders staff back to office", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/590e468a-1eb7-4d1b-a7a5-80541c3ff35a" },
  { id: "0ac50644-398f-49ec-895d-a2494254dabd", title: "France faces budget showdown as presidential election looms", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/0ac50644-398f-49ec-895d-a2494254dabd" },
  { id: "297a8bf7-ce8b-44fe-bc51-3e2ec2e47699", title: "Investors return to European stocks as strong earnings lift Iran war gloom", date: "2026-08-09", time: "05:00", url: "https://www.ft.com/content/297a8bf7-ce8b-44fe-bc51-3e2ec2e47699" },
  { id: "15c56de6-c884-4c7f-a91c-6d1aa59ce1c6", title: "China’s monthly inflation cools as impact from Iran war eases", date: "2026-08-09", time: "04:05", url: "https://www.ft.com/content/15c56de6-c884-4c7f-a91c-6d1aa59ce1c6" },
  { id: "ff321dc1-41d6-473d-b7e7-2a58224a18e7", title: "One of the world’s biggest coal producers battles to keep lights on", date: "2026-08-09", time: "03:05", url: "https://www.ft.com/content/ff321dc1-41d6-473d-b7e7-2a58224a18e7" },
];
