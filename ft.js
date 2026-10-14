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
    id: "c1e4c8b1-8fe0-414d-b52f-c74a6d927b3d",
    title: "US inflation jumps to 3.7% as Iran war drives up prices",
    date: "2026-10-14",
    time: "13:51",
    url: "https://www.ft.com/content/c1e4c8b1-8fe0-414d-b52f-c74a6d927b3d"
  },
  {
    id: "b06d00da-9df7-405b-9410-b5485c267397",
    title: "Global diesel prices set to rise again, warns IEA",
    date: "2026-10-14",
    time: "13:25",
    url: "https://www.ft.com/content/b06d00da-9df7-405b-9410-b5485c267397"
  },
  {
    id: "60a8f4e6-5da4-4f59-b009-baed53215497",
    title: "Lufthansa wins battle to buy stake in Portugal’s TAP airline",
    date: "2026-10-14",
    time: "13:23",
    url: "https://www.ft.com/content/60a8f4e6-5da4-4f59-b009-baed53215497"
  },
  {
    id: "a82b4275-6519-4142-b1df-e74c66ead877",
    title: "Bank of America profits drop 17% after $1.2bn money laundering fine",
    date: "2026-10-14",
    time: "13:19",
    url: "https://www.ft.com/content/a82b4275-6519-4142-b1df-e74c66ead877"
  },
  {
    id: "18b65495-9e2a-45d6-be85-7641442ab61a",
    title: "Apple and OpenAI head to court in trade secrets battle",
    date: "2026-10-14",
    time: "13:15",
    url: "https://www.ft.com/content/18b65495-9e2a-45d6-be85-7641442ab61a"
  },
  {
    id: "7addd5d0-11d6-4706-bf0b-995084ef7bb6",
    title: "It’s been a bad year for turning lawsuits into earnings",
    date: "2026-10-14",
    time: "13:00",
    url: "https://www.ft.com/content/7addd5d0-11d6-4706-bf0b-995084ef7bb6"
  },
  {
    id: "c5fb2ea9-9a41-416a-90b8-337936ec4971",
    title: "Europe’s defence stocks send a geopolitical distress signal",
    date: "2026-10-14",
    time: "12:59",
    url: "https://www.ft.com/content/c5fb2ea9-9a41-416a-90b8-337936ec4971"
  },
  {
    id: "d9aaf82c-1975-4f07-99b1-f3b858b4dc7c",
    title: "UK Greens split widens after deputy leader says Zionism vote must be ‘respected’",
    date: "2026-10-14",
    time: "12:53",
    url: "https://www.ft.com/content/d9aaf82c-1975-4f07-99b1-f3b858b4dc7c"
  },
  {
    id: "63e3c39b-357f-4a87-adf0-090c60c929a7",
    title: "BlackRock pulls in $205bn to take assets to record high",
    date: "2026-10-14",
    time: "12:39",
    url: "https://www.ft.com/content/63e3c39b-357f-4a87-adf0-090c60c929a7"
  },
  {
    id: "73cfaf41-d3ea-4202-bd9b-f355c9e5b504",
    title: "Marine Le Pen: ‘All the warning signs are flashing red’",
    date: "2026-10-14",
    time: "12:02",
    url: "https://www.ft.com/content/73cfaf41-d3ea-4202-bd9b-f355c9e5b504"
  },
  {
    id: "178041cc-c9e7-4bd9-8c6e-7967931dcb33",
    title: "Giorgia Meloni criticises Trump’s diesel deal with Putin",
    date: "2026-10-14",
    time: "12:00",
    url: "https://www.ft.com/content/178041cc-c9e7-4bd9-8c6e-7967931dcb33"
  },
  {
    id: "f8f302b1-3859-45dd-9e45-b5e9149c6f51",
    title: "Who should we leave our pensions to?",
    date: "2026-10-14",
    time: "11:37",
    url: "https://www.ft.com/content/f8f302b1-3859-45dd-9e45-b5e9149c6f51"
  },
  {
    id: "eb0be26c-8ff7-49b8-b232-fc283aaebf22",
    title: "Is this the greatest Versace collection in the world?",
    date: "2026-10-14",
    time: "11:00",
    url: "https://www.ft.com/content/eb0be26c-8ff7-49b8-b232-fc283aaebf22"
  },
  {
    id: "1cc06862-6767-4f22-a7c2-56945ff693de",
    title: "Good Times – Potato Head’s design store in Bali",
    date: "2026-10-14",
    time: "11:00",
    url: "https://www.ft.com/content/1cc06862-6767-4f22-a7c2-56945ff693de"
  },
  {
    id: "0f7511ee-efb1-4bf0-8f87-67f572193fd3",
    title: "General Atlantic plans early 2027 IPO at up to $10bn valuation",
    date: "2026-10-14",
    time: "11:00",
    url: "https://www.ft.com/content/0f7511ee-efb1-4bf0-8f87-67f572193fd3"
  },
  {
    id: "4ffa1853-0e2c-424f-b941-88c6bcac5765",
    title: "CoreWeave targets ‘unlimited’ insurance money to fund AI build-out",
    date: "2026-10-14",
    time: "10:58",
    url: "https://www.ft.com/content/4ffa1853-0e2c-424f-b941-88c6bcac5765"
  },
  {
    id: "37085602-726a-44dc-a859-51caab38eb75",
    title: "Ukraine blindsided by Starlink restrictions and intelligence gaps",
    date: "2026-10-14",
    time: "10:47",
    url: "https://www.ft.com/content/37085602-726a-44dc-a859-51caab38eb75"
  },
  {
    id: "0c178261-2c29-4677-9649-5b9257662d7e",
    title: "Turkish authorities take over country’s most-watched news channel",
    date: "2026-10-14",
    time: "10:47",
    url: "https://www.ft.com/content/0c178261-2c29-4677-9649-5b9257662d7e"
  },
  {
    id: "8e82ae33-cc11-4731-826a-bcd0752f79bf",
    title: "Crypto exchange Kraken owner to buy European bank",
    date: "2026-10-14",
    time: "10:30",
    url: "https://www.ft.com/content/8e82ae33-cc11-4731-826a-bcd0752f79bf"
  },
  {
    id: "a25417b3-d4e4-4b89-b14d-6370a85ce3c4",
    title: "Houthis strike Saudi Aramco headquarters",
    date: "2026-10-14",
    time: "10:03",
    url: "https://www.ft.com/content/a25417b3-d4e4-4b89-b14d-6370a85ce3c4"
  },
  {
    id: "c69ef2f5-0644-4ec3-accb-cbc8d633e008",
    title: "European oil refineries’ margins collapse as input costs soar",
    date: "2026-10-14",
    time: "09:32",
    url: "https://www.ft.com/content/c69ef2f5-0644-4ec3-accb-cbc8d633e008"
  },
  {
    id: "04ceedc2-8ec0-481f-8982-6bb331f11e41",
    title: "Government finally signals action on AI",
    date: "2026-10-14",
    time: "09:30",
    url: "https://www.ft.com/content/04ceedc2-8ec0-481f-8982-6bb331f11e41"
  },
  {
    id: "fa1aae13-a352-47cb-97aa-6667c070f308",
    title: "FTAV’s further reading",
    date: "2026-10-14",
    time: "06:30",
    url: "https://www.ft.com/content/fa1aae13-a352-47cb-97aa-6667c070f308"
  },
  {
    id: "694aa230-fbad-40f2-b2dc-e663f24583d1",
    title: "The rollout of 24-hour* trading",
    date: "2026-10-14",
    time: "06:30",
    url: "https://www.ft.com/content/694aa230-fbad-40f2-b2dc-e663f24583d1"
  },
  {
    id: "45e8941a-9f4d-4186-baec-eef5be5ce495",
    title: "Le Pen casts doubt on future EU funding for Ukraine",
    date: "2026-10-14",
    time: "06:00",
    url: "https://www.ft.com/content/45e8941a-9f4d-4186-baec-eef5be5ce495"
  },
  {
    id: "76cd58f0-3a5c-4715-8879-d83c90ab6f2c",
    title: "Maybe R-star never even existed?",
    date: "2026-10-14",
    time: "06:00",
    url: "https://www.ft.com/content/76cd58f0-3a5c-4715-8879-d83c90ab6f2c"
  },
  {
    id: "3cad49d9-4c88-46bc-bddd-7b237a399a7b",
    title: "Gold Fields mounts charm offensive to woo Northern Star investors",
    date: "2026-10-14",
    time: "05:44",
    url: "https://www.ft.com/content/3cad49d9-4c88-46bc-bddd-7b237a399a7b"
  },
  {
    id: "25c6e29b-f6e6-40a4-b9df-cd0883e9234f",
    title: "FirstFT: Marine Le Pen gears up for EU fight",
    date: "2026-10-14",
    time: "05:30",
    url: "https://www.ft.com/content/25c6e29b-f6e6-40a4-b9df-cd0883e9234f"
  },
  {
    id: "b77a0094-c6f1-449a-9323-2b4d16696cb7",
    title: "Russia arrests Japanese journalist on espionage charges",
    date: "2026-10-14",
    time: "05:24",
    url: "https://www.ft.com/content/b77a0094-c6f1-449a-9323-2b4d16696cb7"
  },
  {
    id: "6a8811f5-18bb-4ee1-97e1-2e931db6972d",
    title: "Move over New York and LA: red states are the new home for art",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/6a8811f5-18bb-4ee1-97e1-2e931db6972d"
  },
  {
    id: "42209791-2167-4c4e-81a0-f610a981b745",
    title: "UK’s Schillings sets up private investigations business with US law firm Clare Locke",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/42209791-2167-4c4e-81a0-f610a981b745"
  },
  {
    id: "60d09841-052a-44f3-a8ae-52c38fdbb5ab",
    title: "France’s Marine Le Pen gears up for fight with EU",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/60d09841-052a-44f3-a8ae-52c38fdbb5ab"
  },
  {
    id: "16d4fa95-0532-4461-a7a2-588624202362",
    title: "Top London private school reverses plan to scrap GCSEs",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/16d4fa95-0532-4461-a7a2-588624202362"
  },
  {
    id: "8c3c631c-e37f-4209-aefd-112c4c58020c",
    title: "Germany puts Ukrainian ex-officer in the dock over Nord Stream sabotage",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/8c3c631c-e37f-4209-aefd-112c4c58020c"
  },
  {
    id: "dc21da0b-25b7-402e-8dbe-e7d9f7431b93",
    title: "How Ukraine’s data centre strikes threw Russia into turmoil",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/dc21da0b-25b7-402e-8dbe-e7d9f7431b93"
  },
  {
    id: "5e6d1d30-0934-4fda-b2c0-27b0d96aeba3",
    title: "The global economy and the art of living dangerously",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/5e6d1d30-0934-4fda-b2c0-27b0d96aeba3"
  },
  {
    id: "24818a5c-64d0-4d6c-a9c0-825156edf43b",
    title: "Celebrity lawyer accused of participating in ‘outright plunder’ of BHS",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/24818a5c-64d0-4d6c-a9c0-825156edf43b"
  },
  {
    id: "08b9bbe6-0637-497e-af6d-464dd41e6121",
    title: "Healey set to pay for Budget giveaways without more borrowing",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/08b9bbe6-0637-497e-af6d-464dd41e6121"
  },
  {
    id: "afa0a322-ad2a-4d49-aa0e-81f15a01c3a7",
    title: "Military briefing: Houthis expose limits of Saudi Arabia’s vast arsenal",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/afa0a322-ad2a-4d49-aa0e-81f15a01c3a7"
  },
  {
    id: "8c6a7595-9403-44f3-81ac-a2e5ceb37459",
    title: "The battle over the AI-led future of banking has begun",
    date: "2026-10-14",
    time: "05:00",
    url: "https://www.ft.com/content/8c6a7595-9403-44f3-81ac-a2e5ceb37459"
  }
];
