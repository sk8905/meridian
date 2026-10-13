// SEC apply step (scripts/apply-sec.mjs) + Form ADV reader (scripts/collect-adv.mjs) —
// offline. The 13F panel replaces HF_13F only when newer; regulatory AUM is written to
// raum / raumAsOf / raumSource by id (matched by CIK) and net AUM is never touched.
import fs from "node:fs";
import { applySec } from "../scripts/apply-sec.mjs";
import { parseCsv, matchAdv } from "../scripts/collect-adv.mjs";
import { check, checkEq, finish } from "./lib.mjs";

const src = fs.readFileSync(new URL("../credit/js/data.js", import.meta.url), "utf8");
const panel = { quarter: "Q4 2099", asOf: "2099-12-31", filed: "Built from 3 tracked funds' own 13F-HR filings.", consensus: [{ t: "AMZN", name: "Amazon.com", note: "n", src: "https://www.sec.gov/x" }], moves: [] };
const adv = { byId: { h1: { raum: 171.2, filed: "2026-03-30", src: "https://adviserinfo.sec.gov/firm/summary/105129" } } };
const { out, log } = applySec(src, { sec: { panel }, adv });
const dir = new URL("./.tmp-apply/", import.meta.url); fs.mkdirSync(dir, { recursive: true });
const tmp = new URL("data.mjs", dir); fs.writeFileSync(tmp, out);
const M = await import(tmp.href + "?t=" + Date.now());
fs.rmSync(dir, { recursive: true, force: true });
checkEq(M.HF_13F.asOf, "2099-12-31", "a newer SEC 13F panel replaces HF_13F (and the module still imports)");
const h1 = M.HEDGE_FUNDS.find((h) => h.id === "h1");
check(h1.raum === 171.2 && h1.raumAsOf === "2026-03-30" && /adviserinfo\.sec\.gov/.test(h1.raumSource), "regulatory AUM is written to raum / raumAsOf / raumSource");
const orig = (await import("../credit/js/data.js")).HEDGE_FUNDS.find((h) => h.id === "h1");
check(h1.aum === orig.aum && h1.aumAsOf === orig.aumAsOf, "net AUM is never touched");
check(log.length === 2, `the apply step reports what it changed (${log.join(" / ")})`);
const again = applySec(out, { sec: { panel }, adv });
check(again.out === out, "re-applying the same data changes nothing (idempotent)");
const older = applySec(src, { sec: { panel: { ...panel, asOf: "2000-03-31" } } });
check(!older.log.length, "an older panel is not applied");

const csv = 'CIK#,Organization CRD#,Primary Business Name,Latest ADV Filing Date,5F(2)(c)\n"0001350694",105129,"BRIDGEWATER ASSOCIATES, LP",03/30/2026,"171234567890"\n,999,"NO CIK LLC",01/01/2026,5\n';
const rows = parseCsv(csv);
checkEq(rows[1][2], "BRIDGEWATER ASSOCIATES, LP", "CSV quoted fields with commas parse");
const m = matchAdv(rows, [{ id: "h1", cik: "0001350694" }, { id: "h2", cik: "0000000001" }]);
check(m.byId.h1 && m.byId.h1.raum === 171.2 && m.byId.h1.filed === "2026-03-30" && m.byId.h1.src.endsWith("/105129"), "Form ADV row matched by CIK → US$bn, filing date, IAPD link");
checkEq(m.unmatched.join(","), "h2", "funds without an ADV row are reported unmatched, not guessed");
finish();
