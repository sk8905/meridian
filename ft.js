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
  { id: "b122bc9f-9f51-46b8-9f42-dba9fb29244c", title: "Everything is awesome", date: "2026-09-07", time: "06:30", url: "https://www.ft.com/content/b122bc9f-9f51-46b8-9f42-dba9fb29244c" },
  { id: "96e09c24-9587-41fc-9824-fb751f61be40", title: "FTAV’s further reading", date: "2026-09-07", time: "06:30", url: "https://www.ft.com/content/96e09c24-9587-41fc-9824-fb751f61be40" },
  { id: "f8e97cdb-6edb-4cb1-ae38-b3c0ceeba485", title: "EU to table ‘Buy European’ public procurement rules to push out China", date: "2026-09-07", time: "06:00", url: "https://www.ft.com/content/f8e97cdb-6edb-4cb1-ae38-b3c0ceeba485" },
  { id: "aa7371f6-5f88-4a14-a5d3-aab04a8a6705", title: "Guggenheim unit warned over internal controls", date: "2026-09-07", time: "06:00", url: "https://www.ft.com/content/aa7371f6-5f88-4a14-a5d3-aab04a8a6705" },
  { id: "b08623a1-a976-4c5f-b247-0935643124fb", title: "Could the DMO take the BoE’s long gilts off their hands?", date: "2026-09-07", time: "06:00", url: "https://www.ft.com/content/b08623a1-a976-4c5f-b247-0935643124fb" },
  { id: "cd0f8ee2-7c47-4b23-b8dc-161d4ac96e2b", title: "Few signs of persistent price pressures in UK and Eurozone", date: "2026-09-07", time: "06:00", url: "https://www.ft.com/content/cd0f8ee2-7c47-4b23-b8dc-161d4ac96e2b" },
  { id: "f1cd277c-fc9b-454f-8eea-596408ebdd2b", title: "FirstFT: Germany’s far-right AfD surges to first place in state elections", date: "2026-09-07", time: "05:31", url: "https://www.ft.com/content/f1cd277c-fc9b-454f-8eea-596408ebdd2b" },
  { id: "8012b60e-c74e-49bc-9200-d37f13b4a135", title: "China pumps $53bn into banks and insurers", date: "2026-09-07", time: "05:21", url: "https://www.ft.com/content/8012b60e-c74e-49bc-9200-d37f13b4a135" },
  { id: "c8b0fa8c-714d-4563-8f3b-545ad56a5da5", title: "Cape Town has the design talent, it just needs more support", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/c8b0fa8c-714d-4563-8f3b-545ad56a5da5" },
  { id: "7c0f6eeb-ed05-4bd5-86e7-ff3b1466e196", title: "Narendra Modi fails to dull gold’s lustre in India", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/7c0f6eeb-ed05-4bd5-86e7-ff3b1466e196" },
  { id: "85960069-75fb-4997-9ff7-9b641ec997cd", title: "Venezuela-US oil deal risks violating local law, say experts", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/85960069-75fb-4997-9ff7-9b641ec997cd" },
  { id: "8827baa7-163d-4122-9ea8-a2c9ff6e8a4d", title: "Why America’s debt binge is starting to matter", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/8827baa7-163d-4122-9ea8-a2c9ff6e8a4d" },
  { id: "99df992e-0c74-41da-a65a-edd895ebc2c3", title: "How Canadian companies are navigating Trump’s tariffs", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/99df992e-0c74-41da-a65a-edd895ebc2c3" },
  { id: "e8eb7c0f-a50e-4c77-b7f0-dfe4cb11dac9", title: "Bonds have become bonds again", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/e8eb7c0f-a50e-4c77-b7f0-dfe4cb11dac9" },
  { id: "4d52d097-a4f0-423e-a483-1dfe60fa6ff3", title: "Concerns raised over ‘tick-box’ staff training as UK employers choose short online courses", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/4d52d097-a4f0-423e-a483-1dfe60fa6ff3" },
  { id: "3fd1541c-7e1f-44c0-bd10-0d94174e5c0a", title: "Trump is putting European security in peril", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/3fd1541c-7e1f-44c0-bd10-0d94174e5c0a" },
  { id: "b2d744cf-de2c-4ef1-84ca-41e897463484", title: "Sweden’s fightback against the gangs", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/b2d744cf-de2c-4ef1-84ca-41e897463484" },
  { id: "8bbc2b5f-d1fc-4d8d-8085-4c27c362653a", title: "John Ternus’s first test at Apple: selling a $2,000 foldable iPhone", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/8bbc2b5f-d1fc-4d8d-8085-4c27c362653a" },
  { id: "4aba032b-f3f4-48c0-8f56-1c7a739e21ae", title: "Tax losses have become a hot property in sports M&A", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/4aba032b-f3f4-48c0-8f56-1c7a739e21ae" },
  { id: "738f043b-9d26-401c-aee6-7a64a257fda2", title: "FNZ: the Credit Suisse spinout haemorrhaging cash", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/738f043b-9d26-401c-aee6-7a64a257fda2" },
  { id: "a5e58e66-25c1-449f-a0bf-ca9a18b67307", title: "The citizen scientists tracking England’s polluted waterways", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/a5e58e66-25c1-449f-a0bf-ca9a18b67307" },
  { id: "9aa8805c-8b6a-4dfc-9e61-f5181ce07fc8", title: "Big US university endowments outperform S&P 500 index", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/9aa8805c-8b6a-4dfc-9e61-f5181ce07fc8" },
  { id: "b7117775-81cc-4649-8235-1330891b2276", title: "Russia’s uranium push raises concern over nuclear fuel supply", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/b7117775-81cc-4649-8235-1330891b2276" },
  { id: "d6b990f3-7cd8-49b6-b310-53356ea14c90", title: "ArcelorMittal faces green steel price test at flagship low-carbon plant", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/d6b990f3-7cd8-49b6-b310-53356ea14c90" },
  { id: "b8ef3757-6889-455e-9d5f-3c5cc55bf9ce", title: "A foldable iPhone: John Ternus’s first test as Apple CEO", date: "2026-09-07", time: "05:00", url: "https://www.ft.com/content/b8ef3757-6889-455e-9d5f-3c5cc55bf9ce" },
  { id: "83e08169-69b5-4997-9bf0-e0622e752eda", title: "Europe failing to deter Russia’s ‘hybrid’ war, warn defence officials", date: "2026-09-06", time: "21:00", url: "https://www.ft.com/content/83e08169-69b5-4997-9bf0-e0622e752eda" },
  { id: "48e7b92b-affc-4fd0-8de1-ae8765e5c799", title: "Germany’s Merz on the ropes after far right delivers devastating blow", date: "2026-09-06", time: "20:51", url: "https://www.ft.com/content/48e7b92b-affc-4fd0-8de1-ae8765e5c799" },
  { id: "a69af29e-b2c1-48cf-a6f7-c1f68c141785", title: "Starting gun fired on autumn election campaign season", date: "2026-09-06", time: "18:15", url: "https://www.ft.com/content/a69af29e-b2c1-48cf-a6f7-c1f68c141785" },
  { id: "f244770a-27ba-42b1-8cd5-7631b2c8412b", title: "Police face questions over Dover disruption caused by masked protesters", date: "2026-09-06", time: "17:47", url: "https://www.ft.com/content/f244770a-27ba-42b1-8cd5-7631b2c8412b" },
  { id: "a0229455-1822-4de8-ad2f-7453577d95cd", title: "Far-right AfD surges in German state elections, exit polls show", date: "2026-09-06", time: "17:26", url: "https://www.ft.com/content/a0229455-1822-4de8-ad2f-7453577d95cd" },
  { id: "1e2d9db0-cb2c-4c79-942b-f0aff960e4c5", title: "Trump envoys hold talks with Zelenskyy in Kyiv after meeting Putin in Moscow", date: "2026-09-06", time: "16:06", url: "https://www.ft.com/content/1e2d9db0-cb2c-4c79-942b-f0aff960e4c5" },
  { id: "6ea98322-96a3-408a-87e4-eb5e4eb05b52", title: "Pete Hegseth’s Pentagon purge", date: "2026-09-06", time: "14:35", url: "https://www.ft.com/content/6ea98322-96a3-408a-87e4-eb5e4eb05b52" },
  { id: "1b46baac-10e7-444f-99c5-c661c164b2f1", title: "Lebanon warns of ‘dangerous escalation’ after Israeli strikes", date: "2026-09-06", time: "14:11", url: "https://www.ft.com/content/1b46baac-10e7-444f-99c5-c661c164b2f1" },
  { id: "cbe3766f-68f1-4167-8cf2-e89cf380ff43", title: "Hostility to Reform UK leaves Farage with a dilemma", date: "2026-09-06", time: "13:04", url: "https://www.ft.com/content/cbe3766f-68f1-4167-8cf2-e89cf380ff43" },
  { id: "9422805f-519c-4b22-839c-cbd7a6464f07", title: "Was Huawei’s rise built on crime? A Brooklyn jury will decide", date: "2026-09-06", time: "13:00", url: "https://www.ft.com/content/9422805f-519c-4b22-839c-cbd7a6464f07" },
  { id: "87167087-e472-44fe-bfa5-3f13a782e889", title: "Britain is a factory for ideas applied elsewhere", date: "2026-09-06", time: "12:00", url: "https://www.ft.com/content/87167087-e472-44fe-bfa5-3f13a782e889" },
  { id: "cffea5bc-0255-4029-8e76-0c3671bf4d92", title: "Will US inflation data persuade the Fed to raise rates this month?", date: "2026-09-06", time: "12:00", url: "https://www.ft.com/content/cffea5bc-0255-4029-8e76-0c3671bf4d92" },
  { id: "eb4c3d77-cb16-4f77-a173-9960481ac716", title: "Nigel Farage urged by Labour to ‘take responsibility’ over TV sting", date: "2026-09-06", time: "11:42", url: "https://www.ft.com/content/eb4c3d77-cb16-4f77-a173-9960481ac716" },
  { id: "4a751ca7-83ac-4c62-8d3f-3643e74ad92b", title: "Jaguar Land Rover plans up to 4,000 job cuts as Chinese rivals pile on pressure", date: "2026-09-06", time: "11:11", url: "https://www.ft.com/content/4a751ca7-83ac-4c62-8d3f-3643e74ad92b" },
  { id: "c249f75f-a1ed-4174-94f3-320f8e4ef806", title: "German state heads to regional polls in far-right cliffhanger", date: "2026-09-06", time: "09:04", url: "https://www.ft.com/content/c249f75f-a1ed-4174-94f3-320f8e4ef806" },
  { id: "9bcce1fa-997e-49f2-9530-f1255e4cb28b", title: "Donald Trump’s approval rating falls to lowest yet in FT poll", date: "2026-09-06", time: "05:01", url: "https://www.ft.com/content/9bcce1fa-997e-49f2-9530-f1255e4cb28b" },
];
