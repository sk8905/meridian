// Dashboard heatmaps: (1) Equities ▸ World indices — local index points grouped
// by jurisdiction (US · South America · UK · Europe · APAC), heat-shaded by the
// latest session move, each tile sourced. (2) Fixed Income ▸ Government bond
// yields — a heatmap of one tenor with a 2Y/5Y/10Y/30Y toggle that re-renders.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- Equities: world-indices heatmap ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/equities/");
  await pg.waitForTimeout(1600);
  const wi = await pg.evaluate(() => {
    const box = document.querySelector("#dsh-wi-box");
    const cols = [...box.querySelectorAll("thead th.dsh-r")].map((t) => t.textContent.trim());
    const rows = [...box.querySelectorAll("tbody tr:not(.dsh-georow)")];   // index rows only, not the geo bands
    return {
      cols,
      rows: rows.length,
      geos: [...box.querySelectorAll(".dsh-geo")].map((g) => g.textContent.trim()),   // labelled geography bands
      sourced: rows.length > 0 && rows.every((r) => { const a = r.querySelector(".dsh-nm a"); return a && /^https?:/.test(a.getAttribute("href") || ""); }),
      levels: rows.filter((r) => { const c = r.querySelector(".dsh-nm .dsh-fl-t"); return c && c.textContent.trim(); }).length,
      hasSP: rows.some((r) => /S&P 500/.test((r.querySelector(".dsh-nm") || {}).textContent || "")),
    };
  });
  checkEq(wi.cols.join(","), "1W,1M,3M,6M,1Y", "World indices: same 1W/1M/3M/6M/1Y windows as the ETF-flows heatmap");
  check(wi.rows >= 15, `World indices: rows render (${wi.rows})`);
  check(wi.geos.length === 5 && wi.geos.includes("United States") && wi.geos.includes("Europe") && wi.geos.includes("Asia-Pacific"),
    `World indices: organised into labelled geography bands (${wi.geos.join(", ")})`);
  check(wi.sourced, "World indices: every index row links its source");
  check(wi.levels >= 15, `World indices: rows show the index level (points) in the label (${wi.levels})`);
  check(wi.hasSP, "World indices: includes the S&P 500");
  checkErrs(errs, "world indices heatmap");
  await ctx.close();
}

// ---- Fixed Income: yield-CHANGE heatmap (1W/1M/3M/6M/1Y) + tenor dropdown ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/fixed-income/");
  await pg.waitForTimeout(1600);
  const gy = await pg.evaluate(() => {
    const box = document.querySelector("#dsh-yld");
    const cols = [...box.querySelectorAll("thead th.dsh-r")].map((t) => t.textContent.trim());
    const rows = [...box.querySelectorAll("tbody tr")];
    const sel = box.querySelector("#dsh-yld-tenor");
    return {
      cols, rows: rows.length,
      tenors: sel ? [...sel.options].map((o) => o.textContent.trim()) : [],
      defTenor: sel ? sel.value : "",
      bands: box.querySelectorAll(".dsh-wkrow").length,
      breaks: box.querySelectorAll(".dsh-secbreak").length,
      sourced: rows.length > 0 && rows.every((r) => { const a = r.querySelector(".dsh-nm a"); return a && /^https?:/.test(a.getAttribute("href") || ""); }),
      levels: rows.filter((r) => { const c = r.querySelector(".dsh-nm .dsh-fl-t"); return c && /%/.test(c.textContent || ""); }).length,
    };
  });
  checkEq(gy.cols.join(","), "1W,1M,3M,6M,1Y", "Govt yields: change columns are 1W/1M/3M/6M/1Y");
  checkEq(gy.tenors.join(","), "2Y,5Y,10Y,30Y", "Govt yields: bond-duration dropdown lists 2Y/5Y/10Y/30Y");
  checkEq(gy.defTenor, "y10", "Govt yields: dropdown defaults to 10Y");
  checkEq(gy.bands, 0, "Govt yields: no labelled region band (thin rules)");
  checkEq(gy.breaks, 4, "Govt yields: five jurisdictions separated by thin grey rules");
  check(gy.rows >= 10, `Govt yields: economy rows render (${gy.rows})`);
  check(gy.sourced, "Govt yields: every row links its source");
  check(gy.levels >= 8, `Govt yields: current yield shown in the label (${gy.levels})`);
  // Change cells are populated (curated m1/y1 snapshot) — guards the empty-table regression.
  const chgFilled = await pg.evaluate(() => [...document.querySelectorAll("#dsh-yld tbody td.dsh-fl")].filter((c) => /-?\d/.test(c.textContent || "")).length);
  check(chgFilled >= 10, `Govt yields: change cells show bp values, not all blank (${chgFilled})`);

  // Selecting a different bond duration re-renders the heatmap.
  const after = await pg.evaluate(() => {
    const sel = document.querySelector("#dsh-yld-tenor");
    sel.value = "y2"; sel.dispatchEvent(new Event("change", { bubbles: true }));
    const box = document.querySelector("#dsh-yld");
    return { val: box.querySelector("#dsh-yld-tenor").value, rows: box.querySelectorAll("tbody tr").length };
  });
  checkEq(after.val, "y2", "Govt yields: selecting a duration switches + re-renders");
  check(after.rows >= 10, `Govt yields: heatmap re-renders on duration change (${after.rows})`);

  // Multi-country term structure: a table row per country, each with its colour key.
  const curve = await pg.evaluate(() => {
    const card = [...document.querySelectorAll('.v2-view[data-view="dashboard"] .dsh-card')].find((c) => /yield curves \(all countries\)/i.test(c.textContent));
    if (!card) return null;
    return { keys: card.querySelectorAll(".dsh-yc-key").length, rows: card.querySelectorAll("table tbody tr").length };
  });
  check(curve && curve.rows >= 10, `Fixed Income: term-structure table covers every country (${curve && curve.rows} rows)`);
  check(curve && curve.keys >= 10 && curve.keys === curve.rows, "Fixed Income: each country row carries its colour key");

  // "Why it moved" box mirrors the Equities Key-moments card, each note sourced.
  const km = await pg.evaluate(() => {
    const card = [...document.querySelectorAll('.v2-view[data-view="dashboard"] .dsh-card')].find((c) => /why it moved/i.test(c.textContent));
    if (!card) return null;
    const rows = [...card.querySelectorAll(".dsh-km")];
    return { rows: rows.length, sourced: rows.length > 0 && rows.every((r) => r.querySelector('.dsh-src[href^="http"]')) };
  });
  check(km && km.rows > 0, `Fixed Income: "why it moved" box renders (${km && km.rows})`);
  check(km && km.sourced, "Fixed Income: every why-it-moved note links its source");
  checkErrs(errs, "govt yields heatmap");
  await ctx.close();
}

// ---- Macro: Rate outlook (stacked) + US/UK Yield curve card ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/macro/");
  await pg.waitForTimeout(1600);
  const m = await pg.evaluate(() => {
    const roTbl = document.querySelector(".dsh-ro-tbl");
    const ycCard = document.querySelector("#dsh-yc-card");
    const roLabels = roTbl ? [...roTbl.querySelectorAll("tbody tr .dsh-nm")].map((t) => t.textContent.trim()) : [];
    const rowLabels = ycCard ? [...ycCard.querySelectorAll("table tbody tr .dsh-nm")].map((t) => t.textContent.trim()) : [];
    return {
      economies: roTbl ? roTbl.querySelectorAll("tbody tr").length : 0,
      roReads: roTbl ? roTbl.querySelectorAll("tbody tr td.dsh-ro-read").length : 0,
      roLabels,
      ycHeader: ycCard ? /Yield curve/.test(ycCard.querySelector(".dsh-h").textContent) : false,
      ycLines: ycCard ? ycCard.querySelectorAll(".dsh-yc-svg path").length : 0,
      rowLabels,
    };
  });
  checkEq(m.economies, 2, "Macro: Rate outlook renders both economies as table rows");
  check(m.roLabels.some((l) => /Fed/.test(l)) && m.roLabels.some((l) => /BoE/.test(l)) && m.roReads === 2,
    "Macro: Rate-outlook table carries US·Fed / UK·BoE with an inline commentary column");
  check(m.ycHeader, "Macro: Yield-curve card renders with its header");
  checkEq(m.ycLines, 2, "Macro: Yield curve draws US Treasury + UK gilt lines");
  check(m.rowLabels.some((l) => /US Treasury/.test(l)) && m.rowLabels.some((l) => /UK gilts/.test(l)), "Macro: Yield-curve table has US Treasury + UK gilts rows");
  // MPC vote rows: the tally (6-3, 5-4) and the lean pill (3 → hike, 4 → cut) each
  // sit in a fixed column, so every row lines up regardless of pill text width.
  const votes = await pg.evaluate(() => {
    const rows = [...document.querySelectorAll(".dsh-kv-vote")];
    const lefts = (sel) => rows.map((r) => { const e = r.querySelector(sel); return e ? e.getBoundingClientRect().left : null; }).filter((x) => x != null);
    const spread = (xs) => xs.length ? Math.max(...xs) - Math.min(...xs) : 0;
    return { n: rows.length, tallySpread: spread(lefts(".dsh-tally")), bandSpread: spread(lefts(".dsh-band")) };
  });
  if (votes.n >= 2) {
    check(votes.tallySpread <= 2, `Macro: MPC vote tallies are column-aligned (${votes.tallySpread.toFixed(1)}px spread)`);
    check(votes.bandSpread <= 2, `Macro: MPC vote lean pills are column-aligned (${votes.bandSpread.toFixed(1)}px spread)`);
  } else check(true, "Macro: no MPC vote rows to align this cycle");
  // Market sizes matrix: asset-class bands over region rows, each with a size (or
  // "—") + 1Y/5Y/10Y trend arrows, every row source-linked (certifiable only).
  const ms = await pg.evaluate(() => {
    const grid = document.querySelector(".dsh-ms-grid");
    if (!grid) return { present: false };
    const cols = [...grid.querySelectorAll(".dsh-ms-col")];
    const bands = cols.map((c) => (c.querySelector(".dsh-ms-col-h") || {}).textContent?.replace(/\s+/g, " ").trim());
    const rows = [...grid.querySelectorAll(".dsh-ms-tbl tbody tr")];
    const cells = [...grid.querySelectorAll(".dsh-ms-tbl tbody td.dsh-ms-a")];
    return {
      present: true, nCols: cols.length, bands, nRows: rows.length,
      horizonCells: cells.length,
      filled: cells.filter((c) => c.querySelector(".dsh-ms-t") || c.querySelector(".dsh-ms-p")).length,
      pcts: grid.querySelectorAll(".dsh-ms-p").length,
      sideBySide: cols.length >= 2 && Math.abs(cols[0].getBoundingClientRect().top - cols[1].getBoundingClientRect().top) <= 2,
      sourced: rows.filter((r) => r.querySelector(".dsh-ms-nm a[href^='http']")).length,
      sized: rows.filter((r) => { const s = r.querySelector(".dsh-ms-sz"); return s && !/^—/.test(s.textContent.trim()); }).length,
    };
  });
  check(ms.present, "Macro: market-sizes matrix renders");
  check(ms.present && ms.nCols === 4 && /Public equities/i.test(ms.bands[0] || "") && ms.bands.some((b) => /Private credit/i.test(b || "")),
    `Macro: four asset-class blocks (${(ms.bands || []).join(" · ")})`);
  check(ms.present && ms.sideBySide, "Macro: the asset-class blocks sit side by side (full width)");
  check(ms.present && ms.nRows === 16, `Macro: US·Europe·Asia·Global for each class (${ms.nRows} rows)`);
  check(ms.present && ms.horizonCells === 48 && ms.filled === 48, `Macro: every 1Y/5Y/10Y cell shows a % or a trend arrow (${ms.filled}/${ms.horizonCells})`);
  check(ms.present && ms.pcts >= 6, `Macro: %% shown for the increases where sourced (${ms.pcts} cells)`);
  check(ms.present && ms.sourced === ms.nRows, `Macro: every market-size row links its source (${ms.sourced}/${ms.nRows})`);
  check(ms.present && ms.sized >= 10, `Macro: sizes shown where cleanly sourced, "—" otherwise (${ms.sized} sized)`);
  checkErrs(errs, "macro rate outlook + yield curve");
  await ctx.close();
}

await b.close(); srv.close();
finish();
