// Funds in market (review 2026-10-15, #12): Dashboard ▸ Credit answers "which managers
// are raising European direct-lending funds, and from which LPs?" — every fund still
// raising (Pre-marketing / Open / First Close), Europe-focused by default, filterable
// by strategy, with named LPs where sourced and a STALE flag on statuses 12+ months old.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import { funds } from "../credit/js/data.js";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/credit`);
await pg.waitForSelector("#dsh-fim .dsh-fim-tbl", { timeout: 10000 });
const rows = () => pg.evaluate(() => [...document.querySelectorAll("#dsh-fim tbody tr")].map((tr) => [...tr.querySelectorAll("td")].map((td) => td.textContent.trim())));
const r0 = await rows();
const open_ = new Set(funds.filter((f) => ["Pre-marketing", "Open", "First Close"].includes(f.status)).map((f) => f.name));
check(r0.length > 10 && r0.every((r) => open_.has(r[0])), `lists only funds still raising (${r0.length})`);
check(r0.some((r) => /stale/.test(r[3])), "a status not refreshed in 12+ months is flagged stale");
check(r0.some((r) => r[6] && r[6] !== "—"), "named LPs are shown where sourced");
await pg.selectOption("#dsh-fim .dsh-fim-strat", "Senior Direct Lending"); await pg.waitForTimeout(150);
const dl = await rows();
check(dl.length > 0 && dl.every((r) => r[2] === "Senior Direct Lending"), `the strategy filter narrows to direct lending (${dl.length})`);
await pg.click("#dsh-fim [data-fim-scope]"); await pg.waitForTimeout(150);
const all = await rows();
check(all.length >= dl.length, `All regions widens the list (${all.length} ≥ ${dl.length})`);
// LP commitments ledger (review #15): newest first, each sourced, linked to the LP page.
const lpc = await pg.evaluate(() => [...document.querySelectorAll("#dsh-lpc tbody tr")].map((tr) => ({ d: tr.querySelector(".dsh-stress-as").textContent, lp: (tr.querySelector("a.dsh-drill") || {}).getAttribute?.("href") || "", src: !!tr.querySelector('.dsh-src[href^="http"]') })));
check(lpc.length >= 20 && lpc.every((r) => r.src && /#\/lp\//.test(r.lp)), `LP commitments list is sourced and links each investor (${lpc.length})`);
const ts = lpc.map((r) => Date.parse(r.d)).filter((x) => !Number.isNaN(x));
check(ts.every((t, i) => i === 0 || ts[i - 1] >= t), "LP commitments run newest first");
checkErrs(errs, "funds in market");
await b.close(); srv.close();
finish();
