// Credit dashboard ▸ Private credit card: Fitch's Private Credit Default Rate +
// market-context metrics, each a sourced value. Guards that the card renders and
// every metric links a real source (never fabricated).
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/credit/`);
await pg.waitForTimeout(1500);

const pc = await pg.evaluate(() => {
  // The Private credit DETAIL card (with the sourced metric grid) — identified by
  // its panel header, so the terminal's top pulse-strip card (whose pills also say
  // "Private credit default rate") isn't matched instead.
  const card = [...document.querySelectorAll('.v2-view[data-view="dashboard"] .dsh-card')].find((c) => { const h = c.querySelector(".dsh-h"); return h && /private credit/i.test(h.textContent); });
  if (!card) return null;
  const rows = [...card.querySelectorAll(".dsh-kv")];
  return {
    rows: rows.length,
    sourced: rows.length > 0 && rows.every((r) => r.querySelector('.dsh-src[href^="http"]')),
    pcdr: /6\.0%/.test(card.textContent) && /Private Credit Default Rate/i.test(card.textContent),
    headline: !!card.querySelector(".dsh-fl-note"),
  };
});
check(!!pc, "Credit: Private credit card renders");
check(pc && pc.rows >= 4, `Credit: private-credit metrics render (${pc && pc.rows})`);
check(pc && pc.sourced, "Credit: every private-credit metric links its source");
check(pc && pc.pcdr, "Credit: shows the Fitch Private Credit Default Rate (6.0%)");
check(pc && pc.headline, "Credit: private-credit headline present");

checkErrs(errs, "dashboard credit private-credit");
await ctx.close();
await b.close(); srv.close();
finish();
