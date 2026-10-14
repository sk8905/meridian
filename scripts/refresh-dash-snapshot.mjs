// =============================================================================
// refresh-dash-snapshot.mjs — refreshes the Dashboard's FALLBACK snapshot
// (dashboard/js/data.js: EQ_INDICES, WORLD_INDICES, the US row of GOVT_YIELDS /
// GOVT_YIELD_CHG, DASH_ASOF) from the SAME free sources the live Dashboard reads —
// by running the Worker's own live handlers (/api/eqindices, /api/worldindices,
// /api/govyields: Yahoo Finance index history, the US Federal Reserve's FRED
// Treasury series) outside the Worker. The snapshot is what the Dashboard shows when
// a live call fails, so it should never be months old (it was 82 days on 14 Oct 2026).
//
// Only values a source actually returned are written; anything that came back empty
// keeps its existing, dated, sourced value. Each refreshed row carries its own as-of
// date and source link. Runs in a GitHub Action (.github/workflows/refresh-dash-snapshot.yml).
//   node scripts/refresh-dash-snapshot.mjs            # edits dashboard/js/data.js
//   node scripts/refresh-dash-snapshot.mjs --dry-run  # prints what would change
// =============================================================================
import fs from "node:fs";

const FILE = new URL("../dashboard/js/data.js", import.meta.url);
const today = () => new Date().toISOString().slice(0, 10);

// Replace one `export const NAME = …;` block (ending at a line that starts with
// "];" or "};") with a JSON rendering of `value` — valid JS, comments above kept.
export function replaceExport(src, name, value) {
  const start = src.indexOf(`export const ${name} = `);
  if (start < 0) return src;
  const open = src[start + `export const ${name} = `.length];
  if (open !== "[" && open !== "{") return src;
  const close = open === "[" ? "\n];" : "\n};";
  const end = src.indexOf(close, start);
  if (end < 0) return src;
  return src.slice(0, start) + `export const ${name} = ${JSON.stringify(value, null, 2)};` + src.slice(end + close.length);
}
export function replaceScalar(src, name, value) {
  return src.replace(new RegExp(`export const ${name} = "[^"]*";`), `export const ${name} = ${JSON.stringify(value)};`);
}

// Merge live results into the current snapshot objects (pure; unit-tested).
export function mergeSnapshot(cur, { eq = [], world = [], gy = [], ytd = {} } = {}) {
  const out = JSON.parse(JSON.stringify(cur)), log = [];
  const yh = (s) => `https://finance.yahoo.com/quote/${encodeURIComponent(s)}/`;
  for (const row of out.EQ_INDICES || []) {
    const live = eq.find((x) => x.id === row.id);
    if (!live || live.value == null || !live.asOf) continue;
    row.level = +(+live.value).toFixed(2); row.asOf = String(live.asOf).slice(0, 10);
    if (ytd[row.id] != null) row.ytd = ytd[row.id];
    if (live.href) row.source = live.href;
    log.push(`EQ_INDICES ${row.id} → ${row.level} (${row.asOf})`);
  }
  for (const reg of (out.WORLD_INDICES && out.WORLD_INDICES.regions) || []) for (const row of reg.rows || []) {
    const live = world.find((x) => x.name === row.name);
    if (!live || live.value == null || !live.asOf) continue;
    row.level = +(+live.value).toFixed(2);
    for (const k of ["w1", "m1", "m3", "m6", "y1"]) if (live[k] != null) row[k] = live[k];
    row.asOf = String(live.asOf).slice(0, 10); if (live.symbol) row.source = yh(live.symbol);
    log.push(`WORLD_INDICES ${row.name} → ${row.level}`);
  }
  if (out.WORLD_INDICES && log.some((l) => l.startsWith("WORLD"))) out.WORLD_INDICES.asOf = today();
  const us = gy.find((x) => x.country === "United States");
  if (us && out.GOVT_YIELDS) {
    for (const reg of out.GOVT_YIELDS.regions || []) for (const row of reg.rows || []) {
      if (row.country !== "United States") continue;
      let n = 0;
      for (const k of ["y2", "y5", "y10", "y30"]) if (us[k] && us[k].v != null) { row[k] = us[k].v; n++; }
      if (n) { row.asOf = us.asOf || today(); row.source = us.href || "https://fred.stlouisfed.org/series/DGS10"; log.push(`GOVT_YIELDS United States → ${n} tenors${us.via ? " (" + us.via + ")" : ""}`); }
    }
    out.GOVT_YIELD_CHG = out.GOVT_YIELD_CHG || {};
    const chg = out.GOVT_YIELD_CHG["United States"] = out.GOVT_YIELD_CHG["United States"] || {};
    for (const k of ["y2", "y5", "y10", "y30"]) if (us[k]) chg[k] = { w1: us[k].w1, m1: us[k].m1, m3: us[k].m3, m6: us[k].m6, y1: us[k].y1 };
  }
  return { out, log };
}

// US Treasury's own daily par yield curve (home.treasury.gov, free, no key) — the
// fallback when FRED returns nothing (FRED needs an API key outside the browser).
// CSV: Date (MM/DD/YYYY), "1 Mo", …, "2 Yr", "5 Yr", "10 Yr", "30 Yr". Pure; unit-tested.
export const TREASURY_PAGE = "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve";
export function treasuryCurve(csvTexts, changes) {
  const cols = { y2: "2 Yr", y5: "5 Yr", y10: "10 Yr", y30: "30 Yr" }, pts = { y2: [], y5: [], y10: [], y30: [] };
  for (const txt of csvTexts) {
    const lines = String(txt || "").trim().split(/\r?\n/); if (lines.length < 2) continue;
    const hdr = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
    for (const line of lines.slice(1)) {
      const c = line.split(","), m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(c[0]).trim()); if (!m) continue;
      const t = Date.UTC(+m[3], +m[1] - 1, +m[2]);
      for (const [k, h] of Object.entries(cols)) { const v = parseFloat(c[hdr.indexOf(h)]); if (Number.isFinite(v)) pts[k].push([t, v]); }
    }
  }
  const us = { country: "United States", href: TREASURY_PAGE, via: "US Treasury" };
  let last = 0;
  for (const k of Object.keys(pts)) {
    const p = pts[k].sort((a, b) => a[0] - b[0]).filter((x, i, a) => !i || x[0] !== a[i - 1][0]);
    const c = changes(p); if (c) { us[k] = c; last = Math.max(last, p[p.length - 1][0]); }
  }
  if (last) us.asOf = new Date(last).toISOString().slice(0, 10);
  return us;
}
async function treasuryUs(changes) {
  const y = new Date().getUTCFullYear();
  const get = async (yr) => { try { const r = await fetch(`https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${yr}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${yr}&page&_format=csv`, { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(20000) }); return r.ok ? await r.text() : ""; } catch { return ""; } };
  return treasuryCurve([await get(y - 1), await get(y)], changes);
}

async function yahooYtd(symbol) {
  try {
    const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=ytd&interval=1d`, { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(15000) });
    const j = r.ok ? await r.json() : null;
    const res = j && j.chart && j.chart.result && j.chart.result[0];
    const prev = res && res.meta && res.meta.chartPreviousClose;
    const closes = (res && res.indicators && res.indicators.quote && res.indicators.quote[0].close || []).filter((x) => x != null);
    const last = closes[closes.length - 1];
    return prev && last ? +(((last - prev) / prev) * 100).toFixed(2) : null;
  } catch { return null; }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // The Worker's handlers use the Workers cache API — stub it (no caching here).
  globalThis.caches = { default: { match: async () => null, put: async () => {} } };
  const W = await import("../src/index.js");
  const call = async (fn, path) => { try { const r = await fn(new Request("https://wire.local" + path), {}, null); return await r.json(); } catch (e) { console.error(path, String(e).slice(0, 120)); return {}; } };
  const eq = (await call(W.handleEqIndices, "/api/eqindices")).indices || [];
  const world = (await call(W.handleWorldIndices, "/api/worldindices")).indices || [];
  let gy = (await call(W.handleGovYields, "/api/govyields")).yields || [];
  const usLive = gy.find((x) => x.country === "United States");
  if (!usLive || !(usLive.y10 && usLive.y10.v != null)) gy = [await treasuryUs(W.windowedBpChanges), ...gy.filter((x) => x.country !== "United States")];
  const ytd = {};
  for (const s of W.DASH_INDEX_SERIES || []) ytd[s.id] = await yahooYtd(s.symbol);
  const D = await import("../dashboard/js/data.js");
  const cur = { EQ_INDICES: D.EQ_INDICES, WORLD_INDICES: D.WORLD_INDICES, GOVT_YIELDS: D.GOVT_YIELDS, GOVT_YIELD_CHG: D.GOVT_YIELD_CHG };
  const worldSyms = Object.fromEntries((W.WORLD_INDEX_SERIES || []).map((s) => [s.name, s.symbol]));
  const { out, log } = mergeSnapshot(cur, { eq, world: world.map((x) => ({ ...x, symbol: worldSyms[x.name] })), gy, ytd });
  const refreshed = log.filter((l) => l.startsWith("EQ_INDICES")).length;
  console.log(log.join("\n") || "nothing refreshed");
  // Only move DASH_ASOF when most of the headline indices actually refreshed.
  if (refreshed < 6) { console.error(`only ${refreshed} headline indices refreshed — snapshot left unchanged`); process.exit(refreshed ? 0 : 2); }
  let src = fs.readFileSync(FILE, "utf8");
  for (const k of Object.keys(out)) src = replaceExport(src, k, out[k]);
  src = replaceScalar(src, "DASH_ASOF", today());
  if (!process.argv.includes("--dry-run")) fs.writeFileSync(FILE, src);
}
