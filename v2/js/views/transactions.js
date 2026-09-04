// Transactions view — the covered managers' deal flow by transaction type.
// Loaded with the shared build version V (see runtime.js); CSS (tui + credit +
// feed) is declared up front in v2/index.html. See v2/js/transactions/app.js.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
export function mount(host, ctx) { return import(`../transactions/app.js?v=${V}`).then((m) => m.mount(host, ctx)); }
