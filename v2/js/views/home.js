// Home (Glance) view — injects the extracted <main class="g-main"> markup into
// its section, then runs the ported initGlance() to wire it (feed, markets,
// rates, briefing, watchlist, predict). Home.css + feed.css lazy-load once. The
// content + glance modules are loaded with the shared build version V.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
// CSS (home.css + feed.css) is declared up front in v2/index.html — see the note
// there. The runtime no longer loads per-view CSS, so views export none.
export function mount(host, ctx) {
  return Promise.all([import(`../home/content.js`), import(`../home/glance.js`)]).then(([content, glance]) => {
    host.innerHTML = content.HOME_HTML;
    // Render on mount (revisits keep this DOM alive). initGlance self-guards
    // (runs once) and is wrapped so a render error keeps the briefing shell.
    try { glance.initGlance(ctx); } catch { /* keep shell */ }
    // home(): a nav-bar tap on Home resets it to its DEFAULT — the wire (feed) pane
    // on the All lane — and scrolls to top. glance.homeReset() switches the pane,
    // forces the All lane, persists both, and closes any open reader/lane menu.
    const home = () => { try { glance.homeReset(); } catch { /* best-effort reset */ } };
    // The Briefing pane sets `html.home-brief` (drops the page's bottom-nav padding so
    // it can't scroll). That class is Home-only — clear it when Home is hidden so it
    // never strips the nav clearance on other tabs, and restore it on return.
    const _brief = () => { try { return !!host.querySelector(".g-layout.wire-brief"); } catch { return false; } };
    return {
      enter() { try { document.documentElement.classList.toggle("home-brief", _brief()); } catch { /* noop */ } },
      leave() { try { document.documentElement.classList.remove("home-brief"); } catch { /* noop */ } },
      home,
    };
  });
}
