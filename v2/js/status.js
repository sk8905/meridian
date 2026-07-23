// App-wide "Last refresh" — ONE value for the whole app, not split by desk.
// Wire's data is refreshed together by the four-times-daily routine, so the
// header should show a single refresh time that doesn't change just because you
// switched tabs. Each desk reports its data stamp when it loads; the MOST RECENT
// wins (monotonic), and every report renders into the shared #data-status. So
// whichever desk loads first sets it and later desks only ever move it forward.
let _best = -1;
let _label = "";

export function reportRefresh(dateStr, timeStr) {
  const ts = parse(dateStr, timeStr);
  if (ts < 0 || ts <= _best) { render(); return; }   // keep the most recent
  _best = ts;
  _label = fmt(dateStr, timeStr);
  render();
}

function parse(d, t) {
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return -1;
    const m = t && /(\d{1,2}):(\d{2})/.exec(t);
    if (m) dt.setHours(+m[1], +m[2], 0, 0);
    return dt.getTime();
  } catch { return -1; }
}

function fmt(d, t) {
  let s = d;
  try { const dt = new Date(d); if (!isNaN(dt.getTime())) s = dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); } catch { /* keep raw */ }
  return s + (t ? `, ${t}` : "");
}

function render() {
  if (!_label) return;
  // Render into every refresh slot — the header #data-status (desktop
  // rail/footer) AND the phone bottom-meta strip — so the one app-wide value
  // shows wherever the current breakpoint surfaces it.
  const html = `<span class="ds-text" title="Wire data is refreshed together by the four-times-daily routine (05:00, 12:00, 17:00 &amp; 21:00 London)."><span class="ds-part">Last refresh ${_label}</span></span>`;
  document.querySelectorAll("[data-refresh-slot]").forEach((el) => { el.innerHTML = html; });
}
