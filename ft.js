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
  { id: "b0bde505-2093-4d72-9f20-b1db23e08261", title: "Warsh clears up his own mess, but US credibility is still stretched", date: "2026-09-01", time: "12:30", url: "https://www.ft.com/content/b0bde505-2093-4d72-9f20-b1db23e08261" },
  { id: "61c9b686-2db7-4f24-80a0-8b75a144c7b6", title: "Keir Starmer to stand down as MP", date: "2026-09-01", time: "12:27", url: "https://www.ft.com/content/61c9b686-2db7-4f24-80a0-8b75a144c7b6" },
  { id: "99a48c12-cb13-47dd-8a31-fff9a157d7ea", title: "ECB to raise rates again amid higher Eurozone inflation", date: "2026-09-01", time: "12:23", url: "https://www.ft.com/content/99a48c12-cb13-47dd-8a31-fff9a157d7ea" },
  { id: "cb0c4fc2-29d6-4465-83a1-7d26fbadff3e", title: "Why Andy Burnham should say: Jackdaw yes, Rosebank no", date: "2026-09-01", time: "12:14", url: "https://www.ft.com/content/cb0c4fc2-29d6-4465-83a1-7d26fbadff3e" },
  { id: "fa63c508-c202-4327-b24c-fe0ecc1bd684", title: "Thames Water should go into administration, says senior Tory MP", date: "2026-09-01", time: "12:14", url: "https://www.ft.com/content/fa63c508-c202-4327-b24c-fe0ecc1bd684" },
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
  { id: "e6f5f97a-b199-444e-aaec-b8199359b08e", title: "Japan’s benchmark yield hits 3% as global bond sell-off deepens", date: "2026-09-01", time: "07:04", url: "https://www.ft.com/content/e6f5f97a-b199-444e-aaec-b8199359b08e" },
  { id: "9bb0d48d-9715-4e59-a45d-0324590763f9", title: "South Korea unveils record budget increase to cash in on AI boom", date: "2026-09-01", time: "06:33", url: "https://www.ft.com/content/9bb0d48d-9715-4e59-a45d-0324590763f9" },
  { id: "bcc5aa85-4d23-4a7c-9147-c52aa69027bc", title: "More Warshology", date: "2026-09-01", time: "06:30", url: "https://www.ft.com/content/bcc5aa85-4d23-4a7c-9147-c52aa69027bc" },
  { id: "4da00f00-5c75-4eae-b0da-9770a999dedc", title: "EU diplomatic chief faces up to calls for powers to shift to Commission", date: "2026-09-01", time: "06:00", url: "https://www.ft.com/content/4da00f00-5c75-4eae-b0da-9770a999dedc" },
  { id: "476d21cd-f759-4245-a439-f5b1330c8b30", title: "FTAV’s further reading", date: "2026-09-01", time: "06:00", url: "https://www.ft.com/content/476d21cd-f759-4245-a439-f5b1330c8b30" },
  { id: "06e22622-3e92-46a5-842f-bfa269687aaa", title: "Shein shares slide 10% in Hong Kong trading debut", date: "2026-09-01", time: "05:36", url: "https://www.ft.com/content/06e22622-3e92-46a5-842f-bfa269687aaa" },
  { id: "d39b3d1e-cf49-4990-9991-355f6585ca3a", title: "FirstFT: Big Law urged to cut fees amid AI", date: "2026-09-01", time: "05:31", url: "https://www.ft.com/content/d39b3d1e-cf49-4990-9991-355f6585ca3a" },
  { id: "15de7725-234a-448a-9cc6-12500a47aada", title: "This time it really was different", date: "2026-09-01", time: "05:30", url: "https://www.ft.com/content/15de7725-234a-448a-9cc6-12500a47aada" },
  { id: "e7015d4a-fe58-4b9d-a414-6815b0d7e634", title: "‘Conflict of attrition’ in Iran could keep inflation high, ECB policymaker warns", date: "2026-09-01", time: "05:07", url: "https://www.ft.com/content/e7015d4a-fe58-4b9d-a414-6815b0d7e634" },
  { id: "0d8cb572-de82-4e67-b745-8200a95545f8", title: "Apple’s new boss starts out asset-light and option-rich", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/0d8cb572-de82-4e67-b745-8200a95545f8" },
  { id: "986af514-adb7-4fe1-9490-e1ceba63be24", title: "A bankruptcy brawl on the golf course", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/986af514-adb7-4fe1-9490-e1ceba63be24" },
  { id: "87075ed2-3ec3-4a01-9568-0effc4157a11", title: "Andy Burnham signals fresh moves on living costs as political battle lines harden", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/87075ed2-3ec3-4a01-9568-0effc4157a11" },
  { id: "58840205-448b-4d17-9dd7-0313c8b8ed81", title: "Can Donald Trump’s 65bn-barrel deal revive Venezuela’s oil industry?", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/58840205-448b-4d17-9dd7-0313c8b8ed81" },
  { id: "7499413f-1bc2-44d5-b44a-a14d879b9b8a", title: "UK growth figures are set for another end-of-year slump. Why?", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/7499413f-1bc2-44d5-b44a-a14d879b9b8a" },
  { id: "b359c765-29e2-4f5f-b72c-cd36668621e1", title: "Disasters to cost world $450bn a year from climate change and development", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/b359c765-29e2-4f5f-b72c-cd36668621e1" },
  { id: "76086bda-04fd-41c9-a924-c5392258d3af", title: "Glasgow, the UK’s asylum hub, finds itself a target for the far right", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/76086bda-04fd-41c9-a924-c5392258d3af" },
  { id: "5240a6ac-b2e8-4897-a0a4-cbc7fc283bc9", title: "Wall Street banks push Big Law to cut fees because of AI", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/5240a6ac-b2e8-4897-a0a4-cbc7fc283bc9" },
  { id: "e3a8670f-eaf8-4930-ad34-14a2ee071fe9", title: "British banks crack down on Covid loan defaulters after government pressure", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/e3a8670f-eaf8-4930-ad34-14a2ee071fe9" },
  { id: "40ea5643-865a-4443-b591-3ecd0458078b", title: "Illegal streaming costs UK £1.4bn a year, broadcasters and sports bodies warn", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/40ea5643-865a-4443-b591-3ecd0458078b" },
  { id: "5f6b0dc5-04ac-404d-8c84-dce07a11ed74", title: "How Detroit landmark Michigan Central won back its lustre", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/5f6b0dc5-04ac-404d-8c84-dce07a11ed74" },
  { id: "fc2b67d2-f272-40c7-8d75-802cbc251f26", title: "The Ukrainian chicken baron that EU farmers love to hate", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/fc2b67d2-f272-40c7-8d75-802cbc251f26" },
  { id: "5b1762e6-a3b9-4853-8547-1181355970b5", title: "Third of FTSE 350 companies pay less for audits", date: "2026-09-01", time: "05:00", url: "https://www.ft.com/content/5b1762e6-a3b9-4853-8547-1181355970b5" },
];
