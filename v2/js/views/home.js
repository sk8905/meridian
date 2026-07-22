// Home (Glance) view — injects the extracted <main class="g-main"> markup into
// its section, then runs the ported initGlance() to wire it (feed, markets,
// rates, briefing, watchlist, predict). Home.css + feed.css lazy-load once.
import { HOME_HTML } from "../home/content.js?v=v2-1";
import { initGlance } from "../home/glance.js?v=v2-1";
export const css = ["/home.css?v=20260722-11", "/feed.css?v=20260721-1"];
export function mount(host, ctx) {
  host.innerHTML = HOME_HTML;
  let done = false;
  return {
    enter() { if (!done) { done = true; try { initGlance(); } catch (e) { /* keep shell */ } } },
    leave() {},
  };
}
