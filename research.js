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
  // SIGNED UP, awaiting first real note (only subscription confirmations so far as of
  // 2026-10-07). Confirm each domain against the first real email, then activate.
  // "email.apolloacademy.com": "Apollo Academy",      // also piped live via gnews
  // "oaktreecapital.com": "Oaktree Capital",          // also piped live via gnews
  // "morganstanley.com": "Morgan Stanley Research",   // Thoughts on the Market
  // "jpmorgan.com": "JPMorgan — Eye on the Market",
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
