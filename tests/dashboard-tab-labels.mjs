// Dashboard section nav: the desktop LEFT rail keeps the full label, while the
// narrow iPhone TOP tab bar (a full-width segmented bar) shortens the two-word
// labels ("Hedge Funds" -> "Hedge") so each fits its
// equal segment without clipping.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// The visible label = whichever of the two spans is displayed at this width. Read
// the RENDERED text of the fixed-income and hedge-funds chips (offsetParent null =
// hidden), so this asserts the CSS toggle, not just the markup.
async function visibleLabels(dev) {
  const { ctx, pg, errs } = await open(b, dev, base + "/v2/dashboard/");
  await pg.waitForTimeout(1500);
  const out = await pg.evaluate(() => {
    const shown = (sub) => {
      const chip = document.querySelector(`.dsh-railnav .dsh-navchip[data-sub="${sub}"]`);
      if (!chip) return "MISSING";
      // Prefer an explicit long/short span pair; fall back to the chip text.
      const spans = [...chip.querySelectorAll("span")];
      if (spans.length) return spans.filter((s) => s.offsetParent !== null || getComputedStyle(s).display !== "none").map((s) => s.textContent).join("").trim();
      return chip.textContent.trim();
    };
    return { fi: shown("rates"), hf: shown("hedge-funds"), pane: (document.querySelector(".dsh-3z") || {}).dataset?.pane || null };
  });
  checkErrs(errs, `dashboard tab labels (${dev === PHONE ? "phone" : "desktop"})`);
  await ctx.close();
  return out;
}

const phone = await visibleLabels(PHONE);
checkEq(phone.fi, "Rates", "iPhone top tab bar: the Rates tab reads 'Rates' (one word, no short variant)");
checkEq(phone.pane, "rates", "Dashboard opens on the Rates sub-tab by default (R37)");
checkEq(phone.hf, "Hedge", "iPhone top tab bar: Hedge Funds shows 'Hedge'");

const desk = await visibleLabels(DESKTOP);
checkEq(desk.fi, "Rates", "Desktop rail: the Rates tab reads 'Rates'");
checkEq(desk.pane, "rates", "Desktop: Dashboard opens on Rates by default");

// Retired sub-tab URLs (Macro, Bonds) resolve to Rates and canonicalise in place.
for (const old of ["macro", "fixed-income"]) {
  const { ctx, pg, errs } = await open(b, DESKTOP, base + `/v2/dashboard/${old}/`);
  await pg.waitForTimeout(1200);
  const r = await pg.evaluate(() => ({ pane: document.querySelector(".dsh-3z")?.dataset.pane, path: location.pathname }));
  checkEq(r.pane, "rates", `/v2/dashboard/${old}/ opens the merged Rates tab`);
  check(/\/dashboard\/rates$/.test(r.path), `/v2/dashboard/${old}/ canonicalises the URL to /dashboard/rates (${r.path})`);
  checkErrs(errs, `dashboard legacy ${old} url`);
  await ctx.close();
}
checkEq(desk.hf, "Hedge Funds", "Desktop rail: Hedge Funds keeps the full label");

// Phones: the section tabs pin directly under the fixed Wire header (the old global
// top band and the per-section search are both gone — the Dashboard has no search bar).
{
  const { ctx, pg } = await open(b, PHONE, base + "/v2/dashboard/credit/");
  await pg.waitForTimeout(1500);
  await pg.evaluate(() => window.scrollTo(0, 900));
  await pg.waitForTimeout(150);
  const s = await pg.evaluate(() => {
    const rail = document.querySelector(".dsh-railnav");
    const whh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wire-head-h")) || 57;
    const rr = rail.getBoundingClientRect();
    return { whh: Math.round(whh), noTopBand: !document.querySelector(".dsh > .wire-band"),
      noSearch: !document.querySelector(".dsh-search, .dsh-q"),
      railPos: getComputedStyle(rail).position, railTop: Math.round(rr.top), railBot: Math.round(rr.bottom),
      scrolled: window.scrollY };
  });
  check(s.scrolled > 50, `dashboard page scrolls on phone (${s.scrolled}px)`);
  check(s.noTopBand, "the global search band above the chips is gone");
  check(s.noSearch, "the Dashboard carries no search bar");
  check(s.railPos === "sticky" && Math.abs(s.railTop - s.whh) <= 3, `section tabs stay pinned directly under the header (tabs ${s.railTop} ≈ header ${s.whh})`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
