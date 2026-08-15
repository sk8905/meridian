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
  { id: "98cd55c6-8692-47f0-882a-f81de2351130", title: "Bezos-backed group strikes deal for stake in Liverpool FC", date: "2026-08-14", time: "17:00", url: "https://www.ft.com/content/98cd55c6-8692-47f0-882a-f81de2351130" },
  { id: "68873521-58fa-435d-b46f-6309612964b2", title: "Luigi Mangione pleads guilty over death of UnitedHealth chief executive", date: "2026-08-14", time: "16:51", url: "https://www.ft.com/content/68873521-58fa-435d-b46f-6309612964b2" },
  { id: "71f95452-4493-4795-bfe2-26d0c89b2a93", title: "Activists are giving British M&A targets a helpful shove", date: "2026-08-14", time: "16:42", url: "https://www.ft.com/content/71f95452-4493-4795-bfe2-26d0c89b2a93" },
  { id: "e288709a-36f2-459e-9d59-f9a59a3891c2", title: "Farage wins… and donation probe resumes", date: "2026-08-14", time: "16:25", url: "https://www.ft.com/content/e288709a-36f2-459e-9d59-f9a59a3891c2" },
  { id: "7cd266e7-8278-4e26-945d-d7412afa9152", title: "Top French court blocks social media ban for children", date: "2026-08-14", time: "16:24", url: "https://www.ft.com/content/7cd266e7-8278-4e26-945d-d7412afa9152" },
  { id: "9f46db72-0a1e-42b0-8efe-974a04fa0fc7", title: "Latest savings rates", date: "2026-08-14", time: "16:23", url: "https://www.ft.com/content/9f46db72-0a1e-42b0-8efe-974a04fa0fc7" },
  { id: "75ba3055-625c-4cb5-894b-0696a38f5e79", title: "Latest Isa rates", date: "2026-08-14", time: "16:20", url: "https://www.ft.com/content/75ba3055-625c-4cb5-894b-0696a38f5e79" },
  { id: "e95e8b45-474b-4305-b3b5-83036fa3a06c", title: "Warsh and wait", date: "2026-08-14", time: "16:19", url: "https://www.ft.com/content/e95e8b45-474b-4305-b3b5-83036fa3a06c" },
  { id: "68b36b6d-71e7-4f44-bbfb-a202e36603a4", title: "Latest National Savings & Investments rates", date: "2026-08-14", time: "16:16", url: "https://www.ft.com/content/68b36b6d-71e7-4f44-bbfb-a202e36603a4" },
  { id: "d4897d94-0d69-445a-9466-5150840c801e", title: "Investors pile back into US stocks as bullishness returns to Wall Street", date: "2026-08-14", time: "15:35", url: "https://www.ft.com/content/d4897d94-0d69-445a-9466-5150840c801e" },
  { id: "236f9d28-f89d-4991-b066-8d2ea47a0def", title: "Reader callout: Do you earn more than your siblings?", date: "2026-08-14", time: "15:20", url: "https://www.ft.com/content/236f9d28-f89d-4991-b066-8d2ea47a0def" },
  { id: "0095afa5-5945-49cf-b21e-cd502abd1d87", title: "Daniel Kinahan, Ireland’s most wanted man, faces his day in court", date: "2026-08-14", time: "13:45", url: "https://www.ft.com/content/0095afa5-5945-49cf-b21e-cd502abd1d87" },
  { id: "e5137402-162a-4b21-a175-d86af03c378b", title: "Financier fined and banned over false claims in bids for bank and football club", date: "2026-08-14", time: "13:41", url: "https://www.ft.com/content/e5137402-162a-4b21-a175-d86af03c378b" },
  { id: "28a51284-98cc-4767-a306-0540d265687f", title: "Jane Street has paid up large to avoid its numbers leaking out", date: "2026-08-14", time: "13:20", url: "https://www.ft.com/content/28a51284-98cc-4767-a306-0540d265687f" },
  { id: "2a2a8eed-3986-42b5-acde-230dcdffaf25", title: "Why Homer will outlast us all", date: "2026-08-14", time: "13:19", url: "https://www.ft.com/content/2a2a8eed-3986-42b5-acde-230dcdffaf25" },
  { id: "45f65d72-b90a-4dd9-a7b7-43bdf511c194", title: "Safety inspection of track carried out day before train crash south of London", date: "2026-08-14", time: "12:36", url: "https://www.ft.com/content/45f65d72-b90a-4dd9-a7b7-43bdf511c194" },
];
