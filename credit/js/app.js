// =============================================================================
// Wire Credit Intelligence — application shell, router and views.
// Plain ES modules, no framework. Hash-based routing for a clickable prototype.
// =============================================================================

import {
  STRATEGIES, FUND_STATUS, GEOS, LP_TYPES, DEAL_TYPES, DATA_UPDATED, LAST_CHECKED, LAST_CHECKED_TIME,
  managers, funds, lps, intel, commitments, deals, research,
  managerById, fundById, lpById,
  fundsByManager, intelForManager, intelForFund, dealsForManager, dealsForFund,
} from "./data.js?v=20260719-3";
// NOTE: these internal module imports carry the same ?v= cache-buster as the
// <script>/<link> tags in index.html. Bump ALL of them together on every release
// — otherwise the browser/CDN can serve a stale data.js/charts.js against a fresh
// app.js and the app fails to load (blank page).
import { barChart, donutChart, lineChart, multiLineChart } from "./charts.js?v=20260719-3";

const app = document.getElementById("app");

// ----------------------------- formatting utils ----------------------------
const eur = (m) => (m == null ? "Undisclosed" : "€" + (m >= 1000 ? (m / 1000).toFixed(m % 1000 === 0 ? 0 : 1) + "bn" : m + "m"));
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pct = (n) => (n == null ? "Undisclosed" : Math.round(n) + "%");
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
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

// Indicative NET target IRR ranges by strategy — market-typical conventions, NOT
// a specific fund's disclosed target. Used only where a fund discloses no target.
const STRATEGY_IRR = {
  "Senior Direct Lending": "8–10%",
  "Unitranche": "9–12%",
  "Mezzanine / Junior Debt": "12–15%",
  "Distressed & Special Situations": "15–20%+",
  "Structured Credit / CLO": "12–16%",
  "Real Estate Debt": "7–10%",
  "Infrastructure Debt": "6–9%",
  "Asset-Based Lending": "8–12%",
  "Opportunistic Credit": "10–14%",
  "NAV / Fund Finance": "8–12%",
};

const statusClass = (s) => ({
  "Pre-marketing": "st-pre", "Open": "st-open", "First Close": "st-first", "Final Close": "st-final",
  "Evergreen": "st-ever",
}[s] || "");

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

function progressBar(raised, target) {
  const actual = Math.round((raised / target) * 100);
  const w = Math.min(100, actual);
  return `<div class="progress" title="${eur(raised)} of ${eur(target)} target">
    <div class="progress-fill" style="width:${w}%"></div>
    <span class="progress-label">${eur(raised)} / ${eur(target)} · ${actual}%</span>
  </div>`;
}

// Decides how to display a fund's fundraising state given real-world gaps:
// evergreen (no target), undisclosed target/raised, or a normal progress bar.
function raiseDisplay(x) {
  if (x.evergreen) {
    return `<span class="fund-status">Evergreen</span>` +
      (x.raised != null ? ` <span class="muted small">~${eur(x.raised)} AUM/NAV</span>` : "");
  }
  if (x.raised != null && x.targetSize != null) return progressBar(x.raised, x.targetSize);
  if (x.raised != null) return `<span class="muted small">${eur(x.raised)} raised · target undisclosed</span>`;
  if (x.status === "Pre-marketing") return `<span class="muted small">Pre-marketing</span>`;
  return `<span class="muted small">Undisclosed</span>`;
}

// Deployment vs raised (dry powder) where publicly disclosed; links to the
// fund's disclosed deals (what the capital was spent on).
function deploymentBlock(x) {
  const dl = dealsForFund(x.id);
  const dealNote = dl.length ? `<p class="muted small deploy-note">Disclosed investments: ${dl.length} — see Deal activity below.</p>` : "";
  if (x.evergreen) {
    return `<div class="deploy"><div class="deploy-head"><span>Deployment</span><span class="muted small">evergreen — capital deployed &amp; recycled on a rolling basis</span></div>${dealNote}</div>`;
  }
  if (x.deployedPct == null) {
    return `<div class="deploy"><div class="deploy-head"><span>Deployment / dry powder</span><span class="muted small">not separately disclosed</span></div>${dealNote}</div>`;
  }
  const raised = x.raised;
  const dep = raised != null ? Math.round(raised * x.deployedPct / 100) : null;
  const dry = (raised != null && dep != null) ? raised - dep : null;
  return `<div class="deploy">
    <div class="deploy-head"><span>Deployment${x.deployedEstimated ? " (est.)" : ""}</span><span>${x.deployedPct}% invested${x.deployedAsOf ? ` · as of ${esc(x.deployedAsOf)}` : ""}</span></div>
    <div class="deploy-bar" title="${x.deployedPct}% deployed"><div class="deploy-fill" style="width:${Math.min(100, x.deployedPct)}%"></div></div>
    <div class="deploy-stats">
      <span><strong>${dep != null ? eur(dep) : "—"}</strong> deployed</span>
      <span><strong>${dry != null ? eur(dry) : "—"}</strong> dry powder</span>
      <span><strong>${raised != null ? eur(raised) : "—"}</strong> raised</span>
    </div>
    ${dealNote}
  </div>`;
}

// Notable / high-profile investments a fund is publicly known for. Each entry is
// { name, note?, url? }; renders an honest empty-state when none are compiled.
function notableInvestmentsCard(x) {
  const items = x.notableInvestments || [];
  const body = items.length
    ? `<ul class="link-list">${items.map((n) => {
        const head = n.url ? `<a href="${esc(n.url)}" target="_blank" rel="noopener noreferrer">${esc(n.name)}</a>` : `<strong>${esc(n.name)}</strong>`;
        return `<li>${head}${n.note ? ` <span class="muted small">— ${esc(n.note)}</span>` : ""}</li>`;
      }).join("")}</ul>`
    : `<p class="muted small">Notable portfolio investments not yet compiled / not publicly disclosed for this fund.</p>`;
  return `<section class="card"><h2>Notable investments</h2>${body}</section>`;
}

// A prominent note for funds that have been wound down / liquidated / fully realised.
function lifecycleNote(x) {
  if (!x.lifecycle) return "";
  const o = typeof x.lifecycle === "string" ? { status: x.lifecycle } : x.lifecycle;
  return `<div class="lifecycle-note">${lifecycleBadge(x)} <strong>${esc(o.status)}</strong>${o.date ? ` <span class="muted small">· ${esc(o.date)}</span>` : ""}${o.note ? `<p class="muted small">${esc(o.note)}</p>` : ""}</div>`;
}

function chip(text, cls = "") { return `<span class="chip ${cls}">${esc(text)}</span>`; }
function link(href, text, cls = "") { return `<a href="${href}" class="${cls}">${esc(text)}</a>`; }

// "Est." badge for figures that are labelled estimates rather than disclosed facts.
const estBadge = (on) => on ? '<span class="chip est" title="Estimated / not precisely disclosed publicly">Est.</span>' : "";

// Renders a record's source citations + as-of date, when present. No-ops otherwise.
function sources(rec) {
  if (!rec || !rec.sources || !rec.sources.length) return "";
  const links = rec.sources.map((s, i) =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label || "source " + (i + 1))}</a>`
  ).join(" · ");
  const asOf = rec.asOf ? ` · <span>as of ${esc(rec.asOf)}</span>` : "";
  return `<div class="sources muted small"><span class="src-label">Sources:</span> ${links}${asOf}</div>`;
}

// --------------------------- watchlist (cloud sync + localStorage) ---------
// Watchlist persists to a per-user Cloudflare KV store (via the /api/watchlist
// Pages Function) when the site is served behind Cloudflare Access, so it syncs
// across devices. localStorage is kept as an instant cache / offline fallback,
// so the app still works if the API isn't reachable (e.g. plain static hosting).
const FOLLOW_KEY = "meridian.follows";
const WATCHLIST_API = "/api/watchlist";
const FOLLOW_TYPES = ["manager", "fund", "lp"];
function loadFollows() { try { return JSON.parse(localStorage.getItem(FOLLOW_KEY)) || {}; } catch { return {}; } }
const follows = loadFollows();
let account = null;          // signed-in identity (email) when behind Access
let cloudSync = false;       // true once the watchlist API responds
let pushTimer = null;
function followList(type) { return follows[type] || (follows[type] = []); }
function isFollowed(type, id) { return followList(type).includes(id); }
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
function followCount() { return FOLLOW_TYPES.reduce((n, t) => n + followList(t).length, 0); }

// --------------------------- saved items (cloud sync + localStorage) --------
// Individually saved news / deal / fundraising / CLO items — distinct from the
// follow-based watchlist. Persists to a per-user KV store via /api/saved-credit
// (its OWN prefix, so it never collides with Wire Legal's saved items) with
// localStorage as an instant cache / offline fallback. Mirrors the Legal app.
const SAVEDC_KEY = "meridian.credit.saved";
const SAVEDC_API = "/api/saved-credit";
let savedCloud = false;
let savedPushTimer = null;
function getSavedC() { try { return new Set(JSON.parse(localStorage.getItem(SAVEDC_KEY) || "[]")); } catch { return new Set(); } }
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
// Stable content-derived id for a news item — a short hash of its normalised URL
// (or title) + manager, so a saved news story keeps pointing at the same item
// across data refreshes (unlike the aggregation index used for row anchors).
function newsSaveId(x) {
  const base = (x.url || x.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
  const s = base + "|" + (x._mid || x.managerId || "");
  let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return "n" + (h >>> 0).toString(36);
}
// Save/unsave button — Wire Legal style. `id` is the item's stable save id.
function saveBtn(id) {
  const on = getSavedC().has(id);
  return `<button type="button" class="save-btn ${on ? "is-saved" : ""}" data-save="${esc(id)}" aria-pressed="${on}" title="${on ? "Remove from saved" : "Save this item"}">${on ? "★ Saved" : "☆ Save"}</button>`;
}
// Topbar data-freshness line: dataset "last updated" date + the time this view
// was last loaded/refreshed, plus a manual Refresh button that reloads to pull
// the latest deployed data and re-sync the watchlist.
// Most recent item date across the intelligence + deals feeds (content freshness).
const LATEST_ITEM = [...intel, ...deals].reduce((m, x) => (x.date && x.date > m ? x.date : m), "");
function renderDataStatus() {
  const el = document.getElementById("data-status");
  if (!el) return;
  const t = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const refresh = `Last refresh ${esc(fmtDate(LAST_CHECKED))}${LAST_CHECKED_TIME ? `, ${esc(LAST_CHECKED_TIME)}` : ""}`;
  el.innerHTML = `<span class="ds-text" title="Routine last ran ${esc(fmtDate(LAST_CHECKED))}${LAST_CHECKED_TIME ? ` ${esc(LAST_CHECKED_TIME)}` : ""}; data last changed ${esc(fmtDate(DATA_UPDATED))}"><span class="ds-part">${refresh}</span></span>`;
}
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
// Human-readable source (outlet / wire / manager PR) for a notification, from
// its sourceUrl. Known wires & trade-press map to a clean label; an unmapped
// domain is taken to be the manager's own press release (show the manager name);
// otherwise a tidied domain. Kept in sync with Glance's copy.
const NEWS_SOURCES = {
  "bloomberg.com": "Bloomberg", "reuters.com": "Reuters", "ft.com": "Financial Times",
  "wsj.com": "WSJ", "cnbc.com": "CNBC", "marketwatch.com": "MarketWatch",
  "creditflux.com": "Creditflux", "alternativecreditinvestor.com": "Alternative Credit Investor",
  "privatedebtinvestor.com": "Private Debt Investor", "privateequitywire.co.uk": "Private Equity Wire",
  "privateequityinternational.com": "Private Equity International", "penews.com": "Private Equity News",
  "pehub.com": "PE Hub", "with-intelligence.com": "With Intelligence", "fnlondon.com": "Financial News",
  "globenewswire.com": "GlobeNewswire", "businesswire.com": "Business Wire", "prnewswire.com": "PR Newswire",
  "finance.yahoo.com": "Yahoo Finance", "fintech.global": "FinTech Global", "citywire.com": "Citywire",
};
function srcHost(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } }
function tidyDomain(host) { const l = host.split(".").slice(-2, -1)[0] || host; return l ? l.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : ""; }
function creditSource(rec) {
  const host = srcHost(rec.sourceUrl);
  if (host && NEWS_SOURCES[host]) return NEWS_SOURCES[host];
  const m = rec.managerId ? managerById[rec.managerId] : null;
  if (m && m.name) return m.name;           // manager's own press release
  return host ? tidyDomain(host) : "";
}
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
    if (a) { const [view, id] = a.getAttribute("data-goto").split(":"); pendingFocus = { view, id }; }
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
document.addEventListener("click", (e) => {
  const panel = document.getElementById("notif-panel");
  const isOpen = panel && !panel.hasAttribute("hidden");
  if (isOpen && !e.target.closest("#notif")) { e.preventDefault(); e.stopPropagation(); closeNotif(); }
}, true);
window.addEventListener("hashchange", closeNotif);

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
function followBtn(type, id) {
  const on = isFollowed(type, id);
  return `<button type="button" class="follow-btn ${on ? "on" : ""}" data-follow="${type}:${id}" title="${on ? "Following — click to remove from watchlist" : "Add to your watchlist"}" aria-label="Follow">${on ? "★" : "☆"}</button>`;
}

// Star + name as two flex columns, so a wrapping name stays in its own column
// (and never slides back under the star).
function nameCell(type, id, inner) {
  return `<span class="namecell">${followBtn(type, id)}<span class="namecell-text">${inner}</span></span>`;
}

// ----------------------- relationship lookups ------------------------------
function commitmentsForLp(lpId) { return commitments.filter((c) => c.lpId === lpId); }
function commitmentsForManager(managerId) { return commitments.filter((c) => c.managerId === managerId); }

// Actual, publicly-disclosed investors in a specific fund: combines the fund's
// own `investors` list with any fund-level entries in the commitments table.
// Deduped by name; LP-universe entries link through to the investor profile.
function investorsForFund(f) {
  const out = [];
  const seen = new Set();
  const push = (name, lpId, note, url) => {
    const key = (name || "").toLowerCase();
    if (!name || seen.has(key)) return;
    seen.add(key);
    out.push({ name, lpId: lpId || null, note: note || "", url: url || null });
  };
  (f.investors || []).forEach((i) => push(i.name, i.lpId, i.note, i.url));
  commitments.filter((c) => c.fundId === f.id).forEach((c) => {
    const lp = lpById[c.lpId];
    push(lp ? lp.name : c.lpId, c.lpId, c.note, c.sourceUrl);
  });
  return out;
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

// ---- Feed pagination --------------------------------------------------------
// Long feeds render the first PAGE items with a "Load more" button that reveals
// the next PAGE. The shown count resets to PAGE whenever the filter signature
// for that feed changes (so a new search/filter starts from the top again).
const PAGE = 25;
const pageShown = {};
const pageSig = {};
function pageReset(key, sig) { if (pageSig[key] !== sig) { pageSig[key] = sig; pageShown[key] = PAGE; } }
function pageCount(key) { return pageShown[key] || PAGE; }
function loadMoreBtn(key, remaining) {
  if (remaining <= 0) return "";
  return `<div class="load-more-wrap"><button type="button" class="load-more" data-more="${esc(key)}">Load ${Math.min(PAGE, remaining)} more <span class="lm-rem">· ${remaining} remaining</span></button></div>`;
}
// Render a feed capped to the current page with a gentle per-day break between
// items, plus a Load-more button. (Rows carry their own date, so the break is a
// subtle divider rather than a heading.)
function feedHtml(rows, key, rowFn, sig, labeled) {
  pageReset(key, sig);
  const shown = rows.slice(0, pageCount(key));
  return withDayBreaks(shown, rowFn, labeled) + loadMoreBtn(key, rows.length - shown.length);
}
// Flat paginated feed — no day-break separators (the row carries its own date).
function feedFlat(rows, key, rowFn, sig) {
  pageReset(key, sig);
  const shown = rows.slice(0, pageCount(key));
  return shown.map(rowFn).join("") + loadMoreBtn(key, rows.length - shown.length);
}
// Cap a flat list/table to the current page; returns { shown, more } so the
// caller can render its own rows and drop the Load-more button after them.
function pageList(rows, key, sig) {
  pageReset(key, sig);
  const shown = rows.slice(0, pageCount(key));
  return { shown, more: loadMoreBtn(key, rows.length - shown.length) };
}

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
document.addEventListener("click", (e) => {
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
document.addEventListener("change", (e) => {
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
// Pending scroll-to target after navigating to a feed page ({view, id}).
let pendingFocus = null;

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
  const KIND = { deal: "DEAL", intel: "FUND", clo: "CLO", news: "NEWS", comm: "COMM" };
  // Single line matching the Home feed: date · CODE · headline (+ inline manager)
  // · source (right). Credit stories carry a date, so the date leads (vs Home's time).
  const wireRow = (a) => {
    const rec = a.item, isNews = a.kind === "news";
    if (a.kind === "comm") {
      const src = rec.institution || "";
      const url = rec.url || "";
      return `<li class="compact-item tw-row" data-kind="comm">`
        + `<span class="tw-date">${rec.date ? esc(fmtDate(rec.date)) : ""}</span>`
        + `<span class="tw-tag comm">COMM</span>`
        + `<span class="tw-body">${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="tw-head">${esc(rec.title)}</a>` : `<span class="tw-head">${esc(rec.title)}</span>`}</span>`
        + `<span class="tw-src">${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(src)}</a>` : esc(src)}</span>`
        + `</li>`;
    }
    const title = isNews ? rec.title : rec.headline;
    const goto = isNews ? `news:${rec._id}` : `${a.view}:${rec.id}`;
    const mid = isNews ? rec._mid : rec.managerId;
    const mname = mid && managerById[mid] ? managerById[mid].name : (isNews ? (rec._mname || "") : "");
    const src = isNews ? (rec.outlet || "") : creditSource(rec);
    const url = isNews ? rec.url : rec.sourceUrl;
    const mgr = mid ? `<a href="#/manager/${mid}" class="tw-mgr">${esc(mname)}</a>` : (mname ? `<span class="tw-mgr">${esc(mname)}</span>` : "");
    return `<li class="compact-item tw-row" data-kind="${a.kind}">`
      + `<span class="tw-date">${rec.date ? esc(fmtDate(rec.date)) : ""}</span>`
      + `<span class="tw-tag ${a.kind}">${KIND[a.kind]}</span>`
      // Headline opens the underlying source article (external) when we have a
      // URL; otherwise it falls back to the relevant manager's page in the app
      // (the standalone Deals/Fundraising list pages have been retired). The
      // manager name always links to that manager's page too.
      + `<span class="tw-body"><a href="${url ? esc(url) : (mid ? `#/manager/${mid}` : "#/")}"${url ? ` target="_blank" rel="noopener noreferrer"` : ""} class="tw-head">${esc(title)}</a>${mgr ? `<span class="tw-mgr-w">${mgr}</span>` : ""}</span>`
      + `<span class="tw-src">${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(src || "source")}</a>` : esc(src || "")}</span>`
      + `</li>`;
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
  const mgrRow = (r) => `<tr class="clickable" data-href="#/manager/${r.m.id}" data-focus="${r.focus ? 1 : 0}" data-name="${esc((r.m.name + " " + (r.m.hq || "")).toLowerCase())}">`
    + `<td class="tl-nm">${esc(r.m.name)}</td>`
    + `<td class="tl-hq">${esc(r.m.hq || "")}</td>`
    + `<td class="tl-n">${r.aum == null ? "n/a" : esc(fmtAum(r.aum))}</td>`
    + `<td class="tl-n">${r.m.aumCredit != null ? esc(fmtAum(r.m.aumCredit)) : "—"}</td>`
    + `<td class="tl-n">${r.nf}</td>`
    + `<td class="tl-n">${r.live || ""}</td>`
    + `<td class="tl-cl">${cloMgrIds.has(r.m.id) ? "●" : ""}</td></tr>`;
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
            </div>
          </header>
          <div class="tpanes" id="cr-dash-panes">
            <div class="tpane" data-pane="wire">
              <ul class="twire compact-list" id="cr-dash-wire">${wireDays(activity.slice(0, 120), wireRow, (a) => (a.item || {}).date) || `<li class="compact-item"><span class="tw-src">No recent items.</span></li>`}</ul>
            </div>
            <div class="tpane" data-pane="managers" hidden>
              <header class="tpanel-h thead-search"><span>Managers</span>
                <input type="search" id="mgr-q" class="tsearch" placeholder="Search name or HQ…" value="${esc(fst.q || "")}" aria-label="Search managers">
                <button type="button" class="tfocus-btn" id="cr-lg-focus" aria-pressed="false" title="Show only €1–10bn AUM managers">€1–10bn</button>
              </header>
              <table class="tleague tleague-full">
                <thead><tr><th>Manager</th><th class="tl-hq">HQ</th><th>AUM</th><th>Credit&nbsp;AUM</th><th>Funds</th><th>In&nbsp;mkt</th><th>CLOs</th></tr></thead>
                <tbody id="mgr-rows">${mrows.map(mgrRow).join("")}</tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>`;
  // All shows the whole wire (news + commentary merged in); Deals filters to
  // deal/CLO rows, Fundraising to fund (intel) rows; Managers swaps to the table.
  const DASH_KIND = { deals: new Set(["deal", "clo"]), fundraising: new Set(["intel"]) };
  const dashTabs = document.getElementById("cr-dash-tabs");
  if (dashTabs) dashTabs.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    dashTabs.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    const p = b.dataset.p;
    const wirePane = document.querySelector('#cr-dash-panes [data-pane="wire"]');
    const mgrPane = document.querySelector('#cr-dash-panes [data-pane="managers"]');
    if (p === "managers") { wirePane.hidden = true; mgrPane.hidden = false; return; }
    mgrPane.hidden = true; wirePane.hidden = false;
    const kinds = DASH_KIND[p];
    wirePane.querySelectorAll(".tw-row").forEach((r) => {
      r.style.display = (!kinds || kinds.has(r.dataset.kind)) ? "" : "none";
    });
  });
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
}
// Generic in-place wire filter: chips toggle which kinds (data-kind) show,
// without leaving the screen. Shared by the dashboard and terminal detail pages.
function wireSimpleChips(chipsId, wireId) {
  const chips = document.getElementById(chipsId);
  const wire = document.getElementById(wireId);
  if (!chips || !wire) return;
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip");
    if (!b) return;
    chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    const k = b.dataset.k;
    wire.querySelectorAll(".tw-row").forEach((r) => { r.style.display = (k === "all" || r.dataset.kind === k) ? "" : "none"; });
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

// Press items in the dataset are headline-only (no article body), so compose a
// short attributed summary from the fields we have. Kept to ~2 lines by the
// .news-sum clamp in CSS.
function newsSummary(x) {
  const t = (x.title || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  const s = esc(/[.!?]$/.test(t) ? t : t + ".");
  return x.outlet ? `${esc(x.outlet)} reports: ${s}` : s;
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

// Indicative LP fit — shown while a fund is raising (open / first close / evergreen).
// Explicitly NOT confirmed commitments.
function potentialFitCard(x) {
  const interestedLps = lps.filter((l) => l.strategies.includes(x.strategy) && l.mandateStatus !== "Not currently active");
  return `<section class="card">
    <h2>Potential investor fit <span class="muted">(${interestedLps.length})</span></h2>
    <p class="muted small">LPs whose stated interests include ${esc(x.strategy)} — indicative fit while the fund is open, not confirmed commitments.</p>
    <ul class="link-list">
      ${interestedLps.slice(0, 6).map((l) => `<li>${link(`#/lp/${l.id}`, l.name)} <span class="muted small">${esc(l.type)} · ${l.typicalTicket != null ? eur(l.typicalTicket) + " typical ticket" : "ticket undisclosed"}</span></li>`).join("") || '<li class="muted">No active LPs flagged.</li>'}
    </ul>
  </section>`;
}

// Actual, publicly-disclosed investors — shown for funds that have reached final
// close (and evergreen funds). Honest empty-state when no LPs are public.
function actualInvestorsCard(x) {
  const inv = investorsForFund(x);
  const body = inv.length
    ? `<ul class="link-list">${inv.map((i) => `<li>${i.lpId ? link(`#/lp/${i.lpId}`, i.name) : `<strong>${esc(i.name)}</strong>`}${i.note ? ` <span class="muted small">— ${esc(i.note)}</span>` : ""}${i.url ? ` · <a href="${esc(i.url)}" target="_blank" rel="noopener noreferrer" class="muted small">source</a>` : ""}</li>`).join("")}</ul>`
    : `<p class="muted small">No specific LP commitments to this fund have been disclosed publicly. (Most private funds do not name investors; where cornerstone/anchor LPs are announced — e.g. public pensions, the EIF / British Business Bank, sovereign wealth funds — they are listed here with sources.)</p>`;
  return `<section class="card"><h2>Investors <span class="muted">(${inv.length})</span></h2>
    <p class="muted small">Limited partners publicly disclosed as having committed to this fund.</p>${body}</section>`;
}

// Target IRR (disclosed where known, else indicative strategy range) + any
// publicly-disclosed actual performance (net/gross IRR, MOIC, DPI).
function returnsCard(x) {
  const ti = x.targetIRR;
  const target = ti
    ? `<p class="detail-body"><strong>${esc(ti.range)}${ti.basis ? " " + esc(ti.basis) : ""}</strong> <span class="muted small">target — disclosed${ti.asOf ? `, ${esc(ti.asOf)}` : ""}</span>${ti.sourceUrl ? ` · <a href="${esc(ti.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="muted small">source</a>` : ""}</p>`
    : `<p class="detail-body"><strong>${esc(STRATEGY_IRR[x.strategy] || "—")} net</strong> <span class="chip est" title="Indicative market-typical range for the strategy, not this fund's disclosed target">indicative</span> <span class="muted small">typical for ${esc(x.strategy)}; the fund's own target is not publicly disclosed</span></p>`;
  const p = x.performance;
  const metrics = p ? [
    p.netIRR != null ? `<span><strong>${p.netIRR}%</strong> net IRR</span>` : "",
    p.grossIRR != null ? `<span><strong>${p.grossIRR}%</strong> gross IRR</span>` : "",
    p.moic != null ? `<span><strong>${p.moic}x</strong> MOIC</span>` : "",
    p.dpi != null ? `<span><strong>${p.dpi}x</strong> DPI</span>` : "",
  ].filter(Boolean).join("") : "";
  const perf = p
    ? `<div class="deploy-stats">${metrics || '<span class="muted small">disclosed</span>'}</div>${p.note ? `<p class="muted small">${esc(p.note)}</p>` : ""}${p.asOf ? `<p class="muted small">as of ${esc(p.asOf)}</p>` : ""}${p.sourceUrl ? sources({ sources: [{ label: "Performance source", url: p.sourceUrl }] }) : ""}`
    : `<p class="muted small">No fund-level performance publicly disclosed. (Net IRR / multiples for private funds are usually only visible via public-pension reports or listed vehicles; shown here when available.)</p>`;
  return `<section class="card"><h2>Target return &amp; performance</h2>
    <h3 class="sub">Target IRR</h3>${target}
    <h3 class="sub">Actual performance</h3>${perf}</section>`;
}

// ---- Data provenance & completeness -----------------------------------------
// Honest, at-a-glance view of WHICH data points are disclosed for a fund, which
// are estimates/indicative, and which are simply not public — so gaps are
// explicit rather than hidden. States: yes (disclosed) · est (estimate) ·
// indicative (strategy proxy, not this fund's figure) · no (gap) · na (n/a).
function dataDimensions(x) {
  const inv = investorsForFund(x);
  const notable = (x.notableInvestments || []).length;
  return [
    { key: "Fundraising target",
      state: x.evergreen ? "na" : (x.targetSize != null ? "yes" : "no"),
      detail: x.evergreen ? "evergreen — no fixed target" : (x.targetSize != null ? eur(x.targetSize) + " target" : "target not disclosed") },
    { key: x.evergreen ? "Current AUM/NAV" : "Amount raised",
      state: x.raised != null ? "yes" : "no",
      detail: x.raised != null ? eur(x.raised) : "not disclosed" },
    { key: "Deployment",
      state: x.evergreen ? "na" : (x.deployedPct != null ? (x.deployedEstimated ? "est" : "yes") : "no"),
      detail: x.evergreen ? "rolling (evergreen)" : (x.deployedPct != null ? `${x.deployedPct}% invested${x.deployedEstimated ? " (est.)" : ""}${x.deployedAsOf ? ` · as of ${x.deployedAsOf}` : ""}` : "not separately disclosed") },
    { key: "Target IRR",
      state: x.targetIRR ? "yes" : "indicative",
      detail: x.targetIRR ? `${x.targetIRR.range}${x.targetIRR.basis ? " " + x.targetIRR.basis : ""} — disclosed` : `${STRATEGY_IRR[x.strategy] || "—"} — indicative strategy range, not this fund's figure` },
    { key: "Actual performance",
      state: x.performance ? "yes" : "no",
      detail: x.performance ? "net IRR / multiples disclosed" : "not publicly disclosed" },
    { key: "Named investors",
      state: inv.length ? "yes" : "no",
      detail: inv.length ? `${inv.length} disclosed` : "none publicly disclosed" },
    { key: "Notable investments",
      state: notable ? "yes" : "no",
      detail: notable ? `${notable} compiled` : "none compiled / disclosed" },
  ];
}
// Disclosed = hard facts (yes) + flagged estimates (est). Indicative/no/na are not
// counted as disclosed; na is excluded from the denominator (not applicable).
function completeness(x) {
  const dims = dataDimensions(x);
  const applicable = dims.filter((d) => d.state !== "na");
  const disclosed = applicable.filter((d) => d.state === "yes" || d.state === "est");
  return { disclosed: disclosed.length, total: applicable.length, gaps: applicable.filter((d) => d.state === "no" || d.state === "indicative").map((d) => d.key) };
}
// Compact inline meter for tables/headers; tooltip spells out the gaps.
function completenessPill(x) {
  const c = completeness(x);
  const lvl = c.disclosed / c.total;
  const cls = lvl >= 0.66 ? "dm-hi" : lvl >= 0.34 ? "dm-mid" : "dm-lo";
  const title = c.gaps.length ? `Not disclosed: ${c.gaps.join(", ")}` : "All tracked data points disclosed";
  return `<span class="data-meter ${cls}" title="${esc(title)}"><span class="dm-bar"><span class="dm-fill" style="width:${Math.round(lvl * 100)}%"></span></span>${c.disclosed}/${c.total} data</span>`;
}
const STATE_ICON = { yes: "✓", est: "~", indicative: "~", no: "—", na: "·" };
const STATE_LABEL = { yes: "Disclosed", est: "Estimate", indicative: "Indicative", no: "Not disclosed", na: "N/A" };
// Full breakdown card: as-of date + per-dimension disclosure status.
function dataProvenanceCard(x) {
  const c = completeness(x);
  const rows = dataDimensions(x).map((d) =>
    `<li class="dim dim-${d.state}"><span class="dim-icon" title="${esc(STATE_LABEL[d.state])}">${STATE_ICON[d.state]}</span>
      <span class="dim-key">${esc(d.key)}</span>
      <span class="dim-detail muted small">${esc(d.detail)}</span></li>`).join("");
  return `<section class="card provenance">
    <h2>Data completeness &amp; provenance</h2>
    <p class="muted small">Record compiled <strong>as of ${esc(x.asOf || "—")}</strong> from public sources. <strong>${c.disclosed} of ${c.total}</strong> tracked data points are publicly disclosed${c.gaps.length ? `; the rest are not public (or shown as an indicative proxy) and are marked below.` : "."}</p>
    <ul class="dim-list">${rows}</ul>
    <p class="muted small">“Indicative” = a market-typical range for the strategy, not this fund’s own figure. “Estimate” = a figure we have approximated and flagged. Everything else links to its source above.</p>
  </section>`;
}

function viewFund(id) {
  const x = fundById[id];
  if (!x) return notFound();
  const m = managerById[x.managerId];
  const related = intelForFund(id);
  const peers = funds.filter((p) => p.strategy === x.strategy && p.id !== id).slice(0, 5);
  // While raising (open/first close/pre-marketing) or evergreen → indicative fit.
  // At final close (and for evergreen) → actual disclosed investor list.
  const showPotential = x.evergreen || x.status === "Open" || x.status === "First Close" || x.status === "Pre-marketing";
  const hasActualInvestors = investorsForFund(x).length > 0;
  const investorCard = showPotential ? potentialFitCard(x) : actualInvestorsCard(x);
  // Evergreen funds show both; a still-raising fund also shows actual investors if any are disclosed.
  const extraInvestorCard = (x.evergreen || (showPotential && hasActualInvestors)) ? actualInvestorsCard(x) : "";

  // Combined, date-sorted activity wire for this fund: fundraising intel + deals.
  const fdeals = dealsForFund(x.id);
  const fundFeed = [
    ...related.map((i) => ({ ...i, _kind: "intel" })),
    ...fdeals.map((d) => ({ ...d, _kind: "deal" })),
  ].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const inv = investorsForFund(x);
  const interestedLps = lps.filter((l) => l.strategies.includes(x.strategy) && l.mandateStatus !== "Not currently active");
  // The manager is the natural inline entity on a fund's activity rows.
  const fundWireRow = (i) => crWireRow(i, `<a href="#/manager/${m.id}" class="tw-mgr">${esc(m.name)}</a>`);

  const raisedLabel = x.evergreen ? "AUM/NAV" : "Raised";
  const metrics = [
    [x.evergreen ? "AUM" : "Target", x.evergreen ? (x.raised != null ? eur(x.raised) : "—") : eur(x.targetSize)],
    [raisedLabel, eur(x.raised)], ["Vintage", x.vintage], ["Status", esc(x.status)],
    ["Investors", inv.length], ["Deals", fdeals.length],
  ];
  // Rail: fundraising facts, deployment, returns, investors, notable, peers, provenance.
  const facts = [
    ["Target size", x.evergreen ? "Evergreen" : eur(x.targetSize)],
    ["Hard cap", eur(x.hardCap)],
    [x.evergreen ? "Current AUM/NAV" : "Raised to date", eur(x.raised)],
    ["Sector focus", esc(x.sectorFocus || "—")],
    ["Domicile", esc(x.domicile)],
    ["Geography", esc(x.geoFocus || "—")],
  ];
  const factsRail = `<ul class="tfacts">${facts.map(([k, v]) => `<li><span class="tf-k">${k}</span><span class="tf-v">${v}</span></li>`).join("")}</ul>`;
  const ti = x.targetIRR;
  const perf = x.performance;
  const irrLine = ti ? `${esc(ti.range)}${ti.basis ? " " + esc(ti.basis) : ""} <span class="tf-est">disclosed</span>` : `${esc(STRATEGY_IRR[x.strategy] || "—")} <span class="tf-est">indicative</span>`;
  const returnsRail = `<ul class="tfacts"><li><span class="tf-k">Target IRR</span><span class="tf-v">${irrLine}</span></li>`
    + (perf && perf.netIRR != null ? `<li><span class="tf-k">Net IRR</span><span class="tf-v">${perf.netIRR}%</span></li>` : "")
    + (perf && perf.grossIRR != null ? `<li><span class="tf-k">Gross IRR</span><span class="tf-v">${perf.grossIRR}%</span></li>` : "")
    + (perf && perf.moic != null ? `<li><span class="tf-k">MOIC</span><span class="tf-v">${perf.moic}x</span></li>` : "")
    + (perf && perf.dpi != null ? `<li><span class="tf-k">DPI</span><span class="tf-v">${perf.dpi}x</span></li>` : "")
    + (!perf ? `<li><span class="tf-k">Performance</span><span class="tf-v">n/d</span></li>` : "")
    + `</ul>`;
  const investorsRail = inv.length
    ? `<ul class="tmini">${inv.map((i) => `<li class="tmini-row${i.lpId ? " clickable" : ""}"${i.lpId ? ` data-href="#/lp/${i.lpId}"` : ""}><span class="tmini-t">${esc(i.name)}</span>${i.note ? `<span class="tmini-m">${esc(i.note)}</span>` : ""}</li>`).join("")}</ul>`
    : (showPotential && interestedLps.length
      ? `<ul class="tmini">${interestedLps.slice(0, 8).map((l) => `<li class="tmini-row clickable" data-href="#/lp/${l.id}"><span class="tmini-t">${esc(l.name)}<span class="tmini-r">${l.typicalTicket != null ? eur(l.typicalTicket) : ""}</span></span><span class="tmini-m">${esc(l.type)} · indicative fit</span></li>`).join("")}</ul>`
      : `<p class="tw-empty muted small">No LP commitments publicly disclosed.</p>`);
  const investorsTitle = inv.length ? "Investors" : (showPotential && interestedLps.length ? "Potential investor fit" : "Investors");
  const investorsCount = inv.length || (showPotential ? interestedLps.length : 0);
  const notable = x.notableInvestments || [];
  const notableRail = notable.length
    ? `<ul class="tmini">${notable.map((n) => `<li class="tmini-row">${n.url ? `<a class="tmini-t" href="${esc(n.url)}" target="_blank" rel="noopener noreferrer">${esc(n.name)}</a>` : `<span class="tmini-t">${esc(n.name)}</span>`}${n.note ? `<span class="tmini-m">${esc(n.note)}</span>` : ""}</li>`).join("")}</ul>`
    : "";
  const peersRail = peers.length
    ? `<ul class="tmini">${peers.map((pp) => `<li class="tmini-row clickable" data-href="#/fund/${pp.id}"><span class="tmini-t">${esc(pp.name)}</span><span class="tmini-m">${esc(managerById[pp.managerId].name)} · ${esc(pp.status)}</span></li>`).join("")}</ul>`
    : "";
  const provRail = `<ul class="tfacts">${dataDimensions(x).map((d) => `<li><span class="tf-k">${STATE_ICON[d.state]} ${esc(d.key)}</span><span class="tf-v">${esc(String(d.detail).replace(/\s*—.*$/, "")) || esc(STATE_LABEL[d.state])}</span></li>`).join("")}</ul>`;

  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/funds", "Funds"], [null, x.name]])}
      <div class="tdash-ticker">${metrics.map(([l, v]) => `<span class="tmet"><b>${v}</b> ${esc(l)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-2">
        <section class="tcol tcol-c">
          <div class="tdet-id">
            <h1>${nameCell("fund", x.id, esc(x.name))}</h1>
            <div class="tdet-sub">${link(`#/manager/${m.id}`, m.name)} · ${esc(x.domicile)} · Vintage ${x.vintage}</div>
            ${x.description ? `<p class="tdet-desc">${esc(x.description)}</p>` : ""}
            <div class="tdet-chips"><span class="tdet-chip">${esc(x.strategy)}</span><span class="tdet-chip">${esc(x.status)}</span>${x.geoFocus ? `<span class="tdet-chip">${esc(x.geoFocus)}</span>` : ""}${x.lifecycle ? `<span class="tdet-chip">${esc(typeof x.lifecycle === "string" ? x.lifecycle : x.lifecycle.status)}</span>` : ""}</div>
            <div class="tdet-src">Data as of ${esc(x.asOf || "—")} · ${completenessPill(x)}</div>
            ${(x.sources && x.sources.length) ? `<div class="tdet-src">${sources(x)}</div>` : ""}
          </div>
          <header class="tpanel-h twire-head">
            <div class="tchips" id="fd-chips">
              <button type="button" class="tchip is-on" data-k="all">All</button>
              <button type="button" class="tchip" data-k="intel">Fundraising</button>
              <button type="button" class="tchip" data-k="deal">Deals</button>
            </div>
          </header>
          <ul class="twire compact-list" id="fd-wire">${fundFeed.length ? fundFeed.map(fundWireRow).join("") : '<li class="muted small tw-empty">No activity linked to this fund yet.</li>'}</ul>
        </section>
        <aside class="tcol tcol-r">
          ${railPanel("Fundraising", "", `<div class="tfd-raise">${raiseDisplay(x)}</div>${factsRail}`)}
          ${railPanel("Target & performance", "", returnsRail)}
          ${railPanel(investorsTitle, investorsCount ? String(investorsCount) : "", investorsRail)}
          ${notableRail ? railPanel("Notable investments", String(notable.length), notableRail) : ""}
          ${peersRail ? railPanel("Peer funds", esc(x.strategy), peersRail) : ""}
          ${railPanel("Data completeness", "", provRail)}
        </aside>
      </div>
    </div>`;
  wireSimpleChips("fd-chips", "fd-wire");
  applyPendingFocus("intel");
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

// A short, strong AUM figure for the compact profile tile: pull the leading
// currency figure out of the (often descriptive) aumText — e.g. "c. €2.5bn AUM
// (firm website); ~€2.2bn across the funds" → "€2.5bn". Falls back to the numeric
// aum, then a dash. Full aumText still shows on hover (title) and in Finances.
function aumHeadline(m) {
  const t = String(m.aumText || "");
  const hit = t.match(/[~<>]?\s*(?:c\.\s*)?[€$£]\s*\d[\d.,]*\s*(?:tn|bn|billion|m|million)?\+?/i);
  if (hit) return hit[0].replace(/c\.\s*/i, "").replace(/\s+/g, "").replace(/billion/i, "bn").replace(/million/i, "m");
  return m.aum != null ? "€" + m.aum + "bn" : "—";
}

// Ownership, financials, headcount and regulatory/account filings (last 2 yrs).
function ownersFilingsBlock(m) {
  const owners = (m.owners && m.owners.length)
    ? `<dl class="facts">${m.owners.map((o) => `<div><dt>${esc(o.name)}</dt><dd>${esc(o.stake)}</dd></div>`).join("")}</dl>`
    : `<p class="muted small">Ownership not separately disclosed in public sources.</p>`;
  const fin = m.financials
    ? `<p class="detail-body">${esc(m.financials.summary)}${m.financials.asOf ? ` <span class="muted small">(as of ${esc(m.financials.asOf)})</span>` : ""}</p>`
    : `<p class="muted small">Financials not yet compiled / not publicly disclosed (most private managers do not publish accounts beyond regulatory filings).</p>`;
  const hc = m.headcount
    ? `<div class="deploy-stats"><span><strong>${m.headcount.investment ?? "—"}</strong> investment professionals</span><span><strong>${m.headcount.other ?? "—"}</strong> other professionals</span><span><strong>${m.headcount.total ?? "—"}</strong> total</span></div>${m.headcount.asOf ? `<p class="muted small">as of ${esc(m.headcount.asOf)}</p>` : ""}`
    : `<p class="muted small">Headcount split not yet compiled / not publicly broken out.</p>`;
  const fil = (m.filings && m.filings.length)
    ? `<ul class="link-list">${m.filings.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)}</a>${x.date ? ` <span class="muted small">· ${esc(x.date)}</span>` : ""}</li>`).join("")}</ul>`
    : `<p class="muted small">No regulatory/account filings compiled yet (UK LLPs file at Companies House; US advisers file SEC Form ADV; listed parents file annual reports).</p>`;
  const leg = (m.legal && m.legal.length)
    ? `<ul class="link-list">${m.legal.map((p) => `<li><strong>${esc(p.name)}</strong> <span class="muted small">${esc(p.role)}${p.city ? ` · ${esc(p.city)}` : ""}</span>${p.linkedin ? ` · <a href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer" class="muted small">LinkedIn</a>` : ""}</li>`).join("")}</ul>`
    : '<p class="muted small">Senior legal contacts not yet compiled for this manager (sourced from the firm\'s own website and LinkedIn where disclosed).</p>';
  return `<section class="card">
    <h2>About</h2>
    <h3 class="sub">Owners</h3>${owners}
    <h3 class="sub">Finances</h3>${fin}
    <h3 class="sub">Headcount</h3>${hc}
    <h3 class="sub">Legal &amp; senior counsel</h3>${leg}
    <h3 class="sub">Recent regulatory &amp; account filings (last 2 years)</h3>${fil}
    ${m.regSources ? sources({ sources: m.regSources }) : ""}
  </section>`;
}

// Group a dated list into year sections (newest year first; undated last),
// each rendered with a year heading acting as a section break.
// Render a date-sorted list, inserting a day-break separator whenever the day
// changes from the previous item (a visual gap between each day's items).
// `labeled` → introduce each day with a dated header ("16 Jul 2026", uppercased
// in CSS), matching the home news feed; the news/commentary rows then lead with
// the time. Other feeds keep the plain centred day-rule.
function withDayBreaks(items, rowFn, labeled) {
  let prevDay = null;
  return items.map((x) => {
    const day = String(x.date || "").slice(0, 10);
    const sep = labeled
      ? (day !== prevDay ? `<div class="day-hdr">${esc(fmtDate(day))}</div>` : "")
      : (prevDay !== null && day !== prevDay ? '<div class="day-sep" aria-hidden="true"></div>' : "");
    prevDay = day;
    return sep + rowFn(x);
  }).join("");
}
function byYear(items, rowFn) {
  const groups = {};
  [...items].sort((a, b) => String(b.date).localeCompare(String(a.date))).forEach((x) => {
    const y = (String(x.date).match(/^(\d{4})/) || [])[1] || "Undated";
    (groups[y] ||= []).push(x);
  });
  return Object.keys(groups)
    .sort((a, b) => (a === "Undated") - (b === "Undated") || b.localeCompare(a))
    .map((y) => `<div class="year-group"><h3 class="year-head">${esc(y)}</h3>${withDayBreaks(groups[y], rowFn)}</div>`)
    .join("");
}

// One manager-profile news row — same layout as the Fundraising (intelRow) rows:
// a "News" pill + date in the meta column, the headline (links to source), then
// the outlet inline after the headline, and a summary line where present.
// On a MANAGER PROFILE (mgr=true) the row's date moves out of the meta column to
// the end of the headline line (after the source, in grey); elsewhere the feeds
// keep the date in the meta column beneath the chip.
// The date now ALWAYS occupies the leading meta column (where the type chip used
// to sit) on every feed row, on manager pages and feeds alike; the old inline
// end-of-title date is retired (endDate kept as a no-op for its callers).
const metaDate = (d) => `<span class="muted small">${d ? esc(fmtDate(d)) : ""}</span>`;
const endDate = () => "";
function newsItemRow(x, mgr) {
  const head = x.url
    ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" class="intel-head">${esc(x.title)}</a>`
    : `<span class="intel-head">${esc(x.title)}</span>`;
  const src = x.outlet ? `<span class="intel-src-inline muted small">${esc(x.outlet)}</span>` : "";
  return `<div class="intel-row" data-fkey="${esc(feedDedupKey(x))}">
    <div class="intel-meta">${metaDate(x.date)}</div>
    <div class="intel-body"><div class="intel-title-line">${head}${src}${saveBtn(newsSaveId(x))}</div>${x.summary ? `<p class="muted small">${esc(x.summary)}</p>` : ""}</div>
  </div>`;
}

// Dedup key for a manager's combined news feed: a specific source URL when one
// exists, else the normalized headline/title — so an event captured as both a
// press item and a structured deal/intel collapses to a single row. Generic
// landing URLs (a bare domain, /news, /press-releases, …) are ignored so they
// don't wrongly merge unrelated items that share the same landing page.
function feedDedupKey(x) {
  const u = (x.url || x.sourceUrl || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
  const generic = !u || /^https?:\/\/[^/]+$/.test(u) || /\/(news-insights|news|press-releases|media|insights|press)$/.test(u);
  if (!generic) return "u:" + u;
  return "t:" + (x.title || x.headline || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}
// Render one row of the manager's combined feed by its tagged kind. On a manager
// profile the headline should open the source directly (srcHead), matching the
// press rows — the manager link would only point back to this same page.
function mgrFeedRow(x) {
  return x._kind === "deal" ? dealRow(x, true) : x._kind === "intel" ? intelRow(x, true) : newsItemRow(x, true);
}

// Senior legal team — general counsel and other senior legal counsel, with the
// city they are based in and a link to their LinkedIn profile where known.
// Best-effort extraction of a named CLO vehicle from a headline/summary, e.g.
// "Palmer Square CLO 2026-1", "Cordatus XXXVIII", "GLM US CLO 30",
// "Hayfin Emerald CLO XIII". Returns null when no specific vehicle is named
// (general CLO news), so those items only show in the CLO news feed.
function cloName(text) {
  if (!text) return null;
  let m = text.match(/\b([A-Z][\w'&.]*(?:\s+(?:[A-Z][\w'&.()/]*|of|the)){0,4}?\s+CLO\s+\d{4}-\d+[A-Z]?)\b/);
  if (m) return m[1].trim();
  m = text.match(/\b([A-Z][\w'&.]*(?:\s+[A-Z][\w'&.()/]*){0,4}?\s+CLO\s+(?:[IVXLCDM]{1,9}|\d{1,3}))\b/);
  if (m) return m[1].trim();
  m = text.match(/\b([A-Z][a-z]{3,}\s+[IVXLCDM]{1,9})\b/);
  if (m) return m[1].trim();
  return null;
}
// Best-effort deal size from a headline/summary, e.g. "€406m" / "$726m".
function cloSize(text) {
  const m = String(text || "").match(/([€$£])\s?~?\s?(\d[\d,]*(?:\.\d+)?)\s?(bn|billion|m|million)\b/i);
  if (!m) return null;
  return m[1] + m[2].replace(/,/g, "") + (/b/i.test(m[3]) ? "bn" : "m");
}
// Reduce a manager's CLO items to a roster of distinct named vehicles, each with
// its vintage (issuance year), disclosed size and the items relating to it.
// Sorted newest vintage first.
function cloRosterFor(items) {
  const map = new Map();
  items.forEach((x) => {
    const name = cloName(x.headline) || cloName(x.summary);
    if (!name) return;
    const key = name.toLowerCase();
    let e = map.get(key);
    if (!e) { e = { name, items: [], date: x.date }; map.set(key, e); }
    e.items.push(x);
    if (String(x.date) > String(e.date)) { e.date = x.date; e.name = name; }
  });
  return [...map.values()].map((e) => {
    const byDate = [...e.items].sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const ny = (e.name.match(/\b(20\d{2})\b/) || [])[1];
    const vintage = ny || (String(byDate[0].date).match(/^(\d{4})/) || [])[1] || "";
    let size = null;
    byDate.some((it) => (size = cloSize(it.headline) || cloSize(it.summary)));
    return { name: e.name, items: e.items, date: e.date, vintage, size };
  }).sort((a, b) => String(b.vintage).localeCompare(String(a.vintage)) || String(b.date).localeCompare(String(a.date)));
}

// Shared column template so the Funds and CLOs tables on a manager page line up
// column-for-column (identical <col> widths + table-layout:fixed via .mgr-vehicle-table).
const MGR_VEHICLE_COLS = `<colgroup><col style="width:28%"><col style="width:18%"><col style="width:18%"><col style="width:18%"><col style="width:18%"></colgroup>`;

// Shared terminal wire row for credit detail pages (manager / fund / CLO). Builds
// one dense line — date · CODE · headline (+ optional inline entity) · source —
// from a feed item tagged with _kind (deal / intel / news). data-fkey (news) or
// id="row-<id>" (structured) preserve the notification deep-link focus.
const CR_KIND = { deal: "DEAL", intel: "FUND", news: "NEWS" };
function crWireRow(x, inline) {
  const isNews = x._kind === "news";
  const title = isNews ? x.title : x.headline;
  const src = isNews ? (x.outlet || "") : creditSource(x);
  const url = isNews ? x.url : x.sourceUrl;
  const head = isNews
    ? `<a href="${esc(url || "#")}"${url ? ' target="_blank" rel="noopener noreferrer"' : ""} class="tw-head">${esc(title)}</a>`
    : `<a href="#/${x._kind === "deal" ? "deals" : "intel"}" data-goto="${x._kind === "deal" ? "deals" : "intel"}:${x.id}" class="tw-head">${esc(title)}</a>`;
  return `<li class="compact-item tw-row" data-kind="${x._kind}"${isNews ? ` data-fkey="${esc(feedDedupKey(x))}"` : ` id="row-${esc(x.id)}"`}>`
    + `<span class="tw-date">${x.date ? esc(fmtDate(x.date)) : ""}</span>`
    + `<span class="tw-tag ${x._kind}">${CR_KIND[x._kind]}</span>`
    + `<span class="tw-body">${head}${inline ? `<span class="tw-mgr-w">${inline}</span>` : ""}</span>`
    + `<span class="tw-src">${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(src || "source")}</a>` : esc(src || "")}</span>`
    + `</li>`;
}
// Small reusable terminal rail panel.
function railPanel(title, meta, body) {
  return `<section class="tpanel"><header class="tpanel-h"><span>${title}</span>${meta ? `<span class="tpanel-x">${meta}</span>` : ""}</header>${body}</section>`;
}

function viewManager(id) {
  const m = managerById[id];
  if (!m) return notFound();
  const fs = fundsByManager(id).sort((a, b) => b.vintage - a.vintage);
  const news = intelForManager(id);
  const liveFunds = fs.filter((x) => !x.evergreen && !x.lifecycle && x.status !== "Final Close").length;
  // The CLO roster still needs this manager's CLO items (deals + intel tagged clo).
  const mgrClo = [
    ...dealsForManager(m.id).filter((d) => d.clo).map((d) => ({ ...d, _kind: "deal" })),
    ...news.filter((i) => i.clo).map((i) => ({ ...i, _kind: "intel" })),
  ];
  const mgrCloRoster = cloRosterFor(mgrClo);
  // One comprehensive, date-sorted feed for the manager AND its funds/CLOs:
  // press (news + webNews), deal activity, fundraising intelligence and CLO
  // items together, de-duplicated so an event captured as both a press item and
  // a structured deal/intel shows once (the structured record wins).
  const fundIds = new Set(fs.map((f) => f.id));
  const belongs = (x) => x.managerId === id || (x.fundId && fundIds.has(x.fundId));
  const mgrFeed = (() => {
    const items = [
      ...deals.filter(belongs).map((d) => ({ ...d, _kind: "deal" })),
      ...intel.filter(belongs).map((i) => ({ ...i, _kind: "intel" })),
      ...[...(m.news || []), ...(m.webNews || [])].map((x) => ({ ...x, _kind: "news", _mid: m.id, _mname: m.name })),
    ];
    const seen = new Set();
    return items
      .filter((x) => { const k = feedDedupKey(x); if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  })();

  const commits = commitmentsForManager(m.id);
  // The manager is implicit on this page, so we surface the fund inline instead.
  const mgrWireRow = (x) => crWireRow(x, x.fundId && fundById[x.fundId]
    ? `<a href="#/fund/${x.fundId}" class="tw-mgr">${esc(fundById[x.fundId].name)}</a>` : "");
  const metrics = [
    ["AUM", esc(aumHeadline(m))], ["Founded", m.founded], ["Funds", fs.length],
    ["In market", liveFunds], ["CLOs", mgrCloRoster.length], ["Investors", commits.length],
  ];
  // ---- panes: News (default) · Funds · CLOs · Key personnel ----
  const newsPane = mgrFeed.length
    ? `<ul class="twire compact-list" id="mgr-wire">${mgrFeed.map(mgrWireRow).join("")}</ul>`
    : '<p class="tw-empty muted small">No news yet for this manager.</p>';
  const fundsPane = fs.length
    ? `<ul class="tmini">${fs.map((x) => `<li class="tmini-row clickable" data-href="#/fund/${x.id}"><span class="tmini-t">${esc(x.name)}<span class="tmini-r">${x.evergreen ? "Evergreen" : (x.targetSize ? eur(x.targetSize) : "—")}</span></span><span class="tmini-m">Vintage ${x.vintage} · ${esc(x.status || x.strategy || "")}</span></li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">${esc(m.fundsNote || "No fund tracked (bank/balance-sheet lender, no dedicated credit arm, or US/global-only vehicles).")}</p>`;
  const closPane = mgrCloRoster.length
    ? `<ul class="tmini">${mgrCloRoster.map((c) => `<li class="tmini-row clickable" data-href="#/clo/${m.id}/${encodeURIComponent(c.name)}"><span class="tmini-t">${esc(c.name)}<span class="tmini-r">${c.size ? esc(c.size) : ""}</span></span><span class="tmini-m">${c.vintage ? "Vintage " + esc(c.vintage) : "Issued"}</span></li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">${mgrClo.length ? "No individually-named CLO vehicles identified yet." : "No tracked CLOs."}</p>`;
  const peoplePane = (() => {
    let out = "";
    if (m.owners && m.owners.length) out += `<div class="tpg"><div class="tpg-h">Ownership</div><ul class="tfacts">${m.owners.map((o) => `<li><span class="tf-k">${esc(o.name)}</span><span class="tf-v">${esc(o.stake)}</span></li>`).join("")}</ul></div>`;
    if (m.legal && m.legal.length) out += `<div class="tpg"><div class="tpg-h">Legal &amp; senior counsel</div><ul class="tmini">${m.legal.map((p) => `<li class="tmini-row"><span class="tmini-t">${esc(p.name)}${p.linkedin ? ` · <a href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer" class="tw-mgr">LinkedIn</a>` : ""}</span><span class="tmini-m">${esc(p.role || "")}${p.city ? " · " + esc(p.city) : ""}</span></li>`).join("")}</ul></div>`;
    if (m.headcount) { const h = m.headcount; out += `<div class="tpg"><div class="tpg-h">Headcount${h.asOf ? ` · as of ${esc(h.asOf)}` : ""}</div><ul class="tfacts"><li><span class="tf-k">Investment professionals</span><span class="tf-v">${h.investment ?? "—"}</span></li><li><span class="tf-k">Other professionals</span><span class="tf-v">${h.other ?? "—"}</span></li><li><span class="tf-k">Total</span><span class="tf-v">${h.total ?? "—"}</span></li></ul></div>`; }
    if (m.filings && m.filings.length) out += `<div class="tpg"><div class="tpg-h">Regulatory &amp; account filings</div><ul class="tmini">${m.filings.map((x) => `<li class="tmini-row"><a class="tmini-t" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)}</a>${x.date ? `<span class="tmini-m">${esc(x.date)}</span>` : ""}</li>`).join("")}</ul></div>`;
    return out || '<p class="tw-empty muted small">No ownership or personnel data compiled for this manager yet.</p>';
  })();
  const pane = (p, inner) => `<div class="tpane" data-p="${p}"${p === "news" ? "" : " hidden"}>${inner}</div>`;

  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/", "Managers"], [null, m.name]])}
      <div class="tdash-ticker">${metrics.map(([l, v]) => `<span class="tmet"><b>${v}</b> ${esc(l)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <div class="tdet-id">
            <h1>${nameCell("manager", m.id, esc(m.name))}</h1>
            <div class="tdet-sub">${esc(m.hq)} · Founded ${m.founded}${m.aumText ? " · " + esc(aumHeadline(m)) + " AUM" : ""}</div>
            ${m.description ? `<p class="tdet-desc">${esc(m.description)}</p>` : ""}
            ${m.strategies && m.strategies.length ? `<div class="tdet-chips">${m.strategies.map((s) => `<span class="tdet-chip">${esc(s)}</span>`).join("")}</div>` : ""}
            ${(m.sources && m.sources.length) ? `<div class="tdet-src">${sources(m)}</div>` : ""}
          </div>
          <header class="tpanel-h twire-head">
            <div class="tchips" id="mgr-tabs">
              <button type="button" class="tchip is-on" data-p="news">News</button>
              <button type="button" class="tchip" data-p="funds">Funds${fs.length ? " " + fs.length : ""}</button>
              <button type="button" class="tchip" data-p="clos">CLOs${mgrCloRoster.length ? " " + mgrCloRoster.length : ""}</button>
            </div>
          </header>
          <div class="tpanes" id="mgr-panes">
            ${pane("news", newsPane)}
            ${pane("funds", fundsPane)}
            ${pane("clos", closPane)}
          </div>
        </section>
      </div>
    </div>`;
  // Toggle which pane (News / Funds / CLOs / Key personnel) is shown.
  const tabs = document.getElementById("mgr-tabs");
  if (tabs) tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    tabs.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    const p = b.dataset.p;
    document.querySelectorAll("#mgr-panes .tpane").forEach((el) => { el.hidden = el.dataset.p !== p; });
  });
  // Deep link to a specific story focuses its row in the News pane.
  applyPendingFocus("manager");
}

// Drill-down from a manager's CLO roster: the news/activity for one CLO vehicle.
// Route: #/clo/<managerId>/<encoded CLO name>.
function viewClo(mid, encName) {
  const m = managerById[mid];
  if (!m) return notFound();
  const name = decodeURIComponent(encName || "");
  const mgrClo = [
    ...dealsForManager(mid).filter((d) => d.clo).map((d) => ({ ...d, _kind: "deal" })),
    ...intelForManager(mid).filter((i) => i.clo).map((i) => ({ ...i, _kind: "intel" })),
  ];
  const roster = cloRosterFor(mgrClo);
  const c = roster.find((x) => x.name === name) || roster.find((x) => x.name.toLowerCase() === name.toLowerCase());
  if (!c) return notFound();
  const items = [...c.items].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const otherClos = roster.filter((r) => r.name !== c.name);
  const metrics = [
    ["Vintage", c.vintage || "—"], ["Size", c.size || "—"],
    ["Items", c.items.length], ["Manager", esc(m.name)],
  ];
  const kvFig = [
    ["Vintage", c.vintage || "—"], ["Size", c.size || "—"],
    ["Items", c.items.length], ["Manager CLOs", roster.length],
  ];
  const otherRail = otherClos.length
    ? `<ul class="tmini">${otherClos.map((r) => `<li class="tmini-row clickable" data-href="#/clo/${mid}/${encodeURIComponent(r.name)}"><span class="tmini-t">${esc(r.name)}<span class="tmini-r">${r.size ? esc(r.size) : ""}</span></span><span class="tmini-m">${r.vintage ? "Vintage " + esc(r.vintage) : "Issued"}</span></li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">No other tracked CLOs from this manager.</p>`;
  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/managers", "Managers"], ["#/manager/" + mid, m.name], [null, c.name]])}
      <div class="tdash-ticker">${metrics.map(([l, v]) => `<span class="tmet"><b>${v}</b> ${esc(l)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-2">
        <section class="tcol tcol-c">
          <div class="tdet-id">
            <h1>${esc(c.name)}</h1>
            <div class="tdet-sub">CLO · managed by ${link("#/manager/" + mid, m.name)}${c.vintage ? ` · Vintage ${esc(c.vintage)}` : ""}${c.size ? ` · ${esc(c.size)}` : ""}</div>
            <div class="tdet-chips"><span class="tdet-chip">Structured Credit</span>${c.vintage ? `<span class="tdet-chip">Vintage ${esc(c.vintage)}</span>` : ""}</div>
          </div>
          <header class="tpanel-h twire-head"><span>Issuance, pricings, resets &amp; news</span><span class="tpanel-x">CLO wire</span></header>
          <ul class="twire compact-list" id="clo-wire">${items.length ? items.map((x) => crWireRow(x, "")).join("") : '<li class="muted small tw-empty">No tracked activity for this CLO yet.</li>'}</ul>
        </section>
        <aside class="tcol tcol-r">
          ${railPanel("Key figures", "", `<dl class="tkv">${kvFig.map(([l, v]) => `<div><dt>${esc(l)}</dt><dd>${v}</dd></div>`).join("")}</dl>`)}
          ${railPanel("Manager", "", `<ul class="tmini"><li class="tmini-row clickable" data-href="#/manager/${mid}"><span class="tmini-t">${esc(m.name)}</span><span class="tmini-m">${esc(m.hq || "")}</span></li></ul>`)}
          ${railPanel("Other CLOs from " + esc(m.name), otherClos.length ? String(otherClos.length) : "", otherRail)}
        </aside>
      </div>
    </div>`;
  applyPendingFocus("clos");
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

function viewLp(id) {
  const l = lpById[id];
  if (!l) return notFound();
  const pcAum = l.pcAllocationPct != null ? (l.aum * l.pcAllocationPct / 100) : null;
  const matches = funds.filter((x) => l.strategies.includes(x.strategy) && (x.status === "Open" || x.status === "First Close" || x.status === "Pre-marketing"));
  const mf = pageList(matches, "lp:" + l.id + ":funds", "");

  const commits = commitmentsForLp(l.id);
  const metrics = [
    ["AUM", "€" + l.aum + "bn"], ["PC alloc", pct(l.pcAllocationPct)],
    ["Implied PC", pcAum != null ? "€" + pcAum.toFixed(1) + "bn" : "—"],
    ["Ticket", eur(l.typicalTicket)], ["Commitments", commits.length], ["Matches", matches.length],
  ];
  const kvFig = [
    ["Total AUM", "€" + l.aum + "bn"], ["PC allocation", pct(l.pcAllocationPct)],
    ["Implied PC AUM", pcAum != null ? "€" + pcAum.toFixed(1) + "bn" : "—"], ["Typical ticket", eur(l.typicalTicket)],
  ];
  const commitsBody = commits.length
    ? `<ul class="tmini">${commits.map((c) => `<li class="tmini-row clickable" data-href="#/manager/${c.managerId}"><span class="tmini-t">${esc(managerById[c.managerId].name)}${c.fundId && fundById[c.fundId] ? `<span class="tmini-r">${esc(fundById[c.fundId].name)}</span>` : ""}</span>${c.note ? `<span class="tmini-m">${esc(c.note)}</span>` : ""}</li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">No specific commitments publicly disclosed.</p>`;
  const matchesBody = matches.length
    ? `<ul class="tmini">${mf.shown.map((x) => `<li class="tmini-row clickable" data-href="#/fund/${x.id}"><span class="tmini-t">${esc(x.name)}</span><span class="tmini-m">${esc(managerById[x.managerId].name)} · ${esc(x.strategy)} · ${esc(x.status)}</span></li>`).join("")}${mf.more}</ul>`
    : `<p class="tw-empty muted small">No matching live funds.</p>`;

  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/lps", "Investors"], [null, l.name]])}
      <div class="tdash-ticker">${metrics.map(([lab, v]) => `<span class="tmet"><b>${v}</b> ${esc(lab)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-2">
        <section class="tcol tcol-c">
          <div class="tdet-id">
            <h1>${nameCell("lp", l.id, esc(l.name))}</h1>
            <div class="tdet-sub">${esc(l.type)} · ${esc(l.hq)}</div>
            ${l.notes ? `<p class="tdet-desc">${esc(l.notes)}</p>` : ""}
            <div class="tdet-chips"><span class="tdet-chip">${esc(l.mandateStatus)}</span>${l.strategies.map((s) => `<span class="tdet-chip">${esc(s)}</span>`).join("")}</div>
          </div>
          <header class="tpanel-h twire-head"><span>Known commitments</span><span class="tpanel-x">${commits.length}</span></header>
          <div id="lp-commits">${commitsBody}</div>
        </section>
        <aside class="tcol tcol-r">
          ${railPanel("Key figures", "", `<dl class="tkv">${kvFig.map(([lab, v]) => `<div><dt>${esc(lab)}</dt><dd>${v}</dd></div>`).join("")}</dl>`)}
          ${railPanel("Strategies of interest", "", `<div class="tdet-chips" style="padding:9px 12px">${l.strategies.map((s) => `<span class="tdet-chip">${esc(s)}</span>`).join("")}</div>`)}
          ${railPanel("Matching funds in market", String(matches.length), matchesBody)}
        </aside>
      </div>
    </div>`;
}

// =============================== INTELLIGENCE ===============================
const INTEL_TYPES = ["Launch", "First Close", "Final Close", "Mandate", "Personnel", "Strategy"];
const intelTypeClass = (t) => ({
  "Launch": "it-launch", "First Close": "it-first", "Final Close": "it-final",
  "Mandate": "it-mandate", "Personnel": "it-personnel", "Strategy": "it-strategy",
}[t] || "");

// The headline links straight to the source; the manager sits inline beside the
// headline (a link to its profile), consistently across every feed.
function intelRow(i, mgr) {
  const m = i.managerId ? managerById[i.managerId] : null;
  const ftarget = i.fundId ? `#/fund/${i.fundId}` : (m ? `#/manager/${m.id}` : null);
  const tag = m ? link(`#/manager/${m.id}`, m.name, "muted small") : '<span class="muted small">Market-wide</span>';
  const head = i.sourceUrl
    ? `<a href="${esc(i.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="intel-head">${esc(i.headline)}</a>`
    : (ftarget ? link(ftarget, i.headline, "intel-head") : `<span class="intel-head">${esc(i.headline)}</span>`);
  return `<div class="intel-row" id="row-${i.id}" data-fkey="${esc(feedDedupKey(i))}">
    <div class="intel-meta">${metaDate(i.date)}</div>
    <div class="intel-body"><div class="intel-title-line">${head}${tag ? `<span class="intel-src-inline muted small">${tag}</span>` : ""}${saveBtn(i.id)}</div><p class="muted small">${esc(i.summary)}</p></div>
  </div>`;
}

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
      ${rows.length ? feedHtml(rows, "intel", intelRow, JSON.stringify(f)) : '<p class="empty">No intelligence items match these filters.</p>'}
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
const dealTypeClass = (t) => ({
  "Investment": "dt-invest", "Financing": "dt-fin", "Disposal / Exit": "dt-exit",
  "Refinancing": "dt-refi", "Restructuring": "dt-restr", "Bankruptcy / Distress": "dt-bank",
  "Acquisition": "dt-acq", "NPL / Portfolio": "dt-npl", "Continuation Vehicle": "dt-cv",
  "Unitranche": "dt-fin", "Structured Credit": "dt-invest", "NAV / Fund Finance": "dt-refi",
}[t] || "");

// The headline links straight to the source; the manager sits inline beside the
// headline (a link to its profile), consistently across every feed.
function dealRow(d, mgr) {
  const m = d.managerId ? managerById[d.managerId] : null;
  const tgt = d.fundId ? `#/fund/${d.fundId}` : (m ? `#/manager/${m.id}` : null);
  const tag = m ? link(`#/manager/${m.id}`, m.name, "muted small") : "";
  const head = d.sourceUrl
    ? `<a href="${esc(d.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="intel-head">${esc(d.headline)}</a>`
    : (tgt ? link(tgt, d.headline, "intel-head") : `<span class="intel-head">${esc(d.headline)}</span>`);
  return `<div class="intel-row" id="row-${d.id}" data-fkey="${esc(feedDedupKey(d))}">
    <div class="intel-meta">${metaDate(d.date)}</div>
    <div class="intel-body"><div class="intel-title-line">${head}${tag ? `<span class="intel-src-inline muted small">${tag}</span>` : ""}${saveBtn(d.id)}</div><p class="muted small">${esc(d.summary)}</p></div>
  </div>`;
}

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
      ${rows.length ? feedHtml(rows, "deals", dealRow, JSON.stringify(f)) : '<p class="empty">No deal items match these filters.</p>'}
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

  const feedRow = (x) => x._kind === "deal" ? dealRow(x) : intelRow(x);

  app.innerHTML = `
    <div class="page-head"><div class="ph-head-top"><h1>CLOs</h1>${focusToggle()}</div><p class="muted">${rows.length} of ${all.length} items · collateralised loan obligation pricings, platforms, funds, ETFs &amp; personnel${f.period ? ` · <strong>${esc(f.period)}</strong> <button type="button" class="link-btn" id="clear-period">clear quarter ✕</button>` : ""}</p></div>
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label><div class="filters">
      <label class="filter search"><span>Search</span><input type="search" data-filter="q" placeholder="Keyword…" value="${esc(f.q)}"></label>
      ${multiFilter("clos:kind", "Source", ["Deal", "Fundraising"], f.kind)}
      ${multiFilter("clos:year", "Year", [...new Set(all.map((x) => yearOf(x.date)).filter(Boolean))].sort((a, b) => b.localeCompare(a)), f.year)}
    </div>
    <section class="card">
      ${rows.length ? feedHtml(rows, "clos", feedRow, JSON.stringify(f)) : '<p class="empty">No CLO items match these filters.</p>'}
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
    <section class="card">${rows.length ? feedFlat(rows, "news", unifiedNewsRow, JSON.stringify(f)) : '<p class="empty">No items match your search.</p>'}</section>`;
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
  const row = (x) => x._kind === "deal" ? dealRow(x) : x._kind === "intel" ? intelRow(x) : newsRowFull(x);
  const sig = JSON.stringify([...getSavedC()].sort());
  return `<section class="card" id="saved-section"><h2>Saved items <span class="muted">(${items.length})</span></h2>${items.length
    ? feedHtml(items, "saved", row, sig)
    : '<p class="muted small">No saved items yet — click <strong>☆ Save</strong> on any news, deal, fundraising or CLO item to keep it here.</p>'}</section>`;
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
  const feedRow = (x) => x._kind === "deal" ? dealRow(x)
    : x._kind === "intel" ? intelRow(x)
    : `<div class="intel-row"><div class="intel-meta"><span class="muted small">${fmtDate(x.date)}</span></div><div class="intel-body"><div class="intel-title-line"><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" class="intel-head">${esc(x.title)}</a>${saveBtn(newsSaveId(x))}</div><div>${link(`#/manager/${x._mid}`, x._mname, "muted small")}${x.outlet ? ` · <span class="muted small">${esc(x.outlet)}</span>` : ""}</div></div></div>`;

  if (fm.length + ff.length + fl.length === 0) {
    app.innerHTML = `<div class="page-head"><h1>My Watchlist</h1></div>
      <section class="card"><p class="muted">You're not following anything yet. Click the ☆ star on any manager, fund or investor to add it here — your watchlist builds a personalised intelligence feed${cloudSync ? " and syncs across your devices" : ""}.</p></section>
      ${savedSectionHtml()}`;
    return;
  }
  const wlSig = JSON.stringify([fm.map((x) => x.id), ff.map((x) => x.id)]);
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
    <section class="card"><h2>News, deals, fundraising &amp; CLOs <span class="muted">(${feed.length})</span></h2>${feed.length ? feedHtml(feed, "watchlist", feedRow, wlSig) : '<p class="muted small">No news, deals or fundraising yet for the managers/funds you follow.</p>'}</section>
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
function breadcrumb(parts) {
  return `<nav class="breadcrumb">${parts.map(([href, label], i) =>
    (href ? link(href, label) : `<span>${esc(label)}</span>`) + (i < parts.length - 1 ? '<span class="sep">/</span>' : "")
  ).join("")}</nav>`;
}

function notFound() {
  app.innerHTML = `<div class="page-head"><h1>Not found</h1><p class="muted">That record doesn't exist. ${link("#/", "Back to dashboard")}.</p></div>`;
}

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

// After navigating to a feed page via a dashboard headline, scroll to and
// briefly highlight the targeted item.
function applyPendingFocus(view) {
  if (!pendingFocus || pendingFocus.view !== view) return;
  const windowed = !!pendingFocus.until; // URL-driven (re-apply until it lapses)
  if (windowed && Date.now() > pendingFocus.until) { pendingFocus = null; return; }
  // Resolve by feed dedup key (news stories, which may render as a deal/intel
  // row) or by element id (structured deal/intel deep links).
  const el = pendingFocus.fkey
    ? [...document.querySelectorAll("[data-fkey]")].find((e) => e.getAttribute("data-fkey") === pendingFocus.fkey)
    : document.getElementById("row-" + pendingFocus.id);
  if (!windowed) pendingFocus = null; // click-set focus is one-shot (unchanged)
  if (!el) return; // row not in the DOM yet (paged out) — a windowed focus retries
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 2200);
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
    pendingFocus = { view, id };
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
  if (row && !e.target.closest("a")) location.hash = row.getAttribute("data-href");
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
document.addEventListener("click", (e) => {
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
    pendingFocus = focusId.startsWith("k:")
      ? { view: route, fkey: decodeURIComponent(focusId.slice(2)), until: Date.now() + 4000 }
      : { view: route, id: focusId, until: Date.now() + 4000 };
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
    default: return notFound();
  }
}

// Swipe-to-change-section gesture removed by request (pull-to-refresh kept).

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
// iPhone: tapping the brand logo refreshes the current page rather than jumping
// back to Glance (the href="/" navigation is the desktop behaviour only).
document.addEventListener("click", (e) => {
  if (e.target.closest(".brand") && window.matchMedia("(max-width: 760px)").matches) {
    e.preventDefault(); location.reload();
  }
});
// Unified ⌘K / Ctrl-K search, mounted in-place (opens over the current app).
import("/palette.js?v=20260719-1").then((m) => m.mountPalette()).catch(() => {});
import("/ptr.js?v=20260719-8").then((m) => m.initPullToRefresh()).catch(() => {});
router();
renderDataStatus();
initNotif();
initWatchlistSync();
initSavedSync();
