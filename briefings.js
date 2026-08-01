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
      date: "2026-08-01",
      time: "09:25 BST",
      lede: "Washington is weighing a fresh wave of strikes on Iran as soon as this weekend even after the Senate blocked a war-powers resolution, UK house-price growth cooled to 1.8% in July, and Wall Street braces for a jobs report and a heavy earnings week &mdash; while Ardian extends unitranche financing to French software group Arche MC2 and Weil advises MarketAxess on its $6bn sale to Intercontinental Exchange.",
      bullets: [
        { html: "<strong>Iran</strong>: officials say the Trump administration is planning a further wave of strikes on Iranian targets as soon as this weekend, even as the Senate voted 50-49 to block a war-powers resolution that would have required congressional authorisation for further action.", src: "https://edition.cnn.com/2026/08/01/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Congress</strong>: the Senate's war-powers resolution on Iran was blocked in a 50-49 vote as the conflict escalates, leaving the administration's strike planning unconstrained by a formal authorisation requirement.", src: "https://rollcall.com/2026/07/30/iran-war-powers-resolution-blocked-in-senate-as-conflict-heats-up/", srcName: "Roll Call" },
        { html: "<strong>UK housing</strong>: Nationwide reported annual house-price growth slowing to 1.8% in July, a cooling from June's pace as higher-for-longer rates continue to weigh on affordability.", src: "https://www.mortgagesolutions.co.uk/mortgage-news/2026/07/31/slowdown-in-uk-annual-house-price-growth-to-1-8-in-july-nationwide/", srcName: "Mortgage Solutions" },
        { html: "<strong>Private credit</strong>: Ardian renewed its backing of French software publisher Arche MC2 with new unitranche financing, extending an existing relationship as the firm continues to back the platform's growth.", src: "https://www.ardian.com/news-insights/press-releases/ardian-renews-its-backing-leading-software-publisher-arche-mc2-new", srcName: "Ardian" },
        { html: "<strong>M&amp;A</strong>: Weil advised MarketAxess on its agreed $6bn acquisition by Intercontinental Exchange, one of the week's largest announced financial-markets-infrastructure deals.", src: "https://www.weil.com/articles/weil-advises-marketaxess-in-its-6b-acquisition-by-intercontinental-exchange", srcName: "Weil" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-01",
      time: "12:18 BST",
      lede: "Spain&rsquo;s Pedro S&aacute;nchez hit out at EU critics over Madrid&rsquo;s migrant crisis as Fifa abandoned its $20bn plan to sell stakes in a World Cup venture after global backlash, US officials say fresh strikes on Iran could come as soon as this weekend, long-dated Treasury yields keep climbing in the wake of Fed Chair Warsh&rsquo;s hawkish hold, and Ares Management posted a record $36.4bn fundraising quarter led by private credit.",
      bullets: [
        { html: "<strong>Iran</strong>: US officials say the Trump administration is planning a further wave of strikes on Iranian energy targets as soon as this weekend, extending the conflict that has been unsettling oil and bond markets.", src: "https://edition.cnn.com/2026/08/01/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Spain</strong>: Prime Minister Pedro S&aacute;nchez hit out at EU leaders&rsquo; criticism of Madrid&rsquo;s handling of the migrant crisis &mdash; over 50,000 migrants crossed into Ceuta in a single day, with at least 57 dead &mdash; calling for a meeting of the bloc&rsquo;s home affairs ministers as tensions over immigration policy mount.", src: "https://www.ft.com/content/1b3f09b5-897e-4b7a-9949-2c4d9a32929e", srcName: "FT" },
        { html: "<strong>Fifa</strong>: abandoned its $20bn plan to sell stakes in a World Cup commercial venture after global backlash, a setback for president Gianni Infantino&rsquo;s push to bring in outside investment.", src: "https://www.ft.com/content/58400cf0-20df-46ef-975b-7414806e09de", srcName: "FT" },
        { html: "<strong>Rates</strong>: long-dated Treasury yields extended their climb in FT&rsquo;s Chart of the Week, as investors keep reassessing Fed Chair Kevin Warsh&rsquo;s rate path after J.P. Morgan brought forward its call for a December hike following the Fed&rsquo;s hawkish July hold.", src: "https://www.ft.com/content/42257873-e801-49b8-967f-a15ea1129541", srcName: "FT" },
        { html: "<strong>Private credit</strong>: Ares Management raised a record $36.4bn in Q2, with its credit division contributing $23.7bn &mdash; the largest share of any strategy &mdash; as firmwide AUM climbed 17.3% year-on-year to $671.3bn.", src: "https://alternativecreditinvestor.com/2026/07/31/private-credit-drives-record-36bn-fundraising-quarter-for-ares/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-01",
      time: "17:08 BST",
      lede: "The Supreme Court ruled that an unrecognised foreign judgment can still found an English bankruptcy petition, Weil flagged a UK stapled-exchange restructuring strategy gaining steam for US-listed companies after the New Fortress Energy Chapter 15 recognition, US officials say fresh strikes on Iran could land as soon as this weekend, and Wall Street heads into next week bracing for the July jobs report after a blockbuster Amazon quarter.",
      bullets: [
        { html: "<strong>Supreme Court</strong>: ruled in Drelle v Servis-Terminal LLC that an unrecognised foreign money judgment for a definite sum can still found an English bankruptcy petition under s.267 of the Insolvency Act 1986, overturning the Court of Appeal.", src: "https://southsquare.com/valeriy-ernestovich-drelle-respondent-v-servis-terminal-llc-in-liquidation-in-the-russian-federation-appellant/", srcName: "South Square" },
        { html: "<strong>Restructuring</strong>: Weil says the UK &ldquo;stapled-exchange&rdquo; strategy for restructuring US-listed companies is gaining steam, after an SDNY Chapter 15 decision recognised the New Fortress Energy English restructuring plan.", src: "https://restructuring.weil.com/cross-border/the-uk-stapled-exchange-strategy-for-restructuring-u-s-listed-companies-gains-steam-southern-district-of-new-york-bankruptcy-court-blesses-fossil-strategy-and-provides-clarity-in-new-fortress/", srcName: "Weil" },
        { html: "<strong>Iran</strong>: US officials say the Trump administration is planning a further wave of strikes on Iranian energy targets as soon as this weekend, extending a conflict that has kept oil and bond markets on edge.", src: "https://edition.cnn.com/2026/08/01/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Wall Street</strong>: investors head into next week bracing for the July jobs report (due 7 August, consensus +91,000) and a heavy earnings slate, with the S&amp;P 500 still digesting Amazon's blowout AWS-led quarter and Apple's softer guidance.", src: "https://www.investing.com/news/economy-news/teetering-us-stock-market-faces-jobs-report-big-earnings-week-4827318", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>M&amp;A</strong>: Davis Polk's mid-year recap of UK public takeovers finds fewer but larger bids in H1 2026, an average premium near 40% and rising US-bidder participation.", src: "https://www.davispolk.com/insights/client-update/uk-takeovers-mid-year-recap-developments-and-key-trends", srcName: "Davis Polk" },
      ],
    },
  },
};
