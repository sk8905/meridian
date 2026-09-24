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
    id: "ded9ae05-3c5c-431e-926b-9cb1864e4fb0",
    title: "Russia raises taxes to fund its war in Ukraine",
    date: "2026-09-24",
    time: "16:52",
    url: "https://www.ft.com/content/ded9ae05-3c5c-431e-926b-9cb1864e4fb0"
  },
  {
    id: "4a81833e-c853-46be-af48-0ee8af8b4b74",
    title: "Tax-free UK pension withdrawals have doubled since Labour came to power",
    date: "2026-09-24",
    time: "16:43",
    url: "https://www.ft.com/content/4a81833e-c853-46be-af48-0ee8af8b4b74"
  },
  {
    id: "0c5da9f2-f6aa-4514-910d-5337207e1233",
    title: "UAE halts Iranian flights over US sanctions",
    date: "2026-09-24",
    time: "16:41",
    url: "https://www.ft.com/content/0c5da9f2-f6aa-4514-910d-5337207e1233"
  },
  {
    id: "46ea15a9-593d-45da-9705-a4928086b38d",
    title: "MPs to consider whether Bank of England’s remit is ‘fit for purpose’",
    date: "2026-09-24",
    time: "16:18",
    url: "https://www.ft.com/content/46ea15a9-593d-45da-9705-a4928086b38d"
  },
  {
    id: "37e6c9d9-2237-468d-b0c5-18b5d09c2ccc",
    title: "HSBC axes $26,000 perk for Hong Kong bankers to join members’ clubs",
    date: "2026-09-24",
    time: "15:58",
    url: "https://www.ft.com/content/37e6c9d9-2237-468d-b0c5-18b5d09c2ccc"
  },
  {
    id: "2d87f8bf-d529-4997-90c5-393ef65d280c",
    title: "US long-term borrowing costs touch highest level since 2004",
    date: "2026-09-24",
    time: "15:53",
    url: "https://www.ft.com/content/2d87f8bf-d529-4997-90c5-393ef65d280c"
  },
  {
    id: "6cc7149f-a9f1-47f6-9faf-b98a28f9aedc",
    title: "GoDaddy receives takeover offer from maker of Norton antivirus software",
    date: "2026-09-24",
    time: "15:23",
    url: "https://www.ft.com/content/6cc7149f-a9f1-47f6-9faf-b98a28f9aedc"
  },
  {
    id: "2bf6bba0-a361-474b-b5d6-6461695ecc4a",
    title: "Isabel Schnabel to leave ECB early to join IMF",
    date: "2026-09-24",
    time: "14:32",
    url: "https://www.ft.com/content/2bf6bba0-a361-474b-b5d6-6461695ecc4a"
  },
  {
    id: "cf5cf060-401f-43cb-92d1-72afc38b3d3a",
    title: "Five is the magic number for US Treasuries",
    date: "2026-09-24",
    time: "14:11",
    url: "https://www.ft.com/content/cf5cf060-401f-43cb-92d1-72afc38b3d3a"
  },
  {
    id: "7eb47e53-d130-4c5a-858e-49df9bd4f5fe",
    title: "Space: the final frontline",
    date: "2026-09-24",
    time: "14:09",
    url: "https://www.ft.com/content/7eb47e53-d130-4c5a-858e-49df9bd4f5fe"
  },
  {
    id: "1f52f41a-f7db-49cc-b40e-c9d29aa01b9f",
    title: "Donald Trump and Xi Jinping extend trade truce to January",
    date: "2026-09-24",
    time: "14:00",
    url: "https://www.ft.com/content/1f52f41a-f7db-49cc-b40e-c9d29aa01b9f"
  },
  {
    id: "ffb35fa4-b003-4d04-adeb-5aa67af294c5",
    title: "Europe’s biggest stainless steelmaker finds new way to extract critical metal",
    date: "2026-09-24",
    time: "14:00",
    url: "https://www.ft.com/content/ffb35fa4-b003-4d04-adeb-5aa67af294c5"
  },
  {
    id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7",
    title: "Latest savings rates",
    date: "2026-09-24",
    time: "13:42",
    url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7"
  },
  {
    id: "75ba3055-625c-4cb5-894b-0696a38f5e79",
    title: "Latest Isa rates",
    date: "2026-09-24",
    time: "13:35",
    url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79"
  },
  {
    id: "68b36b6d-71e7-4f44-bbfb-a202e36603a4",
    title: "Latest National Savings & Investments rates",
    date: "2026-09-24",
    time: "13:28",
    url: "https://www.ft.com/content/68b36b6d-71e7-4f44-bbfb-a202e36603a4"
  },
  {
    id: "0298b4b9-d72d-4f3c-b5f4-863ac54a7645",
    title: "19 smart ways to spend it in September",
    date: "2026-09-24",
    time: "13:03",
    url: "https://www.ft.com/content/0298b4b9-d72d-4f3c-b5f4-863ac54a7645"
  },
  {
    id: "979ae3ac-4623-4fe9-a771-43ce451a9e73",
    title: "Trump-Xi summit live: US president wants to leave AI ‘exactly where it is’",
    date: "2026-09-24",
    time: "12:48",
    url: "https://www.ft.com/content/979ae3ac-4623-4fe9-a771-43ce451a9e73"
  },
  {
    id: "5b6772c8-907a-4230-9e01-54394550e0e5",
    title: "The risks of calling an early election for Andy Burnham",
    date: "2026-09-24",
    time: "12:39",
    url: "https://www.ft.com/content/5b6772c8-907a-4230-9e01-54394550e0e5"
  },
  {
    id: "0d8b3a97-e49d-4eca-b958-aaec0faad82b",
    title: "You want honesty, Andy? Britain is out of easy options",
    date: "2026-09-24",
    time: "12:18",
    url: "https://www.ft.com/content/0d8b3a97-e49d-4eca-b958-aaec0faad82b"
  },
  {
    id: "9a84cd29-09fa-44b8-95b3-68379769c256",
    title: "Data centre boom emerges as wedge issue in Texas midterms",
    date: "2026-09-24",
    time: "12:00",
    url: "https://www.ft.com/content/9a84cd29-09fa-44b8-95b3-68379769c256"
  },
  {
    id: "b4141b98-0118-4624-8cb0-5d158ba0751d",
    title: "Russia could attack Nato country within months, Denmark warns",
    date: "2026-09-24",
    time: "11:44",
    url: "https://www.ft.com/content/b4141b98-0118-4624-8cb0-5d158ba0751d"
  },
  {
    id: "c9ae9433-50e0-4711-90fa-d1e5aeb15eaf",
    title: "UK bank tax receipts jump 20% following surge in profits",
    date: "2026-09-24",
    time: "11:34",
    url: "https://www.ft.com/content/c9ae9433-50e0-4711-90fa-d1e5aeb15eaf"
  },
  {
    id: "916603fa-c0c4-49e9-911a-a536ec3e245d",
    title: "FirstFT: OpenAI ‘agent’ hacks Australian government website",
    date: "2026-09-24",
    time: "11:10",
    url: "https://www.ft.com/content/916603fa-c0c4-49e9-911a-a536ec3e245d"
  },
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
];
