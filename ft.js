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
  { id: "ce198d5a-4a3b-46e8-aec3-77e5ab53ffb7", title: "Central banks slashed their gold purchases in early 2026", date: "2026-07-30", time: "07:00", url: "https://www.ft.com/content/ce198d5a-4a3b-46e8-aec3-77e5ab53ffb7" },
  { id: "a943e743-501b-4b7d-aecd-85ef60a90c20", title: "SocGen profit jumps as banking boom offsets weak trading", date: "2026-07-30", time: "06:59", url: "https://www.ft.com/content/a943e743-501b-4b7d-aecd-85ef60a90c20" },
  { id: "fe3fe258-62ab-4a71-8c8b-747f9559fd05", title: "Kevin Warsh is confusing markets", date: "2026-07-30", time: "06:30", url: "https://www.ft.com/content/fe3fe258-62ab-4a71-8c8b-747f9559fd05" },
  { id: "5052b22e-aeca-4043-88af-dd7da3661a49", title: "Chinese stocks on track for worst month in decade", date: "2026-07-30", time: "06:28", url: "https://www.ft.com/content/5052b22e-aeca-4043-88af-dd7da3661a49" },
  { id: "cc7d24ec-abfe-440b-9e85-4d725567f278", title: "Winner of US-China AI rivalry falls 10% in Hong Kong debut", date: "2026-07-30", time: "06:08", url: "https://www.ft.com/content/cc7d24ec-abfe-440b-9e85-4d725567f278" },
  { id: "480de423-de70-4bac-be56-f54502e29182", title: "Russia exploits Spain’s grounded firefighting helicopters as wildfires rage", date: "2026-07-30", time: "06:00", url: "https://www.ft.com/content/480de423-de70-4bac-be56-f54502e29182" },
  { id: "e3ed0f3d-52c0-45f5-b1f2-9b0e406026c7", title: "The corgi-inspired ETF provider that wants to disrupt BlackRock", date: "2026-07-30", time: "06:00", url: "https://www.ft.com/content/e3ed0f3d-52c0-45f5-b1f2-9b0e406026c7" },
  { id: "5035f634-7d47-483a-b8e9-722ded88a672", title: "FirstFT: Meta and Microsoft kick off turbulent tech results", date: "2026-07-30", time: "05:30", url: "https://www.ft.com/content/5035f634-7d47-483a-b8e9-722ded88a672" },
  { id: "3249b384-2a27-402b-be12-e3b3bea37440", title: "Accelerating Business", date: "2026-07-30", time: "05:17", url: "https://www.ft.com/content/3249b384-2a27-402b-be12-e3b3bea37440" },
  { id: "4f6e5ad5-395b-41ac-9672-bd6880dc05a7", title: "The tech wreck roiling Wall Street", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/4f6e5ad5-395b-41ac-9672-bd6880dc05a7" },
  { id: "fc8963a1-d30b-4b95-adfd-bc2eff115f0d", title: "Deutsche Bank swings from overexcitement to overcorrection", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/fc8963a1-d30b-4b95-adfd-bc2eff115f0d" },
  { id: "f2a1c998-db3e-46bb-bb89-d09446a8cc3f", title: "What are PuFins and how do Andy Burnham and John Healey plan to use them?", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/f2a1c998-db3e-46bb-bb89-d09446a8cc3f" },
  { id: "b08b43a8-09d4-492b-ad20-f1ab53e92192", title: "UK business secretary argues against rejoining EU customs union", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/b08b43a8-09d4-492b-ad20-f1ab53e92192" },
  { id: "795c4ff8-bd2d-42bf-9252-3a793dec22ab", title: "Virgin Media O2 owners weigh options to slash £22bn debt pile", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/795c4ff8-bd2d-42bf-9252-3a793dec22ab" },
  { id: "3990cbf0-e783-4445-a32f-19a345c0cc6f", title: "How Putin’s refinery dream became Ukraine’s target", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/3990cbf0-e783-4445-a32f-19a345c0cc6f" },
  { id: "5ac77b70-d057-44d4-b2b3-5eccb0e73484", title: "AI investment concentration risk is not just in equities", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/5ac77b70-d057-44d4-b2b3-5eccb0e73484" },
  { id: "5f861140-d36f-4765-b0bb-44d26df05123", title: "Hedge funds raise bets against US-backed critical minerals companies", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/5f861140-d36f-4765-b0bb-44d26df05123" },
  { id: "0ed87aae-96f1-45b8-87b3-cbf4c6d12e4f", title: "How exposed is the UK economy to the second China shock?", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/0ed87aae-96f1-45b8-87b3-cbf4c6d12e4f" },
  { id: "6e1bd23a-a131-414e-afb3-46b2b4629d24", title: "Germany’s Mittelstand has not much time to lose", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/6e1bd23a-a131-414e-afb3-46b2b4629d24" },
  { id: "db17cde4-eb38-4bac-9413-a3e8ea3a6630", title: "The UK has worse mobile coverage than Romania. Why?", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/db17cde4-eb38-4bac-9413-a3e8ea3a6630" },
  { id: "2bd92fad-6c5c-45ef-b975-5dee517fd268", title: "UK North Sea oil companies look overseas for growth", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/2bd92fad-6c5c-45ef-b975-5dee517fd268" },
  { id: "fde2dd97-317a-41b8-a746-d917c5680397", title: "ByteDance’s plan to dominate AI", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/fde2dd97-317a-41b8-a746-d917c5680397" },
  { id: "4416d0f0-6f15-4efd-8ddc-2cb1a203e356", title: "Postcard from Morocco: learning to surf in a remote fishing town", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/4416d0f0-6f15-4efd-8ddc-2cb1a203e356" },
  { id: "f248b78b-c973-416c-a328-96038bc09c6f", title: "Piers Morgan: from journalist provocateur to YouTube mogul", date: "2026-07-30", time: "05:00", url: "https://www.ft.com/content/f248b78b-c973-416c-a328-96038bc09c6f" },
  { id: "c4eedbe8-6345-48b6-8d44-5cc5b0bea2c7", title: "US borrowing costs hit 19-year high as Fed defies inflation fears", date: "2026-07-29", time: "22:01", url: "https://www.ft.com/content/c4eedbe8-6345-48b6-8d44-5cc5b0bea2c7" },
  { id: "06d941ed-8136-46a4-a2ec-44bea1b35c3b", title: "Meta tumbles 6% as sales forecast and profits disappoint", date: "2026-07-29", time: "21:53", url: "https://www.ft.com/content/06d941ed-8136-46a4-a2ec-44bea1b35c3b" },
  { id: "d5762ed8-a384-4c6a-9f5e-8bce573cf0a0", title: "Qualcomm posts shrinking sales and profits as rising costs hit smartphone market", date: "2026-07-29", time: "21:37", url: "https://www.ft.com/content/d5762ed8-a384-4c6a-9f5e-8bce573cf0a0" },
  { id: "da7c4472-cb30-4b82-b321-d82c1859419e", title: "Microsoft’s cloud business boosts sales as AI investment climbs to $41bn", date: "2026-07-29", time: "21:30", url: "https://www.ft.com/content/da7c4472-cb30-4b82-b321-d82c1859419e" },
  { id: "ef1da506-6d2c-4e09-8b1b-6f6bb416a0a7", title: "For sale: Saba repellent", date: "2026-07-29", time: "19:44", url: "https://www.ft.com/content/ef1da506-6d2c-4e09-8b1b-6f6bb416a0a7" },
  { id: "836720ef-d768-4eda-abe1-cfb432727161", title: "Split Fed decision to hold rates in July", date: "2026-07-29", time: "19:13", url: "https://www.ft.com/content/836720ef-d768-4eda-abe1-cfb432727161" },
  { id: "730ebfb9-cec0-4cb6-947a-598d64518dad", title: "Ex-Goldman executive awarded £1.45mn after paternity leave ‘stigma’", date: "2026-07-29", time: "18:54", url: "https://www.ft.com/content/730ebfb9-cec0-4cb6-947a-598d64518dad" },
  { id: "ba9a6450-1dbc-4ff9-98e0-2f1b922c2839", title: "Social care reform is a test of UK politics", date: "2026-07-29", time: "18:50", url: "https://www.ft.com/content/ba9a6450-1dbc-4ff9-98e0-2f1b922c2839" },
  { id: "b779208d-d587-4482-881c-41b063c4e235", title: "Reality bites for South Korea’s memory chip wonder-stocks", date: "2026-07-29", time: "18:37", url: "https://www.ft.com/content/b779208d-d587-4482-881c-41b063c4e235" },
  { id: "86f37415-cc80-4ea6-bc03-87c96cb831f4", title: "US oil inventories fall to ‘precariously low’ level as Iran war disrupts supply", date: "2026-07-29", time: "18:03", url: "https://www.ft.com/content/86f37415-cc80-4ea6-bc03-87c96cb831f4" },
  { id: "1be84be9-1945-4388-8ff7-b621b0ed1714", title: "France moves to expel pro-Kremlin TV personality", date: "2026-07-29", time: "17:47", url: "https://www.ft.com/content/1be84be9-1945-4388-8ff7-b621b0ed1714" },
  { id: "0f9a8575-12ad-4c17-9ee0-50cdab5b8961", title: "Fed decision live: US central bank to weigh mounting inflation worries in hotly debated meeting", date: "2026-07-29", time: "17:36", url: "https://www.ft.com/content/0f9a8575-12ad-4c17-9ee0-50cdab5b8961" },
  { id: "35811ce1-84a7-4a59-aa91-15c6bdd24392", title: "Anthony Fauci invokes Fifth Amendment at fiery Senate hearing on Covid", date: "2026-07-29", time: "17:30", url: "https://www.ft.com/content/35811ce1-84a7-4a59-aa91-15c6bdd24392" },
  { id: "ee2a2d3b-dc5d-4ee2-8ad6-78c4b00fca8a", title: "Here’s how to make North Sea drilling compatible with net zero", date: "2026-07-29", time: "17:27", url: "https://www.ft.com/content/ee2a2d3b-dc5d-4ee2-8ad6-78c4b00fca8a" },
  { id: "42f17eda-ac25-464b-9c7a-8777d6164613", title: "The Fed’s next step is far from clear", date: "2026-07-29", time: "17:22", url: "https://www.ft.com/content/42f17eda-ac25-464b-9c7a-8777d6164613" },
  { id: "34006961-415e-48ae-a2e5-4f35210322ba", title: "The pathway to prosperity is getting harder for developing countries", date: "2026-07-29", time: "16:50", url: "https://www.ft.com/content/34006961-415e-48ae-a2e5-4f35210322ba" },
];
