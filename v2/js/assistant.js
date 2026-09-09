// =============================================================================
// assistant.js — the shared "Ask Wire" (B) + "Add a firm" (C) UI, mounted in
// TWO places: the desktop header panel (Ask only) and the Menu → Dialogue chip
// (Ask + Add). One implementation so the two surfaces never drift.
//
// Both post to the Access-gated Worker routes /api/ask and /api/propose, which
// answer ONLY from Wire's own data + a CITED web search (never fabricate —
// HOUSE_STYLE R7) and stay dormant ({unconfigured:true}) until a provider secret
// is set, in which case the panel shows a "not switched on" note.
// =============================================================================
import { esc } from "/util.js?v=20260818-1";

// The compact roster the client already loads, packed into ≤55 KB of context so
// /api/ask can ground its answer in the exact data on the reader's screen.
let _askCtx = null;
export async function buildAskContext() {
  if (_askCtx != null) return _askCtx;
  try {
    const [cr, lg] = await Promise.all([import("/credit/js/data.js"), import("/legal/js/data.js")]);
    const parts = [];
    const mgr = (cr.managers || []).map((m) => `${m.name} — ${m.hq || "?"} · AUM ${m.aumText || (m.aum ? "~$" + m.aum + "bn" : "n/a")} · ${(m.strategies || []).join("/")}`);
    parts.push(`CREDIT MANAGERS (${mgr.length}):\n${mgr.join("\n")}`);
    const hf = (cr.HEDGE_FUNDS || []).map((h) => `${h.name}${h.aum ? " — ~$" + h.aum + "bn" : ""}${h.strategy ? " · " + h.strategy : ""}${h.hq ? " · " + h.hq : ""}`);
    parts.push(`HEDGE FUNDS (${hf.length}):\n${hf.join("\n")}`);
    const fw = (lg.firms || []).map((f) => `${f.name}${f.london && f.london.lawyers ? " — ~" + f.london.lawyers + " London lawyers" : ""}${f.tier ? " · tier " + f.tier : ""}`);
    parts.push(`LAW FIRMS (${fw.length}):\n${fw.join("\n")}`);
    const dl = (cr.deals || []).slice(-40).reverse().map((d) => `${d.date || ""} · ${d.headline || ""}`);
    parts.push(`RECENT CREDIT DEALS:\n${dl.join("\n")}`);
    _askCtx = parts.join("\n\n").slice(0, 55000);
  } catch { _askCtx = ""; }
  return _askCtx;
}

// The model may return light markdown (**bold**, *italic*, `code`, [t](url),
// paragraph/line breaks). Escape FIRST, then apply a tiny safe subset on the
// already-escaped string so nothing user/model-supplied can inject markup.
export function askFmt(s) {
  let h = esc(String(s || ""));
  h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, t, u) => `<a class="na-brief-src" href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
  h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:)]|$)/g, "$1<em>$2</em>");
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  h = h.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
  return `<p>${h}</p>`;
}

// Render the assistant from its state: {q, loading, loadingLabel, answer,
// sources, error, pr, prName, notFound}. opts.ask / opts.add pick which buttons
// show — the Menu splits them (Dialogue = Ask only; Coverage = Add only) while
// the desktop header shows Ask only. opts.ask defaults to true.
export function renderAsk(body, st, opts) {
  st = st || {}; opts = opts || {};
  const withAsk = opts.ask !== false;
  const withAdd = !!opts.add;
  const srcList = (list) => (list && list.length)
    ? `<div class="na-ask-srch">Sources</div><ul class="na-ask-srcs">${list.map((s) => `<li><a class="na-brief-src" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title || s.label || s.url)}</a></li>`).join("")}</ul>` : "";
  const hint = withAsk && withAdd
    ? `Ask about any tracked manager, fund, law firm, deal or the markets — or type a firm’s name and press <strong>Add</strong> to have Wire research it and open a PR for review. Every claim links its source.`
    : withAdd
      ? `Type a firm’s name and press <strong>Add</strong> — Wire researches it from public sources and opens a PR for review. It never edits live data; every field is sourced or left blank.`
      : `Ask about any tracked manager, fund, law firm, deal or the markets. Every claim links its source.`;
  const out = st.loading ? `<div class="na-load">${esc(st.loadingLabel || "Thinking…")}</div>`
    : st.error ? `<div class="na-ask-err">${esc(st.error)}</div>`
    : st.notFound ? `<div class="na-ask-err">${esc(st.notFound)}</div>`
    : st.pr ? `<div class="na-ask-answer">Drafted <strong>${esc(st.prName || "an entry")}</strong> and opened a pull request — verify every field before merging.</div><div class="na-ask-srch">Pull request</div><ul class="na-ask-srcs"><li><a class="na-brief-src" href="${esc(st.pr)}" target="_blank" rel="noopener noreferrer">${esc(st.pr)}</a></li></ul>` + srcList(st.sources)
    : st.answer != null ? `<div class="na-ask-answer">${askFmt(st.answer)}</div>` + srcList(st.sources)
    : `<div class="na-ask-hint">${hint}</div>`;
  const foot = withAsk && withAdd
    ? `AI answers/drafts from Wire’s sourced data + a live web search — verify anything critical. “Add” opens a PR for review; it never edits live data.`
    : withAdd
      ? `Claude drafts from public sources + a live web search and opens a PR for review — it never edits live data. Verify every field before merging.`
      : `AI answers from Wire’s sourced data + a live web search — verify anything critical.`;
  const placeholder = withAsk && withAdd ? "Ask Wire, or a firm to add…" : withAdd ? "Firm to research & add…" : "Ask Wire…";
  body.innerHTML = `<form class="na-ask-form"><input class="na-ask-in" type="text" autocomplete="off" placeholder="${placeholder}" value="${esc(st.q || "")}"${st.loading ? " disabled" : ""} />`
    + (withAdd ? `<button type="button" class="na-ask-add"${st.loading ? " disabled" : ""} title="Research this firm and open a PR for review">Add</button>` : "")
    + (withAsk ? `<button type="submit" class="na-ask-go"${st.loading ? " disabled" : ""}>Ask</button>` : "")
    + `</form>`
    + `<div class="na-ask-out">${out}</div>`
    + `<div class="na-brief-foot">${foot}</div>`;
}

// Mount the assistant into `container`, wiring "Ask" (→ /api/ask, feature B) when
// opts.ask (default true) and "Add" (→ /api/propose, feature C) when opts.add.
// The Menu mounts an Ask-only instance (Dialogue) and an Add-only instance
// (Coverage); the desktop header mounts Ask only. When Ask is off, submitting the
// form (Enter) triggers Add so the field still works. State lives in opts.state
// (pass a shared object to persist across re-renders/re-opens). Listeners are
// delegated on `container` so they survive innerHTML redraws; an idempotence
// guard means re-mounting the SAME persistent container only re-renders.
export function mountAssistant(container, opts) {
  if (!container) return;
  opts = opts || {};
  const withAsk = opts.ask !== false;
  const withAdd = !!opts.add;
  const state = opts.state || {};
  const draw = () => renderAsk(container, state, { ask: withAsk, add: withAdd });
  const setState = (s) => { for (const k in state) delete state[k]; Object.assign(state, s); draw(); };
  draw();
  if (container._asstBound) return;
  container._asstBound = true;

  const runAsk = () => {
    if (state.loading) return;
    const q = (container.querySelector(".na-ask-in").value || "").trim();
    if (!q) return;
    setState({ q, loading: true });
    buildAskContext().then((context) =>
      fetch("/api/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: q, context }) })
        .then((r) => r.json())
        .then((d) => {
          if (d && d.unconfigured) setState({ q, error: d.message || "The assistant isn’t switched on yet." });
          else if (!d || d.error) setState({ q, error: (d && d.message) || "The assistant is unavailable right now." });
          else setState({ q, answer: d.answer || "", sources: d.sources || [] });
        })
        .catch(() => setState({ q, error: "Network error — try again." }))
    );
  };
  const runAdd = () => {
    if (state.loading) return;
    const q = (container.querySelector(".na-ask-in").value || "").trim();
    if (!q) return;
    setState({ q, loading: true, loadingLabel: "Researching & drafting…" });
    fetch("/api/propose", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: q }) })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.unconfigured) setState({ q, error: d.message || "Proposing additions isn’t switched on yet." });
        else if (d && d.notFound) setState({ q, notFound: d.message || "Couldn’t verify that firm from public sources." });
        else if (!d || d.error || !d.prUrl) setState({ q, error: (d && d.message) || "Couldn’t open a PR — try again." });
        else setState({ q, pr: d.prUrl, prName: d.name || q, sources: d.sources || [] });
      })
      .catch(() => setState({ q, error: "Network error — try again." }));
  };

  // Enter/submit runs Ask when present, else Add (so an Add-only field still works).
  container.addEventListener("submit", (e) => {
    const form = e.target.closest(".na-ask-form"); if (!form) return;
    e.preventDefault(); e.stopPropagation();
    if (withAsk) runAsk(); else if (withAdd) runAdd();
  });
  if (withAdd) container.addEventListener("click", (e) => {
    if (!e.target.closest(".na-ask-add")) return;
    e.preventDefault(); e.stopPropagation();
    runAdd();
  });
}
