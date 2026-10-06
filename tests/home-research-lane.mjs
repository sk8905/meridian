// Home wire — the Research lane. The lane row is All · Research · Managers · Watchlist
// · Newsletters (News retired, Research in its place). Research = the MANUAL Gmail-swept
// notes (research.js) + the AUTO house-research shops tagged `research:true` on the live
// feed (Apollo Academy / Oaktree / AQR, piped via gnews in the Worker). Research items
// carry the teal "RSCH" desk code, bypass the readable-only cull, and fold into All.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

// A feed with two research-tagged items (house research) among ordinary news.
const FEED = { items: [
  { title: "The Daily Spark: tariffs and the term premium", url: "https://www.apolloacademy.com/daily-spark-1", source: "Apollo Academy", date: "2026-10-06", time: "08:30", research: true },
  { title: "Howard Marks memo: the folly of certainty", url: "https://www.oaktreecapital.com/insights/memo-1", source: "Oaktree", date: "2026-10-05", time: "12:00", research: true },
  ...Array.from({ length: 30 }, (_, i) => ({ title: `Markets story ${i} on rates and credit`, url: `https://www.reuters.com/x${i}`, source: "Reuters", date: "2026-10-06", time: `0${9 - (i % 9)}:00`, desk: "m" })),
] };

const srv = await serve({ "/api/feed": () => [200, JSON.stringify(FEED)] });
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-wire-lanes .g-wire-lane", { timeout: 8000 });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(400);

// The lane row carries Research in place of News.
const lanes = await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].map((b) => b.textContent.trim()));
checkEq(lanes.join(" · "), "All · Research · Managers · Watchlist · Newsletters", "lane row: Research sits where News was");

// Research items fold into the All lane (the default) — tagged RSCH, not culled.
const inAll = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const rsch = rows.filter((r) => /RSCH/.test((r.querySelector(".g-feed-code") || {}).textContent || ""));
  return { count: rsch.length, titles: rsch.map((r) => (r.querySelector(".g-feed-title") || {}).textContent || "") };
});
check(inAll.count >= 1, `All lane: research items fold in with the RSCH code (${inAll.count})`);

// Switch to the Research lane → only the research items, each with the teal RSCH pill.
await pg.evaluate(() => { const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "Research"); if (b) b.click(); });
await pg.waitForTimeout(400);
const rsch = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const codes = rows.map((r) => (r.querySelector(".g-feed-code") || {}).textContent || "");
  const srcs = [...new Set(rows.map((r) => ((r.querySelector(".g-feed-src") || {}).textContent || "").trim()))].filter(Boolean);
  const pill = rows[0] && rows[0].querySelector(".g-feed-code");
  return { rows: rows.length, allRsch: rows.length > 0 && codes.every((c) => /RSCH/.test(c)), srcs, pillClass: pill ? pill.className : "" };
});
check(rsch.rows >= 2, `Research lane: shows the research notes (${rsch.rows} rows from ${rsch.srcs.join(", ")})`);
check(rsch.allRsch, "Research lane: every row carries the RSCH desk code");
check(/\brsch\b/.test(rsch.pillClass), `Research lane: the RSCH pill uses the research (teal) colour class (${rsch.pillClass})`);

checkErrs(errs, "home research lane");
await ctx.close();

// ---- Empty state: with no research yet (the Gmail sweep hasn't run), the Research lane
// prompts the reader to subscribe + forward, rather than a bare "no items" line. This is
// the lane's primary state until the email sweep populates research.js.
{
  const srv2 = await serve({ "/api/feed": () => [200, JSON.stringify({ items: [
    ...Array.from({ length: 12 }, (_, i) => ({ title: `Markets story ${i}`, url: `https://www.reuters.com/e${i}`, source: "Reuters", date: "2026-10-06", time: "09:00", desk: "m" })),
  ] })] });
  const { ctx: c2, pg: p2, errs: e2 } = await open(b, DESKTOP, `http://localhost:${srv2.port}/v2/`);
  await p2.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
  await p2.reload({ waitUntil: "load" });
  await p2.waitForSelector("#g-wire-lanes .g-wire-lane", { timeout: 8000 });
  await p2.evaluate(() => { const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "Research"); if (b) b.click(); });
  await p2.waitForTimeout(400);
  const emptyTxt = await p2.evaluate(() => (document.querySelector("#g-feed") || {}).textContent || "");
  check(/subscribed house-research emails/i.test(emptyTxt) && /forward them to the mailbox|forward/i.test(emptyTxt),
    `Research lane: an empty lane prompts the reader to subscribe + forward (${emptyTxt.trim().slice(0, 60)}…)`);
  checkErrs(e2, "home research empty state");
  await c2.close();
  srv2.close();
}

await b.close();
srv.close();
finish();
