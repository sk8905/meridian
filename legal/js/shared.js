// =============================================================================
// legal/js/shared.js — helpers shared between the Wire Legal shell (app.js) and
// the detail-view module (detail.js): the date formatters, the saved-items read
// layer, the "new since last visit" marker, and the alert feed-row renderer.
// Imports flow app.js -> detail.js -> shared.js (never backwards), so the module
// graph stays acyclic and the ?v= data token can't split data.js in two.
// NOTE: app.js, detail.js and shared.js all import ./data.js with the SAME ?v=
// token — keep them identical and bump together, or the browser loads data.js
// twice as separate module instances (blank page).
// =============================================================================
import { firmById, areaById, typeById, tierById } from "./data.js?v=20260722-5";
import { esc, MONTHS } from "/util.js?v=20260719-1";

// ----------------------------- date formatting ------------------------------
export function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return esc(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; // day-month-year
}
// Alert date for display: prefix "≈" when the date is an approximation pending
// source verification (dateEstimated), or "undated" when we have no date yet.
export function itemDate(it) {
  if (!it.date) return "undated";
  return (it.dateEstimated ? "≈ " : "") + fmtDate(it.date);
}

// ---- "New since last visit" -------------------------------------------------
const VISIT_KEY = "lexalert.lastVisit";
export function lastVisit() { return localStorage.getItem(VISIT_KEY) || ""; }
export function markVisitedSoon() {
  // Record *today* as the visit marker after a short delay so the current
  // session still sees this run's "new" highlights.
  setTimeout(() => { try { localStorage.setItem(VISIT_KEY, new Date().toISOString().slice(0, 10)); } catch {} }, 1500);
}
const prevVisit = lastVisit();
export function isNew(item) { return prevVisit && item.date > prevVisit; }

// ---- Saved state (read layer) -----------------------------------------------
// Saved items persist to a per-user Cloudflare KV store (see app.js) with
// localStorage as an instant cache / offline fallback. This module holds the
// getter + the key; the write/sync side lives in app.js.
export const SAVED_KEY = "lexalert.saved";
export function getSaved() {
  try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")); }
  catch { return new Set(); }
}

// ---- Shared rendering bits --------------------------------------------------
export function areaChip(areaId) {
  const a = areaById[areaId];
  if (!a) return "";
  return `<span class="chip area" style="--c:${a.color}">${esc(a.short)}</span>`;
}
export function tierLabel(tierId) { return (tierById[tierId] || {}).name || tierId; }

// A firm name that links to its profile page (#/firm/<id>) when the firm is a
// tracked entity, else plain text. Mirrors Credit's manager-profile link so a
// Legal item always offers "source + firm profile" from its footer.
export function firmLink(id, name, cls) {
  const c = cls || "firm";
  return firmById[id]
    ? `<a class="${c}" href="#/firm/${esc(id)}">${esc(name)}</a>`
    : `<span class="${c}">${esc(name)}</span>`;
}

// A firm-alert as a list row — Wire Credit style: colored chip + date in the
// meta column, bold headline, full muted summary, then a single muted footer line.
export function itemRow(it) {
  const firm = firmById[it.firm] || { name: it.firm, tier: "" };
  const type = (typeById[it.type] || {}).name || it.type;
  const saved = getSaved().has(it.id);
  const areasHtml = (it.areas || [it.area]).map(areaChip).join("");
  const tierTxt = tierLabel(firm.tier);
  const src = it.url || firm.insightsUrl;
  return `<div class="feed-row" id="row-${esc(it.id)}">
    <div class="feed-meta">
      <span class="feed-date">${itemDate(it)}</span>
    </div>
    <div class="feed-body">
      <div class="rx-title-line">
        ${src
          ? `<a class="feed-title" href="${esc(src)}" target="_blank" rel="noopener noreferrer">${esc(it.title)}</a>`
          : `<a class="feed-title" href="#/item/${esc(it.id)}">${esc(it.title)}</a>`}
        <button class="save-btn rx-save ${saved ? "is-saved" : ""}" data-save="${esc(it.id)}"
          aria-pressed="${saved}" title="${saved ? "Remove from saved" : "Save this update"}">${saved ? "★ Saved" : "☆ Save"}</button>
      </div>
      <p class="feed-summary">${esc(it.summary)}</p>
      <div class="feed-foot">
        <span>${esc(type)}</span> · ${firmById[it.firm]
          ? `<a class="firm src-filter" href="#/list?firm=${esc(it.firm)}" title="Show all ${esc(firm.name)} updates">${esc(firm.name)}</a>`
          : `<span class="firm">${esc(firm.name)}</span>`}${tierTxt ? ` · ${esc(tierTxt)}` : ""}${it.citation ? ` · <span class="cite">${esc(it.citation)}</span>` : ""}${isNew(it) ? ' · <span class="chip new">New</span>' : ""}
      </div>
    </div>
  </div>`;
}

// ---- In-page chip memory ----------------------------------------------------
// Keyed per chips-row AND current route: survives the async data-sync re-renders
// but NOT page loads or navigation. app.js prunes stale entries on hashchange.
export const _chipMem = {};
export const chipMemKey = (id) => id + "|" + location.hash;
