// =============================================================================
// Unified cross-desk Saved resolver — shared by the section top bars
// (nav-actions.js). Each app stores its own starred-id set in localStorage; here
// we resolve those ids back to items across Macro, Credit and Legal so every
// page shows the SAME saved list Home shows. Loaded lazily (dynamic import) the
// first time a Saved panel is opened, so the heavy data modules aren't pulled
// into each app's initial load. Mirrors glance.js resolveSaved().
// =============================================================================
import { ARTICLES, NEWS, COMMENTARY, ALERTS } from "/macro/js/content.js";
import { deals, intel, managers, research } from "/credit/js/data.js";
import { items, cases, restructurings, firms } from "/legal/js/data.js?v=20260718-2";

// ---- id schemes -------------------------------------------------------------
function _savedHash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
function _savedBase(x) { return (x.url || x.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, ""); }

// ---- source-label helpers (mirror glance.js / credit app.js) ----------------
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
const _mgrById = new Map(managers.map((m) => [m.id, m]));
const _firmById = new Map((firms || []).map((f) => [f.id, f]));
const srcHost = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } };
const tidyDomain = (host) => { const l = host.split(".").slice(-2, -1)[0] || host; return l ? l.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : ""; };
const mgrName = (id) => (_mgrById.get(id) || {}).name || "";
const firmName = (id) => (_firmById.get(id) || {}).name || id || "";
function creditSource(rec) {
  const host = srcHost(rec.sourceUrl);
  if (host && NEWS_SOURCES[host]) return NEWS_SOURCES[host];
  const nm = rec.managerId ? mgrName(rec.managerId) : "";
  return nm || (host ? tidyDomain(host) : "");
}
function feedDedupKey(x) {
  const u = (x.url || x.sourceUrl || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
  const generic = !u || /^https?:\/\/[^/]+$/.test(u) || /\/(news-insights|news|press-releases|media|insights|press)$/.test(u);
  if (!generic) return "u:" + u;
  return "t:" + (x.title || x.headline || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}
// Deal/intel headline → source article if we have one, else the manager's page
// (Deals/Fundraising list pages retired); CLOs keep the CLOs tab.
const creditItemHref = (x) => x.sourceUrl
  ? x.sourceUrl
  : (x.managerId ? `/credit/#/manager/${encodeURIComponent(x.managerId)}` : "/credit/#/");
const creditItemExt = (x) => !!x.sourceUrl;

// ---- resolver ---------------------------------------------------------------
export function resolveSaved() {
  const rd = (k) => { try { return new Set(JSON.parse(localStorage.getItem(k) || "[]")); } catch { return new Set(); } };
  const mS = rd("meridian.macro.saved"), cS = rd("meridian.credit.saved"), lS = rd("lexalert.saved");
  const out = [];
  // Macro — article ids are "a" + hash(url|title base).
  [...((ARTICLES && ARTICLES.items) || []), ...((NEWS && NEWS.us) || []), ...((NEWS && NEWS.uk) || []),
   ...((COMMENTARY && COMMENTARY.us) || []), ...((COMMENTARY && COMMENTARY.uk) || [])]
    .forEach((n) => { if (mS.has("a" + _savedHash(_savedBase(n)))) out.push({ desk: "m", title: n.title, href: n.url, ext: true, date: n.date, time: n.time, src: n.source }); });
  // Credit — deals/intel by raw id; manager press by "n" + hash(base|managerId).
  deals.forEach((d) => { if (cS.has(d.id)) out.push({ desk: "c", title: d.headline, href: creditItemHref(d), ext: creditItemExt(d), date: d.date, time: d.time, src: creditSource(d) }); });
  intel.forEach((i) => { if (cS.has(i.id)) out.push({ desk: "c", title: i.headline, href: creditItemHref(i), ext: creditItemExt(i), date: i.date, time: i.time, src: creditSource(i) }); });
  managers.forEach((m) => [...(m.news || []), ...(m.webNews || [])].forEach((w) => {
    if (cS.has("n" + _savedHash(_savedBase(w) + "|" + m.id))) out.push({ desk: "c", title: w.title, href: "/credit/#/manager/" + m.id + "?focus=k:" + encodeURIComponent(feedDedupKey({ ...w, _mid: m.id })), ext: false, date: w.date, time: w.time, src: w.outlet || m.name });
  }));
  // Legal — items/cases/restructurings by raw id.
  items.forEach((it) => { if (lS.has(it.id)) out.push({ desk: "l", title: it.title, href: it.url || "/legal/#/item/" + encodeURIComponent(it.id), ext: !!it.url, date: it.date, time: it.time, src: firmName(it.firm) }); });
  cases.forEach((c) => { if (lS.has(c.id)) out.push({ desk: "l", title: c.name, href: c.url || "/legal/#/", ext: !!c.url, date: c.date, time: c.time, src: c.court }); });
  restructurings.forEach((r) => { if (lS.has(r.id)) out.push({ desk: "l", title: r.company, href: r.judgmentUrl || r.articleUrl || "/legal/#/", ext: !!(r.judgmentUrl || r.articleUrl), date: r.date, time: r.time, src: r.type === "scheme" ? "Scheme" : "Restructuring plan" }); });
  // Home-feed long-press bookmarks (Letters, FT, live headlines — rows with no
  // app saved-id) live in a self-contained Home store; fold them in, deduped by
  // normalised title against the app-store items above.
  try {
    const a = JSON.parse(localStorage.getItem("wire.home.saved") || "[]");
    if (Array.isArray(a)) {
      const seen = new Set(out.map((x) => String(x.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "")));
      a.forEach((o) => {
        if (!o || !o.title) return;
        const k = String(o.title).toLowerCase().replace(/[^a-z0-9]+/g, "");
        if (seen.has(k)) return; seen.add(k);
        out.push({ desk: o.desk || "m", title: o.title, href: o.href || "#", ext: !!o.ext, date: o.date || "", time: o.time || "", src: o.src || "" });
      });
    }
  } catch { /* ignore */ }
  return out.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

// =============================================================================
// Unified cross-desk Notifications — the same three desks' recent updates,
// tagged by desk (MAC / CRD / LEX) so every page shows one consistent list.
// Mirrors glance.js creditNotif()/legalNotif()/macroNotif(). Async because the
// macro economic-data prints come from /api/macro.
// =============================================================================
const JUDGMENT_SOURCES = { "bailii.org": "BAILII", "caselaw.nationalarchives.gov.uk": "National Archives", "supremecourt.uk": "Supreme Court", "judiciary.uk": "Judiciary" };
const judgmentSource = (url) => JUDGMENT_SOURCES[srcHost(url)] || "Judgment";
const NOTIF_WINDOW_DAYS = 7;
const notifTime = (d) => { if (!d) return null; const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : d; const t = Date.parse(s); return isNaN(t) ? null : t; };
function recentNotif(list) {
  const times = list.map((x) => notifTime(x.date)).filter((t) => t != null);
  if (!times.length) return list;
  const cutoff = Math.max(...times) - NOTIF_WINDOW_DAYS * 864e5;
  return list.filter((x) => { const t = notifTime(x.date); return t != null && t >= cutoff; });
}
const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || ""));

function creditNotif() {
  const out = [];
  deals.forEach((d) => out.push({ desk: "c", id: "d:" + d.id, date: d.date || "", title: d.headline, source: creditSource(d), href: creditItemHref(d), ext: creditItemExt(d) }));
  intel.forEach((i) => out.push({ desk: "c", id: "i:" + i.id, date: i.date || "", title: i.headline, source: creditSource(i), href: creditItemHref(i), ext: creditItemExt(i) }));
  (research || []).forEach((r) => out.push({ desk: "c", id: "r:" + r.id, date: r.date || "", title: r.title, source: r.institution, href: r.url, ext: true }));
  managers.forEach((m) => (m.webNews || []).forEach((w) => out.push({ desk: "c", id: "w:" + m.id + ":" + (w.url || w.title), date: w.date || "", title: w.title, source: w.outlet || m.name || "", href: "/credit/#/manager/" + m.id + "?focus=k:" + encodeURIComponent(feedDedupKey(w)), ext: false })));
  return recentNotif(out);
}
function legalNotif() {
  const out = [];
  items.forEach((it) => out.push({ desk: "l", id: "u:" + it.id, date: it.date || "", title: it.title, source: firmName(it.firm), href: it.url || "/legal/#/item/" + encodeURIComponent(it.id), ext: !!it.url }));
  cases.forEach((c) => out.push({ desk: "l", id: "c:" + c.id, date: c.date || "", title: c.name, source: c.url ? judgmentSource(c.url) : (c.citation || "Case"), href: c.url || "/legal/#/", ext: !!c.url }));
  restructurings.forEach((r) => { const u = r.judgmentUrl || r.articleUrl; out.push({ desk: "l", id: "x:" + r.id, date: r.date || "", title: r.company, source: r.firm ? firmName(r.firm) : (r.judgmentUrl ? judgmentSource(r.judgmentUrl) : (r.type === "scheme" ? "Scheme" : "Restructuring plan")), href: u || "/legal/#/", ext: !!u }); });
  return recentNotif(out);
}
function macroNotif(series) {
  const guidance = (ALERTS || []).map((a) => ({ desk: "m", id: "g:" + a.id, date: a.date || "", title: a.title, source: "Wire analysis", href: "/macro/" + (a.href || "#/policy"), ext: false }));
  const prints = (series || []).filter((s) => s.value != null).map((s) => {
    const pct = s.unit === "%"; const val = `${(+s.value).toFixed(2)}${pct ? "%" : ""}`;
    const country = s.country === "US" ? "US" : "UK";
    return { desk: "m", id: `d:${s.country}:${s.key}:${s.asOf}:${(+s.value).toFixed(2)}`, date: s.asOf ? `${s.asOf}-01` : "", title: `${country} · ${s.label}: ${val}`, source: s.source || "", href: `/macro/#/dashboard?focus=${s.country}-${s.key}`, ext: false };
  });
  return [...guidance, ...prints];
}
export async function buildNotifs() {
  let series = [];
  try { const r = await fetch("/api/macro", { headers: { accept: "application/json" } }); if (r.ok) { const d = await r.json(); series = (d && d.series) || []; } } catch { /* offline */ }
  return [...creditNotif(), ...legalNotif(), ...macroNotif(series)].sort(byDateDesc);
}

// ---- Watchlist (managers + law firms) ---------------------------------------
// Reads the same follow store the Credit app's stars write ("meridian.follows");
// firm follows are added by the Home row menu. Resolved to profile links.
export function resolveWatchlist() {
  let f = {};
  try { f = JSON.parse(localStorage.getItem("meridian.follows") || "{}") || {}; } catch { /* ignore */ }
  const out = [];
  (Array.isArray(f.manager) ? f.manager : []).forEach((id) => {
    const m = _mgrById.get(id);
    if (m) out.push({ desk: "c", kind: "Manager", title: m.name, href: "/credit/#/manager/" + encodeURIComponent(id) });
  });
  (Array.isArray(f.firm) ? f.firm : []).forEach((id) => {
    const fm = _firmById.get(id);
    if (fm) out.push({ desk: "l", kind: "Law firm", title: fm.name, href: "/legal/#/firm/" + encodeURIComponent(id) });
  });
  return out.sort((a, b) => a.title.localeCompare(b.title));
}

// Watchlist NEWS — every dated item for the followed managers (deals,
// fundraising/intel, manager press) and law firms (alerts, scheme/plan
// analyses), newest first. Rendered by the Bookmarks panel's Watchlist tab.
export function resolveWatchlistNews() {
  let f = {};
  try { f = JSON.parse(localStorage.getItem("meridian.follows") || "{}") || {}; } catch { /* ignore */ }
  const mset = new Set(Array.isArray(f.manager) ? f.manager : []);
  const fset = new Set(Array.isArray(f.firm) ? f.firm : []);
  const out = [];
  if (mset.size) {
    deals.forEach((d) => { if (mset.has(d.managerId)) out.push({ desk: "c", title: d.headline, href: creditItemHref(d), ext: creditItemExt(d), date: d.date, time: d.time, src: (_mgrById.get(d.managerId) || {}).name || creditSource(d) }); });
    intel.forEach((i) => { if (mset.has(i.managerId)) out.push({ desk: "c", title: i.headline, href: creditItemHref(i), ext: creditItemExt(i), date: i.date, time: i.time, src: (_mgrById.get(i.managerId) || {}).name || creditSource(i) }); });
    managers.forEach((m) => {
      if (!mset.has(m.id)) return;
      const seen = new Set();
      [...(m.news || []), ...(m.webNews || [])].forEach((w) => {
        const k = feedDedupKey(w); if (seen.has(k)) return; seen.add(k);
        out.push({ desk: "c", title: w.title, href: "/credit/#/manager/" + m.id + "?focus=k:" + encodeURIComponent(k), ext: false, date: w.date, time: w.time, src: w.outlet || m.name });
      });
    });
  }
  if (fset.size) {
    items.forEach((i) => { if (fset.has(i.firm)) out.push({ desk: "l", title: i.title, href: i.url || "/legal/#/item/" + encodeURIComponent(i.id), ext: !!i.url, date: i.date, time: i.time, src: (_firmById.get(i.firm) || {}).name || "" }); });
    restructurings.forEach((r) => { if (fset.has(r.firm)) out.push({ desk: "l", title: r.company, href: r.judgmentUrl || r.articleUrl || "/legal/#/", ext: !!(r.judgmentUrl || r.articleUrl), date: r.date, time: r.time, src: r.type === "scheme" ? "Scheme" : "Restructuring plan" }); });
  }
  return out
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.time || "").localeCompare(String(a.time || "")))
    .slice(0, 80);
}
