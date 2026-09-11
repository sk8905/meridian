// The Menu view must render as a VISIBLE full-width column — not the .na-panel
// dropdown, which sized it to a hidden corner sliver on phones ("Menu opens
// blank"). Checks both a direct load and a real client-side tab tap.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

async function menuState(pg) {
  return pg.evaluate(() => {
    const m = document.querySelector('.v2-view[data-view="menu"] .v2-menu');
    if (!m) return { hasMenu: false };
    const r = m.getBoundingClientRect();
    const cs = getComputedStyle(m);
    const chips = [...document.querySelectorAll('.v2-view[data-view="menu"] .na-menu-bar .tchip')]
      .map((c) => { const cr = c.getBoundingClientRect(); return cr.width > 0 && cr.height > 0; });
    return { hasMenu: true, w: Math.round(r.width), h: Math.round(r.height), display: cs.display, visible: chips.length === 3 && chips.every(Boolean), labels: [...document.querySelectorAll('.v2-view[data-view="menu"] .na-menu-bar .tchip')].map((c) => c.textContent.trim()) };
  });
}

// 1) Direct load of /v2/menu/.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/menu/");
  await pg.waitForTimeout(1400);
  const s = await menuState(pg);
  check(s.hasMenu, "direct /v2/menu/: menu container present");
  check(s.w >= 300, `direct /v2/menu/: menu is full-width (${s.w}px), not a dropdown sliver`);
  check(s.h > 80, `direct /v2/menu/: menu has height (${s.h}px)`);
  check(s.visible, `direct /v2/menu/: the three chips (Chat/Coverage/Settings) are visible (${(s.labels || []).join("/")})`);
  checkEq((s.labels || []).join("/"), "Chat/Coverage/Settings", "direct /v2/menu/: chips are Chat / Coverage / Settings");
  // Dialogue is a BARE Ask field rendered EXACTLY like the search band: one input,
  // NO action button, placeholder "Ask…". The band form sits on the --head ground
  // with a bottom divider; the FIELD (.na-ask-in) takes the lifted --lift ground
  // and the .tsearch metrics (26px tall, 1px border) — same as bandHTML's .tsearch.
  const dlg = await pg.evaluate(() => {
    const c = document.querySelector('.v2-view[data-view="menu"] #v2-menu-omni');
    if (!c) return null;
    const form = c.querySelector(".na-ask-form");
    const input = c.querySelector(".na-ask-in");
    const rgbOf = (v) => { const p = document.createElement("div"); p.style.background = v; document.body.appendChild(p); const c2 = getComputedStyle(p).backgroundColor; p.remove(); return c2; };
    const cs = input ? getComputedStyle(input) : {};
    return {
      buttons: c.querySelectorAll(".na-ask-go, .na-ask-search, .na-ask-add").length,
      send: c.querySelectorAll(".na-ask-send").length,
      inputs: c.querySelectorAll(".na-ask-in").length,
      ph: input ? input.placeholder : "",
      inputBg: input ? cs.backgroundColor : "", liftRGB: rgbOf("var(--lift)"),
      formBg: form ? getComputedStyle(form).backgroundColor : "", headRGB: rgbOf("var(--head)"),
      h: input ? cs.height : "", bw: input ? cs.borderTopWidth : "",
    };
  });
  check(dlg && dlg.inputs === 1 && dlg.buttons === 0, "direct /v2/menu/: the Dialogue chip is a bare Ask field (one input, no Search/Add/Ask buttons)");
  check(dlg && dlg.send === 1, "direct /v2/menu/: the Dialogue chip has a single Send button");
  check(await pg.evaluate(() => !!document.querySelector('.v2-view[data-view="menu"] .na-menu-bar .tchip[data-sec="dialogue"] .tchip-caret')), "direct /v2/menu/: the Chat chip carries a down caret");
  check(dlg && /ask/i.test(dlg.ph) && !/search/i.test(dlg.ph), `direct /v2/menu/: the placeholder is the Ask prompt (${dlg && dlg.ph})`);
  check(dlg && dlg.inputBg === dlg.liftRGB, `direct /v2/menu/: the Ask FIELD takes the lifted --lift ground (field ${dlg && dlg.inputBg} vs --lift ${dlg && dlg.liftRGB})`);
  check(dlg && dlg.formBg === dlg.headRGB, `direct /v2/menu/: the band sits on the --head ground like the search band (form ${dlg && dlg.formBg} vs --head ${dlg && dlg.headRGB})`);
  check(dlg && dlg.h === "26px" && parseFloat(dlg.bw) >= 1, `direct /v2/menu/: the Ask field matches the .tsearch metrics (26px tall, bordered; got ${dlg && dlg.h}/${dlg && dlg.bw})`);
  // The bottom strip (Sign out + last refresh) shows ONLY on the Settings chip.
  // On the default Chat chip it must be hidden.
  const stripDisplay = () => pg.evaluate(() => { const s = document.querySelector(".v2-botmeta"); return s ? getComputedStyle(s).display : "missing"; });
  checkEq(await stripDisplay(), "none", "direct /v2/menu/: the bottom strip is hidden on the Chat chip");
  // Switch to Settings → the strip appears.
  await pg.evaluate(() => document.querySelector('.v2-view[data-view="menu"] .na-menu-bar .tchip[data-sec="settings"]').click());
  await pg.waitForTimeout(200);
  checkEq(await stripDisplay(), "flex", "Settings chip: the bottom strip appears");
  const strip = await pg.evaluate(() => {
    const bot = document.getElementById("account-nav-bot");
    const link = bot && bot.querySelector('a[href*="logout"]');
    const stat = document.querySelector("#data-status-bot .ds-part") || document.getElementById("data-status-bot");
    return {
      html: bot ? bot.innerHTML : "", logout: !!link,
      linkColor: link ? getComputedStyle(link).color : "",
      refreshColor: stat ? getComputedStyle(stat).color : "",
    };
  });
  check(strip.logout, "Settings chip: bottom strip shows a Sign out link");
  check(!/Signed in as/i.test(strip.html), "Settings chip: bottom strip no longer shows the signed-in identity");
  check(strip.logout && strip.linkColor === strip.refreshColor, `Settings chip: Sign out is the same grey as the refresh time (${strip.linkColor} vs ${strip.refreshColor})`);
  // Bottom-right refresh is the compact "Last: <time>" — time only, no date and
  // not the long "Last refresh" label (the header rail/footer keep the full form).
  const refresh = await pg.evaluate(() => (document.getElementById("data-status-bot")?.textContent || "").trim());
  check(/^Last:\s*\d{1,2}:\d{2}/.test(refresh), `Settings chip: bottom-right reads "Last: <time>" (${refresh})`);
  check(refresh && !/\d{4}/.test(refresh) && !/refresh/i.test(refresh), `Settings chip: bottom-right has no date and drops the 'refresh' word (${refresh})`);
  // Back to Chat → the strip hides again.
  await pg.evaluate(() => document.querySelector('.v2-view[data-view="menu"] .na-menu-bar .tchip[data-sec="dialogue"]').click());
  await pg.waitForTimeout(200);
  checkEq(await stripDisplay(), "none", "back on Chat: the bottom strip hides again");
  // The chip bar is locked at the top so it never scrolls away — either sticky
  // (Coverage/Settings) or a flex item in the docked Chat's fixed column.
  const chipbar = await pg.evaluate(() => {
    const el = document.querySelector('.v2-view[data-view="menu"] .na-menu-bar');
    const view = document.querySelector('.v2-view[data-view="menu"]');
    if (!el) return null; const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { pos: cs.position, top: Math.round(r.top), viewPos: getComputedStyle(view).position };
  });
  check(chipbar && (chipbar.pos === "sticky" || chipbar.viewPos === "fixed"), `direct /v2/menu/: the chip bar is locked (sticky or in the docked fixed view; chip ${chipbar && chipbar.pos}, view ${chipbar && chipbar.viewPos})`);
  check(chipbar && chipbar.top >= 40 && chipbar.top <= 80, `direct /v2/menu/: the chip bar pins below the header on phone (top ${chipbar && chipbar.top})`);
  // Focusing the docked chat input arms keyboard mode AND presets --kbd-h to the
  // keyboard height straight away (>0), so the input starts above the keyboard and
  // iOS never scrolls the header/tabs off the top.
  const pin = await pg.evaluate(() => {
    const inp = document.querySelector('.v2-view[data-view="menu"] .na-ask-in');
    if (inp) inp.focus();
    return { kbdOn: document.documentElement.classList.contains("chat-kbd"), kbdH: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--kbd-h")) || 0 };
  });
  check(pin.kbdOn, "docked chat: focusing the input arms keyboard mode (chat-kbd)");
  check(pin.kbdH > 120, `docked chat: --kbd-h is preset on focus so the input sits above the keyboard (${pin.kbdH}px)`);
  // While the keyboard is up the docked view ends exactly at the keyboard top
  // (--kbd-h) so the Ask input stays visible just above it.
  const kb = await pg.evaluate(() => {
    const view = document.querySelector('.v2-view[data-view="menu"]:has(.menu-asst.is-docked)') || document.querySelector('.v2-view[data-view="menu"]');
    document.documentElement.classList.add("chat-kbd");
    document.documentElement.style.setProperty("--kbd-h", "300px");
    const vb = getComputedStyle(view).bottom;
    document.documentElement.classList.remove("chat-kbd");
    document.documentElement.style.setProperty("--kbd-h", "0px");
    return { viewBottom: vb };
  });
  check(kb.viewBottom === "300px", `docked chat: the view ends at the keyboard top so the input stays visible (${kb.viewBottom})`);
  checkErrs(errs, "direct menu");
  await ctx.close();
}

// 2) Client-side tab tap (real touch) from Home.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.waitForTimeout(1400);
  const cdp = await ctx.newCDPSession(pg);
  const box = await pg.evaluate(() => { const t = document.querySelector('.mobile-tabbar .mtab[data-key="menu"]'); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(900);
  const s = await menuState(pg);
  check(s.hasMenu && s.visible && s.w >= 300, `tap Menu: renders full-width + visible chips (w=${s.w}, visible=${s.visible})`);
  checkEq(await pg.evaluate(() => (document.querySelector(".v2-view:not([hidden])") || {}).dataset?.view), "menu", "tap Menu: menu is the active view");
  // The Origination radar was replaced by the Transactions tab in that slot.
  const tabs = await pg.evaluate(() => ({
    labels: [...document.querySelectorAll(".mobile-tabbar .mtab-lbl")].map((x) => x.textContent.trim()),
    tx: (document.querySelector('.mobile-tabbar .mtab[data-key="transactions"] .mtab-lbl') || {}).textContent?.trim(),
  }));
  checkEq(tabs.tx, "Transactions", "bottom tab for the 'transactions' route reads 'Transactions'");
  check(!tabs.labels.includes("Origination") && !tabs.labels.includes("Radar"), `no bottom tab still reads 'Origination'/'Radar' (${tabs.labels.join("/")})`);
  checkErrs(errs, "tap menu");
  await ctx.close();
}

// 3) Desktop: Menu isn't a platform pill, so a top-bar Menu icon must reach it.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.waitForTimeout(1200);
  const btn = await pg.evaluate(() => {
    const el = document.querySelector("#wire-header .nav-menu-btn");
    if (!el) return { present: false };
    const r = el.getBoundingClientRect();
    return { present: true, visible: r.width > 0 && r.height > 0, key: el.dataset.key };
  });
  check(btn.present && btn.visible, "desktop: Menu icon button is present + visible in the top bar");
  checkEq(btn.key, "menu", "desktop: Menu button routes to the menu tab");
  await pg.evaluate(() => document.querySelector("#wire-header .nav-menu-btn").click());
  await pg.waitForTimeout(700);
  const after = await pg.evaluate(() => ({
    active: (document.querySelector(".v2-view:not([hidden])") || {}).dataset?.view,
    marked: !!document.querySelector("#wire-header .nav-menu-btn.is-active"),
  }));
  checkEq(after.active, "menu", "desktop: clicking the Menu button opens the Menu view");
  check(after.marked, "desktop: Menu button shows the active state on the menu tab");
  // The fixed desktop shell (body overflow:hidden) means the menu must scroll
  // internally, else a long pane (e.g. the Network list) clips with no way down.
  const ov = await pg.evaluate(() => { const v = document.querySelector('.v2-view[data-view="menu"]'); return v ? getComputedStyle(v).overflowY : ""; });
  checkEq(ov, "auto", "desktop: menu view scrolls internally (overflow-y:auto), so a long pane isn't clipped");
  checkErrs(errs, "desktop menu button");
  await ctx.close();
}

// 4) Phone: the top-bar Menu icon is hidden (the bottom tab bar owns Menu there).
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.waitForTimeout(1000);
  const hidden = await pg.evaluate(() => {
    const el = document.querySelector("#wire-header .nav-menu-btn");
    return !el || getComputedStyle(el).display === "none";
  });
  check(hidden, "phone: top-bar Menu icon is hidden (bottom tab bar carries Menu)");
  checkErrs(errs, "phone menu button hidden");
  await ctx.close();
}

// 5) The active-tab underline is IDENTICAL across surfaces — one canonical
// flush 2-layer marker (2px inset + 1px below), so no tab row looks heavier or
// thinner than another (Menu chips, Macro .twire-head tabs, Home wire tabs).
{
  async function underline(path, sel, waitSel) {
    const { ctx, pg } = await open(b, PHONE, base + path);
    if (waitSel) await pg.waitForSelector(waitSel, { timeout: 8000 }).catch(() => {});
    await pg.waitForTimeout(1400);
    const bs = await pg.evaluate((s) => { const el = document.querySelector(s); return el ? getComputedStyle(el).boxShadow : ""; }, sel);
    await ctx.close();
    return bs;
  }
  const menuUL = await underline("/v2/menu/", ".na-menu-bar .tchip.is-on", ".na-menu-bar .tchip");
  const macroUL = await underline("/v2/macro/", ".twire-head .tchip.is-on", "#mac-chips");
  const homeUL = await underline("/v2/", ".tui .g-wiretab.is-on", ".g-wiretabs");
  // Two shadow layers = the flush marker (inset underline + the on-divider line).
  check(menuUL && (menuUL.match(/rgb/g) || []).length >= 2 && /inset/.test(menuUL), `active-tab underline is the flush 2-layer marker (${menuUL})`);
  checkEq(macroUL, menuUL, "Macro .twire-head tab underline matches the Menu chip underline (same weight)");
  checkEq(homeUL, menuUL, "Home wire-tab underline matches the Menu chip underline (same weight)");
}

await b.close(); srv.close();
finish();
