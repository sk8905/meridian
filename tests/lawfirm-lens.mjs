// Law-firm profile: the private-credit / Europe lens (v2/js/legal/firm-lens.js +
// viewFirm in v2/js/legal/detail.js).
//   • At-a-glance strip: alerts in 90 days · credit deals · lender-side % · top
//     counterparties (lenders on its deals).
//   • Practice (finance · restructuring · funds · regulatory · disputes) and region
//     (UK · Europe · US · Other) filters over the wire — derived from each item's own
//     areas / tags / type and jurisdiction (else title / URL), never guessed.
//   • A "Credit deals" tab: deals the firm advised on (deal-advisers.js), each with the
//     side it acted for (lender · borrower · sponsor · unknown when the text doesn't say),
//     date, amount, lender, source — and a link into the Transactions deal drawer.
//   • 10-row previews + "See all N"; phone 390px in both themes, no sideways scroll.
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { pg, errs } = await open(b, DESKTOP, `${base}/v2/profiles/`);

// ---- unit: evidence-only derivations ------------------------------------------
const unit = await pg.evaluate(async () => {
  const F = await import("/v2/js/legal/firm-lens.js");
  const side = (text, aliases, parties) => F.classifyClient(F.clientPhrase(text, aliases), parties);
  return {
    pracBank: F.itemPractices({ areas: ["banking"], tags: [] }),
    pracReg: F.itemPractices({ areas: ["corporate"], tags: ["FCA", "Consumer Duty"] }),
    pracCase: F.itemPractices({ area: "corporate", type: "case" }),
    pracNone: F.itemPractices({ areas: ["corporate"], tags: ["M&A"] }),
    regJur: F.itemRegions({ jurisdiction: "United Kingdom / Germany", title: "x" }),
    regOther: F.itemRegions({ jurisdiction: "Australia", title: "x" }),
    regGlobal: F.itemRegions({ jurisdiction: "Global", title: "x" }),
    regUsd: F.itemRegions({ title: "Firm advises on US$500 Million notes offering" }),
    regTitle: F.itemRegions({ title: "FCA consults on new rules for private credit valuations" }),
    lenderWords: side("Davis Polk Advises Ad Hoc Group of Lenders on Alkegen's Chapter 11", ["Davis Polk"], {}),
    lenderName: side("Ares Management (advised by Ropes & Gray) provided debt financing.", ["Ropes & Gray"], { lender: "Ares Management" }),
    borrower: side("JPMorgan acted as agent, with Clifford Chance advising LiveOak Fiber and Milbank advising the lenders.", ["Clifford Chance"], { lender: "Oak Hill Advisors (OHA)", borrower: "LiveOak Fiber" }),
    sponsor: side("Latham & Watkins Advises Bridgepoint on Acquisition of GBA Group", ["Latham & Watkins"], { lender: "CVC (Credit)", borrower: "GBA Group", sponsor: "Bridgepoint" }),
    unknownOn: side("Latham & Watkins Advises on Waymo's US$5 Billion Debt Financing", ["Latham & Watkins"], { lender: "Sixth Street", borrower: "Waymo" }),
    unknownOther: side("Freshfields advises Ontario Teachers' on sale of its interest in Westerleigh Group", ["Freshfields"], { lender: "ICG", borrower: "Westerleigh Group" }),
    pcCredit: F.pcDealIsCredit({ role: "Advised the lenders", parties: "Lenders financing X" }),
    pcNotCredit: F.pcDealIsCredit({ role: "Advised EQT (seller)", parties: "EQT — sale of World Freight Company" }),
    pcSide: F.pcDealSide({ role: "Advised the mandated lead arrangers" }),
  };
});
checkEq(unit.pracBank.join(), "finance", "a Banking & Finance alert is Finance");
check(unit.pracReg.includes("regulatory"), `an FCA / Consumer Duty tagged item is Regulatory (${unit.pracReg})`);
check(unit.pracCase.includes("disputes"), "a case is Disputes");
checkEq(unit.pracNone.length, 0, "a plain M&A item carries no lens practice (nothing invented)");
checkEq(unit.regJur.sort().join(), "europe,uk", "jurisdiction 'United Kingdom / Germany' → UK + Europe");
checkEq(unit.regOther.join(), "other", "jurisdiction 'Australia' → Other");
checkEq(unit.regGlobal.length, 0, "'Global' names no region");
checkEq(unit.regUsd.length, 0, "'US$' in a title is a currency, not the US");
checkEq(unit.regTitle.join(), "uk", "a title naming the FCA is UK evidence");
checkEq(unit.lenderWords, "lender", "'advises Ad Hoc Group of Lenders' → lender side");
checkEq(unit.lenderName, "lender", "'<lender> (advised by <firm>)' → lender side");
checkEq(unit.borrower, "borrower", "the client stops before the next adviser ('… and Milbank advising the lenders') → borrower side");
checkEq(unit.sponsor, "sponsor", "advising the deal's named sponsor → sponsor side");
checkEq(unit.unknownOn, "unknown", "'advises on <deal>' names no client → side unknown");
checkEq(unit.unknownOther, "unknown", "a client that is none of the deal's parties → side unknown");
check(unit.pcCredit && !unit.pcNotCredit, "a firm's own matter is a credit deal only when its role / parties say financing");
checkEq(unit.pcSide, "lender", "'Advised the mandated lead arrangers' → lender side");

// ---- desktop: Latham & Watkins -------------------------------------------------
const waitCredit = () => pg.waitForFunction(() => { const g = document.querySelector("#pf-detail #firm-glance"); return g && !/…/.test(g.textContent); }, null, { timeout: 15000 });
await pg.goto(`${base}/v2/profiles/#/firm/latham`);
await pg.waitForSelector("#pf-detail #firm-glance"); await waitCredit();
const glance = await pg.evaluate(() => [...document.querySelectorAll("#pf-detail #firm-glance .lf-g")].map((g) => ({ k: g.querySelector(".lf-g-k").textContent, v: g.querySelector(".lf-g-v").textContent, s: (g.querySelector(".lf-g-s") || {}).textContent || "" })));
checkEq(glance.map((g) => g.k).join("|"), "Alerts 90d|Credit deals|Lender side|Top counterparties", "the at-a-glance strip carries the four lens figures");
check(+glance[0].v > 0, `alerts in the last 90 days is a count (${glance[0].v})`);
const nCredit = +glance[1].v;
check(nCredit >= 5, `Latham has credit deals from deal-advisers.js (${nCredit})`);
check(/^\d+%$/.test(glance[2].v) && /\d+ of \d+ sided/.test(glance[2].s), `lender-side % with its sided base (${glance[2].v} · ${glance[2].s})`);
check(/\d/.test(glance[3].v), `top counterparties are named with counts (${glance[3].v})`);

// Wire: 10-row preview + See all; filters.
const wire = await pg.evaluate(() => ({ rows: document.querySelectorAll("#pf-detail #firm-wire > li.tw-row").length, more: (document.querySelector("#pf-detail #firm-wire-more [data-more]") || {}).textContent || "", filt: !document.querySelector("#pf-detail #firm-filt").hidden, opts: [...document.querySelectorAll("#pf-detail #firm-filt select")].map((s) => [...s.options].map((o) => o.value)) }));
checkEq(wire.rows, 10, "the firm wire previews 10 rows");
check(/^See all \d+/.test(wire.more), `…with a "See all N" (${wire.more})`);
check(wire.filt, "the practice / region filter row shows on the wire");
checkEq(wire.opts[0].join(), ",finance,restructuring,funds,regulatory,disputes", "practice options");
checkEq(wire.opts[1].join(), ",uk,europe,us,other", "region options");
const total = +wire.more.match(/\d+/)[0];
await pg.selectOption('#pf-detail #firm-filt select[data-f="prac"]', "finance");
await pg.waitForTimeout(150);
const fin = await pg.evaluate(() => ({ rows: document.querySelectorAll("#pf-detail #firm-wire > li.tw-row").length, more: (document.querySelector("#pf-detail #firm-wire-more [data-more]") || {}).textContent || "", on: document.querySelector('#pf-detail #firm-filt select[data-f="prac"]').classList.contains("is-on"), clear: !!document.querySelector("#pf-detail #firm-filt [data-clear]") }));
const nFin = fin.more ? +fin.more.match(/\d+/)[0] : fin.rows;
check(nFin > 0 && nFin < total, `Finance narrows the wire (${nFin} of ${total})`);
check(fin.on && fin.clear, "an active filter is marked and offers Clear");
await pg.selectOption('#pf-detail #firm-filt select[data-f="reg"]', "uk");
await pg.waitForTimeout(150);
const finUk = await pg.evaluate(() => { const m = (document.querySelector("#pf-detail #firm-wire-more [data-more]") || {}).textContent; return m ? +m.match(/\d+/)[0] : document.querySelectorAll("#pf-detail #firm-wire > li.tw-row").length; });
check(finUk <= nFin, `Finance + UK narrows further (${finUk} ≤ ${nFin})`);
await pg.click("#pf-detail #firm-filt [data-clear]"); await pg.waitForTimeout(150);
checkEq(await pg.evaluate(() => (document.querySelector("#pf-detail #firm-wire-more [data-more]") || {}).textContent || ""), wire.more, "Clear restores the full wire");
await pg.click("#pf-detail #firm-wire-more [data-more]"); await pg.waitForTimeout(150);
checkEq(await pg.evaluate(() => document.querySelectorAll("#pf-detail #firm-wire > li.tw-row").length), total, "See all renders every row in place");

// Credit deals tab.
await pg.click('#pf-detail #firm-chips .tchip[data-k="credit"]'); await pg.waitForTimeout(200);
check(/#\/firm\/latham\/credit$/.test(await pg.evaluate(() => location.hash)), "the Credit deals tab is recorded in the URL");
check(await pg.evaluate(() => document.querySelector("#pf-detail #firm-filt").hidden), "the wire filters hide on the Credit deals tab");
const more = await pg.$("#pf-detail #firm-credit-more [data-more]"); if (more) { await more.click(); await pg.waitForTimeout(150); }
const deals = await pg.evaluate(() => [...document.querySelectorAll("#pf-detail #firm-credit .lf-deal")].map((li) => ({
  side: li.dataset.side, label: li.querySelector(".lf-side").textContent, t: li.querySelector(".lf-deal-t").textContent,
  href: (li.querySelector(".lf-deal-t a") || {}).getAttribute ? li.querySelector(".lf-deal-t a").getAttribute("href") : "",
  src: (li.querySelector(".lf-src") || {}).href || "", meta: `${(li.querySelector(".c-date") || {}).textContent || ""} ${li.querySelector(".lf-deal-m").textContent}`,   // R43: the date leads the row
})));
checkEq(deals.length, nCredit, "the Credit deals list matches the strip's count");
check(deals.every((d) => ["lender", "borrower", "sponsor", "unknown"].includes(d.side)), "every deal carries a side (lender / borrower / sponsor / unknown)");
check(deals.some((d) => d.side === "unknown" && /not stated/i.test(d.label)), "a deal whose source doesn't say shows 'Side not stated'");
const kart = deals.find((d) => /Kartesia/.test(d.t));
check(kart && kart.side === "lender", `Kartesia unitranche: Latham 'advised Kartesia as senior lender' → lender side (${kart && kart.side})`);
check(deals.filter((d) => /^\/v2\/transactions\/#\/deal\/d\d+$/.test(d.href)).length >= 5, "credit-wire deals link into the Transactions deal drawer");
check(deals.every((d) => /\d{4}|\d{1,2} [A-Z][a-z]{2} \d{2}(?!\d)/.test(d.meta)), "every credit deal is dated (R43b: \"15 Oct 26\")");
check(deals.filter((d) => /^https?:/.test(d.src)).length >= 5, "credit-wire deals carry their source link");
const sided = deals.filter((d) => d.side !== "unknown"), lend = sided.filter((d) => d.side === "lender").length;
checkEq(glance[2].v, `${Math.round((lend / sided.length) * 100)}%`, "lender-side % is computed from the listed deals");

// The deal link opens its drawer.
const dHref = deals.find((d) => /^\/v2\/transactions\/#\/deal\//.test(d.href)).href;
await pg.click(`#pf-detail #firm-credit a[href="${dHref}"]`);
await pg.waitForSelector("#tx-drawer:not([hidden])", { timeout: 10000 });
check(/\/v2\/transactions\//.test(pg.url()), `a credit deal opens in Transactions (${pg.url()})`);
checkErrs(errs, "law-firm lens (desktop)");

// A firm with lender-side announcements from its own matters (A&O Shearman).
await pg.goto(`${base}/v2/profiles/#/firm/aoshearman/credit`); await waitCredit();
const ao = await pg.evaluate(() => [...document.querySelectorAll("#pf-detail #firm-credit .lf-deal")].map((li) => li.dataset.side + "|" + li.textContent));
check(ao.some((x) => /^lender\|.*arrangers|^lender\|.*banks|^lender\|.*lenders/i.test(x)) || ao.filter((x) => x.startsWith("lender|")).length >= 2, `A&O: its own lender-side financings are listed (${ao.length})`);

// ---- phone 390px, both themes ----------------------------------------------------
for (const theme of ["light", "dark"]) {
  const ctx = await b.newContext(PHONE);
  await ctx.addInitScript((t) => { try { localStorage.setItem("m_theme_pref", t); } catch {} }, theme);
  const p = await ctx.newPage(); const perr = []; p.on("pageerror", (e) => perr.push(String(e)));
  await p.goto(`${base}/v2/profiles/#/firm/cliffordchance`, { waitUntil: "load" });
  await p.waitForSelector("#pf-detail #firm-glance");
  await p.waitForFunction(() => !/…/.test(document.querySelector("#pf-detail #firm-glance").textContent), null, { timeout: 15000 });
  const r = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll("#pf-detail #firm-glance, #pf-detail #firm-filt, #pf-detail #firm-filt select, #pf-detail #firm-wire > li")].filter((e) => e.offsetParent && e.getBoundingClientRect().right > vw + 1).length;
    const g = document.querySelector("#pf-detail #firm-glance .lf-g-v");
    return { hs: document.documentElement.scrollWidth > vw + 1, wide, rows: document.querySelectorAll("#pf-detail #firm-wire > li.tw-row").length, ink: getComputedStyle(g).color, bg: getComputedStyle(document.body).backgroundColor, theme: document.documentElement.dataset.theme || "" };
  });
  check(!r.hs && r.wide === 0, `phone ${theme}: no sideways scroll, nothing past the edge (${r.wide})`);
  check(r.rows <= 10, `phone ${theme}: the wire previews ≤10 rows (${r.rows})`);
  check(r.ink !== "rgba(0, 0, 0, 0)" && r.ink !== r.bg, `phone ${theme}: glance figures are visible (${r.ink})`);
  await p.click('#pf-detail #firm-chips .tchip[data-k="credit"]'); await p.waitForTimeout(200);
  const c = await p.evaluate(() => ({ n: document.querySelectorAll("#pf-detail #firm-credit .lf-deal").length, hs: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 }));
  check(c.n > 0 && !c.hs, `phone ${theme}: Credit deals list renders without sideways scroll (${c.n})`);
  checkErrs(perr, `law-firm lens (phone ${theme})`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
