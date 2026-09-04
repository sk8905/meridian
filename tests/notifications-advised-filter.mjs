// Notification bell: a "[law firm] advised …" deal announcement is suppressed
// from notifications UNLESS the deal names a manager / hedge fund the app covers
// (those stay). The item still lives in the app's legal feeds — this only gates
// the bell. Exercises the real predicate (saved.js __suppressedAdvised) against
// the live legal dataset, so it's independent of the 3-day notification window.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForTimeout(600);

const r = await pg.evaluate(async () => {
  const [saved, legal] = await Promise.all([import("/saved.js?v=20260904-1"), import("/legal/js/data.js")]);
  const RX = /\badvis(?:ed|es|ing)\b/i;
  const adv = (legal.items || []).filter((x) => RX.test(x.title || ""));
  const suppressed = adv.filter((x) => saved.__suppressedAdvised(x.title));
  const kept = adv.filter((x) => !saved.__suppressedAdvised(x.title));
  // A non-advised legal alert must never be suppressed by this filter.
  const nonAdvised = (legal.items || []).filter((x) => !RX.test(x.title || "")).slice(0, 200);
  const nonAdvisedSuppressed = nonAdvised.filter((x) => saved.__suppressedAdvised(x.title)).length;
  return {
    advised: adv.length,
    suppressed: suppressed.length,
    kept: kept.length,
    nonAdvisedSuppressed,
    keptSample: kept.slice(0, 3).map((x) => x.title.slice(0, 90)),
  };
});

check(r.advised > 50, `legal data carries law-firm "advised" announcements (${r.advised})`);
check(r.suppressed >= Math.floor(r.advised * 0.5), `the bulk of "advised" items are suppressed from the bell (${r.suppressed}/${r.advised})`);
check(r.kept > 0, `"advised" items naming a covered manager/hedge fund are kept (${r.kept}) e.g. ${JSON.stringify(r.keptSample[0] || "")}`);
check(r.nonAdvisedSuppressed === 0, "non-advised legal alerts are never suppressed by the filter");

checkErrs(errs, "notifications advised filter");
await ctx.close();
await b.close(); srv.close();
finish();
