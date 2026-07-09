// =============================================================================
// Meridian Glance — the cross-desk landing. Imports the three apps' data modules
// (same-origin ES modules), renders a sectioned highlight card per platform
// (Macro, Credit, Legal — 3 most-recent items per section), mounts the Credit
// "key rates & credit spreads" bar, and powers a unified ⌘K command palette that
// searches deals, managers, funds, legal alerts, cases, restructurings, macro
// indicators and views — deep-linking into each app. Zero dependencies; loaded
// only once the user is authenticated.
// =============================================================================
// Data modules are versioned (matching each app) so the live Glance busts its
// cache with the twice-daily data refresh instead of serving a stale copy.
import { deals, intel, managers, funds, LAST_CHECKED, LAST_CHECKED_TIME } from "/credit/js/data.js?v=20260708-9";
import { items, cases, restructurings, firmById } from "/legal/js/data.js?v=20260708-8";
import { NEWS, ALERTS, COMMENTARY } from "/macro/js/content.js?v=20260708-27";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || ""));
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? `${+m[3]} ${MON[+m[2] - 1]} ${m[1]}` : (iso || ""); };
const mgrName = (id) => (managers.find((m) => m.id === id) || {}).name || "";

// ---- Notification source labels (kept in sync with each app's copy) --------
// Credit: outlet/wire from sourceUrl, else the manager's own PR (manager name).
// Legal: firm name for alerts/RPs, judgment host for cases. Macro data: series
// source (FRED/ONS/…). Editorial macro guidance has no single external source.
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
const JUDGMENT_SOURCES = {
  "bailii.org": "BAILII", "caselaw.nationalarchives.gov.uk": "National Archives",
  "supremecourt.uk": "Supreme Court", "judiciary.uk": "Judiciary",
};
const srcHost = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } };
const tidyDomain = (host) => { const l = host.split(".").slice(-2, -1)[0] || host; return l ? l.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : ""; };
function creditSource(rec) {
  const host = srcHost(rec.sourceUrl);
  if (host && NEWS_SOURCES[host]) return NEWS_SOURCES[host];
  const nm = rec.managerId ? mgrName(rec.managerId) : "";
  return nm || (host ? tidyDomain(host) : "");
}
const firmName = (id) => (firmById[id] || {}).name || id || "";
const judgmentSource = (url) => { const h = srcHost(url); return JUDGMENT_SOURCES[h] || "Judgment"; };

const MACRO_INDICATORS = [
  ["base_rate", "Base rate"], ["two_year", "2-year yield"], ["core_cpi", "Core inflation"],
  ["services_pmi", "Services PMI"], ["wages", "Wage growth"], ["unemployment", "Unemployment"],
];

let _inited = false;
const fmtRefresh = () => `${fmt(LAST_CHECKED)}${LAST_CHECKED_TIME ? `, ${LAST_CHECKED_TIME}` : ""}`;

export function initGlance() {
  if (_inited) return; _inited = true;
  renderCards();
  initMarkets();
  initRates();
  const rf = document.getElementById("g-refresh");
  if (rf) rf.textContent = `Last refresh ${fmtRefresh()}`;
  initNotifBell();
  wirePalette(buildIndex());
}

// Deep-link a Credit deal/intel record to its exact row in the right feed tab
// (Credit reads ?focus=<id> on load and scrolls/flashes it). CLO-tagged items
// live in the CLOs tab regardless of which section surfaced them.
const creditItemHref = (x, tab) => `/credit/#/${x.clo ? "clos" : tab}?focus=${encodeURIComponent(x.id)}`;

// ---- Highlight cards -------------------------------------------------------
// Each platform card is broken into its natural sections, newest 3 items each.
function renderCards() {
  // ---- Macro: US headlines, UK headlines, upcoming releases (3 each) ----
  const macroNews = (k) => ((NEWS && NEWS[k]) || []).slice().sort(byDateDesc).slice(0, 3);
  const commentary = [
    ...(((COMMENTARY && COMMENTARY.us) || []).map((c) => ({ ...c, cc: "US" }))),
    ...(((COMMENTARY && COMMENTARY.uk) || []).map((c) => ({ ...c, cc: "UK" }))),
  ].sort(byDateDesc).slice(0, 3);
  const headline = (n) => item(n.url, n.title, `${fmt(n.date)}${n.source ? " · " + n.source : ""}`, true);
  sec("m", 1, "US headlines", macroNews("us").map(headline));
  sec("m", 2, "UK headlines", macroNews("uk").map(headline));
  sec("m", 3, "Market commentary", commentary.map((c) => item(c.url, c.title, `${c.cc} · ${fmt(c.date)}${c.source ? " · " + c.source : ""}`, true)));

  // ---- Credit: deals, fundraising, CLOs ----
  const dealsR = [...deals].filter((d) => !d.clo).sort(byDateDesc).slice(0, 3);
  const intelR = [...intel].filter((i) => !i.clo).sort(byDateDesc).slice(0, 3);
  const cloR = [...deals.filter((d) => d.clo), ...intel.filter((i) => i.clo)].sort(byDateDesc).slice(0, 3);
  const mgrSuffix = (x) => (mgrName(x.managerId) ? " · " + mgrName(x.managerId) : "");
  sec("c", 1, "Deals", dealsR.map((d) => item(creditItemHref(d, "deals"), d.headline, `${fmt(d.date)}${mgrSuffix(d)}`)));
  sec("c", 2, "Fundraising", intelR.map((i) => item(creditItemHref(i, "intel"), i.headline, `${i.type || "Fundraising"} · ${fmt(i.date)}${mgrSuffix(i)}`)));
  sec("c", 3, "CLOs", cloR.map((c) => item(creditItemHref(c, "clos"), c.headline, `${fmt(c.date)}${mgrSuffix(c)}`)));

  // ---- Legal: alerts, case law, schemes & RPs ----
  const alerts = [...items].filter((i) => i.date).sort(byDateDesc).slice(0, 3);
  const caseLaw = [...cases].sort(byDateDesc).slice(0, 3);
  const rx = [...restructurings].filter((r) => r.date).sort(byDateDesc).slice(0, 3);
  sec("l", 1, "Alerts", alerts.map((i) => item(`/legal/#/item/${encodeURIComponent(i.id)}`, i.title, `${fmt(i.date)}${i.firm ? " · " + i.firm : ""}`)));
  sec("l", 2, "Case law", caseLaw.map((c) => item(`/legal/#/cases?case=${encodeURIComponent(c.id)}`, c.name, `${fmt(c.date)}${c.court ? " · " + c.court : ""}`)));
  sec("l", 3, "Schemes & RPs", rx.map((r) => item(`/legal/#/restructurings?m=${encodeURIComponent(r.id)}`, r.company, `${r.type === "scheme" ? "Scheme" : "Restructuring plan"} · ${fmt(r.date)}`)));
}
const sec = (key, n, title, arr) => setHTML(`${key}-sec${n}`, subHead(title) + rows(arr));
function item(href, title, meta, ext) {
  const a = ext ? ` target="_blank" rel="noopener noreferrer"` : "";
  return `<a class="g-item" href="${esc(href)}"${a}><span class="t">${esc(title)}</span><span class="m">${esc(meta)}</span></a>`;
}
const rows = (arr) => { const h = arr.filter(Boolean).join(""); return h || `<div class="g-empty">Nothing to show yet.</div>`; };
const subHead = (t) => `<div class="g-sub-h">${esc(t)}</div>`;
const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

// ---- Key rates & credit spreads (ported from Credit) -----------------------
function fmtRate(v, unit) {
  if (v == null) return "—";
  return unit === "bp" ? `${Math.round(v * 100)} bp` : `${v.toFixed(2)}%`;
}
function ratesTile(x) {
  const val = fmtRate(x.value, x.unit);
  let chg = '<span class="rate-chg flat">·</span>';
  if (x.change != null && x.value != null) {
    const c = x.unit === "bp" ? Math.round(x.change * 100) : +x.change.toFixed(2);
    const dir = c > 0 ? "up" : c < 0 ? "down" : "flat";
    const arrow = c > 0 ? "▲" : c < 0 ? "▼" : "·";
    const mag = x.unit === "bp" ? `${Math.abs(c)} bp` : Math.abs(c).toFixed(2);
    chg = `<span class="rate-chg ${dir}">${arrow} ${mag}</span>`;
  }
  const asOf = x.asOf ? ` as of ${esc(x.asOf)}` : "";
  const title = ` title="${esc(x.label)}${asOf} — open source ↗"`;
  const tag = x.href ? "a" : "div";
  const attrs = x.href ? ` href="${esc(x.href)}" target="_blank" rel="noopener noreferrer"` : "";
  return `<${tag} class="rate-tile"${attrs}${title}><span class="rate-label">${esc(x.label)}</span><span class="rate-val">${val}</span>${chg}</${tag}>`;
}
function initRates() {
  const el = document.getElementById("g-rates");
  if (!el) return;
  fetch("/api/rates?v=9")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => {
      const rowsData = d.rates || [];
      el.innerHTML = rowsData.length
        ? rowsData.map(ratesTile).join("") +
          '<a class="rate-src" href="https://fred.stlouisfed.org/" target="_blank" rel="noopener noreferrer">Source: FRED · ECB · NY Fed · US Treasury ↗</a>'
        : '<span class="g-loading">Market rates unavailable right now.</span>';
    })
    .catch(() => { el.innerHTML = '<span class="g-loading">Market rates unavailable right now.</span>'; });
}

// ---- Market open / closed indicator ----------------------------------------
// Primary source is Yahoo's authoritative `marketState` (REGULAR = open),
// forwarded by /api/markets — it already accounts for holidays and half-days.
// The clock-based schedule below is only a FALLBACK for tiles that fell back to
// FRED/Stooq (which carry no session field), so a dot is always shown.
const MKT_TYPE = {
  "S&P 500": "us_equity", "NASDAQ 100": "us_equity", // NYSE/Nasdaq
  "IGWD": "lse_equity", "EMEE": "lse_equity",         // London Stock Exchange
  "Brent": "futures", "WTI": "futures", "Gold": "futures", // CME/ICE Globex
  "Bitcoin": "crypto",                                 // 24/7
};
// Current weekday (0=Sun) + hour + minute in a given IANA timezone (DST-aware).
function zonedNow(tz) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const g = (t) => (parts.find((p) => p.type === t) || {}).value;
  const dow = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[g("weekday")];
  let h = +g("hour"); if (h === 24) h = 0; // some engines emit "24" at midnight
  return { dow, h, m: +g("minute") };
}
function marketOpen(type) {
  if (type === "crypto") return true;
  if (type === "us_equity") {
    const { dow, h, m } = zonedNow("America/New_York");
    if (dow === 0 || dow === 6) return false;
    const t = h * 60 + m; return t >= 570 && t < 960; // 09:30–16:00 ET
  }
  if (type === "lse_equity") {
    const { dow, h, m } = zonedNow("Europe/London");
    if (dow === 0 || dow === 6) return false;
    const t = h * 60 + m; return t >= 480 && t < 990; // 08:00–16:30 London
  }
  if (type === "futures") {
    // CME Globex: Sun 18:00 → Fri 17:00 ET, with a daily 17:00–18:00 ET halt.
    const { dow, h } = zonedNow("America/New_York");
    if (dow === 6) return false;      // Saturday
    if (dow === 0) return h >= 18;    // Sunday reopen 18:00 ET
    if (dow === 5) return h < 17;     // Friday close 17:00 ET
    return h !== 17;                  // Mon–Thu: closed 17:00–17:59 ET
  }
  return true;
}
// Descriptive tooltip for each Yahoo session state (dot is green only in the
// regular session; pre/post/closed are all red but read differently on hover).
const MKT_STATE_LABEL = {
  REGULAR: "Market open", PRE: "Pre-market", PREPRE: "Pre-market",
  POST: "After-hours", POSTPOST: "After-hours", CLOSED: "Market closed",
};
function marketDot(x) {
  let open, tip;
  if (x.marketState) {                       // authoritative — from Yahoo
    open = x.marketState === "REGULAR";
    tip = MKT_STATE_LABEL[x.marketState] || (open ? "Market open" : "Market closed");
  } else {                                    // fallback — clock-based schedule
    const type = MKT_TYPE[x.label];
    if (!type) return "";
    open = marketOpen(type);
    tip = open ? "Market open" : "Market closed";
  }
  const state = open ? "open" : "closed";
  return ` <span class="mkt-dot ${state}" title="${esc(tip)}" aria-label="${esc(tip)}"></span>`;
}

// ---- Markets banner: equity indices + ETFs (same tile style as the rates) --
function marketTile(x) {
  // Thousands+ round DOWN to a whole number; smaller prices keep two decimals.
  let val = "—";
  if (x.value != null) {
    const n = Number(x.value);
    val = n >= 1000
      ? Math.floor(n).toLocaleString("en-US", { maximumFractionDigits: 0 })
      : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  let chg = '<span class="rate-chg flat">·</span>';
  if (x.changePct != null && x.value != null) {
    const c = +Number(x.changePct).toFixed(2);
    const dir = c > 0 ? "up" : c < 0 ? "down" : "flat";
    const arrow = c > 0 ? "▲" : c < 0 ? "▼" : "·";
    chg = `<span class="rate-chg ${dir}">${arrow} ${Math.abs(c).toFixed(2)}%</span>`;
  }
  const asOf = x.asOf ? ` as of ${esc(x.asOf)}` : "";
  const title = ` title="${esc(x.label)}${asOf} — open source ↗"`;
  const tag = x.href ? "a" : "div";
  const attrs = x.href ? ` href="${esc(x.href)}" target="_blank" rel="noopener noreferrer"` : "";
  return `<${tag} class="rate-tile"${attrs}${title}><span class="rate-label">${esc(x.label)}${marketDot(x)}</span><span class="rate-val">${val}</span>${chg}</${tag}>`;
}
function initMarkets() {
  const el = document.getElementById("g-markets");
  if (!el) return;
  fetch("/api/markets?v=6")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => {
      const rows = d.markets || [];
      el.innerHTML = rows.length
        ? rows.map(marketTile).join("") +
          '<a class="rate-src" href="https://finance.yahoo.com/" target="_blank" rel="noopener noreferrer">Source: Yahoo Finance · FRED ↗</a>'
        : '<span class="g-loading">Markets unavailable right now.</span>';
    })
    .catch(() => { el.innerHTML = '<span class="g-loading">Markets unavailable right now.</span>'; });
}

// ---- Notifications: aggregate the three apps' unread counts ----------------
// Each app defines its own notification set + per-user "seen" ids (synced via
// /api/notif-<app>, KV keyed on the Access email, with localStorage as cache).
// Glance replays that model for all three and sums the unread counts on one bell.
function creditNotif() {
  const out = [];
  deals.forEach((d) => out.push({ id: "d:" + d.id, date: d.date || "", kind: d.type, title: d.headline, source: creditSource(d), href: creditItemHref(d, "deals") }));
  intel.forEach((i) => out.push({ id: "i:" + i.id, date: i.date || "", kind: i.type, title: i.headline, source: creditSource(i), href: creditItemHref(i, "intel") }));
  managers.forEach((m) => (m.webNews || []).forEach((w) => out.push({ id: "w:" + m.id + ":" + (w.url || w.title), date: w.date || "", kind: "News", title: w.title, source: w.outlet || m.name || "", href: "/credit/#/manager/" + m.id })));
  return out.sort(byDateDesc);
}
function legalNotif() {
  const out = [];
  items.forEach((it) => out.push({ id: "u:" + it.id, date: it.date || "", kind: "Alert", title: it.title, source: firmName(it.firm), href: "/legal/#/item/" + encodeURIComponent(it.id) }));
  cases.forEach((c) => out.push({ id: "c:" + c.id, date: c.date || "", kind: c.court || "Case", title: c.name, source: judgmentSource(c.url), href: "/legal/#/cases?case=" + encodeURIComponent(c.id) }));
  restructurings.forEach((r) => out.push({ id: "r:" + r.id, date: r.date || "", kind: r.type === "scheme" ? "Scheme" : "Plan", title: r.company, source: r.firm ? firmName(r.firm) : (r.judgmentUrl ? judgmentSource(r.judgmentUrl) : ""), href: "/legal/#/restructurings?m=" + encodeURIComponent(r.id) }));
  return out.sort(byDateDesc);
}
function macroDataAlerts(series) {
  return (series || []).filter((s) => s.value != null).map((s) => {
    const pct = s.unit === "%";
    const val = `${(+s.value).toFixed(2)}${pct ? "%" : ""}`;
    const country = s.country === "US" ? "US" : "UK";
    let chg = "";
    if (s.change != null && s.change !== 0) chg = ` · ${s.change > 0 ? "▲" : "▼"} ${Math.abs(s.change).toFixed(2)}${pct ? " pp" : ""} MoM`;
    else if (s.change === 0) chg = " · unchanged MoM";
    const flag = (s.key === "services_pmi" && +s.value < 50) ? " — below 50 (contraction)" : "";
    return { id: `d:${s.country}:${s.key}:${s.asOf}:${(+s.value).toFixed(2)}`, kind: "Economic data",
      title: `${country} · ${s.label}: ${val}${flag}${chg}`, source: s.source || "", href: "/macro/#/dashboard", date: s.asOf ? `${s.asOf}-01` : "" };
  });
}
let _macroSeries;
async function macroSeries() {
  if (_macroSeries) return _macroSeries;
  try { const r = await fetch("/api/macro", { headers: { accept: "application/json" } }); if (r.ok) { const d = await r.json(); _macroSeries = (d && d.series) || []; return _macroSeries; } } catch { /* offline */ }
  _macroSeries = []; return _macroSeries;
}
async function macroNotif() {
  const series = await macroSeries();
  const guidance = (ALERTS || []).map((a) => ({ id: a.id, date: a.date || "", kind: a.kind || "Guidance", title: a.title, source: "Meridian analysis", href: "/macro/" + (a.href || "#/commentary") }));
  return [...guidance, ...macroDataAlerts(series)].sort(byDateDesc);
}
const NOTIF_APPS = [
  { key: "credit", tag: "Credit", api: "/api/notif-credit", ls: "meridian.credit.notifSeen", build: creditNotif },
  { key: "legal", tag: "Legal", api: "/api/notif-legal", ls: "meridian.legal.notifSeen", build: legalNotif },
  { key: "macro", tag: "Macro", api: "/api/notif-macro", ls: "meridian.macro.notifSeen", build: macroNotif },
];
async function resolveSeen(api, ls, allIds) {
  let local = null;
  try { const p = JSON.parse(localStorage.getItem(ls) || "null"); local = Array.isArray(p) ? p : null; } catch { /* */ }
  let server = null, cloud = false;
  try { const r = await fetch(api, { headers: { accept: "application/json" } }); if (r.ok) { const d = await r.json(); server = Array.isArray(d.seen) ? d.seen : []; cloud = true; } } catch { /* not behind Access */ }
  const hasHistory = (server && server.length) || (local && local.length);
  const baseline = hasHistory ? [...new Set([...(local || []), ...(server || [])])] : allIds.slice();
  return { baseline, cloud };
}
let _notifApps = null;
async function initNotifBell() {
  const wrap = document.getElementById("g-notif");
  if (!wrap) return;
  const apps = [];
  for (const cfg of NOTIF_APPS) {
    let list = [];
    try { list = await cfg.build(); } catch { list = []; }
    const allIds = list.map((x) => x.id);
    const { baseline, cloud } = await resolveSeen(cfg.api, cfg.ls, allIds);
    const set = new Set(baseline);
    apps.push({ ...cfg, list, allIds, baseline, cloud, unread: list.filter((x) => !set.has(x.id)) });
  }
  _notifApps = apps;
  renderBell();
}
function closeNotifPanel() {
  const p = document.getElementById("g-notif-panel"), b = document.getElementById("g-bell");
  if (p) p.setAttribute("hidden", "");
  if (b) b.setAttribute("aria-expanded", "false");
}
function markAllSeen() {
  (_notifApps || []).forEach((a) => {
    const merged = [...new Set([...a.baseline, ...a.allIds])];
    try { localStorage.setItem(a.ls, JSON.stringify(merged)); } catch { /* */ }
    if (a.cloud) fetch(a.api, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ seen: merged }) }).catch(() => {});
    a.baseline = merged; a.unread = [];
  });
  const badge = document.querySelector("#g-bell .g-badge"); if (badge) badge.remove();
}
function renderBell() {
  const wrap = document.getElementById("g-notif");
  if (!wrap || !_notifApps) return;
  const total = _notifApps.reduce((s, a) => s + a.unread.length, 0);
  const tagged = (a, arr) => arr.map((x) => ({ ...x, tag: a.tag, key: a.key }));
  const unreadAll = _notifApps.flatMap((a) => tagged(a, a.unread)).sort(byDateDesc);
  const listAll = _notifApps.flatMap((a) => tagged(a, a.list)).sort(byDateDesc);
  const show = (total ? unreadAll : listAll).slice(0, 24);
  const row = (x) => `<a class="g-np-item" href="${esc(x.href)}"><span class="g-np-tag ${x.key}">${esc(x.tag)}</span><span class="g-np-txt"><span class="g-np-t">${esc(x.title)}</span><span class="g-np-m">${esc(x.kind)}${x.date ? " · " + esc(fmt(x.date)) : ""}${x.source ? ` · <span class="g-np-src">${esc(x.source)}</span>` : ""}</span></span></a>`;
  wrap.innerHTML = `
    <button type="button" class="g-bell" id="g-bell" aria-haspopup="true" aria-expanded="false" aria-label="Notifications${total ? ` — ${total} new` : ""}">
      <span aria-hidden="true">🔔</span>${total ? `<span class="g-badge">${total > 9 ? "9+" : total}</span>` : ""}
    </button>
    <div class="g-notif-panel" id="g-notif-panel" role="menu" hidden>
      <div class="g-np-head">${total ? `${total} new update${total > 1 ? "s" : ""}` : "No new updates"} <span class="g-np-sub">· checked ${esc(fmtRefresh())}</span></div>
      <div class="g-np-list">${show.length ? show.map(row).join("") : '<div class="g-np-empty">Nothing yet.</div>'}</div>
    </div>`;
  const bell = document.getElementById("g-bell"), panel = document.getElementById("g-notif-panel");
  bell.addEventListener("click", (e) => {
    e.stopPropagation();
    if (panel.hasAttribute("hidden")) { panel.removeAttribute("hidden"); bell.setAttribute("aria-expanded", "true"); markAllSeen(); }
    else { closeNotifPanel(); }
  });
  document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) closeNotifPanel(); });
}

// ---- Unified search index --------------------------------------------------
// Result priority (rank): managers first, then funds / CLOs, then dated items
// (deals, intel, legal — newest first), then macro chart shortcuts, then views.
function buildIndex() {
  const idx = [];
  const add = (tag, title, sub, href, rank, date) => idx.push({ tag, title, sub, href, rank, date: date || "", hay: (title + " " + sub).toLowerCase() });

  add("view", "Glance", "Cross-desk briefing", "/", 4, "");
  add("credit", "Credit dashboard", "Meridian Credit", "/credit/", 4, "");
  add("legal", "Legal dashboard", "Meridian Legal", "/legal/", 4, "");
  add("macro", "Macro dashboard", "Meridian Macro", "/macro/", 4, "");
  [["commentary", "Rate outlook"], ["cycle", "Cycle"], ["bubble", "Bubble risk"], ["chart", "Chart"]]
    .forEach(([k, l]) => add("macro", `Macro — ${l}`, "View", `/macro/#/${k}`, 4, ""));

  managers.forEach((m) => add("credit", m.name, "Manager", `/credit/#/manager/${encodeURIComponent(m.id)}`, 0, ""));
  funds.forEach((f) => add("credit", f.name, `Fund${f.managerId && mgrName(f.managerId) ? " · " + mgrName(f.managerId) : ""}`, `/credit/#/fund/${encodeURIComponent(f.id)}`, 1, ""));
  deals.forEach((d) => add("credit", d.headline, `${d.clo ? "CLO" : "Deal"} · ${fmt(d.date)}${mgrName(d.managerId) ? " · " + mgrName(d.managerId) : ""}`, creditItemHref(d, "deals"), d.clo ? 1 : 2, d.date));
  intel.forEach((i) => add("credit", i.headline, `${i.clo ? "CLO · " : ""}${i.type || "Fundraising"} · ${fmt(i.date)}${mgrName(i.managerId) ? " · " + mgrName(i.managerId) : ""}`, creditItemHref(i, "intel"), i.clo ? 1 : 2, i.date));

  items.forEach((i) => add("legal", i.title, `Legal alert${i.firm ? " · " + i.firm : ""}${i.date ? " · " + fmt(i.date) : ""}`, `/legal/#/item/${encodeURIComponent(i.id)}`, 2, i.date));
  cases.forEach((c) => add("legal", c.name, `Case · ${c.court || ""}${c.citation ? " · " + c.citation : ""}`, `/legal/#/cases?case=${encodeURIComponent(c.id)}`, 2, c.date));
  restructurings.forEach((r) => add("legal", r.company, `${r.type === "scheme" ? "Scheme" : "Restructuring plan"}${r.citation ? " · " + r.citation : ""}`, `/legal/#/restructurings?m=${encodeURIComponent(r.id)}`, 2, r.date));

  ["US", "UK"].forEach((ctry) => MACRO_INDICATORS.forEach(([k, l]) =>
    add("macro", `${ctry} ${l}`, "Open in Chart", `/macro/#/chart?add=${ctry}:${k}`, 3, "")));

  return idx;
}

// ---- Command palette -------------------------------------------------------
function wirePalette(idx) {
  const overlay = document.getElementById("cmdk");
  const input = document.getElementById("cmdk-input");
  const results = document.getElementById("cmdk-results");
  let sel = 0, current = [];

  const defaults = idx.filter((e) => e.tag === "view").slice(0, 8);

  function score(e, q) {
    const t = e.title.toLowerCase();
    if (t === q) return 0;
    if (t.startsWith(q)) return 1;
    if (t.includes(q)) return 2;
    return e.hay.includes(q) ? 3 : -1;
  }
  function search(q) {
    q = q.trim().toLowerCase();
    if (!q) return defaults;
    const toks = q.split(/\s+/);
    return idx
      .map((e) => ({ e, s: toks.every((t) => e.hay.includes(t)) ? score(e, q) : -1 }))
      .filter((x) => x.s >= 0 || x.e.hay.includes(toks[0]))
      .map((x) => ({ e: x.e, s: x.s < 0 ? 4 : x.s }))
      .sort((a, b) =>
        a.e.rank - b.e.rank ||
        (a.e.rank === 2 ? String(b.e.date).localeCompare(String(a.e.date)) : 0) ||
        a.s - b.s ||
        a.e.title.localeCompare(b.e.title))
      .slice(0, 40).map((x) => x.e);
  }
  function draw() {
    if (!current.length) { results.innerHTML = `<div class="cmdk-empty">No matches.</div>`; return; }
    results.innerHTML = current.map((e, i) => `
      <div class="cmdk-row${i === sel ? " sel" : ""}" data-i="${i}">
        <span class="cmdk-tag ${e.tag}">${e.tag === "view" ? "Go" : e.tag}</span>
        <span class="cmdk-txt"><span class="cmdk-t">${esc(e.title)}</span><span class="cmdk-s">${esc(e.sub)}</span></span>
      </div>`).join("");
    const s = results.querySelector(".cmdk-row.sel"); if (s) s.scrollIntoView({ block: "nearest" });
  }
  function refresh() { current = search(input.value); sel = 0; draw(); }
  function go(e) { if (e) window.location.href = e.href; }

  function open() { overlay.classList.add("open"); input.value = ""; refresh(); setTimeout(() => input.focus(), 10); }
  function close() { overlay.classList.remove("open"); }

  document.getElementById("open-cmdk").addEventListener("click", open);
  overlay.querySelector("[data-close]").addEventListener("click", close);
  input.addEventListener("input", refresh);
  results.addEventListener("click", (ev) => { const r = ev.target.closest(".cmdk-row"); if (r) go(current[+r.getAttribute("data-i")]); });
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowDown") { ev.preventDefault(); sel = Math.min(sel + 1, current.length - 1); draw(); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); sel = Math.max(sel - 1, 0); draw(); }
    else if (ev.key === "Enter") { ev.preventDefault(); go(current[sel]); }
    else if (ev.key === "Escape") { close(); }
  });
  const isTyping = (t) => { const tag = (t && t.tagName || "").toLowerCase(); return !!t && (t.isContentEditable || tag === "input" || tag === "textarea" || tag === "select"); };
  window.addEventListener("keydown", (ev) => {
    if (ev.key === "/" && !ev.metaKey && !ev.ctrlKey && !ev.altKey && !isTyping(ev.target) && !overlay.classList.contains("open")) { ev.preventDefault(); open(); }
    else if (ev.key === "Escape" && overlay.classList.contains("open")) { close(); }
  });
  // Arriving from an in-app ⌘K (which routes to "/#find") opens search immediately.
  if (location.hash === "#find") { history.replaceState(null, "", "/"); open(); }
}
