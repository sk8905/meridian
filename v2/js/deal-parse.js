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
import { managers } from "/credit/js/data.js";
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
  // The audited explicit borrower (2026-10 party audit, HOUSE_STYLE R39m) wins first.
  if (d && typeof d.borrower === "string" && d.borrower.trim()) return d.borrower.trim();
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
  if (d && typeof d.borrower === "string" && d.borrower.trim()) return s;   // audited — shown as-is
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
  d632: "PayPal", // Residual corrections where the generic parse would truncate, drop a leading
  // geo word that belongs to the name, surface a city/asset, or find no borrower.
  d608: "Cutting Edge", d810: "Crestline",
  // Curated 2026-10 (UX review): lender-led headlines whose borrower / target is named in
  // the deal's own headline or summary — each value checked verbatim against that text.
  d645: "ABN AMRO", d738: "DKB",
  d874: "BMG", d929: "LNG Canada",
  d954: "Zolva", };

// First currency figure in the headline (e.g. "$750m", "€6.5bn", "£1.2bn") — for
// surfaces that carry no structured amount. Surfaces WITH a structured amount
// should prefer it and not call this.
export function dealAmount(d) {
  const m = String((d && d.headline) || "").match(/[$£€]\s?\d[\d.,]*\s?(?:bn|billion|m|million|k)?/i);
  if (!m) return "";
  return m[0].replace(/\s+/g, "").replace(/billion/i, "bn").replace(/million/i, "m");
}

// ---- Deal parties (HOUSE_STYLE R39m — 2026-10 party audit) -------------------------
// A deal names up to four kinds of party: the BORROWER (`borrower`, else the parse
// above), the SPONSOR (`sponsor`, `sponsorId` when it is a tracked firm), the LENDERS
// (`lenders: [{ name, managerId, role: lead | participant | arranger | investor,
// amount, ccy }]`) and the tracked firm the record is filed under (`managerId`) with
// its real role (`managerRole`: lender | sponsor | borrower | issuer | adviser |
// seller). One deal = one record: a club deal carries every lender in `lenders`.
const _mgrById = new Map(managers.map((m) => [m.id, m]));
const _mName = (id) => (_mgrById.get(id) || {}).name || "";
export const MANAGER_ROLES = ["lender", "sponsor", "borrower", "issuer", "adviser", "seller"];
// The tracked firm's role: explicit, else "issuer" for a CLO (the manager prices its own
// vehicle), else "lender" (the pre-audit assumption).
export function dealManagerRole(d) {
  if (d && MANAGER_ROLES.includes(d.managerRole)) return d.managerRole;
  return d && d.clo ? "issuer" : "lender";
}
// Every lender / investor (not arrangers), lead first. A deal without an audited
// `lenders` list falls back to its tracked firm when that firm is the lender.
export function dealLenders(d) {
  if (!d) return [];
  const own = (d.lenders || []).filter((l) => l && l.name && l.role !== "arranger")
    .map((l) => ({ ...l, name: (l.managerId && _mName(l.managerId)) || l.name }));
  if (own.length) {
    const lead = own.findIndex((l) => l.role === "lead");
    return lead > 0 ? [own[lead], ...own.slice(0, lead), ...own.slice(lead + 1)] : own;
  }
  const role = dealManagerRole(d);
  return d.managerId && _mName(d.managerId) && (role === "lender" || role === "issuer")
    ? [{ name: _mName(d.managerId), managerId: d.managerId, role: "lead", amount: null, ccy: null }] : [];
}
export function dealArrangers(d) {
  return ((d && d.lenders) || []).filter((l) => l && l.name && l.role === "arranger")
    .map((l) => ({ ...l, name: (l.managerId && _mName(l.managerId)) || l.name }));
}
// The tracked-firm ids a deal counts under as a LENDER (Lender facet, grouping, stats).
export const dealLenderIds = (d) => [...new Set(dealLenders(d).map((l) => l.managerId).filter((id) => id && _mgrById.has(id)))];
// Every tracked firm that is a party to the deal, with its role there — the profile
// Investments tab lists the deal on each of them (sponsor deals labelled "Sponsor").
export function dealParticipants(d) {
  const out = new Map();
  if (!d) return out;
  if (d.managerId) out.set(d.managerId, dealManagerRole(d));
  for (const l of d.lenders || []) if (l && l.managerId && !out.has(l.managerId)) out.set(l.managerId, l.role === "arranger" ? "arranger" : "lender");
  if (d.sponsorId && !out.has(d.sponsorId)) out.set(d.sponsorId, "sponsor");
  return out;
}
export const dealRoleFor = (d, managerId) => dealParticipants(d).get(managerId) || null;
export const ROLE_NAME = { lender: "Lender", sponsor: "Sponsor", borrower: "Borrower", issuer: "Manager", adviser: "Adviser", arranger: "Arranger", seller: "Seller" };
