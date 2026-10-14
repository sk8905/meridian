// Dashboard fallback-snapshot refresher (scripts/refresh-dash-snapshot.mjs) — offline.
// Live values replace the seed ONLY where a source returned one; everything else keeps
// its dated, sourced value; the rewritten data module still imports.
import fs from "node:fs";
import { mergeSnapshot, replaceExport, replaceScalar } from "../scripts/refresh-dash-snapshot.mjs";
import * as D from "../dashboard/js/data.js";
import { check, checkEq, finish } from "./lib.mjs";

const cur = { EQ_INDICES: D.EQ_INDICES, WORLD_INDICES: D.WORLD_INDICES, GOVT_YIELDS: D.GOVT_YIELDS, GOVT_YIELD_CHG: D.GOVT_YIELD_CHG };
const { out, log } = mergeSnapshot(cur, {
  eq: [{ id: "spx", value: 7900.123, asOf: "2026-10-14", href: "https://finance.yahoo.com/quote/%5EGSPC" }, { id: "ndq", value: null, asOf: null }],
  world: [{ name: "DAX", value: 26000, w1: 1.1, m1: 2.2, m3: null, m6: 4.4, y1: 5.5, asOf: "2026-10-14", symbol: "^GDAXI" }],
  gy: [{ country: "United States", y10: { v: 4.512, w1: 3, m1: -5, m3: 10, m6: 20, y1: 30 } }],
  ytd: { spx: 15.1 },
});
const spx = out.EQ_INDICES.find((x) => x.id === "spx"), ndq = out.EQ_INDICES.find((x) => x.id === "ndq");
check(spx.level === 7900.12 && spx.asOf === "2026-10-14" && spx.ytd === 15.1, "a live index close replaces the seed level, date and YTD");
check(ndq.level === D.EQ_INDICES.find((x) => x.id === "ndq").level, "an index the source didn't return keeps its existing sourced value");
const dax = out.WORLD_INDICES.regions.flatMap((r) => r.rows).find((r) => r.name === "DAX");
const daxOld = D.WORLD_INDICES.regions.flatMap((r) => r.rows).find((r) => r.name === "DAX");
check(dax.level === 26000 && dax.m6 === 4.4 && dax.m3 === daxOld.m3 && /finance\.yahoo\.com/.test(dax.source), "world-index returns update where returned; a null window keeps the old value; source points at the live quote");
const us = out.GOVT_YIELDS.regions.flatMap((r) => r.rows).find((r) => r.country === "United States");
check(us.y10 === 4.512 && /fred\.stlouisfed\.org/.test(us.source), "the US 10Y comes from FRED with a FRED source link");
check(out.GOVT_YIELD_CHG["United States"].y10.m1 === -5, "US yield changes are refreshed too");
check(log.length >= 3, "the refresher logs what it changed");
let src = fs.readFileSync(new URL("../dashboard/js/data.js", import.meta.url), "utf8");
for (const k of Object.keys(out)) src = replaceExport(src, k, out[k]);
src = replaceScalar(src, "DASH_ASOF", "2026-10-14");
const dir = new URL("./.tmp-dash/", import.meta.url); fs.mkdirSync(dir, { recursive: true });
const tmp = new URL("data.mjs", dir); fs.writeFileSync(tmp, src);
const M = await import(tmp.href + "?t=" + Date.now());
fs.rmSync(dir, { recursive: true, force: true });
checkEq(M.DASH_ASOF, "2026-10-14", "the rewritten module imports and carries the new DASH_ASOF");
check(M.EQ_INDICES.find((x) => x.id === "spx").level === 7900.12 && Array.isArray(M.CR_STRESS), "refreshed blocks land; untouched exports survive");
finish();
