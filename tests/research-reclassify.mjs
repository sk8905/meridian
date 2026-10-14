// Research-house newsletters land in the RESEARCH lane, not Newsletters. The Gmail
// sweep writes two stores — newsletters.js and research.js — and both once listed the
// same research senders (Apollo, Goldman, Fitch, JPM, With Intelligence…), so a note
// from a research house could be filed into newsletters.js and show under "Newsletters".
// The feed engine now reclassifies any newsletter from a research PUBLICATION into
// Research (isResearchPublication), so house research never shows as a newsletter.
// Fitch is the clean proof: it exists ONLY in newsletters.js (research.js has no Fitch
// item), so a Fitch row in the Research lane can only have been reclassified.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve({ "/api/feed": () => [200, '{"items":[]}'], "/api/hero": () => [200, '{"asOf":"2026-10-09","instruments":[]}'], "/api/xfeed": () => [200, '{"tweets":[]}'] });
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-wire-lanes .g-wire-lane", { timeout: 8000 });
await pg.waitForTimeout(400);

// Sanity: newsletters.js really does carry research-house items (else the test is vacuous),
// and research.js carries no Fitch item (so a Fitch research row must be reclassified).
const data = await pg.evaluate(async () => {
  const n = await import("/newsletters.js"); const r = await import("/research.js");
  const nlResearch = (n.NEWSLETTERS || []).filter((x) => r.isResearchPublication(x.publication));
  return {
    nlResearchCount: nlResearch.length,
    nlResearchPubs: [...new Set(nlResearch.map((x) => x.publication))],
    researchHasFitch: (r.RESEARCH || []).some((x) => /fitch/i.test(x.publication)),
    nlHasFitch: (n.NEWSLETTERS || []).some((x) => /fitch/i.test(x.publication)),
  };
});
check(data.nlResearchCount >= 1, `newsletters.js carries research-house notes to reclassify (${data.nlResearchCount}: ${data.nlResearchPubs.join(", ")})`);
// research.js may now carry its own Fitch notes (real "Fitch Ratings" research emails), so the proof is that newsletters.js ALSO holds Fitch items that must be reclassified.
check(data.nlHasFitch, "newsletters.js carries Fitch items that reclassification must move into Research");

const laneRows = async (lane) => {
  await pg.evaluate((l) => { const btn = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === l); if (btn) btn.click(); }, lane);
  await pg.waitForTimeout(400);
  return pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row")].map((r) => ({
    src: ((r.querySelector(".g-feed-src") || {}).textContent || "").trim(),
    code: ((r.querySelector(".g-feed-code") || {}).textContent || "").trim(),
  })));
};

// Newsletters lane: NOT ONE row may be from a research house.
const nl = await laneRows("Newsletters");
const strays = await pg.evaluate(async (rows) => {
  const r = await import("/research.js");
  return rows.filter((x) => r.isResearchPublication(x.src)).map((x) => x.src);
}, nl);
check(nl.length >= 1, `Newsletters lane still renders genuine newsletters (${nl.length} rows)`);
check(strays.length === 0, `no research house appears under Newsletters${strays.length ? ": " + [...new Set(strays)].join(", ") : ""}`);

// Research lane: the reclassified houses are here, and carry the RSCH desk code.
const rsch = await laneRows("Research");
check(rsch.length >= 1 && rsch.every((x) => /RSH/.test(x.code)), `Research lane rows all carry the RSH code (${rsch.length} rows)`);
check(rsch.some((x) => /fitch/i.test(x.src)), `Fitch (newsletters-only) now shows in Research — reclassified (${[...new Set(rsch.map((r) => r.src))].slice(0, 6).join(", ")})`);

checkErrs(errs, "research reclassify");
await ctx.close();
await b.close(); srv.close();
finish();
