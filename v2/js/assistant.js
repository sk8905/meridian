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

// ---- New-chat suggestions: 3 one-word topics from today's most important news --
// Derived from the SAME live wire the Home feed reads (/api/feed) — never invented:
// each topic is a one-word label whose keyword actually appears in today's
// headlines, ranked by how many of the day's stories mention it. Padded with
// Wire's evergreen desks only if the day is thin, so there are always three.
const TOPIC_MAP = [
  { re: /\b(fed|fomc|powell|jerome powell)\b/i, label: "Fed" },
  { re: /\b(ecb|lagarde)\b/i, label: "ECB" },
  { re: /\b(boe|bank of england|gilts?)\b/i, label: "Gilts" },
  { re: /\b(inflation|\bcpi\b|\bpce\b)\b/i, label: "Inflation" },
  { re: /\b(treasur\w+|yields?|rate (cut|hike|hold|rise|decision|path))\b/i, label: "Rates" },
  { re: /\b(tariffs?|trade war)\b/i, label: "Tariffs" },
  { re: /\b(oil|crude|brent|\bopec\b)\b/i, label: "Oil" },
  { re: /\b(gold|bullion)\b/i, label: "Gold" },
  { re: /\b(dollar|\bdxy\b|greenback)\b/i, label: "Dollar" },
  { re: /\b(crypto|bitcoin|ether\w*)\b/i, label: "Crypto" },
  { re: /\b(earnings|profit warning|guidance|results)\b/i, label: "Earnings" },
  { re: /\b(merger|acquisition|takeover|\bm&a\b|buyout)\b/i, label: "Deals" },
  { re: /\b(ipos?|listing|float)\b/i, label: "IPOs" },
  { re: /\b(clos?|collateral\w*[- ]loan)\b/i, label: "CLOs" },
  { re: /\b(default|distress\w*|restructur\w+|bankrupt\w+|chapter 11)\b/i, label: "Distress" },
  { re: /\b(private credit|direct lending|\bbdc\b)\b/i, label: "Credit" },
  { re: /\b(downgrade|upgrade|rating)\b/i, label: "Ratings" },
  { re: /\b(recession|slowdown|contraction)\b/i, label: "Recession" },
  { re: /\b(jobs?|payrolls?|unemploy\w+|labou?r market)\b/i, label: "Jobs" },
  { re: /\b(stocks?|equit\w+|shares?|s&p|nasdaq|dow|ftse)\b/i, label: "Equities" },
  { re: /\b(china|beijing|pboc)\b/i, label: "China" },
];
const DEFAULT_TOPICS = ["Markets", "Rates", "Credit"];
let _topics = null;
export async function newsTopics() {
  if (_topics) return _topics;
  let titles = [];
  try {
    const r = await fetch("/api/feed", { headers: { accept: "application/json" } });
    const d = await r.json();
    titles = ((d && d.items) || []).map((x) => (x && x.title) || "");
  } catch { titles = []; }
  const tally = new Map();
  for (const t of titles) for (const { re, label } of TOPIC_MAP) if (re.test(t)) tally.set(label, (tally.get(label) || 0) + 1);
  const top = [...tally.entries()].sort((a, b) => b[1] - a[1]).map(([l]) => l);
  for (const d of DEFAULT_TOPICS) if (top.length < 3 && !top.includes(d)) top.push(d);
  _topics = top.slice(0, 3);
  return _topics;
}
const topicQuestion = (t) => `What's the most important ${t} news today?`;
// A small accent "spark" mark for the new-chat empty state (12 rays, drawn so the
// source stays clean).
const SPARK = `<svg class="na-sugg-mark" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><g stroke="currentColor" stroke-width="2.2" stroke-linecap="round">`
  + Array.from({ length: 12 }, (_, i) => { const a = (i * 30) * Math.PI / 180, x1 = 20 + 6 * Math.cos(a), y1 = 20 + 6 * Math.sin(a), x2 = 20 + 17 * Math.cos(a), y2 = 20 + 17 * Math.sin(a); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`; }).join("")
  + `</g></svg>`;
// The Send glyph on the bare Chat input (an upward arrow — submit the typed line).
const SEND_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="6 11 12 5 18 11"/></svg>`;

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

// Render the assistant from its state. opts.ask / opts.add / opts.search pick
// which controls show. opts.ask defaults to true.
//
// ASK surfaces (the Menu → Chat chip and the desktop header) are CONVERSATIONAL:
// state.turns is a running transcript of {q, a, sources, error, loading} turns,
// rendered NEWEST-FIRST directly under the input, so a follow-up's answer appears
// right where you typed and each question carries the earlier turns as context.
// Add-only (Coverage) stays SINGLE-SHOT: {loading, error, notFound, pr, prName,
// sources} — research a firm and open one PR.
//
// No idle "explainer" copy: the empty state is just the box (the placeholder
// carries the purpose). A short verify-disclaimer shows only once BELOW the
// transcript, where it belongs (HOUSE_STYLE R20 keeps disclaimers + citations).
export function renderAsk(body, st, opts) {
  st = st || {}; opts = opts || {};
  const withAsk = opts.ask !== false;
  const withAdd = !!opts.add;
  const withSearch = !!opts.search;
  const bare = !!opts.bare;
  const isChat = withAsk;   // Ask surfaces are conversational; Add-only is single-shot
  // Sources are COLLAPSED by default — a click-to-expand disclosure so the answer
  // isn't buried under a wall of links.
  const srcList = (list) => (list && list.length)
    ? `<details class="na-ask-srcd"><summary class="na-ask-srch">Sources <span class="na-ask-srcn">${list.length}</span></summary><ul class="na-ask-srcs">${list.map((s) => `<li><a class="na-brief-src" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title || s.label || s.url)}</a></li>`).join("")}</ul></details>` : "";

  const turns = Array.isArray(st.turns) ? st.turns : [];
  const hasChat = isChat && turns.length > 0;
  // The menu Chat (`bare`) has a new-chat EMPTY STATE: a centred spark + three
  // one-word topic suggestions from today's news. Tapping one starts the chat.
  const showEmpty = isChat && bare && !hasChat;
  const emptyHTML = showEmpty
    ? `<div class="na-chat-empty">${SPARK}<div class="na-suggs">`
      + (_topics || DEFAULT_TOPICS).map((t) => `<button type="button" class="na-sugg" data-ask="${esc(topicQuestion(t))}">${esc(t)}</button>`).join("")
      + `</div></div>`
    : "";
  // On a PHONE the menu Chat (`bare`) is DOCKED: the whole view is a fixed column
  // with the input at the bottom — the new-chat empty state centres above it, and
  // once a chat starts the transcript (oldest→newest) fills the space, messaging
  // style. Desktop and the header panel keep the input on top.
  const onPhone = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
  const dock = bare && onPhone;
  if (body.classList) body.classList.toggle("is-docked", dock);
  const turnHTML = (t) => `<div class="na-chat-turn">`
    + `<div class="na-chat-q">${esc(t.q)}</div>`
    + (t.loading ? `<div class="na-load">${esc(t.loadingLabel || "Thinking…")}</div>`
      : t.error ? `<div class="na-ask-err">${esc(t.error)}</div>`
      : `<div class="na-ask-answer">${askFmt(t.a || "")}</div>` + srcList(t.sources))
    + `</div>`;

  // Add-only single-shot output (unchanged behaviour).
  const addOut = st.loading ? `<div class="na-load">${esc(st.loadingLabel || "Thinking…")}</div>`
    : st.error ? `<div class="na-ask-err">${esc(st.error)}</div>`
    : st.notFound ? `<div class="na-ask-err">${esc(st.notFound)}</div>`
    : st.pr ? `<div class="na-ask-answer">Drafted <strong>${esc(st.prName || "an entry")}</strong> and opened a pull request — verify every field before merging.</div><div class="na-ask-srch">Pull request</div><ul class="na-ask-srcs"><li><a class="na-brief-src" href="${esc(st.pr)}" target="_blank" rel="noopener noreferrer">${esc(st.pr)}</a></li></ul>` + srcList(st.sources)
    : "";

  // `bare` renders JUST the field (no action button) styled like the .tsearch
  // search box — the reader types and presses Enter. Once a chat is going the
  // placeholder invites a follow-up. The Ask input clears after each send (the
  // question moves into the transcript); the Add input keeps its text.
  const basePlaceholder = opts.placeholder || (withSearch ? "Search Wire, or ask a question…" : withAdd && !withAsk ? "Firm to research & add…" : "Ask Wire…");
  const placeholder = hasChat ? "Ask a follow-up…" : basePlaceholder;
  const inputVal = isChat ? "" : esc(st.q || "");
  const formHTML = `<form class="na-ask-form"><input class="na-ask-in" type="text" autocomplete="off" placeholder="${esc(placeholder)}" value="${inputVal}"${st.loading ? " disabled" : ""} />`
    + `<button type="button" class="na-ask-clr" tabindex="-1" aria-label="Clear"${inputVal ? "" : " hidden"}>✕</button>`
    + (withSearch && !bare ? `<button type="button" class="na-ask-search"${st.loading ? " disabled" : ""} title="Search Wire — instant matches across managers, funds, firms, deals & pages">Search</button>` : "")
    + (withAdd && !bare ? `<button type="button" class="na-ask-add"${st.loading ? " disabled" : ""} title="Research this firm and open a PR for review">Add</button>` : "")
    + (withAsk && !bare ? `<button type="submit" class="na-ask-go"${st.loading ? " disabled" : ""}>Ask</button>` : "")
    // The bare menu Chat sends with a dedicated Send button (New chat moved to the
    // Chat-chip dropdown). It submits the form — the same path as pressing Enter.
    + (withAsk && bare ? `<button type="submit" class="na-ask-send"${st.loading ? " disabled" : ""} aria-label="Send" title="Send">${SEND_ICON}</button>` : "")
    + `</form>`;
  // The transcript (turns → verify disclaimer) is ONE block so the docked layout
  // can scroll it as a unit above the pinned input row.
  const chatHTML = hasChat
    ? `<div class="na-chat">`
      + (dock ? turns : turns.slice().reverse()).map(turnHTML).join("")
      + `</div>`
    : "";
  // The middle is the transcript (active chat) or the new-chat empty state.
  const middle = hasChat ? chatHTML : emptyHTML;
  // Docked (phone menu Chat): middle first, input LAST — a fixed flex column (CSS)
  // puts the input at the bottom. Otherwise the input stays on top.
  body.innerHTML = isChat
    ? (dock ? middle + formHTML : formHTML + middle)
    : formHTML + `<div class="na-ask-out">${addOut}</div>`;
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
  const withSearch = !!opts.search;
  const isChat = withAsk;   // Ask surfaces keep a conversation; Add-only is single-shot
  const state = opts.state || {};
  // A redraw recreates the input (unfocused) and, on submit, closes the keyboard —
  // so clear the typing flag here; focusin re-sets it when the reader taps back in.
  const draw = () => { try { document.documentElement.classList.remove("chat-kbd"); } catch { /* ignore */ } renderAsk(container, state, { ask: withAsk, add: withAdd, search: withSearch, bare: !!opts.bare, placeholder: opts.placeholder }); };
  // When the chat is docked, the transcript (.na-chat) is the only scroller — keep
  // the newest turn in view by scrolling it to the bottom after a redraw.
  const drawScroll = () => { draw(); if (container.classList.contains("is-docked")) requestAnimationFrame(() => { const sc = container.querySelector(".na-chat"); if (sc) sc.scrollTop = sc.scrollHeight; }); };
  const setState = (s) => { for (const k in state) delete state[k]; Object.assign(state, s); draw(); };
  draw();
  // The menu Chat empty state shows three news-topic suggestions — load them once
  // (from /api/feed) and redraw so real topics replace the evergreen placeholders.
  if (isChat && !!opts.bare && !(state.turns && state.turns.length)) newsTopics().then(() => { if (!(state.turns && state.turns.length)) draw(); }).catch(() => {});
  if (container._asstBound) return;
  container._asstBound = true;

  // Search (omnibox): hand the typed text to the shared command palette for
  // instant local matches. palette.js listens for wire:search and opens seeded.
  const runSearch = () => {
    const q = (container.querySelector(".na-ask-in").value || "").trim();
    document.dispatchEvent(new CustomEvent("wire:search", { detail: { q } }));
  };

  // Ask is a CONVERSATION: each question appends a turn, carries the prior
  // completed turns to /api/ask for follow-up context, and fills its own answer
  // in place. The input clears on send (the question is now in the transcript).
  const runAsk = () => {
    if (state.loading) return;
    const input = container.querySelector(".na-ask-in");
    const q = ((input && input.value) || "").trim();
    if (!q) return;
    if (!Array.isArray(state.turns)) state.turns = [];
    const history = state.turns.filter((t) => t.a != null).map((t) => ({ q: t.q, a: t.a }));
    const turn = { q, loading: true };
    state.turns.push(turn);
    state.loading = true;
    drawScroll();
    buildAskContext().then((context) =>
      fetch("/api/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: q, context, history }) })
        .then((r) => r.json())
        .then((d) => {
          if (d && d.unconfigured) turn.error = d.message || "The assistant isn’t switched on yet.";
          else if (!d || d.error) turn.error = (d && d.message) || "The assistant is unavailable right now.";
          else { turn.a = d.answer || ""; turn.sources = d.sources || []; }
        })
        .catch(() => { turn.error = "Network error — try again."; })
        .then(() => { turn.loading = false; state.loading = false; drawScroll(); })
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
  // Clear-text ✕: show it while the field has text, hide it (and clear) on tap.
  const syncClr = () => { const i = container.querySelector(".na-ask-in"), c = container.querySelector(".na-ask-clr"); if (c) c.hidden = !(i && i.value); };
  container.addEventListener("input", (e) => { if (e.target.closest(".na-ask-in")) syncClr(); });
  container.addEventListener("click", (e) => {
    if (e.target.closest(".na-ask-clr")) { e.preventDefault(); e.stopPropagation(); const i = container.querySelector(".na-ask-in"); if (i) { i.value = ""; i.focus(); } syncClr(); return; }
    // A new-chat topic suggestion → seed the input with its question and ask.
    const sugg = e.target.closest(".na-sugg");
    if (isChat && sugg) { e.preventDefault(); e.stopPropagation(); const i = container.querySelector(".na-ask-in"); if (i) i.value = sugg.dataset.ask || sugg.textContent || ""; runAsk(); return; }
    if (withSearch && e.target.closest(".na-ask-search")) { e.preventDefault(); e.stopPropagation(); runSearch(); return; }
    if (withAdd && e.target.closest(".na-ask-add")) { e.preventDefault(); e.stopPropagation(); runAdd(); return; }
  });
  // Docked chat only: while the input is focused (keyboard up), flag <html> so the
  // bottom tab bar hides and the fixed chat column ends at the keyboard top — no
  // nav bar or dead space between the field and the keyboard. `--kbd-h` tracks the
  // on-screen keyboard height via visualViewport so the input glues above it.
  const vv = typeof window !== "undefined" && window.visualViewport;
  // The docked view ends at the on-screen keyboard top (--kbd-h) so the input glues
  // just above it. Crucially we PRESET --kbd-h to the last measured keyboard height
  // the instant the field is focused — BEFORE the keyboard finishes opening — so the
  // input is already above where the keyboard will be. iOS then has no
  // under-keyboard input to reveal and doesn't scroll the layout viewport (which is
  // what dragged the fixed header + tab bar off the top). visualViewport refines the
  // exact height once the keyboard is up. The measured height is cached so the very
  // first open is close too.
  const KBD_KEY = "wire_kbd_h";
  let lastKbdH = 0;
  try { lastKbdH = parseInt(localStorage.getItem(KBD_KEY) || "", 10) || 0; } catch { /* ignore */ }
  if (!(lastKbdH > 120)) lastKbdH = 300;   // sensible iOS default until measured
  const setKbd = () => {
    if (!vv || !document.documentElement.classList.contains("chat-kbd")) return;
    const h = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
    if (h > 120) { lastKbdH = h; try { localStorage.setItem(KBD_KEY, String(h)); } catch { /* ignore */ } }
    document.documentElement.style.setProperty("--kbd-h", (h > 120 ? h : lastKbdH) + "px");
  };
  let kbdQueued = false;
  const queueSetKbd = () => {
    if (kbdQueued) return;
    kbdQueued = true;
    requestAnimationFrame(() => { kbdQueued = false; setKbd(); });
  };
  if (vv) { vv.addEventListener("resize", queueSetKbd); vv.addEventListener("scroll", queueSetKbd); }
  container.addEventListener("focusin", (e) => {
    if (container.classList.contains("is-docked") && e.target.closest(".na-ask-in")) {
      document.documentElement.classList.add("chat-kbd");
      document.documentElement.style.setProperty("--kbd-h", lastKbdH + "px");   // preset BEFORE the keyboard opens
      setKbd();
    }
  });
  container.addEventListener("focusout", (e) => {
    if (e.target.closest(".na-ask-in")) { document.documentElement.classList.remove("chat-kbd"); document.documentElement.style.setProperty("--kbd-h", "0px"); }
  });
}
