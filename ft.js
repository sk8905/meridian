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
  { id: "7ee0ae41-db32-453d-ac30-80660ee9b60f", title: "Ukraine awards Elon Musk medal as it seeks Starlink approval", date: "2026-08-26", time: "12:54", url: "https://www.ft.com/content/7ee0ae41-db32-453d-ac30-80660ee9b60f" },
  { id: "ab0315bb-2657-4126-80b4-611bc83ec58f", title: "Life inside an American coal mine", date: "2026-08-26", time: "12:54", url: "https://www.ft.com/content/ab0315bb-2657-4126-80b4-611bc83ec58f" },
  { id: "ea6efd7b-83c3-40ed-803a-e86402aa3aeb", title: "The end of Trumpsplaining", date: "2026-08-26", time: "12:26", url: "https://www.ft.com/content/ea6efd7b-83c3-40ed-803a-e86402aa3aeb" },
  { id: "6f756f69-0790-405d-b044-2b1dfb8cc6d4", title: "The battle to redraw the global tax map", date: "2026-08-26", time: "12:00", url: "https://www.ft.com/content/6f756f69-0790-405d-b044-2b1dfb8cc6d4" },
  { id: "a8641cf5-d139-4ae9-854d-c88f246e1667", title: "Russia’s long war with the west — and with itself", date: "2026-08-26", time: "12:00", url: "https://www.ft.com/content/a8641cf5-d139-4ae9-854d-c88f246e1667" },
  { id: "f2b0345c-f3bc-476e-b5a9-9ed48ac2de42", title: "Edinburgh Fringe sifts unbelievable fact from nonsensical fiction", date: "2026-08-26", time: "12:00", url: "https://www.ft.com/content/f2b0345c-f3bc-476e-b5a9-9ed48ac2de42" },
  { id: "64fe84f0-0b78-4c8b-a220-1aa2466179f6", title: "Reform UK pledges to cut data rules and curb liabilities for non-executives", date: "2026-08-26", time: "11:46", url: "https://www.ft.com/content/64fe84f0-0b78-4c8b-a220-1aa2466179f6" },
  { id: "21080ecd-b261-4b35-994c-20d510fbf3d6", title: "Argentines struggle to repay debts in Javier Milei’s painful economic overhaul", date: "2026-08-26", time: "11:00", url: "https://www.ft.com/content/21080ecd-b261-4b35-994c-20d510fbf3d6" },
  { id: "ef62e345-2a76-46b4-8a69-9d02a306126b", title: "Iranian tankers gather off Sri Lankan coast", date: "2026-08-26", time: "10:06", url: "https://www.ft.com/content/ef62e345-2a76-46b4-8a69-9d02a306126b" },
  { id: "27f60c74-38b8-4a76-9cdc-144ae54f45f3", title: "Britain needs a new way to pay for healthcare", date: "2026-08-26", time: "09:51", url: "https://www.ft.com/content/27f60c74-38b8-4a76-9cdc-144ae54f45f3" },
  { id: "930f2c92-f0e3-4609-b0ad-cdd3d791ab70", title: "Liquidators can pursue PwC globally over Chinese property giant’s collapse, court rules", date: "2026-08-26", time: "08:52", url: "https://www.ft.com/content/930f2c92-f0e3-4609-b0ad-cdd3d791ab70" },
  { id: "42c449c6-03f6-4097-9eae-e119447e8aa5", title: "Bill Gates calls for ‘human reserved’ jobs to protect labour force from AI", date: "2026-08-26", time: "08:01", url: "https://www.ft.com/content/42c449c6-03f6-4097-9eae-e119447e8aa5" },
  { id: "c89182ba-283f-43ae-abda-7828bfcef07a", title: "UK household energy price cap to rise by 4% from October", date: "2026-08-26", time: "07:19", url: "https://www.ft.com/content/c89182ba-283f-43ae-abda-7828bfcef07a" },
  { id: "3a1e302b-bcfd-4bdb-afd4-cb18678acb21", title: "FTAV’s further reading", date: "2026-08-26", time: "07:04", url: "https://www.ft.com/content/3a1e302b-bcfd-4bdb-afd4-cb18678acb21" },
  { id: "ccc16455-b316-4c36-86c3-93c01ac3bfa6", title: "Prediction markets revisited", date: "2026-08-26", time: "06:30", url: "https://www.ft.com/content/ccc16455-b316-4c36-86c3-93c01ac3bfa6" },
  { id: "49f9f010-9ac9-4f6b-8b41-e8d959558785", title: "FirstFT: US Treasury on collision course with Fed", date: "2026-08-26", time: "06:16", url: "https://www.ft.com/content/49f9f010-9ac9-4f6b-8b41-e8d959558785" },
  { id: "53157379-e404-4798-bc86-dd76927e0497", title: "Spain’s Ceuta crisis festers as Madrid faces allegations of failing to tackle fallout", date: "2026-08-26", time: "06:00", url: "https://www.ft.com/content/53157379-e404-4798-bc86-dd76927e0497" },
  { id: "9a6947bf-9d4e-4489-80b9-2178ea657a67", title: "Nvidia’s $200bn ‘balance sheet-as-a-service’", date: "2026-08-26", time: "06:00", url: "https://www.ft.com/content/9a6947bf-9d4e-4489-80b9-2178ea657a67" },
  { id: "b56a910a-c2b4-41e5-9f8f-18e6fe7b2efd", title: "‘Capitalism’s not working’: why Democrats are turning to socialism", date: "2026-08-26", time: "05:19", url: "https://www.ft.com/content/b56a910a-c2b4-41e5-9f8f-18e6fe7b2efd" },
  { id: "12aa9298-ea67-4099-89df-4d1b0489cb74", title: "Shein: from TikTok haul to IPO stall", date: "2026-08-26", time: "05:00", url: "https://www.ft.com/content/12aa9298-ea67-4099-89df-4d1b0489cb74" },
  { id: "a50df99b-0621-44ea-a7c7-c9c685e2eba1", title: "Scott Bessent’s bond intervention puts US Treasury on collision course with Fed", date: "2026-08-26", time: "05:00", url: "https://www.ft.com/content/a50df99b-0621-44ea-a7c7-c9c685e2eba1" },
  { id: "d910845e-a886-45a8-a43e-4ca1c5afa4e0", title: "British Business Bank’s small business loans hit £4bn", date: "2026-08-26", time: "05:00", url: "https://www.ft.com/content/d910845e-a886-45a8-a43e-4ca1c5afa4e0" },
  { id: "04bad7f3-1b5d-4982-9967-229886be0beb", title: "Insurers pile into deals allowing banks to offload default risk", date: "2026-08-26", time: "05:00", url: "https://www.ft.com/content/04bad7f3-1b5d-4982-9967-229886be0beb" },
  { id: "624ae50c-3501-4f03-8ee8-a79d1c64a374", title: "Ignore Jane Austen, income investing has big drawbacks", date: "2026-08-26", time: "05:00", url: "https://www.ft.com/content/624ae50c-3501-4f03-8ee8-a79d1c64a374" },
  { id: "c96c25c1-b27c-4c08-a2ba-21821b39dd78", title: "Why today’s markets are not as contradictory as they seem", date: "2026-08-26", time: "05:00", url: "https://www.ft.com/content/c96c25c1-b27c-4c08-a2ba-21821b39dd78" },
];
