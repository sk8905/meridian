// Credit dashboard ▸ Private credit card: Fitch's Private Credit Default Rate +
// market-context metrics, each a sourced value. Guards that the card renders and
// every metric links a real source (never fabricated).
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/credit/`);
await pg.waitForTimeout(1500);

const pc = await pg.evaluate(() => {
  // The Private credit DETAIL card (with the sourced metric grid) — identified by
  // its panel header, so the terminal's top pulse-strip card (whose pills also say
  // "Private credit default rate") isn't matched instead.
  const card = [...document.querySelectorAll('.v2-view[data-view="dashboard"] .dsh-card')].find((c) => { const h = c.querySelector(".dsh-h"); return h && /^\s*US private credit/i.test(h.textContent); });
  if (!card) return null;
  const rows = [...card.querySelectorAll(".dsh-kv")];
  return {
    rows: rows.length,
    sourced: rows.length > 0 && rows.every((r) => r.querySelector('.dsh-src[href^="http"]')),
    pcdr: /6\.0%/.test(card.textContent) && /Private Credit Default Rate/i.test(card.textContent),
    // Cleaned up: no explainer paragraph, no descriptor sub-label, and each row's
    // source is JUST the SRC link — no context note (.dsh-band) before it.
    headline: !!card.querySelector(".dsh-fl-note"),
    descriptor: !!card.querySelector(".dsh-h .dsh-n"),
    notes: card.querySelectorAll(".dsh-kv .dsh-band").length,
    // Tracked industry research (KBRA MM Compendium + AIMA/ACC) — a linked list.
    reports: [...card.querySelectorAll(".dsh-pc-report")].length,
    reportsSourced: [...card.querySelectorAll(".dsh-pc-report")].every((a) => /^https?:\/\//.test(a.getAttribute("href") || "")),
    hasKbra: /KBRA/i.test(card.textContent) && /Middle Market Compendium/i.test(card.textContent),
    hasAima: /AIMA/i.test(card.textContent),
    // Prior-12-months comparison — at least one metric shows a year-ago "vs X" value
    // that links its own source.
    yoy: [...card.querySelectorAll(".dsh-pc-grid .dsh-kv-yoy")].length,
    yoySourced: [...card.querySelectorAll(".dsh-pc-grid .dsh-kv-yoy")].every((a) => /^https?:\/\//.test(a.getAttribute("href") || "")),
  };
});
check(!!pc, "Credit: Private credit card renders");
check(pc && pc.rows >= 4, `Credit: private-credit metrics render (${pc && pc.rows})`);
check(pc && pc.sourced, "Credit: every private-credit metric links its source");
check(pc && pc.pcdr, "Credit: shows the Fitch Private Credit Default Rate (6.0%)");
check(pc && !pc.headline, "Credit: the explainer paragraph is removed");
check(pc && !pc.descriptor, "Credit: the 'Fitch PCDR & market pulse' descriptor is removed");
check(pc && pc.notes === 0, `Credit: each source is just the SRC label, no context note (${pc && pc.notes} notes)`);
check(pc && pc.reports >= 2 && pc.reportsSourced, `Credit: tracked private-credit research renders + links out (${pc && pc.reports})`);
check(pc && pc.hasKbra && pc.hasAima, "Credit: incorporates the KBRA MM Compendium and AIMA/ACC research");
check(pc && pc.yoy >= 1 && pc.yoySourced, `Credit: a metric shows the year-ago comparison, sourced (${pc && pc.yoy})`);

// Stress table: Debtor / Sector / HQ / Debt / Status / Src, all left-aligned, rows
// grouped by status by default; the note column is just the SRC link (no prose).
const stress = await pg.evaluate(() => {
  const tbl = document.querySelector('.v2-view[data-view="dashboard"] .dsh-stresstbl');
  if (!tbl) return null;
  const rows = [...tbl.querySelectorAll("tbody tr")];
  const ths = [...tbl.querySelectorAll("thead th")].map((t) => t.textContent.trim());
  // Default order: Europe first (HQ not ", US"), then grouped by status within each region.
  const region = (r) => (/,\s*US$/.test((r.querySelector("td.dsh-stress-hq") || {}).textContent || "") ? "US" : "Europe");
  const regs = rows.map(region);
  const europeFirst = regs.lastIndexOf("Europe") < (regs.indexOf("US") < 0 ? Infinity : regs.indexOf("US")) || !regs.includes("US");
  let grouped = true;
  for (const R of ["Europe", "US"]) {
    const statuses = rows.filter((r) => region(r) === R).map((r) => (r.querySelector(".dsh-tag-stress") || {}).textContent || "");
    const seen = new Set(); let prev = null;
    for (const s of statuses) { if (s !== prev) { if (seen.has(s)) grouped = false; seen.add(s); prev = s; } }
  }
  const leftAligned = rows.length > 0 && ["td.dsh-nm", "td.dsh-stress-sec", "td.dsh-stress-hq", "td.dsh-stress-debt"].every((sel) => { const c = tbl.querySelector(sel); return !c || getComputedStyle(c).textAlign === "left" || getComputedStyle(c).textAlign === "start"; });
  return {
    rows: rows.length,
    ths,
    grouped, europeFirst,
    drill: rows.length > 0 && rows.every((r) => /\/v2\/transactions\/#\/credits\?q=/.test((r.querySelector("td.dsh-nm a.dsh-drill") || {}).getAttribute?.("href") || "")),
    leftAligned,
    hasSplitCols: !!tbl.querySelector("td.dsh-stress-sec") && !!tbl.querySelector("td.dsh-stress-hq") && !tbl.querySelector(".dsh-stress-sub"),
    proseNotes: tbl.querySelectorAll(".dsh-clamp2").length,
    srcOnly: rows.length > 0 && rows.every((r) => { const c = r.querySelector("td.dsh-note"); return c && c.querySelector('.dsh-src[href^="http"]') && !c.querySelector(".dsh-clamp2"); }),
  };
});
check(stress && stress.rows > 0, `Credit: stress table renders (${stress && stress.rows})`);
check(stress && stress.proseNotes === 0 && stress.srcOnly, "Credit: stress rows carry just an SRC link, no prose note");
check(stress && stress.ths.join("|") === "Debtor|Sector|HQ|Debt|Status|Latest|Src" && stress.hasSplitCols, `Credit: stress table splits debtor/sector/HQ/debt into columns + a dated Latest column (${stress && stress.ths.join(", ")})`);
check(stress && stress.europeFirst, "Credit: European debtors are listed first by default");
check(stress && stress.grouped, "Credit: stress rows are grouped by status within each region");
check(stress && stress.drill, "Credit: every debtor drills into Transactions ▸ Credits (#/credits?q=)");
check(stress && stress.leftAligned, "Credit: stress table columns are left-aligned");

// No duplicate pulse-pill strip above the cards; each US private-credit row is the
// R40 KPI row — at most two lines (label + its faint sub-line) with every value on
// one shared right edge.
const layout = await pg.evaluate(() => {
  const card = [...document.querySelectorAll('.v2-view[data-view="dashboard"] .dsh-card')].find((c) => { const h = c.querySelector(".dsh-h"); return h && /^\s*US private credit/i.test(h.textContent); });
  const rows = card ? [...card.querySelectorAll(".dsh-pc-grid .dsh-kv")] : [];
  return {
    nPills: document.querySelectorAll(".dsh-pills-stack .dsh-pill").length,
    nRows: rows.length,
    maxRowH: rows.length ? Math.max(...rows.map((r) => Math.round(r.getBoundingClientRect().height))) : 0,
    vEdges: new Set(rows.map((r) => Math.round((r.querySelector(".dsh-kv-v") || r).getBoundingClientRect().right))).size,
  };
});
checkEq(layout.nPills, 0, "Credit: no duplicate pulse-pill strip (the card carries the metrics once)");
check(layout.nRows > 0 && layout.maxRowH <= 52, `Credit: each private-credit row is at most two lines (max ${layout.maxRowH}px)`);
checkEq(layout.vEdges, 1, "Credit: private-credit values share one right edge");

checkErrs(errs, "dashboard credit private-credit");
await ctx.close();
await b.close(); srv.close();
finish();
