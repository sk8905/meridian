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
  { id: "48f0a410-daae-420b-93fc-216c3a2f1184", title: "Intel posts fastest growth in 15 years as AI fuels chip sales", date: "2026-07-23", time: "21:02", url: "https://www.ft.com/content/48f0a410-daae-420b-93fc-216c3a2f1184" },
  { id: "f46bb42d-b61d-4932-a07b-09172b15509f", title: "How Andy Burnham’s rise to PM was helped by those axed by Starmer", date: "2026-07-23", time: "19:35", url: "https://www.ft.com/content/f46bb42d-b61d-4932-a07b-09172b15509f" },
  { id: "55b3b434-9965-4046-b239-43443db3e54a", title: "Trump’s dubious nuclear deal with Saudi Arabia", date: "2026-07-23", time: "18:56", url: "https://www.ft.com/content/55b3b434-9965-4046-b239-43443db3e54a" },
  { id: "a5c66044-8999-48a5-b9cc-51341f177930", title: "US Department of Justice to streamline company merger reviews", date: "2026-07-23", time: "18:56", url: "https://www.ft.com/content/a5c66044-8999-48a5-b9cc-51341f177930" },
  { id: "58a7b441-938c-4c05-9615-40ceaf17882b", title: "North Sea oil and gas industry looks for answers from new energy secretary", date: "2026-07-23", time: "18:49", url: "https://www.ft.com/content/58a7b441-938c-4c05-9615-40ceaf17882b" },
  { id: "b150cd9c-d31e-498d-ac31-ff5d93cb674f", title: "UK employers should keep access to skilled trades visas, government advisers say", date: "2026-07-23", time: "18:06", url: "https://www.ft.com/content/b150cd9c-d31e-498d-ac31-ff5d93cb674f" },
  { id: "afeeafb7-2a0c-4aba-a798-cecd2d8c8685", title: "The Nestlé supertanker’s turnaround is in train — under the surface", date: "2026-07-23", time: "18:00", url: "https://www.ft.com/content/afeeafb7-2a0c-4aba-a798-cecd2d8c8685" },
  { id: "bd7626de-c367-4e64-ab94-e84c2d10d87f", title: "US weapons makers’ sales soar as Iran war boosts order backlog", date: "2026-07-23", time: "17:47", url: "https://www.ft.com/content/bd7626de-c367-4e64-ab94-e84c2d10d87f" },
  { id: "0c0b1e83-8e5e-4c86-b9c6-179dba51fc69", title: "Greek tycoon’s tanker towed into Iranian waters", date: "2026-07-23", time: "17:40", url: "https://www.ft.com/content/0c0b1e83-8e5e-4c86-b9c6-179dba51fc69" },
  { id: "ce76ec03-b80f-4348-82b2-d23de0ac11f2", title: "The US may find it hard to shrug off Moonshot’s AI shockwaves", date: "2026-07-23", time: "17:30", url: "https://www.ft.com/content/ce76ec03-b80f-4348-82b2-d23de0ac11f2" },
  { id: "b02f972c-c764-4006-9377-42563d9d5530", title: "Google burns through $6bn in cash as AI spending climbs again", date: "2026-07-23", time: "17:21", url: "https://www.ft.com/content/b02f972c-c764-4006-9377-42563d9d5530" },
  { id: "619d9ef8-1c6c-42a3-9e3d-4c3942a1e1df", title: "Europe could help get Ukraine and Russia to the negotiating table", date: "2026-07-23", time: "17:14", url: "https://www.ft.com/content/619d9ef8-1c6c-42a3-9e3d-4c3942a1e1df" },
  { id: "3fd494d1-ee74-4c0f-9cd6-34e2283961df", title: "Oil hits $100 for first time since May while Wall Street stocks slide", date: "2026-07-23", time: "17:08", url: "https://www.ft.com/content/3fd494d1-ee74-4c0f-9cd6-34e2283961df" },
  { id: "7b14576c-9ddc-4983-a6d8-78a0c621b3b2", title: "Hedge funds grow at fastest rate in history as AI boom lifts markets", date: "2026-07-23", time: "16:44", url: "https://www.ft.com/content/7b14576c-9ddc-4983-a6d8-78a0c621b3b2" },
  { id: "bfc7b491-e553-4686-9531-a07b14a4d4b9", title: "Hundreds settle with HMRC as crypto tax crackdown continues", date: "2026-07-23", time: "16:17", url: "https://www.ft.com/content/bfc7b491-e553-4686-9531-a07b14a4d4b9" },
  { id: "c678eda2-9749-4c8b-8f25-21bcbf5d1acb", title: "Apple revives automotive ambitions with Ford deal for in-car software", date: "2026-07-23", time: "15:57", url: "https://www.ft.com/content/c678eda2-9749-4c8b-8f25-21bcbf5d1acb" },
  { id: "393e363c-a5ef-488b-9c7e-2a3e0d631125", title: "Palestinian economy on 'cliff edge' as Israeli banks cut ties", date: "2026-07-23", time: "15:41", url: "https://www.ft.com/content/393e363c-a5ef-488b-9c7e-2a3e0d631125" },
  { id: "fff19dd8-4c7e-4120-a282-0cdf77c56d71", title: "Trump administration's dealing in companies is on shaky ground", date: "2026-07-23", time: "15:36", url: "https://www.ft.com/content/fff19dd8-4c7e-4120-a282-0cdf77c56d71" },
  { id: "dc5e629b-562c-41e3-8b89-350af6960adc", title: "Tesla shares tumble 11% after discounts hit profits", date: "2026-07-23", time: "14:52", url: "https://www.ft.com/content/dc5e629b-562c-41e3-8b89-350af6960adc" },
  { id: "3d5544cd-a1e5-4a33-8db5-1e95fbf17def", title: "Donald Trump throws controversial US-Saudi Arabia nuclear pact into doubt", date: "2026-07-23", time: "14:40", url: "https://www.ft.com/content/3d5544cd-a1e5-4a33-8db5-1e95fbf17def" },
  { id: "50793b37-e310-4d38-8f8d-4a2bdb5ee91a", title: "Trump says Saudi nuclear deal depends on relations with Israel", date: "2026-07-23", time: "14:39", url: "https://www.ft.com/content/50793b37-e310-4d38-8f8d-4a2bdb5ee91a" },
  { id: "e28b3259-ddc9-43dc-8c3f-fca85edf7e84", title: "European Central Bank holds interest rates at 2.25% after debating rise", date: "2026-07-23", time: "14:34", url: "https://www.ft.com/content/e28b3259-ddc9-43dc-8c3f-fca85edf7e84" },
  { id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2", title: "Inflation and interest rates tracker: see how your country compares", date: "2026-07-23", time: "13:32", url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2" },
  { id: "ed9baeee-aabc-458a-a161-a607032d158d", title: "Laura Loomer meets Volodymyr Zelenskyy after pro-Ukraine conversion", date: "2026-07-23", time: "13:30", url: "https://www.ft.com/content/ed9baeee-aabc-458a-a161-a607032d158d" },
  { id: "9fe117b5-1e79-4189-a8dd-ab2de1b2cd5e", title: "ECB keeps interest rates on hold as expected", date: "2026-07-23", time: "13:27", url: "https://www.ft.com/content/9fe117b5-1e79-4189-a8dd-ab2de1b2cd5e" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-07-23", time: "13:27", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
  { id: "75ba3055-625c-4cb5-894b-0696a38f5e79", title: "Latest Isa rates", date: "2026-07-23", time: "13:20", url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79" },
  { id: "c1c69ecc-4fe5-4488-9c0f-3611c4f3a1e6", title: "Iran war reignites debate over US energy-permitting reform", date: "2026-07-23", time: "12:00", url: "https://www.ft.com/content/c1c69ecc-4fe5-4488-9c0f-3611c4f3a1e6" },
  { id: "e44325f8-c452-40d1-b423-b1f1c39ee314", title: "Blackstone says pace of withdrawals slowing at flagship private credit fund", date: "2026-07-23", time: "11:59", url: "https://www.ft.com/content/e44325f8-c452-40d1-b423-b1f1c39ee314" },
  { id: "66bf810f-c1c0-488d-bd02-f8eba3acd743", title: "Oil price surge drives global bond sell-off", date: "2026-07-23", time: "11:49", url: "https://www.ft.com/content/66bf810f-c1c0-488d-bd02-f8eba3acd743" },
  { id: "d6926044-2e10-4f8d-ae1e-16218307b840", title: "The return of the political professional", date: "2026-07-23", time: "11:35", url: "https://www.ft.com/content/d6926044-2e10-4f8d-ae1e-16218307b840" },
  { id: "352943bc-6c51-4b5d-abf0-a964970ade6a", title: "Submit your questions: How will Andy Burnham govern the UK?", date: "2026-07-23", time: "11:28", url: "https://www.ft.com/content/352943bc-6c51-4b5d-abf0-a964970ade6a" },
  { id: "94a7c686-8bc1-4f93-bd03-c7069d1ba4b4", title: "Will Burnham go big or go home?", date: "2026-07-23", time: "11:00", url: "https://www.ft.com/content/94a7c686-8bc1-4f93-bd03-c7069d1ba4b4" },
  { id: "1e008eba-e53f-40d6-a63f-cf7a15d1004f", title: "Ireland stresses Europe's need for alumina amid spat over Russian-owned plant", date: "2026-07-23", time: "11:00", url: "https://www.ft.com/content/1e008eba-e53f-40d6-a63f-cf7a15d1004f" },
  { id: "c836e73b-66bb-4aa1-b85b-dd5b6eb89af0", title: "EU fines Google €890mn in test of Donald Trump's threats to protect Big Tech", date: "2026-07-23", time: "11:00", url: "https://www.ft.com/content/c836e73b-66bb-4aa1-b85b-dd5b6eb89af0" },
  { id: "02bf3e4d-7719-4482-9f2b-ab14bd3fe9c3", title: "Houthi attacks threaten to cut off Saudi Arabia's oil lifeline", date: "2026-07-23", time: "10:51", url: "https://www.ft.com/content/02bf3e4d-7719-4482-9f2b-ab14bd3fe9c3" },
  { id: "41959a4e-f542-4225-a149-abe4fd9ba810", title: "A stealth fighter jet could blow a hole in Healey's budget", date: "2026-07-23", time: "10:09", url: "https://www.ft.com/content/41959a4e-f542-4225-a149-abe4fd9ba810" },
  { id: "dfbbd2ad-4548-480a-b752-bf8c8adc8a2d", title: "Ford hopes Spain tie-up with China's Geely will revive European business", date: "2026-07-23", time: "09:58", url: "https://www.ft.com/content/dfbbd2ad-4548-480a-b752-bf8c8adc8a2d" },
  { id: "d7bb8df9-f049-4e9b-9556-06fb8251afe5", title: "Andy Burnham's high-risk start may help him get ahead of political pain", date: "2026-07-23", time: "09:30", url: "https://www.ft.com/content/d7bb8df9-f049-4e9b-9556-06fb8251afe5" },
  { id: "6df8a0ef-447f-43de-81a0-48db79498d93", title: "Macquarie names banking head to succeed Shemara Wikramanayake as CEO", date: "2026-07-23", time: "09:03", url: "https://www.ft.com/content/6df8a0ef-447f-43de-81a0-48db79498d93" },
];
