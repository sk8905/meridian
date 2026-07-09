// =============================================================================
// Meridian Macro — standalone dashboard of key US & UK economic indicators, with
// a policy-rate Commentary view and a Dalio-framework Cycle view. Fetches the
// shared Worker /api/macro endpoint (FRED / DBnomics / ONS / S&P Global / BoE).
// Zero dependencies, no build step.
// =============================================================================
import { UPDATED, META, OUTLOOK, CYCLE, BUBBLE, SUMMARY, ALERTS, NEWS, RELEASES, COMMENTARY } from "./content.js?v=20260709-5";

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
  const dir = ch > 0 ? "up" : ch < 0 ? "down" : "flat";
  const arrow = ch > 0 ? "▲" : ch < 0 ? "▼" : "·";
  const chHtml = (ch == null || s.value == null) ? "" :
    `<span class="macro-chg ${dir}" title="change vs previous month">${arrow} ${Math.abs(ch).toFixed(2)}${pct ? " pp" : ""}</span>`;
  const chart = (s.history && s.history.length > 1)
    ? sparkline(s.history)
    : '<div class="spark-empty muted small">5-year history unavailable</div>';
  const asOf = s.asOf ? macroMonth(s.asOf) : "";
  // Whole tile links to the source (matches the Credit key-rates tiles); a small
  // corner control opens this indicator in the Chart view (cross-link).
  const tag = s.href ? "a" : "div";
  const attrs = s.href ? ` href="${esc(s.href)}" target="_blank" rel="noopener noreferrer"` : "";
  const chartLink = (s.country && s.key)
    ? `<span class="macro-chartlink" role="button" tabindex="0" data-chart="${esc(s.country)}:${esc(s.key)}" title="Open ${esc(s.label)} in the Chart" aria-label="Open ${esc(s.label)} in the Chart">📈</span>`
    : "";
  return `<${tag} class="macro-tile"${attrs}>
    <div class="macro-tile-head"><span class="macro-label">${esc(s.label)}</span><span class="macro-sub muted small">${esc(s.sub || "")}</span></div>
    ${chartLink}
    <div class="macro-valrow"><span class="macro-val">${val}</span>${chHtml}</div>
    <div class="macro-chart">${chart}</div>
    <div class="macro-foot muted"><span class="macro-src">${asOf ? esc(asOf) + " · " : ""}${esc(s.source)} ↗</span></div>
  </${tag}>`;
}

function summaryCards() {
  const card = (icon, title, href, cta, us, uk) => `
    <a class="macro-sum" href="${href}">
      <div class="macro-sum-head"><span class="macro-sum-icon" aria-hidden="true">${icon}</span><span class="macro-sum-title">${esc(title)}</span></div>
      <p class="macro-sum-line"><span class="macro-flag">US</span><span class="macro-sum-txt">${us}</span></p>
      <p class="macro-sum-line"><span class="macro-flag">UK</span><span class="macro-sum-txt">${uk}</span></p>
      <span class="macro-sum-cta">${esc(cta)} →</span>
    </a>`;
  return `<section class="macro-summary">
    ${card("◷", "Rate outlook", "#/commentary", "Read the commentary", SUMMARY.outlook.us, SUMMARY.outlook.uk)}
    ${card("◑", "Where we are in the cycle", "#/cycle", "See the cycle view", SUMMARY.cycle.us, SUMMARY.cycle.uk)}
    ${card("◎", "Bubble risk", "#/bubble", "See the bubble view", SUMMARY.bubble.us, SUMMARY.bubble.uk)}
  </section>`;
}

// ---- Date helpers ----------------------------------------------------------
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const isoToDate = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
const todayMidnight = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
// Full-date formatter for news items: "2026-07-01" → "1 Jul 2026".
function fmtDay(iso) {
  const d = isoToDate(iso);
  return d ? `${d.getDate()} ${MONTHS[d.getMonth() + 1]} ${d.getFullYear()}` : (iso || "");
}
// Weekday + day + month for the calendar banner: "2026-07-14" → "Tue 14 Jul".
function fmtWeekday(iso) {
  const d = isoToDate(iso);
  return d ? `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth() + 1]}` : (iso || "");
}

// ---- Upcoming-releases banner ----------------------------------------------
// Shows the next six scheduled US/UK data releases & central-bank announcements
// (soonest first) — one row of 6 on desktop, a 2×3 grid on phones.
function renderReleases() {
  const now = todayMidnight();
  const up = (RELEASES || [])
    .filter((r) => { const d = isoToDate(r.date); return d && d >= now; })
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(0, 6);
  if (!up.length) {
    return `<section class="macro-cal" aria-label="Upcoming economic releases">
      <p class="cal-empty muted small">No major US or UK data releases scheduled this week or next.</p>
    </section>`;
  }
  const tiles = up.map((r) => {
    const tag = r.url ? "a" : "div";
    const attrs = r.url ? ` href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" title="${esc(r.title)} — open source ↗"` : "";
    return `<${tag} class="cal-tile"${attrs}>
      <span class="cal-date"><span class="cal-country cal-${(r.country || "").toLowerCase()}">${esc(r.country || "")}</span> ${esc(fmtWeekday(r.date))}</span>
      <span class="cal-title">${esc(r.title)}</span>
    </${tag}>`;
  }).join("");
  return `<section class="macro-cal" aria-label="Upcoming economic releases">
    <div class="cal-band">${tiles}</div>
  </section>`;
}

// ---- Key macro headlines (Latest-Activity-style, two columns) --------------
// Two columns — US and UK — each newest-first. Each column prefers items ≤ 3
// days old, but falls back to whatever headlines exist rather than an empty one.
function renderNews() {
  const cutoff = todayMidnight(); cutoff.setDate(cutoff.getDate() - 3);
  const pick = (arr) => {
    const sorted = [...(arr || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const fresh = sorted.filter((n) => { const d = isoToDate(n.date); return d && d >= cutoff; });
    return fresh.length ? fresh : sorted;
  };
  const row = (n) => `
    <li class="compact-item">
      <a class="compact-head" href="${esc(n.url)}" target="_blank" rel="noopener noreferrer">${esc(n.title)}</a>
      <div class="compact-meta muted small">${esc(fmtDay(n.date))} · ${esc(n.source)} ↗</div>
    </li>`;
  const col = (name, arr) => {
    const items = pick(arr);
    const list = items.length
      ? `<ul class="compact-list">${items.map(row).join("")}</ul>`
      : `<p class="muted small">Headlines are temporarily unavailable.</p>`;
    return `<div class="news-col"><h3 class="news-col-head">${esc(name)}</h3>${list}</div>`;
  };
  return `<section class="card feature-card macro-news-panel">
    <h2>Key macro headlines</h2>
    <div class="news-cols">${col("United States", NEWS && NEWS.us)}${col("United Kingdom", NEWS && NEWS.uk)}</div>
  </section>`;
}

// ---- Recent market commentary (Commentary view) ----------------------------
// Same two-column, newest-first feed styling as Key macro headlines, but for
// analyst/economist opinion & research pieces (no recency cut-off — analysis
// stays relevant longer). Meta line carries the author where named.
function renderCommentaryFeed() {
  const row = (n) => `
    <li class="compact-item">
      <a class="compact-head" href="${esc(n.url)}" target="_blank" rel="noopener noreferrer">${esc(n.title)}</a>
      <div class="compact-meta muted small">${esc(fmtDay(n.date))} · ${esc(n.source)}${n.author ? " · " + esc(n.author) : ""} ↗</div>
    </li>`;
  const col = (name, arr) => {
    const items = [...(arr || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const list = items.length
      ? `<ul class="compact-list">${items.map(row).join("")}</ul>`
      : `<p class="muted small">No commentary available right now.</p>`;
    return `<div class="news-col"><h3 class="news-col-head">${esc(name)}</h3>${list}</div>`;
  };
  return `<section class="card feature-card macro-news-panel">
    <h2>Recent market commentary</h2>
    <p class="muted small">Selected bank research, analyst &amp; economist views on the Fed and Bank of England, newest first. Click a piece to open it.</p>
    <div class="news-cols">${col("United States", COMMENTARY && COMMENTARY.us)}${col("United Kingdom", COMMENTARY && COMMENTARY.uk)}</div>
  </section>`;
}

function renderMacro(data) {
  const series = (data && data.series) || [];
  if (!series.length) return '<section class="card"><p class="muted">Macro data is temporarily unavailable — each indicator is sourced live from FRED, the Bank of England, ONS, DBnomics and S&amp;P Global. Please try again shortly.</p></section>';
  const grids = [["US", "United States"], ["UK", "United Kingdom"]].map(([c, name]) => {
    const tiles = series.filter((s) => s.country === c).map(macroTile).join("");
    return tiles ? `<section class="macro-group"><h2 class="macro-country">${esc(name)}</h2><div class="macro-grid">${tiles}</div></section>` : "";
  }).join("");
  return renderReleases() + grids + renderNews() + summaryCards();
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
      <p class="macro-note-sub"><strong>${esc(o.rate)}</strong> · ${esc(o.stance)}</p>
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
    ${renderCommentaryFeed()}
    ${sourceList(OUTLOOK.sources)}`;
}

function viewCycle() {
  const country = (name, c) => `
    <section class="card macro-note">
      <h2 class="macro-country">${esc(name)}</h2>
      <p class="macro-note-sub"><strong>${esc(c.shortStage)}</strong> · ${esc(c.longStage)}</p>
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
// secondary encoding (solid = US, dashed = UK). Each series is indexed to 0 at
// its first (2021) point, so every line starts at zero and shows the change
// since — differently-measured indicators share one axis (no dual-axis); the
// hover tooltip shows the actual values.
const IND_COLOR = {
  base_rate: "#2563eb", two_year: "#0891b2", core_cpi: "#dc2626",
  services_pmi: "#d97706", wages: "#7c3aed", unemployment: "#db2777",
};
const INDICATORS = [
  ["base_rate", "Base rate"], ["two_year", "2-year yield"], ["core_cpi", "Core inflation"],
  ["services_pmi", "Services PMI"], ["wages", "Wage growth"], ["unemployment", "Unemployment"],
];
const CHART_EVENTS = [
  { id: "omicron", date: "2021-12", label: "COVID Omicron wave", desc: "The Omicron variant drove a record global COVID case wave over winter 2021–22, snarling supply chains and labour just as inflation was building." },
  { id: "ukraine", date: "2022-02", label: "Russia invades Ukraine", desc: "Russia's full-scale invasion sent energy and food prices soaring, adding a huge supply-side shock to global inflation." },
  { id: "liftoff", date: "2022-03", label: "Fed lift-off (first hike)", desc: "The Fed raised rates for the first time since 2018, opening the fastest tightening cycle in decades to fight 40-year-high inflation." },
  { id: "truss", date: "2022-09", label: "Truss mini-budget", desc: "The UK government's unfunded tax-cut 'mini-budget' triggered a gilt-market rout and pension-fund (LDI) crisis, forcing an emergency BoE intervention." },
  { id: "ftx", date: "2022-11", label: "FTX collapse", desc: "The sudden failure of crypto exchange FTX wiped out billions and marked the low point of the 2022 crypto crash." },
  { id: "svb", date: "2023-03", label: "SVB / banking stress", desc: "The collapse of Silicon Valley Bank (with Signature and Credit Suisse) sparked a global banking-stress scare and fears of a credit crunch." },
  { id: "boepeak", date: "2023-08", label: "BoE Bank Rate peaks 5.25%", desc: "The Bank of England raised Bank Rate to 5.25% — its 14th straight hike and the peak of the UK tightening cycle." },
  { id: "gaza", date: "2023-10", label: "Israel–Hamas war", desc: "The outbreak of the Israel–Hamas war raised Middle-East tensions and renewed oil-price risk." },
  { id: "ukelection", date: "2024-07", label: "UK election — Labour win", desc: "Labour won a landslide UK general election, ending 14 years of Conservative government and reshaping the fiscal outlook." },
  { id: "fedcut", date: "2024-09", label: "First Fed rate cut", desc: "The Fed delivered its first cut of the cycle, pivoting away from hikes as inflation cooled toward target." },
  { id: "trump", date: "2024-11", label: "Trump re-election", desc: "Donald Trump won the US presidential election, shifting the outlook toward tariffs, tax cuts and deregulation." },
  { id: "tariffs", date: "2025-04", label: "US tariff shock", desc: "Sweeping new US import tariffs reignited trade-war fears and stoked concerns about a fresh goods-inflation impulse." },
  { id: "iran", date: "2026-05", label: "Middle East / Iran conflict", desc: "Renewed Middle-East / Iran conflict spiked oil prices and revived energy-driven inflation worries." },
];
const CHART_MAX = 12;
const CHART_DEFAULT_SEL = ["US:base_rate", "US:core_cpi", "UK:base_rate", "UK:core_cpi"];
const CHART_DEFAULT_EVT = ["truss", "trump"];
// Chart selection persists across devices (server KV, keyed on Access email) with
// a localStorage cache for instant load; see chartPersist()/initChartPrefs().
const CHART_API = "/api/chart-prefs", CHART_LS = "mchart";
function chartReadLocal() {
  try { const o = JSON.parse(localStorage.getItem(CHART_LS) || "null"); return o && Array.isArray(o.sel) && Array.isArray(o.events) ? o : null; } catch { return null; }
}
const CHART_RANGES = { "1y": 12, "3y": 36, "5y": 60, "max": Infinity };
const CHART_DEFAULT_RANGE = "5y";
const _chartLocal = chartReadLocal();
let chartSel = new Set(_chartLocal ? _chartLocal.sel : CHART_DEFAULT_SEL);
let chartEvents = new Set(_chartLocal ? _chartLocal.events : CHART_DEFAULT_EVT);
let chartRange = (_chartLocal && CHART_RANGES[_chartLocal.range]) ? _chartLocal.range : CHART_DEFAULT_RANGE;
function chartPersist() {
  const payload = { sel: [...chartSel], events: [...chartEvents], range: chartRange };
  try { localStorage.setItem(CHART_LS, JSON.stringify(payload)); } catch { /* ignore */ }
  try { fetch(CHART_API, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }); } catch { /* not behind Access */ }
}

const MI = (ym) => { const p = String(ym).split("-"); return (+p[0]) * 12 + (+p[1] - 1); };
const miLabel = (mi) => `${Math.floor(mi / 12)}-${String((mi % 12) + 1).padStart(2, "0")}`;
function chartSeriesAll() {
  return ((MACRO_DATA && MACRO_DATA.series) || [])
    .filter((x) => x.history && x.history.length > 1)
    .map((x) => ({ ...x, selKey: `${x.country}:${x.key}` }));
}

function indBox(country) {
  const dash = country === "UK" ? " dash" : "";
  return INDICATORS.map(([k, l]) => {
    const sk = `${country}:${k}`;
    return `<label class="chart-ind"><input type="checkbox" class="chart-ind-cb" data-sel="${sk}"${chartSel.has(sk) ? " checked" : ""}/><span class="chart-ind-sw${dash}" style="--c:${IND_COLOR[k]}"></span>${esc(l)}</label>`;
  }).join("");
}
// Master "select / deselect all" checkbox for one country's indicators.
function allBox(country) {
  const keys = INDICATORS.map(([k]) => `${country}:${k}`);
  const all = keys.every((k) => chartSel.has(k));
  return `<label class="chart-ind-all"><input type="checkbox" class="chart-all-cb" data-all="${country}"${all ? " checked" : ""}/> All</label>`;
}
// Keep each country's master checkbox in sync (checked when all selected,
// indeterminate when only some are). Indeterminate can't be set via markup.
function syncChartAll() {
  ["US", "UK"].forEach((country) => {
    const master = document.querySelector(`.chart-all-cb[data-all="${country}"]`);
    if (!master) return;
    const keys = INDICATORS.map(([k]) => `${country}:${k}`);
    const n = keys.filter((k) => chartSel.has(k)).length;
    master.checked = n === keys.length;
    master.indeterminate = n > 0 && n < keys.length;
  });
}
function viewChart() {
  const chips = CHART_EVENTS.map((e, i) => `<button type="button" class="chart-evt${chartEvents.has(e.id) ? " is-on" : ""}" data-evt="${e.id}" title="${esc(e.label)} — ${esc(e.desc)}"><span class="evt-num">${i + 1}</span>${esc(e.label)}</button>`).join("");
  return `
    <div class="page-head">
      <h1>Chart</h1>
      <p class="muted">Overlay any of the dashboard indicators (US &amp; UK) over your chosen window and toggle key events. Every series is indexed to 0 at the start of the window, so the lines show the change since then rather than the level — hover for the actual values.</p>
    </div>
    <section class="card chart-ctrls">
      <div class="chart-ctrl-grp">
        <div class="chart-ctrl-h">Indicators <span class="muted small">(<span id="chart-count">${chartSel.size}</span> of 12 selected)</span></div>
        <div class="chart-ind-cols">
          <div><div class="chart-ind-country">United States <span class="chart-line-key">— solid</span>${allBox("US")}</div><div class="chart-ind-grid">${indBox("US")}</div></div>
          <div><div class="chart-ind-country">United Kingdom <span class="chart-line-key">- - dashed</span>${allBox("UK")}</div><div class="chart-ind-grid">${indBox("UK")}</div></div>
        </div>
      </div>
      <div class="chart-ctrl-grp">
        <div class="chart-ctrl-h">Events</div>
        <div class="chart-evts">${chips}</div>
      </div>
    </section>
    <section class="card">
      <div class="chart-toolbar">
        <div class="chart-range" role="group" aria-label="Time range">
          ${Object.keys(CHART_RANGES).map((r) => `<button type="button" class="chart-range-btn${chartRange === r ? " is-on" : ""}" data-range="${r}">${r === "max" ? "Max" : r.toUpperCase()}</button>`).join("")}
        </div>
        <button type="button" class="chart-export" id="chart-export" title="Download the chart as a PNG image">⤓ PNG</button>
      </div>
      <div id="chart-canvas"><p class="muted">Loading macro data…</p></div>
    </section>`;
}

function drawChart() {
  const canvas = document.getElementById("chart-canvas");
  if (!canvas) return;
  const all = chartSeriesAll();
  if (!all.length) { canvas.innerHTML = '<p class="muted">Macro data is temporarily unavailable — please try again shortly.</p>'; return; }
  const sel = all.filter((s) => chartSel.has(s.selKey));
  const W = 980, H = 470, plotL = 40, plotR = W - 14, plotT = 30, plotB = H - 34;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  let gMin = Infinity, gMax = -Infinity;
  all.forEach((s) => s.history.forEach((p) => { const mi = MI(p.label); if (mi < gMin) gMin = mi; if (mi > gMax) gMax = mi; }));
  // The visible window is the selected range, anchored to the latest data.
  const months = CHART_RANGES[chartRange] || 60;
  const m1 = gMax;
  const m0 = months === Infinity ? gMin : Math.max(gMin, gMax - months + 1);
  const span = (m1 - m0) || 1;
  const xFor = (mi) => plotL + ((mi - m0) / span) * plotW;
  // Only the points inside the window; each series is indexed to 0 at the first
  // in-window point, so the lines show the change across the chosen range.
  const inRange = (s) => s.history.filter((p) => { const mi = MI(p.label); return mi >= m0 && mi <= m1; });
  const base = (s) => { const r = inRange(s); return r.length ? r[0].value : (s.history[0] ? s.history[0].value : 0); };
  const ival = (s, v) => v - base(s);
  const fmtI = (v) => (v >= 0 ? "+" : "") + v.toFixed(2);
  let lo = 0, hi = 0;
  sel.forEach((s) => inRange(s).forEach((p) => { const y = ival(s, p.value); if (y < lo) lo = y; if (y > hi) hi = y; }));
  if (lo === hi) { lo -= 1; hi += 1; }
  const padY = (hi - lo) * 0.08; lo -= padY; hi += padY;
  const yFor = (v) => plotB - ((v - lo) / (hi - lo)) * plotH;
  const niceTicks = (a, b, n) => {
    const step0 = (b - a) / n || 1;
    const mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const norm = step0 / mag;
    const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    const out = [];
    for (let t = Math.ceil(a / step) * step; t <= b + step * 1e-6; t += step) out.push(+t.toFixed(6));
    return out;
  };
  const grid = niceTicks(lo, hi, 5).map((t) => {
    const y = yFor(t), zero = Math.abs(t) < 1e-9;
    return `<line x1="${plotL}" y1="${y.toFixed(1)}" x2="${plotR}" y2="${y.toFixed(1)}" class="chart-grid${zero ? " chart-zero" : ""}"/><text x="${plotL - 6}" y="${(y + 3).toFixed(1)}" class="chart-ylab" text-anchor="end">${+t.toFixed(2)}</text>`;
  }).join("");
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
    ev += `<g class="chart-evmark" data-evt="${e.id}">` +
      `<line x1="${x.toFixed(1)}" y1="${plotT}" x2="${x.toFixed(1)}" y2="${plotB}" class="chart-evline"/>` +
      `<circle cx="${x.toFixed(1)}" cy="${(plotT - 10).toFixed(1)}" r="8" class="chart-evdot"/>` +
      `<text x="${x.toFixed(1)}" y="${(plotT - 10).toFixed(1)}" class="chart-evnum" text-anchor="middle" dominant-baseline="central">${i + 1}</text>` +
      `<circle cx="${x.toFixed(1)}" cy="${(plotT - 10).toFixed(1)}" r="13" fill="transparent" class="chart-evhit"/>` +
      `</g>`;
  });
  const lines = sel.map((s) => {
    const pts = inRange(s).map((p) => [xFor(MI(p.label)), yFor(ival(s, p.value))]);
    const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    return `<path d="${d}" fill="none" stroke="${IND_COLOR[s.key]}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"${s.country === "UK" ? ' stroke-dasharray="6 4"' : ""}/>`;
  }).join("");

  const legend = sel.map((s) => {
    const r = inRange(s), last = r[r.length - 1];
    return `<span class="chart-leg"><span class="chart-swatch${s.country === "UK" ? " dash" : ""}" style="--c:${IND_COLOR[s.key]}"></span>${esc(s.country)} · ${esc(s.label)} <b>${last ? fmtI(ival(s, last.value)) : "—"}</b></span>`;
  }).join("");

  const startYr = miLabel(m0).slice(0, 4);
  const svg = `<svg viewBox="0 0 ${W} ${H}" class="chart-svg" id="chart-svg" role="img" aria-label="Selected macro indicators, each indexed to 0 at the start of the window">
    ${grid}${xticks}${ev}${lines}
    <line id="chart-cross" class="chart-cross" y1="${plotT}" y2="${plotB}" style="display:none"/>
    <g id="chart-hoverdots"></g>
    <rect x="${plotL}" y="${plotT}" width="${plotW}" height="${plotH}" fill="transparent" id="chart-hit"/>
  </svg>`;
  canvas.innerHTML = `<div class="chart-main">${svg}<div id="chart-tip" class="chart-tip" hidden></div></div>
    <div class="chart-legend">${sel.length ? legend : '<span class="muted">Select one or more indicators to plot.</span>'}</div>
    <p class="muted small chart-note">Every series is indexed to <b>0 at ${esc(macroMonth(miLabel(m0)))}</b> (the start of the window), so each line shows the change since then in the indicator's own units — percentage points for rates, inflation, wages and unemployment; index points for the PMIs. Hover for the actual values. Line style: <b>solid = US</b>, <b>dashed = UK</b>.</p>`;

  // Event markers get a hover bubble explaining the event (works even with no
  // indicators selected, so it's wired before the crosshair setup below).
  const evtip = document.getElementById("chart-tip"), evmain = canvas.querySelector(".chart-main");
  const EVBY = Object.fromEntries(CHART_EVENTS.map((e, i) => [e.id, { n: i + 1, ...e }]));
  canvas.querySelectorAll(".chart-evmark").forEach((g) => {
    const info = EVBY[g.getAttribute("data-evt")]; if (!info) return;
    const show = (e) => {
      evtip.innerHTML = `<div class="tip-date">${info.n}. ${esc(info.label)} <span class="tip-real">${esc(macroMonth(info.date))}</span></div><div class="evtip-desc">${esc(info.desc)}</div>`;
      evtip.hidden = false;
      const mr = evmain.getBoundingClientRect();
      let tx = e.clientX - mr.left + 14; const ty = e.clientY - mr.top + 8;
      if (tx > mr.width - 250) tx = e.clientX - mr.left - 260;
      evtip.style.left = Math.max(2, tx) + "px"; evtip.style.top = Math.max(2, ty) + "px";
    };
    g.addEventListener("mouseenter", show);
    g.addEventListener("mousemove", show);
    g.addEventListener("mouseleave", () => { evtip.hidden = true; });
  });

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
      dd += `<circle cx="${xFor(MI(pt.label)).toFixed(1)}" cy="${yFor(ival(s, pt.value)).toFixed(1)}" r="3.5" fill="${IND_COLOR[s.key]}" stroke="#fff" stroke-width="1.5"/>`;
      rows += `<div class="tip-row"><span class="tip-dot" style="background:${IND_COLOR[s.key]}"></span>${esc(s.country)} ${esc(s.label)}: <b>${fmtI(ival(s, pt.value))}</b> <span class="tip-real">(${(+pt.value).toFixed(2)}${s.unit === "%" ? "%" : ""})</span></div>`;
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
  syncChartAll();
  chartPersist();
  drawChart();
});
// Master "All" checkbox — select / deselect a whole country's indicators.
document.addEventListener("change", (e) => {
  const all = e.target.closest(".chart-all-cb"); if (!all) return;
  const country = all.getAttribute("data-all");
  const keys = INDICATORS.map(([k]) => `${country}:${k}`);
  if (all.checked) keys.forEach((k) => { if (chartSel.size < CHART_MAX || chartSel.has(k)) chartSel.add(k); });
  else keys.forEach((k) => chartSel.delete(k));
  document.querySelectorAll(".chart-ind-cb").forEach((cb) => { cb.checked = chartSel.has(cb.getAttribute("data-sel")); });
  const c = document.getElementById("chart-count"); if (c) c.textContent = chartSel.size;
  syncChartAll();
  chartPersist();
  drawChart();
});
document.addEventListener("click", (e) => {
  const chip = e.target.closest(".chart-evt"); if (!chip) return;
  const id = chip.getAttribute("data-evt");
  if (chartEvents.has(id)) chartEvents.delete(id); else chartEvents.add(id);
  chip.classList.toggle("is-on");
  chartPersist();
  drawChart();
});
document.addEventListener("click", (e) => {
  const rb = e.target.closest(".chart-range-btn"); if (!rb) return;
  chartRange = rb.getAttribute("data-range");
  document.querySelectorAll(".chart-range-btn").forEach((b) => b.classList.toggle("is-on", b === rb));
  chartPersist();
  drawChart();
});
document.addEventListener("click", (e) => { if (e.target.closest("#chart-export")) exportChartPng(); });
// Dashboard tile → open this indicator in the Chart (stops the tile's source link).
function openInChart(el) {
  const k = el.getAttribute("data-chart"); if (!k) return;
  location.hash = "#/chart?add=" + encodeURIComponent(k);
}
document.addEventListener("click", (e) => {
  const cl = e.target.closest(".macro-chartlink"); if (!cl) return;
  e.preventDefault(); e.stopPropagation(); openInChart(cl);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const cl = e.target.closest && e.target.closest(".macro-chartlink"); if (!cl) return;
  e.preventDefault(); openInChart(cl);
});

// Rasterise the chart SVG to a PNG download. External CSS doesn't travel with a
// serialised SVG, so the presentation properties are inlined onto a clone first.
function exportChartPng() {
  const svg = document.getElementById("chart-svg"); if (!svg) return;
  const W = svg.viewBox.baseVal.width || 980, H = svg.viewBox.baseVal.height || 470;
  const clone = svg.cloneNode(true);
  const inline = (src, dst) => {
    const cs = getComputedStyle(src);
    ["fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-linejoin", "stroke-linecap", "opacity", "font-size", "font-weight", "font-family", "text-anchor", "display"].forEach((p) => {
      const v = cs.getPropertyValue(p); if (v) dst.style.setProperty(p, v);
    });
    for (let i = 0; i < src.children.length; i++) if (dst.children[i]) inline(src.children[i], dst.children[i]);
  };
  inline(svg, clone);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", 0); bg.setAttribute("y", 0); bg.setAttribute("width", W); bg.setAttribute("height", H); bg.setAttribute("fill", "#ffffff");
  clone.insertBefore(bg, clone.firstChild);
  const xml = new XMLSerializer().serializeToString(clone);
  const url = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
  const img = new Image();
  img.onload = () => {
    const scale = 2, canvas = document.createElement("canvas");
    canvas.width = W * scale; canvas.height = H * scale;
    const ctx = canvas.getContext("2d"); ctx.scale(scale, scale); ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "meridian-macro-chart.png";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, "image/png");
  };
  img.src = url;
}

// ---- Tab routing -----------------------------------------------------------
const TABS = [
  ["dashboard", "Dashboard"],
  ["commentary", "Commentary"],
  ["cycle", "Cycle"],
  ["bubble", "Bubble"],
  ["chart", "Chart"],
];
function currentTab() {
  const h = (location.hash || "").replace(/^#\/?/, "").split("?")[0];
  return TABS.some(([k]) => k === h) ? h : "dashboard";
}
// Read the current hash query (e.g. #/chart?add=US:core_cpi → {add:"US:core_cpi"}).
function hashQuery() {
  const q = (location.hash || "").split("?")[1] || "";
  const out = {};
  new URLSearchParams(q).forEach((v, k) => { out[k] = v; });
  return out;
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
// "Seen" ids sync per-user across devices via /api/notif-macro (KV keyed on the
// verified Access email), with localStorage as an instant cache / offline
// fallback — so acknowledging items on one device clears them on the others.
const NOTIF_KEY = "meridian.macro.notifSeen";
const NOTIF_API = "/api/notif-macro";
let notifSeen = null;    // resolved array of acknowledged ids (null until known)
let notifCloud = false;  // true once the per-user seen-set API responds
function notifReadLocal() {
  try { const p = JSON.parse(localStorage.getItem(NOTIF_KEY) || "null"); return Array.isArray(p) ? p : null; } catch { return null; }
}
function notifPersist(ids) {
  notifSeen = ids;
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(ids)); } catch { /* */ }
  if (notifCloud) fetch(NOTIF_API, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ seen: ids }) }).catch(() => {});
}
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
      source: s.source || "",
      href: "#/dashboard",
      date: s.asOf ? `${s.asOf}-01` : "",
    };
  });
}
function notifItems() {
  const data = dataAlerts((MACRO_DATA && MACRO_DATA.series) || []);
  // Guidance alerts (rate outlook / cycle / bubble) are Meridian's own editorial
  // synthesis — note their proprietary source; data alerts carry the provider.
  const guidance = ALERTS.map((a) => ({ ...a, source: "Meridian analysis" }));
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
  // Until the seen-set is resolved (local + cross-device), show no "new" badge.
  const seenSet = notifSeen ? new Set(notifSeen) : null;
  const fresh = seenSet ? all.filter((x) => !seenSet.has(x.id)) : [];
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
          <div class="notif-meta muted small">${esc(x.kind)}${x.date ? ` · ${esc(fmtDate(x.date))}` : ""}${x.source ? ` · <span class="notif-src">${esc(x.source)}</span>` : ""}</div>
        </li>`).join("") : '<li class="notif-empty muted small">Nothing yet.</li>'}
      </ul>
    </div>`;
  const bell = document.getElementById("notif-bell");
  const panel = document.getElementById("notif-panel");
  bell.addEventListener("click", (e) => {
    e.stopPropagation();
    if (panel.hasAttribute("hidden")) {
      panel.removeAttribute("hidden"); bell.setAttribute("aria-expanded", "true");
      notifPersist([...new Set([...(notifSeen || []), ...allIds])]);
      const badge = bell.querySelector(".notif-badge"); if (badge) badge.remove();
    } else { closeNotif(); }
  });
}
// Resolve the seen-set: instant render from localStorage, then reconcile with the
// per-user server copy so items acknowledged on another device drop off here too.
async function initNotif() {
  notifSeen = notifReadLocal();
  renderNotifications();
  let serverSeen = null;
  try {
    const r = await fetch(NOTIF_API, { headers: { accept: "application/json" } });
    if (r.ok) { const d = await r.json(); serverSeen = Array.isArray(d.seen) ? d.seen : []; notifCloud = true; }
  } catch { /* not behind Access → local-only */ }
  const allIds = notifItems().map((x) => x.id);
  const local = notifReadLocal() || [];
  const baseline = ((serverSeen && serverSeen.length) || local.length)
    ? [...new Set([...local, ...(serverSeen || [])])]   // seen on any device
    : allIds;                                           // first use anywhere → no badge
  notifSeen = baseline;
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(baseline)); } catch { /* */ }
  if (notifCloud && (!serverSeen || baseline.length !== serverSeen.length)) {
    fetch(NOTIF_API, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ seen: baseline }) }).catch(() => {});
  }
  renderNotifications();
}
document.addEventListener("click", (e) => { if (!e.target.closest("#notif")) closeNotif(); });
window.addEventListener("hashchange", closeNotif);

function render() {
  const tab = currentTab();
  // Deep-link from a dashboard tile: #/chart?add=US:core_cpi preselects that
  // indicator, then the param is consumed so it doesn't re-fire on re-render.
  if (tab === "chart") {
    const add = hashQuery().add;
    if (add && /^(US|UK):[a-z_]+$/.test(add)) {
      if (!chartSel.has(add) && chartSel.size < CHART_MAX) { chartSel.add(add); chartPersist(); }
      history.replaceState(null, "", "#/chart");
    }
  }
  const body = tab === "commentary" ? viewCommentary() : tab === "cycle" ? viewCycle() : tab === "bubble" ? viewBubble() : tab === "chart" ? viewChart() : viewDashboard();
  app.innerHTML = body;
  syncNav(tab);
  if (tab === "dashboard") loadMacro();
  if (tab === "chart") { syncChartAll(); fetchMacro().then(() => { if (currentTab() === "chart") drawChart(); }); }
  window.scrollTo(0, 0);
}

// Signed-in identity chip (behind Cloudflare Access), matching Credit & Legal.
async function initMe() {
  try {
    const r = await fetch("/api/me", { headers: { accept: "application/json" } });
    if (!r.ok) return;
    const d = await r.json();
    const el = document.getElementById("account-nav");
    if (el && d.email) { el.innerHTML = `<span class="si-prefix">Signed in as </span><strong>${esc(d.email)}</strong> · <a href="/cdn-cgi/access/logout">Sign out</a>`; el.hidden = false; }
  } catch { /* not behind Access */ }
}

// Load the saved chart selection from the server (cross-device). If the server
// has a record, it wins (it's the last selection made on any device); otherwise
// seed the server from whatever is stored locally. Re-render if on the chart tab.
function initChartPrefs() {
  fetch(CHART_API, { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d) return;
      if (d.stored && Array.isArray(d.sel) && Array.isArray(d.events)) {
        chartSel = new Set(d.sel.slice(0, CHART_MAX));
        chartEvents = new Set(d.events);
        if (CHART_RANGES[d.range]) chartRange = d.range;
        try { localStorage.setItem(CHART_LS, JSON.stringify({ sel: [...chartSel], events: [...chartEvents], range: chartRange })); } catch { /* ignore */ }
        if (currentTab() === "chart") render();
      } else if (_chartLocal) {
        // Server has nothing yet but this device does — seed it so other devices sync.
        chartPersist();
      }
    })
    .catch(() => { /* not behind Access */ });
}

window.addEventListener("hashchange", render);
// Unified ⌘K / Ctrl-K search, mounted in-place (opens over the current app).
import("/palette.js?v=20260708-5").then((m) => m.mountPalette()).catch(() => {});
render();
initMe();
renderDataStatus();
fetchMacro().then(initNotif);
initChartPrefs();
