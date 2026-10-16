// News ▸ Profiles (owner 2026-10-16: "should cover all, not just managers"): the lane
// carries the activity of EVERY profiled entity — managers, hedge funds, law firms and
// investors — in its recency window (current + previous month), newest first. Checked
// against the committed home-data.js, never a fixture.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import * as HD from "../home-data.js";

const srv = await serve();
const b = await launchChromium();
const nd = new Date(), winStart = Date.UTC(nd.getUTCFullYear(), nd.getUTCMonth() - 1, 1);
const inWin = (d) => (Date.parse(String(d || "").slice(0, 10)) || 0) >= winStart;
const expectHF = (HD.HEDGE_INTEL || []).some((h) => inWin(h.date));
const expectFirm = (HD.items || []).some((i) => i.firm && inWin(i.date));
const lpNames = (HD.lps || []).map((l) => l.name).filter((n) => n && n.length >= 6);
const expectLP = [...(HD.deals || []), ...(HD.intel || [])].some((x) => inWin(x.date) && lpNames.some((n) => (x.headline || "").includes(n)));

for (const [name, dev, sel] of [["iPhone", PHONE, "#g-wire-lanechips"], ["desktop", DESKTOP, "#g-wire-lanes"]]) {
  const { ctx, pg, errs } = await open(b, dev, `http://localhost:${srv.port}/v2/news/`);
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 15000 });
  await pg.evaluate((s) => [...document.querySelectorAll(`${s} .g-wire-lane`)].find((e) => e.textContent.trim() === "Profiles").click(), sel);
  await pg.waitForFunction(() => document.querySelector("#g-feed .g-mw-flat .g-feed-row"), null, { timeout: 15000 });
  const r = await pg.evaluate(({ lpNames }) => {
    const rows = [...document.querySelectorAll("#g-feed .g-mw-flat .g-feed-row")].map((a) => ({ t: a.querySelector(".g-feed-title").textContent.replace(/^★\s*/, ""), href: a.getAttribute("href") || "" }));
    return { n: rows.length, titles: rows.map((x) => x.t), lp: rows.some((x) => lpNames.some((n) => x.t.includes(n))), months: [...document.querySelectorAll("#g-feed .g-mw-month")].map((m) => m.textContent.trim()) };
  }, { lpNames });
  const hfT = new Set((HD.HEDGE_INTEL || []).map((h) => h.headline)), firmT = new Set((HD.items || []).filter((i) => i.firm).map((i) => i.title));
  const mgrIds = new Set((HD.managers || []).map((m) => m.id));
  check(r.n > 0, `${name}: the Profiles lane lists profile activity (${r.n} rows)`);
  if (expectHF) check(r.titles.some((t) => hfT.has(t)), `${name}: Profiles includes hedge-fund activity`);
  if (expectFirm) check(r.titles.some((t) => firmT.has(t)), `${name}: Profiles includes law-firm activity`);
  check(r.titles.some((t) => !hfT.has(t) && !firmT.has(t)), `${name}: Profiles includes manager activity`);
  if (expectLP) check(r.lp, `${name}: Profiles includes investor activity (a deal / intel headline naming a tracked investor)`);
  check(r.months.length >= 1 && r.months.length <= 2, `${name}: one recency window — current and previous month (${r.months.join(", ")})`);
  checkErrs(errs, `profiles lane (${name})`);
  await ctx.close();
}
await b.close(); srv.close();
finish();
