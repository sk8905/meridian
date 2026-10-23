// Menu ▸ Settings ▸ Subscriptions — the owner's own logins for the subscriber reader
// (HOUSE_STYLE R53). One row per site: its state, and a box to paste the browser's
// Cookie header (no size cap, no Cloudflare dashboard). /api/subs never returns a cookie;
// it only says whether one is saved and how the last full-text read went.
import { esc } from "/util.js";

const WHY = {
  "session-expired": "Logged out — paste a fresh cookie",
  "session-blocked": "The site blocks Wire's server (a new cookie won't help)",
  "session-daily-cap": "Daily limit reached — resets tomorrow",
  "session-no-text": "The page loaded but Wire found no article text",
};
// A one-line diagnosis of the last failed read (no article text) to pass on for a fix.
const diagLine = (d) => d ? `Details: HTTP ${d.status} · "${d.title || ""}" · ${d.kb} kB · ${d.p} ¶${d.ld ? " · ld" : ""}${d.next ? " · next" : ""}${d.embedded != null ? " · emb " + d.embedded : ""}${d.bot ? " · bot" : ""}${d.barrier ? " · barrier" : ""}` : "";
const when = (iso) => {
  const t = Date.parse(iso || ""); if (!t) return "";
  const d = new Date(t);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};
function state(s) {
  if (!s.saved) return { cls: "is-off", txt: "Not set", sub: "Stories open with the summary + a link" };
  if (!s.last) return { cls: "is-wait", txt: "Saved", sub: `Not used yet — open one of its stories${s.savedAt ? " · saved " + when(s.savedAt) : ""}` };
  if (s.last.ok) return { cls: "is-ok", txt: "Reading in full", sub: `Last read ${when(s.last.at)} · ${s.usedToday}/${s.cap} today` };
  return { cls: "is-bad", txt: "Not working", sub: `${WHY[s.last.reason] || s.last.reason || "Last read failed"} · ${when(s.last.at)}` };
}
function rowHTML(s, open, msg) {
  const st = state(s);
  return `<div class="subs-row" data-site="${esc(s.site)}">`
    + `<div class="subs-head"><span class="subs-name">${esc(s.name)}</span><span class="subs-pill ${st.cls}">${esc(st.txt)}</span></div>`
    + `<div class="subs-sub">${esc(st.sub)}${s.saved === "secret" ? " · from a Cloudflare secret" : ""}</div>`
    + (s.last && !s.last.ok && s.last.diag ? `<div class="subs-sub subs-diag">${esc(diagLine(s.last.diag))}</div>` : "")
    + (open
      ? `<textarea class="subs-box" rows="4" spellcheck="false" autocomplete="off" placeholder="Paste the whole cookie value from DevTools (Request Headers ▸ cookie)"></textarea>`
        + `<div class="subs-acts"><button type="button" class="subs-btn" data-act="save">Save</button><button type="button" class="subs-btn subs-btn-q" data-act="cancel">Cancel</button></div>`
      : `<div class="subs-acts"><button type="button" class="subs-btn" data-act="open">${s.saved ? "Replace cookie" : "Add cookie"}</button>`
        + (s.saved === "page" ? `<button type="button" class="subs-btn subs-btn-q" data-act="clear">Remove</button>` : "") + `</div>`)
    + (msg ? `<div class="subs-msg" role="status">${esc(msg)}</div>` : "")
    + `</div>`;
}

export async function mountSubs(getBox) {
  let sites = null, openSite = "", msg = {};
  const paint = () => {
    const box = getBox(); if (!box) return;
    if (!sites) return;
    box.innerHTML = `<p class="subs-intro">Paste a site's login cookie and its stories read in full in the reading pane. Saved privately behind your sign-in; never shown again.</p>`
      + sites.map((s) => rowHTML(s, openSite === s.site, msg[s.site])).join("");
  };
  const load = async (init) => {
    const r = await fetch("/api/subs", { cache: "no-store", ...(init || {}) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || ("HTTP " + r.status));
    sites = j.sites || [];
  };
  try { await load(); paint(); }
  catch { const b = getBox(); if (b) b.innerHTML = `<p class="watch-empty">Couldn't load your subscriptions.</p>`; return; }
  const box0 = getBox(); if (!box0 || box0.dataset.subsWired) return;
  box0.dataset.subsWired = "1";
  box0.addEventListener("click", async (e) => {
    const btn = e.target.closest(".subs-btn"); if (!btn) return;
    const row = btn.closest(".subs-row"); const site = row && row.dataset.site; if (!site) return;
    const act = btn.dataset.act;
    if (act === "open") { openSite = site; msg[site] = ""; paint(); const t = getBox().querySelector(`.subs-row[data-site="${site}"] .subs-box`); if (t) t.focus(); return; }
    if (act === "cancel") { openSite = ""; paint(); return; }
    const cookie = act === "save" ? ((row.querySelector(".subs-box") || {}).value || "") : "";
    if (act === "save" && !cookie.trim()) { msg[site] = "Paste the cookie first."; paint(); return; }
    btn.disabled = true;
    try {
      await load({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ site, cookie }) });
      openSite = "";
      msg[site] = act === "save" ? "Saved — open one of its stories to check it reads in full." : "Removed.";
    } catch (err) { msg[site] = "Not saved: " + (err && err.message || "error"); }
    paint();
  });
}
