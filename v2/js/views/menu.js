// Menu view — Search / Notifications / Display, matching the current /menu/
// page's structure and .na-menu-* classes (styled by premium.css). The heavy
// menu logic in nav-actions.js is chrome coupled to the old tab bar; this is a
// v2-native re-implementation of the same controls: search + recent searches
// (shared "wire.recentSearches" key), the theme cycle (System → Light → Dark,
// the same keys the inline boot reads), account identity and build info.
import { esc } from "/util.js?v=20260719-1";

const ICO_SEARCH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.6" y1="15.6" x2="21" y2="21"/></svg>';
const ICO_BELL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>';
const ICO_SUN = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
const ICO_MOON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const ICO_AUTO = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>';

const THEME_WORD = { system: "System", light: "Light", dark: "Dark" };
const THEME_NEXT = { system: "light", light: "dark", dark: "system" };
const storedPref = () => { const c = document.documentElement.getAttribute("data-theme-choice"); return (c === "light" || c === "dark") ? c : "system"; };
const osDark = () => !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
const themeIco = () => { const p = storedPref(); return p === "dark" ? ICO_MOON : p === "light" ? ICO_SUN : ICO_AUTO; };
const themePill = () => `${themeIco()}<span class="na-push-state">${THEME_WORD[storedPref()] || "System"}</span>`;
function applyTheme(pref) {
  const r = document.documentElement;
  const t = pref === "system" ? (osDark() ? "dark" : "light") : pref;
  r.setAttribute("data-theme", t);
  r.setAttribute("data-theme-choice", pref);
  try { localStorage.setItem("m_theme_pref", pref); } catch { /* ignore */ }
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
      + `<button type="button" class="na-menu-push na-theme-pill" id="v2-theme" aria-label="Theme — tap to change" title="Tap to change theme">${themePill()}</button></div>`;
  }
  const rs = recents();
  return `<button type="button" class="na-menu-row na-menu-search" data-open-search>${ICO_SEARCH}<span>Search everything…</span></button>`
    + (rs.length
      ? `<div class="na-menu-recent-h">Recent searches</div>`
        + rs.map((q) => `<button type="button" class="na-menu-row na-recent-row" data-q="${esc(q)}">${ICO_SEARCH}<span>${esc(q)}</span></button>`).join("")
      : "");
}

export const css = "/credit/css/styles.css?v=20260721-9";

export function mount(host, ctx) {
  let sec = "search";
  const fillMenuAccount = () => {
    const el = host.querySelector("#account-nav-menu");
    if (!el) return;
    fetch("/api/me", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && d.email) el.innerHTML = `<span>Signed in as&nbsp;</span><strong>${esc(d.email)}</strong> · <a href="/cdn-cgi/access/logout">Sign out</a>`; })
      .catch(() => {});
  };
  const render = () => {
    host.innerHTML = `<div class="na-panel na-menu-static" style="position:static;max-width:640px;margin:0 auto">
      <div class="na-menu-bar"><div class="tchips">${SECTIONS.map(([k, l]) => `<button type="button" class="tchip${k === sec ? " is-on" : ""}" data-sec="${k}">${l}</button>`).join("")}</div></div>
      <div class="na-menu-pane">${paneHTML(sec)}</div>
      <div class="na-menu-foot"><div class="na-menu-foot-l"><div id="account-nav-menu" class="na-menu-row na-menu-acct"></div><div class="na-menu-row na-menu-stat" id="v2-build">Wire</div></div></div>
    </div>`;
    fillMenuAccount();
  };

  host.addEventListener("click", (e) => {
    const chip = e.target.closest(".na-menu-bar .tchip");
    if (chip) { sec = chip.dataset.sec; render(); return; }
    const theme = e.target.closest("#v2-theme");
    if (theme) { applyTheme(THEME_NEXT[storedPref()] || "light"); theme.innerHTML = themePill(); return; }
    const rec = e.target.closest(".na-recent-row");
    if (rec) { document.dispatchEvent(new CustomEvent("wire:search", { detail: { q: rec.dataset.q } })); return; }
    const push = e.target.closest("#v2-push");
    if (push && typeof Notification !== "undefined" && Notification.requestPermission) {
      Notification.requestPermission().then(() => render());
    }
  });

  return { enter() { render(); }, leave() {} };
}
