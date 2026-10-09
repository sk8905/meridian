// v2 header action cluster (ported from nav-actions): Markets / Saved /
// Notifications / Search buttons + their panels + the refresh indicator, wired
// into the shell — WITHOUT nav-actions building its own tab bar (the runtime
// owns that). Guards against the "buttons missing / not wired" regression.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
await pg.waitForTimeout(1800);

const present = await pg.evaluate(() => ({
  cluster: !!document.querySelector("#wire-header .na-actions"),
  briefAbsent: !document.getElementById("na-brief") && !document.getElementById("na-brief-panel"),
  mkt: !!document.getElementById("na-mkt"),
  menu: !!document.getElementById("na-menu"),
  notif: !!document.getElementById("na-notif"),
  search: !!document.querySelector("#na-search[data-open-search]"),
  ringOutOfCluster: !document.querySelector(".na-actions .na-ring"),
  panels: document.querySelectorAll(".na-panel").length,
  tabbars: document.querySelectorAll(".mobile-tabbar").length,
  refresh: ((document.getElementById("data-status") || {}).textContent || "").trim().length,
}));
check(present.cluster, "header action cluster mounted (.na-actions in the header)");
check(present.briefAbsent, "Briefing button removed from the header (the brief lives on the Home News pane)");
check(!present.mkt, "Markets chart icon removed from the phone header (Markets is now a Home top-nav tab)");
check(present.menu, "Menu hamburger present in the phone header cluster (moved off the bottom bar)");
check(present.notif, "Notifications button present");
// Phone header carries Search (magnifier) + Markets/Notifications; the full-width
// body search band was removed in favour of this magnifier, and the countdown ring
// moved beside "Last refresh".
check(present.search, "Search magnifier IS in the phone header (data-open-search; the body band was removed)");
check(present.ringOutOfCluster, "countdown ring moved out of the header action cluster (now beside Last refresh)");
check(present.panels >= 3, `Ask/Markets/Notifications panels built (${present.panels})`);
checkEq(present.tabbars, 1, "still exactly one tab bar (nav-actions did NOT add its own)");
check(present.refresh > 0, `refresh indicator populated ("Last refresh…", ${present.refresh} chars)`);

// Briefing band colour map: the GREETING reads Wire orange (--accent), the KICKER
// labels (Top story / Markets / Rates & spreads) read blue (--wb-txt), and the
// actual stories/headlines read white ink (--ink) — not orange, not blue.
const ORANGE = "rgb(251, 139, 30)";
const brief = await pg.evaluate(() => {
  const rgb = (v) => { const p = document.createElement("span"); p.style.color = v; document.body.appendChild(p); const c = getComputedStyle(p).color; p.remove(); return c; };
  const col = (sel) => { const e = document.querySelector(sel); return e ? getComputedStyle(e).color : null; };
  return {
    hello: col(".wb-hello"),
    lbl: col(".wb-lbl, .g-brief-lbl"),
    link: col(".wb-link, .g-brief-link"),
    gl: [...document.querySelectorAll(".wb-gl-l")].map((e) => getComputedStyle(e).color),
    glv: col(".wb-gl-v"),
    wbtxt: rgb("var(--wb-txt)"), ink: rgb("var(--ink)"),
  };
});
check(brief.hello === ORANGE, `brief greeting is Wire orange #fb8b1e (${brief.hello})`);
check(brief.lbl === brief.wbtxt && brief.lbl !== ORANGE, `brief 'Top story' kicker is the blue --wb-txt (${brief.lbl})`);
check(brief.gl.length > 0 && brief.gl.every((c) => c === brief.wbtxt), `Markets / Rates & spreads kickers are blue too (${brief.gl.join(", ")})`);
check(brief.link === brief.ink && brief.link !== ORANGE, `brief story text is white ink, not orange (${brief.link})`);
check(brief.glv === brief.ink, `glance story text is white ink too (${brief.glv})`);

// Bottom meta strip (phone): the Sign out action + the app-wide last refresh,
// pinned DIRECTLY above the bottom tab bar. It shows ONLY on the Menu tab's
// SETTINGS chip now — navigate there, switch to Settings, assert it, then return
// to Home. It must be HIDDEN on the content desks AND on the Menu's Chat chip.
const stripHiddenOnHome = await pg.evaluate(() => { const s = document.querySelector(".v2-botmeta"); return !!s && getComputedStyle(s).display === "none"; });
check(stripHiddenOnHome, "bottom meta strip is hidden on Home (content desks stay uncluttered)");
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/menu/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(700);
check(await pg.evaluate(() => { const s = document.querySelector(".v2-botmeta"); return !!s && getComputedStyle(s).display === "none"; }),
  "bottom meta strip is hidden on the Menu's Chat chip");
await pg.evaluate(() => document.querySelector('.v2-view[data-view="menu"] .na-menu-bar .tchip[data-sec="settings"]').click());
await pg.waitForTimeout(250);
const strip = await pg.evaluate(() => {
  const s = document.querySelector(".v2-botmeta");
  const t = document.querySelector(".mobile-tabbar");
  if (!s || !t) return { ok: false };
  const sr = s.getBoundingClientRect(), tr = t.getBoundingClientRect();
  return {
    ok: true,
    shown: getComputedStyle(s).display !== "none" && sr.height > 0,
    aboveBar: sr.bottom <= tr.top + 2 && Math.abs(sr.bottom - tr.top) <= 2,
    acct: ((document.getElementById("account-nav-bot") || {}).textContent || "").trim(),
    acctLogout: !!(document.querySelector("#account-nav-bot a[href*='logout']")),
    stat: ((document.getElementById("data-status-bot") || {}).textContent || "").trim(),
  };
});
check(strip.ok && strip.shown, "bottom meta strip is shown on the Menu's Settings chip");
check(strip.aboveBar, "meta strip sits directly above the bottom tab bar");
check(strip.acctLogout && !/Signed in as/i.test(strip.acct), `meta strip shows a Sign out link, not the identity ("${strip.acct}")`);
check(/^Last:\s*\d{1,2}:\d{2}/.test(strip.stat) && !/refresh/i.test(strip.stat), `meta strip shows the compact "Last: <time>" refresh ("${strip.stat}")`);
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(700);

// Header must stay ANCHORED to the top through scroll (its sticky container is
// the short #wire-header wrapper, so on phones it's pinned position:fixed). And
// --wire-head-h must be set so each view's sticky sub-nav pins flush under it
// (no content bleeding through the seam).
const anchored = await pg.evaluate(async () => {
  const bar = document.querySelector(".topbar");
  const top0 = Math.round(bar.getBoundingClientRect().top);
  // Home defaults to the Market Briefing pane; switch to the News pane so the feed
  // filter head exists in the sticky stack we're checking here.
  document.querySelector('.g-wiretab[data-wire="news"]')?.click();
  await new Promise((r) => setTimeout(r, 250));
  // Scroll well past the top of the feed so the filter row reaches its pinned
  // position beneath the chips.
  window.scrollTo(0, 3000);
  await new Promise((r) => setTimeout(r, 300));
  const top1 = Math.round(bar.getBoundingClientRect().top);
  // On mobile Home the sticky stack under the fixed header is, top-to-bottom:
  // the News/Managers chip bar, then the feed filter head — each pinned flush
  // beneath the one above (no bleed through the seams). The full-width search
  // band was removed from the body (search moved to the header magnifier), so
  // there is no band row between the header and the chips.
  const rect = (s) => { const e = document.querySelector(s); if (!e || getComputedStyle(e).display === "none") return null; const r = e.getBoundingClientRect(); return { top: Math.round(r.top), bot: Math.round(r.bottom) }; };
  const bandShown = (() => { const e = document.querySelector(".g-main .wire-band"); return !!e && getComputedStyle(e).display !== "none"; })();
  const chips = rect(".g-wiretabs");
  const fh = rect(".g-feed-head, .g-feed-chips");
  const headVar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wire-head-h")) || 0;
  window.scrollTo(0, 0);
  return { top0, top1, headVar, bandShown, chips, fh, barH: Math.round(bar.getBoundingClientRect().height) };
});
check(anchored.top0 === 0 && anchored.top1 === 0, `top bar stays anchored at top through scroll (top ${anchored.top0}→${anchored.top1})`);
check(anchored.headVar > 0, `--wire-head-h is set for sub-nav offsets (${anchored.headVar}px)`);
check(!anchored.bandShown, "no full-width search band on phone Home (search moved to the header magnifier)");
// Each sticky layer pins flush under the one above (no content bleeds through the
// seam). On mobile Home: chips directly under the header, feed head under the
// chips. Elsewhere the feed head pins directly under the header.
if (anchored.chips !== null) {
  check(Math.abs(anchored.chips.top - anchored.headVar) <= 2, `News/Watchlist chips pin flush under the header (chips ${anchored.chips.top} ≈ head ${Math.round(anchored.headVar)})`);
  if (anchored.fh !== null) check(Math.abs(anchored.fh.top - anchored.chips.bot) <= 2, `feed head pins flush under the chip bar (feed head ${anchored.fh.top} ≈ chips bottom ${anchored.chips.bot})`);
} else if (anchored.fh !== null) {
  check(Math.abs(anchored.fh.top - anchored.headVar) <= 2, `sub-nav pins flush under the header (feed head ${anchored.fh.top} ≈ head ${Math.round(anchored.headVar)})`);
}

// Each button opens its panel (click → the matching .na-panel becomes visible).
const opens = async (btnId, panelId) => {
  await pg.evaluate((id) => document.getElementById(id)?.click(), btnId);
  await pg.waitForTimeout(450);
  const open = await pg.evaluate((pid) => { const p = document.getElementById(pid); if (!p) return false; const cs = getComputedStyle(p); return !p.hidden && cs.display !== "none" && cs.visibility !== "hidden"; }, panelId);
  await pg.evaluate((id) => document.getElementById(id)?.click(), btnId);   // close
  await pg.waitForTimeout(250);
  return open;
};
// (The Markets panel moved to the Home "Markets" tab on iPhone — no header chart
// icon here; see markets-panel.mjs for that pane.)
check(await opens("na-notif", "na-notif-panel"), "Notifications button opens the Notifications panel");

// Search opens the shared command palette, which is now LAZY-loaded on first use
// (chrome.js setupLazyPalette) — nothing mounts it on boot. The "/" shortcut routes
// through the shim; wait for the overlay to load + open rather than assume it exists.
// (Previously this clicked a defunct #na-search and passed only because the palette
// was eagerly mounted — a vacuous check.)
check(await pg.evaluate(() => !document.getElementById("mcmdk")), "palette is not eagerly mounted (lazy)");
await pg.evaluate(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "/", bubbles: true })));
await pg.waitForSelector(".mcmdk.open", { timeout: 8000 });
check(await pg.evaluate(() => !!document.querySelector(".mcmdk.open")), "search ('/' shortcut) lazy-loads and opens the command palette");
await pg.keyboard.press("Escape"); await pg.waitForTimeout(250);

const cdp = await ctx.newCDPSession(pg);
const tapKey = async (key) => {
  const box = await pg.evaluate((k) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-key="${k}"]`); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, key);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(900);
};
// Navigation still works with nav-actions loaded.
await tapKey("profiles");
checkEq(await pg.evaluate(() => (document.querySelector(".v2-view:not([hidden])") || {}).dataset?.view), "profiles", "tab navigation still works with the header cluster loaded");

// A tab tap dismisses an open header panel (no lingering overlay over the new view).
// Use the Notifications panel — the one header panel the phone cluster still opens.
await tapKey("home");
await pg.evaluate(() => document.getElementById("na-notif")?.click()); await pg.waitForTimeout(400);
check(await pg.evaluate(() => { const p = document.getElementById("na-notif-panel"); return p && !p.hidden && getComputedStyle(p).display !== "none"; }), "Notifications panel is open before the tab tap");
await tapKey("dashboard");
const closed = await pg.evaluate(() => { const p = document.getElementById("na-notif-panel"); return !p || p.hidden || getComputedStyle(p).display === "none" || !p.classList.contains("open"); });
check(closed, "tab tap dismisses the open header panel");

// App-wide "Last refresh" + notifications: identical on every desk (not split).
const tabKey2 = async (key) => {
  const box = await pg.evaluate((k) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-key="${k}"]`); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, key);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(950);
};
const readShared = async () => {
  await pg.evaluate(() => document.getElementById("na-notif")?.click());
  await pg.waitForTimeout(450);
  const r = await pg.evaluate(() => ({
    refresh: ((document.getElementById("data-status") || {}).textContent || "").trim(),
    notif: (document.querySelector("#na-notif-panel .na-body") || {}).textContent?.trim().slice(0, 200) || "",
  }));
  await pg.keyboard.press("Escape"); await pg.waitForTimeout(200);
  return r;
};
const seen = [];
for (const k of ["dashboard", "profiles", "home"]) { await tabKey2(k); seen.push([k, await readShared()]); }
const [, first] = seen[0];
check(first.refresh.length > 0, `refresh populated app-wide ("${first.refresh}")`);
for (const [k, v] of seen) {
  checkEq(v.refresh, first.refresh, `Last refresh is the SAME on ${k} (app-wide, not per-desk)`);
  checkEq(v.notif, first.notif, `notifications are the SAME on ${k} (app-wide, not per-desk)`);
}
checkEq(await pg.evaluate(() => getComputedStyle(document.getElementById("notif")).display), "none", "per-desk #notif bell stays hidden (only the shared app-wide bell shows)");

checkErrs(errs, "v2 header cluster");
await ctx.close();
await b.close(); srv.close();
finish();
