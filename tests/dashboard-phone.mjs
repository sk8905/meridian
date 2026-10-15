// Dashboard ▸ iPhone (HOUSE_STYLE R40 phone rules). At 390px with touch, on every
// tab and both themes: no card scrolls inside itself (long lists show a 10-row preview
// + "See all N ›"), nothing scrolls sideways or is clipped with "…" (wide tables
// re-render as stacked rows), long lists preview 10 rows, and no text is orange at rest or after a tap (every
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
      const badges = [...root.querySelectorAll(".dsh-mid .dsh-h")].filter((h) => h.offsetParent && h.querySelector(".dsh-live")).map((h) => {
        const t = h.querySelector(".dsh-h-t").getBoundingClientRect(), l = h.querySelector(".dsh-live").getBoundingClientRect(), c = h.closest(".dsh-card").getBoundingClientRect();
        return { n: nm(h), dy: Math.round(l.top - t.top), dr: Math.round(c.right - l.right) }; }).filter((x) => Math.abs(x.dy) > 4 || x.dr > 24).map((x) => `${x.n} (dy ${x.dy}, right ${x.dr})`);
      // One news-row format: headline first, then the date (left) and the grey tag (right) beneath it.
      const rowsBad = [...root.querySelectorAll(".dsh-news-i")].filter((li) => li.offsetParent).filter((li) => {
        const k = [...li.children]; const a = k[0], d = li.querySelector(":scope > .dsh-news-d"), sx = li.querySelector(":scope > .dsh-news-s");
        if (!a || a.tagName !== "A" || k[1] !== d) return true;
        const ra = a.getBoundingClientRect(), rd = d.getBoundingClientRect();
        if (rd.top < ra.bottom - 2 || Math.abs(rd.left - ra.left) > 2) return true;
        if (sx) { const rs = sx.getBoundingClientRect(); if (Math.abs(rs.top - rd.top) > 3 && rs.top < rd.top) return true; }
        return false; }).map((li) => nm(li));
      return { rowsBad: [...new Set(rowsBad)], badges, vscroll: [...new Set(vscroll)], hscroll: [...new Set(hscroll)], clipped: [...new Set(clipped)].slice(0, 5), orange: orange.slice(0, 5), pageW: document.documentElement.scrollWidth };
    });
    checkEq(r.rowsBad.join("|"), "", `${theme} ${t}: every news row reads headline, then date (left) · tag (right)`);
    checkEq(r.badges.join("|"), "", `${theme} ${t}: LIVE / SNAPSHOT badges sit top-right on the title line`);
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

  // Credit: every long list previews 10 rows + "See all" (fill lists, the credit wire, both rosters).
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/credit/`, { waitUntil: "load" }); await pg.waitForTimeout(1800);
  const cr = await pg.evaluate(() => Object.fromEntries(["#dsh-lenders", "#dsh-dd", ".dsh-newsrail > .dsh-card", '.crr-root[data-roster="credits"]', '.crr-root[data-roster="bdc"]'].map((sel) => {
    const c = document.querySelector(sel); const rows = [...c.querySelectorAll(".dsh-stk-i, li.dsh-news-i, .crr-row")].filter((e) => e.offsetParent).length;
    return [sel, `${rows}${c.querySelector(".dsh-seeall") ? "+all" : ""}`]; })));
  check(Object.values(cr).every((v) => v === "10+all"), `Credit: lenders, distress deals, credit wire and both rosters show 10 rows + "See all" (${JSON.stringify(cr)})`);
  // Roster "See all": the live roster moves into the sheet (its own search works), and returns on close.
  await pg.tap('.crr-root[data-roster="bdc"] .dsh-seeall'); await pg.waitForTimeout(500);
  const rs = await pg.evaluate(() => { const s = document.querySelector(".dsh-sheet"); return s && { rows: s.querySelectorAll(".crr-row").length, search: !!s.querySelector(".crr-q") }; });
  check(rs && rs.rows === 31 && rs.search, `Roster See all: the BDC roster opens in the sheet with all 31 and its own search (${JSON.stringify(rs)})`);
  await pg.fill(".dsh-sheet .crr-q", "Ares"); await pg.waitForTimeout(400);
  const rq = await pg.evaluate(() => document.querySelectorAll(".dsh-sheet .crr-row").length);
  check(rq > 0 && rq < 31, `Roster See all: search inside the sheet narrows the roster (${rq})`);
  await pg.fill(".dsh-sheet .crr-q", ""); await pg.waitForTimeout(400);
  await pg.tap(".dsh-sheet-x"); await pg.waitForTimeout(400);
  const back = await pg.evaluate(() => { const r = document.querySelector('.dsh-mid .crr-root[data-roster="bdc"]'); return r && [...r.querySelectorAll(".crr-row")].filter((e) => e.offsetParent).length; });
  checkEq(back, 10, "Roster See all: closing puts the roster back in its card at the 10-row preview");
  // A cloned list's sheet always carries a search bar.
  await pg.tap("#dsh-lenders .dsh-seeall"); await pg.waitForTimeout(300);
  check(await pg.evaluate(() => !!document.querySelector(".dsh-sheet .dsh-sheet-q")), "See all: the list sheet has a search bar");
  await pg.tap(".dsh-sheet-x"); await pg.waitForTimeout(200);

  // "See all" → full-screen sheet.
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/hedge-funds/`, { waitUntil: "load" }); await pg.waitForTimeout(1800);
  const pv = await pg.evaluate(() => { const c = document.querySelector("#dsh-hfaum"); return { shown: [...c.querySelectorAll(".dsh-stk-i")].filter((e) => e.offsetParent).length, btn: (c.querySelector(".dsh-seeall") || {}).textContent || "" }; });
  check(pv.shown === 10 && /See all 151/.test(pv.btn), `See all: the AUM card previews 10 funds with "See all 151" (${JSON.stringify(pv)})`);
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
// The view can mount before the phone's width is final (iPhone home-screen app): start
// wide, then narrow — previews and roster previews must still apply.
{
  const ctx = await b.newContext({ viewport: { width: 1100, height: 900 }, hasTouch: true }); const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/credit/`, { waitUntil: "load" }); await pg.waitForTimeout(1500);
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(900);
  const late = await pg.evaluate(() => ["#dsh-lenders", '.crr-root[data-roster="bdc"]'].map((sel) => { const c = document.querySelector(sel);
    return `${[...c.querySelectorAll(".dsh-stk-i, .crr-row")].filter((e) => e.offsetParent).length}${c.querySelector(".dsh-seeall") ? "+all" : ""}`; }));
  checkEq(late.join(","), "10+all,10+all", "Late width: narrowing to a phone after mount still previews lists and rosters at 10");
  await ctx.close();
}
// Desktop keeps its tables (no previews, no stacked lists showing).
{
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } }); const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/hedge-funds/`, { waitUntil: "load" }); await pg.waitForTimeout(1500);
  for (const t of ["credit", "rates", "legal", "hedge-funds"]) {
    await pg.goto(`http://localhost:${srv.port}/v2/dashboard/${t}/`, { waitUntil: "load" }); await pg.waitForTimeout(1200);
    const bad = await pg.evaluate(() => [...document.querySelectorAll(".dsh-news-i")].filter((li) => li.offsetParent).filter((li) => {
      const a = li.children[0], d = li.querySelector(":scope > .dsh-news-d"); if (!a || a.tagName !== "A" || li.children[1] !== d) return true;
      return d.getBoundingClientRect().top < a.getBoundingClientRect().bottom - 2; }).length);
    checkEq(bad, 0, `Desktop ${t}: every news row reads headline, then date · tag`);
  }
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/hedge-funds/`, { waitUntil: "load" }); await pg.waitForTimeout(1200);
  const d = await pg.evaluate(() => ({ btn: document.querySelectorAll(".dsh-seeall").length, stk: [...document.querySelectorAll(".dsh-stk-list")].filter((e) => e.offsetParent).length, tbl: !!document.querySelector("table.dsh-hfaum-tbl").offsetParent }));
  check(d.btn === 0 && d.stk === 0 && d.tbl, `Desktop: tables as tables, no previews (${JSON.stringify(d)})`);
  await ctx.close();
}
await b.close(); srv.close();
finish();
