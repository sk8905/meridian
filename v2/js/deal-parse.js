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
// Geographic / nationality adjectives that commonly sit between a connective verb
// and the borrower's proper name ("… refinances GERMAN mid-market group Kaffee
// Partner"). They are DESCRIPTORS to skip over, never the answer themselves.
const GEO = "UK|US|EU|U\\.S\\.|German|French|Italian|Spanish|Danish|Dutch|Nordic|Irish|British|Belgian|Swiss|Portuguese|Austrian|Polish|Finnish|Norwegian|Swedish|American|Canadian|European|Iberian|Czech|Greek|Turkish|Mexican|Brazilian|Chinese|Indian|Japanese|Australian|Catalan|Benelux|Pan-European|pan-European|London-based";
// A TARGET capture that first skips up to six descriptor tokens — lowercase words
// ("packaging maker", "specialist lender") or a geo adjective — then takes the
// proper name. This reaches the borrower named after a descriptive run.
const DESC = `(?:[a-z][\\w.&’'/-]*|${GEO})`;
const T = `(?:${DESC}\\s+){0,6}(${_NAME})`;
// Connective patterns identify the TARGET party (borrower/company invested in),
// tried in priority order; the first match wins.
const SUBJ_PATTS = [
  `acquisition of ${T}`,
  `buyout of ${T}`,
  `takeover of ${T}`,
  `carve-out (?:acquisition )?of ${T}`,
  `(?:to )?acquires? ${T}`,
  `(?:to )?buys? (?:up to \\S+ of )?${T}`,
  `(?:minority |majority |strategic |equity |preferred |growth )?investment in ${T}`,
  `invests?\\b(?:\\s+\\S+){0,4}?\\s+in ${T}`,
  `\\d+% (?:of|in) ${T}`,
  `refinanc(?:ing|e[ds]?) (?:of |for )?${T}`,
  `(?:stake|interest) in ${T}`,
  `takes? (?:control|ownership) of ${T}`,
  `(?:take control of|control of|to take over|takes? over) ${T}`,
  `\\bexits? ${T}`,
  `(?:to back|backs?|backing of) ${T}`,
  `(?:facility|financing|loan|package|debt|credit line|notes) (?:to|for) ${T}`,
  `\\bprovides? (${_NAME})\\b`,
  `\\bprovides?\\b[^.]*?\\b(?:to|with|for) ${T}`,
  `\\blends?\\b[^.]*?\\bto ${T}`,
].map((p) => new RegExp(p));
const LEAD = new RegExp(`^(${_NAME})`);   // the issuer/subject named first
const STOP = /^(?:The|A|An|Its|Their|New|US|UK|EU|UK's|A\$|C\$)$/i;
// A capture that is ONLY a descriptor — a geo adjective, an instrument/vehicle
// acronym, or a bare generic noun — is not a real borrower name; reject it so the
// parser falls through rather than surfacing "Danish" or "ABS" as the company.
const REJECT = new RegExp(`^(?:${GEO}|ABS|CLOs?|CDO|CFO|NPLs?|UTP|NAV|BNPL|PIK|GP|GP Stakes|BDC|SaaS|LBO|MBO|JV|IOS|BTR|REO|SME|SMEs|PE|TV|MGU|Europe|Group|Fund|Funds|Facility|Portfolio|Portfolios|Strategy|Receivables|Schemes?|Stock|Stake|Notes?|Bonds?|Loans?|Capital|Partners|Private|Senior|Debt|Credit|Real|Middle|Investment|Investments|Holdings|Management|Global|Pay|Later)$`
  // …plus any capture that is really a money figure ("DKK362m", "EUR153m", "$1.5bn").
  + `|^(?:EUR|USD|GBP|DKK|SEK|NOK|CHF|US|C|A)?[$£€]?\\d`, "i");
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
const okName = (s) => s.length >= 2 && !STOP.test(s) && !REJECT.test(s);
export function dealSubject(d) {
  const h = String((d && d.headline) || "");
  // An explicit, verified borrower/company on the deal wins over any parse — set
  // this when the headline leads with the LENDER and the parser can't recover the
  // borrower (see COMPANY_OVERRIDES for the audited backlog). Never fabricated: the
  // value is a real party named in the deal's own sourced headline/summary.
  if (d && typeof d.company === "string" && d.company.trim()) return d.company.trim();
  if (d && d.id && COMPANY_OVERRIDES[d.id]) return COMPANY_OVERRIDES[d.id];
  // A CLO deal: name it by its vehicle (e.g. "Fernhill Park", "Seabury Park").
  if (d && d.clo) {
    const m = h.match(new RegExp(`(${_NAME}) CLO\\b`));
    // Strip a leading size/currency token so "EUR324M Marino Park" reads "Marino Park".
    if (m && m[1]) { const s = clean(m[1].replace(/^(?:EUR|USD|GBP|DKK|SEK|NOK|CHF|US|C|A)?[$£€]?\d[\d.,]*[MBKmbk]?\s+/, "")); if (s.length >= 2 && !CLO_STOP.test(s) && !STOP.test(s)) return s; }
  }
  for (const re of SUBJ_PATTS) {
    const m = h.match(re);
    if (m && m[1]) { const s = clean(m[1]); if (okName(s)) return s; }
  }
  const lead = h.match(LEAD);
  if (lead && lead[1]) { const s = clean(lead[1]); if (s.length >= 2 && !STOP.test(s)) return s; }
  return "";
}
// Audited borrower/company corrections: deals whose headline leads with the LENDER
// (often a manager or its affiliate) where the connective parse can't cleanly
// recover the borrower. Each value is a real party named in that deal's own
// sourced headline/summary — verified, never invented. Kept here (not in data.js)
// so the whole audit is reviewable in one place; a deal may also carry its own
// `company` field, which takes precedence.
const COMPANY_OVERRIDES = {
  d207: "Amerplast Group", d190: "Lifeways Group", d553: "Oliver James", d555: "Riviera Travel",
  d623: "Spire Healthcare", d731: "UWM Holdings", d856: "Eurofiber", d855: "Lyntia",
  d860: "Digitt", d858: "ESKARIAM", d718: "Red Kite Lending", d699: "Arche MC2",
  d265: "IPValue Management Group", d284: "Industry Ventures", d197: "Arqiva",
  d171: "Netomnia", d720: "Pure Cremation", d63: "Modal & Centerbridge",
  d235: "Gamuda & Castleforge Partners", d44: "quattron & NEXTRAIL", d72: "idealista",
  d240: "hsbcad", d43: "Saarni Cloud", d5: "Novus Foods", d56: "PayPal 'Pay Later' receivables",
  d632: "PayPal", d564: "Portobello Starboard pub portfolio", d534: "Signal",
  d142: "Novo Banco 'Nata 2' portfolio", d138: "Sareb NPL portfolio",
  d747: "'Project Valery' Italian UTP portfolio", d745: "Banca Mediocredito FVG portfolio",
  d746: "'Atlantic' Portuguese NPL portfolio", d612: "National CineMedia",
  d509: "Kanalservice Gruppe & Grupo Sasti", d737: "Paratek Pharmaceuticals",
  d752: "CPP Investments European NPL portfolio", d753: "CPP Investments European NPL portfolio",
  d639: "Burger King Italy", d221: "implid", d129: "Texecom", d31: "Accolade Wines",
  // Residual corrections where the generic parse would truncate, drop a leading
  // geo word that belongs to the name, surface a city/asset, or find no borrower.
  d687: "Tapí", d689: "Penny Blue Capital", d658: "Elect Capital & MCL Finance",
  d523: "Rantum Capital", d559: "Eaton Gate", d602: "Eaton Gate", d219: "Findango Finance",
  d583: "Peridot Solar", d73: "American Heart of Poland", d551: "Kaufmannshaus",
  d133: "The Morrison Hotel", d169: "Labiana", d9: "Medica Group", d126: "European LifeCare",
  d502: "British Solar Renewables", d145: "Italian cooperative-bank NPL portfolio",
  d608: "Cutting Edge", d584: "Fidera Vecta", d810: "Crestline",
  d253: "Partners Group", d549: "Edison Höfe", d279: "Padana Tubi & Profilati Acciaio",
  d835: "Mohawk Day Camp", d569: "Corinthia Lake Como", d285: "10 Lime Street",
  d703: "1Box Group", d81: "Wolf IV securitisation", d595: "Very Group",
  d60: "Lyocontract", d613: "Hotel Don Juan Center",
};

// First currency figure in the headline (e.g. "$750m", "€6.5bn", "£1.2bn") — for
// surfaces that carry no structured amount. Surfaces WITH a structured amount
// should prefer it and not call this.
export function dealAmount(d) {
  const m = String((d && d.headline) || "").match(/[$£€]\s?\d[\d.,]*\s?(?:bn|billion|m|million|k)?/i);
  if (!m) return "";
  return m[0].replace(/\s+/g, "").replace(/billion/i, "bn").replace(/million/i, "m");
}
