// Menu view — Search / Notifications / Display, matching the current /menu/
// page's structure and .na-menu-* classes (styled by premium.css). The heavy
// menu logic in nav-actions.js is chrome coupled to the old tab bar; this is a
// v2-native re-implementation of the same controls: search + recent searches
// (shared "wire.recentSearches" key), the theme cycle (System → Light → Dark,
// the same keys the inline boot reads), account identity and build info.
import { esc, setThemeColorMeta } from "/util.js?v=20260818-1";

const ICO_SEARCH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.6" y1="15.6" x2="21" y2="21"/></svg>';
const ICO_BELL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>';

const storedPref = () => { const c = document.documentElement.getAttribute("data-theme-choice"); return (c === "light" || c === "dark") ? c : "system"; };
const osDark = () => !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
// THREE explicit options — System · Light · Dark — surfaced as a segmented
// control. The stored pref (data-theme-choice / m_theme_pref) stays a concrete
// system|light|dark that the inline boot script already understands.
const THEME_LABEL = { system: "System", light: "Light", dark: "Dark" };
const THEME_ORDER = ["system", "light", "dark"];
function applyTheme(pref) {
  const r = document.documentElement;
  const t = pref === "system" ? (osDark() ? "dark" : "light") : pref;
  r.setAttribute("data-theme", t);
  r.setAttribute("data-theme-choice", pref);
  try { localStorage.setItem("m_theme_pref", pref); } catch { /* ignore */ }
  setThemeColorMeta(t);
}
function recents() {
  try { const a = JSON.parse(localStorage.getItem("wire.recentSearches") || "[]"); return Array.isArray(a) ? a.filter((q) => typeof q === "string").slice(0, 8) : []; }
  catch { return []; }
}

const SECTIONS = [["search", "Search"], ["notifs", "Notifications"], ["display", "Display"]];

function paneHTML(sec) {
  if (sec === "notifs") {
    const perm = (typeof Notification !== "undefined" && Notification.permission) || "default";
    const word = perm === "granted" ? "On" : perm === "denied" ? "Blocked" : "Off";
    return `<div class="na-menu-recent-h">Notifications</div>`
      + `<div class="na-menu-row na-menu-pushrow"><span>Push notifications</span>`
      + `<button type="button" class="na-menu-push" id="v2-push" title="Push notifications">${ICO_BELL}<span class="na-push-state">${word}</span></button></div>`;
  }
  if (sec === "display") {
    return `<div class="na-menu-recent-h">Appearance</div>`
      + `<div class="na-menu-row na-menu-pushrow"><span>Theme</span>`
      + `<div class="na-theme-seg" id="v2-theme-seg" role="group" aria-label="Theme">`
      + THEME_ORDER.map((pf) => `<button type="button" class="na-theme-opt${storedPref() === pf ? " is-on" : ""}" data-pref="${pf}" aria-pressed="${storedPref() === pf ? "true" : "false"}">${THEME_LABEL[pf]}</button>`).join("")
      + `</div></div>`;
  }
  const rs = recents();
  return `<button type="button" class="na-menu-row na-menu-search" data-open-search>${ICO_SEARCH}<span>Search everything…</span></button>`
    + (rs.length
      ? `<div class="na-menu-recent-h">Recent searches</div>`
        + rs.map((q) => `<button type="button" class="na-menu-row na-recent-row" data-q="${esc(q)}">${ICO_SEARCH}<span>${esc(q)}</span></button>`).join("")
      : "");
}

// CSS (the menu reuses credit styles) is declared up front in v2/index.html.

export function mount(host, ctx) {
  let sec = "search";
  // The signed-in identity now lives in the bottom strip (see chrome.js), so the
  // menu no longer repeats "Signed in as …" — it just keeps a Sign out action.
  const fillMenuAccount = () => {
    const el = host.querySelector("#account-nav-menu");
    if (!el) return;
    fetch("/api/me", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && d.email) el.innerHTML = `<a href="/cdn-cgi/access/logout">Sign out</a>`; })
      .catch(() => {});
  };
  const render = () => {
    // A plain, always-visible full-width column — NOT the .na-panel dropdown,
    // which is a fixed pop-over sized for a corner and rendered the menu
    // invisible/mis-sized on phones. The inner .na-menu-* rows are self-styled.
    host.innerHTML = `<div class="v2-menu">
      <div class="na-menu-bar"><div class="tchips">${SECTIONS.map(([k, l]) => `<button type="button" class="tchip${k === sec ? " is-on" : ""}" data-sec="${k}">${l}</button>`).join("")}</div></div>
      <div class="na-menu-pane">${paneHTML(sec)}</div>
      <div class="na-menu-foot"><div class="na-menu-foot-l"><div id="account-nav-menu" class="na-menu-row na-menu-acct"></div></div></div>
    </div>`;
    fillMenuAccount();
  };

  render();   // initial render on mount (revisits keep this DOM alive)

  host.addEventListener("click", (e) => {
    const chip = e.target.closest(".na-menu-bar .tchip");
    if (chip) { sec = chip.dataset.sec; render(); return; }
    const opt = e.target.closest("#v2-theme-seg .na-theme-opt");
    if (opt) { applyTheme(opt.dataset.pref); render(); return; }
    const rec = e.target.closest(".na-recent-row");
    if (rec) { document.dispatchEvent(new CustomEvent("wire:search", { detail: { q: rec.dataset.q } })); return; }
    const push = e.target.closest("#v2-push");
    if (push && typeof Notification !== "undefined" && Notification.requestPermission) {
      Notification.requestPermission().then(() => render()).catch(() => {});
    }
  });

  return { enter() { render(); }, leave() {} };
}
