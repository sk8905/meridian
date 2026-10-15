// Dashboard ▸ Europe-first credit + rates (HOUSE_STYLE R37). With LIVE payloads
// (/api/rates + /api/eurates fixtures) the Credit tab leads with the ICE BofA
// spread stack in BASIS POINTS (Euro HY first, one mini-table row each, dated with 1W/1M moves),
// a sourced European defaults & distress card (incl. the live Eurostat bankruptcy
// index), a de-duplicated, capped credit wire whose deals open in Transactions,
// and the CLO / fund-close activity Wire tracks. Rates carries the ECB · BoE · Fed
// policy table (live ECB / BoE rates), the €STR / Euribor / SONIA / SOFR strip and
// a Euro AAA curve. Legal carries the restructuring list + regulatory calendar.
// With EMPTY payloads ({}), nothing claims to be live: badges read "not live",
// the spreads card shows its FRED fallback, and no "&amp;" ever leaks as text.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { apis as LIVE } from "./fixtures/dashboard-live.mjs";

const b = await launchChromium();
const go = async (pg, sub) => { await pg.evaluate((k) => { const t = document.querySelector(`.dsh-navchip[data-sub="${k}"]`); t && t.click(); }, sub); await pg.waitForTimeout(900); };

// ---------------------------------------------------------------- LIVE payloads
{
  const srv = await serve(LIVE);
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/`);
  await pg.waitForTimeout(1600);

  const cr = await pg.evaluate(() => {
    const tiles = [...document.querySelectorAll("#dsh-spreads tr.dsh-mini-r")];
    const badge = document.querySelector('.dsh-live[data-live="spreads"]');
    const eu = [...document.querySelectorAll(".dsh-card")].find((c) => /Europe — defaults/.test((c.querySelector(".dsh-h") || {}).textContent || ""));
    const euRows = eu ? [...eu.querySelectorAll(".dsh-kv")] : [];
    const wire = [...document.querySelectorAll(".dsh-newsrail .dsh-news-i")];
    const keys = wire.map((li) => `${(li.querySelector(".dsh-news-d") || {}).textContent}|${(li.querySelector("a") || {}).textContent}`);
    const act = [...document.querySelectorAll(".dsh-act-tbl tbody tr")];
    return {
      pane: document.querySelector(".dsh-3z")?.dataset.pane,
      names: tiles.map((t) => ((t.querySelector(".dsh-spread-nm") || {}).firstChild || {}).textContent),
      first: tiles[0] ? tiles[0].querySelector(".dsh-spread-v").textContent : "",
      dated: tiles.length > 0 && tiles.every((t) => /\d{1,2} [A-Z][a-z]{2} \d{4}/.test((t.querySelector(".dsh-spread-as") || {}).textContent || "")),
      moves: tiles.length > 0 && tiles.every((t) => [...t.querySelectorAll(".dsh-chg")].filter((c) => /^[+-]?\d+$/.test(c.textContent.trim())).length === 2),
      sourced: tiles.length > 0 && tiles.every((t) => t.querySelector('.dsh-src[href^="https://fred.stlouisfed.org/"]')),
      badge: badge ? { text: badge.textContent.trim(), snap: badge.classList.contains("is-snap") } : null,
      euRows: euRows.length,
      euSourced: euRows.length > 0 && euRows.every((r) => r.querySelector('.dsh-src[href^="http"]')),
      euDated: euRows.filter((r) => /(?:19|20)\d{2}|Q[1-4]/.test((r.querySelector(".dsh-kv-d") || {}).textContent || "")).length,
      bkrt: (document.querySelector("#dsh-eu-bkrt") || {}).textContent || "",
      wireN: wire.length, wireDup: keys.length - new Set(keys).size,
      wireDeals: wire.filter((li) => /^\/v2\/transactions\/#\/deal\/d\d+/.test((li.querySelector("a") || {}).getAttribute?.("href") || "")).length,
      actRows: act.length,
    };
  });
  checkEq(cr.pane, "credit", "Dashboard opens on Credit");
  checkEq(cr.names[0], "Euro HY", `Credit: Euro HY leads the spread stack (${cr.names.join(" · ")})`);
  check(cr.first === "323", `Credit: OAS shown in basis points (3.23% → 323 in the "OAS bp" column; got "${cr.first}")`);
  check(cr.dated, "Credit: every spread tile carries its as-of date");
  check(cr.moves, "Credit: every spread tile shows its 1W and 1M move");
  check(cr.sourced, "Credit: every spread tile links its FRED series");
  check(cr.badge && cr.badge.text === "live" && !cr.badge.snap, `Credit: spreads badge reads LIVE once live data is applied (${JSON.stringify(cr.badge)})`);
  check(cr.euRows >= 6 && cr.euSourced, `Credit: Europe defaults & distress card renders sourced rows (${cr.euRows})`);
  check(cr.euDated >= cr.euRows, `Credit: every European distress figure shows its period (${cr.euDated}/${cr.euRows})`);
  check(/195\.9/.test(cr.bkrt) && /Q2 2026/.test(cr.bkrt), `Credit: EU bankruptcy index from Eurostat with its quarter (${cr.bkrt.trim()})`);
  check(cr.wireN > 0 && cr.wireN <= 15, `Credit: credit wire is capped at 15 rows (${cr.wireN})`);
  checkEq(cr.wireDup, 0, "Credit: credit wire carries no duplicate rows (same date + headline)");
  check(cr.wireDeals >= 1, `Credit: wire deals open in Wire's Transactions drawer (${cr.wireDeals} in-app links)`);
  checkEq(cr.actRows, 4, "Credit: the CLO / fund-close activity table renders its four tracked lines");

  // A wire deal drill-down navigates in-app (pushState) and Back returns here.
  const before = await pg.evaluate(() => location.pathname);
  await pg.evaluate(() => { const a = document.querySelector('.dsh-newsrail a[href^="/v2/transactions/#/deal/"]'); a && a.click(); });
  await pg.waitForTimeout(1200);
  const drilled = await pg.evaluate(() => ({ path: location.pathname, hash: location.hash, drawer: !!document.querySelector('.v2-view[data-view="transactions"]') }));
  check(/\/v2\/transactions/.test(drilled.path) && /deal/.test(drilled.hash), `Credit: a wire deal opens Transactions in-app (${drilled.path}${drilled.hash})`);
  await pg.goBack(); await pg.waitForTimeout(900);
  checkEq(await pg.evaluate(() => location.pathname), before, "Credit: Back returns to the Dashboard after a drill-down");

  await go(pg, "rates");
  const rt = await pg.evaluate(() => {
    const pol = [...document.querySelectorAll(".dsh-ro-tbl tbody tr")].map((tr) => tr.textContent.replace(/\s+/g, " ").trim());
    const mm = [...document.querySelectorAll("#dsh-mm tr.dsh-mini-r")].map((t) => t.innerText.replace(/\s+/g, " "));
    const yc = document.querySelector("#dsh-yc-card");
    return {
      ecb: pol.find((r) => /^ECB/.test(r)) || "", boe: pol.find((r) => /^BoE/.test(r)) || "",
      mm, mmDated: mm.length > 0 && [...document.querySelectorAll("#dsh-mm .dsh-spread-as")].every((e) => /\d{4}/.test(e.textContent)),
      eaRow: !!yc && [...yc.querySelectorAll("tbody .dsh-nm")].some((t) => /^Euro AAA$/.test(t.textContent.trim())),
      eaLine: !!yc && !!yc.querySelector("path.dsh-yc-ea"),
      mmBadge: (document.querySelector('.dsh-live[data-live="mm"]') || {}).textContent,
      polBadge: (document.querySelector('.dsh-live[data-live="pol"]') || {}).textContent,
    };
  });
  check(/2\.50%/.test(rt.ecb) && rt.polBadge === "live" && /28–29 Oct/.test(rt.ecb), `Rates: ECB row shows the live 2.50% deposit rate + next meeting (${rt.ecb})`);
  check(/3\.75%/.test(rt.boe) && rt.polBadge === "live", `Rates: BoE row shows the live Bank Rate (${rt.boe})`);
  check(rt.mm.some((t) => /€STR\s*2\.439/.test(t)) && rt.mm.some((t) => /Euribor/.test(t) && /Sep 2026 avg/.test(t)) && rt.mm.some((t) => /SONIA/.test(t)) && rt.mm.some((t) => /SOFR/.test(t)),
    `Rates: money-market strip shows €STR · 3M Euribor (labelled monthly avg) · SONIA · SOFR`);
  check(rt.mmDated, "Rates: every money-market tile is dated");
  checkEq(rt.mmBadge, "live", "Rates: money-market badge reads LIVE once ECB/BoE data is applied");
  check(rt.eaRow && rt.eaLine, "Rates: yield-curve card adds the Euro AAA (ECB) curve");

  await go(pg, "legal");
  const lg = await pg.evaluate(() => {
    const rx = [...document.querySelectorAll(".dsh-rx .dsh-news-i")];
    const reg = [...document.querySelectorAll(".dsh-reg-tbl tbody tr")];
    const up = [...document.querySelectorAll(".dsh-reg-tbl tbody tr.dsh-reg-up td.dsh-stress-as")].map((t) => Date.parse(t.textContent));
    return {
      rx: rx.length, rxLinked: rx.length > 0 && rx.every((li) => /^https?:/.test((li.querySelector("a") || {}).getAttribute?.("href") || "")),
      reg: reg.length, regSourced: reg.length > 0 && reg.every((tr) => tr.querySelector('.dsh-src[href^="http"]')),
      upSorted: up.every((d, i) => i === 0 || up[i - 1] <= d),
    };
  });
  check(lg.rx >= 1 && lg.rxLinked, `Legal: restructuring & insolvency list renders sourced items (${lg.rx})`);
  check(lg.reg >= 4 && lg.regSourced, `Legal: regulatory calendar renders sourced milestones (${lg.reg})`);
  check(lg.upSorted, "Legal: upcoming regulatory dates run soonest-first");

  checkErrs(errs, "dashboard europe (live)");
  await ctx.close(); srv.close();
}

// ------------------------------------------- EMPTY payloads → LAST-KNOWN values
// A live call that returns nothing falls back to the committed last-known snapshot
// (dashboard/js/live-snapshot.js, v2/js/live-cache.js): values with their capture
// time in a plain-language "as of <time>" badge — never LIVE, never an empty card.
{
  const srv = await serve();
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/`);
  await pg.waitForTimeout(1600);
  const lk = await pg.evaluate(() => ({
    rows: document.querySelectorAll("#dsh-spreads tbody tr").length,
    text: (document.querySelector("#dsh-spreads") || {}).textContent || "",
    badge: ((document.querySelector('.dsh-live[data-live="spreads"]') || {}).textContent || "").trim(),
  }));
  check(lk.rows > 0 && !/unavailable/i.test(lk.text), `Credit: an empty /api/rates shows last-known spreads, not "unavailable" (${lk.rows} rows)`);
  check(/^as of \d{1,2} [A-Z][a-z]{2}( \d{4})? \d{2}:\d{2}$/.test(lk.badge), `Credit: last-known values are badged "as of <capture time>", never LIVE (${lk.badge})`);
  checkErrs(errs, "dashboard europe (last-known)");
  await ctx.close(); srv.close();
}

// ------------------------------------- EMPTY payloads AND no snapshot (first run)
{
  const srv = await serve({ "/dashboard/js/live-snapshot.js": () => [404, "x", "text/plain"] });
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/`);
  await pg.waitForTimeout(1600);
  const empty = await pg.evaluate(() => ({
    spreads: (document.querySelector("#dsh-spreads") || {}).textContent || "",
    fredLink: !!document.querySelector('#dsh-spreads a[href*="fred.stlouisfed.org"]'),
    badge: (document.querySelector('.dsh-live[data-live="spreads"]') || {}).textContent,
    bkrt: (document.querySelector("#dsh-eu-bkrt") || {}).textContent || "",
  }));
  check(/unavailable/i.test(empty.spreads) && empty.fredLink, `Credit: with an empty /api/rates the spreads card shows its FRED fallback link (${empty.spreads.trim().slice(0, 60)})`);
  checkEq(empty.badge, "not live", "Credit: no live data → the badge reads NOT LIVE, never LIVE");
  check(/195\.9/.test(empty.bkrt) && /Q2 2026/.test(empty.bkrt), "Credit: Eurostat index falls back to its last verified reading, labelled by quarter");

  // Every tab: no live badge without live data, no double-escaped entities, and
  // every data card carries a date somewhere (as-of, period or per-row date).
  // textContent concatenates cells, so match a bare year / quarter without \b.
  const DATE = /(?:19|20)\d{2}(?!\d)|Q[1-4]/;
  for (const sub of ["credit", "rates", "legal", "equities", "hedge-funds"]) {
    await go(pg, sub);
    await pg.evaluate(() => { const d = document.querySelector("details.dsh-ref"); if (d) d.open = true; });
    const r = await pg.evaluate((src) => {
      const re = new RegExp(src);
      const live = [...document.querySelectorAll(".dsh-live[data-live]")].filter((e) => e.textContent.trim() === "live").length;
      const amp = /&amp;|&lt;|&gt;|&#39;/.test(document.querySelector(".dsh").textContent);
      const undated = [...document.querySelectorAll(".dsh-3z .dsh-card")]
        .filter((c) => c.querySelector(":scope > .dsh-h") && !c.classList.contains("dsh-legal-panel") && !c.querySelector(".dsh-hf-pick") && !c.querySelector(".dsh-load"))
        .filter((c) => !re.test(c.innerText)).map((c) => c.querySelector(".dsh-h").textContent.trim().slice(0, 40));
      return { live, amp, undated };
    }, DATE.source);
    checkEq(r.live, 0, `${sub}: no badge claims LIVE when every live call returned nothing`);
    check(!r.amp, `${sub}: no double-escaped entity ("&amp;") leaks into the page text`);
    check(r.undated.length === 0, `${sub}: every data card shows a date (${r.undated.join(" | ") || "ok"})`);
  }
  checkErrs(errs, "dashboard europe (empty)");
  await ctx.close(); srv.close();
}

await b.close();
finish();
