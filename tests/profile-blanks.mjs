// profile-blanks.mjs — a profile never prints a raw "null" / "undefined" / "NaN" where
// a field is missing (data audit 2026-10-21: a lender stub read "· Founded null").
// Covers a researched manager, an unresearched lender stub, a hedge fund, an LP,
// a law firm, a borrower and a deal, at phone and desktop width.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import { managers } from "../credit/js/data.js";

const stub = managers.find((m) => m.profileStub && m.founded == null && m.hq == null);
const pages = [
  ["manager", "/v2/profiles/#/manager/m21"],
  ["lender stub", `/v2/profiles/#/manager/${stub.id}`],
  ["hedge fund", "/v2/profiles/#/hf/h2"],
  ["investor", "/v2/profiles/#/lp/l1"],
  ["law firm", "/v2/profiles/#/firm/latham"],
  ["borrower", "/v2/profiles/#/co/Sunseeker%20International"],
  ["deal", "/v2/transactions/#/deal/d1166"],
];
const srv = await serve();
const b = await launchChromium();
for (const [dn, dev] of [["phone", PHONE], ["desktop", DESKTOP]]) for (const [what, url] of pages) {
  const { ctx, pg, errs } = await open(b, dev, `http://localhost:${srv.port}${url}`);
  await pg.waitForFunction(() => (document.querySelector("#pf-detail, #tx-detail, .tdet, .g-drawer") || document.body).innerText.length > 200, null, { timeout: 15000 }).catch(() => {});
  await pg.waitForTimeout(400);
  const bad = await pg.evaluate(() => {
    const root = document.querySelector("#pf-detail") || document.querySelector(".tdet") || document.body;
    return (root.innerText.match(/(^|[\s·(:])(null|undefined|NaN|\[object Object\])(?=$|[\s·),.])/gm) || []).map((s) => s.trim());
  });
  check(bad.length === 0, `${what} (${dn}): no raw null/undefined/NaN in the page${bad.length ? " — " + [...new Set(bad)].join(", ") : ""}`);
  checkErrs(errs, `${what} (${dn})`);
  await ctx.close();
}
await b.close(); srv.close();
finish();
