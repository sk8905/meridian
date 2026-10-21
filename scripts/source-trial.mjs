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
  // Round 2 (owner 2026-10-21 — fixed wire source set review): candidates for the News wire.
  { source: "BBC Business", urls: ["https://feeds.bbci.co.uk/news/business/rss.xml"] },
  { source: "Sky News Business", urls: ["https://feeds.skynews.com/feeds/rss/business.xml"] },
  { source: "City AM", urls: ["https://www.cityam.com/feed/"] },
  { source: "The Guardian Business", urls: ["https://www.theguardian.com/business/rss"] },
  { source: "Axios Markets", urls: ["https://api.axios.com/feed/markets", "https://api.axios.com/feed/"] },
  { source: "PE Hub", urls: ["https://www.pehub.com/feed/"] },
  { source: "Pensions & Investments", urls: ["https://www.pionline.com/rss/news", "https://www.pionline.com/arc/outboundfeeds/rss/"] },
  { source: "Markets Media", urls: ["https://www.marketsmedia.com/feed/"] },
  { source: "Liberty Street Economics (NY Fed)", urls: ["https://libertystreeteconomics.newyorkfed.org/feed/"] },
  { source: "Bank Underground (BoE)", urls: ["https://bankunderground.co.uk/feed/"] },
  { source: "BIS", urls: ["https://www.bis.org/doclist/all_speeches.rss", "https://www.bis.org/doclist/bis_fsi_publs.rss", "https://www.bis.org/list/press_releases/index.rss"] },
  { source: "IMF Blog", urls: ["https://www.imf.org/en/Blogs/rss", "https://www.imf.org/en/News/rss?language=eng"] },
  { source: "CEPR VoxEU", urls: ["https://cepr.org/rss/vox-content", "https://cepr.org/rss.xml"] },
  { source: "Calculated Risk", urls: ["https://www.calculatedriskblog.com/feeds/posts/default?alt=rss", "https://feeds.feedburner.com/CalculatedRisk"] },
  { source: "FCA", urls: ["https://www.fca.org.uk/news/rss.xml"] },
  { source: "SEC press releases", urls: ["https://www.sec.gov/news/pressreleases.rss"] },
  { source: "Financial Stability Board", urls: ["https://www.fsb.org/feed/", "https://www.fsb.org/rss/"] },
  { source: "Insolvency Service", urls: ["https://www.gov.uk/government/organisations/insolvency-service.atom"] },
  { source: "Law Society Gazette", urls: ["https://www.lawgazette.co.uk/XmlServers/navsectionRSS.aspx?navsectioncode=0", "https://www.lawgazette.co.uk/rss"] },
  { source: "RollOnFriday", urls: ["https://www.rollonfriday.com/rss.xml", "https://www.rollonfriday.com/feed"] },
  { source: "Apricitas Economics", urls: ["https://www.apricitas.io/feed"] },
  { source: "Financial News London", urls: ["https://www.fnlondon.com/rss", "https://www.fnlondon.com/feed"] },
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
