// =============================================================================
// briefings.js — the tri-daily AI market briefings (Morning · Afternoon ·
// Evening) surfaced by the header "Briefing" button (v2/js/nav-actions.js).
//
// GENERATION (see docs/refresh-routines.md): these are written by the 5×/day
// refresh routine, NOT at runtime. Each run regenerates whichever slot the clock
// is in (morning < 12:00 · afternoon 12:00–17:00 · evening ≥ 17:00 BST), so the
// current slot is always freshest and every slot is refreshed at least once a day.
//
// GROUNDING (HOUSE_STYLE / non-negotiables): a briefing is a SUMMARY of items
// Wire already holds — every bullet carries a real `src` URL to the wire/desk item
// it compresses. No invented figures, no uncited claims. A thin news slot gets a
// short briefing, never padding. Served no-cache + tokenless (see _headers), so a
// routine refresh is picked up without a code token bump (HOUSE_STYLE T1).
// =============================================================================
export const BRIEFINGS = {
  tz: "BST",
  // Ordered for the slot chips; the view picks the current slot by clock.
  order: ["morning", "afternoon", "evening"],
  slots: {
    morning: {
      label: "Morning",
      date: "2026-08-28",
      time: "09:19 BST",
      lede: "Fed Chair Kevin Warsh delivers his first Jackson Hole keynote later today, with strategists eyeing an inflation-focused message that could lift long-dated Treasuries, as markets also digest Nvidia's reported $12.9bn deal to buy open-source AI platform Hugging Face; in credit, Fortress and Canyon Partners both priced new European-eligible CLOs this week (€406m and $500m respectively), and the desk's rotating re-verification refreshed profiles for Permira Credit, Manulife | Comvest and BNP Paribas AM's private-debt arm; the legal desk's Kirkland/South Square coverage of the TG Jones High Street restructuring-plan sanction remains the standout recent case-law item.",
      bullets: [
        { html: "<strong>Macro &mdash; Warsh's Jackson Hole keynote</strong>: Fed Chair Kevin Warsh gives his first Jackson Hole speech as chair today at 10am ET, with strategists saying an inflation-focused message could give long-dated Treasuries a boost; investors also face 'big questions' on his framework with few easy answers.", src: "https://www.bloomberg.com/news/articles/2026-08-28/an-inflation-focused-warsh-speech-can-give-long-bonds-a-boost", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Nvidia/Hugging Face</strong>: Nvidia has reportedly agreed to buy open-source AI model repository Hugging Face for $12.9bn, deepening its push into the AI software ecosystem after an earlier rejected $500m stake offer this year.", src: "https://www.cnbc.com/2026/08/27/nvidia-hugging-face-acquisition.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; Fortress/Canyon CLO prints</strong>: Fortress priced its third European CLO, BSL 2026-3, at €406m amid strong investor demand, while Canyon Partners closed its 30th active CLO, Canyon CLO 2026-2, at $500m &mdash; both newly added to the desk's structured-credit tape this run.", src: "https://www.fortress.com/news/2026-08-14-fortress-investment-group-announces-pricing-of-third-european-clo-transaction", srcName: "Fortress" },
        { html: "<strong>Credit &mdash; manager re-verification</strong>: This run's rotating profile check refreshed Permira Credit, Manulife | Comvest Credit Partners and BNP Paribas Asset Management's Private Debt &amp; Real Assets arm against current public sources.", src: "https://www.permira.com/investing/credit", srcName: "Permira" },
        { html: "<strong>Legal &mdash; TG Jones restructuring plan</strong>: Kirkland's analysis of Re TG Jones High Street Limited [2026] EWHC 2079 (Ch) &mdash; the Part 26A landlord-plan sanction exercising cross-class cramdown &mdash; remains the desk's standout recent case-law item on equity retention and cramdown limits.", src: "https://www.kirkland.com/publications/kirkland-alert/2026/08/tg-jones-english-court", srcName: "Kirkland & Ellis" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-28",
      time: "12:35 BST",
      lede: "Fed Chair Kevin Warsh delivers his first Jackson Hole keynote today, with Morgan Stanley expecting him to skip explicit September/December rate signals in favour of longer-run Fed-reform themes, as Wednesday's second GDP estimate confirmed Q2 growth unrevised at 1.5%; in credit, South Square flagged the Singapore International Commercial Court's first-known recognition of an Indonesian corporate bankruptcy, while the desk's rotating re-verification refreshed Muzinich, Allianz Global Investors and L&amp;G Asset Management's profiles against current public sources.",
      bullets: [
        { html: "<strong>Macro &mdash; Warsh's Jackson Hole test</strong>: Fed Chair Kevin Warsh gives his first Jackson Hole keynote today at 10am ET; Morgan Stanley economists expect him to avoid near-term rate guidance and instead focus on longer-run Fed-reform themes.", src: "https://investinglive.com/central-banks/jackson-hole-preview-fed-chair-warsh-likely-to-skip-september-and-december-rate-signals/", srcName: "investinglive.com" },
        { html: "<strong>Macro &mdash; Q2 GDP confirmed</strong>: The BEA's second estimate confirmed US Q2 2026 real GDP growth unrevised at 1.5% annualised, with real GDI running hotter, ahead of Wednesday's Jackson Hole keynote and the 16 September FOMC.", src: "https://www.bea.gov/news/2026/gdp-second-estimate-and-corporate-profits-2nd-quarter-2026", srcName: "U.S. Bureau of Economic Analysis" },
        { html: "<strong>Legal &mdash; Indonesian bankruptcy recognition</strong>: South Square reported the Singapore International Commercial Court's first-known recognition of an Indonesian corporate bankruptcy (the Sritex textile group's PKPU proceeding) under Singapore's Model Law enactment, granting an extended moratorium and investigative powers to the foreign administrators.", src: "https://southsquare.com/first-known-recognition-of-indonesian-corporate-bankruptcy-in-singapore/", srcName: "South Square" },
        { html: "<strong>Credit &mdash; manager re-verification</strong>: This run's rotating profile check refreshed Muzinich &amp; Co, Allianz Global Investors and L&amp;G Asset Management (LGIM) against current public sources; AllianzGI's private-markets AUM stands at &euro;97bn of a &euro;598bn total, and L&amp;G's private-markets AUM rose to &pound;79bn (+22% YoY) at H1 2026.", src: "https://www.allianzgi.com/en/our-firm", srcName: "Allianz Global Investors" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-28",
      time: "21:23 BST",
      lede: "Fed Chair Kevin Warsh's hawkish Jackson Hole debut sent stocks to a lower weekly close (S&amp;P -0.25%, Nasdaq -0.52%, Dow -0.02%) as fed-funds futures priced a 57.5% chance of a 16 September hike, up from 35.5% a day earlier, while sterling booked its own weekly loss on BoE hike bets pushed into 2027; in credit, LuminArx Capital Management and fintech lender Bridge launched a $500m direct-lending partnership for US retail suppliers and Ares disclosed the $7.1bn final close of its inaugural Credit Secondaries Fund, while the legal desk logged Latham's advisory roles on Nscale's US$790m Norway AI-data-centre financing and CVC's majority-stake partnership with UK proptech OpenRent.",
      bullets: [
        { html: "<strong>Macro &mdash; Warsh's Jackson Hole keynote resolves hawkish</strong>: Fed Chair Kevin Warsh's debut Jackson Hole speech said this summer's cooler inflation readings 'do not tell me that underlying trends have meaningfully improved' and that the Fed still has 'work to do'; stocks closed the week lower (S&amp;P 500 -0.25% to 7,711.76, Nasdaq -0.52%, Dow -0.02%) as fed-funds futures priced a 57.5% chance of a September hike, up from 35.5% the prior day.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-august-28-dow-sp-500-nasdaq-dip-fed-warsh-jackson-hole-speech-081514091.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; sterling's weekly loss</strong>: Sterling was on track for its first weekly drop against the dollar in over a month as BoE hike expectations were pushed toward 2027, with LSEG data showing only ~24bp of tightening priced in by December.", src: "https://www.fxstreet.com/news/british-pound-edges-higher-despite-delaying-boe-rate-hike-expectations-202608280140", srcName: "FXStreet" },
        { html: "<strong>Credit &mdash; LuminArx/Bridge $500m retail-lending partnership</strong>: LuminArx Capital Management and fintech lending platform Bridge (a 2023 Citi spin-out) launched a $500m direct-lending partnership funding US consumer-packaged-goods brands and retail suppliers, with Bridge's AI-driven underwriting paired against LuminArx's credit capital.", src: "https://alternativecreditinvestor.com/2026/08/27/bridge-launches-500m-direct-lending-fund-for-us-retail-suppliers/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Ares' $7.1bn credit-secondaries final close</strong>: Ares Management disclosed the final close of its inaugural Ares Credit Secondaries Fund (ACS) at roughly $7.1bn including affiliated vehicles and leverage, doubling its $2bn target and marking what Ares calls the largest dedicated institutional credit-secondaries fund globally by LP commitments.", src: "https://ir.ares.com/news/ares-raises-over-dollar7-billion-for-leading-credit-secondaries-strategy/0a384df0-b0d7-4092-87e5-a0f0d9e71a25", srcName: "Ares Management" },
        { html: "<strong>Legal &mdash; Latham on Nscale's Norway data-centre financing</strong>: Latham &amp; Watkins advised AI-infrastructure hyperscaler Nscale on a US$790m senior secured project financing for a 108MW AI data centre in Narvik, Norway &mdash; the largest AI-infrastructure investment in the country &mdash; with Goldman Sachs International as sole structuring lead.", src: "https://www.lw.com/en/news/2026/08/latham-advises-on-nscale-usd790-million-norway-data-center-financing", srcName: "Latham & Watkins" },
      ],
    },
  },
};
