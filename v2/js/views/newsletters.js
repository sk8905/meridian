// Newsletters view — a thin loader for the Newsletters tab. Defers to the
// newsletters app (built on the shared feed engine, feed.js) with the runtime
// build version so its imports carry the same ?v= token as the rest of the SPA.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
export function mount(host, ctx) {
  return import(`../newsletters/app.js?v=${V}`).then((m) => m.mount(host, ctx));
}
