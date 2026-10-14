// =============================================================================
// v2/js/dashboard/app.js — the Dashboard tab: the at-a-glance market state for a
// European credit-fund reader. Five sub-tabs in priority order (HOUSE_STYLE R37):
// Credit (the default) · Rates (policy, money markets, curves — the old Macro +
// Bonds tabs merged) · Legal · Equities · Hedge Funds. Curated seed data comes
// from dashboard/js/data.js + the macro desk's content (ONE source of truth);
// live figures override at runtime from the Worker (/api/rates, /api/eurates,
// /api/yield-curve, /api/govyields, /api/worldindices, /api/13f). Every figure
// keeps a real outbound source link and an as-of date; a LIVE badge only lights
// once live data has actually been applied (otherwise it reads "snapshot").
// mount → {enter,leave,home}.
// =============================================================================
import { esc, MONTHS, byDateDesc } from "/util.js";
import { fmtDay as fmtDate } from "/feed.js";
import { EQ_INDICES, EQ_SECTORS, EQ_VALUATION, EQ_VOL, EQ_IPO, CR_STRESS, WORLD_INDICES, GOVT_YIELDS, GOVT_YIELD_CHG, PRIVATE_CREDIT, EU_DISTRESS, REG_CALENDAR } from "/dashboard/js/data.js";
import { OUTLOOK, CYCLE, MARKET_CYCLE, BUBBLE, MATWALL, YIELD_CURVE, NEWS, EARNINGS, IND_KEYMOMENTS, MARKET_SIZES } from "/macro/js/content.js";
import { deals, intel, HEDGE_FUNDS, HF_13F } from "/credit/js/data.js";
import { SECTOR_FLOWS } from "/allocations.js";
import { nbNums } from "../nb-format.js";
import { items as LGL_ITEMS, cases as LGL_CASES, practiceAreas as LGL_AREAS, areaById as LGL_AREA_BY_ID, firmById as LGL_FIRM_BY_ID, caseSummaries as LGL_CASE_SUMMARIES } from "/legal/js/data.js";

// Third tuple element is an OPTIONAL short label shown on the narrow iPhone tab
// bar (≤760px) where the full two-word labels wrap to two lines; desktop (the
// fixed-viewport terminal) keeps the full label.
const SUBTABS = [["credit", "Credit"], ["rates", "Rates"], ["legal", "Legal"], ["equities", "Equities"], ["hedge-funds", "Hedge Funds", "Hedge"]];
// Retired sub-tab URLs (Macro and Bonds merged into Rates) keep resolving.
const SUB_ALIAS = { macro: "rates", "fixed-income": "rates", bonds: "rates" };
const DEFAULT_SUB = "credit";
const subOf = (k) => { const x = SUB_ALIAS[k] || k; return SUBTABS.some(([s]) => s === x) ? x : DEFAULT_SUB; };
const pct1 = (n) => (n == null ? "—" : (n > 0 ? "+" : "") + n.toFixed(1) + "%");
const upcls = (n) => (n == null ? "" : n > 0 ? "up" : n < 0 ? "down" : "");
const asOf = (d) => (d ? `<span class="dsh-asof">as of ${esc(d)}</span>` : "");
const srcLink = (u, label) => (u ? ` <a class="dsh-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer" title="${esc(label || "Source")}">src</a>` : "");
const stripTags = (s) => String(s || "").replace(/<[^>]+>/g, "");
// Curated text sometimes arrives entity-encoded ("S&amp;P"); decode the common
// entities BEFORE esc() so the page never shows a literal "&amp;".
const deEnt = (s) => String(s || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
const txt = (s) => esc(deEnt(s));
// LIVE badge: renders as "snapshot" and only flips to "live" once a live payload
// has actually been applied (markLive), so stale fallback data is never badged live.
const liveTag = (id) => `<span class="dsh-live is-snap" data-live="${id}" title="Sourced snapshot — live data not loaded">snapshot</span>`;
const isoDay = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || "")); return m ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : String(d || ""); };
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

  // Live-state bookkeeping: flip a "snapshot" badge to "live" (with the live
  // as-of date in its title) only once a live payload has been applied.
  const _live = {};
  function markLive(id, asOfDate) {
    _live[id] = asOfDate || true;
    host.querySelectorAll(`.dsh-live[data-live="${id}"]`).forEach((el) => {
      el.classList.remove("is-snap"); el.textContent = "live";
      el.title = asOfDate ? `Live · as of ${isoDay(asOfDate)}` : "Live";
    });
  }
  const liveOr = (id) => (_live[id] ? `<span class="dsh-live" data-live="${id}" title="Live">live</span>` : liveTag(id));
  let _eu = null;                        // /api/eurates payload (ECB · BoE · Eurostat)
  let _rates = null;                     // /api/rates payload (FRED OAS, SOFR, Treasury)

  // ---- Equities -----------------------------------------------------------
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
    const d = (x) => (x ? ` <span class="dsh-asof">${esc(isoDay(x))}</span>` : "");
    const val = EQ_VALUATION.map((v) => `<div class="dsh-kv"><span class="dsh-kv-k">${esc(v.name)} fwd P/E</span><span class="dsh-kv-v">${v.fwdPE != null ? v.fwdPE.toFixed(1) + "×" : "—"}${d(v.asOf)}${srcLink(v.source, v.name + " valuation source")}</span></div>`).join("");
    const vol = EQ_VOL.map((v) => { const [b, c] = volBand(v.level); return `<div class="dsh-kv"><span class="dsh-kv-k">${esc(v.name)}</span><span class="dsh-kv-v ${c}">${v.level != null ? v.level.toFixed(1) : "—"} <span class="dsh-band ${c}">${b}</span>${d(v.asOf)}${srcLink(v.source, v.name + " source")}</span></div>`; }).join("");
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
  function keyMomentsBody() {
    const items = EQ_INDICES.filter((x) => x.keyMoment && x.keyMoment.text);
    if (!items.length) return "";
    const row = (x) => `<div class="dsh-km"><span class="dsh-km-t">${esc(x.name)}</span>`
      + `<span class="dsh-km-x">${nbNums(txt(x.keyMoment.text))}${x.keyMoment.date ? ` <span class="dsh-asof">${esc(isoDay(x.keyMoment.date))}</span>` : ""}${srcLink(x.keyMoment.src, (x.keyMoment.srcName || "source") + " — source")}</span></div>`;
    return items.map(row).join("");
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
      return ` style="background:color-mix(in srgb, var(--t-${v >= 0 ? "up" : "down"}) ${(a * 100).toFixed(1)}%, transparent)"`;
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
    const heat = (v, k) => { if (v == null) return ""; const a = (Math.abs(v) / maxAbs[k]) * 0.62 + 0.10; return ` style="background:color-mix(in srgb, var(--t-${v >= 0 ? "up" : "down"}) ${(a * 100).toFixed(1)}%, transparent)"`; };
    const fmtLv = (v) => (v == null ? "" : Number(v).toLocaleString("en-GB", { maximumFractionDigits: 2 }));
    const cell = (r, k, l) => { const v = valK(r, k); return v == null ? `<td class="dsh-fl-na">·</td>` : `<td class="dsh-fl"${heat(v, k)} title="${esc(r.name)} · ${esc(l)}: ${pct1(v)}">${pct1(v)}</td>`; };
    // Each geography is introduced by a labelled band and set off by a rule, so the
    // table reads as regional blocks (United States, Europe, Asia-Pacific, …).
    const REGION_LABEL = { US: "United States", "South America": "South America", UK: "United Kingdom", Europe: "Europe", APAC: "Asia-Pacific" };
    const row = (r) => {
      const nm = r.source ? `<a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a>` : esc(r.name);
      const lv = lvOf(r);
      return `<tr><td class="dsh-nm">${nm}${lv != null ? ` <span class="dsh-fl-t">${fmtLv(lv)}</span>` : ""}</td>${IDX_WINS.map(([k, l]) => cell(r, k, l)).join("")}</tr>`;
    };
    const group = (g) => `<tr class="dsh-georow"><td class="dsh-geo" colspan="${IDX_WINS.length + 1}">${esc(REGION_LABEL[g.region] || g.region)}</td></tr>`
      + (g.rows || []).map(row).join("");
    return `<table class="dsh-tbl dsh-fl-tbl"><thead><tr><th>Index</th>${IDX_WINS.map(([, l]) => `<th class="dsh-r">${l}</th>`).join("")}</tr></thead>`
      + `<tbody>${W.regions.map(group).join("")}</tbody></table>`
      + `<p class="dsh-fl-note"><span class="dsh-fl-pos">green = up</span> · <span class="dsh-fl-neg">red = down</span>, price return shaded within each window; the grey figure is the latest index level (points).</p>`;
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
      markLive("wi", arr.map((x) => x && x.asOf).filter(Boolean).sort().pop());
    } catch { /* keep the sourced snapshot */ }
  }
  // A compact "market tape" strip (major indices + VIX) for the top of a
  // terminal pane — the equities analogue of the Macro regime-pills strip.
  function eqTapeHTML() {
    const majors = ["S&P 500", "Euro Stoxx 50", "FTSE 100", "DAX", "Nasdaq Composite"];
    const flat = (WORLD_INDICES.regions || []).flatMap((g) => g.rows || []);
    const pick = majors.map((nm) => flat.find((r) => r.name === nm)).filter(Boolean);
    // ONE consistent window (1-month) so the tape never mixes horizons; where a
    // 1M change is missing (e.g. Dow), show the level alone rather than borrow a
    // longer window and read as a same-scale move.
    // Each tile stacks name → level → 1-month change so the numbers read cleanly
    // and every tile is the same height (an inline level+change+window wrapped
    // raggedly at narrow widths). See .dsh-tape in dashboard.css.
    const tape = (r) => { const v = r.m1, cls = v == null ? "" : (v >= 0 ? "dsh-pill-up" : "dsh-pill-dn"),
      lv = r.level != null ? Number(r.level).toLocaleString("en-GB", { maximumFractionDigits: 0 }) : "—";
      const chg = v == null ? "" : `<span class="dsh-pill-chg ${cls}">${pct1(v)} <span class="dsh-pill-win">1M</span></span>`;
      return `<span class="dsh-pill"><span class="dsh-pill-k">${esc(r.name)}</span><span class="dsh-pill-lv">${lv}</span>${chg}</span>`; };
    const vix = EQ_VOL.find((v) => /vix/i.test(v.name));
    return `<div class="dsh-pills dsh-tape">${pick.map(tape).join("")}${vix ? `<span class="dsh-pill"><span class="dsh-pill-k">${esc(vix.name)}</span><span class="dsh-pill-lv">${vix.level != null ? vix.level.toFixed(1) : "—"}</span></span>` : ""}</div>`
      + `<div class="dsh-tape-as">${asOf(isoDay(WORLD_INDICES.asOf))}${srcLink((pick[0] || {}).source, "Index levels source")}</div>`;
  }
  function equitiesHTML() {
    const km = keyMomentsBody();
    const mid = `<section class="dsh-card dsh-span">${eqTapeHTML()}</section>
      <h3 class="dsh-term-lbl">Indices &amp; flows</h3>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">World indices — benchmarks by jurisdiction ${liveOr("wi")} ${asOf(isoDay(WORLD_INDICES.asOf))}</h3><div class="dsh-scroll" id="dsh-wi-box">${worldIndicesHeatHTML()}</div></section>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">ETF flows — net fund flows ${asOf(SECTOR_FLOWS.asOf)}</h3><div class="dsh-scroll" id="dsh-flows-box">${sectorFlowsHTML()}</div></section>
      <h3 class="dsh-term-lbl">Sectors &amp; valuation</h3>
      <section class="dsh-card"><h3 class="dsh-h">${esc(EQ_SECTORS.label || "S&P 500 sectors — YTD")} ${asOf(EQ_SECTORS.asOf)}${srcLink(EQ_SECTORS.source, "S&P sector performance")}</h3>${sectorBarsHTML()}</section>
      <section class="dsh-card"><h3 class="dsh-h">Valuation &amp; volatility</h3>${valVolHTML()}</section>
      <h3 class="dsh-term-lbl">Calendar &amp; pipeline</h3>
      <section class="dsh-card"><h3 class="dsh-h">Earnings calendar${srcLink(earnSrc, "Earnings week-ahead source")}</h3><div class="dsh-scroll">${earningsHTML()}</div></section>
      <section class="dsh-card"><h3 class="dsh-h">IPO / ECM pipeline</h3><div class="dsh-scroll">${ipoHTML()}</div></section>`;
    const news = km ? `<section class="dsh-card"><h3 class="dsh-h">Key moments <span class="dsh-n">why it moved</span></h3><div class="dsh-news dsh-km-wrap">${km}</div></section>` : "";
    return { mid, news, newsLabel: "Key moments" };
  }

  // ---- Credit -------------------------------------------------------------
  // Europe-first credit state: the spread stack (Euro HY leading), European +
  // US defaults & distress, the stress list (drills into Transactions), the
  // maturity wall and the deal/fund activity Wire itself tracks.
  // Stress table — sortable; each debtor drills into Transactions ▸ Credits.
  // Parse a debt string ("€15.5bn net", "~£19bn", "$25bn bonds") to a comparable
  // magnitude (currency-agnostic) so the table can rank by size of debt.
  const debtNum = (s) => {
    const m = String(s || "").replace(/,/g, "").match(/([\d.]+)\s*(tn|bn|m|k)?/i);
    if (!m) return 0;
    const n = parseFloat(m[1]) || 0;
    const u = (m[2] || "bn").toLowerCase();
    return n * (u === "tn" ? 1e12 : u === "bn" ? 1e9 : u === "m" ? 1e6 : u === "k" ? 1e3 : 1e9);
  };
  // Region from the HQ string — a US state/city ends ", US"; everything else on
  // the roster is European (the stress list is G7 + Western Europe only).
  const regionOf = (s) => (/,\s*US$/i.test(String(s.hq || "")) ? "US" : "Europe");
  // Default: Europe first, then grouped by status, biggest debt first inside.
  let _stressSort = { key: "region", dir: 1 };
  function stressRows() {
    const rows = CR_STRESS.map((s, i) => ({ ...s, region: regionOf(s), _i: i }));
    const k = _stressSort.key, dir = _stressSort.dir;
    const reg = (a, b) => (a.region === b.region ? 0 : a.region === "Europe" ? -1 : 1);
    if (k === "debt") rows.sort((a, b) => (debtNum(a.debt) - debtNum(b.debt)) * dir);
    else if (k === "region") rows.sort((a, b) => (reg(a, b) * dir) || String(a.status || "").localeCompare(String(b.status || "")) || (debtNum(b.debt) - debtNum(a.debt)));
    else if (k === "status") rows.sort((a, b) => (String(a.status || "").localeCompare(String(b.status || "")) * dir) || (debtNum(b.debt) - debtNum(a.debt)));
    else if (k) rows.sort((a, b) => String(a[k] || "").localeCompare(String(b[k] || "")) * dir);
    return rows;
  }
  const txCredits = (name) => `${ctx.base}/transactions/#/credits?q=${encodeURIComponent(String(name).replace(/\s*\(.*\)\s*$/, ""))}`;
  function stressHTML() {
    const chip = (k, l) => `<button type="button" class="dsh-sortchip${_stressSort.key === k ? " is-on" : ""}" data-sort="${k}">${l}${_stressSort.key === k ? (_stressSort.dir > 0 ? " ▲" : " ▼") : ""}</button>`;
    const row = (s) => `<tr>`
      + `<td class="dsh-nm"><a class="dsh-drill" href="${esc(txCredits(s.name))}" title="Open ${esc(s.name)} in Transactions">${esc(s.name)}</a></td>`
      + `<td class="dsh-stress-sec">${esc(s.sector || "")}</td>`
      + `<td class="dsh-stress-hq">${esc(s.hq || "")}</td>`
      + `<td class="dsh-stress-debt">${esc(s.debt)}</td>`
      + `<td><span class="dsh-tag dsh-tag-stress">${esc(s.status)}</span></td>`
      + `<td class="dsh-stress-as">${esc(s.latest || "—")}</td>`
      + `<td class="dsh-note">${srcLink(s.source, s.name + " source")}</td></tr>`;
    return `<div class="dsh-stresswrap">`
      + `<div class="dsh-sortbar"><span class="dsh-sortlbl">Sort by</span>${chip("region", "Region")}${chip("status", "Status")}${chip("debt", "Debt")}${chip("name", "Debtor")}</div>`
      + `<div class="dsh-scroll"><table class="dsh-tbl dsh-stresstbl" id="dsh-stress-body"><thead><tr><th>Debtor</th><th>Sector</th><th>HQ</th><th>Debt</th><th>Status</th><th>Latest</th><th>Src</th></tr></thead>`
      + `<tbody>${stressRows().map(row).join("")}</tbody></table></div></div>`;
  }
  // European loan maturities by year (S&P UBS index dashboard) — bar + cumulative %,
  // figures exactly as the dashboard's bar labels.
  function euWallHTML() {
    const ew = MATWALL && MATWALL.europeWall;
    if (!ew || !(ew.buckets || []).length) return "";
    const max = Math.max(...ew.buckets.map((b) => b.amt || 0)) || 1, tot = ew.buckets.reduce((s, b) => s + (b.amt || 0), 0) || 1;
    let cum = 0;
    const row = (b) => { cum += b.amt || 0; const pct = Math.max(2, Math.round((b.amt / max) * 100));
      return `<tr><td class="dsh-nm">${esc(b.y)}</td><td class="dsh-mw-barcell"><span class="dsh-mw-track"><span class="dsh-mw-fill" style="width:${pct}%"></span></span>`
        + `<span class="dsh-mw-hval">€${esc(b.amt.toFixed(2))}bn</span></td><td class="dsh-r">${Math.round((cum / tot) * 100)}%</td></tr>`; };
    return `<div class="dsh-mw-eu dsh-mw-euwall" data-mw="europe-wall"><div class="dsh-pc-reports-h">${esc(ew.title || "By year")}</div>`
      + `<table class="dsh-tbl dsh-mw-tbl dsh-mw-eutbl"><thead><tr><th>Year</th><th>Maturing</th><th class="dsh-r">Cumulative</th></tr></thead><tbody>${ew.buckets.map(row).join("")}</tbody></table>`
      + `<div class="dsh-ladder-cap">${esc(ew.note || "")} Data as of ${esc(ew.asOf || "")}.${srcLink(ew.src && ew.src.url, (ew.src && ew.src.name) || "source")}${srcLink(ew.src2 && ew.src2.url, (ew.src2 && ew.src2.name) || "index page")}</div></div>`;
  }
  function maturityHTML() {
    const w = MATWALL && MATWALL.rated, wall = MATWALL && MATWALL.ratedWall;
    if (!w) return "";
    const summary = `<div class="dsh-kvgrid">
      <div class="dsh-kv"><span class="dsh-kv-k">Rated corporate debt maturing</span><span class="dsh-kv-v">${esc(w.total)} <span class="dsh-band">${esc(w.window)}</span></span></div>
      <div class="dsh-kv"><span class="dsh-kv-k">Investment-grade share</span><span class="dsh-kv-v">${esc(String(w.igPct))}%${srcLink(w.src && w.src.url, "S&P maturity data")}</span></div>
    </div>`;
    // Europe first (the reader's market): LCD's European leveraged-loan wall, each row
    // with its own earlier reading where LCD published one.
    const eu = MATWALL.europe;
    const europe = eu && (eu.rows || []).length ? `<div class="dsh-mw-eu" data-mw="europe"><div class="dsh-pc-reports-h">${esc(eu.title || "Europe")} · LCD</div>`
      + `<div class="dsh-kvgrid">${eu.rows.map((x) => `<div class="dsh-kv"><span class="dsh-kv-k" title="${esc(x.k)}${x.sub ? " — " + esc(x.sub) : ""}">${esc(x.k)}</span>`
        + `<span class="dsh-kv-v">${esc(x.v)}${x.prev ? ` <span class="dsh-kv-yoy" title="earlier LCD reading">vs ${esc(x.prev)}</span>` : ""}</span></div>`).join("")}</div>`
      + `<div class="dsh-ladder-cap">${esc(eu.note || "")}${srcLink(eu.src && eu.src.url, (eu.src && eu.src.name) || "source")}${srcLink(eu.srcAlt && eu.srcAlt.url, (eu.srcAlt && eu.srcAlt.name) || "free copy")}${srcLink(eu.src2 && eu.src2.url, (eu.src2 && eu.src2.name) || "earlier reading")}</div></div>`
      + `<div class="dsh-pc-reports-h">Global rated corporate debt (S&amp;P)</div>` : "";
    let ladder = "";
    if (wall && Array.isArray(wall.buckets) && wall.buckets.length) {
      const max = wall.max || Math.max(...wall.buckets.map((b) => b.amt));
      const tot = wall.buckets.reduce((s, b) => s + (b.amt || 0), 0) || 1;
      const fmtB = (v) => v >= 1000 ? "$" + (v / 1000).toFixed(2) + "tn" : "$" + Math.round(v) + "bn";
      // Europe leads the per-year composition (the reader's market), then US, then the rest.
      const rank = (l) => (/europe/i.test(l) ? 0 : /^us$|united states/i.test(l) ? 1 : 2);
      const compCell = (b) => {
        const c = Array.isArray(b.comp) ? b.comp.filter((x) => x && x.label && x.amt != null).slice().sort((x, y) => rank(x.label) - rank(y.label)) : [];
        if (!c.length) return `<span class="dsh-mw-comp-na">—</span>`;
        return c.map((x) => `<span class="dsh-mw-comp-i"><span class="dsh-mw-comp-l">${esc(x.label)}</span> <span class="dsh-mw-comp-v">${esc(fmtB(x.amt))}</span></span>`).join("");
      };
      let cum = 0;
      const trow = (b) => { cum += b.amt || 0; const pct = Math.max(6, Math.round((b.amt / max) * 100));
        return `<tr><td class="dsh-nm">${esc(b.y)}</td>`
        + `<td class="dsh-mw-barcell"><span class="dsh-mw-track"><span class="dsh-mw-fill" style="width:${pct}%"></span></span><span class="dsh-mw-hval">$${(b.amt / 1000).toFixed(2)}tn</span></td>`
        + `<td class="dsh-mw-comp">${compCell(b)}</td>`
        + `<td class="dsh-r">${Math.round((cum / tot) * 100)}%</td></tr>`; };
      const anyComp = wall.buckets.some((b) => Array.isArray(b.comp) && b.comp.length);
      const table = `<table class="dsh-tbl dsh-mw-tbl"><thead><tr><th>Year</th><th>Maturing</th><th>Composition${anyComp && wall.compBy ? ` <span class="dsh-mw-comp-by">${esc(wall.compBy)}</span>` : ""}</th><th class="dsh-r">Cumulative</th></tr></thead><tbody>${wall.buckets.map(trow).join("")}</tbody></table>`;
      const cap = `<div class="dsh-ladder-cap">Face value maturing by year · ${esc(wall.asOf || "")}${wall.compNote ? ` · ${esc(wall.compNote)}` : ""}${srcLink(wall.src && wall.src.url, "S&P factbook")}</div>`;
      ladder = `<div class="dsh-mw-wall">${table}${cap}</div>`;
    }
    return euWallHTML() + europe + summary + ladder;
  }
  // Credit wire — the desk's freshest sourced deals/intel, DE-DUPLICATED (same
  // headline on the same day collapses) and capped. A deal opens in Wire's own
  // Transactions drawer (R36); an intel item links its source.
  const WIRE_CAP = 15;
  const _normHead = (h) => String(h || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  function creditWireItems() {
    const seen = new Set(), out = [];
    [...(deals || []).map((x) => ({ ...x, _deal: true })), ...(intel || [])]
      .filter((x) => x && x.date && (x.headline || x.title) && (x.sourceUrl || x.url))
      .sort(byDateDesc)
      .forEach((x) => {
        const u = x.sourceUrl || x.url;
        const k1 = `${x.date}|${_normHead(x.headline || x.title)}`, k2 = `u|${u}`;
        if (seen.has(k1) || seen.has(k2) || out.length >= WIRE_CAP) return;
        seen.add(k1); seen.add(k2); out.push(x);
      });
    return out;
  }
  function creditNewsHTML() {
    const items = creditWireItems();
    if (!items.length) return "";
    const row = (x) => {
      const inApp = x._deal && x.id;
      const href = inApp ? `${ctx.base}/transactions/#/deal/${encodeURIComponent(x.id)}` : (x.sourceUrl || x.url);
      const attrs = inApp ? ` class="dsh-drill"` : ` target="_blank" rel="noopener noreferrer"`;
      return `<li class="dsh-news-i"><span class="dsh-news-d">${esc(fmtDate(x.date))}</span>`
        + `<a href="${esc(href)}"${attrs}>${txt(x.headline || x.title)}</a></li>`;
    };
    return `<ul class="dsh-news">${items.map(row).join("")}</ul>`;
  }
  // US private credit — Fitch's PCDR + KBRA's middle-market monitor and market
  // context (PRIVATE_CREDIT). Every metric links its source; a `prev` shows the
  // year-ago comparison with its own source.
  function privateCreditHTML() {
    const P = PRIVATE_CREDIT;
    if (!P || !(P.metrics || []).length) return "";
    const yoy = (x) => x.prev
      ? `<a class="dsh-kv-yoy" href="${esc(x.prevSrc || x.src)}" target="_blank" rel="noopener noreferrer" title="a year earlier${x.prevAsOf ? ` (${esc(x.prevAsOf)})` : ""} — source">vs ${esc(x.prev)}${x.prevAsOf ? ` ${esc(x.prevAsOf)}` : ""}</a>`
      : "";
    const kv = (x) => `<div class="dsh-kv"><span class="dsh-kv-k" title="${esc(x.k)}${x.sub ? " — " + esc(x.sub) : ""}">${esc(x.k)}</span>`
      + `<span class="dsh-kv-v">${esc(x.v)}${yoy(x)}${srcLink(x.src, (x.srcName || "source") + " — source")}</span></div>`;
    const rpt = (r) => `<a class="dsh-pc-report" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" title="${esc(r.title)}">`
      + `<span class="dsh-pc-report-t">${esc(r.title)}</span><span class="dsh-pc-report-d">${esc(r.date || r.srcName || "")}</span></a>`;
    const reports = (P.reports || []).length
      ? `<div class="dsh-pc-reports"><div class="dsh-pc-reports-h">Research</div>${P.reports.map(rpt).join("")}</div>`
      : "";
    return `<div class="dsh-kvgrid dsh-pc-grid">${P.metrics.map(kv).join("")}</div>${reports}`;
  }
  // Europe — defaults & distress: the curated, sourced European default/distress
  // rates (EU_DISTRESS) plus the LIVE Eurostat bankruptcy index (/api/eurates).
  function euDistressHTML() {
    const E = EU_DISTRESS || {};
    const kv = (x) => `<div class="dsh-kv"><span class="dsh-kv-k" title="${esc(x.k)}${x.sub ? " — " + esc(x.sub) : ""}">${esc(x.k)}</span>`
      + `<span class="dsh-kv-v">${x.v != null ? esc(x.v) : "—"}${x.asOf ? ` <span class="dsh-asof">${esc(x.asOf)}</span>` : ""}${srcLink(x.src, (x.srcName || "source") + " — source")}</span></div>`;
    // Live Eurostat reading when loaded; else the last verified reading (labelled by its own quarter).
    const b = (_eu && _eu.bankruptcies && _eu.bankruptcies.value != null) ? _eu.bankruptcies : (E.bankruptcyFallback && E.bankruptcyFallback.value != null ? E.bankruptcyFallback : null);
    const bk = b
      ? `<div class="dsh-kv" id="dsh-eu-bkrt"><span class="dsh-kv-k" title="Eurostat sts_rb_q, EU27, seasonally & calendar adjusted, 2021=100">EU bankruptcy declarations (index)</span>`
        + `<span class="dsh-kv-v">${esc(b.value.toFixed(1))}${b.yearAgo != null ? `<span class="dsh-kv-yoy" title="a year earlier (${esc(b.yearAgoAsOf || "")})">vs ${esc(b.yearAgo.toFixed(1))} ${esc(b.yearAgoAsOf || "")}</span>` : ""} <span class="dsh-asof">${esc(b.asOf)}</span>${srcLink(b.href, "Eurostat")}</span></div>`
      : `<div class="dsh-kv" id="dsh-eu-bkrt"><span class="dsh-kv-k">EU bankruptcy declarations (index)</span><span class="dsh-kv-v">—${srcLink("https://ec.europa.eu/eurostat/databrowser/view/sts_rb_q/default/table", "Eurostat")}</span></div>`;
    return `<div class="dsh-kvgrid dsh-pc-grid">${(E.metrics || []).map(kv).join("")}${bk}</div>`;
  }
  // Activity Wire itself tracks — European CLO pricings and private-credit fund
  // closes counted from the desk's own sourced deal records (labelled as tracked
  // by Wire, never presented as a market-wide statistic).
  const isEuro = (x) => /€|\bEUR\b|\beuro(pe|pean)?\b|\bUK\b|£|\bGBP\b|sterling/i.test(`${x.headline || ""} ${x.summary || ""}`);
  const isClo = (x) => x.type === "CLO" || x.clo === true;
  const isClose = (x) => /final close|fundraise|first close/i.test(x.type || "");
  function activityHTML() {
    const D = (deals || []).filter((x) => x && x.date);
    const now = new Date(), ym = (d) => d.toISOString().slice(0, 7);
    const m0 = ym(now), m1 = ym(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))), m2 = ym(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1)));
    const cnt = (f, m) => D.filter((x) => f(x) && String(x.date).slice(0, 7) === m).length;
    const lines = [["European CLOs priced", (x) => isClo(x) && isEuro(x)], ["All CLOs priced", isClo], ["Fund closes / raises", isClose], ["European deals (all types)", isEuro]];
    const mo = (m) => MONTHS[+m.slice(5) - 1];
    const head = `<tr><th>Tracked by Wire</th><th class="dsh-r">${mo(m2)}</th><th class="dsh-r">${mo(m1)}</th><th class="dsh-r" title="month to date">${mo(m0)}*</th></tr>`;
    const rows = lines.map(([l, f]) => `<tr><td class="dsh-nm">${esc(l)}</td><td class="dsh-r">${cnt(f, m2)}</td><td class="dsh-r">${cnt(f, m1)}</td><td class="dsh-r">${cnt(f, m0)}</td></tr>`).join("");
    const latest = D.filter((x) => (isClo(x) || isClose(x))).sort(byDateDesc).slice(0, 5)
      .map((x) => `<li class="dsh-news-i"><span class="dsh-news-d">${esc(fmtDate(x.date))}</span><a class="dsh-drill" href="${esc(`${ctx.base}/transactions/#/deal/${encodeURIComponent(x.id)}`)}">${txt(x.headline)}</a></li>`).join("");
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-act-tbl"><thead>${head}</thead><tbody>${rows}</tbody></table></div>`
      + (latest ? `<div class="dsh-pc-reports-h">Latest CLOs &amp; fund closes</div><ul class="dsh-news dsh-act-list">${latest}</ul>` : "");
  }
  function creditHTML() {
    const mid = `<section class="dsh-card dsh-span dsh-spreads-card"><h3 class="dsh-h">Credit spreads — ICE BofA OAS ${liveOr("spreads")}</h3><div id="dsh-spreads" class="dsh-spreads">${spreadsBody()}</div></section>
      <h3 class="dsh-term-lbl">Defaults &amp; distress</h3>
      <div class="dsh-wide dsh-row2">
        <section class="dsh-card dsh-pc-card"><h3 class="dsh-h">Europe — defaults &amp; distress ${asOf(EU_DISTRESS && EU_DISTRESS.asOf)}</h3><div id="dsh-eu-distress">${euDistressHTML()}</div></section>
        <section class="dsh-card dsh-pc-card"><h3 class="dsh-h">US private credit ${asOf(PRIVATE_CREDIT && PRIVATE_CREDIT.asOf)}</h3>${privateCreditHTML()}</section>
      </div>
      <h3 class="dsh-term-lbl">Stress &amp; refinancing</h3>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">Stress — situations in focus <span class="dsh-n">(${CR_STRESS.length})</span></h3>${stressHTML()}</section>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">Maturity wall ${asOf(MATWALL && ((MATWALL.europeWall && MATWALL.europeWall.asOf) || (MATWALL.europe && MATWALL.europe.asOf) || (MATWALL.ratedWall && MATWALL.ratedWall.asOf)))}</h3><div class="dsh-scroll">${maturityHTML()}</div></section>
      <h3 class="dsh-term-lbl">Activity</h3>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">CLOs &amp; fund closes ${asOf(isoDay(new Date().toISOString().slice(0, 10)))}</h3>${activityHTML()}</section>`;
    const news = `<section class="dsh-card"><h3 class="dsh-h">Credit wire — latest deals &amp; intel</h3>${creditNewsHTML()}</section>`;
    return { mid, news, newsLabel: "Credit wire" };
  }
  // ICE BofA OAS stack from /api/rates. The feed reports OAS in PERCENT (3.11 =
  // 311bp) — converted to basis points here. Euro HY leads; each tile shows the
  // level, its 1W / 1M move (from the feed's ~1-month daily history) and as-of.
  const SPREAD_ORDER = [/euro hy/i, /us hy/i, /us ig/i, /us ccc/i];
  function spreadsBody() {
    const arr = Array.isArray(_rates && _rates.rates) ? _rates.rates : [];
    const rows = arr.filter((x) => x && /oas/i.test(x.label || "") && x.value != null)
      .sort((a, b) => { const r = (x) => { const i = SPREAD_ORDER.findIndex((re) => re.test(x.label)); return i < 0 ? 9 : i; }; return r(a) - r(b); });
    if (!rows.length) {
      return _rates === null ? `<p class="dsh-load">Loading live spreads…</p>`
        : `<p class="dsh-load">Live spreads unavailable — <a href="https://fred.stlouisfed.org/series/BAMLHE00EHYIOAS" target="_blank" rel="noopener noreferrer">FRED Euro HY OAS</a> · <a href="https://fred.stlouisfed.org/series/BAMLH0A0HYM2" target="_blank" rel="noopener noreferrer">US HY OAS</a></p>`;
    }
    const bp = (v) => Math.round(v * 100);
    const back = (h, k) => (Array.isArray(h) && h.length > k ? h[h.length - 1 - k] : null);
    const chg = (x, k, lbl) => {
      const p = back(x.history, k);
      if (p == null || !Number.isFinite(+p)) return `<span class="dsh-spread-c">${lbl} —</span>`;
      const d = bp(x.value) - bp(+p);
      return `<span class="dsh-spread-c ${d > 0 ? "down" : d < 0 ? "up" : ""}" title="${lbl} change in basis points (wider = red)">${lbl} ${d > 0 ? "+" : ""}${d}</span>`;
    };
    return rows.map((x) => `<div class="dsh-spread"><span class="dsh-spread-nm">${esc(String(x.label).replace(/\s*OAS$/i, ""))}</span>`
      + `<span class="dsh-spread-v">${bp(x.value)}<span class="dsh-spread-u">bp</span></span>`
      + `<span class="dsh-spread-cs">${chg(x, 5, "1W")}${chg(x, 21, "1M")}</span>`
      + `<span class="dsh-spread-as">${x.asOf ? esc(isoDay(x.asOf)) : ""}${srcLink(x.href, "FRED")}</span></div>`).join("");
  }
  async function loadRates() {
    try {
      const r = await fetch("/api/rates", { headers: { accept: "application/json" } });
      const d = r.ok ? await r.json() : null;
      _rates = d && typeof d === "object" ? d : {};
    } catch { _rates = {}; }
    const el = host.querySelector("#dsh-spreads");
    if (el) el.innerHTML = spreadsBody();
    const oas = (Array.isArray(_rates.rates) ? _rates.rates : []).filter((x) => x && /oas/i.test(x.label || "") && x.value != null);
    if (oas.length) markLive("spreads", oas.map((x) => x.asOf).filter(Boolean).sort().pop());
    const mm = host.querySelector("#dsh-mm");
    if (mm) mm.innerHTML = moneyMarketsHTML();
  }
  async function loadEu() {
    try {
      const r = await fetch("/api/eurates", { headers: { accept: "application/json" } });
      const d = r.ok ? await r.json() : null;
      _eu = d && typeof d === "object" ? d : {};
    } catch { _eu = {}; }
    const set = (sel, html) => { const el = host.querySelector(sel); if (el) el.innerHTML = html; };
    set("#dsh-eu-distress", euDistressHTML());
    set("#dsh-mm", moneyMarketsHTML());
    set("#dsh-policy", policyHTML());
    const yc = host.querySelector("#dsh-yc-card"); if (yc) yc.innerHTML = yieldCurveCardHTML();
    const live = (_eu.series || []).filter((x) => x && x.value != null);
    if (live.length) markLive("mm", live.map((x) => x.asOf).filter(Boolean).sort().pop());
  }

  // ---- Macro --------------------------------------------------------------
  // Regime pills: the three central banks' stance + the cycle read, a quick
  // top-of-page state drawn from the macro desk's own fields (ECB first).
  function regimePillsHTML() {
    const pill = (label, val, cls) => `<span class="dsh-pill ${cls || ""}"><span class="dsh-pill-k">${esc(label)}</span><span class="dsh-pill-v">${esc(val)}</span></span>`;
    const st = (o) => stripTags((o && o.stance) || "—");
    const cyc = (CYCLE && CYCLE.us && CYCLE.us.shortStage) || "—";
    return `<div class="dsh-pills">`
      + pill("EA · ECB", st(OUTLOOK && OUTLOOK.ecb))
      + pill("UK · BoE", st(OUTLOOK && OUTLOOK.uk))
      + pill("US · Fed", st(OUTLOOK && OUTLOOK.us))
      + pill("Cycle", stripTags(String(cyc)))
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
      const row = (r) => `<div class="dsh-kv dsh-kv-vote" title="${esc(stripTags(r.decision || ""))}${r.dissent ? " · " + esc(r.dissent) : " · unanimous"}"><span class="dsh-kv-k">${esc(r.date)}</span><span class="dsh-kv-v"><span class="dsh-tally">${esc(r.tally)}</span>${r.lean ? `<span class="dsh-band">${esc(r.lean)}</span>` : ""}</span></div>`;
      votes = `<div class="dsh-fed-blk"><div class="dsh-fed-h">MPC vote splits <span class="dsh-mut">${esc(v.latestMeeting || "")}</span>${srcLink(v.href, "BoE minutes")}</div>`
        + `<div class="dsh-kvgrid">${v.history.slice(0, 4).map(row).join("")}</div></div>`;
    }
    if (!sonia && !votes) return "";
    return `<div class="dsh-fed">${sonia}${votes}</div>`;
  }
  // Policy rates — one row per central bank (ECB · BoE · Fed): the current rate
  // (LIVE from the ECB / BoE databases where loaded, else the desk's curated
  // figure), the next meeting, the concise stance read and the as-of date.
  const euSer = (k) => ((_eu && _eu.series) || []).find((x) => x && x.key === k && x.value != null) || null;
  const fmtPct = (v, dp = 2) => (v == null ? "—" : `${(+v).toFixed(dp)}%`);
  function policyHTML() {
    const row = (name, o, live, src) => {
      if (!o && !live) return "";
      const rate = live ? fmtPct(live.value) : esc(stripTags((o && o.rate) || "—"));
      const asof = live ? isoDay(live.asOf) : ((o && o.asOf) || "");
      const read = esc(stripTags((o && (o.stance || o.bottomLine)) || ""));
      return `<tr><td class="dsh-nm">${esc(name)}</td>`
        + `<td class="dsh-r">${rate}${live ? ` <span class="dsh-live" title="Live · ${esc(live.source || "")}">live</span>` : ""}</td>`
        + `<td>${esc(stripTags((o && o.next) || "—"))}</td>`
        + `<td class="dsh-ro-read"><span class="dsh-clamp2">${read || "—"}</span></td>`
        + `<td class="dsh-stress-as">${esc(asof)}${srcLink(live ? live.href : src, name + " source")}</td></tr>`;
    };
    const ecb = OUTLOOK && OUTLOOK.ecb, uk = OUTLOOK && OUTLOOK.uk, us = OUTLOOK && OUTLOOK.us;
    const srcOf = (o, fb) => (o && o.href) || fb;
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-ro-tbl"><thead><tr><th>Bank</th><th class="dsh-r">Rate</th><th>Next meeting</th><th>Read</th><th>As of</th></tr></thead>`
      + `<tbody>${row("ECB · deposit", ecb, euSer("ecb_dfr"), srcOf(ecb, "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html"))}`
      + `${row("BoE · Bank Rate", uk, euSer("boe_bank"), srcOf(uk, "https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate"))}`
      + `${row("Fed · funds target", us, null, srcOf(us, "https://www.federalreserve.gov/monetarypolicy/openmarket.htm"))}</tbody></table></div>`;
  }
  // Money markets — the floating-rate bases in European facilities: €STR, 3M
  // Euribor (ECB monthly average — daily fixings are EMMI-licensed), SONIA, plus
  // SOFR from the rates feed. Level · 1W / 1M move in bp · as-of · source.
  function moneyMarketsHTML() {
    const sofr = (Array.isArray(_rates && _rates.rates) ? _rates.rates : []).find((x) => x && x.label === "SOFR" && x.value != null);
    const items = [euSer("estr"), euSer("euribor3m"), euSer("sonia"),
      sofr ? { label: "SOFR", value: sofr.value, asOf: sofr.asOf, chg1w: null, chg1m: null, href: sofr.href, source: "NY Fed" } : null];
    if (!items.some(Boolean)) {
      return (_eu === null ? `<p class="dsh-load">Loading money-market rates…</p>` : `<p class="dsh-load">Money-market rates unavailable — <a href="https://data.ecb.europa.eu/" target="_blank" rel="noopener noreferrer">ECB Data Portal</a> · <a href="https://www.bankofengland.co.uk/boeapps/database/" target="_blank" rel="noopener noreferrer">BoE database</a></p>`);
    }
    const c = (v, l) => { if (v == null) return ""; const bp = Math.round(v * 100); return `<span class="dsh-spread-c ${bp > 0 ? "down" : bp < 0 ? "up" : ""}">${l} ${bp > 0 ? "+" : ""}${bp}bp</span>`; };
    return items.filter(Boolean).map((x) => `<div class="dsh-spread"><span class="dsh-spread-nm">${esc(x.label)}</span>`
      + `<span class="dsh-spread-v">${(+x.value).toFixed(3)}<span class="dsh-spread-u">%</span></span>`
      + `<span class="dsh-spread-cs">${c(x.chg1w, "1W")}${c(x.chg1m, "1M")}</span>`
      + `<span class="dsh-spread-as">${esc(/^\d{4}-\d{2}$/.test(x.asOf || "") ? `${MONTHS[+x.asOf.slice(5) - 1]} ${x.asOf.slice(0, 4)} avg` : isoDay(x.asOf))}${srcLink(x.href, x.source || "source")}</span></div>`).join("");
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
  // Euro-area AAA curve (ECB, live) aligned to the panel's maturities, or null.
  function euCurve(mats) {
    const c = _eu && _eu.curve;
    if (!c || !Array.isArray(c.tenors) || !Array.isArray(c.points)) return null;
    const v = (mats || []).map((m) => { const i = c.tenors.indexOf(m); const p = i >= 0 ? c.points[i] : null; return p && p.value != null ? +p.value : null; });
    return v.some((x) => x != null) ? v : null;
  }
  // Dots, tenor axis labels and the value table all share ONE column grid: a fixed
  // 92px label column, then N equal tenor columns. The plot stretches to fill
  // (preserveAspectRatio none) with each point at its column CENTRE, the axis
  // labels are an N-column grid offset by the same 92px, and the table is
  // fixed-layout with a 92px first column and N centred value columns — so the 3M
  // dot, the "3M" label and the 3M yields line up exactly.
  function yieldCurveHTML() {
    const yc = mergedYC(); if (!yc || !yc.maturities) return "";
    const mats = yc.maturities, us = yc.us || [], uk = yc.uk || [];
    const ea = euCurve(mats);
    const all = [...us, ...uk, ...(ea || [])].filter((v) => v != null);
    const lo = Math.min(...all) - 0.2, hi = Math.max(...all) + 0.2;
    const N = mats.length, W = 100 * N, H = 120, padY = 10;
    const x = (i) => (i + 0.5) * (W / N);
    const y = (v) => padY + (1 - (v - lo) / (hi - lo)) * (H - 2 * padY);
    const path = (arr) => arr.map((v, i) => v == null ? "" : ((i && arr[i - 1] != null ? "L" : "M") + x(i).toFixed(1) + "," + y(v).toFixed(1))).join(" ");
    const dots = (arr, cls) => arr.map((v, i) => v == null ? "" : `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.5" class="${cls}" vector-effect="non-scaling-stroke"/>`).join("");
    const svg = `<div class="dsh-yc2-plot"><svg class="dsh-yc-svg dsh-yc2-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="US and UK yield curves">`
      + `<path d="${path(us)}" class="dsh-yc-us" fill="none" vector-effect="non-scaling-stroke"/>${dots(us, "dsh-yc-us-d")}`
      + `<path d="${path(uk)}" class="dsh-yc-uk" fill="none" vector-effect="non-scaling-stroke"/>${dots(uk, "dsh-yc-uk-d")}`
      + (ea ? `<path d="${path(ea)}" class="dsh-yc-ea" fill="none" vector-effect="non-scaling-stroke"/>${dots(ea, "dsh-yc-ea-d")}` : "") + `</svg></div>`
      + `<div class="dsh-yc2-x" style="--n:${N}">${mats.map((m) => `<span>${esc(m)}</span>`).join("")}</div>`;
    const rowFor = (arr, lbl, cls) => `<tr><td class="dsh-nm"><span class="dsh-yc-key ${cls}"></span>${lbl}</td>${arr.map((v) => `<td>${v != null ? esc(v.toFixed(2)) : "—"}</td>`).join("")}</tr>`;
    const table = `<table class="dsh-tbl dsh-yc2-tbl"><thead><tr><th>Curve</th>${mats.map((m) => `<th>${esc(m)}</th>`).join("")}</tr></thead><tbody>${ea ? rowFor(ea, "Euro AAA", "dsh-yc-ea") : ""}${rowFor(uk, "UK gilts", "dsh-yc-uk")}${rowFor(us, "US Treasury", "dsh-yc-us")}</tbody></table>`;
    const src = (yc.sources && yc.sources[0]) || null;
    const eaCap = ea ? ` · Euro AAA ${esc(isoDay(_eu.curve.asOf))} · <a href="${esc(_eu.curve.href)}" target="_blank" rel="noopener noreferrer">ECB</a>` : "";
    return `<div class="dsh-yc dsh-yc2 dsh-scroll">${svg}${table}</div>` + (src ? `<div class="dsh-ladder-cap">${esc(yc.asOf || "")} · <a href="${esc(src[1])}" target="_blank" rel="noopener noreferrer">${esc(src[0])}</a>${eaCap}</div>` : "");
  }
  // The whole Yield-curve card (header "as of" + body) so loadYieldCurve() can
  // repaint it in place once the live curve lands — header date included.
  function yieldCurveCardHTML() {
    return `<h3 class="dsh-h">Yield curves — Euro AAA · gilts · Treasuries ${_ycLive ? `<span class="dsh-live" title="Live">live</span>` : liveTag("yc")} ${asOf(mergedYC().asOf)}</h3>${yieldCurveHTML()}`;
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
  // Multi-country term structure (Bonds pane) — every country's 2Y/5Y/10Y/
  // 30Y yields from GOVT_YIELDS as a table, one colour key per country. The old
  // 14-line overlay chart added little over the numbers in a narrow tile, so it
  // was dropped in favour of the table alone.
  const YC_TENORS = [["y2", "2Y"], ["y5", "5Y"], ["y10", "10Y"], ["y30", "30Y"]];
  // Macro scope is the G7 + Western Europe (HOUSE_STYLE R4c): the sovereign tables
  // show only those rows (the snapshot may carry others; they are not rendered).
  const SOV_SCOPE = new Set(["United States", "Canada", "United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Austria", "Portugal", "Ireland", "Switzerland", "Sweden", "Norway", "Denmark", "Finland", "Japan"]);
  const sovRegions = () => ((GOVT_YIELDS && GOVT_YIELDS.regions) || []).map((g) => ({ ...g, rows: (g.rows || []).filter((r) => SOV_SCOPE.has(r.country)) })).filter((g) => g.rows.length);
  function worldYieldCurveHTML() {
    const regs = sovRegions(); if (!regs.length) return "";
    const rows = regs.flatMap((g) => (g.rows || []).map((r) => ({ ...r, region: g.region })));
    if (!rows.length) return "";
    // Live where available: the /api/govyields feed carries the current level per
    // tenor (US, from FRED daily) — use it, else the sourced GOVT_YIELDS snapshot.
    const lvl = (r, k) => { const t = _gyLive && _gyLive[r.country] && _gyLive[r.country][k]; return (t && t.v != null) ? t.v : r[k]; };
    // Heatmap: shade each level cell by how far it sits from the ~2% policy-target
    // yield — GREEN below 2%, RED above — with intensity scaled per tenor by the
    // widest deviation in that column, so at-target reads neutral and the high-yield
    // outliers (Brazil, India) and the low-yield havens (Switzerland) both stand out.
    const TARGET = 2;
    const maxDev = {};
    YC_TENORS.forEach(([k]) => {
      const devs = rows.map((r) => lvl(r, k)).filter((v) => v != null).map((v) => Math.abs(v - TARGET));
      maxDev[k] = devs.length ? Math.max(0.25, ...devs) : null;
    });
    const heat = (v, k) => {
      const md = maxDev[k]; if (v == null || !md) return "";
      const dev = v - TARGET;
      if (Math.abs(dev) < 0.03) return "";                       // ~at target → no shade
      const a = (Math.abs(dev) / md) * 0.6 + 0.08;
      return ` style="background:color-mix(in srgb, var(--t-${dev < 0 ? "up" : "down"}) ${(a * 100).toFixed(1)}%, transparent)"`;
    };
    const rowFor = (r) => `<tr><td class="dsh-nm">`
      + `${r.source ? `<a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">${esc(r.country)}</a>` : esc(r.country)}</td>`
      + `${YC_TENORS.map(([k]) => { const v = lvl(r, k); return `<td class="dsh-r dsh-fl"${heat(v, k)}>${v != null ? esc(v.toFixed(2)) : "—"}</td>`; }).join("")}</tr>`;
    return `<table class="dsh-tbl dsh-fl-tbl"><thead><tr><th>Country</th>${YC_TENORS.map(([, l]) => `<th class="dsh-r">${esc(l)}</th>`).join("")}</tr></thead><tbody>${rows.map(rowFor).join("")}</tbody></table>`
      + `<p class="dsh-fl-note"><span class="dsh-fl-pos">green below 2%</span> · <span class="dsh-fl-neg">red above</span></p>`;
  }
  // Embedded macro news wire — the desk's US + UK headlines, linked to source.
  function macroNewsHTML() {
    const items = [...((NEWS && NEWS.us) || []), ...((NEWS && NEWS.uk) || [])]
      .filter((x) => x && x.title && x.url)
      .sort((a, b) => byDateDesc(a, b) || String(b.time || "").localeCompare(String(a.time || "")))
      .slice(0, 50);
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
    // The cycle narrative is curated static prose (macro/js/content.js) authored with
    // intentional <strong>/<em> emphasis, so render its markup rather than escaping it.
    const paras = (arr) => (arr || []).map((p) => `<p class="dsh-cyc-note">${p}</p>`).join("");
    const srcRow = (sources) => { const s = (sources || []).map(([l, u]) => `<a class="dsh-cyc-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(l)}</a>`).join(""); return s ? `<div class="dsh-cyc-srcs">${s}</div>` : ""; };
    // The full narrative sits behind a per-block expand/collapse, collapsed by
    // default (native <details>; the dashboard click handler ignores <summary>).
    const details = (body) => `<details class="dsh-cyc-exp"><summary class="dsh-cyc-sum"><span class="dsh-cyc-more">Show detail</span><span class="dsh-cyc-less">Hide detail</span></summary><div class="dsh-cyc-body">${body}</div></details>`;

    // Each block splits into a meters column (US/UK bars + short stage) and a
    // narrative column beside it: the framework intro reads inline, and the fuller
    // per-region detail + sources stay behind the expand toggle.
    const meters = (a, b) => `<div class="dsh-cyc-meters">` + meter("US", a) + meter("UK", b) + `</div>`;
    const debtInline = paras(CYCLE.framework);
    const debtFull = `<p class="dsh-cyc-sub">United States</p>` + paras(CYCLE.us.body)
      + `<p class="dsh-cyc-sub">United Kingdom</p>` + paras(CYCLE.uk.body)
      + srcRow(CYCLE.sources)
      + `<p class="dsh-cyc-note dsh-mut">${esc(CYCLE.note || "")}</p>`;
    const debt = `<div class="dsh-cyc-blk"><div class="dsh-cyc-hd"><div class="dsh-cyc-hd-t">Debt cycle <span>Ray Dalio · 0 early → 100 crisis</span></div>`
      + meters(CYCLE.us.pos, CYCLE.uk.pos) + `</div>`
      + `<div class="dsh-cyc-narr"><p class="dsh-cyc-note dsh-mut">${esc(stripTags(String(CYCLE.us.shortStage || "")))} (US) · ${esc(stripTags(String(CYCLE.uk.shortStage || "")))} (UK)</p>`
      + debtInline + details(debtFull) + `</div>`
      + `</div>`;

    // US / UK meters + a grey per-region descriptor, matching the Debt cycle block.
    const mcUs = mc.us || { pos: mc.pos, shortStage: mc.short }, mcUk = mc.uk || {};
    const mktInline = paras(mc.framework);
    const mktFull = `<p class="dsh-cyc-sub">Where we stand</p>` + paras(mc.stand)
      + srcRow(mc.sources)
      + `<p class="dsh-cyc-note dsh-mut">${esc(mc.note || "")}</p>`;
    const market = `<div class="dsh-cyc-blk"><div class="dsh-cyc-hd"><div class="dsh-cyc-hd-t">Market cycle <span>Howard Marks · 0 capitulation → 100 mania</span></div>`
      + meters(mcUs.pos, mcUk.pos) + `</div>`
      + `<div class="dsh-cyc-narr"><p class="dsh-cyc-note dsh-mut">${esc(stripTags(String(mcUs.shortStage || "")))} (US) · ${esc(stripTags(String(mcUk.shortStage || "")))} (UK)</p>`
      + mktInline + details(mktFull) + `</div>`
      + `</div>`;
    // Two blocks, returned separately so the Macro pane can place each in its own
    // tile (a break down the middle, like the paired rows above) — each keeps the
    // .dsh-cyc wrapper so the meters/heads/toggles stay scoped as before.
    return { debt: `<div class="dsh-cyc">${debt}</div>`, market: `<div class="dsh-cyc">${market}</div>` };
  }
  // The Macro pane is a fixed-viewport terminal (option 4): three side-by-side
  // panes that fill the screen and each scroll internally — Policy rates (Fed/BoE
  // paths, rate outlook, yield curve), Cycle (Dalio debt + Marks market cycle) and
  // the Macro wire rail. The regime pills strip spans the top as a shared read.
  // Market sizes — a matrix of the world's investable markets by asset class ×
  // region, with the latest size and 1Y/5Y/10Y trend arrows (▲/▼/–). Reuses the
  // world-indices band + heat-table furniture. Every size/direction is sourced
  // (MARKET_SIZES, macro/js/content.js); a size that isn't cleanly published on a
  // comparable basis shows "—" while its arrows stay (each independently sourced).
  function marketSizesHTML() {
    const M = MARKET_SIZES;
    if (!M || !(M.classes || []).length) return "";
    const arrow = (d) => d === 1 ? `<span class="dsh-ms-t up" title="Larger than a year/5y/10y ago">▲</span>`
      : d === -1 ? `<span class="dsh-ms-t down" title="Smaller">▼</span>`
      : d === 0 ? `<span class="dsh-ms-t flat" title="Broadly flat">–</span>`
      : `<span class="dsh-ms-t na" title="Exact change not published">·</span>`;
    // A horizon cell: the sourced % where one is published (green/red by sign),
    // otherwise the direction arrow (no fabricated number).
    const cell = (pct, dir) => {
      if (pct) { const cls = /^-/.test(pct) ? "down" : "up"; return `<td class="dsh-r dsh-ms-a"><span class="dsh-ms-p ${cls}">${esc(pct)}</span></td>`; }
      return `<td class="dsh-r dsh-ms-a">${arrow(dir)}</td>`;
    };
    const row = (r) => {
      const nm = r.source
        ? `<a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer"${r.note ? ` title="${esc(r.note)}"` : ""}>${esc(r.region)}</a>`
        : esc(r.region);
      const up = r.up || [], pc = r.pct || [];
      return `<tr><td class="dsh-ms-nm">${nm}</td>`
        + `<td class="dsh-ms-sz">${r.size ? esc(r.size) : "—"}${r.asOf ? ` <span class="dsh-ms-as">${esc(r.asOf)}</span>` : ""}</td>`
        + cell(pc[0], up[0]) + cell(pc[1], up[1]) + cell(pc[2], up[2]) + `</tr>`;
    };
    // Asset classes laid out SIDE BY SIDE (one block each), filling the full width;
    // blocks wrap to fewer columns as the card narrows.
    const block = (c) => `<div class="dsh-ms-col">`
      + `<div class="dsh-ms-col-h">${esc(c.label)}${c.sub ? ` <span class="dsh-ms-sub">${esc(c.sub)}</span>` : ""}</div>`
      + `<table class="dsh-fl-tbl dsh-ms-tbl"><thead><tr><th class="dsh-ms-nm"></th><th class="dsh-ms-sz">Size</th>`
      + `<th class="dsh-r dsh-ms-a">1Y</th><th class="dsh-r dsh-ms-a">5Y</th><th class="dsh-r dsh-ms-a">10Y</th></tr></thead>`
      + `<tbody>${(c.rows || []).map(row).join("")}</tbody></table></div>`;
    return `<div class="dsh-ms-grid">${M.classes.map(block).join("")}</div>`;
  }
  // ---- Bonds --------------------------------------------------------------
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
    const G = { regions: sovRegions() };
    if (!G.regions.length) return "";
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
    const heat = (c, w) => { if (c == null) return ""; const a = (Math.abs(c) / maxAbs[w]) * 0.62 + 0.10; return ` style="background:color-mix(in srgb, var(--t-${c <= 0 ? "up" : "down"}) ${(a * 100).toFixed(1)}%, transparent)"`; };
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
    return `<table class="dsh-tbl dsh-fl-tbl"><thead><tr><th>Country</th>${YCHG_WINS.map(([, l]) => `<th class="dsh-r">${l}</th>`).join("")}</tr></thead>`
      + `<tbody>${G.regions.map(group).join("")}</tbody></table>`
      + `<p class="dsh-fl-note"><span class="dsh-fl-pos">green = yield fell</span> · <span class="dsh-fl-neg">red = yield rose</span> (${esc(tl)}, bp)</p>`;
  }
  // Bond-duration selector — lives in the card HEADER (top-right, in line with the
  // title), not the table body, so it survives the body's live re-renders.
  function yldSelectHTML() {
    return `<select id="dsh-yld-tenor" class="dsh-hf-sel dsh-yld-sel" aria-label="Bond duration">`
      + `${YLD_TENORS.map(([k, l]) => `<option value="${k}"${k === _yldTenor ? " selected" : ""}>${l}</option>`).join("")}</select>`;
  }
  function wireYields() {
    const box = host.querySelector("#dsh-yld");
    if (!box) return;
    // The select sits in the header (outside #dsh-yld), so listen on the card.
    const card = box.closest(".dsh-card") || host;
    card.addEventListener("change", (e) => {
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
      markLive("gy");
      const box = host.querySelector("#dsh-yld");
      if (box) box.innerHTML = govtYieldsHeatHTML();
      const curve = host.querySelector("#dsh-yc-tbl");        // levels table shares the live feed
      if (curve) curve.innerHTML = worldYieldCurveHTML();
      const shape = host.querySelector("#dsh-shape");
      if (shape) shape.innerHTML = curveShapeHTML();
    } catch { /* keep the sourced snapshot */ }
  }
  // "Why it moved" for rates — mirrors the Equities Key-moments box, reading the
  // sourced per-benchmark notes in IND_KEYMOMENTS (macro/js/content.js). Keys are
  // "<CC>:<tenor>" (e.g. US:two_year); each note is grounded + sourced. The whole
  // card is omitted when nothing qualifies.
  function fixedKeyMomentsBody() {
    const KM = IND_KEYMOMENTS || {};
    const keys = Object.keys(KM).filter((k) => KM[k] && KM[k].text);
    if (!keys.length) return "";
    const TEN = { two_year: "2Y", five_year: "5Y", ten_year: "10Y", thirty_year: "30Y" };
    const label = (k) => { const [cc, t] = String(k).split(":"); return `${cc}${TEN[t] ? " " + TEN[t] : ""}`; };
    const row = (k) => { const m = KM[k]; return `<div class="dsh-km"><span class="dsh-km-t">${esc(label(k))}</span>`
      + `<span class="dsh-km-x">${nbNums(txt(m.text))}${m.date ? ` <span class="dsh-asof">${esc(isoDay(m.date))}</span>` : ""}${srcLink(m.src, (m.srcName || "source") + " — source")}</span></div>`; };
    return keys.map(row).join("");
  }
  // Curve shape (2s10s / 2s30s) and 10Y spreads to the Bund — both DERIVED from
  // the sovereign levels already on the page (live where loaded, else the sourced
  // snapshot). No new data, only arithmetic.
  function curveShapeHTML() {
    const regs = sovRegions(); if (!regs.length) return "";
    const flat = regs.flatMap((g) => g.rows || []);
    const find = (c) => flat.find((r) => (r.country || "").toLowerCase() === c.toLowerCase());
    const lv = (r, k) => { const t = r && _gyLive && _gyLive[r.country] && _gyLive[r.country][k]; return (t && t.v != null) ? t.v : (r ? r[k] : null); };
    const bp = (a, b) => (a == null || b == null) ? null : Math.round((a - b) * 100);
    const cell = (v) => v == null ? `<td class="dsh-fl-na">·</td>` : `<td class="dsh-r">${v > 0 ? "+" : ""}${v}</td>`;
    const specs = [["Germany", "DE"], ["United Kingdom", "UK"], ["United States", "US"], ["Japan", "JP"]];
    const rows = specs.map(([c, lbl]) => { const r = find(c); return r ? `<tr><td class="dsh-nm">${esc(lbl)}</td>${cell(bp(lv(r, "y10"), lv(r, "y2")))}${cell(bp(lv(r, "y30"), lv(r, "y2")))}</tr>` : ""; }).join("");
    const de = find("Germany");
    const sp = [["Italy", "BTP"], ["France", "OAT"], ["Spain", "Bono"], ["United Kingdom", "Gilt"], ["United States", "UST"]]
      .map(([c, lbl]) => { const r = find(c); const v = r && de ? bp(lv(r, "y10"), lv(de, "y10")) : null; return r ? `<tr><td class="dsh-nm">${esc(lbl)}–Bund</td>${cell(v)}</tr>` : ""; }).join("");
    if (!rows && !sp) return "";
    return `<div class="dsh-shape"><table class="dsh-tbl"><thead><tr><th>Slope</th><th class="dsh-r">2s10s</th><th class="dsh-r">2s30s</th></tr></thead><tbody>${rows}</tbody></table>`
      + (sp ? `<table class="dsh-tbl"><thead><tr><th>10Y spread</th><th class="dsh-r">bp</th></tr></thead><tbody>${sp}</tbody></table>` : "") + `</div>`;
  }
  // Rates = the old Macro + Bonds tabs merged: policy, money markets, curves,
  // sovereign moves, the Fed/BoE paths, "why it moved", and a collapsed
  // Reference block (cycles, market sizes) — with the macro wire as the rail.
  function ratesHTML() {
    const fed = fedHTML();
    const boe = boeHTML();
    const cyc = cyclesHTML();
    const km = fixedKeyMomentsBody();
    const gyAsOf = asOf(isoDay(GOVT_YIELDS && GOVT_YIELDS.asOf));
    const mid = `<section class="dsh-card dsh-span">${regimePillsHTML()}</section>
      <h3 class="dsh-term-lbl">Policy &amp; money markets</h3>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">Policy rates — ECB · BoE · Fed</h3><div id="dsh-policy">${policyHTML()}</div></section>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">Money markets — €STR · Euribor · SONIA · SOFR ${liveOr("mm")}</h3><div id="dsh-mm" class="dsh-spreads">${moneyMarketsHTML()}</div></section>
      <h3 class="dsh-term-lbl">Curves</h3>
      <section class="dsh-card dsh-wide" id="dsh-yc-card">${yieldCurveCardHTML()}</section>
      <section class="dsh-card"><h3 class="dsh-h">Curve shape &amp; spreads to Bund ${gyAsOf}</h3><div id="dsh-shape">${curveShapeHTML()}</div></section>
      <section class="dsh-card"><h3 class="dsh-h">Sovereign yields — G7 &amp; Western Europe ${liveOr("gy")} ${gyAsOf}</h3><div class="dsh-scroll" id="dsh-yc-tbl">${worldYieldCurveHTML()}</div></section>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h dsh-h-sel">Sovereign yield changes — 1W · 1M · 3M · 6M · 1Y ${liveOr("gy")} ${gyAsOf}${yldSelectHTML()}</h3><div class="dsh-scroll" id="dsh-yld">${govtYieldsHeatHTML()}</div></section>
      ${km ? `<section class="dsh-card dsh-wide"><h3 class="dsh-h">Rates — why it moved</h3><div class="dsh-km-wrap">${km}</div></section>` : ""}
      <h3 class="dsh-term-lbl">Central-bank paths</h3>
      <div class="dsh-wide dsh-row2">
        ${fed ? `<section class="dsh-card"><h3 class="dsh-h">Fed path — dot plot &amp; CME FedWatch</h3>${fed}</section>` : ""}
        ${boe ? `<section class="dsh-card"><h3 class="dsh-h">BoE path — MPC votes &amp; SONIA/OIS</h3>${boe}</section>` : ""}
      </div>
      <h3 class="dsh-term-lbl">Reference</h3>
      <details class="dsh-card dsh-wide dsh-ref"><summary class="dsh-h dsh-ref-sum">Cycles &amp; market sizes <span class="dsh-mut">${esc(MARKET_SIZES.asOf || "")}</span></summary>
        <div class="dsh-wide dsh-row2"><section class="dsh-card">${cyc.debt}</section><section class="dsh-card">${cyc.market}</section></div>
        <section class="dsh-card dsh-wide"><h3 class="dsh-h">Market sizes — by asset class &amp; region ${asOf(MARKET_SIZES.asOf)}</h3><div class="dsh-scroll">${marketSizesHTML()}</div></section>
      </details>`;
    const news = `<section class="dsh-card"><h3 class="dsh-h">Rates wire — US &amp; UK headlines</h3>${macroNewsHTML()}</section>`;
    return { mid, news, newsLabel: "Rates wire" };
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
        return { title: x.title, area: x.area, type: x.type === "case" ? "case" : "alert", court: x.court, citation: x.citation, firm, summary: x.summary, url: x.url, date: x.date, est: !!x.dateEstimated,
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
      return `<div class="dsh-lgl-i" data-date="${esc(x.date || "")}"><div class="dsh-lgl-i-h">${badge(x.type)}<span class="dsh-lgl-d"${x.est ? ' title="Approximate date — the source shows no exact publication date"' : ""}>${x.est ? "c. " : ""}${esc(fmtDate(x.date))}</span></div>`
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
    const conRow = (x) => `<div class="dsh-hf-i"><div class="dsh-hf-i-h">${tkr(x.t)} <span class="dsh-hf-nm">${esc(x.name)}</span>${srcLink(x.src)}</div><div class="dsh-hf-note">${txt(x.note)}</div></div>`;
    const mvRow = (x) => `<div class="dsh-hf-i"><div class="dsh-hf-i-h"><span class="dsh-hf-dir dsh-hf-${esc(x.dir)}">${esc(_hfDir[x.dir] || x.dir)}</span> ${tkr(x.t)} <span class="dsh-hf-nm">${esc(x.name)}</span> <span class="dsh-hf-by">${esc(x.by)}</span>${srcLink(x.src)}</div><div class="dsh-hf-note">${txt(x.note)}</div></div>`;
    const filers = (HEDGE_FUNDS || []).filter((f) => f.cik).sort((a, b) => a.name.localeCompare(b.name));
    const opts = filers.map((f) => `<option value="${esc(f.cik)}">${esc(f.name)}</option>`).join("");
    const mid = `<h3 class="dsh-term-lbl">Holdings — SEC 13F</h3>
      <section class="dsh-card">
        <h3 class="dsh-h">Consensus longs <span class="dsh-n">(${esc(F.quarter || "")} 13Fs)</span> ${asOf(F.quarter)}</h3>
        <div class="dsh-hf-list">${(F.consensus || []).map(conRow).join("")}</div>
              </section>
      <section class="dsh-card">
        <h3 class="dsh-h">Per-fund holdings — SEC 13F ${liveOr("hf13f")}</h3>
        <div class="dsh-hf-pick"><label class="dsh-lgl-lbl" for="dsh-hf-sel">Fund</label>
          <select id="dsh-hf-sel" class="dsh-hf-sel">${opts}</select><a id="dsh-hf-prof" class="dsh-drill dsh-hf-prof" href="${filers[0] ? esc(`${ctx.base}/profiles/#/hf/${filers[0].id}/holdings`) : "#"}">Open profile</a></div>
        <div id="dsh-hf-body" class="dsh-hf-body dsh-scroll"><p class="dsh-load">Loading latest 13F…</p></div>
      </section>`;
    const news = `<section class="dsh-card"><h3 class="dsh-h">Notable ${esc(F.quarter || "")} moves ${asOf(F.quarter)}</h3>
      <div class="dsh-news dsh-hf-list">${(F.moves || []).map(mvRow).join("")}</div></section>`;
    return { mid, news, newsLabel: "Notable moves" };
  }
  function renderHfHoldings(body, d) {
    if (!d || !Array.isArray(d.holdings) || !d.holdings.length) {
      body.innerHTML = `<p class="dsh-load">No 13F holdings available${d && d.source ? ` — <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">latest filing</a>.` : "."}</p>`;
      return;
    }
    const yh = (t) => `https://finance.yahoo.com/quote/${encodeURIComponent(t)}`;
    const rows = d.holdings.slice(0, 50).map((h, i) => `<tr><td class="dsh-r">${i + 1}</td>`
      + `<td>${esc(h.name || "—")}</td>`
      + `<td>${h.ticker ? `<a href="${esc(yh(h.ticker))}" target="_blank" rel="noopener noreferrer">${esc(h.ticker)}</a>` : "—"}</td>`
      + `<td class="dsh-r">${esc(hfUsd(h.value))}</td>`
      + `<td class="dsh-r">${h.weight != null && isFinite(h.weight) ? (h.weight * 100).toFixed(1) + "%" : "—"}</td></tr>`).join("");
    body.innerHTML = `<table class="dsh-tbl dsh-hf-tbl"><thead><tr><th class="dsh-r">#</th><th>Holding</th><th>Ticker</th><th class="dsh-r">Value</th><th class="dsh-r">Weight</th></tr></thead><tbody>${rows}</tbody></table>`
      + `<p class="dsh-fl-note">Top ${Math.min(50, d.holdings.length)} US-listed positions by value${d.asOf ? `, as of ${esc(d.asOf)}` : ""}${d.source ? ` · <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">latest 13F</a>` : ""}.</p>`;
  }
  function wireHedgeFunds() {
    const sel = host.querySelector("#dsh-hf-sel"), body = host.querySelector("#dsh-hf-body");
    if (!sel || !body) return;
    const load = async (cik) => {
      if (!cik) return;
      body.innerHTML = `<p class="dsh-load">Loading latest 13F…</p>`;
      try {
        const r = await fetch(`/api/13f?cik=${encodeURIComponent(cik)}`, { headers: { accept: "application/json" } });
        if (!r.ok) { body.innerHTML = `<p class="dsh-load">Could not load holdings right now (SEC feed error ${r.status}).</p>`; return; }
        const d = await r.json();
        renderHfHoldings(body, d);
        if (d && Array.isArray(d.holdings) && d.holdings.length) markLive("hf13f", d.asOf);
      } catch { body.innerHTML = `<p class="dsh-load">Could not load holdings right now.</p>`; }
    };
    const prof = host.querySelector("#dsh-hf-prof");
    const syncProf = () => { const f = (HEDGE_FUNDS || []).find((x) => x.cik === sel.value); if (prof && f) prof.href = `${ctx.base}/profiles/#/hf/${f.id}/holdings`; };
    sel.addEventListener("change", () => { syncProf(); load(sel.value); });
    if (sel.value) load(sel.value);
  }
  // Legal wire — the freshest sourced alerts & case law as a right-rail news list
  // (legalDb() is already newest-first), mirroring the Macro/Credit wires.
  function legalNewsHTML() {
    const items = legalDb().filter((x) => x && x.date && x.title && x.url).slice(0, 16);
    if (!items.length) return "";
    const row = (x) => `<li class="dsh-news-i"><span class="dsh-news-d">${esc(fmtDate(x.date))}</span>`
      + `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a></li>`;
    return `<ul class="dsh-news">${items.map(row).join("")}</ul>`;
  }
  // Restructuring & insolvency — the newest sourced alerts / case law in the
  // restructuring practice area (schemes, Part 26A plans, insolvency), drawn from
  // the legal desk's own records.
  function restructuringHTML() {
    const items = legalDb().filter((x) => x && x.area === "ri" && x.date && x.title && x.url).slice(0, 8);
    if (!items.length) return `<p class="dsh-load">No restructuring items tracked.</p>`;
    const row = (x) => `<li class="dsh-news-i"><span class="dsh-news-d">${esc(fmtDate(x.date))}</span>`
      + `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${txt(x.title)}</a>`
      + `<span class="dsh-news-s">${esc([x.type === "case" ? "Case" : "Alert", x.firm || x.court].filter(Boolean).join(" · "))}</span></li>`;
    return `<ul class="dsh-news dsh-rx">${items.map(row).join("")}</ul>`;
  }
  // Regulatory calendar — dated, sourced milestones (REG_CALENDAR), upcoming first
  // then the most recent past ones; an undated item (e.g. a file still in
  // trilogue) is listed last as "TBC".
  function regCalendarHTML() {
    const R = (REG_CALENDAR && REG_CALENDAR.items) || [];
    if (!R.length) return "";
    const today = new Date().toISOString().slice(0, 10);
    const up = R.filter((x) => x.date && x.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1));
    const past = R.filter((x) => x.date && x.date < today).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
    const tbc = R.filter((x) => !x.date);
    const row = (x, cls) => `<tr class="${cls}"><td class="dsh-stress-as">${x.date ? esc(isoDay(x.date)) : "TBC"}</td>`
      + `<td class="dsh-nm">${esc(x.item)}${srcLink(x.src, (x.srcName || "source") + " — source")}</td><td class="dsh-reg-note">${esc(x.note || "")}</td></tr>`;
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-reg-tbl"><thead><tr><th>Date</th><th>Milestone</th><th>What</th></tr></thead><tbody>`
      + up.map((x) => row(x, "dsh-reg-up")).join("") + tbc.map((x) => row(x, "dsh-reg-tbc")).join("") + past.map((x) => row(x, "dsh-reg-past")).join("")
      + `</tbody></table></div>`;
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
    // Legal is a normal 3-zone tab: the search panel is a full-width card in the
    // middle (white surface on the grey ground, like the other pages) and the
    // recent alerts & case law ride in a right-hand news wire, just like Macro.
    const cal = regCalendarHTML();
    const mid = `<section class="dsh-card dsh-wide"><h3 class="dsh-h">Restructuring &amp; insolvency — latest</h3>${restructuringHTML()}</section>
      ${cal ? `<section class="dsh-card dsh-wide"><h3 class="dsh-h">Regulatory calendar ${asOf(REG_CALENDAR.asOf)}</h3>${cal}</section>` : ""}
      <section class="dsh-card dsh-legal-panel dsh-span">
        <h3 class="dsh-h">Legal — case law &amp; alerts <span class="dsh-n">(${total}) · search</span></h3>
        <input type="search" class="dsh-lgl-search" id="dsh-lgl-q" placeholder="Search all legal alerts &amp; case law — party, court, citation, firm…" value="${esc(_legalQuery)}" autocomplete="off" spellcheck="false">
        ${typeChips}${areaChips}
        <div class="dsh-lgl-body" id="dsh-lgl-body">${legalListHTML()}</div>
      </section>`;
    const lw = legalNewsHTML();
    return { mid, news: lw ? `<section class="dsh-card"><h3 class="dsh-h">Legal wire — latest alerts &amp; case law</h3>${lw}</section>` : "", newsLabel: "Legal wire" };
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
  // The Dashboard is a three-zone workspace: a narrow left rail holding the
  // section nav, the selected section stacked top-to-bottom in the middle, and
  // the section's news wire as a right-hand rail (omitted for Legal, which is a
  // full-width search).
  function render() {
    const nav = SUBTABS.map(([k, l, s]) => {
      // Full label in the desktop rail; a short label appears on the narrow phone
      // tab bar (see dashboard.css) so "Hedge Funds" doesn't wrap.
      const label = s ? `<span class="dsh-tab-lg">${l}</span><span class="dsh-tab-sm">${s}</span>` : l;
      return `<a class="dsh-navchip${pane === k ? " is-on" : ""}" href="${ctx.base}/dashboard/${k}" data-sub="${k}">${label}</a>`;
    }).join("");
    const sec = pane === "equities" ? equitiesHTML()
      : pane === "rates" ? ratesHTML()
      : pane === "hedge-funds" ? hedgeFundsHTML()
      : pane === "legal" ? legalHTML()
      : creditHTML();
    const rail = sec.news
      ? `<aside class="dsh-newsrail"><h3 class="dsh-term-lbl">${esc(sec.newsLabel || "Wire")}</h3>${sec.news}</aside>`
      : "";
    host.innerHTML = `<div class="dsh"><div class="dsh-3z${sec.news ? "" : " dsh-norail"}" data-pane="${esc(pane)}">
      <nav class="dsh-railnav" aria-label="Dashboard sections">${nav}</nav>
      <main class="dsh-mid">${sec.mid}</main>
      ${rail}
    </div></div>`;
    if (pane === "equities") loadWorldIndices();
    if (pane === "credit") { loadRates(); loadEu(); wireStressSort(); }
    if (pane === "rates") { loadRates(); loadEu(); loadYieldCurve(); wireYields(); loadGovYields(); }
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
    const a = e.target.closest(".dsh-navchip[data-sub], .tchip[data-sub]");
    if (a) { e.preventDefault(); e.stopPropagation(); pane = a.dataset.sub; render(); try { history.replaceState(null, "", a.getAttribute("href")); } catch { /* */ } }
  });
  const subFromUrl = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const i = parts.indexOf("dashboard");
    return i >= 0 ? parts[i + 1] : "";
  };
  // Resolve the URL's sub-tab (retired macro/fixed-income → rates; unknown →
  // Credit) and canonicalise a retired URL in place so Back never revisits it.
  const resolve = (k) => {
    const sub = subOf(k || "");
    if (k && k !== sub) { try { history.replaceState(history.state, "", `${ctx.base}/dashboard/${sub}`); } catch { /* */ } }
    return sub;
  };
  pane = resolve(subFromUrl());
  render();

  return {
    enter(sub) {
      pane = resolve((sub && sub[0]) || subFromUrl());
      render();
    },
    leave() {},
    // home(): a nav-bar tap resets the Dashboard to its first sub-tab (Credit).
    home() { pane = DEFAULT_SUB; render(); window.scrollTo(0, 0); },
  };
}
