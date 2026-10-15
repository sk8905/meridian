// Newswire scope (HOUSE_STYLE R4c, audit 2026-10-15 — scripts/audit-wire.mjs). The wire
// carries ONLY G7 + Western-Europe macro, covered managers / hedge funds, covered law
// firms and what the owner asked for. These are REAL headlines the live sources carried
// on 15 Oct 2026 (run through the Worker's own gates): the off-universe ones must drop,
// the in-scope ones must stay.
globalThis.caches = { default: { match: async () => null, put: async () => {} } };
import { check, finish } from "./lib.mjs";
const W = await import("../src/index.js");
const it = (source, title, x = {}) => ({ source, title, url: "https://example.org/x", ...x });
const DROP = [
  // personal finance / first-person money stories (the owner's "US mortgages" complaint)
  it("MarketWatch", "‘Some people did everything right’: I lost my home in the Great Recession. I rent in my 50s. Why is that judged as failure?"),
  it("CNBC", "Should I pay off my mortgage before I retire? Here's what experts say"),
  it("Associated Press", "How much should you have in your 401(k) at 50?"),
  // CEE / non-European central banks, EM development finance, disaster live blogs
  it("ING Think", "National Bank of Hungary preview: Room to cut, but caution prevails"),
  it("Moody's", "Blended finance funds play key role in emerging markets’ development needs", { fi: true }),
  it("Moody's", "Hurricane Isaias: Live blog", { fi: true }),
  // press-release slop on the deal wires
  it("PR Newswire", "BMBL SHAREHOLDER ALERT: ADEMI LLP INVESTIGATES WHETHER BUYOUT FAIRLY VALUES BUMBLE INC."),
  it("PR Newswire", "Broadwing Capital Named in Mergers & Acquisitions' 2026 Best Places to Work in Private Equity"),
  it("PR Newswire", "Stellus Private Credit BDC Announces $0.31 Fourth Quarter 2026 Regular Dividend, Payable Monthly in Increments of $0.1033 in October, November, and December 2026"),
  it("ABF Journal", "JPalmer Collective Closes $7MM Line of Credit for Female-Founded Fashion Brand M.M.LaFleur", { fi: true }),
  it("ABF Journal", "Gordon Brothers Celebrates 20th Anniversary in Japan", { fi: true }),
  it("The Hedge Fund Journal", "SOHN Monaco 2026", { hdg: true }),
  // legal-profession gossip (not a covered firm's work)
  it("Legal Cheek", "Criminal defence solicitor jailed for supplying cocaine", { legal: true }),
  it("Legal Cheek", "OPEN THREAD: What are law firms REALLY paying their junior lawyers?", { legal: true }),
  it("Legal Cheek", "GP, Pilates and nutrition advice: Inside A&O Shearman’s new London HQ", { legal: true }),
  it("Legal Futures", "Row over vote of no confidence in SRA to rumble on after AGM", { legal: true }),
  it("The Global Legal Post", "US employment law software platform SixFifty launches agentic HR compliance tool", { legal: true }),
];
const KEEP = [
  it("Associated Press", "Inflation worsened last month to 3.7% in sign that prices remain elevated as midterm elections near"),
  it("Investing.com Economics", "EU leaders kick off summit with wrangles over high energy prices and spending"),
  it("Hedgeweek", "Hedge funds cut dollar exposure as Treasuries regain safe-haven appeal", { hdg: true }),
  it("PR Newswire", "Castlelake Prices $1.1 Billion Commercial Real Estate CLO, CLCRE 2026-FL1"),
  it("Alternative Credit Investor", "Arcmont’s CIO: US pullback a fresh boost for European credit"),
  it("ABF Journal", "Franklin Templeton and Benefit Street Partners Expand ABF Capabilities with Encina Lender Finance Transaction", { fi: true }),
  it("Legal Business", "Paul Weiss and Clifford Chance in line for nearly £60m in fees for Apollo-easyJet deal", { legal: true }),
  it("Legal Business", "Four elite US firms on call for dating app Bumble’s $1.3bn take-private", { legal: true }),
  it("The Global Legal Post", "Erskine Chambers adds insolvency law KC from Twenty Essex", { legal: true }),
  it("ING Think", "Eurozone industry is slowly slipping as the Middle East conflict continues"),
];
for (const x of DROP) check(!W.feedQualityKeep(x), `off-scope dropped: ${x.source} — ${x.title.slice(0, 70)}`);
for (const x of KEEP) check(W.feedQualityKeep(x), `in-scope kept: ${x.source} — ${x.title.slice(0, 70)}`);
// The Asia-only business desks are out of the source list.
check(!W.FEED_SOURCES.some((f) => /scmp\.com|straitstimes\.com/.test(f.url)), "the Asia-only outlets (SCMP, The Straits Times) are not wire sources");
finish();
