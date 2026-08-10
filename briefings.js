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
      date: "2026-08-10",
      time: "09:33 BST",
      lede: "Emerging-market stocks and currencies extended gains on reduced September Fed-hike odds after Friday's weak payrolls, oil ticked higher (Brent/WTI) as Strait of Hormuz reopening talks stalled on Iran's conditions, and UK hiring data (REC) pointed to a turn after the longest slump on record; the legal and credit wires stayed quiet into Monday morning, so this run's Credit pass re-verified Fidelis Investors, Sagard Credit Partners and Cross Ocean Partners against current public sources with no material change found.",
      bullets: [
        { html: "<strong>Markets &mdash; Fed odds/EM</strong>: emerging-market stocks and currencies extended gains as traders priced a diminished chance of a September Fed hike following Friday's soft July payrolls print (nonfarm payrolls -23,000).", src: "https://www.bloomberg.com/news/articles/2026-08-10/emerging-market-stocks-currencies-gain-after-soft-us-jobs-data", srcName: "Bloomberg" },
        { html: "<strong>Markets &mdash; Iran/Hormuz</strong>: Brent and WTI ticked higher as talks on reopening the Strait of Hormuz stalled over Iran's conditions, keeping a supply-risk premium in crude ahead of Wednesday's US CPI print.", src: "https://www.cnbc.com/2026/08/10/oil-prices-today-brent-wti-hormuz-trump-iran.html", srcName: "CNBC" },
        { html: "<strong>UK &mdash; labour market</strong>: recruiter body REC said UK hiring is turning a corner after the longest slump on record, a tentative bright spot after last week's PMI data showed the longest UK jobs slump since the financial crisis.", src: "https://www.bloomberg.com/news/articles/2026-08-09/uk-hiring-turns-a-corner-after-longest-slump-on-record-rec-says", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; manager profiles</strong>: this run's rotating re-verification refreshed Fidelis Investors, Sagard Credit Partners and Cross Ocean Partners against current public sources &mdash; no material change to AUM, ownership or strategy was found for any of the three (Sagard's SCP III $1bn first close remains the most recent disclosed development, already on record), and their profile dates were advanced.", src: "https://www.sagard.com/blog/2026/07/15/sagard-credit-partners-holds-us1b-first-close-for-third-private-credit-vintage/", srcName: "Sagard" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-10",
      time: "12:36 BST",
      lede: "Wall Street enters a CPI-heavy week with gold above $4,300/oz and the dollar index below 100 as traders bet the Fed's tightening cycle is over, oil stayed bid on stalled Strait of Hormuz reopening talks, sterling eyed a push back above $1.35 on Wednesday's US inflation print, and with the credit wire quiet since last Friday the freshest desk item on record remains Onex's $500m opportunistic structured-credit raise.",
      bullets: [
        { html: "<strong>Markets &mdash; week ahead</strong>: Wednesday's July CPI and Thursday's PPI headline an inflation-heavy week that will test whether Friday's shock 23,000 nonfarm-payrolls miss marks a genuine dovish shift for the Fed or a one-report overreaction, with a fresh wave of megacap-tech earnings also due.", src: "https://www.investing.com/news/economy-news/five-things-to-watch-in-markets-in-the-week-ahead-4848255", srcName: "Investing.com (Reuters)" },
        { html: "<strong>Markets &mdash; rates/gold</strong>: gold vaulted 2.11% to $4,342/oz and the dollar index slipped below the 100 handle as the US 10-year Treasury yield eased to 4.651%, with bond traders positioning for the Fed's tightening cycle to be finished ahead of Wednesday's CPI.", src: "https://www.riotimesonline.com/global-economy-briefing-august-10-2026/", srcName: "Rio Times Online" },
        { html: "<strong>Markets &mdash; Iran/Hormuz</strong>: Brent and WTI ticked higher as talks on reopening the Strait of Hormuz stalled over Iran's conditions, keeping a supply-risk premium in crude into the CPI print.", src: "https://www.cnbc.com/2026/08/10/oil-prices-today-brent-wti-hormuz-trump-iran.html", srcName: "CNBC" },
        { html: "<strong>UK &mdash; sterling</strong>: GBP/USD could extend its recovery above $1.35 if US inflation cools further on Wednesday, though softer UK growth signalled ahead of the preliminary Q2 GDP estimate risks capping sterling's upside.", src: "https://www.exchangerates.org.uk/news/46765/2026-08-10-pound-to-dollar-week-ahead-forecast-gbp-eyes-move-beyond-1-35.html", srcName: "Exchange Rates UK" },
        { html: "<strong>Credit &mdash; structured credit</strong>: Onex closed its Structured Credit Opportunities Fund II at $500m, above target, on strong global investor demand &mdash; the fund invests globally in CLO equity and debt tranches as part of Onex's $32bn credit platform, and remains the freshest item on Credit's roster with the desk quiet since last Friday.", src: "https://alternativecreditinvestor.com/2026/08/07/onex-secures-500m-for-opportunistic-structured-credit-fund/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-10",
      time: "17:31 BST",
      lede: "US stocks drifted into the CPI-heavy week (Nasdaq slipping, Dow/S&amp;P little changed) while gold hit its highest opening price since early June and oil stayed bid as Strait of Hormuz reopening doubts persisted; on the legal wire Freshfields advised ENEOS on its $1.3bn TPC Holdings acquisition and Kirkland advised Bernhard Capital Partners on taking Bowman Consulting private, the Court of Appeal issued fresh case-management directions in the Sucden/TMT Metals jurisdiction fight, and Credit's rotating re-verification refreshed FitzWalter Capital, Fidera and Attestor with no material profile changes found.",
      bullets: [
        { html: "<strong>Markets &mdash; US equities/gold</strong>: the Nasdaq slipped while the Dow and S&amp;P 500 were little changed as investors held off ahead of Wednesday's CPI and Thursday's PPI; gold opened at its highest level since early June.", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-august-10-dow-sp-500-nasdaq-104358890.html", srcName: "Yahoo Finance" },
        { html: "<strong>Markets &mdash; Iran/Hormuz</strong>: oil extended its climb as doubts grew that the Strait of Hormuz will reopen soon, with Brent +1.4% to $84.68 and WTI +1.4% to $79.30 and daily transits still far below pre-conflict levels.", src: "https://www.upi.com/Top_News/World-News/2026/08/10/Hormuz-Strait-fears-push-oil-price-higher/5881786361765/", srcName: "UPI" },
        { html: "<strong>Legal &mdash; corporate M&amp;A</strong>: Freshfields advised ENEOS Holdings on its ~$1.3bn agreed acquisition of US Gulf Coast C4-hydrocarbons processor TPC Holdings, and Kirkland advised Bernhard Capital Partners on taking Nasdaq-listed Bowman Consulting Group private for $43.00/share (~$1.0bn enterprise value, a 58% premium).", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-bernhard-capital-partners-on-acquisition-of-bowman-consulting-group", srcName: "Kirkland & Ellis" },
        { html: "<strong>Legal &mdash; case law</strong>: the Court of Appeal gave further case-management directions in Sucden Financial's fraud claim against TMT Metals AG and Mr Prateek Gupta, ordering Gupta to serve his defence within 28 days despite a pending Supreme Court application on jurisdiction, on Sucden's undertaking to indemnify his costs if that application succeeds.", src: "https://caselaw.nationalarchives.gov.uk/ewca/civ/2026/1080", srcName: "National Archives" },
        { html: "<strong>Credit &mdash; manager profiles</strong>: this run's rotating re-verification refreshed FitzWalter Capital, Fidera and Attestor against current public sources &mdash; no material change to AUM, ownership or strategy was found for any of the three, and their profile dates were advanced.", src: "https://www.fwcap.com/news/49-fitzwalter-capital-closes-second-fund-at-us1-4bn", srcName: "FitzWalter Capital" },
      ],
    },
  },
};
