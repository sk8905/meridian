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
  { id: "7e2ae9c8-4c94-4550-bdfb-bb003e4780d8", title: "Reform UK’s leader in Wales steps down after being ‘reported to the police’", date: "2026-09-15", time: "17:01", url: "https://www.ft.com/content/7e2ae9c8-4c94-4550-bdfb-bb003e4780d8" },
  { id: "08ddd08c-97b2-46a0-a4ed-b3b4ff5ebfd9", title: "Saudi leader visits Egypt for security talks as war with Houthis intensifies", date: "2026-09-15", time: "16:27", url: "https://www.ft.com/content/08ddd08c-97b2-46a0-a4ed-b3b4ff5ebfd9" },
  { id: "b3674c9d-9db2-448d-bd57-f1c040de2d54", title: "Supreme Court rejects Donald Trump’s restrictions on mail-in ballots for midterms", date: "2026-09-15", time: "14:55", url: "https://www.ft.com/content/b3674c9d-9db2-448d-bd57-f1c040de2d54" },
  { id: "86078ee7-0c8a-4d2b-8ce7-4fc47d965985", title: "The main Trump-Xi summit achievement will be it happening at all", date: "2026-09-15", time: "14:00", url: "https://www.ft.com/content/86078ee7-0c8a-4d2b-8ce7-4fc47d965985" },
  { id: "4420bf7d-320f-431c-8ca9-5e554b356890", title: "AI fears spook Washington as more Republicans call for greater regulation", date: "2026-09-15", time: "14:00", url: "https://www.ft.com/content/4420bf7d-320f-431c-8ca9-5e554b356890" },
  { id: "2c206da5-63c9-405d-ae14-abe772ea32e0", title: "Santander wins £677mn legal appeal over PPI mis-selling bill", date: "2026-09-15", time: "13:10", url: "https://www.ft.com/content/2c206da5-63c9-405d-ae14-abe772ea32e0" },
  { id: "3f2b2172-0c1a-4708-aba2-559eb37eabc8", title: "China tightens control of overseas travel in sweeping new law", date: "2026-09-15", time: "13:01", url: "https://www.ft.com/content/3f2b2172-0c1a-4708-aba2-559eb37eabc8" },
  { id: "fa93720c-4df4-42dc-bee5-c1026fbd7f77", title: "BPRE’s extremely large, very huge, getting-bigger NAV discount", date: "2026-09-15", time: "12:37", url: "https://www.ft.com/content/fa93720c-4df4-42dc-bee5-c1026fbd7f77" },
  { id: "f821d969-0eb3-44f5-baf7-96f5e434a1ed", title: "Bad decisions, difficult incentives and excitable markets", date: "2026-09-15", time: "12:30", url: "https://www.ft.com/content/f821d969-0eb3-44f5-baf7-96f5e434a1ed" },
  { id: "66a5a8dc-0b79-48cd-a12a-ecef5b73db1a", title: "Managers at Lucy Letby hospital too slow to call police, inquiry finds", date: "2026-09-15", time: "12:30", url: "https://www.ft.com/content/66a5a8dc-0b79-48cd-a12a-ecef5b73db1a" },
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
];
