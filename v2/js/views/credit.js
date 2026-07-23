// Credit view — mounts the ported Credit app. Its heavy dataset (data.js) is
// imported by the app, so it loads only when this view is first opened (lazy)
// and is then cached for the session. Loaded with the shared build version V.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
export const css = ["/credit/css/styles.css?v=20260723-2", "/feed.css?v=20260723-1"];
export function mount(host, ctx) { return import(`../credit/app.js?v=${V}`).then((m) => m.mount(host, ctx)); }
