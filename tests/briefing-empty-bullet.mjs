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

// --- 1. DATA INTEGRITY: validate the REAL committed briefings.js ----------------
// Per-authored-bullet grounding (R7): every bullet with a source must carry a real
// body sentence (not just a "Desk —" kicker), a real source URL + name, and must STATE
// the news rather than narrate who reported it. (Desk ASSIGNMENT and four-desk COVERAGE
// are no longer checked here — the renderer normalises every kicker to a canonical desk
// and synthesises any missing one, so those are verified in §3 against the RENDER, not
// the raw data. This keeps the gate from blocking on the refresh routine's house style.)
const data = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {};
  // Single-briefing model: one briefing object. (Legacy {slots} → its slot objects.)
  const briefs = Array.isArray(B.bullets) ? [B] : Object.values(B.slots || {});
  const stripDesk = (h) => String(h || "").replace(/^(\s*<strong>)\s*[^<]*?\s*(?:&mdash;|—)\s*/, "$1");
  const hasText = (h) => String(h || "").replace(/<[^>]*>/g, "").replace(/&(?:[a-z]+|#\d+);/gi, " ").replace(/\s+/g, "").length > 0;
  const isUrl = (u) => /^https?:\/\//.test(String(u || ""));
  // STATE THE NEWS, don't narrate the reporting (HOUSE_STYLE R28): no "according to",
  // no "explains why", no outlet named next to a reporting verb. Newsmaker statements
  // ("Chancellor Healey warns…") are fine.
  const narratesSource = (h) => {
    const t = String(h || "");
    if (/\baccording to\b/i.test(t)) return "according to";
    if (/\bexplains?\s+why\b/i.test(t)) return "explains why";
    if (/\b(?:the\s+)?(?:FT|Financial\s+Times|Bloomberg|Reuters|CNBC|WSJ|the\s+Journal|the\s+Economist|the\s+Times|Barron)\b(?:&rsquo;s|&#8217;s|’s|'s)?[^.<]{0,40}?\b(?:reports?|explains?|notes?|writes?|says?)\b/i.test(t)) return "outlet + reporting verb";
    return null;
  };
  const bad = [];
  let bulletN = 0;
  for (const [k, s] of briefs.entries()) {
    if (!s.date || !s.time) bad.push(`${k}: missing date/time`);
    const bl = Array.isArray(s.bullets) ? s.bullets : [];
    if (!bl.length) bad.push(`${k}: no bullets`);
    bl.forEach((x, i) => {
      bulletN++;
      if (!hasText(x && x.html)) bad.push(`${k}[${i}]: empty html`);
      else if (!hasText(stripDesk(x.html))) bad.push(`${k}[${i}]: kicker with no body ("${String(x.html).replace(/<[^>]*>/g, "").slice(0, 40)}")`);
      if (!isUrl(x && x.src)) bad.push(`${k}[${i}]: bad/missing src`);
      if (!(x && String(x.srcName || "").trim())) bad.push(`${k}[${i}]: missing srcName`);
      const nv = narratesSource(x && x.html);
      if (nv) bad.push(`${k}[${i}]: narrates the source (${nv}) — state the news; the srcName link is the attribution`);
    });
  }
  return { count: briefs.length, bulletN, bad };
});
check(data.count >= 1, `briefings.js carries a briefing (${data.count})`);
check(data.bulletN >= 1, `briefings.js carries bullets (${data.bulletN})`);
check(data.bad.length === 0, `every briefing bullet has a real body sentence AND a source, and states the news (R7) — no defects${data.bad.length ? ": " + data.bad.join("; ") : ""}`);

// --- 2. FOUR-DESK GUARANTEE: every category covered, no exceptions --------------
// Inject a deliberately lopsided slot — one real Macro bullet, an EMPTY-BODY Bonds
// bullet, and an off-house "Oil" bullet — and assert the rendered card STILL shows all
// four canonical desks (Macro · Bonds · Equities · Credit), each with visible body text:
//   • the off-house "Oil" kicker is folded into Macro (normalised, not shown as "Oil"),
//   • the empty-body Bonds bullet is replaced by a synthesised Bonds line (no bare heading),
//   • the absent Equities and Credit desks are synthesised too.
// This is the owner's "force a note on every category" rule, enforced on the real renderer.
const r = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {};
  const tgt = Array.isArray(B.bullets) ? B : (() => { const slots = B.slots || {}; const stamp = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`; }; const order = (B.order || []).filter((k) => slots[k]); return slots[order.reduce((best, k) => (stamp(k) > stamp(best) ? k : best), order[0])]; })();
  tgt.bullets = [
    { html: "<strong>Macro &mdash; a real, sourced sentence with actual body text that must survive the render intact</strong> and keep its citation.", src: "https://example.com/macro", srcName: "Example" },
    { html: "<strong>Oil &mdash; crude slipped as supply fears eased</strong> across the complex.", src: "https://example.com/oil", srcName: "Example" },
    { html: "<strong>Bonds &mdash;</strong>", src: "https://example.com/fi", srcName: "Ghost" },
  ];
  window.__wireRenderBrief();
  const el = document.getElementById("g-hbrief");
  const secs = [...el.querySelectorAll(".g-hbrief-b")];
  const heads = secs.map((s) => ((s.querySelector(".g-hbrief-bk") || {}).textContent || "").trim());
  return {
    heads,
    everySectionHasBody: secs.length > 0 && secs.every((s) => { const bt = s.querySelector(".g-hbrief-bt"); return !!bt && (bt.textContent || "").trim().length > 0; }),
    macroShown: secs.some((s) => /a real, sourced sentence/i.test(s.textContent || "")),
    oilFolded: !heads.some((h) => /oil/i.test(h)),
    sectionCount: secs.length,
  };
});
check(r.sectionCount === 4 && JSON.stringify(r.heads) === JSON.stringify(["Macro", "Bonds", "Equities", "Credit"]), `all four canonical desks always render, in house order (got: ${r.heads.join(" · ")})`);
check(r.everySectionHasBody, "every desk section has visible body text — a missing or empty-body desk is filled, never a bare heading");
check(r.macroShown, "a real authored bullet still renders with its full body");
check(r.oilFolded, "an off-house kicker ('Oil') is folded into a canonical desk, never shown as its own section");

checkErrs(errs, "briefing four-desk guarantee");
await ctx.close();
await b.close(); srv.close();
finish();
