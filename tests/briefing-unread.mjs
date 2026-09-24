// Briefing readability + unread notification.
//  (1) SPACING — the briefing prose now reads with the SAME airy leading as the
//      in-app reading pane (.g-read-p, line-height 1.72): consistent, easier to read.
//  (2) UNREAD DOT — the phone Briefing chip carries an orange notification dot when a
//      brief has landed that this viewer hasn't opened; opening the pane clears it,
//      and the cleared state persists across reloads.
import fs from "node:fs";
import path from "node:path";
import { serve, launchChromium, open, PHONE, ROOT, check, checkEq, checkErrs, finish } from "./lib.mjs";

// ---- (1) Spacing parity: reading pane and briefing share line-height 1.72 --------
{
  const css = fs.readFileSync(path.join(ROOT, "home.css"), "utf8");
  const lh = (sel) => {
    const m = css.match(new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\{[^}]*?line-height:\\s*([0-9.]+)"));
    return m ? m[1] : null;
  };
  const read = lh(".g-read-p"), lede = lh(".tui .g-hbrief-lede"), item = lh(".tui .g-hbrief-b");
  checkEq(read, "1.72", "reading pane keeps the comfortable 1.72 leading");
  checkEq(lede, read, "briefing lede matches the reading-pane line-height (consistent spacing)");
  checkEq(item, read, "briefing bullets match the reading-pane line-height (consistent spacing)");
}

const HERO = { asOf: "2026-09-24", instruments: ["spx", "ndx", "ust10", "oil", "gold", "btc"].map((k, i) => ({
  key: k, label: k.toUpperCase(), unit: "", pre: "", dp: 2, fi: false, value: 100 + i,
  history: Array.from({ length: 30 }, (_, j) => [Date.now() - (29 - j) * 864e5, 100 + i + j * 0.1]),
})) };
const srv = await serve({ "/api/hero": () => [200, JSON.stringify(HERO)], "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })] });
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- (2) Unread dot on the phone Briefing chip, + runtime spacing sanity ---------
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
  // Fresh viewer: no read record, and land on the wire (not the brief) so the latest
  // brief stays UNREAD.
  await pg.evaluate(() => { try { localStorage.removeItem("m_brief_read"); localStorage.setItem("wire.home.v1", JSON.stringify({ wire: "news" })); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector('.g-wiretab[data-wire="brief"] .g-wiretab-dot', { state: "attached", timeout: 8000 });
  await pg.waitForTimeout(400);
  const dotShown = () => pg.evaluate(() => { const d = document.querySelector('.g-wiretab[data-wire="brief"] .g-wiretab-dot'); return !!d && !d.hidden && getComputedStyle(d).display !== "none"; });
  const onBrief = () => pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="brief"]').classList.contains("is-on"));

  // Runtime: the rendered lede leads at ~1.72 × font-size (the reading-pane feel).
  const lh = await pg.evaluate(() => { const p = document.querySelector("#g-hbrief .g-hbrief-lede"); if (!p) return null; const cs = getComputedStyle(p); return parseFloat(cs.lineHeight) / parseFloat(cs.fontSize); });
  check(lh && Math.abs(lh - 1.72) < 0.05, `phone: the briefing lede renders at the reading-pane leading (~1.72, got ${lh ? lh.toFixed(2) : "n/a"})`);

  check(!(await onBrief()), "phone: the default pane is the wire, not the briefing");
  check(await dotShown(), "phone: an unread brief shows the orange dot on the Briefing chip");

  // Opening the pane clears the dot.
  await pg.click('.g-wiretab[data-wire="brief"]');
  await pg.waitForTimeout(300);
  check(await onBrief(), "phone: tapping Briefing activates its pane");
  check(!(await dotShown()), "phone: opening the briefing clears the dot (brief marked read)");

  // The read state persists: reload back onto the wire — the same (seen) brief shows no dot.
  await pg.evaluate(() => { try { localStorage.setItem("wire.home.v1", JSON.stringify({ wire: "news" })); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector('.g-wiretab[data-wire="brief"] .g-wiretab-dot', { state: "attached", timeout: 8000 });
  await pg.waitForTimeout(400);
  check(!(await onBrief()) && !(await dotShown()), "phone: the read state persists — no dot for an already-seen brief");
  checkErrs(errs, "briefing unread dot");
  await ctx.close();
}

await b.close(); srv.close();
finish();
