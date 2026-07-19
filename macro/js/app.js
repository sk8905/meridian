// =============================================================================
// Wire Macro — standalone dashboard of key US & UK economic indicators, with
// a Commentary reading list, a Policy Rate view and a Dalio-framework Cycle view.
// Fetches the shared Worker /api/macro endpoint (FRED / DBnomics / ONS / S&P
// Global / BoE). Zero dependencies, no build step.
// =============================================================================
import { UPDATED, META, OUTLOOK, CYCLE, BUBBLE, SUMMARY, YIELD_CURVE, ALERTS, NEWS, RELEASES, COMMENTARY, ARTICLES, MATWALL } from "./content.js?v=20260719-2";

const app = document.getElementById("app");
const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Chart colours are CSS vars (defined light + dark in css/styles.css) so the
// sparklines, the multi-series Chart tab and the policy gauge flip live with the
// theme toggle rather than staying pinned to their light values.
const MACRO_COLOR = "var(--macro-line)";
const MACRO_INK = "var(--macro-deep)";
// Low-tier aggregator / SEO / forecast-farm sources kept out of the News wire so it
// stays on premium newsrooms (mirrors the Home feed's NON_PREMIUM list in glance.js).
const MAC_NON_PREMIUM = new Set([
  "Benzinga", "TheStreet", "Yahoo Finance", "Yahoo Finance UK", "Sunday Guardian Live",
  "HomeOwners Alliance", "U.S. News", "CityAM", "Enterprise AM", "exchangerates.org.uk",
  "TradingView", "GV Wire", "CryptoTimes", "Financial Mirror", "FX Leaders", "Currency News UK",
]);
// Live macro news wire (shared Worker /api/feed) folded into the dashboard News
// tab alongside the curated ARTICLES/NEWS. Seeded from a localStorage cache so it
// shows instantly, then refreshed in the background.
let _macFeed = [];
try { _macFeed = (JSON.parse(localStorage.getItem("wire.macro.feed") || "[]") || []).slice(0, 60); } catch { /* ignore */ }
let _macFeedLoaded = false;
async function loadMacroFeed() {
  if (_macFeedLoaded) return;
  _macFeedLoaded = true;
  try {
    const r = await fetch("/api/feed", { headers: { accept: "application/json" } });
    if (!r.ok) return;
    const d = await r.json();
    const items = (d && Array.isArray(d.items)) ? d.items : [];
    if (!items.length) return;
    const changed = items.length !== _macFeed.length || (items[0] && (!_macFeed[0] || items[0].title !== _macFeed[0].title));
    _macFeed = items;
    try { localStorage.setItem("wire.macro.feed", JSON.stringify(items.slice(0, 60))); } catch { /* ignore */ }
    // If the reader is on the dashboard and the data actually changed, re-render so
    // the new live headlines appear in the News wire.
    if (changed && document.getElementById("mac-wire")) render();
  } catch { /* offline */ }
}
const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function macroMonth(ym) { const p = String(ym || "").split("-"); return p.length === 2 ? `${MONTHS[+p[1]] || ""} ${p[0]}` : ""; }

// Sparkline geometry — shared by the renderer and the hover handler so the two
// agree on where each month sits.
const SPARK = { W: 300, H: 88, padX: 4, top: 8, bottom: 16 };
// Compact sparkline — area + line + last-point dot, first/last year labels, plus
// a hidden crosshair + dot the hover handler moves to the nearest month. The raw
// [month,value] points and the unit are embedded so hover can read them back.
function sparkline(data, { color = MACRO_COLOR, unit = "" } = {}) {
  const { W, H, padX, top, bottom } = SPARK;
  if (!data || data.length < 2) return `<svg viewBox="0 0 ${W} ${H}" class="spark" role="img"></svg>`;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals), max = Math.max(...vals), span = (max - min) || 1;
  const plotW = W - padX * 2, plotH = H - top - bottom;
  const X = (i) => padX + (i / (data.length - 1)) * plotW;
  const Y = (v) => top + plotH - ((v - min) / span) * plotH;
  const pts = data.map((d, i) => [X(i), Y(d.value)]);
  const path = pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const area = `${path} L ${last[0].toFixed(1)} ${top + plotH} L ${pts[0][0].toFixed(1)} ${top + plotH} Z`;
  const yr = (l) => String(l).slice(0, 4);
  const spk = data.map((d) => [d.label, +(+d.value).toFixed(2)]);
  return `<svg viewBox="0 0 ${W} ${H}" class="spark" role="img" data-spark='${JSON.stringify(spk)}' data-unit="${esc(unit)}">
    <rect x="0" y="0" width="${W}" height="${H}" fill="transparent"/>
    <path d="${area}" fill="${color}" fill-opacity="0.10"/>
    <path d="${path}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.2" fill="${color}"/>
    <line class="spark-cross" y1="${top}" y2="${top + plotH}" stroke="${color}" stroke-width="1" stroke-dasharray="2 2" style="display:none"/>
    <circle class="spark-hover" r="3" fill="${color}" stroke="var(--surface)" stroke-width="1.5" style="display:none"/>
    <text x="${padX}" y="${H - 3}" class="spark-x">${esc(yr(data[0].label))}</text>
    <text x="${W - padX}" y="${H - 3}" text-anchor="end" class="spark-x">${esc(yr(data[data.length - 1].label))}</text>
  </svg>`;
}
// One shared tooltip for all sparklines; a delegated pointer handler drives it so
// it survives every dashboard re-render (range toggle, cross-device sync).
let _sparkTip = null;
function sparkTipEl() {
  if (_sparkTip) return _sparkTip;
  _sparkTip = document.createElement("div");
  _sparkTip.className = "spark-tip"; _sparkTip.hidden = true;
  document.body.appendChild(_sparkTip);
  return _sparkTip;
}
function hideSparkHover(svg) {
  if (svg) svg.querySelectorAll(".spark-cross,.spark-hover").forEach((el) => (el.style.display = "none"));
  if (_sparkTip) _sparkTip.hidden = true;
}
document.addEventListener("mousemove", (e) => {
  const svg = e.target.closest && e.target.closest(".spark");
  if (!svg) { if (_sparkTip && !_sparkTip.hidden) _sparkTip.hidden = true; return; }
  let data; try { data = JSON.parse(svg.getAttribute("data-spark") || "[]"); } catch { return; }
  if (!data || data.length < 2) return;
  const { W, padX, top, bottom, H } = SPARK, plotW = W - padX * 2, plotH = H - top - bottom;
  const vals = data.map((d) => d[1]); const min = Math.min(...vals), max = Math.max(...vals), span = (max - min) || 1;
  const r = svg.getBoundingClientRect();
  const mx = (e.clientX - r.left) / r.width * W;
  let i = Math.round((mx - padX) / plotW * (data.length - 1));
  i = Math.max(0, Math.min(data.length - 1, i));
  const px = padX + (i / (data.length - 1)) * plotW;
  const py = top + plotH - ((data[i][1] - min) / span) * plotH;
  const cross = svg.querySelector(".spark-cross"), dot = svg.querySelector(".spark-hover");
  if (cross) { cross.setAttribute("x1", px.toFixed(1)); cross.setAttribute("x2", px.toFixed(1)); cross.style.display = ""; }
  if (dot) { dot.setAttribute("cx", px.toFixed(1)); dot.setAttribute("cy", py.toFixed(1)); dot.style.display = ""; }
  const unit = svg.getAttribute("data-unit") || "";
  const tip = sparkTipEl();
  tip.innerHTML = `<b>${esc(macroMonth(data[i][0]))}</b> · ${data[i][1].toFixed(2)}${esc(unit)}`;
  tip.hidden = false;
  const near = e.clientX > window.innerWidth - 150;
  tip.style.left = (near ? e.clientX - 12 - tip.offsetWidth : e.clientX + 12) + "px";
  tip.style.top = (e.clientY - 8) + "px";
});
document.addEventListener("mouseout", (e) => {
  const svg = e.target.closest && e.target.closest(".spark"); if (!svg) return;
  if (e.relatedTarget && svg.contains(e.relatedTarget)) return; // still inside
  hideSparkHover(svg);
});

// Dashboard sparkline window (months). Only the tile CHARTS respond to this —
// the headline value and its change stay the latest reading. Persisted per
// device; defaults to the full 5-year history.
const DASH_RANGES = { "1y": 12, "3y": 36, "5y": 60 };
let dashRange = "5y";
try { const s = localStorage.getItem("meridian.macro.dashRange"); if (s && DASH_RANGES[s]) dashRange = s; } catch { /* ignore */ }

// ---- Dashboard tiles -------------------------------------------------------
function macroTile(s) {
  const pct = s.unit === "%";
  const val = s.value == null ? "—" : `${(+s.value).toFixed(2)}${pct ? "%" : ""}`;
  const ch = s.change;
  const dir = ch > 0 ? "up" : ch < 0 ? "down" : "flat";
  const arrow = ch > 0 ? "▲" : ch < 0 ? "▼" : "·";
  const chHtml = (ch == null || s.value == null) ? "" :
    `<span class="macro-chg ${dir}" title="change vs previous month">${arrow} ${Math.abs(ch).toFixed(2)}${pct ? " pp" : ""}</span>`;
  // Slice the history to the selected window for the sparkline only.
  const hist = (s.history || []).slice(-DASH_RANGES[dashRange]);
  const chart = (hist.length > 1)
    ? sparkline(hist, { unit: pct ? "%" : "" })
    : '<div class="spark-empty muted small">History unavailable</div>';
  const asOf = s.asOf ? macroMonth(s.asOf) : "";
  // Whole tile links to the source (matches the Credit key-rates tiles); a small
  // corner control opens this indicator in the Chart view (cross-link).
  const tag = s.href ? "a" : "div";
  // Stable per-indicator id so a data-alert notification can deep-link and focus
  // the exact tile (#/dashboard?focus=<country>-<key>).
  const tileId = (s.country && s.key) ? ` id="tile-${esc(s.country)}-${esc(s.key)}"` : "";
  const attrs = (s.href ? ` href="${esc(s.href)}" target="_blank" rel="noopener noreferrer"` : "") + tileId;
  const chartLink = (s.country && s.key)
    ? `<span class="macro-chartlink" role="button" tabindex="0" data-chart="${esc(s.country)}:${esc(s.key)}" title="Open ${esc(s.label)} in the Chart" aria-label="Open ${esc(s.label)} in the Chart">📈</span>`
    : "";
  return `<${tag} class="macro-tile"${attrs}>
    <div class="macro-tile-head"><span class="macro-label">${esc(s.label)}</span><span class="macro-sub muted small">${esc(s.sub || "")}</span></div>
    ${chartLink}
    <div class="macro-valrow"><span class="macro-val">${val}</span>${chHtml}</div>
    <div class="macro-chart">${chart}</div>
    <div class="macro-foot muted"><span class="macro-src">${asOf ? esc(asOf) + " · " : ""}${esc(s.source)}</span></div>
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
    ${card("◷", "Rate outlook", "#/policy", "See the policy-rate view", SUMMARY.outlook.us, SUMMARY.outlook.uk)}
    ${card("◑", "Where we are in the cycle", "#/cycle", "See the cycle view", SUMMARY.cycle.us, SUMMARY.cycle.uk)}
    ${card("◎", "Bubble risk", "#/bubble", "See the bubble view", SUMMARY.bubble.us, SUMMARY.bubble.uk)}
  </section>`;
}

// ---- Date helpers ----------------------------------------------------------
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const isoToDate = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };

// Day-break separator rows in the wire (same scanning aid as the Home feed),
// plus keeping them in step with the in-place kind/source filters.
function wireDays(rows, rowFn, getDate) {
  let last = "";
  return rows.map((x) => {
    const d = String((getDate ? getDate(x) : x.date) || "").slice(0, 10);
    const hdr = d && d !== last ? `<li class="tw-day">${esc(fmtDate(d))}</li>` : "";
    if (d) last = d;
    return hdr + rowFn(x);
  }).join("");
}
function syncDayRows(root) {
  if (!root) return;
  root.querySelectorAll(".tw-day").forEach((d) => {
    let vis = false, n = d.nextElementSibling;
    while (n && !n.classList.contains("tw-day")) {
      if (n.classList.contains("tw-row") && n.style.display !== "none") { vis = true; break; }
      n = n.nextElementSibling;
    }
    d.style.display = vis ? "" : "none";
  });
}
const todayMidnight = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
// Full-date formatter for news items: "2026-07-01" → "1 Jul 2026".
function fmtDay(iso) {
  const d = isoToDate(iso);
  return d ? `${d.getDate()} ${MONTHS[d.getMonth() + 1]} ${d.getFullYear()}` : (iso || "");
}
// Zero-padded variant matching Credit's fmtDate ("09 Jul 2026") so the Commentary
// feed uses the same date convention as the Credit News feed.
function fmtDayGB(iso) {
  const d = isoToDate(iso);
  return d ? `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth() + 1]} ${d.getFullYear()}` : (iso || "");
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
  // A compact dropdown menu pinned to the top-right of the page header (rather
  // than a full-width banner). Native <details> so it needs no extra wiring; an
  // outside-click closes it (see the listener at module load).
  const items = up.length
    ? up.map((r) => {
        const tag = r.url ? "a" : "div";
        const attrs = r.url ? ` href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" title="${esc(r.title)} — open source"` : "";
        return `<${tag} class="rel-item"${attrs}>
          <span class="cal-date"><span class="cal-country cal-${(r.country || "").toLowerCase()}">${esc(r.country || "")}</span> ${esc(fmtWeekday(r.date))}</span>
          <span class="cal-title">${esc(r.title)}</span>
        </${tag}>`;
      }).join("")
    : `<p class="cal-empty muted small">No major US or UK data releases scheduled this week or next.</p>`;
  return `<details class="rel-dd">
    <summary class="rel-dd-btn">Upcoming releases <span class="rk-caret" aria-hidden="true"></span></summary>
    <div class="rel-dd-panel" role="menu" aria-label="Upcoming economic releases">
      <div class="rel-dd-head">Next US &amp; UK releases</div>
      <div class="rel-list">${items}</div>
    </div>
  </details>`;
}

// ---- Key macro headlines (Latest-Activity-style, two columns) --------------
// Two columns — US and UK — each newest-first. Each column prefers items ≤ 3
// days old, but falls back to whatever headlines exist rather than an empty one.
function renderNews() {
  const cutoff = todayMidnight(); cutoff.setDate(cutoff.getDate() - 3);
  // Merge US + UK into one newest-first list (no country split) and show 10 as
  // 2×5. Prefer items ≤ 3 days old but fall back to whatever exists to fill 10.
  const all = [...((NEWS && NEWS.us) || []), ...((NEWS && NEWS.uk) || [])]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const fresh = all.filter((n) => { const d = isoToDate(n.date); return d && d >= cutoff; });
  const items = (fresh.length >= 10 ? fresh : all).slice(0, 10);
  const row = (n) => `
    <li class="compact-item">
      <a class="compact-head" href="${esc(n.url)}" target="_blank" rel="noopener noreferrer">${esc(n.title)}</a>
      <div class="compact-meta muted small">${esc(fmtDay(n.date))} · ${esc(n.source)}</div>
    </li>`;
  const colList = (arr) => `<div class="news-col"><ul class="compact-list">${arr.map(row).join("")}</ul></div>`;
  const body = items.length
    ? `<div class="news-cols">${colList(items.slice(0, 5))}${colList(items.slice(5, 10))}</div>`
    : `<p class="muted small">Headlines are temporarily unavailable.</p>`;
  return `<section class="card feature-card macro-news-panel">
    <h2>Key macro headlines</h2>
    ${body}
    <a class="news-more" href="#/commentary">See the latest commentary →</a>
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
      <div class="compact-meta muted small">${esc(fmtDay(n.date))} · ${esc(n.source)}${n.author ? " · " + esc(n.author) : ""}</div>
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
  // The sparkline time-range toggle (1Y/3Y/5Y) now lives in the page header,
  // aligned with the Upcoming-releases dropdown.
  return `<div class="macro-groups">${grids}</div>` + renderNews() + summaryCards();
}

// ---- Horizontal 0–100 gauge (used by Cycle and Bubble) ---------------------
// zones: [[pos,label], …] printed under the track; items: [{label,pos}, …]
// markers on the track. gradId must be unique per gauge on the page.
let gaugeSeq = 0;
function trackGauge(zones, items, aria) {
  const W = 340, H = 104, x0 = 14, x1 = 326, trackY = 58, trackH = 5;
  const gradId = `gaugeGrad${gaugeSeq++}`;
  const X = (p) => x0 + (Math.max(0, Math.min(100, p)) / 100) * (x1 - x0);
  const zoneText = zones.map(([p, t]) => `<text x="${X(p).toFixed(1)}" y="${trackY + trackH + 15}" class="gauge-zone" text-anchor="middle">${esc(t)}</text>`).join("");
  // Markers are the tick + dot only — no numeric/identity label above the track
  // (removed to save vertical space; the marker's position on the zoned track and
  // the aria-label carry the read).
  const marks = items.map((it) => {
    const x = X(it.pos).toFixed(1);
    // Hovering the dot shows the value it represents (the visible labels were removed).
    const tip = `<title>${esc(it.label)} · ${it.pos}</title>`;
    return `<g>
      <line x1="${x}" y1="${trackY - 5}" x2="${x}" y2="${trackY + trackH + 5}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="${x}" cy="${trackY + trackH / 2}" r="4.5" fill="#fff" stroke="#05080f" stroke-width="2">${tip}</circle>
    </g>`;
  }).join("");
  // With the labels gone, the top content is the marker tick (y≈52). Crop the
  // viewBox tight to [track … zone labels] so the gauge is compact and sits at the
  // very top of its box.
  const vbTop = 46, vbBot = 92;
  return `<svg viewBox="0 ${vbTop} ${W} ${vbBot - vbTop}" class="gauge" role="img" aria-label="${esc(aria || "")}">
    <defs><linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="rgba(255,255,255,.14)"/><stop offset="1" stop-color="rgba(255,255,255,.5)"/>
    </linearGradient></defs>
    <rect x="${x0}" y="${trackY}" width="${x1 - x0}" height="${trackH}" rx="2" fill="url(#${gradId})"/>
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
    sources.map(([label, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a></li>`).join("")
  }</ul></div>`;
}

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
  const W = 620, H = 178, L = 36, R = 16, T = 14, B = 32;
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
async function loadYieldCurve() {
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

// The economic-indicators block for the cockpit — US and UK side by side, each a
// 3-across grid of value + change tiles (reuses the .mac-ind rail styling).
function cockpitInds(series) {
  const tile = (s) => {
    const pct = s.unit === "%";
    const val = s.value == null ? "—" : `${(+s.value).toFixed(2)}${pct ? "%" : ""}`;
    const ch = s.change, dir = ch > 0 ? "up" : ch < 0 ? "down" : "flat", arrow = ch > 0 ? "▲" : ch < 0 ? "▼" : "·";
    const chg = (ch == null || s.value == null) ? "" : `<span class="mac-ind-c-chg ${dir}">${arrow} ${Math.abs(ch).toFixed(2)}${pct ? "pp" : ""}</span>`;
    return `<div class="mac-ind"><span class="mac-ind-n">${esc(s.label)}</span><span class="mac-ind-v">${val}</span>${chg}</div>`;
  };
  const rowsFor = (c) => MAC_IND_ORDER.map((k) => (series || []).find((s) => s.country === c && s.key === k)).filter(Boolean);
  const col = (label, c) => { const r = rowsFor(c); return r.length ? `<div class="ck-ind-col"><div class="mac-ind-cty">${label}</div><div class="mac-ind-grid">${r.map(tile).join("")}</div></div>` : ""; };
  const html = col("United States", "US") + col("United Kingdom", "UK");
  return html || '<div class="tw-empty muted small" style="padding:11px">Indicators unavailable right now.</div>';
}

// Wall of maturities — corporate credit due over the next five years, from the
// cited S&P / OECD / Reuters figures in MATWALL (content.js). The IG/spec split
// and the OECD 2026–28 refinancing shares are drawn as labelled bars; per-year
// dollar bars are deliberately absent (the sources don't publish them openly).
function matWallPanel() {
  const w = MATWALL;
  if (!w) return "";
  const srcA = (s) => `<a class="ck-src" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a>`;
  const kv = (rows) => `<div class="ck-kv">${(rows || []).map(([l, v]) => `<div class="ck-kv-row"><span class="ck-kv-l">${esc(l)}</span><span class="ck-kv-v">${esc(v)}</span></div>`).join("")}</div>`;
  const ig = Math.max(0, Math.min(100, w.rated.igPct));
  return `
    <section class="ck-panel ck-span2">
      <header class="ck-h"><span>Wall of maturities — corporate credit</span><span class="ck-x">next 5Y</span></header>
      <div class="ck-body mw-cols">
        <div class="mw-col">
          <p class="ck-sub"><strong>${esc(w.rated.total)}</strong> rated debt due ${esc(w.rated.window)} · ${srcA(w.rated.src)}</p>
          <div class="mw-split" role="img" aria-label="Investment grade ${ig}% of the wall, speculative grade ${100 - ig}%">
            <span class="mw-seg mw-ig" style="width:${ig}%"></span><span class="mw-seg mw-sg" style="width:${100 - ig}%"></span>
          </div>
          <div class="mw-legend"><span><i class="mw-dot mw-ig"></i>IG ${ig}%</span><span><i class="mw-dot mw-sg"></i>SPEC ${100 - ig}%</span></div>
          <p class="ck-sub ck-sub2"><strong>Next 36 months</strong> · ${srcA(w.near.src)}</p>
          ${kv(w.near.rows)}
        </div>
        <div class="mw-col">
          <p class="ck-sub"><strong>Bonds due 2026–28</strong> · ${srcA(w.bonds.src)}</p>
          <div class="pw-bars">
            <div class="pw-row"><span class="pw-lbl">Investment grade</span><span class="pw-pct">${esc(String(w.bonds.igPct))}%</span><span class="pw-track"><span class="pw-fill mw-fill-ig" style="width:${esc(String(w.bonds.igPct))}%"></span></span></div>
            <div class="pw-row"><span class="pw-lbl">Non-investment grade</span><span class="pw-pct">${esc(String(w.bonds.nigPct))}%</span><span class="pw-track"><span class="pw-fill mw-fill-sg" style="width:${esc(String(w.bonds.nigPct))}%"></span></span></div>
          </div>
          ${kv(w.bonds.rows)}
          <p class="ck-sub ck-sub2"><strong>Private credit</strong> · ${srcA(w.privateCredit.src)}</p>
          ${kv(w.privateCredit.rows)}
        </div>
      </div>
    </section>`;
}

// The dense Macro cockpit shown behind the "Dashboard" chip: every read on one
// screen — economic indicators, the yield curve, the market-implied Fed path
// (FedWatch + dot plot), the rate outlook, and the two regime gauges (cycle &
// bubble) — each panel carrying a concise narrative and a link to its full tab.
function macroDashPane() {
  const comp = bubbleComposite(), band = bubbleBand(comp);
  const fw = OUTLOOK.us.fedwatch, dp = OUTLOOK.us.dots;
  const clamp = (n) => Math.max(0, Math.min(100, Number(n) || 0));
  const fwBars = fw ? fw.outcomes.map((x) => `<div class="pw-row"><span class="pw-lbl">${esc(x.label)}</span><span class="pw-pct">${esc(String(x.pct))}%</span><span class="pw-track"><span class="pw-fill" style="width:${clamp(x.pct)}%"></span></span></div>`).join("") : "";
  const dpRows = dp ? dp.median.map((x) => `<tr><th scope="row">${esc(x.year)}</th><td>${esc(x.rate)}</td></tr>`).join("") : "";
  const dimCard = (d) => `<div class="ck-dim"><div class="ck-dim-h"><span class="ck-dim-n">${esc(d.label)}</span><span class="ck-dim-s">${d.score}<span class="ck-dim-max">/100</span></span></div></div>`;
  const cyc = (c) => String(c.shortStage || "").split("—")[0].trim();
  const stat = (l, v, m) => `<div class="ck-stat"><span class="ck-stat-l">${esc(l)}</span><span class="ck-stat-v">${esc(v)}</span>${m ? `<span class="ck-stat-m">${esc(m)}</span>` : ""}</div>`;
  // Sub-section menu: one section at a time by default (All shows the full
  // cockpit); the choice persists per device.
  let sec = "economy";
  try { sec = localStorage.getItem("mac.dash.sec") || "economy"; } catch { /* default */ }
  const SECS = [["all", "All"], ["economy", "Economy"], ["rates", "Rates"], ["credit", "Credit"], ["regime", "Regime"]];
  if (!SECS.some(([k]) => k === sec)) sec = "economy";
  const chip = ([k, l]) => `<button type="button" class="tchip${k === sec ? " is-on" : ""}" data-sec="${k}">${l}</button>`;
  const grp = (k) => `class="ck-group${sec !== "all" && sec !== k ? " ck-off" : ""}" data-sec="${k}"`;
  wireSecNav();

  return `<div class="ck-secbar"><div class="tchips" id="ck-secnav">${SECS.map(chip).join("")}</div></div>
  <div class="mac-cockpit${sec !== "all" ? " ck-single" : ""}" id="ck-cockpit">
    <div ${grp("economy")}>
    <div class="ck-sec">Economy</div>
    <section class="ck-panel ck-span2">
      <header class="ck-h"><span>Key economic indicators</span><span class="ck-x">US · UK</span><a class="ck-more" href="#/chart">Chart</a></header>
      <div class="ck-inds" id="mac-ck-inds">${cockpitInds((MACRO_DATA && MACRO_DATA.series) || [])}</div>
    </section>
    </div>

    <div ${grp("rates")}>
    <div class="ck-sec">Rates &amp; policy</div>
    <section class="ck-panel">
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

    <section class="ck-panel ck-span2 ck-strip">
      <header class="ck-h"><span>Rate outlook</span><a class="ck-more" href="#/policy">Policy →</a></header>
      <div class="ck-body ck-stats2">
        ${stat("US", OUTLOOK.us.rate, `${OUTLOOK.us.stance || ""}${OUTLOOK.us.next ? " · next " + OUTLOOK.us.next : ""}`)}
        ${stat("UK", OUTLOOK.uk.rate, `${OUTLOOK.uk.stance || ""}${OUTLOOK.uk.next ? " · next " + OUTLOOK.uk.next : ""}`)}
      </div>
    </section>
    </div>

    <div ${grp("credit")}>
    <div class="ck-sec">Credit</div>
    ${matWallPanel()}
    </div>

    <div ${grp("regime")}>
    <div class="ck-sec">Regime</div>
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
        <div class="ck-dims">${BUBBLE.dimensions.map(dimCard).join("")}</div>
      </div>
    </section>
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
    const sec = b.getAttribute("data-sec") || "all";
    try { localStorage.setItem("mac.dash.sec", sec); } catch { /* private mode */ }
    document.querySelectorAll("#ck-secnav .tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    document.querySelectorAll("#ck-cockpit .ck-group").forEach((g) => g.classList.toggle("ck-off", sec !== "all" && g.getAttribute("data-sec") !== sec));
    const ck = document.getElementById("ck-cockpit");
    if (ck) ck.classList.toggle("ck-single", sec !== "all");
  });
}

// Dense terminal screen (canonical tui.css format): ticker (policy/cycle/bubble)
// + policy & regime rail (left) + commentary/news wire with filter chips (centre)
// + economic indicators (async) & upcoming releases (right).
function viewDashboard() {
  const comp = bubbleComposite();
  const bBand = bubbleBand(comp);
  const cycUS = String(CYCLE.us.shortStage || "").split("—")[0].trim();
  const metrics = [
    ["US policy", OUTLOOK.us.rate], ["UK policy", OUTLOOK.uk.rate],
    ["US next", OUTLOOK.us.next], ["UK next", OUTLOOK.uk.next],
    ["Cycle", cycUS], ["Bubble", bBand],
  ];
  const comm = [...((COMMENTARY && COMMENTARY.us) || []), ...((COMMENTARY && COMMENTARY.uk) || [])].map((x) => ({ ...x, _kind: "comm" }));
  // News = the full curated macro reading list (ARTICLES) plus the dashboard
  // headlines (NEWS US/UK), deduped by title so the wire is as deep as the other
  // desks' news feeds rather than the short NEWS-only list. Low-tier aggregator/SEO
  // sources are filtered out to keep the feed on premium newsrooms (matches Home).
  const seenNews = new Set();
  const news = [...(_macFeed || []), ...((ARTICLES && ARTICLES.items) || []), ...((NEWS && NEWS.us) || []), ...((NEWS && NEWS.uk) || [])]
    .filter((x) => !MAC_NON_PREMIUM.has(x.source))
    .filter((x) => { const k = String(x.title || "").toLowerCase().replace(/[^a-z0-9]+/g, ""); if (!k || seenNews.has(k)) return false; seenNews.add(k); return true; })
    .map((x) => ({ ...x, _kind: "news" }));
  const wire = [...comm, ...news].sort((a, b) => `${b.date} ${b.time || ""}`.localeCompare(`${a.date} ${a.time || ""}`));
  const KIND = { comm: "COMM", news: "NEWS" };
  const wireRow = (x) => {
    const url = x.url || "", src = x.source || "";
    const auth = x.author ? `<span class="tw-mgr-w"><span class="tw-mgr">${esc(x.author)}</span></span>` : "";
    // The title opens the article; the source name is a filter control (below).
    return `<li class="compact-item tw-row" data-kind="${x._kind}" data-src="${esc(src)}">`
      + `<span class="tw-date">${x.date ? esc(fmtDate(x.date)) : ""}</span>`
      + `<span class="tw-tag ${x._kind}">${KIND[x._kind]}</span>`
      + `<span class="tw-body"><a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="tw-head">${esc(x.title)}</a>${auth}</span>`
      + `<span class="tw-src">${src ? `<span class="src-filter" role="button" tabindex="0" data-srcfilter="${esc(src)}" title="Show all ${esc(src)} stories">${esc(src)}</span>` : ""}</span>`
      + `</li>`;
  };
  const rel = [...RELEASES].sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(0, 12);
  const relRow = (r) => `<li class="tmini-row"><a class="tmini-t" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a><span class="tmini-m">${esc(fmtDayGB(r.date))} · ${esc(r.country)}</span></li>`;

  return `<div class="tdash">
    <div class="tdash-grid">
      <aside class="tcol tcol-l">
        <section class="tpanel">
          <header class="tpanel-h"><span>Policy rate</span><span class="tpanel-x">US · UK</span></header>
          <ul class="tmini">
            <li class="tmini-row"><a class="tmini-t" href="#/policy">US ${esc(OUTLOOK.us.rate)}</a><span class="tmini-m">Next ${esc(OUTLOOK.us.next)} · ${esc(OUTLOOK.us.stance)}</span></li>
            <li class="tmini-row"><a class="tmini-t" href="#/policy">UK ${esc(OUTLOOK.uk.rate)}</a><span class="tmini-m">Next ${esc(OUTLOOK.uk.next)} · ${esc(OUTLOOK.uk.stance)}</span></li>
          </ul>
        </section>
        <section class="tpanel">
          <header class="tpanel-h"><span>Cycle &amp; bubble</span><span class="tpanel-x">regime</span></header>
          <ul class="tmini">
            <li class="tmini-row"><a class="tmini-t" href="#/cycle">Cycle — ${esc(cycUS)}</a><span class="tmini-m">US ${CYCLE.us.pos}/100 · UK ${CYCLE.uk.pos}/100</span></li>
            <li class="tmini-row"><a class="tmini-t" href="#/bubble">Bubble risk — ${esc(bBand)}</a><span class="tmini-m">${esc(BUBBLE.market)} · ${comp}/100</span></li>
          </ul>
        </section>
      </aside>
      <section class="tcol tcol-c">
        <header class="tpanel-h twire-head">
          <div class="tchips" id="mac-chips">
            <button type="button" class="tchip is-on" data-k="all">All</button>
            <button type="button" class="tchip" data-k="news">News</button>
            <button type="button" class="tchip" data-k="comm">Commentary</button>
            <button type="button" class="tchip" data-k="dash">Dashboard</button>
          </div>
        </header>
        <div class="srcfilter-bar" id="mac-srcbar" hidden></div>
        <ul class="twire compact-list" id="mac-wire">${wire.length ? wireDays(wire.slice(0, 90), wireRow) : '<li class="tw-empty muted small">No items yet.</li>'}</ul>
        <div class="mac-dash-pane" id="mac-dash" hidden>${macroDashPane()}</div>
      </section>
      <aside class="tcol tcol-r">
        <section class="tpanel">
          <header class="tpanel-h"><span>Economic indicators</span><span class="tpanel-x">US · UK</span></header>
          <div id="macro-ind"><div class="tw-empty muted small">Loading indicators…</div></div>
        </section>
        <section class="tpanel">
          <header class="tpanel-h"><span>Upcoming releases</span><span class="tpanel-x">calendar</span></header>
          <ul class="tmini">${rel.map(relRow).join("")}</ul>
        </section>
      </aside>
    </div>
  </div>`;
}
// Fill the indicators rail (async) + wire the wire's filter chips.
const MAC_IND_ORDER = ["base_rate", "two_year", "core_cpi", "services_pmi", "wages", "unemployment"];
function renderMacroIndRail(series) {
  const el = document.getElementById("macro-ind");
  if (!el) return;
  const tile = (s) => {
    const pct = s.unit === "%";
    const val = s.value == null ? "—" : `${(+s.value).toFixed(2)}${pct ? "%" : ""}`;
    const ch = s.change, dir = ch > 0 ? "up" : ch < 0 ? "down" : "flat", arrow = ch > 0 ? "▲" : ch < 0 ? "▼" : "·";
    const chg = (ch == null || s.value == null) ? "" : `<span class="mac-ind-c-chg ${dir}">${arrow} ${Math.abs(ch).toFixed(2)}${pct ? "pp" : ""}</span>`;
    return `<div class="mac-ind"><span class="mac-ind-n">${esc(s.label)}</span><span class="mac-ind-v">${val}</span>${chg}</div>`;
  };
  const rowsFor = (c) => MAC_IND_ORDER.map((k) => (series || []).find((s) => s.country === c && s.key === k)).filter(Boolean);
  const block = (label, c) => { const r = rowsFor(c); return r.length ? `<div class="mac-ind-cty">${label}</div><div class="mac-ind-grid">${r.map(tile).join("")}</div>` : ""; };
  const html = block("United States", "US") + block("United Kingdom", "UK");
  el.innerHTML = html || '<div class="tw-empty muted small">Indicators unavailable right now.</div>';
}
let _macSrc = null;   // active source filter (newsroom name) or null
function macroWireDash() {
  const chips = document.getElementById("mac-chips"), wire = document.getElementById("mac-wire");
  const dash = document.getElementById("mac-dash"), bar = document.getElementById("mac-srcbar");
  if (!chips || !wire) return;
  const activeK = () => (chips.querySelector(".tchip.is-on") || {}).dataset?.k || "news";
  // "Dashboard" swaps the news wire for the market-implied policy dashboard; News/
  // Commentary filter by row kind; a source filter (if set) narrows to one newsroom.
  const apply = () => {
    const k = activeK();
    const showDash = k === "dash";
    wire.hidden = showDash;
    if (dash) dash.hidden = !showDash;
    if (bar) {
      bar.hidden = showDash || !_macSrc;
      if (_macSrc && !showDash) bar.innerHTML = `Source · <strong>${esc(_macSrc)}</strong><button type="button" class="srcfilter-clear" data-srcclear="1">✕ clear</button>`;
    }
    if (!showDash) {
      wire.querySelectorAll(".tw-row").forEach((r) => {
        const kindOk = (k === "all" || r.dataset.kind === k);
        const srcOk = (!_macSrc || r.dataset.src === _macSrc);
        r.style.display = (kindOk && srcOk) ? "" : "none";
      });
      syncDayRows(wire);
    }
  };
  chips.onclick = (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    apply();
  };
  // Source name → filter to that newsroom; the pill clears it. Delegated on the
  // wire and the bar so it survives the in-place row toggling.
  const onSrc = (e) => {
    const sf = e.target.closest("[data-srcfilter]");
    if (sf) { e.preventDefault(); _macSrc = sf.getAttribute("data-srcfilter"); apply(); return; }
    if (e.target.closest("[data-srcclear]")) { e.preventDefault(); _macSrc = null; apply(); }
  };
  wire.onclick = onSrc;
  if (bar) bar.onclick = onSrc;
  wire.onkeydown = (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.closest("[data-srcfilter]")) { e.preventDefault(); onSrc(e); } };
  apply();
}

// --------------------------- saved articles (cloud sync + localStorage) -----
// Individually saved Commentary articles. Persists to a per-user Cloudflare KV
// store via /api/saved-macro (its OWN "msv:" prefix, so it never collides with
// Credit/Legal saved sets) with localStorage as an instant cache / offline
// fallback. Mirrors the Credit & Legal apps.
const SAVEDM_KEY = "meridian.macro.saved";
const SAVEDM_API = "/api/saved-macro";
let savedMCloud = false;
let savedMPushTimer = null;
function getSavedM() { try { return new Set(JSON.parse(localStorage.getItem(SAVEDM_KEY) || "[]")); } catch { return new Set(); } }
function setSavedM(set) { try { localStorage.setItem(SAVEDM_KEY, JSON.stringify([...set])); } catch { /* ignore */ } pushSavedM(); }
function toggleSavedM(id) { const s = getSavedM(); s.has(id) ? s.delete(id) : s.add(id); setSavedM(s); return s.has(id); }
function pushSavedM() {
  if (!savedMCloud) return;
  clearTimeout(savedMPushTimer);
  savedMPushTimer = setTimeout(() => {
    fetch(SAVEDM_API, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ saved: [...getSavedM()] }) }).catch(() => {});
  }, 400);
}
// On load, UNION this device's saved set with the per-user cloud copy (saving is
// additive), persist locally and push back so devices converge. No-op off-cloud.
async function initSavedMSync() {
  let r;
  try { r = await fetch(SAVEDM_API, { headers: { accept: "application/json" } }); }
  catch { return; }
  if (!r || !r.ok) return;
  let d; try { d = await r.json(); } catch { return; }
  savedMCloud = true;
  const server = Array.isArray(d.saved) ? d.saved : [];
  const local = [...getSavedM()];
  const union = new Set([...local, ...server]);
  try { localStorage.setItem(SAVEDM_KEY, JSON.stringify([...union])); } catch { /* ignore */ }
  if (union.size !== server.length || server.some((id) => !union.has(id))) pushSavedM();
  render();
}
// Stable content-derived id for an article — a short hash of its normalised URL
// (or title), so a saved piece keeps pointing at the same item across refreshes.
function articleSaveId(n) {
  const base = (n.url || n.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
  let h = 0; for (let i = 0; i < base.length; i++) h = (Math.imul(h, 31) + base.charCodeAt(i)) | 0;
  return "a" + (h >>> 0).toString(36);
}
function saveBtn(id) {
  const on = getSavedM().has(id);
  return `<button type="button" class="save-btn ${on ? "is-saved" : ""}" data-save="${esc(id)}" aria-pressed="${on}" title="${on ? "Remove from saved" : "Save this item"}">${on ? "★ Saved" : "☆ Save"}</button>`;
}

// Commentary tab — a curated, newest-first reading list of economist & bank
// commentary only (data in content.js COMMENTARY), not news-outlet content.
// Rendered in the same feed format/style as the Credit News tab: a single line
// per item (headline · source · author · date · save), grouped by month.
// Render a date-sorted list, inserting a day-break separator whenever the day
// changes from the previous item (a visual gap between each day's items).
// `labeled` → introduce each day with a dated header ("16 Jul 2026", uppercased
// in CSS) and let the rows lead with the time, matching the home news feed.
// Otherwise fall back to the plain centred day-rule used by other lists.
function withDayBreaks(items, rowFn, labeled) {
  let prevDay = null;
  return items.map((x) => {
    const day = String(x.date || "").slice(0, 10);
    const sep = labeled
      ? (day !== prevDay ? `<div class="day-hdr">${esc(fmtDayGB(day))}</div>` : "")
      : (prevDay !== null && day !== prevDay ? '<div class="day-sep" aria-hidden="true"></div>' : "");
    prevDay = day;
    return sep + rowFn(x);
  }).join("");
}
function commentaryRow(n) {
  const head = n.url
    ? `<a href="${esc(n.url)}" target="_blank" rel="noopener noreferrer" class="intel-head">${esc(n.title)}</a>`
    : `<span class="intel-head">${esc(n.title)}</span>`;
  const src = `${esc(n.source)}${n.author ? " · " + esc(n.author) : ""}`;
  return `<div class="intel-row" data-said="${esc(articleSaveId(n))}">
    <span class="intel-date muted small">${esc(fmtDayGB(n.date))}</span>${head}<span class="intel-src-inline muted small">${src}</span>${saveBtn(articleSaveId(n))}
  </div>`;
}
// Group a list of articles (newest first) into month sections: "JULY 2026" etc.
function byMonth(items) {
  const groups = {};
  [...items].sort((a, b) => String(b.date).localeCompare(String(a.date))).forEach((x) => {
    const m = /^(\d{4})-(\d{2})/.exec(String(x.date));
    const key = m ? `${m[1]}-${m[2]}` : "undated";
    (groups[key] ||= []).push(x);
  });
  return Object.keys(groups)
    .sort((a, b) => (a === "undated") - (b === "undated") || b.localeCompare(a))
    .map((k) => {
      const label = k === "undated" ? "Undated" : `${MONTHS_FULL[+k.slice(5, 7)]} ${k.slice(0, 4)}`;
      return `<div class="month-group"><h3 class="month-head">${esc(label)}</h3>${withDayBreaks(groups[k], commentaryRow)}</div>`;
    }).join("");
}
// Newest-first, paginated in pages of 25 (matches Credit's Load-more feeds).
const COMMENTARY_PAGE = 25;
let commentaryLimit = COMMENTARY_PAGE;
function sortedArticles() {
  // Economist / bank commentary only (not news-outlet content) — the curated
  // COMMENTARY set (author-attributed bank & economist views), US + UK merged,
  // newest first.
  return [...((COMMENTARY && COMMENTARY.us) || []), ...((COMMENTARY && COMMENTARY.uk) || [])]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
function commentaryPanelHtml() {
  const items = sortedArticles();
  if (!items.length) return `<p class="muted small">The reading list is temporarily unavailable.</p>`;
  const shown = Math.min(commentaryLimit, items.length);
  const rows = items.slice(0, shown).map(commentaryRow).join("");
  const remaining = items.length - shown;
  const foot = remaining > 0
    ? `<div class="comm-foot"><button type="button" id="comm-more" class="load-more-btn">Show ${Math.min(COMMENTARY_PAGE, remaining)} more · ${remaining} remaining</button></div>`
    : "";
  return rows + foot;
}
function wireCommentary() {
  const btn = document.getElementById("comm-more");
  if (!btn) return;
  btn.addEventListener("click", () => {
    commentaryLimit += COMMENTARY_PAGE;
    const panel = document.querySelector(".macro-articles-panel");
    if (panel) panel.innerHTML = commentaryPanelHtml();
    wireCommentary(); // re-bind the freshly-rendered button
  });
}
function viewCommentary() {
  return `
    <div class="page-head">
      <h1>Commentary</h1>
      <p class="muted">Selected bank research, analyst &amp; economist views on the Fed and Bank of England — monetary policy, growth, inflation, oil and bonds. Newest first.</p>
    </div>
    <section class="card macro-articles-panel">${commentaryPanelHtml()}</section>`;
}

// Saved tab — the Commentary articles the user has starred, newest first, grouped
// by month. Saved ids resolve against the current reading list; a piece that has
// rolled off the feed no longer appears here.
function viewSaved() {
  const saved = getSavedM();
  const items = sortedArticles().filter((n) => saved.has(articleSaveId(n)));
  const body = items.length
    ? items.map(commentaryRow).join("")
    : `<p class="muted">You haven't saved anything yet. On the <a href="#/commentary">Commentary</a> tab, click the ☆ Save button on any article to add it here${savedMCloud ? " — your saved list syncs across your devices" : ""}.</p>`;
  return `
    <div class="page-head">
      <h1>Saved</h1>
      <p class="muted">${items.length ? `${items.length} saved ${items.length === 1 ? "article" : "articles"} from Commentary, newest first.` : "Your saved macro articles."}</p>
    </div>
    <section class="card macro-articles-panel">${body}</section>`;
}

// US market-implied policy path: CME FedWatch odds for the next FOMC decision +
// the FOMC dot-plot median. Two compact cards (2-col desktop, stacked on iPhone),
// each linking out to the primary source.
function policyMarkets(o) {
  if (!o || (!o.fedwatch && !o.dots)) return "";
  const fw = o.fedwatch, dp = o.dots;
  const clamp = (n) => Math.max(0, Math.min(100, Number(n) || 0));
  const fwCard = fw ? `
    <section class="card macro-note pw-card">
      <div class="pw-head">
        <h2 class="macro-country">CME FedWatch</h2>
        <a class="pw-src" href="${esc(fw.href)}" target="_blank" rel="noopener noreferrer">CME tool</a>
      </div>
      <p class="macro-note-sub">Market-implied odds for the <strong>${esc(fw.meeting)}</strong> FOMC · as of ${esc(fw.asOf)}</p>
      <div class="pw-bars">
        ${fw.outcomes.map((x) => `
          <div class="pw-row">
            <span class="pw-lbl">${esc(x.label)}</span>
            <span class="pw-pct">${esc(String(x.pct))}%</span>
            <span class="pw-track"><span class="pw-fill" style="width:${clamp(x.pct)}%"></span></span>
          </div>`).join("")}
      </div>
      <p class="muted small pw-note">${esc(fw.note)}</p>
    </section>` : "";
  const dpCard = dp ? `
    <section class="card macro-note pw-card">
      <div class="pw-head">
        <h2 class="macro-country">Fed dot plot</h2>
        <a class="pw-src" href="${esc(dp.href)}" target="_blank" rel="noopener noreferrer">FOMC projections</a>
      </div>
      <p class="macro-note-sub"><strong>${esc(dp.meeting)}</strong> — median federal-funds projection</p>
      <table class="pw-dots"><tbody>
        ${dp.median.map((x) => `<tr><th scope="row">${esc(x.year)}</th><td>${esc(x.rate)}</td></tr>`).join("")}
      </tbody></table>
      <p class="muted small pw-note">${esc(dp.note)}</p>
    </section>` : "";
  return `
    <h2 class="macro-subhead">United States — market-implied path &amp; Fed projections</h2>
    <div class="macro-cols macro-policy-mkts">${fwCard}${dpCard}</div>`;
}

// Policy Rate tab — compiled Fed & BoE policy-rate outlook plus an analyst feed.
function viewPolicy() {
  const country = (name, o) => `
    <section class="card macro-note">
      <h2 class="macro-country">${esc(name)}</h2>
      <p class="macro-note-sub"><strong>${esc(o.rate)}</strong> · ${esc(o.stance)}</p>
      ${o.body.map((p) => `<p class="macro-para">${p}</p>`).join("")}
      <p class="macro-bottomline"><strong>Bottom line.</strong> ${o.bottomLine}</p>
    </section>`;
  return `
    <div class="page-head">
      <h1>Policy rate — Fed &amp; Bank of England outlook</h1>
      <p class="muted">Compiled analyst and market views on whether the US Federal Reserve and Bank of England are likely to change their policy rates. As of ${esc(UPDATED)}. Educational only — not investment advice; market pricing shifts daily.</p>
    </div>
    ${policyMarkets(OUTLOOK.us)}
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
      <div class="macro-gauge-head">
        <div class="macro-gauge-head-main">
          <h2 class="macro-country">Long-term debt-cycle position</h2>
          <p class="macro-gauge-updated muted small">Last refreshed ${esc(UPDATED)}</p>
        </div>
        ${trackGauge(CYCLE_ZONES, [{ label: "US", pos: CYCLE.us.pos }, { label: "UK", pos: CYCLE.uk.pos }], "Long-term debt cycle position, 0 early to 100 crisis")}
      </div>
      <div class="macro-framework">
        ${CYCLE.framework.map((p) => `<p class="macro-para">${p}</p>`).join("")}
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
      <div class="macro-gauge-head">
        <div class="macro-gauge-head-main">
          <h2 class="macro-country">Composite bubble-risk score</h2>
          <p class="macro-gauge-updated muted small">Last refreshed ${esc(UPDATED)}</p>
        </div>
        ${trackGauge(BUBBLE_ZONES, [{ label: band, pos: composite }], "US equity bubble-risk score, 0 low to 100 extreme")}
      </div>
      <div class="macro-framework">
        ${BUBBLE.summary.map((p) => `<p class="macro-para">${p}</p>`).join("")}
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
// Series colours — a navy family (distinguishable shades), country by line style.
const IND_COLOR = {
  base_rate: "var(--ind-base)", two_year: "var(--ind-2y)", core_cpi: "var(--ind-cpi)",
  services_pmi: "var(--ind-pmi)", wages: "var(--ind-wage)", unemployment: "var(--ind-ue)",
};
// Short tickers for the TradingView-style label pinned to each line's right end.
const IND_SHORT = {
  base_rate: "Rate", two_year: "2Y", core_cpi: "CPI",
  services_pmi: "PMI", wages: "Wage", unemployment: "U/E",
};
const MON3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
const CHART_RANGES = { "1y": 12, "3y": 36, "5y": 60, "10y": 120, "max": Infinity };
const CHART_DEFAULT_RANGE = "5y";
// Display mode: the actual level, % change vs the window start, or the change in
// the indicator's own units (indexed to 0). Default keeps the indexed view.
const CHART_MODES = { value: "Actual", pct: "% change", index: "Indexed" };
const CHART_DEFAULT_MODE = "index";
const _chartLocal = chartReadLocal();
let chartSel = new Set(_chartLocal ? _chartLocal.sel : CHART_DEFAULT_SEL);
let chartEvents = new Set(_chartLocal ? _chartLocal.events : CHART_DEFAULT_EVT);
let chartRange = (_chartLocal && CHART_RANGES[_chartLocal.range]) ? _chartLocal.range : CHART_DEFAULT_RANGE;
let chartMode = (_chartLocal && CHART_MODES[_chartLocal.mode]) ? _chartLocal.mode : CHART_DEFAULT_MODE;
function chartPersist() {
  const payload = { sel: [...chartSel], events: [...chartEvents], range: chartRange, mode: chartMode, dashRange };
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
  return `
    <div class="page-head">
      <h1>Chart</h1>
      <p class="muted">Overlay any of the dashboard indicators (US &amp; UK) over your chosen window. The dots along the top mark key macro events — hover one for detail, click it to drop a marker line on the chart.</p>
    </div>
    <section class="card chart-stage">
      <div class="chart-stage-main">
        <div class="chart-toolbar">
          <div class="chart-toolbar-l">
            <div class="chart-range" role="group" aria-label="Time range">
              ${Object.keys(CHART_RANGES).map((r) => `<button type="button" class="chart-range-btn${chartRange === r ? " is-on" : ""}" data-range="${r}">${r === "max" ? "Max" : r.toUpperCase()}</button>`).join("")}
            </div>
            <div class="chart-mode" role="group" aria-label="Value mode">
              ${Object.entries(CHART_MODES).map(([k, l]) => `<button type="button" class="chart-mode-btn${chartMode === k ? " is-on" : ""}" data-mode="${k}">${l}</button>`).join("")}
            </div>
          </div>
          <button type="button" class="chart-export" id="chart-export" title="Download the chart as a PNG image">⤓ PNG</button>
        </div>
        <div id="chart-canvas"><p class="muted">Loading macro data…</p></div>
      </div>
      <aside class="chart-ind-side">
        <div class="chart-ctrl-h">Indicators <span class="muted small">(<span id="chart-count">${chartSel.size}</span> of 12)</span></div>
        <div class="chart-ind-side-list">
          <div class="chart-ind-block"><div class="chart-ind-country">${allBox("US")}United States <span class="chart-line-key">— solid</span></div><div class="chart-ind-grid">${indBox("US")}</div></div>
          <div class="chart-ind-block"><div class="chart-ind-country">${allBox("UK")}United Kingdom <span class="chart-line-key">- - dashed</span></div><div class="chart-ind-grid">${indBox("UK")}</div></div>
        </div>
      </aside>
    </section>`;
}

function drawChart() {
  const canvas = document.getElementById("chart-canvas");
  if (!canvas) return;
  const all = chartSeriesAll();
  if (!all.length) { canvas.innerHTML = '<p class="muted">Macro data is temporarily unavailable — please try again shortly.</p>'; return; }
  const sel = all.filter((s) => chartSel.has(s.selKey));
  // TradingView-style layout: the price scale + per-line tickers live in a wide
  // right-hand gutter; the plot starts flush to the left with a detailed date axis.
  // The tall canvas fills the space beside the indicator sidebar.
  const W = 980, H = 600, plotL = 16, plotR = W - 100, plotT = 30, plotB = H - 40;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  let gMin = Infinity, gMax = -Infinity;
  all.forEach((s) => s.history.forEach((p) => { const mi = MI(p.label); if (mi < gMin) gMin = mi; if (mi > gMax) gMax = mi; }));
  // The visible window is the selected range, anchored to the latest data.
  const months = CHART_RANGES[chartRange] || 60;
  const m1 = gMax;
  const m0 = months === Infinity ? gMin : Math.max(gMin, gMax - months + 1);
  const span = (m1 - m0) || 1;
  const xFor = (mi) => plotL + ((mi - m0) / span) * plotW;
  const inRange = (s) => s.history.filter((p) => { const mi = MI(p.label); return mi >= m0 && mi <= m1; });
  const base = (s) => { const r = inRange(s); return r.length ? r[0].value : (s.history[0] ? s.history[0].value : 0); };
  // Display transform: actual level / % change vs the window start / indexed to 0
  // (change in the indicator's own units).
  const tf = (s, v) => chartMode === "value" ? v
    : chartMode === "pct" ? (base(s) !== 0 ? (v - base(s)) / Math.abs(base(s)) * 100 : v - base(s))
    : v - base(s);
  const fmtI = (v) => (v >= 0 ? "+" : "") + v.toFixed(2);
  // Format a transformed value for the tags/tooltip in the current mode.
  const fmtY = (y) => chartMode === "value" ? (+y).toFixed(2)
    : chartMode === "pct" ? (y >= 0 ? "+" : "") + y.toFixed(1) + "%"
    : (y >= 0 ? "+" : "") + y.toFixed(2);
  // Value mode scales to the data; the indexed/% modes keep the baseline 0 in view.
  let lo, hi;
  if (chartMode === "value") { lo = Infinity; hi = -Infinity; } else { lo = 0; hi = 0; }
  sel.forEach((s) => inRange(s).forEach((p) => { const y = tf(s, p.value); if (y < lo) lo = y; if (y > hi) hi = y; }));
  if (!isFinite(lo) || !isFinite(hi)) { lo = 0; hi = 1; }
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
  // Value scale sits in the right gutter (TradingView style). Actual levels are
  // plain numbers; the indexed/% modes are signed (change from the window start).
  const ylab = (t) => chartMode === "value" ? "" + (+t.toFixed(2))
    : Math.abs(t) < 1e-9 ? "0"
    : (t > 0 ? "+" : "") + (+t.toFixed(chartMode === "pct" ? 1 : 2)) + (chartMode === "pct" ? "%" : "");
  const grid = niceTicks(lo, hi, 5).map((t) => {
    const y = yFor(t), zero = Math.abs(t) < 1e-9;
    return `<line x1="${plotL}" y1="${y.toFixed(1)}" x2="${plotR}" y2="${y.toFixed(1)}" class="chart-grid${zero ? " chart-zero" : ""}"/><text x="${W - 6}" y="${(y + 3).toFixed(1)}" class="chart-ylab" text-anchor="end">${ylab(t)}</text>`;
  }).join("");
  // Detailed date axis: adaptive month step so the window carries several labels —
  // Januaries show the year (emphasised), other ticks show the month abbreviation.
  const spanM = m1 - m0;
  const stepM = spanM <= 8 ? 1 : spanM <= 18 ? 2 : spanM <= 30 ? 3 : spanM <= 66 ? 6 : spanM <= 132 ? 12 : 24;
  let xticks = "";
  for (let mi = Math.ceil(m0 / stepM) * stepM; mi <= m1; mi += stepM) {
    if (mi < m0) continue;
    const x = xFor(mi), mo = ((mi % 12) + 12) % 12, isJan = mo === 0;
    const label = isJan ? String(Math.floor(mi / 12)) : MON3[mo];
    xticks += `<line x1="${x.toFixed(1)}" y1="${plotT}" x2="${x.toFixed(1)}" y2="${plotB}" class="chart-grid${isJan ? " chart-grid-yr" : ""}"/><text x="${x.toFixed(1)}" y="${plotB + 15}" class="chart-xlab${isJan ? " chart-xlab-yr" : ""}" text-anchor="middle">${label}</text>`;
  }
  // Every in-window event shows as a dot along the top; hovering reveals its
  // detail and clicking drops (or removes) a marker line down the chart. Dots for
  // events whose line is showing are rendered "on" (solid, ringed).
  const evDotY = plotT - 12;
  let ev = "";
  CHART_EVENTS.forEach((e) => {
    const mi = MI(e.date); if (mi < m0 || mi > m1) return;
    const x = xFor(mi), on = chartEvents.has(e.id);
    ev += `<g class="chart-evmark${on ? " is-on" : ""}" data-evt="${e.id}">` +
      (on ? `<line x1="${x.toFixed(1)}" y1="${evDotY}" x2="${x.toFixed(1)}" y2="${plotB}" class="chart-evline"/>` : "") +
      `<circle cx="${x.toFixed(1)}" cy="${evDotY}" r="5.5" class="chart-evdot"/>` +
      `<circle cx="${x.toFixed(1)}" cy="${evDotY}" r="13" fill="transparent" class="chart-evhit"/>` +
      `</g>`;
  });
  const lines = sel.map((s) => {
    const pts = inRange(s).map((p) => [xFor(MI(p.label)), yFor(tf(s, p.value))]);
    const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    return `<path d="${d}" fill="none" stroke="${IND_COLOR[s.key]}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"${s.country === "UK" ? ' stroke-dasharray="6 4"' : ""}/>`;
  }).join("");

  // Right-gutter divider + a ticker tag pinned to each line's right end. Tags are
  // nudged apart vertically so they never overlap.
  const axis = `<line x1="${plotR}" y1="${plotT}" x2="${plotR}" y2="${plotB}" class="chart-axis"/>`;
  const endItems = sel.map((s) => { const r = inRange(s), last = r[r.length - 1]; const yy = last ? yFor(tf(s, last.value)) : 0; return last ? { s, yReal: yy, y: yy } : null; }).filter(Boolean);
  endItems.sort((a, b) => a.y - b.y);
  const TH = 15;
  for (let i = 1; i < endItems.length; i++) if (endItems[i].y - endItems[i - 1].y < TH) endItems[i].y = endItems[i - 1].y + TH;
  for (let i = endItems.length - 1; i >= 0; i--) { if (endItems[i].y > plotB) endItems[i].y = plotB; if (i < endItems.length - 1 && endItems[i + 1].y - endItems[i].y < TH) endItems[i].y = endItems[i + 1].y - TH; }
  if (endItems.length && endItems[0].y < plotT) { endItems[0].y = plotT; for (let i = 1; i < endItems.length; i++) if (endItems[i].y - endItems[i - 1].y < TH) endItems[i].y = endItems[i - 1].y + TH; }
  const endTags = endItems.map((it) => {
    const txt = `${it.s.country} ${IND_SHORT[it.s.key] || it.s.label}`;
    const w = Math.round(txt.length * 6 + 12), x = plotR + 5, y = it.y;
    const lead = `<path d="M ${plotR} ${it.yReal.toFixed(1)} L ${x} ${y.toFixed(1)}" fill="none" stroke="${IND_COLOR[it.s.key]}" stroke-width="1" opacity=".5"/>`;
    return `${lead}<g class="chart-endtag"><rect x="${x}" y="${(y - 8).toFixed(1)}" width="${w}" height="16" rx="3" fill="${IND_COLOR[it.s.key]}"/><text x="${(x + w / 2).toFixed(1)}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" class="chart-endtxt">${esc(txt)}</text></g>`;
  }).join("");

  const legend = sel.map((s) => {
    const r = inRange(s), last = r[r.length - 1];
    return `<span class="chart-leg"><span class="chart-swatch${s.country === "UK" ? " dash" : ""}" style="--c:${IND_COLOR[s.key]}"></span>${esc(s.country)} · ${esc(s.label)} <b>${last ? fmtY(tf(s, last.value)) : "—"}</b></span>`;
  }).join("");

  const svg = `<svg viewBox="0 0 ${W} ${H}" class="chart-svg" id="chart-svg" role="img" aria-label="Selected macro indicators, each indexed to 0 at the start of the window">
    ${grid}${xticks}${axis}${ev}${lines}
    <g id="chart-endtags">${endTags}</g>
    <line id="chart-cross" class="chart-cross" y1="${plotT}" y2="${plotB}" style="display:none"/>
    <g id="chart-hoverdots"></g>
    <g id="chart-axtags"></g>
    <rect x="${plotL}" y="${plotT}" width="${plotW}" height="${plotH}" fill="transparent" id="chart-hit"/>
  </svg>`;
  const w0 = esc(macroMonth(miLabel(m0)));
  const note = chartMode === "value"
    ? `Each series shows its <b>actual level</b> in its own units — % for rates, inflation, wages and unemployment; index points for the PMIs — so lines on very different scales can sit far apart. Hover for the values. Line style: <b>solid = US</b>, <b>dashed = UK</b>.`
    : chartMode === "pct"
    ? `Each series shows its <b>% change since ${w0}</b> (the start of the window), putting indicators on different scales on a comparable footing. Hover for the actual values. Line style: <b>solid = US</b>, <b>dashed = UK</b>.`
    : `Every series is indexed to <b>0 at ${w0}</b> (the start of the window), so each line shows the change since then in the indicator's own units — percentage points for rates, inflation, wages and unemployment; index points for the PMIs. Hover for the actual values. Line style: <b>solid = US</b>, <b>dashed = UK</b>.`;
  canvas.innerHTML = `<div class="chart-main">${svg}<div id="chart-tip" class="chart-tip" hidden></div></div>
    <div class="chart-legend">${sel.length ? legend : '<span class="muted">Select one or more indicators to plot.</span>'}</div>
    <p class="muted small chart-note">${note}</p>`;

  // Event markers get a hover bubble explaining the event (works even with no
  // indicators selected, so it's wired before the crosshair setup below).
  const evtip = document.getElementById("chart-tip"), evmain = canvas.querySelector(".chart-main");
  const EVBY = Object.fromEntries(CHART_EVENTS.map((e) => [e.id, e]));
  canvas.querySelectorAll(".chart-evmark").forEach((g) => {
    const info = EVBY[g.getAttribute("data-evt")]; if (!info) return;
    const on = g.classList.contains("is-on");
    const show = (e) => {
      evtip.innerHTML = `<div class="tip-date">${esc(info.label)} <span class="tip-real">${esc(macroMonth(info.date))}</span></div><div class="evtip-desc">${esc(info.desc)}</div><div class="evtip-hint">${on ? "Click to remove the marker line" : "Click to add a marker line"}</div>`;
      evtip.hidden = false;
      const mr = evmain.getBoundingClientRect();
      let tx = e.clientX - mr.left + 14; const ty = e.clientY - mr.top + 8;
      if (tx > mr.width - 250) tx = e.clientX - mr.left - 260;
      evtip.style.left = Math.max(2, tx) + "px"; evtip.style.top = Math.max(2, ty) + "px";
    };
    g.addEventListener("mouseenter", show);
    g.addEventListener("mousemove", show);
    g.addEventListener("mouseleave", () => { evtip.hidden = true; });
    // Click the dot to add / remove its marker line down the chart.
    g.addEventListener("click", () => {
      const id = g.getAttribute("data-evt");
      if (chartEvents.has(id)) chartEvents.delete(id); else chartEvents.add(id);
      chartPersist();
      drawChart();
    });
  });

  if (!sel.length) return;
  const svgEl = document.getElementById("chart-svg"), hit = document.getElementById("chart-hit");
  const cross = document.getElementById("chart-cross"), dots = document.getElementById("chart-hoverdots");
  const endtagsG = document.getElementById("chart-endtags"), axtags = document.getElementById("chart-axtags");
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
    const vt = [];
    sel.forEach((s) => {
      const pt = s.history.find((p) => MI(p.label) === mi) || nearest(s.history, mi);
      if (!pt) return;
      const cy = yFor(tf(s, pt.value));
      const real = `${(+pt.value).toFixed(2)}${s.unit === "%" ? "%" : ""}`;
      dd += `<circle cx="${xFor(MI(pt.label)).toFixed(1)}" cy="${cy.toFixed(1)}" r="3.5" fill="${IND_COLOR[s.key]}" stroke="var(--surface)" stroke-width="1.5"/>`;
      vt.push({ y: cy, txt: fmtY(tf(s, pt.value)), color: IND_COLOR[s.key] });
      rows += `<div class="tip-row"><span class="tip-dot" style="background:${IND_COLOR[s.key]}"></span>${esc(s.country)} ${esc(s.label)}: <b>${chartMode === "value" ? real : fmtY(tf(s, pt.value))}</b>${chartMode === "value" ? "" : ` <span class="tip-real">(${real})</span>`}</div>`;
    });
    dots.innerHTML = dd;
    // Crosshair axis tags (TradingView style): a value tag on the right scale for
    // each series (de-collided), plus a date tag on the bottom axis. The resting
    // per-line ticker tags are hidden while hovering so the gutter stays clean.
    vt.sort((a, b) => a.y - b.y);
    const TH = 15;
    for (let i = 1; i < vt.length; i++) if (vt[i].y - vt[i - 1].y < TH) vt[i].y = vt[i - 1].y + TH;
    for (let i = vt.length - 1; i >= 0; i--) { if (vt[i].y > plotB) vt[i].y = plotB; if (i < vt.length - 1 && vt[i + 1].y - vt[i].y < TH) vt[i].y = vt[i + 1].y - TH; }
    let ax = vt.map((v) => { const w = Math.round(v.txt.length * 6.4 + 12), xx = plotR + 5;
      return `<rect x="${xx}" y="${(v.y - 8).toFixed(1)}" width="${w}" height="16" rx="3" fill="${v.color}"/><text x="${(xx + w / 2).toFixed(1)}" y="${(v.y + 3.5).toFixed(1)}" text-anchor="middle" class="chart-endtxt">${esc(v.txt)}</text>`;
    }).join("");
    const dl = macroMonth(miLabel(mi)), dw = Math.round(dl.length * 6.2 + 16);
    let dx = Math.max(plotL, Math.min(plotR - dw, x - dw / 2));
    ax += `<rect x="${dx.toFixed(1)}" y="${(plotB + 3).toFixed(1)}" width="${dw}" height="17" rx="3" class="chart-datetag"/><text x="${(dx + dw / 2).toFixed(1)}" y="${(plotB + 15).toFixed(1)}" text-anchor="middle" class="chart-datetxt">${esc(dl)}</text>`;
    axtags.innerHTML = ax;
    endtagsG.style.opacity = "0";
    tip.innerHTML = rows;
    tip.hidden = false;
    const mr = main.getBoundingClientRect();
    let tx = e.clientX - mr.left + 14; const ty = e.clientY - mr.top + 8;
    if (tx > mr.width - 190) tx = e.clientX - mr.left - 200;
    tip.style.left = Math.max(2, tx) + "px"; tip.style.top = ty + "px";
  });
  hit.addEventListener("mouseleave", () => { cross.style.display = "none"; dots.innerHTML = ""; axtags.innerHTML = ""; endtagsG.style.opacity = "1"; tip.hidden = true; });
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
  const rb = e.target.closest(".chart-range-btn");
  if (!rb || rb.classList.contains("dash-range-btn")) return; // dashboard toggle handled below
  chartRange = rb.getAttribute("data-range");
  document.querySelectorAll(".chart-range-btn:not(.dash-range-btn)").forEach((b) => b.classList.toggle("is-on", b === rb));
  chartPersist();
  drawChart();
});
// Close the upcoming-releases dropdown when clicking outside it.
document.addEventListener("click", (e) => {
  document.querySelectorAll("details.rel-dd[open]").forEach((d) => { if (!d.contains(e.target)) d.removeAttribute("open"); });
});
// Value-mode toggle: Actual level / % change / Indexed.
document.addEventListener("click", (e) => {
  const mb = e.target.closest(".chart-mode-btn"); if (!mb) return;
  chartMode = mb.getAttribute("data-mode");
  document.querySelectorAll(".chart-mode-btn").forEach((b) => b.classList.toggle("is-on", b === mb));
  chartPersist();
  drawChart();
});
// Dashboard sparkline range toggle (1Y/3Y/5Y): re-render the tiles from the
// cached data with the new window — value/change readings are unaffected.
document.addEventListener("click", (e) => {
  const rb = e.target.closest(".dash-range-btn"); if (!rb) return;
  const r = rb.getAttribute("data-drange");
  if (!DASH_RANGES[r] || r === dashRange) return;
  dashRange = r;
  document.querySelectorAll(".dash-range-btn").forEach((b) => b.classList.toggle("is-on", b === rb));
  try { localStorage.setItem("meridian.macro.dashRange", dashRange); } catch { /* ignore */ }
  chartPersist(); // sync across devices (stored alongside the chart prefs)
  const el = document.getElementById("macro-body");
  if (el && MACRO_DATA) el.innerHTML = renderMacro(MACRO_DATA);
});
document.addEventListener("click", (e) => { if (e.target.closest("#chart-export")) exportChartPng(); });
// Save / unsave a Commentary article. Update the clicked button in place; on the
// Saved tab, re-render so an unsaved row drops out of the list.
document.addEventListener("click", (e) => {
  const sb = e.target.closest("[data-save]");
  if (!sb) return;
  e.preventDefault();
  const nowSaved = toggleSavedM(sb.getAttribute("data-save"));
  if (currentTab() === "saved") { render(); return; }
  sb.classList.toggle("is-saved", nowSaved);
  sb.setAttribute("aria-pressed", String(nowSaved));
  sb.textContent = nowSaved ? "★ Saved" : "☆ Save";
  sb.title = nowSaved ? "Remove from saved" : "Save this item";
});
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
  ["policy", "Policy Rate"],
  ["cycle", "Cycle"],
  ["bubble", "Bubble"],
  ["chart", "Chart"],
  ["saved", "Saved"],
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
async function loadMacro(focus) {
  const data = await fetchMacro();
  const series = (data && data.series) || [];
  renderMacroIndRail(series);
  // Fill the cockpit's indicators grid too (the dashboard pane is built before the
  // live /api/macro data lands, so refresh it in place once it arrives).
  const ck = document.getElementById("mac-ck-inds");
  if (ck) ck.innerHTML = cockpitInds(series);
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
  el.innerHTML = `<span class="ds-text" title="Indicators are refreshed by the four-times-daily routine (05:00, 12:00, 17:00 &amp; 21:00 London) and fetched live from /api/macro; guidance as of ${esc(UPDATED)}"><span class="ds-part">Last refresh ${esc(refreshStamp())}</span></span>`;
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
      href: `#/dashboard?focus=${s.country}-${s.key}`,
      date: s.asOf ? `${s.asOf}-01` : "",
    };
  });
}
function notifItems() {
  const data = dataAlerts((MACRO_DATA && MACRO_DATA.series) || []);
  // Guidance alerts (rate outlook / cycle / bubble) are Wire's own editorial
  // synthesis — note their proprietary source; data alerts carry the provider.
  const guidance = ALERTS.map((a) => ({ ...a, source: "Wire analysis" }));
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
      <span class="notif-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>${n ? `<span class="notif-badge">${n > 9 ? "9+" : n}</span>` : ""}
    </button>
    <div class="notif-panel" id="notif-panel" role="menu" hidden>
      <div class="notif-head">${n ? `${n} new update${n > 1 ? "s" : ""}` : "No new updates"} <span class="muted small">· checked ${esc(refreshStamp())}</span></div>
      <ul class="notif-list">
        ${list.length ? list.map((x) => `<li class="notif-item${(n && fresh.includes(x)) ? " is-new" : ""}">
          <a href="${x.href}" class="nf-row">
            <span class="nf-title">${esc(x.title)}</span>
            <span class="nf-meta"><span class="nf-code macro">MAC</span>${x.date ? `<span class="nf-time">${esc(fmtDate(x.date))}</span>` : ""}${x.source ? `<span class="nf-sep">·</span><span class="nf-src">${esc(x.source)}</span>` : ""}</span>
          </a>
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
document.addEventListener("click", (e) => {
  const panel = document.getElementById("notif-panel");
  const isOpen = panel && !panel.hasAttribute("hidden");
  if (isOpen && !e.target.closest("#notif")) { e.preventDefault(); e.stopPropagation(); closeNotif(); }
}, true);
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
  // Deep-link from a data-alert notification: #/dashboard?focus=US-core_cpi
  // scrolls to and highlights that indicator tile once the body loads.
  let dashFocus = null;
  if (tab === "dashboard") {
    dashFocus = hashQuery().focus || null;
    if (dashFocus) history.replaceState(null, "", "#/dashboard");
  }
  // Fresh entry to Commentary starts at the first page of 25.
  if (tab === "commentary") commentaryLimit = COMMENTARY_PAGE;
  const body = tab === "commentary" ? viewCommentary() : tab === "policy" ? viewPolicy() : tab === "cycle" ? viewCycle() : tab === "bubble" ? viewBubble() : tab === "chart" ? viewChart() : tab === "saved" ? viewSaved() : viewDashboard();
  app.innerHTML = body;
  syncNav(tab);
  if (tab === "dashboard") { macroWireDash(); loadMacro(dashFocus); loadMacroFeed(); loadYieldCurve(); }
  if (tab === "commentary") wireCommentary();
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
    // Remember verified sign-in so the Glance home can render optimistically
    // (skip its "Checking your sign-in…" splash) when the user navigates there.
    if (d.email) { try { localStorage.setItem("m_signed_in", "1"); } catch { /* ignore */ } }
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
        // Dashboard sparkline range is stored in the same record — apply it and
        // re-render the tiles if the dashboard is showing.
        if (DASH_RANGES[d.dashRange] && d.dashRange !== dashRange) {
          dashRange = d.dashRange;
          try { localStorage.setItem("meridian.macro.dashRange", dashRange); } catch { /* ignore */ }
          if (currentTab() === "dashboard") { const el = document.getElementById("macro-body"); if (el && MACRO_DATA) el.innerHTML = renderMacro(MACRO_DATA); }
        }
        if (currentTab() === "chart") render();
      } else if (_chartLocal) {
        // Server has nothing yet but this device does — seed it so other devices sync.
        chartPersist();
      }
    })
    .catch(() => { /* not behind Access */ });
}

window.addEventListener("hashchange", render);
// iPhone: tapping the brand logo refreshes the current page rather than jumping
// back to Glance (the href="/" navigation is the desktop behaviour only).
document.addEventListener("click", (e) => {
  if (e.target.closest(".brand") && window.matchMedia("(max-width: 760px)").matches) {
    e.preventDefault(); location.reload();
  }
});
// Unified ⌘K / Ctrl-K search, mounted in-place (opens over the current app).
import("/palette.js?v=20260719-1").then((m) => m.mountPalette()).catch(() => {});
import("/ptr.js?v=20260719-7").then((m) => m.initPullToRefresh()).catch(() => {});
render();
initMe();
renderDataStatus();
fetchMacro().then(initNotif);
initChartPrefs();
initSavedMSync();
