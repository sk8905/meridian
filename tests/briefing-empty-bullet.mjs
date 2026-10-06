// Briefing data integrity + render resilience. Two layers stop a textless desk
// section (a kicker with no body sentence — e.g. a half-generated refresh draft)
// from ever reaching a reader:
//   1. DATA GATE — the committed briefings.js is validated here, so a malformed
//      brief fails `node tests/run.mjs` and can never be deployed (the pre-push
//      gate is the "once and for all" stop).
//   2. RENDER GUARD — even if a bad bullet slipped through, the renderer drops a
//      desk group whose body has no visible text, so it never paints a bare
//      heading over a void (belt and braces).
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

// --- 1. DATA GATE: validate the REAL committed briefings.js --------------------
// Every slot must be well-formed and every bullet must carry a real body sentence
// (not just a "Desk —" kicker) AND a real source URL. This is the grounding rule
// (R7) enforced on the data itself, so a refresh that ships an empty-body bullet
// turns the suite red before it can deploy.
const data = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  // Body text remaining once an optional "<strong>Desk &mdash;" kicker is removed —
  // mirrors the renderer's _stripDesk so this checks exactly what a reader would see.
  const stripDesk = (h) => String(h || "").replace(/^(\s*<strong>)\s*[^<]*?\s*(?:&mdash;|—)\s*/, "$1");
  const hasText = (h) => String(h || "").replace(/<[^>]*>/g, "").replace(/&(?:[a-z]+|#\d+);/gi, " ").replace(/\s+/g, "").length > 0;
  const isUrl = (u) => /^https?:\/\//.test(String(u || ""));
  // Briefing prose must STATE THE NEWS, not narrate who reported it (HOUSE_STYLE R28):
  // no "according to", no "explains why", and no outlet/byline named next to an
  // attribution verb ("the FT reports/explains/notes", "Bloomberg's Markets Daily notes").
  // Newsmaker statements ("Chancellor Healey warns…") are fine — "warns/warned" are not
  // flagged, and the ban is scoped to publication names, so a real quote is untouched.
  const narratesSource = (h) => {
    const t = String(h || "");
    if (/\baccording to\b/i.test(t)) return "according to";
    if (/\bexplains?\s+why\b/i.test(t)) return "explains why";
    if (/\b(?:the\s+)?(?:FT|Financial\s+Times|Bloomberg|Reuters|CNBC|WSJ|the\s+Journal|the\s+Economist|the\s+Times|Barron)\b(?:&rsquo;s|&#8217;s|’s|'s)?[^.<]{0,40}?\b(?:reports?|explains?|notes?|writes?|says?)\b/i.test(t)) return "outlet + reporting verb";
    return null;
  };
  const keys = Object.keys(slots);
  const bad = [];
  let bulletN = 0;
  for (const k of keys) {
    const s = slots[k] || {};
    // The Overview lede is retired — not rendered and no longer required in the data.
    if (!s.date || !s.time) bad.push(`${k}: missing date/time`);
    const bl = Array.isArray(s.bullets) ? s.bullets : [];
    if (!bl.length) bad.push(`${k}: no bullets`);
    bl.forEach((x, i) => {
      bulletN++;
      if (!hasText(x && x.html)) bad.push(`${k}[${i}]: empty html`);
      // The defect that started this: a kicker with no body sentence after the dash.
      else if (!hasText(stripDesk(x.html))) bad.push(`${k}[${i}]: kicker with no body ("${String(x.html).replace(/<[^>]*>/g, "").slice(0, 40)}")`);
      if (!isUrl(x && x.src)) bad.push(`${k}[${i}]: bad/missing src`);
      if (!(x && String(x.srcName || "").trim())) bad.push(`${k}[${i}]: missing srcName`);
      const nv = narratesSource(x && x.html);
      if (nv) bad.push(`${k}[${i}]: narrates the source (${nv}) — state the news; the srcName link is the attribution`);
    });
  }
  return { slots: keys.length, bulletN, bad };
});
check(data.slots >= 1, `briefings.js has at least one slot (${data.slots})`);
check(data.bulletN >= 1, `briefings.js carries bullets (${data.bulletN})`);
check(data.bad.length === 0, `every briefing bullet has a real body sentence AND a source (R7) — no defects${data.bad.length ? ": " + data.bad.join("; ") : ""}`);

// --- 2. RENDER GUARD: an empty-body bullet is dropped, not painted -------------
// Inject a controlled slot into the freshest brief: one good Macro bullet and one
// EMPTY-BODY Bonds bullet (a kicker with nothing after the em-dash), repaint,
// and assert the ghost is dropped while the good bullet survives.
const r = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const order = (B.order || []).filter((k) => slots[k]);
  const stamp = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`; };
  const key = order.reduce((best, k) => (stamp(k) > stamp(best) ? k : best), order[0]);
  slots[key].bullets = [
    { html: "<strong>Macro &mdash; a real, sourced sentence with actual body text that must survive the render intact</strong> and keep its citation.", src: "https://example.com/macro", srcName: "Example" },
    { html: "<strong>Bonds &mdash;</strong>", src: "https://example.com/fi", srcName: "Ghost" },
  ];
  window.__wireRenderBrief();
  const el = document.getElementById("g-hbrief");
  const secs = [...el.querySelectorAll(".g-hbrief-b")];
  return {
    deskHeads: secs.map((s) => ((s.querySelector(".g-hbrief-lede-hd") || {}).textContent || "").trim().toLowerCase()),
    everySectionHasBody: secs.length > 0 && secs.every((s) => {
      const bt = s.querySelector(".g-hbrief-bt");
      return !!bt && (bt.textContent || "").trim().length > 0;
    }),
    macroShown: secs.some((s) => /a real, sourced sentence/i.test(s.textContent || "")),
    ghostGone: !secs.some((s) => ((s.querySelector(".g-hbrief-lede-hd") || {}).textContent || "").trim().toLowerCase() === "bonds"),
    sectionCount: secs.length,
  };
});
check(r.everySectionHasBody, `every rendered desk section has visible body text — no ghost heading over a void (desks: ${r.deskHeads.join(", ")})`);
check(r.macroShown, "the good Macro bullet still renders with its full body");
check(r.ghostGone, "the empty-body 'Bonds' bullet is dropped, not painted as a bare heading");
checkEq(r.sectionCount, 1, "only the one desk with real body text is shown");

checkErrs(errs, "briefing empty-body bullet");
await ctx.close();
await b.close(); srv.close();
finish();
