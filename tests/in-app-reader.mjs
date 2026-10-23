// Everything opens inside Wire (owner request 2026-10-15): an external link anywhere —
// a Dashboard SRC chip, a deal source in the Transactions drawer, a borrower-page record,
// a search result — opens the app-wide reader (v2/js/reader-overlay.js), which prints
// the text from /api/read. A source that can't be read in the app (paywall, PDF, empty
// extraction) says why and offers the ONE external link. Back closes the reader.
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkErrs, finish } from "./lib.mjs";

const READ = { accessible: true, title: "Fitch: European defaults rise", byline: "Fitch Ratings", date: "2026-09-18", paragraphs: ["European leveraged loan defaults rose to 2.7% in August.", "High-yield defaults were unchanged."] };
const srv = await serve({ "/api/read": (q) => (/bebankers|afme|cvc\.com|blackstone|caselaw/.test(decodeURIComponent(q.url)) ? [200, JSON.stringify(READ)] : [200, JSON.stringify({ accessible: false, paragraphs: [], reason: "no-body" })]) });
const b = await launchChromium();
const { pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/credit`);
await pg.waitForSelector("#dsh-eu-distress .dsh-src", { timeout: 10000 });
const pages0 = b.contexts()[0] ? b.contexts()[0].pages().length : 0;

// 1) An SRC chip opens the in-app reader with the extracted text — no new tab.
const h0 = await pg.evaluate(() => history.length);
await pg.click("#dsh-eu-distress .dsh-src");
await pg.waitForSelector("#wire-reader:not([hidden]) .wr-p", { timeout: 8000 });
const r1 = await pg.evaluate(() => ({ t: document.querySelector("#wire-reader .wr-title").textContent, p: document.querySelectorAll("#wire-reader .wr-p").length, out: (document.querySelector("#wire-reader .wr-open") || {}).href || "", h: history.length }));
check(r1.p === 2 && /European defaults/.test(r1.t), `SRC chip → the source reads inside Wire (${r1.t}, ${r1.p} paragraphs)`);
check(/^https?:/.test(r1.out), "the reader still offers the external link");
check(r1.h === h0 + 1, "opening the reader is one history entry");
check((b.contexts()[0] ? b.contexts()[0].pages().length : 0) === pages0, "no new browser tab was opened");
await pg.goBack(); await pg.waitForTimeout(200);
check(await pg.evaluate(() => document.querySelector("#wire-reader").hidden && /dashboard\/credit/.test(location.pathname)), "Back closes the reader and stays on the Dashboard");

// 2) A paywalled source the owner doesn't subscribe to never fetches — reason + external link.
await pg.evaluate(() => window.__wireRead("https://www.nytimes.com/2026/10/22/business/x.html", { title: "A NYT story" }));
const r2 = await pg.evaluate(() => ({ note: document.querySelector("#wire-reader .wr-note").textContent, out: document.querySelector("#wire-reader .wr-open").href }));
check(/subscriber login/.test(r2.note) && /nytimes\.com/.test(r2.out), `paywalled → reason + external link (${r2.note})`);
await pg.keyboard.press("Escape"); await pg.waitForTimeout(150);
// 2b) One of the owner's subscriptions (FT) is NOT refused: it goes to the subscriber reader.
await pg.evaluate(() => window.__wireRead("https://www.ft.com/content/abc", { title: "An FT story" }));
await pg.waitForFunction(() => !/Loading the text/.test((document.querySelector("#wire-reader .wr-note") || {}).textContent || ""), null, { timeout: 8000 }).catch(() => {});
const r2b = await pg.evaluate(() => (document.querySelector("#wire-reader .wr-note") || {}).textContent || "");
check(!/subscriber login/.test(r2b), `a subscribed FT story is not refused as a paywall (${r2b})`);
await pg.keyboard.press("Escape"); await pg.waitForFunction(() => document.querySelector("#wire-reader").hidden, null, { timeout: 3000 }).catch(() => {});

// 3) A PDF says it is a document file.
await pg.evaluate(() => window.__wireRead("https://www.afme.eu/media/x/report.pdf", { title: "AFME report" }));
check(/document file/.test(await pg.evaluate(() => document.querySelector("#wire-reader .wr-note").textContent)), "a PDF → document-file note + link");
await pg.keyboard.press("Escape"); await pg.waitForTimeout(150);

// 4) Transactions drawer: the deal Source link reads in-app.
await pg.goto(`http://localhost:${srv.port}/v2/transactions/#/deal/d921`);
await pg.waitForSelector("#tx-drawer:not([hidden])", { timeout: 10000 });
await pg.evaluate(() => { const li = [...document.querySelectorAll("#tx-drawer .tbiz li")].find((l) => /^Source/i.test(l.querySelector(".tbiz-k").textContent)); li.querySelector("a").click(); });
await pg.waitForSelector("#wire-reader:not([hidden]) .wr-p", { timeout: 8000 });
check(true, "a deal's source opens in the in-app reader");

checkErrs(errs, "in-app reader");
// 5) Phone: full-screen sheet, tab bar hidden while reading.
{
  const p = await open(b, PHONE, `http://localhost:${srv.port}/v2/dashboard/credit`);
  await p.pg.waitForTimeout(1200);
  await p.pg.evaluate(() => window.__wireRead("https://www.cvc.com/media/news/2026/x", { title: "CVC" }));
  await p.pg.waitForSelector("#wire-reader:not([hidden]) .wr-p", { timeout: 8000 });
  const ph = await p.pg.evaluate(() => ({ w: Math.round(document.querySelector("#wire-reader .wr-panel").getBoundingClientRect().width), tab: getComputedStyle(document.querySelector(".mobile-tabbar")).display }));
  check(ph.w === 390 && ph.tab === "none", `phone: full-screen reader, tab bar hidden (${ph.w}px, ${ph.tab})`);
  checkErrs(p.errs, "in-app reader (phone)");
  await p.ctx.close();
}
await b.close(); srv.close();
finish();
