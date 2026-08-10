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
  { id: "eae5a1cc-5d15-48c9-9d24-2b7094fda5ba", title: "Start-up bank backed by Palmer Luckey set to raise $1.5bn", date: "2026-08-10", time: "12:00", url: "https://www.ft.com/content/eae5a1cc-5d15-48c9-9d24-2b7094fda5ba" },
  { id: "0cc564c0-b69f-4e67-ac5d-15147ee31ac1", title: "Barrick and Newmont gold mining truce clears way for IPO", date: "2026-08-10", time: "11:07", url: "https://www.ft.com/content/0cc564c0-b69f-4e67-ac5d-15147ee31ac1" },
  { id: "ad0602c3-224f-422c-b052-ff96e2f9054c", title: "Ukrainian drone strike on oil-refining city in central Russia kills 13", date: "2026-08-10", time: "10:55", url: "https://www.ft.com/content/ad0602c3-224f-422c-b052-ff96e2f9054c" },
  { id: "1f5e2807-5110-47bc-baf1-757c7b675cb0", title: "Revolut wins French banking licence", date: "2026-08-10", time: "10:43", url: "https://www.ft.com/content/1f5e2807-5110-47bc-baf1-757c7b675cb0" },
  { id: "488d82d2-037d-455f-8668-22df647cde1d", title: "And the FTAV chart quiz winner is . . .", date: "2026-08-10", time: "10:30", url: "https://www.ft.com/content/488d82d2-037d-455f-8668-22df647cde1d" },
  { id: "5fb02f66-1faa-41e4-97f7-b791501da41d", title: "Reform vows to deport all foreign prisoners from British jails", date: "2026-08-10", time: "09:55", url: "https://www.ft.com/content/5fb02f66-1faa-41e4-97f7-b791501da41d" },
  { id: "0c2b4143-571c-4339-962c-ecc9efd7a05d", title: "Nigel Farage’s biggest threat is a divided right", date: "2026-08-10", time: "09:30", url: "https://www.ft.com/content/0c2b4143-571c-4339-962c-ecc9efd7a05d" },
  { id: "cfa061f4-83dc-4e4b-9a51-0142caacaff6", title: "Summary of opinions suggests Bank of Japan set for more tightening", date: "2026-08-10", time: "09:19", url: "https://www.ft.com/content/cfa061f4-83dc-4e4b-9a51-0142caacaff6" },
  { id: "5ae7381b-2b01-448e-af9e-c141bf6870e2", title: "Prabowo Subianto nominates new leader for Indonesia’s central bank", date: "2026-08-10", time: "06:36", url: "https://www.ft.com/content/5ae7381b-2b01-448e-af9e-c141bf6870e2" },
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
];
