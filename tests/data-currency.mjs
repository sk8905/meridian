// Currency + fund-vocabulary guard (pure logic). docs/implementation-plan.md A5/A7.
// Manager/investor AUM is USD by convention (R29, AUM_FX + aumFrom) — this guards FUNDS:
// (1) a stored currency is a real ISO code; (2) it never CONTRADICTS the record's own
//     sourced text (the text states that figure only in another currency);
// (3) fund status / strategy / domicile stay on the controlled vocabularies, with a
//     ratchet on the few lifecycle words that can't be mapped without asserting a close.
// Run `node scripts/normalise-data.mjs` after adding records — it fills fund `ccy`
// from the record's own text and folds synonyms; it never applies FX.
import { funds, FUND_STATUS, STRATEGIES } from "../credit/js/data.js";
import { statedAmounts } from "../scripts/lib/money.mjs";
import { check, finish } from "./lib.mjs";

const ISO = /^(EUR|USD|GBP|CAD|AUD|CHF|SEK|SGD)$/;
const contradicts = (value, ccy, text, unit) => {
  if (typeof value !== "number" || !ccy) return false;
  const hits = statedAmounts(text, unit).filter((a) => Math.abs(value / a.v - 1) <= 0.03);
  return hits.length > 0 && !hits.some((a) => a.ccy === ccy);
};
const bad = [], wrong = [];
for (const f of funds) {
  if (f.ccy != null && !ISO.test(f.ccy)) bad.push(`${f.id}.ccy=${f.ccy}`);
  if (["targetSize", "raised", "hardCap"].some((k) => contradicts(f[k], f.ccy, f.description, "m"))) wrong.push(`${f.id}.ccy`);
}
check(bad.length === 0, `currency: every stored currency is an ISO code${bad.length ? ` (bad: ${bad.slice(0, 6).join(", ")})` : ""}`);
check(wrong.length === 0, `currency: no stored currency contradicts the record's own sourced text${wrong.length ? ` (${wrong.slice(0, 6).join(", ")})` : ""}`);
check(funds.filter((f) => f.ccy).length >= 230, `currency: ≥230 funds carry ccy (${funds.filter((f) => f.ccy).length})`);

const MAX_OFF_STATUS = 5, MAX_OFF_STRATEGY = 7; // ratchets — lower, never raise
const offStatus = funds.filter((f) => !FUND_STATUS.includes(f.status));
const offStrat = funds.filter((f) => !STRATEGIES.includes(f.strategy));
check(offStatus.length <= MAX_OFF_STATUS, `funds: off-vocabulary status ≤ ${MAX_OFF_STATUS} (${offStatus.length}: ${offStatus.map((f) => f.status).join(", ")})`);
check(offStrat.length <= MAX_OFF_STRATEGY, `funds: off-vocabulary strategy ≤ ${MAX_OFF_STRATEGY} (${offStrat.length})`);
const badDom = funds.filter((f) => typeof f.domicile === "string" && /\[est\]|undisclosed|^pan-european$|^global|^europe$|^(US|UK)$/i.test(f.domicile));
check(badDom.length === 0, `funds: domicile is a country (or null), never a geography / "[est]" / "Undisclosed"${badDom.length ? ` (${badDom.map((f) => f.id + "=" + f.domicile).slice(0, 5).join(", ")})` : ""}`);
finish();
