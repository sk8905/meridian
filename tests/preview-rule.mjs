// R44l (owner 2026-10-16): "first 10 + See all N ›" is THE preview for every list inside a
// card or section, app-wide — no card shows more than 10 rows without a "See all" button,
// and the button opens every row in the sheet. Lists that ARE the page (News wire, Deals
// list, Profiles directory, People, a profile tab, Menu pages) are exempt. iPhone + desktop.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
// A card's visible rows: its longest list (stacked phone list / table body / ul).
const probe = (sel) => [...document.querySelectorAll(sel)].map((c) => {
  const vis = (e) => e.getBoundingClientRect().height > 0 && getComputedStyle(e).display !== "none";
  if (!vis(c) || c.querySelector(".dsh-chart, .crr-root")) return null;
  const lists = [...c.querySelectorAll("tbody, ul, ol")].filter(vis).map((l) => [...l.children].filter((r) => /^(TR|LI|TBODY)$/.test(r.tagName) && vis(r)).length);
  const rows = Math.max(0, ...lists);
  const head = c.querySelector(".dsh-h, .tpg-h, .tx-fr-t, h3");
  return { t: (head ? head.textContent : c.id || c.className).trim().slice(0, 40), rows, more: !!c.querySelector(".dsh-seeall, .tx-seeall") };
}).filter(Boolean);
const pages = [
  ...["credit", "equities", "rates", "hedge-funds"].map((p) => [`Dashboard ▸ ${p}`, `/v2/dashboard/${p}`, ".dsh-mid > .dsh-card, .dsh-newsrail > .dsh-card"]),
  ["Deals ▸ Fundraising", "/v2/transactions/#/fundraising", "[data-fr]"],
  ["Deals ▸ League tables", "/v2/transactions/#/league", ".tx-lg"],
  ["Borrower ▸ Thames Water", "/v2/profiles/#/co/Thames%20Water", ".tpg"],
];
for (const [name, dev] of [["iPhone", PHONE], ["desktop", DESKTOP]]) {
  for (const [label, path, sel] of pages) {
    const { ctx, pg, errs } = await open(b, dev, base + path);
    await pg.waitForSelector(sel, { timeout: 15000 }).catch(() => {});
    await pg.waitForTimeout(1500);
    const cards = await pg.evaluate(probe, sel);
    const bad = cards.filter((c) => c.rows > 10);
    check(cards.length > 0 && !bad.length, `${name} ${label}: every card shows ≤10 rows (${cards.length} cards${bad.length ? `; over: ${bad.map((c) => `${c.t} ${c.rows}`).join(", ")}` : ""})`);
    checkErrs(errs, `${name} ${label}`); await ctx.close();
  }
}
// The generic Dashboard pass: Equities ▸ World indices previews 10 and its sheet holds every row.
for (const [name, dev] of [["iPhone", PHONE], ["desktop", DESKTOP]]) {
  const { ctx, pg, errs } = await open(b, dev, `${base}/v2/dashboard/equities`);
  await pg.waitForSelector(".dsh-card .dsh-seeall[data-pv]", { timeout: 15000 }).catch(() => {});
  const btn = await pg.evaluate(() => { const x = document.querySelector(".dsh-mid > .dsh-card > .dsh-seeall[data-pv]"); return x ? { n: +x.textContent.replace(/\D+/g, ""), t: (x.parentElement.querySelector(".dsh-h-t") || x.parentElement.querySelector(".dsh-h")).textContent } : null; });
  check(!!btn && btn.n > 10, `${name}: an Equities card previews with "See all N" (${btn ? `${btn.t.trim().slice(0, 30)} · ${btn.n}` : "none"})`);
  if (btn) {
    await pg.evaluate(() => document.querySelector(".dsh-mid > .dsh-card > .dsh-seeall[data-pv]").click());
    await pg.waitForSelector(".dsh-sheet", { timeout: 5000 }).catch(() => {});
    const s = await pg.evaluate(() => { const sh = document.querySelector(".dsh-sheet"); return sh ? { t: sh.querySelector(".dsh-sheet-t").textContent, more: !!sh.querySelector(".dsh-seeall") } : null; });
    check(!!s && s.t.trim() === `${btn.t.trim()} (${btn.n})` && !s.more, `${name}: its sheet is titled by the card and lists all ${btn.n} rows ("${s ? s.t.trim() : "no sheet"}")`);
  }
  checkErrs(errs, `${name} equities sheet`); await ctx.close();
}
// A borrower section (Thames Water ▸ Legal, >10 sourced records) previews and its sheet
// carries the section title once, with the count only in "(N)".
{
  const { ctx, pg, errs } = await open(b, PHONE, `${base}/v2/profiles/#/co/Thames%20Water`);
  await pg.waitForSelector(".tpg .dsh-seeall[data-pv]", { timeout: 15000 }).catch(() => {});
  const n = await pg.evaluate(() => { const x = document.querySelector(".tpg .dsh-seeall[data-pv]"); return x ? +x.textContent.replace(/\D+/g, "") : 0; });
  check(n > 10, `iPhone borrower: the Legal section previews 10 + "See all ${n}"`);
  if (n) {
    await pg.click(".tpg .dsh-seeall[data-pv]"); await pg.waitForSelector(".dsh-sheet", { timeout: 5000 }).catch(() => {});
    const t = await pg.evaluate(() => (document.querySelector(".dsh-sheet-t") || {}).textContent || "");
    const rows = await pg.evaluate(() => [...document.querySelectorAll(".dsh-sheet .dsh-sheet-body li")].filter((e) => e.getBoundingClientRect().height > 0).length);
    check(/^Legal — plans, judgments & alerts \(\d+\)$/.test(t.trim()) && rows === n, `iPhone borrower: the sheet lists all ${n} ("${t.trim()}", ${rows} rows)`);
  }
  checkErrs(errs, "borrower sheet"); await ctx.close();
}
await b.close(); srv.close();
finish();
