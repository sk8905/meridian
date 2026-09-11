// Manager profile: the restructured tabs (News · Vehicles · Investments ·
// Business), the collapsible "Sources" line, and the Investments tab — deal
// activity drawn from surfaced news, tagged debt/equity. Rendered inside Profiles.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(1400);

// Open Profiles (real touch), then deep-link a manager with plenty of activity.
const cdp = await ctx.newCDPSession(pg);
const tb = await pg.evaluate(() => { const t = document.querySelector('.mobile-tabbar .mtab[data-key="profiles"]'); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: tb.x, y: tb.y }] });
await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
await pg.waitForTimeout(1200);
await pg.evaluate(() => { const c = document.querySelector('#pf-chips .tchip[data-p="managers"]'); if (c) c.click(); location.hash = "#/manager/m8"; });
await pg.waitForTimeout(900);

// Tabs: News · Vehicles · Investments · Business (no standalone Funds/CLOs tabs).
const tabs = await pg.evaluate(() => [...document.querySelectorAll("#mgr-tabs .tchip")].map((c) => c.dataset.p));
check(JSON.stringify(tabs) === JSON.stringify(["news", "vehicles", "investments", "business"]), `manager tabs are News/Vehicles/Investments/Business (${tabs.join("/")})`);

// Sources are collapsed into a single expandable line — no long inline "Sources:" block.
const src = await pg.evaluate(() => {
  const det = document.querySelector("#pf-detail .tdet-src-det");
  const sum = det && det.querySelector("summary");
  const wasOpen = det ? det.open : null;
  if (det) det.open = true;   // expand
  const bodyLinks = det ? det.querySelectorAll(".tdet-src-body a[href]").length : 0;
  return { hasDet: !!det, summaryText: sum ? sum.textContent.trim() : "", startsClosed: wasOpen === false, bodyLinks, noInlineBlock: !document.querySelector("#pf-detail .tdet-src .sources") };
});
check(src.hasDet && /^Sources/.test(src.summaryText), `sources render as a single collapsible "Sources" line (${src.summaryText})`);
check(src.startsClosed, "sources start collapsed");
check(src.bodyLinks > 0 && src.noInlineBlock, `expanding shows the source links (${src.bodyLinks}); no long inline note`);

// Investments tab: a TABLE — company/borrower · deal · instrument · amount · date
// · source. Every row is tagged debt/equity and leads with a company link to its
// source article.
await pg.evaluate(() => { const t = document.querySelector('#mgr-tabs .tchip[data-p="investments"]'); if (t) t.click(); });
await pg.waitForTimeout(300);
const inv = await pg.evaluate(() => {
  const pane = document.querySelector('#mgr-panes .tpane[data-p="investments"]');
  const table = pane.querySelector("table.tinv-tbl");
  const heads = table ? [...table.querySelectorAll("thead th")].map((h) => h.textContent.trim()) : [];
  const rows = table ? [...table.querySelectorAll("tbody tr")] : [];
  return {
    hasTable: !!table,
    // The table must actually be VISIBLE, not just present — a display:none
    // ancestor once hid it entirely while the DOM rows still existed.
    visibleH: table ? Math.round(table.getBoundingClientRect().height) : 0,
    heads,
    count: rows.length,
    tagged: rows.filter((r) => r.querySelector(".tinv-tag")).length,
    debtOrEquity: rows.filter((r) => r.querySelector(".tinv-tag.is-debt, .tinv-tag.is-equity")).length,
    named: rows.filter((r) => (r.querySelector(".tinv-c-co") || {}).textContent.trim()).length,
    sourced: rows.filter((r) => { const a = r.querySelector(".tinv-c-src a"); return a && /^https?:/.test(a.getAttribute("href") || ""); }).length,
    withAmount: rows.filter((r) => { const t = (r.querySelector(".tinv-c-amt") || {}).textContent || ""; return /[$£€]/.test(t); }).length,
    withDate: rows.filter((r) => (r.querySelector(".tinv-c-date") || {}).textContent.trim()).length,
    // Every header + cell reads left-aligned (no .tleague right-aligned columns).
    aligns: table ? [...table.querySelectorAll("thead th, tbody tr:first-child td")].map((c) => getComputedStyle(c).textAlign) : [],
    // The name column holds a CONCISE extracted name, not the whole headline: the
    // cell text is shorter than the full headline it carries in its title.
    concise: rows.filter((r) => { const c = r.querySelector(".tinv-c-co"); const t = (c && c.getAttribute("title")) || ""; return c && t && c.textContent.trim().length < t.length; }).length,
  };
});
check(inv.hasTable, "Investments tab renders as a table");
check(inv.visibleH > 0, `the Investments table is visible, not hidden (${inv.visibleH}px)`);
check(/Company/.test(inv.heads[0] || "") && inv.heads.some((h) => /Amount/.test(h)) && inv.heads.some((h) => /Date/.test(h)) && inv.heads.some((h) => /Source/.test(h)), `table columns: company/borrower, deal, instrument, amount, date, source (${inv.heads.join(" · ")})`);
check(inv.count > 0, `Investments table lists deals (${inv.count})`);
check(inv.tagged === inv.count, `every investment carries an instrument tag (${inv.tagged}/${inv.count})`);
check(inv.debtOrEquity > 0, `investments are classified debt/equity where the article says so (${inv.debtOrEquity})`);
check(inv.named === inv.count, `every investment leads with a company/borrower name (${inv.named}/${inv.count})`);
check(inv.aligns.length > 0 && inv.aligns.every((a) => a === "left" || a === "start"), `every header + cell is left-aligned (${[...new Set(inv.aligns)].join(", ")})`);
check(inv.concise >= Math.ceil(inv.count * 0.6), `most rows show a concise extracted name, not the full headline (${inv.concise}/${inv.count})`);
check(inv.sourced === inv.count, `every investment links its source in the Source column (${inv.sourced}/${inv.count})`);
check(inv.withAmount > 0, `deal amounts surface where known (${inv.withAmount})`);
check(inv.withDate === inv.count, `every investment shows its date (${inv.withDate}/${inv.count})`);
// No stacked dead space under the table: the detail's own .tcol must not re-add the
// mobile tab-bar clearance the list wrapper already provides (it doubled to ~160px).
const tail = await pg.evaluate(() => {
  const tbl = document.querySelector("#pf-detail .tinv-tbl");
  const sec = document.querySelector("#pf-list > .tdash-grid > .tcol-c");
  if (!tbl || !sec) return -1;
  return Math.round(sec.getBoundingClientRect().bottom - tbl.getBoundingClientRect().bottom);
});
check(tail >= 0 && tail <= 120, `only one tab-bar clearance under the table, no stacked dead space (${tail}px)`);

// Vehicles tab: Funds + CLOs + Listed vehicles merged into labelled groups.
await pg.evaluate(() => { const t = document.querySelector('#mgr-tabs .tchip[data-p="vehicles"]'); if (t) t.click(); });
await pg.waitForTimeout(300);
const veh = await pg.evaluate(() => {
  const pane = document.querySelector('#mgr-panes .tpane[data-p="vehicles"]');
  return [...pane.querySelectorAll(".tveh-grp-h")].map((h) => h.textContent.replace(/\s+/g, " ").trim());
});
check(veh.length > 0 && veh.some((h) => /Funds/.test(h)), `Vehicles tab merges Funds/CLOs/Listed into labelled groups (${veh.join(" · ")})`);

// No stray divider line in the dead space under a short profile page: the single
// full-width column (Profiles / Transactions) carries no bottom border, so the
// empty area below the content reads as clean background, not an unfinished list.
const stray = await pg.evaluate(() => [...document.querySelectorAll(".tcol-full")]
  .map((e) => parseFloat(getComputedStyle(e).borderBottomWidth) || 0));
check(stray.length > 0 && stray.every((w) => w === 0), `phone: the full-width profile column has no stray bottom-border line (${stray.join(", ")})`);

// Business tab reads as data only — an undisclosed figure is dropped, never shown
// as a "—" placeholder row (which cluttered the Headcount section on every firm
// that discloses only a total).
await pg.evaluate(() => { const t = document.querySelector('#mgr-tabs .tchip[data-p="business"]'); if (t) t.click(); });
await pg.waitForTimeout(250);
const dashRows = await pg.evaluate(() => [...document.querySelectorAll('#mgr-panes .tpane[data-p="business"] .tbiz-v')].filter((e) => e.textContent.trim() === "—").length);
check(dashRows === 0, `phone: the Business tab shows no empty "—" placeholder rows (${dashRows})`);

checkErrs(errs, "manager profile investments");
await ctx.close();

// DESKTOP: the Investments league table must read as EVENLY-SPACED columns —
// table-layout:fixed with a proper per-column width set — not the leaked 8-column
// manager widths that once starved Source (wrapping its name to 3 lines) and
// overran the instrument badge into Amount. Assert no column is squashed or
// runaway, and every row is a single line (Source ellipsizes rather than wraps).
{
  const d = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/profiles/#/manager/m8`);
  await d.pg.waitForTimeout(1500);
  await d.pg.evaluate(() => { const t = document.querySelector('#mgr-tabs .tchip[data-p="investments"]'); if (t) t.click(); });
  await d.pg.waitForTimeout(400);
  const g = await d.pg.evaluate(() => {
    const tbl = document.querySelector(".tinv-tbl");
    if (!tbl) return { found: false };
    const tw = tbl.getBoundingClientRect().width;
    const cols = [...tbl.querySelectorAll("thead th")].map((th) => th.getBoundingClientRect().width / tw);
    const rowsH = [...tbl.querySelectorAll("tbody tr")].slice(0, 20).map((tr) => tr.getBoundingClientRect().height);
    const cs = getComputedStyle(tbl);
    return { found: true, layout: cs.tableLayout, min: Math.min(...cols), max: Math.max(...cols), maxRowH: Math.max(...rowsH), n: cols.length };
  });
  check(g.found && g.layout === "fixed", `desktop: Investments table uses fixed column layout (${g.layout})`);
  check(g.n === 6, `desktop: six columns (${g.n})`);
  check(g.min >= 0.08, `desktop: no column is squashed (narrowest ${(g.min * 100).toFixed(0)}%)`);
  check(g.max <= 0.30, `desktop: no column runs away with the width (widest ${(g.max * 100).toFixed(0)}%)`);
  check(g.maxRowH > 0 && g.maxRowH <= 44, `desktop: every row is a single line — Source ellipsizes, it does not wrap (tallest ${Math.round(g.maxRowH)}px)`);
  checkErrs(d.errs, "desktop investments column spacing");
  await d.ctx.close();
}

await b.close(); srv.close();
finish();
