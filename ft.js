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
  { id: "6b9afdfb-26f5-4746-8ff9-027a8d04cb1f", title: "Submit your questions: is Trump losing his touch?", date: "2026-09-08", time: "13:50", url: "https://www.ft.com/content/6b9afdfb-26f5-4746-8ff9-027a8d04cb1f" },
  { id: "990e71e5-bfa3-4ebb-963d-f8693c5ac7b1", title: "UK announces import ban on goods linked to Israeli settlements in West Bank", date: "2026-09-08", time: "13:43", url: "https://www.ft.com/content/990e71e5-bfa3-4ebb-963d-f8693c5ac7b1" },
  { id: "769abc3f-5e34-41b4-946a-16cab58010a7", title: "Is it time for Eurozone GDP ex-Ireland?", date: "2026-09-08", time: "13:15", url: "https://www.ft.com/content/769abc3f-5e34-41b4-946a-16cab58010a7" },
  { id: "a386c753-9f55-4429-b2c9-251d3bff8f58", title: "Ceuta demands EU help over migrant ‘pressure cooker’", date: "2026-09-08", time: "13:08", url: "https://www.ft.com/content/a386c753-9f55-4429-b2c9-251d3bff8f58" },
  { id: "dda770b2-79b4-48bb-b141-0e1291d08115", title: "The new fiscal threats to monetary policy", date: "2026-09-08", time: "12:30", url: "https://www.ft.com/content/dda770b2-79b4-48bb-b141-0e1291d08115" },
  { id: "4320e779-73ab-4e56-ad13-9d5e9aa48b3c", title: "The yawning gap between ambition and action on nuclear energy", date: "2026-09-08", time: "12:00", url: "https://www.ft.com/content/4320e779-73ab-4e56-ad13-9d5e9aa48b3c" },
  { id: "53d6b648-ea21-43a9-ba89-f1102462ff9b", title: "Innovation is the answer to Britain’s elusive growth problem", date: "2026-09-08", time: "11:41", url: "https://www.ft.com/content/53d6b648-ea21-43a9-ba89-f1102462ff9b" },
  { id: "359e9dac-cc19-4a93-8155-3d087adf4103", title: "John Healey faces MPs as pressure on UK public finances mounts", date: "2026-09-08", time: "11:24", url: "https://www.ft.com/content/359e9dac-cc19-4a93-8155-3d087adf4103" },
  { id: "e8273e59-36e9-42a0-a7f0-8df556480c75", title: "Europe battles to catch US and China in space race", date: "2026-09-08", time: "11:21", url: "https://www.ft.com/content/e8273e59-36e9-42a0-a7f0-8df556480c75" },
  { id: "a5092cb2-1625-47b8-b0b2-7bafefdd05da", title: "Sales of ‘Made in EU’ counterfeit cigarettes surge in Europe", date: "2026-09-08", time: "11:00", url: "https://www.ft.com/content/a5092cb2-1625-47b8-b0b2-7bafefdd05da" },
  { id: "3892b29e-f905-4082-9a2c-4969970d3d35", title: "Liberty Global agrees €670mn towers sale ahead of Ziggo spinoff", date: "2026-09-08", time: "10:55", url: "https://www.ft.com/content/3892b29e-f905-4082-9a2c-4969970d3d35" },
  { id: "b23151c3-b4c1-4f96-a801-f3507d907cc7", title: "UK pays highest borrowing cost since 1998 at gilt sale", date: "2026-09-08", time: "10:50", url: "https://www.ft.com/content/b23151c3-b4c1-4f96-a801-f3507d907cc7" },
  { id: "dc6c9fe1-c400-490a-a4fe-8b3d5cf3334a", title: "FirstFT: Top credit rating sought for Anthropic and OpenAI", date: "2026-09-08", time: "10:48", url: "https://www.ft.com/content/dc6c9fe1-c400-490a-a4fe-8b3d5cf3334a" },
  { id: "d9bc67e2-97f4-47ef-8de5-1ae48d841018", title: "Wave of Houthi strikes halts work at energy facilities in four Saudi cities", date: "2026-09-08", time: "09:48", url: "https://www.ft.com/content/d9bc67e2-97f4-47ef-8de5-1ae48d841018" },
  { id: "10717d24-c247-4522-b6d6-6e4ea0947cc3", title: "The political challenge of Britain’s mounting debt costs", date: "2026-09-08", time: "09:38", url: "https://www.ft.com/content/10717d24-c247-4522-b6d6-6e4ea0947cc3" },
  { id: "1f71d2d0-d2e2-46da-a96f-99d20936223e", title: "UK set to announce trade ban on Israeli settlements in West Bank", date: "2026-09-08", time: "09:35", url: "https://www.ft.com/content/1f71d2d0-d2e2-46da-a96f-99d20936223e" },
  { id: "98d06e87-83f0-45dc-b69b-418fc789ac96", title: "The complicated implications of the spectacular ‘Apollo premium’", date: "2026-09-08", time: "09:22", url: "https://www.ft.com/content/98d06e87-83f0-45dc-b69b-418fc789ac96" },
  { id: "b5cb6500-89be-42a4-a417-e0d252e5e0e8", title: "DWS embraces Deutsche Bank name eight years after distancing itself", date: "2026-09-08", time: "09:21", url: "https://www.ft.com/content/b5cb6500-89be-42a4-a417-e0d252e5e0e8" },
  { id: "be7c3d20-4e4f-4a73-8927-cc5a4d6cccca", title: "July wage data bolsters case for BoJ tightening this month", date: "2026-09-08", time: "09:18", url: "https://www.ft.com/content/be7c3d20-4e4f-4a73-8927-cc5a4d6cccca" },
  { id: "f06ee0ea-adcf-44ec-80c9-bb616885d8de", title: "Singapore raises PM Lawrence Wong’s pay by $1mn", date: "2026-09-08", time: "08:29", url: "https://www.ft.com/content/f06ee0ea-adcf-44ec-80c9-bb616885d8de" },
  { id: "0815cd34-bf4c-4771-8bf5-710eff286763", title: "Russia launches missile strikes against Kyiv as pause in raids ends", date: "2026-09-08", time: "07:46", url: "https://www.ft.com/content/0815cd34-bf4c-4771-8bf5-710eff286763" },
  { id: "5cc2d577-0418-4728-8657-aa6b2efb6597", title: "The strangely disappointing EM inflows", date: "2026-09-08", time: "06:30", url: "https://www.ft.com/content/5cc2d577-0418-4728-8657-aa6b2efb6597" },
  { id: "e7f51e7c-d272-436f-b918-3de002bf85d9", title: "FTAV’s further reading", date: "2026-09-08", time: "06:30", url: "https://www.ft.com/content/e7f51e7c-d272-436f-b918-3de002bf85d9" },
  { id: "56bcc2fb-99eb-4ad9-af67-101c8d0382cb", title: "China’s 25% export surge sets stage for record annual trade surplus", date: "2026-09-08", time: "06:15", url: "https://www.ft.com/content/56bcc2fb-99eb-4ad9-af67-101c8d0382cb" },
  { id: "e38fbc18-f0aa-4d0b-84ca-4b8a2dcf419a", title: "Antitrust not the enemy of industrial policy, says EU competition enforcer", date: "2026-09-08", time: "06:00", url: "https://www.ft.com/content/e38fbc18-f0aa-4d0b-84ca-4b8a2dcf419a" },
  { id: "adbf5262-c4d5-4312-a9b8-4d3cf30c9e00", title: "Mistral raises record €3bn as Europe strains to keep pace in AI race", date: "2026-09-08", time: "06:00", url: "https://www.ft.com/content/adbf5262-c4d5-4312-a9b8-4d3cf30c9e00" },
  { id: "22792fd1-e089-4e56-9ece-171c56ffe422", title: "Labour’s muddled migration policy won’t stop thuggery", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/22792fd1-e089-4e56-9ece-171c56ffe422" },
  { id: "ed214778-2a6d-4862-99b5-abc256daff92", title: "AI is ushering in an era of mass toe-treading at work", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/ed214778-2a6d-4862-99b5-abc256daff92" },
  { id: "c6517e52-b855-487c-8408-7071936cf3b0", title: "Global shipping rules are collapsing, say maritime nations", date: "2026-09-08", time: "05:00", url: "https://www.ft.com/content/c6517e52-b855-487c-8408-7071936cf3b0" },
];
