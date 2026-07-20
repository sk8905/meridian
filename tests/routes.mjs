// Every Credit and Legal hash route renders without errors and with real
// content — including the DETAIL pages (manager / fund / LP / CLO, legal item
// and firm), which no other spec exercises. This is the safety net for
// splitting those apps' view code into modules (the macro split relied on the
// dashboard's dense coverage; this spec gives the detail views the same).
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

async function visit(pg, hash, label, minChars = 200) {
  await pg.evaluate((h) => { location.hash = h; }, hash);
  await pg.waitForTimeout(700);
  const st = await pg.evaluate(() => {
    const app = document.getElementById("app");
    return { len: (app && app.textContent.trim().length) || 0, notFound: /not found/i.test((app && app.textContent) || "") };
  });
  check(st.len >= minChars && !st.notFound, `${label} renders (${st.len} chars${st.notFound ? ", NOT FOUND" : ""})`);
}

// ---- CREDIT ----------------------------------------------------------------
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/credit/");
  await pg.waitForTimeout(1800);
  // Real entity ids straight from the app's own data module (same-origin import).
  const ids = await pg.evaluate(async () => {
    const m = await import("/credit/js/data.js");
    return { mgr: m.managers[0].id, fund: m.funds[0].id, lp: m.lps[0].id };
  });
  await visit(pg, "#/funds", "credit #/funds");
  await visit(pg, "#/fund/" + ids.fund, "credit #/fund/<id>");
  await visit(pg, "#/managers", "credit #/managers");
  await visit(pg, "#/manager/" + ids.mgr, "credit #/manager/<id>");
  await visit(pg, "#/lps", "credit #/lps");
  await visit(pg, "#/lp/" + ids.lp, "credit #/lp/<id>");
  await visit(pg, "#/news", "credit #/news");
  await visit(pg, "#/", "credit #/ (dashboard)");
  // A live CLO deep link, harvested from any manager page that lists one.
  const clo = await pg.evaluate(async () => {
    const m = await import("/credit/js/data.js");
    for (const mgr of m.managers) {
      location.hash = "#/manager/" + mgr.id;
      await new Promise((r) => setTimeout(r, 120));
      const el = document.querySelector('[data-href^="#/clo/"]');
      if (el) return el.getAttribute("data-href");
    }
    return null;
  });
  if (clo) await visit(pg, clo, `credit ${clo.slice(0, 30)}…`);
  else check(false, "no CLO link found on any manager page");
  // Legacy/retired routes fall back to the dashboard, never a broken page.
  await visit(pg, "#/deals", "credit legacy #/deals → dashboard");
  await visit(pg, "#/commentary", "credit legacy #/commentary → news");
  checkErrs(errs, "credit routes");
  await ctx.close();
}
// ---- LEGAL -----------------------------------------------------------------
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/legal/");
  await pg.waitForTimeout(1800);
  const ids = await pg.evaluate(async () => {
    const m = await import("/legal/js/data.js?v=20260718-10");
    return { item: m.items[0].id, firm: m.items.find((i) => i.firm)?.firm };
  });
  await visit(pg, "#/list", "legal #/list");
  await visit(pg, "#/item/" + ids.item, "legal #/item/<id>");
  if (ids.firm) await visit(pg, "#/firm/" + ids.firm, "legal #/firm/<id>");
  await visit(pg, "#/", "legal #/ (dashboard)");
  checkErrs(errs, "legal routes");
  await ctx.close();
}
await b.close(); srv.close();
finish();
