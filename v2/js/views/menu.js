// Menu view — SIX chips (each linkable: /v2/menu/<chip>/, Chat = /v2/menu/):
//   • Chat (key "dialogue") — Ask Wire (B): a conversational assistant. The input
//     is styled like the .tsearch search fields; Enter answers inline via AI and
//     keeps a transcript, so follow-up questions carry the earlier turns as
//     context. Ask only — search lives in the global palette. No explainer copy.
//   • Watchlist — every firm/manager/fund/investor you follow across the app,
//     grouped by kind, each a link to its profile. Reads the local follow store
//     (meridian.follows) and unions the per-user cloud copy (/api/watchlist).
//   • New — records that arrived since this device last looked (whatsnew.js).
//   • Digest — the credit-desk digest, Daily / Weekly (v2/js/digest.js over the
//     committed /digest.js); shareable at /v2/menu/digest and /v2/menu/digest/weekly.
//   • Sources (key "coverage") — "Coverage & sources" (v2/js/status-page.js): what
//     Wire tracks per section, from where, how often, item counts, latest dates and a
//     GOOD / STALE / FAILING pill, with failing/stale first + the fix; live /api probes;
//     a role-based "Start here"; and "Add a law firm" (C, opens a review PR).
//   • Settings — Notifications (push toggle), Appearance (theme) + Text size (a
//     1px-step adjuster on the app-wide --fs-adj knob). Sign out and
//     density live elsewhere: sign out in the phone bottom strip; density is not
//     user-configurable.
// On PHONES this is where Search + the Ask/Add assistant live (the header keeps
// only Briefing/Markets/Bookmarks/Notifications). On DESKTOP the header still
// carries the search pill and the Ask chat, and this menu mirrors the same chips.
// The Ask/Add/omnibox UI is the shared assistant module (mountAssistant).
import { esc } from "/util.js";
import { mountAssistant } from "/v2/js/assistant.js";

const ICO_BELL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>';
// A small down caret beside the "Chat" chip label — it opens the chip's dropdown
// (currently just "New chat"). Tapping the Chat chip when it is already the active
// section toggles the dropdown; otherwise the chip switches to it as normal.
const ICO_CARET = '<svg class="tchip-caret" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';

// Text size — the whole app rides ONE knob, --fs-adj in premium.css (every type
// token is basePx + --fs-adj). The reader nudges it in 1px steps here; the value
// is an absolute px offset written inline on <html> (so it overrides the :root
// default) and persisted to m_fs_adj, which the index.html boot script re-applies
// before first paint (no flash). FS_DEFAULT mirrors the CSS baseline, so an unset
// store reads as "Default" and the control centres there.
const FS_DEFAULT = 0.5, FS_MIN = -1.5, FS_MAX = 4.5, FS_STEP = 1;
const fsClamp = (v) => Math.max(FS_MIN, Math.min(FS_MAX, v));
const fsStored = () => {
  let v; try { v = parseFloat(localStorage.getItem("m_fs_adj")); } catch { /* ignore */ }
  return Number.isFinite(v) ? fsClamp(v) : FS_DEFAULT;
};
const fsLabel = (v) => { const d = Math.round(v - FS_DEFAULT); return d === 0 ? "Default" : (d > 0 ? "+" + d : String(d)); };
function applyFontSize(v) {
  v = fsClamp(v);
  document.documentElement.style.setProperty("--fs-adj", v + "px");
  try { localStorage.setItem("m_fs_adj", String(v)); } catch { /* ignore */ }
}
// Six chips: Chat (Ask), Watchlist (follows), New (records that arrived since you
// last looked), Digest (daily / weekly), Sources (Coverage & sources + Add a law
// firm) and Settings (Notifications + Appearance).
const SECTIONS = [["dialogue", "Chat"], ["watchlist", "Watchlist"], ["new", "New"], ["digest", "Digest"], ["coverage", "Sources"], ["settings", "Settings"]];
const SEC_KEYS = SECTIONS.map(([k]) => k);
// URL ⇄ chip. /v2/menu/ = Chat; /v2/menu/<key>/ = that chip ("sources" is an alias
// of the coverage key); /v2/menu/digest/weekly = the Weekly digest.
const SEC_ALIAS = { sources: "coverage", status: "coverage", chat: "dialogue" };
function routeOf(sub) {
  const a = String((sub && sub[0]) || "").toLowerCase();
  const sec = SEC_ALIAS[a] || (SEC_KEYS.includes(a) ? a : null);
  const mode = sec === "digest" && String((sub && sub[1]) || "").toLowerCase() === "weekly" ? "weekly" : "daily";
  return { sec, mode };
}
const subOfPath = () => location.pathname.replace(/^\/v2\/menu\/?/, "").split("/").filter(Boolean);
function pathOf(sec, mode) {
  if (sec === "dialogue") return "/v2/menu/";
  if (sec === "digest") return "/v2/menu/digest" + (mode === "weekly" ? "/weekly" : "");
  return "/v2/menu/" + (sec === "coverage" ? "sources" : sec);
}

function dialoguePaneHTML() {
  // Ask Wire (mounted into #v2-menu-omni after render): Enter / "Ask" answers
  // inline via /api/ask (B). Ask only — search is the global palette, not here.
  // No idle explainer copy — the placeholder carries it.
  return `<div class="menu-asst" id="v2-menu-omni"></div>`;
}
// ---- Watchlist ------------------------------------------------------------
// Everything you follow across the app (managers, hedge funds, investors, law
// firms), grouped by kind. The rows come from saved.js/resolveFollows(), which
// resolves the meridian.follows id-store against the roster; mount() lazy-loads
// that module, unions the /api/watchlist cloud copy, then paints. Order the
// groups the same way the profiles tabs read.
const WATCH_GROUPS = ["Managers", "Hedge funds", "Investors", "Law firms"];
function watchPaneHTML() {
  return `<div class="wire-watch" id="v2-menu-watch"><p class="watch-loading">Loading your watchlist…</p></div>`;
}
function renderWatch(rows) {
  if (!rows || !rows.length) {
    return `<p class="watch-empty">You haven’t followed anything yet. Tap <strong>Follow</strong> on any manager, hedge fund, investor or law firm and it collects here.</p>`;
  }
  const groups = {};
  rows.forEach((r) => { (groups[r.kind] = groups[r.kind] || []).push(r); });
  const order = [...WATCH_GROUPS, ...Object.keys(groups).filter((k) => !WATCH_GROUPS.includes(k))];
  return order.map((g) => {
    const arr = groups[g]; if (!arr || !arr.length) return "";
    arr.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return `<div class="watch-grp"><div class="watch-grp-h">${esc(g)} <span class="watch-grp-ct">${arr.length}</span></div>`
      + arr.map((e) => `<a class="watch-row" href="${esc(e.href)}" data-watch-href="${esc(e.href)}">`
          + `<span class="watch-nm">${esc(e.name)}</span>${e.sub ? `<span class="watch-sub">${esc(e.sub)}</span>` : ""}</a>`).join("")
      + `</div>`;
  }).join("");
}
function coveragePaneHTML() {
  // Coverage & sources (status-page.js paints #v2-menu-cov after render()), then
  // "Add a law firm" (C) — drafts a roster entry and opens a review PR; the Add (C)
  // assistant mounts into #v2-menu-add after render().
  return `<div id="v2-menu-cov"><p class="watch-loading">Checking Wire’s sources…</p></div>`
    + `<div class="na-menu-recent-h">Add a law firm</div>`
    + `<div class="menu-asst" id="v2-menu-add"></div>`;
}
function settingsPaneHTML() {
  const perm = (typeof Notification !== "undefined" && Notification.permission) || "default";
  const word = perm === "granted" ? "On" : perm === "denied" ? "Blocked" : "Off";
  return `<div class="na-menu-recent-h">Notifications</div>`
    + `<div class="na-menu-row na-menu-pushrow"><span>Push notifications</span>`
    + `<button type="button" class="na-menu-push" id="v2-push" title="Push notifications">${ICO_BELL}<span class="na-push-state">${word}</span></button></div>`
    + `<div class="na-menu-recent-h">Appearance</div>`
    + `<div class="na-menu-row na-menu-pushrow"><span>Text size</span>`
    + `<div class="na-fs-seg" id="v2-fs-seg" role="group" aria-label="Text size">`
    + `<button type="button" class="na-fs-opt" data-fs="down" aria-label="Smaller text"${fsStored() <= FS_MIN ? " disabled" : ""}>A&minus;</button>`
    + `<span class="na-fs-val" role="status" aria-live="polite">${fsLabel(fsStored())}</span>`
    + `<button type="button" class="na-fs-opt" data-fs="up" aria-label="Larger text"${fsStored() >= FS_MAX ? " disabled" : ""}>A+</button>`
    + `</div></div>`;
}
function paneHTML(sec) {
  if (sec === "settings") return settingsPaneHTML();
  if (sec === "coverage") return coveragePaneHTML();
  if (sec === "watchlist") return watchPaneHTML();
  if (sec === "new") return `<div class="wire-watch" id="v2-menu-new"><p class="watch-loading">Loading what’s new…</p></div>`;
  if (sec === "digest") return `<div class="wire-watch" id="v2-menu-digest"><p class="watch-loading">Loading the digest…</p></div>`;
  return dialoguePaneHTML();
}

// CSS (the menu reuses credit styles) is declared up front in v2/index.html.

export function mount(host, ctx) {
  // The chip (and digest period) come from the URL, so a shared link lands on it.
  const r0 = routeOf(subOfPath());
  let sec = r0.sec || "dialogue";
  let digestMode = r0.mode;
  // Keep the address bar on the shown chip (in place — a chip switch is not a new
  // history entry), so the URL is always the shareable link to what is on screen.
  const syncURL = () => {
    const want = pathOf(sec, digestMode);
    if (location.pathname !== want) { try { history.replaceState(history.state, "", want); } catch { /* ignore */ } }
  };
  // Persisted Ask/Add state so switching chips (or re-rendering after a network
  // import) keeps the last answer/draft on screen. Ask (Dialogue) and Add
  // (Coverage) are separate surfaces, so they keep separate state.
  const askState = {};
  const addState = {};
  // The Chat chip carries a caret that opens a small dropdown ("New chat"). It is
  // only ever open while the Chat section is active; switching chips closes it.
  let chatMenuOpen = false;
  // Sign out + last-refresh live in the phone bottom strip (built in chrome.js),
  // and that strip is shown ONLY on the Settings chip. We surface the active chip
  // as data-menu-sec on <html> so the strip's CSS can gate on it (see app.css).
  const render = () => {
    document.documentElement.setAttribute("data-menu-sec", sec);
    // A plain, always-visible full-width column — NOT the .na-panel dropdown,
    // which is a fixed pop-over sized for a corner and rendered the menu
    // invisible/mis-sized on phones. The inner .na-menu-* rows are self-styled.
    const chips = SECTIONS.map(([k, l]) => {
      const isChat = k === "dialogue";
      const label = isChat ? `${l}${ICO_CARET}` : l;
      const expanded = isChat ? ` aria-expanded="${chatMenuOpen ? "true" : "false"}"` : "";
      return `<button type="button" class="tchip${k === sec ? " is-on" : ""}${isChat ? " tchip-has-menu" : ""}" data-sec="${k}"${expanded}>${label}</button>`;
    }).join("");
    // The "New chat" dropdown lives under the Chat chip; it's only rendered while
    // the Chat section is active and the caret has been tapped open.
    const chatMenu = (sec === "dialogue" && chatMenuOpen)
      ? `<div class="tchip-menu" role="menu"><button type="button" class="tchip-menu-item" id="v2-newchat" role="menuitem">New chat</button></div>`
      : "";
    host.innerHTML = `<div class="v2-menu">
      <div class="na-menu-bar"><div class="tchips">${chips}</div>${chatMenu}</div>
      <div class="na-menu-pane">${paneHTML(sec)}</div>
    </div>`;
    if (sec === "dialogue") mountAssistant(host.querySelector("#v2-menu-omni"), { search: false, ask: true, add: false, bare: true, placeholder: "Ask…", state: askState });
    if (sec === "coverage") mountAssistant(host.querySelector("#v2-menu-add"), { ask: false, add: true, state: addState });
    if (sec === "coverage") mountCoverage();
    if (sec === "watchlist") mountWatchlist();
    if (sec === "new") mountWhatsNew();
    if (sec === "digest") mountDigest();
  };

  // Coverage & sources: lazy-load the status page and paint it into its box (it
  // repaints as each live /api probe lands).
  async function mountCoverage() {
    try { const S = await import("/v2/js/status-page.js"); await S.mountStatus(() => host.querySelector("#v2-menu-cov")); }
    catch { const b = host.querySelector("#v2-menu-cov"); if (b) b.innerHTML = `<p class="watch-empty">Couldn’t load the sources page.</p>`; }
  }
  // Digest: lazy-load the renderer + the committed digest data module.
  let _dg = null;
  async function mountDigest() {
    try {
      if (!_dg) { const G = await import("/v2/js/digest.js"); _dg = { G, D: await G.loadDigest() }; }
      const b = host.querySelector("#v2-menu-digest"); if (b) b.innerHTML = _dg.G.digestHTML(_dg.D, digestMode);
    } catch { const b = host.querySelector("#v2-menu-digest"); if (b) b.innerHTML = `<p class="watch-empty">Couldn’t load the digest.</p>`; }
  }

  // What's new: diff the record ids in the Home slice against this device's last
  // "seen" snapshot (whatsnew.js). The first visit just sets the starting point.
  let _wnData = null;
  async function mountWhatsNew() {
    const box = () => host.querySelector("#v2-menu-new");
    try {
      const [d, W] = await Promise.all([import("/home-data.js"), import("/v2/js/whatsnew.js")]);
      _wnData = { d, W };
      let snap = W.readSnap();
      const html = W.whatsNewHTML(d, snap);
      if (!snap) W.writeSnap(W.currentIds(d));
      const b = box(); if (b) b.innerHTML = html;
    } catch { const b = box(); if (b) b.innerHTML = `<p class="watch-empty">Couldn’t load what’s new.</p>`; }
  }

  // Lazy-load saved.js (resolveFollows resolves the follow id-store against the
  // roster), paint the grouped rows, then union the /api/watchlist cloud copy
  // and repaint if it added anything. Guarded so a re-render mid-load is a no-op.
  let watchToken = 0;
  async function mountWatchlist() {
    const tok = ++watchToken;
    let resolveFollows;
    try { ({ resolveFollows } = await import("/saved.js")); }
    catch { const b = host.querySelector("#v2-menu-watch"); if (b) b.innerHTML = `<p class="watch-empty">Couldn’t load your watchlist.</p>`; return; }
    // An EMPTY watchlist offers suggested European managers + active law firms (committed
    // data) with a one-tap Follow — moved here from the retired header ☆ panel (owner
    // 2026-10-16). The suggestions stay up while the reader follows several.
    let sugMode = false;
    const paint = async () => {
      if (tok !== watchToken) return;
      const rows = resolveFollows();
      let html;
      if (rows.length && !sugMode) html = renderWatch(rows);
      else {
        try {
          const [W, cr, lg, T, S] = await Promise.all([import("/v2/js/whatsnew.js"), import("/credit/js/data.js"), import("/legal/js/data.js"), import("/credit/js/target.js"), import("/credit/js/shared.js")]);
          sugMode = true; html = W.suggestHTML(W.suggestFollows(cr, lg, T.targetFit), S.isFollowed);
        } catch { html = renderWatch(rows); }
      }
      const b = host.querySelector("#v2-menu-watch"); if (b && tok === watchToken) b.innerHTML = html;
    };
    await paint();
    // Reconcile with the cloud copy through the ONE shared merge (credit/js/shared.js),
    // then repaint if a follow arrived from another device.
    try {
      const { syncFollows } = await import("/credit/js/shared.js");
      const { changed } = await syncFollows();
      if (changed && !sugMode) paint();
    } catch { /* offline / not on cloud — local follows already painted */ }
  }

  render();   // initial render on mount (revisits keep this DOM alive)
  syncURL();

  host.addEventListener("click", (e) => {
    // "New chat" (Chat-chip dropdown): drop the transcript and start a fresh chat.
    const newChat = e.target.closest("#v2-newchat");
    if (newChat) { askState.turns = []; askState.loading = false; chatMenuOpen = false; render(); return; }
    const chip = e.target.closest(".na-menu-bar .tchip");
    if (chip) {
      const target = chip.dataset.sec;
      // Tapping the active Chat chip toggles its dropdown; any other tap switches
      // section (and always closes the dropdown).
      if (target === "dialogue" && sec === "dialogue") { chatMenuOpen = !chatMenuOpen; render(); return; }
      sec = target; chatMenuOpen = false; syncURL(); render(); return;
    }
    // Digest: Daily / Weekly toggle (URL follows) + Share link.
    const dgOpt = e.target.closest("#v2-dg-seg [data-dg-mode]");
    if (dgOpt) { digestMode = dgOpt.dataset.dgMode === "weekly" ? "weekly" : "daily"; syncURL(); mountDigest(); return; }
    const dgShare = e.target.closest("#v2-dg-share");
    if (dgShare && _dg) { _dg.G.shareDigest(dgShare); return; }
    // A tap anywhere else closes an open Chat dropdown.
    if (chatMenuOpen) { chatMenuOpen = false; render(); }
    const fsBtn = e.target.closest("#v2-fs-seg .na-fs-opt");
    if (fsBtn && !fsBtn.disabled) {
      applyFontSize(fsStored() + (fsBtn.dataset.fs === "up" ? FS_STEP : -FS_STEP));
      render(); return;
    }
    const push = e.target.closest("#v2-push");
    if (push && typeof Notification !== "undefined" && Notification.requestPermission) {
      Notification.requestPermission().then(() => render()).catch(() => {});
    }
    // What's new: "Mark all as seen" re-baselines the snapshot to the current records.
    if (e.target.closest("#v2-new-seen") && _wnData) { _wnData.W.writeSnap(_wnData.W.currentIds(_wnData.d)); mountWhatsNew(); return; }
    // One-tap Follow on a suggested manager / law firm (the shared follow store + cloud sync).
    const sug = e.target.closest("[data-sugg-follow]");
    if (sug) {
      e.preventDefault();
      const [type, id] = sug.dataset.suggFollow.split(":");
      import("/credit/js/shared.js").then((S) => {
        const on = S.toggleFollow(type, id);
        sug.classList.toggle("is-on", on); sug.setAttribute("aria-pressed", on ? "true" : "false");
        sug.textContent = on ? "Following" : "Follow";
        sug.setAttribute("aria-label", (on ? "Unfollow " : "Follow ") + ((sug.closest(".wsug-row") || sug).querySelector(".watch-nm") || {}).textContent);
      }).catch(() => {});
      return;
    }
    // A watchlist row → open that profile (cross-page to /v2/profiles/).
    const wrow = e.target.closest("[data-watch-href]");
    if (wrow) { e.preventDefault(); ctx.navigate(wrow.dataset.watchHref); return; }
  });

  return {
    // A same-tab move (a shared /v2/menu/digest/weekly link, a Start-here link to
    // /v2/menu/watchlist, a Menu tab tap) lands on the chip its URL names; a bare
    // /v2/menu/ keeps the chip the reader was on and re-syncs the address bar.
    enter(sub) {
      const r = routeOf(sub || subOfPath());
      if (r.sec) { sec = r.sec; if (r.sec === "digest") digestMode = r.mode; chatMenuOpen = false; }
      render(); syncURL();
    },
    // Drop the menu-section signal so the bottom strip can't linger on other tabs
    // (its CSS also gates on data-v2tab="menu", but keep the root attribute tidy).
    leave() { document.documentElement.removeAttribute("data-menu-sec"); },
  };
}
