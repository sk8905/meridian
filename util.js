// =============================================================================
// util.js — tiny shared helpers used across the Wire modules. ONLY provably
// identical, dependency-free helpers live here; app-specific variants (the
// zero-padded credit fmtDate, macro's 1-indexed MONTHS, per-app source
// resolvers that close over app data) stay in their own modules. Imported
// site-absolute ("/util.js?v=…") with the same cache-token discipline as every
// other module — bump the token in EVERY importer when this file changes.
// =============================================================================

// HTML-escape (strict superset: also escapes ' — safe everywhere the looser
// per-app variants were used, since &#39; renders identically).
export const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Newest-first comparator for {date:"YYYY-MM-DD"} records (ISO strings compare
// lexicographically, so localeCompare is equivalent to <,> on well-formed data).
export const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || ""));

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ---- Source labels ----------------------------------------------------------
// Known newsrooms/wires by host (credit wires + the Home feed) and judgment
// publishers (legal case law), plus the host helpers that consume them.
// Previously three byte-identical copies (glance.js / saved.js / credit app).
export const NEWS_SOURCES = {
  "bloomberg.com": "Bloomberg", "reuters.com": "Reuters", "ft.com": "Financial Times",
  "wsj.com": "WSJ", "cnbc.com": "CNBC", "marketwatch.com": "MarketWatch",
  "creditflux.com": "Creditflux", "alternativecreditinvestor.com": "Alternative Credit Investor",
  "privatedebtinvestor.com": "Private Debt Investor", "privateequitywire.co.uk": "Private Equity Wire",
  "privateequityinternational.com": "Private Equity International", "penews.com": "Private Equity News",
  "pehub.com": "PE Hub", "with-intelligence.com": "With Intelligence", "fnlondon.com": "Financial News",
  "globenewswire.com": "GlobeNewswire", "businesswire.com": "Business Wire", "prnewswire.com": "PR Newswire",
  "finance.yahoo.com": "Yahoo Finance", "fintech.global": "FinTech Global", "citywire.com": "Citywire",
};
export const JUDGMENT_SOURCES = {
  "bailii.org": "BAILII", "caselaw.nationalarchives.gov.uk": "National Archives",
  "supremecourt.uk": "Supreme Court", "judiciary.uk": "Judiciary",
};
export const srcHost = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } };
export const tidyDomain = (host) => { const l = host.split(".").slice(-2, -1)[0] || host; return l ? l.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : ""; };
