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
    id: "e7c1da68-aed3-471d-911f-0b6086a327ec",
    title: "France meets fiscal reality with a crunch",
    date: "2026-10-01",
    time: "18:05",
    url: "https://www.ft.com/content/e7c1da68-aed3-471d-911f-0b6086a327ec",
  },
  {
    id: "1206b356-e62b-4e18-9925-e8dd0a283fc4",
    title: "Tories criticise Burnham over support for Manchester City owners",
    date: "2026-10-01",
    time: "16:40",
    url: "https://www.ft.com/content/1206b356-e62b-4e18-9925-e8dd0a283fc4",
  },
  {
    id: "4b87328c-17da-484d-a92a-0f3582f76f02",
    title: "BT seeks government nod for potential TalkTalk takeover",
    date: "2026-10-01",
    time: "16:02",
    url: "https://www.ft.com/content/4b87328c-17da-484d-a92a-0f3582f76f02",
  },
  {
    id: "122e55bb-b0f9-4106-823d-ac2a435d96d9",
    title: "Dealmakers line up to test EU’s appetite to create European champions",
    date: "2026-10-01",
    time: "15:49",
    url: "https://www.ft.com/content/122e55bb-b0f9-4106-823d-ac2a435d96d9",
  },
  {
    id: "e485a228-1efe-426b-addc-26069ba48bf3",
    title: "Global bond sell-off pushes 10-year Treasury yield to highest since 2002",
    date: "2026-10-01",
    time: "15:44",
    url: "https://www.ft.com/content/e485a228-1efe-426b-addc-26069ba48bf3",
  },
  {
    id: "716c3491-6547-4c81-bc42-87136aecdac0",
    title: "Do US lawmakers finally have capital in the crosshairs?",
    date: "2026-10-01",
    time: "15:00",
    url: "https://www.ft.com/content/716c3491-6547-4c81-bc42-87136aecdac0",
  },
  {
    id: "e071ee77-2028-4f40-b7bf-fff19e51c47c",
    title: "International Criminal Court cuts ties with Axa over US sanctions",
    date: "2026-10-01",
    time: "14:23",
    url: "https://www.ft.com/content/e071ee77-2028-4f40-b7bf-fff19e51c47c",
  },
  {
    id: "0234bcc7-386c-40b6-9f04-88aef3a1e24c",
    title: "EU countries in crisis talks over release of diesel stocks",
    date: "2026-10-01",
    time: "14:20",
    url: "https://www.ft.com/content/0234bcc7-386c-40b6-9f04-88aef3a1e24c",
  },
  {
    id: "3a1fb601-9119-4eb6-bfc8-305e281cc7e4",
    title: "Train driver accelerated through red signal before fatal crash",
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
    id: "ef0f6d42-4759-4ce8-8e40-acd83f0c64f1",
    title: "The best art exhibitions to see in London right now",
    date: "2026-10-01",
    time: "12:39",
    url: "https://www.ft.com/content/ef0f6d42-4759-4ce8-8e40-acd83f0c64f1",
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
    id: "6d644883-c27b-45c9-aef7-445d74fa3efc",
    title: "The crazy cachet of a colour-block kitchen",
    date: "2026-10-01",
    time: "12:00",
    url: "https://www.ft.com/content/6d644883-c27b-45c9-aef7-445d74fa3efc",
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
];
