// deal-parse.js — shared, best-effort extraction of the OTHER named party in a
// deal headline: the portfolio company invested in, or the borrower lent to. The
// manager/lender is implicit on its own profile (and is its own column in the
// Transactions table), so we surface the counterparty. ONE source of truth so the
// manager Investments table and the Transactions tables lead with the same name.
//
// Conservative by design: only high-confidence connective patterns count, and
// every caller keeps the verbatim, sourced headline visible, so a miss leads with
// the headline itself rather than fabricating a name.
import { DEAL_TAGS } from "/credit/js/deal-tags.js";
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
  // A sponsor-backed deal names the TARGET after "acquisition/buyout … of|for" —
  // that target is the borrower/company, NOT the sponsor whose name leads the
  // possessive ("backs Bridgepoint's acquisition financing for GBA Group" → GBA
  // Group). These run first so the target wins over the "backs <sponsor>" parse.
  `acquisition (?:financing |facility |loan |package |debt |and merger )?(?:of|for) ${T}`,
  `(?:buyout|buy-out|purchase|take-?private|recapitalisation|recapitalization) (?:of|for) ${T}`,
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
  `takes? (?:\\w+ ){0,2}(?:control|ownership) of ${T}`,
  `(?:take control of|control of|to take over|takes? over) ${T}`,
  `\\bexits? ${T}`,
  `(?:to back|backs?|backing of) ${T}`,
  `(?:facility|financing|loan|package|debt|credit line|notes|commitment) (?:to|for) ${T}`,
  // A lender that "acts as capital provider on/to X", "leads a commitment to X",
  // or strikes a "facility/partnership with X" names the borrower X after that
  // connector — reach it even though the lender's own name leads the headline.
  `(?:capital provider|provider|arranger|placement agent|lead arranger) (?:on|to|for) ${T}`,
  `\\bcommitment (?:to|for) ${T}`,
  `partnership with ${T}`,
  `(?:facility|financing|line|deal|loan) with ${T}`,
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
  // The audited party (credit/js/deal-tags.js `p`, HOUSE_STYLE R39) wins over everything —
  // including "" (no counterparty: a hire, a launch, an unnamed borrower).
  const t = d && d.id && DEAL_TAGS[d.id];
  if (t && t.party != null) return t.party;
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

// The COUNTERPARTY to show beside a known lender: dealSubject(), unless the parse
// fell back to the lender's OWN name (a headline that leads with the lender, e.g.
// "Sixth Street co-leads Waymo's $5bn debt financing") — then "" so callers show
// the sourced headline instead of repeating the lender as the "borrower". CLO
// deals keep their vehicle name.
export function dealCounterparty(d, lenderName) {
  const s = dealSubject(d);
  const t = d && d.id && DEAL_TAGS[d.id];
  // An audited party is shown as-is — even when it IS the lender (a BDC issuing its own
  // notes, a manager raising its own fund).
  // An unconfirmed (inferred) vehicle name carries an asterisk wherever it is shown.
  if (t && t.party != null) return t.party + (t.partyQuality === "unconfirmed" ? "*" : "");
  if (!s || !lenderName || (d && d.clo) || (d && (d.company || COMPANY_OVERRIDES[d.id]))) return s;
  const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  const a = norm(s), b = norm(lenderName);
  const first = a.split(" ")[0];
  return (a && (b === a || b.startsWith(a + " ") || a.startsWith(b) || (first.length >= 3 && b.split(" ")[0] === first))) ? "" : s;
}

// The audited role of the deal's counterparty: borrower | issuer | target | fund |
// seller | none — "borrower" when the deal hasn't been audited.
export function dealPartyRole(d) {
  const t = d && d.id && DEAL_TAGS[d.id];
  return (t && t.partyRole) || "borrower";
}

// The SPONSOR / private-equity backer behind a deal, when one is named — distinct
// from the borrower (the target company) and the lender (which finances the
// buyout). Found via the possessive that precedes an acquisition/buyout verb:
// "backs Bridgepoint's … acquisition financing for GBA Group" → Bridgepoint. Empty
// when no sponsor is named (a plain refinancing, a CLO, a direct loan). An explicit
// `sponsor` field on the deal, or a SPONSOR_OVERRIDES entry, wins over the parse.
const SPONSOR_RE = new RegExp(`(${_NAME})['’]s\\b(?:\\s+\\S+){0,8}?\\s+(?:acquisition|buyout|buy-out|purchase|take-?private|take-?over|takeover|LBO|MBO|bid|recapitalisation|recapitalization|merger|investment)\\b`);
export function dealSponsor(d) {
  if (d && typeof d.sponsor === "string") return d.sponsor.trim();      // explicit ("" = none)
  if (d && d.id && SPONSOR_OVERRIDES[d.id] != null) return SPONSOR_OVERRIDES[d.id];
  const subj = dealSubject(d);
  for (const text of [String((d && d.headline) || ""), String((d && d.summary) || "")]) {
    const m = text.match(SPONSOR_RE);
    if (m && m[1]) {
      const s = clean(m[1]);
      // Not the target itself, and not a bare descriptor / money figure.
      if (s.length >= 2 && !STOP.test(s) && !REJECT.test(s) && s !== subj) return s;
    }
  }
  return "";
}
// Audited sponsor corrections (same discipline as COMPANY_OVERRIDES): a real party
// from the deal's own sourced text, or "" to suppress a false positive.
const SPONSOR_OVERRIDES = {};
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
  d656: "HR Path", d622: "German healthcare RE portfolio (PATRIZIA)",
  // Curated 2026-10 (UX review): lender-led headlines whose borrower / target is named in
  // the deal's own headline or summary — each value checked verbatim against that text.
  d10: "EDF", d11: "RWE", d18: "Urban Logistics REIT", d27: "Hurtigruten", d29: "Condor",
  d30: "Lemma Technologies", d32: "emeis", d34: "Altice France", d35: "Hurtigruten", d37: "WVT Industries",
  d50: "Bionic", d59: "Arche MC2 Group", d62: "JBF Group", d64: "Karo Healthcare", d65: "Santander",
  d78: "Condor", d110: "Veld Capital", d158: "Cargill", d173: "Finepoint", d196: "G.Network",
  d200: "Elara Caring", d205: "SIGNAL/W.RE JV", d209: "emeis", d228: "Happy Money", d259: "Altavair",
  d274: "Estela Group", d278: "Euclid Transactional", d280: "Health in Code",
  d286: "Auction Technology Group", d505: "GEOGREEN", d518: "MS Lending Group", d520: "OceanFirst Bank",
  d521: "Fusion Specialty Group", d531: "Groupe Carso", d541: "Peridot Solar",
  d543: "Auction Technology Group", d547: "Ionic Digital", d562: "McAvoy Group", d565: "Typhoo Tea",
  d568: "Limelight", d570: "Six Senses Loire Valley", d585: "Ricasoli Fund", d586: "FGH Bank",
  d589: "Marabu", d590: "Casino Group", d597: "Ardagh", d598: "Intrum", d604: "Arqiva", d606: "Piraeus Bank",
  d607: "Ster-Kinekor", d645: "ABN AMRO", d647: "Shurco", d675: "Pharmacy2U", d704: "1Box", d706: "Solace",
  d709: "Saks Global", d733: "SME Finance and Leasing Solutions", d734: "SRE Capital", d738: "DKB",
  d740: "Deutsche Pfandbriefbank", d755: "Yankee Global Enterprises",
  d768: "SIRE platform", d797: "Horus Finance", d802: "Upstart", d815: "Bridge", d832: "F2 Finance",
  d861: "Loparex", d867: "36th Street Capital", d869: "Altice International", d874: "BMG", d875: "Bayer",
  d876: "Onyx CenterSource", d877: "Alacrity Solutions", d879: "Global Gruppe", d929: "LNG Canada",
  d949: "SubCom", d952: "Hilson Management", d954: "Zolva", d959: "Marble Point Credit Management",
  d964: "Fortress", d967: "Waymo", d977: "Paradigm HSE", d981: "BUKO Group",
  d992: "Phoenix Tower International", d993: "Phoenix Tower International", d1000: "LIV Golf",
  d1013: "Athene", d1014: "Athene", d1027: "CI Financial",
};

// First currency figure in the headline (e.g. "$750m", "€6.5bn", "£1.2bn") — for
// surfaces that carry no structured amount. Surfaces WITH a structured amount
// should prefer it and not call this.
export function dealAmount(d) {
  const m = String((d && d.headline) || "").match(/[$£€]\s?\d[\d.,]*\s?(?:bn|billion|m|million|k)?/i);
  if (!m) return "";
  return m[0].replace(/\s+/g, "").replace(/billion/i, "bn").replace(/million/i, "m");
}
