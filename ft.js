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
  { id: "7f2d4be3-5879-439e-8060-339bac53ab40", title: "London’s cabbies prepare to battle the robotaxis", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/7f2d4be3-5879-439e-8060-339bac53ab40" },
  { id: "ff536e6e-dc56-45e3-b5e0-2dfb28148cb6", title: "Ukraine seeks Musk’s help to hit Russian missile launchers", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/ff536e6e-dc56-45e3-b5e0-2dfb28148cb6" },
  { id: "496b8f06-ffcd-4a14-a3d1-ecd398ce89ba", title: "‘Nobody has automated the kitchen’: the tech billionaire disrupting restaurants", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/496b8f06-ffcd-4a14-a3d1-ecd398ce89ba" },
  { id: "2a791f9d-1036-4ef9-a232-5993b91c554d", title: "Art market money laundering rules catch interior designers and toy-soldier sellers", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/2a791f9d-1036-4ef9-a232-5993b91c554d" },
  { id: "d8bc75ee-77c6-4810-967c-0c2cff69bf7a", title: "HSBC spends $68mn on biggest cull of senior bankers since financial crisis", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/d8bc75ee-77c6-4810-967c-0c2cff69bf7a" },
  { id: "e5512d10-6ade-4e40-97df-9f7d24a01d04", title: "Why the energy crisis won’t save western oil refineries", date: "2026-08-21", time: "05:00", url: "https://www.ft.com/content/e5512d10-6ade-4e40-97df-9f7d24a01d04" },
  { id: "182f8161-b1a8-43f7-8918-f78f34e03cab", title: "North Korea’s economy enjoys rare ‘dash for flash’", date: "2026-08-21", time: "04:21", url: "https://www.ft.com/content/182f8161-b1a8-43f7-8918-f78f34e03cab" },
  { id: "83500ff8-31df-4031-9edd-8b3de5aff3e3", title: "Shanghai’s answer to Nasdaq outstrips Hong Kong amid Chinese tech frenzy", date: "2026-08-21", time: "03:16", url: "https://www.ft.com/content/83500ff8-31df-4031-9edd-8b3de5aff3e3" },
  { id: "684e18ff-aecf-4d0e-af66-cb17fd80c231", title: "‘The government’s chart is misleading by a factor of more than 23 million percent’", date: "2026-08-21", time: "02:34", url: "https://www.ft.com/content/684e18ff-aecf-4d0e-af66-cb17fd80c231" },
  { id: "402d716a-0cf1-46e6-b09b-e37d6ea428a5", title: "Tory peer’s free speech group urged Vance to lobby UK government", date: "2026-08-20", time: "19:59", url: "https://www.ft.com/content/402d716a-0cf1-46e6-b09b-e37d6ea428a5" },
  { id: "7069ffff-9534-489d-bf25-9965a1bc48bc", title: "Guggenheim loan trades in distressed territory after investor call", date: "2026-08-20", time: "19:43", url: "https://www.ft.com/content/7069ffff-9534-489d-bf25-9965a1bc48bc" },
  { id: "d3fbfcb7-ce89-4b46-8267-c2fed9c67134", title: "Quant hedge funds suffer worst day in 2 years as Treasury boosts buyback and Moderna shares leap", date: "2026-08-20", time: "19:00", url: "https://www.ft.com/content/d3fbfcb7-ce89-4b46-8267-c2fed9c67134" },
  { id: "8bce59a1-d0e7-4f66-b2bd-da45de5a3c4e", title: "Brazilian municipalities join BHP and Vale dam collapse payout scheme", date: "2026-08-20", time: "18:52", url: "https://www.ft.com/content/8bce59a1-d0e7-4f66-b2bd-da45de5a3c4e" },
  { id: "47c8bc3b-c1b6-4fae-add9-e55898778936", title: "Today’s China could learn from Jiang and Zhu", date: "2026-08-20", time: "18:46", url: "https://www.ft.com/content/47c8bc3b-c1b6-4fae-add9-e55898778936" },
];
