// whatsnew.js — "What's new since you last looked" (Menu ▸ New, and the header
// Watchlist panel's "New since last visit" tab + its count badge — nav-actions.js).
// Also home to the shared watchlist-row renderer and the empty-watchlist follow
// suggestions (bottom of this file).
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
  ["deals", "Deals"], ["intel", "Fundraising & people"], ["hedge", "Hedge funds"],
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
    // A deal opens its Transactions deal drawer; a fundraising item opens its manager's
    // profile FOCUSED on that item's row (?focus=<id> → scroll + flash).
    deals: (d.deals || []).filter((x) => fresh.deals.has(x.id)).map((x) => ({ t: x.headline, date: x.date, sub: mName[x.managerId] || "", href: x.date ? "/v2/transactions/#/deal/" + encodeURIComponent(x.id) : (x.sourceUrl || ""), ext: !x.date && !!x.sourceUrl, star: fm.has(x.managerId) })),
    intel: (d.intel || []).filter((x) => fresh.intel.has(x.id)).map((x) => ({ t: x.headline, date: x.date, sub: [x.type, mName[x.managerId]].filter(Boolean).join(" · "), href: x.managerId ? P + "manager/" + encodeURIComponent(x.managerId) + "?focus=" + encodeURIComponent(x.id) : (x.sourceUrl || ""), ext: !x.managerId && !!x.sourceUrl, star: fm.has(x.managerId) })),
    hedge: (d.HEDGE_INTEL || []).filter((x) => fresh.hedge.has(x.id)).map((x) => ({ t: x.headline, date: x.date, sub: hName[x.hfId] || "", href: P + "hf/" + encodeURIComponent(x.hfId || ""), star: fh.has(x.hfId) })),
    legal: (d.items || []).filter((x) => fresh.legal.has(x.id)).map((x) => ({ t: x.title, date: x.date, sub: fName(x.firm), href: x.url || P + "item/" + encodeURIComponent(x.id), ext: !!x.url, star: ff.has(x.firm), est: !!x.dateEstimated })),
    cases: (d.cases || []).filter((x) => fresh.cases.has(x.id)).map((x) => ({ t: x.name, date: x.date, sub: [x.court, x.citation].filter(Boolean).join(" · "), href: x.url || "", ext: !!x.url })),
    rx: (d.restructurings || []).filter((x) => fresh.rx.has(rxKey(x))).map((x) => ({ t: x.company, date: x.date, sub: [x.type === "scheme" ? "Scheme" : "Restructuring plan", x.citation].filter(Boolean).join(" · "), href: x.judgmentUrl || x.articleUrl || "", ext: !!(x.judgmentUrl || x.articleUrl) })),
  };
  for (const k of Object.keys(rows)) rows[k].sort((a, b) => (b.star - a.star) || String(b.date || "").localeCompare(String(a.date || "")));
  return rows;
}

const CAP = 40;
// Pure: how many records arrived since the snapshot (the header Watchlist badge).
// No snapshot yet → 0 (the first open sets the starting point; nothing is "new").
export function newCount(d, snap) {
  if (!snap) return 0;
  const fresh = diffNew(currentIds(d), snap);
  return Object.values(fresh).reduce((n, set) => n + set.size, 0);
}
// opts.seenId — the "Mark all as seen" button id (the Menu pane and the header
// panel can both be in the DOM at once, so each passes its own).
export function whatsNewHTML(d, snap, opts = {}) {
  const seenId = opts.seenId || "v2-new-seen";
  if (!snap) return `<p class="watch-empty">Starting point set — from now on, every record that arrives in Wire (including history backfilled with its real, older date) collects here until you mark it seen.</p>`;
  const cur = currentIds(d), fresh = diffNew(cur, snap), rows = rowsFor(d, fresh);
  const total = Object.values(rows).reduce((n, a) => n + a.length, 0);
  const since = snap.at ? new Date(snap.at).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  const head = `<div class="na-menu-row wn-new-head"><span>${total ? `<strong>${total}</strong> new since ${esc(since)}` : `Nothing new since ${esc(since)}`}</span>`
    + `<button type="button" class="na-menu-push" id="${esc(seenId)}" data-wn-seen${total ? "" : " disabled"}>Mark all as seen</button></div>`;
  if (!total) return head;
  return head + GROUPS.map(([k, label]) => {
    const arr = rows[k]; if (!arr.length) return "";
    return `<div class="watch-grp"><div class="watch-grp-h">${esc(label)} <span class="watch-grp-ct">${arr.length}</span></div>`
      + arr.slice(0, CAP).map((r) => {
        // A row with no destination (a case with no judgment link) is shown as plain
        // text — never a dead link that does nothing on tap.
        const inner = `<span class="watch-nm">${r.star ? "★ " : ""}${esc(r.t || "")}</span>`
          + `<span class="watch-sub">${r.date ? (r.est ? "c. " : "") + esc(fmtDay(r.date)) : "undated"}${r.sub ? " · " + esc(r.sub) : ""}</span>`;
        if (!r.href) return `<div class="watch-row watch-row-nolink">${inner}</div>`;
        return `<a class="watch-row" href="${esc(r.href)}"${r.ext ? ' target="_blank" rel="noopener noreferrer"' : ` data-watch-href="${esc(r.href)}"`}>${inner}</a>`;
      }).join("")
      + (arr.length > CAP ? `<p class="watch-empty">+${arr.length - CAP} more</p>` : "")
      + `</div>`;
  }).join("");
}

// ---- Watchlist rows (shared) ------------------------------------------------
// Everything you follow (managers, hedge funds, investors, law firms), grouped by
// kind, each row a link to its profile. `rows` come from saved.js/resolveFollows().
// ONE renderer for the header Watchlist panel (and, once adopted, Menu ▸ Watchlist).
const WATCH_GROUPS = ["Managers", "Hedge funds", "Investors", "Law firms"];
export function watchlistHTML(rows) {
  if (!rows || !rows.length) {
    return `<p class="watch-empty">You haven’t followed anything yet. Tap <strong>Follow</strong> on any manager, hedge fund, investor or law firm and it collects here.</p>`;
  }
  const groups = {};
  rows.forEach((r) => { (groups[r.kind] = groups[r.kind] || []).push(r); });
  const order = [...WATCH_GROUPS, ...Object.keys(groups).filter((k) => !WATCH_GROUPS.includes(k))];
  return order.map((g) => {
    const arr = groups[g]; if (!arr || !arr.length) return "";
    arr.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return `<div class="watch-grp"><div class="watch-grp-h">${esc(g)} <span class="watch-grp-ct">${arr.length}</span></div>`
      + arr.map((e) => `<a class="watch-row" href="${esc(e.href)}" data-watch-href="${esc(e.href)}">`
          + `<span class="watch-nm">${esc(e.name)}</span>${e.sub ? `<span class="watch-sub">${esc(e.sub)}</span>` : ""}</a>`).join("")
      + `</div>`;
  }).join("");
}

// ---- First-use suggestions (empty watchlist) ---------------------------------
// Pure, from COMMITTED data only: the most active EUROPEAN managers by recorded deal
// count (credit/js/data.js deals; "European" = the manager's PRIMARY HQ — the first
// location before any " / " — passes the target-fit Europe test, so a US house with a
// London office is not counted) and the most active law firms by alerts / deal
// announcements in the last 12 months (legal/js/data.js items; the barristers'
// chambers are excluded). Every count is a real tally and is shown on its row.
export function suggestFollows(cr, lg, targetFit, n = 5, now = new Date()) {
  const dealsBy = new Map();
  for (const x of (cr.deals || [])) if (x.managerId) dealsBy.set(x.managerId, (dealsBy.get(x.managerId) || 0) + 1);
  const primaryHQ = (m) => String(m.hq || "").split("/")[0].trim();
  const managers = (cr.managers || [])
    .filter((m) => dealsBy.get(m.id) && primaryHQ(m) && targetFit({ hq: primaryHQ(m) }, []).europe)
    .map((m) => ({ type: "manager", id: m.id, name: m.name, sub: primaryHQ(m), n: dealsBy.get(m.id), unit: "deal", tail: " recorded" }))
    .sort((a, b) => b.n - a.n || a.name.localeCompare(b.name)).slice(0, n);
  const since = new Date(now.getTime() - 365 * 864e5).toISOString().slice(0, 10);
  const firmN = new Map();
  for (const it of (lg.items || [])) if (it.firm && String(it.date || "") >= since) firmN.set(it.firm, (firmN.get(it.firm) || 0) + 1);
  const firms = (lg.firms || [])
    .filter((f) => f.tier !== "chambers" && firmN.get(f.id))
    .map((f) => ({ type: "firm", id: f.id, name: f.name, sub: "", n: firmN.get(f.id), unit: "update", tail: " in 12 months" }))
    .sort((a, b) => b.n - a.n || a.name.localeCompare(b.name)).slice(0, n);
  return { managers, firms };
}
// The empty-watchlist suggestion list: each row links to the profile and carries a
// one-tap Follow toggle (data-sugg-follow="type:id", wired by the host to
// credit/js/shared.js toggleFollow — the ONE follow implementation).
export function suggestHTML(sug, isFollowed) {
  if (!sug || (!sug.managers.length && !sug.firms.length)) return watchlistHTML([]);
  const row = (s) => {
    const on = !!(isFollowed && isFollowed(s.type, s.id));
    const href = "/v2/profiles/#/" + s.type + "/" + encodeURIComponent(s.id);
    return `<div class="watch-row wsug-row"><a class="wsug-main" href="${esc(href)}" data-watch-href="${esc(href)}"><span class="watch-nm">${esc(s.name)}</span>`
      + `<span class="watch-sub">${s.sub ? esc(s.sub) + " · " : ""}${s.n} ${s.unit}${s.n === 1 ? "" : "s"}${esc(s.tail || "")}</span></a>`
      + `<button type="button" class="wsug-follow${on ? " is-on" : ""}" data-sugg-follow="${esc(s.type)}:${esc(s.id)}" aria-pressed="${on}" aria-label="${on ? "Unfollow" : "Follow"} ${esc(s.name)}">${on ? "Following" : "Follow"}</button></div>`;
  };
  const grp = (label, arr) => (arr.length ? `<div class="watch-grp"><div class="watch-grp-h">${esc(label)}</div>${arr.map(row).join("")}</div>` : "");
  return `<p class="watch-empty">Your watchlist is empty. Start with the most active names in Wire — one tap to follow.</p>`
    + grp("European managers · most deals", sug.managers)
    + grp("Law firms · most active", sug.firms);
}
