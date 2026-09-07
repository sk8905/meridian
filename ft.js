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
  { id: "a7011878-b0b7-4e7f-8f5a-e7d9d662fd47", title: "Donald Trump calls for US boycott of Canada’s Bombardier jets", date: "2026-09-07", time: "21:06", url: "https://www.ft.com/content/a7011878-b0b7-4e7f-8f5a-e7d9d662fd47" },
  { id: "ec1396b9-185e-4a55-86d6-36a560b549fb", title: "Friedrich Merz in ‘shock’ as far-right AfD celebrates ‘dream result’", date: "2026-09-07", time: "20:47", url: "https://www.ft.com/content/ec1396b9-185e-4a55-86d6-36a560b549fb" },
  { id: "97477741-5227-4783-ab30-2b94090b4d43", title: "UK ministers to be encouraged to take more legal risks to push through policies", date: "2026-09-07", time: "19:30", url: "https://www.ft.com/content/97477741-5227-4783-ab30-2b94090b4d43" },
  { id: "4d8d12a0-ed3c-4955-be63-d15225b105b6", title: "John Healey seeks to reassure bond markets as fiscal problems grow", date: "2026-09-07", time: "18:35", url: "https://www.ft.com/content/4d8d12a0-ed3c-4955-be63-d15225b105b6" },
  { id: "63573658-c54d-44ef-87b8-cfecb1dd1f3c", title: "Germany’s Merz is running out of time", date: "2026-09-07", time: "18:30", url: "https://www.ft.com/content/63573658-c54d-44ef-87b8-cfecb1dd1f3c" },
  { id: "f7f164ea-83eb-44d6-93e5-ecec8b2648d9", title: "Pricey oil is laying the groundwork for its own decline", date: "2026-09-07", time: "18:17", url: "https://www.ft.com/content/f7f164ea-83eb-44d6-93e5-ecec8b2648d9" },
  { id: "43efa6c1-6b37-4ddc-9a1d-b085bfbdba06", title: "Billionaire trader Chris Rokos to leave UK for Greece", date: "2026-09-07", time: "17:55", url: "https://www.ft.com/content/43efa6c1-6b37-4ddc-9a1d-b085bfbdba06" },
  { id: "cc750a77-fd63-40e9-be6e-99bd7c9a96a5", title: "Africa’s richest man seeks to raise $1.6bn in continent’s biggest IPO", date: "2026-09-07", time: "17:45", url: "https://www.ft.com/content/cc750a77-fd63-40e9-be6e-99bd7c9a96a5" },
  { id: "4f3566e7-7076-4527-ab8a-5e71416ce5fa", title: "What to do about the UK’s mental health crisis", date: "2026-09-07", time: "17:21", url: "https://www.ft.com/content/4f3566e7-7076-4527-ab8a-5e71416ce5fa" },
  { id: "356cf253-7711-4a89-8139-5b0152824975", title: "Belgian-Chinese researcher arrested over suspected theft of chip secrets", date: "2026-09-07", time: "16:55", url: "https://www.ft.com/content/356cf253-7711-4a89-8139-5b0152824975" },
  { id: "c8167dc7-f472-4846-8005-ee18b23736a8", title: "Oil closes in on $100 as renewed supply crunch looms", date: "2026-09-07", time: "16:51", url: "https://www.ft.com/content/c8167dc7-f472-4846-8005-ee18b23736a8" },
  { id: "d86643d2-c98c-4e19-b066-c97b50819b7e", title: "Yen surges to 6-month high as traders stay alert for signs of intervention", date: "2026-09-07", time: "16:46", url: "https://www.ft.com/content/d86643d2-c98c-4e19-b066-c97b50819b7e" },
  { id: "4275e189-997c-43f0-b702-d3447c9e81ec", title: "What next for Alternative for Germany after its victory in Saxony-Anhalt?", date: "2026-09-07", time: "16:35", url: "https://www.ft.com/content/4275e189-997c-43f0-b702-d3447c9e81ec" },
  { id: "3edf3717-4737-424c-9162-d330851edcf6", title: "Republicans fear Trump has turned toxic on the campaign trail", date: "2026-09-07", time: "16:30", url: "https://www.ft.com/content/3edf3717-4737-424c-9162-d330851edcf6" },
  { id: "8ddd3668-5858-45c3-b34f-a6bafc678187", title: "Law schools tell students to put AI away", date: "2026-09-07", time: "15:37", url: "https://www.ft.com/content/8ddd3668-5858-45c3-b34f-a6bafc678187" },
  { id: "380e0539-c591-4b51-bfa1-91079b18de3a", title: "And the FTAV charts quiz winner is…", date: "2026-09-07", time: "15:22", url: "https://www.ft.com/content/380e0539-c591-4b51-bfa1-91079b18de3a" },
  { id: "6b9afdfb-26f5-4746-8ff9-027a8d04cb1f", title: "Submit your questions: is Trump losing his touch?", date: "2026-09-07", time: "15:04", url: "https://www.ft.com/content/6b9afdfb-26f5-4746-8ff9-027a8d04cb1f" },
  { id: "b4931617-7116-4bf4-af9a-2cfcbc0424b0", title: "Top Serbian officials attend funeral of war criminal Ratko Mladić", date: "2026-09-07", time: "15:04", url: "https://www.ft.com/content/b4931617-7116-4bf4-af9a-2cfcbc0424b0" },
  { id: "8c5c7c44-c9fd-4326-b09a-9f58e3f144b9", title: "‘Chimerica’ is now a chimera — and global stability is the victim", date: "2026-09-07", time: "14:00", url: "https://www.ft.com/content/8c5c7c44-c9fd-4326-b09a-9f58e3f144b9" },
  { id: "c6aeaefc-c978-4b0a-8a25-0e336e1872a6", title: "Volkswagen strikes deal to shift plant from cars to air defence", date: "2026-09-07", time: "13:30", url: "https://www.ft.com/content/c6aeaefc-c978-4b0a-8a25-0e336e1872a6" },
  { id: "c703f1af-f8a6-43c0-94fb-04637259c295", title: "Vox rides high in Spain over Ceuta migrant crisis", date: "2026-09-07", time: "13:16", url: "https://www.ft.com/content/c703f1af-f8a6-43c0-94fb-04637259c295" },
  { id: "314ef6d6-6c82-4f3f-8e47-7aff135a1dbe", title: "Next wins ‘landmark’ ruling in UK retail’s multibillion-pound equal pay claim", date: "2026-09-07", time: "13:13", url: "https://www.ft.com/content/314ef6d6-6c82-4f3f-8e47-7aff135a1dbe" },
  { id: "06f51592-d259-4f53-b74c-31279414674d", title: "A German election result heard around the world", date: "2026-09-07", time: "13:03", url: "https://www.ft.com/content/06f51592-d259-4f53-b74c-31279414674d" },
  { id: "eb18eb97-8e68-4d9d-b77c-0b0dedd47c59", title: "Deutsche Bank settles €152mn lawsuit with former executive", date: "2026-09-07", time: "13:01", url: "https://www.ft.com/content/eb18eb97-8e68-4d9d-b77c-0b0dedd47c59" },
  { id: "4f3d6511-782b-4f10-9459-823a5ba7c669", title: "US shale pioneer takes fracking to Australia’s remote gas frontier", date: "2026-09-07", time: "13:00", url: "https://www.ft.com/content/4f3d6511-782b-4f10-9459-823a5ba7c669" },
  { id: "d7139a47-2882-4e4c-8c8d-78e3a9a17c03", title: "Canada is fated to try to do deals with Donald Trump", date: "2026-09-07", time: "12:31", url: "https://www.ft.com/content/d7139a47-2882-4e4c-8c8d-78e3a9a17c03" },
  { id: "ace61021-f3be-47a7-9117-b9f0c63d40d1", title: "China’s Global Strategy Under Xi Jinping — the plan to shift power from the west", date: "2026-09-07", time: "12:00", url: "https://www.ft.com/content/ace61021-f3be-47a7-9117-b9f0c63d40d1" },
  { id: "3ff1b017-00b9-47b2-83d1-67a1ef906915", title: "Panama Canal warns of possible transit cuts in further blow to shipping", date: "2026-09-07", time: "12:00", url: "https://www.ft.com/content/3ff1b017-00b9-47b2-83d1-67a1ef906915" },
  { id: "9ffb0fb3-51f6-4aa8-9270-a949196bf441", title: "Saudi Aramco facility hit in new strikes", date: "2026-09-07", time: "11:52", url: "https://www.ft.com/content/9ffb0fb3-51f6-4aa8-9270-a949196bf441" },
  { id: "da937483-cda9-4417-9257-540c680696c3", title: "High prices at the pump drive home cost concerns in US toss-up district", date: "2026-09-07", time: "11:00", url: "https://www.ft.com/content/da937483-cda9-4417-9257-540c680696c3" },
  { id: "116cc01f-44b3-41f8-b76c-ae340f38874e", title: "Inside PepsiCo’s battle to remake Gatorade for the Kennedy era", date: "2026-09-07", time: "11:00", url: "https://www.ft.com/content/116cc01f-44b3-41f8-b76c-ae340f38874e" },
  { id: "1aa587fc-989c-46ea-b140-e59a6ed82ba4", title: "UK seeks to end Northern Ireland budget deadlock", date: "2026-09-07", time: "10:51", url: "https://www.ft.com/content/1aa587fc-989c-46ea-b140-e59a6ed82ba4" },
  { id: "4826a106-9cd4-45bc-8436-69e2519d0205", title: "Russia-Ukraine peace talks could begin next year, ex-MI6 chief says", date: "2026-09-07", time: "10:41", url: "https://www.ft.com/content/4826a106-9cd4-45bc-8436-69e2519d0205" },
  { id: "15d59180-ea46-4441-9c45-d6be584ae911", title: "Iran to raise petrol prices as US war triggers shortages", date: "2026-09-07", time: "09:34", url: "https://www.ft.com/content/15d59180-ea46-4441-9c45-d6be584ae911" },
  { id: "35b0a1b7-f524-4f49-9e87-ee25d75c8b14", title: "Port demonstrations prompt questions for authorities and government", date: "2026-09-07", time: "09:30", url: "https://www.ft.com/content/35b0a1b7-f524-4f49-9e87-ee25d75c8b14" },
  { id: "b122bc9f-9f51-46b8-9f42-dba9fb29244c", title: "Everything is awesome", date: "2026-09-07", time: "06:30", url: "https://www.ft.com/content/b122bc9f-9f51-46b8-9f42-dba9fb29244c" },
  { id: "96e09c24-9587-41fc-9824-fb751f61be40", title: "FTAV’s further reading", date: "2026-09-07", time: "06:30", url: "https://www.ft.com/content/96e09c24-9587-41fc-9824-fb751f61be40" },
  { id: "f8e97cdb-6edb-4cb1-ae38-b3c0ceeba485", title: "EU to table ‘Buy European’ public procurement rules to push out China", date: "2026-09-07", time: "06:00", url: "https://www.ft.com/content/f8e97cdb-6edb-4cb1-ae38-b3c0ceeba485" },
  { id: "aa7371f6-5f88-4a14-a5d3-aab04a8a6705", title: "Guggenheim unit warned over internal controls", date: "2026-09-07", time: "06:00", url: "https://www.ft.com/content/aa7371f6-5f88-4a14-a5d3-aab04a8a6705" },
  { id: "b08623a1-a976-4c5f-b247-0935643124fb", title: "Could the DMO take the BoE’s long gilts off their hands?", date: "2026-09-07", time: "06:00", url: "https://www.ft.com/content/b08623a1-a976-4c5f-b247-0935643124fb" },
];
