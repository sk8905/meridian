// Owner 2026-10-15: "the spacing across these doesn't quite look right" — one iPhone
// geometry across News, Deals and Profiles (HOUSE_STYLE R43c / R44f):
//   • ONE leading column (--c-date-w, 52px on iPhone + 8px gap): every list's headline starts
//     on the same x (72px) — the wire's time, a deal's date, a profile's type ("H Fund" on
//     iPhone), a person's move date;
//   • ONE divider: every horizontal line (rows, under the tab and search rows, sections)
//     is --t-grid — none heavier than another; no colour desk codes on the News wire;
//   • ONE heading row: the first tab's LABEL on the 12px gutter, its chip (and underline)
//     from the screen edge, the selected tab at one weight;
//   • ONE search row: the same height and padding on every page that has one.
import { serve, launchChromium, open, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const PAGES = [
  ["News", "/v2/news/", "a.g-feed-row", ".g-feed-title"],
  ["Deals", "/v2/transactions/", "#tx-body .tx-card", ".g-ev-t"],
  ["Deals ▸ Fundraising", "/v2/transactions/#/fundraising", ".g-ev", ".g-ev-t"],
  ["Profiles", "/v2/profiles/", "#all-rows tr", "td.tl-nm"],
  ["Profiles ▸ Managers", "/v2/profiles/#/?tab=managers", "#mgr-rows tr", "td.tl-nm"],
  ["Profiles ▸ People", "/v2/profiles/#/?tab=people", "#pp-rows tr", "td.tl-nm"],
];
for (const [width, colorScheme] of [[390, "light"], [430, "dark"]]) {
  const dev = { viewport: { width, height: 900 }, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone)", colorScheme };
  const seen = [];
  for (const [name, path, rowSel, titleSel] of PAGES) {
    const { ctx, pg, errs } = await open(b, dev, base + path);
    await pg.waitForFunction((s) => [...document.querySelectorAll(s)].some((r) => r.getBoundingClientRect().width > 0 && r.getBoundingClientRect().top < innerHeight), rowSel, { timeout: 15000 });
    await pg.waitForTimeout(300);
    const m = await pg.evaluate(([rowSel, titleSel]) => {
      const vis = (e) => e && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().top < innerHeight;
      const row = [...document.querySelectorAll(rowSel)].find(vis), t = row.querySelector(titleSel);
      const bar = [...document.querySelectorAll(".g-wire-lanechips, .tchips")].find(vis);
      const chips = bar ? [...bar.children].filter(vis) : [];
      const c0 = chips.find((c) => c.getBoundingClientRect().left >= -1) || chips[0];
      const range = document.createRange(); const tn = [...c0.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim()) || c0; range.selectNodeContents(tn);
      const on = chips.find((c) => /\bis-on\b/.test(c.className) || c.getAttribute("aria-selected") === "true");
      const sb = [...document.querySelectorAll(".thead-search, .tx-bar")].find(vis);
      return { title: Math.round(t.getBoundingClientRect().left), chipL: Math.round(c0.getBoundingClientRect().left), labelL: Math.round(range.getBoundingClientRect().left),
        onW: on ? getComputedStyle(on).fontWeight : null, search: sb ? Math.round(sb.getBoundingClientRect().height) : null, sbPad: sb ? getComputedStyle(sb).paddingTop : null };
    }, [rowSel, titleSel]);
    seen.push([name, m]);
    // Every horizontal divider on screen is ONE colour (field outlines aside).
    const lines = await pg.evaluate(() => {
      const out = new Set();
      for (const e of document.querySelectorAll("body *")) {
        const r = e.getBoundingClientRect(); if (r.width < 200 || r.top > innerHeight || r.bottom < 50 || !r.height) continue;
        if (e.matches("input, select, textarea, button, .topbar *")) continue;
        const cs = getComputedStyle(e);
        for (const side of ["Top", "Bottom"]) if (parseFloat(cs["border" + side + "Width"]) && cs["border" + side + "Style"] !== "none" && !/, 0\)$/.test(cs["border" + side + "Color"])) out.add(cs["border" + side + "Color"]);
      }
      return [...out];
    });
    check(lines.length === 1, `${width}px ${name}: every divider is one weight (${lines.join(" | ")})`);
    if (m.chipL <= 1 && name !== "Deals ▸ Fundraising") check(Math.abs(m.labelL - 12) <= 1 && m.chipL === 0, `${width}px ${name}: first tab label on the 12px gutter, chip from the edge (label ${m.labelL}, chip ${m.chipL})`);
    checkErrs(errs, `${width} ${name}`); await ctx.close();
  }
  const xs = new Set(seen.map(([, m]) => m.title));
  {
    const { ctx, pg } = await open(b, dev, base + "/v2/news/");
    await pg.waitForSelector("#g-feed a.g-feed-row", { timeout: 15000 });
    const codes = await pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row .g-feed-code")].filter((c) => c.getBoundingClientRect().width > 0).length);
    check(codes === 0, `${width}px News: no colour desk codes on the wire (${codes} shown)`);
    await pg.goto(base + "/v2/profiles/#/?tab=hedgefunds");
    await pg.waitForFunction(() => [...document.querySelectorAll("#hf-rows tr")].some((r) => r.getBoundingClientRect().width), null, { timeout: 15000 });
    const lead = await pg.evaluate(() => { const tr = [...document.querySelectorAll("#hf-rows tr")].find((r) => r.getBoundingClientRect().width); const b = getComputedStyle(tr, "::before"); return { t: b.content, sw: tr.scrollWidth <= tr.clientWidth + 1 }; });
    check(lead.t === '"H Fund"', `${width}px Hedge Funds: the lead reads "H Fund" on iPhone (${lead.t})`);
    await ctx.close();
  }
  check(xs.size === 1, `${width}px: every list's headline starts on the same x — ${seen.map(([n, m]) => `${n} ${m.title}`).join(", ")}`);
  check([...xs][0] === 12 + 52 + 8, `${width}px: that x is gutter + the one 52px lead column + 8px (${[...xs][0]})`);
  const ws = new Set(seen.map(([, m]) => m.onW).filter(Boolean));
  check(ws.size === 1, `${width}px: the selected tab has one weight on every page (${[...ws].join(", ")})`);
  const sbs = seen.filter(([, m]) => m.search != null);
  check(new Set(sbs.map(([, m]) => m.search + "/" + m.sbPad)).size === 1, `${width}px: one search-row height and padding (${sbs.map(([n, m]) => `${n} ${m.search}px/${m.sbPad}`).join(", ")})`);
}
await b.close(); srv.close();
finish();
