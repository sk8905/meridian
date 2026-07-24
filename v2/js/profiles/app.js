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
} from "/v2/js/credit/detail.js?v=v2-11";
import {
  viewFirm, viewItem,
  __setHost as setLegalHost, __setProfilesMode as setLegalPfMode,
} from "/v2/js/legal/detail.js?v=v2-7";

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
          </div>
        </section>
      </div>
    </div>
    <div id="pf-detail" hidden></div>`;
  const pfList = host.querySelector("#pf-list");
  const pfDetail = host.querySelector("#pf-detail");
  const panes = host.querySelector("#pf-panes");
  const chips = host.querySelector("#pf-chips");

  // ---- list <-> detail plumbing -------------------------------------------
  const showPane = (p) => panes.querySelectorAll(".tpane").forEach((el) => { el.hidden = el.dataset.pane !== p; });
  const selectChip = (p) => {
    chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c.dataset.p === p));
    showPane(p);
  };
  function showList(tab) {
    pfDetail.hidden = true; pfDetail.innerHTML = "";
    pfList.hidden = false;
    if (tab) selectChip(tab);
    window.scrollTo(0, 0);
  }
  // Render a desk detail view into the Profiles-owned host. Point the shared
  // detail host at #pf-detail and flip that module into Profiles mode (so its
  // top nav is the Profiles chips, not the desk sections) right before the
  // synchronous render — only one tab renders at a time, so the last writer wins.
  const renderCredit = (fn) => { pfList.hidden = true; pfDetail.hidden = false; setCreditHost(pfDetail); setCreditPfMode(true); window.scrollTo(0, 0); fn(); };
  const renderLegal = (fn) => { pfList.hidden = true; pfDetail.hidden = false; setLegalHost(pfDetail); setLegalPfMode(true); window.scrollTo(0, 0); fn(); };

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
      case "manager": return renderCredit(() => viewManager(arg));
      case "fund": return renderCredit(() => viewFund(arg));
      case "clo": return renderCredit(() => viewClo(arg, seg[2] ? dec(seg[2]) : ""));
      case "lp": return renderCredit(() => viewLp(arg));
      case "hf": return renderCredit(() => viewHedgeFund(arg));
      case "firm": return renderLegal(() => viewFirm(dec(arg)));
      case "item": return renderLegal(() => viewItem(dec(arg)));
      default: return showList(readTab());
    }
  }
  // Only act on hash moves while Profiles is the active tab — other tabs drive
  // the same location.hash and must not trip this router (mirrors the desks).
  window.addEventListener("hashchange", () => { if (document.documentElement.dataset.v2tab === "profiles") router(); });

  // ---- clicks --------------------------------------------------------------
  // Chip taps switch the list pane. Row taps (list league rows AND the detail
  // views' .clickable rows) drive the hash router; a click on a cell's own link
  // (AUM source, 13F, SLS chip, breadcrumb) defers to that anchor. External /
  // absolute rows open in a new tab.
  host.addEventListener("click", (e) => {
    const chip = e.target.closest("#pf-chips .tchip");
    if (chip) { selectChip(chip.dataset.p); return; }
    // League $1–10bn AUM focus toggles + the hedge-fund Cross-holdings (13F
    // consensus) button. These live inside the borrowed panes, whose ids are
    // duplicated in the Credit desk — wire OUR copies here, scoped to this host.
    const focus = e.target.closest("#cr-hf-focus, #cr-lg-focus");
    if (focus) {
      const rowsSel = focus.id === "cr-hf-focus" ? "#hf-rows tr" : "#mgr-rows tr";
      const on = focus.getAttribute("aria-pressed") !== "true";
      focus.setAttribute("aria-pressed", on ? "true" : "false");
      focus.classList.toggle("is-on", on);
      host.querySelectorAll(rowsSel).forEach((tr) => { tr.style.display = (!on || tr.dataset.focus === "1") ? "" : "none"; });
      return;
    }
    const cons = e.target.closest("#hf-cons-btn");
    if (cons) { if (credit.loadConsensus) credit.loadConsensus(cons); return; }
    const row = e.target.closest("[data-href]");
    if (!row || e.target.closest("a")) return;
    const href = row.getAttribute("data-href");
    if (row.dataset.ext === "1" || /^https?:/i.test(href)) { window.open(href, "_blank", "noopener"); return; }
    if (location.hash === href) router(); else location.hash = href;   // internal → router
  });
  // Each list's search box filters its rows in place by the row's data-name.
  // Scoped to this host so it never touches the desks' own (hidden) copies.
  host.addEventListener("input", (e) => {
    const inp = e.target.closest("#mgr-q, #hf-q, #lf-q"); if (!inp) return;
    const sel = inp.id === "mgr-q" ? "#mgr-rows tr" : inp.id === "hf-q" ? "#hf-rows tr" : "#lf-rows tr";
    const v = inp.value.toLowerCase().trim();
    host.querySelectorAll(sel).forEach((tr) => { tr.style.display = (!v || (tr.dataset.name || "").includes(v)) ? "" : "none"; });
  });

  router();                                             // land on the list (or a deep-linked profile)
  return { enter: () => router(), leave() {} };
}
