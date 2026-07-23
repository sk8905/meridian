// Profiles view — a cross-desk directory of the Managers, Hedge Funds and Law
// firms lists (the SAME lists Credit and Legal render; the app imports their pane
// builders). Loaded with the shared build version V (see runtime.js). CSS is the
// credit + legal + feed stylesheets already declared up front in v2/index.html.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
export function mount(host, ctx) { return import(`../profiles/app.js?v=${V}`).then((m) => m.mount(host, ctx)); }
