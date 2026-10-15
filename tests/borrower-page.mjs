// Borrower pages (review 2026-10-15, #10/#18): /v2/profiles/#/co/<name> gathers what
// Wire holds on one company — its status on the stress list, deals (with their
// advisers), restructuring plans / schemes, judgments and law-firm alerts — and a UK
// registry block (Companies House via /api/ch; the harness stubs it, so the page shows
// the public-register fallback). Reached from search, the stress table and the deal drawer.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/profiles/#/co/Thames%20Water`);
await pg.waitForFunction(() => /legal record/.test((document.querySelector("#pf-detail .tdet-sub") || {}).textContent || ""), null, { timeout: 15000 });
await pg.waitForFunction(() => !/Looking up/.test((document.querySelector("#co-uk") || {}).textContent || ""), null, { timeout: 10000 });
const tw = await pg.evaluate(() => ({
  h1: (document.querySelector("#pf-detail h1") || {}).textContent,
  status: !!document.querySelector("#pf-detail .tbiz .dsh-tag-stress"),
  legal: [...document.querySelectorAll("#pf-detail .tpg")].find((p) => /Legal/.test(p.textContent))?.querySelectorAll("li").length || 0,
  citation: /EWCA Civ 475/.test(document.querySelector("#pf-detail").textContent),
  uk: (document.querySelector("#co-uk") || {}).innerHTML || "",
}));
check(tw.h1 === "Thames Water", `borrower page renders (${tw.h1})`);
check(tw.status, "its stress-list status is shown");
check(tw.legal >= 5 && tw.citation, `plans, judgments and alerts are listed with citations (${tw.legal})`);
check(/find-and-update\.company-information\.service\.gov\.uk/.test(tw.uk), "UK registry block links Companies House");

// Reached from the Dashboard stress table.
await pg.goto(`http://localhost:${srv.port}/v2/dashboard/credit`);
await pg.waitForSelector(".dsh-stresstbl a.dsh-drill", { timeout: 10000 });
check(await pg.evaluate(() => [...document.querySelectorAll(".dsh-stresstbl a.dsh-drill")].every((a) => /\/profiles\/#\/co\//.test(a.getAttribute("href")))), "stress-table debtors open their borrower page");

// Reached from search.
await pg.keyboard.press("/");
await pg.waitForSelector(".mcmdk.open .mcmdk-input", { timeout: 8000 });
await pg.fill(".mcmdk-input", "cerba"); await pg.waitForTimeout(250);
check(await pg.evaluate(() => [...document.querySelectorAll(".mcmdk-row")].some((r) => /Borrower/.test(r.textContent))), "search offers a Borrower result");

checkErrs(errs, "borrower page");
await b.close(); srv.close();
finish();
