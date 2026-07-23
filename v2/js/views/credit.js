// Credit view — mounts the ported Credit app. Its heavy dataset (data.js) is
// imported by the ported app.js, so it loads only when this view is first opened
// (lazy) and is then cached for the session (revisits are instant).
import { mount as mountCredit } from "../credit/app.js?v=v2-2";
export const css = "/credit/css/styles.css?v=20260721-9";
export function mount(host, ctx) { return mountCredit(host, ctx); }
