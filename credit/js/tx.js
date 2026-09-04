// =============================================================================
// credit/js/tx.js — the transaction-type enrichment layer for the Transactions
// tab. ONE source of truth: it maps each credit `deal` to a canonical
// transaction TYPE (GP-led secondaries, NAV financing, CLO issuance, …) and a
// normalised deal AMOUNT parsed from the deal's own sourced headline/summary.
//
// "Enrich the data first": the taxonomy + the deterministic classifier here ARE
// the persisted enrichment; a small curated override map (TX_TAG / TX_AMT) fixes
// what the classifier can't infer from the text (the specialist categories the
// sources rarely label — LP-led secondaries, NAV, ABL, rescue). The 5×/day
// refresh routine keeps both current (see docs/refresh-routines.md). Amounts are
// NEVER fabricated: an amount is taken only from the deal's sourced text, else it
// is null (value stats simply exclude nulls and report a "% size disclosed").
// =============================================================================

// ---- Canonical taxonomy (order = display order). Each: key, label, short blurb.
export const TX_TYPES = [
  { key: "gp_sec", label: "GP-led secondaries", blurb: "Continuation vehicles & GP-led fund restructurings — sponsors rolling assets into a new vehicle so existing LPs can cash out." },
  { key: "lp_sec", label: "LP-led secondaries", blurb: "LP portfolio sales — investors selling their fund stakes on the secondary market." },
  { key: "nav", label: "NAV / fund finance", blurb: "Financing secured against a fund's net asset value (NAV loans) and other fund-level facilities." },
  { key: "rescue", label: "Rescue / bridge financing", blurb: "Rescue capital, bridge and emergency financings for stressed borrowers and sponsors." },
  { key: "abl", label: "Asset-based lending", blurb: "Lending secured on assets & receivables — asset-based / asset-backed finance (ABL/ABF)." },
  { key: "clo", label: "CLO issuance", blurb: "New collateralised loan obligation pricings & resets across the covered managers' platforms." },
  { key: "cfo", label: "CFO / fund securitisation", blurb: "Collateralised fund obligations and rated-note fund securitisations." },
  { key: "srt", label: "Significant risk transfer", blurb: "SRT / synthetic securitisations & capital-relief risk-sharing trades." },
  { key: "lend", label: "Direct lending / unitranche", blurb: "Senior & unitranche direct-lending financings and refinancings — the core private-credit flow." },
  { key: "rx", label: "Restructuring & distressed", blurb: "Restructurings, distressed situations, debt-for-equity and insolvency processes." },
  { key: "npl", label: "NPL / loan portfolios", blurb: "Non-performing and performing loan-portfolio acquisitions & disposals." },
  { key: "other", label: "Other financings", blurb: "Other tracked transactions — corporate acquisitions, investments and exits that fall outside the categories above." },
];
export const TX_LABEL = Object.fromEntries(TX_TYPES.map((t) => [t.key, t.label]));
const _reTest = (re, s) => re.test(s);

// ---- Curated overrides. TX_TAG reclassifies a specific deal id (the specialist
// categories the keyword rules can't reach); TX_AMT corrects a parsed amount.
// Keep these hand-verified against each deal's own source. ----
export const TX_TAG = {
  // LP-led secondaries the classifier can't infer from the wording (verified
  // against each deal's own source — a purchase of fund LP stakes/interests).
  d689: "lp_sec",   // Federated Hermes buys ESR's LP stake in Penny Blue Capital's fund
  d667: "lp_sec",   // Ares bundles €3bn of private-credit LP stakes (credit-secondaries)
};
export const TX_AMT = {
  // dealId: { v: <native millions>, ccy: "USD"|"EUR"|"GBP"|... }  (or null to blank)
};

// ---- Deterministic classifier. Checks most-specific → most-general; first hit
// wins. `clo` flag is authoritative for CLO. Reuses the deal's curated `type`
// where it already maps cleanly, then falls back to whole-phrase text rules.
const _RX = {
  cont: /continuation (vehicle|fund)|gp[- ]led|single[- ]asset continuation|status[- ]quo (deal|vehicle)/i,
  lpsec: /lp[- ]led|lp portfolio|portfolio of (fund )?stakes|secondaries portfolio|fund[- ]?stake sale|sold .{0,30}fund stake|limited partner interests|secondary market sale of/i,
  nav: /\bnav (loan|financ|facilit|line)|fund finance|net asset value (loan|facilit|financ)|nav[- ]based/i,
  rescue: /rescue (financ|capital|package|loan)|\bbridge (financ|loan|facilit)\b|emergency (financ|loan|capital)|\blifeline\b|stop[- ]gap financ/i,
  abl: /asset[- ]based (lend|financ|loan|facilit)|\babl\b|\babf\b|asset[- ]backed (lend|financ|loan|facilit|secur)|receivables (financ|facilit|purchase)|forward[- ]flow|inventory financ|equipment financ|residential (transition|mortgage)[- ]?(loan )?secur|\brmbs\b|significant .{0,4}mortgage/i,
  clo: /\bclo\b|collateral(ised|ized) loan obligation/i,
  cfo: /\bcfo\b|collateral(ised|ized) fund obligation|fund securitis|rated fund note/i,
  srt: /significant risk transfer|\bsrt\b|synthetic securitis|capital[- ]relief|risk[- ]sharing (trade|transaction)|credit risk transfer/i,
  npl: /non[- ]performing|\bnpl(s)?\b|loan portfolio (sale|acquisition|deal)|distressed (loan|debt) portfolio/i,
  rx: /restructur|distress|chapter 11|administration|insolven|debt[- ]for[- ]equity|scheme of arrangement|liability management/i,
  lend: /unitranche|direct lend|senior secured|term loan|refinanc|credit facilit|private credit (loan|facilit|financ)/i,
};
export function classifyTx(deal) {
  const type = deal.type || "";
  const s = (deal.headline || "") + "  " + (deal.summary || "");
  if (deal.clo) return "clo";
  if (type === "Continuation Vehicle" || _reTest(_RX.cont, s)) return "gp_sec";
  if (_reTest(_RX.lpsec, s)) return "lp_sec";
  if (type === "NAV / Fund Finance" || _reTest(_RX.nav, s)) return "nav";
  if (_reTest(_RX.rescue, s)) return "rescue";
  if (_reTest(_RX.abl, s)) return "abl";
  if (_reTest(_RX.clo, s)) return "clo";
  if (_reTest(_RX.cfo, s)) return "cfo";
  if (_reTest(_RX.srt, s)) return "srt";
  if (type === "NPL / Portfolio" || type === "NPL" || _reTest(_RX.npl, s)) return "npl";
  if (type === "Restructuring" || type === "Bankruptcy / Distress" || _reTest(_RX.rx, s)) return "rx";
  if (type === "Unitranche" || type === "Financing" || type === "Refinancing" || _reTest(_RX.lend, s)) return "lend";
  return "other";
}
export function txOf(deal) { return TX_TAG[deal && deal.id] || classifyTx(deal); }

// ---- Amount parsing. Pulls the FIRST currency figure from the headline (else
// the summary). Multi-currency symbols are recognised; the value is normalised to
// millions in its NATIVE currency. Never invents a figure — no match → null.
const _CCY = { "$": "USD", "€": "EUR", "£": "GBP", "C$": "CAD", "A$": "AUD", "S$": "SGD", "HK$": "HKD", "¥": "JPY", "SEK": "SEK", "CHF": "CHF" };
const _UNIT = { tn: 1e6, trillion: 1e6, bn: 1e3, billion: 1e3, b: 1e3, m: 1, million: 1, mn: 1, k: 1e-3 };
// e.g. "€400m", "$1.2bn", "C$2.5bn", "£19bn", "~$25bn", "A$705m"
const _AMT_RE = /(C\$|A\$|S\$|HK\$|[$€£¥])\s?(\d[\d,]*(?:\.\d+)?)\s?(tn|trillion|bn|billion|b|mn|million|m|k)\b/i;
function _parseFrom(text) {
  const m = _AMT_RE.exec(String(text || ""));
  if (!m) return null;
  const ccy = _CCY[m[1]] || _CCY[m[1].toUpperCase()] || null;
  const num = parseFloat(m[2].replace(/,/g, ""));
  const unit = _UNIT[m[3].toLowerCase()];
  if (!ccy || !(num > 0) || !unit) return null;
  return { v: Math.round(num * unit * 100) / 100, ccy, raw: m[0].replace(/\s+/g, "") };
}
export function amountOf(deal) {
  if (!deal) return null;
  if (Object.prototype.hasOwnProperty.call(TX_AMT, deal.id)) return TX_AMT[deal.id];   // curated (may be null)
  return _parseFrom(deal.headline) || _parseFrom(deal.summary);
}

// ---- FX: indicative snapshot to express mixed-currency volumes on ONE scale
// (USD) for the per-type totals. Aggregation constant only — labelled "≈ USD" and
// dated in the UI; individual deals always show their native figure. ----
export const FX = { asOf: "2026-09-01", perUsd: null, usdPer: { USD: 1, EUR: 1.09, GBP: 1.27, CAD: 0.73, AUD: 0.66, SGD: 0.78, HKD: 0.128, JPY: 0.0068, SEK: 0.096, CHF: 1.11 } };
export function toUsd(amount) {
  if (!amount || amount.v == null) return null;
  const r = FX.usdPer[amount.ccy];
  return r ? Math.round(amount.v * r) : null;   // in $m
}
export function fmtAmt(a) {
  if (!a || a.v == null) return "—";
  const sym = { USD: "$", EUR: "€", GBP: "£", CAD: "C$", AUD: "A$", SGD: "S$", HKD: "HK$", JPY: "¥", SEK: "SEK ", CHF: "CHF " }[a.ccy] || "";
  const v = a.v;   // millions
  if (v >= 1e6) return `${sym}${(v / 1e6).toFixed(v % 1e6 ? 1 : 0)}tn`;
  if (v >= 1e3) return `${sym}${(v / 1e3).toFixed(v % 1e3 ? 1 : 0)}bn`;
  return `${sym}${Math.round(v)}m`;
}
// USD magnitude → compact "$1.2bn" for the aggregate stat tiles.
export function fmtUsd(m) {
  if (m == null) return "—";
  if (m >= 1e6) return `$${(m / 1e6).toFixed(m % 1e6 ? 1 : 0)}tn`;
  if (m >= 1e3) return `$${(m / 1e3).toFixed(m % 1e3 ? 1 : 0)}bn`;
  return `$${Math.round(m)}m`;
}
