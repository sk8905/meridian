// Home (Glance) view — injects the extracted <main class="g-main"> markup into
// its section, then runs the ported initGlance() to wire it (feed, markets,
// rates, briefing, watchlist, predict). Home.css + feed.css lazy-load once. The
// content + glance modules are loaded with the shared build version V.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
// CSS (home.css + feed.css) is declared up front in v2/index.html — see the note
// there. The runtime no longer loads per-view CSS, so views export none.
export function mount(host, ctx) {
  return Promise.all([import(`../home/content.js?v=${V}`), import(`../home/glance.js?v=${V}`)]).then(([content, glance]) => {
    host.innerHTML = content.HOME_HTML;
    // Render on mount (revisits keep this DOM alive). initGlance self-guards
    // (runs once) and is wrapped so a render error keeps the briefing shell.
    try { glance.initGlance(ctx); } catch { /* keep shell */ }
    // home(): a nav-bar tap on Home resets it to its first part — the News pane
    // (the first chip: the briefing + feed) — and scrolls to top.
    const home = () => {
      try {
        const first = host.querySelector('.g-wiretab[data-wire="news"]');
        if (first) {
          // The News tab doubles as the lane dropdown's trigger: re-tapping it
          // while it is ALREADY the active pane toggles that dropdown OPEN. A
          // nav-bar Home tap must only reset to the pane, never pop the menu —
          // so click to switch only when it isn't already on, and otherwise just
          // make sure the lane dropdown is closed.
          if (first.classList.contains("is-on")) {
            const menu = host.querySelector("#g-wire-lanemenu");
            if (menu) menu.hidden = true;
            first.setAttribute("aria-expanded", "false");
          } else {
            first.click();   // setWire("news") via the delegated handler
          }
        }
        const feed = host.querySelector("#g-feed");
        if (feed) feed.scrollTop = 0;
        window.scrollTo(0, 0);
      } catch { /* best-effort reset */ }
    };
    return { enter() {}, leave() {}, home };
  });
}
