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
  { id: "7347b9fc-ba63-48fb-b06d-b9fe5e9b046a", title: "John Ternus, Apple's new 'wicked calm' CEO", date: "2026-09-04", time: "18:00", url: "https://www.ft.com/content/7347b9fc-ba63-48fb-b06d-b9fe5e9b046a" },
  { id: "af5b1fd3-194d-4aed-b1ef-0bf662170952", title: "Why Berkshire Hathaway might be an active hedge", date: "2026-09-04", time: "18:00", url: "https://www.ft.com/content/af5b1fd3-194d-4aed-b1ef-0bf662170952" },
  { id: "87a5e3b3-c042-4a49-b225-ec1e2ba2a2ff", title: "Stockpickers: TT Electronics, Grafton, M&G", date: "2026-09-04", time: "18:00", url: "https://www.ft.com/content/87a5e3b3-c042-4a49-b225-ec1e2ba2a2ff" },
  { id: "5fa0b726-e45a-4dbd-86e6-397fdec9d5ca", title: "Directors' Deals: Lloyds' CFO banks £10mn through share sales", date: "2026-09-04", time: "18:00", url: "https://www.ft.com/content/5fa0b726-e45a-4dbd-86e6-397fdec9d5ca" },
  { id: "51270bb6-225c-4270-ae4e-fe063dfd2a33", title: "Russian drone strikes Ukraine's security service headquarters", date: "2026-09-04", time: "16:59", url: "https://www.ft.com/content/51270bb6-225c-4270-ae4e-fe063dfd2a33" },
  { id: "60db19ee-ac1f-4b89-9c82-2212e3402aa3", title: "Labour working", date: "2026-09-04", time: "16:47", url: "https://www.ft.com/content/60db19ee-ac1f-4b89-9c82-2212e3402aa3" },
  { id: "623c286b-c973-4488-83f3-97e9016e85f6", title: "Are credit rating agencies getting fed up with hyperscalers?", date: "2026-09-04", time: "16:06", url: "https://www.ft.com/content/623c286b-c973-4488-83f3-97e9016e85f6" },
  { id: "f84c4053-3e14-4666-9543-7e958a1dadb2", title: "Venezuela’s jumbo oil deal does little to appease its creditors", date: "2026-09-04", time: "15:13", url: "https://www.ft.com/content/f84c4053-3e14-4666-9543-7e958a1dadb2" },
  { id: "c1d3bf1b-6a56-4271-ad33-d9279354f083", title: "Pragmatism should define Burnham’s approach to business", date: "2026-09-04", time: "15:00", url: "https://www.ft.com/content/c1d3bf1b-6a56-4271-ad33-d9279354f083" },
  { id: "546c8b24-a1d6-46f1-a57f-62491c248487", title: "Strong August US payrolls report bolsters odds of September rate rise", date: "2026-09-04", time: "14:29", url: "https://www.ft.com/content/546c8b24-a1d6-46f1-a57f-62491c248487" },
  { id: "042639e8-89d9-4fe6-9b99-73bf2937a700", title: "The five financing scandals facing Reform", date: "2026-09-04", time: "14:26", url: "https://www.ft.com/content/042639e8-89d9-4fe6-9b99-73bf2937a700" },
  { id: "a6be8465-63ea-4c5f-8a3e-b46cd5475c7e", title: "Andrew Bailey warns of populist threat to central bank independence", date: "2026-09-04", time: "14:15", url: "https://www.ft.com/content/a6be8465-63ea-4c5f-8a3e-b46cd5475c7e" },
  { id: "05d66e73-481f-40df-bf38-35ea73f61aee", title: "Markey, Massachusetts and the limits of generational politics", date: "2026-09-04", time: "14:00", url: "https://www.ft.com/content/05d66e73-481f-40df-bf38-35ea73f61aee" },
  { id: "5f9e4984-e5ec-4baa-928d-7c7772277f92", title: "Burnham vs Badenoch: Commons showdown", date: "2026-09-04", time: "13:32", url: "https://www.ft.com/content/5f9e4984-e5ec-4baa-928d-7c7772277f92" },
  { id: "a7ce8b2f-98f5-4e96-afa0-ccf4dceef8bd", title: "US economy smashes forecast with 162,000 jobs added in August", date: "2026-09-04", time: "13:32", url: "https://www.ft.com/content/a7ce8b2f-98f5-4e96-afa0-ccf4dceef8bd" },
  { id: "d8f53899-5aaa-4b5d-9b3b-5e2d4775a3aa", title: "Katayama becomes Japan's vital link between Bessent, Takaichi and markets", date: "2026-09-04", time: "13:00", url: "https://www.ft.com/content/d8f53899-5aaa-4b5d-9b3b-5e2d4775a3aa" },
  { id: "723a3a36-3797-4c54-bddf-074d088a10d6", title: "Former Afghan president Hamid Karzai: 'We need a country for everyone'", date: "2026-09-04", time: "12:30", url: "https://www.ft.com/content/723a3a36-3797-4c54-bddf-074d088a10d6" },
  { id: "aa71ca9a-b64f-41b6-8e6f-00ce03a47553", title: "US diesel prices soar to record high", date: "2026-09-04", time: "12:08", url: "https://www.ft.com/content/aa71ca9a-b64f-41b6-8e6f-00ce03a47553" },
  { id: "29655cf5-bf44-4e99-8f26-208f4c44af84", title: "EQT strikes $2bn deal for insurance broker McGill", date: "2026-09-04", time: "12:05", url: "https://www.ft.com/content/29655cf5-bf44-4e99-8f26-208f4c44af84" },
  { id: "27f62928-927e-4ac3-94e1-4f25310b6ae4", title: "UK set to approve Jackdaw gasfield within weeks", date: "2026-09-04", time: "12:00", url: "https://www.ft.com/content/27f62928-927e-4ac3-94e1-4f25310b6ae4" },
  { id: "9610992d-c70d-4eb8-934a-1ca97d8f78b1", title: "Lord Somerleyton: ‘I’m offering a £10mn stake in my family’s historic estate’", date: "2026-09-04", time: "12:00", url: "https://www.ft.com/content/9610992d-c70d-4eb8-934a-1ca97d8f78b1" },
  { id: "3a232341-a470-4270-84a7-5c0e5782db3b", title: "Fear not the bond market skinny dippers", date: "2026-09-04", time: "12:00", url: "https://www.ft.com/content/3a232341-a470-4270-84a7-5c0e5782db3b" },
  { id: "e252a325-8ee2-43d1-b2f5-002732210395", title: "Reform UK conference: Nigel Farage to address party after donor sting", date: "2026-09-04", time: "11:38", url: "https://www.ft.com/content/e252a325-8ee2-43d1-b2f5-002732210395" },
  { id: "ec738381-d364-4da3-8173-471d7f3b57b4", title: "Will the ‘glassholes’ finally win?", date: "2026-09-04", time: "11:00", url: "https://www.ft.com/content/ec738381-d364-4da3-8173-471d7f3b57b4" },
  { id: "0df60d9c-00ee-488d-a116-718b36d5d24c", title: "The missing $580,000 that could bring down South Africa’s president", date: "2026-09-04", time: "11:00", url: "https://www.ft.com/content/0df60d9c-00ee-488d-a116-718b36d5d24c" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-09-04", time: "10:54", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
  { id: "75ba3055-625c-4cb5-894b-0696a38f5e79", title: "Latest Isa rates", date: "2026-09-04", time: "10:49", url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79" },
  { id: "68b36b6d-71e7-4f44-bbfb-a202e36603a4", title: "Latest National Savings & Investments rates", date: "2026-09-04", time: "10:42", url: "https://www.ft.com/content/68b36b6d-71e7-4f44-bbfb-a202e36603a4" },
  { id: "3db791d0-ccab-4aca-a83b-da31563a15af", title: "FTAV’s Friday charts quiz", date: "2026-09-04", time: "10:30", url: "https://www.ft.com/content/3db791d0-ccab-4aca-a83b-da31563a15af" },
  { id: "c3e515b8-2207-4bf2-8a85-d5bce0d6f9df", title: "Fox News presenter and Trump ally Maria Bartiromo departs after 12 years", date: "2026-09-04", time: "10:04", url: "https://www.ft.com/content/c3e515b8-2207-4bf2-8a85-d5bce0d6f9df" },
  { id: "dea30dd4-7102-4931-834a-ac0cac28c5ec", title: "South Korea weighs Hormuz deployment as US pressure mounts", date: "2026-09-04", time: "09:57", url: "https://www.ft.com/content/dea30dd4-7102-4931-834a-ac0cac28c5ec" },
  { id: "d5b33ff5-9aad-4b9a-a7bc-3eff956e7f15", title: "Latest allegations make Reform look ridiculous", date: "2026-09-04", time: "09:30", url: "https://www.ft.com/content/d5b33ff5-9aad-4b9a-a7bc-3eff956e7f15" },
  { id: "d2d44e3e-f50f-40da-bd83-5c2ebcd323a0", title: "Paul Smith at 80", date: "2026-09-04", time: "09:30", url: "https://www.ft.com/content/d2d44e3e-f50f-40da-bd83-5c2ebcd323a0" },
  { id: "a5a233bc-1391-4863-a80e-b30356cd5e1a", title: "22 ways to wear polka dots", date: "2026-09-04", time: "09:30", url: "https://www.ft.com/content/a5a233bc-1391-4863-a80e-b30356cd5e1a" },
  { id: "70cf4c1e-324f-4b85-b685-f37ba232d532", title: "Top Reform UK advisers step down after donor sting", date: "2026-09-04", time: "08:43", url: "https://www.ft.com/content/70cf4c1e-324f-4b85-b685-f37ba232d532" },
  { id: "06c157ee-aa37-485c-9e5b-0f3045beb01e", title: "What are the latest claims against Nigel Farage?", date: "2026-09-04", time: "08:37", url: "https://www.ft.com/content/06c157ee-aa37-485c-9e5b-0f3045beb01e" },
  { id: "ed41bea0-4b8d-47dc-9989-018bd85e52fd", title: "More stock ownership, weaker monetary policy?", date: "2026-09-04", time: "06:30", url: "https://www.ft.com/content/ed41bea0-4b8d-47dc-9989-018bd85e52fd" },
  { id: "1686eba7-7b27-44a7-a376-0e9e04105777", title: "Europe struggling to re-arm by 2030 as capitals squander arms spending surge", date: "2026-09-04", time: "06:00", url: "https://www.ft.com/content/1686eba7-7b27-44a7-a376-0e9e04105777" },
  { id: "f9a17854-f0fa-4487-9591-55f8a9112097", title: "FTAV’s further reading", date: "2026-09-04", time: "06:00", url: "https://www.ft.com/content/f9a17854-f0fa-4487-9591-55f8a9112097" },
  { id: "3f4183c5-72cd-49fb-b4dc-ca3a12287763", title: "FirstFT: UK-EU alignment a ‘problem’ for US", date: "2026-09-04", time: "05:32", url: "https://www.ft.com/content/3f4183c5-72cd-49fb-b4dc-ca3a12287763" },
];
