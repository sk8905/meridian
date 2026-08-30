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
  { id: "c9d10aeb-163e-46a3-b7ca-376ce6be9f8e", title: "Ukraine’s ex-defence minister touts ‘new history’ in war against Russia with planned tech fund", date: "2026-08-30", time: "18:57", url: "https://www.ft.com/content/c9d10aeb-163e-46a3-b7ca-376ce6be9f8e" },
  { id: "da5d96c1-c491-41a2-9db5-48bd952da4b4", title: "Return of the politicians", date: "2026-08-30", time: "18:15", url: "https://www.ft.com/content/da5d96c1-c491-41a2-9db5-48bd952da4b4" },
  { id: "63e8a4f3-7c18-4ddc-b3b7-e472159a7adf", title: "Americans feel they have lost their agency", date: "2026-08-30", time: "16:00", url: "https://www.ft.com/content/63e8a4f3-7c18-4ddc-b3b7-e472159a7adf" },
  { id: "4eb02822-d691-48a4-966f-45c6501bccb2", title: "Niger regains control of military base after coup attempt", date: "2026-08-30", time: "15:43", url: "https://www.ft.com/content/4eb02822-d691-48a4-966f-45c6501bccb2" },
  { id: "458940e7-0754-42e3-aa33-f1f9e3e710b7", title: "Controversial Venezuelan executive courts investors after Trump oil deal", date: "2026-08-30", time: "13:12", url: "https://www.ft.com/content/458940e7-0754-42e3-aa33-f1f9e3e710b7" },
  { id: "5729b32c-8b7a-42b1-b1e2-b8b0106739cb", title: "Meta’s settlement is a starting point", date: "2026-08-30", time: "13:00", url: "https://www.ft.com/content/5729b32c-8b7a-42b1-b1e2-b8b0106739cb" },
  { id: "ce3139ac-e88e-4c0d-ab92-b36e79052836", title: "Friends with fiscal benefits", date: "2026-08-30", time: "12:00", url: "https://www.ft.com/content/ce3139ac-e88e-4c0d-ab92-b36e79052836" },
  { id: "c2682d2b-c5a4-4f98-8f04-cf93883fb9b6", title: "Will the Fed’s hawkish stance survive contact with jobs data?", date: "2026-08-30", time: "12:00", url: "https://www.ft.com/content/c2682d2b-c5a4-4f98-8f04-cf93883fb9b6" },
  { id: "3dd189e1-1af6-45a5-8993-0973af74f8e4", title: "Andy Burnham tightens prisoner release scheme and insists he is ‘tough on crime’", date: "2026-08-30", time: "11:01", url: "https://www.ft.com/content/3dd189e1-1af6-45a5-8993-0973af74f8e4" },
  { id: "25f48fea-ada2-41e1-ba33-07a864a8674a", title: "‘New York loves Canada’: US cities want their Canadian tourists back", date: "2026-08-30", time: "11:00", url: "https://www.ft.com/content/25f48fea-ada2-41e1-ba33-07a864a8674a" },
  { id: "2c65a745-8169-4192-971a-022bdfc0e7ad", title: "Pharma stocks soar as investors seek AI alternatives", date: "2026-08-30", time: "11:00", url: "https://www.ft.com/content/2c65a745-8169-4192-971a-022bdfc0e7ad" },
  { id: "53b5abd8-2919-4dc6-8dd6-81fc054e8b6f", title: "Iceland rejects reopening talks on EU entry", date: "2026-08-30", time: "09:02", url: "https://www.ft.com/content/53b5abd8-2919-4dc6-8dd6-81fc054e8b6f" },
  { id: "5579f0e8-c19c-46ad-8272-f7678bf3a6b9", title: "CEO of India’s largest private bank to step down", date: "2026-08-30", time: "07:10", url: "https://www.ft.com/content/5579f0e8-c19c-46ad-8272-f7678bf3a6b9" },
  { id: "63311687-676b-4548-9bd8-3d7ad96d7ce5", title: "What’s the fiscal hit from higher yields?", date: "2026-08-30", time: "05:12", url: "https://www.ft.com/content/63311687-676b-4548-9bd8-3d7ad96d7ce5" },
  { id: "17c61dd3-fa39-4061-b3a1-2d2333d1eb7f", title: "Incoming Swiss banking chief warns against regulatory over-reach", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/17c61dd3-fa39-4061-b3a1-2d2333d1eb7f" },
  { id: "bcb35264-a96c-49c0-984f-4b379d088581", title: "Anglo Teck up against Glencore’s ‘hardball’ negotiators to deliver merger gains", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/bcb35264-a96c-49c0-984f-4b379d088581" },
  { id: "407f90ed-fe14-4ed5-bfa8-50696b126c46", title: "Nicotine pouch sales jump in UK as companies step up marketing", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/407f90ed-fe14-4ed5-bfa8-50696b126c46" },
  { id: "43718673-5c3f-46cc-a459-b0334e80aeb2", title: "Andy Burnham’s summer of quietly backing away from radical pledges", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/43718673-5c3f-46cc-a459-b0334e80aeb2" },
  { id: "e29502c0-50a9-4f77-ac87-4ba46d1ba98c", title: "One fix for UK plc’s underperformance: equity for all", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/e29502c0-50a9-4f77-ac87-4ba46d1ba98c" },
  { id: "ba323075-bf96-4acf-af32-1e5967be0590", title: "Summer might be ending, but we can hold on to some of its magic", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/ba323075-bf96-4acf-af32-1e5967be0590" },
  { id: "bbe90db5-64ac-441d-87e4-e984c5ef8629", title: "Rising bond yields add tens of billions to G7 countries’ debt costs", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/bbe90db5-64ac-441d-87e4-e984c5ef8629" },
  { id: "60be9ebd-f1be-4f36-b907-c1a99718e2b7", title: "‘SmashCos’: Europe’s oil majors create new generation of independent companies", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/60be9ebd-f1be-4f36-b907-c1a99718e2b7" },
  { id: "38abcff2-241c-4bc1-83a1-8cc135dcaa90", title: "The companies desperate to hire graduates", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/38abcff2-241c-4bc1-83a1-8cc135dcaa90" },
  { id: "a1bfac83-5310-4fdb-bbc7-1efb983a83a0", title: "Claridge’s operator bets on US and UK visitors to offset Middle East", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/a1bfac83-5310-4fdb-bbc7-1efb983a83a0" },
  { id: "c4c13303-bc80-41de-81fc-65e9a70791c9", title: "EU to help tourism hotspots crack down on Airbnb-style holiday rentals", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/c4c13303-bc80-41de-81fc-65e9a70791c9" },
  { id: "0a5e4343-2a91-4e76-affd-b6b369249658", title: "The Dutch city where Europe’s electricity grid crunch hits home", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/0a5e4343-2a91-4e76-affd-b6b369249658" },
  { id: "952920f9-429d-451a-9913-a360880ead41", title: "Grindr bets wealthy gay men will pay more to find the right match", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/952920f9-429d-451a-9913-a360880ead41" },
  { id: "16a76475-cb9d-4fa5-acb2-cf353d85b7ca", title: "The Gazan amputees turning to football", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/16a76475-cb9d-4fa5-acb2-cf353d85b7ca" },
  { id: "7dbc5c59-c13b-4f2d-afd6-14e3033c7732", title: "Norway vs the world’s favourite chicken", date: "2026-08-30", time: "05:00", url: "https://www.ft.com/content/7dbc5c59-c13b-4f2d-afd6-14e3033c7732" },
  { id: "b3c98ca2-fe67-459d-89ff-4728993110b7", title: "US oil deal denounced by both sides of Venezuelan politics", date: "2026-08-29", time: "23:38", url: "https://www.ft.com/content/b3c98ca2-fe67-459d-89ff-4728993110b7" },
  { id: "8eaa49a6-6722-46fc-be4c-cce25ed449ca", title: "James Cleverly steps down from shadow cabinet to run for London mayor", date: "2026-08-29", time: "18:22", url: "https://www.ft.com/content/8eaa49a6-6722-46fc-be4c-cce25ed449ca" },
  { id: "4319c6b7-5a25-41a7-836f-ca068ac4fe60", title: "Warsh charts a forward-looking path for the Fed at Jackson Hole", date: "2026-08-29", time: "17:28", url: "https://www.ft.com/content/4319c6b7-5a25-41a7-836f-ca068ac4fe60" },
  { id: "2f88581f-4fbc-46a2-8127-830bb630c2f2", title: "Trump says US to take control of 65bn barrels of Venezuelan oil", date: "2026-08-29", time: "15:20", url: "https://www.ft.com/content/2f88581f-4fbc-46a2-8127-830bb630c2f2" },
  { id: "69452aea-cee0-47de-be8a-dc790fed3db1", title: "Warsh puts Fed on collision course with Trump ahead of midterms", date: "2026-08-29", time: "13:57", url: "https://www.ft.com/content/69452aea-cee0-47de-be8a-dc790fed3db1" },
  { id: "4822389d-5bb2-4e31-a627-bcda849630c8", title: "Swiss wealth managers urge delay to ownership register after Liechtenstein hack", date: "2026-08-29", time: "12:00", url: "https://www.ft.com/content/4822389d-5bb2-4e31-a627-bcda849630c8" },
  { id: "c1c79d47-31c0-4e4e-85b6-57527e31d78f", title: "Alex Gerko earned a record £895mn from trading firm XTX in 2025", date: "2026-08-29", time: "11:12", url: "https://www.ft.com/content/c1c79d47-31c0-4e4e-85b6-57527e31d78f" },
  { id: "0d24c0e8-eb65-4009-a236-f2dbf1eaa416", title: "Trump deportations take a bite out of an unexpected industry: US fast food", date: "2026-08-29", time: "10:00", url: "https://www.ft.com/content/0d24c0e8-eb65-4009-a236-f2dbf1eaa416" },
  { id: "40eaeba7-9514-4e6b-9bd3-4a9381618c84", title: "Dozens killed in Russian strike on ammunition depot near Kyiv", date: "2026-08-29", time: "09:54", url: "https://www.ft.com/content/40eaeba7-9514-4e6b-9bd3-4a9381618c84" },
  { id: "59955452-1de0-40f0-a8d1-62139d502484", title: "Chart of the Week: Is the 60-40 portfolio dead?", date: "2026-08-29", time: "09:30", url: "https://www.ft.com/content/59955452-1de0-40f0-a8d1-62139d502484" },
  { id: "4f9bd1ed-f783-45c9-8542-addd8b57ee9f", title: "What the Indiana state fair reveals about Trump's America", date: "2026-08-29", time: "08:37", url: "https://www.ft.com/content/4f9bd1ed-f783-45c9-8542-addd8b57ee9f" },
  { id: "33fa2e4a-2c35-42e2-9e32-494f9505f0ff", title: "American Scoundrel — Roy Cohn’s long shadow over the White House", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/33fa2e4a-2c35-42e2-9e32-494f9505f0ff" },
  { id: "359d4ea5-59b6-425f-ac66-c9836cec04f9", title: "Glencore threatened with $1.4bn lawsuit from embattled trader Radiant", date: "2026-08-29", time: "05:00", url: "https://www.ft.com/content/359d4ea5-59b6-425f-ac66-c9836cec04f9" },
];
