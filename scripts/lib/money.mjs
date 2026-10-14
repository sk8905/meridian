// =============================================================================
// money.mjs — which currency does a record's OWN sourced text state for a figure?
// Used by scripts/normalise-data.mjs (to set aumCcy / ccy) and tests/data-currency.mjs
// (to catch a currency that contradicts the record's text). No FX, ever.
// =============================================================================
const SIGN = { "€": "EUR", "$": "USD", "£": "GBP", EUR: "EUR", USD: "USD", GBP: "GBP", "US$": "USD", CAD: "CAD", "CAD$": "CAD", "C$": "CAD", "A$": "AUD", "AUD$": "AUD", AUD: "AUD", "S$": "SGD", CHF: "CHF", SEK: "SEK" };
// Prefixed dollars (CAD$, C$, A$, S$) are matched BEFORE a bare "$" so they never read as USD.
const MONEY = /(US\$|CAD\$|AUD\$|C\$|A\$|S\$|[€$£]|\b(?:EUR|USD|GBP|CAD|AUD|CHF|SEK)\b)\s*~?\s*(\d[\d.,]*)\s*(tn|trillion|bn|billion|b\b|m\b|mn|million)?/gi;

// Every (ccy, value-in-unit) a text states, value normalised to the requested unit.
export function statedAmounts(text, unit /* "bn" | "m" */) {
  const out = [];
  let hit;
  MONEY.lastIndex = 0;
  while ((hit = MONEY.exec(String(text || "")))) {
    // A bare "$" glued to a preceding letter ("CAD$" split oddly, "NZ$") is not USD.
    if (hit[1] === "$" && /[A-Za-z]$/.test(String(text).slice(0, hit.index))) continue;
    const ccy = SIGN[hit[1].toUpperCase()] || SIGN[hit[1]];
    let n = parseFloat(hit[2].replace(/,/g, ""));
    if (!ccy || !(n > 0)) continue;
    const u = (hit[3] || (unit === "bn" ? "bn" : "m")).toLowerCase();
    let bn = u[0] === "t" ? n * 1000 : u[0] === "b" ? n : n / 1000;
    out.push({ ccy, v: unit === "bn" ? bn : bn * 1000 });
  }
  return out;
}
export function ccyFor(value, text, unit) {
  if (typeof value !== "number" || !(value > 0)) return null;
  const ccys = new Set(statedAmounts(text, unit).filter((a) => Math.abs(value / a.v - 1) <= 0.03).map((a) => a.ccy));
  return ccys.size === 1 ? [...ccys][0] : null; // two currencies for the same number → ambiguous → no claim
}

