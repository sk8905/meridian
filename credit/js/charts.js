// =============================================================================
// Tiny dependency-free inline-SVG chart helpers.
// Each returns an SVG string. Kept intentionally small and self-contained so
// the prototype runs offline with no build step or CDN.
//
// Design language (restrained, "one hue" house style):
//   • Bars & single-series lines are magnitude → ONE brand blue, never a
//     per-item colour.
//   • Donut slices are magnitude shares of one measure → a single-hue blue
//     ramp, darkest = largest slice (inherently colour-blind-safe: only
//     lightness varies), with a neutral grey for a folded "Other".
//   • Recessive grid/axes, thin marks, a 2px surface gap between donut slices,
//     gradient area fills. No rainbow.
// =============================================================================

// Single brand hue for bars & lines (deep, print-safe blue).
const BRAND = "#256abf";
// Sequential blue ramp for donut slices — dark (largest) → light (smallest).
// Only lightness/chroma vary, so adjacent slices stay distinguishable under any
// colour-vision deficiency; the legend still carries identity.
const BLUE_RAMP = ["#0d366b", "#16478a", "#1c5cab", "#2564bf", "#2f7ad6", "#4a90e2", "#6ea8ee", "#8fbef2"];
const OTHER = "#c7ccd4";     // neutral for a folded "Other" slice
const SURFACE = "#ffffff";   // slice-gap / marker-halo colour

// Unique-id counter so multiple charts on one page don't share gradient ids.
let _uid = 0;

// Sample the ramp so N slices spread evenly across dark → light regardless of N.
function rampColor(i, n) {
  if (n <= 1) return BLUE_RAMP[0];
  const idx = Math.round((i / (n - 1)) * (BLUE_RAMP.length - 1));
  return BLUE_RAMP[Math.min(idx, BLUE_RAMP.length - 1)];
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Turn a datum's optional `nav` object ({jump:"funds", strategy:"…"}) into
// data-* attributes consumed by the app's click delegation.
function navAttrs(nav) {
  if (!nav) return "";
  return Object.entries(nav).map(([k, v]) => `data-${k}="${esc(v)}"`).join(" ");
}

// Horizontal bar chart. data: [{label, value, nav?}]
// Thin rounded (pill) bars on a faint track, generous row spacing.
export function barChart(data, { unit = "", width = 520 } = {}) {
  const rowStep = 30, barH = 13, left = 190, right = 78, top = 12;
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = width - left - right;
  const height = data.length * rowStep + top;
  const rows = data.map((d, i) => {
    const y = top + i * rowStep;
    const cy = y + barH / 2;
    const w = Math.max(4, (d.value / max) * barW);
    const inner = `
      <rect x="0" y="${y - (rowStep - barH) / 2}" width="${width}" height="${rowStep}" fill="transparent"/>
      <text x="${left - 12}" y="${cy + 4}" text-anchor="end" class="chart-label">${esc(d.label)}</text>
      <rect x="${left}" y="${y}" width="${barW}" height="${barH}" rx="${barH / 2}" class="bar-track"/>
      <rect x="${left}" y="${y}" width="${w}" height="${barH}" rx="${barH / 2}" fill="${BRAND}"><title>${esc(d.label)}: ${unit}${d.value.toLocaleString()}</title></rect>
      <text x="${left + w + 10}" y="${cy + 4}" class="chart-value">${unit}${d.value.toLocaleString()}</text>`;
    return d.nav ? `<g class="bar-row clickable" ${navAttrs(d.nav)}>${inner}</g>` : `<g>${inner}</g>`;
  }).join("");
  return `<svg viewBox="0 0 ${width} ${height}" class="chart" role="img">${rows}</svg>`;
}

// Donut chart. data: [{label, value, nav?}] — assumed sorted by value desc.
export function donutChart(data, { size = 220 } = {}) {
  const sum = data.reduce((s, d) => s + d.value, 0); // real total shown in the centre
  const total = sum || 1;                            // geometry divisor (avoid /0)
  const cx = size / 2, cy = size / 2, r = size / 2 - 6, inner = r * 0.64;
  const n = data.length;
  const colorOf = (d, i) => (/^other$/i.test(d.label) ? OTHER : rampColor(i, n));
  let angle = -Math.PI / 2;
  const arcs = data.map((d, i) => {
    const frac = d.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    const cls = d.nav ? ' class="clickable"' : "";
    return `<path${cls} ${navAttrs(d.nav)} d="M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi0} ${yi0} Z" fill="${colorOf(d, i)}" stroke="${SURFACE}" stroke-width="2" stroke-linejoin="round"><title>${esc(d.label)}: ${d.value} (${Math.round(frac * 100)}%)</title></path>`;
  }).join("");
  const legend = data.map((d, i) => {
    const pct = Math.round((d.value / total) * 100);
    return `<div class="legend-item ${d.nav ? "clickable" : ""}" ${navAttrs(d.nav)}><span class="legend-swatch" style="background:${colorOf(d, i)}"></span><span class="legend-label">${esc(d.label)}</span><strong>${d.value}</strong><span class="legend-pct">${pct}%</span></div>`;
  }).join("");
  return `<div class="donut-wrap">
    <svg viewBox="0 0 ${size} ${size}" class="donut" role="img">${arcs}
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">${sum}</text>
      <text x="${cx}" y="${cy + 14}" text-anchor="middle" class="donut-sub">total</text>
    </svg>
    <div class="legend">${legend}</div>
  </div>`;
}

// Line chart. data: [{label, value}] in chronological order
export function lineChart(data, { unit = "", width = 560, height = 220 } = {}) {
  if (!data || !data.length) return `<svg viewBox="0 0 ${width} ${height}" class="chart" role="img"></svg>`;
  const left = 50, right = 20, top = 20, bottom = 30;
  const gid = "cg" + (++_uid);
  const max = Math.max(1, ...data.map((d) => d.value));
  const plotW = width - left - right, plotH = height - top - bottom;
  const stepX = data.length > 1 ? plotW / (data.length - 1) : 0;
  const pts = data.map((d, i) => {
    const x = left + i * stepX;
    const y = top + plotH - (d.value / max) * plotH;
    return { x, y, d };
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${path} L ${pts[pts.length - 1].x} ${top + plotH} L ${pts[0].x} ${top + plotH} Z`;
  // Each point can carry a `nav` object → it becomes a clickable column
  // (transparent full-height hit area + dot + x-label) for drill-down.
  const hitW = stepX > 0 ? stepX : plotW;
  const dots = pts.map((p) => {
    const dot = `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.8" fill="${BRAND}" stroke="${SURFACE}" stroke-width="1.5"></circle>`;
    const lbl = `<text x="${p.x.toFixed(1)}" y="${height - 8}" text-anchor="middle" class="chart-axis">${esc(p.d.label)}</text>`;
    const tip = `<title>${esc(p.d.label)}: ${unit}${p.d.value.toLocaleString()}</title>`;
    if (!p.d.nav) return `<g>${dot}${lbl}${tip}</g>`;
    const hx = Math.max(0, p.x - hitW / 2);
    return `<g class="line-pt clickable" ${navAttrs(p.d.nav)}>${tip}` +
      `<rect x="${hx.toFixed(1)}" y="${top}" width="${hitW.toFixed(1)}" height="${plotH}" fill="transparent"/>` +
      `${dot}${lbl}</g>`;
  }).join("");
  const gridY = [0, 0.5, 1].map((f) => {
    const y = top + plotH - f * plotH;
    return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="chart-grid"/>
      <text x="${left - 8}" y="${y + 4}" text-anchor="end" class="chart-axis">${unit}${Math.round(max * f).toLocaleString()}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${width} ${height}" class="chart" role="img">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${BRAND}" stop-opacity="0"/>
    </linearGradient></defs>
    ${gridY}
    <path d="${area}" fill="url(#${gid})"/>
    <path d="${path}" fill="none" stroke="${BRAND}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
  </svg>`;
}

// Compact sparkline — area + line + last-point dot, first/last date labels, no
// axes or grid. For the Macro mini-charts (≈5y of monthly points). Scales to its
// container width via viewBox; the stroke stays crisp (non-scaling). data:
// [{label, value}].
export function sparkline(data, { width = 300, height = 88, color = "#6941c6", unit = "" } = {}) {
  if (!data || data.length < 2) return `<svg viewBox="0 0 ${width} ${height}" class="spark" role="img"></svg>`;
  const padX = 4, top = 8, bottom = 16;
  const gid = "sg" + (++_uid);
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
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${area}" fill="url(#${gid})"/>
    <path d="${path}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.2" fill="${color}"/>
    <text x="${padX}" y="${height - 3}" class="spark-x">${esc(yr(data[0].label))}</text>
    <text x="${width - padX}" y="${height - 3}" text-anchor="end" class="spark-x">${esc(yr(data[data.length - 1].label))}</text>
  </svg>`;
}

// Multi-series line chart. series: [{ name, color, points:[{label, value}] }].
// All series share the same x positions (labels + click hit-areas come from the
// first series' points, which may carry a `nav` object for drill-down).
export function multiLineChart(series, { unit = "", width = 1120, height = 240 } = {}) {
  const left = 50, right = 20, top = 24, bottom = 30;
  const base = series[0] ? series[0].points : [];
  const n = base.length;
  const max = Math.max(1, ...series.flatMap((s) => s.points.map((p) => p.value)));
  const plotW = width - left - right, plotH = height - top - bottom;
  const stepX = n > 1 ? plotW / (n - 1) : 0;
  const X = (i) => left + i * stepX;
  const Y = (v) => top + plotH - (v / max) * plotH;
  const gridY = [0, 0.5, 1].map((f) => {
    const y = top + plotH - f * plotH;
    return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="chart-grid"/>
      <text x="${left - 8}" y="${y + 4}" text-anchor="end" class="chart-axis">${unit}${Math.round(max * f).toLocaleString()}</text>`;
  }).join("");
  const lines = series.map((s) => {
    const path = s.points.map((p, i) => `${i === 0 ? "M" : "L"} ${X(i).toFixed(1)} ${Y(p.value).toFixed(1)}`).join(" ");
    const dots = s.points.map((p, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.value).toFixed(1)}" r="3" fill="${s.color}" stroke="${SURFACE}" stroke-width="1.5"><title>${esc(s.name)} — ${esc(p.label || "")}: ${unit}${p.value.toLocaleString()}</title></circle>`).join("");
    return `<path d="${path}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>${dots}`;
  }).join("");
  const hitW = stepX > 0 ? stepX : plotW;
  const xaxis = base.map((p, i) => {
    const lbl = `<text x="${X(i).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="chart-axis">${esc(p.label || "")}</text>`;
    if (!p.nav) return `<g>${lbl}</g>`;
    const hx = Math.max(0, X(i) - hitW / 2);
    return `<g class="line-pt clickable" ${navAttrs(p.nav)}><rect x="${hx.toFixed(1)}" y="${top}" width="${hitW.toFixed(1)}" height="${plotH}" fill="transparent"/>${lbl}</g>`;
  }).join("");
  const legend = series.map((s) =>
    `<div class="legend-item"><span class="legend-swatch" style="background:${s.color}"></span>${esc(s.name)}</div>`
  ).join("");
  return `<div class="chart-legend">${legend}</div>
    <svg viewBox="0 0 ${width} ${height}" class="chart" role="img">${gridY}${lines}${xaxis}</svg>`;
}
