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
      time: "09:23 BST",
      lede: "Iran set out formal terms for reopening the Strait of Hormuz as an Oman-mediated temporary transit deal was reported close, while a wave of cyberattacks hit Point72, Millennium, Citadel and Two Sigma and Millennium separately partnered with Anthropic to build an AI risk analyst; on the legal wire, White &amp; Case advised Alimentation Couche-Tard on its US$8.6bn acquisition of &#379;abka and Weil completed Brookfield's buyout of Oaktree's remaining stake, while Blackstone Credit &amp; Insurance's $1.3bn Paratek/Radius financing and Apollo's curbed $25bn Debt Solutions fund withdrawals were backfilled onto Credit's deal and intel rosters.",
      bullets: [
        { html: "<strong>Markets &mdash; Iran/Hormuz</strong>: Iran's national security chief set out formal demands for reopening the Strait of Hormuz &mdash; lifting the US naval blockade, withdrawing forces, ending the war, compensation and releasing frozen Iranian assets &mdash; as Iran and Oman said a temporary transit-route deal is 'very close' but won't mean an immediate reopening.", src: "https://us.cnn.com/2026/08/09/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Hedge funds &mdash; cybersecurity</strong>: Point72, Millennium, Citadel and Two Sigma were targeted in a wave of attempted cyberattacks, underscoring the sector's growing exposure as AI tooling expands its attack surface.", src: "https://fortune.com/2026/08/06/major-hedge-funds-targeted-in-wave-of-attempted-cyberattacks/", srcName: "Fortune" },
        { html: "<strong>Hedge funds &mdash; AI</strong>: Millennium partnered with Anthropic to build an in-house AI risk analyst, the latest large multi-strat manager to formalise an AI partnership for portfolio risk management.", src: "https://www.bloomberg.com/news/articles/2026-08-06/millennium-partners-with-anthropic-to-develop-ai-risk-analyst", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; corporate</strong>: White &amp; Case advised Alimentation Couche-Tard on its landmark US$8.6bn acquisition of Polish retailer &#379;abka Group, while Weil advised Brookfield on completing its acquisition of Oaktree's remaining stake and Kirkland advised Nordic Capital on acquiring BWXT Medical.", src: "https://www.whitecase.com/news/press-release/white-case-advises-alimentation-couche-tard-landmark-us86-billion-acquisition", srcName: "White & Case" },
        { html: "<strong>Credit &mdash; backfilled deal/intel</strong>: Blackstone Credit &amp; Insurance's $1.3bn financing backing the Paratek Pharmaceuticals/Radius Health combination and Apollo's curbed withdrawals from its $25bn Debt Solutions fund (redemption requests hit 17%) were added to the historical record, alongside Mubadala Capital's completed integration of its $25bn credit business for third-party investors.", src: "https://www.cnbc.com/2026/06/23/apollo-private-credit-fund-withdrawals-redemptions.html", srcName: "CNBC" },
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
