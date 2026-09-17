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
  { id: "3ab370c5-2ea2-43c8-835c-977d8f0b51f4", title: "Japan’s Sanae Takaichi reshuffles cabinet in signal of confidence to markets", date: "2026-09-17", time: "07:43", url: "https://www.ft.com/content/3ab370c5-2ea2-43c8-835c-977d8f0b51f4" },
  { id: "be4a0acf-f4e8-41da-ba04-2ed6d44b7fc2", title: "Getting to know Mr Warsh", date: "2026-09-17", time: "06:30", url: "https://www.ft.com/content/be4a0acf-f4e8-41da-ba04-2ed6d44b7fc2" },
  { id: "094d8a79-e0d0-47b7-8b0d-d4e72e079dbe", title: "FTAV’s further reading", date: "2026-09-17", time: "06:30", url: "https://www.ft.com/content/094d8a79-e0d0-47b7-8b0d-d4e72e079dbe" },
  { id: "5d1dba1a-db81-464d-b2d0-9e0741010560", title: "Von der Leyen advances EU defence pitch with army of new ideas", date: "2026-09-17", time: "06:00", url: "https://www.ft.com/content/5d1dba1a-db81-464d-b2d0-9e0741010560" },
  { id: "2739954a-816a-465a-ae21-7d846bb70365", title: "Either Meta Glasses are selling extremely well or this Citi survey might have some issues", date: "2026-09-17", time: "06:00", url: "https://www.ft.com/content/2739954a-816a-465a-ae21-7d846bb70365" },
  { id: "d719d59e-cb2a-4488-a4cf-2f291a85e9ca", title: "FirstFT: How AI is transforming warfare", date: "2026-09-17", time: "05:30", url: "https://www.ft.com/content/d719d59e-cb2a-4488-a4cf-2f291a85e9ca" },
  { id: "5226dcb7-d89d-4b68-981f-b2736d7e4dca", title: "US rate rise jolts yen ahead of Bank of Japan meeting", date: "2026-09-17", time: "05:15", url: "https://www.ft.com/content/5226dcb7-d89d-4b68-981f-b2736d7e4dca" },
  { id: "5b2a7780-270b-4679-9229-3ad88395de95", title: "Business of Sailing", date: "2026-09-17", time: "05:09", url: "https://www.ft.com/content/5b2a7780-270b-4679-9229-3ad88395de95" },
  { id: "fb8e1037-8c48-49d2-809e-950472bcbae5", title: "Donald Trump fails to bend the Federal Reserve to his will", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/fb8e1037-8c48-49d2-809e-950472bcbae5" },
  { id: "8767b80b-3fd8-4747-b538-98ed8a4afe11", title: "Vue explores London IPO as cinemas emerge from ‘six years of hell’", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/8767b80b-3fd8-4747-b538-98ed8a4afe11" },
  { id: "6e418231-33f5-4fda-83a0-28ceb0a64d6a", title: "The private equity hand rolling up the Algarve", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/6e418231-33f5-4fda-83a0-28ceb0a64d6a" },
  { id: "7b1a00f1-6842-4f5e-ace4-d6a57e98b21e", title: "Why Mark Carney’s romance with Europe can only go so far ", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/7b1a00f1-6842-4f5e-ace4-d6a57e98b21e" },
  { id: "0b45cb01-7f62-41c5-8c48-10c47f2e1ae6", title: "EU asks China to voluntarily limit car exports ", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/0b45cb01-7f62-41c5-8c48-10c47f2e1ae6" },
  { id: "8eda412f-caed-4b31-bdee-b76fc9f3ba82", title: "Heatwave triggers potato shortage in Europe", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/8eda412f-caed-4b31-bdee-b76fc9f3ba82" },
  { id: "f5325951-7049-4d3a-97e4-cbe34f9058d8", title: "The Apple trust premium in the age of AI", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/f5325951-7049-4d3a-97e4-cbe34f9058d8" },
  { id: "73b7c439-8905-4509-bc09-1a8965146da2", title: "St James’s Place looks smartly attired for the AI wealth party", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/73b7c439-8905-4509-bc09-1a8965146da2" },
  { id: "23d35821-2d3f-4e55-8ada-99bcbacdc066", title: "Do inflation expectations matter in a social-media echo chamber?", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/23d35821-2d3f-4e55-8ada-99bcbacdc066" },
  { id: "25c69be0-d2f5-4341-bc7f-f671c01ddb39", title: "Nick Candy-linked company won mining rights in Nicaragua days after he met dictator’s son", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/25c69be0-d2f5-4341-bc7f-f671c01ddb39" },
  { id: "d0009033-b45a-4e88-86a0-45bbdfc9ac8c", title: "Designer Kim Jones is Aman for all seasons", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/d0009033-b45a-4e88-86a0-45bbdfc9ac8c" },
  { id: "7091cca7-4035-44b2-a0fd-d0b8b1fff997", title: "‘Our first trial batch got contaminated. We wasted thousands’ — Dash Water co-founder", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/7091cca7-4035-44b2-a0fd-d0b8b1fff997" },
  { id: "5f9d24ee-f51c-47d1-9a39-d1b28dfaac43", title: "Home renovation on a tight budget? Try dragons, rocks and silk offcuts ", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/5f9d24ee-f51c-47d1-9a39-d1b28dfaac43" },
  { id: "d95a04c2-6d6a-4622-a3db-2abf9e4680a4", title: "A seafood odyssey in Canada’s maritime east", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/d95a04c2-6d6a-4622-a3db-2abf9e4680a4" },
  { id: "ca551e46-8ced-4e63-ace1-bdf20caedce7", title: "Barclays hit by staff backlash over return-to-office rules", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/ca551e46-8ced-4e63-ace1-bdf20caedce7" },
  { id: "686429c0-daf3-42a5-9b7c-7ff06eb291ef", title: "The era of AI warfare has arrived", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/686429c0-daf3-42a5-9b7c-7ff06eb291ef" },
  { id: "c7d5e68a-1e79-478f-83fe-1307a65aaa96", title: "Exclusive: a first look at The Horses, London’s most keenly awaited new pub", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/c7d5e68a-1e79-478f-83fe-1307a65aaa96" },
  { id: "1dbc97ca-0277-4599-abe4-57ac82b85b49", title: "Partner to The Ocean Race pushes contest to rewrite rules", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/1dbc97ca-0277-4599-abe4-57ac82b85b49" },
  { id: "16781206-42cd-4af2-9904-a2a3155da83d", title: "Australia fights to reclaim SailGP racing title", date: "2026-09-17", time: "05:00", url: "https://www.ft.com/content/16781206-42cd-4af2-9904-a2a3155da83d" },
  { id: "3dacfbb9-e7ec-4286-b161-1f86bcd761cb", title: "UK prepares for a ‘really challenging’ Budget as interest rate fears mount", date: "2026-09-16", time: "19:46", url: "https://www.ft.com/content/3dacfbb9-e7ec-4286-b161-1f86bcd761cb" },
  { id: "b990fc74-9efe-4de0-a6ca-64427e6e4f84", title: "Federal Reserve raises fed funds rate with likely more to come", date: "2026-09-16", time: "19:35", url: "https://www.ft.com/content/b990fc74-9efe-4de0-a6ca-64427e6e4f84" },
  { id: "d1f2c9bd-26ce-4e87-9da4-fe0238bd531d", title: "Revolut hackers demand $3mn ransom", date: "2026-09-16", time: "18:58", url: "https://www.ft.com/content/d1f2c9bd-26ce-4e87-9da4-fe0238bd531d" },
  { id: "7be92efe-13d6-4d02-9f77-0e8229b3b8fa", title: "Trump oil ally Harold Hamm to invest in Venezuela", date: "2026-09-16", time: "18:39", url: "https://www.ft.com/content/7be92efe-13d6-4d02-9f77-0e8229b3b8fa" },
  { id: "d4368014-a79f-4887-a839-1fc43b52fca1", title: "Britain’s unsustainable pensions lock", date: "2026-09-16", time: "18:21", url: "https://www.ft.com/content/d4368014-a79f-4887-a839-1fc43b52fca1" },
  { id: "3f9013b1-11a8-4dbd-a985-b0577fd95313", title: "Turkish stocks slide in ‘fund run’ as investors withdraw $1bn", date: "2026-09-16", time: "17:39", url: "https://www.ft.com/content/3f9013b1-11a8-4dbd-a985-b0577fd95313" },
  { id: "61b5fbae-9dd6-4980-bd1f-effe54b72d84", title: "Federal Reserve decision live: US central bank tipped to raise interest rates for first time in 3 years", date: "2026-09-16", time: "17:32", url: "https://www.ft.com/content/61b5fbae-9dd6-4980-bd1f-effe54b72d84" },
  { id: "fc08dba8-3e16-4262-9e2c-0d59d049efdc", title: "Bach choir is a rare symbol of unity in a swing state", date: "2026-09-16", time: "17:03", url: "https://www.ft.com/content/fc08dba8-3e16-4262-9e2c-0d59d049efdc" },
  { id: "1b95b8c0-3563-4c3d-93f2-9d4d9fe3bc2e", title: "This is good for AI!!!! Aaargh!!!!", date: "2026-09-16", time: "16:32", url: "https://www.ft.com/content/1b95b8c0-3563-4c3d-93f2-9d4d9fe3bc2e" },
  { id: "8abe8957-83c1-475a-b6d0-556d094f474d", title: "Oura will struggle to justify pulse-racing $16bn valuation", date: "2026-09-16", time: "16:00", url: "https://www.ft.com/content/8abe8957-83c1-475a-b6d0-556d094f474d" },
  { id: "57c085c9-741e-4202-8be7-812ea7bd6d19", title: "UK inflation rose to 3.1% in August", date: "2026-09-16", time: "15:57", url: "https://www.ft.com/content/57c085c9-741e-4202-8be7-812ea7bd6d19" },
  { id: "35b6c207-98b1-44fb-82b9-3c8c29507e0a", title: "The EU should not increase resilience at the expense of trusted partners", date: "2026-09-16", time: "15:16", url: "https://www.ft.com/content/35b6c207-98b1-44fb-82b9-3c8c29507e0a" },
  { id: "0a6dbcf3-adb9-493a-83d7-b1f43a2f75b3", title: "Salary stand-off delays abolition of NHS quango", date: "2026-09-16", time: "15:12", url: "https://www.ft.com/content/0a6dbcf3-adb9-493a-83d7-b1f43a2f75b3" },
  { id: "29f0dac0-0523-46c4-a573-cd681a69b445", title: "Anthropic’s mother of all risk factors", date: "2026-09-16", time: "14:27", url: "https://www.ft.com/content/29f0dac0-0523-46c4-a573-cd681a69b445" },
];
