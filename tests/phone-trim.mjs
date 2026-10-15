// Owner 2026-10-15: on iPhone the Deals card carries no source column and the Profiles
// card rows carry no HQ — both stay on desktop and on the deal drawer / profile page.
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const shown = (sel) => `[...document.querySelectorAll(${JSON.stringify(sel)})].filter((e) => e.getClientRects().length && e.getBoundingClientRect().width > 0).length`;

{
  const { ctx, pg, errs } = await open(b, PHONE, `${base}/v2/transactions/`);
  await pg.waitForSelector("#tx-body .tx-card", { timeout: 10000 });
  const d = await pg.evaluate(new Function(`const c = document.querySelector("#tx-body .tx-card"), t = c.querySelector(".g-ev-t");
    return { src: ${shown("#tx-body .tx-card > .c-src")}, cards: document.querySelectorAll("#tx-body .tx-card").length,
      reach: Math.round(c.getBoundingClientRect().right - t.getBoundingClientRect().right) };`));
  check(d.cards > 5 && d.src === 0, `iPhone Deals: no source column on any card (${d.src} of ${d.cards} shown)`);
  check(d.reach < 140, `iPhone Deals: the headline takes the freed width (${d.reach}px to the row's right edge)`);
  checkErrs(errs, "deals phone"); await ctx.close();
}
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `${base}/v2/transactions/`);
  await pg.waitForSelector("#tx-body .tx-row", { timeout: 10000 });
  check(await pg.evaluate(new Function(`return ${shown("#tx-body td.c-src")} > 0;`)), "desktop Deals: the source column stays");
  checkErrs(errs, "deals desktop"); await ctx.close();
}
for (const hash of ["", "#/?tab=managers", "#/?tab=hedgefunds", "#/?tab=investors"]) {
  const { ctx, pg, errs } = await open(b, PHONE, `${base}/v2/profiles/${hash}`);
  await pg.waitForFunction(() => [...document.querySelectorAll("#pf-panes .pf-cards tbody tr")].some((r) => r.getClientRects().length), null, { timeout: 10000 });
  const n = await pg.evaluate(new Function(`return { hq: ${shown("#pf-panes .pf-cards tbody td.tl-hq")}, all: document.querySelectorAll("#pf-panes .pf-cards tbody td.tl-hq").length };`));
  check(n.hq === 0, `iPhone Profiles ${hash || "All"}: no HQ on the card rows (${n.hq} shown of ${n.all})`);
  checkErrs(errs, `profiles phone ${hash}`); await ctx.close();
}
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `${base}/v2/profiles/`);
  await pg.waitForSelector("#pf-panes tbody td.tl-hq", { timeout: 10000 });
  check(await pg.evaluate(new Function(`return ${shown("#pf-panes tbody td.tl-hq")} > 0;`)), "desktop Profiles: the HQ column stays");
  checkErrs(errs, "profiles desktop"); await ctx.close();
}
await b.close(); srv.close();
finish();
