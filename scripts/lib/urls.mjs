// urls.mjs — shared URL hygiene for the collectors and normalise-data.mjs.
// A firm sitemap sometimes lists a page with its TITLE as the path ("/2026/10/The Growth
// Rocketship …", Latham 2026-10); the same page's own canonical is the lower-case hyphen
// slug. slugUrl() turns the first into the second; a clean URL is returned unchanged.
export function slugUrl(u) {
  if (!/\s|%20/.test(String(u || ""))) return u;
  const m = String(u).match(/^(https?:\/\/[^/]+)(\/.*)$/); if (!m) return u;
  const segs = m[2].replace(/%20/g, " ").split("/");
  const last = segs.pop().toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9\s-]+/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
  return m[1] + [...segs, last].join("/");
}
// Identity key for "already held?" checks: scheme/www/query/trailing-slash/case blind,
// and a title-path URL keys the same as its slug.
export const urlKey = (u) => String(slugUrl(u) || "").toLowerCase().replace(/^https?:\/\/(www\.)?/, "").split(/[?#]/)[0].replace(/\/+$/, "");
