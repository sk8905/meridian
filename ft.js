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
  { id: "a71b77dc-35db-49ef-9f60-103fc6c6d98e", title: "Singapore warns of economic risks if global AI boom falters", date: "2026-07-28", time: "10:30", url: "https://www.ft.com/content/a71b77dc-35db-49ef-9f60-103fc6c6d98e" },
  { id: "a51314c3-36d0-4653-992c-42b62495c5fe", title: "World's largest listed hedge fund reverses outflows in key unit", date: "2026-07-28", time: "10:24", url: "https://www.ft.com/content/a51314c3-36d0-4653-992c-42b62495c5fe" },
  { id: "5dca4c81-be8a-4555-971f-181eebf53e62", title: "Zelenskyy returns to Oval Office as Trump shifts towards Ukraine", date: "2026-07-28", time: "10:13", url: "https://www.ft.com/content/5dca4c81-be8a-4555-971f-181eebf53e62" },
  { id: "cc78fbc5-66dc-4a60-8ef5-e040b8aa7a11", title: "Education is not to blame for England's Neet crisis", date: "2026-07-28", time: "09:43", url: "https://www.ft.com/content/cc78fbc5-66dc-4a60-8ef5-e040b8aa7a11" },
  { id: "29d6edcc-4499-4655-bfec-0060bea95a66", title: "EY fined £1.2mn for breaching standards on Made.com audit", date: "2026-07-28", time: "09:18", url: "https://www.ft.com/content/29d6edcc-4499-4655-bfec-0060bea95a66" },
  { id: "6b2c9eb1-24f0-4117-a390-cfcdfdaad3a9", title: "Barclays profits boosted by market volatility gains", date: "2026-07-28", time: "07:30", url: "https://www.ft.com/content/6b2c9eb1-24f0-4117-a390-cfcdfdaad3a9" },
  { id: "d6439cb3-5a9e-4f6e-b5d6-b0e5621567c4", title: "The unexpected winners from China’s blockbuster chip IPO", date: "2026-07-28", time: "06:35", url: "https://www.ft.com/content/d6439cb3-5a9e-4f6e-b5d6-b0e5621567c4" },
  { id: "f917cd45-785a-45dd-9826-e8efed7003c0", title: "Tariffs and Treasury yields", date: "2026-07-28", time: "06:30", url: "https://www.ft.com/content/f917cd45-785a-45dd-9826-e8efed7003c0" },
  { id: "37ad8ef8-eaa0-4f01-adf5-fc7bf5b20cb9", title: "FTAV’s further reading", date: "2026-07-28", time: "06:30", url: "https://www.ft.com/content/37ad8ef8-eaa0-4f01-adf5-fc7bf5b20cb9" },
  { id: "f8c03b5b-e194-4236-82c3-389b6f5dd7ae", title: "AI stock sell-off deepens as investors dump chipmakers", date: "2026-07-28", time: "06:16", url: "https://www.ft.com/content/f8c03b5b-e194-4236-82c3-389b6f5dd7ae" },
  { id: "39c96379-0797-43f0-ae01-6711dd8986dc", title: "EU keeps firefighting planes on standby as France and Spain battle blazes", date: "2026-07-28", time: "06:00", url: "https://www.ft.com/content/39c96379-0797-43f0-ae01-6711dd8986dc" },
  { id: "8ed46f5f-0d52-46a8-a38d-642f5a828491", title: "Quant trading ≠ software company", date: "2026-07-28", time: "06:00", url: "https://www.ft.com/content/8ed46f5f-0d52-46a8-a38d-642f5a828491" },
  { id: "487d9a9f-5709-4fcb-9d75-45c16d6d1cfa", title: "FirstFT: TotalEnergies to benefit from Russian sanctions U-turn", date: "2026-07-28", time: "05:31", url: "https://www.ft.com/content/487d9a9f-5709-4fcb-9d75-45c16d6d1cfa" },
  { id: "b11cae2f-e210-48ad-8665-3243c7b86e13", title: "Bank of England to raise rates this year if energy prices stay high", date: "2026-07-28", time: "05:30", url: "https://www.ft.com/content/b11cae2f-e210-48ad-8665-3243c7b86e13" },
  { id: "c6e66af7-5ffe-46ff-8936-78d742c1cdfd", title: "BYD takes on Japan’s ‘kei’ car market with tiny EV", date: "2026-07-28", time: "05:16", url: "https://www.ft.com/content/c6e66af7-5ffe-46ff-8936-78d742c1cdfd" },
  { id: "0c734fbf-73f1-473d-a2fa-a59880bac4d6", title: "DCC board grapples with an M&A ‘laggard’s dilemma’", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/0c734fbf-73f1-473d-a2fa-a59880bac4d6" },
  { id: "0ee947e4-0b2a-48e4-93de-2c7985662f14", title: "TotalEnergies benefits from EU sanctions reprieve on Russian gas", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/0ee947e4-0b2a-48e4-93de-2c7985662f14" },
  { id: "cc27661a-9a6f-4e55-bfa3-64afd7107655", title: "Polish opposition split hands Donald Tusk pre-election boost", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/cc27661a-9a6f-4e55-bfa3-64afd7107655" },
  { id: "d471f2f4-e720-4684-86fd-21713daa4119", title: "Is a private equity megadeal brewing?", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/d471f2f4-e720-4684-86fd-21713daa4119" },
  { id: "976c453c-ae12-4318-be50-e8347b385637", title: "Don’t underestimate the economic power of a UK vibe shift", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/976c453c-ae12-4318-be50-e8347b385637" },
  { id: "ef7ff634-b738-4975-91b5-2edffc51da68", title: "EU hesitates to target Irish plant accused of supplying Russia’s war industry", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/ef7ff634-b738-4975-91b5-2edffc51da68" },
  { id: "bdfafe1e-8f31-437d-8bc3-93df255ca487", title: "‘Unpredictable and extremely dangerous’: France hit by rare fire thunderstorms", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/bdfafe1e-8f31-437d-8bc3-93df255ca487" },
  { id: "063eecdd-125f-44a7-86c0-78f202817d7e", title: "Trump’s ability to talk down oil prices is being tested", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/063eecdd-125f-44a7-86c0-78f202817d7e" },
  { id: "685014e7-47dd-471b-a585-1b9b73ce5d6f", title: "Nvidia behind $50bn lease on Texas data centre that will use its chips", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/685014e7-47dd-471b-a585-1b9b73ce5d6f" },
  { id: "a6801e59-3a71-4752-8456-86691e3e163f", title: "China needs a new growth model", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/a6801e59-3a71-4752-8456-86691e3e163f" },
  { id: "e0c5b0e8-0772-4aa6-a011-129510420c3a", title: "More than two-thirds of FTSE 100 restate climate metrics, analysis finds", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/e0c5b0e8-0772-4aa6-a011-129510420c3a" },
  { id: "82acf078-9214-4eb6-a162-15f584a5e3ca", title: "Iran’s missile resilience challenges US forces", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/82acf078-9214-4eb6-a162-15f584a5e3ca" },
  { id: "a883cdad-1851-46e1-a58f-ac5fedae2e3d", title: "Hungary’s thawing relations with EU provide lucrative trade for foreign funds", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/a883cdad-1851-46e1-a58f-ac5fedae2e3d" },
  { id: "ce46154a-f783-4494-8ddd-a0e094414bcb", title: "To create wealth, Europe must reap the dividends of radio spectrum", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/ce46154a-f783-4494-8ddd-a0e094414bcb" },
  { id: "6d2d0b89-0d26-4e49-8e52-a53bdc178974", title: "The UAE’s bold gambit on Iran", date: "2026-07-28", time: "05:00", url: "https://www.ft.com/content/6d2d0b89-0d26-4e49-8e52-a53bdc178974" },
  { id: "0a0684fe-2ba0-4909-82ca-0e5e70955ce3", title: "Trump says Israel ‘would not survive’ without US", date: "2026-07-27", time: "18:51", url: "https://www.ft.com/content/0a0684fe-2ba0-4909-82ca-0e5e70955ce3" },
  { id: "2fe22a35-5544-4a0e-b72a-b93e941cbcad", title: "Burnham appoints 61 parliamentary private secretaries in bid to avert Labour unrest", date: "2026-07-27", time: "18:51", url: "https://www.ft.com/content/2fe22a35-5544-4a0e-b72a-b93e941cbcad" },
  { id: "403625cc-8371-43ee-997a-f6908a97f52e", title: "Oil tumbles as Iran and US pause strikes over Strait of Hormuz", date: "2026-07-27", time: "18:24", url: "https://www.ft.com/content/403625cc-8371-43ee-997a-f6908a97f52e" },
  { id: "9f446812-5dc9-4d25-9a4b-ac5162e62d81", title: "Ares Management has held talks to buy Leonard Green & Partners", date: "2026-07-27", time: "18:23", url: "https://www.ft.com/content/9f446812-5dc9-4d25-9a4b-ac5162e62d81" },
  { id: "5c78dec1-b6d6-415e-9456-f1ab5eed6146", title: "Nvidia bets $5bn on Ilya Sutskever’s AI breakthrough", date: "2026-07-27", time: "18:20", url: "https://www.ft.com/content/5c78dec1-b6d6-415e-9456-f1ab5eed6146" },
  { id: "426d49ae-1d07-45f4-b784-e65756a4f5ac", title: "Donald Trump rebuilds his tariff wall", date: "2026-07-27", time: "17:57", url: "https://www.ft.com/content/426d49ae-1d07-45f4-b784-e65756a4f5ac" },
  { id: "858c912e-1ea6-4c06-8929-dce7fe805622", title: "Canary Wharf holds lessons for Andy Burnham", date: "2026-07-27", time: "17:14", url: "https://www.ft.com/content/858c912e-1ea6-4c06-8929-dce7fe805622" },
  { id: "45867580-65a2-4a7d-ba4c-8143e86f4e36", title: "France and Spain brace for more extreme heat as wildfires rage", date: "2026-07-27", time: "17:11", url: "https://www.ft.com/content/45867580-65a2-4a7d-ba4c-8143e86f4e36" },
  { id: "47ef8550-034e-464f-8e49-64c3e4de827f", title: "Jodrell Bank observatory set to lose scientific funding", date: "2026-07-27", time: "17:09", url: "https://www.ft.com/content/47ef8550-034e-464f-8e49-64c3e4de827f" },
  { id: "83e93ce0-1ebd-4b04-a70c-82ff7b64a5f4", title: "Amazon targets Musk’s Starlink with satellite constellation for mobile services", date: "2026-07-27", time: "16:57", url: "https://www.ft.com/content/83e93ce0-1ebd-4b04-a70c-82ff7b64a5f4" },
  { id: "8829bb6c-e4e4-4064-960a-8f789da10a41", title: "Andy Burnham rejects northern Labour MPs’ call to abolish council tax", date: "2026-07-27", time: "16:40", url: "https://www.ft.com/content/8829bb6c-e4e4-4064-960a-8f789da10a41" },
  { id: "9f9662cb-06ba-42a4-b2f2-800a60818de1", title: "Burnham and the problem of politics by social media", date: "2026-07-27", time: "16:28", url: "https://www.ft.com/content/9f9662cb-06ba-42a4-b2f2-800a60818de1" },
];
