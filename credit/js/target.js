// =============================================================================
// credit/js/target.js — how well a covered manager fits the owner's TARGET market
// (shown as "Target" in the UI; HOUSE_STYLE R39). ONE implementation, used by the app
// (Profiles / Transactions "Target" filter + target-first ordering) and by the Node
// scripts (scripts/lib/niche.mjs re-exports it). Moved here from scripts/lib/niche.mjs
// so the browser can load it (scripts/ is not published); logic unchanged.
// =============================================================================
//
// The niche (docs/product-review-brief.md §1): EUROPEAN credit managers of up to
// ~US$15bn AUM running strategies that target 15%+ IRR — opportunistic credit,
// special situations / distressed, junior / mezzanine, asset-based & hybrid capital,
// NPL / portfolio, rescue & structured solutions, SRT. Senior direct lending is
// context, not core.
//
// Pure function over the committed roster (no fetch, no writes). Three tests:
//   band     — firm AUM ≤ 15 (aum, else aumTotal; a missing AUM is "unknown", not out)
//   strategy — at least one high-return strategy on the manager OR one of its funds
//   europe   — HQ in Western Europe, OR a fund with a European geo focus
// Tier: core = all three · adjacent = strategy + one other · context = any other
// credit manager · off = no credit strategy at all (e.g. an equity hedge fund
// added on request — kept, never deleted, just ranked last).
// =============================================================================

export const BAND_MAX_BN = 15;

const HIGH_RETURN = /distress|special sit|opportunis|mezz|junior|asset-based|abl\b|npl|portfolio|capital solutions|rescue|hybrid|significant risk|srt|regulatory capital|specialty finance|structured solutions|litigation|credit secondar/i;
const CREDIT = /credit|debt|lending|loan|unitranche|mezz|distress|special|npl|clo|abl|asset-based|fund finance|nav\b|structured|securiti|specialty finance|capital solutions|significant risk|fixed income/i;
const EUROPE_HQ = /\b(uk|united kingdom|london|edinburgh|jersey|guernsey|ireland|dublin|france|paris|fr\b|germany|frankfurt|munich|de\b|luxembourg|spain|madrid|barcelona|es\b|italy|milan|treviso|it\b|netherlands|amsterdam|rotterdam|the hague|nl\b|belgium|brussels|denmark|copenhagen|sweden|stockholm|se\b|finland|helsinki|fi\b|norway|oslo|switzerland|zurich|geneva|baar|pfäffikon|ch\b|austria|vienna|portugal|lisbon)\b/i;
const EUROPE_GEO = /europe|pan-european|uk|ireland|dach|france|benelux|nordic|southern europe|spain|italy|germany|portugal/i;

const aumOf = (m) => {
  const v = typeof m.aum === "number" ? m.aum : typeof m.aumTotal === "number" ? m.aumTotal : null;
  return v != null && v > 0 ? v : null;
};

export function nicheFit(m, fundsOfManager = []) {
  const strategies = [...(m.strategies || []), ...fundsOfManager.map((f) => f.strategy || "")];
  const aum = aumOf(m);
  const band = aum == null ? null : aum <= BAND_MAX_BN;
  const strategy = strategies.some((s) => HIGH_RETURN.test(s));
  const credit = strategies.some((s) => CREDIT.test(s));
  const europe = EUROPE_HQ.test(m.hq || "") || fundsOfManager.some((f) => EUROPE_GEO.test(f.geoFocus || "") && !/^global|non-european|^us\b|united states|north america/i.test(f.geoFocus || ""));
  const reasons = [];
  reasons.push(band == null ? "AUM unknown" : band ? `AUM ${aum}bn ≤ ${BAND_MAX_BN}` : `AUM ${aum}bn > ${BAND_MAX_BN}`);
  reasons.push(strategy ? "15%+ strategy" : "no 15%+ strategy");
  reasons.push(europe ? "Europe" : "non-Europe");
  // A bank's lending desk is a counterparty, not a fund manager in the niche: at most adjacent.
  const bank = /\bbank\b|barclays|wells fargo|leumi/i.test(m.name || "");
  if (bank) reasons.push("bank desk");
  let tier;
  if (!credit && !strategy) tier = "off";
  else if (bank) tier = strategy ? "adjacent" : "context";
  else if (strategy && band !== false && europe) tier = band == null ? "adjacent" : "core";
  else if (strategy && (band !== false || europe)) tier = "adjacent";
  else tier = "context";
  return { tier, rank: TIER_RANK[tier], aum, band, strategy, europe, reasons };
}

export const TIER_RANK = { core: 0, adjacent: 1, context: 2, off: 3 };

// Convenience: fit for every manager in a roster.
export function nicheIndex(managers = [], funds = []) {
  const byMgr = new Map();
  for (const f of funds) (byMgr.get(f.managerId) || byMgr.set(f.managerId, []).get(f.managerId)).push(f);
  const out = new Map();
  for (const m of managers) out.set(m.id, nicheFit(m, byMgr.get(m.id) || []));
  return out;
}

// App-facing names ("target" in the UI; "niche" kept for the scripts).
export const targetFit = nicheFit;
export const TARGET_LABEL = { core: "Target", adjacent: "Adjacent", context: "Other credit", off: "Non-credit" };
