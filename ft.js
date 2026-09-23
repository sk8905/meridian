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
  { id: "7c1a2718-b0a4-4dda-8c3a-c36ff6792e2b", title: "Why Germany’s ‘chancellor-in-waiting’ bides his time", date: "2026-09-23", time: "11:00", url: "https://www.ft.com/content/7c1a2718-b0a4-4dda-8c3a-c36ff6792e2b" },
  { id: "b05367af-5236-4aca-99e7-ec1e8968f08a", title: "Azerbaijan pardons French national as part of secret prisoner release deal", date: "2026-09-23", time: "10:40", url: "https://www.ft.com/content/b05367af-5236-4aca-99e7-ec1e8968f08a" },
  { id: "7d0f525e-f99d-4175-b37c-78d4dd4adf2b", title: "Enter slopfiling", date: "2026-09-23", time: "10:30", url: "https://www.ft.com/content/7d0f525e-f99d-4175-b37c-78d4dd4adf2b" },
  { id: "62a6939f-7e24-492e-bdf6-b9ab9e1d3578", title: "Airtel Money launches one of London’s biggest IPOs in recent years", date: "2026-09-23", time: "07:56", url: "https://www.ft.com/content/62a6939f-7e24-492e-bdf6-b9ab9e1d3578" },
  { id: "9fbc4577-068b-45ad-b7fe-f524b9731d4e", title: "Pornhub's age checks probed by UK watchdog", date: "2026-09-23", time: "09:57", url: "https://www.ft.com/content/9fbc4577-068b-45ad-b7fe-f524b9731d4e" },
  { id: "7d59acf7-7bac-42e0-a5b2-196391d0480d", title: "The Liberal Democrats' unserious tax cut pledge", date: "2026-09-23", time: "09:30", url: "https://www.ft.com/content/7d59acf7-7bac-42e0-a5b2-196391d0480d" },
  { id: "9bc23f86-f977-408e-b32f-2917fd4a2267", title: "Swiss lawmakers vote to back tighter UBS capital rules", date: "2026-09-23", time: "09:22", url: "https://www.ft.com/content/9bc23f86-f977-408e-b32f-2917fd4a2267" },
  { id: "8cefcdba-2d5b-421b-969e-1a302b660fe5", title: "Bank of England can avoid raising interest rates, says OECD", date: "2026-09-23", time: "09:00", url: "https://www.ft.com/content/8cefcdba-2d5b-421b-969e-1a302b660fe5" },
  { id: "6c13ada9-f325-428b-b91e-bffcf92eddad", title: "OECD sounds alarm on surging government bond yields", date: "2026-09-23", time: "09:00", url: "https://www.ft.com/content/6c13ada9-f325-428b-b91e-bffcf92eddad" },
  { id: "344e7af4-42ce-4cf0-b608-aa25eaa1e7ee", title: "FTAV's further reading", date: "2026-09-23", time: "08:18", url: "https://www.ft.com/content/344e7af4-42ce-4cf0-b608-aa25eaa1e7ee" },
  { id: "a0c1434a-4f27-445b-ac37-23181424cd33", title: "Confessions of an accidental bonus basher", date: "2026-09-23", time: "07:00", url: "https://www.ft.com/content/a0c1434a-4f27-445b-ac37-23181424cd33" },
  { id: "04c5abf0-d7c4-47ca-9391-4a154c14e178", title: "Private credit's \"soft\" defaults", date: "2026-09-23", time: "06:30", url: "https://www.ft.com/content/04c5abf0-d7c4-47ca-9391-4a154c14e178" },
  { id: "61f49a3d-ffac-4f09-b946-bfc1f9194e89", title: "Meloni at spending crossroads after failing to get off EU's fiscal naughty step", date: "2026-09-23", time: "06:00", url: "https://www.ft.com/content/61f49a3d-ffac-4f09-b946-bfc1f9194e89" },
  { id: "0a5a5b70-adea-40af-9933-1f7679f9f359", title: "Oil price on track for longest losing streak in more than 12 months", date: "2026-09-23", time: "05:42", url: "https://www.ft.com/content/0a5a5b70-adea-40af-9933-1f7679f9f359" },
  { id: "d85c9ab3-9b77-4b96-9321-c548bbbfd07a", title: "FirstFT: Boehly gets US and Gulf backing for Lukoil assets bid", date: "2026-09-23", time: "05:31", url: "https://www.ft.com/content/d85c9ab3-9b77-4b96-9321-c548bbbfd07a" },
  { id: "c557b92a-48bc-4d82-8fdb-f45cdc96ed77", title: "A more hawkish ECB will respond to prolonged high energy prices", date: "2026-09-23", time: "05:30", url: "https://www.ft.com/content/c557b92a-48bc-4d82-8fdb-f45cdc96ed77" },
  { id: "7a977d6f-fdbc-425a-8881-7c43716c77f5", title: "South Korea bets on Texas gas plant to satisfy Donald Trump", date: "2026-09-23", time: "05:28", url: "https://www.ft.com/content/7a977d6f-fdbc-425a-8881-7c43716c77f5" },
  { id: "5b7decf1-08fd-43fc-b9f3-9870ffa5716f", title: "Has Donald Trump caged his China hawks?", date: "2026-09-23", time: "05:10", url: "https://www.ft.com/content/5b7decf1-08fd-43fc-b9f3-9870ffa5716f" },
  { id: "33c88371-1925-4b63-b0ba-26b974386418", title: "On the rise: Edinburgh’s hot bakery scene", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/33c88371-1925-4b63-b0ba-26b974386418" },
  { id: "ff2e8572-8e74-47c6-accb-0739d8ca59ac", title: "Inseparable ingredients of a happy retirement", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/ff2e8572-8e74-47c6-accb-0739d8ca59ac" },
  { id: "51618d4e-6398-4368-a8f1-c46c1bc7956e", title: "Public art is often bad — is there a secret to success?", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/51618d4e-6398-4368-a8f1-c46c1bc7956e" },
  { id: "ab694096-0acf-4e13-9726-ec339a082a99", title: "Global banks warn UK windfall tax will trigger shift away from London", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/ab694096-0acf-4e13-9726-ec339a082a99" },
  { id: "f6962aaf-417f-4722-8316-0a0049af55aa", title: "Private equity has a new kind of SaaS: swimming as a service", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/f6962aaf-417f-4722-8316-0a0049af55aa" },
  { id: "0c7eac88-bc13-42be-aa18-f78ec1483ca6", title: "Biotech is one area where the US can afford to let China flourish", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/0c7eac88-bc13-42be-aa18-f78ec1483ca6" },
  { id: "d2e5ed9c-a123-4275-afc7-14b75b9337a0", title: "The battle between the Fed and Trump", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/d2e5ed9c-a123-4275-afc7-14b75b9337a0" },
  { id: "76b51a19-0387-4eed-a343-980b1135de2c", title: "Diesel surge costs European drivers €203mn per day", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/76b51a19-0387-4eed-a343-980b1135de2c" },
  { id: "f95db340-8c8f-435f-957d-4623255ac29e", title: "Oil tanker costs hit record $1.2mn a day as Iran war disrupts shipping", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/f95db340-8c8f-435f-957d-4623255ac29e" },
  { id: "39845ea2-0738-4549-94f0-b0f6b212e6b2", title: "Todd Boehly’s oil deal from Russia with love", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/39845ea2-0738-4549-94f0-b0f6b212e6b2" },
  { id: "7ec7e4e7-94ed-4627-9040-18867ccdaa53", title: "Rivals Revolut and Nubank go head to head in bid to crack US banking market", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/7ec7e4e7-94ed-4627-9040-18867ccdaa53" },
  { id: "dffca393-d969-4e31-86bc-09ed6c06fbf0", title: "How could John Healey raise tax in the Budget?", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/dffca393-d969-4e31-86bc-09ed6c06fbf0" },
  { id: "b97dde39-7813-4a51-8176-3699e2a468b1", title: "China takes stock of Broadcom gear amid domestic AI drive", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/b97dde39-7813-4a51-8176-3699e2a468b1" },
  { id: "a784df61-a9a0-4ef4-93ff-5f082c3e730c", title: "The problem with P(doom)", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/a784df61-a9a0-4ef4-93ff-5f082c3e730c" },
  { id: "9100f4cb-fa8d-4322-97cf-cc248f821fc3", title: "How Morocco’s election became about the World Cup", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/9100f4cb-fa8d-4322-97cf-cc248f821fc3" },
  { id: "4a808a51-c6e9-4ade-b1f7-95c27fd1aa1e", title: "Mark Carney and the limits of defying Donald Trump", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/4a808a51-c6e9-4ade-b1f7-95c27fd1aa1e" },
  { id: "2b307c1e-cd98-4666-91d5-000b1dc7bbd1", title: "How private equity ended up in limbo", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/2b307c1e-cd98-4666-91d5-000b1dc7bbd1" },
  { id: "58be9a1b-345c-4026-a738-989b72858c4f", title: "Amodei is right — AI companies need banking-style supervision", date: "2026-09-23", time: "05:00", url: "https://www.ft.com/content/58be9a1b-345c-4026-a738-989b72858c4f" },
  { id: "44ef48c9-13a4-4823-aa8f-cc9e2dfb5d17", title: "Why EU companies are now helping Chinese ones expand into Europe", date: "2026-09-23", time: "00:01", url: "https://www.ft.com/content/44ef48c9-13a4-4823-aa8f-cc9e2dfb5d17" },
  { id: "0e50a3c6-9731-4b29-a21e-4e0ff89a595e", title: "Anthropic and OpenAI release cheaper models as price war intensifies", date: "2026-09-22", time: "21:31", url: "https://www.ft.com/content/0e50a3c6-9731-4b29-a21e-4e0ff89a595e" },
  { id: "43465057-ff09-4ff3-85d2-ebed45bee207", title: "Turkish dismay", date: "2026-09-22", time: "21:00", url: "https://www.ft.com/content/43465057-ff09-4ff3-85d2-ebed45bee207" },
  { id: "f2f37449-f9c7-4556-9f97-4cca735980e4", title: "Top UK graft prosecutors joined Trump’s Venezuela oil baron during Swiss probe", date: "2026-09-22", time: "21:00", url: "https://www.ft.com/content/f2f37449-f9c7-4556-9f97-4cca735980e4" },
];
