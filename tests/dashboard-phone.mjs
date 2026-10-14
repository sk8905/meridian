// Dashboard ▸ iPhone (HOUSE_STYLE R40 phone rules). At 390px with touch, on every
// tab and both themes: no card scrolls inside itself (long lists show a 6-row preview
// + "See all N ›"), nothing scrolls sideways or is clipped with "…" (wide tables
// re-render as stacked rows), and no text is orange at rest or after a tap (every
// Dashboard :hover rule is fenced in @media (hover:hover)). "See all" opens the full
// list in a full-screen sheet above the tab bar, with a filter for long lists, ✕ to
// close, and a link inside it navigates (closing the sheet). Desktop keeps tables.
import { serve, launchChromium, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { apis as LIVE } from "./fixtures/dashboard-live.mjs";

const TABS = ["credit", "rates", "legal", "equities", "hedge-funds"];
const b = await launchChromium();
const srv = await serve(LIVE);
for (const theme of ["dark", "light"]) {
  const ctx = await b.newContext({ ...PHONE, hasTouch: true, isMobile: true });
  await ctx.addInitScript((t) => { try { localStorage.setItem("m_theme_pref", t); } catch {} }, theme);
  const pg = await ctx.newPage(); const errs = []; pg.on("pageerror", (e) => errs.push(String(e)));
  for (const t of TABS) {
    await pg.goto(`http://localhost:${srv.port}/v2/dashboard/${t}/`, { waitUntil: "load" }); await pg.waitForTimeout(1800);
    const r = await pg.evaluate(() => {
      const root = document.querySelector(".dsh");
      const nm = (e) => { const c = e.closest(".dsh-card"); return c ? ((c.querySelector(".dsh-h-t, .dsh-h") || c).textContent || "").trim().slice(0, 30) : "?"; };
      const inCard = [...root.querySelectorAll(".dsh-card *")].filter((e) => e.offsetParent);
      const vscroll = inCard.filter((e) => /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 4 && e.clientHeight > 40).map(nm);
      const hscroll = inCard.filter((e) => /(auto|scroll)/.test(getComputedStyle(e).overflowX) && e.scrollWidth > e.clientWidth + 2).map(nm);
      const clipped = inCard.filter((e) => e.children.length === 0 && e.textContent.trim() && getComputedStyle(e).overflow !== "visible" && e.scrollWidth > e.clientWidth + 1).map(nm);
      const tmp = document.createElement("span"); document.body.appendChild(tmp); tmp.style.color = getComputedStyle(document.documentElement).getPropertyValue("--t-accent").trim(); const acc = getComputedStyle(tmp).color; tmp.remove();
      const orange = inCard.filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && getComputedStyle(e).color === acc).map((e) => `${nm(e)}: ${e.textContent.trim().slice(0, 20)}`);
      return { vscroll: [...new Set(vscroll)], hscroll: [...new Set(hscroll)], clipped: [...new Set(clipped)].slice(0, 5), orange: orange.slice(0, 5), pageW: document.documentElement.scrollWidth };
    });
    checkEq(r.vscroll.join("|"), "", `${theme} ${t}: no card scrolls inside itself`);
    checkEq(r.hscroll.join("|"), "", `${theme} ${t}: nothing scrolls sideways inside a card`);
    checkEq(r.clipped.join("|"), "", `${theme} ${t}: no text clipped with an ellipsis`);
    checkEq(r.orange.join("|"), "", `${theme} ${t}: no orange text at rest`);
    check(r.pageW <= 390, `${theme} ${t}: page never wider than the phone (${r.pageW}px)`);
  }
  checkErrs(errs, `phone ${theme}`);
  await ctx.close();
}

// Tap colours: every Dashboard / roster :hover rule only applies on a hover-capable pointer.
{
  const ctx = await b.newContext({ ...PHONE, hasTouch: true, isMobile: true }); const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/credit/`, { waitUntil: "load" }); await pg.waitForTimeout(1500);
  const bare = await pg.evaluate(() => { const out = [];
    const walk = (rules, inHover) => { for (const r of rules) {
      if (r.cssRules && r.media) walk(r.cssRules, inHover || /hover\s*:\s*hover/.test(r.conditionText || r.media.mediaText));
      else if (r.cssRules && !r.selectorText) walk(r.cssRules, inHover);
      else if (r.selectorText && /:hover/.test(r.selectorText) && /\.(dsh|crr)-/.test(r.selectorText) && !inHover) out.push(r.selectorText); } };
    for (const s of document.styleSheets) { try { walk(s.cssRules, false); } catch { /* cross-origin */ } } return out; });
  checkEq(bare.join(" | "), "", "Tap: no Dashboard :hover rule applies on a touch screen");
  // A tapped roster row / cycle toggle never turns orange.
  const acc = await pg.evaluate(() => { const t = document.createElement("span"); document.body.appendChild(t); t.style.color = getComputedStyle(document.documentElement).getPropertyValue("--t-accent").trim(); const c = getComputedStyle(t).color; t.remove(); return c; });
  const hd = await pg.$(".crr-hd"); if (hd) { await hd.tap(); await pg.waitForTimeout(300); }
  const nmc = await pg.evaluate(() => { const n = document.querySelector(".crr-row.is-open .crr-nm"); return n ? getComputedStyle(n).color : null; });
  check(nmc !== acc, `Tap: an opened roster row's name stays ink, not orange (${nmc})`);

  // "See all" → full-screen sheet.
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/hedge-funds/`, { waitUntil: "load" }); await pg.waitForTimeout(1800);
  const pv = await pg.evaluate(() => { const c = document.querySelector("#dsh-hfaum"); return { shown: [...c.querySelectorAll(".dsh-stk-i")].filter((e) => e.offsetParent).length, btn: (c.querySelector(".dsh-seeall") || {}).textContent || "" }; });
  check(pv.shown === 6 && /See all 151/.test(pv.btn), `See all: the AUM card previews 6 funds with "See all 151" (${JSON.stringify(pv)})`);
  await pg.tap("#dsh-hfaum .dsh-seeall"); await pg.waitForTimeout(400);
  const sh = await pg.evaluate(() => { const s = document.querySelector(".dsh-sheet"); if (!s) return null; const r = s.getBoundingClientRect(); const top = document.elementFromPoint(195, innerHeight - 20);
    return { items: [...s.querySelectorAll(".dsh-stk-i")].filter((e) => e.offsetParent).length, full: r.top <= 1 && r.height >= innerHeight - 1, above: !!(top && top.closest(".dsh-sheet")), scrolls: /(auto|scroll)/.test(getComputedStyle(s.querySelector(".dsh-sheet-body")).overflowY), locked: document.documentElement.classList.contains("dsh-sheet-open"), title: s.querySelector(".dsh-sheet-t").textContent }; });
  check(sh && sh.items === 151 && sh.full && sh.above && sh.scrolls && sh.locked, `See all: a full-screen sheet above the tab bar lists all 151 (${JSON.stringify(sh)})`);
  await pg.fill(".dsh-sheet-q", "london"); await pg.waitForTimeout(200);
  const nF = await pg.evaluate(() => [...document.querySelectorAll(".dsh-sheet .dsh-stk-i")].filter((e) => e.offsetParent).length);
  check(nF > 0 && nF < 151, `See all: the filter narrows the list (${nF} London funds)`);
  await pg.tap(".dsh-sheet-x"); await pg.waitForTimeout(200);
  check(await pg.evaluate(() => !document.querySelector(".dsh-sheet") && !document.documentElement.classList.contains("dsh-sheet-open")), "See all: ✕ closes the sheet and unlocks the page");
  await pg.tap("#dsh-hfaum .dsh-seeall"); await pg.waitForTimeout(300);
  await pg.tap(".dsh-sheet .dsh-stk-i a.dsh-drill"); await pg.waitForTimeout(1200);
  check(await pg.evaluate(() => !document.querySelector(".dsh-sheet") && /\/profiles/.test(location.pathname)), "See all: a fund link in the sheet opens its profile and the sheet closes");
  await ctx.close();
}
// Desktop keeps its tables (no previews, no stacked lists showing).
{
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } }); const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/hedge-funds/`, { waitUntil: "load" }); await pg.waitForTimeout(1500);
  const d = await pg.evaluate(() => ({ btn: document.querySelectorAll(".dsh-seeall").length, stk: [...document.querySelectorAll(".dsh-stk-list")].filter((e) => e.offsetParent).length, tbl: !!document.querySelector("table.dsh-hfaum-tbl").offsetParent }));
  check(d.btn === 0 && d.stk === 0 && d.tbl, `Desktop: tables as tables, no previews (${JSON.stringify(d)})`);
  await ctx.close();
}
await b.close(); srv.close();
finish();
