// Firm-site collector (scripts/collect-firm-news.mjs) — offline, with a fake fetcher
// standing in for the firm's site. It must: find sitemaps via robots.txt, expand a
// sitemap index, keep only in-scope publication URLs inside the window that Wire
// does not hold, and capture each page's OWN title / description / published date.
import { collectFirm, parseSitemap, pageMeta, wanted, firmDomains, parseSince, dateProbe } from "../scripts/collect-firm-news.mjs";
import { items } from "../legal/js/data.js";
import { check, checkEq, finish } from "./lib.mjs";

const known = items.find((i) => i.firm === "latham" && /^https:\/\/www\.lw\.com\//.test(i.url || ""));
const site = {
  "https://www.lw.com/robots.txt": "User-agent: *\nSitemap: https://www.lw.com/sitemap-index.xml\n",
  "https://www.lw.com/sitemap-index.xml": `<sitemapindex><sitemap><loc>https://www.lw.com/sitemap-people.xml</loc></sitemap><sitemap><loc>https://www.lw.com/sitemap-news.xml</loc></sitemap></sitemapindex>`,
  "https://www.lw.com/sitemap-people.xml": `<urlset><url><loc>https://www.lw.com/en/people/jane-doe</loc><lastmod>2026-10-10</lastmod></url></urlset>`,
  "https://www.lw.com/sitemap-news.xml": `<urlset>
    <url><loc>https://www.lw.com/en/news/latham-advises-acme-on-500m-refinancing</loc><lastmod>2026-10-11</lastmod></url>
    <url><loc>https://www.lw.com/en/news/latham-sponsors-charity-run</loc><lastmod>2026-10-11</lastmod></url>
    <url><loc>https://www.lw.com/en/news/latham-advises-beta-fund-on-final-close</loc><lastmod>2025-01-02</lastmod></url>
    ${known ? `<url><loc>${known.url}</loc><lastmod>2026-10-12</lastmod></url>` : ""}
  </urlset>`,
  "https://www.lw.com/en/news/latham-advises-acme-on-500m-refinancing": `<html><head>
    <meta property="og:title" content="Latham &amp; Watkins Advises Acme on US$500 Million Refinancing">
    <meta name="description" content="Latham advised Acme on its refinancing.">
    <meta property="article:published_time" content="2026-10-09T08:00:00Z"></head></html>`,
};
const fetcher = async (u) => site[u] || null;
const r = await collectFirm("latham", ["www.lw.com"], { since: "2026-10-01", max: 10, fetcher });
checkEq(r.items.length, 1, `exactly one in-scope, in-window, unknown article is kept (${r.items.map((x) => x.url).join(", ")})`);
const it = r.items[0] || {};
check(it.title === "Latham & Watkins Advises Acme on US$500 Million Refinancing", "the page's own og:title is captured (entities decoded)");
check(it.date === "2026-10-09" && it.dateSource === "article:published_time", "the page's own published date is captured, with where it came from");
check(it.description === "Latham advised Acme on its refinancing.", "the page's own description is captured");
check(r.stat.sitemaps === 3, `robots.txt → sitemap index → child sitemaps are all read (${r.stat.sitemaps})`);

// Unit pieces.
checkEq(parseSitemap(site["https://www.lw.com/sitemap-index.xml"]).index.length, 2, "sitemap index parsed");
check(!wanted({ loc: "https://x.com/en/people/a-finance-lawyer", lastmod: "2026-10-10" }, "2026-10-01"), "non-publication paths (people pages) are skipped");
check(!wanted({ loc: "https://x.com/en/news/office-party", lastmod: "2026-10-10" }, "2026-10-01"), "out-of-scope slugs are skipped");
check(pageMeta('<script type="application/ld+json">{"datePublished":"2024-03-05T10:00:00"}</script><title>T</title>', "u").date === "2024-03-05", "JSON-LD datePublished is read");
check(pageMeta("<title>T</title>", "https://f.com/news/2023/07/14/x").date === "2023-07-14", "a full date in the URL is the last resort");
check(pageMeta("<title>Travers Smith&#x27;s view &#x2013; funds | Travers Smith</title>", "u", "Travers Smith LLP").title === "Travers Smith’s view – funds".replace("’", "'"), "numeric entities are decoded and the \"| <firm>\" title suffix is dropped");
check(pageMeta("<title>T</title>", "https://www.klgates.com/thought-leadership/CSSF-FAQ-10-12-2026").date === "2026-10-12", "a slug-end MM-DD-YYYY date in the URL is read");
check(pageMeta("<title>T</title>", "https://a.com/news/x-13-45-2026").date === null, "an impossible URL date is rejected");
check(!wanted({ loc: "https://x.com/en/download/blogs/finance-note.pdf", lastmod: "2026-10-10" }, "2026-10-01"), "PDF downloads are skipped");
check(dateProbe("<p class=d>Published 13 October 2026</p>")[0].includes("13 October 2026"), "undated pages carry a date-text probe for diagnosis");
const doms = firmDomains();
check((doms.latham || []).includes("www.lw.com") && (doms.proskauerrose || []).length > 0, "every tracked firm resolves to its own site domain(s)");
check(parseSince("2020-01-01") === "2020-01-01" && /^\d{4}-\d{2}-\d{2}$/.test(parseSince("14d")), "window parses as a date or N days");
finish();
