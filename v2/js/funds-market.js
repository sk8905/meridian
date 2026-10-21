// =============================================================================
// v2/js/funds-market.js — "which funds are in market, and from which LPs?" — the ONE
// builder behind Dashboard ▸ Credit's Funds in market card and Transactions ▸
// Fundraising (HOUSE_STYLE T9: one implementation per concern).
//   FIM_STATUS            the fund statuses that mean "still raising"
//   isEuFund(f)           the fund's geo focus / domicile reads European
//   fundLps(f)            named LPs: the fund's sourced investors + the commitments ledger
//   fundsInMarket({ scope, strategy }) → [{ f, lps, stale }]
//     scope "eu" (default) | "all"; a status not refreshed in 12+ months is STALE (it
//     may have closed since); fresh first, then newest update first.
// =============================================================================
import { funds, commitments, lps } from "/credit/js/data.js";

export const FIM_STATUS = new Set(["Pre-marketing", "Open", "First Close"]);
const EU_GEO = /europe|pan-?european|\buk\b|united kingdom|ireland|nordic|dach|germany|france|benelux|italy|spain|iberia|netherlands|belgium|switzerland|sweden|denmark|norway|finland|poland|cee/i;
export const isEuFund = (f) => EU_GEO.test(`${(f && f.geoFocus) || ""} ${(f && f.domicile) || ""}`);
const _lpById = new Map((lps || []).map((l) => [l.id, l]));
export const lpName = (id) => (_lpById.get(id) || {}).name || "";

export function fundLps(f) {
  const named = (f.investors || []).map((x) => (typeof x === "string" ? x : x && (x.name || x.lp))).filter(Boolean);
  (commitments || []).forEach((c) => { if (c.fundId === f.id) { const n = lpName(c.lpId); if (n && !named.includes(n)) named.push(n); } });
  return named;
}

export function fundsInMarket({ scope = "eu", strategy = "" } = {}) {
  const yr = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10);
  return (funds || []).filter((f) => FIM_STATUS.has(f.status) && !f.kind)
    .filter((f) => scope === "all" || isEuFund(f))
    .filter((f) => !strategy || f.strategy === strategy)
    .map((f) => ({ f, lps: fundLps(f), stale: !f.asOf || String(f.asOf) < yr }))
    .sort((a, b) => (a.stale - b.stale) || String(b.f.asOf || "").localeCompare(String(a.f.asOf || "")));
}
