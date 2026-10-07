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
  {
    id: "2895a744-9538-4bc9-ac9b-686677f5cdb2",
    title: "August wage growth poses no obstacle to more BoJ tightening",
    date: "2026-10-07",
    time: "09:01",
    url: "https://www.ft.com/content/2895a744-9538-4bc9-ac9b-686677f5cdb2",
  },
  {
    id: "713ccee6-855f-48d8-acf1-161265041ad8",
    title: "India raises interest rates for first time in 3 years",
    date: "2026-10-07",
    time: "08:04",
    url: "https://www.ft.com/content/713ccee6-855f-48d8-acf1-161265041ad8",
  },
  {
    id: "7eb5da58-d909-4cec-9a30-1c6ec8ffb0a6",
    title: "IMF’s Kristalina Georgieva urges governments to rein in spending",
    date: "2026-10-07",
    time: "07:00",
    url: "https://www.ft.com/content/7eb5da58-d909-4cec-9a30-1c6ec8ffb0a6",
  },
  {
    id: "dcf35eaf-e1d3-4289-bc7a-e0c91725ad59",
    title: "Donald Trump says he will speak with Vladimir Putin about pneumonic plague",
    date: "2026-10-07",
    time: "06:33",
    url: "https://www.ft.com/content/dcf35eaf-e1d3-4289-bc7a-e0c91725ad59",
  },
  {
    id: "16df642e-dc1a-4d17-8f18-b97f32efc5db",
    title: "Neat tricks to help French bonds",
    date: "2026-10-07",
    time: "06:30",
    url: "https://www.ft.com/content/16df642e-dc1a-4d17-8f18-b97f32efc5db",
  },
  {
    id: "2a7ccefb-416c-4aa7-91a0-b1a2ac56dea5",
    title: "FTAV’s further reading",
    date: "2026-10-07",
    time: "06:30",
    url: "https://www.ft.com/content/2a7ccefb-416c-4aa7-91a0-b1a2ac56dea5",
  },
  {
    id: "f065a2f6-6109-46d8-b11b-37ce2a81017c",
    title: "Brussels pleads with EU capitals not to slash the bloc’s next shared budget",
    date: "2026-10-07",
    time: "06:00",
    url: "https://www.ft.com/content/f065a2f6-6109-46d8-b11b-37ce2a81017c",
  },
  {
    id: "0c188b13-a8e5-4447-8e54-2d50ce4ab082",
    title: "Who’d be betting against Webuild, the builder that built Italy?",
    date: "2026-10-07",
    time: "06:00",
    url: "https://www.ft.com/content/0c188b13-a8e5-4447-8e54-2d50ce4ab082",
  },
  {
    id: "29d249eb-ed06-4ab1-8f17-c11c5589cf74",
    title: "FirstFT: Brussels explores broad levy targeting revenue from US tech",
    date: "2026-10-07",
    time: "05:31",
    url: "https://www.ft.com/content/29d249eb-ed06-4ab1-8f17-c11c5589cf74",
  },
  {
    id: "0a64ce3b-d56a-4829-948c-4abc4978b1c9",
    title: "Germany’s beleaguered spies face a fresh scandal",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/0a64ce3b-d56a-4829-948c-4abc4978b1c9",
  },
  {
    id: "99968044-a1f7-4722-b407-2a7310b27ca9",
    title: "Private equity’s future after the boom and bust",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/99968044-a1f7-4722-b407-2a7310b27ca9",
  },
  {
    id: "86bcbc9c-bc46-47fe-871c-20e6369231b9",
    title: "If supermarket M&A is back, Sainsbury’s is in a sweet spot",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/86bcbc9c-bc46-47fe-871c-20e6369231b9",
  },
  {
    id: "796e3264-b277-4fdd-8c23-4ce8ba6a7775",
    title: "HMRC opened probe into Man City’s tax affairs in 2018",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/796e3264-b277-4fdd-8c23-4ce8ba6a7775",
  },
  {
    id: "7c38e8e3-8035-4036-8bc0-5fba2fbf77cb",
    title: "Robust AI spending sets investors up for another bumper US earnings season",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/7c38e8e3-8035-4036-8bc0-5fba2fbf77cb",
  },
  {
    id: "8178bed1-ef14-4ebc-b291-921cef8866e7",
    title: "Bank mergers arrive in Europe with a whimper rather than a bang",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/8178bed1-ef14-4ebc-b291-921cef8866e7",
  },
  {
    id: "3fb9f6ee-4ce2-412a-ab0c-c542d76cb9ec",
    title: "Can I appoint a guardian to look after my children if I die?",
    date: "2026-10-07",
    time: "05:00",
    url: "https://www.ft.com/content/3fb9f6ee-4ce2-412a-ab0c-c542d76cb9ec",
  },
];
