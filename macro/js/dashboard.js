// =============================================================================
// macro/js/dashboard.js — the Dashboard cockpit: sub-section chip bar +
// Economy / Rates / Regime / Earnings / Credit panels (yield curve, Fed path,
// gauges, earnings wall, maturity wall). Extracted from app.js, which renders
// it via macroDashPane() and repaints via cockpitInds()/loadYieldCurve().
// =============================================================================
import { esc } from "/util.js?v=20260719-1";
import { YIELD_CURVE, OUTLOOK, CYCLE, BUBBLE, EARNINGS, MATWALL } from "./content.js?v=20260723-2";
import { fmtDate, fmtWeekday, trackGauge, CYCLE_ZONES, BUBBLE_ZONES,
  bubbleComposite, bubbleBand, MACRO_DATA, macroMatrixHtml, MAC_MATRIX_KEYS_FULL } from "./shared.js?v=20260723-2";

// In-page chip memory (fresh visits start on the first chip; in-page re-renders
// keep the pick — see the app.js note on the same pattern).
let _dashSec = "overview", _earnWeek = "this";

// Macro data dashboard (shown behind the "Dashboard" chip in the centre column):
// the US market-implied policy path — CME FedWatch odds + the FOMC dot plot — and
// the two regime gauges (long-term debt cycle, equity bubble risk). Everything is
// static/derived data already compiled in content.js; the FedWatch card links out
// to the live CME tool for current pricing.
// A compact SVG of the US Treasury and UK gilt yield curves (yield vs maturity).
// US solid accent, UK dashed blue — two hues + a line-style so the two series are
// distinguishable without relying on colour alone. No dependency.
function yieldCurveSvg(c) {
  if (!c || !c.us) return "";
  const W = 620, H = 124, L = 36, R = 16, T = 10, B = 24;
  const mats = c.maturities, n = mats.length;
  const vals = [...c.us, ...c.uk].filter((v) => v != null);
  const lo = Math.min(...vals) - 0.3, hi = Math.max(...vals) + 0.3;
  const plotW = W - L - R, plotH = H - T - B;
  const X = (i) => L + (n <= 1 ? 0 : (i / (n - 1)) * plotW);
  const Y = (v) => T + plotH - ((v - lo) / (hi - lo)) * plotH;
  const seg = (arr, cls) => {
    const path = arr.map((v, i) => `${i ? "L" : "M"} ${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
    const dots = arr.map((v, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.6" class="${cls}"><title>${esc(mats[i])} · ${v.toFixed(2)}%</title></circle>`).join("");
    return `<path d="${path}" class="yc-line ${cls}"/>${dots}`;
  };
  const ticks = [];
  for (let y = Math.ceil(lo * 2) / 2; y <= hi; y += 0.5) ticks.push(y);
  const grid = ticks.map((y) => `<line x1="${L}" y1="${Y(y).toFixed(1)}" x2="${W - R}" y2="${Y(y).toFixed(1)}" class="yc-grid"/><text x="${L - 5}" y="${(Y(y) + 3).toFixed(1)}" class="yc-axis" text-anchor="end">${(y % 1 ? y.toFixed(1) : y.toFixed(0))}%</text>`).join("");
  const xlab = mats.map((m, i) => `<text x="${X(i).toFixed(1)}" y="${H - 9}" class="yc-axis" text-anchor="middle">${esc(m)}</text>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" class="yc" role="img" aria-label="US Treasury and UK gilt yield curves">${grid}${seg(c.us, "yc-us")}${seg(c.uk, "yc-uk")}${xlab}</svg>`;
}

// The yield-curve panel body: legend + SVG + note. Reads the module-level _yc,
// which starts as the compiled YIELD_CURVE and is overwritten in place by the live
// /api/yield-curve values (falling back to the compiled figure per maturity).
let _yc = YIELD_CURVE;
function ycBody() {
  const src = _yc.sources || [];
  const link = (i, label) => (src[i] ? `<a href="${esc(src[i][1])}" target="_blank" rel="noopener noreferrer">${label}</a>` : "");
  const srcs = [link(0, "US Treasury"), link(1, "UK gilt")].filter(Boolean).join(' <span class="ck-src-sep">·</span> ');
  return `<div class="yc-legend"><span class="yc-key yc-key-us">US Treasury</span><span class="yc-key yc-key-uk">UK gilt</span></div>`
    + yieldCurveSvg(_yc)
    + (srcs ? `<p class="ck-srcs">Source · ${srcs}</p>` : "");
}
// Pull the live US Treasury + UK gilt curves and merge over the compiled fallback
// (per maturity), then repaint the panel in place. Never throws — on any failure
// the compiled curve stays.
export async function loadYieldCurve() {
  try {
    const r = await fetch("/api/yield-curve", { headers: { accept: "application/json" } });
    if (!r.ok) return;
    const d = await r.json();
    if (!d || !Array.isArray(d.us)) return;
    const merge = (live, stat) => (stat || []).map((v, i) => (live && Number.isFinite(live[i]) ? live[i] : v));
    _yc = { ...YIELD_CURVE, us: merge(d.us, YIELD_CURVE.us), uk: merge(d.uk, YIELD_CURVE.uk), asOf: d.asOf ? fmtDate(d.asOf) : YIELD_CURVE.asOf };
    const body = document.getElementById("ck-yc-body");
    if (body) body.innerHTML = ycBody();
    const asof = document.getElementById("ck-yc-asof");
    if (asof) asof.textContent = `gov · as of ${_yc.asOf}`;
  } catch { /* keep the compiled curve */ }
}

// The economic-indicators block for the cockpit — the G7 + Euro Area + Ireland
// comparison matrix (country × key indicators), then the selected economy's full
// detail. Clicking a matrix row switches the detail (wired by the cockpit host).
export function cockpitInds(series) {
  const S = series || (MACRO_DATA && MACRO_DATA.series) || [];
  if (!S.length) return '<div class="tw-empty muted small" style="padding:11px">Indicators unavailable right now.</div>';
  // The full six-indicator matrix carries every economy's data, so the old
  // per-country detail card beside it is redundant — dropped. `sel` is null so
  // no row reads as "selected" (there is no detail left to point at).
  return macroMatrixHtml(S, null, MAC_MATRIX_KEYS_FULL);
}

// Wall of maturities — corporate credit due over the next five years, from the
// cited S&P / OECD / Reuters / FSB figures in MATWALL (content.js). Two per-year
// bar charts (global rated from S&P's public factbook, Jan-2025 vintage; US
// lev-fin from LSTA/PitchBook, fresher) render above the IG/spec split and the
// OECD 2026–28 refinancing shares; each series keeps its own visible vintage.
// Earnings wall (Dashboard › Earnings): the coming week's major reporters —
// consensus before the release, actuals + share-price reaction after. Every
// figure comes verbatim from EARNINGS (content.js, sourced); nulls render as
// an em-dash rather than being estimated here.
function earningsPanel() {
  const w = EARNINGS;
  if (!w || !w.weeks || !w.weeks.length) return "";
  // Each entry is a small table — Fcst / Act columns × Rev / EPS rows, plus an
  // optional sector KEY-METRIC row (its own label: bank markets revenue, chip
  // gross margin, TSLA deliveries, NOW cRPO…) and an optional GUIDE row (Fcst
  // = guidance in force going into the print, Act = guidance issued with the
  // results). A figure no source publishes states "N/R" (faint); a release
  // that simply hasn't happened yet shows a plain em-dash in Act. Beneath the
  // table: the share reaction + a very short note.
  const nr = '<span class="ew-nr">N/R</span>';
  const cell = (v, pending) => v ? esc(v) : (pending ? "—" : nr);
  const row = (r, past) => {
    const reported = r.actEps || r.actRev || (r.km && r.km.act) || r.px;
    const pending = !past && !reported;
    const px = r.px ? `<span class="ew-px ${String(r.px).trim().startsWith("-") ? "ew-dn" : "ew-up"}">${esc(r.px)}</span>` : "";
    const held = (r.held || []).map((h) => {
      const etf = typeof h === "string" ? h : h.etf;
      const w = typeof h === "string" ? null : h.w;
      return `<span class="ew-etf ew-etf-${esc(String(etf).toLowerCase())}">${esc(etf)}${w ? " " + esc(w) : ""}</span>`;
    }).join("");
    // Numeric rows (Rev / EPS / optional key-metric / optional guidance), plus a
    // single Notes cell on the right that rowspans them all — the share reaction
    // over the short commentary. Nothing to say → a faint em-dash placeholder.
    const bodyRows = [["Rev", r.estRev, r.actRev], ["EPS", r.estEps, r.actEps]];
    if (r.km) bodyRows.push([esc(r.km.l), r.km.est, r.km.act]);
    if (r.guide) bodyRows.push(["Guide", r.guide.est, r.guide.act]);
    const noteInner = (px || r.note) ? `${px}${px && r.note ? "<br>" : ""}${r.note ? esc(r.note) : ""}` : '<span class="ew-nr">—</span>';
    const noteCell = `<td class="ew-cnote" rowspan="${bodyRows.length}">${noteInner}</td>`;
    const body = bodyRows.map(([lbl, est, act], i) =>
      `<tr><th>${lbl}</th><td>${cell(est, false)}</td><td>${cell(act, pending)}</td>${i === 0 ? noteCell : ""}</tr>`).join("");
    return `<div class="ew-row">
      <div class="ew-l"><span class="ew-t">${esc(r.t)}${held}</span><span class="ew-n">${esc(r.n)}</span>
        ${r.tag ? `<span class="ew-tag">${esc(r.tag)}</span>` : ""}
        ${r.when ? `<span class="ew-when">${esc(r.when)}</span>` : ""}</div>
      <div class="ew-r">
        <table class="ew-tbl ew-tbl-note">
          <thead><tr><th></th><th>Fcst</th><th>Act</th><th>Notes</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </div>`;
  };
  const day = (d, past) => `<p class="ck-sub ew-day"><strong>${esc(fmtWeekday(d.date))}</strong></p>${d.rows.map((r) => row(r, past)).join("")}`;
  const week = (wk, i) => wk.days.map((d) => day(d, i === 0)).join("");
  // Week toggle chips (This week / Last week) — one block shown at a time.
  // Content order is weeks[0]=last, weeks[1]=this.
  let wsel = _earnWeek;
  if (wsel !== "this" && wsel !== "last") wsel = "this";
  wireEwNav();
  const srcs = (w.srcs || []).map((s) => `<a class="ck-src" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a>`).join(" · ");
  return `<section class="ck-panel ck-span2">
    <div class="ck-body ew-body">
      <div class="ew-chipbar"><div class="tchips" id="ew-weeknav">
        <button type="button" class="tchip${wsel === "this" ? " is-on" : ""}" data-w="this">This week</button>
        <button type="button" class="tchip${wsel === "last" ? " is-on" : ""}" data-w="last">Last week</button>
      </div></div>
      <div data-ew-week="this" class="${wsel !== "this" ? "ew-off" : ""}">${week(w.weeks[1], 1)}</div>
      <div data-ew-week="last" class="${wsel !== "last" ? "ew-off" : ""}">${week(w.weeks[0], 0)}</div>
      <details class="ew-srcwrap"><summary>Sources</summary><p class="ck-sub ew-srcs">${srcs}</p></details></div>
  </section>`;
}

// Earnings week chips (delegated, wired once — the dashboard re-renders).
let _ewWired = false;
function wireEwNav() {
  if (_ewWired) return; _ewWired = true;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("#ew-weeknav .tchip");
    if (!b) return;
    const wsel = b.getAttribute("data-w") || "this";
    _earnWeek = wsel;
    document.querySelectorAll("#ew-weeknav .tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    document.querySelectorAll("[data-ew-week]").forEach((g) => g.classList.toggle("ew-off", g.getAttribute("data-ew-week") !== wsel));
  });
}

// Maturity-wall bar chart (y = $bn, x = year) — plots ONLY published figures;
// buckets with no published number render a small "n/p" mark at the baseline
// instead of a bar (never estimated). Defaults draw MATWALL.wall (two series,
// loans + hy, 0–400 grid); a wall object may override scale/layout (max, grid,
// w, l) and series ([{key, cls, alt, minKey?}]) — MATWALL.ratedWall uses this
// for its single global-rated series on a 0–3,000 grid.
function wallChart(wl, ariaTitle) {
  if (!wl || !wl.buckets || !wl.buckets.length) return "";
  const W = wl.w || 340, H = 138, T = 16, B = 22, L = wl.l || 26, R = 4;
  const max = wl.max || 400, ih = H - T - B, base = T + ih;
  const y = (v) => T + (1 - v / max) * ih;
  const series = wl.series || [
    { key: "loans", cls: "mwc-loan", alt: "loans" },
    { key: "hy", cls: "mwc-hy", alt: "high-yield bonds", minKey: "hyMin" },
  ];
  const gw = (W - L - R) / wl.buckets.length, bw = 30, gap = 6;
  const sw = series.length * bw + (series.length - 1) * gap;
  const fmt = (v) => Number(v).toLocaleString("en-US");
  const grid = (wl.grid || [0, 100, 200, 300, 400]).map((g) =>
    `<line x1="${L}" y1="${y(g)}" x2="${W - R}" y2="${y(g)}" class="mwc-grid"/>`
    + (g ? `<text x="${L - 4}" y="${y(g) + 3}" text-anchor="end" class="mwc-t">${fmt(g)}</text>` : "")).join("");
  const bars = wl.buckets.map((b, i) => {
    const cx = L + gw * i + gw / 2;
    let out = "";
    series.forEach((s, si) => {
      const v = b[s.key], pre = s.minKey && b[s.minKey] ? ">" : "";
      const x = cx - sw / 2 + si * (bw + gap);
      if (v == null) {
        out += `<text x="${x + bw / 2}" y="${base - 4}" text-anchor="middle" class="mwc-t mwc-np">n/p</text>`;
      } else {
        const yy = y(v);
        out += `<rect x="${x}" y="${yy}" width="${bw}" height="${base - yy}" rx="2" class="${s.cls}"/>`
          + `<text x="${x + bw / 2}" y="${yy - 4}" text-anchor="middle" class="mwc-t mwc-v">${pre}$${fmt(v)}bn</text>`;
      }
    });
    return out + `<text x="${cx}" y="${H - 8}" text-anchor="middle" class="mwc-t mwc-xl">${esc(b.y)}</text>`;
  }).join("");
  const alt = wl.buckets.map((b) => {
    const parts = series.filter((s) => b[s.key] != null)
      .map((s) => `${s.alt || s.key} ${s.minKey && b[s.minKey] ? "over " : ""}$${fmt(b[s.key])}bn`);
    return `${b.y}: ${parts.join(", ")}`.trim();
  }).join("; ");
  return `<svg class="mwc-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(ariaTitle || "US leveraged-finance maturities by year, $bn")} — ${esc(alt)}">${grid}<line x1="${L}" y1="${base}" x2="${W - R}" y2="${base}" class="mwc-base"/>${bars}</svg>`;
}

function matWallPanel() {
  const w = MATWALL;
  if (!w) return "";
  const srcA = (s) => `<a class="ck-src" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a>`;
  const kv = (rows) => `<div class="ck-kv">${(rows || []).map(([l, v]) => `<div class="ck-kv-row"><span class="ck-kv-l">${esc(l)}</span><span class="ck-kv-v">${esc(v)}</span></div>`).join("")}</div>`;
  const ig = Math.max(0, Math.min(100, w.rated.igPct));
  const wl = w.wall;
  // Curated further-reading (refi / maturity-wall research), collapsed by default.
  const resBlock = (w.resources && w.resources.length) ? `
        <details class="mw-res">
          <summary>Further resources — refinancing &amp; maturity walls</summary>
          ${w.resources.map((g) => `<div class="mw-res-g"><p class="ck-sub mw-res-h"><strong>${esc(g.group)}</strong></p><ul class="mw-res-list">${g.items.map((it) => `<li><a href="${esc(it.url)}" target="_blank" rel="noopener noreferrer">${esc(it.name)}</a> <span class="muted small">— ${esc(it.use)}</span></li>`).join("")}</ul></div>`).join("")}
        </details>` : "";
  // Global rated per-year chart (S&P public investor factbook) — a single
  // Jan-2025-vintage series, labelled with its own asOf; rendered above the
  // fresher lev-fin wall, never merged with it (vintages stay separate).
  const rw = w.ratedWall;
  const ratedWallBlock = rw ? `
        <div class="mwc" data-wall="rated">
          <p class="ck-sub"><strong>Global rated maturities by year — all corporates</strong> · ${esc(rw.asOf)} · ${srcA(rw.src)}</p>
          ${wallChart(rw, "Global rated corporate maturities by year, $bn")}
          <p class="ck-sub mwc-note">${esc(rw.note)}</p>
        </div>` : "";
  const wallBlock = wl ? `
        <div class="mwc" data-wall="levfin">
          <p class="ck-sub"><strong>Maturity wall by year — US leveraged finance</strong> · ${srcA(wl.srcs.loans)}${wl.srcs.loansAlt ? ` · ${srcA(wl.srcs.loansAlt)}` : ""} · ${srcA(wl.srcs.hy)}</p>
          ${wallChart(wl)}
          <div class="mw-legend"><span><i class="mw-dot mwc-loan"></i>Lev loans</span><span><i class="mw-dot mwc-hy"></i>HY bonds</span></div>
          <p class="ck-sub mwc-note">${esc(wl.note)}</p>
        </div>` : "";
  return `
    <section class="ck-panel ck-span2">
      <header class="ck-h"><span>Wall of maturities — corporate credit</span><span class="ck-x">next 5Y</span></header>
      <div class="ck-body">
        ${ratedWallBlock}
        ${wallBlock}
        <div class="mw-cols">
        <div class="mw-col">
          <p class="ck-sub"><strong>${esc(w.rated.total)}</strong> rated debt due ${esc(w.rated.window)}${w.rated.asOf ? ` · ${esc(w.rated.asOf)}` : ""} · ${srcA(w.rated.src)}</p>
          <div class="mw-split" role="img" aria-label="Investment grade ${ig}% of the wall, speculative grade ${100 - ig}%">
            <span class="mw-seg mw-ig" style="width:${ig}%"></span><span class="mw-seg mw-sg" style="width:${100 - ig}%"></span>
          </div>
          <div class="mw-legend"><span><i class="mw-dot mw-ig"></i>IG ${ig}%</span><span><i class="mw-dot mw-sg"></i>SPEC ${100 - ig}%</span></div>
          <p class="ck-sub ck-sub2"><strong>Global refinancing</strong>${w.near.asOf ? ` · ${esc(w.near.asOf)}` : ""} · ${srcA(w.near.src)}${w.near.src2 ? ` · ${srcA(w.near.src2)}` : ""}</p>
          ${kv(w.near.rows)}
          ${w.near.note ? `<p class="ck-sub mwc-note">${esc(w.near.note)}</p>` : ""}
        </div>
        <div class="mw-col">
          <p class="ck-sub"><strong>Bonds due 2026–28</strong>${w.bonds.asOf ? ` · ${esc(w.bonds.asOf)}` : ""} · ${srcA(w.bonds.src)}</p>
          <div class="pw-bars">
            <div class="pw-row"><span class="pw-lbl">Investment grade</span><span class="pw-pct">${esc(String(w.bonds.igPct))}%</span><span class="pw-track"><span class="pw-fill mw-fill-ig" style="width:${esc(String(w.bonds.igPct))}%"></span></span></div>
            <div class="pw-row"><span class="pw-lbl">Non-investment grade</span><span class="pw-pct">${esc(String(w.bonds.nigPct))}%</span><span class="pw-track"><span class="pw-fill mw-fill-sg" style="width:${esc(String(w.bonds.nigPct))}%"></span></span></div>
          </div>
          ${kv(w.bonds.rows)}
          <p class="ck-sub ck-sub2"><strong>Private credit</strong> · ${srcA(w.privateCredit.src)}${w.privateCredit.src2 ? ` · ${srcA(w.privateCredit.src2)}` : ""}</p>
          ${kv(w.privateCredit.rows)}
          ${w.privateCredit.note ? `<p class="ck-sub mwc-note">${esc(w.privateCredit.note)}</p>` : ""}
        </div>
        </div>
        ${resBlock}
      </div>
    </section>`;
}

// The dense Macro cockpit shown behind the "Dashboard" chip: every read on one
// screen — economic indicators, the yield curve, the market-implied Fed path
// (FedWatch + dot plot), the rate outlook, and the two regime gauges (cycle &
// bubble) — each panel carrying a concise narrative and a link to its full tab.
export function macroDashPane() {
  const comp = bubbleComposite(), band = bubbleBand(comp);
  // Marquee valuation gauges (Shiller CAPE + Buffett Indicator) surfaced on the
  // cockpit Bubble panel — the headline read; full metric context is on #/bubble.
  const bubVal = ((BUBBLE.dimensions.find((d) => d.key === "valuation") || {}).metrics) || [];
  const fw = OUTLOOK.us.fedwatch, dp = OUTLOOK.us.dots;
  const clamp = (n) => Math.max(0, Math.min(100, Number(n) || 0));
  const fwBars = fw ? fw.outcomes.map((x) => `<div class="pw-row"><span class="pw-lbl">${esc(x.label)}</span><span class="pw-pct">${esc(String(x.pct))}%</span><span class="pw-track"><span class="pw-fill" style="width:${clamp(x.pct)}%"></span></span></div>`).join("") : "";
  const dpRows = dp ? dp.median.map((x) => `<tr><th scope="row">${esc(x.year)}</th><td>${esc(x.rate)}</td></tr>`).join("") : "";
  const dimCard = (d) => `<div class="ck-dim"><div class="ck-dim-h"><span class="ck-dim-n">${esc(d.label)}</span><span class="ck-dim-s">${d.score}<span class="ck-dim-max">/100</span></span></div></div>`;
  const cyc = (c) => String(c.shortStage || "").split("—")[0].trim();
  const stat = (l, v, m) => `<div class="ck-stat"><span class="ck-stat-l">${esc(l)}</span><span class="ck-stat-v">${esc(v)}</span>${m ? `<span class="ck-stat-m">${esc(m)}</span>` : ""}</div>`;
  // Sub-section menu: one section at a time (a fresh visit always starts on
  // the first chip; in-page re-renders keep the current pick via _dashSec).
  let sec = _dashSec;
  // Overview folds the former Economy + Rates + Regime sections into one read;
  // Earnings and Credit stay as their own tabs.
  const SECS = [["overview", "Overview"], ["earnings", "Earnings"], ["credit", "Credit"]];
  if (!SECS.some(([k]) => k === sec)) sec = "overview";
  const chip = ([k, l]) => `<button type="button" class="tchip${k === sec ? " is-on" : ""}" data-sec="${k}">${l}</button>`;
  const grp = (k) => `class="ck-group${sec !== k ? " ck-off" : ""}" data-sec="${k}"`;
  wireSecNav();

  return `<div class="ck-secbar"><div class="tchips" id="ck-secnav">${SECS.map(chip).join("")}</div></div>
  <div class="mac-cockpit ck-single" id="ck-cockpit">
    <div ${grp("overview")}>
    <div class="ck-ov">
    <div class="ck-ov-c ck-ov-mtx">
    <div class="ck-ov-h">Economic indicators</div>
    <section class="ck-panel">
      <header class="ck-h"><span>Key economic indicators</span><span class="ck-x">G7 · EU · IE · CN</span><a class="ck-more" href="#/chart">Chart</a></header>
      <div class="ck-inds" id="mac-ck-inds">${cockpitInds((MACRO_DATA && MACRO_DATA.series) || [])}</div>
    </section>
    </div>

    <div class="ck-ov-c ck-ov-rates">
    <div class="ck-ov-h">Rates &amp; policy</div>
    <section class="ck-panel ck-panel-yc">
      <header class="ck-h"><span>Yield curve</span><span class="ck-x" id="ck-yc-asof">gov · as of ${esc(_yc.asOf)}</span></header>
      <div class="ck-body" id="ck-yc-body">${ycBody()}</div>
    </section>

    <section class="ck-panel">
      <header class="ck-h"><span>Market-implied Fed path</span><a class="ck-more" href="#/policy">Policy →</a></header>
      <div class="ck-body">
        <div class="ck-fed2">
          <div class="ck-fed-col">
            <p class="ck-sub"><strong>CME FedWatch</strong> · ${esc(fw ? fw.meeting : "")} · as of ${esc(fw ? fw.asOf : "")} · <a class="ck-src" href="${esc(fw ? fw.href : "#")}" target="_blank" rel="noopener noreferrer">CME</a></p>
            <div class="pw-bars">${fwBars}</div>
          </div>
          <div class="ck-fed-col">
            <p class="ck-sub"><strong>Fed dot plot</strong> · ${esc(dp ? dp.meeting : "")} median · <a class="ck-src" href="${esc(dp ? dp.href : "#")}" target="_blank" rel="noopener noreferrer">FOMC</a></p>
            <table class="ck-dots"><tbody>${dpRows}</tbody></table>
          </div>
        </div>
      </div>
    </section>

    <section class="ck-panel ck-strip">
      <header class="ck-h"><span>Rate outlook</span><a class="ck-more" href="#/policy">Policy →</a></header>
      <div class="ck-body ck-stats2">
        ${stat("US", OUTLOOK.us.rate, `${OUTLOOK.us.stance || ""}${OUTLOOK.us.next ? " · next " + OUTLOOK.us.next : ""}`)}
        ${stat("UK", OUTLOOK.uk.rate, `${OUTLOOK.uk.stance || ""}${OUTLOOK.uk.next ? " · next " + OUTLOOK.uk.next : ""}`)}
      </div>
    </section>
    </div>

    <div class="ck-ov-c">
    <div class="ck-ov-h">Regime</div>
    <section class="ck-panel">
      <header class="ck-h"><span>Cycle — long-term debt cycle</span><a class="ck-more" href="#/cycle">Cycle →</a></header>
      <div class="ck-body">
        ${trackGauge(CYCLE_ZONES, [{ label: "US", pos: CYCLE.us.pos }, { label: "UK", pos: CYCLE.uk.pos }], "Long-term debt cycle position, 0 early to 100 crisis")}
        <div class="ck-stats">
          ${stat("US", `${CYCLE.us.pos}/100`, cyc(CYCLE.us))}
          ${stat("UK", `${CYCLE.uk.pos}/100`, cyc(CYCLE.uk))}
        </div>
      </div>
    </section>

    <section class="ck-panel">
      <header class="ck-h"><span>Bubble risk</span><span class="ck-x">${esc(BUBBLE.market)} · ${esc(band)} · ${comp}/100</span><a class="ck-more" href="#/bubble">Bubble →</a></header>
      <div class="ck-body">
        ${trackGauge(BUBBLE_ZONES, [{ label: band, pos: comp }], "US equity bubble-risk score, 0 low to 100 extreme")}
        ${bubVal.length ? `<div class="ck-stats">${bubVal.map(([l, v, sub]) => stat(l, v, "")).join("")}</div>` : ""}
      </div>
    </section>
    </div>
    </div>
    </div>

    <div ${grp("earnings")}>
    ${earningsPanel()}
    </div>

    <div ${grp("credit")}>
    ${matWallPanel()}
    </div>
  </div>`;
}

// Dashboard sub-section menu (delegated, wired once): chip click filters the
// cockpit to that section, All restores everything; choice persists.
let _secWired = false;
function wireSecNav() {
  if (_secWired) return; _secWired = true;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("#ck-secnav .tchip");
    if (!b) return;
    const sec = b.getAttribute("data-sec") || "overview";
    _dashSec = sec;
    document.querySelectorAll("#ck-secnav .tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    document.querySelectorAll("#ck-cockpit .ck-group").forEach((g) => g.classList.toggle("ck-off", g.getAttribute("data-sec") !== sec));
    const ck = document.getElementById("ck-cockpit");
    if (ck) ck.classList.toggle("ck-single", sec !== "all");
  });
}
