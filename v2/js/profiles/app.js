// Profiles — a cross-desk directory AND the home of every entity profile. It
// renders the EXACT same three lists that used to live under Credit (Managers,
// Hedge Funds) and Legal (Law firms) by borrowing those apps' own pane builders
// (one source per list, no second version), and — crucially — it now HOSTS the
// profile detail pages itself. Tapping a row no longer bounces you into the
// retired Credit/Legal desk tab: the manager / hedge-fund / law-firm page (and
// everything it links to — funds, CLOs, investors, filings) renders right here,
// inside Profiles, with a Managers · Hedge Funds · Investors · Law firms nav that
// returns to the list. The detail views are the desks' own view functions, at a
// Profiles-owned host per render (see __setProfilesMode in the detail modules).

import {
  viewManager, viewClo, viewLp, viewHedgeFund, fundManagerId,
  __setHost as setCreditHost, __setProfilesMode as setCreditPfMode,
} from "/v2/js/credit/detail.js";
import {
  viewFirm, viewItem,
  __setHost as setLegalHost, __setProfilesMode as setLegalPfMode,
} from "/v2/js/legal/detail.js";
// Same shared.js instance the detail views read (same tokenless import), so seeding
// the URL-driven row highlight here is the pending focus viewManager applies.
import { setPendingFocus, isFollowed } from "/credit/js/shared.js";
import { esc } from "/util.js";
// The LinkedIn-connections importer was retired (monitoring-only app); clear any
// connections a previous version left on this device.
try { localStorage.removeItem("wire.li.v1"); } catch { /* ignore */ }

export async function mount(host, ctx) {
  // Borrow Credit's and Legal's list builders (mounts them off-screen if needed).
  const [credit, legal] = await Promise.all([ctx.view("credit"), ctx.view("legal")]);
  const CHIPS = [["managers", "Managers"], ["hedgefunds", "Hedge Funds"], ["investors", "Investors"], ["firms", "Law firms"]];
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
            ${credit.buildInvestors()}
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
  // The OFR Hedge Fund Monitor is collapsed on open — it loads lazily when the
  // "Monitor" toggle in the Hedge Funds header is first opened (wired below).

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
    // "★ Following" — narrows the list to the entities on your watchlist.
    const f = document.createElement("button");
    f.type = "button";
    f.className = "tfocus-btn pf-follow-btn";
    f.setAttribute("aria-pressed", "false");
    f.title = "Show only the names you follow";
    f.textContent = "★ Following";
    const inp = h.querySelector(".tsearch");
    if (inp && inp.nextSibling) h.insertBefore(f, inp.nextSibling); else h.appendChild(f);
  });
  // ONE row filter per list — the search text, the $1–15bn AUM focus and Following
  // combine (each used to overwrite the others' result).
  const ROWSEL = { managers: "#mgr-rows tr", hedgefunds: "#hf-rows tr", investors: "#lp-rows tr", firms: "#lf-rows tr" };
  const FTYPE = { manager: "manager", hf: "hf", lp: "lp", firm: "firm" };
  const dec0 = (x) => { try { return decodeURIComponent(x); } catch { return x; } };
  function filterList(pane) {
    if (!pane) return;
    const key = pane.dataset.pane, sel = ROWSEL[key]; if (!sel) return;
    const q = ((pane.querySelector(".tsearch") || {}).value || "").toLowerCase().trim();
    const fb = pane.querySelector("#cr-lg-focus, #cr-hf-focus");
    const focus = !!fb && fb.getAttribute("aria-pressed") === "true";
    const fol = (pane.querySelector(".pf-follow-btn") || {}).getAttribute?.("aria-pressed") === "true";
    host.querySelectorAll(sel).forEach((tr) => {
      const [, type, id] = (tr.getAttribute("data-href") || "").match(/^#\/(\w+)\/(.+)$/) || [];
      const ok = (!q || (tr.dataset.name || "").includes(q))
        && (!focus || tr.dataset.focus === "1")
        && (!fol || (FTYPE[type] && isFollowed(FTYPE[type], dec0(id))));
      tr.style.display = ok ? "" : "none";
    });
  }

  // Sortable columns: tap a list header to sort by it (again to reverse). Money cells
  // ("€1.2tn", "$227.60bn", "€600m") sort by value; "—" / "n/a" always sort last.
  const cellVal = (td) => {
    const t = (td ? td.textContent : "").trim();
    if (!t || /^(—|n\/a|-)$/i.test(t)) return null;
    const m = t.match(/^[~≈]?\s*[€$£]?\s*(-?[\d,.]+)\s*(tn|bn|m|k|%)?/i);
    if (m) { let v = parseFloat(m[1].replace(/,/g, "")); const u = (m[2] || "").toLowerCase(); if (u === "tn") v *= 1000; else if (u === "m") v /= 1000; else if (u === "k") v /= 1e6; if (isFinite(v)) return v; }
    return t.toLowerCase();
  };
  panes.querySelectorAll(".tleague thead th").forEach((th) => { th.classList.add("pf-sortable"); th.setAttribute("tabindex", "0"); th.setAttribute("aria-sort", "none"); });
  function sortBy(th) {
    const table = th.closest("table"), tb = table && table.tBodies[0]; if (!tb) return;
    const i = [...th.parentNode.children].indexOf(th);
    const dir = th.getAttribute("aria-sort") === "descending" ? "ascending" : "descending";
    th.parentNode.querySelectorAll("th").forEach((h) => h.setAttribute("aria-sort", "none"));
    th.setAttribute("aria-sort", dir);
    const rowsArr = [...tb.rows];
    const k = (tr) => cellVal(tr.cells[i]);
    rowsArr.sort((a, b) => {
      const x = k(a), y = k(b);
      if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
      const c = (typeof x === "number" && typeof y === "number") ? x - y : String(x).localeCompare(String(y));
      return dir === "ascending" ? c : -c;
    });
    rowsArr.forEach((r) => tb.appendChild(r));
  }
  panes.addEventListener("keydown", (e) => { const th = e.target.closest && e.target.closest("th.pf-sortable"); if (th && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); sortBy(th); } });

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
  // Scroll memory per list tab: opening a profile records where the list was, and
  // returning to that list (Back, the ‹ chevron, the tab chip) puts the reader back on
  // the same row. Desktop scrolls inside the view section (fixed-viewport terminal);
  // the phone scrolls the window.
  const _listY = {};
  const scroller = () => (host.scrollHeight > host.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(host).overflowY)) ? host : null;
  const getY = () => { const s = scroller(); return s ? s.scrollTop : window.scrollY; };
  const setY = (y) => { const s = scroller(); if (s) s.scrollTo({ top: y, behavior: "instant" }); else window.scrollTo({ top: y, behavior: "instant" }); };
  const activeTab = () => { const on = chips.querySelector(".tchip.is-on"); return on ? on.dataset.p : "managers"; };
  const rememberList = () => { if (!host.classList.contains("pf-detailing") && !pfList.hidden) _listY[activeTab()] = getY(); };
  function showList(tab) {
    exitDetail();
    pfList.hidden = false;
    if (tab) selectChip(tab);
    const y = _listY[activeTab()] || 0;
    setY(y);
    if (y) requestAnimationFrame(() => setY(y));   // re-apply once the table has re-laid out
  }
  // Render a desk detail view into the Profiles-owned host. The list stays
  // mounted (only its table is hidden by .pf-detailing); point the shared detail
  // host at #pf-detail and flip Profiles mode on right before the synchronous
  // render. selectChip(p) first, so the persistent frame above the profile is the
  // RIGHT list (its search box + AUM focus), and the active tab highlights.
  // On desktop the identity header is sticky; the section-tab rail sticks just
  // BELOW it — so the list scrolls under a fixed header + tabs. Publish the header's
  // live height as --pf-head-h so the tabs' sticky offset tracks it (it changes when
  // the Peers/Sources dropdowns expand). One ResizeObserver, reused across renders.
  let _headRO = null;
  const activeSearch = () => [...panes.querySelectorAll(".tpane")].map((p) => (p.hidden ? null : p.querySelector(".thead-search"))).find(Boolean) || null;
  const publishHeights = () => {
    const id = pfDetail.querySelector(".tdet-id");
    const sb = activeSearch();
    pfDetail.style.setProperty("--pf-search-h", (sb ? sb.offsetHeight : 0) + "px");
    if (id) pfDetail.style.setProperty("--pf-head-h", id.offsetHeight + "px");
    else pfDetail.style.removeProperty("--pf-head-h");
  };
  const syncHeadH = () => {
    const id = pfDetail.querySelector(".tdet-id");
    if (!id) { pfDetail.style.removeProperty("--pf-head-h"); pfDetail.style.removeProperty("--pf-search-h"); return; }
    publishHeights();
    if (typeof ResizeObserver === "function") {
      if (!_headRO) _headRO = new ResizeObserver(() => publishHeights());
      _headRO.disconnect(); _headRO.observe(id);
      const sb = activeSearch(); if (sb) _headRO.observe(sb);
    }
  };
  const renderCredit = (p, fn) => { rememberList(); selectChip(p); setDetailing(true); pfList.hidden = false; pfDetail.hidden = false; setCreditHost(pfDetail); setCreditPfMode(true); setY(0); fn(); syncHeadH(); };
  const renderLegal = (p, fn) => { rememberList(); selectChip(p); setDetailing(true); pfList.hidden = false; pfDetail.hidden = false; setLegalHost(pfDetail); setLegalPfMode(true); setY(0); fn(); syncHeadH(); };

  // Hash router (Profiles owns /v2/profiles/#/…). No route → the list, honouring
  // ?tab=; a detail route renders the matching desk view in place.
  const dec = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
  function readTab() {
    // ?tab= inside the hash (#/?tab=…) is the canonical form; a plain query string
    // (/v2/profiles/?tab=…, e.g. a pasted link) is honoured too.
    const q = (location.hash || "").split("?")[1] || "";
    const t = new URLSearchParams(q).get("tab") || new URLSearchParams(location.search).get("tab");
    return CHIPS.some(([k]) => k === t) ? t : "managers";
  }
  function router() {
    const raw = location.hash || "#/";
    const seg = raw.split("?")[0].replace(/^#/, "").split("/").filter(Boolean);
    const route = seg[0], arg = seg[1];
    // URL-driven row highlight (?focus=…) — same contract as the desks: a search
    // result or a saved/watchlist row can deep-link to a manager's specific news
    // story. Seed the pending focus BEFORE rendering (viewManager applies it), then
    // drop the param so later re-renders don't keep re-scrolling. "k:" targets a
    // row by its feed dedup key; otherwise by element id.
    const q = raw.split("?")[1] || "";
    const focusId = q ? new URLSearchParams(q).get("focus") : null;
    if (focusId) {
      setPendingFocus(focusId.startsWith("k:")
        ? { view: route, fkey: dec(focusId.slice(2)), until: Date.now() + 4000 }
        : { view: route, id: focusId, until: Date.now() + 4000 });
      try { history.replaceState(null, "", location.pathname + location.search + raw.split("?")[0]); } catch { /* keep the param if replaceState is blocked */ }
    }
    switch (route) {
      case "manager": renderCredit("managers", () => viewManager(arg, seg[2])); return;
      // The standalone fund page is retired — redirect to the fund's manager so no
      // link (search, peer lists, connections, feed items) can reach a dead page.
      case "fund": {
        const mid = fundManagerId(arg);
        if (!mid) return showList("managers");
        const mh = `#/manager/${encodeURIComponent(mid)}`;
        try { history.replaceState(null, "", location.pathname + location.search + mh); } catch { location.hash = mh; }
        renderCredit("managers", () => viewManager(mid)); return;
      }
      case "clo": return renderCredit("managers", () => viewClo(arg, seg[2] ? dec(seg[2]) : ""));
      case "lp": return renderCredit("investors", () => viewLp(arg));
      case "hf": renderCredit("hedgefunds", () => viewHedgeFund(arg, seg[2])); return;
      case "firm": renderLegal("firms", () => viewFirm(dec(arg), seg[2])); return;
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
      rememberList();
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
      const on = focus.getAttribute("aria-pressed") !== "true";
      focus.setAttribute("aria-pressed", on ? "true" : "false");
      focus.classList.toggle("is-on", on);
      filterList(focus.closest(".tpane"));
      return;
    }
    const fol = e.target.closest(".pf-follow-btn");
    if (fol) {
      if (host.classList.contains("pf-detailing")) exitDetail();
      const on = fol.getAttribute("aria-pressed") !== "true";
      fol.setAttribute("aria-pressed", on ? "true" : "false");
      fol.classList.toggle("is-on", on);
      filterList(fol.closest(".tpane"));
      return;
    }
    const sth = e.target.closest("#pf-panes th.pf-sortable");
    if (sth) { sortBy(sth); return; }
    const cons = e.target.closest("#hf-cons-btn");
    if (cons) { if (credit.loadConsensus) credit.loadConsensus(cons); return; }
    // Hedge fund monitor — collapsed by default, revealed by the header "Monitor"
    // toggle. Lazy-loads the OFR feed on first open; the ✕ in the panel (or a
    // second tap) collapses it again. Scoped to this host (duplicate ids on the
    // retired Credit desk).
    const mon = e.target.closest("#hf-mon-btn");
    if (mon) {
      if (host.classList.contains("pf-detailing")) exitDetail();   // show the list + monitor
      const ofr = host.querySelector("#hf-ofr");
      const on = mon.getAttribute("aria-pressed") !== "true";
      mon.setAttribute("aria-pressed", on ? "true" : "false");
      mon.classList.toggle("is-on", on);
      if (ofr) {
        ofr.hidden = !on;
        if (on) {
          const tiles = ofr.querySelector("#hf-ofr-tiles");
          if (tiles && !ofr.dataset.loaded && !tiles.children.length) tiles.innerHTML = `<div class="hf-ofr-note muted small">Loading monitor…</div>`;
          if (credit.loadHfm) credit.loadHfm(host);
        }
      }
      return;
    }
    const ofrx = e.target.closest(".hf-ofr-x");
    if (ofrx) {
      const ofr = host.querySelector("#hf-ofr");
      const mb = host.querySelector("#hf-mon-btn");
      if (ofr) ofr.hidden = true;
      if (mb) { mb.setAttribute("aria-pressed", "false"); mb.classList.remove("is-on"); }
      return;
    }
    // Watchlist star (☆/★) — Profiles HOSTS the profile pages, so the follow
    // toggle must be wired HERE too (the retired Credit desk's own handler is not
    // loaded). Reuse Credit's single toggle (local persist + debounced cloud PUT
    // to /api/watchlist, which the refresh routine reads for deep-research), then
    // flip the button in place so the tap doesn't scroll-jump the profile.
    const fav = e.target.closest("[data-follow]");
    if (fav) {
      e.preventDefault(); e.stopPropagation();
      const [type, id] = (fav.getAttribute("data-follow") || "").split(":");
      if (type && id && credit.toggleFollow) {
        const on = credit.toggleFollow(type, id);
        fav.classList.toggle("on", on);
        fav.textContent = on ? "★" : "☆";
        fav.setAttribute("title", on ? "Following — click to remove from watchlist" : "Add to your watchlist");
      }
      return;
    }
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
    if (!row) return;                                  // buttons/links/inputs (incl. the watchlist star): leave to click
    e.preventDefault();
    goRow(row);
  }, { passive: false });
  // Each list's search box filters its rows in place by the row's data-name.
  // Scoped to this host so it never touches the desks' own (hidden) copies.
  host.addEventListener("input", (e) => {
    const inp = e.target.closest("#mgr-q, #hf-q, #lp-q, #lf-q"); if (!inp) return;
    if (host.classList.contains("pf-detailing")) exitDetail();   // typing a search returns to the list
    filterList(inp.closest(".tpane"));
  });

  router();                                             // land on the list (or a deep-linked profile)
  // On re-entry at a different route, re-run the router (the runtime only calls
  // enter() when the URL differs from the one Profiles was left on). Leaving keeps
  // the open profile/list exactly as it was, so switching tabs and coming back — or
  // Back from another section — returns to the same place.
  return {
    enter: () => router(),
    leave() { rememberList(); },
    // home(): a nav-bar tap resets Profiles to its first part — the Managers list
    // (closing any open profile, first category tab, scrolled to top).
    home() { Object.keys(_listY).forEach((k) => delete _listY[k]); showList("managers"); },
  };
}
