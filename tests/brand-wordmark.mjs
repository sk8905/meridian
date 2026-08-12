// Header wordmark: the stylised wordmark reads "W/RE" (the slash stands in for
// the "i"), with NO accent tint on the slash. The box "/" logo is reserved for
// the standalone app icon and does NOT sit alongside the text. The written /
// accessible name stays "Wire" (the brand link's aria-label).
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
await pg.waitForTimeout(1300);

const r = await pg.evaluate(() => {
  const brand = document.querySelector(".brand");
  const strong = document.querySelector(".brand-text strong");
  const slash = document.querySelector(".brand-text .brand-i");
  const slashColor = slash ? getComputedStyle(slash).color : null;
  const textColor = strong ? getComputedStyle(strong).color : null;
  return {
    aria: brand ? brand.getAttribute("aria-label") : null,
    hasBoxLogo: !!document.querySelector(".brand .logo"),
    wordmark: strong ? strong.textContent.replace(/\s+/g, "") : null,
    slashText: slash ? slash.textContent.trim() : null,
    strongHidden: strong ? strong.getAttribute("aria-hidden") : null,
    slashInheritsColour: !!(slashColor && textColor && slashColor === textColor),
  };
});
check(!r.hasBoxLogo, "the box / logo does not sit alongside the wordmark (reserved for the app icon)");
checkEq(r.wordmark, "W/RE", "the wordmark reads W/RE");
checkEq(r.slashText, "/", "the slash stands in for the i");
check(r.slashInheritsColour, "the slash carries no accent tint (inherits the wordmark colour)");
check(/wire/i.test(r.aria || ""), `the accessible/written name stays Wire (aria "${r.aria}")`);
checkEq(r.strongHidden, "true", "the stylised wordmark is aria-hidden so screen readers get 'Wire'");

checkErrs(errs, "brand wordmark");
await ctx.close();
await b.close(); srv.close();
finish();
