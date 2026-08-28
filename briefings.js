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
      time: "17:19 BST",
      lede: "Fed Chair Kevin Warsh delivered a hawkish first Jackson Hole keynote, declining to rule out a September hike and saying the Fed will ‘have work to do’ if inflation doesn’t return to 2% — CME FedWatch-implied odds of a 16 September hike rose to roughly 46-50% and the 2-year Treasury yield jumped to a one-month high, while sterling extended its weekly loss as BoE hike bets slipped further into 2027; separately, Advent and Stripe are reported to have abandoned their $50bn pursuit of PayPal, Principal Financial Group named Blackstone, Ares, KKR and Partners Group as launch partners for its new private-markets 401(k) offering, and the legal desk logged Clifford Chance's US$1bn KEXIM-backed copper-financing mandate alongside South Square's note on the ~US$11.9bn Logan Group Cayman/Hong Kong scheme sanction.",
      bullets: [
        { html: "<strong>Macro &mdash; Warsh's hawkish Jackson Hole debut</strong>: Fed Chair Kevin Warsh gave his first Jackson Hole keynote, avoiding forward guidance but warning the Fed will 'have work to do' if inflation doesn't return to its 2% target; CME FedWatch-implied odds of a 16 September hike rose to roughly 46-50%.", src: "https://www.cnbc.com/2026/08/28/kevin-warsh-jackson-hole-federal-reserve-inflation.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; sterling and gilts react</strong>: Sterling extended its weekly loss to around $1.3582 as BoE hike bets were pushed further into 2027, even as the UK 30-year gilt yield held near a 1998 high around 5.75%.", src: "https://www.tradingview.com/news/reuters.com,2026:newsml_L4N44P0QP:0-sterling-heads-for-weekly-loss-focus-on-jackson-hole-symposium/", srcName: "Reuters (via TradingView)" },
        { html: "<strong>Macro &mdash; Advent/Stripe drop PayPal pursuit</strong>: Advent International and Stripe are said to have abandoned their roughly $50bn pursuit of PayPal, sending PayPal shares sharply lower premarket.", src: "https://www.bloomberg.com/news/articles/2026-08-28/advent-stripe-consortium-is-said-to-drop-pursuit-of-paypal", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Principal opens 401(k)s to private markets</strong>: Principal Financial Group named Blackstone Credit &amp; Insurance, Ares Management, KKR and Partners Group as launch partners for new collective investment trusts blending public and private strategies for US retirement plans.", src: "https://alternativecreditinvestor.com/2026/08/26/principal-opens-401k-plans-to-private-markets/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; South Square on Logan Group's scheme sanction</strong>: South Square's note on the ~US$11.9bn restructuring of Logan Group Company Limited via inter-conditional Cayman and Hong Kong schemes of arrangement, sanctioned by Doyle J on 4 August, with 98.7% of creditors by number voting in favour.", src: "https://southsquare.com/new-judgment-re-logan-group-company-limited-2026-cigc-fsd-65-sanction-hearing/", srcName: "South Square" },
      ],
    },
  },
};
