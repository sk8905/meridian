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
  { id: "44c08ae9-f209-4992-8744-cfff430eca07", title: "Jamie Dimon warns UK chancellor against higher bank taxes", date: "2026-08-16", time: "20:00", url: "https://www.ft.com/content/44c08ae9-f209-4992-8744-cfff430eca07" },
  { id: "f6b953fc-a6ad-48cd-bed1-d42619b57d94", title: "Far-right Israeli minister advocates killing ‘30 to 40’ Gazans each night", date: "2026-08-16", time: "19:43", url: "https://www.ft.com/content/f6b953fc-a6ad-48cd-bed1-d42619b57d94" },
  { id: "0a2db2ce-b89f-4d2b-a93b-794e4e422141", title: "London’s flood-defence system may need urgent replacement as extreme weather worsens", date: "2026-08-16", time: "19:00", url: "https://www.ft.com/content/0a2db2ce-b89f-4d2b-a93b-794e4e422141" },
  { id: "10aba768-20fc-46eb-8503-4658181bffc5", title: "California billionaires add millions to bolster fight against wealth tax", date: "2026-08-16", time: "18:55", url: "https://www.ft.com/content/10aba768-20fc-46eb-8503-4658181bffc5" },
  { id: "4bfa3d64-cf64-448d-823e-44c4577370b4", title: "US considers sanctions on Brazil judge in new test of diplomatic ties", date: "2026-08-16", time: "18:26", url: "https://www.ft.com/content/4bfa3d64-cf64-448d-823e-44c4577370b4" },
  { id: "d14b21c8-6a63-4593-b455-480b18792ac8", title: "Canadian business braced for 50% US tariffs", date: "2026-08-16", time: "18:15", url: "https://www.ft.com/content/d14b21c8-6a63-4593-b455-480b18792ac8" },
  { id: "d3e785fd-fbda-41d8-9c07-5275ad30fce6", title: "Angela Rayner makes planning changes to protect England’s pubs and boost housebuilding", date: "2026-08-16", time: "17:35", url: "https://www.ft.com/content/d3e785fd-fbda-41d8-9c07-5275ad30fce6" },
  { id: "c2ee0910-ee7d-4a36-bf5e-697c7ade93a2", title: "Don’t dismiss the mini-middle powers", date: "2026-08-16", time: "16:00", url: "https://www.ft.com/content/c2ee0910-ee7d-4a36-bf5e-697c7ade93a2" },
  { id: "9dc2ffa4-d40f-4236-91f0-e1ba664040bd", title: "British farmers need more help to cope with brutal heat", date: "2026-08-16", time: "14:06", url: "https://www.ft.com/content/9dc2ffa4-d40f-4236-91f0-e1ba664040bd" },
  { id: "e34c097f-0f5d-49b8-8142-967842ba6c42", title: "Reform UK vows to cut £50bn from welfare bill if it wins power", date: "2026-08-16", time: "13:39", url: "https://www.ft.com/content/e34c097f-0f5d-49b8-8142-967842ba6c42" },
  { id: "757c4938-614c-4829-9d8f-7320917e6753", title: "Farage’s fruitless by-election gambit", date: "2026-08-16", time: "13:35", url: "https://www.ft.com/content/757c4938-614c-4829-9d8f-7320917e6753" },
  { id: "ea4d4326-878d-4e9e-9303-466c8a382c60", title: "How economics is changing", date: "2026-08-16", time: "12:00", url: "https://www.ft.com/content/ea4d4326-878d-4e9e-9303-466c8a382c60" },
  { id: "8791db73-09d0-4fe9-a11e-1a9e0ce48739", title: "How Ralph Lauren won the workwear wars as America returned to the office", date: "2026-08-16", time: "12:00", url: "https://www.ft.com/content/8791db73-09d0-4fe9-a11e-1a9e0ce48739" },
  { id: "f9eb497c-f8e0-4cba-8edc-619e55b74a59", title: "Will the Fed minutes reveal any forward guidance?", date: "2026-08-16", time: "12:00", url: "https://www.ft.com/content/f9eb497c-f8e0-4cba-8edc-619e55b74a59" },
  { id: "a71bcea9-b0eb-4ed2-8bc9-f4dace738e37", title: "Ukraine presses drone attacks on Moscow and Russian logistics", date: "2026-08-16", time: "11:52", url: "https://www.ft.com/content/a71bcea9-b0eb-4ed2-8bc9-f4dace738e37" },
  { id: "cf87b6cd-f940-4b09-b072-7da36faa183f", title: "How a sports billionaire threatens to upend Wall Street", date: "2026-08-16", time: "11:00", url: "https://www.ft.com/content/cf87b6cd-f940-4b09-b072-7da36faa183f" },
  { id: "8158cb5a-4bbd-43fd-b329-15a54e8422c8", title: "Big Tech’s data centre boom poised to drive up carbon emissions", date: "2026-08-16", time: "11:00", url: "https://www.ft.com/content/8158cb5a-4bbd-43fd-b329-15a54e8422c8" },
  { id: "fd40a98d-2a7f-4246-a296-73e956bf03c0", title: "Most US voters say they are worse off under Trump — FT poll", date: "2026-08-16", time: "05:01", url: "https://www.ft.com/content/fd40a98d-2a7f-4246-a296-73e956bf03c0" },
  { id: "729477cd-3551-4345-8c7c-33603b293556", title: "Harvey Nicks deal hints at department stores’ hidden potential", date: "2026-08-16", time: "05:00", url: "https://www.ft.com/content/729477cd-3551-4345-8c7c-33603b293556" },
  { id: "161ee092-d2b6-4375-a853-e7a6fbee60e2", title: "World’s largest carmakers seek to avert motor oil crisis", date: "2026-08-16", time: "05:00", url: "https://www.ft.com/content/161ee092-d2b6-4375-a853-e7a6fbee60e2" },
  { id: "b56a910a-c2b4-41e5-9f8f-18e6fe7b2efd", title: "Are Americans making peace with the spectre of socialism?", date: "2026-08-16", time: "05:00", url: "https://www.ft.com/content/b56a910a-c2b4-41e5-9f8f-18e6fe7b2efd" },
  { id: "1419012f-feca-4efd-a817-dc0392cd76e3", title: "European companies count the costs and gains of extreme heat", date: "2026-08-16", time: "05:00", url: "https://www.ft.com/content/1419012f-feca-4efd-a817-dc0392cd76e3" },
  { id: "1b318ce4-75ef-4f68-8db5-f148dd00fe9f", title: "Miner Ferrexpo caught up in dispute between oligarch and Kyiv", date: "2026-08-16", time: "05:00", url: "https://www.ft.com/content/1b318ce4-75ef-4f68-8db5-f148dd00fe9f" },
  { id: "ec03d429-acd7-4121-a22e-daeff3d84cf4", title: "The Italian university benefiting from the post-Brexit student shift", date: "2026-08-16", time: "05:00", url: "https://www.ft.com/content/ec03d429-acd7-4121-a22e-daeff3d84cf4" },
  { id: "c4e45f2a-593f-445a-bd3b-66df91465bb7", title: "UK housebuilder profits set to fall 12% as ‘relentless grind’ drags on", date: "2026-08-16", time: "05:00", url: "https://www.ft.com/content/c4e45f2a-593f-445a-bd3b-66df91465bb7" },
  { id: "8c9e43d2-636a-449e-a376-b4b262143e38", title: "Can we stop with the public ‘blasterbating’, actually?", date: "2026-08-16", time: "05:00", url: "https://www.ft.com/content/8c9e43d2-636a-449e-a376-b4b262143e38" },
  { id: "f063b38e-61c0-449b-aca3-968b903091a1", title: "Malaysia profits from data centre boom", date: "2026-08-16", time: "04:08", url: "https://www.ft.com/content/f063b38e-61c0-449b-aca3-968b903091a1" },
  { id: "7d2969fd-85aa-43fb-ae04-97d1d0ee2463", title: "Singapore Inc hopes AI access will stop finance high-flyers moving to Hong Kong", date: "2026-08-16", time: "02:52", url: "https://www.ft.com/content/7d2969fd-85aa-43fb-ae04-97d1d0ee2463" },
  { id: "1bd69e67-266f-4a4a-9c49-eb3c83bcb295", title: "Israeli strikes kill 11 in Lebanon two months into truce", date: "2026-08-15", time: "17:13", url: "https://www.ft.com/content/1bd69e67-266f-4a4a-9c49-eb3c83bcb295" },
  { id: "4bd6537f-db17-4013-be3f-c70a1299183c", title: "US aircraft carrier furore is emblem of growing disquiet over Iran war", date: "2026-08-15", time: "13:00", url: "https://www.ft.com/content/4bd6537f-db17-4013-be3f-c70a1299183c" },
  { id: "6448b0af-f2ed-4067-b814-73f41b56fa78", title: "Ukraine left exposed as Patriot launchers run empty", date: "2026-08-15", time: "13:00", url: "https://www.ft.com/content/6448b0af-f2ed-4067-b814-73f41b56fa78" },
  { id: "cdec2138-2272-450e-81b8-2fdc9fa61983", title: "Burnham calls for ‘reflection’ over death of Jason Arday", date: "2026-08-15", time: "12:45", url: "https://www.ft.com/content/cdec2138-2272-450e-81b8-2fdc9fa61983" },
  { id: "1c5f8995-ee2f-47cf-977b-69e65f0a8ccc", title: "Labour’s rental reforms disrupt student market and lengthen lettings process", date: "2026-08-15", time: "12:00", url: "https://www.ft.com/content/1c5f8995-ee2f-47cf-977b-69e65f0a8ccc" },
  { id: "57d098e2-7cb7-426b-90b9-38bbd2a37eb3", title: "Chart of the Week: South Korea’s inverse correlation", date: "2026-08-15", time: "10:30", url: "https://www.ft.com/content/57d098e2-7cb7-426b-90b9-38bbd2a37eb3" },
  { id: "2674cacd-3f32-4f4e-97a9-9e825e7f0737", title: "What the Lakers’ $12.5bn sale says about sports ownership", date: "2026-08-15", time: "09:00", url: "https://www.ft.com/content/2674cacd-3f32-4f4e-97a9-9e825e7f0737" },
  { id: "0beb674b-0979-4897-b86d-ce222033adcf", title: "Meet luxury firms’ new branding tool: the intellectual influencer", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/0beb674b-0979-4897-b86d-ce222033adcf" },
  { id: "f41686a7-4d3c-4f49-8d21-29d3577747a7", title: "Modi promises free exam coaching after India’s ‘cockroach’ protests", date: "2026-08-15", time: "06:08", url: "https://www.ft.com/content/f41686a7-4d3c-4f49-8d21-29d3577747a7" },
  { id: "fa479d50-7c79-4b6d-99c3-3830e37c1503", title: "China poised to lift travel ban on Manus founders", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/fa479d50-7c79-4b6d-99c3-3830e37c1503" },
  { id: "543b1ab2-6203-412d-ae3b-f4439d1e9d47", title: "Traders are spoiling for a fight over the yen", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/543b1ab2-6203-412d-ae3b-f4439d1e9d47" },
  { id: "31bcfd50-740c-497c-9104-db9d21efdb69", title: "How John Henry took Liverpool from crisis club to $7bn juggernaut", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/31bcfd50-740c-497c-9104-db9d21efdb69" },
  { id: "0db6a598-687b-4e6c-9ff8-c1b1f858a5a0", title: "The experience economy is a blockbuster phenomenon", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/0db6a598-687b-4e6c-9ff8-c1b1f858a5a0" },
];
