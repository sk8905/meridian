// Transactions ▸ Credits sub-tab: a Deal flow / Credits mode toggle. Credits mode
// shows the European credit universe (ELLI) organised by sector with issuer
// ratings — or, until the sourced roster has landed, an honest "being compiled"
// state. Toggling swaps the chrome + body (no leftover deal-flow controls).
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/transactions/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(1600);

// The primary mode toggle: Deal flow (default, on) + Credits.
const modes = await pg.evaluate(() => [...document.querySelectorAll("#tx-mode .tchip")].map((c) => ({ label: c.textContent.trim().replace(/\s+\d+$/, ""), on: c.classList.contains("is-on") })));
check(modes.length === 2 && modes[0].label === "Deal flow" && modes[1].label === "Credits", `mode chips are Deal flow / Credits (${modes.map((m) => m.label).join("/")})`);
check(modes[0].on && !modes[1].on, "Deal flow is the default mode");

// Deal-flow chrome shows the type table; the credits body is hidden.
const flow = await pg.evaluate(() => { const d = (id) => getComputedStyle(document.querySelector("#" + id)).display; return { search: d("tx-flow-search"), body: d("tx-body"), credits: d("tx-credits-body") }; });
check(flow.search !== "none" && flow.body !== "none" && flow.credits === "none", "Deal flow mode shows the type table, hides the credits body");

// Switch to Credits.
await pg.evaluate(() => document.querySelector('#tx-mode .tchip[data-mode="credits"]').click());
await pg.waitForTimeout(300);
const cr = await pg.evaluate(() => {
  const d = (id) => getComputedStyle(document.querySelector("#" + id)).display;
  const cb = document.querySelector("#tx-credits-body");
  return {
    flowSearchHidden: d("tx-flow-search") === "none", flowBodyHidden: d("tx-body") === "none",
    crSearchShown: d("tx-credits-search") !== "none", crBodyShown: d("tx-credits-body") !== "none",
    rows: cb.querySelectorAll(".tcr-row").length,
    empty: !!cb.querySelector(".tw-empty"),
    text: (cb.textContent || "").trim().length,
  };
});
check(cr.flowSearchHidden && cr.flowBodyHidden, "Credits mode hides all the deal-flow chrome (no leftover search/table)");
check(cr.crSearchShown && cr.crBodyShown, "Credits mode shows the credit search + roster body");
// Either the sourced roster (table rows) or the honest "being compiled" state.
check((cr.rows > 0) || (cr.empty && cr.text > 0), `Credits body shows the roster table or the compiling state (rows ${cr.rows})`);

// Once the roster has landed, every row must be REAL + SOURCED (R7/R22): a named
// obligor, and a rating that is either a link to a public rating action or an
// honest "NR" — never an unsourced rating. One agency, named in the meta line.
if (cr.rows > 0) {
  const q = await pg.evaluate(() => {
    const cb = document.querySelector("#tx-credits-body");
    const rows = [...cb.querySelectorAll(".tcr-row")];
    const named = rows.filter((r) => (r.querySelector(".tcr-nm") || {}).textContent.trim()).length;
    const rated = rows.map((r) => r.querySelector(".tcr-rt")).filter(Boolean);
    const badRating = rated.filter((rt) => {
      const nr = rt.classList.contains("tcr-nr");
      const a = rt.tagName === "A" && /^https?:/.test(rt.getAttribute("href") || "");
      return !nr && !a;                       // a real rating with no source link is illegal
    }).length;
    // Four columns per row: name, the borrower's jurisdiction (full country name),
    // the sector, and a rating with its 12-month trend arrow.
    const juris = rows.filter((r) => ((r.querySelector(".tcr-jur") || {}).textContent || "").trim().length > 1).length;
    const sectors = rows.filter((r) => (r.querySelector(".tcr-sec") || {}).textContent.trim()).length;
    const trends = rows.map((r) => r.querySelector(".tcr-tr")).filter(Boolean);
    const badTrend = trends.filter((t) => !(t.classList.contains("tx-up") || t.classList.contains("tx-dn") || t.classList.contains("tx-fl"))).length;
    // The roster is a real table with the four expected column headers.
    const heads = [...cb.querySelectorAll(".tcr-tbl thead th")].map((h) => h.textContent.trim());
    return { total: rows.length, named, sourced: rated.filter((rt) => rt.tagName === "A" && /^https?:/.test(rt.getAttribute("href") || "")).length, badRating, juris, sectors, trends: trends.length, badTrend, heads };
  });
  check(q.named === q.total, `Credits: every listed obligor is named (${q.named}/${q.total})`);
  check(q.badRating === 0, `Credits: no unsourced ratings — each rating links its action or shows NR (${q.badRating} bad)`);
  check(q.sourced > 0, `Credits: ratings link to their public source (${q.sourced} linked)`);
  check(q.juris === q.total, `Credits: every obligor shows its jurisdiction (${q.juris}/${q.total})`);
  check(q.sectors === q.total, `Credits: every obligor shows its sector column (${q.sectors}/${q.total})`);
  check(q.trends === q.total && q.badTrend === 0, `Credits: every obligor shows a 12-month rating trend (${q.trends}/${q.total}, ${q.badTrend} bad)`);
  check(q.heads.length === 4 && /Borrower/i.test(q.heads[0]) && /Jurisdiction/i.test(q.heads[1]) && /Sector/i.test(q.heads[2]) && /Rating/i.test(q.heads[3]), `Credits: four-column table header (${q.heads.join("/")})`);

  // Group-by controls (sector | rating) — a mutually-exclusive pair, styled like the
  // news/manager-wire group button, defaulting to sector.
  const g0 = await pg.evaluate(() => {
    const btns = [...document.querySelectorAll("#tx-cr-ctl .tcr-grpbtn")];
    return { n: btns.length, labels: btns.map((b) => b.textContent.trim()), anyOn: btns.some((b) => b.classList.contains("is-on")) };
  });
  check(g0.n === 2 && /sector/i.test(g0.labels[0] || "") && /rating/i.test(g0.labels[1] || ""), `Credits: two group-by buttons (${g0.labels.join(", ")})`);
  check(!g0.anyOn, "Credits: no group-by button carries the accent until one is picked");
  // Switching to group-by-rating re-orders the roster best → worst.
  await pg.evaluate(() => document.querySelector('#tx-cr-ctl [data-crgroup="rating"]').click());
  await pg.waitForTimeout(150);
  const g1 = await pg.evaluate(() => {
    const ORDER = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-", "BB+", "BB", "BB-", "B+", "B", "B-", "CCC+", "CCC", "CCC-", "CC", "C", "SD", "D"];
    const rk = (r) => { const i = ORDER.indexOf(r); return i === -1 ? 999 : i; };
    const ranks = [...document.querySelectorAll("#tx-credits-body .tcr-row .tcr-rt")].map((a) => rk(a.textContent.trim()));
    let sorted = true; for (let i = 1; i < ranks.length; i++) if (ranks[i] < ranks[i - 1]) { sorted = false; break; }
    return { sorted, count: ranks.length, ratingOn: document.querySelector('#tx-cr-ctl [data-crgroup="rating"]').classList.contains("is-on"), sectorOff: !document.querySelector('#tx-cr-ctl [data-crgroup="sector"]').classList.contains("is-on") };
  });
  check(g1.ratingOn && g1.sectorOff && g1.count === q.total, `Credits: group-by-rating becomes active and keeps every row (${g1.count})`);
  check(g1.sorted, "Credits: group-by-rating orders the roster best → worst");
  // Clicking the active button again toggles it OFF, back to the neutral default.
  await pg.evaluate(() => document.querySelector('#tx-cr-ctl [data-crgroup="rating"]').click());
  await pg.waitForTimeout(120);
  const g2 = await pg.evaluate(() => ({ anyOn: [...document.querySelectorAll("#tx-cr-ctl .tcr-grpbtn")].some((b) => b.classList.contains("is-on")), rows: document.querySelectorAll("#tx-credits-body .tcr-row").length }));
  check(!g2.anyOn && g2.rows === q.total, `Credits: clicking the active group-by button again turns it off (${g2.rows} rows)`);
}

// Toggling back restores Deal flow.
await pg.evaluate(() => document.querySelector('#tx-mode .tchip[data-mode="flow"]').click());
await pg.waitForTimeout(200);
checkEq(await pg.evaluate(() => getComputedStyle(document.querySelector("#tx-body")).display !== "none" && getComputedStyle(document.querySelector("#tx-credits-body")).display === "none"), true, "toggling back restores Deal flow");

checkErrs(errs, "transactions credits");
await ctx.close();
await b.close(); srv.close();
finish();
