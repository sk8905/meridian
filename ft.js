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
  { id: "a91356ef-67bd-4bd9-947b-b272423f1318", title: "Nearly 14,000 crypto holders face security risk after data breach", date: "2026-08-13", time: "18:11", url: "https://www.ft.com/content/a91356ef-67bd-4bd9-947b-b272423f1318" },
  { id: "f3f3c945-6a75-4663-b8ec-d5251438c1c5", title: "Seoul soars past Dubai as world’s busiest international airport", date: "2026-08-13", time: "17:46", url: "https://www.ft.com/content/f3f3c945-6a75-4663-b8ec-d5251438c1c5" },
  { id: "3b67ce5d-3f1a-41a8-8d87-7356876ede14", title: "Passenger train derails near Lewes in East Sussex", date: "2026-08-13", time: "17:34", url: "https://www.ft.com/content/3b67ce5d-3f1a-41a8-8d87-7356876ede14" },
  { id: "a468c20b-cf1d-4a36-87b8-4eb15666e6c4", title: "Donald Trump enlists corporate America in fight against cyber crime", date: "2026-08-13", time: "17:28", url: "https://www.ft.com/content/a468c20b-cf1d-4a36-87b8-4eb15666e6c4" },
  { id: "5d5ed2dd-8326-4cad-aac3-5816448ceccf", title: "US accuses more than 40 countries of helping China avoid Trump’s tariffs", date: "2026-08-13", time: "16:55", url: "https://www.ft.com/content/5d5ed2dd-8326-4cad-aac3-5816448ceccf" },
  { id: "09c1ed51-8e69-4e39-bab3-392e1e9f9f6b", title: "UK government considers aid for drought-hit farmers", date: "2026-08-13", time: "16:54", url: "https://www.ft.com/content/09c1ed51-8e69-4e39-bab3-392e1e9f9f6b" },
  { id: "36ec3c60-43b4-4c94-9a7b-8b5dba798ee8", title: "Retail parks are the real threat to the British high street", date: "2026-08-13", time: "16:37", url: "https://www.ft.com/content/36ec3c60-43b4-4c94-9a7b-8b5dba798ee8" },
  { id: "e7aee58f-a068-468d-b584-49807b413016", title: "Israeli settlers besiege Palestinian homes", date: "2026-08-13", time: "16:28", url: "https://www.ft.com/content/e7aee58f-a068-468d-b584-49807b413016" },
  { id: "a547d965-eb3b-412a-9896-7d5cc37eb054", title: "Axes of Evil: office space edition", date: "2026-08-13", time: "16:17", url: "https://www.ft.com/content/a547d965-eb3b-412a-9896-7d5cc37eb054" },
  { id: "01c3117d-1c8b-4b57-b271-aea0ed607adc", title: "Andy Burnham warns water companies against treating customers like ‘blank cheque’", date: "2026-08-13", time: "15:53", url: "https://www.ft.com/content/01c3117d-1c8b-4b57-b271-aea0ed607adc" },
  { id: "c8b5605f-209c-4513-9111-1ccc00f3a07e", title: "In charts: Private schools widen lead over state rivals on A-level results day", date: "2026-08-13", time: "14:49", url: "https://www.ft.com/content/c8b5605f-209c-4513-9111-1ccc00f3a07e" },
  { id: "1f609a52-8b6e-4bc9-a851-c05c099c7029", title: "Starmer allies warn John Healey against blowing ‘strong’ economic inheritance", date: "2026-08-13", time: "14:23", url: "https://www.ft.com/content/1f609a52-8b6e-4bc9-a851-c05c099c7029" },
  { id: "b1ae24bd-af8b-4d98-985a-85213213b5f0", title: "How Jason Arday’s appointment became a reckoning for Cambridge", date: "2026-08-13", time: "14:03", url: "https://www.ft.com/content/b1ae24bd-af8b-4d98-985a-85213213b5f0" },
  { id: "fc7afa9c-6a99-4cb2-8982-da230d2845dd", title: "Fierce Trump ally Leavitt shocks Washington and leaves White House", date: "2026-08-13", time: "14:00", url: "https://www.ft.com/content/fc7afa9c-6a99-4cb2-8982-da230d2845dd" },
  { id: "6bc10fb1-7b09-4580-82b4-5a723768e4d7", title: "Japan needs deterrence and renewal — not managed decline", date: "2026-08-13", time: "13:42", url: "https://www.ft.com/content/6bc10fb1-7b09-4580-82b4-5a723768e4d7" },
  { id: "8e6cecd4-f0ce-4463-a238-37ecd73cbc81", title: "Frasers buys Harvey Nichols as Mike Ashley pushes into upmarket retail", date: "2026-08-13", time: "13:27", url: "https://www.ft.com/content/8e6cecd4-f0ce-4463-a238-37ecd73cbc81" },
  { id: "3f3abc19-1a0a-439a-90ee-971861cc144e", title: "Shein loses UK copyright lawsuit against Temu", date: "2026-08-13", time: "13:02", url: "https://www.ft.com/content/3f3abc19-1a0a-439a-90ee-971861cc144e" },
  { id: "382b1d01-8bfe-4933-a460-819bbc32eb59", title: "Canary Wharf Group sells SocGen office in £625mn deal", date: "2026-08-13", time: "12:10", url: "https://www.ft.com/content/382b1d01-8bfe-4933-a460-819bbc32eb59" },
  { id: "fdf1b9fc-3179-409e-9f07-949a78392f4b", title: "The right must fight its own woke wing", date: "2026-08-13", time: "12:02", url: "https://www.ft.com/content/fdf1b9fc-3179-409e-9f07-949a78392f4b" },
  { id: "395650e6-7963-428b-9d86-b39c36453f5d", title: "Price of niche rare earth jumps on fears of renewed Chinese export controls", date: "2026-08-13", time: "12:00", url: "https://www.ft.com/content/395650e6-7963-428b-9d86-b39c36453f5d" },
  { id: "1545729c-d9c0-431b-a045-eb71cdd0c261", title: "Sanae Takaichi slams Vladimir Putin’s visit to disputed Pacific islands", date: "2026-08-13", time: "11:47", url: "https://www.ft.com/content/1545729c-d9c0-431b-a045-eb71cdd0c261" },
  { id: "d0464e03-c3fd-4e8b-9ffa-573762e97e16", title: "Sun, sea and bombs in Odesa", date: "2026-08-13", time: "11:00", url: "https://www.ft.com/content/d0464e03-c3fd-4e8b-9ffa-573762e97e16" },
  { id: "538b3457-4bef-4012-89b9-3c068b900e6e", title: "Submit your questions: Wildfires, droughts and heat — is this summer our new normal?", date: "2026-08-13", time: "10:16", url: "https://www.ft.com/content/538b3457-4bef-4012-89b9-3c068b900e6e" },
  { id: "e90128dc-9a22-4fd1-933c-e344f38255a8", title: "UK growth resilient in second quarter", date: "2026-08-13", time: "09:01", url: "https://www.ft.com/content/e90128dc-9a22-4fd1-933c-e344f38255a8" },
  { id: "05e95d34-dcc3-437d-85cc-cc1c12fdaa23", title: "Maersk lifts full-year profit guidance after smashing estimates", date: "2026-08-13", time: "08:59", url: "https://www.ft.com/content/05e95d34-dcc3-437d-85cc-cc1c12fdaa23" },
  { id: "db647513-af64-417c-8c2d-8af957f16a6c", title: "Record number of UK students opt for degrees in engineering and tech", date: "2026-08-13", time: "08:53", url: "https://www.ft.com/content/db647513-af64-417c-8c2d-8af957f16a6c" },
  { id: "1ad56cc8-747e-4e2c-8e4a-f0144450b4c4", title: "South Korea orders new investors to take classes after single-stock trading frenzy", date: "2026-08-13", time: "08:44", url: "https://www.ft.com/content/1ad56cc8-747e-4e2c-8e4a-f0144450b4c4" },
  { id: "f35f8c3d-3c9f-4209-b8a7-e4038dfc528f", title: "UK economy grew 0.4% in second quarter", date: "2026-08-13", time: "07:02", url: "https://www.ft.com/content/f35f8c3d-3c9f-4209-b8a7-e4038dfc528f" },
  { id: "d8b52073-c847-48c9-b432-50e989c4b8f0", title: "‘The most difficult dilemma’", date: "2026-08-13", time: "06:30", url: "https://www.ft.com/content/d8b52073-c847-48c9-b432-50e989c4b8f0" },
  { id: "3fc16b44-8463-4235-87e8-057a350397a8", title: "FTAV’s further reading", date: "2026-08-13", time: "06:30", url: "https://www.ft.com/content/3fc16b44-8463-4235-87e8-057a350397a8" },
  { id: "1fbe47a6-bbf1-4de1-973b-8ce5baea591d", title: "The hyperscalers’ exploding purchase commitments", date: "2026-08-13", time: "06:00", url: "https://www.ft.com/content/1fbe47a6-bbf1-4de1-973b-8ce5baea591d" },
  { id: "ec651ee9-0f3c-411a-9cde-d326acf89cee", title: "FirstFT: Anthropic investors bet on $2tn valuation", date: "2026-08-13", time: "05:31", url: "https://www.ft.com/content/ec651ee9-0f3c-411a-9cde-d326acf89cee" },
  { id: "c0805c3c-0c3b-4a72-8fd7-999a3c0a992e", title: "Wall Street’s basketball billionaire mess", date: "2026-08-13", time: "05:00", url: "https://www.ft.com/content/c0805c3c-0c3b-4a72-8fd7-999a3c0a992e" },
  { id: "f2f2a881-1d4d-47db-a7d9-c6c50ee29a6a", title: "Russian ghost fleet tankers use ‘Mad Max’ nets to fend off Ukraine’s drones", date: "2026-08-13", time: "05:00", url: "https://www.ft.com/content/f2f2a881-1d4d-47db-a7d9-c6c50ee29a6a" },
  { id: "8202960d-ec90-4709-96e0-ab9cbddb5258", title: "Legal AI start-up Legora seeks funds at more than $10bn valuation", date: "2026-08-13", time: "05:00", url: "https://www.ft.com/content/8202960d-ec90-4709-96e0-ab9cbddb5258" },
  { id: "091b214d-231b-414a-8f3e-9ef9fc021926", title: "Total cost of privately educating a child in the UK rises to £216,000", date: "2026-08-13", time: "05:00", url: "https://www.ft.com/content/091b214d-231b-414a-8f3e-9ef9fc021926" },
  { id: "145f1b61-0a68-45b4-afb8-62fc74381ce4", title: "US justice department shifts focus to government programme fraud", date: "2026-08-13", time: "05:00", url: "https://www.ft.com/content/145f1b61-0a68-45b4-afb8-62fc74381ce4" },
  { id: "8cd394ef-c829-4905-bced-33250966c70b", title: "Everybody loves Nvidia — but then, they can’t afford not to", date: "2026-08-13", time: "05:00", url: "https://www.ft.com/content/8cd394ef-c829-4905-bced-33250966c70b" },
  { id: "531b41af-3913-4ad4-baa2-7f0f55188bf8", title: "A reality check is needed on Arctic shipping", date: "2026-08-13", time: "05:00", url: "https://www.ft.com/content/531b41af-3913-4ad4-baa2-7f0f55188bf8" },
  { id: "840ac156-af1c-4a82-b260-ae791072fcfa", title: "Anthropic investors bet on $2tn valuation in record IPO", date: "2026-08-13", time: "05:00", url: "https://www.ft.com/content/840ac156-af1c-4a82-b260-ae791072fcfa" },
];
