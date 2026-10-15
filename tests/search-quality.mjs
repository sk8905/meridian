// Search quality (review 2026-10-15, #4). The command palette must answer a credit
// lawyer's queries: a concept that lives in an alert's TEXT ("intercreditor") is found;
// dated results run NEWEST FIRST (a "CLO" search leads with this year's CLOs, not
// 2021's); and a broad query is not silently capped at 40 — a "Show all N" row expands
// the full list. Undated placeholder dates never print as "1 Jan".
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/credit`);
await pg.waitForTimeout(1200);
await pg.keyboard.press("/");
await pg.waitForSelector(".mcmdk.open .mcmdk-input", { timeout: 8000 });

const search = async (q) => {
  await pg.fill(".mcmdk-input", q);
  await pg.waitForTimeout(250);
  return pg.evaluate(() => ({
    rows: [...document.querySelectorAll(".mcmdk-row")].map((r) => ({ t: r.querySelector(".mcmdk-t").textContent, s: (r.querySelector(".mcmdk-s") || {}).textContent || "" })),
    more: (document.querySelector(".mcmdk-more") || {}).textContent || "",
  }));
};

const ic = await search("intercreditor");
check(ic.rows.length > 0, `"intercreditor" finds alerts/judgments by their text (${ic.rows.length})`);

const clo = await search("clo");
const MON = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
const ym = (s) => { const m = /(\d{1,2} )?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (20\d\d)/.exec(s); return m ? +m[3] * 100 + MON[m[2]] : null; };
const cloDated = clo.rows.filter((r) => /^CLO/.test(r.s)).map((r) => ym(r.s)).filter(Boolean);
check(cloDated.length > 3, `"clo" returns dated CLO rows (${cloDated.length})`);
check(cloDated.every((d, i) => i === 0 || cloDated[i - 1] >= d), "CLO results run newest first");
check(cloDated[0] >= 202607, `the first CLO result is recent (${cloDated[0]})`);
check(/Show all \d+ results/.test(clo.more), `a broad query offers "Show all" instead of a silent 40 cap (${clo.more || "none"})`);
const total = +((/Show all (\d+)/.exec(clo.more) || [])[1] || 0);
await pg.click(".mcmdk-more");
await pg.waitForTimeout(200);
const expanded = await pg.evaluate(() => document.querySelectorAll(".mcmdk-row").length);
check(expanded === total && total > 40, `"Show all" expands to every match (${expanded}/${total})`);

const all = await search("restructuring plan");
check(!all.rows.some((r) => /· 1 Jan 20\d\d/.test(r.s)), "no result prints a placeholder \"1 Jan\" date");

checkErrs(errs, "search quality");
await b.close(); srv.close();
finish();
