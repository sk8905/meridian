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
  { id: "fcab43da-63ac-49e1-959d-aa4334528017", title: "German states go to the polls in high-stakes test for Friedrich Merz", date: "2026-09-20", time: "09:22", url: "https://www.ft.com/content/fcab43da-63ac-49e1-959d-aa4334528017" },
  { id: "7f11afae-c4e3-4054-a65b-873f3647f563", title: "Big Tech uses guarantees to keep $300bn of AI exposure off balance sheets", date: "2026-09-20", time: "08:00", url: "https://www.ft.com/content/7f11afae-c4e3-4054-a65b-873f3647f563" },
  { id: "5b315540-3622-4b6b-b305-688668544252", title: "Freedom in adulthood isn’t what you think", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/5b315540-3622-4b6b-b305-688668544252" },
  { id: "023c85fc-db6f-4f1d-b29e-8b41d626e5ed", title: "Lib Dem leader Ed Davey urged to ditch the stunts and get serious", date: "2026-09-20", time: "05:00", url: "https://www.ft.com/content/023c85fc-db6f-4f1d-b29e-8b41d626e5ed" },
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
  { id: "07fd42b5-0610-470c-8fb8-4840b5401271", title: "Saudi Arabia sounds air-raid alerts as missile and drone assault intensifies", date: "2026-09-19", time: "13:42", url: "https://www.ft.com/content/07fd42b5-0610-470c-8fb8-4840b5401271" },
  { id: "94ec0fee-53ab-4d7e-9b17-6b05608ad974", title: "Nobel economists throw support behind California billionaire tax", date: "2026-09-19", time: "12:00", url: "https://www.ft.com/content/94ec0fee-53ab-4d7e-9b17-6b05608ad974" },
  { id: "0f972258-ee7d-4742-816a-b1dd7fa29d0e", title: "Forget ‘associate member’, Canada can forge collective resilience with the EU", date: "2026-09-19", time: "11:00", url: "https://www.ft.com/content/0f972258-ee7d-4742-816a-b1dd7fa29d0e" },
  { id: "4e7be0a6-a1fd-4161-9656-faff899e938f", title: "Mark Carney takes his investment pitch from ‘Maple Davos’ to Strasbourg", date: "2026-09-19", time: "11:00", url: "https://www.ft.com/content/4e7be0a6-a1fd-4161-9656-faff899e938f" },
  { id: "4d6a552e-67de-4c62-a928-c3e7b48827fc", title: "Chart of the Week: Higher rates, meet indebted consumers", date: "2026-09-19", time: "10:30", url: "https://www.ft.com/content/4d6a552e-67de-4c62-a928-c3e7b48827fc" },
  { id: "40222e79-3ee7-4388-8362-7d06c7f71f69", title: "On takes aim at ailing Nike with Mbappé transfer coup", date: "2026-09-19", time: "09:00", url: "https://www.ft.com/content/40222e79-3ee7-4388-8362-7d06c7f71f69" },
  { id: "12ea81a9-d806-4997-b0da-ddec093bbe20", title: "Over-80s turn to annuities as rates climb", date: "2026-09-19", time: "06:13", url: "https://www.ft.com/content/12ea81a9-d806-4997-b0da-ddec093bbe20" },
  { id: "d6f2132e-bc98-44cb-add0-aa306909ce6b", title: "Admit it — is this your worst financial habit?", date: "2026-09-19", time: "05:54", url: "https://www.ft.com/content/d6f2132e-bc98-44cb-add0-aa306909ce6b" },
  { id: "c0cd359d-df84-4208-a789-ffa864b43666", title: "AI chatbots give wrong answers to financial queries ‘most of the time’", date: "2026-09-19", time: "05:49", url: "https://www.ft.com/content/c0cd359d-df84-4208-a789-ffa864b43666" },
  { id: "77f042f0-80c2-40ad-a4d1-9da0367827ee", title: "Thirty years of buy-to-let: does it have a future?", date: "2026-09-19", time: "05:24", url: "https://www.ft.com/content/77f042f0-80c2-40ad-a4d1-9da0367827ee" },
  { id: "124c1cf0-4885-495c-a907-a5217d589f9d", title: "Unpacking the real fiscal costs of immigration", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/124c1cf0-4885-495c-a907-a5217d589f9d" },
  { id: "b6c4501e-76fe-4559-a3c3-6ad7aa07eaa5", title: "The Anglo-French moment", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/b6c4501e-76fe-4559-a3c3-6ad7aa07eaa5" },
  { id: "a82a42a4-8f80-4569-a706-e7278c088d4d", title: "South Africa’s ANC fails to register 181 local election candidates", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/a82a42a4-8f80-4569-a706-e7278c088d4d" },
  { id: "527bad1f-53a2-482c-b06b-ae3484993144", title: "Dry British summers raise hopes of homegrown chickpeas", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/527bad1f-53a2-482c-b06b-ae3484993144" },
  { id: "129a5052-ac31-4975-8a88-91ce09740a0b", title: "How should investors position for the robot apocalypse?", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/129a5052-ac31-4975-8a88-91ce09740a0b" },
  { id: "81064dde-d1eb-49db-ba38-b6e28f334798", title: "Passport to Piddington: a short history of micronations", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/81064dde-d1eb-49db-ba38-b6e28f334798" },
  { id: "64ee1dec-7b98-40b1-8f50-5fa6bb760cfd", title: "Housebuilders aren’t the only ones who benefit from ‘Help to Buy’", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/64ee1dec-7b98-40b1-8f50-5fa6bb760cfd" },
  { id: "09c2e11c-1632-42e3-8fc6-809468b7f87e", title: "Five ways the Iran energy shock is wrongfooting the world", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/09c2e11c-1632-42e3-8fc6-809468b7f87e" },
  { id: "96d0a206-a37b-4166-b78d-b27ed24f7d57", title: "Investors weigh whether Anthropic can sustain surging revenues post-IPO", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/96d0a206-a37b-4166-b78d-b27ed24f7d57" },
  { id: "05887f92-c777-48ab-8efa-9a39e7e18a9f", title: "US state department under pressure to disclose Venezuelan oil takings", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/05887f92-c777-48ab-8efa-9a39e7e18a9f" },
  { id: "e5a76494-71df-4ee0-a85f-b28f2c94ded6", title: "Brussels rebuffs calls for EU-wide digital services tax", date: "2026-09-19", time: "05:00", url: "https://www.ft.com/content/e5a76494-71df-4ee0-a85f-b28f2c94ded6" },
  { id: "85bb8ebe-4363-4a2c-920c-93fee2d128a7", title: "UK’s top taxpayer says he would ‘not wish to be reborn’ in Britain", date: "2026-09-18", time: "21:00", url: "https://www.ft.com/content/85bb8ebe-4363-4a2c-920c-93fee2d128a7" },
  { id: "4cd82226-3d4a-474d-bc3e-de2ed0b1e6f8", title: "Donald Trump bans major US news outlets from White House", date: "2026-09-18", time: "20:20", url: "https://www.ft.com/content/4cd82226-3d4a-474d-bc3e-de2ed0b1e6f8" },
];
