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
  { id: "34006961-415e-48ae-a2e5-4f35210322ba", title: "The pathway to prosperity is getting harder for developing countries", date: "2026-07-29", time: "16:50", url: "https://www.ft.com/content/34006961-415e-48ae-a2e5-4f35210322ba" },
  { id: "1ceeddf1-0948-4640-aa2c-392ce96fab5a", title: "Wildfire evacuations hurt France’s oyster capital", date: "2026-07-29", time: "16:00", url: "https://www.ft.com/content/1ceeddf1-0948-4640-aa2c-392ce96fab5a" },
  { id: "38420819-2073-42d6-a14f-2c9a28e5970d", title: "South Korea cracks down on risky retail funds after tech rout", date: "2026-07-29", time: "15:59", url: "https://www.ft.com/content/38420819-2073-42d6-a14f-2c9a28e5970d" },
  { id: "504b632a-85bf-4c7b-9def-0b2c02cc46fe", title: "Zijin’s $4bn deal with Allied Gold collapses", date: "2026-07-29", time: "15:22", url: "https://www.ft.com/content/504b632a-85bf-4c7b-9def-0b2c02cc46fe" },
  { id: "e1725176-ebe2-4d29-abe9-a27e11e8c1a8", title: "Elon Musk settles long-running legal battle with X advertisers", date: "2026-07-29", time: "15:09", url: "https://www.ft.com/content/e1725176-ebe2-4d29-abe9-a27e11e8c1a8" },
  { id: "7a33e045-57c0-4cf7-bb1b-a7f4ecdc1e30", title: "Brookfield and NextEra to build $100bn AI campus on ex-nuclear weapons site", date: "2026-07-29", time: "14:54", url: "https://www.ft.com/content/7a33e045-57c0-4cf7-bb1b-a7f4ecdc1e30" },
  { id: "e185a6f7-afa6-4b9e-8d6e-278c47095a67", title: "Half of England declared in drought after heatwaves", date: "2026-07-29", time: "14:26", url: "https://www.ft.com/content/e185a6f7-afa6-4b9e-8d6e-278c47095a67" },
  { id: "b2fe912f-01ef-4daa-874e-a180dfeb728c", title: "Trump vows to deliver ‘beating’ to Iran in retaliation for latest attack", date: "2026-07-29", time: "13:41", url: "https://www.ft.com/content/b2fe912f-01ef-4daa-874e-a180dfeb728c" },
  { id: "882e08d2-4c99-4a49-9afb-f7fa748abe9f", title: "Jim Leaviss, Bond Vigilante, 1971-2026", date: "2026-07-29", time: "13:26", url: "https://www.ft.com/content/882e08d2-4c99-4a49-9afb-f7fa748abe9f" },
  { id: "cd190fd5-5675-4896-87f5-1b3e985e4dde", title: "CMA drops pursuit of private equity executives over price gouging", date: "2026-07-29", time: "13:18", url: "https://www.ft.com/content/cd190fd5-5675-4896-87f5-1b3e985e4dde" },
  { id: "7bb6a7e3-a68d-4b23-aef5-7b93fa21559b", title: "Grant Thornton seals accounting sector’s largest takeover in a generation", date: "2026-07-29", time: "13:08", url: "https://www.ft.com/content/7bb6a7e3-a68d-4b23-aef5-7b93fa21559b" },
  { id: "749bb6e9-35fe-45d9-b359-bf457884ca7c", title: "Assisted dying debate should wait until social care is fixed, Andy Burnham says", date: "2026-07-29", time: "12:47", url: "https://www.ft.com/content/749bb6e9-35fe-45d9-b359-bf457884ca7c" },
  { id: "33a76289-6fff-4282-9270-1e97e95e84b5", title: "How long can big investors ignore climate risk?", date: "2026-07-29", time: "12:35", url: "https://www.ft.com/content/33a76289-6fff-4282-9270-1e97e95e84b5" },
  { id: "0c197937-672a-43a0-b186-9bf9b7f8ccd1", title: "Populism will eat itself", date: "2026-07-29", time: "12:22", url: "https://www.ft.com/content/0c197937-672a-43a0-b186-9bf9b7f8ccd1" },
  { id: "37052f58-e11f-46f7-99d7-5e850d176ef5", title: "The thrill of South Korea’s ‘dopamine apps’", date: "2026-07-29", time: "12:09", url: "https://www.ft.com/content/37052f58-e11f-46f7-99d7-5e850d176ef5" },
  { id: "9d9fefab-fb14-4e0b-9c42-7d9697a151ae", title: "Daily Mail publisher seeks £10mn upfront from Prince Harry and other claimants", date: "2026-07-29", time: "12:08", url: "https://www.ft.com/content/9d9fefab-fb14-4e0b-9c42-7d9697a151ae" },
  { id: "ca8893d3-41c2-474f-b140-85072149a5e5", title: "EU warns it will investigate Fifa’s $20bn commercial venture", date: "2026-07-29", time: "12:04", url: "https://www.ft.com/content/ca8893d3-41c2-474f-b140-85072149a5e5" },
  { id: "47560cb6-4804-460e-a0fc-2b89d556bee3", title: "Russia puts Telegram founder Pavel Durov on international wanted list", date: "2026-07-29", time: "11:45", url: "https://www.ft.com/content/47560cb6-4804-460e-a0fc-2b89d556bee3" },
  { id: "ed644365-4902-4f62-b57a-089ef243eef1", title: "Andy Burnham opens door to tax rises to pay for social care overhaul", date: "2026-07-29", time: "11:40", url: "https://www.ft.com/content/ed644365-4902-4f62-b57a-089ef243eef1" },
  { id: "2e3048dc-e003-44be-957c-3f119bde3f48", title: "FTSE 100 hits all-time high as ‘anti-tech’ index shines in global chip rout", date: "2026-07-29", time: "11:21", url: "https://www.ft.com/content/2e3048dc-e003-44be-957c-3f119bde3f48" },
  { id: "7b1197a5-e59a-4beb-ab83-e800e6ebc527", title: "BNY to adopt blockchain technology for records in new era for Wall Street", date: "2026-07-29", time: "11:00", url: "https://www.ft.com/content/7b1197a5-e59a-4beb-ab83-e800e6ebc527" },
  { id: "bf4c32f3-735d-4742-a5b6-65b404f70cc7", title: "Inflation gauge reboot to ease pressure on Federal Reserve to raise interest rates", date: "2026-07-29", time: "11:00", url: "https://www.ft.com/content/bf4c32f3-735d-4742-a5b6-65b404f70cc7" },
  { id: "6c79711b-d541-4b7d-8c82-54450fda973f", title: "What’s up with CCC-rated bond spreads?", date: "2026-07-29", time: "10:00", url: "https://www.ft.com/content/6c79711b-d541-4b7d-8c82-54450fda973f" },
  { id: "509a6a94-8342-49c1-965f-66abff88b977", title: "US says it intercepted ‘surprise’ Iranian missile attack", date: "2026-07-29", time: "09:51", url: "https://www.ft.com/content/509a6a94-8342-49c1-965f-66abff88b977" },
  { id: "85c978d9-6c85-415b-93ce-e7092ddc2181", title: "Andy Burnham has Labour voters’ attention but for how long?", date: "2026-07-29", time: "09:30", url: "https://www.ft.com/content/85c978d9-6c85-415b-93ce-e7092ddc2181" },
  { id: "d5912454-6a02-4017-8a85-30a11d806780", title: "Glencore trading profits double on Middle East turmoil", date: "2026-07-29", time: "08:43", url: "https://www.ft.com/content/d5912454-6a02-4017-8a85-30a11d806780" },
  { id: "18508c64-5951-4003-a3f1-ce7f2ad0f8ec", title: "St James’s Place inflows drop as UK pensions tax change looms", date: "2026-07-29", time: "08:13", url: "https://www.ft.com/content/18508c64-5951-4003-a3f1-ce7f2ad0f8ec" },
  { id: "be6ae5f1-01fd-41d2-bd0f-e2f492076b6e", title: "Asia’s richest man Gautam Adani weighs bid for UK’s top port operator", date: "2026-07-29", time: "07:42", url: "https://www.ft.com/content/be6ae5f1-01fd-41d2-bd0f-e2f492076b6e" },
  { id: "90701678-5f49-43ba-b79a-ebf8aaf0a0f2", title: "UBS joins Wall Street rivals in trading-led profit surge", date: "2026-07-29", time: "07:04", url: "https://www.ft.com/content/90701678-5f49-43ba-b79a-ebf8aaf0a0f2" },
  { id: "e5f66a11-02bc-4caa-bdbf-9ed1f60747f5", title: "AI isn’t taking jobs, yet", date: "2026-07-29", time: "06:30", url: "https://www.ft.com/content/e5f66a11-02bc-4caa-bdbf-9ed1f60747f5" },
  { id: "e7bf9856-7e88-4615-a19e-c87f8ef207d5", title: "FTAV’s further reading", date: "2026-07-29", time: "06:30", url: "https://www.ft.com/content/e7bf9856-7e88-4615-a19e-c87f8ef207d5" },
  { id: "e8e3a60a-059c-45b5-bbe3-49add14fd343", title: "Tech rout roils markets after SK Hynix profits disappoint", date: "2026-07-29", time: "06:13", url: "https://www.ft.com/content/e8e3a60a-059c-45b5-bbe3-49add14fd343" },
  { id: "12fda371-31f6-4c88-899f-36d2cf147e00", title: "EU crisis chief warns wildfires are a risk from scaling back green agenda", date: "2026-07-29", time: "06:03", url: "https://www.ft.com/content/12fda371-31f6-4c88-899f-36d2cf147e00" },
  { id: "5f41c99b-a866-45d5-844b-1114969175fc", title: "Bank of Japan normalisation will continue amid market tensions", date: "2026-07-29", time: "06:00", url: "https://www.ft.com/content/5f41c99b-a866-45d5-844b-1114969175fc" },
  { id: "76b48bee-41ec-4dbe-b42f-f84d807743d9", title: "The LLM FOMC votes to raise", date: "2026-07-29", time: "06:00", url: "https://www.ft.com/content/76b48bee-41ec-4dbe-b42f-f84d807743d9" },
  { id: "e0153a16-aa0a-4d01-8614-9d332aa86690", title: "Standard Chartered launches $1bn share buyback as bank embraces AI", date: "2026-07-29", time: "05:30", url: "https://www.ft.com/content/e0153a16-aa0a-4d01-8614-9d332aa86690" },
  { id: "1c90934c-80c1-422c-b95b-5821a6fa9ec7", title: "FirstFT: AI sell-off sparks hedge fund collateral calls", date: "2026-07-29", time: "05:30", url: "https://www.ft.com/content/1c90934c-80c1-422c-b95b-5821a6fa9ec7" },
  { id: "ae77f88d-7cde-43aa-ac03-204eae25edc2", title: "The Story of Money", date: "2026-07-29", time: "05:04", url: "https://www.ft.com/content/ae77f88d-7cde-43aa-ac03-204eae25edc2" },
  { id: "7e149ac8-2ce2-4266-8940-192f9821b33c", title: "PwC published ‘thought leadership’ reports marred by AI hallucinations", date: "2026-07-29", time: "05:01", url: "https://www.ft.com/content/7e149ac8-2ce2-4266-8940-192f9821b33c" },
  { id: "fedcff18-6ccb-4cbe-b4c2-b852d37943ae", title: "China’s commercial space boom poses strategic challenge for the US", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/fedcff18-6ccb-4cbe-b4c2-b852d37943ae" },
];
