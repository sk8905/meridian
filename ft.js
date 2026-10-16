// =============================================================================
// myFT — headlines from the reader's personalised Financial Times feed
// (followed topics), surfaced in the Home news feed under an "FT" label.
//
// Source: the reader's myFT RSS feed —
//   https://www.ft.com/myft/following/601965b2-62d0-47e1-88cf-576ebc8a8a2e.rss
// It is fetched by the scheduled refresh routine (see docs/refresh-routines.md,
// the "Email sweep → myFT" section), parsed, and written here.
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
  {
    id: "6a1ecb1a-a998-4cbb-be54-22df550a66ee",
    title: "Wall Street’s AI wobbles",
    date: "2026-10-16",
    time: "05:00",
    url: "https://www.ft.com/content/6a1ecb1a-a998-4cbb-be54-22df550a66ee"
  },
  {
    id: "c6e911dd-440b-4852-925c-448faeb52d98",
    title: "Young people to get less cash but more job support under Milburn welfare plan",
    date: "2026-10-16",
    time: "05:00",
    url: "https://www.ft.com/content/c6e911dd-440b-4852-925c-448faeb52d98"
  },
  {
    id: "0ce2a031-5c81-4b48-a4b1-d19585fd3a66",
    title: "Why law firms should resist the lure of the AI spin-off",
    date: "2026-10-16",
    time: "05:00",
    url: "https://www.ft.com/content/0ce2a031-5c81-4b48-a4b1-d19585fd3a66"
  },
  {
    id: "5a310aee-f555-4266-874c-b1b4db20186d",
    title: "Anthropic secured highest junk credit rating in June",
    date: "2026-10-16",
    time: "05:00",
    url: "https://www.ft.com/content/5a310aee-f555-4266-874c-b1b4db20186d"
  },
  {
    id: "1bd1cdc2-9dc1-4538-8820-129e9bd9117b",
    title: "UK government courted UBS over London HQ move",
    date: "2026-10-16",
    time: "05:00",
    url: "https://www.ft.com/content/1bd1cdc2-9dc1-4538-8820-129e9bd9117b"
  },
  {
    id: "9585ba4d-5036-4f5d-9656-0dc4f6bdee4e",
    title: "The secret fight around financial flows",
    date: "2026-10-16",
    time: "05:00",
    url: "https://www.ft.com/content/9585ba4d-5036-4f5d-9656-0dc4f6bdee4e"
  },
  {
    id: "586218d3-6943-4690-8dd8-63dd329c781d",
    title: "US business leaders are waking up to the perils of plutopopulism",
    date: "2026-10-16",
    time: "05:00",
    url: "https://www.ft.com/content/586218d3-6943-4690-8dd8-63dd329c781d"
  },
  {
    id: "7a260d99-c761-4ab1-8185-d7e0225a8472",
    title: "What do the Houthis want?",
    date: "2026-10-16",
    time: "05:00",
    url: "https://www.ft.com/content/7a260d99-c761-4ab1-8185-d7e0225a8472"
  },
  {
    id: "2839679e-f329-41f0-a252-93444e81252c",
    title: "Airlines should give up their fuel-hedging dogfight",
    date: "2026-10-16",
    time: "05:00",
    url: "https://www.ft.com/content/2839679e-f329-41f0-a252-93444e81252c"
  },
  {
    id: "4dfcf1ba-0b8e-4198-b0a4-e975ebde9066",
    title: "Why is the fintech boom failing to improve fin-lit?",
    date: "2026-10-16",
    time: "05:00",
    url: "https://www.ft.com/content/4dfcf1ba-0b8e-4198-b0a4-e975ebde9066"
  },
  {
    id: "b6255adb-3ce5-4463-92cd-de2f8e9a1f74",
    title: "‘Early days’ to see full effect of energy prices on inflation, BoE’s Bailey says",
    date: "2026-10-16",
    time: "04:12",
    url: "https://www.ft.com/content/b6255adb-3ce5-4463-92cd-de2f8e9a1f74"
  },
  {
    id: "50c694da-c485-4176-853b-daf643eabb5c",
    title: "Harvard’s endowment returns surge on back of AI and SpaceX investments",
    date: "2026-10-15",
    time: "21:06",
    url: "https://www.ft.com/content/50c694da-c485-4176-853b-daf643eabb5c"
  },
  {
    id: "3568dbda-ac85-45b3-815a-3a8ec853a78d",
    title: "Meta and Apple team up on AI model tailored for Mac computers",
    date: "2026-10-15",
    time: "21:00",
    url: "https://www.ft.com/content/3568dbda-ac85-45b3-815a-3a8ec853a78d"
  },
  {
    id: "9f269231-7c1a-4cb0-a4d3-0603f6cd73b6",
    title: "Fifa president Gianni Infantino apologises for failed investment plan",
    date: "2026-10-15",
    time: "20:23",
    url: "https://www.ft.com/content/9f269231-7c1a-4cb0-a4d3-0603f6cd73b6"
  },
  {
    id: "a3a389d2-7796-4f40-98d3-8986f26f6513",
    title: "Anthropic grants non-profit METR ‘employee-like’ access to monitor AI risks",
    date: "2026-10-15",
    time: "20:12",
    url: "https://www.ft.com/content/a3a389d2-7796-4f40-98d3-8986f26f6513"
  },
  {
    id: "09e07278-8479-49bb-a145-51e5d93828a2",
    title: "Healey signals bank tax raid in UK Budget",
    date: "2026-10-15",
    time: "18:53",
    url: "https://www.ft.com/content/09e07278-8479-49bb-a145-51e5d93828a2"
  },
  {
    id: "66c9bbf1-f25c-4e84-b8ae-c9272fbc49c2",
    title: "Bankers and advisers set for £334mn easyJet payout",
    date: "2026-10-15",
    time: "18:41",
    url: "https://www.ft.com/content/66c9bbf1-f25c-4e84-b8ae-c9272fbc49c2"
  },
  {
    id: "70f69253-6017-4259-95c9-48bf0e088b40",
    title: "Criminals stole $90mn of crypto by hiding password readers in USB-like devices",
    date: "2026-10-15",
    time: "18:23",
    url: "https://www.ft.com/content/70f69253-6017-4259-95c9-48bf0e088b40"
  },
  {
    id: "5dd8b17e-b0a3-4b14-9d83-aba2627e635d",
    title: "Risk of an AI crunch for stock markets is rising",
    date: "2026-10-15",
    time: "17:53",
    url: "https://www.ft.com/content/5dd8b17e-b0a3-4b14-9d83-aba2627e635d"
  },
  {
    id: "8890bf3f-f243-4bd0-8e2f-f80c78e363f8",
    title: "Europe cannot rely on trade barriers to counter China",
    date: "2026-10-15",
    time: "17:35",
    url: "https://www.ft.com/content/8890bf3f-f243-4bd0-8e2f-f80c78e363f8"
  },
  {
    id: "064f7a19-c495-4ba0-a5e5-a6c4bb764ddb",
    title: "Donald Trump cancels Pete Hegseth’s plan to livestream execution after backlash",
    date: "2026-10-15",
    time: "17:07",
    url: "https://www.ft.com/content/064f7a19-c495-4ba0-a5e5-a6c4bb764ddb"
  },
  {
    id: "086b7a80-acdd-48d2-bd5c-a04bad812264",
    title: "In AI-dominated markets, LatAm debt is a diversifier",
    date: "2026-10-15",
    time: "16:51",
    url: "https://www.ft.com/content/086b7a80-acdd-48d2-bd5c-a04bad812264"
  },
  {
    id: "37d24217-acd8-4f84-a298-4f1ccc359a27",
    title: "Mercuria adds first copper to US Project Vault stockpile",
    date: "2026-10-15",
    time: "16:43",
    url: "https://www.ft.com/content/37d24217-acd8-4f84-a298-4f1ccc359a27"
  },
  {
    id: "0a436452-c1a1-492a-b5be-92848ed5e6e7",
    title: "Former Everton bidder Josh Wander to plead guilty in US fraud case",
    date: "2026-10-15",
    time: "16:33",
    url: "https://www.ft.com/content/0a436452-c1a1-492a-b5be-92848ed5e6e7"
  },
  {
    id: "678bcd31-6c2a-447b-a68c-ce6dec220bbc",
    title: "Investors dump data centre bonds as AI borrowers face ‘Darwin moment’",
    date: "2026-10-15",
    time: "16:25",
    url: "https://www.ft.com/content/678bcd31-6c2a-447b-a68c-ce6dec220bbc"
  },
  {
    id: "0be97035-3854-4b6c-8191-98f486862b02",
    title: "Saudi events delayed after Houthi attacks",
    date: "2026-10-15",
    time: "16:04",
    url: "https://www.ft.com/content/0be97035-3854-4b6c-8191-98f486862b02"
  },
  {
    id: "cf5f1209-da29-4ce1-b425-0e83818bf9ec",
    title: "Treasuries rally as investors seek shelter from AI turbulence",
    date: "2026-10-15",
    time: "15:56",
    url: "https://www.ft.com/content/cf5f1209-da29-4ce1-b425-0e83818bf9ec"
  },
  {
    id: "33aca8da-f22c-41e5-8255-289ae7d58ee7",
    title: "Monte dei Paschi should try the ‘just say maybe’ bid defence",
    date: "2026-10-15",
    time: "15:23",
    url: "https://www.ft.com/content/33aca8da-f22c-41e5-8255-289ae7d58ee7"
  },
  {
    id: "15d18ed4-543d-4004-ae38-f429a118daab",
    title: "Anglo American chief says tech giants show ‘deep interest’ in mining stakes",
    date: "2026-10-15",
    time: "15:19",
    url: "https://www.ft.com/content/15d18ed4-543d-4004-ae38-f429a118daab"
  },
  {
    id: "cbfd494d-cc11-4162-8618-77cc2caa806b",
    title: "Thames Water’s senior creditors near deal with rivals to avoid court challenge",
    date: "2026-10-15",
    time: "15:16",
    url: "https://www.ft.com/content/cbfd494d-cc11-4162-8618-77cc2caa806b"
  },
  {
    id: "f8e99974-9f18-4141-ac4a-1f072b7ebb24",
    title: "France and Germany to allow UK to join EU car policy if it aligns on China tariffs",
    date: "2026-10-15",
    time: "15:10",
    url: "https://www.ft.com/content/f8e99974-9f18-4141-ac4a-1f072b7ebb24"
  },
  {
    id: "d3a07d72-0f99-40b6-a1ad-97ecc91af81f",
    title: "The future energy mix",
    date: "2026-10-15",
    time: "14:31",
    url: "https://www.ft.com/content/d3a07d72-0f99-40b6-a1ad-97ecc91af81f"
  },
  {
    id: "1ca17b0c-24f3-4c54-94b9-0b0526941efe",
    title: "Private equity interest endangers London float of former DS Smith business",
    date: "2026-10-15",
    time: "14:13",
    url: "https://www.ft.com/content/1ca17b0c-24f3-4c54-94b9-0b0526941efe"
  },
  {
    id: "43c9d38a-652a-45df-b3be-c3dead3390f1",
    title: "Credit Suisse secured $800mn from insurers in Greensill settlement",
    date: "2026-10-15",
    time: "14:00",
    url: "https://www.ft.com/content/43c9d38a-652a-45df-b3be-c3dead3390f1"
  },
  {
    id: "f344bdb0-7bc9-43ab-804e-88990d59091e",
    title: "Rising inflation piles pressure on US voters ahead of midterm elections",
    date: "2026-10-15",
    time: "14:00",
    url: "https://www.ft.com/content/f344bdb0-7bc9-43ab-804e-88990d59091e"
  },
  {
    id: "c8721dd3-6744-4849-960f-6654cef1e80b",
    title: "Labour to end power-sharing with Green councils that back ‘Zionism is Racism’",
    date: "2026-10-15",
    time: "13:43",
    url: "https://www.ft.com/content/c8721dd3-6744-4849-960f-6654cef1e80b"
  },
  {
    id: "246e950b-e1e5-4f12-af78-4a13433f3977",
    title: "John Healey promises to ‘stay the path’ on reducing UK deficit",
    date: "2026-10-15",
    time: "13:42",
    url: "https://www.ft.com/content/246e950b-e1e5-4f12-af78-4a13433f3977"
  },
  {
    id: "f0975e34-5d18-4840-ae09-b998dd35d09e",
    title: "Russia suspected of striking two tankers in Nato waters",
    date: "2026-10-15",
    time: "13:41",
    url: "https://www.ft.com/content/f0975e34-5d18-4840-ae09-b998dd35d09e"
  },
  {
    id: "7604138c-a7c0-485c-b5ac-d86b16590276",
    title: "Calls to scrap employer national insurance for under-25s rejected",
    date: "2026-10-15",
    time: "13:20",
    url: "https://www.ft.com/content/7604138c-a7c0-485c-b5ac-d86b16590276"
  },
  {
    id: "0a39fcdb-860c-4739-8454-21fb429f6336",
    title: "Who’s winning the trade war with China? You asked, we answered",
    date: "2026-10-15",
    time: "13:00",
    url: "https://www.ft.com/content/0a39fcdb-860c-4739-8454-21fb429f6336"
  }
];
