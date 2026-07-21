// Desk-scoped live wire: Home shows the WHOLE cross-desk stream with shared
// labels (MAC/BBG/ECON/NEWS via feed.js liveDesk); each app's All tab shows
// ONLY its own desk — Macro folds in just the strictly-macro (MAC) live
// stories, Credit and Legal fold in none (their All is their curated desk
// content; the live stream carries no CRD/LEX stories).
import { launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json", ".png": "image/png" };
const feed = { asOf: new Date().toISOString(), items: [
  { title: "United States GDP Growth Rate Revised Higher", url: "https://tradingeconomics.com/us/gdp", source: "TradingEconomics", region: "GEN", date: "2026-07-21", time: "13:30" },
  { title: "WSJ Exclusive: Big Banks Brace For New Capital Rules", url: "https://www.wsj.com/x1", source: "The Wall Street Journal", region: "US", date: "2026-07-21", time: "11:10" },
  { title: "Global Markets Digest A Quiet Session", url: "https://www.bloomberg.com/x2", source: "Bloomberg", region: "GEN", date: "2026-07-21", time: "10:00" },
  { title: "Why Widgets Are Suddenly Everywhere", url: "https://www.economist.com/x3", source: "The Economist", region: "GEN", date: "2026-07-21", time: "09:00" },
]};
// Bespoke server (not lib.serve) so /api/feed returns EXACTLY these four items.
const srv = http.createServer((q, r) => {
  let p = q.url.split("?")[0];
  if (p === "/api/me") { r.writeHead(200, { "content-type": "application/json" }); return r.end('{"email":"t@w"}'); }
  if (p === "/api/feed") { r.writeHead(200, { "content-type": "application/json" }); return r.end(JSON.stringify(feed)); }
  if (p.startsWith("/api/")) { r.writeHead(200, { "content-type": "application/json" }); return r.end("{}"); }
  if (p === "/") p = "/index.html";
  if (/^\/(macro|credit|legal|menu)\/?$/.test(p)) p = p.replace(/\/?$/, "") + "/index.html";
  const fp = path.join(ROOT, p);
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) { r.writeHead(200, { "content-type": MIME[path.extname(fp)] || "text/plain" }); fs.createReadStream(fp).pipe(r); }
  else { r.writeHead(404); r.end("x"); }
});
await new Promise((res) => srv.listen(0, res));
const port = srv.address().port;
const b = await launchChromium();

const rows = (pg) => pg.evaluate(() => [...document.querySelectorAll(".g-feed-row")].map((r) => ({
  code: (r.querySelector(".g-feed-code")?.textContent || "").trim(),
  title: (r.querySelector(".g-feed-title")?.textContent || "").trim(),
})));
const openPage = async (page) => {
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${port}${page}`);
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.waitForTimeout(2500);
  return { ctx, pg, errs };
};

// Home: ALL four live stories, shared desk labels.
{
  const { ctx, pg, errs } = await openPage("/");
  const got = await rows(pg);
  for (const [frag, code] of Object.entries({ "United States GDP": "MAC", "WSJ Exclusive": "NEWS", "Global Markets Digest": "BBG", "Why Widgets": "ECON" })) {
    const row = got.find((x) => x.title.includes(frag));
    check(!!row && row.code === code, `/: "${frag}" carries ${code}${row ? ` (got ${row.code})` : " (row missing)"}`);
  }
  checkErrs(errs, "/");
  await ctx.close();
}
// Macro: ONLY the strictly-macro live story joins; the BBG/ECON/NEWS ones don't.
{
  const { ctx, pg, errs } = await openPage("/macro/");
  const got = await rows(pg);
  const mac = got.find((x) => x.title.includes("United States GDP"));
  check(!!mac && mac.code === "MAC", `/macro/: strictly-macro live story present as MAC${mac ? ` (got ${mac.code})` : " (missing)"}`);
  for (const frag of ["WSJ Exclusive", "Global Markets Digest", "Why Widgets"]) {
    check(!got.some((x) => x.title.includes(frag)), `/macro/: non-macro live story "${frag}" is NOT folded in`);
  }
  checkErrs(errs, "/macro/");
  await ctx.close();
}
// Credit + Legal: NO live stories fold in — All is the desk's own content.
for (const page of ["/credit/", "/legal/"]) {
  const { ctx, pg, errs } = await openPage(page);
  const got = await rows(pg);
  for (const frag of ["United States GDP", "WSJ Exclusive", "Global Markets Digest", "Why Widgets"]) {
    check(!got.some((x) => x.title.includes(frag)), `${page}: live story "${frag}" is NOT folded in`);
  }
  check(got.length > 0, `${page}: the desk's own curated wire still renders (${got.length} rows)`);
  checkErrs(errs, page);
  await ctx.close();
}
await b.close(); srv.close();
finish();
