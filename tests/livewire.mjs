// Every page ingests the SAME live cross-desk wire (/api/feed) with the SAME
// desk labels (feed.js liveDesk/deskFor): a TradingEconomics story reads MAC, a
// Bloomberg story BBG, an Economist story ECON, a plain WSJ story NEWS — on
// Home AND on each app dashboard (fold added via feed.js onLiveWire).
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
const WANT = { "United States GDP": "MAC", "WSJ Exclusive": "NEWS", "Global Markets Digest": "BBG", "Why Widgets": "ECON" };
for (const page of ["/", "/macro/", "/credit/", "/legal/"]) {
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${port}${page}`);
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.waitForTimeout(2500);
  const got = await pg.evaluate(() => [...document.querySelectorAll(".g-feed-row")].map((r) => ({
    code: (r.querySelector(".g-feed-code")?.textContent || "").trim(),
    title: (r.querySelector(".g-feed-title")?.textContent || "").trim(),
  })));
  for (const [frag, code] of Object.entries(WANT)) {
    const row = got.find((x) => x.title.includes(frag));
    check(!!row && row.code === code, `${page}: "${frag}" carries ${code}${row ? ` (got ${row.code})` : " (row missing)"}`);
  }
  checkErrs(errs, page);
  await ctx.close();
}
await b.close(); srv.close();
finish();
