// Registry collectors (data audit 2026-10-21) — offline, pure functions only. Each
// collector matches by an IDENTIFIER (company number, CRD, CIK, exact entity name +
// country) and keeps anything weaker as a rota candidate; these fixtures pin that.
import { check, checkEq, finish } from "./lib.mjs";
import { fundKey, matchHits, parseFormD } from "../scripts/collect-formd.mjs";
import { parseCompany, exactCandidate, companyNumberOf, isoFromLong } from "../scripts/collect-ch.mjs";
import { gleifPick, hqMatches, STUB_CONFIRMED } from "../scripts/apply-registry.mjs";
import { entityOf } from "../scripts/collect-sec.mjs";
import { edgarDrift } from "../scripts/profile-rota.mjs";

// Form D
checkEq(fundKey("Blantyre Special Situations Fund III Ltd  (CIK 0001950965)"), fundKey("Blantyre Special Situations Fund III"), "Form D: legal form and CIK suffix are ignored when matching a fund");
const hit = (name, cik, date) => ({ _id: `0001-${date}:primary_doc.xml`, _source: { display_names: [`${name}  (CIK ${cik})`], ciks: [cik], root_forms: ["D"], file_date: date, adsh: `0001-${date}` } });
const m = matchHits("Blantyre Special Situations Fund III", [hit("Blantyre Special Situations Fund III LP", "0001950964", "2022-10-28"), hit("Blantyre Special Situations Fund III LP", "0001950964", "2024-10-24"), hit("Blantyre Special Situations Fund III Ltd", "0001950965", "2024-10-24"), hit("Blantyre Special Situations Fund II LP", "0001", "2020-01-01")]);
check(m.length === 2 && m.every((x) => x.filed === "2024-10-24"), "Form D: the latest filing of each exactly-named vehicle; Fund II is not Fund III");
checkEq(matchHits("Credit Fund", [hit("Credit Fund LP", "1", "2024-01-01")]).length, 0, "Form D: a too-generic fund name never matches");
const fd = parseFormD("<offeringSalesAmounts><totalOfferingAmount>Indefinite</totalOfferingAmount><totalAmountSold>306191340</totalAmountSold><totalRemaining>Indefinite</totalRemaining></offeringSalesAmounts><dateOfFirstSale><value>2022-11-22</value></dateOfFirstSale><totalNumberAlreadyInvested>41</totalNumberAlreadyInvested>");
check(fd.sold === 306191340 && fd.offering === null && fd.firstSale === "2022-11-22" && fd.investors === 41, "Form D: sold / first sale / investors parsed; 'Indefinite' is null, not a number");

// Companies House
const html = `<h1 class="heading-xlarge">FITZWALTER CAPITAL LIMITED</h1><span class="text data" id="roa-address">14 Hay&#39;s Mews, London, England, W1J 5PT</span><dd class="text data" id="company-status">Active</dd><span class="text data" id="company-type-value">Private limited Company</span><dd class="data" id="company-creation-date">13 January 2020</dd><span id="sic0">82990 - Other business support</span>`;
const pc = parseCompany(html);
check(pc.legalName === "FITZWALTER CAPITAL LIMITED" && pc.status === "Active" && pc.incorporated === "2020-01-13" && /Hay's Mews/.test(pc.registeredOffice) && pc.sic.length === 1, "Companies House: company page parsed (name, status, incorporation, office, SIC)");
checkEq(isoFromLong("3 September 2003"), "2003-09-03", "Companies House: long date → ISO");
checkEq(companyNumberOf({ sources: [{ url: "https://find-and-update.company-information.service.gov.uk/company/12400257" }] }), "12400257", "Companies House: the company number comes from the register link the profile cites");
checkEq(companyNumberOf({ sources: [{ url: ".../company-information.service.gov.uk/company/11111111" }, { url: ".../company-information.service.gov.uk/company/22222222" }] }), null, "Companies House: two different numbers cited = ambiguous");
check(exactCandidate("Polus Capital Management", [{ title: "POLUS CAPITAL MANAGEMENT LIMITED", company_status: "active", company_number: "04885685" }, { title: "POLUS CAPITAL MANAGEMENT (US) LIMITED", company_status: "active" }]).company_number === "04885685", "Companies House: one exact active name → a candidate");
checkEq(exactCandidate("Polus", [{ title: "POLUS LIMITED", company_status: "active" }, { title: "POLUS LTD", company_status: "active" }]), null, "Companies House: two exact names → no candidate");

// GLEIF
const ent = (c) => ({ candidates: [{ lei: "X1", legalName: "ALINOR CAPITAL MANAGEMENT LLP", entityStatus: "ACTIVE", match: "exact", country: "GB", hqCountry: "GB", ...c }] });
check(gleifPick(ent({}), { id: "m233", name: "Alinor Capital Management", hq: "London" }), "GLEIF: one exact active match in the manager's HQ country is applied");
check(!gleifPick(ent({ hqCountry: "US", country: "US" }), { id: "m233", name: "Alinor Capital Management", hq: "London" }), "GLEIF: a namesake in another country is not");
check(!gleifPick(ent({ entityStatus: "INACTIVE" }), { id: "m233", name: "Alinor Capital Management", hq: "London" }), "GLEIF: an inactive entity is not");
check(!gleifPick(ent({}), { id: "m999", profileStub: true }) || STUB_CONFIRMED.m999 === "X1", "GLEIF: a stub needs a hand-confirmed LEI");
check(!gleifPick(ent({ legalName: "H.I.G. EUROPE CAPITAL PARTNERS, L.P.", hqCountry: "US", country: "US" }), { id: "m41", name: "H.I.G. Capital", hq: "Miami, US" }), "GLEIF: a group affiliate whose name adds words (Europe, Partners) is not applied");
check(!gleifPick(ent({ legalName: "MAN GROUP LIMITED" }), { id: "m169", name: "Man Group (Credit)", hq: "London, UK" }), "GLEIF: a sleeve profile never takes the group's LEI automatically");
check(hqMatches("New York / London", "US") && !hqMatches("New York / London", "GB"), "GLEIF: the first-named HQ city decides the country");

// EDGAR identity
const e = entityOf({ name: "MONTANOVA CAPITAL, LLC", formerNames: [{ name: "Suvretta Capital Management, LLC", from: "2014-02-14T00:00:00.000Z", to: "2026-06-23T00:00:00.000Z" }], addresses: { business: { city: "NEW YORK", stateOrCountry: "NY" } } });
check(e.name === "MONTANOVA CAPITAL, LLC" && e.formerNames[0].to === "2026-06-23" && e.city === "NEW YORK", "EDGAR: current name, former names and business city are read");
const drift = edgarDrift([{ id: "h125", name: "Suvretta Capital Management", hq: "New York, NY, US" }, { id: "h21", name: "CQS", hq: "London, UK" }], { funds: { h125: { entity: e }, h21: { entity: { name: "CQS (US), LLC", formerNames: [], city: "NEW YORK", state: "NY" } } } });
check(drift.length === 1 && drift[0].kind === "rename" && drift[0].since === "2026-06-23", "EDGAR: a rename is flagged; a US affiliate's address is not a move");
finish();
