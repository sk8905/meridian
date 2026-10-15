// Menu ▸ Sources — "Coverage & sources" (v2/js/status-page.js, HOUSE_STYLE R15).
// It must work as the "what is failing or stale" view:
//   • a live /api endpoint that fails is FAILING and listed first under Needs attention,
//     with a plain-English reason and a fix (here /api/rates is stubbed to 500);
//   • data past its cadence window is STALE (here the health snapshot's Dashboard ▸ US
//     private credit stamp is stubbed 60 days old against its 45-day window);
//   • a working endpoint reads GOOD / Live; every FAILING row sorts above every STALE one;
//   • "Start here" carries three roles with 4–5 in-app links each, and "Add a law firm"
//     (the old Coverage chip's job) lives on the same page;
//   • /v2/menu/sources is a shareable link straight to the chip.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { LIVE_SNAPSHOT } from "../dashboard/js/live-snapshot.js";
import { HEALTH } from "../dashboard/js/health.js";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
const health = JSON.parse(JSON.stringify(HEALTH));
health.generated = new Date().toISOString();
const pc = health.surfaces.find((s) => s.key === "dashboard_pc");
check(!!pc, "health snapshot carries the dashboard_pc surface");
Object.assign(pc, { newestDate: iso(Date.now() - 60 * 864e5), windowDays: 45, stale: true, note: null });

// Live payloads: the committed last-known ones, plus a minimal useful /api/govyields
// (the snapshot does not carry that endpoint).
const PAYLOADS = { ...LIVE_SNAPSHOT.payloads, "/api/govyields": { data: { yields: [{ country: "US", y10: { v: 4.1 } }], ts: Date.now() } } };
async function stub(pg, { failRates = true } = {}) {
  await pg.route("**/dashboard/js/health.js", (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: "export const HEALTH = " + JSON.stringify(health) + ";" }));
  for (const [p, v] of Object.entries(PAYLOADS)) {
    await pg.route("**" + p + "*", (r) => (failRates && p === "/api/rates")
      ? r.fulfill({ status: 500, contentType: "application/json", body: "{}" })
      : r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(v.data) }));
  }
}
const settled = (pg) => pg.waitForFunction(() => {
  const c = document.querySelector("#v2-cov");
  return c && !c.querySelector(".cov-pill.is-check");
}, null, { timeout: 15000 });

for (const [dev, name] of [[PHONE, "phone"], [DESKTOP, "desktop"]]) {
  const { ctx, pg, errs } = await (async () => {
    const ctx = await b.newContext(dev); const pg = await ctx.newPage(); const errs = [];
    pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
    await stub(pg);
    await pg.goto(base + "/v2/menu/sources", { waitUntil: "load" });
    return { ctx, pg, errs };
  })();
  await settled(pg);
  const s = await pg.evaluate(() => {
    const on = document.querySelector('.na-menu-bar .tchip.is-on');
    const rows = [...document.querySelectorAll("#v2-cov .cov-row")];
    const attn = [...document.querySelectorAll("#v2-cov-attn .cov-row")].map((r) => ({ key: r.dataset.key, st: r.dataset.st, pill: (r.querySelector(".cov-pill") || {}).textContent, why: (r.querySelector(".cov-why") || {}).textContent || "", fix: (r.querySelector(".cov-fix") || {}).textContent || "" }));
    const grid = (k) => { const r = document.querySelector(`.cov-grp .cov-row[data-key="${k}"]`); return r ? { st: r.dataset.st, pill: r.querySelector(".cov-pill").textContent, meta: r.querySelector(".cov-meta").textContent } : null; };
    return {
      chip: on && on.dataset.sec, label: on && on.textContent.trim(), path: location.pathname,
      title: (document.querySelector(".cov-title") || {}).textContent,
      first: rows[0] ? { key: rows[0].dataset.key, st: rows[0].dataset.st } : null,
      attn, rates: grid("api:/api/rates"), eurates: grid("api:/api/eurates"), pc: grid("dashboard_pc"),
      roles: [...document.querySelectorAll(".cov-role")].map((r) => ({ h: r.querySelector(".cov-role-h").textContent, links: [...r.querySelectorAll("a.cov-role-a")].map((a) => a.getAttribute("href")) })),
      addH: [...document.querySelectorAll(".na-menu-recent-h")].some((h) => /Add a law firm/i.test(h.textContent)),
      addBox: !!document.querySelector("#v2-menu-add .na-ask-add"),
      sections: [...document.querySelectorAll(".cov-grp-h")].map((h) => h.textContent.trim()),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
  checkEq(s.chip, "coverage", `${name}: /v2/menu/sources opens the Sources chip`);
  checkEq(s.label, "Sources", `${name}: the chip reads 'Sources'`);
  check(/Coverage & sources/.test(s.title || ""), `${name}: the page is titled Coverage & sources`);
  const ratesAttn = s.attn.find((r) => r.key === "api:/api/rates");
  check(ratesAttn && ratesAttn.pill === "FAILING", `${name}: the stubbed-failing /api/rates is listed under Needs attention as FAILING`);
  check(ratesAttn && /HTTP 500/.test(ratesAttn.why) && /snapshot|last-known|nothing to show/i.test(ratesAttn.why), `${name}: its reason says the live call failed and what the panel shows instead (${ratesAttn && ratesAttn.why})`);
  check(ratesAttn && ratesAttn.fix.length > 20, `${name}: the failing row carries a fix`);
  check(s.first && s.first.st === "fail", `${name}: the first row on the page is a FAILING one (${s.first && s.first.key})`);
  const lastFail = s.attn.map((r) => r.st).lastIndexOf("fail"), firstStale = s.attn.map((r) => r.st).indexOf("stale");
  check(firstStale === -1 || lastFail < firstStale, `${name}: every FAILING row sorts above every STALE row`);
  check(s.attn.every((r) => r.st === "fail" || r.st === "stale"), `${name}: Needs attention holds only FAILING / STALE rows`);
  const pcAttn = s.attn.find((r) => r.key === "dashboard_pc");
  check(pcAttn && pcAttn.pill === "STALE" && /60 days old/.test(pcAttn.why) && /45 days/.test(pcAttn.why), `${name}: 60-day-old data against a 45-day window is STALE with a plain reason (${pcAttn && pcAttn.why})`);
  check(s.pc && s.pc.pill === "STALE", `${name}: the same row reads STALE in its Dashboard section`);
  check(s.rates && s.rates.pill === "FAILING" && /Snapshot|Cached|Failing/.test(s.rates.meta), `${name}: the failing panel shows its serving mode (${s.rates && s.rates.meta})`);
  check(s.eurates && s.eurates.pill === "GOOD" && /Live/.test(s.eurates.meta) && /as of/.test(s.eurates.meta), `${name}: a working endpoint reads GOOD · Live with its as-of (${s.eurates && s.eurates.meta})`);
  for (const sec of ["Home", "Deals", "Profiles", "Legal", "Markets", "Briefing"]) check(s.sections.some((t) => t.includes(sec)), `${name}: a "${sec}" section is listed`);
  checkEq(s.roles.length, 3, `${name}: Start here offers three roles`);
  check(s.roles.map((r) => r.h).join("|") === "Lender / fund manager|Lawyer|LP / investor", `${name}: the roles are Lender / fund manager, Lawyer, LP / investor`);
  check(s.roles.every((r) => r.links.length >= 4 && r.links.length <= 5 && r.links.every((h) => h.startsWith("/v2/"))), `${name}: each role lists 4–5 in-app screens`);
  check(s.addH && s.addBox, `${name}: 'Add a law firm' (the Add assistant) lives on the page`);
  check(!s.overflow, `${name}: no horizontal page scroll`);
  if (name === "phone") {
    // A Start-here link into another Menu chip lands on that chip (same-tab route).
    await pg.evaluate(() => [...document.querySelectorAll("a.cov-role-a")].find((a) => a.getAttribute("href") === "/v2/menu/digest").click());
    await pg.waitForTimeout(500);
    const after = await pg.evaluate(() => ({ chip: (document.querySelector(".na-menu-bar .tchip.is-on") || {}).dataset?.sec, path: location.pathname }));
    check(after.chip === "digest" && after.path === "/v2/menu/digest", `phone: Start here ▸ Digest opens the Digest chip (${after.chip} @ ${after.path})`);
  }
  checkErrs(errs, `${name} sources page`);
  await ctx.close();
}

// With every endpoint healthy the live rows are all GOOD (nothing falsely failing).
{
  const ctx = await b.newContext(PHONE); const pg = await ctx.newPage();
  await stub(pg, { failRates: false });
  await pg.goto(base + "/v2/menu/sources", { waitUntil: "load" });
  await settled(pg);
  const bad = await pg.evaluate(() => [...document.querySelectorAll('.cov-grp .cov-row[data-key^="api:"]')].filter((r) => r.dataset.st !== "good").map((r) => r.dataset.key));
  checkEq(bad.join(","), "", "all endpoints healthy → every live row is GOOD");
  await ctx.close();
}

await b.close(); srv.close();
finish();
