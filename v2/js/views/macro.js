// Macro view — mounts the ported Macro app. The app module is loaded with the
// shared build version V (see runtime.js), so a Macro edit needs no per-file
// token bump — one bump of runtime.js in the shell busts the whole chain.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
// CSS (macro styles + feed.css) is declared up front in v2/index.html.
export function mount(host, ctx) { return import(`../macro/app.js?v=${V}`).then((m) => m.mount(host, ctx)); }
