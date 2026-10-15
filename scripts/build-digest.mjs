// =============================================================================
// build-digest.mjs — the credit-desk DIGEST (daily + weekly), built from committed
// data only, written as the tokenless data module /digest.js (Menu ▸ Digest,
// shareable at /v2/menu/digest and /v2/menu/digest/weekly).
//
// Two windows, anchored on an as-of DAY (today UTC unless --asof is given):
//   daily  — records dated as-of day or the day before (the data is day-granular, so
//            "the last 24h" is read as yesterday + today)
//   weekly — the 7 days ending on the as-of day
// For each window it summarises:
//   • Top deals by size — credit `deals`, ranked by the first amount the record's OWN
//     headline states (EUR/GBP converted with the committed AUM_FX for RANKING only;
//     the verbatim headline figure is what is shown). Unsized deals fill any gap.
//   • Fund closes & fundraising — credit `intel` of a close / fundraise type.
//   • Restructuring & legal — schemes / restructuring plans, reported judgments,
//     Restructuring & Insolvency client alerts, restructuring intel.
//   • People moves — credit + hedge-fund `Personnel` intel.
//   • Rates & spreads — 1-day / 1-week moves from the committed last-known payloads
//     (dashboard/js/live-snapshot.js); omitted when the snapshot has no series.
// Every item keeps its real source URL + date; an item without a source URL is left
// out (never a dead row). Nothing is fetched and nothing is invented.
//
// Usage:
//   node scripts/build-digest.mjs                 # writes digest.js (as-of today)
//   node scripts/build-digest.mjs --asof=2026-10-15
//   node scripts/build-digest.mjs --dry-run       # print the JSON, write nothing
//   node scripts/build-digest.mjs --email[=weekly] [--origin=https://<live host>]
//                                  # print a plain-text email (subject on line 1)
// The refresh routine runs it (docs/refresh-routines.md ▸ Morning digest). It is NOT
// in `npm run build`: its windows move with the calendar, so it is not deterministic
// per commit the way gen-home-data is.
// =============================================================================
import fs from "node:fs";
import { statedAmounts } from "./lib/money.mjs";
import * as CR from "../credit/js/data.js";
import * as LG from "../legal/js/data.js";

const FILE = new URL("../digest.js", import.meta.url);
const args = process.argv.slice(2);
const opt = (n) => { const a = args.find((x) => x === n || x.startsWith(n + "=")); return a == null ? null : (a.includes("=") ? a.split("=")[1] : true); };

const DAY = 86400000;
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
const asOfArg = opt("--asof");
const ASOF = typeof asOfArg === "string" && /^\d{4}-\d{2}-\d{2}$/.test(asOfArg) ? asOfArg : iso(Date.now());
const asOfMs = Date.parse(ASOF + "T00:00:00Z");
const WINDOWS = {
  daily: { from: iso(asOfMs - DAY), to: ASOF, label: "Daily", cap: 6 },
  weekly: { from: iso(asOfMs - 6 * DAY), to: ASOF, label: "Weekly", cap: 10 },
};
const inWin = (w, d) => !!d && String(d).slice(0, 10) >= w.from && String(d).slice(0, 10) <= w.to;

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return null; } };
const isUrl = (u) => typeof u === "string" && /^https?:\/\//.test(u);
const mgrName = (id) => { const m = (CR.managers || []).find((x) => x.id === id); return m ? m.name : null; };
const hfName = (id) => { const h = (CR.HEDGE_FUNDS || []).find((x) => x.id === id); return h ? h.name : null; };
const firmName = (id) => (((LG.firmById || {})[id]) || {}).name || null;

// The first currency figure the headline states → { text, usdBn } (usdBn for ranking).
const FX = CR.AUM_FX || {};
const TO_USD = { USD: 1, EUR: FX.EURUSD || null, GBP: FX.GBPUSD || null };
const AMT_RE = /(US\$|USD|EUR|GBP|[$€£])\s*~?\s*\d[\d.,]*\s*(?:tn|trillion|bn|billion|mn|million|m\b|b\b)?/i;
function headlineAmount(text) {
  const t = String(text || "");
  const m = t.match(AMT_RE);
  if (!m) return null;
  const a = statedAmounts(m[0], "bn")[0];
  if (!a) return null;
  const fx = TO_USD[a.ccy];
  return { text: m[0].replace(/\s+/g, " ").trim(), usdBn: fx ? a.v * fx : null };
}
const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.time || "").localeCompare(String(a.time || ""));

function item(r, { title, url, who, kind, href }) {
  if (!isUrl(url)) return null;
  return { id: r.id || null, date: r.date || null, title: String(title || "").trim(), url, src: host(url), who: who || null, kind: kind || null, href: href || null };
}

function deals(w) {
  const rows = (CR.deals || []).filter((d) => inWin(w, d.date)).map((d) => {
    const it = item(d, { title: d.headline, url: d.sourceUrl, who: mgrName(d.managerId), kind: d.type, href: "/v2/transactions/#/deal/" + encodeURIComponent(d.id) });
    if (!it) return null;
    const amt = headlineAmount(d.headline);
    it.amount = amt ? amt.text : null;
    it._rank = amt && amt.usdBn != null ? amt.usdBn : -1;
    return it;
  }).filter(Boolean);
  rows.sort((a, b) => (b._rank - a._rank) || byDateDesc(a, b));
  return { total: rows.length, items: rows.slice(0, w.cap).map(({ _rank, ...x }) => x) };
}

const CLOSE_RE = /close|fundrais/i;
function closes(w) {
  const rows = (CR.intel || []).filter((i) => inWin(w, i.date) && CLOSE_RE.test(i.type || "")).map((i) => {
    const it = item(i, { title: i.headline, url: i.sourceUrl, who: mgrName(i.managerId), kind: i.type, href: i.managerId ? "/v2/profiles/#/manager/" + encodeURIComponent(i.managerId) : null });
    if (!it) return null;
    const amt = headlineAmount(i.headline);
    it.amount = amt ? amt.text : null;
    it._rank = amt && amt.usdBn != null ? amt.usdBn : -1;
    return it;
  }).filter(Boolean);
  rows.sort((a, b) => (b._rank - a._rank) || byDateDesc(a, b));
  return { total: rows.length, items: rows.slice(0, w.cap).map(({ _rank, ...x }) => x) };
}

function legal(w) {
  const rx = (LG.restructurings || []).filter((r) => inWin(w, r.date)).map((r) => item(r, {
    title: `${r.company} — ${r.type === "scheme" ? "scheme of arrangement" : r.type === "rp" || r.type === "plan" ? "restructuring plan" : (r.type || "restructuring")}${r.court ? ` (${r.court})` : ""}`,
    url: r.judgmentUrl || r.articleUrl, who: r.citation || null, kind: "Restructuring",
  }));
  const cases = (LG.cases || []).filter((c) => inWin(w, c.date)).map((c) => item(c, { title: c.name + (c.citation ? ` ${c.citation}` : ""), url: c.url, who: c.court || null, kind: "Judgment" }));
  const alerts = (LG.items || []).filter((i) => inWin(w, i.date) && (i.area === "ri" || (i.areas || []).includes("ri"))).map((i) => item(i, { title: i.title, url: i.url, who: firmName(i.firm), kind: "R&I alert", href: i.firm ? "/v2/profiles/#/firm/" + encodeURIComponent(i.firm) : null }));
  const rxIntel = (CR.intel || []).filter((i) => inWin(w, i.date) && /restructur/i.test(i.type || "")).map((i) => item(i, { title: i.headline, url: i.sourceUrl, who: mgrName(i.managerId), kind: "Restructuring" }));
  // Schemes/plans first (the rarest, most material), then judgments, then the rest.
  const rows = [...rx, ...cases, ...rxIntel, ...alerts].filter(Boolean);
  const rank = (x) => (x.kind === "Restructuring" ? 0 : x.kind === "Judgment" ? 1 : 2);
  rows.sort((a, b) => (rank(a) - rank(b)) || byDateDesc(a, b));
  return { total: rows.length, items: rows.slice(0, w.cap) };
}

function people(w) {
  const cr = (CR.intel || []).filter((i) => inWin(w, i.date) && /personnel/i.test(i.type || "")).map((i) => item(i, { title: i.headline, url: i.sourceUrl, who: mgrName(i.managerId), kind: "Credit", href: i.managerId ? "/v2/profiles/#/manager/" + encodeURIComponent(i.managerId) : null }));
  const hf = (CR.HEDGE_INTEL || []).filter((i) => inWin(w, i.date) && /personnel/i.test(i.type || "")).map((i) => item(i, { title: i.headline, url: i.sourceUrl, who: hfName(i.hfId), kind: "Hedge fund", href: i.hfId ? "/v2/profiles/#/hf/" + encodeURIComponent(i.hfId) : null }));
  const rows = [...cr, ...hf].filter(Boolean).sort(byDateDesc);
  return { total: rows.length, items: rows.slice(0, w.cap) };
}

// ---- Rates & spreads from the committed last-known payloads -------------------
let SNAP = null;
try { SNAP = (await import("../dashboard/js/live-snapshot.js")).LIVE_SNAPSHOT || null; } catch { SNAP = null; }
const RATE_PICK = /OAS$|^US (2Y|10Y)$|^SOFR$|^SONIA$/i;
function seriesMove(s, days) {
  // /api/rates rows: history[] aligned with historyDates[] (daily for most series).
  const h = s.history || [], hd = s.historyDates || [];
  if (h.length < 2 || hd.length !== h.length || !/^\d{4}-\d{2}-\d{2}$/.test(hd[hd.length - 1])) return null;
  const last = h[h.length - 1];
  if (days === 1) return last - h[h.length - 2];
  const cut = iso(Date.parse(hd[hd.length - 1] + "T00:00:00Z") - days * DAY);
  for (let i = hd.length - 1; i >= 0; i--) if (hd[i] <= cut) return last - h[i];
  return null;
}
function rates(win) {
  const p = SNAP && SNAP.payloads ? SNAP.payloads : {};
  const out = [];
  const days = win === "daily" ? 1 : 7;
  for (const s of (((p["/api/rates"] || {}).data || {}).rates || [])) {
    if (!s || s.value == null || !RATE_PICK.test(s.label || "") || !isUrl(s.href)) continue;
    const chg = seriesMove(s, days);
    if (chg == null) continue;
    const oas = /OAS/i.test(s.label);
    out.push({ label: s.label, value: s.value, unit: oas ? "bp" : "%", display: oas ? Math.round(s.value * 100) : s.value, chg: oas ? Math.round(chg * 100) : Math.round(chg * 1000) / 1000, chgUnit: oas ? "bp" : "pp", asOf: s.asOf || null, url: s.href, src: host(s.href) });
  }
  for (const s of (((p["/api/eurates"] || {}).data || {}).series || [])) {
    if (!s || s.value == null || !isUrl(s.href) || !/^(ecb_dfr|estr|boe_bank)$/.test(s.key || "")) continue;
    const chg = win === "daily" ? null : s.chg1w;
    if (chg == null && win !== "daily") continue;
    if (win === "daily") {
      const h = s.history || [];
      if (h.length < 2) continue;
      const d1 = h[h.length - 1][1] - h[h.length - 2][1];
      out.push({ label: s.label, value: s.value, unit: "%", display: s.value, chg: Math.round(d1 * 1000) / 1000, chgUnit: "pp", asOf: s.asOf || null, url: s.href, src: host(s.href) });
    } else out.push({ label: s.label, value: s.value, unit: "%", display: s.value, chg: Math.round(chg * 1000) / 1000, chgUnit: "pp", asOf: s.asOf || null, url: s.href, src: host(s.href) });
  }
  const savedAt = ((p["/api/rates"] || {}).savedAt) || ((p["/api/eurates"] || {}).savedAt) || null;
  return { savedAt, items: out };
}

function build() {
  const out = { asOf: ASOF, built: new Date().toISOString(), daily: null, weekly: null };
  for (const [k, w] of Object.entries(WINDOWS)) {
    out[k] = { label: w.label, from: w.from, to: w.to, deals: deals(w), closes: closes(w), legal: legal(w), people: people(w), rates: rates(k) };
  }
  return out;
}

function render(d) {
  return "// =============================================================================\n"
    + "// digest.js — the credit-desk DIGEST (Menu ▸ Digest; /v2/menu/digest[/weekly]).\n"
    + "// AUTO-GENERATED by scripts/build-digest.mjs from committed data only — do not\n"
    + "// hand-edit; re-run the script. Tokenless + no-cache (see _headers).\n"
    + "// =============================================================================\n"
    + "export const DIGEST = " + JSON.stringify(d, null, 1) + ";\n";
}

// Plain-text email for the routine to send via the Gmail connector.
function emailText(d, which) {
  const W = d[which];
  const fmt = (s) => new Date(s + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  const range = W.from === W.to ? fmt(W.to) : `${fmt(W.from)} – ${fmt(W.to)}`;
  const lines = [`Wire ${W.label.toLowerCase()} credit digest — ${range}`, ""];
  const sec = (title, block, line) => {
    lines.push(title.toUpperCase());
    if (!block.items.length) lines.push("  Nothing new in this window.");
    for (const x of block.items) lines.push(...line(x));
    lines.push("");
  };
  sec("Top deals by size", W.deals, (x) => [`• ${x.title}${x.who ? ` (${x.who})` : ""} — ${x.date}`, `  ${x.url}`]);
  sec("Fund closes & fundraising", W.closes, (x) => [`• ${x.title} — ${x.date}`, `  ${x.url}`]);
  sec("Restructuring & legal", W.legal, (x) => [`• ${x.title}${x.who ? ` — ${x.who}` : ""} — ${x.date}`, `  ${x.url}`]);
  sec("People moves", W.people, (x) => [`• ${x.title} — ${x.date}`, `  ${x.url}`]);
  if (W.rates.items.length) sec(`Rates & spreads (${which === "daily" ? "1-day" : "1-week"} change)`, W.rates, (x) => [`• ${x.label} ${x.display}${x.unit === "bp" ? "bp" : "%"} (${x.chg > 0 ? "+" : ""}${x.chg}${x.chgUnit}, as of ${x.asOf}) — ${x.url}`]);
  // The live origin is not in the repo, so it is passed in (--origin= / WIRE_ORIGIN);
  // without one the in-app path alone is printed.
  const origin = String(opt("--origin") || process.env.WIRE_ORIGIN || "").replace(/\/+$/, "");
  lines.push(`In Wire: ${origin}/v2/menu/digest${which === "weekly" ? "/weekly" : ""}`);
  return lines.join("\n");
}

const D = build();
const email = opt("--email");
if (email) {
  console.log(emailText(D, email === "weekly" ? "weekly" : "daily"));
} else if (opt("--dry-run")) {
  console.log(JSON.stringify(D, null, 2));
} else {
  fs.writeFileSync(FILE, render(D));
  const n = (w) => ["deals", "closes", "legal", "people"].map((k) => `${k} ${D[w][k].total}`).join(" · ");
  console.log(`build-digest: wrote digest.js (as of ${ASOF}) — daily: ${n("daily")} · weekly: ${n("weekly")}`);
}
