// Desktop Dashboard lists preview 10 rows + "See all N" like the iPhone (owner
// 2026-10-15): the stress list, regulatory calendar, funds in market and LP commitments
// show 10 rows; "See all" opens the whole list in a centred panel.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, { viewport: { width: 1920, height: 1080 } }, `http://localhost:${srv.port}/v2/dashboard/credit`);
await pg.waitForSelector(".dsh-stresswrap", { timeout: 10000 });
await pg.waitForTimeout(800);
const r = await pg.evaluate(() => {
  const vis = (sel) => { const t = document.querySelector(sel); return t ? [...t.querySelectorAll("tbody tr")].filter((tr) => tr.offsetParent !== null).length : -1; };
  const more = (sel) => ((document.querySelector(sel) || {}).querySelector?.(".dsh-seeall") || {}).textContent || "";
  return { stress: vis(".dsh-stresswrap table"), sMore: more(".dsh-stresswrap"), fim: vis("#dsh-fim-b table"), fMore: more("#dsh-fim-b"), lpc: vis("#dsh-lpc table"), lMore: more("#dsh-lpc") };
});
check(r.stress === 10 && /See all \d+/.test(r.sMore), `stress list: 10 rows + ${r.sMore.trim()} (${r.stress})`);
check(r.fim === 10 && /See all \d+/.test(r.fMore), `funds in market: 10 rows + ${r.fMore.trim()} (${r.fim})`);
check(r.lpc === 10 && /See all \d+/.test(r.lMore), `LP commitments: 10 rows + ${r.lMore.trim()} (${r.lpc})`);
await pg.click(".dsh-stresswrap .dsh-seeall"); await pg.waitForTimeout(250);
const sh = await pg.evaluate(() => { const s = document.querySelector(".dsh-sheet"); if (!s) return null; const r = s.getBoundingClientRect(); return { rows: s.querySelectorAll("tbody tr").length, w: Math.round(r.width) }; });
check(sh && sh.rows > 10 && sh.w < 1920, `"See all" opens the whole list in a centred panel (${sh && sh.rows} rows, ${sh && sh.w}px)`);
checkErrs(errs, "dashboard desktop preview");
await b.close(); srv.close();
finish();
