// iPhone News + notifications (owner 2026-10-16, HOUSE_STYLE R44j) — notifications ARE the
// News wire row (feed.js feedRow), so one rule covers both: the headline reads in
// full — it wraps to at most two lines — with no source line and no ★. Rows take the
// height their headline needs (min --ev-h). Desktop keeps the two-line wire row.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const rowsInfo = (sel, titleSel, srcSel) => ({ sel, titleSel, srcSel });
const measure = (pg, { sel, titleSel, srcSel }) => pg.evaluate(({ sel, titleSel, srcSel }) => {
  const rows = [...document.querySelectorAll(sel)].filter((r) => r.getBoundingClientRect().height > 0).slice(0, 40);
  const lines = rows.map((r) => { const t = r.querySelector(titleSel); return Math.round(t.getBoundingClientRect().height / (parseFloat(getComputedStyle(t).lineHeight) || 17)); });
  return { n: rows.length, maxLines: Math.max(0, ...lines), multi: lines.filter((l) => l > 1).length,
    clipped: rows.filter((r) => { const t = r.querySelector(titleSel); return getComputedStyle(t).webkitLineClamp !== "2"; }).length,
    srcShown: rows.filter((r) => { const s = r.querySelector(srcSel); return s && s.getBoundingClientRect().height > 0; }).length,
    starShown: [...document.querySelectorAll(`${sel} .g-mw-fev-star`)].filter((s) => s.getBoundingClientRect().height > 0).length,
    heights: new Set(rows.map((r) => Math.round(r.getBoundingClientRect().height))).size };
}, { sel, titleSel, srcSel });

// iPhone: News (and its Watchlist lane, which carries ★ rows) + the notifications panel.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/news/");
  const ids = await pg.evaluate(async () => (await import("/credit/js/data.js")).managers.slice(0, 40).map((m) => m.id));
  await pg.evaluate((ids) => localStorage.setItem("meridian.follows", JSON.stringify({ manager: ids })), ids);
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 15000 });
  const W = rowsInfo("#g-feed a.g-feed-row", ".g-feed-title", ".g-feed-src");
  let m = await measure(pg, W);
  check(m.n > 10 && m.multi > 0 && m.maxLines <= 2, `iPhone News: headlines wrap, at most two lines (${m.multi}/${m.n} rows wrap, max ${m.maxLines})`);
  check(m.clipped === 0, "iPhone News: every headline is capped at two lines (line-clamp 2)");
  check(m.srcShown === 0, `iPhone News: no source line (${m.srcShown} shown)`);
  check(m.heights > 1, "iPhone News: rows take the height their headline needs");
  await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanechips .g-wire-lane")].find((e) => e.textContent.trim() === "Watchlist").click());
  await pg.waitForSelector("#g-feed .g-mw-fev", { timeout: 10000 });
  m = await measure(pg, W);
  check(m.n > 0 && m.starShown === 0, `iPhone News ▸ Watchlist: no ★ on the rows (${m.starShown} shown)`);
  await pg.click("#na-notif");
  await pg.waitForSelector("#na-notif-panel:not([hidden]) .nf-row", { timeout: 15000 });
  m = await measure(pg, rowsInfo("#na-notif-panel a.nf-row.g-feed-row", ".g-feed-title", ".g-feed-src"));
  check(m.n > 3 && m.maxLines <= 2 && m.clipped === 0, `iPhone notifications: headlines wrap, at most two lines (${m.multi}/${m.n} wrap, max ${m.maxLines})`);
  check(m.srcShown === 0, `iPhone notifications: no source line (${m.srcShown} shown)`);
  check(await pg.evaluate(() => [...document.querySelectorAll("#na-notif-panel a.nf-row")].every((r) => r.classList.contains("g-feed-row"))), "notifications are drawn by the News wire row (feedRow), not a look-alike");
  checkErrs(errs, "phone wire wrap"); await ctx.close();
}
// Every other STORY list (owner 2026-10-16) reads the same on iPhone: date · headline, ≤ 2
// lines, no source / tag / meta. Lists of names + facts are NOT story lists — unchanged.
for (const [name, url, rowSel, tSel, act] of [
  ["manager News tab", "/v2/profiles/#/manager/m20", ".tw-row.g-ev-story", ".tw-head", null],
  ["law firm Alerts", "/v2/profiles/#/firm/kirkland", ".tw-row.g-ev-story", ".tw-head", null],
  ["borrower page", "/v2/profiles/#/co/Thames%20Water", "li.g-ev-story", ".g-ev-t", null],
  ["deal drawer More from", "/v2/transactions/", "#tx-drawer li.g-ev-story", ".g-ev-t", async (pg) => { await pg.waitForSelector("#tx-body .tx-card", { timeout: 15000 }); await pg.evaluate(() => document.querySelector("#tx-body .tx-card").click()); await pg.waitForSelector("#tx-drawer:not([hidden]) li.g-ev-story", { timeout: 10000 }); }],
  ["Dashboard news cards", "/v2/dashboard/credit/", "li.g-ev-story", ".g-ev-t", null],
  // Weekly: a daily digest can be empty after a quiet weekend (nothing to measure).
  ["Digest", "/v2/menu/digest/weekly", "li.g-ev-story", ".g-ev-t", null],
]) {
  const { ctx, pg, errs } = await open(b, PHONE, base + url);
  if (act) await act(pg); else await pg.waitForFunction((s) => [...document.querySelectorAll(s)].some((r) => r.getBoundingClientRect().height > 0), rowSel, { timeout: 15000 });
  const m = await pg.evaluate(([rowSel, tSel]) => {
    const rows = [...document.querySelectorAll(rowSel)].filter((r) => r.getBoundingClientRect().height > 0).slice(0, 30);
    const lines = rows.map((r) => { const t = r.querySelector(tSel); return Math.round(t.getBoundingClientRect().height / (parseFloat(getComputedStyle(t).lineHeight) || 17)); });
    const extras = rows.filter((r) => [...r.querySelectorAll(".c-src, .c-tag, .g-ev-m, .tw-src, .tw-tag, .tw-mgr-w")].some((e) => e.getBoundingClientRect().height > 0)).length;
    const pads = new Set(rows.map((r) => getComputedStyle(r).paddingTop));
    return { n: rows.length, maxLines: Math.max(0, ...lines), extras, pads: [...pads] };
  }, [rowSel, tSel]);
  check(m.n > 0 && m.maxLines <= 2, `iPhone ${name}: headlines wrap, at most two lines (${m.n} rows, max ${m.maxLines})`);
  check(m.extras === 0, `iPhone ${name}: date · headline only — no source, tag or meta (${m.extras} rows with extras)`);
  check(m.pads.length === 1 && m.pads[0] === "9px", `iPhone ${name}: the News row's vertical rhythm (${m.pads.join(", ")})`);
  checkErrs(errs, `story ${name}`); await ctx.close();
}
// Lists of names + facts are not story lists: one line, the detail line kept.
{
  const { ctx, pg } = await open(b, PHONE, base + "/v2/restructuring/");
  await pg.waitForSelector("li.rxh-i", { timeout: 15000 });
  const d = await pg.evaluate(() => { const r = [...document.querySelectorAll("li.rxh-i")].find((x) => x.getBoundingClientRect().height); return { story: r.classList.contains("g-ev-story"), meta: r.querySelector(".g-ev-m").getBoundingClientRect().height > 0 }; });
  check(!d.story && d.meta, "iPhone Restructuring hub: a names + facts list — not wrapped, detail line kept");
  await ctx.close();
}
// Desktop: unchanged — the wire row keeps its source line.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 15000 });
  const m = await measure(pg, rowsInfo("#g-feed a.g-feed-row", ".g-feed-title", ".g-feed-src"));
  check(m.srcShown > 0, `desktop: the wire row keeps its source (${m.srcShown}/${m.n})`);
  checkErrs(errs, "desktop wire"); await ctx.close();
}
await b.close(); srv.close();
finish();
