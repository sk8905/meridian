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
  { id: "44433853-1d29-4b42-b13b-846abe9ffa3b", title: "Chinese owners launch €2.5bn sale of Luxembourg’s oldest bank", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/44433853-1d29-4b42-b13b-846abe9ffa3b" },
  { id: "c1ba743f-7330-4419-bc8d-a8b5ce4420a0", title: "Meta launches fresh legal challenge over UK’s Online Safety Act", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/c1ba743f-7330-4419-bc8d-a8b5ce4420a0" },
  { id: "f780b2a4-13ff-44ec-8225-cf38d4f0c966", title: "Israel’s settler economy braces for European sanctions", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/f780b2a4-13ff-44ec-8225-cf38d4f0c966" },
  { id: "c9d13509-7a93-40a9-b2d4-c3292028813a", title: "The Gulf cargo trade that vanished", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/c9d13509-7a93-40a9-b2d4-c3292028813a" },
  { id: "35d699ce-b6fc-44b9-981f-dc598e310e91", title: "Low UK growth is a product of neglect", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/35d699ce-b6fc-44b9-981f-dc598e310e91" },
  { id: "e2cbfd2e-ee56-4d8b-a403-cbaae4cce191", title: "Biodiesel for shipping now cheaper than conventional fuels after price fall", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/e2cbfd2e-ee56-4d8b-a403-cbaae4cce191" },
  { id: "ac104987-f43d-4e7d-97b6-057d98f7e422", title: "Saudi Arabia quits China-led cross-border currency platform", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/ac104987-f43d-4e7d-97b6-057d98f7e422" },
  { id: "c306b336-8e0b-4662-9948-1419e6ddb583", title: "The union shock coming for UK employers", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/c306b336-8e0b-4662-9948-1419e6ddb583" },
  { id: "0f8276e5-92d3-4e37-bb7f-e8bc889346b2", title: "TotalEnergies faces fresh scrutiny over response to Mozambique attack", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/0f8276e5-92d3-4e37-bb7f-e8bc889346b2" },
  { id: "0ecc81ad-2119-4763-90fb-ba5d399d913d", title: "Russia’s new air campaign seeks to destroy Ukrainian economy", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/0ecc81ad-2119-4763-90fb-ba5d399d913d" },
  { id: "775888b2-47e6-42b4-8146-cfb9caee52d6", title: "AI influx puts Singapore office rents under pressure", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/775888b2-47e6-42b4-8146-cfb9caee52d6" },
  { id: "bcbfe352-9e9f-4ef5-81b2-2e01505b8477", title: "Trump announces ‘AI Force’ as alarm grows over technology’s advance", date: "2026-09-19", time: "20:49", url: "https://www.ft.com/content/bcbfe352-9e9f-4ef5-81b2-2e01505b8477" },
  { id: "3d23b523-e4ae-4917-99bd-9bb5cddf42c2", title: "Michael Marra wins Scottish Labour leadership election", date: "2026-09-19", time: "13:55", url: "https://www.ft.com/content/3d23b523-e4ae-4917-99bd-9bb5cddf42c2" },
  { id: "94ec0fee-53ab-4d7e-9b17-6b05608ad974", title: "Nobel economists throw support behind California billionaire tax", date: "2026-09-19", time: "12:00", url: "https://www.ft.com/content/94ec0fee-53ab-4d7e-9b17-6b05608ad974" },
  { id: "0f972258-ee7d-4742-816a-b1dd7fa29d0e", title: "Forget ‘associate member’, Canada can forge collective resilience with the EU", date: "2026-09-19", time: "11:00", url: "https://www.ft.com/content/0f972258-ee7d-4742-816a-b1dd7fa29d0e" },
  { id: "4e7be0a6-a1fd-4161-9656-faff899e938f", title: "Mark Carney takes his investment pitch from ‘Maple Davos’ to Strasbourg", date: "2026-09-19", time: "11:00", url: "https://www.ft.com/content/4e7be0a6-a1fd-4161-9656-faff899e938f" },
  { id: "4d6a552e-67de-4c62-a928-c3e7b48827fc", title: "Chart of the Week: Higher rates, meet indebted consumers", date: "2026-09-19", time: "10:30", url: "https://www.ft.com/content/4d6a552e-67de-4c62-a928-c3e7b48827fc" },
  { id: "40222e79-3ee7-4388-8362-7d06c7f71f69", title: "On takes aim at ailing Nike with Mbappé transfer coup", date: "2026-09-19", time: "09:00", url: "https://www.ft.com/content/40222e79-3ee7-4388-8362-7d06c7f71f69" },
  { id: "12ea81a9-d806-4997-b0da-ddec093bbe20", title: "Over-80s turn to annuities as rates climb", date: "2026-09-19", time: "06:13", url: "https://www.ft.com/content/12ea81a9-d806-4997-b0da-ddec093bbe20" },
  { id: "d6f2132e-bc98-44cb-add0-aa306909ce6b", title: "Admit it — is this your worst financial habit?", date: "2026-09-19", time: "05:54", url: "https://www.ft.com/content/d6f2132e-bc98-44cb-add0-aa306909ce6b" },
];
