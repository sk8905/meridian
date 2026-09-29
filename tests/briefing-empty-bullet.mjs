// Home briefing — a desk bullet that carries a kicker but NO body (e.g. a
// half-generated refresh draft where the headline shipped before its sentence
// did) must NOT paint as a bare desk heading above an empty void. The renderer
// drops any desk group whose combined body has no visible text, so the briefing
// never shows a textless, sourceless section (regression: a reader once saw a
// "Fixed income" heading with nothing under it, then a gap down to the footer).
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const HERO = { asOf: "2026-09-18", instruments: ["spx", "ndx"].map((k, i) => ({
  key: k, label: k.toUpperCase(), unit: "", pre: "", dp: 2, fi: false, value: 100 + i,
  history: Array.from({ length: 30 }, (_, j) => [Date.now() - (29 - j) * 864e5, 100 + i + j * 0.1]),
})) };
const srv = await serve({ "/api/hero": () => [200, JSON.stringify(HERO)], "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })] });
const b = await launchChromium();

const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-hbrief .g-hbrief-head", { timeout: 8000 });
await pg.waitForFunction(() => typeof window.__wireRenderBrief === "function", { timeout: 8000 });

// Inject a controlled slot into the freshest brief: one good Macro bullet and one
// EMPTY-BODY Fixed income bullet (a kicker with nothing after the em-dash), then
// repaint. The empty bullet is its own desk (no good Fixed-income sibling to fold
// into), so it stands or falls on its own.
const r = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const order = (B.order || []).filter((k) => slots[k]);
  const stamp = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`; };
  const key = order.reduce((best, k) => (stamp(k) > stamp(best) ? k : best), order[0]);
  slots[key].bullets = [
    { html: "<strong>Macro &mdash; a real, sourced sentence with actual body text that must survive the render intact</strong> and keep its citation.", src: "https://example.com/macro", srcName: "Example" },
    { html: "<strong>Fixed income &mdash;</strong>", src: "https://example.com/fi", srcName: "Ghost" },
  ];
  window.__wireRenderBrief();
  const el = document.getElementById("g-hbrief");
  const secs = [...el.querySelectorAll(".g-hbrief-b")];
  const decode = (s) => { const d = document.createElement("textarea"); d.innerHTML = s; return d.value; };
  return {
    deskHeads: secs.map((s) => ((s.querySelector(".g-hbrief-lede-hd") || {}).textContent || "").trim().toLowerCase()),
    // Every rendered section must carry visible body text — no ghost heading over a void.
    everySectionHasBody: secs.length > 0 && secs.every((s) => {
      const bt = s.querySelector(".g-hbrief-bt");
      return !!bt && (bt.textContent || "").trim().length > 0;
    }),
    macroShown: secs.some((s) => /a real, sourced sentence/i.test(s.textContent || "")),
    ghostGone: !secs.some((s) => ((s.querySelector(".g-hbrief-lede-hd") || {}).textContent || "").trim().toLowerCase() === "fixed income"),
    sectionCount: secs.length,
    _decode: decode("&amp;"),   // sanity that the harness textarea decode works
  };
});

check(r.everySectionHasBody, `every rendered desk section has visible body text — no ghost heading over a void (desks: ${r.deskHeads.join(", ")})`);
check(r.macroShown, "the good Macro bullet still renders with its full body");
check(r.ghostGone, "the empty-body 'Fixed income' bullet is dropped, not painted as a bare heading");
checkEq(r.sectionCount, 1, "only the one desk with real body text is shown");

checkErrs(errs, "briefing empty-body bullet");
await ctx.close();
await b.close(); srv.close();
finish();
