// profile-tabs.js — the ONE tabbed profile layout shared by every Profiles page
// (manager, hedge fund, investor, law firm, CLO): an identity header (.tdet-id) over a
// section rail (.twire-head .tchips — a second-level left rail on desktop, a chip row
// on phones) and its panes (.tpanes > .tpane[data-p]), inside .tdet-tabbed. The active
// tab is recorded in the URL (#/<route>/<id>[/<tab>], replaceState — R35) so reload,
// a shared link and Back from a drill-down land on the same tab.
import { esc } from "/util.js";
import { fmtDate } from "/credit/js/shared.js";

// tabs: [{ k, label, n?, html }] — n (a count) renders beside the label when > 0.
export function tabbedHTML({ tabsId, panesId, tabs, active }) {
  const on = tabs.some((t) => t.k === active) ? active : (tabs[0] || {}).k;
  return `<header class="tpanel-h twire-head"><div class="tchips" id="${esc(tabsId)}">${tabs
      .map((t) => `<button type="button" class="tchip${t.k === on ? " is-on" : ""}" data-p="${esc(t.k)}">${esc(t.label)}${t.n ? " " + t.n : ""}</button>`).join("")}</div></header>`
    + `<div class="tpanes" id="${esc(panesId)}">${tabs
      .map((t) => `<div class="tpane" data-p="${esc(t.k)}"${t.k === on ? "" : " hidden"}>${t.html}</div>`).join("")}</div>`;
}

// Wire the rail: a tap shows that pane and records the tab in the URL. `route` +
// `entityId` build the hash (omit route for a page whose hash can't carry a tab).
export function bindTabs(root, { tabsId, panesId, route, entityId, def, onShow }) {
  const tabs = root.querySelector("#" + tabsId);
  const panes = root.querySelector("#" + panesId);
  if (!tabs || !panes) return { show() {} };
  const show = (k, record = true) => {
    tabs.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c.dataset.p === k));
    panes.querySelectorAll(":scope > .tpane").forEach((el) => { el.hidden = el.dataset.p !== k; });
    if (record && route && document.documentElement.dataset.v2tab === "profiles") {
      const h = `#/${route}/${encodeURIComponent(entityId)}` + (k && k !== def ? "/" + k : "");
      if (location.hash.split("?")[0] !== h) { try { history.replaceState(history.state, "", location.pathname + location.search + h); } catch { /* keep */ } }
    }
    if (onShow) onShow(k);
  };
  tabs.addEventListener("click", (e) => { const b = e.target.closest(".tchip[data-p]"); if (b) show(b.dataset.p); });
  return { show };
}

// Coverage at a glance: items tracked · in the last 90 days · latest date — so a thin
// or stale profile is visible from its header without explanatory prose.
export function latestLine(items) {
  const dated = (items || []).filter((x) => x && x.date && !isNaN(Date.parse(x.date)));
  if (!dated.length) return `<div class="tdet-latest">No tracked items yet</div>`;
  const last = dated.reduce((a, b) => (String(b.date) > String(a.date) ? b : a));
  const d90 = dated.filter((x) => Date.parse(x.date) >= Date.now() - 90 * 864e5).length;
  return `<div class="tdet-latest"><span>${dated.length} tracked</span><span>${d90} in 90 days</span><span>latest ${esc(fmtDate(last.date))}</span></div>`;
}
