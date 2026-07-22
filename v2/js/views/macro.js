// Macro view — mounts the ported Macro app (v2/js/macro/app.js) into its section.
// The per-view stylesheet is lazy-loaded once by the runtime (export const css).
import { mount as mountMacro } from "../macro/app.js?v=v2-1";
export const css = "/macro/css/styles.css?v=20260722-9";
export function mount(host, ctx) { return mountMacro(host, ctx); }
