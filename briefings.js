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
      date: "2026-08-08",
      time: "17:25 BST",
      lede: "September Fed-hike odds stayed depressed after Friday's shock 23,000 payrolls drop, with the 12 August CPI print now framed as the real test for Chair Warsh; on the credit wire Blackstone Credit &amp; Insurance pitched a fresh $36bn+ debt package to help finance Anthropic's use of Google TPU chips and Barings lent $213m against a newly built Chicago office tower, while in Legal Mr Justice Hildyard's written reasons sanctioning the TG Jones (former WH Smith) restructuring plans were handed down and Mr Justice Leech stayed the Cheyne v TMF Trustee Hunkem&ouml;ller noteholder claim pending parallel New York litigation.",
      bullets: [
        { html: "<strong>US rates</strong>: odds of a 16 September Fed hike stayed sharply lower after Friday's 23,000 nonfarm-payrolls miss, with Goldman's Jan Hatzius noting its composite underlying job-growth measure fell from ~70,000 to ~5,000 and markets now looking to the 12 August CPI print as the decisive data point for Chair Warsh.", src: "https://www.cnbc.com/2026/08/07/odds-the-fed-hikes-in-september-tumble-following-big-july-jobs-miss.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; AI financing</strong>: Blackstone Credit &amp; Insurance held early talks to gauge investor interest in a second mega debt package (initial proposal &ge;$36bn) to finance Anthropic's use of Google TPU chips, following the ~$35bn Apollo/Blackstone package agreed roughly two months earlier.", src: "https://www.bloomberg.com/news/articles/2026-08-04/blackstone-has-pitched-mega-debt-package-for-anthropic-chip-deal", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; real estate debt</strong>: Barings provided $213m of three-year financing, arranged by JLL Capital Markets, against a newly-constructed c.500,000 sq ft office property at 360 North Green St in Chicago.", src: "https://crenews.com/2026/08/03/barings-lends-213mln-against-newly-constructed-chicago-office-property/", srcName: "CRE News" },
        { html: "<strong>Legal &mdash; restructuring</strong>: Mr Justice Hildyard's written reasons sanctioning TG Jones' (the former WH Smith high-street chain) two inter-conditional Part 26A restructuring plans were handed down, with Slaughter and May and South Square's Tom Smith KC, Ryan Perkins and Jon Colclough acting for the plan companies/sponsor Modella Capital.", src: "https://www.slaughterandmay.com/recent-work/tg-jones-on-its-successful-restructuring/", srcName: "Slaughter and May" },
        { html: "<strong>Legal &mdash; banking/RI</strong>: Mr Justice Leech granted a case-management stay of the Cheyne v TMF Trustee claim &mdash; funds challenging a Hunkem&ouml;ller debt 'up-tiering' and subsequent enforcement &mdash; pending determination of parallel New York proceedings against the same defendants.", src: "https://www.bailii.org/ew/cases/EWHC/Ch/2026/2091.html", srcName: "BAILII" },
      ],
    },
  },
};
