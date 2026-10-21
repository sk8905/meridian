// =============================================================================
// profile-rota.mjs — the deterministic worklist for the slow-moving PROFILE data
// that no feed refreshes: the hedge-fund 13F consensus panel, hedge-fund AUM,
// investor (LP) profiles and the dashboard fallback snapshot. The freshness audit
// flags them; this says exactly WHAT to refresh this run (a bounded slice, oldest
// first), so the heavy-sweep routine rotates through them instead of never touching
// them. Pure read — the routine does the sourcing and edits.
//
// Data audit 2026-10-21 added the slices the audit found nothing was rotating through:
// manager AUM gaps (null, or aum > aumTotal), hedge-fund AUM resting on a weak source
// (Wikipedia / Insider Monkey / Yahoo) or a year-only date, hedge funds whose OWN news
// (HEDGE_INTEL type "AUM") is newer than the profile figure, investors with no AUM,
// law-firm financials older than the latest results season, funds still "Open" /
// "First Close" 18+ months on, and deal tags with no amountKind / country. Research
// is written as a patch file and applied with scripts/apply-research.mjs (one writer,
// audit trail in backfill/research-ledger.json) — docs/refresh-routines.md "Profile rota".
//
// Usage:
//   node scripts/profile-rota.mjs            # human worklist
//   node scripts/profile-rota.mjs --json
//   node scripts/profile-rota.mjs --hf=5 --lp=2
// =============================================================================
import * as C from "../credit/js/data.js";
import * as D from "../dashboard/js/data.js";
import * as L from "../legal/js/data.js";
import { DEAL_TAGS } from "../credit/js/deal-tags.js";
import fs from "node:fs";
import { STUB_REJECTED } from "./apply-registry.mjs";
const readJson = (rel) => { try { return JSON.parse(fs.readFileSync(new URL(rel, import.meta.url), "utf8")); } catch { return null; } };

// EDGAR identity drift (collect-sec.mjs `funds[id].entity`): a RENAME when the profile's
// name is one of the filer's former names; a MOVE when the same entity (not a "(US)"
// affiliate) reports a business city the profile's HQ doesn't name. Both → confirm + apply.
const entKey = (s) => String(s || "").toLowerCase().replace(/[.,]/g, " ").replace(/\b(llc|l p|lp|ltd|limited|inc|plc|llp|co|corp|ag|sa)\b/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
export function edgarDrift(funds, sec) {
  const out = [];
  for (const h of funds || []) {
    const e = sec && sec.funds && sec.funds[h.id] && sec.funds[h.id].entity; if (!e) continue;
    const former = (e.formerNames || []).find((f) => entKey(f.name) === entKey(h.name) || entKey(f.name).startsWith(entKey(h.name) + " "));
    if (former && !entKey(e.name).startsWith(entKey(h.name))) { out.push({ id: h.id, name: h.name, kind: "rename", edgar: e.name, since: former.to || null }); continue; }
    const same = entKey(e.name).startsWith(entKey(h.name).split(" ").slice(0, 2).join(" ")) && !/\(us\)/i.test(e.name);
    if (same && e.city && !new RegExp(e.city.split(" ")[0], "i").test(h.hq || "")) out.push({ id: h.id, name: h.name, kind: "move", edgar: `${e.city}, ${e.state || ""}`.trim(), hq: h.hq || null });
  }
  return out;
}

const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? parseInt(a.slice(n.length + 1), 10) || d : d; };
const DAY = 86400000;
const ms = (d) => { const s = String(d || ""); const t = Date.parse(/^\d{4}$/.test(s) ? s + "-01-01" : /^\d{4}-\d{2}$/.test(s) ? s + "-01" : s.slice(0, 10)); return Number.isNaN(t) ? 0 : t; };

// 13F-HR is due 45 days after each calendar quarter end. The latest AVAILABLE
// quarter is the most recent one whose deadline has passed.
export function latest13fQuarter(now = Date.now()) {
  const d = new Date(now);
  for (let back = 0; back < 8; back++) {
    const q = Math.floor(d.getUTCMonth() / 3) - back;   // quarter index relative to this year
    const y = d.getUTCFullYear() + Math.floor(q / 4), qi = ((q % 4) + 4) % 4;
    const end = Date.UTC(y, qi * 3 + 3, 0);              // last day of the quarter
    if (end + 45 * DAY <= now) return { quarter: `Q${qi + 1} ${y}`, asOf: new Date(end).toISOString().slice(0, 10), due: new Date(end + 45 * DAY).toISOString().slice(0, 10) };
  }
  return null;
}

export const WEAK_AUM_SOURCE = /(^|\.)(wikipedia\.org|insidermonkey\.com|finance\.yahoo\.com|marketscreener\.com|statista\.com|kalkinemedia\.com)\//i;
// The latest results season a firm's figures should reflect: UK firms (FY to 30 Apr,
// results each July) → "FY<y-1>/<y>" from August; US firms (calendar FY, Am Law in
// April) → FY<y-1> from May.
export function expectedFirmYear(firm, now = Date.now()) {
  const d = new Date(now), y = d.getUTCFullYear(), m = d.getUTCMonth() + 1;
  const uk = ["magic", "silver"].includes(firm.tier) || /£/.test((firm.london || {}).revenueBasis || "");
  return uk ? (m >= 8 ? y : y - 1) : (m >= 5 ? y - 1 : y - 2);
}
const fyYear = (s) => { const ys = String(s || "").match(/20\d{2}/g); if (!ys) return 0; const last = ys.at(-1); return /\/\d{2}\b/.test(String(s)) && ys.length === 1 ? +last + 1 : +last; };

export function rota({ hf = 5, lp = 2, news = 5, mgr = 5, firms = 4, funds = 5, tags = 10, now = Date.now() } = {}) {
  const want = latest13fQuarter(now);
  const panel = C.HF_13F || {};
  const f13 = { current: panel.quarter || null, latestAvailable: want, stale: !!(want && panel.asOf !== want.asOf) };
  const hfs = [...(C.HEDGE_FUNDS || [])].sort((a, b) => ms(a.aumAsOf) - ms(b.aumAsOf)).slice(0, hf)
    .map((h) => ({ id: h.id, name: h.name, aum: h.aum, aumAsOf: h.aumAsOf || null, aumSource: h.aumSource || null, cik: h.cik || null, ageDays: ms(h.aumAsOf) ? Math.floor((now - ms(h.aumAsOf)) / DAY) : null }));
  const lps = [...(C.lps || [])].sort((a, b) => ms(a.asOf) - ms(b.asOf)).slice(0, lp)
    .map((l) => ({ id: l.id, name: l.name, type: l.type, aum: l.aum, asOf: l.asOf || null }));
  // Hedge funds with NO news on record (HEDGE_INTEL) — following one shows nothing on
  // the Watchlist. Biggest first, so the most-followed names fill first.
  const withNews = new Set((C.HEDGE_INTEL || []).map((h) => h.hfId));
  const hfNoNews = (C.HEDGE_FUNDS || []).filter((h) => !withNews.has(h.id)).sort((a, b) => (b.aum || 0) - (a.aum || 0)).slice(0, news)
    .map((h) => ({ id: h.id, name: h.name, aum: h.aum, strategy: h.strategy || null }));
  const dashAge = ms(D.DASH_ASOF) ? Math.floor((now - ms(D.DASH_ASOF)) / DAY) : null;

  // Hedge-fund AUM on a weak source or a year-only date (biggest first).
  const hfWeak = (C.HEDGE_FUNDS || []).filter((h) => WEAK_AUM_SOURCE.test(h.aumSource || "") || /^\d{4}$/.test(String(h.aumAsOf || "")))
    .sort((a, b) => (b.aum || 0) - (a.aum || 0));
  // The fund's own news states a newer AUM than its profile → copy it back (verify first).
  const hfFromIntel = (C.HEDGE_FUNDS || []).map((h) => {
    const n = (C.HEDGE_INTEL || []).filter((i) => i.hfId === h.id && i.type === "AUM" && ms(i.date) > ms(h.aumAsOf)).sort((a, b) => ms(b.date) - ms(a.date))[0];
    if (n && h.aum != null && new RegExp(`\\$${String(h.aum).replace(".", "\\.")}\\s?(bn|billion)`, "i").test(n.headline)) return null;   // already copied
    return n ? { id: h.id, name: h.name, aum: h.aum, aumAsOf: h.aumAsOf || null, intel: n.id, date: n.date, headline: n.headline, url: n.url || n.sourceUrl || null } : null;
  }).filter(Boolean);
  // Managers: AUM missing, or larger than the firm-wide total (a currency / sleeve mix-up).
  const real = (C.managers || []).filter((m) => !m.profileStub);
  const mgrGap = real.filter((m) => m.aum == null || (m.aumTotal != null && m.aum > m.aumTotal * 1.01))
    .map((m) => ({ id: m.id, name: m.name, aum: m.aum, aumTotal: m.aumTotal ?? null, asOf: m.asOf || null, why: m.aum == null ? "no AUM" : "aum > aumTotal" }));
  // Investors with no AUM on record, then the oldest.
  const lpNoAum = (C.lps || []).filter((l) => l.aum == null).map((l) => ({ id: l.id, name: l.name, type: l.type }));
  // Law firms whose revenue predates the latest results season (or has no currency stated).
  const firmStale = (L.firms || []).filter((f) => f.tier !== "chambers").map((f) => {
    const lo = f.london || {}, have = fyYear(lo.revenueAsOf), want = expectedFirmYear(f, now);
    const why = lo.revenue == null ? "no revenue" : have < want ? `revenue ${lo.revenueAsOf || "?"} (expect FY${want})` : !/(US\$|£|€)/.test(lo.revenueBasis || "") ? "basis states no currency" : null;
    return why ? { id: f.id, name: f.name, revenueAsOf: lo.revenueAsOf || null, why } : null;
  }).filter(Boolean);
  // Funds still raising 18+ months after their last data point (biggest first).
  const fundStale = (C.funds || []).filter((f) => f.status !== "Final Close" && !f.evergreen && !f.kind && ms(f.asOf) && now - ms(f.asOf) > 540 * DAY)
    .sort((a, b) => (b.raised || b.targetSize || 0) - (a.raised || a.targetSize || 0))
    .map((f) => ({ id: f.id, name: f.name, status: f.status, asOf: f.asOf }));
  // Deal tags with no amountKind (where the text states an amount) or no country — newest first.
  const AMT = /(?:[$€£]|USD|EUR|GBP)\s?\d[\d.,]*\s?(?:bn|billion|m|million)\b/i;
  const tagGap = (C.deals || []).filter((d) => { const t = DEAL_TAGS[d.id] || {}; return (t.amountKind == null && AMT.test(`${d.headline} ${d.summary}`)) || t.country == null; })
    .sort((a, b) => ms(b.date) - ms(a.date))
    .map((d) => { const t = DEAL_TAGS[d.id] || {}; return { id: d.id, date: d.date, headline: d.headline, missing: [t.amountKind == null ? "amountKind" : null, t.country == null ? "country" : null].filter(Boolean) }; });

  return {
    f13, hedgeFundAum: hfs, hedgeFundNoNews: hfNoNews, hedgeFundsWithoutNews: (C.HEDGE_FUNDS || []).filter((h) => !withNews.has(h.id)).length, lpProfiles: lps,
    dashboardSnapshot: { asOf: D.DASH_ASOF || null, ageDays: dashAge, stale: dashAge == null || dashAge > 45 },
    hedgeFundWeakSource: hfWeak.slice(0, hf).map((h) => ({ id: h.id, name: h.name, aum: h.aum, aumAsOf: h.aumAsOf || null, aumSource: h.aumSource || null })), hedgeFundWeakSourceTotal: hfWeak.length,
    hedgeFundAumFromIntel: hfFromIntel,
    managerAumGap: mgrGap.slice(0, mgr), managerAumGapTotal: mgrGap.length,
    lpNoAum: lpNoAum.slice(0, lp), lpNoAumTotal: lpNoAum.length,
    lawFirmFinancials: firmStale.slice(0, firms), lawFirmFinancialsTotal: firmStale.length,
    staleOpenFunds: fundStale.slice(0, funds), staleOpenFundsTotal: fundStale.length,
    dealTagGaps: tagGap.slice(0, tags), dealTagGapsTotal: tagGap.length,
    hedgeFundEdgarDrift: edgarDrift(C.HEDGE_FUNDS, readJson("../backfill/sec-13f.json")),
    managerAdvCandidates: Object.entries((readJson("../backfill/sec-adv.json") || {}).managerCandidates || {}).slice(0, mgr).map(([id, c]) => ({ id, name: (C.managers.find((m) => m.id === id) || {}).name, crd: c[0].crd, sec: c[0].name, city: c[0].city, src: c[0].src })),
    // Form D (collect-formd.mjs): a fund's US vehicles have sold MORE than Wire's `raised`
    // (or Wire has no figure) — a floor on the fund size and a sign of a later close.
    fundFormD: Object.entries((readJson("../backfill/formd.json") || {}).byFund || {})
      .filter(([, f]) => f.soldUsdM && (f.raised == null || (f.ccy === "USD" && f.soldUsdM > f.raised * 1.05)))
      .sort((a, b) => b[1].soldUsdM - a[1].soldUsdM).slice(0, funds)
      .map(([id, f]) => ({ id, name: f.name, status: f.status, raised: f.raised, ccy: f.ccy, soldUsdM: f.soldUsdM, vehicles: f.filings.length, latest: f.filings.map((x) => x.filed).sort().pop(), src: f.filings[0] && f.filings[0].src })),
    // Lender / bank stubs with ONE exact active GLEIF match not yet hand-confirmed — check
    // it is the firm in our deals (not a namesake), then add it to STUB_CONFIRMED in
    // scripts/apply-registry.mjs (which fills lei, legal name and HQ).
    stubLeiCandidates: (() => {
      const g = (readJson("../backfill/gleif.json") || {}).entities || {};
      const nDeals = {}; for (const d of C.deals || []) for (const l of d.lenders || []) if (l.managerId) nDeals[l.managerId] = (nDeals[l.managerId] || 0) + 1;
      return (C.managers || []).filter((m) => m.profileStub && !m.lei).map((m) => {
        const ex = ((g[m.id] || {}).candidates || []).filter((c) => c.match === "exact" && c.entityStatus === "ACTIVE");
        if (ex.length === 1 && STUB_REJECTED[m.id] === ex[0].lei) return null;
        return ex.length === 1 ? { id: m.id, name: m.name, deals: nDeals[m.id] || 0, lei: ex[0].lei, legalName: ex[0].legalName, where: [ex[0].hqCity, ex[0].hqCountry || ex[0].country].filter(Boolean).join(", ") } : null;
      }).filter(Boolean).sort((a, b) => b.deals - a.deals).slice(0, mgr);
    })(),
    managerChCandidates: Object.entries((readJson("../backfill/companies-house.json") || {}).candidates || {}).slice(0, mgr).map(([id, c]) => ({ id, ...c })),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = rota({ hf: opt("--hf", 5), lp: opt("--lp", 2) });
  if (args.includes("--json")) { console.log(JSON.stringify(r, null, 2)); process.exit(0); }
  console.log("PROFILE ROTA — this run's slow-data refresh (oldest first; verify every figure from a dated source):\n");
  console.log(`  13F consensus panel: holds ${r.f13.current || "—"}; latest filed quarter ${r.f13.latestAvailable ? `${r.f13.latestAvailable.quarter} (deadline ${r.f13.latestAvailable.due})` : "—"} → ${r.f13.stale ? "REFRESH (rewrite HF_13F for that quarter)" : "current"}`);
  console.log(`  Dashboard fallback snapshot: DASH_ASOF ${r.dashboardSnapshot.asOf} (${r.dashboardSnapshot.ageDays}d) → ${r.dashboardSnapshot.stale ? "REFRESH" : "current"}`);
  console.log(`\n  Hedge-fund AUM (oldest ${r.hedgeFundAum.length}):`);
  for (const h of r.hedgeFundAum) console.log(`    ${h.name} [${h.id}] — $${h.aum}bn as of ${h.aumAsOf || "?"}${h.ageDays != null ? ` (${h.ageDays}d)` : ""}${h.cik ? ` · CIK ${h.cik}` : ""}`);
  console.log(`\n  Hedge funds with NO news on record (${r.hedgeFundsWithoutNews} in all; ${r.hedgeFundNoNews.length} this run — find their latest 1–3 real, dated news events since 2025 → HEDGE_INTEL):`);
  for (const h of r.hedgeFundNoNews) console.log(`    ${h.name} [${h.id}] — $${h.aum}bn · ${h.strategy || "?"}`);
  console.log(`\n  Investor (LP) profiles (oldest ${r.lpProfiles.length}):`);
  for (const l of r.lpProfiles) console.log(`    ${l.name} [${l.id}] — ${l.type}, $${l.aum}bn as of ${l.asOf || "?"}`);
  const sec = (title, total, rows, fmt) => { console.log(`\n  ${title} (${total} in all; ${rows.length} this run):`); for (const x of rows) console.log("    " + fmt(x)); };
  sec("Investors with NO AUM (annual report / ACFR figure + asOf)", r.lpNoAumTotal, r.lpNoAum, (l) => `${l.name} [${l.id}] — ${l.type}`);
  sec("Manager AUM gaps (find the firm-wide + credit AUM, give the source currency)", r.managerAumGapTotal, r.managerAumGap, (m) => `${m.name} [${m.id}] — ${m.why}${m.aum != null ? ` ($${m.aum}bn vs total $${m.aumTotal}bn)` : ""}`);
  sec("Hedge-fund AUM on a weak source / year-only date (re-cite to the firm or a tier-1 outlet)", r.hedgeFundWeakSourceTotal, r.hedgeFundWeakSource, (h) => `${h.name} [${h.id}] — $${h.aum}bn as of ${h.aumAsOf} · ${String(h.aumSource || "").split("/")[2] || "?"}`);
  sec("Hedge funds whose OWN news states a newer AUM (copy it to the profile after checking)", r.hedgeFundAumFromIntel.length, r.hedgeFundAumFromIntel, (h) => `${h.name} [${h.id}] — profile $${h.aum}bn (${h.aumAsOf}) · ${h.intel} ${h.date}: ${h.headline}`);
  sec("Law-firm financials behind the latest results season", r.lawFirmFinancialsTotal, r.lawFirmFinancials, (f) => `${f.name} [${f.id}] — ${f.why}`);
  sec("Funds still raising 18+ months on (check for a close; intel may already hold it)", r.staleOpenFundsTotal, r.staleOpenFunds, (f) => `${f.name} [${f.id}] — ${f.status} as of ${f.asOf}`);
  sec("EDGAR identity drift — renamed / moved hedge funds (confirm, then set name + formerly / hq)", r.hedgeFundEdgarDrift.length, r.hedgeFundEdgarDrift, (h) => `${h.name} [${h.id}] — ${h.kind}: EDGAR ${h.edgar}${h.since ? ` (old name until ${h.since})` : ""}${h.hq ? ` · profile HQ ${h.hq}` : ""}`);
  sec("Form ADV name matches for credit managers (confirm it is the firm → add the IAPD link to sources; regulatory AUM then applies by CRD)", r.managerAdvCandidates.length, r.managerAdvCandidates, (m) => `${m.name} [${m.id}] — ${m.sec}, ${m.city} (CRD ${m.crd}) ${m.src}`);
  sec("Form D: US vehicles sold more than Wire's raised (a floor, not the fund size — check the manager's release before changing raised / status)", r.fundFormD.length, r.fundFormD, (f) => `${f.name} [${f.id}] — ${f.status}, raised ${f.raised ?? "—"} ${f.ccy || ""} vs Form D sold $${f.soldUsdM}m across ${f.vehicles} vehicle(s), latest ${f.latest} ${f.src}`);
  sec("Lender / bank stubs with one exact GLEIF match (confirm it is the firm, not a namesake → STUB_CONFIRMED in apply-registry.mjs)", r.stubLeiCandidates.length, r.stubLeiCandidates, (m) => `${m.name} [${m.id}] — ${m.deals} deal(s) · ${m.legalName}, ${m.where} · ${m.lei}`);
  sec("Companies House name matches (confirm → add the register link to sources; apply-registry.mjs then fills the company facts)", r.managerChCandidates.length, r.managerChCandidates, (m) => `${m.name} [${m.id}] — ${m.title} (${m.companyNumber}, inc. ${m.incorporated || "?"}) ${m.src}`);
  sec("Deal tags missing amountKind / country (read from the deal's own text; research country with cs/cb)", r.dealTagGapsTotal, r.dealTagGaps, (d) => `${d.id} ${d.date} — missing ${d.missing.join(" + ")} · ${d.headline.slice(0, 80)}`);
}
