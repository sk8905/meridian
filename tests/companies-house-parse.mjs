// /api/ch reads the PUBLIC Companies House register (no API key — owner decision
// 2026-10-15): the search page → best active exact-name match, then its charges page.
// Parsers run against saved slices of the real pages (tests/fixtures/ch-*.html).
import fs from "node:fs";
import { check, checkEq, finish } from "./lib.mjs";
globalThis.caches = { default: { match: async () => null, put: async () => {} } };
const W = await import("../src/index.js");
const items = W.chParseSearch(fs.readFileSync(new URL("./fixtures/ch-search.html", import.meta.url), "utf8"));
check(items.length >= 2, `search page parses into companies (${items.length})`);
checkEq(items[0].company_number, "02366623", "company number read from the result link");
checkEq(items[1].company_status, "liquidation", "a non-active status is read from the result meta");
checkEq((W.chPick(items, "Thames Water") || {}).title, "THAMES WATER LIMITED", "the exact-name ACTIVE company is picked");
const ch = W.chParseCharges(fs.readFileSync(new URL("./fixtures/ch-charges.html", import.meta.url), "utf8"));
check(ch.length >= 2 && ch[0].created === "15 July 2026" && ch[0].status === "Outstanding" && ch[0].persons[0] === "Kemble Water Holdings Limited", `charges parse: created · status · persons entitled (${JSON.stringify(ch[0])})`);
finish();
