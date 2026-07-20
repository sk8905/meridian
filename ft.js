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
  { id: "a803297d-ddd1-40a7-8bdb-c0bd50c3b546", title: "Sinaloa cartel founder set for $15bn forfeiture order and life sentence", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/a803297d-ddd1-40a7-8bdb-c0bd50c3b546" },
  { id: "82e9b2fc-0dd8-4560-837c-2e7695457783", title: "UK pension insurers raise exposure to opaque private credit", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/82e9b2fc-0dd8-4560-837c-2e7695457783" },
  { id: "ac288d04-8354-4a6c-99fe-c0fca832ad43", title: "Andy Burnham urged to use flexibility in fiscal rules to boost investment", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/ac288d04-8354-4a6c-99fe-c0fca832ad43" },
  { id: "8e01440b-1a90-4ab2-a67e-fba7deee1ac8", title: "Burnham must remember the first rule of government", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/8e01440b-1a90-4ab2-a67e-fba7deee1ac8" },
  { id: "3b659fcd-77ce-4e63-aa46-8cb648735f13", title: "Iran’s currency tumbles as renewed conflict threatens economy", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/3b659fcd-77ce-4e63-aa46-8cb648735f13" },
  { id: "e876a37b-e508-489b-a0bd-4bb99eaba8fe", title: "What to expect from Burnham’s ‘crucial’ first 100 days as UK prime minister", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/e876a37b-e508-489b-a0bd-4bb99eaba8fe" },
  { id: "4e2f85ae-0b7d-4b31-aef1-abf8a7474e34", title: "An odyssey through Metlen’s interconnected solar empire", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/4e2f85ae-0b7d-4b31-aef1-abf8a7474e34" },
  { id: "892872ad-fb56-4774-abae-4d2880922635", title: "Chinese helium ban threatens supplies to Europe", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/892872ad-fb56-4774-abae-4d2880922635" },
  { id: "b70b3f8c-9c2e-434b-b33b-0d8e7a410a49", title: "What has the overhaul of the UK’s tax authority delivered so far?", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/b70b3f8c-9c2e-434b-b33b-0d8e7a410a49" },
  { id: "99bcda06-731d-49a8-bda2-ad4335bdca37", title: "Coffee drinkers turning to whole beans as prices soar, says Lavazza", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/99bcda06-731d-49a8-bda2-ad4335bdca37" },
  { id: "a02aa9b1-85e0-4db7-afad-7da4b99b7a31", title: "The new Fed boss is tight-lipped. That might upset the markets", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/a02aa9b1-85e0-4db7-afad-7da4b99b7a31" },
  { id: "1ec9cd0f-cf2e-40bc-8aaf-82ef1467cbdb", title: "UK consumers paid to cut electricity use to help manage grid", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/1ec9cd0f-cf2e-40bc-8aaf-82ef1467cbdb" },
  { id: "56315d35-9eed-4618-8022-84c8ddb4bb47", title: "Ode to the convertible", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/56315d35-9eed-4618-8022-84c8ddb4bb47" },
  { id: "30d7cf38-eb64-432f-a7e2-19ca1ba758ba", title: "Nigel Dunnett’s garden at Hospitalfield has never looked so good", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/30d7cf38-eb64-432f-a7e2-19ca1ba758ba" },
  { id: "e2a3ea85-e4f2-4344-ac70-8410333e8749", title: "Morgan Stanley becomes Wall Street’s top bank for AI debt deals", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/e2a3ea85-e4f2-4344-ac70-8410333e8749" },
  { id: "e8784cf3-6df5-46aa-8c37-e51d1695239f", title: "Cyber attacks expose supply chains as ‘weakest link’", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/e8784cf3-6df5-46aa-8c37-e51d1695239f" },
  { id: "f0f66461-269c-42ab-876e-b1ec9dfe3cb9", title: "How peptides became longevity medicine’s hottest frontier", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/f0f66461-269c-42ab-876e-b1ec9dfe3cb9" },
  { id: "c3e6a250-e785-4c15-b6ea-01e21c895b84", title: "AI supercharges the cyber hacker’s toolkit", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/c3e6a250-e785-4c15-b6ea-01e21c895b84" },
  { id: "a5ed4699-a156-42f2-acae-57807c2f9505", title: "Andy Burnham’s first day", date: "2026-07-20", time: "05:00", url: "https://www.ft.com/content/a5ed4699-a156-42f2-acae-57807c2f9505" },
  { id: "c688ea11-c066-44a3-9372-2e2293e9e6f9", title: "Boeing says it will be ready to fund new plane programme by 2030", date: "2026-07-19", time: "18:22", url: "https://www.ft.com/content/c688ea11-c066-44a3-9372-2e2293e9e6f9" },
  { id: "0b2af747-f298-4740-a3d2-7165f1f687be", title: "Andy Burnham’s British reboot begins", date: "2026-07-19", time: "18:15", url: "https://www.ft.com/content/0b2af747-f298-4740-a3d2-7165f1f687be" },
  { id: "d9631aae-1100-43e0-a09a-e49f5c21f896", title: "Burnham to maintain ban on North Sea exploration licences", date: "2026-07-19", time: "16:37", url: "https://www.ft.com/content/d9631aae-1100-43e0-a09a-e49f5c21f896" },
  { id: "79160822-5eb7-41c1-b9f7-a2a447ecb378", title: "UK must focus on insiders vs outsiders not north vs south", date: "2026-07-19", time: "16:00", url: "https://www.ft.com/content/79160822-5eb7-41c1-b9f7-a2a447ecb378" },
  { id: "eb0cd740-e45d-4dd7-ab9a-6f6643bb32ee", title: "EU faces crumbling support for new Russia sanctions", date: "2026-07-19", time: "15:00", url: "https://www.ft.com/content/eb0cd740-e45d-4dd7-ab9a-6f6643bb32ee" },
  { id: "cbeea953-1162-48f0-ac6d-e022c42353c6", title: "It’s time for Europe to embrace air conditioning", date: "2026-07-19", time: "14:58", url: "https://www.ft.com/content/cbeea953-1162-48f0-ac6d-e022c42353c6" },
  { id: "29985fc4-db18-4799-ae3c-59877a6c5bc9", title: "India’s rupee problem has been misdiagnosed", date: "2026-07-19", time: "13:07", url: "https://www.ft.com/content/29985fc4-db18-4799-ae3c-59877a6c5bc9" },
  { id: "45657e57-c8d0-4e58-b20d-d67a7bfdb050", title: "Andy Burnham should pursue a devolution ‘big bang’", date: "2026-07-19", time: "12:00", url: "https://www.ft.com/content/45657e57-c8d0-4e58-b20d-d67a7bfdb050" },
  { id: "b0ac6cd9-e325-485a-9c0a-db5053af8d93", title: "UK steel quota concessions to seal India deal pose risk to Welsh plant, say insiders", date: "2026-07-19", time: "12:00", url: "https://www.ft.com/content/b0ac6cd9-e325-485a-9c0a-db5053af8d93" },
  { id: "c1b04338-8fc8-45fc-8a35-f623843d4dda", title: "How will the ECB respond to the latest rise in oil prices?", date: "2026-07-19", time: "12:00", url: "https://www.ft.com/content/c1b04338-8fc8-45fc-8a35-f623843d4dda" },
  { id: "dc61c278-c3eb-48b5-8f79-f949eae7a601", title: "China’s Jingye demands payout over British Steel nationalisation", date: "2026-07-19", time: "11:50", url: "https://www.ft.com/content/dc61c278-c3eb-48b5-8f79-f949eae7a601" },
  { id: "8da4243f-820c-428c-bcfb-ba63dac48c1c", title: "US day traders flock to ‘the most dangerous product in crypto’", date: "2026-07-19", time: "11:10", url: "https://www.ft.com/content/8da4243f-820c-428c-bcfb-ba63dac48c1c" },
  { id: "e8e8adc5-7c56-45a8-99fc-bb5acfda263e", title: "US strikes Iran after two American troops killed in Jordan", date: "2026-07-19", time: "10:13", url: "https://www.ft.com/content/e8e8adc5-7c56-45a8-99fc-bb5acfda263e" },
  { id: "e4f7727f-b1c1-4325-b76d-366b6449cbe3", title: "GameStop extends pursuit of eBay despite Wall Street scepticism", date: "2026-07-19", time: "10:00", url: "https://www.ft.com/content/e4f7727f-b1c1-4325-b76d-366b6449cbe3" },
  { id: "99279482-ffdb-44db-bab0-e13790b3b525", title: "Is Fifa’s hyper-commercialised World Cup here to stay?", date: "2026-07-19", time: "09:05", url: "https://www.ft.com/content/99279482-ffdb-44db-bab0-e13790b3b525" },
  { id: "fde736b3-6999-4b9e-979e-2b4b06dbbd5c", title: "No longer grim up north for UK banks as Burnham comes to power", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/fde736b3-6999-4b9e-979e-2b4b06dbbd5c" },
  { id: "c5045a09-29c1-4a9b-8f5b-f8dead22b09c", title: "How Maga fell hard for the gender binary", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/c5045a09-29c1-4a9b-8f5b-f8dead22b09c" },
  { id: "9cf9b393-3ac7-4cfc-9dd1-4fc23831e6a0", title: "Chinese leaders zero in on need for stimulus for economy", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/9cf9b393-3ac7-4cfc-9dd1-4fc23831e6a0" },
  { id: "8005bed0-afab-4240-91f8-7567212f2b91", title: "Heroes, villains and clowns: Simon Kuper’s World Cup awards", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/8005bed0-afab-4240-91f8-7567212f2b91" },
  { id: "6f004c47-3be1-4245-bb8e-768268341934", title: "Can an ‘unelected’ prime minister succeed?", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/6f004c47-3be1-4245-bb8e-768268341934" },
  { id: "658e1eb4-2c33-4755-8f44-0261d24dd1b7", title: "Why ‘rightwing’ is no longer such a dirty word in Britain", date: "2026-07-19", time: "05:00", url: "https://www.ft.com/content/658e1eb4-2c33-4755-8f44-0261d24dd1b7" },
];
