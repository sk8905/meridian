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
    id: "2a77e2f7-3c22-4082-8bb3-492675f46c77",
    title: "OpenAI breach of Australian government linked to wider AI hacking campaign",
    date: "2026-09-24",
    time: "22:06",
    url: "https://www.ft.com/content/2a77e2f7-3c22-4082-8bb3-492675f46c77"
  },
  {
    id: "19b54cea-1fdc-40ba-b09b-d289b7f39295",
    title: "Australia’s rival football giants kick off global growth push",
    date: "2026-09-24",
    time: "22:00",
    url: "https://www.ft.com/content/19b54cea-1fdc-40ba-b09b-d289b7f39295"
  },
  {
    id: "17b09993-8fed-47d1-9c04-e2d29ca75615",
    title: "SoftBank pays steep price for record bond sale to fund OpenAI bet",
    date: "2026-09-24",
    time: "20:39",
    url: "https://www.ft.com/content/17b09993-8fed-47d1-9c04-e2d29ca75615"
  },
  {
    id: "ad6d56fa-6a6e-43bd-8f12-205a3f94ac0e",
    title: "Pioneer founder Scott Sheffield says Exxon ‘set him up’ after $60bn takeover",
    date: "2026-09-24",
    time: "20:27",
    url: "https://www.ft.com/content/ad6d56fa-6a6e-43bd-8f12-205a3f94ac0e"
  },
  {
    id: "2d87f8bf-d529-4997-90c5-393ef65d280c",
    title: "US long-term borrowing costs touch highest level since 2004",
    date: "2026-09-24",
    time: "19:21",
    url: "https://www.ft.com/content/2d87f8bf-d529-4997-90c5-393ef65d280c"
  },
  {
    id: "979ae3ac-4623-4fe9-a771-43ce451a9e73",
    title: "Global politics live: Benjamin Netanyahu tells UN Israel and US launched Iran war to ‘save civilisation’",
    date: "2026-09-24",
    time: "19:05",
    url: "https://www.ft.com/content/979ae3ac-4623-4fe9-a771-43ce451a9e73"
  },
  {
    id: "bdec4129-ccac-4149-aa53-90ddd50cb925",
    title: "Goldman reaped more than $200mn in fees from hedge fund Situational Awareness",
    date: "2026-09-24",
    time: "19:00",
    url: "https://www.ft.com/content/bdec4129-ccac-4149-aa53-90ddd50cb925"
  },
  {
    id: "24c13fd3-5de5-4916-8300-ec3073027ff6",
    title: "Xi Jinping says US and China must ‘coexist in peace’ in historic White House visit",
    date: "2026-09-24",
    time: "18:53",
    url: "https://www.ft.com/content/24c13fd3-5de5-4916-8300-ec3073027ff6"
  },
  {
    id: "e60b40b6-dae5-4ccf-83cc-978269cbcaa5",
    title: "The AI agent revolution has moved a big step closer",
    date: "2026-09-24",
    time: "18:33",
    url: "https://www.ft.com/content/e60b40b6-dae5-4ccf-83cc-978269cbcaa5"
  },
  {
    id: "82dbd39c-f8dd-4ef1-8a80-d430a22579bd",
    title: "Oracle feels the force",
    date: "2026-09-24",
    time: "18:20",
    url: "https://www.ft.com/content/82dbd39c-f8dd-4ef1-8a80-d430a22579bd"
  },
  {
    id: "68173e02-88e8-4819-9543-cff7d024c476",
    title: "Burnham under pressure to lobby Trump on US diesel export ban",
    date: "2026-09-24",
    time: "18:16",
    url: "https://www.ft.com/content/68173e02-88e8-4819-9543-cff7d024c476"
  },
  {
    id: "37224743-806c-4833-abc3-236ff1be4ddd",
    title: "Russia’s $6.9bn sanctions evasion scheme",
    date: "2026-09-24",
    time: "18:00",
    url: "https://www.ft.com/content/37224743-806c-4833-abc3-236ff1be4ddd"
  },
  {
    id: "72d1df1f-cc71-4e17-a442-0a4201ba41aa",
    title: "White House says it has restored access to banned press outlets",
    date: "2026-09-24",
    time: "17:57",
    url: "https://www.ft.com/content/72d1df1f-cc71-4e17-a442-0a4201ba41aa"
  },
  {
    id: "2d158978-0ec5-4fda-b0dc-f04d462c215d",
    title: "City of London wins approval for skyscraper plan",
    date: "2026-09-24",
    time: "17:39",
    url: "https://www.ft.com/content/2d158978-0ec5-4fda-b0dc-f04d462c215d"
  },
  {
    id: "28ea6751-90a5-4538-b577-71bb123e81b7",
    title: "Is the UK electorate fragmenting? Not so fast",
    date: "2026-09-24",
    time: "17:30",
    url: "https://www.ft.com/content/28ea6751-90a5-4538-b577-71bb123e81b7"
  },
  {
    id: "cabe2c29-9f66-470b-b7ac-b2bc324aa367",
    title: "US mortgage rates breach 7% as affordability pressures mount",
    date: "2026-09-24",
    time: "17:12",
    url: "https://www.ft.com/content/cabe2c29-9f66-470b-b7ac-b2bc324aa367"
  },
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
];
