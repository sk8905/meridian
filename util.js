// =============================================================================
// util.js — tiny shared helpers used across the Wire modules. ONLY provably
// identical, dependency-free helpers live here; app-specific variants (the
// zero-padded credit fmtDate, macro's 1-indexed MONTHS, per-app source
// resolvers that close over app data) stay in their own modules. Imported
// site-absolute ("/util.js") tokenless, like every other shared root module
// (T1/T2) — never re-add a ?v= here or in an importer.
// =============================================================================

// HTML-escape (strict superset: also escapes ' — safe everywhere the looser
// per-app variants were used, since &#39; renders identically).
export const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Newest-first comparator for {date:"YYYY-MM-DD"} records (ISO strings compare
// lexicographically, so localeCompare is equivalent to <,> on well-formed data).
export const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || ""));

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// THE list/table date (HOUSE_STYLE R43b): "15 Oct 26" — day, short month, two-digit
// year — on every events row and table cell app-wide. A month-only value reads
// "Oct 2026", a quarter "Q3 2026"; anything unparseable passes through unchanged.
// Every per-surface formatter (credit/legal/macro fmtDate, feed fmtDateP, the
// Dashboard / hub isoDay) delegates here so the format can never drift.
export const fmtD = (d) => {
  const t = String(d == null ? "" : d).trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t);
  if (m) return `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1].slice(2)}`;
  m = /^(\d{4})-(\d{2})$/.exec(t); if (m) return `${MONTHS[+m[2] - 1]} ${m[1]}`;
  m = /^(\d{4})-Q([1-4])$/.exec(t); if (m) return `Q${m[2]} ${m[1]}`;
  if (/^\d{4}$/.test(t) || !/\d/.test(t) || /^(Q[1-4]|[A-Za-z]{3,9}\.?) \d{4}$/.test(t)) return t;
  const x = new Date(t);
  return Number.isNaN(+x) ? t : `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]} ${String(x.getUTCFullYear()).slice(2)}`;
};

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
  "costar.com": "CoStar", "spglobal.com": "S&P Global", "globalcapital.com": "GlobalCapital",
  "realassets.ipe.com": "IPE Real Assets", "ifre.com": "IFR", "alternativeswatch.com": "Alternatives Watch",
  "finsight.com": "Finsight", "abfjournal.com": "ABF Journal", "bebeez.eu": "BeBeez", "news.bloomberglaw.com": "Bloomberg Law",
  "mortgagesolutions.co.uk": "Mortgage Solutions", "commercialobserver.com": "Commercial Observer", "pitchbook.com": "PitchBook",
  "asreport.americanbanker.com": "Asset Securitization Report", "theintermediary.co.uk": "The Intermediary",
  "investegate.co.uk": "Investegate", "recapitalnews.com": "Real Estate Capital", "sec.gov": "SEC",
  "cbonds.com": "Cbonds", "jonesday.com": "Jones Day", "tradingview.com": "TradingView", "marketscreener.com": "MarketScreener",
  "bridgingandcommercial.co.uk": "Bridging & Commercial", "constructionenquirer.com": "The Construction Enquirer",
  "kirkland.com": "Kirkland & Ellis", "lw.com": "Latham & Watkins", "aoshearman.com": "A&O Shearman", "whitecase.com": "White & Case",
  "stblaw.com": "Simpson Thacher", "morganlewis.com": "Morgan Lewis", "hlc.com": "Hogan Lovells", "bakermckenzie.com": "Baker McKenzie",
  "ropesgray.com": "Ropes & Gray", "akingump.com": "Akin", "orrick.com": "Orrick", "dechert.com": "Dechert", "linklaters.com": "Linklaters",
  "addleshawgoddard.com": "Addleshaw Goddard", "hoganlovells.com": "Hogan Lovells", "willkie.com": "Willkie", "crenews.com": "Commercial Real Estate Direct",
  "bdcinvestor.com": "BDC Investor", "structuredcreditinvestor.com": "Structured Credit Investor", "secondariesinvestor.com": "Secondaries Investor",
  "hedgeweek.com": "Hedgeweek", "crowdfundinsider.com": "Crowdfund Insider", "theglobeandmail.com": "The Globe and Mail", "cityam.com": "City AM",
  "ionanalytics.com": "ION Analytics", "octus.com": "Octus", "kbra.com": "KBRA", "pulse2.com": "Pulse 2.0", "investing.com": "Investing.com",
  "creherald.com": "CRE Herald", "bisnow.com": "Bisnow", "benews.co.uk": "BE News", "clopremium.co.uk": "CLO Premium", "euroabs.com": "Euro ABS",
};
// Firm sites whose domain does not spell the firm's name.
const OWN_HOSTS = { "legalandgeneral.com": "l&g", "fwcap.com": "fitzwalter", "hig.com": "h.i.g.", "benefitstreetpartners.com": "bsp" };
// Is `host` the firm's OWN website (so a source there may be labelled with the firm's
// name)? Compares the host's registrable label with the firm's compacted name:
// "aresmgmt.com" ↔ "Ares Management", "ir.apollo.com" ↔ "Apollo Global Management",
// "leumiuk.com" ↔ "Bank Leumi (Leumi UK)". Any other host is an outlet — the Source
// label is then the outlet, never the firm (HOUSE_STYLE R39m).
const _GENERIC_FIRST = new Set(["capital", "global", "bank", "first", "new", "the", "private", "credit", "european", "asset", "investment", "north", "general"]);
export function isOwnSite(host, name) {
  if (!host || !name) return false;
  const parts = host.toLowerCase().split(".");
  while (parts.length > 2 && /^(co|com|org|net|ac|gov|ltd|plc)$/.test(parts[parts.length - 2])) parts.splice(parts.length - 2, 1);
  const sld = (parts[parts.length - 2] || "").replace(/[^a-z0-9]/g, "");
  if (sld.length < 2) return false;
  const reg = parts.slice(-2).join(".");
  if (OWN_HOSTS[reg] && String(name).toLowerCase().startsWith(OWN_HOSTS[reg])) return true;
  const nm = String(name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, "and");
  const compact = nm.replace(/[^a-z0-9]/g, "");
  const words = nm.match(/[a-z0-9]+/g) || [];
  const first = words[0] || "";
  const initials = words.filter((w) => w !== "and").map((w) => w[0]).join("");
  return compact.startsWith(sld) || (sld.length >= 5 && compact.includes(sld))
    || (first.length >= 3 && !_GENERIC_FIRST.has(first) && sld.startsWith(first))
    || (sld.length >= 2 && initials.length >= 2 && initials.startsWith(sld));
}
export const JUDGMENT_SOURCES = {
  "bailii.org": "BAILII", "caselaw.nationalarchives.gov.uk": "National Archives",
  "supremecourt.uk": "Supreme Court", "judiciary.uk": "Judiciary",
};
export const srcHost = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } };
export const tidyDomain = (host) => { const p = host.split("."); if (p.length > 2 && /^(co|com|org|net|ac|gov)$/.test(p[p.length - 2])) p.splice(p.length - 2, 1); const l = p.slice(-2, -1)[0] || host; return l ? l.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : ""; };
// The outlet a URL belongs to, for a list's source column (R43b): a known newsroom
// or judgment publisher by host, else the tidied domain ("Hayfin" for hayfin.com).
export const outletOf = (url) => {
  const h = srcHost(url); if (!h) return "";
  const k = Object.keys(NEWS_SOURCES).find((d) => h === d || h.endsWith("." + d)) || Object.keys(JUDGMENT_SOURCES).find((d) => h === d || h.endsWith("." + d));
  return k ? (NEWS_SOURCES[k] || JUDGMENT_SOURCES[k]) : tidyDomain(h);
};
// A source LABEL is only ever a source name, never a URL (owner 2026-10-20, HOUSE_STYLE
// R43b). If a stored name is missing or is itself a URL, fall back to the outlet name of
// the link (outletOf), so a raw URL can never be printed as the source.
export const srcLabel = (name, url) => {
  const n = String(name || "").trim();
  if (n && !/^(https?:\/\/|www\.)/i.test(n) && !/^[\w-]+(\.[\w-]+)+\/\S*/.test(n)) return n;
  return outletOf(url || n) || "source";
};

// Sync the browser-chrome theme-color meta tag to the resolved theme ("dark"/
// "light"). Shared by the desktop nav-bar theme toggle and the phone Menu
// view's segmented theme control — each owns its own theme-apply logic, but
// both must paint the same OS chrome colour.
export const setThemeColorMeta = (t) => {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t === "dark" ? "#05080f" : "#ffffff");
};

// Format a $bn AUM figure (the roster is USD — R29): $Xtn / $Xm / $Xbn.
// Shared by the Credit Managers table.
export const fmtAum = (n) => {
  if (n == null) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}tn`;
  if (n < 1) return `$${Math.round(n * 1000)}m`;
  return `$${n}bn`;
};

// R42b: a sideways-scrolling heading row shows its SELECTED chip — centred into view
// when the row first renders with it off-screen (a deep link to the 6th tab must not
// land with its label cut at the edge). Scrolls the row only, never the page.
export function revealSelected(row) {
  const on = row && row.querySelector(".is-on, [aria-current]");
  if (!on || row.scrollWidth <= row.clientWidth + 1) return;
  const nr = row.getBoundingClientRect(), cr = on.getBoundingClientRect();
  if (cr.left < nr.left || cr.right > nr.right) row.scrollLeft += (cr.left - nr.left) - (nr.width - cr.width) / 2;
}
