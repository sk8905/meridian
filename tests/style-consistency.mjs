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
  // The header notifications panel: its chips are a heading row too.
  {
    const { ctx, pg, errs } = await page(w, h, scheme, "/v2/");
    for (const id of ["na-notif"]) {
      await pg.click(`#${id}`);
      await pg.waitForFunction(() => [...document.querySelectorAll(".na-panel .na-chips")].some((p) => p.getClientRects().length), null, { timeout: 8000 });
      const f = (await chipFacts(pg, ".na-panel .na-chips")).find((x) => x.n);
      check(!!f && Math.abs(f.label - 12) <= 1 && markerOk(f), `${tag} panel ${id}: chips on the gutter with one marker (${JSON.stringify(f)})`);
      if (id === "na-notif") {
        const codes = await pg.evaluate(() => [...document.querySelectorAll(".na-panel .nf-code")].filter((c) => c.getClientRects().length).map((c) => { const s = getComputedStyle(c), m = getComputedStyle(c.closest(".g-ev-m")); return s.color === m.color && s.fontSize === m.fontSize && /rgba\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor); }));
        check(codes.every(Boolean), `${tag} notifications: line 2's desk code is line 2's size and grey, no fill (${codes.filter((x) => !x).length} off)`);
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
