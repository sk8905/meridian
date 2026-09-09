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
  { id: "88614cc3-6769-47c2-8fcb-76784cef5fca", title: "UK airports warn of further travel disruption", date: "2026-09-09", time: "08:43", url: "https://www.ft.com/content/88614cc3-6769-47c2-8fcb-76784cef5fca" },
  { id: "c8921e49-1d06-4d27-ab38-7a1d8e3d43fe", title: "Oil hits $100 for first time since July", date: "2026-09-09", time: "08:19", url: "https://www.ft.com/content/c8921e49-1d06-4d27-ab38-7a1d8e3d43fe" },
  { id: "b460b828-6183-4914-9140-5dfb6d61312c", title: "Oil nears $100 as US launches new strikes on Iranian tankers", date: "2026-09-09", time: "08:13", url: "https://www.ft.com/content/b460b828-6183-4914-9140-5dfb6d61312c" },
  { id: "fe0cbcfc-b351-4dac-889f-7b8f11f79102", title: "Norway’s oil fund says what everyone is thinking", date: "2026-09-09", time: "06:30", url: "https://www.ft.com/content/fe0cbcfc-b351-4dac-889f-7b8f11f79102" },
  { id: "8e950485-7962-4de6-a5b8-a14612e37f7a", title: "FTAV’s further reading", date: "2026-09-09", time: "06:30", url: "https://www.ft.com/content/8e950485-7962-4de6-a5b8-a14612e37f7a" },
  { id: "33d4674f-31db-4551-9ad3-c43d5c94c94c", title: "The clock is ticking on Senegal’s ‘total return swaps’", date: "2026-09-09", time: "06:00", url: "https://www.ft.com/content/33d4674f-31db-4551-9ad3-c43d5c94c94c" },
  { id: "0715a142-311f-422f-a9dd-9e31bc3d7d61", title: "FirstFT: Anthropic withheld AI model from UK testers", date: "2026-09-09", time: "05:31", url: "https://www.ft.com/content/0715a142-311f-422f-a9dd-9e31bc3d7d61" },
  { id: "560e1c8b-f163-4fd6-b604-e905550ac870", title: "Anthropic withheld latest AI model from UK testing agency", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/560e1c8b-f163-4fd6-b604-e905550ac870" },
  { id: "e58008a5-d757-4570-af08-d2396f46f03f", title: "Warsh might yet be a good Fed chair", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/e58008a5-d757-4570-af08-d2396f46f03f" },
  { id: "fe1cbd53-eeb8-4916-a4e0-4325b5bea425", title: "BP and Shell’s strategy counterpoint", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/fe1cbd53-eeb8-4916-a4e0-4325b5bea425" },
  { id: "6f71552b-0a1a-46d2-93d0-dc676aeed75b", title: "McLaren to create 1,000 UK jobs in product overhaul", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/6f71552b-0a1a-46d2-93d0-dc676aeed75b" },
  { id: "6525cf15-0cf0-4fff-a3a4-298a41569d97", title: "World’s biggest relationship? Xi and Modi look to rebuild ties for 2.8bn people", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/6525cf15-0cf0-4fff-a3a4-298a41569d97" },
  { id: "ef6d5693-a5b0-445a-8f30-d514d50651e1", title: "Who is voting for the far-right Alternative for Germany?", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/ef6d5693-a5b0-445a-8f30-d514d50651e1" },
  { id: "a60fe9fe-3905-44c0-ad32-07762cf44786", title: "How Greece is wooing hedge funds", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/a60fe9fe-3905-44c0-ad32-07762cf44786" },
  { id: "fb189d81-e5ce-4aba-8707-53c88dae6e60", title: "AI borrowing boom shakes up Swiss credit market", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/fb189d81-e5ce-4aba-8707-53c88dae6e60" },
  { id: "bc814c67-2371-4d0b-b44d-1539328e5f90", title: "Is the modern economy a bit too . . . samey?", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/bc814c67-2371-4d0b-b44d-1539328e5f90" },
  { id: "e7a86df3-cf29-48d1-9ae9-c65effccdbd8", title: "What will the new cohabitation proposals mean for me?", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/e7a86df3-cf29-48d1-9ae9-c65effccdbd8" },
  { id: "b9d799ba-20ee-404b-bf30-1d35da41823f", title: "An insiders’ guide to house-hunting in Milan", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/b9d799ba-20ee-404b-bf30-1d35da41823f" },
  { id: "4dde2b92-eadb-41e3-9fad-c9bf0636010a", title: "EU resists Mario Draghi’s competitiveness cures", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/4dde2b92-eadb-41e3-9fad-c9bf0636010a" },
  { id: "c1029e47-7487-4bd7-8ed4-7512b76f1834", title: "Iran turns to crypto to get around sanctions", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/c1029e47-7487-4bd7-8ed4-7512b76f1834" },
  { id: "82440fd9-58ea-4191-a494-7dc7091372ad", title: "Money to Burn by William D Cohan — Leon Black’s rise and fall in an age of excess", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/82440fd9-58ea-4191-a494-7dc7091372ad" },
  { id: "3fe2c829-3c95-4c2c-b3bb-3567dfd94f58", title: "A top defence barrister faces sanction. Is he right to feel aggrieved?", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/3fe2c829-3c95-4c2c-b3bb-3567dfd94f58" },
  { id: "cc219c30-3d6c-4fba-b3d8-41ef30b9bada", title: "Inside Mytheresa, ecommerce’s biggest winner", date: "2026-09-09", time: "05:00", url: "https://www.ft.com/content/cc219c30-3d6c-4fba-b3d8-41ef30b9bada" },
  { id: "5816292b-c36b-4c22-aa50-2680b9970382", title: "Meta unveils AI personal assistant linked to WhatsApp and Instagram", date: "2026-09-08", time: "20:01", url: "https://www.ft.com/content/5816292b-c36b-4c22-aa50-2680b9970382" },
  { id: "c167b64d-aa04-4e6a-9dda-06ad70a36c52", title: "UK says it will force tech giants to stop children sharing nude images", date: "2026-09-08", time: "19:34", url: "https://www.ft.com/content/c167b64d-aa04-4e6a-9dda-06ad70a36c52" },
  { id: "d1d0054d-16ae-45b4-b2e1-421ce5461041", title: "Smithsonian head to resign after Donald Trump attacks US slavery exhibits", date: "2026-09-08", time: "19:30", url: "https://www.ft.com/content/d1d0054d-16ae-45b4-b2e1-421ce5461041" },
  { id: "faa622d9-0faa-4578-b908-4e77b72a8d44", title: "War and weather threaten fresh burst of UK inflation, BoE governor warns", date: "2026-09-08", time: "18:48", url: "https://www.ft.com/content/faa622d9-0faa-4578-b908-4e77b72a8d44" },
  { id: "f13d5f54-deaf-4d44-9e8f-e91f5972b064", title: "Growth in every postcode: good politics, dubious economics", date: "2026-09-08", time: "18:03", url: "https://www.ft.com/content/f13d5f54-deaf-4d44-9e8f-e91f5972b064" },
  { id: "944fd36f-8f91-4178-b05a-2b961c44e310", title: "Apple looks to AI capabilities to drive its new foldable phone sales", date: "2026-09-08", time: "17:20", url: "https://www.ft.com/content/944fd36f-8f91-4178-b05a-2b961c44e310" },
  { id: "76d33021-57c6-4240-ae0b-cd4a79a24980", title: "Putin praises US peace efforts in call with Trump", date: "2026-09-08", time: "16:28", url: "https://www.ft.com/content/76d33021-57c6-4240-ae0b-cd4a79a24980" },
  { id: "2a69d864-a953-40b1-85ce-b6256ca411fc", title: "UK selects Canada’s statistics chief to run data service", date: "2026-09-08", time: "16:21", url: "https://www.ft.com/content/2a69d864-a953-40b1-85ce-b6256ca411fc" },
  { id: "2e97fb28-24cf-4ab0-89b1-454b4f97cdbc", title: "Young Americans have never witnessed a functioning foreign policy", date: "2026-09-08", time: "15:24", url: "https://www.ft.com/content/2e97fb28-24cf-4ab0-89b1-454b4f97cdbc" },
  { id: "ef50aed1-e50c-4cb6-a418-266476fb2829", title: "To safeguard Israel’s future, the UK is right to sanction settlers", date: "2026-09-08", time: "15:13", url: "https://www.ft.com/content/ef50aed1-e50c-4cb6-a418-266476fb2829" },
  { id: "f1a7b7be-1444-4f2f-80ca-905c8630f295", title: "Heathrow and Gatwick flights face disruption over air traffic control ‘technical issue’", date: "2026-09-08", time: "15:06", url: "https://www.ft.com/content/f1a7b7be-1444-4f2f-80ca-905c8630f295" },
  { id: "d264136c-8215-4ac6-a1cc-1efeb23ae5cd", title: "Cerberus nears £1bn deal for Goodwin defence unit", date: "2026-09-08", time: "14:43", url: "https://www.ft.com/content/d264136c-8215-4ac6-a1cc-1efeb23ae5cd" },
  { id: "a7011878-b0b7-4e7f-8f5a-e7d9d662fd47", title: "Donald Trump calls for Bombardier boycott as Canada hits US with tariffs", date: "2026-09-08", time: "14:38", url: "https://www.ft.com/content/a7011878-b0b7-4e7f-8f5a-e7d9d662fd47" },
  { id: "700806be-ecba-4c0b-92a9-cc32d7feded4", title: "Former Swiss bank lobby chief convicted of bribery and money laundering", date: "2026-09-08", time: "14:28", url: "https://www.ft.com/content/700806be-ecba-4c0b-92a9-cc32d7feded4" },
  { id: "22eacb3c-6cab-490d-a117-75ba90a2d35c", title: "Merz’s CDU in crisis after far-right victory in Saxony-Anhalt", date: "2026-09-08", time: "14:28", url: "https://www.ft.com/content/22eacb3c-6cab-490d-a117-75ba90a2d35c" },
  { id: "792e9e30-7a96-402c-a472-d7304f5bc1ef", title: "Iceland summons US ambassador over Trump’s Stars and Stripes map", date: "2026-09-08", time: "14:09", url: "https://www.ft.com/content/792e9e30-7a96-402c-a472-d7304f5bc1ef" },
];
