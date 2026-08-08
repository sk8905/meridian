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
      date: "2026-08-08",
      time: "09:23 BST",
      lede: "UK public debt formally passed the &pound;3tn mark months ahead of the OBR's own projection, and Andy Burnham is on track for the second-highest annual debt-interest bill of any UK PM on record, as a separate S&amp;P Global PMI read showed the UK's jobs downturn now as long as the one seen in the financial crisis; on the wire, KKR moved to shore up its FS KKR Capital BDC with a $150m tender offer and $150m convertible-preferred issuance, Kirkland advised Talcott Financial Group and Goldman Sachs on launching Bermuda reinsurance sidecar West Grove Re, and A&amp;O Shearman advised Charterhouse on its acquisition of AIM-delisted Animalcare Group.",
      bullets: [
        { html: "<strong>UK fiscal</strong>: net public debt tipped over &pound;3tn in July &mdash; months ahead of the OBR's spring projection that the threshold would not be crossed until September &mdash; after standing at &pound;2.99tn at the close of June.", src: "https://www.cityam.com/uk-debt-hits-3-trillion-milestone/", srcName: "CityAM" },
        { html: "<strong>UK fiscal</strong>: on current OBR forecasts, PM Andy Burnham is on track for the second-highest average annual debt-interest bill of any UK prime minister on record (&pound;112.8bn a year), behind only Rishi Sunak's &pound;121.5bn.", src: "https://www.cityam.com/andy-burnham-is-on-course-to-rack-up-the-highest-debt-interest-bill-on-record/", srcName: "CityAM" },
        { html: "<strong>UK labour market</strong>: S&amp;P Global's UK PMI showed private-sector employers cutting headcount for a 22nd straight month in July &mdash; a jobs downturn now running as long as the one seen during the global financial crisis.", src: "https://www.bloomberg.com/news/articles/2026-08-05/uk-in-longest-jobs-slump-since-financial-crisis-pmi-shows", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; BDCs</strong>: KKR is shoring up its KKR-advised BDC, FS KKR Capital Corp, with a $150m tender offer alongside a $150m convertible-preferred issuance, disclosed alongside FS KKR's Q2 2026 results.", src: "https://www.prnewswire.com/news-releases/fs-kkr-capital-corp-announces-second-quarter-2026-results-declares-third-quarter-2026-distribution-of-0-44-per-share-302844444.html", srcName: "PR Newswire" },
        { html: "<strong>Legal &mdash; funds/banking</strong>: Kirkland &amp; Ellis advised Talcott Financial Group on launching Bermuda reinsurance sidecar West Grove Re alongside Goldman Sachs, while A&amp;O Shearman advised private-equity firm Charterhouse on its acquisition of AIM-delisted veterinary group Animalcare.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-talcott-financial-group-on-launch-of-west-grove-re", srcName: "Kirkland & Ellis" },
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
      date: "2026-08-07",
      time: "21:34 BST",
      lede: "July's shock 23,000 nonfarm-payrolls drop pulled September Fed hike odds down to roughly 44% and pushed the S&amp;P 500 to a fresh record close, Ares led a $2.2bn direct loan for MedImpact's acquisition of Medical Card System while also scaling back a &euro;1bn private-credit continuation vehicle to ~&euro;400m after investor pushback, Oaktree and the Ishbia family struck a $2.05bn strategic capital partnership with UWM Holdings (Kirkland advising Oaktree), and Bloomberg's July hedge-fund survey showed Millennium and Whale Rock hit by the AI-stock selloff while Citadel's flagship surged on its Situational Awareness stock purchase.",
      bullets: [
        { html: "<strong>US data watch</strong>: July nonfarm payrolls unexpectedly fell 23,000 (vs +83,000 consensus) with 103,000 of downward May/June revisions; CME FedWatch-implied odds of a 16 September Fed hike collapsed to roughly 44% from ~81% a week earlier, and the S&amp;P 500 closed at a fresh record 7,757.64 while the Nasdaq Composite jumped 1.3%.", src: "https://www.bloomberg.com/news/articles/2026-08-07/us-treasuries-rally-as-soft-jobs-data-trims-fed-rate-hike-bets", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; financing</strong>: Ares Management is leading a $2.2bn direct loan financing MedImpact Holdings' acquisition of Puerto Rico-based Medical Card System, one of the largest private-credit transactions of 2026, expected to price at least 8 points over the benchmark rate.", src: "https://www.bloomberg.com/news/articles/2026-08-05/ares-eyes-2-billion-loan-deal-in-slow-year-for-private-credit", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; strategy</strong>: Oaktree Capital Management and the Ishbia family's SFS Group Capital agreed a $2.05bn preferred-equity-plus-warrants partnership with UWM Holdings, which is suspending its common dividend and planning a $400m rights offering; Kirkland &amp; Ellis advised Oaktree.", src: "https://www.businesswire.com/news/home/20260805591453/en/UWM-Holdings-Corporation-Announces-$2.05-Billion-Strategic-Capital-Partnership-with-the-Ishbia-Family-and-Oaktree", srcName: "Business Wire" },
        { html: "<strong>Credit &mdash; continuation vehicles</strong>: Ares Management cut a planned &euro;1bn private-credit continuation vehicle to about &euro;400m after investors challenged the underlying loan valuations, part of a wider pattern of downsized European credit CVs in recent months.", src: "https://www.marketscreener.com/news/ares-scales-back-eur1-billion-private-credit-vehicle-after-investor-pushback-ft-reports-ce7f50dcde8ff522", srcName: "MarketScreener / FT" },
        { html: "<strong>Hedge funds</strong>: Bloomberg's July survey showed the AI/semiconductor selloff whipsawing managers &mdash; Millennium fell 2.1% and Alex Sacerdote's Whale Rock sank 21.7% &mdash; while Citadel's flagship jumped to a 5.9% monthly gain after buying the bulk of AI-focused Situational Awareness's stock portfolio as that fund unraveled under margin calls.", src: "https://www.bloomberg.com/news/articles/2026-08-05/citadel-s-hedge-fund-soars-after-situational-awareness-bet", srcName: "Bloomberg" },
      ],
    },
  },
};
