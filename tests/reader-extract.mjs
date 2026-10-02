// Unit coverage for the Worker reader service's pure extractor (extractReadable).
// The live fetch can't run here (egress blocked), but the extraction is a pure string
// pass, so we feed it representative HTML and assert the reading-mode output: title,
// byline/date, clean paragraphs (boilerplate stripped, entities decoded, <article>
// preferred), and the paywall signal (schema.org isAccessibleForFree=false).
import { extractReadable, readHostAllowed, proxyParagraphs, proxyBlocks } from "../src/index.js";
import { check, checkEq, finish } from "./lib.mjs";

const u = (s) => new URL(s);

// 1) A normal open article: <article> body, og:title, author + date meta, some
//    boilerplate <p>s that must be dropped, and an entity to decode.
const open = `<!doctype html><html><head>
  <title>Oil slips below $100 — Markets live | The Guardian</title>
  <meta property="og:title" content="Oil slips below $100 as Iran signals Hormuz offer">
  <meta name="author" content="Jane Smith">
  <meta property="article:published_time" content="2026-09-22T16:28:00Z">
  </head><body>
  <nav><p>Subscribe to our newsletter for more.</p></nav>
  <article>
    <p>Brent crude slipped back under $100 a barrel on Tuesday, unwinding part of Monday&#39;s spike after reports of an Iran offer.</p>
    <p>The move came as UK borrowing overshot the OBR&rsquo;s forecast, with gilt yields ticking higher across the curve today.</p>
    <p>Short</p>
    <p>Equity markets were calmer, with the Nasdaq holding near Monday&rsquo;s record close after a fresh intraday high earlier on.</p>
    <p>© 2026 Guardian News &amp; Media. All rights reserved.</p>
  </article>
  <footer><p>Sign in to comment. Follow us on social.</p></footer>
  </body></html>`;
const a = extractReadable(open, u("https://www.theguardian.com/business/live/x"));
checkEq(a.title, "Oil slips below $100 as Iran signals Hormuz offer", "extract: title from og:title");
checkEq(a.byline, "Jane Smith", "extract: byline from author meta");
check(/^2026-09-22/.test(a.date), `extract: publish date from meta (${a.date})`);
check(a.accessible === true, "extract: an open article is accessible");
check(a.paragraphs.length === 3, `extract: keeps the 3 real paragraphs, drops nav/footer/short/copyright (${a.paragraphs.length})`);
check(a.paragraphs[0].includes("Brent crude") && a.paragraphs[0].includes("Monday's"), "extract: strips tags + decodes entities (&#39; → ')");
check(a.paragraphs.some((p) => p.includes("OBR's")), "extract: decodes named entities (&rsquo; → ')");
check(!a.paragraphs.some((p) => /Subscribe|Sign in|rights reserved|Follow us/i.test(p)), "extract: boilerplate paragraphs are dropped");
check(Array.isArray(a.blocks) && a.blocks.length === 3 && a.blocks.every((b) => b && b.h === false), "extract: a heading-less article's blocks are all body paragraphs (h:false)");

// 1b) Section headings (<h2>/<h3>) are captured into `blocks` (h:true) in document order,
//     so the reading pane can bold them — but stay OUT of the body-only `paragraphs`.
const withHeads = `<!doctype html><html><head><meta property="og:title" content="A longer read"></head><body><article>
  <h2>The setup</h2>
  <p>Markets opened sharply lower on Tuesday as traders digested the overnight policy signals from the central bank meeting.</p>
  <p>Bond yields climbed across the curve while equity futures pointed to a weaker open for the major indices today.</p>
  <h3>What happens next</h3>
  <p>Analysts expect the volatility to persist into the back half of the week as positioning unwinds ahead of the data.</p>
  <h3>A dangling trailing header that should be dropped</h3>
  </article></body></html>`;
const wh = extractReadable(withHeads, u("https://www.example-news.com/longer"));
check(wh.accessible === true, "extract(headings): the article is accessible");
check(wh.paragraphs.length === 3 && wh.paragraphs.every((p) => !/^The setup$|^What happens next$/.test(p)), `extract(headings): paragraphs are body-only, headings excluded (${wh.paragraphs.length})`);
const heads = wh.blocks.filter((b) => b.h).map((b) => b.t);
check(heads.join("|") === "The setup|What happens next", `extract(headings): blocks carry the section headings as h:true, in order (${heads.join(" | ")})`);
check(wh.blocks[0].h === true && wh.blocks[0].t === "The setup" && wh.blocks[1].h === false, "extract(headings): order is preserved (heading, then its paragraphs)");
check(!wh.blocks[wh.blocks.length - 1].h, "extract(headings): a dangling trailing heading (no body after) is dropped");

// 2) A schema.org-paywalled article (isAccessibleForFree=false) → accessible:false
//    even though a preview paragraph is present.
const pay = `<html><head><meta property="og:title" content="A subscriber scoop">
  <script type="application/ld+json">{"@type":"NewsArticle","isAccessibleForFree":false}</script>
  </head><body><article>
  <p>This is the opening paragraph shown to everyone before the wall comes down hard.</p>
  <p>The rest of this article is available only to subscribers of the publication today.</p>
  </article></body></html>`;
const p = extractReadable(pay, u("https://www.example-news.com/x"));
check(p.accessible === false, "extract: isAccessibleForFree=false marks the article not accessible");
checkEq(p.title, "A subscriber scoop", "extract: title still read for a paywalled article");

// 2b) A READ_OPEN host (SCMP) serves the same "metered" flag but its public page
//     carries the full body — we render what the public page returns (no login),
//     so the metered flag is ignored and the article reads in-pane.
const scmpBody = `<html><head><meta property="og:title" content="Trump offloads AI and tech shares">
  <script type="application/ld+json">{"@type":"NewsArticle","isAccessibleForFree":false}</script>
  </head><body><article>
  <p>US President Donald Trump sold tens of millions of dollars in artificial-intelligence and technology shares over the summer, new filings show.</p>
  <p>The disclosures list holdings led by Microsoft, Amazon and Meta among the positions trimmed across the period covered by the filing.</p>
  <p>Analysts said the sales, while sizeable in dollar terms, represented a modest share of the overall portfolio disclosed to regulators.</p>
  </article></body></html>`;
const scmp = extractReadable(scmpBody, u("https://www.scmp.com/news/x"));
check(scmp.accessible === true && scmp.paragraphs.length === 3, `extract: a READ_OPEN host renders its public body despite the metered flag (${scmp.paragraphs.length} paras)`);
// …but a READ_OPEN host that serves only a stub still can't be rendered (no body).
const scmpStub = extractReadable(`<html><head><title>SCMP</title></head><body><div id="app"></div></body></html>`, u("https://www.scmp.com/news/y"));
check(scmpStub.accessible === false && scmpStub.paragraphs.length === 0, "extract: a READ_OPEN host with no served body still falls back (no fabricated text)");

// 3) No readable body (e.g. a JS-rendered stub) → accessible:false.
const stub = `<html><head><title>Loading…</title></head><body><div id="app"></div></body></html>`;
const s = extractReadable(stub, u("https://www.reuters.com/x"));
check(s.accessible === false && s.paragraphs.length === 0, "extract: a body-less stub is not accessible (no fabricated text)");

// 3b) The first <article> is a related-story CARD (a teaser), with the real body
//     in a <div class="articleBody"> OUTSIDE it. Extraction must widen past the
//     thin scope to the document and pull the real paragraphs.
const cardFirst = `<html><head><meta property="og:title" content="Sterling slips as hawkish Fed lifts dollar"></head><body>
  <aside><article class="js-related-card"><p>More news</p></article></aside>
  <div class="WYSIWYG articlePage">
    <p>The pound eased against a broadly firmer dollar on Tuesday after Federal Reserve officials struck a more hawkish tone on the outlook.</p>
    <p>Gilt yields ticked higher across the curve as traders trimmed bets on any near-term Bank of England easing over the autumn months.</p>
    <p>Investors now look ahead to Wednesday's remarks from the Fed for the next steer on the policy path into the year-end stretch.</p>
  </div></body></html>`;
const c = extractReadable(cardFirst, u("https://www.investing.com/news/forex-news/x"));
check(c.accessible === true && c.paragraphs.length === 3, `extract: widens past a teaser <article> to the real body (${c.paragraphs.length} paras)`);
check(c.paragraphs[0].includes("pound eased"), "extract: pulls body paragraphs that sit outside <article>");

// 4) SSRF gate (readHostAllowed): any real public host is fetchable, but IP
//    literals and internal/reserved names are refused — so the reader can render
//    any openly-accessible article without becoming an open proxy to internal
//    services.
for (const h of ["theguardian.com", "www.some-newsroom.co.uk", "news.example.org", "a.b.c.example.com", "reuters.com"])
  check(readHostAllowed(h) === true, `host guard: allows the public host ${h}`);
for (const h of ["127.0.0.1", "169.254.169.254", "10.0.0.5", "192.168.1.1", "localhost", "metadata.internal", "db.local", "host", "", "[::1]", "example.com:8080"])
  check(readHostAllowed(h) === false, `host guard: blocks ${h || "(empty)"}`);

// 5) Reader-proxy body: the fallback path (r.jina.ai) hands back Markdown. proxyParagraphs
//    turns it into clean reading-mode paragraphs — links become their text, and images,
//    headings, nav and boilerplate are dropped.
const md = `# Dollar at two-month highs as the Fed outlook stays 'dominant'

![chart](https://example.com/a.png)

Exclusive news, data and analytics for financial market professionals Learn more about Refinitiv

The dollar climbed to a two-month high on Wednesday as investors leaned into a run of hawkish Federal Reserve commentary on the policy path.

Shares of General Motors [(GM.N), opens new tab](https://www.reuters.com/gm) and Meta [(META.O), opens new tab](https://www.reuters.com/meta) were flat to marginally higher in premarket trading on the day.

Subscribe to our newsletter

[Terms of use](https://www.reuters.com/terms)`;
const pp = proxyParagraphs(md);
check(pp.length === 2, `proxy: markdown reduces to the two body paragraphs (${pp.length})`);
check(pp[0].includes("two-month high") && !/^#/.test(pp[0]), "proxy: drops the heading, keeps the lede");
check(pp.some((p) => /General Motors \(GM\.N\) and Meta \(META\.O\)/.test(p)), "proxy: strips ', opens new tab' link a11y text and joins cleanly");
check(!pp.some((p) => /opens new tab|\]\(http/.test(p)), "proxy: no 'opens new tab' or leftover link markup");
check(!pp.some((p) => /Subscribe to our newsletter|Terms of use|financial market professionals|Refinitiv|!\[/.test(p)), "proxy: boilerplate (incl. the Refinitiv header), images dropped");

// 3c) A recirculation widget ("Popular Searches" + a list of headline LINKS) sits
//     inside the body scope, interleaved with the real prose. The section label and the
//     link-only headline rows must be dropped, keeping only the article's own sentences.
const recirc = `<html><head><meta property="og:title" content="Brazil next, US midterms coming, in impactful global election year"></head><body>
  <article>
    <h3>Popular Searches</h3>
    <p><a href="/news/n1">Nike falls 9% as revenue miss, weak guidance signal more pain ahead</a></p>
    <p><a href="/news/n2">Nonfarm payrolls loom large; bond market volatility - what's moving markets</a></p>
    <p><a href="/news/n3">S&amp;P 500 ends higher, Dow and Nasdaq mostly flat as bond rally offsets rise in oil</a></p>
    <p>LONDON, Oct 2 (Reuters) - Brazil's voters will choose from a field of presidential contenders on Sunday in a closely watched race that global markets are following.</p>
    <p>The contest is one of several remaining races out of some 40 worldwide this year that could impact financial markets and currencies across emerging economies.</p>
    <p>Analysts at <a href="/pro/cap">Capital Economics</a> said a market-friendly win could lift equities between 10% and 20% and pull local-currency bond yields lower over the quarter.</p>
  </article></body></html>`;
const rc = extractReadable(recirc, u("https://www.investing.com/news/economy/x"));
check(rc.paragraphs.length === 3, `extract: drops the "Popular Searches" headline-link rows, keeps the 3 prose paragraphs (${rc.paragraphs.length})`);
check(rc.paragraphs[0].startsWith("LONDON, Oct 2 (Reuters)"), "extract: the body starts at the real article lede, not the recirculation list");
check(!rc.paragraphs.some((p) => /Nike falls 9%|Nonfarm payrolls loom|Dow and Nasdaq mostly flat/.test(p)), "extract: none of the related-headline links leak into the body");
check(!rc.blocks.some((b) => /^Popular Searches/i.test(b.t)), "extract: the 'Popular Searches' widget heading is dropped (nav label)");
check(rc.paragraphs.some((p) => /Capital Economics said a market-friendly win/.test(p)), "extract: a prose paragraph with an inline link is kept (not treated as a link row)");

// 5b) The proxy (markdown) path drops a "Popular Searches" recirculation list — blocks
//     that are only links — while keeping prose that merely carries an inline link.
const recircMd = `## Popular Searches

[Nike falls 9% as revenue miss, weak guidance signal more pain ahead](/news/n1)

[Nonfarm payrolls loom large; bond market volatility - what's moving markets](/news/n2)

LONDON, Oct 2 (Reuters) - Brazil's voters will choose from a field of presidential contenders on Sunday in a closely watched race that global markets are following.

Analysts at [Capital Economics](/pro/cap) said a market-friendly win could lift equities between 10% and 20% and pull local-currency bond yields lower over the quarter.`;
const rcp = proxyParagraphs(recircMd);
check(rcp.length === 2, `proxy: drops the pure-link "Popular Searches" rows, keeps the 2 prose paragraphs (${rcp.length})`);
check(!rcp.some((p) => /Nike falls 9%|Nonfarm payrolls loom/.test(p)), "proxy: related-headline links do not leak into the body");
check(rcp[0].startsWith("LONDON, Oct 2 (Reuters)") && rcp.some((p) => /Capital Economics said/.test(p)), "proxy: keeps the lede and a prose paragraph that has an inline link");

// 3d) The recirculation strip some sites inject ABOVE the article as PLAIN TEXT (no link
//     or heading markup) — e.g. Investing.com's fixed four-headline block — must still be
//     dropped. Signature: a leading run of short headline-like paragraphs with no
//     sentence-ending punctuation, before the real (terminally-punctuated) body. The
//     AI-disclaimer / T&C footer is dropped too.
const plainRecirc = `<html><head><meta property="og:title" content="Austria's inflation climbs to 3.5% in September"></head><body>
  <article>
    <p>Nike falls 9% as revenue miss, weak guidance signal more pain ahead</p>
    <p>Nonfarm payrolls loom large; bond market volatility - what's moving markets</p>
    <p>Six AI picks are up 34%-106% since picked, the software name leads them all</p>
    <p>S&amp;P 500 ends higher, Dow and Nasdaq mostly flat as bond rally offsets rise in oil</p>
    <p>Investing.com -- Austria's inflation rate rose in September, according to a flash estimate released by Statistics Austria on Friday.</p>
    <p>The Harmonised Index of Consumer Prices showed inflation reached 3.5% year-over-year, up from 2.9% in August.</p>
    <p>This article was generated with the support of AI and reviewed by an editor. For more information see our T&amp;C.</p>
  </article></body></html>`;
const pr = extractReadable(plainRecirc, u("https://www.investing.com/news/economy/y"));
check(pr.paragraphs.length === 2, `extract: drops the plain-text recirculation headlines + AI/T&C footer, keeps the 2 body paragraphs (${pr.paragraphs.length})`);
check(pr.paragraphs[0].startsWith("Investing.com -- Austria's inflation"), "extract: the body starts at the real lede, not the injected headline strip");
check(!pr.paragraphs.some((p) => /Nike falls 9%|Nonfarm payrolls loom|Six AI picks|Dow and Nasdaq mostly flat/.test(p)), "extract: none of the four injected headlines leak into the body");
check(!pr.paragraphs.some((p) => /generated with the support of AI|see our T&C/i.test(p)), "extract: the AI-disclaimer / T&C footer is dropped");

// 3e) A NAV MENU pulled in with the article — a run of headings with no prose between
//     them (a publisher's "Research · Events · Jobs · Firms A-Z" chrome) — is dropped;
//     only headings that actually introduce body prose survive.
const navMenu = `<html><head><meta property="og:title" content="WilmerHale rebuilds in London"></head><body>
  <article>
    <h2>News &amp; Commentary</h2>
    <p>WilmerHale has rebuilt its London office with a double hire from Clifford Chance and Cooley, the firm confirmed on Friday.</p>
    <h3>Research</h3>
    <h3>Events</h3>
    <h3>Jobs</h3>
    <h3>Firms A-Z</h3>
    <h3>Global Elite 2026</h3>
    <h2>What happens next</h2>
    <p>The team will focus on cross-border disputes and competition work as the firm expands its European bench this year.</p>
  </article></body></html>`;
const nm = extractReadable(navMenu, u("https://www.thelawyer.com/wilmerhale-london/"));
check(nm.paragraphs.length === 2, `extract: keeps the 2 real paragraphs around the nav menu (${nm.paragraphs.length})`);
const nmHeads = nm.blocks.filter((b) => b.h).map((b) => b.t);
check(nmHeads.join("|") === "News & Commentary|What happens next", `extract: bodyless nav headings (Research/Events/Jobs/Firms A-Z/Global Elite) are dropped, content headings kept (${nmHeads.join(" · ")})`);
check(!nm.blocks.some((b) => /^(Research|Events|Jobs|Firms A-Z|Global Elite)/.test(b.t)), "extract: no nav-menu heading leaks into the reader");

// 5c) proxyBlocks: the markdown proxy path strips the same plain-text recirculation strip
//     AND preserves a REAL section heading (## …) as a bold block in document order.
const proxyMd = `# Austria's inflation climbs to 3.5% in September

Nike falls 9% as revenue miss, weak guidance signal more pain ahead

Nonfarm payrolls loom large; bond market volatility - what's moving markets

Investing.com -- Austria's inflation rate rose in September, according to a flash estimate released by Statistics Austria on Friday.

## What the data shows

The Harmonised Index of Consumer Prices showed inflation reached 3.5% year-over-year, up from 2.9% in August.

This article was generated with the support of AI and reviewed by an editor. For more information see our T&C.`;
const pb = proxyBlocks(proxyMd);
const pbBody = pb.filter((x) => !x.h).map((x) => x.t);
const pbHeads = pb.filter((x) => x.h).map((x) => x.t);
check(pbBody.length === 2 && pbBody[0].startsWith("Investing.com -- Austria's inflation"), `proxy: strips the leading headline strip, keeps the 2 body paragraphs (${pbBody.length})`);
check(!pbBody.some((p) => /Nike falls 9%|Nonfarm payrolls loom/.test(p)), "proxy: injected headlines don't leak into the body");
check(!pbBody.some((p) => /generated with the support of AI|see our T&C/i.test(p)), "proxy: the AI-disclaimer / T&C footer is dropped");
check(pbHeads.join("|") === "What the data shows", `proxy: a real ## section heading is kept as a bold block (${pbHeads.join(" | ")})`);
check(pb[0].h === false && pb[1].h === true && pb[2].h === false, "proxy: order preserved — lede paragraph, then the heading, then its paragraph");
// The article title (# h1) is NOT emitted as a heading block (shown separately).
check(!pbHeads.some((h) => /Austria's inflation climbs/.test(h)), "proxy: the h1 article title is not duplicated as a section heading");

finish();
