// Consistency audit guard (owner 2026-10-16, HOUSE_STYLE R14a / R43c / R44f–g / R7a).
// The measured audit found the same primitive drawn several ways; each fix is pinned here
// at both iPhone widths (390, 430) and two desk widths (1366, 2560). The app is dark-only
// since 2026-10-16 (R44i): each pair still asks for one light and one dark OS scheme, so the
// guard also proves a light preference changes none of it.
//   • ONE selection marker — every tab / chip / rail item: unselected 400, selected 600
//     with ONE inset 0 -2px underline in --chip-ul; no orange fill, no 3px side-bar, no
//     blue sub-rail (desktop rails, the Dashboard nav, header panels, League segments);
//   • every iPhone heading row puts its first label on the 12px gutter (Home tabs, Menu,
//     the header notifications panel's chips);
//   • a list row carries its full text in its title (the wire, the profile wire);
//   • line 2 is one size and one grey (notification desk codes, People's arrow);
//   • no doubled rule (manager glance under the identity header, the desk footer);
//   • one 12px gutter and one 72px headline line (law-firm glance, Restructuring hub,
//     Digest, League ranks);
//   • desk tables keep the date as THE lead column at every width; every control in a
//     desk search row shares the input's height;
//   • the search palette's codes are the one muted tag, its rules are --t-grid;
//   • the light theme defines the legacy --faint (it fell back to the dark grey).
import { serve, launchChromium, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const PHONES = [[390, 844, "light"], [430, 932, "dark"]];
const DESKS = [[1366, 768, "light"], [2560, 1440, "dark"]];

async function page(w, h, scheme, path) {
  const phone = w <= 760;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, ...(phone ? { isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone)" } : {}) });
  await ctx.addInitScript((t) => { try { localStorage.setItem("m_theme_pref", t); } catch { /* */ } }, scheme);
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
  await pg.goto(base + path, { waitUntil: "load" });
  await pg.waitForFunction(() => { const v = [...document.querySelectorAll(".v2-view")].find((e) => e.offsetParent !== null || getComputedStyle(e).position === "fixed"); return !!v && v.textContent.trim().length > 20; }, null, { timeout: 20000 });
  return { ctx, pg, errs };
}
const frames = (pg) => pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
// In-page: the selection-marker facts of every visible chip in the rows matching `sel`.
const chipFacts = (pg, sel) => pg.evaluate((sel) => {
  const vis = (e) => e.getClientRects().length && getComputedStyle(e).visibility !== "hidden";
  return [...document.querySelectorAll(sel)].filter(vis).map((row) => {
    const chips = [...row.querySelectorAll(":scope > *")].filter((c) => vis(c) && /chip|lane|tab|-rg/.test(c.className));
    const on = chips.find((c) => /\b(is-on|on)\b/.test(c.className) || c.getAttribute("aria-current"));
    const c0 = chips[0], off = chips.find((c) => c !== on);
    return { row: row.className.split(" ")[0] || row.id, n: chips.length, chipL: c0 ? Math.round(c0.getBoundingClientRect().left) : null, label: c0 ? Math.round((() => { const t = [...c0.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim()) || c0; const r = document.createRange(); r.selectNodeContents(t); return r.getBoundingClientRect().left; })()) : null,
      // a selected chip is never filled: its ground is an unselected chip's (or none)
      on: on ? { w: getComputedStyle(on).fontWeight, sh: getComputedStyle(on).boxShadow, flat: /rgba\(0, 0, 0, 0\)/.test(getComputedStyle(on).backgroundColor) || (!!off && getComputedStyle(on).backgroundColor === getComputedStyle(off).backgroundColor) } : null,
      offW: [...new Set(chips.filter((c) => c !== on).map((c) => getComputedStyle(c).fontWeight))] };
  });
}, sel);
const ONE_UL = /^rgb\([^)]*\) 0px -2px 0px 0px inset$/;
const markerOk = (f) => f.on && f.on.w === "600" && ONE_UL.test(f.on.sh) && f.offW.every((w) => w === "400") && f.on.flat;

// ---- iPhone ---------------------------------------------------------------------------
for (const [w, h, scheme] of PHONES) {
  const tag = `${w}px ${scheme}`;
  // Heading rows: first label on the gutter, one marker.
  for (const [name, path, sel] of [
    ["Home tabs", "/v2/", ".g-wiretabs"], ["Menu", "/v2/menu/digest", ".na-menu-bar .tchips"], ["Markets", "/v2/dashboard/credit", ".dsh-railnav"],
    ["Deals", "/v2/transactions/", ".tx-dash .twire-head .tchips"], ["Profiles", "/v2/profiles/", "#pf-chips"],
  ]) {
    const { ctx, pg, errs } = await page(w, h, scheme, path);
    await pg.waitForFunction((s) => !!document.querySelector(s + " .is-on, " + s + " [aria-current]"), sel, { timeout: 15000 });
    await frames(pg);
    const [f] = await chipFacts(pg, sel);
    check(!!f && f.chipL === 0 && Math.abs(f.label - 12) <= 1, `${tag} ${name}: first label on the 12px gutter, chip from the edge (${f && `label ${f.label}, chip ${f.chipL}`})`);
    check(!!f && markerOk(f), `${tag} ${name}: one selection marker — 600 + one inset underline, others 400 (${JSON.stringify(f && { on: f.on, off: f.offW })})`);
    checkErrs(errs, `${tag} ${name}`); await ctx.close();
  }
  // The header notifications panel: its chips are a heading row too, and its rows read
  // EXACTLY like the News wire (owner 2026-10-16): measured against a live News row.
  {
    const { ctx, pg, errs } = await page(w, h, scheme, "/v2/news/");
    await pg.waitForSelector("#g-feed a.g-feed-row", { timeout: 15000 });
    const wire = await pg.evaluate(() => {
      const r = document.querySelector("#g-feed a.g-feed-row"), t = r.querySelector(".g-feed-title"), s = r.querySelector(".g-feed-src"), d = document.querySelector("#g-feed .g-feed-dayhdr");
      const f = (e) => { const c = getComputedStyle(e); return `${c.fontSize} ${c.color} ${c.fontWeight}`; };
      return { h: Math.round(r.getBoundingClientRect().height), x: Math.round(t.getBoundingClientRect().left), t: f(t), l2: f(s), day: d ? f(d) + " " + getComputedStyle(d).backgroundColor : null };
    });
    // An empty seen-set (not a first visit) makes every notification unseen, so the panel
    // draws its "New" band.
    await pg.evaluate(() => { localStorage.setItem("meridian.credit.notifSeen", "[]"); localStorage.setItem("meridian.legal.notifSeen", "[]"); });
    await pg.reload({ waitUntil: "load" });
    await pg.waitForSelector("#na-notif", { timeout: 15000 });
    for (const id of ["na-notif"]) {
      await pg.click(`#${id}`);
      await pg.waitForFunction(() => [...document.querySelectorAll(".na-panel .na-chips")].some((p) => p.getClientRects().length), null, { timeout: 8000 });
      const f = (await chipFacts(pg, ".na-panel .na-chips")).find((x) => x.n);
      check(!!f && Math.abs(f.label - 12) <= 1 && markerOk(f), `${tag} panel ${id}: chips on the gutter with one marker (${JSON.stringify(f)})`);
      if (id === "na-notif") {
        await pg.waitForSelector(".na-panel .nf-row", { timeout: 8000 });
        const n = await pg.evaluate(() => {
          const f = (e) => { const c = getComputedStyle(e); return `${c.fontSize} ${c.color} ${c.fontWeight}`; };
          const rows = [...document.querySelectorAll(".na-panel .nf-row")].filter((r) => r.getClientRects().length).slice(0, 12);
          const grp = document.querySelector(".na-panel .nf-grp");
          return {
            hs: [...new Set(rows.map((r) => Math.round(r.getBoundingClientRect().height)))],
            xs: [...new Set(rows.map((r) => Math.round(r.querySelector(".g-ev-t").getBoundingClientRect().left)))],
            t: [...new Set(rows.map((r) => f(r.querySelector(".g-ev-t"))))],
            l2: [...new Set(rows.map((r) => f(r.querySelector(".g-ev-m"))))],
            extras: rows.filter((r) => [...r.querySelectorAll(".c-src, .c-tag, .nf-code")].some((e) => e.getClientRects().length && e.textContent.trim())).length,
            l2IsSource: rows.every((r) => (r.getAttribute("title") || "").endsWith(r.querySelector(".g-ev-m").textContent.trim())),
            tinted: rows.filter((r) => !/rgba\(0, 0, 0, 0\)/.test(getComputedStyle(r).backgroundColor) || getComputedStyle(r).boxShadow !== "none").length,
            grp: grp ? f(grp) + " " + getComputedStyle(grp).backgroundColor : null,
          };
        });
        // iPhone (R44j): News and notification headlines both wrap (≤ 3 lines), so rows take
        // their headline's height — the shared invariants are the headline x and the --ev-h floor.
        check(Math.min(...n.hs) >= 46 && n.xs.length === 1 && n.xs[0] === wire.x, `${tag} notifications: the News row's headline x and minimum height (${n.hs}/${n.xs} vs ≥46/${wire.x})`);
        check(n.t.length === 1 && n.t[0] === wire.t && n.l2.length === 1 && n.l2[0] === wire.l2, `${tag} notifications: headline and line 2 in the News row's size, grey and weight (${n.t} | ${n.l2} vs ${wire.t} | ${wire.l2})`);
        check(n.extras === 0 && n.l2IsSource, `${tag} notifications: no desk code / source column — the source alone on line 2 (${n.extras} rows with extras)`);
        check(n.tinted === 0, `${tag} notifications: no tinted or side-barred "new" rows (${n.tinted})`);
        check(!!wire.day && n.grp === wire.day, `${tag} notifications: New / Earlier read as the wire's day-break band (${n.grp} vs ${wire.day})`);
      }
    }
    checkErrs(errs, `${tag} panels`); await ctx.close();
  }
  // Rows carry their full text; the wire and the profile wire.
  {
    const { ctx, pg, errs } = await page(w, h, scheme, "/v2/news/");
    await pg.waitForSelector("#g-feed a.g-feed-row", { timeout: 15000 });
    const t = await pg.evaluate(() => [...document.querySelectorAll("#g-feed a.g-feed-row")].slice(0, 30).map((r) => (r.getAttribute("title") || "").includes(r.querySelector(".g-feed-title").textContent.trim())));
    check(t.length > 5 && t.every(Boolean), `${tag} News: every wire row's title carries its full headline (${t.filter((x) => !x).length} of ${t.length} without)`);
    for (const [name, path] of [["manager", "/v2/profiles/#/manager/m20"], ["law firm", "/v2/profiles/#/firm/cliffordchance"]]) {
      await pg.goto(base + path); await pg.waitForSelector(".twire .compact-item", { timeout: 15000 });
      const r = await pg.evaluate(() => [...document.querySelectorAll(".twire .compact-item")].filter((x) => x.getClientRects().length).slice(0, 20).map((x) => (x.getAttribute("title") || "").includes(x.querySelector(".tw-head").textContent.trim())));
      check(r.length > 0 && r.every(Boolean), `${tag} ${name} profile: every wire row carries its full text in its title (${r.filter((x) => !x).length} of ${r.length} without)`);
      // One rule under the identity header (no doubled line), one 12px gutter.
      const g = await pg.evaluate(() => {
        const id = document.querySelector("#pf-detail .tdet-id"), R = (e) => e.getBoundingClientRect();
        const below = [...document.querySelectorAll(".mgr-glance .mg-f, .lf-glance .lf-g")].filter((e) => e.getClientRects().length);
        const doubled = below.some((e) => parseFloat(getComputedStyle(e).borderTopWidth) > 0 && Math.abs(R(e).top - R(id).bottom) < 1.5);
        const gut = below.filter((e) => Math.round(R(e).left) === 0).map((e) => parseFloat(getComputedStyle(e).paddingLeft));
        return { doubled, gut: [...new Set(gut)] };
      });
      check(!g.doubled, `${tag} ${name} profile: the glance strip draws no second rule under the identity header`);
      check(g.gut.length && g.gut.every((x) => x === 12), `${tag} ${name} profile: glance facts on the 12px gutter (${g.gut.join("/")})`);
    }
    checkErrs(errs, `${tag} rows`); await ctx.close();
  }
  // One 72px headline line: Restructuring hub, Digest, League ranks.
  for (const [name, path, sel, ttl] of [
    ["Restructuring", "/v2/restructuring/", ".rxh-card .g-ev", ".g-ev-t"], ["Digest", "/v2/menu/digest", ".dg-list > .g-ev", ".g-ev-t"],
    ["League tables", "/v2/transactions/#/league", ".tx-lg-card", ".tx-lg-cn"],
  ]) {
    const { ctx, pg, errs } = await page(w, h, scheme, path);
    await pg.waitForFunction((s) => [...document.querySelectorAll(s)].some((r) => r.getClientRects().length), sel, { timeout: 15000 });
    await frames(pg);
    const xs = await pg.evaluate(([s, t]) => [...new Set([...document.querySelectorAll(s)].filter((r) => r.getClientRects().length).slice(0, 12).map((r) => Math.round(r.querySelector(t).getBoundingClientRect().left)))], [sel, ttl]);
    check(xs.length === 1 && xs[0] === 72, `${tag} ${name}: headlines start on the one 72px line (${xs.join("/")})`);
    if (name === "Restructuring") {
      const on = await pg.evaluate(() => { const row = document.querySelector(".rxh-chips"), c = row.querySelector(".is-on"), a = row.getBoundingClientRect(), r = c.getBoundingClientRect(); return r.left >= a.left - 1 && r.right <= a.right + 1; });
      check(on, `${tag} Restructuring: the selected Deals chip is scrolled into view (R42b)`);
    }
    checkErrs(errs, `${tag} ${name}`); await ctx.close();
  }
  // Every line starts on the 12px gutter (or the 72px list line) — the owner's photo had the
  // Firm facts "FUND FORMATION" role at 0px and its adviser rows at 14px (2026-10-16); the
  // sweep covers each profile tab, the borrower page, Fundraising and Menu ▸ Sources.
  // Allowed insets: the name after the ☆, a summary after its ›, a boxed chip's own text,
  // and Sources' "Fix" indent.
  {
    const LINES = () => {
      const skip = "table, .tchips, .twire-head, .topbar, .mobile-tabbar, .v2-botmeta, svg, select, input, button, [hidden], .tx-fr-nav, .na-chips, .lf-filt, .dsh-card:not(.rxh-card), .namecell, summary, .tdet-chip, .dsh-tag, .cov-fix, .dsh-sheet";
      const hidden = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === "none" || s.visibility === "hidden") return true; } return false; };
      const lines = new Map();
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let t = tw.nextNode(); t; t = tw.nextNode()) {
        if (!t.textContent.trim()) continue;
        const e = t.parentElement; if (!e || e.closest(skip) || hidden(e)) continue;
        const r = document.createRange(); r.selectNodeContents(t);
        for (const q of r.getClientRects()) {
          if (q.width < 2 || q.left > innerWidth) continue;
          const k = Math.round(q.top / 4), p = lines.get(k);
          if (!p || q.left < p.x) lines.set(k, { x: Math.round(q.left), c: e.className || e.tagName });
        }
      }
      return [...lines.values()].filter((l) => !(l.x === 12 || l.x === 13 || l.x === 72 || l.x > 60)).map((l) => `${l.x}px ${l.c}`);
    };
    const states = [
      ["17Capital", "/v2/profiles/#/manager/m1", true], ["Ares", "/v2/profiles/#/manager/m20", true], ["Investor", "/v2/profiles/#/lp/l1", true],
      ["Borrower", "/v2/profiles/#/co/Iguanas%20Holdings", false], ["Fundraising", "/v2/transactions/#/fundraising", false], ["Sources", "/v2/menu/coverage", false],
    ];
    for (const [name, path, tabs] of states) {
      const { ctx, pg, errs } = await page(w, h, scheme, path);
      await pg.waitForFunction((t) => !t || !!document.querySelector("#pf-detail .tdet-tabbed > .twire-head .tchip.is-on"), tabs, { timeout: 15000 });
      if (name === "Sources") await pg.waitForSelector(".g-feed-codes dl", { timeout: 15000 });
      const n = tabs ? await pg.evaluate(() => document.querySelectorAll("#pf-detail .tdet-tabbed > .twire-head .tchip").length) : 1;
      for (let i = 0; i < n; i++) {
        const lbl = tabs ? await pg.evaluate((i) => { const c = document.querySelectorAll("#pf-detail .tdet-tabbed > .twire-head .tchip")[i]; c.click(); return c.textContent.trim(); }, i) : "";
        await frames(pg);
        const bad = await pg.evaluate(LINES);
        check(!bad.length, `${tag} ${name}${lbl ? " ▸ " + lbl : ""}: every line starts on the 12px gutter (${[...new Set(bad)].slice(0, 4).join(" | ")})`);
      }
      checkErrs(errs, `${tag} ${name} lines`); await ctx.close();
    }
  }
  // Markets: every card's edge on the 12px gutter (the news-rail card sat at 10px) and a card
  // nested in a card reads as a section of it (Rates ▸ Reference drew a second box at 25px).
  for (const tab of ["credit", "rates", "equities"]) {
    const { ctx, pg, errs } = await page(w, h, scheme, `/v2/dashboard/${tab}`);
    await pg.waitForFunction(() => document.querySelectorAll(".dsh-card").length > 3, null, { timeout: 15000 });
    await frames(pg);
    const c = await pg.evaluate(() => {
      const cards = [...document.querySelectorAll(".dsh-card")].filter((e) => e.getClientRects().length);
      const top = cards.filter((e) => !e.parentElement.closest(".dsh-card")).map((e) => Math.round(e.getBoundingClientRect().left));
      const nested = cards.filter((e) => e.parentElement.closest(".dsh-card")).map((e) => Math.round(e.getBoundingClientRect().left + parseFloat(getComputedStyle(e).paddingLeft) + parseFloat(getComputedStyle(e).borderLeftWidth)) - Math.round((() => { const p = e.parentElement.closest(".dsh-card"); return p.getBoundingClientRect().left + parseFloat(getComputedStyle(p).paddingLeft) + parseFloat(getComputedStyle(p).borderLeftWidth); })()));
      return { top: [...new Set(top)], nested: [...new Set(nested)] };
    });
    check(c.top.length === 1 && c.top[0] === 12 && c.nested.every((d) => d === 0), `${tag} Markets ${tab}: every card on the 12px gutter, nested cards on their parent's text line (${c.top.join("/")} · ${c.nested.join("/") || "none nested"})`);
    checkErrs(errs, `${tag} markets ${tab}`); await ctx.close();
  }
  // People: line 2 one grey, the arrow included.
  {
    const { ctx, pg, errs } = await page(w, h, scheme, "/v2/profiles/#/?tab=people");
    await pg.waitForFunction(() => [...document.querySelectorAll("#pp-rows tr")].some((r) => r.getClientRects().length), null, { timeout: 15000 });
    const greys = await pg.evaluate(() => { const out = new Set(); for (const r of [...document.querySelectorAll("#pp-rows tr")].filter((x) => x.getClientRects().length).slice(0, 15)) for (const c of r.querySelectorAll("td.pp-role, td.pp-fromto, td.pp-fromto *")) if (c.getClientRects().length && c.textContent.trim()) out.add(getComputedStyle(c).color + " " + getComputedStyle(c).fontSize); return [...out]; });
    check(greys.length === 1, `${tag} People: line 2 is one size and one grey (${greys.join(" | ")})`);
    checkErrs(errs, `${tag} people`); await ctx.close();
  }
}

// ---- Desk -----------------------------------------------------------------------------
for (const [w, h, scheme] of DESKS) {
  const tag = `${w}px ${scheme}`;
  // Rails: one marker, no side-bar, no blue sub-rail.
  for (const [name, path, sel] of [
    ["Deals rail", "/v2/transactions/", ".tx-dash .twire-head .tchips"], ["Profiles rail", "/v2/profiles/", "#pf-chips"],
    ["Markets rail", "/v2/dashboard/credit", ".dsh-railnav"], ["Profile sub-rail", "/v2/profiles/#/manager/m20", "#pf-detail .tdet-tabbed > .twire-head .tchips"],
    ["League segments", "/v2/transactions/#/league", ".tx-lg-by"], ["Home lanes", "/v2/", "#g-wire-lanes"],
  ]) {
    const { ctx, pg, errs } = await page(w, h, scheme, path);
    await pg.waitForFunction((s) => !!document.querySelector(`${s} .is-on`), sel, { timeout: 15000 });
    await frames(pg);
    const [f] = await chipFacts(pg, sel);
    check(!!f && markerOk(f), `${tag} ${name}: one selection marker — 600 + one inset underline, others 400, no fill (${JSON.stringify(f && { on: f.on, off: f.offW })})`);
    if (name === "Deals rail") {
      // The date is THE lead column at every width; the search row's controls share one height.
      await pg.waitForSelector("#tx-body tr.tx-row td.c-date", { timeout: 15000 });
      const d = await pg.evaluate(() => {
        const td = document.querySelector("#tx-body tr.tx-row td.c-date"), cs = getComputedStyle(td);
        const cdw = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--c-date-w"));
        const bar = document.querySelector(".tx-dash .thead-search");
        const hs = [...bar.querySelectorAll(".tsearch, .tx-fbtn, .tfocus-btn")].filter((e) => e.getClientRects().length).map((e) => Math.round(e.getBoundingClientRect().height));
        return { content: Math.round(td.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)), cdw, hs: [...new Set(hs)], pad: getComputedStyle(bar).paddingLeft };
      });
      check(Math.abs(d.content - d.cdw) <= 1, `${tag} Deals: the date column is the one ${d.cdw}px lead (${d.content}px)`);
      check(d.hs.length === 1 && d.pad === "12px", `${tag} Deals: one search-row control height on the 12px gutter (${d.hs.join("/")} · ${d.pad})`);
    }
    if (name === "Home lanes") {
      const g = await pg.evaluate(() => { const r = document.querySelector("#g-feed a.g-feed-row"); return r ? getComputedStyle(r).columnGap : null; });
      check(g === "8px", `${tag} Home wire: the one 8px lead gap (${g})`);
      const dbl = await pg.evaluate(() => {
        const f = document.getElementById("v2-footer").getBoundingClientRect().top;
        return [...document.querySelectorAll(".tui-pnl")].filter((p) => p.getClientRects().length && Math.abs(p.getBoundingClientRect().bottom - f) < 1.5 && parseFloat(getComputedStyle(p).borderBottomWidth) > 0).map((p) => p.id || p.className);
      });
      check(!dbl.length, `${tag} Home: no panel draws a second rule on the footer's (${dbl.join(", ")})`);
    }
    checkErrs(errs, `${tag} ${name}`); await ctx.close();
  }
  // The search palette: muted codes, --t-grid rules.
  {
    const { ctx, pg, errs } = await page(w, h, scheme, "/v2/");
    await pg.keyboard.press("/");
    await pg.waitForFunction(() => [...document.querySelectorAll(".mcmdk-input")].some((i) => i.getClientRects().length), null, { timeout: 8000 });
    await pg.keyboard.type("ares");
    await pg.waitForFunction(() => document.querySelectorAll(".mcmdk-row").length > 2, null, { timeout: 8000 });
    const p = await pg.evaluate(() => {
      const probe = document.createElement("span"); document.body.appendChild(probe);
      probe.style.color = getComputedStyle(document.documentElement).getPropertyValue("--t-grid"); const grid = getComputedStyle(probe).color; probe.remove();
      const rows = [...document.querySelectorAll(".mcmdk-row")].map((r) => getComputedStyle(r).borderBottomColor);
      const codes = [...document.querySelectorAll(".mcmdk-code")].map((c) => getComputedStyle(c).backgroundColor);
      return { rules: rows.every((c) => c === grid), fills: codes.filter((c) => !/rgba\(0, 0, 0, 0\)|transparent/.test(c)).length, pad: getComputedStyle(document.querySelector(".mcmdk-row")).paddingLeft };
    });
    check(p.rules && p.fills === 0 && p.pad === "12px", `${tag} search palette: --t-grid rules, unfilled codes, 12px gutter (${JSON.stringify(p)})`);
    checkErrs(errs, `${tag} palette`); await ctx.close();
  }
}

// ---- Tokens: the legacy third grey is defined and equals --t-faint (it was unset in the
// light layer, which still sits under the dark overrides) ---------------------------------
{
  const { ctx, pg } = await page(390, 844, "light", "/v2/menu/digest");
  const t = await pg.evaluate(() => { const s = getComputedStyle(document.documentElement); return { faint: s.getPropertyValue("--faint").trim(), tfaint: s.getPropertyValue("--t-faint").trim(), day: s.getPropertyValue("--t-day").trim() }; });
  check(t.faint.toLowerCase() === t.tfaint.toLowerCase() && t.day, `--faint is defined and equals --t-faint; --t-day exists (${JSON.stringify(t)})`);
  await ctx.close();
}
await b.close(); srv.close();
finish();
