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
  },
  {
    id: "9c5501bc-7297-4864-a5a7-b2f2001e2dd9",
    title: "Modi cannot silence India’s disaffected youth",
    date: "2026-10-13",
    time: "18:28",
    url: "https://www.ft.com/content/9c5501bc-7297-4864-a5a7-b2f2001e2dd9"
  },
  {
    id: "e582246d-c869-46dc-a8a5-5ea52fa689e7",
    title: "‘Pro-business’ Burnham reassures chief executives on tax",
    date: "2026-10-13",
    time: "18:28",
    url: "https://www.ft.com/content/e582246d-c869-46dc-a8a5-5ea52fa689e7"
  },
  {
    id: "9fcf1e27-e0b7-4016-bf19-2f87ac62a13b",
    title: "Number of UK Isa millionaires jumps 50 per cent in a year",
    date: "2026-10-13",
    time: "17:56",
    url: "https://www.ft.com/content/9fcf1e27-e0b7-4016-bf19-2f87ac62a13b"
  },
  {
    id: "9f6ec5b2-4f0b-4ed3-9541-588d49e3ad7e",
    title: "Will bank earnings growth become a thing of the past?",
    date: "2026-10-13",
    time: "17:49",
    url: "https://www.ft.com/content/9f6ec5b2-4f0b-4ed3-9541-588d49e3ad7e"
  },
  {
    id: "bd1f3385-1985-4a8a-a781-22cbe1292d2d",
    title: "Wall Street plays down investor fears of faltering trading boom",
    date: "2026-10-13",
    time: "17:10",
    url: "https://www.ft.com/content/bd1f3385-1985-4a8a-a781-22cbe1292d2d"
  },
  {
    id: "591cf3da-e7c1-4b04-9511-fea8785f983d",
    title: "English football on ‘edge of financial disaster’, warns game’s new regulator",
    date: "2026-10-13",
    time: "17:01",
    url: "https://www.ft.com/content/591cf3da-e7c1-4b04-9511-fea8785f983d"
  },
  {
    id: "87a1a5a1-4942-47dd-856a-d9a694f7d2fd",
    title: "White House asks US envoy to Greece Kimberly Guilfoyle to resign",
    date: "2026-10-13",
    time: "16:32",
    url: "https://www.ft.com/content/87a1a5a1-4942-47dd-856a-d9a694f7d2fd"
  },
  {
    id: "b31aaac7-69c1-40da-9c2f-d4f025104d24",
    title: "Creditors sue Patrick Drahi’s Altice International over asset shifts",
    date: "2026-10-13",
    time: "16:27",
    url: "https://www.ft.com/content/b31aaac7-69c1-40da-9c2f-d4f025104d24"
  },
  {
    id: "52a1bbdd-2171-4fcb-9efe-99ed4283def5",
    title: "How not to revive Europe’s auto industry",
    date: "2026-10-13",
    time: "16:03",
    url: "https://www.ft.com/content/52a1bbdd-2171-4fcb-9efe-99ed4283def5"
  },
  {
    id: "0a39fcdb-860c-4739-8454-21fb429f6336",
    title: "Submit your questions: Who’s winning the trade war with China — the EU or US?",
    date: "2026-10-13",
    time: "15:16",
    url: "https://www.ft.com/content/0a39fcdb-860c-4739-8454-21fb429f6336"
  },
  {
    id: "e16f0422-cf75-4cc9-962d-4605e421dc63",
    title: "Chip stocks slide in wake of ‘casino’ comment by Broadcom boss",
    date: "2026-10-13",
    time: "14:53",
    url: "https://www.ft.com/content/e16f0422-cf75-4cc9-962d-4605e421dc63"
  },
  {
    id: "fbaeca48-5f50-40ca-b45e-5de62ad52b83",
    title: "London Stock Exchange owner in talks to buy credit specialist Octus",
    date: "2026-10-13",
    time: "14:41",
    url: "https://www.ft.com/content/fbaeca48-5f50-40ca-b45e-5de62ad52b83"
  }
];

