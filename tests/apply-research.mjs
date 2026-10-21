// apply-research.mjs (data audit 2026-10-21) — the one writer for researched profile
// fixes. AUM arrives in its SOURCE currency and is converted at AUM_FX (one ECB fixing
// day), so no worker does FX by hand.
import { check, checkEq, finish } from "./lib.mjs";
import { toUsdBn } from "../scripts/apply-research.mjs";
import { AUM_FX } from "../credit/js/data.js";

checkEq(toUsdBn({ value: 227, ccy: "USD" }), 227, "a US$ figure is stored as-is");
checkEq(toUsdBn({ value: 212, ccy: "EUR" }), Math.round(212 * AUM_FX.EURUSD * 100) / 100, "a € figure converts at AUM_FX.EURUSD");
checkEq(toUsdBn({ value: 440, ccy: "AUD" }), Math.round(440 * AUM_FX.AUDUSD * 100) / 100, "an A$ figure converts at AUM_FX.AUDUSD");
checkEq(toUsdBn({ value: 750, ccy: "GBP", unit: "m" }), Math.round(0.75 * AUM_FX.GBPUSD * 100) / 100, "millions are scaled to billions");
checkEq(toUsdBn({ value: 3.4, ccy: "SAR", unit: "tn" }), null, "a currency without an AUM_FX rate is refused, not guessed");
check(["EURUSD", "GBPUSD", "AUDUSD", "CADUSD", "DKKUSD", "CHFUSD", "SEKUSD", "NOKUSD"].every((k) => AUM_FX[k] > 0) && AUM_FX.asOf && /ecb/.test(AUM_FX.source), "AUM_FX holds every rate from one dated ECB fixing");
finish();
