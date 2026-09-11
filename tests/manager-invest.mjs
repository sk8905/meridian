// Manager profile: the restructured tabs (News · Vehicles · Investments ·
// Business), the collapsible "Sources" line, and the Investments tab — deal
// activity drawn from surfaced news, tagged debt/equity. Rendered inside Profiles.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

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
  };
});
check(inv.hasTable, "Investments tab renders as a table");
check(inv.visibleH > 0, `the Investments table is visible, not hidden (${inv.visibleH}px)`);
check(/Company/.test(inv.heads[0] || "") && inv.heads.some((h) => /Amount/.test(h)) && inv.heads.some((h) => /Date/.test(h)) && inv.heads.some((h) => /Source/.test(h)), `table columns: company/borrower, deal, instrument, amount, date, source (${inv.heads.join(" · ")})`);
check(inv.count > 0, `Investments table lists deals (${inv.count})`);
check(inv.tagged === inv.count, `every investment carries an instrument tag (${inv.tagged}/${inv.count})`);
check(inv.debtOrEquity > 0, `investments are classified debt/equity where the article says so (${inv.debtOrEquity})`);
check(inv.named === inv.count, `every investment leads with a company/borrower name (${inv.named}/${inv.count})`);
check(inv.sourced === inv.count, `every investment links its source in the Source column (${inv.sourced}/${inv.count})`);
check(inv.withAmount > 0, `deal amounts surface where known (${inv.withAmount})`);
check(inv.withDate === inv.count, `every investment shows its date (${inv.withDate}/${inv.count})`);

// Vehicles tab: Funds + CLOs + Listed vehicles merged into labelled groups.
await pg.evaluate(() => { const t = document.querySelector('#mgr-tabs .tchip[data-p="vehicles"]'); if (t) t.click(); });
await pg.waitForTimeout(300);
const veh = await pg.evaluate(() => {
  const pane = document.querySelector('#mgr-panes .tpane[data-p="vehicles"]');
  return [...pane.querySelectorAll(".tveh-grp-h")].map((h) => h.textContent.replace(/\s+/g, " ").trim());
});
check(veh.length > 0 && veh.some((h) => /Funds/.test(h)), `Vehicles tab merges Funds/CLOs/Listed into labelled groups (${veh.join(" · ")})`);

checkErrs(errs, "manager profile investments");
await ctx.close();
await b.close(); srv.close();
finish();
