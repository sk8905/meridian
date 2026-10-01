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
    id: "3a1fb601-9119-4eb6-bfc8-305e281cc7e4",
    title: "Driver received warning before fatal Bedfordshire rail crash, report finds",
    date: "2026-10-01",
    time: "14:05",
    url: "https://www.ft.com/content/3a1fb601-9119-4eb6-bfc8-305e281cc7e4",
  },
  {
    id: "db266f36-c6d3-4368-8633-290e2c35e54d",
    title: "What’s next for the global economy? You asked, we answered",
    date: "2026-10-01",
    time: "14:05",
    url: "https://www.ft.com/content/db266f36-c6d3-4368-8633-290e2c35e54d",
  },
  {
    id: "04fcaf7d-09f3-4cc9-9261-02adf8c13756",
    title: "Pete Hegseth announces creation of Autonomous Warfare Command",
    date: "2026-10-01",
    time: "14:00",
    url: "https://www.ft.com/content/04fcaf7d-09f3-4cc9-9261-02adf8c13756",
  },
  {
    id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7",
    title: "Latest savings rates",
    date: "2026-10-01",
    time: "13:59",
    url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7",
  },
  {
    id: "e485a228-1efe-426b-addc-26069ba48bf3",
    title: "Global bond sell-off pushes 10-year Treasury yield to highest since 2002",
    date: "2026-10-01",
    time: "13:56",
    url: "https://www.ft.com/content/e485a228-1efe-426b-addc-26069ba48bf3",
  },
  {
    id: "75ba3055-625c-4cb5-894b-0696a38f5e79",
    title: "Latest Isa rates",
    date: "2026-10-01",
    time: "13:52",
    url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79",
  },
  {
    id: "68b36b6d-71e7-4f44-bbfb-a202e36603a4",
    title: "Latest National Savings & Investments rates",
    date: "2026-10-01",
    time: "13:41",
    url: "https://www.ft.com/content/68b36b6d-71e7-4f44-bbfb-a202e36603a4",
  },
  {
    id: "fba5c097-5df7-43aa-b78a-2068266eb2be",
    title: "Australia’s banks show how to prepare for cable blackouts",
    date: "2026-10-01",
    time: "13:03",
    url: "https://www.ft.com/content/fba5c097-5df7-43aa-b78a-2068266eb2be",
  },
  {
    id: "87875b20-4081-4511-9afe-4ee389409742",
    title: "Is circular financing in AI a problem?",
    date: "2026-10-01",
    time: "13:00",
    url: "https://www.ft.com/content/87875b20-4081-4511-9afe-4ee389409742",
  },
  {
    id: "45088042-61e6-43e5-b120-e810fecb8906",
    title: "The AI Shift: Is AI supercharging science?",
    date: "2026-10-01",
    time: "12:30",
    url: "https://www.ft.com/content/45088042-61e6-43e5-b120-e810fecb8906",
  },
  {
    id: "5d82d5d0-458f-4368-a019-9f101fef6d2b",
    title: "France seeks to rein in pensions and state salaries in 2027",
    date: "2026-10-01",
    time: "12:19",
    url: "https://www.ft.com/content/5d82d5d0-458f-4368-a019-9f101fef6d2b",
  },
  {
    id: "4014fb8e-3614-43ea-990e-733f1f002959",
    title: "Burnham’s wake-up call to the right",
    date: "2026-10-01",
    time: "12:13",
    url: "https://www.ft.com/content/4014fb8e-3614-43ea-990e-733f1f002959",
  },
  {
    id: "2bd7efcf-db16-476c-89ac-5ac82244364b",
    title: "Who should pay for the LA wildfires?",
    date: "2026-10-01",
    time: "12:00",
    url: "https://www.ft.com/content/2bd7efcf-db16-476c-89ac-5ac82244364b",
  },
  {
    id: "bc178357-793b-45d8-ae3b-d5929159c243",
    title: "An AI sovereign wealth fund isn’t progressive — it’s techno-imperialism",
    date: "2026-10-01",
    time: "11:53",
    url: "https://www.ft.com/content/bc178357-793b-45d8-ae3b-d5929159c243",
  },
  {
    id: "e4c0610f-c88e-47e2-a062-46115f08d656",
    title: "We have forgotten what budgets are for",
    date: "2026-10-01",
    time: "11:00",
    url: "https://www.ft.com/content/e4c0610f-c88e-47e2-a062-46115f08d656",
  },
  {
    id: "b667bf40-1bd5-4565-a7bf-79ba9aae71f2",
    title: "Wachtell hires former Manhattan US attorney to strengthen litigation ranks",
    date: "2026-10-01",
    time: "11:00",
    url: "https://www.ft.com/content/b667bf40-1bd5-4565-a7bf-79ba9aae71f2",
  },
  {
    id: "c8b3090e-8531-4911-8e9d-6eefbefb4c70",
    title: "Bank of Japan’s summary of opinions points to accelerated pace of rate rises",
    date: "2026-10-01",
    time: "10:29",
    url: "https://www.ft.com/content/c8b3090e-8531-4911-8e9d-6eefbefb4c70",
  },
  {
    id: "db266f36-c6d3-4368-8633-290e2c35e54d",
    title: "Submit a question: What’s next for the global economy?",
    date: "2026-10-01",
    time: "10:25",
    url: "https://www.ft.com/content/db266f36-c6d3-4368-8633-290e2c35e54d",
  },
  {
    id: "96e004e0-43ab-46e6-9116-fabfc7251496",
    title: "Four potential positives from higher bond yields",
    date: "2026-10-01",
    time: "09:37",
    url: "https://www.ft.com/content/96e004e0-43ab-46e6-9116-fabfc7251496",
  },
  {
    id: "690967a3-0db5-4dff-9f16-dbf0e9ccc5a6",
    title: "Andy Burnham’s ‘triple lock’ move reallocates, rather than reduces, spending",
    date: "2026-10-01",
    time: "09:30",
    url: "https://www.ft.com/content/690967a3-0db5-4dff-9f16-dbf0e9ccc5a6",
  },
  {
    id: "e485a228-1efe-426b-addc-26069ba48bf3",
    title: "Global bond sell-off deepens as 10-year Treasury yield hits highest since 2002",
    date: "2026-10-01",
    time: "09:09",
    url: "https://www.ft.com/content/e485a228-1efe-426b-addc-26069ba48bf3",
  },
  {
    id: "ec55a734-243b-43a2-93ea-8652d6b99309",
    title: "Japan plans $140bn AI data centre push with Dell and Jera",
    date: "2026-10-01",
    time: "09:05",
    url: "https://www.ft.com/content/ec55a734-243b-43a2-93ea-8652d6b99309",
  },
  {
    id: "3334f6eb-5eab-4340-a5b7-a2bd0b5f46c8",
    title: "UBS pushes back against investor call to leave Switzerland",
    date: "2026-10-01",
    time: "08:55",
    url: "https://www.ft.com/content/3334f6eb-5eab-4340-a5b7-a2bd0b5f46c8",
  },
  {
    id: "3d58c75e-035b-4958-89e7-2b2369e3a432",
    title: "Japanese companies exit China in record numbers",
    date: "2026-10-01",
    time: "08:18",
    url: "https://www.ft.com/content/3d58c75e-035b-4958-89e7-2b2369e3a432",
  },
  {
    id: "8702be93-442f-49c5-ac48-f06c541bc7af",
    title: "UK house prices fall as higher mortgage rates ‘subdue’ market",
    date: "2026-10-01",
    time: "08:05",
    url: "https://www.ft.com/content/8702be93-442f-49c5-ac48-f06c541bc7af",
  },
  {
    id: "639e1943-a5fc-4869-bac8-95cf3c9fe4e8",
    title: "Boodles in the pink with Argyle diamond haul",
    date: "2026-10-01",
    time: "07:00",
    url: "https://www.ft.com/content/639e1943-a5fc-4869-bac8-95cf3c9fe4e8",
  },
  {
    id: "4ab6df98-f14d-49d1-a170-8087dc517b08",
    title: "An optimist’s guide to the bond market",
    date: "2026-10-01",
    time: "06:30",
    url: "https://www.ft.com/content/4ab6df98-f14d-49d1-a170-8087dc517b08",
  },
  {
    id: "9af7e02c-3b08-4c95-b61f-714a65d7316d",
    title: "FTAV’s further reading",
    date: "2026-10-01",
    time: "06:30",
    url: "https://www.ft.com/content/9af7e02c-3b08-4c95-b61f-714a65d7316d",
  },
  {
    id: "1e6d2a9b-dc37-4b19-91e3-0a76fd01b673",
    title: "Indian Flydubai pilot hailed as hero after averting disaster",
    date: "2026-10-01",
    time: "06:01",
    url: "https://www.ft.com/content/1e6d2a9b-dc37-4b19-91e3-0a76fd01b673",
  },
  {
    id: "ff64e3ef-0a37-489c-a79d-b02c29502a75",
    title: "France and Germany inch towards grand bargain on EU car regulation",
    date: "2026-10-01",
    time: "06:00",
    url: "https://www.ft.com/content/ff64e3ef-0a37-489c-a79d-b02c29502a75",
  },
  {
    id: "594f10d8-aebd-48d5-af47-5e7232487a35",
    title: "FirstFT: Big Tech’s heavy Brussels lobbying",
    date: "2026-10-01",
    time: "05:31",
    url: "https://www.ft.com/content/594f10d8-aebd-48d5-af47-5e7232487a35",
  },
  {
    id: "8be64ab7-81eb-48dd-8baa-e1c413a838e8",
    title: "Louvre boss promises ‘culture of security’ after heist",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/8be64ab7-81eb-48dd-8baa-e1c413a838e8",
  },
  {
    id: "bc38ab9d-d8b1-4f48-a804-f7c186e98b9b",
    title: "Boots set to get carved out of private equity",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/bc38ab9d-d8b1-4f48-a804-f7c186e98b9b",
  },
  {
    id: "11502a49-5319-4df5-95ea-2d76669c31a6",
    title: "OpenAI’s agents obscured hacking activity in government site breaches",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/11502a49-5319-4df5-95ea-2d76669c31a6",
  },
  {
    id: "125675ee-0d2c-4ffc-b7c5-814dd6b82612",
    title: "Manchester City chair shielded by diplomatic immunity",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/125675ee-0d2c-4ffc-b7c5-814dd6b82612",
  },
  {
    id: "719fb157-9d73-44c7-be1f-863c2b106e7d",
    title: "EU steel exports hit by high energy costs, tariffs and China oversupply",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/719fb157-9d73-44c7-be1f-863c2b106e7d",
  },
  {
    id: "dba1f631-2804-43eb-8bf9-858e0fc5c09d",
    title: "King’s bank Coutts hit with new lawsuit after ‘debanking’",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/dba1f631-2804-43eb-8bf9-858e0fc5c09d",
  },
  {
    id: "8bece01e-0284-402c-9cc6-db4adfdd02ad",
    title: "UBS should make the positive case for staying Swiss",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/8bece01e-0284-402c-9cc6-db4adfdd02ad",
  },
  {
    id: "534b6887-63ac-49c7-a816-a81edd2e8de1",
    title: "EU questions Binance over continued operations despite wind-down order",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/534b6887-63ac-49c7-a816-a81edd2e8de1",
  },
  {
    id: "cd2e89d3-2606-4116-b523-309450462d2b",
    title: "How Europe can stall Russia’s hybrid war",
    date: "2026-10-01",
    time: "05:00",
    url: "https://www.ft.com/content/cd2e89d3-2606-4116-b523-309450462d2b",
  },
];
