// Restructuring hub view — mounts v2/js/restructuring/app.js (stress list, plans &
// schemes, case law, restructuring deals, insolvency statistics, hearings). Its data
// modules load only when the tab is first opened. CSS (v2/css/restructuring.css) is
// bundled up front via v2/styles.css.
export function mount(host, ctx) { return import("../restructuring/app.js").then((m) => m.mount(host, ctx)); }
