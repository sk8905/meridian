// =============================================================================
// collect-firm-news.mjs — law firms' OWN publications, read from their own sites.
//
// Why: the routines run in containers that can't reach most firm websites (lw.com,
// kirkland.com, … are blocked), so they rejected real client alerts they couldn't
// open, and legal flow collapsed. This script runs in a GitHub Action (open
// internet). For each tracked firm it reads the site's sitemap(s), keeps article URLs
// in the publication paths (news / insights / deals / knowledge …) whose <lastmod> is
// in the window and whose slug looks in-scope (finance, credit, restructuring, funds,
// M&A …), then fetches each page and captures the page's OWN metadata — og:title,
// description and the published date (article:published_time / JSON-LD datePublished
// / <time datetime>). That is primary-source evidence: the routine records the alert
// from it (firm page URL, exact published date, title; summary only from the
// description) without needing to reach the site itself.
//
// Output (JSON): { generated, since, firms: {id: {domains, sitemaps, urls, kept,
// fetched, errors}}, items: [{firm, url, title, description, date, dateSource}] }
//
// Usage:
//   node scripts/collect-firm-news.mjs --since=14d [--max=40] > firm-news.json
//   node scripts/collect-firm-news.mjs --since=2020-01-01 --max=400 > firm-history.json
//   node scripts/collect-firm-news.mjs --firm=latham --since=30d
// =============================================================================
import * as LG from "../legal/js/data.js";

const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.slice(n.length + 1) : d; };
const UA = "Mozilla/5.0 (compatible; WireMonitor/1.0; +https://github.com/sk8905/meridian)";
const DAY = 86400000;

export function parseSince(s, now = Date.now()) {
  const m = /^(\d+)d$/.exec(String(s || "14d"));
  if (m) return new Date(now - +m[1] * DAY).toISOString().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : new Date(now - 14 * DAY).toISOString().slice(0, 10);
}

// ---- which sites belong to each firm ---------------------------------------------
// The firm's insights page host, plus every host its existing Wire items live on that
// shares the firm's registrable domain (finreg.aoshearman.com, eurorestructuring.weil.com…).
const EXTRA = { proskauerrose: ["www.proskauer.com"], stephensonharwood: ["www.shlegal.com"] };
const host = (u) => { try { return new URL(u).hostname; } catch { return ""; } };
const root = (h) => h.split(".").slice(-2).join(".");
export function firmDomains() {
  const out = {};
  for (const f of LG.firms || []) {
    const set = new Set(EXTRA[f.id] || []);
    const ih = host(f.insightsUrl); if (ih) set.add(ih);
    const roots = new Set([...set].map(root));
    for (const i of (LG.items || []).filter((x) => x.firm === f.id)) { const h = host(i.url); if (h && roots.has(root(h))) set.add(h); }
    out[f.id] = [...set];
  }
  return out;
}

// ---- sitemap parsing (no deps) -------------------------------------------------------
const ENT = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", ndash: "–", mdash: "—", hellip: "…" };
const decode = (s) => String(s || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(/^#x/i.test(e) ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENT[e.toLowerCase()] ?? m).trim();
export function parseSitemap(xml) {
  const x = String(xml || "");
  const index = [...x.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g)].map(([, b]) => decode((/<loc>([\s\S]*?)<\/loc>/.exec(b) || [])[1]));
  const urls = [...x.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, b]) => ({
    loc: decode((/<loc>([\s\S]*?)<\/loc>/.exec(b) || [])[1]),
    lastmod: decode((/<lastmod>([\s\S]*?)<\/lastmod>/.exec(b) || [])[1]).slice(0, 10) || null,
  })).filter((u) => u.loc);
  return { index: index.filter(Boolean), urls };
}
export function sitemapsFromRobots(txt) { return [...String(txt || "").matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]); }

// Publication paths, and slugs that look in scope for the four practice areas.
const PUB_PATH = /\/(news|insights?|publications?|pubs?|deals?|knowledge|our-thinking|thinking|what-we-think|briefings?|client-alerts?|alerts?|articles?|articles-publications|perspectives|press|press-releases|releases?|newsroom|blogs?|updates?|legal-updates|transactions|experience|thought-leadership|client-memos?|memos?|news-and-insights)\//i;
const NOT_PUB = /\/(events?|webinars?|people|lawyers|professionals|careers|offices?|locations)(?:[-/]|$)/i;
// Non-English locale copies of a page ("/ja/our-thinking/…") duplicate the English one.
const NON_EN = /\/(ja|zh|fr|de|es|it|pt|ko|ar|ru|nl|pl|tr)(?:-[a-z]{2,4})?\//i;
const IN_SCOPE = /(financ|lend|loan|credit|debt|bond|notes?-|note-offering|securiti[sz]|clo\b|clos\b|abs\b|cmbs|rmbs|refinanc|restructur|insolven|scheme|part-26|chapter-11|administration|distress|fund|capital|private-equity|acqui|merger|m-a\b|takeover|disposal|ipo|listing|investment|investor|lender|bank|regulat|fca|pra|aifm|eltif|tax|nav-|continuation|secondar|infrastructure|project|real-estate)/i;
export function wanted(u, since) {
  if (!PUB_PATH.test(u.loc) || NOT_PUB.test(u.loc) || NON_EN.test(u.loc) || /\.pdf(?:[?#]|$)|\/download\//i.test(u.loc)) return false;
  if (u.lastmod && u.lastmod < since) return false;
  const slug = decodeURIComponent(u.loc.split(/[?#]/)[0]).toLowerCase();
  return IN_SCOPE.test(slug);
}

// ---- page metadata -------------------------------------------------------------------
const meta = (html, re) => { const m = re.exec(html); return m ? decode(m[1]).replace(/\s+/g, " ").trim() : null; };
const attr = (html, key, val) => meta(html, new RegExp(`<meta[^>]+${key}=["']${val}["'][^>]*content=["']([^"']+)["']`, "i"))
  || meta(html, new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*${key}=["']${val}["']`, "i"));
const iso = (s) => { if (!s) return null; const m = /(\d{4})-(\d{2})-(\d{2})/.exec(s); if (m) return +m[2] >= 1 && +m[2] <= 12 && +m[3] >= 1 && +m[3] <= 31 ? `${m[1]}-${m[2]}-${m[3]}` : null; const t = Date.parse(s); return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10); };
const MONTH = "(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?";
const DATEISH = new RegExp(`\\b20\\d{2}-\\d{2}-\\d{2}\\b|\\b\\d{1,2}\\s+${MONTH}\\s+20\\d{2}\\b|\\b${MONTH}\\s+\\d{1,2},?\\s+20\\d{2}\\b|\\b\\d{1,2}[./]\\d{1,2}[./]20\\d{2}\\b`, "gi");
// Diagnostic only (never a date source): where an undated page shows date-like text, so
// a firm-specific extractor can be added. Up to 3 short snippets.
export function dateProbe(html) {
  const h = String(html || "").replace(/\s+/g, " "), out = [];
  for (const m of h.matchAll(DATEISH)) { out.push(h.slice(Math.max(0, m.index - 70), m.index + m[0].length + 20)); if (out.length >= 3) break; }
  return out;
}
export function pageMeta(html, url, firmName = "") {
  const h = String(html || "");
  let title = attr(h, "property", "og:title") || attr(h, "name", "twitter:title") || meta(h, /<title[^>]*>([\s\S]*?)<\/title>/i);
  // Drop the site-name trailer ("… | Insights | Mayer Brown").
  if (title) title = title.replace(/\s+[|–—-]\s+(insights?|news|publications?|knowledge|perspectives|[^|]*\b(llp|law|lawyers|&|gottlieb|watkins|chance|linklaters|freshfields)\b[^|]*)(\s+[|–—-]\s+.*)?$/i, "").trim();
  // …and a trailing " | <firm name>" segment ("… | Travers Smith", "… | Slaughter and May").
  const fw = (String(firmName).match(/[A-Za-z]{4,}/) || [])[0];
  if (title && fw) title = title.replace(new RegExp(`(\\s+[|–—-]\\s+[^|–—]*\\b${fw}\\b[^|–—]*)+$`, "i"), "").trim();
  const description = attr(h, "property", "og:description") || attr(h, "name", "description");
  let date = null, dateSource = null;
  const tries = [
    ["article:published_time", attr(h, "property", "article:published_time")],
    ["datePublished", meta(h, /"datePublished"\s*:\s*"([^"]+)"/i)],
    ["itemprop datePublished", meta(h, /itemprop=["']datePublished["'][^>]*(?:content|datetime)=["']([^"']+)["']/i)],
    ["publishDate", meta(h, /"(?:publishDate|publishedDate|publicationDate|publish_date|published_date|releaseDate)"\s*:\s*"([^"]+)"/i)],
    ["publish-date meta", attr(h, "name", "(?:publish(?:ed)?[-_]?date|date|dc\\.date)")],
    ["<time datetime>", meta(h, /<time[^>]+datetime=["']([^"']+)["']/i)],
    ["url", (/\/(20\d{2})\/(\d{2})\/(\d{2})\//.exec(url) || []).slice(1).join("-")
      || ((m) => m ? `${m[3]}-${m[1]}-${m[2]}` : null)(/-(\d{2})-(\d{2})-(20\d{2})(?:[/?#.]|$)/.exec(url)) || null],   // …/slug-MM-DD-YYYY (K&L Gates)
  ];
  for (const [src, v] of tries) { const d = iso(v); if (d && d >= "2000-01-01") { date = d; dateSource = src; break; } }
  return { title, description, date, dateSource };
}

// ---- fetch ---------------------------------------------------------------------------
async function get(url, ms = 15000) {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, accept: "text/html,application/xml,text/xml,*/*" }, redirect: "follow", signal: AbortSignal.timeout(ms) });
    if (!r.ok) return null;
    return await r.text();
  } catch { return null; }
}
const normUrl = (u) => String(u || "").toLowerCase().replace(/^https?:\/\/(www\.)?/, "").split(/[?#]/)[0].replace(/\/+$/, "");

export async function collectFirm(id, domains, { since, max = 40, fetcher = get } = {}) {
  const stat = { domains, sitemaps: 0, urls: 0, kept: 0, fetched: 0, errors: 0 };
  const fname = ((LG.firms || []).find((f) => f.id === id) || {}).name || "";
  const known = new Set((LG.items || []).map((i) => normUrl(i.url)));
  const seenMaps = new Set(), cands = [];
  for (const d of domains) {
    const base = `https://${d}`;
    let maps = sitemapsFromRobots(await fetcher(`${base}/robots.txt`));
    if (!maps.length) maps = [`${base}/sitemap.xml`];
    // Expand indexes (depth ≤ 2), preferring child maps whose name hints at publications.
    const queue = maps.map((u) => [u, 0]);
    while (queue.length && seenMaps.size < 40) {
      const [u, depth] = queue.shift();
      if (seenMaps.has(u)) continue; seenMaps.add(u);
      const xml = await fetcher(u); if (!xml) { stat.errors++; continue; }
      stat.sitemaps++;
      const { index, urls } = parseSitemap(xml);
      if (index.length && depth < 2) {
        const pri = (x) => (/(news|insight|publication|deal|knowledge|article|post|blog|press|thinking)/i.test(x) ? 0 : 1);
        index.sort((a, b) => pri(a) - pri(b)).forEach((x) => queue.push([x, depth + 1]));
      }
      stat.urls += urls.length;
      for (const x of urls) if (wanted(x, since) && !known.has(normUrl(x.loc))) cands.push(x);
      if (!stat.samples) stat.samples = [];
      for (const x of urls) { if (stat.samples.length >= 6) break; if (!/\/(people|lawyers|professionals)\//i.test(x.loc)) stat.samples.push(x.loc + (x.lastmod ? " @" + x.lastmod : "")); }
    }
  }
  // Newest lastmod first; fetch each page's own metadata.
  const uniq = [...new Map(cands.map((c) => [normUrl(c.loc), c])).values()].sort((a, b) => String(b.lastmod || "").localeCompare(String(a.lastmod || ""))).slice(0, max);
  stat.kept = uniq.length;
  if (uniq.length) delete stat.samples;   // samples are a debugging aid for firms that yield nothing
  const items = [];
  for (const c of uniq) {
    const html = await fetcher(c.loc);
    if (!html) { stat.errors++; continue; }
    stat.fetched++;
    const m = pageMeta(html, c.loc, fname);
    if (!m.title) continue;
    if (m.date && m.date < since) continue;            // lastmod ≠ published: drop old pages re-touched
    if (m.date && m.date > new Date(Date.now() + DAY).toISOString().slice(0, 10)) continue;   // a future date = an event page, not a publication
    items.push({ firm: id, url: c.loc, title: m.title, description: m.description, date: m.date, dateSource: m.dateSource, lastmod: c.lastmod, ...(m.date ? {} : { dateProbe: dateProbe(html) }) });
    await new Promise((r) => setTimeout(r, 300));       // be polite: one firm, sequential pages
  }
  return { stat, items };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const since = parseSince(opt("--since", "14d"));
  const max = Math.max(1, parseInt(opt("--max", "40"), 10) || 40);
  const only = opt("--firm", "");
  const doms = firmDomains();
  const ids = Object.keys(doms).filter((id) => !only || id === only);
  const firms = {}, items = [];
  // A few firms at a time (different hosts); pages within a firm are sequential.
  const queue = [...ids];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const id = queue.shift();
      const r = await collectFirm(id, doms[id], { since, max });
      firms[id] = r.stat; items.push(...r.items);
    }
  }));
  items.sort((a, b) => String(b.date || b.lastmod || "").localeCompare(String(a.date || a.lastmod || "")));
  console.log(JSON.stringify({ generated: new Date().toISOString(), since, firms, items }, null, 1));
  const ok = Object.values(firms).filter((s) => s.sitemaps > 0).length;
  console.error(`firm news: ${items.length} items from ${ok}/${ids.length} firms with a readable sitemap (since ${since})`);
}
