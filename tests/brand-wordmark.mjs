// Header wordmark: the box logo stays a plain "/", the written name stays "Wire"
// (the brand link's accessible name), and the stylised wordmark reads "W/RE" with
// the slash standing in for the "i".
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
await pg.waitForTimeout(1300);

const r = await pg.evaluate(() => {
  const brand = document.querySelector(".brand");
  const logo = document.querySelector(".brand .logo");
  const strong = document.querySelector(".brand-text strong");
  const slash = document.querySelector(".brand-text .brand-i");
  return {
    aria: brand ? brand.getAttribute("aria-label") : null,
    logoText: logo ? logo.textContent.trim() : null,
    wordmark: strong ? strong.textContent.replace(/\s+/g, "") : null,
    slashText: slash ? slash.textContent.trim() : null,
    strongHidden: strong ? strong.getAttribute("aria-hidden") : null,
  };
});
checkEq(r.logoText, "/", "the box logo is unchanged (a plain /)");
checkEq(r.wordmark, "W/RE", "the wordmark reads W/RE");
checkEq(r.slashText, "/", "the slash stands in for the i");
check(/wire/i.test(r.aria || ""), `the accessible/written name stays Wire (aria "${r.aria}")`);
checkEq(r.strongHidden, "true", "the stylised wordmark is aria-hidden so screen readers get 'Wire'");

checkErrs(errs, "brand wordmark");
await ctx.close();
await b.close(); srv.close();
finish();
