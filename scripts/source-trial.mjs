// =============================================================================
// source-trial.mjs — would a candidate newswire source actually work in Wire?
// For each candidate it (1) fetches the feed (first URL that parses wins) with the
// Worker's own feedParse, and (2) opens up to 3 recent articles with the reading
// pane's own extractor (extractReadable), falling back to the Jina reader proxy the
// Worker uses for bot-shielded sites (proxyBlocks). A source PASSES when the feed is
// live (≥3 items, newest ≤30 days) and ≥2 of 3 sampled articles render in-pane.
//
// Runs in a GitHub Action (open internet; .github/workflows/source-trial.yml):
//   node scripts/source-trial.mjs > backfill/source-trial.json
// =============================================================================
import { feedParse, extractReadable, proxyBlocks } from "../src/index.js";

export const CANDIDATES = [
  { source: "European Central Bank", urls: ["https://www.ecb.europa.eu/rss/press.xml"] },
  { source: "Bank of Japan", urls: ["https://www.boj.or.jp/en/rss/whatsnew.xml"] },
  { source: "Bank of Canada", urls: ["https://www.bankofcanada.ca/content_type/press-releases/feed/", "https://www.bankofcanada.ca/feed/"] },
  { source: "Euronews Business", urls: ["https://www.euronews.com/rss?level=theme&name=business"] },
  { source: "The Guardian", urls: ["https://www.theguardian.com/uk/business/rss", "https://www.theguardian.com/business/rss"] },
  { source: "AltAssets", urls: ["https://altassets.net/feed", "https://www.altassets.net/feed"] },
  { source: "Law Society Gazette", urls: ["https://www.lawgazette.co.uk/rss", "https://www.lawgazette.co.uk/XmlServers/navsectionRSS.aspx?navsectioncode=0", "https://www.lawgazette.co.uk/news/rss"] },
  { source: "Above the Law", urls: ["https://abovethelaw.com/feed/"] },
];
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
async function get(url, ms = 20000) {
  try { const r = await fetch(url, { headers: { "user-agent": UA, accept: "*/*" }, redirect: "follow", signal: AbortSignal.timeout(ms) }); return { status: r.status, text: r.ok ? await r.text() : "" }; }
  catch (e) { return { status: 0, text: "", err: String(e.message || e).slice(0, 80) }; }
}
export function verdict({ items, newestDays, articles }) {
  const read = articles.filter((a) => a.inPane).length;
  return items >= 3 && newestDays != null && newestDays <= 30 && read >= Math.min(2, articles.length) && articles.length > 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = [];
  for (const c of CANDIDATES) {
    const rec = { source: c.source, feed: null, feedStatus: [], items: 0, newestDays: null, sample: [], articles: [] };
    for (const u of c.urls) {
      const r = await get(u);
      rec.feedStatus.push(`${r.status} ${u}`);
      const items = r.text ? feedParse(r.text, { source: c.source, region: "GEN" }) : [];
      if (items.length) {
        rec.feed = u; rec.items = items.length;
        const ts = items.map((x) => x.when ? x.when.getTime() : 0).filter(Boolean);
        rec.newestDays = ts.length ? Math.round((Date.now() - Math.max(...ts)) / 864e5) : null;
        rec.sample = items.slice(0, 5).map((x) => x.title);
        for (const it of items.slice(0, 3)) {
          const a = { url: it.url, direct: null, proxy: null, inPane: false };
          const d = await get(it.url);
          if (d.text) { try { const x = extractReadable(d.text, new URL(it.url)); a.direct = { accessible: !!x.accessible, paragraphs: (x.paragraphs || []).length }; } catch { a.direct = { error: true }; } }
          else a.direct = { status: d.status };
          if (!(a.direct && a.direct.accessible)) {
            const p = await get("https://r.jina.ai/" + it.url, 30000);
            const blocks = p.text ? proxyBlocks(p.text, it.url).filter((b) => b.t) : [];
            a.proxy = { status: p.status, paragraphs: blocks.length };
          }
          a.inPane = !!((a.direct && a.direct.accessible) || (a.proxy && a.proxy.paragraphs >= 3));
          rec.articles.push(a);
        }
        break;
      }
    }
    rec.pass = verdict(rec);
    out.push(rec);
    console.error(`${rec.pass ? "PASS" : "FAIL"}  ${c.source} — feed ${rec.feed ? "ok" : "none"} (${rec.items} items, newest ${rec.newestDays}d), in-pane ${rec.articles.filter((a) => a.inPane).length}/${rec.articles.length}`);
  }
  console.log(JSON.stringify({ generated: new Date().toISOString(), results: out }, null, 1));
}
