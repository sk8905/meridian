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
  { id: "2d69802f-cdea-4884-ac53-e20001495ada", title: "Why does it even matter if SoftBank’s an investment holding company?", date: "2026-09-03", time: "08:52", url: "https://www.ft.com/content/2d69802f-cdea-4884-ac53-e20001495ada" },
  { id: "16034441-608c-42de-90ff-1a2b7607fc79", title: "Elliott builds stake in Deutsche Telekom and opposes T-Mobile US merger", date: "2026-09-03", time: "08:24", url: "https://www.ft.com/content/16034441-608c-42de-90ff-1a2b7607fc79" },
  { id: "28676485-9dd8-4c17-8c7b-e062bf50ff7b", title: "Crest Nicholson shares tumble as homebuilder warns of loss", date: "2026-09-03", time: "08:16", url: "https://www.ft.com/content/28676485-9dd8-4c17-8c7b-e062bf50ff7b" },
  { id: "f2f05059-8fbe-47b9-8976-c85bb119bbd0", title: "More on the 60/40 portfolio", date: "2026-09-03", time: "06:30", url: "https://www.ft.com/content/f2f05059-8fbe-47b9-8976-c85bb119bbd0" },
  { id: "70ca0dbc-e9b4-487b-be08-ab7a01c43696", title: "Ireland strives for EU budget breakthrough as December deadline looms", date: "2026-09-03", time: "06:00", url: "https://www.ft.com/content/70ca0dbc-e9b4-487b-be08-ab7a01c43696" },
  { id: "d30b278a-4f73-4d37-932f-43821cb10b82", title: "FTAV’s further reading", date: "2026-09-03", time: "06:00", url: "https://www.ft.com/content/d30b278a-4f73-4d37-932f-43821cb10b82" },
  { id: "22abbb77-1344-4871-9692-97a779b1ba77", title: "Yen strengthens as traders bet on Japan interest rate rises", date: "2026-09-03", time: "05:50", url: "https://www.ft.com/content/22abbb77-1344-4871-9692-97a779b1ba77" },
  { id: "9d4cffdc-4d8b-4a8b-98be-42e17200b122", title: "FirstFT: KPMG warned Guggenheim unit over weak controls", date: "2026-09-03", time: "05:36", url: "https://www.ft.com/content/9d4cffdc-4d8b-4a8b-98be-42e17200b122" },
  { id: "bad69b88-da02-4859-8190-37c55039be75", title: "American sailors roll into Thailand’s Pattaya resort after nine months at sea", date: "2026-09-03", time: "05:04", url: "https://www.ft.com/content/bad69b88-da02-4859-8190-37c55039be75" },
  { id: "3249b384-2a27-402b-be12-e3b3bea37440", title: "Accelerating Business", date: "2026-09-03", time: "05:02", url: "https://www.ft.com/content/3249b384-2a27-402b-be12-e3b3bea37440" },
  { id: "a9d4cdad-c1bf-4bac-be2b-79d152041b76", title: "The new rivalry on Wall Street", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/a9d4cdad-c1bf-4bac-be2b-79d152041b76" },
  { id: "0dac70dc-1098-478d-aa30-cf6c59f86c70", title: "‘Exit tax’ on UK entrepreneurs ruled out by business department", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/0dac70dc-1098-478d-aa30-cf6c59f86c70" },
  { id: "b44fcdbd-4c0e-4032-b81a-98e309991388", title: "VodafoneThree to launch debut TV service in challenge to UK rivals", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/b44fcdbd-4c0e-4032-b81a-98e309991388" },
  { id: "115c886f-23e4-4a8d-9656-5d7fc9480803", title: "Fixing the AI industry’s PR problem", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/115c886f-23e4-4a8d-9656-5d7fc9480803" },
  { id: "589bc3d6-998e-48a9-b863-050fe1044f45", title: "Gold’s run isn’t yet done", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/589bc3d6-998e-48a9-b863-050fe1044f45" },
  { id: "89f06927-5728-4e24-9a28-621869d03392", title: "When is an economist not an economist?", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/89f06927-5728-4e24-9a28-621869d03392" },
  { id: "ba5ad2c0-9220-4a3d-a168-7afd52976b9c", title: "1898 Porter’s House, Ghent — a boutique bolt-hole with just four bedrooms", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/ba5ad2c0-9220-4a3d-a168-7afd52976b9c" },
  { id: "70e8e4e6-def9-4683-9aa3-4bf7351474e4", title: "KPMG warned Guggenheim unit over deficiencies in internal controls", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/70e8e4e6-def9-4683-9aa3-4bf7351474e4" },
  { id: "5948cb6b-b80d-4808-9336-ba56ffa86b4f", title: "The fatal car crash that spurred Vietnamese Gen Z protests", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/5948cb6b-b80d-4808-9336-ba56ffa86b4f" },
  { id: "b6b02edc-980d-45c8-96d1-c4f53cb41daa", title: "Sweden’s election frontrunner vows green reset", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/b6b02edc-980d-45c8-96d1-c4f53cb41daa" },
  { id: "575b676e-6ece-480b-bf0e-901af9471015", title: "For sweltering Britons, rising energy prices could spark a shutter boom", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/575b676e-6ece-480b-bf0e-901af9471015" },
  { id: "a44220ed-f93a-47a6-8a06-9d8eb667c6aa", title: "The Newer World — Sebastian Barry’s novel of the Black American slave experience", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/a44220ed-f93a-47a6-8a06-9d8eb667c6aa" },
  { id: "23b084ea-2737-4f50-bc0a-bf6acc3e4962", title: "‘This is where I exhale’ — the renovation of a Swedish summer house", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/23b084ea-2737-4f50-bc0a-bf6acc3e4962" },
  { id: "0fc8494f-96ad-458a-8f0a-e7e4715c7ea0", title: "Cities on screen: 10 takes on Chicago", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/0fc8494f-96ad-458a-8f0a-e7e4715c7ea0" },
  { id: "6d6339d1-8fb7-4d5d-886f-6c856de42fb7", title: "The mysterious billionaire and Cuba’s cigar industry", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/6d6339d1-8fb7-4d5d-886f-6c856de42fb7" },
  { id: "18e50789-6ba6-4504-a51d-1d1d40ad860d", title: "Is my ex being truthful about their finances?", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/18e50789-6ba6-4504-a51d-1d1d40ad860d" },
  { id: "70fdf5c3-6b3a-494d-a141-85aba60d14d5", title: "VW, Amazon and others name blacklisted groups among potential suppliers", date: "2026-09-03", time: "05:00", url: "https://www.ft.com/content/70fdf5c3-6b3a-494d-a141-85aba60d14d5" },
  { id: "9a1bc3df-4887-4f92-bc7a-8441d4dd2b45", title: "Businessman acquitted in Maltese journalist's murder trial", date: "2026-09-02", time: "21:23", url: "https://www.ft.com/content/9a1bc3df-4887-4f92-bc7a-8441d4dd2b45" },
  { id: "606e5f9d-44b5-4b45-9ecc-59dd8a66fb5a", title: "Burnham moves to protect British farming and steel in EU reset talks", date: "2026-09-02", time: "21:00", url: "https://www.ft.com/content/606e5f9d-44b5-4b45-9ecc-59dd8a66fb5a" },
  { id: "75c3179a-5c42-42fd-94e9-6f0c3dfc0c70", title: "Google spared break-up of online advertising monopoly", date: "2026-09-02", time: "20:53", url: "https://www.ft.com/content/75c3179a-5c42-42fd-94e9-6f0c3dfc0c70" },
  { id: "d5d6e4c9-718a-4d98-b094-97157565f336", title: "Trump administration backs OpenAI in New York Times copyright battle", date: "2026-09-02", time: "19:44", url: "https://www.ft.com/content/d5d6e4c9-718a-4d98-b094-97157565f336" },
  { id: "c9390b8a-a453-4014-a5a8-13f8fd518356", title: "Badenoch takes on Burnham after shake-up of her top team", date: "2026-09-02", time: "19:09", url: "https://www.ft.com/content/c9390b8a-a453-4014-a5a8-13f8fd518356" },
  { id: "1749e753-9c90-4ff5-91ec-8df764f3b26d", title: "Dutch central bank moves gold bars out of New York over 'geopolitical unrest'", date: "2026-09-02", time: "18:23", url: "https://www.ft.com/content/1749e753-9c90-4ff5-91ec-8df764f3b26d" },
  { id: "1e55d948-98e5-4c1a-8a09-51e1311fcf63", title: "EU accelerates plans to break up diplomatic service", date: "2026-09-02", time: "18:22", url: "https://www.ft.com/content/1e55d948-98e5-4c1a-8a09-51e1311fcf63" },
  { id: "1fef1e44-2a79-4057-89e5-33417e5a7763", title: "The wrong way to revive Venezuela's economy", date: "2026-09-02", time: "18:22", url: "https://www.ft.com/content/1fef1e44-2a79-4057-89e5-33417e5a7763" },
  { id: "b71bfe10-29a0-4213-92a2-22765c44c190", title: "BP gets the chair it wants rather than the one it needed", date: "2026-09-02", time: "17:49", url: "https://www.ft.com/content/b71bfe10-29a0-4213-92a2-22765c44c190" },
  { id: "5040d26d-520c-455f-a1e8-111d011acdb6", title: "California opines on who profits from wildfires but not on who pays", date: "2026-09-02", time: "17:45", url: "https://www.ft.com/content/5040d26d-520c-455f-a1e8-111d011acdb6" },
  { id: "3d2590e0-b166-494e-ab6b-e6c20c75c59e", title: "The Restore Britain backer who once gave money to the Lib Dems", date: "2026-09-02", time: "17:30", url: "https://www.ft.com/content/3d2590e0-b166-494e-ab6b-e6c20c75c59e" },
  { id: "c4f84da3-bfc6-49a0-90bd-9a1611864ac4", title: "AI spots cyber gaps faster than financial firms can fix them", date: "2026-09-02", time: "17:25", url: "https://www.ft.com/content/c4f84da3-bfc6-49a0-90bd-9a1611864ac4" },
  { id: "c9c3a0ef-98d5-4aeb-9d20-e6250d6fcf99", title: "Students and opposition activists targeted with spyware in Serbia", date: "2026-09-02", time: "16:48", url: "https://www.ft.com/content/c9c3a0ef-98d5-4aeb-9d20-e6250d6fcf99" },
  { id: "9fa4fcb7-14f0-4461-87aa-4fbdf1fe64f4", title: "UK mortgage borrowers urged to lock in deals before rates rise", date: "2026-09-02", time: "16:42", url: "https://www.ft.com/content/9fa4fcb7-14f0-4461-87aa-4fbdf1fe64f4" },
  { id: "5b8f840e-f47c-452a-a99b-a79044ddf7c7", title: "Tory attempts to repeal the UK Climate Act are tin-eared", date: "2026-09-02", time: "16:27", url: "https://www.ft.com/content/5b8f840e-f47c-452a-a99b-a79044ddf7c7" },
];
