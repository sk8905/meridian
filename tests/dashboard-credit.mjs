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
    // Cleaned up: no explainer paragraph, no descriptor sub-label, and each row's
    // source is JUST the SRC link — no context note (.dsh-band) before it.
    headline: !!card.querySelector(".dsh-fl-note"),
    descriptor: !!card.querySelector(".dsh-h .dsh-n"),
    notes: card.querySelectorAll(".dsh-kv .dsh-band").length,
  };
});
check(!!pc, "Credit: Private credit card renders");
check(pc && pc.rows >= 4, `Credit: private-credit metrics render (${pc && pc.rows})`);
check(pc && pc.sourced, "Credit: every private-credit metric links its source");
check(pc && pc.pcdr, "Credit: shows the Fitch Private Credit Default Rate (6.0%)");
check(pc && !pc.headline, "Credit: the explainer paragraph is removed");
check(pc && !pc.descriptor, "Credit: the 'Fitch PCDR & market pulse' descriptor is removed");
check(pc && pc.notes === 0, `Credit: each source is just the SRC label, no context note (${pc && pc.notes} notes)`);

// Stress table: a clean data grid (Debtor · Debt · Status · Src) — the prose note
// column is reduced to just the SRC link (no .dsh-clamp2 note text).
const stress = await pg.evaluate(() => {
  const tbl = document.querySelector('.v2-view[data-view="dashboard"] .dsh-stresstbl');
  if (!tbl) return null;
  const rows = [...tbl.querySelectorAll("tbody tr")];
  return {
    rows: rows.length,
    proseNotes: tbl.querySelectorAll(".dsh-clamp2").length,
    srcOnly: rows.length > 0 && rows.every((r) => { const c = r.querySelector("td.dsh-note"); return c && c.querySelector('.dsh-src[href^="http"]') && !c.querySelector(".dsh-clamp2"); }),
  };
});
check(stress && stress.rows > 0, `Credit: stress table renders (${stress && stress.rows})`);
check(stress && stress.proseNotes === 0 && stress.srcOnly, "Credit: stress rows carry just an SRC link, no prose note");

checkErrs(errs, "dashboard credit private-credit");
await ctx.close();
await b.close(); srv.close();
finish();
