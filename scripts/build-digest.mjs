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
//                                  # print the plain-text email (subject on line 1)
//   node scripts/build-digest.mjs --email[=weekly] --html [--origin=…]
//                                  # print the HTML body (subject on line 1) — "[link]"s
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

// The morning email, as rows → rendered two ways. Owner rule 2026-10-20 (HOUSE_STYLE
// R39m): the HTML body shows a short "[link]" after each item — the long source URL
// sits behind it, never printed in the text. The plain-text body is only the fallback
// part for mail clients that cannot show HTML (there the bare URL is the only way to
// link, so it stays).
export function emailRows(d, which) {
  const W = d[which];
  const fmt = (s) => new Date(s + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  const range = W.from === W.to ? fmt(W.to) : `${fmt(W.from)} – ${fmt(W.to)}`;
  const rows = [];
  const sec = (title, block, text) => {
    rows.push({ h: title.toUpperCase() });
    if (!block.items.length) rows.push({ empty: "Nothing new in this window." });
    for (const x of block.items) rows.push({ text: text(x), url: x.url });
  };
  sec("Top deals by size", W.deals, (x) => `${x.title}${x.who ? ` (${x.who})` : ""} — ${x.date}`);
  sec("Fund closes & fundraising", W.closes, (x) => `${x.title} — ${x.date}`);
  sec("Restructuring & legal", W.legal, (x) => `${x.title}${x.who ? ` — ${x.who}` : ""} — ${x.date}`);
  sec("People moves", W.people, (x) => `${x.title} — ${x.date}`);
  if (W.rates.items.length) {
    // "12 Oct": short enough that no line wraps on a phone. The change carries its
    // direction so the HTML body can colour it (up green / down red, as the app's Digest).
    rows.push({ h: `Rates & spreads (${which === "daily" ? "1-day" : "1-week"} change)`.toUpperCase() });
    for (const x of W.rates.items) {
      const rate = { head: `${x.label} ${x.display}${x.unit === "bp" ? "bp" : "%"}`, chg: `${x.chg > 0 ? "+" : ""}${x.chg}${x.chgUnit}`, dir: x.chg > 0 ? "up" : x.chg < 0 ? "down" : "flat", date: x.asOf ? fmt(x.asOf) : "date n/a" };
      rows.push({ text: `${rate.head} (${rate.chg}, ${rate.date})`, url: x.url, rate });
    }
  }
  // The live origin is not in the repo, so it is passed in (--origin= / WIRE_ORIGIN);
  // without one the in-app path alone is printed.
  const origin = String(opt("--origin") || process.env.WIRE_ORIGIN || "").replace(/\/+$/, "");
  return { subject: `Wire ${W.label.toLowerCase()} credit digest — ${range}`, rows, app: `${origin}/v2/menu/digest${which === "weekly" ? "/weekly" : ""}` };
}
// Plain-text fallback part (subject on line 1).
export function emailText(d, which) {
  const { subject, rows, app } = emailRows(d, which);
  const lines = [subject, ""];
  rows.forEach((r, i) => {
    if (r.h) { if (i) lines.push(""); lines.push(r.h); }
    else if (r.empty) lines.push("  " + r.empty);
    else lines.push(`• ${r.text} — ${r.url}`);
  });
  lines.push("", `In Wire: ${app}`);
  return lines.join("\n");
}
const escH = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Rate-change colours = the app Digest's light theme (v2/css/app.css --cov-good / --cov-fail):
// an increase reads green, a decrease red, no change grey.
export const RATE_COLOUR = { up: "#0f9d68", down: "#df4763", flat: "#8b96ac" };
// HTML body: each item ends in a short orange-underlined "[link]" (the house link style).
export function emailHtml(d, which) {
  const { subject, rows, app } = emailRows(d, which);
  const a = (u, t = "[link]") => `<a href="${escH(u)}" style="color:#fb8b1e;text-decoration:underline">${t}</a>`;
  const out = [];
  let open = false;
  const close = () => { if (open) { out.push("</ul>"); open = false; } };
  for (const r of rows) {
    if (r.h) { close(); out.push(`<p style="margin:18px 0 6px;font-weight:bold;letter-spacing:.04em">${escH(r.h)}</p>`); continue; }
    if (!open) { out.push('<ul style="margin:0;padding-left:18px">'); open = true; }
    const body = r.rate ? `${escH(r.rate.head)} (<span style="color:${RATE_COLOUR[r.rate.dir]}">${escH(r.rate.chg)}</span>, ${escH(r.rate.date)})` : escH(r.text);
    out.push(r.empty ? `<li style="margin:3px 0;color:#777">${escH(r.empty)}</li>` : `<li style="margin:3px 0">${body} ${a(r.url)}</li>`);
  }
  close();
  out.push(`<p style="margin:18px 0 0">In Wire: ${/^https?:/.test(app) ? a(app, "open the digest") : escH(app)}</p>`);
  return `${escH(subject)}\n<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#222">${out.join("")}</div>`;
}

const D = build();
const email = opt("--email");
if (email) {
  const which = email === "weekly" ? "weekly" : "daily";
  console.log(opt("--html") ? emailHtml(D, which) : emailText(D, which));
} else if (opt("--dry-run")) {
  console.log(JSON.stringify(D, null, 2));
} else {
  fs.writeFileSync(FILE, render(D));
  const n = (w) => ["deals", "closes", "legal", "people"].map((k) => `${k} ${D[w][k].total}`).join(" · ");
  console.log(`build-digest: wrote digest.js (as of ${ASOF}) — daily: ${n("daily")} · weekly: ${n("weekly")}`);
}
