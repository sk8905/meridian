// AUTO-PORTED from credit/js/app.js for the v2 SPA. Render code verbatim;
// shell wiring changed: injected container, no chrome boot, active-tab-guarded
// listeners. Hash sub-routing unchanged.

import { reportRefresh } from "/v2/js/status.js?v=v2-2";
import {
  STRATEGIES, FUND_STATUS, GEOS, LP_TYPES, DEAL_TYPES, DATA_UPDATED, LAST_CHECKED, LAST_CHECKED_TIME,
  managers, funds, lps, intel, commitments, deals, research,
  managerById, fundById, lpById,
  fundsByManager, intelForManager, intelForFund, dealsForManager, dealsForFund,
  HEDGE_FUNDS, HEDGE_FUNDS_ASOF, HEDGE_INTEL,
} from "/credit/js/data.js?v=20260723-7";
import { barChart, donutChart, lineChart, multiLineChart } from "/credit/js/charts.js?v=20260722-4";
import {
  eur, pct, fmtDate, link, notFound,
  FOLLOW_KEY, FOLLOW_TYPES, follows, followList, followCount, nameCell,
  SAVEDC_KEY, getSavedC, saveBtn, newsSaveId,
  creditSource, feedDedupKey, intelRow, dealRow,
  PAGE, pageShown, pageCount, pageReset, loadMoreBtn, feedHtml, feedFlat,
  applyPendingFocus, setPendingFocus, _chipMem, chipMemKey,
} from "/credit/js/shared.js?v=20260723-3";
import { viewFund, viewManager, viewClo, viewLp, viewHedgeFund, __setHost as __detailSetHost } from "/v2/js/credit/detail.js?v=v2-4";
import { feedBodyHTML, feedSrcBarHTML, feedEmptyHTML, attachFeedClicks, byFeedDesc } from "/feed.js?v=20260723-3";
import { esc, NEWS_SOURCES, srcHost, tidyDomain } from "/util.js?v=20260719-1";

export function mount(host, ctx) {
  const app = host;
  const KEY = "credit";
  const ROOT = document.documentElement;
  const on = (t, ty, fn, o) => t.addEventListener(ty, (e) => { if (ROOT.dataset.v2tab !== KEY) return; return fn(e); }, o);
  __detailSetHost(host);

// =============================================================================
// Wire Credit Intelligence — application shell, router and views.
// Plain ES modules, no framework. Hash-based routing for a clickable prototype.
// =============================================================================

// NOTE: these internal module imports carry the same ?v= cache-buster as the
// <script>/<link> tags in index.html. Bump ALL of them together on every release
// — otherwise the browser/CDN can serve a stale data.js/charts.js against a fresh
// app.js and the app fails to load (blank page). shared.js AND detail.js also
// import ./data.js with this SAME token; keep all three identical or the browser
// loads data.js twice as separate module instances.
// The view code splits across three modules with an ACYCLIC import graph —
// app.js -> detail.js -> shared.js. shared.js holds the format/render helpers,
// the watchlist/saved read layer, the paginated-feed + pending-focus machinery
// and the shared feed-row renderers; detail.js holds the deep Fund / Manager /
// CLO / Investor profile views; this shell keeps the list/dashboard/news views,
// the global event delegation and the router.
// The shared news-wire engine — the Home feed's row / day-header / source-filter
// markup, so the Credit dashboard wire is the same build as Home's.



// In-page memory for chip selections, keyed per chips-row AND current route:
// survives the async data-sync re-renders (which re-run the templates with the
// first chip hardcoded active — the old "kick" bug) but deliberately NOT page
// loads or navigation — every fresh view starts on the first chip. Leaving a
// route drops its entries, so coming back also starts fresh. (Pull-to-refresh
// keeps position across its reload separately, via ptr.js's short-lived
// sessionStorage tab snapshot.)
on(window, "hashchange", () => {
  const suf = "|" + location.hash;
  Object.keys(_chipMem).forEach((k) => { if (!k.endsWith(suf)) delete _chipMem[k]; });
});

// ----------------------------- formatting utils ----------------------------
// Format a €bn AUM figure: €Xtn above 1,000bn, €Xm below 1bn, else €Xbn.

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
const fmtAum = (n) => {
  if (n == null) return "—";
  if (n >= 1000) return `€${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}tn`;
  if (n < 1) return `€${Math.round(n * 1000)}m`;
  return `€${n}bn`;
};
// Calendar quarter (e.g. "2025-Q2") from a fund's close/as-of date; null if only
// the year is known (we don't invent a quarter).
const fundQuarter = (f) => {
  const m = /^(\d{4})-(\d{2})/.exec(f.asOf || "");
  return m ? `${m[1]}-Q${Math.floor((+m[2] - 1) / 3) + 1}` : null;
};
const isClose = (f) => f.status === "Final Close" || f.status === "First Close";



// Funds page categories. Evergreen funds are open-ended (continuously subscribable)
// rather than raising a vintage, so they get their own category — never "Open".
const FUND_CATEGORIES = ["Open", "First Close", "Final Close", "Evergreen", "Pre-marketing"];
const fundCategory = (x) => (x.evergreen ? "Evergreen" : x.status);
// Fundraising status shows as plain text (no colour pill), per house style.
const fundStatusChip = (x) => `<span class="fund-status">${esc(fundCategory(x))}</span>`;
// Lifecycle status (wound down / liquidated / fully realised) — plain text too.
function lifecycleBadge(x) {
  if (!x.lifecycle) return "";
  const s = typeof x.lifecycle === "string" ? x.lifecycle : x.lifecycle.status;
  return `<span class="fund-status" title="${esc(typeof x.lifecycle === "object" && x.lifecycle.note ? x.lifecycle.note : s)}">${esc(s)}</span>`;
}
const mandateClass = (s) => ({
  "Actively allocating": "st-final", "Selective": "st-first", "Not currently active": "st-pre",
}[s] || "");






function chip(text, cls = "") { return `<span class="chip ${cls}">${esc(text)}</span>`; }



// --------------------------- watchlist (cloud sync + localStorage) ---------
// Watchlist persists to a per-user Cloudflare KV store (via the /api/watchlist
// Pages Function) when the site is served behind Cloudflare Access, so it syncs
// across devices. localStorage is kept as an instant cache / offline fallback,
// so the app still works if the API isn't reachable (e.g. plain static hosting).
const WATCHLIST_API = "/api/watchlist";
let account = null;          // signed-in identity (email) when behind Access
let cloudSync = false;       // true once the watchlist API responds
let pushTimer = null;
function persistLocal() { try { localStorage.setItem(FOLLOW_KEY, JSON.stringify(follows)); } catch { /* ignore */ } }
// Debounced save to the cloud (no-op when not signed in / not on Cloudflare).
function pushRemote() {
  if (!cloudSync) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    const body = {}; FOLLOW_TYPES.forEach((t) => (body[t] = followList(t)));
    fetch(WATCHLIST_API, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => {});
  }, 400);
}
function saveFollows() { persistLocal(); pushRemote(); }
function toggleFollow(type, id) {
  const a = followList(type); const i = a.indexOf(id);
  if (i >= 0) a.splice(i, 1); else a.push(id);
  saveFollows();
}

// --------------------------- saved items (cloud sync + localStorage) --------
// Individually saved news / deal / fundraising / CLO items — distinct from the
// follow-based watchlist. Persists to a per-user KV store via /api/saved-credit
// (its OWN prefix, so it never collides with Wire Legal's saved items) with
// localStorage as an instant cache / offline fallback. Mirrors the Legal app.
const SAVEDC_API = "/api/saved-credit";
let savedCloud = false;
let savedPushTimer = null;
function setSavedC(set) { try { localStorage.setItem(SAVEDC_KEY, JSON.stringify([...set])); } catch { /* ignore */ } pushSavedC(); }
function toggleSavedC(id) { const s = getSavedC(); s.has(id) ? s.delete(id) : s.add(id); setSavedC(s); return s.has(id); }
// Debounced push to the cloud (no-op when not signed in / not on Cloudflare).
function pushSavedC() {
  if (!savedCloud) return;
  clearTimeout(savedPushTimer);
  savedPushTimer = setTimeout(() => {
    fetch(SAVEDC_API, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ saved: [...getSavedC()] }) }).catch(() => {});
  }, 400);
}
// On load, UNION this device's saved set with the per-user cloud copy (saving is
// additive), persist locally and push back so devices converge. No-op off-cloud.
async function initSavedSync() {
  let r;
  try { r = await fetch(SAVEDC_API, { headers: { accept: "application/json" } }); }
  catch { return; }
  if (!r || !r.ok) return;
  let d; try { d = await r.json(); } catch { return; }
  savedCloud = true;
  const server = Array.isArray(d.saved) ? d.saved : [];
  const local = [...getSavedC()];
  const union = new Set([...local, ...server]);
  try { localStorage.setItem(SAVEDC_KEY, JSON.stringify([...union])); } catch { /* ignore */ }
  if (union.size !== server.length || server.some((id) => !union.has(id))) pushSavedC();
  router();
}
// Topbar data-freshness line: dataset "last updated" date + the time this view
// was last loaded/refreshed, plus a manual Refresh button that reloads to pull
// the latest deployed data and re-sync the watchlist.
function renderDataStatus() { reportRefresh(LAST_CHECKED, LAST_CHECKED_TIME); }   // v2: app-wide refresh
// Fill the persistent topbar identity area once we know the signed-in user.
// Hidden when not behind Access (device-local mode).
function renderAccountNav() {
  const el = document.getElementById("account-nav");
  if (!el) return;
  if (cloudSync && account) {
    el.innerHTML = `<span class="si-prefix">Signed in as </span><strong>${esc(account)}</strong> · <a href="/cdn-cgi/access/logout">Sign out</a>`;
    el.hidden = false;
  } else {
    el.hidden = true;
  }
}
// ---- Notifications bell: feed items new since the bell was last opened ------
// Lives in the topbar (outside #app), so it persists across every tab. "New" is
// detected by diffing current item ids against the set last acknowledged
// (localStorage) — robust regardless of publication dates.
// "Seen" ids sync per-user across devices via /api/notif-credit (KV keyed on the
// verified Access email), with localStorage as an instant cache / offline
// fallback — so acknowledging items on one device clears them on the others.
const NOTIF_KEY = "meridian.credit.notifSeen";
const NOTIF_API = "/api/notif-credit";
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
// Only surface RECENT updates in the bell — not the entire back-catalogue. Items
// within NOTIF_WINDOW_DAYS of the most recent one qualify; older items (incl. the
// historical backfill, which is real but old-dated) stay fully browsable in the
// feeds but don't flood notifications with things buried far down the lists.
const NOTIF_WINDOW_DAYS = 7;
function notifTime(d) { if (!d) return null; const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : d; const t = Date.parse(s); return isNaN(t) ? null : t; }
function recentNotif(list) {
  const times = list.map((x) => notifTime(x.date)).filter((t) => t != null);
  if (!times.length) return list;
  const cutoff = Math.max(...times) - NOTIF_WINDOW_DAYS * 864e5;
  return list.filter((x) => { const t = notifTime(x.date); return t != null && t >= cutoff; });
}
function notifItems() {
  const out = [];
  deals.forEach((d) => out.push({ id: "d:" + d.id, date: d.date || "", kind: d.type, title: d.headline, source: creditSource(d), href: d.managerId ? "#/manager/" + d.managerId : "#/" }));
  intel.forEach((i) => out.push({ id: "i:" + i.id, date: i.date || "", kind: i.type, title: i.headline, source: creditSource(i), href: i.managerId ? "#/manager/" + i.managerId : "#/" }));
  managers.forEach((m) => (m.webNews || []).forEach((w) => out.push({ id: "w:" + m.id + ":" + (w.url || w.title), date: w.date || "", kind: "News", title: w.title, source: w.outlet || m.name || "", href: "#/manager/" + m.id + "?focus=k:" + encodeURIComponent(feedDedupKey(w)) })));
  return recentNotif(out).sort((a, b) => String(b.date).localeCompare(String(a.date)));
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
  const seenSet = notifSeen ? new Set(notifSeen) : null;
  const fresh = seenSet ? all.filter((x) => !seenSet.has(x.id)) : [];
  const n = fresh.length;
  const list = (n ? fresh : all).slice(0, 12);
  wrap.innerHTML = `
    <button type="button" class="notif-bell" id="notif-bell" aria-haspopup="true" aria-expanded="false" aria-label="Notifications${n ? ` — ${n} new` : ""}">
      <span class="notif-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>${n ? `<span class="notif-badge">${n > 9 ? "9+" : n}</span>` : ""}
    </button>
    <div class="notif-panel" id="notif-panel" role="menu" hidden>
      <div class="notif-head">${n ? `${n} new update${n > 1 ? "s" : ""}` : "No new updates"} <span class="muted small">· checked ${esc(fmtDate(LAST_CHECKED))}${LAST_CHECKED_TIME ? `, ${esc(LAST_CHECKED_TIME)}` : ""}</span></div>
      <ul class="notif-list">
        ${list.length ? list.map((x) => `<li class="notif-item${(n && fresh.includes(x)) ? " is-new" : ""}">
          <a href="${x.href}" ${x.goto ? `data-goto="${esc(x.goto)}"` : ""} class="nf-row">
            <span class="nf-title">${esc(x.title)}</span>
            <span class="nf-meta"><span class="nf-code credit">CRD</span>${x.date ? `<span class="nf-time">${esc(fmtDate(x.date))}</span>` : ""}${x.source ? `<span class="nf-sep">·</span><span class="nf-src">${esc(x.source)}</span>` : ""}</span>
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
  panel.addEventListener("click", (e) => {
    const a = e.target.closest("[data-goto]");
    if (a) { const [view, id] = a.getAttribute("data-goto").split(":"); setPendingFocus({ view, id }); }
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
    ? [...new Set([...local, ...(serverSeen || [])])]
    : allIds;
  notifSeen = baseline;
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(baseline)); } catch { /* */ }
  if (notifCloud && (!serverSeen || baseline.length !== serverSeen.length)) {
    fetch(NOTIF_API, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ seen: baseline }) }).catch(() => {});
  }
  renderNotifications();
}
// Close the panel on outside-click and on navigation. When the panel is OPEN, the
// first tap outside it should only dismiss the menu — consume it in the capture
// phase so it doesn't also click through to a link/button on the page behind.
on(document, "click", (e) => {
  const panel = document.getElementById("notif-panel");
  const isOpen = panel && !panel.hasAttribute("hidden");
  if (isOpen && !e.target.closest("#notif")) { e.preventDefault(); e.stopPropagation(); closeNotif(); }
}, true);
on(window, "hashchange", closeNotif);

// devices; if the server is empty but this device has items, migrate them up.
async function initWatchlistSync() {
  let r;
  try { r = await fetch(WATCHLIST_API, { headers: { accept: "application/json" } }); }
  catch { return; }            // offline / not on Cloudflare → localStorage only
  if (!r || !r.ok) return;     // 404 on static hosting, 401 if not authed
  let d; try { d = await r.json(); } catch { return; }
  cloudSync = true;
  account = d.email || null;
  // Remember verified sign-in so the Glance home can render optimistically
  // (skip its "Checking your sign-in…" splash) when the user navigates there.
  if (d.email) { try { localStorage.setItem("m_signed_in", "1"); } catch { /* ignore */ } }
  renderAccountNav();
  const sv = d.watchlist || {};
  const svCount = FOLLOW_TYPES.reduce((n, t) => n + ((sv[t] || []).length), 0);
  if (svCount > 0) {
    FOLLOW_TYPES.forEach((t) => (follows[t] = Array.isArray(sv[t]) ? sv[t] : []));
    persistLocal();
  } else if (followCount() > 0) {
    pushRemote();              // first-time migration of this device's list
  }
  router();                    // re-render with synced data + account chip
}


// --------------------------- simple filter state ---------------------------
// Persists per-view filter selections across re-renders within a session.
// Dropdown filters hold ARRAYS of selected values (multi-select). An empty
// array means "All". `period` stays a single string (chart drill-down).
const filterState = {
  funds: { q: "", strategy: [], status: ["in-market"], geo: [], period: "", sort: { key: "status", dir: "asc" } },
  managers: { q: "", strategy: [], location: [], sort: { key: "name", dir: "asc" } },
  lps: { q: "", type: [], strategy: [], sort: { key: "name", dir: "asc" } },
  intel: { q: "", type: [], year: [] },
  deals: { q: "", type: [], year: [], period: "" },
  clos: { q: "", kind: [], year: [], period: "" },
  news: { q: "", src: "" },
};

// Calendar year (string) from an item's date; "" if none.
const yearOf = (d) => (String(d).match(/^(\d{4})/) || [])[1] || "";


// ---- Mobile filter collapse -------------------------------------------------
// On phones, filter bars are collapsed behind a "Filters" toggle to save space.
// mfOpen() seeds the toggle: always open on desktop; collapsed by default on
// mobile until the user opens it (then the choice persists across re-renders).
const MOBILE_Q = "(max-width: 760px)";
let mFiltersOpen = null; // null => use the mobile default (collapsed)
function mfOpen() {
  if (!window.matchMedia(MOBILE_Q).matches) return true; // desktop: always expanded
  return mFiltersOpen === null ? false : mFiltersOpen;    // mobile: collapsed by default
}
// "Load more" reveals the next page and re-renders in place (keeps scroll).
on(document, "click", (e) => {
  const b = e.target.closest(".load-more");
  if (!b) return;
  const key = b.getAttribute("data-more");
  pageShown[key] = pageCount(key) + PAGE;
  const y = window.scrollY;
  router();
  window.scrollTo(0, y);
});

// ---- Target focus (€1–10bn AUM) --------------------------------------------
// A global toggle that narrows the News/Deals/Fundraising/CLOs/Managers pages to
// managers (or content whose manager sits) in the €1–10bn AUM band. Persists.
let targetFocus = false;
try { targetFocus = localStorage.getItem("meridian.focus") === "1"; } catch { /* ignore */ }
const inFocusAum = (aum) => aum != null && aum >= 1 && aum <= 10;
// Gate on total group/parent AUM, not the (often credit-only) sleeve figure, so
// a boutique inside a large group falls outside the €1–10bn target band. Banks/
// originators (notAum) carry no AUM and never qualify.
const focusAumOf = (m) => (!m || m.notAum ? null : (m.aumTotal != null ? m.aumTotal : m.aum));
const mInFocus = (m) => inFocusAum(focusAumOf(m));
const midInFocus = (mid) => mInFocus(managerById[mid]);
function focusToggle() {
  return `<label class="focus-toggle"><input type="checkbox" class="focus-cb" ${targetFocus ? "checked" : ""} aria-label="Target focus: €1–10bn AUM managers"><span class="focus-sw" aria-hidden="true"></span><span>Target focus <span class="muted">· €1–10bn AUM</span></span></label>`;
}
// Toggling re-renders the current page with the focus filter applied.
on(document, "change", (e) => {
  const cb = e.target.closest(".focus-cb");
  if (!cb) return;
  targetFocus = cb.checked;
  try { localStorage.setItem("meridian.focus", targetFocus ? "1" : "0"); } catch { /* ignore */ }
  const y = window.scrollY;
  router();
  window.scrollTo(0, y);
});

// Which multi-select popover (if any) is open — kept open across re-renders.
let openMs = null;

// Dashboard quarterly-trend window (indices into the 40-quarter range). null =>
// default to the last 8 quarters (2 years). Persists across re-renders.
const trendState = { start: null, end: null };
// Independent window for the CLOs page's by-quarter chart.
const cloTrendState = { start: null, end: null };

// --------------------------- column-header sorting -------------------------
// Per-view accessor maps: column key -> { type, get(row) }. `type:"num"` sorts
// numerically (nulls last), otherwise alphabetical via localeCompare.
const SORT_COLUMNS = {
  funds: {
    name: { type: "txt", get: (x) => x.name },
    manager: { type: "txt", get: (x) => managerById[x.managerId].name },
    strategy: { type: "txt", get: (x) => x.strategy },
    geo: { type: "txt", get: (x) => x.geoFocus },
    status: { type: "num", get: (x) => FUND_CATEGORIES.indexOf(fundCategory(x)) },
    target: { type: "num", get: (x) => (x.evergreen ? null : x.targetSize) },
    progress: { type: "num", get: (x) => x.raised },
  },
  managers: {
    name: { type: "txt", get: (m) => m.name },
    hq: { type: "txt", get: (m) => m.hq },
    aumTotal: { type: "num", get: (m) => (m.notAum ? null : (m.aumTotal != null ? m.aumTotal : m.aum)) },
    aumCredit: { type: "num", get: (m) => (m.aumCredit != null ? m.aumCredit : null) },
    funds: { type: "num", get: (m) => fundsByManager(m.id).length },
    live: { type: "num", get: (m) => fundsByManager(m.id).filter((x) => !x.evergreen && !x.lifecycle && x.status !== "Final Close").length },
  },
  lps: {
    name: { type: "txt", get: (l) => l.name },
    type: { type: "txt", get: (l) => l.type },
    hq: { type: "txt", get: (l) => l.hq },
    aum: { type: "num", get: (l) => l.aum },
    pc: { type: "num", get: (l) => l.pcAllocationPct },
    ticket: { type: "num", get: (l) => l.typicalTicket },
    mandate: { type: "txt", get: (l) => l.mandateStatus },
  },
};

// Sort rows per the view's current { key, dir }; missing/empty values sort last.
function applySort(rows, view) {
  const s = filterState[view].sort || (filterState[view].sort = { key: "name", dir: "asc" });
  const col = SORT_COLUMNS[view] && SORT_COLUMNS[view][s.key];
  if (!col) return rows;
  const mult = s.dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = col.get(a), vb = col.get(b);
    const ea = va == null || va === "", eb = vb == null || vb === "";
    if (ea && eb) return 0;
    if (ea) return 1;           // empties always last
    if (eb) return -1;
    if (col.type === "num") return (va - vb) * mult;
    return String(va).localeCompare(String(vb)) * mult;
  });
}

// A clickable, sort-aware <th>. Shows ▲/▼ on the active column.
function sortTh(view, key, label, extraClass = "") {
  const s = filterState[view].sort;
  const active = s.key === key;
  const arrow = active ? (s.dir === "asc" ? " ▲" : " ▼") : "";
  return `<th class="sortable${active ? " active" : ""}${extraClass ? " " + extraClass : ""}" data-sortcol="${view}:${key}" role="button" tabindex="0" aria-sort="${active ? (s.dir === "asc" ? "ascending" : "descending") : "none"}">${esc(label)}${arrow}</th>`;
}

// ================================ DASHBOARD =================================
// The key rates & credit-spreads band was moved to the Glance landing page, so
// the Credit dashboard opens straight into the KPI metrics and activity feeds.

function viewDashboard() {
  // Credit-only universe for the headline aggregates (equity-strategy funds are
  // tracked and listed elsewhere but excluded from private-credit market stats).
  // The Target-focus toggle narrows every aggregate/feed below to managers in the
  // €1–10bn AUM band.
  const creditFunds = funds.filter((f) => !targetFocus || midInFocus(f.managerId));
  const nowD = new Date();
  const curQ = `${nowD.getFullYear()}-Q${Math.floor(nowD.getMonth() / 3) + 1}`;
  const quarterOf = (d) => { const m = /^(\d{4})-(\d{2})/.exec(d || ""); return m ? `${m[1]}-Q${Math.floor((+m[2] - 1) / 3) + 1}` : null; };
  // CLO items are carved out into #/clos, so they're excluded from the Deal
  // Activity and Fundraising aggregates/feeds on the dashboard too.
  const dealsNoClo = deals.filter((d) => !d.clo && (!targetFocus || midInFocus(d.managerId)));
  const intelNoClo = intel.filter((i) => !i.clo && (!targetFocus || midInFocus(i.managerId)));

  // ---- headline KPIs ----
  const dealsThisQuarter = dealsNoClo.filter((d) => quarterOf(d.date) === curQ).length;
  const openProcesses = creditFunds.filter((f) => !f.evergreen && (f.status === "Open" || f.status === "First Close")).length;
  const closesThisQuarter = creditFunds.filter((f) => isClose(f) && fundQuarter(f) === curQ).length;
  const cloClosesThisQuarter = [...deals.filter((d) => d.clo), ...intel.filter((i) => i.clo)]
    .filter((c) => (!targetFocus || midInFocus(c.managerId)) && quarterOf(c.date) === curQ).length;
  const kpis = [
    { label: "Deals this quarter", value: dealsThisQuarter, sub: curQ, jump: 'data-jump="deals"' },
    { label: "Open fundraising processes", value: openProcesses, sub: "funds currently in market", jump: 'data-jump="funds" data-status="in-market"' },
    { label: "Fundraising closes this quarter", value: closesThisQuarter, sub: curQ, jump: `data-jump="funds" data-period="${curQ}"` },
    { label: "CLO closes this quarter", value: cloClosesThisQuarter, sub: curQ, jump: 'data-jump="clos"' },
  ];

  // ---- latest feeds (headlines + links only; click → item on its feed page) ----
  const dealsByDate = [...dealsNoClo].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const intelByDate = [...intelNoClo].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  // CLO items live in their own #/clos section; surface the most recent here too.
  const cloByDate = [...deals.filter((d) => d.clo), ...intel.filter((i) => i.clo)]
    .filter((c) => !targetFocus || midInFocus(c.managerId))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  // Latest press across the tracked universe (manager news + webNews), deduped.
  const newsByDate = aggregateNews().filter((x) => !targetFocus || midInFocus(x._mid));
  // Match the deal/fundraising sleeves: the headline opens the item in the News
  // tab, with a link to the original source below it.
  const newsCompact = (x) => {
    const src = x.url ? ` · <a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" class="muted small">source</a>` : "";
    const mgr = x._mid && x._mname ? ` · ${link(`#/manager/${x._mid}`, x._mname, "compact-mgr")}` : (x._mname ? ` · ${esc(x._mname)}` : "");
    return `<li class="compact-item"><a href="#/news" data-goto="news:${x._id}" class="compact-head">${esc(x.title)}</a><div class="compact-meta muted small">${x.date ? esc(fmtDate(x.date)) : ""}${mgr}${x.outlet ? ` · ${esc(x.outlet)}` : ""}${src}</div></li>`;
  };
  // ---- combined "Latest activity" feed: manager press + deals + fundraising +
  // CLO items, newest first. An event captured BOTH as press and as a structured
  // deal/intel record (same source URL) collapses to one row: the structured
  // records are added first so they win the dedup and link to their categorised
  // feed; genuinely press-only items (results, commentary, events) still appear.
  const activity = [];
  const seenAct = new Set();
  const pushAct = (item, kind, view) => {
    const k = feedDedupKey(item);
    if (seenAct.has(k)) return;
    seenAct.add(k);
    activity.push({ item, kind, view });
  };
  dealsByDate.forEach((d) => pushAct(d, "deal", "deals"));
  intelByDate.forEach((i) => pushAct(i, "intel", "intel"));
  cloByDate.forEach((c) => pushAct(c, "clo", "clos"));
  newsByDate.forEach((x) => pushAct(x, "news", "news"));
  // Credit research / white papers become the "Commentary" kind in the wire.
  [...(research || [])].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    .forEach((r) => pushAct(r, "comm", "research"));
  activity.sort((a, b) => String(b.item.date || "").localeCompare(String(a.item.date || "")));
  const activityCompact = (a) => a.kind === "news" ? newsCompact(a.item) : compactRow(a.item, a.view);

  // ---- dense terminal screen ----------------------------------------------
  // Metrics ticker + manager league table (left) + a filterable activity wire
  // (centre) + fundraising pipeline and recent CLOs (right) — everything that
  // used to be spread across News/Deals/Fundraising/CLOs/Managers on one screen.
  const inMkt = (f) => !f.evergreen && (f.status === "Open" || f.status === "First Close");
  const mgrFundList = (id) => funds.filter((f) => f.managerId === id);
  const uni = managers.filter((m) => !targetFocus || midInFocus(m.id));
  // League table shows the FULL manager universe ranked by credit AUM; its own
  // €1–10bn toggle filters it in place (independent of the page-level focus).
  // AUM = the manager's total AUM (aumTotal ?? aum), the same measure the old
  // Managers table and the €1–10bn band use — aumCredit is missing for many.
  const league = [...managers]
    .map((m) => ({ m, aum: focusAumOf(m), nf: mgrFundList(m.id).length, live: mgrFundList(m.id).filter(inMkt).length, focus: mInFocus(m) }))
    .sort((a, b) => (b.aum == null ? -1 : b.aum) - (a.aum == null ? -1 : a.aum));
  const pipeline = creditFunds.filter(inMkt).sort((a, b) => (b.targetSize || 0) - (a.targetSize || 0)).slice(0, 12);
  const totalAum = uni.reduce((s, m) => s + (focusAumOf(m) || 0), 0);
  const metrics = [
    ["Deals " + curQ, dealsThisQuarter], ["Open funds", openProcesses],
    ["Closes " + curQ, closesThisQuarter], ["CLO closes " + curQ, cloClosesThisQuarter],
    ["Managers", uni.length], ["Funds", creditFunds.length],
    ["AUM", fmtAum(Math.round(totalAum))],
  ];
  // Normalise the activity stream into the shared wire's item shape: the Credit
  // desk taxonomy (deal→DEAL, intel→FUND, clo→CLO, news→NEWS, research→COMM)
  // maps to the shared code chips; the source (outlet, else manager) becomes the
  // in-place source-filter, exactly like the Home wire. Credit items carry a date
  // but rarely a time, so most rows lead with the "12:00" default (as on Home).
  const KIND_DESK = { deal: "deal", intel: "fund", clo: "clo", news: "news", comm: "comm" };
  const wireItems = activity.slice(0, 120).map((a) => {
    const rec = a.item, isNews = a.kind === "news";
    if (a.kind === "comm") {
      return { desk: "comm", href: rec.url || "#/", ext: !!rec.url, title: rec.title,
        src: rec.institution || "", date: rec.date || "", time: rec.time || "" };
    }
    const title = isNews ? rec.title : rec.headline;
    const mid = isNews ? rec._mid : rec.managerId;
    const mname = mid && managerById[mid] ? managerById[mid].name : (isNews ? (rec._mname || "") : "");
    const url = isNews ? rec.url : rec.sourceUrl;
    const src = isNews ? (rec.outlet || mname || "") : creditSource(rec);
    return { desk: KIND_DESK[a.kind] || "news", href: url || (mid ? `#/manager/${mid}` : "#/"),
      ext: !!url, title, src, date: rec.date || "", time: rec.time || "", mgr: mid || "" };
  });
  // NO live-wire fold here: the cross-desk /api/feed stream carries no
  // credit-desk stories (its labels are MAC/BBG/ECON/FT/SUBS/NEWS), so folding
  // it in just made this All tab a mirror of the Home newsfeed. Credit's All
  // is the CREDIT desk: deals, fundraising, CLOs, manager news, research.
  // Hedge-fund news (HEDGE_INTEL) folds into the wire under its own HDG desk so
  // the 30 hedge funds surface in the Credit stream, tagged distinctly from the
  // private-credit desks. Rows open the source article; the fund's own page
  // lives under the Hedge Funds tab.
  (HEDGE_INTEL || []).forEach((h) => {
    const hf = HEDGE_FUNDS.find((x) => x.id === h.hfId);
    wireItems.push({ desk: "hdg", href: h.url || (hf ? `#/hf/${hf.id}` : "#/"), ext: !!h.url,
      title: h.headline, src: h.outlet || (hf ? hf.name : ""), date: h.date || "", time: h.time || "", mgr: "" });
  });
  const wireAll = [...wireItems].sort(byFeedDesc);
  // Deals/CLO share the "Deals" chip; intel is "Fundraising"; news/comm live only
  // under "All". Source filter (row click) overrides the chip, as on Home.
  const CR_GROUP = { deal: "deals", clo: "deals", fund: "fundraising" };
  const crGroupOf = (it) => CR_GROUP[it.desk] || it.desk;
  let crGroup = "all", crSrc = null;
  const paintCreditWire = () => {
    const wrap = document.getElementById("cr-dash-wire");
    if (!wrap) return;
    let list = wireAll;
    if (crSrc) list = list.filter((x) => x.src === crSrc);
    else if (crGroup !== "all") list = list.filter((x) => crGroupOf(x) === crGroup);
    const body = list.length ? feedBodyHTML(list) : feedEmptyHTML(crSrc ? `No ${crSrc} stories — check back shortly.` : "No recent items.");
    wrap.innerHTML = (crSrc ? feedSrcBarHTML(crSrc) : "") + body;
  };

  // Credit tab = the manager universe ranked by AUM. General news now lives on
  // Home; drilling into a manager shows its news / funds / CLOs / people.
  const cloMgrIds = new Set([...deals, ...intel].filter((x) => x.clo && x.managerId).map((x) => x.managerId));
  const fst = filterState.managers;
  const q0 = (fst.q || "").toLowerCase();
  const mrows = league.filter((r) =>
    (!q0 || r.m.name.toLowerCase().includes(q0) || String(r.m.hq || "").toLowerCase().includes(q0))
    && (!fst.strategy.length || fst.strategy.some((s) => r.m.strategies.includes(s))));
  const mgrMetrics = [
    ["Managers", managers.length], ["AUM", fmtAum(Math.round(totalAum))],
    ["Funds", funds.length], ["In market", funds.filter(inMkt).length], ["CLO managers", cloMgrIds.size],
  ];
  // SLS (Structured Liquidity Solutions) chips from each manager's sourced
  // `structured` items (data.js). One chip per type present, fixed order; the
  // tooltip carries every item's label, note and attribution. No sourced item
  // → em-dash (a sparse column is correct — chips are never inferred here).
  const SLS_ORDER = ["NAV", "SRT", "CFO", "CONT", "OTH"];
  const slsChips = (m) => {
    const items = m.structured || [];
    if (!items.length) return "—";
    return SLS_ORDER.filter((t) => items.some((s) => s.type === t)).map((t) => {
      const ofType = items.filter((s) => s.type === t);
      const tip = ofType.map((s) => `${s.label} — ${s.note} (${s.outlet}, ${s.date})`).join(" · ");
      // Click → straight to the source article (newest item of the type opens in
      // a new tab; the tooltip lists them all). An <a>, so the row's data-href
      // navigation defers to it.
      const src = ofType.slice().sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))[0];
      return `<a class="sls-chip" href="${esc(src.url)}" target="_blank" rel="noopener noreferrer" title="${esc(tip)}">${esc(t)}</a>`;
    }).join("");
  };
  const mgrRow = (r) => `<tr class="clickable" data-href="#/manager/${r.m.id}" data-focus="${r.focus ? 1 : 0}" data-name="${esc((r.m.name + " " + (r.m.hq || "")).toLowerCase())}">`
    + `<td class="tl-nm">${esc(r.m.name)}</td>`
    + `<td class="tl-hq">${esc(r.m.hq || "")}</td>`
    + `<td class="tl-n">${r.aum == null ? "n/a" : esc(fmtAum(r.aum))}</td>`
    + `<td class="tl-n">${r.m.aumCredit != null ? esc(fmtAum(r.m.aumCredit)) : "—"}</td>`
    + `<td class="tl-n">${r.nf}</td>`
    + `<td class="tl-n">${r.live || ""}</td>`
    + `<td class="tl-cl">${cloMgrIds.has(r.m.id) ? "●" : ""}</td>`
    + `<td class="tl-sls">${slsChips(r.m)}</td></tr>`;
  // Hedge Funds league table — largest managers across US / UK / Europe, sorted
  // by (approximate) AUM. Rows open the firm's own site in a new tab.
  const hfRows = [...HEDGE_FUNDS].sort((a, b) => (b.aum || 0) - (a.aum || 0));
  // Live-linked source URLs in the row: the AUM figure opens its citable source,
  // the Latest-13F cell opens the fund's most recent SEC 13F filing list (or, for
  // a non-US filer, the equivalent EDGAR/registry filing). The row itself (empty
  // space) opens the in-app fund detail with the live top-10 holdings.
  const hfSec = (cik) => `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=13F-HR&dateb=&owner=include&count=40`;
  const hfAum = (f) => f.aum == null ? "—"
    : (f.aumSource
      ? `<a href="${esc(f.aumSource)}" target="_blank" rel="noopener noreferrer" title="AUM source (${esc(f.aumAsOf || "")})">$${esc(f.aum.toFixed(2))}bn</a>`
      : `$${esc(f.aum.toFixed(2))}bn`);
  const hfFiling = (f) => f.cik
    ? `<a href="${esc(hfSec(f.cik))}" target="_blank" rel="noopener noreferrer" title="Latest SEC 13F-HR (CIK ${esc(f.cik)})">13F-HR</a>`
    : (f.filing
      ? `<a href="${esc(f.filing.url)}" target="_blank" rel="noopener noreferrer" title="Latest filing (no US 13F-HR)">${esc(f.filing.label)}</a>`
      : `<span class="muted">—</span>`);
  const hfRow = (f) => `<tr class="clickable" data-href="#/hf/${esc(f.id)}" data-name="${esc((f.name + " " + f.hq + " " + f.strategy + " " + f.region).toLowerCase())}">`
    + `<td class="tl-nm">${esc(f.name)}</td>`
    + `<td class="tl-hq">${esc(f.hq)}</td>`
    + `<td>${esc(f.region)}</td>`
    + `<td class="tl-aum">${hfAum(f)}</td>`
    + `<td>${esc(f.strategy)}</td>`
    + `<td class="tl-fil">${hfFiling(f)}</td>`
    + `<td>${f.founded || "—"}</td>`
    + `<td>${esc(f.founder || "—")}</td></tr>`;
  app.innerHTML = `
    <div class="tdash">
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <header class="tpanel-h twire-head">
            <div class="tchips" id="cr-dash-tabs">
              <button type="button" class="tchip is-on" data-p="all">All</button>
              <button type="button" class="tchip" data-p="deals">Deals</button>
              <button type="button" class="tchip" data-p="fundraising">Fundraising</button>
              <button type="button" class="tchip" data-p="managers">Managers</button>
              <button type="button" class="tchip" data-p="hedgefunds">Hedge Funds</button>
            </div>
          </header>
          <div class="tpanes" id="cr-dash-panes">
            <div class="tpane g-feed-wrap" data-pane="wire">
              <div class="g-feed twire" id="cr-dash-wire">${wireAll.length ? feedBodyHTML(wireAll) : feedEmptyHTML("No recent items.")}</div>
            </div>
            <div class="tpane" data-pane="managers" hidden>
              <header class="tpanel-h thead-search"><span>Managers</span>
                <input type="search" id="mgr-q" class="tsearch" placeholder="Search name or HQ…" value="${esc(fst.q || "")}" aria-label="Search managers">
                <button type="button" class="tfocus-btn" id="cr-lg-focus" aria-pressed="false" title="Show only €1–10bn AUM managers">€1–10bn</button>
              </header>
              <div class="tleague-wrap">
              <table class="tleague tleague-full">
                <thead><tr><th>Manager</th><th class="tl-hq">HQ</th><th>AUM</th><th>Credit&nbsp;AUM</th><th>Funds</th><th>In&nbsp;mkt</th><th>CLOs</th><th class="tl-sls" title="Structured Liquidity Solutions">SLS</th></tr></thead>
                <tbody id="mgr-rows">${mrows.map(mgrRow).join("")}</tbody>
              </table>
              </div>
              <p class="tl-sls-key muted small">SLS = Structured Liquidity Solutions — NAV: NAV / fund-level financing · SRT: significant/synthetic risk transfer · CFO: collateralised fund obligation · CONT: continuation fund / vehicle · OTH: other structured liquidity (secondaries platform, fund finance). Every chip is backed by a cited article (hover for the source; the articles sit in that manager's news). — = none found in public coverage.</p>
            </div>
            <div class="tpane" data-pane="hedgefunds" hidden>
              <header class="tpanel-h thead-search"><span>Hedge Funds</span>
                <input type="search" id="hf-q" class="tsearch" placeholder="Search name, HQ or strategy…" aria-label="Search hedge funds">
              </header>
              <div class="tleague-wrap">
              <table class="tleague tleague-full tleague-hf">
                <thead><tr><th>Fund</th><th class="tl-hq">HQ</th><th>Region</th><th class="tl-aum">AUM&nbsp;$bn</th><th>Strategy</th><th class="tl-fil">Latest&nbsp;13F</th><th>Founded</th><th>Founder</th></tr></thead>
                <tbody id="hf-rows">${hfRows.map(hfRow).join("")}</tbody>
              </table>
              </div>
              <p class="tl-sls-key muted small">The largest hedge-fund managers across the US, UK &amp; Europe, by AUM. <strong>AUM is US$bn and approximate</strong> — latest widely-reported public figures (firm-wide, indicative only; hedge funds do not disclose AUM uniformly), each with a source on the fund page. As of ${esc(HEDGE_FUNDS_ASOF)}. Click a row for AUM sources, strategy, performance and live SEC 13F top-10 holdings.</p>
            </div>
          </div>
        </section>
      </div>
    </div>`;
  // All shows the whole wire (news + commentary merged in); Deals filters to
  // deal/CLO rows, Fundraising to fund (intel) rows; Managers swaps to the table.
  // Filtering re-renders the shared wire (so day headers + source filter stay
  // correct) rather than toggling row display.
  const dashTabs = document.getElementById("cr-dash-tabs");
  const crSetActive = (p) => dashTabs && dashTabs.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c.dataset.p === p));
  if (dashTabs) dashTabs.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    const p = b.dataset.p || "all";
    crSetActive(p);
    _chipMem[chipMemKey("cr-dash-tabs")] = p;
    const wirePane = document.querySelector('#cr-dash-panes [data-pane="wire"]');
    const mgrPane = document.querySelector('#cr-dash-panes [data-pane="managers"]');
    const hfPane = document.querySelector('#cr-dash-panes [data-pane="hedgefunds"]');
    if (p === "managers") { wirePane.hidden = true; hfPane.hidden = true; mgrPane.hidden = false; return; }
    if (p === "hedgefunds") { wirePane.hidden = true; mgrPane.hidden = true; hfPane.hidden = false; return; }
    mgrPane.hidden = true; hfPane.hidden = true; wirePane.hidden = false;
    crGroup = p; crSrc = null; paintCreditWire();
  });
  // Clicking a source name filters the wire to that newsroom (Home-style),
  // resetting the chip to All and showing the clearable source bar.
  attachFeedClicks(document.getElementById("cr-dash-wire"), {
    onSrc: (s) => { crSrc = s; crGroup = "all"; crSetActive("all"); paintCreditWire(); },
    onClearSrc: () => { crSrc = null; paintCreditWire(); },
  });
  // Re-select the in-page tab after every render — async syncs re-run this
  // template with All hardcoded (the same kick the Macro main tabs had).
  if (dashTabs) {
    const k0 = _chipMem[chipMemKey("cr-dash-tabs")];
    const b0 = k0 && k0 !== "all" ? dashTabs.querySelector(`.tchip[data-p="${k0}"]`) : null;
    if (b0 && !b0.classList.contains("is-on")) b0.click();
  }
  const qi = document.getElementById("mgr-q");
  if (qi) qi.addEventListener("input", () => {
    filterState.managers.q = qi.value;
    const v = qi.value.toLowerCase().trim();
    document.querySelectorAll("#mgr-rows tr").forEach((tr) => { tr.style.display = (!v || (tr.dataset.name || "").includes(v)) ? "" : "none"; });
  });
  const lf = document.getElementById("cr-lg-focus");
  if (lf) lf.addEventListener("click", () => {
    const on = lf.getAttribute("aria-pressed") !== "true";
    lf.setAttribute("aria-pressed", on ? "true" : "false");
    lf.classList.toggle("is-on", on);
    document.querySelectorAll("#mgr-rows tr").forEach((tr) => { tr.style.display = (!on || tr.dataset.focus === "1") ? "" : "none"; });
  });
  const hq = document.getElementById("hf-q");
  if (hq) hq.addEventListener("input", () => {
    const v = hq.value.toLowerCase().trim();
    document.querySelectorAll("#hf-rows tr").forEach((tr) => { tr.style.display = (!v || (tr.dataset.name || "").includes(v)) ? "" : "none"; });
  });
}
// In-place filter for the dashboard activity wire: chips toggle which kinds show
// without leaving the screen (the collapsed News/Deals/Fundraising/CLOs tabs).
function wireDashChips() {
  const chips = document.getElementById("cr-chips");
  const wire = document.getElementById("cr-wire");
  if (!chips || !wire) return;
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip");
    if (!b) return;
    chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    const k = b.dataset.k;
    wire.querySelectorAll(".tw-row").forEach((r) => { r.style.display = (k === "all" || r.dataset.kind === k) ? "" : "none"; });
    syncDayRows(wire);
  });
  const lf = document.getElementById("cr-lg-focus");
  if (lf) lf.addEventListener("click", () => {
    const on = lf.getAttribute("aria-pressed") !== "true";
    lf.setAttribute("aria-pressed", on ? "true" : "false");
    lf.classList.toggle("is-on", on);
    document.querySelectorAll(".tleague tbody tr").forEach((r) => { r.style.display = (!on || r.dataset.focus === "1") ? "" : "none"; });
  });
}

// ================================== FUNDS ===================================
// Multi-select dropdown. `viewKey` is "view:key" (e.g. "funds:strategy").
// `options` are strings, or {value,label} objects. `selected` is an array.
function multiFilter(viewKey, label, options, selected) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const n = selected.length;
  const summary = n === 0 ? "All" : (n === 1 ? (opts.find((o) => o.value === selected[0]) || { label: selected[0] }).label : `${n} selected`);
  return `<div class="filter ms" data-ms="${viewKey}">
    <span>${label}</span>
    <button type="button" class="ms-btn" aria-haspopup="true" aria-expanded="false">${esc(summary)} <span class="ms-caret" aria-hidden="true">▾</span></button>
    <div class="ms-pop" hidden>
      ${opts.map((o) => `<label class="ms-opt"><input type="checkbox" value="${esc(o.value)}" ${selected.includes(o.value) ? "checked" : ""}> ${esc(o.label)}</label>`).join("")}
    </div>
  </div>`;
}

// Compact feed row for the dashboard: headline (links to the item on its feed
// page) + date and source only — no summary.
function compactRow(rec, view) {
  const head = `<a href="#/${view}" data-goto="${view}:${rec.id}" class="compact-head">${esc(rec.headline)}</a>`;
  const m = rec.managerId ? managerById[rec.managerId] : null;
  const mgr = m ? ` · ${link(`#/manager/${m.id}`, m.name, "compact-mgr")}` : "";
  const src = rec.sourceUrl ? ` · <a href="${esc(rec.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="muted small">source</a>` : "";
  return `<li class="compact-item">${head}<div class="compact-meta muted small">${fmtDate(rec.date)}${mgr}${src}</div></li>`;
}

// Aggregate manager/investor press (news + webNews) across the universe, deduped,
// newest first. Each item gets a stable `_id` (its position in the deterministic
// build order) so the dashboard and the News tab agree on it — letting a
// dashboard headline deep-link to that item's row (#row-<_id>) in the News feed.
function aggregateNews() {
  const out = [], seen = new Set();
  managers.forEach((m) => {
    [...(m.news || []), ...(m.webNews || [])].forEach((w) => {
      const base = (w.url || w.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/$/, "");
      const k = base + "|" + m.id;
      if (base && seen.has(k)) return;
      seen.add(k);
      out.push({ ...w, _mid: m.id, _mname: m.name, _id: "news-" + out.length });
    });
  });
  return out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}


function fundTable(rows, key, sig) {
  rows = applySort(rows, "funds");
  let more = "";
  if (key) { pageReset(key, sig); const n = pageCount(key); more = loadMoreBtn(key, rows.length - n); rows = rows.slice(0, n); }
  return `<div class="table-wrap"><table class="data-table">
      <thead><tr>${sortTh("funds", "name", "Fund")}${sortTh("funds", "manager", "Manager")}${sortTh("funds", "strategy", "Strategy")}${sortTh("funds", "geo", "Geography")}${sortTh("funds", "status", "Status")}${sortTh("funds", "target", "Target")}</tr></thead>
      <tbody>
        ${rows.map((x) => `<tr class="clickable" data-href="#/fund/${x.id}">
          <td>${nameCell("fund", x.id, `<strong>${esc(x.name)}</strong>`)}</td>
          <td>${link(`#/manager/${x.managerId}`, managerById[x.managerId].name)}</td>
          <td>${esc(x.strategy)}</td>
          <td>${esc(x.geoFocus)}</td>
          <td>${fundStatusChip(x)} ${lifecycleBadge(x)}</td>
          <td>${x.evergreen ? "—" : eur(x.targetSize)}</td>
        </tr>`).join("")}
      </tbody>
    </table></div>` + more;
}

function viewFunds() {
  const f = filterState.funds;
  const inMarket = (x) => !x.evergreen && (x.status === "Open" || x.status === "First Close");
  const rows = funds.filter((x) =>
    (!targetFocus || midInFocus(x.managerId)) &&
    (!f.q || (x.name + managerById[x.managerId].name).toLowerCase().includes(f.q.toLowerCase())) &&
    (!f.strategy.length || f.strategy.includes(x.strategy)) &&
    (!f.status.length || f.status.some((s) => (s === "in-market" ? inMarket(x) : fundCategory(x) === s))) &&
    (!f.geo.length || f.geo.includes(x.geoFocus)) &&
    (!f.period || (isClose(x) && fundQuarter(x) === f.period))
  ).sort((a, b) => a.name.localeCompare(b.name));

  // A single table (like the Managers/Investors tabs), ordered by status so the
  // funds stay grouped by Open / First Close / Final Close / Evergreen /
  // Pre-marketing (the Status column shows each fund's status; the Status filter
  // narrows it) rather than being split into separate section tables.
  const body = rows.length
    ? fundTable(rows)
    : '<p class="empty">No funds match these filters.</p>';

  const periodBanner = f.period
    ? `<div class="active-filter">Showing funds that reached a first/final close in <strong>${esc(f.period)}</strong> <button type="button" class="chip" data-clearfilter="period" title="Clear quarter filter">✕ clear</button></div>`
    : "";

  app.innerHTML = `
    <div class="page-head"><div class="ph-head-top"><h1>Funds in Market</h1>${focusToggle()}</div><p class="muted">${rows.length} of ${funds.length} funds${f.period ? ` · closing ${esc(f.period)}` : ""}</p></div>
    ${periodBanner}
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label><div class="filters">
      <label class="filter search"><span>Search</span><input type="search" data-filter="q" placeholder="Fund or manager…" value="${esc(f.q)}"></label>
      ${multiFilter("funds:strategy", "Strategy", STRATEGIES, f.strategy)}
      ${multiFilter("funds:status", "Status", [{ value: "in-market", label: "In market (Open + First Close)" }, ...FUND_CATEGORIES], f.status)}
      ${multiFilter("funds:geo", "Geography", GEOS, f.geo)}
    </div>
    ${body}`;
  wireFilters("funds");
}


// ================================ MANAGERS ==================================
// Normalise a manager's HQ string to one or more canonical countries/regions so
// the Managers tab can offer a clean "Location" filter. Handles dual HQs
// ("New York, US / London, UK"), abbreviations (UK/FR/DE…) and bare country
// names. "CA" is disambiguated (Montreal → Canada, else California → US).
const HQ_REGION_BY_TOKEN = {
  "uk": "United Kingdom", "united kingdom": "United Kingdom", "london": "United Kingdom", "edinburgh": "United Kingdom",
  "us": "United States", "united states": "United States", "new york": "United States",
  "fr": "France", "france": "France",
  "de": "Germany", "germany": "Germany",
  "it": "Italy", "italy": "Italy",
  "es": "Spain", "spain": "Spain",
  "se": "Sweden", "sweden": "Sweden",
  "fi": "Finland", "finland": "Finland",
  "nl": "Netherlands", "netherlands": "Netherlands",
  "dk": "Denmark", "denmark": "Denmark",
  "ch": "Switzerland", "switzerland": "Switzerland",
  "lu": "Luxembourg", "luxembourg": "Luxembourg",
  "be": "Belgium", "belgium": "Belgium",
  "il": "Israel", "israel": "Israel",
  "uae": "UAE", "canada": "Canada", "australia": "Australia",
  "hong kong": "Hong Kong", "jersey": "Jersey",
};
const HQ_CANADA_CITY = /montreal|toronto|vancouver|calgary|ottawa/;
function hqRegions(hq) {
  const out = [];
  String(hq || "").split("/").forEach((part) => {
    part = part.trim();
    if (!part) return;
    const segs = part.split(",").map((s) => s.trim());
    const last = segs[segs.length - 1].toLowerCase();
    const city = segs.length > 1 ? segs[0].toLowerCase() : "";
    let region;
    if (last === "ca") region = HQ_CANADA_CITY.test(city) ? "Canada" : "United States";
    else region = HQ_REGION_BY_TOKEN[last] || HQ_REGION_BY_TOKEN[part.toLowerCase()] || segs[segs.length - 1];
    if (region && !out.includes(region)) out.push(region);
  });
  return out;
}

function viewManagers() {
  const f = filterState.managers;
  const LOCATIONS = [...new Set(managers.flatMap((m) => hqRegions(m.hq)))].sort();
  const rows = managers.filter((m) =>
    (!targetFocus || mInFocus(m)) &&
    (!f.q || m.name.toLowerCase().includes(f.q.toLowerCase()) || m.hq.toLowerCase().includes(f.q.toLowerCase())) &&
    (!f.strategy.length || f.strategy.some((s) => m.strategies.includes(s))) &&
    (!f.location.length || hqRegions(m.hq).some((r) => f.location.includes(r)))
  );
  const sorted = applySort(rows, "managers");

  app.innerHTML = `
    <div class="page-head"><div class="ph-head-top"><h1>Managers</h1>${focusToggle()}</div><p class="muted">${rows.length} of ${managers.length} GPs</p></div>
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label><div class="filters">
      <label class="filter search"><span>Search</span><input type="search" data-filter="q" placeholder="Name or HQ…" value="${esc(f.q)}"></label>
      ${multiFilter("managers:strategy", "Strategy", STRATEGIES, f.strategy)}
      ${multiFilter("managers:location", "Location", LOCATIONS, f.location)}
    </div>
    <div class="table-wrap"><table class="data-table">
      <thead><tr>${sortTh("managers", "name", "Manager")}${sortTh("managers", "hq", "HQ")}${sortTh("managers", "aumTotal", "Total AUM")}${sortTh("managers", "aumCredit", "Credit AUM")}<th>Strategies</th>${sortTh("managers", "funds", "Funds")}${sortTh("managers", "live", "In market")}</tr></thead>
      <tbody>
        ${sorted.map((m) => {
          const fs = fundsByManager(m.id);
          const live = fs.filter((x) => !x.evergreen && !x.lifecycle && x.status !== "Final Close").length;
          const strat = m.strategies.slice(0, 2).map((s) => chip(s)).join(" ") + (m.strategies.length > 2 ? ` <span class="muted small">+${m.strategies.length - 2}</span>` : "") || '<span class="muted small">—</span>';
          return `<tr class="clickable" data-href="#/manager/${m.id}">
            <td>${nameCell("manager", m.id, `<strong>${esc(m.name)}</strong>`)}</td>
            <td class="muted small">${esc(m.hq)}</td>
            <td>${m.notAum ? '<span class="muted small">n/a</span>' : fmtAum(m.aumTotal != null ? m.aumTotal : m.aum)}</td>
            <td>${m.aumCredit != null ? fmtAum(m.aumCredit) : '<span class="muted small">—</span>'}</td>
            <td>${strat}</td>
            <td>${fs.length}</td>
            <td>${live}</td>
          </tr>`;
        }).join("")}
        ${rows.length === 0 ? '<tr><td colspan="7" class="empty">No managers match these filters.</td></tr>' : ""}
      </tbody>
    </table></div>`;
  wireFilters("managers");
}



// ================================ INVESTORS =================================
function viewLps() {
  const f = filterState.lps;
  const rows = lps.filter((l) =>
    (!f.q || l.name.toLowerCase().includes(f.q.toLowerCase()) || l.hq.toLowerCase().includes(f.q.toLowerCase())) &&
    (!f.type.length || f.type.includes(l.type)) &&
    (!f.strategy.length || f.strategy.some((s) => l.strategies.includes(s)))
  );
  const sorted = applySort(rows, "lps");

  app.innerHTML = `
    <div class="page-head"><h1>Investors / Allocators</h1><p class="muted">${rows.length} of ${lps.length} LPs</p></div>
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label><div class="filters">
      <label class="filter search"><span>Search</span><input type="search" data-filter="q" placeholder="Name or HQ…" value="${esc(f.q)}"></label>
      ${multiFilter("lps:type", "Type", LP_TYPES, f.type)}
      ${multiFilter("lps:strategy", "Interest", STRATEGIES, f.strategy)}
    </div>
    <div class="table-wrap"><table class="data-table">
      <thead><tr>${sortTh("lps", "name", "Investor")}${sortTh("lps", "type", "Type")}${sortTh("lps", "hq", "HQ")}${sortTh("lps", "aum", "AUM")}${sortTh("lps", "pc", "PC alloc.")}${sortTh("lps", "ticket", "Typical ticket")}${sortTh("lps", "mandate", "Mandate")}</tr></thead>
      <tbody>
        ${sorted.map((l) => `<tr class="clickable" data-href="#/lp/${l.id}">
          <td>${nameCell("lp", l.id, `<strong>${esc(l.name)}</strong>`)}</td><td>${esc(l.type)}</td><td>${esc(l.hq)}</td>
          <td>€${l.aum}bn</td><td>${pct(l.pcAllocationPct)}</td><td>${eur(l.typicalTicket)}</td>
          <td>${chip(l.mandateStatus, mandateClass(l.mandateStatus))}</td>
        </tr>`).join("")}
        ${rows.length === 0 ? '<tr><td colspan="7" class="empty">No investors match these filters.</td></tr>' : ""}
      </tbody>
    </table></div>`;
  wireFilters("lps");
}


// Map a credit record (deal / intel / clo / news / comm) to the shared wire's
// item shape so every credit list renders through the ONE feed engine
// (feedBodyHTML → one-line rows + standard day breaks, R5/R6). Mirrors the
// dashboard-wire taxonomy: deal→DEAL, intel→FUND, clo→CLO, news→NEWS, comm→COMM;
// the source (outlet, else manager) becomes the row's source label, and the
// manager id rides along as the row's entity link.
function crToFeed(x, kind) {
  const k = kind || x._kind || "intel";
  if (k === "comm") {
    return { desk: "comm", href: x.url || "#/", ext: !!x.url, title: x.title, src: x.institution || "", date: x.date || "", time: x.time || "" };
  }
  if (k === "news") {
    const mid = x._mid;
    const mname = mid && managerById[mid] ? managerById[mid].name : (x._mname || "");
    return { desk: "news", href: x.url || (mid ? `#/manager/${mid}` : "#/"), ext: !!x.url, title: x.title, src: x.outlet || mname || "", date: x.date || "", time: x.time || "", mgr: mid || "" };
  }
  const mid = x.managerId, url = x.sourceUrl;
  const desk = x.clo ? "clo" : ({ deal: "deal", intel: "fund" }[k] || "fund");
  return { desk, href: url || (mid ? `#/manager/${mid}` : "#/"), ext: !!url, title: x.headline, src: creditSource(x), date: x.date || "", time: x.time || "", mgr: mid || "" };
}
function crFeed(rows, kind) { return `<div class="g-feed twire">${feedBodyHTML(rows.map((x) => crToFeed(x, kind)))}</div>`; }

// =============================== INTELLIGENCE ===============================

function viewIntel() {
  const f = filterState.intel;
  // CLO fundraising/platform news is carved out into its own #/clos section.
  const base = intel.filter((i) => !i.clo && (!targetFocus || midInFocus(i.managerId)));
  const rows = base.filter((i) =>
    (!f.q || (i.headline + i.summary).toLowerCase().includes(f.q.toLowerCase())) &&
    (!f.type.length || f.type.includes(i.type)) &&
    (!f.year.length || f.year.includes(yearOf(i.date)))
  ).sort((a, b) => String(b.date).localeCompare(String(a.date))); // newest first

  app.innerHTML = `
    <div class="page-head"><div class="ph-head-top"><h1>Fundraising Intelligence</h1>${focusToggle()}</div><p class="muted">${rows.length} of ${base.length} items · European private credit capital formation</p></div>
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label><div class="filters">
      <label class="filter search"><span>Search</span><input type="search" data-filter="q" placeholder="Keyword…" value="${esc(f.q)}"></label>
      ${multiFilter("intel:type", "Type", [...new Set(base.map((i) => i.type))].sort(), f.type)}
      ${multiFilter("intel:year", "Year", [...new Set(base.map((i) => yearOf(i.date)).filter(Boolean))].sort((a, b) => b.localeCompare(a)), f.year)}
    </div>
    <section class="card">
      ${rows.length ? crFeed(rows, "intel") : '<p class="empty">No intelligence items match these filters.</p>'}
    </section>
    <section class="card">
      <h2>Known LP → manager commitments <span class="muted">(${commitments.length})</span></h2>
      <p class="muted small">Publicly reported LP→manager relationships (moved here from the former Mandates tab) — click either side to explore. LP mandates &amp; RFP / fund-launch items appear in the feed above, filterable by type "Mandate" / "Launch".</p>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Investor</th><th>Manager</th><th>Detail</th></tr></thead>
        <tbody>${commitments.map((c) => `<tr>
          <td><strong>${link(`#/lp/${c.lpId}`, lpById[c.lpId].name)}</strong><div class="muted small">${esc(lpById[c.lpId].type)}</div></td>
          <td>${link(`#/manager/${c.managerId}`, managerById[c.managerId].name)}${c.fundId ? `<div class="muted small">${link(`#/fund/${c.fundId}`, fundById[c.fundId].name)}</div>` : ""}</td>
          <td class="muted small">${esc(c.note)}</td>
        </tr>`).join("")}</tbody>
      </table></div>
    </section>`;
  wireFilters("intel");
  applyPendingFocus("intel");
}

// ============================== DEAL ACTIVITY ==============================

function viewDeals() {
  const f = filterState.deals;
  // CLO transactions are carved out into their own #/clos section.
  const base = deals.filter((d) => !d.clo && (!targetFocus || midInFocus(d.managerId)));
  // ---- quarter helper (also used by the by-quarter chart drill-down) ----
  const quarterOf = (d) => { const m = /^(\d{4})-(\d{2})/.exec(d || ""); return m ? `${m[1]}-Q${Math.floor((+m[2] - 1) / 3) + 1}` : null; };
  const rows = base.filter((d) =>
    (!f.q || (d.headline + d.summary + (managerById[d.managerId] ? managerById[d.managerId].name : "")).toLowerCase().includes(f.q.toLowerCase())) &&
    (!f.type.length || f.type.includes(d.type)) &&
    (!f.year.length || f.year.includes(yearOf(d.date))) &&
    (!f.period || quarterOf(d.date) === f.period)
  ).sort((a, b) => String(b.date).localeCompare(String(a.date))); // newest first

  app.innerHTML = `
    <div class="page-head"><div class="ph-head-top"><h1>Deal Activity</h1>${focusToggle()}</div><p class="muted">${rows.length} of ${base.length} transactions · investments, exits, refinancings, restructurings &amp; distress${f.period ? ` · <strong>${esc(f.period)}</strong> <button type="button" class="link-btn" id="clear-period">clear quarter ✕</button>` : ""}</p></div>
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label><div class="filters">
      <label class="filter search"><span>Search</span><input type="search" data-filter="q" placeholder="Company, manager…" value="${esc(f.q)}"></label>
      ${multiFilter("deals:type", "Type", [...new Set(base.map((d) => d.type))].sort(), f.type)}
      ${multiFilter("deals:year", "Year", [...new Set(base.map((d) => yearOf(d.date)).filter(Boolean))].sort((a, b) => b.localeCompare(a)), f.year)}
    </div>
    <section class="card">
      ${rows.length ? crFeed(rows, "deal") : '<p class="empty">No deal items match these filters.</p>'}
    </section>`;
  wireFilters("deals");

  // Clear the active quarter filter (set by a quarter click on the Trends page).
  const clearPeriod = document.getElementById("clear-period");
  if (clearPeriod) clearPeriod.addEventListener("click", () => { filterState.deals.period = ""; router(); });
  applyPendingFocus("deals");
}

// ================================== CLOs ===================================
// Collateralised loan obligations — pricings, new platforms/managers, CLO funds,
// CLO ETFs, awards and CLO-team personnel — carved out of Deal Activity and
// Fundraising Intelligence into one dedicated feed. Items keep their original
// home array (deals / intel, tagged `clo:true`); this view simply gathers them.
function viewClos() {
  const f = filterState.clos;
  const cloDeals = deals.filter((d) => d.clo).map((d) => ({ ...d, _kind: "deal" }));
  const cloIntel = intel.filter((i) => i.clo).map((i) => ({ ...i, _kind: "intel" }));
  const all = [...cloDeals, ...cloIntel].filter((x) => !targetFocus || midInFocus(x.managerId));
  const quarterOf = (d) => { const m = /^(\d{4})-(\d{2})/.exec(d || ""); return m ? `${m[1]}-Q${Math.floor((+m[2] - 1) / 3) + 1}` : null; };
  const rows = all.filter((x) =>
    (!f.q || ((x.headline || "") + (x.summary || "")).toLowerCase().includes(f.q.toLowerCase())) &&
    (!f.kind.length || f.kind.includes(x._kind === "deal" ? "Deal" : "Fundraising")) &&
    (!f.year.length || f.year.includes(yearOf(x.date))) &&
    (!f.period || quarterOf(x.date) === f.period)
  ).sort((a, b) => String(b.date).localeCompare(String(a.date))); // newest first

  app.innerHTML = `
    <div class="page-head"><div class="ph-head-top"><h1>CLOs</h1>${focusToggle()}</div><p class="muted">${rows.length} of ${all.length} items · collateralised loan obligation pricings, platforms, funds, ETFs &amp; personnel${f.period ? ` · <strong>${esc(f.period)}</strong> <button type="button" class="link-btn" id="clear-period">clear quarter ✕</button>` : ""}</p></div>
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label><div class="filters">
      <label class="filter search"><span>Search</span><input type="search" data-filter="q" placeholder="Keyword…" value="${esc(f.q)}"></label>
      ${multiFilter("clos:kind", "Source", ["Deal", "Fundraising"], f.kind)}
      ${multiFilter("clos:year", "Year", [...new Set(all.map((x) => yearOf(x.date)).filter(Boolean))].sort((a, b) => b.localeCompare(a)), f.year)}
    </div>
    <section class="card">
      ${rows.length ? crFeed(rows) : '<p class="empty">No CLO items match these filters.</p>'}
    </section>`;
  wireFilters("clos");

  // Clear the active quarter filter (set by a quarter click on the Trends page).
  const clearPeriod = document.getElementById("clear-period");
  if (clearPeriod) clearPeriod.addEventListener("click", () => { filterState.clos.period = ""; router(); });
  applyPendingFocus("clos");
}

// ================================= TRENDS ==================================
// A dedicated visual-analytics tab gathering every chart from the deal,
// fundraising and CLO feeds into one page, grouped by category. Clicking any
// bar, slice or quarter drills into the matching feed (global data-jump handler).
// The two by-quarter charts keep their draggable 10-year date-range windows.

// Windowed quarterly line chart + dual-handle range slider. `id` namespaces the
// DOM nodes so several coexist on one page; `state` persists {start,end}; a
// quarter click drills into the `jump` feed. Returns { html, wire } — call wire()
// after the html is inserted.
function quarterTrend(id, title, desc, counts, state, jump) {
  const nowD = new Date();
  let y = nowD.getFullYear(), qr = Math.floor(nowD.getMonth() / 3) + 1;
  const quarters = [];
  for (let i = 0; i < 40; i++) { quarters.unshift(`${y}-Q${qr}`); qr--; if (qr < 1) { qr = 4; y--; } }
  const NQ = quarters.length, W = 1140, H = 260;
  const build = (a, b) => {
    const win = quarters.slice(a, b + 1);
    const lab = win.length <= 16 ? (q) => "'" + q.slice(2) : (q) => (q.endsWith("Q1") ? "'" + q.slice(2, 4) : "");
    return win.map((q) => ({ label: lab(q), value: counts[q] || 0, nav: { jump, period: q } }));
  };
  const a0 = Math.min(Math.max(0, state.start ?? (NQ - 8)), NQ - 1);
  const b0 = Math.min(Math.max(a0, state.end ?? (NQ - 1)), NQ - 1);
  const html = `<section class="card trend-wide">
    <h2>${title}</h2>
    <p class="muted small">${desc}</p>
    <div class="trend-controls">
      <div class="range-readout"><strong id="${id}-start-lbl">${esc(quarters[a0])}</strong> <span class="muted">→</span> <strong id="${id}-end-lbl">${esc(quarters[b0])}</strong></div>
      <div class="range-slider">
        <div class="range-track"></div>
        <div class="range-fill" id="${id}-fill" style="left:${(a0 / (NQ - 1)) * 100}%; width:${((b0 - a0) / (NQ - 1)) * 100}%"></div>
        <input type="range" id="${id}-start" min="0" max="${NQ - 1}" value="${a0}" aria-label="Range start quarter">
        <input type="range" id="${id}-end" min="0" max="${NQ - 1}" value="${b0}" aria-label="Range end quarter">
      </div>
    </div>
    <div id="${id}-chart">${lineChart(build(a0, b0), { width: W, height: H })}</div>
  </section>`;
  const wire = () => {
    const sEl = document.getElementById(id + "-start"), eEl = document.getElementById(id + "-end");
    if (!sEl || !eEl) return;
    const fill = document.getElementById(id + "-fill");
    const rerender = () => {
      const a = +sEl.value, b = +eEl.value;
      state.start = a; state.end = b;
      document.getElementById(id + "-start-lbl").textContent = quarters[a];
      document.getElementById(id + "-end-lbl").textContent = quarters[b];
      if (fill) { fill.style.left = (a / (NQ - 1)) * 100 + "%"; fill.style.width = ((b - a) / (NQ - 1)) * 100 + "%"; }
      document.getElementById(id + "-chart").innerHTML = lineChart(build(a, b), { width: W, height: H });
    };
    sEl.addEventListener("input", () => { if (+sEl.value > +eEl.value) sEl.value = eEl.value; sEl.style.zIndex = 5; eEl.style.zIndex = 4; rerender(); });
    eEl.addEventListener("input", () => { if (+eEl.value < +sEl.value) eEl.value = sEl.value; eEl.style.zIndex = 5; sEl.style.zIndex = 4; rerender(); });
  };
  return { html, wire };
}

function viewTrends() {
  const quarterOf = (d) => { const m = /^(\d{4})-(\d{2})/.exec(d || ""); return m ? `${m[1]}-Q${Math.floor((+m[2] - 1) / 3) + 1}` : null; };

  // ---- Deals ----
  const dealsBase = deals.filter((d) => !d.clo && (!targetFocus || midInFocus(d.managerId)));
  const dq = {};
  dealsBase.forEach((d) => { const q = quarterOf(d.date); if (q) dq[q] = (dq[q] || 0) + 1; });
  const dealMgrCounts = {};
  dealsBase.forEach((d) => { if (d.managerId) dealMgrCounts[d.managerId] = (dealMgrCounts[d.managerId] || 0) + 1; });
  const byDealManager = Object.entries(dealMgrCounts)
    .map(([id, value]) => ({ label: managerById[id] ? managerById[id].name : id, value, nav: { jump: "manager/" + id } }))
    .sort((a, b) => b.value - a.value).slice(0, 10);
  const dealTypeAll = [...new Set(dealsBase.map((d) => d.type))]
    .map((t) => ({ label: t, value: dealsBase.filter((d) => d.type === t).length, nav: { jump: "deals", dtype: t } }))
    .filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  // Keep the donut legible — top 7 by count, the long tail folded into "Other".
  const byDealType = dealTypeAll.length > 8
    ? [...dealTypeAll.slice(0, 7), { label: "Other", value: dealTypeAll.slice(7).reduce((s, d) => s + d.value, 0) }]
    : dealTypeAll;

  // ---- Fundraising ----
  const bnRaised = (list) => Math.round(list.reduce((a, x) => a + (x.raised || 0), 0) / 100) / 10;
  const bnTarget = (list) => Math.round(list.reduce((a, x) => a + (x.targetSize || 0), 0) / 100) / 10;
  const seeking = (x) => !x.evergreen && !x.lifecycle && (x.status === "Open" || x.status === "First Close" || x.status === "Pre-marketing");
  const byStrategy = STRATEGIES.map((s) => ({ label: s, value: bnRaised(funds.filter((x) => x.strategy === s)), nav: { jump: "funds", strategy: s } })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const bySought = STRATEGIES.map((s) => ({ label: s, value: bnTarget(funds.filter((x) => seeking(x) && x.strategy === s)), nav: { jump: "funds", strategy: s, status: "in-market" } })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const byGeo = GEOS.map((g) => ({ label: g, value: bnRaised(funds.filter((x) => x.geoFocus === g)), nav: { jump: "funds", geo: g } })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const byStatus = FUND_CATEGORIES.map((s) => ({ label: s, value: funds.filter((f) => fundCategory(f) === s).length, nav: { jump: "funds", status: s } })).filter((d) => d.value > 0);
  const qCounts = {};
  funds.filter(isClose).forEach((x) => { const q = fundQuarter(x); if (q) qCounts[q] = (qCounts[q] || 0) + 1; });
  const nowD = new Date();
  let cy = nowD.getFullYear(), cq = Math.floor(nowD.getMonth() / 3) + 1;
  const fQuarters = [];
  for (let i = 0; i < 20; i++) { fQuarters.unshift(`${cy}-Q${cq}`); cq--; if (cq < 1) { cq = 4; cy--; } }
  const fundTrend = fQuarters.map((q) => ({ label: "'" + q.slice(2), value: qCounts[q] || 0, nav: { jump: "funds", period: q } }));

  // ---- CLOs ----
  const cloAll = [...deals.filter((d) => d.clo), ...intel.filter((i) => i.clo)].filter((x) => !targetFocus || midInFocus(x.managerId));
  const qc = {};
  cloAll.forEach((x) => { const q = quarterOf(x.date); if (q) qc[q] = (qc[q] || 0) + 1; });
  const cloMgrCounts = {};
  cloAll.forEach((x) => { if (x.managerId) cloMgrCounts[x.managerId] = (cloMgrCounts[x.managerId] || 0) + 1; });
  const byCloMgr = Object.entries(cloMgrCounts)
    .map(([id, value]) => ({ label: managerById[id] ? managerById[id].name : id, value, nav: { jump: "manager/" + id } }))
    .sort((a, b) => b.value - a.value).slice(0, 10);

  const dealTrend = quarterTrend("dtrend", "Deal activity by quarter", "Deal transactions per quarter. Drag either handle to set the date range (up to 10 years); click any quarter to open the deal feed.", dq, trendState, "deals");
  const cloTrend = quarterTrend("ctrend", "CLO activity by quarter", "CLO pricings &amp; news per quarter. Drag either handle to set the date range; click any quarter to open the CLO feed.", qc, cloTrendState, "clos");

  app.innerHTML = `
    <div class="page-head"><div class="ph-head-top"><h1>Trends</h1>${focusToggle()}</div><p class="muted">Deal, fundraising &amp; CLO activity across the tracked European private-credit universe. Click any bar, slice or quarter to open the matching feed.</p></div>

    <section class="trend-section">
      <h2 class="trend-cat">Deals</h2>
      ${dealTrend.html}
      <div class="trend-grid">
        <section class="card"><h2>Most active managers <span class="muted">(by deal count)</span></h2>${byDealManager.length ? barChart(byDealManager, { width: 560 }) : '<p class="muted small">No deals tracked.</p>'}</section>
        <section class="card"><h2>Deals by type</h2>${byDealType.length ? donutChart(byDealType) : '<p class="muted small">No deals tracked.</p>'}</section>
      </div>
    </section>

    <section class="trend-section">
      <h2 class="trend-cat">Fundraising</h2>
      <div class="trend-grid">
        <section class="card"><h2>Capital raised by strategy <span class="muted">(€bn)</span></h2>${byStrategy.length ? barChart(byStrategy, { unit: "€", width: 560 }) : '<p class="muted small">No data.</p>'}</section>
        <section class="card"><h2>Capital sought by strategy <span class="muted">(€bn · disclosed targets, funds in market)</span></h2>${bySought.length ? barChart(bySought, { unit: "€", width: 560 }) : '<p class="muted small">No disclosed target sizes for funds currently in market.</p>'}</section>
        <section class="card"><h2>Capital raised by geography <span class="muted">(€bn)</span></h2>${byGeo.length ? barChart(byGeo, { unit: "€", width: 560 }) : '<p class="muted small">No data.</p>'}</section>
        <section class="card"><h2>Funds by status</h2>${donutChart(byStatus)}</section>
      </div>
      <section class="card trend-wide"><h2>Fundraising momentum <span class="muted">(closes / quarter · past 5 years)</span></h2><p class="muted small">Click a quarter to see the funds that reached a first/final close in it.</p>${lineChart(fundTrend, { width: 1140, height: 260 })}</section>
    </section>

    <section class="trend-section">
      <h2 class="trend-cat">CLOs</h2>
      ${cloTrend.html}
      <div class="trend-grid">
        ${byCloMgr.length ? `<section class="card"><h2>Most active CLO managers</h2>${barChart(byCloMgr, { width: 560 })}</section>` : ""}
      </div>
    </section>`;

  dealTrend.wire();
  cloTrend.wire();
}

// ================================== NEWS ===================================
// Aggregated manager/investor press across the whole tracked universe — the
// `news` + `webNews` arrays on every manager, deduped and surfaced as a feed
// (these previously only appeared on each manager's profile and the bell).
// One News-feed row: chip + date, headline (links out), summary, manager +
// outlet, with a Save button top-right (Legal style; stable content-derived id).
// Commentary tab — credit research & white papers (banks, managers, rating
// agencies, industry bodies). One-line rows like the News feed: date · title
// (links out) · institution · type, with daily date breaks.
// Credit research/commentary now lives in the merged News tab (mergedNewsItems /
// unifiedNewsRow); the standalone Commentary view has been folded in.

function newsRowFull(x) {
  const sid = newsSaveId(x);
  const head = x.url
    ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" class="intel-head">${esc(x.title)}</a>`
    : `<span class="intel-head">${esc(x.title)}</span>`;
  // To save space, the whole item is a single line: chip · headline (black,
  // links out) · source (grey) · date — the manager (a muted profile link) and
  // the outlet where named. No summary or separate source/date line.
  const src = `${link(`#/manager/${x._mid}`, x._mname, "muted small")}${x.outlet ? ` · <span class="muted small">${esc(x.outlet)}</span>` : ""}`;
  return `<div class="intel-row oneline" id="row-${esc(x._id || sid)}">
    <span class="intel-date muted small">${esc(x.time || "")}</span>${head}<span class="intel-src-inline muted small">${src}</span>${saveBtn(sid)}
  </div>`;
}

// Combined News + Commentary. News = tracked-manager & investor press;
// Commentary = credit research / white papers. Each item keeps a type so the two
// stay distinguishable via a tag at the end of the row. Newest first, no day
// breaks — the published date sits inline at the start of each row.
function mergedNewsItems() {
  // The newsroom name (outlet / institution) is a clickable filter; the manager
  // link and the "type" tail stay plain.
  const srcChip = (name) => `<span class="src-filter muted small" role="button" tabindex="0" data-srcfilter="${esc(name)}" title="Show all ${esc(name)} items">${esc(name)}</span>`;
  const news = aggregateNews().map((x) => ({
    _type: "News", _id: "n:" + (x._id || x.url || x.title), _mid: x._mid, _fkey: feedDedupKey(x),
    date: x.date || "", time: x.time || "", title: x.title, url: x.url, _srcName: x.outlet || "",
    src: `${link(`#/manager/${x._mid}`, x._mname, "muted small")}${x.outlet ? ` · ${srcChip(x.outlet)}` : ""}`,
    hay: `${x.title || ""} ${x.outlet || ""} ${x._mname || ""}`.toLowerCase(),
  }));
  const comm = (research || []).map((r) => ({
    _type: "Commentary", _id: "r:" + r.id, _mid: null,
    date: r.date || "", time: r.time || "", title: r.title, url: r.url, _srcName: r.institution || "",
    src: `${r.institution ? srcChip(r.institution) : ""}${r.type ? ` · <span class="muted small">${esc(r.type)}</span>` : ""}`,
    hay: `${r.title || ""} ${r.institution || ""} ${r.type || ""}`.toLowerCase(),
  }));
  return [...news, ...comm].sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
}
function unifiedNewsRow(x) {
  const head = x.url
    ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" class="intel-head">${esc(x.title)}</a>`
    : `<span class="intel-head">${esc(x.title)}</span>`;
  const tag = `<span class="intel-type ${x._type === "Commentary" ? "is-commentary" : "is-news"}">${esc(x._type)}</span>`;
  return `<div class="intel-row oneline" id="row-${esc(x._id)}"${x._fkey ? ` data-fkey="${esc(x._fkey)}"` : ""}>
    <span class="intel-date muted small">${x.date ? esc(fmtDate(x.date)) : ""}</span>${head}<span class="intel-src-inline muted small">${x.src}</span>${tag}
  </div>`;
}
function viewNews() {
  const f = filterState.news;
  const all = mergedNewsItems().filter((x) => !targetFocus || !x._mid || midInFocus(x._mid));
  const rows = all.filter((x) => (!f.q || x.hay.includes(f.q.toLowerCase())) && (!f.src || x._srcName === f.src));
  const srcBar = f.src
    ? `<div class="srcfilter-bar">Source · <strong>${esc(f.src)}</strong><button type="button" class="srcfilter-clear" data-srcclear="1">✕ clear</button></div>`
    : "";

  app.innerHTML = `
    <div class="page-head"><div class="ph-head-top"><h1>News</h1>${focusToggle()}</div><p class="muted">${rows.length} of ${all.length} items · manager &amp; investor press plus credit research across the tracked universe</p></div>
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label><div class="filters">
      <label class="filter search"><span>Search</span><input type="search" data-filter="q" placeholder="Headline, source, manager…" value="${esc(f.q)}"></label>
    </div>
    ${srcBar}
    <section class="card">${rows.length ? `<div class="g-feed twire">${feedBodyHTML(rows.map((x) => ({ desk: x._type === "Commentary" ? "comm" : "news", href: x.url || "#/", ext: !!x.url, title: x.title, src: x._srcName || "", date: x.date || "", time: x.time || "", mgr: x._mid || "" })))}</div>` : '<p class="empty">No items match your search.</p>'}</section>`;
  wireFilters("news");
  applyPendingFocus("news");
}

// =============================== WATCHLIST =================================
// The "Saved items" section — resolves the saved id set back to news / deal /
// fundraising / CLO items (newest first), rendered with the same rows (so each
// carries its ★ Saved / ☆ Save button) and paged at 25 with a Load-more button.
function savedSectionHtml() {
  const dById = {}; deals.forEach((d) => (dById[d.id] = d));
  const iById = {}; intel.forEach((i) => (iById[i.id] = i));
  const nById = {}; aggregateNews().forEach((x) => (nById[newsSaveId(x)] = x));
  const items = [];
  getSavedC().forEach((id) => {
    if (dById[id]) items.push({ ...dById[id], _kind: "deal" });
    else if (iById[id]) items.push({ ...iById[id], _kind: "intel" });
    else if (nById[id]) items.push({ ...nById[id], _kind: "news" });
  });
  items.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  return `<section class="card" id="saved-section"><h2>Saved items <span class="muted">(${items.length})</span></h2>${items.length
    ? crFeed(items)
    : '<p class="muted small">No saved items yet.</p>'}</section>`;
}

function viewWatchlist() {
  const byName = (a, b) => a.name.localeCompare(b.name);
  const fm = followList("manager").map((id) => managerById[id]).filter(Boolean).sort(byName);
  const ff = followList("fund").map((id) => fundById[id]).filter(Boolean).sort(byName);
  const fl = followList("lp").map((id) => lpById[id]).filter(Boolean).sort(byName);
  const mIds = new Set(fm.map((m) => m.id)), fIds = new Set(ff.map((f) => f.id));

  // Combined feed for followed managers/funds: in the news, deal activity and
  // fundraising intelligence — tagged so a single year-grouped list can render
  // each item with its own row style.
  const matches = (x) => (x.managerId && mIds.has(x.managerId)) || (x.fundId && fIds.has(x.fundId));
  const dealItems = deals.filter((d) => !d.clo && matches(d)).map((d) => ({ ...d, _kind: "deal" }));
  const intelItems = intel.filter((i) => !i.clo && matches(i)).map((i) => ({ ...i, _kind: "intel" }));
  // CLO activity for followed managers/funds is merged into the combined feed.
  const cloItems = [
    ...deals.filter((d) => d.clo && matches(d)).map((d) => ({ ...d, _kind: "deal" })),
    ...intel.filter((i) => i.clo && matches(i)).map((i) => ({ ...i, _kind: "intel" })),
  ];
  const newsItems = [];
  fm.forEach((m) => {
    const all = [...(m.news || []), ...(m.webNews || [])];
    const seen = new Set();
    all.forEach((x) => {
      const k = (x.url || x.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/$/, "");
      if (seen.has(k)) return;
      seen.add(k);
      newsItems.push({ ...x, _kind: "news", _mid: m.id, _mname: m.name });
    });
  });
  // Sort the whole combined feed newest-first BEFORE it is paged/grouped —
  // otherwise feedHtml slices the first 25 of a kind-ordered concatenation
  // (all news, then deals, …) and recent deals/CLOs get pushed off page one.
  const feed = [...newsItems, ...dealItems, ...intelItems, ...cloItems]
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  if (fm.length + ff.length + fl.length === 0) {
    app.innerHTML = `<div class="page-head"><h1>My Watchlist</h1></div>
      <section class="card"><p class="muted">You're not following anything yet. Click the ☆ star on any manager, fund or investor to add it here — your watchlist builds a personalised intelligence feed${cloudSync ? " and syncs across your devices" : ""}.</p></section>
      ${savedSectionHtml()}`;
    return;
  }
  const listCard = (title, items, type, render) =>
    `<details class="wl-cat"><summary class="wl-cat-head"><h2>${title} <span class="muted">(${items.length})</span></h2><span class="wl-caret" aria-hidden="true"></span></summary><div class="wl-body">${items.length
      ? `<ul class="link-list">${items.map((x) => `<li>${nameCell(type, x.id, render(x))}</li>`).join("")}</ul>`
      : '<p class="muted small">None followed.</p>'}</div></details>`;
  app.innerHTML = `
    <div class="page-head"><h1>My Watchlist</h1><p class="muted">${fm.length + ff.length + fl.length} followed · ${cloudSync ? "synced across devices" : "saved on this device"}</p></div>
    <div class="wl-cats">
      ${listCard("Managers", fm, "manager", (m) => link(`#/manager/${m.id}`, m.name))}
      ${listCard("Funds", ff, "fund", (f) => `${link(`#/fund/${f.id}`, f.name)} <span class="muted small">${esc(managerById[f.managerId].name)}</span>`)}
      ${listCard("Investors", fl, "lp", (l) => `${link(`#/lp/${l.id}`, l.name)} <span class="muted small">${esc(l.type)}</span>`)}
    </div>
    <div id="wl-panel" class="wl-panel" hidden></div>
    <section class="card"><h2>News, deals, fundraising &amp; CLOs <span class="muted">(${feed.length})</span></h2>${feed.length ? crFeed(feed) : '<p class="muted small">No news, deals or fundraising yet for the managers/funds you follow.</p>'}</section>
    ${savedSectionHtml()}`;

  // Accordion (all viewports): only one category open at a time; the open one's
  // followed names render into the full-width panel below the toggles, flowing
  // across the available width. The in-cell body is hidden (see CSS).
  const cats = app.querySelectorAll(".wl-cat");
  const panel = document.getElementById("wl-panel");
  const syncPanel = () => {
    if (!panel) return;
    const open = app.querySelector(".wl-cat[open]");
    const body = open && open.querySelector(".wl-body");
    if (body) { panel.innerHTML = body.innerHTML; panel.hidden = false; }
    else { panel.innerHTML = ""; panel.hidden = true; }
  };
  cats.forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) cats.forEach((o) => { if (o !== d) o.open = false; });
    syncPanel();
  }));
  syncPanel();
}

// ============================== shared bits ================================

// Re-render current view but keep updated filter state, without losing focus
function wireFilters(view) {
  const inputs = app.querySelectorAll("input[data-filter], select[data-filter]");
  inputs.forEach((el) => {
    const key = el.getAttribute("data-filter");
    const evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, () => {
      filterState[view][key] = el.value;
      const active = document.activeElement === el;
      const y = window.scrollY;
      router(); // re-render
      window.scrollTo(0, y); // keep position across keystroke re-renders
      if (active) {
        const again = app.querySelector(`[data-filter="${key}"]`);
        if (again) { again.focus(); if (again.setSelectionRange && again.value) { const n = again.value.length; again.setSelectionRange(n, n); } }
      }
    });
  });
  // Remember whether the mobile "Filters" toggle is open across re-renders.
  const ffcb = app.querySelector(".ff-cb");
  if (ffcb) ffcb.addEventListener("change", () => { if (window.matchMedia(MOBILE_Q).matches) mFiltersOpen = ffcb.checked; });
  reopenMs();
}

// Re-open the multi-select popover that was open before a re-render.
function reopenMs() {
  if (!openMs) return;
  const ms = app.querySelector(`.ms[data-ms="${openMs}"]`);
  if (!ms) return;
  const pop = ms.querySelector(".ms-pop");
  const btn = ms.querySelector(".ms-btn");
  if (pop) pop.removeAttribute("hidden");
  if (btn) btn.setAttribute("aria-expanded", "true");
}


// Click delegation: watchlist stars first, then row navigation.
app.addEventListener("click", (e) => {
  // Click a newsroom name in the News feed → filter to that source; the pill clears it.
  const srcf = e.target.closest("[data-srcfilter]");
  if (srcf) {
    e.preventDefault(); e.stopPropagation();
    filterState.news.src = srcf.getAttribute("data-srcfilter");
    if (location.hash.replace(/^#/, "") !== "/news") { location.hash = "#/news"; } else { router(); }
    return;
  }
  const srcc = e.target.closest("[data-srcclear]");
  if (srcc) { e.preventDefault(); e.stopPropagation(); filterState.news.src = ""; router(); return; }
  const fb = e.target.closest("[data-follow]");
  if (fb) {
    e.stopPropagation();
    const [type, id] = fb.getAttribute("data-follow").split(":");
    const y = window.scrollY;
    toggleFollow(type, id);
    router();
    window.scrollTo(0, y); // keep position; don't jump to top on a star toggle
    return;
  }
  // Save / unsave an individual news/deal/fundraising/CLO item.
  const sb = e.target.closest("[data-save]");
  if (sb) {
    e.stopPropagation();
    const id = sb.getAttribute("data-save");
    const nowSaved = toggleSavedC(id);
    sb.classList.toggle("is-saved", nowSaved);
    sb.setAttribute("aria-pressed", String(nowSaved));
    sb.textContent = nowSaved ? "★ Saved" : "☆ Save";
    // On the watchlist, re-render so the Saved section (and an unsaved item
    // dropping out of it) stays in sync; elsewhere just update the button.
    if (document.getElementById("saved-section")) {
      const y = window.scrollY; router(); window.scrollTo(0, y);
    }
    return;
  }
  // Multi-select dropdown: toggle its popover.
  const msBtn = e.target.closest(".ms-btn");
  if (msBtn) {
    e.stopPropagation();
    const ms = msBtn.closest(".ms");
    const pop = ms.querySelector(".ms-pop");
    const willOpen = pop.hasAttribute("hidden");
    app.querySelectorAll(".ms-pop").forEach((p) => p.setAttribute("hidden", ""));
    app.querySelectorAll(".ms-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
    if (willOpen) { pop.removeAttribute("hidden"); msBtn.setAttribute("aria-expanded", "true"); openMs = ms.getAttribute("data-ms"); }
    else { openMs = null; }
    return;
  }
  // Keep clicks inside an open popover from bubbling to row/navigation handlers.
  if (e.target.closest(".ms-pop")) { e.stopPropagation(); return; }
  // Dashboard headline → open the item on its feed page.
  const goto = e.target.closest("[data-goto]");
  if (goto) {
    const [view, id] = goto.getAttribute("data-goto").split(":");
    setPendingFocus({ view, id });
    // the anchor's href (#/deals or #/intel) changes the hash and triggers router
    return;
  }
  const clear = e.target.closest("[data-clearfilter]");
  if (clear) {
    e.stopPropagation();
    const key = clear.getAttribute("data-clearfilter");
    if (filterState.funds && key in filterState.funds) filterState.funds[key] = "";
    router();
    return;
  }
  const sortcol = e.target.closest("[data-sortcol]");
  if (sortcol) {
    e.stopPropagation();
    const [view, key] = sortcol.getAttribute("data-sortcol").split(":");
    const s = filterState[view].sort;
    if (s.key === key) s.dir = s.dir === "asc" ? "desc" : "asc";
    else { s.key = key; s.dir = "asc"; }
    router();
    return;
  }
  const jump = e.target.closest("[data-jump]");
  if (jump) {
    const route = jump.getAttribute("data-jump");
    const arr = (v) => (v ? [v] : []);
    if (route === "funds") {
      filterState.funds = {
        q: "",
        strategy: arr(jump.getAttribute("data-strategy")),
        status: arr(jump.getAttribute("data-status")),
        geo: arr(jump.getAttribute("data-geo")),
        period: jump.getAttribute("data-period") || "",
        sort: filterState.funds.sort || { key: "name", dir: "asc" },
      };
    } else if (route === "deals") {
      const period = jump.getAttribute("data-period");
      // A quarter click (carries data-period) just sets the quarter, preserving
      // the user's other deal filters; a type jump (dashboard donut) resets them.
      if (period) filterState.deals = { ...filterState.deals, period };
      else filterState.deals = { q: "", type: arr(jump.getAttribute("data-dtype")), year: [], period: "" };
    } else if (route === "intel") {
      filterState.intel = { q: "", type: arr(jump.getAttribute("data-itype")), year: [] };
    } else if (route === "clos") {
      const period = jump.getAttribute("data-period");
      if (period) filterState.clos = { ...filterState.clos, period };
    }
    // Navigating changes the hash (→ router via hashchange); when we're already
    // on the target page the hash doesn't change, so re-render explicitly.
    const target = "#/" + route;
    if (location.hash === target) router();
    else location.hash = target;
    return;
  }
  const scroll = e.target.closest("[data-scroll]");
  if (scroll) {
    const t = document.getElementById(scroll.getAttribute("data-scroll"));
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const row = e.target.closest("[data-href]");
  if (row && !e.target.closest("a")) {
    const href = row.getAttribute("data-href");
    // External rows (data-ext, or an absolute http href) open in a new tab;
    // internal rows (e.g. Hedge Funds → #/hf/<id>) drive the hash router.
    if (row.dataset.ext === "1" || /^https?:/i.test(href)) window.open(href, "_blank", "noopener");
    else location.hash = href;
  }
});

// Keyboard activation for sortable column headers + source-filter chips (Enter / Space).
app.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const target = e.target.closest("[data-sortcol],[data-srcfilter]");
  if (!target) return;
  e.preventDefault();
  target.click();
});

// Multi-select: a checkbox toggle updates the filter array and re-renders,
// keeping its popover open.
app.addEventListener("change", (e) => {
  const cb = e.target.closest(".ms-pop input[type=checkbox]");
  if (!cb) return;
  const ms = cb.closest(".ms");
  const [view, key] = ms.getAttribute("data-ms").split(":");
  filterState[view][key] = [...ms.querySelectorAll("input[type=checkbox]:checked")].map((i) => i.value);
  openMs = ms.getAttribute("data-ms");
  const y = window.scrollY;
  router();
  window.scrollTo(0, y); // keep position; the filter sits below the charts
});

// Click anywhere outside an open multi-select closes its popover.
on(document, "click", (e) => {
  if (e.target.closest(".ms")) return;
  if (!openMs) return;
  app.querySelectorAll(".ms-pop").forEach((p) => p.setAttribute("hidden", ""));
  app.querySelectorAll(".ms-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
  openMs = null;
});

// ================================= router ==================================
function router() {
  const rawHash = location.hash || "#/";
  const qIdx = rawHash.indexOf("?");
  const hash = qIdx >= 0 ? rawHash.slice(0, qIdx) : rawHash;
  const query = qIdx >= 0 ? rawHash.slice(qIdx + 1) : "";
  const [, route, arg] = hash.split("/");
  // Cross-app / cold-load deep link into a feed item, e.g. #/deals?focus=d519
  // (from Glance or the palette). Seed pendingFocus the same way an in-app
  // dashboard headline click does, then drop the param so later re-renders
  // (filter changes) don't keep re-scrolling.
  const focusId = query ? new URLSearchParams(query).get("focus") : null;
  if (focusId) {
    // `until` marks a URL-driven focus: keep re-applying the highlight across the
    // re-renders that fire right after load (the startup double-run and the async
    // account/watchlist sync each rebuild the DOM), so the flash isn't wiped. It
    // stops re-applying once the window lapses. Click-set focus stays one-shot.
    // A "k:" prefix targets a row by its feed dedup key (data-fkey) rather than
    // its element id — used for news stories, which may collapse into a deal /
    // intel row on the manager feed, so an id would miss the surviving row.
    setPendingFocus(focusId.startsWith("k:")
      ? { view: route, fkey: decodeURIComponent(focusId.slice(2)), until: Date.now() + 4000 }
      : { view: route, id: focusId, until: Date.now() + 4000 });
    history.replaceState(null, "", hash);
  }
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#/${route}` || (route === "" && a.getAttribute("href") === "#/"));
  });
  const wl = document.getElementById("wl-count");
  if (wl) { const n = followCount(); wl.textContent = n ? n : ""; wl.style.display = n ? "" : "none"; }
  window.scrollTo(0, 0);
  switch (route) {
    case "": case undefined: return viewDashboard();
    case "funds": return viewFunds();
    case "fund": return viewFund(arg);
    case "managers": return viewManagers();
    case "manager": return viewManager(arg);
    case "clo": return viewClo(arg, hash.split("/")[3]);
    case "hf": return viewHedgeFund(arg);
    case "lps": return viewLps();
    case "lp": return viewLp(arg);
    case "news": return viewNews();
    case "commentary": return viewNews(); // merged into News; keep legacy deep-links working
    // Deal Activity (#/deals) and Fundraising (#/intel) list pages retired — the
    // dashboard Deals/Fundraising chips carry that content and each item links to
    // the relevant manager's page. viewDeals/viewIntel are kept (dormant) for
    // reuse; a stray hit on the old routes lands on the dashboard.
    // #/clos (old CLO list) and #/watchlist (superseded by the Bookmarks
    // panel's Watchlist tab) are retired the same way — views kept dormant.
    case "deals": case "intel": case "clos": case "watchlist": return viewDashboard();
    default: return notFound(app);
  }
}

// Swipe-to-change-section gesture removed by request (pull-to-refresh kept).

on(window, "hashchange", router);
on(window, "DOMContentLoaded", router);
// Unified ⌘K / Ctrl-K search, mounted in-place (opens over the current app).
router();
renderDataStatus();
initNotif();
initWatchlistSync();
initSavedSync();


  return { enter: () => router(), leave() {} };
}
