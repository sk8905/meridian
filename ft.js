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
  { id: "d29d769e-039c-4d11-9152-e63ccd397b32", title: "US and China agree to AI dialogue ahead of Trump-Xi meeting", date: "2026-09-21", time: "05:11", url: "https://www.ft.com/content/d29d769e-039c-4d11-9152-e63ccd397b32" },
  { id: "188611f3-2536-4bed-a2c0-bbc074e6f783", title: "Volkswagen ejected from European blue-chip index in blow to crisis-hit carmaker", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/188611f3-2536-4bed-a2c0-bbc074e6f783" },
  { id: "708699ba-442b-46a2-9de7-805fb3ddaf24", title: "Carlyle’s stalled Lukoil deal leaves refineries idle in tight market", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/708699ba-442b-46a2-9de7-805fb3ddaf24" },
  { id: "960f930b-1f1f-4161-ae6c-fc8ed5ec4ed9", title: "Private ADHD clinics are misdiagnosing children, report will say", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/960f930b-1f1f-4161-ae6c-fc8ed5ec4ed9" },
  { id: "fdb3a153-4b10-4ac0-987a-c4e0b02a5b3a", title: "AI in finance must be policed differently", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/fdb3a153-4b10-4ac0-987a-c4e0b02a5b3a" },
  { id: "f88b1f1b-d00b-4aae-8ad6-de1302755333", title: "Europe must not cut US arms ties, warns defence boss", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/f88b1f1b-d00b-4aae-8ad6-de1302755333" },
  { id: "2cf96368-8f17-4b5d-88e0-9c5e4058ffe4", title: "Fuel subsidies weigh on public finances as energy crisis deepens", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/2cf96368-8f17-4b5d-88e0-9c5e4058ffe4" },
  { id: "6f0ceb7d-597d-4c83-ac8b-0fe7c8bd74f9", title: "Why the world’s hottest stock market is a national liability", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/6f0ceb7d-597d-4c83-ac8b-0fe7c8bd74f9" },
  { id: "f2dca0b0-6387-4022-8dba-dc8015823dfe", title: "The cartel civil war tearing apart a Mexican state", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/f2dca0b0-6387-4022-8dba-dc8015823dfe" },
  { id: "01a7b883-452c-4902-b40e-e3957de5d89e", title: "Lex in depth: Anthropic at $2tn isn’t far-fetched", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/01a7b883-452c-4902-b40e-e3957de5d89e" },
  { id: "5997a562-f343-4699-abd4-b86d4493d259", title: "Lobbyists move to Manchester for closer access to Number 10 North", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/5997a562-f343-4699-abd4-b86d4493d259" },
  { id: "f1d9d398-0666-44cf-96f4-390e6c3f5173", title: "Fed and BoE step up scrutiny of bank exposure to trading firms after Jane Street loss", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/f1d9d398-0666-44cf-96f4-390e6c3f5173" },
  { id: "3ce6132f-d2c0-4bdd-b995-628aa2da25d2", title: "Grant Thornton boss defends private equity ownership", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/3ce6132f-d2c0-4bdd-b995-628aa2da25d2" },
  { id: "ac00f93b-4554-419b-bd30-9ca2316d8c2c", title: "Germany’s Merz vows to stay despite ‘disaster’", date: "2026-09-21", time: "05:00", url: "https://www.ft.com/content/ac00f93b-4554-419b-bd30-9ca2316d8c2c" },
  { id: "df52a49a-ab6a-4997-a609-169e830a26fa", title: "Nik Storonsky’s plan for Revolut: a global bank with ‘effectively zero risk’", date: "2026-09-21", time: "04:00", url: "https://www.ft.com/content/df52a49a-ab6a-4997-a609-169e830a26fa" },
  { id: "a4901983-10a2-488d-8725-66177d6f9ea2", title: "Germany’s Merz stands his ground but for how long?", date: "2026-09-21", time: "03:05", url: "https://www.ft.com/content/a4901983-10a2-488d-8725-66177d6f9ea2" },
  { id: "0e4ab05c-93f9-400f-bf42-22074c184ee7", title: "Is this Indonesia’s next president?", date: "2026-09-21", time: "02:54", url: "https://www.ft.com/content/0e4ab05c-93f9-400f-bf42-22074c184ee7" },
  { id: "66623b14-f679-48ad-85a5-5d75f1cc8c17", title: "A UN gathering notable for its absences", date: "2026-09-20", time: "18:15", url: "https://www.ft.com/content/66623b14-f679-48ad-85a5-5d75f1cc8c17" },
  { id: "d9e6c07e-7d84-4e41-a9a2-0d0ac2319dd2", title: "Multilateralism is not idealism, it is a necessity", date: "2026-09-20", time: "18:00", url: "https://www.ft.com/content/d9e6c07e-7d84-4e41-a9a2-0d0ac2319dd2" },
  { id: "d74ce82a-2a15-404a-ae3a-3921e887bab3", title: "German chancellor Merz vows to stay on despite ‘disaster’ in regional elections", date: "2026-09-20", time: "18:49", url: "https://www.ft.com/content/d74ce82a-2a15-404a-ae3a-3921e887bab3" },
  { id: "33b317b4-cd7b-486a-8707-4d65db837c6d", title: "Trump says 250ft arch will be ‘military complex’ with drones and snipers", date: "2026-09-20", time: "16:43", url: "https://www.ft.com/content/33b317b4-cd7b-486a-8707-4d65db837c6d" },
  { id: "f4535bd7-7c23-4eb7-b306-43dab2772dd3", title: "Andy Burnham hopes to build bridges with Donald Trump at first meeting", date: "2026-09-20", time: "16:37", url: "https://www.ft.com/content/f4535bd7-7c23-4eb7-b306-43dab2772dd3" },
  { id: "f37d9712-009a-4573-b268-a438b4c7502b", title: "Labour MPs warn against mansion tax change in Budget", date: "2026-09-20", time: "16:27", url: "https://www.ft.com/content/f37d9712-009a-4573-b268-a438b4c7502b" },
  { id: "3fcee89f-b69d-4f4b-a944-39fe1c214fb8", title: "Wall Street expects US to issue about $1tn of short-term debt as borrowing costs climb", date: "2026-09-20", time: "16:00", url: "https://www.ft.com/content/3fcee89f-b69d-4f4b-a944-39fe1c214fb8" },
  { id: "70edaf6d-0f25-47a8-a1a4-8724cf92c2d9", title: "Disability-related disputes drive surge in demand for workplace conciliation", date: "2026-09-20", time: "16:00", url: "https://www.ft.com/content/70edaf6d-0f25-47a8-a1a4-8724cf92c2d9" },
  { id: "05a7292e-4931-4631-8f77-164fb727c203", title: "AI is a powerful but problematic new collaborator in mathematics", date: "2026-09-20", time: "14:00", url: "https://www.ft.com/content/05a7292e-4931-4631-8f77-164fb727c203" },
  { id: "bbf1d846-7d89-45f6-8c0f-1fba1e334b4b", title: "Chevron plans drilling spree as it overhauls oil and gas search", date: "2026-09-20", time: "13:00", url: "https://www.ft.com/content/bbf1d846-7d89-45f6-8c0f-1fba1e334b4b" },
  { id: "bfe6fc60-51b3-41f0-b6c9-32583735150e", title: "CATL develops pick-up truck batteries for US despite trade barriers", date: "2026-09-20", time: "12:58", url: "https://www.ft.com/content/bfe6fc60-51b3-41f0-b6c9-32583735150e" },
  { id: "2b6f1b4b-4010-4e95-8b5c-dfb2e32cd7ae", title: "Ukraine hits Moscow with ‘largest ever’ drone attack", date: "2026-09-20", time: "12:32", url: "https://www.ft.com/content/2b6f1b4b-4010-4e95-8b5c-dfb2e32cd7ae" },
  { id: "7db29c44-bff4-4fca-9de4-88356a207b01", title: "The perils of productivity numbers", date: "2026-09-20", time: "12:00", url: "https://www.ft.com/content/7db29c44-bff4-4fca-9de4-88356a207b01" },
  { id: "6a5789f3-1bf3-4a46-b570-eee84704dd68", title: "Is the Bank of Japan right to fear an overshoot in inflation?", date: "2026-09-20", time: "12:00", url: "https://www.ft.com/content/6a5789f3-1bf3-4a46-b570-eee84704dd68" },
  { id: "90714056-d364-43d9-9411-9bde92f966b3", title: "Jon Ossoff’s Georgia race stirs talk of 2028 US presidential audition", date: "2026-09-20", time: "11:00", url: "https://www.ft.com/content/90714056-d364-43d9-9411-9bde92f966b3" },
  { id: "64f90ab8-5fb0-4594-a900-d03e5ca051e3", title: "US retailer rations motor oil as prices quadruple and supplies run dry", date: "2026-09-20", time: "11:00", url: "https://www.ft.com/content/64f90ab8-5fb0-4594-a900-d03e5ca051e3" },
  { id: "ae6eec6b-94b4-4ef1-bec9-c3f1cb153bb1", title: "Dangote IPO is a test for African capitalism", date: "2026-09-20", time: "11:00", url: "https://www.ft.com/content/ae6eec6b-94b4-4ef1-bec9-c3f1cb153bb1" },
  { id: "b455ab48-76ef-4fd4-9137-1f666344ab45", title: "Trump’s regulatory rollback puts $400mn in US audit fees at risk", date: "2026-09-20", time: "11:00", url: "https://www.ft.com/content/b455ab48-76ef-4fd4-9137-1f666344ab45" },
  { id: "023c85fc-db6f-4f1d-b29e-8b41d626e5ed", title: "Lib Dem leader Ed Davey urged to ditch the stunts and get serious", date: "2026-09-20", time: "10:20", url: "https://www.ft.com/content/023c85fc-db6f-4f1d-b29e-8b41d626e5ed" },
  { id: "07fd42b5-0610-470c-8fb8-4840b5401271", title: "Houthis launch ballistic missile at Saudi capital in escalation of hostilities", date: "2026-09-20", time: "10:01", url: "https://www.ft.com/content/07fd42b5-0610-470c-8fb8-4840b5401271" },
  { id: "fcab43da-63ac-49e1-959d-aa4334528017", title: "German states go to the polls in high-stakes test for Friedrich Merz", date: "2026-09-20", time: "09:22", url: "https://www.ft.com/content/fcab43da-63ac-49e1-959d-aa4334528017" },
  { id: "7f11afae-c4e3-4054-a65b-873f3647f563", title: "Big Tech uses guarantees to keep $300bn of AI exposure off balance sheets", date: "2026-09-20", time: "08:00", url: "https://www.ft.com/content/7f11afae-c4e3-4054-a65b-873f3647f563" },
  { id: "5b315540-3622-4b6b-b305-688668544252", title: "Freedom in adulthood isn’t what you think", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/5b315540-3622-4b6b-b305-688668544252" },
];
