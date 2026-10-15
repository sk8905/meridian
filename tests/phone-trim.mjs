// Owner 2026-10-15: on iPhone the Deals card carries no source column and the Profiles
// card rows carry no HQ — both stay on desktop and on the deal drawer / profile page.
// The amount / AUM drops to line 2's right end at line 2's size, and the bars are
// search · Filters only (region and the mid-market lens live in the Filters sheet).
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
  const a = await pg.evaluate(() => {
    const c = [...document.querySelectorAll("#tx-body .tx-card")].find((x) => x.querySelector(".tx-card-amt").textContent.trim());
    const am = c.querySelector(".tx-card-amt"), m = c.querySelector(".g-ev-m"), t = c.querySelector(".g-ev-t"), R = (e) => e.getBoundingClientRect();
    return { line2: Math.abs(R(am).bottom - R(m).bottom) < 4 && R(am).top > R(t).bottom - 2, right: R(am).left > R(m).left, size: getComputedStyle(am).fontSize === getComputedStyle(m).fontSize && [am, ...am.querySelectorAll("*")].every((e) => getComputedStyle(e).color === getComputedStyle(m).color) };
  });
  check(a.line2 && a.right && a.size, `iPhone Deals: the amount sits at line 2's right end at line 2's size and grey (${JSON.stringify(a)})`);
  const bar = await pg.evaluate(() => ["#tx-scope", "#tx-focus", "#tx-q", "#tx-filters"].map((s) => !!document.querySelector(s)?.getClientRects().length));
  check(!bar[0] && !bar[1] && bar[2] && bar[3], `iPhone Deals bar: search · Filters only (scope / mid-market shown: ${bar[0]} / ${bar[1]})`);
  await pg.click("#tx-filters"); await pg.waitForSelector("#tx-sheet:not([hidden])", { timeout: 5000 });
  const sh = await pg.evaluate(() => ({ eu: !!document.querySelector('#tx-sheet [data-europe="1"]'), mid: !!document.querySelector('#tx-sheet [data-fit="target"]') }));
  check(sh.eu && sh.mid, `iPhone Deals: the Filters sheet carries All Europe and European mid-market (${JSON.stringify(sh)})`);
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
  const f = await pg.evaluate(() => {
    const tr = [...document.querySelectorAll("#pf-panes .pf-cards tbody tr")].find((r) => r.getClientRects().length && /\d/.test((r.querySelector("td.pf-c-main") || {}).textContent || ""));
    const mn = tr.querySelector("td.pf-c-main"), nm = tr.querySelector("td.tl-nm"), mt = [...tr.querySelectorAll("td.pf-c-meta")].find((x) => x.getClientRects().length), R = (e) => e.getBoundingClientRect();
    return { below: R(mn).top >= R(nm).bottom - 2, right: Math.round(R(tr).right - R(mn).right) < 20, size: !mt || (getComputedStyle(mn).fontSize === getComputedStyle(mt).fontSize && [mn, ...mn.querySelectorAll("*")].every((e) => getComputedStyle(e).color === getComputedStyle(mt).color)) };
  });
  check(f.below && f.right && f.size, `iPhone Profiles ${hash || "All"}: the AUM sits at line 2's right end at line 2's size and grey (${JSON.stringify(f)})`);
  const fb = await pg.evaluate(() => [...document.querySelectorAll("#pf-panes #cr-lg-focus, #pf-panes #cr-hf-focus")].filter((e) => e.getClientRects().length).length);
  check(fb === 0, `iPhone Profiles ${hash || "All"}: no Target / $1–15bn button on the bar (${fb} shown)`);
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
