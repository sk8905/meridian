// =============================================================================
// v2/js/newsletters/app.js — the Newsletters tab: the reader's "reading" streams
// (email newsletters, myFT, curated Substacks, MailBrew) on the ONE shared feed
// engine (feed.js → createFeed). Distinct from Home's cross-desk news wire: this
// surface groups by SOURCE type, not topic. Curated newsletters (NEWSLETTERS)
// and myFT backfill (FT_ITEMS) are static imports; live Substack / myFT / Brew
// items arrive from /api/feed via onLiveWire. mount(host, ctx) → {enter,leave}.
// =============================================================================
import { NEWSLETTERS } from "/newsletters.js";
import { FT_ITEMS } from "/ft.js";
import { createFeed, onLiveWire, dedupeByTitle } from "/feed.js?v=20260724-2";

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
    // myFT (followed-topics) backfill → desk "f".
    (FT_ITEMS || []).forEach((n) => out.push(mk("f", n.url, n.title, "Financial Times", n.date, n.time)));
    // Live streams: myFT (~5 min of publication), curated Substacks, MailBrew digest.
    (_live || []).forEach((n) => {
      if (n.myft) out.push(mk("f", n.url, n.title, "Financial Times", n.date, n.time));
      else if (n.substack) out.push(mk("s", n.url, n.title, n.source, n.date, n.time));
      else if (n.brew) out.push(mk("b", n.url, n.title, n.source || "MailBrew", n.date, n.time));
    });
    return dedupeByTitle(out);
  }

  const feed = createFeed({
    feedEl: host.querySelector("#nl-feed"),
    headEl: host.querySelector("#nl-head"),
    headLabel: "Reading",
    chips: [
      { k: "all", label: "All" },
      { k: "n", label: "Newsletters" },
      { k: "f", label: "myFT" },
      { k: "s", label: "Substacks" },
      { k: "b", label: "Brew" },
    ],
    buildItems,
    defaultDesk: "all",
    emptyLabel: (desk) => desk === "n" ? "No newsletters yet — the sweep runs hourly, 06:00–21:00."
      : desk === "f" ? "No myFT headlines yet — check back shortly."
        : desk === "s" ? "No Substack posts yet — check back shortly."
          : desk === "b" ? "No Brew digest yet — check back shortly."
            : "No reading yet — check back shortly.",
  });
  feed.render();

  // Live wire: repaint when /api/feed lands (adds Substack / myFT / Brew items).
  onLiveWire((items) => { _live = Array.isArray(items) ? items : []; feed.render(); });

  return { enter() {}, leave() {} };
}
