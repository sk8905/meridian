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
const RESEARCH_PUBLISHER_RE = /\b(?:apollo|goldman\s+sachs|guggenheim|fitch|moody'?s|s&p\s+global|morgan\s+stanley|jp\.?\s*morgan|jpmorgan|pimco|blackrock|preqin|ubs|with\s+intelligence|oaktree|aqr|m&g|bond\s+vigilantes)\b/i;
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
