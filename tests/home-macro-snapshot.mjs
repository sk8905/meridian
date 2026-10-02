// Policy-rate snapshot (right rail): the compact US · UK read under the markets/rates
// bands. Two display rules are enforced here:
//   1. The Forecast column shows ONLY the one-word call — the trending mood keyword
//      ("· Hawkish" / "· Dovish" / "· Neutral") is dropped (no .g-snap-mood).
//   2. A leading action verb is stripped when it is immediately followed by a SIGNED
//      size: "Hike +25bp" renders as "+25bp" (the sign carries the direction); a bare
//      "Hold" is left intact.
// Data is the real committed /home-data.js OUTLOOK, so the assertions are behavioural
// (data-agnostic) rather than pinned to a specific rate call.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve({ "/api/hero": () => [200, JSON.stringify({ asOf: "2026-09-18", instruments: [] })], "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })] });
const b = await launchChromium();

const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-macro-snap .g-snap-fc", { timeout: 8000 });

const r = await pg.evaluate(() => {
  const el = document.getElementById("g-macro-snap");
  const fcs = [...el.querySelectorAll(".g-snap-fc")].map((n) => n.textContent.trim());
  return {
    fcs,
    moodNodes: el.querySelectorAll(".g-snap-mood").length,
    // No forecast cell may still read as "<verb> +25bp" / "<verb> -25bp".
    verbBeforeSign: fcs.filter((t) => /^(?:hike|cut|raise|lower|rise)\s+[+\-−]/i.test(t)),
    // No forecast cell may carry the mood words inline either.
    moodInText: fcs.filter((t) => /\b(hawkish|dovish|neutral)\b/i.test(t)),
    hasSignedBp: fcs.some((t) => /[+\-−]\s*\d+\s*bp/i.test(t)),
  };
});

check(r.fcs.length >= 2, `the snapshot renders a forecast for both countries (${r.fcs.join(" | ")})`);
check(r.moodNodes === 0, "the trending mood tag (.g-snap-mood) is gone from the Forecast column");
check(r.moodInText.length === 0, `no forecast cell carries a mood word inline (${r.moodInText.join(", ") || "none"})`);
check(r.verbBeforeSign.length === 0, `no forecast drops a redundant action verb before a signed size (offenders: ${r.verbBeforeSign.join(", ") || "none"})`);
// When a signed bp size is shown (e.g. the US hike call), it proves the verb was
// stripped while the sign+magnitude survived.
if (r.hasSignedBp) check(r.fcs.some((t) => /^[+\-−]\s*\d+\s*bp/i.test(t)), `a signed-size forecast leads with its sign, not a verb (${r.fcs.join(" | ")})`);

checkErrs(errs, "home macro snapshot");
await ctx.close();
await b.close(); srv.close();
finish();
