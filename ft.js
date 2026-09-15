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
  { id: "51a381f2-cbff-4d2f-9ebd-9f0ec3996570", title: "Kevin Warsh needs to walk the walk", date: "2026-09-15", time: "12:22", url: "https://www.ft.com/content/51a381f2-cbff-4d2f-9ebd-9f0ec3996570" },
  { id: "2104f2c8-ba9b-4716-bc26-a69c7c46a450", title: "Trump’s Venezuela oil deal: deeply flawed or too big to fail?", date: "2026-09-15", time: "12:00", url: "https://www.ft.com/content/2104f2c8-ba9b-4716-bc26-a69c7c46a450" },
  { id: "76795dfc-2d44-421b-9665-5d86346af328", title: "Sullivan & Cromwell hires team of Kirkland partners in private equity push", date: "2026-09-15", time: "12:00", url: "https://www.ft.com/content/76795dfc-2d44-421b-9665-5d86346af328" },
  { id: "608a9f4e-0beb-4840-a37c-831a5265d7da", title: "Scott Bessent’s wobbly house", date: "2026-09-15", time: "11:59", url: "https://www.ft.com/content/608a9f4e-0beb-4840-a37c-831a5265d7da" },
  { id: "e1b2e9c2-9086-4ba1-bbda-58133c60f011", title: "Food crisis fears ease as fertiliser exporters fill gap left by Iran war", date: "2026-09-15", time: "11:38", url: "https://www.ft.com/content/e1b2e9c2-9086-4ba1-bbda-58133c60f011" },
  { id: "b49762b0-2f8a-457d-bd3a-2820f1fff346", title: "Russian warship fires flares at Danish helicopter over Baltic Sea", date: "2026-09-15", time: "11:03", url: "https://www.ft.com/content/b49762b0-2f8a-457d-bd3a-2820f1fff346" },
  { id: "01aaea22-f05a-498b-b6df-7075c11271d0", title: "Meloni presses ahead with election law that boosts her far-right rival", date: "2026-09-15", time: "11:00", url: "https://www.ft.com/content/01aaea22-f05a-498b-b6df-7075c11271d0" },
  { id: "6ec4a7e7-18f7-454f-94e9-1836af14b5e6", title: "Young workers trade the ladder for the lily pad", date: "2026-09-15", time: "11:00", url: "https://www.ft.com/content/6ec4a7e7-18f7-454f-94e9-1836af14b5e6" },
  { id: "43729997-e516-45a9-893b-de7bd729bc2f", title: "The ex-JPMorgan banker facing Wall Street’s toughest turnaround job", date: "2026-09-15", time: "11:00", url: "https://www.ft.com/content/43729997-e516-45a9-893b-de7bd729bc2f" },
  { id: "4b9a0db3-733b-4816-8931-de6bf49ffee6", title: "Telenor charged with aiding crimes against humanity in Myanmar", date: "2026-09-15", time: "10:57", url: "https://www.ft.com/content/4b9a0db3-733b-4816-8931-de6bf49ffee6" },
  { id: "a491245d-6f6a-4218-9289-3fa8e43632ad", title: "Submit a question: What do British businesses need from the Budget?", date: "2026-09-15", time: "10:56", url: "https://www.ft.com/content/a491245d-6f6a-4218-9289-3fa8e43632ad" },
  { id: "f651d61d-c4be-430c-bdc1-7bdbc0da5f0d", title: "Softer UK labour market will keep BoE on hold for now", date: "2026-09-15", time: "10:16", url: "https://www.ft.com/content/f651d61d-c4be-430c-bdc1-7bdbc0da5f0d" },
  { id: "2374a71b-1a31-444f-8221-6c73c7c1c251", title: "UK state pension will surpass income tax threshold next year", date: "2026-09-15", time: "09:37", url: "https://www.ft.com/content/2374a71b-1a31-444f-8221-6c73c7c1c251" },
  { id: "2ec90cb4-5c67-4655-8ee3-43785d00d22a", title: "Wales, Scotland and unclear exits from the UK", date: "2026-09-15", time: "09:30", url: "https://www.ft.com/content/2ec90cb4-5c67-4655-8ee3-43785d00d22a" },
  { id: "6d169ac7-0d3a-4f21-91ee-b8119fc63e65", title: "China’s AI listings glut drags Hong Kong stocks lower", date: "2026-09-15", time: "08:10", url: "https://www.ft.com/content/6d169ac7-0d3a-4f21-91ee-b8119fc63e65" },
  { id: "8bc0d474-7252-4e38-b4b2-ceeb7800d10d", title: "UK employers cut jobs as labour market remains weak over summer", date: "2026-09-15", time: "07:56", url: "https://www.ft.com/content/8bc0d474-7252-4e38-b4b2-ceeb7800d10d" },
  { id: "696180f1-c9ad-4434-8ad2-b1dc30773e53", title: "Help to Buy scheme was ‘very high value for money’, says official review", date: "2026-09-15", time: "07:00", url: "https://www.ft.com/content/696180f1-c9ad-4434-8ad2-b1dc30773e53" },
  { id: "7ac9a299-1ba0-428c-9207-ecf959b386f1", title: "The great British (and American) fork in the road", date: "2026-09-15", time: "06:30", url: "https://www.ft.com/content/7ac9a299-1ba0-428c-9207-ecf959b386f1" },
  { id: "0b1b2875-fa2d-417b-8617-c6e51bebf083", title: "FTAV’s further reading", date: "2026-09-15", time: "06:30", url: "https://www.ft.com/content/0b1b2875-fa2d-417b-8617-c6e51bebf083" },
  { id: "69b5bd51-c8e1-41c1-a139-c28aa4c795ef", title: "Carney calls for ‘unique alliance’ with EU in plea for closer trade ties", date: "2026-09-15", time: "06:00", url: "https://www.ft.com/content/69b5bd51-c8e1-41c1-a139-c28aa4c795ef" },
  { id: "b14ad3a8-f36c-4023-b619-c6e939165886", title: "It’s crunch time for BoneSupport, one of Europe’s most shorted stocks", date: "2026-09-15", time: "06:00", url: "https://www.ft.com/content/b14ad3a8-f36c-4023-b619-c6e939165886" },
  { id: "5e2327aa-dbd0-4a79-8c99-622a893876d7", title: "Global bonds follow US Treasuries lower", date: "2026-09-15", time: "05:37", url: "https://www.ft.com/content/5e2327aa-dbd0-4a79-8c99-622a893876d7" },
  { id: "18c9a381-1dc2-4b93-8326-405880586aa3", title: "FirstFT: UK fiscal realities close in on Downing Street", date: "2026-09-15", time: "05:31", url: "https://www.ft.com/content/18c9a381-1dc2-4b93-8326-405880586aa3" },
  { id: "d9158802-5836-441a-9969-47409044c503", title: "China’s economy shows signs of weakness as investment slumps", date: "2026-09-15", time: "05:18", url: "https://www.ft.com/content/d9158802-5836-441a-9969-47409044c503" },
  { id: "aafa05d0-db36-4a41-a79b-2bcc2bb9aae0", title: "Banco Santander opens its vaults — with some help from David Chipperfield", date: "2026-09-15", time: "05:00", url: "https://www.ft.com/content/aafa05d0-db36-4a41-a79b-2bcc2bb9aae0" },
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
];
