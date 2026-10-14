// Dashboard ▸ Credit — the two reference rosters (moved from Transactions, 2026-10):
// the European credits universe (ELLI obligors, sourced rating + 12-month trend) and
// the BDC roster (Listed / Private, sourced figures, live Px/NAV). Each is ONE card of
// two-line rows that expand in place, identical in anatomy on desktop and iPhone —
// never a sideways-scrolling table. Deep links ?credit= / ?bdc= open a row; the old
// Transactions #/credits · #/bdc links redirect here; the palette points here.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import { BDCS } from "../credit/js/bdcs.js";
import { EUR_CREDITS } from "../credit/js/eu-credits.js";
import { managers } from "../credit/js/data.js";

// ---- data (pure): ratings are sourced, BDC manager links resolve -------------------
const unsourcedRating = EUR_CREDITS.filter((c) => c.rating && !/^https?:\/\//.test(c.source || "")).map((c) => c.name);
check(unsourcedRating.length === 0, `every credit rating links its public rating action (${unsourcedRating.slice(0, 4).join(", ") || "none"})`);
const ids = new Set(managers.map((m) => m.id));
const deadMgr = BDCS.filter((b) => b.managerId && !ids.has(b.managerId)).map((b) => b.name);
check(deadMgr.length === 0, `every BDC manager link resolves to a profile (${deadMgr.join(", ") || "none"})`);

// Deterministic quotes so the price/NAV ratio is stable (ARCC NAV 19.35 → 21.30/19.35 ≈ 1.10×).
const QUOTES = JSON.stringify({ quotes: { ARCC: { price: 21.30 }, FSK: { price: 15.50 }, MAIN: { price: 52.00 } }, asOf: "2026-09-15" });
const srv = await serve({ "/api/quotes": () => [200, QUOTES] });
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const V = '.v2-view[data-view="dashboard"]';

for (const [dev, label] of [[DESKTOP, "desktop"], [PHONE, "phone"]]) {
  const { ctx, pg, errs } = await open(b, dev, base + "/v2/dashboard/credit");
  await pg.waitForSelector(`${V} #dsh-bdcs .crr-row`, { timeout: 8000 });
  await pg.waitForTimeout(500);
  const v = await pg.evaluate((V) => {
    const cr = document.querySelector(`${V} #dsh-credits`), bd = document.querySelector(`${V} #dsh-bdcs`);
    const se = document.scrollingElement;
    const over = (el) => [...el.querySelectorAll("*")].filter((x) => x.getBoundingClientRect().right > el.getBoundingClientRect().right + 1).length;
    const arcc = [...bd.querySelectorAll(".crr-row")].find((r) => r.dataset.bdc === "ARCC");
    return {
      crRows: cr.querySelectorAll(".crr-row").length, crTables: cr.querySelectorAll("table").length + bd.querySelectorAll("table").length,
      crTrend: [...cr.querySelectorAll(".crr-row")].every((r) => r.querySelector(".tcr-tr.tx-up, .tcr-tr.tx-dn, .tcr-tr.tx-fl") && r.querySelector(".tcr-rt")),
      chips: [...cr.querySelectorAll("[data-crtrend]")].map((c) => c.textContent.replace(/\d+/g, "").trim()),
      more: !!cr.querySelector("[data-crall]"),
      secs: [...bd.querySelectorAll(".crr-sec")].map((s) => s.textContent.replace(/\d+/g, "").trim()),
      bdRows: bd.querySelectorAll(".crr-row").length,
      arccPx: arcc ? (arcc.querySelector(".tbdc-pxnav") || {}).textContent : null,
      mgrLinks: bd.querySelectorAll("a.crr-mgr").length,
      pageOver: se.scrollWidth - se.clientWidth, cardOver: over(cr) + over(bd),
    };
  }, V);
  check(v.crTables === 0, `${label}: the rosters are card lists, not tables (${v.crTables} tables)`);
  check(v.crRows >= 12 && v.crTrend, `${label}: credits rows show a rating + 12-month trend (${v.crRows} rows)`);
  check(v.chips.join("|") === "All|▼ Downgraded|▲ Upgraded" && v.more, `${label}: credits quick chips + a "Show all" (${v.chips.join(" · ")})`);
  check(v.secs.join("|") === "Listed|Private (non-traded)" && v.bdRows === BDCS.length, `${label}: BDCs list every fund in Listed / Private sections (${v.bdRows})`);
  check(/^1\.10× NAV$/.test((v.arccPx || "").trim()), `${label}: listed BDCs show the LIVE price÷NAV (${v.arccPx})`);
  check(v.mgrLinks === BDCS.filter((x) => x.managerId).length, `${label}: covered advisers link to their profile (${v.mgrLinks})`);
  check(v.pageOver <= 1 && v.cardOver === 0, `${label}: no horizontal overflow — page ${v.pageOver}px, ${v.cardOver} elements past the card edge`);

  // Credits: Downgraded chip narrows; a row expands with its sourced rating + deals; re-tap closes.
  const c = await pg.evaluate(async (V) => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const root = document.querySelector(`${V} #dsh-credits .crr-root`);
    root.querySelector('[data-crtrend="down"]').click(); await wait(80);
    const rows = [...root.querySelectorAll(".crr-row")];
    const allDown = rows.length > 0 && rows.every((r) => r.querySelector(".tcr-tr.tx-dn"));
    root.querySelector('[data-crtrend=""]').click(); await wait(80);
    const sel = root.querySelector(".crr-sort"); sel.value = "name"; sel.dispatchEvent(new Event("change", { bubbles: true })); await wait(80);
    const names = [...root.querySelectorAll(".crr-row .crr-nm")].map((n) => n.textContent.trim());
    const rated = [...root.querySelectorAll(".crr-row")].find((r) => !r.querySelector(".tcr-nr"));
    const name = rated.dataset.cr;
    rated.querySelector(".crr-hd").click(); await wait(80);
    const open = root.querySelector(".crr-row.is-open");
    const src = !!(open && open.querySelector('.crr-x a[href^="http"]'));
    const url = location.search;
    open.querySelector(".crr-hd").click(); await wait(80);
    return { allDown, az: names.every((x, i) => i === 0 || names[i - 1].localeCompare(x) <= 0), name, opened: open && open.dataset.cr === name, src, url, closed: !root.querySelector(".crr-row.is-open"), after: location.search };
  }, V);
  check(c.allDown, `${label}: "▼ Downgraded" narrows to the 12-month downgrades`);
  check(c.az, `${label}: the sort menu orders credits A–Z`);
  check(c.opened && c.src && c.url.includes("credit="), `${label}: a credit row expands in place with its rating source, recorded as ?credit= (${c.url})`);
  check(c.closed && !c.after.includes("credit="), `${label}: tapping the open credit again closes it`);

  // BDC: expand ARCC → facts + SEC sources + holdings CTA; search narrows.
  const d = await pg.evaluate(async (V) => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const root = document.querySelector(`${V} #dsh-bdcs .crr-root`);
    root.querySelector('.crr-row[data-bdc="ARCC"] .crr-hd').click(); await wait(80);
    const o = root.querySelector(".crr-row.is-open");
    const r = { open: o && o.dataset.bdc, facts: o ? o.querySelector(".crr-x").textContent : "", sec: o ? o.querySelectorAll('.crr-srcs a[href^="https://www.sec.gov"]').length : 0, hold: !!(o && o.querySelector(".tbdc-hold-btn")), url: location.search };
    const q = root.querySelector(".crr-q"); q.value = "blue owl"; q.dispatchEvent(new Event("input", { bubbles: true })); await wait(250);
    r.search = [...root.querySelectorAll(".crr-row")].every((x) => /blue owl/i.test(x.textContent)) && root.querySelectorAll(".crr-row").length > 0;
    q.value = ""; q.dispatchEvent(new Event("input", { bubbles: true })); await wait(250);
    return r;
  }, V);
  check(d.open === "ARCC" && /Total assets/.test(d.facts) && /Non-accruals/.test(d.facts) && d.sec > 0 && d.hold && d.url.includes("bdc=ARCC"), `${label}: a BDC row expands to sourced facts, SEC links and the holdings fetch (?bdc=ARCC)`);
  check(d.search, `${label}: BDC search narrows the roster`);
  const over2 = await pg.evaluate(() => document.scrollingElement.scrollWidth - document.scrollingElement.clientWidth);
  check(over2 <= 1, `${label}: still no horizontal overflow with rows expanded (${over2})`);
  if (label === "phone") await pg.screenshot({ path: "/tmp/claude-0/-home-user-meridian/3c917844-30a7-5006-b275-efaa6a1a7146/scratchpad/rosters-phone.png" }).catch(() => {});
  else await pg.screenshot({ path: "/tmp/claude-0/-home-user-meridian/3c917844-30a7-5006-b275-efaa6a1a7146/scratchpad/rosters-desktop.png" }).catch(() => {});
  checkErrs(errs, `credit rosters ${label}`);
  await ctx.close();
}

// Deep links: ?bdc= opens that fund; a legacy Transactions #/bdc link and #/credits link redirect here.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/transactions/#/bdc?open=ARCC");
  await pg.waitForSelector(`${V} #dsh-bdcs .crr-row.is-open`, { timeout: 8000 });
  const r = await pg.evaluate((V) => ({ path: location.pathname, search: location.search, open: document.querySelector(`${V} #dsh-bdcs .crr-row.is-open`).dataset.bdc }), V);
  check(r.path === "/v2/dashboard/credit" && r.open === "ARCC", `a legacy #/bdc?open=ARCC link lands on Dashboard ▸ Credit with ARCC open (${r.path}${r.search})`);
  const name = EUR_CREDITS.find((c) => c.rating).name;
  await pg.goto(base + "/v2/transactions/#/credits?open=" + encodeURIComponent(name));
  await pg.waitForSelector(`${V} #dsh-credits .crr-row.is-open`, { timeout: 8000 });
  const c = await pg.evaluate((V) => ({ path: location.pathname, open: document.querySelector(`${V} #dsh-credits .crr-row.is-open`).dataset.cr }), V);
  check(c.path === "/v2/dashboard/credit" && c.open === name, `a legacy #/credits?open= link opens that credit on the Dashboard (${c.open})`);
  checkErrs(errs, "credit roster deep links");
  await ctx.close();
}

await b.close(); srv.close();
finish();
