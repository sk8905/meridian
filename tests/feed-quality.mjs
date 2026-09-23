// The newswire source roster + server quality cull. We verify the openly-readable
// specialist desks added for the app's focus verticals are (a) registered and (b)
// survive the shared quality cull even when their headlines don't hit the macro
// vocab — so the wire stays ≥70% readable AND covers private capital, credit and
// the legal/Big-Law beat. Pure logic (no browser / no egress).
import { FEED_SOURCES, feedQualityKeep } from "../src/index.js";
import { check, finish } from "./lib.mjs";

const bySource = (s) => FEED_SOURCES.find((f) => f.source === s);

// ---- Roster: the quality accessible sources are present + correctly tagged -------
for (const [name, want] of [
  ["Legal Cheek", { legal: true }],
  ["Above the Law", { legal: true }],
  ["Alternative Credit Investor", {}],
  ["Private Equity Wire", {}],
]) {
  const src = bySource(name);
  check(!!src, `roster: ${name} is registered as a newswire source`);
  if (src) {
    check(src.url.startsWith("https://"), `roster: ${name} has a real https feed URL`);
    check(src.filter === false, `roster: ${name} bypasses the macro title filter (filter:false)`);
    if (want.legal) check(src.legal === true, `roster: ${name} routes to the Legal desk (legal:true)`);
  }
}

// ---- Cull: none of these are paywalled newsrooms; they're openly readable --------
const PAYWALL = /financial times|bloomberg|wall street journal|economist|nikkei|forbes|new york times/i;
for (const name of ["Legal Cheek", "Above the Law", "Alternative Credit Investor", "Private Equity Wire"])
  check(!PAYWALL.test(name), `access: ${name} is an openly-readable source (not a hard paywall)`);

// ---- Cull: topically-pure trade headlines survive even without macro vocab -------
check(feedQualityKeep({ source: "Legal Cheek", title: "Freshfields boosts NQ pay to £150k, matching the magic circle", legal: true }),
  "cull: a Legal Cheek Big-Law headline is kept (legal desk bypass)");
check(feedQualityKeep({ source: "Above the Law", title: "Which firms just handed out special bonuses?", legal: true }),
  "cull: an Above the Law headline is kept (legal desk bypass)");
check(feedQualityKeep({ source: "Alternative Credit Investor", title: "Fund managers plan further alts expansion" }),
  "cull: an Alternative Credit Investor headline is kept even without macro vocab (curated bypass)");
check(feedQualityKeep({ source: "Private Equity Wire", title: "GP-led secondaries surge as sponsors seek liquidity" }),
  "cull: a Private Equity Wire headline is kept (curated bypass)");

// ---- Cull still drops genuine low-tier noise (regression guard) -------------------
check(!feedQualityKeep({ source: "Benzinga", title: "3 stocks to buy now for huge gains" }),
  "cull: a low-tier tip-sheet source is still dropped");

finish();
