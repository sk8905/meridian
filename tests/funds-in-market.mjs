// Funds in market (review 2026-10-15, #12): Dashboard ▸ Credit answers "which managers
// are raising European direct-lending funds, and from which LPs?" — every fund still
// raising (Pre-marketing / Open / First Close), every region (no region toggle, R44k), filterable
// by strategy, with named LPs where sourced and a STALE flag on statuses 12+ months old.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import { funds } from "../credit/js/data.js";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/credit`);
await pg.waitForSelector("#dsh-fim .dsh-fim-tbl", { timeout: 10000 });
const rows = () => pg.evaluate(() => [...document.querySelectorAll("#dsh-fim tbody tr")].map((tr) => [...tr.querySelectorAll("td")].map((td) => td.textContent.trim())));
const r0 = await rows();
// A platform / partnership (R39n) is not a fundraise, so it never lists here.
const open_ = new Set(funds.filter((f) => ["Pre-marketing", "Open", "First Close"].includes(f.status) && !f.kind).map((f) => f.name));
// R43 events table: As of · Fund · Status · Manager · Strategy · Target · Raised · Named LPs · Src.
check(r0.length > 10 && r0.every((r) => open_.has(r[1])), `lists only funds still raising, no platform / partnership (${r0.length})`);
check(r0.some((r) => /stale/.test(r[2])), "a status not refreshed in 12+ months is flagged stale");
check(r0.some((r) => r[7] && r[7] !== "—"), "named LPs are shown where sourced");
await pg.selectOption("#dsh-fim .dsh-fim-strat", "Senior Direct Lending"); await pg.waitForTimeout(150);
const dl = await rows();
check(dl.length > 0 && dl.every((r) => r[4] === "Senior Direct Lending"), `the strategy filter narrows to direct lending (${dl.length})`);
// No region toggle (owner 2026-10-16, R44k): the card lists EVERY region.
check(!(await pg.evaluate(() => !!document.querySelector("#dsh-fim [data-fim-scope], #dsh-fim .dsh-sortchip"))), "no Europe / All-regions toggle");
const nonEu = r0.filter((r) => !/Europ|UK|Nordic|DACH|Ireland|France|German|Spain|Ital/i.test(r.join(" "))).length;
check(nonEu > 0, `every region is listed, not only Europe (${nonEu} non-European of ${r0.length})`);
// LP commitments ledger (review #15): newest first, each sourced, linked to the LP page.
const lpc = await pg.evaluate(() => [...document.querySelectorAll("#dsh-lpc tbody tr")].map((tr) => ({ d: tr.querySelector(".c-date").textContent, lp: (tr.querySelector("a.dsh-drill") || {}).getAttribute?.("href") || "", src: !!tr.querySelector('.dsh-src[href^="http"]') })));
check(lpc.length >= 20 && lpc.every((r) => r.src && /#\/lp\//.test(r.lp)), `LP commitments list is sourced and links each investor (${lpc.length})`);
const ts = lpc.map((r) => Date.parse(r.d)).filter((x) => !Number.isNaN(x));
check(ts.every((t, i) => i === 0 || ts[i - 1] >= t), "LP commitments run newest first");
checkErrs(errs, "funds in market");
await b.close(); srv.close();
finish();
