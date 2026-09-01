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
  { id: "c557ccc2-9fe7-4725-8a1c-c40a0948e8d3", title: "US launches further strikes on Iran as conflict flares up", date: "2026-09-01", time: "17:55", url: "https://www.ft.com/content/c557ccc2-9fe7-4725-8a1c-c40a0948e8d3" },
  { id: "239063eb-90c2-4086-8db3-a9f11a029209", title: "Andy Burnham promises to ‘bring back hope’ in first Commons appearance as PM", date: "2026-09-01", time: "17:49", url: "https://www.ft.com/content/239063eb-90c2-4086-8db3-a9f11a029209" },
  { id: "2ca5dfbf-f48b-4ffb-9ce9-9ff3e787a75e", title: "Germany blames Russia for Leipzig drone attack", date: "2026-09-01", time: "17:33", url: "https://www.ft.com/content/2ca5dfbf-f48b-4ffb-9ce9-9ff3e787a75e" },
  { id: "e7cc6fc2-74ae-497b-92bf-d8254dd161fa", title: "GoPro: a totally normal, unremarkable piece of merger activity", date: "2026-09-01", time: "17:33", url: "https://www.ft.com/content/e7cc6fc2-74ae-497b-92bf-d8254dd161fa" },
  { id: "066b0d08-421b-46a1-8bf1-7698aec161d2", title: "Politics keeps European stocks in America’s shadow", date: "2026-09-01", time: "17:32", url: "https://www.ft.com/content/066b0d08-421b-46a1-8bf1-7698aec161d2" },
  { id: "fe0fc9bf-e7dc-4fa1-91d2-4d7bad22c3c3", title: "Governments should heed the bond market’s warning", date: "2026-09-01", time: "17:17", url: "https://www.ft.com/content/fe0fc9bf-e7dc-4fa1-91d2-4d7bad22c3c3" },
  { id: "9b370f97-2e08-4dd2-8512-fa6aabfd2ec2", title: "IMF agrees $2.2bn bailout for Senegal", date: "2026-09-01", time: "17:15", url: "https://www.ft.com/content/9b370f97-2e08-4dd2-8512-fa6aabfd2ec2" },
  { id: "1edf7290-1289-459f-9f72-2a7d7c3da381", title: "America can’t win the AI race if the rollout lacks public support", date: "2026-09-01", time: "17:06", url: "https://www.ft.com/content/1edf7290-1289-459f-9f72-2a7d7c3da381" },
  { id: "5f643674-bf2b-48f1-bc3e-a7fe54820c99", title: "Action camera maker GoPro to be acquired after decade-long decline", date: "2026-09-01", time: "16:49", url: "https://www.ft.com/content/5f643674-bf2b-48f1-bc3e-a7fe54820c99" },
  { id: "e6f5f97a-b199-444e-aaec-b8199359b08e", title: "Global bond sell-off deepens amid inflation fears", date: "2026-09-01", time: "16:33", url: "https://www.ft.com/content/e6f5f97a-b199-444e-aaec-b8199359b08e" },
  { id: "02f5e957-2545-4155-a558-afc4cef90158", title: "‘Wimp’ particle offers clue to identity of dark matter", date: "2026-09-01", time: "15:33", url: "https://www.ft.com/content/02f5e957-2545-4155-a558-afc4cef90158" },
  { id: "9e63bde5-c677-4ce5-82dc-1a684d9169c8", title: "Swiss finance minister hits out at move to water down UBS capital plans", date: "2026-09-01", time: "14:06", url: "https://www.ft.com/content/9e63bde5-c677-4ce5-82dc-1a684d9169c8" },
  { id: "1ddd0d4a-34bc-4919-a6fb-68dc514b84e9", title: "Trump touts data centre build-out despite voter backlash", date: "2026-09-01", time: "14:00", url: "https://www.ft.com/content/1ddd0d4a-34bc-4919-a6fb-68dc514b84e9" },
  { id: "697253e0-01d3-44fe-85e5-d4d9af207a3c", title: "Donald Trump summons US refiners as Iran war pushes up fuel prices", date: "2026-09-01", time: "14:00", url: "https://www.ft.com/content/697253e0-01d3-44fe-85e5-d4d9af207a3c" },
  { id: "bbbce2e1-6542-4806-9c26-d35e8c3b702e", title: "Saudi and South Korean oil tankers hit in Strait of Hormuz", date: "2026-09-01", time: "13:06", url: "https://www.ft.com/content/bbbce2e1-6542-4806-9c26-d35e8c3b702e" },
  { id: "fa69076c-ca25-4d28-9815-1b1105b51c9c", title: "Far-right Restore Britain receives £500,000 from tech entrepreneur", date: "2026-09-01", time: "13:04", url: "https://www.ft.com/content/fa69076c-ca25-4d28-9815-1b1105b51c9c" },
  { id: "b0bde505-2093-4d72-9f20-b1db23e08261", title: "Warsh clears up his own mess, but US credibility is still stretched", date: "2026-09-01", time: "12:30", url: "https://www.ft.com/content/b0bde505-2093-4d72-9f20-b1db23e08261" },
  { id: "61c9b686-2db7-4f24-80a0-8b75a144c7b6", title: "Keir Starmer to stand down as MP", date: "2026-09-01", time: "12:27", url: "https://www.ft.com/content/61c9b686-2db7-4f24-80a0-8b75a144c7b6" },
  { id: "99a48c12-cb13-47dd-8a31-fff9a157d7ea", title: "ECB to raise rates again amid higher Eurozone inflation", date: "2026-09-01", time: "12:23", url: "https://www.ft.com/content/99a48c12-cb13-47dd-8a31-fff9a157d7ea" },
  { id: "cb0c4fc2-29d6-4465-83a1-7d26fbadff3e", title: "Why Andy Burnham should say: Jackdaw yes, Rosebank no", date: "2026-09-01", time: "12:14", url: "https://www.ft.com/content/cb0c4fc2-29d6-4465-83a1-7d26fbadff3e" },
  { id: "fa63c508-c202-4327-b24c-fe0ecc1bd684", title: "Thames Water should go into administration, says senior Tory MP", date: "2026-09-01", time: "12:14", url: "https://www.ft.com/content/fa63c508-c202-4327-b24c-fe0ecc1bd684" },
  { id: "3d30f551-53af-4fab-8271-3f7fd75d5cfd", title: "Elliott builds stake in French industrial gas group Air Liquide", date: "2026-09-01", time: "12:02", url: "https://www.ft.com/content/3d30f551-53af-4fab-8271-3f7fd75d5cfd" },
  { id: "66df7f0e-ce6a-4619-8044-fa23423db3e7", title: "Shein’s unhappy IPO", date: "2026-09-01", time: "12:00", url: "https://www.ft.com/content/66df7f0e-ce6a-4619-8044-fa23423db3e7" },
  { id: "b189d31a-5e56-471e-91d1-c319aa68f174", title: "How to understand the current puzzle in bonds and equities", date: "2026-09-01", time: "11:57", url: "https://www.ft.com/content/b189d31a-5e56-471e-91d1-c319aa68f174" },
  { id: "4002eb81-07c0-47d0-a076-a6f6331667b2", title: "Rise in UK borrowing costs adds to pressure on Andy Burnham and John Healey", date: "2026-09-01", time: "11:51", url: "https://www.ft.com/content/4002eb81-07c0-47d0-a076-a6f6331667b2" },
  { id: "29f1af13-ecc3-4f26-a479-e6088c67231b", title: "US midterm elections 2026: The FT’s guide", date: "2026-09-01", time: "11:37", url: "https://www.ft.com/content/29f1af13-ecc3-4f26-a479-e6088c67231b" },
  { id: "630c7af3-dab3-47c0-ada3-fd8ed7b75a32", title: "Ukraine eases tensions with Poland over second world war exhumations", date: "2026-09-01", time: "11:14", url: "https://www.ft.com/content/630c7af3-dab3-47c0-ada3-fd8ed7b75a32" },
  { id: "088d3368-bb8b-4ff3-9df7-a7680d4d81b2", title: "Inflation and interest rates tracker: see how your country compares", date: "2026-09-01", time: "11:01", url: "https://www.ft.com/content/088d3368-bb8b-4ff3-9df7-a7680d4d81b2" },
  { id: "009a59d1-d797-490c-bbd7-32c95b8acd90", title: "When is an engineer not an engineer?", date: "2026-09-01", time: "11:00", url: "https://www.ft.com/content/009a59d1-d797-490c-bbd7-32c95b8acd90" },
  { id: "1b4d308c-3d49-4794-8280-187615c21876", title: "Eurozone inflation rises to 3.3% in August", date: "2026-09-01", time: "10:01", url: "https://www.ft.com/content/1b4d308c-3d49-4794-8280-187615c21876" },
  { id: "75a3bbb0-258f-4f04-a757-bd3a967fe9bc", title: "Tories reopen Liz Truss wound with new shadow chancellor", date: "2026-09-01", time: "09:30", url: "https://www.ft.com/content/75a3bbb0-258f-4f04-a757-bd3a967fe9bc" },
  { id: "d3dc2303-6c8c-4681-b045-25005537f455", title: "Ikea cuts prices in Europe by €1.2bn to counter cost of living crisis", date: "2026-09-01", time: "08:00", url: "https://www.ft.com/content/d3dc2303-6c8c-4681-b045-25005537f455" },
  { id: "28a1331a-3f3d-4010-94d3-e07ab58970d5", title: "Bodycote agrees £1.84bn takeover by US buyout firm Veritas", date: "2026-09-01", time: "07:48", url: "https://www.ft.com/content/28a1331a-3f3d-4010-94d3-e07ab58970d5" },
  { id: "64511a2c-34e7-4f98-be24-9e8427b65027", title: "LSE prepares to launch tokenised stocks in digital markets push", date: "2026-09-01", time: "07:30", url: "https://www.ft.com/content/64511a2c-34e7-4f98-be24-9e8427b65027" },
  { id: "0d5b67bd-a07f-47da-9e9b-505df1b4ff33", title: "Partners Group replaces chief executive as pressure grows on flagship fund", date: "2026-09-01", time: "07:17", url: "https://www.ft.com/content/0d5b67bd-a07f-47da-9e9b-505df1b4ff33" },
  { id: "9bb0d48d-9715-4e59-a45d-0324590763f9", title: "South Korea unveils record budget increase to cash in on AI boom", date: "2026-09-01", time: "06:33", url: "https://www.ft.com/content/9bb0d48d-9715-4e59-a45d-0324590763f9" },
  { id: "bcc5aa85-4d23-4a7c-9147-c52aa69027bc", title: "More Warshology", date: "2026-09-01", time: "06:30", url: "https://www.ft.com/content/bcc5aa85-4d23-4a7c-9147-c52aa69027bc" },
  { id: "4da00f00-5c75-4eae-b0da-9770a999dedc", title: "EU diplomatic chief faces up to calls for powers to shift to Commission", date: "2026-09-01", time: "06:00", url: "https://www.ft.com/content/4da00f00-5c75-4eae-b0da-9770a999dedc" },
  { id: "476d21cd-f759-4245-a439-f5b1330c8b30", title: "FTAV’s further reading", date: "2026-09-01", time: "06:00", url: "https://www.ft.com/content/476d21cd-f759-4245-a439-f5b1330c8b30" },
  { id: "06e22622-3e92-46a5-842f-bfa269687aaa", title: "Shein shares slide 10% in Hong Kong trading debut", date: "2026-09-01", time: "05:36", url: "https://www.ft.com/content/06e22622-3e92-46a5-842f-bfa269687aaa" },
  { id: "d39b3d1e-cf49-4990-9991-355f6585ca3a", title: "FirstFT: Big Law urged to cut fees amid AI", date: "2026-09-01", time: "05:31", url: "https://www.ft.com/content/d39b3d1e-cf49-4990-9991-355f6585ca3a" },
];
