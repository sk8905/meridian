// Unit coverage for the Worker reader service's pure extractor (extractReadable).
// The live fetch can't run here (egress blocked), but the extraction is a pure string
// pass, so we feed it representative HTML and assert the reading-mode output: title,
// byline/date, clean paragraphs (boilerplate stripped, entities decoded, <article>
// preferred), and the paywall signal (schema.org isAccessibleForFree=false).
import { extractReadable, readHostAllowed, proxyParagraphs, proxyBlocks } from "../src/index.js";
import { check, checkEq, finish } from "./lib.mjs";
import fs from "node:fs";

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

// 6) Content IMAGES — direct HTML path. A <figure> image (caption → alt) and a standalone
//    content <img> are kept IN ORDER between the paragraphs; a logo (.svg), a share icon
//    and an advert are dropped; relative src is resolved to an absolute URL. Images are in
//    `blocks` only, never in `paragraphs`.
// CHART-ONLY policy: the reading pane includes an image ONLY if it is a chart / data-viz
// (a chart-service CDN, or a chart/figure word in the URL or alt/caption); every photo,
// portrait, logo, icon and social-card hero is dropped — however descriptive its alt.
const imgArt = `<!doctype html><html><head>
  <meta property="og:title" content="A story with pictures">
  <meta property="og:image" content="https://cdn.site.com/cards/social-card.jpg">
  </head><body><article>
  <p>This is the opening paragraph of the story, comfortably past the forty-character body minimum so it is kept.</p>
  <figure><img src="/media/hy-spreads-chart.png" alt="raw alt"><figcaption>Chart: HY spreads widened sharply in Q3</figcaption></figure>
  <p>A second substantial paragraph that also clears the minimum length so the body is unambiguous and real.</p>
  <img src="https://cdn.site.com/assets/logo.svg" alt="site logo">
  <img src="https://cdn.site.com/icons/share-facebook.png" alt="share">
  <img src="https://cdn.site.com/photos/wire-hero.jpg" alt="Reuters">
  <img src="https://cdn.site.com/photos/scene2.jpg?w=800" alt="A descriptive editorial photo">
  </article></body></html>`;
const ia = extractReadable(imgArt, u("https://www.legalcheek.com/2026/10/story/"));
const iaImgs = ia.blocks.filter((b) => b.img);
checkEq(iaImgs.length, 1, `images: keeps ONLY the chart; drops the logo, share icon, wordmark AND the editorial photo (${iaImgs.length})`);
check(!iaImgs.some((b) => /wire-hero|social-card|scene2/.test(b.img)), "images: photos + the og:image social card are not included (chart-only)");
checkEq(iaImgs[0].img, "https://www.legalcheek.com/media/hy-spreads-chart.png", "images: a relative chart <figure> src is resolved to an absolute URL");
checkEq(iaImgs[0].alt, "Chart: HY spreads widened sharply in Q3", "images: the <figcaption> is used as the chart caption/alt");
check(ia.blocks[0] && !ia.blocks[0].img && ia.blocks[1] && ia.blocks[1].img && ia.blocks[2] && !ia.blocks[2].img,
  "images: the chart sits in document order between the paragraphs");
check(ia.paragraphs.length === 2 && !ia.paragraphs.some((p) => /jpg|svg|png/i.test(p)), `images: paragraphs stay text-only (${ia.paragraphs.length})`);
check(ia.accessible, "images: the article is still accessible (images don't affect the body check)");

// 7) Content IMAGES — markdown proxy path. ![alt](url) becomes an image block in order;
//    a logo (.svg) and an advert are dropped; a relative src resolves against the base.
const imgMd = `# A story with pictures

The opening paragraph of the proxied markdown story, comfortably past the forty-character body minimum so it is kept.

![Barristers outside court](/media/barristers.jpg)

A second real paragraph of the proxied story, also well past the minimum length to count as genuine body prose.

![site logo](https://cdn.site.com/assets/logo.svg)
![promo](https://cdn.site.com/ads/advert-banner.png)
![Reuters](https://cdn.site.com/photos/wire-wordmark.jpg)
![A chart of yields](https://cdn.site.com/photos/chart.png)`;
const mb = proxyBlocks(imgMd, "https://www.legalcheek.com/2026/10/story/");
const mbImgs = mb.filter((b) => b.img);
checkEq(mbImgs.length, 1, `proxy-images: keeps ONLY the chart; drops the barristers photo, logo, advert + wordmark (${mbImgs.length})`);
check(!mbImgs.some((b) => /wire-wordmark|barristers/.test(b.img)), "proxy-images: photos + bare-brand-alt markdown images are skipped (chart-only)");
checkEq(mbImgs[0].img, "https://cdn.site.com/photos/chart.png", "proxy-images: the chart image (filename + alt) is kept with its absolute URL");
checkEq(mbImgs[0].alt, "A chart of yields", "proxy-images: the markdown alt text is carried as the caption");
check(!proxyParagraphs(imgMd).some((p) => /jpg|svg|png/i.test(p)), "proxy-images: proxyParagraphs stays text-only (no image URLs)");

// 8) og:image LEAD fallback — a WordPress-style page whose featured image sits OUTSIDE
//    <article>, so the body scan finds no images. The page's og:image is then used as a
//    single lead hero image (resolved absolute, filtered), placed FIRST. Body text is
//    long enough that the extractor keeps the <article> scope (no whole-doc fallback that
//    would otherwise grab the header image).
const P1 = "The Court of Appeal handed down a lengthy judgment on Tuesday that lawyers said would reshape how commercial disputes over software licensing are argued, with the panel setting out a detailed framework for assessing damages where the alleged breach is technical in character rather than straightforwardly financial.";
const P2 = "Barristers who acted in the case said the ruling clarified years of uncertainty, and that chambers across London were already circulating notes to clients on what the decision means for ongoing matters and for the careful drafting of future commercial technology agreements between large counterparties.";
// og:image lead is recovered ONLY when it is a chart — a photo social card is NOT added.
const heroChartArt = `<!doctype html><html><head>
  <meta property="og:title" content="A ruling whose chart sits outside the article">
  <meta property="og:image" content="/wp-content/uploads/2026/10/damages-framework-chart.png">
  </head><body>
  <header class="site-head"><img src="https://www.legalcheek.com/wp-content/uploads/2026/10/damages-framework-chart.png" alt="chart"></header>
  <article><p>${P1}</p><p>${P2}</p></article></body></html>`;
const hero = extractReadable(heroChartArt, u("https://www.legalcheek.com/2026/10/ruling/"));
const heroImgs = hero.blocks.filter((b) => b.img);
checkEq(heroImgs.length, 1, `og-lead: a CHART featured image outside <article> is recovered from og:image (${heroImgs.length})`);
check(heroImgs[0] && heroImgs[0].img === "https://www.legalcheek.com/wp-content/uploads/2026/10/damages-framework-chart.png", `og-lead: the og:image chart is resolved to an absolute URL (${heroImgs[0] && heroImgs[0].img})`);
check(hero.blocks[0] && hero.blocks[0].img, "og-lead: the hero chart is placed first, before the body");
check(hero.paragraphs.length === 2, `og-lead: the two body paragraphs still render (${hero.paragraphs.length})`);
// The SAME page with a PHOTO og:image adds no hero (chart-only).
const heroPhoto = extractReadable(heroChartArt.replace(/damages-framework-chart\.png/g, "courts-exterior.jpg"), u("https://www.legalcheek.com/2026/10/ruling/"));
checkEq(heroPhoto.blocks.filter((b) => b.img).length, 0, "og-lead: a PHOTO og:image is NOT added as a hero (chart-only)");

// 9) Relevance — an author HEADSHOT captioned "thumbnail" is chrome, not content, and is
//    dropped (the figcaption is a bare generic alt).
const thumbArt = `<!doctype html><html><head><meta property="og:title" content="A piece with an author thumbnail"></head><body><article>
  <p>Opening paragraph long enough to clear the forty-character body minimum so the body is real and kept.</p>
  <figure><img src="https://image.cnbcfm.com/api/v1/image/107000000-davis.jpg"><figcaption>thumbnail</figcaption></figure>
  <p>A second paragraph also comfortably past the minimum length to be unambiguous body prose.</p>
  </article></body></html>`;
const th = extractReadable(thumbArt, u("https://www.cnbc.com/2026/10/02/story.html"));
checkEq(th.blocks.filter((b) => b.img).length, 0, "relevance: an author headshot captioned 'thumbnail' is dropped (not article content)");

// 10) Embedded tweet — DIRECT HTML. A <blockquote class="twitter-tweet"> carrying the
//     status permalink becomes a {tweetId} placeholder (resolved to a card by the handler
//     via the X API); its inner text is NOT duplicated as a paragraph.
const tweetArt = `<!doctype html><html><head><meta property="og:title" content="A story that embeds a tweet"></head><body><article>
  <p>Opening paragraph of the story, well past the forty-character minimum so it is kept as real body prose.</p>
  <blockquote class="twitter-tweet"><p lang="en">Lawyers who didn't feature grabbed the popcorn across social media...</p>&mdash; Gareth Weetman KC (@Barrister7) <a href="https://twitter.com/Barrister7/status/1973500000000000001">October 1, 2026</a></blockquote>
  <p>A closing paragraph, also comfortably past the minimum length to count as genuine body text.</p>
  </article></body></html>`;
const ta = extractReadable(tweetArt, u("https://www.legalcheek.com/2026/10/story/"));
const taEmb = ta.blocks.filter((b) => b.tweetId);
checkEq(taEmb.length, 1, `embed: a twitter-tweet blockquote emits one {tweetId} placeholder (${taEmb.length})`);
checkEq((taEmb[0] || {}).tweetId, "1973500000000000001", "embed: the tweet's status id is captured from the permalink");
check(!ta.paragraphs.some((p) => /grabbed the popcorn/.test(p)), "embed: the tweet's inner text is not duplicated as a paragraph");
check(ta.blocks[0] && !ta.blocks[0].tweetId && ta.blocks[1] && ta.blocks[1].tweetId && ta.blocks[2] && !ta.blocks[2].tweetId, "embed: the placeholder sits in document order between the paragraphs");

// 11) Embedded tweet — MARKDOWN proxy. A block carrying a twitter/x status URL becomes a
//     {tweetId} placeholder and is not duplicated as prose.
const tweetMd = `# Story

Opening paragraph of the proxied story, comfortably past the forty-character minimum so it is kept.

Lawyers who didn't feature grabbed the popcorn across social media... — Gareth Weetman KC (@Barrister7) [October 1, 2026](https://x.com/Barrister7/status/1973500000000000001)

A closing paragraph of the proxied story, also well past the minimum length to count as body prose.`;
const tmb = proxyBlocks(tweetMd, "https://www.legalcheek.com/2026/10/story/");
const tmEmb = tmb.filter((b) => b.tweetId);
checkEq(tmEmb.length, 1, `proxy-embed: a markdown block with a status URL emits one {tweetId} (${tmEmb.length})`);
checkEq((tmEmb[0] || {}).tweetId, "1973500000000000001", "proxy-embed: the status id is captured from the URL");
check(!proxyParagraphs(tweetMd).some((p) => /grabbed the popcorn/.test(p)), "proxy-embed: the tweet block is not duplicated as a paragraph");

// 12) Image TRUST — a SHORT article whose body makes the extractor WIDEN to the whole
//     document must NOT pick up images from outside the article scope: a "related
//     stories" / "latest" recirculation grid, promo banners, or the same generic photo
//     a site puts on every post. Only the image INSIDE <article> survives.
const recircArt = `<!doctype html><html><head><meta property="og:title" content="A short story on a busy page"></head><body>
  <article>
    <p>The hedge fund's pay dispute is heading back to court after an appellate panel reopened the long-running matter.</p>
    <figure><img src="/media/the-real-story-chart.png"><figcaption>Chart: fund returns since launch</figcaption></figure>
    <p>Lawyers for both sides said the ruling turned on the weight given to recollections of conversations years earlier.</p>
  </article>
  <aside class="related">
    <h3>Related stories</h3>
    <p>Hedge funds endured a difficult September as rising bond yields, stronger oil prices and sharp swings in AI-related stocks dented returns across several major strategies this autumn.</p>
    <img src="/promo/awards-banner-chart.jpg" alt="Awards banner">
    <img src="/wp-content/uploads/generic-grass.jpg" alt="">
  </aside></body></html>`;
const recircRes = extractReadable(recircArt, u("https://www.hedgeweek.com/story/"));
const recircImgs = recircRes.blocks.filter((b) => b.img);
check(recircImgs.length === 1 && /the-real-story-chart/.test(recircImgs[0].img),
  `image-trust: a widened article keeps ONLY its in-scope chart, dropping the out-of-scope grid even when a file says "chart" (${recircImgs.map((b) => b.img).join(", ") || "none"})`);
check(!recircImgs.some((b) => /awards-banner|generic-grass/.test(b.img)), "image-trust: out-of-scope recirculation/promo images are not included");

// 13) Generic hero — a SHORT article that widens must NOT fall back to the page's
//     og:image, which on such pages is typically the site's generic social-share default
//     (the same image on every post), not this story's picture.
const genericHeroArt = `<!doctype html><html><head>
  <meta property="og:title" content="A short post with a generic social image">
  <meta property="og:image" content="/wp-content/uploads/generic-social-default.jpg">
  </head><body>
  <article>
    <p>Quant hedge funds are among the biggest winners from this year's sharp sell-off in government bonds.</p>
    <p>Trend-following strategies captured the move early and have widened their lead over the rest of the field.</p>
  </article>
  <aside class="latest">
    <h3>Latest news</h3>
    <p>Castle Hook has set a New York office rent record with a lease valued at more than twenty-one million dollars a year across several midtown floors.</p>
  </aside></body></html>`;
const genHeroRes = extractReadable(genericHeroArt, u("https://www.hedgeweek.com/quant-post/"));
checkEq(genHeroRes.blocks.filter((b) => b.img).length, 0, "generic-hero: a widened (thin) article does not add the og:image social default as a hero");

// 14) Decorative chrome — a STANDALONE <img> with NO alt text is a background/featured/
//     social-card image (hero cards, section banners, the og:image a site drops inline on
//     every post), not an editorial photo. It is dropped; a standalone <img> WITH a
//     descriptive alt is kept. Mirrors the real Hedgeweek markup, which repeats its
//     og:image + a theme banner inline, both alt="" class="... object-cover".
const CHROME_BODY = "The fund told investors that performance in the quarter was shaped by rates, oil and a sharp rotation out of crowded AI names, and that it had trimmed risk into month-end rather than chase the move.";
const chromeArt = `<!doctype html><html><head><meta property="og:title" content="A story with a decorative banner"></head><body><article>
  <p>${CHROME_BODY}</p>
  <img src="https://assets.site.com/2026-08-Copy-of-Square-108456.png" alt="" class="absolute inset-0 w-full h-full object-cover">
  <p>${CHROME_BODY}</p>
  <img src="https://cdn.site.com/photos/trading-floor.jpg" alt="Traders on the floor during the sell-off">
  <figure><img src="https://cdn.site.com/charts/sell-off-returns.png"><figcaption>Chart: strategy returns through the sell-off</figcaption></figure>
  </article></body></html>`;
const chromeRes = extractReadable(chromeArt, u("https://www.hedgeweek.com/news/story"));
const chromeImgs = chromeRes.blocks.filter((b) => b.img);
check(chromeImgs.length === 1 && /sell-off-returns/.test(chromeImgs[0].img),
  `chrome: the alt-less banner AND the alt'd trading-floor photo are dropped; only the chart is kept (${chromeImgs.map((b) => b.img).join(", ") || "none"})`);
check(!chromeImgs.some((b) => /Copy-of-Square|trading-floor/.test(b.img)), "chrome: neither the decorative banner nor an editorial photo (even with alt) is included");

// 15) Thumbnails & avatars — a related-post featured image (a small "-WxH" WordPress
//     thumbnail) and an author headshot (a "-circ-" circular crop) are chrome, not the
//     story's photo. They are dropped even WITH alt text; the full-size hero (no small
//     size suffix, descriptive alt) is kept. Mirrors the real Legal Business markup.
const thumbArt2 = `<!doctype html><html><head><meta property="og:title" content="A firm story with a hero, an author avatar and a related thumb"></head><body><article>
  <img src="https://www.lb.co.uk/wp-content/uploads/2026/01/Will-circ-300.png" alt="Will Lewallen">
  <p>A pair of the firm's New York private equity partners are leaving, less than three years after they joined from a rival, in a closely watched lateral move.</p>
  <img src="https://www.lb.co.uk/wp-content/uploads/2026/03/Reception-scaled_cropped.jpg" alt="The firm's New York reception">
  <figure><img src="https://www.lb.co.uk/wp-content/uploads/2026/03/lateral-moves-chart.png"><figcaption>Chart: partner lateral moves by firm</figcaption></figure>
  <p>The co-head of private capital and the US private capital head are both understood to be moving to a competitor, people familiar with the matter said.</p>
  <img width="300" height="163" src="https://www.lb.co.uk/wp-content/uploads/2024/07/frankfurt_v2-e1789990129855-300x163.jpg" alt="Frankfurt">
  </article></body></html>`;
const thumbRes = extractReadable(thumbArt2, u("https://www.legalbusiness.co.uk/law-firms/story/"));
const thumbImgs = thumbRes.blocks.filter((b) => b.img);
check(thumbImgs.length === 1 && /lateral-moves-chart/.test(thumbImgs[0].img),
  `thumbs: keeps only the chart; drops the author avatar, the full-size reception PHOTO and the -WxH related thumbnail (${thumbImgs.map((b) => b.img.split("/").pop()).join(", ") || "none"})`);
check(!thumbImgs.some((b) => /Will-circ|frankfurt|Reception-scaled/.test(b.img)), "thumbs: headshot, related thumbnail AND the reception photo are not included");

// 16) Stock-agency filler — a generic stock photo (filename carries the agency, e.g.
//     "iStock-1126779135.jpg", getty/shutterstock/adobe stock) is decorative filler, not
//     the story's own image. Dropped even with alt text. (Observed on Alternative Credit
//     Investor.) A real content photo on the same page is kept.
const stockArt = `<!doctype html><html><head><meta property="og:title" content="A credit story with stock filler"></head><body><article>
  <p>The manager said it had closed its latest direct lending fund well above target, drawing commitments from pensions and insurers across Europe and the United States.</p>
  <img src="https://acreditinvestor.com/wp-content/uploads/2026/09/iStock-1126779135.jpg" alt="City skyline at dusk">
  <img src="https://acreditinvestor.com/wp-content/uploads/2026/09/jane-doe-cio-portrait.jpg" alt="Jane Doe, chief investment officer">
  <figure><img src="https://acreditinvestor.com/wp-content/uploads/2026/09/direct-lending-fundraising.png"><figcaption>Figure 1: direct-lending fundraising by quarter</figcaption></figure>
  <p>Managers have raced to raise private credit vehicles this year as banks retreat from leveraged lending and investors chase floating-rate yield.</p>
  </article></body></html>`;
const stockRes = extractReadable(stockArt, u("https://acreditinvestor.com/story/"));
const stockImgs = stockRes.blocks.filter((b) => b.img);
check(stockImgs.length === 1 && /direct-lending-fundraising/.test(stockImgs[0].img),
  `stock: the iStock filler AND the CIO portrait are dropped; only the figure/chart is kept (${stockImgs.map((b) => b.img.split("/").pop()).join(", ") || "none"})`);
check(!stockImgs.some((b) => /iStock/i.test(b.img) || /jane-doe/.test(b.img)), "stock: neither the stock photo nor the portrait is included");

// 17) Render-size thumbnails via QUERY params — an imgix/CDN "?w=150&h=150" resize marks a
//     thumbnail (related/nav/author crop) just like a "-WxH" filename suffix; a large
//     "?w=1200" render is a full content image. Publishers like The Lawyer size via query,
//     not filename, so both encodings must be caught.
const imgixArt = `<!doctype html><html><head><meta property="og:title" content="A story served via an image CDN"></head><body><article>
  <p>The firm confirmed the move on Monday, adding to a run of senior lateral hires across its disputes and corporate practices this year.</p>
  <img src="https://cdn.imgix.net/uploads/author-portrait.jpg?fit=crop&q=45&w=150&h=150" alt="Author portrait">
  <img src="https://cdn.imgix.net/uploads/the-new-office.jpg?fit=crop&q=45&w=1200&h=800" alt="The firm's new office">
  <figure><img src="https://cdn.imgix.net/uploads/hiring-chart.png?fit=max&q=70&w=1200" alt="Lateral hires by quarter"><figcaption>Chart: lateral hires by quarter</figcaption></figure>
  <p>Rivals have ramped up hiring in the City as transactional work recovers and competition for senior partners intensifies.</p>
  </article></body></html>`;
const imgixImgs = extractReadable(imgixArt, u("https://www.example-news.com/story/")).blocks.filter((b) => b.img);
check(imgixImgs.length === 1 && /hiring-chart/.test(imgixImgs[0].img),
  `imgix: the "?w=150" thumbnail AND the full-size office PHOTO are dropped; only the full-size chart is kept (${imgixImgs.map((b) => b.img.split("/").pop().split("?")[0]).join(", ") || "none"})`);
check(!imgixImgs.some((b) => /author-portrait|the-new-office/.test(b.img)), "imgix: neither the thumbnail nor the full-size photo is included (chart-only)");

// 18) Subscription-only publishers are listed in READ_PAYWALL so the reader never fetches
//     them (a public fetch returns only the subscribe wall) and the row opens at the
//     publisher. The Lawyer is one (confirmed live: a public/proxy fetch yields only promo
//     + 150px nav thumbnails). Config lock — the fetch gate itself needs egress to exercise.
const _src = fs.readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
check(/const READ_PAYWALL = new Set\(\[[\s\S]*?"thelawyer\.com"[\s\S]*?\]\)/.test(_src),
  "paywall: thelawyer.com is in READ_PAYWALL (subscription-only — opens at the publisher, not rendered)");

// 19) Per-host image CHROME suppression — a few publishers wrap every article in masthead
//     logos, promo banners and a related-story thumbnail rail whose files share the real
//     hero's CDN bucket/alt, so the per-file filters can't separate them. The PROXY path
//     has no <article> scope, so the chrome accumulates. For a READ_IMG_HOST_SKIP host the
//     article TEXT still renders but ALL images are suppressed; a non-listed host is
//     unaffected. (Observed on The Global Legal Post.)
const glpMd = `# Ex-A&O senior partner launches AI-native law firm

![The Global Legal Post](https://www-globallegalpost-static.s3.eu-west-2.amazonaws.com/images/glp_transparent_v2.png)

A senior lawyer who helped orchestrate the merger between Allen & Overy and Shearman & Sterling has co-founded an AI-native law firm aimed at European small and medium-sized businesses.

![Click here to book now](https://www-globallegalpost-static.s3.eu-west-2.amazonaws.com/images/LLS_New_York_600x120px.jpg)

The firm will review commercial contracts, including non-disclosure and data-processing agreements, for a flat monthly fee, undercutting the cost of outsourcing similar work to a traditional law firm.`;
const glpBlocks = proxyBlocks(glpMd, "https://www.globallegalpost.com/news/some-story-123");
check(glpBlocks.filter((b) => b.img).length === 0, `host-img-skip: all images are suppressed for an image-chrome host (${glpBlocks.filter((b) => b.img).length})`);
check(glpBlocks.filter((b) => b.t && !b.h && !b.img).length === 2, `host-img-skip: the article body text still renders in full (${glpBlocks.filter((b) => b.t && !b.h && !b.img).length} paras)`);
// A non-listed host on the SAME markdown keeps a CHART; a photo on it is still dropped.
const okMd = `# A markets story

A trading-floor photograph that is the article's own lead image.

![Traders at work](https://cdn.example-news.com/uploads/2026/10/trading-floor-lead.jpg)

![Chart: index path this week](https://cdn.example-news.com/uploads/2026/10/index-path-chart.png)

The index closed higher as investors weighed the central bank's latest guidance on the path of interest rates.`;
const okBlocks = proxyBlocks(okMd, "https://www.example-news.com/markets/story");
const okImgs = okBlocks.filter((b) => b.img);
check(okImgs.length === 1 && /index-path-chart/.test(okImgs[0].img), `host-img-skip: a non-listed host keeps the chart but drops the trading-floor photo (${okImgs.length})`);

// 20) Chart-only policy, locked. A chart-service CDN image is kept; a descriptive editorial
//     photo (the "That '70s Show" still on a 1970s-inflation column — the reported bug) is
//     dropped; an embedded tweet is unaffected (it rides the {tweetId} path, not images).
const CP = "Surging inflation, falling real wages and an energy crisis have investors reaching for the 1970s playbook, with strategists debating whether the parallels to that decade are real or merely rhyming this time around.";
const policyArt = `<!doctype html><html><head><meta property="og:title" content="It's beginning to look a lot like the 1970s"></head><body><article>
  <p>${CP}</p>
  <figure><img src="https://images.mktw.net/im-99887766/that-70s-show-cast.jpg" alt="Danny Masterson, Ashton Kutcher and Topher Grace in That '70s Show"><figcaption>Are you ready for a '70s show, but for real?</figcaption></figure>
  <p>${CP}</p>
  <img src="https://datawrapper.dwcdn.net/Ab3x9/2/full.png" alt="US CPI year over year">
  <blockquote class="twitter-tweet"><p lang="en">The 1970s called...</p>&mdash; An Economist (@econ) <a href="https://twitter.com/econ/status/1973500000000000999">October 5, 2026</a></blockquote>
  </article></body></html>`;
const policy = extractReadable(policyArt, u("https://www.marketwatch.com/story/1970s"));
const policyImgs = policy.blocks.filter((b) => b.img);
check(policyImgs.length === 1 && /datawrapper\.dwcdn\.net/.test(policyImgs[0].img),
  `chart-only: a chart-service CDN image is kept, the editorial photo is dropped (${policyImgs.map((b) => b.img.split("/").pop()).join(", ") || "none"})`);
check(!policyImgs.some((b) => /that-70s-show/.test(b.img)), "chart-only: the 'That '70s Show' editorial still is NOT included");
check(policy.blocks.some((b) => b.tweetId === "1973500000000000999"), "chart-only: an embedded tweet is still captured (tweets are unaffected by the image policy)");

// 21) Promo / subscription / anti-adblock / photo-credit boilerplate — the proxy flattens a
//     publisher's page furniture into the markdown; these lines are dropped while the real
//     prose is kept. (Observed on a MarketWatch opinion column rendered via the proxy.)
const junkMd = `# Opinion: a 1970s column

Is it time to dust off the financial playbook from that dismal decade?

Choose MarketWatch as a preferred source of financial news

Are you ready for a 70s show, but for real?Photo: 20th Century Fox/Courtesy Everett Collection

Surging inflation, falling wages and an energy crisis have investors reaching for the 1970s playbook as strategists debate whether the decade's parallels are real or merely rhyming.

Create a Free Account

Get unlimited access to MarketWatch, The Wall Street Journal, and Barrons.

Brett Arends is an award-winning financial writer with many years of experience covering markets and economics.

This page has been blocked by an extension`;
const junkParas = proxyBlocks(junkMd, "https://www.marketwatch.com/story/1970s").filter((b) => b.t && !b.img && !b.tweetId).map((b) => b.t);
check(junkParas.length === 2, `boilerplate: only the two real body lines survive (${junkParas.length})`);
check(!junkParas.some((p) => /preferred source|Create a Free Account|unlimited access|award-winning|blocked by an extension|Courtesy Everett Collection|Photo:/i.test(p)),
  "boilerplate: promo CTAs, the author bio, the anti-adblock line and the photo-credit caption are all dropped");
check(junkParas.some((p) => /Surging inflation/.test(p)), "boilerplate: the real article prose is kept");

// 22) Trailing site-footer / sponsor strip — a publisher's page chrome at the FOOT of the
//     article (a sponsor/"Associates" name, a company-registration blurb, a copyright line,
//     a "Website by…" / "…marketing by…" build credit) is truncated as one tail, the mirror
//     of the leading-recirc strip. The last real body sentence is the cut point. (Observed
//     on Legal Futures, whose sitewide footer leaked into the reading pane.)
const footMd = `# CA overturns ruling that solicitor turned 'blind eye' to fraud

The Court of Appeal has overturned a ruling that a solicitor turned a blind eye to fraud, finding the test for blind-eye knowledge had not been met on the facts of the case.

In this case the findings were consistent with negligence, and the requirements of blind-eye knowledge were not met.

## AspiraCloud

Legal Futures Publishing Limited, Registered in England No. 7135808. Registered office: Handel House, 95 High Street, Edgware, Middlesex, HA8 7DB

© Legal Futures - 2026

Website by Pixel Pixel

Legal marketing by legmark`;
const footParas = proxyBlocks(footMd, "https://www.legalfutures.co.uk/latest-news/story").filter((b) => b.t).map((b) => b.t);
check(footParas.length === 2, `footer-strip: only the two real body paragraphs survive (${footParas.length})`);
check(!footParas.some((p) => /AspiraCloud|Registered in England|Registered office|Website by|marketing by|©/i.test(p)),
  "footer-strip: the sponsor name, registration blurb, copyright and build-credit lines are all dropped");
check(footParas.some((p) => /blind-eye knowledge were not met/.test(p)), "footer-strip: the final real article sentence is kept");

// Same footer via the DIRECT-HTML path (inside <article>).
const footArt = `<html><head><title>CA overturns ruling</title></head><body><article>
<p>The Court of Appeal has overturned a ruling that a solicitor turned a blind eye to fraud, finding the test had not been met on the facts of the case.</p>
<p>In this case the findings were consistent with negligence, and the requirements of blind-eye knowledge were not met.</p>
<h3>AspiraCloud</h3>
<p>Legal Futures Publishing Limited, Registered in England No. 7135808. Registered office: Handel House, 95 High Street, Edgware, Middlesex, HA8 7DB</p>
<p>&copy; Legal Futures - 2026</p>
<p>Website by Pixel Pixel</p>
</article></body></html>`;
const footDirect = extractReadable(footArt, u("https://www.legalfutures.co.uk/latest-news/story")).paragraphs;
check(footDirect.length === 2 && !footDirect.some((p) => /AspiraCloud|Registered|Website by|©/i.test(p)),
  `footer-strip (direct HTML): footer + sponsor tail dropped, ${footDirect.length} real paragraphs kept`);

// GUARD — real prose that merely mentions "registered in <place>" or a year must NOT be
// truncated (the footer markers are footer-specific, not word-matches on "registered"/years).
const guardMd = `# A fund story

The fund is registered in Delaware and has operated since 2019, according to filings reviewed this week by analysts.

In 2026 the firm expanded into Europe, opening offices in three countries and hiring dozens of staff across the year.

Executives said the strategy would continue through the decade as demand grew for the flagship product worldwide.`;
const guardParas = proxyBlocks(guardMd, "https://example.com/story").filter((b) => b.t && !b.h).map((b) => b.t);
check(guardParas.length === 3, `footer-strip guard: real prose mentioning "registered in" / years is NOT truncated (${guardParas.length}/3 kept)`);

// 23) Trailing NEWSLETTER / APP-DOWNLOAD promo tail — a "subscribe to our stuff" block
//     appended below the article (newsletter sign-up, "Get the <brand> app", "in your
//     inbox", "Join our channel…"). It carries no legal-footer signature, so the trailing
//     strip must also key off promo markers — but only when the whole trailing run is junk,
//     never cutting real prose. (Observed on Channel NewsAsia.)
const promoMd = `# Nvidia, Broadcom shielded as AI power crunch hits chip supply chain

Nvidia and Broadcom are relatively insulated from a worsening US data-center power crunch, but any resultant delay in AI deployments can affect makers of memory and other secondary chip components, Morgan Stanley said on Monday.

If chip capacity cannot be deployed, customers could push out deliveries or cancel orders, with memory, optics and analog components most exposed to inventory disruption, the brokerage said.

## Week in Review

Our chief editor shares analysis and picks of the week's biggest news every Saturday.

Get our pick of top stories and thought-provoking articles in your inbox.

## Get the CNA app

Stay updated with notifications for breaking news and our best stories.

Join our channel for the top reads for the day on your preferred chat app.`;
const promoParas = proxyBlocks(promoMd, "https://www.channelnewsasia.com/business/story").filter((b) => b.t).map((b) => b.t);
check(promoParas.length === 2, `promo-tail: only the two real body paragraphs survive (${promoParas.length})`);
check(!promoParas.some((p) => /Week in Review|Get the CNA app|in your inbox|chief editor|Stay updated|Join our channel|preferred chat app/i.test(p)),
  "promo-tail: the newsletter / app-download / follow-us promo block is dropped");
check(promoParas.some((p) => /most exposed to inventory disruption/.test(p)), "promo-tail: the final real article sentence is kept");

// GUARD — an article that simply ends on a short section heading + a short real line (no
// footer / promo signature in the trailing run) must NOT be truncated.
const tailOkMd = `# A committee story

The committee reached its decision after a long debate that stretched well into the evening on Thursday night.

Members voted by a clear margin to adopt the new rules, which take effect at the start of next month across the region.

## What happens next

The rules will be reviewed again in a year.`;
const tailOk = proxyBlocks(tailOkMd, "https://example.com/committee").filter((b) => b.t);
check(tailOk.length === 4 && tailOk.some((b) => /reviewed again in a year/.test(b.t)),
  `promo-tail guard: a clean article ending on a short heading + line is NOT truncated (${tailOk.length} blocks kept)`);

finish();
