// =============================================================================
// profile-rota.mjs — the deterministic worklist for the slow-moving PROFILE data
// that no feed refreshes: the hedge-fund 13F consensus panel, hedge-fund AUM,
// investor (LP) profiles and the dashboard fallback snapshot. The freshness audit
// flags them; this says exactly WHAT to refresh this run (a bounded slice, oldest
// first), so the heavy-sweep routine rotates through them instead of never touching
// them. Pure read — the routine does the sourcing and edits.
//
// Usage:
//   node scripts/profile-rota.mjs            # human worklist
//   node scripts/profile-rota.mjs --json
//   node scripts/profile-rota.mjs --hf=5 --lp=2
// =============================================================================
import * as C from "../credit/js/data.js";
import * as D from "../dashboard/js/data.js";

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

export function rota({ hf = 5, lp = 2, now = Date.now() } = {}) {
  const want = latest13fQuarter(now);
  const panel = C.HF_13F || {};
  const f13 = { current: panel.quarter || null, latestAvailable: want, stale: !!(want && panel.asOf !== want.asOf) };
  const hfs = [...(C.HEDGE_FUNDS || [])].sort((a, b) => ms(a.aumAsOf) - ms(b.aumAsOf)).slice(0, hf)
    .map((h) => ({ id: h.id, name: h.name, aum: h.aum, aumAsOf: h.aumAsOf || null, aumSource: h.aumSource || null, cik: h.cik || null, ageDays: ms(h.aumAsOf) ? Math.floor((now - ms(h.aumAsOf)) / DAY) : null }));
  const lps = [...(C.lps || [])].sort((a, b) => ms(a.asOf) - ms(b.asOf)).slice(0, lp)
    .map((l) => ({ id: l.id, name: l.name, type: l.type, aum: l.aum, asOf: l.asOf || null }));
  const dashAge = ms(D.DASH_ASOF) ? Math.floor((now - ms(D.DASH_ASOF)) / DAY) : null;
  return { f13, hedgeFundAum: hfs, lpProfiles: lps, dashboardSnapshot: { asOf: D.DASH_ASOF || null, ageDays: dashAge, stale: dashAge == null || dashAge > 45 } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = rota({ hf: opt("--hf", 5), lp: opt("--lp", 2) });
  if (args.includes("--json")) { console.log(JSON.stringify(r, null, 2)); process.exit(0); }
  console.log("PROFILE ROTA — this run's slow-data refresh (oldest first; verify every figure from a dated source):\n");
  console.log(`  13F consensus panel: holds ${r.f13.current || "—"}; latest filed quarter ${r.f13.latestAvailable ? `${r.f13.latestAvailable.quarter} (deadline ${r.f13.latestAvailable.due})` : "—"} → ${r.f13.stale ? "REFRESH (rewrite HF_13F for that quarter)" : "current"}`);
  console.log(`  Dashboard fallback snapshot: DASH_ASOF ${r.dashboardSnapshot.asOf} (${r.dashboardSnapshot.ageDays}d) → ${r.dashboardSnapshot.stale ? "REFRESH" : "current"}`);
  console.log(`\n  Hedge-fund AUM (oldest ${r.hedgeFundAum.length}):`);
  for (const h of r.hedgeFundAum) console.log(`    ${h.name} [${h.id}] — $${h.aum}bn as of ${h.aumAsOf || "?"}${h.ageDays != null ? ` (${h.ageDays}d)` : ""}${h.cik ? ` · CIK ${h.cik}` : ""}`);
  console.log(`\n  Investor (LP) profiles (oldest ${r.lpProfiles.length}):`);
  for (const l of r.lpProfiles) console.log(`    ${l.name} [${l.id}] — ${l.type}, €${l.aum}bn as of ${l.asOf || "?"}`);
}
