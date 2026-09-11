// deal-parse.js — shared, best-effort extraction of the OTHER named party in a
// deal headline: the portfolio company invested in, or the borrower lent to. The
// manager/lender is implicit on its own profile (and is its own column in the
// Transactions table), so we surface the counterparty. ONE source of truth so the
// manager Investments table and the Transactions tables lead with the same name.
//
// Conservative by design: only high-confidence connective patterns count, and
// every caller keeps the verbatim, sourced headline visible, so a miss leads with
// the headline itself rather than fabricating a name.
const _NAME = "[A-Z][A-Za-z0-9&.’'-]*(?:\\s+[A-Z0-9][A-Za-z0-9&.’'-]*){0,4}";
const SUBJ_PATTS = [
  `acquisition of (${_NAME})`,
  `buyout of (${_NAME})`,
  `takeover of (${_NAME})`,
  `carve-out (?:acquisition )?of (${_NAME})`,
  `refinanc(?:ing|e[ds]?) (?:of|for) (${_NAME})`,
  `\\brefinance (${_NAME})`,
  `(?:stake|interest) in (${_NAME})`,
  `(?:take control of|control of|to take over) (${_NAME})`,
  `\\bexits (${_NAME})`,
  `\\bto back (${_NAME})`,
  `\\bbacks (${_NAME})`,
  `(?:facility|financing|loan|package|debt|credit line|notes) (?:to|for) (${_NAME})`,
  `\\bprovides?\\b[^.]*?\\bto (${_NAME})`,
  `\\blends?\\b[^.]*?\\bto (${_NAME})`,
].map((p) => new RegExp(p));

export function dealSubject(d) {
  const h = String((d && d.headline) || "");
  for (const re of SUBJ_PATTS) {
    const m = h.match(re);
    if (m && m[1]) {
      const s = m[1].replace(/[’']s$/, "").replace(/[ ,.;:]+$/, "").trim();
      if (s.length >= 2 && !/^(?:The|A|An|Its|Their|New|US|UK|EU)$/i.test(s)) return s;
    }
  }
  return "";
}

// First currency figure in the headline (e.g. "$750m", "€6.5bn", "£1.2bn") — for
// surfaces that carry no structured amount. Surfaces WITH a structured amount
// should prefer it and not call this.
export function dealAmount(d) {
  const m = String((d && d.headline) || "").match(/[$£€]\s?\d[\d.,]*\s?(?:bn|billion|m|million|k)?/i);
  if (!m) return "";
  return m[0].replace(/\s+/g, "").replace(/billion/i, "bn").replace(/million/i, "m");
}
