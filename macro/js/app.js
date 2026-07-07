// =============================================================================
// Meridian Macro — standalone dashboard of key US & UK economic indicators, with
// a policy-rate Commentary view and a Dalio-framework Cycle view. Fetches the
// shared Worker /api/macro endpoint (FRED / DBnomics / ONS / S&P Global / BoE).
// Zero dependencies, no build step.
// =============================================================================
import { UPDATED, META, OUTLOOK, CYCLE, BUBBLE, SUMMARY, ALERTS } from "./content.js?v=20260707-16";

const app = document.getElementById("app");
const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const MACRO_COLOR = "#8b7ec8";
const MACRO_INK = "#4b3f72";
const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function macroMonth(ym) { const p = String(ym || "").split("-"); return p.length === 2 ? `${MONTHS[+p[1]] || ""} ${p[0]}` : ""; }

// Compact sparkline — area + line + last-point dot, first/last year labels.
function sparkline(data, { width = 300, height = 88, color = MACRO_COLOR } = {}) {
  if (!data || data.length < 2) return `<svg viewBox="0 0 ${width} ${height}" class="spark" role="img"></svg>`;
  const padX = 4, top = 8, bottom = 16;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals), max = Math.max(...vals), span = (max - min) || 1;
  const plotW = width - padX * 2, plotH = height - top - bottom;
  const X = (i) => padX + (i / (data.length - 1)) * plotW;
  const Y = (v) => top + plotH - ((v - min) / span) * plotH;
  const pts = data.map((d, i) => [X(i), Y(d.value)]);
  const path = pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const area = `${path} L ${last[0].toFixed(1)} ${top + plotH} L ${pts[0][0].toFixed(1)} ${top + plotH} Z`;
  const yr = (l) => String(l).slice(0, 4);
  return `<svg viewBox="0 0 ${width} ${height}" class="spark" role="img">
    <path d="${area}" fill="${color}" fill-opacity="0.10"/>
    <path d="${path}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.2" fill="${color}"/>
    <text x="${padX}" y="${height - 3}" class="spark-x">${esc(yr(data[0].label))}</text>
    <text x="${width - padX}" y="${height - 3}" text-anchor="end" class="spark-x">${esc(yr(data[data.length - 1].label))}</text>
  </svg>`;
}

// ---- Dashboard tiles -------------------------------------------------------
function macroTile(s) {
  const pct = s.unit === "%";
  const val = s.value == null ? "—" : `${(+s.value).toFixed(2)}${pct ? "%" : ""}`;
  const ch = s.change;
  const chHtml = (ch == null || s.value == null) ? "" :
    `<span class="macro-chg" title="change vs previous month">${ch > 0 ? "▲" : ch < 0 ? "▼" : "•"} ${Math.abs(ch).toFixed(2)}${pct ? " pp" : ""}</span>`;
  const chart = (s.history && s.history.length > 1)
    ? sparkline(s.history)
    : '<div class="spark-empty muted small">5-year history unavailable</div>';
  const asOf = s.asOf ? macroMonth(s.asOf) : "";
  // Whole tile links to the source (matches the Credit key-rates tiles).
  const tag = s.href ? "a" : "div";
  const attrs = s.href ? ` href="${esc(s.href)}" target="_blank" rel="noopener noreferrer"` : "";
  return `<${tag} class="macro-tile"${attrs}>
    <div class="macro-tile-head"><span class="macro-label">${esc(s.label)}</span><span class="macro-sub muted small">${esc(s.sub || "")}</span></div>
    <div class="macro-valrow"><span class="macro-val">${val}</span>${chHtml}</div>
    <div class="macro-chart">${chart}</div>
    <div class="macro-foot muted small">${asOf ? esc(asOf) + " · " : ""}<span class="macro-src">${esc(s.source)} ↗</span></div>
  </${tag}>`;
}

function summaryCards() {
  const card = (icon, title, href, cta, us, uk) => `
    <a class="macro-sum" href="${href}">
      <div class="macro-sum-head"><span class="macro-sum-icon" aria-hidden="true">${icon}</span><span class="macro-sum-title">${esc(title)}</span></div>
      <p class="macro-sum-line"><span class="macro-flag">US</span> ${us}</p>
      <p class="macro-sum-line"><span class="macro-flag">UK</span> ${uk}</p>
      <span class="macro-sum-cta">${esc(cta)} →</span>
    </a>`;
  return `<section class="macro-summary">
    ${card("◷", "Rate outlook", "#/commentary", "Read the commentary", SUMMARY.outlook.us, SUMMARY.outlook.uk)}
    ${card("◑", "Where we are in the cycle", "#/cycle", "See the cycle view", SUMMARY.cycle.us, SUMMARY.cycle.uk)}
    ${card("◎", "Bubble risk", "#/bubble", "See the bubble view", SUMMARY.bubble.us, SUMMARY.bubble.uk)}
  </section>`;
}

function renderMacro(data) {
  const series = (data && data.series) || [];
  if (!series.length) return '<section class="card"><p class="muted">Macro data is temporarily unavailable — each indicator is sourced live from FRED, the Bank of England, ONS, DBnomics and S&amp;P Global. Please try again shortly.</p></section>';
  const grids = [["US", "United States"], ["UK", "United Kingdom"]].map(([c, name]) => {
    const tiles = series.filter((s) => s.country === c).map(macroTile).join("");
    return tiles ? `<section class="macro-group"><h2 class="macro-country">${esc(name)}</h2><div class="macro-grid">${tiles}</div></section>` : "";
  }).join("");
  return grids + summaryCards();
}

// ---- Horizontal 0–100 gauge (used by Cycle and Bubble) ---------------------
// zones: [[pos,label], …] printed under the track; items: [{label,pos}, …]
// markers on the track. gradId must be unique per gauge on the page.
let gaugeSeq = 0;
function trackGauge(zones, items, aria) {
  const W = 340, H = 104, x0 = 14, x1 = 326, trackY = 56, trackH = 12;
  const gradId = `gaugeGrad${gaugeSeq++}`;
  const X = (p) => x0 + (Math.max(0, Math.min(100, p)) / 100) * (x1 - x0);
  const zoneText = zones.map(([p, t]) => `<text x="${X(p).toFixed(1)}" y="${trackY + trackH + 15}" class="gauge-zone" text-anchor="middle">${esc(t)}</text>`).join("");
  const marks = items.map((it, i) => {
    const x = X(it.pos).toFixed(1);
    const ly = i % 2 === 0 ? trackY - 22 : trackY - 9; // stagger vertically to avoid collisions
    return `<g>
      <line x1="${x}" y1="${trackY - 4}" x2="${x}" y2="${trackY + trackH + 4}" stroke="${MACRO_INK}" stroke-width="2"/>
      <circle cx="${x}" cy="${trackY + trackH / 2}" r="5" fill="${MACRO_INK}" stroke="#fff" stroke-width="1.5"/>
      <text x="${x}" y="${ly}" class="gauge-mark" text-anchor="middle">${esc(it.label)} · ${it.pos}</text>
    </g>`;
  }).join("");
  return `<svg viewBox="0 0 ${W} ${H}" class="gauge" role="img" aria-label="${esc(aria || "")}">
    <defs><linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ece8f6"/><stop offset="1" stop-color="${MACRO_INK}"/>
    </linearGradient></defs>
    <rect x="${x0}" y="${trackY}" width="${x1 - x0}" height="${trackH}" rx="6" fill="url(#${gradId})"/>
    ${zoneText}${marks}
  </svg>`;
}
const CYCLE_ZONES = [[6, "Early"], [31, "Leveraging"], [56, "Late cycle"], [81, "Bubble / top"], [98, "Crisis"]];
const BUBBLE_ZONES = [[7, "Low"], [30, "Moderate"], [52, "Elevated"], [75, "High"], [96, "Extreme"]];
// Composite bubble score = weighted average of the dimension sub-scores.
function bubbleComposite() {
  const d = BUBBLE.dimensions;
  const wsum = d.reduce((s, x) => s + x.weight, 0) || 1;
  return Math.round(d.reduce((s, x) => s + x.score * x.weight, 0) / wsum);
}
function bubbleBand(score) {
  return score < 20 ? "Low" : score < 40 ? "Moderate" : score < 65 ? "Elevated" : score < 82 ? "High" : "Extreme";
}

// ---- Views -----------------------------------------------------------------
function sourceList(sources) {
  return `<div class="macro-sources"><span class="macro-sources-h muted small">Sources</span><ul>${
    sources.map(([label, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a></li>`).join("")
  }</ul></div>`;
}

function viewDashboard() {
  return `
    <div class="page-head">
      <h1>Macro Intelligence</h1>
      <p class="muted">Key US &amp; UK economic indicators plus the policy-rate outlook and where we sit in the credit cycle.</p>
    </div>
    <div id="macro-body" class="macro-body"><section class="card"><p class="muted">Loading macro data…</p></section></div>`;
}

function viewCommentary() {
  const country = (name, o) => `
    <section class="card macro-note">
      <h2 class="macro-country">${esc(name)}</h2>
      <div class="macro-note-head">
        <span class="macro-pill">${esc(o.rate)}</span>
        <span class="macro-pill ghost">${esc(o.stance)}</span>
      </div>
      ${o.body.map((p) => `<p class="macro-para">${p}</p>`).join("")}
      <p class="macro-bottomline"><strong>Bottom line.</strong> ${o.bottomLine}</p>
    </section>`;
  return `
    <div class="page-head">
      <h1>Market commentary — policy-rate outlook</h1>
      <p class="muted">Compiled analyst and market views on whether the US Federal Reserve and Bank of England are likely to change their policy rates. As of ${esc(UPDATED)}. Educational only — not investment advice; market pricing shifts daily.</p>
    </div>
    <div class="macro-cols">
      ${country("United States", OUTLOOK.us)}
      ${country("United Kingdom", OUTLOOK.uk)}
    </div>
    ${sourceList(OUTLOOK.sources)}`;
}

function viewCycle() {
  const country = (name, c) => `
    <section class="card macro-note">
      <h2 class="macro-country">${esc(name)}</h2>
      <div class="macro-note-head">
        <span class="macro-pill">${esc(c.shortStage)}</span>
        <span class="macro-pill ghost">${esc(c.longStage)}</span>
      </div>
      ${c.body.map((p) => `<p class="macro-para">${p}</p>`).join("")}
    </section>`;
  return `
    <div class="page-head">
      <h1>Cycle stage — a Dalio reading</h1>
      <p class="muted">Where the US and UK sit in the economic / credit cycle, framed by Ray Dalio's short-term and long-term (“Big Debt Cycle”) framework. As of ${esc(UPDATED)}. Educational only — not investment advice.</p>
    </div>
    <section class="card macro-gauge-card">
      <h2 class="macro-country">Long-term debt-cycle position</h2>
      <div class="macro-gauge-wrap">
        ${trackGauge(CYCLE_ZONES, [{ label: "US", pos: CYCLE.us.pos }, { label: "UK", pos: CYCLE.uk.pos }], "Long-term debt cycle position, 0 early to 100 crisis")}
        <div class="macro-framework">
          ${CYCLE.framework.map((p) => `<p class="macro-para">${p}</p>`).join("")}
        </div>
      </div>
      <p class="muted small macro-gauge-note">${esc(CYCLE.note)}</p>
    </section>
    <div class="macro-cols">
      ${country("United States", CYCLE.us)}
      ${country("United Kingdom", CYCLE.uk)}
    </div>
    ${sourceList(CYCLE.sources)}`;
}

function viewBubble() {
  const composite = bubbleComposite();
  const band = bubbleBand(composite);
  const dim = (d) => `
    <section class="card macro-note">
      <div class="macro-dim-head">
        <h2 class="macro-country">${esc(d.label)}</h2>
        <span class="macro-score" title="dimension sub-score (0–100)">${d.score}<span class="macro-score-max">/100</span></span>
      </div>
      <div class="macro-scorebar" aria-hidden="true"><span style="width:${d.score}%"></span></div>
      <table class="macro-metrics">
        ${d.metrics.map(([n, v, ctx]) => `<tr><th>${esc(n)}</th><td class="macro-metric-val">${esc(v)}</td></tr><tr class="macro-metric-ctx"><td colspan="2" class="muted small">${esc(ctx)}</td></tr>`).join("")}
      </table>
      <p class="macro-para macro-dim-note">${esc(d.note)}</p>
    </section>`;
  return `
    <div class="page-head">
      <h1>Bubble risk — ${esc(BUBBLE.market)}</h1>
      <p class="muted">A composite read on US stock-market bubble risk across the three workhorse dimensions — valuation, credit &amp; leverage, and breadth &amp; speculation. As of ${esc(UPDATED)}. Educational only — not investment advice.</p>
    </div>
    <section class="card macro-gauge-card">
      <div class="macro-dim-head">
        <h2 class="macro-country">Composite bubble-risk score</h2>
        <span class="macro-verdict macro-verdict-${band.toLowerCase()}">${composite}/100 · ${esc(band)}</span>
      </div>
      <div class="macro-gauge-wrap">
        ${trackGauge(BUBBLE_ZONES, [{ label: band, pos: composite }], "US equity bubble-risk score, 0 low to 100 extreme")}
        <div class="macro-framework">
          ${BUBBLE.summary.map((p) => `<p class="macro-para">${p}</p>`).join("")}
        </div>
      </div>
      <p class="muted small macro-gauge-note">${esc(BUBBLE.note)}</p>
    </section>
    <div class="macro-cols macro-cols-3">
      ${BUBBLE.dimensions.map(dim).join("")}
    </div>
    <p class="macro-para macro-uknote"><strong>UK.</strong> ${esc(BUBBLE.ukNote)}</p>
    ${sourceList(BUBBLE.sources)}`;
}

// ---- Chart: multi-indicator overlay chart ----------------------------------
// Categorical colour BY INDICATOR (fixed, validated 6-hue set); country is the
// secondary encoding (solid = US, dashed = UK). Series are each min–max scaled to
// 0–100 so differently-measured indicators share one axis (no dual-axis); the
// hover tooltip shows the real values.
const IND_COLOR = {
  base_rate: "#2563eb", two_year: "#0891b2", core_cpi: "#dc2626",
  services_pmi: "#d97706", wages: "#7c3aed", unemployment: "#db2777",
};
const INDICATORS = [
  ["base_rate", "Base rate"], ["two_year", "2-year yield"], ["core_cpi", "Core inflation"],
  ["services_pmi", "Services PMI"], ["wages", "Wage growth"], ["unemployment", "Unemployment"],
];
const CIRC = ["①", "②", "③", "④", "⑤", "⑥"];
const CHART_EVENTS = [
  { id: "omicron", date: "2021-12", label: "COVID Omicron wave" },
  { id: "ukraine", date: "2022-02", label: "Russia invades Ukraine" },
  { id: "truss", date: "2022-09", label: "Truss mini-budget" },
  { id: "svb", date: "2023-03", label: "SVB / banking stress" },
  { id: "trump", date: "2024-11", label: "Trump re-election" },
  { id: "iran", date: "2026-05", label: "Middle East / Iran conflict" },
];
const CHART_MAX = 10;
let chartSel = new Set(["US:base_rate", "US:core_cpi", "UK:base_rate", "UK:core_cpi"]);
let chartEvents = new Set(["truss", "trump"]);

const MI = (ym) => { const p = String(ym).split("-"); return (+p[0]) * 12 + (+p[1] - 1); };
const miLabel = (mi) => `${Math.floor(mi / 12)}-${String((mi % 12) + 1).padStart(2, "0")}`;
function chartSeriesAll() {
  return ((MACRO_DATA && MACRO_DATA.series) || [])
    .filter((x) => x.history && x.history.length > 1)
    .map((x) => ({ ...x, selKey: `${x.country}:${x.key}` }));
}

function indBox(country) {
  return INDICATORS.map(([k, l]) => {
    const sk = `${country}:${k}`;
    return `<label class="chart-ind"><input type="checkbox" class="chart-ind-cb" data-sel="${sk}"${chartSel.has(sk) ? " checked" : ""}/><span class="chart-ind-sw" style="--c:${IND_COLOR[k]}"></span>${esc(l)}</label>`;
  }).join("");
}
function viewChart() {
  const chips = CHART_EVENTS.map((e, i) => `<button type="button" class="chart-evt${chartEvents.has(e.id) ? " is-on" : ""}" data-evt="${e.id}"><span class="evt-num">${CIRC[i]}</span> ${esc(e.label)}</button>`).join("");
  return `
    <div class="page-head">
      <h1>Chart</h1>
      <p class="muted">Overlay up to ${CHART_MAX} of the dashboard indicators (US &amp; UK) across the past five years and toggle key events. Each series is scaled to its own 0–100 range so differently-measured indicators share one axis — hover for the actual values.</p>
    </div>
    <section class="card chart-ctrls">
      <div class="chart-ctrl-grp">
        <div class="chart-ctrl-h">Indicators <span class="muted small">(up to ${CHART_MAX} · <span id="chart-count">${chartSel.size}</span> selected)</span></div>
        <div class="chart-ind-cols">
          <div><div class="chart-ind-country">United States <span class="chart-line-key">— solid</span></div>${indBox("US")}</div>
          <div><div class="chart-ind-country">United Kingdom <span class="chart-line-key">- - dashed</span></div>${indBox("UK")}</div>
        </div>
      </div>
      <div class="chart-ctrl-grp">
        <div class="chart-ctrl-h">Events</div>
        <div class="chart-evts">${chips}</div>
      </div>
    </section>
    <section class="card"><div id="chart-canvas"><p class="muted">Loading macro data…</p></div></section>`;
}

function drawChart() {
  const canvas = document.getElementById("chart-canvas");
  if (!canvas) return;
  const all = chartSeriesAll();
  if (!all.length) { canvas.innerHTML = '<p class="muted">Macro data is temporarily unavailable — please try again shortly.</p>'; return; }
  const sel = all.filter((s) => chartSel.has(s.selKey));
  const W = 980, H = 470, plotL = 40, plotR = W - 14, plotT = 30, plotB = H - 34;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  let m0 = Infinity, m1 = -Infinity;
  all.forEach((s) => s.history.forEach((p) => { const mi = MI(p.label); if (mi < m0) m0 = mi; if (mi > m1) m1 = mi; }));
  const span = (m1 - m0) || 1;
  const xFor = (mi) => plotL + ((mi - m0) / span) * plotW;
  const yFor = (n) => plotB - (Math.max(0, Math.min(100, n)) / 100) * plotH;

  const grid = [0, 25, 50, 75, 100].map((t) => `<line x1="${plotL}" y1="${yFor(t).toFixed(1)}" x2="${plotR}" y2="${yFor(t).toFixed(1)}" class="chart-grid"/><text x="${plotL - 6}" y="${(yFor(t) + 3).toFixed(1)}" class="chart-ylab" text-anchor="end">${t}</text>`).join("");
  let xticks = "";
  for (let y = Math.ceil(m0 / 12); y <= Math.floor(m1 / 12); y++) {
    const mi = y * 12; if (mi < m0 || mi > m1) continue;
    const x = xFor(mi);
    xticks += `<line x1="${x.toFixed(1)}" y1="${plotT}" x2="${x.toFixed(1)}" y2="${plotB}" class="chart-grid"/><text x="${x.toFixed(1)}" y="${plotB + 16}" class="chart-xlab" text-anchor="middle">${y}</text>`;
  }
  let ev = "";
  CHART_EVENTS.forEach((e, i) => {
    if (!chartEvents.has(e.id)) return;
    const mi = MI(e.date); if (mi < m0 || mi > m1) return;
    const x = xFor(mi);
    ev += `<line x1="${x.toFixed(1)}" y1="${plotT}" x2="${x.toFixed(1)}" y2="${plotB}" class="chart-evline"/><text x="${x.toFixed(1)}" y="${(plotT - 6).toFixed(1)}" class="chart-evnum" text-anchor="middle">${CIRC[i]}</text>`;
  });
  const norm = (s) => { const v = s.history.map((p) => p.value); const mn = Math.min(...v), mx = Math.max(...v); return { mn, sp: (mx - mn) || 1 }; };
  const lines = sel.map((s) => {
    const { mn, sp } = norm(s);
    const pts = s.history.map((p) => [xFor(MI(p.label)), yFor(((p.value - mn) / sp) * 100)]);
    const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    return `<path d="${d}" fill="none" stroke="${IND_COLOR[s.key]}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"${s.country === "UK" ? ' stroke-dasharray="6 4"' : ""}/>`;
  }).join("");

  const legend = sel.map((s) => {
    const last = s.history[s.history.length - 1];
    const pct = s.unit === "%";
    const v = last ? `${(+last.value).toFixed(2)}${pct ? "%" : ""}` : "—";
    return `<span class="chart-leg"><span class="chart-swatch${s.country === "UK" ? " dash" : ""}" style="--c:${IND_COLOR[s.key]}"></span>${esc(s.country)} · ${esc(s.label)} <b>${v}</b></span>`;
  }).join("");

  const svg = `<svg viewBox="0 0 ${W} ${H}" class="chart-svg" id="chart-svg" role="img" aria-label="Selected macro indicators over five years, each scaled 0 to 100">
    ${grid}${xticks}${ev}${lines}
    <line id="chart-cross" class="chart-cross" y1="${plotT}" y2="${plotB}" style="display:none"/>
    <g id="chart-hoverdots"></g>
    <rect x="${plotL}" y="${plotT}" width="${plotW}" height="${plotH}" fill="transparent" id="chart-hit"/>
  </svg>`;
  canvas.innerHTML = `<div class="chart-main">${svg}<div id="chart-tip" class="chart-tip" hidden></div></div>
    <div class="chart-legend">${sel.length ? legend : '<span class="muted">Select one or more indicators to plot.</span>'}</div>
    <p class="muted small chart-note">Each series is scaled to its own five-year min–max (0–100), so indicators on different scales (a 3.75% rate vs a 48 PMI) share one axis; hover for the real values. Line style: <b>solid = US</b>, <b>dashed = UK</b>.</p>`;

  if (!sel.length) return;
  const svgEl = document.getElementById("chart-svg"), hit = document.getElementById("chart-hit");
  const cross = document.getElementById("chart-cross"), dots = document.getElementById("chart-hoverdots");
  const tip = document.getElementById("chart-tip"), main = canvas.querySelector(".chart-main");
  const nearest = (hist, mi) => hist.reduce((b, p) => (Math.abs(MI(p.label) - mi) < Math.abs(MI(b.label) - mi) ? p : b), hist[0]);
  hit.addEventListener("mousemove", (e) => {
    const r = svgEl.getBoundingClientRect();
    const sx = (e.clientX - r.left) / r.width * W;
    let mi = Math.round(m0 + ((sx - plotL) / plotW) * span);
    mi = Math.max(m0, Math.min(m1, mi));
    const x = xFor(mi);
    cross.setAttribute("x1", x); cross.setAttribute("x2", x); cross.style.display = "";
    let dd = "", rows = "";
    sel.forEach((s) => {
      const pt = s.history.find((p) => MI(p.label) === mi) || nearest(s.history, mi);
      if (!pt) return;
      const { mn, sp } = norm(s);
      dd += `<circle cx="${xFor(MI(pt.label)).toFixed(1)}" cy="${yFor(((pt.value - mn) / sp) * 100).toFixed(1)}" r="3.5" fill="${IND_COLOR[s.key]}" stroke="#fff" stroke-width="1.5"/>`;
      rows += `<div class="tip-row"><span class="tip-dot" style="background:${IND_COLOR[s.key]}"></span>${esc(s.country)} ${esc(s.label)}: <b>${(+pt.value).toFixed(2)}${s.unit === "%" ? "%" : ""}</b></div>`;
    });
    dots.innerHTML = dd;
    tip.innerHTML = `<div class="tip-date">${esc(macroMonth(miLabel(mi)))}</div>${rows}`;
    tip.hidden = false;
    const mr = main.getBoundingClientRect();
    let tx = e.clientX - mr.left + 14; const ty = e.clientY - mr.top + 8;
    if (tx > mr.width - 190) tx = e.clientX - mr.left - 200;
    tip.style.left = Math.max(2, tx) + "px"; tip.style.top = ty + "px";
  });
  hit.addEventListener("mouseleave", () => { cross.style.display = "none"; dots.innerHTML = ""; tip.hidden = true; });
}

// Chart control interactions (delegated; added once at module load).
document.addEventListener("change", (e) => {
  const cb = e.target.closest(".chart-ind-cb"); if (!cb) return;
  const key = cb.getAttribute("data-sel");
  if (cb.checked) {
    if (chartSel.size >= CHART_MAX) { cb.checked = false; const c = document.getElementById("chart-count"); if (c) { c.classList.add("is-max"); setTimeout(() => c.classList.remove("is-max"), 800); } return; }
    chartSel.add(key);
  } else chartSel.delete(key);
  const c = document.getElementById("chart-count"); if (c) c.textContent = chartSel.size;
  drawChart();
});
document.addEventListener("click", (e) => {
  const chip = e.target.closest(".chart-evt"); if (!chip) return;
  const id = chip.getAttribute("data-evt");
  if (chartEvents.has(id)) chartEvents.delete(id); else chartEvents.add(id);
  chip.classList.toggle("is-on");
  drawChart();
});

// ---- Tab routing -----------------------------------------------------------
const TABS = [
  ["dashboard", "Dashboard"],
  ["commentary", "Commentary"],
  ["cycle", "Cycle"],
  ["bubble", "Bubble"],
  ["chart", "Chart"],
];
function currentTab() {
  const h = (location.hash || "").replace(/^#\/?/, "");
  return TABS.some(([k]) => k === h) ? h : "dashboard";
}
// The view nav lives in the top bar (matches Credit/Legal); toggle its active
// state to the current tab.
function syncNav(active) {
  document.querySelectorAll(".mainnav .nav-link").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#/${active}`);
  });
}

// Fetch the live macro data once and reuse it for both the dashboard and the
// notifications bell (so the bell is populated on any tab).
let MACRO_DATA = null, MACRO_PROMISE = null;
function fetchMacro() {
  if (!MACRO_PROMISE) MACRO_PROMISE = (async () => {
    let data = { series: [] };
    try { const r = await fetch("/api/macro", { headers: { accept: "application/json" } }); if (r.ok) data = await r.json(); } catch { /* offline */ }
    MACRO_DATA = data;
    return data;
  })();
  return MACRO_PROMISE;
}
async function loadMacro() {
  const data = await fetchMacro();
  const el = document.getElementById("macro-body");
  if (el) el.innerHTML = renderMacro(data);
}

// ---- Topbar: last-refresh line (matches Credit/Legal) ----------------------
const MONTHS_ABBR = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(d) {
  const p = String(d || "").split("-");
  if (p.length < 2) return String(d || "");
  const day = p[2] ? `${(+p[2])} ` : "";
  return `${day}${MONTHS_ABBR[+p[1]] || ""} ${p[0]}`;
}
function refreshStamp() {
  return `${fmtDate(META.lastChecked)}${META.lastCheckedTime ? `, ${META.lastCheckedTime}` : ""}`;
}
function renderDataStatus() {
  const el = document.getElementById("data-status");
  if (!el) return;
  el.innerHTML = `<span class="ds-text" title="Indicators are refreshed by the twice-daily routine (06:00 & 12:00 London) and fetched live from /api/macro; guidance as of ${esc(UPDATED)}"><span class="ds-part">Last refresh ${esc(refreshStamp())}</span></span>`;
}

// ---- Notifications bell: economic-data prints + guidance changes -----------
const NOTIF_KEY = "meridian.macro.notifSeen";
function dataAlerts(series) {
  return (series || []).filter((s) => s.value != null).map((s) => {
    const pct = s.unit === "%";
    const val = `${(+s.value).toFixed(2)}${pct ? "%" : ""}`;
    const country = s.country === "US" ? "US" : "UK";
    let chg = "";
    if (s.change != null && s.change !== 0) chg = ` · ${s.change > 0 ? "▲" : "▼"} ${Math.abs(s.change).toFixed(2)}${pct ? " pp" : ""} MoM`;
    else if (s.change === 0) chg = " · unchanged MoM";
    const flag = (s.key === "services_pmi" && +s.value < 50) ? " — below 50 (contraction)" : "";
    return {
      id: `d:${s.country}:${s.key}:${s.asOf}:${(+s.value).toFixed(2)}`,
      kind: "Economic data",
      title: `${country} · ${s.label}: ${val}${flag}${chg}`,
      href: "#/dashboard",
      date: s.asOf ? `${s.asOf}-01` : "",
    };
  });
}
function notifItems() {
  const data = dataAlerts((MACRO_DATA && MACRO_DATA.series) || []);
  const guidance = ALERTS.map((a) => ({ ...a }));
  return [...guidance, ...data].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
function closeNotif() {
  const p = document.getElementById("notif-panel"), b = document.getElementById("notif-bell");
  if (p) p.setAttribute("hidden", "");
  if (b) b.setAttribute("aria-expanded", "false");
}
function renderNotifications() {
  const wrap = document.getElementById("notif");
  if (!wrap) return;
  const all = notifItems();
  const allIds = all.map((x) => x.id);
  let seen;
  try { seen = JSON.parse(localStorage.getItem(NOTIF_KEY) || "null"); } catch { seen = null; }
  const firstVisit = !Array.isArray(seen);
  const seenSet = new Set(firstVisit ? allIds : seen);
  if (firstVisit) { try { localStorage.setItem(NOTIF_KEY, JSON.stringify(allIds)); } catch { /* */ } }
  const fresh = firstVisit ? [] : all.filter((x) => !seenSet.has(x.id));
  const n = fresh.length;
  const list = (n ? fresh : all).slice(0, 14);
  wrap.innerHTML = `
    <button type="button" class="notif-bell" id="notif-bell" aria-haspopup="true" aria-expanded="false" aria-label="Notifications${n ? ` — ${n} new` : ""}">
      <span class="notif-ico" aria-hidden="true">🔔</span>${n ? `<span class="notif-badge">${n > 9 ? "9+" : n}</span>` : ""}
    </button>
    <div class="notif-panel" id="notif-panel" role="menu" hidden>
      <div class="notif-head">${n ? `${n} new update${n > 1 ? "s" : ""}` : "No new updates"} <span class="muted small">· checked ${esc(refreshStamp())}</span></div>
      <ul class="notif-list">
        ${list.length ? list.map((x) => `<li class="notif-item${(n && fresh.includes(x)) ? " is-new" : ""}">
          <a href="${x.href}" class="notif-link">${esc(x.title)}</a>
          <div class="notif-meta muted small">${esc(x.kind)}${x.date ? ` · ${esc(fmtDate(x.date))}` : ""}</div>
        </li>`).join("") : '<li class="notif-empty muted small">Nothing yet.</li>'}
      </ul>
    </div>`;
  const bell = document.getElementById("notif-bell");
  const panel = document.getElementById("notif-panel");
  bell.addEventListener("click", (e) => {
    e.stopPropagation();
    if (panel.hasAttribute("hidden")) {
      panel.removeAttribute("hidden"); bell.setAttribute("aria-expanded", "true");
      try { localStorage.setItem(NOTIF_KEY, JSON.stringify(allIds)); } catch { /* */ }
      const badge = bell.querySelector(".notif-badge"); if (badge) badge.remove();
    } else { closeNotif(); }
  });
}
document.addEventListener("click", (e) => { if (!e.target.closest("#notif")) closeNotif(); });
window.addEventListener("hashchange", closeNotif);

function render() {
  const tab = currentTab();
  const body = tab === "commentary" ? viewCommentary() : tab === "cycle" ? viewCycle() : tab === "bubble" ? viewBubble() : tab === "chart" ? viewChart() : viewDashboard();
  app.innerHTML = body;
  syncNav(tab);
  if (tab === "dashboard") loadMacro();
  if (tab === "chart") fetchMacro().then(() => { if (currentTab() === "chart") drawChart(); });
  window.scrollTo(0, 0);
}

// Signed-in identity chip (behind Cloudflare Access), matching Credit & Legal.
async function initMe() {
  try {
    const r = await fetch("/api/me", { headers: { accept: "application/json" } });
    if (!r.ok) return;
    const d = await r.json();
    const el = document.getElementById("account-nav");
    if (el && d.email) { el.innerHTML = `Signed in as <strong>${esc(d.email)}</strong> · <a href="/cdn-cgi/access/logout">Sign out</a>`; el.hidden = false; }
  } catch { /* not behind Access */ }
}

window.addEventListener("hashchange", render);
render();
initMe();
renderDataStatus();
fetchMacro().then(renderNotifications);
