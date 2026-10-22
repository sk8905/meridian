// =============================================================================
// apply-registry.mjs — writes REGISTRY facts from the collectors' candidate files onto
// the credit-manager profiles, only where the identity is proven (data audit 2026-10-21):
//
//   backfill/gleif.json            → lei, legalName, leiSource
//       · a researched manager: its ONE exact, ACTIVE GLEIF name match whose country
//         (headquarters, else legal address) agrees with the profile's HQ;
//       · a lender / bank STUB (no HQ to corroborate): only a LEI listed in
//         STUB_CONFIRMED below (each checked by hand: the GLEIF record is the group's
//         own parent entity, not a namesake) — it also fills the stub's `hq` from the
//         GLEIF headquarters address, so the profile stops being empty.
//   backfill/companies-house.json  → companyNumber, incorporated, registeredOffice,
//       companyStatus, sic, chSource — only `byManager` (matched by the company number
//       the profile already cites); name-only `candidates` are never applied.
//
// A registry fact never overwrites a researched one it disagrees with (it is reported
// instead), and `founded` is never derived from an incorporation date (a firm can
// predate its current company). Idempotent. Usage: node scripts/apply-registry.mjs [--dry-run]
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { updateRecords } from "./lib/datafile.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "credit", "js", "data.js");
const DRY = process.argv.includes("--dry-run");
const read = (p) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8")); } catch { return null; } };

// Stub → LEI, confirmed by hand (2026-10-21) against the GLEIF record: the legal entity IS
// the firm named in our deals (not a namesake — e.g. "Citi" → CITI (NOMINEES) LIMITED, HK,
// and "Paragon Bank" → a Memphis bank were rejected). New confirmations come from the
// rota's `stubLeiCandidates` slice.
export const STUB_CONFIRMED = {
  m252: "213800YVAMJQBM7BRW40",                         // GREENSLEDGE ASSET MANAGEMENT LLC, Wilmington US
  m423: "RCNB6OTYUAMMP879YW96",                         // BNP PARIBAS SECURITIES CORP., Wilmington US
  m433: "7TK5RJIZDFROZCA6XF66",                         // MIZUHO SECURITIES USA LLC, Wilmington US
  m425: "9R7GPTSO7KV3UQJZQ078",                         // MORGAN STANLEY & CO. LLC, New York US
  m419: "GGDZP1UYGU9STUHRDP48",                         // MERRILL LYNCH INTERNATIONAL, London GB
  m318: "TUKDD90GPC79G1KOE162",                         // Hamburg Commercial Bank AG, Hamburg DE
  m257: "213800XSHRKUIZK86B68",                         // SHAWBROOK BANK LIMITED, BRENTWOOD GB
  m321: "2138008LEZ3ZLF8HJ541",                         // CYNERGY BANK PLC, LONDON GB
  m338: "N747OI7JINV7RUUH6190",                         // BPER BANCA S.P.A., MODENA IT
  m295: "8156003A4FB445454553",                         // CASSA DI RISPARMIO DI BOLZANO S.P.A., BOLZANO IT
  m297: "96950082Z6KUVA6TW686",                         // BPIFRANCE INVESTISSEMENT, MAISONS-ALFORT FR
  m299: "95980020140005008869",                         // INSTITUT CATALÀ DE FINANCES, Barcelona ES
  m300: "549300UHUTTOEC14D714",                         // ANDORRA BANC AGRÍCOL REIG, SA, LES ESCALDES AD
  m366: "549300VYK2WBD7SST478",                         // Bank OZK, Little Rock US
  m363: "549300OM47DQV01G4854",                         // KEEFE, BRUYETTE & WOODS, INC., NEW YORK US
  m422: "254900AMB2W6ZML1M368",                         // APOLLO GLOBAL SECURITIES, LLC, Wilmington US
  m351: "984500C6EDB2E0038C59",                         // DZ FINANCIAL MARKETS LLC, NEW YORK US
  m356: "254900VGN65XF3JVA633",                         // Zions Direct, Inc., Salt Lake City US
  m368: "549300SLP13FRRDC1A23",                         // NEW MOUNTAIN CAPITAL, L.L.C., New York US
  m275: "254900AZBEYR0OT6BK47",                         // Vista Credit Partners, L.P., San Francisco US
  m398: "213800WFFU33FM4GJB34",                         // OVERLAND ADVANTAGE, WILMINGTON US
  m267: "254900KOPC2F66HDZE49",                         // InEvo Re Ltd., Hamilton BM
  m311: "894500YM96S90ME1KL33",                         // Akereos Capital GmbH, Hamburg DE
  m337: "254900DIJWMU1HVLWA90",                         // CHETWOOD FINANCIAL LIMITED, Wrexham GB
};
// …and namesakes REJECTED on the same review (so the rota stops offering them).
export const STUB_REJECTED = {
  m244: "5493004IVSY5CZW2IK28",   // CITI (NOMINEES) LIMITED, Hong Kong — a nominee company, not Citi
  m247: "549300L3ITGPZUOP6Y77",   // JEFFERIES (SCHWEIZ) AG — a Swiss subsidiary
  m251: "549300H8VV043UPPN494",   // Scotiabank (Bahamas) Limited — a subsidiary
  m258: "549300TGWKRP2P13MO72",   // Paragon Bank, Memphis US — not the UK Paragon Bank
  m411: "9695009ARJ7AFZT0IJ09",   // CDC GROUP, Saint-Bonnet-de-Mure FR — not CDC Group (UK DFI)
  m330: "300300V45K61DL83XR35",   // CDP GROUP LIMITED, BVI — not Cassa Depositi e Prestiti
  m290: "213800TJ79186DQ3MU72",   // ILLIMITY AS, Oslo — not illimity Bank (Italy)
  m319: "529900HVWW3U56ULPM31",   // AIB S.à r.l., Luxembourg — not Allied Irish Banks
  m430: "254900UZGYM8IQ8KTD25",   // INVESTEC INVESTMENT MANAGEMENT, Johannesburg — an arm, not Investec
  m370: "5493001JWDCM8LHPGT98",   // PSP INVESTMENTS HOLDING EUROPE LTD — a subsidiary
};
// GLEIF "headquarters" for many US entities is the Delaware registered agent, not an office.
const AGENT_CITY = /^(wilmington|dover|lewes|road town|george town|camana bay)$/i;

const ISO = { GB: "United Kingdom", US: "United States", FR: "France", DE: "Germany", LU: "Luxembourg", IE: "Ireland", CH: "Switzerland", NL: "Netherlands", SE: "Sweden", DK: "Denmark", NO: "Norway", FI: "Finland", IT: "Italy", ES: "Spain", PT: "Portugal", BE: "Belgium", AT: "Austria", CA: "Canada", AU: "Australia", JP: "Japan", SG: "Singapore", HK: "Hong Kong", AE: "United Arab Emirates", JE: "Jersey", GG: "Guernsey", KY: "Cayman Islands", PL: "Poland", GR: "Greece", IL: "Israel", SA: "Saudi Arabia", QA: "Qatar", KR: "South Korea", CN: "China", IN: "India", BR: "Brazil" };
const HQ_RE = { "United Kingdom": /\b(UK|United Kingdom|London|England|Edinburgh|Manchester|Scotland)\b/i, "United States": /\b(US|USA|United States|NY|CA|CT|TX|IL|MA|FL|New York|Chicago|Boston|Greenwich|Los Angeles|San Francisco|Dallas|Miami|Stamford|Charlotte|Minneapolis)\b/i };
export function hqMatches(hq, iso) {
  const c = ISO[iso]; if (!c || !hq) return false;
  const first = String(hq).split("/")[0];
  return (HQ_RE[c] || new RegExp(`\\b${c}\\b`, "i")).test(first);
}
// STRICT name identity for automatic application: only the legal FORM and a "(UK)" /
// "(US)" marker may differ — never descriptive words ("Europe", "Partners", "Advisers"),
// which the collector's looser match ignores (it let "H.I.G. Capital" pair with "H.I.G.
// EUROPE CAPITAL PARTNERS, L.P." and "Blantyre Capital" with a fund ICAV).
const LEGAL_FORM = /\b(llp|l\.l\.p|ltd|limited|plc|llc|l\.l\.c|lp|l\.p|inc|corp|sa|s\.a|sas|sarl|s\.a r\.l|s\.à r\.l|gmbh|ag|bv|nv|spa|s\.p\.a|a\/s|as|ab|oy|oyj)\b\.?/gi;
export const strictName = (s, { notes = false } = {}) => String(s || "").toLowerCase()
  .replace(notes ? /\(.*?\)/g : /\((uk|us|u\.k\.|u\.s\.)\)/gi, " ").replace(/&/g, " and ").replace(/[’'`"]/g, "")
  .replace(LEGAL_FORM, " ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
export function gleifPick(entity, manager) {
  const ex = ((entity && entity.candidates) || []).filter((c) => c.match === "exact");
  if (ex.length !== 1) return null;
  const c = ex[0];
  if (c.entityStatus !== "ACTIVE") return null;
  if (manager.profileStub) return STUB_CONFIRMED[manager.id] === c.lei ? c : null;
  if (/\(/.test(manager.name)) return null;   // "Man Group (Credit)" — a sleeve, not the legal entity
  if (strictName(c.legalName) !== strictName(manager.name, { notes: true })) return null;
  return hqMatches(manager.hq, c.hqCountry || c.country) ? c : null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const g = read("backfill/gleif.json"), ch = read("backfill/companies-house.json");
  const ents = (g && g.entities) || {}, chm = (ch && ch.byManager) || {};
  const st = { lei: 0, stubHq: 0, ch: 0, conflicts: [] };
  updateRecords(FILE, "managers", (m) => {
    let changed = false;
    const c = gleifPick(ents[m.id], m);
    if (c) {
      if (m.lei && m.lei !== c.lei) st.conflicts.push(`${m.id} lei ${m.lei} ≠ GLEIF ${c.lei}`);
      else if (m.lei !== c.lei) {
        m.lei = c.lei; m.legalName = m.legalName || c.legalName; m.leiSource = `https://search.gleif.org/#/record/${c.lei}`; st.lei++; changed = true;
        if (m.profileStub && !m.hq && c.hqCity && !AGENT_CITY.test(c.hqCity.trim())) { m.hq = `${c.hqCity.replace(/\b\w+/g, (w) => w[0] + w.slice(1).toLowerCase())}, ${ISO[c.hqCountry] || c.hqCountry}`; st.stubHq++; }
      }
    }
    const h = chm[m.id];
    if (h && h.companyNumber) {
      const want = { companyNumber: h.companyNumber, incorporated: h.incorporated || null, registeredOffice: h.registeredOffice || null, companyStatus: h.status || null, sic: h.sic || [], chSource: h.src };
      if (JSON.stringify(Object.keys(want).map((k) => m[k] ?? null)) !== JSON.stringify(Object.values(want))) { Object.assign(m, want); m.legalName = m.legalName || h.legalName; st.ch++; changed = true; }
    }
    return changed;
  }, { dryRun: DRY });
  console.log(`${DRY ? "[dry-run] " : ""}apply-registry: ${st.lei} LEI(s) (${st.stubHq} stub HQ filled), ${st.ch} Companies House record(s)`);
  if (st.conflicts.length) console.log("  conflicts (not applied):\n   - " + st.conflicts.join("\n   - "));
}
