// The newswire pill vocabulary is RATIONALISED to exactly EIGHT domain labels
// (HOUSE_STYLE R10a): NEWS · MACRO · BONDS · CREDIT · LEGAL · HEDGE · RESEARCH · LETTER.
// Every desk/type key in feed.js collapses to one of these — the pill names the DOMAIN,
// never a granular sub-type (DEAL/RAISE/CLO/13F/ALERT/CASE/…) or a source brand
// (BBG/ECON/myFT/SUBS/BREW). This pins that so a new desk key can't reintroduce a one-off
// label, and the colour class stays in lockstep with the label. feed.js imports /util.js
// (a browser path), so parse the map literals from source rather than importing the module.
import fs from "node:fs";
import path from "node:path";
import { ROOT, check, checkEq, finish } from "./lib.mjs";

const src = fs.readFileSync(path.join(ROOT, "feed.js"), "utf8");
const parseMap = (name) => {
  const block = (src.match(new RegExp("export const " + name + "\\s*=\\s*\\{([\\s\\S]*?)\\};")) || [])[1] || "";
  const out = {};
  for (const m of block.matchAll(/(?:^|[,{\s])([A-Za-z0-9_]+)\s*:\s*"([^"]*)"/g)) out[m[1]] = m[2];
  return out;
};
const DESK_CODE = parseMap("DESK_CODE");
const DESK_CLASS = parseMap("DESK_CLASS");
const DESK = parseMap("DESK");

const DOMAINS = ["NEWS", "MACRO", "BONDS", "CREDIT", "LEGAL", "HEDGE", "RESEARCH", "LETTER"];
const DOMAIN_CLASS = { NEWS: "news", MACRO: "macro", BONDS: "fi", CREDIT: "credit", LEGAL: "legal", HEDGE: "hdg", RESEARCH: "rsch", LETTER: "newsletter" };

check(Object.keys(DESK_CODE).length >= 20, `parsed DESK_CODE (${Object.keys(DESK_CODE).length} keys)`);
const codeVals = [...new Set(Object.values(DESK_CODE))];
check(codeVals.every((v) => DOMAINS.includes(v)), `every DESK_CODE value is one of the 8 domain labels (${codeVals.join(", ")})`);
checkEq(codeVals.length, 8, `DESK_CODE collapses to exactly 8 distinct labels (${codeVals.slice().sort().join(", ")})`);
check(!codeVals.some((v) => ["DEAL", "RAISE", "CLO", "13F", "ALERT", "CASE", "SCHEME", "RP", "COMM", "BBG", "ECON", "SUBS", "BREW", "myFT", "LTR", "RSCH", "MAC", "LEX", "CRD", "HDG", "BND"].includes(v)),
  "no granular sub-type / source-brand / old-abbreviation label survives");

// Colour stays in lockstep with the label: each key's DESK_CLASS is the colour class of the
// domain its DESK_CODE names.
const drift = Object.keys(DESK_CODE).filter((k) => DESK_CLASS[k] !== DOMAIN_CLASS[DESK_CODE[k]]);
check(drift.length === 0, `each key's colour class matches its domain label${drift.length ? " — drift: " + drift.map((k) => `${k}:${DESK_CLASS[k]}≠${DOMAIN_CLASS[DESK_CODE[k]]}`).join(", ") : ""}`);

// Tooltip names (DESK) are domain names, not sources/sub-types.
const names = [...new Set(Object.values(DESK))];
checkEq(names.length, 8, `DESK tooltip names also collapse to 8 (${names.slice().sort().join(", ")})`);
check(!names.some((n) => /Bloomberg|Economist|Substack|Brew|myFT|Deal|Fundraising|CLO|Commentary|Client alert|Case law|Scheme|Restructuring|13F/.test(n)),
  "no source-brand or sub-type tooltip name survives (domains only)");

finish();
