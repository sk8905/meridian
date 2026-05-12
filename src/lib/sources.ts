// Law firm and aggregator RSS/Atom feed sources.
//
// Each entry can list multiple candidate URLs. The fetcher tries them in order
// and uses the first one that returns items. This makes the app resilient to
// firms tweaking their URL paths.

export type FirmFeed = {
  firmName: string;
  feedUrls: string[];
  // If a feed mixes jurisdictions, set this so we filter to UK-relevant items.
  englandHints?: string[];
};

const UK_HINTS = ["UK", "United Kingdom", "England", "English law", "London", "FCA", "PRA", "HMRC", "HMT", "Companies Act"];

export const FEEDS: FirmFeed[] = [
  // ---------- Magic Circle (direct) ----------
  {
    firmName: "A&O Shearman",
    feedUrls: [
      "https://www.aoshearman.com/insights/rss",
      "https://www.aoshearman.com/en/insights/rss",
      "https://www.aoshearman.com/feed",
      "https://www.aoshearman.com/rss",
    ],
  },
  {
    firmName: "Clifford Chance",
    feedUrls: [
      "https://www.cliffordchance.com/insights/rss",
      "https://www.cliffordchance.com/feed",
      "https://www.cliffordchance.com/rss",
      "https://www.cliffordchance.com/content/cliffordchance/global/en/insights.rss.xml",
    ],
  },
  {
    firmName: "Freshfields",
    feedUrls: [
      "https://www.freshfields.com/insights/rss",
      "https://www.freshfields.com/en-gb/our-thinking/feed",
      "https://www.freshfields.com/feed",
      "https://www.freshfields.com/rss",
    ],
  },
  {
    firmName: "Linklaters",
    feedUrls: [
      "https://www.linklaters.com/insights/rss",
      "https://www.linklaters.com/en/rss/insights",
      "https://www.linklaters.com/feed",
      "https://www.linklaters.com/rss",
    ],
  },
  {
    firmName: "Slaughter and May",
    feedUrls: [
      "https://www.slaughterandmay.com/insights/rss",
    ],
  },

  // ---------- US Big Law with strong London / English-law practices (direct) ----------
  {
    firmName: "Latham & Watkins",
    feedUrls: ["https://www.lw.com/en/rss/insights", "https://www.lw.com/feeds/insights", "https://www.lw.com/feed"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Kirkland & Ellis",
    feedUrls: ["https://www.kirkland.com/feeds/publications", "https://www.kirkland.com/publications/rss", "https://www.kirkland.com/feed"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "White & Case",
    feedUrls: ["https://www.whitecase.com/feeds/insights", "https://www.whitecase.com/insight-rss", "https://www.whitecase.com/feed"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Weil Gotshal",
    feedUrls: ["https://www.weil.com/feeds/articles", "https://www.weil.com/feed/articles", "https://www.weil.com/articles/rss"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Skadden",
    feedUrls: ["https://www.skadden.com/feeds/insights"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Sidley Austin",
    feedUrls: ["https://www.sidley.com/en/insights/feed", "https://www.sidley.com/feeds/insights", "https://www.sidley.com/feed"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Davis Polk",
    feedUrls: ["https://www.davispolk.com/feeds/insights", "https://www.davispolk.com/feed/insights", "https://www.davispolk.com/insights/rss"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Sullivan & Cromwell",
    feedUrls: ["https://www.sullcrom.com/feeds/publications", "https://www.sullcrom.com/rss/publications", "https://www.sullcrom.com/publications/rss"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Simpson Thacher",
    feedUrls: ["https://www.stblaw.com/feeds/publications", "https://www.stblaw.com/rss/publications"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Paul Weiss",
    feedUrls: ["https://www.paulweiss.com/feeds/publications", "https://www.paulweiss.com/rss/publications"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Milbank",
    feedUrls: ["https://www.milbank.com/feeds/insights", "https://www.milbank.com/en/news/feed", "https://www.milbank.com/feed"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Cleary Gottlieb",
    feedUrls: ["https://www.clearygottlieb.com/feeds/insights", "https://www.clearygottlieb.com/news-and-insights/feed", "https://www.clearygottlieb.com/feed"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Hogan Lovells",
    feedUrls: ["https://www.hoganlovells.com/feeds/insights", "https://www.hoganlovells.com/en/feed/publications", "https://www.hoganlovells.com/insights/rss"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "Norton Rose Fulbright",
    feedUrls: ["https://www.nortonrosefulbright.com/en-gb/knowledge/feed", "https://www.nortonrosefulbright.com/feeds/knowledge", "https://www.nortonrosefulbright.com/insights/rss"],
  },

  // ---------- Silver Circle / UK specialists (direct) ----------
  {
    firmName: "Macfarlanes",
    feedUrls: ["https://www.macfarlanes.com/what-we-think/in-depth/rss", "https://www.macfarlanes.com/feeds/insights", "https://www.macfarlanes.com/insights/rss", "https://www.macfarlanes.com/feed"],
  },
  {
    firmName: "Travers Smith",
    feedUrls: ["https://www.traverssmith.com/knowledge/rss", "https://www.traverssmith.com/insights/rss", "https://www.traverssmith.com/feed"],
  },
  {
    firmName: "Ashurst",
    feedUrls: ["https://www.ashurst.com/en/insights/feed", "https://www.ashurst.com/insights/rss", "https://www.ashurst.com/feed"],
  },

  // ---------- Aggregator feeds (backstop coverage) ----------
  // JD Supra: free aggregator that republishes law-firm alerts. Public topic feeds.
  {
    firmName: "JD Supra — Banking & Finance",
    feedUrls: ["https://www.jdsupra.com/topics/banking-financial-services/rss/", "https://www.jdsupra.com/topics/banking/rss/"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "JD Supra — Bankruptcy & Restructuring",
    feedUrls: ["https://www.jdsupra.com/topics/bankruptcy/rss/", "https://www.jdsupra.com/topics/restructuring/rss/"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "JD Supra — M&A / Corporate",
    feedUrls: ["https://www.jdsupra.com/topics/mergers-acquisitions/rss/", "https://www.jdsupra.com/topics/corporate-governance/rss/"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "JD Supra — Investment Funds",
    feedUrls: ["https://www.jdsupra.com/topics/investment-funds/rss/", "https://www.jdsupra.com/topics/private-equity/rss/"],
    englandHints: UK_HINTS,
  },
  {
    firmName: "JD Supra — Tax",
    feedUrls: ["https://www.jdsupra.com/topics/tax/rss/", "https://www.jdsupra.com/topics/international-tax/rss/"],
    englandHints: UK_HINTS,
  },

  // Lexology: subscription product but has some public RSS endpoints.
  {
    firmName: "Lexology — UK",
    feedUrls: ["https://www.lexology.com/jurisdictions/united-kingdom/rss", "https://www.lexology.com/library/feed.aspx?j=united-kingdom"],
  },

  // Mondaq: free aggregator of firm articles with public RSS.
  {
    firmName: "Mondaq — UK",
    feedUrls: ["https://www.mondaq.com/UK/Article/RSS", "https://www.mondaq.com/uk/rss", "https://www.mondaq.com/UK/RSS"],
  },
];
