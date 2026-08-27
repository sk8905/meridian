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
  { id: "6d272811-8d26-46f0-ae24-abed61aa1bf3", title: "EU states revive plan to use frozen Russian assets for Ukraine", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/6d272811-8d26-46f0-ae24-abed61aa1bf3" },
  { id: "62480805-a8e1-42c0-8d64-8af2e6309d2a", title: "‘Drill, baby, drill’ rings out in Norway", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/62480805-a8e1-42c0-8d64-8af2e6309d2a" },
  { id: "2b780776-d8f3-4bd3-9daa-f601b5d4206a", title: "France replaces Italy as European bond investors’ biggest worry", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/2b780776-d8f3-4bd3-9daa-f601b5d4206a" },
  { id: "4fbeebda-e40d-423a-8564-e410fbfb6e9f", title: "Harvard Business School explored European outpost after Trump’s visa threats", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/4fbeebda-e40d-423a-8564-e410fbfb6e9f" },
  { id: "19530193-b1b3-4f04-adc2-ecd7526bbfa8", title: "Ulrich Siegmund and the eastern German state the AfD thinks it can win", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/19530193-b1b3-4f04-adc2-ecd7526bbfa8" },
  { id: "f0fae869-6139-489c-9b96-5ec05c3fcfb3", title: "Donald Trump’s Bronx loyalists stand by him as approval ratings sink", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/f0fae869-6139-489c-9b96-5ec05c3fcfb3" },
  { id: "48371986-4bc6-4396-8f81-63b2983d2f3a", title: "The Iranian cleric tightening Khamenei’s grip at home", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/48371986-4bc6-4396-8f81-63b2983d2f3a" },
  { id: "ea9c073d-4e9d-4e8a-98c0-68e278faa081", title: "Jane Street’s growing pains", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/ea9c073d-4e9d-4e8a-98c0-68e278faa081" },
  { id: "1a1408b0-8f55-454a-b7ad-3c740463eab5", title: "City trader develops AI ‘SOS’ bracelet for women and children at risk of domestic abuse", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/1a1408b0-8f55-454a-b7ad-3c740463eab5" },
  { id: "79884de5-774a-4633-ba92-be4184eb22c1", title: "Bitcoin treasury companies shed $80bn in value as business model unwinds", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/79884de5-774a-4633-ba92-be4184eb22c1" },
  { id: "1239bc3e-35cc-42d7-91cb-95c1542e5e51", title: "Big Tobacco turns to more potent nicotine pouches in battle for US", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/1239bc3e-35cc-42d7-91cb-95c1542e5e51" },
];
