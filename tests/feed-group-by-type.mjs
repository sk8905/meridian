// Home newsfeed: the "Group by type" toggle (which replaced the Newsletters
// button). When on, the wire is grouped by each row's label (ALERT, MAC, BBG,
// myFT, …) over a rolling 3-day window instead of the day-by-day stream.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(400);

// The button replaced "Newsletters".
const head = await pg.evaluate(() => {
  const grp = document.querySelector(".g-feed-grpbtn");
  return { hasGroupBtn: !!grp, label: grp ? grp.textContent.trim() : "", hasNewsletters: /Newsletters/.test(document.getElementById("g-feed-head").textContent) };
});
check(head.hasGroupBtn, "newsfeed: a 'Group by type' button is present");
check(/Group by type/i.test(head.label), `newsfeed: the button reads 'Group by type' (${head.label})`);
check(!head.hasNewsletters, "newsfeed: the old 'Newsletters' button is gone");

// Toggle it on → the feed groups by label with counts, 3-day rolling window.
await pg.evaluate(() => document.querySelector(".g-feed-grpbtn").click());
await pg.waitForTimeout(400);
const g = await pg.evaluate(() => {
  const headers = [...document.querySelectorAll("#g-feed .g-feed-dayhdr")].map((h) => h.textContent.trim());
  const dates = [...document.querySelectorAll("#g-feed .g-feed-row")].map((r) => r.getAttribute("data-date")).filter(Boolean).sort();
  const span = dates.length ? (Date.parse(dates[dates.length - 1]) - Date.parse(dates[0])) / 864e5 : 0;
  return {
    on: document.querySelector(".g-feed-grpbtn").classList.contains("is-on"),
    headers,
    labelled: headers.length > 0 && headers.every((h) => /·\s*\d+$/.test(h)),   // "LABEL · N"
    groups: headers.length,
    span,
    rows: dates.length,
  };
});
check(g.on, "newsfeed: the button shows an active state when grouping");
check(g.groups >= 3, `newsfeed: the wire splits into label groups (${g.groups}: ${g.headers.slice(0, 6).join(", ")})`);
check(g.labelled, "newsfeed: each group header is 'LABEL · count'");
check(g.rows > 0 && g.span <= 2.01, `newsfeed: grouped content is limited to a rolling 3-day window (span ${g.span.toFixed(1)}d)`);

// Within each type group the rows still run newest → oldest (day then publish
// time), exactly as the ungrouped wire does — grouping must not scramble order.
const ord = await pg.evaluate(() => {
  const feed = document.getElementById("g-feed");
  const groups = []; let cur = null;
  [...feed.children].forEach((el) => {
    if (el.classList.contains("g-feed-dayhdr")) { cur = []; groups.push(cur); }
    else if (el.classList.contains("g-feed-row") && cur) {
      cur.push((el.getAttribute("data-date") || "") + " " + (el.getAttribute("data-time") || ""));
    }
  });
  const desc = (a) => a.every((v, i) => i === 0 || a[i - 1] >= v);
  const bad = groups.map((g, i) => ({ i, g })).filter((x) => !desc(x.g));
  return { n: groups.length, allDesc: groups.length > 0 && bad.length === 0, sample: bad[0] ? bad[0].g.slice(0, 4) : [] };
});
check(ord.allDesc, `newsfeed: within each type group, items run newest→oldest (${ord.n} groups${ord.sample.length ? "; out of order: " + ord.sample.join(" / ") : ""})`);

// Toggle off → back to the day-by-day stream (date headers, not label groups).
await pg.evaluate(() => document.querySelector(".g-feed-grpbtn").click());
await pg.waitForTimeout(300);
const off = await pg.evaluate(() => ({
  on: document.querySelector(".g-feed-grpbtn").classList.contains("is-on"),
  firstHeader: (document.querySelector("#g-feed .g-feed-dayhdr") || {}).textContent || "",
}));
check(!off.on, "newsfeed: toggling again returns to the normal stream");

checkErrs(errs, "feed group-by-type");
await ctx.close();
await b.close(); srv.close();
finish();
