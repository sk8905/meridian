// =============================================================================
// v2/js/preview.js — THE "first 10 + See all N ›" preview, app-wide (owner 2026-10-16,
// HOUSE_STYLE R44l). Every list INSIDE a card or section — a Dashboard card, a profile /
// borrower page section, a Deals sub-section — shows its first 10 rows and a
// "See all N ›" button; the button opens the whole list in one full-screen sheet (a
// centred panel on desktop) with a search box. Lists that ARE the page (the News wire,
// the Deals list, the Profiles directory, People, a profile tab whose whole content is
// one list, Menu pages) are not cards and scroll in full.
//
// One implementation: previewList() marks rows past the 10th hidden and appends the
// button; one delegated click handler opens the sheet. A surface passes its own
// itemsOf(body) when its rows are not the plain longest <ul>/<tbody> (the Dashboard's
// stacked phone rows); the button remembers it.
// =============================================================================
import { esc } from "/util.js";

export const PREVIEW = 10;

// Hidden rows carry .dsh-pv-hide AND an inline display:none — row layouts such as
// `.dsh-rx .dsh-news-i { display:grid }` would otherwise out-rank a class rule.
export const pvHide = (e) => { e.classList.add("dsh-pv-hide"); e.style.display = "none"; };
export const pvShow = (e) => { e.classList.remove("dsh-pv-hide"); e.style.removeProperty("display"); };

// The rows of a section: its LONGEST list — <tbody> rows or <ul>/<ol> items — so a card
// holding a 4-row summary table and a long list previews the long one.
export function defaultItems(body) {
  const cands = [...body.querySelectorAll("tbody")].map((t) => [...t.children].filter((r) => r.tagName === "TR"));
  for (const l of body.querySelectorAll("ul, ol")) cands.push([...l.children].filter((c) => c.tagName === "LI"));
  return cands.sort((a, b) => b.length - a.length)[0] || [];
}

const _itemsOf = new WeakMap();   // section body → its row finder (for the sheet's count + search)

export function previewList(body, itemsOf = defaultItems) {
  if (!body) return;
  _itemsOf.set(body, itemsOf);
  body.querySelectorAll(".dsh-pv-hide").forEach(pvShow);
  body.querySelectorAll(":scope > .dsh-seeall[data-pv]").forEach((e) => e.remove());
  if (body.querySelector(".dsh-chart")) return;   // a chart card is not a list
  const items = itemsOf(body); if (items.length <= PREVIEW) return;
  items.slice(PREVIEW).forEach(pvHide);
  // A sub-heading (e.g. an earnings week) left with nothing visible after it hides too.
  body.querySelectorAll(".dsh-earn-wk, .pv-sub").forEach((h) => { if (items[PREVIEW].compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING) pvHide(h); });
  body.insertAdjacentHTML("beforeend", `<button type="button" class="dsh-seeall" data-pv="1">See all ${items.length} <span aria-hidden="true">›</span></button>`);
}

// Preview every section matching `sel` under `root`.
export const previewAll = (root, sel, itemsOf) => { if (root) root.querySelectorAll(sel).forEach((b) => previewList(b, itemsOf)); };

let _closeSheet = null;
// openSheet(body): the whole list, cloned, with a search bar.
// openSheet(null, { move: el, onClose }): a live, interactive block (a roster with its
// own search / sort / rows) is MOVED into the sheet and put back on close.
export function openSheet(body, { move = null, onClose = null, itemsOf = null } = {}) {
  if (_closeSheet) _closeSheet();
  const src = move || body;
  const rows = itemsOf || (body && _itemsOf.get(body)) || defaultItems;
  const card = src.closest(".dsh-card, .tpg, .pv-card, section");
  // The title text alone (.dsh-h-t), never the header's badges — so try in order.
  const head = card && [".dsh-h-t", ".dsh-h", ".tpg-h", "h3", "h2"].map((s) => card.querySelector(s)).find(Boolean);
  // …and without its count badge (the sheet adds its own "(N)").
  const hc = head ? head.cloneNode(true) : null;
  if (hc) hc.querySelectorAll(".tveh-grp-n, .dsh-n").forEach((e) => e.remove());
  const title = hc ? (hc.textContent || "").replace(/\s+/g, " ").trim() : "";
  let clone, home = null;
  if (move) {
    home = document.createComment("dsh-sheet-home"); move.parentNode.insertBefore(home, move);
    clone = document.createElement("div"); clone.className = "dsh-sheet-body"; clone.appendChild(move);
  } else {
    clone = body.cloneNode(true);
    clone.className = "dsh-sheet-body"; clone.removeAttribute("id"); clone.removeAttribute("style");
    clone.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
    clone.querySelectorAll(":scope > .dsh-h, :scope > .tpg-h").forEach((e) => e.remove());
    clone.querySelectorAll(".dsh-pv-hide").forEach(pvShow);
    clone.querySelectorAll(".dsh-seeall").forEach((e) => e.remove());
  }
  const n = move ? null : rows(clone).length;
  const sh = document.createElement("div");
  // Mounted on <body> (above the app's tab bar), carrying .dsh so card styles apply.
  sh.className = "dsh dsh-sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true"); sh.setAttribute("aria-label", title);
  sh.innerHTML = `<div class="dsh-sheet-hd"><span class="dsh-sheet-t">${esc(title)}${n != null ? ` <span class="dsh-n">(${n})</span>` : ""}</span><button type="button" class="dsh-sheet-x" aria-label="Close">✕</button></div>`
    + (move ? "" : `<div class="dsh-sheet-f"><input type="search" class="dsh-sheet-q" placeholder="Search this list" aria-label="Search this list" autocomplete="off"></div>`);
  sh.appendChild(clone);
  document.body.appendChild(sh);
  document.documentElement.classList.add("dsh-sheet-open");
  const onKey = (e) => { if (e.key === "Escape") close(); };
  const close = () => {
    if (move && home && home.parentNode) { home.parentNode.insertBefore(move, home); home.remove(); }
    sh.remove(); document.documentElement.classList.remove("dsh-sheet-open"); document.removeEventListener("keydown", onKey); _closeSheet = null;
    if (onClose) onClose();
  };
  document.addEventListener("keydown", onKey);
  sh.querySelector(".dsh-sheet-x").addEventListener("click", close);
  sh.addEventListener("click", (e) => { if (e.target.closest("a[href]")) close(); });
  const q = sh.querySelector(".dsh-sheet-q");
  if (q) q.addEventListener("input", () => { const v = q.value.trim().toLowerCase(); rows(clone).forEach((it) => { it.style.display = !v || it.textContent.toLowerCase().includes(v) ? "" : "none"; }); });
  _closeSheet = close;
}
export const closeSheet = () => { if (_closeSheet) _closeSheet(); };

// ONE delegated handler for every preview button in the app.
if (typeof document !== "undefined" && !document.documentElement.dataset.pvBound) {
  document.documentElement.dataset.pvBound = "1";
  document.addEventListener("click", (e) => {
    const more = e.target.closest(".dsh-seeall[data-pv]");
    if (!more) return;
    e.preventDefault();
    openSheet(more.parentElement);
  });
}
