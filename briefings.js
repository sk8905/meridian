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
      date: "2026-08-09",
      time: "05:24 BST",
      lede: "Markets held Friday's post-payrolls relief into the weekend, with the 12 August CPI print now framed as the decisive data point for Fed Chair Warsh, while sterling stayed on the back foot on UK-US yield narrowing after last week's &pound;3tn debt milestone; on the wire, Ares filed a rated-notes feeder for its Infrastructure Debt Fund VI, Clifford Chance advised Emirates NBD on acquiring HSBC Bank Egypt's retail business, White &amp; Case and Kirkland acted on opposite sides of LS Power's purchase of a Constellation ERCOT gas plant, and a backfilled 2020 Selecta Group scheme of arrangement (Kirkland for the company, South Square as counsel) was added to Legal's restructuring roster.",
      bullets: [
        { html: "<strong>US rates</strong>: stocks and Treasurys held their post-payrolls relief into the weekend, with September Fed-hike odds still depressed and the 12 August CPI print now the decisive data point for Chair Warsh.", src: "https://www.arkansasonline.com/news/2026/aug/08/stocks-rise-treasury-yields-fall-after-jobs-cut/", srcName: "AP" },
        { html: "<strong>UK sterling</strong>: GBP/USD stayed weaker as UK-US yield spreads narrowed, with forecasters flagging an autumn fiscal shock risk to the pound's summer rally ahead of the Budget.", src: "https://www.exchangerates.org.uk/news/46721/2026-08-04-british-pound-forecast-gbp-s-summer-rally-could-face-an-autumn-fiscal-shock.html", srcName: "Exchange Rates UK" },
        { html: "<strong>Credit &mdash; structured/CFO</strong>: Ares' infrastructure-debt platform filed a Form D for Ares Infrastructure Debt Fund VI (USD U) Rated Notes Feeder LP, a CFO-style vehicle repackaging LP interests into rated notes, with $167.5m sold to date per a July 2026 amendment.", src: "https://www.sec.gov/Archives/edgar/data/2045634/000101297525000689/0001012975-25-000689-index.html", srcName: "SEC EDGAR" },
        { html: "<strong>Legal &mdash; banking</strong>: Clifford Chance is advising Emirates NBD on its proposed acquisition of HSBC Bank Egypt's retail banking business, while also advising Russula and Hydnum Steel on a &euro;150m COFIDES investment commitment for Spain's first green-steel plant.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advising-emirates-nbd-on-the-proposed-acquisition-of-the-retail-banking-business-of-hsbc-bank-egypt.html", srcName: "Clifford Chance" },
        { html: "<strong>Legal &mdash; corporate</strong>: White &amp; Case advised LS Power and Kirkland advised Constellation on opposite sides of LS Power's acquisition of a Constellation natural-gas plant in ERCOT, while a backfilled Selecta Group Part 26 scheme (Kirkland for the company, South Square as counsel, sanctioned 2020) was added to the restructuring roster.", src: "https://www.whitecase.com/news/press-release/white-case-advises-ls-power-acquisition-natural-gas-power-plant-ercot", srcName: "White & Case" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-08",
      time: "12:27 BST",
      lede: "Markets extended Friday's post-payrolls relief into the weekend with September Fed-hike odds still depressed and the 12 August CPI print now seen as the real decider for Chair Warsh, UK house-price growth slowed to its weakest since November 2023, White &amp; Case advised lenders on a &euro;730m Sonnedix renewables financing while A&amp;O Shearman advised FNZ on selling FNZ Bank to an Advent-led consortium, and Pollen Street Capital surfaced as the busiest name on the credit wire with three separate specialty-finance facilities.",
      bullets: [
        { html: "<strong>US rates</strong>: stocks held their gains and Treasury yields stayed lower a day after July's shock 23,000 nonfarm-payrolls drop, with September Fed rate-hike odds still depressed from last week's highs and the 12 August CPI print now framed as the decisive data point for Chair Warsh.", src: "https://www.arkansasonline.com/news/2026/aug/08/stocks-rise-treasury-yields-fall-after-jobs-cut/", srcName: "AP" },
        { html: "<strong>UK housing</strong>: UK house-price growth slowed to just 0.1% year-on-year in July &mdash; the weakest since November 2023 &mdash; as mortgage rates edged back up amid Middle East-driven uncertainty.", src: "https://uk.finance.yahoo.com/news/uk-house-prices-stagnant-amid-070710355.html", srcName: "Yahoo Finance UK" },
        { html: "<strong>Legal &mdash; banking</strong>: White &amp; Case advised a nine-bank syndicate on a &euro;730m financing refinancing and expanding ~540MW of Sonnedix solar and battery-storage assets across Italy, Spain, Portugal and France.", src: "https://www.whitecase.com/news/press-release/white-case-advises-lenders-eur730-million-sonnedix-financing", srcName: "White & Case" },
        { html: "<strong>Legal &mdash; corporate</strong>: A&amp;O Shearman advised FNZ on selling its German custody-bank business, FNZ Bank, to an Advent International-led consortium including HarbourVest Partners, as FNZ refocuses on its core wealth-management technology platform.", src: "https://www.aoshearman.com/en/news/ao-shearman-represents-fnz-on-the-sale-of-fnz-bank-to-advent", srcName: "A&O Shearman" },
        { html: "<strong>Credit &mdash; specialty finance</strong>: Pollen Street Capital surfaced across three separate facilities this run &mdash; &pound;250m to MCR Property Group, &pound;300m to renewables funder SRE Capital and &euro;100m to Irish SME lender SME Finance and Leasing Solutions &mdash; underscoring its growing asset-backed lending footprint.", src: "https://www.pollenstreetgroup.com/pollen-street-capital-announces-250-million-senior-secured-credit-facility-to-mcr-property-group/", srcName: "Pollen Street" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-08",
      time: "21:24 BST",
      lede: "Equities extended Friday's relief rally into the weekend wrap, with Treasury yields still lower after the shock 23,000 payrolls miss and the 12 August CPI print now framed as the real test for Chair Warsh; on the credit wire Onex closed its second CLO-focused structured credit fund at $500m and Blue Owl's Q2 results lifted total platform AUM to $319bn (credit AUM $158.1bn), while Legal held steady with no fresh tracked-firm alerts, cases or restructuring filings since the 17:25 run.",
      bullets: [
        { html: "<strong>US rates</strong>: stocks rose and Treasury yields fell as markets continued digesting Friday's 23,000 nonfarm-payrolls miss, with September Fed-hike odds still sharply lower and the 12 August CPI print now the decisive data point for Chair Warsh.", src: "https://www.arkansasonline.com/news/2026/aug/08/stocks-rise-treasury-yields-fall-after-jobs-cut/", srcName: "AP" },
        { html: "<strong>Credit &mdash; structured credit/CLO</strong>: Onex closed its second opportunistic structured credit fund, Onex Structured Credit Opportunities Fund II, at $500m above target, investing globally in CLO equity and debt tranches as part of Onex's $32bn credit platform.", src: "https://alternativecreditinvestor.com/2026/08/07/onex-secures-500m-for-opportunistic-structured-credit-fund/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; manager AUM</strong>: Blue Owl Capital's Q2 2026 results lifted total firm AUM to $319.0bn (from $315bn in Q1) and Credit-platform AUM to $158.1bn, confirmed in the 8 August re-verification pass.", src: "https://www.prnewswire.com/news-releases/blue-owl-capital-inc-second-quarter-2026-results-302838675.html", srcName: "PR Newswire" },
        { html: "<strong>Credit &mdash; real estate debt</strong>: Barings provided $213m of three-year financing, arranged by JLL Capital Markets, against a newly-constructed c.500,000 sq ft office property at 360 North Green St in Chicago.", src: "https://crenews.com/2026/08/03/barings-lends-213mln-against-newly-constructed-chicago-office-property/", srcName: "CRE News" },
        { html: "<strong>Legal &mdash; restructuring</strong>: Mr Justice Hildyard's written reasons sanctioning TG Jones' (the former WH Smith high-street chain) two inter-conditional Part 26A restructuring plans remain the most recent tracked filing &mdash; Slaughter and May and South Square's Tom Smith KC, Ryan Perkins and Jon Colclough acted for the plan companies/sponsor Modella Capital &mdash; with no new tracked-firm alerts, cases or schemes surfacing since the 17:25 run.", src: "https://www.slaughterandmay.com/recent-work/tg-jones-on-its-successful-restructuring/", srcName: "Slaughter and May" },
      ],
    },
  },
};
