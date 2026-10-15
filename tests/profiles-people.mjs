// Profiles ▸ People (owner review R11): hires, departures and promotions by firm, role
// and seniority — built from the people-move items already in Wire (credit `intel`
// typed Personnel, HEDGE_INTEL Personnel, law-firm lateral alerts). Each row: date,
// person (if named), role, move, seniority, from → to, and a source chip; the row opens
// the firm's profile. Filters: move, seniority (from the title text only), period, type,
// firm. The chip bar still fits one line on iPhone with the fifth chip.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
async function openPeople(dev) {
  const { ctx, pg, errs } = await open(b, dev, base + "/v2/");
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.goto(base + "/v2/profiles/#/?tab=people", { waitUntil: "load" });
  await pg.waitForSelector("#pf-panes #pp-rows tr", { state: "attached", timeout: 20000 });
  await pg.waitForTimeout(500);
  return { ctx, pg, errs };
}
const visRows = (pg) => pg.evaluate(() => [...document.querySelectorAll("#pf-panes #pp-rows tr")].filter((r) => r.style.display !== "none").map((r) => ({
  href: r.dataset.href, id: r.dataset.id, move: r.dataset.fMove, sen: r.dataset.fSeniority, period: r.dataset.fPeriod, kind: r.dataset.fKind,
  who: r.querySelector(".pp-who").textContent.trim(), date: r.querySelector(".pp-date").textContent.trim(), ts: +r.querySelector(".pp-date").dataset.sort,
  role: r.querySelector(".pp-role").textContent.trim(), ft: r.querySelector(".pp-fromto").textContent.replace(/\s+/g, " ").trim(),
  src: (r.querySelector(".pp-src") || {}).href || "",
})));

// ---- Phone ------------------------------------------------------------------------
{
  const { ctx, pg, errs } = await openPeople(PHONE);
  const chips = await pg.evaluate(() => [...document.querySelectorAll("#pf-chips .tchip")].map((c) => { const r = c.getBoundingClientRect(); return { p: c.dataset.p, l: c.textContent.trim(), on: c.classList.contains("is-on"), top: Math.round(r.top), right: Math.round(r.right), h: Math.round(r.height), lines: Math.round(r.height / parseFloat(getComputedStyle(c).lineHeight || "16")) }; }));
  check(chips.map((c) => c.l).join(" · ") === "Managers · Hedge Funds · Investors · Law firms · People", `People chip joins the directory (${chips.map((c) => c.l).join(" · ")})`);
  check(chips.find((c) => c.p === "people").on, "?tab=people lands on the People list");
  // R42(b): one sideways-scrolling row, every label whole (no clipped chips).
  const fits = await pg.evaluate(() => { const row = document.querySelector("#pf-chips"); return /auto|scroll/.test(getComputedStyle(row).overflowX) && [...row.querySelectorAll(".tchip")].every((c) => c.scrollWidth <= c.clientWidth + 1 && getComputedStyle(c).whiteSpace === "nowrap"); });
  check(fits && new Set(chips.map((c) => c.top)).size === 1, "phone: all five list chips sit on one sideways-scrolling line, no label clipped (R42 b)");
  const rows = await visRows(pg);
  check(rows.length >= 50, `the list carries the people moves on file (${rows.length})`);
  check(rows.every((r) => /^#\/(manager|hf|firm)\//.test(r.href)), "every row links its firm's profile");
  check(rows.every((r) => r.date && r.ts > 0), "every row is dated");
  check(rows.every((r, i) => !i || rows[i - 1].ts >= r.ts), "newest first");
  check(rows.every((r) => ["Hire", "Departure", "Promotion", "Other"].includes(r.move)), "move type is hire / departure / promotion (else Other)");
  check(rows.every((r) => ["C-suite", "Partner", "MD", "Head", "Director", "Other"].includes(r.sen)), "seniority is one of the title-derived buckets");
  check(rows.every((r) => /^https?:\/\//.test(r.src)), "every row carries a source chip opening the item");
  check(rows.every((r) => r.who) && rows.filter((r) => r.move === "Hire").length > 30, "every row leads with the person (or, unnamed, the item's headline)");
  for (const k of ["Credit manager", "Hedge fund", "Law firm"]) check(rows.some((r) => r.kind === k), `includes ${k} moves`);
  // Every row's facts are read from its own item — spot-check against the record.
  const truth = await pg.evaluate(async () => {
    const D = await import("/credit/js/data.js");
    const i = D.intel.find((x) => x.type === "Personnel" && / hires [A-Z][a-z]+ [A-Z][a-z]+ as /.test(x.headline));
    return i ? { id: i.id, head: i.headline, mid: i.managerId } : null;
  });
  if (truth) {
    const r = rows.find((x) => x.id === truth.id);
    const nm = truth.head.match(/ hires ([A-Z][a-z]+ [A-Z][a-z]+) as (.+)$/);
    check(r && r.href === `#/manager/${truth.mid}` && r.who === nm[1] && r.role.toLowerCase().startsWith(nm[2].toLowerCase().slice(0, 12)) && r.move === "Hire",
      `a hire reads its person, role and firm from the headline (${r ? `${r.who} · ${r.role}` : "missing"} ← "${truth.head}")`);
  }
  // Filters: Move = Departure.
  await pg.click('#pf-panes .tpane[data-pane="people"] .pf-filter-btn'); await pg.waitForTimeout(250);
  const groups = await pg.evaluate(() => [...document.querySelectorAll('.tpane[data-pane="people"] .pf-sheet .tx-fh')].map((h) => h.textContent.trim()));
  check(["Move", "Seniority", "Period", "Type"].every((x) => groups.includes(x)), `filters: Move · Seniority · Period · Type (+ Firm under More) (${groups.join(" · ")})`);
  await pg.click('.tpane[data-pane="people"] .pf-sheet [data-pfacet="move"][data-v="Departure"]'); await pg.waitForTimeout(200);
  let v = await visRows(pg);
  check(v.length > 0 && v.every((r) => r.move === "Departure"), `Move = Departure narrows to departures (${v.length})`);
  check(/#\/\?tab=people&.*move=Departure/.test(await pg.evaluate(() => location.hash)), "the filter is recorded in the URL");
  await pg.click('.tpane[data-pane="people"] .pf-sheet [data-pfclear="all"]'); await pg.waitForTimeout(200);
  // Period = Last 90 days.
  await pg.click('.tpane[data-pane="people"] .pf-sheet [data-pfacet="period"][data-v="90d"]'); await pg.waitForTimeout(200);
  v = await visRows(pg);
  check(v.length > 0 && v.every((r) => r.ts >= Date.now() - 91 * 864e5), `Period = Last 90 days keeps only the last 90 days (${v.length})`);
  // Firm (under More filters).
  await pg.click('.tpane[data-pane="people"] .pf-sheet [data-pfclear="all"]'); await pg.waitForTimeout(150);
  await pg.click('.tpane[data-pane="people"] .pf-sheet [data-pfmore]'); await pg.waitForTimeout(150);
  const firm = await pg.evaluate(() => { const c = document.querySelector('.tpane[data-pane="people"] .pf-sheet [data-pfacet="firm"]'); return c && c.dataset.v; });
  await pg.click(`.tpane[data-pane="people"] .pf-sheet [data-pfacet="firm"][data-v="${firm.replace(/"/g, '\\"')}"]`); await pg.waitForTimeout(200);
  v = await visRows(pg);
  check(firm && v.length > 0 && await pg.evaluate((f) => [...document.querySelectorAll("#pf-panes #pp-rows tr")].filter((r) => r.style.display !== "none").every((r) => r.dataset.fFirm === f), firm), `Firm = ${firm} narrows to that firm (${v.length})`);
  await pg.click('.tpane[data-pane="people"] .pf-sheet [data-pfclear="all"]'); await pg.waitForTimeout(150);
  await pg.click('.tpane[data-pane="people"] .pf-sheet-done'); await pg.waitForTimeout(200);
  // Search.
  await pg.fill("#pf-panes #pp-q", "head of"); await pg.waitForTimeout(200);
  v = await visRows(pg);
  check(v.length > 0 && v.length < rows.length, `search narrows by person / role / firm (${v.length})`);
  await pg.fill("#pf-panes #pp-q", ""); await pg.waitForTimeout(200);
  // A row opens the firm profile; People stays the active list; ‹ returns to it.
  const first = (await visRows(pg)).find((r) => r.href.startsWith("#/manager/"));
  await pg.evaluate((id) => document.querySelector(`#pf-panes #pp-rows tr[data-id="${id}"] .pp-role`).click(), first.id);
  await pg.waitForSelector("#pf-detail .tdet-id h1", { timeout: 8000 });
  const st = await pg.evaluate(() => ({ hash: location.hash, on: (document.querySelector("#pf-chips .tchip.is-on") || {}).dataset?.p }));
  check(st.hash === first.href && st.on === "people", `a row opens the firm profile, People stays the active list (${st.hash})`);
  await pg.click('#pf-panes .tpane[data-pane="people"] .pf-back-chev'); await pg.waitForTimeout(400);
  check(await pg.evaluate(() => /tab=people/.test(location.hash) && !document.querySelector('#pf-panes .tpane[data-pane="people"]').hidden), "‹ returns to the People list");
  checkErrs(errs, "profiles people (phone)");
  await ctx.close();
}

// ---- Desktop: the table fits the column -------------------------------------------
for (const w of [1366, 1920]) {
  const { ctx, pg, errs } = await openPeople({ viewport: { width: w, height: 900 } });
  const d = await pg.evaluate(() => {
    const wrap = document.querySelector('#pf-panes .tpane[data-pane="people"] .tleague-wrap');
    const heads = [...wrap.querySelectorAll("thead th")].map((h) => h.textContent.trim());
    return { heads, spill: wrap.scrollWidth > wrap.clientWidth + 1, vis: wrap.getBoundingClientRect().height > 200 };
  });
  check(d.heads.join("|") === "Person|Date|Move|Role|Seniority|From → to|Source", `desktop ${w}: columns ${d.heads.join(" · ")}`);
  check(d.vis && !d.spill, `desktop ${w}: the table fits without sideways scroll`);
  checkErrs(errs, `profiles people (desktop ${w})`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
