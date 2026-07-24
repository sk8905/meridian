// Dashboard view — mounts the Dashboard app (Macro · Equities · Credit
// overviews). Its data (dashboard/js/data.js + reused macro content) is imported
// by the app, so it loads only when this tab is first opened, then cached for the
// session. Loaded with the shared build version V. CSS (dashboard.css) is
// declared up front in v2/index.html.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
export function mount(host, ctx) { return import(`../dashboard/app.js?v=${V}`).then((m) => m.mount(host, ctx)); }
