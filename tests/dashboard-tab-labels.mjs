// Dashboard sub-tab labels: on the narrow iPhone tab bar the two-word labels are
// shortened ("Fixed Income" -> "Fixed", "Hedge Funds" -> "Hedge") so they don't
// wrap to two lines; desktop (the fixed-viewport terminal) keeps the full label.
import { serve, launchChromium, open, PHONE, DESKTOP, checkEq, checkErrs, finish } from "./lib.mjs";

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
      const chip = document.querySelector(`.dsh-nav .tchip[data-sub="${sub}"]`);
      if (!chip) return "MISSING";
      // Prefer an explicit long/short span pair; fall back to the chip text.
      const spans = [...chip.querySelectorAll("span")];
      if (spans.length) return spans.filter((s) => s.offsetParent !== null || getComputedStyle(s).display !== "none").map((s) => s.textContent).join("").trim();
      return chip.textContent.trim();
    };
    return { fi: shown("fixed-income"), hf: shown("hedge-funds") };
  });
  checkErrs(errs, `dashboard tab labels (${dev === PHONE ? "phone" : "desktop"})`);
  await ctx.close();
  return out;
}

const phone = await visibleLabels(PHONE);
checkEq(phone.fi, "Fixed", "iPhone: Fixed Income tab shows 'Fixed'");
checkEq(phone.hf, "Hedge", "iPhone: Hedge Funds tab shows 'Hedge'");

const desk = await visibleLabels(DESKTOP);
checkEq(desk.fi, "Fixed Income", "Desktop: Fixed Income tab keeps the full label");
checkEq(desk.hf, "Hedge Funds", "Desktop: Hedge Funds tab keeps the full label");

await b.close(); srv.close();
finish();
