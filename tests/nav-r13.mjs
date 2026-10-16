// =============================================================================
// nav-r13.mjs — the owner-approved navigation (R13, 2026-10-15).
//   iPhone bottom bar AND desktop header: Home · Dashboard · News · Deals · Profiles (Restructuring and
//     Fundraising are chips inside Deals, so Deals stays lit on the Restructuring hub).
//   Desktop header: the same without News — desktop Home is the news wire (owner
//   2026-10-15). Restructuring and
//   Fundraising are folded into Deals, which stays lit on both.
//   iPhone section heading rows are ONE sideways-scrolling row (no clipped chips).
// =============================================================================
import { launchChromium, serve, PHONE, DESKTOP, open, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const base = `http://localhost:${srv.port}`;
const browser = await launchChromium();
const lit = (pg, sel) => pg.evaluate((s) => [...document.querySelectorAll(s)].filter((b) => b.classList.contains("is-active")).map((b) => b.dataset.key), sel);

// ---- iPhone ----------------------------------------------------------------
{
  const { pg, errs } = await open(browser, PHONE, base + "/v2/transactions/");
  await pg.waitForSelector(".mobile-tabbar .mtab");
  const labels = await pg.$$eval(".mobile-tabbar .mtab .mtab-lbl", (els) => els.map((e) => e.textContent.trim()));
  checkEq(labels.join(" · "), "Home · Dashboard · News · Deals · Profiles", "phone: bottom bar order + labels (owner 2026-10-16)");
  checkEq((await lit(pg, ".mobile-tabbar .mtab")).join(), "transactions", "phone: Deals lit on Transactions");
  await pg.waitForSelector("#tx-mode .tchip");
  const modes = await pg.$$eval("#tx-mode .tchip", (els) => els.map((e) => e.textContent.trim()));
  check(modes.includes("Restructuring") && modes.includes("Fundraising") && modes.includes("League tables"), `phone: Deals chips include Restructuring · Fundraising · League tables (${modes.join(" · ")})`);
  const row = await pg.$eval("#tx-mode", (e) => ({ sw: e.scrollWidth, cw: e.clientWidth, ox: getComputedStyle(e).overflowX, tops: new Set([...e.children].filter((k) => k.offsetParent).map((k) => Math.round(k.getBoundingClientRect().top))).size }));
  check(row.tops === 1 && row.sw > row.cw && /auto|scroll/.test(row.ox), `phone: Deals chips are one sideways-scrolling row (${JSON.stringify(row)})`);
  const axis = await pg.$eval("#tx-mode", (e) => ({ oy: getComputedStyle(e).overflowY, ta: getComputedStyle(e).touchAction }));
  check(axis.oy === "hidden" && axis.ta === "pan-x", `phone: the chip row moves only sideways — no vertical drag (${JSON.stringify(axis)})`);
  await pg.goto(base + "/v2/restructuring/"); await pg.waitForSelector(".mobile-tabbar .mtab");
  await pg.waitForTimeout(500);
  checkEq((await lit(pg, ".mobile-tabbar .mtab")).join(), "transactions", "phone: Deals stays lit on the Restructuring hub");
  // Profiles list chips: one row, nothing clipped.
  await pg.goto(base + "/v2/profiles/"); await pg.waitForSelector("#pf-chips .tchip");
  const pf = await pg.$eval("#pf-chips", (e) => ({ ox: getComputedStyle(e).overflowX, clipped: [...e.children].some((k) => k.scrollWidth > k.clientWidth + 1), tops: new Set([...e.children].map((k) => Math.round(k.getBoundingClientRect().top))).size }));
  check(pf.tops === 1 && !pf.clipped && /auto|scroll/.test(pf.ox), `phone: Profiles chips are one scrollable row with no clipped label (${JSON.stringify(pf)})`);
  const noX = await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  check(noX, "phone: no page-level sideways scroll");
  checkErrs(errs, "phone nav");
  await pg.close();
}

// ---- Desktop: the SAME nav (owner 2026-10-15) --------------------------------
{
  const { pg, errs } = await open(browser, DESKTOP, base + "/v2/transactions/");
  await pg.waitForSelector("#wire-header .ps-btn");
  const pills = await pg.$$eval("#wire-header .ps-btn", (els) => els.map((e) => e.textContent.trim()));
  checkEq(pills.join(" · "), "Home · Dashboard · News · Deals · Profiles", "desktop: header pills = the same nav as iPhone (owner 2026-10-16)");
  checkEq((await lit(pg, "#wire-header .ps-btn")).join(), "transactions", "desktop: Deals lit on the deal list");
  await pg.goto(base + "/v2/transactions/#/fundraising"); await pg.waitForSelector("#wire-header .ps-btn"); await pg.waitForTimeout(400);
  checkEq((await lit(pg, "#wire-header .ps-btn")).join(), "transactions", "desktop: Fundraising is part of Deals (Deals lit)");
  await pg.goto(base + "/v2/restructuring/"); await pg.waitForSelector("#wire-header .ps-btn"); await pg.waitForTimeout(400);
  checkEq((await lit(pg, "#wire-header .ps-btn")).join(), "transactions", "desktop: the Restructuring hub is part of Deals (Deals lit)");
  checkEq(await pg.title(), "Wire Restructuring", "desktop: hub title");
  await pg.click('#wire-header .ps-btn[data-key="dashboard"]');
  await pg.waitForFunction(() => location.pathname.startsWith("/v2/dashboard"));
  checkEq(await pg.title(), "Wire Dashboard", "desktop: Dashboard title");
  checkErrs(errs, "desktop nav");
  await pg.close();
}

await browser.close(); srv.close();
finish();
