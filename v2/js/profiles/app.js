// Profiles — a cross-desk directory AND the home of every entity profile. It
// renders the EXACT same three lists that used to live under Credit (Managers,
// Hedge Funds) and Legal (Law firms) by borrowing those apps' own pane builders
// (one source per list, no second version), and — crucially — it now HOSTS the
// profile detail pages itself. Tapping a row no longer bounces you into the
// retired Credit/Legal desk tab: the manager / hedge-fund / law-firm page (and
// everything it links to — funds, CLOs, investors, filings) renders right here,
// inside Profiles, with a Managers · Hedge Funds · Law firms nav that returns to
// the list. The detail views are the desks' own view functions, pointed at a
// Profiles-owned host per render (see __setProfilesMode in the detail modules).

import {
  viewManager, viewFund, viewClo, viewLp, viewHedgeFund,
  __setHost as setCreditHost, __setProfilesMode as setCreditPfMode,
} from "/v2/js/credit/detail.js?v=v2-24";
import {
  viewFirm, viewItem,
  __setHost as setLegalHost, __setProfilesMode as setLegalPfMode,
} from "/v2/js/legal/detail.js?v=v2-10";
import { esc } from "/util.js?v=20260818-1";
import { matchesFor, pendingFor } from "/v2/js/network/store.js?v=v2-2";

export async function mount(host, ctx) {
  // Borrow Credit's and Legal's list builders (mounts them off-screen if needed).
  const [credit, legal] = await Promise.all([ctx.view("credit"), ctx.view("legal")]);
  const CHIPS = [["managers", "Managers"], ["hedgefunds", "Hedge Funds"], ["firms", "Law firms"]];
  host.innerHTML = `
    <div id="pf-list" class="tdash">
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <header class="tpanel-h twire-head">
            <div class="tchips" id="pf-chips">${CHIPS
              .map(([k, l], i) => `<button type="button" class="tchip${i === 0 ? " is-on" : ""}" data-p="${k}">${l}</button>`).join("")}</div>
          </header>
          <div class="tpanes" id="pf-panes">
            ${credit.buildManagers()}
            ${credit.buildHedgeFunds()}
            ${legal.buildLawFirms()}
            <div id="pf-detail" hidden></div>
          </div>
        </section>
      </div>
    </div>`;
  const pfList = host.querySelector("#pf-list");
  const pfDetail = host.querySelector("#pf-detail");
  const panes = host.querySelector("#pf-panes");
  const chips = host.querySelector("#pf-chips");

  // Back control: a leading ‹ chevron injected into each list's search row. When
  // a profile is open the list's tabs + AUM-focus row + search box stay put (the
  // table gives way to the profile below); the chevron in that persistent search
  // row returns to the list. Injected once per pane; shown only while detailing
  // (CSS .pf-detailing), and only in the active pane's visible search row.
  panes.querySelectorAll(".thead-search").forEach((h) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pf-back-chev";
    b.setAttribute("aria-label", "Back to list");
    b.setAttribute("title", "Back to list");
    b.textContent = "‹";
    h.insertBefore(b, h.firstChild);
  });

  // ---- list <-> detail plumbing -------------------------------------------
  const showPane = (p) => panes.querySelectorAll(".tpane").forEach((el) => { el.hidden = el.dataset.pane !== p; });
  const selectChip = (p) => {
    chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c.dataset.p === p));
    showPane(p);
  };
  // Detailing = a profile is open. The list frame (chips + AUM-focus + search)
  // stays visible; CSS (.pf-detailing) hides the active list's TABLE and the
  // detail's own duplicate section nav, so the profile renders directly under the
  // search box. exitDetail() just closes the profile (no scroll — used when you
  // start typing/filtering in the persistent search); showList() also resets the
  // scroll and (optionally) the active tab.
  const setDetailing = (on) => host.classList.toggle("pf-detailing", on);
  const exitDetail = () => { setDetailing(false); pfDetail.hidden = true; pfDetail.innerHTML = ""; };
  function showList(tab) {
    exitDetail();
    pfList.hidden = false;
    if (tab) selectChip(tab);
    window.scrollTo(0, 0);
  }
  // Render a desk detail view into the Profiles-owned host. The list stays
  // mounted (only its table is hidden by .pf-detailing); point the shared detail
  // host at #pf-detail and flip Profiles mode on right before the synchronous
  // render. selectChip(p) first, so the persistent frame above the profile is the
  // RIGHT list (its search box + AUM focus), and the active tab highlights.
  const renderCredit = (p, fn) => { selectChip(p); setDetailing(true); pfList.hidden = false; pfDetail.hidden = false; setCreditHost(pfDetail); setCreditPfMode(true); window.scrollTo(0, 0); fn(); };
  const renderLegal = (p, fn) => { selectChip(p); setDetailing(true); pfList.hidden = false; pfDetail.hidden = false; setLegalHost(pfDetail); setLegalPfMode(true); window.scrollTo(0, 0); fn(); };

  // If the viewer has imported their LinkedIn connections (menu ▸ Network) and
  // knows anyone at this entity, prepend a COLLAPSIBLE badge to the freshly-
  // rendered profile: a clickable "N connections here" summary that expands to the
  // people. Confident matches are asserted; still-ambiguous ones are surfaced too
  // (so nobody silently goes missing) but clearly labelled "possible". Reads
  // localStorage by "<kind>:<id>" — no roster load, never throws.
  function decorateNet(kind, id) {
    try {
      const people = matchesFor(kind, id);
      const pend = pendingFor(kind, id);
      if ((!people.length && !pend.length) || !pfDetail.firstChild) return;
      const line = (p) => esc(p.name) + (p.position ? ` · ${esc(p.position)}` : "");
      const confHTML = people.length ? `<div class="wn-badge-people">${people.map(line).join("<br>")}</div>` : "";
      const pendHTML = pend.length
        ? `<div class="wn-badge-pending"><span class="wn-badge-plbl">Possible — confirm in Menu ▸ Network</span>${pend.map((p) => line(p) + (p.company ? ` <span class="wn-badge-co">(${esc(p.company)})</span>` : "")).join("<br>")}</div>`
        : "";
      const n = people.length;
      // Label mirrors the "Sources (n)" line: a count only when there's more than one.
      const label = n
        ? `LinkedIn connections${n > 1 ? ` (${n})` : ""}`
        : `Possible connections${pend.length > 1 ? ` (${pend.length})` : ""}`;
      const el = document.createElement("details");
      el.className = "wire-net wn-badge";
      el.innerHTML = `<summary class="wn-badge-h">${label}</summary><div class="wn-badge-body">${confHTML}${pendHTML}</div>`;
      // Sit the badge INSIDE the identity header, between the strategy chips and
      // the Sources line — not floating above the whole profile. Fall back to the
      // top of the detail host only if the header shape is unexpected.
      const host = pfDetail.querySelector(".tdet-id");
      const anchor = host && host.querySelector(":scope > .tdet-src-det, :scope > .tdet-src");
      if (anchor) anchor.parentNode.insertBefore(el, anchor);
      else if (host) host.appendChild(el);
      else pfDetail.prepend(el);
    } catch { /* the badge is optional — never block the profile */ }
  }

  // Hash router (Profiles owns /v2/profiles/#/…). No route → the list, honouring
  // ?tab=; a detail route renders the matching desk view in place.
  const dec = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
  function readTab() {
    const q = (location.hash || "").split("?")[1] || "";
    const t = new URLSearchParams(q).get("tab");
    return CHIPS.some(([k]) => k === t) ? t : "managers";
  }
  function router() {
    const raw = location.hash || "#/";
    const seg = raw.split("?")[0].replace(/^#/, "").split("/").filter(Boolean);
    const route = seg[0], arg = seg[1];
    switch (route) {
      case "manager": renderCredit("managers", () => viewManager(arg)); return decorateNet("manager", arg);
      case "fund": return renderCredit("managers", () => viewFund(arg));
      case "clo": return renderCredit("managers", () => viewClo(arg, seg[2] ? dec(seg[2]) : ""));
      case "lp": return renderCredit("managers", () => viewLp(arg));
      case "hf": renderCredit("hedgefunds", () => viewHedgeFund(arg)); return decorateNet("hf", arg);
      case "firm": renderLegal("firms", () => viewFirm(dec(arg))); return decorateNet("firm", dec(arg));
      case "item": return renderLegal("firms", () => viewItem(dec(arg)));
      default: return showList(readTab());
    }
  }
  // Only act on hash moves while Profiles is the active tab — other tabs drive
  // the same location.hash and must not trip this router (mirrors the desks).
  window.addEventListener("hashchange", () => { if (document.documentElement.dataset.v2tab === "profiles") router(); });

  // ---- activation (clicks AND touch taps) ----------------------------------
  // Navigate to a [data-href] row's target: an external/absolute href opens a
  // new tab, an internal hash route renders the profile in place NOW (not via
  // the hashchange event + active-tab guard, which can silently miss).
  const goRow = (row) => {
    const href = row.getAttribute("data-href");
    if (!href) return;
    if (row.dataset.ext === "1" || /^https?:/i.test(href)) { window.open(href, "_blank", "noopener"); return; }
    if (location.hash !== href) location.hash = href;
    router();
  };
  const goLink = (link) => {
    const h = link.getAttribute("href");
    if (location.hash !== h) location.hash = h;
    router();
  };

  // Chip taps switch the list pane. Row taps (list league rows AND the detail
  // views' .clickable rows) drive the hash router; a click on a cell's own link
  // (AUM source, 13F, SLS chip, breadcrumb) defers to that anchor. External /
  // absolute rows open in a new tab.
  host.addEventListener("click", (e) => {
    // Leading ‹ chevron in the persistent search row → close the profile and
    // return to the list it came from (the active tab).
    const back = e.target.closest(".pf-back-chev");
    if (back) {
      const on = chips.querySelector(".tchip.is-on");
      const h = "#/?tab=" + (on ? on.dataset.p : "managers");
      if (location.hash !== h) location.hash = h;
      router();
      return;
    }
    // A tab tap always lands on that list (closing any open profile).
    const chip = e.target.closest("#pf-chips .tchip");
    if (chip) {
      const h = "#/?tab=" + chip.dataset.p;
      if (location.hash !== h) location.hash = h;
      router();
      return;
    }
    // League $1–15bn AUM focus toggles + the hedge-fund Cross-holdings (13F
    // consensus) button. These live inside the borrowed panes, whose ids are
    // duplicated in the Credit desk — wire OUR copies here, scoped to this host.
    const focus = e.target.closest("#cr-hf-focus, #cr-lg-focus");
    if (focus) {
      if (host.classList.contains("pf-detailing")) exitDetail();   // filtering means you want the list
      const rowsSel = focus.id === "cr-hf-focus" ? "#hf-rows tr" : "#mgr-rows tr";
      const on = focus.getAttribute("aria-pressed") !== "true";
      focus.setAttribute("aria-pressed", on ? "true" : "false");
      focus.classList.toggle("is-on", on);
      host.querySelectorAll(rowsSel).forEach((tr) => { tr.style.display = (!on || tr.dataset.focus === "1") ? "" : "none"; });
      return;
    }
    const cons = e.target.closest("#hf-cons-btn");
    if (cons) { if (credit.loadConsensus) credit.loadConsensus(cons); return; }
    // Internal hash links inside Profiles — breadcrumbs, the Managers/Hedge Funds/
    // Law firms section chips, and the detail views' own sub-entity anchors (a
    // manager's funds/CLOs, a fund's manager, etc.). Route HERE, synchronously,
    // rather than leaving it to the anchor's native hashchange + the active-tab
    // guard, which can silently miss on some devices/timings.
    const link = e.target.closest('a[href^="#/"]');
    if (link) { e.preventDefault(); goLink(link); return; }
    const row = e.target.closest("[data-href]");
    if (!row || e.target.closest("a")) return;
    goRow(row);
  });

  // TOUCH TAP FALLBACK — the actual fix for "tapping a name does nothing" on
  // iPhone. iOS Safari only synthesises a `click` on a tap when the tapped
  // element (or an ancestor) is genuinely interactive — a link, a button, a
  // form control. Our league rows are plain <tr data-href> with plain <td> text
  // (cursor:pointer is NOT sufficient on iOS), so a tap fires NO click and the
  // delegated handler above never runs — while a long-press still offers the
  // text callout. Real <button>/<a> children (chips, source links) DO fire click
  // and stay on the path above; here we add the one thing iOS misses: a genuine
  // tap (finger didn't move → not a scroll) on a [data-href] row. preventDefault
  // suppresses the would-be ghost click and the text-selection callout.
  let tStart = null;
  host.addEventListener("touchstart", (e) => {
    const t = e.changedTouches && e.changedTouches[0];
    tStart = t ? { x: t.clientX, y: t.clientY } : null;
  }, { passive: true });
  host.addEventListener("touchend", (e) => {
    const start = tStart; tStart = null;
    const t = e.changedTouches && e.changedTouches[0];
    if (!start || !t) return;
    if (Math.abs(t.clientX - start.x) + Math.abs(t.clientY - start.y) > 12) return; // a scroll, not a tap
    if (e.target.closest("a")) return;                 // inner links keep native behaviour
    const row = e.target.closest("[data-href]");
    if (!row) return;                                  // buttons/links/inputs: leave to click
    e.preventDefault();
    goRow(row);
  }, { passive: false });
  // Each list's search box filters its rows in place by the row's data-name.
  // Scoped to this host so it never touches the desks' own (hidden) copies.
  host.addEventListener("input", (e) => {
    const inp = e.target.closest("#mgr-q, #hf-q, #lf-q"); if (!inp) return;
    if (host.classList.contains("pf-detailing")) exitDetail();   // typing a search returns to the list
    const sel = inp.id === "mgr-q" ? "#mgr-rows tr" : inp.id === "hf-q" ? "#hf-rows tr" : "#lf-rows tr";
    const v = inp.value.toLowerCase().trim();
    host.querySelectorAll(sel).forEach((tr) => { tr.style.display = (!v || (tr.dataset.name || "").includes(v)) ? "" : "none"; });
  });

  router();                                             // land on the list (or a deep-linked profile)
  // On re-entry, re-run the router (honours a deep link, else shows the list).
  // On leave, collapse any open detail back to the list so returning to Profiles
  // never flashes a stale profile before the router re-decides.
  return { enter: () => router(), leave() { showList(); } };
}
