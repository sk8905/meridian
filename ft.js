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
  { id: "c0d1c0ce-96c0-4824-a211-139acbddd200", title: "Geneva super-rich rocked by luxury home burglary spree", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/c0d1c0ce-96c0-4824-a211-139acbddd200" },
  { id: "53082739-7714-4aae-9816-e55ab423cbee", title: "OpenAI upheaval mounts as Sam Altman readies IPO push", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/53082739-7714-4aae-9816-e55ab423cbee" },
  { id: "bf7b4e9b-6017-4525-a0e7-10c3b7bfec30", title: "UK universities offer fee discounts to overseas students in ‘pricing war’", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/bf7b4e9b-6017-4525-a0e7-10c3b7bfec30" },
  { id: "e1eb3638-cd1a-4a1a-857d-133fe4be468c", title: "Pandemic lockdowns never ended for some people", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/e1eb3638-cd1a-4a1a-857d-133fe4be468c" },
  { id: "936c1856-a049-4d3e-be1c-7cd6269f6bcf", title: "How Burnham can curb Britain’s tax-dodging shops", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/936c1856-a049-4d3e-be1c-7cd6269f6bcf" },
  { id: "f6e4008a-5dab-4248-8fd9-50105cf7d182", title: "School fees are outpacing inflation — here’s how grandparents can help", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/f6e4008a-5dab-4248-8fd9-50105cf7d182" },
  { id: "32592ab6-4385-4f43-95b7-f29cb2abab32", title: "The mercenaries fighting in Africa’s forgotten war", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/32592ab6-4385-4f43-95b7-f29cb2abab32" },
  { id: "5f8858b8-7468-4438-b269-e1b1947b1926", title: "America’s AI election", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/5f8858b8-7468-4438-b269-e1b1947b1926" },
  { id: "ca8c9b92-e4cb-4b88-b10e-1fe722aaa7a8", title: "Why we’re all Wile E Coyote now", date: "2026-08-15", time: "05:00", url: "https://www.ft.com/content/ca8c9b92-e4cb-4b88-b10e-1fe722aaa7a8" },
  { id: "5d5ed2dd-8326-4cad-aac3-5816448ceccf", title: "US accuses more than 40 countries of helping China avoid Donald Trump’s tariffs", date: "2026-08-14", time: "19:54", url: "https://www.ft.com/content/5d5ed2dd-8326-4cad-aac3-5816448ceccf" },
  { id: "66d3a2de-6591-443d-83b0-94f2224edbbf", title: "Americans sour on Donald Trump’s economy as affordability strains intensify", date: "2026-08-14", time: "19:49", url: "https://www.ft.com/content/66d3a2de-6591-443d-83b0-94f2224edbbf" },
  { id: "2066e73b-be66-4df0-822a-b694d8f66535", title: "Claudia Sheinbaum slams US for revoking visa of former Mexican president’s son", date: "2026-08-14", time: "19:14", url: "https://www.ft.com/content/2066e73b-be66-4df0-822a-b694d8f66535" },
  { id: "8e790ba0-0c3d-47dd-9955-0b98a808ae0c", title: "Burnham warns of ‘tinderbox’ Britain after week of intense heat", date: "2026-08-14", time: "18:51", url: "https://www.ft.com/content/8e790ba0-0c3d-47dd-9955-0b98a808ae0c" },
  { id: "adb47166-29f0-4630-bf8e-b9d0b8d0f2ed", title: "Stockpickers: Persimmon, Savills, Caledonia Mining", date: "2026-08-14", time: "18:00", url: "https://www.ft.com/content/adb47166-29f0-4630-bf8e-b9d0b8d0f2ed" },
  { id: "87d2bbd8-a799-4d6c-8907-2709cdcf0a31", title: "Directors’ Deals: British American Tobacco’s newest director buys the dip", date: "2026-08-14", time: "18:00", url: "https://www.ft.com/content/87d2bbd8-a799-4d6c-8907-2709cdcf0a31" },
  { id: "11126975-e2ba-4510-8b9e-2f2bc82b43a5", title: "Biotech VCs have become like bankers and we might all pay the price", date: "2026-08-14", time: "18:00", url: "https://www.ft.com/content/11126975-e2ba-4510-8b9e-2f2bc82b43a5" },
  { id: "20f44f32-6566-4373-b6d8-9551be58d762", title: "How a bad trade pushed a US mortgage giant into a $2bn lifeline", date: "2026-08-14", time: "17:47", url: "https://www.ft.com/content/20f44f32-6566-4373-b6d8-9551be58d762" },
];
