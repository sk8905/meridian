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
  // CONFIRMED senders (real emails received + swept below). A research sender that
  // ALSO appears in newsletters.js PUBLISHERS (Goldman, Guggenheim) is routed here
  // — Research wins over Newsletters — so these notes land in the Research lane, not
  // the Newsletter one.
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
  // SIGNED UP, awaiting first real note (only subscription confirmations so far — e.g.
  // JPMorgan "Eye on the Market" activation arrived 2026-10-09 from pb.jpmorgan.com, no
  // content yet). Confirm each content-sender domain against the first real email, then
  // activate (as Apollo was above — the confirmation's sender domain is often NOT the
  // content sender's).
  // "oaktreecapital.com": "Oaktree Capital",          // also piped live via gnews
  // "morganstanley.com": "Morgan Stanley Research",   // Thoughts on the Market
  // "pb.jpmorgan.com": "JPMorgan — Eye on the Market", // activation seen; await content
  // "pimco.com": "PIMCO",
  // "blackrock.com": "BlackRock Investment Institute",
};

// RESEARCH — the swept research notes, newest first. Regenerated on each refresh
// from the Gmail sweep above; starts empty and fills as the reader signs up to and
// forwards research emails. Item shape mirrors newsletters.js exactly:
//   { id, publication, author, series, title, date, time, summary, url }
// NEVER fabricate an item — every entry keeps a real "read online" URL and the
// real send date/time (unknown fields are null). See docs/refresh-routines.md.
export const RESEARCH = [
  {
    id: "rsch-apollo-ai-rate-insensitivity-20261009",
    publication: "Apollo Academy",
    author: "Torsten Slok",
    series: "The Daily Spark",
    title: "AI&rsquo;s Insensitivity to Interest Rates Is a Problem for the Fed",
    date: "2026-10-09",
    time: "11:46",
    summary: "AI&rsquo;s rate-insensitive boom is draining capital, power and labour from rate-sensitive sectors like housing and autos &mdash; a &lsquo;Dutch disease&rsquo; effect &mdash; leaving the Fed caught between AI-driven inflation and weakness elsewhere, so rates stay higher for longer; the durable fix is expanding the supply of power, chips and infrastructure, not monetary policy.",
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
