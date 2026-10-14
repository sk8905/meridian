// Dashboard fallback-snapshot refresher (scripts/refresh-dash-snapshot.mjs) — offline.
// Live values replace the seed ONLY where a source returned one; everything else keeps
// its dated, sourced value; the rewritten data module still imports.
import fs from "node:fs";
import { mergeSnapshot, replaceExport, replaceScalar, treasuryCurve, TREASURY_PAGE } from "../scripts/refresh-dash-snapshot.mjs";
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
// US Treasury fallback (FRED returns nothing without a key): the official daily par
// curve CSV feeds the same windowed-change maths, dated to its last row, Treasury-linked.
{
  const hdr = 'Date,"1 Mo","2 Yr","5 Yr","10 Yr","30 Yr"';
  const csv = [hdr, "10/13/2026,4.10,4.79,5.00,5.21,5.56", "10/06/2026,4.10,4.70,4.95,5.11,5.50", "09/12/2026,4.00,4.60,4.90,5.00,5.40"].join("\n");
  const chg = (pts) => pts.length < 2 ? null : { v: pts[pts.length - 1][1], w1: +((pts[pts.length - 1][1] - pts[pts.length - 2][1]) * 100).toFixed(1) };
  const t = treasuryCurve(["", csv], chg);
  check(t.y10.v === 5.21 && t.y10.w1 === 10 && t.y2.v === 4.79 && t.y30.v === 5.56, "Treasury CSV: tenors parsed oldest→newest, latest level + change");
  checkEq(t.asOf, "2026-10-13", "Treasury CSV: dated to its newest row");
  const { out: o2 } = mergeSnapshot(cur, { gy: [t] });
  const u2 = o2.GOVT_YIELDS.regions.flatMap((r) => r.rows).find((r) => r.country === "United States");
  check(u2.y10 === 5.21 && u2.asOf === "2026-10-13" && u2.source === TREASURY_PAGE, "the Treasury fallback writes the US row with its own date and a Treasury source link");
}
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
