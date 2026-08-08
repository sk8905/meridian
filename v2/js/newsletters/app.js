// =============================================================================
// v2/js/newsletters/app.js — the Newsletters tab: the reader's "reading" streams
// (email newsletters, curated Substacks, MailBrew) on the ONE shared feed engine
// (feed.js → createFeed). Distinct from Home's cross-desk news wire: this surface
// groups by SOURCE type, not topic. NEWSLETTERS is a static import; live Substack
// and Brew items arrive from /api/feed via onLiveWire. myFT is deliberately NOT
// here — it lives in the Home wire and the "/FT" palette filter, not this tab.
// mount(host, ctx) → {enter,leave}.
// =============================================================================
import { NEWSLETTERS } from "/newsletters.js";
import { createFeed, onLiveWire, dedupeByTitle } from "/feed.js?v=20260808-1";

export function mount(host, ctx) {
  host.innerHTML = `<div class="g-feed-wrap nl-wrap">
      <header class="g-feed-head" id="nl-head"></header>
      <div class="g-feed" id="nl-feed"></div>
    </div>`;

  // Live wire items (Substack / myFT / Brew) refresh in place via onLiveWire; the
  // controller rebuilds items on every paint, so the newest _live flows straight in.
  let _live = [];

  // Normalise a raw source item to the feed row shape the engine expects.
  const mk = (desk, href, title, source, date, time) =>
    ({ desk, href, title, ext: true, date, time: time || "", src: source || "" });

  function buildItems() {
    const out = [];
    // Reader's Gmail-swept email newsletters → LTR (desk "n"). On this surface they
    // group by their source type, so even a macro-topic issue stays a Newsletter.
    (NEWSLETTERS || []).forEach((n) => out.push(mk("n", n.url, n.title, n.author ? `${n.author} · ${n.publication}` : n.publication, n.date, n.time)));
    // Live streams: curated Substacks + MailBrew digest. myFT is intentionally
    // excluded from this tab (it stays in the Home wire + "/FT" palette filter).
    (_live || []).forEach((n) => {
      if (n.substack) out.push(mk("s", n.url, n.title, n.source, n.date, n.time));
      else if (n.brew) out.push(mk("b", n.url, n.title, n.source || "MailBrew", n.date, n.time));
    });
    return dedupeByTitle(out);
  }

  // headEl:null — we render our own single-select dropdown (below) rather than the
  // engine's chip row, matching the Home feed's filter.
  const feed = createFeed({
    feedEl: host.querySelector("#nl-feed"),
    buildItems,
    defaultDesk: "all",
    emptyLabel: (desk) => desk === "n" ? "No newsletters yet — the sweep runs hourly, 06:00–21:00."
      : desk === "s" ? "No Substack posts yet — check back shortly."
        : desk === "b" ? "No Brew digest yet — check back shortly."
          : "No reading yet — check back shortly.",
  });

  // Single-select desk dropdown (All / Newsletters / Substacks / Brew).
  const OPTS = [["all", "All reading"], ["n", "Newsletters"], ["s", "Substacks"], ["b", "Brew"]];
  const head = host.querySelector("#nl-head");
  if (head) {
    head.innerHTML = `<div class="g-feed-filterbar"><label class="g-feed-sel-lbl">Filter</label>`
      + `<select class="g-feed-sel" id="nl-desk-sel" aria-label="Filter reading by type">`
      + OPTS.map(([k, l]) => `<option value="${k}">${l}</option>`).join("")
      + `</select></div>`;
    const sel = host.querySelector("#nl-desk-sel");
    if (sel) sel.addEventListener("change", () => feed.setDesk(sel.value));
  }
  feed.render();

  // Live wire: repaint when /api/feed lands (adds Substack / Brew items).
  onLiveWire((items) => { _live = Array.isArray(items) ? items : []; feed.render(); });

  return { enter() {}, leave() {} };
}
