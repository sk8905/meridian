// =============================================================================
// Meridian Macro — standalone dashboard of key US & UK economic indicators, with
// a policy-rate Commentary view and a Dalio-framework Cycle view. Fetches the
// shared Worker /api/macro endpoint (FRED / DBnomics / ONS / S&P Global / BoE).
// Zero dependencies, no build step.
// =============================================================================
import { UPDATED, OUTLOOK, CYCLE, SUMMARY } from "./content.js?v=20260707-6";

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
  </section>`;
}

function renderMacro(data) {
  const series = (data && data.series) || [];
  if (!series.length) return '<section class="card"><p class="muted">Macro data is temporarily unavailable — each indicator is sourced live from FRED, the Bank of England, ONS, DBnomics and S&amp;P Global. Please try again shortly.</p></section>';
  const grids = [["US", "United States"], ["UK", "United Kingdom"]].map(([c, name]) => {
    const tiles = series.filter((s) => s.country === c).map(macroTile).join("");
    return tiles ? `<section class="macro-group"><h2 class="macro-country">${esc(name)}</h2><div class="macro-grid">${tiles}</div></section>` : "";
  }).join("");
  return summaryCards() + grids;
}

// ---- Cycle gauge (stylised 0 early → 100 crisis) ---------------------------
function cycleGauge(items) {
  const W = 340, H = 104, x0 = 14, x1 = 326, trackY = 56, trackH = 12;
  const X = (p) => x0 + (Math.max(0, Math.min(100, p)) / 100) * (x1 - x0);
  const zones = [[6, "Early"], [31, "Leveraging"], [56, "Late cycle"], [81, "Bubble / top"], [98, "Crisis"]];
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
  return `<svg viewBox="0 0 ${W} ${H}" class="gauge" role="img" aria-label="Long-term debt cycle position, 0 early to 100 crisis">
    <defs><linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ece8f6"/><stop offset="1" stop-color="${MACRO_INK}"/>
    </linearGradient></defs>
    <rect x="${x0}" y="${trackY}" width="${x1 - x0}" height="${trackH}" rx="6" fill="url(#gaugeGrad)"/>
    ${zoneText}${marks}
  </svg>`;
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
      <p class="muted">Key US &amp; UK economic indicators — central-bank base rates, the 2-year yield, core inflation, services PMI, wage growth and unemployment — each with 5-year history and a link to its public source. Plus the policy-rate outlook and where we sit in the credit cycle.</p>
    </div>
    <div id="macro-body" class="macro-body"><section class="card"><p class="muted">Loading macro data…</p></section></div>`;
}

function viewCommentary() {
  const country = (name, o) => `
    <section class="macro-group">
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
    ${country("United States", OUTLOOK.us)}
    ${country("United Kingdom", OUTLOOK.uk)}
    ${sourceList(OUTLOOK.sources)}`;
}

function viewCycle() {
  const country = (name, c) => `
    <section class="macro-group">
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
      ${cycleGauge([{ label: "US", pos: CYCLE.us.pos }, { label: "UK", pos: CYCLE.uk.pos }])}
      <p class="muted small macro-gauge-note">${esc(CYCLE.note)}</p>
    </section>
    <section class="macro-group">
      <h2 class="macro-country">Dalio's framework</h2>
      ${CYCLE.framework.map((p) => `<p class="macro-para">${p}</p>`).join("")}
    </section>
    ${country("United States", CYCLE.us)}
    ${country("United Kingdom", CYCLE.uk)}
    ${sourceList(CYCLE.sources)}`;
}

// ---- Tab routing -----------------------------------------------------------
const TABS = [
  ["dashboard", "Dashboard"],
  ["commentary", "Commentary"],
  ["cycle", "Cycle"],
];
function currentTab() {
  const h = (location.hash || "").replace(/^#\/?/, "");
  return TABS.some(([k]) => k === h) ? h : "dashboard";
}
function tabBar(active) {
  return `<nav class="macro-tabs" aria-label="Views">${
    TABS.map(([k, label]) => `<a href="#/${k}" class="mtab${k === active ? " is-active" : ""}"${k === active ? ' aria-current="page"' : ""}>${esc(label)}</a>`).join("")
  }</nav>`;
}

async function loadMacro() {
  let data = { series: [] };
  try { const r = await fetch("/api/macro", { headers: { accept: "application/json" } }); if (r.ok) data = await r.json(); } catch { /* offline */ }
  const el = document.getElementById("macro-body");
  if (el) el.innerHTML = renderMacro(data);
}

function render() {
  const tab = currentTab();
  const body = tab === "commentary" ? viewCommentary() : tab === "cycle" ? viewCycle() : viewDashboard();
  app.innerHTML = tabBar(tab) + body;
  if (tab === "dashboard") loadMacro();
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
