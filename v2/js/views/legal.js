// Legal view — mounts the ported Legal app (its dataset lazy-loads the same way).
import { mount as mountLegal } from "../legal/app.js?v=v2-2";
export const css = "/legal/css/styles.css?v=20260718-10";
export function mount(host, ctx) { return mountLegal(host, ctx); }
