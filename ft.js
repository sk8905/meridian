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
  { id: "4e00d916-7668-4981-8db6-3ccecae7a5c7", title: "Trump jolts Iceland’s EU debate back to life", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/4e00d916-7668-4981-8db6-3ccecae7a5c7" },
  { id: "9fe777d8-49df-4986-9af9-01a30ebb7030", title: "The tower at the heart of US-Mexico cartel spat", date: "2026-08-27", time: "05:00", url: "https://www.ft.com/content/9fe777d8-49df-4986-9af9-01a30ebb7030" },
  { id: "e353d8bd-e763-4866-89c3-7382ae3587db", title: "Uefa set to water down plan to boycott all Fifa football tournaments", date: "2026-08-26", time: "20:48", url: "https://www.ft.com/content/e353d8bd-e763-4866-89c3-7382ae3587db" },
  { id: "99278383-22eb-4d42-85fd-5dcc8917be84", title: "RedBird nears deal for Puck at $250mn valuation in latest digital media bet", date: "2026-08-26", time: "20:28", url: "https://www.ft.com/content/99278383-22eb-4d42-85fd-5dcc8917be84" },
  { id: "3fc189d6-28e7-4a2b-b77e-5c94bf513955", title: "OpenAI says it took a week to detect its AI models had hacked Hugging Face", date: "2026-08-26", time: "20:00", url: "https://www.ft.com/content/3fc189d6-28e7-4a2b-b77e-5c94bf513955" },
  { id: "857fb8e1-eec6-443e-97e8-f6876302aabc", title: "Trump administration pauses immigrant visa applications", date: "2026-08-26", time: "19:37", url: "https://www.ft.com/content/857fb8e1-eec6-443e-97e8-f6876302aabc" },
  { id: "d9b7300a-d67a-4a64-871b-70e5a89d23af", title: "US labels Palestine Action a ‘terrorist group’", date: "2026-08-26", time: "18:47", url: "https://www.ft.com/content/d9b7300a-d67a-4a64-871b-70e5a89d23af" },
  { id: "7650d84f-4750-48c4-9a9e-ca899e608931", title: "Ministers tell Bank of England to boost innovation in digital currencies", date: "2026-08-26", time: "18:27", url: "https://www.ft.com/content/7650d84f-4750-48c4-9a9e-ca899e608931" },
  { id: "46bfb72c-6bb5-449b-ba81-87868d44526b", title: "El Niño’s looming threat to the global food system", date: "2026-08-26", time: "17:49", url: "https://www.ft.com/content/46bfb72c-6bb5-449b-ba81-87868d44526b" },
  { id: "5b479f2e-6b34-4373-b65b-531b92bac816", title: "Charting the trillion-dollar TAM wars", date: "2026-08-26", time: "17:16", url: "https://www.ft.com/content/5b479f2e-6b34-4373-b65b-531b92bac816" },
  { id: "083d21f8-ac03-4d72-b149-e8ded11c11a9", title: "Heatwaves spark interest in Gulf-style extreme cooling", date: "2026-08-26", time: "17:09", url: "https://www.ft.com/content/083d21f8-ac03-4d72-b149-e8ded11c11a9" },
  { id: "284f83f5-b6af-41a9-909d-26ca5693e5a9", title: "Andy Burnham seeks to bridge gap with nervous business community", date: "2026-08-26", time: "17:08", url: "https://www.ft.com/content/284f83f5-b6af-41a9-909d-26ca5693e5a9" },
  { id: "d7b89b34-8961-484d-b776-707520e942c5", title: "CIA chief makes rare visit to Moscow", date: "2026-08-26", time: "16:52", url: "https://www.ft.com/content/d7b89b34-8961-484d-b776-707520e942c5" },
  { id: "0ebde4be-b080-4c64-97a5-6daa2f33299a", title: "Fed set to be data dependent in the months ahead", date: "2026-08-26", time: "16:30", url: "https://www.ft.com/content/0ebde4be-b080-4c64-97a5-6daa2f33299a" },
  { id: "c6a15b69-fc74-406e-a006-9e669e11aea0", title: "Slightly hotter than expected PCE inflation keeps Fed’s September rate rise in play", date: "2026-08-26", time: "15:45", url: "https://www.ft.com/content/c6a15b69-fc74-406e-a006-9e669e11aea0" },
  { id: "21dcbd96-ee57-445c-a9ba-0938c49b91c0", title: "Meta to pay up to $16.7bn to settle children’s social media harm case", date: "2026-08-26", time: "14:57", url: "https://www.ft.com/content/21dcbd96-ee57-445c-a9ba-0938c49b91c0" },
  { id: "1809a163-07b8-46fd-b056-7ee25d5023d4", title: "Victory Capital to acquire First Eagle in $7bn deal", date: "2026-08-26", time: "14:38", url: "https://www.ft.com/content/1809a163-07b8-46fd-b056-7ee25d5023d4" },
  { id: "56750716-10a5-4c43-88bc-ed69f591da28", title: "London is worst area in England and Wales for heat-related deaths", date: "2026-08-26", time: "14:23", url: "https://www.ft.com/content/56750716-10a5-4c43-88bc-ed69f591da28" },
  { id: "70949883-f543-4444-a330-503b8e4c141a", title: "Mark Walter’s group insists there is no ‘fire sale’ and ‘no fraud’", date: "2026-08-26", time: "13:59", url: "https://www.ft.com/content/70949883-f543-4444-a330-503b8e4c141a" },
  { id: "4ec53450-122a-4663-b280-5e7d80ef5e70", title: "Andy Burnham pledges to ‘take pressure off’ business ahead of October Budget", date: "2026-08-26", time: "13:57", url: "https://www.ft.com/content/4ec53450-122a-4663-b280-5e7d80ef5e70" },
  { id: "e9b2231e-79b0-40b3-a72e-6c594839e157", title: "Iran war approaching Ukraine-style stalemate, says shipping boss", date: "2026-08-26", time: "13:48", url: "https://www.ft.com/content/e9b2231e-79b0-40b3-a72e-6c594839e157" },
  { id: "230aa124-18ae-4d43-8444-78ab4a87471b", title: "Samsung must pay Swatch $11.6mn over copycat smartwatch apps", date: "2026-08-26", time: "12:57", url: "https://www.ft.com/content/230aa124-18ae-4d43-8444-78ab4a87471b" },
];
