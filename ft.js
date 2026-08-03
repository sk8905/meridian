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
  { id: "e279135e-cd6e-46d4-b80b-2e6b0c0901a9", title: "How big was the American JPY intervention?", date: "2026-08-03", time: "18:14", url: "https://www.ft.com/content/e279135e-cd6e-46d4-b80b-2e6b0c0901a9" },
  { id: "c300b4dd-984a-4845-86a1-d1332dafe8bc", title: "Texas law firm agrees $15mn settlement over judicial scandal", date: "2026-08-03", time: "17:34", url: "https://www.ft.com/content/c300b4dd-984a-4845-86a1-d1332dafe8bc" },
  { id: "6282b88a-6f49-40cc-b1d8-5e147e7e37f1", title: "AstraZeneca and Bristol-Myers: when Big Pharma isn't big enough", date: "2026-08-03", time: "17:33", url: "https://www.ft.com/content/6282b88a-6f49-40cc-b1d8-5e147e7e37f1" },
  { id: "6d40c74b-ac40-42f1-9387-957925f48daa", title: "AstraZeneca investors raise concerns over mega-merger talks", date: "2026-08-03", time: "17:24", url: "https://www.ft.com/content/6d40c74b-ac40-42f1-9387-957925f48daa" },
  { id: "016ad17d-0cab-48f1-8d7f-d3eb1634be63", title: "Six teenagers, a brutal murder and the story they couldn't take back", date: "2026-08-03", time: "17:11", url: "https://www.ft.com/content/016ad17d-0cab-48f1-8d7f-d3eb1634be63" },
  { id: "03c413f2-6ad5-45d1-b5ac-fdb6ed8b4cff", title: "UBS fined $125mn over lax money laundering controls", date: "2026-08-03", time: "16:53", url: "https://www.ft.com/content/03c413f2-6ad5-45d1-b5ac-fdb6ed8b4cff" },
  { id: "06f8f1a1-50a1-43d0-a236-c2d65ff38e87", title: "Iranian tanker tolls: totally legit after all?", date: "2026-08-03", time: "15:30", url: "https://www.ft.com/content/06f8f1a1-50a1-43d0-a236-c2d65ff38e87" },
  { id: "2cc9c96a-0e5b-4c33-a95a-3d11072a145c", title: "Apple launches legal challenge to UK attempt to access encrypted user data", date: "2026-08-03", time: "15:11", url: "https://www.ft.com/content/2cc9c96a-0e5b-4c33-a95a-3d11072a145c" },
  { id: "f1d1214e-59e8-4024-92f3-5a0a32dd0bc6", title: "And the FTAV charts quiz winner isn’t…", date: "2026-08-03", time: "15:01", url: "https://www.ft.com/content/f1d1214e-59e8-4024-92f3-5a0a32dd0bc6" },
  { id: "1419a5f5-1bd7-4b89-b667-45c2789769ef", title: "Time for Andy Burnham to smile on UK science", date: "2026-08-03", time: "14:50", url: "https://www.ft.com/content/1419a5f5-1bd7-4b89-b667-45c2789769ef" },
  { id: "eddbdc29-5206-4c79-9ea7-f1a06ff040f1", title: "Struggling to make sense of AstraZeneca-BMS", date: "2026-08-03", time: "14:21", url: "https://www.ft.com/content/eddbdc29-5206-4c79-9ea7-f1a06ff040f1" },
  { id: "0eec21be-80c4-4fca-991a-32fbd58cc653", title: "Can Democrats win over the working class?", date: "2026-08-03", time: "14:00", url: "https://www.ft.com/content/0eec21be-80c4-4fca-991a-32fbd58cc653" },
  { id: "547bc3c3-6778-42d3-9bed-fcc3d0c28068", title: "Why Burnham is wrong about education and opportunity", date: "2026-08-03", time: "14:00", url: "https://www.ft.com/content/547bc3c3-6778-42d3-9bed-fcc3d0c28068" },
  { id: "c268f3ed-664c-4fc9-82f9-2b2af8118106", title: "Chess: Geneva to host 2026 world title match with holder Gukesh the underdog against Sindarov", date: "2026-08-03", time: "13:23", url: "https://www.ft.com/content/c268f3ed-664c-4fc9-82f9-2b2af8118106" },
  { id: "ebfc7f0f-d176-4da7-9136-b8703388decc", title: "Football has given Europe a rare geopolitical victory", date: "2026-08-03", time: "12:54", url: "https://www.ft.com/content/ebfc7f0f-d176-4da7-9136-b8703388decc" },
  { id: "c519970a-dd04-4f4a-aa1d-3db1a3c9e69a", title: "Plurilateral deals are last best hope for world trading system", date: "2026-08-03", time: "12:31", url: "https://www.ft.com/content/c519970a-dd04-4f4a-aa1d-3db1a3c9e69a" },
  { id: "6a8c1d6c-63c7-4d3d-8882-eb5c67b2f9e1", title: "SpaceX’s staggered lock-up release prolongs the pain", date: "2026-08-03", time: "12:00", url: "https://www.ft.com/content/6a8c1d6c-63c7-4d3d-8882-eb5c67b2f9e1" },
  { id: "08b4af67-27d5-4d38-91cd-3ae81250cf59", title: "Myanmar releases photos of Aung San Suu Kyi amid health concerns", date: "2026-08-03", time: "11:25", url: "https://www.ft.com/content/08b4af67-27d5-4d38-91cd-3ae81250cf59" },
  { id: "f2180678-aebb-44c5-b7ad-483db9b5ee28", title: "Reform’s Richard Tice probed over alleged failure to declare an interest", date: "2026-08-03", time: "11:14", url: "https://www.ft.com/content/f2180678-aebb-44c5-b7ad-483db9b5ee28" },
  { id: "d0fb3d34-cb05-44e5-8fea-ac3753aecb7a", title: "Reform UK promises large-scale ‘military operation’ to block small boat crossings", date: "2026-08-03", time: "10:00", url: "https://www.ft.com/content/d0fb3d34-cb05-44e5-8fea-ac3753aecb7a" },
  { id: "d65cbd70-dc0b-4026-b80f-feeb8c152b0c", title: "Don’t let tax rows eclipse the fundamentals of social care", date: "2026-08-03", time: "09:30", url: "https://www.ft.com/content/d65cbd70-dc0b-4026-b80f-feeb8c152b0c" },
  { id: "518d4dea-01b4-4030-85c1-916e91661580", title: "Todd Blanche confirms scrapping of $1.8bn ‘slush fund’ ahead of confirmation vote", date: "2026-08-03", time: "08:47", url: "https://www.ft.com/content/518d4dea-01b4-4030-85c1-916e91661580" },
  { id: "c816eecb-d6fd-4817-aa76-739a7ac198d5", title: "FTAV’s further reading", date: "2026-08-03", time: "08:23", url: "https://www.ft.com/content/c816eecb-d6fd-4817-aa76-739a7ac198d5" },
  { id: "f6d563ee-9238-4f82-a848-79f2478326bd", title: "Team America: Yen police", date: "2026-08-03", time: "06:30", url: "https://www.ft.com/content/f6d563ee-9238-4f82-a848-79f2478326bd" },
  { id: "942fa156-1316-47d0-ade1-7fe6efa11840", title: "Beefing with the Big Mac Index", date: "2026-08-03", time: "06:00", url: "https://www.ft.com/content/942fa156-1316-47d0-ade1-7fe6efa11840" },
  { id: "8cf8bbb2-e286-4824-8ec3-6404d2756bc3", title: "FirstFT: AstraZeneca and Bristol Myers Squibb discuss $400bn tie-up", date: "2026-08-03", time: "05:35", url: "https://www.ft.com/content/8cf8bbb2-e286-4824-8ec3-6404d2756bc3" },
  { id: "e752b560-064b-4f9b-8284-99fcaae9202f", title: "Spain’s migrant crisis reopens deep EU rifts", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/e752b560-064b-4f9b-8284-99fcaae9202f" },
  { id: "ef7f88ca-3dc0-49c7-b995-05b1de69cc74", title: "Europe’s fire costs this year mount to beyond €3bn, FT analysis shows", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/ef7f88ca-3dc0-49c7-b995-05b1de69cc74" },
  { id: "34ea6eac-6fad-4edd-b78a-6ff20bc7a63d", title: "French banks warm to election financing in potential boost for Marine Le Pen", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/34ea6eac-6fad-4edd-b78a-6ff20bc7a63d" },
  { id: "90550cee-2dd4-437f-8bda-b1ff41317d23", title: "A digital iron curtain is threatening the global economy", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/90550cee-2dd4-437f-8bda-b1ff41317d23" },
  { id: "bf6b7199-09fe-4f1a-b230-8d2bb6e9e215", title: "US gas guzzlers see off Europe’s EVs in latest round of car wars", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/bf6b7199-09fe-4f1a-b230-8d2bb6e9e215" },
  { id: "69d55b1b-fa3f-420c-905a-6699d28a7b89", title: "Ofcom chair launches review of regulator to help rein in Big Tech", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/69d55b1b-fa3f-420c-905a-6699d28a7b89" },
  { id: "39f08da6-22cb-4c96-a800-379d105bd46e", title: "A second act for high-yield bonds", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/39f08da6-22cb-4c96-a800-379d105bd46e" },
  { id: "2d1226d3-48e3-47c8-9a0b-96cbb9ab8a4c", title: "Whatever happened to prudence?", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/2d1226d3-48e3-47c8-9a0b-96cbb9ab8a4c" },
  { id: "bc589991-4e3a-4676-98bb-dcfd0e9e4b9d", title: "NHS England to revise Palantir platform data after staff concerns", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/bc589991-4e3a-4676-98bb-dcfd0e9e4b9d" },
  { id: "7600731b-4f7f-4d38-a478-3196c565a880", title: "Wall Street learns to love blockchain", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/7600731b-4f7f-4d38-a478-3196c565a880" },
  { id: "95f667a2-9b86-4ef0-af15-9428eb3a728b", title: "The buyers of £5mn properties don’t look like they used to", date: "2026-08-03", time: "05:00", url: "https://www.ft.com/content/95f667a2-9b86-4ef0-af15-9428eb3a728b" },
  { id: "c9bd508c-2915-4b34-a5a5-553bff9548a5", title: "Trump says Iran talks to resume after US called off major attack", date: "2026-08-03", time: "02:24", url: "https://www.ft.com/content/c9bd508c-2915-4b34-a5a5-553bff9548a5" },
  { id: "5de204a4-4db6-458c-aa9a-324e6bd5e766", title: "Japan vows to intervene again with US over yen if needed", date: "2026-08-03", time: "01:48", url: "https://www.ft.com/content/5de204a4-4db6-458c-aa9a-324e6bd5e766" },
  { id: "e9027253-e13c-460a-a4b1-f9047e5a6ca7", title: "AstraZeneca holds talks with Bristol Myers Squibb over $400bn tie-up", date: "2026-08-03", time: "00:59", url: "https://www.ft.com/content/e9027253-e13c-460a-a4b1-f9047e5a6ca7" },
];
