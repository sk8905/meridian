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
  { id: "0ace3335-e3c9-4b75-ae02-0d4655885990", title: "Luckin Coffee killed our lunch spot. Here’s what that says about geopolitics", date: "2026-09-04", time: "05:30", url: "https://www.ft.com/content/0ace3335-e3c9-4b75-ae02-0d4655885990" },
  { id: "443c247b-88fb-4aa5-9aa0-8b819de4ff27", title: "China warns US that G20 obstruction row threatens upcoming summits", date: "2026-09-04", time: "05:03", url: "https://www.ft.com/content/443c247b-88fb-4aa5-9aa0-8b819de4ff27" },
  { id: "212311c7-948a-4ee9-b57e-e303eb0eb4f4", title: "The $275mn question from Guggenheim’s auditor", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/212311c7-948a-4ee9-b57e-e303eb0eb4f4" },
  { id: "0d2beac3-ef62-4cbf-959e-b5c6b9703081", title: "UK-EU alignment is ‘problem’ for US trade deal, says top Trump official", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/0d2beac3-ef62-4cbf-959e-b5c6b9703081" },
  { id: "dd3bc3fe-bda9-40b0-82c2-dcb54e1439f4", title: "Deutsche Bank led $1bn of troubled lending to Hollywood studio landlord", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/dd3bc3fe-bda9-40b0-82c2-dcb54e1439f4" },
  { id: "54cf40cd-149f-40db-b603-21aecd5f66ec", title: "The university degree is losing its lustre", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/54cf40cd-149f-40db-b603-21aecd5f66ec" },
  { id: "86da564e-aec7-4d53-b7b8-93bbdd240061", title: "Spain pushes for EU oil and gas tax to pay for climate change response", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/86da564e-aec7-4d53-b7b8-93bbdd240061" },
  { id: "0c1d2ab0-3f3d-468e-92d5-218ddc23d885", title: "Giorgia Meloni celebrates Italy’s longest-serving government since 1945", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/0c1d2ab0-3f3d-468e-92d5-218ddc23d885" },
  { id: "ecc15aa6-6e7b-409d-8753-2fb6aadd0592", title: "Manager of Norway’s $2tn oil fund proposes slashing US Treasury holdings", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/ecc15aa6-6e7b-409d-8753-2fb6aadd0592" },
  { id: "f8b2e4ad-6af2-4cf5-aae2-d1d359b31fa4", title: "Why the US and Iran keep escalating", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/f8b2e4ad-6af2-4cf5-aae2-d1d359b31fa4" },
  { id: "9536c7b9-c600-48ec-8fe2-453b0ca187e9", title: "Anthropic’s IPO set to test external trust with power over board", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/9536c7b9-c600-48ec-8fe2-453b0ca187e9" },
  { id: "61175ac3-4676-4a6f-b5af-f609930793de", title: "A UK bank windfall tax would be a terrible idea", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/61175ac3-4676-4a6f-b5af-f609930793de" },
  { id: "0e9d714b-f367-4dd7-8ef4-6d4b2c08b79c", title: "Defence officials resist EU plan to curb reliance on US tech giants", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/0e9d714b-f367-4dd7-8ef4-6d4b2c08b79c" },
  { id: "23489956-0f0a-4ffd-a73b-3f541964aa78", title: "Chime is a winner when consumer finance goes K-shaped", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/23489956-0f0a-4ffd-a73b-3f541964aa78" },
  { id: "68751904-522a-41cc-85e0-08015fe75059", title: "America must learn AI lessons from Astro Boy", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/68751904-522a-41cc-85e0-08015fe75059" },
  { id: "939e55ad-1d5c-45cf-995d-1db6754c8f6b", title: "Trump-linked companies race to secure deals for Venezuela’s oil", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/939e55ad-1d5c-45cf-995d-1db6754c8f6b" },
  { id: "fff531fc-988c-4016-9b5b-25f2274f4d47", title: "The rise of Texas", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/fff531fc-988c-4016-9b5b-25f2274f4d47" },
  { id: "239df019-16a0-4c0c-9a38-87f48b2611ed", title: "Can e-bike companies control their rogue riders?", date: "2026-09-04", time: "05:00", url: "https://www.ft.com/content/239df019-16a0-4c0c-9a38-87f48b2611ed" },
  { id: "f86672dd-5ee5-46f6-8419-3c959814dd1c", title: "Microsoft challenges data centre costs after pledging to protect ratepayers", date: "2026-09-03", time: "21:03", url: "https://www.ft.com/content/f86672dd-5ee5-46f6-8419-3c959814dd1c" },
  { id: "55ab40c0-59e2-4c0b-97c9-4f4f5a71a8bb", title: "OpenAI says it has overtaken Anthropic with its latest AI model", date: "2026-09-03", time: "19:00", url: "https://www.ft.com/content/55ab40c0-59e2-4c0b-97c9-4f4f5a71a8bb" },
  { id: "c5dadf10-7c7e-4035-ae21-e18535d7d609", title: "US oil deal sparks ‘anger’ in Venezuela, says opposition leader", date: "2026-09-03", time: "18:48", url: "https://www.ft.com/content/c5dadf10-7c7e-4035-ae21-e18535d7d609" },
  { id: "5e9db3c2-70c0-40da-8767-88dcbaf8cfc5", title: "EU enters winter with lowest gas stocks on record", date: "2026-09-03", time: "18:46", url: "https://www.ft.com/content/5e9db3c2-70c0-40da-8767-88dcbaf8cfc5" },
  { id: "b4c17a07-f684-44c7-b334-8b7bcb1a21d6", title: "Star Citadel energy trader to step down amid tumult in energy markets", date: "2026-09-03", time: "18:29", url: "https://www.ft.com/content/b4c17a07-f684-44c7-b334-8b7bcb1a21d6" },
  { id: "35ac0ba7-9cce-4ee3-b5f2-cce744c9f97e", title: "Reform UK woos bond investors as markets shake UK political debate", date: "2026-09-03", time: "18:14", url: "https://www.ft.com/content/35ac0ba7-9cce-4ee3-b5f2-cce744c9f97e" },
  { id: "89d4575d-c0ca-4ac9-ba2c-5e6016244055", title: "Nvidia’s $13bn deal cements its $5.5tn advantage", date: "2026-09-03", time: "18:09", url: "https://www.ft.com/content/89d4575d-c0ca-4ac9-ba2c-5e6016244055" },
];
