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
  { id: "2a2d9bab-7441-446b-8e2e-7463583738c2", title: "Back to school: meet PE’s new headmasters", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/2a2d9bab-7441-446b-8e2e-7463583738c2" },
  { id: "638974ef-2f93-4d64-a118-980e9edb56b6", title: "Ukraine considers relaxing curfew rules despite Russian attacks", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/638974ef-2f93-4d64-a118-980e9edb56b6" },
  { id: "2a41f6a2-468b-44ae-bee7-a6159186c83c", title: "ECB must be prepared to lift interest rates further, says top policymaker", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/2a41f6a2-468b-44ae-bee7-a6159186c83c" },
  { id: "80d02797-9a54-47e0-8bc3-a7144354da93", title: "AI sounds the death knell for audit fee inflation", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/80d02797-9a54-47e0-8bc3-a7144354da93" },
  { id: "c51dec0b-977e-463e-9590-daff0d91a8a6", title: "The wheels are coming off the US world order", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/c51dec0b-977e-463e-9590-daff0d91a8a6" },
  { id: "1101d3c3-8355-4fbf-86b9-1761a56c19c2", title: "Notes on campy clothing (and Dolly Parton)", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/1101d3c3-8355-4fbf-86b9-1761a56c19c2" },
  { id: "7cce7c38-bce2-4718-b6e7-d0f4ae4c8751", title: "Protecting Tower of London views would make skyscrapers unviable, City warns", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/7cce7c38-bce2-4718-b6e7-d0f4ae4c8751" },
  { id: "1e55d948-98e5-4c1a-8a09-51e1311fcf63", title: "EU accelerates plans to break up diplomatic service", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/1e55d948-98e5-4c1a-8a09-51e1311fcf63" },
  { id: "8160b331-35c3-4735-a684-f1f2d95fddde", title: "‘Plan 2’ graduates earning less than £45,000 are unlikely to clear debts", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/8160b331-35c3-4735-a684-f1f2d95fddde" },
  { id: "c4cc661e-cb38-4d40-9d34-950c22e02301", title: "Kylian Mbappé-backed health start-up expands to west Africa", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/c4cc661e-cb38-4d40-9d34-950c22e02301" },
  { id: "2cedfbc4-0519-4373-8de0-63b9e62f1137", title: "I was wrong about Bad Girl Books", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/2cedfbc4-0519-4373-8de0-63b9e62f1137" },
  { id: "b0ea5b66-73f4-4e82-bacc-855072c0bffa", title: "How UK-Israel relations reached their worst point in decades", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/b0ea5b66-73f4-4e82-bacc-855072c0bffa" },
  { id: "5a3c1a4f-f6d1-49ef-badc-9a21c4111c93", title: "Want to eat like a real Chicagoan? Go to these three neighbourhoods", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/5a3c1a4f-f6d1-49ef-badc-9a21c4111c93" },
  { id: "76a9c61b-021f-482d-8978-6480e9ba23e8", title: "German industry pushes to increase work week to 40 hours", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/76a9c61b-021f-482d-8978-6480e9ba23e8" },
  { id: "e99bf461-e2e1-44bf-9b18-c5d20e9b5f7c", title: "Poet Arch Hades: ‘I don’t have to share a space with another human being’", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/e99bf461-e2e1-44bf-9b18-c5d20e9b5f7c" },
  { id: "b5e0d1b3-6f17-4250-a73f-ffcbe54709a6", title: "The modern face of the debutante ball", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/b5e0d1b3-6f17-4250-a73f-ffcbe54709a6" },
  { id: "1188b86e-b279-4cc7-a890-b4e2ce02cdc2", title: "Russia’s ‘Trojan horse’ in Italy tests Giorgia Meloni", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/1188b86e-b279-4cc7-a890-b4e2ce02cdc2" },
  { id: "0a019cc6-3ce3-4034-b88f-302a56888095", title: "Advisory firm Interpath looking for its own US deal", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/0a019cc6-3ce3-4034-b88f-302a56888095" },
  { id: "732c05fe-ca63-4048-8784-aebe80b8b1f4", title: "National data centre projects are consolidating America’s AI lead", date: "2026-09-02", time: "05:00", url: "https://www.ft.com/content/732c05fe-ca63-4048-8784-aebe80b8b1f4" },
  { id: "6cf367bc-95b0-4f1f-b149-a25684adefc3", title: "Russia secretly helping Iran develop supersonic cruise missiles", date: "2026-09-01", time: "21:00", url: "https://www.ft.com/content/6cf367bc-95b0-4f1f-b149-a25684adefc3" },
  { id: "9334212a-3cc4-426c-9cbe-57cb48033603", title: "AI hits college graduates in the heart of America’s data centre boom", date: "2026-09-01", time: "19:28", url: "https://www.ft.com/content/9334212a-3cc4-426c-9cbe-57cb48033603" },
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
];
