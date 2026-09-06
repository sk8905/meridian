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
  { id: "87167087-e472-44fe-bfa5-3f13a782e889", title: "Britain is a factory for ideas applied elsewhere", date: "2026-09-06", time: "12:00", url: "https://www.ft.com/content/87167087-e472-44fe-bfa5-3f13a782e889" },
  { id: "cffea5bc-0255-4029-8e76-0c3671bf4d92", title: "Will US inflation data persuade the Fed to raise rates this month?", date: "2026-09-06", time: "12:00", url: "https://www.ft.com/content/cffea5bc-0255-4029-8e76-0c3671bf4d92" },
  { id: "eb4c3d77-cb16-4f77-a173-9960481ac716", title: "Nigel Farage urged by Labour to ‘take responsibility’ over TV sting", date: "2026-09-06", time: "11:42", url: "https://www.ft.com/content/eb4c3d77-cb16-4f77-a173-9960481ac716" },
  { id: "4a751ca7-83ac-4c62-8d3f-3643e74ad92b", title: "Jaguar Land Rover plans up to 4,000 job cuts as Chinese rivals pile on pressure", date: "2026-09-06", time: "11:11", url: "https://www.ft.com/content/4a751ca7-83ac-4c62-8d3f-3643e74ad92b" },
  { id: "1e2d9db0-cb2c-4c79-942b-f0aff960e4c5", title: "Trump envoys expected to arrive in Ukraine after Moscow meeting with Putin", date: "2026-09-06", time: "10:44", url: "https://www.ft.com/content/1e2d9db0-cb2c-4c79-942b-f0aff960e4c5" },
  { id: "c249f75f-a1ed-4174-94f3-320f8e4ef806", title: "German state heads to regional polls in far-right cliffhanger", date: "2026-09-06", time: "09:04", url: "https://www.ft.com/content/c249f75f-a1ed-4174-94f3-320f8e4ef806" },
  { id: "9bcce1fa-997e-49f2-9530-f1255e4cb28b", title: "Donald Trump’s approval rating falls to all-time low in FT poll", date: "2026-09-06", time: "05:01", url: "https://www.ft.com/content/9bcce1fa-997e-49f2-9530-f1255e4cb28b" },
  { id: "a0e69cf2-c3d4-412b-b78b-a6171b7ed020", title: "Insurers pile on risk as payouts fall to lowest level in 20 years", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/a0e69cf2-c3d4-412b-b78b-a6171b7ed020" },
  { id: "0310460a-b192-4ebf-a55d-cf43706b58b7", title: "Swedish industrialist Wallenberg warns on leftwing opposition’s higher tax plans", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/0310460a-b192-4ebf-a55d-cf43706b58b7" },
  { id: "354ef76f-6a68-4e19-ab2d-7a6853170725", title: "How the UK can stop accidentally exporting its best tech start-ups", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/354ef76f-6a68-4e19-ab2d-7a6853170725" },
  { id: "01bb02eb-ded8-476b-ad10-63da4abe88e6", title: "12 English police forces involved in contentious Palantir pilot programmes", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/01bb02eb-ded8-476b-ad10-63da4abe88e6" },
  { id: "646c7152-a720-4ef9-8b84-e37188b9a8f4", title: "Iceland’s ‘no’ exposes EU complacency", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/646c7152-a720-4ef9-8b84-e37188b9a8f4" },
  { id: "04031dbe-7412-441e-8aaa-89a9ee6c7439", title: "The risky mission to de-mine the Strait of Hormuz", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/04031dbe-7412-441e-8aaa-89a9ee6c7439" },
  { id: "1d2449b3-bd85-477a-87ec-a5a12a9128c4", title: "Rival cities vie to ‘poach’ international organisations from Geneva", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/1d2449b3-bd85-477a-87ec-a5a12a9128c4" },
  { id: "b901e51c-b77f-4649-b0e6-2ef57a6969b7", title: "No busking, no drinking: councils hire private groups to enforce growing list of rules", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/b901e51c-b77f-4649-b0e6-2ef57a6969b7" },
  { id: "76b370ff-b5f6-4e22-aa30-da08b1abb8f8", title: "UBS demands new junior bankers show proficiency in AI", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/76b370ff-b5f6-4e22-aa30-da08b1abb8f8" },
  { id: "39b0c966-b153-4706-9325-2f6176ba3752", title: "Russian gold floods through Hong Kong in wake of western sanctions", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/39b0c966-b153-4706-9325-2f6176ba3752" },
  { id: "8a708224-3a37-4d23-9f5c-158a73216018", title: "‘Unfinished business’: Travis Kalanick revisits robotaxis with new start-up", date: "2026-09-06", time: "05:00", url: "https://www.ft.com/content/8a708224-3a37-4d23-9f5c-158a73216018" },
  { id: "a8207f0e-9e1c-4d41-a3e0-a96587bad3a6", title: "Iran war rebuild boosts world’s biggest air cargo handler", date: "2026-09-06", time: "03:21", url: "https://www.ft.com/content/a8207f0e-9e1c-4d41-a3e0-a96587bad3a6" },
  { id: "9ae2c655-bcf7-4ef2-9a9b-0855248d06a0", title: "Trump envoys take Ukraine peace proposal to meeting with Putin", date: "2026-09-05", time: "23:22", url: "https://www.ft.com/content/9ae2c655-bcf7-4ef2-9a9b-0855248d06a0" },
  { id: "ecab45a4-6786-4151-a998-f64279457435", title: "US regulator sues ISS as it steps up scrutiny of proxy advisers", date: "2026-09-05", time: "22:35", url: "https://www.ft.com/content/ecab45a4-6786-4151-a998-f64279457435" },
  { id: "7c7c07db-cde5-474d-9a20-8e2c2f273d4e", title: "US strikes three Iranian oil tankers in response to attacks on warships", date: "2026-09-05", time: "21:05", url: "https://www.ft.com/content/7c7c07db-cde5-474d-9a20-8e2c2f273d4e" },
  { id: "d8fa06e5-5929-47c9-815c-47d2221fc9e9", title: "Trump and Musk Super Pacs boost spending on midterm elections", date: "2026-09-05", time: "18:37", url: "https://www.ft.com/content/d8fa06e5-5929-47c9-815c-47d2221fc9e9" },
  { id: "4826a106-9cd4-45bc-8436-69e2519d0205", title: "Russia-Ukraine peace talks could begin next year, ex-MI6 chief says", date: "2026-09-05", time: "16:50", url: "https://www.ft.com/content/4826a106-9cd4-45bc-8436-69e2519d0205" },
  { id: "82c20c2f-a3d2-45c0-be50-2bed0bfb52b0", title: "Jenrick seeks to get Reform back on track with tax pledge", date: "2026-09-05", time: "16:42", url: "https://www.ft.com/content/82c20c2f-a3d2-45c0-be50-2bed0bfb52b0" },
  { id: "53751b68-5af6-42ec-9d93-bf3daee6acdd", title: "Masked protesters block Dover port roads", date: "2026-09-05", time: "16:30", url: "https://www.ft.com/content/53751b68-5af6-42ec-9d93-bf3daee6acdd" },
  { id: "47ac914f-ab0e-441b-9152-9ef06dc17741", title: "‘Sowing doubt’: Trump’s attempt to change voting causes chaos for state officials", date: "2026-09-05", time: "14:00", url: "https://www.ft.com/content/47ac914f-ab0e-441b-9152-9ef06dc17741" },
  { id: "c98f4d9b-ec17-4bc0-a137-dbd12a23cba6", title: "Pro-Israel groups fight to help Republicans keep control of Congress", date: "2026-09-05", time: "12:00", url: "https://www.ft.com/content/c98f4d9b-ec17-4bc0-a137-dbd12a23cba6" },
  { id: "6e096712-5abe-48c5-8e4d-c0042f947639", title: "Treasury sell-off piles pressure on weakest US borrowers", date: "2026-09-05", time: "12:00", url: "https://www.ft.com/content/6e096712-5abe-48c5-8e4d-c0042f947639" },
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
];
