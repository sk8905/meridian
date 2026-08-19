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
  { id: "032f5586-b958-41b3-a21e-6799269bd589", title: "Sweden’s EQT buys Australian rugby league club in first sports foray", date: "2026-08-19", time: "09:00", url: "https://www.ft.com/content/032f5586-b958-41b3-a21e-6799269bd589" },
  { id: "a888e3d8-e0c3-40ea-96fb-cd3e22e9e6d1", title: "July inflation keeps BoE on course to hold rates in September", date: "2026-08-19", time: "08:20", url: "https://www.ft.com/content/a888e3d8-e0c3-40ea-96fb-cd3e22e9e6d1" },
  { id: "bba9ad75-bc9c-4ca3-af41-77e6714fdce1", title: "Chinese automaker Chery to open UK R&D centre", date: "2026-08-19", time: "07:00", url: "https://www.ft.com/content/bba9ad75-bc9c-4ca3-af41-77e6714fdce1" },
  { id: "5a606279-3473-4c5b-a16e-ad9db6debafb", title: "UK inflation accelerated to 2.9% in July amid Middle East energy shock", date: "2026-08-19", time: "07:02", url: "https://www.ft.com/content/5a606279-3473-4c5b-a16e-ad9db6debafb" },
  { id: "b2d9e5a2-22ce-4267-98b0-62ab78906509", title: "FirstFT: Iran weighs Europe strikes if US restarts war", date: "2026-08-19", time: "07:01", url: "https://www.ft.com/content/b2d9e5a2-22ce-4267-98b0-62ab78906509" },
  { id: "14cd8246-7fb1-4f8f-81b4-8de11ced79e5", title: "Chinese humanoid robot maker surges 600% in trading debut", date: "2026-08-19", time: "06:37", url: "https://www.ft.com/content/14cd8246-7fb1-4f8f-81b4-8de11ced79e5" },
  { id: "8f896be1-dd04-4476-ae70-8d67a6627ccd", title: "The defence stocks aren’t defensive", date: "2026-08-19", time: "06:30", url: "https://www.ft.com/content/8f896be1-dd04-4476-ae70-8d67a6627ccd" },
  { id: "7775e64c-10aa-41bc-b670-c895e0bd3a41", title: "FTAV’s further reading", date: "2026-08-19", time: "06:30", url: "https://www.ft.com/content/7775e64c-10aa-41bc-b670-c895e0bd3a41" },
  { id: "6b62e9fb-d2e4-4739-9b71-8771d7e36a2d", title: "Singapore unveils tax cuts for asset managers amid global talent tussle", date: "2026-08-19", time: "06:07", url: "https://www.ft.com/content/6b62e9fb-d2e4-4739-9b71-8771d7e36a2d" },
  { id: "fe3a8ce6-e348-4588-aba0-bb88650f87b9", title: "Craig Wright, academic publishing phenomenon", date: "2026-08-19", time: "06:00", url: "https://www.ft.com/content/fe3a8ce6-e348-4588-aba0-bb88650f87b9" },
  { id: "41c9e4c9-4d02-4ad5-b31f-afef9cd0346e", title: "Venomous sea creatures plague Europe’s warming beaches", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/41c9e4c9-4d02-4ad5-b31f-afef9cd0346e" },
  { id: "de2449f0-c6be-42df-9650-b61a42547651", title: "What high streets can learn from the success of retail parks", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/de2449f0-c6be-42df-9650-b61a42547651" },
  { id: "ade8f80e-a5aa-4696-a6ca-40865c77229f", title: "Private credit’s mounting strains", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/ade8f80e-a5aa-4696-a6ca-40865c77229f" },
  { id: "9ea0cde8-129e-4d88-976f-e367b7dd4d2c", title: "Iran eyes military targets in Europe if Donald Trump escalates war, insiders say", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/9ea0cde8-129e-4d88-976f-e367b7dd4d2c" },
  { id: "117e3a76-0b5c-4e99-a6da-3421cb8d5da7", title: "Why Britain needs a Messi budget", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/117e3a76-0b5c-4e99-a6da-3421cb8d5da7" },
  { id: "82bf560f-7803-41e7-9391-95c42b42e3b4", title: "Why the story of the Vegetable Lamb was believed", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/82bf560f-7803-41e7-9391-95c42b42e3b4" },
  { id: "6af7701e-a9ab-4a9f-bb67-ca7ab8f78fff", title: "Can Mexicans be weaned off an addiction to cash?", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/6af7701e-a9ab-4a9f-bb67-ca7ab8f78fff" },
  { id: "a1e7a6e3-f7b9-4ed4-a823-b5e6274aab9b", title: "Revolut to let Nik Storonsky borrow up to $250mn against his stake", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/a1e7a6e3-f7b9-4ed4-a823-b5e6274aab9b" },
  { id: "fb585c9d-5dc8-4beb-99a1-fb2c843ecd5a", title: "‘Manchesterism’ must honour the city’s global outlook", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/fb585c9d-5dc8-4beb-99a1-fb2c843ecd5a" },
  { id: "1c4adb24-3e01-4548-93e2-e13f175b3c92", title: "Are ‘dodgy’ vape shops choking Britain’s high streets?", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/1c4adb24-3e01-4548-93e2-e13f175b3c92" },
  { id: "51d68f38-df09-4f78-bb80-02a4b4684235", title: "Venezuela abandons Nicolás Maduro to fate in US jail", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/51d68f38-df09-4f78-bb80-02a4b4684235" },
  { id: "ec2e966d-a281-42a2-9ceb-b14b3be2f4d0", title: "The key inflation signal for investors", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/ec2e966d-a281-42a2-9ceb-b14b3be2f4d0" },
  { id: "72bd7b70-1dcb-4b29-8c16-fe0a820c1379", title: "Clean energy booms under Donald Trump despite effort to undercut renewables", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/72bd7b70-1dcb-4b29-8c16-fe0a820c1379" },
  { id: "a2e965ee-31be-40ad-ab13-75861b6df838", title: "Global food security may be collateral in Ukraine war", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/a2e965ee-31be-40ad-ab13-75861b6df838" },
  { id: "59ed10fc-0e58-454c-9f93-d4d258ccfd9c", title: "America’s brands lose their magic", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/59ed10fc-0e58-454c-9f93-d4d258ccfd9c" },
  { id: "07b8f94d-5705-47f3-aacf-52829681b8f8", title: "Mussolini’s Ghost — the strange, lasting legacy of Il Duce", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/07b8f94d-5705-47f3-aacf-52829681b8f8" },
  { id: "34a99573-0fa1-422b-9263-147f9ed7be6c", title: "Remigration binds Maga to Europe’s far right", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/34a99573-0fa1-422b-9263-147f9ed7be6c" },
  { id: "17625ee5-4bcc-4ef4-aec8-6e4b513e223a", title: "Kazakh tenge soars as foreigners pile into government debt", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/17625ee5-4bcc-4ef4-aec8-6e4b513e223a" },
  { id: "739b7e0a-01e0-4798-966d-f1d60e62647b", title: "BlackRock and Oaktree take keys of top supplier to Hollywood studios", date: "2026-08-19", time: "05:00", url: "https://www.ft.com/content/739b7e0a-01e0-4798-966d-f1d60e62647b" },
  { id: "8a5cd515-191d-42f9-9b0c-1b817a1bc044", title: "Soaring diesel prices rip across US economy", date: "2026-08-18", time: "20:33", url: "https://www.ft.com/content/8a5cd515-191d-42f9-9b0c-1b817a1bc044" },
  { id: "9f640f97-75bf-4ce6-8fcd-35ce1594a88d", title: "BHP’s copper pivot is paying off", date: "2026-08-18", time: "19:03", url: "https://www.ft.com/content/9f640f97-75bf-4ce6-8fcd-35ce1594a88d" },
  { id: "b1042a5b-23b6-49c6-a5b3-c36db59703e8", title: "Barbie box office smash isn’t yet a boon for Mattel", date: "2026-08-18", time: "19:02", url: "https://www.ft.com/content/b1042a5b-23b6-49c6-a5b3-c36db59703e8" },
  { id: "ca2a00fc-5af0-49c1-aae9-8a04c546a836", title: "Can Burnham save Britain’s high streets?", date: "2026-08-18", time: "18:14", url: "https://www.ft.com/content/ca2a00fc-5af0-49c1-aae9-8a04c546a836" },
  { id: "90c16b57-5ea6-4cce-b4d5-5f537a79da47", title: "Israeli strikes on Syrian air base criticised by US and Turkey", date: "2026-08-18", time: "17:20", url: "https://www.ft.com/content/90c16b57-5ea6-4cce-b4d5-5f537a79da47" },
  { id: "a5b733dd-b369-489e-877d-6b16f6d5aa27", title: "Andy Burnham hails shake-up of bus services in West Midlands", date: "2026-08-18", time: "16:49", url: "https://www.ft.com/content/a5b733dd-b369-489e-877d-6b16f6d5aa27" },
  { id: "f30010b5-a702-4fdd-914e-44c69d37814a", title: "Signature Group founder banned as company director for five years", date: "2026-08-18", time: "14:19", url: "https://www.ft.com/content/f30010b5-a702-4fdd-914e-44c69d37814a" },
  { id: "c61e12bb-2ff1-4862-9217-38bdada90ecc", title: "Disney sues Trump administration over ‘retaliatory’ ABC licence review", date: "2026-08-18", time: "14:13", url: "https://www.ft.com/content/c61e12bb-2ff1-4862-9217-38bdada90ecc" },
  { id: "09e23587-1b06-45b3-ad19-1e5d1ec9d7de", title: "Canada makes final attempt to avoid US tariffs on $20bn of goods", date: "2026-08-18", time: "14:00", url: "https://www.ft.com/content/09e23587-1b06-45b3-ad19-1e5d1ec9d7de" },
  { id: "01165fdb-4957-45de-b612-85fac4836220", title: "Here’s Apollo’s big First Brands short presentation", date: "2026-08-18", time: "13:55", url: "https://www.ft.com/content/01165fdb-4957-45de-b612-85fac4836220" },
  { id: "811850d2-01c9-4ea5-8af8-86b22c41a284", title: "Klarna overhauls leadership as it targets US banking licence", date: "2026-08-18", time: "13:54", url: "https://www.ft.com/content/811850d2-01c9-4ea5-8af8-86b22c41a284" },
];
