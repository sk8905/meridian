// OFR Hedge Fund Monitor — the pure series reducer (hfmLatest) that turns a raw OFR
// [[date,value],…] timeseries into {value, prev, change, asOf}. Pure logic, no egress.
// The /api/hfm handler and the client tile panel are exercised in hfm-panel.mjs.
import { hfmLatest } from "../src/index.js";
import { check, checkEq, finish } from "./lib.mjs";

// 1) A normal ascending quarterly series → latest value + QoQ change + as-of date.
const s = hfmLatest([["2026-03-31", 2.0], ["2026-06-30", 2.3]]);
checkEq(s.value, 2.3, "latest: takes the most recent value");
checkEq(s.asOf, "2026-06-30", "latest: carries the as-of date");
checkEq(s.prev, 2.0, "latest: exposes the prior observation");
check(Math.abs(s.change - 0.3) < 1e-9, `latest: QoQ change = last − prev (${s.change})`);

// 2) Out-of-order rows are sorted by date before reducing.
const u = hfmLatest([["2026-06-30", 5.1], ["2026-03-31", 3.9], ["2025-12-31", 3.0]]);
checkEq(u.value, 5.1, "sort: newest row wins even when input is unordered");
checkEq(u.prev, 3.9, "sort: prior is the second-newest by date");

// 3) Null / non-finite / malformed points are filtered out (OFR leaves holes).
const h = hfmLatest([["2026-03-31", 1.5], ["2026-06-30", null], ["2026-09-30", "n/a"], ["2026-12-31", 1.9]]);
checkEq(h.value, 1.9, "holes: skips null / non-numeric points, keeps the latest real value");
checkEq(h.prev, 1.5, "holes: prior skips the holes too");

// 4) A single valid point → no prior, no change.
const one = hfmLatest([["2026-06-30", 45193000000000]]);
checkEq(one.value, 45193000000000, "single: the lone value is returned");
checkEq(one.prev, null, "single: no prior observation");
checkEq(one.change, null, "single: no change without a prior");

// 5) Empty / non-array / all-holes → a null value (caller leaves the panel hidden).
checkEq(hfmLatest([]).value, null, "empty: no data → value null");
checkEq(hfmLatest(null).value, null, "guard: non-array → value null");
checkEq(hfmLatest([["2026-06-30", null]]).value, null, "all-holes: → value null");

finish();
