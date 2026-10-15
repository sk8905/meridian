// The bell rings only for material items (review 2026-10-15, #8): earnings-call dates,
// webcasts, awards, podcasts, outlooks and firm newsletters never ring it — they stay
// in the feeds. A real mandate ("FRR awards €420m of unitranche mandates") or a deal
// still does. Exercises saved.js __lowSignal and the built notification list.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForTimeout(600);
const r = await pg.evaluate(async () => {
  const m = await import("/saved.js");
  const low = m.__lowSignal;
  const list = await m.buildNotifs();
  return {
    drops: ["Palmer Square Capital BDC Inc. Announces Third Quarter 2026 Earnings Release and Conference Call", "Asia Funds & Financial Services Newsletter", "Great Fund Insights podcast: Five questions on sustainability linked fund financing", "2026 Midyear Credit Outlook: Adoption, Financing and Investing in the Age of AI", "Park Square Perspectives: Why Private Credit is a \"no-brainer\""].map(low),
    keeps: ["France's FRR awards €420m of unitranche private-debt mandates to Eurazeo, Eiffel Investment Group and Zencap Asset Management", "CVC Credit prices Cordatus XXXIX, its second European CLO of 2026, at €400m", "Court of Appeal upholds Thames Water's Part 26A restructuring plan"].map(low),
    leaked: list.filter((x) => low(x.title)).length,
    n: list.length,
  };
});
check(r.drops.every(Boolean), `housekeeping / marketing / newsletter titles are low-signal (${r.drops.join(",")})`);
check(r.keeps.every((x) => !x), `real deals, mandates and judgments are not (${r.keeps.join(",")})`);
check(r.leaked === 0, `no low-signal item reaches the bell (${r.leaked} of ${r.n})`);
checkErrs(errs, "notifications materiality");
await b.close(); srv.close();
finish();
