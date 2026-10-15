// live-snapshot-carry.mjs — a snapshot refresh where one source is down must not wipe
// the good last-known values of that source's rows (2026-10-15: FRED returned no ICE
// BofA OAS, and the 11:20 refresh replaced every spread with null).
import { carryForward } from "../scripts/refresh-live-snapshot.mjs";
import { LIVE_SNAPSHOT } from "../dashboard/js/live-snapshot.js";
import { check, checkEq, finish } from "./lib.mjs";

const prev = { savedAt: "2026-10-15T09:15:00Z", data: { rates: [{ label: "US HY OAS", value: 3.16 }, { label: "SOFR", value: 3.9 }] } };
const next = { rates: [{ label: "US HY OAS", value: null }, { label: "SOFR", value: 3.89 }, { label: "NEW", value: null }] };
const out = carryForward("/api/rates", prev, next);
checkEq(out.rates[0].value, 3.16, "a row that came back null keeps the previous capture's value");
checkEq(out.rates[0].keptFrom, "2026-10-15T09:15:00Z", "…tagged with the capture it came from");
checkEq(out.rates[1].value, 3.89, "a fresh value always wins");
check(out.rates[2].value == null, "a row with no previous value stays null (never invented)");
const rates = LIVE_SNAPSHOT.payloads["/api/rates"].data.rates;
check(rates.filter((r) => /OAS/.test(r.label)).every((r) => r.value != null), "the committed snapshot carries every OAS spread");
finish();
