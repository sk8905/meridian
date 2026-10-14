// =============================================================================
// collect-manager-news.mjs — credit managers' OWN news / press pages, read from their
// own websites (sitemaps + each page's own metadata), exactly as collect-firm-news.mjs
// does for law firms (same reader: robots.txt honoured, polite per-site pacing).
//
// Why: managers' own website news ("webNews", the bell) went 16 days stale and new
// deal / fundraising flow ran at under half its usual weekly level — the routines'
// containers can't reach most manager sites. A manager's own release is the PRIMARY
// source, so the heavy-sweep routine can record from it directly.
//
// Domains: no manager record carries a website field, so each manager's own domain(s)
// are inferred from the hosts of its existing webNews / sources whose name matches
// the manager's distinctive name words (news outlets, wires and social sites excluded).
//
// Runs in a GitHub Action (.github/workflows/collect-manager-news.yml):
//   node scripts/collect-manager-news.mjs --since=14d --max=20 > backfill/manager-news.json
// =============================================================================
import * as C from "../credit/js/data.js";
import { collectFirm, parseSince } from "./collect-firm-news.mjs";

const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.slice(n.length + 1) : d; };

const STOP = new Set("capital partners management asset assets investment investments group global credit advisors advisers the and fund funds private debt europe european international lending finance llp ltd sa ag gmbh holdings company co corp".split(" "));
const NOT_OWN = /(linkedin|twitter|x\.com|facebook|youtube|instagram|wikipedia|bloomberg|reuters|ft\.com|wsj|economist|cnbc|businesswire|prnewswire|globenewswire|newswire|sec\.gov|google|privatedebtinvestor|creditflux|pitchbook|altassets|alternativecreditinvestor|realdeals|penews|pehub|institutionalinvestor|ipe\.com|privateequitywire|hedgeweek|finextra|marketscreener|yahoo|investing\.com|cityam|thetimes|telegraph|guardian|lexology|mondaq|law360|9fin|octus|debtwire)/i;
const toks = (n) => String(n || "").toLowerCase().replace(/\(.*?\)/g, "").split(/[^a-z0-9]+/).filter((t) => t.length >= 3 && !STOP.has(t));
const host = (u) => { try { return new URL(u).hostname.toLowerCase(); } catch { return ""; } };
const normUrl = (u) => String(u || "").toLowerCase().replace(/^https?:\/\/(www\.)?/, "").split(/[?#]/)[0].replace(/\/+$/, "");

// A host is the manager's own when a distinctive name word appears in its registrable
// label ("icgam.com" ← "ICG", "tikehaucapital.com" ← "Tikehau").
export function ownHost(h, name) {
  if (!h || NOT_OWN.test(h)) return false;
  const labels = h.replace(/^www\./, "").split(".").slice(0, -1);
  return toks(name).some((t) => labels.some((l) => l.includes(t) || (l.length >= 4 && t.includes(l))));
}
export function managerDomains(managers = C.managers || []) {
  const out = {};
  for (const m of managers) {
    const urls = [...(m.webNews || []).map((w) => w && w.url), ...(m.sources || []).map((s) => (typeof s === "string" ? s : s && s.url))].filter(Boolean);
    const hs = [...new Set(urls.map(host))].filter((h) => ownHost(h, m.name));
    if (hs.length) out[m.id] = hs.slice(0, 3);
  }
  return out;
}
// Every URL Wire already holds for managers (their webNews + deal/intel sources).
export function knownManagerUrls() {
  const s = new Set();
  for (const m of C.managers || []) for (const w of m.webNews || []) if (w && w.url) s.add(normUrl(w.url));
  for (const r of [...(C.deals || []), ...(C.intel || [])]) if (r.sourceUrl) s.add(normUrl(r.sourceUrl));
  return s;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const since = parseSince(opt("--since", "14d"));
  const max = Math.max(1, parseInt(opt("--max", "20"), 10) || 20);
  const only = opt("--manager", "");
  const doms = managerDomains();
  const byId = new Map((C.managers || []).map((m) => [m.id, m]));
  const ids = Object.keys(doms).filter((id) => !only || id === only);
  const skip = knownManagerUrls();
  const managers = {}, items = [];
  const queue = [...ids];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const id = queue.shift();
      const name = (byId.get(id) || {}).name || "";
      const r = await collectFirm(id, doms[id], { since, max, skip, name });
      managers[id] = { name, ...r.stat };
      for (const it of r.items) { const { firm, ...rest } = it; items.push({ managerId: firm, manager: name, ...rest }); }
    }
  }));
  items.sort((a, b) => String(b.date || b.lastmod || "").localeCompare(String(a.date || a.lastmod || "")));
  console.log(JSON.stringify({ generated: new Date().toISOString(), since, managers, items }, null, 1));
  const ok = Object.values(managers).filter((s) => s.sitemaps > 0).length;
  console.error(`manager news: ${items.length} items from ${ok}/${ids.length} managers with a readable sitemap (since ${since})`);
  if (!ok) process.exit(2);
}
