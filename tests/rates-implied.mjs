// Market-implied policy path (review 2026-10-15, #17): Dashboard ▸ Rates groups the
// prediction-market odds on the next Fed / ECB / BoE decisions by bank and meeting,
// each linked to its market and labelled as crowd probabilities (not a Wire forecast).
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkErrs, finish } from "./lib.mjs";

const PRED = { markets: [
  { venue: "Polymarket", type: "Fed & rates", q: "Will the Fed increase interest rates by 25 bps after the December 2026 meeting?", yes: 79, chg: 3, end: "2026-12-09T23:59:00Z", url: "https://polymarket.com/event/fed-decision-in-december" },
  { venue: "Polymarket", type: "Fed & rates", q: "Will there be no change in Fed interest rates after the December 2026 meeting?", yes: 20, chg: -2, end: "2026-12-09T23:59:00Z", url: "https://polymarket.com/event/fed-decision-in-december" },
  { venue: "Polymarket", type: "Other", q: "Will the ECB announce no change at the October 2026 meeting?", yes: 92, chg: 1, end: "2026-10-30T03:59:00Z", url: "https://polymarket.com/event/ecb-october" },
  { venue: "Kalshi", type: "Other", q: "Will Taylor Swift release an album?", yes: 50, url: "https://kalshi.com/x" },
] };
const srv = await serve({ "/api/predict": () => [200, JSON.stringify(PRED)] });
const b = await launchChromium();
const { pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/rates`);
await pg.waitForSelector("#dsh-implied .dsh-implied-tbl", { timeout: 10000 });
const r = await pg.evaluate(() => ({
  rows: [...document.querySelectorAll("#dsh-implied tbody tr")].map((tr) => tr.innerText.replace(/\s+/g, " ")),
  links: [...document.querySelectorAll("#dsh-implied tbody a")].every((a) => /^https:\/\/(polymarket|kalshi)\.com/.test(a.href)),
  cap: (document.querySelector("#dsh-implied .dsh-ladder-cap") || {}).textContent || "",
  badge: (document.querySelector('.dsh-live[data-live="implied"]') || {}).textContent,
}));
check(r.rows.length === 2 && /^ECB/.test(r.rows[0]) && /Hold 92%/.test(r.rows[0]), `ECB row first with its hold odds (${r.rows[0]})`);
check(/^Fed December 2026 .*Hike 25bp 79%.*Hold 20%/.test(r.rows[1]), `Fed December meeting groups hike + hold odds (${r.rows[1]})`);
check(!r.rows.some((x) => /Swift/.test(x)), "non-central-bank markets are excluded");
check(r.links && /not a Wire forecast/.test(r.cap), "each odd links its market and is labelled as crowd probability");
check(r.badge === "live", `a live payload badges LIVE (${r.badge})`);
checkErrs(errs, "rates implied path");
// iPhone: the async-filled table re-renders as stacked rows (tables are hidden on phones).
{
  const p = await open(b, PHONE, `http://localhost:${srv.port}/v2/dashboard/rates`);
  await p.pg.waitForSelector("#dsh-implied .dsh-implied-tbl", { state: "attached", timeout: 10000 });
  await p.pg.waitForTimeout(300);
  const n = await p.pg.evaluate(() => document.querySelectorAll("#dsh-implied .dsh-stk-list .dsh-stk-i").length);
  check(n === 2, `phone: the implied path shows as stacked rows (${n})`);
  checkErrs(p.errs, "rates implied path (phone)");
  await p.ctx.close();
}
await b.close(); srv.close();
finish();
