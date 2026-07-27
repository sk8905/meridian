// Sector flows heatmap (Dashboard ▸ Equities). Guards the allocations surface:
// the Equities pane renders a sectors × time-window heatmap from the committed,
// sourced SECTOR_FLOWS data (allocations.js, static — no live API), with diverging
// colour and per-sector source links. Also checks the data contract: 11 SPDR
// sectors, every provider window numeric, every row sourced.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
await pg.waitForTimeout(1800);

// Go to Dashboard ▸ Equities where the heatmap now lives.
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/dashboard/equities/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(1200);

const grid = await pg.evaluate(() => {
  const tbl = document.querySelector(".dsh-fl-tbl");
  if (!tbl) return null;
  const cols = tbl.querySelectorAll("thead th").length;               // label + windows
  const rows = tbl.querySelectorAll("tbody tr").length;
  const cells = [...tbl.querySelectorAll("tbody td.dsh-fl, tbody td.dsh-fl-na")];
  const colored = cells.filter((c) => c.getAttribute("style") && /rgba?\(/.test(c.getAttribute("style"))).length;
  const srcLinks = tbl.querySelectorAll('tbody td.dsh-nm a[href^="http"]').length;
  const foot = !!document.querySelector(".dsh-fl-note a[href^='http']");
  return { cols, rows, colored, srcLinks, foot };
});
check(!!grid, "Equities pane renders the sector-flows heatmap");
check(grid && grid.rows === 11, `11 SPDR sector rows (${grid ? grid.rows : 0})`);
check(grid && grid.cols === 7, `6 time-window columns + label (${grid ? grid.cols : 0} headers)`);
check(grid && grid.colored >= 40, `flow cells are heat-shaded (${grid ? grid.colored : 0} coloured)`);
check(grid && grid.srcLinks === 11, `every sector row links its flows source (${grid ? grid.srcLinks : 0}/11)`);
check(grid && grid.foot, "footer cites the flows data source");

// Data contract: 11 sectors, each sourced; every ETFdb window (w1..y1) numeric.
const data = await pg.evaluate(async () => {
  const m = await import("/allocations.js");
  const F = m.SECTOR_FLOWS || {};
  const s = F.sectors || [];
  const wins = ["w1", "m1", "m3", "m6", "y1"];
  const numeric = s.every((x) => wins.every((k) => typeof x[k] === "number"));
  const sourced = s.every((x) => /^https?:\/\//.test(x.src || ""));
  return { n: s.length, numeric, sourced };
});
check(data.n === 11, `SECTOR_FLOWS has 11 sectors (${data.n})`);
check(data.numeric, "every provider window (1W–1Y) is a real number");
check(data.sourced, "every sector carries a source URL");

checkErrs(errs, "sector flows heatmap");
await ctx.close();
await b.close(); srv.close();
finish();
