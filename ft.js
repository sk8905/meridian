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
  { id: "75e3ac7d-f612-470b-af3a-a310c52c4e58", title: "Who wants to buy a football club?", date: "2026-07-25", time: "09:00", url: "https://www.ft.com/content/75e3ac7d-f612-470b-af3a-a310c52c4e58" },
  { id: "ac19e4f4-cf7b-4a75-b591-0ca79ef62d37", title: "India’s ‘Cockroach’ Gen Z has had enough", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/ac19e4f4-cf7b-4a75-b591-0ca79ef62d37" },
  { id: "24a8adf9-8103-44b3-92e8-350ef897dc2a", title: "Overpriced UK homes take ‘more than four times longer to sell’, study finds", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/24a8adf9-8103-44b3-92e8-350ef897dc2a" },
  { id: "66a53961-6583-4dfb-8b74-96e6abed5db7", title: "What the City needs from the Burnham government", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/66a53961-6583-4dfb-8b74-96e6abed5db7" },
  { id: "4c76fc58-836c-4abe-916e-bfc727f83fca", title: "Andy Burnham’s regional privilege", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/4c76fc58-836c-4abe-916e-bfc727f83fca" },
  { id: "803b02dd-9d0d-43b9-8af9-24d81b1b6557", title: "Dropping quarterly company reports in US may not be a bad thing", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/803b02dd-9d0d-43b9-8af9-24d81b1b6557" },
  { id: "bfe34895-6383-4906-96b9-c622d10e32da", title: "More than 600,000 UK high earners could be dragged into pension trap by 2032", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/bfe34895-6383-4906-96b9-c622d10e32da" },
  { id: "42847a3b-f4b6-4a16-88e0-f06fdfabbdc6", title: "India and South Africa lead push to amass emergency fuel stockpiles", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/42847a3b-f4b6-4a16-88e0-f06fdfabbdc6" },
  { id: "688211ec-ffa2-421d-85cb-59bce6b1e0dd", title: "The gig is now the content, and the content is the gig", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/688211ec-ffa2-421d-85cb-59bce6b1e0dd" },
  { id: "577bd050-cee7-4e69-aa43-5106a0635a65", title: "Europe can’t stop the tide of cocaine", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/577bd050-cee7-4e69-aa43-5106a0635a65" },
  { id: "0ce20ef6-178e-4f8a-8a0a-e5f5cc79a414", title: "How did summer childcare get so expensive in the UK?", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/0ce20ef6-178e-4f8a-8a0a-e5f5cc79a414" },
  { id: "e548b330-6621-4fc6-b72a-c6dcd50a785b", title: "Mexico’s Claudia Sheinbaum puts faith in petrol price cap", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/e548b330-6621-4fc6-b72a-c6dcd50a785b" },
  { id: "95cad892-7933-441a-bc82-c39b1a225835", title: "Paramount agrees extensive delay in Warner Bros deal after state lawsuit", date: "2026-07-24", time: "21:17", url: "https://www.ft.com/content/95cad892-7933-441a-bc82-c39b1a225835" },
  { id: "6e1d4a14-b7ad-4a36-86d9-3990497272a3", title: "France and Spain evacuate 150,000 as \u2018unprecedented\u2019 wildfires spread", date: "2026-07-24", time: "21:07", url: "https://www.ft.com/content/6e1d4a14-b7ad-4a36-86d9-3990497272a3" },
  { id: "96a33881-27fd-42cf-8cff-4cbc87fc835f", title: "US tech groups cut 140,000 jobs despite AI spending boom", date: "2026-07-24", time: "21:00", url: "https://www.ft.com/content/96a33881-27fd-42cf-8cff-4cbc87fc835f" },
  { id: "9dcb5d72-13aa-4f9c-ac6d-e022860df5ea", title: "Waymo explores split with Uber as robotaxi tensions deepen", date: "2026-07-24", time: "20:15", url: "https://www.ft.com/content/9dcb5d72-13aa-4f9c-ac6d-e022860df5ea" },
  { id: "4d8139b2-8ea2-468b-a674-5f6a90a84182", title: "China investigates former securities regulator Fang Xinghai", date: "2026-07-24", time: "19:25", url: "https://www.ft.com/content/4d8139b2-8ea2-468b-a674-5f6a90a84182" },
  { id: "9b819dfc-8248-4aa5-b670-3a14d05f252e", title: "Donald Trump threatens new EU tariffs in retaliation for fines on US tech groups", date: "2026-07-24", time: "19:21", url: "https://www.ft.com/content/9b819dfc-8248-4aa5-b670-3a14d05f252e" },
  { id: "cdb327b6-394b-4da1-943e-65d40e4f4345", title: "Number 10 North is no \u2018gimmick\u2019, says Andy Burnham", date: "2026-07-24", time: "19:14", url: "https://www.ft.com/content/cdb327b6-394b-4da1-943e-65d40e4f4345" },
  { id: "a08167d0-232d-4ab0-9437-da47fcdcf5df", title: "Tory party \u2018bans\u2019 candidates who don\u2019t back its human rights and net zero pledges", date: "2026-07-24", time: "18:52", url: "https://www.ft.com/content/a08167d0-232d-4ab0-9437-da47fcdcf5df" },
  { id: "002120c3-a62d-4da8-8ba6-bc1290c89be6", title: "John Healey under pressure to raise taxes or cut UK spending as fiscal headroom shrinks", date: "2026-07-24", time: "18:50", url: "https://www.ft.com/content/002120c3-a62d-4da8-8ba6-bc1290c89be6" },
  { id: "b0c496af-bb5b-44c5-84e5-9c09431b8903", title: "Narendra Modi struggles to calm Indian students\u2019 anger over exam leaks", date: "2026-07-24", time: "18:22", url: "https://www.ft.com/content/b0c496af-bb5b-44c5-84e5-9c09431b8903" },
  { id: "a08c02e1-8d20-4001-ab9b-1dbfea7acedc", title: "Police seize sophisticated bomb near Northern Irish border", date: "2026-07-24", time: "18:06", url: "https://www.ft.com/content/a08c02e1-8d20-4001-ab9b-1dbfea7acedc" },
  { id: "6633c407-46dc-4c33-9c66-f912b9f9f5dc", title: "The return of monetarism", date: "2026-07-24", time: "18:00", url: "https://www.ft.com/content/6633c407-46dc-4c33-9c66-f912b9f9f5dc" },
  { id: "f8d2dc0d-3599-4c98-9ed3-b4812a188b85", title: "Directors\u2019 Deals: Fevara non-executive chair beefs up stake", date: "2026-07-24", time: "18:00", url: "https://www.ft.com/content/f8d2dc0d-3599-4c98-9ed3-b4812a188b85" },
  { id: "cf1caa35-51d6-45fc-9503-3f19e161f006", title: "Stockpickers: Greencore, Kier, Gateley", date: "2026-07-24", time: "18:00", url: "https://www.ft.com/content/cf1caa35-51d6-45fc-9503-3f19e161f006" },
  { id: "6c4aff69-197d-4d0d-9afa-83960d143f10", title: "Future hawks", date: "2026-07-24", time: "17:56", url: "https://www.ft.com/content/6c4aff69-197d-4d0d-9afa-83960d143f10" },
  { id: "52aa89e9-f014-498e-8415-2c435a1c858d", title: "Ship insurers restrict war coverage for Saudi Arabian cargoes in Red Sea", date: "2026-07-24", time: "17:38", url: "https://www.ft.com/content/52aa89e9-f014-498e-8415-2c435a1c858d" },
  { id: "3a62abc2-995b-4901-9ea3-832581295f45", title: "What is driving the sharp decline in UK small boat crossings?", date: "2026-07-24", time: "17:35", url: "https://www.ft.com/content/3a62abc2-995b-4901-9ea3-832581295f45" },
  { id: "3203fc9a-2321-44f8-8093-b7e16c8fc6d7", title: "Nvidia and Palantir urge US not to ban \u2018open\u2019 AI models after China scare", date: "2026-07-24", time: "16:20", url: "https://www.ft.com/content/3203fc9a-2321-44f8-8093-b7e16c8fc6d7" },
  { id: "822628c5-4f9c-47db-bd27-f3ad7f841700", title: "Meta faces higher borrowing costs in latest $12bn data centre financing", date: "2026-07-24", time: "16:08", url: "https://www.ft.com/content/822628c5-4f9c-47db-bd27-f3ad7f841700" },
  { id: "aba1b4be-68d6-4f74-a511-24fbad030024", title: "The Victorians have some lessons for Burnham on radical devolution", date: "2026-07-24", time: "16:04", url: "https://www.ft.com/content/aba1b4be-68d6-4f74-a511-24fbad030024" },
  { id: "d4dc32c5-7a96-4582-b17b-ab6a4569f474", title: "Commerzbank chair calls for talks with UniCredit after takeover battle", date: "2026-07-24", time: "15:53", url: "https://www.ft.com/content/d4dc32c5-7a96-4582-b17b-ab6a4569f474" },
  { id: "35538b17-1492-42e5-a4b6-8a9e5750c2bf", title: "Airbus and Boeing push to boost production to tackle record order backlogs", date: "2026-07-24", time: "15:45", url: "https://www.ft.com/content/35538b17-1492-42e5-a4b6-8a9e5750c2bf" },
  { id: "a39adcc1-44fb-40e0-92b9-30d769f8e4ca", title: "Carmakers are the rare example of tariffs as the least bad option", date: "2026-07-24", time: "14:57", url: "https://www.ft.com/content/a39adcc1-44fb-40e0-92b9-30d769f8e4ca" },
  { id: "3db2e890-a9e9-42f4-9c9c-0f5ecf7ac621", title: "Zooming in on UK growth", date: "2026-07-24", time: "14:50", url: "https://www.ft.com/content/3db2e890-a9e9-42f4-9c9c-0f5ecf7ac621" },
  { id: "1dcd935a-45ce-42ba-a6b0-6994eae1cb86", title: "In praise of the free flow of human ingenuity", date: "2026-07-24", time: "14:48", url: "https://www.ft.com/content/1dcd935a-45ce-42ba-a6b0-6994eae1cb86" },
  { id: "07e7e839-6d7c-4da3-a207-de5bbfb67746", title: "Submit your questions: Has the market lost its mind over AI?", date: "2026-07-24", time: "14:42", url: "https://www.ft.com/content/07e7e839-6d7c-4da3-a207-de5bbfb67746" },
  { id: "1a98a3e5-34f3-4bb6-936a-241ab72aaeed", title: "When a president's thoughts are for sale", date: "2026-07-24", time: "14:00", url: "https://www.ft.com/content/1a98a3e5-34f3-4bb6-936a-241ab72aaeed" },
  { id: "38341bcb-0c45-432a-bd04-fa0b9f2b790a", title: "Trump's trade war shifts from shakedown to lock-in", date: "2026-07-24", time: "13:53", url: "https://www.ft.com/content/38341bcb-0c45-432a-bd04-fa0b9f2b790a" },
  { id: "07e6299e-816a-4d0f-a4be-a572723f9e52", title: "Ukraine opens probe into defence event after deadly Russian strike", date: "2026-07-24", time: "13:52", url: "https://www.ft.com/content/07e6299e-816a-4d0f-a4be-a572723f9e52" },
];
