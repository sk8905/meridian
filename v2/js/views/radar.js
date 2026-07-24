// Radar view — the Origination Radar (contained BD workspace). Loaded with the
// shared build version V; CSS (credit styles + tui) is declared up front in
// v2/index.html. See v2/js/origination/app.js.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
export function mount(host, ctx) { return import(`../origination/app.js?v=${V}`).then((m) => m.mount(host, ctx)); }
