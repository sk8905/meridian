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
  { id: "6bd2290f-209d-4b30-9fac-dcfcd32bfb5d", title: "One dead and 16 injured after van drives into Berlin Pride crowd", date: "2026-07-26", time: "08:05", url: "https://www.ft.com/content/6bd2290f-209d-4b30-9fac-dcfcd32bfb5d" },
  { id: "af333b9c-d59d-4e7c-b814-12cef578895d", title: "Investors use crypto exchanges to avoid Beijing’s controls on AI stocks", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/af333b9c-d59d-4e7c-b814-12cef578895d" },
  { id: "cd0b6148-a9a7-4763-b6d3-bb33e10b9899", title: "Deadly storm in Chile disrupts copper mines and raises AI supply concerns", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/cd0b6148-a9a7-4763-b6d3-bb33e10b9899" },
  { id: "fcb2bd34-b13f-4f4f-950d-92367d43d1f3", title: "Defence giants provide record backing for military start-ups", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/fcb2bd34-b13f-4f4f-950d-92367d43d1f3" },
  { id: "5b789a38-c9ca-4b23-8e61-8f9e2e589396", title: "Chips and drones to be at heart of Andy Burnham’s push to ‘reindustrialise’, AI minister says", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/5b789a38-c9ca-4b23-8e61-8f9e2e589396" },
  { id: "fc7ac23f-5a0b-4114-9f6c-8089fb20ce9f", title: "The British state school that is the first to open an overseas branch", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/fc7ac23f-5a0b-4114-9f6c-8089fb20ce9f" },
  { id: "ad635fef-8785-47be-b264-e74582413ed6", title: "Maga’s creepy baby obsession won’t solve the fertility crisis", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/ad635fef-8785-47be-b264-e74582413ed6" },
  { id: "2ddef625-df80-4690-9475-f3ce86171593", title: "Why workers are nostalgic for life before AI", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/2ddef625-df80-4690-9475-f3ce86171593" },
  { id: "76a13471-f907-4712-bcdb-28bbddbd5562", title: "Why degree apprenticeships are more competitive than Oxford", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/76a13471-f907-4712-bcdb-28bbddbd5562" },
  { id: "ccf8b73f-c798-46d8-a00b-47df2a6c6859", title: "‘Divide and conquer’: China exploits EU divisions over trade", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/ccf8b73f-c798-46d8-a00b-47df2a6c6859" },
  { id: "92b0ffcb-3878-400b-ad1a-80597b7b9450", title: "Lead pollution poses health risk, says review sparked by FT investigation", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/92b0ffcb-3878-400b-ad1a-80597b7b9450" },
  { id: "221aac60-807e-4bdd-b76d-dd451255e685", title: "China pours funding into green energy deals as Iran war hits oil demand", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/221aac60-807e-4bdd-b76d-dd451255e685" },
  { id: "84bbf234-618c-4863-adae-47ab7395f684", title: "CPS hires more trainee lawyers in bid to compete with Big Law", date: "2026-07-26", time: "05:00", url: "https://www.ft.com/content/84bbf234-618c-4863-adae-47ab7395f684" },
  { id: "a352cb9c-8b29-4d3c-b672-1b6c65fd4a1d", title: "Iran says Ukrainian attack on vessel in Caspian Sea killed sailor", date: "2026-07-25", time: "22:52", url: "https://www.ft.com/content/a352cb9c-8b29-4d3c-b672-1b6c65fd4a1d" },
  { id: "5bd259ca-d278-498a-a03d-7b4556d9fa8f", title: "Top Democrat says Trump administration is worsening chip shortage", date: "2026-07-25", time: "20:33", url: "https://www.ft.com/content/5bd259ca-d278-498a-a03d-7b4556d9fa8f" },
  { id: "fa785a9b-f136-43ab-91d5-f20742291331", title: "Brazil denies visas to US officials over alleged election interference", date: "2026-07-25", time: "19:20", url: "https://www.ft.com/content/fa785a9b-f136-43ab-91d5-f20742291331" },
  { id: "f4a5d8da-c950-49d3-b847-6281d2087e4c", title: "Kazakhstan’s president urges Putin to ‘freeze’ the war in Ukraine", date: "2026-07-25", time: "18:58", url: "https://www.ft.com/content/f4a5d8da-c950-49d3-b847-6281d2087e4c" },
  { id: "6359b7ba-494f-4c80-b3f7-a64b3224ba9e", title: "Washington and London discuss plan for meeting to resolve Hormuz crisis", date: "2026-07-25", time: "13:11", url: "https://www.ft.com/content/6359b7ba-494f-4c80-b3f7-a64b3224ba9e" },
  { id: "1a7cdff0-5e52-4fa1-8b21-978e501eb791", title: "Maha Inc: how companies tied to Kennedy’s movement are poised to benefit", date: "2026-07-25", time: "12:00", url: "https://www.ft.com/content/1a7cdff0-5e52-4fa1-8b21-978e501eb791" },
  { id: "5f267b7d-9e57-40f6-9bb5-6fe5d6cf9d1d", title: "India’s education minister resigns after weeks of student protests", date: "2026-07-25", time: "11:38", url: "https://www.ft.com/content/5f267b7d-9e57-40f6-9bb5-6fe5d6cf9d1d" },
  { id: "5019e030-796d-47e8-9f13-bee34de1d374", title: "Investors bet on Federal Reserve rate rise after oil price surge", date: "2026-07-25", time: "11:00", url: "https://www.ft.com/content/5019e030-796d-47e8-9f13-bee34de1d374" },
  { id: "952d7583-a177-419c-91bf-3a2f71ec97b3", title: "Europe Express: Macron and Merz move on from fighter jet heartbreak", date: "2026-07-25", time: "11:00", url: "https://www.ft.com/content/952d7583-a177-419c-91bf-3a2f71ec97b3" },
  { id: "38a18d43-5b01-4c08-ab85-c1695f10c1e3", title: "US immigration enforcement caught between Trump and public backlash", date: "2026-07-25", time: "11:00", url: "https://www.ft.com/content/38a18d43-5b01-4c08-ab85-c1695f10c1e3" },
  { id: "14ee6049-87bf-4aac-b684-c9937374fdcc", title: "Saudi Arabia strikes Houthis after Iran-backed rebels target tankers", date: "2026-07-25", time: "10:59", url: "https://www.ft.com/content/14ee6049-87bf-4aac-b684-c9937374fdcc" },
  { id: "ec5c4433-b17d-4116-b2fb-0fce61a261bd", title: "Chart of the Week: Who owns shares?", date: "2026-07-25", time: "10:30", url: "https://www.ft.com/content/ec5c4433-b17d-4116-b2fb-0fce61a261bd" },
  { id: "b55e3656-4733-4eb8-bb83-b7dbb4ea8888", title: "Intern arrested on suspicion of spying at Nato military HQ", date: "2026-07-25", time: "10:22", url: "https://www.ft.com/content/b55e3656-4733-4eb8-bb83-b7dbb4ea8888" },
  { id: "780bc4bb-1916-4fe2-ad2b-22663c66f16e", title: "Blackstone, KKR and Brookfield take Kuwait pipelines stake in $16bn deal", date: "2026-07-25", time: "09:44", url: "https://www.ft.com/content/780bc4bb-1916-4fe2-ad2b-22663c66f16e" },
  { id: "75e3ac7d-f612-470b-af3a-a310c52c4e58", title: "Who wants to buy a football club?", date: "2026-07-25", time: "09:00", url: "https://www.ft.com/content/75e3ac7d-f612-470b-af3a-a310c52c4e58" },
  { id: "ac19e4f4-cf7b-4a75-b591-0ca79ef62d37", title: "India’s ‘Cockroach’ Gen Z has had enough", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/ac19e4f4-cf7b-4a75-b591-0ca79ef62d37" },
  { id: "24a8adf9-8103-44b3-92e8-350ef897dc2a", title: "Overpriced UK homes take ‘more than four times longer to sell’, study finds", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/24a8adf9-8103-44b3-92e8-350ef897dc2a" },
  { id: "66a53961-6583-4dfb-8b74-96e6abed5db7", title: "What the City needs from the Burnham government", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/66a53961-6583-4dfb-8b74-96e6abed5db7" },
  { id: "4c76fc58-836c-4abe-916e-bfc727f83fca", title: "Andy Burnham’s regional privilege", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/4c76fc58-836c-4abe-916e-bfc727f83fca" },
  { id: "803b02dd-9d0d-43b9-8af9-24d81b1b6557", title: "Dropping quarterly company reports in US may not be a bad thing", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/803b02dd-9d0d-43b9-8af9-24d81b1b6557" },
  { id: "bfe34895-6383-4906-96b9-c622d10e32da", title: "More than 600,000 UK high earners could be dragged into pension trap by 2032", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/bfe34895-6383-4906-96b9-c622d10e32da" },
  { id: "42847a3b-f4b6-4a16-88e0-f06fdfabbdc6", title: "India and South Africa lead push to amass emergency fuel stockpiles", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/42847a3b-f4b6-4a16-88e0-f06fdfabbdc6" },
  { id: "688211ec-ffa2-421d-85cb-59bce6b1e0dd", title: "The gig is now the content, and the content is the gig", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/688211ec-ffa2-421d-85cb-59bce6b1e0dd" },
  { id: "577bd050-cee7-4e69-aa43-5106a0635a65", title: "Europe can’t stop the tide of cocaine", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/577bd050-cee7-4e69-aa43-5106a0635a65" },
  { id: "0ce20ef6-178e-4f8a-8a0a-e5f5cc79a414", title: "How did summer childcare get so expensive in the UK?", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/0ce20ef6-178e-4f8a-8a0a-e5f5cc79a414" },
  { id: "e548b330-6621-4fc6-b72a-c6dcd50a785b", title: "Mexico’s Claudia Sheinbaum puts faith in petrol price cap", date: "2026-07-25", time: "05:00", url: "https://www.ft.com/content/e548b330-6621-4fc6-b72a-c6dcd50a785b" },
  { id: "95cad892-7933-441a-bc82-c39b1a225835", title: "Paramount agrees extensive delay in Warner Bros deal after state lawsuit", date: "2026-07-24", time: "21:17", url: "https://www.ft.com/content/95cad892-7933-441a-bc82-c39b1a225835" },
];
