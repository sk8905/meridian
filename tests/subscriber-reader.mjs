// Subscriber reader (owner 2026-10-23). FT / Bloomberg / WSJ / The Economist are the owner's
// own subscriptions: their stories read in-pane from (1) a stored newsletter issue that links
// the story, (2) the owner's own logged-in session (SUB_COOKIE_* secret), else (3) the public
// standfirst + an "Open in the app" link. Pure helpers + the Worker paths, no egress (fetch is
// stubbed), plus a browser check of the pane.
import worker, { subCanon, isSubscriberArticle, nlLinkCandidates, nlFocusIndex, readAuthors, extractReadable } from "../src/index.js";
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

// ---- pure helpers ---------------------------------------------------------------------
checkEq(subCanon("https://www.ft.com/content/abc-123/?utm_source=x#top"), "https://ft.com/content/abc-123", "subCanon: no www / query / hash / trailing slash");
check(isSubscriberArticle("https://www.ft.com/content/ddd17044-0b38-446b-a973-d0ab80d5738c"), "isSubscriberArticle: an FT article");
check(isSubscriberArticle("https://www.bloomberg.com/news/articles/2026-10-22/rapid-junk-rout"), "isSubscriberArticle: a Bloomberg article");
check(isSubscriberArticle("https://www.economist.com/finance-and-economics/2026/10/22/a-slug"), "isSubscriberArticle: an Economist article");
check(!isSubscriberArticle("https://www.bloomberg.com/account/newsletters/money-stuff"), "isSubscriberArticle: an account page is not an article");
check(!isSubscriberArticle("https://www.ft.com/markets"), "isSubscriberArticle: a section front is not an article");

const EMAIL = [
  "Money Stuff", " Derivatives, onions.", "", "View in browser <https://bloom.bg/view>", "",
  "Things happen", "",
  "Musk Tries to Lock In His Tesla-SpaceX Dream Before Trump’s Exit",
  "<https://bloom.bg/musk1>. Barclays to cut 5,000 jobs",
  "<https://bloom.bg/barc1> as bank steps up AI adoption.", "",
  "Gilts rallied after UK inflation cooled to 2.1%, the lowest reading since 2021, and traders added to rate-cut bets.",
  "Read more at <https://www.ft.com/content/aaaabbbb-cccc-dddd-eeee-ffff00001111?utm_medium=email>.", "",
  "Promo <https://sli.bloomberg.com/click?s=1&li=2>", "",
  "You received this message because you are subscribed to Money Stuff.",
  "Unsubscribe <https://www.bloomberg.com/account/newsletters/money-stuff?source=newsletter_unsub>",
].join("\n");
const cands = nlLinkCandidates(EMAIL);
const urls = cands.map((c) => c.url);
check(urls.includes("https://bloom.bg/barc1") && urls.includes("https://bloom.bg/musk1"), "nlLinkCandidates: short links in the body are found");
check(!urls.some((u) => /unsub|sli\.bloomberg/.test(u)), "nlLinkCandidates: unsubscribe / ad-click links are never candidates");
check(/Barclays to cut 5,000 jobs$/.test((cands.find((c) => c.url === "https://bloom.bg/barc1") || {}).snip || ""), "nlLinkCandidates: a link keeps the words before it as its snippet");
// A legit article whose slug / headline says "manager" or "accounting" is still a candidate.
const legit = nlLinkCandidates("Asset manager accounting probe widens\n<https://www.ft.com/content/aaaa1111-2222-3333-4444-555566667777>\nand more.");
check(legit.length === 1 && /Asset manager accounting probe widens/.test(legit[0].snip), "nlLinkCandidates: ordinary words like manager/accounting never block a link");
const blocks = [{ h: true, t: "Things happen" }, { t: "Musk Tries to Lock In His Tesla-SpaceX Dream Before Trump’s Exit. Barclays to cut 5,000 jobs as bank steps up AI adoption." }, { t: "Gilts rallied after UK inflation cooled." }];
checkEq(nlFocusIndex(blocks, "Musk Tries to Lock In His Tesla-SpaceX Dream Before Trump’s Exit. Barclays to cut 5,000 jobs"), 1, "nlFocusIndex: the block carrying the link's words");
checkEq(nlFocusIndex(blocks, "nothing like this"), -1, "nlFocusIndex: no match → -1");

// ---- Author line when the page has no author <meta> (FT-style) --------------------------
const LD = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"NewsArticle","author":[{"@type":"Person","name":"Leo Lewis"},{"@type":"Person","name":"Song Jung-a"},{"@type":"Person","name":"Ian Smith"}],"publisher":{"@type":"Organization","name":"Financial Times"},"datePublished":"2026-10-23T03:41:23.368Z"}</script>`;
checkEq(readAuthors(LD), "Leo Lewis, Song Jung-a and Ian Smith", "readAuthors: JSON-LD authors, organisations ignored");
checkEq(readAuthors(`<script type="application/ld+json">{"@graph":[{"@type":"Article","author":{"@type":"Person","name":"Matt Levine"}}]}</script>`), "Matt Levine", "readAuthors: an author inside @graph");
checkEq(readAuthors(`<p>By <a href="/stream/x" class="n-content-tag--author">Leo Lewis</a> and <a href="/y" data-trackable="author">Ian Smith</a></p>`), "Leo Lewis and Ian Smith", "readAuthors: byline links when there is no JSON-LD");
checkEq(readAuthors(`<a class="author" href="https://x.com/p">https://www.ft.com/leo-lewis</a>`), "", "readAuthors: a URL is never an author");
const ftPage = `<html><head><meta property="og:title" content="Oil hits $114"><meta property="article:author" content="https://www.ft.com/leo-lewis">${LD}</head><body><article>${"<p>Oil surged past $114 a barrel for the first time since May on Friday, weighing on markets.</p>".repeat(3)}</article></body></html>`;
const ftx = extractReadable(ftPage, new URL("https://www.ft.com/content/x"), { subscriber: true });
check(ftx.byline === "Leo Lewis, Song Jung-a and Ian Smith" && /^2026-10-23/.test(ftx.date), `extractReadable: FT-style page gets its byline + date (${ftx.byline} · ${ftx.date})`);

// ---- Worker paths (in-memory KV, stubbed fetch) -----------------------------------------
const kv = new Map();
const env = { RESEARCH_KEY: "k3y", WATCHLIST: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); } } };
const jwt = "h." + Buffer.from(JSON.stringify({ email: "owner@wire" })).toString("base64url") + ".s";
const call = (path, init, e = env) => worker.fetch(new Request("https://wire.test" + path, init), e, { waitUntil() {} });
const read = (url, opts = {}) => call("/api/read?url=" + encodeURIComponent(url) + (opts.warm ? "&warm=1" : ""), { headers: opts.anon ? {} : { "Cf-Access-Jwt-Assertion": jwt } }, opts.env || env);

const realFetch = globalThis.fetch;
const calls = [];
const BARC = "https://www.bloomberg.com/news/articles/2026-10-22/barclays-to-cut-5-000-jobs";
const FTART = "https://www.ft.com/content/aaaabbbb-cccc-dddd-eeee-ffff00001111";
const paras = Array.from({ length: 6 }, (_, i) => `<p>Gilts rallied for a ${i}th session as traders priced in faster rate cuts after the inflation print surprised.</p>`).join("");
const FT_HTML = `<html><head><meta property="og:title" content="Gilts rally as inflation cools"><script type="application/ld+json">{"isAccessibleForFree":false}</script></head><body><article>${paras}</article></body></html>`;
let ftMode = "ok";
globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === "string" ? input : input.url;
  const headers = new Headers(init.headers || {});
  calls.push({ url, method: init.method || "GET", cookie: headers.get("cookie") || "" });
  if (url === "https://bloom.bg/barc1") return new Response(null, { status: 301, headers: { location: BARC + "?srnd=newsletter" } });
  if (url.startsWith("https://bloom.bg/")) return new Response(null, { status: 404 });
  if (url.startsWith("https://www.ft.com/content/") || url.startsWith("https://ft.com/content/")) {
    if (!headers.get("cookie")) return new Response(`<html><head><meta property="og:description" content="UK borrowing costs fell as inflation cooled."></head><body><p>Subscribe to read.</p></body></html>`, { status: 200, headers: { "content-type": "text/html" } });
    if (ftMode === "expired") return new Response(null, { status: 302, headers: { location: "https://accounts.ft.com/login?location=x" } });
    return new Response(FT_HTML, { status: 200, headers: { "content-type": "text/html" } });
  }
  return new Response("", { status: 404 });
};

try {
  // (1) anonymous: the old paywall answer, nothing fetched.
  const anon = await (await read(FTART, { anon: true })).json();
  check(anon.accessible === false && anon.reason === "paywall" && calls.length === 0, "anonymous read of a subscribed site: paywall, no fetch");

  // (2) a newsletter issue that links the story → indexed at ingest, opened at that part.
  const ing = await call("/api/nl-ingest", { method: "POST", headers: { "content-type": "application/json", "x-research-key": "k3y" },
    body: JSON.stringify({ id: "nl-bloomberg-moneystuff-test-20261022", title: "Money Stuff: Test", publication: "Bloomberg", author: "Matt Levine", date: "2026-10-22", url: "https://bloom.bg/view", text: EMAIL }) });
  const ij = await ing.json();
  check(ing.status === 200 && ij.indexed >= 2, `nl-ingest indexes the issue's article links (${ij.indexed})`);
  check(kv.has("nlu:" + subCanon(BARC)), "nl-ingest: a bloom.bg short link is resolved to its Bloomberg article");
  check(calls.filter((c) => c.method !== "HEAD").length === 0, "nl-ingest: links are resolved with HEAD only (never a GET)");
  const nlr = await read(BARC);
  const nj = await nlr.json();
  check(nj.accessible && nj.via === "newsletter" && nj.nl && nj.nl.title === "Money Stuff: Test", "a Bloomberg story linked by a stored issue reads from that issue");
  check(nj.focus >= 0 && /Barclays to cut 5,000 jobs/.test((nj.blocks[nj.focus] || {}).t || ""), "…opened at the part about the story");
  check(/private/.test(nlr.headers.get("cache-control") || "") && /no-store/.test(nlr.headers.get("cache-control") || ""), "subscriber reads are private, no-store");

  // (3) no session configured → standfirst + subscriber flag.
  calls.length = 0;
  const fb = await (await read("https://www.ft.com/content/55556666-7777-8888-9999-000011112222")).json();
  check(fb.accessible === false && fb.subscriber === true && /inflation cooled/.test(fb.summary || ""), "no stored text and no session: the public standfirst");
  check(!calls.some((c) => c.cookie), "…and no cookie is ever sent without a session secret");

  // (4) the owner's session → full article, cookie sent to the FT only, cached in KV.
  // (A link the issue already covers reads from the issue first, so clear that index entry.)
  kv.delete("nlu:" + subCanon(FTART));
  const senv = { ...env, SUB_COOKIE_FT: "FTSession_s=abc; FTConsent=x" };
  calls.length = 0;
  const warm = await (await read(FTART, { warm: true, env: senv })).json();
  check(warm.accessible === false && !calls.length, "a background prefetch never uses the session");
  const sr = await (await read(FTART, { env: senv })).json();
  check(sr.accessible && sr.via === "subscription" && sr.paragraphs.length >= 4, "with the owner's FT session the full article reads in-pane (despite isAccessibleForFree:false)");
  check(calls.every((c) => !c.cookie || /^https:\/\/(www\.)?ft\.com\//.test(c.url)), "the session cookie only ever goes to ft.com");
  calls.length = 0;
  const again = await (await read(FTART, { env: senv })).json();
  check(again.accessible && calls.length === 0, "a re-open is served from the private KV copy (no second fetch)");

  // (5) a lapsed session is reported, not looped; the daily cap stops fetching.
  ftMode = "expired";
  const FT2 = "https://www.ft.com/content/99998888-7777-6666-5555-444433332222";
  const ex = await (await read(FT2, { env: senv })).json();
  check(ex.accessible === false && ex.reason === "session-expired" && ex.subscriber, "a logged-out session reads as session-expired (standfirst fallback)");
  calls.length = 0;
  const capEnv = { ...senv, SUB_DAILY_MAX: "0" };
  const cap = await (await read("https://www.ft.com/content/12341234-1234-1234-1234-123412341234", { env: capEnv })).json();
  check(cap.reason === "session-daily-cap" && !calls.some((c) => c.cookie), "the per-day cap stops session fetches");
} finally {
  globalThis.fetch = realFetch;
}

// ---- Browser: a subscribed FT row reads from its newsletter issue, marked -----------------
const today = new Date().toISOString().slice(0, 10);
const FEED = { items: [
  { title: "Gilts rally as inflation cools", url: FTART, source: "Financial Times", date: today, time: "09:30", desk: "m" },
  { title: "Bloomberg story with no stored text", url: "https://www.bloomberg.com/news/articles/2026-10-22/no-text", source: "Bloomberg", date: today, time: "09:20", desk: "m" },
], updated: new Date().toISOString() };
const NLREAD = { accessible: true, via: "newsletter", title: "", nl: { id: "x", title: "FirstFT: Gilts", source: "Financial Times", date: today }, focus: 1,
  blocks: [{ h: true, t: "Markets" }, { t: "Gilts rallied after UK inflation cooled to 2.1%, the lowest reading since 2021." }, { t: "Elsewhere, oil slipped." }],
  paragraphs: ["Gilts rallied after UK inflation cooled to 2.1%, the lowest reading since 2021.", "Elsewhere, oil slipped."] };
const srv = await serve({
  "/api/feed": () => [200, JSON.stringify(FEED)],
  "/api/read": (q) => {
    const u = decodeURIComponent((q.url.split("url=")[1] || "").split("&")[0]);
    if (u === FTART) return [200, JSON.stringify(NLREAD)];
    return [200, JSON.stringify({ accessible: false, paragraphs: [], subscriber: true, reason: "subscriber", summary: "The standfirst everyone can see." })];
  },
});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
const ftRow = pg.locator(`#g-feed .g-feed-row[href="${FTART}"]`).first();
check(await ftRow.count() === 1, "an FT story is back on the Home wire");
check(!(await ftRow.evaluate((r) => r.classList.contains("is-locked") || !!r.querySelector(".g-feed-lock"))), "a subscribed row carries no padlock");
await ftRow.click();
await pg.waitForFunction(() => /lowest reading since 2021/.test((document.getElementById("g-readpane") || {}).textContent || ""), null, { timeout: 8000 }).catch(() => {});
const pane = await pg.evaluate(() => {
  const p = document.getElementById("g-readpane");
  return { text: (p || {}).textContent || "", focus: ((p && p.querySelector(".g-read-focus")) || {}).textContent || "", open: ((p && p.querySelector(".g-read-open")) || {}).textContent || "" };
});
check(/From your Financial Times newsletter · FirstFT: Gilts/.test(pane.text), "the pane says which newsletter issue the story is read from");
check(/lowest reading since 2021/.test(pane.focus), "the part about the story is marked");
check(/Open at FT/.test(pane.open), `the link out names the publisher (${pane.open})`);
const bbRow = pg.locator('#g-feed .g-feed-row[href*="no-text"]').first();
await bbRow.click();
await pg.waitForFunction(() => /standfirst everyone can see/.test((document.getElementById("g-readpane") || {}).textContent || ""), null, { timeout: 8000 }).catch(() => {});
const fbPane = await pg.evaluate(() => (document.getElementById("g-readpane") || {}).textContent || "");
check(/The standfirst everyone can see/.test(fbPane) && /doesn't have the text of this Bloomberg story yet/.test(fbPane), "no stored text: the standfirst + an honest note + the link");
checkErrs(errs, "subscriber reader");
await ctx.close(); await b.close(); srv.close();
finish();
