// =============================================================================
// Research — sell-side / house research notes, surfaced in the Home wire under
// the "Research" lane (RSCH desk, teal). This Gmail sweep is the SOLE source of
// the lane: a live Google-News auto-pipe (Apollo / Oaktree / AQR) was tried and
// retired because those house sites block server-side reads, so every item fell
// back to "open at the publisher" and none read in-pane — the forwarded email
// versions carry a clean "read online" link and render in the pane instead.
//
// Source: research emails the reader signs up to and forwards (via a Gmail
// filter) to the connected mailbox skaidrive2@gmail.com — e.g. JPMorgan's
// "Eye on the Market" (Cembalest), Apollo Academy's "Daily Spark" (Slok),
// Goldman Sachs "Briefings", Morgan Stanley "Thoughts on the Market", PIMCO's
// Economic Outlook, the BlackRock Investment Institute Weekly Commentary, and
// Guggenheim's Global CIO Outlook. They are pulled from Gmail through the
// connector, parsed, and written here as feed items. This list is regenerated on
// each refresh (see docs/refresh-routines.md), exactly like newsletters.js.
//
// We keep only the headline, a one-line topic summary, the house/author and the
// note's own "read online" link — never the full note body. This deployment
// sits behind Cloudflare Access (single reader), so the list is personal to it.
//
// PUBLISHERS maps a sender address/domain to a display name (used by the refresh
// routine to recognise a research sender and label it). Extend it as new research
// sign-ups arrive; confirm each sender's real domain on first receipt (the Gmail
// sweep writes the domain it actually saw). A sender NOT in this map is treated as
// a generic newsletter (newsletters.js), not research — this map is what routes an
// email to the Research lane.
export const PUBLISHERS = {
  // CONFIRMED senders (real emails received + swept below). research.js and
  // newsletters.js PUBLISHERS are kept DISJOINT by domain (research houses live only
  // here); as a runtime safety net, if a research-house note ever lands in
  // newsletters.js, isResearchPublication() reclassifies it into the Research lane
  // (Research wins over Newsletters).
  "newsletter.mail.gs.com": "Goldman Sachs Research",
  "guggenheiminvestments.com": "Guggenheim Investments",
  // Rating-agency private-credit / credit research — signed up 2026-10-07. Routed here so
  // the moment real content arrives it lands in Research. Confirm the content-sender domain
  // on the first real note (Fitch Wire so far mails from comms@fitchratings.com; Moody's
  // registration from idm-no-reply@moodys.com; S&P not yet delivered).
  "fitchratings.com": "Fitch Ratings",
  "moodys.com": "Moody's Ratings",
  "spglobal.com": "S&P Global Ratings",
  // S&P Dow Jones Indices "Daily Index Insights" — CONFIRMED 2026-10-14. Content sender is
  // `spdji@spglobal.com` (same spglobal.com domain as Ratings, so label by the ADDRESS):
  // a short teaser linking one public commentary article per day. Sweep EVERY issue.
  "spdji@spglobal.com": "S&P Dow Jones Indices",
  // Apollo "Daily Spark" (Torsten Slok) — CONFIRMED + swept 2026-10-09. The real
  // content sender is `agm@e.apollo.com`, so the routed domain is `e.apollo.com`
  // (NOT the earlier-guessed `email.apolloacademy.com`). The notes publish openly on
  // apolloacademy.com, so the canonical "read online" link is the Daily Spark archive.
  "e.apollo.com": "Apollo Academy",
  // UBS Global Wealth Management Chief Investment Office — signed up 2026-10-09 (daily
  // economic briefing + CIO commentary). Content sender is `message-center@mailing.ubs.com`.
  // Activated on request; the first real CIO note will route to Research automatically.
  "mailing.ubs.com": "UBS CIO",
  // JP Morgan Private Bank "Top Market Takeaways" — CONFIRMED + swept 2026-10-09. Content
  // sender is `jp.morgan.private.bank@pb.jpmorgan.com` (older forwards: jpmpb.jpmorgan.com).
  "pb.jpmorgan.com": "JPMorgan Private Bank",
  "jpmpb.jpmorgan.com": "JPMorgan Private Bank",
  // With Intelligence "Private Credit Insights" — CONFIRMED + swept 2026-10-08. A curated
  // weekly private-credit intelligence roundup. Content sender is `withintelligence-email.com`.
  "withintelligence-email.com": "With Intelligence",
  // M&G "Bond Vigilantes" — M&G Investments' fixed-income research blog — CONFIRMED + swept
  // 2026-10-12 ("Bonds have their mojo back", Joe Sullivan-Bissett). Content sender is
  // `info@digital.mandg.com`; canonical "read online" is the bondvigilantes.com post.
  "digital.mandg.com": "M&G Bond Vigilantes",
  // PIMCO — signed up 2026-10-12 (registration/verify mail from `no_reply@pimco.com`). PIMCO's
  // macro research is its Economic Outlook / Cyclical & Secular Outlook / Viewpoints notes.
  // Activated on request so the first real note routes to Research automatically; CONFIRM the
  // actual content-sender domain against that first delivery (the verify mail's `pimco.com` may
  // not be the sending domain for the notes themselves, as with Apollo/UBS).
  "pimco.com": "PIMCO",
  "preqin.blackrock.com": "Preqin",
  // J.P. Morgan CIB "In Context" — content sender `in.context.newsletter@jpmcib.jpmorgan.com`, first swept 2026-10-14.
  "jpmcib.jpmorgan.com": "J.P. Morgan",
  // SIGNED UP / arriving but NOT yet activated — a sweep candidate, pending a call on
  // whether it belongs in Research vs Newsletters (see docs/refresh-routines.md §4a):
  //   • preqin.blackrock.com — Preqin "First Close" (private-markets data/intelligence).
  // Confirm each content-sender domain against the first real email, then activate (as
  // Apollo/UBS/JPM/With Intelligence were — the confirmation's sender domain is often NOT
  // the content sender's).
  // "oaktreecapital.com": "Oaktree Capital",          // also piped live via gnews
  // "morganstanley.com": "Morgan Stanley Research",   // Thoughts on the Market
  // "blackrock.com": "BlackRock Investment Institute",
};

// isResearchPublication — the canonical test for "this house belongs in the Research
// lane, not Newsletters." A sell-side bank, asset manager, rating agency or markets-
// intelligence house, matched on the item's `publication` name (NOT its title, so a
// Bloomberg piece that merely mentions Goldman stays a newsletter). The feed engine
// (v2/js/home/glance.js) uses this to RECLASSIFY any research-house note that the
// Gmail sweep misfiled into newsletters.js back into Research — a runtime safety net
// so a routing slip can never again show house research under "Newsletters". Keep this
// list in step with the PUBLISHERS map above (same houses, by display-name pattern).
const RESEARCH_PUBLISHER_RE = /\b(?:apollo|goldman\s+sachs|guggenheim|fitch|moody'?s|s&p\s+global|s&p\s+dow\s+jones|morgan\s+stanley|jp\.?\s*morgan|jpmorgan|pimco|blackrock|preqin|ubs|with\s+intelligence|oaktree|aqr|m&g|bond\s+vigilantes)\b/i;
export function isResearchPublication(name) {
  return RESEARCH_PUBLISHER_RE.test(String(name || ""));
}

// RESEARCH — the swept research notes, newest first. Regenerated on each refresh
// from the Gmail sweep above; starts empty and fills as the reader signs up to and
// forwards research emails. Item shape mirrors newsletters.js exactly:
//   { id, publication, author, series, title, date, time, summary, url }
// NEVER fabricate an item — every entry keeps a real "read online" URL and the
// real send date/time (unknown fields are null). See docs/refresh-routines.md.
// Author `title` and `summary` as PLAIN TEXT with real Unicode punctuation
// (’ ‘ “ ” — – …), NOT HTML entities: the wire renders a feed title through esc(),
// so an entity like "AI&rsquo;s" or "S&amp;P" would show LITERALLY. (Only the
// AI-briefing data in briefings.js uses authored HTML entities — it decodes them.)
export const RESEARCH = [
  {
    "id": "rsch-pimco-creditmarketlens-softwareloans-20261019",
    "publication": "PIMCO",
    "author": "Lotfi Karoui",
    "series": "The Credit Market Lens",
    "title": "Improved Optics But Unchanged Economics in Software Loans",
    "date": "2026-10-19",
    "time": "18:15",
    "summary": "Software loan spreads have widened again since early September after tightening over the summer; the average bid is still about 8 points below non-software peers (about 10 in June), and PIMCO expects the valuation gap and issuer dispersion to persist amid AI disruption risk and elevated refinancing costs.",
    "url": "https://mktg-alerts.pimco.com/v/ODc5LUFFTC0xNTgAAAGk9CIEuGemg7TnLUblRGqSR2lbSiXpZtF78FjA6hB-XhMcT5lZHnCpcEzVQoEn3E-wOnBbpzI="
  },
  {
    "id": "rsch-spdji-dailyindexinsights-20261019",
    "publication": "S&P Dow Jones Indices",
    "author": null,
    "series": "Daily Index Insights",
    "title": "Daily Index Insights",
    "date": "2026-10-19",
    "time": "14:31",
    "summary": "39 years ago today, the Dow Jones Industrial Average hosted its largest ever one-day percentage drop, falling 22.6%, while stocks from Mexico to New Zealand fell by...",
    "url": "https://www.spglobal.com/spdji/en/commentary/article/daily-index-insights"
  },
  {
    "id": "rsch-withintelligence-weekly-yorkville-20261019",
    "publication": "With Intelligence",
    "author": null,
    "series": "Weekly roundup",
    "title": "Yorkville America plans $1.3bn acquisition | Plus more intel",
    "date": "2026-10-19",
    "time": "15:06",
    "summary": "Weekly roundup of investor and manager updates: Yorkville America plans a $1.3bn acquisition of an SMA-only adviser platform; MFS to shake up value-focused teams as a PM exits; Vest Financial to make a CIT push.",
    "url": "https://pardot.withintelligence.com/webmail/284832/3606501481/23fcdd7c20d30df223e97a343c7c91b872fd93050b0c889e2b0abf0950a7caa2"
  },
  {
    "id": "rsch-preqin-firstclose-stoporgoforipos-20261019",
    "publication": "Preqin",
    "author": "Shaun Beaney",
    "series": "First Close",
    "title": "Stop or go for IPOs?",
    "date": "2026-10-19",
    "time": "12:22",
    "summary": "A pipeline of IPOs and ‘supportive’ conditions could be good news for private markets; EY tracked 908 IPOs in January–September with proceeds of $290bn, and the Preqin Venture Capital index returned 16.4% over the 12 months to Q1 2026.",
    "url": "https://go.preqin.com/webmail/909852/2211402970/10a07fc888799ba93601ccf55d4c7de31840aed202839f3c768c45aa7be76665"
  },
  {
    "id": "rsch-apollo-ma-boom-20261019",
    "publication": "Apollo Academy",
    "author": "Huw van Steenis, Torsten Slok",
    "series": "The Daily Spark",
    "title": "M&A Is Booming Because Rapid Change Is Forcing Firms to Rethink Their Business",
    "date": "2026-10-19",
    "time": "11:47",
    "summary": "M&A is on pace for a near-record year, with 42 deals above $10bn worth over $1.1tn in the first nine months; sponsor tech deal value fell 67% while non-tech PE rose 17%.",
    "url": "https://www.apolloacademy.com/the-daily-spark/"
  },
  {
    "id": "rsch-ubs-donovan-scapegoateconomics-20261019",
    "publication": "UBS CIO",
    "author": "Paul Donovan",
    "series": "Morning audio comment",
    "title": "Scapegoat economics",
    "date": "2026-10-19",
    "time": "07:53",
    "summary": "China’s Q3 GDP grew 4.5% y/y, so reported 2026 growth is likely to meet the target, though the domestic economy remains lackluster and exports remain the growth driver; weekend violent protests in France may sharpen focus on next year’s presidential elections.",
    "url": "https://www.ubs.com/global/en/wealth-management/insights/chief-investment-office/market-insights/paul-donovan.html"
  },
  {
    id: "rsch-apollo-investgermanysummit-20261018",
    publication: "Apollo Academy",
    author: "Huw van Steenis",
    series: "The Daily Spark",
    title: "Invest in Germany Summit, Berlin, October 19–20",
    date: "2026-10-18",
    time: "11:46",
    summary: "German pension reforms could generate around €90bn of new annual funded pension flows, roughly 2% of GDP, as the country seeks capital for AI, infrastructure, defence and energy resilience; funded pension assets are only about 7% of GDP.",
    url: "https://www.apolloacademy.com/the-daily-spark/",
  },
  {
    id: "rsch-apollo-bondsweakerhedge-20261017",
    publication: "Apollo Academy",
    author: "Torsten Slok",
    series: "The Daily Spark",
    title: "Bonds Are a Weaker Hedge as Duration Falls",
    date: "2026-10-17",
    time: "11:46",
    summary: "The 30-year Treasury’s duration has fallen from 25 years in 2020 to 14 today on higher yields and coupons, so long Treasuries offer less cushion per dollar in a downturn.",
    url: "https://www.apolloacademy.com/the-daily-spark/",
  },
  {
    id: "rsch-fitch-wire-gccsovereignbudgets-20261016",
    publication: "Fitch Ratings",
    author: null,
    series: "Fitch Wire Daily",
    title: "GCC Sovereign Budget Balances Weaken, Balance Sheets Generally Strong",
    date: "2026-10-16",
    time: "16:13",
    summary: "The US-Iran conflict is weighing on the budgetary performance of most Gulf Cooperation Council sovereigns in 2026, but the strong balance sheets of higher-rated sovereigns continue to underpin their ratings.",
    url: "https://goto.fitchratings.com/v/NzMyLUNLSC03NjcAAAGk5D8CxL0VuJqzQynSdzT1FZj4UPueKXRpjVDv4haftJLXyKMadyvyqeri4hVdMtK3BX6DrqU=#gcc-sovereigns"
  },
  {
    id: "rsch-fitch-wire-chilecopperwindfall-20261016",
    publication: "Fitch Ratings",
    author: null,
    series: "Fitch Wire Daily",
    title: "Chile's Copper Windfall Prompts Easing of Budget Austerity",
    date: "2026-10-16",
    time: "16:13",
    summary: "Chile's 2027 budget, presented by President José Antonio Kast in September, uses a commodity-driven revenue windfall to relax previously pledged spending austerity to spur economic growth.",
    url: "https://goto.fitchratings.com/v/NzMyLUNLSC03NjcAAAGk5D8CxL0VuJqzQynSdzT1FZj4UPueKXRpjVDv4haftJLXyKMadyvyqeri4hVdMtK3BX6DrqU=#chile-budget"
  },
  {
    id: "rsch-fitch-wire-gabondatarevisions-20261016",
    publication: "Fitch Ratings",
    author: null,
    series: "Fitch Wire Daily",
    title: "Validation of Gabon's Data Revisions Are Key to IMF Support Prospects",
    date: "2026-10-16",
    time: "16:13",
    summary: "The Gabonese government's recent revisions to GDP and debt stock statistics imply a notable improvement to the sovereign's debt metrics, but uncertainty over the debt stock persists.",
    url: "https://goto.fitchratings.com/v/NzMyLUNLSC03NjcAAAGk5D8CxL0VuJqzQynSdzT1FZj4UPueKXRpjVDv4haftJLXyKMadyvyqeri4hVdMtK3BX6DrqU=#gabon-data"
  },
  {
    id: "rsch-fitch-wire-nalodgingleisure-20261016",
    publication: "Fitch Ratings",
    author: null,
    series: "Fitch Wire Daily",
    title: "N. American Lodging and Leisure Ratings Stable Despite Emerging Cracks",
    date: "2026-10-16",
    time: "16:13",
    summary: "The sector shows mixed operating trends: lodging, regional gaming and cruise companies show strong fundamentals, while the outlook is weaker for Las Vegas Strip and theme park operators.",
    url: "https://goto.fitchratings.com/v/NzMyLUNLSC03NjcAAAGk5D8CxL0VuJqzQynSdzT1FZj4UPueKXRpjVDv4haftJLXyKMadyvyqeri4hVdMtK3BX6DrqU=#lodging-leisure"
  },
  {
    id: "rsch-fitch-wire-portugal2027budget-20261016",
    publication: "Fitch Ratings",
    author: null,
    series: "Fitch Wire Daily",
    title: "Portugal's 2027 Budget Consistent with Falling Debt Despite Tax Relief",
    date: "2026-10-16",
    time: "16:13",
    summary: "Portugal's 2027 budget proposal is consistent with government debt remaining on a firm downward path, despite tax relief measures and spending pressures.",
    url: "https://goto.fitchratings.com/v/NzMyLUNLSC03NjcAAAGk5D8CxL0VuJqzQynSdzT1FZj4UPueKXRpjVDv4haftJLXyKMadyvyqeri4hVdMtK3BX6DrqU=#portugal-budget"
  },
  {
    "id": "rsch-gs-briefings-oilpricesdecline-20261016",
    "publication": "Goldman Sachs Research",
    "author": "Daan Struyven",
    "series": "Briefings",
    "title": "Will Oil Prices Decline as Middle East Supply Recovers?",
    "date": "2026-10-16",
    "time": "14:53",
    "summary": "Goldman Sachs Research now expects Brent at $90 a barrel in December 2026 (prior forecast $85) and averaging $80 in 2027, as Persian Gulf exports recover to near 2025 levels.",
    "url": "https://www.goldmansachs.com/insights"
  },
  {
    "id": "rsch-jpm-tmt-pressure-20261016",
    "publication": "JPMorgan Private Bank",
    "author": null,
    "series": "Top Market Takeaways",
    "title": "When does the pressure matter?",
    "date": "2026-10-16",
    "time": "13:30",
    "summary": "JP Morgan Private Bank’s weekly note on inflation, yields and equities, with the chart caption: inflation above 2% is not, by itself, a signal for stocks.",
    "url": "https://www.jpmorgan.com/insights/markets-and-economy/top-market-takeaways"
  },
  {
    id: "rsch-spdji-dailyindexinsights-20261016",
    publication: "S&P Dow Jones Indices",
    author: null,
    series: "Daily Index Insights",
    title: "Daily Index Insights",
    date: "2026-10-16",
    time: "15:31",
    summary: "Marks the 103rd birthday of The Walt Disney Company, founded on 16 October 1923 as the Disney Brothers Cartoon Studio in Los Angeles.",
    url: "https://www.spglobal.com/spdji/en/commentary/article/daily-index-insights"
  },
  {
    id: "rsch-mandg-bondvigilantes-whatthepastgetswrong-20261016",
    publication: "M&G Bond Vigilantes",
    author: "Luke Coha",
    series: "Bond Vigilantes",
    title: "What the Past Gets Wrong About the Future",
    date: "2026-10-16",
    time: "14:51",
    summary: "Bond Vigilantes post (15 Oct) on Paramount Skydance’s recent $110 billion acquisition of Warner Bros. Discovery.",
    url: "https://bondvigilantes.com/blog/2026/10/what-the-past-gets-wrong-about-the-future/"
  },
  {
    id: "rsch-ubs-weekly-softwareshardpricing-20261016",
    publication: "UBS CIO",
    author: "Paul Donovan",
    series: "UBS Weekly Blog",
    title: "Software’s hard pricing",
    date: "2026-10-16",
    time: "13:57",
    summary: "US “software and accessories” consumer prices rose over 25% in the past year, while software prices in Europe and the UK are still falling.",
    url: "https://secure.ubs.com/campaign/nl/jsp/m.jsp?c=%401YGh9oyyP%2BzKi3eNVmHoWSMr6RCHMfJyMxdHaMtvvCo%3D"
  },
  {
    id: "rsch-fitch-insidecredit-bondyieldssovereigns-20261016",
    publication: "Fitch Ratings",
    author: null,
    series: "Inside Credit",
    title: "Inside Credit: Surge in Bond Yields Adds to Challenges Facing Developed Market Finances; Western European Sovereigns’ Fiscal Paths Continue to Diverge",
    date: "2026-10-16",
    time: "13:00",
    summary: "Weekly recap: the sharp rise in developed-market government bond yields this year makes it harder to stabilise debt/GDP, while perpetual non-traded BDC redemption requests declined quarter over quarter for 13 of 15 tracked vehicles.",
    url: "https://goto.fitchratings.com/v/NzMyLUNLSC03NjcAAAGk445dS_is5WZxSEyUWAzE6zQmCV3EGYMYQZmCqy9CL440vfdKMpAHe45HfybTJQRS8c-A9jY="
  },
  {
    id: "rsch-apollo-airesetstagflation-20261016",
    publication: "Apollo Academy",
    author: "Torsten Slok",
    series: "The Daily Spark",
    title: "Could an AI Reset Expose a Stagflationary Economy?",
    date: "2026-10-16",
    time: "11:46",
    summary: "A sharp reset in AI expectations could undermine corporate confidence and weigh on capex and GDP growth just as higher oil prices, tariffs and tighter immigration restrictions push inflation higher.",
    url: "https://www.apolloacademy.com/the-daily-spark/"
  },
  {
    id: "rsch-ubs-donovan-precisely-20261016",
    publication: "UBS CIO",
    author: "Paul Donovan",
    series: "Morning audio comment",
    title: "Precisely",
    date: "2026-10-16",
    time: "07:51",
    summary: "Fed Chair Warsh gave no hawkish forward guidance at the IMF meetings and expectations for an October rate increase are fading; bond rallies on AI-driven safe-haven demand undercut the fiscal-sustainability worry.",
    url: "https://www.ubs.com/global/en/wealth-management/insights/chief-investment-office/market-insights/paul-donovan.html",
  },
  {
    id: "rsch-guggenheim-fixedincomesectorviews4q26-20261015",
    publication: "Guggenheim Investments",
    author: null,
    series: "Fixed-Income Sector Views",
    title: "4Q2026 Fixed-Income Sector Views",
    date: "2026-10-15",
    time: "22:43",
    summary: "Yields are at their highest since 2007 with limited scope for Treasury yields to move materially higher, while credit spreads in many sectors remain tight; positioning favours high-carry defensive sectors such as senior commercial ABS and non-Agency RMBS.",
    url: "https://go.pardot.com/webmail/104832/1471295304/bce5abe43db5a79d28a2e045cb2da4640259f8fb6a6b18515a3e960d2d98d5cc"
  },
  {
    id: "rsch-spdji-indexology-indexingcrypto-20261015",
    publication: "S&P Dow Jones Indices",
    author: null,
    series: "Indexology Blog",
    title: "The Case for Indexing Cryptocurrencies",
    date: "2026-10-15",
    time: "23:01",
    summary: "While indexing is a core building block in traditional asset classes such as U.S. equities, digital assets continue to be viewed largely through the lens of individual tokens…",
    url: "https://www.indexologyblog.com/2026/10/14/the-case-for-indexing-cryptocurrencies/"
  },
  {
    id: "rsch-fitch-wire-texasdatacentre-20261015",
    publication: "Fitch Ratings",
    author: null,
    series: "Fitch Wire Daily",
    title: "Texas Data Center Ratings Can Withstand Temporary Permitting Pause",
    date: "2026-10-15",
    time: "16:10",
    summary: "The ongoing data center audit in Texas has no immediate ratings impact on Fitch-rated data center projects in the state, thanks to existing permits, completed interconnection approvals or contractual protections that transfer development risk to tenants.",
    url: "https://goto.fitchratings.com/v/NzMyLUNLSC03NjcAAAGk3xXo36iHjManYf_aFqTP4xIIgIJ_8Rqp3qrjkMTJFn42VtH7dR0Jz6K4vSq0p479zad2e74=#texas-data-center"
  },
  {
    id: "rsch-fitch-wire-embankmetrics-20261015",
    publication: "Fitch Ratings",
    author: null,
    series: "Fitch Wire Daily",
    title: "EM Bank Aggregate Metrics Stable; Persisting Regional Differences",
    date: "2026-10-15",
    time: "16:10",
    summary: "The largest emerging market banks' aggregate averages were stable in 2025, although significant regional differences persist.",
    url: "https://goto.fitchratings.com/v/NzMyLUNLSC03NjcAAAGk3xXo36iHjManYf_aFqTP4xIIgIJ_8Rqp3qrjkMTJFn42VtH7dR0Jz6K4vSq0p479zad2e74=#em-banks"
  },
  {
    id: "rsch-spdji-dailyindexinsights-20261015",
    publication: "S&P Dow Jones Indices",
    author: null,
    series: "Daily Index Insights",
    title: "Daily Index Insights",
    date: "2026-10-15",
    time: "14:31",
    summary: "On this day 211 years ago, Napoleon Bonaparte arrived at the isolated South Atlantic island of Saint Helena to begin his exile following his final defeat at Waterloo…",
    url: "https://www.spglobal.com/spdji/en/commentary/article/daily-index-insights",
  },
  {
    id: "rsch-withintel-pc-insights-20261015",
    publication: "With Intelligence",
    author: null,
    series: "Private Credit Insights",
    title: "Private Credit Insights: Falcon Wealth eyes specialty finance to diversify private credit sleeve",
    date: "2026-10-15",
    time: "10:39",
    summary: "A curated weekly roundup of private-credit intelligence: Falcon Wealth eyes specialty finance for its private credit sleeve; Westbrooke works toward a £250m target for its UK credit fund; Deutsche Credit targets €750m for debut direct-lending fund DCCP I; and 26N preps a hybrid capital solutions strategy.",
    url: "https://www.withintelligence.com/solutions/private-credit/",
  },
  {
    id: "rsch-spdji-dailyindexinsights-20261014",
    publication: "S&P Dow Jones Indices",
    author: null,
    series: "Daily Index Insights",
    title: "Daily Index Insights",
    date: "2026-10-14",
    time: "15:01",
    summary: "On this day 79 years ago, U.S. Air Force Captain Chuck Yeager became the first person to officially travel faster than the speed of sound…",
    url: "https://www.spglobal.com/spdji/en/commentary/article/daily-index-insights",
  },
  {
    id: "rsch-mandg-wigglesworth-20261014",
    publication: "M&G Bond Vigilantes",
    author: "Anjulie Rusius",
    series: "Bond Vigilantes",
    title: "Wigglesworth the Wait? A bond fund manager’s take on A Fabulous Debt.",
    date: "2026-10-14",
    time: "17:19",
    summary: "A bond fund manager’s take on Robin Wigglesworth’s book A Fabulous Debt.",
    url: "https://bondvigilantes.com/blog/2026/10/wigglesworth-the-wait-a-bond-fund-managers-take-on-a-fabulous-debt/",
  },
  {
    id: "rsch-fitch-europeanbanksupdate-20261014",
    publication: "Fitch Ratings",
    author: null,
    series: "European Banks Update",
    title: "European Banks Update | Updated EM Largest Banks Monitor, Impact of Geopolitical Shocks & More",
    date: "2026-10-14",
    time: "15:00",
    summary: "Fitch has raised profitability forecasts for many of the 20 large European banks in its peer group after strong 1H26 results, and updated its Emerging Markets Largest Banks Monitor covering 142 banks.",
    url: "https://goto.fitchratings.com/v/NzMyLUNLSC03NjcAAAGk2a_GYSFL40AETWfHkyBi-ewaxzjW7pTKDglmJILfUMopfW73uGB43qGcsdupXbbVSCZvB1E="
  },
  {
    id: "rsch-jpm-incontext-housingaffordability-20261014",
    publication: "J.P. Morgan",
    author: null,
    series: "In Context",
    title: "The Long Road Home",
    date: "2026-10-14",
    time: "13:01",
    summary: "J.P. Morgan research on global housing affordability: buying a median-priced US home takes 43% of median household income, against the 30% traditionally treated as affordable.",
    url: "https://www.jpmorgan.com/insights/global-research/real-estate/housing-affordability"
  },
  {
    id: "rsch-preqin-firstclose-fertility-20261014",
    publication: "Preqin",
    author: "Lizzie Carroll",
    series: "First Close",
    title: "How investors are seeding innovation in fertility diagnostics",
    date: "2026-10-14",
    time: "12:25",
    summary: "Venture firms are backing reproductive-health start-ups; Preqin data shows private equity at 27% of future investment plans among Gulf family offices.",
    url: "https://go.preqin.com/webmail/909852/2207444386/10a07fc888799ba93601ccf55d4c7de31840aed202839f3c768c45aa7be76665"
  },
  {
    id: "rsch-apollo-aispending-roi-20261014",
    publication: "Apollo Academy",
    author: "Torsten Slok",
    series: "The Daily Spark",
    title: "AI Spending: Waiting on ROI, Watching the Bill",
    date: "2026-10-14",
    time: "11:46",
    summary: "A Mavvrik/Benchmarkit survey of 396 enterprises finds only 11% forecast AI spending within 10% of actual, down from 15% a year earlier.",
    url: "https://www.apolloacademy.com/the-daily-spark/"
  },
  {
    id: "rsch-pimco-creditmarketlens-directlending-20261013",
    publication: "PIMCO",
    author: "Lotfi Karoui",
    series: "The Credit Market Lens",
    title: "Green Shoots and Legacy Risks in Direct Lending",
    date: "2026-10-13",
    time: "17:30",
    summary: "New direct-lending vintages are improving on wider spreads and lower leverage while legacy portfolios still carry peak-era terms; BDC marks remain widely dispersed.",
    url: "https://mktg-alerts.pimco.com/v/ODc5LUFFTC0xNTgAAAGk1RLo3LCAxndLv7Vsp-M2yO_90uJ3Yl7reUDYRqb4f5ECJwmeOnqxkp-eZ08LIwdjlPef29g="
  },
  {
    id: "rsch-ubs-donovan-dangerousgame-20261013",
    publication: "UBS CIO",
    author: "Paul Donovan",
    series: "Morning audio comment",
    title: "A dangerous game?",
    date: "2026-10-13",
    time: "08:24",
    summary: "The Fed is trying to hold rates at the top of the neutral range using imprecise data; chip-stock volatility after Broadcom's \u201ccasino\u201d remark has limited global economic impact.",
    url: "https://www.ubs.com/global/en/wealth-management/insights/chief-investment-office/market-insights/paul-donovan.html",
  },
  {
    id: "rsch-apollo-10yr-decomposition-20261013",
    publication: "Apollo Academy",
    author: "Torsten Slok",
    series: "The Daily Spark",
    title: "Decomposing the Move Higher in 10-Year Rates",
    date: "2026-10-13",
    time: "11:46",
    summary: "US 10-year yields are up about 100bp year to date; a Fed-economist model attributes the rise to a higher expected path of real short rates and a higher term premium.",
    url: "https://www.apolloacademy.com/the-daily-spark/",
  },
  {
    id: "rsch-withintelligence-pe-insights-arclinespinout-20261013",
    publication: "With Intelligence",
    author: null,
    series: "Private Equity Insights",
    title: "Private Equity Insights: Arcline spinout preps 2027 fundraise",
    date: "2026-10-13",
    time: "14:20",
    summary: "Weekly private equity roundup led by Arcline spinout Fathom Point preparing a 2027 fundraise, plus Ajax Health at $1bn toward a $1.5bn medtech fund.",
    url: "https://pardot.withintelligence.com/webmail/284832/3602101148/23fcdd7c20d30df223e97a343c7c91b872fd93050b0c889e2b0abf0950a7caa2",
  },
  {
    id: "rsch-preqin-firstclose-middleeast-20261013",
    publication: "Preqin",
    author: "Younes Omar",
    series: "First Close",
    title: "Middle East institutions look to energy, renewables, and digital infrastructure",
    date: "2026-10-13",
    time: "12:27",
    summary: "Preqin data shows 61% of Middle East-based institutions are interested in regional infrastructure, with energy the most-cited sector at about 45% of LPs.",
    url: "https://go.preqin.com/webmail/909852/2206475236/10a07fc888799ba93601ccf55d4c7de31840aed202839f3c768c45aa7be76665",
  },
  {
    id: "rsch-withintelligence-weekly-jpmametf-20261012",
    publication: "With Intelligence",
    author: null,
    series: "Weekly roundup",
    title: "JPMAM global ETF head talks product dev plans | Plus more intel",
    date: "2026-10-12",
    time: "15:15",
    summary: "Weekly roundup of investor and manager updates, led by JPMAM’s global ETF head on product development and institutional demand.",
    url: "https://pardot.withintelligence.com/webmail/284832/3601340654/23fcdd7c20d30df223e97a343c7c91b872fd93050b0c889e2b0abf0950a7caa2",
  },
  {
    id: "rsch-apollo-ai-transatlantic-20261012",
    publication: "Apollo Academy",
    author: "Huw van Steenis",
    series: "The Daily Spark",
    title: "AI Building vs. AI Buying: The Transatlantic Split",
    date: "2026-10-12",
    time: "11:46",
    summary: "The US dominates the AI supply side — hyperscaler capex approaching $800bn in 2026, data-centre capacity roughly 3× Europe’s, and the dominant share of global AI models and semiconductor value — yet several European countries are ahead on adoption. Europe is an eager user of infrastructure it did not build and cannot easily replicate: the US is the dominant AI builder, but both the US and Europe are AI adopters.",
    url: "https://www.apolloacademy.com/the-daily-spark/",
  },
  {
    id: "rsch-mandg-bonds-mojo-20261012",
    publication: "M&G Bond Vigilantes",
    author: "Joe Sullivan-Bissett",
    series: "Bond Vigilantes",
    title: "Bonds have their mojo back",
    date: "2026-10-12",
    time: "11:29",
    summary: "M&G’s Bond Vigilantes make the case that fixed income has regained its appeal — bonds returning to their defining role as income and portfolio ballast after the recent government-bond sell-off drove yields to multi-year highs.",
    url: "https://bondvigilantes.com/blog/2026/10/bonds-have-their-mojo-back/",
  },
  {
    id: "rsch-ubs-donovan-fastfurious-20261012",
    publication: "UBS CIO",
    author: "Paul Donovan",
    series: "Morning audio comment",
    title: "The Fast and the Furious",
    date: "2026-10-12",
    time: "07:59",
    summary: "UBS Chief Economist Paul Donovan: oil-market politics dominated — a Trump–Putin deal to buy Russian diesel and a short-lived ‘energy ceasefire’ — underscoring the political weight of the US affordability crisis; the diesel fixation risks enabling profit-led inflation and raises the stakes of this week’s US CPI, while a 16-point EU–China auto pact shows trade tension recurring.",
    url: "https://www.ubs.com/global/en/wealth-management/insights/chief-investment-office/market-insights/paul-donovan.html",
  },
  {
    id: "rsch-jpm-tmt-earnings-20261009",
    publication: "JPMorgan Private Bank",
    author: null,
    series: "Top Market Takeaways",
    title: "What risks? Earnings are up and to the right",
    date: "2026-10-09",
    time: "14:34",
    summary: "JP Morgan Private Bank’s weekly note argues corporate earnings growth remains strong — ‘up and to the right’ — and is the main force driving the market’s upside, then turns to the risks that could challenge that as third-quarter results arrive.",
    url: "https://www.jpmorgan.com/insights/markets-and-economy/top-market-takeaways",
  },
  {
    id: "rsch-apollo-ai-rate-insensitivity-20261009",
    publication: "Apollo Academy",
    author: "Torsten Slok",
    series: "The Daily Spark",
    title: "AI’s Insensitivity to Interest Rates Is a Problem for the Fed",
    date: "2026-10-09",
    time: "11:46",
    summary: "AI’s rate-insensitive boom is draining capital, power and labour from rate-sensitive sectors like housing and autos — a ‘Dutch disease’ effect — leaving the Fed caught between AI-driven inflation and weakness elsewhere, so rates stay higher for longer; the durable fix is expanding the supply of power, chips and infrastructure, not monetary policy.",
    url: "https://www.apolloacademy.com/the-daily-spark/",
  },
  {
    id: "rsch-apollo-french-spreads-20261008",
    publication: "Apollo Academy",
    author: "Torsten Slok",
    series: "The Daily Spark",
    title: "Outlook for French Spreads",
    date: "2026-10-08",
    time: "11:46",
    summary: "A France/ECB chart book shows French spreads over German Bunds at their widest since the 2011 euro crisis as fiscal pressures build ahead of the October 13 budget debate; still, the macro backdrop remains solid, European banks are in their best health in decades, and the ECB has several options should financial stability be threatened.",
    url: "https://www.apolloacademy.com/the-daily-spark/",
  },
  {
    id: "rsch-withintel-pc-insights-20261008",
    publication: "With Intelligence",
    author: null,
    series: "Private Credit Insights",
    title: "Private Credit Insights: Amundi Alpha Associates targets up to ten PC managers",
    date: "2026-10-08",
    time: "11:12",
    summary: "A curated weekly roundup of private-credit investor appetite and activity: Amundi Alpha Associates is targeting up to ten PC managers for senior corporate direct lending across Europe and the US; Vista Equity is nearing a $2.2bn final close for its direct-lending fund; an M&G-backed firm is launching a €1bn+ transition-credit fund; and a former SVB executive is prepping a venture-debt fund.",
    url: "https://www.withintelligence.com/solutions/private-credit/",
  },
  {
    id: "rsch-gs-long-bonds-20260911",
    publication: "Goldman Sachs Research",
    author: "George Cole",
    series: "Briefings",
    title: "Why Global Bond Yields Are Expected to Stay Elevated",
    date: "2026-09-11",
    time: "13:54",
    summary: "Thirty-year US Treasuries near 5.2%, a two-decade high; energy-inflation and AI-borrowing pressures should fade, but Goldman expects fiscal concerns to keep long-end yields high — and Treasury buybacks won't be enough to tame them.",
    url: "https://www.goldmansachs.com/insights/articles/why-global-bond-yields-are-expected-to-stay-elevated",
  },
  {
    id: "rsch-gug-corp-credit-3q26-20260820",
    publication: "Guggenheim Investments",
    author: null,
    series: "Corporate Credit Quarterly · 3Q26",
    title: "A Quantum of AI Debt Tests Credit Market Capacity",
    date: "2026-08-20",
    time: "17:22",
    summary: "AI has become a major source of corporate credit supply, with issuance spanning hyperscalers, data-centre operators, utilities and infrastructure; the scale and pace are testing appetite for issuer and sector concentration and the risk that capex returns fall short.",
    url: "https://www.guggenheiminvestments.com/perspectives/sector-views/corporate-credit-quarterly-august-2026/",
  },
  {
    id: "rsch-gug-structured-credit-3q26-20260813",
    publication: "Guggenheim Investments",
    author: null,
    series: "Structured Credit Outlook · 3Q26",
    title: "Non-Agency RMBS: Income, Convexity, and a Rebuilt Market",
    date: "2026-08-13",
    time: "18:11",
    summary: "High-quality non-Agency RMBS is among the most compelling opportunities in structured credit — IG non-QM and senior CES/HELOC tranches yielding 5.35–5.90% at 3–4yr average lives — backed by tight lending standards and home-equity cushions, with 2026 issuance on pace for a post-GFC record.",
    url: "https://www.guggenheiminvestments.com/perspectives/sector-views/third-quarter-2026-structured-credit-outlook/",
  },
];
