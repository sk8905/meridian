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
  { id: "4f76326d-3d29-4b3c-b7cf-b339ee4134ae", title: "Warsh goes to Jackson Hole", date: "2026-08-27", time: "18:24", url: "https://www.ft.com/content/4f76326d-3d29-4b3c-b7cf-b339ee4134ae" },
  { id: "a7a5fadb-8e81-4047-9dc7-40feda9bacd0", title: "In asset management, the race for scale is becoming urgent", date: "2026-08-27", time: "18:07", url: "https://www.ft.com/content/a7a5fadb-8e81-4047-9dc7-40feda9bacd0" },
  { id: "febba6ee-9abd-47d4-bac4-3bbe8b64be7f", title: "'Headless software' signals further AI-led shake-up", date: "2026-08-27", time: "18:01", url: "https://www.ft.com/content/febba6ee-9abd-47d4-bac4-3bbe8b64be7f" },
  { id: "05408fe6-e7f4-44b2-ac5d-2fd2a7d04a0f", title: "US rebukes Europeans over 'sea of red' military gaps", date: "2026-08-27", time: "17:56", url: "https://www.ft.com/content/05408fe6-e7f4-44b2-ac5d-2fd2a7d04a0f" },
  { id: "f87d893e-24db-4ccd-af90-1f7f0abeb57e", title: "Polish Olympic chief arrested in spreading crypto scandal", date: "2026-08-27", time: "17:50", url: "https://www.ft.com/content/f87d893e-24db-4ccd-af90-1f7f0abeb57e" },
  { id: "8cc488a5-54c2-41f9-8b87-327ff591be6a", title: "Canada poaches 48 US-based top academics", date: "2026-08-27", time: "17:11", url: "https://www.ft.com/content/8cc488a5-54c2-41f9-8b87-327ff591be6a" },
  { id: "fb082509-a00b-44b0-9d55-a7f34b6f7b41", title: "Why 5% Treasuries aren't crushing emerging markets", date: "2026-08-27", time: "16:56", url: "https://www.ft.com/content/fb082509-a00b-44b0-9d55-a7f34b6f7b41" },
  { id: "a919761d-dab1-4a6e-93fe-f69910192c1c", title: "Don't draw the wrong conclusion from Treasury yields", date: "2026-08-27", time: "15:45", url: "https://www.ft.com/content/a919761d-dab1-4a6e-93fe-f69910192c1c" },
  { id: "7db89ce2-ca7c-43e2-b06b-07c0d3c269ca", title: "Cyber attack on UK's largest airport group exposes data of 8.7mn customers", date: "2026-08-27", time: "15:42", url: "https://www.ft.com/content/7db89ce2-ca7c-43e2-b06b-07c0d3c269ca" },
  { id: "dc3607ab-741a-4878-9a9e-ba88e4b5143d", title: "Ratko Mladić dies in prison aged 84", date: "2026-08-27", time: "15:30", url: "https://www.ft.com/content/dc3607ab-741a-4878-9a9e-ba88e4b5143d" },
  { id: "7729314c-4928-485e-bfe8-5d6749d65cd2", title: "Uefa prepares criminal complaint against Fifa's Infantino", date: "2026-08-27", time: "15:29", url: "https://www.ft.com/content/7729314c-4928-485e-bfe8-5d6749d65cd2" },
  { id: "1123d1a4-bdb7-425f-b27c-73f1b5249939", title: "Andy Burnham's high street plan is 'delusional', says Mike Ashley", date: "2026-08-27", time: "15:22", url: "https://www.ft.com/content/1123d1a4-bdb7-425f-b27c-73f1b5249939" },
  { id: "88395752-1301-44a2-961c-124f5270209c", title: "Minutes from ECB's July meeting more positive on inflation outlook", date: "2026-08-27", time: "14:44", url: "https://www.ft.com/content/88395752-1301-44a2-961c-124f5270209c" },
  { id: "52e03e5d-12f7-41e2-a62e-3822200ea7b7", title: "Humanoid robots will be useful, just not as we imagined", date: "2026-08-27", time: "14:36", url: "https://www.ft.com/content/52e03e5d-12f7-41e2-a62e-3822200ea7b7" },
  { id: "a41bf5b0-2cf1-4a0e-98dc-200e8a9e8ebf", title: "Flat owners win 'right to manage' case at UK Supreme Court", date: "2026-08-27", time: "14:35", url: "https://www.ft.com/content/a41bf5b0-2cf1-4a0e-98dc-200e8a9e8ebf" },
  { id: "fbf566f0-eb3a-484e-9f3d-5189c4730180", title: "Kevin Warsh's peculiar challenge", date: "2026-08-27", time: "14:00", url: "https://www.ft.com/content/fbf566f0-eb3a-484e-9f3d-5189c4730180" },
  { id: "1f3c2038-0087-4335-bc8f-d9c75e3a6963", title: "ECB will return to data dependence after a September rate rise", date: "2026-08-27", time: "14:00", url: "https://www.ft.com/content/1f3c2038-0087-4335-bc8f-d9c75e3a6963" },
  { id: "80fd2ed5-fb7f-4494-b7fe-a2a7d9253a49", title: "US corporate intelligence firm drops legal claim against sanctioned oil trader", date: "2026-08-27", time: "13:55", url: "https://www.ft.com/content/80fd2ed5-fb7f-4494-b7fe-a2a7d9253a49" },
  { id: "a81a4556-0c22-4d94-a105-31e3acb6912e", title: "Autumn can't come soon enough for home sellers", date: "2026-08-27", time: "13:00", url: "https://www.ft.com/content/a81a4556-0c22-4d94-a105-31e3acb6912e" },
  { id: "e291cbfe-726c-4d38-9ab5-66c5afa86cd5", title: "'It's like playing on concrete': drought leaves sports pitches across England unplayable", date: "2026-08-27", time: "12:53", url: "https://www.ft.com/content/e291cbfe-726c-4d38-9ab5-66c5afa86cd5" },
  { id: "5250dd00-5bfc-44ce-80d6-2295c020efb8", title: "Jes Staley told Congress it was 'incredible' Epstein's abuse continued after jail", date: "2026-08-27", time: "12:37", url: "https://www.ft.com/content/5250dd00-5bfc-44ce-80d6-2295c020efb8" },
  { id: "797e289f-a94c-413a-8f56-e2d975c5d540", title: "Can the City of London remain a leading financial centre?", date: "2026-08-27", time: "12:25", url: "https://www.ft.com/content/797e289f-a94c-413a-8f56-e2d975c5d540" },
  { id: "817369ed-a886-4cfe-8324-5391b7187591", title: "HMRC records record capital gains tax haul after Reeves' rate rise", date: "2026-08-27", time: "12:11", url: "https://www.ft.com/content/817369ed-a886-4cfe-8324-5391b7187591" },
  { id: "f84a4bbe-e489-4822-8644-95b4454b968d", title: "Private equity carried interest payouts soared ahead of UK tax changes", date: "2026-08-27", time: "11:59", url: "https://www.ft.com/content/f84a4bbe-e489-4822-8644-95b4454b968d" },
  { id: "e7128b98-b4f3-4f86-b9de-f1c830cac1b1", title: "Askar Baitassov explores the spas, Soviet design and sausages of Almaty", date: "2026-08-27", time: "11:00", url: "https://www.ft.com/content/e7128b98-b4f3-4f86-b9de-f1c830cac1b1" },
  { id: "e5fe61b7-ceb2-4b36-90c5-26a6aa736444", title: "The battle plans in Trump's tariff wars look more witless each time", date: "2026-08-27", time: "11:00", url: "https://www.ft.com/content/e5fe61b7-ceb2-4b36-90c5-26a6aa736444" },
  { id: "4d7010e3-7e54-457f-b2e1-ea44cc1fddd3", title: "'Neets' numbers dip below 1mn as Andy Burnham prepares fresh push on welfare reform", date: "2026-08-27", time: "10:54", url: "https://www.ft.com/content/4d7010e3-7e54-457f-b2e1-ea44cc1fddd3" },
  { id: "5b2cc821-b15d-4292-82a6-149e48530c0a", title: "UK asylum claims drop sharply as ministers curb hotel use", date: "2026-08-27", time: "10:38", url: "https://www.ft.com/content/5b2cc821-b15d-4292-82a6-149e48530c0a" },
  { id: "bbb5acbe-c833-4a19-8437-3f5260cc6700", title: "Have you discovered the magic of Merlin?", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/bbb5acbe-c833-4a19-8437-3f5260cc6700" },
  { id: "1b0b58b2-3e0f-4f03-9019-266aeff94907", title: "Thames Water saga undermines case for more market solutions", date: "2026-08-27", time: "09:38", url: "https://www.ft.com/content/1b0b58b2-3e0f-4f03-9019-266aeff94907" },
  { id: "dbf42a47-2162-476c-a52a-713e3a9ec2f9", title: "FTAV’s further reading", date: "2026-08-27", time: "07:39", url: "https://www.ft.com/content/dbf42a47-2162-476c-a52a-713e3a9ec2f9" },
  { id: "a9145db8-18c1-4476-aac5-d1b4fcf70040", title: "AI revenue reporting: slop", date: "2026-08-27", time: "06:30", url: "https://www.ft.com/content/a9145db8-18c1-4476-aac5-d1b4fcf70040" },
  { id: "0176cab1-04f8-4535-84d2-8e9df271ff02", title: "FirstFT: Nvidia results beat Wall Street expectations", date: "2026-08-27", time: "06:15", url: "https://www.ft.com/content/0176cab1-04f8-4535-84d2-8e9df271ff02" },
  { id: "de99f952-c29a-4c79-ac53-6026f8fcd56a", title: "Von der Leyen reiterates EU competitiveness focus as economic woes mount", date: "2026-08-27", time: "06:07", url: "https://www.ft.com/content/de99f952-c29a-4c79-ac53-6026f8fcd56a" },
  { id: "0a50dff4-27f4-46f1-9bdd-9dc047842b2e", title: "What a century of data tells us about today’s corporate bond spreads", date: "2026-08-27", time: "06:00", url: "https://www.ft.com/content/0a50dff4-27f4-46f1-9bdd-9dc047842b2e" },
  { id: "294ad859-7db7-4783-a5b6-d89c7fdabf10", title: "Yen weakness and rising inflation put pressure on the Bank of Japan for earlier tightening", date: "2026-08-27", time: "05:30", url: "https://www.ft.com/content/294ad859-7db7-4783-a5b6-d89c7fdabf10" },
  { id: "6ff4d774-ff25-4387-b026-6584de640fe1", title: "Jane Street’s $15bn wake-up call", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/6ff4d774-ff25-4387-b026-6584de640fe1" },
  { id: "e9312df9-8bbf-401d-896b-06eb2141677c", title: "Israel considers expelling British officials from postwar Gaza headquarters", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/e9312df9-8bbf-401d-896b-06eb2141677c" },
  { id: "f8eb3df2-5924-4fa6-a35d-046640ec94da", title: "Thames Water creditors and government in stand-off over future", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/f8eb3df2-5924-4fa6-a35d-046640ec94da" },
  { id: "33c01971-4140-4e5c-a685-6ab03ab84c2d", title: "Burnham’s energy challenge: getting more UK households off gas", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/33c01971-4140-4e5c-a685-6ab03ab84c2d" },
  { id: "ce910f62-6119-4d5f-97a4-77bbad03318d", title: "The US is gambling with its role as the world’s investment hub", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/ce910f62-6119-4d5f-97a4-77bbad03318d" },
];
