// The newswire source roster + server quality cull. We verify the openly-readable
// specialist desks added for the app's focus verticals are (a) registered and (b)
// survive the shared quality cull even when their headlines don't hit the macro
// vocab — so the wire stays ≥70% readable AND covers private capital, credit and
// the legal/Big-Law beat. Pure logic (no browser / no egress).
import { FEED_SOURCES, feedQualityKeep, feedBanned } from "../src/index.js";
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
check(!bySource("The Guardian"), "roster: The Guardian is removed as a source");
check(!bySource("Sharecast"), "roster: Sharecast is removed as a source");

// ---- Roster: the deal press-release wires bypass the relevance gate ---------------
for (const name of ["GlobeNewswire", "PR Newswire"]) {
  const src = bySource(name);
  check(!!src, `roster: ${name} is registered as a newswire source`);
  if (src) check(src.url.startsWith("https://") && src.filter === false, `roster: ${name} is a scoped (filter:false) feed`);
}
check(feedQualityKeep({ source: "GlobeNewswire", title: "Apollo closes $2bn direct lending fund" }), "cull: a GlobeNewswire private-credit deal is kept (curated bypass)");
check(feedQualityKeep({ source: "PR Newswire", title: "Sixth Street completes $1.5bn CLO" }), "cull: a PR Newswire credit deal is kept (curated bypass)");

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

// ---- Relevance stays STRICT: an off-topic local story must not slip through on an
// incidental keyword. The condo-defamation piece leaked because a bare "pay"
// ("ordered to PAY damages") and the megacap "Facebook" ("FACEBOOK posts")
// both matched — both are now tightened. ------------------------------------------
check(!feedQualityKeep({ source: "The Straits Times", title: "Condo chairman called managing agent a ‘joker’ in Facebook posts; ordered to pay $100k damages" }),
  "relevance: an off-topic local defamation story is dropped (incidental 'pay'/'Facebook' no longer qualify)");
check(!feedQualityKeep({ source: "The Straits Times", title: "Driver ordered to pay $5,000 after car park dispute" }),
  "relevance: a bare 'pay' no longer passes the gate (only pay rise/award/deal/cut/… do)");
check(!feedQualityKeep({ source: "The Straits Times", title: "Grandmother’s prize recipe on a Facebook page goes viral" }),
  "relevance: 'Facebook' as a platform (post/page/group) is not a megacap match");
// …but genuine labour-pay and real megacap-company stories are still kept.
check(feedQualityKeep({ source: "The Straits Times", title: "Public sector workers to get 5.5% pay rise next year" }),
  "relevance: a real pay-rise/labour story is still kept");
check(feedQualityKeep({ source: "The Straits Times", title: "Meta shares climb as Facebook parent lifts ad guidance" }),
  "relevance: a real Meta/Facebook company story is still kept");
// HARD lifestyle: a stray finance word (a commodity like "gold", a megacap name) does NOT
// rescue a recipe / obituary / horoscope — the exact "as good as gold" wontons leak.
check(!feedQualityKeep({ source: "Associated Press", title: "Ming-Na Wen’s recipe for ‘Popo’s Wontons’ is as good as gold in her family" }),
  "relevance: a recipe with a stray 'gold' is dropped (hard lifestyle, not rescued by a commodity word)");
check(!feedQualityKeep({ source: "Associated Press", title: "Legendary gold trader dies aged 88" }),
  "relevance: an obituary with 'gold' is dropped (hard lifestyle)");
// …but a genuine gold-market story still passes.
check(feedQualityKeep({ source: "Associated Press", title: "Gold hits record high as investors seek a haven" }),
  "relevance: a real gold-market story is still kept (the commodity word still counts for real news)");

// ---- Rule 1: macro scope = G7 + Eurozone + other major (EU/EFTA) Europe. A headline
// led by an OUT-OF-SCOPE country (non-European, or non-EU/EFTA Europe) is off-universe
// and dropped even from a premium source; an in-scope-led headline, a euro-area
// aggregate, and a markets story are kept. ------------------------------------------
const ECON = "Investing.com Economics";
for (const t of [
  "Hong Kong August retail sales rise 5.6%",
  "Brazil next, US midterms coming, in impactful global election year",
  "China’s exports surge in September",
  "Singapore core inflation eases",
  "India GDP grows 7.2% in the second quarter",
  "Australia jobs beat forecasts as unemployment falls",
  "Russia’s inflation jumps on a weaker rouble",
  "Turkey’s lira hits a record low after the rate decision",
  "Poland holds rates as inflation cools toward target",       // CEE — out (G7 + Western Europe only)
  "Czech central bank cuts interest rates",
  "Hungary’s forint slides as budget deficit widens",
  "Romanian inflation slows to 4.8%",
  "Lithuania’s GDP grows faster than expected",
]) check(!feedQualityKeep({ source: ECON, title: t }), `macro scope: an out-of-scope country headline is dropped ("${t.slice(0, 30)}…")`);
for (const t of [
  "UK firms see price, wage growth steady as energy costs squeeze margins",
  "US job growth expected to slow in September; unemployment rate likely steady",
  "German government to raise forecasts due to strong H1, source says",
  "Higher Eurozone inflation adds pressure on ECB to tighten again",
  "Tokyo inflation accelerates in Sept, strengthening case for further BOJ hikes",
  "Austria’s inflation climbs to 3.5% in September",        // euro-area member — in scope
  "Switzerland cuts rates as the franc strengthens",        // EFTA — in scope
  "Spain’s inflation eases to 2.1% in September",            // Western Europe — in scope
  "Greece raises growth forecast as tourism booms",         // Western Europe — in scope
  "Norway’s central bank holds rates steady",               // Nordics — in scope
  "Sweden’s Riksbank signals a pause after the krona rally", // EU — in scope
]) check(feedQualityKeep({ source: ECON, title: t }), `macro scope: a G7 / Eurozone / major-Europe headline is kept ("${t.slice(0, 30)}…")`);

// A CEE company's deal / credit story is not country-macro — kept (the verticals are global).
check(feedQualityKeep({ source: ECON, title: "Polish retailer Pepco agrees €500m refinancing with private lenders" }), "macro scope: a CEE corporate/credit story is kept (only CEE country-macro is out)");

// ---- CNBC is a PREFERRED source: an always-pass premium newsroom with roomy caps.
{
  const cnbc = FEED_SOURCES.filter((f) => f.source === "CNBC");
  check(cnbc.length >= 1, "preferred: CNBC is registered as a newswire source");
  check(cnbc.every((f) => !f.core), "preferred: CNBC feeds are NOT core-restricted (its general coverage is kept)");
  check(Math.max(...cnbc.map((f) => f.cap || 0)) >= 12, `preferred: CNBC carries a generous cap (max ${Math.max(...cnbc.map((f) => f.cap || 0))})`);
  // A keyword-free CNBC headline passing PROVES it's in the always-pass premium tier
  // (the same headline from a gated source would be culled).
  check(feedQualityKeep({ source: "CNBC", title: "Retailers brace for a cautious holiday shopper" }),
    "preferred: a general CNBC headline passes the gate (premium always-pass)");
  check(!feedQualityKeep({ source: "The Straits Times", title: "Retailers brace for a cautious holiday shopper" }),
    "preferred: the SAME headline from a gated source is culled — proving CNBC's pass is its premium status");
}

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

// ---- Geo-scope is MACRO-ONLY: a global-vertical story about an out-of-scope country
// is KEPT (the geo-cull fires only on country-macro headlines), while that country's
// own macro print is still dropped. -----------------------------------------------
check(feedQualityKeep({ source: "Business Wire", title: "EQT closes $15.6bn Asia buyout fund in record private equity raise" }),
  "geo-macro: an Asian private-equity deal is kept (vertical, not macro)");
check(feedQualityKeep({ source: "Moody's", title: "China Growth and Credit: research, insights and analysis", fi: true }),
  "geo-macro: a flagged credit-desk item about China is kept (vertical desk is global)");
check(feedQualityKeep({ source: "The Global Legal Post", title: "Singapore firm Rajah & Tann adds disputes partner in Hong Kong", legal: true }),
  "geo-macro: an Asian law-firm move is kept (legal vertical is global)");
check(!feedQualityKeep({ source: "Investing.com Economics", title: "China’s exports surge in September" }),
  "geo-macro: an out-of-scope country's trade-data print is still dropped");
check(!feedQualityKeep({ source: "Investing.com Economics", title: "Singapore core inflation eases in August" }),
  "geo-macro: an out-of-scope country's inflation print is still dropped");

// ---- Readable-only policy: the paywalled premium four are switched OFF at source
// (commented out of FEED_SOURCES, reversibly), and the openly-readable replacements
// are wired in. ------------------------------------------------------------------
for (const off of ["Financial Times", "Bloomberg", "The Wall Street Journal", "The Economist", "FT Alphaville", "The Lawyer", "Nikkei Asia", "Channel NewsAsia"]) {
  check(!FEED_SOURCES.some((f) => f.source === off), `readable-only: ${off} is switched off (not an active feed source)`);
}
for (const [on, want] of [["Associated Press", {}], ["Moody's", { fi: true }], ["European Central Bank", {}], ["Bank of Japan", {}], ["Bank of Canada", {}], ["Euronews Business", {}], ["AltAssets", {}]]) {
  const src = bySource(on);
  check(!!src, `readable-only: ${on} is wired as an active source`);
  if (src && want.fi) check(src.fi === true, `readable-only: ${on} is routed to the FI (credit) desk`);
}

// ---- Fixed source set (owner 2026-10-21): FEED_SOURCES is the one canonical list.
// Added after the in-pane trial; MarketWatch and Hedge Fund Alpha dropped.
{
  const { feedSourceKeep } = await import("../src/index.js");
  for (const off of ["MarketWatch", "Hedge Fund Alpha"]) check(!bySource(off), `fixed set: ${off} is dropped`);
  for (const [on, want] of [["Financial Stability Board", {}], ["SEC", {}], ["PE Hub", {}], ["Axios", {}], ["BIS", { research: true }], ["Liberty Street Economics", { research: true }], ["CEPR VoxEU", { research: true }]]) {
    const src = bySource(on);
    check(!!src && (!want.research || src.research === true), `fixed set: ${on} is wired${want.research ? " to the Research lane" : ""}`);
  }
  const { INSOLVENCY_SRC: ins, insolvencyItems } = await import("../src/index.js");
  check(!bySource("Insolvency Service"), "Insolvency Service is NOT a wire source (moved to Dashboard ▸ Legal ▸ R&I, owner 2026-10-21)");
  const atom = `<feed><entry><title>Accredited official statistics: Company insolvencies, September 2026</title><link href="https://www.gov.uk/government/statistics/company-insolvencies-september-2026"/><updated>2026-10-20T06:00:00Z</updated></entry><entry><title>Transparency data: Insolvency practitioner sanctions: Andrew Dix 17 November 2025</title><link href="https://www.gov.uk/x"/><updated>2026-10-19T06:00:00Z</updated></entry></feed>`;
  const iv = insolvencyItems(atom);
  check(iv.length === 1 && iv[0].title === "Company insolvencies, September 2026" && iv[0].date === "2026-10-20" && /gov\.uk/.test(iv[0].url), `/api/insolvency keeps the statistics release, tidied and dated (${JSON.stringify(iv)})`);
  const sec = bySource("SEC"), peh = bySource("PE Hub");
  const k = (f, title) => feedSourceKeep({ title }, f) && feedQualityKeep({ source: f.source, title });
  check(k(sec, "SEC Proposes Amendments to Expand Responsible Retailization of Private Markets"), "SEC: a private-markets rule is kept");
  check(!k(sec, "SEC Charges Founder and His Two New Jersey-Based Companies in Alleged $16 Million Ponzi Scheme"), "SEC: a retail Ponzi case is dropped");
  check(!k(sec, "SEC Investor Advisory Committee to Host Sept. 10 Meeting"), "SEC: a meeting notice is dropped");
  check(feedSourceKeep({ title: "Accredited official statistics: Company insolvencies, September 2026" }, ins), "Insolvency Service: the monthly statistics are kept");
  check(!feedSourceKeep({ title: "Transparency data: Insolvency practitioner sanctions: Andrew Dix 17 November 2025" }, ins), "Insolvency Service: practitioner sanctions are dropped");
  check(k(peh, "Weatherford Capital hires LLR Partners veteran Michael Pantilione for flagship strategy"), "PE Hub: a senior hire is kept");
  check(!k(peh, "Inflexion’s Ranger Fire and Security adds Midlands alarm firm D&G"), "PE Hub: a small add-on is dropped");
  check(!k(peh, "WestBridge completes investment in Foresight-backed financial planner Beckett"), "PE Hub: 'financial planner' is not a financing");
  check(!k(bySource("Axios"), "Trump goes full apocalypse in anti-Dems midterms message"), "Axios: politics is dropped (default macro gate)");
}

// ---- One-day backfill (owner 2026-10-21): a source keeps a cap for yesterday too.
{
  const { feedCapItems } = await import("../src/index.js");
  const now = Date.parse("2026-10-21T15:00:00Z");
  const mk = (h, n) => Array.from({ length: n }, (_, i) => ({ title: `t${h}-${i}`, when: new Date(now - (h + i * 0.1) * 3600e3) }));
  const today = mk(1, 12);                 // 12 items this afternoon
  const yday = mk(24, 12);                 // 12 items yesterday afternoon
  const old = mk(80, 5);                   // 5 items three days ago
  const kept = feedCapItems([...old, ...yday, ...today], 8, now);
  check(kept.filter((x) => today.includes(x)).length === 8, "backfill: today keeps the newest cap (8) items");
  check(kept.filter((x) => yday.includes(x)).length === 8, "backfill: yesterday keeps up to a cap (8) more");
  check(kept.filter((x) => old.includes(x)).length === 0, "backfill: nothing older than ~2 days is added beyond the cap");
  const quiet = mk(30, 3);
  check(feedCapItems(quiet, 8, now).length === 3, "backfill: a quiet source keeps all its items (unchanged)");
}

// Banned outlet (owner request): Channel NewsAsia is dropped from ANY feed — a direct
// link or a Google News bridge item labelled "CNA" — even on an otherwise-strong headline.
for (const it of [
  { source: "CNA", title: "ECB raises rates as inflation climbs", url: "https://news.google.com/rss/articles/abc" },
  { source: "Channel NewsAsia", title: "Fed holds rates steady", url: "https://www.channelnewsasia.com/business/x" },
  { source: "Some Wire", title: "Bank of England holds rates", url: "https://www.channelnewsasia.com/business/y" },
]) check(feedBanned(it) && !feedQualityKeep(it), `banned outlet: "${it.source}" / ${new URL(it.url).hostname} is dropped`);
check(!feedBanned({ source: "CNBC", title: "x", url: "https://www.cnbc.com/x" }), "banned outlet: CNBC is not caught by the CNA ban");
// Sport (owner 2026-10-18): results, fixtures and player moves never reach the wire —
// even from premium newsrooms, and even when a word like "Bundesliga" contains "Bund" —
// but the BUSINESS of sport (takeovers, stakes, media rights, debt) still does.
for (const [title, source] of [
  ["First Bundesliga loss for Freiburg, Monaco no longer unbeaten in France and Madrid without Vinícius", "Associated Press"],
  ["Lakers trade star guard in NBA deal", "Associated Press"],
  ["Arsenal top the Premier League after win over Chelsea", "Reuters"],
  ["Real Madrid striker ruled out of derby", "Bloomberg"],
]) check(!feedQualityKeep({ title, source, url: "https://apnews.com/x" }), `sport is dropped: "${title}" (${source})`);
for (const [title, source] of [
  ["Chelsea owners agree £2.5bn sale to private equity group", "Reuters"],
  ["Bundesliga clubs vote on investor deal for media rights", "Associated Press"],
  ["German Bund yields rise as ECB signals hike", "Associated Press"],
]) check(feedQualityKeep({ title, source, url: "https://apnews.com/x" }), `the business of sport / Bunds still pass: "${title}"`);
finish();
