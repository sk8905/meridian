// =============================================================================
// Unified cross-desk Saved resolver — shared by the section top bars
// (nav-actions.js). Each app stores its own starred-id set in localStorage; here
// we resolve those ids back to items across Macro, Credit and Legal so every
// page shows the SAME saved list Home shows. Loaded lazily (dynamic import) the
// first time a Saved panel is opened, so the heavy data modules aren't pulled
// into each app's initial load. Mirrors glance.js resolveSaved().
// =============================================================================
import { ARTICLES, NEWS, COMMENTARY } from "/macro/js/content.js";
import { byDateDesc, NEWS_SOURCES, JUDGMENT_SOURCES, srcHost, tidyDomain } from "/util.js?v=20260719-1";
import { deals, intel, managers, HEDGE_FUNDS, HEDGE_INTEL } from "/credit/js/data.js";
import { items, cases, restructurings, firms } from "/legal/js/data.js?v=20260718-10";

// ---- id schemes -------------------------------------------------------------
function _savedHash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
function _savedBase(x) { return (x.url || x.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, ""); }

// ---- source-label helpers (mirror glance.js / credit app.js) ----------------
const _mgrById = new Map(managers.map((m) => [m.id, m]));
const _firmById = new Map((firms || []).map((f) => [f.id, f]));
const _hfById = new Map((HEDGE_FUNDS || []).map((h) => [h.id, h]));
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
// Unified cross-desk Notifications — recent updates tagged by desk (CRD / LEX),
// one consistent list on every page (rendered by the nav-actions.js bell).
// =============================================================================
const judgmentSource = (url) => JUDGMENT_SOURCES[srcHost(url)] || "Judgment";
const NOTIF_WINDOW_DAYS = 7;
const notifTime = (d) => { if (!d) return null; const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : d; const t = Date.parse(s); return isNaN(t) ? null : t; };
function recentNotif(list) {
  const times = list.map((x) => notifTime(x.date)).filter((t) => t != null);
  if (!times.length) return list;
  const cutoff = Math.max(...times) - NOTIF_WINDOW_DAYS * 864e5;
  return list.filter((x) => { const t = notifTime(x.date); return t != null && t >= cutoff; });
}
// Collapse the SAME story arriving from more than one source. The refresh
// routine deliberately MIRRORS a manager's webNews into deals/intel, and a
// headline naming two firms ("X and Y partner…") can also sit in BOTH managers'
// webNews — so an identical headline enters the list two+ times with different
// ids (d:/i:/w:), which nothing else dedups. Key by normalized title, keeping
// the first (deals/intel precede webNews in the build order, so the canonical
// transaction record wins the internal link).
function dedupNotif(list) {
  const seen = new Set();
  return list.filter((x) => {
    const k = String(x.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// The bell is deliberately LIMITED to the deal-flow desks: manager news, deals,
// fundraising & CLOs (Credit — CLO pricings live in `deals`) and legal alerts,
// case law & schemes/RPs (Legal). Macro items (Wire-analysis guidance, data
// prints) and institutional research are excluded — they have their own surfaces.
function creditNotif() {
  const out = [];
  deals.forEach((d) => out.push({ desk: "c", id: "d:" + d.id, date: d.date || "", title: d.headline, source: creditSource(d), href: creditItemHref(d), ext: creditItemExt(d) }));
  intel.forEach((i) => out.push({ desk: "c", id: "i:" + i.id, date: i.date || "", title: i.headline, source: creditSource(i), href: creditItemHref(i), ext: creditItemExt(i) }));
  managers.forEach((m) => (m.webNews || []).forEach((w) => out.push({ desk: "c", id: "w:" + m.id + ":" + (w.url || w.title), date: w.date || "", title: w.title, source: w.outlet || m.name || "", href: "/credit/#/manager/" + m.id + "?focus=k:" + encodeURIComponent(feedDedupKey(w)), ext: false })));
  return recentNotif(dedupNotif(out));
}
function legalNotif() {
  const out = [];
  items.forEach((it) => out.push({ desk: "l", id: "u:" + it.id, date: it.date || "", title: it.title, source: firmName(it.firm), href: it.url || "/legal/#/item/" + encodeURIComponent(it.id), ext: !!it.url }));
  cases.forEach((c) => out.push({ desk: "l", id: "c:" + c.id, date: c.date || "", title: c.name, source: c.url ? judgmentSource(c.url) : (c.citation || "Case"), href: c.url || "/legal/#/", ext: !!c.url }));
  restructurings.forEach((r) => { const u = r.judgmentUrl || r.articleUrl; out.push({ desk: "l", id: "x:" + r.id, date: r.date || "", title: r.company, source: r.firm ? firmName(r.firm) : (r.judgmentUrl ? judgmentSource(r.judgmentUrl) : (r.type === "scheme" ? "Scheme" : "Restructuring plan")), href: u || "/legal/#/", ext: !!u }); });
  return recentNotif(dedupNotif(out));
}
export async function buildNotifs() {
  return [...creditNotif(), ...legalNotif()].sort(byDateDesc);
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
  (Array.isArray(f.hf) ? f.hf : []).forEach((id) => {
    const hf = _hfById.get(id);
    if (hf) out.push({ desk: "c", kind: "Hedge fund", title: hf.name, href: "/credit/#/hf/" + encodeURIComponent(id) });
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
  const hset = new Set(Array.isArray(f.hf) ? f.hf : []);
  const out = [];
  if (hset.size) {
    (HEDGE_INTEL || []).forEach((h) => {
      if (!h.hfId || !hset.has(h.hfId)) return;
      out.push({ desk: "c", title: h.headline, href: h.url || "/credit/#/hf/" + encodeURIComponent(h.hfId), ext: !!h.url, date: h.date, time: h.time, src: h.outlet || (_hfById.get(h.hfId) || {}).name || "" });
    });
  }
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
  return dedupNotif(out)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.time || "").localeCompare(String(a.time || "")))
    .slice(0, 80);
}

// Saved items that ALSO relate to a followed/starred profile — the Bookmarks
// panel's Watchlist tab. This is the INTERSECTION of your saved (☆) items and
// your followed managers / law firms, NOT every piece of their news. Only
// profile-linked saves qualify (a saved deal/intel/press for a followed manager,
// or a saved alert/scheme/plan for a followed firm); a saved macro or Home-wire
// story has no profile, so it never appears here.
export function resolveSavedWatchlist() {
  const rd = (k) => { try { return new Set(JSON.parse(localStorage.getItem(k) || "[]")); } catch { return new Set(); } };
  const cS = rd("meridian.credit.saved"), lS = rd("lexalert.saved");
  let f = {};
  try { f = JSON.parse(localStorage.getItem("meridian.follows") || "{}") || {}; } catch { /* ignore */ }
  const mset = new Set(Array.isArray(f.manager) ? f.manager : []);
  const fset = new Set(Array.isArray(f.firm) ? f.firm : []);
  const out = [];
  deals.forEach((d) => { if (cS.has(d.id) && mset.has(d.managerId)) out.push({ desk: "c", title: d.headline, href: creditItemHref(d), ext: creditItemExt(d), date: d.date, time: d.time, src: (_mgrById.get(d.managerId) || {}).name || creditSource(d) }); });
  intel.forEach((i) => { if (cS.has(i.id) && mset.has(i.managerId)) out.push({ desk: "c", title: i.headline, href: creditItemHref(i), ext: creditItemExt(i), date: i.date, time: i.time, src: (_mgrById.get(i.managerId) || {}).name || creditSource(i) }); });
  managers.forEach((m) => {
    if (!mset.has(m.id)) return;
    [...(m.news || []), ...(m.webNews || [])].forEach((w) => {
      if (cS.has("n" + _savedHash(_savedBase(w) + "|" + m.id))) out.push({ desk: "c", title: w.title, href: "/credit/#/manager/" + m.id + "?focus=k:" + encodeURIComponent(feedDedupKey({ ...w, _mid: m.id })), ext: false, date: w.date, time: w.time, src: w.outlet || m.name });
    });
  });
  items.forEach((it) => { if (lS.has(it.id) && fset.has(it.firm)) out.push({ desk: "l", title: it.title, href: it.url || "/legal/#/item/" + encodeURIComponent(it.id), ext: !!it.url, date: it.date, time: it.time, src: firmName(it.firm) }); });
  restructurings.forEach((r) => { if (lS.has(r.id) && fset.has(r.firm)) { const u = r.judgmentUrl || r.articleUrl; out.push({ desk: "l", title: r.company, href: u || "/legal/#/", ext: !!u, date: r.date, time: r.time, src: r.type === "scheme" ? "Scheme" : "Restructuring plan" }); } });
  return out.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}
