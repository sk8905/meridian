// =============================================================================
// v2/js/legal/firm-lens.js — the private-credit / Europe lens on a law-firm profile
// (#/firm/<id>). Pure functions, evidence only — nothing is guessed:
//   • itemPractices(it)  — finance · restructuring · funds · regulatory · disputes,
//                          from the item's own practice areas, tags and type.
//   • itemRegions(it)    — uk · europe · us · other, from the item's `jurisdiction`
//                          (else its title / URL path); [] when nothing says.
//   • adviserSide(...)   — lender · borrower · sponsor · unknown: WHO the firm acted
//                          for, read from the sentence / announcement that names it
//                          (deal-advisers.js finds the firm; this reads its client).
//   • pcDealIsCredit / pcDealSide — the same for a firm's own announced matters.
// =============================================================================

export const PRACTICES = [["finance", "Finance"], ["restructuring", "Restructuring"], ["funds", "Funds"], ["regulatory", "Regulatory"], ["disputes", "Disputes"]];
export const LENS_REGIONS = [["uk", "UK"], ["europe", "Europe"], ["us", "US"], ["other", "Other"]];
export const SIDE_LABEL = { lender: "Lender side", borrower: "Borrower side", sponsor: "Sponsor side", unknown: "Side not stated" };

// ---- practice ---------------------------------------------------------------
const AREA_PRAC = { banking: "finance", ri: "restructuring", funds: "funds" };
const TAG_PRAC = [
  ["finance", /financ|lending|\bloans?\b|private credit|\bdebt\b|bonds?\b|notes\b|securiti[sz]ation|capital markets|leveraged|high yield|\bbanking\b|\bCLOs?\b|\bNAV\b/i],
  ["restructuring", /restructur|insolven|scheme of arrangement|Part 26A|chapter 11|administration|liability management|distress/i],
  ["funds", /\bfunds?\b|fund formation|AIFMD|carried interest|asset management|private capital|secondaries|continuation/i],
  ["regulatory", /regulat|\bFCA\b|\bPRA\b|\bAIFMD\b|\bSDR\b|SFDR|Consumer Duty|NSIA|national security|sanction|ECCTA|Companies House|MiFID|Basel|\bCMA\b|competition|antitrust|\bFRC\b|ESMA|\bDORA\b|POATR|\bHMRC\b|\bSEC\b|compliance|AML|stablecoin|cryptoasset|Takeover Code|prospectus/i],
  ["disputes", /litigation|dispute|arbitration|Supreme Court|Court of Appeal|High Court|judgment|\bclaims?\b|tribunal|enforcement/i],
];
export function itemPractices(it) {
  const out = new Set();
  for (const a of (it.areas || [it.area])) if (AREA_PRAC[a]) out.add(AREA_PRAC[a]);
  if (it.type === "case") out.add("disputes");
  const tags = (it.tags || []).join(" | ");
  if (tags) for (const [k, re] of TAG_PRAC) if (re.test(tags)) out.add(k);
  return [...out];
}

// ---- region -----------------------------------------------------------------
const UK_J = /^(united kingdom|uk|u\.k\.|england( (&|and) wales)?|wales|scotland|northern ireland|english law|great britain|gb)\b/;
const US_J = /^(united states|us|usa|u\.s\.|delaware|new york)\b/;
const EU_J = /^(european union|eu|europe|eea|eurozone|austria|belgium|bulgaria|croatia|cyprus|czech republic|czechia|denmark|estonia|finland|france|germany|greece|hungary|ireland|italy|latvia|lithuania|luxembourg|malta|netherlands|poland|portugal|romania|slovakia|slovenia|spain|sweden|switzerland|norway|iceland|liechtenstein|nordics|benelux|dach)\b/;
const NONE_J = /^(global|international|worldwide|cross-border)\b/;
function regionOfJur(part) {
  const p = part.trim().toLowerCase();
  if (!p) return null;
  if (UK_J.test(p)) return "uk";
  if (US_J.test(p)) return "us";
  if (EU_J.test(p)) return "europe";
  if (NONE_J.test(p)) return null;
  return "other";
}
// Title evidence (only when the item carries no jurisdiction). "US$" is a currency,
// never a region.
const UK_T = /\b(UK|U\.K\.|United Kingdom|England|English|British|London|FCA|PRA(?!\s+Group)|HMRC|Companies House|Bank of England|Takeover Panel|Takeover Code|ECCTA|NSIA|Part 26A)\b/;
const US_T = /(\bU\.?S\.?(?![$\w])|\bUnited States\b|\bSEC\b|\bDelaware\b|\bNew York(?!\s+Life)\b|\bChapter 11\b|\bIRS\b|\bCFIUS\b|\bFederal Reserve\b|\bFINRA\b|\bCFTC\b)/;
const EU_T = /\b(EU|European|Europe|Eurozone|ESMA|EBA|ECB|AIFMD|MiFID|SFDR|DORA|Germany|German|France|French|Spain|Spanish|Italy|Italian|Netherlands|Dutch|Luxembourg|Belgium|Belgian|Ireland|Irish|Sweden|Swedish|Norway|Norwegian|Denmark|Danish|Finland|Finnish|Poland|Polish|Switzerland|Swiss|Austria|Austrian|Portugal|Portuguese|Greece|Greek|Nordic)\b/;
export function itemRegions(it) {
  const out = new Set();
  if (it.jurisdiction) {
    for (const part of String(it.jurisdiction).replace(/\(.*?\)/g, "").split(/[\/,;]/)) { const r = regionOfJur(part); if (r) out.add(r); }
    return [...out];
  }
  const t = String(it.title || "");
  if (UK_T.test(t)) out.add("uk");
  if (US_T.test(t)) out.add("us");
  if (EU_T.test(t)) out.add("europe");
  if (!out.size && it.url) {
    const segs = String(it.url).toLowerCase().replace(/^https?:\/\/[^/]+/, "").split(/[/?#]/);
    if (segs.some((s) => s === "uk" || s === "en-gb")) out.add("uk");
  }
  return [...out];
}
// A judgment / plan / scheme: an English court (or neutral citation) → UK; a US
// bankruptcy court → US. Nothing else is assumed.
export function courtRegions(rec) {
  const t = `${rec.court || ""} ${rec.citation || ""}`;
  const out = [];
  if (/\b(EWHC|EWCA|UKSC|UKPC|High Court|Court of Appeal|Supreme Court \(UK\)|Chancery|Companies Court|Business and Property)\b/i.test(t) && !/\b(U\.?S\.?|Bankruptcy Court|District of)\b/.test(t)) out.push("uk");
  if (/\b(Bankruptcy Court|S\.D\.N\.Y|D\. Del|Southern District|District of)\b/i.test(t)) out.push("us");
  return out;
}
// Deal-tags country (credit/js/tx.js REGIONS key) → lens region.
export function dealRegion(country, regionKey) {
  if (!country) return [];
  if (country === "UK") return ["uk"];
  if (country === "US") return ["us"];
  if (["uki", "dach", "frbnl", "south", "nordics", "paneu", "oeu"].includes(regionKey)) return ["europe"];
  return regionKey && regionKey !== "none" ? ["other"] : [];
}

// ---- side -------------------------------------------------------------------
const norm = (s) => " " + String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9&]+/g, " ").trim() + " ";
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const LENDER_W = /\b((?:debt )?financing part(?:y|ies)|lenders?|lender group|lending group|lending syndicate|arrangers?|mandated lead|mlas?|bookrunners?|banks?|creditors?|noteholders?|bondholders?|ad hoc group|debt providers?|financing providers?|underwriters?|initial purchasers?|senior lender|unitranche lender|credit funds?)\b/i;
const BORROWER_W = /\b(borrowers?|issuers?|obligors?|the company)\b/i;
const SPONSOR_W = /\b(sponsors?|private equity (firm|owner|house|investor)|pe acquirer|pe owner)\b/i;
const GENERIC = new Set("the bank capital global credit asset assets partners group management investment investments advisers advisors private fund funds holdings international".split(" "));
// Distinctive keys for a party name: its full core name, its first non-generic word,
// and any parenthetical alias ("ICG (Intermediate Capital Group)" → icg, intermediate…).
function nameKeys(name) {
  if (!name) return [];
  const raw = String(name).replace(/\*$/, "");
  const parts = [raw.replace(/\s*\(.*?\)\s*/g, " "), ...[...raw.matchAll(/\((.*?)\)/g)].map((m) => m[1])];
  const keys = [];
  for (const p of parts) {
    const n = norm(p).trim(); if (n.length >= 3) keys.push(n);
    const w = n.split(" ").find((x) => x.length >= 3 && !GENERIC.has(x)); if (w) keys.push(w);
  }
  return [...new Set(keys)];
}
const nameHit = (phrase, name) => { const h = norm(phrase); return nameKeys(name).some((k) => h.includes(" " + k + " ")); };

// The client a firm acted for, as the text states it: "<firm> advised|acted for|
// represented|counsel to <client> on …", or "<client> (advised by <firm>)".
const VERB = "(?:advised|advises|advising|advise|acted for|acts for|acting for|represented|represents|representing|counsel to|as counsel to|is counsel to)";
// A client phrase stops where the sentence moves on to another adviser ("… LiveOak
// Fiber, and Milbank advising the lenders" → "LiveOak Fiber").
const NEXT_ADV = /\s*,?\s+\b(?:and|while|whilst|with)\b[^;]*?\b(?:advis\w*|represent\w*|counsel|acted|acting)\b.*$/i;
export function clientPhrase(text, aliases) {
  const t = String(text || "");
  const tidy = (s) => s.replace(NEXT_ADV, "").trim();
  for (const a of aliases) {
    const A = "(?<![A-Za-z])" + reEsc(a);
    // "<firm> acted as <client>'s legal adviser / counsel"
    let m = t.match(new RegExp(`${A}\\s+(?:acted|acts|is acting|was)\\s+as\\s+(.{2,60}?)['’]s?\\s+(?:legal\\s+)?(?:adviser|advisor|counsel)`, "i"));
    if (m) return tidy(m[1]);
    m = t.match(new RegExp(`${A}(?:(?!\\b(?:and|while|whilst)\\b)[^.;]){0,60}?\\b${VERB}\\s+(?!on\\b)(.{2,90}?)(?=\\s+(?:on|in|with|regarding|for its|for their)\\b|[;,(]|\\.(?:\\s|$)|$)`, "i"));
    if (m) return tidy(m[1]);
    m = t.match(new RegExp(`([A-Z][^.;()]{1,60}?)\\s*[(,]\\s*(?:advised by|counsel:?|represented by)\\s+${A}`, "i"));
    if (m) return tidy(m[1]);
  }
  return "";
}
// lender | borrower | sponsor | unknown — from the client phrase, against the deal's
// own parties (lender = the deal's lender / investor; borrower = its audited party;
// sponsor = its named PE backer). "unknown" whenever the text doesn't say.
export function classifyClient(client, { lender = "", borrower = "", sponsor = "" } = {}) {
  const c = String(client || "");
  if (!c) return "unknown";
  if (LENDER_W.test(c)) return "lender";
  if (SPONSOR_W.test(c)) return "sponsor";
  if (BORROWER_W.test(c)) return "borrower";
  if (lender && nameHit(c, lender)) return "lender";
  if (sponsor && nameHit(c, sponsor)) return "sponsor";
  if (borrower && nameHit(c, borrower)) return "borrower";
  return "unknown";
}
export function adviserSide(adv, deal, aliases, parties) {
  const text = adv.basis === "alert" ? (adv.title || "") : String((deal && deal.summary) || "");
  // The firm's own announcement title starts "<Firm> advises …"; its aliases may be the
  // short form ("Kirkland Advises …"), so try each alias.
  const names = [...new Set([adv.firm, ...aliases].filter(Boolean))].sort((a, b) => b.length - a.length);
  return classifyClient(clientPhrase(text, names), parties);
}

// A firm's own announced matter (firm.pcDeals): credit when its role / parties say
// it is a financing; the side is read from the role ("Advised the lenders").
const CREDIT_PC = /financ|lender|arranger|\bbanks?\b|credit|\bnotes\b|\bbonds?\b|\bloans?\b|facilit|refinanc|\bdebt\b|unitranche|noteholder|bondholder|creditor/i;
export const pcDealIsCredit = (d) => CREDIT_PC.test(`${d.role || ""} ${d.parties || ""}`);
export function pcDealSide(d) {
  const role = String(d.role || "").replace(/^advised\s+/i, "");
  return classifyClient(role, {});
}

// Alias strings a firm is written as (lower-case match, original-case regex): the
// record name, FIRM_ALIASES-style short forms, and the deal-advisers canonical name.
export function firmAliases(firm, extra = []) {
  const set = new Set([firm.name, ...extra]);
  const short = firm.name.split(/[,(]/)[0].replace(/\s+LLP$/i, "").trim();
  set.add(short);
  return [...set].filter(Boolean).sort((a, b) => b.length - a.length);
}
// Does an adviser name from deal-advisers.js (canonical: "Weil", "Proskauer",
// "Kirkland & Ellis") denote this firm?
export function adviserIsFirm(advName, firm, aliases) {
  const a = norm(advName).trim(), f = norm(firm.name).trim();
  if (!a) return false;
  if (a === f || f.startsWith(a + " ") || a.startsWith(f + " ")) return true;
  return aliases.some((x) => norm(x).trim() === a);
}
