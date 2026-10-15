// =============================================================================
// digest.js (v2 view helper) — Menu ▸ Digest: the credit-desk digest, Daily or
// Weekly, rendered from the committed /digest.js data module (built by
// scripts/build-digest.mjs from Wire's own data — every item carries its real
// source link + date). Shareable at /v2/menu/digest and /v2/menu/digest/weekly.
// =============================================================================
import { esc, fmtD } from "/util.js";

const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDay = (iso) => fmtD(String(iso || "").slice(0, 10)); // R43b: "15 Oct 26"
const fmtStamp = (s) => { const t = Date.parse(s || ""); if (Number.isNaN(t)) return ""; const d = new Date(t); return `${d.getDate()} ${M[d.getMonth()]} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };

export const MODES = [["daily", "Daily"], ["weekly", "Weekly"]];
export const digestPath = (mode) => "/v2/menu/digest" + (mode === "weekly" ? "/weekly" : "");

const SECTIONS = [
  ["deals", "Top deals by size", "No new deals in this window."],
  ["closes", "Fund closes & fundraising", "No fund closes or raises in this window."],
  ["legal", "Restructuring & legal", "No restructuring or legal developments in this window."],
  ["people", "People moves", "No senior moves in this window."],
];

function itemHTML(x) {
  // The size (when ranked by one) leads the meta line — it is the figure the
  // headline itself states, so it is never a second, competing number.
  const meta = [x.date ? fmtDay(x.date) : "", x.who, x.kind, x.src].filter(Boolean).map(esc).join(" · ");
  return `<div class="dg-item">`
    + `<a class="dg-t" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a>`
    + `<div class="dg-meta">${x.amount ? `<span class="dg-amt">${esc(x.amount)}</span> · ` : ""}${meta}${x.href ? ` · <a class="dg-in" href="${esc(x.href)}">In Wire</a>` : ""}</div>`
    + `</div>`;
}
function ratesHTML(R, mode) {
  if (!R || !R.items || !R.items.length) return "";
  const sign = (v) => (v > 0 ? "+" : v < 0 ? "−" : "±") + String(Math.abs(v));
  const cls = (v) => (v > 0 ? "is-up" : v < 0 ? "is-down" : "is-flat");
  return `<div class="dg-sec" data-dg="rates"><div class="na-menu-recent-h">Rates &amp; spreads <span class="dg-sub">${mode === "weekly" ? "1-week" : "1-day"} change</span></div>`
    + `<table class="dg-rates"><tbody>`
    + R.items.map((x) => `<tr><td class="dg-r-nm"><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)}</a></td>`
      + `<td class="dg-r-v">${esc(String(x.display))}${x.unit === "bp" ? "bp" : "%"}</td>`
      + `<td class="dg-r-c ${cls(x.chg)}">${sign(x.chg)}${x.chgUnit === "bp" ? "bp" : ""}</td>`
      + `<td class="dg-r-d">${esc(fmtDay(x.asOf))}</td></tr>`).join("")
    + `</tbody></table>`
    + (R.savedAt ? `<p class="dg-note">Last-known values committed ${esc(fmtStamp(R.savedAt))}.</p>` : "")
    + `</div>`;
}

export function digestHTML(D, mode) {
  if (!D || !D[mode]) return `<p class="watch-empty">The digest hasn’t been built yet.</p>`;
  const W = D[mode];
  const range = W.from === W.to ? fmtDay(W.to) : `${fmtDay(W.from)} – ${fmtDay(W.to)}`;
  const seg = `<div class="na-theme-seg dg-seg" id="v2-dg-seg" role="group" aria-label="Digest period">`
    + MODES.map(([k, l]) => `<button type="button" class="na-theme-opt${k === mode ? " is-on" : ""}" data-dg-mode="${k}" aria-pressed="${k === mode}">${l}</button>`).join("")
    + `</div>`;
  return `<div class="dg" id="v2-dg" data-mode="${esc(mode)}">`
    + `<div class="na-menu-row na-menu-pushrow dg-head"><span class="dg-h"><strong>${esc(W.label)} digest</strong> · ${esc(range)}</span>${seg}</div>`
    + `<div class="na-menu-row na-menu-pushrow dg-share"><span class="dg-built">Built ${esc(fmtStamp(D.built))} from Wire’s committed data</span>`
    + `<button type="button" class="na-menu-push" id="v2-dg-share" data-path="${esc(digestPath(mode))}">Share link</button></div>`
    + SECTIONS.map(([k, label, empty]) => {
      const B = W[k] || { items: [], total: 0 };
      return `<div class="dg-sec" data-dg="${k}"><div class="na-menu-recent-h">${esc(label)}${B.total > B.items.length ? ` <span class="dg-sub">top ${B.items.length} of ${B.total}</span>` : ""}</div>`
        + (B.items.length ? B.items.map(itemHTML).join("") : `<p class="dg-empty">${esc(empty)}</p>`)
        + `</div>`;
    }).join("")
    + ratesHTML(W.rates, mode)
    + `</div>`;
}

// Share: the native sheet on phones, else copy to the clipboard; the button echoes
// what happened so it never looks dead.
export async function shareDigest(btn) {
  const url = location.origin + (btn.dataset.path || digestPath("daily"));
  try {
    if (navigator.share) { await navigator.share({ title: "Wire credit digest", url }); btn.textContent = "Shared"; return; }
  } catch { /* cancelled — fall through to copy */ }
  try { await navigator.clipboard.writeText(url); btn.textContent = "Link copied"; }
  catch { btn.textContent = url; }
}

export async function loadDigest() {
  try { return (await import("/digest.js")).DIGEST || null; } catch { return null; }
}
