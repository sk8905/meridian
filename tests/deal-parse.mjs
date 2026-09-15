// deal-parse: the shared borrower/company extractor behind the "Borrower / company"
// column (Transactions) and the manager Investments table. It must surface the
// OTHER named party in a deal — the borrower/target — and never the lender that
// leads the headline, a bare descriptor ("Danish", "SME"), a money figure, or an
// instrument acronym ("ABS", "CLO"). A pure-node spec (no browser).
import { check, checkEq, finish } from "./lib.mjs";
import { dealSubject, dealSponsor } from "../v2/js/deal-parse.js";
import { managers, deals } from "../credit/js/data.js";

// 1) The reported case + a spread of headline shapes resolve to the BORROWER.
const cases = [
  ["d207", "Amerplast Group"],          // "H.I.G. Bayside … refinances packaging maker Amerplast Group"
  ["d779", "Toob"],                     // "Ares takes control of UK fibre broadband operator Toob …"
  ["d767", "Nordstern"],                // "Pemberton takes ownership of Danish contractor Nordstern …"
  ["d856", "Eurofiber"],               // lender leads; borrower in the possessive
  ["d718", "Red Kite Lending"],
  ["d682", "Plend"],
  ["d630", "Borio Mangiarotti"],
  ["d795", "Funding 365"],
  ["d835", "Mohawk Day Camp"],
];
const byId = new Map(deals.map((d) => [d.id, d]));
for (const [id, want] of cases) {
  const d = byId.get(id);
  check(!!d, `deal ${id} exists`);
  if (d) checkEq(dealSubject(d), want, `deal ${id}: borrower is surfaced, not the lender`);
}

// 1b) Sponsor-backed deals: the borrower is the TARGET, and the SPONSOR is named
//     separately — not conflated with the borrower or the lender.
const spCases = [
  ["d702", "GBA Group", "Bridgepoint"],   // "backs Bridgepoint's acquisition financing for GBA Group"
];
for (const [id, wantBorrower, wantSponsor] of spCases) {
  const d = byId.get(id);
  if (d) {
    checkEq(dealSubject(d), wantBorrower, `deal ${id}: borrower is the acquisition target`);
    checkEq(dealSponsor(d), wantSponsor, `deal ${id}: sponsor is identified separately`);
  }
}
// A plain refinancing / CLO names no sponsor.
const noSp = byId.get("d207");
if (noSp) checkEq(dealSponsor(noSp), "", "a deal with no PE backer reports no sponsor");
// The sponsor is never the same string as the borrower it backs.
let conflated = [];
for (const d of deals) { const sp = dealSponsor(d); if (sp && sp === dealSubject(d)) conflated.push(d.id); }
check(conflated.length === 0, `sponsor is never the same as the borrower (${conflated.slice(0, 5).join(", ")})`);

// 2) An explicit `company` on a deal always wins over the headline parse.
checkEq(dealSubject({ id: "x1", company: "Acme Widgets", headline: "Some Lender provides a facility" }), "Acme Widgets",
  "an explicit company field overrides the parse");

// 3) No deal surfaces a money figure or an instrument/descriptor acronym as the
//    "company" — the guard that keeps '€125m', 'ABS', 'SME', 'Danish' out.
// Bare acronym/geo descriptor, OR a string that is WHOLLY a money figure.
const BAD = /^(?:ABS|CLOs?|CDO|CFO|NPLs?|UTP|NAV|BNPL|PIK|GP|SME|PE|TV|MGU|Danish|German|French|Italian|Spanish|Dutch|British|European)$|^(?:EUR|USD|GBP|DKK|SEK|NOK|CHF|US|C|A)?[$£€]?\d[\d.,]*\s?(?:m|bn|billion|million|k|M|BN)?$/i;
let offenders = [];
for (const d of deals) {
  const s = dealSubject(d);
  if (s && BAD.test(s)) offenders.push(`${d.id}:"${s}"`);
}
check(offenders.length === 0, `no deal surfaces a money figure / bare acronym as the company (${offenders.slice(0, 6).join(", ")})`);

// 4) Coverage: (almost) every deal resolves to a short name rather than dumping
//    the whole headline — at most a handful may legitimately have no named party.
const mgrById = new Map(managers.map((m) => [m.id, m.name]));
let empty = 0;
for (const d of deals) { if (!dealSubject(d)) empty++; }
check(empty <= 3, `nearly every deal yields a named subject (empty: ${empty})`);

finish();
