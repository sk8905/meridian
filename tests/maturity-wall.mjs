// Credit dashboard "Maturity wall" (.dsh-mw-tbl) — the per-year ladder must FIT the
// phone. On desktop it's a wide 4-column table (Year · bar+$ · Composition ·
// Cumulative); at ~390px that clipped the single-word "Cumulative" head and squeezed
// the composition into a cramped stack. On phones it now RESTACKS into a two-line
// block per year (Year · bar+$ · cumulative %, then the region composition inline) —
// every figure preserved, nothing clipped, nothing scrolling. Desktop stays the table.
import { MATWALL } from "../macro/js/content.js";
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- Phone: reflowed, self-contained, nothing clipped ----
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/dashboard/credit/");
  await pg.waitForSelector(".dsh-mw-tbl", { timeout: 8000 });
  await pg.waitForTimeout(400);
  const r = await pg.evaluate(() => {
    const tbl = document.querySelector(".dsh-mw-tbl");
    const rows = [...tbl.querySelectorAll("tbody tr")];
    const clientW = document.documentElement.clientWidth;
    // Nothing in the table may cross the screen edge (the old "Cumulati" clip).
    let maxRight = 0;
    tbl.querySelectorAll("*").forEach((el) => { const rr = el.getBoundingClientRect().right; if (rr > maxRight) maxRight = rr; });
    const cums = rows.map((tr) => (tr.querySelector(".dsh-r") || {}).textContent?.trim());
    const compItem = tbl.querySelector(".dsh-mw-comp-i");
    return {
      clientW, docScroll: document.documentElement.scrollWidth,
      rowCount: rows.length,
      maxRight: Math.round(maxRight),
      theadDisplay: getComputedStyle(tbl.querySelector("thead")).display,
      compDisplay: compItem ? getComputedStyle(compItem).display : null,
      trackW: Math.round((tbl.querySelector(".dsh-mw-track") || { getBoundingClientRect: () => ({ width: 0 }) }).getBoundingClientRect().width),
      cums,
    };
  });
  checkEq(r.rowCount, 5, "phone: five maturity years render (2025–2029)");
  checkEq(r.docScroll, r.clientW, "phone: the page never scrolls horizontally");
  check(r.maxRight <= r.clientW + 1, `phone: nothing in the ladder crosses the screen edge — no clip (maxRight ${r.maxRight} ≤ ${r.clientW})`);
  checkEq(r.theadDisplay, "none", "phone: the column heads drop out (ladder is restacked into per-year blocks)");
  checkEq(r.compDisplay, "inline", "phone: region composition items sit inline on their own line (not a cramped stacked column)");
  check(r.trackW >= 60, `phone: the maturity bar is legible again, not a 30px sliver (track ${r.trackW}px)`);
  check(r.cums.length === 5 && r.cums.every(Boolean) && r.cums[4] === "100%", `phone: every cumulative % is preserved and reaches 100% (${r.cums.join(" ")})`);
  // Europe first: LCD's European leveraged-loan wall leads the card, every row shown,
  // dated, with a source link — ahead of the global S&P ladder.
  const eu = await pg.evaluate(() => {
    const e = document.querySelector('[data-mw="europe"]'), t = document.querySelector(".dsh-mw-tbl");
    if (!e) return null;
    return { rows: e.querySelectorAll(".dsh-kv").length, first: !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING),
      links: [...e.querySelectorAll("a[href]")].map((a) => a.href), text: e.textContent, head: (e.closest("section").querySelector(".dsh-h") || {}).textContent || "", right: Math.round(e.getBoundingClientRect().right) };
  });
  check(eu, "phone: the Europe maturity block renders");
  if (eu) {
    checkEq(eu.rows, MATWALL.europe.rows.length, "phone: every European maturity row renders");
    check(eu.first, "phone: Europe leads the maturity card, ahead of the global S&P ladder");
    check(eu.links.some((h) => /pitchbook\.com|yahoo\.com/.test(h)), "phone: the European figures link their LCD source");
    check(eu.head.includes(MATWALL.europe.asOf) && eu.text.includes("€38.4bn"), "phone: the card head carries the European data date; the block shows the verbatim 2028 figure");
    check(eu.right <= r.clientW + 1, "phone: the European block fits the screen");
  }
  check(/^\d{4}-\d{2}-\d{2}$/.test(MATWALL.europe.asOfIso || ""), "data: MATWALL.europe carries an ISO as-of for the freshness audit");
  check(MATWALL.europe.rows.every((x) => x.k && x.v), "data: every European row has a label and a value");
  checkErrs(errs, "phone maturity wall");
  await ctx.close();
}

// ---- Desktop: unchanged wide table, heads intact ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/credit/");
  await pg.waitForSelector(".dsh-mw-tbl", { timeout: 8000 });
  await pg.waitForTimeout(400);
  const d = await pg.evaluate(() => {
    const tbl = document.querySelector(".dsh-mw-tbl");
    const ths = [...tbl.querySelectorAll("thead th")].map((th) => th.textContent.trim());
    return { theadDisplay: getComputedStyle(tbl.querySelector("thead")).display, ths };
  });
  check(d.theadDisplay !== "none", "desktop: the column heads stay visible (wide table unchanged)");
  check(d.ths.some((t) => /Cumulative/.test(t)), `desktop: the "Cumulative" head is intact (${d.ths.join(" · ")})`);
  checkErrs(errs, "desktop maturity wall");
  await ctx.close();
}

await b.close(); srv.close();
finish();
