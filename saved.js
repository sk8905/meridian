// =============================================================================
// Unified cross-desk Saved resolver — shared by the section top bars
// (nav-actions.js). Each app stores its own starred-id set in localStorage; here
// we resolve those ids back to items across Macro, Credit and Legal so every
// page shows the SAME saved list Home shows. Loaded lazily (dynamic import) the
// first time a Saved panel is opened, so the heavy data modules aren't pulled
// into each app's initial load. Mirrors glance.js resolveSaved().
// =============================================================================
import { ARTICLES, NEWS, COMMENTARY } from "/macro/js/content.js";
import { deals, intel, managers } from "/credit/js/data.js";
import { items, cases, restructurings, firms } from "/legal/js/data.js";

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
const creditItemHref = (x, tab) => `/credit/#/${x.clo ? "clos" : tab}?focus=${encodeURIComponent(x.id)}`;

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
  deals.forEach((d) => { if (cS.has(d.id)) out.push({ desk: "c", title: d.headline, href: creditItemHref(d, "deals"), ext: false, date: d.date, time: d.time, src: creditSource(d) }); });
  intel.forEach((i) => { if (cS.has(i.id)) out.push({ desk: "c", title: i.headline, href: creditItemHref(i, "intel"), ext: false, date: i.date, time: i.time, src: creditSource(i) }); });
  managers.forEach((m) => [...(m.news || []), ...(m.webNews || [])].forEach((w) => {
    if (cS.has("n" + _savedHash(_savedBase(w) + "|" + m.id))) out.push({ desk: "c", title: w.title, href: "/credit/#/manager/" + m.id + "?focus=k:" + encodeURIComponent(feedDedupKey({ ...w, _mid: m.id })), ext: false, date: w.date, time: w.time, src: w.outlet || m.name });
  }));
  // Legal — items/cases/restructurings by raw id.
  items.forEach((it) => { if (lS.has(it.id)) out.push({ desk: "l", title: it.title, href: "/legal/#/item/" + encodeURIComponent(it.id), ext: false, date: it.date, time: it.time, src: firmName(it.firm) }); });
  cases.forEach((c) => { if (lS.has(c.id)) out.push({ desk: "l", title: c.name, href: "/legal/#/cases?case=" + encodeURIComponent(c.id), ext: false, date: c.date, time: c.time, src: c.court }); });
  restructurings.forEach((r) => { if (lS.has(r.id)) out.push({ desk: "l", title: r.company, href: "/legal/#/restructurings?m=" + encodeURIComponent(r.id), ext: false, date: r.date, time: r.time, src: r.type === "scheme" ? "Scheme" : "Restructuring plan" }); });
  return out.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}
