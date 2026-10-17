// =============================================================================
// v2/js/profiles/people.js — the Profiles ▸ People list (owner review R11): hires,
// departures and promotions across the covered firms, built ONLY from items already
// in Wire's sourced records —
//   • credit managers  — `intel` items typed "Personnel" (credit/js/data.js), plus the
//                        few people-move headlines filed under another type ("…hires X
//                        to lead…", "X joins Y as head of…")
//   • hedge funds      — `HEDGE_INTEL` items typed "Personnel"
//   • law firms        — lateral-hire alerts in `legal/js/data.js` items ("X joins Weil",
//                        "…with two new partners", "…partner hire")
// Every field is read from the item's own headline / summary text: the person only
// when a name is written there, the role from "as <role>", the move type from the
// verb, the seniority from the role (or headline) text — Partner / MD / Head / C-suite
// / Director, else "Other". Nothing is guessed; an unreadable field stays blank. Each
// row links its firm's profile and carries the item's source.
// =============================================================================
import { intel, managers, managerById, HEDGE_INTEL, HEDGE_FUNDS } from "/credit/js/data.js";
import { items as LEGAL_ITEMS, firmById } from "/legal/js/data.js";
import { esc, srcHost, tidyDomain } from "/util.js";
import { fmtDate, creditSource } from "/credit/js/shared.js";

// ---- which items are people moves ------------------------------------------------
// Non-"Personnel" credit items qualify only on an unambiguous people-move phrasing.
const CREDIT_EXTRA = /\b(?:hires|rehires|poaches)\b(?![^.]*\bmandate\b)|\bhead hire\b|\bjoins\b[^,]*\bas\b|\badds [A-Z][a-z]+ [A-Z][\w'’-]+ to (?:head|lead)\b/;
const LEGAL_MOVE = /\b(?:joins?|to join|hires?|new partners?|partner hire|double hire)\b/i;
const LEGAL_PERSON = /\b(?:partners?|lawyer|counsel|attorney|hires?)\b/i;
const LEGAL_NOT = /appointed representative|\badvis(?:es|ed|ing|er)\b|\bnzba\b|\bwelcome\b|plant hire/i;

// ---- field readers -----------------------------------------------------------------
const MOVE_PROMO = /\b(?:promot(?:e|es|ed|ion|ions)|elevat(?:e|es|ed))\b/i;
const MOVE_OUT = /\b(?:loses|lost|depart(?:s|ure|ing)?|leaves|leaving|to leave|exits?|exiting|steps? down|stepping down|retir(?:es|ing|ement)|quits|resigns?|resignation|parts ways)\b/i;
const MOVE_IN = /\b(?:hires?|hired|rehires|appoints?|appointed|appointment|names|named|joins?|joined|to join|recruits?|poach(?:es|ed)?|taps|adds|welcomes?|new partners?|bolsters|strengthens|returns)\b/i;
// The verb that comes FIRST wins: "Blackstone names X head … after Y's departure" is a
// hire; "X departs for rival Y" a departure.
export function moveType(text) {
  const s = String(text || "").replace(/\bjoins? (?:the )?ranks\b/i, " ");
  const at = (re) => { const m = re.exec(s); return m ? m.index : Infinity; };
  const c = [["Promotion", at(MOVE_PROMO)], ["Departure", at(MOVE_OUT)], ["Hire", at(MOVE_IN)]].sort((a, b) => a[1] - b[1]);
  return c[0][1] === Infinity ? "Other" : c[0][0];
}
// Seniority from the job-title text only.
export function seniority(t) {
  const s = String(t || "");
  if (/\b(?:ceo|cio|cfo|coo|cro|cto|chief\s+[a-z]+(?:\s+[a-z]+)?\s+officer|chief executive|president|chair(?:man|woman|person)?)\b/i.test(s)) return "C-suite";
  if (/\bpartners?\b/i.test(s)) return "Partner";
  if (/\bmanaging directors?\b|\bMDs?\b/.test(s) || /\bmanaging director\b/i.test(s)) return "MD";
  if (/\b(?:co-)?head\b/i.test(s)) return "Head";
  if (/\bdirector\b/i.test(s)) return "Director";
  return "Other";
}
// Words that are titles / desks / places, never part of a person's name.
const STOP = new Set(("Partner Partners Lawyer Counsel Attorney Head Heads Global Chief Officer Managing Director Directors Senior Leading Experienced Former Corporate " +
  "Finance Acquisition Restructuring Capital Markets Credit Private Equity Debt Lending Investment Investments Fund Funds Portfolio Manager Managers Asset Assets " +
  "Management Group Team New Two Three Four Real Estate Infrastructure Banking Tax Regulatory Litigation Co-head Co-Head President Chair Vice Executive Deputy " +
  "Founder Co-founder Principal Analyst Associate Veteran Star Top Ex US UK EU Europe European Asia Asian London Paris Frankfurt Hong Kong York Amsterdam " +
  "Strategy Strategies CLO CLOs ABF Business Operating Trading Sales Investor Relations Distribution Product Products Risk Legal Compliance Technology Data " +
  "The A An Its And Of For With From To As In At On By Insurance Solutions Structured Opportunities Special Situations Direct Leveraged Loans Loan Greater China Japan Middle East Americas Nordic Nordics Germany France Italy Spain Benelux Africa India Australia " +
  "Canada Ireland Switzerland Swiss Dutch German French British American Japanese Chinese Indian").split(" "));
const NAME = "[A-Z][\\p{L}'’-]+(?:\\s+[A-Z][\\p{L}'’.-]+){1,3}";
const NAMES = `(${NAME}(?:,\\s+${NAME})*(?:\\s+(?:and|&)\\s+${NAME})?)`;
// A name written right before a subject verb ("Jason Cope joins …", "… Bing Gu, departs").
const RE_SUBJ = new RegExp(`${NAMES},?\\s+(?:[Jj]oins?|[Tt]o [Jj]oin|[Ll]eaves|[Dd]eparts|[Ee]xits|[Rr]etires|[Rr]esigns|[Ss]teps [Dd]own|[Tt]o [Ss]tep [Dd]own|[Tt]o [Ee]xit|[Tt]o [Rr]etire|[Tt]o [Ll]eave|[Rr]eturns|[Ii]s [Pp]romoted|[Ww]ill [Jj]oin)\\b`, "u");
// Object verbs ("Barings hires Sloan Sutta …"): names are scanned AFTER the verb.
const RE_OBJ_VERB = /\b(?:hires|hire|rehires|appoints|names|promotes|poaches|taps|adds|recruits|loses|welcomes|elevates|lands)\b/i;
const RE_NAME_G = new RegExp(NAMES, "gu");
const ALLCAPS = /^(?:co-)?[A-Z0-9]{2,}s?$|^(?:co-)?(?:ceo|cio|cfo|coo|md|pm|vp)s?$/i;
const isCaps = (w) => ALLCAPS.test(w) && w === w.toUpperCase() || /^co-(?:ceo|cio|cfo|coo)s?$/i.test(w);
let _firmNames = null;
const firmNames = () => (_firmNames = _firmNames || [
  ...managers.map((m) => m.name), ...(HEDGE_FUNDS || []).map((f) => f.name), ...Object.values(firmById).map((f) => f.name),
].flatMap((n) => [n, String(n).replace(/\s*\(.*?\)\s*/g, " ").trim()]).filter(Boolean));
function cleanName(p, avoid) {
  let toks = p.trim().split(/\s+/);
  const pos = toks.map((w) => /(?:'s|’s|'|’)$/.test(w)).lastIndexOf(true);
  if (pos >= 0) toks = toks.slice(pos + 1);                       // "Investcorp's Dominic Courtman"
  while (toks.length && (STOP.has(toks[0]) || isCaps(toks[0]))) toks.shift();
  const cut = toks.findIndex((w) => STOP.has(w) || isCaps(w));   // "Raj Dutta Chief Commercial Officer"
  if (cut >= 0) toks = toks.slice(0, cut);
  if (toks.length < 2 || toks.length > 4) return null;
  const n = toks.join(" ");
  return [...avoid, ...firmNames()].some((a) => a && (a.includes(n) || n.includes(a))) ? null : n;
}
function cleanNames(raw, avoid) {
  if (!raw) return null;
  const out = raw.split(/\s*(?:,|\band\b|&)\s*/).map((p) => cleanName(p, avoid)).filter(Boolean);
  return out.length ? [...new Set(out)].join(" & ") : null;
}
// The person named in a people-move headline, or null — read only from the text.
export function personOf(headline, avoid = []) {
  const h = String(headline || "");
  const v = RE_OBJ_VERB.exec(h);
  if (v) {
    RE_NAME_G.lastIndex = v.index + v[0].length;
    let m;
    while ((m = RE_NAME_G.exec(h))) { const n = cleanNames(m[1], avoid); if (n) return n; }
  }
  const s = RE_SUBJ.exec(h);
  return s ? cleanNames(s[1], avoid) : null;
}
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
// The job title: "promotes X to <role>", else "… as <role>" — cut at the clause break,
// a second person ("… and Jane Doe as …") or trailing context ("to lead …", "in Munich").
const ROLE_CUT = /\s+(?:to|while|amid|as|after|following|ahead of|from|in|in order|succeeding|replacing|based|effective|reporting|where|who|overseeing|with effect|starting|alongside|and (?:will|establishes|closes|launches|becomes))\s.*$|\s+and\s+[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+\([^)]*\))?\s+as\b.*$/;
const ROLE_JUNK = /^(?:it|they|he|she|the firm|part of|well|such|a result|of)\b|\b(?:grows?|builds?|rose|rises|surpass\w*|finalis\w*|becomes|depart\w*|exits|moves|heads to|accelerat\w*|expands|war for|replacements?|pressure|talent|intensif\w*|search\w*|seeks?|looks?|continues?|demand)\b|[$%]|^['‘’"]/i;
export function roleOf(...texts) {
  for (const t of texts) {
    const s = String(t || "");
    const m = /\bpromot\w*\s+[^,;]*?\bto\s+([^,;:]+)/i.exec(s) || /\bas (?:an? |the |its |new |our )?([^,;:]+?)(?=\s*(?:$|[,;:]|\.\s|\.$))/i.exec(s);
    if (!m) continue;
    let r = m[1].replace(ROLE_CUT, "").trim();
    if ((r.match(/\(/g) || []).length > (r.match(/\)/g) || []).length) r = r.replace(/\s*\([^)]*$/, "").trim();
    if (r.length >= 2 && r.length <= 80 && !ROLE_JUNK.test(r)) return cap(r);
  }
  return null;
}
const FIRM = "[A-Z][\\p{L}&.'’-]*(?:\\s+(?:&\\s+|of\\s+)?[A-Z][\\p{L}&.'’-]*){0,3}";
function fromFirm(...texts) {
  for (const t of texts) {
    const s = String(t || "");
    let m = new RegExp(`\\b(?:joins|joined|joining|arrives|comes|hired|moves)\\s+from\\s+(${FIRM})`, "u").exec(s)
      || new RegExp(`\\b(?:hires|poaches|rehires|appoints|taps)\\s+(${FIRM})(?:'s|’s)\\s`, "u").exec(s)
      || new RegExp(`\\bfrom\\s+(${FIRM})(?=$|[,;)]|\\.(?:\\s|$)|\\s+(?:to|as|in|where)\\b)`, "u").exec(s);
    if (m) return m[1].replace(/(?:'s|’s)\b.*$/, "").replace(/\s+(?:as|in|to)$/, "");
  }
  return null;
}
function toFirm(...texts) {
  for (const t of texts) {
    const s = String(t || "");
    const m = new RegExp(`\\b(?:to join|leaves\\b[^,]*?\\bfor|loses\\b[^,]*?\\bto|departs\\b[^,]*?\\bfor)\\s+(?:rival\\s+)?(${FIRM})`, "u").exec(s);
    if (m) return m[1];
  }
  return null;
}

// A firm as the list shows it: the record's desk qualifier dropped
// ("Canyon Partners (Credit)" → "Canyon Partners").
export const firmLabel = (f) => String(f || "").replace(/\s*\([^)]*\)\s*$/, "").trim();

// ---- the moves -------------------------------------------------------------------
const DAY = 864e5;
export function periodTags(date, now = Date.now()) {
  const t = Date.parse(date); if (!t) return ["older"];
  const d = (now - t) / DAY;
  return d <= 30 ? ["30d", "90d", "12m"] : d <= 90 ? ["90d", "12m"] : d <= 365 ? ["12m"] : ["older"];
}
let _moves = null;
export function peopleMoves() {
  if (_moves) return _moves;
  const out = [];
  // First sentence of the summary ("J.P. Morgan" / "U.S." are not sentence ends).
  const firstSentence = (s) => String(s || "").split(/(?<=[a-z0-9)]{2}\.)\s+(?=[A-Z])/)[0];
  const push = (o) => {
    const text = o.headline;
    const type = moveType(text);
    // A departure's summary "as …" is usually the role it held before — headline only.
    const role = type === "Departure" ? roleOf(text) : roleOf(text, firstSentence(o.summary));
    // The name from the headline, else from the summary's first sentence (still read
    // from the item's own text — never guessed). No name → "Unknown" in the list.
    const person = personOf(text, [o.firm]) || personOf(firstSentence(o.summary), [o.firm]);
    let from = null, to = null;
    // Filed under the firm the person LEFT ("Oaktree hires Permira Credit's Jens Bauer"
    // on Permira's record): read it as that firm's departure, to the hiring firm.
    const fx = type === "Hire" ? fromFirm(text) : null;
    if (fx && (o.firm.includes(fx) || fx.includes(o.firm.replace(/\s*\(.*?\)\s*/g, " ").trim()))) {
      const hirer = new RegExp(`^(${FIRM})\\s+(?:hires|rehires|poaches|appoints|taps|adds|recruits|names)\\b`, "u").exec(text);
      out.push({ ...o, type: "Departure", role, person, from: o.firm, to: hirer ? hirer[1] : null, seniority: seniority(role || text) });
      return;
    }
    if (type === "Departure") { from = o.firm; to = toFirm(text, firstSentence(o.summary)); }
    else if (type === "Promotion" || type === "Other") { from = null; to = o.firm; }
    else { to = o.firm; from = fromFirm(text, firstSentence(o.summary)); if (from && (from === o.firm || o.firm.includes(from))) from = null; }
    out.push({ ...o, type, role, person, from, to, seniority: seniority(role || text.replace(o.firm, " ")) });
  };
  for (const i of intel || []) {
    if (!i.headline || !i.date || !i.managerId || !managerById[i.managerId]) continue;
    if (i.type !== "Personnel" && !CREDIT_EXTRA.test(i.headline)) continue;
    const m = managerById[i.managerId];
    push({ id: i.id, date: i.date, headline: i.headline, summary: i.summary, url: i.sourceUrl || "", src: creditSource(i), firm: m.name, href: `#/manager/${m.id}`, kind: "Credit manager" });
  }
  const hfById = Object.fromEntries((HEDGE_FUNDS || []).map((f) => [f.id, f]));
  for (const h of HEDGE_INTEL || []) {
    if (h.type !== "Personnel" || !h.headline || !h.date || !hfById[h.hfId]) continue;
    const f = hfById[h.hfId], u = h.sourceUrl || h.url || "";
    push({ id: h.id, date: h.date, headline: h.headline, summary: h.summary, url: u, src: h.outlet || (srcHost(u) ? tidyDomain(srcHost(u)) : ""), firm: f.name, href: `#/hf/${f.id}`, kind: "Hedge fund" });
  }
  for (const it of LEGAL_ITEMS || []) {
    const t = it.title || "";
    if (!it.date || !LEGAL_MOVE.test(t) || !LEGAL_PERSON.test(t) || LEGAL_NOT.test(t)) continue;
    const f = firmById[it.firm]; if (!f) continue;
    const u = it.url || "";
    push({ id: it.id, date: it.date, headline: t, summary: it.summary, url: u, src: srcHost(u) ? tidyDomain(srcHost(u)) : f.name, firm: f.name, href: `#/firm/${encodeURIComponent(f.id)}`, kind: "Law firm" });
  }
  out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  // One row per move: the same named person moving to the same firm, reported by two
  // outlets within a fortnight, is one story (keep the newest report).
  const seen = new Map();
  _moves = out.filter((r) => {
    if (!r.person) return true;
    const k = `${r.person.toLowerCase()}|${firmLabel(r.to || r.firm).toLowerCase()}`;
    const t = Date.parse(r.date) || 0, prev = seen.get(k);
    if (prev != null && Math.abs(prev - t) <= 14 * DAY) return false;
    seen.set(k, t); return true;
  });
  return _moves;
}

// ---- the list pane (same shape as the other Profiles lists: .tpane > search bar +
// .tleague table with data-f-<facet> rows the shared Filters panel reads) -----------
export function peoplePaneHTML() {
  const now = Date.now();
  const rows = peopleMoves().map((r) => {
    // Owner 2026-10-17: line 1 is the NAME only ("Unknown" when the item doesn't name
    // anyone — never the headline); line 2 is the firm they LEFT (left) and the firm they
    // JOINED (right). A promotion stays within one firm, so both sides read that firm.
    // A side the item doesn't state reads "Unknown".
    const same = r.type === "Promotion";
    const left = firmLabel(same ? (r.to || r.firm) : r.from) || "Unknown";
    const right = firmLabel(r.type === "Departure" ? r.to : (r.to || r.firm)) || "Unknown";
    const who = r.person || "Unknown";
    return `<tr class="clickable" data-href="${esc(r.href)}" data-id="${esc(r.id)}" title="${esc([r.headline, r.role, r.type, r.seniority].filter(Boolean).join(" · "))}"`
      + ` data-name="${esc([r.person, r.role, r.firm, r.from, r.to, r.headline].filter(Boolean).join(" ").toLowerCase())}"`
      + ` data-f-firm="${esc(r.firm)}" data-f-move="${esc(r.type)}" data-f-seniority="${esc(r.seniority)}" data-f-period="${periodTags(r.date, now).join("|")}" data-f-kind="${esc(r.kind)}">`
      + `<td class="pf-c-main pp-date c-date" data-sort="${Date.parse(r.date) || ""}">${esc(fmtDate(r))}</td>`
      + `<td class="tl-nm pp-who${r.person ? "" : " pp-unk"}">${esc(who)}</td>`
      + `<td class="pf-c-meta pp-move c-tag"><span class="dsh-tag pp-mv pp-mv-${r.type.toLowerCase()}">${esc(r.type)}</span></td>`
      + `<td class="pf-c-meta pp-role">${r.role ? esc(r.role) : "—"}</td>`
      + `<td class="pp-sen">${esc(r.seniority)}</td>`
      + `<td class="pf-c-meta pp-from${left === "Unknown" ? " pp-unk" : ""}">${esc(left)}</td>`
      + `<td class="pf-c-meta pp-to${right === "Unknown" ? " pp-unk" : ""}">${esc(right)}</td>`
      + `<td class="pp-src-c c-src">${r.url ? `<a class="pp-src" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" title="${esc(r.headline)}">${esc(r.src || "source")}</a>` : "—"}</td></tr>`;
  }).join("");
  return `<div class="tpane" data-pane="people" hidden>
              <header class="tpanel-h thead-search">
                <input type="search" id="pp-q" class="tsearch" placeholder="Search person, role or firm…" aria-label="Search people moves">
              </header>
              <div class="tleague-wrap">
              <table class="tleague tleague-full pf-cards pp-tbl" data-events="1">
                <thead><tr><th class="c-date">Date</th><th>Person</th><th class="c-tag">Move</th><th>Role</th><th>Seniority</th><th>From</th><th>To</th><th class="c-src">Source</th></tr></thead>
                <tbody id="pp-rows">${rows}</tbody>
              </table>
              </div>
            </div>`;
}
