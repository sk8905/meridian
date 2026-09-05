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
  { id: "7c7c07db-cde5-474d-9a20-8e2c2f273d4e", title: "US strikes three Iranian oil tankers in response to attacks on warships", date: "2026-09-05", time: "16:07", url: "https://www.ft.com/content/7c7c07db-cde5-474d-9a20-8e2c2f273d4e" },
  { id: "82c20c2f-a3d2-45c0-be50-2bed0bfb52b0", title: "Jenrick seeks to get Reform back on track with tax pledge", date: "2026-09-05", time: "15:59", url: "https://www.ft.com/content/82c20c2f-a3d2-45c0-be50-2bed0bfb52b0" },
  { id: "47ac914f-ab0e-441b-9152-9ef06dc17741", title: "‘Sowing doubt’: Trump’s attempt to change voting causes chaos for state officials", date: "2026-09-05", time: "14:00", url: "https://www.ft.com/content/47ac914f-ab0e-441b-9152-9ef06dc17741" },
  { id: "9ae2c655-bcf7-4ef2-9a9b-0855248d06a0", title: "Trump envoys arrive in Moscow with Ukraine peace proposal", date: "2026-09-05", time: "13:11", url: "https://www.ft.com/content/9ae2c655-bcf7-4ef2-9a9b-0855248d06a0" },
  { id: "c98f4d9b-ec17-4bc0-a137-dbd12a23cba6", title: "Pro-Israel groups fight to help Republicans keep control of Congress", date: "2026-09-05", time: "12:00", url: "https://www.ft.com/content/c98f4d9b-ec17-4bc0-a137-dbd12a23cba6" },
  { id: "6e096712-5abe-48c5-8e4d-c0042f947639", title: "Treasury sell-off piles pressure on weakest US borrowers", date: "2026-09-05", time: "12:00", url: "https://www.ft.com/content/6e096712-5abe-48c5-8e4d-c0042f947639" },
  { id: "53751b68-5af6-42ec-9d93-bf3daee6acdd", title: "Masked protesters block Dover port roads", date: "2026-09-05", time: "11:01", url: "https://www.ft.com/content/53751b68-5af6-42ec-9d93-bf3daee6acdd" },
  { id: "dd2069b2-9fa0-4b87-95dc-cd7ee75f3096", title: "Europe Express: faces of the ‘new right’", date: "2026-09-05", time: "11:00", url: "https://www.ft.com/content/dd2069b2-9fa0-4b87-95dc-cd7ee75f3096" },
  { id: "9876d74e-ab17-4b15-a129-2de0c030b1b7", title: "The NBA drops the hammer on Steve Ballmer", date: "2026-09-05", time: "09:00", url: "https://www.ft.com/content/9876d74e-ab17-4b15-a129-2de0c030b1b7" },
  { id: "6bde3e74-9a7c-4528-9b9c-42a14eec0414", title: "Jefferies fund caught with $500mn exposure to second alleged invoice fraud", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/6bde3e74-9a7c-4528-9b9c-42a14eec0414" },
  { id: "18639405-0e49-44e5-be69-cd7988cbdf27", title: "Uber picks a side in driver vs robotaxi wars: its own", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/18639405-0e49-44e5-be69-cd7988cbdf27" },
  { id: "d3f7a1a1-7fc1-4349-a202-a6fee6ef4a5b", title: "The gloves are starting to come off in markets", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/d3f7a1a1-7fc1-4349-a202-a6fee6ef4a5b" },
  { id: "e1afdbf1-eb21-45c0-ad88-1ec0913b1f7c", title: "Is Keynesianism dead?", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/e1afdbf1-eb21-45c0-ad88-1ec0913b1f7c" },
  { id: "1e2ceb39-1e32-41d9-bd49-f3d2c7e0c574", title: "‘What the blazers?’ The long fight over school uniform costs", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/1e2ceb39-1e32-41d9-bd49-f3d2c7e0c574" },
  { id: "bf518b6c-ca5c-49d3-b16a-4aa5bcf25ed9", title: "Camaraderie and nostalgia: how Germany's far-right AfD is winning the east", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/bf518b6c-ca5c-49d3-b16a-4aa5bcf25ed9" },
  { id: "a00520d1-0347-4060-9ac2-09f8a3c5eda0", title: "The prime minister won't cut spending — here's how I'm cutting mine", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/a00520d1-0347-4060-9ac2-09f8a3c5eda0" },
  { id: "b190631e-2915-4ce5-827c-df25e50fae52", title: "UK inheritance tax planning: tips to trim your bill", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/b190631e-2915-4ce5-827c-df25e50fae52" },
  { id: "bd134250-00d8-4bfd-bf4b-d32479ac0fed", title: "Rerun or sequel? Naomi Klein and Astra Taylor on end times fascism", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/bd134250-00d8-4bfd-bf4b-d32479ac0fed" },
  { id: "676ae308-3609-4fb8-881f-0e5e3a1af0ca", title: "Q&A: HMRC considers criminalising 'reckless' tax mistakes", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/676ae308-3609-4fb8-881f-0e5e3a1af0ca" },
  { id: "b207536e-6def-4080-878f-d0eba61d11e0", title: "US Republicans revolt against Flock AI surveillance as tech backlash intensifies", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/b207536e-6def-4080-878f-d0eba61d11e0" },
  { id: "535b7f38-4528-404c-afad-7aa1cef40918", title: "Meet the office influencers", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/535b7f38-4528-404c-afad-7aa1cef40918" },
  { id: "8a7e8202-d800-4fb1-a8f0-eeb4536578f7", title: "The repo market is the 'dark matter' of finance: powerful and perilous", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/8a7e8202-d800-4fb1-a8f0-eeb4536578f7" },
  { id: "18900164-fa33-4d6d-a39e-6898043cd62f", title: "EU counterterror envoy urges pressure on social platforms over youth extremism", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/18900164-fa33-4d6d-a39e-6898043cd62f" },
  { id: "81c64e2f-8cef-4ccc-8e6a-62321b4bbd57", title: "The benefits of being an accidental prepper", date: "2026-09-05", time: "05:00", url: "https://www.ft.com/content/81c64e2f-8cef-4ccc-8e6a-62321b4bbd57" },
  { id: "96a69838-e43b-42a0-b30d-4cc7a07b61d8", title: "'There's a desire to see steadiness': Healey sounds pro-business note as he talks up growth", date: "2026-09-04", time: "21:00", url: "https://www.ft.com/content/96a69838-e43b-42a0-b30d-4cc7a07b61d8" },
  { id: "6d43b599-3d7c-471c-88c2-0f056475a840", title: "John Healey puts Britain on notice for tough Budget in 'more dangerous world'", date: "2026-09-04", time: "21:00", url: "https://www.ft.com/content/6d43b599-3d7c-471c-88c2-0f056475a840" },
  { id: "966cbb76-93a1-4215-a610-cea5709f3d6a", title: "Maga's favourite combat sport takes off in China", date: "2026-09-04", time: "21:00", url: "https://www.ft.com/content/966cbb76-93a1-4215-a610-cea5709f3d6a" },
  { id: "3c9d0a82-643b-44ef-96a0-74a00e3c72ba", title: "Anthropic close to awarding Morgan Stanley and Goldman Sachs top roles in $2tn IPO", date: "2026-09-04", time: "20:46", url: "https://www.ft.com/content/3c9d0a82-643b-44ef-96a0-74a00e3c72ba" },
  { id: "5c4f86d2-411f-4b3b-9926-d27432ffc290", title: "Nigel Farage insists Reform has 'broken no law' after key advisers step down", date: "2026-09-04", time: "19:28", url: "https://www.ft.com/content/5c4f86d2-411f-4b3b-9926-d27432ffc290" },
  { id: "7de897f0-a393-47f3-84ce-27aa64a67f07", title: "Nigel Farage's merry band used to enjoy conference. Not this year", date: "2026-09-04", time: "18:40", url: "https://www.ft.com/content/7de897f0-a393-47f3-84ce-27aa64a67f07" },
  { id: "27746b9a-de02-4a83-830a-11cd4b1b1fe4", title: "Nigel Farage's pile of financing scandals", date: "2026-09-04", time: "18:37", url: "https://www.ft.com/content/27746b9a-de02-4a83-830a-11cd4b1b1fe4" },
  { id: "89d8bb57-0e59-437e-a25d-d6556dcb42b0", title: "'Clear' breaches of rules by Reform UK pollster, says industry body", date: "2026-09-04", time: "18:35", url: "https://www.ft.com/content/89d8bb57-0e59-437e-a25d-d6556dcb42b0" },
  { id: "be1cecbc-099a-4ab4-ac48-01f966b4c159", title: "Maybe Northampton *is* an emerging market", date: "2026-09-04", time: "18:32", url: "https://www.ft.com/content/be1cecbc-099a-4ab4-ac48-01f966b4c159" },
  { id: "7347b9fc-ba63-48fb-b06d-b9fe5e9b046a", title: "John Ternus, Apple's new 'wicked calm' CEO", date: "2026-09-04", time: "18:00", url: "https://www.ft.com/content/7347b9fc-ba63-48fb-b06d-b9fe5e9b046a" },
  { id: "af5b1fd3-194d-4aed-b1ef-0bf662170952", title: "Why Berkshire Hathaway might be an active hedge", date: "2026-09-04", time: "18:00", url: "https://www.ft.com/content/af5b1fd3-194d-4aed-b1ef-0bf662170952" },
  { id: "87a5e3b3-c042-4a49-b225-ec1e2ba2a2ff", title: "Stockpickers: TT Electronics, Grafton, M&G", date: "2026-09-04", time: "18:00", url: "https://www.ft.com/content/87a5e3b3-c042-4a49-b225-ec1e2ba2a2ff" },
  { id: "5fa0b726-e45a-4dbd-86e6-397fdec9d5ca", title: "Directors' Deals: Lloyds' CFO banks £10mn through share sales", date: "2026-09-04", time: "18:00", url: "https://www.ft.com/content/5fa0b726-e45a-4dbd-86e6-397fdec9d5ca" },
  { id: "51270bb6-225c-4270-ae4e-fe063dfd2a33", title: "Russian drone strikes Ukraine's security service headquarters", date: "2026-09-04", time: "16:59", url: "https://www.ft.com/content/51270bb6-225c-4270-ae4e-fe063dfd2a33" },
  { id: "60db19ee-ac1f-4b89-9c82-2212e3402aa3", title: "Labour working", date: "2026-09-04", time: "16:47", url: "https://www.ft.com/content/60db19ee-ac1f-4b89-9c82-2212e3402aa3" },
  { id: "623c286b-c973-4488-83f3-97e9016e85f6", title: "Are credit rating agencies getting fed up with hyperscalers?", date: "2026-09-04", time: "16:06", url: "https://www.ft.com/content/623c286b-c973-4488-83f3-97e9016e85f6" },
];
