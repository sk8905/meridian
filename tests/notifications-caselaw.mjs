// Notification bell: case law is delivered SILENTLY — it stays in the Legal desk
// and feeds, but is kept OUT of the notification bell UNLESS a party to the case
// is a fund or manager the app covers. Exercises the real predicate (saved.js
// __caseInBell) and buildNotifs() against the live legal dataset, so it's
// independent of the 3-day notification window.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForTimeout(600);

const r = await pg.evaluate(async () => {
  const [saved, legal] = await Promise.all([import("/saved.js?v=20260904-1"), import("/legal/js/data.js")]);
  const cases = legal.cases || [];
  const kept = cases.filter((c) => saved.__caseInBell(c));
  const silent = cases.filter((c) => !saved.__caseInBell(c));
  // The assembled bell must never surface a silently-delivered case: every "c:<id>"
  // that reaches the bell must be a kept (covered-entity) case.
  const notifs = await saved.buildNotifs();
  const bellCaseIds = new Set(notifs.filter((n) => n.id && n.id.startsWith("c:")).map((n) => n.id.slice(2)));
  const silentInBell = silent.filter((c) => bellCaseIds.has(c.id)).map((c) => c.name);
  return {
    total: cases.length,
    kept: kept.length,
    silent: silent.length,
    bellCases: bellCaseIds.size,
    silentInBell,
    keptSample: kept.slice(0, 3).map((c) => (c.name || "").slice(0, 80)),
  };
});

check(r.total > 20, `legal data carries case law (${r.total})`);
check(r.silent >= Math.floor(r.total * 0.5), `most case law is delivered silently — kept out of the bell (${r.silent}/${r.total})`);
check(r.kept > 0, `case law naming a covered manager/fund is kept in the bell (${r.kept}) e.g. ${JSON.stringify(r.keptSample[0] || "")}`);
check(r.silentInBell.length === 0, `no silently-delivered case reaches the bell (leaked: ${JSON.stringify(r.silentInBell.slice(0, 3))})`);

checkErrs(errs, "notifications case law");
await ctx.close();
await b.close(); srv.close();
finish();
