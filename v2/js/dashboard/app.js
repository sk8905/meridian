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
import { esc } from "/util.js?v=20260719-1";
import { EQ_INDICES, EQ_SECTORS, EQ_VALUATION, EQ_VOL, EQ_IPO, CR_STRESS, DASH_ASOF } from "/dashboard/js/data.js";
import { OUTLOOK, CYCLE, BUBBLE, MATWALL, YIELD_CURVE, NEWS, EARNINGS } from "/macro/js/content.js";
import { deals, intel } from "/credit/js/data.js";

const SUBTABS = [["macro", "Macro"], ["equities", "Equities"], ["credit", "Credit"]];
const pct1 = (n) => (n == null ? "—" : (n > 0 ? "+" : "") + n.toFixed(1) + "%");
const upcls = (n) => (n == null ? "" : n > 0 ? "up" : n < 0 ? "down" : "");
const asOf = (d) => (d ? `<span class="dsh-asof">as of ${esc(d)}</span>` : "");
const srcLink = (u, label) => (u ? ` <a class="dsh-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer" title="${esc(label || "Source")}">src</a>` : "");
const stripTags = (s) => String(s || "").replace(/<[^>]+>/g, "");
const fmtDate = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ""); const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return m ? `${+m[3]} ${MON[+m[2]-1]}` : (d || ""); };

export function mount(host, ctx) {
  let pane = "macro";

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
  // Finviz-style sector heatmap: tiles sized evenly, coloured by YTD magnitude/sign.
  function sectorHeatHTML() {
    const rows = [...EQ_SECTORS.rows].filter((r) => r.ytd != null).sort((a, b) => b.ytd - a.ytd);
    const max = Math.max(1, ...rows.map((r) => Math.abs(r.ytd)));
    const tile = (r) => {
      const a = (Math.abs(r.ytd) / max) * 0.5 + 0.14;
      const col = r.ytd >= 0 ? `rgba(63,192,141,${a.toFixed(2)})` : `rgba(242,109,132,${a.toFixed(2)})`;
      return `<div class="dsh-heat-t" style="background:${col}"><span>${esc(r.name)}</span><b>${pct1(r.ytd)}</b></div>`;
    };
    return `<div class="dsh-heat" data-view="heat" hidden>${rows.map(tile).join("")}</div>`;
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
    const row = (x) => `<tr><td class="dsh-nm">${esc(x.company)}</td><td>${esc(x.exchange)}</td><td class="dsh-r">${esc(x.size)}</td><td>${esc(x.timing)}</td><td><span class="dsh-tag dsh-tag-${x.status.toLowerCase()}">${esc(x.status)}</span>${srcLink(x.source, x.company + " source")}</td></tr>`;
    return `<table class="dsh-tbl"><thead><tr><th>Company</th><th>Listing</th><th class="dsh-r">Size</th><th>Timing</th><th>Status</th></tr></thead><tbody>${EQ_IPO.map(row).join("")}</tbody></table>`;
  }
  // Two-week earnings calendar from the macro desk's EARNINGS structure
  // (weeks → days → rows): THIS week's slate first (expected EPS, not yet
  // reported), then LAST week's results. Each week gets a label sub-header, and
  // the split Est/Act columns make the exp-vs-act distinction explicit — an
  // upcoming row shows "—" in Act until the company reports. Tickers link to
  // Yahoo; the card header carries the week-ahead source.
  function earningsHTML() {
    const weeks = (EARNINGS && EARNINGS.weeks) || [];
    if (!weeks.length) return "";
    const yahoo = (t) => `https://finance.yahoo.com/quote/${encodeURIComponent(t)}`;
    const tr = (r, date) => `<tr><td>${esc(fmtDate(date))}</td>`
      + `<td class="dsh-nm"><a href="${yahoo(r.t)}" target="_blank" rel="noopener noreferrer">${esc(r.t)}</a></td>`
      + `<td>${esc(r.n || "")}</td><td class="dsh-mut">${esc(r.tag || "")}</td>`
      + `<td class="dsh-r">${esc(r.estEps || "—")}</td>`
      + `<td class="dsh-r">${esc(r.actEps || "—")}</td></tr>`;
    const wk = (w) => `<tr class="dsh-wkrow"><td colspan="6">${esc(w.label || "")}</td></tr>`
      + (w.days || []).map((day) => (day.rows || []).map((r) => tr(r, day.date)).join("")).join("");
    return `<table class="dsh-tbl"><thead><tr><th>Date</th><th>Ticker</th><th>Company</th><th>Sector</th><th class="dsh-r">Est</th><th class="dsh-r">Act</th></tr></thead>`
      + `<tbody>${weeks.map(wk).join("")}</tbody></table>`;
  }
  const earnSrc = (EARNINGS && EARNINGS.srcs && EARNINGS.srcs[0] && EARNINGS.srcs[0].url) || "";
  function equitiesHTML() {
    return `<div class="dsh-pane">
      <section class="dsh-card"><h3 class="dsh-h">S&amp;P 500 sectors — YTD ${asOf(EQ_SECTORS.asOf)}${srcLink(EQ_SECTORS.source, "S&P sector performance")}</h3>${sectorBarsHTML()}</section>
      <section class="dsh-card"><h3 class="dsh-h">Valuation &amp; volatility</h3>${valVolHTML()}</section>
      <div class="dsh-span dsh-pair">
        <section class="dsh-card"><h3 class="dsh-h">Earnings calendar${srcLink(earnSrc, "Earnings week-ahead source")}</h3><div class="dsh-scroll">${earningsHTML()}</div></section>
        <section class="dsh-card"><h3 class="dsh-h">IPO / ECM pipeline</h3><div class="dsh-scroll">${ipoHTML()}</div></section>
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
      .filter((x) => x && x.date && (x.headline || x.title))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 12);
    if (!items.length) return "";
    const row = (x) => { const u = x.sourceUrl || x.url; return `<li class="dsh-news-i"><span class="dsh-news-d">${esc(fmtDate(x.date))}</span>`
      + (u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(x.headline || x.title)}</a>` : `<span>${esc(x.headline || x.title)}</span>`) + `</li>`; };
    return `<ul class="dsh-news">${items.map(row).join("")}</ul>`;
  }
  function creditHTML() {
    return `<div class="dsh-pane">
      <div class="dsh-span dsh-pair">
        <section class="dsh-card"><h3 class="dsh-h">Credit spreads — ICE BofA OAS <span class="dsh-live">live</span></h3><div id="dsh-spreads" class="dsh-spreads"><p class="dsh-load">Loading live spreads…</p></div></section>
        <section class="dsh-card"><h3 class="dsh-h">Maturity wall</h3>${maturityHTML()}</section>
      </div>
      <section class="dsh-card dsh-span"><h3 class="dsh-h">Stress — situations in focus <span class="dsh-n">(${CR_STRESS.length}) · by debt</span></h3>${stressHTML()}</section>
      <section class="dsh-card dsh-span"><h3 class="dsh-h">Credit wire — latest deals &amp; intel</h3>${creditNewsHTML()}</section>
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
  // plus the underlying table. Refinitiv-style term-structure read.
  function yieldCurveHTML() {
    const yc = YIELD_CURVE; if (!yc || !yc.maturities) return "";
    const mats = yc.maturities, us = yc.us || [], uk = yc.uk || [];
    const all = [...us, ...uk].filter((v) => v != null);
    const lo = Math.floor(Math.min(...all) * 2) / 2 - 0.25, hi = Math.ceil(Math.max(...all) * 2) / 2 + 0.25;
    // Landscape viewBox scaled proportionally (height:auto in CSS) — no
    // preserveAspectRatio="none", which was distorting/stretching the curve.
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
  // Embedded macro news wire — the desk's US + UK headlines, linked to source.
  function macroNewsHTML() {
    const items = [...((NEWS && NEWS.us) || []), ...((NEWS && NEWS.uk) || [])]
      .filter((x) => x && x.title && x.url)
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.time || "").localeCompare(String(a.time || "")))
      .slice(0, 12);
    if (!items.length) return "";
    const row = (x) => `<li class="dsh-news-i"><span class="dsh-news-d">${esc(fmtDate(x.date))}</span>`
      + `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a>`
      + (x.source ? `<span class="dsh-news-s">${esc(x.source)}</span>` : "") + `</li>`;
    return `<ul class="dsh-news">${items.map(row).join("")}</ul>`;
  }
  function macroHTML() {
    const fed = fedHTML();
    const boe = boeHTML();
    return `<div class="dsh-pane">
      <section class="dsh-card dsh-span">${regimePillsHTML()}</section>
      ${fed ? `<section class="dsh-card dsh-span"><h3 class="dsh-h">Fed path — dot plot &amp; CME FedWatch</h3>${fed}</section>` : ""}
      ${boe ? `<section class="dsh-card dsh-span"><h3 class="dsh-h">BoE path — MPC votes &amp; SONIA/OIS curve</h3>${boe}</section>` : ""}
      <section class="dsh-card"><h3 class="dsh-h">Rate outlook</h3>${rateOutlookHTML()}</section>
      <section class="dsh-card"><h3 class="dsh-h">Yield curve ${asOf(YIELD_CURVE && YIELD_CURVE.asOf)}</h3>${yieldCurveHTML()}</section>
      <section class="dsh-card dsh-span"><h3 class="dsh-h">Macro wire — US &amp; UK headlines</h3>${macroNewsHTML()}</section>
    </div>`;
  }

  // ---- Shell + routing ----------------------------------------------------
  function render() {
    const nav = SUBTABS.map(([k, l]) => `<a class="tchip${pane === k ? " is-on" : ""}" href="${ctx.base}/dashboard/${k}" data-sub="${k}">${l}</a>`).join("");
    const body = pane === "equities" ? equitiesHTML() : pane === "credit" ? creditHTML() : macroHTML();
    host.innerHTML = `<div class="dsh"><header class="dsh-nav tdet-secnav"><div class="tchips">${nav}</div></header>${body}</div>`;
    if (pane === "credit") { loadSpreads(); wireStressSort(); }
  }
  function wireSectorToggle() {
    host.querySelectorAll(".dsh-tgl").forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.secview;
      host.querySelectorAll(".dsh-tgl").forEach((x) => x.classList.toggle("is-on", x === b));
      const bars = host.querySelector('.dsh-sectors'), heat = host.querySelector('.dsh-heat');
      if (bars) bars.hidden = v !== "bars";
      if (heat) heat.hidden = v !== "heat";
    }));
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
