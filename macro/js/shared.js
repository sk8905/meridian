// =============================================================================
// macro/js/shared.js — helpers shared between the Macro app shell (app.js) and
// the Dashboard cockpit (dashboard.js). Pure functions + the MACRO_DATA store;
// imports flow app.js -> dashboard.js -> shared.js (never backwards), so the
// module graph stays acyclic and cache tokens can't split a module in two.
// NB macro MONTHS/MONTHS_FULL are 1-INDEXED (element 0 is "") — deliberately
// different from the 0-indexed MONTHS in /util.js.
// =============================================================================
import { esc } from "/util.js?v=20260719-1";
import { BUBBLE } from "./content.js?v=20260721-5";

export const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_FULL = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const isoToDate = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };

// Full-date formatter for news items: "2026-07-01" → "1 Jul 2026".
export function fmtDay(iso) {
  const d = isoToDate(iso);
  return d ? `${d.getDate()} ${MONTHS[d.getMonth() + 1]} ${d.getFullYear()}` : (iso || "");
}
// Zero-padded variant matching Credit's fmtDate ("09 Jul 2026") so the Commentary
// feed uses the same date convention as the Credit News feed.
export function fmtDayGB(iso) {
  const d = isoToDate(iso);
  return d ? `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth() + 1]} ${d.getFullYear()}` : (iso || "");
}
// Weekday + day + month for the calendar banner: "2026-07-14" → "Tue 14 Jul".
export function fmtWeekday(iso) {
  const d = isoToDate(iso);
  return d ? `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth() + 1]}` : (iso || "");
}

// Short "9 Jul 2026" / "Jul 2026" formatter (the app-wide macro date style).
export function fmtDate(d) {
  const p = String(d || "").split("-");
  if (p.length < 2) return String(d || "");
  const day = p[2] ? `${(+p[2])} ` : "";
  return `${day}${MONTHS[+p[1]] || ""} ${p[0]}`;
}

// ---- Horizontal 0–100 gauge (used by Cycle and Bubble) ---------------------
// zones: [[pos,label], …] printed under the track; items: [{label,pos}, …]
// markers on the track. gradId must be unique per gauge on the page.
let gaugeSeq = 0;
export function trackGauge(zones, items, aria) {
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
export const CYCLE_ZONES = [[6, "Early"], [31, "Leveraging"], [56, "Late cycle"], [81, "Bubble / top"], [98, "Crisis"]];
export const BUBBLE_ZONES = [[7, "Low"], [30, "Moderate"], [52, "Elevated"], [75, "High"], [96, "Extreme"]];
// Composite bubble score = weighted average of the dimension sub-scores.
export function bubbleComposite() {
  const d = BUBBLE.dimensions;
  const wsum = d.reduce((s, x) => s + x.weight, 0) || 1;
  return Math.round(d.reduce((s, x) => s + x.score * x.weight, 0) / wsum);
}
export function bubbleBand(score) {
  return score < 20 ? "Low" : score < 40 ? "Moderate" : score < 65 ? "Elevated" : score < 82 ? "High" : "Extreme";
}

// Cockpit + indicator-rail series order (both modules render indicator tiles).
export const MAC_IND_ORDER = ["base_rate", "two_year", "core_cpi", "services_pmi", "wages", "unemployment"];

// Live shared state: the /api/macro payload. app.js loads it (loadMacro) and
// writes through the setter; both modules read the live MACRO_DATA binding.
export let MACRO_DATA = null;
export const setMacroData = (d) => { MACRO_DATA = d; };
