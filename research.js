// =============================================================================
// Research — sell-side / house research notes, surfaced in the Home wire under
// the "Research" lane (RSCH desk, teal). The MANUAL half of the Research lane:
// the AUTO half is a set of openly-indexed house-research shops piped live via
// Google News in src/index.js (Apollo Academy, Oaktree, AQR — `research: true`).
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
  // Confirm each domain against the first real email received, then uncomment /
  // correct. Display name is the research brand shown on the row's source.
  // "email.apolloacademy.com": "Apollo Academy",      // also piped live via gnews
  // "jpmorgan.com": "JPMorgan — Eye on the Market",
  // "gs.com": "Goldman Sachs Research",
  // "ms.com": "Morgan Stanley Research",
  // "pimco.com": "PIMCO",
  // "blackrock.com": "BlackRock Investment Institute",
  // "guggenheiminvestments.com": "Guggenheim",
};

// RESEARCH — the swept research notes, newest first. Regenerated on each refresh
// from the Gmail sweep above; starts empty and fills as the reader signs up to and
// forwards research emails. Item shape mirrors newsletters.js exactly:
//   { id, publication, author, series, title, date, time, summary, url }
// NEVER fabricate an item — every entry keeps a real "read online" URL and the
// real send date/time (unknown fields are null). See docs/refresh-routines.md.
export const RESEARCH = [
];
