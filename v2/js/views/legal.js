// Legal view — mounts the ported Legal app (its dataset lazy-loads the same
// way). Loaded with the shared build version V (see runtime.js).
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
// CSS (legal styles + feed.css) is declared up front in v2/index.html.
export function mount(host, ctx) { return import(`../legal/app.js?v=${V}`).then((m) => m.mount(host, ctx)); }
