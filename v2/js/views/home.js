// Home (Glance) view — injects the extracted <main class="g-main"> markup into
// its section, then runs the ported initGlance() to wire it (feed, markets,
// rates, briefing, watchlist, predict). Home.css + feed.css lazy-load once. The
// content + glance modules are loaded with the shared build version V.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
export const css = ["/home.css?v=20260723-2", "/feed.css?v=20260723-1"];
export function mount(host, ctx) {
  return Promise.all([import(`../home/content.js?v=${V}`), import(`../home/glance.js?v=${V}`)]).then(([content, glance]) => {
    host.innerHTML = content.HOME_HTML;
    // Render on mount (revisits keep this DOM alive). initGlance self-guards
    // (runs once) and is wrapped so a render error keeps the briefing shell.
    try { glance.initGlance(); } catch (e) { /* keep shell */ }
    return { enter() {}, leave() {} };
  });
}
