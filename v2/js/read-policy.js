// =============================================================================
// v2/js/read-policy.js — which sources can be READ inside Wire (one list, shared by
// the Home reading pane and the app-wide reader overlay, v2/js/reader-overlay.js).
// Kept in step with the Worker's READ_PAYWALL set.
//   paywalled  — subscriber login: never fetched; preview + external link
//   linksOut   — openly published but bot-walls the reader (Reuters …): external link
//   unreadable — a file the reader can't render (PDF, spreadsheet, archive)
// =============================================================================
export const PAYWALL_SRC = /financial times|bloomberg|wall street journal|\bwsj\b|economist|new york times|\bnyt\b|barron|business insider|the times|telegraph|nikkei|forbes|washington post|the information|seeking alpha/i;
export const PAYWALL_HOST = /(?:^|\/\/|\.)(?:ft|bloomberg|wsj|economist|nytimes|barrons|businessinsider|thetimes|telegraph|nikkei|forbes|washingtonpost|theinformation|seekingalpha)\.[a-z]/i;
export const LINKOUT_SRC = /\breuters\b/i;
export const LINKOUT_HOST = /(?:^|\/\/|\.)reuters\.[a-z]/i;
export const FILE_URL = /\.(pdf|xlsx?|csv|zip|docx?|pptx?)(?:$|[?#])/i;
export const isPaywalledSrc = (src, href) => PAYWALL_SRC.test(src || "") || PAYWALL_HOST.test(href || "");
export const linksOutSrc = (src, href) => LINKOUT_SRC.test(src || "") || LINKOUT_HOST.test(href || "");
export const unreadableFile = (href) => FILE_URL.test(href || "");
