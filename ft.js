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
  {
    id: "1babfbe0-f50e-4be8-8f2b-d93fdd472f8f",
    title: "UK universities withdraw offers from international students to avoid blanket ban",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/1babfbe0-f50e-4be8-8f2b-d93fdd472f8f",
  },
  {
    id: "59ce3c26-55d2-4b54-bf00-34104ed67be7",
    title: "The narrow Tory path to power",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/59ce3c26-55d2-4b54-bf00-34104ed67be7",
  },
  {
    id: "4e4ea744-6603-499b-baf7-83c74e4dc53e",
    title: "Russia targets Ukraine’s bridges as Vladimir Putin expands air war",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/4e4ea744-6603-499b-baf7-83c74e4dc53e",
  },
  {
    id: "3e0c76d3-885b-4945-b374-1477f141418c",
    title: "Caribbean cruises are going cheap, and so are operators’ shares",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/3e0c76d3-885b-4945-b374-1477f141418c",
  },
  {
    id: "a7532546-d9b2-4889-b2a6-ff68658a1782",
    title: "Slowing deals are another flashing red sign for equity markets",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/a7532546-d9b2-4889-b2a6-ff68658a1782",
  },
  {
    id: "08e41a4a-425b-4fcd-98e6-e2283faed94b",
    title: "Demand for tracker mortgages jumps as rates on fixed deals rise",
    date: "2026-10-10",
    time: "05:00",
    url: "https://www.ft.com/content/08e41a4a-425b-4fcd-98e6-e2283faed94b",
  },
  {
    id: "84583bb0-dbd7-4623-851c-1f9381dfe280",
    title: "Northern Ireland’s Drumcree parade banned",
    date: "2026-10-10",
    time: "00:05",
    url: "https://www.ft.com/content/84583bb0-dbd7-4623-851c-1f9381dfe280",
  },
  {
    id: "c3d9f370-153e-4846-aded-fbb7d200b365",
    title: "JD Vance says he will not watch Pentagon’s livestreamed execution",
    date: "2026-10-09",
    time: "23:18",
    url: "https://www.ft.com/content/c3d9f370-153e-4846-aded-fbb7d200b365",
  },
  {
    id: "84ca76fd-0eed-4fb6-aea4-f72638a9d9c8",
    title: "Trump agrees deal with Putin for Russia to release diesel on to global market",
    date: "2026-10-09",
    time: "23:06",
    url: "https://www.ft.com/content/84ca76fd-0eed-4fb6-aea4-f72638a9d9c8",
  },
  {
    id: "58e684a0-b8ed-4d7a-a2d6-6bf739cb2fa2",
    title: "Why OpenAI’s revenue numbers really matter",
    date: "2026-10-09",
    time: "22:48",
    url: "https://www.ft.com/content/58e684a0-b8ed-4d7a-a2d6-6bf739cb2fa2",
  },
  {
    id: "62653892-2333-4953-a8d5-cfd760ae3257",
    title: "The hazy OpenAI growth metric driving Wall Street",
    date: "2026-10-09",
    time: "21:57",
    url: "https://www.ft.com/content/62653892-2333-4953-a8d5-cfd760ae3257",
  },
  {
    id: "77d73223-3cfc-4892-a3c5-5502595f42d4",
    title: "Delta slashes profit outlook as higher fuel prices bite",
    date: "2026-10-09",
    time: "21:31",
    url: "https://www.ft.com/content/77d73223-3cfc-4892-a3c5-5502595f42d4",
  },
  {
    id: "c3d9f370-153e-4846-aded-fbb7d200b365",
    title: "JD Vance casts doubt on Pentagon’s plan to livestream execution",
    date: "2026-10-09",
    time: "21:29",
    url: "https://www.ft.com/content/c3d9f370-153e-4846-aded-fbb7d200b365",
  },
  {
    id: "847e6d14-08e4-4477-8722-40bd7162b992",
    title: "Airlines sound the alarm as bleak winter looms",
    date: "2026-10-09",
    time: "21:00",
    url: "https://www.ft.com/content/847e6d14-08e4-4477-8722-40bd7162b992",
  },
  {
    id: "84ca76fd-0eed-4fb6-aea4-f72638a9d9c8",
    title: "Trump agrees deal with Putin for Russia to release diesel on to global market",
    date: "2026-10-09",
    time: "20:01",
    url: "https://www.ft.com/content/84ca76fd-0eed-4fb6-aea4-f72638a9d9c8",
  },
  {
    id: "f7d90625-0d78-44b2-927f-d63f4dbc5e8d",
    title: "Oil and gas production disrupted as Hurricane Isaias barrels towards Gulf",
    date: "2026-10-09",
    time: "19:38",
    url: "https://www.ft.com/content/f7d90625-0d78-44b2-927f-d63f4dbc5e8d",
  },
  {
    id: "9496dd1d-fabf-4c58-bbc3-88cb51f2a68d",
    title: "Scott Bessent to miss IMF annual meetings in Bangkok",
    date: "2026-10-09",
    time: "19:22",
    url: "https://www.ft.com/content/9496dd1d-fabf-4c58-bbc3-88cb51f2a68d",
  },
  {
    id: "af3454c2-c425-4d4f-bac9-3e073bbfc1a7",
    title: "The remarkable resilience of the global economy",
    date: "2026-10-09",
    time: "18:39",
    url: "https://www.ft.com/content/af3454c2-c425-4d4f-bac9-3e073bbfc1a7",
  },
  {
    id: "dda61be8-88bd-4ebc-bde5-ba440308d518",
    title: "Donald Trump pressures Mexico for energy deals in crunch trade talks",
    date: "2026-10-09",
    time: "18:29",
    url: "https://www.ft.com/content/dda61be8-88bd-4ebc-bde5-ba440308d518",
  },
  {
    id: "873b1b9c-5e5c-4f34-9b96-6250ffd26783",
    title: "Stockpickers: Avingtrans, Tesco, JD Wetherspoon",
    date: "2026-10-09",
    time: "18:00",
    url: "https://www.ft.com/content/873b1b9c-5e5c-4f34-9b96-6250ffd26783",
  },
  {
    id: "543a0c0d-f893-407e-b9bc-55e2d91dca40",
    title: "Directors’ Deals: CMC directors buy in as choppy markets boost trading",
    date: "2026-10-09",
    time: "18:00",
    url: "https://www.ft.com/content/543a0c0d-f893-407e-b9bc-55e2d91dca40",
  },
  {
    id: "88485f17-cb90-46cc-a302-6c87b29622c1",
    title: "The wisdom of prediction markets",
    date: "2026-10-09",
    time: "18:00",
    url: "https://www.ft.com/content/88485f17-cb90-46cc-a302-6c87b29622c1",
  },
  {
    id: "f2d13ed9-1b80-4e76-a4c7-de29cbbe858c",
    title: "Has Polanski blown it for the Greens?",
    date: "2026-10-09",
    time: "17:56",
    url: "https://www.ft.com/content/f2d13ed9-1b80-4e76-a4c7-de29cbbe858c",
  },
  {
    id: "b35a575d-ff53-4580-8946-9054d7aeb388",
    title: "Get used to multi-party politics, it’s here to stay",
    date: "2026-10-09",
    time: "17:50",
    url: "https://www.ft.com/content/b35a575d-ff53-4580-8946-9054d7aeb388",
  },
  {
    id: "39f9b46f-b7ee-43b6-b377-6e47aa1af9a1",
    title: "EU leads fight against fossil-fuel nations’ push to delay climate science reports",
    date: "2026-10-09",
    time: "17:32",
    url: "https://www.ft.com/content/39f9b46f-b7ee-43b6-b377-6e47aa1af9a1",
  },
  {
    id: "39764d10-6b87-4103-8e7d-290a72a5ea5a",
    title: "Trump and Hegseth’s execution-type deal",
    date: "2026-10-09",
    time: "17:18",
    url: "https://www.ft.com/content/39764d10-6b87-4103-8e7d-290a72a5ea5a",
  },
  {
    id: "b6e6542f-045b-4a38-9fb9-6857b7d1fee3",
    title: "Battle for the soul of the Green Party",
    date: "2026-10-09",
    time: "17:14",
    url: "https://www.ft.com/content/b6e6542f-045b-4a38-9fb9-6857b7d1fee3",
  },
  {
    id: "ffb13044-216b-4b31-885c-cda9c78cbfdb",
    title: "EU to explore windfall tax on energy companies",
    date: "2026-10-09",
    time: "17:05",
    url: "https://www.ft.com/content/ffb13044-216b-4b31-885c-cda9c78cbfdb",
  },
  {
    id: "d57c427a-2625-4297-bd29-01aac0d69e2f",
    title: "Flávio Bolsonaro, scion of a Brazilian political dynasty now eyeing victory",
    date: "2026-10-09",
    time: "17:00",
    url: "https://www.ft.com/content/d57c427a-2625-4297-bd29-01aac0d69e2f",
  },
  {
    id: "4d5757e9-78b5-42f6-b26b-d9556321c0c8",
    title: "US announces sanctions campaign to ‘end’ ICC",
    date: "2026-10-09",
    time: "16:50",
    url: "https://www.ft.com/content/4d5757e9-78b5-42f6-b26b-d9556321c0c8",
  },
  {
    id: "9ce4df82-5ba4-42a5-9935-f21b6d6d5ce4",
    title: "A very German spy scandal",
    date: "2026-10-09",
    time: "16:19",
    url: "https://www.ft.com/content/9ce4df82-5ba4-42a5-9935-f21b6d6d5ce4",
  },
  {
    id: "83b817d5-df71-41a6-bef5-3db55a3a89cf",
    title: "Iran attacks tankers beyond Strait of Hormuz",
    date: "2026-10-09",
    time: "16:10",
    url: "https://www.ft.com/content/83b817d5-df71-41a6-bef5-3db55a3a89cf",
  },
  {
    id: "d0c81cd2-f944-46b9-a859-abc3f0bd3516",
    title: "Donald Trump launches committee to investigate Fed governor Lisa Cook",
    date: "2026-10-09",
    time: "16:08",
    url: "https://www.ft.com/content/d0c81cd2-f944-46b9-a859-abc3f0bd3516",
  },
  {
    id: "8354b63b-44ae-4aef-9c6b-5cef1f9bb001",
    title: "Germany pivots away from ECB presidency push",
    date: "2026-10-09",
    time: "16:07",
    url: "https://www.ft.com/content/8354b63b-44ae-4aef-9c6b-5cef1f9bb001",
  },
  {
    id: "8c3f95ec-2428-4102-9f67-b707f1264c69",
    title: "US telcos shed $45bn in value after SpaceX announces spectrum purchase",
    date: "2026-10-09",
    time: "15:37",
    url: "https://www.ft.com/content/8c3f95ec-2428-4102-9f67-b707f1264c69",
  },
  {
    id: "523fa1fa-0764-47d6-907b-4f72bd4a6cc0",
    title: "Lib Dem MP launches attempt to topple leader Ed Davey",
    date: "2026-10-09",
    time: "14:25",
    url: "https://www.ft.com/content/523fa1fa-0764-47d6-907b-4f72bd4a6cc0",
  },
  {
    id: "2823ef6f-b3d7-494b-b131-414c02d6a59f",
    title: "China and EU reach ‘understanding’ on hybrid cars, Beijing says",
    date: "2026-10-09",
    time: "14:11",
    url: "https://www.ft.com/content/2823ef6f-b3d7-494b-b131-414c02d6a59f",
  },
  {
    id: "0a39fcdb-860c-4739-8454-21fb429f6336",
    title: "Submit your questions: who’s doing better in their trade battles with China — the EU or the US?",
    date: "2026-10-09",
    time: "14:04",
    url: "https://www.ft.com/content/0a39fcdb-860c-4739-8454-21fb429f6336",
  },
  {
    id: "ee329e29-aec9-4876-829e-022683f425f8",
    title: "How to shield your portfolio if AI goes ka-boom",
    date: "2026-10-09",
    time: "14:00",
    url: "https://www.ft.com/content/ee329e29-aec9-4876-829e-022683f425f8",
  },
  {
    id: "3c8d6ab0-595f-4121-9901-a784be75bb09",
    title: "Rubio and the will to power",
    date: "2026-10-09",
    time: "14:00",
    url: "https://www.ft.com/content/3c8d6ab0-595f-4121-9901-a784be75bb09",
  },
];
