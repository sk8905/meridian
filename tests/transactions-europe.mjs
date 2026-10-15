// Deals carries NO default filter (owner 2026-10-15, superseding review #5's Europe-first
// default): the default list spans every region; one tap on the scope button narrows to
// European borrowers / assets (credit/js/tx.js EUROPE_REGIONS) and the URL carries
// scope=eu so Back / a pasted link restore it; a search spans every region; a deep link
// to a non-European deal still opens it.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { deals } from "../credit/js/data.js";
import { DEAL_TAGS } from "../credit/js/deal-tags.js";
import { tagsOf, EUROPE_REGIONS } from "../credit/js/tx.js";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/transactions/`);
await pg.waitForSelector("#tx-body tr.tx-row", { timeout: 10000 });
const isEu = (id) => { const d = deals.find((x) => x.id === id); return !!d && EUROPE_REGIONS.includes(tagsOf(d, DEAL_TAGS).region); };
const ids = () => pg.evaluate(() => [...document.querySelectorAll("#tx-body tr.tx-row")].map((tr) => tr.dataset.deal));

const all = await ids();
check(all.some((id) => !isEu(id)), `default list spans every region (non-European deals appear)`);
checkEq(await pg.evaluate(() => document.querySelector("#tx-scope").textContent.trim()), "All regions", "the scope button reads All regions by default");

await pg.click("#tx-scope"); await pg.waitForTimeout(250);
const eu = await ids();
check(eu.length > 0 && eu.slice(0, 30).every(isEu), `one tap narrows to European deals only (${eu.slice(0, 30).filter(isEu).length}/${Math.min(30, eu.length)})`);
check(/scope=eu/.test(await pg.evaluate(() => location.hash)), "the URL carries scope=eu");
checkEq(await pg.evaluate(() => document.querySelector("#tx-scope").textContent.trim()), "Europe", "the button then reads Europe");

await pg.click("#tx-scope"); await pg.waitForTimeout(150);
await pg.fill("#tx-q", "waymo"); await pg.waitForTimeout(400);
const q = await ids();
check(q.some((id) => /waymo/i.test(deals.find((d) => d.id === id).headline)), "a search spans every region (Waymo found while scoped to Europe)");

const usDeal = deals.find((d) => d.date && !isEu(d.id) && tagsOf(d, DEAL_TAGS).region === "na");
await pg.goto(`http://localhost:${srv.port}/v2/transactions/#/deal/${usDeal.id}`); await pg.waitForTimeout(800);
check(await pg.evaluate(() => { const d = document.querySelector("#tx-drawer"); return !!d && !d.hidden; }), `a deep link to a US deal opens its drawer (${usDeal.id})`);

checkErrs(errs, "transactions europe");
await b.close(); srv.close();
finish();
