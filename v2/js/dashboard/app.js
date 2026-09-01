// =============================================================================
// v2/js/dashboard/app.js — the Dashboard tab: three OVERVIEW sub-tabs
// (Macro · Equities · Credit), each a purpose-built "hybrid" layout modelled on
// how the data pros present this material — TradingEconomics indicator grids,
// Finviz sector heatmaps, Bloomberg stat-strips + movers, Refinitiv yield/credit
// curves, Pitchbook league tables. The full desk content is EMBEDDED here (news
// wires, indicator tables, curves) rather than linked out. Curated seed data
// comes from dashboard/js/data.js; live figures (index closes via /api/eqindices,
// credit spreads via /api/rates) override at runtime; macro reuses the macro
// desk's own OUTLOOK/CYCLE/BUBBLE/YIELD_CURVE/NEWS/MATWALL so there is ONE source
// of truth. Every figure keeps a real outbound source link. mount → {enter,leave}.
// =============================================================================
import { esc, MONTHS, byDateDesc } from "/util.js?v=20260818-1";
import { fmtDay as fmtDate } from "/feed.js?v=20260808-1";
import { EQ_INDICES, EQ_SECTORS, EQ_VALUATION, EQ_VOL, EQ_IPO, CR_STRESS, WORLD_INDICES, GOVT_YIELDS, GOVT_YIELD_CHG, PRIVATE_CREDIT } from "/dashboard/js/data.js";
import { OUTLOOK, CYCLE, MARKET_CYCLE, BUBBLE, MATWALL, YIELD_CURVE, NEWS, EARNINGS, IND_KEYMOMENTS } from "/macro/js/content.js";
import { deals, intel, HEDGE_FUNDS, HF_13F } from "/credit/js/data.js";
import { SECTOR_FLOWS } from "/allocations.js";
import { items as LGL_ITEMS, cases as LGL_CASES, practiceAreas as LGL_AREAS, areaById as LGL_AREA_BY_ID, firmById as LGL_FIRM_BY_ID, caseSummaries as LGL_CASE_SUMMARIES } from "/legal/js/data.js";

// Third tuple element is an OPTIONAL short label shown on the narrow iPhone tab
// bar (≤760px) where the full two-word labels wrap to two lines; desktop (the
// fixed-viewport terminal) keeps the full label.
const SUBTABS = [["macro", "Macro"], ["equities", "Equities"], ["fixed-income", "Fixed Income", "Fixed"], ["credit", "Credit"], ["hedge-funds", "Hedge Funds", "Hedge"], ["legal", "Legal"]];
const pct1 = (n) => (n == null ? "—" : (n > 0 ? "+" : "") + n.toFixed(1) + "%");
const upcls = (n) => (n == null ? "" : n > 0 ? "up" : n < 0 ? "down" : "");
const asOf = (d) => (d ? `<span class="dsh-asof">as of ${esc(d)}</span>` : "");
const srcLink = (u, label) => (u ? ` <a class="dsh-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer" title="${esc(label || "Source")}">src</a>` : "");
const stripTags = (s) => String(s || "").replace(/<[^>]+>/g, "");
// Search normaliser: lowercase and drop apostrophes so "director's" / "directors'"
// / "directors" all collapse to the same token. Used to build each legal item's
// search haystack and to tokenise the query (word-by-word AND match).
const _norm = (s) => String(s || "").toLowerCase().replace(/['’‘]/g, "");

export function mount(host, ctx) {
  let pane = "macro";
  let _gyLive = null;                    // live yields overlay (/api/govyields), keyed by country
  let _ycLive = null;                    // live US/UK yield curve overlay (/api/yield-curve)
  let _yldTenor = "y10";                 // tenor selected in the yield-change heatmap dropdown
  let _legalQuery = "";                 // Legal database keyword (persist across re-renders)
  const _legalAreas = new Set();        // practice areas the search is limited to (empty = all)
  const _legalTypes = new Set();        // item types the search is limited to (empty = all): "alert" | "case"

  // ---- Equities -----------------------------------------------------------
  function idxTile(x, live) {
    const l = live && live[x.id];
    const lv = l && l.value != null ? l.value : x.level;
    const dp = l ? l.changePct : null;
    const sub = dp != null ? `<span class="dsh-idx-yt ${upcls(dp)}">${pct1(dp)} today</span>`
      : x.ytd != null ? `<span class="dsh-idx-yt ${upcls(x.ytd)}">${pct1(x.ytd)} YTD</span>`
        : `<span class="dsh-idx-yt"></span>`;
    return `<a class="dsh-idx" data-idx="${esc(x.id)}" href="${esc(x.source)}" target="_blank" rel="noopener noreferrer" title="${esc(x.name)} — source">`
      + `<span class="dsh-idx-nm">${esc(x.name)}</span>`
      + `<span class="dsh-idx-lv">${lv != null ? esc(Number(lv).toLocaleString("en-GB", { maximumFractionDigits: 2 })) : "—"}</span>`
      + sub + `</a>`;
  }
  function indexStripHTML(live) { return `<div class="dsh-strip" id="dsh-strip">${EQ_INDICES.map((x) => idxTile(x, live)).join("")}</div>`; }
  async function loadIndices() {
    const strip = host.querySelector("#dsh-strip");
    if (!strip) return;
    try {
      const r = await fetch("/api/eqindices", { headers: { accept: "application/json" } });
      const d = r.ok ? await r.json() : null;
      const arr = (d && d.indices) || [];
      if (!arr.length) return;
      const live = {}; arr.forEach((x) => { if (x && x.id) live[x.id] = x; });
      strip.outerHTML = indexStripHTML(live);
    } catch { /* keep the sourced seed strip */ }
  }
  function sectorBarsHTML() {
    const rows = EQ_SECTORS.rows.filter((r) => r.ytd != null).sort((a, b) => b.ytd - a.ytd);
    const max = Math.max(1, ...rows.map((r) => Math.abs(r.ytd)));
    const bar = (r) => {
      const w = (Math.abs(r.ytd) / max) * 50;
      const pos = r.ytd >= 0;
      return `<div class="dsh-sec"><span class="dsh-sec-nm">${esc(r.name)}</span>`
        + `<span class="dsh-sec-track"><span class="dsh-sec-bar ${pos ? "up" : "down"}" style="width:${w.toFixed(1)}%;${pos ? "left:50%" : `right:50%;left:auto`}"></span></span>`
        + `<span class="dsh-sec-v ${upcls(r.ytd)}">${pct1(r.ytd)}</span></div>`;
    };
    return `<div class="dsh-sectors" data-view="bars">${rows.map(bar).join("")}</div>`;
  }
  function volBand(level) {
    if (level == null) return ["—", ""];
    if (level < 15) return ["Low", "up"];
    if (level < 20) return ["Light", "up"];
    if (level < 28) return ["Neutral", ""];
    if (level < 40) return ["Elevated", "down"];
    return ["Panic", "down"];
  }
  function valVolHTML() {
    const val = EQ_VALUATION.map((v) => `<div class="dsh-kv"><span class="dsh-kv-k">${esc(v.name)} fwd P/E</span><span class="dsh-kv-v">${v.fwdPE != null ? v.fwdPE.toFixed(1) + "×" : "—"}${srcLink(v.source, v.name + " valuation source")}</span></div>`).join("");
    const vol = EQ_VOL.map((v) => { const [b, c] = volBand(v.level); return `<div class="dsh-kv"><span class="dsh-kv-k">${esc(v.name)}</span><span class="dsh-kv-v ${c}">${v.level != null ? v.level.toFixed(1) : "—"} <span class="dsh-band ${c}">${b}</span>${srcLink(v.source, v.name + " source")}</span></div>`; }).join("");
    return `<div class="dsh-kvgrid">${val}${vol}</div>`;
  }
  function ipoHTML() {
    const row = (x) => `<tr><td class="dsh-nm">${esc(x.company)}</td><td>${esc(x.exchange)}</td><td class="dsh-r">${esc(x.size)}</td><td>${esc(x.timing)}</td><td><span class="dsh-tag dsh-tag-${(x.status || "").toLowerCase()}">${esc(x.status)}</span>${srcLink(x.source, x.company + " source")}</td></tr>`;
    return `<table class="dsh-tbl"><thead><tr><th>Company</th><th>Listing</th><th class="dsh-r">Size</th><th>Timing</th><th>Status</th></tr></thead><tbody>${EQ_IPO.map(row).join("")}</tbody></table>`;
  }
  // Two-week earnings calendar from the macro desk's EARNINGS structure
  // (weeks → days → rows): THIS week's slate first (forecast, not yet reported),
  // then LAST week's results. Columns are FORECAST vs ACTUAL EPS — the default
  // metric — and each release carries a note line beneath it: the "why" (result
  // colour, guidance, price reaction), plus a metric tag when the row tracks
  // something other than EPS (banks → pre-tax profit, Tesla → deliveries) so the
  // Fct/Act cells and their unit stay legible. An upcoming row shows its preview
  // note and "—" in Act until the company reports; the actual fills in on the next
  // refresh. Tickers link to Yahoo; the card header carries the week-ahead source.
  // Earnings calendar as a legible stacked list (was an over-stuffed 6-column
  // table): a week header, then one card per release — ticker · company · date ·
  // session on top, sector beneath, a forecast→actual line for each measure (EPS
  // and Revenue, or a key metric like a bank's pre-tax profit when there's no EPS
  // forecast), a colour-coded price reaction, and the "why" note. Tickers link to
  // Yahoo; upcoming releases read "awaited" until they report.
  function earningsHTML() {
    const weeks = (EARNINGS && EARNINGS.weeks) || [];
    if (!weeks.length) return "";
    const yahoo = (t) => `https://finance.yahoo.com/quote/${encodeURIComponent(t)}`;
    // A key metric (km) replaces EPS when the row has no EPS forecast but tracks
    // something else (banks → pre-tax profit) — shown with a metric tag.
    const km = (r) => (!r.estEps && r.km && (r.km.est || r.km.act)) ? r.km : null;
    const pxCls = (p) => { const s = String(p || "").trim(); return /^[+▲↑]/.test(s) ? "up" : /^[-–▼↓]/.test(s) ? "down" : ""; };
    // One forecast → actual measure. `tag` renders the metric name as a chip (km);
    // otherwise a light inline label (EPS / Rev).
    const measure = (label, est, act, tag) => {
      if (est == null && act == null) return "";
      const lab = tag ? `<span class="dsh-earn-metric">${esc(label)}</span>` : `<i class="dsh-earn-ml">${esc(label)}</i>`;
      const a = act ? `<b class="dsh-earn-act">${esc(act)}</b>` : `<span class="dsh-earn-await">awaited</span>`;
      return `<span class="dsh-earn-m">${lab} <span class="dsh-earn-fct">${est ? esc(est) : "—"}</span> <span class="dsh-earn-arw">·</span> ${a}</span>`;
    };
    const rel = (r, date) => {
      const k = km(r);
      const measures = k
        ? measure(k.l || "Metric", k.est, k.act, true)
        : measure("EPS", r.estEps, r.actEps) + measure("Rev", r.estRev, r.actRev);
      const px = r.px ? `<span class="dsh-earn-px ${pxCls(r.px)}">${esc(r.px)}</span>` : "";
      const when = r.when ? `<span class="dsh-earn-when">${esc(r.when)}</span>` : "";
      return `<div class="dsh-earn-rel">`
        + `<div class="dsh-earn-hd"><a class="dsh-earn-tk" href="${yahoo(r.t)}" target="_blank" rel="noopener noreferrer">${esc(r.t)}</a>`
        + `<span class="dsh-earn-co">${esc(r.n || "")}</span>${when}<span class="dsh-earn-dt">${esc(fmtDate(date))}</span></div>`
        + (r.tag ? `<div class="dsh-earn-tag">${esc(r.tag)}</div>` : "")
        + `<div class="dsh-earn-ms">${measures}${px}</div>`
        + (r.note ? `<div class="dsh-earn-note">${esc(r.note)}</div>` : "")
        + `</div>`;
    };
    const wk = (w) => `<div class="dsh-earn-wk">${esc(w.label || "")}</div>`
      + (w.days || []).map((day) => (day.rows || []).map((r) => rel(r, day.date)).join("")).join("");
    return `<div class="dsh-earn">${weeks.map(wk).join("")}</div>`;
  }
  const earnSrc = (EARNINGS && EARNINGS.srcs && EARNINGS.srcs[0] && EARNINGS.srcs[0].url) || "";
  // Key moments — a plain-language "why it moved" line for each index that carries
  // a sourced explanation (EQ_INDICES[].keyMoment). Grounded only: an index with no
  // sourced move renders nothing, and the whole card is omitted if none qualify.
  function keyMomentsHTML() {
    const items = EQ_INDICES.filter((x) => x.keyMoment && x.keyMoment.text);
    if (!items.length) return "";
    const row = (x) => `<div class="dsh-km"><span class="dsh-km-t">${esc(x.name)}</span>`
      + `<span class="dsh-km-x">${esc(x.keyMoment.text)}${srcLink(x.keyMoment.src, (x.keyMoment.srcName || "source") + " — source")}</span></div>`;
    return `<section class="dsh-card dsh-span"><h3 class="dsh-h">Key moments <span class="dsh-n">why it moved</span></h3>${items.map(row).join("")}</section>`;
  }
  // ETF flows heatmap — net fund flows across the Top Movers cross-asset ETF set
  // across windows (SECTOR_FLOWS, allocations.js). Diverging colour normalised
  // PER COLUMN so each window's leaders/laggards read despite the scale gap
  // between 1W and 1Y. Null cell → blank (grounded only, never fabricated).
  function fmtFlow(m) {
    if (m == null) return "—";
    const a = Math.abs(m), sign = m < 0 ? "-" : "";
    return a >= 1000 ? `${sign}$${(a / 1000).toFixed(a >= 9950 ? 0 : 1)}B` : `${sign}$${Math.round(a)}M`;
  }
  function sectorFlowsHTML() {
    const F = SECTOR_FLOWS;
    if (!F || !(F.sectors || []).length) return "";
    const wins = F.windows || [];
    const maxAbs = {};
    wins.forEach(([k]) => { maxAbs[k] = Math.max(1, ...F.sectors.map((s) => (s[k] == null ? 0 : Math.abs(s[k])))); });
    const heat = (v, max) => {
      if (v == null || !max) return "";
      const a = (Math.abs(v) / max) * 0.62 + 0.10;
      return ` style="background:rgba(${v >= 0 ? "63,192,141" : "242,109,132"},${a.toFixed(3)})"`;
    };
    const head = `<tr><th>Sector</th>${wins.map(([, l]) => `<th class="dsh-r">${esc(l)}</th>`).join("")}</tr>`;
    const row = (s) => {
      const cells = wins.map(([k, l]) => {
        const v = s[k];
        if (v == null) return `<td class="dsh-fl-na">·</td>`;
        return `<td class="dsh-fl"${heat(v, maxAbs[k])} title="${esc(s.t)} · ${esc(l)}: ${v >= 0 ? "+" : ""}${esc(fmtFlow(v))} net flow">${esc(fmtFlow(v))}</td>`;
      }).join("");
      return `<tr><td class="dsh-nm"><a href="${esc(s.src)}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a> <span class="dsh-fl-t">${esc(s.t)}</span></td>${cells}</tr>`;
    };
    return `<table class="dsh-tbl dsh-fl-tbl"><thead>${head}</thead><tbody>${F.sectors.map(row).join("")}</tbody></table>`
      + `<p class="dsh-fl-note"><span class="dsh-fl-pos">green = inflow</span> · <span class="dsh-fl-neg">red = outflow</span>, shaded within each window (net ${esc(F.unit || "$M")}). Source: <a href="${esc(F.source)}" target="_blank" rel="noopener noreferrer">ETF Database</a>.</p>`;
  }
  // Major indices by jurisdiction — LOCAL index points (not ETFs), as a heat-shaded
  // table in the ETF-flows style with the SAME trailing windows (1W/1M/3M/6M/1Y):
  // one row per index under a region section header, each window cell the index's
  // price return over that period, shaded green (up) / red (down) normalised per
  // column. The latest index level (points) rides in the label cell. Snapshot from
  // WORLD_INDICES (dashboard/js/data.js), every value sourced + dated.
  // `live` (from /api/worldindices, keyed by index name) refreshes the level.
  const IDX_WINS = [["w1", "1W"], ["m1", "1M"], ["m3", "3M"], ["m6", "6M"], ["y1", "1Y"]];
  function worldIndicesHeatHTML(live) {
    const W = WORLD_INDICES;
    if (!W || !(W.regions || []).length) return "";
    const lvOf = (r) => { const l = live && live[r.name]; return (l && l.value != null) ? l.value : r.level; };
    const valK = (r, k) => { const l = live && live[r.name]; return (l && l[k] != null) ? l[k] : r[k]; };
    const maxAbs = {};
    IDX_WINS.forEach(([k]) => { maxAbs[k] = Math.max(1, ...W.regions.flatMap((g) => (g.rows || []).map((r) => { const v = valK(r, k); return v == null ? 0 : Math.abs(v); }))); });
    const heat = (v, k) => { if (v == null) return ""; const a = (Math.abs(v) / maxAbs[k]) * 0.62 + 0.10; return ` style="background:rgba(${v >= 0 ? "63,192,141" : "242,109,132"},${a.toFixed(3)})"`; };
    const fmtLv = (v) => (v == null ? "" : Number(v).toLocaleString("en-GB", { maximumFractionDigits: 2 }));
    const cell = (r, k, l) => { const v = valK(r, k); return v == null ? `<td class="dsh-fl-na">·</td>` : `<td class="dsh-fl"${heat(v, k)} title="${esc(r.name)} · ${esc(l)}: ${pct1(v)}">${pct1(v)}</td>`; };
    // Regions are separated by a thin grey rule (a top border on the first row of
    // each new region), not a labelled band.
    const row = (r, brk) => {
      const nm = r.source ? `<a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a>` : esc(r.name);
      const lv = lvOf(r);
      return `<tr${brk ? ' class="dsh-secbreak"' : ""}><td class="dsh-nm">${nm}${lv != null ? ` <span class="dsh-fl-t">${fmtLv(lv)}</span>` : ""}</td>${IDX_WINS.map(([k, l]) => cell(r, k, l)).join("")}</tr>`;
    };
    const group = (g, i) => (g.rows || []).map((r, ri) => row(r, i > 0 && ri === 0)).join("");
    return `<table class="dsh-tbl dsh-fl-tbl"><thead><tr><th>Index</th>${IDX_WINS.map(([, l]) => `<th class="dsh-r">${l}</th>`).join("")}</tr></thead>`
      + `<tbody>${W.regions.map(group).join("")}</tbody></table>`
      + `<p class="dsh-fl-note"><span class="dsh-fl-pos">green = up</span> · <span class="dsh-fl-neg">red = down</span>, price return shaded within each window; the grey figure is the latest index level (points). Each index links its source.</p>`;
  }
  async function loadWorldIndices() {
    const box = host.querySelector("#dsh-wi-box");
    if (!box) return;
    try {
      const r = await fetch("/api/worldindices", { headers: { accept: "application/json" } });
      const d = r.ok ? await r.json() : null;
      const arr = (d && d.indices) || [];
      if (!arr.length) return;
      const live = {}; arr.forEach((x) => { if (x && x.name) live[x.name] = x; });
      box.innerHTML = worldIndicesHeatHTML(live);
    } catch { /* keep the sourced snapshot */ }
  }
  function equitiesHTML() {
    // Terminal (option 4): Key moments strip, then a three-column workspace that
    // fills the viewport — each column scrolls internally, minimal page scroll.
    return `<div class="dsh-pane dsh-term">
      <div class="dsh-span dsh-term-top">
        ${keyMomentsHTML()}
        <section class="dsh-card"><h3 class="dsh-h">S&amp;P 500 sectors — YTD ${asOf(EQ_SECTORS.asOf)}${srcLink(EQ_SECTORS.source, "S&P sector performance")}</h3>${sectorBarsHTML()}</section>
      </div>
      <div class="dsh-term-ws">
        <div class="dsh-term-col">
          <section class="dsh-card"><h3 class="dsh-h">World indices — major benchmarks by jurisdiction <span class="dsh-live">live</span></h3><div class="dsh-scroll" id="dsh-wi-box">${worldIndicesHeatHTML()}</div></section>
        </div>
        <div class="dsh-term-col">
          <section class="dsh-card"><h3 class="dsh-h">ETF flows — net fund flows ${asOf(SECTOR_FLOWS.asOf)}</h3><div class="dsh-scroll" id="dsh-flows-box">${sectorFlowsHTML()}</div></section>
          <section class="dsh-card"><h3 class="dsh-h">Valuation &amp; volatility</h3>${valVolHTML()}</section>
        </div>
        <div class="dsh-term-col">
          <section class="dsh-card"><h3 class="dsh-h">Earnings calendar${srcLink(earnSrc, "Earnings week-ahead source")}</h3><div class="dsh-scroll">${earningsHTML()}</div></section>
          <section class="dsh-card"><h3 class="dsh-h">IPO / ECM pipeline</h3><div class="dsh-scroll">${ipoHTML()}</div></section>
        </div>
      </div>
    </div>`;
  }

  // ---- Credit -------------------------------------------------------------
  // Pitchbook-style sortable Stress league table (default by prominence = source
  // order). Click a header to sort; each row's note links to its cited article.
  // Parse a debt string ("€15.5bn net", "~£19bn", "$25bn bonds") to a comparable
  // magnitude (currency-agnostic) so the table can rank by size of debt.
  const debtNum = (s) => {
    const m = String(s || "").replace(/,/g, "").match(/([\d.]+)\s*(tn|bn|m|k)?/i);
    if (!m) return 0;
    const n = parseFloat(m[1]) || 0;
    const u = (m[2] || "bn").toLowerCase();
    return n * (u === "tn" ? 1e12 : u === "bn" ? 1e9 : u === "m" ? 1e6 : u === "k" ? 1e3 : 1e9);
  };
  // Default: largest debt first (item h). Header clicks re-sort; the "debt" column
  // sorts numerically, everything else alphabetically.
  let _stressSort = { key: "debt", dir: -1 };
  function stressRows() {
    const rows = CR_STRESS.map((s, i) => ({ ...s, _i: i }));
    const k = _stressSort.key;
    if (k === "debt") rows.sort((a, b) => (debtNum(a.debt) - debtNum(b.debt)) * _stressSort.dir);
    else if (k) rows.sort((a, b) => String(a[k] || "").localeCompare(String(b[k] || "")) * _stressSort.dir);
    return rows;
  }
  // Compact stacked cards (not a 7-column table, which on a phone scrolls
  // sideways and — because the wrapping Note cell sets the row height — leaves
  // the other columns floating in tall, half-empty rows). Each card packs the
  // debtor + debt on one line, the sector/HQ/status/latest on the next, and the
  // note beneath; a small chip bar keeps the by-debt (and A–Z) sort.
  function stressHTML() {
    const chip = (k, l) => `<button type="button" class="dsh-sortchip${_stressSort.key === k ? " is-on" : ""}" data-sort="${k}">${l}${_stressSort.key === k ? (_stressSort.dir > 0 ? " ▲" : " ▼") : ""}</button>`;
    const card = (s) => `<div class="dsh-stress">`
      + `<div class="dsh-stress-h"><span class="dsh-nm">${esc(s.name)}</span><span class="dsh-stress-debt">${esc(s.debt)}</span></div>`
      + `<div class="dsh-stress-m">${esc(s.sector)} · ${esc(s.hq)} · <span class="dsh-tag dsh-tag-stress">${esc(s.status)}</span>${s.latest ? " · " + esc(s.latest) : ""}</div>`
      + `<div class="dsh-stress-n">${esc(s.note)}${srcLink(s.source, s.name + " source")}</div></div>`;
    return `<div class="dsh-stresswrap">`
      + `<div class="dsh-sortbar"><span class="dsh-sortlbl">Sort by</span>${chip("debt", "Debt")}${chip("name", "Debtor")}${chip("sector", "Sector")}</div>`
      + `<div class="dsh-stresslist" id="dsh-stress-body">${stressRows().map(card).join("")}</div></div>`;
  }
  function maturityHTML() {
    const w = MATWALL && MATWALL.rated, wall = MATWALL && MATWALL.ratedWall;
    if (!w) return "";
    const summary = `<div class="dsh-kvgrid">
      <div class="dsh-kv"><span class="dsh-kv-k">Rated corporate debt maturing</span><span class="dsh-kv-v">${esc(w.total)} <span class="dsh-band">${esc(w.window)}</span></span></div>
      <div class="dsh-kv"><span class="dsh-kv-k">Investment-grade share</span><span class="dsh-kv-v">${esc(String(w.igPct))}%${srcLink(w.src && w.src.url, "S&P maturity data")}</span></div>
    </div>`;
    let ladder = "";
    if (wall && Array.isArray(wall.buckets) && wall.buckets.length) {
      const max = wall.max || Math.max(...wall.buckets.map((b) => b.amt));
      const col = (b) => `<div class="dsh-ladder-col"><span class="dsh-ladder-v">$${(b.amt / 1000).toFixed(1)}tn</span>`
        + `<span class="dsh-ladder-bar" style="height:${Math.max(2, Math.round((b.amt / max) * 100))}%"></span>`
        + `<span class="dsh-ladder-y">${esc(b.y)}</span></div>`;
      ladder = `<div class="dsh-ladder" role="img" aria-label="Maturity wall by year">${wall.buckets.map(col).join("")}</div>`
        + `<div class="dsh-ladder-cap">Face value maturing by year · ${esc(wall.asOf || "")}${srcLink(wall.src && wall.src.url, "S&P factbook")}</div>`;
    }
    return summary + ladder;
  }
  // Embedded credit news — the desk's freshest sourced deals/intel, linked out.
  function creditNewsHTML() {
    const items = [...(deals || []), ...(intel || [])]
      .filter((x) => x && x.date && (x.headline || x.title) && (x.sourceUrl || x.url))
      .sort(byDateDesc)
      .slice(0, 12);
    if (!items.length) return "";
    const row = (x) => { const u = x.sourceUrl || x.url; return `<li class="dsh-news-i"><span class="dsh-news-d">${esc(fmtDate(x.date))}</span>`
      + `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(x.headline || x.title)}</a>` + `</li>`; };
    return `<ul class="dsh-news">${items.map(row).join("")}</ul>`;
  }
  // Private credit pulse — Fitch's Private Credit Default Rate + market context, a
  // sourced KV grid (PRIVATE_CREDIT). Every metric links its source.
  function privateCreditHTML() {
    const P = PRIVATE_CREDIT;
    if (!P || !(P.metrics || []).length) return "";
    const kv = (x) => `<div class="dsh-kv"><span class="dsh-kv-k">${esc(x.k)}</span>`
      + `<span class="dsh-kv-v">${esc(x.v)}${x.sub ? ` <span class="dsh-band">${esc(x.sub)}</span>` : ""}${srcLink(x.src, (x.srcName || "source") + " — source")}</span></div>`;
    return (P.headline ? `<p class="dsh-fl-note">${esc(P.headline)}</p>` : "")
      + `<div class="dsh-kvgrid">${P.metrics.map(kv).join("")}</div>`;
  }
  function creditHTML() {
    // Terminal (option 4): private credit + spreads · maturity + stress · a
    // credit-wire rail that scrolls internally, filling the viewport.
    return `<div class="dsh-pane dsh-term">
      <div class="dsh-term-ws">
        <div class="dsh-term-col">
          <section class="dsh-card"><h3 class="dsh-h">Private credit <span class="dsh-n">Fitch PCDR &amp; market pulse</span> ${asOf(PRIVATE_CREDIT && PRIVATE_CREDIT.asOf)}</h3>${privateCreditHTML()}</section>
          <section class="dsh-card"><h3 class="dsh-h">Credit spreads — ICE BofA OAS <span class="dsh-live">live</span></h3><div id="dsh-spreads" class="dsh-spreads"><p class="dsh-load">Loading live spreads…</p></div></section>
        </div>
        <div class="dsh-term-col">
          <section class="dsh-card"><h3 class="dsh-h">Maturity wall</h3>${maturityHTML()}</section>
          <section class="dsh-card"><h3 class="dsh-h">Stress — situations in focus <span class="dsh-n">(${CR_STRESS.length}) · by debt</span></h3>${stressHTML()}</section>
        </div>
        <div class="dsh-term-col dsh-term-rail">
          <section class="dsh-card"><h3 class="dsh-h">Credit wire — latest deals &amp; intel</h3>${creditNewsHTML()}</section>
        </div>
      </div>
    </div>`;
  }
  async function loadSpreads() {
    const el = host.querySelector("#dsh-spreads");
    if (!el) return;
    try {
      const r = await fetch("/api/rates", { headers: { accept: "application/json" } });
      const d = r.ok ? await r.json() : null;
      const rows = ((d && (d.rates || d.series || d)) || []).filter((x) => x && /oas/i.test(x.label || ""));
      if (!rows.length) { el.innerHTML = `<p class="dsh-load">Live spreads unavailable — <a href="https://fred.stlouisfed.org/series/BAMLH0A0HYM2" target="_blank" rel="noopener noreferrer">FRED ICE BofA OAS</a></p>`; return; }
      el.innerHTML = rows.map((x) => `<div class="dsh-spread"><span class="dsh-spread-nm">${esc(String(x.label).replace(/\s*OAS$/i, ""))}</span>`
        + `<span class="dsh-spread-v">${x.value != null ? esc(String(x.value)) : "—"}<span class="dsh-spread-u">${esc(x.unit || "bp")}</span></span>`
        + `${srcLink(x.href, "FRED")}</div>`).join("");
    } catch { el.innerHTML = `<p class="dsh-load">Live spreads unavailable right now.</p>`; }
  }

  // ---- Macro --------------------------------------------------------------
  // Regime pills: policy stance / cycle stage / bubble read as coloured chips —
  // a quick top-of-page read, each drawn from the macro desk's own fields.
  function bubbleRead() {
    const dims = (BUBBLE && Array.isArray(BUBBLE.dimensions)) ? BUBBLE.dimensions : [];
    if (!dims.length) return "—";
    const wsum = dims.reduce((s, d) => s + (d.weight || 0), 0) || 1;
    const score = Math.round(dims.reduce((s, d) => s + (d.score || 0) * (d.weight || 0), 0) / wsum);
    const band = score >= 80 ? "Bubble-like" : score >= 65 ? "Elevated / frothy" : score >= 50 ? "Stretched" : "Contained";
    return `${band} · ${score}/100`;
  }
  function regimePillsHTML() {
    const pill = (label, val, cls) => `<span class="dsh-pill ${cls || ""}"><span class="dsh-pill-k">${esc(label)}</span><span class="dsh-pill-v">${esc(val)}</span></span>`;
    const usStance = (OUTLOOK && OUTLOOK.us && OUTLOOK.us.stance) || "—";
    const ukStance = (OUTLOOK && OUTLOOK.uk && OUTLOOK.uk.stance) || "—";
    const cyc = (CYCLE && CYCLE.us && CYCLE.us.shortStage) || "—";
    return `<div class="dsh-pills">`
      + pill("US · Fed", stripTags(usStance))
      + pill("UK · BoE", stripTags(ukStance))
      + pill("Cycle", stripTags(String(cyc)))
      + pill("Equity bubble", bubbleRead())
      + `</div>`;
  }
  // Fed path — the dot-plot median SEP projections and the CME FedWatch odds for
  // the next meeting, side by side. Both link to their primary source.
  function fedHTML() {
    const d = OUTLOOK && OUTLOOK.us && OUTLOOK.us.dots;
    const fw = OUTLOOK && OUTLOOK.us && OUTLOOK.us.fedwatch;
    let dots = "";
    if (d && Array.isArray(d.median) && d.median.length) {
      dots = `<div class="dsh-fed-blk"><div class="dsh-fed-h">Dot plot — median projection <span class="dsh-mut">${esc(d.meeting || "")}</span>${srcLink(d.href, "FOMC projections")}</div>`
        + `<div class="dsh-kvgrid">${d.median.map((x) => `<div class="dsh-kv"><span class="dsh-kv-k">${esc(x.year)}</span><span class="dsh-kv-v">${esc(x.rate)}</span></div>`).join("")}</div></div>`;
    }
    let watch = "";
    if (fw && Array.isArray(fw.outcomes) && fw.outcomes.length) {
      const bar = (o) => `<div class="dsh-fw"><span class="dsh-fw-l">${esc(o.label)}</span><span class="dsh-fw-track"><span class="dsh-fw-bar" style="width:${Math.max(2, Math.min(100, o.pct || 0))}%"></span></span><span class="dsh-fw-p">${o.pct != null ? o.pct + "%" : "—"}</span></div>`;
      watch = `<div class="dsh-fed-blk"><div class="dsh-fed-h">CME FedWatch — ${esc(fw.meeting || "")} <span class="dsh-mut">as of ${esc(fw.asOf || "")}</span>${srcLink(fw.href, "CME FedWatch")}</div>`
        + `${fw.outcomes.map(bar).join("")}</div>`;
    }
    if (!dots && !watch) return "";
    return `<div class="dsh-fed">${watch}${dots}</div>`;
  }
  // BoE path — same two-block format as the Fed box: the market-implied SONIA/OIS
  // odds for the next decision (bars, like CME FedWatch) and the MPC vote splits
  // (a kv grid, standing in for the dot plot the UK doesn't publish).
  function boeHTML() {
    const s = OUTLOOK && OUTLOOK.uk && OUTLOOK.uk.sonia;
    const v = OUTLOOK && OUTLOOK.uk && OUTLOOK.uk.votes;
    let sonia = "";
    if (s && Array.isArray(s.odds) && s.odds.length) {
      const bar = (o) => `<div class="dsh-fw"><span class="dsh-fw-l">${esc(o.label)}</span><span class="dsh-fw-track"><span class="dsh-fw-bar" style="width:${Math.max(2, Math.min(100, o.pct || 0))}%"></span></span><span class="dsh-fw-p">${o.pct != null ? o.pct + "%" : "—"}</span></div>`;
      sonia = `<div class="dsh-fed-blk"><div class="dsh-fed-h">SONIA / OIS — ${esc(s.meeting || "")} <span class="dsh-mut">as of ${esc(s.asOf || "")}</span>${srcLink(s.href, "SONIA/OIS-implied")}</div>`
        + `${s.odds.map(bar).join("")}</div>`;
    }
    let votes = "";
    if (v && Array.isArray(v.history) && v.history.length) {
      const row = (r) => `<div class="dsh-kv" title="${esc(stripTags(r.decision || ""))}${r.dissent ? " · " + esc(r.dissent) : " · unanimous"}"><span class="dsh-kv-k">${esc(r.date)}</span><span class="dsh-kv-v">${esc(r.tally)}${r.lean ? ` <span class="dsh-band">${esc(r.lean)}</span>` : ""}</span></div>`;
      votes = `<div class="dsh-fed-blk"><div class="dsh-fed-h">MPC vote splits <span class="dsh-mut">${esc(v.latestMeeting || "")}</span>${srcLink(v.href, "BoE minutes")}</div>`
        + `<div class="dsh-kvgrid">${v.history.map(row).join("")}</div></div>`;
    }
    if (!sonia && !votes) return "";
    return `<div class="dsh-fed">${sonia}${votes}</div>`;
  }
  // Rate-outlook grid (TradingEconomics-style): current rate, next meeting, stance,
  // one-line read per economy, each with a source link.
  function rateOutlookHTML() {
    // Commentary is collapsed by default behind a native <details> toggle.
    const cell = (o, name) => {
      if (!o) return "";
      const body = esc(stripTags(o.bottomLine || o.stance || ""));
      return `<div class="dsh-ro"><div class="dsh-ro-h"><span class="dsh-ro-nm">${esc(name)}</span><span class="dsh-ro-rate">${esc(stripTags(o.rate || "—"))}</span></div>`
        + `<div class="dsh-ro-m">${esc(stripTags(o.next || ""))}</div>`
        + (body ? `<details class="dsh-ro-more"><summary class="dsh-ro-sum">Commentary</summary><div class="dsh-ro-b">${body}</div></details>` : "")
        + `</div>`;
    };
    const src = (OUTLOOK && OUTLOOK.sources && OUTLOOK.sources[0]) || null;
    return `<div class="dsh-rogrid">${cell(OUTLOOK && OUTLOOK.us, "United States · Fed")}${cell(OUTLOOK && OUTLOOK.uk, "United Kingdom · BoE")}</div>`
      + (src ? `<div class="dsh-ladder-cap">Source: <a href="${esc(src[1])}" target="_blank" rel="noopener noreferrer">${esc(src[0])}</a></div>` : "");
  }
  // Yield curve — a small SVG line for US & UK across the standard maturities,
  // plus the underlying table (used by the Macro pane). Refinitiv-style read.
  // Live US Treasury + UK gilt curves (/api/yield-curve) merged over the compiled
  // YIELD_CURVE per maturity, so a point that can't be sourced keeps its fallback
  // and the freshest available "as of" date wins. _ycLive is filled by loadYieldCurve().
  function mergedYC() {
    const base = YIELD_CURVE || {};
    if (!_ycLive) return base;
    const merge = (live, stat) => (stat || []).map((v, i) => (live && Number.isFinite(live[i]) ? live[i] : v));
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(_ycLive.asOf || "");
    const asOf = m ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : (base.asOf || "");
    return { ...base, us: merge(_ycLive.us, base.us), uk: merge(_ycLive.uk, base.uk), asOf };
  }
  function yieldCurveHTML() {
    const yc = mergedYC(); if (!yc || !yc.maturities) return "";
    const mats = yc.maturities, us = yc.us || [], uk = yc.uk || [];
    const all = [...us, ...uk].filter((v) => v != null);
    const lo = Math.floor(Math.min(...all) * 2) / 2 - 0.25, hi = Math.ceil(Math.max(...all) * 2) / 2 + 0.25;
    const W = 600, H = 150, pad = 12;
    const x = (i) => pad + i * (W - 2 * pad) / (mats.length - 1);
    const y = (v) => H - pad - ((v - lo) / (hi - lo)) * (H - 2 * pad);
    const path = (arr) => arr.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + "," + y(v).toFixed(1)).join(" ");
    const dots = (arr, cls) => arr.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3" class="${cls}"/>`).join("");
    const svg = `<svg class="dsh-yc-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="US and UK yield curves">`
      + `<path d="${path(us)}" class="dsh-yc-us" fill="none"/>${dots(us, "dsh-yc-us-d")}`
      + `<path d="${path(uk)}" class="dsh-yc-uk" fill="none"/>${dots(uk, "dsh-yc-uk-d")}</svg>`
      + `<div class="dsh-yc-x">${mats.map((m) => `<span>${esc(m)}</span>`).join("")}</div>`;
    const rowFor = (arr, lbl, cls) => `<tr><td class="dsh-nm"><span class="dsh-yc-key ${cls}"></span>${lbl}</td>${arr.map((v) => `<td class="dsh-r">${v != null ? esc(v.toFixed(2)) : "—"}</td>`).join("")}</tr>`;
    const table = `<table class="dsh-tbl"><thead><tr><th>Curve</th>${mats.map((m) => `<th class="dsh-r">${esc(m)}</th>`).join("")}</tr></thead><tbody>${rowFor(us, "US Treasury", "dsh-yc-us")}${rowFor(uk, "UK gilts", "dsh-yc-uk")}</tbody></table>`;
    const src = (yc.sources && yc.sources[0]) || null;
    return `<div class="dsh-yc">${svg}</div>${table}` + (src ? `<div class="dsh-ladder-cap">${esc(yc.asOf || "")} · <a href="${esc(src[1])}" target="_blank" rel="noopener noreferrer">${esc(src[0])}</a></div>` : "");
  }
  // The whole Yield-curve card (header "as of" + body) so loadYieldCurve() can
  // repaint it in place once the live curve lands — header date included.
  function yieldCurveCardHTML() {
    return `<h3 class="dsh-h">Yield curve ${asOf(mergedYC().asOf)}</h3>${yieldCurveHTML()}`;
  }
  // Pull the live US Treasury + UK gilt curves and repaint the card. Never throws —
  // on any failure the compiled curve (and its July date) simply stays.
  async function loadYieldCurve() {
    try {
      const r = await fetch("/api/yield-curve", { headers: { accept: "application/json" } });
      if (!r.ok) return;
      const d = await r.json();
      if (!d || !Array.isArray(d.us)) return;
      _ycLive = d;
      const card = host.querySelector("#dsh-yc-card");
      if (card) card.innerHTML = yieldCurveCardHTML();
    } catch { /* keep the compiled curve */ }
  }
  // Multi-country yield curve (Fixed Income pane) — every country in the heatmap
  // plotted across 2Y/5Y/10Y/30Y from the GOVT_YIELDS levels, as a multi-line SVG
  // with a colour legend, plus the full term-structure table. One colour per
  // country (deterministic HSL by index).
  const YC_TENORS = [["y2", "2Y"], ["y5", "5Y"], ["y10", "10Y"], ["y30", "30Y"]];
  function worldYieldCurveHTML() {
    const G = GOVT_YIELDS; if (!G || !(G.regions || []).length) return "";
    const rows = G.regions.flatMap((g) => (g.rows || []).map((r) => ({ ...r, region: g.region })));
    const color = (i) => `hsl(${Math.round((i * 360) / rows.length)},68%,52%)`;
    const all = rows.flatMap((r) => YC_TENORS.map(([k]) => r[k]).filter((v) => v != null));
    if (!all.length) return "";
    // Nice axis bounds + gridline ticks (round yield levels).
    const min0 = Math.min(...all), max0 = Math.max(...all);
    const niceStep = (rng) => { const raw = Math.max(rng, 0.5) / 4; const mag = Math.pow(10, Math.floor(Math.log10(raw))); const n = raw / mag; return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag; };
    const step = niceStep(max0 - min0);
    const lo = Math.floor(min0 / step) * step, hi = Math.ceil(max0 / step) * step;
    const ticks = []; for (let v = lo; v <= hi + 1e-9; v += step) ticks.push(+v.toFixed(4));
    // viewBox 0..100 both axes; preserveAspectRatio="none" stretches to fill the
    // full plot width + fixed height. non-scaling-stroke keeps lines/gridlines
    // crisp under the non-uniform scale. Y-axis value labels are HTML (undistorted).
    const x = (i) => (i * 100) / (YC_TENORS.length - 1);
    const y = (v) => 100 - ((v - lo) / (hi - lo)) * 100;
    const linePath = (r) => { let d = "", on = false; YC_TENORS.forEach(([k], i) => { const v = r[k]; if (v == null) return; d += (on ? "L" : "M") + x(i).toFixed(2) + "," + y(v).toFixed(2) + " "; on = true; }); return d.trim(); };
    const grid = ticks.map((v) => `<line x1="0" y1="${y(v).toFixed(2)}" x2="100" y2="${y(v).toFixed(2)}" class="dsh-yc-grid" vector-effect="non-scaling-stroke"/>`).join("");
    const lines = rows.map((r, i) => { const d = linePath(r); return d ? `<path d="${d}" fill="none" stroke="${color(i)}" stroke-width="1.6" opacity="0.9" vector-effect="non-scaling-stroke"/>` : ""; }).join("");
    const yax = ticks.map((v) => `<span style="top:${y(v).toFixed(1)}%">${v.toFixed(v < 1 ? 2 : 1)}%</span>`).join("");
    const svg = `<div class="dsh-yc-plot"><div class="dsh-yc-yax">${yax}</div>`
      + `<svg class="dsh-yc-svg" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Government bond yield curves">${grid}${lines}</svg></div>`
      + `<div class="dsh-yc-x">${YC_TENORS.map(([, l]) => `<span>${esc(l)}</span>`).join("")}</div>`;
    const legend = `<div class="dsh-yc-leg">${rows.map((r, i) => `<span class="dsh-yc-lg"><i style="background:${color(i)}"></i>${esc(r.country)}</span>`).join("")}</div>`;
    const rowFor = (r, i) => `<tr><td class="dsh-nm"><span class="dsh-yc-key" style="background:${color(i)}"></span>`
      + `${r.source ? `<a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">${esc(r.country)}</a>` : esc(r.country)}</td>`
      + `${YC_TENORS.map(([k]) => `<td class="dsh-r">${r[k] != null ? esc(r[k].toFixed(2)) : "—"}</td>`).join("")}</tr>`;
    const table = `<table class="dsh-tbl"><thead><tr><th>Country</th>${YC_TENORS.map(([, l]) => `<th class="dsh-r">${esc(l)}</th>`).join("")}</tr></thead><tbody>${rows.map(rowFor).join("")}</tbody></table>`;
    return `<div class="dsh-yc">${svg}</div>${legend}${table}`;
  }
  // Embedded macro news wire — the desk's US + UK headlines, linked to source.
  function macroNewsHTML() {
    const items = [...((NEWS && NEWS.us) || []), ...((NEWS && NEWS.uk) || [])]
      .filter((x) => x && x.title && x.url)
      .sort((a, b) => byDateDesc(a, b) || String(b.time || "").localeCompare(String(a.time || "")))
      .slice(0, 12);
    if (!items.length) return "";
    const row = (x) => `<li class="dsh-news-i"><span class="dsh-news-d">${esc(fmtDate(x.date))}</span>`
      + `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a>`
      + (x.source ? `<span class="dsh-news-s">${esc(x.source)}</span>` : "") + `</li>`;
    return `<ul class="dsh-news">${items.map(row).join("")}</ul>`;
  }
  // Two readings of where we are: Ray Dalio's debt cycle (US/UK position on the
  // 0 early → 100 crisis track) and Howard Marks' market cycle (the pendulum of
  // investor psychology, 0 capitulation → 100 mania), with his sourced framework
  // and "where we stand". Reuses the FedWatch meter bars; every claim is linked.
  function cyclesHTML() {
    const meter = (label, pos) => `<div class="dsh-fw"><span class="dsh-fw-l">${esc(label)}</span>`
      + `<span class="dsh-fw-track"><span class="dsh-fw-bar" style="width:${Math.max(2, Math.min(100, pos || 0))}%"></span></span>`
      + `<span class="dsh-fw-p">${pos}/100</span></div>`;
    const mc = MARKET_CYCLE || {};
    const paras = (arr) => (arr || []).map((p) => `<p class="dsh-cyc-note">${esc(p)}</p>`).join("");
    const srcRow = (sources) => { const s = (sources || []).map(([l, u]) => `<a class="dsh-cyc-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(l)}</a>`).join(""); return s ? `<div class="dsh-cyc-srcs">${s}</div>` : ""; };
    // The full narrative sits behind a per-block expand/collapse, collapsed by
    // default (native <details>; the dashboard click handler ignores <summary>).
    const details = (body) => `<details class="dsh-cyc-exp"><summary class="dsh-cyc-sum"><span class="dsh-cyc-more">Show detail</span><span class="dsh-cyc-less">Hide detail</span></summary><div class="dsh-cyc-body">${body}</div></details>`;

    const debtNarr = paras(CYCLE.framework)
      + `<p class="dsh-cyc-sub">United States</p>` + paras(CYCLE.us.body)
      + `<p class="dsh-cyc-sub">United Kingdom</p>` + paras(CYCLE.uk.body)
      + srcRow(CYCLE.sources)
      + `<p class="dsh-cyc-note dsh-mut">${esc(CYCLE.note || "")}</p>`;
    const debt = `<div class="dsh-cyc-blk"><div class="dsh-cyc-hd">Debt cycle <span>Ray Dalio · 0 early → 100 crisis</span></div>`
      + meter("US", CYCLE.us.pos) + meter("UK", CYCLE.uk.pos)
      + `<p class="dsh-cyc-note dsh-mut">${esc(stripTags(String(CYCLE.us.shortStage || "")))} (US) · ${esc(stripTags(String(CYCLE.uk.shortStage || "")))} (UK)</p>`
      + details(debtNarr) + `</div>`;

    const mktNarr = paras(mc.framework)
      + `<p class="dsh-cyc-sub">Where we stand</p>` + paras(mc.stand)
      + srcRow(mc.sources)
      + `<p class="dsh-cyc-note dsh-mut">${esc(mc.note || "")}</p>`;
    const market = `<div class="dsh-cyc-blk"><div class="dsh-cyc-hd">Market cycle <span>Howard Marks · 0 capitulation → 100 mania</span></div>`
      + meter("Equities", mc.pos) + `<p class="dsh-cyc-note"><strong>${esc(mc.stage || "")}</strong></p>`
      + details(mktNarr) + `</div>`;
    return `<div class="dsh-cyc">${debt}${market}</div>`;
  }
  // The Macro pane is a fixed-viewport terminal (option 4): three side-by-side
  // panes that fill the screen and each scroll internally — Policy rates (Fed/BoE
  // paths, rate outlook, yield curve), Cycle (Dalio debt + Marks market cycle) and
  // the Macro wire rail. The regime pills strip spans the top as a shared read.
  function macroHTML() {
    const fed = fedHTML();
    const boe = boeHTML();
    return `<div class="dsh-pane dsh-macro dsh-term">
      <section class="dsh-card dsh-span">${regimePillsHTML()}</section>
      <div class="dsh-term-ws">
        <div class="dsh-term-col">
          <h3 class="dsh-term-lbl">Policy rates</h3>
          ${fed ? `<section class="dsh-card"><h3 class="dsh-h">Fed path — dot plot &amp; CME FedWatch</h3>${fed}</section>` : ""}
          ${boe ? `<section class="dsh-card"><h3 class="dsh-h">BoE path — MPC votes &amp; SONIA/OIS curve</h3>${boe}</section>` : ""}
          <section class="dsh-card"><h3 class="dsh-h">Rate outlook</h3>${rateOutlookHTML()}</section>
          <section class="dsh-card" id="dsh-yc-card">${yieldCurveCardHTML()}</section>
        </div>
        <div class="dsh-term-col">
          <h3 class="dsh-term-lbl">Cycle</h3>
          <section class="dsh-card"><h3 class="dsh-h">Where we are in the cycle — debt &amp; market</h3>${cyclesHTML()}</section>
        </div>
        <div class="dsh-term-col dsh-term-rail">
          <h3 class="dsh-term-lbl">Macro wire</h3>
          <section class="dsh-card"><h3 class="dsh-h">Macro wire — US &amp; UK headlines</h3>${macroNewsHTML()}</section>
        </div>
      </div>
    </div>`;
  }

  // ---- Fixed Income -------------------------------------------------------
  // Government/sovereign (the US/UK yield curves) + corporate (ICE BofA OAS
  // spreads, loaded live). Reuses the macro yield-curve renderer and the credit
  // spreads loader so there is one source of truth for each.
  // Government bond yields across the major economies in each jurisdiction, as a
  // heat-shaded table in the ETF-flows style: one row per country under a region
  // section header, a column per tenor (2Y/5Y/10Y/30Y), each cell green→red heat-
  // shaded by yield LEVEL within its column (low yield = green, high = red).
  // Snapshot from GOVT_YIELDS (dashboard/js/data.js), every value sourced + dated.
  const YLD_TENORS = [["y2", "2Y"], ["y5", "5Y"], ["y10", "10Y"], ["y30", "30Y"]];
  const YCHG_WINS = [["w1", "1W"], ["m1", "1M"], ["m3", "3M"], ["m6", "6M"], ["y1", "1Y"]];
  // The heatmap shows, for the tenor picked in the dropdown, each country's yield
  // CHANGE (basis points) over 1W/1M/3M/6M/1Y, green (fell) / red (rose), with the
  // current yield in the label. Changes are live from /api/govyields (Stooq
  // history, keyed by country → per-tenor {v, w1..y1}); the current level falls
  // back to the sourced GOVT_YIELDS snapshot when live is absent.
  function govtYieldsHeatHTML() {
    const G = GOVT_YIELDS;
    if (!G || !(G.regions || []).length) return "";
    const tk = _yldTenor;
    const tl = (YLD_TENORS.find(([k]) => k === tk) || [, ""])[1];
    const liveT = (r) => (_gyLive && _gyLive[r.country] && _gyLive[r.country][tk]) || null;
    const snapT = (r) => (GOVT_YIELD_CHG && GOVT_YIELD_CHG[r.country] && GOVT_YIELD_CHG[r.country][tk]) || null;
    const levelOf = (r) => { const l = liveT(r); return (l && l.v != null) ? l.v : r[tk]; };
    // Live (US, FRED, all windows) wins; otherwise the curated GOVT_YIELD_CHG snapshot
    // (Trading Economics m1/y1). A window with neither stays blank.
    const chgOf = (r, w) => { const l = liveT(r); if (l && l[w] != null) return l[w]; const s = snapT(r); return s && s[w] != null ? s[w] : null; };
    // Shade each window column independently by |change|.
    const maxAbs = {};
    YCHG_WINS.forEach(([w]) => { maxAbs[w] = Math.max(1, ...G.regions.flatMap((g) => (g.rows || []).map((r) => { const c = chgOf(r, w); return c == null ? 0 : Math.abs(c); }))); });
    const heat = (c, w) => { if (c == null) return ""; const a = (Math.abs(c) / maxAbs[w]) * 0.62 + 0.10; return ` style="background:rgba(${c <= 0 ? "63,192,141" : "242,109,132"},${a.toFixed(3)})"`; };
    const fmtBp = (c) => (c == null ? "" : (c > 0 ? "+" : "") + Math.round(c));
    const cell = (r, w, l) => { const c = chgOf(r, w); return c == null ? `<td class="dsh-fl-na">·</td>` : `<td class="dsh-fl"${heat(c, w)} title="${esc(r.country)} ${esc(tl)} ${esc(l)}: ${c > 0 ? "+" : ""}${Math.round(c)}bp">${fmtBp(c)}</td>`; };
    const fmtLv = (v) => (v == null ? "" : v.toFixed(2) + "%");
    // Regions are separated by a thin grey rule (top border on the first row).
    const row = (r, brk) => {
      const lv = levelOf(r);
      const nm = r.source ? `<a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">${esc(r.country)}</a>` : esc(r.country);
      return `<tr${brk ? ' class="dsh-secbreak"' : ""}><td class="dsh-nm">${nm}${lv != null ? ` <span class="dsh-fl-t">${fmtLv(lv)}</span>` : ""}</td>${YCHG_WINS.map(([w, l]) => cell(r, w, l)).join("")}</tr>`;
    };
    const group = (g, i) => (g.rows || []).map((r, ri) => row(r, i > 0 && ri === 0)).join("");
    const sel = `<div class="dsh-yld-selbar"><label class="dsh-yld-sellbl" for="dsh-yld-tenor">Bond duration</label>`
      + `<select id="dsh-yld-tenor" class="dsh-hf-sel">${YLD_TENORS.map(([k, l]) => `<option value="${k}"${k === tk ? " selected" : ""}>${l}</option>`).join("")}</select></div>`;
    return sel + `<table class="dsh-tbl dsh-fl-tbl"><thead><tr><th>Country</th>${YCHG_WINS.map(([, l]) => `<th class="dsh-r">${l}</th>`).join("")}</tr></thead>`
      + `<tbody>${G.regions.map(group).join("")}</tbody></table>`
      + `<p class="dsh-fl-note"><span class="dsh-fl-pos">green = yield fell</span> · <span class="dsh-fl-neg">red = yield rose</span> over each window (${esc(tl)} change in basis points, shaded per column); the grey figure is the current ${esc(tl)} yield. Each country links its source.</p>`;
  }
  function wireYields() {
    const box = host.querySelector("#dsh-yld");
    if (!box) return;
    box.addEventListener("change", (e) => {
      const s = e.target.closest("#dsh-yld-tenor");
      if (!s) return;
      _yldTenor = s.value;
      box.innerHTML = govtYieldsHeatHTML();
    });
  }
  async function loadGovYields() {
    try {
      const r = await fetch("/api/govyields", { headers: { accept: "application/json" } });
      const d = r.ok ? await r.json() : null;
      const arr = (d && d.yields) || [];
      if (!arr.length) return;
      _gyLive = {}; arr.forEach((x) => { if (x && x.country) _gyLive[x.country] = x; });
      const box = host.querySelector("#dsh-yld");
      if (box) box.innerHTML = govtYieldsHeatHTML();
    } catch { /* keep the sourced snapshot */ }
  }
  // "Why it moved" for rates — mirrors the Equities Key-moments box, reading the
  // sourced per-benchmark notes in IND_KEYMOMENTS (macro/js/content.js). Keys are
  // "<CC>:<tenor>" (e.g. US:two_year); each note is grounded + sourced. The whole
  // card is omitted when nothing qualifies.
  function fixedKeyMomentsHTML() {
    const KM = IND_KEYMOMENTS || {};
    const keys = Object.keys(KM).filter((k) => KM[k] && KM[k].text);
    if (!keys.length) return "";
    const TEN = { two_year: "2Y", five_year: "5Y", ten_year: "10Y", thirty_year: "30Y" };
    const label = (k) => { const [cc, t] = String(k).split(":"); return `${cc}${TEN[t] ? " " + TEN[t] : ""}`; };
    const row = (k) => { const m = KM[k]; return `<div class="dsh-km"><span class="dsh-km-t">${esc(label(k))}</span>`
      + `<span class="dsh-km-x">${esc(m.text)}${srcLink(m.src, (m.srcName || "source") + " — source")}</span></div>`; };
    return `<section class="dsh-card dsh-span"><h3 class="dsh-h">Key moments <span class="dsh-n">why it moved</span></h3>${keys.map(row).join("")}</section>`;
  }
  function fixedIncomeHTML() {
    // Terminal (option 4): the three sovereign/corporate tables become columns
    // that fill the viewport and scroll internally, so the whole fixed-income
    // picture reads at once. Wide tables keep a horizontal scroll inside a column.
    return `<div class="dsh-pane dsh-term">
      ${fixedKeyMomentsHTML()}
      <div class="dsh-term-ws">
        <div class="dsh-term-col">
          <section class="dsh-card"><h3 class="dsh-h">Government bond yields — change over 1W · 1M · 3M · 6M · 1Y <span class="dsh-live">live</span></h3><div class="dsh-scroll" id="dsh-yld">${govtYieldsHeatHTML()}</div></section>
        </div>
        <div class="dsh-term-col">
          <section class="dsh-card"><h3 class="dsh-h">Government / sovereign — yield curves (all countries) ${asOf(GOVT_YIELDS && GOVT_YIELDS.asOf)}</h3><div class="dsh-scroll">${worldYieldCurveHTML()}</div></section>
        </div>
        <div class="dsh-term-col">
          <section class="dsh-card"><h3 class="dsh-h">Corporate — credit spreads (ICE BofA OAS) <span class="dsh-live">live</span></h3><div id="dsh-spreads" class="dsh-spreads"><p class="dsh-load">Loading live spreads…</p></div><p class="dsh-fl-note">Option-adjusted spreads over Treasuries, by rating cohort — the corporate risk premium. Live from FRED (ICE BofA indices).</p></section>
        </div>
      </div>
    </div>`;
  }

  // ---- Legal --------------------------------------------------------------
  // A searchable database of ALL alerts + case law the platform covers, unified
  // from the legal desk's `items` (alerts/updates + case notes) and its landmark
  // `cases`, organised by practice area. Insights/know-how are excluded (they are
  // thought-leadership, not alerts or case law). Every row keeps its source URL.
  let _legalCache = null;
  function legalDb() {
    if (_legalCache) return _legalCache;
    // Every legal item the desk covers — alerts, updates, case notes, insights and
    // know-how (the feed labels them all, so all are searchable here). `case` items
    // read as case law; everything else reads as an alert. `hay` is the pre-built
    // normalised search haystack: title + summary + the FULL long-form text (insight
    // bullet points / the extended case summary) + tags + court + citation + firm,
    // so a topic search (e.g. "directors' duties") reaches a case whose NAME never
    // says it but whose summary does.
    const fromItems = (LGL_ITEMS || [])
      .filter((x) => x && x.title)
      .map((x) => {
        const firm = (LGL_FIRM_BY_ID[x.firm] || {}).name || null;
        const long = Array.isArray(x.points) ? x.points.join(" ") : "";
        const tags = Array.isArray(x.tags) ? x.tags.join(" ") : "";
        return { title: x.title, area: x.area, type: x.type === "case" ? "case" : "alert", court: x.court, citation: x.citation, firm, summary: x.summary, url: x.url, date: x.date,
          thay: _norm(`${x.title} ${x.citation || ""}`),
          hay: _norm(`${x.title} ${x.summary || ""} ${long} ${tags} ${x.court || ""} ${x.citation || ""} ${firm || ""}`) };
      });
    const fromCases = (LGL_CASES || [])
      .filter((c) => c && (c.name || c.title))
      .map((c) => {
        const title = c.name || c.title;
        const long = (LGL_CASE_SUMMARIES && LGL_CASE_SUMMARIES[c.id]) || "";
        return { title, area: c.area, type: "case", court: c.court, citation: c.citation, firm: null, summary: c.summary, url: c.url, date: c.date,
          thay: _norm(`${title} ${c.citation || ""}`),
          hay: _norm(`${title} ${c.summary || ""} ${long} ${c.court || ""} ${c.citation || ""}`) };
      });
    // Dedup by citation|title, but MERGE the search haystacks of duplicates into the
    // kept row — two entries can share a citation (e.g. a Supreme Court case noted at
    // both the appeal and final stage) yet one carries the richer summary. Folding
    // their `hay` together means the survivor is searchable on every duplicate's text.
    const byKey = new Map(), all = [];
    [...fromCases, ...fromItems].forEach((r) => {
      const k = (r.citation || r.title || "").toLowerCase();
      if (k && byKey.has(k)) { const kept = byKey.get(k); kept.hay += " " + r.hay; kept.thay += " " + r.thay; return; }
      if (k) byKey.set(k, r); all.push(r);
    });
    _legalCache = all.sort(byDateDesc);
    return _legalCache;
  }
  function legalListHTML() {
    // Word-by-word AND match over the normalised haystack: every query token must
    // appear somewhere, in any order — so "directors' duties" reaches an item whose
    // title has one word and summary the other. Search-driven: nothing lists until a
    // keyword is entered (no full dump).
    const tokens = _norm(_legalQuery).split(/[^a-z0-9]+/).filter(Boolean);
    if (!tokens.length) {
      const bits = [];
      if (_legalTypes.size) bits.push([..._legalTypes].map((t) => t === "case" ? "case law" : "alerts").join(" & "));
      if (_legalAreas.size) bits.push([..._legalAreas].map((a) => (LGL_AREA_BY_ID[a] || {}).short || a).join(", "));
      const scope = bits.length ? ` (limited to ${bits.join(" · ")})` : "";
      return `<p class="dsh-load">Search ${legalDb().length} legal alerts &amp; case law${scope} — type a keyword above; use the chips to limit by type or practice area.</p>`;
    }
    let list = legalDb();
    if (_legalTypes.size) list = list.filter((x) => _legalTypes.has(x.type));
    if (_legalAreas.size) list = list.filter((x) => _legalAreas.has(x.area));
    list = list.filter((x) => tokens.every((t) => x.hay.includes(t)));
    if (!list.length) return `<p class="dsh-load">No matching case law or alerts.</p>`;
    // One flat list, NEWEST FIRST — not split by practice area. Relevance only breaks
    // a date tie, so among items published the same day the directly-named authority
    // (whole phrase in the title > all query words > word count) edges out a passing
    // mention. Each row still carries its practice-area label so that dimension is kept.
    const phrase = tokens.join(" ");
    const score = (x) => (x.thay.includes(phrase) ? 1000 : 0)
      + (tokens.every((t) => x.thay.includes(t)) ? 100 : 0)
      + tokens.filter((t) => x.thay.includes(t)).length * 10;
    list.forEach((x) => { x._score = score(x); });
    list.sort((a, b) => byDateDesc(a, b) || (b._score - a._score));
    const badge = (t) => t === "case" ? `<span class="dsh-lgl-badge dsh-lgl-case">Case</span>` : `<span class="dsh-lgl-badge dsh-lgl-alert">Alert</span>`;
    const row = (x) => {
      const area = LGL_AREA_BY_ID[x.area];
      const meta = [area && area.name, x.court, x.citation, x.firm].filter(Boolean).map(esc).join(" · ");
      return `<div class="dsh-lgl-i" data-date="${esc(x.date || "")}"><div class="dsh-lgl-i-h">${badge(x.type)}<span class="dsh-lgl-d">${esc(fmtDate(x.date))}</span></div>`
        + (x.url ? `<a class="dsh-lgl-t" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a>` : `<span class="dsh-lgl-t">${esc(x.title)}</span>`)
        + (meta ? `<div class="dsh-lgl-m">${meta}</div>` : "") + `</div>`;
    };
    return `<div class="dsh-lgl-list">${list.map(row).join("")}</div>`;
  }
  // ---- Hedge Funds --------------------------------------------------------
  // Cross-fund 13F read: curated, SOURCED "consensus longs" + "notable Q1 moves"
  // (HF_13F), plus a LIVE per-fund top-10 holdings table pulled from SEC via the
  // Worker's /api/13f endpoint (same source as the Credit fund pages).
  const hfUsd = (v) => {
    if (v == null || !isFinite(v)) return "—";
    const a = Math.abs(v);
    return a >= 1e9 ? "$" + (v / 1e9).toFixed(2) + "bn" : a >= 1e6 ? "$" + (v / 1e6).toFixed(0) + "m" : "$" + Math.round(v).toLocaleString("en-US");
  };
  const _hfDir = { buy: "Buy", new: "New", trim: "Trim", sell: "Sell" };
  function hedgeFundsHTML() {
    const F = HF_13F || {};
    const yh = (t) => `https://finance.yahoo.com/quote/${encodeURIComponent(t)}`;
    const tkr = (t) => `<a class="dsh-hf-t" href="${esc(yh(t))}" target="_blank" rel="noopener noreferrer">${esc(t)}</a>`;
    const conRow = (x) => `<div class="dsh-hf-i"><div class="dsh-hf-i-h">${tkr(x.t)} <span class="dsh-hf-nm">${esc(x.name)}</span>${srcLink(x.src)}</div><div class="dsh-hf-note">${esc(x.note)}</div></div>`;
    const mvRow = (x) => `<div class="dsh-hf-i"><div class="dsh-hf-i-h"><span class="dsh-hf-dir dsh-hf-${esc(x.dir)}">${esc(_hfDir[x.dir] || x.dir)}</span> ${tkr(x.t)} <span class="dsh-hf-nm">${esc(x.name)}</span> <span class="dsh-hf-by">${esc(x.by)}</span>${srcLink(x.src)}</div><div class="dsh-hf-note">${esc(x.note)}</div></div>`;
    const filers = (HEDGE_FUNDS || []).filter((f) => f.cik).sort((a, b) => a.name.localeCompare(b.name));
    const opts = filers.map((f) => `<option value="${esc(f.cik)}">${esc(f.name)}</option>`).join("");
    // Terminal (option 4): consensus · notable moves · per-fund holdings tile into
    // three columns filling the viewport, each scrolling internally.
    return `<div class="dsh-pane dsh-term">
      <div class="dsh-term-ws">
        <div class="dsh-term-col">
          <section class="dsh-card">
            <h3 class="dsh-h">Consensus longs <span class="dsh-n">(${esc(F.quarter || "")} 13Fs)</span></h3>
            <div class="dsh-hf-list">${(F.consensus || []).map(conRow).join("")}</div>
            <p class="dsh-fl-note">Most widely-held names across major hedge funds, from public ${esc(F.quarter || "")} 13F coverage — each links its source. ${esc(F.filed || "")}</p>
          </section>
        </div>
        <div class="dsh-term-col">
          <section class="dsh-card">
            <h3 class="dsh-h">Notable ${esc(F.quarter || "")} moves</h3>
            <div class="dsh-hf-list">${(F.moves || []).map(mvRow).join("")}</div>
            <p class="dsh-fl-note">Selected buys, new stakes, trims and exits disclosed in the ${esc(F.quarter || "")} 13Fs — sourced, illustrative not exhaustive.</p>
          </section>
        </div>
        <div class="dsh-term-col">
          <section class="dsh-card">
            <h3 class="dsh-h">Per-fund holdings <span class="dsh-live">live · SEC 13F</span></h3>
            <div class="dsh-hf-pick"><label class="dsh-lgl-lbl" for="dsh-hf-sel">Fund</label>
              <select id="dsh-hf-sel" class="dsh-hf-sel">${opts}</select></div>
            <div id="dsh-hf-body" class="dsh-hf-body"><p class="dsh-load">Loading latest 13F…</p></div>
          </section>
        </div>
      </div>
    </div>`;
  }
  function renderHfHoldings(body, d) {
    if (!d || !Array.isArray(d.holdings) || !d.holdings.length) {
      body.innerHTML = `<p class="dsh-load">No 13F holdings available${d && d.source ? ` — <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">latest filing</a>.` : "."}</p>`;
      return;
    }
    const yh = (t) => `https://finance.yahoo.com/quote/${encodeURIComponent(t)}`;
    const rows = d.holdings.slice(0, 10).map((h, i) => `<tr><td class="dsh-r">${i + 1}</td>`
      + `<td>${esc(h.name || "—")}</td>`
      + `<td>${h.ticker ? `<a href="${esc(yh(h.ticker))}" target="_blank" rel="noopener noreferrer">${esc(h.ticker)}</a>` : "—"}</td>`
      + `<td class="dsh-r">${esc(hfUsd(h.value))}</td>`
      + `<td class="dsh-r">${h.weight != null && isFinite(h.weight) ? (h.weight * 100).toFixed(1) + "%" : "—"}</td></tr>`).join("");
    body.innerHTML = `<table class="dsh-tbl"><thead><tr><th class="dsh-r">#</th><th>Holding</th><th>Ticker</th><th class="dsh-r">Value</th><th class="dsh-r">Weight</th></tr></thead><tbody>${rows}</tbody></table>`
      + `<p class="dsh-fl-note">Top ${Math.min(10, d.holdings.length)} US-listed positions by value${d.asOf ? `, as of ${esc(d.asOf)}` : ""}${d.source ? ` · <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">latest 13F</a>` : ""}.</p>`;
  }
  function wireHedgeFunds() {
    const sel = host.querySelector("#dsh-hf-sel"), body = host.querySelector("#dsh-hf-body");
    if (!sel || !body) return;
    const load = async (cik) => {
      if (!cik) return;
      body.innerHTML = `<p class="dsh-load">Loading latest 13F…</p>`;
      try {
        const r = await fetch(`/api/13f?cik=${encodeURIComponent(cik)}`, { headers: { accept: "application/json" } });
        renderHfHoldings(body, r.ok ? await r.json() : null);
      } catch { body.innerHTML = `<p class="dsh-load">Could not load holdings right now.</p>`; }
    };
    sel.addEventListener("change", () => load(sel.value));
    if (sel.value) load(sel.value);
  }
  function legalHTML() {
    const total = legalDb().length;
    // Toggleable practice-area chips (multi-select) that LIMIT the keyword search;
    // none selected = search every area.
    const TYPES = [["alert", "Alerts"], ["case", "Case law"]];
    const tchip = ([k, l]) => `<button type="button" class="dsh-lgl-chip${_legalTypes.has(k) ? " is-on" : ""}" data-type="${esc(k)}">${esc(l)}</button>`;
    const achip = (a) => `<button type="button" class="dsh-lgl-chip${_legalAreas.has(a.id) ? " is-on" : ""}" data-area="${esc(a.id)}">${esc(a.short || a.name)}</button>`;
    const typeChips = `<div class="dsh-lgl-chips"><span class="dsh-lgl-lbl">Type</span>${TYPES.map(tchip).join("")}</div>`;
    const areaChips = `<div class="dsh-lgl-chips"><span class="dsh-lgl-lbl">Practice area</span>${(LGL_AREAS || []).map(achip).join("")}</div>`;
    // Terminal (option 4): a single full-height panel — the search box and filter
    // chips pin at the top and the results list scrolls internally, so the page
    // itself doesn't scroll.
    return `<div class="dsh-pane dsh-term dsh-term-solo">
      <section class="dsh-card">
        <h3 class="dsh-h">Legal — case law &amp; alerts <span class="dsh-n">(${total}) · search</span></h3>
        <input type="search" class="dsh-lgl-search" id="dsh-lgl-q" placeholder="Search all legal alerts &amp; case law — party, court, citation, firm…" value="${esc(_legalQuery)}" autocomplete="off" spellcheck="false">
        ${typeChips}${areaChips}
        <div class="dsh-lgl-body" id="dsh-lgl-body">${legalListHTML()}</div>
      </section>
    </div>`;
  }
  function wireLegal() {
    const q = host.querySelector("#dsh-lgl-q");
    const body = host.querySelector("#dsh-lgl-body");
    if (q && body) q.addEventListener("input", () => { _legalQuery = q.value; body.innerHTML = legalListHTML(); });
    host.querySelectorAll(".dsh-lgl-chip").forEach((c) => c.addEventListener("click", () => {
      if (c.dataset.type) { const t = c.dataset.type; _legalTypes.has(t) ? _legalTypes.delete(t) : _legalTypes.add(t); }
      else { const a = c.dataset.area; _legalAreas.has(a) ? _legalAreas.delete(a) : _legalAreas.add(a); }
      c.classList.toggle("is-on");
      if (body) body.innerHTML = legalListHTML();
    }));
  }

  // ---- Shell + routing ----------------------------------------------------
  function render() {
    const nav = SUBTABS.map(([k, l, s]) => {
      const label = s ? `<span class="dsh-tab-lg">${l}</span><span class="dsh-tab-sm">${s}</span>` : l;
      return `<a class="tchip${pane === k ? " is-on" : ""}" href="${ctx.base}/dashboard/${k}" data-sub="${k}">${label}</a>`;
    }).join("");
    const body = pane === "equities" ? equitiesHTML()
      : pane === "credit" ? creditHTML()
      : pane === "fixed-income" ? fixedIncomeHTML()
      : pane === "hedge-funds" ? hedgeFundsHTML()
      : pane === "legal" ? legalHTML()
      : macroHTML();
    host.innerHTML = `<div class="dsh"><header class="dsh-nav tdet-secnav"><div class="tchips">${nav}</div></header>${body}</div>`;
    if (pane === "macro") loadYieldCurve();
    if (pane === "equities") loadWorldIndices();
    if (pane === "credit") { loadSpreads(); wireStressSort(); }
    if (pane === "fixed-income") { loadSpreads(); wireYields(); loadGovYields(); }
    if (pane === "hedge-funds") wireHedgeFunds();
    if (pane === "legal") wireLegal();
  }
  function wireStressSort() {
    host.querySelectorAll(".dsh-sortchip").forEach((btn) => btn.addEventListener("click", () => {
      const k = btn.dataset.sort;
      if (_stressSort.key === k) _stressSort.dir *= -1; else { _stressSort.key = k; _stressSort.dir = k === "debt" ? -1 : 1; }
      const wrap = host.querySelector(".dsh-stresswrap");
      if (wrap) { wrap.outerHTML = stressHTML(); wireStressSort(); }
    }));
  }
  host.addEventListener("click", (e) => {
    const a = e.target.closest(".tchip[data-sub]");
    if (a) { e.preventDefault(); e.stopPropagation(); pane = a.dataset.sub; render(); try { history.replaceState(null, "", a.getAttribute("href")); } catch { /* */ } }
  });

  const subFromUrl = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const i = parts.indexOf("dashboard");
    return i >= 0 ? parts[i + 1] : "";
  };
  pane = SUBTABS.some(([x]) => x === subFromUrl()) ? subFromUrl() : "macro";
  render();

  return {
    enter(sub) {
      const k = (sub && sub[0]) || subFromUrl() || "macro";
      pane = SUBTABS.some(([x]) => x === k) ? k : "macro";
      render();
    },
    leave() {},
  };
}
