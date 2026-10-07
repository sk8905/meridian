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
    id: "20557850-9cd1-4685-8238-f292023afc1f",
    title: "SEC warns asset managers against collaborating on activist campaigns",
    date: "2026-10-07",
    time: "18:07",
    url: "https://www.ft.com/content/20557850-9cd1-4685-8238-f292023afc1f",
  },
  {
    id: "21d4101f-ba5e-49e9-8c38-6b38ed5f1ca3",
    title: "Badenoch’s UK Conservatives are a work in progress",
    date: "2026-10-07",
    time: "18:00",
    url: "https://www.ft.com/content/21d4101f-ba5e-49e9-8c38-6b38ed5f1ca3",
  },
  {
    id: "32e1c801-fe7d-4389-b3fc-ab687cbb087b",
    title: "China slaps down EU request for voluntary curbs on hybrid car exports",
    date: "2026-10-07",
    time: "17:56",
    url: "https://www.ft.com/content/32e1c801-fe7d-4389-b3fc-ab687cbb087b",
  },
  {
    id: "8b9709f4-fc67-488d-ace6-8a5e2bcb775b",
    title: "London gold market body accused of causing deaths of two miners",
    date: "2026-10-07",
    time: "17:53",
    url: "https://www.ft.com/content/8b9709f4-fc67-488d-ace6-8a5e2bcb775b",
  },
  {
    id: "1f101722-bfb7-4872-b7d9-70039c981615",
    title: "Merz’s conservatives in new crisis over alleged support for AfD",
    date: "2026-10-07",
    time: "17:24",
    url: "https://www.ft.com/content/1f101722-bfb7-4872-b7d9-70039c981615",
  },
  {
    id: "870ed142-0418-4685-9347-d8c0caacdc58",
    title: "Australian court ruling on climate impact of coal mining a ‘blow’, says industry",
    date: "2026-10-07",
    time: "16:59",
    url: "https://www.ft.com/content/870ed142-0418-4685-9347-d8c0caacdc58",
  },
  {
    id: "5465abcc-4c04-4cee-a0bc-455a63533480",
    title: "Israelis commemorate October 7 attack as election looms",
    date: "2026-10-07",
    time: "16:56",
    url: "https://www.ft.com/content/5465abcc-4c04-4cee-a0bc-455a63533480",
  },
  {
    id: "b07bd481-a492-4b95-af55-914176f8d2b6",
    title: "The important judgments for Healey in the coming Budget",
    date: "2026-10-07",
    time: "16:06",
    url: "https://www.ft.com/content/b07bd481-a492-4b95-af55-914176f8d2b6",
  },
  {
    id: "742f1f44-1b5f-4905-8a09-1c14bce54b4d",
    title: "Kemi Badenoch promises to scrap inheritance tax on family homes",
    date: "2026-10-07",
    time: "16:03",
    url: "https://www.ft.com/content/742f1f44-1b5f-4905-8a09-1c14bce54b4d",
  },
  {
    id: "63755a98-d187-4b92-b49c-5b33af666517",
    title: "Six things we learnt from the Tory party conference",
    date: "2026-10-07",
    time: "16:02",
    url: "https://www.ft.com/content/63755a98-d187-4b92-b49c-5b33af666517",
  },
  {
    id: "ff76eda4-0c63-4fcd-a5a1-2729fbbffccc",
    title: "US oil trader takes $2bn gamble on tankers as carriers steer clear of Hormuz",
    date: "2026-10-07",
    time: "16:00",
    url: "https://www.ft.com/content/ff76eda4-0c63-4fcd-a5a1-2729fbbffccc",
  },
  {
    id: "26fbedff-82fc-4f09-a5fd-2cb2add7d643",
    title: "Scientists unveil first ultra-accurate nuclear clocks",
    date: "2026-10-07",
    time: "16:00",
    url: "https://www.ft.com/content/26fbedff-82fc-4f09-a5fd-2cb2add7d643",
  },
  {
    id: "c2c6a470-b1c9-4f98-af3a-65983371e6b8",
    title: "Can you beat the S&P 500? Sign up for the FT stock picking game",
    date: "2026-10-07",
    time: "15:51",
    url: "https://www.ft.com/content/c2c6a470-b1c9-4f98-af3a-65983371e6b8",
  },
  {
    id: "923f001a-8f2e-4138-80f6-48452a5be199",
    title: "Sleepy European telcos turn to data centre craze",
    date: "2026-10-07",
    time: "15:28",
    url: "https://www.ft.com/content/923f001a-8f2e-4138-80f6-48452a5be199",
  },
  {
    id: "7efb6b02-a2dd-4940-9768-68c508fd838f",
    title: "Reform UK internal probe clears senior officials of breaking law over donor sting",
    date: "2026-10-07",
    time: "14:50",
    url: "https://www.ft.com/content/7efb6b02-a2dd-4940-9768-68c508fd838f",
  },
  {
    id: "68c0fcb8-a69e-4767-a7fc-f84acb04cbd7",
    title: "Billionaire Weston family to buy Boots in $8.9bn deal",
    date: "2026-10-07",
    time: "14:50",
    url: "https://www.ft.com/content/68c0fcb8-a69e-4767-a7fc-f84acb04cbd7",
  },
  {
    id: "9c61d1a4-c982-41d5-a96e-f06df406c7e9",
    title: "Ex-Barclays traders’ rate-rigging convictions quashed",
    date: "2026-10-07",
    time: "14:03",
    url: "https://www.ft.com/content/9c61d1a4-c982-41d5-a96e-f06df406c7e9",
  },
  {
    id: "a52c092f-b93b-472b-8e18-83910c3a6260",
    title: "We need a US debt conversation — will the Republicans have one?",
    date: "2026-10-07",
    time: "14:00",
    url: "https://www.ft.com/content/a52c092f-b93b-472b-8e18-83910c3a6260",
  },
  {
    id: "586b9209-7eee-441f-8455-36a1fd40822f",
    title: "Ann Widdecombe murder suspect accused of trying to break into Nigel Farage’s home",
    date: "2026-10-07",
    time: "13:42",
    url: "https://www.ft.com/content/586b9209-7eee-441f-8455-36a1fd40822f",
  },
  {
    id: "89a7f4f6-2c7a-45bb-9a09-b9d94a9c7944",
    title: "What we know about the suspected plague case in Russia",
    date: "2026-10-07",
    time: "13:34",
    url: "https://www.ft.com/content/89a7f4f6-2c7a-45bb-9a09-b9d94a9c7944",
  },
  {
    id: "f642cd3b-303e-48e2-82c9-15c07c6b9042",
    title: "Royal Mail to cut 2,500 jobs to fund £500mn delivery improvement plan",
    date: "2026-10-07",
    time: "13:30",
    url: "https://www.ft.com/content/f642cd3b-303e-48e2-82c9-15c07c6b9042",
  },
  {
    id: "d9ba8e1f-54f9-4739-9ce3-94e62d585e26",
    title: "French central bank chief says ECB intervention not needed to ease bond rout",
    date: "2026-10-07",
    time: "13:19",
    url: "https://www.ft.com/content/d9ba8e1f-54f9-4739-9ce3-94e62d585e26",
  },
  {
    id: "0cb02773-d207-4920-8c74-d9707d2622a0",
    title: "Google launches platform to create video games from text prompts",
    date: "2026-10-07",
    time: "13:00",
    url: "https://www.ft.com/content/0cb02773-d207-4920-8c74-d9707d2622a0",
  },
  {
    id: "33c67aa0-bfdb-457b-84bb-960b4fed94b6",
    title: "Global bond sell-off resumes as 30-year Treasury yield hits highest since 2002",
    date: "2026-10-07",
    time: "12:42",
    url: "https://www.ft.com/content/33c67aa0-bfdb-457b-84bb-960b4fed94b6",
  },
  {
    id: "d51a78a8-67d8-45bd-b32c-1eafe39a0794",
    title: "Submit a question: What is driving the global bond sell-off?",
    date: "2026-10-07",
    time: "12:26",
    url: "https://www.ft.com/content/d51a78a8-67d8-45bd-b32c-1eafe39a0794",
  },
  {
    id: "8832caa0-2867-4754-841a-75e673686f18",
    title: "Kemi Badenoch’s European nightmare",
    date: "2026-10-07",
    time: "12:14",
    url: "https://www.ft.com/content/8832caa0-2867-4754-841a-75e673686f18",
  },
  {
    id: "3616b259-723d-4797-a96c-be617d673feb",
    title: "Germany blocks Chinese acquisition in its largest seaport",
    date: "2026-10-07",
    time: "12:08",
    url: "https://www.ft.com/content/3616b259-723d-4797-a96c-be617d673feb",
  },
  {
    id: "aed8a3e0-04d8-4037-b1d7-8a87d0bc9abd",
    title: "Safeguarding rules threaten Andy Burnham’s work experience plans, companies and educators warn",
    date: "2026-10-07",
    time: "12:06",
    url: "https://www.ft.com/content/aed8a3e0-04d8-4037-b1d7-8a87d0bc9abd",
  },
  {
    id: "ad767b0a-d6c4-4728-b82d-56a33154ddd8",
    title: "Volkswagen sets aside £725mn for car mis-selling scandal",
    date: "2026-10-07",
    time: "12:05",
    url: "https://www.ft.com/content/ad767b0a-d6c4-4728-b82d-56a33154ddd8",
  },
  {
    id: "a7af63b4-70de-4c08-8aa1-1eb2298d7f2f",
    title: "UK urged to impose tariffs on Chinese chemical at centre of EU trade dispute",
    date: "2026-10-07",
    time: "11:56",
    url: "https://www.ft.com/content/a7af63b4-70de-4c08-8aa1-1eb2298d7f2f",
  },
  {
    id: "6a2dc960-c9fd-4795-b5ea-78f9bb77309d",
    title: "Houthi rebels target Riyadh and Aden in new missile barrage",
    date: "2026-10-07",
    time: "11:46",
    url: "https://www.ft.com/content/6a2dc960-c9fd-4795-b5ea-78f9bb77309d",
  },
  {
    id: "b4896507-e830-44b4-a402-52a980c912aa",
    title: "Ineos arm’s oil and gas earnings offset chemicals downturn",
    date: "2026-10-07",
    time: "11:41",
    url: "https://www.ft.com/content/b4896507-e830-44b4-a402-52a980c912aa",
  },
  {
    id: "76adb82b-3181-4d05-a383-a8131bdb19af",
    title: "David Ellison built a Hollywood colossus. Now he needs to run it",
    date: "2026-10-07",
    time: "11:28",
    url: "https://www.ft.com/content/76adb82b-3181-4d05-a383-a8131bdb19af",
  },
  {
    id: "a04ef3b4-2fcf-48f9-ab34-2c40c39d9a0c",
    title: "How US mortgage bonds can trigger a ‘vicious loop’ for Treasury yields",
    date: "2026-10-07",
    time: "11:20",
    url: "https://www.ft.com/content/a04ef3b4-2fcf-48f9-ab34-2c40c39d9a0c",
  },
  {
    id: "a5bd820e-fc7c-4414-ad90-f77bd7aa3a44",
    title: "Deadly Russian strikes cut power in several Kyiv districts",
    date: "2026-10-07",
    time: "10:46",
    url: "https://www.ft.com/content/a5bd820e-fc7c-4414-ad90-f77bd7aa3a44",
  },
  {
    id: "a21ec190-edcd-454e-886a-302b0a16ea82",
    title: "AI agents could cost banks $500bn — by winning savers better rates",
    date: "2026-10-07",
    time: "09:51",
    url: "https://www.ft.com/content/a21ec190-edcd-454e-886a-302b0a16ea82",
  },
  {
    id: "8b0ad0c9-88a1-412e-8658-7f93f510d008",
    title: "Five things Kemi Badenoch must do to win",
    date: "2026-10-07",
    time: "09:38",
    url: "https://www.ft.com/content/8b0ad0c9-88a1-412e-8658-7f93f510d008",
  },
  {
    id: "9e1cf8ac-68b7-44bf-8e99-0bc1c75e2c21",
    title: "Tory conference live: Kemi Badenoch to address Conservative Party",
    date: "2026-10-07",
    time: "09:37",
    url: "https://www.ft.com/content/9e1cf8ac-68b7-44bf-8e99-0bc1c75e2c21",
  },
  {
    id: "87155c48-b8fc-4a24-bace-5d20b3f40162",
    title: "Mike Ashley’s Frasers Group snaps up stake in Under Armour",
    date: "2026-10-07",
    time: "09:19",
    url: "https://www.ft.com/content/87155c48-b8fc-4a24-bace-5d20b3f40162",
  },
  {
    id: "84d9a203-7231-452d-846b-8e502ca2e2a5",
    title: "Japan to slash hundreds of stocks from Topix index in record revamp",
    date: "2026-10-07",
    time: "09:15",
    url: "https://www.ft.com/content/84d9a203-7231-452d-846b-8e502ca2e2a5",
  },
];
