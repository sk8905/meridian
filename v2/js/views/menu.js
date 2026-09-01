// Menu view — Notifications / Network / Display, using the .na-menu-* classes
// (styled by premium.css). Search is intentionally NOT here: it lives in the
// header ("Search everything…") and opens the one command palette, which now
// carries its own Recent list — so the Menu no longer duplicates it. This is a
// v2-native re-implementation of the theme cycle (System → Light → Dark, the same
// keys the inline boot reads), the notifications toggle, the LinkedIn network
// importer, and account identity.
import { esc, setThemeColorMeta } from "/util.js?v=20260818-1";
import { load as netLoad, importCSV as netImport, accept as netAccept, dismiss as netDismiss, clearAll as netClear } from "/v2/js/network/store.js?v=v2-2";

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
// Search is not a Menu section: it lives in the header (the persistent "Search
// everything…" control) and opens the one command palette, which now carries its
// own Recent list. The Menu keeps Notifications / Network / Display.
const SECTIONS = [["notifs", "Notifications"], ["network", "Network"], ["display", "Display"]];

// ---- Network (LinkedIn connections) ---------------------------------------
// The importer + "My network" list. All state comes from network/store.js
// (localStorage; nothing leaves the device). The import controls carry stable
// ids so the mount() handlers below find them; the roster match runs in the
// store's importCSV (lazy-loads the heavy data), so this builder stays sync.
const NET_GROUPS = [["manager", "Managers"], ["hf", "Hedge Funds"], ["firm", "Law firms"]];
function netWhen(iso) { try { return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } }
function netPeople(people) { return (people || []).map((p) => esc(p.name) + (p.position ? ` · ${esc(p.position)}` : "")).join("<br>"); }
function netImporter() {
  return `<div class="wn-import">
    <label class="wn-btn wn-file"><input type="file" id="wn-file" accept=".csv,text/csv" hidden>Choose Connections.csv…</label>
    <details class="wn-paste"><summary>or paste CSV text</summary>
      <textarea id="wn-paste-txt" rows="4" placeholder="Paste the contents of Connections.csv here"></textarea>
      <button type="button" class="wn-btn wn-paste-go" id="wn-paste-go">Import pasted text</button></details>
    <div class="wn-status" id="wn-status" role="status" aria-live="polite"></div></div>`;
}
function netPaneHTML() {
  const s = netLoad();
  if (!s) {
    return `<div class="wire-net">
      <div class="na-menu-recent-h">LinkedIn connections</div>
      <p class="wn-intro">Import your LinkedIn <strong>Connections.csv</strong> export to see who you know at the managers, hedge funds and law firms Wire tracks. Everything stays on this device — your contacts are matched in the browser and never sent anywhere.</p>
      ${netImporter()}
      <p class="wn-how">Get the file from LinkedIn: <em>Settings → Data privacy → Get a copy of your data → Connections</em>, then open the archive and import <code>Connections.csv</code>.</p>
    </div>`;
  }
  const groups = { manager: [], hf: [], firm: [] };
  Object.values(s.confident || {}).forEach((e) => { (groups[e.kind] || []).push(e); });
  Object.keys(groups).forEach((k) => groups[k].sort((a, b) => b.people.length - a.people.length || a.name.localeCompare(b.name)));
  const matched = Object.keys(s.confident || {}).length;
  const known = Object.values(s.confident || {}).reduce((n, e) => n + e.people.length, 0);

  const pending = (s.pending && s.pending.length)
    ? `<div class="wn-pending"><div class="na-menu-recent-h">Confirm these matches</div>
       <p class="wn-hint">Company names that look close but aren’t exact — accept the ones that are the same firm.</p>
       ${s.pending.map((p) => `<div class="wn-pend">
         <div class="wn-pend-q"><span class="wn-pend-co">${esc(p.company)}</span> → <span class="wn-pend-nm">${esc(p.name)}</span>?</div>
         <div class="wn-pend-people">${netPeople(p.people)}</div>
         <div class="wn-pend-acts"><button type="button" class="wn-yes" data-acc="${esc(p.company)}">Yes, same firm</button><button type="button" class="wn-no" data-dis="${esc(p.company)}">No</button></div>
       </div>`).join("")}</div>`
    : "";

  const list = matched
    ? `<div class="wn-list">${NET_GROUPS.map(([k, label]) => {
        const arr = groups[k]; if (!arr.length) return "";
        return `<div class="wn-grp"><div class="wn-grp-h">${label} <span class="wn-grp-ct">${arr.length}</span></div>`
          + arr.map((e) => `<div class="wn-ent">
              <a class="wn-ent-nm" href="/v2/profiles/${esc(e.route)}" data-net-route="${esc(e.route)}"><span class="wn-ent-t">${esc(e.name)}</span><span class="wn-ent-ct">${e.people.length}</span></a>
              <div class="wn-ent-people">${netPeople(e.people)}</div></div>`).join("")
          + `</div>`;
      }).join("")}</div>`
    : `<p class="wn-empty">None of your connections are at a firm Wire currently tracks.</p>`;

  return `<div class="wire-net">
    <div class="na-menu-recent-h">LinkedIn connections</div>
    <div class="wn-sum"><strong>${known}</strong> connection${known === 1 ? "" : "s"} at <strong>${matched}</strong> firm${matched === 1 ? "" : "s"} you follow · ${s.total} scanned · imported ${esc(netWhen(s.savedAt))}</div>
    ${pending}
    ${list}
    <div class="wn-foot"><details class="wn-paste wn-reimport"><summary>Re-import / replace file</summary>${netImporter()}</details>
      <button type="button" class="wn-clear" id="wn-clear">Remove imported data</button></div>
  </div>`;
}

function paneHTML(sec) {
  if (sec === "network") return netPaneHTML();
  if (sec === "display") {
    return `<div class="na-menu-recent-h">Appearance</div>`
      + `<div class="na-menu-row na-menu-pushrow"><span>Theme</span>`
      + `<div class="na-theme-seg" id="v2-theme-seg" role="group" aria-label="Theme">`
      + THEME_ORDER.map((pf) => `<button type="button" class="na-theme-opt${storedPref() === pf ? " is-on" : ""}" data-pref="${pf}" aria-pressed="${storedPref() === pf ? "true" : "false"}">${THEME_LABEL[pf]}</button>`).join("")
      + `</div></div>`;
  }
  // Notifications is the default pane.
  const perm = (typeof Notification !== "undefined" && Notification.permission) || "default";
  const word = perm === "granted" ? "On" : perm === "denied" ? "Blocked" : "Off";
  return `<div class="na-menu-recent-h">Notifications</div>`
    + `<div class="na-menu-row na-menu-pushrow"><span>Push notifications</span>`
    + `<button type="button" class="na-menu-push" id="v2-push" title="Push notifications">${ICO_BELL}<span class="na-push-state">${word}</span></button></div>`;
}

// CSS (the menu reuses credit styles) is declared up front in v2/index.html.

export function mount(host, ctx) {
  let sec = "notifs";
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

  // Parse + match a Connections.csv body. On success re-render (the pane swaps to
  // the summary); on failure keep the pane and surface the reason inline.
  async function runImport(text) {
    const st = host.querySelector("#wn-status");
    if (st) st.textContent = "Matching…";
    try { await netImport(text); render(); }
    catch (err) { const s2 = host.querySelector("#wn-status"); if (s2) s2.textContent = (err && err.message) || "Could not import that file."; }
  }

  host.addEventListener("change", (e) => {
    const f = e.target.closest("#wn-file");
    if (f && f.files && f.files[0]) {
      f.files[0].text().then(runImport).catch(() => { const st = host.querySelector("#wn-status"); if (st) st.textContent = "Couldn’t read that file."; });
    }
  });

  host.addEventListener("click", (e) => {
    const chip = e.target.closest(".na-menu-bar .tchip");
    if (chip) { sec = chip.dataset.sec; render(); return; }
    const opt = e.target.closest("#v2-theme-seg .na-theme-opt");
    if (opt) { applyTheme(opt.dataset.pref); render(); return; }
    const push = e.target.closest("#v2-push");
    if (push && typeof Notification !== "undefined" && Notification.requestPermission) {
      Notification.requestPermission().then(() => render()).catch(() => {});
    }
    // ---- Network section ----
    const pasteGo = e.target.closest("#wn-paste-go");
    if (pasteGo) { const ta = host.querySelector("#wn-paste-txt"); runImport(ta ? ta.value : ""); return; }
    const acc = e.target.closest("[data-acc]");
    if (acc) { netAccept(acc.dataset.acc); render(); return; }
    const dis = e.target.closest("[data-dis]");
    if (dis) { netDismiss(dis.dataset.dis); render(); return; }
    const clr = e.target.closest("#wn-clear");
    if (clr) { netClear(); render(); return; }
    const netrow = e.target.closest("[data-net-route]");
    if (netrow) { e.preventDefault(); ctx.navigate("/v2/profiles/" + netrow.dataset.netRoute); return; }
  });

  return { enter() { render(); }, leave() {} };
}
