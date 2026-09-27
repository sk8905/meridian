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
    id: "48b8a95c-ef76-48a5-8449-0c56865c7e01",
    title: "Burnham’s high-stakes speech unlikely to produce a Clause IV moment",
    date: "2026-09-27",
    time: "18:15",
    url: "https://www.ft.com/content/48b8a95c-ef76-48a5-8449-0c56865c7e01"
  },
  {
    id: "d9de4776-1fc9-4f2b-aaaf-9961c35d8acd",
    title: "Corporate America embraces cheaper ‘open’ AI models",
    date: "2026-09-27",
    time: "18:00",
    url: "https://www.ft.com/content/d9de4776-1fc9-4f2b-aaaf-9961c35d8acd"
  },
  {
    id: "b15849ac-fa14-43cc-af96-fb9980158693",
    title: "The real lesson from the Man City affair",
    date: "2026-09-27",
    time: "17:58",
    url: "https://www.ft.com/content/b15849ac-fa14-43cc-af96-fb9980158693"
  },
  {
    id: "875027a3-db29-40a6-b17c-fa97c30fd07b",
    title: "Terrorism arrests made in ‘major incident’ near RAF Fairford",
    date: "2026-09-27",
    time: "17:47",
    url: "https://www.ft.com/content/875027a3-db29-40a6-b17c-fa97c30fd07b"
  },
  {
    id: "6c9db7fb-e213-43ca-b4d9-1e809dcfd39a",
    title: "‘Hope again’: Burnham returns to Labour conference to sell his vision",
    date: "2026-09-27",
    time: "17:40",
    url: "https://www.ft.com/content/6c9db7fb-e213-43ca-b4d9-1e809dcfd39a"
  },
  {
    id: "c9957c9f-8622-4351-9380-9b725b70b1e7",
    title: "Northern Ireland in tense stand-off as protests block Orange Order parade",
    date: "2026-09-27",
    time: "17:35",
    url: "https://www.ft.com/content/c9957c9f-8622-4351-9380-9b725b70b1e7"
  },
  {
    id: "c3bd247b-646f-4333-9250-da3d2c6e6c2c",
    title: "Spain erupts in fury over housing after eviction of 87-year-old woman",
    date: "2026-09-27",
    time: "17:27",
    url: "https://www.ft.com/content/c3bd247b-646f-4333-9250-da3d2c6e6c2c"
  },
  {
    id: "267379ff-8491-478b-a10f-ad19a67df37c",
    title: "Pay to play in the age of corporate migration",
    date: "2026-09-27",
    time: "16:00",
    url: "https://www.ft.com/content/267379ff-8491-478b-a10f-ad19a67df37c"
  },
  {
    id: "1276c358-4b3b-453d-b774-27aae2ecc486",
    title: "Milan Fashion Week seeks the fizz",
    date: "2026-09-27",
    time: "14:24",
    url: "https://www.ft.com/content/1276c358-4b3b-453d-b774-27aae2ecc486"
  },
  {
    id: "23cd91df-80c5-45c0-9175-d61b74404f12",
    title: "Andy Burnham signals he will fight election on tax rises to fund social care reform",
    date: "2026-09-27",
    time: "14:02",
    url: "https://www.ft.com/content/23cd91df-80c5-45c0-9175-d61b74404f12"
  },
  {
    id: "aaf4c7d7-b4bc-4b5c-83b7-7f761d315b63",
    title: "Swiss voters reject proposal to strengthen neutrality",
    date: "2026-09-27",
    time: "13:42",
    url: "https://www.ft.com/content/aaf4c7d7-b4bc-4b5c-83b7-7f761d315b63"
  },
  {
    id: "afb910e4-5425-4d3e-b0ef-c1d260f29945",
    title: "The India shock: exporting workers to the world",
    date: "2026-09-27",
    time: "12:00",
    url: "https://www.ft.com/content/afb910e4-5425-4d3e-b0ef-c1d260f29945"
  },
  {
    id: "08fe7323-5a2f-4d46-ad64-132ce469b381",
    title: "Will US jobs data add to pressure on Fed policymakers?",
    date: "2026-09-27",
    time: "12:00",
    url: "https://www.ft.com/content/08fe7323-5a2f-4d46-ad64-132ce469b381"
  },
  {
    id: "a1bff0d7-be5a-434f-8856-c45337b9449f",
    title: "Maha split shows all is not well with Kennedy’s US health revolution",
    date: "2026-09-27",
    time: "11:00",
    url: "https://www.ft.com/content/a1bff0d7-be5a-434f-8856-c45337b9449f"
  },
  {
    id: "762c1f08-a1bf-4118-8296-52ed96d76fa8",
    title: "The EU needs a clearer strategy for partners like Canada",
    date: "2026-09-27",
    time: "11:00",
    url: "https://www.ft.com/content/762c1f08-a1bf-4118-8296-52ed96d76fa8"
  },
  {
    id: "39eb5cb2-f73e-4c18-8357-f7378428c8e1",
    title: "Investors pursue Dubai investment group over missing payments",
    date: "2026-09-27",
    time: "10:38",
    url: "https://www.ft.com/content/39eb5cb2-f73e-4c18-8357-f7378428c8e1"
  },
  {
    id: "a2c22bca-f50a-440d-82f8-1a373859770d",
    title: "Value of old supertankers soars past new builds as market goes ‘bananas’",
    date: "2026-09-27",
    time: "05:00",
    url: "https://www.ft.com/content/a2c22bca-f50a-440d-82f8-1a373859770d"
  },
  {
    id: "b5707707-730e-40d3-9ff7-8ebfe27d5708",
    title: "Big dreams and tiny revenue are the new norm for AI IPOs",
    date: "2026-09-27",
    time: "05:00",
    url: "https://www.ft.com/content/b5707707-730e-40d3-9ff7-8ebfe27d5708"
  },
  {
    id: "8cd07ef8-1578-4697-9f8b-d1a6f5b60883",
    title: "The UK’s IMF bailout has things to teach us 50 years on",
    date: "2026-09-27",
    time: "05:00",
    url: "https://www.ft.com/content/8cd07ef8-1578-4697-9f8b-d1a6f5b60883"
  },
  {
    id: "474ced6c-b6ba-4d03-af41-bab5fbb6d7e9",
    title: "Europe braces for LNG tug of war with Asia",
    date: "2026-09-27",
    time: "05:00",
    url: "https://www.ft.com/content/474ced6c-b6ba-4d03-af41-bab5fbb6d7e9"
  },
  {
    id: "f342efa7-96b0-4bb2-aa19-fae740d8c286",
    title: "Private credit turmoil eases as investor withdrawals slow",
    date: "2026-09-27",
    time: "05:00",
    url: "https://www.ft.com/content/f342efa7-96b0-4bb2-aa19-fae740d8c286"
  },
  {
    id: "44ea845f-7048-4c98-b061-c9df7983af16",
    title: "Yields up",
    date: "2026-09-25",
    time: "18:06",
    url: "https://www.ft.com/content/44ea845f-7048-4c98-b061-c9df7983af16"
  },
  {
    id: "4acbdc1f-d898-4966-b865-924470de0066",
    title: "Bond ructions point to new danger zone in markets",
    date: "2026-09-25",
    time: "18:00",
    url: "https://www.ft.com/content/4acbdc1f-d898-4966-b865-924470de0066"
  },
  {
    id: "8c6f0c32-01b8-4490-afd3-96254b567168",
    title: "Stockpickers: Mortgage Advice Bureau, Luceco, Next",
    date: "2026-09-25",
    time: "18:00",
    url: "https://www.ft.com/content/8c6f0c32-01b8-4490-afd3-96254b567168"
  },
  {
    id: "4deafc9c-981b-4fd8-9f74-da0e8fce9651",
    title: "Directors’ Deals: AstraZeneca’s Soriot in a major show of faith",
    date: "2026-09-25",
    time: "18:00",
    url: "https://www.ft.com/content/4deafc9c-981b-4fd8-9f74-da0e8fce9651"
  },
  {
    id: "4c3f75a2-c2f9-4ef7-9895-21daf5e92dfe",
    title: "OK, so where are all these data centres?",
    date: "2026-09-25",
    time: "17:59",
    url: "https://www.ft.com/content/4c3f75a2-c2f9-4ef7-9895-21daf5e92dfe"
  },
  {
    id: "f9d5e0af-0106-4909-a854-7bd69cbb74ab",
    title: "What an AI maths breakthrough means for human discovery",
    date: "2026-09-25",
    time: "17:48",
    url: "https://www.ft.com/content/f9d5e0af-0106-4909-a854-7bd69cbb74ab"
  },
  {
    id: "5c15c5a9-9529-41c4-ad76-8b702583df4f",
    title: "India police detain dozens of protesters against election commission",
    date: "2026-09-25",
    time: "17:29",
    url: "https://www.ft.com/content/5c15c5a9-9529-41c4-ad76-8b702583df4f"
  },
  {
    id: "469c3f85-ee58-41ed-8289-33866a72549a",
    title: "US Supreme Court lets Trump deploy voter database ahead of midterms",
    date: "2026-09-25",
    time: "17:22",
    url: "https://www.ft.com/content/469c3f85-ee58-41ed-8289-33866a72549a"
  },
  {
    id: "08b4cf3d-3418-4159-b641-533fdb305d3e",
    title: "The case for talking to China is not a case for détente",
    date: "2026-09-25",
    time: "17:21",
    url: "https://www.ft.com/content/08b4cf3d-3418-4159-b641-533fdb305d3e"
  },
  {
    id: "917a9cba-6afd-4ba3-8742-2b7601ecc2ba",
    title: "Iran offers US new seven-day ceasefire proposal",
    date: "2026-09-25",
    time: "17:16",
    url: "https://www.ft.com/content/917a9cba-6afd-4ba3-8742-2b7601ecc2ba"
  },
  {
    id: "0206443e-a4ca-4316-a583-267aa74b0298",
    title: "Burnham’s opposition to Heathrow expansion puts third runway in doubt",
    date: "2026-09-25",
    time: "17:02",
    url: "https://www.ft.com/content/0206443e-a4ca-4316-a583-267aa74b0298"
  },
  {
    id: "2f820ff9-28c2-4e53-9948-6be009a8a23c",
    title: "Manchester City found guilty of breaching Premier League rules",
    date: "2026-09-25",
    time: "17:02",
    url: "https://www.ft.com/content/2f820ff9-28c2-4e53-9948-6be009a8a23c"
  },
  {
    id: "db266f36-c6d3-4368-8633-290e2c35e54d",
    title: "Submit a question: What’s next for the global economy?",
    date: "2026-09-25",
    time: "16:53",
    url: "https://www.ft.com/content/db266f36-c6d3-4368-8633-290e2c35e54d"
  },
  {
    id: "c5af4151-2c14-481b-8145-f5ec1f43a3f4",
    title: "US bond sell-off pushes long-term yields to new post-2004 high",
    date: "2026-09-25",
    time: "16:37",
    url: "https://www.ft.com/content/c5af4151-2c14-481b-8145-f5ec1f43a3f4"
  },
  {
    id: "7fbecb15-c396-49d2-8cab-1518809a7b2b",
    title: "Russia targets Ukraine’s data centres",
    date: "2026-09-25",
    time: "16:19",
    url: "https://www.ft.com/content/7fbecb15-c396-49d2-8cab-1518809a7b2b"
  },
  {
    id: "df673db6-ffef-4c06-b2d1-b9b4f1e43869",
    title: "FTAV’s Friday chart quiz",
    date: "2026-09-25",
    time: "16:11",
    url: "https://www.ft.com/content/df673db6-ffef-4c06-b2d1-b9b4f1e43869"
  },
  {
    id: "1cc67221-b54e-4ff9-a499-01209c7999d8",
    title: "Pope makes rare address at France’s Élysée Palace",
    date: "2026-09-25",
    time: "15:53",
    url: "https://www.ft.com/content/1cc67221-b54e-4ff9-a499-01209c7999d8"
  },
  {
    id: "c0cffdfc-ad4b-48dc-9894-c1e8492962c7",
    title: "The challenge for Burnham: words are no longer enough",
    date: "2026-09-25",
    time: "15:28",
    url: "https://www.ft.com/content/c0cffdfc-ad4b-48dc-9894-c1e8492962c7"
  },
  {
    id: "82933f2b-84ec-467f-9bd0-b36b41a849cd",
    title: "UK graduates paying 50% more of university costs since 2012",
    date: "2026-09-25",
    time: "15:20",
    url: "https://www.ft.com/content/82933f2b-84ec-467f-9bd0-b36b41a849cd"
  },
];
