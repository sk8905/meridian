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
  {
    id: "4194904d-d041-46b9-a606-d0580137a8a3",
    title: "Notes on living in a dangerous world",
    date: "2026-09-24",
    time: "11:00",
    url: "https://www.ft.com/content/4194904d-d041-46b9-a606-d0580137a8a3"
  },
  {
    id: "030dbb32-f615-4969-becf-ca236027ae89",
    title: "Private equity could revolutionise US lawyer pay, law firm bosses say",
    date: "2026-09-24",
    time: "11:00",
    url: "https://www.ft.com/content/030dbb32-f615-4969-becf-ca236027ae89"
  },
  {
    id: "1e788f4b-413b-4e92-a722-51e918513f7e",
    title: "Rate rise ‘increasingly likely’ if energy price shock persists, says BoE official",
    date: "2026-09-24",
    time: "10:54",
    url: "https://www.ft.com/content/1e788f4b-413b-4e92-a722-51e918513f7e"
  },
  {
    id: "d600fbb4-11e4-4541-9e98-ca37c8475eb3",
    title: "Tencent launches payments app for ‘China-maxxing’ foreign tourists",
    date: "2026-09-24",
    time: "10:34",
    url: "https://www.ft.com/content/d600fbb4-11e4-4541-9e98-ca37c8475eb3"
  },
  {
    id: "3ab22092-5d60-457e-a88c-cf9062887ed1",
    title: "Anti-migrant protest leader arrested after posting video stabbing a dinghy",
    date: "2026-09-24",
    time: "10:27",
    url: "https://www.ft.com/content/3ab22092-5d60-457e-a88c-cf9062887ed1"
  },
  {
    id: "79976fed-30c3-46e7-ba90-59e0633575d5",
    title: "Submit your questions: Where are the biggest market risks?",
    date: "2026-09-24",
    time: "10:04",
    url: "https://www.ft.com/content/79976fed-30c3-46e7-ba90-59e0633575d5"
  },
  {
    id: "1767ba03-05a2-4d69-83df-5aa0a6bf24e2",
    title: "Delivery Hero chief reverses exit plan after Uber secures takeover deal",
    date: "2026-09-24",
    time: "09:56",
    url: "https://www.ft.com/content/1767ba03-05a2-4d69-83df-5aa0a6bf24e2"
  },
  {
    id: "123bb90f-8e87-46d8-8ae0-64a95f9d344d",
    title: "Flattering the forecast should not be John Healey’s priority",
    date: "2026-09-24",
    time: "09:30",
    url: "https://www.ft.com/content/123bb90f-8e87-46d8-8ae0-64a95f9d344d"
  },
  {
    id: "8124e18d-ca77-424f-aa43-97983653eec4",
    title: "Oops! You added the wrong email attachment and leaked the bank’s deal list. What happens next?",
    date: "2026-09-24",
    time: "09:17",
    url: "https://www.ft.com/content/8124e18d-ca77-424f-aa43-97983653eec4"
  },
  {
    id: "17b09993-8fed-47d1-9c04-e2d29ca75615",
    title: "SoftBank raises $11bn in record junk bond offering to fund OpenAI bet",
    date: "2026-09-24",
    time: "09:07",
    url: "https://www.ft.com/content/17b09993-8fed-47d1-9c04-e2d29ca75615"
  },
  {
    id: "680363f9-1d2d-4e76-824d-7aaa54a80840",
    title: "Vistry vows to simplify business after £83mn first-half loss",
    date: "2026-09-24",
    time: "09:03",
    url: "https://www.ft.com/content/680363f9-1d2d-4e76-824d-7aaa54a80840"
  },
  {
    id: "9771d493-6c70-4250-9852-854351f13bad",
    title: "FTAV’s further reading",
    date: "2026-09-24",
    time: "08:39",
    url: "https://www.ft.com/content/9771d493-6c70-4250-9852-854351f13bad"
  },
  {
    id: "797e289f-a94c-413a-8f56-e2d975c5d540",
    title: "Can the City of London remain a leading financial centre?",
    date: "2026-09-24",
    time: "08:36",
    url: "https://www.ft.com/content/797e289f-a94c-413a-8f56-e2d975c5d540"
  },
  {
    id: "72d1df1f-cc71-4e17-a442-0a4201ba41aa",
    title: "Judge orders White House to restore banned media’s access",
    date: "2026-09-24",
    time: "06:51",
    url: "https://www.ft.com/content/72d1df1f-cc71-4e17-a442-0a4201ba41aa"
  },
  {
    id: "820c02a1-36b6-49ab-b2b2-1f60c77567ab",
    title: "The SVB postmortem continues",
    date: "2026-09-24",
    time: "06:30",
    url: "https://www.ft.com/content/820c02a1-36b6-49ab-b2b2-1f60c77567ab"
  },
  {
    id: "f51d9570-73e8-4780-a21b-948a989bd73d",
    title: "France and Germany spar over ‘Made in Europe’ as EU moves to protect its own",
    date: "2026-09-24",
    time: "06:00",
    url: "https://www.ft.com/content/f51d9570-73e8-4780-a21b-948a989bd73d"
  },
  {
    id: "6354c1ec-286a-4251-bac8-ca0cd4ac7eac",
    title: "Are Big Tech bonds crowding out the US Treasury?",
    date: "2026-09-24",
    time: "06:00",
    url: "https://www.ft.com/content/6354c1ec-286a-4251-bac8-ca0cd4ac7eac"
  },
  {
    id: "2d87f8bf-d529-4997-90c5-393ef65d280c",
    title: "Global bond sell-off deepens as oil holds above $100",
    date: "2026-09-24",
    time: "05:03",
    url: "https://www.ft.com/content/2d87f8bf-d529-4997-90c5-393ef65d280c"
  },
  {
    id: "e73aeb7e-a408-4272-9d87-743a040db0dc",
    title: "Hasan Piker: the Republican Party’s bogeyman",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/e73aeb7e-a408-4272-9d87-743a040db0dc"
  },
  {
    id: "ad6d56fa-6a6e-43bd-8f12-205a3f94ac0e",
    title: "Shale magnate Scott Sheffield accuses Exxon of ‘smear campaign’ to block board seat",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/ad6d56fa-6a6e-43bd-8f12-205a3f94ac0e"
  },
  {
    id: "d5264683-7466-4b7e-947f-b7e3f360b7d0",
    title: "VW’s painful recovery plan is fragile",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/d5264683-7466-4b7e-947f-b7e3f360b7d0"
  },
  {
    id: "15bfe2fb-6b13-48dc-99dd-b732f3564b8f",
    title: "How Trump’s tariff war is clobbering the Hanks of America",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/15bfe2fb-6b13-48dc-99dd-b732f3564b8f"
  },
  {
    id: "cce116f4-2cd6-4c1f-ae19-df0fc24c9252",
    title: "Jane Street to double London office space after breakneck growth",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/cce116f4-2cd6-4c1f-ae19-df0fc24c9252"
  },
  {
    id: "cf60deee-553d-4232-83b6-966b539fa6b9",
    title: "Airtel Money IPO signals a route back for London’s market",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/cf60deee-553d-4232-83b6-966b539fa6b9"
  },
  {
    id: "23c7eab5-32e6-4069-9989-e8c5af57558c",
    title: "The clock’s ticking on the AI boom",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/23c7eab5-32e6-4069-9989-e8c5af57558c"
  },
  {
    id: "60157962-3399-4158-b9dc-6dc2111cb050",
    title: "Curator’s pick: Grant Wood’s ‘American Gothic’ at the Art Institute of Chicago",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/60157962-3399-4158-b9dc-6dc2111cb050"
  },
  {
    id: "c819b9fb-ce86-435c-a10a-60941a14ab87",
    title: "Why your holiday is good news for the UK",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/c819b9fb-ce86-435c-a10a-60941a14ab87"
  },
  {
    id: "67a629b1-a502-47d3-8403-5b9ac37c0606",
    title: "Syria’s dangerous search for justice",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/67a629b1-a502-47d3-8403-5b9ac37c0606"
  },
  {
    id: "35fff896-9727-4372-bfcd-a805d8021517",
    title: "UK and Germany among economies most exposed to China",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/35fff896-9727-4372-bfcd-a805d8021517"
  },
  {
    id: "e3c74df4-9131-44cd-bd31-49691112bc85",
    title: "Emerging markets shrug off Iran war in record foreign borrowing spree",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/e3c74df4-9131-44cd-bd31-49691112bc85"
  },
  {
    id: "83beb007-8ef5-45e9-9edc-62eb5db46e40",
    title: "Republicans spend big on midterm ads as Donald Trump’s popularity plummets",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/83beb007-8ef5-45e9-9edc-62eb5db46e40"
  },
  {
    id: "deb09c41-668f-4aa8-8b0b-c795474143e3",
    title: "Fed will act to ensure inflation resumes its moderation",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/deb09c41-668f-4aa8-8b0b-c795474143e3"
  },
  {
    id: "bec22e6b-1267-4d9f-a192-60763a0797c3",
    title: "Trump’s US no longer a reliable ally, warns Belgium in leaked document",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/bec22e6b-1267-4d9f-a192-60763a0797c3"
  },
  {
    id: "9d1192a9-abb7-4a91-9638-4ffa855afbb8",
    title: "How to think about the end of the world",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/9d1192a9-abb7-4a91-9638-4ffa855afbb8"
  },
  {
    id: "fd26680a-2e4a-4ef4-9b7f-4735a30fedd8",
    title: "The FT’s Budget dashboard: the data confronting chancellor John Healey",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/fd26680a-2e4a-4ef4-9b7f-4735a30fedd8"
  },
  {
    id: "1b416427-0e86-40c0-9536-c31d76635313",
    title: "French far left sparks backlash with debt ‘fire’ plan",
    date: "2026-09-24",
    time: "05:00",
    url: "https://www.ft.com/content/1b416427-0e86-40c0-9536-c31d76635313"
  },
  {
    id: "1f55518f-dad5-4c7b-8c81-ba82196dd747",
    title: "Barry Diller abandons $18bn takeover bid for MGM Resorts",
    date: "2026-09-24",
    time: "00:21",
    url: "https://www.ft.com/content/1f55518f-dad5-4c7b-8c81-ba82196dd747"
  },
  {
    id: "56133ef4-377b-4e35-a939-f199ceb64507",
    title: "OpenAI ‘agent’ hacked an Australian health service website",
    date: "2026-09-24",
    time: "00:04",
    url: "https://www.ft.com/content/56133ef4-377b-4e35-a939-f199ceb64507"
  },
  {
    id: "8b470f65-6fc3-44b6-9295-e07008ce302d",
    title: "HSBC moves board meeting from Dubai to London amid safety concerns",
    date: "2026-09-24",
    time: "00:01",
    url: "https://www.ft.com/content/8b470f65-6fc3-44b6-9295-e07008ce302d"
  },
  {
    id: "f9734489-4ed5-4e14-81d5-5f55fb1ac04c",
    title: "Arnault family moves to consolidate control of LVMH",
    date: "2026-09-23",
    time: "22:48",
    url: "https://www.ft.com/content/f9734489-4ed5-4e14-81d5-5f55fb1ac04c"
  }
];
