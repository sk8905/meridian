// Phase-0 placeholder view factory. Real view code is ported in per tab in later
// phases; for now each tab renders a light, app-styled panel that PROVES the
// architecture: it mounts once (note the fixed mount time), keeps its state
// across tab switches (the counter survives), and revisits are instant (no
// spinner, no re-render). Uses the existing .container / .page-head classes so
// it already sits in the real visual language.
export function makeView({ name, blurb, accent }) {
  let mountedAt = "";
  let count = 0;
  return {
    mount(host, ctx) {
      mountedAt = new Date().toLocaleTimeString();
      host.innerHTML = `
        <div class="container" style="padding:22px 16px 96px">
          <div class="page-head"><h1 style="color:${accent}">${name}</h1></div>
          <p class="muted" style="max-width:56ch;line-height:1.6">${blurb}</p>
          <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;font-family:var(--t-mono,ui-monospace,monospace);font-size:12.5px">
            <div>view mounted at <strong data-mt>${mountedAt}</strong> — unchanged on revisit ⇒ kept alive</div>
            <div>taps on this view: <strong data-ct>0</strong></div>
            <button type="button" data-inc class="ps-btn" style="align-self:flex-start;padding:8px 14px">Tap to increment</button>
          </div>
        </div>`;
      host.querySelector("[data-inc]").addEventListener("click", () => {
        count++; host.querySelector("[data-ct]").textContent = String(count);
      });
      return {
        // enter(sub) runs each time the tab becomes active — here we just prove
        // the counter/mount-time persist (they are NOT reset).
        enter() {},
        leave() {},
      };
    },
  };
}
