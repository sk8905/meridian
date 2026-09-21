// =============================================================================
// manager-signals.js — the manager-first activity engine.
//
// Derives, per covered credit manager, a normalised event stream (deals + intel
// + manager press) with a signal category, plus fundraising status (funds in
// market) and recent-activity windows. One source of truth for the Home
// "Manager wire" column, the manager-profile "what changed" surfacing, and the
// coverage metrics. Pure derivation over the committed data modules — no fetch,
// no state. Dates are "YYYY-MM-DD" (or "YYYY-MM"); ts is epoch-ms for sorting.
// =============================================================================
import { deals, intel, managers, funds } from "/credit/js/data.js";

const _mById = new Map(managers.map((m) => [m.id, m]));
export const managerName = (id) => (_mById.get(id) || {}).name || "";

// Parse a data date (+optional HH:MM) to epoch-ms; a bare YYYY-MM anchors to the 1st.
function tsOf(date, time) {
  if (!date) return 0;
  const d = /^\d{4}-\d{2}$/.test(date) ? date + "-01" : date;
  const withT = time && /^\d{2}:\d{2}/.test(time) ? d + "T" + time : d;
  const ms = Date.parse(withT);
  return Number.isNaN(ms) ? (Date.parse(d) || 0) : ms;
}

// deal.type / intel.type → a coarse signal category (the pill on a wire row).
const DEAL_CAT = {
  "Financing": "financing", "NAV / Fund Finance": "financing", "Refinancing": "financing",
  "Unitranche": "deal", "Investment": "deal", "NPL / Portfolio": "deal", "NPL": "deal",
  "Acquisition": "m&a", "Disposal / Exit": "exit", "Continuation Vehicle": "fundraising",
  "Restructuring": "restructuring", "Bankruptcy / Distress": "restructuring", "Structured Credit": "clo",
};
const INTEL_CAT = {
  "Personnel": "team", "Fundraising": "fundraising", "Final Close": "fundraising",
  "First Close": "fundraising", "Launch": "fundraising", "Strategy": "strategy",
  "Mandate": "mandate", "Ownership": "m&a", "Structured Credit / CLO": "clo", "Equity / PE": "deal",
};
// Short pill label per category.
export const CAT_LABEL = {
  fundraising: "RAISE", deal: "DEAL", financing: "FIN", "m&a": "M&A", exit: "EXIT",
  restructuring: "RX", clo: "CLO", team: "TEAM", strategy: "STRAT", mandate: "MAND", news: "NEWS",
};

const mgrHref = (id) => `/v2/profiles/#/manager/${encodeURIComponent(id)}`;

// ---- De-duplication -------------------------------------------------------
// The same story is routinely recorded more than once for a manager: a raise
// ALSO tagged strategy, a structured deal ALSO carried as press, or two outlets
// with near-identical wording. Collapse them so the wire shows each story ONCE.
// Signals (any one): the same source URL, the same normalised headline, high
// word overlap, or a shared money figure plus other shared words. The kept
// "representative" prefers a specific tag over generic NEWS, then a linked
// source, then the most recent. Applied per-manager, so matching can be
// aggressive without risking a cross-manager false merge.
const _STOP = new Set("the a an of for in to and or on at as with into from by is are was were be been over under after amid via".split(" "));
function _normEvTitle(t) {
  return String(t || "").toLowerCase()
    .replace(/([€$£])\s?([\d.,]+)\s?(?:billion|bn)\b/g, "$1$2bn")
    .replace(/([€$£])\s?([\d.,]+)\s?(?:million|mn|m)\b/g, "$1$2m")
    .replace(/[^\w€$£%.\s-]/g, " ")
    .replace(/\s+/g, " ").trim();
}
function _evTokens(nt) { return new Set(nt.split(/[\s-]+/).filter((w) => w.length > 2 && !_STOP.has(w))); }
function _jac(a, b) { if (!a.size || !b.size) return 0; let n = 0; a.forEach((x) => { if (b.has(x)) n++; }); return n / (a.size + b.size - n); }
function _isMoney(x) { return /^[€$£][\d.]/.test(x); }
// Shared money figure + ≥2 other shared words (catches re-worded reports of the
// same financing that fall below the word-overlap bar).
function _moneyMatch(a, b) {
  let money = false, other = 0;
  a.forEach((x) => { if (b.has(x)) { if (_isMoney(x)) money = true; else other++; } });
  return money && other >= 2;
}
function _normEvSrc(u) { const s = String(u || "").trim().toLowerCase(); return s ? s.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[?#].*$/, "").replace(/\/+$/, "") : ""; }
const _catRank = (c) => (c === "news" ? 0 : 1);
function _betterEv(a, b) {
  const r = _catRank(a.cat) - _catRank(b.cat); if (r) return r > 0 ? a : b;
  if (!!a.ext !== !!b.ext) return a.ext ? a : b;
  return (a.ts || 0) >= (b.ts || 0) ? a : b;
}
// `fuzzy` (default true) enables word-overlap + money matching — safe per-manager.
// Pass `{ fuzzy: false }` for a CROSS-manager pass (e.g. the flat wire), where only
// the high-confidence signals (same source URL, identical headline) should merge, so
// two managers' genuinely different stories are never collapsed.
export function dedupeEvents(list, { fuzzy = true } = {}) {
  const groups = [];
  for (const e of (list || [])) {
    const nt = _normEvTitle(e.title);
    const toks = _evTokens(nt);
    const su = _normEvSrc(e.source);
    let g = null;
    for (const c of groups) {
      if ((su && c.src && su === c.src) || (nt && c.nt === nt) || (fuzzy && (_jac(c.toks, toks) >= 0.55 || _moneyMatch(c.toks, toks)))) { g = c; break; }
    }
    if (g) { g.rep = _betterEv(g.rep, e); if (su && !g.src) g.src = su; if (toks.size > g.toks.size) { g.toks = toks; g.nt = nt; } }
    else groups.push({ nt, toks, src: su, rep: e });
  }
  return groups.map((g) => g.rep);
}

// The full, date-desc event stream for one manager (deals + intel + press),
// de-duplicated so each story appears once.
export function managerEvents(managerId, { limit = 0 } = {}) {
  const out = [];
  deals.forEach((d) => { if (d.managerId === managerId) out.push({ ts: tsOf(d.date, d.time), date: d.date || "", cat: DEAL_CAT[d.type] || "deal", title: d.headline || "", href: d.sourceUrl || mgrHref(managerId), ext: !!d.sourceUrl, source: d.sourceUrl || "", kind: "deal" }); });
  intel.forEach((i) => { if (i.managerId === managerId) out.push({ ts: tsOf(i.date, i.time), date: i.date || "", cat: INTEL_CAT[i.type] || "news", title: i.headline || "", href: i.sourceUrl || mgrHref(managerId), ext: !!i.sourceUrl, source: i.sourceUrl || "", kind: "intel" }); });
  const m = _mById.get(managerId);
  ((m && m.webNews) || []).forEach((w) => out.push({ ts: tsOf(w.date), date: w.date || "", cat: "news", title: w.title || "", href: w.url || mgrHref(managerId), ext: !!w.url, source: w.url || "", outlet: w.outlet || "", kind: "press" }));
  const dd = dedupeEvents(out);
  dd.sort((a, b) => b.ts - a.ts || String(b.date).localeCompare(String(a.date)));
  return limit > 0 ? dd.slice(0, limit) : dd;
}

// Funds a manager is actively raising (in-market fundraising statuses).
const IN_MARKET = new Set(["Pre-marketing", "Open", "First Close"]);
export function managerFundsInMarket(managerId) {
  return funds.filter((f) => f.managerId === managerId && IN_MARKET.has(f.status));
}

// Whole months between a "YYYY-MM(-DD)" date and now (for AUM staleness).
function monthsSince(dateStr, now) {
  const m = /^(\d{4})-(\d{2})/.exec(dateStr || "");
  if (!m) return null;
  const then = Date.UTC(+m[1], +m[2] - 1, 1);
  return (now - then) / (30.44 * 864e5);
}

// A compact activity summary for one manager — the monitoring payload for the
// Home wire row and (later) the profile "what changed" panel:
//   • activity: count7/30/90 + prev30 + trend (rising / quiet / flat)
//   • mix: {category → count} over 90 days
//   • fundraising: fundsInMarket (raw fund records) + count
//   • AUM: value + currency symbol (parsed from aumText) + asOf + staleness
//   • strategies, and a team-change flag (a hire/departure in the last 90d)
export function managerSummary(managerId, nowTs) {
  const ev = managerEvents(managerId);
  const now = nowTs || Date.now();
  const inWin = (days) => ev.filter((e) => e.ts && e.ts >= now - days * 864e5).length;
  const between = (a, b) => ev.filter((e) => e.ts && e.ts < now - a * 864e5 && e.ts >= now - b * 864e5).length;
  const count30 = inWin(30), prev30 = between(30, 60);
  const mix = {};
  ev.forEach((e) => { if (e.ts && e.ts >= now - 90 * 864e5) mix[e.cat] = (mix[e.cat] || 0) + 1; });
  const m = _mById.get(managerId) || {};
  const inMkt = managerFundsInMarket(managerId);
  const aumVal = (m.aumTotal != null) ? m.aumTotal : (m.aum != null ? m.aum : null);
  const aumSym = (String(m.aumText || "").match(/[$€£]/) || [""])[0];
  const ageM = m.asOf ? monthsSince(m.asOf, now) : null;
  return {
    id: managerId,
    name: m.name || managerName(managerId),
    lastTs: ev[0] ? ev[0].ts : 0,
    lastDate: ev[0] ? ev[0].date : "",
    latest: ev[0] || null,
    events: ev,
    count7: inWin(7), count30, prev30, count90: inWin(90),
    trend: count30 > prev30 ? "up" : (count30 < prev30 ? "down" : "flat"),
    mix,
    hasTeamChange: ev.some((e) => e.cat === "team" && e.ts && e.ts >= now - 90 * 864e5),
    inMarket: inMkt.length,
    fundsInMarket: inMkt,
    aum: aumVal, aumSym, asOf: m.asOf || null, aumStale: (ageM != null && ageM > 9),
    strategies: Array.isArray(m.strategies) ? m.strategies : [],
  };
}

// The Home "Manager wire" ordering: watchlisted managers first (by recency),
// then the rest of the covered universe by recency. Only managers with any dated
// activity appear. `follows` is a Set/array of manager ids (meridian.follows.manager).
export function managerWire(follows, { limit = 24, nowTs } = {}) {
  const fset = follows instanceof Set ? follows : new Set(Array.isArray(follows) ? follows : []);
  const rows = managers
    .map((m) => managerSummary(m.id, nowTs))
    .filter((s) => s.lastTs > 0)
    .map((s) => ({ ...s, watched: fset.has(s.id) }));
  rows.sort((a, b) => (b.watched - a.watched) || (b.lastTs - a.lastTs));
  return limit > 0 ? rows.slice(0, limit) : rows;
}
