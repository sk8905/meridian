// Owner 2026-10-15: "the spacing across these doesn't quite look right" — one iPhone
// geometry across News, Deals and Profiles (HOUSE_STYLE R43c / R44f):
//   • ONE leading column (--c-date-w, 64px + 8px gap): every list's headline starts on the
//     same x — the wire's time, a deal's date, a profile's type, a person's move date;
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
for (const width of [390, 430]) {
  const dev = { viewport: { width, height: 900 }, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone)" };
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
    if (m.chipL <= 1 && name !== "Deals ▸ Fundraising") check(Math.abs(m.labelL - 12) <= 1 && m.chipL === 0, `${width}px ${name}: first tab label on the 12px gutter, chip from the edge (label ${m.labelL}, chip ${m.chipL})`);
    checkErrs(errs, `${width} ${name}`); await ctx.close();
  }
  const xs = new Set(seen.map(([, m]) => m.title));
  check(xs.size === 1, `${width}px: every list's headline starts on the same x — ${seen.map(([n, m]) => `${n} ${m.title}`).join(", ")}`);
  check([...xs][0] === 12 + 64 + 8, `${width}px: that x is gutter + the one 64px lead column + 8px (${[...xs][0]})`);
  const ws = new Set(seen.map(([, m]) => m.onW).filter(Boolean));
  check(ws.size === 1, `${width}px: the selected tab has one weight on every page (${[...ws].join(", ")})`);
  const sbs = seen.filter(([, m]) => m.search != null);
  check(new Set(sbs.map(([, m]) => m.search + "/" + m.sbPad)).size === 1, `${width}px: one search-row height and padding (${sbs.map(([n, m]) => `${n} ${m.search}px/${m.sbPad}`).join(", ")})`);
}
await b.close(); srv.close();
finish();
