// X (Twitter) wire — the curated roster + a merged, newest-first set of REAL tweet
// references, rendered LIVE by X's official widgets.js (twttr.widgets.createTweet
// by id). We store only a post's { handle, id } plus the date derived from the
// id's snowflake timestamp (used purely for ordering). No tweet TEXT is stored or
// invented — the embed pulls the real post straight from X at render time, and a
// tweet X can't serve (deleted, protected, offline) falls back to a link to the
// post. Accounts with no verifiable recent status permalink carry a profile card
// only — a real link to the account, never a fabricated tweet.
//
// Discipline (HOUSE_STYLE R26 + refresh-routines): every id here is a real
// permalink that was source-verified; the daily refresh tops this list up with
// each account's latest verified post and prunes anything X no longer serves.
// This is a data resource — imported tokenless, like the other content files.

export const X_ASOF = "2026-09-16";

// The tracked accounts, in editorial order. `name`/`note` label the wire; the
// handle is the canonical X handle (used for the profile link + the permalink).
export const X_ACCOUNTS = [
  { handle: "elerianm",       name: "Mohamed A. El-Erian", note: "Economist · Allianz / Queens' College" },
  { handle: "negligible_cap", name: "Negligible Capital",  note: "Long/short equity commentary" },
  { handle: "LeylaKuni",      name: "Leyla Kunimoto",      note: "Private markets, from the LP seat" },
  { handle: "lcdnews",        name: "LCD News",            note: "Leveraged loans & private credit · PitchBook" },
  { handle: "michaeljburry",  name: "Michael Burry",       note: "Scion Asset Management" },
  { handle: "RayDalio",       name: "Ray Dalio",           note: "Bridgewater founder" },
  { handle: "sindap",         name: "Sujeet Indap",        note: "Wall Street editor · Financial Times" },
  { handle: "ArashMassoudi",  name: "Arash Massoudi",      note: "Finance & markets editor · Financial Times" },
  { handle: "nishantkumar07", name: "Nishant Kumar",       note: "Hedge funds · Bloomberg" },
];

// Real, verified tweet references. { handle, id, date } — `date` is the tweet's
// snowflake timestamp (UTC, YYYY-MM-DD), pinned here only so the wire can order
// newest-first without waiting on the embeds. Merged across accounts.
export const X_POSTS = [
  { handle: "sindap",         id: "2097419714045624433", date: "2026-09-08" },
  { handle: "LeylaKuni",      id: "2085836718587203700", date: "2026-08-07" },
  { handle: "negligible_cap", id: "2078142387658879462", date: "2026-07-17" },
  { handle: "elerianm",       id: "2063326152526114954", date: "2026-06-06" },
  { handle: "RayDalio",       id: "2053938354425602279", date: "2026-05-11" },
  { handle: "negligible_cap", id: "2048743174785356203", date: "2026-04-27" },
  { handle: "elerianm",       id: "2048434217730875903", date: "2026-04-26" },
  { handle: "LeylaKuni",      id: "2043730407267643811", date: "2026-04-13" },
  { handle: "sindap",         id: "2041484646177779904", date: "2026-04-07" },
  { handle: "nishantkumar07", id: "2040157779449528322", date: "2026-04-03" },
  { handle: "nishantkumar07", id: "2037241592436695537", date: "2026-03-26" },
  { handle: "RayDalio",       id: "2033567224120692861", date: "2026-03-16" },
  { handle: "lcdnews",        id: "1985837085194858901", date: "2025-11-04" },
];
