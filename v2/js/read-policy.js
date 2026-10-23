// =============================================================================
// v2/js/read-policy.js — which sources can be READ inside Wire (one list, shared by
// the Home reading pane and the app-wide reader overlay, v2/js/reader-overlay.js).
// Kept in step with the Worker's READ_PAYWALL set.
//   subscribed — the owner's own subscriptions (FT/Bloomberg/WSJ/Economist): read in-pane
//   paywalled  — other subscriber logins: never fetched; preview + external link
//   linksOut   — openly published but bot-walls the reader (Reuters …): external link
//   unreadable — a file the reader can't render (PDF, spreadsheet, archive)
// =============================================================================
export const PAYWALL_SRC = /financial times|bloomberg|wall street journal|\bwsj\b|economist|new york times|\bnyt\b|barron|business insider|the times|telegraph|nikkei|forbes|washington post|the information|seeking alpha/i;
export const PAYWALL_HOST = /(?:^|\/\/|\.)(?:ft|bloomberg|wsj|economist|nytimes|barrons|businessinsider|thetimes|telegraph|nikkei|forbes|washingtonpost|theinformation|seekingalpha)\.[a-z]/i;
export const LINKOUT_SRC = /\breuters\b/i;
export const LINKOUT_HOST = /(?:^|\/\/|\.)reuters\.[a-z]/i;
export const FILE_URL = /\.(pdf|xlsx?|csv|zip|docx?|pptx?)(?:$|[?#])/i;
// The owner's own paid subscriptions (owner 2026-10-23) — FT, Bloomberg, WSJ, The
// Economist, Financial News. Not "paywalled" here: their rows open in the pane, and the Worker's
// subscriber reader (handleSubscriberRead) serves a newsletter issue that links the story,
// the owner's own logged-in read, or the standfirst + an "Open in the app" link.
export const SUBSCRIBED_SRC = /financial times|^ft$|ft alphaville|bloomberg|wall street journal|\bwsj\b|economist|^financial news$/i;
export const SUBSCRIBED_HOST = /(?:^|\/\/|\.)(?:ft|bloomberg|wsj|economist|fnlondon)\.com(?:[/:?#]|$)/i;
const _hostOf = (href) => { try { return new URL(href).hostname; } catch { return ""; } };
export const isSubscribedSrc = (src, href) => {
  const h = _hostOf(href || "");
  if (h && !/(?:^|\.)news\.google\.com$/i.test(h)) return SUBSCRIBED_HOST.test(h);   // a link decides by where it points (an undecoded Google News link by its source)
  return SUBSCRIBED_SRC.test(String(src || "").trim());
};
// The app a subscribed story opens in ("Open in the FT app").
export const subscribedApp = (src, href) => {
  const t = (_hostOf(href || "") + " " + (src || "")).toLowerCase();
  if (/fnlondon\.com|financial news/.test(t)) return "Financial News";
  return /(?:^|\.)ft\.com|financial times|\bft\b/.test(t) ? "FT" : /bloomberg/.test(t) ? "Bloomberg" : /wsj|wall street/.test(t) ? "WSJ" : /economist/.test(t) ? "Economist" : "";
};
export const isPaywalledSrc = (src, href) => !isSubscribedSrc(src, href) && (PAYWALL_SRC.test(src || "") || PAYWALL_HOST.test(href || ""));
export const linksOutSrc = (src, href) => LINKOUT_SRC.test(src || "") || LINKOUT_HOST.test(href || "");
export const unreadableFile = (href) => FILE_URL.test(href || "");
