// Legal view — mounts the ported Legal app (its dataset lazy-loads the same
// way). Loaded with the shared build version V (see runtime.js).
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
export const css = ["/legal/css/styles.css?v=20260723-1", "/feed.css?v=20260721-1"];
export function mount(host, ctx) { return import(`../legal/app.js?v=${V}`).then((m) => m.mount(host, ctx)); }
