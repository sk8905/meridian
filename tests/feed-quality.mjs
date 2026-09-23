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
check(!bySource("Above the Law"), "roster: Above the Law is removed as a source");

// ---- Roster: the deal press-release wires + UK markets desk (from TradingView audit) --
for (const name of ["GlobeNewswire", "PR Newswire", "Sharecast"]) {
  const src = bySource(name);
  check(!!src, `roster: ${name} is registered as a newswire source`);
  if (src) check(src.url.startsWith("https://") && src.filter === false, `roster: ${name} is a scoped (filter:false) feed`);
}
// Deal-scoped PR wires bypass the relevance gate; ShareCast stays gated (lighter quality).
check(feedQualityKeep({ source: "GlobeNewswire", title: "Apollo closes $2bn direct lending fund" }), "cull: a GlobeNewswire private-credit deal is kept (curated bypass)");
check(feedQualityKeep({ source: "PR Newswire", title: "Sixth Street completes $1.5bn CLO" }), "cull: a PR Newswire credit deal is kept (curated bypass)");
check(feedQualityKeep({ source: "Sharecast", title: "FTSE 100 slips as UK inflation data disappoints" }), "cull: a Sharecast markets headline is kept");

// ---- Cull: none of these are paywalled newsrooms; they're openly readable --------
const PAYWALL = /financial times|bloomberg|wall street journal|economist|nikkei|forbes|new york times/i;
for (const name of ["Legal Cheek", "Alternative Credit Investor", "Private Equity Wire"])
  check(!PAYWALL.test(name), `access: ${name} is an openly-readable source (not a hard paywall)`);

// ---- Cull: topically-pure trade headlines survive even without macro vocab -------
check(feedQualityKeep({ source: "Legal Cheek", title: "Freshfields boosts NQ pay to £150k, matching the magic circle", legal: true }),
  "cull: a Legal Cheek Big-Law headline is kept (legal desk bypass)");
check(feedQualityKeep({ source: "Alternative Credit Investor", title: "Fund managers plan further alts expansion" }),
  "cull: an Alternative Credit Investor headline is kept even without macro vocab (curated bypass)");
check(feedQualityKeep({ source: "Private Equity Wire", title: "GP-led secondaries surge as sponsors seek liquidity" }),
  "cull: a Private Equity Wire headline is kept (curated bypass)");

// ---- Paywalled premium (FT/Bloomberg/WSJ/Economist) obey the six focus verticals --
const bbg = (t) => ({ source: "Bloomberg", title: t });
const wsj = (t) => ({ source: "The Wall Street Journal", title: t });
// ON-BEAT → kept
check(feedQualityKeep(wsj("Dollar Jumps to 8-Week High on Fed Rate-Hike Bets")), "focus: a macro/FX headline is kept");
check(feedQualityKeep(wsj("U.S. Stocks Slip Ahead of Treasury Bond Buyback")), "focus: an equity/bond headline is kept");
check(feedQualityKeep(bbg("Triton Partners Is Said to Mull Sale or IPO of Trench Group")), "focus: a private-capital / IPO headline is kept");
check(feedQualityKeep(bbg("Citadel Hedge Fund Posts Double-Digit Gains")), "focus: a hedge-fund headline is kept");
// OFF-BEAT (consumer / lifestyle / entertainment / pure geopolitics) → dropped
check(!feedQualityKeep(bbg("Royal Caribbean Buys Stake in Sandals Resorts")), "focus: an off-beat consumer M&A headline is dropped");
check(!feedQualityKeep(bbg("Chanel Plans to Keep Investing in China Despite Demand Downturn")), "focus: an off-beat consumer headline is dropped");
check(!feedQualityKeep(wsj("YouTube Is Battling Netflix Over Top Talent")), "focus: an off-beat media headline is dropped");
check(!feedQualityKeep(bbg("Space Weapons in Focus Ahead of Trump-Xi Summit")), "focus: an off-beat geopolitics headline is dropped");
// Reader-curated myFT is exempt from the focus gate (the reader chose those topics)
check(feedQualityKeep({ source: "Financial Times", title: "The best restaurants in Lisbon this autumn", myft: true }), "focus: a reader-curated myFT item is exempt");

// ---- Cull still drops genuine low-tier noise (regression guard) -------------------
check(!feedQualityKeep({ source: "Benzinga", title: "3 stocks to buy now for huge gains" }),
  "cull: a low-tier tip-sheet source is still dropped");

finish();
