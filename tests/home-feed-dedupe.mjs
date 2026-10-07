// The All lane merges the news feed with manager-wire events (mergeManagersIntoFeed). The
// SAME deal is routinely recorded BOTH as a credit deal (CRD, from the credit desk data) and
// as a manager-wire event (e.g. FIN, from the manager roster) — so without a cross-dedupe the
// lane shows it twice (observed live: a Hayfin €305m financing as both CRD and FIN). The merge
// must keep the news row and drop the duplicate manager event. Guard: no two visible rows in
// the All lane share a normalised title. Uses the REAL desk data (home-data.js), where the
// collision actually lives; the stubbed /api/feed only fixes the live RSS half.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const FEED = { items: [
  ...Array.from({ length: 20 }, (_, i) => ({ title: `Live wire story ${i} on rates and credit`, url: `https://www.reuters.com/x${i}`, source: "Reuters", date: "2026-10-06", time: "09:00", desk: "m" })),
] };
const srv = await serve({ "/api/feed": () => [200, JSON.stringify(FEED)] });
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-wire-lanes .g-wire-lane", { timeout: 8000 });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
// Force the All lane (the only lane that merges manager-wire events into the feed).
await pg.evaluate(() => { const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "All"); if (b) b.click(); });
await pg.waitForTimeout(700);

const r = await pg.evaluate(() => {
  const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const titles = rows.map((x) => norm((x.querySelector(".g-feed-title") || {}).textContent || "")).filter(Boolean);
  const seen = new Set(), dups = [];
  for (const t of titles) { if (seen.has(t)) dups.push(t); else seen.add(t); }
  // Report a couple of the offending headlines in full for the failure message.
  const rawByNorm = {};
  rows.forEach((x) => { const tt = (x.querySelector(".g-feed-title") || {}).textContent || ""; rawByNorm[norm(tt)] = tt.trim(); });
  return { total: titles.length, uniq: seen.size, dups: [...new Set(dups)].slice(0, 4).map((n) => rawByNorm[n]) };
});

check(r.total > 5, `All lane populated (${r.total} rows)`);
check(r.dups.length === 0, `All lane shows each story once — no duplicate titles across news + manager events (${r.dups.length} dup(s)${r.dups.length ? ": " + r.dups.join(" | ") : ""})`);

checkErrs(errs, "home feed dedupe");
await ctx.close();
await b.close();
srv.close();
finish();
