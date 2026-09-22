// Unit coverage for the Worker reader service's pure extractor (extractReadable).
// The live fetch can't run here (egress blocked), but the extraction is a pure string
// pass, so we feed it representative HTML and assert the reading-mode output: title,
// byline/date, clean paragraphs (boilerplate stripped, entities decoded, <article>
// preferred), and the paywall signal (schema.org isAccessibleForFree=false).
import { extractReadable } from "../src/index.js";
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

// 3) No readable body (e.g. a JS-rendered stub) → accessible:false.
const stub = `<html><head><title>Loading…</title></head><body><div id="app"></div></body></html>`;
const s = extractReadable(stub, u("https://www.reuters.com/x"));
check(s.accessible === false && s.paragraphs.length === 0, "extract: a body-less stub is not accessible (no fabricated text)");

finish();
