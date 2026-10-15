// "Who advised on this deal?" (review 2026-10-15, #9). The Transactions deal drawer
// carries an Advisers line built from evidence only (v2/js/deal-advisers.js): firms
// named in the deal's own sourced summary, and a tracked law firm's own announcement
// that names the borrower within the deal's date window and shares its amount / words.
// Waymo's $5bn financing (Sixth Street) → Latham & Watkins, per Latham's announcement.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import { deals } from "../credit/js/data.js";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForTimeout(500);
const unit = await pg.evaluate(async () => {
  const m = await import("/v2/js/deal-advisers.js");
  return {
    text: m.advisersInText("Morgan Lewis advised Zencap Asset Management and Bpifrance on their investment. The company raised EUR 45 million."),
    none: m.advisersInText("Blackstone led the financing; Latham is a town in New York."),
    terms: m.dealTerms({ headline: "Hercules Capital closes upsized $400m 6.700% notes due 2029", summary: "Class A notes priced at 82bps over SONIA; a five-year facility." }),
  };
});
check(unit.text.includes("Morgan Lewis"), `a firm named in an advising sentence is extracted (${unit.text.join(", ")})`);
check(JSON.stringify(unit.terms) === JSON.stringify([["Pricing", "82bp over SONIA"], ["Coupon", "6.700%"], ["Tenor", "five-year"], ["Maturity", "2029"]]), `terms are read verbatim from the deal text (${JSON.stringify(unit.terms)})`);
check(unit.none.length === 0, `a firm name outside an advising sentence is ignored (${unit.none.join(", ")})`);

const waymo = deals.find((d) => /Waymo/.test(d.headline));
await pg.goto(`http://localhost:${srv.port}/v2/transactions/#/deal/${waymo.id}`);
await pg.waitForSelector("#tx-drawer:not([hidden])", { timeout: 10000 });
await pg.waitForFunction(() => !/Checking law-firm/.test(document.querySelector("#tx-drawer").innerText), null, { timeout: 10000 });
const adv = await pg.evaluate(() => { const li = [...document.querySelectorAll("#tx-drawer .tbiz li")].find((l) => /Advisers/.test(l.querySelector(".tbiz-k").textContent)); return li ? { t: li.innerText, href: (li.querySelector("a") || {}).href || "" } : null; });
check(adv && /Latham & Watkins/.test(adv.t) && /^https?:/.test(adv.href), `Waymo deal: Advisers names Latham & Watkins with its announcement link (${adv && adv.t.replace(/\s+/g, " ")})`);

// CLO terms (review #11): Cordatus XXXIX carries its sourced WACD / RP / NC.
await pg.goto(`http://localhost:${srv.port}/v2/transactions/#/deal/d921`);
await pg.waitForSelector("#tx-drawer:not([hidden])", { timeout: 10000 });
const clo = await pg.evaluate(() => { const li = [...document.querySelectorAll("#tx-drawer .tbiz li")].find((l) => /CLO terms/.test(l.textContent)); return li ? li.innerText.replace(/\s+/g, " ") : ""; });
check(/WACD 181bp/.test(clo) && /RP 4\.5y/.test(clo) && /terms source/.test(clo), `CLO drawer shows sourced terms (${clo})`);
await pg.goto(`http://localhost:${srv.port}/v2/transactions/#/structured`); await pg.waitForTimeout(400);
check(await pg.evaluate(() => [...document.querySelectorAll("#tx-body td.txc-px")].some((td) => /\d/.test(td.textContent))), "the Structured credit list shows an AAA / WACD column with figures");
checkErrs(errs, "deal advisers");
await b.close(); srv.close();
finish();
