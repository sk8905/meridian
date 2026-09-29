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
  {
    id: "7b9df85a-59ed-4863-9682-1c5b868fd3af",
    title: "A Republican midterm defeat will not be an earthquake",
    date: "2026-09-29",
    time: "12:16",
    url: "https://www.ft.com/content/7b9df85a-59ed-4863-9682-1c5b868fd3af"
  },
  {
    id: "3850893c-9db6-40c5-8e19-e89ec4160663",
    title: "Shabana Mahmood looks to soften migration policies amid Labour pressure",
    date: "2026-09-29",
    time: "12:12",
    url: "https://www.ft.com/content/3850893c-9db6-40c5-8e19-e89ec4160663"
  },
  {
    id: "7ffd0cd4-716f-40f3-976a-62a2e737bb3d",
    title: "Smart ring start-up Oura delays IPO",
    date: "2026-09-29",
    time: "12:09",
    url: "https://www.ft.com/content/7ffd0cd4-716f-40f3-976a-62a2e737bb3d"
  },
  {
    id: "b0e3a26e-5beb-45af-a7a8-bf134a6086a5",
    title: "K-craft’s slow seduction goes against type",
    date: "2026-09-29",
    time: "12:00",
    url: "https://www.ft.com/content/b0e3a26e-5beb-45af-a7a8-bf134a6086a5"
  },
  {
    id: "0cd95b53-4b99-42c9-9b3e-b1074ed88e12",
    title: "Why a UK-backed tungsten mine is supplying the US defence stockpile",
    date: "2026-09-29",
    time: "12:00",
    url: "https://www.ft.com/content/0cd95b53-4b99-42c9-9b3e-b1074ed88e12"
  },
  {
    id: "df11786e-4b07-45d6-b8ef-8e74f0d189ad",
    title: "Who is driving the massive surge in repo borrowing?",
    date: "2026-09-29",
    time: "12:00",
    url: "https://www.ft.com/content/df11786e-4b07-45d6-b8ef-8e74f0d189ad"
  },
  {
    id: "f16439a7-5554-412a-ae34-b46459ce28a9",
    title: "US-Iran war adds €100bn to EU’s fuel bill",
    date: "2026-09-29",
    time: "11:55",
    url: "https://www.ft.com/content/f16439a7-5554-412a-ae34-b46459ce28a9"
  },
  {
    id: "1ae07fc9-dfce-4cb3-a216-a8e8bfeb74b9",
    title: "Le Monde Béryl is pumping up New York",
    date: "2026-09-29",
    time: "11:00",
    url: "https://www.ft.com/content/1ae07fc9-dfce-4cb3-a216-a8e8bfeb74b9"
  },
  {
    id: "57b7bde7-099d-4cba-9275-01a3bc088d95",
    title: "‘Translation and connection are different things’: why languages remain useful at work",
    date: "2026-09-29",
    time: "11:00",
    url: "https://www.ft.com/content/57b7bde7-099d-4cba-9275-01a3bc088d95"
  },
  {
    id: "c269b475-b37a-4fe8-b138-849d8525ff59",
    title: "Russia behind arson attack on defence company, says Estonia",
    date: "2026-09-29",
    time: "10:12",
    url: "https://www.ft.com/content/c269b475-b37a-4fe8-b138-849d8525ff59"
  },
  {
    id: "55c804cd-80a7-4195-92a2-e743d08e84bc",
    title: "John Healey failed to truthfully articulate causes of Britain’s problems",
    date: "2026-09-29",
    time: "10:01",
    url: "https://www.ft.com/content/55c804cd-80a7-4195-92a2-e743d08e84bc"
  },
  {
    id: "dfcb291a-d8e7-441d-9d1f-28106a9749e6",
    title: "Julius Baer shares hit record high after Swiss regulator ends probe",
    date: "2026-09-29",
    time: "09:52",
    url: "https://www.ft.com/content/dfcb291a-d8e7-441d-9d1f-28106a9749e6"
  },
  {
    id: "64816c78-a707-42e4-bb3f-2f199e29eac3",
    title: "Labour conference: Burnham warned ditching triple lock would be ‘electoral insanity’ ahead of speech",
    date: "2026-09-29",
    time: "09:37",
    url: "https://www.ft.com/content/64816c78-a707-42e4-bb3f-2f199e29eac3"
  },
  {
    id: "364d5454-876d-42ef-8f30-759e1ebdb026",
    title: "Shell-led consortium backs $23bn expansion of LNG Canada project",
    date: "2026-09-29",
    time: "09:34",
    url: "https://www.ft.com/content/364d5454-876d-42ef-8f30-759e1ebdb026"
  },
  {
    id: "5c1dc583-5c88-4e91-a6b8-b62a6b33f74c",
    title: "Australia raises interest rate to highest level in 15 years",
    date: "2026-09-29",
    time: "06:54",
    url: "https://www.ft.com/content/5c1dc583-5c88-4e91-a6b8-b62a6b33f74c"
  },
  {
    id: "3976a165-960a-4f04-98e4-6c39386ef785",
    title: "Rethinking the dollar",
    date: "2026-09-29",
    time: "06:30",
    url: "https://www.ft.com/content/3976a165-960a-4f04-98e4-6c39386ef785"
  },
  {
    id: "6dc0716f-9a9c-4c3e-903a-2b497eb5190c",
    title: "FTAV’s further reading",
    date: "2026-09-29",
    time: "06:30",
    url: "https://www.ft.com/content/6dc0716f-9a9c-4c3e-903a-2b497eb5190c"
  },
  {
    id: "27fb5d30-1fb6-4f30-937c-ff5c598eaaa5",
    title: "Brussels’ protectionist turn spooks bloc’s free-market stalwarts",
    date: "2026-09-29",
    time: "06:00",
    url: "https://www.ft.com/content/27fb5d30-1fb6-4f30-937c-ff5c598eaaa5"
  },
  {
    id: "796167ab-ba0b-4476-b505-516b7d896e40",
    title: "Rolex was for crypto, Ferrari is for AI",
    date: "2026-09-29",
    time: "06:00",
    url: "https://www.ft.com/content/796167ab-ba0b-4476-b505-516b7d896e40"
  },
  {
    id: "d6a9f5df-08d0-4f80-ad2d-5d8a17e2cc82",
    title: "Nvidia turns to insurers to spread the risk of AI build-out",
    date: "2026-09-29",
    time: "05:04",
    url: "https://www.ft.com/content/d6a9f5df-08d0-4f80-ad2d-5d8a17e2cc82"
  },
  {
    id: "e4231435-4d6d-438d-9632-ab215784b2d5",
    title: "Big money, bigger problems in Big Law",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/e4231435-4d6d-438d-9632-ab215784b2d5"
  },
  {
    id: "8415255e-3828-4b0b-941b-6415cffbcf28",
    title: "Private equity wrestles with its own generational wealth gap",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/8415255e-3828-4b0b-941b-6415cffbcf28"
  },
  {
    id: "f8a5e2b8-33f7-4c83-8ef3-ca91c7fa1df7",
    title: "Why a £10bn Monzo takeover could be good for the UK",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/f8a5e2b8-33f7-4c83-8ef3-ca91c7fa1df7"
  },
  {
    id: "1f92357c-374d-4f24-a6f4-373fdeb3ffe3",
    title: "What ‘Choosin’ Texas’ tells us about Burnham’s social care obstacles",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/1f92357c-374d-4f24-a6f4-373fdeb3ffe3"
  },
  {
    id: "3b829a46-3eae-4c20-94db-a79c38d0be4c",
    title: "Germany issues EU budget ultimatum",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/3b829a46-3eae-4c20-94db-a79c38d0be4c"
  },
  {
    id: "2b6db828-897d-46cf-ba64-e3e8560b5f4e",
    title: "Unicredit’s Andrea Orcel moves to seize control of Commerzbank within months",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/2b6db828-897d-46cf-ba64-e3e8560b5f4e"
  },
  {
    id: "4370a241-50e7-4305-b533-44adad41498a",
    title: "Trade union chief criticises Burnham’s delay to social care reforms",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/4370a241-50e7-4305-b533-44adad41498a"
  },
  {
    id: "7af7b31e-5006-467a-96d9-672905f7b45b",
    title: "Donald Trump’s ambassador to Greece causes stir in Romania",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/7af7b31e-5006-467a-96d9-672905f7b45b"
  },
  {
    id: "f537987f-e88e-4f60-93bf-74e838235b2d",
    title: "Starbucks retreats from green goals amid $2bn cost drive",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/f537987f-e88e-4f60-93bf-74e838235b2d"
  },
  {
    id: "6586deaa-d2e3-4e5f-83ef-c64eb57b7832",
    title: "Harry Potter and the British business of international schools",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/6586deaa-d2e3-4e5f-83ef-c64eb57b7832"
  },
  {
    id: "5ad7c42c-b95d-47b8-8dfd-896c1deda1df",
    title: "The booming business of insuring against US gun violence",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/5ad7c42c-b95d-47b8-8dfd-896c1deda1df"
  },
  {
    id: "930465de-0cf3-4a2b-99a4-f632852df5f9",
    title: "UK tech founders urge Burnham to curb non-competes to match US rivals",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/930465de-0cf3-4a2b-99a4-f632852df5f9"
  },
  {
    id: "f894f69a-9e2b-4c3f-bf5d-c5c4dc0e6197",
    title: "Oil price and US Treasury yields in tightest relationship since 1990",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/f894f69a-9e2b-4c3f-bf5d-c5c4dc0e6197"
  },
  {
    id: "40892ee2-70ed-4a15-b290-5ffc2d7d2a40",
    title: "Can Italy’s opposition unite against Giorgia Meloni?",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/40892ee2-70ed-4a15-b290-5ffc2d7d2a40"
  },
  {
    id: "729662bd-0f6e-42a7-a54a-55c306c1f37e",
    title: "Falkland Islanders grapple with Argentina’s ‘economic warfare’",
    date: "2026-09-29",
    time: "05:00",
    url: "https://www.ft.com/content/729662bd-0f6e-42a7-a54a-55c306c1f37e"
  },
  {
    id: "7c6d87b1-d7d9-49c3-b842-2600928fba38",
    title: "US Treasury threatens crackdown on Wall Street tax-avoidance strategies",
    date: "2026-09-28",
    time: "23:00",
    url: "https://www.ft.com/content/7c6d87b1-d7d9-49c3-b842-2600928fba38"
  },
  {
    id: "51c0928d-019b-4a1f-9c3a-1c9a2174f760",
    title: "Burnham vows to break with ‘politics as usual’ by tackling UK’s biggest issues",
    date: "2026-09-28",
    time: "22:30",
    url: "https://www.ft.com/content/51c0928d-019b-4a1f-9c3a-1c9a2174f760"
  },
  {
    id: "0e851fbb-f148-46e4-906f-390b38b62a15",
    title: "FirstFT: Seoul accuses Ukraine of violating secrecy agreement on North Korean soldiers",
    date: "2026-09-28",
    time: "22:26",
    url: "https://www.ft.com/content/0e851fbb-f148-46e4-906f-390b38b62a15"
  },
  {
    id: "ffa65213-3178-454c-9d7d-c8ae8d64124f",
    title: "HSBC moves to bolster Hang Seng by cleaning up balance sheet",
    date: "2026-09-28",
    time: "22:00",
    url: "https://www.ft.com/content/ffa65213-3178-454c-9d7d-c8ae8d64124f"
  },
  {
    id: "c72a016b-ad45-4cde-8020-dc1da7ab0839",
    title: "Erdoğan bids to contain fallout from Turkey’s $18bn stock market scandal",
    date: "2026-09-28",
    time: "21:57",
    url: "https://www.ft.com/content/c72a016b-ad45-4cde-8020-dc1da7ab0839"
  }
];
