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
  { id: "22534413-a23e-4ecb-b68f-c9f1105c8953", title: "Bob Iger and Josh Kushner in $12bn deal for Lakers basketball franchise", date: "2026-08-12", time: "15:59", url: "https://www.ft.com/content/22534413-a23e-4ecb-b68f-c9f1105c8953" },
  { id: "813b7646-3d3d-4f38-9b02-3c1fc564dc30", title: "Poor numeracy is a blind spot in the age of AI", date: "2026-08-12", time: "15:58", url: "https://www.ft.com/content/813b7646-3d3d-4f38-9b02-3c1fc564dc30" },
  { id: "422010c3-ac6e-427f-88cf-e6c878b96637", title: "Investor Nelson Peltz prepares bid for US burger chain Wendy’s", date: "2026-08-12", time: "15:49", url: "https://www.ft.com/content/422010c3-ac6e-427f-88cf-e6c878b96637" },
  { id: "c14d737a-a148-49da-8cb5-ba223c8a9fc5", title: "Greenland oil wildcatters delay controversial drilling plan", date: "2026-08-12", time: "15:33", url: "https://www.ft.com/content/c14d737a-a148-49da-8cb5-ba223c8a9fc5" },
  { id: "a44e8854-3f42-46bb-81e3-613dea89b802", title: "Smile, you're on camera: when the boss wants to read your mood", date: "2026-08-12", time: "15:07", url: "https://www.ft.com/content/a44e8854-3f42-46bb-81e3-613dea89b802" },
  { id: "d76aabd7-55a1-43d8-b87a-0f812815a28a", title: "July inflation decline does not mean Fed's September rise is off the table", date: "2026-08-12", time: "15:02", url: "https://www.ft.com/content/d76aabd7-55a1-43d8-b87a-0f812815a28a" },
  { id: "17de7308-9e97-405a-ab5e-9b0dddab36b4", title: "Vestas shares soar as wind turbine orders bounce back", date: "2026-08-12", time: "14:48", url: "https://www.ft.com/content/17de7308-9e97-405a-ab5e-9b0dddab36b4" },
  { id: "0a4794fa-7112-436f-a311-9077fcba14b8", title: "America's largest home lender falls out of the hamster wheel", date: "2026-08-12", time: "14:44", url: "https://www.ft.com/content/0a4794fa-7112-436f-a311-9077fcba14b8" },
  { id: "5924d083-b5a4-4f95-8c2d-400f2b914159", title: "The west has given China the keys to the medicine cabinet", date: "2026-08-12", time: "14:00", url: "https://www.ft.com/content/5924d083-b5a4-4f95-8c2d-400f2b914159" },
  { id: "ca40af31-2446-45e7-8e6a-7554d759a6ca", title: "Goldman Sachs to acquire ETF provider Neos for up to $2.3bn", date: "2026-08-12", time: "13:34", url: "https://www.ft.com/content/ca40af31-2446-45e7-8e6a-7554d759a6ca" },
  { id: "52727749-4360-4463-8822-dc3bfd8ef279", title: "US inflation falls to 3.4% in July", date: "2026-08-12", time: "13:33", url: "https://www.ft.com/content/52727749-4360-4463-8822-dc3bfd8ef279" },
  { id: "dc0d5a3f-8bcc-483e-8787-18fd27ddab3f", title: "Scottish North Sea tax revenues drop, fuelling debate on oil and gas industry’s future", date: "2026-08-12", time: "13:11", url: "https://www.ft.com/content/dc0d5a3f-8bcc-483e-8787-18fd27ddab3f" },
  { id: "de0e971c-0223-4d52-9f52-b703ef5ac467", title: "Switzerland pushes ahead with post-Credit Suisse crackdown", date: "2026-08-12", time: "13:05", url: "https://www.ft.com/content/de0e971c-0223-4d52-9f52-b703ef5ac467" },
  { id: "c7ac41f1-d755-4024-9101-e206dfbcddd7", title: "India plans to tighten rules on foreign-funded NGOs", date: "2026-08-12", time: "12:44", url: "https://www.ft.com/content/c7ac41f1-d755-4024-9101-e206dfbcddd7" },
  { id: "1b0a8ed9-d55a-49ea-971e-39e01e588632", title: "Why must a socialist also be woke?", date: "2026-08-12", time: "12:30", url: "https://www.ft.com/content/1b0a8ed9-d55a-49ea-971e-39e01e588632" },
  { id: "4469e5f8-1839-45a5-9e1d-b63ea58b8763", title: "How will El Niño hit the world economy?", date: "2026-08-12", time: "12:00", url: "https://www.ft.com/content/4469e5f8-1839-45a5-9e1d-b63ea58b8763" },
  { id: "b93d8030-203b-4445-b4a7-49e52d9b17a5", title: "Who is Anthropic’s auditor — and why should we care?", date: "2026-08-12", time: "12:00", url: "https://www.ft.com/content/b93d8030-203b-4445-b4a7-49e52d9b17a5" },
  { id: "dfa69996-4427-4eef-8c60-a97a562debf5", title: "Colombian earthquake disrupts key coffee export road", date: "2026-08-12", time: "10:53", url: "https://www.ft.com/content/dfa69996-4427-4eef-8c60-a97a562debf5" },
  { id: "14430047-c8b9-4e7b-89db-aed36244ad71", title: "Cambridge to carry out independent probe into Jason Arday appointment", date: "2026-08-12", time: "10:51", url: "https://www.ft.com/content/14430047-c8b9-4e7b-89db-aed36244ad71" },
  { id: "99c86e8e-02d5-4c7c-9eef-27ad9bb5b7c6", title: "Bank of America commits $250bn to support Donald Trump’s ‘America First’ agenda", date: "2026-08-12", time: "10:00", url: "https://www.ft.com/content/99c86e8e-02d5-4c7c-9eef-27ad9bb5b7c6" },
  { id: "c4c5cbb1-4b7c-4d29-b382-b38c494dcecc", title: "Andy Burnham has more to lose from an early election, but we should not rule it out", date: "2026-08-12", time: "09:30", url: "https://www.ft.com/content/c4c5cbb1-4b7c-4d29-b382-b38c494dcecc" },
  { id: "68dcb0e8-a15b-436a-9a57-c4c2abfba2d3", title: "UK power supplies likely to be stretched during solar eclipse", date: "2026-08-12", time: "09:20", url: "https://www.ft.com/content/68dcb0e8-a15b-436a-9a57-c4c2abfba2d3" },
  { id: "c9d5c256-0e93-4978-b312-354cb7bd7487", title: "Andy Burnham to hold emergency Cobra meeting in response to heatwaves", date: "2026-08-12", time: "08:54", url: "https://www.ft.com/content/c9d5c256-0e93-4978-b312-354cb7bd7487" },
  { id: "007b5ff6-e8fe-47f6-ba34-40cd6520e9fd", title: "World prepares for one of nature’s greatest spectacles: a total solar eclipse", date: "2026-08-12", time: "08:17", url: "https://www.ft.com/content/007b5ff6-e8fe-47f6-ba34-40cd6520e9fd" },
  { id: "565bd314-0803-40a2-88b3-9070f574d933", title: "Democratic socialist locked in unexpectedly tight Wisconsin primary race", date: "2026-08-12", time: "07:17", url: "https://www.ft.com/content/565bd314-0803-40a2-88b3-9070f574d933" },
  { id: "57e3a478-f9d5-444f-91ae-12838b1f1929", title: "HSBC’s global head of insurance steps down", date: "2026-08-12", time: "07:13", url: "https://www.ft.com/content/57e3a478-f9d5-444f-91ae-12838b1f1929" },
  { id: "d3c55471-0e3d-4798-8355-2b661880d8b9", title: "Kevin Warsh’s monetary hall of mirrors", date: "2026-08-12", time: "06:30", url: "https://www.ft.com/content/d3c55471-0e3d-4798-8355-2b661880d8b9" },
  { id: "08ef25cc-c51d-457f-84c5-33303c6ed118", title: "FTAV’s further reading", date: "2026-08-12", time: "06:30", url: "https://www.ft.com/content/08ef25cc-c51d-457f-84c5-33303c6ed118" },
  { id: "e0ca4cab-c8ba-47d6-9465-13e2d73285fc", title: "Taiwan hits out at China over naval drill with Indonesia", date: "2026-08-12", time: "06:14", url: "https://www.ft.com/content/e0ca4cab-c8ba-47d6-9465-13e2d73285fc" },
  { id: "acd38b11-0cd7-40c2-a779-e26c95b59048", title: "Business development companies are paying more to borrow. But why?", date: "2026-08-12", time: "06:00", url: "https://www.ft.com/content/acd38b11-0cd7-40c2-a779-e26c95b59048" },
  { id: "7cd5f1c5-1097-4bd4-bd00-8006759da28d", title: "FirstFT: Vance asked Ukraine to halt strikes on tankers", date: "2026-08-12", time: "05:31", url: "https://www.ft.com/content/7cd5f1c5-1097-4bd4-bd00-8006759da28d" },
  { id: "a96c07f8-0b61-4322-b5ef-1ae5b445706f", title: "How AstraZeneca’s $400bn deal unravelled", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/a96c07f8-0b61-4322-b5ef-1ae5b445706f" },
  { id: "56c300d3-3632-476e-96d6-da84d4558bda", title: "Poorer Americans are struggling to make ‘ends meet’, top Fed official says", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/56c300d3-3632-476e-96d6-da84d4558bda" },
  { id: "14b245d4-281a-4a9f-b1a8-a2cb252f4335", title: "Britain needs more investors, not higher taxes on investment", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/14b245d4-281a-4a9f-b1a8-a2cb252f4335" },
  { id: "e16ec916-08ad-4f87-9b62-e42e9f28a59c", title: "How to stop global warming", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/e16ec916-08ad-4f87-9b62-e42e9f28a59c" },
  { id: "13ca1246-faa7-4a0e-8117-439aee14d3d7", title: "Revolut cuts back WeWork access for premium customers after price rises", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/13ca1246-faa7-4a0e-8117-439aee14d3d7" },
  { id: "725b4d15-bd8d-4083-a04e-db016338af2e", title: "JD Vance asked Ukraine to halt strikes on tankers using Russian port", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/725b4d15-bd8d-4083-a04e-db016338af2e" },
  { id: "add47783-31f8-486f-b073-d547aafe6de0", title: "Private equity can score top marks with education deals", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/add47783-31f8-486f-b073-d547aafe6de0" },
  { id: "81275343-db07-430d-9cc3-26fdee31f150", title: "‘Time billionaires’ are hungry for risk — will it be their undoing?", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/81275343-db07-430d-9cc3-26fdee31f150" },
  { id: "a541a8dc-89df-464a-9b9f-fbffcfe7cca1", title: "Reform UK figure previously accompanied the BNP on the campaign trail", date: "2026-08-12", time: "05:00", url: "https://www.ft.com/content/a541a8dc-89df-464a-9b9f-fbffcfe7cca1" },
];
