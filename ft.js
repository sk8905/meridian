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
    id: "9cf103ed-548e-4b06-baed-71632abca961",
    title: "Big investors ‘bottom fish’ in Eurozone bond markets after France sell-off",
    date: "2026-10-08",
    time: "17:06",
    url: "https://www.ft.com/content/9cf103ed-548e-4b06-baed-71632abca961",
  },
  {
    id: "05f80d05-c80f-48ff-a65d-f379d77ed8af",
    title: "EY challenges Deloitte in outsourcing as revenue growth accelerates",
    date: "2026-10-08",
    time: "17:00",
    url: "https://www.ft.com/content/05f80d05-c80f-48ff-a65d-f379d77ed8af",
  },
  {
    id: "b2325cbe-44b6-4941-a60d-97fd9cff47ce",
    title: "Two Latvian nationals arrested on suspicion of trespass at RAF base",
    date: "2026-10-08",
    time: "16:37",
    url: "https://www.ft.com/content/b2325cbe-44b6-4941-a60d-97fd9cff47ce",
  },
  {
    id: "efdc00f5-2e70-40ba-803b-538e9e63462e",
    title: "UK pension ‘triple lock’ was first costed at just £50mn, says ex-government adviser",
    date: "2026-10-08",
    time: "16:21",
    url: "https://www.ft.com/content/efdc00f5-2e70-40ba-803b-538e9e63462e",
  },
  {
    id: "c163a470-e73f-4fdb-91fb-426004b21f22",
    title: "Daughter of Trump’s chief of staff works at firm that lobbies for Republika Srpska",
    date: "2026-10-08",
    time: "16:17",
    url: "https://www.ft.com/content/c163a470-e73f-4fdb-91fb-426004b21f22",
  },
  {
    id: "eec1e15d-78b9-4706-a518-2a9db4f37128",
    title: "Repeated US Treasury interventions risk an erosion of credibility",
    date: "2026-10-08",
    time: "15:30",
    url: "https://www.ft.com/content/eec1e15d-78b9-4706-a518-2a9db4f37128",
  },
  {
    id: "212f15c8-a897-4db0-bacf-d1556a11b9ed",
    title: "Goldman Sachs to pay top executives $500mn in special bonuses",
    date: "2026-10-08",
    time: "15:14",
    url: "https://www.ft.com/content/212f15c8-a897-4db0-bacf-d1556a11b9ed",
  },
  {
    id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7",
    title: "Latest savings rates",
    date: "2026-10-08",
    time: "13:02",
    url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7",
  },
  {
    id: "75ba3055-625c-4cb5-894b-0696a38f5e79",
    title: "Latest Isa rates",
    date: "2026-10-08",
    time: "12:56",
    url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79",
  },
  {
    id: "79cef26a-e5e9-41d0-9af2-876dc23a9a7d",
    title: "Starbucks has explored takeover of Chipotle in restaurant megadeal",
    date: "2026-10-08",
    time: "15:06",
    url: "https://www.ft.com/content/79cef26a-e5e9-41d0-9af2-876dc23a9a7d",
  },
  {
    id: "96474d3e-7d61-4327-b6c2-ed37eecad3f8",
    title: "UK investors face three-month wait to recoup money from property funds",
    date: "2026-10-08",
    time: "15:03",
    url: "https://www.ft.com/content/96474d3e-7d61-4327-b6c2-ed37eecad3f8",
  },
  {
    id: "3f0d45e0-18a5-420d-8db4-d8224d87b8e6",
    title: "Avocado giant Mission Produce banks on orchards outside Mexico to help meet US demand",
    date: "2026-10-08",
    time: "15:00",
    url: "https://www.ft.com/content/3f0d45e0-18a5-420d-8db4-d8224d87b8e6",
  },
  {
    id: "38ad9d42-2244-46ae-a27a-be0f5031598d",
    title: "Former prince Andrew wins legal challenge over search warrants",
    date: "2026-10-08",
    time: "14:42",
    url: "https://www.ft.com/content/38ad9d42-2244-46ae-a27a-be0f5031598d",
  },
  {
    id: "1addf0e7-c13b-45ff-b29f-5b9f78667cee",
    title: "ECB minutes reflect cooler appetite for additional rate rises in September",
    date: "2026-10-08",
    time: "14:20",
    url: "https://www.ft.com/content/1addf0e7-c13b-45ff-b29f-5b9f78667cee",
  },
  {
    id: "467d5151-91bb-4463-8cda-3fd72b5b2627",
    title: "Ohio Senate race puts Donald Trump\u2019s record with blue-collar voters to the test",
    date: "2026-10-08",
    time: "14:00",
    url: "https://www.ft.com/content/467d5151-91bb-4463-8cda-3fd72b5b2627",
  },
  {
    id: "fb4d6b18-3b72-473c-90a5-3864c1dad27e",
    title: "Russian bomb attack kills dozens at Ukraine bus stop",
    date: "2026-10-08",
    time: "13:38",
    url: "https://www.ft.com/content/fb4d6b18-3b72-473c-90a5-3864c1dad27e",
  },
  {
    id: "795ffd25-1b11-4531-b4bc-2974d798389c",
    title: "On the LLMternet, nobody cares you\u2019re a plant",
    date: "2026-10-08",
    time: "12:32",
    url: "https://www.ft.com/content/795ffd25-1b11-4531-b4bc-2974d798389c",
  },
  {
    id: "e069daa0-7d33-409f-9e52-1bd7b1cafdb6",
    title: "Cyber war won\u2019t be the same in the age of AI",
    date: "2026-10-08",
    time: "13:14",
    url: "https://www.ft.com/content/e069daa0-7d33-409f-9e52-1bd7b1cafdb6",
  },
  {
    id: "ec860f96-5a2b-461a-a897-a957860c3dba",
    title: "Oil prices jump on tanker attack and slowing flows through Strait of Hormuz",
    date: "2026-10-08",
    time: "12:14",
    url: "https://www.ft.com/content/ec860f96-5a2b-461a-a897-a957860c3dba",
  },
  {
    id: "c4ef549c-0451-4884-b922-23cd24cf35a6",
    title: "Houston start-up aims to loosen China’s grip on critical metal",
    date: "2026-10-08",
    time: "12:00",
    url: "https://www.ft.com/content/c4ef549c-0451-4884-b922-23cd24cf35a6",
  },
  {
    id: "2cb13aed-f6bf-4f45-b906-fa1194405a0c",
    title: "Iran war blows near-£12bn hole in Britain’s public finances",
    date: "2026-10-08",
    time: "11:38",
    url: "https://www.ft.com/content/2cb13aed-f6bf-4f45-b906-fa1194405a0c",
  },
  {
    id: "30ea577a-d2e0-4366-9489-223cd38dca82",
    title: "Badenoch’s punchy plan to reunite the right",
    date: "2026-10-08",
    time: "11:27",
    url: "https://www.ft.com/content/30ea577a-d2e0-4366-9489-223cd38dca82",
  },
  {
    id: "e160b16c-6c39-47fd-9e6c-98a8d6b81eed",
    title: "Germany heads for fastest growth since 2022",
    date: "2026-10-08",
    time: "11:15",
    url: "https://www.ft.com/content/e160b16c-6c39-47fd-9e6c-98a8d6b81eed",
  },
  {
    id: "5539d473-604b-42b3-ba6d-0dbb3353957b",
    title: "FirstFT: How hedge funds became Wall Street banks’ cash cow",
    date: "2026-10-08",
    time: "11:06",
    url: "https://www.ft.com/content/5539d473-604b-42b3-ba6d-0dbb3353957b",
  },
  {
    id: "48991d0c-79df-4222-99d4-4e45c9aa6fee",
    title: "France’s far right goes woke. Or is it neoliberal?",
    date: "2026-10-08",
    time: "11:00",
    url: "https://www.ft.com/content/48991d0c-79df-4222-99d4-4e45c9aa6fee",
  },
  {
    id: "4bfd5cc1-b330-42f1-9906-e6932a92932a",
    title: "Irate farmers should not limit the EU’s geopolitical ambitions",
    date: "2026-10-08",
    time: "11:00",
    url: "https://www.ft.com/content/4bfd5cc1-b330-42f1-9906-e6932a92932a",
  },
  {
    id: "d31ea247-c2c1-439e-83b1-d5b7470a792f",
    title: "LIV Golf accelerates negotiations with players over plans to revive bankrupt tour",
    date: "2026-10-08",
    time: "11:00",
    url: "https://www.ft.com/content/d31ea247-c2c1-439e-83b1-d5b7470a792f",
  },
  {
    id: "c09ef0e4-c5f8-4b69-a510-9864f907fe55",
    title: "Flávio Bolsonaro’s plan to ‘wield the big scissors’ to Brazil’s budget",
    date: "2026-10-08",
    time: "11:00",
    url: "https://www.ft.com/content/c09ef0e4-c5f8-4b69-a510-9864f907fe55",
  },
  {
    id: "7e39cdb9-977c-4a4c-b35c-6f775a9822db",
    title: "Houthi attacks on Saudi airports kill three people",
    date: "2026-10-08",
    time: "10:44",
    url: "https://www.ft.com/content/7e39cdb9-977c-4a4c-b35c-6f775a9822db",
  },
  {
    id: "dbd6e14c-2d47-4f6b-9981-98a42e172097",
    title: "US critical minerals stockpile risks driving up prices, defence groups warn",
    date: "2026-10-08",
    time: "10:00",
    url: "https://www.ft.com/content/dbd6e14c-2d47-4f6b-9981-98a42e172097",
  },
  {
    id: "d51a78a8-67d8-45bd-b32c-1eafe39a0794",
    title: "Submit a question: What is driving the global bond sell-off?",
    date: "2026-10-08",
    time: "09:50",
    url: "https://www.ft.com/content/d51a78a8-67d8-45bd-b32c-1eafe39a0794",
  },
  {
    id: "771d64f2-dacf-4c12-83c2-e6bc97c0161a",
    title: "Kemi Badenoch’s speech drew a moral dividing line between Tories and Reform",
    date: "2026-10-08",
    time: "09:30",
    url: "https://www.ft.com/content/771d64f2-dacf-4c12-83c2-e6bc97c0161a",
  },
  {
    id: "a57290ab-eadd-4e12-b8cc-37befed8d3bb",
    title: "British consulate in Jerusalem becomes ‘UK Mission’ after Israel orders closure",
    date: "2026-10-08",
    time: "09:29",
    url: "https://www.ft.com/content/a57290ab-eadd-4e12-b8cc-37befed8d3bb",
  },
  {
    id: "12c60e75-48be-45f8-a763-02ad0b2c0f8c",
    title: "Royal Navy serviceman charged with spying for foreign power",
    date: "2026-10-08",
    time: "08:40",
    url: "https://www.ft.com/content/12c60e75-48be-45f8-a763-02ad0b2c0f8c",
  },
  {
    id: "f21b32f5-011f-4716-a206-9382fd335fa6",
    title: "Deloitte fined £6mn for audit failures at Southeastern rail operator",
    date: "2026-10-08",
    time: "08:36",
    url: "https://www.ft.com/content/f21b32f5-011f-4716-a206-9382fd335fa6",
  },
  {
    id: "3d482d55-dc7d-44d9-9ad3-a374e6d5e97d",
    title: "Andy Burnham heads to Berlin in bid to win support from Friedrich Merz for closer EU ties",
    date: "2026-10-08",
    time: "08:09",
    url: "https://www.ft.com/content/3d482d55-dc7d-44d9-9ad3-a374e6d5e97d",
  },
  {
    id: "70f36d8e-ab07-4b58-a5d5-70908ef5f6ee",
    title: "Tesco predicts less boozy Christmas for UK shoppers",
    date: "2026-10-08",
    time: "07:45",
    url: "https://www.ft.com/content/70f36d8e-ab07-4b58-a5d5-70908ef5f6ee",
  },
  {
    id: "edb717f9-6512-424c-a3a5-50e43239adf8",
    title: "Tips and Linkers",
    date: "2026-10-08",
    time: "06:30",
    url: "https://www.ft.com/content/edb717f9-6512-424c-a3a5-50e43239adf8",
  },
  {
    id: "2ce052aa-6212-4d4d-99f0-6edacd254e4d",
    title: "FTAV’s further reading",
    date: "2026-10-08",
    time: "06:30",
    url: "https://www.ft.com/content/2ce052aa-6212-4d4d-99f0-6edacd254e4d",
  },
  {
    id: "166d0909-235d-4402-8ed7-d42d59401f6c",
    title: "Šefčovič goes to Beijing with a final plea to avoid an EU-China trade war",
    date: "2026-10-08",
    time: "06:00",
    url: "https://www.ft.com/content/166d0909-235d-4402-8ed7-d42d59401f6c",
  },
];
