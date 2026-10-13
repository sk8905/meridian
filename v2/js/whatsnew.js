// whatsnew.js — "What's new since you last looked" (Menu ▸ What's new).
//
// Monitoring, not alerts: lists every record that has ARRIVED in Wire since this
// device last marked the list as seen — new deals, fundraising/mandates/personnel,
// hedge-fund items, law-firm alerts, cases and schemes/RPs — each with its REAL
// publication date. It diffs record ids against a snapshot (not dates), so a
// verified item backfilled today with a 2021 date still shows up as new; the bell's
// 3-day publication window can't do that. Followed entities are starred and sort
// first. "Mark all as seen" re-baselines. Snapshot lives on the device only.
import { esc } from "/util.js";
import { fmtDay } from "/feed.js";

const SNAP_KEY = "wire.whatsnew.v1";
const GROUPS = [
  ["deals", "Transactions"], ["intel", "Fundraising & people"], ["hedge", "Hedge funds"],
  ["legal", "Law-firm alerts"], ["cases", "Case law"], ["rx", "Schemes & RPs"],
];
const rxKey = (r) => "rx:" + String(r.company || "") + "|" + String(r.citation || r.date || "");

// Pure: the current id sets per group, from the compact Home slice.
export function currentIds(d) {
  return {
    deals: (d.deals || []).map((x) => x.id),
    intel: (d.intel || []).map((x) => x.id),
    hedge: (d.HEDGE_INTEL || []).map((x) => x.id),
    legal: (d.items || []).map((x) => x.id),
    cases: (d.cases || []).map((x) => x.id),
    rx: (d.restructurings || []).map(rxKey),
  };
}
// Pure: which current records are not in the snapshot.
export function diffNew(cur, snap) {
  const out = {};
  for (const [k] of GROUPS) { const seen = new Set((snap && snap[k]) || []); out[k] = new Set((cur[k] || []).filter((id) => !seen.has(id))); }
  return out;
}
export function readSnap() { try { return JSON.parse(localStorage.getItem(SNAP_KEY) || "null"); } catch { return null; } }
export function writeSnap(cur) { try { localStorage.setItem(SNAP_KEY, JSON.stringify({ ...cur, at: Date.now() })); } catch { /* quota / private mode */ } }

function follows() { try { return JSON.parse(localStorage.getItem("meridian.follows") || "{}") || {}; } catch { return {}; } }

function rowsFor(d, fresh) {
  const f = follows(), fm = new Set(f.manager || []), fh = new Set(f.hf || []), ff = new Set(f.firm || []);
  const mName = Object.fromEntries((d.managers || []).map((m) => [m.id, m.name]));
  const hName = Object.fromEntries((d.hedgeFunds || []).map((h) => [h.id, h.name]));
  const fName = (id) => ((d.firmById || {})[id] || {}).name || id || "";
  const P = "/v2/profiles/#/";
  const rows = {
    deals: (d.deals || []).filter((x) => fresh.deals.has(x.id)).map((x) => ({ t: x.headline, date: x.date, sub: mName[x.managerId] || "", href: P + "manager/" + encodeURIComponent(x.managerId || ""), star: fm.has(x.managerId) })),
    intel: (d.intel || []).filter((x) => fresh.intel.has(x.id)).map((x) => ({ t: x.headline, date: x.date, sub: [x.type, mName[x.managerId]].filter(Boolean).join(" · "), href: P + "manager/" + encodeURIComponent(x.managerId || ""), star: fm.has(x.managerId) })),
    hedge: (d.HEDGE_INTEL || []).filter((x) => fresh.hedge.has(x.id)).map((x) => ({ t: x.headline, date: x.date, sub: hName[x.hfId] || "", href: P + "hf/" + encodeURIComponent(x.hfId || ""), star: fh.has(x.hfId) })),
    legal: (d.items || []).filter((x) => fresh.legal.has(x.id)).map((x) => ({ t: x.title, date: x.date, sub: fName(x.firm), href: x.url || P + "item/" + encodeURIComponent(x.id), ext: !!x.url, star: ff.has(x.firm), est: !!x.dateEstimated })),
    cases: (d.cases || []).filter((x) => fresh.cases.has(x.id)).map((x) => ({ t: x.name, date: x.date, sub: [x.court, x.citation].filter(Boolean).join(" · "), href: x.url || "", ext: !!x.url })),
    rx: (d.restructurings || []).filter((x) => fresh.rx.has(rxKey(x))).map((x) => ({ t: x.company, date: x.date, sub: [x.type === "scheme" ? "Scheme" : "Restructuring plan", x.citation].filter(Boolean).join(" · "), href: x.judgmentUrl || x.articleUrl || "", ext: !!(x.judgmentUrl || x.articleUrl) })),
  };
  for (const k of Object.keys(rows)) rows[k].sort((a, b) => (b.star - a.star) || String(b.date || "").localeCompare(String(a.date || "")));
  return rows;
}

const CAP = 40;
export function whatsNewHTML(d, snap) {
  if (!snap) return `<p class="watch-empty">Starting point set — from now on, every record that arrives in Wire (including history backfilled with its real, older date) collects here until you mark it seen.</p>`;
  const cur = currentIds(d), fresh = diffNew(cur, snap), rows = rowsFor(d, fresh);
  const total = Object.values(rows).reduce((n, a) => n + a.length, 0);
  const since = snap.at ? new Date(snap.at).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  const head = `<div class="na-menu-row wn-new-head"><span>${total ? `<strong>${total}</strong> new since ${esc(since)}` : `Nothing new since ${esc(since)}`}</span>`
    + `<button type="button" class="na-menu-push" id="v2-new-seen"${total ? "" : " disabled"}>Mark all as seen</button></div>`;
  if (!total) return head;
  return head + GROUPS.map(([k, label]) => {
    const arr = rows[k]; if (!arr.length) return "";
    return `<div class="watch-grp"><div class="watch-grp-h">${esc(label)} <span class="watch-grp-ct">${arr.length}</span></div>`
      + arr.slice(0, CAP).map((r) => `<a class="watch-row" href="${esc(r.href || "#")}"${r.ext ? ' target="_blank" rel="noopener noreferrer"' : ` data-watch-href="${esc(r.href || "")}"`}>`
        + `<span class="watch-nm">${r.star ? "★ " : ""}${esc(r.t || "")}</span>`
        + `<span class="watch-sub">${r.date ? (r.est ? "c. " : "") + esc(fmtDay(r.date)) : "undated"}${r.sub ? " · " + esc(r.sub) : ""}</span></a>`).join("")
      + (arr.length > CAP ? `<p class="watch-empty">+${arr.length - CAP} more</p>` : "")
      + `</div>`;
  }).join("");
}
