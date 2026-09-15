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
  { id: "a43e9050-f646-4d24-b650-b75ef589985c", title: "Private equity’s new AI overlords?", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/a43e9050-f646-4d24-b650-b75ef589985c" },
  { id: "410b768f-e739-45bb-9ef1-04fd571142a8", title: "Ben Delo: the crypto billionaire helping to bankroll Reform UK", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/410b768f-e739-45bb-9ef1-04fd571142a8" },
  { id: "f00de325-5045-4e98-9068-9261bfe9eff3", title: "Luxembourg probes Gazprombank ex-managers", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/f00de325-5045-4e98-9068-9261bfe9eff3" },
  { id: "3abf587d-af1b-4de4-b1fe-b5b4cb48a6cd", title: "Hyrox’s new owners hope to turn burpees into billions", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/3abf587d-af1b-4de4-b1fe-b5b4cb48a6cd" },
  { id: "e14542d9-2bc5-49c8-8e7e-c9656b0a2d36", title: "US manufacturers hit by fresh burst of supply chain cost inflation", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/e14542d9-2bc5-49c8-8e7e-c9656b0a2d36" },
  { id: "0b2c5b87-c743-4c0f-9fbd-117ae27d6b0b", title: "AI is exciting audit firms — maybe too much", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/0b2c5b87-c743-4c0f-9fbd-117ae27d6b0b" },
  { id: "1212e333-9149-46bf-89fb-03081e9e63f2", title: "Oxford spin-off builds low-cost jet engines for drones", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/1212e333-9149-46bf-89fb-03081e9e63f2" },
  { id: "a143e08d-e979-410a-8e81-160fd4eba367", title: "Iran’s allies squeeze Saudi Arabia", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/a143e08d-e979-410a-8e81-160fd4eba367" },
  { id: "ebca8754-9546-4668-85dd-a0d793c54d3c", title: "Vladimir Putin moves summit over Ukrainian drone threat", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/ebca8754-9546-4668-85dd-a0d793c54d3c" },
  { id: "03e903dc-6936-45d6-bc76-997b2ad75ec5", title: "ECB staff demand clarity over Christine Lagarde’s potential early exit", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/03e903dc-6936-45d6-bc76-997b2ad75ec5" },
  { id: "6c387cda-61b0-4396-9353-0d7d99781f9b", title: "How Poland lost $230mn trying to buy Venezuelan oil with crypto", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/6c387cda-61b0-4396-9353-0d7d99781f9b" },
  { id: "59a0cd3e-62cf-45f5-9377-43429db5aefa", title: "Britain, Burnham and tax: the walls close in", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/59a0cd3e-62cf-45f5-9377-43429db5aefa" },
  { id: "439dfb20-cb9b-4db2-8d0a-ba7442281846", title: "The EU’s ‘Made in Europe’ policy spooks British industry", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/439dfb20-cb9b-4db2-8d0a-ba7442281846" },
  { id: "bdd5274a-bf02-4ca2-bd72-2c0558605707", title: "The $1.6bn IPO that could draw millions of Nigerians to the stock market", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/bdd5274a-bf02-4ca2-bd72-2c0558605707" },
  { id: "c4641e3b-a605-468e-841b-73a22eee0781", title: "Jaguar Land Rover targets Nato military budgets with revamped Defender", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/c4641e3b-a605-468e-841b-73a22eee0781" },
  { id: "7265f15f-c1e4-49c5-b6e0-8c3a29e70892", title: "UK and Japan seek to fully benefit from ‘Made in Europe’ car sector rules", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/7265f15f-c1e4-49c5-b6e0-8c3a29e70892" },
  { id: "e565ce70-17ac-42ad-bc08-b9a69d75d5b1", title: "Foreign investors prefer US stocks to Treasuries as debt worries grow", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/e565ce70-17ac-42ad-bc08-b9a69d75d5b1" },
  { id: "dab77b4d-9ee9-4bbe-8965-bc744f9529ea", title: "FTSE 100 bosses paid record average of £5mn", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/dab77b4d-9ee9-4bbe-8965-bc744f9529ea" },
  { id: "a8789270-aeee-4bfd-89a3-207c0a46730d", title: "Tories look at ways to cut UK inheritance tax", date: "2026-09-14", time: "19:35", url: "https://www.ft.com/content/a8789270-aeee-4bfd-89a3-207c0a46730d" },
  { id: "757da464-7102-4e69-9598-ba65b5a4c3e9", title: "Nigel Farage refuses to say if Reform UK’s £72mn gifts would comply with new cap", date: "2026-09-14", time: "19:06", url: "https://www.ft.com/content/757da464-7102-4e69-9598-ba65b5a4c3e9" },
  { id: "8a003048-468c-4bec-83a7-154d7cdbb24e", title: "Unions demand softening of UK immigration reforms", date: "2026-09-14", time: "18:49", url: "https://www.ft.com/content/8a003048-468c-4bec-83a7-154d7cdbb24e" },
  { id: "38ea0870-0100-4f4e-bd71-89074761095c", title: "Why delaying an AI doomsday would benefit investors too", date: "2026-09-14", time: "18:24", url: "https://www.ft.com/content/38ea0870-0100-4f4e-bd71-89074761095c" },
  { id: "d6f98d2e-9f0c-4414-a339-fe8462810276", title: "Donald Trump claims Russia and Ukraine have agreed energy truce", date: "2026-09-14", time: "18:18", url: "https://www.ft.com/content/d6f98d2e-9f0c-4414-a339-fe8462810276" },
  { id: "b132d848-7d0b-4938-81ee-3683ef2004db", title: "Time for a pause on cutting-edge AI", date: "2026-09-14", time: "18:16", url: "https://www.ft.com/content/b132d848-7d0b-4938-81ee-3683ef2004db" },
  { id: "905fb04b-f738-41b2-a571-604031a622da", title: "Germany tells Andrea Orcel to keep Commerzbank’s Frankfurt HQ after takeover", date: "2026-09-14", time: "18:13", url: "https://www.ft.com/content/905fb04b-f738-41b2-a571-604031a622da" },
  { id: "4845a503-3ddd-4bb7-a469-c51f275bc873", title: "Oil hits $109 after Saudi Arabia closes vital export pipeline", date: "2026-09-14", time: "17:31", url: "https://www.ft.com/content/4845a503-3ddd-4bb7-a469-c51f275bc873" },
  { id: "7beb54c6-ed34-40d8-baa8-f1c0a2e8f0c3", title: "We won’t solve young people’s worklessness without listening to them", date: "2026-09-14", time: "17:29", url: "https://www.ft.com/content/7beb54c6-ed34-40d8-baa8-f1c0a2e8f0c3" },
  { id: "b01682ae-1d49-46bb-b23a-d6212574214d", title: "France in ‘astonishing’ push to lift EU sanctions on Russian oligarch", date: "2026-09-14", time: "17:19", url: "https://www.ft.com/content/b01682ae-1d49-46bb-b23a-d6212574214d" },
  { id: "2b8c8997-0a76-4c48-9384-aac94904b7fb", title: "UK government to take over insolvent steelmaker", date: "2026-09-14", time: "17:17", url: "https://www.ft.com/content/2b8c8997-0a76-4c48-9384-aac94904b7fb" },
  { id: "68599310-58ae-4a11-b885-3e34ebaa8af9", title: "Britain’s assisted dying debate was hobbled by a lack of candour", date: "2026-09-14", time: "17:04", url: "https://www.ft.com/content/68599310-58ae-4a11-b885-3e34ebaa8af9" },
  { id: "b78370c8-dc35-47ea-a254-a75421a46a85", title: "Syrians take to the streets over fuel price rise", date: "2026-09-14", time: "17:01", url: "https://www.ft.com/content/b78370c8-dc35-47ea-a254-a75421a46a85" },
  { id: "aa8a1be7-abe0-44b7-bcd3-31fd0a44de08", title: "US tech stocks fall after big AI groups call for slowdown", date: "2026-09-14", time: "16:51", url: "https://www.ft.com/content/aa8a1be7-abe0-44b7-bcd3-31fd0a44de08" },
  { id: "4205babe-1db0-4507-be8f-70b1e8954c7f", title: "America’s superheroes moved to Britain, but will they stay?", date: "2026-09-14", time: "15:53", url: "https://www.ft.com/content/4205babe-1db0-4507-be8f-70b1e8954c7f" },
  { id: "06cb850d-089a-4318-88d7-a410e9766b89", title: "Ten-year Treasury yield hits 5% for first time since 2023", date: "2026-09-14", time: "15:51", url: "https://www.ft.com/content/06cb850d-089a-4318-88d7-a410e9766b89" },
  { id: "24eda5dc-3a2c-489c-a304-1c1451f7c2a7", title: "Stoltenberg reneges on Munich Security Conference top job plan", date: "2026-09-14", time: "15:42", url: "https://www.ft.com/content/24eda5dc-3a2c-489c-a304-1c1451f7c2a7" },
  { id: "ba38df40-9898-48a0-bc9e-39d8a3da4305", title: "How much should lenders charge hyperscalers?", date: "2026-09-14", time: "15:23", url: "https://www.ft.com/content/ba38df40-9898-48a0-bc9e-39d8a3da4305" },
  { id: "5495d88b-b457-498a-bedd-64a954b538cd", title: "Michael Dell’s family office leads $7.7bn deal to take insurance broker private", date: "2026-09-14", time: "14:17", url: "https://www.ft.com/content/5495d88b-b457-498a-bedd-64a954b538cd" },
  { id: "2c143d02-7fbd-4aa2-922c-f9afc8044dbe", title: "Monetary Policy Radar preview: Fed September meeting", date: "2026-09-14", time: "14:03", url: "https://www.ft.com/content/2c143d02-7fbd-4aa2-922c-f9afc8044dbe" },
  { id: "296b56d1-a30e-43cf-ac15-8a42de5cd59a", title: "The politics of AI, part two", date: "2026-09-14", time: "14:00", url: "https://www.ft.com/content/296b56d1-a30e-43cf-ac15-8a42de5cd59a" },
  { id: "dd6af02e-9328-48f6-9054-4623cf65b8b1", title: "Keir Starmer approved £860,000 pay-off for sacked civil service chief", date: "2026-09-14", time: "14:00", url: "https://www.ft.com/content/dd6af02e-9328-48f6-9054-4623cf65b8b1" },
];
