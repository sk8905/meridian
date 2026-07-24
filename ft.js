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
  { id: "8bf64e52-3e00-4305-8c1d-afd7e5591055", title: "Blackstone’s Stephen Schwarzman: ‘Our stock is on sale’", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/8bf64e52-3e00-4305-8c1d-afd7e5591055" },
  { id: "4ecdab5f-d85d-41df-8fa6-861f650f8bd4", title: "The fight to be the next Andy Burnham", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/4ecdab5f-d85d-41df-8fa6-861f650f8bd4" },
  { id: "9048c284-e516-42af-bd1c-b636fb2a3462", title: "Can the ‘Johnny Cash of the Allagash’ win the US Senate for the Democrats?", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/9048c284-e516-42af-bd1c-b636fb2a3462" },
  { id: "c92e3acf-f8e9-40cd-b328-3b230bbab734", title: "BNP Paribas shows there is life beyond Mars", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/c92e3acf-f8e9-40cd-b328-3b230bbab734" },
  { id: "f0f7793b-fbf6-45fe-b6cb-2abe409b359a", title: "Senior City of London Police officer urges Burnham to be ‘loud’ on fraud", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/f0f7793b-fbf6-45fe-b6cb-2abe409b359a" },
  { id: "52961fa7-6d9d-46b8-a627-9335964bf7ac", title: "Burnham the builder: can British housebuilders deliver his ambition?", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/52961fa7-6d9d-46b8-a627-9335964bf7ac" },
  { id: "5c9ae967-8e85-470f-974b-43667cc6f1c1", title: "Russia’s biggest online retailer becomes target in Ukraine drone war", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/5c9ae967-8e85-470f-974b-43667cc6f1c1" },
  { id: "39100ba0-e9d5-4fb8-bd94-ec07860b52f8", title: "When will Andy Burnham tackle the ‘cost of working’ crisis?", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/39100ba0-e9d5-4fb8-bd94-ec07860b52f8" },
  { id: "7bcf8215-fd76-4620-bdc3-8c1b0ea13bba", title: "Welcome to the era of financial candyfloss", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/7bcf8215-fd76-4620-bdc3-8c1b0ea13bba" },
  { id: "901761c9-78bd-455b-9f50-1870db95b3c4", title: "Demand for ‘impact’ funds holds up despite ESG backlash", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/901761c9-78bd-455b-9f50-1870db95b3c4" },
  { id: "efec9ae0-09e4-4546-8a31-07ba84c1db1a", title: "Fund firms deploy ETF ‘spaghetti cannon’ in hunt for next hot trade", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/efec9ae0-09e4-4546-8a31-07ba84c1db1a" },
  { id: "40bca32f-d715-48f9-9a8f-fb4bd3f199b8", title: "The rapid rise of English councils funding private online school places", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/40bca32f-d715-48f9-9a8f-fb4bd3f199b8" },
  { id: "4b680401-648e-48ea-a52b-ad7a76370872", title: "The strongman of Pakistan", date: "2026-07-24", time: "05:00", url: "https://www.ft.com/content/4b680401-648e-48ea-a52b-ad7a76370872" },
  { id: "ea107717-6d9a-4b21-b5b4-c94b6c2be5e9", title: "Modi offers Indian students fresh concessions to head off protests", date: "2026-07-24", time: "04:52", url: "https://www.ft.com/content/ea107717-6d9a-4b21-b5b4-c94b6c2be5e9" },
  { id: "078269b4-5518-4289-b90a-dd722fd7e703", title: "US hits 60 countries with new duties as Donald Trump rebuilds tariff wall", date: "2026-07-24", time: "04:08", url: "https://www.ft.com/content/078269b4-5518-4289-b90a-dd722fd7e703" },
  { id: "8ebab4c1-f36a-455e-a3d1-b36247296669", title: "South Korea’s cash-rich winners of AI boom go on US buying spree", date: "2026-07-24", time: "04:06", url: "https://www.ft.com/content/8ebab4c1-f36a-455e-a3d1-b36247296669" },
{ id: "48f0a410-daae-420b-93fc-216c3a2f1184", title: "Intel posts fastest growth in 15 years as AI fuels chip sales", date: "2026-07-23", time: "21:02", url: "https://www.ft.com/content/48f0a410-daae-420b-93fc-216c3a2f1184" },
  { id: "f46bb42d-b61d-4932-a07b-09172b15509f", title: "How Andy Burnham’s rise to PM was helped by those axed by Starmer", date: "2026-07-23", time: "19:35", url: "https://www.ft.com/content/f46bb42d-b61d-4932-a07b-09172b15509f" },
  { id: "55b3b434-9965-4046-b239-43443db3e54a", title: "Trump’s dubious nuclear deal with Saudi Arabia", date: "2026-07-23", time: "18:56", url: "https://www.ft.com/content/55b3b434-9965-4046-b239-43443db3e54a" },
  { id: "a5c66044-8999-48a5-b9cc-51341f177930", title: "US Department of Justice to streamline company merger reviews", date: "2026-07-23", time: "18:56", url: "https://www.ft.com/content/a5c66044-8999-48a5-b9cc-51341f177930" },
  { id: "58a7b441-938c-4c05-9615-40ceaf17882b", title: "North Sea oil and gas industry looks for answers from new energy secretary", date: "2026-07-23", time: "18:49", url: "https://www.ft.com/content/58a7b441-938c-4c05-9615-40ceaf17882b" },
  { id: "b150cd9c-d31e-498d-ac31-ff5d93cb674f", title: "UK employers should keep access to skilled trades visas, government advisers say", date: "2026-07-23", time: "18:06", url: "https://www.ft.com/content/b150cd9c-d31e-498d-ac31-ff5d93cb674f" },
  { id: "afeeafb7-2a0c-4aba-a798-cecd2d8c8685", title: "The Nestlé supertanker’s turnaround is in train — under the surface", date: "2026-07-23", time: "18:00", url: "https://www.ft.com/content/afeeafb7-2a0c-4aba-a798-cecd2d8c8685" },
  { id: "bd7626de-c367-4e64-ab94-e84c2d10d87f", title: "US weapons makers’ sales soar as Iran war boosts order backlog", date: "2026-07-23", time: "17:47", url: "https://www.ft.com/content/bd7626de-c367-4e64-ab94-e84c2d10d87f" },
  { id: "0c0b1e83-8e5e-4c86-b9c6-179dba51fc69", title: "Greek tycoon’s tanker towed into Iranian waters", date: "2026-07-23", time: "17:40", url: "https://www.ft.com/content/0c0b1e83-8e5e-4c86-b9c6-179dba51fc69" },
  { id: "ce76ec03-b80f-4348-82b2-d23de0ac11f2", title: "The US may find it hard to shrug off Moonshot’s AI shockwaves", date: "2026-07-23", time: "17:30", url: "https://www.ft.com/content/ce76ec03-b80f-4348-82b2-d23de0ac11f2" },
  { id: "b02f972c-c764-4006-9377-42563d9d5530", title: "Google burns through $6bn in cash as AI spending climbs again", date: "2026-07-23", time: "17:21", url: "https://www.ft.com/content/b02f972c-c764-4006-9377-42563d9d5530" },
  { id: "619d9ef8-1c6c-42a3-9e3d-4c3942a1e1df", title: "Europe could help get Ukraine and Russia to the negotiating table", date: "2026-07-23", time: "17:14", url: "https://www.ft.com/content/619d9ef8-1c6c-42a3-9e3d-4c3942a1e1df" },
  { id: "3fd494d1-ee74-4c0f-9cd6-34e2283961df", title: "Oil hits $100 for first time since May while Wall Street stocks slide", date: "2026-07-23", time: "17:08", url: "https://www.ft.com/content/3fd494d1-ee74-4c0f-9cd6-34e2283961df" },
  { id: "7b14576c-9ddc-4983-a6d8-78a0c621b3b2", title: "Hedge funds grow at fastest rate in history as AI boom lifts markets", date: "2026-07-23", time: "16:44", url: "https://www.ft.com/content/7b14576c-9ddc-4983-a6d8-78a0c621b3b2" },
  { id: "bfc7b491-e553-4686-9531-a07b14a4d4b9", title: "Hundreds settle with HMRC as crypto tax crackdown continues", date: "2026-07-23", time: "16:17", url: "https://www.ft.com/content/bfc7b491-e553-4686-9531-a07b14a4d4b9" },
  { id: "c678eda2-9749-4c8b-8f25-21bcbf5d1acb", title: "Apple revives automotive ambitions with Ford deal for in-car software", date: "2026-07-23", time: "15:57", url: "https://www.ft.com/content/c678eda2-9749-4c8b-8f25-21bcbf5d1acb" },
  { id: "393e363c-a5ef-488b-9c7e-2a3e0d631125", title: "Palestinian economy on 'cliff edge' as Israeli banks cut ties", date: "2026-07-23", time: "15:41", url: "https://www.ft.com/content/393e363c-a5ef-488b-9c7e-2a3e0d631125" },
  { id: "fff19dd8-4c7e-4120-a282-0cdf77c56d71", title: "Trump administration's dealing in companies is on shaky ground", date: "2026-07-23", time: "15:36", url: "https://www.ft.com/content/fff19dd8-4c7e-4120-a282-0cdf77c56d71" },
  { id: "dc5e629b-562c-41e3-8b89-350af6960adc", title: "Tesla shares tumble 11% after discounts hit profits", date: "2026-07-23", time: "14:52", url: "https://www.ft.com/content/dc5e629b-562c-41e3-8b89-350af6960adc" },
  { id: "3d5544cd-a1e5-4a33-8db5-1e95fbf17def", title: "Donald Trump throws controversial US-Saudi Arabia nuclear pact into doubt", date: "2026-07-23", time: "14:40", url: "https://www.ft.com/content/3d5544cd-a1e5-4a33-8db5-1e95fbf17def" },
  { id: "50793b37-e310-4d38-8f8d-4a2bdb5ee91a", title: "Trump says Saudi nuclear deal depends on relations with Israel", date: "2026-07-23", time: "14:39", url: "https://www.ft.com/content/50793b37-e310-4d38-8f8d-4a2bdb5ee91a" },
  { id: "e28b3259-ddc9-43dc-8c3f-fca85edf7e84", title: "European Central Bank holds interest rates at 2.25% after debating rise", date: "2026-07-23", time: "14:34", url: "https://www.ft.com/content/e28b3259-ddc9-43dc-8c3f-fca85edf7e84" },
  { id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2", title: "Inflation and interest rates tracker: see how your country compares", date: "2026-07-23", time: "13:32", url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2" },
  { id: "ed9baeee-aabc-458a-a161-a607032d158d", title: "Laura Loomer meets Volodymyr Zelenskyy after pro-Ukraine conversion", date: "2026-07-23", time: "13:30", url: "https://www.ft.com/content/ed9baeee-aabc-458a-a161-a607032d158d" },
];
