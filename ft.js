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
  { id: "7b162fb4-8889-4f9c-9d5b-878850d6e8af", title: "Jim O’Neill declines job in Andy Burnham’s government", date: "2026-08-21", time: "17:05", url: "https://www.ft.com/content/7b162fb4-8889-4f9c-9d5b-878850d6e8af" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-08-21", time: "16:55", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
  { id: "105b8b46-7109-402d-84cf-2616b17bfac1", title: "The US techlash is real", date: "2026-08-21", time: "16:44", url: "https://www.ft.com/content/105b8b46-7109-402d-84cf-2616b17bfac1" },
  { id: "75ba3055-625c-4cb5-894b-0696a38f5e79", title: "Latest Isa rates", date: "2026-08-21", time: "16:42", url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79" },
  { id: "68b36b6d-71e7-4f44-bbfb-a202e36603a4", title: "Latest National Savings & Investments rates", date: "2026-08-21", time: "16:38", url: "https://www.ft.com/content/68b36b6d-71e7-4f44-bbfb-a202e36603a4" },
  { id: "3b463c96-9799-4b1c-856a-978f48b04eff", title: "Bessent dissent", date: "2026-08-21", time: "16:30", url: "https://www.ft.com/content/3b463c96-9799-4b1c-856a-978f48b04eff" },
  { id: "0eb4e7ce-42e3-49af-ae27-645eb7676fad", title: "Natalie Harp, the devoted ‘human printer’ in Trump’s entourage", date: "2026-08-21", time: "16:22", url: "https://www.ft.com/content/0eb4e7ce-42e3-49af-ae27-645eb7676fad" },
  { id: "1603577e-89d8-4cfa-884b-b83fbb8dd20e", title: "Citadel offloads 80% of portfolio scooped up from Situational Awareness", date: "2026-08-21", time: "15:50", url: "https://www.ft.com/content/1603577e-89d8-4cfa-884b-b83fbb8dd20e" },
  { id: "ac3f252d-bd49-4340-8565-f27a29652759", title: "Apollo says hackers accessed personal data in latest Wall Street breach", date: "2026-08-21", time: "15:31", url: "https://www.ft.com/content/ac3f252d-bd49-4340-8565-f27a29652759" },
  { id: "6a068501-ec65-4061-9716-49c4124025d6", title: "Uber set for €825mn Dutch fine over automating driver suspensions", date: "2026-08-21", time: "15:25", url: "https://www.ft.com/content/6a068501-ec65-4061-9716-49c4124025d6" },
  { id: "24f9c08e-e23f-434e-b0f4-fc1eb55a7b04", title: "US and Canada haggle over trade deal as midnight tariffs threat looms", date: "2026-08-21", time: "15:24", url: "https://www.ft.com/content/24f9c08e-e23f-434e-b0f4-fc1eb55a7b04" },
  { id: "5b459fd3-8170-4c43-8db3-3f76d4ab891d", title: "The bond scare and the balance of power", date: "2026-08-21", time: "15:10", url: "https://www.ft.com/content/5b459fd3-8170-4c43-8db3-3f76d4ab891d" },
  { id: "447f83f6-af6c-493d-87ed-bf4c12d69391", title: "FTAV’s Friday charts quiz", date: "2026-08-21", time: "14:48", url: "https://www.ft.com/content/447f83f6-af6c-493d-87ed-bf4c12d69391" },
  { id: "34d3874f-062a-499d-b5b6-a72ccbd0b8d6", title: "Prince Harry and other privacy claimants told to pay £9.5mn to Daily Mail publisher", date: "2026-08-21", time: "14:27", url: "https://www.ft.com/content/34d3874f-062a-499d-b5b6-a72ccbd0b8d6" },
  { id: "08a5dde7-34ae-4165-b16f-79e2ff0d44bc", title: "Burnham: To drill or not to drill?", date: "2026-08-21", time: "14:19", url: "https://www.ft.com/content/08a5dde7-34ae-4165-b16f-79e2ff0d44bc" },
  { id: "2aaa71c8-6321-4b0f-a6c2-2971c28b5b17", title: "UK retail investors snap up gilts in wake of bond sell-off", date: "2026-08-21", time: "14:01", url: "https://www.ft.com/content/2aaa71c8-6321-4b0f-a6c2-2971c28b5b17" },
  { id: "65fb0ad1-e4d5-43be-9dcf-f7aba1bea3a6", title: "Apple paid $17bn in taxes to Ireland after court ruling on back levies", date: "2026-08-21", time: "13:34", url: "https://www.ft.com/content/65fb0ad1-e4d5-43be-9dcf-f7aba1bea3a6" },
  { id: "ef1d7530-a514-4b18-9a0f-8843cac02929", title: "What is Jane Street?", date: "2026-08-21", time: "13:30", url: "https://www.ft.com/content/ef1d7530-a514-4b18-9a0f-8843cac02929" },
  { id: "ff13d879-8dbc-419c-9c5f-ceb3bbe564c9", title: "Andy Burnham’s summer tour turns into a cut-price honeymoon", date: "2026-08-21", time: "12:52", url: "https://www.ft.com/content/ff13d879-8dbc-419c-9c5f-ceb3bbe564c9" },
  { id: "a301daae-05dd-4cf9-b78c-7879e4da55ba", title: "What retail investors need to know before jumping into Anthropic’s IPO", date: "2026-08-21", time: "12:00", url: "https://www.ft.com/content/a301daae-05dd-4cf9-b78c-7879e4da55ba" },
  { id: "7e0c8dc0-e957-420a-bba3-d33666d919b8", title: "Bitcoin and gold surge as Bessent’s bond market intervention weighs on dollar", date: "2026-08-21", time: "11:37", url: "https://www.ft.com/content/7e0c8dc0-e957-420a-bba3-d33666d919b8" },
  { id: "f1a1ea48-f7d3-4582-9a03-25d884741623", title: "Food inflation adds pressure for Bank of Japan to act", date: "2026-08-21", time: "11:13", url: "https://www.ft.com/content/f1a1ea48-f7d3-4582-9a03-25d884741623" },
  { id: "de7fad8f-f5a5-4233-819a-492511a1d3c8", title: "Waymo doubles spending on lobbying in robotaxi battle with Uber", date: "2026-08-21", time: "11:00", url: "https://www.ft.com/content/de7fad8f-f5a5-4233-819a-492511a1d3c8" },
  { id: "17a27f16-8c0b-4f21-a348-512bb787994d", title: "FTAV Q&A: Darrell Duffie", date: "2026-08-21", time: "10:27", url: "https://www.ft.com/content/17a27f16-8c0b-4f21-a348-512bb787994d" },
  { id: "d434a48b-4b6c-4071-bf16-da16a6b95bda", title: "Samsung to return record $80bn to shareholders", date: "2026-08-21", time: "10:19", url: "https://www.ft.com/content/d434a48b-4b6c-4071-bf16-da16a6b95bda" },
  { id: "7f9274b0-bef6-4dbc-954f-54f8b0cd6464", title: "The Liberal Democrats’ problem is not unique", date: "2026-08-21", time: "09:30", url: "https://www.ft.com/content/7f9274b0-bef6-4dbc-954f-54f8b0cd6464" },
  { id: "481b3fd0-6b2d-4bbe-b6e3-b99146df827c", title: "UK posts surprise budget deficit of £1.8bn in July", date: "2026-08-21", time: "07:38", url: "https://www.ft.com/content/481b3fd0-6b2d-4bbe-b6e3-b99146df827c" },
  { id: "3d6256cc-cd21-461a-b4c4-2b368d59d696", title: "Nellie Liang: 'Ultimately the goal is to signal that high rates are a concern'", date: "2026-08-21", time: "06:30", url: "https://www.ft.com/content/3d6256cc-cd21-461a-b4c4-2b368d59d696" },
  { id: "8a53dbaa-66dc-48de-affa-0a650228117c", title: "FTAV's further reading", date: "2026-08-21", time: "06:30", url: "https://www.ft.com/content/8a53dbaa-66dc-48de-affa-0a650228117c" },
  { id: "130f404e-6303-49a8-89d6-3368e3fc70b6", title: "FirstFT: Scott Bessent battles bond vigilantes", date: "2026-08-21", time: "06:18", url: "https://www.ft.com/content/130f404e-6303-49a8-89d6-3368e3fc70b6" },
  { id: "a079e741-9104-4557-8772-470fe12f46ba", title: "How money-market funds are providing stock market rocket fuel", date: "2026-08-21", time: "06:00", url: "https://www.ft.com/content/a079e741-9104-4557-8772-470fe12f46ba" },
  { id: "4e128c45-b84c-4fc3-98bf-c5033c201ea6", title: "Japanese inflation rises as BoJ weighs rate rise", date: "2026-08-21", time: "05:54", url: "https://www.ft.com/content/4e128c45-b84c-4fc3-98bf-c5033c201ea6" },
  { id: "3c085ab6-7128-4073-bc65-5482a47fb016", title: "The new age of Big Law recruiting", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/3c085ab6-7128-4073-bc65-5482a47fb016" },
  { id: "2d7e64e8-386a-4987-ae4d-04b6bf2a5e6a", title: "John Healey warned to limit Budget borrowing amid bond sell-off", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/2d7e64e8-386a-4987-ae4d-04b6bf2a5e6a" },
  { id: "4b7b8d3f-5625-4dba-ad90-66192c101956", title: "Feminism didn’t kill the male breadwinner model, the economy did", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/4b7b8d3f-5625-4dba-ad90-66192c101956" },
  { id: "f01ff762-3e68-4bac-bb73-6f35a6bf2771", title: "Scott Bessent takes on bond vigilantes in $32tn Treasury market", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/f01ff762-3e68-4bac-bb73-6f35a6bf2771" },
  { id: "61a06f4b-f661-4a05-9b73-bc43f22f86db", title: "Burnham should beware the perils of cost of living policy", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/61a06f4b-f661-4a05-9b73-bc43f22f86db" },
  { id: "17583c3f-f8f4-44f8-bb2e-277a8304f252", title: "The historic coffee port in the Houthis’ crosshairs", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/17583c3f-f8f4-44f8-bb2e-277a8304f252" },
  { id: "7353d4b4-23f5-4886-83b3-717f8e70bb4f", title: "Poland’s former PM accuses Kaczyński of radicalising PiS", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/7353d4b4-23f5-4886-83b3-717f8e70bb4f" },
  { id: "d286cb7f-c63e-42a6-86db-d0a9ad0f296a", title: "The battle over golf’s future", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/d286cb7f-c63e-42a6-86db-d0a9ad0f296a" },
];
