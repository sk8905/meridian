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
  { id: "3a99b024-c7bc-4f10-ad77-3cdfccbc39e8", title: "Bank of England probes Asian equity risk at prime brokers", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/3a99b024-c7bc-4f10-ad77-3cdfccbc39e8" },
  { id: "33348272-3045-43aa-9e6b-c4c8ba2f0ac0", title: "Fifa puts the World Cup up for sale", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/33348272-3045-43aa-9e6b-c4c8ba2f0ac0" },
  { id: "be3149fc-9574-406a-8900-7629813f8ccf", title: "Mamdani’s pro-business push", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/be3149fc-9574-406a-8900-7629813f8ccf" },
  { id: "151e0768-7338-46d9-8c3a-49d6d595f8bb", title: "Bags or baubles? How AI wealth divides luxury stocks", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/151e0768-7338-46d9-8c3a-49d6d595f8bb" },
  { id: "78bed947-534d-45fd-a3f5-bbc8b372f66f", title: "European wildfires expose shortage of Canadair water-bomber planes", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/78bed947-534d-45fd-a3f5-bbc8b372f66f" },
  { id: "cc765962-08a9-44e2-ac7d-1e7e10700414", title: "Transport for London demands £1bn from carmakers over allegedly unpaid Ulez charges", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/cc765962-08a9-44e2-ac7d-1e7e10700414" },
  { id: "e888b187-75c0-4233-9588-d1b9948b1b0a", title: "If you think your profession is dying, it could soon be gone", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/e888b187-75c0-4233-9588-d1b9948b1b0a" },
  { id: "c8879a7b-f5cf-49fd-979a-01499c0054c2", title: "Do Britons pay a lot of tax?", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/c8879a7b-f5cf-49fd-979a-01499c0054c2" },
  { id: "30b7d84d-0ff5-433d-a4bb-2b12e9537534", title: "Tory MPs earn millions from advisory roles that Labour pledged to ban", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/30b7d84d-0ff5-433d-a4bb-2b12e9537534" },
  { id: "5ca782bd-5c4a-45f8-9a7a-5793d800321d", title: "Ukraine adapts strikes on Russian energy industry to hit critical components", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/5ca782bd-5c4a-45f8-9a7a-5793d800321d" },
  { id: "99967aac-5878-4789-88ad-f3d826cede6f", title: "The dilution cycle hiding in tech valuations", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/99967aac-5878-4789-88ad-f3d826cede6f" },
  { id: "61b2953d-ee0d-45de-af6e-a9c1cf524b33", title: "Google DeepMind dismantles Nobel-winning AlphaFold team in strategy shift", date: "2026-07-29", time: "05:00", url: "https://www.ft.com/content/61b2953d-ee0d-45de-af6e-a9c1cf524b33" },
  { id: "47e4eb75-c995-40d7-85b1-2f05ff57cee0", title: "Andy Burnham wants partnership with private sector, says UK business secretary", date: "2026-07-28", time: "21:00", url: "https://www.ft.com/content/47e4eb75-c995-40d7-85b1-2f05ff57cee0" },
  { id: "e18fbfc5-bc81-4758-9a82-cc3d53a590e1", title: "Keiko Fujimori sworn in as Peru’s ninth president in 10 years", date: "2026-07-28", time: "20:01", url: "https://www.ft.com/content/e18fbfc5-bc81-4758-9a82-cc3d53a590e1" },
  { id: "a4222e62-b649-4ad6-8ebf-6ea1f7d2f7ad", title: "Greens and Reform take a hit from the Burnham bounce", date: "2026-07-28", time: "19:04", url: "https://www.ft.com/content/a4222e62-b649-4ad6-8ebf-6ea1f7d2f7ad" },
  { id: "20432705-d873-46eb-9b65-b5ae547b1585", title: "Ares’ next big private capital deal looks deceptively close to home", date: "2026-07-28", time: "19:00", url: "https://www.ft.com/content/20432705-d873-46eb-9b65-b5ae547b1585" },
  { id: "3e9e7e69-08c5-4c31-af50-f7d057815946", title: "The US should stay open to open-weight AI", date: "2026-07-28", time: "18:20", url: "https://www.ft.com/content/3e9e7e69-08c5-4c31-af50-f7d057815946" },
  { id: "4213bfb6-6204-47a5-ba1d-99db1d52ca5f", title: "UK charities hit after specialist bank shuts off online services", date: "2026-07-28", time: "17:42", url: "https://www.ft.com/content/4213bfb6-6204-47a5-ba1d-99db1d52ca5f" },
  { id: "8be7a9f5-a440-4f3a-9b0f-1a1358242c35", title: "Shipping group CMA CGM boosted by customers stockpiling to beat Trump tariffs", date: "2026-07-28", time: "17:16", url: "https://www.ft.com/content/8be7a9f5-a440-4f3a-9b0f-1a1358242c35" },
  { id: "1ed4aee0-cbb4-4c98-a2aa-34971ded2583", title: "Ebay to pay $55.7mn to settle case over harassment of company critics", date: "2026-07-28", time: "17:12", url: "https://www.ft.com/content/1ed4aee0-cbb4-4c98-a2aa-34971ded2583" },
  { id: "67236718-fe1a-42bc-9b40-1343f117a973", title: "Turkish politician hit by rent-a-crowd scandal", date: "2026-07-28", time: "16:29", url: "https://www.ft.com/content/67236718-fe1a-42bc-9b40-1343f117a973" },
  { id: "65731780-37da-4e4f-b5f4-eeaed28bcea2", title: "Wachtell Lipton co-chair set to depart for rival Gibson Dunn", date: "2026-07-28", time: "16:23", url: "https://www.ft.com/content/65731780-37da-4e4f-b5f4-eeaed28bcea2" },
  { id: "fe0981ed-dcb2-4799-ab87-4d487c0754e6", title: "We need an OBR for infrastructure", date: "2026-07-28", time: "15:59", url: "https://www.ft.com/content/fe0981ed-dcb2-4799-ab87-4d487c0754e6" },
  { id: "024fb6a1-fb39-4b2d-be3e-2393ed62482a", title: "Apple tops $5tn valuation for first time", date: "2026-07-28", time: "15:54", url: "https://www.ft.com/content/024fb6a1-fb39-4b2d-be3e-2393ed62482a" },
  { id: "0f1e293c-f58c-4849-b576-00b9e4a53d97", title: "Billionaire Dodgers-owner's insurer acknowledges loans to linked entities including 'Dodger Tickets'", date: "2026-07-28", time: "15:47", url: "https://www.ft.com/content/0f1e293c-f58c-4849-b576-00b9e4a53d97" },
  { id: "819cc297-4e1e-493b-91b3-e6b12519214b", title: "Fifa plans stake sale in new $20bn commercial vehicle", date: "2026-07-28", time: "15:01", url: "https://www.ft.com/content/819cc297-4e1e-493b-91b3-e6b12519214b" },
  { id: "d5b45659-ecd5-4bb5-93d0-56b99c798b9d", title: "Maybe the chips are down because memory’s too expensive", date: "2026-07-28", time: "14:43", url: "https://www.ft.com/content/d5b45659-ecd5-4bb5-93d0-56b99c798b9d" },
];
