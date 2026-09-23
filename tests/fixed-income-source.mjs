// A fixed-income-flagged source (M&G Bond Vigilantes, fi:true from the Worker)
// surfaces in the Home wire under the Fixed Income filter AND carries its own
// "FI" desk label — not the macro MAC badge. Mirrors how hdg:true sources badge
// HDG. The Worker sets the flag; here we stub /api/feed to carry one fi item.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const BV = { title: "High yield spreads and the rates path into year-end", url: "https://bondvigilantes.com/blog/2026/07/hy-spreads/", source: "Bond Vigilantes", region: "GEN", date: "2026-07-29", time: "10:30", fi: true };
const feed = { items: [BV,
  { title: "US GDP revised higher as consumer holds up", url: "https://www.reuters.com/x1", source: "Reuters", region: "GEN", date: "2026-07-29", time: "09:00" },
  { title: "Nasdaq climbs on megacap earnings", url: "https://www.reuters.com/x2", source: "Reuters", region: "GEN", date: "2026-07-29", time: "08:30" },
] };

const srv = await serve({ "/api/feed": () => [200, JSON.stringify(feed)] });
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(2500);

// The News wire surfaces the fi:true Bond Vigilantes item, badged FI (not MAC), with
// its source — no desk filter needed (the sub-filters were removed; the News lane
// shows all news and each row keeps its own label).
const fi = await pg.evaluate((title) => {
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const row = rows.find((r) => (r.querySelector(".g-feed-title") || {}).textContent === title);
  return {
    present: !!row,
    code: row ? (row.querySelector(".g-feed-code") || {}).textContent : null,
    src: row ? (row.querySelector(".g-feed-src") || {}).textContent : null,
  };
}, BV.title);
check(fi.present, "the News wire surfaces the Bond Vigilantes item");
checkEq(fi.code, "FI", "Bond Vigilantes item carries the FI desk label (not MAC)");
check(/Bond Vigilantes/.test(fi.src || ""), "Bond Vigilantes item shows its source name");

// It also appears on the All lane (news + managers interleaved).
const inAll = await pg.evaluate((title) => {
  const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "All");
  if (b) b.click();
  return [...document.querySelectorAll("#g-feed .g-feed-title")].some((t) => t.textContent === title);
}, BV.title);
check(inAll, "Bond Vigilantes item is folded into the All lane");

checkErrs(errs, "fixed-income source");
await ctx.close();
await b.close(); srv.close();
finish();
