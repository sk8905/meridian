// Shared UI runtime for the v2 SPA's reactive islands (Phase 3 of the refactor).
// We migrate the hand-written innerHTML + manual-wiring panes to small Preact
// components driven by @preact/signals, one at a time. Preact + signals are bundled
// and content-hashed by Vite like the rest of v2/js (they are bare specifiers, so
// vite.config.js's `external` leaves them in the bundle). No JSX — components use the
// `h` hyperscript directly, so no build/transform config is needed.
export { h, render } from "preact";
export { signal, computed, effect, batch } from "@preact/signals";

// Mount a component into a host element, replacing its contents. Returns the host.
// Use for an "island": a reactive widget living inside the existing shell DOM.
import { h as _h, render as _render } from "preact";
export function mount(host, Component, props) {
  if (!host) return host;
  _render(_h(Component, props || {}), host);
  return host;
}
