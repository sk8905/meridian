// =============================================================================
// v2/js/reader-overlay.js — EVERYTHING opens inside Wire (owner request 2026-10-15).
//
// Any external link anywhere in the app — a deal or alert source, a judgment, an SRC
// chip, a news row, a notification, a borrower-page record, a search result — opens in
// an in-app reader instead of a new browser tab. The reader fetches the page through the
// Worker's /api/read (the same extractor as the Home reading pane) and prints the text.
// Where a source CAN'T be read in the app — a subscriber paywall, a bot-walled publisher,
// a PDF / spreadsheet, or an extraction that comes back empty — the reader says so and
// gives the external link ("Open at <host> ↗"), which is the only link that leaves Wire.
//
// Not intercepted: the Home wire's own rows and reading pane (they already read
// in-pane), links marked data-ext (deliberately external — the reader's own "Open
// original"), modifier / middle clicks (the user asked for a new tab), mailto/tel, and
// same-origin links. Phone: full-screen sheet; desktop: a right-hand panel. Back (or
// Esc, or the ‹ button) closes it — it is one history entry.
//   initReaderOverlay();  window.__wireRead(url, { title, src })
// =============================================================================
import { esc } from "/util.js";
import { isPaywalledSrc, linksOutSrc, unreadableFile } from "./read-policy.js";

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
let ov = null, seq = 0, openUrl = "";

function ensure() {
  if (ov) return ov;
  ov = document.createElement("div");
  ov.id = "wire-reader"; ov.className = "wr"; ov.hidden = true;
  ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Reader");
  ov.innerHTML = `<div class="wr-scrim" data-wr-close></div><section class="wr-panel">
      <header class="wr-head"><button type="button" class="wr-back" data-wr-close aria-label="Close reader">‹</button><span class="wr-src"></span><a class="wr-out" data-ext="1" target="_blank" rel="noopener noreferrer">Open original ↗</a></header>
      <div class="wr-body"></div></section>`;
  document.body.appendChild(ov);
  ov.addEventListener("click", (e) => { if (e.target.closest("[data-wr-close]")) { e.preventDefault(); close(true); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !ov.hidden) close(true); });
  window.addEventListener("popstate", () => { if (!ov.hidden) close(false); });
  return ov;
}

function bodyFrom(d) {
  const blocks = Array.isArray(d.blocks) && d.blocks.length ? d.blocks : (d.paragraphs || []).map((t) => ({ t }));
  return blocks.map((b) => {
    if (!b) return "";
    if (b.img) return `<figure class="wr-fig"><img src="${esc(b.img)}" alt="${esc(b.alt || "")}" loading="lazy" referrerpolicy="no-referrer">${b.alt ? `<figcaption>${esc(b.alt)}</figcaption>` : ""}</figure>`;
    if (b.h) return `<h3 class="wr-h">${esc(b.t)}</h3>`;
    if (b.html) return `<p class="wr-p">${b.html}</p>`;   // server-sanitised: <a href> only
    return `<p class="wr-p">${esc(b.t != null ? b.t : String(b))}</p>`;
  }).join("");
}

function shell({ title, src, url, note, body, meta }) {
  return `<article class="wr-art">`
    + (src ? `<div class="wr-kicker">${esc(src)}</div>` : "")
    + `<h1 class="wr-title">${esc(title || host(url) || "Source")}</h1>`
    + (meta ? `<div class="wr-meta">${meta}</div>` : "")
    + (note ? `<div class="wr-note">${note}</div>` : "")
    + (body || "")
    + `<a class="wr-open" data-ext="1" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Open at ${esc(host(url) || "source")} ↗</a>`
    + `</article>`;
}

export function openReader(url, o = {}) {
  ensure();
  const title = (o.title || "").trim(), src = o.src || host(url);
  const wasOpen = !ov.hidden;
  ov.hidden = false; openUrl = url;
  document.documentElement.classList.add("wr-open");
  ov.querySelector(".wr-src").textContent = host(url);
  const out = ov.querySelector(".wr-out"); out.href = url;
  const box = ov.querySelector(".wr-body"); box.scrollTop = 0;
  if (!wasOpen) { try { history.pushState({ ...(history.state || {}), wireReader: url }, "", location.href); } catch { /* ignore */ } }
  const my = ++seq;
  if (isPaywalledSrc(src, url) || linksOutSrc(src, url) || unreadableFile(url)) {
    const why = isPaywalledSrc(src, url) ? "This source needs a subscriber login, so it can't be read inside Wire."
      : unreadableFile(url) ? "This is a document file (PDF / spreadsheet) that Wire can't display — open it at the source."
      : "This publisher blocks in-app reading.";
    box.innerHTML = shell({ title, src, url, note: why });
    return;
  }
  box.innerHTML = shell({ title, src, url, note: `<span class="wr-loading">Loading the text inside Wire…</span>` });
  const ac = typeof AbortController === "function" ? new AbortController() : null;
  const t = setTimeout(() => ac && ac.abort(), 40000);
  fetch(`/api/read?url=${encodeURIComponent(url)}`, { headers: { accept: "application/json" }, cache: "no-store", signal: ac ? ac.signal : undefined })
    .then((r) => (r.ok ? r.json() : null)).catch(() => null)
    .then((d) => {
      clearTimeout(t);
      if (my !== seq || ov.hidden) return;
      if (d && d.accessible && ((Array.isArray(d.blocks) && d.blocks.length) || (Array.isArray(d.paragraphs) && d.paragraphs.length))) {
        const meta = [d.byline, d.date ? String(d.date).slice(0, 10) : ""].filter(Boolean).map(esc).join(" · ");
        box.innerHTML = shell({ title: d.title || title, src, url, meta, body: bodyFrom(d) });
      } else {
        box.innerHTML = shell({ title, src, url, note: "The full text isn't available inside Wire for this page." + (d && d.reason ? ` <span class="wr-diag">(${esc(d.reason)})</span>` : "") });
      }
    });
}

function close(viaUi) {
  if (!ov || ov.hidden) return;
  ov.hidden = true; seq++; openUrl = "";
  document.documentElement.classList.remove("wr-open");
  if (viaUi && history.state && history.state.wireReader) { try { history.back(); } catch { /* ignore */ } }
}

// Should this click open in the reader?
function readable(a, e) {
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  const href = a.getAttribute("href") || "";
  if (!/^https?:\/\//i.test(href) || a.hasAttribute("download") || a.dataset.ext === "1") return false;
  try { if (new URL(href).origin === location.origin) return false; } catch { return false; }
  // The Home wire reads its own rows in-pane — except, on a phone, a subscriber-padlocked
  // row, which used to jump straight to the publisher: that now opens here too, with the
  // reason and the external link.
  if (a.closest("#g-readpane, #g-reader, .g-read-art")) return false;
  if (a.closest(".g-feed-row")) {
    if (e.target.closest(".g-feed-src, [role=button]")) return false;   // the source chip filters the wire
    const phone = window.matchMedia && window.matchMedia("(max-width:760px)").matches;
    const src = (a.querySelector(".g-feed-src") || {}).textContent || "";
    return !!phone && isPaywalledSrc(src, href);   // bot-walled rows already open Home's own reader
  }
  return true;
}

export function initReaderOverlay() {
  if (window.__wireRead) return;
  window.__wireRead = (url, o) => openReader(url, o);
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!readable(a, e)) return;
    // Inside the reader itself, an in-article link reads in place (still in Wire).
    e.preventDefault(); e.stopPropagation();
    const row = a.closest("li, tr, .dsh-kv, .tw-row");
    const t = (a.textContent || "").trim();
    const title = t.length > 12 && !/^(src|source|announcement|terms source|open|view)$/i.test(t) ? t
      : ((row && (row.querySelector(".tmini-t, .tw-head, .dsh-nm, .dsh-kv-k, a") || {}).textContent) || "").trim();
    openReader(a.href, { title });
  }, true);
}
