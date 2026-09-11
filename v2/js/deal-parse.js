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
// Connective patterns identify the TARGET party (borrower/company invested in),
// tried in priority order; the first match wins.
const SUBJ_PATTS = [
  `acquisition of (${_NAME})`,
  `buyout of (${_NAME})`,
  `takeover of (${_NAME})`,
  `carve-out (?:acquisition )?of (${_NAME})`,
  `(?:to )?acquire (${_NAME})`,
  `(?:to )?buy (?:up to \\S+ of )?(${_NAME})`,
  `(?:minority |majority |strategic |equity |preferred |growth )?investment in (${_NAME})`,
  `invests?\\b(?:\\s+\\S+){0,4}?\\s+in (${_NAME})`,
  `\\d+% (?:of|in) (${_NAME})`,
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
const LEAD = new RegExp(`^(${_NAME})`);   // the issuer/subject named first
const STOP = /^(?:The|A|An|Its|Their|New|US|UK|EU|UK's|A\$|C\$)$/i;
function clean(s) {
  s = String(s || "").replace(/\s+[A-Z]$/, "");      // drop a dangling single capital (e.g. "A" from "A$36bn")
  s = s.replace(/[’']s$/, "");                        // strip a trailing possessive → keep the owner
  s = s.replace(/\s+[A-Z]$/, "").replace(/[ ,.;:'’&-]+$/, "").trim();
  return s;
}

// Best-effort NAME of the company / borrower / issuer a deal concerns, extracted
// from the sourced headline. A TARGET (borrower/company invested in) is preferred;
// failing any connective match we fall back to the LEADING named subject (the
// issuer, e.g. the fund pricing a bond) so the column always reads as a short name
// rather than a whole headline. Callers keep the full headline as the hover title.
const CLO_STOP = /^(?:European|US|New|Global|Euro|Dollar|Second|Third|Fourth|Fifth|Sixth|Seventh|Debut|Static|Middle|Broadly|First)$/i;
export function dealSubject(d) {
  const h = String((d && d.headline) || "");
  // A CLO deal: name it by its vehicle (e.g. "Fernhill Park", "Seabury Park").
  if (d && d.clo) {
    const m = h.match(new RegExp(`(${_NAME}) CLO\\b`));
    if (m && m[1]) { const s = clean(m[1]); if (s.length >= 2 && !CLO_STOP.test(s) && !STOP.test(s)) return s; }
  }
  for (const re of SUBJ_PATTS) {
    const m = h.match(re);
    if (m && m[1]) { const s = clean(m[1]); if (s.length >= 2 && !STOP.test(s)) return s; }
  }
  const lead = h.match(LEAD);
  if (lead && lead[1]) { const s = clean(lead[1]); if (s.length >= 2 && !STOP.test(s)) return s; }
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
