// =============================================================================
// v2/js/deal-advisers.js — "who advised on this deal?" (review 2026-10-15, #9).
//
// Two evidence-based sources, never a guess:
//   1. The deal's OWN sourced summary — a firm named in a sentence about advising /
//      acting / counsel ("Morgan Lewis advised Zencap …") → { firm, basis:"deal" }.
//   2. A law firm's own deal announcement in the legal desk (legal/js/data.js items)
//      that names the deal's borrower / issuer in its headline, is dated within
//      −45…+60 days of the deal, and shares ≥2 distinctive words (or the amount) with
//      the deal's own text → { firm, basis:"alert", url, title, date }.
// A borrower that is itself a covered manager (Blackstone, Partners Group …) is never
// used as the join key — those names appear in hundreds of unrelated alerts.
//   advisersFor(deal, party, legal) → [{ firm, basis, url?, title?, date? }]
// =============================================================================
import { managers } from "/credit/js/data.js";

// Firms (and the main financial advisers) as they are written in announcements.
export const ADVISER_NAMES = [
  "A&O Shearman", "Allen & Overy", "Clifford Chance", "Freshfields", "Linklaters", "Slaughter and May", "Ashurst",
  "Herbert Smith Freehills", "Macfarlanes", "Travers Smith", "Simmons & Simmons", "Latham & Watkins", "Latham",
  "Kirkland & Ellis", "Kirkland", "White & Case", "Weil", "Sidley Austin", "Sidley", "Cleary Gottlieb", "Ropes & Gray",
  "Simpson Thacher", "Davis Polk", "Stephenson Harwood", "K&L Gates", "Reed Smith", "Hogan Lovells", "Mayer Brown",
  "Proskauer", "Morgan Lewis", "Paul Weiss", "Milbank", "Akin", "Willkie", "Goodwin", "Dechert", "Debevoise",
  "Skadden", "Gibson Dunn", "Cadwalader", "Orrick", "DLA Piper", "Norton Rose Fulbright", "Baker McKenzie",
  "Eversheds Sutherland", "Osborne Clarke", "Gide", "Gleiss Lutz", "Hengeler Mueller", "Uría Menéndez", "Garrigues",
  "Chiomenti", "Loyens & Loeff", "NautaDutilh", "De Brauw", "Mannheimer Swartling", "Kromann Reumert", "Arendt",
  "Elvinger Hoss", "Matheson", "A&L Goodbody", "McCann FitzGerald", "Arthur Cox", "Burges Salmon", "CMS",
  "Pinsent Masons", "Addleshaw Goddard", "Bird & Bird", "Taylor Wessing", "Noerr", "Fieldfisher", "Jones Day",
  "Sullivan & Cromwell", "Cravath", "Schulte Roth", "Fried Frank", "Vinson & Elkins", "King & Spalding",
  "McDermott Will", "Winston & Strawn", "Paul Hastings", "Shearman & Sterling", "Houlihan Lokey", "Rothschild",
  "PJT Partners", "Lazard", "Evercore", "Moelis", "Perella Weinberg", "Alvarez & Marsal", "FTI Consulting", "Kroll",
];
// Longest first so "Latham & Watkins" wins over "Latham", "Kirkland & Ellis" over "Kirkland".
const _NAMES = [...ADVISER_NAMES].sort((a, b) => b.length - a.length);
const _CANON = { Latham: "Latham & Watkins", Kirkland: "Kirkland & Ellis", Sidley: "Sidley Austin", "Allen & Overy": "A&O Shearman", "Shearman & Sterling": "A&O Shearman", "Herbert Smith Freehills": "Herbert Smith Freehills Kramer" };
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const _ADV_SENT = /\b(advis|counsel|acted for|acting for|acts for|represent)/i;

const norm = (s) => " " + String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim() + " ";
const STOP = new Set("the a an and of for on in to with its by as at from new deal financing facility facilities loan loans debt acquisition refinancing provides provide provided leads lead led backs back backed support supports supported billion million bn m eur usd gbp private credit fund funds capital group management partners senior secured term unitranche advises advised advising announces announced company companies".split(" "));
const toks = (s) => new Set(norm(s).trim().split(" ").filter((w) => w.length > 2 && !STOP.has(w)));
const _MGR_KEYS = new Set(managers.flatMap((m) => { const n = norm(m.name.replace(/\s*\(.*?\)/g, "")).trim(); return [n, n.split(" ")[0]]; }));

// Same headline amount ("$5bn" ≈ "US$5 Billion" ≈ "5 billion") in both texts.
const amounts = (s) => new Set([...String(s || "").matchAll(/(\d+(?:[.,]\d+)?)\s*(bn|billion|m\b|mn|million)/gi)].map((m) => `${parseFloat(m[1].replace(",", "."))}${/^b/i.test(m[2]) ? "b" : "m"}`));
function sameAmount(a, b) { const A = amounts(a), B = amounts(b); for (const x of A) if (B.has(x)) return true; return false; }

// Firms named in the deal's own summary, in a sentence about advising.
export function advisersInText(text) {
  const out = [];
  for (const sent of String(text || "").split(/(?<=[.;])\s+/)) {
    if (!_ADV_SENT.test(sent)) continue;
    let rest = sent;
    for (const n of _NAMES) {
      const re = new RegExp(`(^|[^A-Za-z])${reEsc(n)}(?![A-Za-z])`);
      if (re.test(rest)) { const f = _CANON[n] || n; if (!out.includes(f)) out.push(f); rest = rest.replace(new RegExp(reEsc(n), "g"), " "); }
    }
  }
  return out;
}

export function advisersFor(d, party, legal) {
  if (!d) return [];
  const out = advisersInText(d.summary).map((firm) => ({ firm, basis: "deal", url: d.sourceUrl || "" }));
  const key = norm(String(party || "").replace(/\s*\(.*?\)/g, "")).trim();
  if (legal && key.length >= 4 && !_MGR_KEYS.has(key) && !_MGR_KEYS.has(key.split(" ")[0])) {
    const t = Date.parse(d.date), dt = toks(`${d.headline} ${(d.summary || "").slice(0, 240)}`);
    const firmName = (id) => ((legal.firmById || {})[id] || {}).name || id;
    for (const i of legal.items || []) {
      if (!_ADV_SENT.test(i.title || "")) continue;
      const x = Date.parse(i.date); if (!(x && t && x >= t - 45 * 864e5 && x <= t + 60 * 864e5)) continue;
      const hay = norm(`${i.title} ${(i.summary || "").slice(0, 400)}`);
      if (!norm(i.title).includes(" " + key + " ")) continue;
      const it = toks(`${i.title} ${(i.summary || "").slice(0, 400)}`);
      let o = 0; dt.forEach((w) => { if (it.has(w) && !(" " + key + " ").includes(" " + w + " ")) o++; });
      if (o < 2 && !sameAmount(`${d.headline} ${d.summary || ""}`, `${i.title} ${i.summary || ""}`)) continue;
      const firm = firmName(i.firm);
      if (!out.some((a) => a.firm === firm)) out.push({ firm, basis: "alert", url: i.url || "", title: i.title, date: i.date });
    }
  }
  return out;
}

// Deal TERMS stated in the deal's own sourced text (review #9): pricing over a
// benchmark, coupon, tenor and maturity — verbatim fragments, never inferred.
export function dealTerms(d) {
  const t = `${(d && d.headline) || ""}. ${(d && d.summary) || ""}`;
  const out = [];
  const add = (label, v) => { if (v && !out.some((x) => x[0] === label)) out.push([label, v.trim()]); };
  let m = t.match(/(\d{2,4}(?:\.\d+)?)\s*(?:bps?|basis points)\s*(?:over|above|on top of)\s*(SONIA|SOFR|E?URIBOR|Euribor|€STR|the benchmark|benchmark|base rate)/i);
  if (m) add("Pricing", `${m[1]}bp over ${m[2]}`);
  m = !out.length && t.match(/(\d(?:\.\d+)?)\s*(?:pp|percentage points?)\s*(?:over|above)\s*(the )?(benchmark|SOFR|SONIA|Euribor)/i);
  if (m) add("Pricing", `${m[1]}pp over ${m[3]}`);
  m = !out.length && t.match(/\b([SE])\s*\+\s*(\d{2,4})\b/);
  if (m) add("Pricing", `${m[1] === "E" ? "Euribor" : "SOFR"} + ${m[2]}bp`);
  m = t.match(/(\d{1,2}(?:\.\d{1,3})?)%\s*(?:senior\s+)?(?:notes|bonds|coupon)/i);
  if (m) add("Coupon", `${m[1]}%`);
  m = t.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|\d{1,2})[- ]year\b/i);
  if (m) add("Tenor", `${m[1]}-year`);
  m = t.match(/\b(?:due|matur(?:ing|es|ity)(?: in)?)\s+((?:19|20)\d\d)\b/i);
  if (m) add("Maturity", m[1]);
  m = t.match(/\b(\d(?:\.\d)?)x\s*(?:leverage|EBITDA|net leverage)/i);
  if (m) add("Leverage", `${m[1]}x`);
  return out;
}
